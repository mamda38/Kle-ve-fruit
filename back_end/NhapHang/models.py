# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from QuanLyKho.models import NhaCungCap, ViTriKho, SanPham

class CaiDatHeThong(models.Model):
    khoa_cai_dat = models.CharField(unique=True, max_length=100)
    gia_tri = models.TextField()
    mo_ta = models.TextField(blank=True, null=True)
    nhom_cai_dat = models.CharField(max_length=50, default='Chung')
    kieu_du_lieu = models.CharField(max_length=7, choices=[
        ('string', 'string'),
        ('number', 'number'),
        ('boolean', 'boolean'),
        ('json', 'json')
    ], default='string')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cai_dat_he_thong'


class LogKiemTraGiaoHang(models.Model):
    don_xuat = models.ForeignKey('TaoDon.DonXuat', models.CASCADE)
    cua_hang_dich = models.CharField(max_length=100, blank=True, null=True)
    cua_hang_thuc = models.CharField(max_length=100, blank=True, null=True)
    ket_qua = models.CharField(max_length=4)
    ngay_kiem_tra = models.DateTimeField(blank=True, null=True)
    nguoi_kiem_tra = models.CharField(max_length=50, blank=True, null=True)
    vi_tri_gps = models.CharField(max_length=100, blank=True, null=True)
    ghi_chu = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'log_kiem_tra_giao_hang'

class Pallets(models.Model):
    ma_pallet = models.CharField(unique=True, max_length=20)
    san_pham = models.ForeignKey(SanPham, models.CASCADE)
    nha_cung_cap = models.ForeignKey(NhaCungCap, models.CASCADE, null=True, blank=True)
    so_thung_ban_dau = models.IntegerField()
    so_thung_con_lai = models.IntegerField()
    vi_tri_kho = models.ForeignKey(ViTriKho, models.CASCADE)
    ngay_san_xuat = models.DateField()
    han_su_dung = models.DateField()
    ngay_kiem_tra_cl = models.DateField()
    trang_thai = models.CharField(max_length=5, choices=[
        ('Mới', 'Mới'),
        ('Đã_mở', 'Đã mở'),
        ('Trống', 'Trống')
    ], default='Mới')
    ghi_chu = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pallets'

    def __str__(self):
        return self.ma_pallet