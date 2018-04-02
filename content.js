(function () {
    // Gmail
    //
    // A kind of "page object" that encapsulates some of the features of the Gmail app in easy to read and understand methods.
    function Gmail() {

    }

    Gmail.prototype = {
        get refreshButton() {
            return document.querySelector("[role='button'][data-tooltip='Refresh']");
        },

        get selectAllMenuItem() {
            return document.querySelector("[selector='all'][role='menuitem']");
        },

        get selectNoneMenuItem() {
            return document.querySelector("[selector='none'][role='menuitem']");
        },

        get selectReadMenuItem() {
            return document.querySelector("[selector='read'][role='menuitem']");
        },

        get selectUnreadMenuItem() {
            return document.querySelector("[selector='unread'][role='menuitem']");
        },

        get selectStarredMenuItem() {
            return document.querySelector("[selector='starred'][role='menuitem']");
        },

        get selectUnstarredMenuItem() {
            return document.querySelector("[selector='unstarred'][role='menuitem']");
        },

        get inboxNavItem() {
            return document.querySelector("a[href$='#inbox'][title='Inbox']");
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
        return new AlreadyListeningHandler(new RefreshButtonHandler(new SelectAllMenuItemHandler(new SelectNoneMenuItemHandler(new SelectReadMenuItemHandler(new SelectUnreadMenuItemHandler(new SelectStarredMenuItemHandler(new SelectUnstarredMenuItemHandler(new InboxNavItemHandler(new UnhandledMutationHandler())))))))));
    }

    // ChainLink
    //
    // Abstraction for a single link in the Chain of Responsibility for DOM mutations.  To add a new link to the chain extend this 
    // object by overriding _canHandle() and _handle().
    //
    // next
    //   The next ChainLink in this Chain of Responsibility
    function ChainLink(next) {
        this._next = next;
    }

    ChainLink.prototype = {
        _next: undefined,

        handle: function (mutation) {
            if (this._canHandle(mutation)) {
                this._handle(mutation);
            } else {
                if (this._next)
                    this._next.handle(mutation);
            }
        },

        _canHandle: function (mutation) {
            return true;
        },

        _handle: function (mutation) {

        }
    }

    // AlreadyListeningHandler
    //
    // Checks to see if the mutated element is already being watched for clicks.  If it is, then no further processing is needed 
    // if it is not, then the mutation is passed to the next link in the handler chain.
    function AlreadyListeningHandler(next) {
        ChainLink.call(this, next);
    }

    AlreadyListeningHandler.prototype = Object.create(ChainLink.prototype);

    AlreadyListeningHandler.prototype._canHandle = function (mutation) {
        return mutation.target.getAttribute('data-keys-is-listening');
    }

    AlreadyListeningHandler.prototype._handle = function (mutation) {
        // no-op to break the chain of responsibility
    }

    // RefreshButtonHandler
    //
    // Checks to see if the mutated element is the Refresh button.  If it is, then a click listener is added to the button and the 
    // 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the handler 
    // chain.
    function RefreshButtonHandler(next) {
        ChainLink.call(this, next);
    }

    RefreshButtonHandler.prototype = Object.create(ChainLink.prototype);

    RefreshButtonHandler.prototype._canHandle = function (mutation) {
        let gmail = new Gmail();
        return mutation.target === gmail.refreshButton;
    }

    RefreshButtonHandler.prototype._handle = function (mutation) {
        let gmail = new Gmail();
        mutation.target.addEventListener("click", () => {
            console.log("clicked: Refresh");
            if (gmail.isViewingInbox())
                alert('Try "g + i" to refresh your inbox.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
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
        let gmail = new Gmail();
        if (mutation.target !== gmail.selectAllMenuItem) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Select All");
                alert('Try "* + a" to select all.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
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
        let gmail = new Gmail();
        if (mutation.target !== gmail.selectNoneMenuItem) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Select None");
                alert('Try "* + n" to select none.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
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
        let gmail = new Gmail();
        if (mutation.target !== gmail.selectReadMenuItem) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Select Read");
                alert('Try "* + r" to select all read.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
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
        let gmail = new Gmail();
        if (mutation.target !== gmail.selectUnreadMenuItem) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Select Unread");
                alert('Try "* + u" to select all unread.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
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
        let gmail = new Gmail();
        if (mutation.target !== gmail.selectStarredMenuItem) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Select Starred");
                alert('Try "* + s" to select all starred.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
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
        let gmail = new Gmail();
        if (mutation.target !== gmail.selectUnstarredMenuItem) {
            this.next.handle(mutation);
        } else {
            mutation.target.addEventListener("click", () => {
                console.log("clicked: Select Unstarred");
                alert('Try "* + t" to select all unstarred.');
            });
            mutation.target.setAttribute('data-keys-is-listening', true);
        }
    }

    // InboxNavItemHandler
    // 
    // Checks to see if the mutated element is the Inbox navigation item.  If it is, then a click listener is added to the navigation item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function InboxNavItemHandler(next) {
        this.next = next;
    }

    InboxNavItemHandler.prototype = {
        handle: function (mutation) {
            let gmail = new Gmail();
            if (mutation.target !== gmail.inboxNavItem) {
                this.next.handle(mutation);
            } else {
                mutation.target.addEventListener("click", () => {
                    console.log("clicked: Inbox Nav Item");
                    alert('Try "g + i" to go to inbox.');
                });
                mutation.target.setAttribute('data-keys-is-listening', true);
            }
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

    // main
    let gmail = new Gmail();
    let mutationChain = new MutationChainFactory().make();
    let observer = new MutationObserver((mutations) => {
        if (!gmail.isLoading())
            mutations.forEach((m) => mutationChain.handle(m));
    });
    observer.observe(document, { childList: true, subtree: true, attributes: true });
})();