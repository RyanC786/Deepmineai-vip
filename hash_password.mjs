import bcrypt from 'bcrypt';

async function hashPassword() {
  const password = 'AleenaDmai@777!#';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log(hash);
}

hashPassword();
