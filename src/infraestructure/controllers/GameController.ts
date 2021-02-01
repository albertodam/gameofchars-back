import { Repository } from '../../domain/Repository';
import express, { Request, Response } from "express";
import Logger from "../../logger";
import { ScoreBoard } from '../../domain/ScoreBoard/ScoreBoard';
import { Controller } from "./ControllerInterface";
import jwt from 'jsonwebtoken';


export default class GameController implements Controller {
    public path: string = '/game';
    public router = express.Router();
    public repository: Repository;

    constructor(repository: Repository) {
        this.repository = repository;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getScore.bind(this));
        this.router.use((req, res, next) => {
            const authHeader = req.headers.authorization as string;
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
                    if (err) {
                        return res.json({ mensaje: 'Te he pillado modificando el token troll!'+err });
                    } else {
                        req.body.decoded = decoded;
                        next();
                    }
                });
            } else {
                res.send({
                    mensaje: 'No hay token so troll!.'
                });
            }
        });

        this.router.post(this.path, this.addScore.bind(this));
    }


    private async getScore(request: Request, response: Response) {
        const result = await this.repository.getScore();
        response.send(result);
        return;
    }


    private addScore(request: Request, response: Response) {
        const scoreBoard = new ScoreBoard();

        scoreBoard.score = request.body.score;
        scoreBoard.name = request.body.decoded.login
        scoreBoard.id = request.body.decoded.id

        this.repository.create(scoreBoard)
            .then(() => {
                response.send('Se ha creado correctamente');
            })
            .catch(err => {
                Logger.error('Error al crear un registro nuevo');
            });
    }

}
