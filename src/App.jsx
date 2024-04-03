import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css'

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // If editing, update user
      try {
        await axios.put(`https://jsonplaceholder.typicode.com/users/${editingId}`, formData);
        setUsers(users.map(user => (user.id === editingId ? { ...user, ...formData } : user)));
        setFormData({ name: '', email: '' });
        setEditingId(null);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      // If not editing, create new user
      try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/users', formData);
        setUsers([...users, response.data]);
        setFormData({ name: '', email: '' });
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
  };

  const handleEdit = (id, name, email) => {
    setFormData({ name, email });
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className='container'>
      <div className='head'>
      <h1>User Management</h1>
      <form onSubmit={handleSubmit}>
        <input type="text"
         name="name"
         placeholder="Name" 
         value={formData.name} 
         onChange={handleChange} />
        <input type="email" 
        name="email" 
        placeholder="Email" 
        value={formData.email} 
        onChange={handleChange} />
        <button className="btn btn-primary" type="submit">{editingId ? 'Update User' : 'Add User'}</button>
      </form>
      </div>
        {users.map((user,index) => (
          <div className='card' key={index}>
           <span>Name : {user.name}</span><br/>
           <span>Email : {user.email}</span><br/>
            <button className="btn btn-dark" onClick={() => handleEdit(user.id, user.name, user.email)}>Edit</button>
            <button className="btn btn-light" onClick={() => handleDelete(user.id)}>Delete</button>
          </div>
        ))}
    </div>
  );
}

export default App;