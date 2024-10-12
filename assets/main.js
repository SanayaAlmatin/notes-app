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