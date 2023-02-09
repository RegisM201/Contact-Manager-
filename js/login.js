const email = document.getElementById("email");
const password = document.getElementById("password");
const submitAction = function (){
	//do something with email.value and password.value
	console.log("submitting email and password");
	if (!ValidateEmail(email.value)) console.log("rejected.");
	//if fail, display fail somewhere in red text
}

function ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    alert("You have entered an invalid email address!")
    return (false)
}

document.getElementById("submitButton").onclick = submitAction;
