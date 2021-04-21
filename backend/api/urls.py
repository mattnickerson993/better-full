from django.urls import path
from api.views.patient_views import (PatientListView, PatientDetailView, PatientCreateView, 
PatientUpdateView, PatientDeleteView, PatientArchiveView, InactivePatientListView, )
from api.views.appointment_views import ( AppointmentListView, 
AppointmentCreateView, AppointmentDeleteView, AppointmentDetailView, 
AppointmentArchiveView, AppointmentFeedbackListView, AppointmentArchivedListView, 
AppointmentThirtyDayFeedback, AppointmentUpdateView,)
from api.views.email_views import (email_upcoming_appt, patient_confirm_appt, doctor_confirm_review, patient_review_appt, 
patient_final_feedback, doctor_view_feedback, doctor_feedback_email)

app_name="api"

urlpatterns = [
    path('patients/', PatientListView.as_view(), name="patient_list"),
    path('patients/inactive/', InactivePatientListView.as_view(), name="patient_list_inactive"),
    path('patients/create/', PatientCreateView.as_view(), name="patient_create"),
    path('patients/<uuid:id>/', PatientDetailView.as_view(), name="patient_detail"),
    path('patients/update/<uuid:id>/', PatientUpdateView.as_view(), name="patient_update"),
    path('patients/delete/<uuid:id>/', PatientDeleteView.as_view(), name="patient_delete"),
    path('patients/archive/<uuid:id>/', PatientArchiveView.as_view(), name="patient_archive"),
    path('appointments/', AppointmentListView.as_view(), name="appointment_list"),
    path('appointments/archived/', AppointmentArchivedListView.as_view(), name="appointment_list_archived" ),
    path('appointments/feedback/', AppointmentFeedbackListView.as_view(), name="appointment_feedback_list"),
    path('appointments/feedback/thirty/', AppointmentThirtyDayFeedback.as_view(), name="appointment_feedback_thirty"),
    path('appointments/detail/<uuid:id>/', AppointmentDetailView.as_view(), name="appointment_detail"),
    path('appointments/update/<uuid:id>/,', AppointmentUpdateView.as_view(), name="appointment_update"),
    path('appointments/create/', AppointmentCreateView.as_view(), name="appointment_create"),
    path('appointments/delete/<uuid:id>/', AppointmentDeleteView.as_view(), name="appointment_delete"),
    path('appointments/archive/<uuid:id>/', AppointmentArchiveView.as_view(), name="appointment_archive"),
    path('appointments/confirm/<uuid:id>/', email_upcoming_appt, name="appointment_confirm"),
    path('appointments/patient/confirm/', patient_confirm_appt, name="patient_appointment_confirm"),
    path('appointments/review/<uuid:id>/', doctor_confirm_review, name="doctor_review"),
    path('appointments/patient/review/', patient_review_appt, name="patient_review_appointment" ),
    path('appointments/patient/final/feedback/', patient_final_feedback, name="patient_final_feedback" ),
    path('appointments/doctor/final/feedback/<uuid:id>/', doctor_view_feedback, name="doctor_feedback"),
    path('appointments/doctor/feedback/email/<uuid:id>/', doctor_feedback_email, name="doctor_feedback_email"),

    
]