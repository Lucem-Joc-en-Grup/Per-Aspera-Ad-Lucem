function platform_game(){
	localStorage.setItem("carregar",0);
	loadpage("./html/platform.html");

}

function load(){
	// loadpage("./html/load.html");
	localStorage.setItem("carregar",1);
	loadpage("./html/platform.html");
	
}

function exit(){
	if (name != ""){
		alert("Leaving " + name + "'s game");
	}
	name = "";
}