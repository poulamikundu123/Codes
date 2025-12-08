// src/pages/MandiPrice.jsx
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  IndianRupee,
  Wheat,
  MapPin,
  BarChart3,
  Navigation,
  Target,
  TrendingUp,
  Calculator,
} from "lucide-react";
import "../styles/MandiPrice.css";

export default function MandiPrice() {
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [locationVisible, setLocationVisible] = useState(false);
  const [priceBtnEnabled, setPriceBtnEnabled] = useState(false);

  const [crop, setCrop] = useState("wheat");
  const [quantity, setQuantity] = useState(10);
  const [transportCost, setTransportCost] = useState(5);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // new UI states
  const [activeTab, setActiveTab] = useState("table"); // "table" | "map"
  const [selectedMandiIndex, setSelectedMandiIndex] = useState(0); // for map/details

  useEffect(() => {
    // whenever results change, default selected mandi = highest profit one if present
    if (results && results.all_mandis && results.all_mandis.length > 0) {
      // try to match highest_profit_mandi by name; else first row
      const bestName = results.highest_profit_mandi?.mandi_name;
      const idx =
        bestName != null
          ? results.all_mandis.findIndex((m) => m.mandi_name === bestName)
          : 0;
      setSelectedMandiIndex(idx >= 0 ? idx : 0);
    }
  }, [results]);

  function detectLocation() {
    setLocationVisible(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLatitude(pos.coords.latitude);
        setUserLongitude(pos.coords.longitude);
        setPriceBtnEnabled(true);
      },
      () => {
        setError("Location detection failed. Please allow location access.");
      }
    );
  }

  async function getPrices() {
    setError(null);

    if (!userLatitude || !userLongitude) {
      setError("Please detect your location first.");
      return;
    }
    if (!crop.trim()) {
      setError("Enter a crop name.");
      return;
    }
    if (isNaN(quantity) || quantity <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }
    if (isNaN(transportCost) || transportCost < 0) {
      setError("Transport cost cannot be negative.");
      return;
    }

    setLoading(true);
    setResults(null);

    const payload = {
      crop,
      quantity_quintal: quantity,
      transport_cost_per_km: transportCost,
      latitude: userLatitude,
      longitude: userLongitude,
      state: "",
    };

    try {
      const res = await fetch("http://localhost:8001/price-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let err = `Server returned ${res.status}`;
        try {
          const json = await res.json();
          if (json.detail) err = json.detail;
        } catch (e) {}
        throw new Error(err);
      }

      const data = await res.json();
      setResults(data);
    } catch (e) {
      setError("Error fetching prices: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  const formatMoney = (num) => {
    if (num == null || isNaN(num)) return "-";
    return Number(num).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const formatDistance = (num) => {
    if (num == null || isNaN(num)) return "-";
    return Number(num).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  const formatPercent = (num) => {
    if (num == null || isNaN(num)) return "-";
    return Number(num).toFixed(2) + "%";
  };

  const bestMandi = results?.highest_profit_mandi || results?.nearest_mandi;
  const selectedMandi =
    results?.all_mandis && results.all_mandis[selectedMandiIndex];

  const expectedRevenue =
    bestMandi && bestMandi.price_per_quintal && quantity
      ? bestMandi.price_per_quintal * quantity
      : null;

  return (
    <div className="mandi-root">
      {/* HEADER BAR */}
      <header className="mandi-header">
        <a href="/dashboard" className="mandi-back" aria-label="back">
          <ArrowLeft />
        </a>

        <div className="mandi-header-icon">
          <IndianRupee />
        </div>

        <div>
          <h1>Smart Crop Advisory - Live Data</h1>
          <p>Real-time mandi prices and profit analysis</p>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="mandi-main">
        {/* LEFT: INPUT CARD – NEW DESIGN */}
        <section className="mandi-left">
          <div className="mandi-card mandi-input-card">
            {/* HEADER */}
            <div className="mandi-input-header">
              <div className="left">
                <div className="icon-box">
                  <Wheat />
                </div>
                <div>
                  <h2>Market Price Calculator</h2>
                  <p>Calculate your best profit margins</p>
                </div>
              </div>

              <div className="live-pill">LIVE</div>
            </div>

            {/* INPUT PARAMETERS */}
            <div className="section-label">
              <span className="dot green"></span>
              INPUT PARAMETERS
            </div>

            <div className="inputs-grid">
              <div className="input-block">
                <label>Crop Type</label>
                <select value={crop} onChange={(e) => setCrop(e.target.value)}>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="cotton">Cotton</option>
                  <option value="bajra">Bajra</option>
                  <option value="corn">Corn</option>
                </select>
              </div>

              <div className="input-block">
                <label>
                  Quantity <span>(quintals)</span>
                </label>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) => setQuantity(+e.target.value)}
                />
              </div>

              <div className="input-block">
                <label>
                  Transport Cost <span>(₹/km)</span>
                </label>
                <input
                  type="number"
                  value={transportCost}
                  min="0"
                  onChange={(e) => setTransportCost(+e.target.value)}
                />
              </div>
            </div>

            {/* LOCATION & ANALYSIS */}
            <div className="section-label" style={{ marginTop: "18px" }}>
              <span className="dot blue"></span>
              LOCATION & ANALYSIS
            </div>

            <button className="location-btn" onClick={detectLocation}>
              <MapPin /> Detect My Location
            </button>

            {locationVisible && (
              <div className="location-box">
                <div className="location-title">
                  <Navigation />
                  <span>Location Detected Successfully</span>
                </div>

                <div className="coords">
                  {userLatitude?.toFixed(4)}°N,&nbsp;
                  {userLongitude?.toFixed(4)}°E
                </div>
                <div className="city">Siliguri, West Bengal</div>
              </div>
            )}

            <button
              className="get-prices-btn"
              onClick={getPrices}
              disabled={!priceBtnEnabled || loading}
            >
              <TrendingUp />
              {loading ? "Fetching..." : "GET MANDI PRICES"}
            </button>
          </div>
        </section>

        {/* RIGHT: RESULTS / PANELS – UNCHANGED FROM YOUR VERSION */}
        <section className="mandi-right">
          {/* ERROR PANEL */}
          {error && (
            <div className="mandi-card error-panel">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* PLACEHOLDER WHEN NO RESULTS */}
          {!results && !error && (
            <div className="mandi-card info-panel">
              <h2>Results will appear here</h2>
              <p>
                Detect your location and click{" "}
                <strong>&quot;Get Mandi Prices&quot;</strong> to view the best
                mandi recommendations, detailed table, and map view.
              </p>
            </div>
          )}

          {/* BEST MANDI / SUMMARY CARD */}
          <div className="mandi-card mandi-best-card">
            <div className="mandi-best-header">
              <div className="mandi-best-title">
                <span className="mandi-best-icon">🏆</span>
                <span>Best Mandi Recommendation</span>
              </div>
            </div>

            {bestMandi && (
              <>
                <div className="mandi-best-subheader">
                  <span className="mandi-badge-primary">Most Profitable</span>
                </div>

                <div className="mandi-best-grid">
                  <div className="mandi-best-main">
                    <h4>{bestMandi.mandi_name}</h4>
                    <p className="mandi-best-location">West Bengal</p>

                    <div className="mandi-best-stats">
                      <div className="stat-box stat-price">
                        <span className="stat-label">₹ Price/Quintal</span>
                        <span className="stat-value">
                          ₹{formatMoney(bestMandi.price_per_quintal)}
                        </span>
                      </div>
                      <div className="stat-box stat-distance">
                        <span className="stat-label">📍 Distance</span>
                        <span className="stat-value">
                          {formatDistance(bestMandi.distance_km)} km
                        </span>
                      </div>
                      <div className="stat-box stat-net">
                        <span className="stat-label">₹ Net Profit</span>
                        <span className="stat-value">
                          ₹{formatMoney(bestMandi.net_profit)}
                        </span>
                      </div>
                      <div className="stat-box stat-profitability">
                        <span className="stat-label">📈 Profitability</span>
                        <span className="stat-value stat-profit">
                          {formatPercent(bestMandi.profitability)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mandi-best-revenue">
                    <div className="revenue-label">🎯 Expected Revenue</div>
                    <div className="revenue-value">
                      ₹{expectedRevenue ? formatMoney(expectedRevenue) : "-"}
                    </div>
                    <div className="revenue-sub">
                      for {quantity} quintals of {crop}
                    </div>
                  </div>
                </div>

                <div className="mandi-best-footer">
                  <span className="footer-icon">⭐</span>
                  <span>Recommended for maximum profit with optimal distance</span>
                </div>
              </>
            )}
          </div>

          {/* WHEN RESULTS ARE AVAILABLE */}
          {results && (
            <>
              {/* TABS: TABLE / MAP + SIDE INSIGHTS */}
              <div className="mandi-results-wrapper">
                <div className="mandi-card mandi-results-card">
                  {/* Tabs */}
                  <div className="mandi-tabs">
                    <button
                      type="button"
                      className={
                        "mandi-tab-btn " +
                        (activeTab === "table" ? "mandi-tab-active" : "")
                      }
                      onClick={() => setActiveTab("table")}
                    >
                      <Calculator />
                      <span>Table View</span>
                    </button>
                    <button
                      type="button"
                      className={
                        "mandi-tab-btn " +
                        (activeTab === "map" ? "mandi-tab-active" : "")
                      }
                      onClick={() => setActiveTab("map")}
                    >
                      <Target />
                      <span>Map View</span>
                    </button>
                  </div>

                  {/* Tab content */}
                  {activeTab === "table" && (
                    <div className="mandi-table-wrapper">
                      <div className="mandi-table-header">
                        <MapPin />
                        <span>All Mandis (Top {results.all_mandis.length})</span>
                      </div>

                      <div className="mandi-table-scroll">
                        <table className="mandi-table">
                          <thead>
                            <tr>
                              <th>Rank</th>
                              <th>Mandi Name</th>
                              <th>
                                <span className="th-icon">₹</span> Price/Quintal
                              </th>
                              <th>
                                <span className="th-icon">📍</span> Distance
                              </th>
                              <th>
                                <span className="th-icon">₹</span> Net Profit
                              </th>
                              <th>
                                <span className="th-icon">📈</span> Profitability
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.all_mandis.map((m, index) => {
                              const isTop = index === 0; // highlight first row like screenshot

                              return (
                                <tr
                                  key={index}
                                  className={
                                    "mandi-row" +
                                    (isTop ? " mandi-row-highlight" : "")
                                  }
                                >
                                  {/* Rank chip */}
                                  <td>
                                    <span
                                      className={
                                        "rank-pill " +
                                        (index === 0
                                          ? "rank-1"
                                          : index === 1
                                          ? "rank-2"
                                          : index === 2
                                          ? "rank-3"
                                          : "rank-default")
                                      }
                                    >
                                      #{index + 1}
                                    </span>
                                  </td>

                                  {/* Name + state */}
                                  <td className="mandi-table-name">
                                    <div>{m.mandi_name}</div>
                                    <span className="mandi-table-sub">
                                      West Bengal
                                    </span>
                                  </td>

                                  <td className="price-cell">
                                    ₹{formatMoney(m.price_per_quintal)}
                                  </td>
                                  <td>{formatDistance(m.distance_km)} km</td>
                                  <td className="profit-cell">
                                    ₹{formatMoney(m.net_profit)}
                                  </td>

                                  {/* Profitability pill */}
                                  <td>
                                    <span className="profit-pill">
                                      {formatPercent(m.profitability)}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === "map" && (
                    <div className="mandi-map-wrapper">
                      <div className="mandi-map-panel">
                        <div className="mandi-map-header">
                          <Navigation />
                          <span>Mandi Locations Map</span>
                        </div>
                        <div className="mandi-map-area">
                          {/* Very lightweight “map” – clickable markers laid out in a grid */}
                          <div className="mandi-map-legend">
                            <span className="legend-dot legend-you" /> Your
                            Location
                            <span className="legend-dot legend-best" /> Best
                            Mandi
                            <span className="legend-dot legend-other" /> Other
                            Mandis
                          </div>
                          <div className="mandi-map-grid">
                            {/* user location marker */}
                            <div className="map-marker you">You</div>

                            {/* we just spread mandis around visually, index-based */}
                            {results.all_mandis.map((m, index) => {
                              const isBest =
                                bestMandi &&
                                m.mandi_name === bestMandi.mandi_name;
                              const isSelected =
                                selectedMandi &&
                                m.mandi_name === selectedMandi.mandi_name;

                              return (
                                <button
                                  key={index}
                                  type="button"
                                  className={
                                    "map-marker mandi " +
                                    (isBest ? "best " : "") +
                                    (isSelected ? "selected" : "")
                                  }
                                  onClick={() => setSelectedMandiIndex(index)}
                                  style={{
                                    // simple pseudo-random positioning using index
                                    top: `${10 + ((index * 13) % 70)}%`,
                                    left: `${15 + ((index * 19) % 70)}%`,
                                  }}
                                >
                                  {m.mandi_name.split(" ")[0]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right side details for selected mandi */}
                      <div className="mandi-map-details">
                        <h3>Mandi Details</h3>
                        {selectedMandi ? (
                          <>
                            <h4>{selectedMandi.mandi_name}</h4>
                            <p className="mandi-best-location">West Bengal</p>

                            <div className="mandi-best-stats details">
                              <div className="stat-box">
                                <span className="stat-label">Price/Quintal</span>
                                <span className="stat-value">
                                  ₹{formatMoney(selectedMandi.price_per_quintal)}
                                </span>
                              </div>
                              <div className="stat-box">
                                <span className="stat-label">Distance</span>
                                <span className="stat-value">
                                  {formatDistance(selectedMandi.distance_km)} km
                                </span>
                              </div>
                              <div className="stat-box">
                                <span className="stat-label">Net Profit</span>
                                <span className="stat-value">
                                  ₹{formatMoney(selectedMandi.net_profit)}
                                </span>
                              </div>
                              <div className="stat-box">
                                <span className="stat-label">Profitability</span>
                                <span className="stat-value stat-profit">
                                  {formatPercent(selectedMandi.profitability)}
                                </span>
                              </div>
                            </div>

                            {(selectedMandi.latitude ||
                              selectedMandi.longitude) && (
                              <p className="mandi-coords">
                                📍 Coordinates:{" "}
                                {selectedMandi.latitude?.toFixed(4)}°N,&nbsp;
                                {selectedMandi.longitude?.toFixed(4)}°E
                              </p>
                            )}
                          </>
                        ) : (
                          <p>Select a mandi marker on the map.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Market Insights card (bottom-right in screenshots) */}
                <div className="mandi-card mandi-insights-card">
                  <h3>Market Insights</h3>
                  <div className="insight-row">
                    <span>Avg. Market Price</span>
                    <span>
                      ₹
                      {results?.all_mandis && results.all_mandis.length
                        ? formatMoney(
                            results.all_mandis.reduce(
                              (sum, m) => sum + (m.price_per_quintal || 0),
                              0
                            ) / results.all_mandis.length
                          )
                        : "-"}
                    </span>
                  </div>
                  <div className="insight-row">
                    <span>Transport Efficiency</span>
                    <span className="insight-badge">Excellent</span>
                  </div>
                  <div className="insight-row">
                    <span>Profit Margin</span>
                    <span className="insight-badge">Excellent</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
