// DataTable.test.tsx

import { screen, render, fireEvent } from "@testing-library/react";
import { DataTable } from "./dataTable";
import { ColumnDef } from "@tanstack/react-table";

type TestData = { email: string; name: string };

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const mockColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email,
  },
];

const mockData: TestData[] = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
];

describe("DataTable", () => {
  it("renders table with rows", () => {
    render(<DataTable columns={mockColumns} data={mockData} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("filters rows based on input", () => {
    render(<DataTable columns={mockColumns} data={mockData} />);
    const input = screen.getByPlaceholderText("Filter...");
    fireEvent.change(input, { target: { value: "alice" } });

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("shows fallback when no results", () => {
    render(<DataTable columns={mockColumns} data={mockData} />);
    const input = screen.getByPlaceholderText("Filter...");
    fireEvent.change(input, { target: { value: "nonexistent" } });

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });
});
