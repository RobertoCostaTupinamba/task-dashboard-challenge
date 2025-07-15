import React from "react";
import { describe, it, expect, vi } from "vitest";
import { AuthPage } from "../../pages/AuthPage";

// Mock dos componentes filhos
vi.mock("../../components/LoginForm", () => ({
  LoginForm: () =>
    React.createElement("div", { "data-testid": "login-form" }, "Login Form"),
}));

vi.mock("../../components/RegisterForm", () => ({
  RegisterForm: () =>
    React.createElement(
      "div",
      { "data-testid": "register-form" },
      "Register Form"
    ),
}));

describe("AuthPage", () => {
  it("should render without crashing", () => {
    expect(() => {
      React.createElement(AuthPage);
    }).not.toThrow();
  });

  it("should be a valid React component", () => {
    const component = React.createElement(AuthPage);
    expect(component).toBeTruthy();
    expect(component.type).toBe(AuthPage);
  });

  it("should not require any props", () => {
    const component = React.createElement(AuthPage);
    expect(component.props).toEqual({});
  });
});
