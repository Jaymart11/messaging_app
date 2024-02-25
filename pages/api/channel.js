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
      const result = await client.query("SELECT * FROM channels");
      client.release();

      const channels = result.rows;
      res.status(200).json(channels);
    } catch (err) {
      console.error("Error executing query", err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching channels" });
    } finally {
      await pool.end();
    }
  } else if (req.method === "POST") {
    const { channel_url, created_by, chatmate } = JSON.parse(req.body);

    try {
      const client = await pool.connect();
      await client.query(
        "INSERT INTO channels (channel_url, chatmate, created_by) VALUES ($1, $2, $3)",
        [channel_url, chatmate, created_by]
      );
      client.release();
      res.status(201).json({ message: "Channel created successfully" });
    } catch (err) {
      console.error("Error executing query", err);
      res
        .status(500)
        .json({ error: "An error occurred while creating channel" });
    } finally {
      await pool.end();
    }
  } else if (req.method === "PUT") {
    const {
      channel_url,
      message_sent = false,
      deleted = false,
    } = JSON.parse(req.body);

    try {
      const client = await pool.connect();
      if (message_sent) {
        await client.query(
          "UPDATE channels SET total_messages_sent = total_messages_sent + 1 WHERE channel_url = $1",
          [channel_url]
        );
      } else {
        await client.query(
          "UPDATE channels SET is_deleted = $1 WHERE channel_url = $2",
          [deleted, channel_url]
        );
      }

      client.release();
      res.status(200).json({ message: "Channel updated successfully" });
    } catch (err) {
      console.error("Error executing query", err);
      res
        .status(500)
        .json({ error: "An error occurred while updating channel" });
    } finally {
      await pool.end();
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
