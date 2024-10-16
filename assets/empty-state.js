class EmptyState extends HTMLElement {
    connectedCallback() {
        const message = this.getAttribute('message') || 'No notes available';
        this.innerHTML = `
            <div class="text-center text-light my-5">
                <i class="bi bi-journal-x fs-1"></i>
                <p class="mt-3">${message}</p>
            </div>
        `;
    }
}

customElements.define('empty-state', EmptyState);