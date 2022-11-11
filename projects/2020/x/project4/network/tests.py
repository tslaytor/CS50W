import json
from urllib import response
from django.test import TestCase, Client, SimpleTestCase
from .models import User, Post, Follower

# Create your tests here.
class MyTestCases(TestCase, SimpleTestCase):
    def setUp(self):
        user1 = User.objects.create(username='user1', password='password')
        user2 = User.objects.create(username='user2', password='password')
        user3 = User.objects.create(username='user3', password='password')
        user4 = User.objects.create(username='user4', password='password')

        Follower.objects.create(user=user1, follower=user2)
        Follower.objects.create(user=user1, follower=user1)

        post1 = Post.objects.create(user=user1, content='one')
        post1.likes.add(user1)
        post2 = Post.objects.create(user=user1, content='two')
        post2.likes.add(user2, user3, user4)
        Post.objects.create(user=user3, content='three')

    # Following valid tests
    def test_valid_follower(self):
        testuser1 = User.objects.get(username='user1')
        testuser2 = User.objects.get(username='user2')
        testcase = Follower.objects.get(user=testuser1, follower=testuser2)
        self.assertTrue(testcase.is_valid_follower())

    def test_invalid_follower(self):
        user1 = User.objects.get(username='user1')
        testcase = Follower.objects.get(user=user1, follower=user1)
        self.assertFalse(testcase.is_valid_follower())

    # Likes valid tests
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

    # page tests, no login required
    def test_index(self):
        c = Client()
        response = c.get('')
        self.assertEqual(response.status_code, 200)

    def test_profile(self):
        c = Client()
        user = User.objects.get(pk=1)
        response = c.get(f"/profile/{user.username}")
        self.assertEqual(response.status_code, 200)

    # page tests, login required
    def test_following(self):
        c = Client()
        c.force_login(user=User.objects.get(pk=1))
        response = c.get('/following')
        self.assertEqual(response.status_code, 200)
  
    # register tests
    def test_register_page(self):
        c = Client()
        response = c.get('/register')
        self.assertEqual(response.status_code, 200)
    
    def test_register_process(self):
        c = Client()
        response = c.post('/register', {
            'username': 'test', 
            'email': 'test@test.com', 
            'password': 'password', 
            'confirmation': 'password'})
        self.assertRedirects(response, '/')

    def test_passwords_dont_match(self):
        c = Client()
        response = c.post('/register', {
            'username': 'test', 
            'email': 'test@test.com', 
            'password': 'password', 
            'confirmation': 'something-different'})
        self.assertEqual(response.status_code, 200)

    def test_integrity(self):
        c = Client()
        response = c.post('/register', {
            'username': 'user1', 
            'email': 'test@test.com', 
            'password': 'password', 
            'confirmation': 'password'})
        self.assertEqual(response.status_code, 200)

    #  login tests
    def test_login(self):
        c = Client()
        response = c.get(f"/login")
        self.assertEqual(response.status_code, 200)

    def test_actually_logging_in(self):
        c = Client()
        user = User.objects.get(pk=1)
        response = c.post("/login", {'username': user.username, 'password': user.password})
        self.assertEqual(response.status_code, 200)

    def test_logout(self):
        c = Client()
        response = c.get(f"/logout")
        self.assertRedirects(response, '/')

    
    # API tests, login required
    def test_create_post_not_logged_in(self):
        c = Client()
        response = c.post('/createpost', {'content': 'test'})
        self.assertEqual(response.status_code, 201)

    def test_create_post_get_method(self):
        c = Client()
        c.force_login(user=User.objects.get(pk=1))
        response = c.get('/createpost', {'content': 'test'})
        self.assertEqual(response.status_code, 400)
    
    # def test_create_post_new(self):
    #     c = Client()
    #     # user = User.objects.get(pk=1)
    #     # c.force_login(user=user)
    #     user = User.objects.create(username='testuser')
    #     user.set_password('12345')
    #     user.save()
    #     c.login(username='testuser', password='12345')
    #     content = {"content": "test", "post_id": False}
    #     response = c.post('/createpost',  content)
    #     # response = c.post('/createpost',  content)
    #     self.assertEqual(response.status_code, 205)