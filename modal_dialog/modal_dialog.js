/*
TODO list:
- Add event handlers/callbacks
- Add Default and Cancel key functionality
- Add styling capability (classes, most likely)
- The user can still tab to controls behind the blocker pane
*/

/**
 * Creates a modal dialog with the specified content as well as a title and
 * buttons.  The title of the dialog is set to the 'title' attribute of the
 * provided content element.
 *
 * There is a 'dialog' tag in HTML now, but there is insufficient support
 * across the browsers at the time of this writing.
 *
 * @param {Object} params An object containing the parameters for the dialog.
 *
 * The params object can take the below form (The content element is the
 * only required property):
 *
 * {
 *		"contentElement": {HTML element to be the content of the dialog},
 *      "buttons": [
 *    	{
 *       	"text": "OK",
 *				"default": true,
 *          "cancel": false,
 *          "click": {callback function}	
 *       },
 *    	{
 *       	"text": "Cancel",
 *				"default": false,
 *          "cancel": true,
 *          "click": {callback function}	
 *       }
 *    ]
 * }
 *
 * If no buttons are provided, a single 'OK' button will be added and will
 * close this dialog when clicked.
 *
 * @author Charles Morris
 */
var modalDialog = function(params) {
	
	var BASE_Z_INDEX = 10000;	
	var BORDER_RADIUS = 10;
	var BUTTON_TEXT_PROPERTY = "text";
	var BUTTON_CLICK_PROPERTY = "click";
	var BUTTON_DEFAULT_PROPERTY = "default";
	var BUTTON_CANCEL_PROPERTY = "cancel";
	
	if(!params.hasOwnProperty("buttons")) {
		params["buttons"] = [];
	}
	
	var trapFocus = params.trapFocus == true
	
	var contentElement = params.contentElement;
	var defaultButton;
	var cancelButton;
	
	var blockerPane = document.createElement("div");
	var dialogElement = document.createElement("div");
	
	setupDialogElement();

	if(trapFocus) {
		focusTrap(dialogElement);
	}
	
	setBlockerPaneStyles();
	setDialogElementStyles();
	
	document.body.appendChild(blockerPane);
	document.body.appendChild(dialogElement);
	
	if(defaultButton != null) {
		defaultButton.focus();	
	}
	
	/**
	 * Closes this dialog.  The dialog is hidden, but not removed from the DOM.
	 */
	function close() {
		blockerPane.style.display = "none";
		dialogElement.style.display = "none";
	}
	
	/**
	 * Displays this dialog.
	 */
	function open() {
		blockerPane.style.display = "block";
		dialogElement.style.display = "inline-block";
		
		dialogElement.style.left = (blockerPane.clientWidth / 2) - (dialogElement.clientWidth / 2);
		dialogElement.style.top = (blockerPane.clientHeight / 2) - (dialogElement.clientHeight / 2);

		focusFirstElement(contentElement);
	}

	/**
	 * Sets focus on the first focusable element that is a child of the specified parent element. 
	 * @param {Element} parentElement the element containing potentially focusable elements
	 */
	function focusFirstElement(parentElement) {

		for(var i = 0; i < parentElement.children.length; i++) {
			var elem = parentElement.children[i];

			if(elem.tabIndex >= 0) {
				elem.focus();
				return true;
			}
			else {
				if(elem.childElementCount > 0) {
					return focusFirstElement(elem);
				}
			}
		}

		return false;
	}
	
	/**
	 * Sets the styles for the blocker pane.  The blocker pane is the element
	 * that is displayed over the existing page and below the dialog causing
	 * the dialog to be modal.
	 */
	function setBlockerPaneStyles() {
		var bpStyle = blockerPane.style;
	
		bpStyle.position = "absolute";
		bpStyle.left = 0;
		bpStyle.top = 0;
		bpStyle.right = 0;
		bpStyle.bottom = 0;
		bpStyle.opacity = 0.6;
		bpStyle.display = "none";
		bpStyle.backgroundColor = "black";
		bpStyle.zIndex = BASE_Z_INDEX;
	}
	
	/**
	 * Sets the styles for the button container in the dialog.
	 */
	function setButtonContainerStyles(buttonContainer) {
		var bcStyle = buttonContainer.style;
		
		bcStyle.textAlign = "right";
		bcStyle.padding = "7px";
		bcStyle.position = "relative";
		bcStyle.bottom = "0px";
		bcStyle.left = "0px";
		bcStyle.right = "0px";
		bcStyle.borderTopStyle = "solid";
		bcStyle.borderTopWidth = "1px";
		bcStyle.borderTopColor = "lightgray";
	}

	/**
	 * Sets the styles for the buttons in the control area of the dialog
	 *
	 * @param {Element} buttonElement The button element to be styled.
	 */	
	function setButtonStyles(buttonElement) {
		var btStyle = buttonElement.style;
		
		btStyle.borderRadius = "6px";
		btStyle.padding = "4px";
		btStyle.fontSize = "11px";
		btStyle.marginLeft = "4px";
		btStyle.marginRight = "4px";
	}
	
	/**
	 * Sets the styles for the content portion of this dialog.
	 *
	 * @param {Element} dialogContentElement The element that houses the
	 * content for this dialog.
	 */
	function setContentStyles(dialogContentElement) {
		var dcStyle = dialogContentElement.style;
		
		dcStyle.padding = "7px";
	}
	
	/**
	 * Sets the styles for this modal dialog.
	 */
	function setDialogElementStyles() {
		var deStyle = dialogElement.style;
		
		deStyle.backgroundColor = "white";
		deStyle.borderStyle = "solid";
		deStyle.borderRadius = BORDER_RADIUS + "px";
		deStyle.borderWidth = "1px";
		deStyle.display = "none";
		deStyle.position = "absolute";
		deStyle.zIndex = BASE_Z_INDEX + 1;
		deStyle.minWidth = "250px";
		deStyle.minHeight = "150px";
	}
	
	/**
	 * Sets the styles for the title portion of this modal dialog.
	 */
	function setTitleStyles(titleDiv) {
		var titleStyle = titleDiv.style;
		
		titleStyle.backgroundImage = "linear-gradient(gray, lightgray, gray)";
		titleStyle.padding = "7px";
		titleStyle.fontWeight = "bold";
		titleStyle.fontSize = "24px";
		titleStyle.borderTopLeftRadius = BORDER_RADIUS + "px";
		titleStyle.borderTopRightRadius = BORDER_RADIUS + "px";
	}
	
	/**
	 * Creates the necessary elements to populate this dialog and adds them to
	 * the dialog.
	 */
	function setupDialogElement() {
		var newDiv;
		var newButton;
		
		newDiv = document.createElement("div");
		newDiv.innerText = contentElement.getAttribute("title");
		setTitleStyles(newDiv);
		dialogElement.appendChild(newDiv);
		
		newDiv = document.createElement("div");
		contentElement.parentElement.removeChild(contentElement);
		newDiv.appendChild(contentElement);
		setContentStyles(newDiv);
		dialogElement.appendChild(newDiv);
		
		newDiv = document.createElement("div");
		
		var buttons = params.buttons;
		
		if(buttons.length == 0) {
			newButton = document.createElement("button");
			newButton.innerText = "OK";
			newButton.addEventListener("click", close);
			setButtonStyles(newButton);
			newDiv.appendChild(newButton);
		}
		else {
			var buttonParam;
			
			for(var i = 0; i < buttons.length; i++) {
				buttonParam = buttons[i];
				newButton = document.createElement("button");
				newButton.innerText =
					buttonParam[BUTTON_TEXT_PROPERTY] == null ? "" : buttonParam[BUTTON_TEXT_PROPERTY];
				
				if(buttonParam.hasOwnProperty(BUTTON_CLICK_PROPERTY)) {
					newButton.addEventListener("click", buttonParam.click)
				}
				
				if((buttonParam.hasOwnProperty(BUTTON_DEFAULT_PROPERTY) &&
					buttonParam[BUTTON_DEFAULT_PROPERTY] == true) || defaultButton == null) {
						defaultButton = newButton;
				}
				
				if(buttonParam.hasOwnProperty(BUTTON_CANCEL_PROPERTY) &&
					buttonParam[BUTTON_CANCEL_PROPERTY] == true) {
						cancelButton = newButton;
				}
				
				setButtonStyles(newButton);
				newDiv.appendChild(newButton);
			}
		}
		
		setButtonContainerStyles(newDiv);
		dialogElement.appendChild(newDiv);
	
		dialogElement.addEventListener("keyup", function(event) {
			if(event.code == "Enter" && defaultButton != null) {
				defaultButton.click();
				event.preventDefault();
			}
			else if(event.code == "Escape" && cancelButton != null) {
				cancelButton.click();
				event.preventDefault();
			}
		});
	}
		
	return {
		close: close,
		open: open
	}
}