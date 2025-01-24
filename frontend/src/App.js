import React from "react";
import AWSInstances from "./components/AWSInstances";
import S3Buckets from "./components/S3Buckets";
import IdleInstances from "./components/IdleInstances";

function App() {
    return (
        <div className="App">
            <h1>AI-Powered Cloud Dashboard</h1>
            <AWSInstances />
            <S3Buckets />
            <IdleInstances />
        </div>
    );
}

export default App;
