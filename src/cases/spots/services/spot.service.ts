import { api } from "@/lib/axios";
import type { SpotDTO, SpotInput } from "../dtos/spot.dto";

const ENDPOINT = "/spots";

// Todas as chamadas à API de mesas (mesmo padrão do SpotService da aula)
export const SpotService = {
  async listALL(): Promise<SpotDTO[]> {
    const result = await api.get<SpotDTO[]>(ENDPOINT);
    return result.data;
  },

  async findOne(id: string): Promise<SpotDTO> {
    const result = await api.get<SpotDTO>(`${ENDPOINT}/${id}`);
    return result.data;
  },

  // O cadastro da API recebe só o nome e cria a mesa ativa.
  // Se a mesa for cadastrada como inativa, fazemos uma edição logo em seguida.
  async create(data: SpotInput): Promise<SpotDTO> {
    const result = await api.post<SpotDTO>(ENDPOINT, { name: data.name });

    if (!data.active) {
      return SpotService.update(result.data.id, { active: false });
    }

    return result.data;
  },

  async update(id: string, data: Partial<SpotInput>): Promise<SpotDTO> {
    const result = await api.patch<SpotDTO>(`${ENDPOINT}/${id}`, data);
    return result.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};
