import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import IngredientsPage from './features/ingredients/pages/IngredientsPage';
import Recipes from './pages/Recipes';
import { IngredientsProvider } from './features/ingredients/IngredientsContext';

export default function App() {
  return (
    <IngredientsProvider>
      <div className="min-h-screen bg-background text-text flex flex-col font-sans">
      <Header/>
        {/* Dynamic Page Routes */}
        <div className='flex-1 flex flex-col'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/ingredients' element={<IngredientsPage/>}/>
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