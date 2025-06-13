"use client"

import { useState } from "react"
import { Calendar, Clock, Wrench, CheckCircle, AlertTriangle, Plus, Search, User, MapPin } from "lucide-react"
import Modal from "../../components/common/Modal"

const BaoTriKho = () => {
  const [maintenanceTasks, setMaintenanceTasks] = useState([
    {
      id: 1,
      title: "Bảo trì định kỳ khu vực A",
      description: "Kiểm tra và vệ sinh hệ thống thông gió",
      location: "Khu vực A",
      type: "scheduled",
      priority: "medium",
      status: "pending",
      assignee: "Nguyễn Văn A",
      scheduledDate: "2024-01-25",
      estimatedHours: 4,
      createdDate: "2024-01-20",
    },
    {
      id: 2,
      title: "Sửa chữa hệ thống chiếu sáng",
      description: "Thay thế bóng đèn LED bị hỏng tại vị trí B-15",
      location: "B-15",
      type: "repair",
      priority: "high",
      status: "in-progress",
      assignee: "Trần Văn B",
      scheduledDate: "2024-01-22",
      estimatedHours: 2,
      createdDate: "2024-01-21",
    },
    {
      id: 3,
      title: "Kiểm tra hệ thống cảm biến nhiệt độ",
      description: "Hiệu chuẩn và kiểm tra độ chính xác của cảm biến",
      location: "Khu vực C",
      type: "inspection",
      priority: "low",
      status: "completed",
      assignee: "Lê Thị C",
      scheduledDate: "2024-01-18",
      estimatedHours: 3,
      createdDate: "2024-01-15",
      completedDate: "2024-01-18",
    },
    {
      id: 4,
      title: "Bảo trì hệ thống chống ẩm",
      description: "Vệ sinh và thay thế bộ lọc ẩm",
      location: "Khu vực B",
      type: "scheduled",
      priority: "medium",
      status: "overdue",
      assignee: "Phạm Văn D",
      scheduledDate: "2024-01-20",
      estimatedHours: 6,
      createdDate: "2024-01-18",
    },
  ])

  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b"
      case "in-progress":
        return "#3b82f6"
      case "completed":
        return "#10b981"
      case "overdue":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ thực hiện"
      case "in-progress":
        return "Đang thực hiện"
      case "completed":
        return "Hoàn thành"
      case "overdue":
        return "Quá hạn"
      default:
        return "Không xác định"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "Cao"
      case "medium":
        return "Trung bình"
      case "low":
        return "Thấp"
      default:
        return "Không xác định"
    }
  }

  const getTypeText = (type) => {
    switch (type) {
      case "scheduled":
        return "Định kỳ"
      case "repair":
        return "Sửa chữa"
      case "inspection":
        return "Kiểm tra"
      case "emergency":
        return "Khẩn cấp"
      default:
        return "Khác"
    }
  }

  const filteredTasks = maintenanceTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const matchesType = filterType === "all" || task.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const taskStats = {
    total: maintenanceTasks.length,
    pending: maintenanceTasks.filter((t) => t.status === "pending").length,
    inProgress: maintenanceTasks.filter((t) => t.status === "in-progress").length,
    completed: maintenanceTasks.filter((t) => t.status === "completed").length,
    overdue: maintenanceTasks.filter((t) => t.status === "overdue").length,
  }

  const handleAddTask = () => {
    setSelectedTask(null)
    setShowAddTaskModal(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setShowAddTaskModal(true)
  }

  const handleUpdateStatus = (taskId, newStatus) => {
    setMaintenanceTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              completedDate: newStatus === "completed" ? new Date().toISOString().split("T")[0] : undefined,
            }
          : task,
      ),
    )
  }

  return (
    <div className="bao-tri-kho">
      <div className="page-header">
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <Wrench size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{taskStats.total}</span>
              <span className="stat-label">Tổng công việc</span>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{taskStats.pending}</span>
              <span className="stat-label">Chờ thực hiện</span>
            </div>
          </div>
          <div className="stat-card in-progress">
            <div className="stat-icon">
              <Wrench size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{taskStats.inProgress}</span>
              <span className="stat-label">Đang thực hiện</span>
            </div>
          </div>
          <div className="stat-card completed">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{taskStats.completed}</span>
              <span className="stat-label">Hoàn thành</span>
            </div>
          </div>
          <div className="stat-card overdue">
            <div className="stat-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{taskStats.overdue}</span>
              <span className="stat-label">Quá hạn</span>
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
              placeholder="Tìm kiếm công việc, vị trí, người thực hiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ thực hiện</option>
            <option value="in-progress">Đang thực hiện</option>
            <option value="completed">Hoàn thành</option>
            <option value="overdue">Quá hạn</option>
          </select>
          <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Tất cả loại</option>
            <option value="scheduled">Định kỳ</option>
            <option value="repair">Sửa chữa</option>
            <option value="inspection">Kiểm tra</option>
            <option value="emergency">Khẩn cấp</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleAddTask}>
          <Plus size={20} />
          Thêm công việc
        </button>
      </div>

      <div className="tasks-container">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <div className="task-info">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-meta">
                  <span className="task-type">{getTypeText(task.type)}</span>
                  <span className="task-priority" style={{ color: getPriorityColor(task.priority) }}>
                    {getPriorityText(task.priority)}
                  </span>
                </div>
              </div>
              <div
                className="task-status"
                style={{
                  backgroundColor: `${getStatusColor(task.status)}20`,
                  color: getStatusColor(task.status),
                }}
              >
                {getStatusText(task.status)}
              </div>
            </div>

            <div className="task-content">
              <p className="task-description">{task.description}</p>

              <div className="task-details">
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{task.location}</span>
                </div>
                <div className="detail-item">
                  <User size={16} />
                  <span>{task.assignee}</span>
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>Lên lịch: {new Date(task.scheduledDate).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="detail-item">
                  <Clock size={16} />
                  <span>Ước tính: {task.estimatedHours} giờ</span>
                </div>
                {task.completedDate && (
                  <div className="detail-item">
                    <CheckCircle size={16} />
                    <span>Hoàn thành: {new Date(task.completedDate).toLocaleDateString("vi-VN")}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="task-actions">
              <button className="btn btn-sm btn-outline" onClick={() => handleEditTask(task)}>
                Sửa
              </button>
              {task.status === "pending" && (
                <button className="btn btn-sm btn-primary" onClick={() => handleUpdateStatus(task.id, "in-progress")}>
                  Bắt đầu
                </button>
              )}
              {task.status === "in-progress" && (
                <button className="btn btn-sm btn-success" onClick={() => handleUpdateStatus(task.id, "completed")}>
                  Hoàn thành
                </button>
              )}
              {task.status === "overdue" && (
                <button className="btn btn-sm btn-warning" onClick={() => handleUpdateStatus(task.id, "in-progress")}>
                  Tiếp tục
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="empty-state">
          <Wrench size={48} />
          <h3>Không có công việc bảo trì nào</h3>
          <p>Thử thay đổi bộ lọc hoặc thêm công việc mới</p>
        </div>
      )}

      {/* Modal thêm/sửa công việc */}
      <Modal
        isOpen={showAddTaskModal}
        onClose={() => {
          setShowAddTaskModal(false)
          setSelectedTask(null)
        }}
        title={selectedTask ? "Sửa công việc bảo trì" : "Thêm công việc bảo trì"}
      >
        <form className="task-form">
          <div className="form-group">
            <label>Tiêu đề công việc</label>
            <input type="text" placeholder="Nhập tiêu đề công việc" defaultValue={selectedTask?.title || ""} />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea placeholder="Mô tả chi tiết công việc" rows="3" defaultValue={selectedTask?.description || ""} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Vị trí</label>
              <input type="text" placeholder="Vị trí thực hiện" defaultValue={selectedTask?.location || ""} />
            </div>
            <div className="form-group">
              <label>Loại công việc</label>
              <select defaultValue={selectedTask?.type || "scheduled"}>
                <option value="scheduled">Định kỳ</option>
                <option value="repair">Sửa chữa</option>
                <option value="inspection">Kiểm tra</option>
                <option value="emergency">Khẩn cấp</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Mức độ ưu tiên</label>
              <select defaultValue={selectedTask?.priority || "medium"}>
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>
            <div className="form-group">
              <label>Người thực hiện</label>
              <input type="text" placeholder="Tên người thực hiện" defaultValue={selectedTask?.assignee || ""} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Ngày lên lịch</label>
              <input type="date" defaultValue={selectedTask?.scheduledDate || ""} />
            </div>
            <div className="form-group">
              <label>Thời gian ước tính (giờ)</label>
              <input type="number" min="1" max="24" defaultValue={selectedTask?.estimatedHours || ""} />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowAddTaskModal(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedTask ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Kế hoạch bảo trì */}
      <div className="section maintenance-schedule">
        <div className="section-header">
          <h3 className="section-title">Kế hoạch bảo trì</h3>
        </div>

        <div className="schedule-container">
          <div className="schedule-today">
            <h4>🔧 Hôm nay (09/06):</h4>
            <div className="schedule-list">
              <div className="schedule-item">
                <span className="schedule-time">14:00-16:00</span>
                <span className="schedule-task">Vệ sinh khu vực B</span>
              </div>
              <div className="schedule-item">
                <span className="schedule-time">16:30</span>
                <span className="schedule-task">Kiểm tra hệ thống điều hòa A3</span>
              </div>
              <div className="schedule-item">
                <span className="schedule-time">17:00</span>
                <span className="schedule-task">Thay đèn LED tại C1-C5</span>
              </div>
            </div>
          </div>

          <div className="schedule-week">
            <h4>📅 Tuần này:</h4>
            <div className="schedule-list">
              <div className="schedule-item">
                <span className="schedule-date">12/06</span>
                <span className="schedule-task">Bảo trì xe nâng #001</span>
              </div>
              <div className="schedule-item">
                <span className="schedule-date">14/06</span>
                <span className="schedule-task">Kiểm tra camera an ninh</span>
              </div>
              <div className="schedule-item">
                <span className="schedule-date">15/06</span>
                <span className="schedule-task">Vệ sinh tổng thể kho</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BaoTriKho
