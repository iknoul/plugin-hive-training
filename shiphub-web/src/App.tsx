import OrderDetails from './components/OrderDetails.tsx';


export default function App() {
  return (
    <main className="container">
      <div className="header">
        <h1>ShipHub</h1> 
        <p>Welcome to ShipHub! Here are some sample orders:</p>
      </div>

      <div className="content">
        <OrderDetails />
      </div>

    </main>
  )
}