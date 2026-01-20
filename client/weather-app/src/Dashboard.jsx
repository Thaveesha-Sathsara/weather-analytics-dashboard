import React, { useEffect, useState, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard() {
    const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0();
    const [weatherData, setWeatherData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            if (isAuthenticated) {
                try {
                    const token = await getAccessTokenSilently();
                    const response = await axios.get("http://localhost:3001/api/weather", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setWeatherData(response.data.data);
                } catch (error) { console.error(error); }
            }
        };
        fetchWeather();
    }, [isAuthenticated, getAccessTokenSilently]);

    // Filtering Logic
    const filteredData = useMemo(() => {
        return weatherData.filter(city => 
            city.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [weatherData, searchTerm]);

    if (isLoading) return <div style={{ color: darkMode ? 'white' : 'black' }}>Loading...</div>;

    const theme = {
    bg: darkMode ? "#111827" : "#f3f4f6",
    card: darkMode ? "#1f2937" : "#ffffff",
    text: darkMode ? "#f9fafb" : "#111827",
    border: darkMode ? "#374151" : "#e5e7eb",
    shadow: darkMode ? "0 4px 6px -1px rgba(0, 0, 0, 0.5)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
};

    return (
        <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', padding: '20px', transition: '0.3s' }}>
            {!isAuthenticated ? (
                <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                    <h1>Fidenz Weather Analytics</h1>
                    <button onClick={() => loginWithRedirect()} style={btnStyle}>Log In</button>
                </div>
            ) : (
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <header style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <h2>🌤️ Weather Dashboard</h2>
                        <div>
                            <button onClick={() => setDarkMode(!darkMode)} style={miniBtn}>{darkMode ? '☀️ Light' : '🌙 Dark'}</button>
                            <button onClick={() => logout()} style={{ ...miniBtn, marginLeft: '10px', background: '#e53e3e' }}>Exit</button>
                        </div>
                    </header>

                    {/* Graph Section */}
                    <div style={{ background: theme.card, padding: '20px', borderRadius: '10px', marginTop: '20px', height: '300px' }}>
                        <h3>Comfort Score Comparison</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                                <XAxis dataKey="name" stroke={theme.text} fontSize={12} />
                                <YAxis stroke={theme.text} />
                                <Tooltip contentStyle={{ backgroundColor: theme.card, color: theme.text }} />
                                <Bar dataKey="score" fill="#4299e1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Filter & Table Section */}
                    <input 
                        type="text" 
                        placeholder="🔍 Search city..." 
                        style={{ ...inputStyle, backgroundColor: theme.card, color: theme.text, borderColor: theme.border }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', background: theme.card }}>
                            <thead>
                                <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
                                    <th style={thStyle}>Rank</th>
                                    <th style={thStyle}>City</th>
                                    <th style={thStyle}>Description</th>
                                    <th style={thStyle}>Temp</th>
                                    <th style={thStyle}>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((city) => (
                                    <tr key={city.name} style={{ borderBottom: `1px solid ${theme.border}` }}>
                                        <td style={tdStyle}>{city.rank}</td>
                                        <td style={tdStyle}>{city.name}</td>
                                        <td style={{ ...tdStyle, textTransform: 'capitalize', fontStyle: 'italic', opacity: 0.8 }}>
                                            {city.description}
                                        </td>
                                        <td style={tdStyle}>{city.temp}°C</td>
                                        <td style={{ ...tdStyle, fontWeight: 'bold', color: city.score > 70 ? '#48bb78' : '#ed8936' }}>{city.score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

const btnStyle = { 
    padding: '12px 24px', 
    fontSize: '16px', 
    fontWeight: '600',
    cursor: 'pointer', 
    backgroundColor: '#3182ce', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(49, 130, 206, 0.3)'
};
const miniBtn = { padding: '5px 12px', cursor: 'pointer', borderRadius: '5px', border: 'none' };
const inputStyle = { 
    width: '100%', 
    padding: '12px 16px', 
    marginTop: '20px', 
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '16px',
    transition: 'all 0.2s'
};
const thStyle = { 
    padding: '16px', 
    textAlign: 'left', 
    fontSize: '14px', 
    textTransform: 'uppercase', 
    letterSpacing: '0.05em',
    opacity: 0.6
};
const tdStyle = { padding: '12px' };