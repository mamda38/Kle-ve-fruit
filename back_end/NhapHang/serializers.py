from rest_framework import serializers
from .models import Pallets

class PalletsSerializers(serializers.ModelSerializer):
    ten_san_pham = serializers.CharField(source='san_pham.ten_san_pham', read_only=True)
    ten_nha_cung_cap = serializers.CharField(source='nha_cung_cap.ten_nha_cung_cap', read_only=True)
    ma_vi_tri_kho = serializers.CharField(source='vi_tri_kho.ma_vi_tri', read_only=True)

    class Meta:
        model = Pallets
        fields = [
            'ma_pallet', 
            'san_pham', 
            'ten_san_pham',
            'nha_cung_cap',
            'ten_nha_cung_cap',
            'so_thung_ban_dau', 
            'so_thung_con_lai', 
            'vi_tri_kho', 
            'ma_vi_tri_kho',  
            'ngay_san_xuat', 
            'han_su_dung', 
            'ngay_kiem_tra_cl', 
            'trang_thai',
            'ghi_chu',
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, attrs):
        so_thung_ban_dau = attrs.get('so_thung_ban_dau')
        so_thung_con_lai = attrs.get('so_thung_con_lai')

        if so_thung_ban_dau is None or so_thung_con_lai is None:
            raise serializers.ValidationError("Cần nhập cả số thùng ban đầu và số thùng còn lại.")

        if so_thung_ban_dau < so_thung_con_lai:
            raise serializers.ValidationError("Số thùng ban đầu không được nhỏ hơn số thùng còn lại.")

        return attrs
        