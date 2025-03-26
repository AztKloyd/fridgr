import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Switch -> Routes, component -> element
import App from './App'; // 메인 화면
import RecipeDetail from './RecipeDetail'; // 상세 페이지
import Register from './Register'; // 회원가입 페이지
import Login from './Login'; // 로그인 페이지

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 메인 화면: 레시피 목록 */}
        <Route path="/" element={<App />} />

        {/* 상세 페이지: 레시피 수정 및 삭제 */}
        <Route path="/recipe/:id" element={<RecipeDetail />} />

        {/* 로그인 또는 회원가입 후 메인 페이지로 이동 */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 로그인 후 메인 페이지와 상세 페이지 접근 */}
        <Route path="/" element={<App />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
      </Routes>
    </Router>
    
  );
};

export default AppRouter;
