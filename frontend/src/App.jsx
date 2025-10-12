
import './App.css'
import { Route, Router, Routes } from 'react-router-dom'
import Layouts from './Layouts'
import Home from './page/Home'
import AddBlog from "./page/AddBlog"
import Login from './page/Login'
import Signup from './page/Signup'
function App() {


  return (
    <>
 
    <Routes>
      <Route element={<Layouts/>}>
      <Route index element={<Home />} />
      <Route  path="/addblog" element={<AddBlog />}/>
      </Route>
      <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
    </Routes>

    </>
  )
}

export default App
