import { WebSocketServer } from 'ws'
import { mouse, screen, straightTo, Point } from '@nut-tree-fork/nut-js';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('Novo dispositivo conectado.');

    ws.on('message', async function message(data) {
        try {
            const { alpha, beta } = JSON.parse(data.toString());
            if (alpha == null || beta == null) return;

            const screenSize = await screen.getScreenSize();
            const currentPos = await mouse.getPosition();

            const moveX = alpha * 5; // ajuste de sensibilidade
            const moveY = beta * 5;

            const newPos = new Point(
                Math.min(screenSize.width, Math.max(0, currentPos.x + moveX)),
                Math.min(screenSize.height, Math.max(0, currentPos.y + moveY))
            );

            await mouse.move(straightTo(newPos));
        } catch (err) {
            console.error("Erro ao mover mouse:", err);
        }
    });

    ws.on('close', () => {
        console.log('Dispositivo desconectado.');
    });
});

console.log('Servidor WebSocket rodando na porta 8080.');
