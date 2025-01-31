const express = require('express');
const path = require('path');
const axios = require('axios');

// Import dotenv and configure it
require('dotenv').config();

const app = express();
const PORT = 3000;

const username = process.env.SAP_DEMO_API_USERNAME;
const password = process.env.SAP_DEMO_API_PASSWORD;
const api_uri = process.env.SAP_BASE_URL;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to fetch headers from the external API
app.get('/api/headers', async (req, res) => {
  try {
    const apiClient = axios.create({
      baseURL: api_uri,
      headers: { 'Content-Type': 'application/json' },
      auth: {
        // username: 'abapcons', // Replace with your username
        username,
        // password: 'Dipl@4321', // Replace with your password
        password,
      },
    });

    const response = await apiClient.get('/zIo_budget');
    res.json(response.data.value || []); // Return headers data
  } catch (error) {
    console.error('Error fetching headers:', error.message);
    res.status(500).json({ error: 'Failed to fetch headers' });
  }
});

// Endpoint to fetch items for a specific header
app.get('/api/items/:headerId', async (req, res) => {
  const { headerId } = req.params;
  try {
    const apiClient = axios.create({
      baseURL: 'https://divhanasrv.diverseinfotech.net:44300/sap/opu/odata4/sap/zio_sb_v4/srvd/sap/zio_srv/0001/',
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: 'abapcons', // Replace with your username
        password: 'Dipl@4321', // Replace with your password
      },
    });

    const response = await apiClient.get(`/zIo_budget_Item?headerId=${headerId}`);
    res.json(response.data.value || []); // Return items data
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
