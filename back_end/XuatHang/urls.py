from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DonXuatViewSet

router = DefaultRouter()
router.register(r'donxuat', DonXuatViewSet, basename='donxuat')

urlpatterns = [
    path('', include(router.urls)),
]