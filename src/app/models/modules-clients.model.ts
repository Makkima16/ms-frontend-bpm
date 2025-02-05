export class ModulesClients {
    id?: number;
    module_id?: number;
    information: string;
    title: string;
    modulo?: { // Relación con Modulo
      id: number;
      titulo: string;
    };
  }
  