import { BrowserRouter,Routes, Route } from 'react-router-dom'
import Signup from './auth/Signup'
import Login from './auth/Login'


function App() {
  

  return (
    
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
   
  )
}

export default App
