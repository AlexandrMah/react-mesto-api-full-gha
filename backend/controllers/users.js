const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
/*--------.env---------*/
require('dotenv').config();

/*---------------------*/
const User = require('../models/user');
const { BadRequestError, UnauthorizedError, NotFoundError, ConflictError } = require('../utils/constants');

function getUsers(req, res, next) {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
}

function getUser(req, res, next) {
  const id = req.params.userId;
  return User.findById(id)
    .orFail(new Error('DocumentNotFoundError'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'DocumentNotFoundError') {
        next(new NotFoundError('Нет такого id'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
        return;
      }
      next(err);
    });
}

const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, ...req.body, password: hash });
    res.status(201).send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Введены некорректные данные'));
      return;
    }

    if (err.code === 11000){
      next(new ConflictError('Такая почта уже есть'));
      return;
    }
    next(err);
  }
};

function changeProfile(req, res, next) {
  const id = req.user._id;
  const { name, about } = req.body;
  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('DocumentNotFoundError'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.massage === 'DocumentNotFoundError') {
        next(new NotFoundError('Нет такого адреса'));
        return;
      }
      next(err);
    });
}

function changeAvatar(req, res, next) {
  const id = req.user._id;
  const { avatar } = req.body;
  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('DocumentNotFoundError'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.massage === 'DocumentNotFoundError') {
        next(new NotFoundError('Нет такого адреса'));
        return;
      }
      next(err);
    });
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new UnauthorizedError('Неправильные почта или пароль'));
      return;
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      next(new UnauthorizedError('Неправильные почта или пароль'));
      return;
    }

    // /*--------.env---------*/
    const { NODE_ENV, JWT_SECRET = "29af84f0aad493a9297699fb973aedbeb0f73de1d0d5e7c6d6a290550cf56c10" } = process.env;

    const token = JWT.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' }
    );
    /*---------------------*/
    // res.status(200).json(token);
    res.status(200).send({ token });
  } catch (err) {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
        return;
    }
    next(err);
  }
};

const userInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('DocumentNotFoundError'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'DocumentNotFoundError') {
        next(new NotFoundError('Нет такого адреса'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  userInfo,
  changeProfile,
  changeAvatar,
  login,
};
