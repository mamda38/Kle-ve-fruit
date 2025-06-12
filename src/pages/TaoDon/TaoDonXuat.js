"use client"

import { useState } from "react"
import { Plus, Save, Trash2, Calculator, Package } from "lucide-react"
import Modal from "../../components/common/Modal"

const TaoDonXuat = () => {
  const [orderItems, setOrderItems] = useState([])
  const [selectedStore, setSelectedStore] = useState("")
  const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState("")
  const [showAllocationModal, setShowAllocationModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [allocationResult, setAllocationResult] = useState([])

  // Mock data
  const stores = [
    { id: 1, name: "Siêu thị BigC Thăng Long", area: "Hà Nội" },
    { id: 2, name: "Cửa hàng Trái cây Sạch ABC", area: "TP.HCM" },
    { id: 3, name: "Lotte Mart Đà Nẵng", area: "Đà Nẵng" },
  ]

  const products = [
    { id: 1, code: "AP001", name: "Táo Fuji", unit: "kg" },
    { id: 2, code: "OR001", name: "Cam Sành", unit: "kg" },
    { id: 3, code: "BN001", name: "Chuối Tiêu", unit: "kg" },
    { id: 4, code: "MG001", name: "Xoài Cát", unit: "kg" },
  ]

  // Mock pallet data với thông tin chi tiết
  const pallets = [
    {
      id: 1,
      palletCode: "P-2024-001",
      productCode: "AP001",
      productName: "Táo Fuji",
      totalQuantity: 150,
      availableQuantity: 120, // Đã xuất 30kg
      isOpened: true,
      importDate: "2024-01-10",
      productionDate: "2024-01-08",
      expiryDate: "2024-02-08",
      qualityCheckDate: "2024-01-15",
      location: "A-01-01",
      daysUntilExpiry: 15,
      priority: 1, // Cao nhất vì đã mở và gần hết hạn
    },
    {
      id: 2,
      palletCode: "P-2024-002",
      productCode: "AP001",
      productName: "Táo Fuji",
      totalQuantity: 150,
      availableQuantity: 150, // Chưa xuất
      isOpened: false,
      importDate: "2024-01-12",
      productionDate: "2024-01-10",
      expiryDate: "2024-02-10",
      qualityCheckDate: "2024-01-15",
      location: "A-01-02",
      daysUntilExpiry: 17,
      priority: 2,
    },
    {
      id: 3,
      palletCode: "P-2024-003",
      productCode: "OR001",
      productName: "Cam Sành",
      totalQuantity: 200,
      availableQuantity: 180,
      isOpened: true,
      importDate: "2024-01-08",
      productionDate: "2024-01-05",
      expiryDate: "2024-02-05",
      qualityCheckDate: "2024-01-12",
      location: "B-01-01",
      daysUntilExpiry: 12,
      priority: 1,
    },
  ]

  // Thuật toán phân bổ pallet
  const allocatePallets = (productCode, requestedQuantity) => {
    // 1. Tìm pallet cùng sản phẩm
    const availablePallets = pallets
      .filter((p) => p.productCode === productCode && p.availableQuantity > 0)
      .map((p) => ({
        ...p,
        // Tính toán priority score
        priorityScore: calculatePriorityScore(p),
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore) // Sắp xếp theo priority cao nhất

    const allocation = []
    let remainingQuantity = requestedQuantity

    for (const pallet of availablePallets) {
      if (remainingQuantity <= 0) break

      const allocatedQuantity = Math.min(remainingQuantity, pallet.availableQuantity)
      allocation.push({
        ...pallet,
        allocatedQuantity,
        remainingAfterAllocation: pallet.availableQuantity - allocatedQuantity,
      })

      remainingQuantity -= allocatedQuantity
    }

    return {
      allocation,
      totalAllocated: requestedQuantity - remainingQuantity,
      shortfall: remainingQuantity,
      isFullyAllocated: remainingQuantity === 0,
    }
  }

  // Tính toán điểm ưu tiên
  const calculatePriorityScore = (pallet) => {
    let score = 0

    // 1. Pallet đã mở (ưu tiên cao nhất)
    if (pallet.isOpened) score += 1000

    // 2. Gần hết hạn sử dụng (càng gần càng cao điểm)
    const daysWeight = Math.max(0, 30 - pallet.daysUntilExpiry) * 10
    score += daysWeight

    // 3. FIFO - nhập trước xuất trước
    const importDate = new Date(pallet.importDate)
    const daysSinceImport = (new Date() - importDate) / (1000 * 60 * 60 * 24)
    score += daysSinceImport

    // 4. Ít hàng còn lại (để làm hết pallet)
    const utilizationBonus = (1 - pallet.availableQuantity / pallet.totalQuantity) * 100
    score += utilizationBonus

    return score
  }

  const addOrderItem = () => {
    const newItem = {
      id: Date.now(),
      productCode: "",
      productName: "",
      quantity: "",
      unit: "",
      notes: "",
      allocation: null,
    }
    setOrderItems([...orderItems, newItem])
  }

  const updateOrderItem = (id, field, value) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Auto-fill product info when product is selected
          if (field === "productCode") {
            const product = products.find((p) => p.code === value)
            if (product) {
              updatedItem.productName = product.name
              updatedItem.unit = product.unit
            }
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  const removeOrderItem = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  const handleAutoAllocate = (item) => {
    if (!item.productCode || !item.quantity) {
      alert("Vui lòng chọn sản phẩm và nhập số lượng")
      return
    }

    const result = allocatePallets(item.productCode, Number.parseInt(item.quantity))
    setSelectedItem(item)
    setAllocationResult(result)
    setShowAllocationModal(true)
  }

  const confirmAllocation = () => {
    if (selectedItem && allocationResult) {
      updateOrderItem(selectedItem.id, "allocation", allocationResult)
      setShowAllocationModal(false)
      setSelectedItem(null)
      setAllocationResult([])
    }
  }

  const calculateTotalQuantity = () => {
    return orderItems.reduce((total, item) => total + (Number.parseInt(item.quantity) || 0), 0)
  }

  const saveOrder = () => {
    if (!selectedStore) {
      alert("Vui lòng chọn cửa hàng")
      return
    }

    if (orderItems.length === 0) {
      alert("Vui lòng thêm ít nhất một sản phẩm")
      return
    }

    // Validate all items have allocation
    const unallocatedItems = orderItems.filter((item) => !item.allocation)
    if (unallocatedItems.length > 0) {
      alert("Vui lòng phân bổ pallet cho tất cả sản phẩm")
      return
    }

    const order = {
      id: Date.now(),
      storeId: selectedStore,
      storeName: stores.find((s) => s.id === Number.parseInt(selectedStore))?.name,
      orderDate,
      items: orderItems,
      totalQuantity: calculateTotalQuantity(),
      notes,
      status: "pending",
      createdDate: new Date().toISOString(),
    }

    console.log("Đơn hàng đã tạo:", order)
    alert("Tạo đơn xuất thành công!")

    // Reset form
    setOrderItems([])
    setSelectedStore("")
    setNotes("")
  }

  const AllocationModal = () => (
    <div className="allocation-modal">
      <div className="allocation-header">
        <h4>Phân bổ pallet cho {selectedItem?.productName}</h4>
        <p>
          Số lượng yêu cầu: {selectedItem?.quantity} {selectedItem?.unit}
        </p>
      </div>

      <div className="allocation-summary">
        <div className="summary-item">
          <span className="label">Tổng phân bổ:</span>
          <span className="value success">
            {allocationResult.totalAllocated} {selectedItem?.unit}
          </span>
        </div>
        {allocationResult.shortfall > 0 && (
          <div className="summary-item">
            <span className="label">Thiếu hụt:</span>
            <span className="value danger">
              {allocationResult.shortfall} {selectedItem?.unit}
            </span>
          </div>
        )}
        <div className="summary-item">
          <span className="label">Trạng thái:</span>
          <span className={`value ${allocationResult.isFullyAllocated ? "success" : "warning"}`}>
            {allocationResult.isFullyAllocated ? "Đủ hàng" : "Thiếu hàng"}
          </span>
        </div>
      </div>

      <div className="allocation-table">
        <table className="table">
          <thead>
            <tr>
              <th>Mã Pallet</th>
              <th>Vị trí</th>
              <th>Tồn kho</th>
              <th>Phân bổ</th>
              <th>Còn lại</th>
              <th>Hết hạn</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {allocationResult.allocation?.map((pallet) => (
              <tr key={pallet.id}>
                <td>
                  <span className="pallet-code">{pallet.palletCode}</span>
                </td>
                <td>{pallet.location}</td>
                <td>
                  {pallet.availableQuantity} {selectedItem?.unit}
                </td>
                <td className="allocated-quantity">
                  {pallet.allocatedQuantity} {selectedItem?.unit}
                </td>
                <td>
                  {pallet.remainingAfterAllocation} {selectedItem?.unit}
                </td>
                <td className={`expiry-cell ${pallet.daysUntilExpiry <= 7 ? "warning" : ""}`}>
                  {pallet.daysUntilExpiry} ngày
                </td>
                <td>
                  <div className="status-badges">
                    {pallet.isOpened && <span className="badge badge-warning">Đã mở</span>}
                    {pallet.daysUntilExpiry <= 7 && <span className="badge badge-danger">Gần hết hạn</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="allocation-actions">
        <button className="btn btn-secondary" onClick={() => setShowAllocationModal(false)}>
          Hủy
        </button>
        <button className="btn btn-primary" onClick={confirmAllocation}>
          Xác nhận phân bổ
        </button>
      </div>
    </div>
  )

  return (
    <div className="tao-don-xuat">
      <div className="section-header">
        <div>
          <h2 className="section-title">Tạo đơn xuất</h2>
          <p className="section-subtitle">Tạo đơn xuất hàng với phân bổ pallet tự động</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={saveOrder}>
            <Save size={16} />
            Lưu đơn hàng
          </button>
        </div>
      </div>

      {/* Order Info */}
      <div className="order-info card">
        <div className="card-header">
          <h3 className="card-title">Thông tin đơn hàng</h3>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cửa hàng *</label>
              <select className="form-input" value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
                <option value="">Chọn cửa hàng</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name} - {store.area}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ngày xuất</label>
              <input
                type="date"
                className="form-input"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <textarea
              className="form-input"
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú cho đơn hàng..."
            />
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="order-items card">
        <div className="card-header">
          <h3 className="card-title">Danh sách sản phẩm</h3>
          <button className="btn btn-secondary" onClick={addOrderItem}>
            <Plus size={16} />
            Thêm sản phẩm
          </button>
        </div>
        <div className="card-body">
          <div className="excel-table">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: "150px" }}>Mã SP</th>
                  <th style={{ width: "200px" }}>Tên sản phẩm</th>
                  <th style={{ width: "100px" }}>Số lượng</th>
                  <th style={{ width: "80px" }}>Đơn vị</th>
                  <th style={{ width: "150px" }}>Phân bổ</th>
                  <th style={{ width: "200px" }}>Ghi chú</th>
                  <th style={{ width: "100px" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <select
                        className="table-input"
                        value={item.productCode}
                        onChange={(e) => updateOrderItem(item.id, "productCode", e.target.value)}
                      >
                        <option value="">Chọn SP</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.code}>
                            {product.code}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="table-input"
                        value={item.productName}
                        readOnly
                        placeholder="Tên sản phẩm"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="table-input"
                        value={item.quantity}
                        onChange={(e) => updateOrderItem(item.id, "quantity", e.target.value)}
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <input type="text" className="table-input" value={item.unit} readOnly />
                    </td>
                    <td>
                      <div className="allocation-cell">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleAutoAllocate(item)}
                          disabled={!item.productCode || !item.quantity}
                        >
                          <Calculator size={12} />
                          Phân bổ
                        </button>
                        {item.allocation && (
                          <div className="allocation-status">
                            {item.allocation.isFullyAllocated ? (
                              <span className="status-success">✓ Đủ hàng</span>
                            ) : (
                              <span className="status-warning">
                                ⚠ Thiếu {item.allocation.shortfall} {item.unit}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="table-input"
                        value={item.notes}
                        onChange={(e) => updateOrderItem(item.id, "notes", e.target.value)}
                        placeholder="Ghi chú"
                      />
                    </td>
                    <td>
                      <button className="btn-action delete" onClick={() => removeOrderItem(item.id)} title="Xóa">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {orderItems.length === 0 && (
                  <tr>
                    <td colSpan="7" className="empty-row">
                      <div className="empty-state">
                        <Package size={48} />
                        <p>Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {orderItems.length > 0 && (
            <div className="order-summary">
              <div className="summary-row">
                <span className="label">Tổng số lượng:</span>
                <span className="value">{calculateTotalQuantity()} kg</span>
              </div>
              <div className="summary-row">
                <span className="label">Số sản phẩm:</span>
                <span className="value">{orderItems.length} loại</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Allocation Modal */}
      <Modal isOpen={showAllocationModal} onClose={() => setShowAllocationModal(false)} title="Phân bổ pallet tự động">
        <AllocationModal />
      </Modal>
    </div>
  )
}

export default TaoDonXuat
