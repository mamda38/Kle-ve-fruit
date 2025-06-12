"use client"

import { Package, MapPin, Calendar, AlertTriangle } from "lucide-react"

const ChiTietDonXuat = ({ order, inventory, getInventoryStatus, onClose }) => {
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTotalProgress = () => {
    const totalAllocations = order.items.reduce((total, item) => total + item.allocation.length, 0)
    const completedAllocations = order.items.reduce(
      (total, item) => total + item.allocation.filter((a) => a.status === "verified").length,
      0,
    )
    return Math.round((completedAllocations / totalAllocations) * 100)
  }

  const getItemProgress = (item) => {
    const completedAllocations = item.allocation.filter((a) => a.status === "verified").length
    return Math.round((completedAllocations / item.allocation.length) * 100)
  }

  const getAllocationStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Chờ lấy", class: "badge-warning" },
      picked: { label: "Đã lấy", class: "badge-info" },
      verified: { label: "Đã kiểm tra", class: "badge-success" },
    }
    const config = statusConfig[status] || statusConfig.pending
    return <span className={`badge ${config.class}`}>{config.label}</span>
  }

  const getInventoryBadge = (palletCode) => {
    const invStatus = getInventoryStatus(palletCode)
    const inv = inventory[palletCode]

    if (!inv) return <span className="inventory-badge unknown">Không rõ</span>

    return (
      <span className={`inventory-badge ${invStatus.status}`}>
        {inv.available}/{inv.total} kg ({invStatus.percentage}%)
      </span>
    )
  }

  return (
    <div className="chi-tiet-don-xuat">
      {/* Order Header */}
      <div className="detail-header">
        <div className="order-info">
          <h3 className="order-code">{order.orderCode}</h3>
          <div className="order-meta">
            <span className="store-name">{order.storeName}</span>
            <span className="store-area">• {order.storeArea}</span>
          </div>
        </div>
        <div className="order-status">
          <div className="progress-circle">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="25" fill="none" stroke="#f1f3f4" strokeWidth="4" />
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="#00FF33"
                strokeWidth="4"
                strokeDasharray={`${getTotalProgress() * 1.57} 157`}
                strokeDashoffset="0"
                transform="rotate(-90 30 30)"
              />
            </svg>
            <span className="progress-text">{getTotalProgress()}%</span>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="detail-section">
        <h4 className="section-title">
          <Calendar size={16} />
          Thông tin đơn hàng
        </h4>
        <div className="info-grid">
          <div className="info-item">
            <label>Ngày đặt:</label>
            <span>{new Date(order.orderDate).toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="info-item">
            <label>Ngày giao dự kiến:</label>
            <span>{new Date(order.expectedDeliveryDate).toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="info-item">
            <label>Ưu tiên:</label>
            <span className={`priority-text ${order.priority}`}>
              {order.priority === "high" ? "Cao" : order.priority === "medium" ? "Trung bình" : "Thấp"}
            </span>
          </div>
          <div className="info-item">
            <label>Nhân viên phụ trách:</label>
            <span>{order.assignedStaff}</span>
          </div>
        </div>
        {order.notes && (
          <div className="notes-section">
            <label>Ghi chú:</label>
            <div className="notes-content">{order.notes}</div>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="detail-section">
        <h4 className="section-title">
          <Package size={16} />
          Danh sách sản phẩm ({order.totalItems} loại - {order.totalQuantity} kg)
        </h4>
        <div className="items-list">
          {order.items.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-header">
                <div className="item-info">
                  <span className="product-code">{item.productCode}</span>
                  <span className="product-name">{item.productName}</span>
                  <span className="item-quantity">
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <div className="item-progress">
                  <div className="progress-bar small">
                    <div className="progress-fill" style={{ width: `${getItemProgress(item)}%` }}></div>
                  </div>
                  <span className="progress-text">{getItemProgress(item)}%</span>
                </div>
              </div>

              <div className="allocations-list">
                {item.allocation.map((allocation, index) => (
                  <div key={index} className="allocation-row">
                    <div className="allocation-info">
                      <div className="pallet-info">
                        <MapPin size={14} />
                        <span className="pallet-code">{allocation.palletCode}</span>
                        <span className="location">{allocation.location}</span>
                      </div>
                      <div className="allocation-quantity">
                        {allocation.allocatedQuantity} {item.unit}
                      </div>
                    </div>
                    <div className="allocation-status">
                      {getAllocationStatusBadge(allocation.status)}
                      {getInventoryBadge(allocation.palletCode)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Alerts */}
      <div className="detail-section">
        <h4 className="section-title">
          <AlertTriangle size={16} />
          Cảnh báo tồn kho
        </h4>
        <div className="alerts-list">
          {order.items
            .flatMap((item) =>
              item.allocation
                .filter((alloc) => {
                  const invStatus = getInventoryStatus(alloc.palletCode)
                  return invStatus.status === "critical" || invStatus.status === "warning"
                })
                .map((alloc) => ({
                  ...alloc,
                  productName: item.productName,
                  invStatus: getInventoryStatus(alloc.palletCode),
                })),
            )
            .map((alert, index) => (
              <div key={index} className={`alert-item ${alert.invStatus.status}`}>
                <AlertTriangle size={16} />
                <div className="alert-content">
                  <span className="alert-title">
                    Pallet {alert.palletCode} - {alert.productName}
                  </span>
                  <span className="alert-message">
                    Tồn kho thấp: {inventory[alert.palletCode]?.available} kg ({alert.invStatus.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          {order.items.every((item) =>
            item.allocation.every((alloc) => {
              const invStatus = getInventoryStatus(alloc.palletCode)
              return invStatus.status === "good"
            }),
          ) && (
            <div className="no-alerts">
              <span>✅ Không có cảnh báo tồn kho</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="detail-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Đóng
        </button>
        <button className="btn btn-primary">Bắt đầu xuất hàng</button>
      </div>
    </div>
  )
}

export default ChiTietDonXuat
