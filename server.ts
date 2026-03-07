import express from "express";
import { createServer as createViteServer } from "vite";
import { Client } from "@notionhq/client";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Endpoint para Sincronizar com Notion
  app.post("/api/notion/sync", async (req, res) => {
    const { apiKey, databaseId, items } = req.body;

    if (!apiKey || !databaseId) {
      return res.status(400).json({ error: "API Key e Database ID são necessários." });
    }

    const notion = new Client({ auth: apiKey });

    try {
      const results = [];
      for (const item of items) {
        const response = await notion.pages.create({
          parent: { database_id: databaseId },
          properties: {
            Name: {
              title: [{ text: { content: item.title } }],
            },
            Type: {
              select: { name: item.isProject ? "Projeto" : "Nota" },
            },
            Content: {
              rich_text: [{ text: { content: item.content.substring(0, 2000) } }],
            },
            Status: {
              select: { name: item.status || "Active" },
            },
          },
        });
        results.push(response);
      }
      res.json({ success: true, count: results.length });
    } catch (error: any) {
      console.error("Erro no Notion:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware para desenvolvimento
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
