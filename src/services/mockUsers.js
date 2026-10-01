import { ROLES } from '@/constants/roles';

// Fake "database" for mock mode only (VITE_USE_MOCK_API=true).
// A real backend stores only hashed passwords; this file is deleted once the API is live.
export const MOCK_USERS = [
  {
    fullName: 'Demo Admin',
    email: 'admin@blood.org',
    phone: '9876543210',
    bloodGroup: 'O+',
    password: 'Admin@123',
    role: ROLES.ADMIN,
  },
  {
    fullName: 'Demo Staff',
    email: 'staff@blood.org',
    phone: '9876543211',
    bloodGroup: 'A+',
    password: 'Staff@123',
    role: ROLES.STAFF,
  },
];
