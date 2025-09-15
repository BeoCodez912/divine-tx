import fetch from "node-fetch";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow Blogger to fetch

  const { address, limit = 5 } = req.query;
  if (!address) return res.status(400).json({ error: "Address missing" });

  try {
    const apiRes = await fetch(`https://api.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${process.env.POLYGONSCAN_API_KEY}`);
    const json = await apiRes.json();

    if (json.status !== "1") return res.status(500).json({ error: json.message || "No transactions found" });

    const transactions = json.result.map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      timeStamp: tx.timeStamp
    }));

    res.status(200).json({ transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
}
