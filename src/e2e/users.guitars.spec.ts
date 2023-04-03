import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app.js';
import { dbConnect } from '../db/db.connect.js';
import { UserModel } from '../repositories/users.mongo.model.js';
import { GuitarModel } from '../repositories/guitars.mongo.model.js';
import { TokenPayload } from '../helpers/token.payload.interface.js';
import { Auth } from '../helpers/auth.js';
import { GuitarStructure } from '../entities/guitar.model.js';

const setUserCollection = async () => {
  const usersMock = [
    {
      username: 'supertest1',
      email: 'test1@supertest.com',
      password: await Auth.hash('12345'),
      role: 'Admin',
      myGuitars: [],
    },
    {
      username: 'supertest2',
      email: 'test2@supertest.com',
      password: await Auth.hash('12345'),
      role: 'User',
      myGuitars: [],
    },
  ];

  await UserModel.deleteMany().exec();
  await UserModel.insertMany(usersMock);

  const userData = await UserModel.find().exec();
  const usersIdsTest = [userData[0].id, userData[1].id];

  return usersIdsTest;
};

const setGuitarCollection = async () => {
  const guitarsMock = [
    {
      brand: 'testBrand1',
      modelGuitar: 'testModel1',
      picture: 'testPicture1',
      style: 'Electric',
      material: 'testMaterial1',
      price: 1,
      description: 'testDescription1',
    },
    {
      brand: 'testBrand2',
      modelGuitar: 'testModel2',
      picture: 'testPicture2',
      style: 'Acoustic',
      material: 'testMaterial2',
      price: 2,
      description: 'testDescription2',
    },
  ];

  await GuitarModel.deleteMany().exec();
  await GuitarModel.insertMany(guitarsMock);

  const guitarData = await GuitarModel.find().exec();
  const guitarsIdsTest = [guitarData[0].id, guitarData[1].id];

  return guitarsIdsTest;
};

