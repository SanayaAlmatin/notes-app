class NoteCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    static get observedAttributes() {
        return ['title', 'body', 'createdAt'];
    }

    render() {
        const id = this.getAttribute('id');
        const title = this.getAttribute('title') || 'No Title';
        const body = this.getAttribute('body') || 'No Content';
        const createdAt = this.getAttribute('createdAt') ? new Date(this.getAttribute('createdAt')).toLocaleDateString() : 'Unknown Date';

        // Bersihkan shadowRoot terlebih dahulu
        this.shadowRoot.innerHTML = '';

        // Buat elemen <link> untuk memuat Bootstrap Icons dari CDN
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css';

        // Tambahkan style dan HTML ke shadow DOM
        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    background-color: transparent; 
                    border: 1px solid #ffffff; 
                    border-radius: 8px;
                    padding: 16px;
                    margin: 12px;
                    transition: box-shadow 0.3s ease-in-out;
                    position: relative;
                    overflow: hidden; /* Untuk menyembunyikan icon di luar batas */
                    box-sizing: border-box;
                    min-height: 150px;
                }

                .card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Shadow pada hover */
                    background-color: #bd93f9;
                }

                .card-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 0;
                    margin-bottom: 8px;
                    color: #ffffff; /* Warna teks putih */
                }

                .card-body {
                    font-size: 14px;
                    color: #e0e0e0;
                    margin: 0;
                    white-space: pre-wrap; /* Untuk menjaga format teks body */
                    overflow-wrap: break-word; /* Agar teks panjang tidak overflow */
                }

                .card-date {
                    font-size: 12px;
                    color: #d3d3d3;
                    margin-top: 12px;
                }

                /* Style untuk icon container */
                .card-icons {
                    position: absolute;
                    top: 18px;
                    right: 8px;
                    display: flex;
                    gap: 8px;
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                    z-index: 10;
                }

                /* Tampilkan icon hanya saat hover */
                .card:hover .card-icons {
                    opacity: 1;
                }

                /* Style untuk icon */
                .card-icon {
                    cursor: pointer;
                    color: #ffffff;
                    font-size: 16px;
                    transition: transform 0.2s ease;
                }

                /* Animasi icon saat hover */
                .card-icon:hover {
                    transform: scale(1.2);
                }
            </style>

            <div class="card">
                <h5 class="card-title">${title}</h5>
                <p class="card-body">${body}</p>
                <p class="card-date"><small>${createdAt}</small></p>

                <!-- Container untuk icon -->
                <div class="card-icons">
                    <!-- Icon hapus -->
                    <i class="bi bi-trash card-icon" id="delete-icon" title="Delete"></i>
                    <!-- Icon arsip -->
                    <i class="bi bi-archive card-icon" id="archive-icon" title="Archive"></i>
                </div>
            </div>
        `;

        // Masukkan <link> ke shadowRoot untuk memuat Bootstrap Icons
        this.shadowRoot.prepend(linkElement);

        // Tambahkan event listener untuk icon delete
        this.shadowRoot.getElementById('delete-icon').addEventListener('click', () => {
            const id = this.getAttribute('id');
            this.handleDelete(id);
        });

        // Tambahkan event listener untuk icon archive
        this.shadowRoot.getElementById('archive-icon').addEventListener('click', () => {
            this.handleArchive(id);
        });
    }

    // Fungsi untuk menangani penghapusan catatan
    handleDelete(id) {
        console.log('Deleting note with id:', id);
        if (!id) {
            console.error('No id found for this note.');
            return;
        }

        if (confirm('Are you sure you want to delete this note?')) {
            // Kirim permintaan DELETE ke API
            fetch(`https://notes-api.dicoding.dev/v2/notes/${id}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert(data.message);
                        this.remove(); // Hapus catatan dari tampilan
                    } else {
                        console.error('Failed to delete the note:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }

    // Fungsi untuk menangani pengarsipan catatan
    handleArchive(id) {
        console.log(`Note with id ${id} has been archived.`);
        // Tambahkan logika untuk mengarsipkan catatan (misalnya, panggilan ke API atau mengubah status di UI)
    }
}

customElements.define('note-card', NoteCard);