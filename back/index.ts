import { prisma } from './db.js';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gql } from 'graphql-tag';
import { DateTimeResolver } from 'graphql-scalars';

const createPost = async (title, description, status) => {
    const newStatus = status === "active" ? "completed" : "active";
    const post = await prisma.post.create({
        data: {
            title,
            description,
            status: newStatus,
        }
    });
    return post;
};

const updatePost = async (id, title, description, status) => {
    const post = await prisma.post.update({
        where: { id },
        data: { title, description, status }
    });
    return post;
};

const deletePost = async (id) => {
    console.log(`Deleting post with id: ${id}`);
    try {
        const post = await prisma.post.delete({
            where: { id }
        });
        console.log(`Deleted post with id: ${id}`);
        return post;
    } catch (error) {
        console.error(`Error deleting post with id ${id}:`, error);
        throw error; // Ensure errors are propagated
    }
};

(async function () {
    const typeDefs = gql`
        scalar Date
        type Post {
            id: String
            title: String
            description: String
            status: String
            date: Date
        }
        type Query {
            getAllPosts: [Post]
        }
        type Mutation {
            createPost(title: String, description: String, status: String): Post
            deletePost(id: String!): Post
            updatePost(id: String!, title: String, description: String, status: String): Post
        }
    `;

    const resolvers = {
        Date: DateTimeResolver,
        Mutation: {
            createPost: async (_parent, args) => {
                return await createPost(args.title, args.description, args.status);
            },
            deletePost: async (_parent, args) => {
                return await deletePost(args.id);
            },
            updatePost: async (_parent, args) => {
                return await updatePost(args.id, args.title, args.description, args.status);
            }
        },
        Query: {
            getAllPosts: async () => {
                return await prisma.post.findMany({
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        date: true,
                        status: true,
                    }
                });
            }
        }
    };

    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 }
    });

    console.log("Server is ready at " + url);
})();
