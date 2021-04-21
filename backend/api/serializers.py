from rest_framework import serializers
from patients.models import Patient
from appointments.models import Appointment, Question

class PatientSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Patient
        fields = (
            'first_name',
            'last_name',
            'date_of_birth',
            'id',
            'email',
            'archived',
        )

class PatientCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = (
            'first_name',
            'last_name',
            'date_of_birth',
            'email',
        )

class PatientUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    date_of_birth = serializers.DateField(required=False)
    email = serializers.EmailField(required=False)

    class Meta: 
        model = Patient
        fields = ('first_name', 'last_name', 'date_of_birth', 'email', 'id' )

class PatientArchiveSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Patient
        fields = ('id', 'archived' )

    def update(self, instance, validated_data):
        archived = validated_data.pop('archived')
        instance.archived = archived
        appointments = instance.appointments.all()
        for appointment in appointments:
            if archived:
                if appointment.status != 'Feedback':
                    appointment.delete()
                elif appointment.archived != True:
                    appointment.archived = True
                    appointment.save()       
        return super().update(instance, validated_data)


class QuestionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = (
            "id",
            "content",
            "answered",
        )

class AppointmentSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='patient.first_name')
    last_name = serializers.CharField(source='patient.last_name')
    date_of_birth = serializers.CharField(source='patient.date_of_birth')
    questions = QuestionListSerializer(read_only=True, many=True)

    class Meta: 
        model = Appointment
        fields = (
            'id',
            'patient',
            'first_name',
            'last_name',
            'date_of_birth',
            'status',
            'date_time',
            'questions',
            'archived',
        )  

class AppointmentDetailSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='patient.first_name')
    last_name = serializers.CharField(source='patient.last_name')
    date_of_birth = serializers.CharField(source='patient.date_of_birth')
    doctor = serializers.CharField(source = "clinician.last_name")
    questions = QuestionListSerializer(read_only=True, many=True)

    class Meta: 
        model = Appointment
        fields = (
            'id',
            'patient',
            'first_name',
            'last_name',
            'date_of_birth',
            'status',
            'date_time',
            'questions',
            'doctor',
            'archived',
            
        ) 

class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = (
            'id',
            'patient',
            'date_time',
            'status', 
        )

class AppointmentArchiveSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Appointment
        fields = ('id', 'archived' )

class AppointmentUpdateSerializer(serializers.ModelSerializer):

    class Meta: 
        model = Appointment
        fields = ('date_time', 'id' )


