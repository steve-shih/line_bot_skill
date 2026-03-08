import { getLatestReport } from './reportService';

export async function handleStockQuery(query: string): Promise<string> {
  const queryStr = query.trim().toUpperCase();
  const latestReport = await getLatestReport();

  if (!latestReport || !latestReport.stocks) {
    return "抱歉，目前沒有最新的分析報告。";
  }

  // Find exact match in tracked stocks
  const stock = latestReport.stocks.find(
    (s: any) => s.symbol.toUpperCase() === queryStr || s.displayName === queryStr
  );

  if (stock) {
    return `【${stock.displayName} (${stock.symbol}) 分析】\n型態：${stock.pattern}\n方向：${stock.direction}\n\nAI短評：${stock.summary}`;
  }

  return `目前未追蹤 ${queryStr}，或請確保輸入正確代碼。輸入 "help" 了解更多。`;
}

export async function handleTodayHighlights(): Promise<string> {
  const latestReport = await getLatestReport();
  if (!latestReport) {
    return "抱歉，目前沒有最新的分析報告。";
  }

  let msg = `📅 【本日市場重點】 ${latestReport.reportDate}\n\n`;
  msg += `📊 整體總結：\n${latestReport.marketSummary}\n\n`;
  
  if (latestReport.focusStocks) {
    msg += `🚀 偏強關注：${(latestReport.focusStocks.bullish || []).join(', ') || '無'}\n`;
    msg += `⚠️ 偏弱關注：${(latestReport.focusStocks.bearish || []).join(', ') || '無'}\n`;
    msg += `📈 高波動：${(latestReport.focusStocks.volatile || []).join(', ') || '無'}\n`;
  }

  return msg;
}
