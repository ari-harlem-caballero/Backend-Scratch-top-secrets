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
      .post
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
});
