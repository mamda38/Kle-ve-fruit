"use client"

import { useState, useRef } from "react"
import { Download, Printer, Copy } from "lucide-react"

const InQRPallet = ({ pallet, onClose }) => {
  const qrRef = useRef()
  const [qrSize, setQrSize] = useState(200)

  // Tạo dữ liệu QR code
  const qrData = {
    palletCode: pallet.palletCode,
    productCode: pallet.productCode,
    productName: pallet.productName,
    quantity: pallet.quantity,
    unit: pallet.unit,
    location: pallet.location,
    expiryDate: pallet.expiryDate,
    importDate: pallet.importDate,
  }

  const qrString = JSON.stringify(qrData)

  // Tạo QR code SVG đơn giản (trong thực tế nên dùng thư viện như qrcode.js)
  const generateQRCodeSVG = (data, size) => {
    // Đây là một QR code giả lập đơn giản
    // Trong thực tế, bạn nên sử dụng thư viện như 'qrcode' hoặc 'qrcode-generator'
    const gridSize = 25
    const cellSize = size / gridSize

    let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`

    // Tạo pattern QR code giả lập
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Tạo pattern dựa trên hash của data và vị trí
        const hash = (data.charCodeAt((i * gridSize + j) % data.length) + i + j) % 2
        if (hash === 1) {
          svg += `<rect x="${j * cellSize}" y="${i * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`
        }
      }
    }

    svg += "</svg>"
    return svg
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    const qrSVG = generateQRCodeSVG(qrString, 300)

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${pallet.palletCode}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px;
            }
            .qr-container {
              border: 2px solid #00FF33;
              padding: 20px;
              display: inline-block;
              border-radius: 10px;
            }
            .pallet-info {
              margin-top: 15px;
              font-size: 14px;
            }
            .pallet-code {
              font-size: 18px;
              font-weight: bold;
              color: #00FF33;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            ${qrSVG}
            <div class="pallet-info">
              <div class="pallet-code">${pallet.palletCode}</div>
              <div>${pallet.productName}</div>
              <div>${pallet.quantity} ${pallet.unit} - ${pallet.location}</div>
              <div>HSD: ${new Date(pallet.expiryDate).toLocaleDateString("vi-VN")}</div>
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleDownload = () => {
    const qrSVG = generateQRCodeSVG(qrString, 400)
    const blob = new Blob([qrSVG], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `QR_${pallet.palletCode}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyData = () => {
    navigator.clipboard.writeText(qrString)
    alert("Đã copy dữ liệu QR code!")
  }

  return (
    <div className="qr-generator">
      <div className="qr-preview">
        <div className="qr-container">
          <div
            ref={qrRef}
            className="qr-code"
            dangerouslySetInnerHTML={{
              __html: generateQRCodeSVG(qrString, qrSize),
            }}
          />
          <div className="qr-info">
            <div className="pallet-code">{pallet.palletCode}</div>
            <div className="product-name">{pallet.productName}</div>
            <div className="quantity">
              {pallet.quantity} {pallet.unit}
            </div>
            <div className="location">Vị trí: {pallet.location}</div>
            <div className="expiry">HSD: {new Date(pallet.expiryDate).toLocaleDateString("vi-VN")}</div>
          </div>
        </div>
      </div>

      <div className="qr-controls">
        <div className="size-control">
          <label>Kích thước QR:</label>
          <input
            type="range"
            min="150"
            max="300"
            value={qrSize}
            onChange={(e) => setQrSize(Number.parseInt(e.target.value))}
          />
          <span>{qrSize}px</span>
        </div>

        <div className="qr-data">
          <h4>Dữ liệu QR Code:</h4>
          <textarea className="form-input" rows="4" value={qrString} readOnly />
        </div>
      </div>

      <div className="qr-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Đóng
        </button>
        <button className="btn btn-info" onClick={handleCopyData}>
          <Copy size={16} />
          Copy dữ liệu
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

export default InQRPallet
