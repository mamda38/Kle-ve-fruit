"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, MapPin, Phone, Store } from "lucide-react"
import Modal from "../../components/common/Modal"

const QuanLyCuaHang = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArea, setSelectedArea] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedStore, setSelectedStore] = useState(null)

  // Mock data cửa hàng
  const [stores, setStores] = useState([
    {
      id: 1,
      name: "Siêu thị BigC Thăng Long",
      address: "222 Trần Duy Hưng, Cầu Giấy, Hà Nội",
      phone: "024-3555-1234",
      area: "Hà Nội",
      type: "Siêu thị",
      status: "active",
      createdDate: "2024-01-10",
    },
    {
      id: 2,
      name: "Cửa hàng Trái cây Sạch ABC",
      address: "45 Nguyễn Văn Cừ, Quận 1, TP.HCM",
      phone: "028-3888-5678",
      area: "TP.HCM",
      type: "Cửa hàng",
      status: "active",
      createdDate: "2024-01-12",
    },
    {
      id: 3,
      name: "Lotte Mart Đà Nẵng",
      address: "6 Nại Nam, Hòa Cường Bắc, Hải Châu, Đà Nẵng",
      phone: "0236-3999-888",
      area: "Đà Nẵng",
      type: "Siêu thị",
      status: "active",
      createdDate: "2024-01-15",
    },
    {
      id: 4,
      name: "Cửa hàng Organic Fresh",
      address: "123 Lê Lợi, Quận Ngô Quyền, Hải Phòng",
      phone: "0225-3777-999",
      area: "Hải Phòng",
      type: "Cửa hàng",
      status: "inactive",
      createdDate: "2024-01-08",
    },
  ])

  const areas = ["Hà Nội", "TP.HCM", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Khác"]
  const storeTypes = ["Siêu thị", "Cửa hàng", "Đại lý", "Nhà phân phối"]

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    area: "",
    type: "",
    status: "active",
  })

  const [errors, setErrors] = useState({})

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.phone.includes(searchTerm)
    const matchesArea = selectedArea === "" || store.area === selectedArea
    return matchesSearch && matchesArea
  })

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Tên cửa hàng không được để trống"
    if (!formData.address.trim()) newErrors.address = "Địa chỉ không được để trống"
    if (!formData.phone.trim()) newErrors.phone = "Số điện thoại không được để trống"
    if (!formData.area) newErrors.area = "Vui lòng chọn khu vực"
    // if (!formData.type) newErrors.type = "Vui lòng chọn loại cửa hàng"

    // Validate phone number
    const phoneRegex = /^[0-9]{10,11}$/
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      if (showEditModal && selectedStore) {
        // Update store
        setStores(stores.map((store) => (store.id === selectedStore.id ? { ...store, ...formData } : store)))
        setShowEditModal(false)
      } else {
        // Add new store
        const newStore = {
          id: Date.now(),
          ...formData,
          createdDate: new Date().toISOString().slice(0, 10),
        }
        setStores([...stores, newStore])
        setShowAddModal(false)
      }
      resetForm()
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      area: "",
      type: "",
      status: "active",
    })
    setErrors({})
    setSelectedStore(null)
  }

  const handleEdit = (store) => {
    setSelectedStore(store)
    setFormData({
      name: store.name,
      address: store.address,
      phone: store.phone,
      area: store.area,
      type: store.type,
      status: store.status,
    })
    setShowEditModal(true)
  }

  const handleDelete = (storeId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cửa hàng này?")) {
      setStores(stores.filter((store) => store.id !== storeId))
    }
  }

  const getStatusBadge = (status) => {
    return (
      <span className={`badge ${status === "active" ? "badge-success" : "badge-secondary"}`}>
        {status === "active" ? "Hoạt động" : "Tạm dừng"}
      </span>
    )
  }

  const StoreForm = () => (
    <form onSubmit={handleSubmit} className="store-form">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Tên cửa hàng *</label>
          <input
            type="text"
            className={`form-input ${errors.name ? "error" : ""}`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên cửa hàng"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        {/* <div className="form-group">
          <label className="form-label">Loại cửa hàng *</label>
          <select
            className={`form-input ${errors.type ? "error" : ""}`}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="">Chọn loại cửa hàng</option>
            {storeTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && <span className="error-text">{errors.type}</span>}
        </div> */}
      </div>

      <div className="form-group">
        <label className="form-label">Địa chỉ *</label>
        <input
          type="text"
          className={`form-input ${errors.address ? "error" : ""}`}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Nhập địa chỉ đầy đủ"
        />
        {errors.address && <span className="error-text">{errors.address}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Số điện thoại *</label>
          <input
            type="tel"
            className={`form-input ${errors.phone ? "error" : ""}`}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Nhập số điện thoại"
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Khu vực *</label>
          <select
            className={`form-input ${errors.area ? "error" : ""}`}
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          >
            <option value="">Chọn khu vực</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          {errors.area && <span className="error-text">{errors.area}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Trạng thái</label>
        <select
          className="form-input"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="active">Hoạt động</option>
          <option value="inactive">Tạm dừng</option>
        </select>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setShowAddModal(false)
            setShowEditModal(false)
            resetForm()
          }}
        >
          Hủy
        </button>
        <button type="submit" className="btn btn-primary">
          {showEditModal ? "Cập nhật" : "Thêm cửa hàng"}
        </button>
      </div>
    </form>
  )

  return (
    <div className="quan-ly-cua-hang">
      <div className="section-header">
        <div>
          <h2 className="section-title">Quản lý Cửa hàng</h2>
          <p className="section-subtitle">Quản lý thông tin các cửa hàng và đối tác</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Thêm cửa hàng
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, địa chỉ, SĐT..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-input"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          style={{ maxWidth: "200px" }}
        >
          <option value="">Tất cả khu vực</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Store size={24} style={{ color: "#00FF33" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stores.filter((s) => s.status === "active").length}</div>
            <div className="stat-label">Cửa hàng hoạt động</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <MapPin size={24} style={{ color: "#17a2b8" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{new Set(stores.map((s) => s.area)).size}</div>
            <div className="stat-label">Khu vực phủ sóng</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Phone size={24} style={{ color: "#ffc107" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stores.length}</div>
            <div className="stat-label">Tổng số cửa hàng</div>
          </div>
        </div>
      </div>

      {/* Stores Table */}
      <div className="stores-table card">
        <div className="card-header">
          <h3 className="card-title">Danh sách cửa hàng ({filteredStores.length})</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tên cửa hàng</th>
                  <th>Địa chỉ</th>
                  <th>SĐT</th>
                  <th>Khu vực</th>
                  {/* <th>Loại</th> */}
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map((store) => (
                  <tr key={store.id}>
                    <td>
                      <div className="store-info">
                        <span className="store-name">{store.name}</span>
                      </div>
                    </td>
                    <td className="address-cell">{store.address}</td>
                    <td className="phone-cell">{store.phone}</td>
                    <td>
                      <span className="area-badge">{store.area}</span>
                    </td>
                    <td>
                      <span className="type-badge">{store.type}</span>
                    </td>
                    <td>{getStatusBadge(store.status)}</td>
                    <td className="date-cell">{new Date(store.createdDate).toLocaleDateString("vi-VN")}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action edit" onClick={() => handleEdit(store)} title="Chỉnh sửa">
                          <Edit size={14} />
                        </button>
                        <button className="btn-action delete" onClick={() => handleDelete(store.id)} title="Xóa">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Thêm cửa hàng mới">
        <StoreForm />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Chỉnh sửa cửa hàng">
        <StoreForm />
      </Modal>
    </div>
  )
}

export default QuanLyCuaHang
