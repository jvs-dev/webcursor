import { WebSocketServer } from 'ws';
import { mouse, straightTo, Point } from '@nut-tree-fork/nut-js';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Novo dispositivo conectado.');

  ws.on('message', async function message(data) {
    try {
      const { alpha, beta, screenWidth, screenHeight } = JSON.parse(data.toString());

      if (alpha == null || beta == null || screenWidth == null || screenHeight == null) {
        console.warn("Dados incompletos recebidos.");
        return;
      }

      console.log(`Alpha: ${alpha}, Beta: ${beta}, Width: ${screenWidth}, Height: ${screenHeight}`);

      const currentPos = await mouse.getPosition();

      let moveX = 0
      let moveY = 0
      if (alpha >= 0 && alpha <= 10 || alpha <= 360 && alpha >= 350) {
        moveX = 0;
      } else {
        if (alpha >= 20 && alpha <= 180) {
          moveX = (alpha / 360) * -12;
        } else {
          moveX = (alpha / 360) * 8;
        }
      }
      if (beta >= 0 && beta <= 170 || beta <= 0 && beta >= -170) {
        moveY = (beta / 180) * 5; //170 ou -170
      }

      const newX = Math.max(0, currentPos.x + moveX);
      const newY = Math.max(0, currentPos.y + moveY);

      const newPos = new Point(newX, newY);

      await mouse.move(straightTo(newPos));
    } catch (err) {
      console.error("Erro ao processar mensagem:", err);
    }
  });

  ws.on('close', () => {
    console.log('Dispositivo desconectado.');
  });
});

console.log('Servidor WebSocket rodando na porta 8080.');
