import "./styles/style.css";
import "./components/note-card.js";
import "./components/empty-state.js";
import "./components/loading-spinner.js";

document.getElementById("toggleSidebar").addEventListener("click", function () {
  const sidebar = document.getElementById("sidebar");
  const toggleIcon = document.getElementById("toggleIcon");

  sidebar.classList.toggle("expanded");

  if (sidebar.classList.contains("expanded")) {
    toggleIcon.classList.remove("bi-list");
    toggleIcon.classList.add("bi-arrow-left-circle");
  } else {
    toggleIcon.classList.remove("bi-arrow-left-circle");
    toggleIcon.classList.add("bi-list");
  }
});

function handleResize() {
  const sidebar = document.querySelector(".sidebar");
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    sidebar.classList.remove("expanded");
  }
}

window.addEventListener("load", handleResize);
window.addEventListener("resize", handleResize);

document.addEventListener("DOMContentLoaded", function () {
  const pageTitle = document.getElementById("page-title");
  const notesContainer = document.getElementById("notes-container");
  const archivedNotesContainer = document.getElementById(
    "archived-notes-container",
  );
  const archiveSidebarBtnDesktop = document.getElementById(
    "archive-sidebar-btn-desktop",
  );
  const archiveSidebarBtnMobile = document.getElementById(
    "archive-sidebar-btn-mobile",
  );
  const allNotesBtn = document.getElementById("all_notes");

  function showAllNotes() {
    pageTitle.innerHTML = "<i>Semua Catatan</i>";
    notesContainer.removeAttribute("hidden");
    archivedNotesContainer.setAttribute("hidden", "");
    allNotesBtn.classList.add("active");
    archiveSidebarBtnDesktop.classList.remove("active");
    archiveSidebarBtnMobile.classList.remove("active");
  }

  function showArchivedNotes() {
    pageTitle.innerHTML = "<i>Arsip Catatan</i>";
    archivedNotesContainer.removeAttribute("hidden");
    notesContainer.setAttribute("hidden", "");
    archiveSidebarBtnDesktop.classList.add("active");
    archiveSidebarBtnMobile.classList.add("active");
    allNotesBtn.classList.remove("active");
  }

  archiveSidebarBtnDesktop.addEventListener("click", function (event) {
    event.preventDefault();
    showArchivedNotes();
  });

  archiveSidebarBtnMobile.addEventListener("click", function (event) {
    event.preventDefault();
    showArchivedNotes();
  });

  allNotesBtn.addEventListener("click", function (event) {
    event.preventDefault();
    showAllNotes();
  });
});

async function renderNotes() {
  const notesContainer = document.getElementById("notes-container");
  notesContainer.innerHTML = "";

  try {
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes");
    const result = await response.json();

    if (result.data.length > 0) {
      const emptyStateElement = document.querySelector("empty-state");
      if (emptyStateElement) {
        emptyStateElement.remove();
      }

      result.data.forEach((note) => {
        const noteElement = document.createElement("note-card");
        noteElement.setAttribute("id", note.id);
        noteElement.setAttribute("title", note.title);
        noteElement.setAttribute("body", note.body);
        noteElement.setAttribute("createdAt", note.createdAt);
        notesContainer.appendChild(noteElement);
      });
    } else {
      if (!document.querySelector("empty-state")) {
        const emptyStateElement = document.createElement("empty-state");
        emptyStateElement.setAttribute(
          "message",
          "No notes available. Try adding one!",
        );
        notesContainer.appendChild(emptyStateElement);
      }
    }
  } catch (error) {
    console.error("Error fetching notes:", error);

    if (!document.querySelector("empty-state")) {
      const errorStateElement = document.createElement("empty-state");
      errorStateElement.setAttribute(
        "message",
        "Failed to load notes. Please try again later.",
      );
      notesContainer.appendChild(errorStateElement);
    }
  }
}

async function addNewNote() {
  const title = document.getElementById("note-title").value;
  const body = document.getElementById("note-body").value;

  if (!title || !body) {
    alert("Title and body are required to create a new note.");
    return;
  }

  if (title.length > 50) {
    alert("Title must not exceed 50 characters.");
    return;
  }

  const wordCount = body.trim().split(/\s+/).length;
  if (wordCount < 2) {
    alert("Body must contain at least two words.");
    return;
  }

  try {
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        body: body,
      }),
    });

    const result = await response.json();
    if (result.status === "success") {
      console.log("Note created successfully:", result.data);
      document.getElementById("note-title").value = "";
      document.getElementById("note-body").value = "";

      const modalElement = document.getElementById("addNoteModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }

      renderNotes();
    } else {
      console.error("Failed to create note:", result.message);
    }
  } catch (error) {
    console.error("Error creating note:", error);
  }
}

document.getElementById("saveNoteButton").addEventListener("click", addNewNote);

document.getElementById("note-form").addEventListener("submit", function (e) {
  e.preventDefault();
  addNewNote();
});

