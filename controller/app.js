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


app.service("Artista", function($http){

	this.traerArtistas = function(artista, callback){

		// Obtener la data del artista usando la API de spotify	
		artista = artista.replace(' ','+');

		$http.get("https://api.spotify.com/v1/searcha?q="+artista+"&type=artist")
		.then(callback);
	}
});



//app.controller("Buscador", function($scope, $http, Artista){
app.controller("Buscador", function($scope, Artista){

	$scope.mensaje = false;
	$scope.Artista = Artista;

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

			Artista.traerArtistas(artista, function(response){
				// Mostrar el resultado si es correcto
				$scope.artistas = response.data.artists.items;
			});
		}
	}

});


app.controller("Selector", function($scope, Artista){

	$scope.Artista = Artista;

});


app.controller("PlayList", function($scope){

});