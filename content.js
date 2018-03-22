(function () {
    function isRefreshButton(target) {
        return matches(target, "ancestor::node()[@role='button' and @data-tooltip='Refresh']");
    }

    function isSelectAllButton(target) {
        return matches(target, "ancestor-or-self::node()[@selector='all' and @role='menuitem']");
    }

    function isSelectNoneButton(target) {
        return matches(target, "ancestor-or-self::node()[@selector='none' and @role='menuitem']");
    }

    function isSelectReadButton(target) {
        return matches(target, "ancestor-or-self::node()[@selector='read' and @role='menuitem']");
    }

    function matches(target, xPath) {
        return document.evaluate(xPath, target, null, XPathResult.ANY_TYPE, null).iterateNext() !== null;
    }

    function isViewingInbox(location) {
        return location.hash === '#inbox';
    }

    document.addEventListener("click", (event) => {
        if (isRefreshButton(event.target)) {
            console.log("clicked: Refresh");
            if (isViewingInbox(window.location))
                alert('Try "g + i" to refresh your inbox.');
        } else if (isSelectAllButton(event.target)) {
            console.log("clicked: Select All");
            alert('Try "* + a" to select all.');
        } else if (isSelectNoneButton(event.target)) {
            console.log("clicked: Select None");
            alert('Try "* + n" to select none.');
        } else if (isSelectReadButton(event.target)) {
            console.log("clicked: Select Read");
            alert('Try "* + r" to select all read.');
        }
    });
})();