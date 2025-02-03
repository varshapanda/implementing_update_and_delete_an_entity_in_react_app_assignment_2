import React, { useState, useEffect } from 'react';
import ItemList from './components/ItemList';

const API_URI = `http://${import.meta.env.VITE_API_URI}/doors`;

function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(API_URI);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');
    if (!isConfirmed) return; 
    try {
      const response = await fetch(`${API_URI}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Door List</h1>
      <ItemList items={items} onDelete={deleteItem} />
    </div>
  );
}

export default App;
