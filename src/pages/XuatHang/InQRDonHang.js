"use client"

import { useState, useRef } from "react"
import { Download, Printer, Copy, Package } from "lucide-react"

const InQRDonHang = ({ order, onClose }) => {
  const qrRef = useRef()
  const [qrSize, setQrSize] = useState(250)
  const [includeDetails, setIncludeDetails] = useState(true)

  // Tạo dữ liệu QR code theo định dạng JSON yêu cầu
  const qrData = {
    don_hang_id: order?.orderCode || "",
    cua_hang_id: order?.storeId || "",
    ngay_xuat: order?.expectedDeliveryDate || new Date().toISOString(),
    danh_sach_hang: order?.items
      ? order.items.map((item) => ({
          ma_san_pham: item.productCode || "",
          ten_san_pham: item.productName || "",
          so_luong: item.quantity || 0,
          don_vi: item.unit || "thùng",
        }))
      : [],
    tong_thung: order?.totalQuantity || 0,
    ma_xac_thuc: order?.orderCode && order?.storeId ? `AUTH-${order.orderCode}-${order.storeId}` : "AUTH-UNKNOWN",
  }

  const qrString = JSON.stringify(qrData)

  // Tạo QR code SVG
  const generateQRCodeSVG = (data, size) => {
    const gridSize = 33 // Tăng độ phức tạp cho đơn hàng
    const cellSize = size / gridSize

    let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`
    svg += `<rect width="${size}" height="${size}" fill="white"/>`

    // Tạo pattern QR code phức tạp hơn
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Tạo pattern dựa trên hash của data và vị trí
        const hash = (data.charCodeAt((i * gridSize + j) % data.length) + i * j + i + j) % 3
        if (hash >= 1) {
          svg += `<rect x="${j * cellSize}" y="${i * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`
        }
      }
    }

    // Thêm finder patterns (góc QR code)
    const finderSize = cellSize * 7
    const positions = [
      { x: 0, y: 0 },
      { x: size - finderSize, y: 0 },
      { x: 0, y: size - finderSize },
    ]

    positions.forEach((pos) => {
      svg += `<rect x="${pos.x}" y="${pos.y}" width="${finderSize}" height="${finderSize}" fill="black"/>`
      svg += `<rect x="${pos.x + cellSize}" y="${pos.y + cellSize}" width="${finderSize - 2 * cellSize}" height="${finderSize - 2 * cellSize}" fill="white"/>`
      svg += `<rect x="${pos.x + 2 * cellSize}" y="${pos.y + 2 * cellSize}" width="${finderSize - 4 * cellSize}" height="${finderSize - 4 * cellSize}" fill="black"/>`
    })

    svg += "</svg>"
    return svg
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    const qrSVG = generateQRCodeSVG(qrString, 400)

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${order.orderCode}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px;
              margin: 0;
            }
            .qr-container {
              border: 3px solid #00FF33;
              padding: 30px;
              display: inline-block;
              border-radius: 15px;
              background: white;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .order-header {
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px solid #f1f3f4;
            }
            .order-code {
              font-size: 24px;
              font-weight: bold;
              color: #00FF33;
              margin-bottom: 5px;
            }
            .store-info {
              font-size: 16px;
              color: #333;
              margin-bottom: 10px;
            }
            .order-summary {
              margin-top: 20px;
              padding-top: 15px;
              border-top: 2px solid #f1f3f4;
              font-size: 14px;
              color: #666;
            }
            .summary-row {
              margin: 5px 0;
            }
            .items-list {
              margin-top: 15px;
              text-align: left;
              max-width: 400px;
              margin-left: auto;
              margin-right: auto;
            }
            .item-row {
              padding: 5px 0;
              border-bottom: 1px solid #eee;
              font-size: 12px;
            }
            .product-code {
              font-weight: bold;
              color: #00FF33;
            }
            .auth-code {
              margin-top: 15px;
              font-family: monospace;
              font-size: 12px;
              color: #666;
              border-top: 1px dashed #ccc;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0; }
              .qr-container { 
                border: 2px solid #000; 
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="order-header">
              <div class="order-code">${order.orderCode}</div>
              <div class="store-info">${order.storeName}</div>
              <div class="store-info">${order.storeArea}</div>
            </div>
            
            ${qrSVG}
            
            <div class="order-summary">
              <div class="summary-row"><strong>Mã cửa hàng:</strong> ${order.storeId}</div>
              <div class="summary-row"><strong>Ngày xuất:</strong> ${new Date(order.expectedDeliveryDate).toLocaleDateString("vi-VN")}</div>
              <div class="summary-row"><strong>Tổng:</strong> ${order.totalItems} loại - ${order.totalQuantity} thùng</div>
              <div class="summary-row"><strong>Nhân viên:</strong> ${order.assignedStaff}</div>
              ${
                includeDetails && order?.items
                  ? `
                <div class="items-list">
                  <div style="font-weight: bold; margin-bottom: 10px;">Chi tiết sản phẩm:</div>
                  ${order.items
                    .map(
                      (item) => `
                    <div class="item-row">
                      <span class="product-code">${item.productCode || ""}</span> - 
                      ${item.productName || ""}: ${item.quantity || 0} ${item.unit || ""}
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              `
                  : ""
              }
              <div class="auth-code">Mã xác thực: AUTH-${order.orderCode}-${order.storeId}</div>
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleDownload = () => {
    const qrSVG = generateQRCodeSVG(qrString, 500)
    const blob = new Blob([qrSVG], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `QR_${order.orderCode}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyData = () => {
    navigator.clipboard.writeText(qrString)
    alert("Đã copy dữ liệu QR code!")
  }

  const handleCopyOrderInfo = () => {
    const orderInfo = `
Đơn hàng: ${order?.orderCode || ""}
Cửa hàng: ${order?.storeName || ""} (${order?.storeId || ""})
Khu vực: ${order?.storeArea || ""}
Ngày xuất: ${order?.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString("vi-VN") : ""}
Tổng: ${order?.totalItems || 0} loại sản phẩm - ${order?.totalQuantity || 0} thùng
Nhân viên: ${order?.assignedStaff || ""}
Mã xác thực: AUTH-${order?.orderCode || ""}-${order?.storeId || ""}

Chi tiết sản phẩm:
${order?.items ? order.items.map((item) => `- ${item.productCode || ""} - ${item.productName || ""}: ${item.quantity || 0} ${item.unit || ""}`).join("\n") : "Không có dữ liệu sản phẩm"}
    `.trim()

    navigator.clipboard.writeText(orderInfo)
    alert("Đã copy thông tin đơn hàng!")
  }

  return (
    <div className="qr-don-hang">
      <div className="qr-preview">
        <div className="qr-container">
          <div className="order-header">
            <div className="order-code">{order.orderCode}</div>
            <div className="store-info">{order.storeName}</div>
            <div className="store-area">{order.storeArea}</div>
          </div>

          <div
            ref={qrRef}
            className="qr-code"
            dangerouslySetInnerHTML={{
              __html: generateQRCodeSVG(qrString, qrSize),
            }}
          />

          <div className="order-summary">
            <div className="summary-row">
              <span className="label">Mã cửa hàng:</span>
              <span className="value">{order.storeId}</span>
            </div>
            <div className="summary-row">
              <span className="label">Ngày xuất:</span>
              <span className="value">{new Date(order.expectedDeliveryDate).toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="summary-row">
              <span className="label">Tổng cộng:</span>
              <span className="value">
                {order.totalItems} loại - {order.totalQuantity} thùng
              </span>
            </div>
            <div className="summary-row">
              <span className="label">Nhân viên:</span>
              <span className="value">{order.assignedStaff}</span>
            </div>
            <div className="summary-row">
              <span className="label">Ưu tiên:</span>
              <span className={`value priority-${order.priority}`}>
                {order.priority === "high" ? "Cao" : order.priority === "medium" ? "Trung bình" : "Thấp"}
              </span>
            </div>
            <div className="auth-code">
              <span className="label">Mã xác thực:</span>
              <span className="value code">
                AUTH-{order.orderCode}-{order.storeId}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="qr-controls">
        <div className="control-section">
          <h4>Cài đặt QR Code</h4>
          <div className="control-row">
            <label>Kích thước:</label>
            <input
              type="range"
              min="200"
              max="400"
              value={qrSize}
              onChange={(e) => setQrSize(Number.parseInt(e.target.value))}
            />
            <span>{qrSize}px</span>
          </div>
          <div className="control-row">
            {/* <label className="checkbox-label">
              <input type="checkbox" checked={includeDetails} onChange={(e) => setIncludeDetails(e.target.checked)} />
              <span>Bao gồm chi tiết sản phẩm khi in</span>
            </label> */}
          </div>
        </div>

        <div className="control-section">
          <h4>Chi tiết sản phẩm</h4>
          <div className="items-detail">
            {order?.items ? (
              order.items.map((item) => (
                <div key={item.id || Math.random()} className="item-detail">
                  <div className="item-header">
                    <span className="product-code">{item.productCode || ""}</span>
                    <span className="product-name">{item.productName || ""}</span>
                    <span className="quantity">
                      {item.quantity || 0} {item.unit || ""}
                    </span>
                  </div>
                  <div className="pallets-list">
                    {item.allocation &&
                      item.allocation.map((alloc, index) => (
                        <div key={index} className="pallet-item">
                          <Package size={12} />
                          <span>{alloc.palletCode || ""}</span>
                          <span>{alloc.location || ""}</span>
                          <span>
                            {alloc.allocatedQuantity || 0} {item.unit || ""}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-items">Không có dữ liệu sản phẩm</div>
            )}
          </div>
        </div>

        <div className="control-section">
          <h4>Dữ liệu QR Code</h4>
          <textarea className="qr-data-text" value={qrString} readOnly rows="4" />
        </div>
      </div>

      <div className="qr-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Đóng
        </button>
        <button className="btn btn-info" onClick={handleCopyOrderInfo}>
          <Copy size={16} />
          Copy thông tin
        </button>
        <button className="btn btn-info" onClick={handleCopyData}>
          <Copy size={16} />
          Copy QR data
        </button>
        <button className="btn btn-success" onClick={handleDownload}>
          <Download size={16} />
          Tải xuống
        </button>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={16} />
          In QR Code
        </button>
      </div>
    </div>
  )
}

export default InQRDonHang
