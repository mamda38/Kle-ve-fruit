from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from datetime import date
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Pallets
from .serializers import PalletsSerializers
from QuanLyKho.models import SanPham, ViTriKho, NhaCungCap
import re

# Create your views here.
class PalletsViewSet(viewsets.ModelViewSet):
    queryset = Pallets.objects.all()
    serializer_class = PalletsSerializers
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['san_pham', 'nha_cung_cap', 'vi_tri_kho', 'trang_thai']

    @action(detail=True, methods=['get'], url_path='quan_ly')
    def quan_ly(self, request, pk=None):
        pallet = get_object_or_404(Pallets, pk=pk)
    
        data = {
            "ma_pallet": pallet.ma_pallet,
            "ten_san_pham": pallet.san_pham.ten_san_pham,
            "so_thung_ban_dau": pallet.so_thung_ban_dau,
            "so_thung_con_lai": pallet.so_thung_con_lai,
            "vi_tri_kho": pallet.vi_tri_kho.ma_vi_tri,
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
            san_pham_list = SanPham.objects.values('id', 'ten_san_pham')
            nha_cung_cap_list = NhaCungCap.objects.values('id', 'ten_nha_cung_cap')
            vi_tri_kho_list = ViTriKho.objects.values('id', 'ma_vi_tri')
            ds_san_pham = [{"id": sp["id"], "label": sp["ten_san_pham"]} for sp in san_pham_list]
            ds_vi_tri_kho = [{"id": vt["id"], "label": vt["ma_vi_tri"]} for vt in vi_tri_kho_list]
            ds_nha_cung_cap = [{"id": ncc["id"], "label": ncc["ten_nha_cung_cap"]} for ncc in nha_cung_cap_list]

            return Response({
                "ds_san_pham": ds_san_pham,
                "ds_nha_cung_cap": ds_nha_cung_cap,
                "ds_vi_tri_kho": ds_vi_tri_kho,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'], url_path='auto_pallet')
    def auto_pallet(self, request):
        try:
            today = date.today()
            date_str = today.strftime('%d%m%y')  # Ví dụ: 180624
            prefix = f"P-{date_str}-"

            # Lấy tất cả pallet bắt đầu bằng prefix hôm nay
            pallets_today = Pallets.objects.filter(ma_pallet__startswith=prefix)

            # Tìm số thứ tự lớn nhất
            max_number = 0
            pattern = re.compile(rf"{prefix}(\d+)$")
            for pallet in pallets_today:
                match = pattern.match(pallet.ma_pallet)
                if match:
                    num = int(match.group(1))
                    if num > max_number:
                        max_number = num

            # Tăng số mới lên
            next_number = max_number + 1
            ma_pallet = f"{prefix}{next_number:03d}"  # 3 chữ số với padding

            return Response({"ma_pallet": ma_pallet}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
    