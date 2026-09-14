import { useState, useEffect } from 'react'
import './App.css'


function App() {
  const [shops, setShops] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3000/api/shops')
    .then((res) => res.json())
    .then((data) => setShops(data));
  }, []);

  return(
    <div className="app">
      <h1>BrewLog</h1>
      <p>Find your next coffee shop in Austin</p>

      <div className="shop-list">
       {shops.map((shop) => (
          <div key={shops.id} className = "shop-card">
            <h2>{shop.name}</h2>
            <p>{shop.address}</p>
            <p>{shop.tags.join(', ')}</p>
            </div>
        ))}
      </div>
    </div>
  )
}
export default App
