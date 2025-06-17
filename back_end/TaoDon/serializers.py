from rest_framework import serializers
from .models import CuaHang, DonXuat, ChiTietDon
from NhapHang.models import Pallets

class CuaHangSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuaHang
        fields = ['ma_cua_hang', 'ten_cua_hang', 'dia_chi', 'so_dien_thoai', 'khu_vuc', 'trang_thai', 'created_at']
        read_only_fields = ['created_at']
    
    def validate(self, attrs):
        if attrs['so_dien_thoai'] and not attrs['so_dien_thoai'].isdigit():
            raise serializers.ValidationError("Số điện thoại chỉ được chứa chữ số.")
        return attrs

class CuaHangQuanLySerializer(serializers.ModelSerializer):
    class Meta:
        model = CuaHang
        fields = ['ten_cua_hang', 'dia_chi', 'so_dien_thoai']
    
class DonXuatSerializer(serializers.ModelSerializer):
    trang_thai = serializers.SerializerMethodField()
    cua_hang = serializers.SlugRelatedField(
        slug_field='ten_cua_hang',  
        queryset=CuaHang.objects.all()  
    )
    class Meta:
        model = DonXuat
        fields = '__all__'
        read_only_fields = ['created_at']

    def get_trang_thai(self, obj):
        return obj.get_trang_thai_display()

class PalletsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pallets
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ChiTietDonSerializer(serializers.ModelSerializer):
    don_xuat = serializers.SlugRelatedField(
        slug_field='ma_don',  
        queryset=DonXuat.objects.all()  
    )

    class Meta:
        model = ChiTietDon
        fields = '__all__'
        read_only_fields = ['created_at']
    
    def validate(self, attrs):
        if attrs['so_luong_can'] <= 0:
            raise serializers.ValidationError("Số lượng không thể nhỏ hơn 0.")
        return attrs
    

