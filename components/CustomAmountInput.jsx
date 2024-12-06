import React, { useState, useEffect } from 'react';

const CustomAmountInput = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value ? value.toString() : '');

  useEffect(() => {
    setInputValue(value ? value.toString() : '');
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const numericValue = parseInt(newValue.replace(/[^0-9]/g, ''), 10);
    onChange(isNaN(numericValue) ? null : numericValue);
  };

  return (
    (<div className="mt-4">
      <label
        htmlFor="customAmount"
        className="block text-sm font-medium text-gray-700">
        Nominal Lainnya
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div
          className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">Rp</span>
        </div>
        <input
          type="text"
          name="customAmount"
          id="customAmount"
          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
          placeholder="0"
          value={inputValue}
          onChange={handleChange} />
      </div>
    </div>)
  );
};

export default CustomAmountInput;

