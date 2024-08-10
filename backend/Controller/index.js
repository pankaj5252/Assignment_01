const axios = require('axios');
const Transaction = require('../Models/index');

// List transactions with search and pagination
const listTransactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '', month=''} = req.query;
    // Create a query to filter transactions
    const query = {
        dateOfSale: {
            $gte: new Date(`2021-${month}-01`),
            $lt: new Date(`2021-${month}-31`)
        },
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } }
        ]
    };

    try {
        // Fetch transactions with pagination
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));

        // Count total transactions
       const total = await Transaction.countDocuments(query);

        // Send response
        console.log(transactions);
        res.status(200).json({ transactions ,total });
    } catch (error) {
        res.status(500).json({ error: 'Failed to list transactions', details: error.message });
    }
};

// Get statistics for a selected month
const getStatistics = async (req, res) => {
    const { month } = req.query;

    try {
        // Aggregate statistics
        const stats = await Transaction.aggregate([
            {
                $match: {
                    dateOfSale: {
                        $gte: new Date(`2021-${month}-01`),
                        $lt: new Date(`2021-${month}-31`)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$price' },
                    totalSoldItems: { $sum: { $cond: ['$sold', 1, 0] } },
                    totalNotSoldItems: { $sum: { $cond: ['$sold', 0, 1] } }
                }
            }
        ]);

        res.status(200).json(stats[0] || {});
    } catch (error) {
        res.status(500).json({ error: 'Failed to get statistics', details: error.message });
    }
};

// Get bar chart data based on price ranges
const getBarChartData = async (req, res) => {
    const { month } = req.query;

    try {
        // Aggregate data for bar chart
        const barData = await Transaction.aggregate([
            {
                $match: {
                    dateOfSale: {
                        $gte: new Date(`2021-${month}-01`),
                        $lt: new Date(`2021-${month}-31`)
                    }
                }
            },
            {
                $bucket: {
                    groupBy: '$price',
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
                    default: '901-above',
                    output: { count: { $sum: 1 } }
                }
            }
        ]);

        res.status(200).json(barData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get bar chart data', details: error.message });
    }
};

// Get pie chart data based on categories
const getPieChartData = async (req, res) => {
    const { month } = req.query;

    try {
        // Aggregate data for pie chart
        const pieData = await Transaction.aggregate([
            {
                $match: {
                    dateOfSale: {
                        $gte: new Date(`2021-${month}-01`),
                        $lt: new Date(`2021-${month}-31`)
                    }
                }
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json(pieData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get pie chart data', details: error.message });
    }
};

// Combine data from all APIs
const getCombinedData = async (req, res) => {
    const { month } = req.query;

    try {
        // Fetch data from multiple APIs
        const [stats, barData, pieData] = await Promise.all([
            axios.get(`http://localhost:4000/api/statistics?month=${month}`),
            axios.get(`http://localhost:4000/api/bar-chart?month=${month}`),
            axios.get(`http://localhost:4000/api/pie-chart?month=${month}`)
        ]);

        // Send combined response
        res.status(200).json({
            statistics: stats.data,
            barChartData: barData.data,
            pieChartData: pieData.data
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get combined data', details: error.message });
    }
};

module.exports = {
    listTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedData
};
