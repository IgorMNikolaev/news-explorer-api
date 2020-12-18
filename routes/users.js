const usersRoutes = require('express').Router();

const { getUserInfo } = require('../controllers/user');

usersRoutes.get('/users/me', getUserInfo);

module.exports = usersRoutes;
