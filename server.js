/**
 * Importing modules
 * express: create the server
 * axios: make HTTP request to NPI Registry API
 * cors: enable cross-origin requests
 */
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Initialize Express app and define which port server will run on
const app = express();
const port = 5000;

// Enable CORS to allow frontend to communicate with the backend
app.use(cors());

// Route to search healthcare providers
app.get('/api/getProviders', async (req, res) => {
    // Query parameters from request
    const { firstName, lastName, city, state } = req.query;

    // Validating that lastName is provided
    if (!lastName) {
        return res.status(400).json({ error: "Last name is required" });
    }

    try {
        // Construct query parameters for NPI Registry API
        const params = {
            first_name: firstName || '',
            last_name: lastName,
            city: city || '',
            state: state || '',
            limit: 10,
            version: 2.1
        };

        // Making request to NPI Registry API
        const response = await axios.get('https://npiregistry.cms.hhs.gov/api/', { params });

        // Return the data from the NPI Registry API and send to frontend
        res.json(response.data);
    } catch (error) {
        // Sending error and 500 response
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
