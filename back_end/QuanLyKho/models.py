from django.db import models
from NhapHang.models import Pallets

# Create your models here.
class KhuVuc(models.Model):
    ma_khu_vuc = models.CharField(unique=True, max_length=10)
    ten_khu_vuc = models.CharField(max_length=100)
    mo_ta = models.TextField(blank=True, null=True)
    kich_thuoc_hang = models.IntegerField()
    kich_thuoc_cot = models.IntegerField()
    tai_trong_max = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    nhiet_do_min = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    nhiet_do_max = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    do_am_min = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    do_am_max = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    trang_thai = models.CharField(max_length=9, choices=[
        ('Hoạt_động', 'Hoạt động'),
        ('Bảo_trì', 'Bảo trì'),
        ('Ngừng', 'Ngừng')
    ], default='Hoạt_động')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'khu_vuc'

    def __str__(self):
        return self.ma_khu_vuc

class ViTriKho(models.Model):
    ma_vi_tri = models.CharField(unique=True, max_length=10)
    khu_vuc = models.ForeignKey(KhuVuc, models.CASCADE)
    hang = models.CharField(max_length=1)
    cot = models.IntegerField()
    loai_vi_tri = models.CharField(max_length=6, choices=[
        ('Pallet', 'Pallet'),
        ('Carton', 'Carton'),
        ('Bulk', 'Bulk')
    ], default='Pallet')
    tai_trong_max = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    chieu_cao_max = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    trang_thai = models.CharField(max_length=7,choices=[
        ('Trống', 'Trống'),
        ('Có_hàng', 'Có hàng'),
        ('Bảo_trì', 'Bảo trì'),
        ('Hỏng', 'Hỏng')
    ], default='Trống')
    pallet = models.ForeignKey(Pallets, models.CASCADE, blank=True, null=True)
    uu_tien_fifo = models.BooleanField(blank=True, null=True, default=True)
    gan_cua_ra = models.BooleanField(blank=True, null=True, default=False)
    vi_tri_cach_ly = models.BooleanField(blank=True, null=True, default=False)
    ghi_chu = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vi_tri_kho'
        unique_together = (('hang', 'cot'),)

class BaoTri(models.Model):
    ma_bao_tri = models.CharField(unique=True, max_length=20)
    tieu_de = models.CharField(max_length=200)
    loai_bao_tri = models.CharField(max_length=9, choices=[
        ('Vệ_sinh', 'Vệ sinh'),
        ('Sửa_chữa', 'Sửa chữa'),
        ('Kiểm_tra', 'Kiểm tra'),
        ('Thay_thế', 'Thay thế'),
        ('Bảo_dưỡng', 'Bảo dưỡng')
    ], null=False)
    doi_tuong = models.CharField(max_length=8, choices=[
        ('Khu_vực', 'Khu vực'),
        ('Vị_trí', 'Vị trí'),
        ('Thiết_bị', 'Thiết bị'),
        ('Hệ_thống', 'Hệ thống')
    ], null=False)
    doi_tuong_id = models.CharField(max_length=50, blank=True, null=True)
    mo_ta = models.TextField()
    muc_do_uu_tien = models.CharField(max_length=8, blank=True, null=True)
    nguoi_tao = models.CharField(max_length=50)
    nguoi_thuc_hien = models.JSONField(blank=True, null=True)
    thoi_gian_bat_dau = models.DateTimeField(blank=True, null=True)
    thoi_gian_ket_thuc = models.DateTimeField(blank=True, null=True)
    thoi_gian_uoc_tinh = models.IntegerField(blank=True, null=True)
    chi_phi_uoc_tinh = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    chi_phi_thuc_te = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    trang_thai = models.CharField(max_length=14, choices=[
        ('Kế_hoạch', 'Kế hoạch'),
        ('Đang_thực_hiện', 'Đang_thực_hiện'),
        ('Hoàn_thành', 'Hoàn thành'),
        ('Tạm_dừng', 'Tạm dừng'),
        ('Hủy', 'Hủy')
    ], default='Kế_hoạch')
    ket_qua = models.TextField(blank=True, null=True)
    hinh_anh_truoc = models.JSONField(blank=True, null=True)
    hinh_anh_sau = models.JSONField(blank=True, null=True)
    ghi_chu = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bao_tri'

class NhomHang(models.Model):
    ma_nhom = models.CharField(unique=True, max_length=20)
    ten_nhom = models.CharField(max_length=100)
    mo_ta = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    mau_sac = models.CharField(max_length=7, blank=True, null=True)
    yeu_cau_nhiet_do_min = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    yeu_cau_nhiet_do_max = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    yeu_cau_do_am_min = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    yeu_cau_do_am_max = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    tranh_anh_sang = models.BooleanField(blank=True, null=True, default=False)
    tranh_rung_dong = models.BooleanField(blank=True, null=True, default=False)
    hang_de_vo = models.BooleanField(blank=True, null=True, default=False)
    hang_nguy_hiem = models.BooleanField(blank=True, null=True, default=False)
    thu_tu_hien_thi = models.IntegerField(blank=True, null=True)
    trang_thai = models.CharField(max_length=9, choices=[
        ('Hoạt_động', 'Hoạt động'),
        ('Ngừng', 'Ngừng')
    ], default='Hoạt_động')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'nhom_hang'
    
    def __str__(self):
        return self.ten_nhom

