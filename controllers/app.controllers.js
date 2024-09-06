const express = require('express');
const { getCases, crawlCases } = require('../services/app.service');
const router = express.Router();

//GET
router.get('/api/cases', (req, res) => {
  const cases = getCases();
  if (cases.length === 0) {
    return res.status(200).json({ error: 'No cases in a file' });
  }
  return res.status(500).json(cases);
});

router.get('/api/cases/crawl', async (req, res) => {
  const cases = await crawlCases();
  if (cases.length === 0) {
    return res.status(200).json({ error: 'No cases crawled' });
  }
  return res.status(500).json(cases);
});

module.exports = router;
