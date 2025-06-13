"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  BarChart3,
  Package,
  FileText,
  Truck,
  Warehouse,
  CheckCircle,
  PieChart,
  Settings,
  ChevronDown,
} from "lucide-react"
import "./Sidebar.css"

const Sidebar = () => {
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState({})

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: BarChart3,
      path: "/dashboard",
      active: location.pathname === "/dashboard" || location.pathname === "/",
    },
    {
      id: "nhap-hang",
      title: "Nhập hàng",
      icon: Package,
      path: "/nhap-hang",
      active: location.pathname.startsWith("/nhap-hang"),
      // submenu: [
      //   { title: "Thêm Pallet", path: "/nhap-hang/them-pallet" },
      //   { title: "Danh sách Pallet", path: "/nhap-hang/danh-sach" },
      //   { title: "Chi tiết Pallet", path: "/nhap-hang/chi-tiet" },
      // ],
    },
    {
      id: "tao-don",
      title: "Tạo đơn",
      icon: FileText,
      path: "/tao-don",
      active: location.pathname.startsWith("/tao-don"),
      // submenu: [
      //   { title: "Quản lý cửa hàng", path: "/tao-don/cua-hang" },
      //   { title: "Quản lý sản phẩm", path: "/tao-don/san-pham" },
      //   { title: "Tạo đơn xuất", path: "/tao-don/tao-don-xuat" },
      // ],
    },
    {
      id: "xuat-hang",
      title: "Xuất hàng",
      icon: Truck,
      path: "/xuat-hang",
      active: location.pathname.startsWith("/xuat-hang"),
    },
    {
      id: "quan-ly-kho",
      title: "Quản lý kho",
      icon: Warehouse,
      path: "/quan-ly-kho",
      active: location.pathname.startsWith("/quan-ly-kho"),
    },
    {
      id: "kiem-tra",
      title: "Kiểm tra giao hàng",
      icon: CheckCircle,
      path: "/kiem-tra",
      active: location.pathname.startsWith("/kiem-tra"),
    },
    // {
    //   id: "bao-cao",
    //   title: "Báo cáo",
    //   icon: PieChart,
    //   path: "/bao-cao",
    //   active: location.pathname.startsWith("/bao-cao"),
    // },
    // {
    //   id: "settings",
    //   title: "Cài đặt",
    //   icon: Settings,
    //   path: "/settings",
    //   active: location.pathname.startsWith("/settings"),
    // },
  ]

  const toggleSubmenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }))
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <div className="nav-item-wrapper">
                <Link
                  to={item.path}
                  className={`nav-link ${item.active ? "active" : ""}`}
                  onClick={(e) => {
                    if (item.submenu) {
                      e.preventDefault()
                      toggleSubmenu(item.id)
                    }
                  }}
                >
                  <item.icon size={20} className="nav-icon" />
                  <span className="nav-text">{item.title}</span>
                  {item.submenu && (
                    <ChevronDown size={16} className={`nav-arrow ${expandedMenus[item.id] ? "expanded" : ""}`} />
                  )}
                </Link>

                {item.submenu && (
                  <ul className={`submenu ${expandedMenus[item.id] ? "expanded" : ""}`}>
                    {item.submenu.map((subItem, index) => (
                      <li key={index} className="submenu-item">
                        <Link
                          to={subItem.path}
                          className={`submenu-link ${location.pathname === subItem.path ? "active" : ""}`}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
