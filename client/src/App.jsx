import { useState, useEffect } from 'react'
import logo from './assets/TheBrewReviewLogo.png'
import './App.css'


function App() {
  const [shops, setShops] = useState([]);
  useEffect(() => {
    fetch('https://thebrewreview.onrender.com/api/shops')
    .then((res) => res.json())
    .then((data) => setShops(data));
  }, []);

  return(
    <div className="app">
      <header className="site-header">
        <div className="flex-row header-left">
          <img src={logo} alt="The Brew Review logo" className="logo" />
          <button className="btn tab-active">Discover</button>
        </div>
        <div className="flex-row header-right">
          <button className="btn btn-text">Sign in</button>
          <button className="btn btn-primary">Sign up</button>
        </div>
      </header>

      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon"></span>
        </div>
      </div>

      <p>Find your next coffee shop in Austin</p>

      <div className="shop-list">
        {shops.map((shop) => (
          <div key={shop.id} className="shop-card">
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
