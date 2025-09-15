// Vercel serverless function
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { address, limit = 5 } = req.query;
  if (!address) return res.status(400).json({ error: "Missing address" });

  const apiKey = process.env.POLYGONSCAN_API_KEY;

  try {
    const url = `https://api.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "1") return res.status(500).json({ error: "Failed to fetch transactions", details: data });

    res.status(200).json({ transactions: data.result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
