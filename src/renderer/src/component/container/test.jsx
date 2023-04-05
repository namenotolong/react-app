import { Form, Input, InputNumber, Popconfirm, Table, Typography, Spin } from 'antd';
import { useState, useEffect } from 'react';

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
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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
    const params = props.params
    const tableName = props.tableName
    const [tableDetail, setTableDetail] = useState()
    const [loading, setLoading] = useState(false)
    const [queryError, setQueryError] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)
    const [columnsData, setColumnsData] = useState([])
    function init() {
        if (!loading) {
            window.database
                .fetchData(`select * from ${tableName} limit 100`, params)
                .then(result => {
                    let count = 1
                    if (result.data && result.data.length > 0) {
                        result.data = result.data.map(e => {
                            e._______key = count
                            count = count + 1
                            return e;
                        })
                    }
                    setTableDetail(result);
                    setQueryError(false)
                    setErrorMsg('')
                    result.columns.push({
                        title: 'operation',
                        dataIndex: 'operation',
                        render: (_, record) => {
                            const editable = isEditing(record);
                            return editable ? (
                                <span>
                                    <Typography.Link
                                        onClick={() => save(record.key)}
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
                                <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                    Edit
                                </Typography.Link>
                            );
                        },
                    })
                    const data = result.columns.map((col) => {
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
                    })
                    setColumnsData(data);
                })
                .catch(err => {
                    setQueryError(true)
                    setErrorMsg(err.message)
                    setTableDetail(null)
                })
        }
        setLoading(true)
        console.log(tableDetail)
    }
    useEffect(() => {
        init()
    })


    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => {
        return record._______key === editingKey;
    };
    const edit = (record) => {
        // form.setFieldsValue({
        //     name: '',
        //     age: '',
        //     address: '',
        //     ...record,
        // });
        setEditingKey(record._______key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    return (
        <Form form={form} component={false}>
            <div style={{ marginTop: 20 }}>
                {!loading ? (
                    <div style={{ marginTop: 20, textAlign: 'center' }}>
                        <Spin></Spin>
                    </div>
                ) : queryError ? (
                    <div style={{ marginLeft: 5, marginTop: 20 }}>
                        {errorMsg}
                    </div>
                ) : tableDetail ? (
                    <div style={{ marginTop: 20 }}>
                        <Table
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            bordered
                            dataSource={tableDetail.data}
                            //dataSource={data}
                            columns={columnsData}
                            rowClassName="editable-row"
                            pagination={{
                                onChange: cancel,
                            }}
                            rowKey={e => e._______key}
                        />
                    </div>
                ) : ''}
            </div>

        </Form>
    );
};
export default App;