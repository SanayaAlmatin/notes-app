import './note-card.js';
import {
    notesData
} from './note-card.js'; // Import data dummy       

// Handle sidebar toggle
document.getElementById('toggleSidebar').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const toggleIcon = document.getElementById('toggleIcon');

    // Toggle expanded class on sidebar
    sidebar.classList.toggle('expanded');

    // Toggle hamburger icon and collapse icon
    if (sidebar.classList.contains('expanded')) {
        toggleIcon.classList.remove('bi-list');
        toggleIcon.classList.add('bi-arrow-left-circle'); // Change to collapse icon
    } else {
        toggleIcon.classList.remove('bi-arrow-left-circle');
        toggleIcon.classList.add('bi-list'); // Change back to hamburger icon
    }
});

// Function to close sidebar if screen width is less than 768px
function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    const isMobile = window.innerWidth < 768;

    // Jika di mobile, hapus kelas expanded dari sidebar
    if (isMobile) {
        sidebar.classList.remove('expanded');
    }
}

// Jalankan saat halaman di-load dan ketika ukuran layar berubah
window.addEventListener('load', handleResize);
window.addEventListener('resize', handleResize);

document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notes-container');

    // Jika elemen container ditemukan
    if (notesContainer) {
        // Fungsi untuk membuat dan menambahkan note-card untuk setiap catatan
        notesData.forEach(note => {
            const noteElement = document.createElement('note-card');
            noteElement.setAttribute('title', note.title);
            noteElement.setAttribute('body', note.body);
            noteElement.setAttribute('createdAt', note.createdAt);

            // Tambahkan console log untuk debugging
            console.log('Adding note: ', note);

            // Menambahkan elemen note-card ke dalam container
            notesContainer.appendChild(noteElement);
        });
    } else {
        console.error('notes-container element not found');
    }
});