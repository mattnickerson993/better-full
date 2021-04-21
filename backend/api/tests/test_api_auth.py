import json
import base64
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework.test import APIClient, RequestsClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils import timezone



# Helper function for creating users
PASSWORD = 'testpass1234$$'
def create_user(email='testuser@email.com', password=PASSWORD):
    return get_user_model().objects.create_user(
            email = email,
            first_name= 'testfirstname',
            last_name='testlastname',
            password = password,
        )

def create_active_user(email='testuser@email.com', password=PASSWORD):
    return get_user_model().objects.create_user(
            email = email,
            first_name= 'testfirstname',
            last_name='testlastname',
            password = password,
            is_active = True,
        )


class UserAuthTestCase(APITestCase):

    # signup user
    def test_registration(self):
        data = {
            'email': 'test@email.com',
            'first_name': 'testfirstname',
            'last_name': 'testlastname',
            'password': 'password1234$',
            're_password': 'password1234$',
        }
        response = self.client.post('/auth/users/', data)
        user = get_user_model().objects.last()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['id'], user.id)
        self.assertEqual(response.data['first_name'], user.first_name)
        self.assertEqual(response.data['email'], user.email)
    
    # cant signup without first and last name
    def test_registration_fail(self):
        try:
            data = {
                'email': 'test@email.com',
                'last_name': 'testlastname',
                'password': 'password1234$',
                're_password': 'password1234$',
            }
            response = self.client.post('/auth/users/', data)
        except ValueError as e:
            self.assertIn('First Name is required', str(e))

    
    
    def test_jwt_flow(self):

        # create user, login fails without active status
        user = create_user()
        user.is_active=False
        user.save()
        response = self.client.post('/auth/jwt/create/', {'email':'testuser@email.com',
            'password' :'testpass1234$$', }, format='json') 
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # login success with active status
        user.is_active = True
        user.save()
        response = self.client.post('/auth/jwt/create/', {'email':'testuser@email.com',
            'password' :'testpass1234$$', }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # access and refresh tokens in respsonse
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)

        # verify user with access token

        access_token = response.data["access"]
        refresh_token = response.data["refresh"]
        response = self.client.post('/auth/jwt/verify/', {'token': access_token}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # verification fails with wrong token
        response = self.client.post('/auth/jwt/verify/', {'token': 'randomtoken'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        #get new access token via refresh token
        response = self.client.post('/auth/jwt/refresh/', {'refresh': refresh_token}, format='json')
        new_access_token = response.data['access']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, 'access')
        self.assertTrue('access' in response.data)

        #verify with new access token
        response = self.client.post('/auth/jwt/verify/', {'token': new_access_token}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # source --- testdriven.io ---Jason Parent
    def test_parse_token_data(self):
        
        user= create_user()
        response = self.client.post('/auth/jwt/create/', {'email':'testuser@email.com',
            'password' :'testpass1234$$', }, format='json') 
        access = response.data['access']
        header, payload, signature = access.split('.')
        decoded_payload = base64.b64decode(f'{payload}==')
        payload_data = json.loads(decoded_payload)
        self.assertEqual(payload_data['user_id'], user.id)
       
