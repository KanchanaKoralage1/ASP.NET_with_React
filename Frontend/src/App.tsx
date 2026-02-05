import { BrowserRouter,Routes, Route } from 'react-router-dom'
import Signup from './auth/Signup'
import Login from './auth/Login'
import UserManagement from './pages/admin/UserManagement'
import ProfilePage from './pages/customer/ProfilePage'


function App() {
  

  return (
    
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/usermanagement" element={<UserManagement />} />
      <Route path="/profilepage" element={<ProfilePage />} />
    </Routes>
   
  )
}

export default App
