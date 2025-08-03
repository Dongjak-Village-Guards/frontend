import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SearchAddress from './pages/SearchAddress';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/search-address' element={<SearchAddress />} />
      </Routes>
    </BrowserRouter>
  );
}

// ' /search-address ' 바꾸면 안됨요 !!!!!!! 여기다가 API 연결함

export default App;