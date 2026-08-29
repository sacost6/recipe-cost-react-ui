import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Ingredients from './pages/Ingredients';
import Recipes from './pages/Recipes';
import { IngredientsProvider } from './context/IngredientsContext';

export default function App() {
  return (
    <IngredientsProvider>
      <div className="min-h-screen bg-background text-text flex flex-col font-sans">
      <Header/>
        {/* Dynamic Page Routes */}
        <div className='flex-1 flex flex-col'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/ingredients' element={<Ingredients/>}/>
            <Route path='/recipes' element={<Recipes/>}/>
            {/* Fallback route for undefined URLs */}
            <Route path='*' element={<Home/>}/>
          </Routes>
        </div>
        <Footer/>
      </div>
    </IngredientsProvider>
  );
}