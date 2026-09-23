import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../services/api';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    year: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.registerUser(formData);
      toast.success('Registration successful! Logging in...');
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md space-y-6 border border-gray-200">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg" value={formData.password} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" name="phone" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input type="text" name="department" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg" value={formData.department} onChange={handleChange} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input type="text" name="year" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg" value={formData.year} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
