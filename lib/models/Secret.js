const pool = require('../utils/pool');

module.exports = class Secret {
  id;
  title;
  description;
  createdAt;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.description = row.description;
    this.createdAt = row.created_at;
  }

  static async insert() {
    const { rows } = pool.query(
      `
      INSERT INTO
        secrets (title, description)
      VALUES
        ($1, $2)
      RETURNING
        *
      `,
    );

    return new Secret(rows[0]);
  }
};
