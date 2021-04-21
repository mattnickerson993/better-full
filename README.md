# better-full


If you'd like to run the project locally
^^^^^^^^^^^^^^^^^^^^^
* clone repository

### How to run the backend?

* enter the backend folder
* create a virtial environment
* run pip install -r requirements.txt
* You will need postgres installed....create a postgres database via the following commands::
    $ createdb your_database_name_here

    $ CREATE USER your_username_here WITH PASSWORD 'your_password_here';

    $ GRANT ALL PRIVILEGES ON DATABASE your_database_name_here TO your_username_here;
    
* configure .env file (see .sample_dot_env_file)
* run migrations
* run server ( all-auth ( google and amazon login) and stripe will need additional configuration but the rest of the site will work )


Setting Up Your Users
^^^^^^^^^^^^^^^^^^^^^

* To create a **normal user account**, just go to Sign Up and fill out the form. Once you submit it, you'll see a "Verify Your E-mail Address" page. Go to your console to see a simulated email verification message. Copy the link into your browser. Now the user's email should be verified and ready to go.

* To create an **superuser account**, use this command::

    $ python manage.py createsuperuser
