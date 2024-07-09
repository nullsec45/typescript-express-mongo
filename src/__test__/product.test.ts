import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import createServer from '../utils/server';
import { addProductDB } from '../services/product.service';
import { v4 as uuidv4 } from 'uuid';

const app = createServer();

const productId1 = uuidv4();

const productPayload = {
  product_id: productId1,
  name: 'Sepatu Terbang',
  price: 99999999,
  size: '43'
};

describe('product', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    await addProductDB(productPayload);
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
        console.log(body);
        expect(statusCode).toBe(200);
        expect(body.data[0].name).toBe('Sepatu Terbang');
      });
    });
  });
});
