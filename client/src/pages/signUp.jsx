import React from 'react'
import {Link} from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center my-7 font-semibold'>
        Sign Up
      </h1>
      <form className='flex justify-center gap-2 flex-col'>
        <input type="text" placeholder='UserName' className='border p-3 rounded-lg' id='userName'/>
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email'/>
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' id='password'/>
        <button className='bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-85 p-3'>Sign Up</button>
        <button className='bg-red-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-85 p-3'>Continue with google</button>
      </form>
      <div className='mt-2'>
      <p className='inline mr-2'>Have an account?</p>
      <Link to={'/sign-In'}>
        <span className='text-blue-700'>Sign in</span>
      </Link>
      </div>
    </div>
  )
}
