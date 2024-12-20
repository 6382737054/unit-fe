import React, { useEffect, useState } from 'react';
import { CircleUserRound, Users, School, Baby, Flag, Compass, Mountain, Bird } from 'lucide-react';

const StatsDashboard = () => {
  const [userType, setUserType] = useState('');
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // Get userType from localStorage
    const storedUserType = localStorage.getItem('UserType') || 'District';
    setUserType(storedUserType);

    // Set stats based on userType
    if (storedUserType === 'District') {
      setStats([
        { title: 'Schools', count: 156, icon: School, color: 'blue', trend: '+12%' },
        { title: 'Bunnies', count: 845, icon: Baby, color: 'pink', trend: '+8%' },
        { title: 'Scouts', count: 1234, icon: Flag, color: 'green', trend: '+15%' },
        { title: 'Guides', count: 978, icon: Compass, color: 'purple', trend: '+10%' },
        { title: 'Rangers', count: 456, icon: Mountain, color: 'orange', trend: '+5%' },
        { title: 'Rovers', count: 342, icon: Users, color: 'red', trend: '+7%' },
        { title: 'Cubs', count: 567, icon: CircleUserRound, color: 'yellow', trend: '+9%' },
        { title: 'Bulbuls', count: 789, icon: Bird, color: 'indigo', trend: '+11%' }
      ]);
    } else {
      setStats([
        { title: 'Districts', count: 45, icon: Flag, color: 'blue', trend: '+5%' },
        { title: 'Total Schools', count: 2345, icon: School, color: 'green', trend: '+8%' },
        { title: 'Total Bunnies', count: 12456, icon: Baby, color: 'pink', trend: '+12%' },
        { title: 'Total Scouts', count: 18234, icon: Users, color: 'purple', trend: '+10%' },
        { title: 'Total Guides', count: 15678, icon: Compass, color: 'orange', trend: '+7%' },
        { title: 'Total Rangers', count: 8567, icon: Mountain, color: 'red', trend: '+9%' },
        { title: 'Total Cubs', count: 9876, icon: CircleUserRound, color: 'yellow', trend: '+6%' },
        { title: 'Total Bulbuls', count: 11234, icon: Bird, color: 'indigo', trend: '+8%' }
      ]);
    }
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-10">
     
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {stat.count.toLocaleString()}
                </h3>
              </div>
              <div className={`bg-${stat.color}-100 p-3 rounded-full`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-500">{stat.trend}</span>
              <span className="text-gray-400 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Updates</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </span>
              <div className="ml-4">
                <p className="text-gray-800 font-medium">New Registrations</p>
                <p className="text-gray-500 text-sm">15 new members added today</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <span className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Flag className="w-6 h-6 text-green-600" />
              </span>
              <div className="ml-4">
                <p className="text-gray-800 font-medium">Achievement Milestone</p>
                <p className="text-gray-500 text-sm">Reached 5000+ total members</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center">
              <Users className="w-5 h-5 mr-2" />
              Add Member
            </button>
            <button className="p-4 bg-green-50 rounded-lg text-green-600 hover:bg-green-100 transition-colors flex items-center justify-center">
              <School className="w-5 h-5 mr-2" />
              Add School
            </button>
            <button className="p-4 bg-purple-50 rounded-lg text-purple-600 hover:bg-purple-100 transition-colors flex items-center justify-center">
              <Flag className="w-5 h-5 mr-2" />
              View Reports
            </button>
            <button className="p-4 bg-orange-50 rounded-lg text-orange-600 hover:bg-orange-100 transition-colors flex items-center justify-center">
              <Compass className="w-5 h-5 mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;