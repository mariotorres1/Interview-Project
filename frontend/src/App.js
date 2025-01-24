/**
 * Import modules
 * React, { useState }: React hooks for managing state
 * axios: making HTTP request to backend
 * App.css: styling
 */
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  // State for storing values of input
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    state: ''
  });

  // State to store search results from backend
  const [results, setResults] = useState([]);
  // State for loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handles changes for form input
  const handleChange = (e) => {

    // Getting name and value
    const { name, value } = e.target;
    // Updating formData
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle search request. Could add more functionality here for improvements
  const handleSearch = async (e) => {
    // Prevents default form submission
    e.preventDefault();

    // Verify lastName is provided
    if (!formData.lastName) {
      alert('Last Name is required');
      return;
    }

    // Update states
    setLoading(true);
    setError('');
    setResults([]);

    try {
      // Making request to backend
      const response = await axios.get('http://localhost:5000/api/getProviders', {
        params: formData
      });
      // Printing results to console and updating results state
      console.log(response.data.results);
      setResults(response.data.results);
    } catch (err) {
      // Catching and updating error state if need be
      setError('An error occurred while fetching the data.');
    } finally {
      // updaing loading state to false
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Healthcare Provider</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name (required)"
          required
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p>{error}</p>}

      <div className="results">
        {results.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>NPI</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>City</th>
                <th>State</th>
                <th>Specialty</th>
              </tr>
            </thead>
            <tbody>
              {results.map((provider, index) => (
                <tr key={index}>
                  <td>{provider.number}</td>
                  <td>{provider.basic.first_name}</td>
                  <td>{provider.basic.last_name}</td>
                  <td>{provider.addresses.map((address, index) => {
                    if (address.address_purpose === 'LOCATION') {
                      return address.city
                    }
                  })} </td>
                  <td>{provider.addresses.map((address, index) => {
                    if (address.address_purpose === 'LOCATION') {
                      return address.state
                    }
                  })} </td>
                  <td>{provider.taxonomies[0].desc || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default App;

