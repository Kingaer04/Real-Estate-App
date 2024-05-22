import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

export default function SignIn() {
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  })
  const {loading, error} = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  function handleChange(event) {
    const{id, value, name} = event.target
    setFormData(prevData => {
        return {
            ...prevData,
            [name] : value
        }
    })
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/user/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      const data = await res.json()
      console.log(data)
      if(data.error) {
        dispatch(signInFailure(data.error))
        return
      }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center my-7 font-semibold'>
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className='flex justify-center gap-2 flex-col'>
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' name='email' onChange={handleChange} value={formData.userName}/> 
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' name='password' onChange={handleChange} value={formData.password}/>
        <button disabled={loading} className='bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-85 p-3'>
          {loading ? 'Loading...': 'sign in'}
        </button>
        <OAuth/>
      </form>
      <div className='mt-2'>
      <p className='inline mr-2'>Dont have an account?</p>
      <Link to={'/sign-Up'}>
        <span className='text-blue-700'>Sign Up</span>
      </Link>
      </div>
      {error && <p className='text-red-700'>{error}</p>}
    </div>
  )
}
