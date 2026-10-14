import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';



const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const {token, setToken, navigate, backendUrl} = useContext(ShopContext);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
 




  const onSubmitHandler = async (event) =>{
    event.preventDefault();
    try {
      if (currentState === 'Sign Up'){
        const response = await axios.post(backendUrl + '/user/register',{
          name,
          email,
          password
        })
        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          } else {
            localStorage.removeItem('refreshToken');
          }
        } else {
          toast.error(response.data.message)
        }
        
      } else {

        const response = await axios.post(backendUrl + '/user/login',{
          email,
          password
        })
    
        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          } else {
            localStorage.removeItem('refreshToken');
          }
        } else {
          toast.error(response.data.message)
        }
      }
      
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    }
  }



  // Redirect to home page if token is set
  // This will happen when user is logged in
useEffect(() =>{
if(token){
  navigate('/')
}
},[token])



  return (
    <div>
      <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 mb-14 gap-4 text-ivory-100 card-luxury px-8 py-10 shadow-gold">

          <div className="inline-flex items-center gap-2 mb-2">
            <p className="font-display text-3xl text-gold-gradient">{currentState}</p>
            <hr className='border-none h-[1.5px] w-8 bg-gold-500'/>
          </div>

     {currentState === 'Login' ? '' :<input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gold-500/30 focus:border-gold-400 bg-ink-950 outline-none transition-colors' placeholder='Name' required/>}
      <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gold-500/30 focus:border-gold-400 bg-ink-950 outline-none transition-colors' placeholder='Email' required/>
      <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gold-500/30 focus:border-gold-400 bg-ink-950 outline-none transition-colors' placeholder='Password' required/>



      <div className='w-full flex justify-between text-sm mt-[-8px] text-ivory-300'>
      {currentState === 'Login' ? (
        <Link to="/forgot-password" className="cursor-pointer hover:text-gold-400 transition-colors">
          Forgot your password?
        </Link>
      ) : (
        <span />
      )}
      {
        currentState === 'Login' ?
        <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer hover:text-gold-400 transition-colors'>Create an account</p>
        :
        <p onClick={() => setCurrentState('Login')} className='cursor-pointer hover:text-gold-400 transition-colors'>Login Here</p>
      }

      </div>

<button className='btn-gold w-full mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>

      {googleClientId && (
        <>
          <div className='w-full flex items-center gap-4 mt-4'>
            <hr className='flex-1 border-gold-500/20' />
            <span className='text-sm text-ivory-400 tracking-widest'>OR</span>
            <hr className='flex-1 border-gold-500/20' />
          </div>

          <div className='w-full mt-4 flex justify-center'>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const response = await axios.post(backendUrl + '/user/google-auth', {
                    tokenId: credentialResponse.credential
                  });
                  
                  if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                    if (response.data.refreshToken) {
                      localStorage.setItem('refreshToken', response.data.refreshToken);
                    } else {
                      localStorage.removeItem('refreshToken');
                    }
                    toast.success('Login successful!');
                    navigate('/');
                  } else {
                    toast.error(response.data.message || 'Google login failed');
                  }
                } catch (error) {
                  console.log(error);
                  toast.error(error.response?.data?.message || 'Google login failed');
                }
              }}
              onError={() => {
                toast.error('Google login failed');
              }}
              useOneTap
            />
          </div>
        </>
      )}

      </form>
    </div>
  )
}

export default Login
