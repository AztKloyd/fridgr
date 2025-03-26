import React, { useState } from 'react';

const SubmitForm: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 제출 로직
    setMessage('Your recipe has been added successfully!');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Recipe Name" required />
        <button type="submit">Submit</button>
      </form>
      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default SubmitForm;