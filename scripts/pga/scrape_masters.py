import os
import time
import numpy as np
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
_PATH = load_dotenv(".env") and os.getenv('CHROME_PATH')

_TITLES = ["masters", "pgachamps", "usopen", "theopen"]

_TOURNAMENTS = {
    ("masters",     2023): "https://www.pgatour.com/tournaments/2023/masters-tournament/R2023014",
    ("masters",     2024): "https://www.pgatour.com/tournaments/2024/masters-tournament/R2024014",
    ("pgachamps",   2024): "https://www.pgatour.com/tournaments/2024/pga-championship/R2024033",
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

            if len(cols) in [10, 11] and not cols[0] in ['CUT', 'WD', 'Pos']:
                player = {}
                player['name'] =  cols[2]
                try:
                    if 'F' in cols[4]:
                        thru = 18
                    else:
                        add = 0 
                        if '*' in cols[4]:
                            add = 9
                            cols[4].replace('*', '')
                        thru = (int(cols[4]) + add) % 19
                except ValueError:
                    thru = 0

                try:
                    curr = int(cols[5])
                except ValueError:
                    curr = 0
                player['thru'] = thru
                player['round'] = curr
                try:
                    rd1 = int(cols[6])
                except ValueError:
                    rd1 = 0
                player['rd1'] =  rd1

                try:
                    rd2 = int(cols[7])
                except ValueError:
                    rd2 = 0
                player['rd2'] =  rd2

                try:
                    rd3 = int(cols[8])
                except ValueError:
                    rd3 = 0
                player['rd3'] = rd3

                try:
                    rd4 = int(cols[9])
                except ValueError:
                    rd4 = 0
                player['rd4'] =  rd4

                player['strokes'] =  rd1 + rd2 + rd3 + rd4
                try:
                    player['total'] =  int(cols[3].replace('E', '0'))
                except ValueError:
                    player['total'] = 0
                data.append(player)
        return data
    else:
        return None
    

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
    for l in ls:
        print(l)
    results: InsertManyResult = table.insert_many(ls)
    if len(ls) == len(results.inserted_ids):
        return 201
    else:
        return 500

def get_meta(data, year, tournament):
    # circ = 0
    # adam = 0
    count = 0
    rd4 = 0
    rd3 = 0 
    rd2 = 0
    rd1 = 0
    for doc in data:
        #count golfers
        count += 1
        if doc['rd4'] != 0:
            if doc['thru'] == 18:
                rd4 += 1
        if doc['rd3'] != 0:
            if doc['thru'] == 18:
                rd3 += 1
        if doc['rd2'] != 0:
            if doc['thru'] == 18:
                rd2 += 1        
        if doc['rd1'] != 0:
            if doc['thru'] == 18:
                rd1 += 1
    print(tournament + ' ' + str(year))
    print('round 1: {}%'.format(int(100*rd1/count)))
    print('round 2: {}%'.format(int(100*rd2/count)))
    print('round 3: {}%'.format(int(100*rd3/count)))
    print('round 4: {}%'.format(int(100*rd4/count)))
    if (rd4 == count):
        print('TOURNAMENT COMPLETE')
        return 'finished'
    else:
        return 'ongoing'
            



def update_mongo(table: Collection, ls: list, year: int, tournament: str) -> int:
    try:
        sort_data(ls)
        append_metadata(ls, year, tournament)
        table: Collection = connect_mongo()
        data = table.find({"year": str(year), "tournament": tournament})
        for doc in data:
            table.update_one({year: year, tournament: tournament, index: doc['index']}, {"$set": doc})
        return 201
    except Exception:
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

def live(year, tournament):
    table: Collection = connect_mongo()
    
    inited = table.find_one({"year": year, "tournament": tournament}) is not None
    times = np.random.normal(loc=300,scale=30,size=1000)
    
    for wait in times:
        sts = True
        page_content = get_page_source(year, tournament)
        if page_content:
            table_data = get_table(page_content)
            if not inited:
                res = get_meta(table_data, year, tournament)
                if insert_mongo(table, table_data, year, tournament) == 500:
                    sts = False
                else:
                    sts = True
            else:
                res = get_meta(table_data, year, tournament)
                if update_mongo(table, table_data, year, tournament) == 500:
                    sts = False
                else:
                    sts = True
        else:
            sts = False
            inited = False
        print('success') if sts else print('failure')
        if res == 'ongoing':
            time.sleep(wait)
        else:
            break

def validate(year, tournament):
    #compare data across tables from betties and pga 
    pass

def insert(year: int, tournament: str, safe:bool=False):
    table: Collection = connect_mongo()
    page_content = get_page_source(year, tournament)
    if page_content:
        table_data = get_table(page_content)
        if insert_mongo(table, table_data, year, tournament) == 500 and not safe:
            delete_mongo(year, tournament)
            return False
        else:
            return True
    else:
        print("Failed to fetch page content.")
        return False

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
            except ValueError as v:
                print(f"Usage of the --delete flag requires an integer to create the specific year\
                      \nSyntax:\
                      \n\t· python scrape_masters.py --insert <tournament> <year>\
                      \nError: {args[3]} is not a valid integer. OR\
                      \nError: {args[2]} is not in the valid tournaments {_TITLES}.\
                      \ntype: {v}")
        if args[1] == "--index":
            try:
                year = int(args[3])
                if args[2] not in _TITLES:
                    raise ValueError("illegal title")
                tournament = args[2]
                index(year, tournament)
            except ValueError:
                print(f"Usage of the --delete flag requires an integer to index the specific year\
                      \nSyntax:\
                      \n\t· python scrape_masters.py --index <tournament> <year>\
                      \nError: {args[3]} is not a valid integer. OR\
                      \nError: {args[2]} is not in the valid tournaments {_TITLES}.")   
        if args[1] == "--live":
            try:
                year = int(args[3])
                if args[2] not in _TITLES:
                    raise ValueError("illegal title")
                tournament = args[2]
                live(year, tournament)
            except ValueError:
                print(f"Usage of the --delete flag requires an integer to set up live data for the specific year\
                      \nSyntax:\
                      \n\t· python scrape_masters.py --live <tournament> <year>\
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