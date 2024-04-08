import os
import datetime
from dotenv import load_dotenv
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup as soup
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo.collection import Collection
from pymongo.results import InsertManyResult
from pymongo.cursor import Cursor
from pymongo import ASCENDING, DESCENDING

# TODO: Change these
_LINK: str = "https://www.pgatour.com/tournaments/2023/masters-tournament/R2023014"
_YEAR: int = 2023 #datetime.datetime.now().year

def get_page_source() -> str:
    chrome_options = Options()
    chrome_options.add_argument("--headless") 
    service = Service("/usr/local/bin/chromedriver") 
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.get(_LINK)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "table")))
    page_source = driver.page_source
    driver.quit()
    
    return page_source

def get_page() -> bytes | None: 
    response: requests.Response = requests.get(_LINK)
    if response.status_code < 300 and response.status_code >= 200:
        return response.content
    else:
        return None
    
def get_table(content: str) -> list: 
    html = soup(content, "html.parser")
    table = html.find("table")

    if table:
        rows = table.find_all("tr")
        data = []
        for row in rows:
            cols = row.find_all(["th", "td"])
            cols = [col.text.strip() for col in cols]
            if len(cols) == 10 and not cols[0] in ['CUT', 'WD', 'Pos']:
                player = {}
                player['name'] =  cols[2]
                player['rd1'] =  int(cols[6].replace('E', '0'))
                player['rd2'] =  int(cols[7].replace('E', '0'))
                player['rd3'] =  int(cols[8].replace('E', '0'))
                player['rd4'] =  int(cols[9].replace('E', '0'))
                player['strokes'] =  int(cols[6].replace('E', '0')) + int(cols[7].replace('E', '0')) + int(cols[8].replace('E', '0')) + int(cols[9].replace('E', '0'))
                player['year'] = _YEAR
                player['total'] =  int(cols[3].replace('E', '0'))
                data.append(player)
        return data
    else:
        return []
    

def env():
    load_dotenv(".py.env")
    mongo_db_write_password = os.getenv("MONGO_WRITE_PWD")
    mongo_db_write_username= os.getenv("MONGO_WRITE_USR")
    return {'username': mongo_db_write_username, 'password': mongo_db_write_password}
       
def connect_mongo():
    write_creds: dict = env() #is a dict a subset of set
    uri: str = "mongodb+srv://{}:{}@cluster0.jthligq.mongodb.net/?retryWrites=true&w=majority".format(write_creds['username'], write_creds['password'])
    client: MongoClient = MongoClient(uri, server_api=ServerApi('1'))
    table = client['golf']['masters']
    
    return table

def insert_mongo(table: Collection, ls: list) -> int:
    results: InsertManyResult = table.insert_many(ls)
    if len(ls) == len(results.inserted_ids):
        return 201
    else:
        return 500
    

def index(key: str='name', asc: bool=True):
    table: Collection = connect_mongo()
    order = DESCENDING
    if asc:
        order = ASCENDING

    sorted_documents: Cursor = table.find().sort(key, order)
    for i in range(len(sorted_documents.distinct("_id"))):
        document = sorted_documents[i]
        table.update_one({"_id":document["_id"]}, {"$set": {"index": int(i%255)}})
    pass

def insert():
    table: Collection = connect_mongo()
    page_content = get_page_source()
    if page_content:
        table_data = get_table(page_content)
        if insert_mongo(table, table_data) == 500:
            delete_mongo(_YEAR)
    else:
        print("Failed to fetch page content.")

def delete_mongo(year: int):
    query: dict = {"year": {"$eq": year}}
    table: Collection = connect_mongo()
    table.delete_many(query)

def main(args: list): 
    if len(args) == 3:
        if args[1] == '--delete':
            try:
                year = int(args[2])
                delete_mongo(year)
            except ValueError:
                print(f"Usage of the --delete flag requires an integer to delete the specific year\nSyntax:\n\t· python scrape_masters.py --delete <year>\nError: {args[2]} is not a valid integer.\n")
    elif len(args) == 2:
        if args[1] == '--index':
            index()
        else: 
            print(f"Only --index is supported.\nSyntax:\n\t· python scrape_masters.py --index\n")

    elif len(args) == 1:
        insert()

if __name__=='__main__':
    import sys
    main(sys.argv)