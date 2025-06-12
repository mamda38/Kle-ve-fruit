"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X, Flashlight, RotateCcw } from "lucide-react"

const QRScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState("")
  const [hasFlash, setHasFlash] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const [facingMode, setFacingMode] = useState("environment") // "user" or "environment"
  const streamRef = useRef(null)
  const scanIntervalRef = useRef(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [facingMode])

  const startCamera = async () => {
    try {
      setError("")
      setIsScanning(true)

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()

        // Check if device has flash
        const track = stream.getVideoTracks()[0]
        const capabilities = track.getCapabilities()
        setHasFlash(capabilities.torch === true)

        // Start scanning
        startScanning()
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.")
      setIsScanning(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    setIsScanning(false)
  }

  const startScanning = () => {
    scanIntervalRef.current = setInterval(() => {
      scanQRCode()
    }, 500) // Scan every 500ms
  }

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const qrCode = detectQRCode(imageData)

      if (qrCode) {
        stopCamera()
        onScan(qrCode)
      }
    }
  }

  // Giả lập QR code detection (trong thực tế dùng thư viện như jsQR)
  const detectQRCode = (imageData) => {
    // Giả lập việc phát hiện QR code
    // Trong thực tế sẽ dùng thư viện jsQR hoặc tương tự
    const mockQRData = {
      type: "ORDER",
      orderCode: "DH-2024-001",
      storeId: 1,
      storeName: "Siêu thị BigC Thăng Long",
      storeArea: "Hà Nội",
      orderDate: "2024-01-15",
      expectedDeliveryDate: "2024-01-16",
      totalItems: 3,
      totalQuantity: 270,
      assignedStaff: "Nguyễn Văn A",
      items: [
        {
          productCode: "AP001",
          productName: "Táo Fuji",
          quantity: 120,
          unit: "kg",
        },
      ],
      generatedAt: new Date().toISOString(),
    }

    // Giả lập random detection (30% chance)
    if (Math.random() > 0.7) {
      return JSON.stringify(mockQRData)
    }

    return null
  }

  const toggleFlash = async () => {
    if (!streamRef.current || !hasFlash) return

    try {
      const track = streamRef.current.getVideoTracks()[0]
      await track.applyConstraints({
        advanced: [{ torch: !flashOn }],
      })
      setFlashOn(!flashOn)
    } catch (err) {
      console.error("Error toggling flash:", err)
    }
  }

  const switchCamera = () => {
    setFacingMode(facingMode === "environment" ? "user" : "environment")
  }

  const handleManualInput = () => {
    const qrData = prompt("Nhập dữ liệu QR code thủ công (để test):")
    if (qrData) {
      stopCamera()
      onScan(qrData)
    }
  }

  return (
    <div className="qr-scanner">
      <div className="scanner-header">
        <h4>Quét QR Code đơn hàng</h4>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="scanner-container">
        {error ? (
          <div className="scanner-error">
            <Camera size={48} />
            <p>{error}</p>
            <button className="btn btn-primary" onClick={startCamera}>
              Thử lại
            </button>
          </div>
        ) : (
          <div className="video-container">
            <video ref={videoRef} className="scanner-video" playsInline muted />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Scanning overlay */}
            <div className="scanning-overlay">
              <div className="scan-frame">
                <div className="scan-corners">
                  <div className="corner top-left"></div>
                  <div className="corner top-right"></div>
                  <div className="corner bottom-left"></div>
                  <div className="corner bottom-right"></div>
                </div>
                <div className="scan-line"></div>
              </div>
              <p className="scan-instruction">Đưa QR code vào khung để quét</p>
            </div>

            {/* Controls */}
            <div className="scanner-controls">
              {hasFlash && (
                <button className={`control-btn ${flashOn ? "active" : ""}`} onClick={toggleFlash}>
                  <Flashlight size={20} />
                </button>
              )}
              <button className="control-btn" onClick={switchCamera}>
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="scanner-footer">
        <div className="scanner-status">
          {isScanning ? (
            <div className="scanning-indicator">
              <div className="spinner"></div>
              <span>Đang quét...</span>
            </div>
          ) : (
            <span>Camera đã dừng</span>
          )}
        </div>

        <div className="scanner-actions">
          <button className="btn btn-secondary" onClick={handleManualInput}>
            Nhập thủ công (Test)
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  )
}

export default QRScanner
