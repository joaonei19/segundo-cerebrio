import * as XLSX from 'xlsx';

/**
 * Script para criar um arquivo XLS de exemplo para teste do Dashboard
 * Execute com: npx tsx scripts/createExampleXls.ts
 */

const exampleData = [
  {
    'Período': 'Janeiro 2025',
    'Vendas': 5000,
    'Tickets': 120,
    'Ticket Médio': 41.67,
    'Status': 'Concluído'
  },
  {
    'Período': 'Fevereiro 2025',
    'Vendas': 5500,
    'Tickets': 135,
    'Ticket Médio': 40.74,
    'Status': 'Concluído'
  },
  {
    'Período': 'Março 2025',
    'Vendas': 4800,
    'Tickets': 115,
    'Ticket Médio': 41.74,
    'Status': 'Concluído'
  },
  {
    'Período': 'Abril 2025',
    'Vendas': 6200,
    'Tickets': 152,
    'Ticket Médio': 40.79,
    'Status': 'Em Andamento'
  }
];

// Cria um novo workbook
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(exampleData);

// Adiciona a aba ao workbook
XLSX.utils.book_append_sheet(wb, ws, 'Dashboard');

// Salva o arquivo
const outputPath = './dados_exemplo.xlsx';
XLSX.writeFile(wb, outputPath);

console.log(`✅ Arquivo criado: ${outputPath}`);
console.log(`📁 Caminho para copiar: ${process.cwd()}\\${outputPath}`);
