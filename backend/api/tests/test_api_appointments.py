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

    
class CRUD_APPOINTMENT(APITestCase):
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
        self.appointment = Appointment.objects.create(
            clinician = self.user,
            patient = self.patient,
            date_time= timezone.now() + timedelta(weeks=4)
        )
        self.question1 = Question.objects.create(
            content='Question one content',
            appointment= self.appointment,
        )
        self.question2 = Question.objects.create(
            content='Question two content',
            appointment= self.appointment,
        )
        self.newuser = create_user(email="newuser@email.com", password="newuserPass1234$")
        response = self.client.post('/auth/jwt/create/', {'email':'newuser@email.com',
             'password' :'newuserPass1234$', }, format='json')
        self.newuser_access_token = response.data["access"]


    # appointment list success with proper auth
    def test_appointment_list(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        response = client.get(reverse('api:appointment_list'), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "patientfirst")
    
    # clinician can only view THERE appointments
    def test_appointment_list_not_author(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.newuser_access_token)
        response = client.get(reverse('api:appointment_list'), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotContains(response, "patientfirst")

    
    # fail without credentials
    def test_appointment_list_fail(self):
         client = APIClient()
         client.credentials(HTTP_AUTHORIZATION='JWT '+ self.random_token_imadeup)
         response = client.get(reverse('api:appointment_list'), data={'format': 'json'})
         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # view archived appointments success with credentials
    def test_archived_appointment_list(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        response = client.get(reverse('api:appointment_list_archived'), data={'format': 'json'} )
        self.assertNotContains(response.data, 'patientfirst')
        self.assertEqual(Appointment.objects.filter(archived=True).count(), 0)
        self.appointment.archived = True
        self.appointment.save()
        response = client.get(reverse('api:appointment_list_archived'), data={'format': 'json'} )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response.data, 'patientfirst')
        self.assertEqual(Appointment.objects.filter(archived=True).count(), 1)
    
    # wrong user cant view other users archived appointments
    def test_archived_appointment_list_wrong_author(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.newuser_access_token)
        self.appointment.archived = True
        self.appointment.save()
        response = client.get(reverse('api:appointment_list_archived'), data={'format': 'json'} )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotContains(response, 'patientfirst')

    # view archived appointments fails without credentials
    def test_archived_appointment_list(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.random_token_imadeup)
        response = client.get(reverse('api:appointment_list_archived'), data={'format': 'json'} )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    # view detail success
    def test_appointment_detail(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        response = client.get(reverse('api:appointment_detail', kwargs={'id': self.appointment.id}), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, 'Question one content')
    
    def test_appointment_detail_wrong_user(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.newuser_access_token)
        response = client.get(reverse('api:appointment_detail', kwargs={'id': self.appointment.id}), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    #detail view fails with no auth
    def test_appointment_detail_fail(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.random_token_imadeup)
        response = client.get(reverse('api:appointment_detail', kwargs={'id': self.appointment.id}), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    # update appointment succeeds with auth
    def test_appointment_update(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        appointment_data = {
            'date_time': f'{timezone.now() + timedelta(weeks=2)}'
        }
        response = client.put(reverse('api:appointment_update', kwargs={'id': self.appointment.id}), appointment_data)
        appointment = Appointment.objects.last()
        self.assertLess(appointment.date_time, timezone.now() + timedelta(weeks=4))
        self.assertEqual(appointment.patient.first_name, 'patientfirst')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    # wrong user cant update
    def test_appointment_update_wrong_user(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.newuser_access_token)
        appointment_data = {
            'date_time': f'{timezone.now() + timedelta(weeks=2)}'
        }
        response = client.put(reverse('api:appointment_update', kwargs={'id': self.appointment.id}), appointment_data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    #update appointmnet fails without auth
    def test_appointment_update_fail(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.random_token_imadeup)
        appointment_data = {
            'date_time': f'{timezone.now() + timedelta(weeks=2)}'
        }
        response = client.put(reverse('api:patient_update', kwargs={'id': self.appointment.id}), appointment_data)
        appointment = Appointment.objects.last()
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    # archive appoinment succeeds with auth
    def test_appointment_archive(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        self.assertEqual(self.patient.archived, False)
        appointment_data = {
            'archived': 'True'
        }
        response = client.put(reverse('api:appointment_archive', kwargs={'id': self.appointment.id}), appointment_data)
        appointment = Appointment.objects.last()
        self.assertEqual(appointment.archived, True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    # wrong user cant archive appointment
    def test_appointment_archive_wrong_user(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.newuser_access_token)
        self.assertEqual(self.patient.archived, False)
        appointment_data = {
            'archived': 'True'
        }
        response = client.put(reverse('api:appointment_archive', kwargs={'id': self.appointment.id}), appointment_data)
        appointment = Appointment.objects.last()
        self.assertEqual(appointment.archived, False)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    #fails to archive appointment without auth
    def test_appointment_archive_fail(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.random_token_imadeup)
        self.assertEqual(self.appointment.archived, False)
        appointment_data = {
            'archived': 'True'
        }
        response = client.put(reverse('api:patient_archive', kwargs={'id': self.appointment.id}), appointment_data)
        appointment = Appointment.objects.last()
        self.assertEqual(appointment.archived, False)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    # delete appointmnet success with auth
    def test_appointment_delete(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        response = client.delete(reverse('api:appointment_delete', kwargs={'id': self.appointment.id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    # wrong user cant delete patietn that isnt theirs

    def test_appointment_delete_wrong_user(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.newuser_access_token)
        response = client.delete(reverse('api:appointment_delete', kwargs={'id': self.appointment.id}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    #cant delete patient without auth
    def test_appointment_delete_fail(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.random_token_imadeup)
        response = client.delete(reverse('api:appointment_delete', kwargs={'id': self.patient.id}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
class ARCHIVE_CHECKS(APITestCase):

    # archiving patient, should archive any appointments with feedback status but delete
    # any apppiontments with any other status
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
        self.appointment = Appointment.objects.create(
            clinician = self.user,
            patient = self.patient,
            date_time= timezone.now() + timedelta(weeks=4)
        )
        self.question1 = Question.objects.create(
            content='Question one content',
            appointment= self.appointment,
        )
        self.question2 = Question.objects.create(
            content='Question two content',
            appointment= self.appointment,
        )
        
    # archiving patient should delete any appointments without feedback status upon archive
    def test_archive_not_in_feedback(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        patient = Patient.objects.last()
        appointment = Appointment.objects.last()
        self.assertEqual(patient.archived, False)
        self.assertEqual(appointment.archived, False)
        patient_data = {
            'archived': 'True'
        }
        response = client.put(reverse('api:patient_archive', kwargs={'id': self.patient.id}), patient_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        patient = Patient.objects.last()
        self.assertEqual(patient.archived, True)
        self.assertEqual(Appointment.objects.all().count(), 0)

    # archiving patient should not any appointments with status of feedback, should archive instead
    def test_archive_in_feedback(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        patient = Patient.objects.last()
        appointment = Appointment.objects.last()
        self.assertEqual(patient.archived, False)
        self.assertEqual(appointment.archived, False)
        appointment.status = 'Feedback'
        appointment.save()
        patient_data = {
            'archived': 'True'
        }
        response = client.put(reverse('api:patient_archive', kwargs={'id': self.patient.id}), patient_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        patient = Patient.objects.last()
        appointment = Appointment.objects.last()
        self.assertEqual(patient.archived, True)
        self.assertEqual(appointment.archived, True)