$(document).ready(loadPage);

function loadPage() {
  
  //****** Materialize Design ******//

  $('select').material_select();
  $(".button-collapse").sideNav();
  // Collapsible sections in sidebar
  $('.collapsible').collapsible();

  //Tooltip
  $('.tooltipped').tooltip({
    delay: 50
  });

  // datetime
  $('.datepicker').pickadate({
    labelMonthNext: 'Mes siguiente',
    labelMonthPrev: 'Mes anterior',
    labelMonthSelect: 'Elegir mes',
    labelYearSelect: 'Elegir un año',
    monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
    weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    weekdaysLetter: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    today: 'Hoy',
    clear: 'Limpiar',
    close: 'OK',
    // Dropdown selectors
    selectYears: true,
    selectMonths: true,
    firstDay: 'Lunes',
    min: new Date(2012, 05, 8),
    max: new Date(2014, 05, 17),
    format: 'dd mmmm, yyyy',
    formatSubmit: 'yyyy-mm-dd',
    closeOnSelect: true,
    closeOnClear: true
  });

  $('#dateFromDatePicker').click(function(event) {
    event.stopPropagation();
    $("#dateFromDatePicker").first().pickadate("picker").open();
  });

  $('#dateUntilDatePicker').click(function(event) {
    event.stopPropagation();
    $("#dateUntilDatePicker").first().pickadate("picker").open();
  });

  // noUiSlider - index.html
  var sliderVesselSpeed = document.getElementById('vesselSpeedSlider');
  noUiSlider.create(sliderVesselSpeed, {
    start: [0, 15],
    connect: true,
    step: 0.1,
    behaviour: 'drag',
    range: {
      'min': 0,
      'max': 30
    },
    format: wNumb({
      decimals: 0
    })

  });
  
  var sliderOpacity = document.getElementById('opacitySlider');
  noUiSlider.create(sliderOpacity, {
    start: [0.8],
    connect: false,
    step: 0.01,
    range: {
      'min': 0,
      'max': 1
    },
    format: wNumb({
      decimals: 0
    })
  });

  var sliderRadius = document.getElementById('radiusSlider');
  noUiSlider.create(sliderRadius, {
    start: [1],
    connect: false,
    step: 0.1,
    range: {
      'min': 1,
      'max': 20
    },
    format: wNumb({
      decimals: 0
    })
  });

  var sliderBlur = document.getElementById('blurSlider');
  noUiSlider.create(sliderBlur, {
    start: [1],
    connect: false,
    step: 0.25,
    range: {
      'min': 1,
      'max': 15
    },
    format: wNumb({
      decimals: 0
    })
  });

  // Categories
  $('#checkCatA').click(changeVesselsNamesByCat);
  $('#checkCatB').click(changeVesselsNamesByCat);
  $('#checkCatC').click(changeVesselsNamesByCat);
  $('#checkCatD').click(changeVesselsNamesByCat);
  $('#checkAltura').click(changeVesselsNamesByCat);
  $('#checkCosteros').click(changeVesselsNamesByCat);

  $('select[name=selectVesselCountry]').change(showFormCat);

  // Button menu events
  $('#btnInput').click(showMapFullScreen);

  // Eventos disparados por Actualizar
  $('#btnReplay').click(sendDataToServer);

  // Eventos disparados al hacer check en capas
  $('#checkLimURY').click(addShapefile);

  // Modal
  $('.modal').modal({
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: 0.6, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '4%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      //console.log(modal, trigger);
    },
    complete: function() {} // Callback for Modal close
  });

  Shiny.addCustomMessageHandler("modal",
    function(modal) {
      $('#modal1').modal(modal);

    });

  // Load vessels data
  var vesselsData = JSON.parse(vessels);
  
  //$('.chips').on('chip.add', function(e, chip) {});
  //$('.chips').on('chip.delete', function(e, chip) {});
  //$('.chips').on('chip.select', function(e, chip) {});

  Shiny.addCustomMessageHandler("searchVessels",
    function(searchVessels) {

      var searchVesselsData = [];
      var i = 0;

      for (i; i < searchVessels.length; i++) {
        var obj = {};
        obj.tag = searchVessels[i];
        searchVesselsData.push(obj);
      }

      // Search vessel by name
      $('#searchVesselNameInput').material_chip({
        data: searchVesselsData,
        autocompleteOptions: {
          data: vesselsData,
          limit: 20,
          minLength: 1
        }

      });

    });
    
  Shiny.addCustomMessageHandler("catVessels",
    function(catVessels) {

      var catVesselsData = [];
      var i = 0;

      for (i; i < catVessels.length; i++) {
        var obj = {};
        obj.tag = catVessels[i];
        catVesselsData.push(obj);
      }
      
      updateVesselsNamesByCat(catVesselsData);

    });

  // Modal query Info
  $('#btnQueryInfo').click(showModalQueryInfo);
  
  $('#searchVesselNameInput').click(clearCategoriesInputs);
  
  // Set session storage
  //setSessionStorage();
  
   getSessionStorage();

}


