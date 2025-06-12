"use client"

import { CheckCircle, AlertTriangle, Package } from "lucide-react"

const KetQuaKiemTra = ({ scanResult, verificationResult, onClose }) => {
  const getResultIcon = () => {
    switch (verificationResult.status) {
      case "success":
        return <CheckCircle size={48} className="result-icon success" />
      case "error":
        return <AlertTriangle size={48} className="result-icon error" />
      case "warning":
        return <AlertTriangle size={48} className="result-icon warning" />
      default:
        return <AlertTriangle size={48} className="result-icon warning" />
    }
  }

  const getResultClass = () => {
    return `result-container ${verificationResult.status}`
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

  return (
    <div className="ket-qua-kiem-tra">
      {/* Result Header */}
      <div className={getResultClass()}>
        <div className="result-header">
          {getResultIcon()}
          <h3 className="result-message">{verificationResult.message}</h3>
          <p className="result-time">Kiểm tra lúc: {formatDateTime(new Date().toISOString())}</p>
        </div>

        {/* Verification Details */}
        <div className="verification-details">
          <div className="detail-row">
            <span className="detail-label">Cửa hàng đích:</span>
            <span className="detail-value">{verificationResult.details.orderStore}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Khu vực đích:</span>
            <span className="detail-value">{verificationResult.details.orderArea}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Vị trí hiện tại:</span>
            <span className="detail-value">{verificationResult.details.currentLocation}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Kết quả so sánh:</span>
            <span className={`detail-value ${verificationResult.details.match ? "match" : "no-match"}`}>
              {verificationResult.details.match ? "✅ Khớp" : "❌ Không khớp"}
            </span>
          </div>
          {verificationResult.details.distance > 0 && (
            <div className="detail-row">
              <span className="detail-label">Khoảng cách:</span>
              <span className="detail-value">{verificationResult.details.distance} km</span>
            </div>
          )}
        </div>
      </div>

      {/* Order Information */}
      <div className="order-info-section">
        <h4 className="section-title">
          <Package size={16} />
          Thông tin đơn hàng
        </h4>
        <div className="order-details">
          <div className="info-grid">
            <div className="info-item">
              <label>Mã đơn hàng:</label>
              <span className="order-code">{scanResult.orderCode}</span>
            </div>
            <div className="info-item">
              <label>Cửa hàng:</label>
              <span>{scanResult.storeName}</span>
            </div>
            <div className="info-item">
              <label>Khu vực:</label>
              <span>{scanResult.storeArea}</span>
            </div>
            <div className="info-item">
              <label>Ngày giao:</label>
              <span>{new Date(scanResult.expectedDeliveryDate).toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="info-item">
              <label>Tổng sản phẩm:</label>
              <span>
                {scanResult.totalItems} loại - {scanResult.totalQuantity} kg
              </span>
            </div>
            <div className="info-item">
              <label>Nhân viên phụ trách:</label>
              <span>{scanResult.assignedStaff}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      {scanResult.items && scanResult.items.length > 0 && (
        <div className="items-section">
          <h4 className="section-title">
            <Package size={16} />
            Chi tiết sản phẩm
          </h4>
          <div className="items-list">
            {scanResult.items.map((item, index) => (
              <div key={index} className="item-row">
                <span className="product-code">{item.productCode}</span>
                <span className="product-name">{item.productName}</span>
                <span className="product-quantity">
                  {item.quantity} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {verificationResult.status === "error" && (
        <div className="recommendations">
          <h4 className="section-title">
            <AlertTriangle size={16} />
            Khuyến nghị
          </h4>
          <div className="recommendation-list">
            <div className="recommendation-item">
              <span>🔍 Kiểm tra lại địa chỉ giao hàng trên đơn</span>
            </div>
            <div className="recommendation-item">
              <span>📍 Xác nhận vị trí hiện tại của bạn</span>
            </div>
            <div className="recommendation-item">
              <span>📞 Liên hệ với cửa hàng để xác nhận</span>
            </div>
            <div className="recommendation-item">
              <span>🚚 Điều chỉnh lộ trình giao hàng nếu cần</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="result-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Đóng
        </button>
        {verificationResult.status === "success" && <button className="btn btn-success">Xác nhận giao hàng</button>}
        {verificationResult.status === "error" && <button className="btn btn-warning">Báo cáo sự cố</button>}
      </div>
    </div>
  )
}

export default KetQuaKiemTra
