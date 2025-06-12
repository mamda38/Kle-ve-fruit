"use client"

import { useState, useEffect, useRef } from "react"
import { QrCode, Camera, MapPin, Package, Clock, CheckCircle, AlertTriangle, Volume2 } from "lucide-react"
import Modal from "../../components/common/Modal"
import QRScanner from "./QRScanner"
import KetQuaKiemTra from "./KetQuaKiemTra"
import LichSuKiemTra from "./LichSuKiemTra"
import "./KiemTraGiaoHang.css"

const KiemTraGiaoHang = () => {
  const [activeTab, setActiveTab] = useState("quet-qr")
  const [showScannerModal, setShowScannerModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [verificationResult, setVerificationResult] = useState(null)
  const [currentLocation, setCurrentLocation] = useState("")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioContextRef = useRef(null)

  // Mock data cho cửa hàng
  const stores = [
    {
      id: 1,
      name: "Siêu thị BigC Thăng Long",
      address: "222 Trần Duy Hưng, Cầu Giấy, Hà Nội",
      area: "Hà Nội",
      coordinates: { lat: 21.0285, lng: 105.8542 },
    },
    {
      id: 2,
      name: "Cửa hàng Trái cây Sạch ABC",
      address: "45 Nguyễn Văn Cừ, Quận 1, TP.HCM",
      area: "TP.HCM",
      coordinates: { lat: 10.7769, lng: 106.7009 },
    },
    {
      id: 3,
      name: "Lotte Mart Đà Nẵng",
      address: "6 Nại Nam, Hòa Cường Bắc, Hải Châu, Đà Nẵng",
      area: "Đà Nẵng",
      coordinates: { lat: 16.0544, lng: 108.2022 },
    },
  ]

  // Mock data lịch sử kiểm tra
  const [checkHistory, setCheckHistory] = useState([
    {
      id: 1,
      orderCode: "DH-2024-001",
      storeName: "Siêu thị BigC Thăng Long",
      storeArea: "Hà Nội",
      checkTime: "2024-01-15T14:30:00",
      result: "success",
      location: "Hà Nội",
      staff: "Nguyễn Văn A",
      notes: "Giao hàng đúng địa chỉ",
    },
    {
      id: 2,
      orderCode: "DH-2024-002",
      storeName: "Cửa hàng Trái cây Sạch ABC",
      storeArea: "TP.HCM",
      checkTime: "2024-01-15T16:45:00",
      result: "error",
      location: "Hà Nội",
      staff: "Trần Thị B",
      notes: "Sai địa điểm giao hàng - đơn TP.HCM nhưng đang ở Hà Nội",
    },
    {
      id: 3,
      orderCode: "DH-2024-003",
      storeName: "Lotte Mart Đà Nẵng",
      storeArea: "Đà Nẵng",
      checkTime: "2024-01-14T11:20:00",
      result: "success",
      location: "Đà Nẵng",
      staff: "Lê Văn C",
      notes: "Kiểm tra thành công",
    },
  ])

  // Thống kê
  const stats = {
    totalChecks: checkHistory.length,
    successChecks: checkHistory.filter((h) => h.result === "success").length,
    errorChecks: checkHistory.filter((h) => h.result === "error").length,
    todayChecks: checkHistory.filter((h) => {
      const today = new Date().toDateString()
      const checkDate = new Date(h.checkTime).toDateString()
      return today === checkDate
    }).length,
  }

  // Khởi tạo Audio Context
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
  }, [])

  // Lấy vị trí hiện tại
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // Giả lập xác định vị trí dựa trên tọa độ
          const location = determineLocationFromCoords(latitude, longitude)
          setCurrentLocation(location)
        },
        (error) => {
          console.error("Error getting location:", error)
          setCurrentLocation("Không xác định")
        },
      )
    }
  }, [])

  const determineLocationFromCoords = (lat, lng) => {
    // Giả lập logic xác định vị trí
    // Trong thực tế có thể dùng reverse geocoding API
    if (lat > 20 && lat < 22 && lng > 105 && lng < 106) return "Hà Nội"
    if (lat > 10 && lat < 11 && lng > 106 && lng < 107) return "TP.HCM"
    if (lat > 15 && lat < 17 && lng > 107 && lng < 109) return "Đà Nẵng"
    return "Khu vực khác"
  }

  // Tạo âm thanh báo hiệu
  const playSound = (type) => {
    if (!soundEnabled || !audioContextRef.current) return

    const audioContext = audioContextRef.current
    const now = audioContext.currentTime

    const createBeep = (frequency, startTime, duration) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, startTime)
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    }

    switch (type) {
      case "success":
        // ✅ ĐÚNG: "BEEP BEEP" (2 tiếng ngắn, cao)
        createBeep(800, now, 0.15) // Beep 1
        createBeep(800, now + 0.2, 0.15) // Beep 2
        break
      case "error":
        // ❌ SAI: "BEEP BEEP BEEP" (3 tiếng dài, thấp)
        createBeep(300, now, 0.4) // Beep 1
        createBeep(300, now + 0.5, 0.4) // Beep 2
        createBeep(300, now + 1.0, 0.4) // Beep 3
        break
      case "warning":
        // ❓ LỖI: "BEEP" (1 tiếng thấp)
        createBeep(400, now, 0.3)
        break
      default:
        break
    }
  }

  const handleQRScan = (qrData) => {
    try {
      const orderData = JSON.parse(qrData)

      if (orderData.type !== "ORDER") {
        throw new Error("QR code không phải là đơn hàng")
      }

      setScanResult(orderData)

      // Thực hiện kiểm tra
      const result = verifyDelivery(orderData)
      setVerificationResult(result)

      // Phát âm thanh
      playSound(result.status)

      // Ghi log
      addToHistory(orderData, result)

      // Hiển thị kết quả
      setShowScannerModal(false)
      setShowResultModal(true)
    } catch (error) {
      console.error("Error parsing QR code:", error)
      playSound("warning")
      alert("QR code không hợp lệ hoặc không thể đọc được!")
    }
  }

  const verifyDelivery = (orderData) => {
    const targetStore = stores.find((store) => store.id === orderData.storeId)

    if (!targetStore) {
      return {
        status: "warning",
        message: "Không tìm thấy thông tin cửa hàng",
        details: {
          orderStore: "Không xác định",
          currentLocation: currentLocation,
          match: false,
        },
      }
    }

    const isLocationMatch = targetStore.area === currentLocation
    const status = isLocationMatch ? "success" : "error"
    const message = isLocationMatch ? "✅ Đúng địa điểm giao hàng!" : "❌ Sai địa điểm giao hàng!"

    return {
      status,
      message,
      details: {
        orderStore: targetStore.name,
        orderArea: targetStore.area,
        currentLocation: currentLocation,
        match: isLocationMatch,
        distance: calculateDistance(targetStore.area, currentLocation),
      },
    }
  }

  const calculateDistance = (targetArea, currentArea) => {
    if (targetArea === currentArea) return 0
    // Giả lập tính khoảng cách
    const distances = {
      "Hà Nội-TP.HCM": 1700,
      "Hà Nội-Đà Nẵng": 800,
      "TP.HCM-Đà Nẵng": 900,
    }
    const key = `${targetArea}-${currentArea}`
    const reverseKey = `${currentArea}-${targetArea}`
    return distances[key] || distances[reverseKey] || 0
  }

  const addToHistory = (orderData, result) => {
    const newRecord = {
      id: Date.now(),
      orderCode: orderData.orderCode,
      storeName: orderData.storeName,
      storeArea: orderData.storeArea,
      checkTime: new Date().toISOString(),
      result: result.status,
      location: currentLocation,
      staff: "Nhân viên hiện tại", // Trong thực tế lấy từ auth context
      notes: result.message,
    }

    setCheckHistory((prev) => [newRecord, ...prev])
  }

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

  return (
    <div className="kiem-tra-giao-hang">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kiểm tra giao hàng</h1>
          <p className="page-subtitle">Quét QR code và xác minh địa điểm giao hàng</p>
        </div>
        <div className="header-actions">
          <div className="location-info">
            <MapPin size={16} />
            <span>Vị trí hiện tại: {currentLocation}</span>
          </div>
          <button
            className={`btn ${soundEnabled ? "btn-success" : "btn-secondary"}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            <Volume2 size={16} />
            {soundEnabled ? "Âm thanh: BẬT" : "Âm thanh: TẮT"}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === "quet-qr" ? "active" : ""}`}
          onClick={() => setActiveTab("quet-qr")}
        >
          <QrCode size={16} />
          Quét QR Code
        </button>
        <button
          className={`tab-btn ${activeTab === "lich-su" ? "active" : ""}`}
          onClick={() => setActiveTab("lich-su")}
        >
          <Clock size={16} />
          Lịch sử kiểm tra
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} style={{ color: "#17a2b8" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalChecks}</div>
            <div className="stat-label">Tổng kiểm tra</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={24} style={{ color: "#28a745" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.successChecks}</div>
            <div className="stat-label">Thành công</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <AlertTriangle size={24} style={{ color: "#dc3545" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.errorChecks}</div>
            <div className="stat-label">Lỗi</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} style={{ color: "#00FF33" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.todayChecks}</div>
            <div className="stat-label">Hôm nay</div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "quet-qr" && (
        <div className="scan-section">
          <div className="scan-container card">
            <div className="card-header">
              <h3 className="card-title">Quét QR Code đơn hàng</h3>
              <p className="card-subtitle">Quét mã QR trên đơn hàng để kiểm tra địa điểm giao hàng</p>
            </div>
            <div className="card-body">
              <div className="scan-area">
                <div className="scan-placeholder">
                  <QrCode size={80} />
                  <h4>Sẵn sàng quét QR Code</h4>
                  <p>Nhấn nút bên dưới để bắt đầu quét mã QR trên đơn hàng</p>
                  <button className="btn btn-primary btn-large" onClick={() => setShowScannerModal(true)}>
                    <Camera size={20} />
                    Bắt đầu quét QR
                  </button>
                </div>
              </div>

              <div className="scan-instructions">
                <h4>Hướng dẫn sử dụng:</h4>
                <ol>
                  <li>Đảm bảo bạn đang ở đúng địa điểm giao hàng</li>
                  <li>Nhấn "Bắt đầu quét QR" và cho phép truy cập camera</li>
                  <li>Đưa camera về phía mã QR trên đơn hàng</li>
                  <li>Chờ hệ thống tự động nhận diện và kiểm tra</li>
                  <li>Nghe âm thanh báo hiệu kết quả kiểm tra</li>
                </ol>
              </div>

              <div className="sound-guide">
                <h4>Âm thanh báo hiệu:</h4>
                <div className="sound-items">
                  <div className="sound-item success">
                    <CheckCircle size={16} />
                    <span>ĐÚNG: 2 tiếng ngắn, cao</span>
                    <button className="btn btn-sm btn-success" onClick={() => playSound("success")}>
                      Nghe thử
                    </button>
                  </div>
                  <div className="sound-item error">
                    <AlertTriangle size={16} />
                    <span>SAI: 3 tiếng dài, thấp</span>
                    <button className="btn btn-sm btn-danger" onClick={() => playSound("error")}>
                      Nghe thử
                    </button>
                  </div>
                  <div className="sound-item warning">
                    <AlertTriangle size={16} />
                    <span>LỖI: 1 tiếng thấp</span>
                    <button className="btn btn-sm btn-warning" onClick={() => playSound("warning")}>
                      Nghe thử
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "lich-su" && (
        <div className="history-section">
          <div className="history-table card">
            <div className="card-header">
              <h3 className="card-title">Lịch sử kiểm tra ({checkHistory.length})</h3>
              <button className="btn btn-secondary" onClick={() => setShowHistoryModal(true)}>
                Xem chi tiết
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mã đơn hàng</th>
                      <th>Cửa hàng</th>
                      <th>Thời gian</th>
                      <th>Vị trí kiểm tra</th>
                      <th>Kết quả</th>
                      <th>Nhân viên</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkHistory.slice(0, 10).map((record) => (
                      <tr key={record.id}>
                        <td>
                          <span className="order-code">{record.orderCode}</span>
                        </td>
                        <td>
                          <div className="store-info">
                            <span className="store-name">{record.storeName}</span>
                            <span className="store-area">{record.storeArea}</span>
                          </div>
                        </td>
                        <td className="time-cell">{new Date(record.checkTime).toLocaleString("vi-VN")}</td>
                        <td className="location-cell">{record.location}</td>
                        <td>{getStatusBadge(record.result)}</td>
                        <td className="staff-cell">{record.staff}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showScannerModal} onClose={() => setShowScannerModal(false)} title="Quét QR Code">
        <QRScanner onScan={handleQRScan} onClose={() => setShowScannerModal(false)} />
      </Modal>

      <Modal isOpen={showResultModal} onClose={() => setShowResultModal(false)} title="Kết quả kiểm tra">
        {verificationResult && (
          <KetQuaKiemTra
            scanResult={scanResult}
            verificationResult={verificationResult}
            onClose={() => setShowResultModal(false)}
          />
        )}
      </Modal>

      <Modal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} title="Lịch sử kiểm tra chi tiết">
        <LichSuKiemTra checkHistory={checkHistory} onClose={() => setShowHistoryModal(false)} />
      </Modal>
    </div>
  )
}

export default KiemTraGiaoHang
