export class Records {
    id?: number;
    question1: string;
    question2: string;
    question3: string;
    answer1: string;
    answer2: string;
    answer3: string;
    examen_id?:number;
    aprobacion:boolean;
    client_id:number;
    clientName?: string; // Nombre del cliente
    examenTitle?: string; // Nombre del curso
    aprobacionSymbol?: string; // Símbolo de aprobación
}
