const detect_browser = require('detect-browser').detect();

if(detect_browser.name == "node"){
	var ldfetch = require("ldfetch");
	var fetch = require('node-fetch');
}else
	var ldfetch = window.ldfetch;

//Score.score can be 1 = passed, 0 = not checked, -1 = failed
class Score{
	constructor(score = 0, message = "Not checked"){
		this.score = score;
		this.message = message;
	}

	get passed(){
		return this.score > 0
	}
}

class Report{
	constructor(){
		this.accessable = {
			first_attempt: new Score(),
			seconde_attempt: new Score(),
			get commbined(){
				if(first_attempt.passed && seconde_attempt.passed)
					return new Score(1, "Page is accessable");
				else if(!first_attempt.passed && !seconde_attempt.passed)
					return new Score(-1, "Both attempts failed");
				else if(!first_attempt.passed)
					return new Score(-1, "First attempt failed");
				else if(!seconde_attempt.passed)
					return new Score(-1, "Seconde attempt failed");
			}
		};

		this.license = new Score();

		this.headers = {
			cache: new Score(),
			etag: new Score(),
			cors: new Score()
		}

		this.rdf = new Score();
		this.fragmented = new Score();
	}
}

class Validator{
	
	constructor(options = {}){
		this.options = options;
	}

	validate_url(url){
		this.report = new Report();
	
		return new Promise((fulfill) => {
			this.validate_headers(url)
				.then( result => { 
							this.validate_rdf(url)
								.then(result => { fulfill(this.report) });
						});
		});
		
	}

	validate_headers(url){
		return new Promise(fulfill => {
				fetch(url, this.options).then(response => {
						var headers_to_check_for = [{name: "Cache-Control", var: "cache"}, 
													{name: "ETag", var: "etag"}];

						for(var header of headers_to_check_for)
							this.check_header(header.name, header.var, response);

						//Check if we are in a browser, if so and the page loads we know that cors is set on the server because browser doesn't allow otherwise
						if(detect_browser.name != "node")
							this.report.headers.cors = new Score(1, "Page loaded, so assumed that CORS is supported");
						else
							this.check_header("Access-Control-Allow-Origin", "cors", response);

						this.report.accessable.first_attempt = new Score(1, "Page was accessable");
						fulfill(this.report);
					}).catch(error => {
						this.report.accessable.first_attempt = new Score(-1, error);
						fulfill(this.report);
					});
			});
	}

	check_header(header_name, header_id, response){
		if(response.headers.get(header_name)){
			this.report.headers[header_id] = new Score(1, response.headers.get(header_name));
		}else{
			this.report.headers[header_id] = new Score(-1, "Header not found");
		}
	}

	validate_rdf(url){
		return new Promise(fulfill => {(new ldfetch()).get(url).then(response => {
			this.report.rdf = new Score(1, "Parsed correctely");

			for (var triple in response.triples)
				if(triple.predicate == "http://purl.org/dc/terms/license")
					this.report.license = new Score(1, "One or more licenses found");
			if(!this.report.license.passed)
				this.report.license = new Score(-1, "No license found");

			this.report.accessable.seconde_attempt = new Score(1, "Page was accessable");
			fulfill(this.report);
		}).catch(error => {
			this.report.accessable.seconde_attempt = new Score(-1, error);
			fulfill(this.report);
		})});
	}
}

module.exports = Validator;