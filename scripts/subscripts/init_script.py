import os
import random
import sys
from dotenv import load_dotenv
import supabase

# Supabase credentials (replace with your own)

def initialize_supabase():
    """
    Function to initialize Supabase client.
    """
    dotenv_path = os.path.join(os.path.dirname(__file__), "..\\..\\", ".env")
    print(dotenv_path)
    load_dotenv(dotenv_path)
    SUPABASE_URL = os.getenv("REACT_APP_SUPABASE_URL")
    SUPABASE_KEY = os.getenv("GOD_SUPABASE_KEY")
    return supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize Supabase client
sb = initialize_supabase()

def reset():
    sb = initialize_supabase()

ALNUM = list('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-=_+[]\{\}\\|;:,<>./?\'\"')


def rnd_pwd():
    string = ""
    for i in range(64):
        string += random.choice(ALNUM)
    return string

def get_input():
    """
    Function to get input from the user.
    """
    password = input("Enter your password: ")
    return password

#CONSTANTS

DEMO_V = { 'email': 'demo@betties.app',
           'username' : 'demo',     # Get input (password)
           'password': get_input(), # this is the one the user will input
           'name': 'User!',

        }
DEMO_1 = { 'email': 'd1@betties.app',
           'username' : 'demo1',
           'password' : rnd_pwd(),
           'name': 'bot'
        }
DEMO_2 = { 'email': 'd2@betties.app',
           'username' : 'demo2',
           'password' : rnd_pwd(),
           'name': 'fake'
        }
DEMO_3 = { 'email': 'd3@betties.app',
           'username' : 'demo3',
           'password' : rnd_pwd(),
           'name': 'figment of the computers imagination'
        }


# randomly create from an index
# this will trigger necesary wallet and data triggers in supa
# 0 is success
def create_npc(demo: dict):
    print(demo)
    res =  sb.auth.sign_up({'email': demo['email'], 'password': demo['password']})
    demo.update({'userID': res.user.id})
    del demo['password']
    sb.table('users').upsert(demo).execute().data
    id = sb.table('users').select('publicID').eq('email', demo['email']).execute().data
    print(id[0])
    demo.update({"publicID": id})
    return demo

# make the viewer a commish with 
# return commissioner ID 
def make_commish():
    sb.table('users').update({'commissioner': True}).eq('email', 'demo@betties.app').execute()
    return sb.table('users').update({'commissioner': True}).eq('email', 'demo@betties.app').execute()

def make_group(cid):
    group = {
        'groupID': random.randint(0, 2**31 - 1),
        'cid': cid,
        'groupName': 'Demo Team',
    }
    return sb.table('groups').upsert(group).execute().data['groupID']

def add_2_group(uid, gid):
    sb.table('user_groups').upsert({'groupID': gid, 'userID': sb.table('users').select('publicID').eq('userID', uid)})

# create random bets for the group
def create_bet(cid, gid):
    bet = { 'title': 'The Great Cookie Conundrum',
            'description':  'Join the whimsical world of cookie bets where the stakes are sweet and the crumbs are plenty! In this delightful wager, you\'ll be guessing the number of chocolate chips in the ultimate chocolate chip cookie. Are you ready to take a bite out of this delicious challenge? Over-Under Line: Will the final count of chocolate chips be over or under 100? Place your bet and let the cookie crumble! 🍪✨',
            'odds': {'over': '+100', 'under': '-100'},
            'commissionerID': cid,
            'mode': 'ou',
            'line': 100.5,
            'groupID': gid,
           }
    return sb.table('bets').upsert(bet).execute().data

# place bets on the created ^^ bets
def create_user_bets(user, bet):
    flip_a_coin = random.choice(['over', 'under'])
    random_wager = random.randint(50, 100)
    placed = {
        "userID": user['userID'],
        "publicID": user['publicID'],
        "amount": random_wager,
        "outcome": flip_a_coin,
        "betID": bet["betID"]
    }
    return sb.table('user_bets').upsert(placed).execute().data




        
def main():
    # create 4 bot users 
    try:
        demos = [DEMO_V, DEMO_1, DEMO_2, DEMO_3]
        for demo in demos:
            print(create_npc(demo))

        print('reseting connection as service_role')
        reset()
        print('Commishifying...')
        cid = make_commish()
        if not cid:
            print('no commissioner created')
            raise Exception('no commissioner created')
        print(f'commissionerID: {cid}')

        gid = make_group(cid)
        if not gid:
            raise Exception('no group created')
        print(f'groupID: {gid}')

        for demo in demos:
            add_2_group(demo['publicID'], gid)
        
        bet = create_bet(cid, gid)
        if not bet:
            raise Exception('no bet created')
        for demo in demos:
            print(create_user_bets(demo, bet))
    except Exception as e:
        print(e)
        input('failed. exiting...')
        sys.exit()



if __name__ == "__main__":
    main()
