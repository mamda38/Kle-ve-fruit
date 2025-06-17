from rest_framework import serializers
from .models import ViTriKho, KhuVuc, NhomHang, SanPham, NhaCungCap, TinhTrangHang, KiemKe, ChiTietKiemKe, BaoTri

class ViTriKhoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViTriKho
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class KhuVucSerializer(serializers.ModelSerializer):
    class Meta:
        model = KhuVuc
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class NhomHangSerializer(serializers.ModelSerializer):
    class Meta:
        model = NhomHang
        fields = '__all__'
        read_only_fields = ['created_at']

class SanPhamSerializer(serializers.ModelSerializer):
    nhom_hang = serializers.SlugRelatedField(
        slug_field='ten_nhom',  
        queryset=NhomHang.objects.all()  
    )

    class Meta:
        model = SanPham
        fields = '__all__'
        read_only_fields = ['created_at']
    
    def validate(self, attrs):
        if attrs['so_luong_per_thung'] <= 0:
            raise serializers.ValidationError("Số lượng không thể nhỏ hơn 0.")
        return attrs
    
class NhaCungCapSerializer(serializers.ModelSerializer):
    class Meta:
        model = NhaCungCap
        fields = '__all__'
        read_only_fields = ['created_at']

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
    class Meta:
        model = ChiTietKiemKe
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class BaoTriSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaoTri
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, attrs):
        if attrs['ngay_bat_dau'] >= attrs['ngay_ket_thuc']:
            raise serializers.ValidationError("Ngày bắt đầu phải trước ngày kết thúc.")
        return attrs