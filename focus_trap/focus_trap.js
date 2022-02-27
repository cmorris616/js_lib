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
	
	focusElement.addEventListener("blur", blurEvent);
	eligibleElements.push(focusElement);

	addEventsToChildren(focusElement);

	function addEventsToChildren(parentElement) {

		for(var i = 0; i < parentElement.children.length; i++) {
			var childElement = parentElement.children[i];

			childElement.addEventListener("blur", blurEvent);
			eligibleElements.push(childElement);

			if(childElement.childElementCount > 0) {
				addEventsToChildren(childElement);
			}
		}
	}
 	
 	function blurEvent(event) {
 		console.info('Going from ' + event.currentTarget.id + ' to ' + event.relatedTarget.id);
		 curIndex = eligibleElements.indexOf(event.currentTarget) + 1;

		 if(curIndex >= eligibleElements.length) {
			 curIndex = 0;
		 }

		 eligibleElements[curIndex].focus();
		 event.stopPropagation();

 		console.info('Updated - Going from ' + event.currentTarget.id + ' to ' + eligibleElements[curIndex].id);
 	}
 	
 	function disable() {
 		isEnabled = false;
 	}
 	
 	function enable() {
 		isEnabled = true;
 	}
 	
 	return {
 		disable: disable,
 		enable: enable
 	}
 }