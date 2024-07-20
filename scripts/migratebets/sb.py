import os
from dotenv import load_dotenv
import supabase


def initialize_supabase():  
    '''
    Function to initialize Supabase client.
    '''
    dotenv_path = os.path.join(os.path.dirname(__file__), '..\\..\\', '.env')
    print(dotenv_path)
    load_dotenv(dotenv_path)
    SUPABASE_URL = os.getenv('REACT_APP_SUPABASE_URL')
    SUPABASE_KEY = os.getenv('GOD_SUPABASE_KEY')
    return supabase.create_client(SUPABASE_URL, SUPABASE_KEY)


class SupabaseFactory:

    def __init__(self):
        self.factory = initialize_supabase()

    def produce(self):
        return self.factory