import React ,{useState, useEffect} from 'react';
import { Link,useHistory } from 'react-router-dom';
import './styles.css';
import api from '../../services/api';

import { VscFoldDown } from "react-icons/vsc";
import {FiPower,FiEdit,FiTrash2} from 'react-icons/fi'

export default function Books(){

    const [books,setBooks] = useState([]);
    const [page, setPage] = useState(1);

    const username = localStorage.getItem('username');
    const accessToken = localStorage.getItem('accessToken');

    const history = useHistory();

    async function logout() {
        localStorage.clear();
        history.push('/');
    }

    async function editBook(id) {
        try {
            history.push(`new/book/${id}`)
        } catch (error) {
            alert('Edit failed! Try again.');
        }
    }

    async function deleteBook(id) {
        try {
            await api.delete(`api/book/v1/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            setBooks(books.filter(book => book.id !== id))
        } catch (err) {
            alert('Delete failed! Try again.');
        }
    }
    
    async function fetchMoreBooks() {
        const response = await api.get('api/book/v1', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                page: page,
                limit: 3,
                direction: 'asc'
            }
        });

        setBooks([ ...books, ...response.data._embedded.bookVoes])
        setPage(page+1);
    }

    useEffect(() => {
        fetchMoreBooks();
    },[])

    return (
        <div className="books-container">
            <header>
                <span>Welcome, <strong> {username.toUpperCase()}  </strong>!😄 </span> 
                <div className="buttonBooks">
                <Link className="button" to="/new/book/0">Add New Post</Link>
                <button onClick={logout} type="button">
                    <FiPower size={18} color ="#251FC5" />
                </button>
                </div>
            </header>

            <h1>Blog Maker</h1>
            
            <ul>
        {books.map(book =>(
            <li key={book.id}>
                <strong>Assunto:</strong>
                <p>{book.title}</p>
                <strong>Autor:</strong>
                <p>{book.author}</p>
                <strong>Data de Postagem:</strong>
                <p>{Intl.DateTimeFormat('pt-BR').format(new Date(book.launchDate))}</p>

                <button onClick={() => editBook(book.id)} type="buttonIcon">
                    <FiEdit size={20} color="#251FC5"/>
                </button>

                <button onClick={() => deleteBook(book.id)} type="buttonIcon">
                    <FiTrash2 size={20} color="#251FC5"/>
                </button>

            </li>
        ))}
            </ul>
            
            <button className="moreBooks" onClick={fetchMoreBooks} type="button">
                < VscFoldDown size={20} color="#251FC5" />
            </button>
                            
        </div>
    );

}
