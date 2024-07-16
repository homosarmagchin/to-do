import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
// import { DataItem } from './Subsection'; // Adjust the path as necessary

interface EditProps {
  id: string;
  initialTitle: string;
  initialDescription: string;
  initialStatus: string;
  onEdited: () => void;
}

const updatePost = async (id: string, title: string, description: string, status: string) => {
  const response = await fetch('http://localhost:4000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
                mutation UpdatePost($id: String!, $title: String, $description: String, $status: String) {
                    updatePost(id: $id, title: $title, description: $description, status: $status) {
                        id
                        title
                        description
                        status
                        date
                    }
                }
            `,
      variables: {
        id,
        title,
        description,
        status,
      },
    }),
  });

  const result = await response.json();
  return result.data.updatePost;
};

const Edit: React.FC<EditProps> = ({ id, initialTitle, initialDescription, initialStatus, onEdited }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    form.setFieldsValue({
      title: initialTitle,
      description: initialDescription,
      status: initialStatus,
    });
    setOpen(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    await updatePost(id, values.title, values.description, values.status);
    setOpen(false);
    onEdited();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Edit
      </Button>
      <Modal
        title="Edit Post"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="edit_post">
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
            rules={[{ required: true, message: 'Please input the status!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Edit;
