export type UserType = 'Tutor' | 'Veterinário';
export type UserRole = 'admin' | 'user';

export interface User {
  id?: number;
  name: string; // 3..100
  cpf: string; // 000.000.000-00, válido
  type: UserType;
  email: string; // 10..256
  phone: string; // (00) 00000-0000
  address?: string | null; // Tutor
  passwordHash: string; // armazenado com hash
  role: UserRole; // criado como 'user'
  // Veterinário
  crmv?: string | null;
  clinicAddress?: string | null;
  professionalIdDocPath?: string | null;
  diplomaDocPath?: string | null;
  createdAt?: string;
}


