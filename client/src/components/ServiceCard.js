import React from 'react';
import { Link } from 'react-router-dom';

function ServiceCard({ service }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2">{service.name}</h3>
      <p className="text-gray-600 mb-2">Category: {service.category}</p>
      <p className="text-gray-600 mb-4">Provider: {service.provider.name}</p>
      <div className="flex space-x-2">
        <Link
          to={`/book?category=${encodeURIComponent(service.category)}&providerId=${service.provider._id}`}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          BOOK
        </Link>
        <Link
          to={`/service/${service._id}`}
          className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
        >
          MORE...
        </Link>
      </div>
    </div>
  );
}

export default ServiceCard;