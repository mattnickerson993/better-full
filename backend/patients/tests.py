from datetime import date, timedelta
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Patient

PASSWORD = 'testpass1234$$'
def create_user(email='testuser@email.com', password=PASSWORD):
    return get_user_model().objects.create_user(
            email = email,
            first_name= 'testfirstname',
            last_name='testlastname',
            password = password,
        )

class PatientModelTest(TestCase):

    def setUp(self):
        self.user = create_user()
        self.patient = Patient.objects.create(
            clinician= self.user,
            first_name= 'patientfirst',
            last_name='patientlast',
            date_of_birth='1980-01-01',
            email='test@email.com',
        )
    def test_patient_data(self):
        self.assertEqual(f'{self.patient.clinician}', 'testuser@email.com')
        self.assertEqual(f'{self.patient.first_name}', 'patientfirst')
        self.assertEqual(f'{self.patient.last_name}', 'patientlast')
        self.assertEqual(f'{self.patient.date_of_birth}', '1980-01-01')
        self.assertEqual(f'{self.patient.email}', 'test@email.com')
    
    def test_birthday_in_future_fails(self):
        patient = Patient.objects.create(
            clinician= self.user,
            first_name= 'patientfirst',
            last_name='patientlast',
            date_of_birth= date.today() + timedelta(days=1),
            email='test@email.com',
        )
        try: 
            patient.full_clean()
        except ValidationError as e:
            self.assertTrue('date_of_birth' in e.message_dict)
            self.assertEquals(e.message_dict['date_of_birth'][0], 'Birthday cannot be in the future')
       
        