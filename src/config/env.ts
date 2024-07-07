import 'dotenv/config';

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, JWT_PUBLIC, JWT_PRIVATE } = process.env;

const CONFIG = {
  db: `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
  jwt_public: JWT_PUBLIC,
  jwt_private: JWT_PRIVATE
};

export default CONFIG;
