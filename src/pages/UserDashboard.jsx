import { useState, useEffect } from 'react';
import api from '../api';
import { ArrowUpRight, ArrowDownRight, RefreshCcw, PlusCircle } from 'lucide-react';

const UserDashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    
    // Form state
    const [actionType, setActionType] = useState('DEPOSIT');
    const [amount, setAmount] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [message, setMessage] = useState('');

    const fetchData = async () => {
        try {
            const accRes = await api.get('/accounts/my-accounts');
            setAccounts(accRes.data);
            if (accRes.data.length > 0 && !selectedAccount) {
                setSelectedAccount(accRes.data[0]);
                fetchTransactions(accRes.data[0].id);
            } else if (selectedAccount) {
                 fetchTransactions(selectedAccount.id);
            }
        } catch (err) {
            console.error("Failed to fetch data", err);
        }
    };

    const fetchTransactions = async (accountId) => {
        try {
            const res = await api.get(`/transactions/${accountId}/mini-statement`);
            setTransactions(res.data);
        } catch (err) {
            console.error("Failed to fetch transactions", err);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const createAccount = async () => {
        try {
            await api.post('/accounts/create', { accountType: 'Savings' });
            fetchData();
        } catch (err) {
            alert("Failed to create account");
        }
    };

    const handleTransaction = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            if (actionType === 'DEPOSIT') {
                await api.post(`/transactions/${selectedAccount.id}/deposit`, { amount });
            } else if (actionType === 'WITHDRAW') {
                await api.post(`/transactions/${selectedAccount.id}/withdraw`, { amount });
            } else if (actionType === 'TRANSFER') {
                await api.post(`/transactions/${selectedAccount.id}/transfer`, { 
                    amount, 
                    toAccountNumber: toAccount 
                });
            }
            setMessage('Transaction successful!');
            setAmount('');
            setToAccount('');
            fetchData();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Transaction failed');
        }
    };

    if (accounts.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
                <div className="glass-card">
                    <h2 className="text-gradient">No Accounts Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You don't have any banking accounts yet.</p>
                    <button className="btn btn-primary" onClick={createAccount}>
                        <PlusCircle size={18} /> Open New Account
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient">Dashboard</h1>
                <select 
                    className="input-field" 
                    value={selectedAccount?.id || ''} 
                    onChange={(e) => {
                        const acc = accounts.find(a => a.id === parseInt(e.target.value));
                        setSelectedAccount(acc);
                        fetchTransactions(acc.id);
                    }}
                >
                    {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.accountType} - {acc.accountNumber}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2">
                {/* Balance Card */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.875rem' }}>Available Balance</p>
                    <h2 style={{ fontSize: '3rem', margin: '0.5rem 0' }}>${selectedAccount?.balance?.toFixed(2) || '0.00'}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Status: <span className={selectedAccount?.active ? 'badge badge-success' : 'badge badge-danger'}>{selectedAccount?.active ? 'Active' : 'Frozen'}</span></p>
                </div>

                {/* Quick Actions */}
                <div className="glass-card">
                    <h3 className="text-gradient">Quick Transfer</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <button className={`btn ${actionType === 'DEPOSIT' ? 'btn-success' : 'btn-outline'}`} onClick={() => setActionType('DEPOSIT')} style={{flex: 1, padding: '0.5rem'}}><ArrowDownRight size={16}/> Deposit</button>
                        <button className={`btn ${actionType === 'WITHDRAW' ? 'btn-danger' : 'btn-outline'}`} onClick={() => setActionType('WITHDRAW')} style={{flex: 1, padding: '0.5rem'}}><ArrowUpRight size={16}/> Withdraw</button>
                        <button className={`btn ${actionType === 'TRANSFER' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActionType('TRANSFER')} style={{flex: 1, padding: '0.5rem'}}><RefreshCcw size={16}/> Transfer</button>
                    </div>

                    <form onSubmit={handleTransaction}>
                        {actionType === 'TRANSFER' && (
                            <div className="form-group">
                                <label>Recipient Account Number</label>
                                <input type="text" className="input-field" value={toAccount} onChange={(e) => setToAccount(e.target.value)} required />
                            </div>
                        )}
                        <div className="form-group">
                            <label>Amount ($)</label>
                            <input type="number" step="0.01" min="0.01" className="input-field" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Proceed</button>
                        {message && <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: message.includes('failed') || message.includes('Insufficient') ? 'var(--color-danger)' : 'var(--color-success)' }}>{message}</div>}
                    </form>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="glass-card" style={{ marginTop: '2rem' }}>
                <h3 className="text-gradient" style={{ marginBottom: '1.5rem' }}>Recent Transactions</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Details</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found</td></tr>
                            ) : transactions.map(tx => {
                                const isOut = tx.sourceAccount?.id === selectedAccount.id;
                                const isTransfer = tx.type === 'TRANSFER';
                                const sign = isOut ? '-' : '+';
                                const color = isOut ? 'var(--color-danger)' : 'var(--color-success)';

                                return (
                                    <tr key={tx.id}>
                                        <td style={{ color: 'var(--text-muted)' }}>{new Date(tx.transactionDate).toLocaleString()}</td>
                                        <td>
                                            <span className={`badge badge-${isOut ? 'danger' : 'success'}`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td>
                                            {isTransfer ? (isOut ? `To ${tx.destinationAccount.accountNumber}` : `From ${tx.sourceAccount.accountNumber}`) : '-'}
                                        </td>
                                        <td style={{ fontWeight: 'bold', color }}>
                                            {sign}${tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
