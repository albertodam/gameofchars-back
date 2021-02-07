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
                    games[room].nUsers -= 1;
                    socket.to(room).emit('userLeave', { game: games[room] });
                })
                // the Set contains at least the socket ID
            });

            socket.on('createGame', (gameId) => {
                socket.join(gameId);
                games[gameId] = {
                    nUsers: 1,
                    creatorId: socket.client.conn.id
                };
                // socket.to(gameId).emit('userJoinned', { game: games[gameId] });
            });

            socket.on('joinGame', (gameId) => {
                socket.join(gameId);
                if (!games[gameId]) return;
                games[gameId].nUsers += 1;
                // setTimeout(() => {
                this.io.in(gameId).emit('userJoinned', { game: games[gameId] });
                //}, 1000);

            });

            socket.on('startingGame', gameId => {
                const emitterId = socket.client.conn.id;
                const game = games[gameId];
                if (!game) return;
                if (emitterId === game.creatorId) {
                    this.io.in(gameId).emit('startGame', { game: games[gameId] });
                } else {
                    console.log("Algun pintamonas quiere empezar una partida sin ser el creador");
                }
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