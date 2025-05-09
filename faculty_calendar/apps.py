from django.apps import AppConfig
from django.db.models.signals import post_migrate

class FacultyCalendarConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'faculty_calendar'

    def ready(self):
        # Import signals here to avoid circular imports
        from .signals import create_default_entries
        post_migrate.connect(create_default_entries, sender=self)