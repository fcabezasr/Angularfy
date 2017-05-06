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

		$http.get("https://api.spotify.com/v1/search?q="+artista+"&type=artist").then(callback);
	}

	this.traerCanciones = function(idartista, callback){

		// Traer la lista de canciones
		$http.get("https://api.spotify.com/v1/artists/"+idartista+"/top-tracks?country=US").then(callback);
	}

	// Mostrar el listado de canciones
	this.canciones = [];

	this.listarCanciones = function(){

		return this.canciones;
	}

	// Mostrar el nombre del cantante
	this.cantante = undefined;

	this.traerCantante = function(){

		return this.cantante;
	}

	// Verificamos si tenemos almacenadas las canciones seleccionadas
	let memoria = localStorage.getItem("playlist");
	if (memoria == undefined) {
		this.seleccionadas = [];
	} else {
		this.seleccionadas = JSON.parse(memoria);
	}

	this.traerSeleccionadas = function(){

		return this.seleccionadas;
	}

	// Limpiamos el PlayList
	this.reset = function(){
		this.seleccionadas = [];
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


	$scope.seleccionar = function(idartista, nombre){

		Artista.traerCanciones(idartista, function(response){
			// Actualizamos el array de canciones
			Artista.canciones = response.data.tracks;
			// Mostrar el nombre del cantante
			Artista.cantante = nombre;
		})
	}


});


app.controller("Selector", function($scope, Artista){

	$scope.Artista = Artista;

	// Guardando las canciones seleccionadas en un Array
	$scope.seleccionar = function(nombre, preview){

		let cancion = {
			nombre : nombre,
			preview : preview
		};

		Artista.seleccionadas.push(cancion);
		// Guardar las canciones seleccionadas en el localStorage como JSON
		localStorage.setItem("playlist", JSON.stringify(Artista.seleccionadas));
	}

});


app.controller("PlayList", function($scope, Artista){

	$scope.Artista = Artista;
	var playing = undefined;
	// Reproducimos el preview
	$scope.reproducir = function(preview){
		
		if (playing) {
			playing.pause();
			playing = undefined;
		} else {
			playing = new Audio(preview);
			playing.play();
		}
	}


});