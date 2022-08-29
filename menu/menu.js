/**
 * Creates a popup menu from a list element.
 * 
 * Each list item (<li>) should contain an anchor tag pointing to the page to
 * which the menu item send the user.
 * 
 * The menu.css file is used for styling the menu.
 * 
 * This file adds an event listener to the body element to hide the menu.
 * 
 * @param {Object} params The parameters for the menu creation.
 * 
 * The parameters used to create the menu must include the list element
 * (item_list) representing the menu.
 * 
 * Other options parameters are the trigger_element and the relative_location.
 * 
 * The trigger element is the element that, when clicked, will show the menu
 * if it is not visible and will hide the menu if it is visible.
 * 
 * The relative_location is the location relative to the trigger element
 * where the menu will be displayed.  Valid values for the relative location
 * are 'bottomleft' and 'bottomright'.  Both will show the menu at the bottom
 * of the trigger element.
 * 
 * The 'bottomright' will align the right side of the menu with the right side
 * of the trigger element.
 * 
 * The 'bottomleft' will align the left side of the menu with the left side
 * of the trigger element.
 * 
 * In order to add a divider, simply have a list item at the desired lcoation
 * with a hyphen (-).
 * 
 * Below is an example.
 * 
 * <script>
 * 
 *   menu = menu({
 *     "item_list": menuList,
 *     "trigger_element": menu_button,
 *     "relative_location": "bottomright"
 *   });
 * 
 * </script>
 * 
 * <body>
 *   <div id="page_header" class="page_header">
 *     <div style="display:inline-block; vertical-align: middle;">
 *       <h1>Modal Dialog Test</h1>
 *     </div>
 *     <div id="menu_button" class="navbar">
 *       <div></div>
 *       <div></div>
 *       <div></div>
 *     </div>
 *   </div>
 * 
 *   <ul id="menu_list">
 *     <li><a href="/homepage.html"><div>Home</div></a></li>
 *     <li><a href="/page1.html"><div>Page 1</div></a></li>
 *     <li>-</li>
 *     <li><a href="/logout.html"><div>Logout</div></a></li>
 *   </ul>
 * </body>
 *
 */
var menu = function(params) {

    var RELATIVE_LOCATION_BOTTOM_LEFT = "bottomleft";
    var RELATIVE_LOCATION_BOTTOM_RIGHT = "bottomright";

    var item_list = params["item_list"];
    var trigger_element = params["trigger_element"];
    var relative_location = params["relative_location"]

    if(relative_location == null) {
        relative_location = RELATIVE_LOCATION_BOTTOM_LEFT;
    }

    item_list.setAttribute("class", "menu");

    for(var i = 0; i < item_list.children.length; i++) {
        var item = item_list.children[i];

        if(item.innerText == "-") {
            item.innerHTML = "<hr/>";
            item.addEventListener("mouseover", function(event) { event.currentTarget.style.backgroundColor = ""; })
        }
    }

    if(trigger_element != null) {
        trigger_element.onclick = toggleMenu;

        item_list.style.display = "block";

        if(relative_location == RELATIVE_LOCATION_BOTTOM_LEFT) {
            item_list.style.left = trigger_element.offsetLeft;
            item_list.style.top = trigger_element.style.top + trigger_element.offsetHeight;
        }
        else {
            item_list.style.left = (trigger_element.offsetLeft - item_list.offsetWidth) + trigger_element.offsetWidth;
            item_list.style.top = trigger_element.style.top + trigger_element.offsetHeight;
        }

        item_list.style.display = "none";
    }

    document.body.onclick = function(event) {
        if(event.target == trigger_element) {
            return;
        }

        hide();
    }

    /**
     * Hides the menu
     */
    function hide() {
        item_list.style.display = "none";
    }

    /**
     * Determines whether or not the menu is visible.
     * 
     * @returns true if the menu is visible, false otherwise
     */
    function isVisible() {
        return item_list.style.display == "block";
    }

    /**
     * Displays the menu
     */
    function show() {
        if(trigger_element == null) {
            item_list.style.left = "0px";
        }

        item_list.style.display = "block"
    }

    /**
     * Toggles the menu to display if it is hidden and to hide if it is
     * displayed
     */
    function toggleMenu() {
        if(isVisible()) {
            hide();
        } else {
            show();
        }
    }

    return {
        hide: hide,
        isVisible: isVisible,
        show: show,
        toggleMenu: toggleMenu
    }
}