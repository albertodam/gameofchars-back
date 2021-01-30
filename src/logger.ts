/* tslint:disable */
export default class Logger {

    static log(message: string): void {
        if(process.env.DEBUG){
            console.log('Debug: ' + message);
        }else{
            console.log('Prod: ', message);
        }
    }

    static  error(message: string): void{
        if(process.env.DEBUG){
            console.log('DebugError: ' + message);
        }else{
            console.log('ProdError: ', message);
        }
    }
}
