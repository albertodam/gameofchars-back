import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { Controller } from "./infraestructure/controllers/ControllerInterface";
//import { createServer, Server } from "http";
import { Server, Socket } from "socket.io";

import cors from 'cors';

export default class App {
    app: express.Application;
    port: number;
    server: any;
    io: Server;

    constructor(controllers: Controller[], port: number) {
        this.app = express();
        const corsOptions = {
            origin: '*',
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        }
        this.app.use(cors(corsOptions))
        this.app.use(bodyParser.json());
        this.port = port;

        this.initizalizeControllers(controllers);
        this.server = require('http').createServer(this.app);
        this.io = new Server(this.server, { cors: corsOptions });
    }
    private initizalizeControllers(controllers: Controller[]) {

        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        })
    }

    public listen() {

        const games: any = {};

        this.server.listen(this.port, () => {
            // tslint:disable-next-line: no-console
            console.log(`Game of chars running on localhost:${this.port}...`);
        });

        this.io.on("connect", (socket: Socket) => {
            console.log('Conexión de un cliente');

            socket.on('disconnecting', () => {
                socket.rooms.forEach((room) => {
                    if (!games[room]) return;
                    games[room].players.filter((player: any) => {
                        return player.id !== socket.client.conn.id
                    });
                    console.log('Alguien a abandonado la sala');
                    socket.to(room).emit('userLeave', games[room]);
                })
                // the Set contains at least the socket ID
            });

            socket.on('createGame', (gameInfo) => {

                if (!gameInfo) return;
                const { gameId, username } = gameInfo;
                socket.join(gameId);

                games[gameId] = {
                    id: gameId,
                    players: [{ username, creator: true, id: socket.client.conn.id, score: 0 }],
                    creatorId: socket.client.conn.id
                };
                this.io.in(gameId).emit('userJoinned', games[gameId]);
            });

            socket.on('joinGame', (gameInfo) => {
                if (!gameInfo) return;
                const { gameId, username } = gameInfo;
                if (!games[gameId]) return;

                socket.join(gameId);
                games[gameId].players.push({ username, id: socket.client.conn.id, score: 0 });
                this.io.in(gameId).emit('userJoinned', games[gameId]);
            });

            socket.on('startingGame', gameId => {
                const emitterId = socket.client.conn.id;
                const game = games[gameId];
                if (!game) return;
                if (emitterId === game.creatorId) {
                    this.io.in(gameId).emit('startGame', games[gameId]);
                } else {
                    console.log("Algun pintamonas quiere empezar una partida sin ser el creador");
                }
            })


            socket.on('finishPlayerRound', (playerRoundFinishData) => {
                const game = games[playerRoundFinishData.gameId];
                console.log(playerRoundFinishData.score);
                const emitterId = socket.client.conn.id;
                game.players = game.players.map((player: any) => {
                    if (player.id === emitterId) {
                        player.score += playerRoundFinishData.score;
                    }
                    return player;
                });
                this.io.in(game.id).emit('playerFinishedRound', game);
            })

            socket.on('sendGameStatus', (gameStatus) => {
                const emitterId = socket.client.conn.id;
                const game = games[gameStatus.gameId];
                if (!game) return;
                if (emitterId === game.creatorId) {
                    console.log("El creador ha hablado");
                } else {
                    console.log("Algun pintamonas quiere hablar");
                }
                console.log("Un usuario manda mensaje a una sala: ", gameStatus.gameId);
                this.io.to(gameStatus.gameId).emit('Emito solo a mi sala');
            });

        });
    }

}