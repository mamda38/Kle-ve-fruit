"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Package, QrCode, Eye, Edit, Trash2 } from "lucide-react"
import Modal from "../../components/common/Modal"
import ThemPallet from "./ThemPallet"
import ChiTietPallet from "./ChiTietPallet"
import InQRPallet from "./InQRPallet"
import "./NhapHang.css"

const NhapHang = () => {
  const [activeTab, setActiveTab] = useState("danh-sach")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPallet, setSelectedPallet] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [pallets, setPallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Danh sách trạng thái pallet
  const trangThaiOptions = [
    { value: 'Mới', label: 'Mới (chưa mở)', class: 'badge-success' },
    { value: 'Đã_mở', label: 'Đã mở niêm phong', class: 'badge-warning' },
    { value: 'Trống', label: 'Trống (không còn hàng)', class: 'badge-danger' }
  ]

  // Hàm lấy danh sách pallet từ API
  const fetchPallets = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://127.0.0.1:8000/nhaphang/pallets/latest/")
      if (!response.ok) {
        throw new Error("Không thể lấy danh sách pallet")
      }
      const data = await response.json()
      setPallets(data)
    } catch (error) {
      console.error("Error fetching pallets:", error)
      setError("Không thể lấy danh sách pallet. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  // Gọi API lấy danh sách pallet khi component được mount
  useEffect(() => {
    fetchPallets()
  }, [])

  const handleAddPallet = (newPallet) => {
    setPallets(prevPallets => [newPallet, ...prevPallets])
    setShowAddModal(false)
  }

  const handleViewDetail = (pallet) => {
    setSelectedPallet(pallet)
    setShowDetailModal(true)
  }

  const handlePrintQR = (pallet) => {
    setSelectedPallet(pallet)
    setShowQRModal(true)
  }

  const handleDeletePallet = async (maPallet) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa pallet này?")) {
      return
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/nhaphang/pallets/${maPallet}/`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Không thể xóa pallet")
      }

      // Cập nhật lại danh sách pallet
      setPallets(pallets.filter(p => p.ma_pallet !== maPallet))
      alert("Xóa pallet thành công!")
    } catch (error) {
      console.error("Error deleting pallet:", error)
      alert("Không thể xóa pallet. Vui lòng thử lại sau.")
    }
  }

  const filteredPallets = pallets.filter(
    (pallet) =>
      pallet.ma_pallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pallet.ten_san_pham.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pallet.vi_tri_kho.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (trangThai) => {
    const status = trangThaiOptions.find(opt => opt.value === trangThai)
    return status ? (
      <span className={`badge ${status.class}`}>{status.label}</span>
    ) : (
      <span className="badge badge-secondary">{trangThai}</span>
    )
  }

  return (
    <div className="nhap-hang">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý nhập hàng</h1>
          <p className="page-subtitle">Theo dõi và quản lý pallet hoa quả từ nhà cung cấp</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Tạo Pallet mới
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === "danh-sach" ? "active" : ""}`}
          onClick={() => setActiveTab("danh-sach")}
        >
          <Package size={16} />
          Danh sách Pallet
        </button>
        <button
          className={`tab-btn ${activeTab === "thong-ke" ? "active" : ""}`}
          onClick={() => setActiveTab("thong-ke")}
        >
          <QrCode size={16} />
          Thống kê & QR
        </button>
      </div>

      {/* Search and Filter */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã pallet, sản phẩm, vị trí..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary">
          <Filter size={16} />
          Bộ lọc
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "danh-sach" && (
        <div className="pallet-table card">
          <div className="card-header">
            <h3 className="card-title">Danh sách Pallet ({filteredPallets.length})</h3>
            <p className="card-subtitle">Quản lý thông tin chi tiết các pallet hoa quả</p>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="loading">Đang tải danh sách pallet...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mã Pallet</th>
                      <th>Sản phẩm</th>
                      <th>Số thùng</th>
                      <th>Vị trí</th>
                      <th>Ngày tạo</th>
                      <th>Hạn sử dụng</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPallets.map((pallet) => (
                      <tr key={pallet.ma_pallet}>
                        <td>
                          <span className="pallet-code">{pallet.ma_pallet}</span>
                        </td>
                        <td>
                          <div className="product-info">
                            <span className="product-name">{pallet.ten_san_pham}</span>
                            {pallet.loai_hang && (
                              <span className="product-code">({pallet.loai_hang})</span>
                            )}
                          </div>
                        </td>
                        <td className="quantity-cell">
                          {pallet.so_thung_con_lai}/{pallet.so_thung_ban_dau}
                        </td>
                        <td>
                          <span className="location-badge">{pallet.vi_tri_kho}</span>
                        </td>
                        <td className="date-cell">
                          {new Date(pallet.created_at).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="date-cell">
                          {new Date(pallet.han_su_dung).toLocaleDateString("vi-VN")}
                        </td>
                        <td>{getStatusBadge(pallet.trang_thai)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-action view"
                              onClick={() => handleViewDetail(pallet)}
                              title="Xem chi tiết"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              className="btn-action qr" 
                              onClick={() => handlePrintQR(pallet)} 
                              title="In QR Code"
                            >
                              <QrCode size={14} />
                            </button>
                            <button 
                              className="btn-action edit" 
                              title="Chỉnh sửa"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn-action delete"
                              onClick={() => handleDeletePallet(pallet.ma_pallet)}
                              title="Xóa"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Tạo Pallet mới">
        <ThemPallet
          onSubmit={handleAddPallet}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết Pallet">
        {selectedPallet && <ChiTietPallet pallet={selectedPallet} onClose={() => setShowDetailModal(false)} />}
      </Modal>

      <Modal isOpen={showQRModal} onClose={() => setShowQRModal(false)} title="In QR Code">
        {selectedPallet && <InQRPallet pallet={selectedPallet} onClose={() => setShowQRModal(false)} />}
      </Modal>
    </div>
  )
}

export default NhapHang
