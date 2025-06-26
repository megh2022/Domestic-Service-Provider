import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ServiceCard from '../components/ServiceCard';
import { FilterContext } from '../context/FilterContext';

function Home() {
  const { searchQuery, categoryFilter } = useContext(FilterContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/services`,
          {
            params: {
              search: searchQuery || '',
              category: categoryFilter || '',
            }
          }
        );
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services:', err);
        alert('Error fetching services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [searchQuery, categoryFilter]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Services</h1>
      {loading ? (
        <p>Loading services...</p>
      ) : services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map(service => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;