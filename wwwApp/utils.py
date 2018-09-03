date_format = "%d %b %Y (%a) %H:%M"

def intersect(flight1, flight2):
    periodA = [flight1.starting_time, flight1.destination_time]
    periodB = [flight2.starting_time, flight2.destination_time]
    if not periodA[0] < periodB[1]:
        periodA, periodB = periodB, periodA

    return periodA[1] > periodB[0]


def flight_intersect_crew_flights(crew_flights, flight):
    for crew_flight in crew_flights:
        periodA = [crew_flight.starting_time, crew_flight.destination_time]
        periodB = [flight.starting_time, flight.destination_time]
        if not periodA[0] < periodB[1]:
            periodA, periodB = periodB, periodA
        if (periodA[1] > periodB[0]):
            return True
    return False