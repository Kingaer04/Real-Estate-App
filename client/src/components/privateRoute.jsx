import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom' // to keep componet private and the are components

export default function privateRoute() {
    const {currentUser} = useSelector(state => state.user)
  return currentUser ? <Outlet/> : <Navigate to= '/sign-In'/>

}
