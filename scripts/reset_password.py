# go god mode
import os
from supabase import create_client, Client
from dotenv import load_dotenv


RECOVERY = 'recovery'

username = input('enter username case insensitive: ')


load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("GOD_SUPABASE_KEY")

supabase: Client = create_client(url, key)

response = supabase.table("public_users").select("id").eq("username", username).single().execute()
if not response.data:
    raise Exception("issue with query on public users table")

data = response.data
id = data.get('id')

password = RECOVERY + str(id)


response = supabase.table("users").select("userID").eq("publicID", id).single().execute()
if not response.data:
    raise Exception("issue with query on users table")

print(response.data)
user_id = response.data.get('userID')

print(f'new creds: {username}/{password}')
print(user_id)

response = supabase.auth.admin.update_user_by_id(user_id, attributes={ "password": password })
print("successfully update users credentials")