from django.db import models
from NhapHang.models import Pallets

# Create your models here.
class CuaHang(models.Model):
    ma_cua_hang = models.CharField(unique=True, max_length=20, null=False)
    ten_cua_hang = models.CharField(max_length=100, null=False)
    dia_chi = models.TextField(null=False)
    so_dien_thoai = models.CharField(max_length=15, blank=True, null=True)
    khu_vuc = models.CharField(max_length=50, blank=True, null=True)
    trang_thai = models.CharField(max_length=9, choices=[
        ('Hoạt_động', 'Hoạt động'),
        ('Tạm_dừng', 'Tạm dừng')
    ], default='Hoạt_động')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cua_hang'
        verbose_name = 'Cửa hàng'
        verbose_name_plural = 'Cửa hàng'
    
    def __str__(self):
        return self.ten_cua_hang

class DonXuat(models.Model):
    ma_don = models.CharField(unique=True, max_length=20)
    cua_hang = models.ForeignKey(CuaHang, models.CASCADE)
    ngay_tao = models.DateField()
    ngay_giao = models.DateField(blank=True, null=True)
    trang_thai = models.CharField(max_length=10, choices=[
        ('Chờ_xuất', 'Chờ xuất'),
        ('Đang_xuất', 'Đang xuất'),
        ('Hoàn_thành', 'Hoàn thành'),
        ('Hủy', 'Hủy')
    ], default='Chờ_xuất')
    qr_code_data = models.TextField(blank=True, null=True)
    da_in_qr = models.BooleanField(blank=True, null=True, default=False)
    nguoi_tao = models.CharField(max_length=50, blank=True, null=True)
    ghi_chu = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'don_xuat'

    def __str__(self):
        return self.ma_don

class LichSuXuatNhap(models.Model):
    pallet = models.ForeignKey(Pallets, models.CASCADE)
    loai_giao_dich = models.CharField(max_length=4)
    so_luong = models.IntegerField()
    don_xuat = models.ForeignKey(DonXuat, models.CASCADE, blank=True, null=True)
    nguoi_thuc_hien = models.CharField(max_length=50, blank=True, null=True)
    ngay_thuc_hien = models.DateTimeField(blank=True, null=True)
    ghi_chu = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'lich_su_xuat_nhap'

class ThuTuXuatHang(models.Model):
    don_xuat = models.ForeignKey(DonXuat, models.CASCADE)
    san_pham = models.CharField(max_length=100)
    thu_tu_mac_dinh = models.IntegerField()
    thu_tu_tuy_chinh = models.IntegerField(blank=True, null=True)
    thoi_gian_uoc_tinh = models.IntegerField(blank=True, null=True)
    khoang_cach_uoc_tinh = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'thu_tu_xuat_hang'

class ChiTietDon(models.Model):
    don_xuat = models.ForeignKey('DonXuat', models.CASCADE)
    san_pham = models.CharField(max_length=100)
    so_luong_can = models.IntegerField()
    pallet_assignments = models.JSONField(blank=True, null=True)
    da_xuat_xong = models.BooleanField(blank=True, null=True, default=False)
    ghi_chu = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'chi_tiet_don'

