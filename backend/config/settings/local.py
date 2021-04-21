from .base import *
from .base import env

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')


ALLOWED_HOSTS = ['localhost', '0.0.0.0', '127.0.0.1']


# DATABASES
# ------------------------------------------------------------------------------
DATABASES["default"] = env.db("DATABASE_URL") 

# WhiteNoise
# ------------------------------------------------------------------------------
# http://whitenoise.evans.io/en/latest/django.html#using-whitenoise-in-development
INSTALLED_APPS = ["whitenoise.runserver_nostatic"] + INSTALLED_APPS  # noqa F405

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD=env('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS= True
DEFAULT_FROM_EMAIL = "admin@better.com"


CORS_ORIGIN_WHITELIST = (
        'http://localhost:3000',
        'http://localhost:8000',
    )

SITE_URL = 'http://localhost:3000'

DOMAIN = 'localhost:3000'