import base64
import json
import os
import re
import time
import requests
import hashlib
import uuid
import sys
import time
import logging
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.common.exceptions import WebDriverException, NoSuchDriverException
from selenium.webdriver.remote.remote_connection import LOGGER

extension_id = 'ilehaonighjijnmpnagapkhpcdbhclfg'
CRX_URL = "https://clients2.google.com/service/update2/crx?response=redirect&prodversion=98.0.4758.102&acceptformat=crx2,crx3&x=id%3D~~~~%26uc&nacl_arch=x86-64"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"

try:
    USER_ID = os.environ['USER_ID']
except KeyError:
    print('[❌] Error: Please set USER_ID environment variable!')
    exit()

ALLOW_DEBUG = os.environ.get('ALLOW_DEBUG', 'False').lower() == 'true'

if ALLOW_DEBUG:
    print('[✅] Debugging is enabled! Screenshots and console logs will be generated on error.')
    # Set Selenium's log level to DEBUG
    LOGGER.setLevel(logging.DEBUG)

    # Configure logging to output to a file
    logging.basicConfig(filename='selenium.log', level=logging.DEBUG)

def download_extension(extension_id):
    url = CRX_URL.replace("~~~~", extension_id)
    headers = {"User-Agent": USER_AGENT}
    r = requests.get(url, stream=True, headers=headers)
    with open("grass.crx", "wb") as fd:
        for chunk in r.iter_content(chunk_size=128):
            fd.write(chunk)

    if ALLOW_DEBUG:
        md5 = hashlib.md5(open('grass.crx', 'rb').read()).hexdigest()
        print(f'[✅] Extension downloaded. MD5: {md5}')

def generate_error_report(driver):
    print('[❗] Error report generated! Provide the above information to the developer for debugging purposes.')

print('[✅] Downloading extension...')
download_extension(extension_id)
print('[✅] Extension downloaded. Running chrome...')
options = webdriver.ChromeOptions()
# https://stackoverflow.com/questions/53657215/how-to-run-headless-chrome-with-selenium-in-python#53657649
options.add_argument("--headless=new") # musi byt =new pre Chrome >= 109
options.add_argument("--disable-dev-shm-usage")
options.add_argument('--no-sandbox')
options.add_argument('--disable-web-security')
options.add_argument('--disable-popup-blocking')  # Add this line
options.add_argument('--disable-gpu')  # Add this line
options.add_extension('grass.crx')

try: 
    driver = webdriver.Chrome(options=options)
except: 
    print('Could not start with Manager! Starting manually.')
    try:
        options.binary_location = '/usr/bin/chromium-browser'

        driver_path = "/usr/bin/chromedriver"
        service = ChromeService(executable_path=driver_path)
        driver = webdriver.Chrome(service=service, options=options)
        print('[✅] WebDriver started successfully with manual path!')
    except (WebDriverException, NoSuchDriverException) as e:
        print('[❌] Could not start with manual path! Exiting... More info: ', e)
        exit()

print('[✅] WebDriver started. Setting local storage values...')

# Navigate to the extension's index.html page
extension_url = f'chrome-extension://{extension_id}/index.html'

driver.get(extension_url)
browser_id = str(uuid.uuid4());
print(f'[✅] Navigating to extension URL: {extension_url}')

local_storage_data = {
    "wynd:user_id": USER_ID,
    "wynd:browser_id": browser_id,
    "wynd:authenticated": "true",
    "wynd:device": "null",
    "wynd:permissions": "true",
}

if "chrome-extension" in driver.current_url:
    print("Active page URL:", driver.current_url)

    # Convert local_storage_data to JSON string
    json_data = json.dumps(local_storage_data)

    # Execute JavaScript to set data in chrome.storage.local
    script = """
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'F12' }));

        chrome.storage.local.set(%s, function() {
            console.log('[✅] Local storage values set successfully.');
        });
    """ % json_data

    # Execute the script
    driver.execute_script(script)
else:
    # Get the reason for failure to load the extension page
    error_reason = driver.title if driver.title else "Unknown"
    print(f"[❌] Error: Failed to load extension page correctly! Reason: {error_reason}")
    generate_error_report(driver)
    driver.quit()
    exit()

script_get_data = "chrome.storage.local.get(null, function(items) { console.log('Data retrieved:', items); });"
driver.execute_script(script_get_data)

print('[✅] Extension is disconnected, waiting for connection!')
time.sleep(1)
driver.refresh()
loss_round = 0
start_time = time.time()
while True:
    # Get the full text of the page
    time.sleep(1)
    page_source = driver.page_source

    # Check if the page text contains the desired texts
    if "loss" in page_source:
        sys.stderr.write('[❗] Warning: Device connection loss...\n')
        loss_round+=1

    elif "Disconnected" in page_source:
        sys.stderr.write('[❗] Extension is disconnected! Waiting for connection...\n')
        loss_round+=1

    elif "Connected" in page_source:
        print('[✅] Extension is connected...')
        loss_round=0

    else:
        print('[❗] Warning: No Data...')

    # Sleep and refresh the page
    time.sleep(14)
    driver.refresh()

    if loss_round % 10 == 0 and loss_round != 0:
        print("[✅] Round: " + str(loss_round))
        now_time = time.time()
        final_time = now_time - start_time
        print(f"[✅] ({final_time}) if this will not work in 10 minutes, please try restarting (and do again same thing) THEN contacting support via issuses. Thank you. https://github.com/FungY911/better-grass/issues")
    if(loss_round>=50):
        logs = driver.get_log('browser')
        sys.stderr.write("Support Data (Copy Paste)\n" + "Browser ID: (After restart will be different)" + browser_id + "\n" + "User ID: " + USER_ID + "\nLOG: ")
        for log in logs:
            sys.stderr.write(log['message'])
        sys.stderr.write("\nEND OF LOGS")
        driver.quit()
        exit(1)
