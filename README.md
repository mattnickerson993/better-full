# Better-full

## About

Better is a webapp designed to to improve the quality of primary care physician visits. On average, patients receive 8-12 minutes with their PCP per visit and are interrupted within 18 seconds once the visit begins [source](https://www.mdpi.com/2226-4787/9/1/42). A primary care visit is overwhelming for both patients and physicians, there is not one singular cause of difficulty. Better provides a way for patients to organize questions and concerns ahead of a visit. The physician can review this prior to the visit so both parties are adequately prepared. Both patient and physician can review the questions/concerns together during the visit. At conclusion of the visit, patients can provide feedback on whether their questions and concerns were adequately answered. Finally, the physician has an opporunity to view this feedback and reach out to the patient if necessary. This ensures both patient and physician are on the same page before, during and after the visit.

## How it works

- The physician creates an account.
- The physician can manage patients and appointments on the webapp
- The physician sends the patient an automated email prior to the appointment.
- By clicking a link in the email, the patient is taken to a form where they may provide up to 7 questions/concerns relating to their upcoming appointment. They may do so via text or voice. **The webapp is designed so patients do not have to create an account. Ease of access for the patient and avoidance of confusion was a strong priority in design**
- The physician will receive the patient's questions and concerns and may review them prior to the visit. Ideally the physician can pull up these questions during the visit to review with the patient. Upon visit conclusion, the physician will confirm the questions have been reviewed.
- The patient will receive an automated email with a link where they may review there questions from the recent appointment. They are given the opporuity to let the physician know which questions they feel were adequately addressed.
- The physician will receive the patient's feedback and be given the opporunity to quickly send an email to the patient to address clarifications or concerns if deemed necessary.
- Physicians will also have access to score reports for all appointments in total as well as trends in the last 30 day period. 
- Physicians will also have access to a patient and appointment archive where they can store older inactive patients and old appointment data.
- The webapp is fully mobile repsonsive.

## Tech stack used

**Frontend**
- React
- Material-UI

**Backend**
- Django
- Django Rest Framework

**Auth**
- JSON web token via Djoser, Django Rest Framework and django-rest-framework-simplejwt



## If you'd like to run the project locally

- clone repository or download as zip file

### How to run the backend?

- enter the backend folder
- create a virtual environment via the following( could use use virtual env of your choice)
```
$ python -m venv env

$ source env/bin/activate

```

- run pip install -r requirements.txt
- You will need postgres installed....create a postgres database via the following command (if not you can use SQLITE3):

```
$ createdb your_database_name_here
```
- Configure the postgres database for running application and tests ( inside psql)

```
    postgres=# CREATE USER your_username_here WITH PASSWORD 'your_password_here';

    postgres=# GRANT ALL PRIVILEGES ON DATABASE your_database_name_here TO your_username_here;
    
    postgres=# ALTER ROLE your_username_here CREATEDB;
 ```
    
- configure .env file (see .sampledotenv_file), you can use a gmail account but will need 2 factor auth turned off
- run the following command:
```
    $ export DJANGO_READ_DOT_ENV_FILE=True
```
- run migrations
```
    $ python manage.py migrate
```
- run server via python manage.py runserver
```
    $ python manage.py runserver
```


#### Setting Up Your Users

- To create an **superuser account**, use this command::
```

    $ python manage.py createsuperuser
 ```
 
 
### How to run the frontend?

-You will need node js installed

-enter frontend folder and run the following commands

```
    $ npm i
```
-once finished run
```
    $ npm run start
```

-you will need to run the backend on port 8000 and the frontend on 3000 via two terminal windows.
