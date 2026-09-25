
from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class CyberGuardUser(models.Model):
    name = models.CharField(max_length=150)

    email = models.EmailField(unique=True)

    country_code = models.CharField(max_length=10)

    mobile = models.CharField(max_length=20)

    password = models.CharField(max_length=128)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "cyberguard_users"

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.email
