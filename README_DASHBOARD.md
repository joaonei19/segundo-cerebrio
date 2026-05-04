# Dashboard Dinâmico - Guia de Uso

## 📊 O que mudou?

Seu Dashboard agora é **100% dinâmico** e carrega dados diretamente de um arquivo **XLS/XLSX** que você atualizar a cada 15 dias.

### Antes ❌
- Dados hardcoded em `constants.ts`
- Tava mostrando Janeiro → Março
- Precisava atualizar código manualmente

### Depois ✅
- Dados vêm do seu arquivo XLS
- Se você atualizar o XLS, o Dashboard reflete no mesmo
- **Sem Janeiro-Março fixo**
- Você controla 100% dos dados

---

## 🚀 Como Usar?

### Passo 1: Preparar seu arquivo XLS

Crie um arquivo Excel (`dados.xlsx`) com a seguinte estrutura:

```
Período        | Métrica 1 | Métrica 2 | Status
January        | 1500      | 850       | Ativo
February       | 1800      | 920       | Ativo  
March          | 2100      | 1200      | Ativo
```

**Dicas:**
- Primeira linha deve ter os cabeçalhos das colunas
- Inclua dados numéricos (para gráficos)
- O arquivo pode ter qualquer número de linhas
- Formatos suportados: `.xlsx`, `.xls`, `.ods`

### Passo 2: Abrir o Dashboard

1. Inicie o servidor: `npm run dev`
2. Acesse a página principal (Dashboard)
3. Clique no botão **"📁 Caminho"**
4. Cole o caminho completo do seu arquivo XLS

**Exemplo de caminho:**
```
C:\Users\Joao\Documents\dados.xlsx
```

### Passo 3: Carregar Dados

1. Clique em **"Atualizar"**
2. O Dashboard carregará todos os dados automaticamente
3. O caminho será salvo para próximas vezes

---

## 📈 O que o Dashboard Mostra

### 1. **Cards de Resumo** (4 cartões no topo)
- **Total**: Soma de todos os valores numéricos
- **Média**: Média dos valores
- **Registros**: Quantidade de linhas no XLS
- **Status**: Estado dos dados

### 2. **Tabela de Dados**
- Exibe todos os dados do seu XLS de forma organizada
- Números são formatados automaticamente (com separadres de milhar)

### 3. **Gráficos**
- Gráfico de barras automático (primeiros 10 registros)
- Resumo executivo com estatísticas

---

## 🔄 Mantendo Atualizado

### Ciclo de 15 dias
1. **Semana 1-2**: Trabalhe normalmente com o Dashboard
2. **Dia 15**: Abra seu arquivo XLS e atualize os dados
3. **Valide**: Clique em "Atualizar" para ver os dados novos
4. **Próximos 15 dias**: Repita

### Auto-Refresh (Futuro)
Podemos adicionar um monitor automático que:
- Verifica o arquivo a cada 30 segundos
- Se houver mudanças, atualiza automaticamente
- (Isso será adicionado em breve)

---

## 💡 Exemplos de Estrutura XLS

### Para Vendas/Financeiras (HD Store)
```
Data        | Vendas | Tickets | Ticket Médio
2025-01-01  | 5000   | 120     | 41.67
2025-01-02  | 5500   | 135     | 40.74
2025-01-03  | 4800   | 115     | 41.74
```

### Para Métricas Pessoais
```
Semana | Artigos Lidos | Exercícios | Horas Sono
1      | 3             | 5          | 7.2
2      | 5             | 6          | 7.5
3      | 4             | 4          | 6.8
```

### Para Múltiplos KPIs
```
Mês        | Conversão | CAC    | LTV    | ROI
Janeiro    | 2.5%      | 45.50  | 892    | 3.2
Fevereiro  | 2.8%      | 42.30  | 920    | 3.5
Março      | 3.1%      | 39.80  | 950    | 3.8
```

---

## 🛠️ Troubleshooting

### ❌ "Arquivo não encontrado"
- Verifique se o caminho está correto
- Use aspas se houver espaços no caminho
- Teste com caminho absoluto (ex: `C:\Users\Joao\Desktop\dados.xlsx`)

### ❌ "Nenhum dado encontrado"
- Verifique se o XLS tem dados preenchidos
- Certifique-se que a primeira linha tem cabeçalhos
- Tente salvar o arquivo novamente

### ❌ "Erro ao carregar dados"
- Feche o arquivo XLS antes de atualizar
- Procure erros na console do navegador (F12)

---

## 📝 Atualizar a Estrutura do XLS

Dentro de alguns dados já existentes, você pode:
- Adicionar novas colunas (métricas)
- Adicionar novas linhas (períodos)
- Alterar valores existentes
- **NÃO mude os nomes das colunas** (causa erro no gráfico)

---

## ⚡ Próximas Melhorias

- [ ] Auto-refresh quando o arquivo mudar
- [ ] Suporte a múltiplas abas (sheetsdo Excel)
- [ ] Upload direto via interface
- [ ] Gráficos mais sofisticados
- [ ] Export de relatórios

---

## FAQ

**P: Preciso manter o arquivo aberto?**
R: Não, fecha o Excel e simplesmente clique em "Atualizar" no Dashboard.

**P: Pode ter dados de diferentes meses?**
R: Sim! O Dashboard suporte qualquer formato de data ou período.

**P: Quanto tempo demora para atualizar?**
R: Instantâneo. Assim que você clica em "Atualizar", carrega.

**P: Pode quebrar algo se eu mudar o XLS estrutura?**
R: Não, o Dashboard é flexível. Mas nomes de colunas muito grandes podem não caber bem.

---

**Versão: 1.0**  
**Última atualização: 2025-05-04**
