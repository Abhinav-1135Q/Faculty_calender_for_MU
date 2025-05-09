from django.contrib.auth.models import User
from .models import FacultyProfile, TimeTable
import logging
from django.db import IntegrityError

logger = logging.getLogger(__name__)

def create_user_and_timetable(username, email, password, department, timetable_entries):
    user, created = User.objects.get_or_create(username=username, defaults={
        'email': email,
    })
    if created:
        user.set_password(password)
        user.save()
        logger.info(f"✅ Created user: {username}")
    else:
        logger.info(f"ℹ️ User '{username}' already exists.")

    faculty_profile, created = FacultyProfile.objects.get_or_create(user=user, defaults={
        'department': department
    })
    if created:
        logger.info(f"✅ Created FacultyProfile for user: {username}")
    else:
        logger.info(f"ℹ️ FacultyProfile for user '{username}' already exists.")

    for entry in timetable_entries:
        if entry['start_time'] and entry['end_time']:
            try:
                # Correct way to check matching your unique_together
                if not TimeTable.objects.filter(
                    faculty=faculty_profile,
                    day=entry['day'],
                    start_time=entry['start_time']
                ).exists():
                    TimeTable.objects.create(
                        faculty=faculty_profile,
                        day=entry['day'],
                        start_time=entry['start_time'],
                        end_time=entry['end_time'],
                        class_room=entry['class_room'],
                    )
                    logger.info(f"✅ Created timetable entry for {username} on {entry['day']} at {entry['start_time']} - class_room: {entry['class_room']}")
                else:
                    logger.info(f"⏭️ Timetable entry already exists for {username} on {entry['day']} at {entry['start_time']}")
            except IntegrityError as e:
                logger.error(f"❌ Integrity error while creating timetable for {username} on {entry['day']} at {entry['start_time']}: {e}")
            except Exception as e:
                logger.error(f"❌ Unexpected error while creating timetable for {username}: {e}")
        else:
            logger.info(f"⏭️ Skipping 'Free' day for {username} on {entry['day']}")

