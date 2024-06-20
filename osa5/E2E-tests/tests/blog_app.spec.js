import { test, expect, beforeEach, describe } from "@playwright/test";
import { login, createBlog, sortBlogsByLikes } from "./helper";

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Aaro Paltemaa",
        username: "apaltemaa",
        password: "password",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("log in to application")).toBeVisible();
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });
});

describe("Login", () => {
  test("succeeds with correct credentials", async ({ page }) => {
    await login(page, "apaltemaa", "password");
    await expect(page.getByText("Logged in successfully")).toBeVisible();
  });

  test("fails with wrong credentials", async ({ page }) => {
    await login(page, "apaltemaa", "wrong");
    await expect(page.getByText("Wrong credentials")).toBeVisible();
  });
});

describe("When logged in", () => {
  beforeEach(async ({ page }) => {
    await login(page, "apaltemaa", "password");
  });

  test("a new blog can be created", async ({ page }) => {
    await createBlog(page, "New blog title 2", "Author 2", "www.example.com");
    await expect(page.getByText("New blog title 2").first()).toBeVisible();
  });
});

describe("When a blog exists", () => {
  beforeEach(async ({ page }) => {
    await login(page, "apaltemaa", "password");
    await createBlog(
      page,
      "Jasmiinan ostosten esittely",
      "Jasmine",
      "www.kicks.fi",
    );
  });

  test("the blog can be liked", async ({ page }) => {
    await page
      .locator("div")
      .filter({ hasText: /^Jasmiinan ostosten esittelyViewlikeremove$/ })
      .getByRole("button")
      .nth(1)
      .click();
    await expect(page.getByText("Blog liked successfully")).toBeVisible();
  });
});

describe("When the logged in user is the creator of the blog", () => {
  beforeEach(async ({ page }) => {
    await login(page, "apaltemaa", "password");
    await createBlog(
      page,
      "Jasmiinan ostosten esittely",
      "Jasmine",
      "www.kicks.fi",
    );
    await createBlog(page, "Joukon pelivideo", "Joni", "www.twitch.tv/jonkki");
    await createBlog(page, "Joonaksen ruokaohje", "Joonas", "www.k-ruoka.fi");
  });

  test("the blog can be removed", async ({ page }) => {
    page.once("dialog", async (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });

    await page
      .locator("div")
      .filter({ hasText: /^Joukon pelivideoViewlikeremove$/ })
      .getByTestId("delete-button")
      .click();
    await expect(page.getByText("Blog removed successfully")).toBeVisible();
    await expect(page.getByText("Joukon pelivideo")).not.toBeVisible();
  });
});

describe("When the blogs are fine and dined", () => {
  beforeEach(async ({ page }) => {
    await login(page, "kkosola", "kosola1234");
    await createBlog(
      page,
      "Testi blogi 1",
      "Testi Author 1",
      "www.example.com",
    );
  });

  test("Only the creator of the blog can remove it", async ({ page }) => {
    const deleteButton = await page
      .locator("div")
      .filter({ hasText: /^Jasmiinan ostosten esittelyViewlikeremove$/ })
      .getByTestId("delete-button");

    await expect(deleteButton).not.toBeVisible();
  });
});

describe("When multiple blogs exist", () => {
  beforeEach(async ({ page }) => {
    await login(page, "apaltemaa", "password");
    await createBlog(
      page,
      "Jasmiinan ostosten esittely",
      "Jasmine",
      "www.kicks.fi",
    );
  });

  test("the blogs are sorted by likes", async ({ page }) => {
    const blogs = await page
      .locator("div")
      .filter({ hasText: /^Viewlikeremove$/ })
      .all();
    await sortBlogsByLikes(blogs);

    const firstBlogTitle = await page
      .locator("div")
      .filter({ hasText: /^JUhani$/ })
      .first();
    await expect(firstBlogTitle).toContainText("JUhani");
  });
});
