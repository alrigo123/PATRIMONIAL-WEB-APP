import './App.css';
import './styles/styles.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//LANDING PAGE
import HomePageComp from './LandingPage/HomePageComp.js';
import FooterComp from './LandingPage/FooterComp.js';
import PDFViewer from './LandingPage/PDFViewer.js';

// ITEM COMPONENTS
import GeneralSearchComp from './ItemComponents/GeneralSearchComp.js'; // Ajusta la ruta según tu estructura
import ShowItemsComp from './ItemComponents/ShowItemsComp.js';
import CodePropertyComp from './ItemComponents/CodePropertyComp.js';
import WorkerSearchComp from './ItemComponents/WorkerSearchComp.js';
import DependencySearchComp from './ItemComponents/DependencySearchComp.js';
import DoubleSearchComp from './ItemComponents/DoubleSearchComp.js';

// GRID DATA COMPONENTS
// import GridImportedComp from './GridComponents/Grid Test.js';
import UploadExcel from './GridComponents/GridImportedComp.js';
// import GridImportedComp from './GridComponents/GridImportedComp.js';

//NAVIGATION COMPONENTS
import Header from './NavigationComponents/Header.js';
import NavBarComp from './NavigationComponents/NavBarComp.js';
import Error404Comp from './NavigationComponents/Error404Comp.js';

//Handler Components
import EditItemComp from './HandlerComponets/EditItemComp.js';
import AddItemComp from './HandlerComponets/AddItemComp.js';

//CHAT BOT
import ChatBotComp from './chat-test/ChatBotComp.js';
import LockComp from './private/LockComp.js';
import SurfComp from './private/SurfComp.js';

//USER
import RegisterWithPin from './UserComponents/RegisterWithPin.js';
import ProtectedRouteComp from './UserComponents/V1ProtectedRouteComp.js';
// import ProtectedRouteComp from './UserComponents/ProtectedRouteComp.js';
import DashboardAdmin from './UserComponents/DashboardAdmin.js';

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter basename="/inventory">
        <Header />
        <NavBarComp pageWrapID={"page-wrap"} outerContainerId={"outer-container"} />
        <main>
          <Routes>
            {/* Basic Routes */}
            <Route path="/" element={<HomePageComp />} />
            <Route path="/pdf" element={<PDFViewer />} />
            <Route path="/search" element={<GeneralSearchComp />} />
            <Route path="/items" element={<ShowItemsComp />} />
            <Route path="/doble-busqueda" element={<DoubleSearchComp />} />

            {/* Route for 404 pages not found */}
            <Route path="*" element={<Error404Comp />} />

            {/* AI INTEGRATION */}
            <Route path="/chat" element={<ChatBotComp />} />
            <Route path="/2804RST/login" element={<LockComp />} />
            <Route path="/2804RST/surf" element={<SurfComp />} />

            {/* ---- RUTAS NO PROTEGIDAS , X NECESARIO UN LOGIN ----- */}
            {/*
            <Route path="/codigo-patrimonial" element={<CodePropertyComp />} />
            <Route path="/edit/:id" element={<EditItemComp />} />
            <Route path="/add" element={<AddItemComp />} />
            <Route path="/dependencia" element={<DependencySearchComp />} />
            <Route path="/trabajador" element={<WorkerSearchComp />} />
            */}

            {/* ----- Routes and navigation protected ---- */}
            <Route path="/codigo-patrimonial" element={
              <ProtectedRouteComp>
                <CodePropertyComp />
              </ProtectedRouteComp>
            }
            />

            <Route path="/trabajador" element={
              <ProtectedRouteComp>
                <WorkerSearchComp />
              </ProtectedRouteComp>
            }
            />

            <Route path="/dependencia" element={
              <ProtectedRouteComp>
                <DependencySearchComp />
              </ProtectedRouteComp>
            }
            />

            {/* ------ Handler Components Protected as well ----- */}
            <Route path="/edit/:id" element={
              <ProtectedRouteComp>
                <EditItemComp />
              </ProtectedRouteComp>
            }
            />

            <Route path="/add" element={
              <ProtectedRouteComp>
                <AddItemComp />
              </ProtectedRouteComp>
            }
            />

            {/* IMPORT DATA ROUTE */}
            <Route path="/import-excel" element={<UploadExcel />} />
            {/* <Route path="/import-excel" element={<GridImportedComp />} /> */}
            
            {/* USER PIN ACTIONS */}
            <Route path="/user-register" element={<RegisterWithPin />} />
            <Route path="/dashboard-managment" element={<DashboardAdmin />} />

          </Routes>
        </main>
      </BrowserRouter>
      <FooterComp />
    </div>
  );
}

export default App;