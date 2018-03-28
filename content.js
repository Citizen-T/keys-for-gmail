(function () {
    let loading = !isDoneLoading();
    let mutationChain = new AlreadyListeningHandler(new RefreshButtonHandler(new SelectAllMenuItemHandler(new UnhandledMutationHandler())));
    let observer = new MutationObserver((mutations) => {
        if (loading) {
            let l = !isDoneLoading();
            if (l === false) {
                loading = false;
                console.log("done loading!");
            }
        }
        if (!loading) {
            mutations.forEach((m) => mutationChain.handle(m));
        }
    });
    observer.observe(document, { childList: true, subtree: true, attributes: true });


    function isDoneLoading() {
        return document.querySelector("#loading[style='display: none;']") !== null;
    }

    // AlreadyListeningHandler
    //
    // Checks to see if the mutated element is already being watched for clicks.  If it is, then no further processing is needed 
    // if it is not, then the mutation is passed to the next link in the handler chain.
    function AlreadyListeningHandler(next) {
        this.next = next;
    }

    AlreadyListeningHandler.prototype.handle = function (mutation) {
        if (!mutation.target.getAttribute('data-keys-is-listening'))
            this.next.handle(mutation);
    }

    // RefreshButtonHandler
    //
    // Checks to see if the mutated element is the Refresh button.  If it is, then a click listener is added to the button and the 
    // 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the handler 
    // chain.
    function RefreshButtonHandler(next) {
        this.next = next;
    }

    RefreshButtonHandler.prototype.handle = function (mutation) {
        if (!isRefreshButton(mutation.target)) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Refresh");
                // if (isViewingInbox(window.location))
                //     alert('Try "g + i" to refresh your inbox.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
    }

    // SelectAllMenuItemHandler
    //
    // Checks to see if the mutated element is the Select All menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectAllMenuItemHandler(next) {
        this.next = next;
    }

    SelectAllMenuItemHandler.prototype.handle = function (mutation) {
        if (!isSelectAllButton(mutation.target)) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Select All");
                // alert('Try "* + a" to select all.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
    }


    // UnhandledMutationHandler
    //
    // Final link in the mutation chain.  This link handles any mutations that are not handled by any other link along the way.  This is 
    // mostly a placeholder as we are currently handling these mutations by doing nothing.
    function UnhandledMutationHandler() {

    }

    UnhandledMutationHandler.prototype.handle = function (mutation) {
        
    }








    function isRefreshButton(target) {
        return matches(target, "self::node()[@role='button' and @data-tooltip='Refresh']");
    }

    function isSelectAllButton(target) {
        return matches(target, "self::node()[@selector='all' and @role='menuitem']");
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
        if (isSelectNoneButton(event.target)) {
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