import React from 'react'
import { Link } from 'react-router-dom'

export default function Button({ className = '', name, onClick, type = 'button', to }) {
  // 🔹 If "to" is provided → render a <Link>
  if (to) {
    return (
      <Link
        to={to}
        className={`px-4 py-2 rounded-lg transition cursor-pointer ${className}`}
      >
        {name}
      </Link>
    )
  }

  // 🔹 Otherwise → render a regular <button>
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-1 rounded-lg transition-all duration-500 cursor-pointer ${className}`}
    >
      {name}
    </button>
  )
}
