import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white py-4 shadow-sm border-b border-gold-200">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-2xl md:text-3xl font-light text-center">
          <span className="font-semibold text-gold-800">Hannie</span> AI Try-On Studio
        </h1>
      </div>
    </header>
  );
};
