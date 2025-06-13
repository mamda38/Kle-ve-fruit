"use client"

import { useState } from "react"
import { Plus, Edit, Wrench, BarChart3, Map, Search, CheckCircle, AlertTriangle } from "lucide-react"
import Modal from "../../components/common/Modal"

const QuanLyViTri = () => {
  const [areas, setAreas] = useState([
    {
      id: 1,
      name: "Khu vực A",
      description: "Bia & Nước ngọt",
      size: "5x3",
      totalPositions: 15,
      usedPositions: 12,
      status: "active",
      positions: [
        { id: "A1", status: "empty" },
        { id: "A2", status: "occupied" },
        { id: "A3", status: "empty" },
        { id: "A4", status: "occupied" },
        { id: "A5", status: "maintenance" },
        { id: "B1", status: "occupied" },
        { id: "B2", status: "occupied" },
        { id: "B3", status: "occupied" },
        { id: "B4", status: "empty" },
        { id: "B5", status: "occupied" },
        { id: "C1", status: "occupied" },
        { id: "C2", status: "occupied" },
        { id: "C3", status: "empty" },
        { id: "C4", status: "occupied" },
        { id: "C5", status: "occupied" },
      ],
    },
    {
      id: 2,
      name: "Khu vực B",
      description: "Nước suối",
      size: "4x4",
      totalPositions: 16,
      usedPositions: 8,
      status: "maintenance",
      positions: [
        { id: "A1", status: "occupied" },
        { id: "A2", status: "empty" },
        { id: "A3", status: "occupied" },
        { id: "A4", status: "empty" },
        { id: "B1", status: "occupied" },
        { id: "B2", status: "empty" },
        { id: "B3", status: "occupied" },
        { id: "B4", status: "empty" },
        { id: "C1", status: "occupied" },
        { id: "C2", status: "empty" },
        { id: "C3", status: "occupied" },
        { id: "C4", status: "empty" },
        { id: "D1", status: "occupied" },
        { id: "D2", status: "empty" },
        { id: "D3", status: "occupied" },
        { id: "D4", status: "empty" },
      ],
    },
    {
      id: 3,
      name: "Khu vực C",
      description: "Đồ uống có cồn",
      size: "6x2",
      totalPositions: 12,
      usedPositions: 10,
      status: "active",
      positions: [
        { id: "A1", status: "occupied" },
        { id: "A2", status: "occupied" },
        { id: "A3", status: "occupied" },
        { id: "A4", status: "occupied" },
        { id: "A5", status: "empty" },
        { id: "A6", status: "occupied" },
        { id: "B1", status: "occupied" },
        { id: "B2", status: "occupied" },
        { id: "B3", status: "occupied" },
        { id: "B4", status: "occupied" },
        { id: "B5", status: "empty" },
        { id: "B6", status: "occupied" },
      ],
    },
  ])

  const [showAddAreaModal, setShowAddAreaModal] = useState(false)
  const [showAddPositionModal, setShowAddPositionModal] = useState(false)
  const [selectedArea, setSelectedArea] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Thêm state cho modal thêm vị trí nâng cao
  const [showAdvancedAddModal, setShowAdvancedAddModal] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case "empty":
        return "#10b981"
      case "occupied":
        return "#ef4444"
      case "maintenance":
        return "#f59e0b"
      case "reserved":
        return "#8b5cf6"
      default:
        return "#6b7280"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "empty":
        return "Trống"
      case "occupied":
        return "Đã sử dụng"
      case "maintenance":
        return "Bảo trì"
      case "reserved":
        return "Đã đặt"
      default:
        return "Không xác định"
    }
  }

  const getAreaStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#10b981"
      case "maintenance":
        return "#f59e0b"
      case "inactive":
        return "#6b7280"
      default:
        return "#6b7280"
    }
  }

  const getAreaStatusText = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động"
      case "maintenance":
        return "Bảo trì"
      case "inactive":
        return "Không hoạt động"
      default:
        return "Không xác định"
    }
  }

  const filteredAreas = areas.filter((area) => {
    const matchesSearch =
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || area.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleAddArea = () => {
    setShowAddAreaModal(true)
  }

  const handleEditArea = (area) => {
    setSelectedArea(area)
    setShowAddAreaModal(true)
  }

  const handleMaintenanceArea = (areaId) => {
    setAreas((prev) =>
      prev.map((area) =>
        area.id === areaId ? { ...area, status: area.status === "maintenance" ? "active" : "maintenance" } : area,
      ),
    )
  }

  return (
    <div className="quan-ly-vi-tri">
      <div className="page-header">
        <div className="header-actions">
          <div className="search-filter">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm khu vực..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="maintenance">Bảo trì</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
          <div className="action-buttons">
            {/* Cập nhật nút thêm vị trí để mở modal nâng cao */}
            <button className="btn btn-outline" onClick={() => setShowAdvancedAddModal(true)}>
              <Plus size={20} />
              Thêm vị trí nâng cao
            </button>
            <button className="btn btn-primary" onClick={handleAddArea}>
              <Plus size={20} />
              Thêm khu vực
            </button>
            <button className="btn btn-secondary">
              <Map size={20} />
              Xem map
            </button>
          </div>
        </div>
      </div>

      <div className="areas-container">
        {filteredAreas.map((area) => (
          <div key={area.id} className="area-card">
            <div className="area-header">
              <div className="area-info">
                <h3 className="area-name">
                  {area.name} - {area.description}
                </h3>
                <div className="area-details">
                  <span className="area-size">
                    Kích thước: {area.size} ({area.totalPositions} vị trí)
                  </span>
                  <span className="area-status" style={{ color: getAreaStatusColor(area.status) }}>
                    Trạng thái: {getAreaStatusText(area.status)}
                  </span>
                  <span className="area-usage">
                    Sử dụng: {area.usedPositions}/{area.totalPositions} (
                    {Math.round((area.usedPositions / area.totalPositions) * 100)}%)
                  </span>
                </div>
              </div>
              <div className="area-actions">
                <button className="btn btn-sm btn-outline" onClick={() => handleEditArea(area)}>
                  <Edit size={16} />
                  Sửa
                </button>
                <button
                  className={`btn btn-sm ${area.status === "maintenance" ? "btn-success" : "btn-warning"}`}
                  onClick={() => handleMaintenanceArea(area.id)}
                >
                  {area.status === "maintenance" ? (
                    <>
                      <CheckCircle size={16} />
                      Hoàn thành BT
                    </>
                  ) : (
                    <>
                      <Wrench size={16} />
                      Bảo trì
                    </>
                  )}
                </button>
                <button className="btn btn-sm btn-info">
                  <BarChart3 size={16} />
                  Thống kê
                </button>
              </div>
            </div>

            <div className="positions-grid">
              {area.positions.map((position) => (
                <div
                  key={position.id}
                  className="position-cell"
                  style={{
                    backgroundColor: getStatusColor(position.status),
                    color: "white",
                  }}
                  title={`${position.id} - ${getStatusText(position.status)}`}
                >
                  {position.id}
                  {position.status === "maintenance" && <AlertTriangle size={12} className="position-warning" />}
                </div>
              ))}
            </div>

            <div className="area-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#10b981" }}></div>
                <span>Trống</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#ef4444" }}></div>
                <span>Đã sử dụng</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#f59e0b" }}></div>
                <span>Bảo trì</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal thêm/sửa khu vực */}
      <Modal
        isOpen={showAddAreaModal}
        onClose={() => {
          setShowAddAreaModal(false)
          setSelectedArea(null)
        }}
        title={selectedArea ? "Sửa khu vực" : "Thêm khu vực mới"}
      >
        <form className="area-form">
          <div className="form-group">
            <label>Tên khu vực</label>
            <input type="text" placeholder="Nhập tên khu vực" defaultValue={selectedArea?.name || ""} />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <input type="text" placeholder="Nhập mô tả khu vực" defaultValue={selectedArea?.description || ""} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Chiều rộng</label>
              <input type="number" placeholder="5" min="1" max="20" />
            </div>
            <div className="form-group">
              <label>Chiều dài</label>
              <input type="number" placeholder="3" min="1" max="20" />
            </div>
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select defaultValue={selectedArea?.status || "active"}>
              <option value="active">Hoạt động</option>
              <option value="maintenance">Bảo trì</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowAddAreaModal(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedArea ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal thêm vị trí */}
      <Modal isOpen={showAddPositionModal} onClose={() => setShowAddPositionModal(false)} title="Thêm vị trí mới">
        <form className="position-form">
          <div className="form-group">
            <label>Chọn khu vực</label>
            <select>
              <option value="">Chọn khu vực</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name} - {area.description}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Mã vị trí</label>
            <input type="text" placeholder="Ví dụ: A1, B2, C3..." />
          </div>
          <div className="form-group">
            <label>Trạng thái ban đầu</label>
            <select>
              <option value="empty">Trống</option>
              <option value="maintenance">Bảo trì</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowAddPositionModal(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Thêm vị trí
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal thêm vị trí nâng cao */}
      <Modal
        isOpen={showAdvancedAddModal}
        onClose={() => setShowAdvancedAddModal(false)}
        title="Thêm vị trí kho mới"
        size="large"
      >
        <form className="advanced-position-form">
          <div className="form-row">
            <div className="form-group">
              <label>Khu vực</label>
              <select>
                <option value="">Chọn khu vực</option>
                <option value="A">Khu vực A</option>
                <option value="B">Khu vực B</option>
                <option value="C">Khu vực C</option>
                <option value="D">Khu vực D</option>
              </select>
            </div>
            <div className="form-group">
              <label>Loại vị trí</label>
              <select>
                <option value="pallet">Pallet</option>
                <option value="carton">Carton</option>
                <option value="bulk">Bulk</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h4>Phạm vi vị trí</h4>
            <div className="position-range">
              <div className="range-group">
                <label>Từ vị trí:</label>
                <div className="position-inputs">
                  <select className="zone-select">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                  <input type="number" min="1" max="99" placeholder="1" className="number-input" />
                </div>
              </div>
              <div className="range-group">
                <label>Đến vị trí:</label>
                <div className="position-inputs">
                  <select className="zone-select">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                  <input type="number" min="1" max="99" placeholder="5" className="number-input" />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Thông số kỹ thuật</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Tải trọng tối đa (kg)</label>
                <input type="number" placeholder="1000" />
              </div>
              <div className="form-group">
                <label>Chiều cao tối đa (cm)</label>
                <input type="number" placeholder="200" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Điều kiện môi trường</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Nhiệt độ yêu cầu (°C)</label>
                <div className="range-inputs">
                  <input type="number" placeholder="15" />
                  <span>-</span>
                  <input type="number" placeholder="25" />
                </div>
              </div>
              <div className="form-group">
                <label>Độ ẩm yêu cầu (%)</label>
                <div className="range-inputs">
                  <input type="number" placeholder="40" />
                  <span>-</span>
                  <input type="number" placeholder="70" />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Thuộc tính đặc biệt</h4>
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input type="checkbox" id="priority" />
                <label htmlFor="priority">Vị trí ưu tiên (FIFO)</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="isolation" />
                <label htmlFor="isolation">Vị trí cách ly (hàng đặc biệt)</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="nearExit" />
                <label htmlFor="nearExit">Gần cửa ra (xuất nhanh)</label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Ghi chú</label>
            <textarea rows="3" placeholder="Ghi chú thêm về vị trí..."></textarea>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowAdvancedAddModal(false)}>
              ❌ Hủy
            </button>
            <button type="button" className="btn btn-secondary">
              🔄 Reset
            </button>
            <button type="submit" className="btn btn-primary">
              💾 Lưu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default QuanLyViTri
