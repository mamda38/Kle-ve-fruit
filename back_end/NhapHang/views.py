from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Pallets
from .serializers import PalletsSerializers
from QuanLyKho.models import SanPham, ViTriKho
from datetime import datetime

# Create your views here.
class PalletsViewSet(viewsets.ModelViewSet):
    queryset = Pallets.objects.all()
    serializer_class = PalletsSerializers
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ten_san_pham', 'so_thung_con_lai', 'vi_tri_kho', 'trang_thai']

    @action(detail=False, methods=['get'])
    def latest(self, request):
        try:
            # Lấy 10 pallet mới nhất, sắp xếp theo created_at giảm dần
            latest_pallets = Pallets.objects.all().order_by('-created_at')[:10]
            serializer = self.get_serializer(latest_pallets, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], url_path='generate-code')
    def generate_code(self, request):
        try:
            # Lấy ngày hiện tại
            today = datetime.now()
            date_str = today.strftime('%y%m%d')
            
            # Tìm pallet cuối cùng được tạo trong ngày
            last_pallet = Pallets.objects.filter(
                ma_pallet__startswith=date_str
            ).order_by('-ma_pallet').first()
            
            if last_pallet:
                # Nếu có pallet, tăng số thứ tự lên 1
                last_number = int(last_pallet.ma_pallet[-4:])
                new_number = last_number + 1
            else:
                # Nếu chưa có pallet nào trong ngày, bắt đầu từ 1
                new_number = 1
            
            # Tạo mã pallet mới
            new_code = f"{date_str}{str(new_number).zfill(4)}"
            
            return Response({"ma_pallet": new_code})
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'], url_path='quan_ly')
    def quan_ly(self, request, pk=None):
        pallet = get_object_or_404(Pallets, pk=pk)
    
        data = {
            "ma_pallet": pallet.ma_pallet,
            "ten_san_pham": pallet.ten_san_pham,
            "so_thung_ban_dau": pallet.so_thung_ban_dau,
            "so_thung_con_lai": pallet.so_thung_con_lai,
            "vi_tri_kho": pallet.vi_tri_kho,
        }
        return Response(data, status=status.HTTP_200_OK)
        
    @action(detail=True, methods=['get'], url_path='theo_doi')
    def theo_doi(self, request, pk=None):
        pallet = get_object_or_404(Pallets, pk=pk)
        data = {
            "ngay_san_xuat": pallet.ngay_san_xuat,
            "han_su_dung": pallet.han_su_dung,
            "ngay_kiem_tra_cl": pallet.ngay_kiem_tra_cl,
        }
        return Response(data, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['get'], url_path='drop_down')
    def drop_down(self, request):
        try:
            san_pham_list = SanPham.objects.values_list('id', 'ten_san_pham').distinct()
            vi_tri_kho_list = ViTriKho.objects.values_list('id', 'ten_vi_tri').distinct()
            ds_san_pham = [{"id": sp["id"], "label": sp["ten_san_pham"]} for sp in san_pham_list]
            ds_vi_tri_kho = [{"id": vt["id"], "label": vt["ten_vi_tri"]} for vt in vi_tri_kho_list]

            return Response({
                "ds_san_pham": ds_san_pham,
                "ds_vi_tri_kho": ds_vi_tri_kho
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
    
