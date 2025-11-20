import React, { useState, useEffect } from 'react'
import { collectionsAPI } from '../api'
import './Explore.css'

export default function Explore() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await collectionsAPI.getAll(1, 20, search)
        setBooks(res.data.data || [])
      } catch (err) {
        console.error('Failed to load collections:', err)
      } finally {
        setLoading(false)
      }
    }
    loadBooks()
  }, [search])

  const handleAddToCollection = async (book) => {
    try {
      // Save to localStorage for now (or call API)
      const stored = JSON.parse(localStorage.getItem('myCollection') || '[]')
      if (!stored.find(b => b.title === book.title)) {
        stored.push(book)
        localStorage.setItem('myCollection', JSON.stringify(stored))
        showToast(`"${book.title}" added to collection!`, 'success')
      } else {
        showToast(`"${book.title}" is already in your collection.`, 'warn')
      }
    } catch (err) {
      showToast('Error adding to collection.', 'warn')
    }
  }

  const showToast = (msg, type) => {
    const el = document.createElement('div')
    el.className = `toast ${type}`
    el.textContent = msg
    el.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 18px;
      background: ${type === 'success' ? '#4caf50' : '#ff9800'};
      color: #fff;
      border-radius: 6px;
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 3000)
  }

  if (loading) return <div className="loading">Loading collections...</div>

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>Explore Collections</h1>
        <p>Discover and collect your favorite series.</p>
      </div>

      <div className="explore-toolbar">
        <input
          type="search"
          placeholder="Search collections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book._id || book.id} className="book-card">
            <img src={book.imgSrc || '/placeholder.png'} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author || 'Unknown'}</p>
            <div className="card-actions">
              <button
                className="btn btn-primary"
                onClick={() => setModal(book)}
              >
                View More
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleAddToCollection(book)}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>×</button>
            <img src={modal.imgSrc || '/placeholder.png'} alt={modal.title} />
            <div className="modal-info">
              <h2>{modal.title}</h2>
              <p><strong>Author:</strong> {modal.author || 'N/A'}</p>
              <p><strong>Genre:</strong> {modal.genre || 'N/A'}</p>
              <p><strong>Year:</strong> {modal.year || 'N/A'}</p>
              <p>{modal.description || 'No description available.'}</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleAddToCollection(modal)
                  setModal(null)
                }}
              >
                Add to Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
