// Formato da mesa que a API devolve
export interface SpotDTO {
  id: string;
  name: string;
  active: boolean;
}

// Dados enviados para cadastrar ou editar (tudo, menos o id)
export type SpotInput = Omit<SpotDTO, "id">;
