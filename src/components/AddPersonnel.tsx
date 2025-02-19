import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { TextField, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddPersonnel: React.FC = () => {
  const [personnelCode, setPersonnelCode] = useState('');
  const [personnelNameTH, setPersonnelNameTH] = useState('');
  const [personnelLastTH, setPersonnelLastTH] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newPersonnel = {
      personnelCode,
      personnelNameTH,
      personnelLastTH
    };

    axiosInstance.post('/Personnel', newPersonnel)
      .then(() => {
        navigate('/');
      })
      .catch(error => console.error('There was an error!', error));
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <TextField
          label="รหัสพนักงาน"
          value={personnelCode}
          onChange={(e) => setPersonnelCode(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="ชื่อภาษาไทย"
          value={personnelNameTH}
          onChange={(e) => setPersonnelNameTH(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="นามสกุลภาษาไทย"
          value={personnelLastTH}
          onChange={(e) => setPersonnelLastTH(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" color="primary" variant="contained">Add Personnel</Button>
      </Box>
    </Container>
  );
};

export default AddPersonnel;
