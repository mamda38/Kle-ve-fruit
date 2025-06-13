import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { NotificationProvider } from "./context/NotificationContext"
import Header from "./components/common/Header"
import Sidebar from "./components/common/Sidebar"
import Dashboard from "./pages/Dashboard/Dashboard"
import NhapHang from "./pages/NhapHang/NhapHang"
import TaoDon from "./pages/TaoDon/TaoDon"
import XuatHang from "./pages/XuatHang/XuatHang"
import KiemTraGiaoHang from "./pages/KiemTraGiaoHang/KiemTraGiaoHang"
import QuanLyKho from "./pages/QuanLyKho/QuanLyKho"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="app">
            <Header />
            <div className="app-body">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/nhap-hang" element={<NhapHang />} />
                  <Route path="/nhap-hang/*" element={<NhapHang />} />
                  <Route path="/tao-don/*" element={<TaoDon />} />
                  <Route path="/xuat-hang/*" element={<XuatHang />} />
                  <Route path="/kiem-tra/*" element={<KiemTraGiaoHang />} />
                  <Route path="/quan-ly-kho/*" element={<QuanLyKho />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
