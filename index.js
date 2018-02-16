var validator_class = require("./bin/validator.js");
var validator = new validator_class();

validator.validate_url("https://linked.open.gent/parking")
	.then(result => {
		console.log(result);
	});