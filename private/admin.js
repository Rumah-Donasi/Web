
document.addEventListener('DOMContentLoaded', function () {
    // Show dashboard by default
    showSection('verifikasi');

    // Add click listeners to sidebar links
    document.querySelectorAll('a[data-section]').forEach(link => {
        link.addEventListener('click', function () {
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
});

function showSection(section) {
    // List section id
    const sections = ['verifikasi', 'history', 'issue', 'pencairan'];
    sections.forEach(id => {
        const el = document.getElementById('section-' + id);
        if (el) el.style.display = 'none';
    });

    // Show the selected section
    const target = document.getElementById('section-' + section);
    if (target) target.style.display = '';
    //section call
    if (section === 'verifikasi') {
        render_verifikasitable();
    }
    else if (section === 'history') {
        render_historytable();
    }
    else if (section === 'issue') {
        render_issuetable();
    }
    else if (section === 'pencairan') {
    }
}

//table renderer
async function render_verifikasitable() {
    dataverify = []
    const response = await fetch('/admin/verifikasi');
    jsonData = await response.json();
    let table = ``;
    dataverify = jsonData.rows || jsonData; // Adjust based on actual API response format

    if (!Array.isArray(dataverify)) {
        console.error("Expected an array, but got:", datahistory);
        return;
    }
    dataverify.forEach(item => {
        table +=
            `
            <tr class="border-b hover:bg-orange-100 bg-gray-100">
                <td class="p-3 px-5">${item.id_lembaga}</td>
                <td class="p-3 px-5">${item.nama_lembaga}</td>
                <td class="p-3 px-5">
                    <select value="${item.verifikasi}" class="bg-transparent">
                        <option value="true" ${item.verifikasi === "true" ? "selected" : ""}>true</option>
                        <option value="false" ${item.verifikasi === "false" ? "selected" : ""}>false</option>
                    </select>
                </td>
                <td class="p-3 px-5 flex justify-start">
                    <button type="button" data-id="${item.id_lembaga}" onclick="update_verify(${item.id_lembaga})" class="text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline"><i class="bi bi-floppy-fill text-blue-500 hover:text-blue-700 text-[1.5rem]"></i></button>
                    <button type="button" onclick="delete_verify(${item.id_lembaga})" class="text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline"><i class="bi bi-trash-fill text-red-500 hover:text-red-700 text-[1.5rem]"></i></button>
                </td>
            </tr>
        `
    });
    table +=
        ``
    document.getElementById('tabel_verifikasi').innerHTML = table;
}

async function render_historytable() {
    datahistory = []
    const response = await fetch('/admin/history');
    jsonData = await response.json();
    let table = ``;

    datahistory = jsonData.rows || jsonData; // Adjust based on actual API response format

    if (!Array.isArray(datahistory)) {
        console.error("Expected an array, but got:", datahistory);
        return;
    }
    datahistory.forEach(item => {
        table +=
            `
            <tr class="border-b hover:bg-orange-100 bg-gray-100">
                <td class="p-3 px-5">${item.id_detail}</td>
                <td class="p-3 px-5">${item.id_user}</td>
                <td class="p-3 px-5">${item.id_issue}</td>
                <td class="p-3 px-5">${item.jumlah_bayar}</td>
                <td class="p-3 px-5">${item.tanggal}</td>
                <td class="p-3 px-5">${item.nama_donatur}</td>
                <td class="p-3 px-5 flex justify-start">
                    <button type="button" class="text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline"><i class="bi bi-trash-fill text-red-500 hover:text-red-700 text-[1.5rem]"></i></button>
                </td>
            </tr>
        `
    });
    table +=
        ``
    document.getElementById('tabel_history').innerHTML = table;
}


async function render_issuetable() {
    let dataissue = []
    const response = await fetch('/admin/issue');
    jsonData = await response.json();
    let table = ``;
    dataissue = jsonData.rows || jsonData; // Adjust based on actual API response format

    if (!Array.isArray(dataissue)) {
        console.error("Expected an array, but got:", datahistory);
        return;
    }
    dataissue.forEach(item => {
        table +=
            `
            <tr class="border-b hover:bg-orange-100 bg-gray-100">
                <td class="p-3 px-5">${item.id_issue}</td>
                <td class="p-3 px-5">${item.id_lembaga}</td>
                <td class="p-3 px-5"><input type="text" value="${item.deskripsi}" class="bg-transparent"></td>
                <td class="p-3 px-5"><input type="datetime-local" value="${item.deadline}" class="bg-transparent"></td>
                <td class="p-3 px-5">
                    <select class="bg-transparent w-20">
                        <option value="true" ${item.pilihan === "true" ? "selected" : ""}>true</option>
                        <option value="false" ${item.pilihan === "false" ? "selected" : ""}>false</option>
                    </select>
                </td>
                <td class="p-3 px-5"><input type="text" value="${item.alasan}" class="bg-transparent"></td>
                <td class="p-3 px-5 flex justify-start">
                    <button type="button" class="text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline"><i class="bi bi-floppy-fill text-blue-500 hover:text-blue-700 text-[1.5rem]"></i></button>
                    <button type="button" class="text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline"><i class="bi bi-trash-fill text-red-500 hover:text-red-700 text-[1.5rem]"></i></button>
                </td>
            </tr>
        `
    });
    table +=
        ``
    document.getElementById('tabel_issue').innerHTML = table;
}

function update_verify(id) {
    const button = document.querySelector(`button[data-id="${id}"]`);
    if (!button) {
        console.error(`Button with id ${id} not found.`);
        return;
    }

    const row = button.closest("tr");
    if (!row) {
        console.error(`No parent <tr> found for button with id ${id}.`);
        return;
    }

    const verify = row.querySelector("select").value.trim();

    fetch(`/admin/updateVerifikasi`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_lembaga: id, verifikasi: verify === "true" })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        console.log("Verification updated:", data);
    })
    .catch(error => console.error("Update error:", error));
}


function update_history(id) {

}

function update_issue(id) {

}

function delete_verify(id) {
    if (!confirm("are you sure you want to delete this?")) return;
    fetch(`/admin/deleteVerifikasi/${id}`, {
        method: "DELETE",
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            console.log("Deletion successful:", data);
            location.reload(); // Refresh the page after deletion
        })
        .catch(error => console.error("Deletion error:", error));
}
