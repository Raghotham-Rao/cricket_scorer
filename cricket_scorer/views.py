from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpRequest
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout


# Create your views here.
def index(request):
    if request.user.is_authenticated:
        return redirect('user:dashboard')
    return render(request, 'aboutUs.html')


def signup_view(request):
    if request.method == "POST":
        form2 = UserCreationForm(request.POST)
        if form2.is_valid():
            user = form2.save()
            login(request, user)
            if request.POST.get("next"):
                return redirect(request.POST.get("next"))
            return redirect("user:dashboard")
        else:
            form1 = AuthenticationForm()
        return render(request, "login_signup.html", {'form1': form1, 'form2': form2})

def login_view(request):
    if request.method == "POST":
        form1 = AuthenticationForm(data=request.POST)
        if form1.is_valid():
            login(request, form1.get_user())
            if request.POST.get("next"):
                return redirect(request.POST.get("next"))
            return redirect("user:dashboard")
    else:
        form1 = AuthenticationForm()
    form2 = UserCreationForm()
    return render(request, "login_signup.html", {'form1': form1, 'form2': form2})


def logout_view(request):
    logout(request)
    return login_view(request)