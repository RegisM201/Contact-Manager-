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
		if (request.response) {
			let reply = JSON.parse(request.response);
			if (reply.hasOwnProperty("error")) {
			alert("Request Failed");
			this.logout();
			}
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
		if (request.response) {
			let reply = JSON.parse(request.response);
			if (reply.hasOwnProperty("error")) {
                                if(reply.error === 2) {
                                        //display error and try again
                                        alert("Invalid Contact: Has No First Name");
                                        return;
                                }
                                alert("Request Failed");
                                this.logout();
			}
		}
                initConfetti();
		this.sendRead();
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
		if (request.response) {
			let reply = JSON.parse(request.response);
			if (reply.hasOwnProperty("error")) {
                                 if(reply.error === 2) {
                                        //display error and try again
                                        alert("Invalid Contact: Has No First Name");
                                        return;
                                }
        			alert("Request Failed");
        			this.logout();
			}
		}
                initConfetti();
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
				reply[i][0],
				reply[i][2],
				reply[i][3],
				reply[i][5],
				reply[i][4],
				reply[i][6]
			)
		let modal = new Modal("contact_" + i, contact);
		list.appendChild(modal.node);
		}
	}

	sendSearch(string) {
		//make message
		this.search = string;
		let message = JSON.stringify(this);
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
				reply[i][0],
				reply[i][2],
				reply[i][3],
				reply[i][5],
				reply[i][4],
				reply[i][6]
			)
		let modal = new Modal("contact_" + i, contact);
		list.appendChild(modal.node);
		}
	}

	logout() {
		eraseCookie("username");
		eraseCookie("password");
		location.href = "login.html";
	}
}

//make request for contacts
let contacts = new Connection(getCookie("username"), getCookie("password"));
document.getElementById("logout").onclick = () => {contacts.logout();}
contacts.sendRead();
document.getElementById("add").onclick = () => {
	const modal = new Modal("", new Contact("","","","","",""));
	contact_list.appendChild(modal.node);
	modal.modal.style.display = "block";
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
		this.contact = Object.assign({},contact);
		this.node = contact_template.cloneNode(true);
		this.modal = this.node.querySelector("#myModal");
		this.node.setAttribute("id", id);
		this.view = this.node.querySelector("#view");
		this.span = this.node.querySelector("span");

		this.acceptBtn = this.node.querySelector("#acceptBtn");
		this.deleteBtn = this.node.querySelector("#deleteBtn");
		this.editBtn = this.node.querySelector("#editBtn");

		this.resetContact();

		this.view.onclick = () => {
          		this.modal.style.display = "block";
                }
                
                // When the user clicks on <span> (x), close the modal
                this.close = () => {
                 	this.modal.style.display = "none";
                 	this.resetContact();
                }


                this.span.onclick = this.close;
                
                // When the user clicks anywhere outside of the modal, close it
                window.onclick = (event) => {
                	if (event.target == this.modal) {
                 		this.close();
                	}
                }

                this.editBtn.onclick = () =>{this.beginEdit();}
                this.deleteBtn.onclick = () => {contacts.sendDelete(this.contact); this.close();}
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
		this.beginEdit();
		this.acceptBtn.onclick = () => {this.confirmEdit(); contacts.sendContact(this.contact);}

		 window.onclick = (event) => {
                	if (event.target == this.modal) {
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

const searchbar = document.getElementById("Search");
searchbar.addEventListener("keyup",() => {
	contacts.sendSearch(searchbar.value);
});


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

//-----------Var Inits--------------
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
cx = ctx.canvas.width / 2;
cy = ctx.canvas.height / 2;

image = new Image(64, 64);
image.src = 'favicon.ico';


let confetti = [];
const confettiCount = 300;
const gravity = 0.3;
const terminalVelocity = 5;
const drag = 0.175;


//-----------Functions--------------
resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cx = ctx.canvas.width / 2;
  cy = ctx.canvas.height / 2;
};

randomRange = (min, max) => Math.random() * (max - min) + min;

initConfetti = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      //color: colors[Math.floor(randomRange(0, colors.length))],
      dimensions: {
        x: randomRange(16, 32),
        y: randomRange(16, 32) },

      position: {
        x: randomRange(0, canvas.width),
        y: canvas.height - 1 },

      rotation: randomRange(0, 2 * Math.PI),
      scale: {
        x: 1,
        y: 1 },

      velocity: {
        x: randomRange(-25, 25),
        y: randomRange(0, -50) } });


  }
};

//---------Render-----------
render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((confetto, index) => {
    let width = confetto.dimensions.x * confetto.scale.x;
    let height = confetto.dimensions.y * confetto.scale.y;

    // Move canvas to position and rotate
    ctx.translate(confetto.position.x, confetto.position.y);
    ctx.rotate(confetto.rotation);

    // Apply forces to velocity
    confetto.velocity.x -= confetto.velocity.x * drag;
    confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
    confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

    // Set position
    confetto.position.x += confetto.velocity.x;
    confetto.position.y += confetto.velocity.y;

    // Delete confetti when out of frame
    if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

    // Loop confetto x position
    if (confetto.position.x > canvas.width) confetto.position.x = 0;
    if (confetto.position.x < 0) confetto.position.x = canvas.width;

    // Spin confetto by scaling y
    confetto.scale.y = Math.cos(confetto.position.y * 0.1);
    //ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

    // Draw confetti
    ctx.drawImage(image, -width / 2, -height / 2, width, height);

    // Reset transform matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });

  // Fire off another round of confetti
 // if (confetti.length <= 10) initConfetti();

  window.requestAnimationFrame(render);
};

//---------Execution--------
render();