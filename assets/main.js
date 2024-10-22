import './note-card.js';
import './empty-state.js';
import './loading-spinner.js';

document.getElementById('toggleSidebar').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const toggleIcon = document.getElementById('toggleIcon');

    sidebar.classList.toggle('expanded');

    if (sidebar.classList.contains('expanded')) {
        toggleIcon.classList.remove('bi-list');
        toggleIcon.classList.add('bi-arrow-left-circle');
    } else {
        toggleIcon.classList.remove('bi-arrow-left-circle');
        toggleIcon.classList.add('bi-list');
    }
});

function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        sidebar.classList.remove('expanded');
    }
}

window.addEventListener('load', handleResize);
window.addEventListener('resize', handleResize);

// Fungsi untuk menampilkan notes dari API
async function renderNotes() {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = ''; // Kosongkan kontainer

    try {
        const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
        const result = await response.json();

        if (result.data.length > 0) {
            // Hapus elemen empty-state jika ada
            const emptyStateElement = document.querySelector('empty-state');
            if (emptyStateElement) {
                emptyStateElement.remove();
            }

            // Tambahkan notes ke kontainer
            result.data.forEach(note => {
                const noteElement = document.createElement('note-card');
                noteElement.setAttribute('id', note.id);
                noteElement.setAttribute('title', note.title);
                noteElement.setAttribute('body', note.body);
                noteElement.setAttribute('createdAt', note.createdAt);
                notesContainer.appendChild(noteElement);
            });
        } else {
            // Jika tidak ada notes, tampilkan empty-state
            if (!document.querySelector('empty-state')) {
                const emptyStateElement = document.createElement('empty-state');
                emptyStateElement.setAttribute('message', 'No notes available. Try adding one!');
                notesContainer.appendChild(emptyStateElement);
            }
        }
    } catch (error) {
        console.error('Error fetching notes:', error);

        // Tampilkan pesan error dalam empty-state
        if (!document.querySelector('empty-state')) {
            const errorStateElement = document.createElement('empty-state');
            errorStateElement.setAttribute('message', 'Failed to load notes. Please try again later.');
            notesContainer.appendChild(errorStateElement);
        }
    }
}

// Fungsi untuk menambah note baru menggunakan API dengan validasi
async function addNewNote() {
    const title = document.getElementById('note-title').value;
    const body = document.getElementById('note-body').value;

    // Validasi input
    if (!title || !body) {
        alert('Title and body are required to create a new note.');
        return;
    }

    if (title.length > 50) {
        alert('Title must not exceed 50 characters.');
        return;
    }

    // Validasi bahwa body harus minimal dua kata
    const wordCount = body.trim().split(/\s+/).length;
    if (wordCount < 2) {
        alert('Body must contain at least two words.');
        return;
    }

    try {
        const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                body: body,
            }),
        });

        const result = await response.json();
        if (result.status === 'success') {
            console.log('Note created successfully:', result.data);
            document.getElementById('note-title').value = '';
            document.getElementById('note-body').value = '';
            renderNotes(); // Refresh notes setelah berhasil menambah note
        } else {
            console.error('Failed to create note:', result.message);
        }
    } catch (error) {
        console.error('Error creating note:', error);
    }
}

document.getElementById('note-form').addEventListener('submit', function (e) {
    e.preventDefault();
    addNewNote();
});

// Fungsi untuk memvalidasi form dan mengaktifkan tombol, sekaligus menampilkan pesan error
function validateForm() {
    const title = document.getElementById('note-title').value.trim();
    const body = document.getElementById('note-body').value.trim();
    const submitButton = document.getElementById('submit-button');

    const titleFeedback = document.getElementById('title-feedback');
    const contentFeedback = document.getElementById('content-feedback');

    const wordCount = body.split(/\s+/).length;

    // Validasi title
    if (title.length > 1) {
        titleFeedback.style.display = 'none';
        document.getElementById('note-title').classList.remove('is-invalid');
        document.getElementById('note-title').classList.add('is-valid');
    } else {
        titleFeedback.style.display = 'block';
        document.getElementById('note-title').classList.add('is-invalid');
        document.getElementById('note-title').classList.remove('is-valid');
    }

    // Validasi body (minimal 2 kata)
    if (wordCount >= 2) {
        contentFeedback.style.display = 'none';
        document.getElementById('note-body').classList.remove('is-invalid');
        document.getElementById('note-body').classList.add('is-valid');
    } else {
        contentFeedback.style.display = 'block';
        document.getElementById('note-body').classList.add('is-invalid');
        document.getElementById('note-body').classList.remove('is-valid');
    }

    // Aktifkan tombol submit jika kedua validasi terpenuhi
    if (title.length > 1 && wordCount >= 2) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

// Tambahkan event listener untuk memantau perubahan input di field note-title dan note-body
document.getElementById('note-title').addEventListener('input', validateForm);
document.getElementById('note-body').addEventListener('input', validateForm);

// Fungsi pencarian
function filterNotesByKeyword(keyword) {
    const notes = document.querySelectorAll('note-card');
    let hasMatch = false;

    notes.forEach(note => {
        const title = note.getAttribute('title') || '';
        const body = note.getAttribute('body') || '';

        const isMatch = title.toLowerCase().includes(keyword.toLowerCase()) ||
            body.toLowerCase().includes(keyword.toLowerCase());

        if (isMatch) {
            note.style.display = 'block';
            hasMatch = true;
        } else {
            note.style.display = 'none';
        }
    });

    const notesContainer = document.getElementById('notes-container');
    const emptyStateElement = document.querySelector('empty-state');

    if (!hasMatch) {
        // Jika tidak ada kecocokan, tampilkan empty-state
        if (!emptyStateElement) {
            const newEmptyStateElement = document.createElement('empty-state');
            newEmptyStateElement.setAttribute('message', 'No notes found for your search.');
            notesContainer.appendChild(newEmptyStateElement);
        }
    } else {
        // Jika ada kecocokan, sembunyikan/hapus empty-state
        if (emptyStateElement) {
            emptyStateElement.remove();
        }
    }
}

document.getElementById('navbarSearchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput').value.trim();
    filterNotesByKeyword(searchInput);
});

document.getElementById('mobileSearchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const searchInput = document.getElementById('mobileSearchInput').value.trim();
    filterNotesByKeyword(searchInput);

    const searchModal = bootstrap.Modal.getInstance(document.getElementById('searchModal'));
    if (searchModal) {
        searchModal.hide();
    }
});

function resetSearch() {
    const notesContainer = document.getElementById('notes-container');
    const emptyStateElement = document.querySelector('empty-state');

    // Remove empty state when resetting the search
    if (emptyStateElement) {
        emptyStateElement.remove();
    }

    const allNotes = notesContainer.querySelectorAll('note-card');
    allNotes.forEach(note => {
        note.style.display = '';
    });
}

document.getElementById('searchInput').addEventListener('input', function () {
    if (this.value.trim() === '') {
        resetSearch();
    } else {
        filterNotesByKeyword(this.value.trim());
    }
});

document.getElementById('mobileSearchInput').addEventListener('input', function () {
    if (this.value.trim() === '') {
        resetSearch();
    } else {
        filterNotesByKeyword(this.value.trim());
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const loadingContainer = document.getElementById("loading-container");
    const notesContainer = document.getElementById("notes-container");

    loadingContainer.hidden = false;

    setTimeout(() => {
        renderNotes();
        loadingContainer.hidden = true;
    }, 2000);
});