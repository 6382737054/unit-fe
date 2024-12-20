import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  School, 
  Search, 
  Building2,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  GraduationCap
} from 'lucide-react';

const SchoolFormsList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/getAllSchoolForms', {
          headers: { Authorization: token }
        });
        setForms(response.data.results);
      } catch (err) {
        setError('Failed to load school forms');
        console.error('Error fetching forms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalStudents = (form) => {
    const sections = ['bunnyDetails', 'cubsDetails', 'bulbulsDetails', 'scoutsDetails', 'guidesDetails', 'roverDetails', 'rangerDetails'];
    return sections.reduce((total, section) => total + (form[section]?.length || 0), 0);
  };

  const filteredForms = forms.filter(form => 
    form.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.byDistrict.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="text-gray-900 font-medium text-sm">{value}</span>
    </div>
  );

  const StudentsTable = ({ details, type }) => (
    <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-blue-600" />
          {type} ({details.length})
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Student</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Master</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Age</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">DOB</th>
              {details[0]?.studentDetails?.standard !== undefined && (
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Standard</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {details.map((entry, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{entry.studentDetails.studentName}</td>
                <td className="px-4 py-2 text-sm">{entry.masterName}</td>
                <td className="px-4 py-2 text-sm">{entry.studentDetails.age}</td>
                <td className="px-4 py-2 text-sm">{formatDate(entry.studentDetails.dateOfBirth)}</td>
                {entry.studentDetails.standard !== undefined && (
                  <td className="px-4 py-2 text-sm">{entry.studentDetails.standard}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading schools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 ">
              <School className="h-6 w-6 text-blue-600" />
              Registered Schools
            </h1>
          
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* School Cards */}
        <div className="grid gap-6">
          {filteredForms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
            >
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setExpandedCard(expandedCard === form.id ? null : form.id)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-gray-900">{form.schoolName}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {form.byDistrict.name} District
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {getTotalStudents(form)} Students
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(form.createdAt)}
                      </span>
                    </div>
                  </div>
                  {expandedCard === form.id ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </div>
              </div>

              {expandedCard === form.id && (
                <div className="border-t border-gray-200 p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Contact Information</h3>
                      <div className="space-y-2">
                        <DetailRow label="Email" value={form.schoolEmail} />
                        <DetailRow label="Phone" value={form.schoolContactNumber} />
                        <DetailRow label="Address" value={form.schoolAddress} />
                        <DetailRow label="Pincode" value={form.pincode} />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Registration Details</h3>
                      <div className="space-y-2">
                        <DetailRow label="District ID" value={form.byDistrict.distId} />
                        <DetailRow label="Registration Date" value={formatDate(form.createdAt)} />
                        <DetailRow label="Last Updated" value={formatDate(form.updatedAt)} />
                        <DetailRow label="Payment Status" value={form.paymentStatus} />
                      </div>
                    </div>
                  </div>

                  {[
                    { key: 'bunnyDetails', title: 'Bunny' },
                    { key: 'cubsDetails', title: 'Cubs' },
                    { key: 'bulbulsDetails', title: 'Bulbuls' },
                    { key: 'scoutsDetails', title: 'Scouts' },
                    { key: 'guidesDetails', title: 'Guides' },
                    { key: 'roverDetails', title: 'Rover' },
                    { key: 'rangerDetails', title: 'Ranger' }
                  ].map(section => form[section.key]?.length > 0 && (
                    <StudentsTable 
                      key={section.key}
                      details={form[section.key]}
                      type={section.title}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredForms.length === 0 && (
          <div className="text-center py-12">
            <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolFormsList;