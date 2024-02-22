// api/deleteTopics.js
import cosmosSingleton from "../../../../lib/cosmos";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    await cosmosSingleton.initialize();
    const container = cosmosSingleton.getContainer();

    const { id } = req.query;

    const { resource: existingTopic } = await container.item(id, id).read();

    if (!existingTopic) {
      res.status(404).json({ message: "Topic not found." });
      return;
    }

    await container.item(id, id).delete();
    res.status(200).json({ message: "Topic Deleted" });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
