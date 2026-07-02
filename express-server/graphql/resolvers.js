export const root = {
  hello() {
    return 'hello from potential-engine graphql';
  },

  // READ (Single User)
  async getUser({ id }, { db }) {
    try {
      const res = await db.query('SELECT * FROM users WHERE id = $1', [id]);
      if (res.rows.length === 0) throw new Error(`User with ID ${id} not found`);
      return res.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  },

  // READ (All Users)
  async getUsers(_args, { db }) {
    try {
      const res = await db.query('SELECT * FROM users');
      return res.rows;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  },

  // CREATE
  async createUser({ input }, { db }) {
    try {
      const { name, email, bio } = input;
      const query = `
        INSERT INTO users (name, email, bio) 
        VALUES ($1, $2, $3) 
        RETURNING *
      `;
      const res = await db.query(query, [name, email, bio]);
      return res.rows[0];
    } catch (error) {
      if (error.code === '23505') throw new Error('Email already exists');
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  // UPDATE
  async updateUser({ id, input }, { db }) {
    try {
      const fields = [];
      const values = [];
      let idx = 1;

      if (input.name !== undefined) { fields.push(`name = $${idx++}`); values.push(input.name); }
      if (input.email !== undefined) { fields.push(`email = $${idx++}`); values.push(input.email); }
      if (input.bio !== undefined) { fields.push(`bio = $${idx++}`); values.push(input.bio); }

      if (fields.length === 0) throw new Error('No update fields provided');

      values.push(id); // push ID to the end of the values array 
      const query = `
        UPDATE users 
        SET ${fields.join(', ')} 
        WHERE id = $${idx} 
        RETURNING *
      `;

      const res = await db.query(query, values);
      if (res.rows.length === 0) throw new Error(`User with ID ${id} not found`);
      return res.rows[0];
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  },

  // DELETE
  async deleteUser({ id }, { db }) {
    try {
      const res = await db.query('DELETE FROM users WHERE id = $1', [id]);
      return res.rowCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
};