//****************************************************************************//


// Action functions
function changeVesselsNamesByCat() {

  // Get client data
  var checkCatA = $('#checkCatA').prop('checked');
  var checkCatB = $('#checkCatB').prop('checked');
  var checkCatC = $('#checkCatC').prop('checked');
  var checkCatD = $('#checkCatD').prop('checked');
  var checkAltura = $('#checkAltura').prop('checked');
  var checkCosteros = $('#checkCosteros').prop('checked');

  var vesselsCat = "{";
  var arrayOfCat = [];

  if (checkCatA) {

    // Load catA vessels data
    var vesselsCatA = JSON.parse(catA);
    var keyA;

    for (keyA in vesselsCatA) {
      var valA = vesselsCatA[keyA];
      var objA = {};
      objA.tag = keyA;
      arrayOfCat.push(objA);
      vesselsCat = vesselsCat + '\"' + keyA + '\":\"' + valA + '\",';

    }

  }
  if (checkCatB) {

    // Load catB vessels data
    var vesselsCatB = JSON.parse(catB);
    var keyB;

    for (keyB in vesselsCatB) {
      var valB = vesselsCatB[keyB];
      var objB = {};
      objB.tag = keyB;
      arrayOfCat.push(objB);
      vesselsCat = vesselsCat + '\"' + keyB + '\":\"' + valB + '\",';

    }

  }
  if (checkCatC) {

    // Load catC vessels data
    var vesselsCatC = JSON.parse(catC);
    var keyC;

    for (keyC in vesselsCatC) {
      var valC = vesselsCatC[keyC];
      var objC = {};
      objC.tag = keyC;
      arrayOfCat.push(objC);
      vesselsCat = vesselsCat + '\"' + keyC + '\":\"' + valC + '\",';

    }

  }
  if (checkCatD) {

    // Load catC vessels data
    var vesselsCatD = JSON.parse(catD);
    var keyD;

    for (keyD in vesselsCatD) {
      var valD = vesselsCatD[keyD];
      var objD = {};
      objD.tag = keyD;
      arrayOfCat.push(objD);
      vesselsCat = vesselsCat + '\"' + keyD + '\":\"' + valD + '\",';

    }

  }
  if (checkAltura) {

    // Load catC vessels data
    var vesselsAltura = JSON.parse(altura);
    var keyAltura;

    for (keyAltura in vesselsAltura) {
      var valAltura = vesselsAltura[keyAltura];
      var objAltura = {};
      objAltura.tag = keyAltura;
      arrayOfCat.push(objAltura);
      vesselsCat = vesselsCat + '\"' + keyAltura + '\":\"' + valAltura + '\",';

    }

  }
  if (checkCosteros) {

    // Load catC vessels data
    var vesselsCosteros = JSON.parse(costeros);
    var keyCosteros;

    for (keyCosteros in vesselsCosteros) {
      var valCosteros = vesselsCosteros[keyCosteros];
      var objCosteros = {};
      objCosteros.tag = keyCosteros;
      arrayOfCat.push(objCosteros);
      vesselsCat = vesselsCat + '\"' + keyCosteros + '\":\"' + valCosteros + '\",';

    }
  }

  vesselsCat = vesselsCat + '\" \":\ null\}';
  objVesselsCat = JSON.parse(vesselsCat);

  // Clear chips
  $('#catVesselNameInput').material_chip({});
  $('#searchVesselNameInput').material_chip({});

  // Search vessel by name
  $('#catVesselNameInput').material_chip({
    data: arrayOfCat,
    autocompleteOptions: {
      data: objVesselsCat,
      limit: 20,
      minLength: 1
    }
  });

  // Set session storage
  sessionStorage.setItem("checkCatA", checkCatA);
  sessionStorage.setItem("checkCatB", checkCatB);
  sessionStorage.setItem("checkCatC", checkCatC);
  sessionStorage.setItem("checkCatD", checkCatD);
  sessionStorage.setItem("checkAltura", checkAltura);
  sessionStorage.setItem("checkCosteros", checkCosteros);

}

