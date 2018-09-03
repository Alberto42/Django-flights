"""app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib.auth import views as auth_views
from django.conf.urls import url
from django.urls import path

import wwwApp.views.WebServices
from wwwApp.views import views

urlpatterns = [
    path('flights/<int:id>', views.flight_details),
    url(r'^logout/$', auth_views.logout, {'next_page': '/home'}, name='logout'),
    url(r'^home/.*', views.home),
    path('buy_ticket', views.buy_ticket),
    url(r'^signup/$', views.signup, name='signup'),
    path('air_crew/', views.air_crew),
    path('crews_service/', wwwApp.views.WebServices.CrewRestWebService),
    path('flights_service/', wwwApp.views.WebServices.FlightRestWebService),
    path('synchronize_service/', wwwApp.views.WebServices.SynchronizeWebService),
]
