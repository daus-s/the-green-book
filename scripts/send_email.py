import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(receiver_email, subject, html_content):
    # Set up the SMTP server
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'dauscarmichael@gmail.com'
    smtp_password = 'paif jkda mgcj ysvf'

    # Create a multipart message and set headers
    message = MIMEMultipart()
    message['From'] = smtp_username
    message['To'] = receiver_email
    message['Subject'] = subject

    # Add HTML content to the email
    message.attach(MIMEText(html_content, 'html'))

    # Connect to the SMTP server
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(message)

# Example usage
if __name__ == "__main__":
    receiver_email = 'Linke_John@smc.edu'
    subject = 'Welcome to Our Platform!'
    with open('./resources/demo_email.html', 'r') as file:
        html_content = file.read()
    send_email(receiver_email, subject, html_content)