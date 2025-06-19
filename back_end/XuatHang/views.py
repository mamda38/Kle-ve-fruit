from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from TaoDon.models import DonXuat
from .serializers import DonXuatSerializer

# Create your views here.
class DonXuatViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'], url_path='don_cho_xuat')
    def get_don_xuat(self, request):
        don_cho_xuat = DonXuat.objects.filter(trang_thai='Chờ_xuất')  
        serializer = DonXuatSerializer(don_cho_xuat, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
       
   
