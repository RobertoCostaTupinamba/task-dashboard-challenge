import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskStatsCards } from "../../components/TaskStatsCards";
import type { TaskStats } from "../../types/task";

describe("TaskStatsCards", () => {
  const mockStats: TaskStats = {
    total: 10,
    completed: 4,
    pending: 3,
    inProgress: 3,
    byStatus: {
      Concluído: 4,
      Pendente: 3,
      "Em Progresso": 3,
    },
    byCategory: {
      Trabalho: 5,
      Pessoal: 3,
      Estudos: 2,
    },
  };

  it("should render all stats cards with correct values", () => {
    render(<TaskStatsCards stats={mockStats} />);

    // Verificar se todos os títulos dos cards estão presentes
    expect(screen.getByText("Total de Tarefas")).toBeInTheDocument();
    expect(screen.getByText("Concluídas")).toBeInTheDocument();
    expect(screen.getByText("Em Progresso")).toBeInTheDocument();
    expect(screen.getByText("Pendentes")).toBeInTheDocument();

    // Verificar se os valores estão corretos
    expect(screen.getByText("10")).toBeInTheDocument(); // Total
    expect(screen.getByText("4")).toBeInTheDocument(); // Concluídas
    expect(screen.getAllByText("3")).toHaveLength(2); // Em Progresso e Pendentes (ambos têm valor 3)
  });

  it("should render cards with correct CSS classes", () => {
    const { container } = render(<TaskStatsCards stats={mockStats} />);

    const cardsContainer = container.querySelector(".grid");
    expect(cardsContainer).toHaveClass(
      "grid",
      "grid-cols-1",
      "md:grid-cols-2",
      "lg:grid-cols-4",
      "gap-6",
      "mb-8"
    );
  });

  it("should render with zero values", () => {
    const zeroStats: TaskStats = {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
      byStatus: {},
      byCategory: {},
    };

    render(<TaskStatsCards stats={zeroStats} />);

    // Verificar se todos os valores são 0
    const zeroElements = screen.getAllByText("0");
    expect(zeroElements).toHaveLength(4); // 4 cards com valor 0
  });

  it("should render icons for each card", () => {
    const { container } = render(<TaskStatsCards stats={mockStats} />);

    // Verificar se há 4 SVGs (um para cada card)
    const svgElements = container.querySelectorAll("svg");
    expect(svgElements).toHaveLength(4);
  });

  it("should have correct color classes for each card", () => {
    const { container } = render(<TaskStatsCards stats={mockStats} />);

    // Verificar classes de cores específicas
    expect(container.querySelector(".bg-blue-50")).toBeInTheDocument(); // Total
    expect(container.querySelector(".bg-green-50")).toBeInTheDocument(); // Concluídas
    expect(container.querySelector(".bg-yellow-50")).toBeInTheDocument(); // Em Progresso
    expect(container.querySelector(".bg-red-50")).toBeInTheDocument(); // Pendentes

    expect(container.querySelector(".text-blue-600")).toBeInTheDocument();
    expect(container.querySelector(".text-green-600")).toBeInTheDocument();
    expect(container.querySelector(".text-yellow-600")).toBeInTheDocument();
    expect(container.querySelector(".text-red-600")).toBeInTheDocument();
  });

  it("should render large numbers correctly", () => {
    const largeStats: TaskStats = {
      total: 1000,
      completed: 750,
      pending: 150,
      inProgress: 100,
      byStatus: {
        Concluído: 750,
        Pendente: 150,
        "Em Progresso": 100,
      },
      byCategory: {
        Trabalho: 1000,
      },
    };

    render(<TaskStatsCards stats={largeStats} />);

    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.getByText("750")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});
