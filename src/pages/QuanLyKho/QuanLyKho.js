import { Routes, Route, Link, useLocation } from "react-router-dom"
import {
  BarChart3,
  MapPin,
  Package,
  Wrench,
  FileText,
  Settings,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import DashboardKho from "./DashboardKho"
import QuanLyViTri from "./QuanLyViTri"
import BaoTriKho from "./BaoTriKho"
import BaoCaoKho from "./BaoCaoKho"
import CaiDatKho from "./CaiDatKho"
import "./QuanLyKho.css"
import QuanLyHangHoaTree from "./QuanLyHangHoaTree"
import QuanLyTinhTrangHang from "./QuanLyTinhTrangHang"
import KiemKeKho from "./KiemKeKho"

const QuanLyKho = () => {
  const location = useLocation()
  const currentPath = location.pathname

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: BarChart3,
      path: "/quan-ly-kho",
      description: "Tổng quan tình trạng kho",
    },
    {
      id: "vi-tri",
      title: "Quản lý vị trí",
      icon: MapPin,
      path: "/quan-ly-kho/vi-tri",
      description: "Cấu hình và quản lý vị trí kho",
    },
    {
      id: "hang-hoa",
      title: "Quản lý hàng hóa",
      icon: Package,
      path: "/quan-ly-kho/hang-hoa",
      description: "Theo dõi hàng hóa trong kho",
    },
    {
      id: "tinh-trang",
      title: "Tình trạng hàng",
      icon: AlertTriangle,
      path: "/quan-ly-kho/tinh-trang",
      description: "Quản lý tình trạng hàng hóa",
    },
    {
      id: "kiem-ke",
      title: "Kiểm kê kho",
      icon: CheckCircle,
      path: "/quan-ly-kho/kiem-ke",
      description: "Thực hiện kiểm kê định kỳ",
    },
    {
      id: "bao-tri",
      title: "Bảo trì",
      icon: Wrench,
      path: "/quan-ly-kho/bao-tri",
      description: "Lập lịch và theo dõi bảo trì",
    },
    {
      id: "bao-cao",
      title: "Báo cáo",
      icon: FileText,
      path: "/quan-ly-kho/bao-cao",
      description: "Phân tích hiệu suất kho",
    },
    {
      id: "cai-dat",
      title: "Cài đặt",
      icon: Settings,
      path: "/quan-ly-kho/cai-dat",
      description: "Cấu hình hệ thống kho",
    },
  ]

  const isMainPage = currentPath === "/quan-ly-kho"

  return (
    <div className="quan-ly-kho">
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="page-title">
              {!isMainPage && (
                <Link to="/quan-ly-kho" className="back-button">
                  <ArrowLeft size={20} />
                </Link>
              )}
              Quản lý kho
            </h1>
            <p className="page-subtitle">Quản lý toàn diện hệ thống kho bãi và hàng hóa</p>
          </div>
          <div className="header-actions">
            <span className="status-badge status-active">Hệ thống hoạt động</span>
          </div>
        </div>
      </div>

      {isMainPage && (
        <div className="menu-grid">
          {menuItems.slice(1).map((item) => (
            <Link key={item.id} to={item.path} className="menu-card">
              <div className="menu-icon">
                <item.icon size={24} />
              </div>
              <div className="menu-content">
                <h3 className="menu-title">{item.title}</h3>
                <p className="menu-description">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="page-content">
        <Routes>
          <Route path="/" element={<DashboardKho />} />
          <Route path="/vi-tri" element={<QuanLyViTri />} />
          <Route path="/hang-hoa" element={<QuanLyHangHoaTree />} />
          <Route path="/tinh-trang" element={<QuanLyTinhTrangHang />} />
          <Route path="/kiem-ke" element={<KiemKeKho />} />
          <Route path="/bao-tri" element={<BaoTriKho />} />
          <Route path="/bao-cao" element={<BaoCaoKho />} />
          <Route path="/cai-dat" element={<CaiDatKho />} />
        </Routes>
      </div>
    </div>
  )
}

export default QuanLyKho
