import axios from 'axios';
import express, { Request, Response } from 'express';
import Logger from '../../logger';
import { Repository } from './../../domain/Repository';
import { Controller } from "./ControllerInterface";


export class AuthController implements Controller {

    public path: string = '/auth';
    public router = express.Router();
    repository: Repository;

    constructor(repository: Repository) {
        this.repository = repository;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/github', this.github.bind(this));
    }


    private github(request: Request, response: Response) {

        const data = {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: request.body.code
        }
        axios.post('https://github.com/login/oauth/access_token', data, { headers: {Accept :'application/json'} })
            .then(async (res) => {
                if (res.data.error) {
                    throw new Error('Error de verificación del código: ' + res.data.error_description);
                }
                Logger.log(res.data.access_token);
                const userInfo = await this.getInfoUser(res.data.access_token);
                console.log(userInfo.data);
                response.send('github login correcto');
                console.log('Fin de la request');
            })
            .catch((error) => {
                Logger.error(error);
                response.send(`Ha fallado: ${error}`).status(400);
            });
    }

    private async getInfoUser(token: string) {
        Logger.log('Ande andas!')
        return await axios.get('https://api.github.com/user', {headers: {'Authorization':`token ${token}`}});

    }

}
