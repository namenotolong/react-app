import { Form, Popconfirm, Table, Typography, Input } from 'antd';
import { useState } from 'react';
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
            const result = await window.database.executeSql(sql, props.params)
            console.log(result)
            const index = data.findIndex((item) => item._______key === record._______key);
            row._______key = record._______key;
            data[index] = row;
            console.log(data)
            setData(data);
            setEditingKey('');
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const handleDelete = data => {
        console.log(data)
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
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
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
    return (
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
    );
};
export default App;