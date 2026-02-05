import { BrowserRouter,Routes, Route } from 'react-router-dom'
import Signup from './auth/Signup'
import Login from './auth/Login'
import UserManagement from './pages/admin/UserManagement'
import ProfilePage from './pages/customer/ProfilePage'
import ProtectedRoute from './component/ProtectedRoute'
import MainLayout from './component/MainLayout'
import AdminSidebar from './pages/admin/AdminSidebar'
import AdminMoviePage from './pages/admin/AdminMoviePage'



function App() {
  

  return (
    
    <MainLayout>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Page */}
        <Route
          path="/admin/usermanagement"
          element={
            <ProtectedRoute allowedRole="Admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/moviemanagement"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminMoviePage />
            </ProtectedRoute>
          }
        />

        {/* Customer Page */}
        <Route
          path="/profilepage"
          element={
            <ProtectedRoute allowedRole="Customer">
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MainLayout>
  )
}

export default App
