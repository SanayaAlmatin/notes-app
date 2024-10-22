class EmptyState extends HTMLElement {
    connectedCallback() {
        const message = this.getAttribute('message') || 'Notes not available, please add them first';
        this.innerHTML = `
            <div class="text-center text-light mt-5">
                <i class="bi bi-journal-x fs-1"></i>
                <p class="mt-3">${message}</p>
            </div>
        `;
    }
}

customElements.define('empty-state', EmptyState);