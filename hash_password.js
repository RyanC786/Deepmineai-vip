const bcrypt = require('bcryptjs');

const password = 'Tinkerbell786';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
  console.log('Password:', password);
  console.log('Bcrypt hash:', hash);
  console.log('\nSQL Update command:');
  console.log(`UPDATE admin_users SET password_hash = '${hash}' WHERE id = 2;`);
});
