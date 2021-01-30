import { Repository } from '../../domain/Repository';
import express, { Request, Response } from "express";
import Logger from "../../logger";
import { ScoreBoard } from '../../domain/ScoreBoard/ScoreBoard';
import { Controller } from "./ControllerInterface";


export default class GameController implements Controller {
    public path: string = '/game';
    public router = express.Router();
    public repository: Repository;

    constructor(repository: Repository) {
        this.repository = repository;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.addScore.bind(this));
    }

    private addScore(request: Request, response: Response) {
        const scoreBoard = new ScoreBoard();
        scoreBoard.name = 'Alberto menos acoplado';
        scoreBoard.score = 100;
        this.repository.create(scoreBoard)
            .then(() => {
                response.send('Se ha creado correctamente');
            })
            .catch(err => {
                Logger.error('Error al crear un registro nuevo');
            });
    }

}