function updateVesselsNamesByCat(catVesselsData) {

  // Get session data
  var checkCatA = (sessionStorage.getItem("checkCatA") == 'true');
  var checkCatB = (sessionStorage.getItem("checkCatB") == 'true');
  var checkCatC = (sessionStorage.getItem("checkCatC") == 'true');
  var checkCatD = (sessionStorage.getItem("checkCatD") == 'true');
  var checkCosteros = (sessionStorage.getItem("checkCosteros") == 'true');
  var checkAltura = (sessionStorage.getItem("checkAltura") == 'true');

  var vesselsCat = "{";

  if (checkCatA) {

    // Load catA vessels data
    var vesselsCatA = JSON.parse(catA);
    var keyA;

    for (keyA in vesselsCatA) {
      var valA = vesselsCatA[keyA];
      var objA = {};
      vesselsCat = vesselsCat + '\"' + keyA + '\":\"' + valA + '\",';

    }

  }
  if (checkCatB) {

    // Load catB vessels data
    var vesselsCatB = JSON.parse(catB);
    var keyB;

    for (keyB in vesselsCatB) {
      var valB = vesselsCatB[keyB];
      var objB = {};
      vesselsCat = vesselsCat + '\"' + keyB + '\":\"' + valB + '\",';

    }

  }
  if (checkCatC) {

    // Load catC vessels data
    var vesselsCatC = JSON.parse(catC);
    var keyC;

    for (keyC in vesselsCatC) {
      var valC = vesselsCatC[keyC];
      var objC = {};
      vesselsCat = vesselsCat + '\"' + keyC + '\":\"' + valC + '\",';

    }

  }
  if (checkCatD) {

    // Load catC vessels data
    var vesselsCatD = JSON.parse(catD);
    var keyD;

    for (keyD in vesselsCatD) {
      var valD = vesselsCatD[keyD];
      var objD = {};
      vesselsCat = vesselsCat + '\"' + keyD + '\":\"' + valD + '\",';

    }

  }
  if (checkAltura) {

    // Load catC vessels data
    var vesselsAltura = JSON.parse(altura);
    var keyAltura;

    for (keyAltura in vesselsAltura) {
      var valAltura = vesselsAltura[keyAltura];
      var objAltura = {};
      vesselsCat = vesselsCat + '\"' + keyAltura + '\":\"' + valAltura + '\",';

    }

  }
  if (checkCosteros) {

    // Load catC vessels data
    var vesselsCosteros = JSON.parse(costeros);
    var keyCosteros;

    for (keyCosteros in vesselsCosteros) {
      var valCosteros = vesselsCosteros[keyCosteros];
      var objCosteros = {};
      vesselsCat = vesselsCat + '\"' + keyCosteros + '\":\"' + valCosteros + '\",';

    }
  }

  vesselsCat = vesselsCat + '\" \":\ null\}';
  objVesselsCat = JSON.parse(vesselsCat);

  // Clear chips
  //$('#catVesselNameInput').material_chip({});
  //$('#searchVesselNameInput').material_chip({});

  // Search vessel by name
  $('#catVesselNameInput').material_chip({
    data: catVesselsData,
    autocompleteOptions: {
      data: objVesselsCat,
      limit: 20,
      minLength: 1
    }
  });
}

