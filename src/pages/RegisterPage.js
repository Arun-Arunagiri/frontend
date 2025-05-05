import React, { useState } from 'react';
import {
    Container, TextField, Button, Typography, Card, CardContent, Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSuccessMsg("Registration successful! Redirecting to login...");
                setTimeout(() => navigate('/'), 2000); // redirect to login after 2s
            } else {
                setErrorMsg(result.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Register error:', error);
            setErrorMsg('Server error. Please try again later.');
        }
    };

    return (
        <Container maxWidth="xs" style={{ marginTop: '80px' }}>
            <Card elevation={3} style={{ padding: '30px', borderRadius: '12px' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom align="center">
                        Register New User
                    </Typography>
                    {errorMsg && (
                        <Typography color="error" variant="body2" align="center">
                            {errorMsg}
                        </Typography>
                    )}
                    {successMsg && (
                        <Typography color="primary" variant="body2" align="center">
                            {successMsg}
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
                        <TextField
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                Register
                            </Button>
                        </Grid>
                    </form>
                    <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <Button variant="text" onClick={() => navigate('/')}>
                                Login
                            </Button>
                        </Typography>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default RegisterPage;
