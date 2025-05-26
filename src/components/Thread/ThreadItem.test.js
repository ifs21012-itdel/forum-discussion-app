/* eslint-disable linebreak-style */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ThreadItem from './ThreadItem';

/**
 * Test scenario for ThreadItem component
 *
 * - ThreadItem component
 * - should render thread title, a snippet of the body, creation date, owner name, and comment count correctly
 * - should render 'Pengguna Anonim' if owner name is not available
 * - should render 'Tanggal tidak tersedia' if createdAt is not available
 * - should render 0 for comment count if totalComments is not available
 * - should correctly link to the thread detail page
 */
describe('ThreadItem component', () => {
  const mockThread = {
    id: 'thread-1',
    title: 'Test Thread Title',
    body: 'This is the body of the test thread, it is longer than 100 characters to test substring functionality. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: '2023-01-15T10:00:00.000Z',
    owner: { name: 'John Doe' },
    totalComments: 5,
  };

  it('should render thread title, body snippet, date, owner, and comment count correctly', () => {
    // Arrange
    render(
      <Router>
        <ThreadItem thread={mockThread} />
      </Router>
    );

    // Assert
    expect(screen.getByText(mockThread.title)).toBeInTheDocument();
    expect(screen.getByText(`${mockThread.body.substring(0, 100)}...`)).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.startsWith('Dibuat pada: ') && content.includes(new Date(mockThread.createdAt).toLocaleDateString()))).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes(`oleh ${mockThread.owner.name}`))).toBeInTheDocument();
    expect(screen.getByText(`Komentar: ${mockThread.totalComments}`)).toBeInTheDocument();
  });

  it('should render "Pengguna Anonim" if owner name is not available', () => {
    // Arrange
    const threadWithoutOwnerName = { ...mockThread, owner: {} };
    render(
      <Router>
        <ThreadItem thread={threadWithoutOwnerName} />
      </Router>
    );

    // Assert
    expect(screen.getByText((content, element) => content.includes('oleh Pengguna Anonim'))).toBeInTheDocument();
  });

  it('should render "Tanggal tidak tersedia" if createdAt is not available', () => {
    // Arrange
    const threadWithoutDate = { ...mockThread, createdAt: null };
    render(
      <Router>
        <ThreadItem thread={threadWithoutDate} />
      </Router>
    );

    // Assert
    expect(screen.getByText((content, element) => content.startsWith('Dibuat pada: Tanggal tidak tersedia'))).toBeInTheDocument();
  });

  it('should render 0 for comment count if totalComments is not available', () => {
    // Arrange
    const threadWithoutComments = { ...mockThread, totalComments: undefined };
    render(
      <Router>
        <ThreadItem thread={threadWithoutComments} />
      </Router>
    );

    // Assert
    expect(screen.getByText('Komentar: 0')).toBeInTheDocument();
  });


  it('should correctly link to the thread detail page', () => {
    // Arrange
    render(
      <Router>
        <ThreadItem thread={mockThread} />
      </Router>
    );

    // Assert
    const linkElement = screen.getByRole('link', { name: mockThread.title });
    expect(linkElement).toHaveAttribute('href', `/threads/${mockThread.id}`);
  });
});