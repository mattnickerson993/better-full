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
from patients.models import Patient
from appointments.models import Appointment, Question

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

class CRUD_PATIENT(APITestCase):
    
    def setUp(self):
        self.user = create_active_user()
        self.patient = Patient.objects.create(
            clinician= self.user,
            first_name= 'patientfirst',
            last_name='patientlast',
            date_of_birth='1980-01-01',
            email='testpatient@email.com',
        )
        response = self.client.post('/auth/jwt/create/', {'email':'testuser@email.com',
             'password' :'testpass1234$$', }, format='json')
        self.access_token = response.data["access"]
        self.random_token_imadeup= 'basdfadsfasdf'
    
    # success with credentials
    def test_patient_list(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        response = client.get(reverse('api:patient_list'), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "patientfirst")
    
    # fail without credentials
    def test_patient_list_fail(self):
         client = APIClient()
         client.credentials(HTTP_AUTHORIZATION='JWT '+ 'randomtoken')
         response = client.get(reverse('api:patient_list'), data={'format': 'json'})
         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    # create patient success with credentials
    def test_create_patient(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        patient_data = {
            'first_name':'patientfirstname',
            'last_name':'patientlastname',
            'date_of_birth':'1980-01-01',
            'email':'test@email.com',
        }
        response = client.post(reverse('api:patient_create'), patient_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "patientfirstname")

    # create patient fail with no credentials
    def test_create_patient_fail(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.random_token_imadeup)
        patient_data = {
            'first_name':'patientfirst',
            'last_name':'patientlast',
            'date_of_birth':'1980-01-01',
            'email':'test@email.com',
        }
        response = client.post(reverse('api:patient_create'), patient_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    # get inactive patients, none at first, then 1
    def test_inactive_patient_list(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        response = client.get(reverse('api:patient_list_inactive'), data={'format': 'json'} )
        self.assertEqual(Patient.objects.filter(archived=True).count(), 0)
        self.patient.archived = True
        self.patient.save()
        response = client.get(reverse('api:patient_list_inactive'), data={'format': 'json'} )
        self.assertEqual(Patient.objects.filter(archived=True).count(), 1)
    
    # get patient details success with credentials
    def test_patient_detail(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        response = client.get(reverse('api:patient_detail', kwargs={'id': self.patient.id}), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, 'testpatient@email.com')
    
    #detail view fails with no auth
    def test_patient_detail_fail(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.random_token_imadeup)
        response = client.get(reverse('api:patient_detail', kwargs={'id': self.patient.id}), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    # update patient succeeds with auth
    def test_patient_update(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        patient_data = {
            'first_name': 'patientfirst edited'
        }
        response = client.put(reverse('api:patient_update', kwargs={'id': self.patient.id}), patient_data)
        patient = Patient.objects.last()
        self.assertNotEqual(patient.first_name, 'patientfirst')
        self.assertEqual(patient.first_name, 'patientfirst edited')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    #update patient fails without auth
    def test_patient_update_fail(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.random_token_imadeup)
        patient_data = {
            'first_name': 'patientfirst edited'
        }
        response = client.put(reverse('api:patient_update', kwargs={'id': self.patient.id}), patient_data)
        patient = Patient.objects.last()
        self.assertEqual(patient.first_name, 'patientfirst')
        self.assertNotEqual(patient.first_name, 'patientfirst edited')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    # delete patient success with auth
    def test_patient_delete(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        response = client.delete(reverse('api:patient_delete', kwargs={'id': self.patient.id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    #cant delete patient without auth
    def test_patient_delete_fail(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.random_token_imadeup)
        response = client.delete(reverse('api:patient_delete', kwargs={'id': self.patient.id}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    #archive patient success with auth
    def test_patient_archive(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        self.assertEqual(self.patient.archived, False)
        patient_data = {
            'archived': 'True'
        }
        response = client.put(reverse('api:patient_archive', kwargs={'id': self.patient.id}), patient_data)
        patient = Patient.objects.last()
        self.assertEqual(patient.archived, True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    #fails to archive patient without auth
    def test_patient_archive_fail(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.random_token_imadeup)
        self.assertEqual(self.patient.archived, False)
        patient_data = {
            'archived': 'True'
        }
        response = client.put(reverse('api:patient_archive', kwargs={'id': self.patient.id}), patient_data)
        patient = Patient.objects.last()
        self.assertEqual(patient.archived, False)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)



    # must be author to read, update, delete, archive
    def test_RUD_not_author(self):
        newuser = create_user(email="newuser@email.com", password="newuserPass1234$")
        patient = Patient.objects.last()
        response = self.client.post('/auth/jwt/create/', {'email':'newuser@email.com',
             'password' :'newuserPass1234$', }, format='json')
        newuser.access_token = response.data["access"]
        newuser.save()

        # update
       
        patient_data = {
            'first_name': 'edited by non-author'
        }
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ newuser.access_token)
        response = client.get(reverse('api:patient_detail', kwargs={'id': patient.id}), data={'format': 'json'})
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertNotEqual(patient.first_name, 'edited by non-author')

        #  archive
        patient_data = {
            'archived': 'True'
        }
        response = client.put(reverse('api:patient_archive', kwargs={'id': patient.id}), patient_data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertNotEqual(patient.archived, True)

        # detail
        response = client.get(reverse('api:patient_detail', kwargs={'id': self.patient.id}), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)



    