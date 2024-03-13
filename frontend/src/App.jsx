import Form from "./Form"
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Home from "./Home"
import AppContext from "./AppContext"
import { useState } from "react";
import UpdateUser from "./UpdateUser";


function App() {
  const [user, setUser] = useState({status: ''});
  const changeUserState = async (values) => {
    let newUser = await UpdateUser(values)
    setUser(newUser)
    return newUser
}
  return (
    <AppContext.Provider value={{ user, changeUserState, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={user.status === 'Active' ? <Navigate to='/home' /> : <Form heading='Login' />}></Route>
          <Route path='/signup' element={<Form heading='Sign up' />}></Route>
          <Route path='/home' element={user.status === 'Active' ? <Home /> : <Navigate to='/' />}></Route>
        </Routes>
      </BrowserRouter>
      </AppContext.Provider>
  )
}

export default App