function clearCategoriesInputs() {
  
  $('#catVesselNameInput').material_chip({});
  $('#checkCatA').prop('checked', false);
  $('#checkCatB').prop('checked', false);
  $('#checkCatC').prop('checked', false);
  $('#checkCatD').prop('checked', false);
  $('#checkCosteros').prop('checked', false);
  $('#checkAltura').prop('checked', false);
  
  sessionStorage.setItem("checkCatA", checkCatA);
  sessionStorage.setItem("checkCatB", checkCatB);
  sessionStorage.setItem("checkCatC", checkCatC);
  sessionStorage.setItem("checkCatD", checkCatD);
  sessionStorage.setItem("checkAltura", checkAltura);
  sessionStorage.setItem("checkCosteros", checkCosteros);
  
}

// Check for settings in heatmap
function settings() {

  // Return variable
  var differentSettings = false;

  // Get client data
  var opacity = $('#opacitySlider span').html();
  var radius = $('#radiusSlider span').html();
  var color = $('#colorSelect select').val();
  var blur = $('#blurSlider span').html();

  // Get session data 
  var opacityOld = sessionStorage.getItem("opacity");
  var radiusOld = sessionStorage.getItem("radius");
  var colorOld = sessionStorage.getItem("color");
  var blurOld = sessionStorage.getItem("blur");

  // Check if client data is the same as previous state
  if (opacity != opacityOld) {
    differentSettings = true;
    sessionStorage.setItem("opacity", opacity);
  }

  if (radius != radiusOld) {
    differentSettings = true;
    sessionStorage.setItem("radius", radius);
  }

  if (color != colorOld) {
    differentSettings = true;
    sessionStorage.setItem("color", color);
  }

  if (blur != blurOld) {
    differentSettings = true;
    sessionStorage.setItem("blur", blur);
  }

  return differentSettings;

}

// Check for query parameters
function query() {

  // Return variable
  var differentSettings = false;

  // Get data from client
  var thresholdPoints = $('#thresholdPointsInput').val();
  var dateFrom = $('input[name=dateFrom_submit]').attr('value');
  var dateUntil = $('input[name=_submit]').attr('value');
  var vesselSpeedMin = document.getElementById('vesselSpeedSlider').noUiSlider.get()[0];
  var vesselSpeedMax = document.getElementById('vesselSpeedSlider').noUiSlider.get()[1];
  var checkCatA = $('#checkCatA').prop('checked');
  var checkCatB = $('#checkCatB').prop('checked');
  var checkCatC = $('#checkCatC').prop('checked');
  var checkCatD = $('#checkCatD').prop('checked');
  var checkAltura = $('#checkAltura').prop('checked');
  var checkCosteros = $('#checkCosteros').prop('checked');

  // Get session data 
  var thresholdPointsOld = sessionStorage.getItem("thresholdPoints");
  var dateFromOld = sessionStorage.getItem("dateFrom");
  var dateUntilOld = sessionStorage.getItem("dateUntil");
  var vesselSpeedMinOld = sessionStorage.getItem("vesselSpeedMin");
  var vesselSpeedMaxOld = sessionStorage.getItem("vesselSpeedMax");

  // Check if client data is the same as previous state
  if (thresholdPoints != thresholdPointsOld) {
    differentSettings = true;
    sessionStorage.setItem("thresholdPoints", thresholdPoints);
  }

  if (dateFrom != dateFromOld) {
    differentSettings = true;
    sessionStorage.setItem("dateFrom", dateFrom);
  }

  if (dateUntil != dateUntilOld) {
    differentSettings = true;
    sessionStorage.setItem("dateUntil", dateUntil);
  }

  if (vesselSpeedMin != vesselSpeedMinOld) {
    differentSettings = true;
    sessionStorage.setItem("vesselSpeedMin", vesselSpeedMin);
  }

  if (vesselSpeedMax != vesselSpeedMaxOld) {
    differentSettings = true;
    sessionStorage.setItem("vesselSpeedMax", vesselSpeedMax);
  }

  // Get search data vessels
  var data = $('#searchVesselNameInput').material_chip('data');
  var len = data.length;
  var searchVesselName = "";
  var searchVesselNameOld = sessionStorage.getItem("searchVesselName");

  var i = 0;

  for (i; i < len; i = i + 1) {
    searchVesselName += data[i].tag + "\n";
  }

  if (searchVesselName != searchVesselNameOld) {
    differentSettings = true;
    sessionStorage.setItem("searchVesselName", searchVesselName);
  }

  // Fishing vessels categories
  if (checkCatA | checkCatB | checkCatC | checkCatD | checkAltura | checkCosteros) {

    // Get data from categories
    var catData = $('#catVesselNameInput').material_chip('data');
    var catLen = catData.length;
    var catVesselName = "";
    var catVesselNameOld = sessionStorage.getItem("catVesselName");

    var j = 0;

    for (j; j < catLen; j = j + 1) {
      catVesselName += catData[j].tag + "\n";
    }

    if (catVesselName != catVesselNameOld) {
      differentSettings = true;
      sessionStorage.setItem("catVesselName", catVesselName);
    }
  }

  return differentSettings;
}

