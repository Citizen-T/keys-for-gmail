(function () {
    function isRefreshButton(target) {
        return matches(target, "ancestor::node()[@role='button' and @data-tooltip='Refresh']");
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
        }
    });
})();