import { List, Card } from 'antd';
import { useState } from 'react';


const App = props => {
    const [position, setPosition] = useState('bottom');
    const [align, setAlign] = useState('center');
    let data = props.data

    // 每页最多显示4列
    const PAGE_SIZE = 3;
    const PAGE_ITEM_LENGTH = Math.floor(data.length / PAGE_SIZE)

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


    return (
        <div>
            <div style={{ display: 'flex', marginLeft: 5 }}>
                {pageData.map((item, index) => (
                    <div key={index} style={{ marginRight: 20 }}>
                        <List dataSource={item} renderItem={(item) => <List.Item>{item}</List.Item>} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App