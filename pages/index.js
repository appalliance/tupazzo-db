// pages/index.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  Input,
  Button,
  IconButton,
  useToast,
  Checkbox,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const fetchTopics = async () => {
  const res = await fetch("/api/Topics/list");
  return await res.json();
};

const createTopic = async (title) => {
  const res = await fetch("/api/Topics/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return await res.json();
};

const updateTopic = async (id, updatedTopic) => {
  await fetch(`/api/Topics/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTopic),
  });
};

const deleteTopic = async (id) => {
  await fetch(`/api/Topics/delete/${id}`, { method: "DELETE" });
};

export default function Home() {
  const [Topics, setTopics] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const toast = useToast();

  useEffect(() => {
    (async () => {
      const Topics = await fetchTopics();
      setTopics(Topics);
    })();
  }, []);

  const handleCreate = async () => {
    if (inputValue.trim()) {
      const newTopic = await createTopic(inputValue);
      setTopics([...Topics, newTopic]);
      setInputValue("");
      toast({
        title: "Topic created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = async (id, completed) => {
    const updatedTopic = Topics.find((Topic) => Topic.id === id);
    updatedTopic.completed = completed;
    await updateTopic(id, updatedTopic);
    setTopics([...Topics]);
  };

  const handleDelete = async (id) => {
    await deleteTopic(id);
    setTopics(Topics.filter((Topic) => Topic.id !== id));
  };

  return (
    <Box>
      <Heading mt={8} textAlign="center">
        Azure Cosmos DB Starter – Topic App
      </Heading>
      <VStack mt={4} spacing={4} mx="auto" maxW="md">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task"
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <Button onClick={handleCreate} colorScheme="blue">
          Add Topic
        </Button>
        {Topics.map((Topic) => (
          <HStack key={Topic.id} w="100%">
            <Checkbox
              isChecked={Topic.completed}
              onChange={(e) => handleUpdate(Topic.id, e.target.checked)}
            >
              {Topic.title}
            </Checkbox>
            <Spacer />
            <IconButton
              aria-label="Delete Topic"
              icon={<DeleteIcon />}
              onClick={() => handleDelete(Topic.id)}
              colorScheme="red"
            />
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
