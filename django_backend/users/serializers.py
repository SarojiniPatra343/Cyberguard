from rest_framework import serializers
from .models import CyberGuardUser


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    class Meta:
        model = CyberGuardUser
        fields = [
            "name",
            "email",
            "country_code",
            "mobile",
            "password",
        ]

    def validate_email(self, value):
        value = value.lower().strip()

        if CyberGuardUser.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def validate_mobile(self, value):
        value = value.strip()

        if CyberGuardUser.objects.filter(mobile=value).exists():
            raise serializers.ValidationError(
                "An account with this mobile number already exists."
            )

        return value

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = CyberGuardUser(**validated_data)

        user.set_password(password)
        user.save()

        return user