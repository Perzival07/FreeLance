import { useContext, useEffect, useState } from 'react';
import useSeo from '../hooks/useSeo';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';



const Login = () => {
  // Where to go after logging in (e.g. back to checkout)
  const nextPath = (() => {
    const n = new URLSearchParams(window.location.search).get('next') || '/';
    return n.startsWith('/') && !n.startsWith('//') ? n : '/';
  })();
  useSeo({ title: 'Log in or sign up' });
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
  navigate(nextPath)
}
},[token])



  return (
    <div>
      <form onSubmit={onSubmitHandler} className="card mx-auto my-12 flex w-[92%] flex-col items-center gap-4 px-6 py-10 text-stone-900 shadow-sm sm:max-w-md sm:px-8">

          <div className="mb-2 text-center">
            <h1 className="text-4xl font-semibold">{currentState === 'Login' ? 'Welcome back' : 'Create your account'}</h1>
            <p className="mt-1 text-sm text-stone-600">{currentState === 'Login' ? 'Log in to check out, track orders and see your wishlist.' : 'Save your address and track every order.'}</p>
          </div>

     {currentState === 'Login' ? '' :<input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='input' placeholder='Name' aria-label='Name' autoComplete='name' required/>}
      <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='input' placeholder='Email' aria-label='Email' autoComplete='email' required/>
      <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='input' placeholder='Password' aria-label='Password' autoComplete={currentState === 'Login' ? 'current-password' : 'new-password'} minLength={currentState === 'Login' ? undefined : 8} required/>



      <div className='w-full flex justify-between text-sm mt-[-8px] text-stone-700'>
      {currentState === 'Login' ? (
        <Link to="/forgot-password" className="cursor-pointer hover:text-gold-800 transition-colors">
          Forgot your password?
        </Link>
      ) : (
        <span />
      )}
      {
        currentState === 'Login' ?
        <button type='button' onClick={() => setCurrentState('Sign Up')} className='hover:text-gold-800 transition-colors'>Create an account</button>
        :
        <button type='button' onClick={() => setCurrentState('Login')} className='hover:text-gold-800 transition-colors'>Log in instead</button>
      }

      </div>

<button type='submit' className='btn-primary w-full mt-4'>{currentState === 'Login' ? 'Log in' : 'Create account'}</button>

      {googleClientId && (
        <>
          <div className='w-full flex items-center gap-4 mt-4'>
            <hr className='flex-1 border-cream-300' />
            <span className='text-sm text-stone-600 tracking-widest'>OR</span>
            <hr className='flex-1 border-cream-300' />
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
                    navigate(nextPath);
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
