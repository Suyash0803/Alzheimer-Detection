import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './routes/Home';
import About from './routes/About';
import Contact from './routes/Contact';
import Assessment from './routes/Assessment';

export default function App(){
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/assessment" element={<Assessment/>}/>
      </Routes>
    </div>
  );
}