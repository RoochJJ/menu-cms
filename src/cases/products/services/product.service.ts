import { api } from "@/lib/axios";
import type { ProductDTO, ProductInput } from "../dtos/product.dto";

const ENDPOINT = "/products";

// Todas as chamadas à API de produtos (mesmo padrão do ProductService da aula)
export const ProductService = {
  // Se vier categoryId, a API devolve só os produtos daquela categoria
  async listAll(categoryId?: string): Promise<ProductDTO[]> {
    const result = await api.get<ProductDTO[]>(ENDPOINT, {
      params: { categoryId },
    });
    return result.data;
  },

  async findOne(id: string): Promise<ProductDTO> {
    const result = await api.get<ProductDTO>(`${ENDPOINT}/${id}`);
    return result.data;
  },

  async create(data: ProductInput): Promise<ProductDTO> {
    const result = await api.post<ProductDTO>(ENDPOINT, data);
    return result.data;
  },

  async update(id: string, data: Partial<ProductInput>): Promise<ProductDTO> {
    const result = await api.patch<ProductDTO>(`${ENDPOINT}/${id}`, data);
    return result.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
