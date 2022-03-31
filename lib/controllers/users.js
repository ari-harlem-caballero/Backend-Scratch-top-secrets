const { Router } = require('express');
const UserService = require('../services/UserService');
const jwt = require('jsonwebtoken');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;


module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      
      res.send(user);

    } catch (error) {
      next(error);
    }
  })

  .post('/sessions', async (req, res, next) => {
    try {
      const user = await UserService.signIn(req.body);

      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      res
        .cookie('session', token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .send(user);
    } catch (error) {
      next(error);
    }
  });
