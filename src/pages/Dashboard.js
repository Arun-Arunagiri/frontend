import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Card, CardContent,
  Table, TableHead, TableRow, TableCell, TableBody, Box, Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ✅ include logout
  const [history, setHistory] = useState([]);
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.username || 'User'}`;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/history/${user?.username}`);
        const data = await response.json();
  
        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          setHistory([]);
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        setHistory([]);
      }
    };
  
    if (user?.username) {
      fetchHistory();
    }
  }, [user?.username]);

  const handlePredictClick = () => {
    navigate('/predict');
  };

  const handleLogout = () => {
    logout();          // clear user from context
    navigate('/');     // navigate to login or home
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '40px' }}>
      <Card elevation={3} style={{ marginBottom: '30px', borderRadius: '12px' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <Avatar src={avatarUrl} sx={{ width: 60, height: 60, marginRight: 2 }} />
              <Box>
                <Typography variant="h6">{user?.username || 'User'}</Typography>
                <Typography color="textSecondary">{`${user?.username || 'User'}@gmail.com`}</Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{ borderRadius: '8px' }}
            >
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="center" marginBottom="30px">
        <Button
          variant="contained"
          color="primary"
          onClick={handlePredictClick}
          sx={{ padding: '12px 24px', borderRadius: '10px' }}
        >
          Predict Weather
        </Button>
      </Box>

      <Card elevation={2} style={{ borderRadius: '12px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Prediction History
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Predicted Risk</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.city}</TableCell>
                  <TableCell>{entry.risk}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
