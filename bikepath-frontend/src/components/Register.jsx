import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [status, setStatus] = useState({ loading: false, error: '', success: false });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        try {
            await register(formData);
            setStatus({ loading: false, error: '', success: true });
            setTimeout(() => navigate('/'), 2000); // Redirect to login after 2 seconds
        } catch (err) {
            const msg = err.response?.data?.message || 'Registrasi gagal, periksa data Anda.';
            setStatus({ loading: false, error: msg, success: false });
        }
    };

    const styles = {
        container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
        title: { textAlign: 'center', color: '#333', marginBottom: '20px' },
        formGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
        button: { width: '100%', padding: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
        error: { color: '#dc2626', marginTop: '10px', textAlign: 'center' },
        success: { color: '#16a34a', marginTop: '10px', textAlign: 'center' },
        link: { display: 'block', marginTop: '15px', textAlign: 'center', color: '#2563eb', textDecoration: 'none' }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit}>
                <h2 style={styles.title}>Daftar Bikepath</h2>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} />
                </div>
                <button type="submit" disabled={status.loading} style={{...styles.button, opacity: status.loading ? 0.7 : 1}}>
                    {status.loading ? 'Mendaftar...' : 'Daftar Sekarang'}
                </button>
                {status.error && <p style={styles.error}>{status.error}</p>}
                {status.success && <p style={styles.success}>Registrasi Berhasil! Mengalihkan ke Login...</p>}
            </form>
            <Link to="/" style={styles.link}>Sudah punya akun? Login di sini</Link>
        </div>
    );
};

export default Register;