class SanPham(models.Model):
    ma_san_pham = models.CharField(unique=True, max_length=50)
    ten_san_pham = models.CharField(max_length=100)
    nhom_hang = models.ForeignKey(NhomHang, models.CASCADE)
    thuong_hieu = models.CharField(max_length=100, blank=True, null=True)
    dung_tich = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    don_vi_tinh = models.CharField(max_length=20, blank=True, null=True)
    so_luong_per_thung = models.IntegerField(blank=True, null=True)
    ma_vach = models.CharField(max_length=100, blank=True, null=True)
    nha_cung_cap = models.CharField(max_length=100, blank=True, null=True)
    han_su_dung_mac_dinh = models.IntegerField(blank=True, null=True)
    chu_ky_kiem_tra_cl = models.IntegerField(blank=True, null=True)
    hinh_anh = models.CharField(max_length=255, blank=True, null=True)
    mo_ta = models.TextField(blank=True, null=True)
    trang_thai = models.CharField(max_length=9, choices=[
        ('Hoạt_động', 'Hoạt động'),
        ('Ngừng', 'Ngừng')
    ], default='Hoạt_động')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'san_pham'

class NhaCungCap(models.Model):
    ma_nha_cung_cap = models.CharField(unique=True, max_length=20)
    ten_nha_cung_cap = models.CharField(max_length=200)
    dia_chi = models.TextField(blank=True, null=True)
    so_dien_thoai = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    nguoi_lien_he = models.CharField(max_length=100, blank=True, null=True)
    so_dien_thoai_lien_he = models.CharField(max_length=20, blank=True, null=True)
    email_lien_he = models.CharField(max_length=100, blank=True, null=True)
    ma_so_thue = models.CharField(max_length=50, blank=True, null=True)
    loai_hang_cung_cap = models.JSONField(blank=True, null=True)
    xep_hang = models.CharField(max_length=1, blank=True, null=True)
    trang_thai = models.CharField(max_length=9, choices=[
        ('Hoạt_động', 'Hoạt động'),
        ('Tạm_dừng', 'Tạm dừng'),
        ('Ngừng', 'Ngừng')
    ], default='Hoạt_động')
    ghi_chu = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'nha_cung_cap'

class TinhTrangHang(models.Model):
    pallet = models.ForeignKey(Pallets, models.CASCADE)
    loai_tinh_trang = models.CharField(max_length=15, choices=[
        ('Bình_thường', 'Bình thường'),
        ('Sắp_hết_hạn', 'Sắp hết hạn'),
        ('Cần_kiểm_tra_CL', 'Cần kiểm tra CL'),
        ('Có_vấn_đề', 'Có vấn đề'),
        ('Ưu_tiên_xuất', 'Ưu tiên xuất')
    ], null=False)
    muc_do = models.CharField(max_length=8, choices=[
        ('Thấp', 'Thấp'),
        ('Vừa', 'Vừa'),
        ('Cao', 'Cao'),
        ('Khẩn_cấp', 'Khẩn cấp')
    ], default='Vừa')
    mo_ta = models.TextField(blank=True, null=True)
    ngay_phat_hien = models.DateField()
    ngay_xu_ly = models.DateField(blank=True, null=True)
    nguoi_phat_hien = models.CharField(max_length=50, blank=True, null=True)
    nguoi_xu_ly = models.CharField(max_length=50, blank=True, null=True)
    trang_thai = models.CharField(max_length=10, choices=[
        ('Mới', 'Mới'),
        ('Đang_xử_lý', 'Đang xử lý'),
        ('Hoàn_thành', 'Hoàn thành'),
        ('Hủy', 'Hủy')
    ], default='Mới')
    ghi_chu = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tinh_trang_hang'

class KiemKe(models.Model):
    ma_kiem_ke = models.CharField(unique=True, max_length=20)
    ten_kiem_ke = models.CharField(max_length=100)
    loai_kiem_ke = models.CharField(max_length=16, choices=[
        ('Toàn_kho', 'Toàn kho'),
        ('Theo_khu_vuc', 'Theo khu vực'),
        ('Theo_nhom_hang', 'Theo nhóm hàng'),
        ('Theo_han_su_dung', 'Theo hạn sử dụng')
    ], null=False)
    pham_vi_kiem_ke = models.JSONField(blank=True, null=True)
    ngay_kiem_ke = models.DateField()
    nguoi_tao = models.CharField(max_length=50)
    danh_sach_nguoi_kiem_ke = models.JSONField(blank=True, null=True)
    trang_thai = models.CharField(max_length=12, choices=[
        ('Chuẩn_bị', 'Chuẩn bị'),
        ('Đang_kiểm_kê', 'Đang kiểm kê'),
        ('Hoàn_thành', 'Hoàn thành'),
        ('Hủy', 'Hủy')
    ], default='Chuẩn_bị')
    ghi_chu = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'kiem_ke'
    
    def __str__(self):
        return self.ma_kiem_ke

class ChiTietKiemKe(models.Model):
    kiem_ke = models.ForeignKey('KiemKe', models.CASCADE)
    pallet = models.ForeignKey(Pallets, models.CASCADE)
    so_luong_he_thong = models.IntegerField()
    so_luong_thuc_te = models.IntegerField(blank=True, null=True)
    chenh_lech = models.IntegerField(blank=True, null=True)
    trang_thai_hang = models.CharField(max_length=100, blank=True, null=True)
    nguoi_kiem_ke = models.CharField(max_length=50, blank=True, null=True)
    thoi_gian_kiem_ke = models.DateTimeField(blank=True, null=True)
    ghi_chu = models.TextField(blank=True, null=True)
    hinh_anh = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chi_tiet_kiem_ke'