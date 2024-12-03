import React, { useState } from 'react';
import axios from 'axios';

const ChatBotComp = () => {

    const [messages, setMessages] = useState([]); // Almacena las interacciones
    const [inputMessage, setInputMessage] = useState('');

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        // Agregar mensaje del usuario al estado
        const userMessage = { sender: 'user', text: inputMessage };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            const response = await axios.post('http://localhost:3030/api/chat', { message: inputMessage });

            // Agregar la respuesta del bot al estado
            const botMessage = { sender: 'bot', text: response.data.reply };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            const errorMessage = { sender: 'bot', text: 'Hubo un error al procesar tu mensaje.' };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }

        // Limpiar el campo de entrada
        setInputMessage('');
    };

    return (
        <div>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    )
}

export default ChatBotComp
