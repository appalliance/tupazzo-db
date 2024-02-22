// api/updateTopics.js
import cosmosSingleton from "../../../../lib/cosmos";
import { clean } from "../../../../lib/utils";

export default async function handle(req, res) {
  console.log(`atleast updating.`);
  if (req.method === "PUT") {
    await cosmosSingleton.initialize();
    const container = cosmosSingleton.getContainer();
    const { id } = req.query;
    const updatedTopic = req.body;

    const { resource: existingTopic } = await container.item(id, id).read();

    if (!existingTopic) {
      res.status(404).json({ message: "Topic not found." });
      return;
    }

    await container.item(id, id).replace(clean(updatedTopic));
    res.status(200).json(updatedTopic);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
