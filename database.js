const { Pool } = require('pg');


require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port : process.env.DB_PORT
});

pool.connect((err) => {
    if (err) throw err;
    console.log('Connected to PostgreSQL server');
});

const createUser = async (full_name, email,password,username) => {
    try {
        const query = `
        INSERT INTO users (full_name, email, username,password)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `;
        const values = [full_name, email, username,password];
        const { rows } = await pool.query(query, values);
        console.log('User created:', rows[0]);
    } catch (error) {
        console.error('Error creating user', error);
    }
};

const getAllUsers = async () => {
    try {
        const query = `
            SELECT * FROM users
        `;
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error getting all users', error);
        return [];
    }
};



const createSuggestion = async (user_id,course_id) => {
    try {
        const query = `
        INSERT INTO suggestions (user_id, course_id)
        VALUES ($1, $2)
        RETURNING *
        `;
        const values = [user_id,course_id];
        const { rows } = await pool.query(query, values);
        console.log('Suggestion created:', rows[0]);
    } catch (error) {
        console.error('Error creating suggestion', error);
    }
}

const createTag = async (title) => {
    try {
        const query = `
        INSERT INTO tags (title) 
        VALUES ($1)
        RETURNING *
        `;
        const values = [title];
        const {rows} = await pool.query(query,values);
        console.log('Tag created:', rows[0]);
    } catch (error) {
        console.error('Error creating tag', error);
    }
}

const createCourse = async (user_id,title,description) => {
    try {
        const query = `
        INSERT INTO tags (user_id,title,description) 
        VALUES ($1, $2, $3)
        RETURNING *
        `;
        const values = [user_id,title,description];
        const {rows} = await pool.query(query,values);
        console.log('Course created:', rows[0]);
    } catch (error) {
        console.error('Error creating course', error);
    }
}

module.exports = {
    createUser,
    getAllUsers,
    createSuggestion,
    createTag,
    createCourse
};
