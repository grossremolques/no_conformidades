const SheetAtributos = "Otros Atributos!A1:ZZZ";
let Atributos;
class Atributo {
  static async getAtributos() {
    try {
      let response = await ApiGoogleSheet.getResponse(SheetAtributos);
      if (response.status === 200) {
        let data = arrayToObject(response.result.values);
        Atributos = data;
        return Atributos;
      }
    } catch (e) {
      console.error("Error: ", e);
    }
  }
  static async getResposnableByReclCliente() {
    try {
      let atributos = await Atributo.getAtributos();
      let reclamoCliente = atributos.find(item => item.origen === 'Reclamo de cliente');
      return reclamoCliente.resposable_x_origen
    } catch (e) {
      console.error("Error: ", e);
    }
  }
  static async getResposnableByDocumento(documento) {
    try {
      let atributos = await Atributo.getAtributos();
      let reclamoCliente = atributos.find(item => item.documento === documento);
      return reclamoCliente.resposable_x_documento
    } catch (e) {
      console.error("Error: ", e);
    }
  }
}
class UI_Atributo {
  static loadAtributo(atributo, idInput) {
    let input = idInput
      ? document.getElementById(idInput)
      : document.getElementById(atributo);
    try {
      let data = Atributos.map((item) => item[atributo]);
      input.innerHTML = `
      <option selected value="">Ninguno</option>
      <option value="No aplica" disabled>No aplica</option>
      `;
      data.map((item) => {
        if (item) {
          if (item != "No aplica") {
            let option = document.createElement("option");
            let textNode = document.createTextNode(item);
            option.appendChild(textNode);
            option.value = item;
            input.appendChild(option);
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}
