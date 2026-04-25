import { useState, useEffect } from 'react';
import api from '../api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [usersRes, accountsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/accounts')
            ]);
            setUsers(usersRes.data);
            setAccounts(accountsRes.data);
        } catch (err) {
            console.error("Failed to fetch admin data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleStatus = async (accountId) => {
        try {
            await api.post(`/admin/accounts/${accountId}/toggle-status`);
            fetchData();
        } catch (err) {
            alert("Failed to toggle status");
        }
    };

    if (loading) return <div className="container" style={{textAlign: 'center', marginTop: '2rem'}}>Loading...</div>;

    return (
        <div className="container">
            <h1 className="text-gradient" style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
            
            <div className="grid grid-cols-2">
                <div className="glass-card">
                    <h3 className="text-gradient" style={{ marginBottom: '1rem' }}>Registered Users ({users.length})</h3>
                    <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td style={{ fontWeight: '500' }}>{u.username}</td>
                                        <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                                        <td>
                                            <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-warning' : 'badge-success'}`}>
                                                {u.role.replace('ROLE_', '')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass-card">
                    <h3 className="text-gradient" style={{ marginBottom: '1rem' }}>All Accounts ({accounts.length})</h3>
                    <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Acc #</th>
                                    <th>Balance</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map(acc => (
                                    <tr key={acc.id}>
                                        <td style={{ fontWeight: '500' }}>{acc.accountNumber}</td>
                                        <td>${acc.balance.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge ${acc.active ? 'badge-success' : 'badge-danger'}`}>
                                                {acc.active ? 'Active' : 'Frozen'}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => toggleStatus(acc.id)}
                                                className={`btn ${acc.active ? 'btn-danger' : 'btn-success'}`}
                                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                                            >
                                                {acc.active ? 'Freeze' : 'Unfreeze'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
