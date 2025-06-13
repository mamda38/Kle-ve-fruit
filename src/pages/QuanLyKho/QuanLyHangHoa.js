"use client"

import { useState } from "react"
import { Search, Package, Calendar, MapPin, AlertTriangle, CheckCircle, Clock, Eye, Edit, Trash2 } from "lucide-react"

const QuanLyHangHoa = () => {
  const [pallets, setPallets] = useState([
    {
      id: "PLT001",
      product: "Coca Cola 24 lon",
      quantity: 50,
      unit: "thùng",
      location: "A-15",
      entryDate: "2024-01-15",
      expiryDate: "2024-06-15",
      status: "good",
      supplier: "Coca Cola VN",
      batchCode: "CC240115",
      temperature: "25°C",
      humidity: "60%",
    },
    {
      id: "PLT002",
      product: "Pepsi 12 lon",
      quantity: 30,
      unit: "thùng",
      location: "B-08",
      entryDate: "2024-01-10",
      expiryDate: "2024-01-25",
      status: "expiring",
      supplier: "Pepsi VN",
      batchCode: "PP240110",
      temperature: "24°C",
      humidity: "58%",
    },
    {
      id: "PLT003",
      product: "Nước suối Lavie 500ml",
      quantity: 100,
      unit: "thùng",
      location: "C-12",
      entryDate: "2024-01-20",
      expiryDate: "2025-01-20",
      status: "good",
      supplier: "Lavie VN",
      batchCode: "LV240120",
      temperature: "23°C",
      humidity: "55%",
    },
    {
      id: "PLT004",
      product: "Bia Heineken 24 lon",
      quantity: 25,
      unit: "thùng",
      location: "A-03",
      entryDate: "2024-01-05",
      expiryDate: "2024-01-20",
      status: "expired",
      supplier: "Heineken VN",
      batchCode: "HK240105",
      temperature: "26°C",
      humidity: "62%",
    },
    {
      id: "PLT005",
      product: "Red Bull 250ml",
      quantity: 75,
      unit: "thùng",
      location: "B-15",
      entryDate: "2024-01-18",
      expiryDate: "2024-07-18",
      status: "good",
      supplier: "Red Bull VN",
      batchCode: "RB240118",
      temperature: "25°C",
      humidity: "59%",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterLocation, setFilterLocation] = useState("all")
  const [sortBy, setSortBy] = useState("entryDate")
  const [sortOrder, setSortOrder] = useState("desc")

  const getStatusColor = (status) => {
    switch (status) {
      case "good":
        return "#10b981"
      case "expiring":
        return "#f59e0b"
      case "expired":
        return "#ef4444"
      case "damaged":
        return "#8b5cf6"
      default:
        return "#6b7280"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "good":
        return "Tốt"
      case "expiring":
        return "Sắp hết hạn"
      case "expired":
        return "Hết hạn"
      case "damaged":
        return "Hư hỏng"
      default:
        return "Không xác định"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "good":
        return CheckCircle
      case "expiring":
        return Clock
      case "expired":
        return AlertTriangle
      case "damaged":
        return AlertTriangle
      default:
        return Package
    }
  }

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredPallets = pallets
    .filter((pallet) => {
      const matchesSearch =
        pallet.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pallet.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pallet.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || pallet.status === filterStatus
      const matchesLocation = filterLocation === "all" || pallet.location.startsWith(filterLocation)
      return matchesSearch && matchesStatus && matchesLocation
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "entryDate" || sortBy === "expiryDate") {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const locations = [...new Set(pallets.map((p) => p.location.charAt(0)))].sort()

  return (
    <div className="quan-ly-hang-hoa">
      <div className="page-header">
        <div className="header-stats">
          <div className="stat-item">
            <Package size={20} />
            <div>
              <span className="stat-value">{pallets.length}</span>
              <span className="stat-label">Tổng pallet</span>
            </div>
          </div>
          <div className="stat-item good">
            <CheckCircle size={20} />
            <div>
              <span className="stat-value">{pallets.filter((p) => p.status === "good").length}</span>
              <span className="stat-label">Tốt</span>
            </div>
          </div>
          <div className="stat-item warning">
            <Clock size={20} />
            <div>
              <span className="stat-value">{pallets.filter((p) => p.status === "expiring").length}</span>
              <span className="stat-label">Sắp hết hạn</span>
            </div>
          </div>
          <div className="stat-item danger">
            <AlertTriangle size={20} />
            <div>
              <span className="stat-value">{pallets.filter((p) => p.status === "expired").length}</span>
              <span className="stat-label">Hết hạn</span>
            </div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-filter">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, mã pallet, nhà cung cấp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="good">Tốt</option>
            <option value="expiring">Sắp hết hạn</option>
            <option value="expired">Hết hạn</option>
            <option value="damaged">Hư hỏng</option>
          </select>
          <select className="filter-select" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
            <option value="all">Tất cả khu vực</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                Khu vực {location}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-controls">
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="entryDate">Ngày nhập</option>
            <option value="expiryDate">Ngày hết hạn</option>
            <option value="product">Sản phẩm</option>
            <option value="quantity">Số lượng</option>
          </select>
          <button className="sort-order-btn" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      <div className="pallets-grid">
        {filteredPallets.map((pallet) => {
          const StatusIcon = getStatusIcon(pallet.status)
          const daysUntilExpiry = getDaysUntilExpiry(pallet.expiryDate)

          return (
            <div key={pallet.id} className="pallet-card">
              <div className="pallet-header">
                <div className="pallet-id">
                  <Package size={16} />
                  <span>{pallet.id}</span>
                </div>
                <div className="pallet-status" style={{ color: getStatusColor(pallet.status) }}>
                  <StatusIcon size={16} />
                  <span>{getStatusText(pallet.status)}</span>
                </div>
              </div>

              <div className="pallet-content">
                <h3 className="pallet-product">{pallet.product}</h3>
                <div className="pallet-details">
                  <div className="detail-item">
                    <span className="detail-label">Số lượng:</span>
                    <span className="detail-value">
                      {pallet.quantity} {pallet.unit}
                    </span>
                  </div>
                  <div className="detail-item">
                    <MapPin size={14} />
                    <span className="detail-value">{pallet.location}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={14} />
                    <span className="detail-value">Nhập: {new Date(pallet.entryDate).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={14} />
                    <span className="detail-value">
                      HSD: {new Date(pallet.expiryDate).toLocaleDateString("vi-VN")}
                      {daysUntilExpiry > 0 && <span className="days-remaining">({daysUntilExpiry} ngày)</span>}
                      {daysUntilExpiry <= 0 && (
                        <span className="expired-text">(Đã hết hạn {Math.abs(daysUntilExpiry)} ngày)</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="pallet-conditions">
                  <div className="condition-item">
                    <span>🌡️ {pallet.temperature}</span>
                  </div>
                  <div className="condition-item">
                    <span>💧 {pallet.humidity}</span>
                  </div>
                </div>

                <div className="pallet-supplier">
                  <span className="supplier-label">NCC:</span>
                  <span className="supplier-name">{pallet.supplier}</span>
                </div>
              </div>

              <div className="pallet-actions">
                <button className="action-btn view">
                  <Eye size={16} />
                  <span>Xem</span>
                </button>
                <button className="action-btn edit">
                  <Edit size={16} />
                  <span>Sửa</span>
                </button>
                <button className="action-btn delete">
                  <Trash2 size={16} />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredPallets.length === 0 && (
        <div className="empty-state">
          <Package size={48} />
          <h3>Không tìm thấy pallet nào</h3>
          <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  )
}

export default QuanLyHangHoa
