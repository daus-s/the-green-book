''' 
SUNSCREEN
set profile pic : spfp -> spf
_________________________
takes a string to the file and adds to github with size check
does a particular commit and add 
stashes changes
uploads only profile picture
restages changes
'''


def validate(string): 
    import re
    pattern = r'\/users\\[a-zA-Z0-9_]+(?:\\[a-zA-Z0-9_]+)*\\[a-zA-Z0-9_]+\.(?:png|gif|jpg|jpeg|webp)'
    matches = re.search(pattern, string)
    if matches:
        print("Match found:", matches.group())
        return True
    else:
        print("No match found")
        return False


async def insertToSupabase(filepath: str, username: str):
    """
    Inserts path to profile picture into Supabase.

    Parameters:
    - filepath (str): The path to the file containing the data to be inserted.

    Returns:
    - success (set): https response from supabase
    """
    #validate(filepath)
    # fuck it
    
    try:
        from su import Su
        sb:Su = Su()
        return await sb.sb.from_('public_users').update({'pfp_url', filepath}).eq('username', username).execute()
    except Exception as e:
        if isinstance(e, sb.APIError):
            print("API Error:", e)
        elif isinstance(e, ImportError):
            print("Import Error:", e)
        else:
            print("An unexpected error occurred:", e)


def main():
    print('go go go')
    username: str = input('username: ')
    filepath: str = input('filepath:')
    insertToSupabase(filepath=filepath, username=username)
    
    
    

if __name__=='__main__':
    main()