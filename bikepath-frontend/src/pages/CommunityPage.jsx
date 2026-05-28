import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserMinus, MessageSquare, Info } from 'lucide-react';
import { getCommunities, joinCommunity, leaveCommunity, getCommunityMembers, getCommunityMessages, sendCommunityMessage } from '../services/bikepathService';

const CommunityPage = () => {
    const [groups, setGroups] = useState([]);
    const [activeGroup, setActiveGroup] = useState(null);
    const [viewMode, setViewMode] = useState('chat'); // 'chat' or 'members'
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        const res = await getCommunities();
        setGroups(res.data.data);
    };

    const openGroup = async (group) => {
        setActiveGroup(group);
        setViewMode('chat');
        loadMessages(group.id);
    };

    const loadMessages = async (id) => {
        const res = await getCommunityMessages(id);
        setMessages(res.data.data);
    };

    const loadMembers = async (id) => {
        const res = await getCommunityMembers(id);
        setMembers(res.data.data);
    };

    const handleJoinLeave = async (e, group) => {
        e.stopPropagation();
        if (group.is_member > 0) {
            await leaveCommunity(group.id);
        } else {
            await joinCommunity(group.id);
        }
        loadGroups();
    };

    const handleSend = async () => {
        if (!text.trim()) return;
        await sendCommunityMessage(activeGroup.id, text);
        setText('');
        loadMessages(activeGroup.id);
    };

    return (
        <div className="community-wrapper">
            {/* Sidebar */}
            <div className="sidebar">
                <h2 style={{ padding: '0 15px', fontWeight: 800 }}>Komunitas</h2>
                <div className="group-list">
                    {groups.map(g => (
                        <div 
                            key={g.id} 
                            onClick={() => openGroup(g)} 
                            className={`group-item ${activeGroup?.id === g.id ? 'active' : ''}`}
                        >
                            <div className="group-info">
                                <span className="group-name">{g.name}</span>
                                <span className="member-count">{g.member_count} Anggota</span>
                            </div>
                            <button 
                                className={`btn-join ${g.is_member > 0 ? 'joined' : ''}`}
                                onClick={(e) => handleJoinLeave(e, g)}
                            >
                                {g.is_member > 0 ? 'Keluar' : 'Gabung'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="main-panel">
                {activeGroup ? (
                    <>
                        <div className="panel-header">
                            <div>
                                <h3>{activeGroup.name}</h3>
                                <p>{activeGroup.description}</p>
                            </div>
                            <div className="header-actions">
                                <button className={`tab-btn ${viewMode === 'chat' ? 'active' : ''}`} onClick={() => setViewMode('chat')}>
                                    <MessageSquare size={20} />
                                </button>
                                <button className={`tab-btn ${viewMode === 'members' ? 'active' : ''}`} onClick={() => { setViewMode('members'); loadMembers(activeGroup.id); }}>
                                    <Users size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="panel-content">
                            {viewMode === 'chat' ? (
                                <div className="chat-container">
                                    <div className="message-list">
                                        {messages.map(m => (
                                            <div key={m.id} className="message-item">
                                                <span className="msg-user">{m.username}</span>
                                                <p className="msg-text">{m.message}</p>
                                                <span className="msg-date">{new Date(m.created_at).toLocaleTimeString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {activeGroup.is_member > 0 ? (
                                        <div className="input-area">
                                            <input value={text} onChange={e => setText(e.target.value)} placeholder="Tulis sesuatu..." onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
                                            <button onClick={handleSend} className="btn-duo btn-primary">Kirim</button>
                                        </div>
                                    ) : (
                                        <div className="join-notice">Gabung grup untuk ikut berdiskusi</div>
                                    )}
                                </div>
                            ) : (
                                <div className="member-list">
                                    {members.map((m, idx) => (
                                        <div key={idx} className="member-item">
                                            <div className="member-avatar">
                                                {m.avatar ? <img src={m.avatar} alt="avatar" /> : <Users size={20} />}
                                            </div>
                                            <div className="member-details">
                                                <span className="member-name">{m.username}</span>
                                                <span className="member-level">{m.cycling_level}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="empty-panel">
                        <Info size={48} color="#e5e5e5" />
                        <p>Pilih komunitas di samping untuk mulai berdiskusi</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .community-wrapper { display: flex; height: calc(100vh - 120px); border: 2px solid #e5e5e5; border-radius: 24px; overflow: hidden; background: #fff; }
                .sidebar { width: 350px; border-right: 2px solid #e5e5e5; display: flex; flex-direction: column; background: #fff; }
                .group-list { overflow-y: auto; flex-grow: 1; }
                .group-item { padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f7f7f7; cursor: pointer; transition: background 0.2s; }
                .group-item:hover { background: #f7f7f7; }
                .group-item.active { background: #e5f5ff; border-left: 4px solid #1cb0f6; }
                .group-info { display: flex; flex-direction: column; }
                .group-name { font-weight: 800; color: #3c3c3c; }
                .member-count { font-size: 0.75rem; color: #afafaf; font-weight: 700; }
                .btn-join { padding: 6px 12px; border-radius: 12px; border: none; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; cursor: pointer; background: #1cb0f6; color: #fff; }
                .btn-join.joined { background: #e5e5e5; color: #afafaf; }

                .main-panel { flex-grow: 1; display: flex; flex-direction: column; }
                .panel-header { padding: 20px; border-bottom: 2px solid #e5e5e5; display: flex; justify-content: space-between; align-items: center; }
                .panel-header h3 { margin: 0; font-weight: 800; }
                .panel-header p { margin: 5px 0 0; color: #afafaf; font-size: 0.9rem; }
                .header-actions { display: flex; gap: 10px; }
                .tab-btn { background: none; border: none; padding: 10px; border-radius: 12px; cursor: pointer; color: #afafaf; }
                .tab-btn.active { background: #f7f7f7; color: #1cb0f6; }

                .panel-content { flex-grow: 1; overflow: hidden; }
                .chat-container { height: 100%; display: flex; flex-direction: column; }
                .message-list { flex-grow: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px; }
                .message-item { align-self: flex-start; background: #f7f7f7; padding: 12px 16px; border-radius: 0 16px 16px 16px; max-width: 80%; }
                .msg-user { display: block; font-size: 0.75rem; font-weight: 800; color: #1cb0f6; margin-bottom: 5px; }
                .msg-text { margin: 0; font-weight: 600; color: #3c3c3c; }
                .msg-date { display: block; font-size: 0.65rem; color: #afafaf; margin-top: 5px; text-align: right; }
                
                .input-area { padding: 20px; border-top: 2px solid #e5e5e5; display: flex; gap: 15px; }
                .input-area input { flex-grow: 1; padding: 12px; background: #f7f7f7; border: 2px solid #e5e5e5; border-radius: 16px; font-weight: 600; outline: none; }
                .join-notice { padding: 20px; text-align: center; font-weight: 800; color: #afafaf; background: #f7f7f7; }

                .member-list { padding: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
                .member-item { display: flex; align-items: center; gap: 12px; padding: 12px; border: 2px solid #e5e5e5; border-radius: 16px; }
                .member-avatar { width: 40px; height: 40px; background: #58cc02; border-radius: 50%; display: flex; justify-content: center; align-items: center; overflow: hidden; }
                .member-avatar img { width: 100%; height: 100%; object-fit: cover; }
                .member-details { display: flex; flex-direction: column; }
                .member-name { font-weight: 800; font-size: 0.9rem; }
                .member-level { font-size: 0.7rem; font-weight: 700; color: #afafaf; text-transform: uppercase; }

                .empty-panel { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #afafaf; font-weight: 800; }

                @media (max-width: 900px) {
                    .community-wrapper { flex-direction: column; height: auto; min-height: 80vh; }
                    .sidebar { width: 100%; height: 300px; }
                }
            `}</style>
        </div>
    );
};

export default CommunityPage;
