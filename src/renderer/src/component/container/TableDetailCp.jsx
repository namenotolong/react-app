import { EditableProTable } from '@ant-design/pro-components';
import { Input, Button, Space } from 'antd';
import React, { useState } from 'react';

export default props => {
  const [data, setData] = useState(props.tableDetail.data);


  const [result, setResult] = useState("")
  const [running, setRunning] = useState(false)
  const [condition, setCondition] = useState(false)
  const [conditionValue, setConditionValue] = useState("")

  const [editableKeys, setEditableRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  if (props.tableDetail.columns && props.tableDetail.columns.length > 0) {
    props.tableDetail.columns = props.tableDetail.columns.map(e => {
      let temp = e.type.toLowerCase()
      if (temp == 'date') {
        e.valueType = 'date';
      } else if (temp == 'datetime') {
        e.valueType = 'dateTime';
      } else if (temp == 'timestamp') {
        e.valueType = 'dateTime';
      } else {
        e.valueType = 'text'
      }
      return e;
    })
  }
  const columns = [
    ...props.tableDetail.columns,
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action.startEditable(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    }
  ];


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
        <EditableProTable
          rowKey="id"
          maxLength={5}
          scroll={{
            x: 960,
          }}
          loading={false}
          columns={columns}
          request={async () => ({
            data: data,
            total: 3,
            success: true,
          })}
          value={dataSource}
          onChange={setDataSource}
          editable={{
            type: 'multiple',
            editableKeys,
            onSave: async (rowKey, data, row) => {
              console.log(rowKey, data, row);
            },
            onChange: setEditableRowKeys,
          }}
        />
      </div>
      <div style={{ marginTop: 20, marginLeft: 5 }}>
        {running ? (<LoadingOutlined />) : (result)}
      </div>
    </div>
  );
};