import { renderHook } from "@testing-library/react";
import { toast } from "sonner";
import { useErrorToastHandler } from "./use-error-toast-handler";

jest.mock("sonner", () => ({
  toast: { error: jest.fn() },
}));

describe("useErrorToastHandler", () => {
  const toastMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    toast.error.mockReturnValue(toastMock);
  });

  it("should display a toast when an error is provided", () => {
    const error = { data: { name: "Test Error" } };
    const { rerender } = renderHook(({ error }) => useErrorToastHandler(error), {
      initialProps: { error: null },
    });

    rerender({ error });

    expect(toastMock).toHaveBeenCalledWith({
      variant: "destructive",
      title: "Something went wrong",
      description: "Test Error",
    });
  });

  it("should not display a toast when no error is provided", () => {
    renderHook(() => useErrorToastHandler(null));

    expect(toastMock).not.toHaveBeenCalled();
  });
});
