import { AdminUsersPage } from '@app/components/AdminUsersPage';

export default function App() {
  return (
    <div style={{ maxWidth: 840, margin: '40px auto', fontFamily: 'Inter, system-ui, Arial' }}>
      <h1>Admin - Manter Usuário</h1>
      <p>Ator: Administrador. Requisito: [RFC01] Manter Usuário.</p>
      <AdminUsersPage />
    </div>
  );
}

