"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Package, Tag, Star } from "lucide-react"
import Modal from "../../components/common/Modal"

const QuanLySanPham = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Mock data sản phẩm
  const [products, setProducts] = useState([
    {
      id: 1,
      code: "AP001",
      name: "Táo Fuji",
      category: "Táo",
      parentCategory: "Trái cây có múi",
      unit: "kg",
      description: "Táo Fuji nhập khẩu từ Nhật Bản",
      isTemplate: true,
      status: "active",
      createdDate: "2024-01-10",
    },
    {
      id: 2,
      code: "AP002",
      name: "Táo Gala",
      category: "Táo",
      parentCategory: "Trái cây có múi",
      unit: "kg",
      description: "Táo Gala tươi ngon",
      isTemplate: false,
      status: "active",
      createdDate: "2024-01-12",
    },
    {
      id: 3,
      code: "OR001",
      name: "Cam Sành",
      category: "Cam",
      parentCategory: "Trái cây có múi",
      unit: "kg",
      description: "Cam sành Việt Nam",
      isTemplate: true,
      status: "active",
      createdDate: "2024-01-15",
    },
    {
      id: 4,
      code: "BN001",
      name: "Chuối Tiêu",
      category: "Chuối",
      parentCategory: "Trái cây nhiệt đới",
      unit: "kg",
      description: "Chuối tiêu Đồng Nai",
      isTemplate: false,
      status: "active",
      createdDate: "2024-01-08",
    },
  ])

  // Danh mục phân cấp
  const categories = {
    "Trái cây có múi": ["Táo", "Cam", "Quýt", "Bưởi"],
    "Trái cây nhiệt đới": ["Chuối", "Xoài", "Dứa", "Đu đủ"],
    "Trái cây mọng nước": ["Nho", "Dâu", "Cherry", "Việt quất"],
    "Trái cây khô": ["Hạnh nhân", "Óc chó", "Hạt điều", "Nho khô"],
  }

  const units = ["kg", "gram", "thùng", "túi", "quả"]

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "",
    parentCategory: "",
    unit: "kg",
    description: "",
    isTemplate: false,
    status: "active",
  })

  const [errors, setErrors] = useState({})

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "" || product.parentCategory === selectedCategory
    return matchesSearch && matchesCategory
  })

  const templateProducts = products.filter((p) => p.isTemplate)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.code.trim()) newErrors.code = "Mã sản phẩm không được để trống"
    if (!formData.name.trim()) newErrors.name = "Tên sản phẩm không được để trống"
    if (!formData.parentCategory) newErrors.parentCategory = "Vui lòng chọn danh mục cha"
    if (!formData.category) newErrors.category = "Vui lòng chọn danh mục con"
    if (!formData.unit) newErrors.unit = "Vui lòng chọn đơn vị"

    // Check duplicate code
    const existingProduct = products.find(
      (p) => p.code.toLowerCase() === formData.code.toLowerCase() && p.id !== selectedProduct?.id,
    )
    if (existingProduct) {
      newErrors.code = "Mã sản phẩm đã tồn tại"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateProductCode = (parentCategory, category) => {
    const parentPrefix = parentCategory.charAt(0).toUpperCase()
    const categoryPrefix = category.substring(0, 2).toUpperCase()
    const existingCodes = products
      .filter((p) => p.code.startsWith(parentPrefix + categoryPrefix))
      .map((p) => Number.parseInt(p.code.slice(-3)))
    const nextNumber = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1
    return `${parentPrefix}${categoryPrefix}${nextNumber.toString().padStart(3, "0")}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      if (showEditModal && selectedProduct) {
        // Update product
        setProducts(
          products.map((product) => (product.id === selectedProduct.id ? { ...product, ...formData } : product)),
        )
        setShowEditModal(false)
      } else {
        // Add new product
        const newProduct = {
          id: Date.now(),
          ...formData,
          createdDate: new Date().toISOString().slice(0, 10),
        }
        setProducts([...products, newProduct])
        setShowAddModal(false)
      }
      resetForm()
    }
  }

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      category: "",
      parentCategory: "",
      unit: "kg",
      description: "",
      isTemplate: false,
      status: "active",
    })
    setErrors({})
    setSelectedProduct(null)
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setFormData({
      code: product.code,
      name: product.name,
      category: product.category,
      parentCategory: product.parentCategory,
      unit: product.unit,
      description: product.description,
      isTemplate: product.isTemplate,
      status: product.status,
    })
    setShowEditModal(true)
  }

  const handleDelete = (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setProducts(products.filter((product) => product.id !== productId))
    }
  }

  const handleParentCategoryChange = (parentCategory) => {
    setFormData({
      ...formData,
      parentCategory,
      category: "",
      code: "",
    })
  }

  const handleCategoryChange = (category) => {
    const newCode = generateProductCode(formData.parentCategory, category)
    setFormData({
      ...formData,
      category,
      code: newCode,
    })
  }

  const createFromTemplate = (template) => {
    setFormData({
      code: generateProductCode(template.parentCategory, template.category),
      name: template.name,
      category: template.category,
      parentCategory: template.parentCategory,
      unit: template.unit,
      description: template.description,
      isTemplate: false,
      status: "active",
    })
    setShowTemplateModal(false)
    setShowAddModal(true)
  }

  const ProductForm = () => (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Danh mục cha *</label>
          <select
            className={`form-input ${errors.parentCategory ? "error" : ""}`}
            value={formData.parentCategory}
            onChange={(e) => handleParentCategoryChange(e.target.value)}
          >
            <option value="">Chọn danh mục cha</option>
            {Object.keys(categories).map((parent) => (
              <option key={parent} value={parent}>
                {parent}
              </option>
            ))}
          </select>
          {errors.parentCategory && <span className="error-text">{errors.parentCategory}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Danh mục con *</label>
          <select
            className={`form-input ${errors.category ? "error" : ""}`}
            value={formData.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={!formData.parentCategory}
          >
            <option value="">Chọn danh mục con</option>
            {formData.parentCategory &&
              categories[formData.parentCategory].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Mã sản phẩm *</label>
          <input
            type="text"
            className={`form-input ${errors.code ? "error" : ""}`}
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Mã sẽ được tạo tự động"
          />
          {errors.code && <span className="error-text">{errors.code}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Tên sản phẩm *</label>
          <input
            type="text"
            className={`form-input ${errors.name ? "error" : ""}`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên sản phẩm"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Đơn vị *</label>
          <select
            className={`form-input ${errors.unit ? "error" : ""}`}
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {errors.unit && <span className="error-text">{errors.unit}</span>}
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
      </div>

      <div className="form-group">
        <label className="form-label">Mô tả</label>
        <textarea
          className="form-input"
          rows="3"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Nhập mô tả sản phẩm"
        />
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.isTemplate}
            onChange={(e) => setFormData({ ...formData, isTemplate: e.target.checked })}
          />
          <span className="checkmark"></span>
          Đặt làm template thường dùng
        </label>
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
          {showEditModal ? "Cập nhật" : "Thêm sản phẩm"}
        </button>
      </div>
    </form>
  )

  const TemplateModal = () => (
    <div className="template-modal">
      <h4>Chọn template sản phẩm</h4>
      <div className="template-grid">
        {templateProducts.map((template) => (
          <div key={template.id} className="template-card" onClick={() => createFromTemplate(template)}>
            <div className="template-header">
              <Package size={20} />
              <Star size={16} className="template-star" />
            </div>
            <div className="template-info">
              <div className="template-name">{template.name}</div>
              <div className="template-code">{template.code}</div>
              <div className="template-category">{template.category}</div>
            </div>
          </div>
        ))}
      </div>
      {templateProducts.length === 0 && (
        <div className="no-templates">
          <p>Chưa có template nào. Hãy tạo sản phẩm và đánh dấu làm template.</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="quan-ly-san-pham">
      <div className="section-header">
        <div>
          <h2 className="section-title">Quản lý Sản phẩm</h2>
          <p className="section-subtitle">Quản lý danh mục và thông tin sản phẩm</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowTemplateModal(true)}>
            <Star size={16} />
            Template ({templateProducts.length})
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã sản phẩm..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-input"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ maxWidth: "200px" }}
        >
          <option value="">Tất cả danh mục</option>
          {Object.keys(categories).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} style={{ color: "#00FF33" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{products.filter((p) => p.status === "active").length}</div>
            <div className="stat-label">Sản phẩm hoạt động</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Tag size={24} style={{ color: "#17a2b8" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{Object.keys(categories).length}</div>
            <div className="stat-label">Danh mục cha</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Star size={24} style={{ color: "#ffc107" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{templateProducts.length}</div>
            <div className="stat-label">Template thường dùng</div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="products-table card">
        <div className="card-header">
          <h3 className="card-title">Danh sách sản phẩm ({filteredProducts.length})</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Mã SP</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Đơn vị</th>
                  <th>Template</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <span className="product-code">{product.code}</span>
                    </td>
                    <td>
                      <div className="product-info">
                        <span className="product-name">{product.name}</span>
                        {product.description && <span className="product-desc">{product.description}</span>}
                      </div>
                    </td>
                    <td>
                      <div className="category-info">
                        <span className="parent-category">{product.parentCategory}</span>
                        <span className="sub-category">{product.category}</span>
                      </div>
                    </td>
                    <td>
                      <span className="unit-badge">{product.unit}</span>
                    </td>
                    <td>
                      {product.isTemplate && (
                        <span className="template-badge">
                          <Star size={12} />
                          Template
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${product.status === "active" ? "badge-success" : "badge-secondary"}`}>
                        {product.status === "active" ? "Hoạt động" : "Tạm dừng"}
                      </span>
                    </td>
                    <td className="date-cell">{new Date(product.createdDate).toLocaleDateString("vi-VN")}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action edit" onClick={() => handleEdit(product)} title="Chỉnh sửa">
                          <Edit size={14} />
                        </button>
                        <button className="btn-action delete" onClick={() => handleDelete(product.id)} title="Xóa">
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
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Thêm sản phẩm mới">
        <ProductForm />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Chỉnh sửa sản phẩm">
        <ProductForm />
      </Modal>

      <Modal isOpen={showTemplateModal} onClose={() => setShowTemplateModal(false)} title="Template sản phẩm">
        <TemplateModal />
      </Modal>
    </div>
  )
}

export default QuanLySanPham
