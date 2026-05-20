const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
require("dotenv").config();

const eventRoutes = require("./routes/events");

// CORS
fastify.register(cors, {
  origin: "*",
});

// IMPORTANT: prefix = /api
fastify.register(eventRoutes, { prefix: "/api" });

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server running on http://localhost:3000");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
