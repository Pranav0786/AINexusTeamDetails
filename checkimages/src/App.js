import React from 'react';
import ImageDisplay from './ImageDisplay'; // Adjust the path accordingly
import TeamList from './Components/TeamList';
import TeamDetails from './Components/TeamDetails';

const App = () => {
  return (
    <div>
        {/* <ImageDisplay /> */}
        <TeamList />
        <TeamDetails teamId={2} />
    </div>
  );
};

export default App;
