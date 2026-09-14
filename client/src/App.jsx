import { useState } from 'react'
import './App.css'

const shops = [
    {id: 1, name: 'Cielito Lindo Cafe', address:'411 Brazos St APT 101, Austin, TX 78701', tags: ['wifi', 'quiet'] },
    {id: 2, name: 'Cafe Creme', address:'710 W Cesar Chavez St, Austin, TX 78701', tags: ['outdoor', 'social']},
    {id: 3, name: 'Mozarts Coffee Roasters', address: '3825 Lake Austin Blvd, Austin, TX 78703', tags: ['wifi', 'scenic']},
  ]
function App() {
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
