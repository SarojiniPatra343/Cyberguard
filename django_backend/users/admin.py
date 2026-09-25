from django.contrib import admin
from .models import CyberGuardUser


@admin.register(CyberGuardUser)
class CyberGuardUserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "email",
        "country_code",
        "mobile",
        "created_at",
    )

    search_fields = (
        "name",
        "email",
        "mobile",
    )

    list_filter = (
        "created_at",
    )