const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Secret = require('../lib/models/Secret');

describe('secrets routes', () => {
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

    await UserService.create({
      username: 'ariIsBest',
      password: 'suckanegg'
    });

    await agent
      .post('/api/v1/users/sessions')
      .send({
        username: 'ariIsBest',
        password: 'suckanegg'
      });

    const expected = {
      title: 'Super Secret Secrets by Tina Belcher',
      description: 'butts'
    };

    const res = await agent
      .post('/api/v1/secrets')
      .send(expected);

    expect(res.body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      ...expected
    });
  });

  it('should return list of secrets for authorized user', async () => {
    const agent = request.agent(app);

    await UserService.create({
      username: 'ariIsBest',
      password: 'suckanegg'
    });

    await agent
      .post('/api/v1/users/sessions')
      .send({
        username: 'ariIsBest',
        password: 'suckanegg'
      });

    const expected = [
      {
        id: expect.any(String),
        title: 'Super Secret Secrets by Tina Belcher',
        description: 'butts',
        createdAt: expect.any(String)
      },
      {
        id: expect.any(String),
        title: 'Even More Secrets by Tina Belcher',
        description: 'more butts',
        createdAt: expect.any(String)
      }
    ];

    const res = await agent
      .get('/api/v1/secrets'); 
  
    expect(res.body).toEqual(expected);
  });
});
