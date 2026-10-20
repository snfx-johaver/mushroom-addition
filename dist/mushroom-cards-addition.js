const yt = globalThis, jt = yt.ShadowRoot && (yt.ShadyCSS === void 0 || yt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Bt = /* @__PURE__ */ Symbol(), po = /* @__PURE__ */ new WeakMap();
let qo = class {
  constructor(t, o, a) {
    if (this._$cssResult$ = !0, a !== Bt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = o;
  }
  get styleSheet() {
    let t = this.o;
    const o = this.t;
    if (jt && t === void 0) {
      const a = o !== void 0 && o.length === 1;
      a && (t = po.get(o)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), a && po.set(o, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ra = (e) => new qo(typeof e == "string" ? e : e + "", void 0, Bt), Le = (e, ...t) => {
  const o = e.length === 1 ? e[0] : t.reduce((a, r, n) => a + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new qo(o, e, Bt);
}, Fa = (e, t) => {
  if (jt) e.adoptedStyleSheets = t.map((o) => o instanceof CSSStyleSheet ? o : o.styleSheet);
  else for (const o of t) {
    const a = document.createElement("style"), r = yt.litNonce;
    r !== void 0 && a.setAttribute("nonce", r), a.textContent = o.cssText, e.appendChild(a);
  }
}, ho = jt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let o = "";
  for (const a of t.cssRules) o += a.cssText;
  return Ra(o);
})(e) : e;
const { is: ja, defineProperty: Ba, getOwnPropertyDescriptor: Ha, getOwnPropertyNames: Wa, getOwnPropertySymbols: Ga, getPrototypeOf: Ua } = Object, xt = globalThis, go = xt.trustedTypes, qa = go ? go.emptyScript : "", Ka = xt.reactiveElementPolyfillSupport, et = (e, t) => e, ft = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? qa : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let o = e;
  switch (t) {
    case Boolean:
      o = e !== null;
      break;
    case Number:
      o = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        o = JSON.parse(e);
      } catch {
        o = null;
      }
  }
  return o;
} }, Ht = (e, t) => !ja(e, t), yo = { attribute: !0, type: String, converter: ft, reflect: !1, useDefault: !1, hasChanged: Ht };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), xt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let je = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, o = yo) {
    if (o.state && (o.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((o = Object.create(o)).wrapped = !0), this.elementProperties.set(t, o), !o.noAccessor) {
      const a = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(t, a, o);
      r !== void 0 && Ba(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, o, a) {
    const { get: r, set: n } = Ha(this.prototype, t) ?? { get() {
      return this[o];
    }, set(i) {
      this[o] = i;
    } };
    return { get: r, set(i) {
      const l = r?.call(this);
      n?.call(this, i), this.requestUpdate(t, l, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? yo;
  }
  static _$Ei() {
    if (this.hasOwnProperty(et("elementProperties"))) return;
    const t = Ua(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(et("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(et("properties"))) {
      const o = this.properties, a = [...Wa(o), ...Ga(o)];
      for (const r of a) this.createProperty(r, o[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const o = litPropertyMetadata.get(t);
      if (o !== void 0) for (const [a, r] of o) this.elementProperties.set(a, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [o, a] of this.elementProperties) {
      const r = this._$Eu(o, a);
      r !== void 0 && this._$Eh.set(r, o);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const o = [];
    if (Array.isArray(t)) {
      const a = new Set(t.flat(1 / 0).reverse());
      for (const r of a) o.unshift(ho(r));
    } else t !== void 0 && o.push(ho(t));
    return o;
  }
  static _$Eu(t, o) {
    const a = o.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), o = this.constructor.elementProperties;
    for (const a of o.keys()) this.hasOwnProperty(a) && (t.set(a, this[a]), delete this[a]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Fa(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, o, a) {
    this._$AK(t, a);
  }
  _$ET(t, o) {
    const a = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, a);
    if (r !== void 0 && a.reflect === !0) {
      const n = (a.converter?.toAttribute !== void 0 ? a.converter : ft).toAttribute(o, a.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, o) {
    const a = this.constructor, r = a._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = a.getPropertyOptions(r), i = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : ft;
      this._$Em = r;
      const l = i.fromAttribute(o, n.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, o, a, r = !1, n) {
    if (t !== void 0) {
      const i = this.constructor;
      if (r === !1 && (n = this[t]), a ??= i.getPropertyOptions(t), !((a.hasChanged ?? Ht)(n, o) || a.useDefault && a.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(i._$Eu(t, a)))) return;
      this.C(t, o, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, o, { useDefault: a, reflect: r, wrapped: n }, i) {
    a && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, i ?? o ?? this[t]), n !== !0 || i !== void 0) || (this._$AL.has(t) || (this.hasUpdated || a || (o = void 0), this._$AL.set(t, o)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (o) {
      Promise.reject(o);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [r, n] of a) {
        const { wrapped: i } = n, l = this[r];
        i !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, n, l);
      }
    }
    let t = !1;
    const o = this._$AL;
    try {
      t = this.shouldUpdate(o), t ? (this.willUpdate(o), this._$EO?.forEach((a) => a.hostUpdate?.()), this.update(o)) : this._$EM();
    } catch (a) {
      throw t = !1, this._$EM(), a;
    }
    t && this._$AE(o);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((o) => o.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((o) => this._$ET(o, this[o])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
je.elementStyles = [], je.shadowRootOptions = { mode: "open" }, je[et("elementProperties")] = /* @__PURE__ */ new Map(), je[et("finalized")] = /* @__PURE__ */ new Map(), Ka?.({ ReactiveElement: je }), (xt.reactiveElementVersions ??= []).push("2.1.2");
const Wt = globalThis, bo = (e) => e, vt = Wt.trustedTypes, fo = vt ? vt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Ko = "$lit$", ke = `lit$${Math.random().toFixed(9).slice(2)}$`, Yo = "?" + ke, Ya = `<${Yo}>`, Ne = document, nt = () => Ne.createComment(""), it = (e) => e === null || typeof e != "object" && typeof e != "function", Gt = Array.isArray, Xa = (e) => Gt(e) || typeof e?.[Symbol.iterator] == "function", Et = `[ 	
\f\r]`, Ye = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, vo = /-->/g, wo = />/g, Ee = RegExp(`>|${Et}(?:([^\\s"'>=/]+)(${Et}*=${Et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), $o = /'/g, xo = /"/g, Xo = /^(?:script|style|textarea|title)$/i, Jo = (e) => (t, ...o) => ({ _$litType$: e, strings: t, values: o }), c = Jo(1), q = Jo(2), We = /* @__PURE__ */ Symbol.for("lit-noChange"), m = /* @__PURE__ */ Symbol.for("lit-nothing"), So = /* @__PURE__ */ new WeakMap(), De = Ne.createTreeWalker(Ne, 129);
function Zo(e, t) {
  if (!Gt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return fo !== void 0 ? fo.createHTML(t) : t;
}
const Ja = (e, t) => {
  const o = e.length - 1, a = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", i = Ye;
  for (let l = 0; l < o; l++) {
    const s = e[l];
    let d, u, _ = -1, h = 0;
    for (; h < s.length && (i.lastIndex = h, u = i.exec(s), u !== null); ) h = i.lastIndex, i === Ye ? u[1] === "!--" ? i = vo : u[1] !== void 0 ? i = wo : u[2] !== void 0 ? (Xo.test(u[2]) && (r = RegExp("</" + u[2], "g")), i = Ee) : u[3] !== void 0 && (i = Ee) : i === Ee ? u[0] === ">" ? (i = r ?? Ye, _ = -1) : u[1] === void 0 ? _ = -2 : (_ = i.lastIndex - u[2].length, d = u[1], i = u[3] === void 0 ? Ee : u[3] === '"' ? xo : $o) : i === xo || i === $o ? i = Ee : i === vo || i === wo ? i = Ye : (i = Ee, r = void 0);
    const p = i === Ee && e[l + 1].startsWith("/>") ? " " : "";
    n += i === Ye ? s + Ya : _ >= 0 ? (a.push(d), s.slice(0, _) + Ko + s.slice(_) + ke + p) : s + ke + (_ === -2 ? l : p);
  }
  return [Zo(e, n + (e[o] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), a];
};
class st {
  constructor({ strings: t, _$litType$: o }, a) {
    let r;
    this.parts = [];
    let n = 0, i = 0;
    const l = t.length - 1, s = this.parts, [d, u] = Ja(t, o);
    if (this.el = st.createElement(d, a), De.currentNode = this.el.content, o === 2 || o === 3) {
      const _ = this.el.content.firstChild;
      _.replaceWith(..._.childNodes);
    }
    for (; (r = De.nextNode()) !== null && s.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const _ of r.getAttributeNames()) if (_.endsWith(Ko)) {
          const h = u[i++], p = r.getAttribute(_).split(ke), y = /([.?@])?(.*)/.exec(h);
          s.push({ type: 1, index: n, name: y[2], strings: p, ctor: y[1] === "." ? Qa : y[1] === "?" ? er : y[1] === "@" ? tr : St }), r.removeAttribute(_);
        } else _.startsWith(ke) && (s.push({ type: 6, index: n }), r.removeAttribute(_));
        if (Xo.test(r.tagName)) {
          const _ = r.textContent.split(ke), h = _.length - 1;
          if (h > 0) {
            r.textContent = vt ? vt.emptyScript : "";
            for (let p = 0; p < h; p++) r.append(_[p], nt()), De.nextNode(), s.push({ type: 2, index: ++n });
            r.append(_[h], nt());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Yo) s.push({ type: 2, index: n });
      else {
        let _ = -1;
        for (; (_ = r.data.indexOf(ke, _ + 1)) !== -1; ) s.push({ type: 7, index: n }), _ += ke.length - 1;
      }
      n++;
    }
  }
  static createElement(t, o) {
    const a = Ne.createElement("template");
    return a.innerHTML = t, a;
  }
}
function Ge(e, t, o = e, a) {
  if (t === We) return t;
  let r = a !== void 0 ? o._$Co?.[a] : o._$Cl;
  const n = it(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, o, a)), a !== void 0 ? (o._$Co ??= [])[a] = r : o._$Cl = r), r !== void 0 && (t = Ge(e, r._$AS(e, t.values), r, a)), t;
}
class Za {
  constructor(t, o) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = o;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: o }, parts: a } = this._$AD, r = (t?.creationScope ?? Ne).importNode(o, !0);
    De.currentNode = r;
    let n = De.nextNode(), i = 0, l = 0, s = a[0];
    for (; s !== void 0; ) {
      if (i === s.index) {
        let d;
        s.type === 2 ? d = new ut(n, n.nextSibling, this, t) : s.type === 1 ? d = new s.ctor(n, s.name, s.strings, this, t) : s.type === 6 && (d = new or(n, this, t)), this._$AV.push(d), s = a[++l];
      }
      i !== s?.index && (n = De.nextNode(), i++);
    }
    return De.currentNode = Ne, r;
  }
  p(t) {
    let o = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(t, a, o), o += a.strings.length - 2) : a._$AI(t[o])), o++;
  }
}
class ut {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, o, a, r) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = t, this._$AB = o, this._$AM = a, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const o = this._$AM;
    return o !== void 0 && t?.nodeType === 11 && (t = o.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, o = this) {
    t = Ge(this, t, o), it(t) ? t === m || t == null || t === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : t !== this._$AH && t !== We && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Xa(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== m && it(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Ne.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: o, _$litType$: a } = t, r = typeof a == "number" ? this._$AC(t) : (a.el === void 0 && (a.el = st.createElement(Zo(a.h, a.h[0]), this.options)), a);
    if (this._$AH?._$AD === r) this._$AH.p(o);
    else {
      const n = new Za(r, this), i = n.u(this.options);
      n.p(o), this.T(i), this._$AH = n;
    }
  }
  _$AC(t) {
    let o = So.get(t.strings);
    return o === void 0 && So.set(t.strings, o = new st(t)), o;
  }
  k(t) {
    Gt(this._$AH) || (this._$AH = [], this._$AR());
    const o = this._$AH;
    let a, r = 0;
    for (const n of t) r === o.length ? o.push(a = new ut(this.O(nt()), this.O(nt()), this, this.options)) : a = o[r], a._$AI(n), r++;
    r < o.length && (this._$AR(a && a._$AB.nextSibling, r), o.length = r);
  }
  _$AR(t = this._$AA.nextSibling, o) {
    for (this._$AP?.(!1, !0, o); t !== this._$AB; ) {
      const a = bo(t).nextSibling;
      bo(t).remove(), t = a;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class St {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, o, a, r, n) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = t, this.name = o, this._$AM = r, this.options = n, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = m;
  }
  _$AI(t, o = this, a, r) {
    const n = this.strings;
    let i = !1;
    if (n === void 0) t = Ge(this, t, o, 0), i = !it(t) || t !== this._$AH && t !== We, i && (this._$AH = t);
    else {
      const l = t;
      let s, d;
      for (t = n[0], s = 0; s < n.length - 1; s++) d = Ge(this, l[a + s], o, s), d === We && (d = this._$AH[s]), i ||= !it(d) || d !== this._$AH[s], d === m ? t = m : t !== m && (t += (d ?? "") + n[s + 1]), this._$AH[s] = d;
    }
    i && !r && this.j(t);
  }
  j(t) {
    t === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Qa extends St {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === m ? void 0 : t;
  }
}
class er extends St {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== m);
  }
}
class tr extends St {
  constructor(t, o, a, r, n) {
    super(t, o, a, r, n), this.type = 5;
  }
  _$AI(t, o = this) {
    if ((t = Ge(this, t, o, 0) ?? m) === We) return;
    const a = this._$AH, r = t === m && a !== m || t.capture !== a.capture || t.once !== a.once || t.passive !== a.passive, n = t !== m && (a === m || r);
    r && this.element.removeEventListener(this.name, this, a), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class or {
  constructor(t, o, a) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = o, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Ge(this, t);
  }
}
const ar = Wt.litHtmlPolyfillSupport;
ar?.(st, ut), (Wt.litHtmlVersions ??= []).push("3.3.3");
const rr = (e, t, o) => {
  const a = o?.renderBefore ?? t;
  let r = a._$litPart$;
  if (r === void 0) {
    const n = o?.renderBefore ?? null;
    a._$litPart$ = r = new ut(t.insertBefore(nt(), n), n, void 0, o ?? {});
  }
  return r._$AI(e), r;
};
const Ut = globalThis;
let be = class extends je {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const o = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = rr(o, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return We;
  }
};
be._$litElement$ = !0, be.finalized = !0, Ut.litElementHydrateSupport?.({ LitElement: be });
const nr = Ut.litElementPolyfillSupport;
nr?.({ LitElement: be });
(Ut.litElementVersions ??= []).push("4.2.2");
const Qo = (e) => (t, o) => {
  o !== void 0 ? o.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const ir = { attribute: !0, type: String, converter: ft, reflect: !1, hasChanged: Ht }, sr = (e = ir, t, o) => {
  const { kind: a, metadata: r } = o;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), a === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(o.name, e), a === "accessor") {
    const { name: i } = o;
    return { set(l) {
      const s = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(i, s, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(i, void 0, e, l), l;
    } };
  }
  if (a === "setter") {
    const { name: i } = o;
    return function(l) {
      const s = this[i];
      t.call(this, l), this.requestUpdate(i, s, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function ue(e) {
  return (t, o) => typeof o == "object" ? sr(e, t, o) : ((a, r, n) => {
    const i = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, a), i ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, o);
}
function oe(e) {
  return ue({ ...e, state: !0, attribute: !1 });
}
const lr = [
  "battery",
  "media_player",
  "room",
  "scenes",
  "welcome_scenes"
], cr = [
  "trash",
  "alarm_time",
  "roomview",
  "room_overview",
  "welcome",
  "washer",
  "sun",
  "input_datetime",
  "weather_metrics",
  "media_player_sonos",
  "printer",
  "nas_metrics",
  "tablet",
  "playstation",
  "scenes",
  "plant",
  "speedtest_gauges",
  "pollen"
], ko = (e) => e.split("_").filter((t) => t.toLowerCase() !== "ulm").map((t) => ["nas", "mdi", "dwd", "vnc", "wifi", "http"].includes(t.toLowerCase()) ? t.toUpperCase() : `${t[0].toUpperCase()}${t.slice(1)}`).join(" "), dr = (e) => e === "custom_card_alarm_time" ? "alarm-time" : /alarm|alert|lock/.test(e) ? "security" : /navigate|back/.test(e) ? "navigation" : /battery/.test(e) ? "battery" : /power_outlet|more_power_outlet/.test(e) ? "control" : /energy|power|gauge|speedtest|graph|apex|myenedis/.test(e) ? "energy" : /weather|sun|pollen|moon/.test(e) ? "weather" : /scene/.test(e) ? "scene" : /person|tracker|tracer|presence|room|welcome/.test(e) ? "presence" : /media|playstation/.test(e) ? "media" : /thermostat|heat_pump|aircondition|temperature|simple_temp/.test(e) ? "climate" : /cover|door|garage/.test(e) ? "cover" : /vacuum/.test(e) ? "vacuum" : /light/.test(e) ? "light" : /fan|outlet|boolean|script|washer|water_heater|qubino/.test(e) ? "control" : /input_number|input_datetime/.test(e) ? "sensor" : /title|subtitle|clock|date/.test(e) ? "text" : /camera/.test(e) ? "camera" : /sensor|elapsed|update|printer|nas|tablet|flower|car|afval|waste|counter/.test(e) ? "sensor" : "entity", ur = {
  card_media_player: ["default", "controls", "artwork"],
  card_room: ["default", "with-sensors"],
  card_scenes: ["list", "welcome"]
}, mr = (e, t) => e === "custom_card_alarm_time" ? ["input_boolean"] : /alarm/.test(e) ? ["alarm_control_panel"] : /lock/.test(e) ? ["lock"] : /power_outlet|more_power_outlet/.test(e) ? ["switch", "light"] : e.includes("binary_sensor") ? ["binary_sensor"] : e.includes("battery") ? ["sensor"] : e.includes("input_boolean") ? ["input_boolean"] : e.includes("input_number") ? ["input_number", "counter", "select", "input_select"] : e.includes("input_datetime") ? ["input_datetime"] : e.includes("light") ? ["light"] : /media|playstation/.test(e) ? ["media_player", "sensor"] : /thermostat|heat_pump|aircondition/.test(e) ? ["climate"] : /scene/.test(e) ? ["scene"] : /script/.test(e) ? ["script"] : /vacuum/.test(e) ? ["vacuum"] : /weather/.test(e) ? ["weather"] : /person/.test(e) ? ["person", "device_tracker"] : /cover|door|garage/.test(e) ? ["cover", "binary_sensor"] : /fan/.test(e) ? ["fan"] : /camera/.test(e) ? ["camera"] : /lock/.test(e) ? ["lock"] : /update/.test(e) ? ["update"] : t === "battery" || t === "energy" || t === "sensor" || t === "weather" ? ["sensor"] : t === "control" ? /fan/.test(e) ? ["fan"] : /script/.test(e) ? ["script"] : /washer/.test(e) ? ["switch", "sensor"] : /water_heater/.test(e) ? ["water_heater"] : ["switch", "input_boolean", "light"] : t === "presence" ? ["person", "device_tracker"] : ["sensor", "switch"], Tt = (e, t) => {
  const o = e.replace(/^custom_(card|chip)_/, "").replace(/^(card|chip)_/, ""), a = e.replaceAll("_", "-").toLowerCase(), r = e === "custom_card_playstation" ? "mushroom-addition-custom-card-game-console" : a.startsWith("custom-card-") ? `mushroom-addition-${a}` : `mushroom-addition-card-${a.replace(/^card-/, "")}`, n = dr(e), i = e === "custom_card_playstation", l = {
    custom_card_trash: "Trash",
    custom_card_weather_metrics: "Weather Metrics",
    custom_card_printer: "Printer",
    custom_card_washer: "Washer-Dryer",
    custom_card_nas_metrics: "NAS",
    custom_card_tablet: "Tablet",
    custom_card_plant: "Flower",
    custom_card_pollen: "Pollen",
    custom_card_sun: "Astronomy",
    custom_card_entity_carousel: "Entity Carousel"
  }, s = {
    custom_card_trash: "Mushroom-style trash collection schedule card.",
    custom_card_weather_metrics: "Mushroom-style weather metrics card.",
    custom_card_printer: "Mushroom-style printer status and toner level card.",
    custom_card_washer: "Mushroom-style washer and dryer program, progress, power, status, and remote control card.",
    custom_card_tablet: "Mushroom-style tablet status and maintenance card.",
    custom_card_plant: "Mushroom-style plant health card.",
    custom_card_pollen: "Mushroom-style pollen level card.",
    custom_card_sun: "Mushroom-style Sun and Moon position, phase, timing, and ephemeris card.",
    custom_card_entity_carousel: "Dependency-free swipeable entity and action carousel with cover-flow navigation."
  };
  return {
    upstreamId: e,
    sourcePath: t,
    kind: "card",
    category: e.startsWith("custom_") ? "custom-card" : "default-card",
    family: n,
    tag: r,
    name: i ? "Game Console Card" : e === "custom_card_nas_metrics" ? "NAS Card" : `${l[e] ?? ko(o)} Card`,
    description: i ? "Mushroom-style Xbox, PlayStation, and Nintendo profile, activity, artwork, and control card." : e === "custom_card_nas_metrics" ? "Mushroom-style NAS status and utilization card." : s[e] ?? `Mushroom-style ${ko(o).toLowerCase()} card.`,
    variants: ur[e],
    variantLabels: void 0,
    preferredDomains: mr(e, n)
  };
}, ea = [
  ...lr.map((e) => {
    const t = {
      scenes: "reference_catalog/cards/card_scenes_welcome.yaml"
    };
    return Tt(
      `card_${e}`,
      t[e] ?? `reference_catalog/cards/card_${e}.yaml`
    );
  }),
  ...cr.map((e) => Tt(
    `custom_card_${e}`,
    `custom_cards/custom_card_${e}`
  )),
  {
    upstreamId: "mini_graph_card",
    sourcePath: "https://github.com/kalkih/mini-graph-card",
    kind: "card",
    category: "custom-card",
    family: "energy",
    tag: "mushroom-addition-mini-graph-card",
    name: "Mini Graph Card",
    description: "Mushroom-style recorder history card with line and bar charts, aggregation, thresholds, and dual axes.",
    variants: ["line", "bar"],
    variantLabels: { line: "Line graph", bar: "Bar graph" },
    preferredDomains: ["sensor", "binary_sensor", "input_number"]
  }
], _r = [
  {
    upstreamId: "area_card_advanced",
    sourcePath: "src/area-advanced.ts",
    kind: "card",
    category: "custom-card",
    family: "presence",
    tag: "mushroom-addition-area-card-advanced",
    name: "Area card advanced",
    description: "Installed native Home Assistant Area card and editor, with any-entity controls, per-entity icons, colors and tap behaviors.",
    preferredDomains: []
  },
  Tt("custom_card_entity_carousel", "src/entity-carousel.ts"),
  {
    upstreamId: "advanced_home_energy_management",
    sourcePath: "src/energy-management.ts",
    kind: "card",
    category: "custom-card",
    family: "energy",
    tag: "mushroom-addition-advanced-home-energy-management",
    name: "Advanced Energy - Home Energy Management",
    description: "Circular whole-home energy dashboard with grid, solar, battery, consumption, tariff, and panel-health intelligence.",
    preferredDomains: ["sensor"]
  },
  {
    upstreamId: "advanced_energy_buy_sell",
    sourcePath: "src/energy-buy-sell.ts",
    kind: "card",
    category: "custom-card",
    family: "energy",
    tag: "mushroom-addition-advanced-energy-buy-and-sell",
    name: "Advanced Energy - Energy Buy and Sell",
    description: "Mushroom-style electricity price chart with planned grid charging and energy sale periods.",
    preferredDomains: ["sensor"]
  },
  {
    upstreamId: "advanced_energy_panel_health",
    sourcePath: "src/panel-health.ts",
    kind: "card",
    category: "custom-card",
    family: "energy",
    tag: "mushroom-addition-advanced-energy-panel-health",
    name: "Advanced Energy - Panel Health",
    description: "Mushroom-style solar panel output summary and per-panel performance gauges.",
    preferredDomains: ["sensor"]
  }
], ta = [
  {
    canonical: "card_scenes",
    sources: { card_scenes: "welcome-pills", custom_card_scenes: "scene-grid" },
    variants: ["welcome-pills", "scene-grid"],
    variantLabels: { "welcome-pills": "Welcome scene pills", "scene-grid": "Scene button grid" },
    name: "Scenes Card"
  }
], Ue = /* @__PURE__ */ new Map();
for (const e of ta)
  for (const t of Object.keys(e.sources)) Ue.set(t, e);
const oa = new Set(ta.map((e) => e.canonical)), kt = [
  ...ea.filter((e) => !Ue.has(e.upstreamId) || oa.has(e.upstreamId)).map((e) => {
    const t = Ue.get(e.upstreamId);
    return t ? {
      ...e,
      name: t.name ?? e.name,
      description: t.description ?? e.description,
      variants: t.variants,
      variantLabels: t.variantLabels,
      sourceIds: Object.keys(t.sources)
    } : { ...e, sourceIds: [e.upstreamId] };
  }),
  ..._r.map((e) => ({ ...e, sourceIds: [e.upstreamId] }))
], pr = ea.filter((e) => Ue.has(e.upstreamId) && !oa.has(e.upstreamId)).map((e) => {
  const t = Ue.get(e.upstreamId), o = kt.find((a) => a.upstreamId === t.canonical);
  return {
    upstreamId: e.upstreamId,
    tag: e.tag,
    targetId: o.upstreamId,
    targetTag: o.tag,
    variant: t.sources[e.upstreamId]
  };
}), qt = [
  ...pr,
  {
    upstreamId: "custom_card_playstation",
    tag: "mushroom-addition-custom-card-playstation",
    targetId: "custom_card_playstation",
    targetTag: "mushroom-addition-custom-card-game-console"
  }
], Mt = kt, hr = (e) => Mt.find((t) => t.tag === e) ?? (() => {
  const t = qt.find((o) => o.tag === e);
  return t ? kt.find((o) => o.tag === t.targetTag) : void 0;
})(), Mo = (e) => Ue.get(e)?.sources[e], Ot = [
  { preset: "residual", label: "Residual waste", icon: "mdi:trash-can", color: "#43a047", legacyKey: "ulm_card_datum_rest", enabledByDefault: !0 },
  { preset: "paper", label: "Paper", icon: "mdi:newspaper-variant", color: "#1e88e5", legacyKey: "ulm_card_datum_papier", enabledByDefault: !0 },
  { preset: "packaging", label: "Packaging / PMD", icon: "mdi:recycle", color: "#f9a825", legacyKey: "ulm_card_datum_pmd", enabledByDefault: !0 },
  { preset: "organic", label: "Organic / GFT", icon: "mdi:leaf", color: "#7cb342", legacyKey: "ulm_card_datum_gft", enabledByDefault: !0 },
  { preset: "glass", label: "Glass", icon: "mdi:bottle-soda", color: "#00897b", legacyKey: "ulm_card_datum_glas", enabledByDefault: !0 },
  { preset: "bulky", label: "Bulky waste", icon: "mdi:sofa", color: "#8d6e63", enabledByDefault: !1 },
  { preset: "toxic", label: "Small toxic waste", icon: "mdi:biohazard", color: "#e53935", enabledByDefault: !1 },
  { preset: "christmas-tree", label: "Christmas tree", icon: "mdi:pine-tree", color: "#2e7d32", enabledByDefault: !1 },
  { preset: "branches", label: "Branches", icon: "mdi:forest", color: "#558b2f", enabledByDefault: !1 },
  { preset: "textile", label: "Textile", icon: "mdi:tshirt-crew", color: "#8e24aa", enabledByDefault: !1 }
], aa = (e, t, o = e.enabledByDefault) => ({
  preset: e.preset,
  enabled: o,
  entity: t,
  label: e.label,
  icon: e.icon,
  color: e.color
}), gr = () => Ot.map((e) => aa(e)), ze = (e) => {
  if (e.waste_streams?.length) return e.waste_streams.map((a) => ({ ...a }));
  const t = e.type.includes("custom-card-trash"), o = Ot.some((a) => a.legacyKey && typeof e[a.legacyKey] == "string");
  return !t && !o ? [] : Ot.map((a, r) => {
    const i = (a.legacyKey && typeof e[a.legacyKey] == "string" ? e[a.legacyKey] : void 0) ?? (r === 0 ? e.entity : void 0);
    return aa(a, i, i ? !0 : a.enabledByDefault);
  });
}, yr = (e) => {
  const t = e.type.includes("custom-card-trash"), o = e.today_entity ?? (typeof e.ulm_card_ophaling_vandaag == "string" ? e.ulm_card_ophaling_vandaag : void 0), a = e.tomorrow_entity ?? (typeof e.ulm_card_ophaling_morgen == "string" ? e.ulm_card_ophaling_morgen : void 0);
  if (!t && !o && !a) return e;
  const r = e.waste_streams?.length ? e.waste_streams : ze(e);
  return {
    ...e,
    waste_streams: r.length ? r : e.waste_streams,
    today_entity: o,
    tomorrow_entity: a,
    show_today: e.show_today ?? !!o,
    show_tomorrow: e.show_tomorrow ?? !!a
  };
}, ge = /* @__PURE__ */ new Set([
  "on",
  "open",
  "opening",
  "playing",
  "home",
  "heat",
  "cool",
  "heating",
  "cleaning",
  "unlocked",
  "active"
]), A = (e) => {
  if (!e) return "Entity unavailable";
  const t = e.attributes.unit_of_measurement;
  return t ? `${e.state} ${String(t)}` : e.state.replaceAll("_", " ");
}, Ao = (e) => {
  if (typeof e == "string") return e;
  const t = Array.isArray(e) ? e : [e];
  return t.every((o) => o.type === "text") ? t.map((o) => o.text ?? "").join(" ") : void 0;
}, le = (e, t, o) => {
  const a = e.name !== void 0 && typeof e.name != "string";
  return a && t && o?.formatEntityName ? o.formatEntityName(t, e.name) : a ? Ao(e.name) || t?.attributes.friendly_name || e.entity || "" : e.name_mode === "none" ? "" : e.name_mode === "entity" ? t?.attributes.friendly_name || e.entity || "" : e.name && t && o?.formatEntityName ? o.formatEntityName(t, e.name) : (e.name ? Ao(e.name) : void 0) || t?.attributes.friendly_name || e.entity || "";
}, he = (e, t, o) => {
  e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    composed: !0,
    detail: o
  }));
}, ra = (e, t, o) => {
  he(e, "hass-action", { config: t, action: o });
}, br = (e) => {
  const t = wr(e), o = fr(t), a = String(t.type), r = a.includes("card-title"), n = a.includes("card-welcome-scenes"), i = a.includes("card-weather"), l = a.includes("card-weather-ulm") || t.variant === "native", s = a.includes("custom-card-sun") || a.includes("custom-card-thermostat-controls") ? { action: "none" } : void 0, d = String(o.type).includes("custom-card-qubino") ? o.qubino_more_info_entity ?? o.entity : void 0, u = a.endsWith("custom-card-pollen"), _ = [
    o.download_entity,
    o.upload_entity,
    o.ping_entity
  ].filter((f) => typeof f == "string"), h = String(o.type).includes("speedtest-gauges"), p = o.variant === "divider-title", y = o.variant === "divider-subtitle", x = h ? {
    action: "perform-action",
    perform_action: "homeassistant.update_entity",
    target: { entity_id: _ }
  } : y || p && !o.navigation_path ? { action: "none" } : u ? { action: "none" } : d ? { action: "more-info", entity: d } : o.navigation_path ? { action: "navigate", navigation_path: o.navigation_path } : s ?? { action: r || n ? "none" : o.entity ? "more-info" : "none" }, b = a.includes("card-room") && !a.endsWith("mushroom-addition-card-room") && o.input_select_entity && o.input_select_option ? {
    action: "perform-action",
    perform_action: "input_select.select_option",
    target: { entity_id: o.input_select_entity },
    data: { option: o.input_select_option }
  } : void 0;
  return {
    ...o,
    show_icon: o.show_icon ?? !0,
    show_state: o.show_state ?? !0,
    show_name: o.show_name,
    name_mode: o.primary_info !== void 0 || o.secondary_info !== void 0 ? void 0 : o.name_mode,
    icon_type: o.icon_type ?? (t.use_entity_picture ? "entity-picture" : t.show_icon === !1 ? "none" : /custom-card-(game-console|playstation)$/.test(a) ? "entity-picture" : "icon"),
    layout: o.layout ?? "default",
    fill_container: o.fill_container ?? !1,
    primary_info: o.primary_info,
    secondary_info: o.secondary_info,
    tap_action: o.tap_action ?? x,
    show_controls: o.show_controls ?? (a.includes("card-vacuum") ? !0 : void 0),
    show_forecast: o.show_forecast ?? (i ? !l : void 0),
    hold_action: o.hold_action ?? (String(o.type).includes("water-heater") && o.entity ? { action: "more-info" } : void 0),
    double_tap_action: o.double_tap_action ?? b
  };
}, Fe = (e, t) => Object.entries(e).find(([o, a]) => t.test(o) && a !== void 0)?.[1], fr = (e) => {
  const t = String(e.type).includes("custom-card-roomview"), o = Fe(e, t ? /^(?!climate_).*_name$/ : /_name$/), a = Fe(e, t ? /^(?!climate_).*_icon$/ : /_icon$/), r = Fe(e, /_color$/), n = Fe(e, /_enable_(controls|buttons)$/), i = Fe(e, /_enable_slider$/), l = Fe(e, /_enable_horizontal$/);
  return {
    ...e,
    name: e.name ?? (typeof o == "string" ? o : void 0),
    icon: e.icon ?? (typeof a == "string" ? a : void 0),
    icon_color: e.icon_color ?? (typeof r == "string" ? r : void 0),
    navigation_path: e.navigation_path,
    show_controls: e.show_controls ?? (typeof n == "boolean" ? n : typeof i == "boolean" ? i : void 0),
    layout: e.layout ?? (l === !0 ? "horizontal" : void 0)
  };
}, vr = [
  "ulm_card_media_player_entity",
  "ulm_card_input_number_entity",
  "ulm_custom_card_weather_metrics"
], wr = (e) => {
  const t = yr(e), o = t.primary_entity || vr.map((n) => t[n]).find((n) => typeof n == "string"), a = (n) => {
    if (typeof n == "string") return n;
    if (n && typeof n == "object" && "entity_id" in n && typeof n.entity_id == "string")
      return n.entity_id;
  }, r = {
    ...t,
    entity: t.entity ?? o,
    primary_entity: void 0
  };
  if (String(e.type).includes("card-power-outlet") && (r.consumption_entity ??= a(e.ulm_card_power_outlet_consumption_sensor)), String(e.type).includes("card-room") && !String(e.type).endsWith("mushroom-addition-card-room") && (r.input_select_entity ??= a(e.ulm_input_select), r.input_select_option ??= typeof e.ulm_input_select_option == "string" ? e.ulm_input_select_option : void 0), String(e.type).includes("nas-metrics") && (r.temperature_entity ??= a(e.entity_1), r.memory_entity ??= a(e.entity_2), r.cpu_entity ??= a(e.entity_3), r.disk_entity ??= a(e.entity_4)), String(e.type).includes("tablet") && (r.entity ??= a(e.ulm_custom_card_tablet_main), r.battery_entity ??= a(e.ulm_custom_card_tablet_battery), r.tablet_button_usb_entity ??= a(e.ulm_custom_card_tablet_button1), r.tablet_button_motion_entity ??= a(e.ulm_custom_card_tablet_button2), r.tablet_button_display_entity ??= a(e.ulm_custom_card_tablet_button3), r.tablet_restart_entity ??= a(e.ulm_custom_card_tablet_restart), r.tablet_reload_entity ??= a(e.ulm_custom_card_tablet_reload), r.tablet_maintenance_entity ??= a(e.ulm_custom_card_tablet_maintenance), r.tablet_ram_entity ??= a(e.ulm_custom_card_tablet_par1), r.tablet_disk_entity ??= a(e.ulm_custom_card_tablet_par2), r.tablet_power_entity ??= a(e.ulm_custom_card_tablet_par3)), String(e.type).includes("card-welcome-scenes") && (r.collapse_entity ??= a(e.ulm_card_welcome_scenes_collapse), !r.scene_items)) {
    const n = Array.from({ length: 7 }, (i, l) => {
      const s = e[`entity_${l + 1}`];
      if (!s || typeof s != "object") return;
      const d = s, u = a(d);
      if (u)
        return {
          entity: u,
          name: typeof d.name == "string" ? d.name : void 0,
          icon: typeof d.icon == "string" ? d.icon : void 0,
          color: typeof d.color == "string" ? d.color : void 0,
          state: typeof d.state == "string" ? d.state : void 0,
          navigation_path: typeof d.navigation_path == "string" ? d.navigation_path : typeof d.nav_path == "string" ? d.nav_path : void 0,
          service_data: d.service_data && typeof d.service_data == "object" ? d.service_data : void 0
        };
    }).filter((i) => i !== void 0);
    n.length && (r.scene_items = n);
  }
  if (String(e.type).includes("weather-metrics") && (r.entity ??= a(e.ulm_custom_card_weather_metrics), r.temperature_entity ??= a(e.ulm_custom_card_weather_metrics_temperature_outside), r.date_entity ??= a(e.ulm_custom_card_weather_metrics_date), r.entities ??= [1, 2, 3, 4].map((n) => a(e[`ulm_custom_card_weather_metrics_entity_${n}`])).filter((n) => n !== void 0)), String(e.type).includes("custom-card-washer") && (r.entity ??= a(e.ulm_custom_card_washer_machine_state) ?? a(e.ulm_custom_card_washer_power), r.program_stage_entity ??= a(e.ulm_custom_card_washer_job_state) ?? r.entity, r.washer_power_entity ??= r.power_entity ?? a(e.ulm_custom_card_washer_power), r.power_entity ??= r.washer_power_entity), String(e.type).includes("custom-card-thermostat-controls") && (r.entity ??= a(e.entity), r.variant ??= "buttons"), String(e.type).includes("media-player-sonos") && (r.entity ??= a(e.ulm_card_media_player_with_controls_entity)), String(e.type).includes("printer") && (r.black_entity ??= a(e.ulm_card_printer_black_name), r.yellow_entity ??= a(e.ulm_card_printer_yellow_name), r.magenta_entity ??= a(e.ulm_card_printer_magenta_name), r.cyan_entity ??= a(e.ulm_card_printer_cyan_name)), String(e.type).endsWith("custom-card-pollen") && (r.trees_entity ??= a(e.custom_card_pollen_tree), r.grass_entity ??= a(e.custom_card_pollen_grass), r.weeds_entity ??= a(e.custom_card_pollen_weed)), String(e.type).includes("speedtest-gauges") && (r.download_entity ??= a(e.ulm_custom_card_speedtest_download_speed_entity) ?? r.entity, r.upload_entity ??= a(e.ulm_custom_card_speedtest_upload_speed_entity), r.ping_entity ??= a(e.ulm_custom_card_speedtest_ping_entity), r.entity = a(r.download_entity)), String(e.type).includes("custom-card-scenes") || String(e.type).includes("card-scenes") && e.variant === "scene-grid") {
    const n = Array.from({ length: 5 }, (i, l) => {
      const s = e[`entity_${l + 1}`];
      if (typeof s == "string") return { entity: s };
      if (!s || typeof s != "object" || !("entity_id" in s) || typeof s.entity_id != "string")
        return;
      const d = s;
      return {
        entity: d.entity_id,
        icon: typeof d.icon == "string" ? d.icon : void 0,
        color: typeof d.icon_color == "string" ? d.icon_color : void 0,
        name: typeof d.name == "string" ? d.name : void 0
      };
    }).filter((i) => !!i);
    !r.scene_items?.length && n.length && (r.scene_items = n);
  }
  return String(e.type).includes("plant") && (r.entity ??= a(e.ulm_card_flower_entity), r.ulm_card_flower_entity ??= r.entity), r;
}, pe = {
  pause: 1,
  volumeSet: 4,
  volumeMute: 8,
  previous: 16,
  next: 32,
  turnOn: 128,
  turnOff: 256,
  volumeStep: 1024,
  stop: 4096,
  play: 16384,
  shuffle: 32768,
  repeat: 262144
}, na = [
  { configKey: "crossfade_entity", domain: "switch", suffix: "crossfade", label: "Crossfade", icon: "mdi:swap-horizontal" },
  { configKey: "night_sound_entity", domain: "switch", suffix: "night_sound", label: "Night sound", icon: "mdi:weather-night" },
  { configKey: "speech_enhancement_entity", domain: "switch", suffix: "speech_enhancement", label: "Speech enhancement", icon: "mdi:ear-hearing" },
  { configKey: "subwoofer_entity", domain: "switch", suffix: "subwoofer_enabled", label: "Subwoofer", icon: "mdi:speaker-wireless" },
  { configKey: "surrounds_entity", domain: "switch", suffix: "surround_enabled", label: "Surrounds", icon: "mdi:surround-sound" },
  { configKey: "loudness_entity", domain: "switch", suffix: "loudness", label: "Loudness", icon: "mdi:bullhorn" },
  { configKey: "surround_full_entity", domain: "switch", suffix: "surround_music_full_volume", label: "Surround full", icon: "mdi:music-note-plus" }
], ia = [
  { configKey: "audio_delay_entity", domain: "number", suffix: "audio_delay", label: "Audio delay", icon: "mdi:tune-variant" },
  { configKey: "balance_entity", domain: "number", suffix: "balance", label: "Balance", icon: "mdi:tune-variant" },
  { configKey: "bass_entity", domain: "number", suffix: "bass", label: "Bass", icon: "mdi:tune-variant" },
  { configKey: "treble_entity", domain: "number", suffix: "treble", label: "Treble", icon: "mdi:tune-variant" },
  { configKey: "sub_gain_entity", domain: "number", suffix: "sub_gain", label: "Sub gain", icon: "mdi:tune-variant" },
  { configKey: "surround_level_entity", domain: "number", suffix: "surround_level", label: "Surround level", icon: "mdi:tune-variant" },
  { configKey: "music_surround_level_entity", domain: "number", suffix: "music_surround_level", label: "Surround level music", icon: "mdi:tune-variant" }
], Kt = [...na, ...ia], Yt = (e) => e.split(".", 2)[1] ?? e, Co = (e) => Yt(e).replace(/_\d+$/, ""), sa = (e, t) => {
  if (!e.startsWith(`${t.domain}.`)) return !1;
  const o = Yt(e);
  return t.suffix === "surround_level" && o.endsWith("_music_surround_level") ? !1 : o === t.suffix || o.endsWith(`_${t.suffix}`);
}, Io = (e) => Kt.filter((t) => e.some((o) => sa(o, t))).length, Xt = (e, t, o) => {
  if (!e || !t) return {};
  const a = Object.keys(e.states), r = e.entities ?? {}, n = Co(t), i = [.../* @__PURE__ */ new Set([t, ...a.filter((h) => h.startsWith("media_player.") && Co(h) === n)])], d = [...new Set(i.map((h) => r[h]?.device_id).filter((h) => typeof h == "string" && h.length > 0))].map((h) => a.filter((p) => r[p]?.device_id === h)).sort((h, p) => Io(p) - Io(h))[0] ?? [], u = a.filter((h) => {
    const p = h.split(".", 1)[0], y = Yt(h);
    return ["switch", "number"].includes(p) && (y === n || y.startsWith(`${n}_`));
  }), _ = [.../* @__PURE__ */ new Set([...d, ...u])];
  return Object.fromEntries(Kt.flatMap((h) => {
    const p = o?.[h.configKey];
    if (typeof p == "string" && p.length > 0) return [[h.configKey, p]];
    const y = _.find((x) => sa(x, h));
    return y ? [[h.configKey, y]] : [];
  }));
}, Eo = (e, t) => Object.keys(Xt(e, t)).length, la = [
  { configKey: "followers_entity", domains: ["sensor"], terms: ["follower", "followers"] },
  { configKey: "following_entity", domains: ["sensor"], terms: ["following"] },
  { configKey: "friends_entity", domains: ["sensor"], terms: ["friends"] },
  { configKey: "primary_stat_entity", domains: ["sensor"], terms: ["gamer_score", "gamerscore", "score"] },
  { configKey: "secondary_stat_entity", domains: ["sensor"], terms: ["ranking", "rank"] },
  { configKey: "now_playing_entity", domains: ["sensor"], terms: ["now_playing", "current_game"] },
  { configKey: "gamerpic_entity", domains: ["image"], terms: ["gamerpic", "avatar", "profile"] },
  {
    configKey: "artwork_entity",
    domains: ["image"],
    terms: ["now_playing", "titled_hero_art", "superhero_art", "branded_key_art", "poster", "box_art"]
  },
  { configKey: "console_power_entity", domains: ["remote", "media_player", "switch"], terms: ["console", "xbox", "playstation", "ps4", "ps5", "nintendo"] }
], Nt = (e) => e.split(".", 2)[1] ?? e, ca = (e) => e.toLowerCase().replace(/[^a-z0-9]+/g, "_"), $r = (e, t, o) => {
  const a = t.split(".", 1)[0];
  if (!o.domains.includes(a)) return !1;
  const r = e?.states[t], n = ca([
    Nt(t),
    r?.attributes.friendly_name
  ].filter(Boolean).join(" "));
  return o.terms.some((i) => n.includes(i));
}, Jt = (e, t, o) => {
  if (!e || !t) return {};
  const a = e.entities?.[t]?.device_id, n = Nt(t).split(/_(?:console|status|online|power)$/)[0], i = Object.keys(e.states).filter((l) => {
    const s = a && e.entities?.[l]?.device_id === a, d = Nt(l);
    return s || d === n || d.startsWith(`${n}_`);
  });
  return Object.fromEntries(la.flatMap((l) => {
    const s = o?.[l.configKey];
    if (typeof s == "string" && s.length > 0)
      return [[l.configKey, s]];
    const d = i.find((u) => $r(e, u, l));
    return d ? [[l.configKey, d]] : [];
  }));
}, da = (e, t, o) => {
  const a = o?.console_platform;
  if (a === "xbox" || a === "playstation" || a === "nintendo") return a;
  const r = t ? e?.states[t] : void 0, n = ca([
    t,
    r?.attributes.friendly_name,
    t ? e?.entities?.[t]?.platform : void 0
  ].filter(Boolean).join(" "));
  return n.includes("xbox") || n.includes("gamer") ? "xbox" : n.includes("playstation") || /(?:^|_)ps[345](?:_|$)/.test(n) ? "playstation" : n.includes("nintendo") || n.includes("switch") ? "nintendo" : "generic";
}, xr = (e) => {
  switch (e) {
    case "xbox":
      return { icon: "mdi:microsoft-xbox", tone: "green" };
    case "playstation":
      return { icon: "mdi:sony-playstation", tone: "blue" };
    case "nintendo":
      return { icon: "mdi:nintendo-switch", tone: "red" };
    default:
      return { icon: "mdi:controller-classic", tone: "purple" };
  }
}, Po = {
  en: {
    entity: "Entity",
    name: "Name",
    name_mode: "Name",
    secondary: "Custom secondary information",
    icon: "Icon",
    icon_color: "Icon color",
    variant: "Card style",
    layout: "Content layout",
    icon_type: "Icon type",
    fill_container: "Fill container",
    multiline_secondary: "Allow multiline secondary information",
    primary_info: "Primary information",
    secondary_info: "Secondary information",
    show_icon: "Show icon",
    show_name: "Show name",
    show_state: "Show state",
    tap_action: "Tap action",
    hold_action: "Hold action",
    double_tap_action: "Double-tap action",
    collapse_entity: "Collapse helper",
    collapsed: "Show collapsed",
    weather_entity: "Weather entity",
    settings_path: "Settings navigation path",
    temperature_entity: "Temperature sensor",
    humidity_entity: "Humidity sensor",
    window_sensor: "Window sensor",
    trees_entity: "Tree pollen sensor",
    grass_entity: "Grass pollen sensor",
    weeds_entity: "Weed pollen sensor",
    battery_entity: "Battery sensor",
    graph_entity: "Graph sensor",
    eta_entity: "ETA sensor",
    battery_warning_threshold: "Warning threshold",
    battery_low_threshold: "Low battery threshold",
    battery_critical_threshold: "Critical battery threshold",
    battery_healthy_color: "Healthy battery color",
    battery_warning_color: "Warning battery color",
    battery_low_color: "Low battery color",
    battery_critical_color: "Critical battery color",
    consumption_entity: "Power consumption sensor",
    label_use_temperature: "Show temperature label",
    label_use_brightness: "Show brightness label",
    room_light_entity: "Room accent light",
    room_temperature_entity: "Room temperature entity",
    room_brightness_entity: "Room brightness light",
    room_move_up: "Move up",
    room_move_down: "Move down",
    room_secondary_help: "Compose secondary information in order. All values come from the primary entity; feature label switches and their selected entities do not override this list. Unavailable values are omitted.",
    room_secondary_value: "Value",
    room_part_text: "Text",
    room_part_name: "Entity name",
    room_part_state: "State (on/off, etc.)",
    room_part_brightness: "Brightness (%)",
    room_part_temperature: "Temperature",
    room_part_attribute: "Entity attribute",
    room_part_add: "Add information part",
    room_part_remove: "Remove information part",
    room_buttons: "Room sensor buttons",
    room_buttons_help: "Action buttons are separate from the small status indicators. Selecting an entity fills its icon, appearance, active state and actions; you can override these values.",
    active_state: "Active state",
    room_active_state_help: "Exact entity state that highlights this action button.",
    room_button_action_help: "Sensors open more information; controllable entities toggle by default.",
    room_status: "Status indicators",
    room_status_help: "Add up to four small entity icons, separate from the action buttons. Water and fire/smoke pulse blue and red when triggered; reduced motion keeps the alert color without animation.",
    room_status_kind: "Indicator kind",
    room_status_window: "Window",
    room_status_door: "Door",
    room_status_motion: "Motion / occupancy",
    room_status_water: "Water / moisture",
    room_status_smoke: "Fire / smoke",
    room_status_active: "Triggered",
    room_status_inactive: "Inactive",
    room_status_unavailable: "Unavailable",
    room_status_preview: "Indicator preview",
    room_status_choose_entity: "Choose an entity",
    room_status_add: "Add status indicator",
    room_status_remove: "Remove status indicator",
    input_select_entity: "Room selection helper",
    input_select_option: "Room selection option",
    date_entity: "Date sensor",
    level_entity: "Pollen level sensor",
    clock_switch_entity: "Clock toggle helper",
    download_entity: "Download speed sensor",
    upload_entity: "Upload speed sensor",
    ping_entity: "Ping sensor",
    wifi_tracker_entity: "Wi-Fi tracker",
    gps_tracker_entity: "GPS tracker",
    findmy_script_entity: "Find-my-phone script",
    disk_entity: "Disk usage sensor",
    memory_entity: "Memory usage sensor",
    cpu_entity: "CPU usage sensor",
    power_entity: "Power sensor",
    energy_entity: "Energy sensor",
    time_entity: "Runtime sensor",
    crossfade_entity: "Crossfade switch",
    night_sound_entity: "Night sound switch",
    speech_enhancement_entity: "Speech enhancement switch",
    subwoofer_entity: "Subwoofer switch",
    surrounds_entity: "Surrounds switch",
    loudness_entity: "Loudness switch",
    surround_full_entity: "Surround full-volume switch",
    audio_delay_entity: "Audio delay control",
    balance_entity: "Balance control",
    bass_entity: "Bass control",
    treble_entity: "Treble control",
    sub_gain_entity: "Sub gain control",
    surround_level_entity: "Surround level control",
    music_surround_level_entity: "Music surround level control",
    black_entity: "Black toner sensor",
    yellow_entity: "Yellow toner sensor",
    magenta_entity: "Magenta toner sensor",
    cyan_entity: "Cyan toner sensor",
    carousel_show_header: "Show card header",
    buy_sell_title: "Chart title",
    buy_sell_graph_span: "Chart time range (hours)",
    buy_sell_show_result: "Show buy and sell result",
    buy_sell_trade_energy: "Minimum trade size (kWh)",
    buy_sell_trade_energy_entity: "Minimum trade size entity (optional, kWh)",
    buy_sell_trade_power: "Charging / selling power (kW)",
    buy_sell_trade_efficiency: "Round-trip efficiency (%)",
    buy_sell_feed_in_fee: "Feed-in fee (€/kWh)",
    buy_sell_slot_minutes: "Price slot duration (minutes)",
    buy_sell_span_start: "Chart start time",
    buy_sell_update_interval: "Refresh interval (minutes)",
    buy_sell_chart_height: "Chart height",
    buy_sell_show_now: "Show current-time marker",
    buy_sell_now_label: "Current-time label",
    buy_sell_now_color: "Current-time marker color",
    buy_sell_show_legend: "Show chart legend",
    buy_sell_show_grid: "Show chart grid",
    buy_sell_axis_label: "Price axis label",
    buy_sell_min_value: "Minimum price",
    buy_sell_max_value: "Maximum price",
    buy_sell_price_decimals: "Current price decimals",
    buy_sell_axis_decimals: "Axis decimals",
    buy_sell_bar_radius: "Column corner radius",
    buy_sell_price_label: "Price series label",
    buy_sell_charge_label: "Planned grid charge label",
    buy_sell_planned_sell_label: "Planned sell label",
    buy_sell_possible_sell_label: "Possible sell label",
    buy_sell_price_color: "Price series color",
    buy_sell_charge_color: "Planned grid charge color",
    buy_sell_planned_sell_color: "Planned sell color",
    buy_sell_possible_sell_color: "Possible sell color",
    panel_health_title: "Card title",
    panel_gauge_max: "Gauge maximum (W)",
    panel_entities: "Panel sensors",
    panel_warning_average_min: "Minimum average before warning (W)",
    panel_low_output_percent: "Low-output warning threshold (%)",
    panel_segment_1: "Color threshold 1 (W)",
    panel_segment_2: "Color threshold 2 (W)",
    panel_segment_3: "Color threshold 3 (W)",
    panel_segment_4: "Color threshold 4 (W)",
    panel_color_0: "Lowest output color",
    panel_color_1: "Low output color",
    panel_color_2: "Moderate output color",
    panel_color_3: "Good output color",
    panel_color_4: "High output color",
    panel_color_5: "Maximum output color",
    panel_show_summary: "Show panel summary",
    panel_show_gauges: "Show individual panel gauges",
    disk_name: "Disk label",
    disk_icon: "Disk icon",
    disk_color: "Disk color",
    temperature_name: "Temperature label",
    temperature_icon: "Temperature icon",
    temperature_color: "Temperature color",
    temperature_max: "Temperature chart maximum",
    memory_name: "Memory label",
    memory_icon: "Memory icon",
    memory_color: "Memory color",
    memory_max: "Memory chart maximum",
    cpu_name: "CPU label",
    cpu_icon: "CPU icon",
    cpu_color: "CPU color",
    cpu_max: "CPU chart maximum",
    graph_span: "History range",
    chart_type: "Chart style",
    address_entity: "Address sensor",
    min_entity: "Minimum sensor",
    max_entity: "Maximum sensor",
    show_today: "Show today's collection summary",
    today_entity: "Today's collection summary sensor",
    show_tomorrow: "Show tomorrow's collection summary",
    tomorrow_entity: "Tomorrow's collection summary sensor",
    show_forecast: "Show forecast",
    show_controls: "Show controls",
    show_graph: "Show graph",
    use_entity_picture: "Use entity picture",
    graph_hours: "Graph hours",
    console_platform: "Console platform",
    carousel_loop: "Loop continuously",
    carousel_show_labels: "Show selected item label",
    carousel_visible_items: "Visible carousel items",
    carousel_initial_index: "Initial selected item",
    carousel_effect: "Carousel effect",
    carousel_grab_cursor: "Show grab cursor",
    carousel_centered_slides: "Center selected slide",
    carousel_slides_per_view: "Slides per view",
    carousel_coverflow_rotate: "Coverflow rotation",
    carousel_coverflow_stretch: "Coverflow spacing",
    carousel_coverflow_depth: "Coverflow depth",
    carousel_coverflow_modifier: "Coverflow intensity",
    carousel_coverflow_slide_shadows: "Show slide shadows",
    scene_buttons_only: "Show scene buttons only",
    hours_to_show: "History hours",
    points_per_hour: "Points per hour",
    aggregate_func: "Default aggregation",
    group_by: "Group history by",
    update_interval: "Update interval",
    cache: "Cache history",
    height: "Graph height",
    line_width: "Line width",
    bar_spacing: "Bar spacing",
    smoothing: "Smooth lines",
    animate: "Animate graph",
    logarithmic: "Logarithmic scale",
    value_factor: "Value scale exponent",
    decimals: "Displayed decimals",
    hour24: "Use 24-hour time",
    font_size: "State font size",
    font_size_header: "Header font size",
    align_header: "Header alignment",
    align_icon: "Icon alignment",
    align_state: "State alignment",
    unit: "Unit override",
    icon_image: "Icon image URL",
    lower_bound: "Primary lower bound",
    upper_bound: "Primary upper bound",
    min_bound_range: "Primary minimum axis range",
    lower_bound_secondary: "Secondary lower bound",
    upper_bound_secondary: "Secondary upper bound",
    min_bound_range_secondary: "Secondary minimum axis range",
    color_thresholds_transition: "Threshold transition",
    group: "Embedded card styling",
    mini_graph_show_state: "State display",
    mini_graph_show_fill: "Graph fill",
    mini_graph_show_points: "Data points",
    mini_graph_show_labels: "Primary axis labels",
    mini_graph_show_labels_secondary: "Secondary axis labels",
    mini_graph_show_legend: "Show legend",
    mini_graph_show_average: "Show average",
    mini_graph_show_extrema: "Show minimum and maximum",
    mini_graph_name_adaptive_color: "Adapt name color",
    mini_graph_icon_adaptive_color: "Adapt icon color",
    mini_graph_loading_indicator: "Show loading indicator",
    ulm_card_battery_battery_level_danger: "Low battery threshold",
    ulm_card_battery_battery_level_warning: "Battery warning threshold",
    ulm_card_battery_attribute: "Battery level attribute",
    ulm_card_battery_battery_state_entity_id: "Battery/Charging state entity",
    ulm_card_battery_charger_type_entity_id: "Charger type entity",
    ulm_card_battery_charging_animation: "Animate while charging",
    ulm_card_battery_color_battery_level_danger: "Low battery color",
    ulm_card_battery_color_battery_level_warning: "Battery warning color",
    ulm_card_battery_color_battery_level_ok: "Healthy battery color",
    ulm_card_battery_name: "Battery name",
    ulm_card_media_player_enable_art: "Show media artwork",
    sonos_details_always_visible: "Always show detailed controls",
    use_media_info: "Use media info",
    show_volume_level: "Show volume level",
    volume_controls: "Volume controls",
    media_controls: "Media controls",
    collapsible_controls: "Collapse controls when off",
    ulm_card_media_player_enable_controls: "Show playback controls",
    ulm_card_media_player_enable_volume_slider: "Show volume slider",
    ulm_card_media_player_enable_volume_buttons: "Show volume buttons",
    ulm_card_media_player_enable_volume_adjust: "Volume button step",
    ulm_card_media_player_collapsible: "Collapse controls while inactive",
    ulm_card_media_player_idle_off: "Treat idle as inactive",
    ulm_card_media_player_player_controls_entity: "Playback control entity",
    ulm_card_media_player_more_info: "Show artist and album details",
    ulm_card_media_player_power_button: "Show power button",
    ulm_card_media_player_force_background_color: "Color the card while active",
    ulm_card_media_player_color: "Media accent color",
    ulm_card_generic_color: "Generic card accent color",
    ulm_card_generic_force_background_color: "Color the generic card while active",
    ulm_card_generic_swap_color: "Swapped card accent color",
    ulm_card_generic_swap_force_background_color: "Color the swapped card while active",
    ulm_card_navigate_color: "Navigation accent color",
    ulm_card_binary_sensor_color: "Binary sensor accent color",
    ulm_card_binary_sensor_force_background_color: "Color the card while active",
    ulm_card_binary_sensor_icon: "Binary sensor icon",
    ulm_card_binary_sensor_name: "Binary sensor name",
    ulm_card_binary_sensor_show_last_changed: "Show when the state last changed",
    ulm_card_binary_sensor_alert_color: "Alert accent color",
    ulm_card_binary_sensor_alert_force_background_color: "Color the alert card while active",
    ulm_card_binary_sensor_alert_icon: "Alert icon",
    ulm_card_binary_sensor_alert_name: "Alert name",
    ulm_card_binary_sensor_alert_show_last_changed: "Show when the alert last changed",
    ulm_card_input_boolean_icon: "Input boolean icon",
    ulm_card_input_boolean_name: "Input boolean name",
    custom_card_pollen_tree_name: "Tree pollen name",
    custom_card_pollen_tree_icon: "Tree pollen icon",
    custom_card_pollen_grass_name: "Grass pollen name",
    custom_card_pollen_grass_icon: "Grass pollen icon",
    custom_card_pollen_weed_name: "Weed pollen name",
    custom_card_pollen_weed_icon: "Weed pollen icon",
    ulm_custom_card_washer_power: "Power sensor",
    ulm_custom_card_washer_remote_control: "Remote control status",
    ulm_custom_card_washer_machine_state: "Machine state",
    ulm_custom_card_washer_machine_stop_state: "Stopped state value",
    ulm_custom_card_washer_job_state: "Current program stage",
    ulm_custom_card_washer_job_progress: "Program progress",
    ulm_custom_card_washer_job_states: "Program stages",
    ulm_custom_card_washer_delayed_start: "Delayed start toggle",
    ulm_custom_card_washer_delayed_starttime: "Delayed start time",
    ulm_custom_card_washer_label_idle: "Idle label",
    ulm_custom_card_washer_label_configuring: "Configuring label",
    ulm_custom_card_washer_label_running: "Running label",
    ulm_custom_card_washer_start_action: "Start action",
    ulm_custom_card_washer_pause_action: "Pause action",
    ulm_custom_card_washer_stop_action: "Stop action",
    machine_state_entity: "Machine state",
    program_stage_entity: "Current program stage",
    washer_power_entity: "Power sensor",
    grid_power_entity: "Grid power",
    grid_phase_1_entity: "Grid phase L1",
    grid_phase_2_entity: "Grid phase L2",
    grid_phase_3_entity: "Grid phase L3",
    solar_power_entity: "Solar production",
    solar_forecast_entity: "Solar forecast",
    battery_level_entity: "Main battery level",
    battery_power_entity: "Main battery power",
    battery_1_level_entity: "Battery 1 level",
    battery_1_power_entity: "Battery 1 power",
    battery_2_level_entity: "Battery 2 level",
    battery_2_power_entity: "Battery 2 power",
    battery_3_level_entity: "Battery 3 level",
    battery_3_power_entity: "Battery 3 power",
    ev_charger_power_entity: "EV charger power",
    energy_mode_entity: "Energy mode",
    energy_auto_control_entity: "Automatic control",
    electricity_price_entity: "Current electricity price",
    tariff_markup_entity: "Tariff markup",
    tariff_vat_entity: "Tariff VAT percentage",
    energy_grid_label: "Grid idle label",
    energy_grid_import_label: "Grid import label",
    energy_grid_export_label: "Grid export label",
    energy_solar_label: "Solar label",
    energy_battery_label: "Battery label",
    energy_home_label: "Home label",
    energy_forecast_label: "Forecast label",
    energy_ev_label: "EV charger label",
    energy_charge_label: "Battery charging label",
    energy_discharge_label: "Battery discharging label",
    energy_idle_label: "Battery idle label",
    energy_auto_label: "Automatic mode label",
    energy_manual_label: "Manual mode label",
    mode_solar_first_label: "Solar-first display label",
    mode_smart_saving_label: "Smart-saving display label",
    mode_smart_trading_label: "Smart-trading display label",
    grid_phase_scale_max: "Grid phase arc maximum",
    solar_scale_max: "Solar arc maximum",
    battery_unit_scale_max: "Battery unit arc maximum",
    home_scale_max: "Home arc maximum",
    price_low_threshold: "Low price threshold",
    price_medium_threshold: "Medium price threshold",
    price_high_threshold: "High price threshold",
    price_critical_threshold: "Critical price threshold",
    show_grid_phases: "Show grid phases",
    show_battery_units: "Show individual batteries",
    show_tariff_timeline: "Show tariff timeline",
    import_color: "Grid import color",
    export_color: "Grid export color",
    solar_color: "Solar color",
    battery_color: "Battery color",
    home_color: "Home color",
    price_negative_color: "Negative price color",
    price_low_color: "Low price color",
    price_medium_color: "Medium price color",
    price_high_color: "High price color",
    price_critical_color: "Critical price color",
    door_entity: "Door entity",
    finished_entity: "Finished entity",
    battery_state_entity: "Battery state entity",
    charger_type_entity: "Charger type entity",
    secondary_entity: "Secondary entity",
    darkMode: "Dark mode",
    language: "Language",
    showAzimuth: "Show azimuth",
    showElevation: "Show elevation",
    showMoon: "Show Moon details",
    moon_entity: "Moon phase entity",
    moon_altitude_entity: "Moon altitude entity",
    moon_azimuth_entity: "Moon azimuth entity",
    moon_rising_entity: "Moonrise entity",
    moon_setting_entity: "Moonset entity",
    moon_right_ascension_entity: "Moon right ascension entity",
    moon_declination_entity: "Moon declination entity",
    moon_distance_entity: "Moon distance entity",
    moon_angular_diameter_entity: "Moon angular diameter entity",
    moon_phase_angle_entity: "Moon phase angle entity",
    moon_illumination_entity: "Moon illumination entity",
    moon_next_full_moon_entity: "Next full Moon entity",
    moon_next_new_moon_entity: "Next new Moon entity",
    moon_above_horizon_entity: "Moon above horizon entity",
    timeFormat: "Time format",
    title: "Title",
    ulm_custom_card_speedtest_download_speed_entity: "Download speed sensor",
    ulm_custom_card_speedtest_download_speed_color: "Download gauge color",
    ulm_custom_card_speedtest_download_speed_max: "Download gauge maximum",
    ulm_custom_card_speedtest_upload_speed_entity: "Upload speed sensor",
    ulm_custom_card_speedtest_upload_speed_color: "Upload gauge color",
    ulm_custom_card_speedtest_upload_speed_max: "Upload gauge maximum",
    ulm_custom_card_speedtest_ping_entity: "Ping sensor",
    ulm_custom_card_speedtest_ping_color: "Ping gauge color",
    ulm_custom_card_speedtest_ping_max: "Ping gauge maximum",
    ulm_custom_card_speedtest_round: "Round speed values",
    ulm_custom_card_divider_title_name: "Divider title",
    ulm_custom_card_divider_title_nav: "Back navigation path",
    ulm_custom_card_divider_subtitle_name: "Divider subtitle",
    ulm_custom_card_nas_text: "NAS status label",
    ulm_custom_card_nas_sensor: "NAS status sensor",
    ulm_custom_card_nas_unit: "NAS status unit",
    ulm_custom_cad_nas_unit: "NAS status unit",
    ulm_card_update_enable_controls: "Show update controls",
    ulm_card_update_collapsible: "Collapse controls when up to date",
    ulm_card_update_horizontal: "Use horizontal update layout",
    ulm_card_update_narrow_buttons: "Use narrow update buttons",
    ulm_card_update_icon: "Update icon",
    ulm_language: "Clock locale",
    ulm_custom_card_entity_1_name: "Door name",
    ulm_custom_card_entity_1_lock: "Door lock",
    ulm_custom_card_entity_1_lock_battery: "Door lock battery",
    ulm_card_homeassistant_entity: "Overall updates entity",
    ulm_card_homeassistant_core: "Home Assistant Core update entity",
    ulm_card_homeassistant_supervisor: "Supervisor update entity",
    ulm_card_homeassistant_os: "Home Assistant OS update entity",
    tablet_button_usb_entity: "USB control",
    tablet_button_motion_entity: "Motion control",
    tablet_button_display_entity: "Display control",
    tablet_restart_entity: "Restart button",
    tablet_maintenance_entity: "Maintenance mode control",
    tablet_reload_entity: "Reload button",
    tablet_ram_entity: "RAM usage sensor",
    tablet_disk_entity: "Disk usage sensor",
    tablet_power_entity: "Power state entity",
    group_lights: "Lights group",
    group_motions: "Motion group",
    group_doors: "Doors group",
    group_windows: "Windows group",
    group_outlets: "Outlets group",
    group_tv: "Televisions group",
    group_water: "Water sensors group",
    group_windows_shutters: "Shutters group",
    temperature: "Temperature sensor",
    humidity: "Humidity sensor",
    ulm_show_button: "Show oscillation button",
    ulm_button_icon: "Oscillation button icon",
    ulm_button_service: "Oscillation service",
    ulm_card_flower_entity: "Plant entity",
    ulm_card_flower_name: "Plant name",
    ulm_card_flower_species: "Plant species",
    ulm_card_flower_show_bars: "Plant attribute bars",
    moisture_entity: "Moisture sensor",
    conductivity_entity: "Conductivity sensor",
    illuminance_entity: "Illuminance sensor",
    dli_entity: "Daily light integral sensor",
    console_show_artwork: "Show game artwork",
    console_show_controls: "Show console controls",
    followers_entity: "Followers entity",
    following_entity: "Following entity",
    friends_entity: "Friends entity",
    primary_stat_entity: "Top-right primary statistic",
    secondary_stat_entity: "Top-right secondary statistic",
    primary_stat_icon: "Primary statistic icon",
    secondary_stat_icon: "Secondary statistic icon",
    now_playing_entity: "Current game entity",
    gamerpic_entity: "Profile image entity",
    artwork_entity: "Game artwork entity",
    console_power_entity: "Console power entity",
    ulm_custom_card_window_handle: "Handle position sensor",
    ulm_custom_card_window_name: "Door or window name",
    ulm_custom_card_window_icon: "Door or window icon",
    ulm_custom_card_window_color: "Open state color",
    ulm_custom_card_window_force_background_color: "Color active background",
    ulm_custom_card_window_battery_level: "Battery level sensor",
    ulm_custom_card_window_battery_warning: "Battery warning threshold",
    ulm_custom_card_window_battery_warning_low: "Low battery threshold",
    ulm_show_last_changed: "Show last changed",
    ulm_card_printer_name: "Printer name",
    cartridges: "Printer cartridges",
    ulm_custom_card_room_overview_light_entity: "Room light",
    ulm_custom_card_room_overview_climate_entity: "Room climate",
    ulm_custom_card_room_overview_cover_entity: "Room cover",
    ulm_card_room_overview_light_icon_on: "Light-on icon",
    ulm_card_room_overview_light_icon_off: "Light-off icon",
    ulm_card_room_overview_cover_icon_open: "Open-cover icon",
    ulm_card_room_overview_cover_icon_closed: "Closed-cover icon",
    ulm_card_dynamic_color: "Use the light color as the room accent",
    ulm_card_welcome_collapse: "Welcome collapse helper",
    ulm_weather: "Weather provider",
    nav_1: "First navigation path",
    icon_1: "First navigation icon",
    name_1: "First navigation name",
    color_1: "First navigation color",
    nav_2: "Second navigation path",
    icon_2: "Second navigation icon",
    name_2: "Second navigation name",
    color_2: "Second navigation color",
    nav_3: "Third navigation path",
    icon_3: "Third navigation icon",
    name_3: "Third navigation name",
    color_3: "Third navigation color",
    nav_4: "Fourth navigation path",
    icon_4: "Fourth navigation icon",
    name_4: "Fourth navigation name",
    color_4: "Fourth navigation color",
    nav_5: "Fifth navigation path",
    icon_5: "Fifth navigation icon",
    name_5: "Fifth navigation name",
    color_5: "Fifth navigation color"
  },
  de: {
    entity: "Entität",
    name: "Name",
    secondary: "Sekundärinformation",
    icon: "Symbol",
    icon_color: "Symbolfarbe",
    variant: "Variante",
    layout: "Layout",
    show_icon: "Symbol anzeigen",
    show_state: "Status anzeigen",
    tap_action: "Tippaktion",
    hold_action: "Halteaktion",
    double_tap_action: "Doppeltippaktion",
    temperature_entity: "Temperatursensor",
    humidity_entity: "Feuchtigkeitssensor",
    battery_entity: "Batteriesensor",
    show_forecast: "Vorhersage anzeigen",
    show_controls: "Steuerung anzeigen"
  },
  es: {
    entity: "Entidad",
    name: "Nombre",
    secondary: "Información secundaria",
    icon: "Icono",
    icon_color: "Color del icono",
    variant: "Variante",
    layout: "Diseño",
    show_icon: "Mostrar icono",
    show_state: "Mostrar estado",
    tap_action: "Acción al tocar",
    hold_action: "Acción al mantener",
    double_tap_action: "Acción de doble toque",
    temperature_entity: "Sensor de temperatura",
    humidity_entity: "Sensor de humedad",
    battery_entity: "Sensor de batería",
    show_forecast: "Mostrar pronóstico",
    show_controls: "Mostrar controles"
  },
  fr: {
    entity: "Entité",
    name: "Nom",
    secondary: "Information secondaire",
    icon: "Icône",
    icon_color: "Couleur de l’icône",
    variant: "Variante",
    layout: "Disposition",
    show_icon: "Afficher l’icône",
    show_state: "Afficher l’état",
    tap_action: "Action au toucher",
    hold_action: "Action au maintien",
    double_tap_action: "Action au double toucher",
    temperature_entity: "Capteur de température",
    humidity_entity: "Capteur d’humidité",
    battery_entity: "Capteur de batterie",
    show_forecast: "Afficher les prévisions",
    show_controls: "Afficher les commandes"
  },
  nl: {
    room_light_entity: "Lamp voor kameraccent",
    room_temperature_entity: "Temperatuurentiteit voor kamer",
    room_brightness_entity: "Lamp voor kamerhelderheid",
    room_move_up: "Omhoog",
    room_move_down: "Omlaag",
    room_secondary_help: "Stel de secundaire informatie op volgorde samen. Alle waarden komen van de primaire entiteit; labelschakelaars en hun gekozen entiteiten overschrijven deze lijst niet. Niet-beschikbare waarden worden weggelaten.",
    room_secondary_value: "Waarde",
    room_part_text: "Tekst",
    room_part_name: "Entiteitsnaam",
    room_part_state: "Status (aan/uit, enz.)",
    room_part_brightness: "Helderheid (%)",
    room_part_temperature: "Temperatuur",
    room_part_attribute: "Entiteitsattribuut",
    room_part_add: "Informatiedeel toevoegen",
    room_part_remove: "Informatiedeel verwijderen",
    room_buttons: "Kamersensorknoppen",
    room_buttons_help: "Actieknoppen staan los van de kleine statuspictogrammen. Kies een entiteit om pictogram, weergave, actieve status en acties in te vullen; deze waarden zijn aanpasbaar.",
    active_state: "Actieve status",
    room_active_state_help: "De exacte entiteitsstatus die deze actieknop markeert.",
    room_button_action_help: "Sensoren openen meer informatie; bedienbare entiteiten schakelen standaard om.",
    room_status: "Statuspictogrammen",
    room_status_help: "Voeg maximaal vier kleine entiteitspictogrammen toe, los van de actieknoppen. Water en brand/rook pulseren blauw en rood bij alarm. Bij minder beweging blijft alleen de alarmkleur zichtbaar.",
    room_status_kind: "Soort pictogram",
    room_status_window: "Raam",
    room_status_door: "Deur",
    room_status_motion: "Beweging / bezetting",
    room_status_water: "Water / vocht",
    room_status_smoke: "Brand / rook",
    room_status_active: "Geactiveerd",
    room_status_inactive: "Inactief",
    room_status_unavailable: "Niet beschikbaar",
    room_status_preview: "Pictogramvoorbeeld",
    room_status_choose_entity: "Kies een entiteit",
    room_status_add: "Statuspictogram toevoegen",
    room_status_remove: "Statuspictogram verwijderen",
    ulm_card_dynamic_color: "Gebruik de lichtkleur als kameraccent",
    entity: "Entiteit",
    name: "Naam",
    secondary: "Secundaire informatie",
    icon: "Pictogram",
    icon_color: "Pictogramkleur",
    variant: "Variant",
    layout: "Indeling",
    show_icon: "Pictogram tonen",
    show_state: "Status tonen",
    tap_action: "Tikactie",
    hold_action: "Vasthoudactie",
    double_tap_action: "Dubbeltikactie",
    temperature_entity: "Temperatuursensor",
    humidity_entity: "Vochtigheidssensor",
    battery_entity: "Batterijsensor",
    show_today: "Afval van vandaag tonen",
    today_entity: "Sensor voor afval van vandaag",
    show_tomorrow: "Afval van morgen tonen",
    tomorrow_entity: "Sensor voor afval van morgen",
    show_forecast: "Voorspelling tonen",
    show_controls: "Bediening tonen"
  }
}, G = (e, t) => {
  const o = e?.language?.split("-")[0] ?? "en";
  return Po[o]?.[t] ?? Po.en[t] ?? t.replace(/^ulm_(?:custom_)?card_/, "").replace(/^(?:custom_)?card_/, "").replace(/^ulm_/, "").replaceAll("_", " ").replace(/\b\w/g, (a) => a.toUpperCase());
}, Sr = {
  entity: "The Home Assistant entity shown and controlled by this card.",
  room_light_entity: "Optional light used by the room accent. Defaults to the main entity when it is a light. Active RGB group members are supported; off, missing or invalid RGB keeps the normal theme.",
  room_temperature_entity: "Optional sensor or climate entity for the temperature label. Defaults to the primary entity. Only numeric temperatures with a temperature unit are shown.",
  room_brightness_entity: "Optional light for the brightness label. Defaults to the primary light, then the Room accent light. Only a valid brightness attribute is shown as a percentage.",
  label_use_temperature: "Room automatic/state secondary information: include a valid temperature. None, custom, composed and explicit name/time modes take precedence.",
  label_use_brightness: "Room automatic/state secondary information: include a valid brightness percentage alongside temperature. None, custom, composed and explicit name/time modes take precedence.",
  carousel_show_header: "Show the title, icon and primary/secondary information above the carousel. Turn off to show only the carousel.",
  buy_sell_title: "Title shown above the price chart.",
  buy_sell_show_result: "Show estimated buy costs, sell revenue and net result below the chart.",
  buy_sell_trade_energy: "Energy to sell. Required buy energy includes round-trip losses.",
  buy_sell_trade_energy_entity: "Optional numeric kWh entity that overrides the fixed trade size. Unavailable values show an error instead of an estimate.",
  buy_sell_trade_power: "Maximum charging and selling power used to calculate energy per price slot.",
  buy_sell_trade_efficiency: "Percentage of purchased energy available to sell after storage losses.",
  buy_sell_feed_in_fee: "Fee deducted from each kWh sold. Set zero when already included in the supplied prices.",
  buy_sell_slot_minutes: "Duration of each price slot, capped at the next timestamp to prevent overlap. The final slot uses this duration.",
  buy_sell_graph_span: "Number of hours displayed in the chart.",
  buy_sell_span_start: "Choose whether the chart begins at midnight or at the current time.",
  buy_sell_update_interval: "Refresh the chart periodically even when the sensor does not update.",
  buy_sell_chart_height: "Height of the responsive price chart.",
  buy_sell_show_now: "Show a marker at the current time.",
  buy_sell_now_label: "Text displayed beside the current-time marker.",
  buy_sell_now_color: "Color used for the current-time marker.",
  buy_sell_show_legend: "Show the series legend below the chart.",
  buy_sell_show_grid: "Show horizontal chart grid lines.",
  buy_sell_axis_label: "Unit or description shown on the price axis.",
  buy_sell_min_value: "Optional lower bound for the chart price axis.",
  buy_sell_max_value: "Optional upper bound for the chart price axis.",
  buy_sell_price_decimals: "Number of decimals shown for the current price.",
  buy_sell_axis_decimals: "Number of decimals shown on the price-axis ticks.",
  buy_sell_bar_radius: "Corner radius applied to chart columns.",
  buy_sell_price_label: "Legend label for the price series.",
  buy_sell_charge_label: "Legend label for planned grid charging.",
  buy_sell_planned_sell_label: "Legend label for planned energy sales.",
  buy_sell_possible_sell_label: "Legend label for possible energy sales.",
  buy_sell_price_color: "Color used for price columns.",
  buy_sell_charge_color: "Color used for planned grid-charge columns.",
  buy_sell_planned_sell_color: "Color used for planned-sale columns.",
  buy_sell_possible_sell_color: "Color used for possible-sale columns.",
  panel_health_title: "Title shown above the panel summary and gauges.",
  panel_entities: "Choose which inverter panel output sensors to include.",
  panel_gauge_max: "Watts corresponding to a fully filled gauge.",
  panel_warning_average_min: "Only evaluate the low-panel warning when the average exceeds this value.",
  panel_low_output_percent: "Warn when the weakest panel is below this share of the average.",
  panel_segment_1: "Output threshold where the second gauge color begins.",
  panel_segment_2: "Output threshold where the third gauge color begins.",
  panel_segment_3: "Output threshold where the fourth gauge color begins.",
  panel_segment_4: "Output threshold where the fifth gauge color begins.",
  panel_color_0: "Gauge color used below the first output threshold.",
  panel_color_1: "Gauge color used from the first output threshold.",
  panel_color_2: "Gauge color used from the second output threshold.",
  panel_color_3: "Gauge color used from the third output threshold.",
  panel_color_4: "Gauge color used from the fourth output threshold.",
  panel_color_5: "Gauge color used at the highest output range.",
  panel_show_summary: "Display aggregate panel statistics.",
  panel_show_gauges: "Display individual panel output gauges.",
  name_mode: "Choose whether the card uses the entity name, a custom name, or no name.",
  name: "Used when Name is set to Use custom name.",
  secondary: "Optional supporting text shown below the main name or state.",
  icon: "Optional icon override. Leave empty to use the card's recommended icon.",
  variant: "Choose the upstream layout or behavior represented by this unified component.",
  icon_type: "Choose an icon, the entity picture when available, or no icon.",
  layout: "Choose whether the card content is arranged horizontally or vertically.",
  multiline_secondary: "The card may be taller to fit the text and will not always align with the grid system.",
  fill_container: "Makes the card stretch to fill the available dashboard grid cell.",
  primary_info: "Choose the main text displayed by the card.",
  secondary_info: "Choose the supporting text displayed below the primary information.",
  tap_action: "What happens when the card is tapped.",
  hold_action: "What happens when the card is pressed and held.",
  crossfade_entity: "Automatically selected from the Sonos device linked to the primary media player.",
  night_sound_entity: "Automatically selected from the Sonos device linked to the primary media player.",
  speech_enhancement_entity: "Automatically selected from the Sonos device linked to the primary media player.",
  subwoofer_entity: "Automatically selected from the Sonos device linked to the primary media player.",
  surrounds_entity: "Automatically selected from the Sonos device linked to the primary media player.",
  loudness_entity: "Automatically selected from the Sonos device linked to the primary media player.",
  surround_full_entity: "Automatically selected from the Sonos device linked to the primary media player.",
  audio_delay_entity: "Automatically selected from the Sonos device linked to the primary media player.",
  balance_entity: "Automatically selected from the Sonos device linked to the primary media player.",
  bass_entity: "Automatically selected from the Sonos device linked to the primary media player.",
  treble_entity: "Automatically selected from the Sonos device linked to the primary media player.",
  sub_gain_entity: "Automatically selected from the Sonos device linked to the primary media player.",
  surround_level_entity: "Automatically selected from the Sonos device linked to the primary media player.",
  music_surround_level_entity: "Automatically selected from the Sonos device linked to the primary media player.",
  level_entity: "Numeric pollen level sensor using the source scale from 0 through 6.",
  clock_switch_entity: "Optional input boolean toggled when the clock card is tapped.",
  double_tap_action: "What happens when the card is tapped twice.",
  hours_to_show: "Number of recent recorder-history hours included in the graph.",
  points_per_hour: "Controls graph detail by setting the target number of aggregated points per hour.",
  aggregate_func: "Function used to combine recorder values in each time bucket.",
  group_by: "Use dynamic intervals, calendar dates, or clock hours as aggregation buckets.",
  update_interval: "Optional polling interval in seconds. Leave empty to refresh when the card configuration or entity data changes.",
  cache: "Stores recorder history locally for faster dashboard reloads.",
  height: "Height of the SVG chart in pixels. Use zero to hide its vertical area.",
  line_width: "Stroke thickness used for line graphs and points.",
  bar_spacing: "Space in pixels between adjacent bars.",
  smoothing: "Draws curved lines instead of straight segments.",
  animate: "Reveals graph series when new history is rendered.",
  logarithmic: "Uses logarithmic Y-axis positioning for values spanning several orders of magnitude.",
  value_factor: "Scales values by ten to this exponent, such as -3 to convert watts to kilowatts.",
  decimals: "Exact decimal places used for states, labels, legends, and statistics.",
  hour24: "Formats graph tooltips with a 24-hour clock.",
  font_size: "State text size as a percentage of the normal Mini Graph state size.",
  font_size_header: "Header text size in pixels.",
  align_header: "Positions the name and header icon.",
  align_icon: "Places the icon at the left, right, or beside the current state.",
  align_state: "Aligns the current and secondary states.",
  unit: "Overrides the Home Assistant unit for every series unless a series has its own unit.",
  icon_image: "Optional image URL used instead of the selected Material Design icon.",
  lower_bound: "Hard numeric lower bound, or a soft bound prefixed with ~ such as ~20.",
  upper_bound: "Hard numeric upper bound, or a soft bound prefixed with ~ such as ~25.",
  min_bound_range: "Ensures the primary Y-axis spans at least this numeric range.",
  lower_bound_secondary: "Hard or ~soft lower bound for entities assigned to the secondary axis.",
  upper_bound_secondary: "Hard or ~soft upper bound for entities assigned to the secondary axis.",
  min_bound_range_secondary: "Ensures the secondary Y-axis spans at least this numeric range.",
  color_thresholds_transition: "Smoothly blends threshold colors or changes them at hard boundaries.",
  group: "Removes the shadow and rounded background when embedding this card.",
  mini_graph_show_state: "Shows the current state, latest graph value, or no state.",
  mini_graph_show_fill: "Fills the area below line graphs with a solid or faded color.",
  mini_graph_show_points: "Shows every point, points on hover, or no points.",
  mini_graph_show_labels: "Shows primary-axis labels always, on hover, or never.",
  mini_graph_show_labels_secondary: "Shows secondary-axis labels always, on hover, or never.",
  mini_graph_show_legend: "Shows an ordered legend when more than one series is visible.",
  mini_graph_show_average: "Displays the primary series average below the graph.",
  mini_graph_show_extrema: "Displays the primary series minimum and maximum below the graph.",
  mini_graph_name_adaptive_color: "Colors the card name from the primary series thresholds.",
  mini_graph_icon_adaptive_color: "Colors the header icon from the primary series thresholds.",
  mini_graph_loading_indicator: "Shows a spinner while recorder history is loading.",
  weather_entity: "Weather entity used by the source-specific welcome or date presentation.",
  settings_path: "Dashboard path opened by the welcome settings button.",
  collapse_entity: "Input boolean that hides or shows the welcome scene pills.",
  collapsed: "Forces the welcome scene pills to stay hidden.",
  show_controls: "Shows the controls defined by the pinned source design.",
  show_forecast: "Loads the daily weather forecast used by the detailed source design.",
  show_name: "Shows the configured entity name.",
  show_state: "Shows the configured entity state.",
  temperature_entity: "Optional sensor used when temperature comes from a separate entity.",
  humidity_entity: "Optional sensor used when humidity comes from a separate entity.",
  window_sensor: "Optional contact sensor used to show whether a window or door is open.",
  trees_entity: "Sensor containing the tree pollen severity state.",
  grass_entity: "Sensor containing the grass pollen severity state.",
  weeds_entity: "Sensor containing the weed pollen severity state.",
  battery_entity: "Optional sensor used to display a separate battery level.",
  consumption_entity: "Optional power sensor appended to the outlet state while it is on.",
  input_select_entity: "Optional input select changed by the room card double-tap action.",
  input_select_option: "Option selected on the configured room helper.",
  date_entity: "Sensor containing the source card's preformatted date text.",
  download_entity: "Speedtest download sensor shown by the card and refreshed by the test action.",
  upload_entity: "Speedtest upload sensor shown by the card and refreshed by the test action.",
  ping_entity: "Speedtest ping sensor refreshed together with download and upload.",
  wifi_tracker_entity: "Device tracker used by the source popup's Wi-Fi glance.",
  gps_tracker_entity: "Device tracker used by the source popup's GPS glance and map.",
  findmy_script_entity: "Script invoked by the source popup's phone finder control.",
  ulm_card_input_datetime_name: "Optional source-compatible name shown in the datetime header.",
  ulm_card_input_number_name: "Optional source-compatible name shown in the input-number header.",
  ulm_custom_card_weather_metrics_entity_1: "Entity shown in the first weather metric slot.",
  ulm_custom_card_weather_metrics_entity_2: "Entity shown in the second weather metric slot.",
  ulm_custom_card_weather_metrics_entity_3: "Entity shown in the third weather metric slot.",
  ulm_custom_card_weather_metrics_entity_4: "Entity shown in the fourth weather metric slot.",
  ulm_custom_card_weather_metrics_name_1: "Label shown below the first weather metric.",
  ulm_custom_card_weather_metrics_name_2: "Label shown below the second weather metric.",
  ulm_custom_card_weather_metrics_name_3: "Label shown below the third weather metric.",
  ulm_custom_card_weather_metrics_name_4: "Label shown below the fourth weather metric.",
  disk_entity: "Sensor containing disk or volume usage.",
  memory_entity: "Sensor containing memory usage as a percentage.",
  cpu_entity: "Sensor containing total CPU utilization as a percentage.",
  disk_name: "Friendly label shown for the disk slot.",
  disk_icon: "Icon shown in the disk tile.",
  disk_color: "Accent color used by the disk tile.",
  temperature_name: "Friendly label shown for the temperature slot.",
  temperature_icon: "Icon shown next to temperature.",
  temperature_color: "Accent and outer-ring color used for temperature.",
  temperature_max: "Maximum value represented by a complete outer ring.",
  memory_name: "Friendly label shown for the memory slot.",
  memory_icon: "Icon shown next to memory usage.",
  memory_color: "Accent and middle-ring color used for memory.",
  memory_max: "Maximum value represented by a complete middle ring.",
  cpu_name: "Friendly label shown for the CPU slot.",
  cpu_icon: "Icon shown next to CPU usage.",
  cpu_color: "Accent and inner-ring color used for CPU.",
  cpu_max: "Maximum value represented by a complete inner ring.",
  graph_span: "Source-compatible history range such as 1d; retained for YAML compatibility.",
  ulm_custom_card_nas_text: "Text shown before the NAS sensor state.",
  ulm_custom_card_nas_sensor: "Legacy source field for the NAS sensor; migrated to the main entity.",
  ulm_custom_card_nas_unit: "Text appended directly after the NAS sensor state.",
  ulm_custom_cad_nas_unit: "Legacy spelling of the text appended after the NAS sensor state.",
  ulm_card_update_enable_controls: "Shows the source install and skip buttons.",
  ulm_card_update_collapsible: "Hides update controls while the entity is not reporting an available update.",
  ulm_card_update_horizontal: "Places the status and controls next to each other.",
  ulm_card_update_narrow_buttons: "Gives the update status more room in horizontal mode.",
  ulm_card_update_icon: "Optional icon override for the update status.",
  ulm_language: "Locale used when the clock falls back to the browser date.",
  ulm_custom_card_entity_1_name: "Name displayed beside the door icon.",
  ulm_custom_card_entity_1_lock: "Legacy source field for the lock controlled by the door buttons.",
  ulm_custom_card_entity_1_lock_battery: "Legacy source field for the lock battery badge.",
  chart_type: "The upstream NAS design uses radial utilization rings.",
  graph_entity: "Sensor whose history is plotted in the card.",
  eta_entity: "Optional sensor containing an estimated arrival time.",
  address_entity: "Optional sensor containing a location or address.",
  min_entity: "Optional sensor used as the lower comparison value.",
  max_entity: "Optional sensor used as the upper comparison value.",
  show_today: "Shows a compact Today summary when the selected sensor contains a real collection value.",
  today_entity: "Sensor containing the waste type collected today. Empty and no-collection values are hidden.",
  show_tomorrow: "Shows a compact Tomorrow summary when the selected sensor contains a real collection value.",
  tomorrow_entity: "Sensor containing the waste type collected tomorrow. Empty and no-collection values are hidden.",
  datetime_entity: "Date and time helper controlled by this card.",
  time_entity: "Time or runtime sensor used by the source-specific presentation.",
  qubino_more_info_entity: "Entity opened by the Qubino card surface, matching the source pilot-wire input select.",
  series_2_entity: "Optional second sensor displayed in the chart legend.",
  series_3_entity: "Optional third sensor displayed in the chart legend.",
  ulm_card_alarm_time_step: "Minutes added or removed by each alarm-time button.",
  ulm_card_alarm_time_collapse: "Hides the time controls while the alarm is off.",
  ulm_card_alarm_time_horizontal: "Places the alarm details and time controls side by side.",
  ulm_card_alarm_time_icon: "Icon shown beside the alarm name and state.",
  ulm_card_alarm_time_color: "Accent color used while the alarm is active.",
  ulm_card_media_player_with_controls_name: "Friendly name shown for the media player.",
  temperature: "Temperature sensor shown in the RoomView header.",
  humidity: "Humidity sensor shown in the RoomView header.",
  climate_name: "Independent Roomview climate name, including composed entity, area or device names. Does not change the primary entity header.",
  climate_icon: "Independent climate icon override. Defaults to the temperature entity icon, then a thermometer.",
  climate_icon_type: "Shows a climate icon, the temperature entity picture, or no climate icon.",
  climate_primary_info: "Climate primary text: temperature state by default, or the configured climate name, state, or none.",
  climate_secondary_info: "Optional climate secondary override using the temperature entity's name or state, or none. Leave unset for humidity or custom text.",
  climate_secondary: "Custom climate secondary text when no secondary information override is selected; defaults to humidity.",
  ...Object.fromEntries(["lights", "shutters", "outlets", "tv"].flatMap((e) => [
    [`${e}_tap_action`, "Single-tap or keyboard action for this device only. Defaults to more information about its configured control entity; None disables it."],
    [`${e}_hold_action`, "Hold action for this device only, after 500 ms. Defaults to more information; None disables it."],
    [`${e}_double_tap_action`, "Double-tap action for this device only. Defaults to the legacy toggle, without also running the single-tap action; None disables it."]
  ])),
  group_lights: "Named Home Assistant group containing the room lights.",
  group_motions: "Named Home Assistant group containing motion sensors.",
  group_doors: "Named Home Assistant group containing door sensors.",
  group_windows: "Named Home Assistant group containing window sensors.",
  group_outlets: "Named Home Assistant group containing outlets.",
  group_tv: "Named Home Assistant group containing televisions.",
  group_water: "Named Home Assistant group containing water sensors.",
  group_windows_shutters: "Named Home Assistant group containing window shutters.",
  ulm_custom_card_room_overview_light_entity: "Light shown in the first semantic room control slot.",
  ulm_custom_card_room_overview_climate_entity: "Climate entity shown in the second semantic room control slot.",
  ulm_custom_card_room_overview_cover_entity: "Cover entity shown in the second semantic room control slot when configured.",
  ulm_card_room_overview_light_icon_on: "Icon shown by the semantic light control while the light is on.",
  ulm_card_room_overview_light_icon_off: "Icon shown by the semantic light control while the light is off.",
  ulm_card_room_overview_cover_icon_open: "Icon shown by the semantic cover control while open.",
  ulm_card_room_overview_cover_icon_closed: "Icon shown by the semantic cover control while closed.",
  ulm_card_dynamic_color: "Uses the configured light's RGB color for the active room card.",
  ulm_show_button: "Shows the source oscillation service button beside the speed slider.",
  ulm_button_icon: "Icon displayed on the source fan service button.",
  ulm_button_service: "Home Assistant domain.service called by the source fan button.",
  ulm_card_flower_entity: "Plant entity supplying status and flower-card attribute values.",
  ulm_card_flower_name: "Name displayed in the plant summary.",
  ulm_card_flower_species: "Species identifier retained for source-compatible configuration.",
  ulm_card_flower_show_bars: "Select every plant measurement bar to display.",
  moisture_entity: "Sensor supplying the moisture value for the selected Flower bar.",
  conductivity_entity: "Sensor supplying the conductivity value for the selected Flower bar.",
  illuminance_entity: "Sensor supplying the illuminance value for the selected Flower bar.",
  dli_entity: "Sensor supplying the daily light integral value for the selected Flower bar.",
  console_platform: "Automatically detects Xbox, PlayStation, or Nintendo, or lets you select the platform.",
  carousel_loop: "Wraps from the last item back to the first item while swiping.",
  carousel_show_labels: "Shows the selected item's name and current entity state below the carousel.",
  carousel_visible_items: "Odd number of cover-flow items visible at once, from 3 through 11.",
  carousel_initial_index: "Zero-based item position selected when the card loads.",
  carousel_effect: "Uses the three-dimensional coverflow layout or a flat sliding row.",
  carousel_grab_cursor: "Shows grab and grabbing cursors while interacting with the carousel.",
  carousel_centered_slides: "Keeps the selected slide centered; disable it to align the selected slide at the start.",
  carousel_slides_per_view: "Select Automatic to fit slides to the card width, or choose an exact count.",
  carousel_coverflow_rotate: "Degrees of Y-axis rotation applied to each step away from the selected slide.",
  carousel_coverflow_stretch: "Pixel spacing added between neighboring coverflow slides.",
  carousel_coverflow_depth: "How far neighboring slides recede into the three-dimensional scene.",
  carousel_coverflow_modifier: "Multiplies coverflow rotation, spacing, depth, and shadow strength.",
  carousel_coverflow_slide_shadows: "Adds directional shadows to slides that are away from the selected position.",
  scene_buttons_only: "Hides the card name, primary entity information, and supporting content so only scene buttons remain.",
  console_show_artwork: "Uses the selected game artwork as the card background when available.",
  console_show_controls: "Shows a power control when a compatible remote, media player, or switch is configured.",
  followers_entity: "Automatically discovered from the console account device when available.",
  following_entity: "Automatically discovered from the console account device when available.",
  friends_entity: "Automatically discovered from the console account device when available.",
  primary_stat_entity: "Statistic shown at the top right, such as Xbox Gamerscore.",
  secondary_stat_entity: "Optional second top-right statistic, such as ranking.",
  primary_stat_icon: "Icon displayed beside the primary top-right statistic.",
  secondary_stat_icon: "Icon displayed beside the secondary top-right statistic.",
  now_playing_entity: "Entity whose state contains the currently playing game.",
  gamerpic_entity: "Image or camera entity used for the profile picture.",
  artwork_entity: "Image or camera entity used for the game background.",
  console_power_entity: "Remote, media player, or switch used by the card's power button.",
  ulm_custom_card_window_handle: "Sensor whose Closed, Tilted, or Open state is combined with the contact.",
  ulm_custom_card_window_name: "Optional name replacing the contact entity friendly name.",
  ulm_custom_card_window_icon: "Optional icon replacing the contact entity icon.",
  ulm_custom_card_window_color: "Accent used for valid open and tilted states.",
  ulm_custom_card_window_force_background_color: "Applies the state accent to the card background while open or manipulated.",
  ulm_custom_card_window_battery_level: "Optional numeric battery percentage sensor.",
  ulm_custom_card_window_battery_warning: "Battery percentage at or below which the warning badge appears.",
  ulm_custom_card_window_battery_warning_low: "Battery percentage at or below which the warning badge becomes critical.",
  ulm_show_last_changed: "Shows the contact's last-changed timestamp instead of the combined state label.",
  ulm_card_printer_name: "Name displayed in the interactive printer summary.",
  cartridges: "Ordered cartridge objects containing label, entity_id, type, and CSS color values.",
  ulm_card_welcome_collapse: "Optional input_boolean toggled by the top-left collapse control.",
  ulm_weather: "Weather entity opened by the center topbar control.",
  nav_1: "Dashboard path opened by the first navigation pill.",
  icon_1: "Icon for the first navigation pill.",
  name_1: "Label for the first navigation pill.",
  color_1: "Source color for the first navigation pill.",
  nav_2: "Dashboard path opened by the second navigation pill.",
  icon_2: "Icon for the second navigation pill.",
  name_2: "Label for the second navigation pill.",
  color_2: "Source color for the second navigation pill.",
  nav_3: "Dashboard path opened by the third navigation pill.",
  icon_3: "Icon for the third navigation pill.",
  name_3: "Label for the third navigation pill.",
  color_3: "Source color for the third navigation pill.",
  nav_4: "Dashboard path opened by the fourth navigation pill.",
  icon_4: "Icon for the fourth navigation pill.",
  name_4: "Label for the fourth navigation pill.",
  color_4: "Source color for the fourth navigation pill.",
  nav_5: "Dashboard path opened by the fifth navigation pill.",
  icon_5: "Icon for the fifth navigation pill.",
  name_5: "Label for the fifth navigation pill.",
  color_5: "Source color for the fifth navigation pill.",
  lock_entity: "Optional lock entity controlled alongside the door sensor.",
  navigation_path: "Dashboard path opened when the navigation card is tapped.",
  show_graph: "Displays recent sensor history when available.",
  use_entity_picture: "Uses the entity picture instead of the selected icon.",
  ulm_card_battery_battery_level_danger: "Battery percentages at or below this value use the critical color.",
  ulm_card_battery_battery_level_warning: "Battery percentages at or below this value use the warning color.",
  ulm_card_battery_attribute: "Optional entity attribute containing the battery percentage instead of the state.",
  ulm_card_battery_battery_state_entity_id: "Entity whose charging state drives the charging icon and optional animation.",
  ulm_card_battery_charger_type_entity_id: "Entity whose wireless, AC, USB, or charging state selects the charging icon.",
  ulm_card_battery_charging_animation: "Shows a visual charging animation when charging is detected.",
  ulm_card_battery_color_battery_level_danger: "Accent used at or below the low battery threshold.",
  ulm_card_battery_color_battery_level_warning: "Accent used at or below the warning threshold.",
  ulm_card_battery_color_battery_level_ok: "Accent used above the configured warning thresholds.",
  ulm_card_battery_name: "Optional source-compatible name override.",
  ulm_card_media_player_enable_art: "Uses the current album, program, or media image when available.",
  sonos_details_always_visible: "Shows all Sonos switches and sliders without a collapsible More details section.",
  use_media_info: "Use the media title and artist in the shared header. Explicit primary and secondary information choices still apply.",
  show_volume_level: "Include the current volume percentage in the header.",
  volume_controls: "Select mute, a volume slider, or volume buttons. Controls unsupported by the entity are hidden; clear all to hide volume controls.",
  media_controls: "Select playback controls. Only controls supported by the entity are shown; clear all to hide media controls.",
  collapsible_controls: "Hide controls when off, unknown, or unavailable, except a supported power control. Unknown and unavailable entities cannot be controlled.",
  ulm_card_media_player_enable_controls: "Adds previous, play/pause, and next buttons.",
  ulm_card_media_player_enable_volume_slider: "Lets you adjust the media player's volume from the card.",
  ulm_card_media_player_enable_volume_buttons: "Adds mute, volume-down, and volume-up controls.",
  ulm_card_media_player_enable_volume_adjust: "Exact volume-level increment used by the volume buttons.",
  ulm_card_media_player_collapsible: "Hides playback and volume controls while the player is inactive.",
  ulm_card_media_player_idle_off: "Treats the idle state like off when collapsible controls are enabled.",
  ulm_card_media_player_player_controls_entity: "Media player that receives playback and volume service calls.",
  ulm_card_media_player_more_info: "Shows artist and album metadata below the current title.",
  ulm_card_media_player_power_button: "Adds a power toggle in the top-right corner.",
  ulm_card_media_player_force_background_color: "Uses the selected accent color as the active card background.",
  ulm_card_media_player_color: "Accent color used for active media-player controls.",
  ulm_card_generic_color: "Accent color used while the generic entity is active.",
  ulm_card_generic_force_background_color: "Fills the generic card with its accent color while active.",
  ulm_card_generic_swap_color: "Accent color used by the swapped generic layout.",
  ulm_card_generic_swap_force_background_color: "Fills the swapped generic card with its accent color while active.",
  ulm_card_navigate_color: "Accent color used by the navigation icon.",
  ulm_card_binary_sensor_color: "Accent used while the binary sensor is active.",
  ulm_card_binary_sensor_force_background_color: "Uses the sensor accent as the card background while active.",
  ulm_card_binary_sensor_icon: "Optional source-compatible binary sensor icon override.",
  ulm_card_binary_sensor_name: "Optional source-compatible binary sensor name override.",
  ulm_card_binary_sensor_show_last_changed: "Displays how long ago the sensor changed state.",
  ulm_card_binary_sensor_alert_color: "Accent used while the alert sensor is active.",
  ulm_card_binary_sensor_alert_force_background_color: "Uses the alert accent as the card background while active.",
  ulm_card_binary_sensor_alert_icon: "Optional source-compatible alert icon override.",
  ulm_card_binary_sensor_alert_name: "Optional source-compatible alert name override.",
  ulm_card_binary_sensor_alert_show_last_changed: "Displays how long ago the alert changed state.",
  ulm_card_input_boolean_icon: "Optional source-compatible input boolean icon override.",
  ulm_card_input_boolean_name: "Optional source-compatible input boolean name override.",
  ulm_custom_card_washer_power: "Sensor used to show the washer's current power consumption.",
  ulm_custom_card_washer_remote_control: "Entity whose true or on state exposes remote washer controls.",
  ulm_custom_card_washer_machine_state: "Entity containing the washer run, pause, or stopped state.",
  ulm_custom_card_washer_machine_stop_state: "Exact machine-state value that means the washer is stopped.",
  ulm_custom_card_washer_job_state: "Entity containing the active configured program stage.",
  ulm_custom_card_washer_job_progress: "Percentage entity shown in the washer progress bar.",
  ulm_custom_card_washer_job_states: "Up to 5 named program stages with their Material Design icons.",
  ulm_custom_card_washer_delayed_start: "Input boolean toggled by the delayed-start control.",
  ulm_custom_card_washer_delayed_starttime: "Input datetime adjusted by the delayed-start controls.",
  ulm_custom_card_washer_label_idle: "Text shown while the machine is idle or off.",
  ulm_custom_card_washer_label_configuring: "Text shown while delayed start is being configured.",
  ulm_custom_card_washer_label_running: "Text shown while the machine is running.",
  ulm_custom_card_washer_start_action: "Home Assistant action emitted by the start control.",
  ulm_custom_card_washer_pause_action: "Home Assistant action emitted by the pause control.",
  ulm_custom_card_washer_stop_action: "Home Assistant action emitted by the stop control.",
  machine_state_entity: "Entity containing the washer or dryer run, pause, idle, or stopped state.",
  program_stage_entity: "Entity containing the active washer or dryer program stage.",
  washer_power_entity: "Sensor used to show the washer or dryer's current power consumption.",
  grid_power_entity: "Signed grid power sensor. Positive and negative values are displayed with a direction arrow.",
  grid_phase_1_entity: "Optional power sensor for grid phase L1.",
  grid_phase_2_entity: "Optional power sensor for grid phase L2.",
  grid_phase_3_entity: "Optional power sensor for grid phase L3.",
  solar_power_entity: "Sensor containing current total solar production.",
  solar_forecast_entity: "Sensor containing today's expected solar energy.",
  battery_level_entity: "Percentage sensor used by the central battery ring.",
  battery_power_entity: "Signed battery charge or discharge power sensor.",
  battery_1_level_entity: "Optional percentage sensor for battery unit 1.",
  battery_1_power_entity: "Optional power sensor for battery unit 1.",
  battery_2_level_entity: "Optional percentage sensor for battery unit 2.",
  battery_2_power_entity: "Optional power sensor for battery unit 2.",
  battery_3_level_entity: "Optional percentage sensor for battery unit 3.",
  battery_3_power_entity: "Optional power sensor for battery unit 3.",
  ev_charger_power_entity: "Optional EV charger or charge-point power sensor.",
  energy_mode_entity: "Optional sensor or select containing the current energy operating mode.",
  energy_auto_control_entity: "Boolean entity indicating whether automatic HEMS control is active.",
  electricity_price_entity: "Optional sensor containing the current electricity price.",
  tariff_markup_entity: "Per-kWh markup added to every raw tariff interval before VAT.",
  tariff_vat_entity: "Percentage added after the tariff markup.",
  grid_phase_scale_max: "Absolute phase power represented by a complete upper-left arc.",
  solar_scale_max: "Solar power represented by a complete lower-left arc.",
  battery_unit_scale_max: "Absolute per-battery power represented by a complete upper-right arc.",
  home_scale_max: "Home consumption represented by a complete lower-right arc.",
  energy_grid_label: "Text shown when grid power is close to zero.",
  energy_grid_import_label: "Text shown while importing power from the grid.",
  energy_grid_export_label: "Text shown while exporting power to the grid.",
  energy_solar_label: "Heading shown above current solar production.",
  energy_battery_label: "Heading shown above the individual battery units.",
  energy_home_label: "Heading shown above current home consumption.",
  energy_forecast_label: "Text placed before today's solar-energy forecast.",
  energy_ev_label: "Text placed before the EV charger power value.",
  energy_charge_label: "Text shown below the battery percentage while charging.",
  energy_discharge_label: "Text shown below the battery percentage while discharging.",
  energy_idle_label: "Text shown below the battery percentage while idle.",
  energy_auto_label: "Suffix shown when automatic HEMS control is enabled.",
  energy_manual_label: "Suffix shown when automatic HEMS control is disabled.",
  mode_solar_first_label: "Display name for the Smart Matching operation mode.",
  mode_smart_saving_label: "Display name for the Dynamic Smart Matching operation mode.",
  mode_smart_trading_label: "Display name for the Dynamic Trading + Smart Matching mode.",
  price_low_threshold: "All-in tariff values below this use the low-price color.",
  price_medium_threshold: "All-in tariff values below this use the medium-price color.",
  price_high_threshold: "All-in tariff values below this use the high-price color.",
  price_critical_threshold: "All-in tariff values at or above this use the critical-price color.",
  show_grid_phases: "Show the three phase arcs and L1, L2, and L3 values.",
  show_battery_units: "Show the three battery-unit arcs, percentages, and power values.",
  show_tariff_timeline: "Show today's colored tariff intervals and current-time marker.",
  import_color: "Color used for grid import and discharging battery-unit arcs.",
  export_color: "Color used for grid export.",
  solar_color: "Color used for the solar-production arc.",
  battery_color: "Color used for the central battery ring and charging unit arcs.",
  home_color: "Color used for the home-consumption arc.",
  price_negative_color: "Color used for negative all-in tariff intervals.",
  price_low_color: "Color used for low all-in tariff intervals.",
  price_medium_color: "Color used for medium all-in tariff intervals.",
  price_high_color: "Color used for high all-in tariff intervals.",
  price_critical_color: "Color used for critical all-in tariff intervals.",
  power_entity: "Entity used for the source-specific power readout.",
  door_entity: "Entity used for the washer door status.",
  finished_entity: "Entity used for the washer program-finished status.",
  battery_state_entity: "Entity used to detect whether the battery is charging.",
  battery_warning_threshold: "Battery levels at or below this percentage use the warning color. Default: 50%.",
  battery_low_threshold: "Battery levels at or below this percentage use the low battery color. Default: 20%.",
  battery_critical_threshold: "Battery levels at or below this percentage use the critical color. Default: 10%.",
  battery_healthy_color: "Color used above the warning threshold. Default: green.",
  battery_warning_color: "Color used between the warning and low thresholds. Default: yellow.",
  battery_low_color: "Color used between the low and critical thresholds. Default: orange.",
  battery_critical_color: "Color used at or below the critical threshold. Default: red.",
  charger_type_entity: "Optional entity containing the active charger type.",
  secondary_entity: "Optional secondary entity used when primary media metadata is incomplete.",
  darkMode: "Uses the dark palette documented by the upstream Sun Card.",
  language: "Locale used by source-specific labels and time formatting.",
  showAzimuth: "Shows the current solar azimuth below the sun arc.",
  showElevation: "Shows the current solar elevation below the sun arc.",
  showMoon: "Shows the Moon on the shared horizon, its phase and position, Moonrise and Moonset, and upcoming full and new Moon dates.",
  moon_entity: "Moon phase sensor. Automatically discovers Home Assistant's Moon integration when left empty.",
  moon_altitude_entity: "Moon altitude sensor. Automatically discovers Astronomy Space Suite ephemeris entities when left empty.",
  moon_azimuth_entity: "Moon azimuth sensor. Automatically discovered when available.",
  moon_rising_entity: "Optional timestamp sensor containing the next Moon rise.",
  moon_setting_entity: "Optional timestamp sensor containing the next Moon set.",
  moon_right_ascension_entity: "Moon right ascension sensor. Automatically discovered when available.",
  moon_declination_entity: "Moon declination sensor. Automatically discovered when available.",
  moon_distance_entity: "Moon distance sensor. Automatically discovered when available.",
  moon_angular_diameter_entity: "Moon apparent angular diameter sensor. Automatically discovered when available.",
  moon_phase_angle_entity: "Moon phase angle sensor. Automatically discovered when available.",
  moon_illumination_entity: "Moon illuminated percentage sensor. Automatically discovered when available.",
  moon_next_full_moon_entity: "Sensor containing the next full Moon date. Automatically discovered when available.",
  moon_next_new_moon_entity: "Sensor containing the next new Moon date. Automatically discovered when available.",
  moon_above_horizon_entity: "Boolean sensor indicating whether the Moon is above the horizon. Altitude is used as a fallback.",
  timeFormat: "Chooses 12-hour or 24-hour source time formatting.",
  title: "Optional title shown above the source-specific card.",
  ulm_custom_card_speedtest_download_speed_entity: "Legacy source key for the sensor shown by the download gauge.",
  ulm_custom_card_speedtest_download_speed_color: "Color used by the download radial gauge.",
  ulm_custom_card_speedtest_download_speed_max: "Sensor value represented by a complete download gauge.",
  ulm_custom_card_speedtest_upload_speed_entity: "Legacy source key for the sensor shown by the upload gauge.",
  ulm_custom_card_speedtest_upload_speed_color: "Color used by the upload radial gauge.",
  ulm_custom_card_speedtest_upload_speed_max: "Sensor value represented by a complete upload gauge.",
  ulm_custom_card_speedtest_ping_entity: "Legacy source key for the sensor shown by the ping gauge.",
  ulm_custom_card_speedtest_ping_color: "Color used by the ping radial gauge.",
  ulm_custom_card_speedtest_ping_max: "Sensor value represented by a complete ping gauge.",
  ulm_custom_card_speedtest_round: "Rounds download and upload values to whole numbers while preserving the source ping display.",
  ulm_custom_card_divider_title_name: "Legacy source key for the large divider title or inherited subtitle.",
  ulm_custom_card_divider_title_nav: "Optional path used by both the title surface and its back button.",
  ulm_custom_card_divider_subtitle_name: "Legacy documented key for the smaller divider subtitle.",
  ulm_card_homeassistant_entity: "Optional overall update-status entity used by legacy configurations.",
  ulm_card_homeassistant_core: "Update, sensor, or binary sensor containing installed and latest Core versions.",
  ulm_card_homeassistant_supervisor: "Update, sensor, or binary sensor containing installed and latest Supervisor versions.",
  ulm_card_homeassistant_os: "Update, sensor, or binary sensor containing installed and latest Home Assistant OS versions.",
  tablet_button_usb_entity: "Switch or helper toggled by the green USB control.",
  tablet_button_motion_entity: "Motion or presence entity toggled by the green motion control.",
  tablet_button_display_entity: "Switch or helper toggled by the green display control.",
  tablet_restart_entity: "Button entity pressed by the blue restart control.",
  tablet_maintenance_entity: "Switch or helper toggled by the orange maintenance control.",
  tablet_reload_entity: "Button entity pressed by the blue reload control.",
  tablet_ram_entity: "Sensor shown in the centered RAM metric.",
  tablet_disk_entity: "Sensor shown in the centered Disk metric.",
  tablet_power_entity: "Entity shown in the centered Power metric.",
  energy_entity: "Optional sensor containing the outlet's accumulated energy consumption.",
  black_entity: "Sensor containing the remaining black toner percentage.",
  yellow_entity: "Sensor containing the remaining yellow toner percentage.",
  magenta_entity: "Sensor containing the remaining magenta toner percentage.",
  cyan_entity: "Sensor containing the remaining cyan toner percentage.",
  custom_card_pollen_tree_name: "Optional tree item label; leave empty to use the entity friendly name or localized default.",
  custom_card_pollen_tree_icon: "Optional tree item icon; leave empty to use the entity icon or source default.",
  custom_card_pollen_grass_name: "Optional grass item label; leave empty to use the entity friendly name or localized default.",
  custom_card_pollen_grass_icon: "Optional grass item icon; leave empty to use the entity icon or source default.",
  custom_card_pollen_weed_name: "Optional weed item label; leave empty to use the entity friendly name or localized default.",
  custom_card_pollen_weed_icon: "Optional weed item icon; leave empty to use the entity icon or source default."
}, kr = (e) => Sr[e], Mr = [
  {
    upstreamId: "mini_graph_card",
    sourcePath: "https://github.com/kalkih/mini-graph-card",
    publicId: "mini_graph_card",
    rendererId: "mini_graph_card",
    layoutProfile: "card:recorder-history+svg-chart",
    primitives: [
      "ha-card",
      "ha-icon",
      "recorder-history",
      "svg"
    ],
    customFields: [
      "graph",
      "legend",
      "statistics"
    ],
    stateDriven: !0,
    animated: !0,
    actions: [
      "tap",
      "hold",
      "double_tap"
    ],
    variables: [],
    dependencies: [],
    backendRequirements: [
      "history/history_during_period"
    ],
    deviations: [
      "The renderer is an integrated TypeScript implementation and does not require the standalone mini-graph-card frontend resource."
    ],
    sourceDigest: "9d672bd3d743aa0901ba68d2940a4cb9f86da17df7c54fd93406833bde181b47"
  },
  {
    upstreamId: "card_battery",
    sourcePath: "reference_catalog/cards/card_battery.yaml",
    publicId: "card_battery",
    rendererId: "card_battery",
    layoutProfile: "card:button-card+popup",
    primitives: [
      "button-card",
      "popup"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "ulm_card_battery_battery_state_entity_id"
    ],
    stateDriven: !0,
    animated: !0,
    actions: [],
    variables: [
      {
        name: "ulm_card_battery_attribute",
        defaultValue: "<null>",
        selector: "text"
      },
      {
        name: "ulm_card_battery_battery_level_danger",
        defaultValue: "<null>",
        selector: "text"
      },
      {
        name: "ulm_card_battery_battery_level_warning",
        defaultValue: "<null>",
        selector: "text"
      },
      {
        name: "ulm_card_battery_battery_state_entity_id",
        defaultValue: "<null>",
        selector: "entity"
      },
      {
        name: "ulm_card_battery_charger_type_entity_id",
        defaultValue: "<null>",
        selector: "entity"
      },
      {
        name: "ulm_card_battery_charging_animation",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_battery_color_battery_level_danger",
        defaultValue: '"var(--google-red)"',
        selector: "color"
      },
      {
        name: "ulm_card_battery_color_battery_level_ok",
        defaultValue: '"var(--google-green)"',
        selector: "color"
      },
      {
        name: "ulm_card_battery_color_battery_level_warning",
        defaultValue: '"var(--google-yellow)"',
        selector: "color"
      },
      {
        name: "ulm_card_battery_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_popup",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_outlet_power_enable_popup",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_popup_power_outlet_graph_sensor",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_popup_power_outlet_sensor1",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_popup_power_outlet_sensor2",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_templates",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_engine",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_state",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "af55091a8c7e957582a315c1d6dc8dde0015681ce99c1abbc534e8abfe9b9372"
  },
  {
    upstreamId: "card_media_player",
    sourcePath: "reference_catalog/cards/card_media_player.yaml",
    publicId: "card_media_player",
    rendererId: "card_media_player",
    layoutProfile: "card:button-card+popup+control",
    primitives: [
      "button-card",
      "popup",
      "control"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "label",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "hold_action",
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_active_state",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_card_media_player_collapsible",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_media_player_color",
        defaultValue: '"blue"',
        selector: "color"
      },
      {
        name: "ulm_card_media_player_enable_art",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_media_player_enable_controls",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_media_player_enable_popup",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_media_player_enable_volume_adjust",
        defaultValue: "0",
        selector: "boolean"
      },
      {
        name: "ulm_card_media_player_enable_volume_buttons",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_media_player_enable_volume_slider",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_media_player_force_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_media_player_icon",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_media_player_idle_off",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_media_player_more_info",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_media_player_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_media_player_player_controls_entity",
        defaultValue: '"[[[ return entity.entity_id ]]]"',
        selector: "entity"
      },
      {
        name: "ulm_card_media_player_power_button",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_popup",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_templates",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_engine",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_on",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_state",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card",
      "my-slider"
    ],
    backendRequirements: [
      "media entity/services"
    ],
    deviations: [
      "Upstream embeds custom:my-slider; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "98d764b1b0ef8d266aa3ea592fbfdae0a1b8b37edf4944dfd0735e06f354578e"
  },
  {
    upstreamId: "card_room",
    sourcePath: "reference_catalog/cards/card_room.yaml",
    publicId: "card_room",
    rendererId: "card_room",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "label",
      "state"
    ],
    stateDriven: !0,
    animated: !0,
    actions: [
      "double_tap_action",
      "hold_action",
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_input_select",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_input_select_option",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_templates",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_engine",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_state",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [
      "Room selection helpers are ignored by this component; use explicit standard actions instead. Roomview and other components retain their own behavior.",
      "Original Room extensions add up to four typed status indicators and an optional RGB light accent. Water/smoke alerts respect reduced motion. Room action buttons infer entity defaults and retain legacy names only for accessibility."
    ],
    sourceDigest: "e72f25403653d056e1b206e2056f3898e0d469d35656c7f6a25d956e3a5f3fad"
  },
  {
    upstreamId: "card_scenes",
    sourcePath: "reference_catalog/cards/card_scenes_welcome.yaml",
    publicId: "card_scenes",
    variant: "welcome-pills",
    rendererId: "card_scenes",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "item1",
      "item2",
      "item3",
      "item4",
      "item5",
      "item6",
      "item7"
    ],
    stateDriven: !1,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_templates",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "02a01ff5d4873eaa8c953ac4d39061c9daf661dc1156139a87982e37bb91892f"
  },
  {
    upstreamId: "card_welcome_scenes",
    sourcePath: "reference_catalog/cards/card_welcome_scenes.yaml",
    publicId: "card_welcome_scenes",
    rendererId: "card_welcome_scenes",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "label",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_afternoon",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_welcome_scenes_collapse",
        defaultValue: '"[[[ return variables.ulm_card_welcome_scenes_collapse ]]]"',
        selector: "boolean"
      },
      {
        name: "ulm_chip_mdi_icon_only_icon",
        defaultValue: '"mdi:cog-outline"',
        selector: "icon"
      },
      {
        name: "ulm_evening",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_hello",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_language",
        defaultValue: '"[[[ return variables.ulm_language ]]]"',
        selector: "text"
      },
      {
        name: "ulm_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_morning",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_templates",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_engine",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_scenes",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_weather",
        defaultValue: '"[[[ return variables.ulm_weather ]]]"',
        selector: "entity"
      }
    ],
    dependencies: [
      "auto-entities",
      "button-card"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:auto-entities; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "055cc3323c175f8b1414ff9f86ce9cbc1762d5358f20797581dd0b0cda0afd90"
  },
  {
    upstreamId: "custom_card_trash",
    sourcePath: "custom_cards/custom_card_trash",
    publicId: "custom_card_trash",
    rendererId: "custom_card_trash",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "label",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_card_datum_gft",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_datum_glas",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_datum_papier",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_datum_pmd",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_datum_rest",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_ophaling_morgen",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_ophaling_vandaag",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_cards",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_ophaling",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_volgende_ophaling",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [
      "provider-specific sensor attributes"
    ],
    deviations: [],
    sourceDigest: "03cf36ad54d30f5386ebbfb13073e07a2f0f63494536d884b059ac0616fef49f"
  },
  {
    upstreamId: "custom_card_alarm_time",
    sourcePath: "custom_cards/custom_card_alarm_time",
    publicId: "custom_card_alarm_time",
    rendererId: "custom_card_alarm_time",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "item3",
      "label",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_card_alarm_time_collapse",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_alarm_time_color",
        defaultValue: '"blue"',
        selector: "color"
      },
      {
        name: "ulm_card_alarm_time_datetime",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_alarm_time_force_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_alarm_time_horizontal",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_alarm_time_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_alarm_time_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_alarm_time_step",
        defaultValue: "15",
        selector: "number"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "d4453221cd292b5d2f057fb0c78f73af4a54bc6446377ee9c410c69390c573e0"
  },
  {
    upstreamId: "custom_card_roomview",
    sourcePath: "custom_cards/custom_card_roomview",
    publicId: "custom_card_roomview",
    rendererId: "custom_card_roomview",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "header",
      "header_card",
      "icon",
      "label"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "double_tap_action",
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_actions_card",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_tap_action",
        defaultValue: '"[[[ return variables.ulm_card_tap_action; ]]]"',
        selector: "action"
      },
      {
        name: "ulm_card_tap_navigate_path",
        defaultValue: '"[[[ return variables.ulm_card_tap_navigate_path; ]]]"',
        selector: "text"
      },
      {
        name: "ulm_input_select",
        defaultValue: '"[[[ return variables.ulm_input_select; ]]]"',
        selector: "text"
      },
      {
        name: "ulm_input_select_option",
        defaultValue: '"[[[ return variables.ulm_input_select_option; ]]]"',
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "a8781de5079b414542ff3cc6653c01448336db8433e9dcbdcb2aa6900d2cf7c8"
  },
  {
    upstreamId: "custom_card_room_overview",
    sourcePath: "custom_cards/custom_card_room_overview",
    publicId: "custom_card_room_overview",
    rendererId: "custom_card_room_overview",
    layoutProfile: "card:button-card+popup",
    primitives: [
      "button-card",
      "popup"
    ],
    customFields: [
      "icon",
      "label",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_actions_card",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_cover_popup",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_dynamic_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_room_overview_cover_icon_closed",
        defaultValue: '"mdi:roller-shade-closed"',
        selector: "text"
      },
      {
        name: "ulm_card_room_overview_cover_icon_closing",
        defaultValue: '"mdi:blinds"',
        selector: "text"
      },
      {
        name: "ulm_card_room_overview_cover_icon_open",
        defaultValue: '"mdi:blinds-open"',
        selector: "text"
      },
      {
        name: "ulm_card_room_overview_cover_icon_opening",
        defaultValue: '"mdi:blinds"',
        selector: "text"
      },
      {
        name: "ulm_card_room_overview_light_icon_off",
        defaultValue: '"mdi:lightbulb-off"',
        selector: "text"
      },
      {
        name: "ulm_card_room_overview_light_icon_on",
        defaultValue: '"mdi:lightbulb"',
        selector: "text"
      },
      {
        name: "ulm_card_light_enable_popup",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_thermostat_enable_popup",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_actions",
        defaultValue: "<documented/inherited>",
        selector: "action"
      },
      {
        name: "ulm_custom_card_room_overview_climate_entity",
        defaultValue: "<null>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_room_overview_cover_entity",
        defaultValue: "<null>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_room_overview_light_entity",
        defaultValue: "<null>",
        selector: "entity"
      },
      {
        name: "ulm_custom_popup",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_popup_cover_entity",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_popup_light_entity",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_popup_thermostat_entity",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_translation_engine",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_state",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "05d6591e9fc47e3c4664d249a8d6b7e8cfa3b4175487c776042dd67dcaf8f60e"
  },
  {
    upstreamId: "custom_card_welcome",
    sourcePath: "custom_cards/custom_card_welcome",
    publicId: "custom_card_welcome",
    rendererId: "custom_card_welcome",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "item5",
      "label",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_afternoon",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_welcome_collapse",
        defaultValue: '"[[[ return variables.ulm_card_welcome_collapse ]]]"',
        selector: "boolean"
      },
      {
        name: "ulm_chip_mdi_icon_only_icon",
        defaultValue: '"mdi:cog-outline"',
        selector: "icon"
      },
      {
        name: "ulm_evening",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_hello",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_morning",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_weather",
        defaultValue: '"[[[ return variables.ulm_weather]]]"',
        selector: "entity"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "93ce63eb03a118784aa4f2635eafa416641871139cd30adb7e0c533d0ea75708"
  },
  {
    upstreamId: "custom_card_washer",
    sourcePath: "custom_cards/custom_card_washer",
    publicId: "custom_card_washer",
    rendererId: "custom_card_washer",
    layoutProfile: "card:button-card+chart",
    primitives: [
      "button-card",
      "chart"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "item5",
      "state",
      "state1",
      "state2",
      "state3",
      "state4",
      "state5",
      "ulm_custom_card_washer_job_state",
      "ulm_custom_card_washer_job_states",
      "ulm_custom_card_washer_machine_state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "hold_action",
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_custom_card_washer_delayed_start",
        defaultValue: "<null>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_washer_delayed_starttime",
        defaultValue: "<null>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_washer_job_progress",
        defaultValue: "<null>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_washer_job_state",
        defaultValue: "<null>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_washer_job_states",
        defaultValue: '{"state1":{"name":null,"icon":null},"state2":{"name":null,"icon":null},"state3":{"name":null,"icon":null},"state4":{"name":null,"icon":null},"state5":{"name":null,"icon":null}}',
        selector: "object"
      },
      {
        name: "ulm_custom_card_washer_label_configuring",
        defaultValue: '"configure"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_washer_label_idle",
        defaultValue: '"idle"',
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_washer_label_running",
        defaultValue: '"run"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_washer_machine_state",
        defaultValue: "<null>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_washer_machine_stop_state",
        defaultValue: '"stop"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_washer_pause_action",
        defaultValue: '{"action":"none"}',
        selector: "action"
      },
      {
        name: "ulm_custom_card_washer_power",
        defaultValue: "<null>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_washer_remote_control",
        defaultValue: "<null>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_washer_start_action",
        defaultValue: '{"action":"none"}',
        selector: "action"
      },
      {
        name: "ulm_custom_card_washer_stop_action",
        defaultValue: '{"action":"none"}',
        selector: "action"
      },
      {
        name: "ulm_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_engine",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_state",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "bar-card",
      "button-card"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:bar-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "04947fa4908ab93e6b7d876a855a33c7a698a4ea2eb6b037c433473d35ecf55f"
  },
  {
    upstreamId: "custom_card_sun",
    sourcePath: "custom_cards/custom_card_sun",
    publicId: "custom_card_sun",
    rendererId: "custom_card_sun",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "item1"
    ],
    stateDriven: !1,
    animated: !1,
    actions: [],
    variables: [],
    dependencies: [
      "button-card",
      "sun-card"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:sun-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "074c33e0590eba8959925a6a4a03dddf73472fea73d7ed59cb43bdf209cb1aca"
  },
  {
    upstreamId: "custom_card_input_datetime",
    sourcePath: "custom_cards/custom_card_input_datetime",
    publicId: "custom_card_input_datetime",
    rendererId: "custom_card_input_datetime",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "item1",
      "item2",
      "item3",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "hold_action",
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_card_input_datetime_name",
        defaultValue: '"n/a"',
        selector: "text"
      },
      {
        name: "ulm_translation_engine",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_state",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "209eb00bb2ff7a561326bbb3377ae486d3959816f5916ffc63cbf3e70b4e1645"
  },
  {
    upstreamId: "custom_card_weather_metrics",
    sourcePath: "custom_cards/custom_card_weather_metrics",
    publicId: "custom_card_weather_metrics",
    rendererId: "custom_card_weather_metrics",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "item1",
      "item2",
      "item3",
      "item4",
      "label"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_custom_card_weather_metrics",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_weather_metrics_date",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_weather_metrics_entity_1",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_weather_metrics_entity_2",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_weather_metrics_entity_3",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_weather_metrics_entity_4",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_weather_metrics_name_1",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_weather_metrics_name_2",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_weather_metrics_name_3",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_weather_metrics_name_4",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_weather_metrics_temperature_outside",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [
      "weather entity/forecast API"
    ],
    deviations: [],
    sourceDigest: "5dd798c6cf0f8cb996bb3b522079d1c52aadbb523e217f35e2c35a66459b5956"
  },
  {
    upstreamId: "custom_card_media_player_sonos",
    sourcePath: "custom_cards/custom_card_media_player_sonos",
    publicId: "custom_card_media_player_sonos",
    rendererId: "custom_card_media_player_sonos",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "item3",
      "label",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_card_media_player_with_controls_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_card_media_player_with_controls_name",
        defaultValue: '"No name set"',
        selector: "text"
      },
      {
        name: "ulm_translation_engine",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_state",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [
      "media entity/services"
    ],
    deviations: [],
    sourceDigest: "43e2b1382095299759e872abb8a92f8ad9b56c60dfe018b83e2ad43b5adfcaef"
  },
  {
    upstreamId: "custom_card_printer",
    sourcePath: "custom_cards/custom_card_printer",
    publicId: "custom_card_printer",
    rendererId: "custom_card_printer",
    layoutProfile: "card:button-card+chart",
    primitives: [
      "button-card",
      "chart"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "item5",
      "label"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_card_printer_black_name",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_printer_cyan_name",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_printer_magenta_name",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_printer_name",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_printer_yellow_name",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "bar-card",
      "button-card"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:bar-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "900ec6ff5ac98c1bc5e1ec6d5c751649c9b44681dd363daa67bd7a6450cf72e1"
  },
  {
    upstreamId: "custom_card_nas_metrics",
    sourcePath: "custom_cards/custom_card_nas_metrics",
    publicId: "custom_card_nas_metrics",
    rendererId: "custom_card_nas_metrics",
    layoutProfile: "card:button-card+horizontal-stack+chart",
    primitives: [
      "button-card",
      "horizontal-stack",
      "chart"
    ],
    customFields: [
      "header",
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "item5"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_card_generic_swap_icon",
        defaultValue: '"[[[ return variables.entity_4.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_generic_swap_name",
        defaultValue: '"[[[ return variables.entity_4.name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_input_boolean_icon",
        defaultValue: '"mdi:nas"',
        selector: "icon"
      },
      {
        name: "ulm_card_input_boolean_name",
        defaultValue: '"[[[ return variables.ulm_translation_status ]]]"',
        selector: "text"
      },
      {
        name: "ulm_translation_engine",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_status",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "apexcharts-card",
      "button-card"
    ],
    backendRequirements: [
      "history/statistics"
    ],
    deviations: [
      "Upstream embeds custom:apexcharts-card; this plugin provides an original Lit equivalent without requiring that frontend dependency.",
      "Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable."
    ],
    sourceDigest: "342ce893e03052a243cca28238250035167fc30a6df076783393c50b516dd968"
  },
  {
    upstreamId: "custom_card_tablet",
    sourcePath: "custom_cards/custom_card_tablet",
    publicId: "custom_card_tablet",
    rendererId: "custom_card_tablet",
    layoutProfile: "card:button-card+chart",
    primitives: [
      "button-card",
      "chart"
    ],
    customFields: [
      "item1",
      "item2",
      "item3",
      "item4",
      "item5",
      "label"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_card_generic_name",
        defaultValue: `"[[[ return variables.ulm_custom_bar_card_tablet_card_name != '' ? variables.ulm_custom_bar_card_tablet_card_name : '' ]]]"`,
        selector: "text"
      },
      {
        name: "ulm_card_input_boolean_icon",
        defaultValue: '"mdi:tablet"',
        selector: "icon"
      },
      {
        name: "ulm_card_input_boolean_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_bar_card_tablet_card_entity",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_battery ]]]"',
        selector: "entity"
      },
      {
        name: "ulm_custom_bar_card_tablet_card_indicator",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_bar_card_tablet_card_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_battery_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_bar_card_tablet_card_value",
        defaultValue: "true",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_tablet_battery",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_battery ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_battery_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_battery_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_button1",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_button1 ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_button2",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_button2 ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_button3",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_button3 ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_main",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_main ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_maintenance",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_maintenance ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_par1",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_par1 ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_par1_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_par1_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_par2",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_par2 ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_par2_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_par2_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_par3",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_par3 ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_par3_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_par3_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_reload",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_reload ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_tablet_restart",
        defaultValue: '"[[[ return variables.ulm_custom_card_tablet_restart ]]]"',
        selector: "text"
      },
      {
        name: "ulm_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "bar-card",
      "button-card"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:bar-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "14f3979bde156f30d644eb1240a24b96801d13af74929c521817fcb9f62a40aa"
  },
  {
    upstreamId: "custom_card_playstation",
    sourcePath: "custom_cards/custom_card_playstation",
    publicId: "custom_card_playstation",
    rendererId: "custom_card_playstation",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "label"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_translation_engine",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_state",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [
      "media entity/services"
    ],
    deviations: [],
    sourceDigest: "6a896e28456967bb271ab188f8006fdb87fd560f6a3749ead10719ebd51fdf06"
  },
  {
    upstreamId: "custom_card_scenes",
    sourcePath: "custom_cards/custom_card_scenes",
    publicId: "card_scenes",
    variant: "scene-grid",
    rendererId: "card_scenes",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "item5",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "c2613ff61eb10100b101b380086774366b5ee38194a468becca5bcaf57d618e1"
  },
  {
    upstreamId: "custom_card_plant",
    sourcePath: "custom_cards/custom_card_plant",
    publicId: "custom_card_plant",
    rendererId: "custom_card_plant",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "item1",
      "item2"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_card_flower_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_card_flower_name",
        defaultValue: '"No name set"',
        selector: "text"
      },
      {
        name: "ulm_card_flower_show_bars",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_card_flower_species",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_plant_correct",
        defaultValue: '"Correto"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_plant_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_plant_problem",
        defaultValue: '"Problema"',
        selector: "text"
      }
    ],
    dependencies: [
      "button-card",
      "flower-card"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:flower-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "02ae73a2485419633c91da2a275442d8ef179bff1e0887eafe5ebbe155bd7622"
  },
  {
    upstreamId: "custom_card_speedtest_gauges",
    sourcePath: "custom_cards/custom_card_speedtest_gauges",
    publicId: "custom_card_speedtest_gauges",
    rendererId: "custom_card_speedtest_gauges",
    layoutProfile: "card:button-card+chart",
    primitives: [
      "button-card",
      "chart"
    ],
    customFields: [
      "dataLabels",
      "icon",
      "item1",
      "item2",
      "item3",
      "label"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_custom_card_speedtest_download_speed_color",
        defaultValue: '"var(--google-yellow)"',
        selector: "color"
      },
      {
        name: "ulm_custom_card_speedtest_download_speed_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_speedtest_download_speed_max",
        defaultValue: "100",
        selector: "number"
      },
      {
        name: "ulm_custom_card_speedtest_ping_color",
        defaultValue: '"var(--google-green)"',
        selector: "color"
      },
      {
        name: "ulm_custom_card_speedtest_ping_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_speedtest_ping_max",
        defaultValue: "85",
        selector: "number"
      },
      {
        name: "ulm_custom_card_speedtest_round",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_speedtest_upload_speed_color",
        defaultValue: '"var(--google-blue)"',
        selector: "color"
      },
      {
        name: "ulm_custom_card_speedtest_upload_speed_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_speedtest_upload_speed_max",
        defaultValue: "40",
        selector: "number"
      }
    ],
    dependencies: [
      "apexcharts-card",
      "button-card"
    ],
    backendRequirements: [
      "history/statistics"
    ],
    deviations: [
      "Upstream embeds custom:apexcharts-card; this plugin provides an original Lit equivalent without requiring that frontend dependency.",
      "Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable."
    ],
    sourceDigest: "70e47e2c8ce62a205c6c41e956435432292e5ff0322c638d92f529fc8083859d"
  },
  {
    upstreamId: "custom_card_pollen",
    sourcePath: "custom_cards/custom_card_pollen",
    publicId: "custom_card_pollen",
    rendererId: "custom_card_pollen",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "item3"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [
      "provider-specific sensor attributes"
    ],
    deviations: [],
    sourceDigest: "e41b8c1f961cc37f153aa55b2401b0becc2ee49ac0b40ec19c36aaef09c8f98b"
  }
], Zt = new Map(Mr.map((e) => [e.upstreamId, e])), Ar = (e) => /popup|browser_mod/i.test(e), Cr = {
  card_room: ["ulm_input_select", "ulm_input_select_option", "input_select_entity", "input_select_option"],
  card_battery: [
    "ulm_card_battery_battery_level_danger",
    "ulm_card_battery_battery_level_warning",
    "ulm_card_battery_color_battery_level_danger",
    "ulm_card_battery_color_battery_level_warning",
    "ulm_card_battery_color_battery_level_ok"
  ],
  custom_card_speedtest_gauges: [
    "ulm_custom_card_speedtest_download_speed_color",
    "ulm_custom_card_speedtest_download_speed_entity",
    "ulm_custom_card_speedtest_upload_speed_color",
    "ulm_custom_card_speedtest_upload_speed_entity",
    "ulm_custom_card_speedtest_ping_color",
    "ulm_custom_card_speedtest_ping_entity"
  ],
  custom_card_washer: [
    "ulm_custom_card_washer_job_state",
    "ulm_custom_card_washer_machine_state",
    "ulm_custom_card_washer_power"
  ]
}, ua = /* @__PURE__ */ new Set([
  "ulm_card_battery_name",
  "ulm_card_flower_name",
  "ulm_card_input_boolean_name",
  "ulm_card_input_datetime_name",
  "ulm_card_input_number_name",
  "ulm_card_media_player_with_controls_name",
  "ulm_card_printer_name",
  "ulm_custom_card_metrics_entitites_name"
]), Ir = (e, t) => ua.has(t) || (Cr[e.upstreamId]?.includes(t) ?? !1), Er = {
  battery: [
    "ulm_card_battery_attribute",
    "ulm_card_battery_battery_state_entity_id",
    "ulm_card_battery_charger_type_entity_id",
    "ulm_card_battery_battery_level_danger",
    "ulm_card_battery_battery_level_warning",
    "ulm_card_battery_charging_animation",
    "ulm_card_battery_color_battery_level_danger",
    "ulm_card_battery_color_battery_level_warning",
    "ulm_card_battery_color_battery_level_ok",
    "ulm_card_battery_name"
  ],
  media: [
    "ulm_card_media_player_enable_art",
    "sonos_details_always_visible",
    "ulm_card_media_player_enable_controls",
    "ulm_card_media_player_enable_volume_slider",
    "ulm_card_media_player_enable_volume_buttons",
    "ulm_card_media_player_enable_volume_adjust",
    "ulm_card_media_player_collapsible",
    "ulm_card_media_player_idle_off",
    "ulm_card_media_player_player_controls_entity",
    "ulm_card_media_player_more_info",
    "ulm_card_media_player_power_button",
    "ulm_card_media_player_force_background_color",
    "ulm_card_media_player_color"
  ]
}, Pr = {
  custom_card_washer: [
    "ulm_custom_card_washer_power",
    "ulm_custom_card_washer_remote_control",
    "ulm_custom_card_washer_machine_state",
    "ulm_custom_card_washer_machine_stop_state",
    "ulm_custom_card_washer_job_state",
    "ulm_custom_card_washer_job_progress",
    "ulm_custom_card_washer_job_states",
    "ulm_custom_card_washer_delayed_start",
    "ulm_custom_card_washer_delayed_starttime",
    "ulm_custom_card_washer_label_idle",
    "ulm_custom_card_washer_label_configuring",
    "ulm_custom_card_washer_label_running",
    "ulm_custom_card_washer_start_action",
    "ulm_custom_card_washer_pause_action",
    "ulm_custom_card_washer_stop_action"
  ],
  custom_card_sun: [
    "darkMode",
    "language",
    "showAzimuth",
    "showElevation",
    "showMoon",
    "moon_entity",
    "moon_altitude_entity",
    "moon_azimuth_entity",
    "moon_right_ascension_entity",
    "moon_declination_entity",
    "moon_distance_entity",
    "moon_angular_diameter_entity",
    "moon_phase_angle_entity",
    "moon_illumination_entity",
    "moon_next_full_moon_entity",
    "moon_next_new_moon_entity",
    "moon_above_horizon_entity",
    "timeFormat",
    "title"
  ],
  custom_card_speedtest_gauges: [
    "ulm_custom_card_speedtest_download_speed_color",
    "ulm_custom_card_speedtest_download_speed_entity",
    "ulm_custom_card_speedtest_download_speed_max",
    "ulm_custom_card_speedtest_upload_speed_color",
    "ulm_custom_card_speedtest_upload_speed_entity",
    "ulm_custom_card_speedtest_upload_speed_max",
    "ulm_custom_card_speedtest_ping_color",
    "ulm_custom_card_speedtest_ping_entity",
    "ulm_custom_card_speedtest_ping_max",
    "ulm_custom_card_speedtest_round"
  ]
}, ma = (e, t) => !Ar(t) && ([e.upstreamId, ...e.sourceIds ?? []].some((o) => Pr[o]?.includes(t) === !0) || Er[e.family]?.includes(t) === !0), At = [
  { key: "temperature", label: "Temperature", icon: "mdi:thermometer", min: -10, max: 50 },
  { key: "humidity", label: "Humidity", icon: "mdi:water-percent", min: 0, max: 100 },
  { key: "moisture", label: "Moisture", icon: "mdi:water", min: 0, max: 100 },
  { key: "conductivity", label: "Conductivity", icon: "mdi:flash", min: 0, max: 3e3 },
  { key: "illuminance", label: "Illuminance", icon: "mdi:white-balance-sunny", min: 0, max: 1e5 },
  { key: "dli", label: "Daily light integral", icon: "mdi:leaf", min: 0, max: 30 }
], zr = new Set(At.map(({ key: e }) => e)), _a = (e) => {
  const t = e?.ulm_card_flower_show_bars;
  return Array.isArray(t) ? [...new Set(t)].filter((o) => typeof o == "string" && zr.has(o)) : At.map(({ key: o }) => o);
}, pa = (e) => `${e}_entity`, g = (e, t = "entity") => ({
  name: t,
  selector: { entity: e?.length ? { domain: e } : {} }
}), D = (e) => ({ name: e, selector: { text: {} } }), zo = (e) => ({ name: e, selector: { navigation: {} } }), I = (e) => ({ name: e, selector: { boolean: {} } }), z = (e, t = 1, o = 168, a) => ({
  name: e,
  selector: { number: { min: t, max: o, mode: "box", ...a === void 0 ? {} : { step: a } } }
}), Pt = (e) => ({
  name: e,
  selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
}), ye = (e) => ({ name: e, selector: { ui_action: {} } }), Y = (e, t) => ({
  name: e,
  selector: { select: { mode: "dropdown", options: t } }
}), Dr = {
  battery_healthy_color: "green",
  battery_warning_color: "yellow",
  battery_low_color: "orange",
  battery_critical_color: "red",
  ulm_card_media_player_color: "blue",
  ulm_card_alarm_time_color: "blue",
  disk_color: "red",
  temperature_color: "orange",
  memory_color: "blue",
  cpu_color: "green",
  ulm_custom_card_speedtest_download_speed_color: "yellow",
  ulm_custom_card_speedtest_upload_speed_color: "blue",
  ulm_custom_card_speedtest_ping_color: "green",
  import_color: "#ff9f43",
  export_color: "#4cd98b",
  solar_color: "#f5c542",
  battery_color: "#3b82f6",
  home_color: "#3b82f6",
  price_negative_color: "#0288d1",
  price_low_color: "#2e7d32",
  price_medium_color: "#9ccc65",
  price_high_color: "#fdd835",
  price_critical_color: "#e53935",
  buy_sell_price_color: "#78909c",
  buy_sell_charge_color: "#43a047",
  buy_sell_planned_sell_color: "#fb8c00",
  buy_sell_possible_sell_color: "#ffcc80",
  buy_sell_now_color: "var(--primary-text-color)",
  panel_color_0: "#b0bec5",
  panel_color_1: "#ffa726",
  panel_color_2: "#d4e157",
  panel_color_3: "#66bb6a",
  panel_color_4: "#2e7d32",
  panel_color_5: "#2e7d32"
}, R = (e) => ({
  name: e,
  selector: { ui_color: { default_color: Dr[e] } }
}), Xe = (e) => ({ ...e, presentation: !0 }), Tr = (e) => ({
  type: "grid",
  name: "",
  schema: e,
  presentation: !0
}), Or = /* @__PURE__ */ new Set([
  "ulm_card_battery_battery_level_danger",
  "ulm_card_battery_battery_level_warning"
]), Nr = /* @__PURE__ */ new Set([
  "ulm_card_media_player_collapsible",
  "ulm_card_media_player_idle_off",
  "ulm_card_media_player_more_info",
  "ulm_card_media_player_power_button",
  "ulm_card_media_player_force_background_color"
]), Vr = /* @__PURE__ */ new Set([
  "ulm_card_media_player_enable_volume_adjust"
]), Lr = /* @__PURE__ */ new Set([
  "ulm_card_input_datetime_name",
  "ulm_card_input_number_entity",
  "ulm_card_input_number_name",
  "ulm_custom_card_metrics_entitites_name",
  "ulm_custom_card_weather_metrics",
  "ulm_custom_card_weather_metrics_date",
  "ulm_custom_card_weather_metrics_entity_1",
  "ulm_custom_card_weather_metrics_entity_2",
  "ulm_custom_card_weather_metrics_entity_3",
  "ulm_custom_card_weather_metrics_entity_4",
  "ulm_custom_card_weather_metrics_name_1",
  "ulm_custom_card_weather_metrics_name_2",
  "ulm_custom_card_weather_metrics_name_3",
  "ulm_custom_card_weather_metrics_name_4",
  "ulm_custom_card_weather_metrics_temperature_outside"
]), Rr = {}, K = (e = !1) => [
  Xe({
    name: "name",
    selector: { entity_name: {} },
    context: { entity: "entity" }
  }),
  Xe({
    name: "icon",
    selector: { icon: {} },
    context: { icon_entity: "entity" }
  }),
  Xe({
    name: "layout",
    selector: {
      select: {
        mode: "box",
        options: ["horizontal", "vertical"].map((t) => ({
          value: t,
          label: t === "horizontal" ? "Horizontal" : "Vertical",
          image: {
            src: `/static/images/form/tile_content_layout_${t}.svg`,
            src_dark: `/static/images/form/tile_content_layout_${t}_dark.svg`,
            flip_rtl: !0
          }
        }))
      }
    }
  }),
  Xe(I("multiline_secondary")),
  Xe(I("fill_container")),
  Tr([
    Y("primary_info", [
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" }
    ]),
    Y("secondary_info", [
      ...e ? [
        { value: "default", label: "Automatic (feature labels)" },
        { value: "custom", label: "Custom text" },
        { value: "composed", label: "Composed (primary entity values)" }
      ] : [],
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" }
    ]),
    Y("icon_type", [
      { value: "icon", label: "Icon" },
      { value: "entity-picture", label: "Entity picture" },
      { value: "none", label: "None" }
    ])
  ])
], Fr = /* @__PURE__ */ new Set([
  "card_room",
  "card_welcome_scenes",
  "custom_card_welcome",
  "custom_card_tablet"
]), ha = (e) => e.flatMap((t) => t.name === "icon" || t.name === "icon_type" ? [] : t.schema ? [{ ...t, schema: ha(t.schema) }] : [t]), jr = (e) => {
  if (!e.some((i) => i.presentation)) return e;
  const t = e.filter((i) => i.presentation), o = /* @__PURE__ */ new Set(["name", "icon"]), a = e.filter((i) => !i.presentation && !o.has(i.name) && !ua.has(i.name)), r = a.findIndex((i) => i.name === "entity");
  if (r < 0) return [...t, ...a];
  const [n] = a.splice(r, 1);
  return [n, ...t, ...a];
}, Br = (e) => {
  const t = { ...e };
  return delete t.presentation, t;
}, se = (e) => [
  g(e.preferredDomains),
  ...e.variants?.length ? [Y("variant", e.variants.map((t) => ({
    value: t,
    label: e.variantLabels?.[t] ?? t.replaceAll("-", " ").replace(/\b\w/g, (o) => o.toUpperCase())
  })))] : [],
  ...K()
], Do = {
  weather: (e) => [
    ...se(e),
    g(["sensor"], "temperature_entity"),
    g(["sensor"], "humidity_entity"),
    I("show_forecast")
  ],
  climate: (e) => [...se(e), g(["sensor"], "humidity_entity"), I("show_controls")],
  light: (e) => [...se(e)],
  scene: (e) => [
    ...e.upstreamId === "card_welcome_scenes" ? [g(), ...K()] : se(e),
    ...e.upstreamId === "card_welcome_scenes" ? [
      g(["input_boolean"], "collapse_entity"),
      g(["weather"], "weather_entity"),
      zo("settings_path"),
      I("collapsed")
    ] : []
  ],
  presence: (e, t) => [
    ...se(e),
    ...e.upstreamId === "card_room" ? [] : [
      ...t?.variant === "small" ? [] : [
        g(["sensor"], "battery_entity"),
        g(["sensor"], "eta_entity"),
        g(["sensor"], "address_entity")
      ]
    ]
  ],
  battery: (e) => [
    ...se(e),
    Pt("battery_warning_threshold"),
    Pt("battery_low_threshold"),
    Pt("battery_critical_threshold"),
    R("battery_healthy_color"),
    R("battery_warning_color"),
    R("battery_low_color"),
    R("battery_critical_color")
  ],
  energy: (e) => [...se(e), g(["sensor"], "min_entity"), g(["sensor"], "max_entity"), I("show_graph")],
  sensor: (e) => [...se(e), I("show_graph")],
  media: (e) => [...se(e), I("show_controls")],
  cover: (e) => [...se(e), I("show_controls")],
  security: (e) => [...se(e)],
  navigation: (e) => [
    ...e.variants?.length ? [Y("variant", e.variants.map((t) => ({
      value: t,
      label: e.variantLabels?.[t] ?? t
    })))] : [],
    ...K(),
    zo("navigation_path")
  ],
  text: () => [...K(), D("secondary")],
  camera: (e) => [...se(e)],
  control: (e) => [
    ...se(e),
    .../power_outlet|more_power_outlet/.test(e.upstreamId) ? [g(["sensor"], "graph_entity"), I("show_graph")] : [],
    I("show_controls")
  ],
  "alarm-time": (e) => [...se(e), g(["input_datetime"], "datetime_entity"), I("show_controls")],
  door: (e) => [...se(e), g(["lock"], "lock_entity"), g(["sensor"], "battery_entity"), I("show_controls")],
  entity: (e) => [...se(e), D("secondary")]
}, ga = (e, t) => {
  if (e.upstreamId === "mini_graph_card")
    return [
      g(["sensor", "binary_sensor", "input_number"]),
      ...K().filter((r) => r.name !== "layout" && r.name !== "multiline_secondary"),
      Y("variant", [
        { value: "line", label: "Line graph" },
        { value: "bar", label: "Bar graph" }
      ]),
      Y("aggregate_func", [
        { value: "avg", label: "Average" },
        { value: "median", label: "Median" },
        { value: "min", label: "Minimum" },
        { value: "max", label: "Maximum" },
        { value: "first", label: "First value" },
        { value: "last", label: "Last value" },
        { value: "sum", label: "Sum" },
        { value: "delta", label: "Range (maximum minus minimum)" },
        { value: "diff", label: "Difference (last minus first)" }
      ]),
      Y("group_by", [
        { value: "interval", label: "Dynamic interval" },
        { value: "hour", label: "Hour" },
        { value: "date", label: "Date" }
      ]),
      z("hours_to_show", 1, 8760),
      z("points_per_hour", 0.01, 60),
      z("update_interval", 1, 86400),
      I("cache"),
      z("height", 0, 1e3),
      z("line_width", 1, 20),
      z("bar_spacing", 0, 50),
      I("smoothing"),
      I("animate"),
      I("logarithmic"),
      z("value_factor", -12, 12),
      z("decimals", 0, 12),
      I("hour24"),
      z("font_size", 25, 300),
      z("font_size_header", 8, 48),
      Y("align_header", [
        { value: "default", label: "Automatic" },
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ]),
      Y("align_icon", [
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
        { value: "state", label: "Beside state" }
      ]),
      Y("align_state", [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ]),
      D("unit"),
      D("icon_image"),
      D("lower_bound"),
      D("upper_bound"),
      z("min_bound_range", 0, 1e6),
      D("lower_bound_secondary"),
      D("upper_bound_secondary"),
      z("min_bound_range_secondary", 0, 1e6),
      Y("color_thresholds_transition", [
        { value: "smooth", label: "Smooth gradient" },
        { value: "hard", label: "Hard color steps" }
      ]),
      I("group"),
      Y("mini_graph_show_state", [
        { value: "current", label: "Current state" },
        { value: "last", label: "Last graph value" },
        { value: "hidden", label: "Hidden" }
      ]),
      Y("mini_graph_show_fill", [
        { value: "solid", label: "Solid fill" },
        { value: "fade", label: "Faded fill" },
        { value: "hidden", label: "No fill" }
      ]),
      Y("mini_graph_show_points", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" }
      ]),
      Y("mini_graph_show_labels", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" }
      ]),
      Y("mini_graph_show_labels_secondary", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" }
      ]),
      I("mini_graph_show_legend"),
      I("mini_graph_show_average"),
      I("mini_graph_show_extrema"),
      I("mini_graph_name_adaptive_color"),
      I("mini_graph_icon_adaptive_color"),
      I("mini_graph_loading_indicator"),
      ye("tap_action"),
      ye("hold_action"),
      ye("double_tap_action")
    ];
  const o = [
    ...e.upstreamId === "advanced_home_energy_management" ? [
      g(["sensor"]),
      g(["sensor"], "grid_power_entity"),
      g(["sensor"], "grid_phase_1_entity"),
      g(["sensor"], "grid_phase_2_entity"),
      g(["sensor"], "grid_phase_3_entity"),
      g(["sensor"], "solar_power_entity"),
      g(["sensor"], "solar_forecast_entity"),
      g(["sensor"], "battery_level_entity"),
      g(["sensor"], "battery_power_entity"),
      g(["sensor"], "battery_1_level_entity"),
      g(["sensor"], "battery_1_power_entity"),
      g(["sensor"], "battery_2_level_entity"),
      g(["sensor"], "battery_2_power_entity"),
      g(["sensor"], "battery_3_level_entity"),
      g(["sensor"], "battery_3_power_entity"),
      g(["sensor"], "ev_charger_power_entity"),
      g(["sensor", "select", "input_select"], "energy_mode_entity"),
      g(["binary_sensor", "input_boolean", "switch"], "energy_auto_control_entity"),
      g(["sensor", "input_number"], "electricity_price_entity"),
      g(["sensor", "input_number"], "tariff_markup_entity"),
      g(["sensor", "input_number"], "tariff_vat_entity"),
      D("energy_grid_label"),
      D("energy_grid_import_label"),
      D("energy_grid_export_label"),
      D("energy_solar_label"),
      D("energy_battery_label"),
      D("energy_home_label"),
      D("energy_forecast_label"),
      D("energy_ev_label"),
      D("energy_charge_label"),
      D("energy_discharge_label"),
      D("energy_idle_label"),
      D("energy_auto_label"),
      D("energy_manual_label"),
      D("mode_solar_first_label"),
      D("mode_smart_saving_label"),
      D("mode_smart_trading_label"),
      z("grid_phase_scale_max", 100, 1e5),
      z("solar_scale_max", 100, 1e5),
      z("battery_unit_scale_max", 100, 1e5),
      z("home_scale_max", 100, 1e5),
      z("price_low_threshold", -10, 10),
      z("price_medium_threshold", -10, 10),
      z("price_high_threshold", -10, 10),
      z("price_critical_threshold", -10, 10),
      I("show_grid_phases"),
      I("show_battery_units"),
      I("show_tariff_timeline"),
      R("import_color"),
      R("export_color"),
      R("solar_color"),
      R("battery_color"),
      R("home_color"),
      R("price_negative_color"),
      R("price_low_color"),
      R("price_medium_color"),
      R("price_high_color"),
      R("price_critical_color"),
      ...K()
    ] : e.upstreamId === "card_room" ? [
      g(),
      I("label_use_temperature"),
      g(["sensor", "climate"], "room_temperature_entity"),
      I("label_use_brightness"),
      g(["light"], "room_brightness_entity"),
      g(["light"], "room_light_entity"),
      I("ulm_card_dynamic_color"),
      ...K(!0),
      D("secondary")
    ] : e.upstreamId === "card_scenes" ? [
      g(),
      ...e.variants?.length ? [Y("variant", e.variants.map((r) => ({
        value: r,
        label: e.variantLabels?.[r] ?? r
      })))] : [],
      I("scene_buttons_only"),
      ...K()
    ] : e.upstreamId === "custom_card_trash" ? [
      g(["sensor", "calendar"]),
      I("show_today"),
      g(["sensor"], "today_entity"),
      I("show_tomorrow"),
      g(["sensor"], "tomorrow_entity"),
      ...K()
    ] : e.upstreamId === "custom_card_entity_carousel" ? [
      g(),
      I("carousel_show_header"),
      ...K(),
      I("carousel_loop"),
      I("carousel_show_labels"),
      z("carousel_initial_index", 0, 50),
      Y("carousel_effect", [
        { value: "coverflow", label: "Coverflow" },
        { value: "slide", label: "Slide" }
      ]),
      I("carousel_grab_cursor"),
      I("carousel_centered_slides"),
      Y("carousel_slides_per_view", [
        { value: "auto", label: "Automatic" },
        ...Array.from({ length: 11 }, (r, n) => ({
          value: String(n + 1),
          label: String(n + 1)
        }))
      ]),
      z("carousel_coverflow_rotate", -180, 180),
      z("carousel_coverflow_stretch", -200, 200),
      z("carousel_coverflow_depth", 0, 1e3),
      z("carousel_coverflow_modifier", 0, 5),
      I("carousel_coverflow_slide_shadows")
    ] : e.upstreamId === "custom_card_playstation" ? [
      g(["binary_sensor", "media_player", "remote", "sensor", "switch"]),
      Y("console_platform", [
        { value: "auto", label: "Automatic" },
        { value: "xbox", label: "Xbox" },
        { value: "playstation", label: "PlayStation" },
        { value: "nintendo", label: "Nintendo" }
      ]),
      I("console_show_artwork"),
      I("console_show_controls"),
      g(["sensor"], "followers_entity"),
      g(["sensor"], "following_entity"),
      g(["sensor"], "friends_entity"),
      g(["sensor", "number", "input_number"], "primary_stat_entity"),
      { name: "primary_stat_icon", selector: { icon: {} } },
      g(["sensor", "number", "input_number"], "secondary_stat_entity"),
      { name: "secondary_stat_icon", selector: { icon: {} } },
      g(["sensor"], "now_playing_entity"),
      g(["image", "camera"], "gamerpic_entity"),
      g(["image", "camera"], "artwork_entity"),
      g(["remote", "media_player", "switch"], "console_power_entity"),
      ...K()
    ] : e.upstreamId === "custom_card_alarm_time" ? [
      g(["input_boolean", "switch"]),
      g(["input_datetime"], "datetime_entity"),
      z("ulm_card_alarm_time_step", 1, 180),
      I("ulm_card_alarm_time_collapse"),
      I("ulm_card_alarm_time_horizontal"),
      { name: "ulm_card_alarm_time_icon", selector: { icon: {} } },
      R("ulm_card_alarm_time_color"),
      ...K()
    ] : e.upstreamId === "custom_card_media_player_sonos" ? [
      g(["media_player"]),
      ...K(),
      I("ulm_card_media_player_enable_art"),
      I("use_media_info"),
      I("show_volume_level"),
      { name: "volume_controls", selector: { select: { multiple: !0, mode: "list", options: [
        { value: "volume_mute", label: "Mute" },
        { value: "volume_set", label: "Volume level" },
        { value: "volume_buttons", label: "Volume buttons" }
      ] } } },
      { name: "media_controls", selector: { select: { multiple: !0, mode: "list", options: [
        { value: "on_off", label: "Turn on/off" },
        { value: "shuffle", label: "Shuffle" },
        { value: "previous", label: "Previous track" },
        { value: "play_pause_stop", label: "Play/pause/stop" },
        { value: "next", label: "Next track" },
        { value: "repeat", label: "Repeat mode" }
      ] } } },
      I("collapsible_controls"),
      I("sonos_details_always_visible"),
      g(["switch"], "crossfade_entity"),
      g(["switch"], "night_sound_entity"),
      g(["switch"], "speech_enhancement_entity"),
      g(["switch"], "subwoofer_entity"),
      g(["switch"], "surrounds_entity"),
      g(["switch"], "loudness_entity"),
      g(["switch"], "surround_full_entity"),
      g(["number"], "audio_delay_entity"),
      g(["number"], "balance_entity"),
      g(["number"], "bass_entity"),
      g(["number"], "treble_entity"),
      g(["number"], "sub_gain_entity"),
      g(["number"], "surround_level_entity"),
      g(["number"], "music_surround_level_entity")
    ] : e.upstreamId === "custom_card_printer" ? [
      g(["sensor", "binary_sensor"]),
      g(["sensor"], "black_entity"),
      g(["sensor"], "yellow_entity"),
      g(["sensor"], "magenta_entity"),
      g(["sensor"], "cyan_entity"),
      ...K()
    ] : e.upstreamId === "advanced_energy_buy_sell" ? [
      g(["sensor"]),
      D("buy_sell_title"),
      z("buy_sell_graph_span", 1, 168),
      Y("buy_sell_span_start", [
        { value: "day", label: "Start at midnight" },
        { value: "now", label: "Start now" }
      ]),
      z("buy_sell_update_interval", 1, 120),
      z("buy_sell_chart_height", 120, 700),
      z("buy_sell_min_value", -10, 10),
      z("buy_sell_max_value", -10, 10),
      z("buy_sell_price_decimals", 0, 6),
      z("buy_sell_axis_decimals", 0, 4),
      z("buy_sell_bar_radius", 0, 16),
      D("buy_sell_axis_label"),
      D("buy_sell_price_label"),
      R("buy_sell_price_color"),
      D("buy_sell_charge_label"),
      R("buy_sell_charge_color"),
      D("buy_sell_planned_sell_label"),
      R("buy_sell_planned_sell_color"),
      D("buy_sell_possible_sell_label"),
      R("buy_sell_possible_sell_color"),
      I("buy_sell_show_now"),
      D("buy_sell_now_label"),
      R("buy_sell_now_color"),
      I("buy_sell_show_legend"),
      I("buy_sell_show_grid"),
      I("buy_sell_show_result"),
      z("buy_sell_trade_energy", 0.1, 1e3, 0.01),
      g(["input_number", "number", "sensor"], "buy_sell_trade_energy_entity"),
      z("buy_sell_trade_power", 0.1, 1e3, 0.01),
      z("buy_sell_trade_efficiency", 1, 100, 0.1),
      z("buy_sell_feed_in_fee", 0, 10, 1e-3),
      z("buy_sell_slot_minutes", 1, 1440),
      ...K()
    ] : e.upstreamId === "advanced_energy_panel_health" ? [
      g(["sensor"]),
      {
        name: "panel_entities",
        selector: { entity: { domain: ["sensor"], multiple: !0 } }
      },
      D("panel_health_title"),
      I("panel_show_summary"),
      I("panel_show_gauges"),
      z("panel_gauge_max", 1, 1e5),
      z("panel_warning_average_min", 0, 1e5),
      z("panel_low_output_percent", 1, 100),
      z("panel_segment_1", 0, 1e5),
      z("panel_segment_2", 0, 1e5),
      z("panel_segment_3", 0, 1e5),
      z("panel_segment_4", 0, 1e5),
      R("panel_color_0"),
      R("panel_color_1"),
      R("panel_color_2"),
      R("panel_color_3"),
      R("panel_color_4"),
      R("panel_color_5"),
      ...K()
    ] : e.upstreamId === "custom_card_roomview" ? [
      g(e.preferredDomains),
      g(["group", "binary_sensor"], "group_motions"),
      g(["group", "binary_sensor"], "group_doors"),
      g(["group", "binary_sensor"], "group_windows"),
      g(["group", "binary_sensor"], "group_water"),
      g(["sensor"], "temperature"),
      g(["sensor"], "humidity"),
      {
        name: "climate_name",
        selector: { entity_name: {} },
        context: { entity: "temperature" }
      },
      {
        name: "climate_icon",
        selector: { icon: {} },
        context: { icon_entity: "temperature" }
      },
      Y("climate_icon_type", [
        { value: "icon", label: "Icon" },
        { value: "entity-picture", label: "Entity picture" },
        { value: "none", label: "None" }
      ]),
      ...["climate_primary_info", "climate_secondary_info"].map((r) => Y(r, [
        { value: "name", label: "Name" },
        { value: "state", label: "State" },
        { value: "none", label: "None" }
      ])),
      D("climate_secondary"),
      ...[
        { device: "lights", key: "group_lights", domain: "light" },
        { device: "shutters", key: "group_windows_shutters", domain: "cover" },
        { device: "outlets", key: "group_outlets", domain: "switch" },
        { device: "tv", key: "group_tv", domain: "media_player" }
      ].flatMap(({ device: r, key: n, domain: i }) => [
        g(["group", i], n),
        ...["tap", "hold", "double_tap"].map((l) => ye(`${r}_${l}_action`))
      ]),
      ...K()
    ] : e.upstreamId === "custom_card_room_overview" ? [
      g(),
      g(["light"], "ulm_custom_card_room_overview_light_entity"),
      g(["climate"], "ulm_custom_card_room_overview_climate_entity"),
      g(["cover"], "ulm_custom_card_room_overview_cover_entity"),
      { name: "ulm_card_room_overview_light_icon_on", selector: { icon: {} } },
      { name: "ulm_card_room_overview_light_icon_off", selector: { icon: {} } },
      { name: "ulm_card_room_overview_cover_icon_open", selector: { icon: {} } },
      { name: "ulm_card_room_overview_cover_icon_closed", selector: { icon: {} } },
      I("ulm_card_dynamic_color"),
      D("secondary"),
      ...K()
    ] : e.upstreamId === "custom_card_welcome" ? [
      g(["person"]),
      g(["input_boolean"], "ulm_card_welcome_collapse"),
      g(["weather"], "ulm_weather"),
      ...Array.from({ length: 5 }, (r, n) => n + 1).flatMap((r) => [
        D(`nav_${r}`),
        { name: `icon_${r}`, selector: { icon: {} } },
        D(`name_${r}`),
        Y(`color_${r}`, ["blue", "red", "green", "yellow", "pink", "purple"].map((n) => ({
          value: n,
          label: n[0].toUpperCase() + n.slice(1)
        })))
      ]),
      ...K()
    ] : e.upstreamId === "custom_card_plant" ? [
      g(["plant", "sensor"]),
      D("ulm_card_flower_species"),
      {
        name: "ulm_card_flower_show_bars",
        selector: {
          select: {
            multiple: !0,
            options: At.map(({ key: r, label: n }) => ({ value: r, label: n }))
          }
        }
      },
      ..._a(t).map((r) => g(["sensor", "number", "input_number"], pa(r))),
      ...K()
    ] : e.upstreamId === "custom_card_washer" ? [
      g(["sensor", "switch", "binary_sensor"]),
      g(["sensor", "select"], "program_stage_entity"),
      g(["sensor", "switch"], "washer_power_entity"),
      g(["sensor", "binary_sensor"], "door_entity"),
      g(["sensor", "binary_sensor"], "finished_entity"),
      g(["sensor", "binary_sensor"], "ulm_custom_card_washer_remote_control"),
      g(["sensor"], "ulm_custom_card_washer_job_progress"),
      g(["input_boolean"], "ulm_custom_card_washer_delayed_start"),
      g(["input_datetime"], "ulm_custom_card_washer_delayed_starttime"),
      D("ulm_custom_card_washer_machine_stop_state"),
      { name: "ulm_custom_card_washer_job_states", selector: { object: {} } },
      D("ulm_custom_card_washer_label_idle"),
      D("ulm_custom_card_washer_label_configuring"),
      D("ulm_custom_card_washer_label_running"),
      ye("ulm_custom_card_washer_start_action"),
      ye("ulm_custom_card_washer_pause_action"),
      ye("ulm_custom_card_washer_stop_action"),
      ...K()
    ] : e.upstreamId === "custom_card_sun" ? [
      g(["sun"]),
      D("title"),
      Y("language", [
        { value: "en", label: "English" },
        { value: "de", label: "German" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "nl", label: "Dutch" },
        { value: "pl", label: "Polish" }
      ]),
      Y("timeFormat", [
        { value: "24h", label: "24-hour time" },
        { value: "12h", label: "12-hour time" }
      ]),
      I("darkMode"),
      I("showMoon"),
      g(["sensor"], "moon_entity"),
      g(["sensor"], "moon_altitude_entity"),
      g(["sensor"], "moon_azimuth_entity"),
      g(["sensor"], "moon_rising_entity"),
      g(["sensor"], "moon_setting_entity"),
      g(["sensor"], "moon_next_full_moon_entity"),
      g(["sensor"], "moon_next_new_moon_entity"),
      g(["sensor", "binary_sensor"], "moon_above_horizon_entity"),
      ...K()
    ] : e.upstreamId === "custom_card_pollen" ? [
      g(["sensor"]),
      g(["sensor"], "trees_entity"),
      D("custom_card_pollen_tree_name"),
      { name: "custom_card_pollen_tree_icon", selector: { icon: {} } },
      g(["sensor"], "grass_entity"),
      D("custom_card_pollen_grass_name"),
      { name: "custom_card_pollen_grass_icon", selector: { icon: {} } },
      g(["sensor"], "weeds_entity"),
      D("custom_card_pollen_weed_name"),
      { name: "custom_card_pollen_weed_icon", selector: { icon: {} } },
      ...K()
    ] : e.upstreamId === "custom_card_speedtest_gauges" ? [
      g(["sensor"]),
      g(["sensor"], "download_entity"),
      R("ulm_custom_card_speedtest_download_speed_color"),
      z("ulm_custom_card_speedtest_download_speed_max", 1, 1e5),
      g(["sensor"], "upload_entity"),
      R("ulm_custom_card_speedtest_upload_speed_color"),
      z("ulm_custom_card_speedtest_upload_speed_max", 1, 1e5),
      g(["sensor"], "ping_entity"),
      R("ulm_custom_card_speedtest_ping_color"),
      z("ulm_custom_card_speedtest_ping_max", 1, 1e5),
      I("ulm_custom_card_speedtest_round"),
      ...K()
    ] : e.upstreamId === "custom_card_nas_metrics" ? [
      g(["binary_sensor", "sensor", "switch"]),
      g(["sensor"], "disk_entity"),
      D("disk_name"),
      { name: "disk_icon", selector: { icon: {} } },
      R("disk_color"),
      g(["sensor"], "temperature_entity"),
      D("temperature_name"),
      { name: "temperature_icon", selector: { icon: {} } },
      R("temperature_color"),
      z("temperature_max", 1, 1e5),
      g(["sensor"], "memory_entity"),
      D("memory_name"),
      { name: "memory_icon", selector: { icon: {} } },
      R("memory_color"),
      z("memory_max", 1, 1e5),
      g(["sensor"], "cpu_entity"),
      D("cpu_name"),
      { name: "cpu_icon", selector: { icon: {} } },
      R("cpu_color"),
      z("cpu_max", 1, 1e5),
      ...K()
    ] : e.upstreamId === "custom_card_input_datetime" ? [
      g(["input_datetime"]),
      ...K()
    ] : e.upstreamId === "custom_card_weather_metrics" ? [
      g(["weather"]),
      g(["sensor"], "temperature_entity"),
      g(["sensor"], "date_entity"),
      ...[1, 2, 3, 4].flatMap((r) => [
        g(void 0, `ulm_custom_card_weather_metrics_entity_${r}`),
        D(`ulm_custom_card_weather_metrics_name_${r}`)
      ]),
      ...K()
    ] : e.upstreamId === "custom_card_tablet" ? [
      g(["binary_sensor", "sensor", "switch"]),
      g(["switch", "input_boolean"], "tablet_button_usb_entity"),
      g(["switch", "input_boolean"], "tablet_button_motion_entity"),
      g(["light", "switch", "input_boolean"], "tablet_button_display_entity"),
      g(["button"], "tablet_restart_entity"),
      g(["switch", "input_boolean"], "tablet_maintenance_entity"),
      g(["button"], "tablet_reload_entity"),
      g(["sensor"], "tablet_ram_entity"),
      g(["sensor"], "tablet_disk_entity"),
      g(["sensor", "binary_sensor", "switch"], "tablet_power_entity"),
      g(["sensor"], "battery_entity"),
      ...K()
    ] : (Do[e.family] ?? Do.entity)(e, t)
  ], a = Fr.has(e.upstreamId) ? ha(o) : o;
  return [
    ...jr(a).map(Br),
    ye("tap_action"),
    ye("hold_action"),
    ye("double_tap_action")
  ];
}, Hr = (e, t) => {
  const o = t?.variant ? (e.sourceIds ?? [e.upstreamId]).filter((r) => Mo(r) === t.variant || r === e.upstreamId && Mo(r) === void 0) : e.sourceIds ?? [e.upstreamId];
  return [...new Map(
    o.flatMap((r) => Zt.get(r)?.variables ?? []).map((r) => [r.name, r])
  ).values()].filter((r) => ma(e, r.name)).filter((r) => !Ir(e, r.name)).filter((r) => !Lr.has(r.name)).map((r) => {
    const n = Rr[r.name];
    if (n) return Y(r.name, n);
    if (Nr.has(r.name)) return I(r.name);
    if (Vr.has(r.name)) return z(r.name, -1e5, 1e5);
    if (Or.has(r.name))
      return {
        name: r.name,
        selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
      };
    switch (r.selector) {
      case "entity":
        return g(void 0, r.name);
      case "entity-multiple":
        return {
          name: r.name,
          selector: { entity: { multiple: !0 } }
        };
      case "action":
        return ye(r.name);
      case "icon":
        return { name: r.name, selector: { icon: {} } };
      case "color":
        return R(r.name);
      case "boolean":
        return I(r.name);
      case "number":
        return z(r.name, -1e5, 1e5);
      case "object":
        return { name: r.name, selector: { object: {} } };
      default:
        return D(r.name);
    }
  });
}, ya = (e) => new Set(e.flatMap((t) => t.schema ? [...ya(t.schema)] : t.name ? [t.name] : [])), Wr = (e, t) => {
  const o = ya(ga(e, t));
  return Hr(e, t).filter((a) => !o.has(a.name));
}, Gr = [
  [/input_boolean/, "mdi:toggle-switch"],
  [/light/, "mdi:lightbulb"],
  [/fan/, "mdi:fan"],
  [/cover|garage|door/, "mdi:window-shutter"],
  [/vacuum/, "mdi:robot-vacuum"],
  [/thermostat|climate|heat_pump|aircondition/, "mdi:thermostat"],
  [/weather/, "mdi:weather-partly-cloudy"],
  [/battery/, "mdi:battery"],
  [/person|presence|tracker|tracer/, "mdi:account"],
  [/media/, "mdi:play-circle"],
  [/playstation/, "mdi:controller-classic"],
  [/scene/, "mdi:palette"],
  [/alarm|lock/, "mdi:shield-lock"],
  [/camera/, "mdi:camera"],
  [/printer/, "mdi:printer"],
  [/nas/, "mdi:nas"],
  [/washer/, "mdi:washing-machine"],
  [/pollen|flower/, "mdi:flower"],
  [/waste|afval/, "mdi:trash-can"],
  [/navigate|back/, "mdi:arrow-right"],
  [/power|outlet|energy/, "mdi:power-socket-eu"],
  [/graph|sensor|gauge|speedtest/, "mdi:chart-line"],
  [/clock|date|datetime/, "mdi:calendar-clock"],
  [/title|subtitle/, "mdi:format-title"]
], Qt = (e, t) => t?.attributes.icon ? t.attributes.icon : e.upstreamId === "custom_card_trash" ? "mdi:trash-can-outline" : e.upstreamId === "custom_card_room_overview" ? "mdi:sofa" : e.upstreamId === "custom_card_roomview" ? "mdi:home-variant-outline" : e.upstreamId === "custom_card_entity_carousel" ? "mdi:view-carousel" : e.upstreamId === "custom_card_sun" ? "mdi:weather-sunny" : e.upstreamId === "custom_card_speedtest_gauges" ? "mdi:speedometer" : e.upstreamId === "advanced_home_energy_management" ? "mdi:home-lightning-bolt-outline" : e.upstreamId === "advanced_energy_buy_sell" ? "mdi:chart-timeline-variant" : e.upstreamId === "advanced_energy_panel_health" ? "mdi:solar-power-variant" : Gr.find(([o]) => o.test(e.upstreamId))?.[1] ?? "mdi:information-outline", Ur = (e) => {
  if (!(e === "<null>" || e === "<documented/inherited>")) {
    if (e === "true") return !0;
    if (e === "false") return !1;
    if (/^-?\d+(\.\d+)?$/.test(e)) return Number(e);
    try {
      const t = JSON.parse(e);
      return typeof t == "string" && (t.includes("[[[") || t.includes("var(--")) ? void 0 : t;
    } catch {
      return;
    }
  }
}, qr = (e) => {
  const t = {};
  for (const o of e.sourceIds ?? [e.upstreamId])
    for (const a of Zt.get(o)?.variables ?? []) {
      if (!ma(e, a.name)) continue;
      const r = Ur(a.defaultValue);
      r !== void 0 && (t[a.name] = r);
    }
  return t;
}, ba = (e, t, o) => {
  const a = o ? t?.states[o] : void 0, r = e.upstreamId === "mini_graph_card" ? {
    variant: "line",
    hours_to_show: 24,
    points_per_hour: 0.5,
    aggregate_func: "avg",
    group_by: "interval",
    cache: !0,
    smoothing: !0,
    animate: !1,
    height: 150,
    line_width: 5,
    bar_spacing: 4,
    color_thresholds_transition: "smooth",
    align_header: "default",
    align_icon: "right",
    align_state: "left",
    show: {
      name: !0,
      icon: !0,
      state: !0,
      graph: "line",
      fill: !0,
      points: "hover",
      legend: !0,
      average: !1,
      extrema: !1,
      labels: "hover",
      labels_secondary: "hover",
      loading_indicator: !0
    }
  } : e.upstreamId === "card_scenes" ? {
    scene_buttons_only: !1
  } : e.upstreamId === "advanced_home_energy_management" ? {
    energy_grid_label: "GRID",
    energy_grid_import_label: "GRID · Import",
    energy_grid_export_label: "GRID · Export",
    energy_solar_label: "Solar Panels",
    energy_battery_label: "Battery",
    energy_home_label: "HOME",
    energy_forecast_label: "Expected",
    energy_ev_label: "EV charger",
    energy_charge_label: "Charging",
    energy_discharge_label: "Discharging",
    energy_idle_label: "Idle",
    energy_auto_label: "Auto",
    energy_manual_label: "Manual",
    mode_solar_first_label: "Solar first",
    mode_smart_saving_label: "Smart saving",
    mode_smart_trading_label: "Smart trading",
    grid_phase_scale_max: 3e3,
    solar_scale_max: 6e3,
    battery_unit_scale_max: 2400,
    home_scale_max: 4e3,
    price_low_threshold: 0.18,
    price_medium_threshold: 0.26,
    price_high_threshold: 0.34,
    price_critical_threshold: 0.42,
    show_grid_phases: !0,
    show_battery_units: !0,
    show_tariff_timeline: !0,
    import_color: "#ff9f43",
    export_color: "#4cd98b",
    solar_color: "#f6c744",
    battery_color: "#3b82f6",
    home_color: "#3478f6",
    price_negative_color: "#0288d1",
    price_low_color: "#2e7d32",
    price_medium_color: "#9ccc65",
    price_high_color: "#fdd835",
    price_critical_color: "#e53935",
    navigation_path: "/hems-tower/savings-overview",
    tap_action: {
      action: "navigate",
      navigation_path: "/hems-tower/savings-overview"
    }
  } : e.upstreamId === "advanced_energy_buy_sell" ? {
    buy_sell_title: "Buy and sell moments (all-in €/kWh)",
    buy_sell_show_result: !0,
    buy_sell_trade_energy: 10,
    buy_sell_trade_power: 7.2,
    buy_sell_trade_efficiency: 86,
    buy_sell_feed_in_fee: 0,
    buy_sell_slot_minutes: 15,
    buy_sell_graph_span: 36,
    buy_sell_span_start: "day",
    buy_sell_update_interval: 5,
    buy_sell_chart_height: 300,
    buy_sell_show_now: !0,
    buy_sell_now_label: "Now",
    buy_sell_now_color: "var(--primary-text-color)",
    buy_sell_show_legend: !0,
    buy_sell_show_grid: !0,
    buy_sell_axis_label: "€/kWh",
    buy_sell_price_decimals: 3,
    buy_sell_axis_decimals: 2,
    buy_sell_bar_radius: 2,
    buy_sell_price_label: "Price",
    buy_sell_charge_label: "Planned grid charge",
    buy_sell_planned_sell_label: "Planned sell",
    buy_sell_possible_sell_label: "Possible sell",
    buy_sell_price_color: "#78909c",
    buy_sell_charge_color: "#43a047",
    buy_sell_planned_sell_color: "#fb8c00",
    buy_sell_possible_sell_color: "#ffcc80"
  } : e.upstreamId === "advanced_energy_panel_health" ? {
    panel_health_title: "Panel health",
    panel_gauge_max: 350,
    panel_warning_average_min: 30,
    panel_low_output_percent: 60,
    panel_segment_1: 80,
    panel_segment_2: 150,
    panel_segment_3: 230,
    panel_segment_4: 300,
    panel_color_0: "#b0bec5",
    panel_color_1: "#ffa726",
    panel_color_2: "#d4e157",
    panel_color_3: "#66bb6a",
    panel_color_4: "#2e7d32",
    panel_color_5: "#2e7d32",
    panel_show_summary: !0,
    panel_show_gauges: !0
  } : e.upstreamId === "card_battery" ? {
    battery_warning_threshold: 50,
    battery_low_threshold: 20,
    battery_critical_threshold: 10,
    battery_healthy_color: "green",
    battery_warning_color: "yellow",
    battery_low_color: "orange",
    battery_critical_color: "red"
  } : e.upstreamId === "card_room" ? {
    icon: "mdi:sofa-single",
    label_use_temperature: !0,
    label_use_brightness: !1,
    ulm_card_dynamic_color: !1,
    room_status: [],
    room_secondary_parts: [],
    room_temperature_entity: o && /^(sensor|climate)\./.test(o) ? o : void 0,
    room_brightness_entity: o?.startsWith("light.") ? o : void 0,
    room_light_entity: o?.startsWith("light.") ? o : void 0
  } : e.upstreamId === "custom_card_media_player_sonos" ? {
    ulm_card_media_player_enable_art: !1,
    use_media_info: !1,
    show_volume_level: !0,
    volume_controls: ["volume_buttons"],
    media_controls: ["play_pause_stop"],
    collapsible_controls: !1,
    sonos_details_always_visible: !1,
    ...Xt(t, o)
  } : e.upstreamId === "custom_card_room_overview" ? {
    ulm_card_room_overview_light_icon_on: "mdi:lightbulb",
    ulm_card_room_overview_light_icon_off: "mdi:lightbulb-off",
    ulm_card_room_overview_cover_icon_open: "mdi:blinds-open",
    ulm_card_room_overview_cover_icon_closed: "mdi:roller-shade-closed",
    ulm_card_dynamic_color: !1
  } : e.upstreamId === "custom_card_welcome" ? {
    nav_1: "house",
    icon_1: "mdi:home",
    name_1: "House",
    color_1: "blue",
    nav_2: "lights",
    icon_2: "mdi:lightbulb",
    name_2: "Lights",
    color_2: "yellow",
    nav_3: "security",
    icon_3: "mdi:shield",
    name_3: "Secure",
    color_3: "green",
    nav_4: "climate",
    icon_4: "mdi:radiator",
    name_4: "Climate",
    color_4: "purple",
    nav_5: "network",
    icon_5: "mdi:flask",
    name_5: "Lab",
    color_5: "red"
  } : e.upstreamId === "custom_card_plant" ? {
    ulm_card_flower_name: "No name set",
    ulm_custom_card_plant_correct: "Correto",
    ulm_custom_card_plant_problem: "Problema"
  } : e.upstreamId === "custom_card_entity_carousel" ? {
    carousel_loop: !0,
    carousel_show_header: !0,
    carousel_show_labels: !0,
    carousel_visible_items: 7,
    carousel_initial_index: 0,
    carousel_effect: "coverflow",
    carousel_grab_cursor: !0,
    carousel_centered_slides: !0,
    carousel_slides_per_view: "auto",
    carousel_coverflow_rotate: 0,
    carousel_coverflow_stretch: 0,
    carousel_coverflow_depth: 400,
    carousel_coverflow_modifier: 1,
    carousel_coverflow_slide_shadows: !0
  } : e.upstreamId === "custom_card_playstation" ? {
    icon: "mdi:controller-classic",
    console_platform: "auto",
    console_show_artwork: !0,
    console_show_controls: !0,
    ...Jt(t, o)
  } : e.upstreamId === "custom_card_pollen" ? {
    icon: void 0,
    show_state: !1
  } : e.upstreamId === "custom_card_speedtest_gauges" ? {
    ulm_custom_card_speedtest_download_speed_color: "yellow",
    ulm_custom_card_speedtest_download_speed_max: 100,
    ulm_custom_card_speedtest_upload_speed_color: "blue",
    ulm_custom_card_speedtest_upload_speed_max: 40,
    ulm_custom_card_speedtest_ping_color: "green",
    ulm_custom_card_speedtest_ping_max: 85,
    ulm_custom_card_speedtest_round: !1
  } : {}, n = (/* @__PURE__ */ new Set([
    "card_battery",
    "custom_card_pollen",
    "advanced_home_energy_management",
    "custom_card_media_player_sonos"
  ])).has(e.upstreamId);
  return {
    type: `custom:${e.tag}`,
    ...qr(e),
    ...r,
    entity: o,
    entities: e.upstreamId === "mini_graph_card" && o ? [o] : void 0,
    waste_streams: e.upstreamId === "custom_card_trash" ? gr() : void 0,
    show_today: e.upstreamId === "custom_card_trash" ? !1 : void 0,
    show_tomorrow: e.upstreamId === "custom_card_trash" ? !1 : void 0,
    name: void 0,
    icon: n ? void 0 : r.icon ?? Qt(e, a),
    show_icon: !0,
    show_state: e.upstreamId !== "custom_card_pollen",
    layout: "default"
  };
}, Kr = {
  automation: "mdi:robot",
  button: "mdi:gesture-tap-button",
  cover: "mdi:window-shutter",
  fan: "mdi:fan",
  input_boolean: "mdi:toggle-switch",
  light: "mdi:lightbulb",
  lock: "mdi:lock",
  media_player: "mdi:play-circle",
  scene: "mdi:palette",
  script: "mdi:script-text",
  switch: "mdi:toggle-switch"
}, tt = (e, t = "") => {
  const o = t ? e?.states[t] : void 0, a = t.split(".", 1)[0];
  return {
    entity: t,
    name: o?.attributes.friendly_name,
    icon: o?.attributes.icon ?? Kr[a] ?? "mdi:gesture-tap-button",
    icon_type: o?.attributes.entity_picture ? "entity-picture" : "icon",
    color: "purple",
    tap_action: { action: "toggle" }
  };
}, fa = (e) => {
  if (typeof e != "number" && (typeof e != "string" || !e.trim())) return;
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, To = (e, t) => {
  if (Me(t)) return;
  const o = t.attributes, a = [
    o.current_temperature,
    o.temperature,
    o.device_temperature,
    t.entity_id.startsWith("sensor.") ? t.state : void 0
  ].map(fa).find((n) => n !== void 0), r = o.unit_of_measurement ?? (t.entity_id.startsWith("climate.") || o.device_class === "temperature" || o.current_temperature !== void 0 || o.device_temperature !== void 0 || o.temperature !== void 0 ? e.config?.unit_system?.temperature : void 0);
  return a !== void 0 && typeof r == "string" && ["°C", "°F", "K"].includes(r.trim()) ? `${a} ${r.trim()}` : void 0;
}, Oo = (e) => {
  if (Me(e) || !e.entity_id.startsWith("light.")) return;
  const t = fa(e.attributes.brightness);
  return t !== void 0 && t >= 0 && t <= 255 ? `${Math.round(t / 255 * 100)}%` : void 0;
}, Yr = (e, t) => {
  const o = e.entity ? t.states[e.entity] : void 0, a = e.secondary_info;
  if (a === "none") return;
  if (a === "custom") return e.secondary || void 0;
  if (a === "composed")
    return (e.room_secondary_parts ?? []).map((l) => {
      switch (l.type) {
        case "text":
          return l.text?.trim();
        case "name":
          return o?.attributes.friendly_name || o?.entity_id;
        case "state":
          return Me(o) ? void 0 : A(o);
        case "brightness":
          return Oo(o);
        case "temperature":
          return To(t, o);
        case "attribute": {
          if (Me(o) || !l.attribute) return;
          const s = o.attributes[l.attribute];
          return typeof s == "string" && s.trim() && !["unknown", "unavailable"].includes(s) || typeof s == "number" && Number.isFinite(s) || typeof s == "boolean" ? String(s) : void 0;
        }
      }
    }).filter(Boolean).join(" · ") || void 0;
  if (a === "name") return le(e, o, t);
  if (a === "last-changed" || a === "last-updated") {
    const l = a === "last-changed" ? o?.last_changed : o?.last_updated;
    return l ? new Date(l).toLocaleString() : a === "last-changed" ? "Last changed unavailable" : "Last updated unavailable";
  }
  if (a !== "state" && e.secondary) return e.secondary;
  const r = e.label_use_temperature !== !1 ? To(t, e.room_temperature_entity ? t.states[e.room_temperature_entity] : o) : void 0, n = e.label_use_brightness === !0 ? Oo(e.room_brightness_entity ? t.states[e.room_brightness_entity] : o?.entity_id.startsWith("light.") ? o : e.room_light_entity ? t.states[e.room_light_entity] : void 0) : void 0, i = [...new Set([r, n].filter((l) => !!l))];
  return a === "state" ? [.../* @__PURE__ */ new Set([A(o), ...i])].join(" · ") : i.join(" · ") || A(o);
}, Ze = 4, va = ["window", "door", "motion", "water", "smoke"], ot = (e) => {
  const t = e?.attributes.device_class;
  return t === "window" ? "window" : t === "door" || t === "garage_door" || t === "opening" ? "door" : t === "moisture" ? "water" : t === "smoke" || t === "fire" ? "smoke" : "motion";
}, Me = (e) => !e || ["unknown", "unavailable"].includes(e.state), eo = (e, t) => Me(e) ? !1 : {
  window: ["on", "open", "opening"],
  door: ["on", "open", "opening"],
  motion: ["on", "motion", "detected", "occupied", "home", "active"],
  water: ["on", "wet", "moisture", "detected", "water", "leak"],
  smoke: ["on", "smoke", "fire", "detected", "alarm"]
}[t].includes(e.state.toLowerCase()), to = (e, t) => ({
  window: t ? "mdi:window-open-variant" : "mdi:window-closed-variant",
  door: t ? "mdi:door-open" : "mdi:door-closed",
  motion: t ? "mdi:motion-sensor" : "mdi:motion-sensor-off",
  water: t ? "mdi:water-alert" : "mdi:water-check",
  smoke: t ? "mdi:smoke-detector-alert" : "mdi:smoke-detector"
})[e], wa = (e, t = "") => {
  if (e?.attributes.icon) return e.attributes.icon;
  const o = String(e?.attributes.device_class ?? "");
  if (["window", "door", "garage_door", "opening", "motion", "occupancy", "presence", "moisture", "smoke", "fire"].includes(o)) {
    const n = ot(e);
    return to(n, eo(e, n));
  }
  const a = {
    temperature: "mdi:thermometer",
    humidity: "mdi:water-percent",
    illuminance: "mdi:brightness-5",
    battery: "mdi:battery",
    power: "mdi:flash",
    energy: "mdi:lightning-bolt",
    carbon_monoxide: "mdi:molecule-co",
    gas: "mdi:gas-cylinder",
    safety: "mdi:shield-check",
    connectivity: "mdi:wifi",
    problem: "mdi:alert-circle",
    vibration: "mdi:vibrate"
  }, r = {
    light: "mdi:lightbulb",
    switch: "mdi:toggle-switch",
    input_boolean: "mdi:toggle-switch",
    sensor: "mdi:eye",
    binary_sensor: "mdi:radiobox-marked",
    cover: "mdi:window-shutter",
    climate: "mdi:thermostat",
    fan: "mdi:fan",
    media_player: "mdi:play-circle",
    person: "mdi:account",
    device_tracker: "mdi:account",
    lock: "mdi:lock",
    scene: "mdi:palette",
    script: "mdi:script-text",
    button: "mdi:gesture-tap-button",
    input_button: "mdi:gesture-tap-button",
    group: "mdi:lightbulb-group",
    automation: "mdi:robot",
    input_select: "mdi:form-dropdown"
  };
  return a[o] ?? r[(e?.entity_id ?? t).split(".")[0]] ?? "mdi:information-outline";
}, at = (e, t = "") => {
  const o = e?.states[t], a = t.split(".")[0], r = ["sensor", "binary_sensor", "person", "device_tracker"].includes(a);
  return {
    entity: t,
    icon: wa(o, t),
    icon_type: o?.attributes.entity_picture ? "entity-picture" : "icon",
    active_state: a === "media_player" ? "playing" : a === "cover" ? "open" : a === "person" || a === "device_tracker" ? "home" : a === "lock" ? "unlocked" : "on",
    color: "blue",
    tap_action: { action: r ? "more-info" : "toggle" },
    hold_action: { action: "more-info" },
    double_tap_action: { action: "none" }
  };
}, oo = (e, t, o = /* @__PURE__ */ new Set()) => {
  if (!t || t.state !== "on" || o.has(t.entity_id)) return;
  o.add(t.entity_id);
  const a = t.attributes.rgb_color;
  if (Array.isArray(a) && a.length === 3 && a.every((n) => typeof n == "number" && Number.isFinite(n) && n >= 0 && n <= 255))
    return a;
  const r = t.attributes.entity_id;
  if (Array.isArray(r))
    for (const n of r) {
      if (typeof n != "string") continue;
      const i = oo(e, e.states[n], o);
      if (i) return i;
    }
};
var Xr = Object.defineProperty, Jr = Object.getOwnPropertyDescriptor, ao = (e, t, o, a) => {
  for (var r = a > 1 ? void 0 : a ? Jr(t, o) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = (a ? i(t, o, r) : i(r)) || r);
  return a && r && Xr(t, o, r), r;
};
const Zr = [
  { id: "primary", title: "Primary entity presentation", icon: "mdi:account-circle-outline" },
  { id: "climate", title: "Climate", icon: "mdi:thermometer" },
  { id: "sensors", title: "Sensor status", icon: "mdi:shield-check-outline" },
  { id: "devices", title: "Device controls", icon: "mdi:gesture-tap" },
  { id: "actions", title: "Card interactions", icon: "mdi:gesture-tap-button" }
], Qr = (e) => e === "temperature" || e === "humidity" || e.startsWith("climate_") ? "climate" : ["group_motions", "group_doors", "group_windows", "group_water"].includes(e) ? "sensors" : ["group_lights", "group_windows_shutters", "group_outlets", "group_tv"].includes(e) || /^(lights|shutters|outlets|tv)_/.test(e) ? "devices" : xa.has(e) ? "actions" : "primary", $a = (e, t) => e.flatMap((o) => {
  if (!o.schema) return Qr(o.name) === t ? [o] : [];
  const a = $a(o.schema, t);
  return a.length ? [{ ...o, schema: a }] : [];
}), en = [
  { id: "context", title: "Context", icon: "mdi:shape-outline" },
  { id: "content", title: "Content", icon: "mdi:format-align-left" },
  { id: "layout", title: "Layout", icon: "mdi:view-dashboard-outline" },
  { id: "interactions", title: "Interactions", icon: "mdi:gesture-tap" },
  { id: "features", title: "Features", icon: "mdi:view-list" }
], tn = /* @__PURE__ */ new Set([
  "name",
  "secondary",
  "primary_info",
  "secondary_info",
  "icon",
  "icon_type",
  "icon_color",
  "show_icon",
  "show_name",
  "show_state",
  "unit",
  "icon_image",
  "mini_graph_show_state",
  "mini_graph_name_adaptive_color",
  "mini_graph_icon_adaptive_color"
]), on = /* @__PURE__ */ new Set([
  "layout",
  "fill_container",
  "variant",
  "features_position",
  "multiline_secondary",
  "height",
  "line_width",
  "bar_spacing",
  "font_size",
  "font_size_header",
  "align_header",
  "align_icon",
  "align_state",
  "group",
  "mini_graph_show_fill",
  "mini_graph_show_points",
  "mini_graph_show_labels",
  "mini_graph_show_labels_secondary",
  "carousel_visible_items",
  "carousel_initial_index",
  "carousel_effect",
  "carousel_grab_cursor",
  "carousel_centered_slides",
  "carousel_slides_per_view",
  "carousel_coverflow_rotate",
  "carousel_coverflow_stretch",
  "carousel_coverflow_depth",
  "carousel_coverflow_modifier",
  "carousel_coverflow_slide_shadows"
]), xa = /* @__PURE__ */ new Set([
  "tap_action",
  "hold_action",
  "double_tap_action",
  "navigation_path",
  "settings_path"
]), No = {
  temperature: "Temperature entity",
  humidity: "Humidity entity",
  climate_name: "Climate name",
  climate_icon: "Climate icon",
  climate_icon_type: "Climate icon type",
  climate_primary_info: "Climate primary information",
  climate_secondary_info: "Climate secondary information (default: humidity)",
  climate_secondary: "Custom climate secondary text",
  group_doors: "Doors status entity",
  group_windows: "Windows status entity",
  group_motions: "Motion status entity",
  group_water: "Water status entity",
  group_lights: "Lights control entity",
  group_windows_shutters: "Shutters control entity",
  group_outlets: "Outlets control entity",
  group_tv: "Television control entity",
  ...Object.fromEntries(
    [["lights", "Lights"], ["shutters", "Shutters"], ["outlets", "Outlets"], ["tv", "Television"]].flatMap(([e, t]) => [["tap", "tap"], ["hold", "hold"], ["double_tap", "double tap"]].map(([o, a]) => [`${e}_${o}_action`, `${t}: ${a} action`]))
  )
}, Vo = (e) => e.name === "entity" ? "context" : xa.has(e.name) || e.name.endsWith("_action") ? "interactions" : on.has(e.name) || e.name.endsWith("_horizontal") || e.name.endsWith("_narrow_buttons") ? "layout" : tn.has(e.name) ? "content" : "features", an = (e) => {
  const t = {
    context: [],
    content: [],
    layout: [],
    interactions: [],
    features: []
  };
  for (const o of e) {
    if (!o.schema?.length) {
      t[Vo(o)].push(o);
      continue;
    }
    const a = /* @__PURE__ */ new Map();
    for (const r of o.schema) {
      const n = Vo(r);
      a.set(n, [...a.get(n) ?? [], r]);
    }
    for (const [r, n] of a) t[r].push({ ...o, schema: n });
  }
  return t;
};
let lt = class extends be {
  constructor() {
    super(...arguments), this.computeLabel = (e) => this.config?.type.includes("custom-card-roomview") && No[e.name] ? No[e.name] : this.config?.type.includes("custom-card-trash") && e.name === "entity" ? "Optional card entity" : this.config?.type.includes("custom-card-washer") && e.name === "entity" ? G(this.hass, "machine_state_entity") : G(this.hass, e.name), this.computeHelper = (e) => kr(
      this.config?.type.includes("custom-card-washer") && e.name === "entity" ? "machine_state_entity" : e.name
    ), this.valueChanged = (e) => {
      if (!this.config || !e.detail.value) return;
      const t = e.detail.value, o = { ...this.config, ...t };
      if (this.config.type.includes("mini-graph-card")) {
        const a = { ...this.config.show }, r = {
          mini_graph_show_legend: "legend",
          mini_graph_show_average: "average",
          mini_graph_show_extrema: "extrema",
          mini_graph_name_adaptive_color: "name_adaptive_color",
          mini_graph_icon_adaptive_color: "icon_adaptive_color",
          mini_graph_loading_indicator: "loading_indicator"
        };
        for (const [n, i] of Object.entries(r))
          Object.prototype.hasOwnProperty.call(t, n) && (Object.assign(a, { [i]: t[n] }), delete o[n]);
        typeof t.mini_graph_show_state == "string" && (a.state = t.mini_graph_show_state === "last" ? "last" : t.mini_graph_show_state !== "hidden", delete o.mini_graph_show_state);
        for (const [n, i] of [
          ["mini_graph_show_fill", "fill"],
          ["mini_graph_show_points", "points"],
          ["mini_graph_show_labels", "labels"],
          ["mini_graph_show_labels_secondary", "labels_secondary"]
        ]) {
          const l = t[n];
          typeof l == "string" && (Object.assign(a, {
            [i]: l === "fade" ? "fade" : l === "hover" ? "hover" : l !== "hidden"
          }), delete o[n]);
        }
        if ((t.variant === "line" || t.variant === "bar") && (a.graph = t.variant), o.show = a, typeof t.entity == "string" && t.entity !== this.config.entity) {
          const n = this.miniGraphEntities();
          n.length ? n[0] = { ...n[0], entity: t.entity } : n.push({ entity: t.entity }), o.entities = n;
        }
      }
      if (Object.prototype.hasOwnProperty.call(t, "name") && JSON.stringify(t.name) !== JSON.stringify(this.config.name) && delete o.name_mode, this.config.type.includes("media-player-sonos") && typeof t.entity == "string" && t.entity !== this.config.entity)
        for (const { configKey: a } of Kt)
          this.config[a] === void 0 && delete o[a];
      if (this.config.type.includes("custom-card-playstation") && typeof t.entity == "string" && t.entity !== this.config.entity)
        for (const { configKey: a } of la)
          this.config[a] === void 0 && delete o[a];
      this.config = o, he(this, "config-changed", { config: o });
    }, this.addMiniGraphEntity = () => {
      const e = this.miniGraphEntities(), t = new Set(e.map((a) => a.entity)), o = Object.keys(this.hass?.states ?? {}).find((a) => !t.has(a) && ["sensor", "binary_sensor", "input_number"].includes(a.split(".", 1)[0])) ?? "";
      e.push({ entity: o, show_graph: !0, show_line: !0, show_fill: !0, show_points: !0, show_legend: !0 }), this.updateMiniGraphConfig({ entities: e });
    }, this.addMiniGraphThreshold = () => {
      this.updateMiniGraphConfig({
        color_thresholds: [...this.miniGraphThresholds(), { color: "#03a9f4" }]
      });
    }, this.addMiniGraphState = () => {
      this.updateMiniGraphConfig({
        state_map: [...this.miniGraphStateMap(), { value: "", label: "" }]
      });
    }, this.addWasteStream = () => {
      this.config && this.updateWasteStreams([
        ...ze(this.config),
        { enabled: !0, entity: "", label: "Custom waste", icon: "mdi:trash-can", color: "#43a047" }
      ]);
    }, this.addCarouselItem = () => {
      this.config && this.updateCarouselItems([
        ...this.config.carousel_items ?? [],
        {
          entity: "",
          icon: "mdi:circle",
          color: "primary",
          tap_action: { action: "more-info" },
          hold_action: { action: "none" }
        }
      ]);
    }, this.addSonosShortcut = () => {
      this.config && this.updateSonosShortcuts([
        ...this.config.shortcuts?.buttons ?? [],
        { icon: "mdi:playlist-music", type: "playlist", id: "" }
      ]);
    };
  }
  setConfig(e) {
    const t = e.type.replace(/^custom:/, ""), o = qt.find((a) => a.tag === t);
    this.config = {
      ...e,
      variant: e.variant ?? o?.variant
    };
  }
  render() {
    if (!this.hass || !this.config) return m;
    const e = hr(this.config.type.replace(/^custom:/, ""));
    if (!e) return m;
    const t = ga(e, this.config), o = Wr(e, this.config).filter((d) => e.upstreamId !== "custom_card_trash" || !d.name.startsWith("ulm_card_datum_") && !d.name.includes("ophaling")), a = an([...t, ...o]), r = ba(e, this.hass, this.config.entity), n = this.config.show, i = {
      ...r,
      ...this.config,
      ...e.upstreamId === "custom_card_roomview" ? {
        climate_icon_type: this.config.climate_icon_type ?? "icon",
        climate_primary_info: this.config.climate_primary_info ?? (this.config.climate_name ? "name" : "state"),
        ...Object.fromEntries(["lights", "shutters", "outlets", "tv"].flatMap((d) => ["tap", "hold", "double_tap"].map((u) => {
          const _ = `${d}_${u}_action`;
          return [_, this.config[_] ?? { action: u === "double_tap" ? "toggle" : "more-info" }];
        })))
      } : {},
      ...e.upstreamId === "mini_graph_card" ? {
        mini_graph_show_state: n?.state === "last" ? "last" : n?.state === !1 ? "hidden" : "current",
        mini_graph_show_fill: n?.fill === "fade" ? "fade" : n?.fill === !1 ? "hidden" : "solid",
        mini_graph_show_points: n?.points === !0 ? "always" : n?.points === !1 ? "hidden" : "hover",
        mini_graph_show_labels: n?.labels === !0 ? "always" : n?.labels === !1 ? "hidden" : "hover",
        mini_graph_show_labels_secondary: n?.labels_secondary === !0 ? "always" : n?.labels_secondary === !1 ? "hidden" : "hover",
        mini_graph_show_legend: n?.legend ?? !0,
        mini_graph_show_average: n?.average ?? !1,
        mini_graph_show_extrema: n?.extrema ?? !1,
        mini_graph_name_adaptive_color: n?.name_adaptive_color ?? !1,
        mini_graph_icon_adaptive_color: n?.icon_adaptive_color ?? !1,
        mini_graph_loading_indicator: n?.loading_indicator ?? !0
      } : {},
      ...e.upstreamId === "custom_card_entity_carousel" ? {
        carousel_effect: this.config.carousel_effect ?? this.config.parameters?.effect ?? "coverflow",
        carousel_grab_cursor: this.config.carousel_grab_cursor ?? this.config.parameters?.grabCursor ?? !0,
        carousel_centered_slides: this.config.carousel_centered_slides ?? this.config.parameters?.centeredSlides ?? !0,
        carousel_slides_per_view: String(
          this.config.carousel_slides_per_view ?? this.config.parameters?.slidesPerView ?? "auto"
        ),
        carousel_coverflow_rotate: this.config.carousel_coverflow_rotate ?? this.config.parameters?.coverflowEffect?.rotate ?? 0,
        carousel_coverflow_stretch: this.config.carousel_coverflow_stretch ?? this.config.parameters?.coverflowEffect?.stretch ?? 0,
        carousel_coverflow_depth: this.config.carousel_coverflow_depth ?? this.config.parameters?.coverflowEffect?.depth ?? 400,
        carousel_coverflow_modifier: this.config.carousel_coverflow_modifier ?? this.config.parameters?.coverflowEffect?.modifier ?? 1,
        carousel_coverflow_slide_shadows: this.config.carousel_coverflow_slide_shadows ?? this.config.parameters?.coverflowEffect?.slideShadows ?? !0
      } : {},
      layout: (this.config.layout ?? r.layout) === "default" ? "horizontal" : this.config.layout ?? r.layout
    };
    if (e.upstreamId === "custom_card_roomview")
      return c`<div class="editor-sections room-view-editor">
        ${Zr.map((d) => this.renderEditorSection(
        d,
        $a([...t, ...o], d.id),
        i,
        m,
        !1
      ))}
      </div>`;
    const l = e.upstreamId === "mini_graph_card" ? this.renderMiniGraphEditors() : e.upstreamId === "custom_card_trash" ? this.renderWasteStreamEditor() : e.upstreamId === "custom_card_media_player_sonos" ? this.renderSonosShortcutEditor() : e.upstreamId === "custom_card_entity_carousel" ? this.renderCarouselItemEditor() : e.family === "scene" ? this.renderItemEditor(
      "scene_items",
      "Scene buttons",
      e.upstreamId === "card_welcome_scenes" ? void 0 : ["scene"]
    ) : e.upstreamId === "card_room" ? c`${this.renderItemEditor("room_sensors", G(this.hass, "room_buttons"))}${this.renderRoomStatusEditor()}` : m, s = e.upstreamId === "mini_graph_card" || e.upstreamId === "custom_card_trash" || e.upstreamId === "custom_card_media_player_sonos" || e.upstreamId === "custom_card_entity_carousel" || e.family === "scene" || e.upstreamId === "card_room";
    return c`
      <div class="editor-sections">
        ${en.map((d) => this.renderEditorSection(
      d,
      a[d.id],
      i,
      d.id === "features" && s ? l : d.id === "content" && e.upstreamId === "card_room" ? this.renderRoomSecondaryEditor() : m,
      d.id === "features" && s || d.id === "content" && e.upstreamId === "card_room" && this.config?.secondary_info === "composed"
    ))}
      </div>
    `;
  }
  renderEditorSection(e, t, o, a, r) {
    return !t.length && !r ? m : c`
      <ha-expansion-panel class="editor-section" outlined .expanded=${e.id === "primary"}>
        <span slot="header" class="section-header">
          <ha-icon .icon=${e.icon}></ha-icon>
          <span>${e.title}</span>
        </span>
        <div class="section-body">
          ${t.length ? c`
            <ha-form
              .hass=${this.hass}
              .data=${o}
              .schema=${t}
              .computeLabel=${this.computeLabel}
              .computeHelper=${this.computeHelper}
              @value-changed=${this.valueChanged}
            ></ha-form>
          ` : m}
          ${a}
        </div>
      </ha-expansion-panel>
    `;
  }
  renderItemEditor(e, t, o) {
    if (!this.config) return m;
    const a = this.config[e], n = ((e === "scene_items" ? a?.length ? a : void 0 : a) ?? (this.config.entities ?? []).map((i) => ({ entity: i }))).map((i) => e === "scene_items" ? { ...tt(this.hass, i.entity), ...i } : { ...at(this.hass, i.entity), ...i });
    return c`
      <section class="item-editor">
        <h3>${t}</h3>
        <p>${e === "scene_items" ? "Each button starts with sensible values from its entity. You can override every value, including its name." : G(this.hass, "room_buttons_help")}</p>
        ${n.map((i, l) => c`
          <div class="item-row">
            <label class="field wide">
              <span>Button entity</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: o?.length ? { domain: o } : {} }}
                .value=${i.entity}
                @value-changed=${(s) => this.updateItem(e, l, "entity", s.detail.value)}
              ></ha-selector>
              <small>${e === "scene_items" ? "Select the entity this button controls. Welcome Scenes supports every Home Assistant domain." : "Select the entity represented by this room sensor button."}</small>
            </label>
            ${e === "scene_items" ? c`<label class="field">
              <span>Custom name</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${i.name ?? i.label ?? ""}
                @value-changed=${(s) => this.updateItem(e, l, "name", s.detail.value)}
              ></ha-selector>
              <small>Text shown below the button. Change it independently for every button.</small>
            </label>` : m}
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${i.icon}
                @value-changed=${(s) => this.updateItem(e, l, "icon", s.detail.value)}
              ></ha-selector>
              <small>Defaults to the entity icon or a suitable icon for its domain.</small>
            </label>
            ${e === "room_sensors" || e === "scene_items" ? c`
              <label class="field item-icon-type">
                <span>Icon type</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{ select: {
      mode: "dropdown",
      options: [
        { value: "icon", label: "Icon" },
        { value: "entity-picture", label: "Entity picture" }
      ]
    } }}
                  .value=${i.icon_type ?? "icon"}
                  @value-changed=${(s) => this.updateItem(e, l, "icon_type", s.detail.value)}
                ></ha-selector>
                <small>Show the selected icon or the entity picture when one is available.</small>
              </label>
            ` : m}
            <label class="field">
              <span>Color</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: { default_color: e === "room_sensors" ? "blue" : "purple" } }}
                .value=${i.color}
                @value-changed=${(s) => this.updateItem(e, l, "color", s.detail.value)}
              ></ha-selector>
              <small>Accent color used by the button and its active state.</small>
            </label>
            ${e === "scene_items" ? c`
              <label class="field">
                <span>Navigation path</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{ navigation: {} }}
                  .value=${i.navigation_path ?? i.nav_path ?? ""}
                  @value-changed=${(s) => this.updateItem(e, l, "navigation_path", s.detail.value)}
                ></ha-selector>
                <small>Optional destination selected from your Home Assistant dashboards. It overrides the tap action.</small>
              </label>
            ` : m}
            ${e === "room_sensors" ? c`
              <label class="field">
                <span>${G(this.hass, "active_state")}</span>
                <ha-selector .hass=${this.hass} .selector=${{ text: {} }} .value=${i.active_state}
                  @value-changed=${(s) => this.updateItem(e, l, "active_state", s.detail.value)}></ha-selector>
                <small>${G(this.hass, "room_active_state_help")}</small>
              </label>
              ${["hold_action", "double_tap_action"].map((s) => c`
                <label class="field">
                  <span>${G(this.hass, s)}</span>
                  <ha-selector .hass=${this.hass} .selector=${{ ui_action: {} }} .value=${i[s]}
                    @value-changed=${(d) => this.updateItem(e, l, s, d.detail.value)}></ha-selector>
                </label>
              `)}
            ` : m}
            <label class="field">
              <span>Tap action</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_action: {} }}
                .value=${i.tap_action}
                @value-changed=${(s) => this.updateItem(e, l, "tap_action", s.detail.value)}
              ></ha-selector>
              <small>${e === "scene_items" ? "Defaults to activating scenes and toggling other supported entities." : G(this.hass, "room_button_action_help")}</small>
            </label>
            <div class="item-actions wide">
              ${e === "room_sensors" ? c`
                <button class="move-up" ?disabled=${l === 0}
                  @click=${() => this.moveRoomSensor(l, -1)}>${G(this.hass, "room_move_up")}</button>
                <button class="move-down" ?disabled=${l === n.length - 1}
                  @click=${() => this.moveRoomSensor(l, 1)}>${G(this.hass, "room_move_down")}</button>
              ` : m}
              <button @click=${() => this.removeItem(e, l)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${() => this.addItem(e)}>Add button</button>
      </section>
    `;
  }
  renderRoomSecondaryEditor() {
    if (this.config?.secondary_info !== "composed") return m;
    const e = this.config.room_secondary_parts ?? [], t = ["text", "name", "state", "brightness", "temperature", "attribute"];
    return c`<section class="item-editor room-secondary-editor">
      <p>${G(this.hass, "room_secondary_help")}</p>
      ${e.map((o, a) => c`<div class="item-row">
        <label class="field">
          <span>${G(this.hass, "room_secondary_value")}</span>
          <ha-selector .hass=${this.hass} .selector=${{ select: { mode: "dropdown", options: t.map((r) => ({
      value: r,
      label: G(this.hass, `room_part_${r}`)
    })) } }} .value=${o.type}
            @value-changed=${(r) => {
      t.includes(r.detail.value) && this.updateRoomSecondaryPart(a, { type: r.detail.value });
    }}></ha-selector>
        </label>
        ${o.type === "text" || o.type === "attribute" ? c`<label class="field">
          <span>${G(this.hass, `room_part_${o.type}`)}</span>
          <ha-selector .hass=${this.hass}
            .selector=${o.type === "attribute" ? { attribute: { entity_id: this.config?.entity } } : { text: {} }}
            .value=${o.type === "text" ? o.text ?? "" : o.attribute ?? ""}
            @value-changed=${(r) => {
      this.updateRoomSecondaryPart(a, o.type === "text" ? { type: "text", text: r.detail.value } : { type: "attribute", attribute: r.detail.value });
    }}></ha-selector>
        </label>` : m}
        <div class="item-actions wide">
          <button class="move-up" ?disabled=${a === 0}
            @click=${() => this.moveRoomSecondary(a, -1)}>${G(this.hass, "room_move_up")}</button>
          <button class="move-down" ?disabled=${a === e.length - 1}
            @click=${() => this.moveRoomSecondary(a, 1)}>${G(this.hass, "room_move_down")}</button>
          <button class="remove" @click=${() => this.saveRoomSecondary((this.config?.room_secondary_parts ?? []).filter((r, n) => n !== a))}>${G(this.hass, "room_part_remove")}</button>
        </div>
      </div>`)}
      <button class="add" @click=${() => this.saveRoomSecondary([...this.config?.room_secondary_parts ?? [], { type: "state" }])}>${G(this.hass, "room_part_add")}</button>
    </section>`;
  }
  saveRoomSecondary(e) {
    this.config && (this.config = { ...this.config, room_secondary_parts: e }, he(this, "config-changed", { config: this.config }));
  }
  updateRoomSecondaryPart(e, t) {
    const o = [...this.config?.room_secondary_parts ?? []];
    o[e] = t, this.saveRoomSecondary(o);
  }
  moveRoomSecondary(e, t) {
    const o = [...this.config?.room_secondary_parts ?? []], a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.saveRoomSecondary(o));
  }
  moveRoomSensor(e, t) {
    if (!this.config) return;
    const o = [...this.config.room_sensors ?? (this.config.entities ?? []).map((r) => ({ entity: r }))], a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.updateItems("room_sensors", o));
  }
  renderRoomStatusEditor() {
    const e = (this.config?.room_status ?? []).slice(0, Ze);
    return c`<section class="item-editor room-status-editor">
      <h3>${G(this.hass, "room_status")}</h3>
      <p>${G(this.hass, "room_status_help")}</p>
      ${e.map((t, o) => {
      const a = this.hass?.states[t.entity], r = t.kind ?? ot(a);
      return c`<div class="item-row">
          <label class="field">
            <span>${G(this.hass, "entity")}</span>
            <ha-selector .hass=${this.hass} .selector=${{ entity: {} }} .value=${t.entity}
              @value-changed=${(n) => this.updateRoomStatus(o, "entity", n.detail.value)}></ha-selector>
          </label>
          <label class="field">
            <span>${G(this.hass, "room_status_kind")}</span>
            <ha-selector .hass=${this.hass} .selector=${{ select: { mode: "dropdown", options: va.map((n) => ({
        value: n,
        label: G(this.hass, `room_status_${n}`)
      })) } }} .value=${r}
              @value-changed=${(n) => this.updateRoomStatus(o, "kind", n.detail.value)}></ha-selector>
          </label>
          <span class="room-status-preview wide" aria-label=${G(this.hass, "room_status_preview")}>
            <ha-icon .icon=${a?.attributes.icon || to(r, eo(a, r))}></ha-icon>
            ${a?.attributes.friendly_name || t.entity || G(this.hass, "room_status_choose_entity")}
          </span>
          <div class="item-actions wide"><button @click=${() => this.removeRoomStatus(o)}>${G(this.hass, "room_status_remove")}</button></div>
        </div>`;
    })}
      <button class="add" ?disabled=${e.length >= Ze}
        @click=${() => this.saveRoomStatus([...e, { entity: "", kind: "window" }])}>${G(this.hass, "room_status_add")}</button>
    </section>`;
  }
  updateRoomStatus(e, t, o) {
    const a = [...this.config?.room_status ?? []].slice(0, Ze), r = a[e];
    if (!r) return;
    const n = { ...r, [t]: o };
    if (t === "entity") {
      const i = ot(this.hass?.states[r.entity]);
      (!r.entity || r.kind === void 0 || r.kind === i) && (n.kind = ot(this.hass?.states[o]));
    }
    a[e] = n, this.saveRoomStatus(a);
  }
  removeRoomStatus(e) {
    this.saveRoomStatus((this.config?.room_status ?? []).filter((t, o) => o !== e));
  }
  saveRoomStatus(e) {
    this.config && (this.config = { ...this.config, room_status: e.slice(0, Ze) }, he(this, "config-changed", { config: this.config }));
  }
  miniGraphEntities() {
    const e = this.config?.entities, o = (Array.isArray(e) ? e : []).flatMap((a) => typeof a == "string" ? [{ entity: a }] : a && typeof a == "object" && typeof a.entity == "string" ? [{ ...a }] : []);
    return !o.length && this.config?.entity && o.push({ entity: this.config.entity }), o;
  }
  miniGraphThresholds() {
    const e = this.config?.color_thresholds;
    return Array.isArray(e) ? e.flatMap((t) => typeof t == "string" ? [{ color: t }] : t && typeof t == "object" && typeof t.color == "string" ? [{ ...t }] : []) : [];
  }
  miniGraphStateMap() {
    const e = this.config?.state_map;
    return Array.isArray(e) ? e.flatMap((t) => t && typeof t == "object" && typeof t.value == "string" ? [{ ...t }] : []) : [];
  }
  renderMiniGraphEditors() {
    const e = this.miniGraphEntities(), t = this.miniGraphThresholds(), o = this.miniGraphStateMap(), a = [
      { value: "avg", label: "Average" },
      { value: "median", label: "Median" },
      { value: "min", label: "Minimum" },
      { value: "max", label: "Maximum" },
      { value: "first", label: "First" },
      { value: "last", label: "Last" },
      { value: "sum", label: "Sum" },
      { value: "delta", label: "Range" },
      { value: "diff", label: "Difference" }
    ], r = [
      ["show_state", "Show state"],
      ["show_legend_state", "State in legend"],
      ["show_indicator", "Color indicator"],
      ["show_graph", "Include in graph"],
      ["show_line", "Show line"],
      ["show_fill", "Show fill"],
      ["show_points", "Show points"],
      ["show_legend", "Show in legend"],
      ["state_adaptive_color", "Adaptive state color"],
      ["fixed_value", "Use fixed current value"],
      ["smoothing", "Smooth this line"]
    ];
    return c`
      <section class="item-editor mini-graph-entities">
        <h3>Graph entities</h3>
        <p>Entities are rendered in this order. Every series can override aggregation, axis, color, visibility, attributes, and smoothing.</p>
        ${e.map((n, i) => c`
          <div class="item-row mini-graph-entity-row" data-entity-index=${i}>
            <h4>${n.name || n.entity || `Entity ${i + 1}`}</h4>
            <label class="field wide">
              <span>Entity</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: { domain: ["sensor", "binary_sensor", "input_number"] } }}
                .value=${n.entity}
                @value-changed=${(l) => this.updateMiniGraphEntity(i, "entity", l.detail.value)}
              ></ha-selector>
              <small>Recorder history is loaded for this entity. The first entity is also the primary card entity.</small>
            </label>
            <label class="field">
              <span>Name</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${n.name ?? ""}
                @value-changed=${(l) => this.updateMiniGraphEntity(i, "name", l.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Attribute path</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${n.attribute ?? ""}
                @value-changed=${(l) => this.updateMiniGraphEntity(i, "attribute", l.detail.value)}
              ></ha-selector>
              <small>Optional nested path such as battery.level.</small>
            </label>
            <label class="field">
              <span>Color</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: { default_color: "blue" } }}
                .value=${n.color}
                @value-changed=${(l) => this.updateMiniGraphEntity(i, "color", l.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Unit override</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${n.unit ?? ""}
                @value-changed=${(l) => this.updateMiniGraphEntity(i, "unit", l.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Aggregation</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ select: { mode: "dropdown", options: a } }}
                .value=${n.aggregate_func ?? this.config?.aggregate_func ?? "avg"}
                @value-changed=${(l) => this.updateMiniGraphEntity(i, "aggregate_func", l.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Y-axis</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ select: {
      mode: "dropdown",
      options: [
        { value: "primary", label: "Primary (left)" },
        { value: "secondary", label: "Secondary (right)" }
      ]
    } }}
                .value=${n.y_axis ?? "primary"}
                @value-changed=${(l) => this.updateMiniGraphEntity(i, "y_axis", l.detail.value)}
              ></ha-selector>
            </label>
            ${r.map(([l, s]) => c`
              <label class="field">
                <span>${s}</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{ boolean: {} }}
                  .value=${n[l] ?? ["show_graph", "show_line", "show_fill", "show_points", "show_legend"].includes(l)}
                  @value-changed=${(d) => this.updateMiniGraphEntity(i, l, d.detail.value)}
                ></ha-selector>
              </label>
            `)}
            <div class="item-actions wide">
              <button ?disabled=${i === 0} @click=${() => this.moveMiniGraphEntity(i, -1)}>Move up</button>
              <button ?disabled=${i === e.length - 1}
                @click=${() => this.moveMiniGraphEntity(i, 1)}>Move down</button>
              <button @click=${() => this.removeMiniGraphEntity(i)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addMiniGraphEntity}>Add graph entity</button>
      </section>
      <section class="item-editor mini-graph-thresholds">
        <h3>Color thresholds</h3>
        <p>Ordered value stops color the graph. Leave intermediate values empty to interpolate them between surrounding stops.</p>
        ${t.map((n, i) => c`
          <div class="item-row mini-graph-threshold-row" data-threshold-index=${i}>
            <h4>Threshold ${i + 1}</h4>
            <label class="field">
              <span>Value</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ number: { mode: "box", step: "any" } }}
                .value=${n.value}
                @value-changed=${(l) => this.updateMiniGraphThreshold(i, "value", l.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Color</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: { default_color: "blue" } }}
                .value=${n.color}
                @value-changed=${(l) => this.updateMiniGraphThreshold(i, "color", l.detail.value)}
              ></ha-selector>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${i === 0} @click=${() => this.moveMiniGraphThreshold(i, -1)}>Move up</button>
              <button ?disabled=${i === t.length - 1}
                @click=${() => this.moveMiniGraphThreshold(i, 1)}>Move down</button>
              <button @click=${() => this.removeMiniGraphThreshold(i)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addMiniGraphThreshold}>Add color threshold</button>
      </section>
      <section class="item-editor mini-graph-state-map">
        <h3>State map</h3>
        <p>Map non-numeric states to ordered graph levels. Row order defines each state's numeric position.</p>
        ${o.map((n, i) => c`
          <div class="item-row mini-graph-state-row" data-state-index=${i}>
            <h4>State ${i + 1}</h4>
            <label class="field">
              <span>Entity state</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${n.value}
                @value-changed=${(l) => this.updateMiniGraphState(i, "value", l.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Display label</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${n.label ?? ""}
                @value-changed=${(l) => this.updateMiniGraphState(i, "label", l.detail.value)}
              ></ha-selector>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${i === 0} @click=${() => this.moveMiniGraphState(i, -1)}>Move up</button>
              <button ?disabled=${i === o.length - 1}
                @click=${() => this.moveMiniGraphState(i, 1)}>Move down</button>
              <button @click=${() => this.removeMiniGraphState(i)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addMiniGraphState}>Add state mapping</button>
      </section>
    `;
  }
  updateMiniGraphEntity(e, t, o) {
    const a = this.miniGraphEntities();
    a[e] = { ...a[e], [t]: o === "" ? void 0 : o }, this.updateMiniGraphConfig({
      entities: a,
      entity: a[0]?.entity
    });
  }
  removeMiniGraphEntity(e) {
    const t = this.miniGraphEntities().filter((o, a) => a !== e);
    this.updateMiniGraphConfig({
      entities: t,
      entity: t[0]?.entity
    });
  }
  moveMiniGraphEntity(e, t) {
    const o = this.miniGraphEntities(), a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.updateMiniGraphConfig({
      entities: o,
      entity: o[0]?.entity
    }));
  }
  updateMiniGraphThreshold(e, t, o) {
    const a = this.miniGraphThresholds();
    a[e] = {
      ...a[e],
      [t]: o === "" || o === void 0 ? void 0 : o
    }, this.updateMiniGraphConfig({ color_thresholds: a });
  }
  removeMiniGraphThreshold(e) {
    this.updateMiniGraphConfig({
      color_thresholds: this.miniGraphThresholds().filter((t, o) => o !== e)
    });
  }
  moveMiniGraphThreshold(e, t) {
    const o = this.miniGraphThresholds(), a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.updateMiniGraphConfig({ color_thresholds: o }));
  }
  updateMiniGraphState(e, t, o) {
    const a = this.miniGraphStateMap();
    a[e] = { ...a[e], [t]: o === "" ? void 0 : o }, this.updateMiniGraphConfig({ state_map: a });
  }
  removeMiniGraphState(e) {
    this.updateMiniGraphConfig({
      state_map: this.miniGraphStateMap().filter((t, o) => o !== e)
    });
  }
  moveMiniGraphState(e, t) {
    const o = this.miniGraphStateMap(), a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.updateMiniGraphConfig({ state_map: o }));
  }
  updateMiniGraphConfig(e) {
    if (!this.config) return;
    const t = { ...this.config, ...e };
    this.config = t, he(this, "config-changed", { config: t });
  }
  renderWasteStreamEditor() {
    if (!this.config) return m;
    const e = ze(this.config);
    return c`
      <section class="item-editor waste-stream-editor">
        <h3>Waste streams</h3>
        <p>Each enabled row uses its own sensor or calendar entity. Empty or disabled rows are omitted from the card.</p>
        ${e.map((t, o) => c`
          <div class="item-row waste-stream-row" data-stream-index=${o}>
            <h4>${t.label || `Waste stream ${o + 1}`}</h4>
            <label class="field">
              <span>Show this waste stream</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ boolean: {} }}
                .value=${t.enabled !== !1}
                @value-changed=${(a) => this.updateWasteStream(o, "enabled", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>Collection date entity</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: { domain: ["sensor", "calendar"] } }}
                .value=${t.entity}
                @value-changed=${(a) => this.updateWasteStream(o, "entity", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Label</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${t.label ?? ""}
                @value-changed=${(a) => this.updateWasteStream(o, "label", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${t.icon}
                @value-changed=${(a) => this.updateWasteStream(o, "icon", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Color</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: { default_color: "green" } }}
                .value=${t.color}
                @value-changed=${(a) => this.updateWasteStream(o, "color", a.detail.value)}
              ></ha-selector>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${o === 0} @click=${() => this.moveWasteStream(o, -1)}>Move up</button>
              <button ?disabled=${o === e.length - 1} @click=${() => this.moveWasteStream(o, 1)}>Move down</button>
              <button @click=${() => this.removeWasteStream(o)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addWasteStream}>Add waste stream</button>
      </section>
    `;
  }
  renderSonosShortcutEditor() {
    if (!this.config) return m;
    const e = this.config.shortcuts?.buttons ?? [], t = Math.min(8, Math.max(1, Math.round(this.config.shortcuts?.columns ?? 4)));
    return c`
      <section class="item-editor sonos-shortcut-editor">
        <h3>Playlist shortcuts</h3>
        <p>Add Sonos playlists or other media IDs. Each shortcut starts playback on the card's primary Sonos entity.</p>
        <div class="item-row">
          <label class="field">
            <span>Columns</span>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ number: { min: 1, max: 8, step: 1, mode: "box" } }}
              .value=${t}
              @value-changed=${(o) => this.updateSonosColumns(o.detail.value)}
            ></ha-selector>
            <small>Number of shortcut buttons shown on each row.</small>
          </label>
        </div>
        ${e.map((o, a) => c`
          <div class="item-row sonos-shortcut-row" data-shortcut-index=${a}>
            <h4>${o.name || `Shortcut ${a + 1}`}</h4>
            <label class="field">
              <span>Label</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${o.name ?? ""}
                @value-changed=${(r) => this.updateSonosShortcut(a, "name", r.detail.value)}
              ></ha-selector>
              <small>Optional text shown below the icon.</small>
            </label>
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${o.icon ?? "mdi:playlist-music"}
                @value-changed=${(r) => this.updateSonosShortcut(a, "icon", r.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Media type</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${o.type ?? "playlist"}
                @value-changed=${(r) => this.updateSonosShortcut(a, "type", r.detail.value)}
              ></ha-selector>
              <small>Use playlist for Spotify playlist IDs, or another media type supported by your player.</small>
            </label>
            <label class="field wide">
              <span>Playlist or media ID</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${o.id ?? ""}
                @value-changed=${(r) => this.updateSonosShortcut(a, "id", r.detail.value)}
              ></ha-selector>
              <small>For example: spotify:playlist:4Peff17x9lxkDupqOF0ive</small>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${a === 0} @click=${() => this.moveSonosShortcut(a, -1)}>Move up</button>
              <button ?disabled=${a === e.length - 1}
                @click=${() => this.moveSonosShortcut(a, 1)}>Move down</button>
              <button @click=${() => this.removeSonosShortcut(a)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addSonosShortcut}>Add playlist shortcut</button>
      </section>
    `;
  }
  renderCarouselItemEditor() {
    if (!this.config) return m;
    const e = this.config.carousel_items ?? [];
    return c`
      <section class="item-editor carousel-item-editor">
        <h3>Carousel items</h3>
        <p>Add entity-aware icon buttons. Swipe or scroll to move through them; tap the centered item to run its action.</p>
        ${e.map((t, o) => c`
          <div class="item-row carousel-item-row" data-carousel-index=${o}>
            <h4>${t.name || t.entity || `Item ${o + 1}`}</h4>
            <label class="field wide">
              <span>Entity</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: {} }}
                .value=${t.entity ?? ""}
                @value-changed=${(a) => this.updateCarouselItem(o, "entity", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Label</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${t.name ?? ""}
                @value-changed=${(a) => this.updateCarouselItem(o, "name", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${t.icon ?? ""}
                @value-changed=${(a) => this.updateCarouselItem(o, "icon", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Color</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: {} }}
                .value=${t.color ?? "primary"}
                @value-changed=${(a) => this.updateCarouselItem(o, "color", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Visual</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ select: { mode: "dropdown", options: [
      { value: "icon", label: "Icon" },
      { value: "entity-picture", label: "Entity picture" }
    ] } }}
                .value=${t.icon_type ?? "icon"}
                @value-changed=${(a) => this.updateCarouselItem(o, "icon_type", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>Tap action</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_action: {} }}
                .value=${t.tap_action ?? { action: "more-info" }}
                @value-changed=${(a) => this.updateCarouselItem(o, "tap_action", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>Hold action</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_action: {} }}
                .value=${t.hold_action ?? { action: "none" }}
                @value-changed=${(a) => this.updateCarouselItem(o, "hold_action", a.detail.value)}
              ></ha-selector>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${o === 0} @click=${() => this.moveCarouselItem(o, -1)}>Move up</button>
              <button ?disabled=${o === e.length - 1}
                @click=${() => this.moveCarouselItem(o, 1)}>Move down</button>
              <button @click=${() => this.removeCarouselItem(o)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addCarouselItem}>Add carousel item</button>
      </section>
    `;
  }
  updateItem(e, t, o, a) {
    if (!this.config) return;
    const r = [...this.config[e] ?? (this.config.entities ?? []).map((n) => ({ entity: n }))];
    if (o === "entity" && typeof a == "string") {
      const n = r[t], i = e === "scene_items" ? tt : at, l = i(this.hass, n.entity), s = i(this.hass, a), d = { ...n, entity: a }, u = e === "scene_items" ? ["name", "icon", "icon_type", "color", "tap_action"] : ["icon", "icon_type", "color", "active_state", "tap_action", "hold_action", "double_tap_action"];
      for (const _ of u)
        (n[_] === void 0 || JSON.stringify(n[_]) === JSON.stringify(l[_])) && Object.assign(d, { [_]: s[_] });
      r[t] = d;
    } else
      r[t] = { ...r[t], [o]: a || void 0 };
    this.updateItems(e, r);
  }
  addItem(e) {
    if (!this.config) return;
    const t = [...this.config[e] ?? (this.config.entities ?? []).map((a) => ({ entity: a }))], o = e === "scene_items" ? Object.keys(this.hass?.states ?? {}).find((a) => a.startsWith("scene.")) ?? "" : "";
    t.push(e === "scene_items" ? tt(this.hass, o) : at(this.hass)), this.updateItems(e, t);
  }
  removeItem(e, t) {
    if (!this.config) return;
    const o = [...this.config[e] ?? (this.config.entities ?? []).map((a) => ({ entity: a }))].filter((a, r) => r !== t);
    this.updateItems(e, o);
  }
  updateItems(e, t) {
    if (!this.config) return;
    const o = { ...this.config, [e]: t, entities: void 0 };
    this.config = o, he(this, "config-changed", { config: o });
  }
  updateWasteStream(e, t, o) {
    if (!this.config) return;
    const a = ze(this.config);
    a[e] = {
      ...a[e],
      [t]: t === "enabled" ? o !== !1 : o || void 0
    }, this.updateWasteStreams(a);
  }
  removeWasteStream(e) {
    this.config && this.updateWasteStreams(ze(this.config).filter((t, o) => o !== e));
  }
  moveWasteStream(e, t) {
    if (!this.config) return;
    const o = ze(this.config), a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.updateWasteStreams(o));
  }
  updateWasteStreams(e) {
    if (!this.config) return;
    const t = { ...this.config, waste_streams: e };
    this.config = t, he(this, "config-changed", { config: t });
  }
  updateSonosColumns(e) {
    if (!this.config) return;
    const t = Math.min(8, Math.max(1, Math.round(Number(e) || 4)));
    this.updateSonosShortcuts(this.config.shortcuts?.buttons ?? [], t);
  }
  updateCarouselItem(e, t, o) {
    if (!this.config) return;
    const a = [...this.config.carousel_items ?? []];
    a[e] = { ...a[e], [t]: o || void 0 }, this.updateCarouselItems(a);
  }
  removeCarouselItem(e) {
    this.config && this.updateCarouselItems(
      (this.config.carousel_items ?? []).filter((t, o) => o !== e)
    );
  }
  moveCarouselItem(e, t) {
    if (!this.config) return;
    const o = [...this.config.carousel_items ?? []], a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.updateCarouselItems(o));
  }
  updateCarouselItems(e) {
    if (!this.config) return;
    const t = { ...this.config, carousel_items: e };
    this.config = t, he(this, "config-changed", { config: t });
  }
  updateSonosShortcut(e, t, o) {
    if (!this.config) return;
    const a = [...this.config.shortcuts?.buttons ?? []];
    a[e] = { ...a[e], [t]: o || void 0 }, this.updateSonosShortcuts(a);
  }
  removeSonosShortcut(e) {
    this.config && this.updateSonosShortcuts(
      (this.config.shortcuts?.buttons ?? []).filter((t, o) => o !== e)
    );
  }
  moveSonosShortcut(e, t) {
    if (!this.config) return;
    const o = [...this.config.shortcuts?.buttons ?? []], a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.updateSonosShortcuts(o));
  }
  updateSonosShortcuts(e, t = this.config?.shortcuts?.columns ?? 4) {
    if (!this.config) return;
    const o = { ...this.config, shortcuts: { columns: t, buttons: e } };
    this.config = o, he(this, "config-changed", { config: o });
  }
};
lt.styles = Le`
    :host { display: block; }
    .editor-sections { display: grid; gap: 12px; }
    .editor-section { border-radius: 12px; overflow: hidden; }
    .section-header { display: inline-flex; align-items: center; gap: 10px; font-weight: 650; }
    .section-header ha-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); }
    .section-body { padding: 4px 16px 16px; }
    .item-editor { margin-top: 8px; }
    .item-editor h3 { margin: 0 0 8px; font-size: 15px; }
    .item-editor p { margin: 0 0 12px; color: var(--secondary-text-color); font-size: 12px; }
    .item-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 10px; padding: 12px; border: 1px solid var(--divider-color); border-radius: 12px; }
    .item-row ha-selector, .item-row ha-textfield { min-width: 0; }
    .item-row .wide { grid-column: 1 / -1; }
    .item-row h4 { grid-column: 1 / -1; margin: 0; font-size: 13px; }
    .field { display: grid; gap: 5px; }
    .field > span { color: var(--secondary-text-color); font-size: 11px; }
    .field > small { color: var(--secondary-text-color); font-size: 11px; line-height: 1.35; }
    .item-actions { display: flex; justify-content: flex-end; gap: 8px; }
    button { border: 0; border-radius: 10px; padding: 8px 12px; background: var(--secondary-background-color); color: var(--primary-text-color); cursor: pointer; }
    button.add { background: var(--primary-color); color: var(--text-primary-color, #fff); }
  `;
ao([
  ue({ attribute: !1 })
], lt.prototype, "hass", 2);
ao([
  oe()
], lt.prototype, "config", 2);
lt = ao([
  Qo("mushroom-addition-editor")
], lt);
const rn = Le`
  :host {
    --ulm-blue: 3, 169, 244;
    --ulm-yellow: 255, 193, 7;
    --ulm-red: 244, 67, 54;
    --ulm-green: 76, 175, 80;
    --ulm-orange: 255, 152, 0;
    --ulm-purple: 156, 39, 176;
    --ulm-grey: 120, 120, 120;
    container-type: inline-size;
    display: block;
    min-width: 0;
  }
  .mushroom-addition-card {
    display: block;
    overflow: hidden;
    box-sizing: border-box;
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
    border-radius: var(--mush-card-primary-border-radius, 14px);
    background: var(--ha-card-background, var(--card-background-color, #fff));
    box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,.08));
  }
  .mushroom-addition-card:has(.fill-container), .fill-container { height: 100%; }
  .fill-container { min-height: 100%; }
  .action-surface {
    box-sizing: border-box;
    color: var(--primary-text-color);
    cursor: pointer;
    outline: none;
  }
  .action-surface:focus-visible { box-shadow: inset 0 0 0 2px rgb(var(--ulm-blue)); }
  .ulm-row, .metric-heading, .climate-top {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    min-height: 66px;
    padding: 12px;
  }
  .ulm-icon {
    display: grid;
    place-items: center;
    width: var(--mush-icon-size, 40px);
    height: var(--mush-icon-size, 40px);
    border-radius: 50%;
    color: rgb(var(--tone, var(--ulm-blue)));
    background: rgba(var(--tone, var(--ulm-blue)), .16);
    flex: 0 0 auto;
  }
  .ulm-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .ulm-icon.entity-picture { background-position: center; background-size: cover; }
  .source-icon {
    color: color-mix(in srgb, var(--source-color) 20%, rgba(var(--ulm-grey), .35));
    background: color-mix(in srgb, var(--source-color) 5%, transparent);
  }
  .source-icon.is-source-active {
    color: var(--source-color);
    background: color-mix(in srgb, var(--source-color) 20%, transparent);
  }
  .is-source-background { background: color-mix(in srgb, var(--source-color, rgb(var(--ulm-blue))) 14%, transparent); }
  .action-surface.layout-vertical {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .action-surface.layout-vertical .ulm-copy { align-items: center; }
  .tone-blue { --tone: var(--ulm-blue); }
  .tone-yellow { --tone: var(--ulm-yellow); }
  .tone-red { --tone: var(--ulm-red); }
  .tone-green { --tone: var(--ulm-green); }
  .tone-orange { --tone: var(--ulm-orange); }
  .tone-purple { --tone: var(--ulm-purple); }
  .tone-grey { --tone: var(--ulm-grey); }
  .ulm-copy { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
  .ulm-name, .ulm-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .multiline-secondary .ulm-label {
    overflow: visible; text-overflow: clip; white-space: normal;
  }
  .card-heading {
    display: flex;
    min-width: 0;
    min-height: var(--mush-icon-size, 40px);
    align-items: center;
    gap: 12px;
  }
  .card-heading > .ulm-copy { flex: 1; }
  .automatic-presentation { min-width: 0; }
  .ulm-name { font-size: 14px; font-weight: 600; }
  .ulm-label { color: var(--secondary-text-color); font-size: 12px; text-transform: capitalize; }
  .ulm-controls { display: flex; align-items: center; gap: 7px; }
  .ulm-control, .scene-button {
    border: 0;
    background: rgba(var(--ulm-grey), .10);
    color: var(--primary-text-color);
    cursor: pointer;
  }
  .ulm-control {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 12px;
  }
  .ulm-control ha-icon { --mdc-icon-size: 18px; }
  .metric-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 14px;
    background: rgba(var(--ulm-grey), .08);
    color: var(--primary-text-color);
    font-size: 13px;
  }
  .metric-pill ha-icon { --mdc-icon-size: 18px; color: rgba(var(--ulm-grey), .9); }
  .climate-top { padding-bottom: 8px; }
  .climate-target { color: rgb(var(--ulm-red)); font-size: 23px; font-weight: 600; }
  .climate-current { font-size: 18px; font-weight: 700; }
  .battery-ring, .battery-value { color: rgb(var(--ulm-green)); font-weight: 700; }
  .ulm-battery { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 12px; }
  .battery-value { font-size: 24px; }
  .battery-value small { font-size: 12px; }
  .battery-track { grid-column: 2 / -1; height: 5px; overflow: hidden; border-radius: 5px; background: rgba(var(--ulm-grey), .12); }
  .battery-track i { display: block; height: 100%; border-radius: inherit; background: rgb(var(--ulm-green)); }
  .ulm-battery.is-charging .ulm-icon { animation: ulm-charge 1.1s ease-in-out infinite alternate; }
  .ulm-default-battery { grid-template-columns: auto minmax(0, 1fr); }
  .ulm-default-battery.is-charging .source-icon { animation: ulm-charge 3s linear infinite; }
  @keyframes ulm-charge { from { transform: scale(.92); } to { transform: scale(1.06); } }
  .ulm-metric { padding: 0 12px 12px; }
  .metric-heading { padding-left: 0; padding-right: 0; }
  .entity-carousel-presentation { padding: 12px; }
  .entity-carousel-presentation .ulm-copy { justify-content: center; }
  .metric-value { color: rgb(var(--ulm-blue)); font-size: 20px; font-weight: 650; }
  .sparkline { width: 100%; height: 48px; overflow: visible; }
  .sparkline polyline { fill: none; stroke: var(--sparkline-color, rgb(var(--ulm-blue))); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
  .sparkline.is-filled polyline { stroke: var(--sparkline-color, rgb(var(--ulm-red))); }
  .sparkline.is-filled polygon { fill: color-mix(in srgb, var(--sparkline-fill-color, rgb(var(--ulm-red))) 18%, transparent); }
  .metric-extremes { display: flex; justify-content: space-between; color: var(--secondary-text-color); font-size: 11px; }
  .ulm-scenes { padding: 12px; }
  .scene-grid { display: flex; flex-wrap: wrap; gap: 10px; }
  .scene-button { display: flex; width: 64px; min-width: 64px; min-height: 88px; flex-direction: column; align-items: center; justify-content: space-between; gap: 5px; padding: 7px 5px 10px; border: 1px solid var(--divider-color, rgba(var(--ulm-grey), .2)); border-radius: 32px; background: var(--card-background-color, var(--ha-card-background, var(--secondary-background-color))); color: var(--primary-text-color); box-shadow: 0 2px 6px rgba(0,0,0,.12); }
  .scene-button span { width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }
  .scene-button i { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--ulm-purple), .14); font-style: normal; }
  .scene-button i > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .scene-button i { background: color-mix(in srgb, var(--item-color) 16%, transparent); }
  .scene-entity-picture { display: block; width: 100%; height: 100%; border-radius: inherit; background-position: center; background-size: cover; }
  .scene-button ha-icon { --mdc-icon-size: 22px; color: var(--item-color); }
  .scene-button.is-active { background: color-mix(in srgb, var(--item-color) 12%, var(--card-background-color, var(--ha-card-background, var(--secondary-background-color)))); }
  .ulm-source-scenes .scene-grid { flex-wrap: nowrap; justify-content: space-evenly; }
  .welcome-scenes {
    --welcome-surface: var(
      --secondary-background-color,
      color-mix(in srgb, var(--primary-text-color) 8%, transparent)
    );
    padding: 10px;
  }
  .welcome-toolbar { display: grid; grid-template-columns: 42px 1fr 42px; align-items: center; gap: 10px; padding: 4px; margin-bottom: 8px; }
  .welcome-toolbar-button, .welcome-date {
    display: inline-flex;
    min-height: 42px;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--divider-color, rgba(var(--ulm-grey), .2));
    border-radius: 22px;
    background: var(--welcome-surface);
    color: var(--primary-text-color);
    box-shadow: none;
  }
  .welcome-toolbar-button { cursor: pointer; }
  .welcome-toolbar-button:hover, .welcome-scenes .scene-button:hover {
    background: color-mix(in srgb, var(--primary-text-color) 13%, transparent);
  }
  .welcome-toolbar-button:focus-visible, .welcome-scenes .scene-button:focus-visible {
    outline: 2px solid var(--primary-color, rgb(var(--ulm-blue)));
    outline-offset: 2px;
  }
  .welcome-date { justify-self: center; gap: 6px; padding: 0 14px; font-weight: 700; }
  .welcome-date ha-icon, .welcome-toolbar-button ha-icon { color: var(--secondary-text-color); }
  .welcome-heading { margin: 0 16px 14px; }
  .welcome-heading b { max-width: 260px; font-size: 24px; line-height: 1.15; }
  .welcome-scenes-heading { display: flex; align-items: center; justify-content: space-between; margin: 0 16px 10px; font-size: 18px; }
  .welcome-scenes-more {
    display: inline-grid;
    width: 36px;
    height: 36px;
    place-items: center;
    border-radius: 50%;
    background: transparent;
    color: var(--secondary-text-color);
    cursor: pointer;
  }
  .welcome-scenes-more:hover { background: color-mix(in srgb, var(--primary-text-color) 10%, transparent); }
  .welcome-scenes-more:focus-visible {
    outline: 2px solid var(--primary-color, rgb(var(--ulm-blue)));
    outline-offset: 2px;
  }
  .welcome-scenes-more ha-icon { --mdc-icon-size: 20px; }
  .ulm-media { position: relative; display: grid; gap: 12px; overflow: hidden; padding: 12px; }
  .media-art { position: absolute; inset: 0; z-index: 0; background-position: center; background-size: cover; }
  .media-art::after { position: absolute; inset: 0; background: rgba(0,0,0,.25); content: ""; }
  .media-summary { position: relative; z-index: 1; display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 12px; }
  .ulm-media.has-art { color: #fff; }
  .ulm-media.has-art .ulm-label { color: rgba(255,255,255,.75); }
  .ulm-media.has-art .ulm-icon, .ulm-media.has-art .ulm-control { color: #fff; background: rgba(0,0,0,.25); }
  .ulm-media .ulm-controls, .ulm-media .ulm-slider { position: relative; z-index: 1; }
  .media-controls { display: grid; grid-template-columns: repeat(4, 1fr); }
  .media-controls .ulm-control { width: 100%; }
  .media-power { position: absolute; top: 12px; right: 12px; z-index: 2; }
  .media-volume-buttons { justify-content: center; }
  .ulm-security { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; }
  .security-status { padding: 5px 9px; border-radius: 10px; background: rgba(var(--ulm-green), .12); color: rgb(var(--ulm-green)); font-size: 11px; font-weight: 700; }
  .ulm-navigation { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; }
  .ulm-room { display: grid; min-height: 210px; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; padding: 14px; }
  .ulm-source-room { position: relative; aspect-ratio: 1; min-height: 0; padding: 5px; border-radius: 20px; }
  .room-main { display: flex; min-width: 0; flex-direction: column; justify-content: space-between; gap: 12px; }
  .room-copy { z-index: 1; display: flex; min-width: 0; flex-direction: column; gap: 5px; padding: 12px 0 0 12px; }
  .room-copy b { overflow: hidden; font-size: 18px; text-overflow: ellipsis; white-space: nowrap; }
  .room-copy span { overflow: hidden; color: var(--secondary-text-color); font-size: 14px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
  .room-main .ulm-icon { width: 116px; height: 116px; margin: 0 0 -14px -14px; border-radius: 0 58px 0 14px; }
  .ulm-source-room .room-main .ulm-icon { position: absolute; bottom: 0; left: 0; width: 75%; height: 75%; margin: 0; border-radius: 50%; transform: translate(-25%, 25%); }
  .room-main .ulm-icon ha-icon { --mdc-icon-size: 56px; }
  .room-entities { display: flex; flex-direction: column; justify-content: flex-end; gap: 7px; }
  .room-entities .metric-pill { width: 46px; min-height: 46px; justify-content: center; overflow: hidden; padding: 0; color: transparent; }
  .room-sensor { border: 0; cursor: pointer; }
  .room-sensor > ha-icon { flex: 0 0 24px; width: 24px; height: 24px; --mdc-icon-size: 24px; color: var(--item-color); }
  .room-sensor-picture { display: block; flex: 0 0 38px; width: 38px; height: 38px; border-radius: 50%; background-position: center; background-size: cover; }
  .room-sensor.is-active { background: color-mix(in srgb, var(--item-color) 18%, transparent); }
  .room-sensor .room-sensor-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .room-sensor:disabled { cursor: default; opacity: .45; }
  .ulm-source-room.dynamic-color { background: rgba(var(--room-rgb), .2); }
  .ulm-source-room.dynamic-color .room-main > .ulm-icon { color: rgb(var(--room-rgb)); background: rgba(var(--room-rgb), .3); }
  .room-status { display: flex; flex: 0 0 25px; max-width: 100%; overflow: hidden; gap: 5px; }
  .room-status-indicator { display: grid; flex: 0 0 25px; place-items: center; width: 25px; height: 25px; padding: 0; border: 0; border-radius: 50%; color: var(--secondary-text-color); background: var(--card-background-color); cursor: pointer; }
  .room-status-indicator > ha-icon { flex: 0 0 18px; width: 18px; height: 18px; --mdc-icon-size: 18px; }
  .room-status-indicator.is-active { color: rgb(var(--ulm-yellow)); }
  .room-status-indicator.is-unavailable { opacity: .45; cursor: default; }
  .room-status-indicator.kind-water.is-active { color: rgb(var(--ulm-blue)); animation: room-status-pulse 1.6s ease-in-out infinite; }
  .room-status-indicator.kind-smoke.is-active { color: rgb(var(--ulm-red)); animation: room-status-pulse 1.6s ease-in-out infinite; }
  .room-status-indicator:focus-visible, .room-sensor:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  @keyframes room-status-pulse { 50% { opacity: .4; } }
  @media (prefers-reduced-motion: reduce) {
    .room-status-indicator.kind-water.is-active, .room-status-indicator.kind-smoke.is-active { animation: none; }
  }
  .room-unavailable {
    position: absolute;
    bottom: 22%;
    left: 22%;
    z-index: 2;
    display: grid;
    width: 24px;
    height: 24px;
    place-items: center;
    border: 2px solid var(--card-background-color, #fff);
    border-radius: 50%;
    background: rgb(var(--ulm-red));
    color: var(--primary-background-color, #fff);
  }
  .room-unavailable ha-icon { --mdc-icon-size: 13px; }
  .ulm-generic-swap { grid-template-columns: minmax(0, 1fr) auto; }
  .ulm-generic.force-background, .ulm-generic-swap.force-background {
    background: color-mix(in srgb, var(--source-color, rgb(var(--ulm-blue))) 16%, transparent);
  }
  .ulm-detail-card, .ulm-schedule-card, .ulm-device-status, .ulm-helper-card {
    display: grid;
    gap: 10px;
    padding: 0 12px 12px;
  }
  .ulm-detail-card > .ulm-row, .ulm-schedule-card > .ulm-row,
  .ulm-device-status > .ulm-row, .ulm-helper-card > .ulm-row {
    padding-right: 0;
    padding-left: 0;
  }
  .detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; }
  .detail-grid .metric-pill { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .schedule-list { display: grid; gap: 6px; }
  .schedule-list span { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 7px 9px; border-radius: 10px; background: rgba(var(--ulm-grey), .07); font-size: 11px; }
  .schedule-list small { color: var(--secondary-text-color); }
  .device-value { color: rgb(var(--ulm-blue)); font-size: 18px; }
  .device-progress { height: 6px; overflow: hidden; border-radius: 6px; background: rgba(var(--ulm-grey), .12); }
  .device-progress i { display: block; height: 100%; border-radius: inherit; background: rgb(var(--ulm-blue)); }
  .ulm-helper-card .ulm-slider { width: 100%; accent-color: rgb(var(--ulm-blue)); }
  .ulm-simple-default { grid-template-columns: auto minmax(0, 1fr); }
  .script-title { font-size: 14px; font-weight: 600; white-space: nowrap; }
  .custom-card-heading {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
  }
  .custom-waste-card, .custom-alarm-time, .custom-washer, .custom-input-datetime {
    display: grid;
    gap: 12px;
    padding: 12px;
  }
  .waste-grid { display: grid; gap: 5px; }
  .waste-summary { display: flex; flex-wrap: wrap; gap: 2px 10px; text-transform: none; }
  .waste-row {
    display: grid;
    grid-template-columns: 24px 1fr auto;
    align-items: center;
    gap: 8px;
    min-height: 30px;
    padding: 0 9px;
    border-radius: 10px;
    background: rgba(var(--ulm-grey), .07);
  }
  .waste-row ha-icon { --mdc-icon-size: 17px; color: var(--waste-color, rgb(var(--ulm-green))); }
  .waste-row b, .waste-row small { font-size: 11px; }
  .waste-row small { color: var(--secondary-text-color); }
  .alarm-time-controls {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: center;
    gap: 10px;
  }
  .alarm-time-controls .ulm-control {
    width: 100%;
    height: 56px;
    border-radius: 18px;
  }
  .alarm-time-controls > b { text-align: center; font-size: 18px; }
  .custom-alarm-time.is-horizontal { grid-template-columns: minmax(0, 1fr) minmax(180px, 1fr); align-items: center; }
  .custom-room-view { display: grid; min-width: 0; min-height: 150px; gap: 8px; padding: 12px; }
  .room-view-summary { display: flex; width: 100%; min-width: 0; align-items: center; gap: 10px; padding: 0; border: 0; background: transparent; color: var(--primary-text-color); font: inherit; text-align: start; cursor: pointer; }
  .room-view-summary .ulm-copy { min-width: 0; }
  .room-view-icon { position: relative; display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--ulm-grey), .1); color: rgba(var(--ulm-grey), .45); }
  .room-view-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .room-view-status { display: flex; min-height: 28px; align-items: center; justify-content: center; gap: 2px; }
  .room-view-status button, .room-view-clear, .room-view-warning { position: relative; display: grid; width: 35px; height: 28px; padding: 0; place-items: center; border: 0; background: transparent; color: rgba(var(--ulm-grey), .7); }
  .room-view-status button > ha-icon { --mdc-icon-size: 20px; }
  .room-view-status .is-unavailable, .room-view-warning { color: var(--error-color, #db4437); }
  .room-view-warning ha-icon { --mdc-icon-size: 18px; }
  .room-view-actions { display: flex; gap: 7px; }
  .room-view-actions button { position: relative; display: grid; min-width: 40px; height: 44px; flex: 1; padding: 0; place-items: center; border: 0; border-radius: 14px; background: rgba(var(--ulm-grey), .08); color: rgba(var(--ulm-grey), .7); cursor: pointer; }
  .room-view-actions button.is-active { background: rgba(var(--ulm-yellow), .25); color: rgb(var(--ulm-yellow)); }
  .room-view-actions button:disabled { opacity: .45; cursor: not-allowed; }
  .room-view-actions i, .room-view-status i { position: absolute; top: 5px; right: 30%; display: grid; min-width: 16px; height: 16px; place-items: center; border-radius: 9px; background: rgb(var(--ulm-blue)); color: #fff; font-size: 10px; font-style: normal; }
  .custom-room-view button:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .custom-welcome { display: grid; gap: 18px; padding: 14px; }
  .welcome-toolbar { display: flex; justify-content: space-between; }
  .welcome-toolbar button { display: grid; width: 38px; height: 38px; padding: 0; place-items: center; border: 0; border-radius: 50%; background: var(--card-background-color); color: inherit; box-shadow: 0 2px 7px rgba(0,0,0,.12); }
  .welcome-toolbar button:disabled { visibility: hidden; }
  .welcome-greeting { font-size: 23px; line-height: 1.08; }
  .welcome-items { display: flex; gap: 8px; overflow: hidden; }
  .welcome-items > button { display: flex; min-width: 52px; flex: 1; flex-direction: column; align-items: center; gap: 6px; padding: 7px 4px 10px; border: 0; border-radius: 25px; background: var(--card-background-color); color: inherit; box-shadow: 0 2px 7px rgba(0,0,0,.12); }
  .welcome-items i { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--tone), .18); color: rgb(var(--tone)); font-style: normal; }
  .welcome-items i > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .welcome-items small { max-width: 48px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 700; }
  .custom-room-overview { display: grid; min-height: 112px; grid-template-columns: minmax(0, 1fr) 42px; gap: 12px; padding: 12px; border-radius: 20px; }
  .room-overview-main { display: grid; min-width: 0; grid-template-rows: auto auto; align-content: space-between; gap: 8px; }
  .room-overview-main .ulm-icon { justify-self: start; }
  .room-overview-main .ulm-copy { min-width: 0; }
  .custom-room-overview.dynamic-color { background: rgba(var(--room-rgb), .2); }
  .custom-room-overview.dynamic-color .ulm-icon { background: rgba(var(--room-rgb), .3); color: rgb(var(--room-rgb)); }
  .room-overview-controls { display: flex; flex-direction: column; gap: 5px; }
  .room-overview-control { display: grid; width: 42px; height: 42px; padding: 0; place-items: center; border: 0; border-radius: 14px; background: rgba(var(--ulm-grey), .08); color: rgba(var(--ulm-grey), .75); }
  .room-overview-control.light.state-on { background: rgba(var(--ulm-yellow), .2); color: rgb(var(--ulm-yellow)); }
  .room-overview-control.climate.state-heat { background: rgba(var(--ulm-red), .2); color: rgb(var(--ulm-red)); }
  .room-overview-control.climate.state-cool, .room-overview-control.cover.state-closed { background: rgba(var(--ulm-blue), .2); color: rgb(var(--ulm-blue)); }
  .washer-heading .washer-power { font-size: 12px; font-weight: 700; }
  .washer-stages { display: grid; grid-template-columns: repeat(var(--washer-stage-count, 4), 1fr); border-radius: 22px; background: rgba(var(--ulm-grey), .08); }
  .washer-stages span { display: grid; height: 42px; place-items: center; color: rgba(var(--ulm-grey), .35); }
  .washer-stages span.is-active { color: var(--primary-text-color); }
  .washer-stages span.is-active ha-icon { padding: 9px; border-radius: 50%; background: var(--card-background-color); }
  .washer-controls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .washer-controls .ulm-control { width: 100%; height: 42px; border-radius: 16px; }
  .washer-remote { color: var(--secondary-text-color); font-size: 11px; text-align: center; }
  .custom-sun-card { display: grid; min-height: 210px; gap: 8px; padding: 18px; }
  .astronomy-times { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .astronomy-times span, .sun-footer span { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
  .astronomy-times span:nth-child(2), .astronomy-times span:nth-child(3) { align-items: center; }
  .astronomy-times span:last-child, .sun-footer span:last-child { align-items: flex-end; }
  .astronomy-times small, .sun-footer small { color: var(--secondary-text-color); }
  .astronomy-times b { font-size: 16px; font-weight: 500; font-variant-numeric: tabular-nums; }
  .sun-footer { display: flex; justify-content: space-between; }
  .sun-footer b { font-size: 13px; }
  .sun-arc { position: relative; height: 90px; }
  .sun-arc svg { display: block; width: 100%; height: 90px; overflow: visible; }
  .sun-arc line { stroke: rgba(var(--ulm-grey), .18); }
  .sun-arc .sun-day { fill: rgba(var(--ulm-blue), .48); stroke: none; }
  .sun-arc .sun-night { fill: #343579; stroke: none; }
  .sun-marker {
    position: absolute;
    left: var(--sun-x);
    top: var(--sun-y);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffd45c;
    transform: translate(-50%, -50%);
  }
  .astronomy-position-rows { display: grid; gap: 4px; font-size: 12px; }
  .astronomy-position-rows > div {
    display: grid;
    grid-template-columns: 44px minmax(0, auto) minmax(0, auto);
    justify-content: start;
    gap: 14px;
  }
  .astronomy-position-rows strong { font-variant-numeric: tabular-nums; }
  .moon-section {
    display: grid;
    gap: 10px;
    margin-top: 6px;
    padding-top: 14px;
    border-top: 1px solid var(--divider-color, rgba(var(--ulm-grey), .18));
  }
  .moon-heading {
    display: grid;
    min-width: 0;
    grid-template-columns: 40px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
  }
  .moon-symbol {
    display: grid;
    width: 40px;
    height: 40px;
    place-items: center;
    border-radius: 50%;
    background: rgba(var(--ulm-grey), .18);
    color: var(--primary-text-color);
  }
  .moon-symbol ha-icon { --mdc-icon-size: 25px; }
  .moon-copy { display: grid; min-width: 0; gap: 2px; }
  .moon-copy b, .moon-copy small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .moon-copy b { font-size: 14px; }
  .moon-copy small { color: var(--secondary-text-color); font-size: 12px; text-transform: capitalize; }
  .moon-marker {
    position: absolute;
    left: var(--moon-x);
    top: var(--moon-y);
    display: grid;
    width: 28px;
    height: 28px;
    place-items: center;
    border: 2px solid rgba(255, 255, 255, .35);
    border-radius: 50%;
    background: #e7e7e7;
    color: #25293a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .4);
    transform: translate(-50%, -50%);
  }
  .moon-marker.is-below { opacity: .62; }
  .astronomy-moon-marker { z-index: 2; }
  .moon-marker ha-icon { --mdc-icon-size: 20px; }
  .moon-metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; }
  .moon-metric {
    display: grid;
    min-width: 0;
    min-height: 46px;
    grid-template-columns: 26px minmax(0, 1fr);
    align-items: center;
    gap: 8px;
    padding: 7px 9px;
    border-radius: 12px;
    background: rgba(var(--ulm-grey), .08);
  }
  .moon-metric > ha-icon { --mdc-icon-size: 19px; color: rgba(var(--ulm-grey), .8); }
  .moon-metric > span { display: grid; min-width: 0; gap: 1px; }
  .moon-metric small, .moon-metric b { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .moon-metric small { color: var(--secondary-text-color); font-size: 10px; }
  .moon-metric b { font-size: 12px; font-variant-numeric: tabular-nums; }
  .media-platform { display: grid; width: 36px; height: 36px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-purple), .75); color: #fff; }
  .input-datetime-controls { display: grid; grid-template-columns: repeat(3, 1fr); align-items: center; gap: 7px; }
  .input-datetime-controls .ulm-control { width: 100%; height: 42px; border-radius: 14px; }
  .input-datetime-controls .hold-control { font-size: 16px; font-weight: 700; }
  .custom-sonos, .custom-printer,
  .custom-weather-metrics,
  .custom-nas-metrics, .custom-tablet { display: grid; gap: 10px; padding: 12px; }
  .custom-sonos { position: relative; overflow: hidden; }
  .custom-sonos > :not(.media-art) { position: relative; z-index: 1; }
  .custom-sonos.has-art { color: #fff; }
  .custom-sonos.has-art .ulm-name, .custom-sonos.has-art .ulm-label,
  .custom-sonos.has-art .sonos-details summary, .custom-sonos.has-art .sonos-sliders label,
  .custom-sonos.has-art .sonos-sliders output { color: #fff; }
  .custom-sonos.has-art .ulm-label { color: rgba(255,255,255,.78); }
  .custom-sonos.has-art .ulm-icon, .custom-sonos.has-art .sonos-controls button,
  .custom-sonos.has-art .sonos-switches button, .custom-sonos.has-art .sonos-shortcuts button {
    border-color: rgba(255,255,255,.22); background: rgba(0,0,0,.32); color: #fff;
  }
  .sonos-controls {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(42px, 1fr)); align-items: center; gap: 7px;
  }
  .sonos-controls:empty { display: none; }
  .sonos-volume { grid-column: 1 / -1; display: flex; align-items: center; gap: 8px; min-width: 0; }
  .sonos-volume input { flex: 1; min-width: 0; accent-color: rgb(var(--rgb-blue, 3, 169, 244)); }
  .sonos-volume output { font-variant-numeric: tabular-nums; }
  .sonos-controls button[aria-pressed="true"] { color: rgb(var(--rgb-blue, 3, 169, 244)); }
  .sonos-controls button:disabled, .sonos-volume input:disabled { cursor: not-allowed; opacity: .45; }
  .sonos-controls button {
    min-height: 42px; border: 0; border-radius: 13px; background: rgba(var(--ulm-grey), .08); color: var(--primary-text-color);
  }
  .sonos-details { min-width: 0; }
  .sonos-details summary {
    display: flex; min-height: 40px; align-items: center; justify-content: space-between; padding: 0 4px;
    color: var(--primary-text-color); cursor: pointer; font-size: 14px; font-weight: 700; list-style: none;
  }
  .sonos-details summary::-webkit-details-marker { display: none; }
  .sonos-details summary ha-icon { --mdc-icon-size: 20px; transition: transform .2s ease; }
  .sonos-details[open] summary ha-icon { transform: rotate(180deg); }
  .sonos-details-always-visible { padding-top: 4px; }
  .sonos-switches { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 0 10px; }
  .sonos-switches button {
    display: inline-flex; min-height: 40px; align-items: center; gap: 6px; padding: 0 12px;
    border: 1px solid var(--divider-color); border-radius: 20px; background: var(--card-background-color, var(--ha-card-background, #fff));
    color: var(--primary-text-color); font: inherit; font-size: 12px; font-weight: 700;
  }
  .sonos-switches button.is-active {
    border-color: rgb(var(--rgb-blue, 3, 169, 244)); background: rgba(var(--rgb-blue, 3, 169, 244), .12);
  }
  .sonos-switches button:disabled, .sonos-sliders input:disabled { cursor: not-allowed; opacity: .45; }
  .sonos-switches ha-icon { --mdc-icon-size: 18px; color: rgb(var(--rgb-blue, 3, 169, 244)); }
  .sonos-sliders { display: grid; gap: 8px; padding-top: 4px; }
  .sonos-sliders label {
    display: grid; grid-template-columns: 26px minmax(112px, .8fr) minmax(120px, 1fr) 34px;
    min-height: 40px; align-items: center; gap: 8px; color: var(--primary-text-color); font-size: 13px;
  }
  .sonos-sliders label > ha-icon { --mdc-icon-size: 18px; color: rgb(var(--rgb-blue, 3, 169, 244)); }
  .sonos-sliders input { width: 100%; accent-color: rgb(var(--rgb-blue, 3, 169, 244)); }
  .sonos-sliders output { color: var(--primary-text-color); text-align: right; font-variant-numeric: tabular-nums; }
  .sonos-shortcuts {
    display: grid; grid-template-columns: repeat(var(--sonos-shortcut-columns, 4), minmax(0, 1fr)); gap: 8px;
  }
  .sonos-shortcuts button {
    display: grid; min-width: 0; min-height: 56px; place-items: center; gap: 4px; padding: 8px 4px;
    border: 1px solid var(--divider-color); border-radius: 14px;
    background: var(--card-background-color, var(--ha-card-background, #fff));
    color: var(--primary-text-color); cursor: pointer;
  }
  .sonos-shortcuts button:disabled { cursor: not-allowed; opacity: .45; }
  .sonos-shortcuts ha-icon { --mdc-icon-size: 22px; color: rgb(var(--rgb-blue, 3, 169, 244)); }
  .sonos-shortcuts span {
    min-width: 0; max-width: 100%; overflow: hidden; font-size: 11px; font-weight: 700;
    text-overflow: ellipsis; white-space: nowrap;
  }
  .metrics-four button:disabled { cursor: not-allowed; opacity: .45; }
  .nas-metrics-header {
    display: flex; min-width: 0; align-items: center; gap: 10px;
  }
  .custom-weather-metrics { min-height: 160px; border-radius: 30px; }
  .weather-metrics-panel { display: grid; min-height: 66px; align-items: center; border: 2px solid rgba(var(--ulm-grey), .65); border-radius: 20px; }
  .weather-metrics-panel { grid-template-columns: 1fr auto; padding-left: 12px; }
  .weather-metrics-panel .weather-date { font-size: 14px; }
  .weather-metrics-panel strong { margin-right: 12px; color: var(--primary-text-color); font-size: 20px; }
  .metrics-four { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
  .metrics-four > button { display: grid; min-width: 0; min-height: 54px; place-items: center; padding: 6px 3px; border: 0; background: transparent; color: var(--primary-text-color); text-align: center; }
  .metrics-four b, .metrics-four small { overflow: hidden; max-width: 100%; text-overflow: ellipsis; white-space: nowrap; }
  .metrics-four b { font-size: 14px; } .metrics-four small { color: var(--secondary-text-color); font-size: 12px; font-weight: 700; }
  .toner-bars { display: grid; gap: 5px; }
  .toner-bars span { display: block; min-height: 30px; }
  .toner-bars i { position: relative; display: grid; box-sizing: border-box; height: 30px; overflow: hidden; place-items: center; border: 1px solid rgba(var(--ulm-grey), .3); border-radius: 10px; background: rgba(var(--ulm-grey), .08); font-style: normal; }
  .toner-bars em { position: absolute; inset: 0 auto 0 0; width: var(--level); background: var(--toner); }
  .toner-bars b { position: relative; z-index: 1; padding: 2px 7px; border-radius: 999px; background: color-mix(in srgb, var(--card-background-color, #fff) 88%, transparent); color: var(--primary-text-color); font-size: 12px; font-variant-numeric: tabular-nums; font-weight: 600; }
  .custom-nas-metrics { gap: 12px; padding: 12px; }
  .nas-metrics-top { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .nas-metrics-tile { box-sizing: border-box; display: grid; min-height: 102px; grid-template-columns: 64px minmax(0, 1fr); align-items: center; gap: 16px; padding: 12px 18px; border: 0; border-radius: 30px; background: transparent; color: var(--primary-text-color); text-align: left; }
  button.nas-metrics-tile { cursor: pointer; }
  .nas-metrics-tile-icon { display: grid; width: 62px; height: 62px; place-items: center; border-radius: 50%; background: rgba(var(--tone), .2); color: rgb(var(--tone)); }
  .nas-metrics-tile-icon ha-icon { --mdc-icon-size: 24px; }
  .nas-metrics-tile > span:last-child, .nas-metrics-metrics > span > span { display: grid; }
  .nas-metrics-tile b, .nas-metrics-metrics b { font-size: 21px; line-height: 1.1; }
  .nas-metrics-tile small, .nas-metrics-metrics small { color: rgba(var(--ulm-grey), .65); font-size: 17px; font-weight: 600; }
  .nas-metrics-body { display: grid; grid-template-columns: minmax(150px, .9fr) minmax(180px, 1.2fr); align-items: center; gap: 18px; }
  .nas-metrics-metrics { display: grid; gap: 12px; }
  .nas-metrics-metrics > span { display: grid; min-height: 62px; grid-template-columns: 56px minmax(0, 1fr); align-items: center; gap: 14px; }
  .nas-metrics-metrics i { display: grid; width: 56px; height: 56px; place-items: center; border-radius: 50%; background: rgba(var(--tone), .2); color: rgb(var(--tone)); font-style: normal; }
  .nas-metrics-metrics i ha-icon { --mdc-icon-size: 24px; }
  .nas-metrics-rings { width: 100%; max-width: 190px; justify-self: center; overflow: visible; transform: rotate(-90deg); }
  .nas-metrics-ring-track, .nas-metrics-ring-value { fill: none; stroke-width: 6; }
  .nas-metrics-ring-track { stroke: rgba(var(--ulm-grey), .16); }
  .nas-metrics-ring-value { stroke-linecap: round; }
  @container (max-width: 380px) {
    .custom-nas-metrics { gap: 10px; padding: 12px; }
    .nas-metrics-top { gap: 8px; }
    .nas-metrics-tile {
      min-width: 0;
      min-height: 82px;
      grid-template-columns: 44px minmax(0, 1fr);
      gap: 9px;
      padding: 9px 10px;
      border-radius: 24px;
    }
    .nas-metrics-tile-icon { width: 44px; height: 44px; }
    .nas-metrics-tile b, .nas-metrics-metrics b { font-size: 16px; }
    .nas-metrics-tile small, .nas-metrics-metrics small { font-size: 13px; }
    .nas-metrics-tile > span:last-child { min-width: 0; overflow: hidden; }
    .nas-metrics-tile b, .nas-metrics-tile small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .nas-metrics-body { grid-template-columns: minmax(112px, 1fr) minmax(120px, 132px); gap: 8px; }
    .nas-metrics-metrics { gap: 6px; }
    .nas-metrics-metrics > span {
      min-height: 46px;
      grid-template-columns: 38px minmax(0, 1fr);
      gap: 8px;
    }
    .nas-metrics-metrics i { width: 38px; height: 38px; }
    .nas-metrics-metrics i ha-icon, .nas-metrics-tile-icon ha-icon { --mdc-icon-size: 20px; }
    .nas-metrics-rings { width: 132px; max-width: 100%; }
  }
  .custom-tablet { gap: 14px; padding: 18px; }
  .tablet-header { display: grid; grid-template-columns: var(--mush-icon-size, 40px) minmax(0, 1fr); align-items: center; gap: 12px; }
  .tablet-icon { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .2); color: rgb(var(--ulm-blue)); }
  .tablet-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .tablet-header .ulm-name { font-size: 14px; }
  .tablet-header .ulm-label { font-size: 12px; }
  .tablet-controls { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .tablet-controls button { display: grid; height: 42px; place-items: center; border: 0; border-radius: 14px; background: rgba(var(--tone), .2); color: rgb(var(--tone)); cursor: pointer; }
  .tablet-controls button ha-icon { --mdc-icon-size: 22px; }
  .tablet-controls button.is-active { background: rgba(var(--tone), .3); box-shadow: inset 0 0 0 2px rgba(var(--tone), .35); }
  .tablet-controls button:disabled { opacity: .3; cursor: not-allowed; }
  .tablet-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(72px, 1fr)); gap: 8px; text-align: center; }
  .tablet-metrics span { display: grid; gap: 2px; }
  .tablet-metrics span.is-unavailable { opacity: .55; }
  .tablet-metrics b { overflow: hidden; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }
  .tablet-metrics small { color: rgba(var(--ulm-grey), .65); font-size: 12px; font-weight: 600; }
  .tablet-battery-row { display: grid; grid-template-columns: var(--mush-icon-size, 40px) minmax(0, 1fr); align-items: center; gap: 12px; }
  .tablet-battery-icon { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--ulm-grey), .08); color: rgba(var(--ulm-grey), .8); }
  .tablet-battery-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .tablet-battery-row > span:last-child { display: grid; }
  .tablet-battery-row b { font-size: 14px; } .tablet-battery-row small { color: rgba(var(--ulm-grey), .65); font-size: 12px; font-weight: 600; }
  .tablet-battery-bar { position: relative; height: 35px; overflow: hidden; border-radius: 18px; background: rgba(var(--ulm-grey), .16); }
  .tablet-battery-bar i { position: absolute; inset: 0 auto 0 0; border-radius: inherit 0 0 inherit; background: #00c853; }
  .tablet-battery-bar b { position: relative; z-index: 1; display: flex; height: 100%; align-items: center; justify-content: flex-end; padding-right: 14px; font-size: 16px; }
  .waste-collection-icon { position: relative; } .waste-collection-icon > i { position: absolute; top: -3px; right: -3px; display: grid; width: 20px; height: 20px; place-items: center; border-radius: 50%; background: rgb(var(--ulm-red)); color: #fff; }
  .waste-collection-icon > i ha-icon { --mdc-icon-size: 13px; }
  .custom-plant { display: grid; gap: 10px; padding: 12px; }
  .flower-heading {
    display: flex; min-width: 0; align-items: center; gap: 10px;
  }
  .flower-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
  .flower-metrics > span { display: grid; min-width: 0; min-height: 52px; place-items: center; padding: 6px; border-radius: 12px; background: rgba(var(--ulm-grey), .07); text-align: center; }
  .flower-metrics ha-icon { --mdc-icon-size: 17px; color: rgb(var(--ulm-blue)); }
  .flower-metrics b { overflow: hidden; max-width: 100%; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
  .custom-console-card { position: relative; min-height: 72px; overflow: hidden; }
  .custom-console-card.has-artwork { background: #17191d; color: #fff; }
  .platform-xbox { --console-tone: 16, 124, 16; }
  .platform-playstation { --console-tone: 0, 112, 209; }
  .platform-nintendo { --console-tone: 230, 0, 18; }
  .platform-generic { --console-tone: var(--ulm-purple); }
  .console-backdrop {
    position: absolute; inset: 0; background-position: center; background-size: cover; opacity: .42;
  }
  .console-content {
    position: relative; z-index: 1; display: grid; min-height: 72px; gap: 10px; padding: 12px;
  }
  .has-artwork .console-content { background: linear-gradient(90deg, rgba(0,0,0,.84), rgba(0,0,0,.24)); }
  .console-header {
    min-width: 0;
  }
  .console-logo {
    display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%;
    flex: 0 0 auto;
    background: rgba(var(--console-tone), .18); color: rgb(var(--console-tone));
  }
  .console-logo.has-picture { background-position: center; background-size: cover; }
  .console-logo ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .state-unavailable .console-logo, .state-unknown .console-logo {
    color: rgba(var(--ulm-grey), .5); background: rgba(var(--ulm-grey), .1);
  }
  .has-artwork .console-header .ulm-label { color: rgba(255,255,255,.75); }
  .console-top-stats { display: grid; justify-items: end; gap: 4px; margin-left: auto; }
  .console-top-stats > span {
    display: inline-flex; min-height: 24px; align-items: center; gap: 5px; padding: 0 8px;
    border-radius: 12px; background: rgba(var(--console-tone), .14); color: var(--primary-text-color);
  }
  .has-artwork .console-top-stats > span { background: rgba(0,0,0,.38); color: #fff; }
  .console-top-stats ha-icon { --mdc-icon-size: 13px; color: rgb(var(--console-tone)); }
  .console-top-stats b { font-size: 11px; font-variant-numeric: tabular-nums; }
  .console-social { display: flex; min-width: 0; align-items: center; gap: 14px; }
  .console-social > span { display: inline-flex; min-width: 0; align-items: center; gap: 4px; }
  .console-social ha-icon { width: 40px; height: 40px; --mdc-icon-size: 40px; color: rgb(var(--console-tone)); }
  .console-social b { font-size: 10px; font-variant-numeric: tabular-nums; }
  .console-controls { display: flex; justify-content: flex-end; }
  .console-controls button {
    display: inline-flex; min-height: 32px; align-items: center; gap: 6px; padding: 0 10px;
    border: 0; border-radius: 12px; background: rgba(var(--console-tone), .16);
    color: rgb(var(--console-tone)); font: inherit; font-size: 11px; font-weight: 700; cursor: pointer;
  }
  .has-artwork .console-controls button { background: rgba(0,0,0,.38); color: #fff; }
  .console-controls ha-icon { --mdc-icon-size: 16px; }
  .source-scene-grid .scene-grid { display: grid; grid-template-columns: repeat(5, 64px); justify-content: space-between; gap: 12px; }
  .flower-heading { width: 100%; padding: 0; border: 0; background: transparent; color: inherit; text-align: left; }
  .flower-bars { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 12px; }
  .flower-bars > span {
    display: grid; min-width: 0; grid-template-columns: 18px minmax(0, 1fr) auto; align-items: center; gap: 5px;
  }
  .flower-bars ha-icon { --mdc-icon-size: 15px; }
  .flower-bars i { display: block; height: 7px; overflow: hidden; border-radius: 2px; background: rgba(var(--ulm-grey), .1); }
  .flower-bars em { display: block; height: 100%; background: rgb(var(--ulm-green)); }
  .flower-bars output {
    overflow: hidden; max-width: 54px; color: var(--secondary-text-color); font-size: 10px;
    font-variant-numeric: tabular-nums; text-overflow: ellipsis; white-space: nowrap;
  }
  .speedtest-three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
  .speedtest-three ha-icon { color: rgb(var(--ulm-blue)); } .speedtest-three b { font-size: 12px; } .speedtest-three small { overflow: hidden; max-width: 100%; color: var(--secondary-text-color); font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }
  .speedtest-chart { height: 58px; overflow: hidden; } .speedtest-chart .sparkline { height: 60px; }
  .custom-speedtest-gauges { display: grid; gap: 12px; padding: 12px; }
  .speedtest-three { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2px; }
  .speedtest-metric { position: relative; display: grid; min-width: 0; min-height: 112px; place-items: center; color: var(--speedtest-color); }
  .speedtest-ring { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .speedtest-ring path { fill: none; stroke-linecap: round; stroke-width: 8; }
  .speedtest-track { stroke: rgba(var(--ulm-grey), .12); }
  .speedtest-value { stroke: var(--speedtest-color); stroke-dasharray: var(--speedtest-value) 100; }
  .speedtest-value-copy { position: relative; display: grid; place-items: center; text-align: center; }
  .speedtest-value-copy ha-icon, .speedtest-value-copy b { position: relative; top: 9px; }
  .speedtest-value-copy ha-icon { --mdc-icon-size: 20px; }
  .speedtest-value-copy b { margin-top: 2px; color: var(--primary-text-color); font-size: 13px; }
  .speedtest-value-copy small { margin-top: 4px; color: var(--secondary-text-color); font-size: 11px; font-weight: 700; }
  .custom-pollen { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 12px; }
  .pollen-heading { grid-column: 1 / -1; min-width: 0; }
  .pollen-item { display: grid; min-width: 0; min-height: 92px; place-items: center; gap: 3px; padding: 6px 3px; border: 0; border-radius: var(--border-radius, 12px); background: transparent; color: var(--primary-text-color); text-align: center; cursor: pointer; }
  .pollen-item:disabled { cursor: default; opacity: .55; }
  .pollen-item-icon { position: relative; display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--pollen) 20%, transparent); color: var(--pollen); }
  .pollen-item-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .pollen-extreme { position: absolute; top: -3px; right: -4px; display: grid; width: 18px; height: 18px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; background: rgba(var(--color-red, 244, 67, 54), 1); color: white; }
  .pollen-extreme ha-icon { --mdc-icon-size: 11px; }
  .custom-pollen b { overflow: hidden; max-width: 100%; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
  .custom-pollen small { color: var(--secondary-text-color); font-size: 10px; }
  .advanced-energy-management {
    box-sizing: border-box;
    padding: 12px;
    border-radius: 20px;
    background: var(--ha-card-background, var(--card-background-color, #fff));
  }
  .hems-flow {
    display: block;
    width: 100%;
    min-width: 0;
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
  }
  .hems-track {
    fill: none;
    stroke: var(--divider-color);
    stroke-width: 9;
    stroke-linecap: round;
  }
  .hems-battery-track { stroke-width: 13; }
  .hems-bar { fill: none; stroke-width: 9; stroke-linecap: round; }
  .hems-battery-value { fill: var(--primary-text-color); font-size: 52px; font-weight: 500; }
  .hems-muted { fill: var(--secondary-text-color); font-size: 15px; font-weight: 400; }
  .hems-time { font-size: 22px; }
  .hems-main-value { fill: var(--primary-text-color); font-size: 36px; font-weight: 500; }
  .hems-detail { font-size: 16px; }
  .hems-mode { font-size: 18px; }
  .hems-price { font-size: 17px; font-weight: 600; }
  .hems-hour { font-size: 13px; }
  .hems-center { text-anchor: middle; }
  .hems-end { text-anchor: end; }
  .hems-now { fill: var(--primary-text-color); }
  .energy-buy-sell-card,
  .panel-health-card {
    box-sizing: border-box;
    min-width: 0;
    padding: 12px;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
  }
  .hems-presentation, .advanced-energy-management > .automatic-presentation { margin-bottom: 12px; }
  .energy-buy-sell-chart { width: 100%; min-width: 0; margin-top: 8px; }
  .energy-buy-sell-chart svg { display: block; width: 100%; height: 100%; overflow: visible; }
  .energy-chart-grid { stroke: var(--divider-color); stroke-width: 1; stroke-dasharray: 3 4; }
  .energy-chart-axis { stroke: var(--divider-color); stroke-width: 1; }
  .energy-chart-tick { fill: var(--secondary-text-color); font-size: 11px; }
  .energy-chart-axis-title { fill: var(--secondary-text-color); font-size: 11px; }
  .energy-chart-empty { fill: var(--secondary-text-color); font-size: 14px; }
  .energy-chart-now { stroke: var(--primary-text-color); stroke-width: 1.5; stroke-dasharray: 3 3; }
  .energy-chart-now-label { font-size: 11px; font-weight: 600; }
  .energy-chart-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 16px; padding: 8px 0 2px; }
  .energy-chart-legend-item { display: inline-flex; align-items: center; gap: 6px; color: var(--secondary-text-color); font-size: 12px; }
  .energy-chart-legend-swatch { width: 10px; height: 10px; border-radius: 3px; background: var(--energy-series-color); }
  .panel-health-summary { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px 16px; margin-top: 14px; }
  .panel-health-summary-row { display: flex; justify-content: space-between; gap: 8px; padding: 7px 2px; border-bottom: 1px solid var(--divider-color); font-size: 13px; }
  .panel-health-summary-row span { color: var(--secondary-text-color); }
  .panel-health-summary-row strong { color: var(--primary-text-color); text-align: right; }
  .panel-health-status { display: flex; align-items: flex-start; gap: 8px; margin-top: 12px; padding: 10px 12px; border-radius: 10px; background: var(--secondary-background-color, rgba(127,127,127,.1)); font-size: 13px; line-height: 1.45; }
  .panel-health-status ha-icon { flex: 0 0 auto; --mdc-icon-size: 18px; }
  .panel-health-status-warning { color: var(--error-color); }
  .panel-health-status-success { color: var(--success-color, var(--primary-color)); }
  .panel-health-status-muted { color: var(--secondary-text-color); }
  .panel-health-gauges { display: grid; grid-template-columns: repeat(auto-fit, minmax(78px, 1fr)); gap: 4px; margin-top: 12px; }
  .panel-health-gauge { display: grid; min-width: 0; justify-items: center; gap: 2px; padding: 4px; border: 0; border-radius: 10px; background: transparent; color: var(--primary-text-color); cursor: pointer; }
  .panel-health-gauge:hover { background: var(--secondary-background-color, rgba(127,127,127,.08)); }
  .panel-health-gauge svg { width: min(100%, 84px); overflow: visible; }
  .panel-health-gauge-track,
  .panel-health-gauge-value { fill: none; stroke-width: 7; }
  .panel-health-gauge-track { stroke: var(--divider-color); opacity: .55; }
  .panel-health-gauge-value { stroke: var(--panel-gauge-color); stroke-linecap: round; transform: rotate(-90deg); transform-origin: 50px 46px; }
  .panel-health-gauge-value-label { fill: var(--primary-text-color); font-size: 19px; font-weight: 600; }
  .panel-health-gauge-name { overflow: hidden; max-width: 100%; color: var(--secondary-text-color); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
  .energy-card-empty { margin-top: 12px; padding: 12px; border-radius: 10px; background: var(--secondary-background-color, rgba(127,127,127,.1)); color: var(--secondary-text-color); font-size: 13px; line-height: 1.45; }
  .energy-buy-sell-result { margin-top: 12px; border-top: 1px solid var(--divider-color); }
  .energy-buy-sell-result summary { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 0; list-style: none; font-size: 14px; font-weight: 600; cursor: pointer; }
  .energy-buy-sell-result summary::-webkit-details-marker { display: none; }
  .energy-buy-sell-result summary ha-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); }
  .energy-buy-sell-result[open] summary ha-icon { transform: rotate(180deg); }
  .energy-buy-sell-result summary:focus-visible, .energy-result-table-scroll:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .energy-result-table-scroll { max-width: 100%; overflow-x: auto; }
  .energy-result-table { width: 100%; border-collapse: collapse; font-size: 12px; font-variant-numeric: tabular-nums; }
  .energy-result-table th, .energy-result-table td { padding: 8px 6px; border-bottom: 1px solid var(--divider-color); text-align: right; }
  .energy-result-table th:first-child, .energy-result-table td:nth-child(2), .energy-result-table th:nth-child(2) { text-align: left; }
  .energy-result-table thead { color: var(--secondary-text-color); }
  .energy-result-kind { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  .energy-result-kind i { width: 10px; height: 10px; border-radius: 50%; background: var(--energy-result-color); }
  .energy-result-net { margin: 14px 0; font-size: 15px; font-weight: 600; }
  .energy-result-note { margin: 0; color: var(--secondary-text-color); font-size: 12px; line-height: 1.6; cursor: text; }
  @container (max-width: 420px) {
    .panel-health-summary { grid-template-columns: 1fr; }
    .energy-chart-legend { justify-content: flex-start; gap: 6px 12px; }
  }
  .preview { padding: 16px; color: var(--secondary-text-color); text-align: center; }
`;
const nn = (e) => e.strings === void 0;
const Sa = { CHILD: 2, ELEMENT: 6 }, sn = (e) => (...t) => ({ _$litDirective$: e, values: t });
class ln {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, o, a) {
    this._$Ct = t, this._$AM = o, this._$Ci = a;
  }
  _$AS(t, o) {
    return this.update(t, o);
  }
  update(t, o) {
    return this.render(...o);
  }
}
const rt = (e, t) => {
  const o = e._$AN;
  if (o === void 0) return !1;
  for (const a of o) a._$AO?.(t, !1), rt(a, t);
  return !0;
}, wt = (e) => {
  let t, o;
  do {
    if ((t = e._$AM) === void 0) break;
    o = t._$AN, o.delete(e), e = t;
  } while (o?.size === 0);
}, ka = (e) => {
  for (let t; t = e._$AM; e = t) {
    let o = t._$AN;
    if (o === void 0) t._$AN = o = /* @__PURE__ */ new Set();
    else if (o.has(e)) break;
    o.add(e), un(t);
  }
};
function cn(e) {
  this._$AN !== void 0 ? (wt(this), this._$AM = e, ka(this)) : this._$AM = e;
}
function dn(e, t = !1, o = 0) {
  const a = this._$AH, r = this._$AN;
  if (r !== void 0 && r.size !== 0) if (t) if (Array.isArray(a)) for (let n = o; n < a.length; n++) rt(a[n], !1), wt(a[n]);
  else a != null && (rt(a, !1), wt(a));
  else rt(this, e);
}
const un = (e) => {
  e.type == Sa.CHILD && (e._$AP ??= dn, e._$AQ ??= cn);
};
class mn extends ln {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, o, a) {
    super._$AT(t, o, a), ka(this), this.isConnected = t._$AU;
  }
  _$AO(t, o = !0) {
    t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), o && (rt(this, t), wt(this));
  }
  setValue(t) {
    if (nn(this._$Ct)) this._$Ct._$AI(t, this);
    else {
      const o = [...this._$Ct._$AH];
      o[this._$Ci] = t, this._$Ct._$AI(o, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
class _n extends mn {
  constructor(t) {
    if (super(t), this.held = !1, this.cancelled = !1, this.onEvent = (o) => {
      if (o.stopPropagation(), !this.element?.disabled)
        switch (o.type) {
          case "pointerdown": {
            const a = o;
            if (a.button !== 0 && a.button !== void 0) return;
            this.clearHold(), this.held = !1, this.cancelled = !1, this.pointer = { x: a.clientX, y: a.clientY }, this.config?.hold_action && this.config.hold_action.action !== "none" && (this.holdTimer = window.setTimeout(() => {
              this.held = !0, this.clearTap(), this.run("hold");
            }, 500));
            break;
          }
          case "pointermove": {
            const a = o;
            this.pointer && Math.hypot(a.clientX - this.pointer.x, a.clientY - this.pointer.y) > 10 && (this.clearHold(), this.cancelled = !0);
            break;
          }
          case "pointerup":
            this.clearHold(), this.pointer = void 0;
            break;
          case "pointercancel":
          case "pointerleave":
            this.clearHold(), this.pointer = void 0, this.cancelled = !0;
            break;
          case "click": {
            if (this.cancelled) {
              this.cancelled = !1;
              return;
            }
            if (this.held) return;
            const a = o;
            if (a.detail > 1) return;
            this.clearTap(), !a.detail || this.config?.double_tap_action?.action === "none" || !this.config?.double_tap_action ? this.run("tap") : this.tapTimer = window.setTimeout(() => {
              this.tapTimer = void 0, this.run("tap");
            }, 300);
            break;
          }
          case "dblclick":
            this.clearTap(), !this.held && !this.cancelled && this.run("double_tap");
            break;
          case "keydown": {
            const a = o;
            (a.key === "Enter" || a.key === " ") && (a.preventDefault(), a.repeat || (this.clearTap(), this.held = !1, this.cancelled = !1, this.run("tap")));
            break;
          }
          case "keyup":
          case "contextmenu":
            o.preventDefault();
            break;
        }
    }, t.type !== Sa.ELEMENT) throw new Error("Control actions require an element");
  }
  render(t) {
    return m;
  }
  update(t, [o]) {
    return this.config?.entity !== o.entity && (this.clearHold(), this.clearTap()), this.config = o, this.element || (this.element = t.element, this.listen(!0)), m;
  }
  run(t) {
    if (!this.config || this.element?.disabled || !this.isConnected) return;
    const o = this.config[`${t}_action`];
    !o || o.action === "none" || ra(this.element, {
      ...this.config,
      entity: typeof o.entity == "string" ? o.entity : this.config.entity
    }, t);
  }
  clearHold() {
    window.clearTimeout(this.holdTimer), this.holdTimer = void 0;
  }
  clearTap() {
    window.clearTimeout(this.tapTimer), this.tapTimer = void 0;
  }
  listen(t) {
    for (const o of [
      "pointerdown",
      "pointermove",
      "pointerup",
      "pointercancel",
      "pointerleave",
      "click",
      "dblclick",
      "keydown",
      "keyup",
      "contextmenu"
    ])
      t ? this.element?.addEventListener(o, this.onEvent) : this.element?.removeEventListener(o, this.onEvent);
  }
  disconnected() {
    this.clearHold(), this.clearTap(), this.listen(!1);
  }
  reconnected() {
    this.listen(!0);
  }
}
const Te = sn(_n), pn = {
  red: "244, 67, 54",
  pink: "233, 30, 99",
  purple: "146, 107, 199",
  "deep-purple": "110, 65, 171",
  indigo: "63, 81, 181",
  blue: "33, 150, 243",
  "light-blue": "3, 169, 244",
  cyan: "0, 188, 212",
  teal: "0, 150, 136",
  green: "76, 175, 80",
  "light-green": "139, 195, 74",
  lime: "205, 220, 57",
  yellow: "255, 235, 59",
  amber: "255, 193, 7",
  orange: "255, 152, 0",
  "deep-orange": "255, 111, 34",
  brown: "121, 85, 72",
  "light-grey": "189, 189, 189",
  grey: "158, 158, 158",
  "dark-grey": "96, 96, 96",
  "blue-grey": "96, 125, 139",
  black: "0, 0, 0",
  white: "255, 255, 255",
  disabled: "189, 189, 189"
}, hn = (e, t) => {
  const o = e?.trim() || t.trim();
  if (o === "primary")
    return e ? `var(--primary-color, ${t})` : "var(--primary-color)";
  if (o === "accent")
    return e ? `var(--accent-color, ${t})` : "var(--accent-color)";
  const a = pn[o];
  return a ? `rgb(var(--rgb-${o}, ${a}))` : o;
}, Be = (e, t) => {
  if (!t) return;
  const o = Number.parseFloat(e.states[t]?.state ?? "");
  return Number.isFinite(o) ? o : void 0;
}, gn = (e, t, o = "") => t ? e.states[t]?.attributes.unit_of_measurement ?? o : o, Pe = (e, t) => {
  const o = Be(e, t);
  if (o === void 0) return;
  const a = gn(e, t).toLowerCase();
  return a === "mw" ? o * 1e6 : a === "kw" ? o * 1e3 : o;
}, Se = (e) => {
  const t = Math.abs(e ?? 0);
  return t >= 1e3 ? `${(t / 1e3).toFixed(2).replace(".", ",")} kW` : `${Math.round(t).toLocaleString()} W`;
}, Vt = (e, t, o, a = 380, r = 300) => {
  const n = (u) => {
    const _ = u * Math.PI / 180;
    return [
      a + e * Math.sin(_),
      r - e * Math.cos(_)
    ];
  }, [i, l] = n(t), [s, d] = n(o);
  return `M${i.toFixed(1)} ${l.toFixed(1)}A${e} ${e} 0 ${o - t > 180 ? 1 : 0} 1 ${s.toFixed(1)} ${d.toFixed(1)}`;
}, yn = (e, t, o, a, r = !1) => {
  const n = Math.max(0, Math.min(1, a));
  if (n < 0.015) return;
  const i = (o - t) * n;
  return r ? Vt(e, o - i, o) : Vt(e, t, t + i);
}, bn = (e) => {
  const t = e?.attributes.raw_today;
  return Array.isArray(t) ? t : [];
}, fn = (e, t = 0, o = 0) => bn(e).flatMap((a) => {
  if (!a || typeof a != "object") return [];
  const r = a, n = new Date(String(r.start ?? "")).getTime(), i = new Date(String(r.end ?? "")).getTime(), l = Number(r.value);
  return !Number.isFinite(n) || !Number.isFinite(i) || !Number.isFinite(l) ? [] : [{
    start: n,
    end: i,
    price: (l + t) * (1 + o / 100)
  }];
}), vn = (e) => {
  if (typeof e == "number" && Number.isFinite(e))
    return e < 1e12 ? e * 1e3 : e;
  if (typeof e != "string" || !e.trim()) return;
  const t = Date.parse(e);
  return Number.isFinite(t) ? t : void 0;
}, wn = (e) => {
  const t = e?.attributes.slots;
  return Array.isArray(t) ? t.flatMap((o) => {
    if (!Array.isArray(o) || o.length < 3) return [];
    const a = vn(o[0]);
    if (typeof o[1] != "number" && (typeof o[1] != "string" || !o[1].trim()) || typeof o[2] != "number" && (typeof o[2] != "string" || !o[2].trim())) return [];
    const r = Number(o[1]), n = Number(o[2]);
    return a === void 0 || !Number.isFinite(r) || !Number.isInteger(n) || n < 0 || n > 3 ? [] : [{ timestamp: a, price: r, kind: n }];
  }).sort((o, a) => o.timestamp - a.timestamp) : [];
}, $n = (e, t, o) => {
  const a = e.map(({ price: l }) => l), r = Number.isFinite(t) ? t : Math.min(0, ...a), n = Number.isFinite(o) ? o : Math.max(0, ...a);
  if (n > r) {
    const l = Number.isFinite(o) ? 0 : (n - r) * 0.06;
    return { minimum: r, maximum: n + l };
  }
  const i = Math.max(Math.abs(r) * 0.1, 1);
  return { minimum: r - i, maximum: n + i };
}, Lo = (e, t = 2) => e.toFixed(Math.max(0, Math.min(6, Math.floor(t)))), xn = (e, t) => {
  const { energy: o, power: a, efficiency: r, fee: n, slotMinutes: i } = t;
  if (![o, a, r, n, i].every(Number.isFinite) || o <= 0 || a <= 0 || r <= 0 || r > 100 || n < 0 || i <= 0) return { error: "Enter a positive trade size, power and slot duration, an efficiency from 1 to 100%, and a non-negative feed-in fee." };
  if (e.length === 0) return { error: "No price slots available for the buy and sell result." };
  const l = [...e].sort((p, y) => p.timestamp - y.timestamp);
  if (l.some(
    (p, y) => !Number.isFinite(p.timestamp) || !Number.isFinite(p.price) || y > 0 && p.timestamp === l[y - 1].timestamp
  )) return { error: "Price slots must contain finite prices and unique timestamps." };
  const s = l.map((p, y) => ({
    ...p,
    duration: Math.min(
      i * 6e4,
      l[y + 1] ? l[y + 1].timestamp - p.timestamp : 1 / 0
    )
  })).sort((p, y) => p.price - y.price || p.timestamp - y.timestamp), d = /* @__PURE__ */ new Set(), u = (p, y) => {
    let x = p, b = 0;
    const f = [];
    for (let k = 0; k < s.length && x > 1e-9; k++) {
      const w = s[y ? s.length - 1 - k : k];
      if (d.has(w.timestamp)) continue;
      const T = Math.min(x, a * w.duration / 36e5);
      d.add(w.timestamp), f.push({ start: w.timestamp, end: w.timestamp + T / a * 36e5, energy: T }), b += T * w.price, x -= T;
    }
    if (!(x > 1e-9))
      return {
        slots: f.sort((k, w) => k.start - w.start),
        energy: p,
        averagePrice: b / p,
        amount: y ? b - n * p : -b
      };
  }, _ = u(o / (r / 100), !1), h = u(o, !0);
  return !_ || !h ? { error: "Not enough separate price slots to buy and sell the configured trade size. Reduce the trade size or supply more prices." } : { buy: _, sell: h, net: _.amount + h.amount };
}, Sn = (e) => {
  const t = Number.parseFloat(e.state);
  return Number.isFinite(t) ? t : 0;
}, kn = (e, t, o) => {
  const a = t?.length ? t : o ? [o] : Object.keys(e).filter((r) => /^sensor\.inverter_4/i.test(r));
  return [...new Set(a)].filter((r) => r.startsWith("sensor.") && e[r] !== void 0).sort((r, n) => r.localeCompare(n, void 0, { numeric: !0 })).map((r) => {
    const n = e[r];
    return {
      entity: n,
      id: r.slice(-4),
      value: Sn(n)
    };
  });
}, Mn = (e) => {
  const t = e.reduce((n, i) => n + i.value, 0), o = [...e].sort((n, i) => n.value - i.value || n.entity.entity_id.localeCompare(i.entity.entity_id)), a = o[0], r = o.at(-1);
  return {
    panels: [...e],
    activeCount: e.filter(({ value: n }) => n > 0).length,
    totalOutput: t,
    averageOutput: e.length ? t / e.length : 0,
    best: r,
    weakest: a,
    spread: r && a ? r.value - a.value : 0
  };
}, An = (e, t) => Math.max(0, Math.min(100, e / Math.max(1, t) * 100)), Cn = (e, t, o) => {
  let a = 0;
  return t.forEach((r, n) => {
    e >= r && (a = n);
  }), o[Math.min(a, o.length - 1)] ?? "var(--primary-color)";
};
var In = Object.defineProperty, En = Object.getOwnPropertyDescriptor, Re = (e, t, o, a) => {
  for (var r = a > 1 ? void 0 : a ? En(t, o) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = (a ? i(t, o, r) : i(r)) || r);
  return a && r && In(t, o, r), r;
};
const Pn = /* @__PURE__ */ new Set(["off", "unknown", "unavailable", "none", "idle"]);
let $e = class extends be {
  constructor() {
    super(...arguments), this.selectedIndex = 0, this.carouselWidth = 0, this.dragOffset = 0, this.dragging = !1, this.horizontalVelocity = 0, this.pointerAxis = "pending", this.holdFired = !1, this.pointerStartedOnItem = !1, this.onPointerDown = (e) => {
      if (e.pointerType && e.isPrimary === !1) return;
      e.stopPropagation(), this.dragStartX = e.clientX, this.dragStartY = e.clientY, this.lastPointerX = e.clientX, this.lastPointerTime = e.timeStamp, this.horizontalVelocity = 0, this.pointerAxis = "pending", this.dragOffset = 0, this.dragging = !1, this.holdFired = !1;
      const t = e.composedPath().find((a) => a instanceof HTMLElement && a.matches("button[data-carousel-index]")), o = Number(t?.dataset.carouselIndex);
      this.pointerStartedOnItem = !!t && Number.isInteger(o), this.pointerItemIndex = this.pointerStartedOnItem ? o : this.selectedIndex, this.pointerStartedOnItem && this.pointerItemIndex === this.selectedIndex && (this.holdTimer = window.setTimeout(() => {
        this.holdFired = !0, this.runItemAction(this.items[this.pointerItemIndex ?? this.selectedIndex], "hold");
      }, 500));
    }, this.onPointerMove = (e) => {
      if (this.dragStartX === void 0 || this.dragStartY === void 0) return;
      const t = e.clientX - this.dragStartX, o = e.clientY - this.dragStartY;
      if (this.pointerAxis === "pending") {
        if (Math.max(Math.abs(t), Math.abs(o)) < 4) return;
        if (Math.abs(o) > Math.abs(t) * 1.15) {
          this.pointerAxis = "vertical", this.clearHold();
          return;
        }
        this.pointerAxis = "horizontal", this.dragging = !0, this.clearHold();
        try {
          e.currentTarget.setPointerCapture?.(e.pointerId);
        } catch (r) {
          if (!(r instanceof DOMException)) throw r;
        }
      }
      if (this.pointerAxis !== "horizontal") return;
      e.preventDefault(), e.stopPropagation();
      const a = Math.max(1, e.timeStamp - (this.lastPointerTime ?? e.timeStamp));
      this.horizontalVelocity = (e.clientX - (this.lastPointerX ?? e.clientX)) / a, this.lastPointerX = e.clientX, this.lastPointerTime = e.timeStamp, this.dragOffset = this.constrainDrag(t);
    }, this.onPointerUp = (e) => {
      if (e.stopPropagation(), this.dragStartX === void 0) return;
      const t = e.clientX - this.dragStartX, o = e.clientY - (this.dragStartY ?? e.clientY), a = this.pointerItemIndex ?? this.selectedIndex, r = this.pointerStartedOnItem, n = this.pointerAxis === "horizontal", i = this.pointerAxis === "vertical" || Math.abs(o) > Math.abs(t) * 1.15, l = Math.max(1, e.timeStamp - (this.lastPointerTime ?? e.timeStamp)), s = Math.abs(e.clientX - (this.lastPointerX ?? e.clientX)) > 0 ? (e.clientX - (this.lastPointerX ?? e.clientX)) / l : this.horizontalVelocity;
      if (this.clearHold(), this.resetPointer(), n && (Math.abs(t) >= 10 || Math.abs(s) >= 0.16)) {
        this.select(t > 0 || s > 0 ? -1 : 1);
        return;
      }
      if (this.holdFired) {
        this.holdFired = !1;
        return;
      }
      if (!n && !(i || Math.max(Math.abs(t), Math.abs(o)) >= 6) && r) {
        if (a !== this.selectedIndex) {
          this.selectIndex(a);
          return;
        }
        this.runItemAction(this.items[a], "tap");
      }
    }, this.cancelPointer = () => {
      this.clearHold(), this.holdFired = !1, this.resetPointer();
    }, this.onWheel = (e) => {
      const t = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      Math.abs(t) < 8 || (e.preventDefault(), this.select(t > 0 ? 1 : -1));
    }, this.onKeydown = (e) => {
      if (e.key === "ArrowLeft") this.select(-1);
      else if (e.key === "ArrowRight") this.select(1);
      else if (e.key === "Home") this.selectIndex(0);
      else if (e.key === "End") this.selectIndex(this.items.length - 1);
      else if (e.key === "Enter" || e.key === " ")
        this.runItemAction(this.items[this.selectedIndex], "tap");
      else return;
      e.preventDefault();
    };
  }
  willUpdate(e) {
    if (e.has("config")) {
      const t = this.items.length, o = Math.max(0, Math.round(this.config?.carousel_initial_index ?? 0));
      this.selectedIndex = t ? Math.min(o, t - 1) : 0;
    }
  }
  render() {
    const e = this.items;
    if (!e.length)
      return c`<div class="carousel"><span class="label">Add carousel items in the card editor</span></div>`;
    const t = this.visibleCount, o = e[this.selectedIndex], a = this.entityFor(o);
    return c`
      <div class=${`carousel ${this.grabCursor ? "grab-cursor" : ""} ${this.dragging ? "dragging" : ""}`}
        style=${`perspective:${Math.max(520, this.coverflowDepth * 2)}px`}
        role="listbox"
        aria-label="Entity carousel"
        tabindex="0"
        @keydown=${this.onKeydown}
        @wheel=${this.onWheel}
        @pointerdown=${this.onPointerDown}
        @pointermove=${this.onPointerMove}
        @pointerup=${this.onPointerUp}
        @pointercancel=${this.cancelPointer}>
        <div class="stage">
          ${e.map((r, n) => this.renderItem(r, n, t))}
        </div>
        ${this.config?.carousel_show_labels === !1 ? m : c`
          <div class="label">
            ${this.itemName(o, a)}
            ${this.showEntityState(a) ? c`<span class="state">${a?.state}</span>` : m}
          </div>
        `}
      </div>
    `;
  }
  renderItem(e, t, o) {
    const a = this.itemOffset(t), r = Math.abs(a), n = this.itemIsHidden(a, o), i = t === this.selectedIndex, l = this.entityFor(e), s = e.color || (l?.attributes.icon, "primary"), d = this.coverflowModifier, u = this.effect === "coverflow" ? this.coverflowStretch * d : 0, _ = Math.max(18, 58 + u), h = a + this.dragOffset / _, p = Math.abs(h), x = (this.centeredSlides ? 0 : -((o - 1) * _) / 2) + a * _ + this.dragOffset, b = this.effect === "coverflow" ? -p * this.coverflowDepth * d : 0, f = this.effect === "coverflow" ? h * -this.coverflowRotate * d : 0, k = Math.max(0.18, 1 - p * (this.effect === "coverflow" ? 0.16 : 0.08)), w = this.coverflowSlideShadows ? Math.min(0.48, p * 0.16 * Math.max(0.25, d)) : 0, T = [
      `transform:translateX(${x}px) translateZ(${b}px) rotateY(${f}deg)`,
      `z-index:${100 - r}`,
      `opacity:${k}`,
      `filter:saturate(${Math.max(0.45, 1 - r * 0.14)})`,
      `--carousel-color:var(--${s}-color, ${s})`,
      `--carousel-shadow-opacity:${w}`,
      `--carousel-shadow-angle:${h < 0 ? 270 : 90}deg`
    ].join(";"), F = e.icon_type === "entity-picture" ? l?.attributes.entity_picture : void 0, B = e.icon || l?.attributes.icon || "mdi:circle", J = l ? !Pn.has(l.state.toLowerCase()) : !1;
    return c`
      <button
        role="option"
        aria-selected=${i ? "true" : "false"}
        aria-label=${this.itemName(e, l)}
        class=${`${i ? "active" : ""} ${J ? "entity-active" : ""}`}
        data-shadow=${this.effect === "coverflow" && this.coverflowSlideShadows ? "true" : "false"}
        data-carousel-index=${t}
        style=${T}
        ?hidden=${n}
        >
        ${F ? c`<span class="picture" style=${`background-image:url("${String(F)}")`}></span>` : c`<ha-icon .icon=${B}></ha-icon>`}
      </button>
    `;
  }
  get items() {
    return this.config?.carousel_items ?? [];
  }
  get visibleCount() {
    const e = this.config?.carousel_slides_per_view ?? this.config?.parameters?.slidesPerView;
    if (e === "auto")
      return this.carouselWidth ? Math.min(11, Math.max(1, Math.floor((this.carouselWidth - 16) / 58))) : this.legacyVisibleCount;
    const t = Number(e);
    return Number.isFinite(t) && t > 0 ? Math.min(11, Math.max(1, Math.round(t))) : this.legacyVisibleCount;
  }
  get legacyVisibleCount() {
    const e = Math.round(this.config?.carousel_visible_items ?? 7);
    return Math.min(11, Math.max(3, e));
  }
  get effect() {
    return this.config?.carousel_effect ?? this.config?.parameters?.effect ?? "coverflow";
  }
  get grabCursor() {
    return this.config?.carousel_grab_cursor ?? this.config?.parameters?.grabCursor ?? !0;
  }
  get centeredSlides() {
    return this.config?.carousel_centered_slides ?? this.config?.parameters?.centeredSlides ?? !0;
  }
  get coverflowRotate() {
    return Number(this.config?.carousel_coverflow_rotate ?? this.config?.parameters?.coverflowEffect?.rotate ?? 0);
  }
  get coverflowStretch() {
    return Number(this.config?.carousel_coverflow_stretch ?? this.config?.parameters?.coverflowEffect?.stretch ?? 0);
  }
  get coverflowDepth() {
    return Math.max(0, Number(this.config?.carousel_coverflow_depth ?? this.config?.parameters?.coverflowEffect?.depth ?? 400));
  }
  get coverflowModifier() {
    return Math.max(0, Number(this.config?.carousel_coverflow_modifier ?? this.config?.parameters?.coverflowEffect?.modifier ?? 1));
  }
  get coverflowSlideShadows() {
    return this.config?.carousel_coverflow_slide_shadows ?? this.config?.parameters?.coverflowEffect?.slideShadows ?? !0;
  }
  entityFor(e) {
    return e.entity ? this.hass?.states[e.entity] : void 0;
  }
  itemName(e, t = this.entityFor(e)) {
    return e.name || t?.attributes.friendly_name || e.entity || "Carousel item";
  }
  showEntityState(e) {
    if (!e) return !1;
    const t = e.entity_id.split(".", 1)[0];
    return !["scene", "script", "button"].includes(t);
  }
  itemOffset(e) {
    let t = e - this.selectedIndex;
    if (this.config?.carousel_loop !== !1 && this.items.length > 2) {
      const o = this.items.length / 2;
      t > o && (t -= this.items.length), t < -o && (t += this.items.length);
    }
    return t;
  }
  itemIsHidden(e, t) {
    if (!this.centeredSlides) return e < 0 || e >= t;
    const o = Math.floor((t - 1) / 2), a = Math.ceil((t - 1) / 2);
    return e < -o || e > a;
  }
  firstUpdated() {
    const e = this.shadowRoot?.querySelector(".carousel");
    e && (this.carouselWidth = e.clientWidth, !(typeof ResizeObserver > "u") && (this.resizeObserver = new ResizeObserver(([t]) => {
      this.carouselWidth = t.contentRect.width;
    }), this.resizeObserver.observe(e)));
  }
  disconnectedCallback() {
    this.resizeObserver?.disconnect(), this.resizeObserver = void 0, super.disconnectedCallback();
  }
  select(e) {
    const t = this.items.length;
    if (!t) return;
    const o = this.selectedIndex + e;
    this.selectedIndex = this.config?.carousel_loop === !1 ? Math.min(t - 1, Math.max(0, o)) : (o + t) % t;
  }
  selectIndex(e) {
    this.selectedIndex = Math.min(this.items.length - 1, Math.max(0, e));
  }
  constrainDrag(e) {
    if (this.config?.carousel_loop !== !1) return e;
    const t = this.selectedIndex === 0 && e > 0, o = this.selectedIndex === this.items.length - 1 && e < 0;
    return t || o ? e * 0.28 : e;
  }
  resetPointer() {
    this.dragStartX = void 0, this.dragStartY = void 0, this.lastPointerX = void 0, this.lastPointerTime = void 0, this.horizontalVelocity = 0, this.pointerAxis = "pending", this.pointerItemIndex = void 0, this.pointerStartedOnItem = !1, this.dragOffset = 0, this.dragging = !1;
  }
  clearHold() {
    this.holdTimer !== void 0 && window.clearTimeout(this.holdTimer), this.holdTimer = void 0;
  }
  runItemAction(e, t) {
    if (!e) return;
    const a = (t === "tap" ? e.tap_action : e.hold_action) ?? {
      action: t === "tap" && e.entity ? "more-info" : "none"
    };
    he(this, "hass-action", {
      config: {
        type: this.config?.type,
        entity: e.entity,
        tap_action: t === "tap" ? a : void 0,
        hold_action: t === "hold" ? a : void 0
      },
      action: t
    });
  }
};
$e.styles = Le`
    :host { display: block; min-width: 0; }
    .carousel {
      position: relative;
      display: grid;
      place-items: center;
      min-height: 136px;
      overflow: hidden;
      perspective: 520px;
      touch-action: pan-y;
      user-select: none;
      outline: none;
    }
    .carousel.grab-cursor { cursor: grab; }
    .carousel.grab-cursor:active { cursor: grabbing; }
    .carousel.grab-cursor button { cursor: inherit; }
    .carousel.dragging button { transition: none; }
    .stage {
      position: relative;
      width: 100%;
      height: 104px;
      transform-style: preserve-3d;
    }
    button {
      position: absolute;
      top: 50%;
      left: 50%;
      display: grid;
      place-items: center;
      width: 58px;
      height: 58px;
      margin: -29px;
      padding: 0;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 18px;
      color: var(--primary-text-color);
      background:
        linear-gradient(145deg, color-mix(in srgb, var(--card-background-color) 92%, white 8%),
        color-mix(in srgb, var(--card-background-color) 86%, black 14%));
      box-shadow: 0 5px 16px rgb(0 0 0 / 28%);
      transition: transform 130ms cubic-bezier(.2,.8,.2,1), opacity 110ms ease, filter 110ms ease;
      cursor: pointer;
      transform-style: preserve-3d;
      will-change: transform;
    }
    button::after {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(
        var(--carousel-shadow-angle, 90deg),
        rgb(0 0 0 / var(--carousel-shadow-opacity, 0)),
        transparent 72%
      );
      content: "";
      pointer-events: none;
    }
    button[data-shadow="false"]::after { display: none; }
    button.active {
      color: var(--carousel-color, var(--primary-color));
      border-color: color-mix(in srgb, var(--carousel-color, var(--primary-color)) 55%, var(--divider-color));
      box-shadow:
        0 8px 22px rgb(0 0 0 / 38%),
        inset 0 0 0 1px color-mix(in srgb, var(--carousel-color, var(--primary-color)) 22%, transparent);
    }
    button.entity-active {
      background:
        linear-gradient(145deg,
          color-mix(in srgb, var(--carousel-color, var(--primary-color)) 28%, var(--card-background-color)),
          color-mix(in srgb, var(--carousel-color, var(--primary-color)) 12%, var(--card-background-color)));
    }
    button[hidden] { display: none; }
    ha-icon { --mdc-icon-size: 28px; pointer-events: none; }
    .picture {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: center / cover no-repeat;
      pointer-events: none;
    }
    .label {
      min-height: 20px;
      max-width: calc(100% - 24px);
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .state {
      margin-left: 6px;
      color: var(--secondary-text-color);
      font-weight: 400;
    }
  `;
Re([
  ue({ attribute: !1 })
], $e.prototype, "hass", 2);
Re([
  ue({ attribute: !1 })
], $e.prototype, "config", 2);
Re([
  oe()
], $e.prototype, "selectedIndex", 2);
Re([
  oe()
], $e.prototype, "carouselWidth", 2);
Re([
  oe()
], $e.prototype, "dragOffset", 2);
Re([
  oe()
], $e.prototype, "dragging", 2);
$e = Re([
  Qo("mushroom-addition-entity-carousel")
], $e);
const E = (e, t) => e?.attributes[t], N = (e) => {
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, qe = (e, t, o, a, r = "") => {
  if (e.config.icon_type === "none") return m;
  const n = e.config.icon_type === "entity-picture" ? E(e.entity, "entity_picture") : void 0;
  return n ? c`<span class="ulm-icon entity-picture ${r}" style=${`background-image:url("${String(n)}")`}></span>` : c`<span class="ulm-icon source-icon ${a ? "is-source-active" : ""} ${r}"
        style=${`--source-color:${o}`}>
        <ha-icon .icon=${e.config.icon || t}></ha-icon>
      </span>`;
}, He = (e, t) => {
  const o = v(e, t);
  return o ? e.hass.states[o] : void 0;
}, zn = (e, t) => {
  if (e === void 0) return "mdi:battery-off";
  if (e <= 0 && !t) return "mdi:battery-alert-variant-outline";
  if (e >= 100) return "mdi:battery";
  if (e <= 0) return `mdi:battery${t}-outline`;
  const o = Math.max(10, Math.min(90, Math.round(e / 10) * 10));
  return `mdi:battery${t}-${o}`;
}, Z = (e, t) => {
  const o = e.config[t];
  return typeof o == "string" ? e.hass.states[o] : void 0;
}, v = (e, ...t) => {
  for (const o of t)
    if (e.config[o] !== void 0) return e.config[o];
}, Ct = (e, t) => e.config.icon || e.entity?.attributes.icon || Qt(e.descriptor, e.entity) || t, ie = (e, t, o = "blue", a = "") => {
  if (e.config.icon_type === "none") return m;
  const r = e.config.icon_type === "entity-picture" ? E(e.entity, "entity_picture") : void 0;
  return r ? c`<span class="ulm-icon entity-picture ${a}" style=${`background-image:url("${String(r)}")`}></span>` : c`<span class="ulm-icon tone-${o} ${a}"><ha-icon .icon=${Ct(e, t)}></ha-icon></span>`;
}, Dn = (e, t) => {
  switch (e.config.secondary_info) {
    case "none":
      return;
    case "name":
      return le(e.config, e.entity, e.hass);
    case "state":
      return A(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    case "last-updated":
      return e.entity?.last_updated ? new Date(e.entity.last_updated).toLocaleString() : "Last updated unavailable";
    default:
      return e.config.secondary || t;
  }
}, Tn = (e, t) => {
  switch (e.config.primary_info) {
    case "none":
      return "";
    case "state":
      return A(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    case "last-updated":
      return e.entity?.last_updated ? new Date(e.entity.last_updated).toLocaleString() : "Last updated unavailable";
    default:
      return le(e.config, e.entity, e.hass) || t || "";
  }
}, On = (e, t, o) => {
  e.presentation.rendered = !0;
  const a = le(e.config, e.entity, e.hass), r = e.config.name !== void 0 && typeof e.config.name != "string";
  return {
    primary: (e.config.primary_info === void 0 ? r && a ? a : o ?? a : Tn(e, o)) || void 0,
    secondary: e.config.secondary_info === void 0 ? t : Dn(e, t)
  };
}, X = (e, t, o) => c`
  ${(() => {
  const a = On(e, t, o);
  return c`
  <span class="ulm-copy shared-presentation">
    ${a.primary ? c`<span class="ulm-name">${a.primary}</span>` : m}
    ${a.secondary ? c`<span class="ulm-label">${a.secondary}</span>` : m}
  </span>
    `;
})()}
`, Nn = (e, t = A(e.entity)) => c`
  <span class="value-first">${X(e, le(e.config, e.entity, e.hass), t)}</span>
`, mt = (e, t = A(e.entity), o = e.descriptor.name) => c`
  <div class="card-heading">
    ${ie(e, Qt(e.descriptor, e.entity))}
    ${X(e, t, o)}
  </div>
`, Vn = (e) => c`<div class="automatic-presentation">${mt(e)}</div>`, ae = (e, t, o, a = !1) => c`
  <button class="ulm-control" aria-label=${e} ?disabled=${a}
    @pointerdown=${(r) => r.stopPropagation()} @click=${o}>
    <ha-icon .icon=${t}></ha-icon>
  </button>
`, Ln = (e, t, o, a, r = !1) => {
  let n, i = !1;
  const l = () => {
    n !== void 0 && window.clearTimeout(n), n = void 0;
  };
  return c`
    <button class="ulm-control hold-control" aria-label=${e} ?disabled=${r}
      @pointerdown=${(s) => {
    s.stopPropagation(), i = !1, n = window.setTimeout(() => {
      i = !0, a();
    }, 500);
  }}
      @pointerup=${(s) => {
    s.stopPropagation(), l();
  }}
      @pointercancel=${l}
      @click=${(s) => {
    s.stopPropagation(), i || o(), i = !1;
  }}>
      ${t}
    </button>
  `;
}, de = (e, t, o, a = t.config.entity) => {
  e.stopPropagation(), he(e.currentTarget, "hass-action", {
    config: { type: t.config.type, entity: a, tap_action: o },
    action: "tap"
  });
}, Rn = {
  "clear-night": ["mdi:weather-night", "yellow"],
  cloudy: ["mdi:weather-cloudy", "blue"],
  fog: ["mdi:weather-fog", "grey"],
  hail: ["mdi:weather-hail", "blue"],
  lightning: ["mdi:weather-lightning", "yellow"],
  "lightning-rainy": ["mdi:weather-lightning-rainy", "blue"],
  partlycloudy: ["mdi:weather-partly-cloudy", "yellow"],
  pouring: ["mdi:weather-pouring", "blue"],
  rainy: ["mdi:weather-rainy", "blue"],
  snowy: ["mdi:weather-snowy", "blue"],
  "snowy-rainy": ["mdi:weather-snowy-rainy", "blue"],
  sunny: ["mdi:weather-sunny", "yellow"],
  windy: ["mdi:weather-windy", "grey"],
  exceptional: ["mdi:weather-sunny-alert", "red"]
}, Fn = (e) => {
  const t = N(e.entity?.state) ?? 0, o = !!E(e.entity, "is_charging") || String(e.entity?.state).includes("charging"), a = v(e, "ulm_card_battery_battery_level_danger") ?? 20, r = v(e, "ulm_card_battery_battery_level_warning") ?? 50, n = t < a ? "red" : t < r ? "yellow" : "green", i = v(e, "ulm_card_battery_charging_animation") === !0 && o;
  return e.actionSurface(`ulm-battery ${i ? "is-charging" : ""}`, c`
    ${ie(e, o ? "mdi:battery-charging" : "mdi:battery", n)}
    ${X(e, o ? "Charging" : "Battery level")}
    <span class="battery-value">${Math.round(t)}<small>%</small></span>
    <span class="battery-track"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>
  `);
}, jn = (e) => {
  const t = v(e, "ulm_card_battery_attribute"), o = t ? E(e.entity, t) : e.entity?.state, a = N(o), r = He(e, "ulm_card_battery_battery_state_entity_id"), n = He(e, "ulm_card_battery_charger_type_entity_id"), i = r?.state.toLowerCase() === "charging", l = n?.state.toLowerCase(), s = l === "wireless" ? "-charging-wireless" : i || ["charging", "ac", "usb"].includes(l ?? "") ? "-charging" : "", d = N(e.config.battery_warning_threshold) ?? v(e, "ulm_card_battery_battery_level_warning") ?? 50, u = N(e.config.battery_low_threshold) ?? v(e, "ulm_card_battery_battery_level_danger") ?? 20, _ = N(e.config.battery_critical_threshold) ?? 10, [h, p, y] = [_, u, d].map((k) => Math.max(0, Math.min(100, k))).sort((k, w) => k - w), x = a === void 0 || a <= h ? ce(
    e.config.battery_critical_color ?? v(e, "ulm_card_battery_color_battery_level_danger"),
    "var(--google-red, #f44336)"
  ) : a <= p ? ce(e.config.battery_low_color, "var(--google-orange, #ff9800)") : a <= y ? ce(
    e.config.battery_warning_color ?? v(e, "ulm_card_battery_color_battery_level_warning"),
    "var(--google-yellow, #fbc02d)"
  ) : ce(
    e.config.battery_healthy_color ?? v(e, "ulm_card_battery_color_battery_level_ok"),
    "var(--google-green, #43a047)"
  ), b = v(e, "ulm_card_battery_charging_animation") === !0 && i, f = a === void 0 ? A(e.entity) : `${Math.round(a)}%`;
  return e.actionSurface(`ulm-row ulm-default-battery ${b ? "is-charging" : ""}`, c`
    ${qe(e, zn(a, s), x, !0)}
    <span class="value-first">${X(e, le(e.config, e.entity, e.hass), f)}</span>
  `);
}, ce = hn, Bn = (e, t = !1, o = e.entity, a, r = a) => {
  const n = Array.isArray(E(o, "history")) ? E(o, "history").map(Number).filter(Number.isFinite).slice(-12) : [20, 28, 24, 42, 35, 52, 48, 63, 55, 70, 62, 78], i = Math.min(...n), l = Math.max(...n), s = n.map((_, h) => `${h / Math.max(1, n.length - 1) * 100},${36 - (_ - i) / Math.max(1, l - i) * 32}`).join(" "), d = `0,40 ${s} 100,40`;
  return c`<svg class="sparkline ${t ? "is-filled" : ""}" style=${""} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
    ${t ? c`<polygon points=${d}></polygon>` : m}
    <polyline points=${s}></polyline>
  </svg>`;
}, Hn = (e) => e.actionSurface("ulm-metric", c`
  <div class="metric-heading">${ie(e, e.descriptor.family === "energy" ? "mdi:flash" : "mdi:chart-line", "blue")}${X(e, e.entity?.attributes.unit_of_measurement ? String(e.entity.attributes.unit_of_measurement) : "Current value")}<span class="metric-value">${A(e.entity)}</span></div>
  ${e.config.show_graph !== !1 ? Bn(e) : m}
  ${Z(e, "min_entity") || Z(e, "max_entity") ? c`<div class="metric-extremes"><span>Min ${A(Z(e, "min_entity"))}</span><span>Max ${A(Z(e, "max_entity"))}</span></div>` : m}
`), Wn = (e, t, o) => {
  const a = o.navigation_path || o.nav_path;
  if (a) {
    de(e, t, { action: "navigate", navigation_path: a }, o.entity);
    return;
  }
  const r = o.tap_action, n = r?.service ?? r?.perform_action;
  if ((r?.action === "call-service" || r?.action === "perform-action") && n) {
    const [s, d] = n.split(".", 2);
    if (s && d) {
      t.service(s, d, {
        entity_id: o.entity,
        ...r.service_data ?? r.data ?? {}
      });
      return;
    }
  }
  const [i, l] = o.entity.split(".", 2);
  i === "scene" ? t.service("scene", "turn_on", { entity_id: o.entity }) : i === "media_player" ? t.service("media_player", "media_play_pause", { entity_id: o.entity }) : i === "input_select" ? t.service("input_select", "select_option", {
    entity_id: o.entity,
    option: o.state,
    ...o.service_data ?? {}
  }) : i === "script" ? t.service("script", l || "turn_on", { entity_id: o.entity, ...o.service_data ?? {} }) : t.service("homeassistant", "toggle", { entity_id: o.entity, ...o.service_data ?? {} });
}, Gn = (e) => {
  const t = (e.config.scene_items?.length ? e.config.scene_items : (e.config.entities?.length ? e.config.entities : e.config.entity ? [e.config.entity] : []).map((w) => ({ entity: w }))).filter((w) => w.entity), o = e.descriptor.upstreamId === "card_welcome_scenes", a = e.config.scene_buttons_only === !0;
  a && (e.presentation.rendered = !0);
  const r = e.descriptor.upstreamId === "card_scenes" && e.config.variant === "scene-grid", n = o ? 7 : r ? 5 : 6, i = o && t.length > n, l = o && e.sceneOverflowExpanded ? t : t.slice(0, n), s = e.config.collapse_entity ? e.hass.states[e.config.collapse_entity] : void 0, d = !a && (e.config.collapsed === !0 || s?.state === "on"), _ = Z(e, "weather_entity")?.state || "partlycloudy", h = Rn[_]?.[0] ?? "mdi:weather-partly-cloudy", p = (/* @__PURE__ */ new Date()).getHours(), y = e.hass.language?.split("-")[0] ?? "en", x = {
    de: ["Hallo", "Guten Morgen", "Guten Tag", "Guten Abend"],
    en: ["Hello", "Good morning", "Good afternoon", "Good evening"],
    es: ["Hola", "Buenos días", "Buenas tardes", "Buenas noches"],
    fr: ["Bonjour", "Bonjour", "Bon après-midi", "Bonsoir"],
    nl: ["Hallo", "Goedemorgen", "Goedemiddag", "Goedenavond"]
  }, b = x[y] ?? x.en, k = `${p >= 18 ? b[3] : p >= 12 ? b[2] : p >= 5 ? b[1] : b[0]}, ${e.hass.user?.name || "Home"}!`;
  return e.actionSurface(`ulm-scenes ${o ? "welcome-scenes" : r ? "source-scene-grid" : "scene-pills"} ${e.descriptor.upstreamId === "card_scenes" ? "ulm-source-scenes" : ""} ${a ? "scene-buttons-only" : ""}`, c`
    ${o && !a ? c`
      <div class="welcome-toolbar">
        <button class="welcome-toolbar-button" aria-label="Toggle scenes" @pointerdown=${(w) => w.stopPropagation()} @click=${(w) => {
    w.stopPropagation(), e.config.collapse_entity && e.service("input_boolean", "toggle", { entity_id: e.config.collapse_entity });
  }}><ha-icon .icon=${d ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon></button>
        <span class="welcome-date"><ha-icon .icon=${h}></ha-icon>${new Intl.DateTimeFormat(e.hass.language, { month: "short", day: "numeric" }).format(/* @__PURE__ */ new Date())}</span>
        <button class="welcome-toolbar-button" aria-label="Open dashboard settings" @pointerdown=${(w) => w.stopPropagation()} @click=${(w) => de(w, e, { action: "navigate", navigation_path: String(e.config.settings_path || "/config/dashboard") })}><ha-icon icon="mdi:cog-outline"></ha-icon></button>
      </div>
      <div class="welcome-heading">${X(e, k)}</div>
      ${d ? m : c`
        <div class="welcome-scenes-heading">
          <b>${e.config.secondary || "Scenes"}</b>
          ${i ? c`
            <button class="welcome-scenes-more"
              aria-label=${e.sceneOverflowExpanded ? "Show fewer scenes" : "Show all scenes"}
              aria-expanded=${e.sceneOverflowExpanded ? "true" : "false"}
              @pointerdown=${(w) => w.stopPropagation()}
              @click=${(w) => {
    w.stopPropagation(), e.toggleSceneOverflow();
  }}>
              <ha-icon .icon=${e.sceneOverflowExpanded ? "mdi:close" : "mdi:dots-vertical"}></ha-icon>
            </button>
          ` : m}
        </div>
      `}
    ` : m}
    ${d ? m : c`<div class="scene-grid">${l.map((w) => {
    const T = e.hass.states[w.entity], F = w.active_state ? T?.state === w.active_state : w.state ? T?.state === w.state : ge.has(T?.state ?? ""), B = ce(w.color, "rgb(var(--ulm-purple))"), J = w.icon_type === "entity-picture" ? E(T, "entity_picture") : void 0;
    return c`
      <button @pointerdown=${(Q) => Q.stopPropagation()} @click=${(Q) => {
      if (Q.stopPropagation(), r && !w.tap_action) {
        const L = w.entity.split(".", 1)[0];
        e.service(
          L === "automation" ? "automation" : "homeassistant",
          L === "automation" ? "trigger" : "turn_on",
          { entity_id: w.entity }
        );
      } else
        Wn(Q, e, w);
    }} style=${`--item-color:${B}`} class="scene-button ${F ? "is-active" : ""}">
        <i>${J ? c`<span class="scene-entity-picture" style=${`background-image:url("${String(J)}")`}></span>` : c`<ha-icon .icon=${w.icon || T?.attributes.icon || "mdi:palette"}></ha-icon>`}</i>
        <span>${w.name || w.label || le({ entity: w.entity }, T, e.hass)}</span>
      </button>`;
  })}</div>`}
  `);
}, Ro = (e) => {
  const t = v(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : E(e.entity, "entity_picture"), o = "mdi:sony-playstation", a = v(e, "ulm_card_media_player_player_controls_entity") || e.config.entity, r = a ? e.hass.states[a] : e.entity, n = a?.startsWith("media_player.") === !0, i = v(e, "ulm_card_media_player_collapsible") === !0 && (["off", "standby"].includes(e.entity?.state ?? "") || v(e, "ulm_card_media_player_idle_off") === !0 && e.entity?.state === "idle"), l = !i && (e.config.show_controls === !0 || v(e, "ulm_card_media_player_enable_controls") === !0), s = v(e, "ulm_card_media_player_enable_volume_adjust") || (E(r, "device_class") === "speaker" ? 0.05 : E(r, "device_class") === "tv" ? 0.01 : 0.025), d = Number(E(r, "volume_level") ?? 0), u = { action: "more-info" }, _ = ge.has(e.entity?.state ?? ""), h = ce(
    v(e, "ulm_card_media_player_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface(`ulm-media ${t ? "has-art" : ""} ${i ? "is-collapsed" : ""}`, c`
    ${t ? c`<span class="media-art" style=${`background-image:url("${String(t)}")`}></span>` : m}
    <div class="media-summary">
      ${qe(e, Ct(e, e.descriptor.upstreamId === "custom_card_playstation" ? o : "mdi:speaker"), h, _)}
      ${X(e, v(e, "ulm_card_media_player_more_info") === !0 ? [E(e.entity, "media_artist"), E(e.entity, "media_album_name")].filter(Boolean).join(" · ") || A(e.entity) : String(E(e.entity, "media_album_name") ?? E(e.entity, "media_artist") ?? A(e.entity)))}
    </div>
    ${v(e, "ulm_card_media_player_power_button") === !0 ? c`
      <div class="media-power">${ae("Toggle power", "mdi:power", (p) => {
    p.stopPropagation(), e.service("homeassistant", "toggle", { entity_id: e.config.entity });
  })}</div>
    ` : m}
    ${n && l ? c`<div class="ulm-controls media-controls">
      ${ae("Previous", "mdi:skip-previous", (p) => {
    p.stopPropagation(), e.service("media_player", "media_previous_track", { entity_id: a });
  })}
      ${ae(e.entity?.state === "playing" ? "Pause" : "Play", e.entity?.state === "playing" ? "mdi:pause" : "mdi:play", (p) => {
    p.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: a });
  })}
      ${ae("Next", "mdi:skip-next", (p) => {
    p.stopPropagation(), e.service("media_player", "media_next_track", { entity_id: a });
  })}
      ${ae("Sources", "mdi:playlist-music", (p) => de(p, e, u, a))}
    </div>` : m}
    ${n && !i && v(e, "ulm_card_media_player_enable_volume_slider") === !0 ? c`
      <input class="ulm-slider" type="range" min="0" max="100"
        aria-label="Volume"
        .value=${String(Math.round(d * 100))}
        @pointerdown=${(p) => p.stopPropagation()}
        @change=${(p) => e.service("media_player", "volume_set", {
    entity_id: a,
    volume_level: Number(p.target.value) / 100
  })}>
    ` : m}
    ${n && !i && v(e, "ulm_card_media_player_enable_volume_buttons") === !0 ? c`
      <div class="ulm-controls media-volume-buttons">
        ${ae("Mute or unmute", "mdi:volume-mute", (p) => {
    p.stopPropagation(), e.service("media_player", "volume_mute", {
      entity_id: a,
      is_volume_muted: E(r, "is_volume_muted") !== !0
    });
  })}
        ${ae("Volume down", "mdi:volume-minus", (p) => {
    p.stopPropagation(), e.service("media_player", "volume_set", {
      entity_id: a,
      volume_level: Math.max(0, d - s)
    });
  })}
        ${ae("Volume up", "mdi:volume-plus", (p) => {
    p.stopPropagation(), e.service("media_player", "volume_set", {
      entity_id: a,
      volume_level: Math.min(1, d + s)
    });
  })}
      </div>
    ` : m}
  `);
}, Un = (e) => {
  const t = e.entity?.state.startsWith("armed") || e.entity?.state === "locked";
  return e.actionSurface(`ulm-security ${t ? "is-armed" : ""}`, c`
    ${ie(e, t ? "mdi:shield-lock" : "mdi:shield-off", t ? "green" : "red")}
    ${X(e, A(e.entity))}
    ${e.config.show_controls ? c`<span class="security-status">${t ? "Secured" : "Attention"}</span>` : m}
  `);
}, qn = (e) => e.actionSurface("ulm-navigation", c`
  ${ie(e, e.descriptor.upstreamId.includes("back") ? "mdi:arrow-left" : "mdi:arrow-right", "blue")}
  ${X(e, e.config.secondary || e.config.navigation_path || "Navigate")}
  <ha-icon icon="mdi:chevron-right"></ha-icon>
`), Kn = (e, t) => {
  const o = e?.split(".", 1)[0] ?? "homeassistant";
  return o === "script" ? ["script", t === "on" ? "turn_on" : "turn_off"] : o === "fan" ? ["fan", t === "on" ? "turn_on" : "turn_off"] : o === "water_heater" ? ["water_heater", t === "on" ? "turn_on" : "turn_off"] : [o === "input_boolean" ? "input_boolean" : "homeassistant", t === "on" ? "turn_on" : "turn_off"];
}, Yn = (e) => {
  const t = v(
    e,
    "ulm_custom_card_washer_power",
    "ulm_card_power_outlet_entity",
    "ulm_card_power_entity"
  ), o = e.config.entity?.split(".", 1)[0], a = t || (["switch", "input_boolean", "light", "fan", "script", "water_heater"].includes(o ?? "") ? e.config.entity : void 0), r = a ? e.hass.states[a] : void 0, n = ge.has(r?.state ?? e.entity?.state ?? ""), i = Z(e, "graph_entity"), [l, s] = Kn(a, n ? "off" : "on");
  return e.actionSurface(`ulm-control-card ulm-row ${n ? "is-active" : ""}`, c`
    ${ie(e, e.config.entity?.startsWith("fan.") ? "mdi:fan" : "mdi:power-socket-eu", n ? "yellow" : "grey")}
    ${X(e, i ? `${A(e.entity)} · ${A(i)}` : A(e.entity))}
    ${a && e.config.show_controls !== !1 ? ae(n ? "Turn off" : "Turn on", "mdi:power", (d) => {
    d.stopPropagation(), e.service(l, s, { entity_id: a });
  }) : m}
  `);
}, Xn = (e) => {
  const t = (e.config.room_sensors !== void 0 ? e.config.room_sensors : (e.config.entities ?? []).map((l) => ({ entity: l }))).filter((l) => l.entity).slice(0, 4), o = Yr(e.config, e.hass), a = { ...e, config: { ...e.config, secondary_info: void 0 } }, r = e.config.room_light_entity ? e.hass.states[e.config.room_light_entity] : e.config.entity?.startsWith("light.") ? e.entity : void 0, n = e.config.ulm_card_dynamic_color === !0 ? oo(e.hass, r) : void 0, i = (e.config.room_status ?? []).slice(0, Ze).filter((l) => l.entity);
  return e.actionSurface(`ulm-room ulm-source-room ${n ? "dynamic-color" : ""} ${e.entity?.state === "unavailable" ? "is-unavailable" : ""}`, c`
    <div class="room-main">
      <div class="room-copy">${X(a, o)}
      ${i.length ? c`<div class="room-status" role="group" aria-label=${G(e.hass, "room_status")}>
        ${i.map((l) => {
    const s = e.hass.states[l.entity], d = l.kind && va.includes(l.kind) ? l.kind : ot(s), u = Me(s), _ = eo(s, d), h = `${le({ entity: l.entity }, s, e.hass)} · ${G(e.hass, `room_status_${d}`)}: ${G(e.hass, u ? "room_status_unavailable" : _ ? "room_status_active" : "room_status_inactive")} (${A(s)})`;
    return c`<button class="room-status-indicator kind-${d} ${u ? "is-unavailable" : _ ? "is-active" : "is-inactive"}"
            type="button" aria-label=${h} title=${h} ?disabled=${u}
            ${Te({ type: e.config.type, entity: l.entity, tap_action: { action: "more-info" } })}>
            <ha-icon .icon=${s?.attributes.icon || to(d, _)}></ha-icon>
          </button>`;
  })}
      </div>` : m}
      </div>
      <span class="ulm-icon tone-blue"><ha-icon .icon=${e.config.icon || "mdi:sofa-single"}></ha-icon></span>
      ${e.entity?.state === "unavailable" ? c`<span class="room-unavailable"><ha-icon icon="mdi:exclamation"></ha-icon></span>` : m}
    </div>
    ${t.length ? c`<div class="room-entities">${t.map((l) => {
    const s = e.hass.states[l.entity], d = at(e.hass, l.entity), u = !Me(s) && s?.state === (l.active_state || d.active_state), _ = ce(l.color, "rgb(var(--ulm-blue))"), h = l.icon_type === "entity-picture" ? E(s, "entity_picture") : void 0;
    return c`<button
        class="metric-pill room-sensor ${u ? "is-active" : ""}"
        type="button"
        ?disabled=${Me(s)}
        style=${`--item-color:${_}`}
        aria-label=${l.name || l.label || le({ entity: l.entity }, s, e.hass)}
        ${Te({
      type: e.config.type,
      entity: l.entity,
      tap_action: l.tap_action ?? d.tap_action,
      hold_action: l.hold_action ?? d.hold_action,
      double_tap_action: l.double_tap_action ?? d.double_tap_action
    })}
      >${h ? c`<span class="room-sensor-picture" style=${`background-image:url("${String(h)}")`}></span>` : c`<ha-icon .icon=${l.icon || wa(s, l.entity)}></ha-icon>`}<span class="room-sensor-label">${A(s)}</span></button>`;
  })}</div>` : m}
  `, n ? `--room-rgb:${n.join(",")};` : "");
}, ro = (e) => {
  const t = Object.entries(e.config).filter(([o, a]) => typeof a == "string" && a !== e.config.entity && /(_entity|_entity_id|_sensor|_power|_status|_level|_date|_time)$/i.test(o)).map(([, o]) => o);
  return [.../* @__PURE__ */ new Set([...e.config.entities ?? [], ...t])].map((o) => e.hass.states[o]).filter((o) => !!o).slice(0, 6);
}, Jn = (e, t, o = "blue") => {
  const a = ro(e);
  return e.actionSurface("ulm-detail-card", c`
    <div class="ulm-row">
      ${ie(e, t, o)}
      ${X(e, A(e.entity))}
    </div>
    ${a.length ? c`<div class="detail-grid">${a.map((r) => c`
      <span class="metric-pill"><ha-icon .icon=${r.attributes.icon ?? "mdi:circle-small"}></ha-icon>${A(r)}</span>
    `)}</div>` : m}
  `);
}, Zn = (e) => {
  const t = ro(e);
  return e.actionSurface("ulm-schedule-card", c`
    <div class="ulm-row">
      ${ie(e, /pollen/.test(e.descriptor.upstreamId) ? "mdi:flower-pollen" : "mdi:trash-can", "green")}
      ${X(e, A(e.entity))}
    </div>
    <div class="schedule-list">${(t.length ? t : e.entity ? [e.entity] : []).slice(0, 4).map((o) => c`
      <span><b>${le({ entity: o.entity_id }, o, e.hass)}</b><small>${A(o)}</small></span>
    `)}</div>
  `);
}, Qn = (e) => {
  const t = N(e.entity?.state), o = ro(e);
  return e.actionSurface("ulm-device-status", c`
    <div class="ulm-row">
      ${ie(e, /printer/.test(e.descriptor.upstreamId) ? "mdi:printer" : /nas/.test(e.descriptor.upstreamId) ? "mdi:nas" : /washer/.test(e.descriptor.upstreamId) ? "mdi:washing-machine" : "mdi:devices", t !== void 0 && t < 20 ? "red" : "blue")}
      ${X(e, A(e.entity))}
      ${t !== void 0 ? c`<b class="device-value">${Math.round(t)}${String(e.entity?.attributes.unit_of_measurement ?? "")}</b>` : m}
    </div>
    ${t !== void 0 ? c`<span class="device-progress"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>` : m}
    ${o.length ? c`<div class="detail-grid">${o.map((a) => c`<span class="metric-pill">${A(a)}</span>`)}</div>` : m}
  `);
}, ei = (e) => {
  const t = Z(e, "datetime_entity");
  return e.actionSurface(`ulm-control-card ulm-row ${ge.has(e.entity?.state ?? "") ? "is-active" : ""}`, c`
    ${ie(e, "mdi:alarm", ge.has(e.entity?.state ?? "") ? "yellow" : "grey")}
    ${X(e, A(t || e.entity))}
    ${e.config.show_controls !== !1 ? ae(ge.has(e.entity?.state ?? "") ? "Disable alarm" : "Enable alarm", "mdi:power", (o) => {
    o.stopPropagation(), e.service("input_boolean", ge.has(e.entity?.state ?? "") ? "turn_off" : "turn_on", { entity_id: e.config.entity });
  }) : m}
  `);
}, U = (e, ...t) => {
  const o = v(e, ...t), a = typeof o == "string" ? o : o && typeof o == "object" && "entity_id" in o && typeof o.entity_id == "string" ? o.entity_id : void 0;
  return a ? e.hass.states[a] : void 0;
}, ti = (e) => {
  const t = ze(e.config).filter((l) => l.enabled !== !1 && l.entity), o = /* @__PURE__ */ new Set([
    "",
    "unknown",
    "unavailable",
    "none",
    "no",
    "geen",
    "clear",
    "cleared",
    "null",
    "-",
    "n/a",
    "na",
    "nothing",
    "no collection",
    "no collections",
    "geen afval",
    "geen ophaling",
    "geen ophalingen"
  ]), a = (l, s) => {
    if (s !== !0 || !l) return;
    const d = e.hass.states[l]?.state?.trim();
    if (!d || o.has(d.toLowerCase())) return;
    const u = d.replaceAll("_", " ").replace(/\s+/g, " ");
    return u.charAt(0).toLocaleUpperCase(e.hass.language) + u.slice(1);
  }, r = a(e.config.today_entity, e.config.show_today), n = a(e.config.tomorrow_entity, e.config.show_tomorrow), i = (l) => {
    if (!l || ["unknown", "unavailable", "none", "geen"].includes(l.state.toLowerCase())) return "—";
    if (l.entity_id.startsWith("calendar.")) {
      const s = E(l, "start_time") ?? E(l, "start") ?? E(l, "end_time");
      if (typeof s == "string") {
        const d = new Date(s);
        if (!Number.isNaN(d.getTime()))
          return new Intl.DateTimeFormat(e.hass.language, { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
      }
    }
    return l.state;
  };
  return e.actionSurface("custom-waste-card", c`
    <div class="custom-card-heading">
      ${ie(e, "mdi:trash-can-outline", "green")}
      ${X(e, v(e, "ulm_volgende_ophaling") || [r ? `Today: ${r}` : "", n ? `Tomorrow: ${n}` : ""].filter(Boolean).join(" · ") || void 0, "Next collections")}
    </div>
    <div class="waste-grid">${t.map((l) => {
    const s = l.entity ? e.hass.states[l.entity] : void 0;
    return c`<span class="waste-row" style=${`--waste-color:${ce(l.color, "rgb(var(--rgb-green, 76, 175, 80))")}`}>
        <ha-icon .icon=${l.icon || "mdi:trash-can"}></ha-icon>
        <b>${l.label || s?.attributes.friendly_name || l.entity}</b>
        <small>${i(s)}</small>
      </span>`;
  })}</div>
  `);
}, oi = (e) => {
  const t = U(e, "ulm_card_alarm_time_datetime") ?? Z(e, "datetime_entity"), o = N(v(e, "ulm_card_alarm_time_step")) ?? 15, a = t?.state || "00:00:00", [r, n] = a.split(":").map(Number), i = (_) => {
    const h = ((r || 0) * 60 + (n || 0) + _ + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: t?.entity_id,
      time: `${String(Math.floor(h / 60)).padStart(2, "0")}:${String(h % 60).padStart(2, "0")}:00`
    });
  }, l = !t || ["unknown", "unavailable"].includes(t.state.toLowerCase()), s = v(e, "ulm_card_alarm_time_collapse") === !0 && !ge.has(e.entity?.state ?? ""), d = ge.has(e.entity?.state ?? ""), u = ce(
    v(e, "ulm_card_alarm_time_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface(`custom-alarm-time ${v(e, "ulm_card_alarm_time_horizontal") ? "is-horizontal" : ""}`, c`
    <div class="custom-card-heading">
      ${qe(e, v(e, "ulm_card_alarm_time_icon") || "mdi:alarm", u, d)}
      ${X(e, A(e.entity))}
    </div>
    ${s ? m : c`<div class="alarm-time-controls">
      ${ae(`Earlier by ${o} minutes`, "mdi:minus", (_) => {
    _.stopPropagation(), i(-o);
  }, l)}
      <b>${a.slice(0, 5)}</b>
      ${ae(`Later by ${o} minutes`, "mdi:plus", (_) => {
    _.stopPropagation(), i(o);
  }, l)}
    </div>`}
  `);
}, Fo = (e, t) => {
  const o = E(t, "entity_id");
  return Array.isArray(o) ? o.map(String).map((a) => e.hass.states[a]).filter((a) => !!a) : t ? [t] : [];
}, ai = (e) => {
  const t = (b) => U(e, b), o = t("temperature"), a = t("humidity"), r = {
    doors: t("group_doors"),
    windows: t("group_windows"),
    motions: t("group_motions"),
    water: t("group_water"),
    lights: t("group_lights"),
    shutters: t("group_windows_shutters"),
    outlets: t("group_outlets"),
    tv: t("group_tv")
  }, n = Object.values(r).flatMap((b) => Fo(e, b)).filter((b) => (N(E(b, "battery")) ?? 101) <= 20), i = (b) => Fo(e, b).filter((f) => f.state === "on" || f.state === "open").length, l = (b) => !b || ["unavailable", "unknown"].includes(b.state), s = (b) => {
    const f = e.hass.states[b], k = E(f, "entity_id"), T = (Array.isArray(k) ? k.map(String) : [b]).filter((F) => l(e.hass.states[F])).length;
    return Math.max(l(f) ? 1 : 0, T);
  }, d = (b) => ({
    type: e.config.type,
    entity: b,
    tap_action: { action: "more-info" }
  }), u = (b, f) => ({
    ...d(f),
    tap_action: e.config[`${b}_tap_action`] ?? { action: "more-info" },
    hold_action: e.config[`${b}_hold_action`] ?? { action: "more-info" },
    double_tap_action: e.config[`${b}_double_tap_action`] ?? { action: "toggle" }
  }), _ = e.config.temperature ? o : a, h = {
    ...e,
    entity: _,
    config: {
      type: e.config.type,
      entity: e.config.temperature ?? e.config.humidity,
      name: e.config.climate_name,
      icon: e.config.climate_icon,
      icon_type: e.config.climate_icon_type ?? "icon",
      primary_info: e.config.climate_primary_info ?? (e.config.climate_name ? "name" : "state"),
      secondary_info: e.config.climate_secondary_info,
      secondary: e.config.climate_secondary
    }
  }, p = [
    [e.config.group_doors, r.doors, "Doors", "mdi:door-open"],
    [e.config.group_windows, r.windows, "Windows", "mdi:window-open-variant"],
    [e.config.group_motions, r.motions, "Motion", "mdi:motion-sensor"],
    [e.config.group_water, r.water, "Water", "mdi:water"]
  ], y = [
    ["lights", e.config.group_lights, r.lights, "Lights", r.lights?.state === "on" ? "mdi:lightbulb-group" : "mdi:lightbulb-group-off"],
    ["shutters", e.config.group_windows_shutters, r.shutters, "Shutters", r.shutters?.state === "on" ? "mdi:window-shutter-open" : "mdi:window-shutter"],
    ["outlets", e.config.group_outlets, r.outlets, "Outlets", r.outlets?.state === "on" ? "mdi:power-plug" : "mdi:power-plug-off"],
    ["tv", e.config.group_tv, r.tv, "Television", r.tv?.state === "on" ? "mdi:television" : "mdi:television-off"]
  ], x = [...p.map(([b]) => b), ...y.map(([, b]) => b)].reduce((b, f) => b + (f ? s(f) : 0), 0);
  return e.actionSurface("custom-room-view", c`
    ${mt(e, A(e.entity), le(e.config, e.entity, e.hass))}
    ${e.config.temperature || e.config.humidity ? c`
        <button class="room-view-summary" aria-label="Climate · More information"
          ${Te(d(e.config.temperature ?? e.config.humidity))}>
          ${qe(h, _?.attributes.icon || "mdi:home-variant-outline", "var(--primary-color)", !1, "room-view-icon")}
          ${X(
    h,
    e.config.climate_secondary ?? (e.config.humidity && e.config.temperature ? A(a) : void 0)
  )}
        </button>
      ` : m}
      <div class="room-view-status" aria-label="Sensor status">
        ${p.map(([b, f, k, w]) => b && (i(f) || s(b)) ? c`
          <button class="room-view-indicator ${i(f) ? "is-active" : ""} ${s(b) ? "is-unavailable" : ""}"
            aria-label=${`${k}: ${s(b) ? "Unavailable" : A(f)} · More information`}
            title=${`${k}: ${s(b) ? "Unavailable" : A(f)}`}
            ${Te(d(b))}>
            <ha-icon .icon=${s(b) ? "mdi:alert-circle-outline" : w}></ha-icon>
            ${i(f) > 1 ? c`<i>${i(f)}</i>` : m}
          </button>` : m)}
        ${n.length ? c`
          <button class="room-view-indicator is-unavailable" aria-label="Low batteries"
            ${Te(d(n[0].entity_id))}>
            <ha-icon icon="mdi:battery-20"></ha-icon><i>${n.length}</i>
          </button>` : m}
        ${x ? c`<span class="room-view-warning" role="status" aria-label=${`${x} unavailable`} title=${`${x} unavailable`}><ha-icon icon="mdi:alert-circle-outline"></ha-icon></span>` : m}
        ${!p.some(([, b]) => i(b)) && !n.length && !x ? c`<span class="room-view-clear"><ha-icon icon="mdi:check"></ha-icon></span>` : m}
      </div>
      <div class="room-view-actions" aria-label="Device controls">
        ${y.map(([b, f, k, w, T]) => f ? c`
          <button class=${ge.has(k?.state ?? "") ? "is-active" : ""} aria-label=${w}
            ?disabled=${l(k)} ${Te(u(b, f))}>
            <ha-icon .icon=${l(k) ? "mdi:exclamation-thick" : T}></ha-icon>
            ${i(k) ? c`<i>${i(k)}</i>` : m}
          </button>` : m)}
      </div>
  `);
}, ri = (e) => {
  const t = U(e, "ulm_card_welcome_collapse"), o = U(e, "ulm_weather"), a = t?.state === "on", r = Array.from({ length: 5 }, (n, i) => i + 1).map((n) => ({
    nav: v(e, `nav_${n}`),
    icon: v(e, `icon_${n}`) || "mdi:circle",
    name: v(e, `name_${n}`) || `Item ${n}`,
    color: v(e, `color_${n}`) || "blue"
  })).filter((n) => n.nav);
  return e.actionSurface("custom-welcome", c`
    <div class="welcome-toolbar">
      <button aria-label="Toggle welcome navigation" ?disabled=${!t}
        @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => {
    n.stopPropagation(), t && e.service("input_boolean", "toggle", { entity_id: t.entity_id });
  }}>
        <ha-icon .icon=${a ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
      </button>
      <button aria-label="Weather information" ?disabled=${!o}
        @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => {
    o && de(n, e, { action: "more-info" }, o.entity_id);
  }}>
        <ha-icon icon="mdi:thermometer"></ha-icon>
      </button>
      <button aria-label="Dashboard settings" @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => de(n, e, { action: "navigate", navigation_path: "/config/dashboard" })}>
        <ha-icon icon="mdi:cog-outline"></ha-icon>
      </button>
    </div>
    <div class="welcome-greeting">${X(e, `Good ${(/* @__PURE__ */ new Date()).getHours() < 12 ? "morning" : (/* @__PURE__ */ new Date()).getHours() < 18 ? "afternoon" : "evening"}`)}</div>
    ${a ? m : c`<div class="welcome-items">${r.map((n) => c`
      <button class="tone-${n.color}" aria-label=${n.name}
        @pointerdown=${(i) => i.stopPropagation()}
        @click=${(i) => de(i, e, { action: "navigate", navigation_path: n.nav })}>
        <i><ha-icon .icon=${n.icon}></ha-icon></i><small>${n.name}</small>
      </button>
    `)}</div>`}
  `);
}, ni = (e) => {
  const t = U(e, "ulm_custom_card_room_overview_light_entity"), o = U(e, "ulm_custom_card_room_overview_climate_entity"), a = U(e, "ulm_custom_card_room_overview_cover_entity"), r = t?.state === "on", n = N(E(t, "brightness")), i = e.config.secondary || (t ? r && n ? `${Math.round(n / 2.55)}%` : A(t) : A(e.entity)), l = oo(e.hass, t), s = v(e, "ulm_card_dynamic_color") === !0 && l !== void 0, d = (_, h) => {
    h && de(_, e, { action: "toggle" }, h.entity_id);
  }, u = (_, h) => {
    const p = h === "light" ? v(e, r ? "ulm_card_room_overview_light_icon_on" : "ulm_card_room_overview_light_icon_off") || (r ? "mdi:lightbulb" : "mdi:lightbulb-off") : h === "cover" ? v(e, _.state === "closed" ? "ulm_card_room_overview_cover_icon_closed" : "ulm_card_room_overview_cover_icon_open") || (_.state === "closed" ? "mdi:roller-shade-closed" : "mdi:blinds-open") : { auto: "mdi:autorenew", cool: "mdi:snowflake", heat: "mdi:fire", dry: "mdi:water", heat_cool: "mdi:sun-snowflake", fan_only: "mdi:fan", off: "mdi:snowflake-off" }[_.state] ?? "mdi:thermostat";
    return c`<button class="room-overview-control ${h} state-${_.state}" aria-label=${le({ entity: _.entity_id }, _, e.hass)}
      ?disabled=${_.state === "unavailable"} @pointerdown=${(y) => y.stopPropagation()} @click=${(y) => d(y, _)}>
      <ha-icon .icon=${p}></ha-icon>
    </button>`;
  };
  return e.actionSurface(`custom-room-overview ${s ? "dynamic-color" : ""}`, c`
    <div class="room-overview-main">
      ${ie(e, "mdi:sofa", r ? "yellow" : "grey")}
      ${X(e, i)}
    </div>
    <div class="room-overview-controls">
      ${t ? u(t, "light") : m}
      ${a ? u(a, "cover") : o ? u(o, "climate") : m}
    </div>
  `, s ? `--room-rgb:${l.join(",")};` : "");
}, ii = (e) => {
  const t = U(e, "washer_power_entity") ?? U(e, "power_entity") ?? U(e, "ulm_custom_card_washer_power"), o = U(e, "ulm_custom_card_washer_machine_state") ?? e.entity, a = U(e, "ulm_custom_card_washer_job_progress"), r = U(e, "program_stage_entity") ?? U(e, "ulm_custom_card_washer_job_state") ?? o, n = U(e, "ulm_custom_card_washer_remote_control"), i = U(e, "ulm_custom_card_washer_delayed_start"), l = U(e, "ulm_custom_card_washer_delayed_starttime"), s = U(e, "door_entity"), d = U(e, "finished_entity"), u = v(e, "ulm_custom_card_washer_machine_stop_state") ?? "stop", _ = t ? !["off", "unavailable", "unknown", "0"].includes(t.state.toLowerCase()) : o ? !["off", "unavailable", "unknown"].includes(o.state.toLowerCase()) : !0, h = !o || o.state === u || o.state === "off", p = ["true", "on", "enabled"].includes(n?.state.toLowerCase() ?? ""), y = i?.state === "on", x = Math.max(0, Math.min(100, N(a?.state) ?? 0)), b = v(
    e,
    "ulm_custom_card_washer_job_states"
  ), f = Object.values(b ?? {
    state1: { name: "weightSensing", icon: "mdi:scale" },
    state2: { name: "wash", icon: "mdi:waves" },
    state3: { name: "rinse", icon: "mdi:water" },
    state4: { name: "spin", icon: "mdi:fan" }
  }).filter((O) => O.name && O.icon).slice(0, 5), k = f.findIndex((O) => O.name?.toLowerCase() === r?.state.toLowerCase()), w = _ ? h ? p && y ? v(e, "ulm_custom_card_washer_label_configuring") ?? "configure" : v(e, "ulm_custom_card_washer_label_idle") ?? "idle" : v(e, "ulm_custom_card_washer_label_running") ?? "run" : v(e, "ulm_custom_card_washer_label_idle") ?? "idle", T = (O) => v(e, O) ?? { action: "none" }, F = (O, ee) => de(O, e, ee, typeof ee.entity == "string" ? ee.entity : e.config.entity), B = l?.state.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)?.slice(1).map(Number), J = (O, ee) => {
    if (O.stopPropagation(), !l || !B) return;
    const j = ((B[0] * 60 + B[1] + ee) % 1440 + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: l.entity_id,
      time: `${String(Math.floor(j / 60)).padStart(2, "0")}:${String(j % 60).padStart(2, "0")}:00`
    });
  }, Q = T(h ? "ulm_custom_card_washer_start_action" : "ulm_custom_card_washer_pause_action"), L = T("ulm_custom_card_washer_stop_action");
  return e.actionSurface("custom-washer", c`
    <div class="custom-card-heading washer-heading">
      ${ie(e, "mdi:washing-machine", _ ? "blue" : "grey")}
      ${X(e, w)}
      ${t ? c`<b class="washer-power">${A(t)}</b>` : m}
    </div>
    ${_ && f.length ? c`
      <div class="washer-stages" style=${`--washer-stage-count:${f.length}`}>
        ${f.map((O, ee) => c`
          <span class=${k === ee ? "is-active" : ""} title=${O.name ?? ""}>
            <ha-icon .icon=${O.icon}></ha-icon>
          </span>
        `)}
      </div>
    ` : m}
    ${_ && a ? c`
      <div class="washer-progress">
        <span style=${`width:${x}%`}></span>
        <b>${Math.round(x)}%</b>
      </div>
    ` : m}
    ${_ && p ? c`
      <div class="washer-controls">
        ${ae(
    h ? "Start washer" : "Pause washer",
    h ? "mdi:play" : "mdi:pause",
    (O) => F(O, Q),
    Q.action === "none"
  )}
        ${ae(
    "Stop washer",
    "mdi:stop",
    (O) => F(O, L),
    h || L.action === "none"
  )}
        ${i ? ae(
    y ? "Disable delayed start" : "Enable delayed start",
    "mdi:alarm",
    (O) => de(O, e, { action: "toggle" }, i.entity_id),
    !h
  ) : m}
      </div>
    ` : m}
    ${_ && p && y && l ? c`
      <div class="washer-delay-controls">
        ${ae("Move delayed start 15 minutes earlier", "mdi:arrow-down", (O) => J(O, -15))}
        <button class="washer-delay-time" aria-label="Move delayed start 1 minute later"
          @pointerdown=${(O) => O.stopPropagation()}
          @click=${(O) => J(O, 1)}>${l.state}</button>
        ${ae("Move delayed start 15 minutes later", "mdi:arrow-up", (O) => J(O, 15))}
      </div>
    ` : m}
    ${s || d || n ? c`
      <div class="washer-status">
        ${s ? c`<span><ha-icon icon="mdi:door"></ha-icon>${A(s)}</span>` : m}
        ${d ? c`<span><ha-icon icon="mdi:check-circle"></ha-icon>${A(d)}</span>` : m}
        ${n ? c`<span><ha-icon icon="mdi:remote"></ha-icon>${A(n)}</span>` : m}
      </div>
    ` : m}
  `);
}, we = (e, t, o) => He(e, t) ?? Object.values(e.hass.states).find((a) => String(E(a, "metric") ?? "").toLowerCase() === o && ["moon", "sky"].includes(String(E(a, "body") ?? "").toLowerCase())), jo = (e, t, o) => {
  const a = e === void 0 ? 180 : (e % 360 + 360) % 360, r = Math.max(-90, Math.min(90, t ?? 0)), n = a / 360 * 100, i = 62 / 90 * 100, l = r >= 0 ? i - r / 90 * (i - 4) : i + Math.abs(r) / 90 * (96 - i);
  return `--${o}-x:${n.toFixed(2)}%;--${o}-y:${l.toFixed(2)}%`;
}, Bo = (e) => ({
  new_moon: "mdi:moon-new",
  waxing_crescent: "mdi:moon-waxing-crescent",
  first_quarter: "mdi:moon-first-quarter",
  waxing_gibbous: "mdi:moon-waxing-gibbous",
  full_moon: "mdi:moon-full",
  waning_gibbous: "mdi:moon-waning-gibbous",
  last_quarter: "mdi:moon-last-quarter",
  waning_crescent: "mdi:moon-waning-crescent"
})[e] ?? "mdi:moon-waning-crescent", si = (e) => {
  const t = E(e.entity, "next_rising"), o = E(e.entity, "next_setting"), a = E(e.entity, "next_dawn") ?? t, r = E(e.entity, "next_noon"), n = E(e.entity, "next_dusk") ?? o, i = v(e, "language") || e.hass.language || "en", l = v(e, "timeFormat") === "12h", s = (j) => {
    const te = new Date(String(j ?? ""));
    return Number.isNaN(te.getTime()) ? "—" : new Intl.DateTimeFormat(i, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: l
    }).format(te);
  }, d = N(E(e.entity, "elevation")), u = N(E(e.entity, "azimuth")), _ = v(e, "title"), h = He(e, "moon_entity") ?? e.hass.states["sensor.moon"] ?? Object.values(e.hass.states).find((j) => String(E(j, "device_class") ?? "") === "enum" && `${j.entity_id} ${String(E(j, "friendly_name") ?? "")}`.toLowerCase().includes("moon")), p = we(e, "moon_altitude_entity", "altitude"), y = we(e, "moon_azimuth_entity", "azimuth"), x = He(e, "moon_rising_entity") ?? we(e, "moon_rising_entity", "next_rising") ?? we(e, "moon_rising_entity", "moonrise"), b = He(e, "moon_setting_entity") ?? we(e, "moon_setting_entity", "next_setting") ?? we(e, "moon_setting_entity", "moonset"), f = we(e, "moon_next_full_moon_entity", "next_full_moon"), k = we(e, "moon_next_new_moon_entity", "next_new_moon"), w = we(e, "moon_above_horizon_entity", "is_moon_above_horizon"), T = [
    h,
    p,
    y,
    x,
    b,
    f,
    k,
    w
  ], F = v(e, "showMoon") !== !1 && T.some(Boolean), B = (j, te = 2) => {
    if (!j || ["unknown", "unavailable"].includes(j.state)) return "—";
    const ne = N(j.state);
    if (ne === void 0) return A(j);
    const me = String(E(j, "unit_of_measurement") ?? "");
    return `${new Intl.NumberFormat(i, { maximumFractionDigits: te }).format(ne)}${me ? ` ${me}` : ""}`;
  }, J = (j) => {
    if (!j || ["unknown", "unavailable"].includes(j.state)) return "—";
    const te = new Date(j.state);
    return Number.isNaN(te.getTime()) ? A(j) : new Intl.DateTimeFormat(i, { day: "numeric", month: "short", year: "numeric" }).format(te);
  }, Q = h?.state ?? "unknown", L = N(p?.state), O = N(y?.state), ee = w ? ["on", "true", "above_horizon"].includes(w.state.toLowerCase()) : (L ?? -1) >= 0;
  return e.actionSurface(`custom-sun-card ${v(e, "darkMode") ? "is-dark" : ""}`, c`
    ${_ ? c`<b class="sun-title">${_}</b>` : m}
    <div class="astronomy-times">
      <span><small>Sunrise</small><b>${s(t)}</b></span>
      <span><small>Moonrise</small><b>${s(x?.state)}</b></span>
      <span><small>Moonset</small><b>${s(b?.state)}</b></span>
      <span><small>Sunset</small><b>${s(o)}</b></span>
    </div>
    <div class="sun-arc astronomy-arc">
      <svg viewBox="0 0 300 90" preserveAspectRatio="none"><path class="sun-night" d="M0,62 Q60,115 105,62"></path><path class="sun-day" d="M0,62 Q150,-45 300,62"></path><line x1="0" y1="62" x2="300" y2="62"></line></svg>
      <span class="sun-marker" style=${jo(u, d, "sun")}></span>
      ${F && (p || y) ? c`
        <span class=${`moon-marker astronomy-moon-marker ${ee ? "is-above" : "is-below"}`}
          style=${jo(O, L, "moon")}>
          <ha-icon .icon=${Bo(Q)}></ha-icon>
        </span>
      ` : m}
    </div>
    <div class="sun-footer"><span><small>Dawn</small><b>${s(a)}</b></span><span><small>Solar noon</small><b>${s(r)}</b></span><span><small>Dusk</small><b>${s(n)}</b></span></div>
    <div class="astronomy-position-rows">
      <div>
        <b>Sun:</b>
        <span>Azimuth <strong>${u ?? "—"}°</strong></span>
        <span>Elevation <strong>${d ?? "—"}°</strong></span>
      </div>
      ${F ? c`
        <div>
          <b>Moon:</b>
          <span>Azimuth <strong>${B(y)}</strong></span>
          <span>Elevation <strong>${B(p)}</strong></span>
        </div>
      ` : m}
    </div>
    ${F ? c`
      <section class="moon-section">
        <div class="moon-heading">
          <span class="moon-symbol"><ha-icon .icon=${Bo(Q)}></ha-icon></span>
          <span class="moon-copy">
            <b>Moon</b>
            <small>${A(h)} · ${ee ? "Above horizon" : "Below horizon"}</small>
          </span>
        </div>
        <div class="moon-metrics">
          ${f ? c`<span class="moon-metric"><ha-icon .icon=${"mdi:moon-full"}></ha-icon><span><small>Next full Moon</small><b>${J(f)}</b></span></span>` : m}
          ${k ? c`<span class="moon-metric"><ha-icon .icon=${"mdi:moon-new"}></ha-icon><span><small>Next new Moon</small><b>${J(k)}</b></span></span>` : m}
        </div>
      </section>
    ` : m}
  `);
}, li = (e) => {
  const t = !!(e.entity && !["unavailable", "unknown"].includes(e.entity.state)), a = (t ? e.entity.state : "00:00:00").split(" ").at(-1) || "00:00:00", [r, n] = a.split(":").map(Number), i = (l) => {
    const s = ((r || 0) * 60 + (n || 0) + l + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: e.config.entity,
      time: `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:00`
    });
  };
  return e.actionSurface("custom-input-datetime", c`
    <div class="custom-card-heading">${ie(e, "mdi:calendar-clock", "green")}${X(e, A(e.entity))}</div>
    <div class="input-datetime-controls">
      ${ae("15 minutes earlier", "mdi:arrow-down", (l) => {
    l.stopPropagation(), i(-15);
  }, !t)}
      ${Ln(
    "One minute later; hold for one minute earlier",
    c`<b>${t ? a.slice(0, 5) : "Unavailable"}</b>`,
    () => i(1),
    () => i(-1),
    !t
  )}
      ${ae("15 minutes later", "mdi:arrow-up", (l) => {
    l.stopPropagation(), i(15);
  }, !t)}
    </div>
  `);
}, ci = (e) => {
  const t = [1, 2, 3, 4].map((i) => U(e, `ulm_custom_card_weather_metrics_entity_${i}`) ?? (e.config.entities?.[i - 1] ? e.hass.states[e.config.entities[i - 1]] : void 0)), o = Z(e, "temperature_entity"), a = Z(e, "date_entity") ?? U(e, "ulm_custom_card_weather_metrics_date"), r = e.entity?.state || "unknown", n = {
    "clear-night": "🌙",
    cloudy: "☁️",
    exceptional: "🌞",
    fog: "🌫️",
    hail: "⛈️",
    lightning: "⚡",
    "lightning-rainy": "⛈️",
    partlycloudy: "⛅",
    pouring: "🌧️",
    rainy: "💧",
    snowy: "❄️",
    "snowy-rainy": "🌨️",
    sunny: "☀️",
    windy: "🌪️"
  };
  return e.actionSurface("custom-weather-metrics", c`
    <div class="weather-metrics-panel">
      <b class="weather-date">${n[r] || "❔"} ${a ? A(a) : "Date unavailable"}</b>
      <strong>${o ? A(o) : `${E(e.entity, "temperature") ?? "—"}°`}</strong>
    </div>
    <div class="metrics-four">${t.map((i, l) => c`
      <button ?disabled=${!i} @pointerdown=${(s) => s.stopPropagation()}
        @click=${(s) => i && de(s, e, { action: "more-info" }, i.entity_id)}>
        <b>${A(i)}</b>
        <small>${v(e, `ulm_custom_card_weather_metrics_name_${l + 1}`) || (i ? le({ entity: i.entity_id }, i, e.hass) : `Weather ${l + 1}`)}</small>
      </button>
    `)}</div>
  `);
}, di = (e) => {
  const t = e.entity?.state, o = !e.entity || t === "unavailable" || t === "unknown", a = e.config.collapsible_controls === !0 && (o || t === "off"), r = (M) => M.stopPropagation(), n = E(e.entity, "supported_features"), i = (M) => n === void 0 || (Number(n) & M) !== 0, l = e.config.volume_controls ?? ["volume_buttons"], s = e.config.media_controls ?? ["play_pause_stop"], d = (M, P = {}) => {
    o || e.service("media_player", M, { entity_id: e.config.entity, ...P });
  }, u = (M, P, $, H) => ae(M, P, (C) => {
    r(C), d($, H);
  }, o), _ = t === "off" || o, h = s.includes("on_off") && i(_ ? pe.turnOn : pe.turnOff) ? u(_ ? "Turn on" : "Turn off", "mdi:power", _ ? "turn_on" : "turn_off") : m, p = t === "playing", y = n === void 0 ? "media_play_pause" : p && i(pe.pause) ? "media_pause" : !p && i(pe.play) ? "media_play" : i(pe.stop) ? "media_stop" : void 0, x = s.includes("play_pause_stop") && y ? u(
    y === "media_stop" ? "Stop" : n === void 0 ? "Play or pause" : p ? "Pause" : "Play",
    y === "media_stop" ? "mdi:stop" : p ? "mdi:pause" : "mdi:play",
    y
  ) : m, b = l.includes("volume_buttons") && i(pe.volumeStep | pe.volumeSet), f = String(E(e.entity, "repeat") ?? "off"), k = f === "off" ? "all" : f === "all" ? "one" : "off", w = E(e.entity, "is_volume_muted") === !0, T = v(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : E(e.entity, "entity_picture"), F = Math.round(Math.max(0, Math.min(1, N(E(e.entity, "volume_level")) ?? 0)) * 100), B = E(e.entity, "source"), J = ["idle", "paused", "unavailable", "unknown"].includes(t ?? "") ? A(e.entity) : `${B ? String(B) : A(e.entity)} • ${F}%`, Q = e.config.use_media_info ? E(e.entity, "media_title") : void 0, L = e.config.use_media_info ? E(e.entity, "media_artist") : void 0, O = e.config.show_volume_level === void 0 && !e.config.use_media_info ? J : [
    L ? String(L) : Q ? void 0 : B ? String(B) : A(e.entity),
    e.config.show_volume_level !== !1 ? `${F}%` : void 0
  ].filter(Boolean).join(" • "), ee = Xt(e.hass, e.config.entity, e.config), j = na.flatMap((M) => {
    const P = ee[M.configKey], $ = P ? e.hass.states[P] : void 0;
    return $ ? [{ control: M, entity: $ }] : [];
  }), te = ia.flatMap((M) => {
    const P = ee[M.configKey], $ = P ? e.hass.states[P] : void 0;
    return $ ? [{ control: M, entity: $ }] : [];
  }), ne = (e.config.shortcuts?.buttons ?? []).filter((M) => typeof M.id == "string" && M.id.trim().length > 0), me = Math.min(8, Math.max(1, Math.round(e.config.shortcuts?.columns ?? 4))), S = v(e, "sonos_details_always_visible") === !0, V = c`
    ${j.length ? c`<div class="sonos-switches">
      ${j.map(({ control: M, entity: P }) => c`
        <button class=${P.state === "on" ? "is-active" : ""} aria-pressed=${P.state === "on"}
          ?disabled=${o || ["unavailable", "unknown"].includes(P.state)}
          @click=${($) => {
    $.stopPropagation(), !o && !["unavailable", "unknown"].includes(P.state) && e.service("homeassistant", "toggle", { entity_id: P.entity_id });
  }}>
          <ha-icon .icon=${M.icon}></ha-icon>
          <span>${M.label}</span>
        </button>
      `)}
    </div>` : m}
    ${te.length ? c`<div class="sonos-sliders">
      ${te.map(({ control: M, entity: P }) => {
    const $ = N(P.state) ?? 0, H = N(E(P, "min")) ?? -100, C = N(E(P, "max")) ?? 100, W = N(E(P, "step")) ?? 1;
    return c`
          <label>
            <ha-icon .icon=${M.icon}></ha-icon>
            <span>${M.label}</span>
            <input type="range" min=${H} max=${C} step=${W} .value=${String($)}
              ?disabled=${o || ["unavailable", "unknown"].includes(P.state)}
              aria-label=${M.label}
              @change=${(_e) => {
      _e.stopPropagation(), !(o || ["unavailable", "unknown"].includes(P.state)) && e.service("number", "set_value", {
        entity_id: P.entity_id,
        value: Number(_e.currentTarget.value)
      });
    }}>
            <output>${$}</output>
          </label>
        `;
  })}
    </div>` : m}
  `;
  return e.actionSurface(`custom-sonos ${T ? "has-art" : ""}`, c`
    ${T ? c`<span class="media-art" style=${`background-image:url("${String(T)}")`}></span>` : m}
    <div class="custom-card-heading">
      ${ie(e, "mdi:speaker", e.entity?.state === "playing" ? "green" : "grey")}
      ${X(e, O, Q && !e.config.name ? String(Q) : void 0)}
    </div>
    <div class="sonos-controls"
      @pointerdown=${r} @pointerup=${r} @pointercancel=${r}
      @click=${r} @dblclick=${r} @keydown=${r} @keyup=${r}>
      ${h}
      ${a ? m : c`
        ${l.includes("volume_mute") && i(pe.volumeMute) ? c`<button class="ulm-control" aria-label=${w ? "Unmute" : "Mute"} aria-pressed=${w}
              ?disabled=${o} @click=${() => d("volume_mute", { is_volume_muted: !w })}>
              <ha-icon .icon=${w ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon>
            </button>` : m}
        ${b ? u("Volume down", "mdi:volume-minus", "volume_down") : m}
        ${s.includes("shuffle") && i(pe.shuffle) ? c`<button class="ulm-control" aria-label="Shuffle" aria-pressed=${E(e.entity, "shuffle") === !0}
              ?disabled=${o} @click=${() => d("shuffle_set", { shuffle: E(e.entity, "shuffle") !== !0 })}>
              <ha-icon icon="mdi:shuffle"></ha-icon>
            </button>` : m}
        ${s.includes("previous") && i(pe.previous) ? u("Previous track", "mdi:skip-previous", "media_previous_track") : m}
        ${x}
        ${s.includes("next") && i(pe.next) ? u("Next track", "mdi:skip-next", "media_next_track") : m}
        ${s.includes("repeat") && i(pe.repeat) ? u(
    `Repeat: ${f}`,
    f === "one" ? "mdi:repeat-once" : f === "off" ? "mdi:repeat-off" : "mdi:repeat",
    "repeat_set",
    { repeat: k }
  ) : m}
        ${b ? u("Volume up", "mdi:volume-plus", "volume_up") : m}
        ${l.includes("volume_set") && i(pe.volumeSet) ? c`<label class="sonos-volume">
              <input type="range" min="0" max="100" step="1" .value=${String(F)}
                aria-label="Volume level" ?disabled=${o}
                @change=${(M) => {
    r(M), d("volume_set", {
      volume_level: Math.max(0, Math.min(100, Number(M.currentTarget.value))) / 100
    });
  }}>
              <output>${F}%</output>
            </label>` : m}
      `}
    </div>
    ${!a && (j.length || te.length) ? c`
      ${S ? c`<div class="sonos-details sonos-details-always-visible"
            @pointerdown=${(M) => M.stopPropagation()}
            @click=${r} @dblclick=${r} @keydown=${r} @keyup=${r}
            @pointerup=${r} @pointercancel=${r}>
            ${V}
          </div>` : c`<details class="sonos-details" @pointerdown=${(M) => M.stopPropagation()}
            @click=${r} @dblclick=${r} @keydown=${r} @keyup=${r}
            @pointerup=${r} @pointercancel=${r}>
            <summary>
              <span>More details</span>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </summary>
            ${V}
          </details>`}
    ` : m}
    ${!a && ne.length ? c`
      <div class="sonos-shortcuts" style=${`--sonos-shortcut-columns:${me}`}
        @pointerdown=${r} @pointerup=${r} @pointercancel=${r}
        @click=${r} @dblclick=${r} @keydown=${r} @keyup=${r}>
        ${ne.map((M, P) => c`
          <button
            aria-label=${M.name || `Play shortcut ${P + 1}`}
            title=${M.name || M.id || ""}
            ?disabled=${o}
            @click=${($) => {
    $.stopPropagation(), !o && e.service("media_player", "play_media", {
      entity_id: e.config.entity,
      media_content_type: M.type || "playlist",
      media_content_id: M.id
    });
  }}>
            <ha-icon .icon=${M.icon || "mdi:playlist-music"}></ha-icon>
            ${M.name ? c`<span>${M.name}</span>` : m}
          </button>
        `)}
      </div>
    ` : m}
  `);
}, ui = (e) => {
  const t = [
    Z(e, "black_entity"),
    Z(e, "yellow_entity"),
    Z(e, "magenta_entity"),
    Z(e, "cyan_entity")
  ], o = ["#111", "#faff00", "#f800ff", "#00ffff"];
  return e.actionSurface("custom-printer", c`
    <div class="custom-card-heading">
      ${ie(e, "mdi:printer", e.entity?.state === "idle" ? "grey" : "blue")}
      ${X(e, A(e.entity))}
    </div>
    <div class="toner-bars">${t.map((a, r) => {
    if (!a) return m;
    const n = Math.max(0, Math.min(100, N(a.state) ?? 0));
    return c`<span style=${`--toner:${o[r]};--level:${n}%`}><i><em></em><b>${A(a)}</b></i></span>`;
  })}</div>
  `);
}, mi = (e) => {
  const t = Z(e, "disk_entity") ?? U(e, "entity_4"), o = Z(e, "temperature_entity") ?? U(e, "entity_1"), a = Z(e, "memory_entity") ?? U(e, "entity_2"), r = Z(e, "cpu_entity") ?? U(e, "entity_3"), n = !["off", "unavailable", "unknown"].includes(e.entity?.state ?? ""), i = (h, p) => ce(
    v(e, h),
    ce(p, p)
  ), l = (h) => !!v(e, h), s = (h) => {
    const p = e.config[h];
    return p && typeof p == "object" && "max_value" in p ? N(p.max_value) : void 0;
  }, d = (h, p, y, x = 100) => {
    const b = Math.max(0, Math.min(x, N(h?.state) ?? 0)), f = 2 * Math.PI * p, k = f * (1 - b / x);
    return q`<circle class="nas-metrics-ring-value" cx="70" cy="70" r=${p}
      fill="none" stroke=${y} stroke-width="6" stroke-linecap="round"
      stroke-dasharray=${f} stroke-dashoffset=${k}></circle>`;
  }, u = e.entity?.state === "on" ? "Access" : A(e.entity), _ = c`
    <button class="nas-metrics-tile status-tile" aria-label="Open NAS status"
      @pointerdown=${(h) => h.stopPropagation()}
      @click=${(h) => de(h, e, { action: "more-info" })}>
      <span class="nas-metrics-tile-icon tone-blue"><ha-icon icon="mdi:nas"></ha-icon></span>
      <span><b>Status</b><small>${u}</small></span>
    </button>`;
  return n ? e.actionSurface("custom-nas-metrics is-on", c`
    <div class="nas-metrics-top">
      ${_}
      <div class="nas-metrics-tile disk-tile">
        <span class=${`nas-metrics-tile-icon ${l("disk_color") ? "" : "tone-red"}`}
          style=${l("disk_color") ? `color:${i("disk_color", "red")};background:color-mix(in srgb, ${i("disk_color", "red")} 18%, transparent)` : ""}>
          <ha-icon .icon=${v(e, "disk_icon") || "mdi:harddisk"}></ha-icon>
        </span>
        <span><b>${v(e, "disk_name") || "Disk"}</b><small>${A(t)}</small></span>
      </div>
    </div>
    <div class="nas-metrics-body">
      <div class="nas-metrics-metrics">
        <span><i class=${l("temperature_color") ? "" : "tone-orange"} style=${l("temperature_color") ? `color:${i("temperature_color", "orange")}` : ""}><ha-icon .icon=${v(e, "temperature_icon") || "mdi:thermometer"}></ha-icon></i><span><b>${v(e, "temperature_name") || "Temp"}</b><small>${A(o)}</small></span></span>
        <span><i class=${l("memory_color") ? "" : "tone-blue"} style=${l("memory_color") ? `color:${i("memory_color", "blue")}` : ""}><ha-icon .icon=${v(e, "memory_icon") || "mdi:memory"}></ha-icon></i><span><b>${v(e, "memory_name") || "Memory"}</b><small>${A(a)}</small></span></span>
        <span><i class=${l("cpu_color") ? "" : "tone-green"} style=${l("cpu_color") ? `color:${i("cpu_color", "green")}` : ""}><ha-icon .icon=${v(e, "cpu_icon") || "mdi:cpu-64-bit"}></ha-icon></i><span><b>${v(e, "cpu_name") || "CPU"}</b><small>${A(r)}</small></span></span>
      </div>
      <svg class="nas-metrics-rings" viewBox="0 0 140 140" role="img" aria-label="NAS temperature, memory, and CPU utilization">
        ${[58, 48, 38].map((h) => q`<circle class="nas-metrics-ring-track" cx="70" cy="70" r=${h}
          fill="none" stroke="#dedede" stroke-width="6"></circle>`)}
        ${d(o, 58, i("temperature_color", "orange"), N(v(e, "temperature_max")) ?? s("entity_1") ?? 100)}
        ${d(a, 48, i("memory_color", "blue"), N(v(e, "memory_max")) ?? s("entity_2") ?? 100)}
        ${d(r, 38, i("cpu_color", "green"), N(v(e, "cpu_max")) ?? s("entity_3") ?? 100)}
      </svg>
    </div>
  `) : e.actionSurface("custom-nas-metrics is-off", c`<div class="nas-metrics-top">${_}</div>`);
}, _i = (e) => {
  const t = Z(e, "battery_entity"), o = Math.max(0, Math.min(100, N(t?.state) ?? 0)), a = [
    ["tablet_button_usb_entity", "mdi:usb", "green", "Toggle USB"],
    ["tablet_button_motion_entity", "mdi:motion-sensor", "green", "Toggle motion"],
    ["tablet_button_display_entity", "mdi:monitor", "green", "Toggle display"],
    ["tablet_restart_entity", "mdi:restart-alert", "blue", "Restart tablet"],
    ["tablet_maintenance_entity", "mdi:account-hard-hat-outline", "orange", "Toggle maintenance mode"],
    ["tablet_reload_entity", "mdi:reload", "blue", "Reload tablet"]
  ], n = [
    ["RAM", Z(e, "tablet_ram_entity")],
    ["Disk", Z(e, "tablet_disk_entity")],
    ["Power", Z(e, "tablet_power_entity")]
  ].flatMap(
    ([d, u]) => u ? [[d, u]] : []
  ), i = a.flatMap(
    ([d, u, _, h]) => {
      const p = Z(e, d);
      return p ? [[u, _, h, p]] : [];
    }
  ), l = e.entity?.state === "on" ? "Access" : A(e.entity), s = (d, u) => {
    if (d.stopPropagation(), !u) return;
    u.entity_id.split(".")[0] === "button" ? e.service("button", "press", { entity_id: u.entity_id }) : e.service("homeassistant", "toggle", { entity_id: u.entity_id });
  };
  return e.actionSurface("custom-tablet", c`
    <div class="tablet-header">
      <span class="tablet-icon"><ha-icon icon="mdi:tablet"></ha-icon></span>
      ${X(e, l)}
    </div>
    ${i.length ? c`<div class="tablet-controls">${i.map(([d, u, _, h]) => {
    const p = h.state.toLowerCase() === "unavailable";
    return c`<button class="tone-${u} ${ge.has(h.state) ? "is-active" : ""}"
        aria-label=${_} ?disabled=${p}
        @pointerdown=${(y) => y.stopPropagation()}
        @click=${(y) => s(y, h)}>
        <ha-icon .icon=${d}></ha-icon>
      </button>`;
  })}</div>` : m}
    ${n.length ? c`<div class="tablet-metrics">${n.map(([d, u]) => c`
      <span class=${u.state.toLowerCase() === "unavailable" ? "is-unavailable" : ""}><b>${A(u)}</b><small>${d}</small></span>
    `)}</div>` : m}
    ${t ? c`<div class="tablet-battery-row">
      <span class="tablet-battery-icon"><ha-icon icon="mdi:battery"></ha-icon></span>
      <span><b>${A(t)}</b><small>Battery</small></span>
    </div>
    <div class="tablet-battery-bar"><i style=${`width:${o}%`}></i><b>${o}%</b></div>` : m}
  `);
}, pi = (e) => {
  const t = e.entity?.state ?? "unknown", o = Jt(e.hass, e.config.entity, e.config), a = (L) => {
    const O = o[L];
    return O ? e.hass.states[O] : void 0;
  }, r = da(e.hass, e.config.entity, e.config), n = xr(r), i = a("followers_entity"), l = a("following_entity"), s = a("friends_entity"), d = a("primary_stat_entity"), u = a("secondary_stat_entity"), _ = a("now_playing_entity"), h = a("gamerpic_entity"), p = a("artwork_entity"), y = a("console_power_entity"), x = E(h, "entity_picture") ?? E(e.entity, "entity_picture"), b = v(e, "console_show_artwork") === !1 ? void 0 : E(p, "entity_picture") ?? E(e.entity, "media_image_url") ?? E(e.entity, "entity_picture"), f = !!b, k = _ && !["unknown", "unavailable", "none", ""].includes(_.state.toLowerCase()) ? A(_) : String(E(e.entity, "media_title") ?? ""), w = le(e.config, e.entity, e.hass), T = [
    { entity: i, icon: "mdi:account-arrow-left", label: "Followers" },
    { entity: l, icon: "mdi:account-arrow-right", label: "Following" },
    { entity: s, icon: "mdi:account-multiple", label: "Friends" }
  ].filter(({ entity: L }) => L), F = [
    {
      entity: d,
      icon: v(e, "primary_stat_icon") || (r === "xbox" ? "mdi:microsoft-xbox" : "mdi:trophy")
    },
    {
      entity: u,
      icon: v(e, "secondary_stat_icon") || "mdi:podium"
    }
  ].filter(({ entity: L }) => L), B = y?.entity_id.split(".", 1)[0], J = y && !["off", "standby", "unavailable", "unknown"].includes(y.state), Q = (L) => {
    if (L.stopPropagation(), !(!y || !B)) {
      if (B === "switch") {
        e.service("homeassistant", "toggle", { entity_id: y.entity_id });
        return;
      }
      e.service(B, J ? "turn_off" : "turn_on", { entity_id: y.entity_id });
    }
  };
  return e.actionSurface(`custom-console-card platform-${r} state-${t} ${f ? "has-artwork" : ""}`, c`
    ${f ? c`<div class="console-backdrop" style=${`background-image:url("${String(b)}")`}></div>` : m}
    <div class="console-content">
      <div class="card-heading console-header">
        ${e.config.icon_type !== "none" ? c`
          <span class="console-logo ${x && e.config.icon_type !== "icon" ? "has-picture" : ""}"
            style=${x && e.config.icon_type !== "icon" ? `background-image:url("${String(x)}")` : ""}>
            ${x && e.config.icon_type !== "icon" ? m : c`<ha-icon .icon=${e.config.icon || n.icon}></ha-icon>`}
          </span>
        ` : m}
        ${X(e, k || A(e.entity), w)}
        ${F.length ? c`<span class="console-top-stats">
          ${F.map(({ entity: L, icon: O }) => c`
            <span title=${String(E(L, "friendly_name") ?? "")}>
              <ha-icon .icon=${O}></ha-icon>
              <b>${A(L)}</b>
            </span>
          `)}
        </span>` : m}
      </div>
      ${T.length ? c`<div class="console-social">
        ${T.map(({ entity: L, icon: O, label: ee }) => c`
          <span class="console-social-item" title=${ee}><ha-icon .icon=${O}></ha-icon><b>${L?.state}</b></span>
        `)}
      </div>` : m}
      ${v(e, "console_show_controls") !== !1 && y ? c`
        <div class="console-controls">
          <button aria-label=${J ? "Turn console off" : "Turn console on"}
            @pointerdown=${(L) => L.stopPropagation()}
            @click=${Q}>
            <ha-icon .icon=${J ? "mdi:power" : "mdi:power-standby"}></ha-icon>
            <span>${J ? "Power off" : "Power on"}</span>
          </button>
        </div>
      ` : m}
    </div>
  `);
}, hi = (e) => {
  const t = e.config.carousel_show_header ?? [
    e.config.name,
    e.config.primary_info,
    e.config.secondary_info,
    e.config.icon,
    e.config.show_name === !0 ? !0 : void 0
  ].some((o) => o !== void 0);
  return c`
    <ha-card class="mushroom-addition-card entity-carousel-card">
      ${t ? c`
        <div class="metric-heading entity-carousel-presentation">
          ${qe(e, Ct(e, "mdi:view-carousel"), "var(--primary-color)", !0)}
          ${X(e, A(e.entity), e.descriptor.name)}
        </div>
      ` : m}
      <mushroom-addition-entity-carousel
        .hass=${e.hass}
        .config=${e.config}>
      </mushroom-addition-entity-carousel>
    </ha-card>
  `;
}, gi = (e) => {
  e.presentation.rendered = !0;
  const t = e.config, o = [
    t.name,
    t.primary_info,
    t.secondary_info,
    t.icon,
    t.icon_type
  ].some(($) => $ !== void 0), a = Pe(e.hass, t.entity) ?? 0, r = Pe(e.hass, t.grid_power_entity) ?? 0, n = [
    t.grid_phase_1_entity,
    t.grid_phase_2_entity,
    t.grid_phase_3_entity
  ].map(($) => Pe(e.hass, $) ?? 0), i = Pe(e.hass, t.solar_power_entity) ?? 0, l = Be(e.hass, t.solar_forecast_entity) ?? 0, s = Pe(e.hass, t.battery_power_entity) ?? 0, d = Math.max(0, Math.min(
    100,
    Be(e.hass, t.battery_level_entity) ?? 0
  )), u = Pe(e.hass, t.ev_charger_power_entity) ?? 0, _ = [1, 2, 3].map(($) => ({
    level: Be(e.hass, v(e, `battery_${$}_level_entity`)) ?? 0,
    power: Pe(e.hass, v(e, `battery_${$}_power_entity`)) ?? 0
  })), h = t.energy_mode_entity ? e.hass.states[t.energy_mode_entity]?.state ?? "-" : "-", p = {
    "Smart Matching": t.mode_solar_first_label ?? "Solar first",
    "Dynamic Smart Matching": t.mode_smart_saving_label ?? "Smart saving",
    "Dynamic Trading + Smart Matching": t.mode_smart_trading_label ?? "Smart trading"
  }, y = t.energy_auto_control_entity ? e.hass.states[t.energy_auto_control_entity]?.state === "on" : !1, x = `${p[h] ?? h} · ${y ? t.energy_auto_label ?? "Auto" : t.energy_manual_label ?? "Manual"}`, b = s > 20 ? `${t.energy_charge_label ?? "Charging"} ${Se(s)}` : s < -20 ? `${t.energy_discharge_label ?? "Discharging"} ${Se(s)}` : t.energy_idle_label ?? "Idle", f = r > 20 ? t.energy_grid_import_label ?? "GRID · Import" : r < -20 ? t.energy_grid_export_label ?? "GRID · Export" : t.energy_grid_label ?? "GRID", k = t.import_color ?? "#ff9f43", w = t.export_color ?? "#4cd98b", T = t.battery_color ?? "#3b82f6", F = t.solar_color ?? "#f5c542", B = t.home_color ?? "#3b82f6", J = r > 20 ? k : w, Q = (/* @__PURE__ */ new Date()).toLocaleTimeString(e.hass.language ?? "nl-NL", {
    hour: "2-digit",
    minute: "2-digit"
  }), L = ($, H, C) => q`
    <path d=${Vt($, H, C)} class="hems-track"></path>
  `, O = ($, H, C, W, _e, fe = !1) => {
    const Ke = yn($, H, C, W, fe);
    return Ke ? q`<path d=${Ke} stroke=${_e} class="hems-bar"></path>` : m;
  }, ee = t.electricity_price_entity ? e.hass.states[t.electricity_price_entity] : void 0, j = fn(
    ee,
    Be(e.hass, t.tariff_markup_entity) ?? 0,
    Be(e.hass, t.tariff_vat_entity) ?? 0
  ), te = /* @__PURE__ */ new Date();
  te.setHours(0, 0, 0, 0);
  const ne = te.getTime(), me = 864e5, S = Date.now(), V = j.find(($) => S >= $.start && S < $.end), M = ($) => $ < 0 ? t.price_negative_color ?? "#0288d1" : $ < (t.price_low_threshold ?? 0.18) ? t.price_low_color ?? "#2e7d32" : $ < (t.price_medium_threshold ?? 0.26) ? t.price_medium_color ?? "#9ccc65" : $ < (t.price_high_threshold ?? 0.34) ? t.price_high_color ?? "#fdd835" : $ < (t.price_critical_threshold ?? 0.42) ? t.import_color ?? "#fb8c00" : t.price_critical_color ?? "#e53935", P = ($) => new Date($).toLocaleTimeString(e.hass.language ?? "nl-NL", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return e.actionSurface("advanced-energy-management", c`
    ${o ? c`
      <div class="hems-presentation">${mt(e)}</div>
    ` : m}
    <svg class="hems-flow" viewBox="0 0 760 650" role="img" aria-label="Advanced home energy live flow">
      <circle cx="380" cy="300" r="80" class="hems-track hems-battery-track"></circle>
      ${O(80, 0, Math.min(d, 99.9) * 3.6, 1, T)}
      <text x="380" y="270" class="hems-muted hems-center">▮ Battery</text>
      <text x="380" y="318" class="hems-battery-value hems-center">${Math.round(d)}%</text>
      <text x="380" y="346" class="hems-muted hems-center">${b}</text>
      <text x="380" y="125" class="hems-time hems-muted hems-center">${Q}</text>

      ${t.show_grid_phases !== !1 ? [250, 270, 290].map(($, H) => q`
        ${L($, 272, 352)}
        ${O(
    $,
    272,
    352,
    Math.abs(n[H]) / (t.grid_phase_scale_max ?? 3e3),
    n[H] < 0 ? w : k
  )}
      `) : m}
      <text x="180" y="185" class="hems-muted">${f}</text>
      <text x="180" y="228" class="hems-main-value" fill=${J}>⚡ ${Se(r)}</text>
      ${t.show_grid_phases !== !1 ? n.map(($, H) => q`
        <text x="180" y=${258 + H * 22} class="hems-detail hems-muted">
          L${H + 1} ${$ >= 0 ? "↓" : "↑"} ${Se($)}
        </text>
      `) : m}

      ${L(265, 188, 262)}
      ${O(265, 188, 262, i / (t.solar_scale_max ?? 6e3), F, !0)}
      <text x="180" y="395" class="hems-muted">${t.energy_solar_label ?? "Solar Panels"}</text>
      <text x="180" y="437" class="hems-main-value">☀️ ${Se(i)}</text>
      <text x="180" y="465" class="hems-detail hems-muted">
        ${t.energy_forecast_label ?? "Expected"} ${l.toLocaleString(void 0, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })} kWh
      </text>

      ${t.show_battery_units !== !1 ? [250, 270, 290].map(($, H) => q`
        ${L($, 8, 88)}
        ${O(
    $,
    8,
    88,
    Math.abs(_[H].power) / (t.battery_unit_scale_max ?? 2400),
    _[H].power > 0 ? T : k,
    !0
  )}
      `) : m}
      <text x="585" y="185" class="hems-muted hems-end">${t.energy_battery_label ?? "Battery"}</text>
      ${t.show_battery_units !== !1 ? _.map(($, H) => q`
        <text x="585" y=${224 + H * 22} class="hems-detail hems-muted hems-end">
          ${H + 1} <tspan fill=${T} font-weight="600">${Math.round($.level)}%</tspan>
          ${$.power > 20 ? "↑" : $.power < -20 ? "↓" : ""} ${Se($.power)}
        </text>
      `) : m}

      ${L(265, 98, 172)}
      ${O(265, 98, 172, a / (t.home_scale_max ?? 4e3), B)}
      <text x="585" y="395" class="hems-muted hems-end">${t.energy_home_label ?? "HOME"}</text>
      <text x="585" y="437" class="hems-main-value hems-end">${Se(a)} ⌂</text>
      <text x="585" y="465" class="hems-detail hems-muted hems-end">
        🚗 ${t.energy_ev_label ?? "EV charger"} ${Se(u)}
      </text>
      <text x="380" y="522" class="hems-mode hems-muted hems-center">${x} ▾</text>

      ${t.show_tariff_timeline !== !1 && j.length ? q`
        ${j.map(($) => {
    const H = 90 + 580 * ($.start - ne) / me, C = Math.max(580 * ($.end - $.start) / me, 1);
    return q`<rect x=${H} y="588" width=${C} height="14"
            fill=${M($.price)} opacity=".8"></rect>`;
  })}
        ${V ? q`
          <text x="90" y="574" class="hems-muted">
            ${P(V.start)} – ${P(V.end)}
          </text>
          <text x="670" y="574" class="hems-price hems-end"
            fill=${M(V.price)}>
            ${Math.round(V.price * 100)} cents
          </text>
        ` : m}
        <rect x=${90 + 580 * (S - ne) / me - 1.5} y="584"
          width="3" height="22" rx="1.5" class="hems-now"></rect>
        ${[0, 6, 12, 18, 24].map(($) => q`
          <text x=${90 + 580 * $ / 24} y="624" class="hems-hour hems-muted hems-center">
            ${String($ % 24).padStart(2, "0")}
          </text>
        `)}
      ` : m}
    </svg>
  `);
}, zt = [
  { kind: 0, fallback: "Price" },
  { kind: 1, fallback: "Planned grid charge" },
  { kind: 2, fallback: "Planned sell" },
  { kind: 3, fallback: "Possible sell" }
], Ma = (e, t, o) => {
  const r = [
    e.config.name,
    e.config.name_mode,
    e.config.primary_info,
    e.config.secondary_info
  ].some((n) => n !== void 0) ? e : { ...e, config: { ...e.config, entity: void 0 }, entity: void 0 };
  return mt(r, o, t);
}, yi = (e) => {
  const t = e.entity, o = wn(t), a = Math.max(1, N(e.config.buy_sell_graph_span) ?? 36), r = Date.now(), n = e.config.buy_sell_span_start !== "now" ? new Date(new Date(r).setHours(0, 0, 0, 0)).getTime() : r, i = n + a * 60 * 60 * 1e3, l = o.filter(({ timestamp: C }) => C >= n && C < i), s = N(e.config.buy_sell_min_value), d = N(e.config.buy_sell_max_value), u = $n(l, s, d), _ = 58, h = 700, p = 22, y = 254, x = h - _, b = y - p, f = (C) => _ + (C - n) / (i - n) * x, k = (C) => y - (C - u.minimum) / (u.maximum - u.minimum) * b, w = Math.max(0, Math.min(6, Math.floor(N(e.config.buy_sell_price_decimals) ?? 3))), T = (C) => {
    const W = l[C + 1]?.timestamp, _e = W ? W - l[C].timestamp : 1800 * 1e3;
    return Math.max(60 * 1e3, Math.min(_e, 360 * 60 * 1e3));
  }, F = Math.max(0, Math.min(6, Math.floor(N(e.config.buy_sell_axis_decimals) ?? 2))), B = zt.map((C, W) => ce(v(e, [
    "buy_sell_price_color",
    "buy_sell_charge_color",
    "buy_sell_planned_sell_color",
    "buy_sell_possible_sell_color"
  ][W]), ["#78909c", "#43a047", "#fb8c00", "#ffcc80"][W])), J = ce(
    v(e, "buy_sell_now_color"),
    "var(--primary-text-color)"
  ), Q = 14400 * 1e3, L = [];
  for (let C = n; C <= i; C += Q) L.push(C);
  L.at(-1) !== i && L.push(i);
  const O = (C) => new Date(C).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), ee = [
    "buy_sell_price_label",
    "buy_sell_charge_label",
    "buy_sell_planned_sell_label",
    "buy_sell_possible_sell_label"
  ], j = zt.map(({ fallback: C }, W) => String(e.config[ee[W]] || C)), te = e.config.buy_sell_trade_energy_entity, ne = Number(te ? e.hass.states[te]?.state : e.config.buy_sell_trade_energy ?? 10), me = Number(e.config.buy_sell_trade_power ?? 7.2), S = Number(e.config.buy_sell_trade_efficiency ?? 86), V = Number(e.config.buy_sell_feed_in_fee ?? 0), M = te && (!Number.isFinite(ne) || ne <= 0) ? { error: `Minimum trade size entity ${te} must provide a positive numeric kWh value.` } : xn(o, {
    energy: ne,
    power: me,
    efficiency: S,
    fee: V,
    slotMinutes: Number(e.config.buy_sell_slot_minutes ?? 15)
  }), P = (C) => `${C >= 0 ? "+" : ""}${C.toFixed(2)}`, $ = (C) => new Date(C).toLocaleString(
    e.hass.language ?? "en-GB",
    { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
  ), H = (C, W, _e) => c`
    <tr>
      <th scope="row"><span class="energy-result-kind" style=${`--energy-result-color:${_e}`}><i></i>${C}</span></th>
      <td title=${W.slots.map((fe) => `${$(fe.start)} – ${$(fe.end)}`).join("; ")}>
        ${$(W.slots[0].start)} – ${$(W.slots.at(-1).end)}
        (${W.slots.length} slots)
      </td>
      <td>${W.averagePrice.toFixed(3)}</td>
      <td>${W.energy.toFixed(1)}</td>
      <td>${P(W.amount)}</td>
    </tr>
  `;
  return e.actionSurface("energy-buy-sell-card", c`
      ${Ma(e, String(e.config.buy_sell_title || "Buy and sell moments (all-in €/kWh)"), "Price timeline")}
      <div class="energy-buy-sell-chart" style=${`height:${Math.max(120, Math.min(700, N(e.config.buy_sell_chart_height) ?? 300))}px`} role="img"
        aria-label=${`Energy prices and planned actions for the next ${a} hours`}>
        <svg viewBox="0 0 720 314" preserveAspectRatio="none" aria-hidden="true">
          ${Array.from({ length: 5 }, (C, W) => {
    const _e = u.maximum - (u.maximum - u.minimum) * W / 4, fe = p + b * W / 4;
    return q`
              ${e.config.buy_sell_show_grid !== !1 ? q`
                <line x1=${_} y1=${fe} x2=${h} y2=${fe} class="energy-chart-grid"></line>
              ` : m}
              <text x=${_ - 8} y=${fe + 4} text-anchor="end" class="energy-chart-tick">
                ${Lo(_e, F)}
              </text>
            `;
  })}
          <text x="14" y=${(p + y) / 2} text-anchor="middle"
            transform=${`rotate(-90 14 ${(p + y) / 2})`} class="energy-chart-axis-title">${e.config.buy_sell_axis_label || "€/kWh"}</text>
          ${L.map((C) => {
    const W = f(C);
    return q`
              <line x1=${W} y1=${y} x2=${W} y2=${y + 4} class="energy-chart-axis"></line>
              <text x=${W} y=${y + 20} text-anchor="middle" class="energy-chart-tick">
                ${O(C)}
              </text>
            `;
  })}
          ${l.map((C, W) => {
    const _e = C.kind, fe = B[_e], Ke = k(C.price), mo = k(Math.max(u.minimum, Math.min(0, u.maximum))), _o = f(C.timestamp), Oa = f(Math.min(i, C.timestamp + T(W))), Na = Math.max(1, (Oa - _o) * 0.88), Va = Math.min(Ke, mo), La = Math.max(1, Math.abs(Ke - mo));
    return q`
              <rect x=${_o} y=${Va} width=${Na} height=${La}
                rx=${Math.max(0, Math.min(16, N(e.config.buy_sell_bar_radius) ?? 2))}
                fill=${fe} opacity="0.88">
                <title>${`${j[_e]}: ${Lo(C.price, w)} ${e.config.buy_sell_axis_label || "€/kWh"}`}</title>
              </rect>
            `;
  })}
          ${l.length === 0 ? q`
            <text x=${(_ + h) / 2} y=${(p + y) / 2}
              text-anchor="middle" class="energy-chart-empty">No price slots available</text>
          ` : m}
          ${e.config.buy_sell_show_now !== !1 && r >= n && r <= i ? q`
            <line x1=${f(r)} y1=${p} x2=${f(r)} y2=${y + 4}
              class="energy-chart-now" style=${`stroke:${J}`}></line>
            <text x=${f(r)} y=${p - 7} text-anchor="middle" class="energy-chart-now-label"
              style=${`fill:${J}`}>
              ${e.config.buy_sell_now_label || "Now"}
            </text>
          ` : m}
        </svg>
      </div>
      ${e.config.buy_sell_show_legend !== !1 ? c`<div class="energy-chart-legend">
        ${zt.map(({ kind: C }, W) => c`
          <span class="energy-chart-legend-item">
            <span class="energy-chart-legend-swatch" style=${`--energy-series-color:${B[W]}`}></span>
            ${j[C]}
          </span>
        `)}
      </div>` : m}
      ${e.config.buy_sell_show_result !== !1 ? c`
        <details class="energy-buy-sell-result"
          @pointerdown=${(C) => C.stopPropagation()}
          @click=${(C) => C.stopPropagation()}
          @dblclick=${(C) => C.stopPropagation()}
          @keydown=${(C) => C.stopPropagation()}>
          <summary>Buy and sell result<ha-icon icon="mdi:chevron-down"></ha-icon></summary>
          ${"error" in M ? c`<p class="energy-card-empty" role="status">${M.error}</p>` : c`
            <div class="energy-result-table-scroll" tabindex="0" role="region" aria-label="Buy and sell estimate">
              <table class="energy-result-table">
                <thead><tr><th scope="col">Action</th><th scope="col">Slots</th><th scope="col">avg €/kWh</th><th scope="col">kWh</th><th scope="col">€</th></tr></thead>
                <tbody>${H("Buy", M.buy, B[1])}${H("Sell", M.sell, B[2])}</tbody>
              </table>
            </div>
            <p class="energy-result-net">Net result for ${Number(ne.toFixed(2))} kWh: ${P(M.net)} €</p>
            <p class="energy-result-note">
              Calculated for the minimum trade size (${Number(ne.toFixed(2))} kWh):
              the cheapest slots to buy and the most expensive remaining slots to sell,
              at ${me} kW, over all published prices.
              Buy kWh = sold kWh ÷ round-trip efficiency (${S}%).
              Sell is revenue after the feed-in fee (${V} €/kWh).
              Slots may be non-contiguous; the displayed times span the selected slots, not a continuous schedule.
              The final slot may be partially used. This estimate does not enforce buy-before-sell order,
              battery capacity or available charge; the real plan follows Smart saving / Smart trading.
            </p>
          `}
        </details>
      ` : m}
  `);
}, bi = (e) => {
  const t = Array.isArray(e.config.panel_entities) ? e.config.panel_entities : void 0, o = kn(
    e.hass.states,
    t,
    e.config.entity
  ), a = Mn(o), r = Math.max(1, N(e.config.panel_gauge_max) ?? 350), n = [0, 1, 2, 3, 4, 5].map((x) => N(e.config[`panel_segment_${x}`]) ?? [0, 80, 150, 230, 300, r][x]), i = n.map((x, b) => ce(v(e, `panel_color_${b}`), [
    "#b0bec5",
    "#ffa726",
    "#d4e157",
    "#66bb6a",
    "#2e7d32",
    "#2e7d32"
  ][b])), l = N(e.config.panel_warning_average_min) ?? 30, s = (N(e.config.panel_low_output_percent) ?? 60) / 100, d = a.averageOutput > l && !!a.weakest && a.weakest.value < a.averageOutput * s, u = a.activeCount < o.length, _ = o.length === 0 ? "No panel sensors are selected." : d ? `Panel ${a.weakest.id} is delivering less than ${Math.round(s * 100)}% of the average. Check for shading or a fault.` : u ? `${o.length - a.activeCount} panel(s) at zero. This is normal at night; otherwise, check them.` : "All panels are within the expected range of each other.", h = o.length === 0 ? "mdi:information-outline" : d || u ? "mdi:alert-circle-outline" : "mdi:check-circle-outline", p = d ? "warning" : u || o.length === 0 ? "muted" : "success", y = [
    ["Panels reporting", `${a.activeCount} / ${o.length}`],
    ["Combined output", `${Math.round(a.totalOutput)} W`],
    ["Average per panel", `${Math.round(a.averageOutput)} W`],
    ["Best panel", a.best ? `${a.best.id} · ${Math.round(a.best.value)} W` : "—"],
    ["Weakest panel", a.weakest ? `${a.weakest.id} · ${Math.round(a.weakest.value)} W` : "—"],
    ["Best-to-weakest spread", `${Math.round(a.spread)} W`]
  ];
  return e.actionSurface("panel-health-card", c`
      ${Ma(e, String(e.config.panel_health_title || "Panel health"), "Solar panel output")}
      ${e.config.panel_show_summary !== !1 ? c`<div class="panel-health-summary">
        ${y.map(([x, b]) => c`
          <div class="panel-health-summary-row"><span>${x}</span><strong>${b}</strong></div>
        `)}
      </div>` : m}
      <div class=${`panel-health-status panel-health-status-${p}`} role="status">
        <ha-icon icon=${h}></ha-icon><span>${_}</span>
      </div>
      ${o.length && e.config.panel_show_gauges !== !1 ? c`
        <div class="panel-health-gauges">
          ${o.map((x) => {
    const b = An(x.value, r), f = Cn(x.value, n, i), k = 2 * Math.PI * 37, w = k * b / 100, T = le({
      ...e.config,
      entity: x.entity.entity_id
    }, x.entity, e.hass) || x.id;
    return c`
              <button class="panel-health-gauge" type="button"
                aria-label=${`${T}: ${Math.round(x.value)} watts`}
                @click=${(F) => de(F, e, { action: "more-info" }, x.entity.entity_id)}>
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="46" r="37" class="panel-health-gauge-track"></circle>
                  <circle cx="50" cy="46" r="37" class="panel-health-gauge-value"
                    style=${`--panel-gauge-color:${f};--panel-gauge-progress:${w};--panel-gauge-circumference:${k}`}
                    stroke-dasharray=${`${w} ${k}`}></circle>
                  <text x="50" y="51" text-anchor="middle" class="panel-health-gauge-value-label">
                    ${Math.round(x.value)}
                  </text>
                </svg>
                <span class="panel-health-gauge-name">${T}</span>
              </button>
            `;
  })}
        </div>
      ` : o.length ? m : c`
        <div class="energy-card-empty">
          Select panel sensors in the card editor, or add sensors with entity IDs beginning with sensor.inverter_4.
        </div>
      `}
  `);
}, fi = (e) => {
  const t = U(e, "ulm_card_flower_entity") ?? e.entity, o = t?.state === "problem", a = (n) => At.find((i) => i.key === n), r = _a(e.config).flatMap((n) => {
    const i = a(n), l = E(t, n), s = typeof l == "object" && l !== null ? l : void 0, d = U(e, pa(n)), u = typeof s?.sensor == "string" ? s.sensor : typeof l == "string" && e.hass.states[l] ? l : void 0, _ = d ?? (u ? e.hass.states[u] : void 0), h = String(E(t, "device_class") ?? ""), p = t?.entity_id.startsWith("sensor.") && (h === n || n === "moisture" && (!h || h === "humidity")), y = _ ?? (p ? t : void 0), x = N(y?.state) ?? N(s?.current) ?? N(l);
    if (x === void 0) return [];
    const b = N(s?.min) ?? N(E(y, "min")) ?? i.min, f = N(s?.max) ?? N(E(y, "max")) ?? i.max, k = Math.max(0, Math.min(100, (x - b) / Math.max(1, f - b) * 100)), w = y ? A(y) : String(x);
    return [{ key: n, definition: i, sourceEntity: y, value: x, percent: k, display: w }];
  });
  return e.actionSurface("custom-plant", c`
    <button class="flower-heading" aria-label="Open plant details"
      @pointerdown=${(n) => n.stopPropagation()}
      @click=${(n) => de(n, e, { action: "more-info" }, t?.entity_id)}>
      ${ie(e, o ? "mdi:alert-circle" : "mdi:flower", o ? "red" : "green")}
      ${X(e, o ? v(e, "ulm_custom_card_plant_problem") || "Problema" : v(e, "ulm_custom_card_plant_correct") || "Correto")}
    </button>
    ${r.length ? c`<div class="flower-bars">${r.map(({ key: n, definition: i, sourceEntity: l, percent: s, display: d }) => {
    const u = `${i.label}: ${d}`;
    return c`<span data-flower-bar=${n} title=${u} aria-label=${u}>
        <ha-icon .icon=${i.icon}></ha-icon>
        <i><em style=${`width:${s}%`}></em></i>
        ${l ? c`<output>${d}</output>` : m}
      </span>`;
  })}</div>` : m}
  `);
}, vi = (e) => {
  const t = v(e, "ulm_custom_card_speedtest_round") === !0, o = (a, r, n, i, l, s, d, u, _) => {
    const h = U(e, a) ?? U(e, r), p = N(h?.state), y = Math.max(1, v(e, d) ?? u), x = Math.max(0, Math.min(100, (p ?? 0) / y * 100)), b = p === void 0 ? "—" : _ && t ? String(Math.round(p)) : h.state, f = h?.attributes.unit_of_measurement, k = ce(v(e, l), s);
    return c`
      <div class="speedtest-metric" style=${`--speedtest-color:${k};--speedtest-value:${x}`}>
        <svg class="speedtest-ring" viewBox="0 0 120 100" aria-hidden="true">
          <path class="speedtest-track" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
          <path class="speedtest-value" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
        </svg>
        <span class="speedtest-value-copy"><ha-icon .icon=${i}></ha-icon><b>${b}${f ? ` ${String(f)}` : ""}</b><small>${n}</small></span>
      </div>`;
  };
  return e.actionSurface("custom-speedtest-gauges", c`
    <div class="speedtest-three">
      ${o(
    "download_entity",
    "ulm_custom_card_speedtest_download_speed_entity",
    "Download",
    "mdi:download",
    "ulm_custom_card_speedtest_download_speed_color",
    "rgb(var(--rgb-yellow, 255, 235, 59))",
    "ulm_custom_card_speedtest_download_speed_max",
    100,
    !0
  )}
      ${o(
    "upload_entity",
    "ulm_custom_card_speedtest_upload_speed_entity",
    "Upload",
    "mdi:upload",
    "ulm_custom_card_speedtest_upload_speed_color",
    "rgb(var(--rgb-blue, 33, 150, 243))",
    "ulm_custom_card_speedtest_upload_speed_max",
    40,
    !0
  )}
      ${o(
    "ping_entity",
    "ulm_custom_card_speedtest_ping_entity",
    "Ping",
    "mdi:wan",
    "ulm_custom_card_speedtest_ping_color",
    "rgb(var(--rgb-green, 76, 175, 80))",
    "ulm_custom_card_speedtest_ping_max",
    85,
    !1
  )}
    </div>
  `);
}, wi = (e) => {
  const t = {
    en: { none: "None", very_low: "Very low", low: "Low", medium: "Medium", high: "High", very_high: "Very high", tree: "Trees", grass: "Grass", weed: "Weeds" },
    de: { none: "Keine", very_low: "Sehr niedrig", low: "Niedrig", medium: "Mittel", high: "Hoch", very_high: "Sehr hoch", tree: "Bäume", grass: "Gräser", weed: "Kräuter" },
    es: { none: "Ninguno", very_low: "Muy bajo", low: "Bajo", medium: "Medio", high: "Alto", very_high: "Muy alto", tree: "Árboles", grass: "Hierbas", weed: "Malezas" },
    nl: { none: "Geen", very_low: "Zeer laag", low: "Laag", medium: "Gemiddeld", high: "Hoog", very_high: "Extreem hoog", tree: "Bomen", grass: "Grassen", weed: "Kruiden" },
    pl: { none: "Brak", very_low: "Bardzo słabe", low: "Słabe", medium: "Średnie", high: "Wysokie", very_high: "Bardzo wysokie", tree: "Drzewa", grass: "Trawy", weed: "Zioła" }
  }, o = t[(e.hass.language ?? "en").split("-")[0]] ?? t.en, a = [
    {
      entity: Z(e, "trees_entity"),
      name: v(e, "custom_card_pollen_tree_name"),
      icon: v(e, "custom_card_pollen_tree_icon"),
      kind: "tree",
      fallbackIcon: "mdi:tree"
    },
    {
      entity: Z(e, "grass_entity"),
      name: v(e, "custom_card_pollen_grass_name"),
      icon: v(e, "custom_card_pollen_grass_icon"),
      kind: "grass",
      fallbackIcon: "mdi:grass"
    },
    {
      entity: Z(e, "weeds_entity"),
      name: v(e, "custom_card_pollen_weed_name"),
      icon: v(e, "custom_card_pollen_weed_icon"),
      kind: "weed",
      fallbackIcon: "mdi:flower-pollen"
    }
  ], r = (n) => {
    const i = n?.toLowerCase() ?? "none", l = {
      none: "rgba(var(--color-grey, 158, 158, 158), 1)",
      very_low: "rgba(var(--color-green, 76, 175, 80), 1)",
      low: "rgb(241, 196, 15)",
      medium: "rgb(243, 156, 18)",
      high: "rgb(231, 76, 60)",
      very_high: "rgba(var(--color-pink, 233, 30, 99), 1)"
    };
    return {
      label: o[i] ?? o.none,
      color: l[i] ?? l.none,
      extreme: i === "very_high"
    };
  };
  return e.actionSurface("custom-pollen", c`
    <div class="pollen-heading">${mt(e)}</div>
    ${a.map((n) => {
    const i = r(n.entity?.state), l = n.name || n.entity?.attributes.friendly_name || o[n.kind], s = n.icon || n.entity?.attributes.icon || n.fallbackIcon;
    return c`<button class="pollen-item" style=${`--pollen:${i.color}`}
        ?disabled=${!n.entity}
        @pointerdown=${(d) => d.stopPropagation()}
        @click=${(d) => n.entity && de(d, e, { action: "more-info" }, n.entity.entity_id)}>
        <span class="pollen-item-icon"><ha-icon .icon=${s}></ha-icon>
          ${i.extreme ? c`<span class="pollen-extreme"><ha-icon .icon=${"mdi:exclamation-thick"}></ha-icon></span>` : m}
        </span>
        <b>${l}</b><small>${n.entity ? i.label : "Entity unavailable"}</small>
      </button>`;
  })}
  `);
}, $i = (e) => {
  const t = ge.has(e.entity?.state ?? ""), o = "rgb(var(--rgb-blue, 33, 150, 243))";
  return e.actionSurface("ulm-row", c`
    ${qe(e, Ct(e, "mdi:information-outline"), o, t)}
    ${Nn(e)}
  `, `--source-color:${o}`);
}, xi = (e) => {
  switch (e.descriptor.upstreamId) {
    case "card_battery":
      return jn(e);
    case "card_media_player":
      return Ro(e);
    case "custom_card_trash":
      return ti(e);
    case "custom_card_alarm_time":
      return oi(e);
    case "custom_card_roomview":
      return ai(e);
    case "custom_card_room_overview":
      return ni(e);
    case "custom_card_welcome":
      return ri(e);
    case "custom_card_washer":
      return ii(e);
    case "custom_card_sun":
      return si(e);
    case "custom_card_input_datetime":
      return li(e);
    case "custom_card_weather_metrics":
      return ci(e);
    case "custom_card_media_player_sonos":
      return di(e);
    case "custom_card_printer":
      return ui(e);
    case "custom_card_nas_metrics":
      return mi(e);
    case "custom_card_tablet":
      return _i(e);
    case "custom_card_playstation":
      return pi(e);
    case "custom_card_entity_carousel":
      return hi(e);
    case "advanced_home_energy_management":
      return gi(e);
    case "advanced_energy_buy_sell":
      return yi(e);
    case "advanced_energy_panel_health":
      return bi(e);
    case "custom_card_plant":
      return fi(e);
    case "custom_card_speedtest_gauges":
      return vi(e);
    case "custom_card_pollen":
      return wi(e);
    case "card_room":
      return Xn(e);
  }
  if (/trash/.test(e.descriptor.upstreamId)) return Zn(e);
  if (/printer/.test(e.descriptor.upstreamId)) return Qn(e);
  if (/plant|entity_overview/.test(e.descriptor.upstreamId))
    return Jn(e, /plant/.test(e.descriptor.upstreamId) ? "mdi:flower" : "mdi:view-grid", "purple");
  switch (e.descriptor.family) {
    case "scene":
      return Gn(e);
    case "battery":
      return Fn(e);
    case "energy":
    case "sensor":
      return Hn(e);
    case "media":
      return Ro(e);
    case "security":
      return Un(e);
    case "navigation":
      return qn(e);
    case "control":
      return Yn(e);
    case "alarm-time":
      return ei(e);
    default:
      return $i(e);
  }
};
var Si = Object.defineProperty, no = (e, t, o, a) => {
  for (var r = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = i(t, o, r) || r);
  return r && Si(t, o, r), r;
};
const io = class io extends be {
  constructor() {
    super(...arguments), this.holdFired = !1, this.forecastGeneration = 0, this.forecast = [], this.sceneOverflowExpanded = !1, this.actionSurface = (t, o, a = "") => {
      const r = this.descriptor ? Zt.get(this.descriptor.upstreamId) : void 0, n = this.descriptor?.sourcePath.startsWith("src/") ?? !1;
      if (!r && !n)
        throw new Error(`Missing explicit parity renderer mapping for ${this.descriptor?.upstreamId}`);
      const i = r ? ` parity-${r.rendererId.replaceAll("_", "-")}` : "", l = this.config?.layout && this.config.layout !== "default" ? ` layout-${this.config.layout}` : "", s = this.config?.multiline_secondary ? " multiline-secondary" : "", d = this.config?.fill_container ? " fill-container" : "", u = this.config?.variant ? ` variant-${this.config.variant}` : "", _ = c`
      <div class="${t}${i}${l}${s}${d}${u} action-surface" style=${a} role="button" tabindex="0"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        ${o}
      </div>`;
      return c`<ha-card class="mushroom-addition-card">${_}</ha-card>`;
    }, this.keydown = (t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.runAction("tap_action"));
    }, this.pointerDown = () => {
      this.holdFired = !1, this.holdTimer = window.setTimeout(() => {
        this.holdFired = !0, this.runAction("hold_action");
      }, 500);
    }, this.pointerUp = () => {
      this.holdTimer && window.clearTimeout(this.holdTimer), this.holdTimer = void 0;
    }, this.tap = (t) => {
      if (this.holdFired) {
        this.holdFired = !1;
        return;
      }
      if (!(t.detail > 1)) {
        if (this.config?.double_tap_action?.action && this.config.double_tap_action.action !== "none") {
          this.tapTimer && window.clearTimeout(this.tapTimer), this.tapTimer = window.setTimeout(() => this.runAction("tap_action"), 300);
          return;
        }
        this.runAction("tap_action");
      }
    }, this.doubleTap = () => {
      this.tapTimer && window.clearTimeout(this.tapTimer), this.tapTimer = void 0, this.runAction("double_tap_action");
    };
  }
  setConfig(t) {
    if (!t || typeof t != "object") throw new Error("A card configuration is required.");
    const o = br(t), a = this.forecastKey(this.config);
    this.config = o, this.sceneOverflowExpanded = !1, a !== this.forecastKey(o) && this.stopForecastSubscription(), this.scheduleEnergyBuySellRefresh(), this.requestUpdate(), this.subscribeForecast();
  }
  static async getConfigElement() {
    return document.createElement("mushroom-addition-editor");
  }
  static getStubConfig() {
    return { type: "custom:mushroom-addition-card-battery", show_icon: !0, show_state: !0 };
  }
  getCardSize() {
    return ["weather", "climate", "scene", "energy", "sensor"].includes(this.descriptor?.family ?? "") ? 2 : 1;
  }
  render() {
    if (!this.config || !this.descriptor) return m;
    if (!this.hass) return c`<ha-card><div class="preview">Mushroom Addition preview</div></ha-card>`;
    const t = this.config.entity ? this.hass.states[this.config.entity] : void 0, o = { rendered: !1 }, a = {
      config: this.config,
      descriptor: this.descriptor,
      hass: this.hass,
      entity: t,
      forecast: this.forecast,
      presentation: o,
      sceneOverflowExpanded: this.sceneOverflowExpanded,
      toggleSceneOverflow: () => {
        this.sceneOverflowExpanded = !this.sceneOverflowExpanded;
      },
      actionSurface: (r, n, i) => this.actionSurface(
        r,
        o.rendered ? n : c`${Vn(a)}${n}`,
        i
      ),
      service: (r, n, i) => {
        this.hass?.callService(r, n, i);
      }
    };
    return xi(a);
  }
  updated() {
    this.subscribeForecast();
  }
  disconnectedCallback() {
    this.stopForecastSubscription(), this.stopEnergyBuySellRefresh(), super.disconnectedCallback();
  }
  connectedCallback() {
    super.connectedCallback(), this.scheduleEnergyBuySellRefresh();
  }
  scheduleEnergyBuySellRefresh() {
    if (this.stopEnergyBuySellRefresh(), this.descriptor?.upstreamId !== "advanced_energy_buy_sell" || !this.isConnected) return;
    const t = Number(this.config?.buy_sell_update_interval), o = Number.isFinite(t) && t > 0 ? Math.max(1, Math.min(120, t)) : 5;
    this.energyBuySellTimer = window.setInterval(() => this.requestUpdate(), o * 6e4);
  }
  stopEnergyBuySellRefresh() {
    this.energyBuySellTimer !== void 0 && window.clearInterval(this.energyBuySellTimer), this.energyBuySellTimer = void 0;
  }
  forecastKey(t = this.config) {
    if (!(this.descriptor?.family !== "weather" || !t?.show_forecast || !t.entity))
      return `${t.entity}:daily`;
  }
  stopForecastSubscription() {
    this.forecastGeneration += 1, this.unsubscribeForecast?.(), this.unsubscribeForecast = void 0, this.forecastSubscriptionKey = void 0, this.forecast = [];
  }
  async subscribeForecast() {
    const t = this.forecastKey();
    if (!t || !this.config?.entity || !this.hass?.connection?.subscribeMessage || this.forecastSubscriptionKey === t) return;
    this.stopForecastSubscription(), this.forecastSubscriptionKey = t;
    const o = this.forecastGeneration;
    try {
      const a = await this.hass.connection.subscribeMessage((r) => {
        o !== this.forecastGeneration || t !== this.forecastSubscriptionKey || (this.forecast = r.forecast ?? [], this.requestUpdate());
      }, {
        type: "weather/subscribe_forecast",
        entity_id: this.config.entity,
        forecast_type: "daily"
      });
      o !== this.forecastGeneration || t !== this.forecastSubscriptionKey ? a() : this.unsubscribeForecast = a;
    } catch (a) {
      o === this.forecastGeneration && (this.forecastSubscriptionKey = void 0), console.warn("Mushroom Cards Addition: unable to load weather forecast", a);
    }
  }
  runAction(t) {
    if (!this.hass || !this.config) return;
    const o = t === "tap_action" ? "tap" : t === "hold_action" ? "hold" : "double_tap", a = this.config[t], r = typeof a?.entity == "string" ? a.entity : void 0;
    ra(this, r ? { ...this.config, entity: r } : this.config, o);
  }
};
io.styles = rn;
let Ve = io;
no([
  ue({ attribute: !1 })
], Ve.prototype, "hass");
no([
  ue({ attribute: !1 })
], Ve.prototype, "config");
no([
  oe()
], Ve.prototype, "sceneOverflowExpanded");
var ki = Object.defineProperty, _t = (e, t, o, a) => {
  for (var r = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = i(t, o, r) || r);
  return r && ki(t, o, r), r;
};
const Qe = [
  "var(--accent-color, #03a9f4)",
  "#ff9800",
  "#4caf50",
  "#9c27b0",
  "#f44336",
  "#00bcd4"
], Lt = (e) => {
  const o = (Array.isArray(e.entities) ? e.entities : []).map((a) => typeof a == "string" ? { entity: a } : { ...a });
  return !o.length && e.entity && o.push({ entity: e.entity }), o.filter((a) => !!a.entity);
}, Aa = (e) => ({
  name: e?.name ?? !0,
  icon: e?.icon ?? !0,
  state: e?.state ?? !0,
  graph: e?.graph ?? "line",
  fill: e?.fill ?? !0,
  points: e?.points ?? "hover",
  legend: e?.legend ?? !0,
  average: e?.average ?? !1,
  extrema: e?.extrema ?? !1,
  labels: e?.labels ?? "hover",
  labels_secondary: e?.labels_secondary ?? "hover",
  name_adaptive_color: e?.name_adaptive_color ?? !1,
  icon_adaptive_color: e?.icon_adaptive_color ?? !1,
  loading_indicator: e?.loading_indicator ?? !0
}), Ho = (e) => {
  const t = Lt(e);
  if (!t.length) throw new Error("Mini Graph Card requires at least one entity.");
  return {
    ...e,
    entity: e.entity ?? t[0].entity,
    entities: t,
    hours_to_show: e.hours_to_show ?? 24,
    points_per_hour: e.points_per_hour ?? 0.5,
    aggregate_func: e.aggregate_func ?? "avg",
    group_by: e.group_by ?? "interval",
    cache: e.cache ?? !0,
    show: Aa(e.show),
    animate: e.animate ?? !1,
    height: e.height ?? 150,
    bar_spacing: e.bar_spacing ?? 4,
    line_width: e.line_width ?? 5,
    line_color: e.line_color ?? Qe[0],
    color_thresholds: bt(e.color_thresholds ?? []),
    color_thresholds_transition: e.color_thresholds_transition ?? "smooth",
    font_size: e.font_size ?? 100,
    font_size_header: e.font_size_header ?? 14,
    align_header: e.align_header ?? "default",
    align_icon: e.align_icon ?? "right",
    align_state: e.align_state ?? "left",
    smoothing: e.smoothing ?? !0,
    state_map: e.state_map ?? [],
    value_factor: e.value_factor ?? 0,
    logarithmic: e.logarithmic ?? !1,
    tap_action: e.tap_action ?? { action: "more-info" },
    hold_action: e.hold_action ?? { action: "none" },
    double_tap_action: e.double_tap_action ?? { action: "none" }
  };
}, bt = (e) => {
  const t = e.map((a) => typeof a == "string" ? { color: a } : { ...a });
  let o = -1;
  for (let a = 0; a < t.length; a += 1)
    if (t[a].value !== void 0) {
      if (o >= 0 && a - o > 1) {
        const r = t[o].value, n = t[a].value;
        for (let i = o + 1; i < a; i += 1)
          t[i].value = r + (n - r) * (i - o) / (a - o);
      }
      o = a;
    }
  return t.filter((a) => a.value !== void 0 && !!a.color);
}, pt = (e, t) => t ? t.split(".").reduce((o, a) => {
  if (!(!o || typeof o != "object"))
    return o[a];
}, e?.attributes) : e?.state, ht = (e, t) => {
  const o = String(e ?? ""), a = t.findIndex((n) => n.value === o);
  if (a >= 0)
    return {
      value: a,
      label: t[a].label ?? t[a].value
    };
  const r = Number(e);
  return Number.isFinite(r) ? { value: r } : {};
}, Ca = (e, t) => {
  if (!e.length) return Number.NaN;
  switch (t) {
    case "median": {
      const o = [...e].sort((r, n) => r - n), a = Math.floor(o.length / 2);
      return o.length % 2 ? o[a] : (o[a - 1] + o[a]) / 2;
    }
    case "min":
      return Math.min(...e);
    case "max":
      return Math.max(...e);
    case "first":
      return e[0];
    case "last":
      return e.at(-1);
    case "sum":
      return e.reduce((o, a) => o + a, 0);
    case "delta":
      return Math.max(...e) - Math.min(...e);
    case "diff":
      return e.at(-1) - e[0];
    default:
      return e.reduce((o, a) => o + a, 0) / e.length;
  }
}, Mi = (e, t, o, a = Date.now()) => {
  if (!e.length) return [];
  const r = Math.max(1, Number(t.hours_to_show ?? 24)), n = Math.max(0.01, Number(t.points_per_hour ?? 0.5)), i = a - r * 36e5, l = 36e5 / n, s = /* @__PURE__ */ new Map();
  for (const d of e) {
    if (d.time < i || d.time > a || !Number.isFinite(d.value)) continue;
    const u = new Date(d.time), _ = t.group_by === "date" ? `${u.getFullYear()}-${u.getMonth()}-${u.getDate()}` : t.group_by === "hour" ? `${u.getFullYear()}-${u.getMonth()}-${u.getDate()}-${u.getHours()}` : String(Math.floor((d.time - i) / l));
    s.set(_, [...s.get(_) ?? [], d]);
  }
  return [...s.values()].map((d) => ({
    time: d.at(-1).time,
    value: Ca(d.map((u) => u.value), o),
    label: d.at(-1)?.label
  })).sort((d, u) => d.time - u.time);
}, Wo = (e) => {
  if (typeof e == "number" && Number.isFinite(e)) return { value: e, soft: !1 };
  if (typeof e != "string") return { soft: !1 };
  const t = e.trim().startsWith("~"), o = Number(e.replace(/^~/, ""));
  return { value: Number.isFinite(o) ? o : void 0, soft: t };
}, Go = (e, t, o, a = 0) => {
  let r = e.length ? Math.min(...e) : 0, n = e.length ? Math.max(...e) : 1;
  const i = Wo(t), l = Wo(o);
  if (i.value !== void 0 && (r = i.soft ? Math.min(r, i.value) : i.value), l.value !== void 0 && (n = l.soft ? Math.max(n, l.value) : l.value), n <= r) {
    const s = Math.max(1, Math.abs(r) * 0.05), d = i.value !== void 0 && !i.soft && l.value === void 0, u = l.value !== void 0 && !l.soft && i.value === void 0;
    d ? n = r + s * 2 : u ? r = n - s * 2 : (r -= s, n += s);
  }
  if (n - r < a) {
    const s = (r + n) / 2;
    r = s - a / 2, n = s + a / 2;
  }
  return { min: r, max: n };
}, Uo = (e, t, o) => {
  let a = o;
  for (const r of t)
    r.value !== void 0 && e >= r.value && (a = r.color);
  return a;
}, Ai = (e, t) => Number.isFinite(e) ? e.toLocaleString(void 0, {
  minimumFractionDigits: t,
  maximumFractionDigits: t ?? 2
}) : "Unavailable", Ci = (e, t) => {
  if (!e.length) return "";
  if (!t || e.length < 3)
    return e.map((a, r) => `${r ? "L" : "M"} ${a.x} ${a.y}`).join(" ");
  let o = `M ${e[0].x} ${e[0].y}`;
  for (let a = 1; a < e.length; a += 1) {
    const r = e[a - 1], n = e[a], i = (r.x + n.x) / 2;
    o += ` C ${i} ${r.y}, ${i} ${n.y}, ${n.x} ${n.y}`;
  }
  return o;
}, Ii = (e, t) => {
  if (typeof e == "number" && Number.isFinite(e))
    return e < 1e10 ? e * 1e3 : e;
  const o = Date.parse(String(e ?? ""));
  return Number.isFinite(o) ? o : t;
}, Ei = (e, t) => {
  const o = /* @__PURE__ */ new Map();
  if (Array.isArray(e))
    return e.forEach((a, r) => {
      if (!Array.isArray(a)) return;
      const n = a.find((l) => l && typeof l == "object"), i = typeof n?.entity_id == "string" ? n.entity_id : typeof n?.e == "string" ? n.e : t[r]?.entity;
      i && o.set(i, a);
    }), o;
  if (!e || typeof e != "object") return o;
  for (const [a, r] of Object.entries(e))
    Array.isArray(r) && o.set(a, r);
  return o;
}, so = class so extends be {
  constructor() {
    super(...arguments), this.series = [], this.loading = !1, this.historyGeneration = 0, this.holdFired = !1, this.keydown = (t) => {
      (t.key === "Enter" || t.key === " ") && (t.preventDefault(), this.runAction("tap_action"));
    }, this.pointerDown = () => {
      this.holdFired = !1, this.holdTimer = window.setTimeout(() => {
        this.holdFired = !0, this.runAction("hold_action");
      }, 500);
    }, this.pointerUp = () => {
      this.holdTimer && window.clearTimeout(this.holdTimer), this.holdTimer = void 0;
    }, this.tap = (t) => {
      if (this.holdFired) {
        this.holdFired = !1;
        return;
      }
      if (t.detail > 1) return;
      const o = this.config?.double_tap_action;
      if (o?.action && o.action !== "none") {
        this.tapTimer && window.clearTimeout(this.tapTimer), this.tapTimer = window.setTimeout(() => this.runAction("tap_action"), 300);
        return;
      }
      this.runAction("tap_action");
    }, this.doubleTap = () => {
      this.tapTimer && window.clearTimeout(this.tapTimer), this.tapTimer = void 0, this.runAction("double_tap_action");
    };
  }
  static async getConfigElement() {
    return document.createElement("mushroom-addition-editor");
  }
  static getStubConfig(t, o = [], a = []) {
    const r = [...o, ...a, ...Object.keys(t?.states ?? {})], n = r.find((i) => (i.startsWith("sensor.") || i.startsWith("binary_sensor.")) && !["unknown", "unavailable"].includes(t?.states[i]?.state ?? "")) ?? r.find((i) => i.startsWith("sensor.") || i.startsWith("binary_sensor.")) ?? "sensor.example";
    return Ho({
      type: "custom:mushroom-addition-mini-graph-card",
      entity: n,
      entities: [{ entity: n }],
      name: t?.states[n]?.attributes.friendly_name,
      show: { graph: "line", fill: !0, points: "hover", labels: "hover" }
    });
  }
  setConfig(t) {
    this.config = Ho(t), this.restartInterval(), this.requestKey = void 0, this.lastEntityStateSignature = this.entityStateSignature(), this.loadHistory();
  }
  getCardSize() {
    return Math.max(1, Math.ceil((Number(this.config?.height ?? 150) + 110) / 50));
  }
  updated(t) {
    if (!t.has("hass") && !t.has("config")) return;
    const o = this.entityStateSignature(), a = t.has("hass") && this.lastEntityStateSignature !== void 0 && o !== this.lastEntityStateSignature;
    this.lastEntityStateSignature = o, !(a && this.config?.update_interval) && this.loadHistory(a);
  }
  connectedCallback() {
    super.connectedCallback(), this.restartInterval();
  }
  disconnectedCallback() {
    this.interval && window.clearInterval(this.interval), super.disconnectedCallback();
  }
  render() {
    if (!this.config) return m;
    if (!this.hass) return c`<ha-card><div class="loading">Mini Graph preview</div></ha-card>`;
    const t = Aa(this.config.show), o = this.series[0], a = o ? Uo(
      Number(o.state),
      bt(this.config.color_thresholds ?? []),
      o.color
    ) : Qe[0], r = [
      this.config.group ? "group" : "",
      t.points === "hover" ? "points-hover" : "",
      t.labels === "hover" || t.labels_secondary === "hover" ? "labels-hover" : ""
    ].filter(Boolean).join(" ");
    return c`
      <ha-card class=${r} tabindex="0" role="button"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        <div class="content ${this.config.animate ? "animate" : ""}"
          style=${`--mini-graph-font-size:${this.config.font_size ?? 100}`}>
          ${this.renderHeader(o, a, t)}
          ${this.renderStates(o, a, t)}
          ${this.loading && t.loading_indicator ? c`<div class="loading"><ha-spinner size="small"></ha-spinner></div>` : this.error ? c`<div class="warning">${this.error}</div>` : this.renderGraph(t)}
          ${this.renderLegend(t)}
          ${this.renderStatistics(t)}
        </div>
      </ha-card>
    `;
  }
  renderHeader(t, o, a) {
    if (!a.name && (!a.icon || this.config?.align_icon === "state")) return m;
    const r = a.icon && this.config?.icon_type !== "none" && this.config?.align_icon !== "state" ? this.renderIcon(t, o, a) : m, n = this.presentation(t);
    return c`
      <div class="header" data-align=${this.config?.align_header ?? "default"}
        style=${`font-size:${this.config?.font_size_header ?? 14}px`}>
        ${this.config?.align_icon === "left" ? r : m}
        ${a.name ? c`
          <span class="name shared-presentation" style=${a.name_adaptive_color ? `color:${o}` : ""}>
            ${n.primary ? c`<span class="ulm-name">${n.primary}</span>` : m}
            ${n.secondary ? c`<span class="ulm-label">${n.secondary}</span>` : m}
          </span>
        ` : m}
        ${this.config?.align_icon !== "left" ? r : m}
      </div>
    `;
  }
  renderIcon(t, o, a) {
    const r = t ? this.hass?.states[t.config.entity] : void 0, n = this.config?.icon_type === "entity-picture" ? r?.attributes.entity_picture : void 0;
    return c`
      <span class="icon" style=${a.icon_adaptive_color ? `color:${o}` : ""}>
        ${this.config?.icon_image ? c`<img src=${this.config.icon_image} alt="">` : n ? c`<img src=${String(n)} alt="">` : c`<ha-icon .icon=${this.config?.icon ?? this.hass?.states[t?.config.entity ?? ""]?.attributes.icon ?? "mdi:chart-line"}></ha-icon>`}
      </span>
    `;
  }
  renderStates(t, o, a) {
    if (!a.state || !t) return m;
    const r = a.state === "last" ? t.points.at(-1)?.value : t.state, n = Number(r), i = this.stateLabel(n, t.points.at(-1)?.label);
    return c`
      <div class="states" data-align=${this.config?.align_state ?? "left"}>
        ${this.renderState(t, i, o, !0)}
        ${this.series.slice(1).filter((l) => l.config.show_state).map((l) => this.renderState(
      l,
      this.stateLabel(Number(l.state), l.points.at(-1)?.label),
      Uo(Number(l.state), bt(this.config?.color_thresholds ?? []), l.color),
      !1
    ))}
        ${a.icon && this.config?.icon_type !== "none" && this.config?.align_icon === "state" ? this.renderIcon(t, o, a) : m}
      </div>
    `;
  }
  presentation(t) {
    if (!this.config) return {};
    const o = t?.config.entity ?? this.config.entity, a = o ? this.hass?.states[o] : void 0, r = le(this.config, a, this.hass), n = A(a), i = (l) => {
      switch (l) {
        case "none":
          return;
        case "state":
          return n;
        case "last-changed":
          return a?.last_changed ? new Date(a.last_changed).toLocaleString() : "Last changed unavailable";
        case "last-updated":
          return a?.last_updated ? new Date(a.last_updated).toLocaleString() : "Last updated unavailable";
        case "name":
          return r;
        default:
          return;
      }
    };
    return {
      primary: this.config.primary_info === void 0 ? r || t?.name : i(this.config.primary_info),
      secondary: this.config.secondary_info === void 0 ? void 0 : i(this.config.secondary_info)
    };
  }
  renderState(t, o, a, r) {
    const n = t.config.state_adaptive_color ? a : "";
    return c`
      <span class="state ${r ? "primary" : "secondary"}" style=${n ? `color:${n}` : ""}>
        ${t.config.show_indicator ? c`<span class="indicator" style=${`background:${a}`}></span>` : m}
        <span class="state-value">${o}</span>
        <span class="unit">${t.unit}</span>
      </span>
    `;
  }
  renderGraph(t) {
    if (!t.graph || !this.series.some((h) => h.config.show_graph !== !1)) return m;
    const o = this.series.filter((h) => h.config.show_graph !== !1 && h.points.length), a = o.filter((h) => h.config.y_axis !== "secondary"), r = o.filter((h) => h.config.y_axis === "secondary"), n = a.flatMap((h) => h.points.map((p) => p.value)), i = r.flatMap((h) => h.points.map((p) => p.value));
    t.graph === "bar" && this.config?.lower_bound === void 0 && n.push(0), t.graph === "bar" && this.config?.lower_bound_secondary === void 0 && i.push(0);
    const l = Go(
      n,
      this.config?.lower_bound,
      this.config?.upper_bound,
      Number(this.config?.min_bound_range ?? 0)
    ), s = Go(
      i,
      this.config?.lower_bound_secondary,
      this.config?.upper_bound_secondary,
      Number(this.config?.min_bound_range_secondary ?? 0)
    ), d = o.flatMap((h) => h.points.map((p) => p.time)), u = Math.min(...d), _ = Math.max(...d);
    return c`
      <div class="graph" style=${`height:${this.config?.height ?? 150}px`}>
        ${t.labels && a.length ? c`
          <div class="labels">
            <span>${this.stateLabel(l.max)}</span>
            <span>${this.stateLabel(l.min)}</span>
          </div>` : m}
        ${t.labels_secondary && r.length ? c`
          <div class="labels secondary">
            <span>${this.stateLabel(s.max)}</span>
            <span>${this.stateLabel(s.min)}</span>
          </div>` : m}
        <svg class="chart" viewBox="0 0 500 ${this.config?.height ?? 150}" preserveAspectRatio="none"
          @click=${(h) => h.stopPropagation()}>
          <defs>
            ${o.map((h, p) => this.renderGradient(h, p, h.config.y_axis === "secondary" ? s : l))}
          </defs>
          ${o.map((h, p) => this.renderSeries(
      h,
      p,
      h.config.y_axis === "secondary" ? s : l,
      u,
      _,
      t,
      o.length
    ))}
        </svg>
      </div>
    `;
  }
  renderGradient(t, o, a) {
    const r = bt(this.config?.color_thresholds ?? []), n = this.config?.color_thresholds_transition ?? "smooth";
    if (!r.length || t.config.color)
      return q`<linearGradient id=${`mini-graph-${o}`}><stop offset="0%" stop-color=${t.color}/><stop offset="100%" stop-color=${t.color}/></linearGradient>`;
    const i = r.flatMap((l, s) => {
      const d = Math.max(0, Math.min(100, 100 - ((l.value ?? a.min) - a.min) / (a.max - a.min) * 100));
      return n === "hard" && s > 0 ? [
        q`<stop offset=${`${d}%`} stop-color=${r[s - 1].color}/>`,
        q`<stop offset=${`${d}%`} stop-color=${l.color}/>`
      ] : [q`<stop offset=${`${d}%`} stop-color=${l.color}/>`];
    });
    return q`<linearGradient id=${`mini-graph-${o}`} x1="0" y1="1" x2="0" y2="0">${i}</linearGradient>`;
  }
  renderSeries(t, o, a, r, n, i, l) {
    const s = Number(this.config?.height ?? 150), d = (b) => {
      const f = this.config?.logarithmic ? Math.log10(Math.max(b, Number.EPSILON)) : b, k = this.config?.logarithmic ? Math.log10(Math.max(a.min, Number.EPSILON)) : a.min, w = this.config?.logarithmic ? Math.log10(Math.max(a.max, Number.EPSILON)) : a.max;
      return s - (f - k) / Math.max(Number.EPSILON, w - k) * s;
    }, u = r === n, _ = t.points.map((b) => ({
      x: u ? 250 : (b.time - r) / Math.max(1, n - r) * 500,
      y: d(b.value),
      value: b.value,
      time: b.time
    })), h = t.config.color ? t.color : `url(#mini-graph-${o})`;
    if (i.graph === "bar") {
      const b = 500 / Math.max(1, Math.min(96, _.length)), f = Number(this.config?.bar_spacing ?? 4), k = Math.max(1, (b - f) / l), w = Math.max(0, Math.min(s, d(0)));
      return q`
        <g class="series">
          ${_.slice(-96).map((T, F) => {
        const B = F * b + o * k + f / 2, J = Math.min(T.y, w);
        return q`<rect x=${B} y=${J} width=${k} height=${Math.abs(w - T.y)} rx="1" fill=${h}>
              <title>${this.tooltip(t, T.value, T.time)}</title>
            </rect>`;
      })}
        </g>
      `;
    }
    const p = _.length === 1 ? [{ ..._[0], x: 0 }, { ..._[0], x: 500 }] : _, y = Ci(p, t.config.smoothing ?? this.config?.smoothing ?? !0), x = _.length ? `${y} L ${p.at(-1).x} ${s} L ${p[0].x} ${s} Z` : "";
    return q`
      <g class="series">
        ${i.fill && t.config.show_fill !== !1 ? q`<path class="fill ${i.fill === "fade" ? "fade" : ""}" d=${x} fill=${h}/>` : m}
        ${t.config.show_line !== !1 ? q`<path class="line" d=${y} stroke=${h} stroke-width=${this.config?.line_width ?? 5}/>` : m}
        ${i.points && t.config.show_points !== !1 ? _.map((b) => q`
            <circle class="point" cx=${b.x} cy=${b.y} r=${Math.max(2, Number(this.config?.line_width ?? 5) / 1.5)}
              fill=${t.config.color ?? h}>
              <title>${this.tooltip(t, b.value, b.time)}</title>
            </circle>`) : m}
      </g>
    `;
  }
  renderLegend(t) {
    const o = this.series.filter((a) => a.config.show_legend !== !1);
    return !t.legend || o.length < 2 ? m : c`
      <div class="legend">
        ${o.map((a) => c`
          <span class="legend-item">
            <span class="indicator" style=${`background:${a.color}`}></span>
            <span>${a.name}${a.config.show_legend_state ? ` (${this.stateLabel(Number(a.state))}${a.unit ? ` ${a.unit}` : ""})` : ""}</span>
          </span>
        `)}
      </div>
    `;
  }
  renderStatistics(t) {
    const o = this.series[0];
    if (!o || !t.average && !t.extrema || !o.points.length) return m;
    const a = o.points.map((l) => l.value), r = Ca(a, "avg"), n = Math.min(...a), i = Math.max(...a);
    return c`
      <div class="statistics">
        ${t.average ? c`<span>Average <b>${this.stateLabel(r)} ${o.unit}</b></span>` : m}
        ${t.extrema ? c`
          <span>Minimum <b>${this.stateLabel(n)} ${o.unit}</b></span>
          <span>Maximum <b>${this.stateLabel(i)} ${o.unit}</b></span>
        ` : m}
      </div>
    `;
  }
  stateLabel(t, o) {
    if (o) return o;
    const a = this.config?.state_map?.[Math.round(t)];
    return a && Math.abs(t - Math.round(t)) < Number.EPSILON ? a.label ?? a.value : Ai(t, this.config?.decimals);
  }
  tooltip(t, o, a) {
    const r = new Date(a).toLocaleString(this.hass?.language, {
      hour12: !(this.config?.hour24 ?? !1)
    });
    return `${t.name}: ${this.stateLabel(o)}${t.unit ? ` ${t.unit}` : ""} · ${r}`;
  }
  restartInterval() {
    this.interval && window.clearInterval(this.interval), this.interval = void 0, !(!this.isConnected || !this.config?.update_interval) && (this.interval = window.setInterval(() => {
      this.loadHistory(!0);
    }, this.config.update_interval * 1e3));
  }
  entityStateSignature() {
    if (!(!this.hass || !this.config))
      return JSON.stringify(Lt(this.config).map((t) => {
        const o = this.hass?.states[t.entity];
        return {
          entity: t.entity,
          attribute: t.attribute,
          value: pt(o, t.attribute),
          lastChanged: o?.last_changed,
          lastUpdated: o?.last_updated
        };
      }));
  }
  singleEntityStateSignature(t) {
    const o = this.hass?.states[t.entity];
    return JSON.stringify({
      value: pt(o, t.attribute),
      lastChanged: o?.last_changed,
      lastUpdated: o?.last_updated
    });
  }
  async loadHistory(t = !1) {
    if (!this.hass || !this.config) return;
    const o = Lt(this.config), a = JSON.stringify({
      entities: o,
      hours: this.config.hours_to_show,
      points: this.config.points_per_hour,
      grouping: this.config.group_by,
      factor: this.config.value_factor,
      map: this.config.state_map,
      state: this.entityStateSignature()
    });
    if (!t && a === this.requestKey) return;
    this.requestKey = a;
    const r = ++this.historyGeneration;
    this.loading = !0, this.error = void 0;
    try {
      const n = Date.now(), i = n - Number(this.config.hours_to_show ?? 24) * 36e5, l = await this.fetchHistory(o, i, n, t, r);
      if (r !== this.historyGeneration) return;
      this.series = o.map((s, d) => this.buildSeries(s, d, l[s.entity] ?? [], i, n)), this.error = this.series.some((s) => s.points.length) ? void 0 : "No recorder history is available for the selected entities.";
    } catch (n) {
      if (r !== this.historyGeneration) return;
      this.error = n instanceof Error ? n.message : "Unable to load recorder history.", console.warn("Mushroom Cards Addition: unable to load Mini Graph history", n);
    } finally {
      r === this.historyGeneration && (this.loading = !1);
    }
  }
  async fetchHistory(t, o, a, r, n) {
    const i = {}, l = [];
    for (const u of t) {
      if (u.fixed_value) continue;
      const _ = r ? void 0 : this.readCache(u, o);
      _ ? i[u.entity] = _ : l.push(u);
    }
    if (!l.length) return i;
    if (!this.hass?.connection?.sendMessagePromise) {
      for (const u of l) i[u.entity] = this.attributeHistory(u);
      return i;
    }
    const s = await this.hass.connection.sendMessagePromise({
      type: "history/history_during_period",
      start_time: new Date(o).toISOString(),
      end_time: new Date(a).toISOString(),
      entity_ids: [...new Set(l.map((u) => u.entity))],
      no_attributes: !1,
      minimal_response: !1,
      significant_changes_only: !1
    }), d = Ei(s, l);
    if (n !== this.historyGeneration) return i;
    for (const u of l) {
      const h = (d.get(u.entity) ?? []).flatMap((p) => {
        if (!p || typeof p != "object") return [];
        const y = p, x = y.state ?? y.s, b = y.attributes ?? y.a ?? {}, f = u.attribute ? u.attribute.split(".").reduce((T, F) => T && typeof T == "object" ? T[F] : void 0, b) : x, k = ht(f, this.config?.state_map ?? []), w = Ii(
          y.last_updated ?? y.last_changed ?? y.lu ?? y.lc,
          a
        );
        return k.value === void 0 || !Number.isFinite(w) ? [] : [{ time: w, value: k.value, label: k.label }];
      });
      i[u.entity] = h.length ? h : this.attributeHistory(u), this.writeCache(u, i[u.entity]);
    }
    return i;
  }
  attributeHistory(t) {
    const o = this.hass?.states[t.entity], a = o?.attributes.history;
    if (Array.isArray(a)) {
      const n = Date.now();
      return a.flatMap((i, l) => {
        const s = typeof i == "object" && i ? i.value ?? i.state : i, d = ht(s, this.config?.state_map ?? []), u = typeof i == "object" && i ? Date.parse(String(i.time ?? i.last_changed ?? "")) : Number.NaN;
        return d.value === void 0 ? [] : [{
          time: Number.isFinite(u) ? u : n - (a.length - l - 1) * 36e5 / Number(this.config?.points_per_hour ?? 0.5),
          value: d.value,
          label: d.label
        }];
      });
    }
    const r = ht(pt(o, t.attribute), this.config?.state_map ?? []);
    return r.value === void 0 ? [] : [{ time: Date.now(), value: r.value, label: r.label }];
  }
  buildSeries(t, o, a, r, n) {
    const i = this.hass?.states[t.entity], l = ht(pt(i, t.attribute), this.config?.state_map ?? []), s = 10 ** Number(this.config?.value_factor ?? 0), d = Date.parse(i?.last_updated ?? i?.last_changed ?? "") || n, u = l.value === void 0 ? a : [
      ...a.filter((x) => x.time !== d),
      { time: d, value: l.value, label: l.label }
    ], h = (t.fixed_value && l.value !== void 0 ? [{ time: r, value: l.value }, { time: n, value: l.value }] : u).map((x) => ({ ...x, value: x.value * s })), p = Mi(
      h,
      this.config ?? {},
      t.aggregate_func ?? this.config?.aggregate_func ?? "avg",
      n
    ), y = Array.isArray(this.config?.line_color) ? this.config.line_color : [this.config?.line_color ?? Qe[0]];
    return {
      config: t,
      points: p,
      color: t.color ?? y[o] ?? Qe[o % Qe.length],
      state: l.value === void 0 ? i?.state : l.value * s,
      unit: t.unit ?? this.config?.unit ?? String(i?.attributes.unit_of_measurement ?? ""),
      name: t.name ?? String(i?.attributes.friendly_name ?? t.entity)
    };
  }
  cacheKey(t) {
    return `mushroom-mini-graph:${t.entity}:${t.attribute ?? "state"}:${this.config?.hours_to_show}:${this.config?.points_per_hour}`;
  }
  readCache(t, o) {
    if (!(!this.config?.cache || typeof localStorage > "u"))
      try {
        const a = JSON.parse(localStorage.getItem(this.cacheKey(t)) ?? "null"), r = Math.max(60, Number(this.config.update_interval ?? 300)) * 1e3;
        return !a || a.stateSignature !== this.singleEntityStateSignature(t) || Date.now() - a.fetchedAt > r ? void 0 : a.points.filter((n) => n.time >= o);
      } catch {
        return;
      }
  }
  writeCache(t, o) {
    if (!(!this.config?.cache || typeof localStorage > "u"))
      try {
        localStorage.setItem(this.cacheKey(t), JSON.stringify({
          fetchedAt: Date.now(),
          stateSignature: this.singleEntityStateSignature(t),
          points: o
        }));
      } catch (a) {
        console.warn("Mushroom Cards Addition: unable to cache Mini Graph history", a);
      }
  }
  runAction(t) {
    if (!this.config) return;
    const o = t === "tap_action" ? "tap" : t === "hold_action" ? "hold" : "double_tap", a = this.config[t], r = typeof a?.entity == "string" ? a.entity : this.config.entity;
    he(this, "hass-action", {
      config: { ...this.config, entity: r },
      action: o
    });
  }
};
so.styles = Le`
    :host { display: block; min-width: 0; }
    ha-card {
      position: relative;
      display: block;
      overflow: hidden;
      box-sizing: border-box;
      border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
      border-radius: var(--mush-card-primary-border-radius, 14px);
      background: var(--ha-card-background, var(--card-background-color, #fff));
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,.08));
      color: var(--primary-text-color);
      cursor: pointer;
    }
    ha-card.group { border: 0; border-radius: 0; box-shadow: none; background: transparent; }
    .content { display: grid; gap: 10px; padding: 14px; }
    .header { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .header[data-align="left"] { justify-content: flex-start; }
    .header[data-align="right"] { justify-content: flex-end; }
    .header[data-align="center"] { justify-content: center; }
    .name { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: var(--mcg-title-font-weight, 500); letter-spacing: var(--mcg-title-letter-spacing); }
    .icon { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: color-mix(in srgb, currentColor 14%, transparent); }
    .icon img { width: 25px; height: 25px; object-fit: contain; border-radius: 50%; }
    .icon ha-icon { --mdc-icon-size: 20px; }
    .states { display: flex; align-items: baseline; gap: 12px; min-width: 0; }
    .states[data-align="right"] { justify-content: flex-end; text-align: right; }
    .states[data-align="center"] { justify-content: center; text-align: center; }
    .state { display: inline-flex; align-items: baseline; gap: 3px; min-width: 0; }
    .state.primary { font-size: calc(var(--mini-graph-font-size, 100) * .01 * 32px); }
    .state.secondary { color: var(--secondary-text-color); font-size: 14px; }
    .state-value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-variant-numeric: tabular-nums; }
    .unit { font-size: .48em; }
    .indicator { width: 8px; height: 8px; border-radius: 50%; flex: 0 0 auto; }
    .graph { position: relative; min-width: 0; }
    svg.chart { display: block; width: 100%; overflow: visible; }
    .series { transition: opacity .15s ease; }
    .line { fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .fill { opacity: .16; }
    .fill.fade { opacity: .24; }
    .point { opacity: 1; transition: opacity .15s ease; }
    ha-card.points-hover .point { opacity: 0; }
    ha-card.points-hover .point:hover { opacity: 1; }
    .labels {
      position: absolute;
      inset: 3px 4px 3px 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      pointer-events: none;
      color: var(--secondary-text-color);
      font-size: 10px;
    }
    .labels.secondary { align-items: flex-end; }
    ha-card.labels-hover .labels { opacity: 0; transition: opacity .15s ease; }
    ha-card.labels-hover .graph:hover .labels { opacity: 1; }
    .legend { display: flex; flex-wrap: wrap; gap: 7px 12px; color: var(--secondary-text-color); font-size: 11px; }
    .legend-item { display: inline-flex; align-items: center; gap: 5px; min-width: 0; }
    .legend-item span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .statistics { display: flex; flex-wrap: wrap; gap: 8px 14px; color: var(--secondary-text-color); font-size: 11px; }
    .statistics b { color: var(--primary-text-color); }
    .loading, .warning { display: grid; place-items: center; min-height: 90px; color: var(--secondary-text-color); font-size: 12px; text-align: center; }
    .warning { color: var(--error-color, #db4437); }
    .animate .series { animation: reveal .8s ease both; transform-origin: bottom; }
    @keyframes reveal { from { opacity: 0; transform: scaleY(.65); } }
  `;
let Ce = so;
_t([
  ue({ attribute: !1 })
], Ce.prototype, "hass");
_t([
  oe()
], Ce.prototype, "config");
_t([
  oe()
], Ce.prototype, "series");
_t([
  oe()
], Ce.prototype, "loading");
_t([
  oe()
], Ce.prototype, "error");
var Pi = Object.defineProperty, re = (e, t, o, a) => {
  for (var r = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = i(t, o, r) || r);
  return r && Pi(t, o, r), r;
};
const ct = "mushroom-addition-area-card-advanced", dt = "mushroom-addition-area-controls-advanced", It = (e) => typeof e != "string" && [
  "domain",
  "type",
  "name",
  "content_info",
  "content",
  "use_entity_picture",
  "icon",
  "icon_color",
  "tap_action",
  "hold_action",
  "double_tap_action"
].some((t) => t in e), Rt = (e) => typeof e != "string" && e.type && e.type !== "entity", Ia = /* @__PURE__ */ new WeakMap(), Ea = /* @__PURE__ */ new WeakMap(), Pa = /* @__PURE__ */ new WeakMap(), za = (e) => {
  if (!It(e)) return e;
  const t = { ...e };
  for (const o of [
    "type",
    "domain",
    "name",
    "content_info",
    "attribute",
    "content",
    "use_entity_picture",
    "icon",
    "icon_color",
    "tap_action",
    "hold_action",
    "double_tap_action",
    "conditions",
    "control"
  ]) delete t[o];
  return e.domain ?? t;
};
function Oe(e, t = !1) {
  return {
    ...e,
    type: "area",
    ...e.features ? { features: e.features.map((o) => {
      if (o.type !== "area-controls") return o;
      if (t) {
        const a = { ...o, ...o.controls ? { controls: o.controls.filter((r) => !Rt(r)).map((r) => {
          const n = za(r);
          return typeof n == "object" && typeof r == "object" && Pa.set(n, r), n;
        }) } : {} };
        return Ia.set(a, o), a.controls && Ea.set(a.controls, o), a;
      }
      return o.controls?.some(It) ? { ...o, type: `custom:${dt}` } : o;
    }) } : {}
  };
}
const $t = (e) => typeof e == "string" || e.domain ? !1 : e.type === "conditional" ? !!(e.control && $t(e.control)) : e.type === "template" ? !!(e.content || e.name) : (e.content_info ?? (e.name ? "name" : e.content ? "custom" : "none")) !== "none", Dt = (e) => e?.features?.some((t) => t.type === "area-controls" && t.controls?.some($t)) ?? !1;
function Ae(e, t) {
  return new Promise((o, a) => {
    const r = window.setTimeout(() => a(new Error(t)), 8e3);
    e.then(
      (n) => {
        window.clearTimeout(r), o(n);
      },
      (n) => {
        window.clearTimeout(r), a(n);
      }
    );
  });
}
async function Da(e) {
  const t = window.loadCardHelpers;
  if (!t) throw new Error("Home Assistant card helpers are unavailable. Open this card in Home Assistant, then retry.");
  const o = await Ae(t(), "Home Assistant card helpers timed out. Retry."), a = await Ae(Promise.resolve(o.createCardElement(e)), "Native Area card timed out. Retry.");
  if (!customElements.get("hui-area-card") || a.localName !== "hui-area-card")
    throw new Error("The installed Home Assistant frontend does not provide the native Area card. Update Home Assistant, then retry.");
  return a;
}
const lo = class lo extends be {
  constructor() {
    super(...arguments), this.loadingControls = !1, this.revision = 0;
  }
  static async getConfigElement() {
    return document.createElement(`${ct}-editor`);
  }
  static getStubConfig(t) {
    return { type: `custom:${ct}`, ...Object.keys(t?.areas ?? {})[0] ? { area: Object.keys(t.areas)[0] } : {} };
  }
  setConfig(t) {
    this.config = t, this.load();
  }
  getCardSize() {
    const t = this.card?.getCardSize?.() ?? 3;
    return Dt(this.config) ? typeof t == "number" ? t + 1 : t.then((o) => o + 1) : t;
  }
  getGridOptions() {
    const t = this.card?.getGridOptions?.() ?? { columns: 12, rows: 3 };
    if (!Dt(this.config) || !t || typeof t != "object") return t;
    const o = t;
    return {
      ...o,
      ...typeof o.rows == "number" ? { rows: o.rows + 1 } : {},
      ...typeof o.min_rows == "number" ? { min_rows: o.min_rows + 1 } : {}
    };
  }
  async load() {
    if (!this.config) return;
    const t = ++this.revision;
    if (this.error = void 0, !this.config.area) {
      this.error = "Select an area in the native Area editor.";
      return;
    }
    const o = Oe(this.config);
    try {
      const a = o.features?.some((r) => r.type === `custom:${dt}`) && !customElements.get("hui-area-controls-card-feature");
      if (this.card) this.card.setConfig(a ? Oe(this.config, !0) : o);
      else {
        const r = await Da(a ? Oe(this.config, !0) : o);
        if (t !== this.revision) return;
        this.card = r;
      }
      if (this.loadingControls = !!a, this.sync(), a) {
        if (await this.updateComplete, await Ae(customElements.whenDefined("hui-area-controls-card-feature"), "The installed frontend cannot load native Area controls. Update Home Assistant, then retry."), t !== this.revision) return;
        this.card.setConfig(o), this.loadingControls = !1;
      }
    } catch (a) {
      t === this.revision && (this.error = String(a instanceof Error ? a.message : a));
    }
  }
  sync() {
    this.card && (this.card.hass = this.hass, this.card.layout = this.layout, Dt(this.config) ? this.card.style.setProperty("--feature-height", "64px") : this.card.style.removeProperty("--feature-height"));
  }
  updated() {
    this.sync();
  }
  render() {
    return this.error ? c`<ha-alert alert-type="error">${this.error}
      <button @click=${() => {
      this.card = void 0, this.load();
    }}>Retry native Area card</button></ha-alert>` : this.card ? c`<div class=${this.loadingControls ? "loading" : "native"}>${this.card}</div>
        ${this.loadingControls ? c`<div role="status">Loading native Area controls…</div>` : m}` : c`<div role="status">Loading native Area card…</div>`;
  }
};
lo.styles = Le`:host { display: block; height: 100%; } .native, hui-area-card { height: 100%; }
    .loading { position: absolute; visibility: hidden; pointer-events: none; }`;
let Ie = lo;
re([
  ue({ attribute: !1 })
], Ie.prototype, "hass");
re([
  ue({ attribute: !1 })
], Ie.prototype, "layout");
re([
  oe()
], Ie.prototype, "error");
re([
  oe()
], Ie.prototype, "card");
re([
  oe()
], Ie.prototype, "loadingControls");
function Ft(e) {
  const t = e.split(".")[0];
  return ["button", "input_button"].includes(t) ? { action: "perform-action", perform_action: `${t}.press`, target: { entity_id: e } } : ["scene", "script"].includes(t) ? { action: "perform-action", perform_action: `${t}.turn_on`, target: { entity_id: e } } : { action: ["light", "switch", "fan", "input_boolean", "automation", "humidifier", "remote", "siren"].includes(t) ? "toggle" : "more-info" };
}
const co = class co extends be {
  constructor() {
    super(...arguments), this.ready = !1, this.groups = /* @__PURE__ */ new Map(), this.conditionals = /* @__PURE__ */ new Map(), this.conditionalErrors = /* @__PURE__ */ new Map(), this.templateValues = /* @__PURE__ */ new Map(), this.templates = /* @__PURE__ */ new Map(), this.generation = 0, this.configRevision = 0;
  }
  static isSupported() {
    return !0;
  }
  setConfig(t) {
    this.config = t, this.configRevision++, this.context = this.context ?? t.area_context, this.position = this.position ?? t.feature_position, this.color = this.color ?? t.feature_color, this.groups.clear(), this.conditionals.clear(), this.conditionalErrors.clear(), this.clearTemplates(), this.load();
  }
  getCardSize() {
    return this.config?.controls?.some($t) ? 2 : 1;
  }
  connectedCallback() {
    super.connectedCallback(), this.requestUpdate();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.clearTemplates(), this.configRevision++, this.conditionals.clear();
  }
  clearTemplates() {
    this.generation++;
    for (const t of this.templates.values()) t.unsubscribe?.();
    this.templates.clear(), this.templateValues.clear();
  }
  updated() {
    if (this.templateConnection !== this.hass?.connection && (this.clearTemplates(), this.templateConnection = this.hass?.connection), !!this.isConnected) {
      for (const [t, o] of (this.config?.controls ?? []).entries())
        if (!(typeof o == "string" || o.type !== "template"))
          for (const a of ["content", "name", "icon", "icon_color"]) {
            const r = o[a];
            if (!r || !/\{[{%#]/.test(r)) continue;
            const n = `${t}:${a}`;
            if (this.templates.get(n)?.template === r) continue;
            const i = { template: r, generation: this.generation, unsubscribe: void 0 };
            if (this.templates.set(n, i), !this.hass?.connection) {
              this.templateValues.set(n, "Template error: Home Assistant template connection unavailable."), this.requestUpdate();
              continue;
            }
            this.hass.connection.subscribeMessage((l) => {
              i.generation === this.generation && (this.templateValues.set(n, l.error ? `Template error: ${String(l.error)}` : String(l.result ?? "")), this.requestUpdate());
            }, { type: "render_template", template: r, variables: {
              config: o,
              entity: o.entity_id,
              user: this.hass.user?.name
            } }).then((l) => {
              i.generation !== this.generation ? l() : i.unsubscribe = l;
            }).catch((l) => {
              i.generation === this.generation && (this.templateValues.set(n, `Template error: ${String(l)}`), this.requestUpdate());
            });
          }
    }
  }
  template(t, o) {
    const a = { ...t };
    for (const r of ["content", "name", "icon", "icon_color"])
      a[r] && /\{[{%#]/.test(a[r]) && (a[r] = this.templateValues.get(`${o}:${r}`) ?? "");
    return a;
  }
  conditional(t, o) {
    if (!t.control) return c`<ha-alert alert-type="error">Conditional control needs a nested button.</ha-alert>`;
    const a = this.conditionalErrors.get(o);
    if (a) return c`<ha-alert alert-type="error">${a}</ha-alert>`;
    if (!this.conditionals.has(o)) {
      this.conditionals.set(o, null);
      const n = this.configRevision, i = window.loadCardHelpers;
      if (!i)
        return this.conditionalErrors.set(o, "Native conditional controls require Home Assistant card helpers."), this.requestUpdate(), m;
      Ae(i().then((l) => l.createCardElement({
        type: "conditional",
        conditions: t.conditions ?? [],
        card: {
          type: `custom:${dt}`,
          controls: [t.control],
          area_context: this.context,
          feature_position: this.position,
          feature_color: this.color
        }
      })), "Native conditional control timed out.").then((l) => {
        if (!(n !== this.configRevision || !this.isConnected)) {
          if (l.localName !== "hui-conditional-card") throw new Error("Native conditional cards are unavailable in this frontend.");
          this.conditionals.set(o, l), this.requestUpdate();
        }
      }).catch((l) => {
        n === this.configRevision && (this.conditionalErrors.set(o, String(l)), this.requestUpdate());
      });
    }
    const r = this.conditionals.get(o);
    return r && (r.preview = !1, r.hass = this.hass), r ?? c`<span role="status">Loading conditional control…</span>`;
  }
  label(t) {
    const o = this.hass?.states[t.entity_id ?? ""];
    if (t.type === "template") return t.content ?? t.name ?? "";
    switch (t.content_info ?? (t.name ? "name" : t.content ? "custom" : "none")) {
      case "name":
        return t.name ?? o?.attributes.friendly_name ?? t.entity_id ?? "";
      case "state":
        return o ? `${o.state}${o.attributes.unit_of_measurement ? ` ${o.attributes.unit_of_measurement}` : ""}` : "";
      case "last-changed":
        return o?.last_changed ? c`<ha-relative-time .hass=${this.hass} .datetime=${o.last_changed}></ha-relative-time>` : "";
      case "last-updated":
        return o?.last_updated ? c`<ha-relative-time .hass=${this.hass} .datetime=${o.last_updated}></ha-relative-time>` : "";
      case "attribute":
        return String(o?.attributes[t.attribute ?? ""] ?? "");
      case "custom":
        return t.content ?? "";
      default:
        return "";
    }
  }
  async load() {
    try {
      await Ae(
        customElements.whenDefined("hui-area-controls-card-feature"),
        "Native Area controls are unavailable. This frontend is not supported; update Home Assistant and retry."
      ), this.ready = !0, this.error = void 0;
    } catch (t) {
      this.error = String(t instanceof Error ? t.message : t);
    }
  }
  group(t, o, a) {
    let r = this.groups.get(o);
    return r || (r = document.createElement("hui-area-controls-card-feature"), r.setConfig({ ...this.config, type: "area-controls", ...t ? { controls: t } : {} }), this.groups.set(o, r)), r.hass = this.hass, r.context = this.context, r.position = this.position, r.color = a?.icon_color ?? this.color, r;
  }
  render() {
    return this.toggleAttribute("named", this.config?.controls?.some($t) ?? !1), this.error ? c`<ha-alert alert-type="error">${this.error}<button @click=${() => {
      this.load();
    }}>Retry</button></ha-alert>` : !this.config || !this.hass || !this.ready ? m : this.config.controls === void 0 ? this.group(void 0, "automatic") : c`${this.config.controls.map((t, o) => {
      const a = typeof t == "object" && t.type === "template" ? this.template(t, o) : t;
      if (!It(a)) return this.group([a], String(o));
      if (a.type === "conditional") return this.conditional(a, o);
      if (a.domain)
        return c`<div class="domain">${this.group([a.domain], String(o), a)}
          ${a.icon || a.tap_action ? c`<ha-alert alert-type="warning">Domain icon and tap overrides require an entity control. Select an entity below instead.</ha-alert>` : m}</div>`;
      const r = a.entity_id ?? "", n = this.hass.states[r], i = !!r && (!n || ["unavailable", "unknown"].includes(n.state)), l = n && !["off", "closed", "locked", "idle", "standby", "unavailable", "unknown"].includes(n.state), s = {
        type: `custom:${ct}`,
        entity: r,
        tap_action: a.tap_action ?? (r ? Ft(r) : { action: "none" }),
        hold_action: a.hold_action,
        double_tap_action: a.double_tap_action
      }, d = a.icon_color, u = d && !["default", "state"].includes(d) ? /^(#|rgb|hsl|var\(|color\()/.test(d) ? d : `var(--${d}-color, ${d})` : l ? this.color ?? "var(--state-active-color, var(--primary-color))" : "var(--state-icon-color)", _ = Object.entries(a).find(([, y]) => typeof y == "string" && y.startsWith("Template error:"));
      if (_) return c`<ha-alert alert-type="error">${_[1]}</ha-alert>`;
      const h = a.use_entity_picture && typeof n?.attributes.entity_picture == "string" ? n.attributes.entity_picture : void 0, p = this.label(a);
      return c`<button class="entity" ?disabled=${i} aria-label=${String((a.name ?? n?.attributes.friendly_name ?? r) || "Area action")}
        aria-pressed=${!!l} style=${`--control-icon-color:${u}`}
        ${Te(s)}>
        <span class="button-icon">${h ? c`<img src=${h} alt="">` : a.icon || !r ? c`<ha-icon .icon=${a.icon || "mdi:gesture-tap-button"}></ha-icon>` : c`<ha-state-icon .hass=${this.hass} .stateObj=${n}></ha-state-icon>`}</span>
        ${p ? c`<span class="button-label">${p}</span>` : m}
      </button>`;
    })}`;
  }
};
co.styles = Le`
    :host { display: flex; gap: 8px; align-items: center; min-width: 0; }
    .domain { min-width: 0; flex: 1; }
    hui-area-controls-card-feature { flex: 1; min-width: 0; }
    hui-conditional-card { flex: 1; min-width: 0; }
    hui-conditional-card[hidden] { display: none !important; }
    .entity { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; min-width: 42px;
      height: var(--feature-height, 42px); border: 0; border-radius: var(--ha-card-border-radius, 12px);
      background: var(--ha-card-background, var(--card-background-color)); cursor: pointer;
      color: var(--control-icon-color); --mdc-icon-size: 24px; }
    .entity[aria-pressed="true"] { background: color-mix(in srgb, var(--control-icon-color) 16%, transparent); }
    .entity:disabled { opacity: .4; cursor: default; }
    .entity:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    :host([named]) { --feature-height: 64px; }
    :host([named]) .entity { height: 64px; padding: 6px 4px; }
    .button-icon { display: flex; align-items: center; justify-content: center; }
    .button-icon img { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; }
    .button-label { margin-top: auto; padding-top: 4px; line-height: 16px; font-size: 11px;
      max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  `;
let ve = co;
re([
  ue({ attribute: !1 })
], ve.prototype, "hass");
re([
  ue({ attribute: !1 })
], ve.prototype, "context");
re([
  ue()
], ve.prototype, "position");
re([
  ue()
], ve.prototype, "color");
re([
  oe()
], ve.prototype, "config");
re([
  oe()
], ve.prototype, "error");
re([
  oe()
], ve.prototype, "ready");
const Je = (e) => {
  const t = za(e);
  return typeof t == "string" ? `domain:${t}` : `entity:${t.entity_id}`;
}, gt = (e) => JSON.stringify(Object.fromEntries(
  Object.entries(e).filter(([t]) => t !== "controls").sort(([t], [o]) => t.localeCompare(o))
));
function zi(e, t) {
  const o = [...e.features ?? []];
  return { ...t, type: e.type, ...t.features ? { features: t.features.map((a) => {
    if (a.type !== "area-controls") return a;
    const r = Ia.get(a) ?? (a.controls && Ea.get(a.controls)), n = o.map((u, _) => ({ item: u, index: _ })).filter(({ item: u }) => u.type === a.type), i = (a.controls ?? []).map(Je);
    n.sort((u, _) => +(gt(_.item) === gt(a)) - +(gt(u.item) === gt(a)) || i.filter((h) => _.item.controls?.some((p) => Je(p) === h)).length - i.filter((h) => u.item.controls?.some((p) => Je(p) === h)).length);
    const l = n.find(({ item: u }) => u === r) ?? n[0];
    if (!l) return a;
    o.splice(l.index, 1);
    const s = [...l.item.controls ?? []].filter((u) => !Rt(u)), d = a.controls?.map((u) => {
      const _ = typeof u == "object" ? Pa.get(u) : void 0, h = _ ? s.indexOf(_) : -1, p = h >= 0 ? h : s.findIndex((x) => Je(x) === Je(u));
      if (p < 0) return u;
      const y = s.splice(p, 1)[0];
      return typeof y == "object" && It(y) ? { ...y, ...typeof u == "object" ? u : {} } : u;
    });
    for (const [u, _] of (l.item.controls ?? []).entries())
      Rt(_) && d?.splice(Math.min(u, d.length), 0, _);
    return { ...a, ...d ? { controls: d } : {} };
  }) } : {} };
}
const uo = class uo extends be {
  constructor() {
    super(...arguments), this.loading = !1, this.conditionsLoading = !1;
  }
  setConfig(t) {
    this.config = t, this.editor ? this.editor.setConfig(Oe(t, !0)) : this.load();
  }
  async load() {
    if (!(this.loading || !this.config)) {
      this.loading = !0;
      try {
        await Da(Oe(this.config, !0));
        const t = customElements.get("hui-area-card");
        if (!t.getConfigElement) throw new Error("The installed native Area editor is unavailable.");
        const o = await Ae(Promise.resolve(t.getConfigElement()), "Native Area editor timed out. Retry.");
        o.setConfig(Oe(this.config, !0)), o.hass = this.hass, o.addEventListener("config-changed", (a) => {
          a.stopPropagation();
          const r = a.detail.config;
          this.selected = void 0, this.commit(zi(this.config, r), !1);
        }), this.editor = o, this.error = void 0;
      } catch (t) {
        this.error = String(t instanceof Error ? t.message : t);
      } finally {
        this.loading = !1;
      }
    }
  }
  commit(t, o = !0) {
    this.config = t, o && this.editor?.setConfig(Oe(t, !0)), he(this, "config-changed", { config: t });
  }
  controls(t, o) {
    const a = [...this.config.features], r = { ...a[t] };
    o === void 0 ? delete r.controls : r.controls = o, a[t] = r, this.commit({ ...this.config, features: a });
  }
  move(t, o, a) {
    const r = [...this.config.features[t].controls];
    if (o < 0 || o >= r.length || a < 0 || a >= r.length || o === a) return;
    const [n] = r.splice(o, 1);
    r.splice(a, 0, n), this.selected = void 0, this.controls(t, r);
  }
  editControl() {
    if (!this.selected) return;
    let t = this.config?.features?.[this.selected.feature]?.controls?.[this.selected.index];
    if (typeof t == "string") return { domain: t };
    for (let o = 0; o < this.selected.depth; o++) t = t?.control;
    return t;
  }
  changeControl(t) {
    if (!this.selected) return;
    const o = [...this.config.features[this.selected.feature].controls], a = (r, n) => n ? { ...r, control: a(r.control ?? {}, n - 1) } : t;
    o[this.selected.index] = a(o[this.selected.index], this.selected.depth), this.controls(this.selected.feature, o);
  }
  newControl(t) {
    return t === "conditional" ? { type: t, conditions: [], control: { type: "entity", entity_id: "", content_info: "name" } } : t === "template" ? { type: t, content: "", icon: "mdi:gesture-tap-button", tap_action: { action: "none" } } : t === "action" ? { type: t, icon: "mdi:gesture-tap-button", tap_action: { action: "none" } } : { type: "entity", entity_id: "", content_info: "name" };
  }
  async ensureConditions() {
    if (!(customElements.get("hui-conditions-editor") || this.conditionsLoading)) {
      this.conditionsLoading = !0;
      try {
        const t = window.loadCardHelpers;
        if (!t) throw new Error("Home Assistant card helpers are unavailable.");
        const a = (await Ae(t().then((r) => r.createCardElement({
          type: "conditional",
          conditions: [],
          card: { type: "markdown", content: "" }
        })), "Native condition editor timed out.")).constructor;
        if (!a.getConfigElement) throw new Error("Native condition editor is unavailable.");
        if (await Ae(Promise.resolve(a.getConfigElement()), "Native condition editor timed out."), !customElements.get("hui-conditions-editor")) throw new Error("This frontend does not provide the native conditions editor.");
        this.conditionsError = void 0;
      } catch (t) {
        this.conditionsError = String(t);
      } finally {
        this.conditionsLoading = !1, this.requestUpdate();
      }
    }
  }
  detail() {
    const t = this.editControl();
    if (!t) return m;
    if (t.domain) return c`<section class="detail" aria-label="Edit native domain group">
      <button @click=${() => {
      this.selected = void 0;
    }}>← Back to buttons</button>
      <h4>Native ${t.domain} group</h4>
      <p>Group membership, icon and actions stay native. Add an entity button for a custom icon, name or action.</p>
      <ha-form .hass=${this.hass} .data=${t} .schema=${[{ name: "icon_color", selector: { ui_color: {} } }]}
        .computeLabel=${() => "Icon color"}
        @value-changed=${(n) => {
      n.stopPropagation(), this.changeControl({ ...t, ...n.detail.value });
    }}></ha-form></section>`;
    const o = t.type ?? "entity", a = [
      { name: "entity_id", ...o === "entity" ? { required: !0 } : {}, selector: { entity: {} } },
      { name: "name", selector: { text: {} } },
      { name: "icon", selector: o === "template" ? { text: {} } : { icon: {} } },
      { name: "icon_color", selector: o === "template" ? { text: {} } : { ui_color: {} } },
      { name: "content_info", selector: { select: {
        mode: "dropdown",
        options: ["none", "name", "state", "last-changed", "last-updated", "attribute", "custom"].map((n) => ({ value: n, label: n.replaceAll("-", " ") }))
      } } },
      { name: "attribute", selector: { text: {} } },
      { name: "content", selector: { text: { multiline: o === "template" } } },
      { name: "use_entity_picture", selector: { boolean: {} } },
      ...["tap_action", "hold_action", "double_tap_action"].map((n) => ({ name: n, selector: { ui_action: {} } }))
    ], r = {
      entity_id: "Entity (any domain)",
      name: "Name (below the icon)",
      icon: "Icon (empty = entity default)",
      icon_color: "Icon color",
      content_info: "Button content",
      attribute: "State attribute",
      content: o === "template" ? "Content template" : "Custom text",
      use_entity_picture: "Use entity picture",
      tap_action: "Tap behavior",
      hold_action: "Hold behavior",
      double_tap_action: "Double-tap behavior"
    };
    return c`<section class="detail" aria-label=${`Edit ${o} button`}>
      <button @click=${() => {
      this.selected.depth ? this.selected = { ...this.selected, depth: this.selected.depth - 1 } : this.selected = void 0;
    }}>← Back to ${this.selected.depth ? "conditional button" : "buttons"}</button>
      <h4>${o === "conditional" ? "Conditional" : o === "template" ? "Template" : o === "action" ? "Action" : "Entity"} button</h4>
      ${o === "conditional" ? c`
        ${this.conditionsError ? c`<ha-alert alert-type="error">${this.conditionsError}<button @click=${() => {
      this.ensureConditions();
    }}>Retry</button></ha-alert>` : m}
        <hui-conditions-editor .hass=${this.hass} .conditions=${t.conditions ?? []}
          @value-changed=${(n) => {
      n.stopPropagation(), this.changeControl({ ...t, conditions: n.detail.value });
    }}></hui-conditions-editor>
        <p>Conditions use Home Assistant's native conditional card, including nested conditions.</p>
        <button @click=${() => {
      this.selected = { ...this.selected, depth: this.selected.depth + 1 };
    }}>Edit nested ${t.control?.type ?? "entity"} button</button>
        <label>Nested button type <select aria-label="Nested button type" .value=${t.control?.type ?? "entity"}
          @change=${(n) => {
      const i = n.target.value;
      this.changeControl({ ...t, control: this.newControl(i) });
    }}>${["entity", "action", "template", "conditional"].map((n) => c`<option value=${n}>${n}</option>`)}</select></label>
      ` : c`
        ${o === "template" ? c`<p>Content, name, icon and icon color accept Home Assistant Jinja templates.
          Templates run in Home Assistant, not in the browser. Errors are shown on the button preview.</p>` : m}
        <ha-form .hass=${this.hass} .data=${{
      ...t,
      tap_action: t.tap_action ?? (t.entity_id ? Ft(t.entity_id) : { action: "none" }),
      hold_action: t.hold_action ?? { action: "none" },
      double_tap_action: t.double_tap_action ?? { action: "none" }
    }} .schema=${a} .computeLabel=${(n) => r[n.name] ?? n.name}
          @value-changed=${(n) => {
      n.stopPropagation();
      const i = { ...t, ...n.detail.value };
      !t.entity_id && i.entity_id && !t.tap_action && (i.tap_action = Ft(i.entity_id)), this.changeControl(i);
    }}></ha-form>`}
    </section>`;
  }
  updated() {
    this.editor && (this.editor.hass = this.hass);
  }
  render() {
    return this.config ? c`${this.error ? c`<ha-alert alert-type="error">${this.error}<button @click=${() => {
      this.load();
    }}>Retry</button></ha-alert>` : this.editor ?? c`Loading native Area editor…`}
      <h3>Advanced area controls</h3>
      <p>Use the native editor above for area, appearance, features and standard domain groups.
        Edit advanced buttons below. Action, template and conditional buttons are intentionally hidden
        from native control lists. Names and content appear below icons, aligned to the button bottom.
        Empty controls show no controls; automatic controls retain Home Assistant defaults.</p>
      ${this.selected ? this.detail() : m}
      ${(this.config.features ?? []).map((t, o) => t.type !== "area-controls" ? m : c`
        <fieldset><legend>Area controls feature ${o + 1}</legend>
          ${t.controls === void 0 ? c`<p>Automatic native domain controls</p>` : m}
          ${(t.controls ?? []).map((a, r) => {
      const n = typeof a == "string" ? a : a.domain, i = typeof a == "string" ? {} : a, l = n ? `Native ${n} group` : (i.type ?? "entity").replace(/^./, (d) => d.toUpperCase()), s = i.name ?? this.hass?.states[i.entity_id ?? ""]?.attributes.friendly_name ?? i.entity_id ?? (i.type === "conditional" ? `${i.control?.type ?? "entity"} button` : i.content ?? "");
      return c`<div class="control" role="listitem"
              @dragstart=${(d) => {
        d.dataTransfer?.setData("text/plain", `${o}:${r}`);
      }}
              @dragover=${(d) => d.preventDefault()}
              @drop=${(d) => {
        d.preventDefault(), d.stopPropagation();
        const [u, _] = (d.dataTransfer?.getData("text/plain") ?? "").split(":").map(Number);
        u === o && Number.isInteger(_) && this.move(o, _, r);
      }}>
              <span class="drag" draggable="true" role="button" tabindex="0" aria-label="Drag to reorder; Alt plus arrow keys to move"
                @keydown=${(d) => {
        d.altKey && ["ArrowUp", "ArrowDown"].includes(d.key) && (d.preventDefault(), this.move(o, r, r + (d.key === "ArrowUp" ? -1 : 1)));
      }}>⠿</span>
              <div class="row-label"><strong>${l}</strong><span>${s}</span></div>
              <button aria-label="Edit button" @click=${() => {
        this.selected = { feature: o, index: r, depth: 0 }, i.type === "conditional" && this.ensureConditions();
      }}>✎</button>
              <button ?disabled=${r === 0} aria-label="Move control up" @click=${() => {
        this.move(o, r, r - 1);
      }}>↑</button>
              <button ?disabled=${r === t.controls.length - 1} aria-label="Move control down" @click=${() => {
        this.move(o, r, r + 1);
      }}>↓</button>
              <button aria-label="Remove control" @click=${() => {
        this.selected = void 0, this.controls(o, t.controls.filter((d, u) => u !== r));
      }}>×</button>
            </div>`;
    })}
          <label>${t.controls === void 0 ? "Replace automatic controls" : "Add button"}
            <select aria-label="Add button type" .value=${""} @change=${(a) => {
      const r = a.target, n = this.newControl(r.value), i = [...t.controls ?? [], n];
      this.controls(o, i), this.selected = { feature: o, index: i.length - 1, depth: 0 }, r.value = "", n.type === "conditional" && this.ensureConditions();
    }}>
              <option value="" disabled selected>Add button…</option>
              ${["entity", "action", "conditional", "template"].map((a) => c`<option value=${a}>${a.replace(/^./, (r) => r.toUpperCase())}</option>`)}
            </select>
          </label>
          <button @click=${() => {
      this.selected = void 0, this.controls(o, void 0);
    }}>Use automatic native controls</button>
          <button @click=${() => {
      this.selected = void 0, this.controls(o, []);
    }}>Clear controls</button>
        </fieldset>`)}
      <button @click=${() => this.commit({ ...this.config, features: [...this.config.features ?? [], { type: "area-controls", controls: [] }] })}>Add area controls feature</button>` : m;
  }
};
uo.styles = Le`fieldset { border: 1px solid var(--divider-color); margin: 16px 0; border-radius: 12px; }
    .control { display: flex; align-items: center; gap: 8px; min-height: 56px; border-bottom: 1px solid var(--divider-color); }
    .row-label { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .row-label span { color: var(--secondary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .drag { cursor: grab; font-size: 24px; padding: 8px; }
    .detail { border: 1px solid var(--divider-color); border-radius: 12px; padding: 16px; }
    button, select { color: var(--primary-text-color); background: var(--secondary-background-color);
      border: 1px solid var(--divider-color); border-radius: 8px; padding: 8px; margin: 8px 0; }
    button { cursor: pointer; } button:disabled { opacity: .4; }
    button:focus-visible, select:focus-visible, .drag:focus-visible { outline: 2px solid var(--primary-color); }
    @media (max-width: 420px) { .control { gap: 4px; } .control button { padding: 6px; } }`;
let xe = uo;
re([
  ue({ attribute: !1 })
], xe.prototype, "hass");
re([
  oe()
], xe.prototype, "config");
re([
  oe()
], xe.prototype, "editor");
re([
  oe()
], xe.prototype, "error");
re([
  oe()
], xe.prototype, "selected");
re([
  oe()
], xe.prototype, "conditionsError");
customElements.get(dt) || customElements.define(dt, ve);
customElements.get(`${ct}-editor`) || customElements.define(`${ct}-editor`, xe);
const Di = (e, t, o = [], a = []) => {
  const r = [...o, ...a, ...Object.keys(t?.states ?? {})], n = [...new Set(r)].filter((l) => t?.states?.[l] !== void 0), i = n.filter((l) => !["unavailable", "unknown"].includes(t?.states?.[l]?.state.toLowerCase() ?? ""));
  for (const l of e.preferredDomains ?? []) {
    const s = i.find((d) => d.startsWith(`${l}.`)) ?? n.find((d) => d.startsWith(`${l}.`));
    if (s) return s;
  }
  return i[0] ?? n[0];
}, Ti = (e) => e.name.replace(/ (Card|Chip)$/, ""), Ta = (e, t, o = [], a = []) => {
  const r = [.../* @__PURE__ */ new Set([...o, ...a, ...Object.keys(t?.states ?? {})])].filter((S) => t?.states?.[S] !== void 0), n = (S) => {
    const V = t?.states[S];
    return [
      S,
      V?.attributes.friendly_name,
      V?.attributes.device_class,
      V?.attributes.unit_of_measurement
    ].filter(Boolean).join(" ").toLowerCase();
  }, i = (S) => [
    ...S.filter((V) => !["unavailable", "unknown"].includes(t?.states[V]?.state.toLowerCase() ?? "")),
    ...S.filter((V) => ["unavailable", "unknown"].includes(t?.states[V]?.state.toLowerCase() ?? ""))
  ], l = (S) => !["unavailable", "unknown"].includes(t?.states[S]?.state.toLowerCase() ?? ""), s = (S, V) => i(r.filter((M) => S.some((P) => M.startsWith(`${P}.`)) && V.every((P) => n(M).includes(P))))[0], d = (S, V, M) => i(r.filter((P) => S.some(($) => P.startsWith(`${$}.`)) && V.every(($) => n(P).includes($)) && M.every(($) => !n(P).includes($))))[0], u = (S, V, M = []) => r.find((P) => l(P) && S.some(($) => P.startsWith(`${$}.`)) && V.every(($) => n(P).split(/[^a-z0-9]+/).includes($)) && M.every(($) => !n(P).includes($))), _ = (S, V = [], M = []) => i(r.filter((P) => {
    const $ = t?.states[P], H = n(P);
    return P.startsWith("sensor.") && S.includes(String($?.attributes.device_class ?? "")) && V.every((C) => H.includes(C)) && M.every((C) => !H.includes(C));
  }))[0], h = r.filter((S) => /^sensor\.inverter_4/i.test(S)).sort((S, V) => S.localeCompare(V, void 0, { numeric: !0 })), p = (S, V = [], M = []) => r.find((P) => {
    const $ = t?.states[P], H = n(P);
    return l(P) && P.startsWith("sensor.") && S.includes(String($?.attributes.device_class ?? "")) && V.every((C) => H.includes(C)) && M.every((C) => !H.includes(C));
  }), y = r.filter((S) => S.startsWith("media_player.") && n(S).includes("sonos")).sort((S, V) => Eo(t, V) - Eo(t, S))[0], x = e.upstreamId === "advanced_home_energy_management" ? s(["sensor"], ["hems", "house", "consumption"]) ?? s(["sensor"], ["house", "consumption"]) ?? _(["power"]) : e.upstreamId === "advanced_energy_buy_sell" ? s(["sensor"], ["hems", "price", "overview"]) ?? s(["sensor"], ["price", "overview"]) ?? s(["sensor"], ["hems", "price"]) : e.upstreamId === "advanced_energy_panel_health" ? h[0] : e.upstreamId === "mini_graph_card" ? _(["temperature"]) ?? _(["power", "energy"]) ?? s(["sensor"], []) : e.upstreamId === "card_media_player" ? s(["media_player"], ["office", "joris", "tv"]) : e.upstreamId === "card_battery" ? d(["sensor"], ["battery", "level"], ["state", "charging"]) ?? _(["battery"], [], ["state", "charging"]) : e.upstreamId === "custom_card_pollen" ? s(["sensor"], ["pollen", "grass"]) : e.upstreamId === "custom_card_speedtest_gauges" ? s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) : e.upstreamId === "custom_card_tablet" ? s(["binary_sensor", "sensor", "switch"], ["tablet"]) : e.upstreamId === "custom_card_nas_metrics" ? s(["switch", "binary_sensor"], ["nas"]) ?? s(["switch", "binary_sensor"], ["status"]) : e.upstreamId === "custom_card_washer" ? s(["sensor"], ["operation", "state"]) ?? s(["sensor"], ["washer", "state"]) : e.upstreamId === "custom_card_sun" ? s(["sun"], []) : e.upstreamId === "custom_card_media_player_sonos" ? y : e.upstreamId === "custom_card_printer" ? s(["sensor", "binary_sensor"], ["printer"]) ?? s(["sensor", "binary_sensor"], ["online"]) : e.upstreamId === "custom_card_weather_metrics" ? s(["weather"], []) : e.upstreamId === "card_room" ? s(["light"], []) : e.upstreamId === "custom_card_plant" ? s(["plant"], []) ?? s(["sensor"], ["soil", "humidity"]) : e.upstreamId === "custom_card_playstation" ? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["xbox"]) ?? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["playstation"]) ?? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["nintendo"]) ?? s(["media_player", "remote"], []) : void 0, f = (e.upstreamId === "card_scenes" ? u(["light"], ["office", "joris"]) ?? u(["light"], []) ?? u(["climate"], []) ?? u(["sensor"], []) : void 0) ?? x ?? Di(e, t, o, a), k = e.upstreamId === "advanced_energy_panel_health" ? h : void 0, w = e.upstreamId === "custom_card_plant" ? {
    moisture_entity: (f && t?.states[f]?.attributes.device_class === "moisture" ? f : void 0) ?? p(["moisture"], ["soil"]) ?? p(["moisture"]),
    temperature_entity: p(["temperature"], ["soil"]) ?? p(["temperature"], ["plant"]),
    humidity_entity: p(["humidity"], ["plant"]) ?? p(["humidity"], ["soil"]),
    conductivity_entity: p(["conductivity"], ["plant"]) ?? u(["sensor"], ["conductivity"]),
    illuminance_entity: p(["illuminance"], ["plant"]) ?? u(["sensor"], ["plant", "illuminance"]),
    dli_entity: u(["sensor"], ["dli"])
  } : {}, T = Object.entries(w).filter(([, S]) => S).map(([S]) => S.replace(/_entity$/, "")), F = ["text", "navigation"].includes(e.family), B = e.variants?.[0], J = f?.split(".", 1)[0], Q = ["light", "switch", "input_boolean", "fan"].includes(J ?? "") ? { action: "toggle" } : { action: f ? "more-info" : "none" }, L = (S, V) => [...new Set(S.filter((M) => !!M))].slice(0, V), O = s(["sensor"], ["outdoor", "temperature"]) ?? s(["sensor"], ["outside", "temperature"]) ?? s(["sensor"], ["garden", "temperature"]) ?? _(["temperature"], [], ["battery", "cpu", "soil"]), ee = s(["sensor"], ["date", "time"]) ?? s(["sensor"], ["time", "date"]) ?? s(["sensor"], ["date"]), j = [
    [p(["humidity"]), "Humidity"],
    [
      p(["wind_speed"]) ?? u(["sensor"], ["wind", "speed"]) ?? u(["sensor"], ["wind"]),
      "Wind"
    ],
    [
      p(["atmospheric_pressure"]) ?? u(["sensor"], ["barometric", "pressure"]) ?? u(["sensor"], ["pressure"], ["blood"]),
      "Pressure"
    ],
    [
      p(["precipitation", "precipitation_intensity"]) ?? u(["sensor"], ["precipitation"]) ?? u(["sensor"], ["rain"]),
      "Precipitation"
    ],
    [u(["sensor"], ["visibility"]), "Visibility"],
    [u(["sensor"], ["cloud", "coverage"]), "Cloud cover"],
    [u(["sensor"], ["uv", "index"]), "UV index"],
    [p(["illuminance"]), "Light level"],
    [u(["sensor"], ["dew", "point"]), "Dew point"]
  ], te = da(t, f), ne = j.filter(
    ([S], V, M) => !!S && M.findIndex(([P]) => P === S) === V
  ).slice(0, 4), me = e.upstreamId === "custom_card_sun" || e.upstreamId === "custom_card_pollen" || e.upstreamId === "card_welcome_scenes" ? { action: "none" } : e.upstreamId === "custom_card_speedtest_gauges" ? {
    action: "perform-action",
    perform_action: "homeassistant.update_entity",
    target: {
      entity_id: [
        s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) ?? f,
        s(["sensor"], ["speedtest", "upload"]) ?? s(["sensor"], ["upload"]),
        s(["sensor"], ["speedtest", "ping"]) ?? s(["sensor"], ["ping"])
      ].filter((S) => !!S)
    }
  } : e.upstreamId === "custom_card_playstation" ? { action: f ? "more-info" : "none", entity: f } : e.upstreamId === "advanced_home_energy_management" ? { action: "navigate", navigation_path: "/hems-tower/savings-overview" } : e.upstreamId === "custom_card_plant" ? { action: "more-info" } : Q;
  return {
    ...ba(e, t, f),
    name: [
      "advanced_home_energy_management",
      "advanced_energy_buy_sell",
      "advanced_energy_panel_health",
      "custom_card_media_player_sonos"
    ].includes(e.upstreamId) ? void 0 : f ? t?.states[f]?.attributes.friendly_name : Ti(e),
    secondary: f ? void 0 : F ? "Example" : "Preview",
    variant: B,
    tap_action: me,
    show_controls: ["climate", "vacuum", "control"].includes(e.family) || e.family === "media" && e.upstreamId !== "card_media_player" ? !0 : void 0,
    show_forecast: e.family === "weather",
    show_graph: ["battery", "energy", "sensor"].includes(e.family),
    entities: e.upstreamId === "mini_graph_card" && f ? [f] : e.variants?.includes("with-sensors") ? a.slice(0, 2) : void 0,
    panel_entities: k?.length ? k : void 0,
    ...e.upstreamId === "advanced_home_energy_management" ? {
      grid_power_entity: s(["sensor"], ["p1", "meter", "power"]),
      grid_phase_1_entity: s(["sensor"], ["p1", "meter", "power", "phase", "1"]),
      grid_phase_2_entity: s(["sensor"], ["p1", "meter", "power", "phase", "2"]),
      grid_phase_3_entity: s(["sensor"], ["p1", "meter", "power", "phase", "3"]),
      solar_power_entity: s(["sensor"], ["hems", "pv", "power"]),
      solar_forecast_entity: s(["sensor"], ["energy", "production", "today"]),
      battery_level_entity: s(["sensor"], ["zendure", "total", "state", "charge"]),
      battery_power_entity: s(["sensor"], ["zendure", "power"]),
      battery_1_level_entity: s(["sensor"], ["zendure", "1", "state", "charge"]),
      battery_1_power_entity: s(["sensor"], ["zendure", "1", "power"]),
      battery_2_level_entity: s(["sensor"], ["zendure", "2", "state", "charge"]),
      battery_2_power_entity: s(["sensor"], ["zendure", "2", "power"]),
      battery_3_level_entity: s(["sensor"], ["zendure", "3", "state", "charge"]),
      battery_3_power_entity: s(["sensor"], ["zendure", "3", "power"]),
      ev_charger_power_entity: s(["sensor"], ["alfen", "active", "power", "socket", "1"]),
      energy_mode_entity: s(["input_select", "select"], ["zendure", "operation", "mode"]),
      energy_auto_control_entity: s(["input_boolean", "binary_sensor", "switch"], ["hems", "auto", "control"]),
      electricity_price_entity: s(["sensor"], ["nordpool", "kwh", "nl", "eur"]),
      tariff_markup_entity: s(["sensor", "input_number"], ["hems", "rate", "markup"]),
      tariff_vat_entity: s(["sensor", "input_number"], ["hems", "vat", "percentage"])
    } : {},
    ...e.upstreamId === "custom_card_washer" ? {
      program_stage_entity: s(["sensor", "select"], ["wasmachine", "program"]) ?? s(["sensor", "select"], ["washer", "program"]) ?? s(["sensor", "select"], ["washer", "job"]) ?? f,
      washer_power_entity: s(["sensor", "switch"], ["wasmachine", "power"]) ?? s(["sensor", "switch"], ["washer", "power"]) ?? s(["sensor", "switch"], ["power"]),
      door_entity: s(["sensor", "binary_sensor"], ["washer", "door"]) ?? s(["sensor", "binary_sensor"], ["door"]),
      finished_entity: s(["sensor", "binary_sensor"], ["washer", "finished"]) ?? s(["sensor", "binary_sensor"], ["finished"]),
      ulm_custom_card_washer_machine_stop_state: "stop",
      ulm_custom_card_washer_label_idle: "idle",
      ulm_custom_card_washer_label_configuring: "configure",
      ulm_custom_card_washer_label_running: "run"
    } : {},
    ...e.upstreamId === "custom_card_sun" ? {
      darkMode: !1,
      language: t?.language ?? "en",
      showMoon: !0,
      moon_entity: d(["sensor"], ["moon", "phase"], ["angle"]) ?? s(["sensor"], ["moon"]),
      moon_altitude_entity: s(["sensor"], ["moon", "altitude"]),
      moon_azimuth_entity: s(["sensor"], ["moon", "azimuth"]),
      moon_rising_entity: s(["sensor"], ["moon", "rising"]) ?? s(["sensor"], ["moon", "rise"]),
      moon_setting_entity: s(["sensor"], ["moon", "setting"]) ?? s(["sensor"], ["moon", "set"]),
      moon_next_full_moon_entity: s(["sensor"], ["moon", "next", "full"]),
      moon_next_new_moon_entity: s(["sensor"], ["moon", "next", "new"]),
      moon_above_horizon_entity: s(["sensor", "binary_sensor"], ["moon", "above", "horizon"]),
      timeFormat: "24h"
    } : {},
    ...e.upstreamId === "custom_card_tablet" ? {
      tablet_button_usb_entity: s(["switch", "input_boolean"], ["tablet", "usb"]),
      tablet_button_motion_entity: s(["switch", "input_boolean"], ["tablet", "motion"]),
      tablet_button_display_entity: s(["light", "switch", "input_boolean"], ["tablet", "display"]),
      tablet_restart_entity: s(["button"], ["tablet", "restart"]),
      tablet_maintenance_entity: s(["switch", "input_boolean"], ["tablet", "maintenance"]),
      tablet_reload_entity: s(["button"], ["tablet", "reload"]),
      tablet_ram_entity: s(["sensor"], ["tablet", "ram"]),
      tablet_disk_entity: s(["sensor"], ["tablet", "disk"]),
      tablet_power_entity: s(["sensor", "binary_sensor", "switch"], ["tablet", "power"]),
      battery_entity: s(["sensor"], ["tablet", "battery"])
    } : {},
    ...e.upstreamId === "custom_card_nas_metrics" ? {
      disk_entity: s(["sensor"], ["nas", "disk"]) ?? s(["sensor"], ["disk"]),
      disk_name: "Disk",
      disk_icon: "mdi:harddisk",
      disk_color: "red",
      temperature_entity: s(["sensor"], ["nas", "temp"]) ?? s(["sensor"], ["temperature"]),
      temperature_name: "Temp",
      temperature_icon: "mdi:thermometer",
      temperature_color: "orange",
      temperature_max: 100,
      memory_entity: s(["sensor"], ["nas", "memory"]) ?? s(["sensor"], ["memory"]),
      memory_name: "Memory",
      memory_icon: "mdi:memory",
      memory_color: "blue",
      memory_max: 100,
      cpu_entity: s(["sensor"], ["nas", "cpu"]) ?? s(["sensor"], ["cpu"]),
      cpu_name: "CPU",
      cpu_icon: "mdi:cpu-64-bit",
      cpu_color: "green",
      cpu_max: 100
    } : {},
    ...e.upstreamId === "custom_card_speedtest_gauges" ? {
      download_entity: s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) ?? f,
      upload_entity: s(["sensor"], ["speedtest", "upload"]) ?? s(["sensor"], ["upload"]),
      ping_entity: s(["sensor"], ["speedtest", "ping"]) ?? s(["sensor"], ["ping"])
    } : {},
    ...e.upstreamId === "custom_card_roomview" ? {
      entity: void 0,
      group_lights: s(["group", "light"], ["lights"]),
      group_motions: s(["group", "binary_sensor"], ["motions"]),
      group_doors: s(["group", "binary_sensor"], ["doors"]),
      group_windows: s(["group", "binary_sensor"], ["windows"]),
      group_outlets: s(["group", "switch"], ["outlets"]),
      group_tv: s(["group", "media_player"], ["tv"]),
      group_water: s(["group", "binary_sensor"], ["water"]),
      group_windows_shutters: s(["group", "cover"], ["shutters"]),
      temperature: s(["sensor"], ["room", "temperature"]) ?? s(["sensor"], ["temperature"]),
      humidity: s(["sensor"], ["room", "humidity"]) ?? s(["sensor"], ["humidity"])
    } : {},
    ...e.upstreamId === "custom_card_room_overview" ? {
      ulm_custom_card_room_overview_light_entity: s(["light"], ["room"]) ?? s(["light"], []),
      ulm_custom_card_room_overview_climate_entity: s(["climate"], ["room"]) ?? s(["climate"], []),
      ulm_custom_card_room_overview_cover_entity: s(["cover"], ["room"]) ?? s(["cover"], [])
    } : {},
    ...e.upstreamId === "custom_card_welcome" ? {
      ulm_card_welcome_collapse: s(["input_boolean"], ["welcome"]),
      ulm_weather: s(["weather"], [])
    } : {},
    ...e.upstreamId === "custom_card_pollen" ? {
      trees_entity: s(["sensor"], ["pollen", "trees"]) ?? s(["sensor"], ["tree", "pollen"]),
      grass_entity: s(["sensor"], ["pollen", "grass"]) ?? s(["sensor"], ["grass", "pollen"]) ?? f,
      weeds_entity: s(["sensor"], ["pollen", "weeds"]) ?? s(["sensor"], ["weed", "pollen"])
    } : {},
    ...e.upstreamId === "custom_card_plant" ? {
      entity: f,
      ulm_card_flower_entity: f,
      ulm_card_flower_name: f ? t?.states[f]?.attributes.friendly_name : "No name set",
      ulm_card_flower_show_bars: T.length ? T : ["moisture"],
      ...w
    } : {},
    ...e.upstreamId === "card_room" ? {
      room_sensors: [
        s(["sensor"], ["illuminance"]),
        s(["sensor"], ["temperature"])
      ].filter((S) => !!S).map((S) => at(t, S)),
      room_status: [],
      room_secondary_parts: [],
      room_temperature_entity: s(["sensor"], ["temperature"]),
      room_brightness_entity: f?.startsWith("light.") ? f : void 0,
      ulm_card_dynamic_color: !1,
      room_light_entity: s(["light"], ["room"]) ?? s(["light"], [])
    } : {},
    ...e.upstreamId === "card_scenes" ? {
      scene_items: r.filter((S) => S.startsWith("scene.")).slice(0, 7).map((S) => tt(t, S))
    } : {},
    ...e.upstreamId === "card_welcome_scenes" ? {
      name: void 0,
      secondary: "Scenes",
      collapse_entity: s(["input_boolean"], ["collapse"]) ?? s(["input_boolean"], ["dropdown"]) ?? s(["input_boolean"], []),
      scene_items: r.filter((S) => S.startsWith("scene.")).slice(0, 5).map((S) => tt(t, S))
    } : {},
    ...e.upstreamId === "custom_card_weather_metrics" ? {
      entity: s(["weather"], []) ?? f,
      temperature_entity: O,
      date_entity: ee,
      entities: ne.map(([S]) => S),
      ulm_custom_card_weather_metrics: s(["weather"], []) ?? f,
      ulm_custom_card_weather_metrics_temperature_outside: O,
      ulm_custom_card_weather_metrics_date: ee,
      ...Object.fromEntries(ne.flatMap(([S, V], M) => [
        [`ulm_custom_card_weather_metrics_entity_${M + 1}`, S],
        [`ulm_custom_card_weather_metrics_name_${M + 1}`, V]
      ]))
    } : {},
    ...e.upstreamId === "custom_card_media_player_sonos" ? {
      use_media_info: !0,
      show_volume_level: !0,
      volume_controls: ["volume_mute", "volume_set", "volume_buttons"],
      media_controls: ["on_off", "shuffle", "previous", "play_pause_stop", "next", "repeat"],
      collapsible_controls: !0
    } : {},
    ...e.upstreamId === "custom_card_printer" ? {
      black_entity: s(["sensor"], ["black"]),
      yellow_entity: s(["sensor"], ["yellow"]),
      magenta_entity: s(["sensor"], ["magenta"]),
      cyan_entity: s(["sensor"], ["cyan"])
    } : {},
    ...e.upstreamId === "custom_card_playstation" ? {
      console_platform: te === "generic" ? "auto" : te,
      console_show_artwork: !0,
      console_show_controls: !0,
      ...Jt(t, f)
    } : {},
    ...e.upstreamId === "custom_card_entity_carousel" ? {
      carousel_loop: !0,
      carousel_show_labels: !0,
      carousel_visible_items: 7,
      carousel_initial_index: 0,
      carousel_effect: "coverflow",
      carousel_grab_cursor: !0,
      carousel_centered_slides: !0,
      carousel_slides_per_view: "auto",
      carousel_coverflow_rotate: 0,
      carousel_coverflow_stretch: 0,
      carousel_coverflow_depth: 400,
      carousel_coverflow_modifier: 1,
      carousel_coverflow_slide_shadows: !0,
      carousel_items: L(a, 7).map((S) => ({
        entity: S,
        name: t?.states[S]?.attributes.friendly_name,
        icon: t?.states[S]?.attributes.icon,
        color: "primary",
        tap_action: { action: "more-info" },
        hold_action: { action: "none" }
      }))
    } : {}
  };
}, Oi = "0.0.1";
for (const e of Mt)
  if (!customElements.get(e.tag)) {
    if (e.upstreamId === "area_card_advanced") {
      customElements.define(e.tag, Ie);
      continue;
    }
    if (e.upstreamId === "mini_graph_card") {
      customElements.define(e.tag, Ce);
      continue;
    }
    const t = e;
    class o extends Ve {
      constructor() {
        super(...arguments), this.descriptor = t;
      }
      static getStubConfig(r, n = [], i = []) {
        return Ta(t, r, n, i);
      }
    }
    customElements.define(e.tag, o);
  }
for (const e of qt) {
  if (customElements.get(e.tag)) continue;
  const t = kt.find((n) => n.upstreamId === e.targetId);
  if (!t) throw new Error(`Missing alias target ${e.targetId}.`);
  const o = t, a = e.variant;
  class r extends Ve {
    constructor() {
      super(...arguments), this.descriptor = o;
    }
    static getStubConfig(i, l = [], s = []) {
      const d = Ta(o, i, l, s);
      return a === "divider-title" ? {
        ...d,
        type: `custom:${e.tag}`,
        entity: void 0,
        variant: a,
        name: "Title",
        navigation_path: "",
        tap_action: { action: "none" }
      } : a === "divider-subtitle" ? {
        ...d,
        type: `custom:${e.tag}`,
        entity: void 0,
        variant: a,
        name: "Subtitle",
        tap_action: { action: "none" }
      } : {
        ...d,
        type: `custom:${e.tag}`,
        variant: a,
        show_forecast: e.tag === "mushroom-addition-card-weather-ulm" ? !1 : d.show_forecast
      };
    }
    setConfig(i) {
      super.setConfig({ ...i, variant: i.variant ?? a });
    }
  }
  customElements.define(e.tag, r);
}
window.customCards = window.customCards || [];
const Ni = new Set(window.customCards.map((e) => e.type));
for (const e of Mt)
  Ni.has(e.tag) || window.customCards.push({
    type: e.tag,
    name: e.upstreamId === "area_card_advanced" ? "Mushroom Addition - Area card advanced" : `Mushroom Addition: ${e.name}`,
    description: e.description,
    preview: !0,
    documentationURL: "https://github.com/snfx-johaver/mushroom-cards-addition"
  });
console.info(
  `%c MUSHROOM-CARDS-ADDITION %c ${Oi} · ${Mt.length} components `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;"
);
export {
  Mt as CATALOG
};
//# sourceMappingURL=mushroom-cards-addition.js.map
