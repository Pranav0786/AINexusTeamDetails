import React, { useState, useEffect } from 'react';

const TeamDetails = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState(null);
  const [presentedCount, setPresentedCount] = useState(0);
  const [expandedTeam, setExpandedTeam] = useState(null); // Track expanded team

  useEffect(() => {
    const fetchTeamsAndAttendance = async () => {
      try {
        const teamResponse = await fetch('https://ainexusteamdetails.onrender.com/api/v1/teams');
        const attendanceResponse = await fetch('https://ainexusteamdetails.onrender.com/api/v1/attendance');

        const teamData = await teamResponse.json();
        const attendanceData = await attendanceResponse.json();

        if (teamResponse.ok && attendanceResponse.ok) {
          setTeams(teamData);
          setFilteredTeams(teamData);
          const attendanceMap = {};
          attendanceData.forEach((entry) => {
            attendanceMap[entry.teamId] = entry.isPresented;
          });
          setAttendance(attendanceMap);
          setPresentedCount(attendanceData.filter((a) => a.isPresented).length);
        } else {
          setError('Failed to load data');
        }
      } catch (err) {
        setError('Failed to fetch teams or attendance');
      }
    };

    fetchTeamsAndAttendance();
  }, []);

  const handleSearch = () => {
    if (searchId.trim() === '') {
      setFilteredTeams(teams);
    } else {
      const result = teams.filter((team) => team.teamId.toString() === searchId);
      setFilteredTeams(result);
    }
  };

  const togglePresent = async (teamId) => {
    const isPresented = !attendance[teamId];

    try {
      const response = await fetch(`https://ainexusteamdetails.onrender.com/api/v1/attendance/${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPresented }),
      });

      if (response.ok) {
        setAttendance((prev) => ({ ...prev, [teamId]: isPresented }));
        setPresentedCount((prev) => (isPresented ? prev + 1 : prev - 1));
      } else {
        alert('Failed to update attendance');
      }
    } catch (err) {
      alert('Error updating attendance');
    }
  };

  const toggleExpand = (teamId) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!teams.length) {
    return (
      <div className="flex flex-col items-center gap-5 mt-4">
        <p className="text-center font-bold text-gray-500">Loading teams...</p>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8">Attendance Sheet</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div
            key={team.teamId}
            className="bg-white p-6 rounded-lg shadow-md space-y-4 relative cursor-pointer"
            onClick={() => toggleExpand(team.teamId)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePresent(team.teamId);
              }}
              className={`absolute top-4 right-4 p-2 rounded-full ${
                attendance[team.teamId] ? 'bg-green-500' : 'bg-gray-400'
              } text-white`}
            >
              {attendance[team.teamId] ? 'Unmark' : 'Present'}
            </button>
            <h4 className="text-xl font-bold">Team ID: {team.teamId}</h4>

            {expandedTeam === team.teamId && (
              <div className="space-y-4 mt-4">
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDetails;
