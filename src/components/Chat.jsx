import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { v1 as uuid } from 'uuid';
import { logout } from '../actions';
import './Chat.css';
import colors from '../colors';

const Chat = () => {
  const username = useSelector((state) => state.username);
  const socketRef = useRef();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const random = Math.floor(Math.random() * 22);
    const randomColor = colors[random];
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('newuser', { username, color: randomColor });
    socketRef.current.on('welcome user', (msg) => setMessages((prevMessages) => [...prevMessages, msg]));
    socketRef.current.on('inform chat', (msg) => setMessages((prevMessages) => [...prevMessages, msg]));
    socketRef.current.on('message', (msg) => setMessages((prevMessages) => [...prevMessages, msg]));
    socketRef.current.on('disconnect', () => dispatch(logout()));
    socketRef.current.on('disconnect reason', (msg) => setMessages((prevMessages) => [...prevMessages, msg]));

    return () => socketRef.current.disconnect();
  }, [dispatch, username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.length < 1) return;
    socketRef.current.emit('message', { username, message });
    setMessage('');
  };

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  const style = (type) => {
    if (type === 'chatbot') return 'chatbot';
    if (type === 'broadcast') return 'broadcast';
    if (type === username) return 'message-out';
    return type;
  };

  return (
    <div className="chat-room">
      <div className="header">
        <img className="header-logo" src="./images/header-logo.png" alt="" />
        <button type="button" aria-label="Sign-Out Button" className="sign-out-button" onClick={() => socketRef.current.disconnect()}>
          <i className="fas fa-sign-out-alt" />
        </button>
      </div>
      <div className="chat-container">
        {messages.map((data) => (
          <div key={uuid()} className={`${style(data.username)} outer-message-container`}>
            <div className={`${style(data.username)}-background inner-message-container`}>
              <p className={data.username === username || data.username === 'broadcast' ? 'hidden username' : 'username'} style={{ color: data.color }}>
                { data.username }
              </p>
              <p className="message">
                {data.message}
                <span className="time-stamp">{data.time}</span>
              </p>
              <AlwaysScrollToBottom />
            </div>
          </div>
        ))}
      </div>
      <form className="message-input-container" onSubmit={(e) => sendMessage(e)}>
        <input className="message-input" onChange={(e) => setMessage(e.target.value)} type="text" name="name" value={message} maxLength={100} placeholder="Your message" />
        <button aria-label="Send Message" className="submit-button" type="submit">
          <i className="fas fa-arrow-right" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
