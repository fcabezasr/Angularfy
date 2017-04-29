var app = angular.module("Angularfy", ["ngRoute"]);


app.config(['$routeProvider', function($routeProvider){

	// Definimos que controlador y plantilla se cargará al entrar a la ruta /home
	$routeProvider
	.when("/", {
		controller	: 'Buscador',
		templateUrl	: 'view/home.html'
	})
	.when("/playlist", {
		controller	: 'PlayList',
		templateUrl	: 'view/playlist.html'
	})
	.otherwise({
		redirecTo: "/home"
	})

}]);

app.controller("Buscador", function($scope, $http){

	$scope.buscar = function(){

		let artista = $scope.artista; // Variable de corta duración y es LOCAL
		//const artista = $scope.artista; // Variable de mediana duración y es GLOBAL
		//var artista = $scope.artista; // Variable de larga duración, ocupa memoria

		if ($scope.artista == undefined) {

			// Si no escribe nada en el campo de texto, muestra el mensaje
			$scope.mensaje = "Ingrese el artista";

		} else {

			// Si ha escrito algo borro el $scope mensaje
			$scope.mensaje = false;

			// Obtener la data del artista usando la API de spotify
			$http.get("https://api.spotify.com/v1/search?q="+$scope.artista+"&type=artist").then(
				function(response){
					// Mostrar el resultado si es correcto
					console.log("response", response);

					$scope.artistas = response.data.artists.items;

					console.log("artistas", $scope.artistas);
				},
				function(response){
					// Mostrar un mensaje de error si no es correcto
					console.error(response.data.error.status, response.data.error.message);
				}
			);

			// Mostrar el resultado si es correcto


			// Mostrar un mensaje de error si no se encuentra

		}
	}

});


app.controller("PlayList", function($scope){

});