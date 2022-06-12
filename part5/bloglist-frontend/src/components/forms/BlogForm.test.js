import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let container
  const userSim = userEvent.setup()

  const mockBlogFormHandler = jest.fn()

  beforeEach(() => {
    container = render(<BlogForm createBlog={mockBlogFormHandler} />).container
  })

  test('check blog creation', async () => {
    const submitButton = screen.getByText('create')

    const titleInput = container.querySelector('.title-input')
    await userSim.type(titleInput, 'Simulated blog creation')

    const authorInput = container.querySelector('.author-input')
    await userSim.type(authorInput, 'Sim Ulated')

    const urlInput = container.querySelector('.url-input')
    await userSim.type(urlInput, 'https://user.sim/')

    await userSim.click(submitButton)

    expect(mockBlogFormHandler.mock.calls).toHaveLength(1)

    expect(mockBlogFormHandler.mock.calls[0][0].title).toBe('Simulated blog creation' )
    expect(mockBlogFormHandler.mock.calls[0][0].author).toBe('Sim Ulated' )
    expect(mockBlogFormHandler.mock.calls[0][0].url).toBe('https://user.sim/' )

  })

})