import React, { useEffect, useState } from "react";
import { fetchS3Buckets } from "../services/api";

const S3Buckets = () => {
    const [buckets, setBuckets] = useState([]);

    useEffect(() => {
        const getBuckets = async () => {
            const data = await fetchS3Buckets();
            setBuckets(data);
        };

        getBuckets();
    }, []);

    return (
        <div>
            <h2>S3 Buckets</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Creation Date</th>
                    </tr>
                </thead>
                <tbody>
                    {buckets.map((bucket, index) => (
                        <tr key={index}>
                            <td>{bucket.name}</td>
                            <td>{bucket.creation_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default S3Buckets;
