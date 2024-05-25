import React, { useState, memo, useEffect } from 'react';

const Popup = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const popupShown = localStorage.getItem('popupShown');
    if (popupShown) {
      setIsOpen(false);
    }
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('popupShown', 'false');
  };

  const handleBeforeUnload = () => {
    localStorage.removeItem('popupShown');
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md relative">
        <button className="absolute top-4 right-4 text-gray-600 hover:text-red-600" onClick={handleClose}>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">Advertisement</h2>
        <p className="text-lg">This is an advertisement popup.</p>
      </div>
    </div>
  );
};

export default memo(Popup);