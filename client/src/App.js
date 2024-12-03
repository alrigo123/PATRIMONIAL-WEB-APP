import './App.css';
import './styles/styles.css'

//LANDING PAGE
import HomePageComp from './LandingPage/HomePageComp.js';
import FooterComp from './LandingPage/FooterComp.js';

// ITEM COMPONENTS
import GeneralSearchComp from './ItemComponents/GeneralSearchComp.js'; // Ajusta la ruta según tu estructura
import ShowItemsComp from './ItemComponents/ShowItemsComp.js';
import CodePropertyComp from './ItemComponents/CodePropertyComp.js';
import WorkerSearchComp from './ItemComponents/WorkerSearchComp.js';
import DependencySearchComp from './ItemComponents/DependencySearchComp.js';
import DoubleSearchComp from './ItemComponents/DoubleSearchComp.js';

// GRID DATA COMPONENTS
import GridImportedComp from './GridComponents/GridImportedComp.js';

//NAVIGATION COMPONENTS
import Header from './NavigationComponents/Header.js';
import NavBarComp from './NavigationComponents/NavBarComp.js';
import Error404Comp from './NavigationComponents/Error404Comp.js';

//Handler Components
import EditItemComp from './HandlerComponets/EditItemComp.js';
import AddItemComp from './HandlerComponets/AddItemComp.js';

//CHAT BOT
import ChatBotComp from './ChatBotComp.js';

//USER
import RegisterWithPin from './UserComponents/RegisterWithPin.js';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <NavBarComp pageWrapID={"page-wrap"} outerContainerId={"outer-container"} />
        <main>
          <Routes>
            <Route path="/" element={<HomePageComp />} />
            <Route path="/search" element={<GeneralSearchComp />} />
            <Route path="/items" element={<ShowItemsComp />} />
            <Route path="/codigo-patrimonial" element={<CodePropertyComp />} />
            <Route path="/trabajador" element={<WorkerSearchComp />} />
            <Route path="/dependencia" element={<DependencySearchComp />} />
            <Route path="/doble-busqueda" element={<DoubleSearchComp />} />
            <Route path="/import-excel" element={<GridImportedComp />} />
            {/* Ruta para páginas no encontradas */}
            <Route path="*" element={<Error404Comp />} />
            {/* Handler Components */}
            <Route path="/edit/:id" element={<EditItemComp />} />
            <Route path="/add" element={<AddItemComp />} />
            {/* USER ACTIONS */}
            <Route path="/user-register" element={<RegisterWithPin />} />
            {/* AI INTEGRATION */}
            <Route path="/chat" element={<ChatBotComp />} />
          </Routes>
        </main>
      </BrowserRouter>
      <FooterComp />
    </div>
  );
}

export default App;