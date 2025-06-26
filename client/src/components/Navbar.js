import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FilterContext } from '../context/FilterContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { setSearchQuery, setCategoryFilter } = useContext(FilterContext);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value || '');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">HomeServices</Link>
        <div className="flex space-x-4 items-center">
          {user && user.role === 'client' && (
            <>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="p-2 pl-10 rounded border w-64"
                />
              </div>
              <select
                onChange={handleCategoryChange}
                className="p-2 rounded border"
              >
                <option value="">All Categories</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Other">Other</option>
              </select>
              <Link to="/book" className="text-white hover:text-gray-200">Book</Link>
              <Link to="/my-bookings" className="text-white hover:text-gray-200">My Bookings</Link>
            </>
          )}
          {user && user.role === 'provider' && (
            <Link to="/provider" className="text-white hover:text-gray-200">Dashboard</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-200">Login</Link>
              <Link to="/register" className="text-white hover:text-gray-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;