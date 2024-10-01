from django.test import TestCase

# Create your tests here.
from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()

class UserListCreateViewTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(username='admin', email='admin@test.com', password='admin123')
        self.client.login(username='admin', password='admin123')
    
    def test_get_users(self):
        response = self.client.get(reverse('user-list'))  
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        data = {
            'username': 'testuser',
            'email': 'test@test.com',
            'password': 'testpassword',
        }
        response = self.client.post(reverse('user-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)


class BlockUserTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@test.com', password='testpassword')
        self.client.login(username=self.user.username, password='testpassword')

    def test_block_user(self):
        response = self.client.patch(reverse('block-user', args=[self.user.id]))
        self.user.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(self.user.is_active) 


class AdminLoginViewTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(username='admin', email='admin@test.com', password='admin123')
    
    def test_admin_login(self):
        data = {
            'username': 'admin',
            'password': 'admin123',
        }
        response = self.client.post(reverse('admin-login'), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['role'], 'admin')
