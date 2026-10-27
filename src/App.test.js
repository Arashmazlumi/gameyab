
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the GameYab website", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /بازی‌ها رو کشف کن/i })
  ).toBeInTheDocument();
});
