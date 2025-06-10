//data
let data = [];

document.addEventListener('DOMContentLoaded', function () {
    // Show dashboard by default
    showSection('dashboard');

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
    const sections = ['dashboard', 'verifikasi', 'history', 'issue', 'pencairan'];
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

    const response = await fetch('/admin/verifikasi');
    data = await response.json();
    let table = ``;
    data.forEach(item => {
        table +=
        `
            <tr class="border-b hover:bg-orange-100 bg-gray-100">
                <td class="p-3 px-5"><input value="${item.id_lembaga}" class="bg-transparent"></td>
                <td class="p-3 px-5"><input value="${item.nama_lembaga}" class="bg-transparent"></td>
                <td class="p-3 px-5">
                    <select value="${item.verifikasi}" class="bg-transparent">
                        <option value="true">true</option>
                        <option value="false">false</option>
                    </select>
                </td>
                <td class="p-3 px-5 flex justify-start">
                    
                    <button type="button" class="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Delete</button>
                    <button type="button" class="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Save</button>
                </td>
            </tr>
        `
    });
    table +=
        ``
    document.getElementById('tabel_verifikasi').innerHTML = table;
}

async function render_historytable() {
    const response = await fetch('/admin/history');
    data = await response.json();
    let table = ``;
    data.forEach(item => {
        table +=
        `
            <tr class="border-b hover:bg-orange-100 bg-gray-100">
                <td class="p-3 px-5"><input value="${item.id_detail}" class="bg-transparent"></td>
                <td class="p-3 px-5"><input value="${item.id_user}" class="bg-transparent"></td>
                <td class="p-3 px-5"><input value="${item.id_issue}" class="bg-transparent"></td>
                <td class="p-3 px-5"><input value="${item.jumlah_bayar}" class="bg-transparent"></td>
                <td class="p-3 px-5"><input value="${item.tanggal}" class="bg-transparent"></td>
                <td class="p-3 px-5"><input value="${item.nama_donatur}" class="bg-transparent"></td>
                <td class="p-3 px-5 flex justify-start">
                    <button type="button" class="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Delete</button>
                </td>
            </tr>
        `
    });
    table +=
        ``
    document.getElementById('tabel_history').innerHTML = table;
}


async function render_issuetable() {
const response = await fetch('/admin/issue');
    data = await response.json();
    let table = ``;
    data.forEach(item => {
        table +=
        `
            <tr class="border-b hover:bg-orange-100 bg-gray-100">
                <td class="p-3 px-5"><input value="${item.id_issue}" class="bg-transparent"></td>
                <td class="p-3 px-5"><input value="${item.id_lembaga}" class="bg-transparent"></td>
                <td class="p-3 px-5"><input type="text" value="${item.deskripsi}" class="bg-transparent"></td>
                <td class="p-3 px-5"><input type="datetime-local" value="${item.deadline}" class="bg-transparent"></td>
                <td class="p-3 px-5">
                    <select value="${item.pilihan}" class="bg-transparent">
                        <option value="true">true</option>
                        <option value="false">false</option>
                    </select>
                </td>
                <td class="p-3 px-5"><input type="text" value="${item.alasan}" class="bg-transparent"></td>
                <td class="p-3 px-5 flex justify-start">
                    <button type="button" class="mr-3 text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Save</button>
                    <button type="button" class="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Delete</button>
                </td>
            </tr>
        `
    });
    table +=
        ``
    document.getElementById('tabel_issue').innerHTML = table;
}

