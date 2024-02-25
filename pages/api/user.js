import { Pool } from "pg";

export default async function handler(req, res) {
  const pool = new Pool({
    user: "dev_applicant",
    host: "ec2-54-169-182-174.ap-southeast-1.compute.amazonaws.com",
    database: "FSD_2024_tandoc",
    password: "bfEJGCBRYfW1NOiWeGEA",
    port: 5432,
  });

  const token = req.headers["api-token"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  if (token !== "31f52659694d92b6bfd1787316d2a519f04040a4") {
    return res.status(401).json({ error: "Unauthorized: Invalid Token" });
  }

  if (req.method === "GET") {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM users");
      client.release();

      const users = result.rows;
      res.status(200).json(users);
    } catch (err) {
      console.error("Error executing query", err);
      res.status(500).json({ error: "An error occurred while fetching Users" });
    } finally {
      await pool.end();
    }
  } else if (req.method === "POST") {
    const { user_id, nickname, profile_url } = JSON.parse(req.body);

    try {
      const client = await pool.connect();
      await client.query(
        "INSERT INTO users (user_id, nickname, profile_url) VALUES ($1, $2, $3)",
        [user_id, nickname, profile_url]
      );
      client.release();
      res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      console.error("Error executing query", err);
      res.status(500).json({ error: "An error occurred while creating User" });
    } finally {
      await pool.end();
    }
  } else if (req.method === "PUT") {
    const {
      user_id,
      nickname,
      profile_url,
      is_deleted = false,
    } = JSON.parse(req.body);

    try {
      const client = await pool.connect();
      if (is_deleted) {
        console.log(user_id);
        await client.query(
          "UPDATE users SET is_deleted = $1, deleted_at = NOW() WHERE user_id = $2",
          [is_deleted, user_id]
        );
      } else {
        await client.query(
          "UPDATE users SET nickname = $2, profile_url = $3, updated_at = NOW() WHERE user_id = $1",
          [user_id, nickname, profile_url]
        );
      }

      client.release();
      res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
      console.error("Error executing query", err);
      res.status(500).json({ error: "An error occurred while updating user" });
    } finally {
      await pool.end();
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
