import { Form, Popconfirm, Table, Typography, Input, Button, Space, InputNumber, DatePicker, ConfigProvider, TimePicker } from 'antd';
import { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { dateFormatTest } from '../utils/DateCommonUtils'
import locale from 'antd/es/date-picker/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

const dateFormat = 'YYYY-MM-DD';
const dateUtilsFormat = 'YYYY-mm-dd'

const EditableCell = ({
    editing,
    type,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    let inputNode;
    switch (type) {
        case 'long':
        case 'int':
        case 'int4':
        case 'int8': {
            if (record[title]) {
                inputNode = <InputNumber defaultValue={record[title]} />
            } else {
                inputNode = <InputNumber />
            }
        } break;
        case 'date': {
            if (record[title]) {
                inputNode = <DatePicker defaultValue={dayjs(dateFormatTest(dateUtilsFormat, record[title]), dateFormat)} />;
            } else {
                inputNode = <DatePicker />;
            }
        }; break;
        case 'datetime':
        case 'timestamp':
            {
                if (record[title]) {
                    inputNode = (
                        <DatePicker locale={locale}
                            format="YYYY-MM-DD HH:mm:ss"
                            defaultValue={dayjs(dateFormatTest("YYYY-mm-dd HH:MM:SS", record[title]), 'YYYY-MM-DD HH:mm:ss')}
                            showTime={{
                                defaultValue: dayjs(dateFormatTest("HH:MM:SS", record[title]), 'HH:mm:ss'),
                            }}
                        />
                    )
                } else {
                    inputNode = (
                        <DatePicker locale={locale} format="YYYY-MM-DD HH:mm:ss"
                            showTime={{
                                defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                            }}
                        />
                    )
                }
            } break;
        case 'time': {
            if (record[title]) {
                inputNode = (
                    <TimePicker locale={locale} defaultValue={dayjs(record[title], 'HH:mm:ss')} />
                )
            } else {
                inputNode = (
                    <TimePicker locale={locale} />
                )
            }
        }; break;
        default: {
            if (record && record[title]) {
                inputNode = <Input defaultValue={record[title]} />
            } else {
                inputNode = <Input />
            }

        }; break
    }
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
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
    const columnTypeMap = new Map()
    for (const iterator of props.tableDetail.columns) {
        columnTypeMap.set(iterator.dataIndex, iterator.type)
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
                        <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(record)}>
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
        col.render = text => {
            let type = col.type;
            if (!type) {
                return text;
            }
            type = type.toLowerCase()
            let res;
            switch (type) {
                case "date": res = dateFormatTest("YYYY-mm-dd", text); break;
                case "datetime": res = dateFormatTest("YYYY-mm-dd HH:MM:SS", text); break;
                case "timestamp": res = dateFormatTest("YYYY-mm-dd HH:MM:SS", text); break;
                // case 'time': res = dateFormatTest("HH:MM:SS", text); break;
                default: res = text + ""
            }
            return res;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                type: col.type.toLowerCase()
            }),
        };
    });

    const edit = (record) => {
        // form.setFieldsValue(record);
        setEditingKey(record._______key);
    };
    const cancel = record => {
        setEditingKey('');
        if (record._______commit_none) {
            setData(data.filter(e => e._______key != record._______key));
        }
    };
    const save = async (record) => {
        const row = await form.validateFields();
        console.log(row)
        console.log(columnTypeMap)
        let temp = {...row}
        for (const key in temp) {
            if (Object.hasOwnProperty.call(temp, key)) {
                const element = temp[key];
                console.log(key + ":" + element + ":" + columnTypeMap.get(key))
            }
        }
        // for (const key in temp) {
        //     if (Object.hasOwnProperty.call(temp, key)) {
        //         const element = temp[key];
        //         const type = columnTypeMap.get(key).toLowerCase()
        //         let res;
        //         switch (type) {
        //             case 'date': res = dayjs(element, 'YYYY-MM-DD');break
        //             case 'datetime':
        //             case 'timestamp': res = dayjs(element, 'YYYY-MM-DD HH:mm:ss');break;
        //             case 'time': res = dayjs(element, 'HH:mm:ss');break;
        //             default: res = element;
        //         }
        //         console.log(key + ":" + element + ":" + columnTypeMap.get(key) + ":" + res)
        //     }
        // }
        return
        if (record._______commit_none) {
            //insert
            const row = await form.validateFields();
            console.log(row)
        } else {
            //update
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
        }
        setRunning(false)
    };
    const handleDelete = async row => {
        setData(data.filter(e => e._______key != row._______key));
        let sql = `delete from ${props.tableName} limit 1`
    }
    

    function processResult(result) {
        let count = 1
        if (result.data && result.data.length > 0) {
            result.data = result.data.map(e => {
                e._______key = count
                count = count + 1
                return e;
            })
        }
        return result.data;
    }

    const doQuery = async () => {
        try {
            let sql;
            if (conditionValue && conditionValue.trim()) {
                sql = `select * from ${props.tableName} where ${conditionValue}`
            } else {
                sql = `select * from ${props.tableName}`
            }
            setRunning(true)
            const result = await window.database.fetchData(sql, props.params)
            setData(processResult(result))
        } catch (err) {
            console.log(`query happen error ${err}`)
        }
        setRunning(false)
    }
    const refresh = async () => {
        try {
            setRunning(true)
            let sql = `select * from ${props.tableName}`
            const result = await window.database.fetchData(sql, props.params)
            setData(processResult(result))
        } catch (err) {
            console.log(`query happen error ${err}`)
        }
        setRunning(false)
    }
    const addRow = async () => {
        let addRowData = {}
        for (const iterator of columns) {
            addRowData[iterator.title] = null
        }
        addRowData._______key = crypto.randomUUID()
        addRowData._______commit_none = true
        setData([
            ...data, addRowData
        ])
        setEditingKey(addRowData._______key);
    }
    return (
        <div>
            <div style={{ marginLeft: 5 }}>
                <Space>
                    <Button type='primary' onClick={addRow} disabled={editingKey}>添加数据</Button>
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
                <Form form={form}
                    component={false}

                >
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