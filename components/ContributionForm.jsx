import React from 'react';

const ContributionForm = ({ investmentDays, onSelect }) => {
  return (
    (<div className="p-4 border-t">
      <h2 className="text-xl font-bold mb-4">Pilih Kontribusi</h2>
      {investmentDays.map((day) => (
        <div key={day.id} className="mb-4">
          <h3 className="font-semibold mb-2">{day.date}</h3>
          {day.items.map((item) => (
            <button
              key={item.id}
              className="block w-full text-left p-2 mb-2 border rounded"
              onClick={() => onSelect(day.id, item.id)}>
              {item.name}
            </button>
          ))}
        </div>
      ))}
    </div>)
  );
};

export default ContributionForm;

