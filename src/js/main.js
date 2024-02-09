async function loadedWindow() {
    document.getElementById("instructionAccess").removeAttribute("hidden");
    await UI.openForm()
  }
  function arrayToObject(arr) {
    // Obtenemos los encabezados del array
    var headers = arr[0];
    // Creamos un nuevo array para almacenar los objetos transformados
    var newData = [];
    // Iteramos desde 1 para evitar el primer elemento que son los encabezados
    for (var i = 1; i < arr.length; i++) {
      var obj = {};
      // Iteramos a través de cada elemento del array actual
      for (var j = 0; j < headers.length; j++) {
        // Usamos los encabezados como claves y asignamos los valores correspondientes
        obj[headers[j].toLowerCase()] = arr[i][j];
      }
      newData.push(obj); // Agregamos el objeto al nuevo array
    }
    return newData; // Devolvemos el nuevo array de objetos
  }