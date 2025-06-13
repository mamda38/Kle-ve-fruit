"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Truck, Package, CheckCircle, Clock, QrCode, AlertTriangle } from "lucide-react"
import Modal from "../../components/common/Modal"
import ChiTietDonXuat from "./ChiTietDonXuat"
import ChecklistPallet from "./ChecklistPallet"
import InQRDonHang from "./InQRDonHang"
import "./XuatHang.css"

const XuatHang = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showChecklistModal, setShowChecklistModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)

  // Mock data đơn hàng chờ xuất
  const [orders, setOrders] = useState([
    {
      id: 1,
      don_hang_id: "XK-001",
      cua_hang: "Siêu thị BigC Thăng Long",
      cua_hang_id: "CH001",
      khu_vuc: "Hà Nội",
      ngay_dat: "2025-06-08",
      ngay_xuat: "2025-06-09",
      trang_thai: "pending", // pending, processing, ready, completed, cancelled
      uu_tien: "high", // high, medium, low
      tong_san_pham: 3,
      tong_so_luong: 270,
      danh_sach_hang: [
        {
          id: 1,
          ma_san_pham: "SP001",
          ten_san_pham: "Bia Heineken",
          so_luong: 120,
          don_vi: "thùng",
          phan_bo: [
            {
              ma_pallet: "PL-001",
              so_luong_phan_bo: 80,
              vi_tri: "A-01-01",
              trang_thai: "pending", // pending, picked, verified
            },
            {
              ma_pallet: "PL-002",
              so_luong_phan_bo: 40,
              vi_tri: "A-01-02",
              trang_thai: "pending",
            },
          ],
        },
        {
          id: 2,
          ma_san_pham: "SP002",
          ten_san_pham: "Nước ngọt Coca Cola",
          so_luong: 100,
          don_vi: "thùng",
          phan_bo: [
            {
              ma_pallet: "PL-003",
              so_luong_phan_bo: 100,
              vi_tri: "B-01-01",
              trang_thai: "pending",
            },
          ],
        },
        {
          id: 3,
          ma_san_pham: "SP003",
          ten_san_pham: "Nước suối Lavie",
          so_luong: 50,
          don_vi: "thùng",
          phan_bo: [
            {
              ma_pallet: "PL-004",
              so_luong_phan_bo: 50,
              vi_tri: "C-01-01",
              trang_thai: "pending",
            },
          ],
        },
      ],
      ghi_chu: "Giao hàng sớm, khách hàng VIP",
      ngay_tao: "2025-06-08T08:30:00",
      nhan_vien: "Nguyễn Văn A",
      ma_xac_thuc: "AUTH-XK001-CH001",
      tong_thung: 270,
    },
    {
      id: 2,
      don_hang_id: "XK-002",
      cua_hang: "Cửa hàng tiện lợi Circle K",
      cua_hang_id: "CH002",
      khu_vuc: "TP.HCM",
      ngay_dat: "2025-06-08",
      ngay_xuat: "2025-06-10",
      trang_thai: "processing",
      uu_tien: "medium",
      tong_san_pham: 2,
      tong_so_luong: 180,
      danh_sach_hang: [
        {
          id: 1,
          ma_san_pham: "SP004",
          ten_san_pham: "Bia Tiger",
          so_luong: 80,
          don_vi: "thùng",
          phan_bo: [
            {
              ma_pallet: "PL-005",
              so_luong_phan_bo: 80,
              vi_tri: "A-02-01",
              trang_thai: "picked",
            },
          ],
        },
        {
          id: 2,
          ma_san_pham: "SP005",
          ten_san_pham: "Nước ngọt Pepsi",
          so_luong: 100,
          don_vi: "thùng",
          phan_bo: [
            {
              ma_pallet: "PL-006",
              so_luong_phan_bo: 100,
              vi_tri: "D-01-01",
              trang_thai: "verified",
            },
          ],
        },
      ],
      ghi_chu: "Kiểm tra chất lượng kỹ",
      ngay_tao: "2025-06-08T10:15:00",
      nhan_vien: "Trần Thị B",
      ma_xac_thuc: "AUTH-XK002-CH002",
      tong_thung: 180,
    },
    {
      id: 3,
      don_hang_id: "XK-003",
      cua_hang: "Lotte Mart Đà Nẵng",
      cua_hang_id: "CH003",
      khu_vuc: "Đà Nẵng",
      ngay_dat: "2025-06-07",
      ngay_xuat: "2025-06-09",
      trang_thai: "ready",
      uu_tien: "high",
      tong_san_pham: 4,
      tong_so_luong: 320,
      danh_sach_hang: [
        {
          id: 1,
          ma_san_pham: "SP001",
          ten_san_pham: "Bia Heineken",
          so_luong: 100,
          don_vi: "thùng",
          phan_bo: [
            {
              ma_pallet: "PL-007",
              so_luong_phan_bo: 100,
              vi_tri: "A-01-03",
              trang_thai: "verified",
            },
          ],
        },
        {
          id: 2,
          ma_san_pham: "SP006",
          ten_san_pham: "Nước ngọt Sprite",
          so_luong: 80,
          don_vi: "thùng",
          phan_bo: [
            {
              ma_pallet: "PL-008",
              so_luong_phan_bo: 80,
              vi_tri: "B-02-01",
              trang_thai: "verified",
            },
          ],
        },
        {
          id: 3,
          ma_san_pham: "SP007",
          ten_san_pham: "Nước suối Aquafina",
          so_luong: 60,
          don_vi: "thùng",
          phan_bo: [
            {
              ma_pallet: "PL-009",
              so_luong_phan_bo: 60,
              vi_tri: "C-01-02",
              trang_thai: "verified",
            },
          ],
        },
        {
          id: 4,
          ma_san_pham: "SP008",
          ten_san_pham: "Nước tăng lực Redbull",
          so_luong: 80,
          don_vi: "thùng",
          phan_bo: [
            {
              ma_pallet: "PL-010",
              so_luong_phan_bo: 80,
              vi_tri: "D-01-02",
              trang_thai: "verified",
            },
          ],
        },
      ],
      ghi_chu: "Đơn hàng ưu tiên cao",
      ngay_tao: "2025-06-07T14:20:00",
      nhan_vien: "Lê Văn C",
      ma_xac_thuc: "AUTH-XK003-CH003",
      tong_thung: 320,
    },
  ])

  // Mock inventory data for real-time updates
  const [inventory, setInventory] = useState({
    "PL-001": { available: 120, total: 150 },
    "PL-002": { available: 150, total: 150 },
    "PL-003": { available: 180, total: 200 },
    "PL-004": { available: 80, total: 80 },
    "PL-005": { available: 80, total: 150 },
    "PL-006": { available: 100, total: 120 },
    "PL-007": { available: 100, total: 150 },
    "PL-008": { available: 80, total: 200 },
    "PL-009": { available: 60, total: 80 },
    "PL-010": { available: 80, total: 120 },
  })

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "pending", label: "Chờ xử lý" },
    { value: "processing", label: "Đang xử lý" },
    { value: "ready", label: "Sẵn sàng xuất" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
  ]

  const priorityOptions = [
    { value: "high", label: "Cao", color: "#dc3545" },
    { value: "medium", label: "Trung bình", color: "#ffc107" },
    { value: "low", label: "Thấp", color: "#28a745" },
  ]

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.don_hang_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cua_hang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.khu_vuc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "" || order.trang_thai === statusFilter
    return matchesSearch && matchesStatus
  })

  // Real-time inventory update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random inventory changes
      setInventory((prev) => {
        const newInventory = { ...prev }
        const palletCodes = Object.keys(newInventory)
        const randomPallet = palletCodes[Math.floor(Math.random() * palletCodes.length)]

        if (newInventory[randomPallet] && newInventory[randomPallet].available > 0) {
          // Randomly decrease available quantity (simulate picking)
          const decrease = Math.floor(Math.random() * 5) + 1
          newInventory[randomPallet] = {
            ...newInventory[randomPallet],
            available: Math.max(0, newInventory[randomPallet].available - decrease),
          }

          // Show alert for low inventory
          if (newInventory[randomPallet].available <= 20) {
            setAlertMessage(
              `Cảnh báo: Pallet ${randomPallet} còn ít hàng (${newInventory[randomPallet].available} thùng)`,
            )
            setTimeout(() => setAlertMessage(null), 5000)
          }
        }

        return newInventory
      })
    }, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Chờ xử lý", class: "badge-warning" },
      processing: { label: "Đang xử lý", class: "badge-info" },
      ready: { label: "Sẵn sàng xuất", class: "badge-success" },
      completed: { label: "Hoàn thành", class: "badge-secondary" },
      cancelled: { label: "Đã hủy", class: "badge-danger" },
    }
    const config = statusConfig[status] || statusConfig.pending
    return <span className={`badge ${config.class}`}>{config.label}</span>
  }

  const getPriorityBadge = (priority) => {
    const config = priorityOptions.find((p) => p.value === priority)
    return (
      <span className="priority-badge" style={{ backgroundColor: config?.color + "20", color: config?.color }}>
        {config?.label}
      </span>
    )
  }

  const getOrderProgress = (order) => {
    const totalAllocations = order.danh_sach_hang.reduce((total, item) => total + item.phan_bo.length, 0)
    const completedAllocations = order.danh_sach_hang.reduce(
      (total, item) => total + item.phan_bo.filter((a) => a.trang_thai === "verified").length,
      0,
    )
    return Math.round((completedAllocations / totalAllocations) * 100)
  }

  const handleViewDetail = (order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const handleStartChecklist = (order) => {
    setSelectedOrder(order)
    setShowChecklistModal(true)
  }

  const handlePrintQR = (order) => {
    setSelectedOrder(order)
    setShowQRModal(true)
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, trang_thai: newStatus } : order)))
  }

  const updateAllocationStatus = (orderId, itemId, allocationIndex, newStatus) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            danh_sach_hang: order.danh_sach_hang.map((item) => {
              if (item.id === itemId) {
                return {
                  ...item,
                  phan_bo: item.phan_bo.map((alloc, index) =>
                    index === allocationIndex ? { ...alloc, trang_thai: newStatus } : alloc,
                  ),
                }
              }
              return item
            }),
          }
        }
        return order
      }),
    )

    // Update inventory when allocation is verified
    if (newStatus === "verified") {
      const order = orders.find((o) => o.id === orderId)
      const item = order?.danh_sach_hang.find((i) => i.id === itemId)
      const allocation = item?.phan_bo[allocationIndex]

      if (allocation) {
        setInventory((prev) => ({
          ...prev,
          [allocation.ma_pallet]: {
            ...prev[allocation.ma_pallet],
            available: Math.max(0, prev[allocation.ma_pallet].available - allocation.so_luong_phan_bo),
          },
        }))
      }
    }
  }

  const getInventoryStatus = (palletCode) => {
    const inv = inventory[palletCode]
    if (!inv) return { status: "unknown", percentage: 0 }

    const percentage = (inv.available / inv.total) * 100
    let status = "good"
    if (percentage <= 20) status = "critical"
    else if (percentage <= 50) status = "warning"

    return { status, percentage: Math.round(percentage) }
  }

  return (
    <div className="xuat-hang">
      <div className="page-header">
        <div>
          <h1 className="page-title">Xuất hàng</h1>
          <p className="page-subtitle">Quản lý và xử lý các đơn hàng chờ xuất</p>
        </div>
      </div>

      {/* Alert Message */}
      {alertMessage && (
        <div className="alert-message">
          <AlertTriangle size={16} />
          <span>{alertMessage}</span>
          <button className="close-alert" onClick={() => setAlertMessage(null)}>
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, cửa hàng, khu vực..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ maxWidth: "200px" }}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button className="btn btn-secondary">
          <Filter size={16} />
          Bộ lọc nâng cao
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} style={{ color: "#ffc107" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{orders.filter((o) => o.trang_thai === "pending").length}</div>
            <div className="stat-label">Đơn chờ xử lý</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} style={{ color: "#17a2b8" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{orders.filter((o) => o.trang_thai === "processing").length}</div>
            <div className="stat-label">Đang xử lý</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Truck size={24} style={{ color: "#28a745" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{orders.filter((o) => o.trang_thai === "ready").length}</div>
            <div className="stat-label">Sẵn sàng xuất</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={24} style={{ color: "#00FF33" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{orders.filter((o) => o.trang_thai === "completed").length}</div>
            <div className="stat-label">Hoàn thành hôm nay</div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table card">
        <div className="card-header">
          <h3 className="card-title">Danh sách đơn hàng ({filteredOrders.length})</h3>
          <p className="card-subtitle">Quản lý và theo dõi tiến độ xuất hàng</p>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Cửa hàng</th>
                  <th>Ngày xuất</th>
                  <th>Ưu tiên</th>
                  <th>Sản phẩm</th>
                  <th>Tiến độ</th>
                  <th>Trạng thái</th>
                  <th>Nhân viên</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="order-info">
                        <span className="order-code">{order.don_hang_id}</span>
                        <span className="order-date">{new Date(order.ngay_dat).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </td>
                    <td>
                      <div className="store-info">
                        <span className="store-name">{order.cua_hang}</span>
                        <span className="store-area">{order.khu_vuc}</span>
                      </div>
                    </td>
                    <td className="delivery-date">{new Date(order.ngay_xuat).toLocaleDateString("vi-VN")}</td>
                    <td>{getPriorityBadge(order.uu_tien)}</td>
                    <td>
                      <div className="items-summary">
                        <span className="items-count">{order.tong_san_pham} loại</span>
                        <span className="total-quantity">{order.tong_so_luong} thùng</span>
                      </div>
                    </td>
                    <td>
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${getOrderProgress(order)}%` }}></div>
                        </div>
                        <span className="progress-text">{getOrderProgress(order)}%</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(order.trang_thai)}</td>
                    <td className="staff-cell">{order.nhan_vien}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action view"
                          onClick={() => handleViewDetail(order)}
                          title="Xem chi tiết"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn-action checklist"
                          onClick={() => handleStartChecklist(order)}
                          title="Checklist"
                          disabled={order.trang_thai === "completed"}
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button className="btn-action qr" onClick={() => handlePrintQR(order)} title="In QR Code">
                          <QrCode size={14} />
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
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết đơn hàng">
        {selectedOrder && (
          <ChiTietDonXuat
            order={selectedOrder}
            inventory={inventory}
            getInventoryStatus={getInventoryStatus}
            onClose={() => setShowDetailModal(false)}
          />
        )}
      </Modal>

      <Modal isOpen={showChecklistModal} onClose={() => setShowChecklistModal(false)} title="Checklist xuất hàng">
        {selectedOrder && (
          <ChecklistPallet
            order={selectedOrder}
            inventory={inventory}
            getInventoryStatus={getInventoryStatus}
            onUpdateAllocation={updateAllocationStatus}
            onUpdateOrderStatus={updateOrderStatus}
            onClose={() => setShowChecklistModal(false)}
          />
        )}
      </Modal>

      <Modal isOpen={showQRModal} onClose={() => setShowQRModal(false)} title="QR Code đơn hàng">
        {selectedOrder && <InQRDonHang order={selectedOrder} onClose={() => setShowQRModal(false)} />}
      </Modal>
    </div>
  )
}

export default XuatHang
