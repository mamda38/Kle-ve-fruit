"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Plus, Search, Package, Edit, Trash2, BarChart3 } from "lucide-react"
import Modal from "../../components/common/Modal"

const QuanLyHangHoaTree = () => {
  const [productGroups, setProductGroups] = useState([
    {
      id: 1,
      name: "Bia",
      icon: "🍺",
      expanded: true,
      productCount: 25,
      products: [
        { id: 1, name: "Heineken 330ml", stock: 150, unit: "thùng", status: "good" },
        { id: 2, name: "Tiger 355ml", stock: 89, unit: "thùng", status: "low" },
        { id: 3, name: "Saigon 330ml", stock: 200, unit: "thùng", status: "good" },
      ],
    },
    {
      id: 2,
      name: "Nước ngọt",
      icon: "🥤",
      expanded: true,
      productCount: 18,
      products: [
        { id: 4, name: "Coca Cola 330ml", stock: 75, unit: "thùng", status: "good" },
        { id: 5, name: "Pepsi 355ml", stock: 120, unit: "thùng", status: "good" },
        { id: 6, name: "Sprite 330ml", stock: 95, unit: "thùng", status: "good" },
      ],
    },
    {
      id: 3,
      name: "Nước suối",
      icon: "💧",
      expanded: false,
      productCount: 8,
      products: [
        { id: 7, name: "Lavie 500ml", stock: 300, unit: "thùng", status: "good" },
        { id: 8, name: "Aquafina 1.5L", stock: 180, unit: "thùng", status: "good" },
      ],
    },
  ])

  const [showAddGroupModal, setShowAddGroupModal] = useState(false)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const toggleGroup = (groupId) => {
    setProductGroups((prev) =>
      prev.map((group) => (group.id === groupId ? { ...group, expanded: !group.expanded } : group)),
    )
  }

  const getStockStatus = (stock) => {
    if (stock < 50) return "low"
    if (stock < 100) return "medium"
    return "good"
  }

  const getStockColor = (status) => {
    switch (status) {
      case "low":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "good":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const filteredGroups = productGroups.filter((group) => group.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="quan-ly-hang-hoa-tree">
      <div className="page-header">
        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm nhóm hàng, sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="action-buttons">
            <button className="btn btn-outline" onClick={() => setShowAddGroupModal(true)}>
              <Plus size={20} />
              Thêm nhóm hàng
            </button>
            <button className="btn btn-primary" onClick={() => setShowAddProductModal(true)}>
              <Plus size={20} />
              Thêm sản phẩm
            </button>
          </div>
        </div>
      </div>

      <div className="product-tree">
        {filteredGroups.map((group) => (
          <div key={group.id} className="product-group">
            <div className="group-header" onClick={() => toggleGroup(group.id)}>
              <div className="group-toggle">
                {group.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
              <div className="group-info">
                <span className="group-icon">{group.icon}</span>
                <span className="group-name">
                  {group.name} ({group.productCount} sản phẩm)
                </span>
              </div>
              <div className="group-actions" onClick={(e) => e.stopPropagation()}>
                <button className="action-btn">
                  <Edit size={14} />
                </button>
                <button className="action-btn">
                  <BarChart3 size={14} />
                </button>
                <button className="action-btn delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {group.expanded && (
              <div className="products-list">
                {group.products.map((product) => (
                  <div key={product.id} className="product-item">
                    <div className="product-info">
                      <div className="product-icon">
                        <Package size={16} />
                      </div>
                      <div className="product-details">
                        <span className="product-name">{product.name}</span>
                        <div className="product-stock">
                          <span className="stock-value" style={{ color: getStockColor(getStockStatus(product.stock)) }}>
                            Stock: {product.stock} {product.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="product-actions">
                      <button className="action-btn">
                        <Edit size={14} />
                      </button>
                      <button className="action-btn">
                        <BarChart3 size={14} />
                      </button>
                      <button className="action-btn delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal thêm nhóm hàng */}
      <Modal isOpen={showAddGroupModal} onClose={() => setShowAddGroupModal(false)} title="Thêm nhóm hàng mới">
        <form className="group-form">
          <div className="form-group">
            <label>Tên nhóm hàng</label>
            <input type="text" placeholder="Nhập tên nhóm hàng" />
          </div>
          <div className="form-group">
            <label>Icon</label>
            <div className="icon-selector">
              <button type="button" className="icon-option">
                🍺
              </button>
              <button type="button" className="icon-option">
                🥤
              </button>
              <button type="button" className="icon-option">
                💧
              </button>
              <button type="button" className="icon-option">
                🧃
              </button>
              <button type="button" className="icon-option">
                ☕
              </button>
              <button type="button" className="icon-option">
                🥛
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea rows="3" placeholder="Mô tả nhóm hàng..."></textarea>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowAddGroupModal(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Thêm mới
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal thêm sản phẩm */}
      <Modal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        title="Thêm sản phẩm mới"
        size="large"
      >
        <form className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Mã sản phẩm</label>
              <input type="text" value="AUTO-SP-001" disabled />
              <small>Mã tự động sinh</small>
            </div>
            <div className="form-group">
              <label>Tên sản phẩm</label>
              <input type="text" placeholder="Nhập tên sản phẩm" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nhóm hàng</label>
              <select>
                <option value="">Chọn nhóm hàng</option>
                <option value="1">Bia</option>
                <option value="2">Nước ngọt</option>
                <option value="3">Nước suối</option>
              </select>
            </div>
            <div className="form-group">
              <label>Thương hiệu</label>
              <input type="text" placeholder="Nhập thương hiệu" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Dung tích (ml)</label>
              <input type="number" placeholder="330" />
            </div>
            <div className="form-group">
              <label>Đơn vị tính</label>
              <select>
                <option value="thung">Thùng</option>
                <option value="chai">Chai</option>
                <option value="loc">Lốc</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Số lượng/thùng</label>
            <input type="number" placeholder="24" />
          </div>

          <div className="form-section">
            <h4>Yêu cầu bảo quản</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Nhiệt độ (°C)</label>
                <div className="range-inputs">
                  <input type="number" placeholder="15" />
                  <span>-</span>
                  <input type="number" placeholder="25" />
                </div>
              </div>
              <div className="form-group">
                <label>Độ ẩm (%)</label>
                <div className="range-inputs">
                  <input type="number" placeholder="40" />
                  <span>-</span>
                  <input type="number" placeholder="70" />
                </div>
              </div>
            </div>

            <div className="checkbox-group">
              <div className="checkbox-item">
                <input type="checkbox" id="avoidLight" />
                <label htmlFor="avoidLight">Tránh ánh sáng</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="avoidVibration" />
                <label htmlFor="avoidVibration">Tránh rung động</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="fragile" />
                <label htmlFor="fragile">Hàng dễ vỡ</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="dangerous" />
                <label htmlFor="dangerous">Hàng nguy hiểm</label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Thông tin bổ sung</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Mã vạch</label>
                <input type="text" placeholder="Nhập mã vạch" />
              </div>
              <div className="form-group">
                <label>Nhà cung cấp</label>
                <select>
                  <option value="">Chọn nhà cung cấp</option>
                  <option value="1">Heineken Vietnam</option>
                  <option value="2">Coca Cola Vietnam</option>
                  <option value="3">Pepsi Vietnam</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Hạn sử dụng mặc định (ngày)</label>
                <input type="number" placeholder="365" />
              </div>
              <div className="form-group">
                <label>Chu kỳ kiểm tra CL (ngày)</label>
                <input type="number" placeholder="30" />
              </div>
            </div>

            <div className="form-group">
              <label>Ghi chú</label>
              <textarea rows="3" placeholder="Ghi chú thêm về sản phẩm..."></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowAddProductModal(false)}>
              ❌ Hủy
            </button>
            <button type="button" className="btn btn-secondary">
              📷 Chụp ảnh
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

export default QuanLyHangHoaTree
