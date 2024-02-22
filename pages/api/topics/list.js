// api/topics.js
import cosmosSingleton from "../../../lib/cosmos";

export default async function handle(req, res) {
  console.log(`trying to get topics.`);
  await cosmosSingleton.initialize();
  const container = cosmosSingleton.getContainer();
  if (req.method === "GET") {
    const { resources: topics } = await container.items
      .query("SELECT * from Topics")
      .fetchAll();
    res.status(200).json(topics);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
