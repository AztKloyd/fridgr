import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Login'; // 로그인 페이지
import Register from './Register'; // 회원가입 페이지
import RecipeList from './RecipeList'; // 메인 레시피 페이지
import SubmitForm from './SubmitForm'; // 레시피 추가 페이지

const App: React.FC = () => {  
  const [recipes, setRecipes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 레시피 목록을 가져오는 useEffect
  useEffect(() => {
    axios.get(`http://localhost:5000/recipes/search?query=${searchQuery}`)
      .then(response => {
        setRecipes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the recipes!', error);
      });
  }, [searchQuery]);

  // 검색 처리 함수
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchQuery); // searchQuery 상태를 업데이트


  };

  return (
    <Router>
    <div>
      <h1>Recipe Book</h1>

      {/* 내비게이션 링크 (로그인, 회원가입 페이지 이동) */}
      <nav>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/add-recipe">Add Recipe</Link>
      </nav>

      {/* 검색 기능 */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="検索ワードを入力してください。"
        />
        <button type="submit">Search</button>
      </form>

      {/* 레시피 목록 출력 */}
      <ul>
        {recipes.map((recipe, index) => (
          <li key={recipe._id}>
            <h2>
              {/* Link를 사용하여 상세 페이지로 이동 */}
              <Link to={`/recipe/${recipe._id}`}>{recipe.title}</Link>
            </h2>
            <p>Created At: {new Date(recipe.createdAt).toLocaleDateString()}</p>
            <p>Recipe Number: {index + 1}</p>
          </li>
        ))}
      </ul>

       {/* 라우팅 설정 */}
       <Routes>
          <Route path="/" element={<RecipeList />} /> {/* 레시피 목록 페이지 */}
          <Route path="/login" element={<Login />} />      {/* 로그인 페이지 */}
          <Route path="/register" element={<Register />} />{/* 회원가입 페이지 */}
          <Route path="/add-recipe" element={<SubmitForm />} /> {/* 레시피 추가 페이지 */}
        </Routes>
    </div>
    </Router>
  );
};

export default App;
