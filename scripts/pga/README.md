## PGA Scraping tool
#### Last update: 4/30/2024 8:57 AM
#### Daus Carmichael

### Overview

### Installation

#### Dependencies
- `selenium 4.15.2`
- `bs4 0.0.2`
- `pymongo 4.7.1`
- `requests 2.31.0`
- `python-dotenv 1.0.1`

*\*check with pip freeze*

### Functions
#### Calling 
`python scrape_masters.py --command <arg1> <arg2> ...`

#### Commands
##### --test
Syntax: `python scrape_masters.py --test`
args: None

Runs a test to check if the environment variables are accessible. Then checks the page source and checks if the table data is loaded. Prints the corresponding error that occurred.
Possible messages
- failed to procure username 
- failed to procure password
- failed to fetch pagesource
- failed to parse table
- failed to connect to mongoDB

#### --delete 
Syntax: `python scrape_masters.py --delete <tournament> <year>`
args: string tournament, int year

Removes from the MongoDB all entries with `_id`'s matching the pattern

regex: `^{year}_\d{{1,3}}_{tournament}`.

**Tournament Validity**: anywhere else you see <tournament> it is held to the same restriction that it must exist in the list
["masters", "pgachamps", "usopen", "theopen"]

#### --insert 
Syntax: `python scrape_masters.py --insert <tournament> <year>`
args: string tournament, int year

Scrapes the corresponding webpage from the `_TOURNAMENTS` object. Parses and inserts the data into the MongoDB. Creates with the _id field `str(year) + '_' + str(i+1) + '_' + tournament` after sorting on the total score.

regex: `^{year}_\d{{1,3}}_{tournament}`.

Notes: if this fails it is a good idea to run --test to find the base cause

#### --init 
Syntax: `python scrape_masters.py --init`
args: None

Runs the delete method and insert method for each tournament listed. This function can also be used as a sanitizer if the database is corrupted. **However,** this is expensive and could get you flagged for botting...

### Bugs
idk, probably some in there

### Future Developments
The parsing of the information should likely not be done with if-else statements. A map may be a better option but while use cases are still small it is fine.
