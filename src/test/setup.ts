import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";

// Mock do localStorage para testes
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock do axios para evitar chamadas reais à API durante os testes
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

// Limpar todos os mocks após cada teste
beforeEach(() => {
  vi.clearAllMocks();
});
