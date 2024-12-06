import React from 'react';

const InvestmentDay = ({ day }) => {
  return (
    (<div className="border-l-4 border-blue-500 pl-4">
      <h4 className="text-lg font-semibold mb-2">{day.date}</h4>
      <ul className="list-disc list-inside">
        {day.items.map((item) => (
          <li key={item.id} className="mb-1">
            <span className="font-medium">{item.name}</span>: {item.description}
          </li>
        ))}
      </ul>
    </div>)
  );
};

export default InvestmentDay;

