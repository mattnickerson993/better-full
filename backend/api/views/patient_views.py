import uuid
from django.utils import timezone
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from patients.models import Patient
from api.permissions import isAuthor
from api.serializers import (PatientSerializer, PatientCreateSerializer, 
                        PatientUpdateSerializer,PatientArchiveSerializer)

class PatientListView(generics.ListAPIView):
    permission_classes = [isAuthor]
    serializer_class = PatientSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Patient.objects.all()
        if user is not None:
            queryset = Patient.objects.filter(clinician = user, archived=False)
        return queryset.order_by('last_name')

class InactivePatientListView(generics.ListAPIView):
    permission_classes = [isAuthor]
    serializer_class = PatientSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Patient.objects.all()
        if user is not None:
            queryset = Patient.objects.filter(clinician = user, archived=True)
        return queryset


class PatientDetailView(generics.RetrieveAPIView):
    permission_classes = [isAuthor]
    serializer_class = PatientSerializer
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        queryset = Patient.objects.all()
        if user is not None:
            queryset = Patient.objects.filter(clinician = user)
        return queryset

class PatientCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PatientCreateSerializer

    def perform_create(self, serializer):
        random_token = uuid.uuid4().hex

        return serializer.save(clinician=self.request.user, token=random_token)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_create(serializer)
        instance_serializer = PatientSerializer(instance)
        return Response(instance_serializer.data)

class PatientUpdateView(generics.UpdateAPIView):
    permission_classes = [isAuthor]
    serializer_class = PatientUpdateSerializer
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        queryset = Patient.objects.all()
        if user is not None:
            queryset = Patient.objects.filter(clinician = user)
        return queryset

class PatientDeleteView(generics.DestroyAPIView):
    permission_classes= [isAuthor]
    lookup_field = 'id'
    queryset = Patient.objects.all()

class PatientArchiveView(generics.UpdateAPIView):
    permission_classes = [isAuthor]
    serializer_class = PatientArchiveSerializer
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        queryset = Patient.objects.all()
        if user is not None:
            queryset = Patient.objects.filter(clinician = user)
        return queryset