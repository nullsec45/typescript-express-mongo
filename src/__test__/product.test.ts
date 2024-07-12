import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import createServer from '../utils/server';
import { addProductDB } from '../services/product.service';
import { v4 as uuidv4 } from 'uuid';
import { createUser } from '../services/auth.service';
import { hashing } from '../utils/hashing';

const app = createServer();

const productId1 = uuidv4();
const productId2 = uuidv4();
const userIdAdmin = uuidv4();
const userIdRegular = uuidv4();

const productPayload = {
  product_id: productId1,
  name: 'Sepatu Terbang',
  price: 99999999,
  size: '43'
};

const productPayloadCreate = {
  product_id: productId2,
  name: 'Jaket Kulit',
  price: 89898989,
  size: 'XXL'
};

const productPayloadUpdate = {
  price: 50000000,
  size: 'XL'
};

const userAdminCreated = {
  user_id: userIdAdmin,
  email: 'admin@gmail.com',
  name: 'admin',
  password: `${hashing('1234')}`,
  role: 'admin'
};

const userRegularCreated = {
  user_id: userIdRegular,
  email: 'user@gmail.com',
  name: 'user',
  password: `${hashing('1234')}`,
  role: 'regular'
};

const userAdmin = {
  email: 'admin@gmail.com',
  password: '1234'
};

const userRegular = {
  email: 'user@gmail.com',
  password: '1234'
};

describe('product', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    await addProductDB(productPayload);
    await createUser(userAdminCreated);
    await createUser(userRegularCreated);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('get all product', () => {
    describe('given the product does  exist', () => {
      it('should return 200 and get all data', async () => {
        const { statusCode } = await supertest(app).get('/product');
        expect(statusCode).toBe(200);
      });
    });
  });

  describe('get detail product', () => {
    describe('given the product does not exist', () => {
      it('should return 404 and empty data', async () => {
        const productId = 'PRODUCT123';
        await supertest(app).get(`/product/${productId}`).expect(404);
      });
    });

    describe('given the product exist', () => {
      it('should return 200 and detail product data', async () => {
        const { statusCode, body } = await supertest(app).get(`/product/${productId1}`);
        expect(statusCode).toBe(200);
        expect(body.data[0].name).toBe('Sepatu Terbang');
      });
    });
  });

  describe('create-product', () => {
    describe('if user is not login', () => {
      it('should return 403, request forbidden', async () => {
        const { statusCode } = await supertest(app).post('/product').send(productPayloadCreate);
        expect(statusCode).toBe(403);
      });
    });

    describe('if user is  login as admin', () => {
      it('should return 201 success create product', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin);
        const accessToken = body.data.accessToken;

        const { statusCode } = await supertest(app)
          .post('/product')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(productPayloadCreate);

        expect(statusCode).toBe(201);
      });

      it('should return 422, product name is exists in db', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin);
        const accessToken = body.data.accessToken;

        const { statusCode } = await supertest(app)
          .post('/product')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(productPayload);

        expect(statusCode).toBe(422);
      });
    });

    describe('if user is login as regular', () => {
      it('should return 403, request forbidden', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular);
        const accessToken = body.data.accessToken;

        const { statusCode } = await supertest(app)
          .post('/product')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(productPayloadCreate);

        expect(statusCode).toBe(403);
      });
    });
  });

  describe('update product', () => {
    describe('if user is not login', () => {
      it('should return 403, request forbidden', async () => {
        const { statusCode } = await supertest(app).put(`/product/${productPayload.product_id}`);
        expect(statusCode).toBe(403);
      });
    });

    describe('if user is login as admin', () => {
      it('should return 200 success update product', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin);
        const accessToken = body.data.accessToken;

        await supertest(app)
          .put(`/product/${productPayload.product_id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(productPayloadUpdate)
          .expect(200);

        const updatedData = await supertest(app).get(`/product/${productPayload.product_id}`);
        expect(updatedData.body.data[0].size).toBe('XL');
        expect(updatedData.body.data[0].price).toBe(50000000);
      });

      it('should return 404, product doest not exists in db', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin);
        const accessToken = body.data.accessToken;

        const { statusCode } = await supertest(app)
          .put('/product/product_null')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(productPayloadUpdate);

        expect(statusCode).toBe(404);
      });
    });

    describe('if user is login as regular', () => {
      it('should return 403, request forbidden', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular);
        const accessToken = body.data.accessToken;

        const { statusCode } = await supertest(app)
          .put(`/product/${productId1}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(productPayloadUpdate);

        expect(statusCode).toBe(403);
      });
    });
  });

  describe('delete product', () => {
    describe('if user is not login', () => {
      it('should return 403, request forbidden', async () => {
        const { statusCode } = await supertest(app).delete(`/product/${productPayload.product_id}`);
        expect(statusCode).toBe(403);
      });
    });

    describe('if user is login as admin', () => {
      it('should return 200 success delete product', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin);
        const accessToken = body.data.accessToken;

        const { statusCode } = await supertest(app)
          .delete(`/product/${productPayload.product_id}`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(statusCode).toBe(200);
      });

      it('should return 404, product doest not exists in db', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userAdmin);
        const accessToken = body.data.accessToken;

        const { statusCode } = await supertest(app)
          .delete('/product/product_null')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(statusCode).toBe(404);
      });
    });

    describe('if user is login as regular', () => {
      it('should return 403, request forbidden', async () => {
        const { body } = await supertest(app).post('/auth/login').send(userRegular);
        const accessToken = body.data.accessToken;

        const { statusCode } = await supertest(app)
          .delete(`/product/${productPayload.product_id}`)
          .set('Authorization', `Bearer ${accessToken}`);

        expect(statusCode).toBe(403);
      });
    });
  });
});
