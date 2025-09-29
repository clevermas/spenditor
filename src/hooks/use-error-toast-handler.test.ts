import { renderHook } from "@testing-library/react";
import { useToast } from "@/components/ui/use-toast";
import { useErrorToastHandler } from "./use-error-toast-handler";

jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}));

describe("useErrorToastHandler", () => {
  const toastMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useToast.mockReturnValue({ toast: toastMock });
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
