from rest_framework import serializers
from .models import CuaHang, DonXuat, ChiTietDon, ChiTietViTriCuaHang
from NhapHang.models import Pallets

class ChiTietViTriCuaHangSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChiTietViTriCuaHang
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class CuaHangSerializer(serializers.ModelSerializer):
    dia_chi_chi_tiet = serializers.CharField(source='dia_chi.dia_chi_chi_tiet', read_only=True)
    class Meta:
        model = CuaHang
        fields = ['ma_cua_hang', 'ten_cua_hang', 'so_dien_thoai', 'dia_chi', 'dia_chi_chi_tiet', 'trang_thai', 'created_at']
        read_only_fields = ['created_at']
    
    def validate(self, attrs):
        so_dien_thoai = attrs.get('so_dien_thoai')
        if so_dien_thoai:
            if not so_dien_thoai.isdigit():
                raise serializers.ValidationError("Số điện thoại chỉ được chứa chữ số.")
            if len(so_dien_thoai) != 10:
                raise serializers.ValidationError("Số điện thoại phải đúng 10 chữ số.")

        ten_cua_hang = attrs.get('ten_cua_hang')
        if ten_cua_hang:
            if attrs['ten_cua_hang'] == '':
                raise serializers.ValidationError("Tên cửa hàng không được để trống.")
            if len(ten_cua_hang) >= 100:
                raise serializers.ValidationError("Không được vượt quá 100 kí tự.")
            
        return attrs
    
class DonXuatSerializer(serializers.ModelSerializer):
    ten_cua_hang = serializers.CharField(source='cua_hang.ten_cua_hang', read_only=True)

    class Meta:
        model = DonXuat
        fields = ['ma_don', 'cua_hang', 'ten_cua_hang', 'ngay_tao', 'ngay_giao', 'trang_thai', 'qr_code_data', 'da_in_qr', 'nguoi_tao', 'ghi_chu', 'created_at']
        read_only_fields = ['created_at']

    def get_trang_thai(self, obj):
        return obj.get_trang_thai_display()

class PalletsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pallets
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ChiTietDonSerializer(serializers.ModelSerializer):
    ma_don_xuat = serializers.CharField(source='don_xuat.ma_don', read_only=True)
    ten_san_pham = serializers.CharField(source='san_pham.ten_san_pham', read_only=True)

    class Meta:
        model = ChiTietDon
        fields = [
            'don_xuat', 
            'ma_don_xuat', 
            'san_pham', 
            'ten_san_pham', 
            'so_luong_can', 
            'pallet_assignments',
            'da_xuat_xong',
            'created_at'
        ]
        read_only_fields = ['created_at']
    
    def validate(self, attrs):
        if attrs['so_luong_can'] <= 0:
            raise serializers.ValidationError("Số lượng không thể nhỏ hơn 0.")
        return attrs
    

