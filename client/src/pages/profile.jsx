import { useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react' // To reference a click
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { app } from '../firebase'

export default function Profile() {
  const Dispatch = useDispatch()
  const fileRef = useRef(null)
  const {currentUser, loading, error} = useSelector(state => state.user)
  const [file, SetFile] = useState(undefined)
  const [fileError, setFileError] = useState(false)
  const [upload, setUpload] = useState(0)
  const [formData, setFormData] = useState({userName:currentUser.userName, email:currentUser.email})
  
  useEffect(() => {
    if(file) handleFileChange(file)
  }, [file])

  function handleFileChange(file) {
    const storage = getStorage(app)
    const fileName = new Date().getTime + file.name // To have a unique name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file) 

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUpload(Math.round(progress))  
      },
    
      (error) => {
        setFileError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURl) => {
          setFormData({...formData, avatar:downloadURl})
        })
      }
    ) 
  }

  function handleChange(e) {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      Dispatch(updateStart())
      const res = await fetch(`/user/update/${currentUser._id}`, {
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
        Dispatch(updateFailure(data.error))
        return
      }
      Dispatch(updateSuccess(data))
    } catch (error) {
      Dispatch(updateFailure(error.message))
    }

  }

  return (
    <div className='max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => SetFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/.*'/> 
        <img onClick={() => fileRef.current.click()} src= {formData.avatar || currentUser.avatar} alt="profile_image" className='self-center rounded-full cursor-pointer w-20 h-20 object-cover object-center'/>
        <p className='text-center'>
          {fileError ? <span className='text-red-700'>Error..image not uploaded</span> : 
          upload > 0 && upload < 100 ? <span className='text-yellow-500'>{`Uploading ${upload}%`}</span> :
          upload === 100 || fileError ? <span className='text-green-700'>Uploaded successfully</span> : ""}
        </p>
        <input type="text" placeholder='UserName' className='border p-3 rounded-lg' id='userName' name='userName' value={formData.userName} onChange={handleChange} />
        <input type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' name='email' value={formData.email} onChange={handleChange}/>
        <input type="password" placeholder='OldPassword' className='border p-3 rounded-lg' id='oldPassword' name='oldPassword' onChange={handleChange}/> 
        <input type="password" placeholder='NewPassword' className='border p-3 rounded-lg' id='newPassword' name='newPassword'  onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-85 p-3'>
          {loading ? 'loading':'update'}
        </button>
      </form>
      <div className='text-red-700 flex justify-between my-4'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully' : ''}</p>
    </div>
  )
}

