import React, {useState , useEffect} from 'react';
import { useHistory, Link, useParams } from 'react-router-dom';
import api from '../../services/api';

import './styles.css';
import { FiArrowLeftCircle } from 'react-icons/fi'

export default function NewBook(){
    const [ id, setId] = useState('null');
    const [ author, setAuthor] = useState('');
    const [ launchDate, setLaunchDate] = useState('');
    const [ title, setTitle] = useState('');

    const {bookId} = useParams();
    
    const accessToken = localStorage.getItem('accessToken');

    const history = useHistory();
 
async function loadBook() {
    try {
        const response = await api.get(`api/book/v1/${bookId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        let adjustedDate = response.data.launchDate.split("T", 10)[0];

        setId(response.data.id);
        setTitle(response.data.title);
        setAuthor(response.data.author);
        setLaunchDate(adjustedDate);
    } catch (error) {
        alert('Error recovering Book! Try again!');

    }
}
useEffect(() => {
    if (bookId === '0') return;
    else loadBook();
},[bookId])

async function saveOrUpdate(e){
    e.preventDefault();

    const data = {
        title,
        author,
        launchDate,
    }

    try {
        if (bookId === '0') {
            await api.post('api/book/v1', data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        } else {
            data.id = id;
            await api.put('api/book/v1', data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        }
        history.push('/books');
    } catch (err) {
        alert('Error while recording Book! Try again!')
    }
}

    return(
        <div className="new-book-container">
        <div className="content">
        <section className="form">
            <h1>{bookId === '0' ? 'Add new Post' : 'Update'}</h1>
            <p>Enter the post information and click on{bookId === '0' ? ' Add' : 'Update'}🔖</p>
                <Link  className="back-link" to="/books">
                    <FiArrowLeftCircle size={40}  />

                </Link>
        </section>
            <form onSubmit={saveOrUpdate}>
                <input 
                    placeholder="Digite seu post!"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <input 
                    placeholder="Digite seu nome"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                />
                <input 
                    type="date"
                    value={launchDate} 
                    onChange={e => setLaunchDate(e.target.value)}
                />

                <button className="button" type="submit">{bookId === '0' ? 'Add' : 'Update'} </button>
            </form>
            

        </div>

        </div>

    );
    }