import React, { useEffect, useState } from "react";
import { fetchResources } from "../services/api";

const Resources = () => {
    const [resources, setResources] = useState([]);

    useEffect(() => {
        const getResources = async () => {
            const data = await fetchResources();
            setResources(data);
        };

        getResources();
    }, []);

    return (
        <div>
            <h2>Cloud Resources</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Usage Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {resources.map((resource) => (
                        <tr key={resource.id}>
                            <td>{resource.id}</td>
                            <td>{resource.name}</td>
                            <td>{resource.resource_type}</td>
                            <td>{resource.status}</td>
                            <td>{resource.usage_hours}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Resources;