describe('Given the App with /users path and connected to MongoDB', () => {
  let userAdminToken: TokenPayload;
  let userUserToken: TokenPayload;
  let tokenAdminTest: string;
  let tokenUserTest: string;
  let guitarTestId1: string;
  let guitarTestId2: string;

  beforeAll(async () => {
    await dbConnect();

    const usersIdsTest: string[] = await setUserCollection();

    userAdminToken = {
      id: usersIdsTest[0],
      username: 'supertest1',
      role: 'Admin',
    };

    tokenAdminTest = Auth.createJWT(userAdminToken);

    userUserToken = {
      id: usersIdsTest[1],
      username: 'supertest2',
      role: 'User',
    };

    tokenUserTest = Auth.createJWT(userUserToken);

    const guitarsIdsTest: string[] = await setGuitarCollection();
    guitarTestId1 = guitarsIdsTest[0];
    guitarTestId2 = guitarsIdsTest[1];
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  const guitarPayloadTest: Partial<GuitarStructure> = {
    brand: 'testBrand3',
    modelGuitar: 'testModel3',
    picture: 'testPicture3',
    style: 'Electric',
    material: 'testMaterial3',
    price: 3,
    description: 'testDescription3',
  };

  const adminLogin = async () => {
    const loginAdminMock = {
      username: 'supertest1',
      password: '12345',
    };

    await request(app).post('/users/login').send(loginAdminMock);
  };

  const userLogin = async () => {
    const loginUserMock = {
      username: 'supertest2',
      password: '12345',
    };

    await request(app).post('/users/login').send(loginUserMock);
  };

  describe('When the Post method to users/register path is performed', () => {
    test('Then if the information is OK, the status code should be 201', async () => {
      const registerMock = {
        username: 'supertest3',
        email: 'test3@supertest.com',
        password: '12345',
      };

      const response = await request(app)
        .post('/users/register')
        .send(registerMock);

      expect(response.status).toBe(201);
    });

    test('Then if the information is NOK, the status code should be 401', async () => {
      const registerMock = {
        email: 'test3@supertest.com',
      };

      const response = await request(app)
        .post('/users/register')
        .send(registerMock);

      expect(response.status).toBe(401);
    });
  });

  describe('When the Post method to users/login path is performed', () => {
    test('Then if the information is OK, the status code should be 202', async () => {
      const loginMock = {
        username: 'supertest1',
        password: '12345',
      };

      const response = await request(app).post('/users/login').send(loginMock);

      expect(response.status).toBe(202);
    });

    test('Then if the information is NOK (miss password), the status code should be 401', async () => {
      const loginMock = {
        username: 'supertest1',
      };
      const response = await request(app).post('/users/login').send(loginMock);

      expect(response.status).toBe(401);
    });

    test('Then if the information is NOK (userName does not exist), the status code should be 401', async () => {
      const loginMock = {
        userName: 'test10',
        password: 'noPass',
      };
      const response = await request(app).post('/users/login').send(loginMock);

      expect(response.status).toBe(401);
    });

    test('Then if the information is NOK (password does not match), the status code should be 401', async () => {
      const loginMock = {
        userName: 'supertest1',
        password: 'noPass',
      };
      const response = await request(app).post('/users/login').send(loginMock);

      expect(response.status).toBe(401);
    });
  });

  describe('When the Get method to users/:idUser path is performed', () => {
    test('Then if the information is OK, the status code should be 202', async () => {
      adminLogin();

      const urlTest = `/users/${userAdminToken.id}`;

      const response = await request(app)
        .get(urlTest)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(202);
    });

    test('Then if the information is NOK (no tokenInfo), the status code should be 498', async () => {
      userLogin();

      const urlTest = `/users/${userAdminToken.id}`;

      const response = await request(app).get(urlTest);

      expect(response.status).toBe(498);
    });

    test('Then if the information is NOK (no idUser in params), the status code should be 404', async () => {
      userLogin();

      const urlTest = `/users/`;

      const response = await request(app)
        .get(urlTest)
        .set('Authorization', `Bearer ${tokenUserTest}`);

      expect(response.status).toBe(404);
    });

    test('Then if the information is NOK (the token id is not equal to params id), the status code should be 400', async () => {
      adminLogin();
      const urlTest = `/users/${userUserToken.id}`;

      const response = await request(app)
        .get(urlTest)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(401);
    });
  });

  describe('When the Patch method to users/add/cart/:idGuitar path is performed', () => {
    test('Then if the information is OK, the status code of addGuitar method should be 202', async () => {
      adminLogin();

      const urlTestAddCart1 = `/users/add/cart/${guitarTestId1}`;

      const response = await request(app)
        .patch(urlTestAddCart1)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(202);
    });

    test('Then if the information is NOK (no tokenInfo), the status code of addGuitar method should be 498', async () => {
      userLogin();

      const urlTestAddCart2 = `/users/add/cart/${guitarTestId2}`;

      const response = await request(app).patch(urlTestAddCart2);

      expect(response.status).toBe(498);
    });

    test('Then if the information is NOK (no idGuitar in params), the status code of addGuitar method should be 404', async () => {
      userLogin();

      const urlTestAddCartWrong = `/users/add/cart/`;

      const response = await request(app)
        .patch(urlTestAddCartWrong)
        .set('Authorization', `Bearer ${tokenUserTest}`);

      expect(response.status).toBe(404);
    });

    test('Then if the information is NOK (the idGuitar is wrong), the status code of addGuitar method should be 400', async () => {
      adminLogin();

      const urlTestAddCartWrongId = `/users/add/cart/111111`;

      const response = await request(app)
        .patch(urlTestAddCartWrongId)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(400);
    });

    test('Then if the information is NOK (guitar is already added), the status code of addGuitar method should be 405', async () => {
      adminLogin();

      const urlTestAddCartTwice = `/users/add/cart/${guitarTestId1}`;

      const response = await request(app)
        .patch(urlTestAddCartTwice)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(405);
    });
  });

  describe('When the Patch method to users/remove/cart/:idGuitar path is performed', () => {
    test('Then if the information is OK, the status code of removeGuitar method should be 202', async () => {
      adminLogin();

      const urlTestRemoveCart1 = `/users/remove/cart/${guitarTestId1}`;

      const response = await request(app)
        .patch(urlTestRemoveCart1)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(202);
    });

    test('Then if the information is NOK (no tokenInfo), the status code of removeGuitar method should be 498', async () => {
      adminLogin();

      const urlTestRemoveCart2 = `/users/remove/cart/${guitarTestId2}`;

      const response = await request(app).patch(urlTestRemoveCart2);

      expect(response.status).toBe(498);
    });

    test('Then if the information is NOK (no idGuitar in params), the status code of removeGuitar method should be 404', async () => {
      userLogin();

      const urlTestRemoveCartWrong = `/users/remove/cart/`;

      const response = await request(app)
        .patch(urlTestRemoveCartWrong)
        .set('Authorization', `Bearer ${tokenUserTest}`);

      expect(response.status).toBe(404);
    });

    test('Then if the information is NOK (the idGuitar is wrong), the status code of removeGuitar method should be 400', async () => {
      adminLogin();

      const urlTestRemoveCartWrongId = `/users/remove/cart/111111`;

      const response = await request(app)
        .patch(urlTestRemoveCartWrongId)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(400);
    });
  });

  describe('When the Get method to guitars/products path is performed', () => {
    test('Then if the information is OK, the status code of get method should be 202', async () => {
      userLogin();

      const urlTestGetProducts = `/guitars/products`;

      const response = await request(app)
        .get(urlTestGetProducts)
        .set('Authorization', `Bearer ${tokenUserTest}`);

      expect(response.status).toBe(201);
    });

    test('Then if the information is OK (with query page and style), the status code of get method should should be 202', async () => {
      adminLogin();

      const urlTestGetProductsComplete = `/guitars/products?style=Electric&page=2`;

      const response = await request(app)
        .get(urlTestGetProductsComplete)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(201);
    });

    test('Then if the information is NOK (page more than 5), the status code of get method should should be 400', async () => {
      adminLogin();

      const urlTestGetProductsWrongPage = `/guitars/products?style=Electric&page=10`;

      const response = await request(app)
        .get(urlTestGetProductsWrongPage)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(400);
    });

    test('Then if the information is NOK (page less than 1), the status code of get method should be 400', async () => {
      userLogin();

      const urlTestGetProductsWrongPageLess = `/guitars/products?style=Electric&page=0`;

      const response = await request(app)
        .get(urlTestGetProductsWrongPageLess)
        .set('Authorization', `Bearer ${tokenUserTest}`);

      expect(response.status).toBe(400);
    });

    test('Then if the information is NOK (style is not Electric or Acoustic), the status code of get method should be 400', async () => {
      adminLogin();

      const urlTestGetProductsWrongStyle = `/guitars/products?style=Test&page=1`;

      const response = await request(app)
        .get(urlTestGetProductsWrongStyle)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(400);
    });
  });

  describe('When the Get method to guitars/details/:idGuitar path is performed', () => {
    test('Then if the information is OK, the status code should be 202', async () => {
      adminLogin();

      const urlTest = `/guitars/details/${guitarTestId2}`;

      const response = await request(app)
        .get(urlTest)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(201);
    });

    test('Then if the information is NOK (not idGuitar in params), the status code should be 404', async () => {
      adminLogin();

      const urlTest = `/guitars/details`;

      const response = await request(app)
        .get(urlTest)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(404);
    });
  });

  describe('When the Get method to guitars/create path is performed', () => {
    test('Then if the information is OK, the status code should be 202', async () => {
      adminLogin();

      const urlTest = `/guitars/create`;

      const response = await request(app)
        .post(urlTest)
        .set('Authorization', `Bearer ${tokenAdminTest}`)
        .send(guitarPayloadTest);

      expect(response.status).toBe(201);
    });

    test('Then if the information is NOK (not correct body.style), the status code should be 400', async () => {
      adminLogin();

      const urlTest = `/guitars/create`;

      guitarPayloadTest.style = 'test';

      const response = await request(app)
        .post(urlTest)
        .set('Authorization', `Bearer ${tokenAdminTest}`)
        .send(guitarPayloadTest);

      expect(response.status).toBe(400);

      guitarPayloadTest.style = 'Electric';
    });
  });

  describe('When the Get method to guitars/edit/:idGuitar path is performed', () => {
    test('Then if the information is OK, the status code should be 202', async () => {
      adminLogin();

      const urlTest = `/guitars/edit/${guitarTestId2}`;

      guitarPayloadTest.id = guitarTestId2;

      const response = await request(app)
        .patch(urlTest)
        .set('Authorization', `Bearer ${tokenAdminTest}`)
        .send(guitarPayloadTest);

      expect(response.status).toBe(201);
    });

    test('Then if the information is NOK (body id is not equal to params id), the status code should be 400', async () => {
      adminLogin();

      const urlTest = `/guitars/edit/${guitarTestId1}`;

      const response = await request(app)
        .post(urlTest)
        .set('Authorization', `Bearer ${tokenAdminTest}`)
        .send(guitarPayloadTest);

      expect(response.status).toBe(404);
    });
  });

  describe('When the Get method to guitars/delete/:idGuitar path is performed', () => {
    test('Then if the information is OK, the status code should be 202', async () => {
      adminLogin();

      const urlTest = `/guitars/delete/${guitarTestId2}`;

      const response = await request(app)
        .delete(urlTest)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(201);
    });

    test('Then if the information is NOK (not params id), the status code should be 400', async () => {
      adminLogin();

      const urlTest = `/guitars/delete/`;

      const response = await request(app)
        .post(urlTest)
        .set('Authorization', `Bearer ${tokenAdminTest}`);

      expect(response.status).toBe(404);
    });
  });
});
