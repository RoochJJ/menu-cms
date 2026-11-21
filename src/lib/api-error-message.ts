import { isAxiosError } from "axios";

// Transforma o erro devolvido pela API numa mensagem legível para mostrar ao usuário
export function getApiErrorMessage(error: unknown, fallback = "Algo deu errado. Tente novamente.") {
  if (isAxiosError(error)) {
    if (!error.response) {
      return "Não foi possível conectar à API. Verifique se o backend está rodando.";
    }

    const message = error.response.data?.message;

    if (Array.isArray(message)) {
      return message.join(" ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}