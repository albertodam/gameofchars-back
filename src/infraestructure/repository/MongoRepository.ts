import { ScoreBoard } from "../../domain/ScoreBoard/ScoreBoard";
import MongoScoreBoard from "../entities/MongoScoreBoard";

export class MongoRepository {

    async create(scoreBoard: ScoreBoard): Promise<void> {
        const newScore = new MongoScoreBoard();
        newScore.name = scoreBoard.name;
        newScore.score = scoreBoard.score;
        newScore.externalId = scoreBoard.id;
        return new Promise((resolve, reject) => {

            MongoScoreBoard.create(newScore).then(() => {
                resolve();
            }, err => reject())
        });
    }

    async getScore(limit = 5): Promise<ScoreBoard[]> {
        return new Promise((resolve, reject) => {
            MongoScoreBoard.aggregate(
                [
                    {
                        $match: {
                            'externalId': { $ne: 'anonymous-5854397' }
                        }
                    },
                    {
                        $group: {
                            _id: "$externalId",
                            name: { $first: '$name' },
                            score: { $max: "$score" },
                            nGames: { $sum: 1 },
                            avg: {$avg:'$score'}
                        }
                    }
                ])
                .sort({ score: 'desc' })
                .limit(limit)
                .exec((err, docs) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(docs as ScoreBoard[]);
                })

        })

    }
}