// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PersonnelTable from './components/PersonnelTable';
import AddPersonnel from './components/AddPersonnel';
import EditPersonnel from './components/EditPersonnel';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PersonnelTable />} />
        {/* <Route path="/add" element={<AddPersonnel />} />
        <Route path="/edit/:id" element={<EditPersonnel />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
