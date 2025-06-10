//data
let data = [];



//

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
    if (section === 'dashboard') { }
    else if (section === 'verifikasi') {
        render_verifikasitable();
    }
    else if (section === 'history') {
        render_historytable();
    }
    else if (section === 'issue') {
        render_issuetable();
    }
    else if (section === 'pencairan') {
        render_pencairantable();
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
                <td class="p-3 px-5"><input type="text" value="${item.id_lembaga}" class="bg-transparent"></td>
                <td class="p-3 px-5"><input type="text" value="${item.nama_lembaga}" class="bg-transparent"></td>
                <td class="p-3 px-5">
                    <select value="${item.verifikasi}" class="bg-transparent">
                        <option value="true">true</option>
                        <option value="false">false</option>
                    </select>
                </td>
                <td class="p-3 px-5 flex justify-end">
                    <button type="button" class="mr-3 text-sm bg-red-500 hover:bg-blue-700 text-black py-1 px-2 rounded focus:outline-none focus:shadow-outline">Save</button>
                </td>
            </tr>
        `
    });
    table +=
        ``
    document.getElementById('tabel_verifikasi').innerHTML = table;
}

function render_historytable() {

}

function render_issuetable() {

}

function render_pencairantable() {

}