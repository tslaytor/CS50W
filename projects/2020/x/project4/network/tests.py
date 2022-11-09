from urllib import response
from django.test import TestCase, Client
from .models import User, Post, Follower

# Create your tests here.
class FollowerTestCase(TestCase):
    def setUp(self):
        user1 = User.objects.create(username='user1')
        user2 = User.objects.create(username='user2')
        user3 = User.objects.create(username='user3')
        user4 = User.objects.create(username='user4')

        Follower.objects.create(user=user1, follower=user2)
        Follower.objects.create(user=user1, follower=user1)

        post1 = Post.objects.create(user=user1, content='one')
        post1.likes.add(user1)
        post2 = Post.objects.create(user=user1, content='two')
        post2.likes.add(user2, user3, user4)
        Post.objects.create(user=user3, content='three')

    def test_valid_follower(self):
        testuser1 = User.objects.get(username='user1')
        testuser2 = User.objects.get(username='user2')
        testcase = Follower.objects.get(user=testuser1, follower=testuser2)
        self.assertTrue(testcase.is_valid_follower())

    def test_invalid_follower(self):
        user1 = User.objects.get(username='user1')
        testcase = Follower.objects.get(user=user1, follower=user1)
        self.assertFalse(testcase.is_valid_follower())

    def test_invalid_likes(self):
        post1 = Post.objects.get(pk=1)
        self.assertFalse(post1.valid_post_likes())
    
    def test_valid_likes(self):
        post2 = Post.objects.get(pk=2)
        self.assertTrue(post2.valid_post_likes())

    def test_post_likes(self):
        post2 = Post.objects.get(pk=2)
        self.assertEqual(post2.likes.count(), 3)

    def test_post_no_likes(self):
        post3 = Post.objects.get(pk=3)
        self.assertEqual(post3.likes.count(), 0)

    def test_index(self):
        c = Client()
        response = c.get('')
        self.assertEqual(response.status_code, 200)

    def test_profile(self):
        c = Client()
        user = User.objects.get(pk=1)
        response = c.get(f"/profile/{user.username}")
        self.assertEqual(response.status_code, 200)

    # def test_following(self):
    #     c = Client()
    #     response = c.get('/following')
    #     self.assertEqual(response.status_code, 200)


        

    