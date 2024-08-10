const express = require('express');

const router = express.Router();

const Controller = require("../Controller/index");

router.get('/transactions', Controller.listTransactions);

router.get('/statistics', Controller.getStatistics);

router.get('/bar-chart', Controller.getBarChartData);

router.get('/pie-chart', Controller.getPieChartData);

router.get('/combined', Controller.getCombinedData);

module.exports = router;
