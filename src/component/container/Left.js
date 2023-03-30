import { DownOutlined, DatabaseOutlined, ForkOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Tree } from 'antd';
import { useEffect, useState } from 'react';

const data = [
    {
        title: 'localhost',
        key: '0-0',
        type: 'connection',
        icon: <ForkOutlined />,
    },
    {
        title: 'master',
        key: '0-1',
        icon: <ForkOutlined />,
    },
];

const updateTreeData = (list, key, children) => {
    return list.map((node) => {
        if (node.key === key) {
            return {
                ...node,
                children,
            };
        }
        if (node.children) {
            return {
                ...node,
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
    });
}
const App = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [treeData, setTreeData] = useState(null);
    useEffect(() => {
        // 发起数据加载请求
        fetch("http://localhost:3000")
            .then(_ => {
                setTreeData(data)
                setIsLoading(false)
            })
            .catch((error) => console.error(error));
    }, []);
    const onLoadData = ({ key, children }) => {
        //根据key加载库
        return new Promise((resolve) => {
            if (children) {
                resolve();
                return;
            }
            setTimeout(() => {
                setTreeData((origin) =>
                    updateTreeData(origin, key, [
                        {
                            title: 'Child Node',
                            key: `${key}-0`,
                            icon: <DatabaseOutlined />,
                        },
                        {
                            title: 'Child Node',
                            key: `${key}-1`,
                            isLeaf: true,
                            icon: <DatabaseOutlined />,
                        },
                    ]),
                );
                resolve();
            }, 1000);
        });
    };
    const processTreeClick = (event, node) => {
        console.log(node)
        props.setMessage(node.title)
        //根据node属性处理
    }
    return (<div>
        {
            isLoading ?
                (
                    <div style={{ textAlign: 'center' }}>
                        <Spin />
                    </div>
                ) :
                (<Tree
                    showIcon
                    switcherIcon={<DownOutlined />}
                    treeData={treeData}
                    onClick={processTreeClick}
                    loadData={onLoadData}
                />)
        }
    </div>)
};
export default App;