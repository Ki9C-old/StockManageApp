import bcrypt from 'bcrypt';

const plainPassword = 'testpass123';
const passwordHash = await bcrypt.hash(plainPassword, 10);

console.log(passwordHash);