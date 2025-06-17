"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Package } from "lucide-react"

function SuaPallet({ pallet, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    ma_pallet: pallet.ma_pallet,
    loai_hang: pallet.loai_hang || "",
    ten_san_pham: pallet.ten_san_pham,
    so_thung_ban_dau: pallet.so_thung_ban_dau,
    so_thung_con_lai: pallet.so_thung_con_lai,
    vi_tri_kho: pallet.vi_tri_kho,
    ngay_san_xuat: pallet.ngay_san_xuat,
    han_su_dung: pallet.han_su_dung,
    ngay_kiem_tra_cl: pallet.ngay_kiem_tra_cl,
    trang_thai: pallet.trang_thai,
    ghi_chu: pallet.ghi_chu || "",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Danh sách trạng thái pallet
  const trangThaiOptions = [
    { value: 'Mới', label: 'Mới (chưa mở)' },
    { value: 'Đã_mở', label: 'Đã mở niêm phong' },
    { value: 'Trống', label: 'Trống (không còn hàng)' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    let processedValue = value

    // Xử lý kiểu dữ liệu cho từng trường
    switch (name) {
      case 'so_thung_ban_dau':
      case 'so_thung_con_lai':
        processedValue = value === '' ? '' : parseInt(value)
        break
      case 'ma_pallet':
        processedValue = value.slice(0, 20)
        break
      case 'loai_hang':
        processedValue = value.slice(0, 50)
        break
      case 'ten_san_pham':
        processedValue = value.slice(0, 100)
        break
      case 'vi_tri_kho':
        processedValue = value.slice(0, 10)
        break
      case 'trang_thai':
        processedValue = value.slice(0, 5)
        break
      default:
        processedValue = value
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.ten_san_pham) {
      newErrors.ten_san_pham = "Vui lòng nhập tên sản phẩm"
    } else if (formData.ten_san_pham.length > 100) {
      newErrors.ten_san_pham = "Tên sản phẩm không được vượt quá 100 ký tự"
    }

    if (!formData.so_thung_ban_dau || formData.so_thung_ban_dau <= 0) {
      newErrors.so_thung_ban_dau = "Số thùng ban đầu phải là số nguyên dương"
    }

    if (!formData.so_thung_con_lai || formData.so_thung_con_lai < 0) {
      newErrors.so_thung_con_lai = "Số thùng còn lại không được âm"
    }

    if (formData.so_thung_con_lai > formData.so_thung_ban_dau) {
      newErrors.so_thung_con_lai = "Số thùng còn lại không được lớn hơn số thùng ban đầu"
    }

    if (!formData.vi_tri_kho) {
      newErrors.vi_tri_kho = "Vui lòng nhập vị trí kho"
    } else if (formData.vi_tri_kho.length > 10) {
      newErrors.vi_tri_kho = "Vị trí kho không được vượt quá 10 ký tự"
    }

    if (!formData.ngay_san_xuat) {
      newErrors.ngay_san_xuat = "Vui lòng nhập ngày sản xuất"
    }

    if (!formData.han_su_dung) {
      newErrors.han_su_dung = "Vui lòng nhập hạn sử dụng"
    }

    // Kiểm tra logic ngày tháng
    if (formData.ngay_san_xuat && formData.han_su_dung) {
      if (new Date(formData.ngay_san_xuat) >= new Date(formData.han_su_dung)) {
        newErrors.han_su_dung = "Hạn sử dụng phải sau ngày sản xuất"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`http://127.0.0.1:8000/nhaphang/pallets/${pallet.ma_pallet}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error Response:", errorData)
        const errorMessage = errorData.detail || 
          (typeof errorData === 'object' ? JSON.stringify(errorData) : "Có lỗi xảy ra khi cập nhật pallet")
        throw new Error(errorMessage)
      }

      const result = await response.json()
      alert("Cập nhật pallet thành công!")
      
      if (onSubmit) {
        onSubmit(result)
      }
    } catch (error) {
      console.error("Error updating pallet:", error)
      alert(`Cập nhật pallet thất bại: ${error.message}`)
    } finally {
      setLoading(false)
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
          <div className="form-group">
            <label className="form-label">Mã Pallet</label>
            <input 
              type="text" 
              name="ma_pallet"
              className="form-input" 
              value={formData.ma_pallet} 
              disabled 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Loại hàng</label>
            <input
              type="text"
              name="loai_hang"
              className="form-input"
              value={formData.loai_hang}
              onChange={handleChange}
              placeholder="Nhập loại hàng (không bắt buộc)"
              maxLength={50}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tên sản phẩm *</label>
            <input
              type="text"
              name="ten_san_pham"
              className={`form-input ${errors.ten_san_pham ? "error" : ""}`}
              value={formData.ten_san_pham}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm"
              maxLength={100}
              disabled={loading}
            />
            {errors.ten_san_pham && <span className="error-text">{errors.ten_san_pham}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Số thùng ban đầu *</label>
            <input
              type="number"
              name="so_thung_ban_dau"
              className={`form-input ${errors.so_thung_ban_dau ? "error" : ""}`}
              value={formData.so_thung_ban_dau}
              onChange={handleChange}
              placeholder="Nhập số thùng"
              min="1"
              disabled={loading}
            />
            {errors.so_thung_ban_dau && <span className="error-text">{errors.so_thung_ban_dau}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Số thùng còn lại *</label>
            <input
              type="number"
              name="so_thung_con_lai"
              className={`form-input ${errors.so_thung_con_lai ? "error" : ""}`}
              value={formData.so_thung_con_lai}
              onChange={handleChange}
              placeholder="Nhập số thùng còn lại"
              min="0"
              max={formData.so_thung_ban_dau}
              disabled={loading}
            />
            {errors.so_thung_con_lai && <span className="error-text">{errors.so_thung_con_lai}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Trạng thái *</label>
            <select
              name="trang_thai"
              className={`form-input ${errors.trang_thai ? "error" : ""}`}
              value={formData.trang_thai}
              onChange={handleChange}
              disabled={loading}
            >
              {trangThaiOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.trang_thai && <span className="error-text">{errors.trang_thai}</span>}
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
            <label className="form-label">Ngày sản xuất *</label>
            <input
              type="date"
              name="ngay_san_xuat"
              className={`form-input ${errors.ngay_san_xuat ? "error" : ""}`}
              value={formData.ngay_san_xuat}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.ngay_san_xuat && <span className="error-text">{errors.ngay_san_xuat}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Hạn sử dụng *</label>
            <input
              type="date"
              name="han_su_dung"
              className={`form-input ${errors.han_su_dung ? "error" : ""}`}
              value={formData.han_su_dung}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.han_su_dung && <span className="error-text">{errors.han_su_dung}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Ngày kiểm tra CL</label>
            <input
              type="date"
              name="ngay_kiem_tra_cl"
              className="form-input"
              value={formData.ngay_kiem_tra_cl}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4 className="section-title">
          <MapPin size={16} />
          Vị trí kho
        </h4>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Vị trí kho *</label>
            <input
              type="text"
              name="vi_tri_kho"
              className={`form-input ${errors.vi_tri_kho ? "error" : ""}`}
              value={formData.vi_tri_kho}
              onChange={handleChange}
              placeholder="Ví dụ: A1-B2"
              maxLength={10}
              disabled={loading}
            />
            {errors.vi_tri_kho && <span className="error-text">{errors.vi_tri_kho}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ghi chú</label>
          <textarea
            name="ghi_chu"
            className="form-input"
            rows="3"
            value={formData.ghi_chu}
            onChange={handleChange}
            placeholder="Nhập ghi chú về chất lượng, tình trạng sản phẩm..."
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Hủy
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Đang cập nhật..." : "Cập nhật Pallet"}
        </button>
      </div>
    </form>
  )
}

export default SuaPallet 