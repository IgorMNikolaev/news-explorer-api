const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const RequestError = require('../errors/req-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    required: [true, 'введите почту'],
    unique: [true, 'Такая почта уже есть'],
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} Почта введена не верно!`,
    },
  },
});

userSchema.methods.toJSON = function passwordDelete() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new RequestError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new RequestError('Неправильный пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
