const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('auth-api routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should sign up user with POST', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ username: 'ariIsBest', password: 'suckanegg' });

    expect(res.body).toEqual({ id: expect.any(String), username: 'ariIsBest' });
  });

  it('should sign in a user with POST sessions', async () => {
    const user = await UserService.create({
      username: 'ariIsBest',
      password: 'suckanegg'
    });

    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ username: 'ariIsBest', password: 'suckanegg' });

    expect(res.body).toEqual(user);
  });
});
