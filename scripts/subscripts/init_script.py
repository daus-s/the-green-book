import os
import random
import sys
from time import sleep
from dotenv import load_dotenv
import supabase

# Supabase credentials (replace with your own)

#utility
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

class init:
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
    def __init__(self):
        self.sb = init.initialize_supabase()

    def reset(self):
        self.sb.auth.sign_out()
        return init.initialize_supabase()

    # randomly create from an index
    # this will trigger necesary wallet and data triggers in supa
    # 0 is success
    def create_npc(self, demo: dict):
        print(demo)
        res =  self.sb.auth.sign_up({'email': demo['email'], 'password': demo['password']})
        demo.update({'userID': res.user.id})
        del demo['password']
        self.sb.table('users').upsert(demo).execute().data
        id = self.sb.table('users').select('publicID').eq('email', demo['email']).execute().data[0]['publicID']
        print(id)
        demo.update({"publicID": id})
        return demo

    # make the viewer a commish with 
    # return commissioner ID 
    def make_commish(self):
        self.sb.table('users').update({'commissioner': True}).eq('email', 'demo@betties.app').execute()
        data = self.sb.table('users').select('userID').eq('email', 'demo@betties.app').execute().data
        #print(f'id={data[0].userID}') # this should work stupid pyton
        print(f"id={data[0]['userID']}")
        id=data[0]['userID']
        return self.sb.table('commissioners').insert({'userID': id}).execute().data[0]['commissionerID']

    def make_group(self, cid):
        group = {
            'groupID': random.randint(0, 2**31 - 1),
            'commissionerID': cid,
            'groupName': 'Demo Team',
        }
        return self.sb.table('groups').upsert(group).execute().data[0]['groupID']

    def add_2_group(self, uid, gid):
        print(f'user: {uid} joining group {gid}')
        return self.sb.table('user_groups').upsert({'groupID': gid, 'userID': uid}).execute()

    # create random bets for the group
    def create_bet(self, cid, gid):
        bet = { 'title': 'The Great Cookie Conundrum',
                'description':  'Join the whimsical world of cookie bets where the stakes are sweet and the crumbs are plenty! In this delightful wager, you\'ll be guessing the number of chocolate chips in the ultimate chocolate chip cookie. Are you ready to take a bite out of this delicious challenge? Over-Under Line: Will the final count of chocolate chips be over or under 100? Place your bet and let the cookie crumble! 🍪✨',
                'odds': {'over': '+100', 'under': '-100'},
                'commissionerID': cid,
                'mode': 'ou',
                'line': 100.5,
                'groupID': gid,
            }
        return self.sb.table('bets').upsert(bet).execute().data

    # place bets on the created ^^ bets
    def create_user_bets(self, user, bet):
        flip_a_coin = random.choice(['over', 'under'])
        random_wager = random.randint(50, 100)
        placed = {
            "userID": user['userID'],
            "public_uid": user['publicID'],
            "amount": random_wager,
            "outcome": flip_a_coin,
            "betID": bet["betID"]
        }
        print(f'{user}\nplaced a wager\n{placed}\nfor the bet\n{bet}')
        return self.sb.table('user_bets').upsert(placed).execute().data




            
    def run(self):
        # create 4 bot users
        while True:
            try:
                print(f'AUTH: {self.sb.auth.get_user()}')
                input('proceed? (Enter)')
                demos = [DEMO_V, DEMO_1, DEMO_2, DEMO_3]
                for demo in demos:
                    print(self.create_npc(demo))

                print('reseting connection as service_role')
                self.sb = self.reset()        
                print('Commishifying...')
                cid = self.make_commish()
                if not cid:
                    print('no commissioner created')
                    raise Exception('no commissioner created')
                else:
                    print(f'commissionerID: {cid}')

                gid = self.make_group(cid)
                if not gid:
                    raise Exception('no group created')
                print(f'groupID: {gid}')

                for demo in demos:
                    self.add_2_group(demo['publicID'], gid)
                
                bet = self.create_bet(cid, gid)
                if not (bet and bet[0]):
                    raise Exception('no bet created')
                else:
                    bet=bet[0]
                
                for demo in demos:
                    print(self.create_user_bets(demo, bet))

                print('success')
                return
            except Exception as e:
                print(e)
                input('failed?')
                

def main():
    i = init()
    i.run()


if __name__ == "__main__":
    main()
