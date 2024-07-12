import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import createServer from '../utils/server';
import { v4 as uuidv4 } from 'uuid';
import { createUser } from '../services/auth.service';

const app = createServer();

const userIdAdmin = uuidv4();
const userIdRegular = uuidv4();

const userAdminCreated = {
  user_id: userIdAdmin,
  email: 'admin@gmail.com',
  name: 'admin',
  password: '1234',
  role: 'admin'
};

const userRegularCreated = {
  user_id: userIdRegular,
  email: 'user@gmail.com',
  name: 'user',
  password: '1234',
  role: 'regular'
};

const userAdminCreatedRegister = {
  user_id: userIdAdmin,
  email: 'adminRegister@gmail.com',
  name: 'admin',
  password: '1234',
  role: 'admin'
};

const userRegularCreatedRegister = {
  user_id: userIdRegular,
  email: 'userRegister@gmail.com',
  name: 'user',
  password: '1234',
  role: 'regular'
};
const userAdminLogin = {
  email: 'admin@gmail.com',
  password: '1234'
};

// const userRegularLogin = {
//   email: 'user@gmail.com',
//   password: '1234'
// };

const userNotExist = {
  email: 'notexist@gmail.com',
  password: '1234'
};

describe('auth', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    await createUser(userAdminCreated);
    await createUser(userRegularCreated);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('register', () => {
    describe('create user with role admin', () => {
      it('should return 200, success create user admin', async () => {
        const { statusCode } = await supertest(app).post('/auth/register').send(userAdminCreatedRegister);
        expect(statusCode).toBe(201);
      });
    });

    describe('create user with role regular', () => {
      it('should return 200, success create user regular', async () => {
        await supertest(app).post('/auth/register').send(userRegularCreatedRegister).expect(201);
      });
    });
  });

  describe('login', () => {
    describe('login with exist user', () => {
      it('should return 200, return access token & refresh token', async () => {
        await supertest(app).post('/auth/login').send(userAdminLogin).expect(200);
      });
    });

    describe('login with not exist user', () => {
      it('should return 200, success create user regular', async () => {
        await supertest(app).post('/auth/login').send(userNotExist).expect(422);
      });
    });
  });
});
