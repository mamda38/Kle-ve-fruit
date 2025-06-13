"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, X, FileText, Rocket, Edit, Wrench, Trash2, Search } from "lucide-react"

const QuanLyTinhTrangHang = () => {
  const [expiringItems, setExpiringItems] = useState([
    {
      id: "P-2025-001",
      product: "Heineken",
      expiryDate: "2025-06-12",
      quantity: 30,
      unit: "thùng",
      location: "A1",
      daysLeft: 3,
      priority: "high",
    },
    {
      id: "P-2025-015",
      product: "Coca Cola",
      expiryDate: "2025-06-14",
      quantity: 45,
      unit: "thùng",
      location: "C2",
      daysLeft: 5,
      priority: "medium",
    },
  ])

  const [qualityCheckItems, setQualityCheckItems] = useState([
    {
      id: "P-2025-005",
      product: "Tiger",
      checkDate: "2025-06-09",
      location: "B3",
      status: "pending",
    },
    {
      id: "P-2025-020",
      product: "Sprite",
      checkDate: "2025-06-09",
      location: "A5",
      status: "pending",
    },
  ])

  const [problemItems, setProblemItems] = useState([
    {
      id: "P-2025-012",
      product: "Lavie",
      issue: "Bao bì hỏng",
      location: "C8",
      reportDate: "2025-06-08",
      severity: "medium",
    },
  ])

  const [filterType, setFilterType] = useState("all")
  const [filterDate, setFilterDate] = useState("today")
  const [searchTerm, setSearchTerm] = useState("")

  const handlePriorityExport = (itemId) => {
    setExpiringItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, priority: "urgent" } : item)))
  }

  const handleQualityCheck = (itemId, status) => {
    setQualityCheckItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status, checkedDate: new Date().toISOString() } : item)),
    )
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "#dc2626"
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "#dc2626"
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

  return (
    <div className="quan-ly-tinh-trang-hang">
      <div className="page-header">
        <div className="filters-section">
          <div className="filter-controls">
            <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="expiring">Sắp hết hạn</option>
              <option value="quality">Cần kiểm tra CL</option>
              <option value="problems">Có vấn đề</option>
            </select>
            <select className="filter-select" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="all">Tất cả</option>
            </select>
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="status-sections">
        {/* Hàng sắp hết hạn */}
        {(filterType === "all" || filterType === "expiring") && (
          <div className="status-section">
            <div className="section-header">
              <h3 className="section-title">
                <AlertTriangle size={20} className="warning-icon" />
                Hàng sắp hết hạn
              </h3>
              <span className="item-count">{expiringItems.length} mục</span>
            </div>

            <div className="items-container">
              {expiringItems.map((item) => (
                <div key={item.id} className="status-item expiring-item">
                  <div className="item-header">
                    <div className="item-info">
                      <span className="item-id">{item.id}</span>
                      <span className="item-product">{item.product}</span>
                      <span className="item-expiry">HSD: {new Date(item.expiryDate).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div
                      className="priority-badge"
                      style={{
                        backgroundColor: `${getPriorityColor(item.priority)}20`,
                        color: getPriorityColor(item.priority),
                      }}
                    >
                      {item.daysLeft} ngày
                    </div>
                  </div>

                  <div className="item-details">
                    <span className="detail-item">
                      Còn: {item.quantity} {item.unit}
                    </span>
                    <span className="detail-item">Vị trí: {item.location}</span>
                  </div>

                  <div className="item-actions">
                    <button className="action-btn priority" onClick={() => handlePriorityExport(item.id)}>
                      <Rocket size={16} />
                      Ưu tiên xuất
                    </button>
                    <button className="action-btn note">
                      <Edit size={16} />
                      Ghi chú
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hàng cần kiểm tra CL */}
        {(filterType === "all" || filterType === "quality") && (
          <div className="status-section">
            <div className="section-header">
              <h3 className="section-title">
                <CheckCircle size={20} className="check-icon" />
                Hàng cần kiểm tra CL
              </h3>
              <span className="item-count">
                {qualityCheckItems.filter((item) => item.status === "pending").length} mục
              </span>
            </div>

            <div className="items-container">
              {qualityCheckItems.map((item) => (
                <div key={item.id} className={`status-item quality-item ${item.status}`}>
                  <div className="item-header">
                    <div className="item-info">
                      <span className="item-id">{item.id}</span>
                      <span className="item-product">{item.product}</span>
                      <span className="item-check-date">
                        Ngày CL: {new Date(item.checkDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="status-badge">
                      {item.status === "pending"
                        ? "Chờ kiểm tra"
                        : item.status === "passed"
                          ? "Đã kiểm tra"
                          : "Có vấn đề"}
                    </div>
                  </div>

                  <div className="item-details">
                    <span className="detail-item">Vị trí: {item.location}</span>
                    {item.checkedDate && (
                      <span className="detail-item">
                        Kiểm tra: {new Date(item.checkedDate).toLocaleDateString("vi-VN")}
                      </span>
                    )}
                  </div>

                  {item.status === "pending" && (
                    <div className="item-actions">
                      <button className="action-btn success" onClick={() => handleQualityCheck(item.id, "passed")}>
                        <CheckCircle size={16} />
                        Đã kiểm tra
                      </button>
                      <button className="action-btn danger" onClick={() => handleQualityCheck(item.id, "failed")}>
                        <X size={16} />
                        Có vấn đề
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hàng có vấn đề */}
        {(filterType === "all" || filterType === "problems") && (
          <div className="status-section">
            <div className="section-header">
              <h3 className="section-title">
                <X size={20} className="error-icon" />
                Hàng có vấn đề
              </h3>
              <span className="item-count">{problemItems.length} mục</span>
            </div>

            <div className="items-container">
              {problemItems.map((item) => (
                <div key={item.id} className="status-item problem-item">
                  <div className="item-header">
                    <div className="item-info">
                      <span className="item-id">{item.id}</span>
                      <span className="item-product">{item.product}</span>
                      <span className="item-issue">{item.issue}</span>
                    </div>
                    <div
                      className="severity-badge"
                      style={{
                        backgroundColor: `${getSeverityColor(item.severity)}20`,
                        color: getSeverityColor(item.severity),
                      }}
                    >
                      {item.severity === "critical"
                        ? "Nghiêm trọng"
                        : item.severity === "high"
                          ? "Cao"
                          : item.severity === "medium"
                            ? "Trung bình"
                            : "Thấp"}
                    </div>
                  </div>

                  <div className="item-details">
                    <span className="detail-item">Vị trí: {item.location}</span>
                    <span className="detail-item">
                      Báo cáo: {new Date(item.reportDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <div className="item-actions">
                    <button className="action-btn repair">
                      <Wrench size={16} />
                      Xử lý
                    </button>
                    <button className="action-btn danger">
                      <Trash2 size={16} />
                      Thanh lý
                    </button>
                    <button className="action-btn report">
                      <FileText size={16} />
                      Báo cáo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {((filterType === "expiring" && expiringItems.length === 0) ||
        (filterType === "quality" && qualityCheckItems.length === 0) ||
        (filterType === "problems" && problemItems.length === 0)) && (
        <div className="empty-state">
          <CheckCircle size={48} />
          <h3>Không có mục nào cần xử lý</h3>
          <p>Tất cả hàng hóa đang trong tình trạng tốt</p>
        </div>
      )}
    </div>
  )
}

export default QuanLyTinhTrangHang
