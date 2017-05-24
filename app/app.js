var app = angular.module('myApp', ['ngRoute']);
app.factory("services", ['$http', function($http) {
    var serviceBase = 'services/'
    var obj = {};
   
    obj.getVisitantes = function(){
        return $http.get(serviceBase + 'visitantes');
    }
    obj.getVisitante = function(visitanteID){
        return $http.get(serviceBase + 'visitante?id=' + visitanteID);
    }

    obj.insertarVisitante = function (visitante) {
    return $http.post(serviceBase + 'insertarVisitante', visitante).then(function (results) {
        return results;
    });
  };

  
	obj.updateCustomer = function (id,customer) {
	    return $http.post(serviceBase + 'updateCustomer', {id:id, customer:customer}).then(function (status) {
	        return status.data;
	    });
	};

	obj.deleteCustomer = function (id) {
	    return $http.delete(serviceBase + 'deleteCustomer?id=' + id).then(function (status) {
	        return status.data;
	    });
	};

    return obj;   
}]);

app.controller('dashCtrl', function ($scope, services) {
    services.getVisitantes().then(function(data){//TODO cambiar por grupos
        $scope.visitantes = data.data;
    });
});

app.controller('crearGrupoCtrl', function ($scope, services) {
    services.getVisitantes().then(function(data){
        $scope.visitantes = data.data;
    });
});

app.controller('vistCtrl', function ($scope, services) {
     services.getVisitantes().then(function(data){
        $scope.visitantes = data.data;
    });
});

app.controller('crearGrupoAdd', function ($scope) {
   $scope.visGrupo = [
                    { 'rutVisitante':'123123',
                       'email': 'Bangalore'},
                     
                    ];
            
            $scope.addRow = function(){
                $scope.visGrupo.push({ 
                  "rutVisitante" : "123123123"
                
              });
           
          };
                 

   

     //location.href = '/ParqueCordillera/#/crearGrupo/';
      //$location.path('/ParqueCordillera/#/crearGrupo/');

  
  });




app.controller('administrarVisitante', function ($scope, $rootScope, $location, $routeParams, services, visitante) {
    var visitanteID = ($routeParams.visitanteID) ? parseInt($routeParams.visitanteID) : 0;
    $rootScope.title = (visitanteID > 0) ? 'Editar Visitante' : 'Ingresar Visitante';
    $scope.buttonText = (visitanteID > 0) ? 'Actualizar Visitante' : 'Ingresar Nuevo Visitante';
      var original = visitante.data;
      original._id = visitanteID;
      $scope.visitante = angular.copy(original);
      $scope.visitante._id = visitanteID;

      $scope.isClean = function() {
        return angular.equals(original, $scope.visitante);
      }

      $scope.deleteCustomer = function(customer) {
        $location.path('/');
        if(confirm("Are you sure to delete customer number: "+$scope.customer._id)==true)
        services.deleteCustomer(customer.customerNumber);
      };

      $scope.guardarVisitante = function(visitante) {
        $location.path('/');
        if (visitanteID <= 0) {
            services.insertarVisitante(visitante);
        }
        else {
           // services.actualizarVisitante(visitanteID, visitante);
        }
    };
    
    /*
    function(visitante) {
       this.visitante.fechaNacimiento = new Date();
       this.isOpen = false;
      }
      */


});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        title: 'Dashboard',
        templateUrl: 'pages/dashboard.html',
        controller: 'dashCtrl'
      })
      .when('/visitantes/', {
        title: 'Visitantes',
        templateUrl: 'pages/visitantes.html',
        controller: 'vistCtrl'
      })
      .when('/crearGrupo/', {
        title: 'Crear Grupo',
        templateUrl: 'pages/crearGrupo.html',
        controller: 'crearGrupoCtrl'
      })
      .when('/administrarVisitante/:visitanteID', {
        title: 'Edit Customers',
        templateUrl: 'pages/administrarVisitante.html',
        controller: 'administrarVisitante',
        resolve: {
          visitante : function(services, $route){
            var visitanteID = $route.current.params.visitanteID;
            return services.getVisitante(visitanteID);
          }
        }
      })
      .when('/crearGrupo/:visitanteID', {
        title: 'Crear Grupo',
        templateUrl: 'pages/crearGrupo.html',
        controller: 'crearGrupoAdd',
         resolve: {
          visitante : function(services, $route){
            var visitanteID = $route.current.params.visitanteID;  
               return services.getVisitante(visitanteID);
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
}]);
app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);