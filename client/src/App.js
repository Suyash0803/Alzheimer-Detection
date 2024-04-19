import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './routes/Home';
import About from './routes/About';
import DemoPage from './routes/DemoPage';
import Contact from './routes/Contact';
import Blalala from './routes/Blalala';

export default function App(){
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/demo" element={<DemoPage/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/Blalala" element={<Blalala/>}/>
      </Routes>
    </div>
  );
}