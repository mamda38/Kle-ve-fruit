// API Endpoints
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"

// App Constants
export const APP_NAME = "Fruit Manager"
export const APP_VERSION = "1.0.0"

// Colors
export const COLORS = {
  PRIMARY: "#00FF33",
  PRIMARY_DARK: "#00CC29",
  PRIMARY_LIGHT: "#33FF5C",
  SUCCESS: "#28a745",
  WARNING: "#ffc107",
  ERROR: "#dc3545",
  INFO: "#17a2b8",
}

// Status
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
}

// Pagination
export const ITEMS_PER_PAGE = 10

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "DD/MM/YYYY",
  DATETIME: "DD/MM/YYYY HH:mm:ss",
  API: "YYYY-MM-DD",
}
