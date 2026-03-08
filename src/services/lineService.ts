import { Client, WebhookEvent, TextMessage, Message } from '@line/bot-sdk';
import { handleTodayHighlights, handleStockQuery } from './stockQueryService';
import { getTrackedStocks } from './reportService';

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'test_token',
  channelSecret: process.env.LINE_CHANNEL_SECRET || 'test_secret'
};

const client = new Client(config);

export async function handleLineEvent(event: WebhookEvent) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userText = event.message.text.trim();
  let replyText = '';

  try {
    if (userText === '今日重點') {
      replyText = await handleTodayHighlights();
    } else if (userText.toLowerCase() === 'help') {
      const stocks = await getTrackedStocks();
      const stockList = stocks.map(s => `${s.displayName}(${s.symbol})`).join(', ');
      replyText = `【操作指令】\n1. 輸入「今日重點」查看市場分析\n2. 輸入股票代碼/名稱查詢最新分析狀態\n\n目前追蹤股票池：\n${stockList}`;
    } else {
      // Treat as stock query
      replyText = await handleStockQuery(userText);
    }
  } catch (error) {
    console.error('Error handling message:', error);
    replyText = '抱歉，系統目前忙碌中，無法回覆。';
  }

  const replyMessage: Message = {
    type: 'text',
    text: replyText
  };

  return client.replyMessage(event.replyToken, replyMessage);
}
