import React, { useState } from 'react';

const Pagination = ({ totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(1);

  const goToPage = (page) => {
    const pageNumber = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(pageNumber);
    setInputPage(pageNumber);
    onPageChange(pageNumber);
  };

  const handleInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handleInputBlur = () => {
    goToPage(Number(inputPage));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      goToPage(Number(inputPage));
    }
  };

  return (
    <div className="pagination">
      <button onClick={() => goToPage(1)} disabled={currentPage === 1}>
        {"<<"}
      </button>
      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
        {"<"}
      </button>
      <span>Page</span>
      <input
        type="number"
        value={inputPage}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyPress={handleKeyPress}
        min="1"
        max={totalPages}
        style={{ width: '40px', textAlign: 'center' }}
      />
      <span> / {totalPages}</span>
      <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
        {">"}
      </button>
      <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
        {">>"}
      </button>
    </div>
  );
};

// Example usage
const App = () => {
  const totalPages = 13;

  const handlePageChange = (pageNumber) => {
    console.log('Current Page:', pageNumber);
  };

  return (
    <div>
      <h1>Pagination Component</h1>
      <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default App;
