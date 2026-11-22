import type { CategoryDTO } from "@/cases/categories/dtos/category.dto";

// Formato do produto que a API devolve
export interface ProductDTO {
  id: string;
  name: string;
  active: boolean;
  description: string | null;
  price: number;
  picture: string | null;
  vegetarian: boolean;
  isNew: boolean;
  category: CategoryDTO | null;
}

// Dados enviados para cadastrar ou editar
export interface ProductInput {
  name: string;
  active: boolean;
  description: string | null;
  price: number;
  picture: string | null;
  vegetarian: boolean;
  isNew: boolean;
  categoryId: string | null;
}
