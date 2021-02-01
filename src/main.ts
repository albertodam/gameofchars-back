import { AuthController } from './infraestructure/controllers/AuthController';
import { MongoRepository } from './infraestructure/repository/MongoRepository';
import dotenv from 'dotenv';
import App from './app';
import GameController from './infraestructure/controllers/GameController';
import MongoConnector from './infraestructure/mongoconnector';
dotenv.config();

const port = process.env.PORT || 3000

const controllers = [
    new AuthController(new MongoRepository()),
    new GameController(new MongoRepository())
]

function bootstrap() {
    // tslint:disable-next-line: no-console
    MongoConnector.init({ useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
    const app = new App(controllers, +port);
    app.listen();
}

bootstrap();
