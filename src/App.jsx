import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import Map from 'components/Map';

import './App.scss';

const App = () => {
  const [content, setContent] = useState('');

  return (
    <div className='App'>
      <Map setContent={setContent} />
      <ReactTooltip>{content}</ReactTooltip>
    </div>
  );
};

export default App;
