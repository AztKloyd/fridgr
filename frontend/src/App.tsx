import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
    <div>
      <h1>Recipe Book</h1>

      {/* 검색 기능 */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a recipe"
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
    </div>
  );
};

export default App;
