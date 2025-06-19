from django.shortcuts import render
from rest_framework import viewsets, status
from django.db.models import Case, When, IntegerField, Value
from django_filters.rest_framework import DjangoFilterBackend
from datetime import date, timedelta
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CuaHang, DonXuat, ChiTietDon, ChiTietViTriCuaHang
from NhapHang.models import Pallets
from QuanLyKho.models import SanPham, ViTriKho
from .serializers import (CuaHangSerializer,  
                        DonXuatSerializer, PalletsSerializer, ChiTietDonSerializer, ChiTietViTriCuaHangSerializer)

# Create your views here.
class ChiTietViTriCuaHangViewSet(viewsets.ModelViewSet):
    queryset = ChiTietViTriCuaHang.objects.all()
    serializer_class = ChiTietViTriCuaHangSerializer

class CuaHangViewSet(viewsets.ModelViewSet):
    queryset = CuaHang.objects.all()
    serializer_class = CuaHangSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ten_cua_hang', 'dia_chi', 'so_dien_thoai']

    @action(detail=False, methods=['get'], url_path='danh_sach_chi_tiet_vi_tri')
    def danh_sach_chi_tiet_vi_tri(self, request):
        try:
            vi_tri_list = ChiTietViTriCuaHang.objects.values('id', 'dia_chi_chi_tiet')
            ds_vi_tri = [{"id": kv["id"], "label": kv["dia_chi_chi_tiet"]} for kv in vi_tri_list]
            return Response({
                "ds_khu_vuc": ds_vi_tri,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
class DonXuatViewSet(viewsets.ModelViewSet):
    queryset = DonXuat.objects.all()
    serializer_class = DonXuatSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['cua_hang']

    @action(detail=False, methods=['get'], url_path='drop_down')
    def drop_down(self, request):
        try:
            cua_hang_list = CuaHang.objects.values('id', 'ten_cua_hang')
            san_pham_list = SanPham.objects.values('id', 'ten_san_pham')
            ds_san_pham = [{"id": sp["id"], "label": sp["ten_san_pham"]} for sp in san_pham_list]
            ds_cua_hang = [{"id": ch["id"], "label": ch["ten_cua_hang"]} for ch in cua_hang_list]
            return Response({
                "ds_cua_hang": ds_cua_hang,
                "ds_san_pham": ds_san_pham,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ChiTietDonViewSet(viewsets.ModelViewSet):
    queryset = ChiTietDon.objects.all()
    serializer_class = ChiTietDonSerializer

    @action(detail=False, methods=['get'], url_path='loc_don')
    def loc_don(self, request):
        cua_hang = request.query_params.get('cua_hang')
        san_pham = request.query_params.get('san_pham')
        so_luong = request.query_params.get('so_luong_can')

        queryset = ChiTietDon.objects.select_related('don_xuat__cua_hang').all()

        if cua_hang:
            queryset = queryset.filter(don_xuat_id__cua_hang_id=cua_hang)

        if san_pham:
            queryset = queryset.filter(san_pham_id=san_pham)

        if so_luong:
            queryset = queryset.filter(so_luong_can=so_luong)

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
class PalletsViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'], url_path='loc_theo_san_pham')
    def loc_theo_san_pham(self, request):
        try:
            san_pham = request.query_params.get('san_pham')
            pallets_list = Pallets.objects.filter(san_pham_id=san_pham)
            serializer = PalletsSerializer(pallets_list, many=True)
            return Response({"pallets": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'], url_path='sap_xep_uu_tien')
    def sap_xep_uu_tien(self, request):
        try:
            today = date.today()
            han_su_dung_moc = today + timedelta(days=30)
            kiem_tra_cl_moc = today + timedelta(days=3)
            Vi_tri_fifo = ViTriKho.objects.filter(uu_tien_fifo=True).values('ma_vi_tri', flat=True)
            queryset = Pallets.objects.annotate(
                priority=Case(
                    When(trang_thai="Đã_mở", then=Value(1)),
                    When(
                        han_su_dung__range=(today, han_su_dung_moc),
                        so_thung_con_lai__gt=0,
                        then=Value(2)
                    ),
                    When(
                        ngay_kiem_tra_cl__range=(today, kiem_tra_cl_moc),
                        so_thung_con_lai__gt=0,
                        then=Value(3)
                    ),
                    When(
                        vi_tri_kho__in=Vi_tri_fifo,
                        so_thung_con_lai__gt=0,
                        then=Value(4)
                    ),
                    default=Value(5),
                    output_field=IntegerField()
                )
            ).order_by('priority', 'so_thung_con_lai')

            serializer = PalletsSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    





    