// Send data to server if data is different
function sendDataToServer() {

  var differentSettings = settings();
  var differentQuery = query();

  // Logs
  console.log("Different settings: " + differentSettings);
  console.log("Different query: " + differentQuery);

  if (differentSettings) {

    // Get session data 
    var opacity = sessionStorage.getItem("opacity");
    var radius = sessionStorage.getItem("radius");
    var color = sessionStorage.getItem("color");
    var blur = sessionStorage.getItem("blur");

    // Send config data to server
    Shiny.onInputChange("opacity", opacity);
    Shiny.onInputChange("radius", radius);
    Shiny.onInputChange("color", color);
    Shiny.onInputChange("blur", blur);
  }

  if (differentQuery) {

    // Get session data 
    var thresholdPoints = sessionStorage.getItem("thresholdPoints");
    var dateFrom = sessionStorage.getItem("dateFrom");
    var dateUntil = sessionStorage.getItem("dateUntil");
    var vesselSpeedMin = sessionStorage.getItem("vesselSpeedMin");
    var vesselSpeedMax = sessionStorage.getItem("vesselSpeedMax");
    var catA = (sessionStorage.getItem("checkCatA") == 'true');
    var catB = (sessionStorage.getItem("checkCatB") == 'true');
    var catC = (sessionStorage.getItem("checkCatC") == 'true');
    var catD = (sessionStorage.getItem("checkCatD") == 'true');
    var catAltura = (sessionStorage.getItem("checkAltura") == 'true');
    var catCosteros = (sessionStorage.getItem("checkCosteros") == 'true');
    var searchVesselName = sessionStorage.getItem("searchVesselName");
    var catVesselName = sessionStorage.getItem("catVesselName");

    // Send query data to server
    Shiny.onInputChange("thresholdPoints", thresholdPoints);
    Shiny.onInputChange("dateFrom", dateFrom);
    Shiny.onInputChange("dateUntil", dateUntil);
    Shiny.onInputChange("vesselSpeedMin", vesselSpeedMin);
    Shiny.onInputChange("vesselSpeedMax", vesselSpeedMax);
    Shiny.onInputChange("catA", catA);
    Shiny.onInputChange("catB", catB);
    Shiny.onInputChange("catC", catC);
    Shiny.onInputChange("catD", catD);
    Shiny.onInputChange("catAltura", catAltura);
    Shiny.onInputChange("catCosteros", catCosteros);
    Shiny.onInputChange("searchVesselName", searchVesselName);
    Shiny.onInputChange("catVesselName", catVesselName);
  }

  //var aisCheck = $('#aisDataCheck').prop('checked');
  //Shiny.onInputChange("aisData", aisCheck);
  //var selectVesselType = $('select[name=selectVesselType]').val();
  //var selectVesselName = $('select[name=selectVesselName2]').val();
  //Shiny.onInputChange("selectVesselType", selectVesselType);
  //Shiny.onInputChange("selectVesselName", selectVesselName);

}

// Show and Hide UI events
function showFormCat() {

  var selectVesselCountry = $('select[name=selectVesselCountry]').val();

  if (selectVesselCountry == "ury" | selectVesselCountry == "argury") {
    $('#formCatUry').attr('class', 'show');
  } else {
    $('#formCatUry').attr('class', 'hide');
  }

  if (selectVesselCountry == "arg" | selectVesselCountry == "argury") {
    $('#formCatArg').attr('class', 'show');
  } else {
    $('#formCatArg').attr('class', 'hide');
  }
}

