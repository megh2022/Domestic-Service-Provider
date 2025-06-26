import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';

function ServiceDescription() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [similarServices, setSimilarServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/services/${id}`);
        setService(res.data.service);
        setSimilarServices(res.data.similarServices);
      } catch (err) {
        console.error('Error fetching service:', err);
        alert('Error fetching service details');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!service) return <p className="text-center mt-8">Service not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{service.name}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Service Details</h2>
        <p className="text-gray-700 mb-2"><strong>Category:</strong> {service.category}</p>
        <p className="text-gray-700 mb-2"><strong>Provider:</strong> {service.provider.name}</p>
        <p className="text-gray-700 mb-4"><strong>Description:</strong> {service.description}</p>
        <Link
          to={`/book?category=${encodeURIComponent(service.category)}&providerId=${service.provider._id}`}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          BOOK
        </Link>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Similar Services</h2>
      {similarServices.length === 0 ? (
        <p>No similar services found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {similarServices.map(similarService => (
            <ServiceCard key={similarService._id} service={similarService} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ServiceDescription;