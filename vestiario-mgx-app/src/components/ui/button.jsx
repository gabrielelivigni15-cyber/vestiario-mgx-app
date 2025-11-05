import React from "react";

export function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
