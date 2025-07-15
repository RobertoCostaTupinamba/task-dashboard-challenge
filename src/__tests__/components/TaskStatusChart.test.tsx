import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskStatusChart } from "../../components/TaskStatusChart";

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
            ? label({ name: entry.name, value: entry.value, percent: 0.5 })
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

describe("TaskStatusChart", () => {
  const mockData = {
    Pendente: 5,
    "Em Progresso": 3,
    Concluído: 7,
  };

  it("should render chart with data", () => {
    render(<TaskStatusChart data={mockData} />);

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("pie")).toBeInTheDocument();
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("legend")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("should render empty state when no data", () => {
    render(<TaskStatusChart data={{}} />);

    expect(screen.getByText("Nenhuma tarefa encontrada")).toBeInTheDocument();
    expect(screen.queryByTestId("pie-chart")).not.toBeInTheDocument();
  });

  it("should render empty state when all values are zero", () => {
    const zeroData = {
      Pendente: 0,
      "Em Progresso": 0,
      Concluído: 0,
    };

    render(<TaskStatusChart data={zeroData} />);

    expect(screen.getByText("Nenhuma tarefa encontrada")).toBeInTheDocument();
    expect(screen.queryByTestId("pie-chart")).not.toBeInTheDocument();
  });

  it("should display correct data values in chart segments", () => {
    render(<TaskStatusChart data={mockData} />);

    // Verificar se os valores aparecem nos segmentos
    expect(screen.getByText(/Pendente.*5.*50%/)).toBeInTheDocument();
    expect(screen.getByText(/Em Progresso.*3.*50%/)).toBeInTheDocument();
    expect(screen.getByText(/Concluído.*7.*50%/)).toBeInTheDocument();
  });

  it("should render pie segments for each status", () => {
    render(<TaskStatusChart data={mockData} />);

    const pieSegments = screen.getAllByTestId("pie-segment");
    expect(pieSegments).toHaveLength(3);
  });

  it("should render cells with correct colors", () => {
    render(<TaskStatusChart data={mockData} />);

    const pieCells = screen.getAllByTestId("pie-cell");
    expect(pieCells).toHaveLength(3);

    // Verificar se as cores são aplicadas
    expect(pieCells[0]).toHaveStyle({ color: "#ef4444" }); // Pendente (red)
    expect(pieCells[1]).toHaveStyle({ color: "#f59e0b" }); // Em Progresso (amber)
    expect(pieCells[2]).toHaveStyle({ color: "#10b981" }); // Concluído (emerald)
  });

  it("should handle unknown status with default color", () => {
    const dataWithUnknownStatus = {
      "Status Desconhecido": 2,
    };

    render(<TaskStatusChart data={dataWithUnknownStatus} />);

    const pieCells = screen.getAllByTestId("pie-cell");
    expect(pieCells[0]).toHaveStyle({ color: "#6b7280" }); // Default gray color
  });

  it("should render empty state icon correctly", () => {
    const { container } = render(<TaskStatusChart data={{}} />);

    const emptyStateContainer = screen
      .getByText("Nenhuma tarefa encontrada")
      .closest("div");
    expect(emptyStateContainer).toHaveClass("text-center");

    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-12", "h-12", "mx-auto", "mb-4", "text-gray-400");
  });

  it("should have correct container height", () => {
    const { container } = render(<TaskStatusChart data={mockData} />);

    const chartContainer = container.querySelector(".h-64");
    expect(chartContainer).toBeInTheDocument();
  });
});
