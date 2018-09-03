import os
import random

from django import setup

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
setup()

from populate_database.names import names
from populate_database.surnames import surnames
from wwwApp.models import *

def generate_passengers_for_flight(flight, seats_taken):
    global i
    for i in range(seats_taken):
        Passenger.objects.create(flight=flight, name=random.choice(names),
                                 surname=random.choice(surnames))

i=0
exceedFlight = Flight.objects.get(id=5908)
generate_passengers_for_flight(exceedFlight, 34)