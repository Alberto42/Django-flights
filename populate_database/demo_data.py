import os
import random
from datetime import datetime
from datetime import timedelta

from django import setup

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "WWW2e.settings")
setup()

from populate_database.planes import planes
from populate_database.airports import airports
from wwwApp.models import *
from itertools import cycle

SIZE = 10;
PLANES_COUNT = SIZE
AIRPORTS_COUNT = SIZE
FLIGHTS_FOR_EACH_PLANE_COUNT = SIZE

Plane.objects.all().delete()
Flight.objects.all().delete()
Airport.objects.all().delete()

random.seed(42)

for (plane, i) in zip(cycle(planes), range(0, PLANES_COUNT)):
    Plane.objects.create(name=plane)

for (airport, i) in zip(cycle(airports), range(0, AIRPORTS_COUNT)):
    Airport.objects.create(name=airport, passengers_limit=random.randrange(20, 60))

for plane in Plane.objects.all():
    start_airport = random.choice(tuple(Airport.objects.all()))
    end_date = datetime(2018, 5, 1, 0, 0) + timedelta(minutes=random.randrange(0, 300))
    for i in range(0, FLIGHTS_FOR_EACH_PLANE_COUNT):
        destination_airport = start_airport
        while (destination_airport == start_airport):
            destination_airport = random.choice(tuple(Airport.objects.all()))

        start_date = end_date + timedelta(minutes=random.randrange(300, 720))
        end_date = start_date + timedelta(minutes=random.randrange(30, 180))

        Flight.objects.create(starting_airport=start_airport,
                              starting_time=start_date,
                              destination_airport=destination_airport,
                              destination_time=end_date,
                              plane=plane)

        start_airport = destination_airport
