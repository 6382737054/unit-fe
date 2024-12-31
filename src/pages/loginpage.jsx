import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    userType: '',
    userName: '',
    password: '',
    confirmPassword: '',
    DistrictId: '',
    subDistrictId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [Districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  
  const navigate = useNavigate();

  // Fetch Districts
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await api.get('/getDistricts');
        console.log('Districts response:', response.data);
        if (response.data && Array.isArray(response.data.results)) {
          setDistricts(response.data.results);
        } else {
          setDistricts([]);
        }
      } catch (err) {
        console.error('Error fetching Districts:', err);
        setDistricts([]);
      }
    };
    if (formData.userType === 'District') {
      fetchDistricts();
    }
  }, [formData.userType]);

  // Fetch sub-Districts whenever District selection changes
  useEffect(() => {
    const fetchSubDistricts = async () => {
      if (formData.DistrictId) {
        try {
          const response = await api.get(`/getSubDistricts?districtId=${formData.DistrictId}`);
          console.log('SubDistricts response:', response.data);
          if (response.data && Array.isArray(response.data.results)) {
            setSubDistricts(response.data.results);
          } else {
            setSubDistricts([]);
          }
        } catch (err) {
          console.error('Error fetching sub-Districts:', err);
          setSubDistricts([]);
        }
      } else {
        setSubDistricts([]);
      }
    };
    
    if (formData.DistrictId) {
      fetchSubDistricts();
    }
  }, [formData.DistrictId]);
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
      
      let requestBody;
  
      if (formData.userType === 'Admin') {
        requestBody = {
          userType: "Admin",
          userName: formData.userName,
          password: formData.password
        };
      } else if (formData.userType === 'District') {
        requestBody = {
          userType: "District",
          districtId: parseInt(formData.DistrictId),
          subDistrictId: parseInt(formData.subDistrictId),
          userName: formData.userName,
          password: formData.password
        };
      }
      
      console.log('Login Request:', requestBody);
      
      const response = await api.post(endpoint, requestBody);
  
      if (!isLogin) {
        // If registration successful
        setIsLogin(true);
        setError('Registration successful! Please login.');
        // Clear form data
        setFormData({
          userType: '',
          userName: '',
          password: '',
          confirmPassword: '',
          DistrictId: '',
          subDistrictId: ''
        });
      } else if (response.data && response.data.output) {
        // Handle login success
        const userData = response.data.output.data;
        const token = response.data.output.token;
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('UserType', userData.userType);
        localStorage.setItem('token', token);
        
        navigate('/home');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const renderLocationDropdowns = () => {
    if (formData.userType !== 'District') return null;

    return (
      <>
        {/* District Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            District
          </label>
          <select
            value={formData.DistrictId}
            onChange={(e) => setFormData({
              ...formData,
              DistrictId: e.target.value,
              subDistrictId: ''
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select District</option>
            {Districts.map((District) => (
              <option key={District.id} value={District.id}>
                {District.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub District Dropdown - Only show if District is selected */}
        {formData.DistrictId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub District
            </label>
            <select
              value={formData.subDistrictId}
              onChange={(e) => setFormData({
                ...formData,
                subDistrictId: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Select Sub District</option>
              {subDistricts.map((subDistrict) => (
                <option key={subDistrict.id} value={subDistrict.id}>
                  {subDistrict.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-200 via-indigo-500 to-blue-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center space-x-6">
            <img
              src="/images/scoutslogo.png"
              alt="BSG Logo"
              className="h-16 w-16 object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              Bharat Scouts and Guides Tamil Nadu
            </h1>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center px-4 py-8">
        <div className="max-w-3xl w-full flex bg-white rounded-lg shadow-lg overflow-hidden">
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
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Type
                </label>
                <select
                  value={formData.userType}
                  onChange={(e) => setFormData({
                    ...formData,
                    userType: e.target.value,
                    DistrictId: '',
                    subDistrictId: ''
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select User Type</option>
                  <option value="Admin">Admin</option>
                  <option value="District">District</option>
                </select>
              </div>

              {/* Location Dropdowns */}
              {renderLocationDropdowns()}

              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({
                    ...formData,
                    userName: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({
                    ...formData,
                    password: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Confirm Password Field - Only show during registration */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({
                      ...formData,
                      confirmPassword: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              {/* Remember Me and Forgot Password - Only show during login */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Create Account'}
              </button>

              {/* Toggle Login/Register */}
              <div className="text-center text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>

          {/* Decorative SVG Section */}
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