document.addEventListener('DOMContentLoaded', function () {
    showSection('verifikasi');

    document.querySelectorAll('a[data-section]').forEach(link => {
        link.addEventListener('click', function () {
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
});

function showSection(section) {
    const sections = ['verifikasi', 'history', 'issue', 'pencairan'];
    sections.forEach(id => {
        const el = document.getElementById('section-' + id);
        if (el) el.style.display = 'none';
    });

    const target = document.getElementById('section-' + section);
    if (target) target.style.display = '';

    if (section === 'verifikasi') {
        render_verifikasitable();
    } else if (section === 'history') {
        render_historytable();
    } else if (section === 'issue') {
        render_issuetable();
    }
}

async function render_verifikasitable() {
    let dataverify = [];
    const response = await fetch('/admin/verifikasi');
    const jsonData = await response.json();
    let table = ``;
    dataverify = jsonData.rows || jsonData;

    if (!Array.isArray(dataverify)) {
        console.error("Expected an array, but got:", dataverify);
        return;
    }

    dataverify.forEach(item => {
        table += `
            <tr class="border-b hover:bg-orange-100 bg-gray-100">
                <td class="p-3 px-5">${item.id_user}</td>
                <td class="p-3 px-5">${item.nama_user}</td>
                <td class="p-3 px-5">
                    <select class="bg-transparent">
                        <option value="true" ${item.verifikasi === true ? "selected" : ""}>true</option>
                        <option value="false" ${item.verifikasi === false ? "selected" : ""}>false</option>
                    </select>
                </td>
                <td class="p-3 px-5 flex justify-start">
                    <button type="button" data-id="${item.id_user}" onclick="update_verify(${item.id_user})" class="text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                        <i class="bi bi-floppy-fill text-blue-500 hover:text-blue-700 text-[1.5rem]"></i>
                    </button>
                    <button type="button" onclick="delete_verify(${item.id_user})" class="text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                        <i class="bi bi-trash-fill text-red-500 hover:text-red-700 text-[1.5rem]"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById('tabel_verifikasi').innerHTML = table;
}

async function render_historytable() {
    let datahistory = [];
    const response = await fetch('/admin/history');
    const jsonData = await response.json();
    let table = ``;
    datahistory = jsonData.rows || jsonData;

    if (!Array.isArray(datahistory)) {
        console.error("Expected an array, but got:", datahistory);
        return;
    }

    datahistory.forEach(item => {
        table += `
            <tr class="border-b hover:bg-orange-100 bg-gray-100">
                <td class="p-3 px-5">${item.id_detail}</td>
                <td class="p-3 px-5">${item.id_user}</td>
                <td class="p-3 px-5">${item.id_issue}</td>
                <td class="p-3 px-5">${item.jumlah_bayar}</td>
                <td class="p-3 px-5">${item.tanggal}</td>
                <td class="p-3 px-5">${item.nama_donatur}</td>
                <td class="p-3 px-5 flex justify-start">
                    <button type="button" onclick="delete_history(${item.id_detail})" class="text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                        <i class="bi bi-trash-fill text-red-500 hover:text-red-700 text-[1.5rem]"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById('tabel_history').innerHTML = table;
}

async function render_issuetable() {
    
    let dataissue = [];
    const response = await fetch('/admin/issue');
    const jsonData = await response.json();
    let table = ``;
    dataissue = jsonData.rows || jsonData;

    if (!Array.isArray(dataissue)) {
        console.error("Expected an array, but got:", dataissue);
        return;
    }

    dataissue.forEach(item => {
        table += `
            <tr class="border-b hover:bg-orange-100 bg-gray-100" id="row-${item.id_issue}">
                <td class="p-3 px-5">${item.id_issue}</td>
                <td class="p-3 px-5">${item.id_pembuat}</td>
                <td class="p-3 px-5">${item.deskripsi}</td>
                <td class="p-3 px-5">${item.deadline}</td>
                <td class="p-3 px-5">
                    <select class="bg-transparent w-20 ispilihan-select">
                        <option value="false" ${item.ispilihan === "false" ? "selected" : ""}>false</option>
                        <option value="true" ${item.ispilihan === "true" ? "selected" : ""}>true</option>
                    </select>
                </td>
                <td class="p-3 px-5 flex justify-start">
                    <button type="button" data-id="${item.id_issue}" onclick="update_issue(${item.id_issue})" class="text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                        <i class="bi bi-floppy-fill text-blue-500 hover:text-blue-700 text-[1.5rem]"></i>
                    </button>
                    <button type="button" onclick="delete_issue(${item.id_issue})" class="text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                        <i class="bi bi-trash-fill text-red-500 hover:text-red-700 text-[1.5rem]"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById('tabel_issue').innerHTML = table;
}

async function update_verify(id) {
    const button = document.querySelector(`button[data-id="${id}"]`);
    const row = button.closest("tr");
    const verify = row.querySelector("select").value.trim();

    await fetch(`/admin/updateVerifikasi`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user: id, verifikasi: verify === "true" })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            console.log("Verification updated:", data);
        })
        .catch(error => console.error("Update error:", error));
}

async function update_issue(id) {
    const row = document.getElementById(`row-${id}`);
    const selectElement = row.querySelector("select.ispilihan-select");

    const ispilihan = selectElement.value;

    await fetch("/admin/updateIssue", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_issue: id, ispilihan}),
    })
    .then((res) => res.json())
    .then((data) => {
        alert(data.message || "Update success");
    })
    .catch((err) => {
        console.error("Update failed:", err);
        alert("Update failed");
    });
}

async function delete_verify(id) {
    if (!confirm("Are you sure you want to delete this?")) return;
    await fetch(`/admin/deleteVerifikasi/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            console.log("Deletion successful:", data);
            location.reload();
        })
        .catch(error => console.error("Deletion error:", error));
}

async function delete_history(id) {
    if (!confirm("Are you sure you want to delete this?")) return;
    await fetch(`/admin/deleteHistory/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            console.log("Deletion successful:", data);
            location.reload();
        })
        .catch(error => console.error("Deletion error:", error));
}

async function delete_issue(id) {
    if (!confirm("Are you sure you want to delete this?")) return;
    await fetch(`/admin/deleteIssue/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            console.log("Deletion successful:", data);
            location.reload();
        })
        .catch(error => console.error("Deletion error:", error));
}
