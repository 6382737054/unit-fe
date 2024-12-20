import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    userType: '',
    userName: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
  
    try {
      const endpoint = isLogin ? '/login' : '/loginRegister';
      const { confirmPassword, ...submitData } = formData;
      
      const response = await api.post(endpoint, submitData);
  
      if (response.data) {
        if (isLogin) {
          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem('UserType', response.data.output.data.userType);
          // Store token separately
          localStorage.setItem('token', response.data.output.token);
          navigate('/home');
        }else {
          setIsLogin(true);
          setError('Registration successful! Please login.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-r from-blue-200 via-indigo-500 to-blue-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center space-x-6">
            <img
              src="images/scoutslogo.png"
              alt="BSG Logo"
              className="h-16 w-16 object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              Bharat Scouts and Guides Tamil Nadu
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-8">
        <div className="max-w-3xl w-full flex bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Form Section */}
          <div className="w-full md:w-1/2 px-6 py-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {isLogin ? 'Login to Portal' : 'Create Account'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isLogin ? 'Please enter your credentials to continue' : 'Please fill in the details to register'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                <select
                  value={formData.userType}
                  onChange={(e) => setFormData({...formData, userType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select User Type</option>
                  <option value="admin">Admin</option>
                  <option value="district">District</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-600">Remember me</label>
                  </div>
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </button>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Create Account'}
              </button>

              <div className="text-center text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>

          <div className="hidden md:block md:w-1/2 bg-gray-50 p-12">
  <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Fleur-de-lis (Scout Symbol) */}
    <path d="M200,80 L220,120 L200,160 L180,120 Z" fill="#0F4C81" />
    <path d="M200,120 C210,130 220,150 200,170 C180,150 190,130 200,120" fill="#0F4C81" />
    <path d="M180,130 C160,140 160,160 180,170" stroke="#0F4C81" strokeWidth="2" fill="none" />
    <path d="M220,130 C240,140 240,160 220,170" stroke="#0F4C81" strokeWidth="2" fill="none" />
    
    {/* Tent */}
    <path d="M100,300 L200,180 L300,300 Z" stroke="#333" strokeWidth="2" fill="#F4F4F4" />
    <path d="M180,300 L200,180 L220,300" stroke="#333" strokeWidth="2" fill="#E5E5E5" />
    
    {/* Campfire */}
    <path d="M180,280 L220,280" stroke="#4A5568" strokeWidth="2" />
    <path d="M190,275 C195,265 205,265 210,275" stroke="#ED8936" strokeWidth="2" />
    <path d="M195,270 C200,260 205,260 210,270" stroke="#ED8936" strokeWidth="2" />
    <circle cx="200" cy="280" r="3" fill="#F6AD55" />
    
    {/* Compass */}
    <circle cx="320" cy="120" r="25" stroke="#333" strokeWidth="2" fill="#F4F4F4" />
    <path d="M320,100 L320,140" stroke="#333" strokeWidth="2" />
    <path d="M300,120 L340,120" stroke="#333" strokeWidth="2" />
    <path d="M320,110 L330,120 L320,130 L310,120 Z" fill="#E53E3E" />
    
    {/* Trees */}
    <path d="M80,240 L100,200 L120,240 L100,240 L100,260" stroke="#2F855A" strokeWidth="2" fill="#48BB78" />
    <path d="M320,240 L340,200 L360,240 L340,240 L340,260" stroke="#2F855A" strokeWidth="2" fill="#48BB78" />
    
    {/* Ground */}
    <path d="M40,300 C100,290 300,290 360,300" stroke="#4A5568" strokeWidth="2" />
    
    {/* Stars */}
    <circle cx="150" cy="100" r="2" fill="#4A5568" />
    <circle cx="280" cy="120" r="2" fill="#4A5568" />
    <circle cx="100" cy="150" r="2" fill="#4A5568" />
    <circle cx="330" cy="80" r="2" fill="#4A5568" />
  </svg>
</div>
        </div>
      </div>
    </div>
  );
};

export default Login;