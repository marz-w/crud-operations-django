# app - models.py file

from django.db import models
from datetime import date
import hashlib

class User(models.Model):
    name = models.CharField(max_length=30)
    photo = models.ImageField(upload_to="uploads", default="a.png")
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    mobile_number = models.CharField(max_length=15)
    date_of_birth = models.DateField()

    def __str__(self):
        return self.name

    @property
    def age(self):
        if not self.date_of_birth:
            return None
        today = date.today()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )

    @property
    def initials(self):
        parts = self.name.strip().split()
        if len(parts) >= 2:
            return f"{parts[0][0]}{parts[1][0]}".upper()
        elif len(parts) == 1 and len(parts[0]) > 0:
            return parts[0][:2].upper()
        return "U"

    @property
    def avatar_gradient(self):
        # Generate a consistent stylish gradient based on the user's name
        gradients = [
            "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
            "linear-gradient(135deg, #3B82F6 0%, #2DD4BF 100%)",
            "linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)",
            "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
            "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
            "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
        ]
        if not self.name:
            return gradients[0]
        hash_idx = int(hashlib.md5(self.name.encode('utf-8')).hexdigest(), 16) % len(gradients)
        return gradients[hash_idx]
