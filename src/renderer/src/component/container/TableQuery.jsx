import React, { useState } from "react";
const app = props => {
    const [database, setDatabase] = useState(props.database);
    const tableName = props.tableName;
    const params = props.params
    return (
        <div>
            hello world
        </div>
    );
}
export default app