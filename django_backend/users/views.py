from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegisterSerializer
from .models import CyberGuardUser


@api_view(["POST"])
def register(request):

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        return Response(
            {
                "success": True,
                "message": "Registration successful.",
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "country_code": user.country_code,
                    "mobile": user.mobile,
                    "created_at": user.created_at,
                },
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(
        {
            "success": False,
            "errors": serializer.errors,
        },
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["POST"])
def login(request):

    email = request.data.get("email", "").strip().lower()
    password = request.data.get("password", "")

    if not email or not password:
        return Response(
            {
                "success": False,
                "message": "Email and password are required.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = CyberGuardUser.objects.get(email=email)
    except CyberGuardUser.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Invalid email or password.",
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if not user.check_password(password):
        return Response(
            {
                "success": False,
                "message": "Invalid email or password.",
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    return Response(
        {
            "success": True,
            "message": "Login successful.",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "country_code": user.country_code,
                "mobile": user.mobile,
            },
        },
        status=status.HTTP_200_OK,
    )