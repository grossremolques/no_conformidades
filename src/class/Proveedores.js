const SS_Proveedores = "1aKuw8yVY8Pl5_D1xJstj3R3vLdIIUG9c15WnQ78re5A";
const SheetProveedores = "BASE!A1:ZZZ";
class Proveedor {
  static async getProveedores() {
    try {
      let response = await ApiGoogleSheet.getResponse(
        SheetProveedores,
        SS_Proveedores
      );
      response = response.result.values;
      let proveedores = arrayToObject(response);
      return proveedores;
    } catch (e) {
      console.log(e);
    }
  }
  static async getProveedorByCodigo(cod) {
    let response = false;
    try {
      let proveedores = await this.getProveedores();
      if (proveedores.some((item) => item.id == cod)) {
        response = proveedores.find((item) => item.id == cod);
      }
      return response;
    } catch (e) {
      console.log(e);
    }
  }
}
