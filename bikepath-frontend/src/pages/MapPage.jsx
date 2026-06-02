import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Navigation, MapPin, Play, Square, Settings2, Search, X, StickyNote, Type } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { saveTracking } from '../services/bikepathService';

const MapPage = () => {
    // Activity Tracking State
    const [tracking, setTracking] = useState(false);
    const [path, setPath] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    // Activity Details for Saving
    const [activityDetails, setActivityDetails] = useState({
        title: '',
        notes: '',
        type: 'road'
    });

    useEffect(() => {
        let interval;
        if (tracking) {
            interval = setInterval(() => {
                const newPos = [
                    -6.200000 + (path.length * 0.0001),
                    106.816666 + (path.length * 0.0001)
                ];
                setPath(prev => [...prev, newPos]);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [tracking, path.length]);

    const getDefaultTitle = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) return 'Morning Ride';
        if (hour >= 11 && hour < 15) return 'Lunch Ride';
        if (hour >= 15 && hour < 19) return 'Afternoon Ride';
        return 'Night Ride';
    };

    const handleStartTracking = () => {
        setTracking(true);
        setPath([]);
        setStartTime(Date.now());
        setActivityDetails({
            ...activityDetails,
            title: getDefaultTitle(),
            notes: ''
        });
    };

    const handleStopTracking = () => {
        setTracking(false);
        setShowSaveModal(true);
    };

    const handleFinalSave = async () => {
        const duration = Math.floor((Date.now() - startTime) / 60000);
        try {
            await saveTracking({
                name: activityDetails.title,
                coordinates: path,
                distance: (path.length * 0.01).toFixed(2),
                duration: duration,
                description: activityDetails.type,
                notes: activityDetails.notes
            });
            alert('Aktivitas bersepeda telah disimpan!');
            setShowSaveModal(false);
            setPath([]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="map-page-wrapper">
            {/* Save Activity Modal */}
            {showSaveModal && (
                <div className="modal-overlay">
                    <div className="card-duo modal-content">
                        <h2 style={{ fontWeight: 800, marginBottom: '20px' }}>Simpan Aktivitas</h2>
                        <div className="input-group" style={{ marginBottom: '15px' }}>
                            <label><Type size={16} /> Judul Aktivitas</label>
                            <input 
                                className="input-duo"
                                value={activityDetails.title}
                                onChange={(e) => setActivityDetails({...activityDetails, title: e.target.value})}
                                placeholder="Masukkan judul..."
                            />
                        </div>
                        <div className="input-group" style={{ marginBottom: '20px' }}>
                            <label><StickyNote size={16} /> Catatan (Opsional)</label>
                            <textarea 
                                className="input-duo"
                                style={{ height: '80px', resize: 'none' }}
                                value={activityDetails.notes}
                                onChange={(e) => setActivityDetails({...activityDetails, notes: e.target.value})}
                                placeholder="Ceritakan perjalananmu..."
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-duo btn-outline" style={{ flex: 1 }} onClick={() => setShowSaveModal(false)}>Batal</button>
                            <button className="btn-duo btn-primary" style={{ flex: 2 }} onClick={handleFinalSave}>Simpan</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Search Bar (Mobile Only) */}
            <div className={`mobile-search-bar ${isSearchExpanded ? 'expanded' : ''}`}>
                {!isSearchExpanded ? (
                    <div className="search-placeholder" onClick={() => setIsSearchExpanded(true)}>
                        <Search size={20} />
                        <span>Cari rute bersepeda...</span>
                    </div>
                ) : (
                    <div className="expanded-search">
                        <div className="search-header">
                            <button className="back-btn" onClick={() => setIsSearchExpanded(false)}>
                                <X size={24} />
                            </button>
                            <h3>Rencanakan Rute</h3>
                        </div>
                        <div className="search-inputs">
                            <div className="mini-input">
                                <MapPin size={18} color="#4caf50" />
                                <input placeholder="Lokasi awal..." />
                            </div>
                            <div className="mini-input">
                                <Navigation size={18} color="#dc2626" />
                                <input placeholder="Tujuan..." />
                            </div>
                            <button className="btn-go" onClick={() => setIsSearchExpanded(false)}>LIHAT RUTE</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop Sidebar */}
            <div className="route-panel">
                <h3>Rencanakan Rute</h3>
                <div className="input-group">
                    <label><MapPin size={16} /> Lokasi Awal</label>
                    <input type="text" placeholder="Cari lokasi awal..." />
                </div>
                <div className="input-group">
                    <label><Navigation size={16} /> Tujuan</label>
                    <input type="text" placeholder="Cari tujuan..." />
                </div>
                <div className="input-group">
                    <label><Settings2 size={16} /> Tipe Jalan</label>
                    <select 
                        value={activityDetails.type}
                        onChange={(e) => setActivityDetails({...activityDetails, type: e.target.value})}
                    >
                        <option value="road">Jalan Raya</option>
                        <option value="mountain">MTB</option>
                        <option value="city">Kota</option>
                    </select>
                </div>
                <button className="btn-find-route">Lihat Rute</button>
            </div>

            {/* Map Area */}
            <div className="map-area">
                <MapContainer center={[-6.200000, 106.816666]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Polyline positions={path} color="#4caf50" weight={5} />
                </MapContainer>

                {/* Tracking Overlay UI */}
                <div className="tracking-controls">
                    {tracking && (
                        <div className="stats-bubble">
                            <span>{(path.length * 0.01).toFixed(2)} km</span>
                        </div>
                    )}
                    
                    {!tracking ? (
                        <button onClick={handleStartTracking} className="btn-track start">
                            <Play size={20} />
                        </button>
                    ) : (
                        <button onClick={handleStopTracking} className="btn-track stop">
                            <Square size={20} />
                        </button>
                    )}
                </div>
            </div>

            <style jsx>{`
                .map-page-wrapper { display: flex; height: calc(100vh - 120px); background: #fff; border: 2px solid #e5e5e5; border-radius: 24px; overflow: hidden; position: relative; }
                .mobile-search-bar { display: none; position: absolute; top: 15px; left: 15px; right: 15px; z-index: 1001; }
                .route-panel { width: 320px; padding: 24px; background: #fff; border-right: 2px solid #e5e5e5; display: flex; flex-direction: column; gap: 15px; }
                .route-panel h3 { font-weight: 800; color: #3c3c3c; margin-bottom: 10px; }
                .input-group { display: flex; flex-direction: column; gap: 8px; }
                .input-group label { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #afafaf; text-transform: uppercase; font-size: 0.75rem; }
                .input-group input, .input-group select { padding: 12px; background: #f7f7f7; border: 2px solid #e5e5e5; border-radius: 12px; font-weight: 600; outline: none; }
                .btn-find-route { margin-top: 10px; padding: 14px; background: #58cc02; color: #fff; border: none; border-radius: 16px; font-weight: 800; box-shadow: 0 4px 0 #46a302; cursor: pointer; }
                .map-area { flex-grow: 1; position: relative; }
                .tracking-controls { position: absolute; bottom: 24px; right: 24px; z-index: 1000; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
                .stats-bubble { background: #58cc02; color: white; padding: 8px 16px; border-radius: 12px; font-weight: 800; box-shadow: 0 4px 0 #46a302; }
                .btn-track { width: 64px; height: 64px; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; color: #fff; cursor: pointer; transition: transform 0.1s; }
                .btn-track.start { background: #58cc02; box-shadow: 0 6px 0 #46a302; }
                .btn-track.stop { background: #ff4b4b; box-shadow: 0 6px 0 #d33131; }
                .btn-track:active { transform: translateY(4px); box-shadow: none; }

                /* Modal Styles */
                .modal-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 2000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); }
                .modal-content { width: 90%; max-width: 400px; animation: slideUp 0.3s ease-out; }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

                @media (max-width: 600px) {
                    .map-page-wrapper { height: calc(100vh - 100px); border: none; border-radius: 0; }
                    .route-panel { display: none; }
                    .mobile-search-bar { display: block; }
                    .search-placeholder { background: #fff; padding: 12px 16px; border-radius: 16px; border: 2px solid #e5e5e5; display: flex; align-items: center; gap: 12px; font-weight: 700; color: #afafaf; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                    .expanded-search { background: #fff; border-radius: 20px; border: 2px solid #e5e5e5; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
                    .search-header { padding: 15px; background: #f7f7f7; border-bottom: 2px solid #e5e5e5; display: flex; align-items: center; gap: 15px; }
                    .search-header h3 { font-size: 1rem; font-weight: 800; }
                    .back-btn { background: none; border: none; cursor: pointer; color: #afafaf; }
                    .search-inputs { padding: 15px; display: flex; flex-direction: column; gap: 10px; }
                    .mini-input { display: flex; align-items: center; gap: 10px; background: #f7f7f7; padding: 0 12px; border: 2px solid #e5e5e5; border-radius: 12px; }
                    .mini-input input { flex-grow: 1; border: none; background: none; padding: 12px 0; font-weight: 700; outline: none; }
                    .btn-go { margin-top: 5px; padding: 14px; background: #1cb0f6; color: #fff; border: none; border-radius: 16px; font-weight: 800; box-shadow: 0 4px 0 #1899d6; }
                }
            `}</style>
        </div>
    );
};

export default MapPage;
