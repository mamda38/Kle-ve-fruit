"use client"

import { useState } from "react"
import { Search, Download, CheckCircle, AlertTriangle, Calendar } from "lucide-react"

const LichSuKiemTra = ({ checkHistory, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  const filteredHistory = checkHistory.filter((record) => {
    const matchesSearch =
      record.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.staff.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "" || record.result === statusFilter

    const matchesDate = dateFilter === "" || record.checkTime.startsWith(dateFilter)

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: { label: "Thành công", class: "badge-success", icon: CheckCircle },
      error: { label: "Lỗi", class: "badge-danger", icon: AlertTriangle },
      warning: { label: "Cảnh báo", class: "badge-warning", icon: AlertTriangle },
    }
    const config = statusConfig[status] || statusConfig.warning
    const IconComponent = config.icon
    return (
      <span className={`badge ${config.class}`}>
        <IconComponent size={12} />
        {config.label}
      </span>
    )
  }

  const exportToCSV = () => {
    const headers = [
      "Mã đơn hàng",
      "Cửa hàng",
      "Khu vực",
      "Thời gian",
      "Vị trí kiểm tra",
      "Kết quả",
      "Nhân viên",
      "Ghi chú",
    ]

    const csvData = filteredHistory.map((record) => [
      record.orderCode,
      record.storeName,
      record.storeArea,
      new Date(record.checkTime).toLocaleString("vi-VN"),
      record.location,
      record.result === "success" ? "Thành công" : record.result === "error" ? "Lỗi" : "Cảnh báo",
      record.staff,
      record.notes,
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `lich_su_kiem_tra_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatistics = () => {
    const total = filteredHistory.length
    const success = filteredHistory.filter((r) => r.result === "success").length
    const error = filteredHistory.filter((r) => r.result === "error").length
    const warning = filteredHistory.filter((r) => r.result === "warning").length

    return { total, success, error, warning }
  }

  const stats = getStatistics()

  return (
    <div className="lich-su-kiem-tra">
      {/* Header */}
      <div className="history-header">
        <div>
          <h3>Lịch sử kiểm tra chi tiết</h3>
          <p>Xem và quản lý tất cả các lần kiểm tra giao hàng</p>
        </div>
        <button className="btn btn-success" onClick={exportToCSV}>
          <Download size={16} />
          Xuất Excel
        </button>
      </div>

      {/* Filters */}
      <div className="history-filters">
        <div className="filter-row">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, cửa hàng, nhân viên..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="form-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ maxWidth: "150px" }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="success">Thành công</option>
            <option value="error">Lỗi</option>
            <option value="warning">Cảnh báo</option>
          </select>
          <input
            type="date"
            className="form-input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ maxWidth: "150px" }}
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="history-stats">
        <div className="stat-item">
          <span className="stat-label">Tổng:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item success">
          <CheckCircle size={16} />
          <span className="stat-label">Thành công:</span>
          <span className="stat-value">{stats.success}</span>
        </div>
        <div className="stat-item error">
          <AlertTriangle size={16} />
          <span className="stat-label">Lỗi:</span>
          <span className="stat-value">{stats.error}</span>
        </div>
        <div className="stat-item warning">
          <AlertTriangle size={16} />
          <span className="stat-label">Cảnh báo:</span>
          <span className="stat-value">{stats.warning}</span>
        </div>
      </div>

      {/* History Table */}
      <div className="history-table">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Mã đơn hàng</th>
                <th>Cửa hàng đích</th>
                <th>Vị trí kiểm tra</th>
                <th>Kết quả</th>
                <th>Nhân viên</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((record) => (
                <tr key={record.id}>
                  <td className="time-cell">
                    <div className="time-info">
                      <span className="date">{new Date(record.checkTime).toLocaleDateString("vi-VN")}</span>
                      <span className="time">{new Date(record.checkTime).toLocaleTimeString("vi-VN")}</span>
                    </div>
                  </td>
                  <td>
                    <span className="order-code">{record.orderCode}</span>
                  </td>
                  <td>
                    <div className="store-info">
                      <span className="store-name">{record.storeName}</span>
                      <span className="store-area">{record.storeArea}</span>
                    </div>
                  </td>
                  <td className="location-cell">{record.location}</td>
                  <td>{getStatusBadge(record.result)}</td>
                  <td className="staff-cell">{record.staff}</td>
                  <td className="notes-cell">{record.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="no-data">
            <Calendar size={48} />
            <p>Không tìm thấy dữ liệu phù hợp với bộ lọc</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="history-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  )
}

export default LichSuKiemTra
