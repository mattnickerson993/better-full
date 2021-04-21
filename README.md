# better-full


## If you'd like to run the project locally

- clone repository

### How to run the backend?

- enter the backend folder
- create a virtual environment via the following( could use use virtual env of your choice)
```
$ python venv env

$ source env/bin/activate

```

- run pip install -r requirements.txt
- You will need postgres installed....create a postgres database via the following command (if not you can use SQLITE3):

```
$ createdb your_database_name_here
```
- Configure the postgres database for running application and tests

```
    $ CREATE USER your_username_here WITH PASSWORD 'your_password_here';

    $ GRANT ALL PRIVILEGES ON DATABASE your_database_name_here TO your_username_here;
    
    $ ALTER ROLE your_username_here CREATEDB;
 ```
    
- configure .env file (see .sampledotenv_file), you can use a gmail account but will need 2 factor auth turned off
- run the following command:
```
    $ export DJANGO_READ_DOT_ENV_FILE=True
```
- run migrations
- run server via python manage.py runserver


#### Setting Up Your Users

- To create an **superuser account**, use this command::
```

    $ python manage.py createsuperuser
 ```
