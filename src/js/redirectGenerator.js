	// window.addEventListener('domready', function() {
	var insertAtCursor = function( myField, myValue ) {
		//IE support
		if( document.selection ) {
			myField.focus();
			sel = document.selection.createRange();
			sel.text = myValue;
		}
		//MOZILLA/NETSCAPE support
		else if( myField.selectionStart || myField.selectionStart == '0' ) {
			var startPos = myField.selectionStart;
			var endPos = myField.selectionEnd;
			myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
			myField.selectionEnd = myField.selectionStart = startPos + myValue.length;
		} else {
			myField.value += myValue;
		}
	};

	var input = document.getElementById('tsv-input');
	var output = document.getElementById('rewrite-output');

	input.addEventListener('keydown', function( e ) {
		console.log(e.key);
		if( e.key.toLowerCase() === 'tab' ) {
			e.preventDefault();
			insertAtCursor(e.target, "\t");
		}
	});

	output.addEventListener('click', function( e ) {
		e.target.select();
	});
	// });