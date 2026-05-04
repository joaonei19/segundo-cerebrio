import { Area, NoteTemplate, ReviewChecklist, Resource, KnowledgeItem, AgendaEvent } from './types';

export const INITIAL_AREAS: Area[] = [
  { id: '1', title: 'Carreira & Negócios', icon: 'Briefcase', description: 'Projetos profissionais, Marketing, E-commerce', color: 'bg-blue-500' },
  { id: '2', title: 'Finanças Pessoais', icon: 'DollarSign', description: 'Investimentos, Orçamento, Patrimônio', color: 'bg-green-500' },
  { id: '3', title: 'Saúde & Bem-estar', icon: 'Heart', description: 'Treinos, Alimentação, Sono, Saúde Mental', color: 'bg-red-500' },
  { id: '4', title: 'Estudos & Desenvolvimento', icon: 'BookOpen', description: 'Cursos, Certificações, Leitura', color: 'bg-yellow-500' },
  { id: '5', title: 'Casa & Família', icon: 'Home', description: 'Manutenção, Documentos, Logística familiar', color: 'bg-purple-500' },
  { id: '6', title: 'Criatividade & Branding', icon: 'PenTool', description: 'Ideias, Design, Identidade Pessoal', color: 'bg-pink-500' },
];

export const INITIAL_ITEMS: KnowledgeItem[] = [
  {
    id: 'p1',
    title: 'Lançamento do E-commerce',
    content: 'Planejamento estratégico do lançamento da loja virtual. Focar em tráfego pago e influenciadores.',
    areaId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isProject: true,
    status: 'Active',
    objective: 'Colocar a loja no ar e realizar as primeiras 10 vendas.',
    kpis: ['Taxa de conversão > 1%', 'Custo por clique < R$1,00'],
    risks: ['Atraso no fornecedor', 'Problemas no gateway de pagamento'],
    deadline: '2024-12-01',
    progress: 65,
    tasks: [
      { id: 't1', title: 'Configurar domínio', completed: true },
      { id: 't2', title: 'Cadastrar produtos', completed: true },
      { id: 't3', title: 'Configurar Pixel do Facebook', completed: false },
    ]
  },
  {
    id: 'p2',
    title: 'Maratona 2024',
    content: 'Planilha de treinos e dieta para a preparação.',
    areaId: '3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isProject: true,
    status: 'Active',
    objective: 'Completar a maratona em menos de 4 horas.',
    kpis: ['Pace médio 5:30', '4 treinos por semana'],
    risks: ['Lesão no joelho', 'Falta de tempo para treinos longos'],
    deadline: '2024-11-15',
    progress: 40,
    tasks: [
      { id: 't4', title: 'Comprar tênis novo', completed: true },
      { id: 't5', title: 'Fazer checkup cardiológico', completed: false },
    ]
  },
  {
    id: 'n1',
    title: 'Ideias para Postagens LinkedIn',
    content: '1. Falar sobre o método PARA\n2. Como usar IA na produtividade\n3. Bastidores do projeto novo',
    areaId: '6', 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isSynced: true,
    isProject: false
  },
  {
    id: 'n2',
    title: 'Resumo da reunião com Contador',
    content: 'Precisamos ajustar a categorização das despesas mensais para abater no IRPF.',
    areaId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    driveLink: 'https://docs.google.com/document/d/xyz',
    isSynced: true,
    isProject: false
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  { id: 'r1', title: 'Guia de Prompting para Gemini', category: 'IA & Prompting', content: 'Use chain-of-thought para problemas complexos...', tags: ['AI', 'Productivity'] },
  { id: 'r2', title: 'Setup de Campanhas Meta Ads', category: 'Marketing', content: 'Estrutura 1-3-3: 1 Campanha, 3 Conjuntos, 3 Criativos...', tags: ['Ads', 'Marketing'] },
];

export const TEMPLATES: NoteTemplate[] = [
  {
    id: 'tpl1',
    title: 'Reunião de Trabalho',
    category: 'Meeting',
    content: `# Pauta da Reunião
**Data:** [Data]
**Participantes:** [Nomes]

## 🎯 Objetivo
Qual o resultado esperado desta reunião?

## 📝 Discussão
- Ponto 1:
- Ponto 2:

## ✅ Ações Definidas (Action Items)
- [ ] Quem: O que (Prazo)
- [ ] Quem: O que (Prazo)
`
  },
  {
    id: 'tpl2',
    title: 'Planejamento Semanal (Weekly Review)',
    category: 'Routine',
    content: `# Revisão Semanal
**Semana:** [Número/Data]

## 🚦 Check-in Rápido
- E-mail zerado?
- Agenda da próxima semana revisada?
- Área de trabalho limpa?

## 🏆 Vitórias da Semana
O que deu certo?

## 🚧 Desafios
O que travou ou não foi feito?

## 🎯 Foco da Próxima Semana
Qual a ÚNICA coisa que, se feita, deixará o resto mais fácil?
`
  },
  {
    id: 'tpl3',
    title: 'Estudo Profundo (Cornell Method)',
    category: 'Study',
    content: `# Tópico de Estudo
**Fonte:** [Livro/Curso]

## 💡 Conceitos Chave (Esquerda)
- Conceito A
- Pergunta B

## 📝 Notas Detalhadas (Direita)
Explicação detalhada dos conceitos...

## 🔑 Resumo (Rodapé)
Em 3 frases, o que eu aprendi aqui?
`
  }
];

export const REVIEW_RITUALS: ReviewChecklist[] = [
  {
    id: 'rev1',
    title: 'Revisão Diária (Shutdown Ritual)',
    frequency: 'Daily',
    items: [
      'Processar caixa de entrada de notas rápidas',
      'Atualizar status de tarefas concluídas hoje',
      'Selecionar 3 prioridades para amanhã',
      'Esvaziar a mente (Brain dump) de pendências novas'
    ]
  },
  {
    id: 'rev2',
    title: 'Revisão Semanal (GTD Style)',
    frequency: 'Weekly',
    items: [
      'Esvaziar caixa de entrada de e-mail e física',
      'Revisar calendário (semana que passou e próxima)',
      'Revisar lista de Projetos Ativos (estão andando?)',
      'Revisar lista "Aguardando Resposta"',
      'Mover notas soltas para as pastas de Áreas ou Recursos'
    ]
  },
  {
    id: 'rev3',
    title: 'Revisão Mensal',
    frequency: 'Monthly',
    items: [
      'Analisar KPIs financeiros (entradas vs saídas)',
      'Revisar progresso das Metas Trimestrais',
      'Verificar assinaturas e gastos recorrentes',
      'Limpeza digital (arquivos de download, desktop)'
    ]
  }
];

export const INITIAL_EVENTS: AgendaEvent[] = [
  {
    id: 'e1',
    title: 'Reunião de Alinhamento com Equipe',
    date: new Date().toISOString().split('T')[0], // Today
    time: '14:30',
    type: 'Meeting',
    description: 'Discutir próximos passos do Q4.'
  },
  {
    id: 'e2',
    title: 'Renovar domínio do site',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // In 3 days
    type: 'Reminder',
    description: 'Vencimento na HostGator.'
  }
];
