# Python3

import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup as soup

LINK: str = "https://www.pgatour.com/tournaments/2023/masters-tournament/R2023014"

def get_page_source() -> str:
    chrome_options = Options()
    chrome_options.add_argument("--headless") 
    service = Service("/usr/local/bin/chromedriver") 
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.get(LINK)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "table")))
    page_source = driver.page_source
    driver.quit()
    
    return page_source

def get_page() -> str: 
    response: requests.Response = requests.get(LINK)
    if response.status_code < 300 and response.status_code >= 200:
        # then good
        return response.content
    
def get_table(content: str) -> list: 
    html = soup(content, "html.parser")
    table = html.find("table")

    if table:
        rows = table.find_all("tr")
        data = []
        for row in rows:
            cols = row.find_all(["th", "td"])
            cols = [col.text.strip() for col in cols]
            if len(cols) == 10 and not cols[0] == 'CUT' and not cols[0] == 'WD' and not cols[0] == 'Pos':
                player = {}
                player['name'] =  cols[2]
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
    


page_content = get_page_source()
if page_content:
    table_data = get_table(page_content)
    for row in table_data:
        print(row)
else:
    print("Failed to fetch page content.")