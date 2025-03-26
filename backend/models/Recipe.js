const mongoose = require('mongoose');

// 레시피 스키마 정의
const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  image: {  // 이미지 URL 필드 추가
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
