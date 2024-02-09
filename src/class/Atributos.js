const SheetAtributos = 'Otros Atributos!A1:ZZZ';
const Atributos = {}
class Atributo {
    static async getAtributos() {
        try {
            let response = await ApiGoogleSheet.getResponse(SheetAtributos);
            response = response.result.values
            response = arrayToObject(response);
            Atributos.manufactura = response.map(item => item.manufactura).filter(item => {if(item) {return item}})
            Atributos.pnc = response.map(item => item.pnc).filter(item => {if(item) {return item}})
            Atributos.origen = response.map(item => item.origen).filter(item => {if(item) {return item}})
            Atributos.si_no = response.map(item => item.si_no).filter(item => {if(item) {return item}})
            Atributos.resultado_ef = response.map(item => item.resultado_ef).filter(item => {if(item) {return item}})
            Atributos.tipo_desvio = response.map(item => item.tipo_desvio).filter(item => {if(item) {return item}})
            Atributos.documento = response.map(item => item.documento).filter(item => {if(item) {return item}})
        } catch (e) {
            console.log(e)
        }
    }
    static getAtributoList(atributo) {
        return Atributos[atributo]
    }
}
class UI_Atributo {

    static loadAtributo(atributo,idInput) {
        let input;
        if(idInput) {
            input = document.getElementById(idInput)
        }
        else {input = document.getElementById(atributo);}
        input.innerHTML = '<option value="" selected></option>';
        let listAtributo = Atributo.getAtributoList(atributo);
        listAtributo.map(item => {
            let option = document.createElement("option");
            let textNode = document.createTextNode(item);
            option.appendChild(textNode);
            option.value = item;
            input.appendChild(option);
        })       
    }
}