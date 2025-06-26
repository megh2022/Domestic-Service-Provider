import React, { createContext, useState } from 'react';

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  return (
    <FilterContext.Provider value={{ searchQuery, setSearchQuery, categoryFilter, setCategoryFilter }}>
      {children}
    </FilterContext.Provider>
  );
};