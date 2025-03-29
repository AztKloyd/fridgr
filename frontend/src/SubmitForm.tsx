import React, { useState } from 'react';
import axios from 'axios';

const SubmitForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  // 폼 제출 처리 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // FormData 객체 생성 (이미지와 텍스트 데이터를 함께 전송)
    const formData = new FormData();
    formData.append('title', title);
    formData.append('ingredients', ingredients);
    formData.append('instructions', instructions);
    if (image) formData.append('image', image);

    try {
      // 백엔드 API로 레시피 추가 요청
      const response = await axios.post('http://localhost:5000/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // response.data 사용
      if (response.data) {
        setMessage('Your recipe has been added successfully!'); // 성공 메시지
      }
    } catch (error) {
      console.error('Error adding recipe:', error);
      setMessage('There was an error adding your recipe.'); // 실패 메시지
    }
  };

  return (
    <div>
      <h2>Add a New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Recipe Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Recipe Name"
            required
          />
        </div>
        <div>
          <label>Ingredients:</label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="List of ingredients"
            required
          />
        </div>
        <div>
          <label>Instructions:</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Cooking instructions"
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {/* 성공 또는 실패 메시지 표시 */}
      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default SubmitForm;