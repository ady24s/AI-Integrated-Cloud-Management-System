import React, { useEffect, useState } from "react";
import { fetchIdleInstances } from "../services/api";

const IdleInstances = () => {
    const [idleInstances, setIdleInstances] = useState([]);

    useEffect(() => {
        const getIdleInstances = async () => {
            const data = await fetchIdleInstances();
            setIdleInstances(data);
        };

        getIdleInstances();
    }, []);

    return (
        <div>
            <h2>Idle EC2 Instances</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Instance ID</th>
                        <th>Type</th>
                        <th>State</th>
                        <th>Launch Time</th>
                    </tr>
                </thead>
                <tbody>
                    {idleInstances.map((instance, index) => (
                        <tr key={index}>
                            <td>{instance.id}</td>
                            <td>{instance.type}</td>
                            <td>{instance.state}</td>
                            <td>{instance.launch_time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IdleInstances;
