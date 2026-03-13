import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './pages/inicio';
import Login from './pages/admin/login';
import AdminDashboard from './pages/admin/adminDashboard';
import ProtectedRoute from './components/protectedRoute';
import AdminHome from './pages/admin/adminHome';
import AdminSuspended from './pages/admin/llavesSuspendidas';
import AdminResponsables from './pages/admin/adminResponsables';
import PrestamoLlaves from './pages/prestamoLlaves';
import RegistrosPrestamos from './pages/registroPrestamos';
import LlavesPrestadas from './pages/llavesPrestadas';
import CambiarPasswordResponsable from './pages/cambiarContraseñaResponsable';
import RegistrosPrestamosAdmin from './pages/admin/registroPrestamosAdmin';
import LlavesPrestadasAdmin from './pages/admin/llavesPrestadasAdmin';

function App() {
  return (
    <Router>
      <Routes>
        {/*Página de inicio */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/prestamoLlave" element={<PrestamoLlaves />} />
        <Route path="/registroPrestamo" element={<RegistrosPrestamos />} />
        <Route path="/llavesPrestadas" element={<LlavesPrestadas />} />
        <Route path="/cambiarContraseñaResponsable" element={<CambiarPasswordResponsable />} />

        // Rutas de admin protegidas
        <Route element={ <ProtectedRoute /> }>
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/suspended" element={<AdminSuspended />} />
          <Route path="/admin/responsables" element={<AdminResponsables />} />
          <Route path="/admin/registroPrestamoAdmin" element={< RegistrosPrestamosAdmin />} />
          <Route path="/admin/llavesPrestadas" element={<LlavesPrestadasAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
