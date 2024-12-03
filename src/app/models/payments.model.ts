export class Payments {
    id?: number; // Opcional si el backend lo genera automáticamente
    email?: string | null;
    name?: string | null;
    client_id?: number | null;
    amount?: number | null;
    product?: string | null;
    state?: string;
    ref?: string;


}
