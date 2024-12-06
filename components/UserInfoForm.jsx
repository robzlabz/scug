import React, { useState } from 'react';

const UserInfoForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, phoneNumber);
  };

  return (
    (<form onSubmit={handleSubmit} className="p-4 border-t">
      <h2 className="text-xl font-bold mb-4">Informasi Kontributor</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2">Nama</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required />
      </div>
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block mb-2">Nomor WhatsApp</label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-2 border rounded"
          required />
      </div>
      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded w-full">
          Batal
        </button>
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded w-full">
          Kirim
        </button>
      </div>
    </form>)
  );
};

export default UserInfoForm;

