/**
 * Traps the focus in an element allowing focus to only be on the element
 * and it's child elements.
 */
 var focusTrap = function(focusElement) {
 	// Add blur handler to focusElement and all child elements.  When blur
 	// event executes, check if the tab key was pressed (remember to check)
 	// for the shift key to move backwards).  If so, go to the next
 	// (or previous) eligible element.  If any other trigger occurred (
 	// click, hotkey, etc.), check if the focus target is an eligible
 	// element.  If so, allow the process to continue.  If not, leave the
 	// focus on the current element.

 	var isEnabled = true;
	var eligibleElements = []
	
	if(focusElement.tabIndex >= 0) {
		focusElement.addEventListener("keydown", keyDownEvent);
		eligibleElements.push(focusElement);
	}

	addEventsToChildren(focusElement);

	/**
	 * Adds the necessary events to the children of the specified parent
	 * element to ensure that focus stays within the appropriate element.
	 * @param {*} parentElement the element containing the children that
	 * are allowed to receive focus.
	 */
	function addEventsToChildren(parentElement) {

		for(var i = 0; i < parentElement.children.length; i++) {
			var childElement = parentElement.children[i];

			if(childElement.tabIndex >= 0) {
				childElement.addEventListener("keydown", keyDownEvent);
				eligibleElements.push(childElement);
			}

			if(childElement.childElementCount > 0) {
				addEventsToChildren(childElement);
			}
		}
	}

	/**
	 * Handles the keydown event for the elements of the parent element
	 * in which focus should stay.
	 * 
	 * @param {A} event the event object for the event
	 * @returns true if focus is established, false otherwise
	 */
	function keyDownEvent(event) {
		if(isEnabled == false || event.key != "Tab") {
			return;
		}

		var nextIndex;
		
		if(event.shiftKey) {
			nextIndex = eligibleElements.indexOf(event.currentTarget) - 1;
		}
		else {
			nextIndex = eligibleElements.indexOf(event.currentTarget) + 1;
		}

		if(nextIndex >= eligibleElements.length) {
			nextIndex = 0;
		} else if(nextIndex < 0) {
			nextIndex = eligibleElements.length - 1;
		}

		eligibleElements[nextIndex].focus();
		event.stopPropagation();
		event.cancelBubble = true;
		event.preventDefault();
	}
 	
	/**
	 * Disables the focus trap
	 */
 	function disable() {
 		isEnabled = false;
 	}
 	
	 /**
	  * Enables the focus trap
	  */
 	function enable() {
 		isEnabled = true;
 	}
 	
 	return {
 		disable: disable,
 		enable: enable
 	}
 }