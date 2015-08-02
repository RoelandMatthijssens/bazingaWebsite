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

	function setContent (identifier) {
		return getContent (identifier, function (content) {
			var container = document.querySelector (selector);
			container.innerHTML = content;
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
