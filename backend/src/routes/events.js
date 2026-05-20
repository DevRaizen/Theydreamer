const pool = require("../db");

module.exports = async function (fastify) {
  // GET ALL
  fastify.get("/events", async (request, reply) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM events_entries ORDER BY created_at DESC",
      );
      return rows;
    } catch (err) {
      fastify.log.error(err);
      reply.code(500);
      return { message: "DB error" };
    }
  });

  // GET ONE
  fastify.get("/events/:id", async (request) => {
    const { id } = request.params;

    const [rows] = await pool.query(
      "SELECT * FROM events_entries WHERE id = ?",
      [id],
    );

    return rows[0] || null;
  });

  // CREATE
  fastify.post("/events", async (request) => {
    const { title, description, lat, lng } = request.body;

    const [result] = await pool.query(
      `INSERT INTO events_entries (title, description, lat, lng)
       VALUES (?, ?, ?, ?)`,
      [title, description, lat, lng],
    );

    return {
      id: result.insertId,
      title,
      description,
      lat,
      lng,
    };
  });

  // UPDATE
  fastify.put("/events/:id", async (request) => {
    console.log("UPDATE ID:", request.params.id);
    console.log("BODY:", request.body);
    const { id } = request.params;
    const { title, description, lat, lng } = request.body;

    await pool.query(
      `UPDATE events_entries
       SET title=?, description=?, lat=?, lng=?
       WHERE id=?`,
      [title, description, lat, lng, id],
    );

    return { message: "updated", id };
  });

  // Fix — wrap in try/catch to see the actual error
  fastify.delete("/events/:id", async (request, reply) => {
    console.log("DELETE ID:", request.params.id);
    const { id } = request.params;
    try {
      const [result] = await pool.query(
        "DELETE FROM events_entries WHERE id=?",
        [id],
      );
      console.log("Affected rows:", result.affectedRows);
      return { message: "deleted", id };
    } catch (err) {
      console.error("DELETE ERROR:", err.message);
      reply.code(500);
      return { message: err.message };
    }
  });
};
