import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const [month, setMonth] = useState('12');
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [],
  });

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  useEffect(() => {
    fetchBarData();
  }, [month]);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const fetchBarData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/bar-chart', {
        params: { month },
      });

      const labels = response.data.map((item) => `${item._id} (${item.count})`);
      const data = response.data.map((item) => item.count);

      setBarData({
        labels,
        datasets: [
          {
            label: 'Number of Items',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  return (
    <div style={{ position: 'relative', height: '400px' }}>
      <div className="d-flex align-items-center mb-3">
        <h2 className="mb-0 me-3">Transactions Bar Chart</h2>
        <select
          id="month"
          className="form-select"
          value={month}
          onChange={handleMonthChange}
          style={{ border: 'none', boxShadow: 'none' }}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {barData.datasets.length > 0 ? (
        <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default BarChart;
