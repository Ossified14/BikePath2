import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserMinus, UserCheck } from 'lucide-react';
import { getFriends, getAllUsers, followFriend, unfollowFriend } from '../services/bikepathService';

const FriendsPage = () => {
    const [friends, setFriends] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [friendsRes, usersRes] = await Promise.all([
                getFriends(),
                getAllUsers()
            ]);
            
            if (friendsRes.data.status) setFriends(friendsRes.data.data);
            if (usersRes.data.status) setAllUsers(usersRes.data.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (id) => {
        await followFriend(id);
        fetchData();
    };

    const handleUnfollow = async (id) => {
        if (window.confirm("Batal mengikuti teman ini?")) {
            await unfollowFriend(id);
            fetchData();
        }
    };

    const isFollowing = (userId) => {
        return friends.some(f => f.id === userId);
    };

    return (
        <div className="friends-page">
            <div className="section">
                <div className="section-header">
                    <UserPlus size={24} color="#58cc02" />
                    <h2>Cari Teman Baru</h2>
                </div>
                <div className="user-grid">
                    {allUsers.filter(u => !isFollowing(u.id)).map(user => (
                        <div key={user.id} className="card-duo user-card">
                            <div className="user-info">
                                <div className="avatar-small">
                                    {user.avatar ? <img src={user.avatar} alt="avatar" /> : <Users size={16} color="#fff" />}
                                </div>
                                <span className="username">{user.username}</span>
                            </div>
                            <button className="btn-add" onClick={() => handleFollow(user.id)}>
                                <UserPlus size={16} /> Ikuti
                            </button>
                        </div>
                    ))}
                    {allUsers.filter(u => !isFollowing(u.id)).length === 0 && (
                        <p className="empty-msg">Wah, kamu sudah mengikuti semua orang!</p>
                    )}
                </div>
            </div>

            <div className="section" style={{ marginTop: '50px' }}>
                <div className="section-header">
                    <UserCheck size={24} color="#1cb0f6" />
                    <h2>Teman yang Kamu Ikuti</h2>
                </div>
                <div className="user-grid">
                    {friends.map(friend => (
                        <div key={friend.id} className="card-duo user-card following">
                            <div className="user-info">
                                <div className="avatar-small">
                                    {friend.avatar ? <img src={friend.avatar} alt="avatar" /> : <Users size={16} color="#fff" />}
                                </div>
                                <span className="username">{friend.username}</span>
                            </div>
                            <button className="btn-remove" onClick={() => handleUnfollow(friend.id)}>
                                <UserMinus size={16} /> Batal
                            </button>
                        </div>
                    ))}
                    {friends.length === 0 && (
                        <p className="empty-msg">Kamu belum mengikuti siapapun. Yuk cari teman gowes!</p>
                    )}
                </div>
            </div>

            <style jsx>{`
                .friends-page { max-width: 900px; margin: 0 auto; padding-bottom: 50px; }
                .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 25px; }
                .section-header h2 { margin: 0; font-weight: 800; font-size: 1.5rem; }

                .user-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
                .user-card { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; transition: transform 0.1s; }
                .user-card:hover { transform: translateY(-2px); }
                .user-card.following { border-color: #e5f5ff; }

                .user-info { display: flex; align-items: center; gap: 12px; }
                .avatar-small { width: 36px; height: 36px; background: #58cc02; border-radius: 50%; display: flex; justify-content: center; align-items: center; overflow: hidden; }
                .avatar-small img { width: 100%; height: 100%; object-fit: cover; }
                .username { font-weight: 800; color: #3c3c3c; font-size: 0.95rem; }

                .btn-add { background: #58cc02; color: #fff; border: none; padding: 8px 15px; border-radius: 12px; font-weight: 800; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 3px 0 #46a302; }
                .btn-add:active { transform: translateY(3px); box-shadow: none; }
                
                .btn-remove { background: #f7f7f7; color: #afafaf; border: 2px solid #e5e5e5; padding: 8px 15px; border-radius: 12px; font-weight: 800; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; cursor: pointer; }
                
                .empty-msg { grid-column: 1 / -1; text-align: center; color: #afafaf; font-weight: 700; padding: 20px; }

                @media (max-width: 600px) {
                    .user-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default FriendsPage;
