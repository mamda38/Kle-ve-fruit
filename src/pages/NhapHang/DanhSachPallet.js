"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Edit, Trash2, Eye } from "lucide-react"
import ThemPallet from "./ThemPallet"
import ChiTietPallet from "./ChiTietPallet"
import SuaPallet from "./SuaPallet"

function DanhSachPallet() {
  const [pallets, setPallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDetailForm, setShowDetailForm] = useState(false)
  const [selectedPallet, setSelectedPallet] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc"
  })

  // Danh sách trạng thái pallet
  const trangThaiOptions = [
    { value: 'Mới', label: 'Mới (chưa mở)' },
    { value: 'Đã_mở', label: 'Đã mở niêm phong' },
    { value: 'Trống', label: 'Trống (không còn hàng)' }
  ]

  // Hàm lấy danh sách pallet từ API
  const fetchPallets = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://127.0.0.1:8000/nhaphang/pallets/")
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

  // Hàm xử lý sắp xếp
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc"
    }))
  }

  // Hàm xử lý tìm kiếm và lọc
  const filteredPallets = pallets.filter(pallet => {
    const matchesSearch = 
      pallet.ma_pallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pallet.ten_san_pham.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pallet.vi_tri_kho.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || pallet.trang_thai === filterStatus

    return matchesSearch && matchesStatus
  })

  // Sắp xếp danh sách pallet
  const sortedPallets = [...filteredPallets].sort((a, b) => {
    if (sortConfig.key === "created_at") {
      return sortConfig.direction === "asc" 
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at)
    }
    return 0
  })

  // Hàm xử lý xóa pallet
  const handleDelete = async (maPallet) => {
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

  // Hàm xử lý khi tạo pallet mới thành công
  const handleAddSuccess = (newPallet) => {
    setPallets(prevPallets => [newPallet, ...prevPallets])
    setShowAddForm(false)
  }

  // Hàm xử lý khi cập nhật pallet thành công
  const handleUpdateSuccess = (updatedPallet) => {
    setPallets(prevPallets =>
      prevPallets.map(p =>
        p.ma_pallet === updatedPallet.ma_pallet ? updatedPallet : p
      )
    )
    setShowEditForm(false)
  }

  return (
    <div className="pallets-container">
      <div className="pallets-header">
        <h2>Danh sách Pallet</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={16} />
          Thêm Pallet Mới
        </button>
      </div>

      <div className="pallets-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tên sản phẩm hoặc vị trí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <Filter size={16} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            {trangThaiOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải danh sách pallet...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="pallets-table-container">
          <table className="pallets-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("created_at")}>
                  Thời gian tạo
                  {sortConfig.key === "created_at" && (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  )}
                </th>
                <th>Mã Pallet</th>
                <th>Tên sản phẩm</th>
                <th>Vị trí kho</th>
                <th>Số thùng còn lại</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sortedPallets.map((pallet) => (
                <tr key={pallet.ma_pallet}>
                  <td>{new Date(pallet.created_at).toLocaleString()}</td>
                  <td>{pallet.ma_pallet}</td>
                  <td>{pallet.ten_san_pham}</td>
                  <td>{pallet.vi_tri_kho}</td>
                  <td>{pallet.so_thung_con_lai}</td>
                  <td>
                    <span className={`status-badge status-${pallet.trang_thai.toLowerCase()}`}>
                      {trangThaiOptions.find(opt => opt.value === pallet.trang_thai)?.label || pallet.trang_thai}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-icon"
                        onClick={() => {
                          setSelectedPallet(pallet)
                          setShowDetailForm(true)
                        }}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn btn-icon"
                        onClick={() => {
                          setSelectedPallet(pallet)
                          setShowEditForm(true)
                        }}
                        title="Sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn btn-icon btn-danger"
                        onClick={() => handleDelete(pallet.ma_pallet)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddForm && (
        <div className="modal">
          <div className="modal-content">
            <ThemPallet
              onSubmit={handleAddSuccess}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {showEditForm && selectedPallet && (
        <div className="modal">
          <div className="modal-content">
            <SuaPallet
              pallet={selectedPallet}
              onSubmit={handleUpdateSuccess}
              onCancel={() => {
                setShowEditForm(false)
                setSelectedPallet(null)
              }}
            />
          </div>
        </div>
      )}

      {showDetailForm && selectedPallet && (
        <div className="modal">
          <div className="modal-content">
            <ChiTietPallet
              pallet={selectedPallet}
              onClose={() => {
                setShowDetailForm(false)
                setSelectedPallet(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DanhSachPallet 