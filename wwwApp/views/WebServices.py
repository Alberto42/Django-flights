from datetime import timedelta
from time import sleep

from django.db import transaction
from django.db.transaction import rollback
from django.http import JsonResponse, HttpResponse
from django.template.backends import django
from django.utils.datetime_safe import datetime
from rest_framework import serializers

from wwwApp.models import Flight, Crew
from wwwApp.utils import flight_intersect_crew_flights, intersect

class Request:
    pass

@transaction.atomic
def SynchronizeWebService(request):
    try:
        print("Poczatek synchronize")
        sid = transaction.savepoint()
        requests = []
        for i,(key,value) in enumerate(request.GET.items()):
            if (i % 2 == 1):
                requests[-1].flight_id = int(value)
            else:
                requests.append(Request())
                if (value == 'remove'):
                    requests[-1].remove = True
                else:
                    requests[-1].remove = False

                    requests[-1].crew_id = int(value)

        sid = transaction.savepoint()
        wrong_flights = set()
        for r in requests:
            flight = Flight.objects.get(id=r.flight_id)
            if (r.remove):
                flight.crew = None
                flight.save()
            else:
                crew = Crew.objects.get(id=r.crew_id)
                flight.crew = crew
                flight.save()

        for r in requests:
            if (r.remove == False):
                crew = Crew.objects.get(id=r.crew_id)
                crew_flights = Flight.objects.filter(crew=crew)
                for flight1 in crew_flights:
                    for flight2 in crew_flights:
                        if (flight1 != flight2 and intersect(flight1,flight2)):
                            wrong_flights.add(flight1)
                            wrong_flights.add(flight2)
        sleep(3)
        if (wrong_flights):
            transaction.savepoint_rollback(sid)

        serializer = FlightsSerializer(wrong_flights, many=True)
        print("Koniec synchronize2")
        return JsonResponse(serializer.data, safe=False)
    except:
        print("Ktos w tym czasie synchronizuje")
        return JsonResponse(dict(busy='busy'), safe=False)

class CrewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crew
        fields = '__all__'


def CrewRestWebService(request):
    crews = Crew.objects.all()
    serializer = CrewSerializer(crews, many=True)
    return JsonResponse(serializer.data, safe=False)


class FlightsSerializer(serializers.ModelSerializer):
    pass

    class Meta:
        model = Flight
        fields = (
            'id', 'starting_airport_name', 'starting_time', 'destination_airport_name', 'destination_time', 'crew_name',
            'starting_time_formatted', 'destination_time_formatted')


def FlightRestWebService(request):
    if 'date' in request.GET:
        flights = flights_filtered_by_date(request)
    else:
        flights = Flight.objects.all()
    serializer = FlightsSerializer(flights, many=True)
    return JsonResponse(serializer.data, safe=False)


def flights_filtered_by_date(request):
    format = '%Y-%m-%d'
    date_str = request.GET["date"]
    day = datetime.strptime(date_str, format)
    next_day = day + timedelta(days=1)
    flights = Flight.objects.filter(starting_time__range=[day.strftime(format), next_day.strftime(format)])
    return flights