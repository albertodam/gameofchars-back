import { AuthController } from './infraestructure/controllers/AuthController';
import { MongoRepository } from './infraestructure/repository/MongoRepository';
import dotenv from 'dotenv';
import App from './app';
import  GameController from './infraestructure/controllers/GameController';
import MongoConnector from './infraestructure/mongoconnector';
dotenv.config();

const controllers = [
    new GameController(new MongoRepository()),
    new AuthController(new MongoRepository())
]

function bootstrap() {
    // tslint:disable-next-line: no-console
    MongoConnector.init({ useNewUrlParser: true });
    const app = new App(controllers, 3000);
    app.listen();
}

bootstrap();
