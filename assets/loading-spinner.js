class LoadingSpinner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .spinner {
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top: 4px solid #fff;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                    margin: 20px auto;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .hidden {
                    display: none;
                }
            </style>
            <div class="spinner"></div>
        `;
    }

    hide() {
        this.shadowRoot.querySelector('.spinner').classList.add('hidden');
    }

    show() {
        this.shadowRoot.querySelector('.spinner').classList.remove('hidden');
    }
}

customElements.define('loading-spinner', LoadingSpinner);