"use client"

import { useState } from "react"
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

  // Mock data cho pallets
  const [pallets, setPallets] = useState([
    {
      id: 1,
      palletCode: "P-2024-001",
      productCode: "AP001",
      productName: "Táo Fuji",
      quantity: 150,
      unit: "kg",
      importDate: "2024-01-15T08:30:00",
      productionDate: "2024-01-10",
      expiryDate: "2024-02-10",
      qualityCheckDate: "2024-01-15",
      location: "A-01-01",
      supplier: "Nông trại Xanh",
      status: "active",
      qualityStatus: "passed",
      notes: "Chất lượng tốt, không có khuyết tật",
    },
    {
      id: 2,
      palletCode: "P-2024-002",
      productCode: "OR002",
      productName: "Cam Sành",
      quantity: 200,
      unit: "kg",
      importDate: "2024-01-15T09:15:00",
      productionDate: "2024-01-12",
      expiryDate: "2024-02-12",
      qualityCheckDate: "2024-01-15",
      location: "A-01-02",
      supplier: "Vườn Trái Cây Sạch",
      status: "active",
      qualityStatus: "passed",
      notes: "Cam tươi, màu sắc đẹp",
    },
    {
      id: 3,
      palletCode: "P-2024-003",
      productCode: "BN003",
      productName: "Chuối Tiêu",
      quantity: 80,
      unit: "kg",
      importDate: "2024-01-14T10:00:00",
      productionDate: "2024-01-08",
      expiryDate: "2024-01-22",
      qualityCheckDate: "2024-01-14",
      location: "B-02-01",
      supplier: "Hợp tác xã Nông dân",
      status: "warning",
      qualityStatus: "warning",
      notes: "Sắp hết hạn, cần xuất sớm",
    },
  ])

  // Tạo mã pallet tự động
  const generatePalletCode = () => {
    const year = new Date().getFullYear()
    const existingCodes = pallets
      .filter((p) => p.palletCode.startsWith(`P-${year}-`))
      .map((p) => Number.parseInt(p.palletCode.split("-")[2]))

    const nextNumber = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1
    return `P-${year}-${nextNumber.toString().padStart(3, "0")}`
  }

  const handleAddPallet = (palletData) => {
    const newPallet = {
      id: Date.now(),
      palletCode: generatePalletCode(),
      ...palletData,
      status: "active",
      qualityStatus: "passed",
    }
    setPallets([...pallets, newPallet])
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

  const handleDeletePallet = (palletId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa pallet này?")) {
      setPallets(pallets.filter((p) => p.id !== palletId))
    }
  }

  const filteredPallets = pallets.filter(
    (pallet) =>
      pallet.palletCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pallet.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pallet.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "Hoạt động", class: "badge-success" },
      warning: { label: "Cảnh báo", class: "badge-warning" },
      expired: { label: "Hết hạn", class: "badge-danger" },
      inactive: { label: "Không hoạt động", class: "badge-secondary" },
    }
    const config = statusConfig[status] || statusConfig.active
    return <span className={`badge ${config.class}`}>{config.label}</span>
  }

  const getQualityBadge = (qualityStatus) => {
    const qualityConfig = {
      passed: { label: "Đạt", class: "badge-success" },
      warning: { label: "Cảnh báo", class: "badge-warning" },
      failed: { label: "Không đạt", class: "badge-danger" },
    }
    const config = qualityConfig[qualityStatus] || qualityConfig.passed
    return <span className={`badge ${config.class}`}>{config.label}</span>
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
            placeholder="Tìm kiếm theo mã pallet, sản phẩm, nhà cung cấp..."
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
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã Pallet</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Vị trí</th>
                    <th>Ngày nhập</th>
                    <th>Hạn sử dụng</th>
                    <th>Trạng thái</th>
                    <th>Chất lượng</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPallets.map((pallet) => (
                    <tr key={pallet.id}>
                      <td>
                        <span className="pallet-code">{pallet.palletCode}</span>
                      </td>
                      <td>
                        <div className="product-info">
                          <span className="product-name">{pallet.productName}</span>
                          <span className="product-code">({pallet.productCode})</span>
                        </div>
                      </td>
                      <td className="quantity-cell">
                        {pallet.quantity} {pallet.unit}
                      </td>
                      <td>
                        <span className="location-badge">{pallet.location}</span>
                      </td>
                      <td className="date-cell">{new Date(pallet.importDate).toLocaleDateString("vi-VN")}</td>
                      <td className="date-cell">{new Date(pallet.expiryDate).toLocaleDateString("vi-VN")}</td>
                      <td>{getStatusBadge(pallet.status)}</td>
                      <td>{getQualityBadge(pallet.qualityStatus)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-action view"
                            onClick={() => handleViewDetail(pallet)}
                            title="Xem chi tiết"
                          >
                            <Eye size={14} />
                          </button>
                          <button className="btn-action qr" onClick={() => handlePrintQR(pallet)} title="In QR Code">
                            <QrCode size={14} />
                          </button>
                          <button className="btn-action edit" title="Chỉnh sửa">
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn-action delete"
                            onClick={() => handleDeletePallet(pallet.id)}
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
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Tạo Pallet mới">
        <ThemPallet
          onSubmit={handleAddPallet}
          onCancel={() => setShowAddModal(false)}
          nextPalletCode={generatePalletCode()}
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
