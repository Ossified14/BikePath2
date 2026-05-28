import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { Bike } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [status, setStatus] = useState({ loading: false, error: '', success: false });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        try {
            const data = await login(formData.email, formData.password);
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            setStatus({ loading: false, error: '', success: true });
            setTimeout(() => {
                navigate('/map');
                window.location.reload(); 
            }, 1000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Email atau password salah!';
            setStatus({ loading: false, error: msg, success: false });
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '60px auto', textAlign: 'center' }}>
            <div style={{ marginBottom: '30px' }}>
                <div style={{ width: '80px', height: '80px', background: '#58cc02', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px' }}>
                    <Bike size={48} color="#fff" />
                </div>
                <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Halo Rider!</h1>
                <p style={{ color: '#777', fontWeight: '700' }}>Masuk untuk mulai petualanganmu</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    className="input-duo"
                    type="email" 
                    name="email" 
                    placeholder="EMAIL"
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    className="input-duo"
                    type="password" 
                    name="password" 
                    placeholder="KATA SANDI"
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                />
                <button type="submit" className="btn-duo btn-secondary" disabled={status.loading} style={{ marginTop: '10px' }}>
                    {status.loading ? 'SABAR YA...' : 'MASUK'}
                </button>
            </form>

            {status.error && (
                <div style={{ marginTop: '20px', padding: '15px', background: '#ffdfd3', color: '#ea2b2b', borderRadius: '16px', fontWeight: '800', border: '2px solid #ff4b4b' }}>
                    {status.error}
                </div>
            )}

            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #e5e5e5' }}>
                <p style={{ fontWeight: '700', color: '#777' }}>Belum punya akun?</p>
                <Link to="/register" className="btn-duo btn-outline" style={{ marginTop: '10px', textDecoration: 'none' }}>
                    DAFTAR SEKARANG
                </Link>
            </div>
        </div>
    );
};

export default Login;
