import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { Controller } from "./infraestructure/controllers/ControllerInterface";
import  cors  from 'cors';

export default class App {
    app: express.Application;
    port: number;

    constructor(controllers: Controller[], port: number) {
        this.app = express();
        const corsOptions = {
            origin: 'https://gameofchars.netlify.app',
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        }
        this.app.use(cors(corsOptions))
        this.app.use(bodyParser.json());
        this.port = port;
        this.initizalizeControllers(controllers);
    }
    private initizalizeControllers(controllers: Controller[]) {

        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        })
    }

    public listen() {
        this.app.listen(this.port, () => {
            // tslint:disable-next-line: no-console
            console.log(`Game of chars running on localhost:${this.port}...`);
        })
    }
}