// src/components/Layout.jsx
import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="layout-container">
      <header>Header</header>
      <main>{children}</main>
      <footer> </footer>
    </div>
  );
}