function showMapFullScreen() {

  var inputVisible = $('#input').is(":visible");

  // hide and show
  if (inputVisible) {
    $('#input').hide();
    $('#mainPanel').attr("class", "col s12 m12 l12");
    $('#sidebarPanel').attr("class", "col s0 m0 l0 z-depth-0");
  } else {
    $('#input').show();
    $('#mainPanel').attr("class", "col s12 m8 l9");
    $('#sidebarPanel').attr("class", "col s12 m4 l3 z-depth-0");
  }

}

function showModalQueryInfo() {
  
  var thresholdPoints = sessionStorage.getItem("thresholdPoints");
  var dateFrom = sessionStorage.getItem("dateFrom");
  var dateUntil = sessionStorage.getItem("dateUntil");
  var searchVesselName = sessionStorage.getItem("searchVesselName");
  var checkCatA = sessionStorage.getItem("checkCatA");
  var checkCatB = sessionStorage.getItem("checkCatB");
  
  var vesselSpeedMin = sessionStorage.getItem("vesselSpeedMin");
  var vesselSpeedMax = sessionStorage.getItem("vesselSpeedMax");
  
  $('#modal2').modal("open");
  $('#modal2DbInput').html('<i class="fa fa-database fa-fw" aria-hidden="true"></i>&nbsp; <b>Base de Datos:</b> AIS / <b>Límite de posiciones:</b> ' + thresholdPoints)
  $('#modal2TimeInput').html('<i class="fa fa-calendar fa-fw" aria-hidden="true"></i>&nbsp; <b>Fechas:</b> ' + dateFrom + ' / ' + dateUntil)
  $('#modal2SearchInput').html('<i class="fa fa-search fa-fw" aria-hidden="true"></i>&nbsp; <b>Búsqueda:</b> ' + searchVesselName)
  $('#modal2FisheriesInput').html('<i class="fa fa-industry fa-fw" aria-hidden="true"></i>&nbsp; <b>Flota de Pesca:</b> ' + 'Categoría A: ' + checkCatA)
  
}

// Session Storage
function setSessionStorage() {

  // Check browser support
  if (typeof(Storage) !== "undefined") {

    var opacity = $('#opacitySlider span').html();
    var radius = $('#radiusSlider span').html();
    var color = $('#colorSelect select').val();
    var blur = $('#blurSlider span').html();
    var thresholdPoints = $('#thresholdPointsInput').val();
    var dateFrom = $('input[name=dateFrom_submit]').attr('value');
    var dateUntil = $('input[name=_submit]').attr('value');
    var vesselSpeedMin = document.getElementById('vesselSpeedSlider').noUiSlider.get()[0];
    var vesselSpeedMax = document.getElementById('vesselSpeedSlider').noUiSlider.get()[1];
    var checkCatA = $('#checkCatA').prop('checked');
    var checkCatB = $('#checkCatB').prop('checked');
    var checkCatC = $('#checkCatC').prop('checked');
    var checkCatD = $('#checkCatD').prop('checked');
    var checkAltura = $('#checkAltura').prop('checked');
    var checkCosteros = $('#checkCosteros').prop('checked');
    var searchVesselName = "ALDEBARAN I";
    var catVesselName = "";

    // Store
    sessionStorage.setItem("opacity", opacity);
    sessionStorage.setItem("radius", radius);
    sessionStorage.setItem("color", color);
    sessionStorage.setItem("blur", blur);
    sessionStorage.setItem("thresholdPoints", thresholdPoints);
    sessionStorage.setItem("dateFrom", dateFrom);
    sessionStorage.setItem("dateUntil", dateUntil);
    sessionStorage.setItem("vesselSpeedMin", vesselSpeedMin);
    sessionStorage.setItem("vesselSpeedMax", vesselSpeedMax);
    sessionStorage.setItem("checkCatA", checkCatA);
    sessionStorage.setItem("checkCatB", checkCatB);
    sessionStorage.setItem("checkCatC", checkCatC);
    sessionStorage.setItem("checkCatD", checkCatD);
    sessionStorage.setItem("checkAltura", checkAltura);
    sessionStorage.setItem("checkCosteros", checkCosteros);
    sessionStorage.setItem("searchVesselName", searchVesselName);
    sessionStorage.setItem("catVesselName", catVesselName);

  } else {
    alert("Disculpas, tú navegador no soporta Almacenamiento Web... =( ");
  }
}

