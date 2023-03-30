import React, { useState } from "react";
import "../../css/container/container.css";
import Left from './Left'
import Right from './Right'

export default function App() {
    const [leftWidth, setLeftWidth] = useState("10%");
    const [isDragging, setIsDragging] = useState(false);

    const [message, setMessage] = useState('');

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const containerWidth = e.currentTarget.offsetWidth;
        const dragPercentage = e.clientX / containerWidth;
        if (dragPercentage < 0.50) {
            setLeftWidth(`${dragPercentage * 100}%`);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className="container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className="left" style={{ width: leftWidth }}>
                <Left setMessage={setMessage}></Left>
            </div>
            <div className="drag-handle" onMouseDown={handleMouseDown} />
            <div className="right" style={{ width: `calc(100% - ${leftWidth})` }}>
                <Right message={message}></Right>
            </div>
        </div>
    );
}
