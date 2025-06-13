"use client"

import { useState } from "react"
import { CheckCircle, Package, MapPin, AlertTriangle, Truck } from "lucide-react"

const ChecklistPallet = ({
  order,
  inventory,
  getInventoryStatus,
  onUpdateAllocation,
  onUpdateOrderStatus,
  onClose,
}) => {
  const [checkedItems, setCheckedItems] = useState({})
  const [notes, setNotes] = useState({})

  const handleCheckItem = (itemId, allocationIndex, checked) => {
    const key = `${itemId}-${allocationIndex}`
    setCheckedItems((prev) => ({
      ...prev,
      [key]: checked,
    }))

    // Update allocation status
    if (checked) {
      onUpdateAllocation(order.id, itemId, allocationIndex, "verified")
    } else {
      onUpdateAllocation(order.id, itemId, allocationIndex, "pending")
    }
  }

  const handleNoteChange = (itemId, allocationIndex, note) => {
    const key = `${itemId}-${allocationIndex}`
    setNotes((prev) => ({
      ...prev,
      [key]: note,
    }))
  }

  const getTotalProgress = () => {
    const totalAllocations = order.danh_sach_hang.reduce((total, item) => total + item.phan_bo.length, 0)
    const checkedAllocations = Object.values(checkedItems).filter(Boolean).length
    return Math.round((checkedAllocations / totalAllocations) * 100)
  }

  const isAllCompleted = () => {
    const totalAllocations = order.danh_sach_hang.reduce((total, item) => total + item.phan_bo.length, 0)
    const checkedAllocations = Object.values(checkedItems).filter(Boolean).length
    return checkedAllocations === totalAllocations
  }

  const handleCompleteOrder = () => {
    if (isAllCompleted()) {
      onUpdateOrderStatus(order.id, "ready")
      alert("Đơn hàng đã sẵn sàng xuất!")
      onClose()
    } else {
      alert("Vui lòng hoàn thành tất cả checklist trước khi kết thúc!")
    }
  }

  const getInventoryBadge = (palletCode) => {
    const invStatus = getInventoryStatus(palletCode)
    const inv = inventory[palletCode]

    if (!inv) return <span className="inventory-badge unknown">Không rõ</span>

    return (
      <span className={`inventory-badge ${invStatus.status}`}>
        {inv.available}/{inv.total} thùng
      </span>
    )
  }

  return (
    <div className="checklist-pallet">
      {/* Header */}
      <div className="checklist-header">
        <div className="order-info">
          <h3>{order.don_hang_id}</h3>
          <p>
            {order.cua_hang} - {order.khu_vuc}
          </p>
        </div>
        <div className="progress-info">
          <div className="progress-circle">
            <svg width="50" height="50" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke="#f1f3f4" strokeWidth="3" />
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="#00FF33"
                strokeWidth="3"
                strokeDasharray={`${getTotalProgress() * 1.26} 126`}
                strokeDashoffset="0"
                transform="rotate(-90 25 25)"
              />
            </svg>
            <span className="progress-text">{getTotalProgress()}%</span>
          </div>
        </div>
      </div>

      {/* Checklist Steps */}
      <div className="checklist-steps">
        <div className="step-item">
          <div className="step-icon">
            <MapPin size={16} />
          </div>
          <div className="step-content">
            <span className="step-title">Bước 1: Tìm vị trí pallet</span>
            <span className="step-desc">Xác định vị trí chính xác của từng pallet</span>
          </div>
        </div>
        <div className="step-item">
          <div className="step-icon">
            <Package size={16} />
          </div>
          <div className="step-content">
            <span className="step-title">Bước 2: Kiểm tra số lượng</span>
            <span className="step-desc">Đếm và xác nhận số lượng thực tế</span>
          </div>
        </div>
        <div className="step-item">
          <div className="step-icon">
            <CheckCircle size={16} />
          </div>
          <div className="step-content">
            <span className="step-title">Bước 3: Xác nhận chất lượng</span>
            <span className="step-desc">Kiểm tra chất lượng và đóng gói</span>
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="checklist-items">
        {order.danh_sach_hang.map((item) => (
          <div key={item.id} className="checklist-section">
            <div className="section-header">
              <div className="product-info">
                <span className="product-code">{item.ma_san_pham}</span>
                <span className="product-name">{item.ten_san_pham}</span>
                <span className="total-quantity">
                  {item.so_luong} {item.don_vi}
                </span>
              </div>
            </div>

            <div className="allocation-checklist">
              {item.phan_bo.map((allocation, index) => {
                const key = `${item.id}-${index}`
                const isChecked = checkedItems[key] || false
                const invStatus = getInventoryStatus(allocation.ma_pallet)

                return (
                  <div key={index} className={`checklist-item ${isChecked ? "completed" : ""}`}>
                    <div className="item-checkbox">
                      <input
                        type="checkbox"
                        id={key}
                        checked={isChecked}
                        onChange={(e) => handleCheckItem(item.id, index, e.target.checked)}
                      />
                      <label htmlFor={key} className="checkbox-label">
                        <CheckCircle size={16} />
                      </label>
                    </div>

                    <div className="item-content">
                      <div className="item-main">
                        <div className="pallet-info">
                          <span className="pallet-code">{allocation.ma_pallet}</span>
                          <span className="location">
                            <MapPin size={12} />
                            {allocation.vi_tri}
                          </span>
                        </div>
                        <div className="quantity-info">
                          <span className="allocated-qty">
                            {allocation.so_luong_phan_bo} {item.don_vi}
                          </span>
                          {getInventoryBadge(allocation.ma_pallet)}
                        </div>
                      </div>

                      {invStatus.status !== "good" && (
                        <div className={`inventory-alert ${invStatus.status}`}>
                          <AlertTriangle size={14} />
                          <span>
                            {invStatus.status === "critical" ? "Cảnh báo: Tồn kho rất thấp!" : "Chú ý: Tồn kho thấp"}
                          </span>
                        </div>
                      )}

                      <div className="item-notes">
                        <textarea
                          placeholder="Ghi chú kiểm tra (tùy chọn)..."
                          value={notes[key] || ""}
                          onChange={(e) => handleNoteChange(item.id, index, e.target.value)}
                          rows="2"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="checklist-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Tổng pallet:</span>
            <span className="stat-value">
              {order.danh_sach_hang.reduce((total, item) => total + item.phan_bo.length, 0)}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Đã kiểm tra:</span>
            <span className="stat-value">{Object.values(checkedItems).filter(Boolean).length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tiến độ:</span>
            <span className="stat-value">{getTotalProgress()}%</span>
          </div>
        </div>

        {isAllCompleted() && (
          <div className="completion-alert">
            <CheckCircle size={20} />
            <span>Đã hoàn thành tất cả checklist! Sẵn sàng xuất hàng.</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="checklist-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Tạm dừng
        </button>
        <button
          className={`btn ${isAllCompleted() ? "btn-success" : "btn-primary"}`}
          onClick={handleCompleteOrder}
          disabled={!isAllCompleted()}
        >
          <Truck size={16} />
          {isAllCompleted()
            ? "Hoàn thành xuất hàng"
            : `Còn ${
                order.danh_sach_hang.reduce((total, item) => total + item.phan_bo.length, 0) -
                Object.values(checkedItems).filter(Boolean).length
              } mục`}
        </button>
      </div>
    </div>
  )
}

export default ChecklistPallet
