from django.urls import path
from .views import *


urlpatterns = [    
   path('login-with-google/', LoginWithGoogle.as_view()),
   path('admin-login/', AdminLoginView.as_view()),
   path('', UserListCreateView.as_view()),
   path('block-user/<int:id>/', block_user),
]