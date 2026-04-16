import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AddBookModal from "./AddBookModal";

vi.mock("convex/react", () => ({
  useMutation: () => vi.fn(),
  useQuery: () => null,
}));

vi.mock("../GoogleBookSearch", () => ({
  default: () => <div data-testid="google-book-search">Search</div>,
}));

vi.mock("../CoverImage", () => ({
  default: () => <img data-testid="cover-image" alt="cover" />,
}));

vi.mock("../CoverUpload", () => ({
  default: () => <div data-testid="cover-upload">Upload</div>,
}));

describe("AddBookModal", () => {
  it("renders when open", () => {
    render(
      <AddBookModal
        isOpen={true}
        onClose={vi.fn()}
        onAdd={vi.fn()}
      />,
    );
    expect(screen.getByText("Add Book")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    const { container } = render(
      <AddBookModal
        isOpen={false}
        onClose={vi.fn()}
        onAdd={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
