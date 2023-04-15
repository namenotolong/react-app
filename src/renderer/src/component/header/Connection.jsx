import { Button, Dropdown } from 'antd';
import {LinkOutlined} from '@ant-design/icons';
const items = [
    {
        label: 'MySQL',
        key: '0',
    },
    {
        label: 'PostgreSQL',
        key: '1',
    },
    {
        label: 'Oracle',
        key: '2',
    },
];
const Connection = () => (
    <>
        <Dropdown
            menu={{
                items,
            }}
            placement="bottom"
            arrow
        >
            <Button >
            <LinkOutlined />
                新建连接
            </Button>
        </Dropdown>
    </>
);
export default Connection;