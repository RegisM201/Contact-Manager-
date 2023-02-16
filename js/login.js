class LoginRequest {
	constructor(login, password){
		this.login = login;
		this.password = password;
	}
	send() {
		//make message
		let message = JSON.stringify(this);
		console.log('sending: '+message);
		//send message AJAX request
		let request= new XMLHttpRequest();
		
		request.open("GET", "LAMPAPI/login.php", true); //later change to IP address for serverside
		request.setRequestHeader("Content-type", "application/json");
		//request.addEventListener('load', () => initialize(request.response));
		//request.addEventListener('error', () => console.error('XHR error'));
		request.onreadystatechange = () => {
   			 if (request.readyState === 4) {
      				this.receive(request);
   			 }
  		}

		request.send(message);
		

	}

	receive(request) {
		let reply = JSON.parse(request.response);
		console.log(reply);
		console.log("received reply.");
		if(reply.error != "") {alert("Incorrect Username or Password");  return;}
		//redirect to main page on success
		alert("Success");

	
	}
}

const submitAction = function (){
	//do something with email.value and password.value
	console.log("submitting email and password");
	let request = new LoginRequest(document.getElementById("username").value, document.getElementById("password").value);
	request.send();
	
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
