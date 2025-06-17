import { Bell, User, Menu } from "lucide-react"
import "./Header.css"

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle">
          <Menu size={20} />
        </button>
        <div className="logo">
        <img src= "./logothado.png" alt="Logo" className="logo-icon" />
          {/* <span className="logo-text">THADOSOFT</span> */}
          
        </div>
      </div>
      <div className="header-center">
        <h1 className="system-title">Quản lý kho</h1>
      </div>
      <div className="header-left">
        {/* <button className="menu-toggle">
          <Menu size={20} />
        </button> */}
        <div className="logo">
        <img src= "./logoclever.png" alt="Logo" className="logo-icon" />
        </div>
      </div>
       {/* <div className="header-right">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-menu">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <span className="user-name">Admin</span>
        </div>
      </div>  */}
    </header>
  )
}

export default Header
