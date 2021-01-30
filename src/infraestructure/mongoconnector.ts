import { DBConnector } from '../domain/DBConnector.interface';
import mongoose from 'mongoose';
import Logger from '../logger';

export class MongoConnector implements DBConnector{
    init(options: any) {
        try {
            mongoose.connect(process.env.DB_CHAIN, options);
            const db = mongoose.connection;
            db.on('error', (err) => Logger.error(err));
        } catch (err) {
            Logger.error(err.message);
        }
    }
}

export default new MongoConnector();


