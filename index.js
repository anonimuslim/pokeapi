$.ajax({
    url: "https://pokeapi.co/api/v2/pokemon",
    type: "GET", // tidak wajib karena default=GET
    success: function(response){
        let text = "";
        $.each(response.results, function(key,value){
            text += `
            <tr>
                <td>${key+1}</td>
                <td class="text-capitalize">${value.name}</td>
                <td>${value.url}</td>
                <td>
                    <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                    onclick="detail('${value.url}')"
                    >
                    Detail
                    </button>
                </td>
            </tr>
            `
        });
        $("#tbodySW").html(text);
    },
    error: function(error){
        setTimeout(function(){
            alert("Maaf, terjadi kesalahan dalam memuat data. Silakan coba lagi nanti.");
            console.log("Terjadi kesalahan:", error);
        }, 0); // dikasih setTimeout 0 agar alert tidak delay
    }
})

function detail(value) {
    // console.log(val);
    $.ajax({
      url: value,
      success: function (response) { 
        $.each(response.abilities, function(key,value){
            $("#bodySW").html(value.ability.name); 
        })
      },
    });
  }
  