import { AlertTriangle, Clock, CheckCircle } from "lucide-react"

const DashboardWidgets = () => {
  const recentActivities = [
    {
      id: 1,
      type: "import",
      message: "Nhập 150kg táo từ Nông trại Xanh",
      time: "10 phút trước",
      status: "success",
    },
    {
      id: 2,
      type: "export",
      message: "Xuất 80kg cam cho cửa hàng ABC",
      time: "25 phút trước",
      status: "success",
    },
    {
      id: 3,
      type: "warning",
      message: "Cảnh báo: Hàng tồn chuối dưới mức tối thiểu",
      time: "1 giờ trước",
      status: "warning",
    },
    {
      id: 4,
      type: "pending",
      message: "Đơn hàng #DH001 đang chờ xử lý",
      time: "2 giờ trước",
      status: "pending",
    },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle size={16} className="status-icon success" />
      case "warning":
        return <AlertTriangle size={16} className="status-icon warning" />
      case "pending":
        return <Clock size={16} className="status-icon pending" />
      default:
        return <CheckCircle size={16} className="status-icon" />
    }
  }

  return (
    <div className="dashboard-widgets">
      <div className="widget-card card">
        <div className="card-header">
          <h3 className="card-title">Hoạt động gần đây</h3>
          <p className="card-subtitle">Theo dõi các hoạt động mới nhất</p>
        </div>
        <div className="card-body">
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{getStatusIcon(activity.status)}</div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardWidgets
