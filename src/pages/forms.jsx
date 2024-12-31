import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Building2, School, Send, Trash2, 
  Plus, Users, ChevronDown, ChevronUp,
  AlertCircle, ArrowLeft, UserPlus,
  AlertTriangle
} from 'lucide-react';
import SchoolFormsList from './adminview';

// Replace the single MAX_STUDENTS_PER_GROUP constant with this object
const SECTION_LIMITS = {
  bunnyDetails: 20,
  cubsDetails: 24,
  bulbulsDetails: 24,
  scoutsDetails: 32,
  guidesDetails: 32,
  roverDetails: 24,
  rangerDetails: 24
};

const FormsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState([true, false, false, false, false, false, false, false]);
  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState({
    loginId: '',
    districtId: '',
    schoolName: '',
    schoolAddress: '',
    pincode: '',
    schoolEmail: '',
    schoolContactNumber: '',
    bunnyDetails: [{
      masterName: '',
      studentDetails: []
    }],
    cubsDetails: [{
      masterName: '',
      studentDetails: []
    }],
    bulbulsDetails: [{
      masterName: '',
      studentDetails: []
    }],
    scoutsDetails: [{
      masterName: '',
      studentDetails: []
    }],
    guidesDetails: [{
      masterName: '',
      studentDetails: []
    }],
    roverDetails: [{
      masterName: '',
      studentDetails: []
    }],
    rangerDetails: [{
      masterName: '',
      studentDetails: []
    }]
  });
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('UserType'); // Note the capital 'U' in UserType
    console.log("Stored user:", storedUser);
    console.log("User type from localStorage:", storedUserType);
    
    if (!storedUser || !storedToken) {
      console.log("Missing user data or token");
      navigate('/login');
      return;
    }

    // Set the token and userType
    setToken(storedToken);
    setUserType(storedUserType); // This was missing before
  
    try {
      const userData = JSON.parse(storedUser);
      console.log("Parsed user data:", userData);
      
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

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMasterNameChange = (section, groupIndex, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      newData[section][groupIndex].masterName = value;
      return newData;
    });
  };

  const handleStudentDetailsChange = (section, groupIndex, studentIndex, field, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      // If the field being changed is dateOfBirth, calculate age
      if (field === 'dateOfBirth') {
        const dob = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        
        // Adjust age if birthday hasn't occurred this year
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
  
        newData[section][groupIndex].studentDetails[studentIndex] = {
          ...newData[section][groupIndex].studentDetails[studentIndex],
          dateOfBirth: value,
          age: age.toString() // Update both DOB and age
        };
      } else {
        newData[section][groupIndex].studentDetails[studentIndex] = {
          ...newData[section][groupIndex].studentDetails[studentIndex],
          [field]: value
        };
      }
      
      return newData;
    });
  };
  const addNewStudent = (section, groupIndex) => {
    const currentGroup = formData[section][groupIndex];
    const sectionLimit = SECTION_LIMITS[section];
    
    // If current group has reached its section-specific limit
    if (currentGroup.studentDetails.length >= sectionLimit) {
      // Create a new group automatically
      setFormData(prev => ({
        ...prev,
        [section]: [
          ...prev[section],
          {
            masterName: '',
            studentDetails: [{
              studentName: '',
              dateOfBirth: '',
              age: '',
              uidNumber: '',
              fathersName: '',
              ...(section !== 'bunnyDetails' && { standard: '' })
            }]
          }
        ]
      }));
    } else {
      // Add to existing group if less than the limit
      setFormData(prev => {
        const newData = { ...prev };
        newData[section][groupIndex].studentDetails.push({
          studentName: '',
          dateOfBirth: '',
          age: '',
          uidNumber: '',
          fathersName: '',
          ...(section !== 'bunnyDetails' && { standard: '' })
        });
        return newData;
      });
    }
  };
  
  const removeStudent = (section, groupIndex, studentIndex) => {
    setFormData(prev => {
      const newData = { ...prev };
      newData[section][groupIndex].studentDetails.splice(studentIndex, 1);
      
      // Remove group if it's empty and not the last group
      if (newData[section][groupIndex].studentDetails.length === 0 && 
          newData[section].length > 1) {
        newData[section].splice(groupIndex, 1);
      }
      
      return newData;
    });
  };

  const toggleSection = (index) => {
    setExpandedSections(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const renderStudentGroup = (section, groupIndex, sectionKey) => {
    const group = formData[section][groupIndex];
    const isNotBunny = section !== 'bunnyDetails';
    const sectionLimit = SECTION_LIMITS[sectionKey];
    const spotsLeft = sectionLimit - group.studentDetails.length;
  
    return (
      <div key={groupIndex} className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Group {groupIndex + 1}</h4>
            <span className="text-sm text-gray-600">
              {spotsLeft} spots remaining in this group
            </span>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Master Name
            </label>
            <input
              type="text"
              value={group.masterName}
              onChange={(e) => handleMasterNameChange(sectionKey, groupIndex, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
  
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {group.studentDetails.map((student, studentIndex) => (
            <div key={studentIndex} className="flex-shrink-0 w-80 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h5 className="font-medium text-gray-700">Student #{studentIndex + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeStudent(sectionKey, groupIndex, studentIndex)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
  
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={student.studentName}
                    onChange={(e) => handleStudentDetailsChange(sectionKey, groupIndex, studentIndex, 'studentName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={student.dateOfBirth}
                    onChange={(e) => handleStudentDetailsChange(sectionKey, groupIndex, studentIndex, 'dateOfBirth', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
  
                <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Age
  </label>
  <input
    type="number"
    value={student.age}
    readOnly
    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
  />
</div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UID Number
                  </label>
                  <input
                    type="text"
                    value={student.uidNumber}
                    onChange={(e) => handleStudentDetailsChange(sectionKey, groupIndex, studentIndex, 'uidNumber', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    value={student.fathersName}
                    onChange={(e) => handleStudentDetailsChange(sectionKey, groupIndex, studentIndex, 'fathersName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
  
                {isNotBunny && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Standard
                    </label>
                    <input
                      type="text"
                      value={student.standard || ''}
                      onChange={(e) => handleStudentDetailsChange(sectionKey, groupIndex, studentIndex, 'standard', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
  
        
  <button
  type="button"
  onClick={() => addNewStudent(sectionKey, groupIndex)}
  className="flex-shrink-0 w-80 flex flex-col items-center justify-center gap-2 text-blue-600 hover:text-blue-700 p-4 rounded-lg hover:bg-blue-50 border-2 border-dashed border-blue-200"
>
  <UserPlus className="h-6 w-6" />
  <span>Add Student</span>
  {spotsLeft > 0 ? (
    <span className="text-sm text-gray-500">({spotsLeft} spots left in this group)</span>
  ) : (
    <span className="text-sm text-green-600">Adding will create new group</span>
  )}
</button>
                  </div>
      </div>
    );
  };

  const renderStudentSection = (section, title, index) => {
    const groups = formData[section];

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div
          className="flex justify-between items-center mb-4 cursor-pointer"
          onClick={() => toggleSection(index)}
        >
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            {title}
            <span className="text-sm text-gray-500">
              ({groups.reduce((total, group) => total + group.studentDetails.length, 0)} students)
            </span>
          </h3>
          {expandedSections[index] ? <ChevronUp /> : <ChevronDown />}
        </div>

        {expandedSections[index] && (
          <div className="space-y-6">
            {groups.map((_, groupIndex) => renderStudentGroup(section, groupIndex, section))}
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const currentToken = localStorage.getItem('token'); // Get fresh token
    if (!currentToken) {
      setError('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    try {
      const response = await api.post('/registerSchool', formData, {
        headers: {
          'Authorization': `${currentToken}`
        }
      });
      
      if (response.data) {
        alert('School registered successfully!');
        navigate('/home');
      }
    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to register school. Please try again.';
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

// Render admin view if user is admin
if (userType === 'Admin') {
  console.log('Rendering admin view');
  return <SchoolFormsList />;
}

// Check for district access
if (userType !== 'District') {
  console.log('Access denied - User type:', userType);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">Only District and Admin users can access this page.</p>
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50 p-6">
 <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <School className="h-6 w-6 text-blue-600" />
              School Registration Form
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleBasicInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Email
                </label>
                <input
                  type="email"
                  name="schoolEmail"
                  value={formData.schoolEmail}
                  onChange={handleBasicInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="schoolContactNumber"
                  value={formData.schoolContactNumber}
                  onChange={handleBasicInfoChange}
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleBasicInfoChange}
                  pattern="[0-9]{6}"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Address
                </label>
                <textarea
                  name="schoolAddress"
                  value={formData.schoolAddress}
                  onChange={handleBasicInfoChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {renderStudentSection('bunnyDetails', 'Bunny Details', 1)}
          {renderStudentSection('cubsDetails', 'Cubs Details', 2)}
          {renderStudentSection('bulbulsDetails', 'Bulbuls Details', 3)}
          {renderStudentSection('scoutsDetails', 'Scouts Details', 4)}
          {renderStudentSection('guidesDetails', 'Guides Details', 5)}
          {renderStudentSection('roverDetails', 'Rover Details', 6)}
          {renderStudentSection('rangerDetails', 'Ranger Details', 7)}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Form Actions */}
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
              {loading ? 'Registering...' : 'Register School'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default FormsPage;