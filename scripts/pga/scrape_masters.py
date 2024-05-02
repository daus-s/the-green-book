import os
import datetime # type: ignore
from dotenv import load_dotenv # type: ignore
import requests # type: ignore
from selenium import webdriver # type: ignore
from selenium.webdriver.chrome.service import Service # type: ignore
from selenium.webdriver.chrome.options import Options # type: ignore
from selenium.webdriver.common.by import By # type: ignore
from selenium.common.exceptions import TimeoutException # type: ignore
from selenium.webdriver.support.ui import WebDriverWait # type: ignore
from selenium.webdriver.support import expected_conditions as EC # type: ignore
from bs4 import BeautifulSoup as soup # type: ignore
from pymongo.mongo_client import MongoClient # type: ignore
from pymongo.server_api import ServerApi # type: ignore
from pymongo.collection import Collection # type: ignore
from pymongo.results import InsertManyResult # type: ignore
from pymongo.cursor import Cursor # type: ignore
from pymongo import ASCENDING, DESCENDING # type: ignore

# TODO: Change these
_LINK: str = "https://www.pgatour.com/tournaments/2023/masters-tournament/R2023014"
_YEAR: int = 2023 #datetime.datetime.now().year
_PATH = load_dotenv(".env") and os.getenv('CHROME_PATH')

_TITLES = ["masters", "pgachamps", "usopen", "theopen"]

_TOURNAMENTS = {
    ("masters", 2023): "https://www.pgatour.com/tournaments/2023/masters-tournament/R2023014",
    ("masters", 2024): "https://www.pgatour.com/tournaments/2024/masters-tournament/R2024014",
    ("pga"    , 2024): "https://www.pgatour.com/tournaments/2024/pga-championship/R2024033",
}

strkey = ""

def get_link(year: int, tournament: str) -> str:
    global strkey
    strkey = str(year) + tournament
    return _TOURNAMENTS[(tournament, year)]

def get_page_source(year: int, tournament: str) -> str:
    try:
        chrome_options = Options()
        chrome_options.add_argument("--headless") 
        service = Service(_PATH) 
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.get(get_link(year, tournament))
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "table")))
        page_source = driver.page_source
        driver.quit()
        
        return page_source
    except TimeoutException:
        print('--table not found:\
              \n  you are likely looking at a tournament in the future or the past\
              \n  without a table implemented yet. Try later when it is closer to the\
              \n  tournament.')
        return None

def get_page() -> bytes | None: 
    response: requests.Response = requests.get(_LINK)
    if response.status_code < 300 and response.status_code >= 200:
        return response.content
    else:
        return None
    
def test(): 
    #getenv, gettable, getpagesource, connectmongo
    err_ms = ['failed to procure username', 'failed to procure password', 'failed to fetch pagesource', 'failed to parse table', 'failed to connect to mongoDB']
    try:
        i = 0
        assert env()['username'] is not None    
        i+=1
        assert env()['password'] is not None
        i+=1
        ps = get_page_source(2023, 'masters')
        assert len(ps) > 0
        i+=1
        assert get_table(ps) != []
        i+=1
        assert connect_mongo() is not None
        i+=1
    except AssertionError: 
        print('failed testing')
        print(err_ms[i])
        return False

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
                try:
                    thru = int(cols[4])
                except ValueError:
                    thru = 0

                try:
                    curr = int(cols[5])
                except ValueError:
                    curr = 0
                player['thru'] = thru
                player['round'] = curr
                player['rd1'] =  int(cols[6].replace('E', '0'))
                player['rd2'] =  int(cols[7].replace('E', '0'))
                player['rd3'] =  int(cols[8].replace('E', '0'))
                player['rd4'] =  int(cols[9].replace('E', '0'))
                player['strokes'] =  int(cols[6].replace('E', '0')) + int(cols[7].replace('E', '0')) + int(cols[8].replace('E', '0')) + int(cols[9].replace('E', '0'))
                player['total'] =  int(cols[3].replace('E', '0'))
                data.append(player)
        return data
    else:
        return []
    

def env():
    load_dotenv(".env")
    mongo_db_write_password = os.getenv("MONGO_WRITE_PWD")
    mongo_db_write_username= os.getenv("MONGO_WRITE_USR")
    return {'username': mongo_db_write_username, 'password': mongo_db_write_password}
       
def connect_mongo():
    write_creds: dict = env() #is a dict a subset of set
    uri: str = "mongodb+srv://{}:{}@cluster0.jthligq.mongodb.net/?retryWrites=true&w=majority".format(write_creds['username'], write_creds['password'])
    client: MongoClient = MongoClient(uri, server_api=ServerApi('1'))
    table = client['golf']['masters']
    
    return table

def insert_mongo(table: Collection, ls: list, year: int, tournament: str) -> int:
    sort_data(ls)
    append_metadata(ls, year, tournament)
    for row in ls:
        print(row)
    # for l in ls:
    #     print(l)
    results: InsertManyResult = table.insert_many(ls)
    if len(ls) == len(results.inserted_ids):
        return 201
    else:
        return 500
    
def sort_data(ls: list) :
    ls = sorted(ls, key=lambda k:k['name'])
    for i in range(len(ls)): # this where the schema gets fucked
        ls[i]['index'] = i
    
def append_metadata(ls: list, year: int, tournament: str):
    for l in ls:
        l['year'] = year
        l['tournament'] = tournament 


def index(year: int, tournament: str, key: str='name', asc: bool=True):
    # DONT USE DEPRECATE SOON PLS
    table: Collection = connect_mongo()
    order = DESCENDING
    if asc:
        order = ASCENDING

    sorted_documents: Cursor = table.find({"year": {"$eq": year}, "tournament": {"$eq": tournament}}).sort(key, order)
    print('sorted')
    for i in range(len(sorted_documents.distinct("_id"))):
        table.update_one({"_id": {"$eq": sorted_documents[i]['_id']}, "year": {"$eq": year}, "tournament": {"$eq": tournament}}, {"$set": {"index": i}})
    print('updated')

def insert(year: int, tournament: str):
    table: Collection = connect_mongo()
    page_content = get_page_source(year, tournament)
    if page_content:
        table_data = get_table(page_content)
        if insert_mongo(table, table_data, year, tournament) == 500:
            delete_mongo(year, tournament)
    else:
        print("Failed to fetch page content.")

def delete_mongo(year: int, tournament: str):
    # notes about this regex     
    '''
    This regex matches the pattern of ^int_int_string
    with restrictions on the string. 
    The string is checked against the list of valid strings before this.
    The second digit may not be longer than 3 digits and 
    must be an integer. this is done via [0-9] => {0,1,2,3,...9}
    the length is checked by the regex expression that is just a python set
    and thus it prints the same {1,3} prints as {1, 3}
    '''
    query: dict = {"year": {"$eq": year},
                   "tournament": {"$eq": tournament}
                   } 
    table: Collection = connect_mongo()
    table.delete_many(query)

def logDB(query={}):
    table = connect_mongo()
    #can add filtering here
    data = table.find(query)
    for document in data:
        print(document)
    #print('filters: ')

def init():
    for (tournament, year), link in _TOURNAMENTS.items():
        print(f'Tournament:{tournament} - {year}: {link}')
        delete_mongo(year, tournament)
        insert(year, tournament)


def cmdMongo(args): 
    if len(args) == 2:
        logDB()
    elif len(args) == 4:
        try:
            year = int(args[3])
            if not args[2] in _TITLES:
                raise Exception('illegal tournament name')
            logDB({"year": {"$eq": year}, "tournament": {"$eq": args[2]}})
        except Exception:
            print('illegal year argument')
             
def main(args: list): 
    # REDO THIS STRUCUTRE
    if  args[1] == "--mongo":
        cmdMongo(args)
    if len(args) == 4:
        if args[1] == '--delete':
            try:
                year = int(args[3])
                if args[2] not in _TITLES:
                    raise ValueError("illegal title")
                tournament = args[2]
                delete_mongo(year, tournament)
            except ValueError:
                print(f"Usage of the --delete flag requires an integer to delete the specific year\
                      \nSyntax:\
                      \n\t· python scrape_masters.py --delete <tournament> <year>\
                      \nError: {args[3]} is not a valid integer. OR\
                      \nError: {args[2]} is not in the valid tournaments {_TITLES}.")
        if args[1] == "--insert":
            try:
                year = int(args[3])
                if args[2] not in _TITLES:
                    raise ValueError("illegal title")
                tournament = args[2]
                insert(year, tournament)
            except ValueError:
                print(f"Usage of the --delete flag requires an integer to delete the specific year\
                      \nSyntax:\
                      \n\t· python scrape_masters.py --delete <tournament> <year>\
                      \nError: {args[3]} is not a valid integer. OR\
                      \nError: {args[2]} is not in the valid tournaments {_TITLES}.")
        if args[1] == "--index":
            try:
                year = int(args[3])
                if args[2] not in _TITLES:
                    raise ValueError("illegal title")
                tournament = args[2]
                index(year, tournament)
            except ValueError:
                print(f"Usage of the --delete flag requires an integer to delete the specific year\
                      \nSyntax:\
                      \n\t· python scrape_masters.py --delete <tournament> <year>\
                      \nError: {args[3]} is not a valid integer. OR\
                      \nError: {args[2]} is not in the valid tournaments {_TITLES}.")        
    elif len(args) == 2 or len(args)==3:
        if len(args)==2:
            if args[1] == '--index':
                index()
            elif args[1] == '--test':
                test()
            elif args[1] == '--init':
                init()
        elif args[1] == '--delete':
            print(f"Usage of the --delete flag requires an integer to delete the specific year\nSyntax:\n\t· python scrape_masters.py --delete <tournament> <year>")
        else: 
            print(f"Only --index, --init, --test, and --delete are supported.\nSyntax:\n\t· python scrape_masters.py --index\n")

if __name__=='__main__':
    import sys
    main(sys.argv)