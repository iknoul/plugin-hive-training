import OrderDetails from './pages/OrderDetails.tsx';
import Orders from './pages/Orders.tsx';
import { Routes, Route } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
    <main className="container">
      <div className="header">
        <h1>ShipHub</h1> 
        <p>Welcome to ShipHub! Here are some sample orders:</p>
      </div>

      <div className="content">
        <Routes>
          <Route path="/" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />

          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
        
      </div>

    </main>
  )
}