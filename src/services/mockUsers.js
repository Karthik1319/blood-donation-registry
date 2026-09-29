// Temporary fake "database" until the Spring Boot backend exists.
// A real backend stores only hashed passwords; this file is deleted once the API is connected.
export const MOCK_USERS = [
  {
    fullName: 'Demo Admin',
    email: 'admin@blood.org',
    phone: '9876543210',
    bloodGroup: 'O+',
    password: 'Admin@123',
  },
];
