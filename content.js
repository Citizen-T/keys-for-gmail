(function () {
    // Gmail
    //
    // A kind of "page object" that encapsulates some of the features of the Gmail app in easy to read and understand methods.
    function Gmail() {
        
    }

    Gmail.prototype = {
        _composeButton: undefined,
        _markAsReadButtons: [],

        get composeButton() {
            if (!this._composeButton)
                this._composeButton = document.evaluate("//*[@role='button' and text()='COMPOSE']", document, null, XPathResult.ANY_TYPE, null).iterateNext();
            return this._composeButton;
        },

        get composeEditorCloseButton() {
            return document.querySelector("img[src^='images/cleardot.gif'][data-tooltip='Save & Close']");
        },

        get composeEditorCcLink() {
            return document.evaluate("//span[@role='link' and text()='Cc']", document, null, XPathResult.ANY_TYPE, null).iterateNext();
        },

        get composeEditorBccLink() {
            return document.evaluate("//span[@role='link' and text()='Bcc']", document, null, XPathResult.ANY_TYPE, null).iterateNext();
        },

        get composeEditorSendButton() {
            return document.evaluate("//div[@role='button' and text()='Send']", document, null, XPathResult.ANY_TYPE, null).iterateNext();
        },
        
        get refreshButton() {
            return document.querySelector("[role='button'][data-tooltip='Refresh']");
        },

        get backToButton() {
            return document.querySelector("[role='button'][data-tooltip^='Back to ']");
        },

        get markAsReadButtons() {
            if (this._markAsReadButtons.length === 0) {
                let iter = document.evaluate("//div[@role='button' and div/text()='Mark as read']", document, null, XPathResult.ANY_TYPE, null);
                let result = iter.iterateNext();
                while (result) {
                    this._markAsReadButtons.push(result);
                    result = iter.iterateNext();
                }
            }
            return this._markAsReadButtons;
        },

        get selectAllCheckbox() {
            return document.querySelector("div[data-rowlist-toolbar='true'] span[role='checkbox']");
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
            return document.querySelector("a[href$='#inbox'][target='_top']");
        },

        get starredNavItem() {
            return document.querySelector("a[href$='#starred'][target='_top']");
        },

        get sentMailNavItem() {
            return document.querySelector("a[href$='#sent'][target='_top']");
        },

        get draftsNavItem() {
            return document.querySelector("a[href$='#drafts'][target='_top']");
        },

        get allMailNavItem() {
            return document.querySelector("a[href$='#all'][target='_top']");
        },

        get inboxSections() {
            return document.querySelectorAll("table div[role='tab'][aria-label]");
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
    function MutationChainFactory(gmail) {
        this._gmail = gmail;
    }

    MutationChainFactory.prototype.make = function () {
        let composeButton = new ComposeButtonHandler(this._gmail);
        let composeCloseButton = new ComposeEditorCloseButton(this._gmail, composeButton);
        let composeCcLink = new ComposeEditorCcLinkHandler(this._gmail, composeCloseButton);
        let composeBccLink = new ComposeEditorBccLinkHandler(this._gmail, composeCcLink);
        let composeSendButton = new ComposeSendButtonHandler(this._gmail, composeBccLink);
        let backToButton = new BackToButtonHandler(this._gmail, composeSendButton);
        let markAsReadButton = new MarkAsReadButtonHandler(this._gmail, backToButton);
        let selectAllCheckbox = new SelectAllCheckboxHandler(this._gmail, markAsReadButton);
        let inboxNavItem = new InboxNavItemHandler(this._gmail, selectAllCheckbox);
        let starredNavItem = new StarredNavItemHandler(this._gmail, inboxNavItem);
        let sentMailNavItem = new SentMailNavItemHandler(this._gmail, starredNavItem);
        let draftsNavItem = new DraftsNavItemHandler(this._gmail, sentMailNavItem);
        let allMailNavItem = new AllMailNavItemHandler(this._gmail, draftsNavItem);
        let selectUnstarredMenuItem = new SelectUnstarredMenuItemHandler(this._gmail, allMailNavItem);
        let selectStarredMenuItem = new SelectStarredMenuItemHandler(this._gmail, selectUnstarredMenuItem);
        let selectUnreadmenuItem = new SelectUnreadMenuItemHandler(this._gmail, selectStarredMenuItem);
        let selectReadMenuItem = new SelectReadMenuItemHandler(this._gmail, selectUnreadmenuItem);
        let selectNoneMenuItem = new SelectNoneMenuItemHandler(this._gmail, selectReadMenuItem);
        let selectAllMenuItem = new SelectAllMenuItemHandler(this._gmail, selectNoneMenuItem);
        let inboxSections = new InboxSectionHandler(this._gmail, selectAllMenuItem);
        let refreshButton = new RefreshButtonHandler(this._gmail, inboxSections);
        return new AlreadyListeningHandler(refreshButton);
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

    // ComposeButtonHandler
    //
    // Checks to see if the mutated element is the Compose button.  If it is, then a click listener is added to the button and the 
    // 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the handler 
    // chain.
    function ComposeButtonHandler(gmail) {
        ChainLink.call(this);
        this._gmail = gmail;
    }

    ComposeButtonHandler.prototype = Object.create(ChainLink.prototype);

    ComposeButtonHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.composeButton;
    }

    ComposeButtonHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "c" to compose a new message.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // ComposeEditorCloseButton
    //
    // Checks to see if the mutated element is the Compose Editor's close button.  If it is, then a click listener is added to the button and the 
    // 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the handler 
    // chain.
    function ComposeEditorCloseButton(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    ComposeEditorCloseButton.prototype = Object.create(ChainLink.prototype);

    ComposeEditorCloseButton.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.composeEditorCloseButton;
    }

    ComposeEditorCloseButton.prototype._handle = function (mutation) {
        // For some reason the 'click' event is not working for this element.  Trial and error has 
        // made me think that the 'mouseup' event is the next best option.
        mutation.target.addEventListener("mouseup", () => {
            alert('Try "ESC" to close the Compose Editor.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // ComposeEditorCcLinkHandler
    //
    // Checks to see if the mutated element is the Compose Editor's Cc link.  If it is, then a click listener is added to the link and the 
    // 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the handler 
    function ComposeEditorCcLinkHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    ComposeEditorCcLinkHandler.prototype = Object.create(ChainLink.prototype);

    ComposeEditorCcLinkHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.composeEditorCcLink;
    }

    ComposeEditorCcLinkHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "Cmd + Shift + c" to add a Cc recipient.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // ComposeEditorBccButtonHandler
    //
    // Checks to see if the mutated element is the Compose Editor's Bcc link.  If it is, then a click listener is added to the link and the 
    // 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the handler 
    function ComposeEditorBccLinkHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    ComposeEditorBccLinkHandler.prototype = Object.create(ChainLink.prototype);

    ComposeEditorBccLinkHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.composeEditorBccLink;
    }

    ComposeEditorBccLinkHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "Cmd + Shift + b" to add a Bcc recipient.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // ComposeSendButtonHandler
    //
    // Checks to see if the mutated element is the Compose Editor's send button.  If it is, then a click listener is added to the button and the 
    // 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the handler 
    // chain.
    function ComposeSendButtonHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    ComposeSendButtonHandler.prototype = Object.create(ChainLink.prototype);

    ComposeSendButtonHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.composeEditorSendButton;
    }

    ComposeSendButtonHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "Cmd + Enter" to send a message.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // BackToButtonHandler
    //
    // Checks to see if the mutated element is the Back To button.  If it is, then a click listener is added to the button and the 
    // 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the handler 
    // chain.
    function BackToButtonHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    BackToButtonHandler.prototype = Object.create(ChainLink.prototype);

    BackToButtonHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.backToButton;
    }

    BackToButtonHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "n" to go back to the thread list.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // RefreshButtonHandler
    //
    // Checks to see if the mutated element is the Refresh button.  If it is, then a click listener is added to the button and the 
    // 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the handler 
    // chain.
    function RefreshButtonHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    RefreshButtonHandler.prototype = Object.create(ChainLink.prototype);

    RefreshButtonHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.refreshButton;
    }

    RefreshButtonHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            if (this._gmail.isViewingInbox())
                alert('Try "g + i" to refresh your inbox.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // MarkAsReadButtonHandler
    // 
    // Checks to see if the mutated element is the Mark as Read button.  If it is, then a click listener is added to the button and the 
    // 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the handler 
    // chain.
    function MarkAsReadButtonHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    MarkAsReadButtonHandler.prototype = Object.create(ChainLink.prototype);

    MarkAsReadButtonHandler.prototype._canHandle = function (mutation) {
        return this._gmail.markAsReadButtons.includes(mutation.target);
    }

    MarkAsReadButtonHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "shift + i" to mark as read.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // SelectAllMenuItemHandler
    //
    // Checks to see if the mutated element is the Select All menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectAllMenuItemHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    SelectAllMenuItemHandler.prototype = Object.create(ChainLink.prototype);

    SelectAllMenuItemHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.selectAllMenuItem
    }

    SelectAllMenuItemHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "* + a" to select all.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }


    // SelectNoneMenuItemHandler
    //
    // Checks to see if the mutated element is the Select None menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectNoneMenuItemHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    SelectNoneMenuItemHandler.prototype = Object.create(ChainLink.prototype);

    SelectNoneMenuItemHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.selectNoneMenuItem;
    }

    SelectNoneMenuItemHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "* + n" to select none.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }


    // SelectReadMenuItemHandler
    // 
    // Checks to see if the mutated element is the Select Read menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectReadMenuItemHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    SelectReadMenuItemHandler.prototype = Object.create(ChainLink.prototype);

    SelectReadMenuItemHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.selectReadMenuItem;
    }

    SelectReadMenuItemHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "* + r" to select all read.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // SelectUnreadMenuItemHandler
    // 
    // Checks to see if the mutated element is the Select Unread menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectUnreadMenuItemHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    SelectUnreadMenuItemHandler.prototype = Object.create(ChainLink.prototype);

    SelectUnreadMenuItemHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.selectUnreadMenuItem;
    }

    SelectUnreadMenuItemHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "* + u" to select all unread.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // SelectStarredMenuItemHandler
    //
    // Checks to see if the mutated element is the Select Starred menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectStarredMenuItemHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    SelectStarredMenuItemHandler.prototype = Object.create(ChainLink.prototype);

    SelectStarredMenuItemHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.selectStarredMenuItem;
    }

    SelectStarredMenuItemHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "* + s" to select all starred.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // SelectUnstarredMenuItemHandler
    //
    // Checks to see if the mutated element is the Select Unstarred menu item.  If it is, then a click listener is added to the menu item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectUnstarredMenuItemHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    SelectUnstarredMenuItemHandler.prototype = Object.create(ChainLink.prototype);

    SelectUnstarredMenuItemHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.selectUnstarredMenuItem;
    }

    SelectUnstarredMenuItemHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "* + t" to select all unstarred.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // InboxNavItemHandler
    // 
    // Checks to see if the mutated element is the Inbox navigation item.  If it is, then a click listener is added to the navigation item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function InboxNavItemHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    InboxNavItemHandler.prototype = Object.create(ChainLink.prototype);

    InboxNavItemHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.inboxNavItem;
    }

    InboxNavItemHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "g + i" to go to inbox.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // StarredNavItemHandler
    //
    // Checks to see if the mutated element is the Starred navigation item.  If it is, then a click listener is added to the navigation item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function StarredNavItemHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    StarredNavItemHandler.prototype = Object.create(ChainLink.prototype);

    StarredNavItemHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.starredNavItem;
    }

    StarredNavItemHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "g + s" to go to Starred items.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // SentMailNavItemHandler
    //
    // Checks to see if the mutated element is the Sent Mail navigation item.  If it is, then a click listener is added to the navigation item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SentMailNavItemHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    SentMailNavItemHandler.prototype = Object.create(ChainLink.prototype);

    SentMailNavItemHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.sentMailNavItem;
    }

    SentMailNavItemHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "g + t" to go to Sent Mail.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // DraftsNavItemHandler
    //
    // Checks to see if the mutated element is the Drafts navigation item.  If it is, then a click listener is added to the navigation item 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function DraftsNavItemHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    DraftsNavItemHandler.prototype = Object.create(ChainLink.prototype);

    DraftsNavItemHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.draftsNavItem;
    }

    DraftsNavItemHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "g + d" to go to Drafts.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // AllMailNavItemHandler
    function AllMailNavItemHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    AllMailNavItemHandler.prototype = Object.create(ChainLink.prototype);

    AllMailNavItemHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.allMailNavItem;
    }

    AllMailNavItemHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "g + a" to go to All Mail.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // SelectAllCheckboxHandler
    //
    // Checks to see if the mutated element is the Select All checkbox.  If it is, then a click listener is added to the checkbox 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function SelectAllCheckboxHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    SelectAllCheckboxHandler.prototype = Object.create(ChainLink.prototype);

    SelectAllCheckboxHandler.prototype._canHandle = function (mutation) {
        return mutation.target === this._gmail.selectAllCheckbox;
    }

    SelectAllCheckboxHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", (event) => {
            if (mutation.target.getAttribute('aria-checked') === "true") {
                alert('Try "* + a" to select all.');
            } else {
                alert('Try "* + n" to select none.');
            }
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // InboxSectionHandler
    //
    // Checks to see if the mutated element is one of the inbox sections.  If it is, then a click listener is added to the section 
    // and the 'data-keys-is-listening' attribute is set accordingly.  Otherwise, the mutation is passed to the next link in the 
    // handler chain.
    function InboxSectionHandler(gmail, next) {
        ChainLink.call(this, next);
        this._gmail = gmail;
    }

    InboxSectionHandler.prototype = Object.create(ChainLink.prototype);

    InboxSectionHandler.prototype._canHandle = function (mutation) {
        for (let section of this._gmail.inboxSections) {
            if (mutation.target === section)
                return true;
        }
        return false;
    }

    InboxSectionHandler.prototype._handle = function (mutation) {
        mutation.target.addEventListener("click", () => {
            alert('Try "`" to cycle through inbox sections.');
        });
        mutation.target.setAttribute('data-keys-is-listening', true);
    }

    // main
    let gmail = new Gmail();
    let mutationChain = new MutationChainFactory(gmail).make();
    let observer = new MutationObserver((mutations) => {
        if (!gmail.isLoading())
            mutations.forEach((m) => mutationChain.handle(m));
    });
    observer.observe(document, { childList: true, subtree: true, attributes: true });
})();