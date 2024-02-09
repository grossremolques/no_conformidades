async function loadPage(srcPage, body = interface) {
  let response;
  try {
    response = await fetch(srcPage);
    response = await response.text();
    body.innerHTML = response;
  } catch (e) {
    console.log(e);
  }
}
function loadHome() {
  document.getElementById("instructionAccess").removeAttribute("hidden");
}
class UI {
  static async openForm() {
    await loadPage("./html/form.html");
  }
  static async openDeclaracion() {
    await loadPage("./html/declarativa.html");
    UI_Atributo.loadAtributo('manufactura')
    UI_Atributo.loadAtributo('pnc')
    UI_Atributo.loadAtributo('origen')
    UI_Atributo.loadAtributo('tipo_desvio')
    UI_Atributo.loadAtributo('documento')
    UI_Usuario.loadUsuario('datalista_registrado_por')
  }
  static loadForPieza() {
    let pieza = document.getElementById('pieza');
    let node = pieza.parentElement;
    node.classList.remove('hidden');

    let documento = document.getElementById('documento');
    documento.value = 'No aplica'
  }
}