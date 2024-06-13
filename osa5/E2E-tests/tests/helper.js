export const login = async (page, username, password) => {
    await page.goto('http://localhost:5173');
    await page.getByTestId('username').fill(username);
    await page.getByTestId('password').fill(password);
    await page.getByRole('button', { name: 'login' }).click();
}
  
export const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }, { timeout: 10000 }).click()
  await page.getByTestId('Title').fill(title)
  await page.getByTestId('Author').fill(author)
  await page.getByTestId('URL').fill(url)
  await page.getByRole('button', { name: 'save' }).click()
  await page.waitForSelector(`text=${title}`, { timeout: 5000 })
  await page.waitForSelector('text=Blog added successfully', { timeout: 5000 })
}
  
export const sortBlogsByLikes = (blogs) => { return blogs.sort((a, b) => b.likes - a.likes) }

