import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

import './styles.css';


import padlock from '../../assents/padlock.png';

export default function Login() {

   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');

   const history = useHistory();

   async function login(e){
       e.preventDefault();

       const data = {
           username,
           password,
       };

       try {
           const response = await api.post('auth/signin', data);

           localStorage.setItem('username', username);
           localStorage.setItem('accessToken', response.data.token);

           history.push('/books')
       } catch (err) {
           alert('Login failed! Try again!');
       }
   };

   return (
       <div className="login-container">
           <section className="form">

               <form onSubmit={login}>
                   <h1>Access your Account</h1>
                   <input
                       placeholder="Username"
                       value={username}
                       onChange={e => setUsername(e.target.value)}
                   />
                   <input
                       type="password" placeholder="Password"
                       value={password}
                       onChange={e => setPassword(e.target.value)}
                   />

                   <button className="buttonlogin" type="submit">Login</button>
               </form>

           </section>
        
           <img src={padlock} alt="Login"/>
        
       </div>
   )

}