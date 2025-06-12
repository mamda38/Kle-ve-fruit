"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Truck, Package, CheckCircle, Clock, QrCode } from "lucide-react"
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

  // Mock data đơn hàng chờ xuất
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderCode: "DH-2024-001",
      storeId: 1,
      storeName: "Siêu thị BigC Thăng Long",
      storeArea: "Hà Nội",
      orderDate: "2024-01-15",
      expectedDeliveryDate: "2024-01-16",
      status: "pending", // pending, processing, ready, completed, cancelled
      priority: "high", // high, medium, low
      totalItems: 3,
      totalQuantity: 270,
      items: [
        {
          id: 1,
          productCode: "AP001",
          productName: "Táo Fuji",
          quantity: 120,
          unit: "kg",
          allocation: [
            {
              palletCode: "P-2024-001",
              allocatedQuantity: 80,
              location: "A-01-01",
              status: "pending", // pending, picked, verified
            },
            {
              palletCode: "P-2024-002",
              allocatedQuantity: 40,
              location: "A-01-02",
              status: "pending",
            },
          ],
        },
        {
          id: 2,
          productCode: "OR001",
          productName: "Cam Sành",
          quantity: 100,
          unit: "kg",
          allocation: [
            {
              palletCode: "P-2024-003",
              allocatedQuantity: 100,
              location: "B-01-01",
              status: "pending",
            },
          ],
        },
        {
          id: 3,
          productCode: "BN001",
          productName: "Chuối Tiêu",
          quantity: 50,
          unit: "kg",
          allocation: [
            {
              palletCode: "P-2024-004",
              allocatedQuantity: 50,
              location: "C-01-01",
              status: "pending",
            },
          ],
        },
      ],
      notes: "Giao hàng sớm, khách hàng VIP",
      createdDate: "2024-01-15T08:30:00",
      assignedStaff: "Nguyễn Văn A",
    },
    {
      id: 2,
      orderCode: "DH-2024-002",
      storeId: 2,
      storeName: "Cửa hàng Trái cây Sạch ABC",
      storeArea: "TP.HCM",
      orderDate: "2024-01-15",
      expectedDeliveryDate: "2024-01-17",
      status: "processing",
      priority: "medium",
      totalItems: 2,
      totalQuantity: 180,
      items: [
        {
          id: 1,
          productCode: "AP002",
          productName: "Táo Gala",
          quantity: 80,
          unit: "kg",
          allocation: [
            {
              palletCode: "P-2024-005",
              allocatedQuantity: 80,
              location: "A-02-01",
              status: "picked",
            },
          ],
        },
        {
          id: 2,
          productCode: "MG001",
          productName: "Xoài Cát",
          quantity: 100,
          unit: "kg",
          allocation: [
            {
              palletCode: "P-2024-006",
              allocatedQuantity: 100,
              location: "D-01-01",
              status: "verified",
            },
          ],
        },
      ],
      notes: "Kiểm tra chất lượng kỹ",
      createdDate: "2024-01-15T10:15:00",
      assignedStaff: "Trần Thị B",
    },
    {
      id: 3,
      orderCode: "DH-2024-003",
      storeId: 3,
      storeName: "Lotte Mart Đà Nẵng",
      storeArea: "Đà Nẵng",
      orderDate: "2024-01-14",
      expectedDeliveryDate: "2024-01-16",
      status: "ready",
      priority: "high",
      totalItems: 4,
      totalQuantity: 320,
      items: [
        {
          id: 1,
          productCode: "AP001",
          productName: "Táo Fuji",
          quantity: 100,
          unit: "kg",
          allocation: [
            {
              palletCode: "P-2024-007",
              allocatedQuantity: 100,
              location: "A-01-03",
              status: "verified",
            },
          ],
        },
        {
          id: 2,
          productCode: "OR002",
          productName: "Cam Cavendish",
          quantity: 80,
          unit: "kg",
          allocation: [
            {
              palletCode: "P-2024-008",
              allocatedQuantity: 80,
              location: "B-02-01",
              status: "verified",
            },
          ],
        },
        {
          id: 3,
          productCode: "BN002",
          productName: "Chuối Già",
          quantity: 60,
          unit: "kg",
          allocation: [
            {
              palletCode: "P-2024-009",
              allocatedQuantity: 60,
              location: "C-01-02",
              status: "verified",
            },
          ],
        },
        {
          id: 4,
          productCode: "MG002",
          productName: "Xoài Keo",
          quantity: 80,
          unit: "kg",
          allocation: [
            {
              palletCode: "P-2024-010",
              allocatedQuantity: 80,
              location: "D-01-02",
              status: "verified",
            },
          ],
        },
      ],
      notes: "Đơn hàng ưu tiên cao",
      createdDate: "2024-01-14T14:20:00",
      assignedStaff: "Lê Văn C",
    },
  ])

  // Mock inventory data for real-time updates
  const [inventory, setInventory] = useState({
    "P-2024-001": { available: 120, total: 150 },
    "P-2024-002": { available: 150, total: 150 },
    "P-2024-003": { available: 180, total: 200 },
    "P-2024-004": { available: 80, total: 80 },
    "P-2024-005": { available: 80, total: 150 },
    "P-2024-006": { available: 100, total: 120 },
    "P-2024-007": { available: 100, total: 150 },
    "P-2024-008": { available: 80, total: 200 },
    "P-2024-009": { available: 60, total: 80 },
    "P-2024-010": { available: 80, total: 120 },
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
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.storeArea.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "" || order.status === statusFilter
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
        }

        return newInventory
      })
    }, 10000) // Update every 10 seconds

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
    const totalAllocations = order.items.reduce((total, item) => total + item.allocation.length, 0)
    const completedAllocations = order.items.reduce(
      (total, item) => total + item.allocation.filter((a) => a.status === "verified").length,
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
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const updateAllocationStatus = (orderId, itemId, allocationIndex, newStatus) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            items: order.items.map((item) => {
              if (item.id === itemId) {
                return {
                  ...item,
                  allocation: item.allocation.map((alloc, index) =>
                    index === allocationIndex ? { ...alloc, status: newStatus } : alloc,
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
      const item = order?.items.find((i) => i.id === itemId)
      const allocation = item?.allocation[allocationIndex]

      if (allocation) {
        setInventory((prev) => ({
          ...prev,
          [allocation.palletCode]: {
            ...prev[allocation.palletCode],
            available: Math.max(0, prev[allocation.palletCode].available - allocation.allocatedQuantity),
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
            <div className="stat-value">{orders.filter((o) => o.status === "pending").length}</div>
            <div className="stat-label">Đơn chờ xử lý</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} style={{ color: "#17a2b8" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{orders.filter((o) => o.status === "processing").length}</div>
            <div className="stat-label">Đang xử lý</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Truck size={24} style={{ color: "#28a745" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{orders.filter((o) => o.status === "ready").length}</div>
            <div className="stat-label">Sẵn sàng xuất</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={24} style={{ color: "#00FF33" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{orders.filter((o) => o.status === "completed").length}</div>
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
                  <th>Ngày giao</th>
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
                        <span className="order-code">{order.orderCode}</span>
                        <span className="order-date">{new Date(order.orderDate).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </td>
                    <td>
                      <div className="store-info">
                        <span className="store-name">{order.storeName}</span>
                        <span className="store-area">{order.storeArea}</span>
                      </div>
                    </td>
                    <td className="delivery-date">
                      {new Date(order.expectedDeliveryDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td>{getPriorityBadge(order.priority)}</td>
                    <td>
                      <div className="items-summary">
                        <span className="items-count">{order.totalItems} loại</span>
                        <span className="total-quantity">{order.totalQuantity} kg</span>
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
                    <td>{getStatusBadge(order.status)}</td>
                    <td className="staff-cell">{order.assignedStaff}</td>
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
                          disabled={order.status === "completed"}
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
