import uuid
import json
import base64
from django.utils import timezone
from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.shortcuts import render
from django.http import HttpResponse
from django.core.exceptions import PermissionDenied
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives, send_mail
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.backends import TokenBackend
from patients.models import Patient
from api.permissions import isAuthor
from appointments.models import Appointment, Question
from api.serializers import AppointmentDetailSerializer                    

@api_view(['POST'])
@permission_classes((isAuthor,))
def email_upcoming_appt(request, id): 
    # auth check
    access_token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]
    header, payload, signature = access_token.split('.')
    decoded_payload = base64.b64decode(f'{payload}==')
    payload_data = json.loads(decoded_payload)
    user = get_user_model().objects.get(id=payload_data['user_id'])
    appointment = Appointment.objects.get(id=id)
    if user != appointment.clinician:
        raise PermissionDenied

    doctor = appointment.clinician.last_name
    subject = f"Please confirm your upcoming appointment with Dr. {doctor}"
    patient = appointment.patient.first_name
    email = appointment.patient.email
    date = appointment.date_time
    path = f'appointments/confirm/{appointment.patient.token}/{appointment.token}'

    context = ({"doctor": doctor, "patient": patient, "date": date, "path": path})

    text_content = render_to_string('upcoming_appt.txt', context, request=request)
    

    try:
        emailMessage = EmailMultiAlternatives(subject=subject, body=text_content, to=[email,],)
        emailMessage.send(fail_silently=False)
        appointment.status = 'Sent'
        appointment.save()
        return HttpResponse(status=204)
    except:
        return Response({'error': 'Error sending email'},status = status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes((AllowAny,))
def patient_confirm_appt(request):
    
    try: 
        token = request.data['token']
        appt_token = request.data['appttoken']
        patient = Patient.objects.get(token = token)
        appointment = Appointment.objects.get(token= appt_token)
        for data in request.data:
            if "question" in data:
                Question.objects.create(content=request.data[data], appointment=appointment)
        appointment.status = 'Confirmed'
        appointment.token = uuid.uuid4().hex
        patient.token = uuid.uuid4().hex
        patient.save()
        appointment.save()     

        return HttpResponse(status=201)
    except ObjectDoesNotExist:
        return Response({'error', 'model not found'}, status=status.HTTP_404_NOT_FOUND)
    except:
        raise Exception("Error posting data")

@api_view(['POST'])
@permission_classes((isAuthor,))
def doctor_confirm_review(request, id):
    # auth check
    access_token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]
    header, payload, signature = access_token.split('.')
    decoded_payload = base64.b64decode(f'{payload}==')
    payload_data = json.loads(decoded_payload)
    user = get_user_model().objects.get(id=payload_data['user_id'])
    appointment = Appointment.objects.get(id=id)
    if user != appointment.clinician:
        raise PermissionDenied

    doctor = appointment.clinician.last_name
    subject = f"Review your recent appointment with Dr. {doctor}"
    patient = appointment.patient.first_name
    email = appointment.patient.email
    date = appointment.date_time
    path = f'appointments/review/{appointment.patient.token}/{appointment.token}/'

    context = ({"doctor": doctor, "patient": patient, "date": date, "path": path})

    text_content = render_to_string('doctor_review.txt', context, request=request)

    try:
        emailMessage = EmailMultiAlternatives(subject=subject, body=text_content, to=[email,],)
        emailMessage.send(fail_silently=False)
        appointment.status = 'Complete'
        appointment.save()
        return HttpResponse(status=204)
    except :
        return Response({'error': 'Error sending email'},status = status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes((AllowAny,))
def patient_review_appt(request):
    
    try: 
        patient_token = request.data['token']
        appointment_token = request.data['appttoken']
        patient = Patient.objects.get(token = patient_token)
        appointment = Appointment.objects.get(token= appointment_token)
        serializer = AppointmentDetailSerializer(appointment)
        return Response(serializer.data,status=status.HTTP_200_OK )

    except ObjectDoesNotExist:
        return Response({'error', 'model not found'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'error fetching appointment data'},status = status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes((AllowAny,))
def patient_final_feedback(request):
    
    try:
        patient_token = request.data['token']
        appointment_token = request.data['appttoken']
        patient = Patient.objects.get(token = patient_token)
        appointment = Appointment.objects.get(token= appointment_token)
        questions = appointment.questions.all()
        checkbox_data = request.data['checks']
        for key in checkbox_data:
            if checkbox_data[key][0] == True:
                question = Question.objects.get(id= checkbox_data[key][1])
                question.answered = True
                question.save()
        appointment.status = "Feedback"
        appointment.token = uuid.uuid4().hex
        patient.token = uuid.uuid4().hex
        appointment.save()
        patient.save()
        return Response(status=status.HTTP_200_OK )
    except ObjectDoesNotExist:
        return Response({'error', 'model not found'}, status=status.HTTP_404_NOT_FOUND)

    except:
        return Response({'error': 'error posting data'},status = status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def doctor_view_feedback(request, id):
    try:
        access_token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]
        header, payload, signature = access_token.split('.')
        decoded_payload = base64.b64decode(f'{payload}==')
        payload_data = json.loads(decoded_payload)
        user = get_user_model().objects.get(id=payload_data['user_id'])
        appointment = Appointment.objects.get(id=id)
        if user != appointment.clinician:
            raise PermissionDenied
        appointment = Appointment.objects.get(id=id)
        serializer = AppointmentDetailSerializer(appointment)
        return Response(serializer.data,status=status.HTTP_200_OK )
    except ObjectDoesNotExist:
        return Response({'error', 'model not found'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'Error fetching appointment data' },status = status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def doctor_feedback_email(request, id ):
    try:
        # auth check
        access_token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]
        header, payload, signature = access_token.split('.')
        decoded_payload = base64.b64decode(f'{payload}==')
        payload_data = json.loads(decoded_payload)
        user = get_user_model().objects.get(id=payload_data['user_id'])
        appointment = Appointment.objects.get(id=id)
        if user != appointment.clinician:
            raise PermissionDenied
        content = request.data['email']
        doctor = appointment.clinician.last_name
        subject = f"Appointment Feedback email from Dr. {doctor}"
        email = appointment.patient.email
        emailMessage = EmailMultiAlternatives(subject=subject, body=content, to=[email,],)
        emailMessage.send(fail_silently=False)
        return Response(status=status.HTTP_200_OK )
    except:
        return Response({'error': 'Error sending email'},status = status.HTTP_500_INTERNAL_SERVER_ERROR)