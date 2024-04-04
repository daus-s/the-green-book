# Python3

from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup as soup

LINK: str = "https://www.pgatour.com/tournaments/2023/masters-tournament/R2023014"

def get_page_source() -> str:
    # Set up Selenium WebDriver
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode (without opening browser window)
    service = Service("path/to/chromedriver")  # Specify the path to chromedriver
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    # Load the page
    driver.get(LINK)
    
    # Wait for the page to load completely
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "table")))
    
    # Get the page source
    page_source = driver.page_source
    
    # Close the WebDriver
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
    print(table)

    if table:
        rows = table.find_all("tr")
        data = []
        for row in rows:
            cols = row.find_all(["th", "td"])  # Assuming data can be in either <th> or <td>
            cols = [col.text.strip() for col in cols]
            data.append(cols)
        return data
    else:
        return []
    


page_content = get_page_source()
if page_content:
    table_data = get_table(page_content)
    #print(table_data)
else:
    print("Failed to fetch page content.")