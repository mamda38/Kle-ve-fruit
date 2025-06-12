"use client"

import { useState } from "react"
import { Calendar, MapPin, Package } from "lucide-react"

const ThemPallet = ({ onSubmit, onCancel, nextPalletCode }) => {
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    quantity: "",
    unit: "pallet",
    importDate: new Date().toISOString().slice(0, 16),
    productionDate: "",
    expiryDate: "",
    qualityCheckDate: new Date().toISOString().slice(0, 10),
    location: "",
    supplier: "",
    notes: "",
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.productCode) newErrors.productCode = "Vui lòng nhập mã sản phẩm"
    if (!formData.productName) newErrors.productName = "Vui lòng nhập tên sản phẩm"
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Số lượng phải lớn hơn 0"
    if (!formData.productionDate) newErrors.productionDate = "Vui lòng nhập ngày sản xuất"
    if (!formData.expiryDate) newErrors.expiryDate = "Vui lòng nhập hạn sử dụng"
    if (!formData.location) newErrors.location = "Vui lòng nhập vị trí"
    if (!formData.supplier) newErrors.supplier = "Vui lòng nhập nhà cung cấp"

    // Kiểm tra logic ngày tháng
    if (formData.productionDate && formData.expiryDate) {
      if (new Date(formData.productionDate) >= new Date(formData.expiryDate)) {
        newErrors.expiryDate = "Hạn sử dụng phải sau ngày sản xuất"
      }
    }

    if (formData.productionDate && formData.importDate) {
      if (new Date(formData.productionDate) > new Date(formData.importDate)) {
        newErrors.productionDate = "Ngày sản xuất không thể sau ngày nhập"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pallet-form">
      <div className="form-section">
        <h4 className="section-title">
          <Package size={16} />
          Thông tin cơ bản
        </h4>

        <div className="form-row">
          {/* <div className="form-group">
            <label className="form-label">Mã Pallet</label>
            <input type="text" className="form-input" value={nextPalletCode} disabled />
          </div> */}
          <div className="form-group">
            <label className="form-label">Mã sản phẩm *</label>
            <input
              type="text"
              className={`form-input ${errors.productCode ? "error" : ""}`}
              value={formData.productCode}
              onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
              placeholder="Nhập mã sản phẩm"
            />
            {errors.productCode && <span className="error-text">{errors.productCode}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tên sản phẩm *</label>
            <input
              type="text"
              className={`form-input ${errors.productName ? "error" : ""}`}
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              placeholder="Nhập tên sản phẩm"
            />
            {errors.productName && <span className="error-text">{errors.productName}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Số lượng *</label>
            <input
              type="number"
              className={`form-input ${errors.quantity ? "error" : ""}`}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="Nhập số lượng"
            />
            {errors.quantity && <span className="error-text">{errors.quantity}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Đơn vị</label>
            <input type="text" className="form-input" value={formData.unit} disabled />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4 className="section-title">
          <Calendar size={16} />
          Thông tin thời gian
        </h4>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Ngày giờ nhập</label>
            <input
              type="datetime-local"
              className="form-input"
              value={formData.importDate}
              onChange={(e) => setFormData({ ...formData, importDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Ngày sản xuất *</label>
            <input
              type="date"
              className={`form-input ${errors.productionDate ? "error" : ""}`}
              value={formData.productionDate}
              onChange={(e) => setFormData({ ...formData, productionDate: e.target.value })}
            />
            {errors.productionDate && <span className="error-text">{errors.productionDate}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Hạn sử dụng *</label>
            <input
              type="date"
              className={`form-input ${errors.expiryDate ? "error" : ""}`}
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
            {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Ngày kiểm tra chất lượng</label>
            <input
              type="date"
              className="form-input"
              value={formData.qualityCheckDate}
              onChange={(e) => setFormData({ ...formData, qualityCheckDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4 className="section-title">
          <MapPin size={16} />
          Vị trí & Nhà cung cấp
        </h4>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Vị trí để pallet *</label>
            <input
              type="text"
              className={`form-input ${errors.location ? "error" : ""}`}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Nhập vị trí (VD: A-01-01)"
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Nhà cung cấp *</label>
            <input
              type="text"
              className={`form-input ${errors.supplier ? "error" : ""}`}
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              placeholder="Nhập tên nhà cung cấp"
            />
            {errors.supplier && <span className="error-text">{errors.supplier}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ghi chú</label>
          <textarea
            className="form-input"
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Nhập ghi chú về chất lượng, tình trạng sản phẩm..."
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className="btn btn-primary">
          Tạo Pallet
        </button>
      </div>
    </form>
  )
}

export default ThemPallet
