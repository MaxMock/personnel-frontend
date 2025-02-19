import React, { useEffect, useState, lazy, Suspense } from 'react';
import axiosInstance from '../axiosInstance';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Container, TextField, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination } from '@mui/material';
import Swal from 'sweetalert2';

const AddPersonnelDialog = lazy(() => import('./AddPersonnelDialog'));
const EditPersonnelDialog = lazy(() => import('./EditPersonnelDialog'));

interface Personnel {
  personnelId: number;
  personnelCode: string;
  personnelNickname: string;
  personnelNameTH: string;
  personnelLastTH: string;
  personnelNameEN: string;
  personnelLastEN: string;
}

const PersonnelTable: React.FC = () => {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState<number | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchPersonnel(null);
  }, []);

  const fetchPersonnel = (cursor: number | null, search: string = '', last: boolean = false) => {
    axiosInstance.get(`/Personnel?limit=${limit}&cursor=${cursor || ''}&search=${search}&last=${last}`)
      .then(response => {
        setPersonnel(response.data.data);
        setNextCursor(response.data.nextCursor);
        setCursor(cursor);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => {
        console.error('There was an error!', error);
        Swal.fire('Error', 'Failed to fetch personnel data', 'error');
      });
  };

  const handleDelete = (id: number) => {
    axiosInstance.delete(`/Personnel/${id}`)
      .then(() => {
        setPersonnel(personnel.filter(p => p.personnelId !== id));
        setDeleteDialogOpen(false);
      })
      .catch(error => {
        console.error('There was an error!', error);
        Swal.fire('Error', 'Failed to delete personnel', 'error');
      });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    fetchPersonnel(null, event.target.value);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    const newCursor = cursor ? cursor + (value - 1) * limit : null;
    fetchPersonnel(newCursor);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหา"
          />
          <Button onClick={() => fetchPersonnel(null, searchTerm)} color="primary" variant="contained" sx={{ ml: 2 }}>ค้นหา</Button>
        </Box>
        <Button onClick={() => setAddDialogOpen(true)} color="primary" variant="contained">เพิ่มข้อมูล</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#001e4e' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>รหัสพนักงาน</TableCell>
              <TableCell sx={{ color: 'white' }}>ชื่อภาษาไทย</TableCell>
              <TableCell sx={{ color: 'white' }}>นามสกุลภาษาไทย</TableCell>
              <TableCell sx={{ color: 'white' }}>ชื่อภาษาอังกฤษ</TableCell>
              <TableCell sx={{ color: 'white' }}>นามสกุลภาษาอังกฤษ</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {personnel && personnel.map((person, index) => (
              <TableRow key={person.personnelId} sx={{ backgroundColor: index % 2 === 0 ? 'action.hover' : 'background.paper' }}>
                <TableCell>{person.personnelCode}</TableCell>
                <TableCell>{person.personnelNameTH}</TableCell>
                <TableCell>{person.personnelLastTH}</TableCell>
                <TableCell>{person.personnelNameEN}</TableCell>
                <TableCell>{person.personnelLastEN}</TableCell>
                <TableCell>
                  <Button onClick={() => { setSelectedPersonnelId(person.personnelId); setEditDialogOpen(true); }} color="primary">แก้ไข</Button>
                  <Button color="secondary" onClick={() => { setSelectedPersonnelId(person.personnelId); setDeleteDialogOpen(true); }}>ลบ</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} sx={{ margin: '0 auto' }} />
        <TextField
          select
          label="จำนวนข้อมูลต่อหน้า"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          sx={{ width: '150px', ml: 2 }}
          SelectProps={{
            native: true,
          }}
        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </TextField>
      </Box>
      <Suspense fallback={<div>Loading...</div>}>
        <AddPersonnelDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onAdd={() => fetchPersonnel(null)}
        />
        {selectedPersonnelId !== null && (
          <EditPersonnelDialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            personnelId={selectedPersonnelId}
            onEdit={() => fetchPersonnel(null)}
          />
        )}
      </Suspense>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
          คุณแน่ใจหรือไม่ที่ต้องการลบข็อมูลนี้?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={() => handleDelete(selectedPersonnelId!)} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PersonnelTable;