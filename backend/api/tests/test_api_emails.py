from datetime import timedelta
from rest_framework.test import APITestCase
from rest_framework.test import APIClient, RequestsClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.urls import reverse
from django.core import mail
from django.utils.html import escape
from patients.models import Patient
from appointments.models import Appointment, Question

# Helper function for creating users
PASSWORD = 'testpass1234$$'
def create_user(email='testuser@email.com', password=PASSWORD):
    return get_user_model().objects.create_user(
            email = email,
            first_name= 'testfirstname',
            last_name='userlastname',
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


class API_EMAILS(APITestCase):
    
    @classmethod
    def setUpTestData(cls):
        user = create_active_user()
        patient = Patient.objects.create(
            clinician= user,
            first_name= 'patientfirst',
            last_name='patientlast',
            date_of_birth='1980-01-01',
            email='testpatient@email.com',
        )
        appointment = Appointment.objects.create(
            clinician = user,
            patient = patient,
            date_time= timezone.now() + timedelta(weeks=4)
        )
        newuser = create_user(email="newuser@email.com", password="newuserPass1234$")
        
        
    
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.get(email="testuser@email.com")
        self.patient = Patient.objects.get(email='testpatient@email.com')
        self.appointment = Appointment.objects.get(clinician= self.user)
        response = self.client.post('/auth/jwt/create/', {'email':'testuser@email.com',
             'password' :'testpass1234$$', }, format='json')
        self.access_token = response.data["access"]
        self.random_token_imadeup= 'basdfadsfasdf'
        response = self.client.post('/auth/jwt/create/', {'email':'newuser@email.com',
             'password' :'newuserPass1234$', }, format='json')
        self.newuser_access_token = response.data["access"]
    
    def test_email_confirm(self):
        self.client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        response = self.client.post(reverse('api:appointment_confirm', kwargs={'id': self.appointment.id}), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, f"Please confirm your upcoming appointment with Dr. {self.appointment.clinician.last_name}")
        self.assertIn(escape("You have have an upcoming appointment with Doctor"), mail.outbox[0].body)
        appointment = Appointment.objects.get(clinician= self.user)
        self.assertEqual(appointment.status, 'Sent')
        
    def test_email_wrong_author(self):
        self.client.credentials(HTTP_AUTHORIZATION='JWT '+ self.newuser_access_token)
        response = self.client.post(reverse('api:appointment_confirm', kwargs={'id': self.appointment.id}), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(len(mail.outbox), 0)

    def test_patient_confirm_appt(self):
        self.client.credentials()
        body = {
            'token':self.patient.token,
            'appttoken':self.appointment.token,
            'question1': 'Test question one',
            'question2': 'Test question two'
        }
        response = self.client.post(reverse('api:patient_appointment_confirm'), body, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        appointment = Appointment.objects.get(clinician= self.user)
        patient = Patient.objects.get(clinician= self.user)
        self.assertNotEqual(self.appointment.token, appointment.token)
        self.assertNotEqual(self.patient.token, patient.token)
        self.assertEqual(appointment.status, 'Confirmed')
        questions = Question.objects.filter(appointment=appointment)
        self.assertTrue(questions.count(), 2)
    
    def test_doctor_confirm_review(self):
        self.client.credentials(HTTP_AUTHORIZATION='JWT '+ self.access_token)
        response = self.client.post(reverse('api:doctor_review', kwargs={'id': self.appointment.id}), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, f"Review your recent appointment with Dr. {self.appointment.clinician.last_name}")
        self.assertIn(escape("It was great seeing you at your recent appointment with Dr."), mail.outbox[0].body)
        appointment = Appointment.objects.get(clinician= self.user)
        self.assertEqual(appointment.status, 'Complete')
    
    def test_doctor_confirm_review_wrong_author(self):
        self.client.credentials(HTTP_AUTHORIZATION='JWT '+ self.newuser_access_token)
        response = self.client.post(reverse('api:doctor_review', kwargs={'id': self.appointment.id}), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(len(mail.outbox), 0)

    def test_patient_review_appt(self):
        self.client.credentials()
        appointment = Appointment.objects.get(clinician= self.user)
        patient = Patient.objects.get(clinician= self.user)
        body = {
            'token':patient.token,
            'appttoken':appointment.token,
        }
        response = self.client.post(reverse('api:patient_review_appointment'), body, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, 'patientlast')
