import './App.css';
import CreateForm from './pages/CreateForm';
import { Route, Routes } from 'react-router-dom';
import Form from './pages/Form';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/create-form' element={<CreateForm/>}/>
        <Route path='/form/:formid' element={<Form/>}/>
        <Route path='/auth' element={<AuthPage/>}/>
      </Routes>
    </>
  );
}

export default App;
