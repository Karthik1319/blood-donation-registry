import { ROLES } from '@/constants/roles';

// Fake "users table" for mock mode only. Not a constant: registering adds to it.
// A real backend stores only hashed passwords.
export const mockUsers = [
  {
    id: 1,
    fullName: 'Demo Admin',
    email: 'admin@blood.org',
    phone: '9876543210',
    bloodGroup: 'O+',
    password: 'Admin@123',
    role: ROLES.ADMIN,
  },
  {
    id: 2,
    fullName: 'Demo Staff',
    email: 'staff@blood.org',
    phone: '9876543211',
    bloodGroup: 'A+',
    password: 'Staff@123',
    role: ROLES.STAFF,
  },
  {
    id: 3,
    fullName: 'Demo Donor',
    email: 'donor@blood.org',
    phone: '9876543212',
    bloodGroup: 'B+',
    password: 'Donor@123',
    role: ROLES.DONOR,
  },
];
