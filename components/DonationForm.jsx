import React, { useState } from 'react';
import CustomAmountInput from './CustomAmountInput';

const DonationForm = ({ onSubmit }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState(null);

  const predefinedAmounts = [10000, 20000, 50000, 100000];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(null);
  };

  const handleCustomAmountChange = (amount) => {
    setCustomAmount(amount);
    setSelectedAmount(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = customAmount || selectedAmount;
    if (finalAmount) {
      onSubmit(finalAmount);
    }
  };

  return (
    (<form onSubmit={handleSubmit} className="p-4 border-t">
      <h2 className="text-xl font-bold mb-4">Pilih Jumlah Sumbangan</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {predefinedAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            className={`p-2 border rounded ${
              selectedAmount === amount ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
            onClick={() => handleAmountSelect(amount)}>
            Rp {amount.toLocaleString()}
          </button>
        ))}
      </div>
      <CustomAmountInput value={customAmount} onChange={handleCustomAmountChange} />
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 px-4 rounded mt-4"
        disabled={!selectedAmount && !customAmount}>
        Lanjutkan
      </button>
    </form>)
  );
};

export default DonationForm;

