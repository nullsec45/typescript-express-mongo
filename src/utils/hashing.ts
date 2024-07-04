import bcrypt from 'bcrypt';

export const hashing = (password: string) => {
  return bcrypt.hashSync(password, 10);
};
