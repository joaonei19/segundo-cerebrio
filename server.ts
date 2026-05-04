import express from "express";
import { createServer as createViteServer } from "vite";
import { Client } from "@notionhq/client";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import { readXlsFile } from "./services/xlsReader.ts";

dotenv.config();

// Initialize the Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

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

  // Endpoint para Chat Inteligente (Gemini)
  app.post("/api/chat", async (req, res) => {
    const { query, context } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    try {
      const model = 'gemini-2.5-flash';

      // Convert items to a text format for context
      const knowledgeBaseContext = context.items.map((item: any) => `
      [ID: ${item.id}]
      TIPO: ${item.isProject ? 'PROJETO' : 'NOTA/INFORMAÇÃO'}
      TÍTULO: ${item.title}
      ÁREA: ${(context.areas as any[]).find(a => a.id === item.areaId)?.title || 'Inbox'}
      CONTEÚDO: ${item.content}
      STATUS: ${item.status || 'N/A'}
      PRAZO: ${item.deadline || 'N/A'}
      TAREFAS: ${(item.tasks as any[])?.map(t => `${t.completed ? '[X]' : '[ ]'} ${t.title}`).join(', ') || 'Nenhuma'}
      `).join('\n---\n');

      // Prepare strict context for the AI (Grounding)
      const systemInstruction = `
        Você é o "BrainOS", o núcleo de inteligência do Segundo Cérebro do usuário.
        
        SUA MISSÃO:
        Ajudar o usuário a gerenciar sua vida, projetos e conhecimentos usando o método PARA.
        Responda perguntas baseando-se PRIORITARIAMENTE nas informações fornecidas no contexto abaixo.
        
        REGRAS DE OURO:
        1. Se a informação estiver no contexto, cite-a e indique o título da nota/projeto.
        2. Se a informação NÃO estiver no contexto, você pode usar seu conhecimento geral para sugerir caminhos, mas SEMPRE deixe claro que essa informação não estava nas notas dele.
        3. Seja proativo: Se o usuário perguntar sobre um projeto, sugira os próximos passos ou aponte riscos baseados no que você leu.
        4. Mantenha um tom profissional, organizado e encorajador.

        CONTEXTO DO SEGUNDO CÉREBRO:
        ${knowledgeBaseContext}
        
        Áreas de Vida: ${(context.areas as any[]).map(a => a.title).join(', ')}.
        Recursos Disponíveis: ${(context.resources as any[]).map(r => r.title).join(', ')}.
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: query,
        config: {
          systemInstruction: systemInstruction,
          thinkingConfig: { thinkingBudget: 0 }
        }
      });

      res.json({ answer: response.text || "Não consegui processar a resposta." });
    } catch (error: any) {
      console.error("====== GEMINI API EXACT ERROR ======");
      console.error(error);
      if (error?.response) console.error(error.response);
      console.error("===================================");
      res.status(500).json({ error: "Erro ao acessar o banco de dados neural. Tente novamente." });
    }
  });

  // Endpoint para ler dados de arquivo XLS/XLSX
  app.get("/api/dashboard/xls", async (req, res) => {
    try {
      const { filePath } = req.query;
      
      if (!filePath) {
        return res.status(400).json({ 
          error: "Parâmetro 'filePath' é obrigatório",
          example: "/api/dashboard/xls?filePath=C:/Users/Joao/data.xlsx"
        });
      }

      const data = await readXlsFile(String(filePath));
      res.json(data);
    } catch (error: any) {
      console.error("Erro ao ler XLS:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Endpoint para upload de arquivo XLS
  app.post("/api/dashboard/upload", async (req, res) => {
    try {
      const { filePath } = req.body;
      
      if (!filePath) {
        return res.status(400).json({ error: "filePath é obrigatório" });
      }

      const data = await readXlsFile(filePath);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("Erro no upload:", error);
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
