from django.shortcuts import render
from django.http import HttpResponse, HttpRequest
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

# Create your views here.
def index(request):
    return render(request, 'aboutUs.html')


def signup_view(request):
    if request.method == "POST":
        form2 = UserCreationForm(request.POST)
        if form2.is_valid():
            form2.save()
            return HttpResponse("User created successfully")
        else:
            form1 = AuthenticationForm()
        return render(request, "login_signup.html", {'form1': form1, 'form2': form2})

def login_view(request: HttpRequest):
    form2 = UserCreationForm()
    form1 = AuthenticationForm()
    return render(request, "login_signup.html", {'form1': form1, 'form2': form2})