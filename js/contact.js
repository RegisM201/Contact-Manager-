class LoginRequest {
	constructor(login, password){
		this.Login = login;
		this.Password = password;
	}
	send() {
		//make message
		let message = JSON.stringify(this);
		console.log('sending: '+message);
		//send message AJAX request
		let request= new XMLHttpRequest();
		
		request.open("POST", "http://147.182.163.107/LAMPAPI/login.php", true); //later change to IP address for serverside
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
		console.log(reply)
		if(reply.err == "No record in relation found") {
			document.getElementById("error").setAttribute("style","display:");  return;
		}
		document.getElementById("error").setAttribute("style","display:none");
			location.href = "contactList.html";
		//redirect to main page on success

	
	}
}

const submitAction = function (){
	//do something with email.value and password.value
	let request = new LoginRequest(document.getElementById("username").value, document.getElementById("password").value);
	request.send();
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
