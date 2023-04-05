import React, { useState } from "react";
import { Select, Space, Button, Input, Table, Spin } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const app = props => {
    const database = props.database;
    const [selectedItem, setSelectedItem] = useState(props.database);
    const tableName = props.tableName;
    const params = props.params
    const [totalDatabases, setTotalDatabases] = useState([])
    const [init, setInit] = useState(false)
    const [textValue, setTextValue] = useState(`select * from ${tableName} limit 10`)
    const [result, setResult] = useState(null)

    const [queryError, setQueryError] = useState(false)
    const [errorMsg, setErrorMsg] = useState(false)
    const [loading, setLoading] = useState(false)

    function handleHeaderSelect(value) {
        setSelectedItem(value)
    }

    if (!init) {
        window.database.showDatabases(params)
            .then(e => {
                if (e && e.length > 0) {
                    const data = e.map(item => {
                        return {
                            value: item,
                            key: item
                        }
                    })
                    setTotalDatabases(data)
                }
            }).catch(e => {
                console.log(e)
            })
        setInit(true)
    }
    async function querySql() {
        if (!selectedItem || !textValue) {
            return
        }
        params.database = selectedItem;
        setLoading(true)
        window.database
            .fetchData(textValue, params)
            .then(result => {
                setQueryError(false)
                setErrorMsg('')
                let count = 1
                if (result.data && result.data.length > 0) {
                    result.data = result.data.map(e => {
                        e._______key = count
                        count = count + 1
                        return e;
                    })
                }
                setResult(result)
                setLoading(false)
            })
            .catch(err => {
                setQueryError(true)
                setErrorMsg(err.message)
                setResult(null)
                setLoading(false)
            })
    }
    return (
        <div>
            <div>
                <Space wrap>
                    <Select
                        defaultValue={database}
                        onSelect={handleHeaderSelect}
                        style={{
                            width: 200,
                        }}
                        options={totalDatabases}
                    />
                    <Button type="primary" onClick={querySql}>
                        <CaretRightOutlined /> 运行
                    </Button>
                </Space>
            </div>
            <div style={{ marginTop: 20 }}>
                <div>
                    <TextArea value={textValue} allowClear showCount autoSize onChange={e => setTextValue(e.target.value)} />
                </div>
            </div>
            <div style={{ marginTop: 20 }}>
                {loading ? (
                    <div style={{ marginTop: 20, textAlign: 'center' }}>
                        <Spin></Spin>
                    </div>
                ) : queryError ? (
                    <div style={{ marginLeft: 5, marginTop: 20 }}>
                        {errorMsg}
                    </div>
                ) : result ? (
                    <div style={{ marginTop: 20 }}>
                        <Table dataSource={result.data} columns={result.columns} rowKey={e => e._______key} />
                    </div>
                ) : ''}
            </div>
        </div>
    );
}
export default app