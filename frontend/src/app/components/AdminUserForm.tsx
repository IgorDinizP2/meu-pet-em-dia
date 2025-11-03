import { useEffect, useMemo, useState } from 'react';
import { ADMIN_KEY, API_BASE_URL } from '@lib/api';
import { maskBrPhone, isCompleteBrPhone } from '../../utils/brPhone';
import { User } from '../../types/User';

type UserType = 'Tutor' | 'Veterinário';

type CreateUserPayload = {
  name: string;
  cpf: string;
  type: UserType;
  email: string;
  phone: string;
  address?: string;
  password: string;
  crmv?: string;
  clinicAddress?: string;
  professionalIdDoc?: File | null;
  diplomaDoc?: File | null;
};

export function AdminUserForm({
  mode = 'create',
  initial,
  onSaved,
  onCancel,
}: {
  mode?: 'create' | 'edit';
  initial?: User | null;
  onSaved?: (u: User) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<CreateUserPayload>({
    name: '',
    cpf: '',
    type: 'Tutor',
    email: '',
    phone: '',
    address: '',
    password: '',
    crmv: '',
    clinicAddress: '',
    professionalIdDoc: null,
    diplomaDoc: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isVet = form.type === 'Veterinário';
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string>('');

  function onChange<K extends keyof CreateUserPayload>(key: K, value: CreateUserPayload[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  const canSubmit = useMemo(() => {
    // validações mínimas no front (backend fará validação completa)
    const requiredBase = form.name.trim().length >= 3 && form.name.trim().length <= 100 &&
      form.cpf.trim().length > 0 &&
      form.email.trim().length >= 10 && form.email.trim().length <= 256 &&
      isCompleteBrPhone(form.phone) &&
      form.password.length >= 8 && form.password.length <= 12;
    if (!requiredBase) return false;
    if (isVet) {
      return Boolean(form.crmv && form.clinicAddress && form.professionalIdDoc && form.diplomaDoc);
    }
    return true;
  }, [form, isVet]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setSuccessMsg('');
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('cpf', form.cpf.trim());
      fd.append('type', form.type);
      fd.append('email', form.email.trim());
      fd.append('phone', form.phone.trim());
      if (form.address) fd.append('address', form.address);
      if (mode === 'create' || form.password) fd.append('password', form.password);
      if (isVet) {
        fd.append('crmv', form.crmv?.trim() ?? '');
        fd.append('clinicAddress', form.clinicAddress?.trim() ?? '');
        if (form.professionalIdDoc) fd.append('professionalIdDoc', form.professionalIdDoc);
        if (form.diplomaDoc) fd.append('diplomaDoc', form.diplomaDoc);
      }

      const url = mode === 'create' ? `${API_BASE_URL}/admin/users` : `${API_BASE_URL}/admin/users/${initial?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, { method, headers: { 'x-admin-key': ADMIN_KEY }, body: fd });
      const ok = mode === 'create' ? res.status === 201 : res.ok;
      const data = await res.json().catch(() => ({}));
      if (ok) {
        if (mode === 'create') {
          setSuccessMsg('Usuário criado com sucesso');
          setForm({
            name: '', cpf: '', type: 'Tutor', email: '', phone: '', address: '', password: '',
            crmv: '', clinicAddress: '', professionalIdDoc: null, diplomaDoc: null,
          });
        } else {
          setSuccessMsg('Usuário atualizado com sucesso');
        }
        onSaved?.(data as User);
        return;
      }
      if (data?.errors) setErrors(data.errors);
      else setErrors({ general: data?.message ?? 'Falha ao salvar usuário' });
    } catch (err) {
      setErrors({ general: 'Erro de rede' });
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => { setErrors({}); }, [form.type]);

  // carregar dados iniciais para edição
  useEffect(() => {
    if (mode === 'edit' && initial) {
      setForm({
        name: initial.name,
        cpf: initial.cpf,
        type: initial.type,
        email: initial.email,
        phone: initial.phone,
        address: initial.address ?? '',
        password: '',
        crmv: initial.crmv ?? '',
        clinicAddress: initial.clinicAddress ?? '',
        professionalIdDoc: null,
        diplomaDoc: null,
      });
    }
  }, [mode, initial]);

  return (
    <form onSubmit={onSubmit} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
      {errors.general ? <div style={{ color: '#b91c1c', marginBottom: 8 }}>{errors.general}</div> : null}
      {successMsg ? <div style={{ color: '#166534', marginBottom: 8 }}>{successMsg}</div> : null}

      <label>Nome *</label>
      <input value={form.name} onChange={(e) => onChange('name', e.target.value)} placeholder="Nome completo" />
      {errors.name ? <small style={{ color: '#b91c1c' }}>{errors.name}</small> : null}

      <label>CPF *</label>
      <input value={form.cpf} onChange={(e) => onChange('cpf', e.target.value)} placeholder="000.000.000-00" />
      {errors.cpf ? <small style={{ color: '#b91c1c' }}>{errors.cpf}</small> : null}

      <label>Tipo *</label>
      <select value={form.type} onChange={(e) => onChange('type', e.target.value as UserType)}>
        <option>Tutor</option>
        <option>Veterinário</option>
      </select>
      {errors.type ? <small style={{ color: '#b91c1c' }}>{errors.type}</small> : null}

      {isVet ? (
        <>
          <label>CRMV *</label>
          <input value={form.crmv} onChange={(e) => onChange('crmv', e.target.value)} placeholder="CRMV" />
          {errors.crmv ? <small style={{ color: '#b91c1c' }}>{errors.crmv}</small> : null}

          <label>Documento de identidade profissional (CRMV) *</label>
          <input type="file" onChange={(e) => onChange('professionalIdDoc', e.target.files?.[0] ?? null)} />
          {errors.professionalIdDoc ? <small style={{ color: '#b91c1c' }}>{errors.professionalIdDoc}</small> : null}

          <label>Diploma/Certificado *</label>
          <input type="file" onChange={(e) => onChange('diplomaDoc', e.target.files?.[0] ?? null)} />
          {errors.diplomaDoc ? <small style={{ color: '#b91c1c' }}>{errors.diplomaDoc}</small> : null}

          <label>E-mail *</label>
          <input value={form.email} onChange={(e) => onChange('email', e.target.value)} placeholder="email@dominio.com" />
          {errors.email ? <small style={{ color: '#b91c1c' }}>{errors.email}</small> : null}

          <label>Celular *</label>
          <input value={form.phone} onChange={(e) => onChange('phone', maskBrPhone(e.target.value))} placeholder="(00) 00000-0000" />
          {errors.phone ? <small style={{ color: '#b91c1c' }}>{errors.phone}</small> : null}

          <label>Endereço Clínica</label>
          <input value={form.clinicAddress} onChange={(e) => onChange('clinicAddress', e.target.value)} placeholder="CEP e cidade" />
          {errors.clinicAddress ? <small style={{ color: '#b91c1c' }}>{errors.clinicAddress}</small> : null}
        </>
      ) : (
        <>
          <label>E-mail *</label>
          <input value={form.email} onChange={(e) => onChange('email', e.target.value)} placeholder="email@dominio.com" />
          {errors.email ? <small style={{ color: '#b91c1c' }}>{errors.email}</small> : null}

          <label>Celular *</label>
          <input value={form.phone} onChange={(e) => onChange('phone', maskBrPhone(e.target.value))} placeholder="(00) 00000-0000" />
          {errors.phone ? <small style={{ color: '#b91c1c' }}>{errors.phone}</small> : null}

          <label>Endereço</label>
          <input value={form.address} onChange={(e) => onChange('address', e.target.value)} placeholder="CEP e cidade" />
          {errors.address ? <small style={{ color: '#b91c1c' }}>{errors.address}</small> : null}
        </>
      )}

      <label>Senha *</label>
      <input type="password" value={form.password} onChange={(e) => onChange('password', e.target.value)} placeholder="8 a 12 caracteres" />
      {errors.password ? <small style={{ color: '#b91c1c' }}>{errors.password}</small> : null}

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button type="submit" disabled={!canSubmit || submitting}>{submitting ? 'Enviando...' : (mode === 'create' ? 'Cadastrar Usuário' : 'Salvar Alterações')}</button>
        {mode === 'create' ? (
          <button type="button" className="secondary" onClick={() => window.location.reload()}>Limpar</button>
        ) : (
          <button type="button" className="secondary" onClick={onCancel}>Cancelar</button>
        )}
      </div>
    </form>
  );
}


