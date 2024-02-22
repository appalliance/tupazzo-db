// api/createTopics.js
import { v4 as uuidv4 } from "uuid";
import cosmosSingleton from "../../../lib/cosmos";
import { clean } from "../../../lib/utils";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await cosmosSingleton.initialize();
    const container = cosmosSingleton.getContainer();
    const { title } = req.body;
    const newTopic = { Paritionkey: uuidv4(), title, completed: false };
    const { resource: createdTopic } = await container.items.create(
      clean(newTopic)
    );
    res.status(201).json(createdTopic);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
