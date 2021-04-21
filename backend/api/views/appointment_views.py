import uuid
from django.utils import timezone
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from patients.models import Patient
from appointments.models import Appointment, Question
from api.permissions import isAuthor
from api.serializers import (PatientSerializer, AppointmentSerializer, 
                        AppointmentCreateSerializer, AppointmentDetailSerializer, 
                        PatientArchiveSerializer, AppointmentArchiveSerializer,
                        AppointmentUpdateSerializer,)

class AppointmentListView(generics.ListAPIView):
    permission_classes= [isAuthor]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.all()
        if user is not None:
            queryset = Appointment.objects.filter(clinician = user, archived=False)
        return queryset

class AppointmentArchivedListView(generics.ListAPIView):
    permission_classes=[isAuthor]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.all()
        if user is not None:
            queryset = Appointment.objects.filter(clinician = user, archived=True)
        return queryset


class AppointmentFeedbackListView(generics.ListAPIView):
    permission_classes= [isAuthor]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.all()
        if user is not None:
            queryset = Appointment.objects.filter(clinician = user, status='Feedback')
        return queryset

class AppointmentThirtyDayFeedback(generics.ListAPIView):
    permission_classes= [isAuthor]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        thirty_days_ago = timezone.now()-timezone.timedelta(days=30)
        if user is not None:
            queryset = Appointment.objects.filter(clinician = user, status='Feedback', date_time__gt=thirty_days_ago).exclude(date_time__gt=timezone.now())
        return queryset


class AppointmentDetailView(generics.RetrieveAPIView):
    permission_classes = [isAuthor]
    serializer_class = AppointmentDetailSerializer
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.all()
        if user is not None:
            queryset = Appointment.objects.filter(clinician = user)
        return queryset

class AppointmentUpdateView(generics.UpdateAPIView):
    permission_classes = [isAuthor]
    serializer_class = AppointmentUpdateSerializer
    lookup_field="id"

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.all()
        if user is not None:
            queryset = Appointment.objects.filter(clinician = user)
        return queryset

class AppointmentCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppointmentCreateSerializer

    def perform_create(self, serializer):
        try:
            random_token = uuid.uuid4().hex
            return serializer.save(clinician=self.request.user, token=random_token)
        except:
             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def create(self, request, *args, **kwargs):
        try: 
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            instance = self.perform_create(serializer)
            instance_serializer = AppointmentSerializer(instance)
            return Response(instance_serializer.data)
        except:
             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AppointmentDeleteView(generics.DestroyAPIView):
    permission_classes = [isAuthor]
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.all()
        if user is not None:
            queryset = Appointment.objects.filter(clinician = user)
        return queryset

class AppointmentArchiveView(generics.UpdateAPIView):
    permission_classes = [isAuthor]
    serializer_class = AppointmentArchiveSerializer
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        queryset = Appointment.objects.all()
        if user is not None:
            queryset = Appointment.objects.filter(clinician = user)
        return queryset

class QuestionListView(generics.ListAPIView):
    permission_classes = [isAuthor]
    serializer_class = PatientSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Question.objects.all()
        if user is not None:
            queryset = Question.objects.filter(clinician = user)
        return queryset