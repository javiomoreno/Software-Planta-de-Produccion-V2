pprModController.controller('EP-InicioEnsayoController', [
                                                        '$scope',
                                                        '$rootScope',
                                                        '$location',
                                                        '$uibModal',
                                                        '$route',
                                                        'uiGridConstants',
                                                        'localStorageService',
    function ($scope, $rootScope, $location, $uibModal, $route, uiGridConstants, localStorageService) {

      $scope.datos = [];
      $rootScope.banderaCantidadRegistros = false;
      var fecha = {};
      var cantidadRegistros = 0;

      var todosInStore = localStorageService.get('ensayoJarras');

      $rootScope.registroEnsayoJarras = todosInStore || [];

      $scope.$watch('registroEnsayoJarras', function(){
        localStorageService.add('ensayoJarras', $rootScope.registroEnsayoJarras);
      }, true);

      if ($rootScope.fechaBusqueda !== undefined) {
        $rootScope.myDate = new Date($rootScope.fechaBusqueda);
        fecha = new Date( new Date($rootScope.myDate).getFullYear(), new Date($rootScope.myDate).getMonth(), new Date($rootScope.myDate).getDate());
      }
      else{
        $rootScope.myDate = new Date();
        fecha = new Date( new Date($rootScope.myDate).getFullYear(), new Date($rootScope.myDate).getMonth(), new Date($rootScope.myDate).getDate());
      }

      for (var i = 0; i < $rootScope.registroEnsayoJarras.length; i++) {
        var fecha2 = new Date( new Date($rootScope.registroEnsayoJarras[i].fechaRegistro).getFullYear(), new Date($rootScope.registroEnsayoJarras[i].fechaRegistro).getMonth(), new Date($rootScope.registroEnsayoJarras[i].fechaRegistro).getDate());
        if (new Date(fecha2).getTime() == new Date(fecha).getTime() && $rootScope.registroEnsayoJarras[i].enjatipo == 1 && ($rootScope.registroEnsayoJarras[i].planta === 2 || $rootScope.registroEnsayoJarras[i].planta === 3 || $rootScope.registroEnsayoJarras[i].planta === 4)) {
          $scope.datos.push($rootScope.registroEnsayoJarras[i]);
          $rootScope.banderaCantidadRegistros = true;
          cantidadRegistros ++;
        }
      }

      $scope.a = {};
      $scope.a.fechaVista = '';
      if (cantidadRegistros > 6) {
        $rootScope.tamanoTabla = "455";
      }
      else {
        $rootScope.tamanoTabla = "260";
      }
      $scope.botonEditarFila = false;
    	var dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    	var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    	$rootScope.fecha = dias[new Date($rootScope.myDate).getDay()];
    	$rootScope.fecha = $rootScope.fecha +" "+ new Date($rootScope.myDate).getDate();
      $rootScope.fecha = $rootScope.fecha +", "+ meses[new Date($rootScope.myDate).getMonth()];
      $rootScope.fecha = $rootScope.fecha+" de "+new Date($rootScope.myDate).getFullYear();

    	$rootScope.registro = {};
      $rootScope.gridPorticoJarras = {};

    	$rootScope.plantasPortico = [
        {id: 2, planta: 'P1'},
        {id: 3, planta: 'P2'},
    		{id: 4, planta: 'P1/P2'}];

      $rootScope.plantasPortico2 = [
        {value: 2, label: 'P1'},
        {value: 3, label: 'P2'},
    		{value: 4, label: 'P1/P2'}];

      $rootScope.estados = [
      		{id: 1, estado: 'Activo'},
          {id: 2, estado: 'Inactivo'}];

    	$rootScope.sustancias = [
    		{id: 1, sustancia: 'Hidroxiclururo'},
    		{id: 2, sustancia: 'Sulfato'}];

      $rootScope.sustancias2 = [
    		{value: 1, label: 'Hidroxiclururo'},
    		{value: 2, label: 'Sulfato'}];

		  $rootScope.dosiss = [
    		{id: 1, dosis: 'N/A'},
    		{id: 2, dosis: 'Dosis Aplicar'},
    		{id: 3, dosis: 'Dosis Optima'}];

      $rootScope.dosiss2 = [
      		{value: 1, label: 'N/A'},
      		{value: 2, label: 'Dosis Aplicar'},
      		{value: 3, label: 'Dosis Optima'}];

      var ValidarEntero = "<div><form name=\"inputForm\"><input step=\"any\" type=\"NUMBER\" ng-class=\"'colt' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\"  minlength=1 maxlength=10 required></form></div>";

      $rootScope.gridPorticoJarras.gridOptions = {
        enableColumnMenus: true,
        enableFiltering: false,
        paginationPageSizes: [6, 12, 24, 30, 60],
        paginationPageSize: 60,
        enableSorting: true,
        columnDefs: [
          {field: 'id', displayName: '', enableColumnMenu: false, enableSorting: false, cellEditableCondition: false, enableFiltering: false,
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
              if (parImpar(grid.getCellValue(row,col)/6) === "par") {
                return 'primero';
              }
              else {
                return 'segundo';
              }
            },
            cellTemplate: '<div style="text-align: center;padding-top: 5px;"><a style="color:#307ecc" href ng-click="grid.appScope.generateReport(row)"><i class="ace-icon fa fa-pencil bigger-130"></i></a></div>'
          },
          {field: 'estado', enableHiding: false, enableCellEdit: false, enableFiltering:false,
              displayName: 'Estado', width: "10%", editableCellTemplate: 'ui-grid/dropdownEditor',
              cellFilter: 'mapEstados', editDropdownValueLabel: 'label', editDropdownOptionsArray: $rootScope.estados,
              menuItems:
              [
                {
                    title: 'Filtrar',
                    action: function ($event) {
                      $scope.openFiltrar();
                    }
                }
              ]
          },
          {field: 'fechaRegistro', enableHiding: false, enableFiltering:false, enableCellEdit: false, displayName: 'Fecha Registro', width: "10%",
            type: 'date', cellFilter: 'date:"dd/MM/yyyy"',
            sort: {
              direction: uiGridConstants.DESC,
              priority: 1
            },
            menuItems:
            [
              {
                  title: 'Filtrar',
                  action: function ($event) {
                    $scope.openFiltrar();
                  }
              }
            ]
           },
          {field: 'vasoNumero', enableHiding: false, enableCellEdit: false, displayName: 'Vaso', width: "5%",
            menuItems:
            [
              {
                  title: 'Filtrar',
                  action: function ($event) {
                    $scope.openFiltrar();
                  }
              }
            ]
          },
          {field: 'planta', enableHiding: false, enableCellEdit: false, displayName: 'Planta', width: "10%",
              editableCellTemplate: 'ui-grid/dropdownEditor', cellFilter: 'mapPlantaPortico', editDropdownValueLabel: 'planta',
              editDropdownOptionsArray: $rootScope.plantasPortico,
              filter: {
                term: '',
                type: uiGridConstants.filter.SELECT,
                selectOptions: $rootScope.plantasPortico2
              },
              menuItems:
              [
                {
                    title: 'Filtrar',
                    action: function ($event) {
                      $scope.openFiltrar();
                    }
                }
              ]
          },
          {field: 'color', enableHiding: false, width: "10%", displayName: 'Color (UPC)', enableColumnMenu: true, editableCellTemplate: ValidarEntero,
            menuItems:
            [
              {
                  title: 'Filtrar',
                  action: function ($event) {
                    $scope.openFiltrar();
                  }
              }
            ]
          },
          {field: 'turbiedad', enableHiding: false, width: "15%", displayName: 'Turbiedad (UNT)', enableColumnMenu: true, editableCellTemplate: ValidarEntero,
            menuItems:
            [
              {
                  title: 'Filtrar',
                  action: function ($event) {
                    $scope.openFiltrar();
                  }
              }
            ]
          },
          {field: 'cuagulante', enableHiding: false, width: "10%", displayName: 'Cuagulante', enableColumnMenu: true, editableCellTemplate: ValidarEntero,
            menuItems:
            [
              {
                  title: 'Filtrar',
                  action: function ($event) {
                    $scope.openFiltrar();
                  }
              }
            ]
          },
          {field: 'sustancia', enableHiding: false, width: "10%", displayName: 'Sustancia', editableCellTemplate: 'ui-grid/dropdownEditor',
              cellFilter: 'mapSustancia', editDropdownValueLabel: 'sustancia', editDropdownOptionsArray: $rootScope.sustancias,
              filter: {
                term: '',
                type: uiGridConstants.filter.SELECT,
                selectOptions: $rootScope.sustancias2
              },
              menuItems:
              [
                {
                    title: 'Filtrar',
                    action: function ($event) {
                      $scope.openFiltrar();
                    }
                }
              ]
          },
          {field: 'ayudanteCuagulante', enableHiding: false, width: "18%", displayName: 'Ayudante de Coagulación',
            menuItems:
            [
              {
                  title: 'Filtrar',
                  action: function ($event) {
                    $scope.openFiltrar();
                  }
              }
            ]
          },
          {field: 'tiempoFormacion', enableHiding: false, width: "15%", enableColumnMenu: true, editableCellTemplate: ValidarEntero,
                cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                  if (grid.getCellValue(row,col) >= 10) {
                    return 'red';
                  }
                }, displayName: 'Tiempo de Formación',
                menuItems:
                [
                  {
                      title: 'Filtrar',
                      action: function ($event) {
                        $scope.openFiltrar();
                      }
                  }
                ]
          },
          {field: 'indiceWilcomb', enableHiding: false, width: "15%", displayName: 'Indice de Wilcomb', enableColumnMenu: true, editableCellTemplate: ValidarEntero,
            menuItems:
            [
              {
                  title: 'Filtrar',
                  action: function ($event) {
                    $scope.openFiltrar();
                  }
              }
            ]
          },
          {field: 'tiempoSedimentacion', enableHiding: false, width: "20%", displayName: 'Tiempo de Sedimentacion (min)', enableColumnMenu: true, editableCellTemplate: ValidarEntero,
          menuItems:
            [
              {
                  title: 'Filtrar',
                  action: function ($event) {
                    $scope.openFiltrar();
                  }
              }
            ]
          },
          {field: 'dosis', width: "10%", displayName: 'Dosis', editableCellTemplate: 'ui-grid/dropdownEditor', enableHiding: false,
              cellFilter: 'mapDosiss', editDropdownValueLabel: 'dosis', editDropdownOptionsArray: $rootScope.dosiss,  enableColumnMenu: true,
              cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (grid.getCellValue(row,col) == 2) {
                  return 'green';
                }
                else if(grid.getCellValue(row,col) == 3){
                  return 'blue';
                }
              },
              filter: {
                term: '',
                type: uiGridConstants.filter.SELECT,
                selectOptions: $rootScope.dosiss2
              },
              menuItems:
              [
                {
                    title: 'Filtrar',
                    action: function ($event) {
                      $scope.openFiltrar();
                    }
                }
              ]
          },
          {field: 'observacion', enableHiding: false,  width: "15%", displayName: 'Observación',
          menuItems:
            [
              {
                  title: 'Filtrar',
                  action: function ($event) {
                    $scope.openFiltrar();
                  }
              }
            ]
          }
        ],
        exporterFieldCallback: function( grid, row, col, input ) {
             if( col.name == 'sustancia' ) {
                 return getSustancias(input);
             }
             else if( col.name == 'estado' ) {
                 return getEstados(input);
             }
             else if( col.name == 'dosis' ) {
                 return getDosis(input);
             }
             else if( col.name == 'planta' ) {
                 return getPlantas(input);
             }
             else if( col.name == 'fechaRegistro' ) {
               var dia = new Date(input).getDate() < 10 ? "0" + new Date(input).getDate() : new Date(input).getDate();
               var mes = new Date(input).getMonth() < 9 ? "0" + (new Date(input).getMonth() + 1) : (new Date(input).getMonth() + 1); // getMonth() is zero-based
               var anho = new Date(input).getFullYear();
               return dia + "/" + mes + "/" + anho;
             }
             else {
                 return input;
             }
        }
      };

		  $rootScope.gridPorticoJarras.gridOptions.data = $scope.datos;

      $scope.generateReport = function(row) {
          $rootScope.registro = row.entity;
          $scope.openModal('md');
      };

    	$rootScope.gridPorticoJarras.gridOptions.onRegisterApi = function(gridApi){
	      $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope, $scope.saveRowDespues);
	    };

      $scope.saveRowDespues = function(rowEntity, col) {
        if (col.field === 'dosis' && rowEntity.dosis !== 1) {
          var banderaDA = false;
          var banderaDO = false;
          for (var i = 0; i < $rootScope.registroEnsayoJarras.length; i++) {
            if ($rootScope.registroEnsayoJarras[i].id !== rowEntity.id) {
              if ($rootScope.registroEnsayoJarras[i].enjacons === rowEntity.enjacons) {
                if ($rootScope.registroEnsayoJarras[i].dosis === 2) {
                  banderaDA = true;
                }
                else if ($rootScope.registroEnsayoJarras[i].dosis === 3) {
                  banderaDO = true;
                }
              }
            }
          }
          if (banderaDA && rowEntity.dosis === 2) {
            rowEntity.dosis = '';
            alert('Ya existe una Dosis a Aplicar')
          }
          else if (banderaDO && rowEntity.dosis === 3) {
            rowEntity.dosis = '';
            alert('Ya existe una Dosis Optima')
          }
        }
        for (var i = 0; i < $rootScope.registroEnsayoJarras.length; i++) {
          if ($rootScope.registroEnsayoJarras[i].enjacons === rowEntity.enjacons && new Date($rootScope.registroEnsayoJarras[i].fechaRegistro).getTime() === new Date(rowEntity.fechaRegistro).getTime() && $rootScope.registroEnsayoJarras[i].id === rowEntity.id) {
            $rootScope.registroEnsayoJarras[i] = rowEntity;
          }
        }
      }

      $scope.exportarCSV = function() {
        var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
        $scope.gridApi.exporter.csvExport( 'all', 'all', myElement );
      };

      $scope.exportarPDF = function() {
        $scope.gridApi.exporter.pdfExport( 'all', 'all' );
      };


	    $scope.animationsEnabled = true;

    	$scope.openModal = function (size) {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'Js/EstacionPortico/Ensayo de Jarras/Html/vistas/ensayo/modalAgregarExamenJarras.html',
          controller: 'EP-ModalAgregarExamenJarrasController',
          size: size
        });
    	};

      $scope.openModalNuevo = function (size){
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'Js/EstacionPortico/Ensayo de Jarras/Html/vistas/ensayo/modalNuevoEnsayo.html',
          controller: 'EP-ModalNuevoEnsayoJarrasController',
          size: size
        });
      };

      $scope.openModalEliminar = function (size){
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'Js/EstacionPortico/Ensayo de Jarras/Html/vistas/ensayo/modalEliminarEnsayo.html',
          controller: 'EP-EliminarEnsayoController',
          size: size
        });
      };

      $scope.openFiltrar = function(){
        $rootScope.gridPorticoJarras.gridOptions.enableFiltering = !$rootScope.gridPorticoJarras.gridOptions.enableFiltering;
        $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
      };

      $scope.buscarFecha = function(){
        $rootScope.fechaBusqueda = $scope.a.fechaVista;
        $rootScope.pesatana.ensayo = true;
        $rootScope.pesatana.informativo = false;
        $route.reload();
      };

      function getSustancias(input){
        for (var i = 0; i < $rootScope.sustancias.length; i++) {
          if ($rootScope.sustancias[i].id === input) {
            return $rootScope.sustancias[i].sustancia;
          }
        }
      }

      function getEstados(input){
        for (var i = 0; i < $rootScope.estados.length; i++) {
          if ($rootScope.estados[i].id === input) {
            return $rootScope.estados[i].estado;
          }
        }
      }

      function getPlantas(input){
        for (var i = 0; i < $rootScope.plantasPortico.length; i++) {
          if ($rootScope.plantasPortico[i].id === input) {
            return $rootScope.plantasPortico[i].planta;
          }
        }
      }

      function getDosis(input){
        for (var i = 0; i < $rootScope.dosiss.length; i++) {
          if ($rootScope.dosiss[i].id === input) {
            return $rootScope.dosiss[i].dosis;
          }
        }
      }

      function parImpar(numero) {
        if(parseInt(numero) % 2 == 0) {
          return "par";
        }
        else {
          return "impar";
        }
      }

      $scope.today = function() {
          $scope.dt = new Date();
      };
      $scope.today();

      $scope.clear = function () {
          $scope.dt = null;
      };

      // Disable weekend selection
      $scope.disabled = function(date, mode) {
          return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.toggleMin = function() {
          $scope.minDate = $scope.minDate ? null : new Date();
      };
      $scope.toggleMin();
      $scope.maxDate = new Date(2020, 5, 22);

      $scope.open = function($event) {
          $scope.status.opened = true;
      };

      $scope.setDate = function(year, month, day) {
          $scope.dt = new Date(year, month, day);
      };

      $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];

      $scope.status = {
          opened: false
      };

      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var afterTomorrow = new Date();
      afterTomorrow.setDate(tomorrow.getDate() + 2);
      $scope.events =
          [
              {
                  date: tomorrow,
                  status: 'full'
              },
              {
                  date: afterTomorrow,
                  status: 'partially'
              }
          ];

      $scope.getDayClass = function(date, mode) {
          if (mode === 'day') {
              var dayToCheck = new Date(date).setHours(0,0,0,0);

              for (var i=0;i<$scope.events.length;i++){
                  var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                  if (dayToCheck === currentDay) {
                      return $scope.events[i].status;
                  }
              }
          }

          return '';
      };

      $scope.mytime = new Date();

      $scope.hstep = 1;
      $scope.mstep = 1;
      $scope.ismeridian = true;


}])

.filter('mapPlantaPortico', function() {
  var genderHash = {
    2: 'P1',
    3: 'P2',
    4: 'P1/P2'
  };
  return function(input) {
    if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };
})

.filter('mapSustancia', function() {
  var genderHash = {
    1: 'Hidroxiclururo',
    2: 'Sulfato'
  };
  return function(input) {
    if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };
})

.filter('mapEstados', function() {
  var genderHash = {
    1: 'Activo',
    2: 'Inactivo'
  };
  return function(input) {
    if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };
})

.filter('mapDosiss', function() {
  var genderHash = {
    1: 'N/A',
    2: 'Dosis Aplicar',
    3: 'Dosis Optima'
  };
  return function(input) {
    if (!input){
      return '';
    } else {
      return genderHash[input];
    }
  };
})