function validateForm() {
  const title = document.getElementById("note-title").value.trim();
  const body = document.getElementById("note-body").value.trim();
  const submitButton = document.getElementById("submit-button");

  const titleFeedback = document.getElementById("title-feedback");
  const contentFeedback = document.getElementById("content-feedback");

  const wordCount = body.split(/\s+/).length;

  if (title.length > 1) {
    titleFeedback.style.display = "none";
    document.getElementById("note-title").classList.remove("is-invalid");
    document.getElementById("note-title").classList.add("is-valid");
  } else {
    titleFeedback.style.display = "block";
    document.getElementById("note-title").classList.add("is-invalid");
    document.getElementById("note-title").classList.remove("is-valid");
  }

  if (wordCount >= 2) {
    contentFeedback.style.display = "none";
    document.getElementById("note-body").classList.remove("is-invalid");
    document.getElementById("note-body").classList.add("is-valid");
  } else {
    contentFeedback.style.display = "block";
    document.getElementById("note-body").classList.add("is-invalid");
    document.getElementById("note-body").classList.remove("is-valid");
  }

  if (title.length > 1 && wordCount >= 2) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

document.getElementById("note-title").addEventListener("input", validateForm);
document.getElementById("note-body").addEventListener("input", validateForm);

function filterNotesByKeyword(keyword) {
  const notes = document.querySelectorAll("note-card");
  let hasMatch = false;

  notes.forEach((note) => {
    const title = note.getAttribute("title") || "";
    const body = note.getAttribute("body") || "";

    const isMatch =
      title.toLowerCase().includes(keyword.toLowerCase()) ||
      body.toLowerCase().includes(keyword.toLowerCase());

    if (isMatch) {
      note.style.display = "block";
      hasMatch = true;
    } else {
      note.style.display = "none";
    }
  });

  const notesContainer = document.getElementById("notes-container");
  const emptyStateElement = document.querySelector("empty-state");

  if (!hasMatch) {
    if (!emptyStateElement) {
      const newEmptyStateElement = document.createElement("empty-state");
      newEmptyStateElement.setAttribute(
        "message",
        "No notes found for your search.",
      );
      notesContainer.appendChild(newEmptyStateElement);
    }
  } else {
    if (emptyStateElement) {
      emptyStateElement.remove();
    }
  }
}

document
  .getElementById("navbarSearchForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const searchInput = document.getElementById("searchInput").value.trim();
    filterNotesByKeyword(searchInput);
  });

document
  .getElementById("mobileSearchForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const searchInput = document
      .getElementById("mobileSearchInput")
      .value.trim();
    filterNotesByKeyword(searchInput);

    const searchModal = bootstrap.Modal.getInstance(
      document.getElementById("searchModal"),
    );
    if (searchModal) {
      searchModal.hide();
    }
  });

function resetSearch() {
  const notesContainer = document.getElementById("notes-container");
  const emptyStateElement = document.querySelector("empty-state");

  if (emptyStateElement) {
    emptyStateElement.remove();
  }

  const allNotes = notesContainer.querySelectorAll("note-card");
  allNotes.forEach((note) => {
    note.style.display = "";
  });
}

document.getElementById("searchInput").addEventListener("input", function () {
  if (this.value.trim() === "") {
    resetSearch();
  } else {
    filterNotesByKeyword(this.value.trim());
  }
});

document
  .getElementById("mobileSearchInput")
  .addEventListener("input", function () {
    if (this.value.trim() === "") {
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

document
  .getElementById("archive-sidebar-btn-desktop")
  .addEventListener("click", async () => {
    const archivedNotes = await fetchArchivedNotes();
    renderArchivedNotes(archivedNotes);
  });

document
  .getElementById("archive-sidebar-btn-mobile")
  .addEventListener("click", async () => {
    const archivedNotes = await fetchArchivedNotes();
    renderArchivedNotes(archivedNotes);
  });

async function fetchArchivedNotes() {
  try {
    const response = await fetch(
      "https://notes-api.dicoding.dev/v2/notes/archived",
    );
    const data = await response.json();
    if (data.status === "success") {
      return data.data;
    } else {
      console.error("Gagal mengambil catatan yang diarsipkan:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

function renderArchivedNotes(archivedNotes) {
  const archivedNotesContainer = document.getElementById(
    "archived-notes-container",
  );
  const notesContainer = document.getElementById("notes-container");

  archivedNotesContainer.innerHTML = "";
  notesContainer.setAttribute("hidden", "");

  if (archivedNotes.length > 0) {
    const emptyStateElement = document.querySelector("empty-state");
    if (emptyStateElement) {
      emptyStateElement.remove();
    }

    archivedNotes.forEach((note) => {
      const noteCard = document.createElement("note-card");
      noteCard.setAttribute("id", note.id);
      noteCard.setAttribute("title", note.title);
      noteCard.setAttribute("body", note.body);
      noteCard.setAttribute("createdAt", note.createdAt);
      archivedNotesContainer.appendChild(noteCard);
    });
  } else {
    if (!document.querySelector("empty-state")) {
      const emptyStateElement = document.createElement("empty-state");
      emptyStateElement.setAttribute("message", "No archived notes found.");
      archivedNotesContainer.appendChild(emptyStateElement);
    }
  }
}
