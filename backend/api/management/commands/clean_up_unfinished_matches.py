from django.core.management.base import BaseCommand
from api.models import Match

class Command(BaseCommand):
    help = 'Deletes all unfinished matches'

    def handle(self, *args, **options):
        unfinished_matches = Match.objects.filter(finishedAt__isnull=True)
        count = unfinished_matches.count()
        unfinished_matches.delete()
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} unfinished matches'))