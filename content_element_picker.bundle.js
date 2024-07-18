(()=>{
    let e;
    var t, r;
    !function(e) {
        e[e.Id = 1] = "Id",
        e[e.Hierarchy = 2] = "Hierarchy",
        e[e.Attributes = 4] = "Attributes",
        e[e.Class = 8] = "Class",
        e[e.NthOfType = 16] = "NthOfType"
    }(t || (t = {})),
    function(e) {
        e[e.Id = 0] = "Id",
        e[e.Class = 1] = "Class",
        e[e.Attributes = 2] = "Attributes",
        e[e.NthOfType = 3] = "NthOfType"
    }(r || (r = {}));
    class s {
        constructor(e) {
            this.rules = [],
            this.tag = "",
            this.elem = e,
            this.hasId = !1
        }
        addRule(e) {
            e.type < r.Id || e.type > r.NthOfType ? console.log(`Unexpected selector: ${e.type}`) : Array.isArray(e.value) && 0 === e.value.length || (e.type === r.Id && (this.hasId = !0),
            this.rules.push(e))
        }
        addTag(e) {
            this.tag = e
        }
        size() {
            return this.rules.length
        }
        toString(e=31) {
            let s = this.tag + "";
            for (const n of this.rules)
                if ((e & t.Id || n.type !== r.Id) && (e & t.Class || n.type !== r.Class) && (e & t.Attributes || n.type !== r.Attributes) && (e & t.NthOfType || n.type !== r.NthOfType) && !(this.hasId && e & t.Id && n.type === r.Class))
                    switch (n.type) {
                    case r.Id:
                        s += "#" + n.value;
                        break;
                    case r.Class:
                        s += "." + n.value.join(".");
                        break;
                    case r.Attributes:
                        for (const e of n.value) {
                            const t = this.elem.getAttribute(e.attr);
                            let r = "*=";
                            e.attr === t ? r = "=" : e.attr.startsWith(t) && (r = "^="),
                            s += `[${e.attr}${r}"${e.value}"]`
                        }
                        break;
                    case r.NthOfType:
                        s += `:nth-of-type(${n.value})`
                    }
            return s
        }
    }
    const n = e=>{
        var t, n, l, i;
        const o = new s(e);
        e.id.length > 0 && o.addRule({
            type: r.Id,
            value: CSS.escape(e.id)
        }),
        e.classList.length > 0 && o.addRule({
            type: r.Class,
            value: Array.from(e.classList).map((e=>CSS.escape(e)))
        });
        const a = CSS.escape(e.localName);
        if (0 === o.size()) {
            const s = [];
            switch (a) {
            case "a":
                {
                    const r = null === (t = e.getAttribute("href")) || void 0 === t ? void 0 : t.trim().split(/[?#]/)[0];
                    void 0 !== r && r.length > 0 && s.push({
                        attr: "href",
                        value: r
                    });
                    break
                }
            case "iframe":
                {
                    const t = null === (n = e.getAttribute("src")) || void 0 === n ? void 0 : n.trim();
                    void 0 !== t && t.length > 0 && s.push({
                        attr: "src",
                        value: t.slice(0, 256)
                    });
                    break
                }
            case "img":
                {
                    let t = null === (l = e.getAttribute("src")) || void 0 === l ? void 0 : l.trim();
                    if (void 0 !== t && t.length > 0 && t.startsWith("data:") && (t = t.split(",")[1].slice(0, 256)),
                    void 0 === t || 0 === t.length) {
                        let t = null === (i = e.getAttribute("alt")) || void 0 === i ? void 0 : i.trim();
                        void 0 !== t && t.length > 0 && s.push({
                            attr: "alt",
                            value: t
                        })
                    } else
                        s.push({
                            attr: "src",
                            value: t
                        });
                    break
                }
            }
            s.length > 0 && o.addRule({
                type: r.Attributes,
                value: s
            })
        }
        const c = (e,t)=>{
            if (null !== e)
                try {
                    let r = e.querySelectorAll(t);
                    return Array.from(r)
                } catch (e) {}
            return []
        }
        ;
        if ((0 === o.size() || c(e.parentElement, o.toString()).length > 1) && (o.addTag(a),
        c(e.parentElement, o.toString()).length > 1)) {
            let t = 1
              , s = e.previousElementSibling;
            for (; null !== s; )
                s.localName === a && t++,
                s = s.previousElementSibling;
            o.addRule({
                type: r.NthOfType,
                value: t
            })
        }
        return o
    }
      , l = e=>{
        "Escape" === e.key && (e.stopPropagation(),
        e.preventDefault(),
        o())
    }
      , i = ()=>{
        u(c)
    }
      , o = ()=>{
        null !== e && document.documentElement.removeChild(e),
        document.removeEventListener("keydown", l, !0),
        document.removeEventListener("resize", i),
        document.removeEventListener("scroll", i)
    }
    ;
    let a = null
      , c = [];
    const u = e=>{
        c = e;
        const t = e.map((e=>(e=>{
            const t = e.getBoundingClientRect();
            return {
                x: t.left,
                y: t.top,
                width: t.right - t.left,
                height: t.bottom - t.top
            }
        }
        )(e)));
        chrome.runtime.sendMessage({
            type: "highlightElements",
            coords: t
        })
    }
    ;
    chrome.runtime.onMessage.addListener(((r,s,c)=>{
        switch ("string" == typeof r ? r : r.type) {
        case "elementPickerLaunch":
            (()=>{
                e = document.createElement("iframe"),
                e.src = chrome.runtime.getURL("elementPicker.html");
                const t = ["background: transparent", "border: 0", "border-radius: 0", "box-shadow: none", "color-scheme: light dark", "display: block", "height: 100%", "left: 0", "margin: 0", "max-height: none", "max-width: none", "opacity: 1", "outline: 0", "padding: 0", "pointer-events: auto", "position: fixed", "top: 0", "visibility: visible", "width: 100%", "z-index: 2147483647", ""].join(" !important;");
                e.style.cssText = t,
                document.documentElement.appendChild(e),
                document.addEventListener("keydown", l, !0),
                document.addEventListener("resize", i),
                document.addEventListener("scroll", i)
            }
            )();
            break;
        case "quitElementPicker":
            o();
            break;
        case "elementPickerHoverCoordsChanged":
            {
                const {coords: t} = r
                  , s = ((t,r)=>{
                    if (!e)
                        return null;
                    e.style.setProperty("pointer-events", "none", "important");
                    const s = document.elementFromPoint(t, r);
                    return e.style.setProperty("pointer-events", "auto", "important"),
                    s
                }
                )(t.x, t.y);
                null !== s && s instanceof HTMLElement && s !== a && (u([s]),
                a = s);
                break
            }
        case "elementPickerUserSelectedTarget":
            {
                const {specificity: e} = r;
                if (null !== a && a instanceof HTMLElement) {
                    const r = ((e,r)=>{
                        if (null === a)
                            return "";
                        let s = e;
                        const l = []
                          , i = [13, 29, 11, 19, 31][r];
                        if (i & t.Hierarchy)
                            for (; null !== s && s !== document.body; )
                                l.push(n(s)),
                                s = s.parentElement;
                        else
                            l.push(n(e));
                        let o = 0;
                        for (; o < l.length; o++) {
                            const e = l[o];
                            if (i & t.Id && e.hasId || 1 === document.querySelectorAll(e.toString(i)).length)
                                break
                        }
                        return l.slice(0, o + 1).reverse().map((e=>e.toString(i))).join(" > ")
                    }
                    )(a, e);
                    u(Array.from(document.querySelectorAll(r))),
                    c({
                        isValid: "" !== r,
                        selector: r.trim()
                    })
                }
                break
            }
        case "elementPickerUserModifiedRule":
            {
                const e = r.selector;
                e.length > 0 && u(Array.from(document.querySelectorAll(e)));
                break
            }
        case "elementPickerUserCreatedRule":
            chrome.runtime.sendMessage({
                type: "cosmeticFilterCreate",
                selector: r.selector
            }),
            o()
        }
    }
    ))
}
)();
