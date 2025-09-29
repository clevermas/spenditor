jest.mock("@/redux/hooks", () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock("@/hooks/use-error-toast-handler", () => ({
  useErrorToastHandler: jest.fn(),
}));

import { renderHook } from "@testing-library/react";
import { useTransactionModal } from "@/hooks/use-transaction-modal"; 
import { close } from "@/redux/features/modal.slice"; 
import { useErrorToastHandler } from "@/hooks/use-error-toast-handler";

describe("useTransactionModal", () => {
  const dispatch = jest.fn();
  let mockMutation = [null, { status: "", error: null, reset: jest.fn() }];

  beforeEach(() => {
    const { useAppDispatch, useAppSelector } = require("@/redux/hooks");
    useAppDispatch.mockReturnValue(dispatch);
    useAppSelector.mockImplementation((selector) => {
      return selector({
        modalReducer: {
          type: "addTransaction",
          isOpen: true,
          data: "mockedData",
        },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize with valid data and open modal", () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();
    
    const { result } = renderHook(() => useTransactionModal("addTransaction", mockMutation, onOpen, onClose));

    const isOpen = result.current[0];
    expect(isOpen).toBe(true);
    expect(onOpen).toHaveBeenCalledWith("mockedData");
  });

  test("should close modal and call onClose callback", () => {
    const { useAppSelector } = require("@/redux/hooks");
    useAppSelector.mockImplementation((selector) => {
      return selector({
        modalReducer: {
          type: "addTransaction",
          isOpen: false,
          data: null,
        },
      });
    });

    const onOpen = jest.fn();
    const onClose = jest.fn();
    const { result } = renderHook(() => useTransactionModal("addTransaction", mockMutation, onOpen, onClose));

    const isOpen = result.current[0];
    expect(isOpen).toBe(false);
    expect(onClose).toHaveBeenCalled();
  });


  test("should handle mutation success and close modal", () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const { rerender } = renderHook(() => useTransactionModal("addTransaction", mockMutation, onOpen, onClose));

    mockMutation[1].status = 'fulfilled';
    rerender();

    expect(dispatch).toHaveBeenCalledWith(close());
    expect(mockMutation[1].reset).toHaveBeenCalled();
  });

  test("should call error toast handler", () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();
    
    const { rerender } = renderHook(() => useTransactionModal("addTransaction", mockMutation, onOpen, onClose));

    mockMutation[1].error = 'mocked error';
    rerender();

    expect(useErrorToastHandler).toHaveBeenCalledWith(mockMutation[1].error);
  });
});
