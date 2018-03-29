(function () {
    // XPathLocator
    //
    // Object for checking DOM nodes against XPath statements.
    function XPathLocator(document, xPath) {
        this.document = document;
        this.xPath = xPath;
    }

    XPathLocator.prototype.matches = function (node) {
        return this.document.evaluate(this.xPath, node, null, XPathResult.ANY_TYPE, null).iterateNext() !== null;
    }


    // Gmail
    //
    // A kind of "page object" that encapsulates some of the features of the Gmail app in easy to read and understand methods.
    function Gmail() {

    }

    Gmail.prototype = {
        get refreshButton() {
            return document.querySelector("[role='button'][data-tooltip='Refresh']");
        },
        
        isLoading: function () {
            return document.querySelector("#loading[style='display: none;']") === null;
        },

        isViewingInbox: function () {
            return window.location.hash === '#inbox';
        }
    }

    // MutationChainFactory
    // 
    // Creates the mutation handler chain
    function MutationChainFactory() {

    }
    
    MutationChainFactory.prototype.make = function () {
        return new AlreadyListeningHandler(new RefreshButtonHandler(new SelectAllMenuItemHandler(new SelectNoneMenuItemHandler(new SelectReadMenuItemHandler(new SelectUnreadMenuItemHandler(new SelectStarredMenuItemHandler(new SelectUnstarredMenuItemHandler(new UnhandledMutationHandler()))))))));
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
        let gmail = new Gmail();
        if (mutation.target !== gmail.refreshButton) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Refresh");
                if (gmail.isViewingInbox())
                    alert('Try "g + i" to refresh your inbox.');
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
        this.locator = new XPathLocator(document, "self::node()[@selector='all' and @role='menuitem']");
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
        return this.locator.matches(target);
    }


    // SelectNoneMenuItemHandler
    //
    // Checks to see if the mutated element is the Select None menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectNoneMenuItemHandler(next) {
        this.next = next;
        this.locator = new XPathLocator(document, "self::node()[@selector='none' and @role='menuitem']");
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
        return this.locator.matches(target);
    }


    // SelectReadMenuItemHandler
    // 
    // Checks to see if the mutated element is the Select Read menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectReadMenuItemHandler(next) {
        this.next = next;
        this.locator = new XPathLocator(document, "self::node()[@selector='read' and @role='menuitem']");
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
        return this.locator.matches(target);
    }


    // SelectUnreadMenuItemHandler
    // 
    // Checks to see if the mutated element is the Select Unread menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectUnreadMenuItemHandler(next) {
        this.next = next;
        this.locator = new XPathLocator(document, "self::node()[@selector='unread' and @role='menuitem']");
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
        return this.locator.matches(target);
    }


    // SelectStarredMenuItemHandler
    //
    // Checks to see if the mutated element is the Select Starred menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectStarredMenuItemHandler(next) {
        this.next = next;
        this.locator = new XPathLocator(document, "self::node()[@selector='starred' and @role='menuitem']");
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
        return this.locator.matches(target);
    }

    // SelectUnstarredMenuItemHandler
    //
    // Checks to see if the mutated element is the Select Unstarred menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectUnstarredMenuItemHandler(next) {
        this.next = next;
        this.locator = new XPathLocator(document, "self::node()[@selector='unstarred' and @role='menuitem']");
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
        return this.locator.matches(target);
    }

    // UnhandledMutationHandler
    //
    // Final link in the mutation chain.  This link handles any mutations that are not handled by any other link along the way.  This is 
    // mostly a placeholder as we are currently handling these mutations by doing nothing.
    function UnhandledMutationHandler() {

    }

    UnhandledMutationHandler.prototype.handle = function (mutation) {
        
    }

    // main
    let gmail = new Gmail();
    let mutationChain = new MutationChainFactory().make();
    let observer = new MutationObserver((mutations) => {
        if (!gmail.isLoading())
            mutations.forEach((m) => mutationChain.handle(m));
    });
    observer.observe(document, { childList: true, subtree: true, attributes: true });
})();