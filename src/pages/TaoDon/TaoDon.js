"use client"

import { useState } from "react"
import { useLocation } from "react-router-dom"
import { Store, Package, FileText } from "lucide-react"
import QuanLyCuaHang from "./QuanLyCuaHang"
import QuanLySanPham from "./QuanLySanPham"
import TaoDonXuat from "./TaoDonXuat"
import "./TaoDon.css"

const TaoDon = () => {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname
    if (path.includes("/cua-hang")) return "cua-hang"
    if (path.includes("/san-pham")) return "san-pham"
    if (path.includes("/tao-don-xuat")) return "tao-don-xuat"
    return "cua-hang"
  })

  const tabs = [
    {
      id: "cua-hang",
      title: "Quản lý Cửa hàng",
      icon: Store,
      component: QuanLyCuaHang,
    },
    {
      id: "san-pham",
      title: "Quản lý Sản phẩm",
      icon: Package,
      component: QuanLySanPham,
    },
    {
      id: "tao-don-xuat",
      title: "Tạo đơn xuất",
      icon: FileText,
      component: TaoDonXuat,
    },
  ]

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component

  return (
    <div className="tao-don">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tạo đơn</h1>
          <p className="page-subtitle">Quản lý cửa hàng, sản phẩm và tạo đơn xuất hàng</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">{ActiveComponent && <ActiveComponent />}</div>
    </div>
  )
}

export default TaoDon
