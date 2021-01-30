import mongoose, { Schema, Document } from "mongoose";

export interface MongoScoreBoard extends Document {
    name: string,
    score: number,
    date: Date
}
const ScoreBoardSchema: Schema = new Schema({
    name:String,
    score: Number,
    date: { type: Date, default: Date.now}
});

export default mongoose.model<MongoScoreBoard>('ScoreBoard', ScoreBoardSchema);