from django.shortcuts import render
from rest_framework.views import APIView
from .utils import get_id_token
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()

class LoginWithGoogle(APIView):
    def post(self, request):
        print("cameeeeeeeeeeeeeeeeee")
        if 'code' in request.data:
            print("yes it is hereeeeeeeeeeeeee")
            code = request.data['code']
  
            id_token = get_id_token(code)
            
            if 'email' not in id_token:
                return Response({"detail": "Invalid token or missing email"}, status=status.HTTP_400_BAD_REQUEST)
            
            email = id_token['email']
            print("emailllllll", email)
     
            user = get_user_or_create(email)
            print("dataaa", user)

            refresh = RefreshToken.for_user(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        
        return Response({"detail": "Code not provided"}, status=status.HTTP_400_BAD_REQUEST)


def get_user_or_create(email):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        user = User.objects.create_user(email=email)
    return user




   