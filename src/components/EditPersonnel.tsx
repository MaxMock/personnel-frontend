// src/components/EditPersonnel.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const EditPersonnel: React.FC = () => {
  const [personnelCode, setPersonnelCode] = useState('');
  const [personnelNameTH, setPersonnelNameTH] = useState('');
  const [personnelLastTH, setPersonnelLastTH] = useState('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/Personnel/${id}`)
      .then(response => {
        const personnel = response.data;
        setPersonnelCode(personnel.personnelCode);
        setPersonnelNameTH(personnel.personnelNameTH);
        setPersonnelLastTH(personnel.personnelLastTH);
      })
      .catch(error => console.error('There was an error!', error));
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedPersonnel = {
      personnelCode,
      personnelNameTH,
      personnelLastTH
    };

    axiosInstance.put(`/Personnel/${id}`, updatedPersonnel)
      .then(() => {
        navigate('/');
      })
      .catch(error => console.error('There was an error!', error));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
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
      <Button type="submit" color="primary" variant="contained">Update Personnel</Button>
    </Box>
  );
};

export default EditPersonnel;
