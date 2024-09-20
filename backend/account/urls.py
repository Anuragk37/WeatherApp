from django.urls import path
from .views import *


urlpatterns = [    
   path('login-with-google/', LoginWithGoogle.as_view()),
]