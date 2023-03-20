const contact_template = document.getElementById("contact_template");
const contact_list = document.getElementById("list");
contact_list.removeChild(contact_template);


//make request for contacts
let contacts = new Connection(getCookie("username"), getCookie("password"));

class Connection {
	constructor(login, password){
		this.Login = login;
		this.Password = password;
	}
	sendDelete() {
		//make message
		let message = JSON.stringify(this);
		console.log('sending: '+message);
		//send message AJAX request
		let request= new XMLHttpRequest();
		
		request.open("POST", "http://147.182.163.107/LAMPAPI/delete.php", true); //later change to IP address for serverside
		request.setRequestHeader("Content-type", "application/json");
		request.onreadystatechange = () => {
   			 if (request.readyState === 4) {
      				this.receiveDelete(request);
   			 }
  		}

		request.send(message);
		

	}


	receiveDelete(request) {
		let reply = JSON.parse(request.response);
		
		//redirect to main page on success

	
	}
	sendContact(contact) {
		//make message
		let message = JSON.stringify(this);
		console.log('sending: '+message);
		//send message AJAX request
		let request= new XMLHttpRequest();
		
		request.open("POST", "http://147.182.163.107/LAMPAPI/new-contact.php", true); //later change to IP address for serverside
		request.setRequestHeader("Content-type", "application/json");
		request.onreadystatechange = () => {
   			 if (request.readyState === 4) {
      				this.receiveContact(request);
   			 }
  		}

		request.send(message);
		

	}


	receiveContact(request) {
		let reply = JSON.parse(request.response);
		if (reply.hasOwnProperty("error")) {

		}
		//redirect to main page on success

	
	}
	sendUpdate(contact) {
		//make message
		let message = JSON.stringify(this);
		console.log('sending: '+message);
		//send message AJAX request
		let request= new XMLHttpRequest();
		
		request.open("POST", "http://147.182.163.107/LAMPAPI/update-contact.php", true); //later change to IP address for serverside
		request.setRequestHeader("Content-type", "application/json");
		request.onreadystatechange = () => {
   			 if (request.readyState === 4) {
      				this.receiveUpdate(request);
   			 }
  		}

		request.send(message);
		

	}


	receiveUpdate(request) {
		let reply = JSON.parse(request.response);
		
		//redirect to main page on success

	
	}
	sendRead() {
		//make message
		let message = JSON.stringify(this);
		console.log('sending: '+message);
		//send message AJAX request
		let request= new XMLHttpRequest();
		
		request.open("POST", "http://147.182.163.107/LAMPAPI/read.php", true); //later change to IP address for serverside
		request.setRequestHeader("Content-type", "application/json");
		request.onreadystatechange = () => {
   			 if (request.readyState === 4) {
      				this.receiveRead(request);
   			 }
  		}

		request.send(message);
		

	}


	receiveRead(request) {
		let reply = JSON.parse(request.response);
		
		//redirect to main page on success

	
	}
}

class Contact {
	constructor(firstName, lastName, email, phone){
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phone = phone;
		this.date = new Date();
	}
}

class Modal {
	constructor(id, contact){
		this.node = contact_template.cloneNode(true);
		let modal = this.node.querySelector("#myModal");
		this.node.setAttribute("id", id);
		let view = this.node.querySelector("#view");
		let span = this.node.querySelector("span")

		this.node.querySelector('#contact_name').innerHTML = contact.firstName + " " + contact.lastName;

		this.node.querySelector("#firstName").value = contact.firstName;
		this.node.querySelector("#lastName").value = contact.lastName;
		this.node.querySelector("#email").value = contact.email;
		this.node.querySelector("#phone").value = contact.phone;
		this.node.querySelector("#date").valueAsDate = contact.date;

		view.onclick = function() {
                  modal.style.display = "block";
                }
                
                // When the user clicks on <span> (x), close the modal
                span.onclick = function() {
                 	modal.style.display = "none";
                }
                
                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function(event) {
                	if (event.target == modal) {
                 		modal.style.display = "none";
                	}
                }
	}

	beginEdit(){
		this.node.querySelector("#firstName").disabled = false;
		this.node.querySelector("#lastName").disabled = false;
		this.node.querySelector("#email").disabled = false;
		this.node.querySelector("#phone").disabled = false;
		this.node.querySelector("#date").disabled = false;
	}
	confirmEdit(){
		let update = new Contact(
			this.node.querySelector("#firstName").value,
			this.node.querySelector("#lastName").value,
			this.node.querySelector("#email").value,
			this.node.querySelector("#phone").value
			);

		this.node.querySelector("#firstName").disabled = true;
		this.node.querySelector("#lastName").disabled = true;
		this.node.querySelector("#email").disabled = true;
		this.node.querySelector("#phone").disabled = true;
		this.node.querySelector("#date").disabled = true;
	}
}



const readAction = function (){

}

const searchAction = function (){

}

const deleteAction = function (){

}

const createAction = function () {

}

const editAction = function () {

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

function setCookie(cname, cvalue, exdays, path="/") {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path="+path;
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


/*
PseudoCode goes like so:
grab cookie and post to get contacts
load contacts to modalList using cloneNode and appendNode
Interface each of these modals using some generic functionalities. for CRUD,
*/