import * as XLSX from 'xlsx';
import * as fs from 'fs';

export interface DashboardData {
  period: string;
  metrics: Record<string, any>[];
  summary: {
    total: number;
    average: number;
    status: string;
    lastUpdated: string;
  };
}

/**
 * Lê um arquivo XLS e extrai dados estruturados
 * @param filePath - Caminho do arquivo XLS/XLSX
 * @param sheetName - Nome da aba (opcional, usa a primeira por padrão)
 * @returns Dados formatados para o Dashboard
 */
export async function readXlsFile(filePath: string, sheetName?: string): Promise<DashboardData> {
  try {
    // Verifica se o arquivo existe
    if (!fs.existsSync(filePath)) {
      throw new Error(`Arquivo não encontrado: ${filePath}`);
    }

    // Lê o arquivo
    const workbook = XLSX.readFile(filePath);
    const sheet = sheetName 
      ? workbook.Sheets[sheetName]
      : workbook.Sheets[workbook.SheetNames[0]];

    // Converte para JSON
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Calcula período baseado nos dados
    const period = extractPeriod(rawData);

    // Formata métricas
    const metrics = rawData.map(row => ({
      ...row,
      // Remove valores vazios
      ...(Object.keys(row).reduce((acc: any, key) => {
        if (row[key as keyof typeof row] !== '' && row[key as keyof typeof row] !== undefined) {
          acc[key] = row[key as keyof typeof row];
        }
        return acc;
      }, {}))
    }));

    // Calcula resumo
    const summary = calculateSummary(metrics);

    return {
      period,
      metrics,
      summary: {
        ...summary,
        lastUpdated: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Erro ao ler arquivo XLS:', error);
    throw error;
  }
}

/**
 * Extrai o período a partir dos dados (ex: "Janeiro - Março 2025")
 */
function extractPeriod(data: any[]): string {
  if (!data || data.length === 0) return 'Sem período definido';

  // Tenta encontrar colunas com datas ou meses
  const firstRow = data[0];
  const keys = Object.keys(firstRow);
  
  // Procura por padrões de data
  const dateKeys = keys.filter(k => 
    k.toLowerCase().includes('mês') ||
    k.toLowerCase().includes('data') ||
    k.toLowerCase().includes('período') ||
    k.toLowerCase().includes('janeiro') ||
    k.toLowerCase().includes('fevereiro') ||
    k.toLowerCase().includes('março')
  );

  if (dateKeys.length > 0) {
    return `${firstRow[dateKeys[0]]}`;
  }

  return `Atualizado em ${new Date().toLocaleDateString('pt-BR')}`;
}

/**
 * Calcula estatísticas do resumo
 */
function calculateSummary(metrics: any[]): Omit<DashboardData['summary'], 'lastUpdated'> {
  if (!metrics || metrics.length === 0) {
    return { total: 0, average: 0, status: 'Sem dados' };
  }

  // Procura por colunas numéricas para calcular totais
  let total = 0;
  let numericCount = 0;

  metrics.forEach(metric => {
    Object.values(metric).forEach(value => {
      if (typeof value === 'number') {
        total += value;
        numericCount++;
      }
    });
  });

  const average = numericCount > 0 ? total / numericCount : 0;
  const status = metrics.length > 0 ? 'Dados carregados' : 'Sem dados';

  return {
    total,
    average: Math.round(average * 100) / 100,
    status
  };
}

/**
 * Monitora mudanças no arquivo e retorna novo snapshot
 */
export function watchXlsFile(filePath: string, callback: (data: DashboardData) => void) {
  let lastMtime = 0;

  const checkFile = async () => {
    try {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.mtime.getTime() > lastMtime) {
          lastMtime = stats.mtime.getTime();
          const data = await readXlsFile(filePath);
          callback(data);
        }
      }
    } catch (error) {
      console.error('Erro ao monitorar arquivo:', error);
    }
  };

  // Verifica a cada 30 segundos ou a cada 15 dias (conforme configurado)
  return setInterval(checkFile, 30000);
}
