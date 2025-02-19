import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Swal from 'sweetalert2';

interface AddPersonnelDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const AddPersonnelDialog: React.FC<AddPersonnelDialogProps> = ({ open, onClose, onAdd }) => {
  const [personnelCode, setPersonnelCode] = useState('');
  const [personnelNickname, setPersonnelNickname] = useState('');
  const [personnelNameTH, setPersonnelNameTH] = useState('');
  const [personnelLastTH, setPersonnelLastTH] = useState('');
  const [personnelNameEN, setPersonnelNameEN] = useState('');
  const [personnelLastEN, setPersonnelLastEN] = useState('');
  const [errors, setErrors] = useState({
    personnelCode: '',
    personnelNickname: '',
    personnelNameTH: '',
    personnelLastTH: '',
    personnelNameEN: '',
    personnelLastEN: ''
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let hasError = false;
    const newErrors = { personnelCode: '', personnelNickname: '', personnelNameTH: '', personnelLastTH: '', personnelNameEN: '', personnelLastEN: '' };

    const thaiPattern = /^[ก-๙\s]+$/;
    const englishPattern = /^[A-Za-z\s]+$/;

    if (!personnelCode) {
      newErrors.personnelCode = 'โปรดกรอกรหัสพนักงาน';
      hasError = true;
    }
    if (!personnelNickname) {
      newErrors.personnelNickname = 'โปรดกรอกชื่อเล่น';
      hasError = true;
    }
    if (!personnelNameTH) {
      newErrors.personnelNameTH = 'โปรดกรอกชื่อภาษาไทย';
      hasError = true;
    } else if (!thaiPattern.test(personnelNameTH)) {
      newErrors.personnelNameTH = 'ชื่อภาษาไทยต้องเป็นภาษาไทยเท่านั้น';
      hasError = true;
    }
    if (!personnelLastTH) {
      newErrors.personnelLastTH = 'โปรดกรอกนามสกุลภาษาไทย';
      hasError = true;
    } else if (!thaiPattern.test(personnelLastTH)) {
      newErrors.personnelLastTH = 'นามสกุลภาษาไทยต้องเป็นภาษาไทยเท่านั้น';
      hasError = true;
    }
    if (!personnelNameEN) {
      newErrors.personnelNameEN = 'โปรดกรอกชื่อภาษาอังกฤษ';
      hasError = true;
    } else if (!englishPattern.test(personnelNameEN)) {
      newErrors.personnelNameEN = 'ชื่อภาษาอังกฤษต้องเป็นภาษาอังกฤษเท่านั้น';
      hasError = true;
    }
    if (!personnelLastEN) {
      newErrors.personnelLastEN = 'โปรดกรอกนามสกุลภาษาอังกฤษ';
      hasError = true;
    } else if (!englishPattern.test(personnelLastEN)) {
      newErrors.personnelLastEN = 'นามสกุลภาษาอังกฤษต้องเป็นภาษาอังกฤษเท่านั้น';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({ personnelCode: '', personnelNickname: '', personnelNameTH: '', personnelLastTH: '', personnelNameEN: '', personnelLastEN: '' });
    const newPersonnel = {
      personnelCode,
      personnelNickname,
      personnelNameTH,
      personnelLastTH,
      personnelNameEN,
      personnelLastEN
    };

    axiosInstance.post('/Personnel', newPersonnel)
      .then(() => {
        Swal.fire({
          title: 'สำเร็จ',
          text: 'บันทึกข้อมูลสำเร็จ',
          icon: 'success',
          customClass: {
            popup: 'swal2-popup'
          }
        });
        onAdd();
        onClose();
      })
      .catch(error => {
        console.error('There was an error!', error);
        Swal.fire('Error', `Failed to add personnel: ${error.response?.data?.message || error.message}`, 'error');
      });
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: keyof typeof errors) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Personnel</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }} noValidate>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="รหัสพนักงาน"
              value={personnelCode || ''}
              onChange={handleInputChange(setPersonnelCode, 'personnelCode')}
              fullWidth
              required
              error={!!errors.personnelCode}
              helperText={errors.personnelCode}
            />
            <TextField
              label="ชื่อเล่น"
              value={personnelNickname || ''}
              onChange={handleInputChange(setPersonnelNickname, 'personnelNickname')}
              fullWidth
              required
              error={!!errors.personnelNickname}
              helperText={errors.personnelNickname}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="ชื่อภาษาไทย"
              value={personnelNameTH || ''}
              onChange={handleInputChange(setPersonnelNameTH, 'personnelNameTH')}
              fullWidth
              required
              error={!!errors.personnelNameTH}
              helperText={errors.personnelNameTH}
            />
            <TextField
              label="นามสกุลภาษาไทย"
              value={personnelLastTH || ''}
              onChange={handleInputChange(setPersonnelLastTH, 'personnelLastTH')}
              fullWidth
              required
              error={!!errors.personnelLastTH}
              helperText={errors.personnelLastTH}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="ชื่อภาษาอังกฤษ"
              value={personnelNameEN || ''}
              onChange={handleInputChange(setPersonnelNameEN, 'personnelNameEN')}
              fullWidth
              required
              error={!!errors.personnelNameEN}
              helperText={errors.personnelNameEN}
            />
            <TextField
              label="นามสกุลภาษาอังกฤษ"
              value={personnelLastEN || ''}
              onChange={handleInputChange(setPersonnelLastEN, 'personnelLastEN')}
              fullWidth
              required
              error={!!errors.personnelLastEN}
              helperText={errors.personnelLastEN}
            />
          </Box>
          <DialogActions>
            <Button variant="contained" onClick={onClose} sx={{ backgroundColor: '#ff7700', color: 'white' }}>กลับ</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#003c99', color: 'white' }}>บันทึก</Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddPersonnelDialog;