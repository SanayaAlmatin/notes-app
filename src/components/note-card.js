class NoteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  static get observedAttributes() {
    return ["title", "body", "createdAt", "archived"];
  }

  render() {
    const id = this.getAttribute("id");
    const title = this.getAttribute("title") || "No Title";
    const body = this.getAttribute("body") || "No Content";
    const createdAt = this.getAttribute("createdAt")
      ? new Date(this.getAttribute("createdAt")).toLocaleDateString()
      : "Unknown Date";
    const isArchived = this.getAttribute("archived") === "true";

    this.shadowRoot.innerHTML = "";

    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href =
      "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css";

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
                    overflow: hidden;
                    box-sizing: border-box;
                    min-height: 150px;
                }

                .card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); 
                    background-color: #bd93f9;
                }

                .card-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 0;
                    margin-bottom: 8px;
                    color: #ffffff; 
                }

                .card-body {
                    font-size: 14px;
                    color: #e0e0e0;
                    margin: 0;
                    white-space: pre-wrap;
                    overflow-wrap: break-word;
                }

                .card-date {
                    font-size: 12px;
                    color: #d3d3d3;
                    margin-top: 12px;
                }

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

                .card:hover .card-icons {
                    opacity: 1;
                }

                .card-icon {
                    cursor: pointer;
                    color: #ffffff;
                    font-size: 16px;
                    transition: transform 0.2s ease;
                }

                .card-icon:hover {
                    transform: scale(1.2);
                }
            </style>

            <div class="card">
                <h5 class="card-title">${title}</h5>
                <p class="card-body">${body}</p>
                <p class="card-date"><small>${createdAt}</small></p>

                <div class="card-icons">
                    <i class="bi bi-trash card-icon" id="delete-icon" title="Delete"></i>
                    <!-- Icon arsip/unarsip -->
                    <i class="bi ${isArchived ? "bi-arrow-up-circle" : "bi-archive"} card-icon" id="archive-icon" title="${isArchived ? "Unarchive" : "Archive"}"></i>
                </div>
            </div>
        `;

    this.shadowRoot.prepend(linkElement);

    this.shadowRoot
      .getElementById("delete-icon")
      .addEventListener("click", () => {
        const id = this.getAttribute("id");
        this.handleDelete(id);
      });

    this.shadowRoot
      .getElementById("archive-icon")
      .addEventListener("click", () => {
        const id = this.getAttribute("id");
        const isArchived = this.getAttribute("archived") === "true";
        if (isArchived) {
          this.handleUnarchive(id);
        } else {
          this.handleArchive(id);
        }
      });
  }

  handleDelete(id) {
    console.log("Deleting note with id:", id);
    if (!id) {
      console.error("No id found for this note.");
      return;
    }

    Swal.fire({
      title: "Are You Sure?",
      text: "This note will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://notes-api.dicoding.dev/v2/notes/${id}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: data.message,
              });
              this.remove();
            } else {
              Swal.fire({
                icon: "error",
                title: "Failed to Delete",
                text: data.message,
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "An error occurred while deleting the record. Please try again later.",
            });
            console.error("Error:", error);
          });
      }
    });
  }

  handleArchive(id) {
    if (!id) {
      console.error("No id found for this note.");
      return;
    }

    fetch(`https://notes-api.dicoding.dev/v2/notes/${id}/archive`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Archived!",
            text: "The note has been archived.",
          });
          this.remove();
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to Archive",
            text: data.message,
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while archiving the note. Please try again later.",
        });
        console.error("Error:", error);
      });
  }

  handleUnarchive(id) {
    if (!id) {
      console.error("No id found for this note.");
      return;
    }

    fetch(`https://notes-api.dicoding.dev/v2/notes/${id}/unarchive`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Unarchive response:", data);
        if (data.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Unarchived!",
            text: "The note has been moved from the archive.",
          });
          this.remove();
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to Unarchive",
            text: data.message,
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while unarchiving the note. Please try again later.",
        });
        console.error("Error:", error);
      });
  }
}

customElements.define("note-card", NoteCard);
