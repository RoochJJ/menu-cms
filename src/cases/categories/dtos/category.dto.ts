// Formato da categoria que a API devolve
export interface CategoryDTO {
  id: string;
  name: string;
  icon: string | null;
  displayOrder: number;
  active: boolean;
}

// Dados enviados para cadastrar ou editar (tudo, menos o id)
export type CategoryInput = Omit<CategoryDTO, "id">;