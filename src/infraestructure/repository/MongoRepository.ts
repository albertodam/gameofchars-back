import { ScoreBoard } from "../../domain/ScoreBoard/ScoreBoard";
import MongoScoreBoard from "../entities/MongoScoreBoard";

export class MongoRepository {

    async create(scoreBoard: ScoreBoard): Promise<void> {
        const newScore = new MongoScoreBoard();
        newScore.name = scoreBoard.name;
        newScore.score = scoreBoard.score;
        return new Promise((resolve, reject) => {
            MongoScoreBoard.create(newScore, (err, res) => {
                if (err) {
                   reject();
                    return;
                }
                resolve();
            });
        })
    }
}