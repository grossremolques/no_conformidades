class Gestion {
  static async open() {
    await loadPage("./html/gestion.html");
    UI_Atributo.loadAtributo("manufactura");
    UI_Atributo.loadAtributo("pnc");
    UI_Atributo.loadAtributo("origen");
    UI_Atributo.loadAtributo("tipo_desvio");
    UI_Atributo.loadAtributo("documento");
    UI_Atributo.loadAtributo("tipo_contencion");
    UI_Atributo.loadAtributo("procedimiento");
    UI_Usuario.loadUsuario("datalista_registrado_por");
    UI_Usuario.loadResponsables("datalista_responsable");
    UI_Atributo.loadAtributo('si_no','anular');
    UI_Atributo.loadAtributo('si_no','requiere_acc')
    await UI.loadAreas();
    Declaracion.showElements("responsable")
  }
  static async loadDataById(event) {
    let form = document.querySelector('form');
    const id = event.target.value;
    form.reset()
    let registros = await Registro.getRegistros();
    if (registros.status === 200) {
      let registro = registros.result.values.some((item) => item.id === id);
      if (registro) {
        registro = registros.result.values.find((item) => item.id === id);
        registro.fecha_prog_at = FormatsDate.AmericanFormat(registro.fecha_prog_at)
        this.tipoDesvio(registro.tipo_desvio);
        await UI.loadSectoresByArea(registro.area)
        UI.loadInputsById(registro);
        
        await this.tipoOrigen(registro.origen)
        this.settingProveedor(registro.tipo_desvio)
        
      } else {
        Modal.show404();
      }
    }
  }
  /* Configuraciones por tipo de desvio y origen */
  static async tipoDesvio(tipoDesvio) {
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
    }
  }
  static settingPieza() {
    this.disabledElement("documento");
    this.disabledElement("procedimiento");
    this.abledElement("pieza");
    this.disabledElement("pnc");
    this.disabledElement("producto");
    this.disabledElement("manufactura");
    this.disabledElement('proveedor',true);
    document.getElementById('nombre-proveedor').value = 'No aplica';
  }
  static settingDocumento() {
    this.abledElement("documento");
    this.disabledElement("procedimiento");
    this.disabledElement("pieza");
    this.disabledElement("pnc");
    this.disabledElement("producto");
    this.disabledElement("manufactura");
  }
  static settingProducto() {
    this.disabledElement("documento");
    this.disabledElement("procedimiento");
    this.disabledElement("pieza");
    this.abledElement("pnc");
    this.abledElement("producto");
    this.abledElement("manufactura");
  }
  static settingProcedimiento() {
    this.disabledElement("documento");
    this.disabledElement("procedimiento");
    this.abledElement("pieza");
    this.disabledElement("pnc");
    this.disabledElement("producto");
    this.disabledElement("manufactura");
  }
  static settingProveedor() {
    
  }
  static async tipoOrigen(tipoOrigen) {
    switch (tipoOrigen) {
      case "Reclamo de cliente":
        await this.settingCliente();
        break;
      default:
        this.settingOrigenDefault();
    }
  }
  static async settingCliente() {
    let cliente = document.getElementById('cliente');
    try {
        let response = await Cliente.getClienteByCodigo(cliente.value);
        document.getElementById('nombrecliente').value = response.razon_social;
        this.abledElement('cliente')
    } catch(e) {
        console.log(e)
    }
  }
  static async loadProveedor() {
    let proveedor = document.getElementById('proveedor');
    try {
      let response = await Proveedor.getProveedorByCodigo(proveedor.value);
      document.getElementById('nombre-proveedor').value = response.razon_social;
  } catch(e) {
      console.log(e)
  }
  }
  static settingOrigenDefault() {
    this.disabledElement('cliente',true)
    document.getElementById('nombrecliente').value = 'No aplica';
    this.disabledElement('fecha_prog_at')

  }
  static abledElement(elem) {
    const input = document.getElementById(elem);
    input.removeAttribute("disabled");
  }
  static disabledElement(elem, isNum) {
    const input = document.getElementById(elem);
    input.setAttribute("disabled", "");
    if (isNum) {
      input.value = 0;
    } else {
      input.value = "No aplica";
    }
  }
  static async settingProveedor(tipoDesvio,codProv){
    const hasProveedor = tipoDesvio == 'Producto no conforme';
    if (!hasProveedor){
      this.disabledElement('proveedor',true)
      this.disabledElement('nombre-proveedor')
    }
    else {
      this.abledElement('proveedor')
      this.abledElement('nombre-proveedor')
      let proveedorData = await Proveedor.getProveedorByCodigo(codProv);
    }
  }
}
