"use client"

import { Calendar, Package, User, AlertTriangle, CheckCircle } from "lucide-react"

const ChiTietPallet = ({ pallet, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDaysUntilExpiry = () => {
    const today = new Date()
    const expiryDate = new Date(pallet.expiryDate)
    const diffTime = expiryDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getExpiryStatus = () => {
    const daysLeft = getDaysUntilExpiry()
    if (daysLeft < 0) return { status: "expired", text: "Đã hết hạn", class: "danger" }
    if (daysLeft <= 3) return { status: "critical", text: `Còn ${daysLeft} ngày`, class: "danger" }
    if (daysLeft <= 7) return { status: "warning", text: `Còn ${daysLeft} ngày`, class: "warning" }
    return { status: "good", text: `Còn ${daysLeft} ngày`, class: "success" }
  }

  const expiryStatus = getExpiryStatus()

  return (
    <div className="pallet-detail">
      {/* Header */}
      <div className="detail-header">
        <div className="pallet-info">
          <h3 className="pallet-code">{pallet.palletCode}</h3>
          <div className="status-badges">
            <span className={`badge badge-${pallet.status === "active" ? "success" : "warning"}`}>
              {pallet.status === "active" ? "Hoạt động" : "Cảnh báo"}
            </span>
            <span className={`badge badge-${pallet.qualityStatus === "passed" ? "success" : "warning"}`}>
              {pallet.qualityStatus === "passed" ? "Chất lượng đạt" : "Cần kiểm tra"}
            </span>
          </div>
        </div>
        <div className="expiry-alert">
          <div className={`expiry-status ${expiryStatus.class}`}>
            {expiryStatus.status === "expired" ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            <span>{expiryStatus.text}</span>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="detail-section">
        <h4 className="section-title">
          <Package size={16} />
          Thông tin sản phẩm
        </h4>
        <div className="info-grid">
          <div className="info-item">
            <label>Mã sản phẩm:</label>
            <span className="product-code">{pallet.productCode}</span>
          </div>
          <div className="info-item">
            <label>Tên sản phẩm:</label>
            <span>{pallet.productName}</span>
          </div>
          <div className="info-item">
            <label>Số lượng:</label>
            <span className="quantity">
              {pallet.quantity} {pallet.unit}
            </span>
          </div>
          <div className="info-item">
            <label>Vị trí:</label>
            <span className="location-badge">{pallet.location}</span>
          </div>
        </div>
      </div>

      {/* Date Information */}
      <div className="detail-section">
        <h4 className="section-title">
          <Calendar size={16} />
          Thông tin thời gian
        </h4>
        <div className="info-grid">
          <div className="info-item">
            <label>Ngày giờ nhập:</label>
            <span>{formatDateTime(pallet.importDate)}</span>
          </div>
          <div className="info-item">
            <label>Ngày sản xuất:</label>
            <span>{formatDate(pallet.productionDate)}</span>
          </div>
          <div className="info-item">
            <label>Hạn sử dụng:</label>
            <span className={`expiry-date ${expiryStatus.class}`}>{formatDate(pallet.expiryDate)}</span>
          </div>
          <div className="info-item">
            <label>Ngày kiểm tra chất lượng:</label>
            <span>{formatDate(pallet.qualityCheckDate)}</span>
          </div>
        </div>
      </div>

      {/* Supplier Information */}
      <div className="detail-section">
        <h4 className="section-title">
          <User size={16} />
          Thông tin nhà cung cấp
        </h4>
        <div className="info-grid">
          <div className="info-item">
            <label>Nhà cung cấp:</label>
            <span>{pallet.supplier}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {pallet.notes && (
        <div className="detail-section">
          <h4 className="section-title">Ghi chú</h4>
          <div className="notes-content">{pallet.notes}</div>
        </div>
      )}

      {/* Actions */}
      <div className="detail-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Đóng
        </button>
        <button className="btn btn-primary">Chỉnh sửa</button>
      </div>
    </div>
  )
}

export default ChiTietPallet
