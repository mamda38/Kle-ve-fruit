from rest_framework import serializers
from .models import ViTriKho, KhuVuc, NhomHang, SanPham, NhaCungCap, TinhTrangHang, KiemKe, ChiTietKiemKe, BaoTri


class KhuVucSerializer(serializers.ModelSerializer):
    class Meta:
        model = KhuVuc
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ViTriKhoSerializer(serializers.ModelSerializer):
    ten_khu_vuc = serializers.CharField(source='khu_vuc.ten_khu_vuc', read_only=True)
    class Meta:
        model = ViTriKho
        fields = ['ma_vi_tri', 'khu_vuc', 'ten_khu_vuc', 'hang', 'cot', 'loai_vi_tri',
                  'tai_trong_max', 'chieu_cao_max', 'trang_thai', 'uu_tien_fifo',
                   'gan_cua_ra', 'vi_tri_cach_ly', 'ghi_chu', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class BaoTriSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaoTri
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, attrs):
        if attrs['ngay_bat_dau'] is None or attrs['ngay_ket_thuc'] is None:
            raise serializers.ValidationError("Ngày bắt đầu và ngày kết thúc không được để trống.")
        if attrs['ngay_bat_dau'] >= attrs['ngay_ket_thuc']:
            raise serializers.ValidationError("Ngày bắt đầu phải trước ngày kết thúc.")
        return attrs

class NhomHangSerializer(serializers.ModelSerializer):
    class Meta:
        model = NhomHang
        fields = '__all__'
        read_only_fields = ['created_at']

class SanPhamSerializer(serializers.ModelSerializer):
    ten_nhom_hang = serializers.CharField(source='nhom_hang.ten_nhom', read_only=True)
    ten_nha_cung_cap = serializers.CharField(source='nha_cung_cap.ten_nha_cung_cap', read_only=True)

    class Meta:
        model = SanPham
        fields = ['ma_san_pham', 'ten_san_pham', 'nhom_hang', 'ten_nhom_hang', 'thuong_hieu', 'dung_tich',
                  'don_vi_tinh', 'so_luong_per_thung', 'ma_vach', 'nha_cung_cap', 'ten_nha_cung_cap',
                   'han_su_dung_mac_dinh', 'chu_ky_kiem_tra_cl', 'hinh_anh', 'mo_ta', 'trang_thai', 'created_at']
        read_only_fields = ['created_at']
    
    def validate(self, attrs):
        if attrs['so_luong_per_thung'] <= 0:
            raise serializers.ValidationError("Số lượng không thể nhỏ hơn 0.")
        if attrs['so_luong_per_thung'] is None:
            raise serializers.ValidationError("Số lượng không thể nhỏ hơn 0.")
        return attrs
    
class NhaCungCapSerializer(serializers.ModelSerializer):
    class Meta:
        model = NhaCungCap
        fields = '__all__'
        read_only_fields = ['created_at']
    
    def validate(self, attrs):
        so_dien_thoai = attrs.get('so_dien_thoai')
        so_dien_thoai_lien_he = attrs.get('so_dien_thoai_lien_he')

        if so_dien_thoai_lien_he:
            if not so_dien_thoai_lien_he.isdigit():
                raise serializers.ValidationError("Số điện thoại chỉ được chứa chữ số.")
            if len(so_dien_thoai_lien_he) != 10:
                raise serializers.ValidationError("Số điện thoại phải đúng 10 chữ số.")

        if so_dien_thoai:
            if not so_dien_thoai.isdigit():
                raise serializers.ValidationError("Số điện thoại chỉ được chứa chữ số.")
            if len(so_dien_thoai) != 10:
                raise serializers.ValidationError("Số điện thoại phải đúng 10 chữ số.")
        
        return attrs

class TinhTrangHangSerializer(serializers.ModelSerializer):
    class Meta:
        model = TinhTrangHang
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class KiemKeSerializer(serializers.ModelSerializer):
    class Meta:
        model = KiemKe
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ChiTietKiemKeSerializer(serializers.ModelSerializer):
    ma_kiem_ke = serializers.CharField(source='phien_kiem_ke.ma_kiem_ke', read_only=True)
    ma_pallet = serializers.CharField(source='pallet.ma_pallet', read_only=True)
    ma_vi_tri = serializers.CharField(source='vi_tri_kho.ma_vi_tri', read_only=True)
    ten_san_pham = serializers.CharField(source='san_pham.ten_san_pham', read_only=True)

    class Meta:
        model = ChiTietKiemKe
        fields = [
            'id',
            'phien_kiem_ke',
            'ma_kiem_ke',
            'pallet',
            'ma_pallet',
            'vi_tri_kho',
            'ma_vi_tri',
            'san_pham',
            'ten_san_pham',
            'so_thung_he_thong',
            'han_su_dung_he_thong',
            'trang_thai_he_thong',
            'so_thung_thuc_te',
            'han_su_dung_thuc_te',
            'trang_thai_thuc_te',
            'tinh_trang_chat_luong',
            'chenh_lech_so_luong',
            'nguoi_kiem_ke',
            'thoi_gian_kiem_ke',
            'hinh_anh',
            'ghi_chu',
            'da_xu_ly_chenh_lech',
            'created_at',
            'updated_at',
        ]

        read_only_fields = ['created_at', 'updated_at']

