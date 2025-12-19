
import bcrypt from 'bcrypt';

const password = process.argv[2];  
const SALT_ROUNDS = 10;

async function main() {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  console.log('hash =', hash);
}

main();
