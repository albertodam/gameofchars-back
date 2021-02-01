import mongoose, { Schema, Document } from "mongoose";

export interface MongoScoreBoard extends Document {
    name: string,
    externalId: string,
    score: number,
    date: Date
}
const ScoreBoardSchema: Schema = new Schema({
    name:String,
    score: Number,
    externalId: String,
    date: { type: Date, default: Date.now}
});

export default mongoose.model<MongoScoreBoard>('ScoreBoard', ScoreBoardSchema);