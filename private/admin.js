//data
let data = [];
//paging
let pagedt = [];
const rowsamnt = 20
let page = 1;
let pagenumber = 1;
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
    if (section==='dashboard'){}
    else if (section === 'verifikasi') {
        render_verifikasitable(); 
    }
    else if (section ==='history'){}
    else if (section ==='issue'){}
    else if (section ==='pencairan'){}
}

//table pagination

function page_int() {
    const start = (page - 1 * rowsamnt)
    const end = start + rowsamnt
    const pagedt = data.slice(start, end)
}
function calcpage() {
    let pagetotal = Math.ceil(data.length / rowsamnt);
}

function page_control() {
    let pagebutton = 
    `
    <div>
        <form>
            <input list="pagenum" id='pagenum'></input>
            <datalist id=pagenum>
    `;
    for(let i=1;i<=pagenumber;i++){
        pagebutton+=`<option value="${i}">\n`    
    }
    pagebutton +=
    `            
            </datalist>
            <input type="submit">go</input>
        </form>
        
        <h3>page ${page} of ${pagetotal}</h3><br>
    </div>
    `;
    return pagebutton;
    
}
//table renderer
async function render_verifikasitable() {
    page = 1;
    const response = await fetch('../routers/verifikasi');
    data = await response.json();
    page_int();
    let table =
    `
    <table class="table striped-coloumns">
        <thead>
            <tr>
                <th scope="col">no</th>
                <th scope="col">nama lembaga</th>
                <th scope="col">status</th>
                <th scope="col">modify</th>
            </tr>
        </thead>
        <tbody id="tabel-pencairan">  
    `
    pagedt.forEach(item => {
        table +=
        `
            <tr>
                <td class="">${no}</td>
                <td class="">${id}</td>
                <td class="">${waktu}</td>
                <td class="">
                    <form action="">
                        <input type="checkbox" id="" value="1">
                        </input>
                    </form>
                </td>
            </tr>
        `
    });
    table+=
    `
        </tbody>
    </table>
    ` 
    document.getElementById('section-verifikasi').innerHTML = table + page_control();
}

function render_historytable() {

}

function render_issuetable() {

}

function render_pencairantable() {

}