def create_default_entries(sender, **kwargs):
    try:
        logger.info("Running create_default_entries...")
        # Create users and timetables
        create_user_and_timetable(
            username='se22ucse271',
            email='se22ucse271@mahindrauiversity.edu.in',
            password='Varun@0987',
            department='General',
            timetable_entries=[
                { "day": "Monday", "start_time": "09:00", "end_time": "10:00", "clas_room": "ECR1" },
                { "day": "Monday", "start_time": "11:00", "end_time": "12:00", "class_room": "ELT3" },
                { "day": "Tuesday", "start_time": "09:00", "end_time": "10:00", "class_room": "ECR4" },
                { "day": "Tuesday", "start_time": "11:00", "end_time": "12:00", "class_room": "ECR2" },
                { "day": "Wednesday", "start_time": "10:00", "end_time": "11:00", "class_room": "ELT1" },
                { "day": "Wednesday", "start_time": "12:00", "end_time": "13:00", "class_room": "ECR7" },
                { "day": "Thursday", "start_time": "09:00", "end_time": "10:00", "class_room": "ECR9" },
                { "day": "Thursday", "start_time": "11:00", "end_time": "12:00", "class_room": "ELT4" },
                { "day": "Friday", "start_time": "10:00", "end_time": "11:00", "class_room": "ECR12" },
                { "day": "Friday", "start_time": "13:00", "end_time": "14:00", "class_room": "ELT6" }
            ]
        )

        create_user_and_timetable(
            username='MayaWilson',
            email='maya.wilson24@example.com',
            password='Maya@4321',
            department='General',
            timetable_entries=[
                { "day": "Monday", "start_time": "08:00", "end_time": "09:00", "class_room": "ECR3" },
                { "day": "Monday", "start_time": "10:00", "end_time": "11:00", "class_room": "ELT2" },
                { "day": "Tuesday", "start_time": "08:00", "end_time": "09:00", "class_room": "ECR8" },
                { "day": "Tuesday", "start_time": "10:00", "end_time": "11:00", "class_room": "ECR5" },
                { "day": "Wednesday", "start_time": "09:00", "end_time": "10:00", "class_room": "ELT3" },
                { "day": "Wednesday", "start_time": "11:00", "end_time": "12:00", "class_room": "ECR6" },
                { "day": "Thursday", "start_time": "08:00", "end_time": "09:00", "class_room": "ECR10" },
                { "day": "Thursday", "start_time": "10:00", "end_time": "11:00", "class_room": "ELT5" },
                { "day": "Friday", "start_time": "09:00", "end_time": "10:00", "class_room": "ECR1" },
                { "day": "Friday", "start_time": "11:00", "end_time": "12:00", "class_room": "ELT6" }
            ]
        )

        create_user_and_timetable(
            username='RyanSmith',
            email='ryan.smith11@example.com',
            password='Ryan_9876',
            department='General',
            timetable_entries=[
                { "day": "Monday", "start_time": "10:00", "end_time": "11:00", "class_room": "ECR2" },
                { "day": "Monday", "start_time": "12:00", "end_time": "13:00", "class_room": "ECR4" },
                { "day": "Tuesday", "start_time": "10:00", "end_time": "11:00", "class_room": "ELT1" },
                { "day": "Tuesday", "start_time": "13:00", "end_time": "14:00", "class_room": "ECR3" },
                { "day": "Wednesday", "start_time": "11:00", "end_time": "12:00", "class_room": "ECR6" },
                { "day": "Wednesday", "start_time": "13:00", "end_time": "14:00", "class_room": "ECR5" },
                { "day": "Thursday", "start_time": "09:00", "end_time": "10:00", "class_room": "ELT4" },
                { "day": "Thursday", "start_time": "12:00", "end_time": "13:00", "class_room": "ECR7" },
                { "day": "Friday", "start_time": "08:00", "end_time": "09:00", "class_room": "ECR9" },
                { "day": "Friday", "start_time": "10:00", "end_time": "11:00", "class_room": "ELT3" }
            ]
        )

        create_user_and_timetable(
            username='SophiaBrown',
            email='sophia.brown58@example.com',
            password='Soph@5678',
            department='General',
            timetable_entries=[
                { "day": "Monday", "start_time": "07:00", "end_time": "08:00", "class_room": "ELT2" },
                { "day": "Monday", "start_time": "09:00", "end_time": "10:00", "class_room": "ECR5" },
                { "day": "Tuesday", "start_time": "07:00", "end_time": "08:00", "class_room": "ECR6" },
                { "day": "Tuesday", "start_time": "09:00", "end_time": "10:00", "class_room": "ELT4" },
                { "day": "Wednesday", "start_time": "08:00", "end_time": "09:00", "class_room": "ECR8" },
                { "day": "Wednesday", "start_time": "10:00", "end_time": "11:00", "class_room": "ELT5" },
                { "day": "Thursday", "start_time": "07:00", "end_time": "08:00", "class_room": "ECR9" },
                { "day": "Thursday", "start_time": "09:00", "end_time": "10:00", "class_room": "ECR10" },
                { "day": "Friday", "start_time": "08:00", "end_time": "09:00", "class_room": "ELT1" },
                { "day": "Friday", "start_time": "10:00", "end_time": "11:00", "class_room": "ECR11" }
            ]
        )

        create_user_and_timetable(
            username='LiamDavis',           
            email='liam.davis99@example.com',
            password='Liam$2024',
            department='General',
            timetable_entries=[
                { "day": "Monday", "start_time": "13:00", "end_time": "14:00", "class_room": "ECR12" },
                { "day": "Monday", "start_time": "15:00", "end_time": "16:00", "class_room": "ELT6" },
                { "day": "Tuesday", "start_time": "13:00", "end_time": "14:00", "class_room": "ECR1" },
                { "day": "Tuesday", "start_time": "15:00", "end_time": "16:00", "class_room": "ELT3" },
                { "day": "Wednesday", "start_time": "14:00", "end_time": "15:00", "class_room": "ECR2" },
                { "day": "Wednesday", "start_time": "16:00", "end_time": "17:00", "class_room": "ECR3" },
                { "day": "Thursday", "start_time": "13:00", "end_time": "14:00", "class_room": "ECR6" },
                { "day": "Thursday", "start_time": "15:00", "end_time": "16:00", "class_room": "ELT4" },
                { "day": "Friday", "start_time": "14:00", "end_time": "15:00", "class_room": "ECR8" },
                { "day": "Friday", "start_time": "16:00", "end_time": "17:00", "class_room": "ECR10" }
            ]
        )

    except Exception as e:
        logger.error(f"Error in create_default_entries: {e}")
