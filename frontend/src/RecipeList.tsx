import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 검색어가 있으면 백엔드에서 필터링된 레시피 가져오기
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipes/search?query=${searchQuery}`);
        setRecipes(response.data);
      } catch (error) {
        console.error('There was an error fetching the recipes!', error);
      }
    };

    fetchRecipes();
  }, [searchQuery]); // 검색어가 바뀔 때마다 호출

  return (
    <div className="recipe-list-container">
      <input
        type="text"
        placeholder="Search by title or ingredients"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // 입력값으로 searchQuery 상태 업데이트
        className="search-input"
      />
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div className="recipe-card" key={recipe._id}>
            <img src={recipe.image || 'default-image.jpg'} alt={recipe.title} className="recipe-image" />
            <div className="recipe-info">
              <h3>{recipe.title}</h3>
              <p>{recipe.ingredients}</p>
              <p>{recipe.instructions.slice(0, 100)}...</p>
              <button>View Details</button>
            </div>
          </div>
        ))
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
};

export default RecipeList;