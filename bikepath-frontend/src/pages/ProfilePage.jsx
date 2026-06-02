import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Bike, MapPin, Edit2, LogOut, Save, X, Hash, Camera } from 'lucide-react';
import { getProfile, updateProfile, uploadAvatar } from '../services/bikepathService';

const ProfilePage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profile, setProfile] = useState({
        full_name: '', bike_type: '', cycling_level: 'beginner', address: '', avatar: '', username: '', email: ''
    });

    useEffect(() => { loadProfile(); }, []);

    const loadProfile = async () => {
        try {
            const res = await getProfile();
            if (res.data.data) setProfile(res.data.data);
        } catch (err) { console.error(err); }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        setUploading(true);
        try {
            const res = await uploadAvatar(formData);
            if (res.data.status) {
                setProfile({ ...profile, avatar: res.data.avatar_url });
                window.location.reload();
            }
        } catch (err) { alert('Gagal upload'); } finally { setUploading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(profile);
            setIsEditing(false);
            window.location.reload();
        } catch (err) { alert('Gagal simpan'); }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card-duo" style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '130px', margin: '0 auto 20px' }}>
                    <div style={{ width: '130px', height: '130px', borderRadius: '35px', overflow: 'hidden', border: '4px solid var(--color-gray-light)', background: '#f7f7f7', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {profile.avatar ? <img src={profile.avatar} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <User size={60} color="#ccc" />}
                    </div>
                    <button className="btn-duo btn-primary" style={{ position:'absolute', bottom:'-10px', right:'-10px', padding:'8px', borderRadius:'12px' }} onClick={() => fileInputRef.current.click()}>
                        <Camera size={20} />
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{display:'none'}} accept="image/*" />
                    </button>
                </div>
                
                <h2 style={{ fontSize: '2rem', marginBottom: '5px' }}>{profile.full_name || profile.username}</h2>
                <p style={{ color: 'var(--color-gray-dark)', fontWeight: '700', marginBottom: '20px' }}>@{profile.username}</p>

                {!isEditing ? (
                    <div style={{ textAlign: 'left', display: 'grid', gap: '15px' }}>
                        <div className="card-duo" style={{ padding: '15px', marginBottom: '0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: '#e5f6ff', padding: '10px', borderRadius: '12px' }}><Bike color="#1cb0f6" /></div>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: '800' }}>TIPE JALAN</p>
                                <p style={{ fontWeight: '700' }}>{profile.bike_type || 'Belum diatur'}</p>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                            <button className="btn-duo btn-outline" onClick={() => setIsEditing(true)}>EDIT PROFIL</button>
                            <button className="btn-duo btn-danger" onClick={() => { localStorage.clear(); window.location.reload(); }}>LOGOUT</button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSave} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input className="input-duo" placeholder="USERNAME" value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} />
                        <input className="input-duo" placeholder="NAMA LENGKAP" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} />
                        <input className="input-duo" placeholder="TIPE JALAN" value={profile.bike_type} onChange={e => setProfile({...profile, bike_type: e.target.value})} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <button type="submit" className="btn-duo btn-primary">SIMPAN</button>
                            <button type="button" className="btn-duo btn-outline" onClick={() => setIsEditing(false)}>BATAL</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
