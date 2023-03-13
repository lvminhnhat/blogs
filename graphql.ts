const { ApolloServer, gql } = require('apollo-server');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

pool.connect((err) => {
    if (err) throw err;
    console.log('Connected to PostgreSQL server');
});

const typeDefs = gql`
  type User {
    user_id : ID
    full_name: String
    email: String
    username: String
    password: String

  }

  type Suggestion {
    id: ID!
    user_id: ID!
    course_id: ID!
  }

  type Tag {
    id: ID!
    title: String!
  }

  type Course {
    id: ID!
    user_id: ID!
    title: String!
    description: String!
  }

  type Query {
    user(id: ID!): User
    users : [User]
    course(id: ID!): Course
  }

  type Mutation {
    signUp(full_name: String!, email: String!, password: String!, username: String!): String!
    signIn(username : String!, password : String!) : String!
    createSuggestion(user_id: ID!, course_id: ID!): Suggestion!
    createTag(title: String!): Tag!
    createCourse(user_id: ID!, title: String!, description: String!): Course!
  }
`;

const resolvers = {
    Query: {
        user: async (_, { id }) => {
            const query = 'SELECT * FROM users WHERE user_id = $1';
            const values = [id];
            const { rows } = await pool.query(query, values);
            return rows[0];
        },
        course: async (_, { id }) => {
            const query = 'SELECT * FROM courses WHERE user_id = $1';
            const values = [id];
            const { rows } = await pool.query(query, values);
            return rows[0];
        },
        users: async () => {
            const query = 'SELECT * FROM users';
            const { rows } = await pool.query(query);
            return rows;
        }


    },
    /* Suggestion: {
         User: async (suggestion) => {
             const query = 'SELECT * FROM users WHERE id = $1';
             const values = [suggestion.user_id];
             const { rows } = await pool.query(query, values);
             return rows[0];
         },
         course: async (suggestion) => {
             const query = 'SELECT * FROM courses WHERE id = $1';
             const values = [suggestion.course_id];
             const { rows } = await pool.query(query, values);
             return rows[0];
         },
     },
     Course: {
         tags: async (course) => {
             const query = 'SELECT * FROM course_tags WHERE course_id = $1';
             const values = [course.id];
             const { rows } = await pool.query(query, values);
             const tagIds = rows.map(row => row.tag_id);
             const tagQuery = 'SELECT * FROM tags WHERE id IN ($1)';
             const tagValues = [tagIds];
             const tagResult = await pool.query(tagQuery, tagValues);
             return tagResult.rows;
         },
     },*/
    Mutation: {
        signUp : async (_, { full_name, email, password, username }) =>  {
            email = email.trim().toLowerCase();
            const hashed = await bcrypt.hash(password, 10);
            try {
                
                const checkUsernameQuery = `SELECT * FROM users WHERE username = $1`;
                const usernameExists = await pool.query(checkUsernameQuery, [username]);
                if (usernameExists.rows.length > 0) {
                    throw new Error('Username already exists');
                }
                const checkEmailQuery = `SELECT * FROM users WHERE email = $1`;
                const emailExists = await pool.query(checkEmailQuery, [email]);
                if (emailExists.rows.length > 0) {
                    throw new Error('Email already exists');
                }

                const query = `
                INSERT INTO users (full_name, email, username,password)
                VALUES ($1, $2, $3, $4)
                RETURNING *
                `;
                const values = [full_name, email, username, hashed];
                const { rows } = await pool.query(query, values);
                console.log('User created:', rows[0]);
                return jwt.sign({ id: rows[0].user_id }, process.env.JWT_SECRET);
            } catch (error) {
                console.error('Error creating user', error);
                throw new Error('Could not create user');
            }
        },
        signIn: async (_, { username, password }) => {
            try {
                const query = `SELECT * FROM users WHERE username = $1`;
                const { rows } = await pool.query(query, [username]);
                if (rows.length === 0) {
                    throw new Error('Invalid username or password');
                }
                const user = rows[0];
                const valid = await bcrypt.compare(password, user.password);

                if (!valid) {
                    throw new Error('Invalid username or password');
                }
                return jwt.sign({ id: user.user_id }, process.env.JWT_SECRET);
            } catch (error) {
                console.error('Error logging in', error);
                throw new Error('Could not log in');
            }
        },
        createSuggestion: async (_, { user_id, course_id }) =>  {
            try {
                const query = `
              INSERT INTO suggestions (user_id, course_id)
              VALUES ($1, $2)
              RETURNING *
              `;
                const values = [user_id, course_id];
                const { rows } = await pool.query(query, values);
                console.log('Suggestion created:', rows[0]);
                return rows[0];
            } catch (error) {
                console.error('Error creating suggestion', error);
                throw new Error('Could not create suggestion');
            }
        },
        createTag: async (_, { title }) =>  {
            try {
                const query = `
                INSERT INTO tags (title) 
                VALUES ($1)
                RETURNING *
              `;
                const values = [title];
                const { rows } = await pool.query(query, values);
                console.log('Tag created:', rows[0]);
                return rows[0];
            } catch (error) {
                console.error('Error creating tag', error);
                throw new Error('Could not create tag');
            }
        },
        createCourse: async (_, { user_id, title, description }) =>  {
            try {
                const query = `
                INSERT INTO courses (user_id, title, description) 
                VALUES ($1, $2, $3)
                RETURNING *
              `;
                const values = [user_id, title, description];
                const { rows } = await pool.query(query, values);
                console.log('Course created:', rows[0]);
                return rows[0];
            } catch (error) {
                console.error('Error creating course', error);
                throw new Error('Could not create course');
            }
        }

    }
}

module.exports = {
    resolvers,
    typeDefs,
};

