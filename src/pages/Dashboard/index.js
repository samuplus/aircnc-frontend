import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import api from '../../services/api';

import './styles.css';

export default function Dashboard(){
    const [spots, setSpots] = useState([]);
    const [requests, setRequests] = useState([]);

    const user_id = localStorage.getItem('user');
    const socket = useMemo(() => socketio(process.env.REACT_APP_API_URL, {
        query: { user_id }
    }), [user_id]);

    // Trigger function as soon as component is displayed on screen
    useEffect(() => {
        // Listen to socket
        socket.on('booking_request', data => {
            setRequests([...requests, data]);
        })
    }, [requests, socket]);


    useEffect(() => {
       async function loadSpots() {
           const user_id = localStorage.getItem('user');
           const response = await api.get('/dashboard', {
               headers: { user_id }
           });

           setSpots(response.data);
       }
       loadSpots();
    }, []);

    async function handleAccept(id) {
        await api.post(`/bookings/${id}/approvals`);

        // Remove request from list
        setRequests(requests.filter(request => request._id !== id));
    }

    async function handleReject(id) {
        await api.post(`/bookings/${id}/rejections`);

        // Remove request from list
        setRequests(requests.filter(request => request._id !== id));
    }

    async function handleDelete(id) {
        await api.delete(`spots/${id}`);

        setSpots(spots.filter(spots => spots._id !== id));
    }

    return (
        <>
            <ul className="notifications">
                {requests.map(request => (
                    <li key={request._id}>
                        <p>
                            <strong>{request.user.email}</strong> has requested to book a desk at <strong>{request.spot.company}</strong> for the <strong>{request.date}</strong> 
                        </p>
                        <button className="accept" onClick={() => handleAccept(request._id)}>ACCEPT</button>
                        <button className="reject" onClick={() => handleReject(request._id)}>REJECT</button>
                    </li>
                ))}


            </ul>

            <ul className="spot-list">
                {spots.map(spot => (
                    <li key={spot._id}>
                        <header style={{ backgroundImage: `url(${spot.url})` }} />
                        <strong>{spot.company}</strong>
                        <span>{spot.price ? `£${spot.price} per day` : 'FREE' }</span>
                        <button onClick={() => handleDelete(spot._id)}>DELETE SPOT</button>
                    </li>
                ))}
            </ul>

            <Link to="/new">
                <button className="btn">Register a new spot</button>
            </Link>

        </>
    )
}