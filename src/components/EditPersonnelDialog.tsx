import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Swal from 'sweetalert2';

interface EditPersonnelDialogProps {
  open: boolean;
  onClose: () => void;
  personnelId: number;
  onEdit: () => void;
}

const EditPersonnelDialog: React.FC<EditPersonnelDialogProps> = ({ open, onClose, personnelId, onEdit }) => {
  const [personnelCode, setPersonnelCode] = useState('');
  const [personnelNickname, setPersonnelNickname] = useState('');
  const [personnelNameTH, setPersonnelNameTH] = useState('');
  const [personnelLastTH, setPersonnelLastTH] = useState('');
  const [personnelNameEN, setPersonnelNameEN] = useState('');
  const [personnelLastEN, setPersonnelLastEN] = useState('');
  const [originalData, setOriginalData] = useState({
    personnelCode: '',
    personnelNickname: '',
    personnelNameTH: '',
    personnelLastTH: '',
    personnelNameEN: '',
    personnelLastEN: ''
  });
  const [errors, setErrors] = useState({
    personnelCode: '',
    personnelNickname: '',
    personnelNameTH: '',
    personnelLastTH: '',
    personnelNameEN: '',
    personnelLastEN: ''
  });

  useEffect(() => {
    if (personnelId) {
      axiosInstance.get(`/Personnel/${personnelId}`)
        .then(response => {
          const { personnelCode, personnelNickname, personnelNameTH, personnelLastTH, personnelNameEN, personnelLastEN } = response.data;
          setPersonnelCode(personnelCode);
          setPersonnelNickname(personnelNickname);
          setPersonnelNameTH(personnelNameTH);
          setPersonnelLastTH(personnelLastTH);
          setPersonnelNameEN(personnelNameEN);
          setPersonnelLastEN(personnelLastEN);
          setOriginalData({ personnelCode, personnelNickname, personnelNameTH, personnelLastTH, personnelNameEN, personnelLastEN });
        })
        .catch(error => console.error('There was an error!', error));
    }
  }, [personnelId]);

  useEffect(() => {
    if (open) {
      setPersonnelCode(originalData.personnelCode);
      setPersonnelNickname(originalData.personnelNickname);
      setPersonnelNameTH(originalData.personnelNameTH);
      setPersonnelLastTH(originalData.personnelLastTH);
      setPersonnelNameEN(originalData.personnelNameEN);
      setPersonnelLastEN(originalData.personnelLastEN);
    }
  }, [open]);

  useEffect(() => {
    if (open && personnelId) {
      axiosInstance.get(`/Personnel/${personnelId}`)
        .then(response => {
          const { personnelCode, personnelNickname, personnelNameTH, personnelLastTH, personnelNameEN, personnelLastEN } = response.data;
          setPersonnelCode(personnelCode);
          setPersonnelNickname(personnelNickname);
          setPersonnelNameTH(personnelNameTH);
          setPersonnelLastTH(personnelLastTH);
          setPersonnelNameEN(personnelNameEN);
          setPersonnelLastEN(personnelLastEN);
          setOriginalData({ personnelCode, personnelNickname, personnelNameTH, personnelLastTH, personnelNameEN, personnelLastEN });
        })
        .catch(error => console.error('There was an error!', error));
    }
  }, [open, personnelId]);

  const handleClose = () => {
    onClose();
  };

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
    const updatedPersonnel = {
      personnelId,
      personnelCode,
      personnelNickname,
      personnelNameTH,
      personnelLastTH,
      personnelNameEN,
      personnelLastEN
    };

    axiosInstance.put(`/Personnel/${personnelId}`, updatedPersonnel)
      .then(() => {
        Swal.fire({
          title: 'สำเร็จ',
          text: 'แก้ไขข้อมูลสำเร็จ',
          icon: 'success',
          customClass: {
            popup: 'swal2-popup'
          }
        });
        onEdit();
        onClose();
      })
      .catch(error => {
        console.error('There was an error!', error);
        Swal.fire('Error', `Failed to edit personnel: ${error.response?.data?.message || error.message}`, 'error');
      });
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: keyof typeof errors) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Personnel</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="รหัสพนักงาน"
              value={personnelCode || ''}
              onChange={handleInputChange(setPersonnelCode, 'personnelCode')}
              fullWidth
              
              error={!!errors.personnelCode}
              helperText={errors.personnelCode}
            />
            <TextField
              label="ชื่อเล่น"
              value={personnelNickname || ''}
              onChange={handleInputChange(setPersonnelNickname, 'personnelNickname')}
              fullWidth
           
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
             
              error={!!errors.personnelNameTH}
              helperText={errors.personnelNameTH}
            />
            <TextField
              label="นามสกุลภาษาไทย"
              value={personnelLastTH || ''}
              onChange={handleInputChange(setPersonnelLastTH, 'personnelLastTH')}
              fullWidth
           
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
             
              error={!!errors.personnelNameEN}
              helperText={errors.personnelNameEN}
            />
            <TextField
              label="นามสกุลภาษาอังกฤษ"
              value={personnelLastEN || ''}
              onChange={handleInputChange(setPersonnelLastEN, 'personnelLastEN')}
              fullWidth
          
              error={!!errors.personnelLastEN}
              helperText={errors.personnelLastEN}
            />
          </Box>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">กลับ</Button>
            <Button type="submit" color="primary" variant="contained">บันทึก</Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditPersonnelDialog;
