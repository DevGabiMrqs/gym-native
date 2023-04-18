//AppError serve para padronizar as mensagens de error ou exceções que são tratadas na aplicação.

export class AppError{
    message: string;

    constructor(message: string) {
        this.message = message;
    }

} //construtor é executado no momento que uma classe é instanciada.