import React, { useState, useEffect } from 'react';
import { Trash2, Plus, StickyNote } from 'lucide-react';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  // Load notes from localStorage on app start
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note) => ({
        ...note,
        createdAt: new Date(note.createdAt)
      }));
      setNotes(parsedNotes);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.trim() === '') return;

    const note = {
      id: Date.now().toString(),
      content: newNote.trim(),
      createdAt: new Date()
    };

    setNotes(prev => [note, ...prev]);
    setNewNote('');
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      addNote();
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 font-sans">
     
      <header className="bg-white/90 backdrop-blur-lg border-b border-blue-200/30 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center gap-4">
          <StickyNote className="w-10 h-10 text-blue-600 animate-bounce-slow" />
          <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight drop-shadow-sm">Your Personal Notes App</h1>
          <span className="ml-3 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold shadow-inner">
            {notes.length === 0 ? 'No notes yet' : notes.length === 1 ? '1 note' : `${notes.length} notes`}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        
        <section className="mb-10">
          <div className="bg-white rounded-3xl shadow-2xl border border-blue-100/60 p-8 transition-all hover:shadow-blue-200/70">
            <div className="flex flex-col gap-5">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What’s on your mind today? (Press Ctrl+Enter to save)"
                className="w-full min-h-[120px] p-5 border-2 border-blue-200 rounded-2xl resize-none focus:border-blue-400 focus:outline-none transition-colors duration-200 text-gray-700 placeholder-gray-400 text-lg shadow-inner bg-blue-50/30"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {newNote.length > 0 && `${newNote.length} characters`}
                </span>
                <button
                  onClick={addNote}
                  disabled={newNote.trim() === ''}
                  className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-md active:scale-95 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    newNote.trim() === ''
                      ? 'bg-blue-100 text-blue-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 hover:shadow-xl'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  Save this thought
                </button>
              </div>
            </div>
          </div>
        </section>

        
        <section>
          {notes.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <StickyNote className="w-16 h-16 text-blue-200 mx-auto mb-4 animate-pulse" />
              <p className="text-blue-500 text-xl font-semibold">It’s a bit empty here...</p>
              <p className="text-blue-400 text-base mt-2">Jot down a thought, a reminder, or anything you want to remember. Your notes live here—just for you!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-2xl shadow-lg border border-blue-100/60 p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.03] group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs text-blue-400 font-medium">
                      {formatDate(note.createdAt)}
                    </span>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50 text-blue-300 hover:text-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-200"
                      title="Remove this note"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words text-base">
                      {note.content}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-50 flex items-center justify-between">
                    <span className="text-xs text-blue-300">
                      {note.content.length} characters
                    </span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full opacity-30"></span>
                  </div>
                 
                  <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-transparent group-hover:border-blue-300 transition-all duration-200"></div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <footer className="w-full mt-16 py-6 bg-white/80 border-t border-blue-100/40 text-center text-blue-400 text-sm font-medium shadow-inner animate-fade-in">
        Made with <span className="text-blue-600">❤</span> for everyone
      </footer>
    </div>
  );
}

export default App;
