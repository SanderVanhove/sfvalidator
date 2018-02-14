# sfvalidator

In-browser dataset validation.

### Juridisch
* Check license:
[Look for DCAT license](https://www.w3.org/TR/vocab-dcat/#Property:catalog_license)

### Technisch

* HTTP cache header analysis:
[AJAX request](https://stackoverflow.com/questions/220231/accessing-the-web-pages-http-headers-in-javascript), [check header.](https://stackoverflow.com/questions/22949870/how-to-detect-if-ajax-error-is-access-control-allow-origin-or-the-file-is-actual)
Check for `Cache-Control`, `ETag` HTTP headers.

* CORS detection:
[Is only in header if CORS is supported.](https://stackoverflow.com/questions/19325314/how-to-detect-cross-origin-cors-error-vs-other-types-of-errors-for-xmlhttpreq)
Detect `Access-Control-Allow-Origin` HTTP header.

```javascript
fetch("https://www.pietercolpaert.be").then(function(response){

	for (var pair of response.headers.entries()) {
		console.log(pair[0]+ ': '+ pair[1]);
	} 
    
});
```

### Syntactisch

* Check if RDF1.1:
[Parse with N3 and look for errors.](https://www.npmjs.com/package/n3#parsing)

### Semantisch

* Maximum use of standards

### Querying

* Fragmented data:
Check for hydra links and timestamps

* European DCAT-AP standard