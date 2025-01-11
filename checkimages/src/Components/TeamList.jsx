import React, { useState } from 'react';
import dataset from './dataset';

const TeamList = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State to track search input
  const [filteredTeams, setFilteredTeams] = useState(dataset); // State for filtered list

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Filter the dataset based on teamID
    const filtered = dataset.filter((team) =>
      team.teamID.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTeams(filtered);
  };

  return (
    <div className="p-8 font-sans bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Team List</h2>
      
      {/* Search Input */}
      <div className="mb-8 text-center">
        <input
          type="text"
          placeholder="Search by Team ID"
          value={searchTerm}
          onChange={handleSearch}
          className="p-3 border border-gray-300 rounded-lg w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
            >
              <p className="font-semibold text-lg mb-4">
                <span className="text-gray-600">Team ID:</span> {team.teamID}
              </p>
              <div className="mb-4">
                <img 
                  src={team.user1ID} 
                  alt={`User 1 - ${team.teamID}`} 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                {team.user2ID && (
                  <img 
                    src={team.user2ID} 
                    alt={`User 2 - ${team.teamID}`} 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <img 
                  src={team.paymentScreenshots} 
                  alt={`Payment - ${team.teamID}`} 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No teams found matching your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamList;
