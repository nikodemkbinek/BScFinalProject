import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

//chart creation
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  //state management
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  //states
  const [cityInput, setCityInput] = useState("London");
  const [daysInput, setDaysInput] = useState(1);
  const [currency, setCurrency] = useState("USD");

  const exchangeRates = { USD: 1, GBP: 0.79, EUR: 0.92 };
  const currencySymbols = { USD: "$", GBP: "£", EUR: "€" };

  const convertPrice = (priceInUSD) => Math.round(priceInUSD * exchangeRates[currency]);

  //data fetching
  const fetchBudget = (city, days) => {
    setError(""); 
    setIsLoading(true);
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

  //data visualisation
  const chartData = data ? {
    labels: ['Food', 'Transport', 'Accommodation'],
    datasets: [{
      label: `Cost in ${currency}`,
      data: [convertPrice(data.food), convertPrice(data.transport), convertPrice(data.accommodation)],
      backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)'],
      borderColor: ['#fff', '#fff', '#fff'],
      borderWidth: 2,
      hoverOffset: 6
    }],
  } : null;


  //UI implementation
  const glassCardStyle = {
    background: 'rgba(255, 255, 255, 0.75)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
    padding: '30px',
    margin: '0 auto',
    maxWidth: '650px',
    width: '100%'
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", 
      padding: '40px 20px', 
      minHeight: '100vh',
      backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      <div style={{ ...glassCardStyle, marginBottom: '30px', padding: '20px 30px' }}>
        <h1 style={{ color: '#2c3e50', marginTop: '0', textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>
          🌍 Cost of Travel Tool
        </h1>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input 
            type="text" 
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Capital City"
            style={{ padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', width: '200px', outline: 'none' }}
            disabled={isLoading}
          />
          <input 
            type="number" 
            min="1"
            value={daysInput}
            onChange={(e) => setDaysInput(e.target.value)}
            placeholder="Days"
            style={{ padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', width: '80px', outline: 'none' }}
            disabled={isLoading}
          />
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            style={{ padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', outline: 'none' }}
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
              padding: '12px 24px', 
              fontSize: '16px', 
              backgroundColor: isLoading ? '#95a5a6' : '#2980b9', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: isLoading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            {isLoading ? 'Fetching...' : 'Calculate'}
          </button>
        </form>
      </div>

      {error && (
        <div style={{ ...glassCardStyle, backgroundColor: 'rgba(250, 219, 216, 0.9)', color: '#c0392b', marginBottom: '20px', padding: '15px' }}>
          <h3 style={{ margin: 0 }}>❌ {error}</h3>
        </div>
      )}

      {isLoading && !error && (
        <div style={{ ...glassCardStyle, padding: '20px', color: '#2980b9' }}>
          <h2 style={{ animation: 'pulse 1.5s infinite', margin: 0 }}>⏳ Fetching live data...</h2>
          <style>{`@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }`}</style>
        </div>
      )}

      {data && !isLoading && !error && (
        <div style={glassCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
            {data.flag && <img src={data.flag} alt="flag" style={{ width: '60px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />}
            <h2 style={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#2c3e50', margin: 0 }}>
              {data.city} - {data.days} Day(s)
            </h2>
          </div>
          
          <div style={{ width: '320px', margin: '20px auto' }}>
            <Pie data={chartData} />
          </div>

          <div style={{ textAlign: 'left', display: 'inline-block', marginTop: '20px', fontSize: '18px', color: '#34495e' }}>
            <p>🍔 <strong>Food:</strong> {currencySymbols[currency]}{convertPrice(data.food)}</p>
            <p>🚌 <strong>Transport:</strong> {currencySymbols[currency]}{convertPrice(data.transport)}</p>
            <p>🏨 <strong>Accommodation:</strong> {currencySymbols[currency]}{convertPrice(data.accommodation)}</p>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)', margin: '15px 0' }} />
            <h3 style={{ color: '#27ae60', margin: 0 }}>
              Total Estimate: {currencySymbols[currency]}{convertPrice(data.food + data.transport + data.accommodation)}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;