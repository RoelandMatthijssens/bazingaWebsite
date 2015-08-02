window.ContentLoading = window.ContentLoading || {};

(function (scope, document) {

	var selector = '#content';
	var baseUrl = 'content';
	var extension = '.html';

	function identifierToUrl (identifier) {
		return baseUrl + '/' + identifier + extension;
	}

	function getContent (identifier, callback) {
		var req = new XMLHttpRequest ();

		req.onreadystatechange = function () {
			if ( req.readyState !== 4 || req.status !== 200 ) { return; }
			callback (req.responseText);
		}

		req.open ('get', identifierToUrl (identifier));
		req.send ();
	}

	function reloadJavascript (node) {
		var scripts = node.querySelectorAll ('script');
		if ( ! scripts || scripts.length < 1 ) { return; }

		Array.prototype.forEach.call (scripts, function (script) {
			var nscript = document.createElement ('script');
			nscript.type = 'text/javascript';

			var content = script.text || script.textContent || script.innerHTML || "";
			try { nscript.appendChild (document.createTextNode (content)); }
			catch (e) { nscript.text = content; }

			script.parentNode.removeChild (script);
			node.appendChild (nscript);
		});
	}

	function setContent (identifier) {
		return getContent (identifier, function (content) {
			var container = document.querySelector (selector);
			container.innerHTML = content;
			reloadJavascript (container);
		});
	}


	function createReadystatechangeListener (prefetch) {
		return function listener () {
			if ( document.readyState !== 'interactive' ) { return; }
			setContent ('home');
		}
	};

	function navigationListener () {
	};

	scope.createReadystatechangeListener = createReadystatechangeListener;
	scope.setContent = setContent;
}) (window.ContentLoading, document);
