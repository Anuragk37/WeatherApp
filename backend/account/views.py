from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .utils import get_id_token
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import UserSerializer
# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()

class UserListCreateView(ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        return super().get_queryset().exclude(is_superuser=True)


@api_view(['PATCH'])
def block_user(request, id):
    try:
        user = User.objects.get(id=id)
        user.is_active = not user.is_active
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



class LoginWithGoogle(APIView):
    def post(self, request):
        if 'code' in request.data:
            code = request.data['code']
            id_token = get_id_token(code)
            
            if 'email' not in id_token:
                return Response({"detail": "Invalid token or missing email"}, status=status.HTTP_400_BAD_REQUEST)
            
            email = id_token['email']
            username = id_token['name']
            first_name = id_token['given_name']
            last_name = id_token['family_name']

     
            user = get_user_or_create(email, username, first_name, last_name)
            print("dataaa", user)

            refresh = RefreshToken.for_user(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'role':"user"
            }, status=status.HTTP_200_OK)
        
        return Response({"detail": "Code not provided"}, status=status.HTTP_400_BAD_REQUEST)


def get_user_or_create(email, username, first_name, last_name):
    try:
        user = User.objects.get(email=email)
        if not user.is_active:
            return Response({'error': 'User is blocked'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        user = User.objects.create_user(email=email, username=username, first_name=first_name, last_name=last_name)
    return user


class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user =User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=user.username, password=password)

        if user is None:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.is_superuser:
            return Response({'error': 'You are not authorized to access this resource'}, status=status.HTTP_403_FORBIDDEN)

        # Create JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role':"admin",
            'message': 'Login successful',
        }, status=status.HTTP_200_OK)


   