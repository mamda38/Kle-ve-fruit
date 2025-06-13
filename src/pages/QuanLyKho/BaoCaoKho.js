"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { Download, Calendar, TrendingUp, Package, Clock, AlertTriangle } from "lucide-react"

const BaoCaoKho = () => {
  const [dateRange, setDateRange] = useState("30days")
  const [reportType, setReportType] = useState("overview")

  const utilizationData = [
    { month: "T1", utilization: 65, capacity: 150 },
    { month: "T2", utilization: 72, capacity: 150 },
    { month: "T3", utilization: 68, capacity: 150 },
    { month: "T4", utilization: 75, capacity: 150 },
    { month: "T5", utilization: 82, capacity: 150 },
    { month: "T6", utilization: 78, capacity: 150 },
  ]

  const categoryData = [
    { name: "Bia & Nước ngọt", value: 45, color: "#3b82f6" },
    { name: "Nước suối", value: 30, color: "#10b981" },
    { name: "Đồ uống có cồn", value: 15, color: "#f59e0b" },
    { name: "Khác", value: 10, color: "#8b5cf6" },
  ]

  const maintenanceData = [
    { month: "T1", scheduled: 8, emergency: 2, completed: 9 },
    { month: "T2", scheduled: 6, emergency: 3, completed: 8 },
    { month: "T3", scheduled: 10, emergency: 1, completed: 11 },
    { month: "T4", scheduled: 7, emergency: 4, completed: 10 },
    { month: "T5", scheduled: 9, emergency: 2, completed: 11 },
    { month: "T6", scheduled: 8, emergency: 3, completed: 9 },
  ]

  const efficiencyData = [
    { date: "01/01", inbound: 45, outbound: 38, efficiency: 85 },
    { date: "02/01", inbound: 52, outbound: 41, efficiency: 79 },
    { date: "03/01", inbound: 48, outbound: 45, efficiency: 94 },
    { date: "04/01", inbound: 55, outbound: 48, efficiency: 87 },
    { date: "05/01", inbound: 49, outbound: 46, efficiency: 94 },
    { date: "06/01", inbound: 58, outbound: 52, efficiency: 90 },
    { date: "07/01", inbound: 51, outbound: 49, efficiency: 96 },
  ]

  const kpiData = [
    {
      title: "Tỷ lệ sử dụng kho",
      value: "78%",
      change: "+5%",
      trend: "up",
      icon: Package,
      color: "#3b82f6",
    },
    {
      title: "Hiệu suất vận hành",
      value: "89%",
      change: "+3%",
      trend: "up",
      icon: TrendingUp,
      color: "#10b981",
    },
    {
      title: "Thời gian xử lý TB",
      value: "2.3h",
      change: "-0.5h",
      trend: "up",
      icon: Clock,
      color: "#f59e0b",
    },
    {
      title: "Tỷ lệ lỗi",
      value: "1.2%",
      change: "-0.3%",
      trend: "up",
      icon: AlertTriangle,
      color: "#ef4444",
    },
  ]

  const exportReport = (format) => {
    // Simulate export functionality
    alert(`Đang xuất báo cáo định dạng ${format.toUpperCase()}...`)
  }

  return (
    <div className="bao-cao-kho">
      <div className="page-header">
        <div className="header-controls">
          <div className="date-range-selector">
            <Calendar size={20} />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="3months">3 tháng qua</option>
              <option value="6months">6 tháng qua</option>
              <option value="1year">1 năm qua</option>
            </select>
          </div>
          <div className="report-type-selector">
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="overview">Tổng quan</option>
              <option value="utilization">Sử dụng kho</option>
              <option value="maintenance">Bảo trì</option>
              <option value="efficiency">Hiệu suất</option>
            </select>
          </div>
          <div className="export-buttons">
            <button className="btn btn-outline" onClick={() => exportReport("pdf")}>
              <Download size={16} />
              PDF
            </button>
            <button className="btn btn-outline" onClick={() => exportReport("excel")}>
              <Download size={16} />
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-section">
        <h2 className="section-title">Chỉ số hiệu suất chính (KPI)</h2>
        <div className="kpi-grid">
          {kpiData.map((kpi, index) => (
            <div key={index} className="kpi-card">
              <div className="kpi-content">
                <div className="kpi-info">
                  <h3 className="kpi-title">{kpi.title}</h3>
                  <div className="kpi-value">{kpi.value}</div>
                  <div className={`kpi-change ${kpi.trend}`}>
                    <span>{kpi.change} so với kỳ trước</span>
                  </div>
                </div>
                <div className="kpi-icon" style={{ backgroundColor: `${kpi.color}20` }}>
                  <kpi.icon size={24} style={{ color: kpi.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Utilization Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Tỷ lệ sử dụng kho theo tháng</h3>
            <p className="chart-subtitle">Phần trăm sử dụng so với tổng công suất</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="utilization"
                  stroke="#3b82f6"
                  fill="#3b82f620"
                  name="Tỷ lệ sử dụng (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Phân bố theo danh mục</h3>
            <p className="chart-subtitle">Tỷ lệ sử dụng kho theo loại sản phẩm</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Hoạt động bảo trì</h3>
            <p className="chart-subtitle">Số lượng công việc bảo trì theo tháng</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="scheduled" fill="#10b981" name="Định kỳ" />
                <Bar dataKey="emergency" fill="#ef4444" name="Khẩn cấp" />
                <Bar dataKey="completed" fill="#3b82f6" name="Hoàn thành" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Xu hướng hiệu suất</h3>
            <p className="chart-subtitle">Hiệu suất vận hành theo ngày</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} name="Hiệu suất (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="summary-section">
        <h2 className="section-title">Bảng tóm tắt</h2>
        <div className="summary-table">
          <table>
            <thead>
              <tr>
                <th>Chỉ số</th>
                <th>Giá trị hiện tại</th>
                <th>Mục tiêu</th>
                <th>Trạng thái</th>
                <th>Xu hướng</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tỷ lệ sử dụng kho</td>
                <td>78%</td>
                <td>75%</td>
                <td>
                  <span className="status-good">Đạt</span>
                </td>
                <td>
                  <span className="trend-up">↗️ +5%</span>
                </td>
              </tr>
              <tr>
                <td>Hiệu suất vận hành</td>
                <td>89%</td>
                <td>85%</td>
                <td>
                  <span className="status-good">Đạt</span>
                </td>
                <td>
                  <span className="trend-up">↗️ +3%</span>
                </td>
              </tr>
              <tr>
                <td>Thời gian xử lý trung bình</td>
                <td>2.3h</td>
                <td>3.0h</td>
                <td>
                  <span className="status-good">Đạt</span>
                </td>
                <td>
                  <span className="trend-up">↗️ -0.5h</span>
                </td>
              </tr>
              <tr>
                <td>Tỷ lệ lỗi</td>
                <td>1.2%</td>
                <td>2.0%</td>
                <td>
                  <span className="status-good">Đạt</span>
                </td>
                <td>
                  <span className="trend-up">↗️ -0.3%</span>
                </td>
              </tr>
              <tr>
                <td>Số lần bảo trì khẩn cấp</td>
                <td>3</td>
                <td>5</td>
                <td>
                  <span className="status-good">Đạt</span>
                </td>
                <td>
                  <span className="trend-down">↘️ -2</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BaoCaoKho
