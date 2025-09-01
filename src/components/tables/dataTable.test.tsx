// DataTable.test.tsx

import { screen, fireEvent } from "@testing-library/react";
import { DataTable } from "./dataTable";
import { ColumnDef } from "@tanstack/react-table";
import { renderWithClient } from "@/lib/test-utils";

type TestData = { email: string; name: string };

// Mock ResizeObserver
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

// Use only one data item to avoid pagination issues in tests
const mockData: TestData[] = [
  { name: "Alice", email: "alice@example.com" },
];

describe("DataTable", () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it("renders table with data", () => {
    renderWithClient(<DataTable columns={mockColumns} data={mockData} />);
    
    // Check headers
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    
    // Check that data is rendered
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  it("filters rows based on input", () => {
    // Add a second item for this test
    const testData = [
      ...mockData,
      { name: "Bob", email: "bob@example.com" }
    ];
    
    renderWithClient(<DataTable columns={mockColumns} data={testData} />);
    
    // Apply filter
    const input = screen.getByPlaceholderText("Filter...");
    fireEvent.change(input, { target: { value: "alice" } });

    // Check that Alice is visible
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    
    // Check that Bob is not visible (using queryByText which returns null if not found)
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("shows fallback when no results", () => {
    renderWithClient(<DataTable columns={mockColumns} data={mockData} />);
    const input = screen.getByPlaceholderText("Filter...");
    fireEvent.change(input, { target: { value: "nonexistent" } });

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });
});
