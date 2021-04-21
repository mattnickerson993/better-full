# better-full


If you'd like to run the project locally
^^^^^^^^^^^^^^^^^^^^^
* clone repository

### How to run the backend?

* enter the backend folder
* create a virtial environment
* run pip install -r requirements.txt
* You will need postgres installed....create a postgres database via the following commands::
* ```
    $ createdb your_database_name_here

    $ CREATE USER your_username_here WITH PASSWORD 'your_password_here';

    $ GRANT ALL PRIVILEGES ON DATABASE your_database_name_here TO your_username_here;
    
* ```
    
* configure .env file (see .sampledotenv_file)
* run migrations
* run server via python manage.py runserver


Setting Up Your Users
^^^^^^^^^^^^^^^^^^^^^

* To create an **superuser account**, use this command::

    $ python manage.py createsuperuser
