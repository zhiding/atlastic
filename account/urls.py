from django.conf.urls import include, url
from views import index_page,login_page, register_page, user_login, user_logout, user_register, user_validate

urlpatterns = [
    url('user_login/', user_login),
    url('user_logout/', user_logout),
    url('user_register/', user_register),
    url('user_validate/', user_validate),
    url('index/', index_page, name='index'),
    url('login/', login_page, name='login'),
    url('register/', register_page, name='register'),
]
    
