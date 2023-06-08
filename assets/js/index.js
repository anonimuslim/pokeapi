$.ajax({
  url: "https://pokeapi.co/api/v2/pokemon",
  type: "GET", // tidak wajib karena default=GET
  success: function (response) {
    let text = "";
    let promises = []; // Array untuk menyimpan promise dari setiap request detail

    $.each(response.results, function (key, value) {
      // bikin $.ajax lagi buat ngambil data dari https://endpoint/{id} karena butuh data height dan weight
      let promise = $.ajax({
        url: value.url,
        success: function(data){
          text += `
              <tr>
                  <td>${key + 1}</td>
                  <td class="text-capitalize">${value.name}</td>
                  <td>${data.height}</td>
                  <td>${data.weight}</td>
                  <td>
                      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="detail('${value.url}')">Detail</button>
                  </td>
              </tr>
          `;
        }
      });
      promises.push(promise);
    });

    // Tunggu semua promise selesai sebelum mengatur isi tbodyPoke
    $.when.apply($,promises).then(function(){
      $("#tbodyPoke").html(text);

      // Inisialisasi DataTables setelah semua data berhasil diambil
      $("#pokeTable").DataTable({
        paging: true,
        scrollY: 400,
        searching: true,
        ordering: true,
      });
    });
  },
  error: function (error) {
    setTimeout(function () {
      alert(
        "Maaf, terjadi kesalahan dalam memuat data. Silakan coba lagi nanti."
      );
      console.log("Terjadi kesalahan:", error);
    }, 0); // dikasih setTimeout 0 agar alert tidak delay
  },
});

function detail(value) {
  // console.log(val);
  $.ajax({
    url: value,
    success: function (response) {
      let statsTitle = ["HP","Attack","Defense","Special Attack","Special Defense","Speed"];
      let details = "";
      let ability = "";

      details = `
      <div id="modalBody" class="row me-2 ms-2 d-flex align-items-center">
          <p id="pokeName" class="text-center badge bg-warning">${response.forms[0].name}</p>
          <div class="col-6 text-center">
            <img src='${response.sprites.other.dream_world.front_default}' title='Gambar Pokemon ${response.forms[0].name}' alt='Gambar Pokemon ${response.forms[0].name}'>
            <p><span class="badge bg-success mt-4 text-center">Kenalin, dia ${response.forms[0].name}, comel kan? <img src="/assets/images/laughing.png" width=17/></span></p>
          </div>

          <div class="col-6">
            <div class="row border rounded-4">
              <div id="statsTitle" class="col mt-4">
              ${(() => {
                let titles = '';
                for (let index = 0; index < statsTitle.length; index++) {
                  titles += `<p>${statsTitle[index]}</p>`;
                }
                return titles;
              })()}
              </div>
              <div class="col mt-4">
                <div class="progress" role="progressbar" aria-label="${response.stats[0].stat.name}" aria-valuenow="${response.stats[0].base_stat}" aria-valuemin="0" aria-valuemax="100">
                  <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: ${response.stats[0].base_stat}%">${response.stats[0].base_stat}%</div>
                </div>
                <br>
                <div class="progress" role="progressbar" aria-label="${response.stats[1].stat.name}" aria-valuenow="${response.stats[1].base_stat}" aria-valuemin="0" aria-valuemax="100">
                  <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" style="width: ${response.stats[1].base_stat}%">${response.stats[1].base_stat}</div>
                </div>
                <br>
                <div class="progress" role="progressbar" aria-label="${response.stats[2].stat.name}" aria-valuenow="${response.stats[2].base_stat}" aria-valuemin="0" aria-valuemax="100">
                  <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" style="width: ${response.stats[2].base_stat}%">${response.stats[2].base_stat}</div>
                </div>
                <br>
                <div class="progress" role="progressbar" aria-label="${response.stats[3].stat.name}" aria-valuenow="${response.stats[3].base_stat}" aria-valuemin="0" aria-valuemax="100">
                  <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" style="width: ${response.stats[3].base_stat}%">${response.stats[3].base_stat}</div>
                </div>
                <br>
                <div class="progress" role="progressbar" aria-label="${response.stats[4].stat.name}" aria-valuenow="${response.stats[4].base_stat}" aria-valuemin="0" aria-valuemax="100">
                  <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" style="width: ${response.stats[4].base_stat}%">${response.stats[4].base_stat}</div>
                </div>
                <br>
                <div class="progress" role="progressbar" aria-label="${response.stats[5].stat.name}" aria-valuenow="${response.stats[4].base_stat}" aria-valuemin="0" aria-valuemax="100">
                  <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" style="width: ${response.stats[5].base_stat}%">${response.stats[5].base_stat}</div>
                </div>
              </div>
            </div>
            <hr>
        <p>Hello world!</p>
          </div>
        </div>
      `;
      
      $("#bodyPoke").html(details);

      // $.each(response.abilities, function (key, value) {
      //   ability += `<p>${value.ability.name}</p>`;
      // });
      // $("#bodyPoke").append("<br>");
      // $("#bodyPoke").append("<hr>");
      // $("#bodyPoke").append(response.forms[0].name);
      // $("#bodyPoke").append("<hr>");
      // $("#bodyPoke").append(`<img src='${response.sprites.other.home.front_default}' title='Gambar Pokemon ${response.forms.name}' alt='Gambar Pokemon ${response.forms.name}'>`);
    },
  });
}

/* Untuk looping progress bar, tapi masih perlu diperbaiki
${(() => {
  let progressColor = ["bg-info","bg-danger","bg-warning","bg-success","bg-dark"];
  for (let index = 0; index < progressColor.length; index++) {
    titles += `<p>${stats[index]}</p>`;
  }
  return titles;
})()}

Kali ini untuk statsTitlenya: tidak dipakai karena seperti ada margin top yang menyebabkan tidak sejajar dengan progress bar
<p>${statsTitle.map(title => `<p>${title}</p>`).join('')}</p>
*/