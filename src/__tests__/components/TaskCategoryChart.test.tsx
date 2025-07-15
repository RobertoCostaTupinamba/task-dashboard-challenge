import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskCategoryChart } from "../../components/TaskCategoryChart";

// Mock do Recharts
vi.mock("recharts", () => ({
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({
    data,
    label,
    children,
  }: {
    data: Array<{ name: string; value: number }>;
    label: unknown;
    children: React.ReactNode;
  }) => (
    <div data-testid="pie">
      {data.map((entry, index) => (
        <div key={index} data-testid="pie-segment">
          {typeof label === "function"
            ? label({ name: entry.name, value: entry.value, percent: 0.33 })
            : `${entry.name}: ${entry.value}`}
        </div>
      ))}
      {children}
    </div>
  ),
  Cell: ({ fill }: { fill: string }) => (
    <div data-testid="pie-cell" style={{ color: fill }} />
  ),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Legend: () => <div data-testid="legend" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe("TaskCategoryChart", () => {
  const mockData = {
    Trabalho: 8,
    Pessoal: 5,
    Estudos: 3,
  };

  it("should render chart with data", () => {
    render(<TaskCategoryChart data={mockData} />);

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("pie")).toBeInTheDocument();
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("legend")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("should render empty state when no data", () => {
    render(<TaskCategoryChart data={{}} />);

    expect(
      screen.getByText("Nenhuma categoria encontrada")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("pie-chart")).not.toBeInTheDocument();
  });

  it("should render empty state when all values are zero", () => {
    const zeroData = {
      Trabalho: 0,
      Pessoal: 0,
      Estudos: 0,
    };

    render(<TaskCategoryChart data={zeroData} />);

    expect(
      screen.getByText("Nenhuma categoria encontrada")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("pie-chart")).not.toBeInTheDocument();
  });

  it("should display correct data values in chart segments", () => {
    render(<TaskCategoryChart data={mockData} />);

    // Verificar se os valores aparecem nos segmentos
    expect(screen.getByText(/Trabalho.*8.*33%/)).toBeInTheDocument();
    expect(screen.getByText(/Pessoal.*5.*33%/)).toBeInTheDocument();
    expect(screen.getByText(/Estudos.*3.*33%/)).toBeInTheDocument();
  });

  it("should render pie segments for each category", () => {
    render(<TaskCategoryChart data={mockData} />);

    const pieSegments = screen.getAllByTestId("pie-segment");
    expect(pieSegments).toHaveLength(3);
  });

  it("should render cells with different colors for each category", () => {
    render(<TaskCategoryChart data={mockData} />);

    const pieCells = screen.getAllByTestId("pie-cell");
    expect(pieCells).toHaveLength(3);

    // Verificar se cores diferentes são aplicadas
    expect(pieCells[0]).toHaveStyle({ color: "#3b82f6" }); // blue-500
    expect(pieCells[1]).toHaveStyle({ color: "#8b5cf6" }); // violet-500
    expect(pieCells[2]).toHaveStyle({ color: "#06b6d4" }); // cyan-500
  });

  it("should cycle through colors for many categories", () => {
    const manyCategories = {
      Cat1: 1,
      Cat2: 1,
      Cat3: 1,
      Cat4: 1,
      Cat5: 1,
      Cat6: 1,
      Cat7: 1,
      Cat8: 1,
      Cat9: 1,
      Cat10: 1,
      Cat11: 1, // Should cycle back to first color
    };

    render(<TaskCategoryChart data={manyCategories} />);

    const pieCells = screen.getAllByTestId("pie-cell");
    expect(pieCells).toHaveLength(11);

    // First and 11th categories should have the same color (cycling)
    expect(pieCells[0]).toHaveStyle({ color: "#3b82f6" }); // blue-500
    expect(pieCells[10]).toHaveStyle({ color: "#3b82f6" }); // blue-500 (cycled)
  });

  it("should handle single category", () => {
    const singleCategory = {
      "Única Categoria": 10,
    };

    render(<TaskCategoryChart data={singleCategory} />);

    expect(screen.getByText(/Única Categoria.*10.*33%/)).toBeInTheDocument();

    const pieSegments = screen.getAllByTestId("pie-segment");
    expect(pieSegments).toHaveLength(1);
  });

  it("should render empty state icon correctly", () => {
    const { container } = render(<TaskCategoryChart data={{}} />);

    const emptyStateContainer = screen
      .getByText("Nenhuma categoria encontrada")
      .closest("div");
    expect(emptyStateContainer).toHaveClass("text-center");

    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-12", "h-12", "mx-auto", "mb-4", "text-gray-400");
  });

  it("should have correct container height", () => {
    const { container } = render(<TaskCategoryChart data={mockData} />);

    const chartContainer = container.querySelector(".h-64");
    expect(chartContainer).toBeInTheDocument();
  });

  it("should handle categories with special characters", () => {
    const specialCategories = {
      "Trabalho & Negócios": 5,
      "Saúde + Bem-estar": 3,
      "Casa/Família": 2,
    };

    render(<TaskCategoryChart data={specialCategories} />);

    expect(screen.getByText(/Trabalho & Negócios.*5.*33%/)).toBeInTheDocument();
    expect(screen.getByText(/Saúde \+ Bem-estar.*3.*33%/)).toBeInTheDocument();
    expect(screen.getByText(/Casa\/Família.*2.*33%/)).toBeInTheDocument();
  });
});
