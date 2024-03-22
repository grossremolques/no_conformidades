const SS_Empleados = "16PFj6aJMaIdoj-D0NLecEIdiOONkZLDaPnyU0muxBlw"; //https://docs.google.com/spreadsheets/d/16PFj6aJMaIdoj-D0NLecEIdiOONkZLDaPnyU0muxBlw/edit#gid=152798628
const SheetUsuarios = "Registro!A1:ZZZ";
class Usuario {
  static async getActiveUsers() {
    try {
      let response = await ApiGoogleSheet.getResponse(
        SheetUsuarios,
        SS_Empleados
      );
      response = response.result.values;
      response = arrayToObject(response);
      let usersActive = response.filter((item) => item.activo === "Sí");
      usersActive = usersActive.map((item) => {
        item.nombreCompleto = `${item.nombre} ${item.apellido}`;
        return item;
      });
      return usersActive;
    } catch (e) {
      console.log(e);
    }
  }
  static async getUsersAssignTask() {
    try {
        let users = await this.getActiveUsers();
        let  userAssignTask = users.filter(item => item.categoria.includes('Adm') || item.categoria.includes('Téc') || item.categoria.includes('Gerente'))
        return userAssignTask
    }catch (e) {
      console.log(e);
    }
  }
  static async getUserByAlias(alias) {
    try {
      let usuarios = await this.getActiveUsers();
      let user = usuarios.find(item => item.alias === alias);
      return user
    } catch (e) {
      console.log(e)
    }
  }
}
class UI_Usuario {
  static async loadUsuario(idInput) {
    let input = document.getElementById(idInput);
    input.innerHTML = '<option value="" selected></option>';
    let listUsuarios = await Usuario.getActiveUsers();
    listUsuarios.map((item) => {
      let option = document.createElement("option");
      let textNode = document.createTextNode(item.nombreCompleto);
      option.appendChild(textNode);
      option.value = item.alias;
      input.appendChild(option);
    });
  }
  static async loadResponsables(idInput) {
    let input = document.getElementById(idInput);
    input.innerHTML = '<option value="" selected></option>';
    let listResponsables = await Usuario.getActiveUsers();
    listResponsables = listResponsables.filter(
      (item) => item.email_empresa && item.tipo_personal === "INTERNO"
    );
    listResponsables.map((item) => {
      let option = document.createElement("option");
      let textNode = document.createTextNode(
        `${item.nombreCompleto} - Puesto: ${item.puesto}`
      );
      option.appendChild(textNode);
      option.value = item.alias;
      input.appendChild(option);
    });
  }
}
