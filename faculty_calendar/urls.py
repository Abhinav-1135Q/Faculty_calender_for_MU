from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'timetable', views.TimeTableViewSet, basename='timetable')
router.register(r'meetings', views.MeetingSlotViewSet, basename='meetings')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('check-availability/', views.MeetingSlotViewSet.check_availability, name='check-availability'),
    path('get_all_entries/', views.get_all_entries, name='get_all_entries'),
    path('login_user/', views.login_user, name='login_user'),
    path('get_timetable/', views.get_timetable, name='get_timetable'),
    path('get_all_timetables/', views.get_all_timetables, name='get_all_timetables'),
    path('get_all_users_with_timetables/', views.get_all_users_with_timetables, name='get_all_users_with_timetables'),
    path('get_faculty_availability/', views.get_faculty_availability, name='get_faculty_availability'),
]