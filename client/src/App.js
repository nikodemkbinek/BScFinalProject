import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [cityInput, setCityInput] = useState("London");
  const [daysInput, setDaysInput] = useState(1);
  const [currency, setCurrency] = useState("USD");

  const exchangeRates = { USD: 1, GBP: 0.79, EUR: 0.92 };
  const currencySymbols = { USD: "$", GBP: "£", EUR: "€" };

  const convertPrice = (priceInUSD) => Math.round(priceInUSD * exchangeRates[currency]);

  const fetchBudget = (city, days) => {
    setError(""); 
    setIsLoading(true); //
    setData(null); 
    
    fetch(`http://localhost:5001/api/budget?city=${city}&days=${days}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Could not fetch data");
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setIsLoading(false); 
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchBudget("London", 1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault(); 
    fetchBudget(cityInput, daysInput);
  };

  const chartData = data ? {
    labels: ['Food', 'Transport', 'Accommodation'],
    datasets: [{
      label: `Cost in ${currency}`,
      data: [convertPrice(data.food), convertPrice(data.transport), convertPrice(data.accommodation)],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverOffset: 4
    }],
  } : null;

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h1 style={{ color: '#2c3e50' }}>🌍 Cost of Travel Tool</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Capital City"
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc', width: '220px' }}
          disabled={isLoading}
        />
        <input 
          type="number" 
          min="1"
          value={daysInput}
          onChange={(e) => setDaysInput(e.target.value)}
          placeholder="Days"
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc', width: '80px' }}
          disabled={isLoading} 
        />
        
        <select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer' }}
          disabled={isLoading}
        >
          <option value="USD">USD ($)</option>
          <option value="GBP">GBP (£)</option>
          <option value="EUR">EUR (€)</option>
        </select>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            backgroundColor: isLoading ? '#95a5a6' : '#27ae60', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: isLoading ? 'not-allowed' : 'pointer', 
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
        >
          {isLoading ? 'Fetching...' : 'Calculate'}
        </button>
      </form>

      {error && (
        <div style={{ color: '#c0392b', marginBottom: '20px', backgroundColor: '#fadbd8', padding: '15px', borderRadius: '10px', display: 'inline-block' }}>
          <h3>❌ {error}</h3>
        </div>
      )}

      {isLoading && !error && (
        <div style={{ marginTop: '50px', color: '#3498db' }}>
          <h2 style={{ animation: 'pulse 1.5s infinite' }}>⏳ Fetching live data...</h2>
          <style>{`
            @keyframes pulse {
              0% { opacity: 0.5; }
              50% { opacity: 1; }
              100% { opacity: 0.5; }
            }
          `}</style>
        </div>
      )}

      {data && !isLoading && !error && (
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
            {data.flag && <img src={data.flag} alt="flag" style={{ width: '60px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />}
            <h2 style={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#34495e', margin: 0 }}>
              {data.city} - {data.days} Day(s)
            </h2>
          </div>
          
          <div style={{ width: '300px', margin: '20px auto' }}>
            <Pie data={chartData} />
          </div>

          <div style={{ textAlign: 'left', display: 'inline-block', marginTop: '20px', fontSize: '18px' }}>
            <p>🍔 <strong>Food:</strong> {currencySymbols[currency]}{convertPrice(data.food)}</p>
            <p>🚌 <strong>Transport:</strong> {currencySymbols[currency]}{convertPrice(data.transport)}</p>
            <p>🏨 <strong>Accommodation:</strong> {currencySymbols[currency]}{convertPrice(data.accommodation)}</p>
            <hr style={{ border: '1px solid #eee' }} />
            <h3 style={{ color: '#27ae60' }}>
              Total Estimate: {currencySymbols[currency]}{convertPrice(data.food + data.transport + data.accommodation)}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;