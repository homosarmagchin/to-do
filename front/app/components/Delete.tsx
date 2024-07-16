import React from 'react';
import { Button } from 'antd';
import { gql } from '@apollo/client';
import client from '../apollo-client';

const DELETE_POST = gql`
    mutation DeletePost($id: String!) {
        deletePost(id: $id) {
            id
        }
    }
`;

interface DeleteProps {
    id: string;
    onDeleted: () => void;
}

const Delete: React.FC<DeleteProps> = ({ id, onDeleted }) => {
    const handleDelete = async () => {
        console.log('Deleting post with id:', id); 
        try {
            const response = await client.mutate({
                mutation: DELETE_POST,
                variables: { id }
            });
            console.log('Response:', response); 
            onDeleted(); 
        } catch (error) {
            console.error('Error deleting post:', error); 
        }
    };

    return (
        <Button type="primary" danger onClick={handleDelete}>
            Delete
        </Button>
    );
};

export default Delete;
