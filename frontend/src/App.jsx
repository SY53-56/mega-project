
import './App.css'
import { Route, Router, Routes } from 'react-router-dom'
import Layouts from './Layouts'
import Home from './page/Home'
import AddBlog from "./page/AddBlog"
import Login from './page/Login'
import CreateAccount from './page/CreateAccount'
import UserPage from './page/UserPage'
import UpdateBlog from './page/UpdateBlog'
import UserAccount from './page/UserAccount'
import SaveBlog from './page/SaveBlog'
function App() {


  return (
    <>
 
    <Routes>
      <Route element={<Layouts/>}>
      <Route index element={<Home />} />
      <Route  path="/addblog" element={<AddBlog />}/>
      <Route path={`/userpage/:id`} element={<UserPage />}/>
      <Route path={'/userUpdate/:id'} element={<UpdateBlog />}/>
      <Route path={`/user/:id/blogs`} element={<UserAccount/>}/>
      <Route path={`/saveBlog/:id`} element={<SaveBlog/>}/>
      </Route>
      <Route path='/login' element={<Login/>}/>
            <Route path='/createaccount' element={<CreateAccount/>}/>
    </Routes>

    </>
  )
}

export default App
