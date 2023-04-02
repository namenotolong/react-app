import { DownOutlined, DatabaseOutlined, ForkOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Tree } from 'antd';
import { useEffect, useState } from 'react';

let connMap = new Map();
let data = [];

async function initData() {
    const conns = await window.database.fetchTotalConns()
    if (conns && conns.length > 0) {
        data = conns.map(e => {
            connMap.set(e.name, e);
            return {
                ...e,
                title: e.name,
                key: e.name,
                icon: <ForkOutlined />
            };
        })
    }
}

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
        initData().then(e => {
            setTreeData(data)
            setIsLoading(false)
        }).catch(e => {
            console.log(e)
            setIsLoading(false)
        })
    }, []);
    const onLoadData = (node) => {
        //根据key加载库
        return new Promise((resolve) => {
            if (node.children) {
                resolve();
                return;
            }
            window.database.showDatabases(node)
                .then(e => {
                    if (e && e.length > 0) {
                        const databases = e.map(item => {
                            return {
                                title: item,
                                key: node.key + "_" + item,
                                icon: <DatabaseOutlined />,
                                isLeaf: true,
                                parent: node
                            }
                        })
                        setTreeData((origin) =>
                            updateTreeData(origin, node.key, databases)
                        );
                    }
                }).catch(e => {
                    console.log(e)
                })
            resolve();
        });
    };
    const processTreeClick = (event, node) => {
        if (node.parent) {
            const params = { ...node.parent, database: node.title };
            props.clickDatabase(params)
        }
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