const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('./models/Recipe');  // Recipe 모델 불러오기
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // User 모델 (이메일, 비밀번호 등)


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 이메일 중복 체크
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새로운 사용자 생성
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // JWT 생성 (토큰 발급)
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
//로그인 JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
//로그인 api
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });
  
      // 비밀번호 비교
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      // JWT 생성
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });


// MongoDB 연결
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// 레시피 목록 가져오기 (GET)
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 레시피 추가하기 (POST)
app.post('/recipes', authenticateToken, async (req, res) => {
  const { title, ingredients, instructions, image } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      image, // 이미지 URL 추가
      user: req.user.userId, // 로그인한 사용자의 ID 저장
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// 레시피 삭제 (DELETE)
app.delete('/recipes/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
  
    try {
      const recipe = await Recipe.findById(id);
  
      // 레시피가 존재하지 않으면 404 반환
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      // 레시피의 userId와 요청한 사용자가 일치하는지 확인
      if (recipe.user.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'You are not authorized to delete this recipe' });
      }
  
      // 레시피 삭제
      await Recipe.findByIdAndDelete(id);
      res.json({ message: 'Recipe deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // 레시피 수정 (PUT)
  app.put('/recipes/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, ingredients, instructions } = req.body;
  
    try {
      const recipe = await Recipe.findById(id);
  
      // 레시피가 존재하지 않으면 404 반환
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      // 레시피의 userId와 요청한 사용자가 일치하는지 확인
      if (recipe.user.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'You are not authorized to edit this recipe' });
      }
  
      // 레시피 수정
      recipe.title = title || recipe.title;
      recipe.ingredients = ingredients || recipe.ingredients;
      recipe.instructions = instructions || recipe.instructions;
  
      await recipe.save();
      res.json(recipe);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // 레시피 검색 (GET)
  app.get('/recipes/search', authenticateToken, async (req, res) => {
    const { query } = req.query; // 요청 쿼리에서 검색어 받기
  
    try {
      const recipes = await Recipe.find({
        $or: [
          { title: { $regex: query, $options: 'i' } }, // 제목에서 검색
          { ingredients: { $regex: query, $options: 'i' } } // 재료에서 검색
        ],
        user: req.user.userId // 로그인한 사용자의 레시피만 가져오기
      });
      res.json(recipes);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  //댓글 추가 및 조회
  app.post('/comments', authenticateToken, async (req, res) => {
    const { recipeId, content } = req.body;
  
    if (!content || !recipeId) {
      return res.status(400).json({ message: 'Content and recipeId are required' });
    }
  
    try {
      const newComment = new Comment({
        recipe: recipeId,
        user: req.user.userId,
        content,
      });
  
      await newComment.save();
      res.status(201).json(newComment);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/comments/:recipeId', async (req, res) => {
    const { recipeId } = req.params;
  
    try {
      const comments = await Comment.find({ recipe: recipeId }).populate('user', 'email');
      res.json(comments);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
