import {FaSearch} from 'react-icons/fa'
import {Link} from 'react-router-dom'

export default function Header() {
  return (
    <nav className='bg-slate-50 shadow-md flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
        <div className=''>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                <span className='text-slate-500'>Anny</span>
                <span className='text-slate-700'>RealEstate</span>
            </h1>
        </div>
        </Link>
        <div>
            <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
                <input type='text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 md:w-48 sm:w-72'/>
                <FaSearch className='text-slate-600'/>
            </form>
        </div>
        <div>
            <ul className='flex gap-4 items-center text-sm'>
                <Link to='/'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </Link>
                <Link to='/about'>
                <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                </Link>
                <Link to='/sign-In'>
                <li className='text-slate-700 hover:underline'>Sign In</li>
                </Link>
            </ul>
        </div>
    </nav>
  )
}
