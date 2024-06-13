from dotenv import load_dotenv
import supabase
import random
import os

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

sb = initialize_supabase()

ALNUM = list('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-=_+[]\{\}\\|;:,<>./?\'\"')
def rnd_pwd():
    string = ""
    for i in range(64):
        string += random.choice(ALNUM)
    return string

pwd = rnd_pwd()
sys = { 'email': 'system@betties.app',
        'username' : 'SYSTEM',    
        'password': pwd, 
        'display': 'system',
        'publicID': '8000',
        'commissioner': True,
        'admin': True,
        'pfp_url': '/setting.png'
}
res = sb.auth.sign_up({'email': sys['email'], 'password': sys['password']})
sys.update({'userID': res.user.id})
sb.auth.sign_out()
user_data = {k: v for k, v in sys.items() if k in ['email', 'publicID', 'commish', 'admin', 'userID']}
meta_data = {k: v for k, v in sys.items() if k in ['username', 'display', 'pfp_url']}

with open('SYSTEMPWD', 'w') as file:
    file.write(pwd)

user = sb.table('users').upsert(user_data).execute().data
meta = sb.table('public_users').update(meta_data).eq('id', 8000).execute().data

print(user)
print(meta)

