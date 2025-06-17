from rest_framework import serializers
from TaoDon.models import DonXuat

class DonXuatSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonXuat
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
