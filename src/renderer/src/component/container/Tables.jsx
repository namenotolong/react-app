import { List } from 'antd';
import { useState } from 'react';
import { InsertRowAboveOutlined, PlusSquareOutlined, CloseCircleOutlined, FolderOpenOutlined, FormOutlined, TableOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const App = props => {
    const [focurs, setFocurs] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [clickTable, setClickTable] = useState(null);

    const handleClick = item => {
        setClickTable(item);
        setFocurs(true)
    };
    const handleMouseEnter = index => setActiveIndex(index);
    const handleMouseLeave = () => {
        setActiveIndex(null)
    }

    let data = props.data.map((e, index) => {
        return { 'name': e, 'id': index };
    })

    // 每页最多显示4列
    const PAGE_SIZE = 3;
    const PAGE_ITEM_LENGTH = Math.floor(data.length / PAGE_SIZE)
    const str = '  '

    // 根据选中的页数计算要显示的数据
    const pageData = [];
    if (data.length < PAGE_SIZE) {
        pageData.push(data);
    } else {
        let i = 0;
        let j = Math.floor(data.length % PAGE_SIZE) + PAGE_ITEM_LENGTH;
        do {
            pageData.push(data.slice(i, j));
            i = j;
            j = j + PAGE_ITEM_LENGTH;
        } while (i < data.length);
    }

    const onItemClick = e => {
        console.log(e)
    }
    
    return (
        <div>
            <div style={{ marginLeft: 5 }}>
                <Button disabled={!focurs} onClick={() => {
                    props.handleHeaderButtonClickEvent('open', clickTable.name, props.params)
                }}>
                    <FolderOpenOutlined /> 打开表
                </Button>
                {str}
                <Button disabled={!focurs} onClick={() => props.handleHeaderButtonClickEvent('desgin', clickTable.name, props.params)}>
                    <FormOutlined /> 设计表
                </Button>
                {str}
                <Button onClick={() => props.handleHeaderButtonClickEvent('create', clickTable.name, props.params)}>
                    <PlusSquareOutlined /> 新建表
                </Button>
                {str}
                <Button disabled={!focurs} onClick={() => props.handleHeaderButtonClickEvent('query', clickTable.name, props.params)}>
                    <TableOutlined /> 查询
                </Button>
            </div>
            <div style={{ display: 'flex', marginLeft: 5, marginTop: 10 }}>
                {pageData.map((item, index) => (
                    <div key={index} style={{ marginRight: 20, marginLeft: 10 }}>
                        <List dataSource={item} renderItem={(item) => {
                            const isActive = item.id === activeIndex;
                            const isFocus = clickTable == null ? false : item.id === clickTable.id;
                            return (<List.Item
                                key={item.id}
                                onClick={() => handleClick(item)}
                                onMouseEnter={() => handleMouseEnter(item.id)}
                                onMouseLeave={handleMouseLeave}
                                style={{
                                    background: isActive ? 'rgb(245,245,245)' : 'transparent',
                                    color: isFocus ? 'rgb(7,128,216)' : 'black'
                                }}
                            >
                                <InsertRowAboveOutlined />{str}{item.name}
                            </List.Item>);
                        }
                        } />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App