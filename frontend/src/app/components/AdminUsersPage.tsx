import { useState } from 'react';
import { AdminUserForm } from './AdminUserForm';
import { AdminUserList } from './AdminUserList';
import { User } from '../../types/User';

export function AdminUsersPage() {
  const [editing, setEditing] = useState<User | null>(null);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0 }}>{editing ? 'Editar Usuário' : 'Cadastrar Usuário'}</h2>
        <AdminUserForm
          mode={editing ? 'edit' : 'create'}
          initial={editing ?? undefined}
          onSaved={() => setEditing(null)}
          onCancel={() => setEditing(null)}
        />
      </div>
      <AdminUserList onEdit={(u) => setEditing(u)} />
    </div>
  );
}


