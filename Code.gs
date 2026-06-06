function enviarAlertasVencimiento() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PROYECTO VENCIMIENTO DE EQUIPOS DVA ");
  if (!hoja) {
    Logger.log("❌ Hoja no encontrada. Verifica el nombre: 'PROYECTO_VENCIMIENTO_EQUIPOS_DVA'.");
    return;
  }

  var datos = hoja.getDataRange().getValues();
  var hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  var propiedades = PropertiesService.getScriptProperties();
  var notificacionesEnviadas = propiedades.getProperties();

  var clavesActuales = {};

  for (var i = 1; i < datos.length; i++) {
    var codigoSerie = datos[i][2];
    var fechaVencimiento = datos[i][4];
    var estadoFinal = datos[i][13];

    var alertaMinima = datos[i][7];
    var alertaIntermedia = datos[i][9];
    var alertaMaxima = datos[i][11];

    var estadoNotificacion = hoja.getRange(i + 1, 7);
    var estadoNotificacionMinima = hoja.getRange(i + 1, 9);
    var estadoNotificacionIntermedia = hoja.getRange(i + 1, 11);
    var estadoNotificacionMaxima = hoja.getRange(i + 1, 13);

    if (fechaVencimiento && estadoFinal !== "Calibrado") {
      var fechaVencimientoDate = convertirFecha(fechaVencimiento);

      var claveNotificacion = codigoSerie + "-" + fechaVencimientoDate.getTime();
      clavesActuales[claveNotificacion] = true;

      var tipoAlerta = "";
      var enviarCorreo = false;
      var checkBox = null;

      var alertaMinimaDate = convertirFecha(alertaMinima);
      var alertaIntermediaDate = convertirFecha(alertaIntermedia);
      var alertaMaximaDate = convertirFecha(alertaMaxima);

      if (compararFechas(alertaMinimaDate, hoy) && estadoNotificacionMinima.getValue() === false) {
        tipoAlerta = "ALERTA MÍNIMA";
        enviarCorreo = true;
        checkBox = estadoNotificacionMinima;
      } else if (compararFechas(alertaIntermediaDate, hoy) && estadoNotificacionIntermedia.getValue() === false) {
        tipoAlerta = "ALERTA INTERMEDIA";
        enviarCorreo = true;
        checkBox = estadoNotificacionIntermedia;
      } else if (compararFechas(alertaMaximaDate, hoy) && estadoNotificacionMaxima.getValue() === false) {
        tipoAlerta = "ALERTA MÁXIMA";
        enviarCorreo = true;
        checkBox = estadoNotificacionMaxima;
      }

      if (enviarCorreo) {
        MailApp.sendEmail({
          // Reemplaza con los correos del equipo de calificaciones
          to: "correo1@tuempresa.com, correo2@tuempresa.com, correo3@tuempresa.com",
          subject: `🚨 ${tipoAlerta}: Vencimiento del equipo ${datos[i][1]}`,
          htmlBody: `
            <h2 style="color: red;">¡${tipoAlerta}!</h2>
            <p><b>El plazo efectivo de calibración del equipo está por vencerse. A continuación, los detalles:</b></p>
            <p><b>Nombre del equipo:</b> ${datos[i][1]}<br>
            <b>Código/Serie:</b> ${codigoSerie}<br>
            <b>Fecha de vencimiento:</b> ${fechaVencimientoDate.toLocaleDateString()}</p>
            <p>Por favor, procede a tomar las acciones necesarias.</p>
            <p style="font-size: 24px; color: #007BFF; font-weight: bold;">GRUPO DVA</p>
          `,
        });

        propiedades.setProperty(claveNotificacion, fechaVencimientoDate.toISOString());
        estadoNotificacion.setValue(true);
        checkBox.setValue(true);

        Logger.log(`✅ Se marcó correctamente el checkbox de ${tipoAlerta} para el equipo: ${datos[i][1]}`);
      } else {
        Logger.log(`⏩ Equipo ${datos[i][1]} no requiere notificación hoy.`);
      }
    } else {
      Logger.log(`❌ Fila ${i + 1}: Sin fecha de vencimiento válida o equipo calibrado. Se omite.`);
    }
  }

  for (var clave in notificacionesEnviadas) {
    if (!clavesActuales[clave]) {
      propiedades.deleteProperty(clave);
      Logger.log("🗑️ Clave obsoleta eliminada: " + clave);
    }
  }
}

function convertirFecha(valor) {
  if (!valor) return null;
  try {
    var fecha = new Date(valor);
    fecha.setHours(0, 0, 0, 0);
    return isNaN(fecha.getTime()) ? null : fecha;
  } catch (e) {
    return null;
  }
}

function compararFechas(fecha1, fecha2) {
  if (!fecha1 || !fecha2) return false;
  return fecha1.getTime() === fecha2.getTime();
}
