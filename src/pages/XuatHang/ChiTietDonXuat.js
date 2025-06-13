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
    const totalAllocations = order.danh_sach_hang.reduce((total, item) => total + item.phan_bo.length, 0)
    const completedAllocations = order.danh_sach_hang.reduce(
      (total, item) => total + item.phan_bo.filter((a) => a.trang_thai === "verified").length,
      0,
    )
    return Math.round((completedAllocations / totalAllocations) * 100)
  }

  const getItemProgress = (item) => {
    const completedAllocations = item.phan_bo.filter((a) => a.trang_thai === "verified").length
    return Math.round((completedAllocations / item.phan_bo.length) * 100)
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
        {inv.available}/{inv.total} thùng ({invStatus.percentage}%)
      </span>
    )
  }

  return (
    <div className="chi-tiet-don-xuat">
      {/* Order Header */}
      <div className="detail-header">
        <div className="order-info">
          <h3 className="order-code">{order.don_hang_id}</h3>
          <div className="order-meta">
            <span className="store-name">{order.cua_hang}</span>
            <span className="store-area">• {order.khu_vuc}</span>
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
            <label>Mã cửa hàng:</label>
            <span>{order.cua_hang_id}</span>
          </div>
          <div className="info-item">
            <label>Ngày đặt:</label>
            <span>{new Date(order.ngay_dat).toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="info-item">
            <label>Ngày xuất:</label>
            <span>{new Date(order.ngay_xuat).toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="info-item">
            <label>Ưu tiên:</label>
            <span className={`priority-text ${order.uu_tien}`}>
              {order.uu_tien === "high" ? "Cao" : order.uu_tien === "medium" ? "Trung bình" : "Thấp"}
            </span>
          </div>
          <div className="info-item">
            <label>Nhân viên phụ trách:</label>
            <span>{order.nhan_vien}</span>
          </div>
          <div className="info-item">
            <label>Tổng thùng:</label>
            <span>{order.tong_thung}</span>
          </div>
        </div>
        {order.ghi_chu && (
          <div className="notes-section">
            <label>Ghi chú:</label>
            <div className="notes-content">{order.ghi_chu}</div>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="detail-section">
        <h4 className="section-title">
          <Package size={16} />
          Danh sách sản phẩm ({order.tong_san_pham} loại - {order.tong_so_luong} thùng)
        </h4>
        <div className="items-list">
          {order.danh_sach_hang.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-header">
                <div className="item-info">
                  <span className="product-code">{item.ma_san_pham}</span>
                  <span className="product-name">{item.ten_san_pham}</span>
                  <span className="item-quantity">
                    {item.so_luong} {item.don_vi}
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
                {item.phan_bo.map((allocation, index) => (
                  <div key={index} className="allocation-row">
                    <div className="allocation-info">
                      <div className="pallet-info">
                        <MapPin size={14} />
                        <span className="pallet-code">{allocation.ma_pallet}</span>
                        <span className="location">{allocation.vi_tri}</span>
                      </div>
                      <div className="allocation-quantity">
                        {allocation.so_luong_phan_bo} {item.don_vi}
                      </div>
                    </div>
                    <div className="allocation-status">
                      {getAllocationStatusBadge(allocation.trang_thai)}
                      {getInventoryBadge(allocation.ma_pallet)}
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
          {order.danh_sach_hang
            .flatMap((item) =>
              item.phan_bo
                .filter((alloc) => {
                  const invStatus = getInventoryStatus(alloc.ma_pallet)
                  return invStatus.status === "critical" || invStatus.status === "warning"
                })
                .map((alloc) => ({
                  ...alloc,
                  ten_san_pham: item.ten_san_pham,
                  invStatus: getInventoryStatus(alloc.ma_pallet),
                })),
            )
            .map((alert, index) => (
              <div key={index} className={`alert-item ${alert.invStatus.status}`}>
                <AlertTriangle size={16} />
                <div className="alert-content">
                  <span className="alert-title">
                    Pallet {alert.ma_pallet} - {alert.ten_san_pham}
                  </span>
                  <span className="alert-message">
                    Tồn kho thấp: {inventory[alert.ma_pallet]?.available} thùng ({alert.invStatus.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          {order.danh_sach_hang.every((item) =>
            item.phan_bo.every((alloc) => {
              const invStatus = getInventoryStatus(alloc.ma_pallet)
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
