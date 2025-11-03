import { useEffect, useState } from 'react';
import { ADMIN_KEY, API_BASE_URL } from '@lib/api';
import { User } from '../../types/User';

export function AdminUserList({ onEdit }: { onEdit: (u: User) => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, { headers: { 'x-admin-key': ADMIN_KEY } });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onDelete(id: number) {
    if (!confirm('Excluir este usuário?')) return;
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, { method: 'DELETE', headers: { 'x-admin-key': ADMIN_KEY } });
    if (res.status === 204) load();
  }

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p style={{ color: '#b91c1c' }}>{error}</p>;
  if (!users.length) return <p>Nenhum usuário cadastrado.</p>;

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Usuários</h3>
        <button className="secondary" onClick={load}>Atualizar</button>
      </div>
      <hr />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Nome</th>
            <th style={{ textAlign: 'left' }}>CPF</th>
            <th style={{ textAlign: 'left' }}>Tipo</th>
            <th style={{ textAlign: 'left' }}>Email</th>
            <th style={{ textAlign: 'left' }}>Celular</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.cpf}</td>
              <td>{u.type}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => onEdit(u)}>Editar</button>
                <button className="danger" onClick={() => onDelete(u.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


