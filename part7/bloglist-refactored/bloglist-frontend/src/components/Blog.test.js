import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Blog from "./Blog";

describe("<Blog />", () => {
  let container;
  const userSim = userEvent.setup();

  const user = {
    username: "jestdom",
    name: "Jest Dom",
  };

  const blog = {
    title: "Component testing with react-testing",
    author: "Jest Dom",
    user: {
      username: "jestdom",
      name: "Jest Dom",
    },
    url: "https://www.test.com/",
    likes: 15,
  };

  const mockUpdateHandler = jest.fn();

  beforeEach(() => {
    container = render(
      <Blog user={user} blog={blog} updateBlog={mockUpdateHandler} />
    ).container;
  });

  test("renders title first", () => {
    const title = screen.getByText("Component testing with react-testing");
    expect(title).toBeDefined();
  });

  test("renders url, likes, author after button click", async () => {
    const viewButton = screen.getByText("view");
    await userSim.click(viewButton);

    const url = container.querySelector(".blog-url");
    expect(url).toBeDefined();

    const likes = container.querySelector(".blog-likes");
    expect(likes).toBeDefined();

    const author = screen.getByText("Jest Dom");
    expect(author).toBeDefined();
  });

  test("click twice invokes event handler twice", async () => {
    const view_button = screen.getByText("view");
    await userSim.click(view_button);

    const like_button = screen.getByText("like");
    await userSim.click(like_button);
    await userSim.click(like_button);

    expect(mockUpdateHandler.mock.calls).toHaveLength(2);
  });
});
