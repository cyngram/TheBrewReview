import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import logo from "./assets/TheBrewReviewLogo.png";
import { Search, MapPin, Clock } from "lucide-react";
import "./App.css";

const filterOptions = [
  "Cozy",
  "Wifi",
  "Outdoor",
  "Pet-Friendly",
  "Study-Spot",
  "Late Night",
  "Pastries",
];
const sortOptions = ["Rating", "Nearby"];

function StarRating({ rating }) {
  return (
    <span className="stars">
      {"★".repeat(Math.round(rating))}
      {"☆".repeat(5 - Math.round(rating))}
    </span>
  );
}

//component for each shop card in the list
function ShopCard({ shop, onClick }) {
  return (
    <div className="shop-card" onClick={onClick}>
      <div className="shop-card-top">
        <h2>{shop.name}</h2>
        <span className="shop-price">$$</span>
      </div>
      <p className="shop-address">{shop.address}</p>
      <div className="shop-rating-row">
        <StarRating rating={shop.rating} />
        <span className="rating-number">{shop.rating}</span>
      </div>
      <div className="tag-list">
        {shop.tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

//navigate to discover page, filter by tag, sort by rating or nearby, search by name or address
function DiscoverPage({ shops }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortBy, setSortBy] = useState("Rating");
  const [criteria, setCriteria] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRec, setLoadingRec] = useState(false);

  const topRated = [...shops].sort((a, b) => b.rating - a.rating).slice(0, 3);

  const getRecommendation = async () => {
    setLoadingRec(true);
    setRecommendation(null);
    try {
      const res = await fetch(
        "https://thebrewreview.onrender.com/api/recommendations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ criteria }),
        },
      );
      const data = await res.json();
      setRecommendation(data.recommendation);
    } catch (error) {
      setRecommendation("Something went wrong — try again.");
    }
    setLoadingRec(false);
  };

  const filteredShops = shops
    .filter((shop) => {
      const matchesSearch =
        shop.name.toLowerCase().includes(search.toLowerCase()) ||
        shop.address.toLowerCase().includes(search.toLowerCase());

      const filterTag = activeFilter
        ? activeFilter.toLowerCase().replace(/\s+/g, "-")
        : null;
      const matchesFilter = !filterTag || shop.tags.includes(filterTag);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "Rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <>
      <div className="search-section">
        <div className="search-bar">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search cafés, neighbourhoods..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-row">
          <span className="filter-label">Filter:</span>
          {filterOptions.map((option) => (
            <button
              key={option}
              className={`pill ${activeFilter === option ? "pill-active" : ""}`}
              onClick={() =>
                setActiveFilter(activeFilter === option ? null : option)
              }
            >
              {option}
            </button>
          ))}

          <span className="sort-label">Sort:</span>
          {sortOptions.map((option) => (
            <button
              key={option}
              className={`pill ${sortBy === option ? "pill-active" : ""}`}
              onClick={() => setSortBy(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="main-content">
        <div className="shop-list">
          {filteredShops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              onClick={() => navigate(`/shop/${shop.id}`)}
            />
          ))}
          {filteredShops.length === 0 && (
            <p className="no-results">No shops match that filter yet.</p>
          )}
        </div>

        <div className="map-panel">
          <span className="map-label">AUSTIN</span>
          <div className="map-grid">
            {shops.map((shop, i) => (
              <span
                key={shop.id}
                className="map-pin"
                style={{
                  top: `${20 + ((i * 17) % 70)}%`,
                  left: `${15 + ((i * 23) % 70)}%`,
                }}
              >
                ☕
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="nearby-section">
        <span className="nearby-heading">HIGHLY RATED NEARBY</span>
        <div className="nearby-cards">
          {topRated.map((shop) => (
            <div
              key={shop.id}
              className="nearby-card"
              onClick={() => navigate(`/shop/${shop.id}`)}
            >
              <h3>{shop.name}</h3>
              <div className="shop-rating-row">
                <StarRating rating={shop.rating} />
                <span className="rating-number">{shop.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    
      <div className="ai-section">
    <h3>Not sure where to go? Ask AI</h3>
    <div className="ai-input-row">
      <input
        type="text"
        placeholder="e.g. quiet spot with good wifi"
        className="search-input ai-input"
        value={criteria}
        onChange={(e) => setCriteria(e.target.value)}
      />
      <button
        className="btn btn-primary"
        onClick={getRecommendation}
        disabled={loadingRec || !criteria}
      >
        {loadingRec ? "Thinking..." : "Get Recommendation"}
      </button>
    </div>
    {recommendation && (
      <div className="ai-recommendation">
        <button className="ai-dismiss" onClick={() => setRecommendation(null)}>
          ×
        </button>
        {recommendation}
      </div>
    )}
  </div>;
    </>
  );
}

//component for the shop detail page
function ShopDetailPage({ shops }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const shop = shops.find((s) => s.id === Number(id));

  if (!shop) return <p style={{ padding: 32 }}>Loading...</p>;

  return (
    <div className="detail-view">
      <button className="back-link" onClick={() => navigate("/")}>
        &larr; Back to discovery
      </button>

      <div className="detail-card">
        <div className="shop-card-top">
          <h1>{shop.name}</h1>
          <span className="shop-price">$$</span>
        </div>

        <img
          src={`https://mozartscoffee.com/cdn/shop/articles/Mozart_s_in_the_mist.jpg?v=1597794948&width=1600`}
          alt={`${shop.name} placeholder`} height= "500px" width= "auto"
          className="detail-image"
        />

        <p className="shop-address">{shop.address}</p>
        <div className="shop-rating-row">
          <StarRating rating={shop.rating} />
          <span className="rating-number">{shop.rating}</span>
        </div>
        <div className="tag-list">
          {shop.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
        <div className="detail-meta">
          <span className="flex-row">
            <Clock size={16} /> Hours coming soon
          </span>
          <span className="flex-row">
            <MapPin size={16} /> Distance coming soon
          </span>
        </div>
      </div>

      <h2 className="reviews-heading">Reviews</h2>
      <p className="no-reviews">
        No reviews yet — this feature is coming soon.
      </p>
    </div>
  );
}

function App() {
  const [shops, setShops] = useState([]);
  const location = useLocation();
  const isShopDetail = location.pathname.startsWith("/shop/");

  useEffect(() => {
    fetch("https://thebrewreview.onrender.com/api/shops")
      .then((res) => res.json())
      .then((data) => setShops(data));
  }, []);

  return (
    <div className="app">
      <header className="site-header">
        <div className="flex-row header-left">
          <img src={logo} alt="The Brew Review logo" className="logo" />
          <button className="btn btn-text disc">
            {isShopDetail ? "Shop Details" : "Discover"}
          </button>
        </div>
        <div className="flex-row header-right">
          <button className="btn btn-text">Sign in</button>
          <button className="btn btn-primary">Sign up</button>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<DiscoverPage shops={shops} />} />
        <Route path="/shop/:id" element={<ShopDetailPage shops={shops} />} />
      </Routes>
    </div>
  );
}

export default App;
