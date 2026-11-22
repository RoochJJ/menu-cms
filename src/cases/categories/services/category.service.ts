import { api } from "@/lib/axios";
import type { CategoryDTO, CategoryInput } from "../dtos/category.dto";

const ENDPOINT = "/categories";

// Todas as chamadas à API de categorias (mesmo padrão do SpotService da aula)
export const CategoryService = {
  async listALL(): Promise<CategoryDTO[]> {
    const result = await api.get<CategoryDTO[]>(ENDPOINT);
    return result.data;
  },

  async findOne(id: string): Promise<CategoryDTO> {
    const result = await api.get<CategoryDTO>(`${ENDPOINT}/${id}`);
    return result.data;
  },

  async create(data: CategoryInput): Promise<CategoryDTO> {
    const result = await api.post<CategoryDTO>(ENDPOINT, data);
    return result.data;
  },

  async update(id: string, data: Partial<CategoryInput>): Promise<CategoryDTO> {
    const result = await api.patch<CategoryDTO>(`${ENDPOINT}/${id}`, data);
    return result.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
