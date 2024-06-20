const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'user 1',
        username: 'user1',
        password: 'password'
      }
    })

    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'user1', 'password')
      await expect(page.getByText('Blogs')).toBeVisible()
      await expect(page.getByText('user 1 logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'user1', 'wrong')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('user 1 logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'user1', 'password')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'example', 'mr blogs', 'www.blogs.com')
      await expect(page.getByText('a new blog example by mr blogs added')).toBeVisible()
      await expect(page.getByRole('button', { name: 'create new blog' })).toBeVisible()

      const hiddenDiv = page.locator('div.hiddenBlog')
      await expect(hiddenDiv).toContainText('example mr blogs')
      await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
    })

    describe('Several blogs exists', () => {
      beforeEach(async ({page}) => {
        await createBlog(page, 'example1', 'mr one', 'www.blogs1.com')
        await createBlog(page, 'example2', 'mr two', 'www.blogs2.com')
        await createBlog(page, 'example3', 'mr three', 'www.blogs3.com')
      })

      test('a blog can be liked', async ({ page }) => {
        const blog = page.locator('.blog').filter({ hasText: 'example1'})
        await blog.getByRole('button', { name: 'view' }).click()

        await expect(blog.getByText('likes 0')).toBeVisible()
        await blog.getByRole('button', { name: 'like' }).click()
        await expect(blog.getByText('likes 1')).toBeVisible()
      })

      test('the user who added blog can delete it', async ({ page }) => {
        const blog = page.locator('.blog').filter({ hasText: 'example1'})
        await blog.getByRole('button', { name: 'view' }).click()

        const removeButton = blog.getByRole('button', { name: 'remove' })
        await expect(removeButton).toBeVisible()

        page.on('dialog', async (dialog) => {
          expect(dialog.type()).toBe('confirm')
          await dialog.accept()
        })

        await removeButton.click()

        await expect(blog).not.toBeVisible()
      })

      test('only the user who added blog can delete blog', async ({ page, request }) => {
        const blog = page.locator('.blog').filter({ hasText: 'example1'})
        await blog.getByRole('button', { name: 'view' }).click()
        await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()
        await request.post('/api/users', {
          data: {
            username: 'newuser',
            name: 'New User',
            password: 'password',
          }
        })
        await loginWith(page, 'newuser', 'password')

        await blog.getByRole('button', { name: 'view' }).click()
        await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('blogs are arranged in order of likes with most likes first', async ({ page }) => {
        const blog1 = page.locator('.blog').filter({ hasText: 'example1' })
        const blog2 = page.locator('.blog').filter({ hasText: 'example2' })
        const blog3 = page.locator('.blog').filter({ hasText: 'example3' })

        await blog1.getByRole('button', { name: 'view' }).click()
        await blog2.getByRole('button', { name: 'view' }).click()
        await blog3.getByRole('button', { name: 'view' }).click()

        const blogTwoLikeButton = blog2.getByRole('button', { name: 'like' })
        const blogThreeLikeButton = blog3.getByRole('button', { name: 'like' })

        await blogTwoLikeButton.click()
        await blogThreeLikeButton.click()
        await blogTwoLikeButton.click()

        await expect(blog2).toContainText('likes 2')
        await expect(blog3).toContainText('likes 1')
        await expect(blog1).toContainText('likes 0')

        expect(page.locator('.blog').first()).toContainText('example2')
        expect(page.locator('.blog').nth(1)).toContainText('example3')
        expect(page.locator('.blog').last()).toContainText('example1')
      })
    })
  })
})