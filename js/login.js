class LoginRequest {
	constructor(login, password){
		this.login = login;
		this.password = password;
	}
	send() {
		//make message
		let message = JSON.stringify(this);
		//send message AJAX request
		let request= new XMLHttpRequest();
		
		
		request.setRequestHeader("Content-type", "application/json");
		//request.addEventListener('load', () => initialize(request.response));
		//request.addEventListener('error', () => console.error('XHR error'));
		request.onreadystatechange = () => {
   			 if (request.readyState === 4) {
      				callback(request.response);
   			 }
  		}
  		request.open("GET", "LAMPAPI/login.php", true); //later change to IP address for serverside
		request.send(message);
		
		if(request.status === 200) return null;
		return JSON.parse(request.responseText);

	}

	receive(request) {
		
	}
}

const submitAction = function (){
	//do something with email.value and password.value
	console.log("submitting email and password");
	let request = new LoginRequest(document.getElementById("username").value, document.getElementById("password").value);
	let reply = request.send();
	console.log("received reply.");
	if(reply.error != "") alert("Incorrect Username or Password");

	console.log("Success");
	//if fail, display fail somewhere in red text
}


/*
if (!ValidateEmail(email.value)) {
		console.log("rejected.");
		const error = document.createElement("p");
		const message = document.createTextNode("you entered an invalid email");
	}
*/

function ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    //alert("You have entered an invalid email address!")
    return (false)
}

document.getElementById("submitButton").onclick = submitAction;
