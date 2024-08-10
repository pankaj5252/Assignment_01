import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionsTable from './Components/TransactionsTable';
import Statistics from './Components/Statistics';
import BarChart from './Components/BarChart';
import Pagination from './Components/Pagination';
import { debounce } from 'lodash';

const App = () => {
  const [month, setMonth] = useState('12');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);

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
    fetchTransactions();
  }, [month, search, page]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/transactions', {
        params: {
          month,
          search,
          page,
        },
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

 

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); 
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setPage(1);
  };

  return (
    <div className="App container mt-4">
      <h1 className="text-center mb-4 p-3">Transactions Dashboard</h1>

      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="month" className="form-label">Select Month: </label>
          <select id="month" className="form-select" value={month} onChange={handleMonthChange}>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="search" className="form-label">Search Transactions: </label>
          <input
            type="text"
            id="search"
            className="form-control"
            placeholder="Search transactions"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <TransactionsTable transactions={transactions} />

      <div className="d-flex justify-content-between align-items-center mt-4">
        <span>Page-{page}</span>
        <Pagination page={page} setPage={setPage} />
        <span>Per Page = 10</span>
      </div>


      <div className="row mt-4">
        <div className="col-md-12">
          <Statistics />
        </div>
        <br/>
        <div className="col-md-12">
          <BarChart/>
        </div>
      </div>
    </div>
  );
};

export default App;
