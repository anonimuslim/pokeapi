/* 
Author: Anonimuslim
Date: Wed Jun 7 15:40:08 2023 +0700
*/
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
                  <td>${key + 1}.</td>
                  <td class="text-capitalize">${value.name}</td>
                  <td>${data.height}</td>
                  <td>${data.weight}</td>
                  <td>
                      <button type="button" class="btn btn-primary hvr-buzz" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="detail('${value.url}')">Detail</button>
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
      /*
      HP: danger -> merah
      Attact: warning -> kuning
      Defense: info -> biru muda
      Special Attack: warning-emphasis -> kuning muda
      Special Defence: info-emphasis -> biru muda
      Speed: success -> hijau
      */
      let progressColor = ["bg-danger","bg-warning","bg-info","bg-warning","bg-info","bg-success"];
      let details1 = "";
      let details2 = "";

      details1 = `
      <div id="modalBody-1" class="row me-2 ms-2 d-flex align-items-center">
          <p id="pokeName" class="text-center badge bg-warning hvr-wobble-bottom">${response.forms[0].name}</p>
          <div class="col-6 text-center">
            <img src='${response.sprites.other.dream_world.front_default}' title='Gambar Pokemon ${response.forms[0].name}' alt='Gambar Pokemon ${response.forms[0].name}' class="hvr-grow">
            <p><span class="badge bg-success mt-4 text-center hvr-wobble-horizontal">Kenalin, dia <span class="text-capitalize">${response.forms[0].name}</span>, comel kan? <img src="assets/images/laughing.png" width=17/></span></p>
          </div>

          <div class="col-6">
            <p id="modalBody-1-title">Stats Info</p>
            <div class="row border rounded-4">
              <div class="col mt-4">
                ${(() => {
                  let titles = '';
                  for (let index = 0; index < statsTitle.length; index++) {
                    titles += `<p><span class="badge ${progressColor[index]} hvr-bounce-in">${statsTitle[index]}</span></p>`;
                  }
                  return titles;
                })()}
              </div>
              <div class="col mt-4">
                ${(() => {
                  let progressBar = '';
                  for (let index = 0; index < progressColor.length; index++) {
                    progressBar += `
                      <div class="progress" role="progressbar" aria-label="${response.stats[index].stat.name}" aria-valuenow="${response.stats[index].base_stat}" aria-valuemin="0" aria-valuemax="100">
                      <div class="progress-bar progress-bar-striped progress-bar-animated ${progressColor[index]} hvr-pulse-grow" style="width: ${response.stats[index].base_stat}%">${response.stats[index].base_stat}%</div>
                      </div>
                      <br>
                    `;
                  }
                  return progressBar;
                })()}
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Tampung hasil fetch data type dulu, tujuannya biar elemen html ga ikut ke loop
      const typeNames = response.types.map((pokeType) => pokeType.type.name.charAt(0).toUpperCase() + pokeType.type.name.slice(1));
      
      // masukan data yang udah ditampung ke elemen html details2
      response.types.forEach((pokeType) => {
        details2 = `
          <hr class="lineCustom">
          <div id="modalBody-2" class="row justify-content-md-center text-center">
            <p id="modalBody-2-title">General Info</p>
            <br>
            <div class="col-lg-2">
              <p class="bedge bg-danger rounded"><b>Poke Types</b></p>
              <p class="bedge bg-light text-warning rounded"><b>EXP</b></p>
              <p class="bedge text-light bg-primary rounded"><b>Ability</b></p>
              <p class="bedge bg-light text-success rounded"><b>Species</b></p>
            </div>
            <div class="col-lg-4">
            <p class="bedge bg-light text-danger fw-bold rounded">${typeNames.join(', ')}</p>
            <p class="bedge text-light bg-warning fw-bold rounded">${response.base_experience}</p>
            <p class="bedge bg-light text-primary rounded fw-bold text-capitalize">${response.abilities.map((ability) => `${ability.ability.name}`).join(', ')}</p>
            <p class="bedge bg-success rounded fw-bold text-capitalize">${response.species.name}</p>
            </div>
          </div>
        `;
      });
      
      $("#bodyPoke").html(details1);
      $("#bodyPoke").append(details2);

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

// Escape Modal
$(document).on('keydown', function (event) {
  if (event.key === "Escape") {
    // $('.modal').modal('hide');
    $('#close').trigger('click');
  }
});

/* Untuk looping progress bar, tapi masih perlu diperbaiki
${(() => {
  for (let index = 0; index < progressColor.length; index++) {
    titles += `<p>${stats[index]}</p>`;
  }
  return titles;
})()}

Kali ini untuk statsTitlenya: tidak dipakai karena seperti ada margin top yang menyebabkan tidak sejajar dengan progress bar
<p>${statsTitle.map(title => `<p>${title}</p>`).join('')}</p>


Dibuang sayang:
<div class="progress" role="progressbar" aria-label="${response.stats[0].stat.name}" aria-valuenow="${response.stats[0].base_stat}" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar progress-bar-striped progress-bar-animated hvr-pulse-grow" style="width: ${response.stats[0].base_stat}%">${response.stats[0].base_stat}%</div>
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
*/
