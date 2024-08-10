import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';


const Statistics = () => {
  const [month, setMonth] = useState('12');
  const [statistics, setStatistics] = useState({});

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/statistics', {
        params: { month },
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };
  useEffect(() => {
    fetchStatistics();
  }, [month]);

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
  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div className=''>
      <div className="col-md-6">
        <div className="d-flex align-items-center">
          <h2 className="mb-0 me-3">Statistics</h2>
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
      </div>
      <br />
      <div>Total Sale Amount: {statistics.totalAmount}</div>
      <div>Total Sold Items: {statistics.totalSoldItems}</div>
      <div>Total Not Sold Items: {statistics.totalNotSoldItems}</div>
    </div>
  );
};

export default Statistics;
