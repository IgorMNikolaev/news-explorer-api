const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyWord: {
    type: String,
    required: [true, 'Требуется хотя бы одно ключевое слово!'],
  },
  title: {
    type: String,
    required: [true, 'Введите название статьи!'],
  },
  text: {
    type: String,
    required: [true, 'Поместите сюда текст статьи!'],
  },
  date: {
    type: String,
    required: [true, 'Введите дату написания статьи!'],
  },
  source: {
    type: String,
    required: [true, 'Нужно ввести источник статьи!'],
  },
  link: {
    type: String,
    validate: {
      validator(v) {
        return /https?:\W\W[\w./-]+\.[\w/]+/.test(v);
      },
      message: (props) => `${props.value} это не верный адрес!`,
    },
    required: [true, 'Требуется URL'],
  },
  image: {
    type: String,
    validate: {
      validator(v) {
        return /https?:\W\W[\w./-]+\.[\w/]+/.test(v);
      },
      message: (props) => `${props.value} это не верный адресс картинки!`,
    },
    required: [true, 'Требуется URL картинки'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

articleSchema.methods.toJSON = function ownerDelete() {
  const obj = this.toObject();
  delete obj.owner;
  return obj;
};

module.exports = mongoose.model('article', articleSchema);
