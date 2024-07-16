import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import '../public/style.css';
import Delete from './Delete';
import Edit from './Edit';
import Add from './Add'; // Ensure correct import for DataItem

export interface DataItem {
    id: string;
    title: string;
    description: string;
    status: string;
    date: string;
}

const fetchPosts = async (): Promise<DataItem[]> => {
    const response = await fetch('http://localhost:4000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query {
                    getAllPosts {
                        id
                        title
                        description
                        status
                        date
                    }
                }
            `,
        }),
    });

    const result = await response.json();
    return result.data.getAllPosts;
};

const Subsection: React.FC = () => {
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchData = async () => {
        try {
            const posts = await fetchPosts();
            setData(posts);
            setLoading(false);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
    };

    const handleAdded = (newPost: DataItem) => {
        setData([newPost, ...data]);
        setShowAddForm(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const dataWithKeys = data.map(item => ({ ...item, key: item.id }));

    const columns = () => [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '25%',
            key: 'id',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            width: '15%',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: '40%',
            key: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: '10%',
            key: 'status',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            width: '10%',
            key: 'date',
        },
        {
            title: 'Edit',
            key: 'edit',
            render: (text: any, record: DataItem) => (
                <Edit
                    id={record.id}
                    initialTitle={record.title}
                    initialDescription={record.description}
                    initialStatus={record.status}
                    onEdited={fetchData} // Pass fetchData to trigger refetch
                />
            ),
        },
        {
            title: 'Delete',
            key: 'delete',
            render: (text: any, record: DataItem) => (
                <Delete
                    id={record.id}
                    onDeleted={fetchData} // Pass fetchData to trigger refetch
                />
            ),
        },
    ];

    return (
        <div className='container'>
            <h1>To-Do List</h1>
            <div id='appr-but'>
                <Button type="primary" onClick={toggleAddForm}>
                    {/* <div id='shot-but'> */}
                    {showAddForm ? 'Cancel' : 'Add Post'}
                    {/* </div> */}
                </Button>
                {showAddForm && <Add onAdded={handleAdded} />}
            </div>
            <div className='table'>
                <Table
                    dataSource={dataWithKeys}
                    columns={columns()}
                    pagination={{ pageSize: 5 }}
                />
            </div>
        </div>

    );
};

export default Subsection;
