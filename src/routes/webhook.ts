import { Router, Request, Response } from 'express';
import { WebhookEvent } from '@line/bot-sdk';
import { handleLineEvent } from '../services/lineService';

router.post('/', async (req: Request, res: Response) => {
  const events: WebhookEvent[] = req.body.events;
  
  if (!events || !Array.isArray(events)) {
    return res.status(200).send('OK'); // Line health check often sends empty payload
  }

  try {
    await Promise.all(events.map(event => handleLineEvent(event)));
    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).end();
  }
});

export default router;
