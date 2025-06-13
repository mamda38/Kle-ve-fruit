"use client"

import { useState } from "react"
import { Package, MapPin, AlertTriangle, TrendingUp, Wrench, CheckCircle, BarChart3 } from "lucide-react"

const DashboardKho = () => {
  const [stats, setStats] = useState({
    totalPositions: 150,
    emptyPositions: 45,
    totalPallets: 105,
    fullPositions: 90,
    maintenanceNeeded: 15,
    underMaintenance: 15,
    utilizationRate: 60,
    efficiency: 85,
  })

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "warning",
      icon: AlertTriangle,
      message: "5 pallet sắp hết hạn trong 3 ngày",
      priority: "high",
      time: "2 giờ trước",
    },
    {
      id: 2,
      type: "maintenance",
      icon: Wrench,
      message: "Khu vực B cần bảo trì định kỳ",
      priority: "medium",
      time: "4 giờ trước",
    },
    {
      id: 3,
      type: "capacity",
      icon: Package,
      message: "Kho đang đầy 85% - cần mở rộng",
      priority: "high",
      time: "6 giờ trước",
    },
    {
      id: 4,
      type: "quality",
      icon: CheckCircle,
      message: "12 pallet cần kiểm tra CL hôm nay",
      priority: "medium",
      time: "1 ngày trước",
    },
  ])

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      action: "Nhập kho",
      location: "A-15",
      product: "Coca Cola 24 lon",
      quantity: "50 thùng",
      time: "10:30",
      status: "completed",
    },
    {
      id: 2,
      action: "Xuất kho",
      location: "B-08",
      product: "Pepsi 12 lon",
      quantity: "30 thùng",
      time: "09:45",
      status: "completed",
    },
    {
      id: 3,
      action: "Bảo trì",
      location: "C-Zone",
      product: "Khu vực C",
      quantity: "16 vị trí",
      time: "08:00",
      status: "in-progress",
    },
  ])

  const overviewCards = [
    {
      title: "Tổng vị trí",
      value: stats.totalPositions,
      icon: MapPin,
      color: "#3b82f6",
      subtitle: "vị trí trong kho",
    },
    {
      title: "Trống",
      value: stats.emptyPositions,
      icon: Package,
      color: "#10b981",
      subtitle: "vị trí có thể sử dụng",
    },
    {
      title: "Tổng pallet",
      value: stats.totalPallets,
      icon: Package,
      color: "#f59e0b",
      subtitle: "pallet đang lưu kho",
    },
    {
      title: "Đầy",
      value: stats.fullPositions,
      icon: Package,
      color: "#ef4444",
      subtitle: "vị trí đã sử dụng",
    },
    {
      title: "Cần bảo trì",
      value: stats.maintenanceNeeded,
      icon: AlertTriangle,
      color: "#f97316",
      subtitle: "vị trí cần bảo trì",
    },
    {
      title: "Đang bảo trì",
      value: stats.underMaintenance,
      icon: Wrench,
      color: "#8b5cf6",
      subtitle: "vị trí đang bảo trì",
    },
    {
      title: "Tỷ lệ sử dụng",
      value: `${stats.utilizationRate}%`,
      icon: BarChart3,
      color: "#06b6d4",
      subtitle: "hiệu suất sử dụng",
    },
    {
      title: "Hiệu suất",
      value: `${stats.efficiency}%`,
      icon: TrendingUp,
      color: "#84cc16",
      subtitle: "hiệu suất tổng thể",
    },
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#10b981"
      case "in-progress":
        return "#f59e0b"
      case "pending":
        return "#6b7280"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className="dashboard-kho">
      {/* Tổng quan */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Tổng quan</h2>
          <span className="section-subtitle">Cập nhật lúc: {new Date().toLocaleTimeString("vi-VN")}</span>
        </div>

        <div className="overview-grid">
          {overviewCards.map((card, index) => (
            <div key={index} className="overview-card">
              <div className="card-content">
                <div className="card-info">
                  <h3 className="card-title">{card.title}</h3>
                  <div className="card-value">{card.value}</div>
                  <p className="card-subtitle">{card.subtitle}</p>
                </div>
                <div className="card-icon" style={{ backgroundColor: `${card.color}20` }}>
                  <card.icon size={24} style={{ color: card.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cảnh báo */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Cảnh báo</h2>
          <span className="alert-count">{alerts.length} cảnh báo</span>
        </div>

        <div className="alerts-container">
          {alerts.map((alert) => (
            <div key={alert.id} className="alert-item">
              <div className="alert-icon" style={{ color: getPriorityColor(alert.priority) }}>
                <alert.icon size={20} />
              </div>
              <div className="alert-content">
                <p className="alert-message">{alert.message}</p>
                <span className="alert-time">{alert.time}</span>
              </div>
              <div className="alert-priority">
                <span
                  className={`priority-badge priority-${alert.priority}`}
                  style={{
                    backgroundColor: `${getPriorityColor(alert.priority)}20`,
                    color: getPriorityColor(alert.priority),
                  }}
                >
                  {alert.priority === "high" ? "Cao" : alert.priority === "medium" ? "Trung bình" : "Thấp"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hoạt động gần đây */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Hoạt động gần đây</h2>
          <button className="btn btn-outline">Xem tất cả</button>
        </div>

        <div className="activities-container">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-info">
                <div className="activity-header">
                  <span className="activity-action">{activity.action}</span>
                  <span className="activity-location">{activity.location}</span>
                </div>
                <div className="activity-details">
                  <span className="activity-product">{activity.product}</span>
                  <span className="activity-quantity">{activity.quantity}</span>
                </div>
              </div>
              <div className="activity-meta">
                <span className="activity-time">{activity.time}</span>
                <span className="activity-status" style={{ color: getStatusColor(activity.status) }}>
                  {activity.status === "completed"
                    ? "Hoàn thành"
                    : activity.status === "in-progress"
                      ? "Đang thực hiện"
                      : "Chờ xử lý"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Thao tác nhanh</h2>
        </div>

        <div className="quick-actions">
          <button className="action-btn action-primary">
            <MapPin size={20} />
            <span>Quản lý vị trí</span>
          </button>
          <button className="action-btn action-secondary">
            <Package size={20} />
            <span>Quản lý hàng hóa</span>
          </button>
          <button className="action-btn action-warning">
            <Wrench size={20} />
            <span>Bảo trì</span>
          </button>
          <button className="action-btn action-info">
            <BarChart3 size={20} />
            <span>Báo cáo</span>
          </button>
        </div>
      </div> */}
    </div>
  )
}

export default DashboardKho
