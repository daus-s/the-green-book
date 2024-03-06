import os
import sys
from dotenv import load_dotenv
import supabase

# Supabase credentials (replace with your own)
SUPABASE_URL = "YOUR_SUPABASE_URL"
SUPABASE_KEY = "YOUR_SUPABASE_KEY"

# randomly create from an index
def create_npc():
    pass

#create user that the demo viewer will log in through
def create_user(password):
    pass

# make the viewer a commish with 
def make_commish(uid):
    pass

# create random bets for the group
def create_bets():
    pass

# place bets on the created ^^ bets
def create_user_bets():
    pass

def get_input():
    """
    Function to get input from the user.
    """
    password = input("Enter your password: ")
    return password

def initialize_supabase():
    """
    Function to initialize Supabase client.
    """
    try:
        # Initialize Supabase client
        supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)
        # Example: Use Supabase client to perform initialization tasks
        # (e.g., authenticate user with password)
        # Replace the following line with your initialization logic
        return supabase_client
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")

def main():
    # Get input (password)
    password = get_input()

    # Initialize Supabase client
    sb = initialize_supabase()

if __name__ == "__main__":
    main()
