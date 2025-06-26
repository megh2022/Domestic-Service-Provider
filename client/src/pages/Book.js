import React from 'react';
import BookingForm from '../components/BookingForm';

function Book() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Book a Service</h1>
      <BookingForm />
    </div>
  );
}

export default Book;