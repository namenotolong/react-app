import React, { useState } from 'react';
import { List } from 'antd';

const data = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

const ColoredList = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = index => setActiveIndex(index);
  const handleMouseEnter = index => setActiveIndex(index);
  const handleMouseLeave = () => setActiveIndex(null);

  const renderItem = (item, index) => {
    const isActive = index === activeIndex;

    return (
      <List.Item
        onClick={() => handleClick(index)}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        style={{ background: isActive ? '#1890ff' : 'transparent', color: isActive ? 'white' : 'inherit' }}
      >
        {item}
      </List.Item>
    );
  };

  return <List dataSource={data} renderItem={renderItem} />;
};

export default ColoredList;
