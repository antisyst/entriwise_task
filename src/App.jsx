import React, { useEffect, useState } from 'react';

function App() {
  const [csvString, setCSVString] = useState('');

  const ordersArray = [
    { itemId: 1, orderId: 1, date: '2023-08-02' },
    { itemId: 2, orderId: 2, date: '2023-08-04' },
    { itemId: 2, orderId: 3, date: '2023-08-07' },
    { itemId: 3, orderId: 4, date: '2023-08-01' },
  ];

  const itemsArray = [
    { itemId: 1, itemName: 'item1', amount: 10.99, currency: 'CAD' },
    { itemId: 2, itemName: 'item2', amount: 20.99, currency: 'EUR' },
    { itemId: 3, itemName: 'item3', amount: 30.99, currency: 'EUR' },
  ];

  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        const response = await fetch('https://api.exchangerate.host/latest?base=USD');
        const data = await response.json();
        return data.rates;
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return null;
      }
    }

    async function generateCSVString() {
      const exchangeRates = await fetchExchangeRates();

      if (exchangeRates) {
        const mergedData = ordersArray.map(order => {
          const item = itemsArray.find(item => item.itemId === order.itemId);
          const rate = exchangeRates[item.currency];
          const amountInUSD = (item.amount * rate).toFixed(2);
          const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
    
          return {
            itemName: item.itemName,
            orderId: order.orderId,
            orderDate: formattedDate,
            amount: `${amountInUSD} USD` // Append "USD" to the amount
          };
        });
    
        const csvHeaders = 'Item Name,Order ID,Order Date,Amount\n';
        const csvRows = mergedData.map(
          item => `${item.itemName},${item.orderId},${item.orderDate},${item.amount}`
        );
        const csvContent = csvHeaders + csvRows.join('\n');
        setCSVString(csvContent);
      }
    }

    generateCSVString();
  }, []);

  return (
    <div>
      <h1 className='main_content'>CSV Data</h1>
      <pre>{csvString}</pre>
    </div>
  );
}

export default App;
