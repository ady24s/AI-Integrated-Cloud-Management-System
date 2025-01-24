import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AWSInstances from "./components/AWSInstances";
import S3Buckets from "./components/S3Buckets";
import IdleInstances from "./components/IdleInstances";

function App() {
    return (
        <Router>
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className="navbar-brand" to="/">Cloud Dashboard</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/instances">EC2 Instances</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/s3">S3 Buckets</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/idle">Idle Instances</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={<AWSInstances />} />
                    <Route path="/instances" element={<AWSInstances />} />
                    <Route path="/s3" element={<S3Buckets />} />
                    <Route path="/idle" element={<IdleInstances />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
