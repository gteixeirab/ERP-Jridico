require('dotenv').config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_EXPIRATION:', process.env.JWT_EXPIRATION);
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);
console.log('ENCRYPTION_KEY:', process.env.ENCRYPTION_KEY);
console.log('LOG_LEVEL:', process.env.LOG_LEVEL);
console.log('LOG_DIR:', process.env.LOG_DIR);
