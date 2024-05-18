import React from 'react'
import {Link, useNavigate} from 'react-router-dom'

export default function SignUp() {
  const [formData, setFormData] = React.useState({
    userName: '',
    email: '',
    password: ''
  })
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

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
      setLoading(true);
      const res = await fetch('/user/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json()
      console.log(data)
      if(data.error) {
        setLoading(false)
        setError(data.message)
        return
      }
      setLoading(false)
      setError(null)
      navigate('/sign-In')
    } catch (error) {
      setLoading(false)
      // setError(error.message)
    }
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center my-7 font-semibold'>
        Sign Up
      </h1>
      <form onSubmit={handleSubmit} className='flex justify-center gap-2 flex-col'>
        <input type="text" placeholder='UserName' className='border p-3 rounded-lg' id='userName' name='userName' onChange={handleChange} value={formData.userName}/>
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' name='email' onChange={handleChange} value={formData.email}/> 
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' name='password' onChange={handleChange} value={formData.password}/>
        <button disabled={loading} className='bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-85 p-3'>
          {loading ? 'Loading...': 'sign up'}
        </button>
        <button className='bg-red-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-85 p-3'>Continue with google</button>
      </form>
      <div className='mt-2'>
      <p className='inline mr-2'>Have an account?</p>
      <Link to={'/sign-In'}>
        <span className='text-blue-700'>Sign in</span>
      </Link>
      </div>
      {error && <p className='text-red-700'>{error}</p>}
    </div>
  )
}
