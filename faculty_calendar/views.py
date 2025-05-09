from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.csrf import csrf_exempt
from .models import FacultyProfile, TimeTable, MeetingSlot
from .serializers import (
    FacultyProfileSerializer,
    TimeTableSerializer,
    MeetingSlotSerializer
)
from django.http import HttpResponse
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username_or_email = request.data.get('username')
    password = request.data.get('password')

    if not username_or_email or not password:
        return Response({'error': 'Username or email and password are required.'}, status=400)

    User = get_user_model()

    # Try to find the user by username or email
    try:
        user = User.objects.get(username=username_or_email)
    except User.DoesNotExist:
        try:
            user = User.objects.get(email=username_or_email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid username or email.'}, status=401)

    # Authenticate the user
    user = authenticate(username=user.username, password=password)
    if user is not None:
        login(request, user)
        try:
            profile = FacultyProfile.objects.get(user=user)
            serializer = FacultyProfileSerializer(profile)
            refresh = RefreshToken.for_user(user)  # Generate token
            return Response({
                'message': 'Login successful',
                'profile': serializer.data,
                'token': str(refresh.access_token)  # Return access token
            })
        except FacultyProfile.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=404)
    else:
        return Response({'error': 'Invalid password.'}, status=401)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully.'})

class TimeTableViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = TimeTableSerializer

    def get_queryset(self):
        # Only return timetables for the logged-in user
        return TimeTable.objects.filter(faculty__user=self.request.user)

class MeetingSlotViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = MeetingSlotSerializer

    def get_queryset(self):
        return MeetingSlot.objects.filter(faculty__user=self.request.user)

    @staticmethod
    @api_view(['GET'])
    def check_availability(request):
        date = request.query_params.get('date')
        time = request.query_params.get('time')

        if not date or not time:
            return Response({'error': 'Date and time are required.'}, status=400)

        available_faculty = []
        faculty_profiles = FacultyProfile.objects.all()

        for profile in faculty_profiles:
            has_class = TimeTable.objects.filter(
                faculty=profile,
                day=date.strftime('%A'),
                start_time__lte=time,
                end_time__gte=time
            ).exists()

            has_meeting = MeetingSlot.objects.filter(
                faculty=profile,
                date=date,
                start_time__lte=time,
                end_time__gte=time,
                is_available=False
            ).exists()

            available_faculty.append({
                'username': profile.user.username,
                'available': not (has_class or has_meeting)
            })

        return Response(available_faculty)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_entries(request):
    faculty_profiles = FacultyProfile.objects.all()
    timetables = TimeTable.objects.all()
    meeting_slots = MeetingSlot.objects.all()

    data = {
        'faculty_profiles': FacultyProfileSerializer(faculty_profiles, many=True).data,
        'timetables': TimeTableSerializer(timetables, many=True).data,
        'meetings': MeetingSlotSerializer(meeting_slots, many=True).data
    }
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.query_params.get('username')
    password = request.query_params.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=400)

    user = authenticate(username=username, password=password)

    if user is not None:
        try:
            FacultyProfile.objects.get(user=user)
            return Response({'message': 'Login Success'})
        except FacultyProfile.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=404)
    else:
        return Response({'error': 'Invalid username or password.'}, status=401)
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def get_timetable(request):
    username = request.query_params.get('username')

    if not username:
        return Response({'error': 'Username is required.'}, status=400)

    try:
        user = User.objects.get(username=username)
        faculty_profile = FacultyProfile.objects.get(user=user)
        timetables = TimeTable.objects.filter(faculty=faculty_profile)
        serializer = TimeTableSerializer(timetables, many=True)
        return Response(serializer.data, status=200)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=404)
    except FacultyProfile.DoesNotExist:
        return Response({'error': 'Faculty profile not found.'}, status=404)
    except Exception as e:
        return Response({'error': f'Unexpected error: {str(e)}'}, status=500)
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_timetables(request):
    try:
        # Only return the logged-in user's timetable
        faculty_profile = FacultyProfile.objects.get(user=request.user)
        timetables = TimeTable.objects.filter(faculty=faculty_profile)
        serializer = TimeTableSerializer(timetables, many=True)
        return Response(serializer.data, status=200)
    except FacultyProfile.DoesNotExist:
        return Response({'error': 'Faculty profile not found.'}, status=404)
    except Exception as e:
        return Response({'error': f'Unexpected error: {str(e)}'}, status=500)
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_users_with_timetables(request):
    try:
        # Only return the current user's data
        faculty_profile = FacultyProfile.objects.get(user=request.user)
        timetables = TimeTable.objects.filter(faculty=faculty_profile)
        timetable_serializer = TimeTableSerializer(timetables, many=True)
        
        data = {
            'username': faculty_profile.user.username,
            'email': faculty_profile.user.email,
            'department': faculty_profile.department,
            'timetables': timetable_serializer.data
        }
        return Response(data, status=200)
    except FacultyProfile.DoesNotExist:
        return Response({'error': 'Faculty profile not found.'}, status=404)
    except Exception as e:
        return Response({'error': f'Unexpected error: {str(e)}'}, status=500)
@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def get_faculty_availability(request):
    day = request.query_params.get('day')
    start_time = request.query_params.get('start_time')
    end_time = request.query_params.get('end_time')

    if not day or not start_time or not end_time:
        return Response({'error': 'Day, start_time, and end_time are required.'}, status=400)

    available_faculty = []
    busy_faculty = []

    faculty_profiles = FacultyProfile.objects.all()

    for profile in faculty_profiles:
        # Check if the faculty is busy in the timetable
        has_class = TimeTable.objects.filter(
            faculty=profile,
            day=day,
            start_time__lt=end_time,  # Overlap condition
            end_time__gt=start_time   # Overlap condition
        ).exists()

        # Check if the faculty is busy in meeting slots
        has_meeting = MeetingSlot.objects.filter(
            faculty=profile,
            date__week_day=(int(day) if day.isdigit() else None),  # Optional: Handle day as a number
            start_time__lt=end_time,  # Overlap condition
            end_time__gt=start_time   # Overlap condition
        ).exists()

        if has_class or has_meeting:
            busy_faculty.append([profile.user.username,profile.department])
        else:
            available_faculty.append([profile.user.username,profile.department])

    return Response({
        'available_faculty': available_faculty,
        'busy_faculty': busy_faculty
    }, status=200)

def index(request):
    return HttpResponse("Hello from Faculty Calendar API!")
