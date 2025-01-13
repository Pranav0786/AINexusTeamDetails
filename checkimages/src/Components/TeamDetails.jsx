import React, { useState, useEffect } from 'react';

const TeamDetails = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeam, setFilteredTeam] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState(null);
  const [presentedCount, setPresentedCount] = useState(0);

  // Fetch all teams initially
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // const response = await fetch('https://ai-nexus-997m.onrender.com/api/v1/teams');
        const response = await fetch('http://localhost:5000/api/v1/teams');
        const data = await response.json();

        if (response.ok) {
          setTeams(data);
        } else {
          setError(data.message); 
        }
      } catch (err) {
        setError('Failed to fetch teams');
      }
    };

    fetchTeams();
  }, []);

  // Filter team based on search
  const handleSearch = () => {
    const team = teams.find((t) => t.teamId === parseInt(searchId));
    setFilteredTeam(team || null);
  };

  // Toggle present status of a team
  const togglePresent = (teamId) => {
    const updatedTeams = teams.map((team) =>
      team.teamId === teamId
        ? { ...team, isPresented: !team.isPresented }
        : team
    );
    setTeams(updatedTeams);

    // Update the presented count
    const newPresentedCount = updatedTeams.filter((team) => team.isPresented).length;
    setPresentedCount(newPresentedCount);
  };

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!teams.length) {
    return (
      <div className='flex flex-col items-center gap-5 mt-4'>
        <p className="text-center font-bold text-gray-500">Loading teams...</p>
        <div className='spinner'></div>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto p-6">
      {/* Search Bar and Count Buttons */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex justify-center items-center space-x-4">
          <input
            type="number"
            placeholder="Enter Team ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={handleSearch}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            Search Team
          </button>
        </div>
        <div className="flex space-x-4">
          <div className="bg-gray-200 p-3 rounded-lg">
            <p>Total Teams: {teams.length}</p>
          </div>
          <div className="bg-blue-500 p-3 rounded-lg text-white">
            <p>Presented: {presentedCount}</p>
          </div>
        </div>
      </div>

      {/* Display filtered team or all teams */}
      {filteredTeam ? (
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <h2 className="text-2xl font-bold">Team ID: {filteredTeam.teamId}</h2>
          <p className="text-lg">Track: {filteredTeam.track}</p>
          <h3 className="text-xl">Users:</h3>
          {filteredTeam.users.map((user, index) => (
            <div key={index} className="space-y-2">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>College: {user.college}</p>
              <p>Phone: {user.phone}</p>
              <img
                src={`data:image/jpeg;base64,${user.image}`}
                alt={user.name}
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
            </div>
          ))}
          <p>Type: {filteredTeam.type}</p>
          <p>Transaction ID: {filteredTeam.transactionId}</p>
          <img
            src={`data:image/jpeg;base64,${filteredTeam.paymentScreenshot}`}
            alt="Payment Screenshot"
            className="w-64 h-64 object-cover rounded-lg shadow-md"
          />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md space-y-4 relative">
                <button
                  onClick={() => togglePresent(team.teamId)}
                  className={`absolute top-4 right-4 p-2 rounded-full ${
                    team.isPresented ? 'bg-green-500' : 'bg-gray-400'
                  } text-white`}
                >
                  {team.isPresented ? 'Unmark' : 'Present'}
                </button>
                <h4 className="text-xl font-bold">Team ID: {team.teamId}</h4>
                <p className="text-lg">Track: {team.track}</p>
                <h5 className="text-lg font-semibold">Users:</h5>
                {team.users.map((user, index) => (
                  <div key={index} className="space-y-2">
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>College: {user.college}</p>
                    <p>Phone: {user.phone}</p>
                    <img
                      src={`data:image/jpeg;base64,${user.image}`}
                      alt={user.name}
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                  </div>
                ))}
                <p>Type: {team.type}</p>
                <p>Transaction ID: {team.transactionId}</p>
                <img
                  src={`data:image/jpeg;base64,${team.paymentScreenshot}`}
                  alt="Payment Screenshot"
                  className="w-64 h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;
