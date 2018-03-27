(function () {
    let observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'attributes') {
                if (mutation.target.getAttribute('data-keys-is-listening'))
                    continue;
                if (isRefreshButton(mutation.target)) {
                    mutation.target.addEventListener("click", () => {
                        console.log("clicked: Refresh");
                        if (isViewingInbox(window.location))
                            alert('Try "g + i" to refresh your inbox.');
                    });
                    mutation.target.setAttribute('data-keys-is-listening', true);
                }
            }
        }
    })
    observer.observe(document, { childList: true, subtree: true, attributes: true });

    function isRefreshButton(target) {
        return matches(target, "self::node()[@role='button' and @data-tooltip='Refresh']");
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

    function isSelectUnreadButton(target) {
        return matches(target, "ancestor-or-self::node()[@selector='unread' and @role='menuitem']");
    }

    function isSelectStarredButton(target) {
        return matches(target, "ancestor-or-self::node()[@selector='starred' and @role='menuitem']");
    }

    function isSelectUnstarredButton(target) {
        return matches(target, "ancestor-or-self::node()[@selector='unstarred' and @role='menuitem']");
    }

    function matches(target, xPath) {
        return document.evaluate(xPath, target, null, XPathResult.ANY_TYPE, null).iterateNext() !== null;
    }

    function isViewingInbox(location) {
        return location.hash === '#inbox';
    }

    document.addEventListener("click", (event) => {
        if (isSelectAllButton(event.target)) {
            console.log("clicked: Select All");
            alert('Try "* + a" to select all.');
        } else if (isSelectNoneButton(event.target)) {
            console.log("clicked: Select None");
            alert('Try "* + n" to select none.');
        } else if (isSelectReadButton(event.target)) {
            console.log("clicked: Select Read");
            alert('Try "* + r" to select all read.');
        } else if (isSelectUnreadButton(event.target)) {
            console.log("clicked: Select Unread");
            alert('Try "* + u" to select all unread.');
        } else if (isSelectStarredButton(event.target)) {
            console.log("clicked: Select Starred");
            alert('Try "* + s" to select all starred.');
        } else if (isSelectUnstarredButton(event.target)) {
            console.log("clicked: Select Unstarred");
            alert('Try "* + t" to select all unstarred.');
        }
    });
})();