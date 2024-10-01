from django.urls import path
from .views import *


urlpatterns = [    
   path('login-with-google/', LoginWithGoogle.as_view(), name='google-login'),
   path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
   path('', UserListCreateView.as_view(), name='user-list'),
   path('block-user/<int:id>/', block_user, name='block-user'),
]