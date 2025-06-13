import DashboardWidgets from "./DashboardWidgets"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Package, Users, ShoppingCart } from "lucide-react"
import "./Dashboard.css"

const Dashboard = () => {
  // Mock data
  const statsData = [
    {
      title: "Tổng hàng tồn",
      value: "1,250 kg",
      change: "+12%",
      icon: Package,
      color: "var(--primary-color)",
    },
    {
      title: "Đơn nhập hôm nay",
      value: "24 đơn",
      change: "+8%",
      icon: ShoppingCart,
      color: "var(--success-color)",
    },
    {
      title: "Nhà cung cấp",
      value: "15 đối tác",
      change: "0%",
      icon: Users,
      color: "var(--info-color)",
    },
    {
      title: "Doanh thu tháng",
      value: "125M VNĐ",
      change: "+15%",
      icon: TrendingUp,
      color: "var(--warning-color)",
    },
  ]

  // const chartData = [
  //   { name: "Táo", value: 150, color: "#EF5350" },
  //   { name: "Cam", value: 200, color: "	#FFA726" },
  //   { name: "Chuối", value: 80, color: "#FFEB3B" },
  //   { name: "Xoài", value: 120, color: "#FBC02D" },
  //   { name: "Nho", value: 90, color: "#8E24AA" },
  // ]

  const chartData = [
    { name: "Cam", value: 200, color: "#FFA500" },     
    { name: "Xoài", value: 120, color: "#FBC02D" },    
    { name: "Bơ", value: 100, color: "#4CAF50" },      
    { name: "Nho", value: 90, color: "#8E24AA" },     
    { name: "Táo", value: 150, color: "#EF5350" }      
  ]
  
  
  const barChartData = [
    { month: "T1", quantity: 400 },
    { month: "T2", quantity: 300 },
    { month: "T3", quantity: 500 },
    { month: "T4", quantity: 450 },
    { month: "T5", quantity: 600 },
    { month: "T6", quantity: 550 },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Tổng quan quản lý hoa quả sạch</p>
        </div>
        <div className="dashboard-date">
          <span className="badge badge-primary">Hôm nay: {new Date().toLocaleDateString("vi-VN")}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card card">
            <div className="card-body">
              <div className="stat-content">
                <div className="stat-info">
                  <h3 className="stat-title">{stat.title}</h3>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-change">
                    <span className={`change ${stat.change.startsWith("+") ? "positive" : "neutral"}`}>
                      {stat.change} so với kỳ trước
                    </span>
                  </div>
                </div>
                <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
                  <stat.icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card card">
          <div className="card-header">
            <h3 className="card-title">Hoa quả nhập nhiều nhất</h3>
            <p className="card-subtitle">Thống kê theo loại sản phẩm</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}kg`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card card">
          <div className="card-header">
            <h3 className="card-title">Xu hướng nhập hàng</h3>
            <p className="card-subtitle">Số lượng nhập theo tháng (kg)</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <DashboardWidgets />
    </div>
  )
}

export default Dashboard
