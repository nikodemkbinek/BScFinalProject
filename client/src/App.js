import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  
  const [cityInput, setCityInput] = useState("London");
  const [daysInput, setDaysInput] = useState(1);


  const fetchBudget = (city, days) => {
    setError("");
    
    fetch(`http://localhost:5001/api/budget?city=${city}&days=${days}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Could not fetch data");
        }
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setData(null);
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
    datasets: [
      {
        label: 'Cost in USD',
        data: [data.food, data.transport, data.accommodation],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverOffset: 4
      },
    ],
  } : null;

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h1 style={{ color: '#2c3e50' }}>🌍 Cost of Travel Tool</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Capital City (e.g., Tokyo, Rome)"
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc', width: '250px' }}
        />
        <input 
          type="number" 
          min="1"
          value={daysInput}
          onChange={(e) => setDaysInput(e.target.value)}
          placeholder="Days"
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc', width: '80px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Calculate
        </button>
      </form>

      {error && (
        <div style={{ color: '#c0392b', marginBottom: '20px', backgroundColor: '#fadbd8', padding: '15px', borderRadius: '10px', display: 'inline-block' }}>
          <h3>❌ {error}</h3>
        </div>
      )}

      {data && !error && (
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
            <p>🍔 <strong>Food:</strong> ${data.food}</p>
            <p>🚌 <strong>Transport:</strong> ${data.transport}</p>
            <p>🏨 <strong>Accommodation:</strong> ${data.accommodation}</p>
            <hr style={{ border: '1px solid #eee' }} />
            <h3 style={{ color: '#27ae60' }}>Total Trip Estimate: ${data.food + data.transport + data.accommodation}</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;