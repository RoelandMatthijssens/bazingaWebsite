window.ContentLoading = window.ContentLoading || {};

(function (scope, document) {

	var selector = '#content';
	var baseUrl = 'content';
	var extension = '.html';

	var cache = {};

	function identifierToUrl (identifier) {
		return baseUrl + '/' + identifier + extension;
	}

	function getContent (identifier, callback) {
		if ( cache[identifier] ) { return callback (cache[identifier]); }

		var req = new XMLHttpRequest ();

		req.onreadystatechange = function () {
			if ( req.readyState !== 4 || req.status !== 200 ) { return; }
			cache[identifier] = req.responseText;
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

	function setContentFromHash () {
		var identifier = location.hash.length > 1 ? location.hash.substr (1) : 'home';
		setContent (identifier);
	}

	function prefetchContent (identifiers) {
		identifiers.forEach (function (identifier) {
			getContent (identifier, function () {});
		});
	}

	function createReadystatechangeListener (identifiers, current) {
		return function listener () {
			if ( document.readyState !== 'interactive' ) { return; }

			if ( ! current ) { setContentFromHash (); }
			else { setContent (current); }

			prefetchContent (identifiers || []);
		}
	};

	function createNavigationListener () {
		return setContentFromHash;
	};

	scope.createReadystatechangeListener = createReadystatechangeListener;
	scope.createNavigationListener = createNavigationListener;
	scope.setContent = setContent;
}) (window.ContentLoading, document);
