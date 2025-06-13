"use client"

import { useState } from "react"
import { Save, RefreshCw, Bell, Database, Thermometer, Droplets, Clock, Users, MapPin } from "lucide-react"

const CaiDatKho = () => {
  const [settings, setSettings] = useState({
    // Cài đặt chung
    warehouseName: "Kho hoa quả sạch ABC",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    capacity: 150,
    workingHours: {
      start: "08:00",
      end: "18:00",
    },

    // Cài đặt cảnh báo
    alerts: {
      lowStock: true,
      expiring: true,
      maintenance: true,
      temperature: true,
      humidity: true,
    },

    // Ngưỡng cảnh báo
    thresholds: {
      lowStockPercent: 20,
      expiringDays: 7,
      temperatureMin: 15,
      temperatureMax: 30,
      humidityMin: 40,
      humidityMax: 70,
    },

    // Cài đặt bảo trì
    maintenance: {
      scheduledInterval: 30,
      reminderDays: 3,
      autoAssign: true,
    },

    // Cài đặt người dùng
    users: {
      maxUsers: 50,
      sessionTimeout: 480,
      requireApproval: true,
    },

    // Cài đặt backup
    backup: {
      autoBackup: true,
      backupInterval: 24,
      retentionDays: 30,
    },
  })

  const [activeTab, setActiveTab] = useState("general")

  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  const handleSave = () => {
    // Simulate save functionality
    alert("Cài đặt đã được lưu thành công!")
  }

  const handleReset = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục cài đặt mặc định?")) {
      // Reset to default settings
      alert("Đã khôi phục cài đặt mặc định!")
    }
  }

  const tabs = [
    { id: "general", title: "Chung", icon: MapPin },
    { id: "alerts", title: "Cảnh báo", icon: Bell },
    { id: "maintenance", title: "Bảo trì", icon: RefreshCw },
    { id: "users", title: "Người dùng", icon: Users },
    { id: "backup", title: "Sao lưu", icon: Database },
  ]

  return (
    <div className="cai-dat-kho">
      <div className="page-header">
        <div className="header-actions">
          <button className="btn btn-outline" onClick={handleReset}>
            <RefreshCw size={16} />
            Khôi phục mặc định
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            Lưu cài đặt
          </button>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={20} />
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {/* Cài đặt chung */}
          {activeTab === "general" && (
            <div className="settings-section">
              <h2 className="section-title">Cài đặt chung</h2>

              <div className="form-group">
                <label>Tên kho</label>
                <input
                  type="text"
                  value={settings.warehouseName}
                  onChange={(e) => setSettings((prev) => ({ ...prev, warehouseName: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Công suất kho (số vị trí)</label>
                <input
                  type="number"
                  value={settings.capacity}
                  onChange={(e) => setSettings((prev) => ({ ...prev, capacity: Number.parseInt(e.target.value) }))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giờ bắt đầu làm việc</label>
                  <input
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) => handleSettingChange("workingHours", "start", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Giờ kết thúc làm việc</label>
                  <input
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) => handleSettingChange("workingHours", "end", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cài đặt cảnh báo */}
          {activeTab === "alerts" && (
            <div className="settings-section">
              <h2 className="section-title">Cài đặt cảnh báo</h2>

              <div className="alert-settings">
                <h3>Loại cảnh báo</h3>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={settings.alerts.lowStock}
                      onChange={(e) => handleSettingChange("alerts", "lowStock", e.target.checked)}
                    />
                    <span>Cảnh báo hàng tồn thấp</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={settings.alerts.expiring}
                      onChange={(e) => handleSettingChange("alerts", "expiring", e.target.checked)}
                    />
                    <span>Cảnh báo hàng sắp hết hạn</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={settings.alerts.maintenance}
                      onChange={(e) => handleSettingChange("alerts", "maintenance", e.target.checked)}
                    />
                    <span>Cảnh báo bảo trì</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={settings.alerts.temperature}
                      onChange={(e) => handleSettingChange("alerts", "temperature", e.target.checked)}
                    />
                    <span>Cảnh báo nhiệt độ</span>
                  </label>
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={settings.alerts.humidity}
                      onChange={(e) => handleSettingChange("alerts", "humidity", e.target.checked)}
                    />
                    <span>Cảnh báo độ ẩm</span>
                  </label>
                </div>
              </div>

              <div className="threshold-settings">
                <h3>Ngưỡng cảnh báo</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tỷ lệ hàng tồn thấp (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={settings.thresholds.lowStockPercent}
                      onChange={(e) =>
                        handleSettingChange("thresholds", "lowStockPercent", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Số ngày trước khi hết hạn</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={settings.thresholds.expiringDays}
                      onChange={(e) =>
                        handleSettingChange("thresholds", "expiringDays", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <Thermometer size={16} />
                      Nhiệt độ tối thiểu (°C)
                    </label>
                    <input
                      type="number"
                      value={settings.thresholds.temperatureMin}
                      onChange={(e) =>
                        handleSettingChange("thresholds", "temperatureMin", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <Thermometer size={16} />
                      Nhiệt độ tối đa (°C)
                    </label>
                    <input
                      type="number"
                      value={settings.thresholds.temperatureMax}
                      onChange={(e) =>
                        handleSettingChange("thresholds", "temperatureMax", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <Droplets size={16} />
                      Độ ẩm tối thiểu (%)
                    </label>
                    <input
                      type="number"
                      value={settings.thresholds.humidityMin}
                      onChange={(e) =>
                        handleSettingChange("thresholds", "humidityMin", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <Droplets size={16} />
                      Độ ẩm tối đa (%)
                    </label>
                    <input
                      type="number"
                      value={settings.thresholds.humidityMax}
                      onChange={(e) =>
                        handleSettingChange("thresholds", "humidityMax", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cài đặt bảo trì */}
          {activeTab === "maintenance" && (
            <div className="settings-section">
              <h2 className="section-title">Cài đặt bảo trì</h2>

              <div className="form-group">
                <label>Chu kỳ bảo trì định kỳ (ngày)</label>
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={settings.maintenance.scheduledInterval}
                  onChange={(e) =>
                    handleSettingChange("maintenance", "scheduledInterval", Number.parseInt(e.target.value))
                  }
                />
              </div>

              <div className="form-group">
                <label>Nhắc nhở trước (ngày)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.maintenance.reminderDays}
                  onChange={(e) => handleSettingChange("maintenance", "reminderDays", Number.parseInt(e.target.value))}
                />
              </div>

              <div className="checkbox-group">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={settings.maintenance.autoAssign}
                    onChange={(e) => handleSettingChange("maintenance", "autoAssign", e.target.checked)}
                  />
                  <span>Tự động phân công công việc bảo trì</span>
                </label>
              </div>
            </div>
          )}

          {/* Cài đặt người dùng */}
          {activeTab === "users" && (
            <div className="settings-section">
              <h2 className="section-title">Cài đặt người dùng</h2>

              <div className="form-group">
                <label>Số lượng người dùng tối đa</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={settings.users.maxUsers}
                  onChange={(e) => handleSettingChange("users", "maxUsers", Number.parseInt(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>
                  <Clock size={16} />
                  Thời gian hết hạn phiên (phút)
                </label>
                <input
                  type="number"
                  min="30"
                  max="1440"
                  value={settings.users.sessionTimeout}
                  onChange={(e) => handleSettingChange("users", "sessionTimeout", Number.parseInt(e.target.value))}
                />
              </div>

              <div className="checkbox-group">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={settings.users.requireApproval}
                    onChange={(e) => handleSettingChange("users", "requireApproval", e.target.checked)}
                  />
                  <span>Yêu cầu phê duyệt tài khoản mới</span>
                </label>
              </div>
            </div>
          )}

          {/* Cài đặt sao lưu */}
          {activeTab === "backup" && (
            <div className="settings-section">
              <h2 className="section-title">Cài đặt sao lưu</h2>

              <div className="checkbox-group">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={settings.backup.autoBackup}
                    onChange={(e) => handleSettingChange("backup", "autoBackup", e.target.checked)}
                  />
                  <span>Tự động sao lưu dữ liệu</span>
                </label>
              </div>

              <div className="form-group">
                <label>Chu kỳ sao lưu (giờ)</label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={settings.backup.backupInterval}
                  onChange={(e) => handleSettingChange("backup", "backupInterval", Number.parseInt(e.target.value))}
                  disabled={!settings.backup.autoBackup}
                />
              </div>

              <div className="form-group">
                <label>Thời gian lưu trữ (ngày)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.backup.retentionDays}
                  onChange={(e) => handleSettingChange("backup", "retentionDays", Number.parseInt(e.target.value))}
                />
              </div>

              <div className="backup-actions">
                <button className="btn btn-outline">
                  <Database size={16} />
                  Sao lưu ngay
                </button>
                <button className="btn btn-outline">
                  <RefreshCw size={16} />
                  Khôi phục dữ liệu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CaiDatKho
