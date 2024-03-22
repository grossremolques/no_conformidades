const SheetRegistro = "Registro!A1:ZZZ";
let userResponsable;
class Registro {
  constructor({
    id,
    tipo_desvio,
    procedimiento,
    documento,
    pieza,
    pnc,
    producto,
    manufactura,
    trazabilidad,
    proveedor,
    origen,
    cliente,
    desvio,
    tipo_contencion,
    contencion,
    fecha_prog_at,
    id_ot,
    registrado_por,
    area,
    sector,
    subsector,
    responsable,
    fecha_inicio,
    anular,
    comentario_anulacion,
    fecha_anulacion,
    requiere_acc,
    justificacion_no_acc,
    causa,
    accion_correctiva,
    fecha_plazo,
    fecha_impl,
    comentarios_impl,
    met_verf_ef,
    responsable_ef,
    fecha_prev_ef,
    resultado_ef,
    comentario_ef,
    fecha_ef,
  }) {
    this.id = id;
    this.fecha = FormatsDate.latinFormat();
    this.tipo_desvio = tipo_desvio;
    this.procedimiento = procedimiento;
    this.documento = documento;
    this.pieza = pieza;
    this.pnc = pnc;
    this.producto = producto;
    this.manufactura = manufactura;
    this.trazabilidad = trazabilidad;
    this.proveedor = proveedor;
    this.origen = origen;
    this.cliente = cliente;
    this.desvio = desvio;
    this.tipo_contencion = tipo_contencion;
    this.contencion = contencion;
    this.fecha_prog_at = FormatsDate.latinFormat(fecha_prog_at);
    this.id_ot = id_ot;
    this.registrado_por = registrado_por;
    this.area = area;
    this.sector = sector;
    this.subsector = subsector;
    this.responsable = responsable;
    this.fecha_inicio = fecha_inicio;
    this.anular = anular;
    this.comentario_anulacion = comentario_anulacion;
    this.fecha_anulacion = fecha_anulacion;
    this.requiere_acc = requiere_acc;
    this.justificacion_no_acc = justificacion_no_acc;
    this.causa = causa;
    this.accion_correctiva = accion_correctiva;
    this.fecha_plazo = fecha_plazo;
    this.fecha_impl = fecha_impl;
    this.comentarios_impl = comentarios_impl;
    this.met_verf_ef = met_verf_ef;
    this.responsable_ef = responsable_ef;
    this.fecha_prev_ef = fecha_prev_ef;
    this.resultado_ef = resultado_ef;
    this.comentario_ef = comentario_ef;
    this.fecha_ef = fecha_ef;
  }
  static async getRegistros() {
    let response
    try {
      response = await ApiGoogleSheet.getResponse(SheetRegistro);
      if (response.status === 200) {
        response.result.values = arrayToObject(response.result.values);
      }
      return response;
    } catch (e) {
      console.error("Error: ", e);
    }
  }
  static async createId() {
    let response
    try {
      response = await this.getRegistros();
      if (response.status === 200) {
        let IDs = response.result.values.map((item) => Number(item.id.replace("NC-", "")));
        response.result.values = Math.max(...IDs) + 1
      }
      return response;
    } catch (e) {
      console.error("Error: ", e);
    }
  }
  static async post(Data) {
    let newRegistro;
    let response
    try {
      response = await this.createId(); //ID
      if (response.status === 200) {
        let id = response.result.values 
        Data.id = "NC-" + id;
        console.log(Data)
        newRegistro = new Registro(Data);
        try {
          response = await ApiGoogleSheet.getHeaders(SheetRegistro); //Header
          if (response.status === 200) {
            let headers = response.result.values
            newRegistro = objectToArray(newRegistro, headers);
            try {
              response = await ApiGoogleSheet.postData(SheetRegistro, [newRegistro]);
              if(response.status === 200) {
                try {
                  if(Data.responsable) {
                    userResponsable = await Usuario.getUserByAlias(Data.responsable)
                  }
                  else {
                    userResponsable = await Usuario.getUserByAlias('MAROT')
                  }
                  const data = {
                    recipient: userResponsable.email_empresa,
                    subject: 'Se le ha asignado una no conformidad - ' + Data.id,
                    body: `
                    <h3>Se le ha asignado una no conformidad número ${Data.id}.</h3>
                    <p>Atención ${userResponsable.nombreCompleto}. 
                    <br>
                    Se ha registrado una no conformidad de tipo: <strong>${Data.tipo_desvio}</strong>
                    </p>
                    <ul>
                        <li><strong>Id:</strong> ${Data.id}</li>
                        <li><strong>Tipo de desvío:</strong> ${Data.tipo_desvio}</li>
                        <li><strong>Procedimiento:</strong> ${Data.procedimiento}</li>
                        <li><strong>Documento:</strong> ${Data.documento}</li>
                        <li><strong>Pieza:</strong> ${Data.pieza}</li>
                        <li><strong>PNC:</strong> ${Data.pnc}</li>
                        <li><strong>Producto:</strong> ${Data.producto}</li>
                        <li><strong>Origen:</strong> ${Data.origen}</li>
                        <li><strong>Desvío:</strong> ${Data.desvio}</li>
                        <li><strong>Tipo Contención:</strong> ${Data.tipo_contencion}</li>
                        <li><strong>Contención:</strong> ${Data.contencion}</li>
                        <li><strong>Registrado por:</strong> ${Data.registrado_por}</li>
                        <li><strong>Área:</strong> ${Data.area}</li>
                        <li><strong>Sector:</strong> ${Data.sector}</li>
                    </ul>
                    `
                  }
                  response = await Email.sendEmail(data)                  
                } catch (e) {
                  console.log(e);
                }
              }
            } catch (e) {
              console.log(e);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
      return response;
    } catch (e) {
      console.log(e);
    }
  }
}
