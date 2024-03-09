import sys

# Define your scripts
SCRIPTS = {
    "--init": "init_script.py",
    "--cleanup": "cleanup_script.py",
    "--help": "help_script.py",
    "-h": "help_script.py"
}

# Input
def get_input():
    """
    Function to get input from the user.
    Modify this function according to your input requirements.
    """
    # Example: get command-line argument
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg in SCRIPTS:
            return arg
        else:
            print("Invalid argument. To see all options run demo -h or demo --help")
            sys.exit(1)
    else:
        sys.exit(1)

# Main function
def main():
    # Get input
    argument = get_input()

    # Execute the specified script
    script_file = SCRIPTS[argument]
    print(f"Executing {script_file}...")
    # Call the specified script here

# Entry point of the script
if __name__ == "__main__":
    main()
