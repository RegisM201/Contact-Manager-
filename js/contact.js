const contact_template = document.getElementById("contact_template");
const contact_list = document.getElementById("list");
contact_list.removeChild(contact_template);

class Connection {
	constructor(login, password){
		this.Login = login;
		this.Password = password;
		//check login valid
		let message = JSON.stringify(this);
		let request= new XMLHttpRequest();
		request.open("POST", "http://147.182.163.107/LAMPAPI/login.php", true); //later change to IP address for serverside
		request.setRequestHeader("Content-type", "application/json");
		request.onreadystatechange = () => {
   			 if (request.readyState === 4) {
				let reply = JSON.parse(request.response);
				if(reply.err == "No record in relation found") {
					this.logout();
				}
   			 }
  		}

		request.send(message);
	}
	sendDelete(contact) {
		this.id = contact.id;
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
		if (reply.hasOwnProperty("error")) {
			alert("Request Failed");
			this.logout();
		}
		this.sendRead();
	}

	sendContact(contact) {
		this.id = contact.id;
		this.firstName = contact.firstName;
		this.lastName = contact.lastName;
		this.email = contact.email;
		this.address = contact.address;
		this.phone =contact.phone;
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
			alert("Request Failed");
			this.logout();
		}
	}

	sendUpdate(contact) {
		this.id = contact.id;
		this.firstName = contact.firstName;
		this.lastName = contact.lastName;
		this.email = contact.email;
		this.address = contact.address;
		this.phone =contact.phone;
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
		if (reply.hasOwnProperty("error")) {
			alert("Request Failed");
			this.logout();
		}
		this.sendRead();
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
		if (reply.hasOwnProperty("error")) {
			alert("Request Failed");
			this.logout();
		}
		//reconstruct all modals, and append to contact_list, as visible
		contact_list.innerHTML = "";
		for (let i = 0; i < reply.length; i++) {
			let contact = new Contact(
				reply[i]["ID"],
				reply[i]["FirstName"],
				reply[i]["LastName"],
				reply[i]["Email"],
				reply[i]["Address"],
				reply[i]["PhoneNumber"]
			)
		let modal = new Modal("contact_" + i, contact);
		list.appendChild(modal.node);
		}
	}

	sendSearch(string) {
		//make message
		let message = JSON.stringify({"search" : string});
		console.log('sending: '+message);
		//send message AJAX request
		let request= new XMLHttpRequest();
		
		request.open("POST", "http://147.182.163.107/LAMPAPI/search.php", true); //later change to IP address for serverside
		request.setRequestHeader("Content-type", "application/json");
		request.onreadystatechange = () => {
   			 if (request.readyState === 4) {
      				this.receiveSearch(request);
   			 }
  		}

		request.send(message);
		

	}

	receiveSearch(request) {
		let reply = JSON.parse(request.response);
		if (reply.hasOwnProperty("error")) {
			alert("Request Failed");
			this.logout();
		}
		//reconstruct all modals, and append to contact_list, as visible
		contact_list.innerHTML = "";
		for (let i = 0; i < reply.length; i++) {
			let contact = new Contact(
				reply[i]["ID"],
				reply[i]["FirstName"],
				reply[i]["LastName"],
				reply[i]["Email"],
				reply[i]["Address"],
				reply[i]["PhoneNumber"]
			)
		let modal = new Modal("contact_" + i, contact);
		list.appendChild(modal.node);
		}
	}

	logout() {
		eraseCookie("username");
		eraseCookie("password");
		href = "login.html";
	}
}

//make request for contacts
let contacts = new Connection(getCookie("username"), getCookie("password"));
document.getElementById("logout").onclick = () => {contacts.logout();}
contacts.sendRead();
document.getElementById("add").onclick = () => {
	const modal = new Modal("", new Contact("","","","","",""));
	contact_list.appendChild(modal.node);
	modal.newContact();
}

class Contact {
	constructor(id, firstName, lastName, email, address, phone){
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.address = address
		this.phone = phone;
	}
}

class Modal {
	constructor(id, contact){
		this.contact = contact;
		this.node = contact_template.cloneNode(true);
		this.modal = this.node.querySelector("#myModal");
		this.node.setAttribute("id", id);
		this.view = this.node.querySelector("#view");
		this.span = this.node.querySelector("#span");

		this.acceptBtn = this.node.querySelector("#acceptBtn");
		this.deleteBtn = this.node.querySelector("#deleteBtn");
		this.editBtn = this.node.querySelector("#editBtn");

		this.resetContact();

		this.view.onclick = function() {
                  modal.style.display = "block";
                }
                
                // When the user clicks on <span> (x), close the modal
                this.close = () => {
                 	this.modal.style.display = "none";
                 	resetContact();
                }


                this.span.onclick = this.close;
                
                // When the user clicks anywhere outside of the modal, close it
                window.onclick = (event) => {
                	if (event.target == modal) {
                 		this.close();
                	}
                }

                this.editBtn.onclick = () =>{this.beginEdit();}
                this.deleteBtn.onclick = () => {contacts.sendDelete(this.contact.id); this.close();}
                this.acceptBtn.onclick = () => {this.confirmEdit(); contacts.sendUpdate(this.contact);}

	}
	resetContact() {
		this.node.querySelector("#firstName").value = this.contact.firstName;
		this.node.querySelector("#lastName").value = this.contact.lastName;
		this.node.querySelector("#email").value = this.contact.email;
		this.node.querySelector("#address").value = this.contact.address;
		this.node.querySelector("#phone").value = this.contact.phone;
		this.node.querySelector('#contact_name').innerHTML = this.contact.firstName + " " + this.contact.lastName;
	}

	beginEdit(){
		this.node.querySelector("#firstName").disabled = false;
		this.node.querySelector("#lastName").disabled = false;
		this.node.querySelector("#email").disabled = false;
		this.node.querySelector("#address").disabled = false;
		this.node.querySelector("#phone").disabled = false;
		this.editBtn.style.display = "none";
		this.deleteBtn.style.display = "none";
		this.acceptBtn.style.display = "block";
	}
	confirmEdit(){
		let update = new Contact(
				this.contact.id,
				this.node.querySelector("#firstName").value,
				this.node.querySelector("#lastName").value,
				this.node.querySelector("#email").value,
				this.node.querySelector("#address").value,
				this.node.querySelector("#phone").value
			);

		//send request, passing update
		this.contact = update;
		this.close();

	}
	newContact() {
		beginEdit();
		this.acceptBtn.onclick = () => {this.confirmEdit(); contacts.sendContact(this.contact);}

		 window.onclick = (event) => {
                	if (event.target == modal) {
                 		this.close();
                 		contact_list.removeChild(this.node);
                	}
                }
                this.span.onclick = () => {
                	this.close();
                 	contact_list.removeChild(this.node);
                }
	}
}

document.getElementById("Search").keyup = () => {

}


function ValidateEmail(mail) 
{
	if (/^(\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+)$|^$/.test(mail))
 	{
		 return (true)
	}
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

function eraseCookie(cname) {   
    document.cookie = cname+'=; Max-Age=-99999999;';  
}