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
const DataForm = {};
let EmailUsuario;
class Declaracion {
  static async open() {
    EmailUsuario = await ApiGoogleSheet.getEmail();
    let userAssignTask = await Usuario.getUsersAssignTask();
    let hasPermission = userAssignTask.some(
      (item) => item.email_empresa === EmailUsuario
    );

    await loadPage("./html/declarativa.html");
    this.resetDeclaracion()
    UI_Atributo.loadAtributo("manufactura");
    UI_Atributo.loadAtributo("pnc");
    UI_Atributo.loadAtributo("origen");
    UI_Atributo.loadAtributo("tipo_desvio");
    UI_Atributo.loadAtributo("documento");
    UI_Atributo.loadAtributo("tipo_contencion");
    UI_Atributo.loadAtributo("procedimiento");
    UI_Usuario.loadUsuario("datalista_registrado_por");
    UI_Usuario.loadResponsables("datalista_responsable");
    await UI.loadAreas();
    if (hasPermission) {
      this.showElements("responsable");
    } 
  }
  static resetDeclaracion() {
    this.hideElements("documento");
    this.hideElements("pieza");
    this.hideElements("pnc");
    this.hideElements("producto");
    this.hideElements('procedimiento')
    this.hideElements('origen');
    this.hideElements('trazabilidad');
    this.hideElements('desvio');
    this.hideElements('tipo_contencion')
    this.hideElements('contencion')
    this.hideElements("cliente", 0);
    this.hideElements("manufactura");
    this.hideElements('fecha_prog_at','1900-01-01');
    this.noRequiredlElement('trazabilidad')
    document.querySelector('.second-part').classList.add('d-none')
  }
  static showElements(elem,value = '') {
    const input = document.getElementById(elem);
    const node = input.parentElement;
    //input.removeAttribute('disabled')
    node.classList.remove("d-none");
    input.value = value;
  }
  static hideElements(elem, value = 'No aplica') {
    const input = document.getElementById(elem);
    const node = input.parentElement;
    node.classList.add("d-none");
    //input.setAttribute('disabled','')
    input.value = value;
  }
  static async tipoDesvio(event) {
    const tipoDesvio = event.target.value;
    switch (tipoDesvio) {
      case "Falta de pieza (prod)":
        this.settingPieza();
        break;
      case "Información técnica (prod)":
        this.settingDocumento();
        break;
      case "Producto no conforme":
        this.settingProducto();
        break;
      case "Procedimiento":
        this.settingProcedimiento();
        break;
      default:
        this.resetDeclaracion();
    }
  }
  static settingPieza() {
    this.resetDeclaracion();
    this.showElements("pieza");
    this.showElements("origen");
  }
  static settingDocumento() {
    this.resetDeclaracion();
    this.showElements("documento");
    this.showElements("origen");
  }
  static async setResponsable(event) {
    let documento = event.target.value;
    let responsable = await Atributo.getResposnableByDocumento(documento);
    document.getElementById('responsable').value = responsable

  }
  static settingProducto() {
    let pnc = document.getElementById("pnc");
    this.resetDeclaracion();
    this.showElements("pnc");
    this.showElements("origen");
    this.showElements("manufactura");
    pnc.addEventListener("change", (event) => {
      let value = event.target.value;
      if (value === "Otro") {
        this.showElements("producto");
      }
      else {
        this.hideElements('producto')
      }
    });
  }
  static settingProcedimiento() {
    this.resetDeclaracion();
    this.showElements('procedimiento');
    this.showElements("origen");
  }
  static async tipoOrigen(event) {
    const tipoOrigen = event.target.value;
    switch (tipoOrigen) {
      case "Reclamo de cliente":
        this.settingCliente();
        break;
      default:
        this.settingOrigenDefault();
    }
  }
  static async settingCliente() {
    this.showElements("cliente");
    this.requiredlElement("cliente");
    this.showElements("fecha_prog_at");
    this.showElements("trazabilidad");
    this.requiredlElement("trazabilidad");
    this.showElements("desvio");
    this.showElements("contencion");
    this.showElements("tipo_contencion",'Turno (solo clientes)');
    let responsable = await Atributo.getResposnableByReclCliente()
    this.showElements("responsable",responsable);
    document.querySelector('.btn-next').classList.remove('d-none')
  }
  static settingOrigenDefault() {
    this.showElements("trazabilidad");
    this.showElements("desvio");
    this.showElements("contencion");
    this.showElements("tipo_contencion");
    this.hideElements("cliente", 0);
    this.hideElements("fecha_prog_at",'1900-01-01');
    this.noRequiredlElement('trazabilidad');
    DataForm.id_ot = 0;
    DataForm.fecha_prog_at = "1900-01-01"//01/01/1900
    document.querySelector('.btn-next').classList.remove('d-none')
  }
  static requiredlElement(elem) {
    const input = document.getElementById(elem);
    const node = input.parentElement;
    const label = node.children[0];
    const span = label.children[0];
    span.innerText = " *";
    //input.setAttribute("required", "");
  }
  static noRequiredlElement(elem) {
    const input = document.getElementById(elem);
    const node = input.parentElement;
    const label = node.children[0];
    const span = label.children[0];
  }
  static next() {
    document.querySelector('.second-part').classList.remove('d-none')
    document.querySelector('.btn-next').classList.add('d-none')
  }
  /* Guardar */
  static async save(event) {
    event.preventDefault();
    try {
      let form = document.getElementById("formDeclarativa");
      if (UI.isValidForm(event, form)) {
        Modal.showLoaded();
        let inputs = form.querySelectorAll(".form-control, .form-select");
        inputs.forEach((item) => {
          DataForm[item.id] = item.value;
        });
        if(!DataForm.fecha_prog_at) {
          DataForm.fecha_prog_at = 'No aplica'
        }
        let response = await Registro.post(DataForm);
        if (response.status === 200) {
          form.reset()
          form.classList.remove('was-validated')
          this.resetDeclaracion()
          Modal.showSuccess(userResponsable.nombreCompleto);
        }
        else {
          Modal.showFailed(response)
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}
class UI {
  /* Inicialización de inputs genericos */
  static async loadAreas() {
    try {
      let areas = await Area.getAllData();
      let input = document.getElementById("area");
      input.innerHTML = '<option selected value="">Seleccione el área</option>';
      areas.map((item) => {
        let option = document.createElement("option");
        let textNode = document.createTextNode(item.nombre);
        option.appendChild(textNode);
        option.value = item.nombre;
        input.appendChild(option);
      });
    } catch (e) {
      console.log(e);
    }
  }
  static async loadSectoresByArea(area) {
    try {
      let sectores = await Sector.getSectoreByArea(area);
      let input = document.getElementById("sector");
      input.innerHTML = '<option selected value="">Seleccione el área</option>';
      sectores.map((item) => {
        let option = document.createElement("option");
        let textNode = document.createTextNode(item.nombre_sector);
        option.appendChild(textNode);
        option.value = item.nombre_sector;
        input.appendChild(option);
      });
    } catch (e) {
      console.log(e);
    }
  }
  static async handleLoadSectores(event) {
    const area = event.target.value;
    this.loadSectoresByArea(area);
  }
  static async openForm() {
    await loadPage("./html/form.html");
  }  
  static isValidForm(event, form) {
    if (form.checkValidity()) {
      event.preventDefault();
    }
    form.classList.add("was-validated");
    return form.checkValidity();
  }
  static loadInputsById(data, disabled) {
    for (let item in data) {
      const input = document.getElementById(item); //document.querySelector(`[name='${item}']`);
      if (input) {
        if (data[item]) {
          input.value = data[item];
        }
        if (disabled) {
          input.setAttribute("disabled", "");
        }
      }
    }
  }
}
class Modal {
  static show(data) {
    let modal = document.getElementById("myModalMessage");
    this.hide();
    var myModalShow = new bootstrap.Modal(modal);
    var titleModal = document.querySelector(`#myModalMessage .modal-title`);
    titleModal.innerText = data.title;
    var bodyModal = document.querySelector(`#myModalMessage .modal-body`);
    bodyModal.innerHTML = data.body;
    let buttons = modal.querySelectorAll(".hide-close");
    if (data.hasBtnClose) {
      buttons.forEach((item) => item.removeAttribute("hidden", ""));
    } else {
      buttons.forEach((item) => item.setAttribute("hidden", ""));
    }
    myModalShow.show();
  }
  static hide() {
    var modalElement = document.getElementById("myModalMessage");
    var modal = bootstrap.Modal.getInstance(modalElement); // Obtener la instancia del modal
    if (modal) {
      modal.hide(); // Ocultar el modal si existe una instancia
    }
  }
  static showLoaded() {
    const load = {
      title: "Loaded",
      body: "<p>Loaded information...</p>",
    };
    this.show(load);
  }
  static showSuccess(responsable) {
    const success = {
      title: "✔️ Requerimiento completado",
      body: `<p>Los datos han sido guardados <br> ✉️ Se ha notificado a: ${responsable}</p>`,
      hasBtnClose: true,
    };
    this.show(success);
  }
  static showFailed(status) {
    const success = {
      title: "¡🚫 Ha ocurrido un problema!",
      body: `
      <p>No se ha obtenido la respuesta esperada<br>
        <code>   
        Código de error [status]: ${status}<br>
        </code>
      </p>`,
      hasBtnClose: true,
    };
    this.show(success);
  }
  static show404() {
    const message_404 = {
      title: "¡🚫 No encontrado!",
      body: `
      <p>
        El elemento ingresado no ha sido encontrado, por favor verifique la información
      </p>`,
      hasBtnClose: true,
    };
    this.show(message_404);
  }
}
