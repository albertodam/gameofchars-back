import { ScoreBoard } from './ScoreBoard/ScoreBoard';
export interface Repository {
    create(scoreBoard: ScoreBoard): Promise<void>;
    getScore(limit?: number): Promise<ScoreBoard[]>;
}