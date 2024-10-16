import './note-card.js';
import {
    notesData
} from './note-card.js';
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

document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notes-container');

    if (notesContainer) {
        notesData.forEach(note => {
            const noteElement = document.createElement('note-card');
            noteElement.setAttribute('title', note.title);
            noteElement.setAttribute('body', note.body);
            noteElement.setAttribute('createdAt', note.createdAt);
            notesContainer.appendChild(noteElement);
        });
    } else {
        console.error('notes-container element not found');
    }
});

function initializeDummyData() {
    const storedNotes = JSON.parse(localStorage.getItem('notesData'));

    if (!storedNotes || storedNotes.length === 0) {
        localStorage.setItem('notesData', JSON.stringify(notesData));
        console.log('Data dummy telah diinisialisasi dan disimpan ke Local Storage.');
    }
}

function renderNotes() {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';

    const storedNotes = JSON.parse(localStorage.getItem('notesData')) || [];

    storedNotes.forEach(note => {
        const noteElement = document.createElement('note-card');
        noteElement.setAttribute('title', note.title);
        noteElement.setAttribute('body', note.body);
        noteElement.setAttribute('createdAt', note.createdAt);

        notesContainer.appendChild(noteElement);
    });
}

function addNewNote() {
    const title = document.getElementById('note-title').value;
    const body = document.getElementById('note-body').value;
    const createdAt = new Date().toISOString();

    const newNote = {
        id: `notes-${Math.random().toString(36).substr(2, 9)}`,
        title: title,
        body: body,
        createdAt: createdAt,
        archived: false
    };

    const storedNotes = JSON.parse(localStorage.getItem('notesData')) || [];
    storedNotes.push(newNote);

    localStorage.setItem('notesData', JSON.stringify(storedNotes));

    document.getElementById('note-title').value = '';
    document.getElementById('note-body').value = '';

    renderNotes();
}

document.getElementById('note-form').addEventListener('submit', function (e) {
    e.preventDefault();
    addNewNote();
});

window.onload = function () {
    initializeDummyData();
    renderNotes();
};

document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-body');
    const submitButton = document.getElementById('submit-button');
    const titleFeedback = document.getElementById('title-feedback');
    const contentFeedback = document.getElementById('content-feedback');

    function validateForm() {
        const titleIsValid = titleInput.value.trim().length > 1;
        const contentIsValid = contentInput.value.trim().split(/\s+/).length >= 2;

        if (titleIsValid) {
            titleInput.classList.remove('is-invalid');
            titleInput.classList.add('is-valid');
            titleFeedback.style.display = 'none';
        } else {
            titleInput.classList.add('is-invalid');
            titleFeedback.style.display = 'block';
        }

        if (contentIsValid) {
            contentInput.classList.remove('is-invalid');
            contentInput.classList.add('is-valid');
            contentFeedback.style.display = 'none';
        } else {
            contentInput.classList.add('is-invalid');
            contentFeedback.style.display = 'block';
        }

        submitButton.disabled = !(titleIsValid && contentIsValid);
    }

    titleInput.addEventListener('input', validateForm);
    contentInput.addEventListener('input', validateForm);
});

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
        if (!emptyStateElement) {
            const newEmptyStateElement = document.createElement('empty-state');
            newEmptyStateElement.setAttribute('message', 'No notes found. Try adding one!');
            notesContainer.appendChild(newEmptyStateElement);
        }
    } else {
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
        loadNotes();
        loadingContainer.hidden = true;
    }, 2000);
});

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    if (notes.length === 0) {
        const emptyState = document.querySelector("empty-state");
        emptyState.removeAttribute("hidden");
    } else {
        const emptyState = document.querySelector("empty-state");
        emptyState.setAttribute("hidden", "true");
        renderNotes(notes);
    }
}