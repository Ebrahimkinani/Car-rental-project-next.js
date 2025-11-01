// Simulate what should happen when admin user logs in
const staffRoles = ['admin', 'manager', 'employee'];
const userRole = 'admin'; // From users collection

console.log('🔍 Testing admin redirect logic:');
console.log('User role from login:', userRole);
console.log('Staff roles array:', staffRoles);
console.log('Is staff?', staffRoles.includes(userRole));
console.log('Should redirect to:', staffRoles.includes(userRole) ? '/admin/dashboard' : '/');
