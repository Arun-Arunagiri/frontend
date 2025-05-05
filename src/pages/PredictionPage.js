import React, { useState } from 'react';
import {
    Container, TextField, Button, Grid, Typography, Card,
    CardContent, MenuItem, Select, InputLabel, FormControl,
    CircularProgress, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PredictionPage = () => {
    const [temperature, setTemperature] = useState('');
    const [co2, setCo2] = useState('');
    const [humidity, setHumidity] = useState('');
    const [windSpeed, setWindSpeed] = useState('');
    const [location, setLocation] = useState('');
    const [risk, setRisk] = useState('');
    const [loading, setLoading] = useState(false);
    const [predicting, setPredicting] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const cities = ['New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
        'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur',
        'Indore', 'Patna', 'Vadodara', 'Ludhiana', 'Agra', 'Nashik', 'Coimbatore',
    ];

    const fetchWeatherData = async (selectedLocation) => {
        const apiKey = "22fb59cc4be8d1debe9e8ff403f435f5";
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedLocation}&units=metric&appid=${apiKey}`;

        setLoading(true);
        setRisk('');

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok && data.main) {
                setTemperature(data.main.temp);
                setCo2(400);
                setHumidity(data.main.humidity);
                setWindSpeed(data.wind.speed);
            } else {
                console.error('Error fetching weather data:', data);
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationChange = (e) => {
        const selectedLocation = e.target.value;
        setLocation(selectedLocation);
        fetchWeatherData(selectedLocation);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const predictionData = {
            username: user,
            location,
            temperature,
            co2,
            humidity,
            wind_speed: windSpeed,
        };

        setPredicting(true);

        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(predictionData),
            });

            const result = await response.json();

            if (response.ok && result.predicted_risk) {
                setRisk(result.predicted_risk);

                // Send prediction history to backend
                await fetch('http://localhost:5000/save_prediction', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: user,
                        city: location,
                        risk: result.predicted_risk,
                        timestamp: new Date().toISOString()
                    })
                });
            } else {
                setRisk('Unable to determine risk');
            }
        } catch (error) {
            console.error('Error predicting or saving data:', error);
            setRisk('Error predicting risk');
        } finally {
            setPredicting(false);
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '50px' }}>
            <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 600, color: '#3f51b5' }}>
                Climate Risk Predictor
            </Typography>

            <Typography variant="subtitle1" align="center" gutterBottom>
                Logged in as: <strong>{user.username}</strong>
            </Typography>

            <Card elevation={3} style={{ padding: '20px', borderRadius: '12px' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Select Location</Typography>
                    <FormControl fullWidth style={{ marginBottom: '20px' }}>
                        <InputLabel>Select City</InputLabel>
                        <Select
                            value={location}
                            onChange={handleLocationChange}
                            label="Select City"
                            style={{ borderRadius: '8px' }}
                        >
                            {cities.map((city) => (
                                <MenuItem key={city} value={city}>{city}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" style={{ margin: '20px 0' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        location && (
                            <>
                                <Typography variant="body1">Temperature: {temperature} °C</Typography>
                                <Typography variant="body1">CO₂ Level: {co2} ppm</Typography>
                                <Typography variant="body1">Humidity: {humidity} %</Typography>
                                <Typography variant="body1">Wind Speed: {windSpeed} m/s</Typography>
                            </>
                        )
                    )}
                </CardContent>
            </Card>

            <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ borderRadius: '8px', padding: '12px' }}
                        onClick={handleSubmit}
                        disabled={loading || !location || predicting}
                    >
                        {predicting ? 'Predicting...' : 'Predict'}
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        style={{ borderRadius: '8px', padding: '12px' }}
                        onClick={() => navigate('/dashboard')}
                    >
                        Exit
                    </Button>
                </Grid>
            </Grid>

            {risk && (
                <Card style={{
                    marginTop: '20px',
                    backgroundColor: risk === 'High' ? '#f8d7da' :
                        risk === 'Medium' ? '#fff3cd' :
                            '#d4edda',
                    borderRadius: '12px'
                }}>
                    <CardContent>
                        <Typography variant="h6" align="center" style={{
                            color: risk === 'High' ? 'red' :
                                risk === 'Medium' ? '#856404' : 'green'
                        }}>
                            Predicted Climate Risk: {risk}
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default PredictionPage;
