import request from 'supertest';

import Server from '../src/models/Server';
import { UserModel } from '../src/models/User';

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
});
