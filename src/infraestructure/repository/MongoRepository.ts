import { ScoreBoard } from "../../domain/ScoreBoard/ScoreBoard";
import MongoScoreBoard from "../entities/MongoScoreBoard";

export class MongoRepository {

    async create(scoreBoard: ScoreBoard): Promise<void> {
        const newScore = new MongoScoreBoard();
        newScore.name = scoreBoard.name;
        newScore.score = scoreBoard.score;
        newScore.externalId = scoreBoard.id;
        return new Promise((resolve, reject) => {
            MongoScoreBoard
                .findOneAndUpdate({ externalId: newScore.externalId, name: newScore.name }, { $inc: { score: newScore.score } }, { upsert: true, setDefaultsOnInsert: true })
                .exec((err, res) => {
                    if (err) {
                        reject();
                        return;
                    }
                    resolve();
                })
        });
    }

    async getScore(limit = 5): Promise<ScoreBoard[]> {
        return new Promise((resolve, reject) => {
            MongoScoreBoard.find({externalId: {$ne:'anonymous-5854397'}}).select({ "name": 1, "_id": 0, "score":1}).sort({score: 'desc'}).exec((err, docs) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(docs as ScoreBoard[]);
            })
        })

    }
}