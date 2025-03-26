import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate로 변경

const RecipeDetail: React.FC = () => {
  const [recipe, setRecipe] = useState<any | null>(null);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const { id } = useParams<{ id: string }>(); // URL에서 레시피 ID 추출
  const navigate = useNavigate(); // useHistory -> useNavigate로 변경
  const [comments, setComments] = useState<any[]>([]); //코멘트 추가 및 표시시
  const [comment, setComment] = useState('');

  // 레시피 데이터 가져오기
  useEffect(() => {
    axios.get(`http://localhost:5000/recipes/${id}`)
      .then(response => {
        setRecipe(response.data);
        setTitle(response.data.title);
        setIngredients(response.data.ingredients);
        setInstructions(response.data.instructions);
        setComments(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the recipe!', error);
        console.error('There was an error fetching comments!', error);
      });
  }, [id]);

  // 레시피 수정
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedRecipe = { title, ingredients, instructions };

    axios.put(`http://localhost:5000/recipes/${id}`, updatedRecipe)
      .then(response => {
        setRecipe(response.data);
        navigate('/'); // 수정 후 메인 화면으로 이동
      })
      .catch(error => {
        console.error('There was an error updating the recipe!', error);
      });
  };

  // 레시피 삭제
  const handleDelete = () => {
    axios.delete(`http://localhost:5000/recipes/${id}`)
      .then(() => {
        navigate('/'); // 삭제 후 메인 화면으로 이동
      })
      .catch(error => {
        console.error('There was an error deleting the recipe!', error);
      });
  };

  // 댓글 추가 및 표시
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
  
    axios.post('http://localhost:5000/comments', { recipeId: id, content: comment })
      .then(response => {
        setComments([...comments, response.data]);
        setComment('');
      })
      .catch(error => {
        console.error('There was an error adding comment!', error);
      });
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="recipe-detail-container">
      <div className="recipe-image-container">
        <img src={recipe.image || 'default-image.jpg'} alt={recipe.title} className="recipe-image" />
      </div>
      <div className="recipe-info">
        <h2>{recipe.title}</h2>
        <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
        <p><strong>Instructions:</strong> {recipe.instructions}</p>

        {/* 수정 버튼 */}
        <button className="button" onClick={() => navigate(`/edit/${recipe._id}`)}>Edit Recipe</button>
        {/* 삭제 버튼 */}
        <button className="button" onClick={handleDelete}>Delete Recipe</button>
      </div>

      {/* 수정 폼 */}
      <form onSubmit={handleUpdate}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Ingredients:</label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>
        <div>
          <label>Instructions:</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
        <button type="submit">Update Recipe</button>
      </form>
      <div>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>{comment.content} - {comment.user.email}</li>
        ))}
      </ul>
      <form onSubmit={handleAddComment}>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" />
        <button type="submit">Add Comment</button>
      </form>
    </div>
    </div>
  );
};

export default RecipeDetail;
