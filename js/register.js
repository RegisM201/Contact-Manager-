class RegisterRequest {
	constructor(login, password,firstName, lastName){
		this.Login = login;
		this.Password = password;
		this.FirstName = firstName;
		this.LastName = lastName;
	}
	send() {
		//make message
		let message = JSON.stringify(this);
		console.log('sending: '+message);
		//send message AJAX request
		let request= new XMLHttpRequest();
		
		request.open("POST", "http://147.182.163.107/LAMPAPI/register.php", true); //later change to IP address for serverside
		request.setRequestHeader("Content-type", "application/json");
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
		if(reply.error === "Record in relation found"){
			document.getElementById("error1").setAttribute("style","display:");
			return;
		}
		location.href="login.html";
	
	}
}

const submitAction = function (){
	if(document.getElementById("password").value === document.getElementById("password2").value==0) {
		document.getElementById("error2").setAttribute("style","display:"); return;
	}
	let request = new RegisterRequest(document.getElementById("username").value, document.getElementById("password").value,
		document.getElementById("firstName").value, document.getElementById("lastName").value);
	request.send();
}

document.getElementById("submitButton").onclick = submitAction;
