import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Card, CardContent, Grid, Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        login(username); // ✅ Save username in AuthContext
        navigate('/dashboard'); // ✅ Redirect to dashboard
      } else {
        setErrorMsg(result.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Server error. Please try again later.');
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '80px' }}>
      <Card elevation={3} style={{ padding: '30px', borderRadius: '12px' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            User Login
          </Typography>
          {errorMsg && (
            <Typography color="error" variant="body2" align="center">
              {errorMsg}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                style={{ borderRadius: '8px', padding: '12px' }}
              >
                Login
              </Button>
            </Grid>
          </form>

          {/* Register Now Link */}
          <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
              >
                Register now
              </Link>
            </Typography>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
