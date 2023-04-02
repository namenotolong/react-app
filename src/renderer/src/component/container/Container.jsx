import React, { useState } from "react";
import "../../css/container/container.css";
import Left from './Left'
import {Tabs } from 'antd';
import Tables from './Tables'

export default function App() {
    const [leftWidth, setLeftWidth] = useState("20%");
    const [isDragging, setIsDragging] = useState(false);
    const [items, setItems] = useState([]);
    const [activeKey, setActiveKey] = useState();
    const types = ['tables', 'table-preview', 'table-struct', 'table-create', 'table-update', 'query']

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

    const clickDatabase = async e => {
        const newTabName = e.name + '_' + e.database + '_tables';
        const targetIndex = items.findIndex((pane) => pane.key === newTabName);
        if (targetIndex > -1) {
            setActiveKey(newTabName);
        } else {
            const data = await window.database.showTables(e);
            setItems([
                ...items,
                {
                    label: e.database + '@tables',
                    children: <Tables data={data}/>,
                    key: newTabName,
                },
            ]);
            setActiveKey(newTabName);
        }
    }
    const onChange = (key) => {
        setActiveKey(key);
    };

    const remove = (targetKey) => {
        const targetIndex = items.findIndex((pane) => pane.key === targetKey);
        const newPanes = items.filter((pane) => pane.key !== targetKey);
        if (newPanes.length && targetKey === activeKey) {
            const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
            setActiveKey(key);
        }
        setItems(newPanes);
    };
    const onEdit = (targetKey, action) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };

    return (
        <div className="container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className="left" style={{ width: leftWidth }}>
                <Left clickDatabase={clickDatabase}></Left>
            </div>
            <div className="drag-handle" onMouseDown={handleMouseDown} />
            <div className="right" style={{ width: `calc(100% - ${leftWidth})` }}>
                <Tabs
                    hideAdd
                    onChange={onChange}
                    activeKey={activeKey}
                    type="editable-card"
                    onEdit={onEdit}
                    items={items}
                />
            </div>
        </div>
    );
}
