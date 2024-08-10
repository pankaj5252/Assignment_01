const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios'); 
const routes = require('./Routes/index');
const DATABASE_URI = 'mongodb+srv://pbkale25:Pankaj5151@cluster0.pr4uyu3.mongodb.net/amazon?retryWrites=true&w=majority&appName=Cluster0';
const Transaction = require('./Models/index');
const cors = require('cors');

const app = express();
app.use(express.json());
const port = 4000;
app.use(cors()); 

mongoose.connect(DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// API to initialize the database with seed data
app.get('/api/init', async (req, res) => {
    try {
      const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      const transactions = response.data;
      console.log(transactions);
  
      await Transaction.deleteMany(); // Clear existing data
      await Transaction.insertMany(transactions);
  
      res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to initialize database', details: error.message });
    }
});

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
