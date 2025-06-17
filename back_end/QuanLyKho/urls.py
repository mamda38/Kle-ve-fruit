from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ViTriKhoViewSet, KhuVucViewSet, NhomHangViewSet, SanPhamViewSet, NhaCungCapViewSet, TinhTrangHangViewSet, KiemKeViewSet, ChiTietKiemKeViewSet, BaoTriViewSet

router = DefaultRouter()
router.register(r'vitrikho', ViTriKhoViewSet)
router.register(r'khuvuc', KhuVucViewSet)
router.register(r'nhomhang', NhomHangViewSet)
router.register(r'sanpham', SanPhamViewSet)
router.register(r'nhacungcap', NhaCungCapViewSet)
router.register(r'tinhtranghang', TinhTrangHangViewSet)
router.register(r'kiemke', KiemKeViewSet)
router.register(r'chitietkiemke', ChiTietKiemKeViewSet)
router.register(r'baotri', BaoTriViewSet)

urlpatterns = [
    path('', include(router.urls)),
]