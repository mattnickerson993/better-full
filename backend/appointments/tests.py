from datetime import date, timedelta
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Appointment, Patient, Question

# helper function for user creation
PASSWORD = 'testpass1234$$'
def create_user(email='testuser@email.com', password=PASSWORD):
    return get_user_model().objects.create_user(
            email = email,
            first_name= 'testfirstname',
            last_name='testlastname',
            password = password,
        )

class AppointmentAndQuestionModelTest(TestCase):

    # creeat user, patient, appointment, questions
    def setUp(self):
        self.user = create_user()
        self.patient = Patient.objects.create(
            clinician= self.user,
            first_name= 'patientfirst',
            last_name='patientlast',
            date_of_birth='1980-01-01',
            email='test@email.com',
        )
        self.appointment=Appointment.objects.create(
            clinician= self.user,
            patient= self.patient,
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

    # appointment data as expected
    def test_appointment_data(self):
        self.assertEqual(f'{self.appointment.clinician}', 'testuser@email.com')
        self.assertEqual(f'{self.appointment.patient}', 'patientfirst patientlast')
        self.assertEqual(f'{self.appointment.status}', 'Pending')
        self.assertEqual(self.appointment.archived, False)
    
    # cant create appointment in past
    def test_appointment_in_past_fails(self):
        appointment=Appointment.objects.create(
            clinician= self.user,
            patient= self.patient,
            date_time= timezone.now() - timedelta(days=1)
        )
        try: 
            appointment.full_clean()
        except ValidationError as e:
            self.assertTrue('date_time' in e.message_dict)
            self.assertEquals(e.message_dict['date_time'][0], 'appointment must be in the future')
    
    # question data in past and appointment has reverse relationship with questions
    def test_question_data(self):
        self.assertEqual(f'{self.question1.content}', 'Question one content')
        self.assertEqual(f'{self.question2.content}', 'Question two content')
        self.assertEqual(self.question1.answered, False)
        self.assertNotEqual(self.question2.answered, True)
        self.assertTrue(self.appointment.questions.all().count() == 2)
       

