# Segundo Cérebro AI 🧠

Um sistema completo de gestão de conhecimento pessoal (PKM) baseado no método PARA (Projects, Areas, Resources, Archives), potencializado por Inteligência Artificial e integração com o Notion.

## ✨ Funcionalidades

- **Dashboard Inteligente**: Visualização clara do seu progresso e distribuição de conhecimento.
- **Método PARA**: Organização estruturada de Projetos, Áreas, Recursos e Arquivos.
- **Brain Chat (IA)**: Assistente integrado que utiliza o Google Gemini para ajudar você a conectar ideias e organizar suas notas.
- **Sincronização com Notion**: Exporte seus dados diretamente para o seu workspace no Notion com um clique.
- **Design Moderno**: Interface limpa, responsiva e otimizada para produtividade.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Express (Node.js) para integrações seguras.
- **IA**: Google Gemini API (@google/genai).
- **Integração**: Notion API (@notionhq/client).

## 🛠️ Configuração e Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/segundo-cerebro-ai.git
   cd segundo-cerebro-ai
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**:
   Crie um arquivo `.env` na raiz do projeto e adicione:
   ```env
   GEMINI_API_KEY=sua_chave_do_gemini
   NOTION_API_KEY=seu_token_do_notion
   NOTION_DATABASE_ID=id_do_seu_banco_de_dados
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
