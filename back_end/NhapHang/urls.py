from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PalletsViewSet

router = DefaultRouter()
router.register(r'pallets', PalletsViewSet)



urlpatterns = [
    path('', include(router.urls)),
]