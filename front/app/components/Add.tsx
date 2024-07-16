import React, { useState } from 'react';
import { DataItem } from './Subsection';
import { Form, Input, Modal, Button, Select } from 'antd';

const { Option } = Select;

interface AddProps {
    onAdded: (newPost: DataItem) => void;
}

const addPost = async (title: string, description: string, status: string) => {
    const response = await fetch('http://localhost:4000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation CreatePost($title: String!, $description: String!, $status: String!) {
                    createPost(title: $title, description: $description, status: $status) {
                        id
                        title
                        description
                        status
                        date
                    }
                }
            `,
            variables: {
                title,
                description,
                status,
            },
        }),
    });

    const result = await response.json();
    return result.data.createPost;
};

const Add: React.FC<AddProps> = ({ onAdded }) => {
    const [open, setOpen] = useState(true); // Initially true to show the modal
    const [form] = Form.useForm();

    const handleOk = async () => {
        const values = await form.validateFields();
        const newPost = await addPost(values.title, values.description, values.status);
        setOpen(false);
        onAdded(newPost);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Modal
            title="Add Post"
            visible={open} // Corrected prop name to visible
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnClose // Ensures form is reset on close
        >
            <Form form={form} layout="vertical" name="add_post">
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please input the title!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please input the description!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select the status!' }]}
                    initialValue="completed" // Default value
                >
                    <Select placeholder="Select status">
                        <Option value="completed">Active</Option>
                        <Option value="active">Completed</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default Add;
