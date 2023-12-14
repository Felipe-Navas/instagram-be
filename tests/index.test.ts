import request from 'supertest';

import { Server, UserModel } from '../src/models';

jest.mock('../src/database/connection');

const saveMock = jest.fn(() => Promise.resolve({ data: {} }));
UserModel.prototype.save = saveMock;

const server = new Server();
const app = server.app;

describe('App tests', () => {
  it('should register correctly', (done) => {
    const req = {
      email: 'felipe@test.com',
      password: 'felipe123',
      fullName: 'Felipe Navas'
    };

    const expectedResponse = { result: 'User Registered successfully' };

    jest
      .spyOn(UserModel, 'findOne')
      .mockImplementationOnce(() => Promise.resolve(undefined) as any);

    request(app)
      .post('/api/register')
      .send(req)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject(expectedResponse);
        expect(saveMock).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should login correctly', (done) => {
    const req = {
      email: 'felipe@test.com',
      password: 'felipe147'
    };

    jest.spyOn(UserModel, 'findOne').mockImplementationOnce(
      () =>
        Promise.resolve({
          _id: 'anyValidId',
          password:
            '$2a$16$cjGzCh3M9K5nteni/IPttuSz9K7beaV6wjBo1X0/VMXc1yLYJ3qj2',
          fullName: 'Felipe Navas',
          email: req.email,
          followers: [],
          following: [],
          profilePicUrl: ''
        }) as any
    );

    request(app)
      .post('/api/login')
      .send(req)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual({
          token: expect.any(String),
          userInfo: {
            _id: expect.any(String),
            fullName: expect.any(String),
            email: req.email,
            followers: expect.any(Array),
            following: expect.any(Array),
            profilePicUrl: expect.any(String)
          }
        });
        expect(saveMock).toHaveBeenCalledTimes(1);
        done();
      });
  });
});
