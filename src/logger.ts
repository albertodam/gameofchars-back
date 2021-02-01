/* tslint:disable */
export default class Logger {

    static log(message: any): void {
        if(process.env.DEBUG){
            console.log('Debug: ' + message);
        }else{
            console.log('Prod: ', message);
        }
    }

    static error(message: any): void{
        if(process.env.DEBUG){
            console.log('DebugError: ' + message);
            console.log(message);
        }else{
            console.log('ProdError: ', message);
        }
    }
}
