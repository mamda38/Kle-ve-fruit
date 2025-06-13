"use client"

import { useState } from "react"
import { Plus, Calendar, Users, FileText, Eye, BarChart3, Search, Filter } from "lucide-react"
import Modal from "../../components/common/Modal"

const KiemKeKho = () => {
  const [inventoryHistory, setInventoryHistory] = useState([
    {
      id: 1,
      date: "2025-06-08",
      type: "area",
      scope: "Khu vực A",
      status: "completed",
      assignees: ["Nguyễn Văn A", "Trần Thị B"],
      differences: [{ product: "Heineken", expected: 150, actual: 152, difference: +2 }],
      notes: "Phát hiện thêm 2 thùng Heineken chưa được ghi nhận",
    },
    {
      id: 2,
      date: "2025-06-01",
      type: "full",
      scope: "Toàn kho",
      status: "completed",
      assignees: ["Lê Văn C", "Phạm Thị D", "Hoàng Văn E"],
      differences: [
        { product: "Coca Cola", expected: 80, actual: 75, difference: -5 },
        { product: "Sprite", expected: 92, actual: 95, difference: +3 },
      ],
      notes: "Kiểm kê định kỳ tháng 6",
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [inventoryForm, setInventoryForm] = useState({
    type: "full",
    areas: [],
    productGroups: [],
    dateRange: { start: "", end: "" },
    assignees: [],
    date: "",
    notes: "",
  })

  const areas = ["Khu vực A", "Khu vực B", "Khu vực C", "Khu vực D"]
  const productGroups = ["Bia", "Nước ngọt", "Nước suối", "Đồ uống có cồn"]
  const staff = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"]

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

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành"
      case "in-progress":
        return "Đang thực hiện"
      case "pending":
        return "Chờ thực hiện"
      default:
        return "Không xác định"
    }
  }

  const getTypeText = (type) => {
    switch (type) {
      case "full":
        return "Toàn kho"
      case "area":
        return "Theo khu vực"
      case "group":
        return "Theo nhóm hàng"
      case "expiry":
        return "Theo ngày hết hạn"
      default:
        return "Khác"
    }
  }

  const handleCreateInventory = () => {
    // Logic tạo phiên kiểm kê mới
    console.log("Creating inventory session:", inventoryForm)
    setShowCreateModal(false)
  }

  const handlePrintList = () => {
    // Logic in danh sách kiểm kê
    console.log("Printing inventory list")
  }

  return (
    <div className="kiem-ke-kho">
      <div className="page-header">
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            Tạo phiên kiểm kê mới
          </button>
        </div>
      </div>

      <div className="inventory-sections">
        {/* Tạo phiên kiểm kê mới */}
        <div className="section create-section">
          <div className="section-header">
            <h3 className="section-title">Tạo phiên kiểm kê mới</h3>
          </div>

          <div className="quick-create-options">
            <div className="quick-option" onClick={() => setShowCreateModal(true)}>
              <div className="option-icon">📦</div>
              <div className="option-content">
                <h4>Kiểm kê toàn bộ kho</h4>
                <p>Kiểm kê tất cả hàng hóa trong kho</p>
              </div>
            </div>

            <div className="quick-option" onClick={() => setShowCreateModal(true)}>
              <div className="option-icon">📍</div>
              <div className="option-content">
                <h4>Kiểm kê theo khu vực</h4>
                <p>Chọn khu vực cụ thể để kiểm kê</p>
              </div>
            </div>

            <div className="quick-option" onClick={() => setShowCreateModal(true)}>
              <div className="option-icon">🏷️</div>
              <div className="option-content">
                <h4>Kiểm kê theo nhóm hàng</h4>
                <p>Kiểm kê theo loại sản phẩm</p>
              </div>
            </div>

            <div className="quick-option" onClick={() => setShowCreateModal(true)}>
              <div className="option-icon">⏰</div>
              <div className="option-content">
                <h4>Kiểm kê hàng sắp hết hạn</h4>
                <p>Kiểm kê hàng theo ngày hết hạn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lịch sử kiểm kê */}
        <div className="section history-section">
          <div className="section-header">
            <h3 className="section-title">Lịch sử kiểm kê</h3>
            <div className="header-actions">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Tìm kiếm..." />
              </div>
              <button className="btn btn-outline">
                <Filter size={16} />
                Lọc
              </button>
            </div>
          </div>

          <div className="history-list">
            {inventoryHistory.map((session) => (
              <div key={session.id} className="history-item">
                <div className="item-header">
                  <div className="item-info">
                    <div className="item-date">
                      <Calendar size={16} />
                      <span>{new Date(session.date).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="item-scope">
                      <span className="scope-type">{getTypeText(session.type)}</span>
                      <span className="scope-detail">{session.scope}</span>
                    </div>
                  </div>
                  <div
                    className="item-status"
                    style={{
                      backgroundColor: `${getStatusColor(session.status)}20`,
                      color: getStatusColor(session.status),
                    }}
                  >
                    {getStatusText(session.status)}
                  </div>
                </div>

                <div className="item-content">
                  <div className="assignees">
                    <Users size={14} />
                    <span>Người thực hiện: {session.assignees.join(", ")}</span>
                  </div>

                  {session.differences && session.differences.length > 0 && (
                    <div className="differences">
                      <h5>Chênh lệch:</h5>
                      <div className="difference-list">
                        {session.differences.map((diff, index) => (
                          <div key={index} className="difference-item">
                            <span className="product-name">{diff.product}:</span>
                            <span className={`difference-value ${diff.difference > 0 ? "positive" : "negative"}`}>
                              {diff.difference > 0 ? "+" : ""}
                              {diff.difference} (Thực tế: {diff.actual}, Dự kiến: {diff.expected})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {session.notes && (
                    <div className="session-notes">
                      <FileText size={14} />
                      <span>{session.notes}</span>
                    </div>
                  )}
                </div>

                <div className="item-actions">
                  <button className="action-btn">
                    <Eye size={16} />
                    Xem chi tiết
                  </button>
                  <button className="action-btn">
                    <BarChart3 size={16} />
                    Báo cáo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal tạo phiên kiểm kê */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo phiên kiểm kê mới"
        size="large"
      >
        <form className="inventory-form">
          <div className="form-section">
            <h4>Loại kiểm kê</h4>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  id="full"
                  name="type"
                  value="full"
                  checked={inventoryForm.type === "full"}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, type: e.target.value })}
                />
                <label htmlFor="full">Toàn bộ kho</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="area"
                  name="type"
                  value="area"
                  checked={inventoryForm.type === "area"}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, type: e.target.value })}
                />
                <label htmlFor="area">Theo khu vực</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="group"
                  name="type"
                  value="group"
                  checked={inventoryForm.type === "group"}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, type: e.target.value })}
                />
                <label htmlFor="group">Theo nhóm hàng</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  id="expiry"
                  name="type"
                  value="expiry"
                  checked={inventoryForm.type === "expiry"}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, type: e.target.value })}
                />
                <label htmlFor="expiry">Theo ngày hết hạn</label>
              </div>
            </div>
          </div>

          {inventoryForm.type === "area" && (
            <div className="form-section">
              <h4>Chọn khu vực</h4>
              <div className="checkbox-group">
                {areas.map((area) => (
                  <div key={area} className="checkbox-item">
                    <input type="checkbox" id={area} value={area} />
                    <label htmlFor={area}>{area}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {inventoryForm.type === "group" && (
            <div className="form-section">
              <h4>Chọn nhóm hàng</h4>
              <div className="checkbox-group">
                {productGroups.map((group) => (
                  <div key={group} className="checkbox-item">
                    <input type="checkbox" id={group} value={group} />
                    <label htmlFor={group}>{group}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {inventoryForm.type === "expiry" && (
            <div className="form-section">
              <h4>Khoảng thời gian hết hạn</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Từ ngày</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Đến ngày</label>
                  <input type="date" />
                </div>
              </div>
            </div>
          )}

          <div className="form-section">
            <h4>Thông tin thực hiện</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Người kiểm kê</label>
                <select multiple>
                  {staff.map((person) => (
                    <option key={person} value={person}>
                      {person}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Ngày kiểm kê</label>
                <input type="date" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Ghi chú</label>
            <textarea rows="3" placeholder="Ghi chú về phiên kiểm kê..."></textarea>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)}>
              Hủy
            </button>
            <button type="button" className="btn btn-secondary" onClick={handlePrintList}>
              📄 In danh sách
            </button>
            <button type="button" className="btn btn-primary" onClick={handleCreateInventory}>
              🚀 Bắt đầu kiểm kê
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default KiemKeKho
