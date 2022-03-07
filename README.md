# Overview
  
In The CS50W course project3, it require us to build a mail app that containes the ability to send a mail, reply to a mail, archive/unarchive a mail ...

To build this App I used Django, Javascript and Css.

# Routes
## Login: /login
User can log into the website using a valid username and password for an existing account.

## Register: /register
User must enter their username, email address, password and confirmation password.  
The validation of the page are:
1. The password must match the confirmation password.
2. The username should be unique, meaning no other existing account has the same username.

## Index: /
This page makes a GET request to the mail API route to get all the mails, this page isn't access by every user it require you to be logged in.It display all the mail you recieve. You can route to the other pages by the nav in the header to go to:
- inbox: Containes all mail you recieve and not archived.
- compose: Containes a form to send a mail.
- sent: Containes all the mails you already sent.
- archive: Containes the mails you archive.
we can also go to the email page to see more informations about that email.

# Models
There is 2 models in this app(NetworkApp)

1. User: An extension of Django's AbstractUser model. Stores the informations about users.
2. Email: Store email informations (**user**, **sender**, **recipients**, **subject**, **body**, **timestamp**, **read**, **archived**).

# What’s contained in each file I created.

## project3/ folder:
This folder comes with django as the project folder and it containes the settings.py file...

## mail/ folder:
The backend folder project is network/ :
In this folder as you can see there are the default files that comes with Django and the files I created:

1. First I create the models.

2. Second I edit admin.py file to access the data from the admin page that comes with Django.

3. Third I create the Views:

- In the views.py file I import all the things that I will need as JsonResponse, The models...

    - index view: This view make sure to authenticated users view their inbox, and others prompted to sign in.
    - compose view: This view take data from the form in compose page and send it to the recipient.
    - mailbox view: This view is responses for shows the right emails, if we're on the inbox page it shows all the emails I recieve that aren't archived..., it filters emails returned based on mailbox.
    - email view: This view returns all informations about a given email, and the ability to reply to it or archive it.
    - login_view: This view try to login, and then return the informations about the user logged in.
    - logout_view: This view logout the user that logged in.
    - register_view: This view try to create a new user, then login and returns the user informations to the front-end.

4. Forth I create a url on the urls.py file for every view.

5. **templates/mail/ folder**:  
    This folder containes the HTML files:
    - login.html, register.html are responses for display the forms for login and create new account.
    - layout.html: is a file that containes all the things that used more than one, as the title and the links in HTML files.
    - inbox.html: containes all about the home page, the compose form, the archive page, the header.. and we manage them by javascript to go from page to other.

6. **static/mail/ folder**:  
    Containes two files:
    - styles.css: Containes the styles for the app.
    - inbox.js: Containes the JavaScript for the app to go from page to other without refrech the web app.

# How to run the application
<!--#First you must have Python and Django and NodeJs installed in your machine
#- Then you need to go to the front-end folder(blog-f-e/) and run npm install to create node_modules/ folder.
#- Then back on the root of the app run python manage.py runserver.-->

- Copy the repository to your system.
- Make sure you have Python and Django installed on your system. If not you will need to install them.
- install virtualenv, then create a folder (ENV_FOLDER) and run:

```shell
virtualenv ENV_FOLDER
```
```shell
cd ENV_FOLDER/scripts
```
```shell
activate
```

<!--
- Then go back to the root of the project
and install the packages from the requirements.txt file.
-->

Go back to the project folder and run: 

```shell
python manage.py runserver
```

Then create an account and send email, archive/unarchive an email ...

> You can also visit the app on the internet https://lek-mail.herokuapp.com/