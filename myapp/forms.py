from django import forms
from .models import User

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['name', 'photo', 'email', 'password', 'mobile_number', 'date_of_birth']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter full name',
                'autocomplete': 'name',
                'required': True,
            }),
            'photo': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*',
                'id': 'userPhotoInput',
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g. user@example.com',
                'autocomplete': 'email',
                'required': True,
            }),
            'password': forms.PasswordInput(attrs={
                'class': 'form-control password-input',
                'placeholder': 'Enter password',
                'autocomplete': 'new-password',
                'required': True,
            }, render_value=True),
            'mobile_number': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g. +254 712 345 678',
                'autocomplete': 'tel',
                'required': True,
            }),
            'date_of_birth': forms.DateInput(attrs={
                'class': 'form-control',
                'type': 'date',
                'required': True,
            }),
        }
        labels = {
            'name': 'Full Name',
            'photo': 'Profile Photo',
            'email': 'Email Address',
            'password': 'Password / Passcode',
            'mobile_number': 'Mobile Phone Number',
            'date_of_birth': 'Date of Birth',
        }
        help_texts = {
            'photo': 'Upload PNG, JPG, or WEBP image. A stylish avatar will be generated if empty.',
            'password': 'Keep your password confidential. You can reveal or hide it with the toggle button.',
        }
