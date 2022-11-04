from django.test import TestCase
from .models import User, Post, Follower

# Create your tests here.
class FollowerTestCase(TestCase):
    def setUp(self):
        user1 = User.objects.create(username='user1')
        user2 = User.objects.create(username='user2')

        valid_follower = Follower.objects.create(user=user1, follower=user2)
        invalid_follower = Follower.objects.create(user=user1, follower=user1)

    def test_valid_follower(self):
        testuser1 = User.objects.get(username='user1')
        testuser2 = User.objects.get(username='user2')
        testcase = Follower.objects.get(user=testuser1, follower=testuser2)
        self.assertTrue(testcase.is_valid_follower())

    def test_invalid_follower(self):
        user1 = User.objects.get(username='user1')
        testcase = Follower.objects.get(user=user1, follower=user1)
        self.assertFalse(testcase.is_valid_follower())

        

    