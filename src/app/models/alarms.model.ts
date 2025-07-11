export class Alarms {
    id?: number
    client_id:number
    subject: string
    content:string
    date?: string; // ← ahora es opcional, solo si el backend lo devuelve
    servidor:string
}
