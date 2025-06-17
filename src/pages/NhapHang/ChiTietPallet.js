"use client"

import { useState, useEffect } from "react"
import { X, Package, Calendar, MapPin, AlertCircle } from "lucide-react"

function ChiTietPallet({ pallet, onClose }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [palletDetails, setPalletDetails] = useState(null)

  // Danh sách trạng thái pallet
  const trangThaiOptions = [
    { value: 'Mới', label: 'Mới (chưa mở)' },
    { value: 'Đã_mở', label: 'Đã mở niêm phong' },
    { value: 'Trống', label: 'Trống (không còn hàng)' }
  ]

  // Hàm lấy chi tiết pallet từ API
  const fetchPalletDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://127.0.0.1:8000/nhaphang/pallets/${pallet.ma_pallet}/`)
      if (!response.ok) {
        throw new Error("Không thể lấy thông tin pallet")
      }
      const data = await response.json()
      setPalletDetails(data)
    } catch (error) {
      console.error("Error fetching pallet details:", error)
      setError("Không thể lấy thông tin pallet. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  // Gọi API lấy chi tiết pallet khi component được mount
  useEffect(() => {
    fetchPalletDetails()
  }, [pallet.ma_pallet])

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="loading">Đang tải thông tin pallet...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="error">{error}</div>
        </div>
      </div>
    )
  }

  if (!palletDetails) {
    return null
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Chi tiết Pallet</h3>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
      </div>

        <div className="pallet-details">
      <div className="detail-section">
        <h4 className="section-title">
          <Package size={16} />
              Thông tin cơ bản
        </h4>

            <div className="detail-grid">
              <div className="detail-item">
                <label>Mã Pallet:</label>
                <span>{palletDetails.ma_pallet}</span>
              </div>

              <div className="detail-item">
                <label>Loại hàng:</label>
                <span>{palletDetails.loai_hang || "Không có"}</span>
          </div>

              <div className="detail-item">
            <label>Tên sản phẩm:</label>
                <span>{palletDetails.ten_san_pham}</span>
              </div>

              <div className="detail-item">
                <label>Số thùng ban đầu:</label>
                <span>{palletDetails.so_thung_ban_dau}</span>
              </div>

              <div className="detail-item">
                <label>Số thùng còn lại:</label>
                <span>{palletDetails.so_thung_con_lai}</span>
          </div>

              <div className="detail-item">
                <label>Trạng thái:</label>
                <span className={`status-badge status-${palletDetails.trang_thai.toLowerCase()}`}>
                  {trangThaiOptions.find(opt => opt.value === palletDetails.trang_thai)?.label || palletDetails.trang_thai}
            </span>
          </div>
            </div>
      </div>

      <div className="detail-section">
        <h4 className="section-title">
          <Calendar size={16} />
          Thông tin thời gian
        </h4>

            <div className="detail-grid">
              <div className="detail-item">
            <label>Ngày sản xuất:</label>
                <span>{new Date(palletDetails.ngay_san_xuat).toLocaleDateString()}</span>
          </div>

              <div className="detail-item">
            <label>Hạn sử dụng:</label>
                <span>{new Date(palletDetails.han_su_dung).toLocaleDateString()}</span>
              </div>

              <div className="detail-item">
                <label>Ngày kiểm tra CL:</label>
                <span>{new Date(palletDetails.ngay_kiem_tra_cl).toLocaleDateString()}</span>
              </div>

              <div className="detail-item">
                <label>Ngày tạo:</label>
                <span>{new Date(palletDetails.created_at).toLocaleString()}</span>
          </div>

              <div className="detail-item">
                <label>Ngày cập nhật:</label>
                <span>{new Date(palletDetails.updated_at).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h4 className="section-title">
              <MapPin size={16} />
              Vị trí kho
        </h4>

            <div className="detail-grid">
              <div className="detail-item">
                <label>Vị trí kho:</label>
                <span>{palletDetails.vi_tri_kho}</span>
          </div>
        </div>
      </div>

          {palletDetails.ghi_chu && (
        <div className="detail-section">
              <h4 className="section-title">
                <AlertCircle size={16} />
                Ghi chú
              </h4>

              <div className="detail-grid">
                <div className="detail-item full-width">
                  <label>Ghi chú:</label>
                  <span>{palletDetails.ghi_chu}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Đóng
        </button>
        </div>
      </div>
    </div>
  )
}

export default ChiTietPallet
