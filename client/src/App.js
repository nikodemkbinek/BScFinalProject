import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  // Fetch from your Node.js server
  useEffect(() => {
    fetch('http://localhost:5001/api/budget')
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
      });
  }, []);

  // Set up the Chart
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
      
      {error ? (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <h2>❌ Cannot connect to backend</h2>
          <p>Make sure your Node.js server is running on port 5001!</p>
        </div>
      ) : data ? (
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#34495e' }}>{data.city}</h2>
          
          <div style={{ width: '300px', margin: '20px auto' }}>
            <Pie data={chartData} />
          </div>

          <div style={{ textAlign: 'left', display: 'inline-block', marginTop: '20px', fontSize: '18px' }}>
            <p>🍔 <strong>Food:</strong> ${data.food}</p>
            <p>🚌 <strong>Transport:</strong> ${data.transport}</p>
            <p>🏨 <strong>Accommodation:</strong> ${data.accommodation}</p>
            <hr style={{ border: '1px solid #eee' }} />
            <h3 style={{ color: '#27ae60' }}>Total Estimate: ${data.food + data.transport + data.accommodation}</h3>
          </div>
        </div>
      ) : (
        <h2 style={{ color: '#7f8c8d', marginTop: '50px' }}>⏳ Loading travel data...</h2>
      )}
    </div>
  );
}

export default App;