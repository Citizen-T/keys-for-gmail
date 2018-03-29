(function () {
    let gmail = new Gmail();
    let mutationChain = new AlreadyListeningHandler(new RefreshButtonHandler(new SelectAllMenuItemHandler(new SelectNoneMenuItemHandler(new SelectReadMenuItemHandler(new SelectUnreadMenuItemHandler(new SelectStarredMenuItemHandler(new SelectUnstarredMenuItemHandler(new UnhandledMutationHandler()))))))));
    let observer = new MutationObserver((mutations) => {
        if (!gmail.isLoading())
            mutations.forEach((m) => mutationChain.handle(m));
    });
    observer.observe(document, { childList: true, subtree: true, attributes: true });


    function matches(target, xPath) {
        return document.evaluate(xPath, target, null, XPathResult.ANY_TYPE, null).iterateNext() !== null;
    }


    // Gmail
    //
    // A kind of "page object" that encapsulates some of the features of the Gmail app in easy to read and understand methods.
    function Gmail() {

    }

    Gmail.prototype.isLoading = function () {
        return document.querySelector("#loading[style='display: none;']") === null;
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
        if (!this._isRefreshButton(mutation.target)) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Refresh");
                if (this._isViewingInbox(window.location))
                    alert('Try "g + i" to refresh your inbox.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
    }

    RefreshButtonHandler.prototype._isRefreshButton = function (target) {
        return matches(target, "self::node()[@role='button' and @data-tooltip='Refresh']");
    }

    RefreshButtonHandler.prototype._isViewingInbox = function (location) {
        return location.hash === '#inbox';
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
        if (!this._isSelectAllButton(mutation.target)) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Select All");
                alert('Try "* + a" to select all.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
    }

    SelectAllMenuItemHandler.prototype._isSelectAllButton = function (target) {
        return matches(target, "self::node()[@selector='all' and @role='menuitem']");
    }


    // SelectNoneMenuItemHandler
    //
    // Checks to see if the mutated element is the Select None menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectNoneMenuItemHandler(next) {
        this.next = next;
    }

    SelectNoneMenuItemHandler.prototype.handle = function (mutation) {
        if (!this._isSelectNoneButton(mutation.target)) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Select None");
                alert('Try "* + n" to select none.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
    }

    SelectNoneMenuItemHandler.prototype._isSelectNoneButton = function (target) {
        return matches(target, "self::node()[@selector='none' and @role='menuitem']");
    }


    // SelectReadMenuItemHandler
    // 
    // Checks to see if the mutated element is the Select Read menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectReadMenuItemHandler(next) {
        this.next = next;
    }

    SelectReadMenuItemHandler.prototype.handle = function (mutation) {
        if (!this._isSelectReadMenuItem(mutation.target)) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Select Read");
                alert('Try "* + r" to select all read.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
    }

    SelectReadMenuItemHandler.prototype._isSelectReadMenuItem = function (target) {
        return matches(target, "self::node()[@selector='read' and @role='menuitem']");
    }


    // SelectUnreadMenuItemHandler
    // 
    // Checks to see if the mutated element is the Select Unread menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectUnreadMenuItemHandler(next) {
        this.next = next;
    }

    SelectUnreadMenuItemHandler.prototype.handle = function (mutation) {
        if (!this._isSelectUnreadMenuItem(mutation.target)) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Select Unread");
                alert('Try "* + u" to select all unread.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
    }

    SelectUnreadMenuItemHandler.prototype._isSelectUnreadMenuItem = function (target) {
        return matches(target, "self::node()[@selector='unread' and @role='menuitem']");
    }


    // SelectStarredMenuItemHandler
    //
    // Checks to see if the mutated element is the Select Starred menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectStarredMenuItemHandler(next) {
        this.next = next;
    }

    SelectStarredMenuItemHandler.prototype.handle = function (mutation) {
        if (!this._isSelectStarredMenuItem(mutation.target)) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Select Starred");
                alert('Try "* + s" to select all starred.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
    }

    SelectStarredMenuItemHandler.prototype._isSelectStarredMenuItem = function (target) {
        return matches(target, "self::node()[@selector='starred' and @role='menuitem']");
    }

    // SelectUnstarredMenuItemHandler
    //
    // Checks to see if the mutated element is the Select Unstarred menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectUnstarredMenuItemHandler(next) {
        this.next = next;
    }

    SelectUnstarredMenuItemHandler.prototype.handle = function (mutation) {
        if (!this._isSelectUnstarredMenuItem(mutation.target)) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Select Unstarred");
                alert('Try "* + t" to select all unstarred.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
    }

    SelectUnstarredMenuItemHandler.prototype._isSelectUnstarredMenuItem = function (target) {
        return matches(target, "self::node()[@selector='unstarred' and @role='menuitem']");
    }

    // UnhandledMutationHandler
    //
    // Final link in the mutation chain.  This link handles any mutations that are not handled by any other link along the way.  This is 
    // mostly a placeholder as we are currently handling these mutations by doing nothing.
    function UnhandledMutationHandler() {

    }

    UnhandledMutationHandler.prototype.handle = function (mutation) {
        
    }
})();