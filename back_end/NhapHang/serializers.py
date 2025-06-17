from rest_framework import serializers
from .models import Pallets

class PalletsSerializers(serializers.ModelSerializer):
    class Meta:
        model = Pallets
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, attrs):
        if attrs.get('so_thung_ban_dau', 0) < attrs.get('so_thung_con_lai', 0):
            raise serializers.ValidationError("Số thùng ban đầu không được nhỏ hơn số thùng còn lại.")
        return attrs
