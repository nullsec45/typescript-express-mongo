import bcrypt from 'bcrypt';

export const hashing = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

// checking password
export const checkPassword = (password: string, userPassword: string) => {
  return bcrypt.compareSync(password, userPassword);
};
