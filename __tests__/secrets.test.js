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

  it('should only allow authorized users to POST secret', async () => {
    const agent = request.agent(app);

    await UserService.create({
      username: 'ariIsBest',
      password: 'suckanegg'
    });

    const res = await agent
      .post('/api/v1/secrets')
      .send({
        id: expect.any(String),
        title: 'Super Secret Secrets by Tina Belcher',
        description: 'butts'
      });

    expect(res.body).toEqual({
      message: 'Must be signed in to create a secret',
      status: 401,
    });
  });

  it('should allow signed in user to create secret', async () => {
    const agent = request.agent(app);

    const user = {
      username: 'ariIsBest',
      password: 'suckanegg'
    };

    await UserService.signIn(user);

    const expected = {
      id: expect.any(String),
      title: 'Super Secret Secrets by Tina Belcher',
      description: 'butts',
      createdAt: expect.any(String)
    };

    let res = await agent
      .get('/api/v1/secrets');

    expect(res.body).toEqual({
      message: 'Must be signed in to create a secret',
      status: 401,
    });

    await agent
      .post('/api/v1/users/sessions')
      .send(user);

    res = await agent
      .post('/api/v1/secrets')
      .send(expected);

    expect(res.body).toEqual(expected);
  });
});
