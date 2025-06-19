from django.shortcuts import render
from rest_framework import viewsets, status
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import date, timedelta
from django_filters.rest_framework import DjangoFilterBackend
from .models import ViTriKho, KhuVuc, NhomHang, SanPham, NhaCungCap, TinhTrangHang, KiemKe, ChiTietKiemKe, BaoTri
from .serializers import ViTriKhoSerializer, KhuVucSerializer, NhomHangSerializer, SanPhamSerializer, NhaCungCapSerializer, TinhTrangHangSerializer, KiemKeSerializer, ChiTietKiemKeSerializer, BaoTriSerializer
from NhapHang.models import Pallets

# Create your views here.
class KhuVucViewSet(viewsets.ModelViewSet):
    queryset = KhuVuc.objects.all()
    serializer_class = KhuVucSerializer     

class ViTriKhoViewSet(viewsets.ModelViewSet):
    queryset = ViTriKho.objects.all()
    serializer_class = ViTriKhoSerializer

    # @action(detail=False, methods=['get'], url_path='xem_map')
    # def xem_map(self, request):
    #     try:
    #         ma_khu_vuc = KhuVuc.objects.values_list('ma_khu_vuc', flat=True)
    #         return Response({
    #             "ma_khu_vuc": list(ma_khu_vuc)
    #         }, status=status.HTTP_200_OK)
    #     except Exception as e:
    #         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='xem_map')
    def xem_map(self, request):
        try:
            data = []
            for kv in KhuVuc.objects.all():
                ma_khu_vuc = kv.ma_khu_vuc
                ten_khu_vuc = kv.ten_khu_vuc
                kich_thuoc_hang = kv.kich_thuoc_hang
                kich_thuoc_cot = kv.kich_thuoc_cot
                trang_thai = kv.trang_thai
                
                # Lấy thông tin các vị trí trong khu vực
                vi_tri_list = []
                vi_tri_queryset = ViTriKho.objects.filter(khu_vuc=kv).order_by('ma_vi_tri')
                
                for vt in vi_tri_queryset:
                    vi_tri_list.append({
                        'ma_vi_tri': vt.ma_vi_tri,
                        'hang': vt.hang,
                        'cot': vt.cot,
                        'trang_thai': vt.trang_thai,
                        'loai_vi_tri': vt.loai_vi_tri
                    })
                
                data.append({
                    "ma_khu_vuc": ma_khu_vuc,
                    "ten_khu_vuc": ten_khu_vuc,
                    "kich_thuoc_hang": kich_thuoc_hang,
                    "kich_thuoc_cot": kich_thuoc_cot,
                    "trang_thai": trang_thai,
                    "vi_tri": vi_tri_list
                })
            
            return Response({
                "map_data": data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    @action(detail=False, methods=['get'], url_path='dashboard_quan_ly_kho')
    def dashboard_quan_ly_kho(self, request):
        try:
            tong_vi_tri = ViTriKho.objects.count()
            tong_pallets = Pallets.objects.count()
            trong = ViTriKho.objects.filter(trang_thai='Trống').count()
            day = ViTriKho.objects.filter(trang_thai='Có hàng').count()
            if tong_vi_tri > 0:
                ty_le_su_dung = f'{(day / tong_vi_tri) * 100:.2f}%'
            else:
                ty_le_su_dung = "0.00%"

            if (tong_vi_tri - trong) > 0:
                hieu_suat = f'{(day / (tong_vi_tri - trong)) * 100:.2f}%'
            else:
                hieu_suat = "0.00%"

            can_bao_tri = ViTriKho.objects.filter(trang_thai='Bảo trì').count()

            today = date.today()
            target_date = today + timedelta(days=3)
            pallets_sap_het_han = Pallets.objects.filter(han_su_dung = target_date).count()
            khu_vuc_can_bao_tri = KhuVuc.objects.filter(trang_thai = 'Bảo trì').values_list('ma_khu_vuc', flat=True)

            pallets_can_kiem_tra_cl = Pallets.objects.filter(ngay_kiem_tra_cl = today).count()

            data = {
                "tong_vi_tri": tong_vi_tri,
                "tong_pallets": tong_pallets,
                "can_bao_tri": can_bao_tri,
                "ty_le_su_dung": ty_le_su_dung,
                "trong": trong,
                "day": day,
                "bao_tri": can_bao_tri,
                "hieu_suat": hieu_suat,
                "pallets_sap_het_han": pallets_sap_het_han,
                "khu_vuc_can_bao_tri": list(khu_vuc_can_bao_tri),
                "tinh_trang": hieu_suat,
                "pallets_can_kiem_tra_cl": pallets_can_kiem_tra_cl
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard_vi_tri_kho(self, request):
        try:
            data = []
            for kv in KhuVuc.objects.all():
                ma_khu_vuc = kv.ma_khu_vuc
                ten_khu_vuc = kv.ten_khu_vuc
                kich_thuoc = f'{kv.kich_thuoc_cot}x{kv.kich_thuoc_hang} ({kv.kich_thuoc_hang * kv.kich_thuoc_cot} vị trí)'
                trang_thai = kv.trang_thai
                tong_vi_tri = ViTriKho.objects.filter(khu_vuc=kv).count()
                vi_tri_co_hang = ViTriKho.objects.filter(khu_vuc=kv, trang_thai='Có hàng').count()
                su_dung = f'{vi_tri_co_hang}/{tong_vi_tri} ({(vi_tri_co_hang / tong_vi_tri) * 100:.2f}%)'
                data_vi_tri = ViTriKho.objects.filter(khu_vuc=kv).values('ma_vi_tri', 'trang_thai')

                data.append({
                    "ma_khu_vuc": ma_khu_vuc,
                    "ten_khu_vuc": ten_khu_vuc,
                    "kich_thuoc": kich_thuoc,
                    "trang_thai": trang_thai,
                    "tong_vi_tri": tong_vi_tri,
                    "su_dung": su_dung,
                    "vi_tri": list(data_vi_tri)
                })

            return Response({"dashboard": data})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'], url_path='dropdown_them_sua')
    def dropdown_them_sua(self, request):
        try:
            khu_vuc_dropdown = KhuVuc.objects.values('id', 'ma_khu_vuc').distinct()
            return Response({
                    "khu_vuc_dropdown": list(khu_vuc_dropdown)
                }, status=status.HTTP_200_OK)      
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class NhomHangViewSet(viewsets.ModelViewSet):
    queryset = NhomHang.objects.all()
    serializer_class = NhomHangSerializer
        
    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard(self, request):
        try:
            data = []
            for nh in NhomHang.objects.all():
                ten_nhom = nh.ten_nhom
                tong_san_pham = SanPham.objects.filter(nhom_hang=nh).count()
                san_pham = SanPham.objects.filter(nhom_hang=nh).values('ten_san_pham', 'dung_tich', 'so_luong_per_thung')
                data.append({
                    "ten_nhom": ten_nhom,
                    "tong_san_pham": tong_san_pham,
                    "san_pham": list(san_pham)
                })
            return Response({"dashboard_nhom_hang": data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'], url_path='tim_kiem')
    def tim_kiem(self, request):
        try:
            ten_nhom_query = request.query_params.get('ten_nhom', None)
            ten_san_pham_query = request.query_params.get('ten_san_pham', None)
            nhom_hang = NhomHang.objects.all()
            if ten_nhom_query:
                nhom_hang = nhom_hang.filter(ten_nhom__icontains=ten_nhom_query)
            if ten_san_pham_query:
                nhom_hang = nhom_hang.filter(sanpham__ten_san_pham__icontains=ten_san_pham_query).distinct()

            data = []
            for nh in nhom_hang:
                ten_nhom = nh.ten_nhom
                tong_san_pham = SanPham.objects.filter(nhom_hang=nh).count()
                san_pham = SanPham.objects.filter(nhom_hang=nh).values('ten_san_pham', 'dung_tich', 'so_luong_per_thung')
                data.append({
                    "ten_nhom": ten_nhom,
                    "tong_san_pham": tong_san_pham,
                    "san_pham": list(san_pham)
                })
            return Response({"tim_kiem": data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class SanPhamViewSet(viewsets.ModelViewSet):
    queryset = SanPham.objects.all()  
    serializer_class = SanPhamSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['nhom_hang']

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'], url_path='dropdown_them_sua')
    def dropdown_them_sua(self, request):
        try:
            nhom_hang_dropdown = NhomHang.objects.values('id', 'ten_nhom').distinct()
            nha_cung_cap_dropdown = NhaCungCap.objects.values('id', 'ten_nha_cung_cap').distinct()

            return Response({
                    "nhom_hang_dropdown": list(nhom_hang_dropdown),
                    "nha_cung_cap_dropdown": list(nha_cung_cap_dropdown)
                }, status=status.HTTP_200_OK)      
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class NhaCungCapViewSet(viewsets.ModelViewSet):
    queryset = NhaCungCap.objects.all()
    serializer_class = NhaCungCapSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TinhTrangHangViewSet(viewsets.ModelViewSet):
    queryset = TinhTrangHang.objects.all()
    serializer_class = TinhTrangHangSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['loai_tinh_trang', 'created_at']

    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard(self, request):
        try:
            data = []
            loai_tinh_trang = TinhTrangHang.objects.values_list('loai_tinh_trang', flat=True).distinct()

            for loai in loai_tinh_trang:
                pallet_ma = TinhTrangHang.objects.values_list('pallet', flat=True).filter(loai_tinh_trang = loai)
                pallets = Pallets.objects.values('ma_pallet', 'ten_san_pham', 'han_su_dung', 'ngay_kiem_tra_cl', 'so_thung_con_lai', 'vi_tri_kho').filter(ma_pallet__in = pallet_ma)
                ghi_chu = TinhTrangHang.objects.values_list('ghi_chu', flat=True).filter(pallet = pallet_ma)
                data.append({
                    "loai_tinh_trang": loai,
                    "pallets": list(pallets),
                    "ghi_chu": ghi_chu
                })
            return Response({"dashboard_tinh_trang_hang": data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['post'], url_path='tinh_trang_update')
    def tinh_trang_update(self, request):
        try:
            pallet_ma = request.data.get('ma_pallet', None)
            tinh_trang = request.data.get('tinh_trang', None)
            tinh_trang_hang = TinhTrangHang.objects.filter(pallet__ma_pallet = pallet_ma).update(tinh_trang_hang = tinh_trang)
            return Response({"Cập nhật thành công!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['post'], url_path='ghi_chu')
    def ghi_chu(self, request):
        try:
            pallet_ma = request.data.get('ma_pallet', None)
            ghi_chu_in = request.data.get('ghi_chu', None)

            tinh_trang_hang = TinhTrangHang.objects.filter(pallet__ma_pallet = pallet_ma, tinh_trang_hang = 'Sắp_hết_hạn').update(ghi_chu = ghi_chu_in)
            return Response({"Cập nhật thành công!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class KiemKeViewSet(viewsets.ModelViewSet):
    queryset = KiemKe.objects.all()
    serializer_class = KiemKeSerializer

    @action(detail=False, methods=['get'], url_path='drop_down_them_sua')
    def drop_down_them_sua(self, request):
        try:
            khu_vuc_dropdown = KhuVuc.objects.values('id', 'ma_khu_vuc').distinct()
            nhom_hang_dropdown = NhomHang.objects.values('id', 'ten_nhom').distinct()

            return Response({
                    "vi_tri_kho_dropdown": list(khu_vuc_dropdown),
                    "nhom_hang_dropdown": list(nhom_hang_dropdown),
                }, status=status.HTTP_200_OK)      
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='lich_su_kiem_ke')
    def lich_su_kiem_ke(self, request):
        try:
            kiem_ke = KiemKe.objects.all()
            data = []
            for kk in kiem_ke:
                ngay_kiem_ke = kk.ngay_kiem_ke
                loai_kiem_ke = kk.loai_kiem_ke
                pham_vi = kk.pham_vi_kiem_ke
                ghi_chu = kk.ghi_chu
                trang_thai = kk.trang_thai
                chenh_lech = ChiTietKiemKe.objects.filter(kiem_ke=kk).values('chenh_lech')
                data.append({
                    "ngay_kiem_ke": ngay_kiem_ke,
                    "loai_kiem_ke": loai_kiem_ke,
                    "pham_vi": pham_vi,
                    "ghi_chu": ghi_chu,
                    "trang_thai": trang_thai,
                    "chenh_lech": list(chenh_lech)
                })
            return Response({"lich_su_kiem_ke": data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
class ChiTietKiemKeViewSet(viewsets.ModelViewSet):
    queryset = ChiTietKiemKe.objects.all()
    serializer_class = ChiTietKiemKeSerializer

class BaoTriViewSet(viewsets.ModelViewSet):
    queryset = BaoTri.objects.all()
    serializer_class = BaoTriSerializer

    @action(detail=False, methods=['get'], url_path='drop_down_them_sua')
    def drop_down_them_sua(self, request):
        try:
            khu_vuc_dropdown = KhuVuc.objects.values('id', 'ma_khu_vuc').distinct()
            vi_tri_kho_dropdown = ViTriKho.objects.values('id', 'ma_vi_tri').distinct()
            return Response({
                    "khu_vuc_dropdown": list(khu_vuc_dropdown),
                    "vi_tri_kho_dropdown": list(vi_tri_kho_dropdown)
                }, status=status.HTTP_200_OK)      
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'], url_path='ke_hoach_bao_tri')
    def ke_hoach_bao_tri(self, request):
        try:
            data = []
            hom_nay = date.today()
            ke_hoach_hom_nay = BaoTri.objects.filter(ngay_bao_tri=hom_nay).values_list('tieu_de', flat=True)

            thu_trong_tuan = hom_nay.weekday()
            tuan_nay = (hom_nay - timedelta(days=thu_trong_tuan)) + timedelta(days=6)
            ke_hoach_tuan_nay = BaoTri.objects.filter(ngay_bao_tri__range=[hom_nay, tuan_nay]).values('tieu_de', 'thoi_gian_bat_dau', flat=True)
            data.append({
                "hom_nay": hom_nay,
                "ke_hoach_hom_nay": list(ke_hoach_hom_nay),
                "ke_hoach_tuan_nay": list(ke_hoach_tuan_nay)
            })
            return Response({"dashboard_bao_tri": data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    