function getSessionStorage() {
  
  // Get session data 
  var thresholdPoints = sessionStorage.getItem("thresholdPoints");
  var dateFrom = sessionStorage.getItem("dateFrom");
  var dateUntil = sessionStorage.getItem("dateUntil");
  var vesselSpeedMin = sessionStorage.getItem("vesselSpeedMin");
  var vesselSpeedMax = sessionStorage.getItem("vesselSpeedMax");
  var catA = (sessionStorage.getItem("checkCatA") == 'true');
  var catB = (sessionStorage.getItem("checkCatB") == 'true');
  var catC = (sessionStorage.getItem("checkCatC") == 'true');
  var catD = (sessionStorage.getItem("checkCatD") == 'true');
  var catCosteros = (sessionStorage.getItem("checkCosteros") == 'true');
  var catAltura = (sessionStorage.getItem("checkAltura") == 'true');
  
  var opacity = sessionStorage.getItem("opacity");
  var radius = sessionStorage.getItem("radius");
  var color = sessionStorage.getItem("color");
  var blur = sessionStorage.getItem("blur");
  
  // Set inputs
  if (thresholdPoints !== null) {
    $('#thresholdPointsInput').attr('value', thresholdPoints);
  }
  
  if (vesselSpeedMin !== null | vesselSpeedMax !== null) {
  var sliderVesselSpeed = document.getElementById('vesselSpeedSlider');
  sliderVesselSpeed.noUiSlider.destroy();
  noUiSlider.create(sliderVesselSpeed, {
    start: [parseFloat(vesselSpeedMin), parseFloat(vesselSpeedMax)],
    connect: true,
    step: 0.1,
    margin: 0.1,
    behaviour: 'drag',
    range: {
      'min': 0,
      'max': 30
    },
    format: wNumb({
      decimals: 0
    })

  });
  }
  
  $('#checkCatA').prop('checked', catA);
  $('#checkCatB').prop('checked', catB);
  $('#checkCatC').prop('checked', catC);
  $('#checkCatD').prop('checked', catD);
  $('#checkCosteros').prop('checked', catCosteros);
  $('#checkAltura').prop('checked', catAltura);

  if (opacity !== null) {
  var sliderOpacity = document.getElementById('opacitySlider');
  sliderOpacity.noUiSlider.destroy();
  noUiSlider.create(sliderOpacity, {
    start: [parseFloat(opacity)],
    connect: false,
    step: 0.01,
    range: {
      'min': 0,
      'max': 1
    },
    format: wNumb({
      decimals: 0
    })
  });
  }
  
  if (radius !== null) {
  var sliderRadius = document.getElementById('radiusSlider');
  sliderRadius.noUiSlider.destroy();
  noUiSlider.create(sliderRadius, {
    start: [parseFloat(radius)],
    connect: false,
    step: 0.1,
    range: {
      'min': 1,
      'max': 20
    },
    format: wNumb({
      decimals: 0
    })
  });
  }
  
  if (blur !== null) {
  var sliderBlur = document.getElementById('blurSlider');
  sliderBlur.noUiSlider.destroy();
  noUiSlider.create(sliderBlur, {
    start: [parseFloat(blur)],
    connect: false,
    step: 0.25,
    range: {
      'min': 1,
      'max': 15
    },
    format: wNumb({
      decimals: 0
    })
  });
  }

}

// Add shapefiles
function addShapefile() {
  
  var limURYshpfile = new L.Shapefile('js/limitesURY.zip', {
			onEachFeature: function(feature, layer) {
				if (feature.properties) {
					layer.bindPopup(Object.keys(feature.properties).map(function(k) {
						return k + ": " + feature.properties[k];
					}).join("<br />"), {
						maxHeight: 200
					});
				}
			}
		});
		
		limURYshpfile.addTo(map);
		limURYshpfile.once("data:loaded", function() {
			console.log("finished loaded shapefile");
		});
		
		console.log(limURYshpfile);
		
		alert("SHP")
		
}
