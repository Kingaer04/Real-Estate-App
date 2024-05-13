import {Routes, Route, BrowserRouter} from 'react-router-dom'
import Home from './pages/home'
import SignIn from './pages/signIn'
import SignUp from './pages/signUp'
import About from './pages/about'
import Profile from './pages/profile'
import Header from './components/header'

export default function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/Sign-In' element={<SignIn/>}/>
      <Route path='/Sign-Up' element={<SignUp/>}/>
      <Route path='/About' element={<About/>}/>
      <Route path='/Profile' element={<Profile/>}/>
    </Routes>
    </BrowserRouter>
  )
}
