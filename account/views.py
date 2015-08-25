from django.shortcuts import render, render_to_response, redirect
from django.http import HttpResponseRedirect, HttpResponse
from django.template import RequestContext
from django.template.context_processors import csrf
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from rest_framework import viewsets
from account.serializers import UserSerializer, GroupSerializer
import json

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

def user_login(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            print "User is valid, active and authentivated."
            login(request, user)
            return HttpResponse(json.dumps({'_status': 0, '_redirect': '/account/index'}))
        else:
            print "The password is valid, but the account has been disabled."
            return HttpResponse(json.dumps({'_status': 1, '_redirect': ''}))
    else:
        print "The username and password were incorrect."
        return HttpResponse(json.dumps({'_status': 2, '_redirect': ''}))

def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/account/login')

def user_register(request):
    username = request.POST['username']
    email = request.POST['email']
    password = request.POST['password']
    ## Check username occupied or not
    if User.objects.filter(username=username).exists():
        return HttpResponse(json.dumps({'_status': 0, '_msg': "Username occupied"}))
    ## Create new account
    User.objects.create_user(username, email, password).save()
    return HttpResponse(json.dumps({'_status': 1, '_msg': "Create account successfully"}))

@csrf_protect
def user_validate(request):
    field = request.POST['field']
    if (field == "username"):
        username = request.POST['username']
        if User.objects.filter(username=username).exists():
            return HttpResponse(json.dumps({'_status': 0, '_msg': username + " has been occupied"}))
        else:
            return HttpResponse(json.dumps({'_status': 1, '_msg': username + " is avaliable"}))
    return 0

@csrf_protect
def login_page(request):
    c = {}
    c.update(csrf(request))
    return render_to_response("account/login.html", RequestContext(request, c));

@csrf_protect
def register_page(request):
    c = {}
    c.update(csrf(request))
    return render_to_response("account/register.html", RequestContext(request, c));
  
def index_page(request):
    return render_to_response("account/index.html", RequestContext(request));
