import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users,
  Send,
  AlertCircle,
  Building2
} from 'lucide-react';
import api from '../api';

const OfficerRegistrationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    loginId: '',
    districtId: '',
    officers: [
      {
        position: 'District Chief Commissioner',
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      {
        position: 'District Commissioner',
        category: '', // Cub/Bulbul/Scout/Guide/Rover/Ranger
        name: '',
        email: '',
        phone: '',
        address: '',
        adultResource: 'Scout/Guide'
      },
      {
        position: 'Assistant District Commissioner',
        category: 'Scout/Guide',
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      {
        position: 'District Commissioner (Headquarters)',
        category: 'Scout/Guide',
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      {
        position: 'District Secretary',
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      {
        position: 'District Treasurer',
        name: '',
        email: '',
        phone: '',
        address: ''
      }
    ]
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log("Stored user:", storedUser);
    
    if (!storedUser) {
      console.log("No user found in localStorage");
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      console.log("Parsed user data:", userData);
      
      // Check for required fields directly in userData
      if (!userData?.id || !userData?.districtId) {
        console.log("Missing required user data");
        navigate('/login');
        return;
      }

      setFormData(prev => ({
        ...prev,
        loginId: userData.id,
        districtId: userData.districtId
      }));
    } catch (err) {
      console.error('Error parsing user data:', err);
      navigate('/login');
    }
  }, [navigate]);
  const handleChange = (index, field, value) => {
    setFormData(prev => {
      const newOfficers = [...prev.officers];
      newOfficers[index] = {
        ...newOfficers[index],
        [field]: value
      };
      return {
        ...prev,
        officers: newOfficers
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/registerOfficers', formData, {
        headers: {
          'Authorization': token
        }
      });
      
      if (response.data) {
        alert('Officers registered successfully!');
        navigate('/home');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || 'Failed to register officers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderOfficerForm = (officer, index) => (
    <div key={index} className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">{officer.position}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={officer.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {officer.category !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={officer.category}
              onChange={(e) => handleChange(index, 'category', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              <option value="Cub">Cub</option>
              <option value="Bulbul">Bulbul</option>
              <option value="Scout">Scout</option>
              <option value="Guide">Guide</option>
              <option value="Rover">Rover</option>
              <option value="Ranger">Ranger</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={officer.email}
            onChange={(e) => handleChange(index, 'email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={officer.phone}
            onChange={(e) => handleChange(index, 'phone', e.target.value)}
            pattern="[0-9]{10}"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            value={officer.address}
            onChange={(e) => handleChange(index, 'address', e.target.value)}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <Building2 className="h-6 w-6 text-blue-600" />
            District Officials Registration
          </h2>
        </div>

        {formData.officers.map((officer, index) => renderOfficerForm(officer, index))}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-4 bg-gray-50 p-4 rounded-lg shadow-md mt-6">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:bg-blue-400"
          >
            <Send className="h-4 w-4" />
            {loading ? 'Registering...' : 'Register Officers'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfficerRegistrationForm;