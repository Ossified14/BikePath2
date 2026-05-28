import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Bike, Clock, Flame, StickyNote, Calendar, Map as MapIcon } from 'lucide-react';
import { getActivities } from '../services/bikepathService';

const ActivityPage = () => {
    const [activities, setActivities] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await getActivities();
        setActivities(res.data.data);
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 800 }}>Riwayat Aktivitas</h1>
            
            {activities.length > 0 ? (
                activities.map((act) => (
                    <div key={act.id} className="card-duo" style={{ marginBottom: '15px', padding: 0, overflow: 'hidden' }}>
                        {/* Header - Clickable */}
                        <div 
                            onClick={() => toggleExpand(act.id)}
                            style={{ 
                                padding: '20px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                cursor: 'pointer',
                                background: expandedId === act.id ? '#f7f7f7' : '#fff'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ background: '#58cc02', padding: '10px', borderRadius: '12px' }}>
                                    <Bike color="#fff" size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                                        {act.name || 'Gowes Tanpa Nama'}
                                    </h3>
                                    <span style={{ color: '#afafaf', fontWeight: 700, fontSize: '0.85rem' }}>
                                        <Calendar size={14} style={{ marginRight: '5px' }} />
                                        {new Date(act.activity_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            {expandedId === act.id ? <ChevronUp color="#afafaf" /> : <ChevronDown color="#afafaf" />}
                        </div>

                        {/* Expandable Content */}
                        {expandedId === act.id && (
                            <div style={{ padding: '20px', borderTop: '2px solid #e5e5e5', background: '#fff' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="stat-item">
                                        <MapIcon size={18} color="#58cc02" />
                                        <div>
                                            <p className="stat-label">JARAK</p>
                                            <p className="stat-value">{(act.distance || 0)} km</p>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <Clock size={18} color="#1cb0f6" />
                                        <div>
                                            <p className="stat-label">DURASI</p>
                                            <p className="stat-value">{Math.floor(act.duration || 0)} Menit</p>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <Flame size={18} color="#ff4b4b" />
                                        <div>
                                            <p className="stat-label">KALORI</p>
                                            <p className="stat-value">{act.calories || 0} kcal</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Only show notes if they are not empty */}
                                {act.notes && act.notes.trim() !== "" && (
                                    <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #f0f0f0' }}>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#afafaf', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                            <StickyNote size={16} /> Catatan
                                        </p>
                                        <p style={{ marginTop: '5px', color: '#3c3c3c', lineHeight: 1.5 }}>
                                            {act.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p style={{ color: '#afafaf', fontWeight: 700 }}>Belum ada aktivitas yang direkam.</p>
                </div>
            )}

            <style jsx>{`
                .stat-item { display: flex; align-items: center; gap: 12px; }
                .stat-label { margin: 0; font-size: 0.7rem; font-weight: 800; color: #afafaf; text-transform: uppercase; }
                .stat-value { margin: 0; font-size: 1rem; font-weight: 800; color: #3c3c3c; }
            `}</style>
        </div>
    );
};

export default ActivityPage;
