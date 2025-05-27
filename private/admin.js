function showSection(section) {
    // Hide all sections
    document.getElementById('section-verifikasi').style.display = 'none';
    document.getElementById('section-history').style.display = 'none';
    document.getElementById('section-issue').style.display = 'none';
    document.getElementById('section-pencairan').style.display = 'none';

    // Show the selected section
    document.getElementById('section-' + section).style.display = 'block';

    // Optionally, fetch data when a section is shown
    if (section === 'verifikasi') {
        renderVerifikasiTable(); // Call your function to fetch and render lembaga data
    }
    // Add similar calls for users or issue if needed
}