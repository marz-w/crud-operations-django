# app - views.py file

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.db.models import Q
from .models import User
from .forms import UserForm

def user_list(request):
    query = request.GET.get('q', '').strip()
    if query:
        records = User.objects.filter(
            Q(name__icontains=query) |
            Q(email__icontains=query) |
            Q(mobile_number__icontains=query)
        ).order_by('-id')
    else:
        records = User.objects.all().order_by('-id')

    total_count = User.objects.count()
    latest_user = User.objects.last()

    context = {
        'records': records,
        'query': query,
        'total_count': total_count,
        'showing_count': records.count(),
        'latest_user': latest_user,
    }
    return render(request, 'Listingpage.html', context=context)

def AddUser(request):
    if request.method == 'POST':
        form = UserForm(request.POST, request.FILES)
        if form.is_valid():
            new_user = form.save()
            messages.success(request, f"User '{new_user.name}' was successfully created!")
            return redirect('/')
        else:
            messages.error(request, "Unable to save user. Please review the highlighted errors below.")
    else:
        form = UserForm()

    return render(request, 'Add.html', {'form': form})

def EditUser(request, id=None):
    user = get_object_or_404(User, pk=id)
    if request.method == 'POST':
        form = UserForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, f"User '{user.name}' was successfully updated!")
            return redirect('/')
        else:
            messages.error(request, "Unable to update user. Please correct the errors below.")
    else:
        form = UserForm(instance=user)

    context = {
        'form': form,
        'user': user,
    }
    return render(request, 'Edit.html', context=context)

def DeleteUser(request, eid=None):
    user = get_object_or_404(User, pk=eid)
    if request.method == "POST":
        user_name = user.name
        user.delete()
        messages.warning(request, f"User record '{user_name}' has been permanently deleted.")
        return redirect('/')
    return render(request, 'Delete.html', {'user': user})

def ViewUser(request, eid=None):
    user = get_object_or_404(User, pk=eid)
    context = {
        'user': user,
    }
    return render(request, 'View.html', context=context)
