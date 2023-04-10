import { Form, Popconfirm, Table, Typography, Input, Button, Space } from 'antd';
import { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
const App = props => {
    const [form] = Form.useForm();
    const [data, setData] = useState(props.tableDetail.data);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record._______key === editingKey;
    const [result, setResult] = useState("")
    const [running, setRunning] = useState(false)
    const [condition, setCondition] = useState(false)
    const [conditionValue, setConditionValue] = useState("")
    const edit = (record) => {
        form.setFieldsValue(record);
        setEditingKey(record._______key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (record) => {
        try {
            const row = await form.validateFields();
            let sql = `update ${props.tableName} set `
            for (const key in row) {
                if (Object.hasOwnProperty.call(row, key)) {
                    const element = row[key];
                    sql = sql + `${key} = '${element}', `
                }
            }
            sql = sql.substring(0, sql.lastIndexOf(","));
            sql = sql + ' where ';
            for (const key in record) {
                if (key === '_______key') {
                    continue;
                }
                if (Object.hasOwnProperty.call(record, key)) {
                    const element = record[key];
                    sql = sql + `${key} = '${element}' and `
                }
            }
            sql = sql.substring(0, sql.lastIndexOf("and"));
            console.log(sql)
            setRunning(true)
            const result = await window.database.executeSql(sql, props.params)
            console.log(result)
            setResult(result)
            const index = data.findIndex((item) => item._______key === record._______key);
            row._______key = record._______key;
            for (const key in row) {
                if (Object.hasOwnProperty.call(row, key)) {
                    const element = row[key];
                    data[index][key] = element
                }
            }
            setData(data);
            setEditingKey('');
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
        setRunning(false)
    };
    const handleDelete = row => {
        setData(data.filter(e => e._______key != row._______key));
    }
    const columns = [
        ...props.tableDetail.columns,
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <span>
                        <Typography.Link
                            style={{
                                marginRight: 8,
                            }}
                            disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
                            <a>Delete</a>
                        </Popconfirm>
                    </span>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const doQuery = () => {
        console.log(`select * from ${props.tableName} where ${conditionValue}`)
    }
    const refresh = () => {

    }
    const addRow = () => {
        const temp = {
            id: 1,
            name: 'add',
            _______key: '12321322'
        }
        setData([
            ...data, temp
        ])
    }
    return (
        <div>
            <div style={{ marginLeft: 5 }}>
                <Space>
                    <Button type='primary' onClick={addRow}>添加数据</Button>
                    <Button type='primary' onClick={refresh}>刷新</Button>
                    <Button type='primary' onClick={e => setCondition(true)}>添加条件</Button>
                </Space>
            </div>

            <div style={{ marginLeft: 5, marginTop: 3 }}>
                {condition ? (
                    <Space.Compact block>
                        <Input
                            style={{
                                width: '100%',
                            }}
                            value={conditionValue}
                            onChange={e => setConditionValue(e.target.value)}
                        />
                        <Button type="primary" onClick={doQuery}>查询</Button>
                    </Space.Compact>
                ) : ("")}
            </div>
            <div style={{ marginTop: 5 }}>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        dataSource={data}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={{
                            onChange: cancel,
                        }}
                        rowKey={e => e._______key}
                    />
                </Form>
            </div>
            <div style={{ marginTop: 20, marginLeft: 5 }}>
                {running ? (<LoadingOutlined />) : (result)}
            </div>
        </div>
    );
};
export default App;