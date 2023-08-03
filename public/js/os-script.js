
fetch("db.json")
.then(function(response){
	return response.json('os');
})
.then(function(db){
	let placeholder = document.querySelector("#os-output");
	let out = "";
	for(let os of db){
		out += `
			<tr>
				<td>${os.osname}</td>
				<td>${os.type}</td>
			</tr>
		`;
	}

	placeholder.innerHTML = out;
});