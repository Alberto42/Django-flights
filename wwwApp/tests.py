import time
import unittest

# Create your tests here.
from datetime import datetime
from urllib.parse import urljoin

from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.test import TestCase
from django.utils.datetime_safe import date

from django import test
from selenium.webdriver.chrome import webdriver

import wwwApp
from wwwApp.models import Flight, Crew, Airport, Plane, Passenger
from wwwApp.utils import flight_intersect_crew_flights

day1 = datetime(year=1000, month=3, day=1, minute=5)
day2 = datetime(year=1000, month=3, day=2, minute=5)
day3 = datetime(year=1000, month=3, day=3, minute=5)
day4 = datetime(year=1000, month=3, day=4, minute=5)

class TestUtils(unittest.TestCase):
    def __init__(self, methodName='runTest'):
        super().__init__(methodName)


    def test_flight_not_intersect_crew_flights(self):
        flightA = Flight(starting_time=day1, destination_time=day2)
        flightB = Flight(starting_time=day3, destination_time=day4)
        self.assertFalse(flight_intersect_crew_flights([flightA], flightB))

    def test_flight_intersect_crew_flights(self):
        flightA = Flight(starting_time=day1, destination_time=day3)
        flightB = Flight(starting_time=day2, destination_time=day4)
        self.assertTrue(flight_intersect_crew_flights([flightA], flightB))

def test_database():
    airport = Airport.objects.create(name="Airport")
    airport2 = Airport.objects.create(name="Airport2")
    plane = Plane.objects.create(passengers_limit=42, name="Plane")
    crew = Crew.objects.create(id=1, captain_name="Jack", captain_surname="Sparrow")
    Flight.objects.create(id=1,starting_time=day1, destination_time=day3, starting_airport=airport,
                              destination_airport=airport2, plane=plane)
    Flight.objects.create(id=2, starting_time=day2, destination_time=day4, starting_airport=airport,
                          destination_airport=airport2, plane=plane)

class TestRelationalWebService(TestCase):

    def setUp(self):
        test_database()
        self.crew = Crew.objects.get(id=1)

    def test_successfully_add_relation(self):
        # given
        flight = Flight.objects.get(id=1)
        self.assertEqual(flight.crew, None)

        # when
        response = self.client.get('/add_relation_service/',{'flight_id': 1, 'crew_id': 1})

        # then
        flight = Flight.objects.get(id=1)
        expectedResponse = b'{"alert_class": "alert-success", "alert": "Sukces! Uda\\u0142o si\\u0119 ' \
                           b'pomy\\u015blnie doda\\u0107 za\\u0142og\\u0119 do lotu"}'
        self.assertEqual(response.content,expectedResponse)
        self.assertEqual(flight.crew, self.crew)
    def test_unsuccessfully_add_relation(self):
        # given
        self.client.get('/add_relation_service/', {'flight_id': 2, 'crew_id': 1})

        # when
        response = self.client.get('/add_relation_service/',{'flight_id': 1, 'crew_id': 1})

        # then
        flight = Flight.objects.get(id=1)
        expectedResponse = b'{"alert_class": "alert-danger", "alert": "Pora\\u017cka! Za\\u0142oga w tym czasie pracuje w innym samolocie"}'
        self.assertEqual(response.content,expectedResponse)
        self.assertEqual(flight.crew, None)

class BasicTestWithSelenium(StaticLiveServerTestCase):
    def setUp(self):
        test_database()
    @classmethod
    def setUpClass(cls):
        cls.selenium = webdriver.WebDriver()
        super(BasicTestWithSelenium, cls).setUpClass()

    @classmethod
    def tearDownClass(cls):
        super(BasicTestWithSelenium, cls).tearDownClass()
        cls.selenium.quit()

    def test_add_new_passenger(self):
        # given
        flight = Flight.objects.get(id=1)
        passenger = Passenger.objects.filter(flight=flight)
        self.assertFalse(passenger.exists())

        url = urljoin(self.live_server_url, '/home/')
        self.selenium.get(url)

        self.signup()

        self.selenium.find_element_by_class_name("clickable-row").click()

        # when
        self.selenium.find_element_by_id("name").send_keys("Imie")
        self.selenium.find_element_by_id("surname").send_keys("Nazwisko")
        self.selenium.find_element_by_id("buy").click()

        # then
        expectedText = 'Imie Nazwisko'
        actualText = self.selenium.find_element_by_class_name("clickable-row").text
        self.assertEqual(expectedText,actualText)

        passenger = Passenger.objects.filter(flight=flight)
        self.assertTrue(passenger.exists())

    def test_assign_crew_to_many_flights(self):
        # given
        url = urljoin(self.live_server_url, '/home/')
        self.selenium.get(url)

        self.signup()
        self.selenium.find_element_by_id("air_crew").click()

        # when
        self.selenium.find_element_by_id("datepicker").send_keys("1000-03-02\n")
        time.sleep(0.1)

        self.selenium.find_element_by_xpath("//*[@id='flight_table_body']/tr[1]").click()
        self.selenium.find_element_by_xpath("//*[@id='crew_table_body']/tr[1]").click()
        self.selenium.find_element_by_id("add_relation").click()

        self.selenium.find_element_by_id("datepicker").send_keys("\b\b\b\b\b\b\b\b\b\b\b1000-03-01\n")
        time.sleep(0.1)
        self.selenium.find_element_by_xpath("//*[@id='flight_table_body']/tr[1]").click()
        self.selenium.find_element_by_xpath("//*[@id='crew_table_body']/tr[1]").click()
        self.selenium.find_element_by_id("add_relation").click()

        # then
        actualAlertText = self.selenium.find_element_by_id("alert").text
        expectedAlertText = 'Porażka! Załoga w tym czasie pracuje w innym samolocie'
        self.assertEqual(expectedAlertText,actualAlertText)


    def signup(self):
        self.selenium.find_element_by_id("signup").click()
        self.selenium.find_element_by_id("id_username").send_keys("user")
        self.selenium.find_element_by_id("id_password1").send_keys("qwerty1234")
        self.selenium.find_element_by_id("id_password2").send_keys("qwerty1234")
        self.selenium.find_element_by_id("signup").click()


