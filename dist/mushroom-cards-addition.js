const ke = globalThis, Le = ke.ShadowRoot && (ke.ShadyCSS === void 0 || ke.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, qe = /* @__PURE__ */ Symbol(), Ye = /* @__PURE__ */ new WeakMap();
let Vt = class {
  constructor(t, a, r) {
    if (this._$cssResult$ = !0, r !== qe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = a;
  }
  get styleSheet() {
    let t = this.o;
    const a = this.t;
    if (Le && t === void 0) {
      const r = a !== void 0 && a.length === 1;
      r && (t = Ye.get(a)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && Ye.set(a, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Bt = (e) => new Vt(typeof e == "string" ? e : e + "", void 0, qe), xt = (e, ...t) => {
  const a = e.length === 1 ? e[0] : t.reduce((r, o, n) => r + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + e[n + 1], e[0]);
  return new Vt(a, e, qe);
}, Nt = (e, t) => {
  if (Le) e.adoptedStyleSheets = t.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of t) {
    const r = document.createElement("style"), o = ke.litNonce;
    o !== void 0 && r.setAttribute("nonce", o), r.textContent = a.cssText, e.appendChild(r);
  }
}, Ze = Le ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let a = "";
  for (const r of t.cssRules) a += r.cssText;
  return Bt(a);
})(e) : e;
const { is: Ht, defineProperty: Wt, getOwnPropertyDescriptor: Gt, getOwnPropertyNames: Kt, getOwnPropertySymbols: Yt, getPrototypeOf: Zt } = Object, Se = globalThis, Je = Se.trustedTypes, Jt = Je ? Je.emptyScript : "", Qt = Se.reactiveElementPolyfillSupport, me = (e, t) => e, Ve = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Jt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let a = e;
  switch (t) {
    case Boolean:
      a = e !== null;
      break;
    case Number:
      a = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        a = JSON.parse(e);
      } catch {
        a = null;
      }
  }
  return a;
} }, Fe = (e, t) => !Ht(e, t), Qe = { attribute: !0, type: String, converter: Ve, reflect: !1, useDefault: !1, hasChanged: Fe };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Se.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let re = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, a = Qe) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(t, a), !a.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), o = this.getPropertyDescriptor(t, r, a);
      o !== void 0 && Wt(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, a, r) {
    const { get: o, set: n } = Gt(this.prototype, t) ?? { get() {
      return this[a];
    }, set(i) {
      this[a] = i;
    } };
    return { get: o, set(i) {
      const l = o?.call(this);
      n?.call(this, i), this.requestUpdate(t, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Qe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(me("elementProperties"))) return;
    const t = Zt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(me("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(me("properties"))) {
      const a = this.properties, r = [...Kt(a), ...Yt(a)];
      for (const o of r) this.createProperty(o, a[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const a = litPropertyMetadata.get(t);
      if (a !== void 0) for (const [r, o] of a) this.elementProperties.set(r, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [a, r] of this.elementProperties) {
      const o = this._$Eu(a, r);
      o !== void 0 && this._$Eh.set(o, a);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const a = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const o of r) a.unshift(Ze(o));
    } else t !== void 0 && a.push(Ze(t));
    return a;
  }
  static _$Eu(t, a) {
    const r = a.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
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
    const t = /* @__PURE__ */ new Map(), a = this.constructor.elementProperties;
    for (const r of a.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Nt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, a, r) {
    this._$AK(t, r);
  }
  _$ET(t, a) {
    const r = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, r);
    if (o !== void 0 && r.reflect === !0) {
      const n = (r.converter?.toAttribute !== void 0 ? r.converter : Ve).toAttribute(a, r.type);
      this._$Em = t, n == null ? this.removeAttribute(o) : this.setAttribute(o, n), this._$Em = null;
    }
  }
  _$AK(t, a) {
    const r = this.constructor, o = r._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const n = r.getPropertyOptions(o), i = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : Ve;
      this._$Em = o;
      const l = i.fromAttribute(a, n.type);
      this[o] = l ?? this._$Ej?.get(o) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, a, r, o = !1, n) {
    if (t !== void 0) {
      const i = this.constructor;
      if (o === !1 && (n = this[t]), r ??= i.getPropertyOptions(t), !((r.hasChanged ?? Fe)(n, a) || r.useDefault && r.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(i._$Eu(t, r)))) return;
      this.C(t, a, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, a, { useDefault: r, reflect: o, wrapped: n }, i) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, i ?? a ?? this[t]), n !== !0 || i !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (a = void 0), this._$AL.set(t, a)), o === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (a) {
      Promise.reject(a);
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
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, n] of r) {
        const { wrapped: i } = n, l = this[o];
        i !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, n, l);
      }
    }
    let t = !1;
    const a = this._$AL;
    try {
      t = this.shouldUpdate(a), t ? (this.willUpdate(a), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(a)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(a);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((a) => a.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq &&= this._$Eq.forEach((a) => this._$ET(a, this[a])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
re.elementStyles = [], re.shadowRootOptions = { mode: "open" }, re[me("elementProperties")] = /* @__PURE__ */ new Map(), re[me("finalized")] = /* @__PURE__ */ new Map(), Qt?.({ ReactiveElement: re }), (Se.reactiveElementVersions ??= []).push("2.1.2");
const Re = globalThis, Xe = (e) => e, xe = Re.trustedTypes, et = xe ? xe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, It = "$lit$", G = `lit$${Math.random().toFixed(9).slice(2)}$`, St = "?" + G, Xt = `<${St}>`, X = document, pe = () => X.createComment(""), he = (e) => e === null || typeof e != "object" && typeof e != "function", Ue = Array.isArray, ea = (e) => Ue(e) || typeof e?.[Symbol.iterator] == "function", Ce = `[ 	
\f\r]`, ue = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, tt = /-->/g, at = />/g, Y = RegExp(`>|${Ce}(?:([^\\s"'>=/]+)(${Ce}*=${Ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), rt = /'/g, ot = /"/g, Pt = /^(?:script|style|textarea|title)$/i, At = (e) => (t, ...a) => ({ _$litType$: e, strings: t, values: a }), s = At(1), nt = At(2), ie = /* @__PURE__ */ Symbol.for("lit-noChange"), p = /* @__PURE__ */ Symbol.for("lit-nothing"), it = /* @__PURE__ */ new WeakMap(), Q = X.createTreeWalker(X, 129);
function zt(e, t) {
  if (!Ue(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return et !== void 0 ? et.createHTML(t) : t;
}
const ta = (e, t) => {
  const a = e.length - 1, r = [];
  let o, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", i = ue;
  for (let l = 0; l < a; l++) {
    const d = e[l];
    let m, f, y = -1, u = 0;
    for (; u < d.length && (i.lastIndex = u, f = i.exec(d), f !== null); ) u = i.lastIndex, i === ue ? f[1] === "!--" ? i = tt : f[1] !== void 0 ? i = at : f[2] !== void 0 ? (Pt.test(f[2]) && (o = RegExp("</" + f[2], "g")), i = Y) : f[3] !== void 0 && (i = Y) : i === Y ? f[0] === ">" ? (i = o ?? ue, y = -1) : f[1] === void 0 ? y = -2 : (y = i.lastIndex - f[2].length, m = f[1], i = f[3] === void 0 ? Y : f[3] === '"' ? ot : rt) : i === ot || i === rt ? i = Y : i === tt || i === at ? i = ue : (i = Y, o = void 0);
    const g = i === Y && e[l + 1].startsWith("/>") ? " " : "";
    n += i === ue ? d + Xt : y >= 0 ? (r.push(m), d.slice(0, y) + It + d.slice(y) + G + g) : d + G + (y === -2 ? l : g);
  }
  return [zt(e, n + (e[a] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class be {
  constructor({ strings: t, _$litType$: a }, r) {
    let o;
    this.parts = [];
    let n = 0, i = 0;
    const l = t.length - 1, d = this.parts, [m, f] = ta(t, a);
    if (this.el = be.createElement(m, r), Q.currentNode = this.el.content, a === 2 || a === 3) {
      const y = this.el.content.firstChild;
      y.replaceWith(...y.childNodes);
    }
    for (; (o = Q.nextNode()) !== null && d.length < l; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const y of o.getAttributeNames()) if (y.endsWith(It)) {
          const u = f[i++], g = o.getAttribute(y).split(G), v = /([.?@])?(.*)/.exec(u);
          d.push({ type: 1, index: n, name: v[2], strings: g, ctor: v[1] === "." ? ra : v[1] === "?" ? oa : v[1] === "@" ? na : Pe }), o.removeAttribute(y);
        } else y.startsWith(G) && (d.push({ type: 6, index: n }), o.removeAttribute(y));
        if (Pt.test(o.tagName)) {
          const y = o.textContent.split(G), u = y.length - 1;
          if (u > 0) {
            o.textContent = xe ? xe.emptyScript : "";
            for (let g = 0; g < u; g++) o.append(y[g], pe()), Q.nextNode(), d.push({ type: 2, index: ++n });
            o.append(y[u], pe());
          }
        }
      } else if (o.nodeType === 8) if (o.data === St) d.push({ type: 2, index: n });
      else {
        let y = -1;
        for (; (y = o.data.indexOf(G, y + 1)) !== -1; ) d.push({ type: 7, index: n }), y += G.length - 1;
      }
      n++;
    }
  }
  static createElement(t, a) {
    const r = X.createElement("template");
    return r.innerHTML = t, r;
  }
}
function se(e, t, a = e, r) {
  if (t === ie) return t;
  let o = r !== void 0 ? a._$Co?.[r] : a._$Cl;
  const n = he(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== n && (o?._$AO?.(!1), n === void 0 ? o = void 0 : (o = new n(e), o._$AT(e, a, r)), r !== void 0 ? (a._$Co ??= [])[r] = o : a._$Cl = o), o !== void 0 && (t = se(e, o._$AS(e, t.values), o, r)), t;
}
class aa {
  constructor(t, a) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = a;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: a }, parts: r } = this._$AD, o = (t?.creationScope ?? X).importNode(a, !0);
    Q.currentNode = o;
    let n = Q.nextNode(), i = 0, l = 0, d = r[0];
    for (; d !== void 0; ) {
      if (i === d.index) {
        let m;
        d.type === 2 ? m = new ye(n, n.nextSibling, this, t) : d.type === 1 ? m = new d.ctor(n, d.name, d.strings, this, t) : d.type === 6 && (m = new ia(n, this, t)), this._$AV.push(m), d = r[++l];
      }
      i !== d?.index && (n = Q.nextNode(), i++);
    }
    return Q.currentNode = X, o;
  }
  p(t) {
    let a = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, a), a += r.strings.length - 2) : r._$AI(t[a])), a++;
  }
}
class ye {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, a, r, o) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = a, this._$AM = r, this.options = o, this._$Cv = o?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const a = this._$AM;
    return a !== void 0 && t?.nodeType === 11 && (t = a.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, a = this) {
    t = se(this, t, a), he(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== ie && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ea(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && he(this._$AH) ? this._$AA.nextSibling.data = t : this.T(X.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: a, _$litType$: r } = t, o = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = be.createElement(zt(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === o) this._$AH.p(a);
    else {
      const n = new aa(o, this), i = n.u(this.options);
      n.p(a), this.T(i), this._$AH = n;
    }
  }
  _$AC(t) {
    let a = it.get(t.strings);
    return a === void 0 && it.set(t.strings, a = new be(t)), a;
  }
  k(t) {
    Ue(this._$AH) || (this._$AH = [], this._$AR());
    const a = this._$AH;
    let r, o = 0;
    for (const n of t) o === a.length ? a.push(r = new ye(this.O(pe()), this.O(pe()), this, this.options)) : r = a[o], r._$AI(n), o++;
    o < a.length && (this._$AR(r && r._$AB.nextSibling, o), a.length = o);
  }
  _$AR(t = this._$AA.nextSibling, a) {
    for (this._$AP?.(!1, !0, a); t !== this._$AB; ) {
      const r = Xe(t).nextSibling;
      Xe(t).remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Pe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, a, r, o, n) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = a, this._$AM = o, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = p;
  }
  _$AI(t, a = this, r, o) {
    const n = this.strings;
    let i = !1;
    if (n === void 0) t = se(this, t, a, 0), i = !he(t) || t !== this._$AH && t !== ie, i && (this._$AH = t);
    else {
      const l = t;
      let d, m;
      for (t = n[0], d = 0; d < n.length - 1; d++) m = se(this, l[r + d], a, d), m === ie && (m = this._$AH[d]), i ||= !he(m) || m !== this._$AH[d], m === p ? t = p : t !== p && (t += (m ?? "") + n[d + 1]), this._$AH[d] = m;
    }
    i && !o && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ra extends Pe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class oa extends Pe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class na extends Pe {
  constructor(t, a, r, o, n) {
    super(t, a, r, o, n), this.type = 5;
  }
  _$AI(t, a = this) {
    if ((t = se(this, t, a, 0) ?? p) === ie) return;
    const r = this._$AH, o = t === p && r !== p || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== p && (r === p || o);
    o && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ia {
  constructor(t, a, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    se(this, t);
  }
}
const sa = Re.litHtmlPolyfillSupport;
sa?.(be, ye), (Re.litHtmlVersions ??= []).push("3.3.3");
const la = (e, t, a) => {
  const r = a?.renderBefore ?? t;
  let o = r._$litPart$;
  if (o === void 0) {
    const n = a?.renderBefore ?? null;
    r._$litPart$ = o = new ye(t.insertBefore(pe(), n), n, void 0, a ?? {});
  }
  return o._$AI(e), o;
};
const Oe = globalThis;
class oe extends re {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = la(a, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return ie;
  }
}
oe._$litElement$ = !0, oe.finalized = !0, Oe.litElementHydrateSupport?.({ LitElement: oe });
const ca = Oe.litElementPolyfillSupport;
ca?.({ LitElement: oe });
(Oe.litElementVersions ??= []).push("4.2.2");
const da = (e) => (t, a) => {
  a !== void 0 ? a.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const ua = { attribute: !0, type: String, converter: Ve, reflect: !1, hasChanged: Fe }, _a = (e = ua, t, a) => {
  const { kind: r, metadata: o } = a;
  let n = globalThis.litPropertyMetadata.get(o);
  if (n === void 0 && globalThis.litPropertyMetadata.set(o, n = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(a.name, e), r === "accessor") {
    const { name: i } = a;
    return { set(l) {
      const d = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(i, d, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(i, void 0, e, l), l;
    } };
  }
  if (r === "setter") {
    const { name: i } = a;
    return function(l) {
      const d = this[i];
      t.call(this, l), this.requestUpdate(i, d, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function Ae(e) {
  return (t, a) => typeof a == "object" ? _a(e, t, a) : ((r, o, n) => {
    const i = o.hasOwnProperty(n);
    return o.constructor.createProperty(n, r), i ? Object.getOwnPropertyDescriptor(o, n) : void 0;
  })(e, t, a);
}
function ma(e) {
  return Ae({ ...e, state: !0, attribute: !1 });
}
const pa = [
  "battery",
  "binary_sensor",
  "binary_sensor_alert",
  "cover",
  "fan",
  "generic",
  "generic_swap",
  "graph",
  "input_boolean",
  "light",
  "media_player",
  "navigate",
  "person",
  "power_outlet",
  "room",
  "scenes",
  "script",
  "thermostat",
  "title",
  "vacuum",
  "vertical_button",
  "weather",
  "weather_ulm",
  "welcome_scenes"
], ha = [
  "afvalophaling",
  "alarm_time",
  "apexcharts",
  "bar_card",
  "camera",
  "chromecast",
  "damix48_power_details",
  "device_tracker",
  "drealine_roomview",
  "eraycetinay_elapsed_time",
  "eraycetinay_lock",
  "esh_room",
  "esh_welcome",
  "haven_washer",
  "heat_pump",
  "homeassistant_updates",
  "httpedo13_sun",
  "httpedo13_thermostat",
  "iAbadia_battery_chip",
  "imswel_medias",
  "imswel_person",
  "input_datetime",
  "input_number",
  "irmajavi_entities",
  "irmajavi_speedtest",
  "irmajavi_weather",
  "light_colorpick",
  "media_player_sonos",
  "more_power_outlet",
  "mpse_gauge",
  "mpse_printer",
  "mpse_thermostat",
  "mpse_wifisignal",
  "nas",
  "neekster_update",
  "nik_clock",
  "nik_door",
  "nik_nas",
  "nik_tablet",
  "paddy_dwd_pollen",
  "paddy_waste_collection",
  "paddy_welcome",
  "person_chip",
  "person_info",
  "person_info_small",
  "playstation",
  "qubino",
  "ristou_person",
  "saxel_fan",
  "scenes",
  "schumijo_car",
  "schumijo_flower",
  "senoro_win",
  "sisimomo_printer",
  "speedtest_shogun160",
  "tpx01_aircondition",
  "vncntdev_device_tracer",
  "water_heater",
  "wilbiev_subtitle",
  "wilbiev_title",
  "wsly_pollen",
  "yagrasdemonde_lights_count"
], st = (e) => e.replace(/^iAbadia/, "iAbadia").split("_").map((t) => ["nas", "mdi", "dwd", "vnc", "wifi", "http"].includes(t.toLowerCase()) ? t.toUpperCase() : `${t[0].toUpperCase()}${t.slice(1)}`).join(" "), ba = (e) => e === "custom_card_bar_card" ? "bar" : e === "custom_card_alarm_time" ? "alarm-time" : e === "custom_card_nik_door" ? "door" : /alarm|alert|lock/.test(e) ? "security" : /navigate|back/.test(e) ? "navigation" : /battery/.test(e) ? "battery" : /power_outlet|more_power_outlet/.test(e) ? "control" : /energy|power|gauge|speedtest|wifisignal|graph|apex|bar_card|myenedis/.test(e) ? "energy" : /weather|sun|pollen|moon/.test(e) ? "weather" : /scene/.test(e) ? "scene" : /person|tracker|tracer|presence|room|welcome/.test(e) ? "presence" : /media|chromecast|playstation/.test(e) ? "media" : /thermostat|heat_pump|aircondition|temperature|simple_temp/.test(e) ? "climate" : /cover|door|garage/.test(e) ? "cover" : /vacuum/.test(e) ? "vacuum" : /light/.test(e) ? "light" : /fan|outlet|boolean|script|washer|water_heater|qubino/.test(e) ? "control" : /input_number|input_datetime/.test(e) ? "sensor" : /title|subtitle|clock|date/.test(e) ? "text" : /camera/.test(e) ? "camera" : /sensor|elapsed|update|printer|nas|tablet|flower|car|afval|waste|counter/.test(e) ? "sensor" : "entity", ga = {
  card_binary_sensor: ["default", "alert"],
  card_generic: ["default", "swapped"],
  card_light: ["default", "slider", "compact"],
  card_media_player: ["default", "controls", "artwork"],
  card_weather: ["compact", "forecast", "no-external-resource"],
  card_person: ["default", "small"],
  card_room: ["default", "with-sensors"],
  card_vertical_button: ["default", "custom-state"],
  card_scenes: ["list", "welcome"],
  card_cover: ["default"],
  card_power_outlet: ["default"],
  card_thermostat: ["default"],
  card_vacuum: ["default"],
  custom_card_playstation: ["ps5", "xbox"],
  custom_card_httpedo13_thermostat: ["buttons", "collapse"],
  custom_card_imswel_medias: ["library", "upcoming"],
  custom_card_paddy_welcome: ["message", "weather", "news"]
}, ya = (e, t) => e === "custom_card_alarm_time" ? ["input_boolean"] : e === "custom_card_nik_door" ? ["sensor"] : /alarm/.test(e) ? ["alarm_control_panel"] : /lock/.test(e) ? ["lock"] : /power_outlet|more_power_outlet/.test(e) ? ["switch", "light"] : e.includes("binary_sensor") ? ["binary_sensor"] : e.includes("battery") ? ["sensor"] : e.includes("input_boolean") ? ["input_boolean"] : e.includes("input_number") ? ["input_number", "counter", "select", "input_select"] : e.includes("input_datetime") ? ["input_datetime"] : e.includes("light") ? ["light"] : /media|chromecast|playstation/.test(e) ? ["media_player", "sensor"] : e === "custom_card_qubino" ? ["light"] : /thermostat|heat_pump|aircondition/.test(e) ? ["climate"] : /scene/.test(e) ? ["scene"] : /script/.test(e) ? ["script"] : /vacuum/.test(e) ? ["vacuum"] : /weather/.test(e) ? ["weather"] : /person/.test(e) ? ["person", "device_tracker"] : /cover|door|garage/.test(e) ? ["cover", "binary_sensor"] : /fan/.test(e) ? ["fan"] : /camera/.test(e) ? ["camera"] : /lock/.test(e) ? ["lock"] : /update/.test(e) ? ["update"] : t === "battery" || t === "energy" || t === "sensor" || t === "weather" ? ["sensor"] : t === "control" ? /fan/.test(e) ? ["fan"] : /script/.test(e) ? ["script"] : /washer/.test(e) ? ["switch", "sensor"] : /water_heater/.test(e) ? ["water_heater"] : ["switch", "input_boolean", "light"] : t === "presence" ? ["person", "device_tracker"] : ["sensor", "switch"], lt = (e, t) => {
  const a = e.replace(/^custom_(card|chip)_/, "").replace(/^(card|chip)_/, ""), r = e.replaceAll("_", "-").toLowerCase(), o = r.startsWith("custom-card-") ? `mushroom-addition-${r}` : `mushroom-addition-card-${r.replace(/^card-/, "")}`, n = ba(e), i = e === "custom_card_playstation";
  return {
    upstreamId: e,
    sourcePath: t,
    kind: "card",
    category: e.startsWith("custom_") ? "custom-card" : "default-card",
    family: n,
    tag: o,
    name: i ? "PS4 Card" : `${st(a)} Card`,
    description: i ? "Source-faithful media artwork card for a PlayStation entity." : `Mushroom-style ${st(a).toLowerCase()} card.`,
    variants: ga[e],
    variantLabels: e === "custom_card_paddy_welcome" ? { message: "Welcome message", weather: "Welcome with weather", news: "Welcome with news" } : void 0,
    preferredDomains: ya(e, n)
  };
}, jt = [
  ...pa.map((e) => {
    const t = {
      graph: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/2-line_cards/card_graph.yaml",
      scenes: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_scenes_welcome.yaml",
      title: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/title/card_title.yaml",
      vertical_button: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/vertical_buttons/vertical_buttons.yaml"
    };
    return lt(
      `card_${e}`,
      t[e] ?? `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_${e}.yaml`
    );
  }),
  ...ha.map((e) => lt(
    `custom_card_${e}`,
    `custom_cards/custom_card_${e}`
  ))
], Dt = [
  {
    canonical: "card_binary_sensor",
    sources: { card_binary_sensor: "default", card_binary_sensor_alert: "alert" },
    variants: ["default", "alert"],
    variantLabels: { default: "Standard sensor", alert: "Alert sensor" }
  },
  {
    canonical: "card_generic",
    sources: { card_generic: "default", card_generic_swap: "swapped" },
    variants: ["default", "swapped"],
    variantLabels: { default: "Icon first", swapped: "Icon last" }
  },
  {
    canonical: "card_weather",
    sources: { card_weather: "detailed", card_weather_ulm: "native" },
    variants: ["detailed", "native"],
    variantLabels: { detailed: "Detailed forecast", native: "Compact native weather" }
  },
  {
    canonical: "card_scenes",
    sources: { card_scenes: "welcome-pills", custom_card_scenes: "scene-grid" },
    variants: ["welcome-pills", "scene-grid"],
    variantLabels: { "welcome-pills": "Welcome scene pills", "scene-grid": "Scene button grid" },
    name: "Scenes Card"
  },
  {
    canonical: "card_title",
    sources: {
      card_title: "title-and-subtitle",
      custom_card_wilbiev_title: "divider-title",
      custom_card_wilbiev_subtitle: "divider-subtitle"
    },
    variants: ["title-and-subtitle", "divider-title", "divider-subtitle"],
    variantLabels: {
      "title-and-subtitle": "Title and subtitle",
      "divider-title": "Divider title",
      "divider-subtitle": "Divider subtitle"
    },
    name: "Heading Card"
  },
  {
    canonical: "custom_card_person_info",
    sources: {
      custom_card_person_info: "full",
      custom_card_person_info_small: "small"
    },
    variants: ["full", "small"],
    variantLabels: { full: "Full person details", small: "Compact person details" },
    name: "Person Info Card"
  }
], le = /* @__PURE__ */ new Map();
for (const e of Dt)
  for (const t of Object.keys(e.sources)) le.set(t, e);
const Ct = new Set(Dt.map((e) => e.canonical)), ze = jt.filter((e) => !le.has(e.upstreamId) || Ct.has(e.upstreamId)).map((e) => {
  const t = le.get(e.upstreamId);
  return t ? {
    ...e,
    name: t.name ?? e.name,
    description: t.description ?? e.description,
    variants: t.variants,
    variantLabels: t.variantLabels,
    sourceIds: Object.keys(t.sources)
  } : { ...e, sourceIds: [e.upstreamId] };
}), Be = jt.filter((e) => le.has(e.upstreamId) && !Ct.has(e.upstreamId)).map((e) => {
  const t = le.get(e.upstreamId), a = ze.find((r) => r.upstreamId === t.canonical);
  return {
    upstreamId: e.upstreamId,
    tag: e.tag,
    targetId: a.upstreamId,
    targetTag: a.tag,
    variant: t.sources[e.upstreamId]
  };
}), je = ze, fa = (e) => je.find((t) => t.tag === e) ?? (() => {
  const t = Be.find((a) => a.tag === e);
  return t ? ze.find((a) => a.tag === t.targetTag) : void 0;
})(), ct = (e) => le.get(e)?.sources[e], Te = [
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
], Et = (e, t, a = e.enabledByDefault) => ({
  preset: e.preset,
  enabled: a,
  entity: t,
  label: e.label,
  icon: e.icon,
  color: e.color
}), va = () => Te.map((e) => Et(e)), J = (e) => {
  if (e.waste_streams?.length) return e.waste_streams.map((r) => ({ ...r }));
  const t = e.type.includes("custom-card-afvalophaling"), a = Te.some((r) => r.legacyKey && typeof e[r.legacyKey] == "string");
  return !t && !a ? [] : Te.map((r, o) => {
    const i = (r.legacyKey && typeof e[r.legacyKey] == "string" ? e[r.legacyKey] : void 0) ?? (o === 0 ? e.entity : void 0);
    return Et(r, i, i ? !0 : r.enabledByDefault);
  });
}, wa = (e) => {
  const t = e.type.includes("custom-card-afvalophaling"), a = e.today_entity ?? (typeof e.ulm_card_ophaling_vandaag == "string" ? e.ulm_card_ophaling_vandaag : void 0), r = e.tomorrow_entity ?? (typeof e.ulm_card_ophaling_morgen == "string" ? e.ulm_card_ophaling_morgen : void 0);
  if (!t && !a && !r) return e;
  const o = e.waste_streams?.length ? e.waste_streams : J(e);
  return {
    ...e,
    waste_streams: o.length ? o : e.waste_streams,
    today_entity: a,
    tomorrow_entity: r,
    show_today: e.show_today ?? !!a,
    show_tomorrow: e.show_tomorrow ?? !!r
  };
}, O = /* @__PURE__ */ new Set([
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
]), b = (e) => {
  if (!e) return "Entity unavailable";
  const t = e.attributes.unit_of_measurement;
  return t ? `${e.state} ${String(t)}` : e.state.replaceAll("_", " ");
}, j = (e, t) => e.name_mode === "none" ? "" : e.name_mode === "entity" ? t?.attributes.friendly_name || e.entity || "Mushroom Addition" : e.name || t?.attributes.friendly_name || e.entity || "Mushroom Addition", ne = (e, t, a) => {
  e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    composed: !0,
    detail: a
  }));
}, $a = (e, t, a) => {
  ne(e, "hass-action", { config: t, action: a });
}, ka = (e) => {
  const t = Ia(e), a = Va(t), r = String(t.type), o = r.includes("card-title"), n = r.includes("card-welcome-scenes"), i = r.includes("card-weather"), l = r.includes("card-weather-ulm") || t.variant === "native", d = r.includes("custom-card-httpedo13-sun") || r.includes("custom-card-httpedo13-thermostat") ? { action: "none" } : void 0, m = String(a.type).includes("custom-card-qubino") ? a.qubino_more_info_entity ?? a.entity : void 0, f = m ? { action: "more-info", entity: m } : a.navigation_path ? { action: "navigate", navigation_path: a.navigation_path } : d ?? { action: o || n ? "none" : a.entity ? "more-info" : "none" }, y = String(e.type).includes("card-room") && a.input_select_entity && a.input_select_option ? {
    action: "perform-action",
    perform_action: "input_select.select_option",
    target: { entity_id: a.input_select_entity },
    data: { option: a.input_select_option }
  } : void 0;
  return {
    ...a,
    show_icon: a.show_icon ?? !0,
    show_state: a.show_state ?? !0,
    name_mode: a.name_mode ?? (t.name ? "custom" : "entity"),
    icon_type: a.icon_type ?? (t.use_entity_picture ? "entity-picture" : t.show_icon === !1 ? "none" : "icon"),
    layout: a.layout ?? "default",
    fill_container: a.fill_container ?? !1,
    primary_info: a.primary_info ?? "name",
    secondary_info: a.secondary_info ?? "default",
    tap_action: a.tap_action ?? f,
    show_controls: a.show_controls ?? (r.includes("card-vacuum") ? !0 : void 0),
    show_forecast: a.show_forecast ?? (i ? !l : void 0),
    hold_action: a.hold_action ?? (a.variant === "small" && typeof a.ulm_card_person_battery_entity == "string" ? { action: "more-info", entity: a.ulm_card_person_battery_entity } : void 0),
    double_tap_action: a.double_tap_action ?? y
  };
}, te = (e, t) => Object.entries(e).find(([a, r]) => t.test(a) && r !== void 0)?.[1], Va = (e) => {
  const t = te(e, /_name$/), a = te(e, /_icon$/), r = te(e, /_color$/), o = te(e, /_enable_(controls|buttons)$/), n = te(e, /_enable_slider$/), i = te(e, /_enable_horizontal$/);
  return {
    ...e,
    name: e.name ?? (typeof e.ulm_card_navigate_title == "string" ? e.ulm_card_navigate_title : typeof t == "string" ? t : void 0),
    icon: e.icon ?? (typeof e.ulm_card_navigate_icon == "string" ? e.ulm_card_navigate_icon : typeof a == "string" ? a : void 0),
    icon_color: e.icon_color ?? (typeof r == "string" ? r : void 0),
    navigation_path: e.navigation_path ?? (typeof e.ulm_card_navigate_path == "string" ? e.ulm_card_navigate_path : void 0),
    show_controls: e.show_controls ?? (typeof o == "boolean" ? o : typeof n == "boolean" ? n : void 0),
    layout: e.layout ?? (i === !0 ? "horizontal" : void 0)
  };
}, xa = [
  "ulm_card_person_entity",
  "ulm_card_light_entity",
  "ulm_card_weather_entity",
  "ulm_card_media_player_entity",
  "ulm_card_thermostat_entity",
  "ulm_card_cover_entity",
  "ulm_card_vacuum_entity",
  "ulm_card_graph_entity",
  "ulm_card_imswel_person_entity",
  "ulm_card_input_number_entity",
  "ulm_custom_card_irmajavi_entities",
  "ulm_custom_card_irmajavi_weather"
], Ia = (e) => {
  const t = wa(e), a = t.primary_entity || xa.map((n) => t[n]).find((n) => typeof n == "string"), r = (n) => {
    if (typeof n == "string") return n;
    if (n && typeof n == "object" && "entity_id" in n && typeof n.entity_id == "string")
      return n.entity_id;
  }, o = {
    ...t,
    entity: t.entity ?? a,
    primary_entity: void 0
  };
  if (String(e.type).includes("card-person") && (o.battery_entity ??= r(e.ulm_card_person_battery), o.eta_entity ??= r(e.ulm_card_person_eta), o.address_entity ??= r(e.ulm_address), o.use_entity_picture ??= typeof e.ulm_card_person_use_entity_picture == "boolean" ? e.ulm_card_person_use_entity_picture : void 0), String(e.type).includes("card-power-outlet") && (o.consumption_entity ??= r(e.ulm_card_power_outlet_consumption_sensor)), String(e.type).includes("card-room") && (o.input_select_entity ??= r(e.ulm_input_select), o.input_select_option ??= typeof e.ulm_input_select_option == "string" ? e.ulm_input_select_option : void 0), String(e.type).includes("card-thermostat") && (o.fan_entity ??= r(e.ulm_card_thermostat_fan_entity), o.thermostat_minimum_temp_spread ??= typeof e.ulm_card_thermostat_minimum_temp_spread == "number" ? e.ulm_card_thermostat_minimum_temp_spread : void 0, o.thermostat_temp_step ??= typeof e.ulm_card_thermostat_temp_step == "number" ? e.ulm_card_thermostat_temp_step : void 0), String(e.type).includes("nik-nas") && (o.temperature_entity ??= r(e.entity_1), o.memory_entity ??= r(e.entity_2), o.cpu_entity ??= r(e.entity_3), o.disk_entity ??= r(e.entity_4)), String(e.type).includes("nik-tablet") && (o.entity ??= r(e.ulm_custom_card_nik_tablet_main), o.battery_entity ??= r(e.ulm_custom_card_nik_tablet_battery), o.tablet_button_usb_entity ??= r(e.ulm_custom_card_nik_tablet_button1), o.tablet_button_motion_entity ??= r(e.ulm_custom_card_nik_tablet_button2), o.tablet_button_display_entity ??= r(e.ulm_custom_card_nik_tablet_button3), o.tablet_restart_entity ??= r(e.ulm_custom_card_nik_tablet_restart), o.tablet_reload_entity ??= r(e.ulm_custom_card_nik_tablet_reload), o.tablet_maintenance_entity ??= r(e.ulm_custom_card_nik_tablet_maintenance), o.tablet_ram_entity ??= r(e.ulm_custom_card_nik_tablet_par1), o.tablet_disk_entity ??= r(e.ulm_custom_card_nik_tablet_par2), o.tablet_power_entity ??= r(e.ulm_custom_card_nik_tablet_par3)), String(e.type).includes("card-welcome-scenes") && (o.collapse_entity ??= r(e.ulm_card_welcome_scenes_collapse), !o.scene_items)) {
    const n = Array.from({ length: 7 }, (i, l) => {
      const d = e[`entity_${l + 1}`];
      if (!d || typeof d != "object") return;
      const m = d, f = r(m);
      if (f)
        return {
          entity: f,
          name: typeof m.name == "string" ? m.name : void 0,
          icon: typeof m.icon == "string" ? m.icon : void 0,
          color: typeof m.color == "string" ? m.color : void 0,
          state: typeof m.state == "string" ? m.state : void 0,
          nav_path: typeof m.nav_path == "string" ? m.nav_path : void 0,
          service_data: m.service_data && typeof m.service_data == "object" ? m.service_data : void 0
        };
    }).filter((i) => i !== void 0);
    n.length && (o.scene_items = n);
  }
  if (String(e.type).includes("card-vertical-button") && (o.active_state ??= typeof e.ulm_card_vertical_button_state == "string" ? e.ulm_card_vertical_button_state : "on", o.icon_color ??= typeof e.ulm_card_vertical_button_color == "string" ? e.ulm_card_vertical_button_color : "blue"), String(e.type).includes("imswel-person") && (o.entity ??= r(e.ulm_card_imswel_person_entity), o.wifi_tracker_entity ??= r(e.ulm_card_imswel_person_wifi_tracker), o.gps_tracker_entity ??= r(e.ulm_card_imswel_person_gps_tracker), o.findmy_script_entity ??= r(e.ulm_card_imswel_person_findmy_script), o.use_entity_picture ??= e.ulm_card_imswel_person_use_entity_picture === !0), String(e.type).includes("irmajavi-entities") && (o.entity ??= r(e.ulm_custom_card_irmajavi_entities), o.entities ??= [1, 2, 3, 4].map((n) => r(e[`ulm_custom_card_irmajavi_entities_entity_${n}`])).filter((n) => n !== void 0)), String(e.type).includes("irmajavi-speedtest") && (o.download_entity ??= r(e.ulm_custom_card_irmajavi_speedtest_download_speed_entity), o.upload_entity ??= r(e.ulm_custom_card_irmajavi_speedtest_upload_speed_entity), o.ping_entity ??= r(e.ulm_custom_card_irmajavi_speedtest_ping_entity), o.entity ??= o.download_entity), String(e.type).includes("irmajavi-weather") && (o.entity ??= r(e.ulm_custom_card_irmajavi_weather), o.temperature_entity ??= r(e.ulm_custom_card_irmajavi_weather_temperature_outside), o.date_entity ??= r(e.ulm_custom_card_irmajavi_weather_date), o.entities ??= [1, 2, 3, 4].map((n) => r(e[`ulm_custom_card_irmajavi_weather_entity_${n}`])).filter((n) => n !== void 0)), String(e.type).includes("custom-card-haven-washer") && (o.entity ??= r(e.ulm_custom_card_washer_machine_state) ?? r(e.ulm_custom_card_washer_power), o.power_entity ??= r(e.ulm_custom_card_washer_power), o.ulm_custom_card_washer_machine_state ??= o.entity), String(e.type).includes("custom-card-httpedo13-thermostat") && (o.entity ??= r(e.entity), o.variant ??= "buttons"), String(e.type).includes("custom-card-iabadia-battery-chip") && (o.entity ??= r(e.ulm_custom_card_iAbadia_battery_chip_entity)), String(e.type).includes("custom-card-imswel-medias")) {
    const n = typeof e.ulm_custom_card_imswel_medias_platform == "string" ? e.ulm_custom_card_imswel_medias_platform : void 0;
    o.variant ??= !n || n === "plex" ? "library" : "upcoming";
  }
  return String(e.type).includes("media-player-sonos") && (o.entity ??= r(e.ulm_card_media_player_with_controls_entity)), String(e.type).includes("more-power-outlet") && (o.power_entity ??= r(
    e.custom_card_more_power_outlet_power_sensor ?? e.ulm_card_more_power_outlet_power_sensor ?? e.graph_entity
  ), o.energy_entity ??= r(
    e.custom_card_more_power_outlet_energy_sensor ?? e.ulm_card_more_power_outlet_energy_sensor
  ), o.time_entity ??= r(
    e.custom_card_more_power_outlet_time_sensor ?? e.ulm_card_more_power_outlet_time_sensor
  )), String(e.type).includes("mpse-gauge") && (o.minimum ??= Number(e.ulm_card_mpse_gauge_min ?? 0), o.maximum ??= Number(e.ulm_card_mpse_gauge_max ?? 100)), String(e.type).includes("mpse-printer") && (o.black_entity ??= r(e.ulm_card_printer_black_name), o.yellow_entity ??= r(e.ulm_card_printer_yellow_name), o.magenta_entity ??= r(e.ulm_card_printer_magenta_name), o.cyan_entity ??= r(e.ulm_card_printer_cyan_name)), String(e.type).includes("paddy-welcome") && (o.time_entity ??= r(e.ulm_custom_card_paddy_welcome_time), o.weather_entity ??= r(e.ulm_custom_card_paddy_welcome_weather_provider) ?? r(e.ulm_weather), o.news_entities ??= Array.isArray(e.ulm_custom_card_paddy_welcome_news_entities) ? e.ulm_custom_card_paddy_welcome_news_entities.flatMap((n) => {
    const i = r(n);
    return i ? [i] : [];
  }) : void 0, o.variant ??= o.news_entities?.length ? "news" : o.weather_entity ? "weather" : "message"), String(e.type).includes("person-chip") && (o.entity ??= r(e.ulm_custom_card_person_chip_entity), o.use_entity_picture ??= !0), String(e.type).includes("custom-card-qubino") && (o.qubino_more_info_entity ??= r(e.more_info_entity) ?? r(e.ulm_custom_card_qubino_more_info_entity)), String(e.type).includes("ristou-person") && (o.ulm_custom_card_ristou_camera_entity_light ??= r(e.ulm_card_ristou_person_camera), o.ulm_custom_card_ristou_camera_entity_dark ??= r(e.ulm_card_ristou_person_camera), o.ulm_custom_card_ristou_map_enable ??= typeof e.ulm_card_ristou_person_show_map == "boolean" ? e.ulm_card_ristou_person_show_map : void 0), o;
}, dt = {
  en: {
    entity: "Entity",
    name: "Custom name",
    name_mode: "Name",
    secondary: "Custom secondary information",
    icon: "Icon",
    icon_color: "Icon color",
    variant: "Card style",
    layout: "Layout",
    icon_type: "Icon type",
    fill_container: "Fill container",
    primary_info: "Primary information",
    secondary_info: "Secondary information",
    show_icon: "Show icon",
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
    battery_entity: "Battery sensor",
    graph_entity: "Graph sensor",
    eta_entity: "ETA sensor",
    consumption_entity: "Power consumption sensor",
    fan_entity: "External fan entity",
    label_use_temperature: "Show temperature label",
    label_use_brightness: "Show brightness label",
    input_select_entity: "Room selection helper",
    input_select_option: "Room selection option",
    thermostat_minimum_temp_spread: "Minimum setpoint spread",
    thermostat_temp_step: "Temperature step",
    date_entity: "Date sensor",
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
    black_entity: "Black toner sensor",
    yellow_entity: "Yellow toner sensor",
    magenta_entity: "Magenta toner sensor",
    cyan_entity: "Cyan toner sensor",
    minimum: "Minimum value",
    maximum: "Maximum value",
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
    ulm_card_weather_backdrop: "Show weather background",
    ulm_card_weather_primary_info: "Main weather information",
    ulm_card_weather_secondary_info: "Additional weather information",
    ulm_card_vacuum_camera: "Vacuum map camera",
    ulm_card_vacuum_camera_toggle: "Show map only while cleaning",
    ulm_card_vacuum_room: "Room-cleaning script",
    ulm_card_vacuum_room_icon: "Room-cleaning icon",
    ulm_card_vacuum_force_background_color: "Color the card while active",
    ulm_card_vertical_button_color: "Active color",
    ulm_card_vertical_button_state: "Active state or input-select option",
    ulm_card_light_enable_slider: "Show brightness slider",
    ulm_card_light_enable_slider_minSet: "Minimum slider brightness",
    ulm_card_light_enable_slider_maxSet: "Maximum slider brightness",
    ulm_card_light_enable_collapse: "Collapse controls when light is off",
    ulm_card_light_enable_horizontal: "Use horizontal layout",
    ulm_card_light_enable_horizontal_wide: "Use a wide horizontal control",
    ulm_card_light_color: "Light accent color",
    ulm_card_light_enable_color: "Use the light's current color",
    ulm_card_light_force_background_color: "Color the card when light is on",
    ulm_card_light_enable_buttons: "Show brightness preset buttons",
    ulm_card_light_brightness_low: "Low brightness preset",
    ulm_card_light_brightness_medium: "Medium brightness preset",
    ulm_card_light_brightness_high: "High brightness preset",
    ulm_card_battery_battery_level_danger: "Low battery threshold",
    ulm_card_battery_battery_level_warning: "Battery warning threshold",
    ulm_card_battery_attribute: "Battery level attribute",
    ulm_card_battery_battery_state_entity_id: "Charging state entity",
    ulm_card_battery_charger_type_entity_id: "Charger type entity",
    ulm_card_battery_charging_animation: "Animate while charging",
    ulm_card_battery_color_battery_level_danger: "Low battery color",
    ulm_card_battery_color_battery_level_warning: "Battery warning color",
    ulm_card_battery_color_battery_level_ok: "Healthy battery color",
    ulm_card_battery_name: "Battery name",
    ulm_card_media_player_enable_art: "Show media artwork",
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
    ulm_card_graph_color: "Primary graph color",
    ulm_card_graph_color2: "Secondary graph color",
    ulm_card_graph_entity2: "Secondary graph entity",
    ulm_card_graph_group_by: "Graph grouping",
    ulm_card_graph_hours: "Graph history hours",
    ulm_card_graph_icon_color: "Graph icon color",
    ulm_card_graph_line_width: "Graph line width",
    ulm_card_graph_points: "Graph points per hour",
    ulm_card_graph_type: "Graph style",
    ulm_card_navigate_color: "Navigation accent color",
    ulm_card_thermostat_enable_collapse: "Collapse thermostat controls",
    ulm_card_thermostat_enable_controls: "Show temperature controls",
    ulm_card_thermostat_enable_hvac_modes: "Show HVAC modes",
    ulm_card_thermostat_enable_background_color: "Color active thermostat",
    ulm_card_thermostat_enable_display_temperature: "Show current temperature",
    ulm_card_thermostat_enable_horizontal: "Use horizontal thermostat layout",
    ulm_card_cover_enable_slider: "Show position slider",
    ulm_card_cover_color: "Cover accent color",
    ulm_card_cover_display_left_right: "Use left and right controls",
    ulm_card_cover_enable_controls: "Show open, stop, and close controls",
    ulm_card_cover_enable_horizontal: "Use horizontal cover layout",
    ulm_card_cover_enable_tilt: "Show tilt controls",
    ulm_card_cover_favorite_percentage: "Favorite cover position",
    ulm_card_cover_force_background_color: "Color the card while open",
    ulm_card_cover_garage_large: "Use large garage icons",
    ulm_card_cover_icon: "Cover icon",
    ulm_card_cover_invert_percent: "Invert cover percentage",
    ulm_card_cover_name: "Cover name",
    ulm_card_cover_show_last_changed: "Show when the cover last changed",
    ulm_card_invert_percent: "Invert cover percentage (legacy)",
    ulm_card_cover_slider_min: "Minimum cover position",
    ulm_card_cover_slider_max: "Maximum cover position",
    ulm_card_fan_enable_slider: "Show speed slider",
    ulm_card_fan_slider_min: "Minimum fan speed",
    ulm_card_fan_slider_max: "Maximum fan speed",
    ulm_card_fan_enable_button: "Show oscillation button",
    ulm_card_fan_button_icon: "Oscillation button icon",
    ulm_card_fan_button_service: "Oscillation service",
    ulm_card_fan_color: "Fan accent color",
    ulm_card_fan_enable_collapse: "Collapse controls while off",
    ulm_card_fan_enable_horizontal: "Use horizontal fan layout",
    ulm_card_fan_force_background_color: "Color the card while on",
    ulm_card_fan_hum_attribute: "Humidity attribute",
    ulm_card_fan_icon: "Fan icon",
    ulm_card_fan_name: "Fan name",
    ulm_card_fan_oscillate_attribute: "Oscillation attribute",
    ulm_card_fan_temp_attribute: "Temperature attribute",
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
    ulm_card_input_boolean_color: "Input boolean accent color",
    ulm_card_input_boolean_force_background_color: "Color the card while on",
    ulm_card_input_boolean_icon: "Input boolean icon",
    ulm_card_input_boolean_name: "Input boolean name",
    ulm_custom_card_bar_card_color: "Bar color",
    ulm_custom_card_bar_card_icon: "Header icon",
    ulm_custom_card_bar_card_icon_color: "Icon color",
    ulm_custom_card_bar_card_indicator: "Show bar indicator",
    ulm_custom_card_bar_card_max: "Maximum value",
    ulm_custom_card_bar_card_min: "Minimum value",
    ulm_custom_card_bar_card_name: "Header name",
    ulm_custom_card_bar_card_show_icon: "Show icon and header",
    ulm_custom_card_bar_card_value: "Show value inside bar",
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
    door_entity: "Door entity",
    finished_entity: "Finished entity",
    battery_state_entity: "Battery state entity",
    charger_type_entity: "Charger type entity",
    secondary_entity: "Secondary entity",
    darkMode: "Dark mode",
    language: "Language",
    showAzimuth: "Show azimuth",
    showElevation: "Show elevation",
    timeFormat: "Time format",
    title: "Title",
    ulm_custom_card_iAbadia_battery_chip_entity: "Battery entity",
    ulm_custom_card_iAbadia_battery_chip_icon: "Battery chip icon",
    ulm_custom_card_iAbadia_battery_chip_warning: "Warning threshold",
    ulm_custom_card_iAbadia_battery_chip_danger: "Danger threshold",
    ulm_custom_card_imswel_medias_index: "Media item index",
    ulm_custom_card_imswel_medias_platform: "Media platform",
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
    ulm_card_person_entity: "Person",
    ulm_card_person_use_entity_picture: "Use person picture",
    ulm_card_person_zone1: "First known zone",
    ulm_card_person_zone2: "Second known zone",
    ulm_address: "Address sensor",
    ulm_address_locality: "Address locality sensor",
    ulm_card_person_driving_entity: "Driving status sensor",
    ulm_card_person_battery_entity: "Battery level sensor",
    ulm_card_person_battery_state_entity: "Battery charging-state sensor",
    ulm_card_person_commute_entity: "Commute time sensor",
    ulm_card_person_cummute_icon: "Commute icon",
    ulm_multiline: "Use multiline layout",
    ulm_custom_card_device_tracker_icon: "Device icon",
    ulm_custom_card_device_tracker_tracker_1_entity: "First tracker",
    ulm_custom_card_device_tracker_tracker_1_type: "First tracker type",
    ulm_custom_card_device_tracker_tracker_2_entity: "Second tracker",
    ulm_custom_card_device_tracker_tracker_2_type: "Second tracker type",
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
    ulm_custom_card_eraycetinay_lock_tap_control: "Control lock on tap",
    ulm_custom_card_eraycetinay_lock_only_open: "Always open on tap",
    ulm_custom_card_eraycetinay_lock_battery_level: "Lock battery sensor",
    ulm_custom_card_eraycetinay_lock_battery_warning: "Battery warning threshold",
    ulm_custom_card_eraycetinay_lock_battery_warning_low: "Critical battery threshold",
    ulm_custom_card_eraycetinay_lock_door_open: "Door open sensor",
    ulm_custom_card_eraycetinay_lock_battery_sensor_binary: "Battery sensor is binary",
    ulm_custom_card_eraycetinay_lock_battery_sensor_binary_low_state: "Binary low-battery state",
    ulm_custom_card_esh_room_light_entity: "Room light",
    ulm_custom_card_esh_room_climate_entity: "Room climate",
    ulm_custom_card_esh_room_cover_entity: "Room cover",
    ulm_card_esh_room_light_icon_on: "Light-on icon",
    ulm_card_esh_room_light_icon_off: "Light-off icon",
    ulm_card_esh_room_cover_icon_open: "Open-cover icon",
    ulm_card_esh_room_cover_icon_closed: "Closed-cover icon",
    ulm_card_dynamic_color: "Use the light color as the room accent",
    ulm_card_esh_welcome_collapse: "Welcome collapse helper",
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
}, Sa = (e, t) => {
  const a = e?.language?.split("-")[0] ?? "en";
  return dt[a]?.[t] ?? dt.en[t] ?? t.replaceAll("_", " ").replace(/\b\w/g, (r) => r.toUpperCase());
}, Pa = {
  entity: "The Home Assistant entity shown and controlled by this card.",
  name_mode: "Choose whether the card uses the entity name, a custom name, or no name.",
  name: "Used when Name is set to Use custom name.",
  secondary: "Optional supporting text shown below the main name or state.",
  icon: "Optional icon override. Leave empty to use the card's recommended icon.",
  variant: "Choose the upstream layout or behavior represented by this unified component.",
  icon_type: "Choose an icon, the entity picture when available, or no icon.",
  layout: "Automatic uses the layout designed for this card. Horizontal and Vertical override it.",
  fill_container: "Makes the card stretch to fill the available dashboard grid cell.",
  primary_info: "Choose the main text displayed by the card.",
  secondary_info: "Choose the supporting text displayed below the primary information.",
  tap_action: "What happens when the card is tapped.",
  hold_action: "What happens when the card is pressed and held.",
  double_tap_action: "What happens when the card is tapped twice.",
  weather_entity: "Weather entity used by the source-specific welcome or date presentation.",
  settings_path: "Dashboard path opened by the welcome settings button.",
  collapse_entity: "Input boolean that hides or shows the welcome scene pills.",
  collapsed: "Forces the welcome scene pills to stay hidden.",
  show_controls: "Shows the controls defined by the pinned source design.",
  show_forecast: "Loads the daily weather forecast used by the detailed source design.",
  ulm_card_vacuum_camera: "Optional camera entity whose entity picture is shown as the vacuum map.",
  ulm_card_vacuum_camera_toggle: "Shows the map only while the vacuum is cleaning, mowing, or mopping.",
  ulm_card_vacuum_room: "Optional script called by the fourth room-cleaning control.",
  ulm_card_vacuum_room_icon: "Icon shown for the optional room-cleaning control.",
  ulm_card_vacuum_force_background_color: "Uses the state color as the card background while the vacuum is active.",
  ulm_card_vertical_button_color: "Accent color used when the entity matches the configured active state.",
  ulm_card_vertical_button_state: "State that activates the button, and the option selected for input_select entities.",
  temperature_entity: "Optional sensor used when temperature comes from a separate entity.",
  humidity_entity: "Optional sensor used when humidity comes from a separate entity.",
  battery_entity: "Optional sensor used to display a separate battery level.",
  consumption_entity: "Optional power sensor appended to the outlet state while it is on.",
  fan_entity: "Optional fan toggled when the climate entity does not expose fan-only mode.",
  label_use_temperature: "Uses the room entity temperature, device temperature, or state as the card label.",
  label_use_brightness: "Uses the light brightness percentage as the label while the room entity is on.",
  input_select_entity: "Optional input select changed by the room card double-tap action.",
  input_select_option: "Option selected on the configured room helper.",
  thermostat_minimum_temp_spread: "Smallest allowed difference between low and high dual setpoints.",
  thermostat_temp_step: "Temperature increment used by the thermostat controls.",
  date_entity: "Sensor containing the source card's preformatted date text.",
  download_entity: "Speedtest download sensor shown by the card and refreshed by the test action.",
  upload_entity: "Speedtest upload sensor shown by the card and refreshed by the test action.",
  ping_entity: "Speedtest ping sensor refreshed together with download and upload.",
  wifi_tracker_entity: "Device tracker used by the source popup's Wi-Fi glance.",
  gps_tracker_entity: "Device tracker used by the source popup's GPS glance and map.",
  findmy_script_entity: "Script invoked by the source popup's phone finder control.",
  ulm_card_input_datetime_name: "Optional source-compatible name shown in the datetime header.",
  ulm_card_input_number_name: "Optional source-compatible name shown in the input-number header.",
  ulm_custom_card_irmajavi_entities_icon: "Icon shown before the main Entities heading.",
  ulm_custom_card_irmajavi_entities_name: "Heading shown above the four entity values.",
  ulm_custom_card_irmajavi_entities_entity_1: "Entity shown in the first metric slot.",
  ulm_custom_card_irmajavi_entities_entity_2: "Entity shown in the second metric slot.",
  ulm_custom_card_irmajavi_entities_entity_3: "Entity shown in the third metric slot.",
  ulm_custom_card_irmajavi_entities_entity_4: "Entity shown in the fourth metric slot.",
  ulm_custom_card_irmajavi_entities_name_1: "Label shown below the first metric value.",
  ulm_custom_card_irmajavi_entities_name_2: "Label shown below the second metric value.",
  ulm_custom_card_irmajavi_entities_name_3: "Label shown below the third metric value.",
  ulm_custom_card_irmajavi_entities_name_4: "Label shown below the fourth metric value.",
  ulm_custom_card_irmajavi_speedtest_router_name: "Router name shown below the Wi-Fi icon.",
  ulm_custom_card_irmajavi_speedtest_router_model: "Router model shown below the router name.",
  ulm_custom_card_irmajavi_speedtest_color: "Accent color used by the Wi-Fi icon.",
  ulm_custom_card_irmajavi_weather_entity_1: "Entity shown in the first weather metric slot.",
  ulm_custom_card_irmajavi_weather_entity_2: "Entity shown in the second weather metric slot.",
  ulm_custom_card_irmajavi_weather_entity_3: "Entity shown in the third weather metric slot.",
  ulm_custom_card_irmajavi_weather_entity_4: "Entity shown in the fourth weather metric slot.",
  ulm_custom_card_irmajavi_weather_name_1: "Label shown below the first weather metric.",
  ulm_custom_card_irmajavi_weather_name_2: "Label shown below the second weather metric.",
  ulm_custom_card_irmajavi_weather_name_3: "Label shown below the third weather metric.",
  ulm_custom_card_irmajavi_weather_name_4: "Label shown below the fourth weather metric.",
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
  news_entities: "Up to three entities shown in the compact source-compatible news feed.",
  qubino_more_info_entity: "Entity opened by the Qubino card surface, matching the source pilot-wire input select.",
  ulm_custom_card_ristou_use_entity_picture: "Uses the person's entity picture instead of the fallback face icon.",
  ulm_custom_card_ristou_use_badge: "Shows the source location or driving badge over the person icon.",
  ulm_custom_card_ristou_person_driving_entity: "Binary sensor whose active state replaces the location label with Driving.",
  ulm_custom_card_ristou_zones: "Zone entities used to resolve custom location icons and colors.",
  ulm_custom_card_ristou_find_device_script: "Optional script or button shown as the source find-device control.",
  ulm_custom_card_ristou_map_enable: "Shows the source built-in map row equivalent.",
  ulm_custom_card_ristou_map_aspect_ratio: "Aspect ratio used by the built-in map row, such as 466:200.",
  ulm_custom_card_ristou_map_hours_to_show: "Number of location-history hours requested by the source map.",
  ulm_custom_card_ristou_map_default_zoom: "Default zoom requested by the source map.",
  ulm_custom_card_ristou_camera_entity_light: "Light-theme static-map camera entity.",
  ulm_custom_card_ristou_camera_entity_dark: "Dark-theme static-map camera entity; both camera fields are required for static-map mode.",
  series_2_entity: "Optional second sensor displayed in the chart legend.",
  series_3_entity: "Optional third sensor displayed in the chart legend.",
  ulm_card_alarm_time_step: "Minutes added or removed by each alarm-time button.",
  ulm_card_alarm_time_collapse: "Hides the time controls while the alarm is off.",
  ulm_card_alarm_time_horizontal: "Places the alarm details and time controls side by side.",
  ulm_card_alarm_time_icon: "Icon shown beside the alarm name and state.",
  ulm_card_alarm_time_color: "Accent color used while the alarm is active.",
  ulm_custom_card_camera_title: "Shows the camera icon, name, and label above the live image.",
  ulm_custom_card_camera_name: "Friendly camera name shown when the title is enabled.",
  ulm_custom_card_camera_label: "Supporting camera status text shown below the name.",
  ulm_custom_card_camera_aspect_ratio: "Image aspect ratio such as 16 / 9 or 4 / 3.",
  ulm_card_media_player_with_controls_name: "Friendly name shown for the Chromecast or media player.",
  ulm_card_power_details_entity: "Sensor whose current value and history are plotted.",
  ulm_card_power_details_name: "Friendly heading shown above the power history chart.",
  ulm_card_power_details_hours: "Number of hours represented by the history chart.",
  ulm_card_power_details_height: "Height of the source-compatible history chart.",
  ulm_card_power_details_24hour: "Uses 24-hour labels when chart time labels are available.",
  ulm_custom_card_device_tracker_tracker_1_entity: "Independent device_tracker entity represented by the upper status badge.",
  ulm_custom_card_device_tracker_tracker_2_entity: "Independent device_tracker entity represented by the lower status badge.",
  ulm_custom_card_device_tracker_icon: "Main device icon shown behind the two independent tracker badges.",
  ulm_custom_card_device_tracker_tracker_1_type: "Connection type used to choose the upper badge's truthful home and away icons.",
  ulm_custom_card_device_tracker_tracker_2_type: "Connection type used to choose the lower badge's truthful home and away icons.",
  temperature: "Temperature sensor shown in the RoomView header.",
  humidity: "Humidity sensor shown in the RoomView header.",
  group_lights: "Named Home Assistant group containing the room lights.",
  group_motions: "Named Home Assistant group containing motion sensors.",
  group_doors: "Named Home Assistant group containing door sensors.",
  group_windows: "Named Home Assistant group containing window sensors.",
  group_outlets: "Named Home Assistant group containing outlets.",
  group_tv: "Named Home Assistant group containing televisions.",
  group_water: "Named Home Assistant group containing water sensors.",
  group_windows_shutters: "Named Home Assistant group containing window shutters.",
  ulm_custom_card_eraycetinay_lock_tap_control: "When enabled, tapping sends lock, unlock, or open; otherwise it opens more-info.",
  ulm_custom_card_eraycetinay_lock_only_open: "Always sends lock.open instead of switching locked and unlocked states.",
  ulm_custom_card_eraycetinay_lock_battery_level: "Percentage or binary battery sensor used for the lock warning badge.",
  ulm_custom_card_eraycetinay_lock_battery_warning: "Percentage at or below which the battery warning badge appears.",
  ulm_custom_card_eraycetinay_lock_battery_warning_low: "Percentage at or below which the battery warning becomes critical.",
  ulm_custom_card_eraycetinay_lock_door_open: "Binary sensor used to warn when the lock is locked while the door remains open.",
  ulm_custom_card_eraycetinay_lock_battery_sensor_binary: "Treats the configured battery sensor as a binary low-battery sensor.",
  ulm_custom_card_eraycetinay_lock_battery_sensor_binary_low_state: "State that means low battery when a binary sensor is configured.",
  ulm_custom_card_esh_room_light_entity: "Light shown in the first semantic room control slot.",
  ulm_custom_card_esh_room_climate_entity: "Climate entity shown in the second semantic room control slot.",
  ulm_custom_card_esh_room_cover_entity: "Cover entity shown in the second semantic room control slot when configured.",
  ulm_card_esh_room_light_icon_on: "Icon shown by the semantic light control while the light is on.",
  ulm_card_esh_room_light_icon_off: "Icon shown by the semantic light control while the light is off.",
  ulm_card_esh_room_cover_icon_open: "Icon shown by the semantic cover control while open.",
  ulm_card_esh_room_cover_icon_closed: "Icon shown by the semantic cover control while closed.",
  ulm_card_dynamic_color: "Uses the configured light's RGB color for the active room card.",
  ulm_card_esh_welcome_collapse: "Optional input_boolean toggled by the top-left collapse control.",
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
  console_platform: "Selects the console branding and default icon.",
  ulm_card_weather_backdrop: "Adds a condition-based background to the weather card.",
  ulm_card_weather_primary_info: "Choose whether today's forecast high and low appear beside the current conditions.",
  ulm_card_weather_secondary_info: "Choose whether precipitation information appears below the current conditions.",
  ulm_card_light_enable_slider: "Lets you change brightness directly from the card.",
  ulm_card_light_enable_slider_minSet: "Lowest brightness percentage available on the slider.",
  ulm_card_light_enable_slider_maxSet: "Highest brightness percentage available on the slider.",
  ulm_card_light_enable_collapse: "Hides brightness controls while the light is off.",
  ulm_card_light_enable_horizontal: "Places the icon, details, and controls in a wider row.",
  ulm_card_light_enable_horizontal_wide: "Gives the slider twice as much width as the light summary.",
  ulm_card_light_color: "Accent color used when the light is on and entity color is disabled.",
  ulm_card_light_enable_color: "Uses the light entity's RGB color for active card accents.",
  ulm_card_light_force_background_color: "Uses the active light color as the card background.",
  ulm_card_light_enable_buttons: "Adds Low, Medium, and High brightness shortcuts.",
  ulm_card_light_brightness_low: "Brightness percentage used by the Low button.",
  ulm_card_light_brightness_medium: "Brightness percentage used by the Medium button.",
  ulm_card_light_brightness_high: "Brightness percentage used by the High button.",
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
  ulm_card_graph_color: "Line and fill color used for the primary history series.",
  ulm_card_graph_color2: "Line color used for the optional secondary history series.",
  ulm_card_graph_entity2: "Optional second entity plotted alongside the primary entity.",
  ulm_card_graph_group_by: "Source-compatible mini-graph grouping mode.",
  ulm_card_graph_hours: "Number of recent history hours represented by the graph.",
  ulm_card_graph_icon_color: "Optional accent color for the graph header icon.",
  ulm_card_graph_line_width: "Stroke width used by the history line.",
  ulm_card_graph_points: "Source-compatible number of graph samples per hour.",
  ulm_card_graph_type: "Choose the source fill, line, or bar presentation.",
  ulm_card_navigate_color: "Accent color used by the navigation icon.",
  ulm_card_thermostat_enable_collapse: "Hides expanded controls while the thermostat is off.",
  ulm_card_thermostat_enable_controls: "Adds buttons for changing the configured temperature setpoint.",
  ulm_card_thermostat_enable_hvac_modes: "Shows buttons for the HVAC modes supported by the climate entity.",
  ulm_card_thermostat_enable_background_color: "Uses the active HVAC mode color for the card background.",
  ulm_card_thermostat_enable_display_temperature: "Displays the current temperature beside the setpoint.",
  ulm_card_thermostat_enable_horizontal: "Places thermostat content and controls in the upstream horizontal arrangement.",
  ulm_card_cover_enable_slider: "Lets you set the cover position directly from the card.",
  ulm_card_cover_color: "Accent used while the cover is open or moving.",
  ulm_card_cover_display_left_right: "Uses left and right arrows for horizontally moving covers.",
  ulm_card_cover_enable_controls: "Adds close, stop, open, and optional favorite-position buttons.",
  ulm_card_cover_enable_horizontal: "Places the summary and one control region side by side.",
  ulm_card_cover_enable_tilt: "Adds close, stop, and open tilt controls.",
  ulm_card_cover_favorite_percentage: "Adds a star button that moves the cover to this percentage.",
  ulm_card_cover_force_background_color: "Uses the cover accent as the card background while active.",
  ulm_card_cover_garage_large: "Uses the garage variant icons for large garage doors.",
  ulm_card_cover_icon: "Optional icon override; otherwise the icon follows device class and state.",
  ulm_card_cover_invert_percent: "Inverts the displayed cover percentage and active coloring.",
  ulm_card_cover_name: "Optional source-compatible name override.",
  ulm_card_cover_show_last_changed: "Shows the entity's last-changed timestamp instead of its state.",
  ulm_card_invert_percent: "Legacy alias for inverted cover percentage behavior.",
  ulm_card_cover_slider_min: "Lowest position percentage available on the slider.",
  ulm_card_cover_slider_max: "Highest position percentage available on the slider.",
  ulm_card_fan_enable_slider: "Lets you set fan speed directly from the card.",
  ulm_card_fan_slider_min: "Lowest fan speed percentage available on the slider.",
  ulm_card_fan_slider_max: "Highest fan speed percentage available on the slider.",
  ulm_card_fan_enable_button: "Adds a button that toggles fan oscillation.",
  ulm_card_fan_button_icon: "Icon displayed on the oscillation button.",
  ulm_card_fan_button_service: "Home Assistant domain.service called by the fan option button.",
  ulm_card_fan_color: "Accent used while the fan is on.",
  ulm_card_fan_enable_collapse: "Hides the slider and option button while the fan is off.",
  ulm_card_fan_enable_horizontal: "Places the fan summary and controls side by side.",
  ulm_card_fan_force_background_color: "Uses the fan accent as the card background while active.",
  ulm_card_fan_hum_attribute: "Entity attribute whose numeric value is shown as humidity.",
  ulm_card_fan_icon: "Optional source-compatible fan icon override.",
  ulm_card_fan_name: "Optional source-compatible fan name override.",
  ulm_card_fan_oscillate_attribute: "Boolean entity attribute read to determine the next oscillation value.",
  ulm_card_fan_temp_attribute: "Entity attribute whose numeric value is shown as temperature.",
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
  ulm_card_input_boolean_color: "Accent used while the helper is on.",
  ulm_card_input_boolean_force_background_color: "Uses the helper accent as the card background while on.",
  ulm_card_input_boolean_icon: "Optional source-compatible input boolean icon override.",
  ulm_card_input_boolean_name: "Optional source-compatible input boolean name override.",
  ulm_custom_card_bar_card_color: "Color used for the filled portion of the horizontal bar.",
  ulm_custom_card_bar_card_icon: "Optional icon override for the circular header icon.",
  ulm_custom_card_bar_card_icon_color: "Optional accent color for the header icon and its circle.",
  ulm_custom_card_bar_card_indicator: "Shows the current-value indicator at the leading edge of the bar.",
  ulm_custom_card_bar_card_max: "Entity value represented by a completely filled bar.",
  ulm_custom_card_bar_card_min: "Entity value represented by an empty bar.",
  ulm_custom_card_bar_card_name: "Optional name displayed below the current value.",
  ulm_custom_card_bar_card_show_icon: "Shows or hides the complete icon and text header above the bar.",
  ulm_custom_card_bar_card_value: "Displays the entity value at the right side of the bar.",
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
  power_entity: "Entity used for the source-specific power readout.",
  door_entity: "Entity used for the washer door status.",
  finished_entity: "Entity used for the washer program-finished status.",
  battery_state_entity: "Entity used to detect whether the battery is charging.",
  charger_type_entity: "Optional entity containing the active charger type.",
  secondary_entity: "Optional secondary entity used when primary media metadata is incomplete.",
  darkMode: "Uses the dark palette documented by the upstream Sun Card.",
  language: "Locale used by source-specific labels and time formatting.",
  showAzimuth: "Shows the current solar azimuth below the sun arc.",
  showElevation: "Shows the current solar elevation below the sun arc.",
  timeFormat: "Chooses 12-hour or 24-hour source time formatting.",
  title: "Optional title shown above the source-specific card.",
  ulm_custom_card_iAbadia_battery_chip_entity: "Battery entity targeted by the chip and its more-info action.",
  ulm_custom_card_iAbadia_battery_chip_icon: "Optional icon replacing the default battery glyph.",
  ulm_custom_card_iAbadia_battery_chip_warning: "Battery level at or below which the chip becomes yellow.",
  ulm_custom_card_iAbadia_battery_chip_danger: "Battery level at or below which the chip becomes red.",
  ulm_custom_card_imswel_medias_index: "One-based item index read from the media entity data attribute.",
  ulm_custom_card_imswel_medias_platform: "Selects Plex library, Radarr upcoming, or Sonarr upcoming semantics.",
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
  ulm_card_person_entity: "Person shown by this card.",
  ulm_card_person_use_entity_picture: "Uses the person's entity picture instead of the configured face icon.",
  ulm_card_person_zone1: "Zone entity used for the first custom location badge.",
  ulm_card_person_zone2: "Zone entity used for the second custom location badge.",
  ulm_address: "Sensor whose state is shown as the current address.",
  ulm_address_locality: "Sensor whose Locality attribute is shown as the current location.",
  ulm_card_person_driving_entity: "Binary sensor that changes the badge and label while driving.",
  ulm_card_person_battery_entity: "Sensor containing the person's device battery percentage.",
  ulm_card_person_battery_state_entity: "Sensor whose state indicates whether the battery is charging.",
  ulm_card_person_commute_entity: "Sensor containing commute time in minutes.",
  ulm_card_person_cummute_icon: "Icon shown beside the commute time.",
  ulm_multiline: "Places battery and commute details on a separate row.",
  energy_entity: "Optional sensor containing the outlet's accumulated energy consumption.",
  black_entity: "Sensor containing the remaining black toner percentage.",
  yellow_entity: "Sensor containing the remaining yellow toner percentage.",
  magenta_entity: "Sensor containing the remaining magenta toner percentage.",
  cyan_entity: "Sensor containing the remaining cyan toner percentage.",
  minimum: "Lowest value represented by the gauge.",
  maximum: "Highest value represented by the gauge.",
  ulm_card_light_colorpick_name: "Name displayed in the light header.",
  ulm_card_light_colorpick_transition: "Transition time, in seconds, sent with each color selection."
}, Aa = (e) => Pa[e], za = [
  {
    upstreamId: "card_battery",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_battery.yaml",
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
    upstreamId: "card_binary_sensor",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_binary_sensor.yaml",
    publicId: "card_binary_sensor",
    variant: "default",
    rendererId: "card_binary_sensor",
    layoutProfile: "card:button-card+popup",
    primitives: [
      "button-card",
      "popup"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "label",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_active_state",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_card_binary_sensor_color",
        defaultValue: '"blue"',
        selector: "color"
      },
      {
        name: "ulm_card_binary_sensor_force_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_binary_sensor_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_binary_sensor_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_binary_sensor_show_last_changed",
        defaultValue: "false",
        selector: "boolean"
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
    sourceDigest: "00203340c0476322672d6e8f3b3062985cfdb010bcf39a0b971a1e4facc5bdbf"
  },
  {
    upstreamId: "card_binary_sensor_alert",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_binary_sensor_alert.yaml",
    publicId: "card_binary_sensor",
    variant: "alert",
    rendererId: "card_binary_sensor",
    layoutProfile: "card:button-card+popup",
    primitives: [
      "button-card",
      "popup"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "label",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_active_state",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_card_binary_sensor_alert_color",
        defaultValue: '"blue"',
        selector: "color"
      },
      {
        name: "ulm_card_binary_sensor_alert_force_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_binary_sensor_alert_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_binary_sensor_alert_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_binary_sensor_alert_show_last_changed",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_popup",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_icon_alert_color",
        defaultValue: '"[[[ return variables.ulm_card_binary_sensor_alert_color ]]]"',
        selector: "color"
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
    sourceDigest: "032b6c2834edc24f97da4d4569768905e148859814001145d3e6b96b7c9f12c3"
  },
  {
    upstreamId: "card_cover",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_cover.yaml",
    publicId: "card_cover",
    rendererId: "card_cover",
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
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_active_state",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_card_cover_color",
        defaultValue: '"blue"',
        selector: "color"
      },
      {
        name: "ulm_card_cover_display_left_right",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_cover_enable_controls",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_cover_enable_horizontal",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_cover_enable_popup",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_cover_enable_slider",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_cover_enable_tilt",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_cover_favorite_percentage",
        defaultValue: "<null>",
        selector: "text"
      },
      {
        name: "ulm_card_cover_force_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_cover_garage_large",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_cover_gate",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_cover_icon",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_cover_invert_percent",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_cover_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_cover_show_last_changed",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_cover_slider_max",
        defaultValue: "100",
        selector: "number"
      },
      {
        name: "ulm_card_cover_slider_min",
        defaultValue: "0",
        selector: "number"
      },
      {
        name: "ulm_card_invert_percent",
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
        name: "ulm_translation_state",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card",
      "my-slider"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:my-slider; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "37b380f5d8445b95e68fa7c65fa296f3bd027a1bb9d6d82539f5d51bfeafc9c8"
  },
  {
    upstreamId: "card_fan",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_fan.yaml",
    publicId: "card_fan",
    rendererId: "card_fan",
    layoutProfile: "card:button-card+control",
    primitives: [
      "button-card",
      "control"
    ],
    customFields: [
      "button",
      "icon",
      "item1",
      "item2",
      "label",
      "slider",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_active_state",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_card_fan_button_icon",
        defaultValue: '"mdi:rotate-3d-variant"',
        selector: "icon"
      },
      {
        name: "ulm_card_fan_button_service",
        defaultValue: '"fan.oscillate"',
        selector: "text"
      },
      {
        name: "ulm_card_fan_color",
        defaultValue: '"blue"',
        selector: "color"
      },
      {
        name: "ulm_card_fan_enable_button",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_fan_enable_collapse",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_fan_enable_horizontal",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_fan_enable_slider",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_fan_force_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_fan_hum_attribute",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_fan_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_fan_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_fan_oscillate_attribute",
        defaultValue: '"oscillate"',
        selector: "text"
      },
      {
        name: "ulm_card_fan_slider_max",
        defaultValue: "100",
        selector: "number"
      },
      {
        name: "ulm_card_fan_slider_min",
        defaultValue: "0",
        selector: "number"
      },
      {
        name: "ulm_card_fan_temp_attribute",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_light_force_background_color",
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
        name: "ulm_translation_off",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_on",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_unavailable",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card",
      "my-slider"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:my-slider; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "6bd7973b62f1208ab5c3500f7c87deba2fe0dd66c873f23e2a14c06b2ecda063"
  },
  {
    upstreamId: "card_generic",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_generic.yaml",
    publicId: "card_generic",
    variant: "default",
    rendererId: "card_generic",
    layoutProfile: "card:button-card+popup",
    primitives: [
      "button-card",
      "popup"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "label",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_active_state",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_card_generic_color",
        defaultValue: '"blue"',
        selector: "color"
      },
      {
        name: "ulm_card_generic_force_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_generic_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_generic_name",
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
    sourceDigest: "d34b6a2c2d7dff2182520362fe82b012f3ecb18188bc4aca7e72244fb8f81476"
  },
  {
    upstreamId: "card_generic_swap",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_generic_swap.yaml",
    publicId: "card_generic",
    variant: "swapped",
    rendererId: "card_generic",
    layoutProfile: "card:button-card+popup",
    primitives: [
      "button-card",
      "popup"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "label",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_active_state",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_card_generic_swap_color",
        defaultValue: '"blue"',
        selector: "color"
      },
      {
        name: "ulm_card_generic_swap_force_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_generic_swap_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_generic_swap_name",
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
    sourceDigest: "4064fef2de37e4fdf8d239064dc965e71be90abdef1213bb8fda76dba2849600"
  },
  {
    upstreamId: "card_graph",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/2-line_cards/card_graph.yaml",
    publicId: "card_graph",
    rendererId: "card_graph",
    layoutProfile: "card:button-card+chart",
    primitives: [
      "button-card",
      "chart"
    ],
    customFields: [
      "icon",
      "item1",
      "item2"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_card_generic_icon",
        defaultValue: '"[[[ return variables.ulm_card_graph_icon; ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_generic_name",
        defaultValue: '"[[[ return variables.ulm_card_graph_name; ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_graph_color",
        defaultValue: '"var(--info-color)"',
        selector: "color"
      },
      {
        name: "ulm_card_graph_color2",
        defaultValue: '"var(--info-color)"',
        selector: "text"
      },
      {
        name: "ulm_card_graph_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_card_graph_entity2",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_card_graph_group_by",
        defaultValue: '"interval"',
        selector: "text"
      },
      {
        name: "ulm_card_graph_hours",
        defaultValue: "24",
        selector: "number"
      },
      {
        name: "ulm_card_graph_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_graph_icon_color",
        defaultValue: '""',
        selector: "color"
      },
      {
        name: "ulm_card_graph_line_width",
        defaultValue: "5",
        selector: "number"
      },
      {
        name: "ulm_card_graph_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name; ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_graph_points",
        defaultValue: '"0.5"',
        selector: "text"
      },
      {
        name: "ulm_card_graph_type",
        defaultValue: '"fill"',
        selector: "text"
      },
      {
        name: "ulm_templates",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card",
      "mini-graph-card"
    ],
    backendRequirements: [
      "history/statistics"
    ],
    deviations: [
      "Upstream embeds custom:mini-graph-card; this plugin provides an original Lit equivalent without requiring that frontend dependency.",
      "Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable."
    ],
    sourceDigest: "01217c554ddca97d6527ab117629b7317348bbec922e858596dc61240ed594d0"
  },
  {
    upstreamId: "card_input_boolean",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_input_boolean.yaml",
    publicId: "card_input_boolean",
    rendererId: "card_input_boolean",
    layoutProfile: "card:button-card+popup",
    primitives: [
      "button-card",
      "popup"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "label",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_active_state",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_card_input_boolean_color",
        defaultValue: '"blue"',
        selector: "color"
      },
      {
        name: "ulm_card_input_boolean_force_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_input_boolean_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_input_boolean_name",
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
    sourceDigest: "53ce37b2c1640faa3a4417faad3c4f639860b6c680589382bb964fc100cce61c"
  },
  {
    upstreamId: "card_light",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_light.yaml",
    publicId: "card_light",
    rendererId: "card_light",
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
        name: "ulm_active_state",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_card_light_brightness_high",
        defaultValue: "100",
        selector: "number"
      },
      {
        name: "ulm_card_light_brightness_low",
        defaultValue: "1",
        selector: "number"
      },
      {
        name: "ulm_card_light_brightness_medium",
        defaultValue: "50",
        selector: "number"
      },
      {
        name: "ulm_card_light_color",
        defaultValue: '"yellow"',
        selector: "color"
      },
      {
        name: "ulm_card_light_color_palette",
        defaultValue: '""',
        selector: "color"
      },
      {
        name: "ulm_card_light_enable_buttons",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_light_enable_collapse",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_light_enable_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_light_enable_horizontal",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_light_enable_horizontal_wide",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_light_enable_popup",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_light_enable_popup_tap",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_light_enable_slider",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_light_enable_slider_maxSet",
        defaultValue: "100",
        selector: "boolean"
      },
      {
        name: "ulm_card_light_enable_slider_minSet",
        defaultValue: "0",
        selector: "boolean"
      },
      {
        name: "ulm_card_light_force_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_light_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_light_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name ]]]"',
        selector: "text"
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
        name: "ulm_translation_state",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card",
      "my-slider"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:my-slider; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "97d72851f730a3fe11d02cd3c463af7b31cfeba930bf5c36d6287a0399104f79"
  },
  {
    upstreamId: "card_media_player",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_media_player.yaml",
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
    upstreamId: "card_navigate",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_navigate.yaml",
    publicId: "card_navigate",
    rendererId: "card_navigate",
    layoutProfile: "card:native-card",
    primitives: [
      "native-card"
    ],
    customFields: [
      "icon",
      "label"
    ],
    stateDriven: !1,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_card_navigate_color",
        defaultValue: '"var(--color-blue)"',
        selector: "color"
      },
      {
        name: "ulm_card_navigate_icon",
        defaultValue: "<documented/inherited>",
        selector: "icon"
      },
      {
        name: "ulm_card_navigate_path",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_navigate_title",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_templates",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "b9046dbb7f7666cdb0c3c33b8019cd8e9b72a9dde6cb401e247ffc138f41245f"
  },
  {
    upstreamId: "card_person",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_person.yaml",
    publicId: "card_person",
    rendererId: "card_person",
    layoutProfile: "card:native-card",
    primitives: [
      "native-card"
    ],
    customFields: [
      "icon"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_address",
        defaultValue: '""',
        selector: "text"
      },
      {
        name: "ulm_card_person_battery",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_person_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_card_person_eta",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_person_icon",
        defaultValue: '"mdi:face-man"',
        selector: "icon"
      },
      {
        name: "ulm_card_person_use_entity_picture",
        defaultValue: "false",
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
      }
    ],
    dependencies: [],
    backendRequirements: [
      "person/device-tracker entities"
    ],
    deviations: [],
    sourceDigest: "3b8e43f4ee9d9c8fcf18eaf06cd8e5aea7366eb04b3814f97dc25f9ddf4533ab"
  },
  {
    upstreamId: "card_power_outlet",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_power_outlet.yaml",
    publicId: "card_power_outlet",
    rendererId: "card_power_outlet",
    layoutProfile: "card:button-card+popup",
    primitives: [
      "button-card",
      "popup"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "label",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_active_state",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_card_power_outlet_color",
        defaultValue: '"yellow"',
        selector: "color"
      },
      {
        name: "ulm_card_power_outlet_consumption_sensor",
        defaultValue: "<null>",
        selector: "entity"
      },
      {
        name: "ulm_card_power_outlet_force_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_power_outlet_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_power_outlet_name",
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
    sourceDigest: "ceb80e214599fb3b0fe4a10dbb045f6d0eeaf73501882b6d054436dbba8d90aa"
  },
  {
    upstreamId: "card_room",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_room.yaml",
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
    animated: !1,
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
    deviations: [],
    sourceDigest: "e72f25403653d056e1b206e2056f3898e0d469d35656c7f6a25d956e3a5f3fad"
  },
  {
    upstreamId: "card_scenes",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_scenes_welcome.yaml",
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
    upstreamId: "card_script",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_script.yaml",
    publicId: "card_script",
    rendererId: "card_script",
    layoutProfile: "card:native-card",
    primitives: [
      "native-card"
    ],
    customFields: [
      "icon",
      "label"
    ],
    stateDriven: !1,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_card_script_icon",
        defaultValue: "<documented/inherited>",
        selector: "icon"
      },
      {
        name: "ulm_card_script_title",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_templates",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "75b808a26f6768118f2aeac5c127118ad790be66c34f160f1076a9f20cc39548"
  },
  {
    upstreamId: "card_thermostat",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_thermostat.yaml",
    publicId: "card_thermostat",
    rendererId: "card_thermostat",
    layoutProfile: "card:button-card+popup",
    primitives: [
      "button-card",
      "popup"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_card_thermostat_enable_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_thermostat_enable_collapse",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_thermostat_enable_controls",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_thermostat_enable_display_temperature",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_thermostat_enable_horizontal",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_thermostat_enable_hvac_modes",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_thermostat_enable_popup",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_thermostat_fan_entity",
        defaultValue: "<null>",
        selector: "entity"
      },
      {
        name: "ulm_card_thermostat_icon",
        defaultValue: `"[[[ return 'mdi:thermometer' ]]]"`,
        selector: "icon"
      },
      {
        name: "ulm_card_thermostat_minimum_temp_spread",
        defaultValue: "1",
        selector: "number"
      },
      {
        name: "ulm_card_thermostat_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_thermostat_preset_mode",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_thermostat_temp_step",
        defaultValue: "<documented/inherited>",
        selector: "text"
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
    sourceDigest: "58e810bb79cdee380a82551ae9576cbc7d206f3d1781fe20f99c8e3ac6ae540a"
  },
  {
    upstreamId: "card_title",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/title/card_title.yaml",
    publicId: "card_title",
    variant: "title-and-subtitle",
    rendererId: "card_title",
    layoutProfile: "card:native-card",
    primitives: [
      "native-card"
    ],
    customFields: [
      "label"
    ],
    stateDriven: !1,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_templates",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "40f86677440e2369876cea2dc350851cd771c5a600535a500d9f7c92a869ba1f"
  },
  {
    upstreamId: "card_vacuum",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_vacuum.yaml",
    publicId: "card_vacuum",
    rendererId: "card_vacuum",
    layoutProfile: "card:button-card+popup",
    primitives: [
      "button-card",
      "popup"
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
        name: "ulm_active_state",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_card_vacuum_camera",
        defaultValue: '""',
        selector: "text"
      },
      {
        name: "ulm_card_vacuum_camera_toggle",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_vacuum_color",
        defaultValue: '"[[[\\n  var state = entity.state.toLowerCase();\\n  var colors = {\\n    \\"cleaning\\": \\"blue\\",\\n    \\"mowing\\": \\"blue\\",\\n    \\"paused\\": \\"green\\",\\n    \\"mopping\\": \\"yellow\\",\\n    \\"returning\\": \\"purple\\",\\n    \\"error\\": \\"red\\",\\n    \\"default\\": \\"theme\\"\\n  }\\n  return (colors[state] || colors[\\"default\\"]);\\n]]]\\n"',
        selector: "color"
      },
      {
        name: "ulm_card_vacuum_enable_popup",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_vacuum_force_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_vacuum_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_vacuum_label",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_vacuum_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_vacuum_room",
        defaultValue: "<null>",
        selector: "text"
      },
      {
        name: "ulm_card_vacuum_room_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
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
    sourceDigest: "208a00987823e08026310f9945461d59203106aa04b4e11c45caaae3c97df9e9"
  },
  {
    upstreamId: "card_vertical_button",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/vertical_buttons/vertical_buttons.yaml",
    publicId: "card_vertical_button",
    rendererId: "card_vertical_button",
    layoutProfile: "card:native-card",
    primitives: [
      "native-card"
    ],
    customFields: [
      "icon",
      "label"
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
    dependencies: [],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "7b93758fc74faf4d4a8cdd8469adfa72f359fcc27ebfda16870581738ccf6935"
  },
  {
    upstreamId: "card_weather",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_weather.yaml",
    publicId: "card_weather",
    variant: "detailed",
    rendererId: "card_weather",
    layoutProfile: "card:native-card",
    primitives: [
      "native-card"
    ],
    customFields: [
      "item1"
    ],
    stateDriven: !1,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_actions_card_overlay",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_weather_backdrop",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_weather_custom",
        defaultValue: '[{"temp":"[[[ return entity.attributes.temperature ]]]"}]',
        selector: "object"
      },
      {
        name: "ulm_card_weather_name",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_weather_primary_info",
        defaultValue: '"extrema"',
        selector: "text"
      },
      {
        name: "ulm_card_weather_secondary_info",
        defaultValue: '"precipitation"',
        selector: "text"
      },
      {
        name: "ulm_templates",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "simple-weather-card"
    ],
    backendRequirements: [
      "weather entity/forecast API"
    ],
    deviations: [
      "Upstream embeds custom:simple-weather-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "7297f7ab74d3643e8a79edf548b1860c4e0ba71effe636be939212c017d96a0f"
  },
  {
    upstreamId: "card_weather_ulm",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_weather_ulm.yaml",
    publicId: "card_weather",
    variant: "native",
    rendererId: "card_weather",
    layoutProfile: "card:button-card+popup",
    primitives: [
      "button-card",
      "popup"
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
        name: "ulm_card_weather_ulm_enable_popup",
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
        name: "ulm_weather_popup_surpress_first_forecast",
        defaultValue: "false",
        selector: "boolean"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [
      "weather entity/forecast API"
    ],
    deviations: [],
    sourceDigest: "fe9880b8ca3367512c51d65acbf3757025725d474a70a80918143569f61739d3"
  },
  {
    upstreamId: "card_welcome_scenes",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_welcome_scenes.yaml",
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
    upstreamId: "custom_card_afvalophaling",
    sourcePath: "custom_cards/custom_card_afvalophaling",
    publicId: "custom_card_afvalophaling",
    rendererId: "custom_card_afvalophaling",
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
    upstreamId: "custom_card_apexcharts",
    sourcePath: "custom_cards/custom_card_apexcharts",
    publicId: "custom_card_apexcharts",
    rendererId: "custom_card_apexcharts",
    layoutProfile: "card:button-card+chart",
    primitives: [
      "button-card",
      "chart"
    ],
    customFields: [
      "header",
      "icon",
      "item1",
      "item2",
      "item3"
    ],
    stateDriven: !1,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_card_generic_swap_icon",
        defaultValue: '"[[[ return variables.entity_3.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_generic_swap_name",
        defaultValue: '"[[[ return variables.entity_3.name ]]]"',
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
    sourceDigest: "4fbc07ebb6280ff576ea3896e41f15f26b537929eb150352f1363a2f40b1f8b9"
  },
  {
    upstreamId: "custom_card_bar_card",
    sourcePath: "custom_cards/custom_card_bar_card",
    publicId: "custom_card_bar_card",
    rendererId: "custom_card_bar_card",
    layoutProfile: "card:button-card+chart",
    primitives: [
      "button-card",
      "chart"
    ],
    customFields: [
      "icon",
      "item1",
      "item2"
    ],
    stateDriven: !1,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_card_generic_icon",
        defaultValue: '"[[[ return variables.ulm_custom_card_bar_card_icon; ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_generic_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_bar_card_name; ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_bar_card_color",
        defaultValue: '"var(--google-blue)"',
        selector: "color"
      },
      {
        name: "ulm_custom_card_bar_card_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_custom_card_bar_card_icon_color",
        defaultValue: '""',
        selector: "color"
      },
      {
        name: "ulm_custom_card_bar_card_indicator",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_bar_card_max",
        defaultValue: '"100"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_bar_card_min",
        defaultValue: '"0"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_bar_card_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name; ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_bar_card_show_icon",
        defaultValue: "true",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_bar_card_value",
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
    sourceDigest: "7156ed70b9bc402ae01e76cd3c9b6b65efad7d84667bf59bdaea74b49cff6cd3"
  },
  {
    upstreamId: "custom_card_camera",
    sourcePath: "custom_cards/custom_card_camera",
    publicId: "custom_card_camera",
    rendererId: "custom_card_camera",
    layoutProfile: "card:button-card+image",
    primitives: [
      "button-card",
      "image"
    ],
    customFields: [
      "item1",
      "item2",
      "label"
    ],
    stateDriven: !1,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_custom_card_camera_aspect_ratio",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_camera_label",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_camera_name",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_camera_title",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [
      "camera entity/stream API"
    ],
    deviations: [],
    sourceDigest: "abf5b29b835da6e7501c6229a49c7dffa6a3e7e83a351398a04878d3b2b04334"
  },
  {
    upstreamId: "custom_card_chromecast",
    sourcePath: "custom_cards/custom_card_chromecast",
    publicId: "custom_card_chromecast",
    rendererId: "custom_card_chromecast",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "item3",
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
    sourceDigest: "bb8f062dbddf46ec1d4763c55e6ef7bf625790e1bce8630632ff2d3730ce3721"
  },
  {
    upstreamId: "custom_card_damix48_power_details",
    sourcePath: "custom_cards/custom_card_damix48_power_details",
    publicId: "custom_card_damix48_power_details",
    rendererId: "custom_card_damix48_power_details",
    layoutProfile: "card:button-card+chart",
    primitives: [
      "button-card",
      "chart"
    ],
    customFields: [
      "item1",
      "item2"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_card_generic_swap_name",
        defaultValue: '"[[[ return variables.ulm_card_power_details_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_power_details_24hour",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_power_details_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_card_power_details_height",
        defaultValue: "180",
        selector: "number"
      },
      {
        name: "ulm_card_power_details_hours",
        defaultValue: "2",
        selector: "number"
      },
      {
        name: "ulm_card_power_details_name",
        defaultValue: '"n/a"',
        selector: "text"
      },
      {
        name: "ulm_card_power_details_thresholds",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_damix48_power_details_hour",
        defaultValue: '"timmen"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_damix48_power_details_hours",
        defaultValue: '"timmarna"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_damix48_power_details_in_the_last",
        defaultValue: '"Den senaste"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_damix48_power_details_in_the_lasts",
        defaultValue: '"De senaste"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_damix48_power_details_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card",
      "mini-graph-card"
    ],
    backendRequirements: [
      "history/statistics"
    ],
    deviations: [
      "Upstream embeds custom:mini-graph-card; this plugin provides an original Lit equivalent without requiring that frontend dependency.",
      "Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable."
    ],
    sourceDigest: "e2311eb17911bbeff8cfe60ec267d076d3b916d7b497124562bb88623a2fc3f9"
  },
  {
    upstreamId: "custom_card_device_tracker",
    sourcePath: "custom_cards/custom_card_device_tracker",
    publicId: "custom_card_device_tracker",
    rendererId: "custom_card_device_tracker",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_custom_card_device_tracker_icon",
        defaultValue: "<documented/inherited>",
        selector: "icon"
      },
      {
        name: "ulm_custom_card_device_tracker_tracker_1_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_device_tracker_tracker_1_type",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_device_tracker_tracker_2_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_device_tracker_tracker_2_type",
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
    backendRequirements: [
      "person/device-tracker entities"
    ],
    deviations: [],
    sourceDigest: "c9efd2a8ef99a5335e0d4dd510f6fb5679b4b0d42adad5268d1ed317aaedcb0d"
  },
  {
    upstreamId: "custom_card_drealine_roomview",
    sourcePath: "custom_cards/custom_card_drealine_roomview",
    publicId: "custom_card_drealine_roomview",
    rendererId: "custom_card_drealine_roomview",
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
    upstreamId: "custom_card_eraycetinay_elapsed_time",
    sourcePath: "custom_cards/custom_card_eraycetinay_elapsed_time",
    publicId: "custom_card_eraycetinay_elapsed_time",
    rendererId: "custom_card_eraycetinay_elapsed_time",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_custom_card_eraycetinay_elapsed_time_ago",
        defaultValue: '"önce"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_elapsed_time_day",
        defaultValue: '"gün"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_elapsed_time_days",
        defaultValue: '"gün"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_elapsed_time_hour",
        defaultValue: '"saat"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_elapsed_time_hours",
        defaultValue: '"saat"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_elapsed_time_justnow",
        defaultValue: '"az önce"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_elapsed_time_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_elapsed_time_minute",
        defaultValue: '"dakika"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_elapsed_time_minutes",
        defaultValue: '"dakika"',
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "a824f0bc9e6f852e0c14af881f7dfe0fe665dbf6bde3773713b5355969494460"
  },
  {
    upstreamId: "custom_card_eraycetinay_lock",
    sourcePath: "custom_cards/custom_card_eraycetinay_lock",
    publicId: "custom_card_eraycetinay_lock",
    rendererId: "custom_card_eraycetinay_lock",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_custom_card_eraycetinay_lock_battery_is_at",
        defaultValue: '"pil"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_battery_is_low",
        defaultValue: '"pil zayıf"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_battery_level",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_battery_sensor_binary",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_battery_sensor_binary_low_state",
        defaultValue: '"on"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_battery_warning",
        defaultValue: "20",
        selector: "number"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_battery_warning_low",
        defaultValue: "5",
        selector: "number"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_door_open",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_jammed",
        defaultValue: '"sıkışmış"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_locked",
        defaultValue: '"kilitli"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_locked_and_opened",
        defaultValue: '"Kapı kilitli ama hala açık"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_locking",
        defaultValue: '"kilitleniyor"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_only_open",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_tap_control",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_unavailable",
        defaultValue: '"müsait değil"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_unlocked",
        defaultValue: '"kilitli değil"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_eraycetinay_lock_unlocking",
        defaultValue: '"kilit açılıyor"',
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
    sourceDigest: "49675223ef2a9b1d6e5ad86328c35e44afeb9e9f8486c697f81507db840cbf92"
  },
  {
    upstreamId: "custom_card_esh_room",
    sourcePath: "custom_cards/custom_card_esh_room",
    publicId: "custom_card_esh_room",
    rendererId: "custom_card_esh_room",
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
        name: "ulm_card_esh_room_cover_icon_closed",
        defaultValue: '"mdi:roller-shade-closed"',
        selector: "text"
      },
      {
        name: "ulm_card_esh_room_cover_icon_closing",
        defaultValue: '"mdi:blinds"',
        selector: "text"
      },
      {
        name: "ulm_card_esh_room_cover_icon_open",
        defaultValue: '"mdi:blinds-open"',
        selector: "text"
      },
      {
        name: "ulm_card_esh_room_cover_icon_opening",
        defaultValue: '"mdi:blinds"',
        selector: "text"
      },
      {
        name: "ulm_card_esh_room_light_icon_off",
        defaultValue: '"mdi:lightbulb-off"',
        selector: "text"
      },
      {
        name: "ulm_card_esh_room_light_icon_on",
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
        name: "ulm_custom_card_esh_room_climate_entity",
        defaultValue: "<null>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_esh_room_cover_entity",
        defaultValue: "<null>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_esh_room_light_entity",
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
    upstreamId: "custom_card_esh_welcome",
    sourcePath: "custom_cards/custom_card_esh_welcome",
    publicId: "custom_card_esh_welcome",
    rendererId: "custom_card_esh_welcome",
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
        name: "ulm_card_esh_welcome_collapse",
        defaultValue: '"[[[ return variables.ulm_card_esh_welcome_collapse ]]]"',
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
    upstreamId: "custom_card_haven_washer",
    sourcePath: "custom_cards/custom_card_haven_washer",
    publicId: "custom_card_haven_washer",
    rendererId: "custom_card_haven_washer",
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
    upstreamId: "custom_card_heat_pump",
    sourcePath: "custom_cards/custom_card_heat_pump",
    publicId: "custom_card_heat_pump",
    rendererId: "custom_card_heat_pump",
    layoutProfile: "card:button-card+horizontal-stack",
    primitives: [
      "button-card",
      "horizontal-stack"
    ],
    customFields: [
      "icon",
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
    sourceDigest: "323a228cf98660ce626ed0db984e7499d853d548cc57f06a7bee8ddb9d70b299"
  },
  {
    upstreamId: "custom_card_homeassistant_updates",
    sourcePath: "custom_cards/custom_card_homeassistant_updates",
    publicId: "custom_card_homeassistant_updates",
    rendererId: "custom_card_homeassistant_updates",
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
        name: "ulm_card_homeassistant_core",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_homeassistant_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_card_homeassistant_os",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_homeassistant_supervisor",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_cards",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_language",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_no_updates_available",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_updates_available",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "c3c80a295c28742ee65b13f648cc4dcf33ee48757b9a7f9fbf4cd251cb72a073"
  },
  {
    upstreamId: "custom_card_httpedo13_sun",
    sourcePath: "custom_cards/custom_card_httpedo13_sun",
    publicId: "custom_card_httpedo13_sun",
    rendererId: "custom_card_httpedo13_sun",
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
    upstreamId: "custom_card_httpedo13_thermostat",
    sourcePath: "custom_cards/custom_card_httpedo13_thermostat",
    publicId: "custom_card_httpedo13_thermostat",
    rendererId: "custom_card_httpedo13_thermostat",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
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
    sourceDigest: "dec54ab169b686bd864dde53957be0faa3b0b1d941bba3e26d728ba22eec7038"
  },
  {
    upstreamId: "custom_card_iAbadia_battery_chip",
    sourcePath: "custom_cards/custom_card_iAbadia_battery_chip",
    publicId: "custom_card_iAbadia_battery_chip",
    rendererId: "custom_card_iAbadia_battery_chip",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_custom_card_iAbadia_battery_chip_danger",
        defaultValue: '"10"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_iAbadia_battery_chip_entity",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_custom_card_iAbadia_battery_chip_icon",
        defaultValue: '""',
        selector: "icon"
      },
      {
        name: "ulm_custom_card_iAbadia_battery_chip_warning",
        defaultValue: '"20"',
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "f159cf2a199cfb197a2e3544d30c58505bc33d3548733da3761cd2fc2aa600ac"
  },
  {
    upstreamId: "custom_card_imswel_medias",
    sourcePath: "custom_cards/custom_card_imswel_medias",
    publicId: "custom_card_imswel_medias",
    rendererId: "custom_card_imswel_medias",
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
        name: "ulm_custom_card_imswel_in_theaters",
        defaultValue: '"au cinéma"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_imswel_locale",
        defaultValue: '"fr-FR"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_imswel_medias_index",
        defaultValue: "1",
        selector: "number"
      },
      {
        name: "ulm_custom_card_imswel_medias_platform",
        defaultValue: '"[[[\\n  if (entity.entity_id.includes(\\"sonarr\\")){\\n    return \\"sonarr\\";\\n  } else if(entity.entity_id.includes(\\"plex\\")){\\n    return \\"plex\\";\\n  } else{\\n    return \\"radarr\\";\\n  }\\n]]]\\n"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_imswel_recentlyadded",
        defaultValue: '"Récemment ajouté"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_imswel_today",
        defaultValue: `"Aujourd'hui"`,
        selector: "text"
      },
      {
        name: "ulm_custom_card_imswel_tommorow",
        defaultValue: '"Demain"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_imswel_weekday",
        defaultValue: '"[[[\\n  return [\\"Dimanche\\",\\"Lundi\\",\\"Mardi\\",\\"Mercredi\\",\\"Jeudi\\",\\"Vendredi\\",\\"Samedi\\"];\\n]]]\\n"',
        selector: "text"
      },
      {
        name: "ulm_translation_engine",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_unavailable",
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
    sourceDigest: "0c6ae5e28570083204008c10238f083d121130eea72c2f689439e77fc1c22239"
  },
  {
    upstreamId: "custom_card_imswel_person",
    sourcePath: "custom_cards/custom_card_imswel_person",
    publicId: "custom_card_imswel_person",
    rendererId: "custom_card_imswel_person",
    layoutProfile: "card:button-card+vertical-stack+horizontal-stack+entities+popup",
    primitives: [
      "button-card",
      "vertical-stack",
      "horizontal-stack",
      "entities",
      "popup"
    ],
    customFields: [
      "icon"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_card_imswel_person_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_card_imswel_person_findmy_script",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_card_imswel_person_gps_tracker",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_card_imswel_person_use_entity_picture",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_imswel_person_wifi_tracker",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_imswel_person_findmy",
        defaultValue: '"Encontrar meu celular"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_imswel_person_home",
        defaultValue: '"Aqui"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_imswel_person_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_imswel_person_not_home",
        defaultValue: '"Ausente"',
        selector: "text"
      },
      {
        name: "ulm_translation_engine",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_unavailable",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [
      "history/statistics",
      "person/device-tracker entities"
    ],
    deviations: [
      "Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable."
    ],
    sourceDigest: "29564a2b6ae37672d380381f21709cc67927728fbc564779cf324da0898b2e4b"
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
    upstreamId: "custom_card_input_number",
    sourcePath: "custom_cards/custom_card_input_number",
    publicId: "custom_card_input_number",
    rendererId: "custom_card_input_number",
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
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_card_input_number_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_card_input_number_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name ]]]"',
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
    sourceDigest: "4fcb357fb905e2a4f2766edff102cccab1dc61a075ed543ee6992ca25e47b3b9"
  },
  {
    upstreamId: "custom_card_irmajavi_entities",
    sourcePath: "custom_cards/custom_card_irmajavi_entities",
    publicId: "custom_card_irmajavi_entities",
    rendererId: "custom_card_irmajavi_entities",
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
        name: "ulm_custom_card_irmajavi_entities",
        defaultValue: "<documented/inherited>",
        selector: "entity-multiple"
      },
      {
        name: "ulm_custom_card_irmajavi_entities_entity_1",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_entities_entity_2",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_entities_entity_3",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_entities_entity_4",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_entities_icon",
        defaultValue: "<documented/inherited>",
        selector: "icon"
      },
      {
        name: "ulm_custom_card_irmajavi_entities_name",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_entities_name_1",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_entities_name_2",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_entities_name_3",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_entities_name_4",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_entitites_name",
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
    sourceDigest: "fc79ef9de6d5fdd2474f301594d8fe32433576b67ba1d9f01c0a049c1825fb21"
  },
  {
    upstreamId: "custom_card_irmajavi_speedtest",
    sourcePath: "custom_cards/custom_card_irmajavi_speedtest",
    publicId: "custom_card_irmajavi_speedtest",
    rendererId: "custom_card_irmajavi_speedtest",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
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
        name: "ulm_custom_card_irmajavi_speedtest_color",
        defaultValue: '"blue"',
        selector: "color"
      },
      {
        name: "ulm_custom_card_irmajavi_speedtest_download",
        defaultValue: '"Prędkość pobierania"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_speedtest_download_speed_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_irmajavi_speedtest_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_speedtest_ping_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_irmajavi_speedtest_router_model",
        defaultValue: '"router_model"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_speedtest_router_name",
        defaultValue: '"router_name"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_speedtest_speedtest",
        defaultValue: '"Test prędkości Internetu"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_speedtest_upload",
        defaultValue: '"Prędkość wysyłania"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_speedtest_upload_speed_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "5188e9eb19a25cae7ff693051c0bc2c426af398bb12a9501e3cfee1ea715d40f"
  },
  {
    upstreamId: "custom_card_irmajavi_weather",
    sourcePath: "custom_cards/custom_card_irmajavi_weather",
    publicId: "custom_card_irmajavi_weather",
    rendererId: "custom_card_irmajavi_weather",
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
        name: "ulm_custom_card_irmajavi_weather",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_irmajavi_weather_date",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_weather_entity_1",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_weather_entity_2",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_weather_entity_3",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_weather_entity_4",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_weather_name_1",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_weather_name_2",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_weather_name_3",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_weather_name_4",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_irmajavi_weather_temperature_outside",
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
    upstreamId: "custom_card_light_colorpick",
    sourcePath: "custom_cards/custom_card_light_colorpick",
    publicId: "custom_card_light_colorpick",
    rendererId: "custom_card_light_colorpick",
    layoutProfile: "card:button-card+control",
    primitives: [
      "button-card",
      "control"
    ],
    customFields: [
      "item1",
      "item2",
      "item3"
    ],
    stateDriven: !0,
    animated: !0,
    actions: [],
    variables: [
      {
        name: "ulm_card_light_colorpick_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_light_colorpick_transition",
        defaultValue: "1",
        selector: "number"
      },
      {
        name: "ulm_card_light_slider_horizontal_name",
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
      "button-card",
      "my-slider",
      "rgb-light-card"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:my-slider; this plugin provides an original Lit equivalent without requiring that frontend dependency.",
      "Upstream embeds custom:rgb-light-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "8e2056c0ea0ade6fa37e0d0b26eae67e8c61e2901f466f278596ed1e4bfbbe0d"
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
    upstreamId: "custom_card_more_power_outlet",
    sourcePath: "custom_cards/custom_card_more_power_outlet",
    publicId: "custom_card_more_power_outlet",
    rendererId: "custom_card_more_power_outlet",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [],
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
      "history/statistics"
    ],
    deviations: [
      "Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable."
    ],
    sourceDigest: "997d3cb2e78fb34cfbb3bbaff72badc08d1a6d04c4cb5339e0762080fba3c553"
  },
  {
    upstreamId: "custom_card_mpse_gauge",
    sourcePath: "custom_cards/custom_card_mpse_gauge",
    publicId: "custom_card_mpse_gauge",
    rendererId: "custom_card_mpse_gauge",
    layoutProfile: "card:button-card+chart",
    primitives: [
      "button-card",
      "chart"
    ],
    customFields: [
      "item1",
      "item2"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_card_mpse_gauge_max",
        defaultValue: "100",
        selector: "number"
      },
      {
        name: "ulm_card_mpse_gauge_min",
        defaultValue: "0",
        selector: "number"
      }
    ],
    dependencies: [
      "button-card",
      "dual-gauge-card"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:dual-gauge-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "25d0a61887381d4ec2ecce9487c4cca767146bb35a093de79d047295e8ee2275"
  },
  {
    upstreamId: "custom_card_mpse_printer",
    sourcePath: "custom_cards/custom_card_mpse_printer",
    publicId: "custom_card_mpse_printer",
    rendererId: "custom_card_mpse_printer",
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
    upstreamId: "custom_card_mpse_thermostat",
    sourcePath: "custom_cards/custom_card_mpse_thermostat",
    publicId: "custom_card_mpse_thermostat",
    rendererId: "custom_card_mpse_thermostat",
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
      "hold_action",
      "tap_action"
    ],
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
    backendRequirements: [],
    deviations: [],
    sourceDigest: "650f933f8ca2023f1f58b7eb367d69fd1316e37fc91087f667a2882fcdedaf24"
  },
  {
    upstreamId: "custom_card_mpse_wifisignal",
    sourcePath: "custom_cards/custom_card_mpse_wifisignal",
    publicId: "custom_card_mpse_wifisignal",
    rendererId: "custom_card_mpse_wifisignal",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "f8c52bb16f5c28d2205d395a9a234d7c6a2c9328dcc863fe5a04f7229d40f1a8"
  },
  {
    upstreamId: "custom_card_nas",
    sourcePath: "custom_cards/custom_card_nas",
    publicId: "custom_card_nas",
    rendererId: "custom_card_nas",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "label"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_custom_cad_nas_unit",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_nas_sensor",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_nas_text",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_nas_unit",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "30cdd273b02221b4902cd0dff75fb952af71e16ca2cd72fc7836a9c42f83e3a1"
  },
  {
    upstreamId: "custom_card_neekster_update",
    sourcePath: "custom_cards/custom_card_neekster_update",
    publicId: "custom_card_neekster_update",
    rendererId: "custom_card_neekster_update",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "item1",
      "item2",
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
        name: "ulm_card_neekster_update_collapsible",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_neekster_update_enable_controls",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_neekster_update_horizontal",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_neekster_update_icon",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_neekster_update_narrow_buttons",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "1f136c353e40887e92d643470b26b443efabd3b7089e174fa665afb726f42a96"
  },
  {
    upstreamId: "custom_card_nik_clock",
    sourcePath: "custom_cards/custom_card_nik_clock",
    publicId: "custom_card_nik_clock",
    rendererId: "custom_card_nik_clock",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "label"
    ],
    stateDriven: !1,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_custom_card_nik_clock_switch",
        defaultValue: "<null>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_clock_switch_enable",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_language",
        defaultValue: '"[[[\\n  return hass[\\"language\\"];\\n]]]\\n"',
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "67d20d7743e0ee686479988045914b455a8cf2d671f83c59dfca3838bf34a99d"
  },
  {
    upstreamId: "custom_card_nik_door",
    sourcePath: "custom_cards/custom_card_nik_door",
    publicId: "custom_card_nik_door",
    rendererId: "custom_card_nik_door",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_custom_card_entity_1_lock",
        defaultValue: '"[[[ return variables.ulm_custom_card_entity_1_lock ]]]"',
        selector: "entity"
      },
      {
        name: "ulm_custom_card_entity_1_lock_battery",
        defaultValue: '"[[[ return variables.ulm_custom_card_entity_1_lock_battery ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_entity_1_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_entity_1_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "2ec1ce2e0a8e4eaaddc283bd991c1e803183b376b71b676036e47ce931492464"
  },
  {
    upstreamId: "custom_card_nik_nas",
    sourcePath: "custom_cards/custom_card_nik_nas",
    publicId: "custom_card_nik_nas",
    rendererId: "custom_card_nik_nas",
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
    upstreamId: "custom_card_nik_tablet",
    sourcePath: "custom_cards/custom_card_nik_tablet",
    publicId: "custom_card_nik_tablet",
    rendererId: "custom_card_nik_tablet",
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
        defaultValue: `"[[[ return variables.ulm_custom_bar_card_nik_tablet_card_name != '' ? variables.ulm_custom_bar_card_nik_tablet_card_name : '' ]]]"`,
        selector: "text"
      },
      {
        name: "ulm_card_input_boolean_icon",
        defaultValue: '"mdi:tablet"',
        selector: "icon"
      },
      {
        name: "ulm_card_input_boolean_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_bar_card_nik_tablet_card_entity",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_battery ]]]"',
        selector: "entity"
      },
      {
        name: "ulm_custom_bar_card_nik_tablet_card_indicator",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_bar_card_nik_tablet_card_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_battery_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_bar_card_nik_tablet_card_value",
        defaultValue: "true",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_nik_tablet_battery",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_battery ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_battery_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_battery_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_button1",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_button1 ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_button2",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_button2 ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_button3",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_button3 ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_main",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_main ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_maintenance",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_maintenance ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_par1",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_par1 ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_par1_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_par1_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_par2",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_par2 ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_par2_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_par2_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_par3",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_par3 ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_par3_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_par3_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_reload",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_reload ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_nik_tablet_restart",
        defaultValue: '"[[[ return variables.ulm_custom_card_nik_tablet_restart ]]]"',
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
    upstreamId: "custom_card_paddy_dwd_pollen",
    sourcePath: "custom_cards/custom_card_paddy_dwd_pollen",
    publicId: "custom_card_paddy_dwd_pollen",
    rendererId: "custom_card_paddy_dwd_pollen",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_card_generic_swap_icon",
        defaultValue: '"[[[ return variables.ulm_custom_card_paddy_dwd_pollen_icon; ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_generic_swap_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_paddy_dwd_pollen_name; ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_paddy_dwd_pollen_1",
        defaultValue: '"bardzo słabe"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_paddy_dwd_pollen_2",
        defaultValue: '"słabe"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_paddy_dwd_pollen_3",
        defaultValue: '"umiarkowane"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_paddy_dwd_pollen_4",
        defaultValue: '"średnie"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_paddy_dwd_pollen_5",
        defaultValue: '"wysokie"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_paddy_dwd_pollen_6",
        defaultValue: '"bardzo wysokie"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_paddy_dwd_pollen_icon",
        defaultValue: "<documented/inherited>",
        selector: "icon"
      },
      {
        name: "ulm_custom_card_paddy_dwd_pollen_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_paddy_dwd_pollen_name",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_paddy_dwd_pollen_none",
        defaultValue: '"brak"',
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
    sourceDigest: "7d010b9fb174f912f80454cff866815a8485cd93ab71eccdbc62b5629fdb760d"
  },
  {
    upstreamId: "custom_card_paddy_waste_collection",
    sourcePath: "custom_cards/custom_card_paddy_waste_collection",
    publicId: "custom_card_paddy_waste_collection",
    rendererId: "custom_card_paddy_waste_collection",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_card_generic_swap_icon",
        defaultValue: '"[[[ return entity.icon; ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_generic_swap_name",
        defaultValue: '"[[[ return entity.name; ]]]"',
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
    sourceDigest: "71392973a3b737b220f0c439526895b851a03ec7f985043eea1d993504c4b471"
  },
  {
    upstreamId: "custom_card_paddy_welcome",
    sourcePath: "custom_cards/custom_card_paddy_welcome",
    publicId: "custom_card_paddy_welcome",
    rendererId: "custom_card_paddy_welcome",
    layoutProfile: "card:button-card+horizontal-stack",
    primitives: [
      "button-card",
      "horizontal-stack"
    ],
    customFields: [
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
        name: "ulm_afternoon",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_paddy_welcome_news_entities",
        defaultValue: "<documented/inherited>",
        selector: "entity-multiple"
      },
      {
        name: "ulm_custom_card_paddy_welcome_time",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_paddy_welcome_weather_provider",
        defaultValue: "<documented/inherited>",
        selector: "text"
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
        name: "ulm_variable",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card",
      "home-feed-card"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:home-feed-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "8b6905f1f49207f8dcd66668e452775f49abaa9db16827c327bd7194a6c1c9d2"
  },
  {
    upstreamId: "custom_card_person_chip",
    sourcePath: "custom_cards/custom_card_person_chip",
    publicId: "custom_card_person_chip",
    rendererId: "custom_card_person_chip",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_custom_card_person_chip_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_translation_engine",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [
      "person/device-tracker entities"
    ],
    deviations: [],
    sourceDigest: "299b1adddca9cb862e6801a240e32af298992484ccf93264b0ff33b527abfdc8"
  },
  {
    upstreamId: "custom_card_person_info",
    sourcePath: "custom_cards/custom_card_person_info",
    publicId: "custom_card_person_info",
    variant: "full",
    rendererId: "custom_card_person_info",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_address",
        defaultValue: '""',
        selector: "text"
      },
      {
        name: "ulm_address_locality",
        defaultValue: '""',
        selector: "text"
      },
      {
        name: "ulm_card_person_battery_entity",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_card_person_battery_state_entity",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_card_person_commute_entity",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_card_person_commute_icon",
        defaultValue: "<documented/inherited>",
        selector: "icon"
      },
      {
        name: "ulm_card_person_cummute_icon",
        defaultValue: '"mdi:car"',
        selector: "icon"
      },
      {
        name: "ulm_card_person_driving_entity",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_card_person_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_card_person_use_entity_picture",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_person_zone1",
        defaultValue: '""',
        selector: "text"
      },
      {
        name: "ulm_card_person_zone2",
        defaultValue: '""',
        selector: "text"
      },
      {
        name: "ulm_multiline",
        defaultValue: "true",
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
    backendRequirements: [
      "person/device-tracker entities"
    ],
    deviations: [],
    sourceDigest: "c6bc147d1d79db6033182f178081fae52b69b6ec286d4f2ca88f93329ee99f5a"
  },
  {
    upstreamId: "custom_card_person_info_small",
    sourcePath: "custom_cards/custom_card_person_info_small",
    publicId: "custom_card_person_info",
    variant: "small",
    rendererId: "custom_card_person_info",
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
    actions: [
      "hold_action",
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_address",
        defaultValue: '""',
        selector: "text"
      },
      {
        name: "ulm_address_locality",
        defaultValue: '""',
        selector: "text"
      },
      {
        name: "ulm_card_battery_battery_level_danger",
        defaultValue: "15",
        selector: "number"
      },
      {
        name: "ulm_card_battery_battery_level_waring",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_battery_battery_level_warning",
        defaultValue: "30",
        selector: "number"
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
        name: "ulm_card_person_battery_entity",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_card_person_battery_state_entity",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_card_person_driving_entity",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_card_person_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_card_person_icon",
        defaultValue: '"mdi:face-man"',
        selector: "icon"
      },
      {
        name: "ulm_card_person_use_entity_picture",
        defaultValue: "true",
        selector: "boolean"
      },
      {
        name: "ulm_card_person_zone1",
        defaultValue: '""',
        selector: "text"
      },
      {
        name: "ulm_card_person_zone2",
        defaultValue: '""',
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
      "person/device-tracker entities"
    ],
    deviations: [],
    sourceDigest: "6de745dafb69e18f1ac5bd9f535f1abd5fff27256922dec83a1858cb1087a528"
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
    upstreamId: "custom_card_qubino",
    sourcePath: "custom_cards/custom_card_qubino",
    publicId: "custom_card_qubino",
    rendererId: "custom_card_qubino",
    layoutProfile: "card:native-card",
    primitives: [
      "native-card"
    ],
    customFields: [],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [],
    dependencies: [],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "10cef3de98c223293f1383b63cf5e73ecf2db90ba287cb54e7f0792c1db74c63"
  },
  {
    upstreamId: "custom_card_ristou_person",
    sourcePath: "custom_cards/custom_card_ristou_person",
    publicId: "custom_card_ristou_person",
    rendererId: "custom_card_ristou_person",
    layoutProfile: "card:button-card+image",
    primitives: [
      "button-card",
      "image"
    ],
    customFields: [
      "entity_picture",
      "icon",
      "item1",
      "item2",
      "item3"
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
        name: "ulm_custom_card_ristou_camera_entity_dark",
        defaultValue: '""',
        selector: "text"
      },
      {
        name: "ulm_custom_card_ristou_camera_entity_light",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_custom_card_ristou_find_device_script",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_custom_card_ristou_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_custom_card_ristou_map_aspect_ratio",
        defaultValue: '"466:200"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_ristou_map_default_zoom",
        defaultValue: "11",
        selector: "number"
      },
      {
        name: "ulm_custom_card_ristou_map_enable",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_ristou_map_hours_to_show",
        defaultValue: "0",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_ristou_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_ristou_person_driving",
        defaultValue: '"Porusza się"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_ristou_person_driving_entity",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_custom_card_ristou_person_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_ristou_person_language_variables1",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_ristou_use_badge",
        defaultValue: "true",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_ristou_use_entity_picture",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_ristou_zones",
        defaultValue: "<null>",
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
      "person/device-tracker entities"
    ],
    deviations: [],
    sourceDigest: "66d46f0235430e2d736028e70d54494a6a7a86657216eabcce15d4b75722946c"
  },
  {
    upstreamId: "custom_card_saxel_fan",
    sourcePath: "custom_cards/custom_card_saxel_fan",
    publicId: "custom_card_saxel_fan",
    rendererId: "custom_card_saxel_fan",
    layoutProfile: "card:button-card+control",
    primitives: [
      "button-card",
      "control"
    ],
    customFields: [
      "button",
      "icon",
      "label",
      "mainSliderColor",
      "secondarySliderColor",
      "slider",
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
        name: "ulm_button_icon",
        defaultValue: '"mdi:rotate-3d-variant"',
        selector: "icon"
      },
      {
        name: "ulm_button_service",
        defaultValue: '"fan.oscillate"',
        selector: "text"
      },
      {
        name: "ulm_card_fan_horizontal",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_card_fan_hum_attribute",
        defaultValue: '"hum"',
        selector: "text"
      },
      {
        name: "ulm_card_fan_temp_attribute",
        defaultValue: '"temp"',
        selector: "text"
      },
      {
        name: "ulm_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_off",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_on",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_show_button",
        defaultValue: "true",
        selector: "boolean"
      },
      {
        name: "ulm_translation_engine",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_unavailable",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card",
      "my-slider"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:my-slider; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "3102287d8e218262aaa3c04d5bc2953d83fe59e14e435bdee42c37703211c6b4"
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
    upstreamId: "custom_card_schumijo_car",
    sourcePath: "custom_cards/custom_card_schumijo_car",
    publicId: "custom_card_schumijo_car",
    rendererId: "custom_card_schumijo_car",
    layoutProfile: "card:button-card+popup",
    primitives: [
      "button-card",
      "popup"
    ],
    customFields: [
      "icon",
      "item1",
      "item2",
      "state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_card_schumijo_car_energy_level",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_schumijo_car_lock",
        defaultValue: '"[[[ return variables.ulm_card_schumijo_car_lock ]]]"',
        selector: "entity"
      },
      {
        name: "ulm_card_schumijo_car_name",
        defaultValue: '"[[[ return variables.ulm_card_schumijo_car_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_schumijo_car_range",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_schumijo_car_tracker",
        defaultValue: '"[[[ return variables.ulm_card_schumijo_car_tracker ]]]"',
        selector: "entity"
      },
      {
        name: "ulm_custom_card_schumijo_ca_popup",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_schumijo_car_default_name",
        defaultValue: '"O meu carro"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_schumijo_car_energy_level",
        defaultValue: '"Nível de energia"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_schumijo_car_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_schumijo_car_range",
        defaultValue: '"Alcance"',
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [
      "history/statistics"
    ],
    deviations: [
      "Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable."
    ],
    sourceDigest: "1932419ed4a9c15ed073b5bdb41ba76fe027ce25ad3b5dcfdc6b3717cb99e129"
  },
  {
    upstreamId: "custom_card_schumijo_flower",
    sourcePath: "custom_cards/custom_card_schumijo_flower",
    publicId: "custom_card_schumijo_flower",
    rendererId: "custom_card_schumijo_flower",
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
        name: "ulm_custom_card_schumijo_flower_correct",
        defaultValue: '"Correto"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_schumijo_flower_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_schumijo_flower_problem",
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
    upstreamId: "custom_card_senoro_win",
    sourcePath: "custom_cards/custom_card_senoro_win",
    publicId: "custom_card_senoro_win",
    rendererId: "custom_card_senoro_win",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_custom_card_senoro_win_battery_is_at",
        defaultValue: '"Battery is at"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_senoro_win_battery_level",
        defaultValue: '""',
        selector: "text"
      },
      {
        name: "ulm_custom_card_senoro_win_battery_warning",
        defaultValue: "20",
        selector: "number"
      },
      {
        name: "ulm_custom_card_senoro_win_battery_warning_low",
        defaultValue: "5",
        selector: "number"
      },
      {
        name: "ulm_custom_card_senoro_win_closed",
        defaultValue: '"Closed"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_senoro_win_color",
        defaultValue: '"blue"',
        selector: "color"
      },
      {
        name: "ulm_custom_card_senoro_win_entity",
        defaultValue: '"[[[ return entity.entity_id ]]]"',
        selector: "entity"
      },
      {
        name: "ulm_custom_card_senoro_win_force_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_senoro_win_handle",
        defaultValue: '""',
        selector: "text"
      },
      {
        name: "ulm_custom_card_senoro_win_icon",
        defaultValue: '""',
        selector: "icon"
      },
      {
        name: "ulm_custom_card_senoro_win_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_senoro_win_locked",
        defaultValue: '"Locked"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_senoro_win_manipulated",
        defaultValue: '"Manipulated"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_senoro_win_name",
        defaultValue: '""',
        selector: "text"
      },
      {
        name: "ulm_custom_card_senoro_win_open",
        defaultValue: '"Open"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_senoro_win_tilted",
        defaultValue: '"Tilted"',
        selector: "text"
      },
      {
        name: "ulm_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_show_last_changed",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_unavailable",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "b0769244997ee14782a133104820c978f171c3922367f1545f9691314cb7401e"
  },
  {
    upstreamId: "custom_card_sisimomo_printer",
    sourcePath: "custom_cards/custom_card_sisimomo_printer",
    publicId: "custom_card_sisimomo_printer",
    rendererId: "custom_card_sisimomo_printer",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "label",
      "printer_state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_card_printer_name",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_idle",
        defaultValue: '"idle"',
        selector: "boolean"
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
        name: "ulm_translation_unavailable",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_unavailable",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "f6bf17876ec8f3efb8f722114000b01103bef7179bfaedf942ffe0a171b38fae"
  },
  {
    upstreamId: "custom_card_speedtest_shogun160",
    sourcePath: "custom_cards/custom_card_speedtest_shogun160",
    publicId: "custom_card_speedtest_shogun160",
    rendererId: "custom_card_speedtest_shogun160",
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
    upstreamId: "custom_card_tpx01_aircondition",
    sourcePath: "custom_cards/custom_card_tpx01_aircondition",
    publicId: "custom_card_tpx01_aircondition",
    rendererId: "custom_card_tpx01_aircondition",
    layoutProfile: "card:button-card+horizontal-stack",
    primitives: [
      "button-card",
      "horizontal-stack"
    ],
    customFields: [
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
    sourceDigest: "a6a13c8ba588f0c28f7641d5a6dc49dcdc7dddfa527e53302bb028b6e37d8b82"
  },
  {
    upstreamId: "custom_card_vncntdev_device_tracer",
    sourcePath: "custom_cards/custom_card_vncntdev_device_tracer",
    publicId: "custom_card_vncntdev_device_tracer",
    rendererId: "custom_card_vncntdev_device_tracer",
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
    actions: [],
    variables: [],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [
      "person/device-tracker entities"
    ],
    deviations: [],
    sourceDigest: "d06e7d1af82a0f813bcb0a7e77d637c8a603a0578c78132a0507364ffaf32c48"
  },
  {
    upstreamId: "custom_card_water_heater",
    sourcePath: "custom_cards/custom_card_water_heater",
    publicId: "custom_card_water_heater",
    rendererId: "custom_card_water_heater",
    layoutProfile: "card:native-card",
    primitives: [
      "native-card"
    ],
    customFields: [
      "icon",
      "label"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "hold_action",
      "tap_action"
    ],
    variables: [],
    dependencies: [],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "958d37f4830db5f762e7b43a65898f60178b2215257ca0ca7ae9d0dcb372fcd5"
  },
  {
    upstreamId: "custom_card_wilbiev_subtitle",
    sourcePath: "custom_cards/custom_card_wilbiev_subtitle",
    publicId: "card_title",
    variant: "divider-subtitle",
    rendererId: "card_title",
    layoutProfile: "card:button-card+entities",
    primitives: [
      "button-card",
      "entities"
    ],
    customFields: [
      "item1"
    ],
    stateDriven: !1,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_custom_card_wilbiev_subtitle_name",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_wilbiev_title_name",
        defaultValue: '"Subtitle"',
        selector: "text"
      }
    ],
    dependencies: [
      "button-card",
      "text-divider-row"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:text-divider-row; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "e8c58209fed509770ec70248b107bd4a2fb7a8f7a31eefa0ac5dadf5a2157633"
  },
  {
    upstreamId: "custom_card_wilbiev_title",
    sourcePath: "custom_cards/custom_card_wilbiev_title",
    publicId: "card_title",
    variant: "divider-title",
    rendererId: "card_title",
    layoutProfile: "card:button-card+entities",
    primitives: [
      "button-card",
      "entities"
    ],
    customFields: [
      "item1",
      "item2"
    ],
    stateDriven: !1,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_custom_card_wilbiev_title_name",
        defaultValue: '"Title"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_wilbiev_title_nav",
        defaultValue: '""',
        selector: "text"
      }
    ],
    dependencies: [
      "button-card",
      "mushroom-chips-card",
      "text-divider-row"
    ],
    backendRequirements: [],
    deviations: [
      "Upstream embeds custom:mushroom-chips-card; this plugin provides an original Lit equivalent without requiring that frontend dependency.",
      "Upstream embeds custom:text-divider-row; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    sourceDigest: "664d0990b1c404e6e9a14caadd090a466c4ed10a6bf9e7ee1d6573fa8ca23819"
  },
  {
    upstreamId: "custom_card_wsly_pollen",
    sourcePath: "custom_cards/custom_card_wsly_pollen",
    publicId: "custom_card_wsly_pollen",
    rendererId: "custom_card_wsly_pollen",
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
  },
  {
    upstreamId: "custom_card_yagrasdemonde_lights_count",
    sourcePath: "custom_cards/custom_card_yagrasdemonde_lights_count",
    publicId: "custom_card_yagrasdemonde_lights_count",
    rendererId: "custom_card_yagrasdemonde_lights_count",
    layoutProfile: "card:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_custom_card_yagrasdemonde_lights_count_color",
        defaultValue: '"yellow"',
        selector: "color"
      },
      {
        name: "ulm_custom_card_yagrasdemonde_lights_count_cover_0",
        defaultValue: '"Нет открытых ворот"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_yagrasdemonde_lights_count_cover_1",
        defaultValue: '"1 ворота открыты"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_yagrasdemonde_lights_count_cover_many",
        defaultValue: '"ворот открыты"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_yagrasdemonde_lights_count_force_background_color",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_yagrasdemonde_lights_count_icon_off",
        defaultValue: '"mdi:lightbulb-outline"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_yagrasdemonde_lights_count_icon_on",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_yagrasdemonde_lights_count_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_yagrasdemonde_lights_count_light_0",
        defaultValue: '"Свет отключен"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_yagrasdemonde_lights_count_light_1",
        defaultValue: '"1 лампа включена"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_yagrasdemonde_lights_count_light_many",
        defaultValue: '"лампы включены"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_yagrasdemonde_lights_count_type",
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
    sourceDigest: "420acb3fd6a76df25cc45c74128ac55892aa22f652fb560c0179b83ecd35f306"
  }
], Ne = new Map(za.map((e) => [e.upstreamId, e])), ja = (e) => /popup|browser_mod/i.test(e), Da = {
  weather: [
    "ulm_card_weather_backdrop",
    "ulm_card_weather_primary_info",
    "ulm_card_weather_secondary_info"
  ],
  light: [
    "ulm_card_light_enable_slider",
    "ulm_card_light_enable_slider_minSet",
    "ulm_card_light_enable_slider_maxSet",
    "ulm_card_light_enable_collapse",
    "ulm_card_light_enable_horizontal",
    "ulm_card_light_enable_color",
    "ulm_card_light_force_background_color",
    "ulm_card_light_enable_buttons",
    "ulm_card_light_brightness_low",
    "ulm_card_light_brightness_medium",
    "ulm_card_light_brightness_high",
    "ulm_card_light_enable_horizontal_wide",
    "ulm_card_light_color"
  ],
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
  ],
  cover: [
    "ulm_card_cover_color",
    "ulm_card_cover_display_left_right",
    "ulm_card_cover_enable_controls",
    "ulm_card_cover_enable_horizontal",
    "ulm_card_cover_enable_slider",
    "ulm_card_cover_enable_tilt",
    "ulm_card_cover_favorite_percentage",
    "ulm_card_cover_force_background_color",
    "ulm_card_cover_garage_large",
    "ulm_card_cover_icon",
    "ulm_card_cover_invert_percent",
    "ulm_card_cover_name",
    "ulm_card_cover_show_last_changed",
    "ulm_card_cover_slider_min",
    "ulm_card_cover_slider_max",
    "ulm_card_invert_percent"
  ],
  control: [
    "ulm_card_fan_button_service",
    "ulm_card_fan_color",
    "ulm_card_fan_enable_collapse",
    "ulm_card_fan_enable_horizontal",
    "ulm_card_fan_enable_slider",
    "ulm_card_fan_slider_min",
    "ulm_card_fan_slider_max",
    "ulm_card_fan_enable_button",
    "ulm_card_fan_button_icon",
    "ulm_card_fan_force_background_color",
    "ulm_card_fan_hum_attribute",
    "ulm_card_fan_icon",
    "ulm_card_fan_name",
    "ulm_card_fan_oscillate_attribute",
    "ulm_card_fan_temp_attribute"
  ]
}, Ca = {
  card_generic: [
    "ulm_card_generic_color",
    "ulm_card_generic_force_background_color",
    "ulm_card_generic_swap_color",
    "ulm_card_generic_swap_force_background_color"
  ],
  card_graph: [
    "ulm_card_graph_color",
    "ulm_card_graph_color2",
    "ulm_card_graph_entity2",
    "ulm_card_graph_group_by",
    "ulm_card_graph_hours",
    "ulm_card_graph_icon_color",
    "ulm_card_graph_line_width",
    "ulm_card_graph_points",
    "ulm_card_graph_type"
  ],
  card_navigate: [
    "ulm_card_navigate_color"
  ],
  card_binary_sensor: [
    "ulm_card_binary_sensor_color",
    "ulm_card_binary_sensor_force_background_color",
    "ulm_card_binary_sensor_icon",
    "ulm_card_binary_sensor_name",
    "ulm_card_binary_sensor_show_last_changed"
  ],
  card_binary_sensor_alert: [
    "ulm_card_binary_sensor_alert_color",
    "ulm_card_binary_sensor_alert_force_background_color",
    "ulm_card_binary_sensor_alert_icon",
    "ulm_card_binary_sensor_alert_name",
    "ulm_card_binary_sensor_alert_show_last_changed"
  ],
  card_input_boolean: [
    "ulm_card_input_boolean_color",
    "ulm_card_input_boolean_force_background_color",
    "ulm_card_input_boolean_icon",
    "ulm_card_input_boolean_name"
  ],
  custom_card_bar_card: [
    "ulm_custom_card_bar_card_color",
    "ulm_custom_card_bar_card_icon",
    "ulm_custom_card_bar_card_icon_color",
    "ulm_custom_card_bar_card_indicator",
    "ulm_custom_card_bar_card_max",
    "ulm_custom_card_bar_card_min",
    "ulm_custom_card_bar_card_name",
    "ulm_custom_card_bar_card_show_icon",
    "ulm_custom_card_bar_card_value"
  ],
  custom_card_haven_washer: [
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
  custom_card_httpedo13_sun: [
    "darkMode",
    "language",
    "showAzimuth",
    "showElevation",
    "timeFormat",
    "title"
  ],
  custom_card_iAbadia_battery_chip: [
    "ulm_custom_card_iAbadia_battery_chip_entity",
    "ulm_custom_card_iAbadia_battery_chip_icon",
    "ulm_custom_card_iAbadia_battery_chip_danger",
    "ulm_custom_card_iAbadia_battery_chip_warning"
  ],
  custom_card_imswel_medias: [
    "ulm_custom_card_imswel_medias_index",
    "ulm_custom_card_imswel_medias_platform"
  ]
}, Mt = (e, t) => !ja(t) && ([e.upstreamId, ...e.sourceIds ?? []].some((a) => Ca[a]?.includes(t) === !0) || Da[e.family]?.includes(t) === !0), _ = (e, t = "entity") => ({
  name: t,
  selector: { entity: e?.length ? { domain: e } : {} }
}), C = (e) => ({ name: e, selector: { text: {} } }), S = (e) => ({ name: e, selector: { boolean: {} } }), L = (e, t = 1, a = 168) => ({
  name: e,
  selector: { number: { min: t, max: a, mode: "box" } }
}), Z = (e) => ({ name: e, selector: { ui_action: {} } }), F = (e, t) => ({
  name: e,
  selector: { select: { mode: "dropdown", options: t } }
}), Ea = /* @__PURE__ */ new Set([
  "ulm_card_light_enable_slider_minSet",
  "ulm_card_light_enable_slider_maxSet",
  "ulm_card_light_brightness_low",
  "ulm_card_light_brightness_medium",
  "ulm_card_light_brightness_high",
  "ulm_card_battery_battery_level_danger",
  "ulm_card_battery_battery_level_warning",
  "ulm_card_cover_slider_min",
  "ulm_card_cover_slider_max",
  "ulm_card_cover_favorite_percentage",
  "ulm_card_fan_slider_min",
  "ulm_card_fan_slider_max"
]), Ma = /* @__PURE__ */ new Set([
  "ulm_custom_card_bar_card_indicator",
  "ulm_custom_card_bar_card_show_icon",
  "ulm_custom_card_bar_card_value",
  "ulm_card_generic_force_background_color",
  "ulm_card_generic_swap_force_background_color",
  "ulm_card_light_enable_horizontal_wide",
  "ulm_card_media_player_collapsible",
  "ulm_card_media_player_idle_off",
  "ulm_card_media_player_more_info",
  "ulm_card_media_player_power_button",
  "ulm_card_media_player_force_background_color"
]), Ta = /* @__PURE__ */ new Set([
  "ulm_custom_card_bar_card_min",
  "ulm_custom_card_bar_card_max",
  "ulm_card_graph_hours",
  "ulm_card_graph_line_width",
  "ulm_card_graph_points",
  "ulm_card_media_player_enable_volume_adjust"
]), La = /* @__PURE__ */ new Set([
  "ulm_card_cover_icon",
  "ulm_card_fan_button_icon",
  "ulm_card_fan_icon"
]), qa = /* @__PURE__ */ new Set([
  "ulm_card_homeassistant_entity",
  "ulm_card_homeassistant_core",
  "ulm_card_homeassistant_supervisor",
  "ulm_card_homeassistant_os"
]), ut = /* @__PURE__ */ new Set([
  "ulm_card_person_entity",
  "ulm_card_person_zone1",
  "ulm_card_person_zone2",
  "ulm_address",
  "ulm_address_locality",
  "ulm_card_person_driving_entity",
  "ulm_card_person_battery_entity",
  "ulm_card_person_battery_state_entity",
  "ulm_card_person_commute_entity"
]), Fa = /* @__PURE__ */ new Set([
  "ulm_card_imswel_person_entity",
  "ulm_card_imswel_person_wifi_tracker",
  "ulm_card_imswel_person_gps_tracker",
  "ulm_card_imswel_person_findmy_script",
  "ulm_card_imswel_person_use_entity_picture",
  "ulm_card_input_datetime_name",
  "ulm_card_input_number_entity",
  "ulm_card_input_number_name",
  "ulm_custom_card_irmajavi_entities",
  "ulm_custom_card_irmajavi_entities_entity_1",
  "ulm_custom_card_irmajavi_entities_entity_2",
  "ulm_custom_card_irmajavi_entities_entity_3",
  "ulm_custom_card_irmajavi_entities_entity_4",
  "ulm_custom_card_irmajavi_entities_icon",
  "ulm_custom_card_irmajavi_entities_name",
  "ulm_custom_card_irmajavi_entities_name_1",
  "ulm_custom_card_irmajavi_entities_name_2",
  "ulm_custom_card_irmajavi_entities_name_3",
  "ulm_custom_card_irmajavi_entities_name_4",
  "ulm_custom_card_irmajavi_entitites_name",
  "ulm_custom_card_irmajavi_speedtest_color",
  "ulm_custom_card_irmajavi_speedtest_download_speed_entity",
  "ulm_custom_card_irmajavi_speedtest_ping_entity",
  "ulm_custom_card_irmajavi_speedtest_router_model",
  "ulm_custom_card_irmajavi_speedtest_router_name",
  "ulm_custom_card_irmajavi_speedtest_upload_speed_entity",
  "ulm_custom_card_irmajavi_weather",
  "ulm_custom_card_irmajavi_weather_date",
  "ulm_custom_card_irmajavi_weather_entity_1",
  "ulm_custom_card_irmajavi_weather_entity_2",
  "ulm_custom_card_irmajavi_weather_entity_3",
  "ulm_custom_card_irmajavi_weather_entity_4",
  "ulm_custom_card_irmajavi_weather_name_1",
  "ulm_custom_card_irmajavi_weather_name_2",
  "ulm_custom_card_irmajavi_weather_name_3",
  "ulm_custom_card_irmajavi_weather_name_4",
  "ulm_custom_card_irmajavi_weather_temperature_outside"
]), Ra = {
  ulm_card_weather_primary_info: [
    { value: "extrema", label: "Today's high and low temperatures" },
    { value: "none", label: "Do not show extra information" }
  ],
  ulm_card_weather_secondary_info: [
    { value: "precipitation", label: "Precipitation chance or amount" },
    { value: "none", label: "Do not show extra information" }
  ]
}, I = () => [
  F("name_mode", [
    { value: "entity", label: "Use entity name" },
    { value: "custom", label: "Use custom name" },
    { value: "none", label: "Hide name" }
  ]),
  C("name"),
  { name: "icon", selector: { icon: {} } },
  F("icon_type", [
    { value: "icon", label: "Icon" },
    { value: "entity-picture", label: "Entity picture" },
    { value: "none", label: "No icon" }
  ]),
  F("layout", [
    { value: "default", label: "Automatic" },
    { value: "horizontal", label: "Horizontal" },
    { value: "vertical", label: "Vertical" }
  ]),
  S("fill_container"),
  F("primary_info", [
    { value: "name", label: "Name" },
    { value: "state", label: "State" },
    { value: "none", label: "None" }
  ]),
  F("secondary_info", [
    { value: "default", label: "Recommended card information" },
    { value: "state", label: "State" },
    { value: "name", label: "Name" },
    { value: "last-changed", label: "Last changed" },
    { value: "none", label: "None" }
  ])
], R = (e) => [
  _(e.preferredDomains),
  ...e.variants?.length ? [F("variant", e.variants.map((t) => ({
    value: t,
    label: e.variantLabels?.[t] ?? t.replaceAll("-", " ").replace(/\b\w/g, (a) => a.toUpperCase())
  })))] : [],
  ...I()
], _t = {
  weather: (e) => [
    ...R(e),
    _(["sensor"], "temperature_entity"),
    _(["sensor"], "humidity_entity"),
    S("show_forecast")
  ],
  climate: (e) => [...R(e), _(["sensor"], "humidity_entity"), S("show_controls")],
  light: (e) => [...R(e)],
  scene: (e) => [
    ...R(e),
    ...e.upstreamId === "card_welcome_scenes" ? [
      _(["input_boolean"], "collapse_entity"),
      _(["weather"], "weather_entity"),
      C("settings_path"),
      S("collapsed")
    ] : []
  ],
  presence: (e, t) => [
    ...R(e),
    ...e.upstreamId === "card_room" ? [] : [
      ...t?.variant === "small" ? [] : [
        _(["sensor"], "battery_entity"),
        _(["sensor"], "eta_entity"),
        _(["sensor"], "address_entity")
      ],
      S("use_entity_picture")
    ]
  ],
  battery: (e) => [...R(e)],
  bar: (e) => [...R(e)],
  energy: (e) => [...R(e), _(["sensor"], "min_entity"), _(["sensor"], "max_entity"), S("show_graph")],
  sensor: (e) => [
    ...R(e),
    ...e.upstreamId === "card_vertical_button" ? [
      { name: "ulm_card_vertical_button_color", selector: { ui_color: {} } },
      C("ulm_card_vertical_button_state")
    ] : [S("show_graph")]
  ],
  media: (e) => [...R(e), S("show_controls"), ...e.upstreamId === "custom_card_playstation" ? [{ name: "console_platform", selector: { select: { options: ["ps5", "xbox"] } } }] : []],
  cover: (e) => [...R(e), S("show_controls")],
  vacuum: (e) => [
    ...R(e),
    S("show_controls"),
    ...e.upstreamId === "card_vacuum" ? [
      _(["camera"], "ulm_card_vacuum_camera"),
      S("ulm_card_vacuum_camera_toggle"),
      _(["script"], "ulm_card_vacuum_room"),
      { name: "ulm_card_vacuum_room_icon", selector: { icon: {} } },
      S("ulm_card_vacuum_force_background_color")
    ] : []
  ],
  security: (e) => [...R(e)],
  navigation: (e) => [
    ...e.variants?.length ? [F("variant", e.variants.map((t) => ({
      value: t,
      label: e.variantLabels?.[t] ?? t
    })))] : [],
    ...I(),
    C("navigation_path")
  ],
  text: () => [...I(), C("secondary")],
  camera: (e) => [...R(e)],
  control: (e) => [
    ...R(e),
    .../power_outlet|more_power_outlet/.test(e.upstreamId) ? [_(["sensor"], "graph_entity"), S("show_graph")] : [],
    S("show_controls")
  ],
  "alarm-time": (e) => [...R(e), _(["input_datetime"], "datetime_entity"), S("show_controls")],
  door: (e) => [...R(e), _(["lock"], "lock_entity"), _(["sensor"], "battery_entity"), S("show_controls")],
  entity: (e) => [...R(e), C("secondary")]
}, Ua = (e, t) => [
  ...e.upstreamId === "card_person" ? [
    _(["person"]),
    _(["sensor"], "battery_entity"),
    _(["sensor"], "eta_entity"),
    _(["sensor"], "address_entity"),
    S("use_entity_picture"),
    ...I()
  ] : e.upstreamId === "card_power_outlet" ? [
    _(["switch", "light"]),
    _(["sensor"], "consumption_entity"),
    ...I()
  ] : e.upstreamId === "card_room" ? [
    _(),
    S("label_use_temperature"),
    S("label_use_brightness"),
    _(["input_select"], "input_select_entity"),
    C("input_select_option"),
    ...I()
  ] : e.upstreamId === "card_scenes" ? [
    ...e.variants?.length ? [F("variant", e.variants.map((a) => ({
      value: a,
      label: e.variantLabels?.[a] ?? a
    })))] : [],
    ...I()
  ] : e.upstreamId === "card_script" ? [_(["script"]), ...I()] : e.upstreamId === "card_thermostat" ? [
    _(["climate"]),
    S("ulm_card_thermostat_enable_collapse"),
    S("ulm_card_thermostat_enable_controls"),
    S("ulm_card_thermostat_enable_hvac_modes"),
    S("ulm_card_thermostat_enable_background_color"),
    S("ulm_card_thermostat_enable_display_temperature"),
    S("ulm_card_thermostat_enable_horizontal"),
    _(["fan"], "fan_entity"),
    L("thermostat_minimum_temp_spread", 0, 20),
    L("thermostat_temp_step", 0.1, 10),
    ...I()
  ] : e.upstreamId === "custom_card_afvalophaling" ? [
    _(["sensor", "calendar"]),
    S("show_today"),
    _(["sensor"], "today_entity"),
    S("show_tomorrow"),
    _(["sensor"], "tomorrow_entity"),
    ...I()
  ] : e.upstreamId === "custom_card_paddy_waste_collection" ? [
    _(["sensor"]),
    ...I()
  ] : e.upstreamId === "custom_card_paddy_welcome" ? [
    ...e.variants?.length ? [F("variant", e.variants.map((a) => ({
      value: a,
      label: e.variantLabels?.[a] ?? a
    })))] : [],
    _(["person"]),
    _(["sensor"], "time_entity"),
    _(["weather"], "weather_entity"),
    { name: "news_entities", selector: { entity: { multiple: !0 } } },
    ...I()
  ] : e.upstreamId === "custom_card_person_chip" ? [
    _(["person", "device_tracker"]),
    S("use_entity_picture"),
    ...I()
  ] : e.upstreamId === "custom_card_playstation" ? [
    _(["media_player", "sensor"]),
    ...I()
  ] : e.upstreamId === "custom_card_qubino" ? [
    _(["light"]),
    _([], "qubino_more_info_entity"),
    ...I()
  ] : e.upstreamId === "custom_card_ristou_person" ? [
    _(["person", "device_tracker"]),
    S("ulm_custom_card_ristou_use_entity_picture"),
    S("ulm_custom_card_ristou_use_badge"),
    _(["binary_sensor"], "ulm_custom_card_ristou_person_driving_entity"),
    { name: "ulm_custom_card_ristou_zones", selector: { entity: { multiple: !0 } } },
    _(["script", "button"], "ulm_custom_card_ristou_find_device_script"),
    S("ulm_custom_card_ristou_map_enable"),
    C("ulm_custom_card_ristou_map_aspect_ratio"),
    L("ulm_custom_card_ristou_map_hours_to_show", 0, 168),
    L("ulm_custom_card_ristou_map_default_zoom", 1, 20),
    _(["camera"], "ulm_custom_card_ristou_camera_entity_light"),
    _(["camera"], "ulm_custom_card_ristou_camera_entity_dark"),
    ...I()
  ] : e.upstreamId === "custom_card_alarm_time" ? [
    _(["input_boolean", "switch"]),
    _(["input_datetime"], "datetime_entity"),
    L("ulm_card_alarm_time_step", 1, 180),
    S("ulm_card_alarm_time_collapse"),
    S("ulm_card_alarm_time_horizontal"),
    { name: "ulm_card_alarm_time_icon", selector: { icon: {} } },
    { name: "ulm_card_alarm_time_color", selector: { ui_color: {} } },
    ...I()
  ] : e.upstreamId === "custom_card_apexcharts" ? [
    _(["sensor"]),
    _(["sensor"], "series_2_entity"),
    _(["sensor"], "series_3_entity"),
    ...I()
  ] : e.upstreamId === "custom_card_camera" ? [
    _(["camera"]),
    S("ulm_custom_card_camera_title"),
    C("ulm_custom_card_camera_name"),
    C("ulm_custom_card_camera_label"),
    C("ulm_custom_card_camera_aspect_ratio"),
    ...I()
  ] : e.upstreamId === "custom_card_chromecast" ? [
    _(["media_player"]),
    C("ulm_card_media_player_with_controls_name"),
    ...I()
  ] : e.upstreamId === "custom_card_damix48_power_details" ? [
    _(["sensor"]),
    _(["sensor"], "ulm_card_power_details_entity"),
    C("ulm_card_power_details_name"),
    L("ulm_card_power_details_hours", 1, 168),
    L("ulm_card_power_details_height", 80, 600),
    S("ulm_card_power_details_24hour"),
    ...I()
  ] : e.upstreamId === "custom_card_light_colorpick" ? [
    _(["light"]),
    C("ulm_card_light_colorpick_name"),
    L("ulm_card_light_colorpick_transition", 0, 60),
    ...I()
  ] : e.upstreamId === "custom_card_media_player_sonos" ? [
    _(["media_player"]),
    C("ulm_card_media_player_with_controls_name"),
    ...I()
  ] : e.upstreamId === "custom_card_more_power_outlet" ? [
    _(["switch", "light"]),
    _(["sensor"], "power_entity"),
    _(["sensor"], "energy_entity"),
    _(["sensor"], "time_entity"),
    ...I()
  ] : e.upstreamId === "custom_card_mpse_gauge" ? [
    _(["sensor"]),
    L("minimum", -1e5, 1e5),
    L("maximum", -1e5, 1e5),
    ...I()
  ] : e.upstreamId === "custom_card_mpse_printer" ? [
    _(["sensor", "binary_sensor"]),
    _(["sensor"], "black_entity"),
    _(["sensor"], "yellow_entity"),
    _(["sensor"], "magenta_entity"),
    _(["sensor"], "cyan_entity"),
    ...I()
  ] : e.upstreamId === "custom_card_mpse_thermostat" ? [
    _(["climate"]),
    ...I()
  ] : e.upstreamId === "custom_card_device_tracker" ? [
    _(["device_tracker", "person"]),
    { name: "ulm_custom_card_device_tracker_icon", selector: { icon: {} } },
    _(["device_tracker"], "ulm_custom_card_device_tracker_tracker_1_entity"),
    F("ulm_custom_card_device_tracker_tracker_1_type", [
      { value: "default", label: "Home" },
      { value: "lan", label: "LAN" },
      { value: "bluetooth", label: "Bluetooth" }
    ]),
    _(["device_tracker"], "ulm_custom_card_device_tracker_tracker_2_entity"),
    F("ulm_custom_card_device_tracker_tracker_2_type", [
      { value: "default", label: "Home" },
      { value: "lan", label: "LAN" },
      { value: "bluetooth", label: "Bluetooth" }
    ]),
    ...I()
  ] : e.upstreamId === "custom_card_drealine_roomview" ? [
    _(e.preferredDomains),
    _(["group", "light"], "group_lights"),
    _(["group", "binary_sensor"], "group_motions"),
    _(["group", "binary_sensor"], "group_doors"),
    _(["group", "binary_sensor"], "group_windows"),
    _(["group", "switch"], "group_outlets"),
    _(["group", "media_player"], "group_tv"),
    _(["group", "binary_sensor"], "group_water"),
    _(["group", "cover"], "group_windows_shutters"),
    _(["sensor"], "temperature"),
    _(["sensor"], "humidity"),
    ...I()
  ] : e.upstreamId === "custom_card_eraycetinay_elapsed_time" ? [
    _(["input_datetime"]),
    ...I()
  ] : e.upstreamId === "custom_card_eraycetinay_lock" ? [
    _(["lock"]),
    S("ulm_custom_card_eraycetinay_lock_tap_control"),
    S("ulm_custom_card_eraycetinay_lock_only_open"),
    _(["sensor", "binary_sensor"], "ulm_custom_card_eraycetinay_lock_battery_level"),
    L("ulm_custom_card_eraycetinay_lock_battery_warning", 0, 100),
    L("ulm_custom_card_eraycetinay_lock_battery_warning_low", 0, 100),
    _(["binary_sensor"], "ulm_custom_card_eraycetinay_lock_door_open"),
    S("ulm_custom_card_eraycetinay_lock_battery_sensor_binary"),
    F("ulm_custom_card_eraycetinay_lock_battery_sensor_binary_low_state", [
      { value: "on", label: "On means low" },
      { value: "off", label: "Off means low" }
    ]),
    ...I()
  ] : e.upstreamId === "custom_card_esh_room" ? [
    _(),
    _(["light"], "ulm_custom_card_esh_room_light_entity"),
    _(["climate"], "ulm_custom_card_esh_room_climate_entity"),
    _(["cover"], "ulm_custom_card_esh_room_cover_entity"),
    { name: "ulm_card_esh_room_light_icon_on", selector: { icon: {} } },
    { name: "ulm_card_esh_room_light_icon_off", selector: { icon: {} } },
    { name: "ulm_card_esh_room_cover_icon_open", selector: { icon: {} } },
    { name: "ulm_card_esh_room_cover_icon_closed", selector: { icon: {} } },
    S("ulm_card_dynamic_color"),
    C("secondary"),
    ...I()
  ] : e.upstreamId === "custom_card_esh_welcome" ? [
    _(["person"]),
    _(["input_boolean"], "ulm_card_esh_welcome_collapse"),
    _(["weather"], "ulm_weather"),
    ...Array.from({ length: 5 }, (a, r) => r + 1).flatMap((a) => [
      C(`nav_${a}`),
      { name: `icon_${a}`, selector: { icon: {} } },
      C(`name_${a}`),
      F(`color_${a}`, ["blue", "red", "green", "yellow", "pink", "purple"].map((r) => ({
        value: r,
        label: r[0].toUpperCase() + r.slice(1)
      })))
    ]),
    ...I()
  ] : e.upstreamId === "custom_card_haven_washer" ? [
    _(["sensor", "switch", "binary_sensor"]),
    _(["sensor", "switch", "binary_sensor"], "power_entity"),
    _(["sensor", "binary_sensor"], "door_entity"),
    _(["sensor", "binary_sensor"], "finished_entity"),
    _(["sensor", "binary_sensor"], "ulm_custom_card_washer_remote_control"),
    _(["sensor"], "ulm_custom_card_washer_job_progress"),
    _(["input_boolean"], "ulm_custom_card_washer_delayed_start"),
    _(["input_datetime"], "ulm_custom_card_washer_delayed_starttime"),
    C("ulm_custom_card_washer_machine_stop_state"),
    { name: "ulm_custom_card_washer_job_states", selector: { object: {} } },
    C("ulm_custom_card_washer_label_idle"),
    C("ulm_custom_card_washer_label_configuring"),
    C("ulm_custom_card_washer_label_running"),
    Z("ulm_custom_card_washer_start_action"),
    Z("ulm_custom_card_washer_pause_action"),
    Z("ulm_custom_card_washer_stop_action"),
    ...I()
  ] : e.upstreamId === "custom_card_httpedo13_sun" ? [
    _(["sun"]),
    C("title"),
    C("language"),
    F("timeFormat", [
      { value: "24h", label: "24-hour time" },
      { value: "12h", label: "12-hour time" }
    ]),
    S("darkMode"),
    S("showAzimuth"),
    S("showElevation"),
    ...I()
  ] : e.upstreamId === "custom_card_httpedo13_thermostat" ? [
    _(["climate"]),
    F("variant", [
      { value: "buttons", label: "Always show controls" },
      { value: "collapse", label: "Hide controls while off" }
    ]),
    ...I()
  ] : e.upstreamId === "custom_card_iAbadia_battery_chip" ? [
    _(["sensor"]),
    _(["sensor", "binary_sensor"], "battery_state_entity"),
    _(["sensor"], "charger_type_entity"),
    { name: "ulm_custom_card_iAbadia_battery_chip_icon", selector: { icon: {} } },
    L("ulm_custom_card_iAbadia_battery_chip_warning", 0, 100),
    L("ulm_custom_card_iAbadia_battery_chip_danger", 0, 100),
    ...I()
  ] : e.upstreamId === "custom_card_imswel_medias" ? [
    _(["sensor", "media_player"]),
    _(["sensor", "media_player"], "secondary_entity"),
    F("variant", [
      { value: "library", label: "Recently added library" },
      { value: "upcoming", label: "Upcoming media" }
    ]),
    L("ulm_custom_card_imswel_medias_index", 0, 100),
    F("ulm_custom_card_imswel_medias_platform", [
      { value: "plex", label: "Plex" },
      { value: "radarr", label: "Radarr" },
      { value: "sonarr", label: "Sonarr" }
    ]),
    ...I()
  ] : e.upstreamId === "custom_card_nik_nas" ? [
    _(["binary_sensor", "sensor", "switch"]),
    _(["sensor"], "disk_entity"),
    C("disk_name"),
    { name: "disk_icon", selector: { icon: {} } },
    { name: "disk_color", selector: { ui_color: {} } },
    _(["sensor"], "temperature_entity"),
    C("temperature_name"),
    { name: "temperature_icon", selector: { icon: {} } },
    { name: "temperature_color", selector: { ui_color: {} } },
    L("temperature_max", 1, 1e5),
    _(["sensor"], "memory_entity"),
    C("memory_name"),
    { name: "memory_icon", selector: { icon: {} } },
    { name: "memory_color", selector: { ui_color: {} } },
    L("memory_max", 1, 1e5),
    _(["sensor"], "cpu_entity"),
    C("cpu_name"),
    { name: "cpu_icon", selector: { icon: {} } },
    { name: "cpu_color", selector: { ui_color: {} } },
    L("cpu_max", 1, 1e5),
    C("graph_span"),
    F("chart_type", [{ value: "radialBar", label: "Radial utilization rings" }]),
    ...I()
  ] : e.upstreamId === "custom_card_imswel_person" ? [
    _(["person"]),
    _(["device_tracker"], "wifi_tracker_entity"),
    _(["device_tracker"], "gps_tracker_entity"),
    _(["script"], "findmy_script_entity"),
    _(["sensor"], "battery_entity"),
    S("use_entity_picture"),
    ...I()
  ] : e.upstreamId === "custom_card_input_datetime" ? [
    _(["input_datetime"]),
    C("ulm_card_input_datetime_name"),
    ...I()
  ] : e.upstreamId === "custom_card_input_number" ? [
    _(["input_number", "counter", "select", "input_select"]),
    C("ulm_card_input_number_name"),
    ...I()
  ] : e.upstreamId === "custom_card_irmajavi_entities" ? [
    _(),
    { name: "ulm_custom_card_irmajavi_entities_icon", selector: { icon: {} } },
    C("ulm_custom_card_irmajavi_entities_name"),
    ...[1, 2, 3, 4].flatMap((a) => [
      _(void 0, `ulm_custom_card_irmajavi_entities_entity_${a}`),
      C(`ulm_custom_card_irmajavi_entities_name_${a}`)
    ]),
    ...I()
  ] : e.upstreamId === "custom_card_irmajavi_speedtest" ? [
    _(["sensor"]),
    _(["sensor"], "download_entity"),
    _(["sensor"], "upload_entity"),
    _(["sensor"], "ping_entity"),
    C("ulm_custom_card_irmajavi_speedtest_router_name"),
    C("ulm_custom_card_irmajavi_speedtest_router_model"),
    { name: "ulm_custom_card_irmajavi_speedtest_color", selector: { ui_color: {} } },
    ...I()
  ] : e.upstreamId === "custom_card_irmajavi_weather" ? [
    _(["weather"]),
    _(["sensor"], "temperature_entity"),
    _(["sensor"], "date_entity"),
    ...[1, 2, 3, 4].flatMap((a) => [
      _(void 0, `ulm_custom_card_irmajavi_weather_entity_${a}`),
      C(`ulm_custom_card_irmajavi_weather_name_${a}`)
    ]),
    ...I()
  ] : e.upstreamId === "custom_card_homeassistant_updates" ? [
    _(["update", "sensor", "binary_sensor"]),
    _(["update", "sensor", "binary_sensor"], "ulm_card_homeassistant_core"),
    _(["update", "sensor", "binary_sensor"], "ulm_card_homeassistant_supervisor"),
    _(["update", "sensor", "binary_sensor"], "ulm_card_homeassistant_os"),
    ...I()
  ] : e.upstreamId === "custom_card_nik_tablet" ? [
    _(["binary_sensor", "sensor", "switch"]),
    _(["switch", "input_boolean"], "tablet_button_usb_entity"),
    _(["switch", "input_boolean"], "tablet_button_motion_entity"),
    _(["light", "switch", "input_boolean"], "tablet_button_display_entity"),
    _(["button"], "tablet_restart_entity"),
    _(["switch", "input_boolean"], "tablet_maintenance_entity"),
    _(["button"], "tablet_reload_entity"),
    _(["sensor"], "tablet_ram_entity"),
    _(["sensor"], "tablet_disk_entity"),
    _(["sensor", "binary_sensor", "switch"], "tablet_power_entity"),
    _(["sensor"], "battery_entity"),
    ...I()
  ] : e.upstreamId === "custom_card_person_info" ? [
    _(["person"]),
    ...e.variants?.length ? [F("variant", e.variants.map((a) => ({
      value: a,
      label: e.variantLabels?.[a] ?? a
    })))] : [],
    S("ulm_card_person_use_entity_picture"),
    _(["zone"], "ulm_card_person_zone1"),
    _(["zone"], "ulm_card_person_zone2"),
    ...t?.variant === "small" ? [] : [
      _(["sensor"], "ulm_card_person_commute_entity"),
      { name: "ulm_card_person_cummute_icon", selector: { icon: {} } },
      S("ulm_multiline")
    ],
    _(["sensor"], "ulm_address"),
    _(["sensor"], "ulm_address_locality"),
    _(["binary_sensor"], "ulm_card_person_driving_entity"),
    _(["sensor"], "ulm_card_person_battery_entity"),
    _(["sensor", "binary_sensor"], "ulm_card_person_battery_state_entity"),
    L("ulm_card_battery_battery_level_danger", 0, 100),
    L("ulm_card_battery_battery_level_warning", 0, 100),
    ...I()
  ] : (_t[e.family] ?? _t.entity)(e, t),
  Z("tap_action"),
  Z("hold_action"),
  Z("double_tap_action")
], Oa = (e, t) => {
  const a = t?.variant ? (e.sourceIds ?? [e.upstreamId]).filter((o) => ct(o) === t.variant || o === e.upstreamId && ct(o) === void 0) : e.sourceIds ?? [e.upstreamId];
  return [...new Map(
    a.flatMap((o) => Ne.get(o)?.variables ?? []).map((o) => [o.name, o])
  ).values()].filter((o) => Mt(e, o.name)).filter((o) => !Fa.has(o.name)).filter((o) => !(e.upstreamId === "custom_card_homeassistant_updates" && o.name === "ulm_card_homeassistant_entity")).filter((o) => !(e.upstreamId === "custom_card_person_info" && (ut.has(o.name) || o.name === "ulm_card_person_use_entity_picture" || o.name === "ulm_card_person_cummute_icon" || o.name === "ulm_multiline" || o.name === "ulm_card_battery_battery_level_danger" || o.name === "ulm_card_battery_battery_level_warning"))).map((o) => {
    if (e.upstreamId === "custom_card_homeassistant_updates" && qa.has(o.name))
      return _(["update", "sensor", "binary_sensor"], o.name);
    if (e.upstreamId === "custom_card_person_info" && ut.has(o.name)) {
      const i = o.name === "ulm_card_person_entity" ? ["person"] : o.name.startsWith("ulm_card_person_zone") ? ["zone"] : o.name === "ulm_card_person_driving_entity" ? ["binary_sensor"] : ["sensor", "binary_sensor"];
      return _(i, o.name);
    }
    const n = Ra[o.name];
    if (n) return F(o.name, n);
    if (La.has(o.name)) return { name: o.name, selector: { icon: {} } };
    if (Ma.has(o.name)) return S(o.name);
    if (Ta.has(o.name)) return L(o.name, -1e5, 1e5);
    if (Ea.has(o.name))
      return {
        name: o.name,
        selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
      };
    switch (o.selector) {
      case "entity":
        return _(void 0, o.name);
      case "entity-multiple":
        return {
          name: o.name,
          selector: { entity: { multiple: !0 } }
        };
      case "action":
        return Z(o.name);
      case "icon":
        return { name: o.name, selector: { icon: {} } };
      case "color":
        return { name: o.name, selector: { ui_color: {} } };
      case "boolean":
        return S(o.name);
      case "number":
        return L(o.name, -1e5, 1e5);
      case "object":
        return { name: o.name, selector: { object: {} } };
      default:
        return C(o.name);
    }
  });
}, Ba = [
  [/input_boolean/, "mdi:toggle-switch"],
  [/light/, "mdi:lightbulb"],
  [/fan/, "mdi:fan"],
  [/cover|garage|door/, "mdi:window-shutter"],
  [/vacuum/, "mdi:robot-vacuum"],
  [/thermostat|climate|heat_pump|aircondition/, "mdi:thermostat"],
  [/weather/, "mdi:weather-partly-cloudy"],
  [/battery/, "mdi:battery"],
  [/person|presence|tracker|tracer/, "mdi:account"],
  [/media|chromecast/, "mdi:play-circle"],
  [/playstation/, "mdi:sony-playstation"],
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
], Tt = (e, t) => t?.attributes.icon ? t.attributes.icon : e.upstreamId === "custom_card_damix48_power_details" ? "mdi:flash" : e.upstreamId === "custom_card_playstation" && t?.entity_id.toLowerCase().includes("xbox") ? "mdi:microsoft-xbox" : Ba.find(([a]) => a.test(e.upstreamId))?.[1] ?? "mdi:information-outline", Na = (e) => {
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
}, Ha = (e) => {
  const t = {};
  for (const a of e.sourceIds ?? [e.upstreamId])
    for (const r of Ne.get(a)?.variables ?? []) {
      if (!Mt(e, r.name)) continue;
      const o = Na(r.defaultValue);
      o !== void 0 && (t[r.name] = o);
    }
  return t;
}, Lt = (e, t, a) => {
  const r = a ? t?.states[a] : void 0, o = e.upstreamId === "card_person" ? {
    icon: "mdi:face-man",
    use_entity_picture: !1
  } : e.upstreamId === "card_power_outlet" ? {
    icon: "mdi:power-socket-eu"
  } : e.upstreamId === "card_room" ? {
    icon: "mdi:sofa-single",
    label_use_temperature: !0,
    label_use_brightness: !1
  } : e.upstreamId === "card_script" ? {
    icon: "mdi:script-text"
  } : e.upstreamId === "card_thermostat" ? {
    icon: "mdi:thermometer",
    thermostat_minimum_temp_spread: 1
  } : e.upstreamId === "custom_card_device_tracker" ? {
    ulm_custom_card_device_tracker_icon: "mdi:cellphone",
    ulm_custom_card_device_tracker_tracker_1_type: "lan",
    ulm_custom_card_device_tracker_tracker_2_type: "bluetooth"
  } : e.upstreamId === "custom_card_eraycetinay_lock" ? {
    ulm_custom_card_eraycetinay_lock_tap_control: !1,
    ulm_custom_card_eraycetinay_lock_only_open: !1,
    ulm_custom_card_eraycetinay_lock_battery_warning: 20,
    ulm_custom_card_eraycetinay_lock_battery_warning_low: 5,
    ulm_custom_card_eraycetinay_lock_battery_sensor_binary: !1,
    ulm_custom_card_eraycetinay_lock_battery_sensor_binary_low_state: "on"
  } : e.upstreamId === "custom_card_esh_room" ? {
    ulm_card_esh_room_light_icon_on: "mdi:lightbulb",
    ulm_card_esh_room_light_icon_off: "mdi:lightbulb-off",
    ulm_card_esh_room_cover_icon_open: "mdi:blinds-open",
    ulm_card_esh_room_cover_icon_closed: "mdi:roller-shade-closed",
    ulm_card_dynamic_color: !1
  } : e.upstreamId === "custom_card_esh_welcome" ? {
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
  } : e.upstreamId === "custom_card_paddy_welcome" ? {
    variant: Object.keys(t?.states ?? {}).some((i) => i.startsWith("weather.")) ? "weather" : "message",
    time_entity: Object.keys(t?.states ?? {}).find((i) => i === "sensor.time"),
    weather_entity: Object.keys(t?.states ?? {}).find((i) => i.startsWith("weather."))
  } : e.upstreamId === "custom_card_person_chip" ? {
    use_entity_picture: !0,
    icon: "mdi:face-man"
  } : e.upstreamId === "custom_card_playstation" ? {
    icon: "mdi:sony-playstation",
    show_controls: !1
  } : e.upstreamId === "custom_card_qubino" ? {
    icon: "mdi:memory"
  } : e.upstreamId === "custom_card_ristou_person" ? {
    ulm_custom_card_ristou_use_entity_picture: !1,
    ulm_custom_card_ristou_use_badge: !0,
    ulm_custom_card_ristou_map_enable: !1,
    ulm_custom_card_ristou_map_aspect_ratio: "466:200",
    ulm_custom_card_ristou_map_hours_to_show: 0,
    ulm_custom_card_ristou_map_default_zoom: 11
  } : {}, n = (/* @__PURE__ */ new Set([
    "card_battery",
    "card_binary_sensor",
    "card_cover",
    "card_fan",
    "card_input_boolean"
  ])).has(e.upstreamId);
  return {
    type: `custom:${e.tag}`,
    ...Ha(e),
    ...o,
    entity: a,
    waste_streams: e.upstreamId === "custom_card_afvalophaling" ? va() : void 0,
    show_today: e.upstreamId === "custom_card_afvalophaling" ? !1 : void 0,
    show_tomorrow: e.upstreamId === "custom_card_afvalophaling" ? !1 : void 0,
    name: r?.attributes.friendly_name,
    icon: n ? void 0 : o.icon ?? Tt(e, r),
    show_icon: !0,
    show_state: !0,
    layout: "horizontal"
  };
};
var Wa = Object.defineProperty, Ga = Object.getOwnPropertyDescriptor, He = (e, t, a, r) => {
  for (var o = r > 1 ? void 0 : r ? Ga(t, a) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (o = (r ? i(t, a, o) : i(o)) || o);
  return r && o && Wa(t, a, o), o;
};
let ge = class extends oe {
  constructor() {
    super(...arguments), this.computeLabel = (e) => this.config?.type.includes("custom-card-afvalophaling") && e.name === "entity" ? "Optional card action entity" : Sa(this.hass, e.name), this.computeHelper = (e) => Aa(e.name), this.valueChanged = (e) => {
      if (!this.config || !e.detail.value) return;
      const t = e.detail.value, a = { ...this.config, ...t };
      this.config = a, ne(this, "config-changed", { config: a });
    }, this.addWasteStream = () => {
      this.config && this.updateWasteStreams([
        ...J(this.config),
        { enabled: !0, entity: "", label: "Custom waste", icon: "mdi:trash-can", color: "#43a047" }
      ]);
    };
  }
  setConfig(e) {
    const t = e.type.replace(/^custom:/, ""), a = Be.find((r) => r.tag === t);
    this.config = {
      ...e,
      variant: e.variant ?? a?.variant
    };
  }
  render() {
    if (!this.hass || !this.config) return p;
    const e = fa(this.config.type.replace(/^custom:/, ""));
    if (!e) return p;
    const t = Ua(e, this.config), a = Oa(e, this.config).filter((o) => e.upstreamId !== "custom_card_afvalophaling" || !o.name.startsWith("ulm_card_datum_") && !o.name.includes("ophaling")), r = { ...Lt(e, this.hass, this.config.entity), ...this.config };
    return s`
      <ha-form
        .hass=${this.hass}
        .data=${r}
        .schema=${t}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
      ${e.upstreamId === "custom_card_afvalophaling" ? this.renderWasteStreamEditor() : e.family === "scene" ? this.renderItemEditor("scene_items", "Scene buttons", ["scene"]) : e.upstreamId === "card_room" ? this.renderItemEditor("room_sensors", "Room sensor buttons") : p}
      ${a.length ? s`
        <ha-expansion-panel outlined>
          <span slot="header">Additional appearance and controls (${a.length})</span>
          <ha-form
            .hass=${this.hass}
            .data=${r}
            .schema=${a}
            .computeLabel=${this.computeLabel}
            .computeHelper=${this.computeHelper}
            @value-changed=${this.valueChanged}
          ></ha-form>
        </ha-expansion-panel>
      ` : p}
    `;
  }
  renderItemEditor(e, t, a) {
    if (!this.config) return p;
    const r = this.config[e] ?? [], o = r.length ? r : (this.config.entities ?? []).map((n) => ({ entity: n }));
    return s`
      <section class="item-editor">
        <h3>${t}</h3>
        <p>Configure each button with a clear entity, label, icon, color, active state and action.</p>
        ${o.map((n, i) => s`
          <div class="item-row">
            <ha-selector
              class="wide"
              .hass=${this.hass}
              .selector=${{ entity: a?.length ? { domain: a } : {} }}
              .value=${n.entity}
              @value-changed=${(l) => this.updateItem(e, i, "entity", l.detail.value)}
            ></ha-selector>
            <ha-textfield
              label="Label"
              .value=${n.name ?? n.label ?? ""}
              @input=${(l) => this.updateItem(e, i, "name", l.target.value)}
            ></ha-textfield>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ icon: {} }}
              .value=${n.icon}
              @value-changed=${(l) => this.updateItem(e, i, "icon", l.detail.value)}
            ></ha-selector>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ ui_color: {} }}
              .value=${n.color}
              @value-changed=${(l) => this.updateItem(e, i, "color", l.detail.value)}
            ></ha-selector>
            <ha-textfield
              label="Active when state is"
              .value=${n.active_state ?? ""}
              @input=${(l) => this.updateItem(e, i, "active_state", l.target.value)}
            ></ha-textfield>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ ui_action: {} }}
              .value=${n.tap_action}
              @value-changed=${(l) => this.updateItem(e, i, "tap_action", l.detail.value)}
            ></ha-selector>
            <div class="item-actions wide">
              <button @click=${() => this.removeItem(e, i)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${() => this.addItem(e)}>Add button</button>
      </section>
    `;
  }
  renderWasteStreamEditor() {
    if (!this.config) return p;
    const e = J(this.config);
    return s`
      <section class="item-editor waste-stream-editor">
        <h3>Waste streams</h3>
        <p>Each enabled row uses its own sensor or calendar entity. Empty or disabled rows are omitted from the card.</p>
        ${e.map((t, a) => s`
          <div class="item-row waste-stream-row" data-stream-index=${a}>
            <h4>${t.label || `Waste stream ${a + 1}`}</h4>
            <label class="field">
              <span>Show this waste stream</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ boolean: {} }}
                .value=${t.enabled !== !1}
                @value-changed=${(r) => this.updateWasteStream(a, "enabled", r.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>Collection date entity</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: { domain: ["sensor", "calendar"] } }}
                .value=${t.entity}
                @value-changed=${(r) => this.updateWasteStream(a, "entity", r.detail.value)}
              ></ha-selector>
            </label>
            <ha-textfield
              label="Label"
              .value=${t.label ?? ""}
              @input=${(r) => this.updateWasteStream(a, "label", r.target.value)}
            ></ha-textfield>
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${t.icon}
                @value-changed=${(r) => this.updateWasteStream(a, "icon", r.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Color</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: {} }}
                .value=${t.color}
                @value-changed=${(r) => this.updateWasteStream(a, "color", r.detail.value)}
              ></ha-selector>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${a === 0} @click=${() => this.moveWasteStream(a, -1)}>Move up</button>
              <button ?disabled=${a === e.length - 1} @click=${() => this.moveWasteStream(a, 1)}>Move down</button>
              <button @click=${() => this.removeWasteStream(a)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addWasteStream}>Add waste stream</button>
      </section>
    `;
  }
  updateItem(e, t, a, r) {
    if (!this.config) return;
    const o = [...this.config[e] ?? (this.config.entities ?? []).map((n) => ({ entity: n }))];
    o[t] = { ...o[t], [a]: r || void 0 }, this.updateItems(e, o);
  }
  addItem(e) {
    if (!this.config) return;
    const t = [...this.config[e] ?? (this.config.entities ?? []).map((a) => ({ entity: a }))];
    t.push({ entity: "" }), this.updateItems(e, t);
  }
  removeItem(e, t) {
    if (!this.config) return;
    const a = [...this.config[e] ?? (this.config.entities ?? []).map((r) => ({ entity: r }))].filter((r, o) => o !== t);
    this.updateItems(e, a);
  }
  updateItems(e, t) {
    if (!this.config) return;
    const a = { ...this.config, [e]: t, entities: void 0 };
    this.config = a, ne(this, "config-changed", { config: a });
  }
  updateWasteStream(e, t, a) {
    if (!this.config) return;
    const r = J(this.config);
    r[e] = {
      ...r[e],
      [t]: t === "enabled" ? a !== !1 : a || void 0
    }, this.updateWasteStreams(r);
  }
  removeWasteStream(e) {
    this.config && this.updateWasteStreams(J(this.config).filter((t, a) => a !== e));
  }
  moveWasteStream(e, t) {
    if (!this.config) return;
    const a = J(this.config), r = e + t;
    r < 0 || r >= a.length || ([a[e], a[r]] = [a[r], a[e]], this.updateWasteStreams(a));
  }
  updateWasteStreams(e) {
    if (!this.config) return;
    const t = { ...this.config, waste_streams: e };
    this.config = t, ne(this, "config-changed", { config: t });
  }
};
ge.styles = xt`
    :host { display: block; }
    .item-editor { margin-top: 16px; }
    .item-editor h3 { margin: 0 0 8px; font-size: 15px; }
    .item-editor p { margin: 0 0 12px; color: var(--secondary-text-color); font-size: 12px; }
    .item-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 10px; padding: 12px; border: 1px solid var(--divider-color); border-radius: 12px; }
    .item-row ha-selector, .item-row ha-textfield { min-width: 0; }
    .item-row .wide { grid-column: 1 / -1; }
    .item-row h4 { grid-column: 1 / -1; margin: 0; font-size: 13px; }
    .field { display: grid; gap: 5px; }
    .field > span { color: var(--secondary-text-color); font-size: 11px; }
    .item-actions { display: flex; justify-content: flex-end; gap: 8px; }
    button { border: 0; border-radius: 10px; padding: 8px 12px; background: var(--secondary-background-color); color: var(--primary-text-color); cursor: pointer; }
    button.add { background: var(--primary-color); color: var(--text-primary-color, #fff); }
  `;
He([
  Ae({ attribute: !1 })
], ge.prototype, "hass", 2);
He([
  ma()
], ge.prototype, "config", 2);
ge = He([
  da("mushroom-addition-editor")
], ge);
const Ka = xt`
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
  .minimalist-card {
    display: block;
    overflow: hidden;
    border: 0;
    border-radius: var(--mush-card-primary-border-radius, 14px);
    background: var(--ha-card-background, var(--card-background-color, #fff));
    box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,.08));
  }
  .minimalist-card:has(.fill-container), .fill-container { height: 100%; }
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
    width: 42px;
    height: 42px;
    border-radius: 50%;
    color: rgb(var(--tone, var(--ulm-blue)));
    background: rgba(var(--tone, var(--ulm-blue)), .16);
    flex: 0 0 auto;
  }
  .ulm-icon ha-icon { --mdc-icon-size: 21px; }
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
  .ulm-weather { padding: 12px; }
  .detailed-weather { overflow: hidden; padding: 16px 22px; border-radius: 20px; background: #4aa8e8; color: #fff; }
  .detailed-weather-main { display: grid; min-height: 54px; grid-template-columns: 1fr auto; align-items: center; gap: 18px; text-align: left; }
  .detailed-weather-current { display: flex; align-items: center; gap: 14px; }
  .detailed-weather-current > .detailed-weather-icon { --mdc-icon-size: 36px; }
  .detailed-weather-current span, .detailed-weather-details { display: flex; flex-direction: column; gap: 3px; }
  .detailed-weather-current b, .detailed-weather-details b { font-size: 16px; }
  .detailed-weather-current small, .detailed-weather-details span { font-size: 14px; font-weight: 700; text-transform: capitalize; }
  .detailed-weather-details { align-items: flex-end; }
  .detailed-weather-details span { flex-direction: row; align-items: center; gap: 5px; }
  .detailed-weather-details ha-icon { --mdc-icon-size: 18px; }
  .ulm-weather.has-backdrop {
    background: linear-gradient(135deg, rgba(var(--ulm-blue), .15), rgba(var(--ulm-yellow), .12));
  }
  .weather-main { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 14px; }
  .weather-icon { width: 56px; height: 56px; }
  .weather-icon ha-icon { --mdc-icon-size: 30px; }
  .weather-summary { display: grid; grid-template-columns: auto 1fr; align-items: baseline; column-gap: 10px; }
  .weather-temp { grid-row: 1 / 3; font-size: 30px; font-weight: 300; letter-spacing: -1px; }
  .weather-condition { margin-top: 2px; }
  .weather-extrema { color: var(--secondary-text-color); font-size: 11px; }
  .weather-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
  .weather-metrics .metric-pill { justify-content: center; }
  .weather-forecast { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 10px; }
  .weather-forecast span { display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 12px; }
  .weather-forecast ha-icon { --mdc-icon-size: 17px; color: rgb(var(--ulm-blue)); }
  .ulm-light-card { display: grid; gap: 12px; padding: 12px; }
  .ulm-light-card.is-horizontal { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; }
  .ulm-light-card.is-horizontal-wide { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); }
  .ulm-light-card.is-horizontal .brightness-presets { display: none; }
  .light-header { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 12px; min-height: 42px; border-radius: 14px; }
  .light-header.is-active .light-icon {
    background: rgba(var(--light-rgb), .2);
    color: rgb(var(--light-rgb));
  }
  .light-header:not(.is-active) .light-icon {
    background: rgba(var(--ulm-grey), .06);
    color: rgba(var(--ulm-grey), .35);
  }
  .ulm-light-slider {
    position: relative;
    height: 42px;
    overflow: hidden;
    border-radius: 14px;
    background: rgba(var(--light-rgb), .2);
  }
  .ulm-light-slider i {
    position: absolute;
    inset: 0 auto 0 0;
    width: var(--light-level);
    border-radius: inherit;
    background: rgb(var(--light-rgb));
    pointer-events: none;
  }
  .ulm-light-slider input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    cursor: pointer;
    opacity: 0;
  }
  .ulm-light-card.is-collapsed .ulm-light-slider,
  .ulm-light-card.is-collapsed .brightness-presets { display: none; }
  .brightness-presets { justify-content: center; }
  .ulm-climate { padding-bottom: 12px; }
  .climate-top { padding-bottom: 8px; }
  .climate-target { color: rgb(var(--ulm-red)); font-size: 23px; font-weight: 600; }
  .climate-current { font-size: 18px; font-weight: 700; }
  .ulm-climate > .metric-pill { margin-left: 66px; }
  .ulm-climate > .ulm-controls { float: right; margin: -36px 12px 0 0; }
  .ulm-source-thermostat { display: grid; gap: 12px; padding: 12px; }
  .ulm-source-thermostat .climate-top { min-height: 42px; padding: 0; }
  .ulm-source-thermostat.hvac-heating { background: rgba(255,165,0,.75); }
  .ulm-source-thermostat.hvac-cooling { background: rgba(0,191,255,.75); }
  .ulm-source-thermostat.is-horizontal { grid-template-columns: 1fr 1fr; align-items: center; }
  .thermostat-controls { display: grid; gap: 8px; }
  .thermostat-adjustment { display: grid; grid-template-columns: 34px 1fr 34px; align-items: center; gap: 7px; }
  .ulm-source-thermostat .thermostat-adjustment { grid-template-columns: repeat(3, 1fr); }
  .ulm-source-thermostat .thermostat-adjustment .ulm-control { width: 100%; height: 42px; border-radius: 12px; }
  .thermostat-adjustment b { text-align: center; }
  .thermostat-modes { display: grid; grid-template-columns: repeat(auto-fit, minmax(34px, 1fr)); gap: 7px; }
  .thermostat-mode { width: 100%; }
  .thermostat-mode.is-active { color: rgb(var(--tone)); background: rgba(var(--tone), .25); }
  .thermostat-mode.tone-green { --tone: var(--ulm-green); }
  .thermostat-mode.tone-red { --tone: var(--ulm-red); }
  .thermostat-mode.tone-blue { --tone: var(--ulm-blue); }
  .thermostat-mode.tone-yellow { --tone: var(--ulm-yellow); }
  .thermostat-mode.tone-purple { --tone: var(--ulm-purple); }
  .ulm-person .person-picture {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
  }
  .person-icon-wrap { position: relative; display: block; width: 42px; height: 42px; }
  .person-icon-wrap > .ulm-icon, .person-icon-wrap > .person-picture { width: 42px; height: 42px; }
  .person-location-badge {
    position: absolute;
    top: -4px;
    left: 34px;
    display: grid;
    width: 16px;
    height: 16px;
    place-items: center;
    border: 2px solid var(--card-background-color, #fff);
    border-radius: 50%;
    color: var(--primary-background-color, #fff);
  }
  .person-location-badge.home { background: rgb(var(--ulm-blue)); }
  .person-location-badge.away { background: rgb(var(--ulm-green)); }
  .person-location-badge ha-icon { width: 10px; height: 10px; --mdc-icon-size: 10px; }
  .person-battery-ring { width: 42px; height: 42px; overflow: visible; }
  .person-battery-ring circle { fill: none; stroke: rgba(var(--ulm-grey), .15); stroke-width: 3; }
  .person-battery-ring circle.value {
    stroke: rgb(var(--ulm-green));
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
  }
  .person-battery-ring text { fill: var(--primary-text-color); font-size: 14px; font-weight: 700; text-anchor: middle; }
  .person-battery-ring tspan { font-size: 8px; }
  .ulm-source-person { min-height: 96px; padding: 16px; gap: 18px; }
  .ulm-source-person .person-icon-wrap,
  .ulm-source-person .person-icon-wrap > .ulm-icon,
  .ulm-source-person .person-icon-wrap > .person-picture { width: 64px; height: 64px; }
  .ulm-source-person .ulm-icon ha-icon { --mdc-icon-size: 32px; }
  .ulm-source-person .person-location-badge { top: -4px; left: 52px; }
  .ulm-source-person .ulm-name { font-size: 20px; }
  .ulm-source-person .ulm-label { font-size: 16px; font-weight: 600; }
  .presence-dot { width: 12px; height: 12px; border: 3px solid var(--card-background-color); border-radius: 50%; }
  .presence-dot.home { background: rgb(var(--ulm-blue)); }
  .presence-dot.away { background: rgb(var(--ulm-green)); }
  .ulm-person.is-compact { min-height: 52px; padding-top: 7px; padding-bottom: 7px; }
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
  .minimalist-bar-card {
    display: grid;
    min-height: 96px;
    grid-template-rows: minmax(60px, 1fr) 35px;
    overflow: hidden;
    border-radius: 20px;
    background: var(--ha-card-background, var(--card-background-color, #fff));
  }
  .minimalist-bar-card.bar-only {
    min-height: 35px;
    grid-template-rows: 35px;
  }
  .bar-card-header {
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
  }
  .bar-card-icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    color: var(--bar-icon-color);
    background: color-mix(in srgb, var(--bar-icon-color) 12%, transparent);
  }
  .bar-card-icon ha-icon { --mdc-icon-size: 21px; }
  .bar-card-copy { display: flex; min-width: 0; flex-direction: column; line-height: 1.15; }
  .bar-card-primary-value {
    overflow: hidden;
    color: var(--primary-text-color);
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bar-card-name {
    overflow: hidden;
    margin-top: 2px;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bar-card-track {
    position: relative;
    height: 35px;
    overflow: hidden;
    background: color-mix(in srgb, var(--bar-fill) 16%, var(--ha-card-background, #202124));
  }
  .bar-card-fill {
    position: absolute;
    inset: 0 auto 0 0;
    background: var(--bar-fill);
  }
  .bar-card-inside-value {
    position: absolute;
    top: 50%;
    right: 8px;
    z-index: 1;
    color: var(--primary-text-color);
    font-size: 12px;
    transform: translateY(-50%);
  }
  .bar-card-indicator {
    position: absolute;
    top: 50%;
    z-index: 2;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 6px solid var(--primary-text-color);
    transform: translate(-1px, -50%);
  }
  .ulm-metric { padding: 0 12px 12px; }
  .metric-heading { padding-left: 0; padding-right: 0; }
  .metric-value { color: rgb(var(--ulm-blue)); font-size: 20px; font-weight: 650; }
  .sparkline { width: 100%; height: 48px; overflow: visible; }
  .sparkline polyline { fill: none; stroke: rgb(var(--ulm-blue)); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
  .sparkline.is-filled polyline { stroke: rgb(var(--ulm-red)); }
  .sparkline.is-filled polygon { fill: rgba(var(--ulm-red), .18); }
  .ulm-default-graph { padding: 0 12px 8px; }
  .ulm-default-graph .metric-heading { padding-right: 0; padding-left: 0; }
  .metric-extremes { display: flex; justify-content: space-between; color: var(--secondary-text-color); font-size: 11px; }
  .ulm-scenes { padding: 12px; }
  .scene-grid { display: flex; flex-wrap: wrap; gap: 10px; }
  .scene-button { display: flex; width: 64px; min-width: 64px; min-height: 88px; flex-direction: column; align-items: center; justify-content: space-between; gap: 5px; padding: 7px 5px 10px; border-radius: 32px; background: var(--ha-card-background, #fff); box-shadow: 0 2px 6px rgba(0,0,0,.12); }
  .scene-button span { width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }
  .scene-button i { display: grid; width: 46px; height: 46px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-purple), .14); font-style: normal; }
  .scene-button i { background: color-mix(in srgb, var(--item-color) 16%, transparent); }
  .scene-button ha-icon { --mdc-icon-size: 22px; color: var(--item-color); }
  .scene-button.is-active { background: color-mix(in srgb, var(--item-color) 12%, var(--ha-card-background, #fff)); }
  .ulm-source-scenes .scene-grid { flex-wrap: nowrap; justify-content: space-evenly; }
  .ulm-source-scenes .scene-button { width: 52px; min-width: 52px; min-height: 84px; padding: 5px 5px 7px; border-radius: 50px; }
  .ulm-source-scenes .scene-button i { width: 42px; height: 42px; }
  .ulm-source-scenes .scene-button span { font-size: 9.5px; font-weight: 700; }
  .welcome-scenes { padding: 10px; }
  .welcome-toolbar { display: grid; grid-template-columns: 42px 1fr 42px; align-items: center; gap: 10px; padding: 4px; margin-bottom: 8px; }
  .welcome-toolbar-button, .welcome-date { display: inline-flex; min-height: 42px; align-items: center; justify-content: center; border: 0; border-radius: 22px; background: var(--ha-card-background, #fff); color: var(--primary-text-color); box-shadow: 0 2px 6px rgba(0,0,0,.12); }
  .welcome-date { justify-self: center; gap: 6px; padding: 0 14px; font-weight: 700; }
  .welcome-heading { margin: 0 16px 14px; }
  .welcome-heading b { max-width: 260px; font-size: 24px; line-height: 1.15; }
  .welcome-scenes-heading { display: flex; align-items: center; justify-content: space-between; margin: 0 16px 10px; font-size: 18px; }
  .welcome-scenes-heading ha-icon { --mdc-icon-size: 20px; opacity: .5; }
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
  .ulm-vacuum, .ulm-security { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; }
  .ulm-vacuum .ulm-controls { grid-column: 1 / -1; justify-content: center; }
  .ulm-default-vacuum { display: grid; gap: 12px; padding: 12px; }
  .vacuum-summary { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 12px; }
  .vacuum-map { display: block; width: 100%; max-height: 220px; border-radius: 20px; object-fit: cover; }
  .vacuum-actions { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .vacuum-actions .ulm-control { width: 100%; background: rgba(var(--ulm-grey), .08); }
  .ulm-default-vacuum.force-background { background: rgba(var(--ulm-blue), .14); }
  .security-status { padding: 5px 9px; border-radius: 10px; background: rgba(var(--ulm-green), .12); color: rgb(var(--ulm-green)); font-size: 11px; font-weight: 700; }
  .ulm-navigation { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; }
  .ulm-cover { display: grid; gap: 8px; padding: 0 12px 12px; }
  .ulm-cover > .ulm-row { padding-right: 0; padding-left: 0; }
  .cover-controls { display: grid; grid-template-columns: repeat(3, 1fr); }
  .cover-controls:has(.ulm-control:nth-child(4)) { grid-template-columns: repeat(4, 1fr); }
  .cover-controls .ulm-control { width: 100%; height: 32px; border-radius: 12px; }
  .ulm-cover-slider { position: relative; height: 42px; overflow: hidden; border-radius: 14px; background: rgba(var(--ulm-grey), .12); }
  .ulm-cover-slider i { position: absolute; inset: 0 auto 0 0; width: var(--cover-level); background: rgba(var(--ulm-blue), .8); }
  .ulm-cover-slider input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; }
  .ulm-cover.is-horizontal { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; }
  .ulm-fan { display: grid; gap: 10px; padding: 0 12px 12px; }
  .ulm-fan > .ulm-row { padding-left: 0; padding-right: 0; }
  .ulm-fan.is-horizontal { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; }
  .ulm-fan-controls { display: grid; grid-template-columns: minmax(0, 2fr) auto; align-items: center; gap: 8px; }
  .ulm-fan-controls > .ulm-controls:empty { display: none; }
  .ulm-fan-slider { position: relative; height: 42px; overflow: hidden; border-radius: 14px; background: rgba(var(--ulm-grey), .14); }
  .ulm-fan-slider i { position: absolute; inset: 0 auto 0 0; width: var(--fan-level); background: var(--source-color); }
  .ulm-fan-slider input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; }
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
  .room-sensor ha-icon { color: var(--item-color); }
  .room-sensor.is-active { background: color-mix(in srgb, var(--item-color) 18%, transparent); }
  .room-sensor span { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
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
  .ulm-camera { display: grid; min-height: 150px; overflow: hidden; background: rgba(var(--ulm-grey), .08); }
  .ulm-camera.has-title { gap: 12px; padding: 12px; }
  .camera-title { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 12px; }
  .ulm-camera img { display: block; width: 100%; height: 180px; border-radius: inherit; object-fit: cover; }
  .ulm-camera.has-title img { border-radius: 14px; }
  .camera-placeholder { display: grid; min-height: 150px; place-items: center; }
  .ulm-generic-swap { grid-template-columns: minmax(0, 1fr) auto; }
  .ulm-generic.force-background, .ulm-generic-swap.force-background {
    background: rgba(var(--ulm-blue), .16);
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
  .ulm-gauge-card { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 12px; padding: 12px; }
  .gauge-ring { position: relative; display: grid; width: 64px; height: 64px; place-items: center; border-radius: 50%; background: conic-gradient(rgb(var(--ulm-blue)) var(--gauge), rgba(var(--ulm-grey), .12) 0); }
  .gauge-ring::before { content: ""; position: absolute; width: 48px; height: 48px; border-radius: 50%; background: var(--card-background-color); }
  .gauge-ring b { position: relative; z-index: 1; font-size: 11px; }
  .ulm-title { display: flex; align-items: center; gap: 10px; margin: 6px 0 0 18px; padding: 6px; box-shadow: none; background: transparent; }
  .ulm-title .ulm-name { font-size: 1.5rem; font-weight: 700; }
  .ulm-title .ulm-label { font-size: 1rem; font-weight: 700; opacity: .4; }
  .ulm-title.variant-divider-title { padding-bottom: 10px; border-bottom: 2px solid var(--divider-color); }
  .ulm-title.variant-divider-subtitle { padding-bottom: 7px; border-bottom: 1px solid var(--divider-color); }
  .ulm-title.variant-divider-subtitle .ulm-name { color: var(--secondary-text-color); font-size: 14px; }
  .ulm-vertical-button { min-height: 82px; padding: 10px 0 8px; text-align: center; }
  .vertical-button-control { display: grid; width: 100%; place-items: center; gap: 0; border: 0; background: transparent; color: inherit; font: inherit; cursor: pointer; }
  .vertical-button-control .ulm-icon { width: 42px; height: 42px; }
  .vertical-button-control .ulm-icon ha-icon { --mdc-icon-size: 20px; }
  .vertical-button-control .ulm-name { margin-top: 10px; font-size: 14px; font-weight: 700; }
  .vertical-button-control .ulm-label { align-self: start; justify-self: center; font-size: 12px; font-weight: 800; opacity: .4; }
  .ulm-binary.is-alert { background: rgba(var(--ulm-red), .1); }
  .ulm-simple-default { grid-template-columns: auto minmax(0, 1fr); }
  .ulm-default-navigation {
    display: inline-grid;
    min-height: 66px;
    grid-template-columns: auto auto;
    align-items: center;
    gap: 12px;
    padding: 12px;
  }
  .navigation-label { font-size: 14px; font-weight: 600; white-space: nowrap; }
  .source-icon-wrap { position: relative; display: inline-grid; }
  .binary-alert-badge { position: absolute; right: -3px; bottom: -3px; --mdc-icon-size: 16px; color: rgb(var(--ulm-red)); }
  .ulm-power-outlet .power-outlet-icon { color: rgba(var(--ulm-grey), .25); background: rgba(var(--ulm-grey), .05); }
  .ulm-source-power-outlet { min-height: 96px; padding: 16px; gap: 18px; }
  .ulm-source-power-outlet .power-outlet-icon { width: 64px; height: 64px; }
  .ulm-source-power-outlet .power-outlet-icon ha-icon { --mdc-icon-size: 32px; }
  .ulm-source-power-outlet .ulm-name { font-size: 20px; }
  .ulm-source-power-outlet .ulm-label { font-size: 16px; font-weight: 600; }
  .ulm-power-outlet.is-active .power-outlet-icon { color: var(--outlet-color); background: color-mix(in srgb, var(--outlet-color) 20%, transparent); }
  .ulm-power-outlet.force-background { background: color-mix(in srgb, var(--outlet-color) 20%, transparent); }
  .ulm-script { grid-template-columns: min-content min-content; justify-content: start; }
  .ulm-source-script { min-height: 96px; padding: 16px; gap: 18px; }
  .ulm-source-script .ulm-icon { width: 64px; height: 64px; }
  .ulm-source-script .ulm-icon ha-icon { --mdc-icon-size: 32px; }
  .script-title { font-size: 14px; font-weight: 600; white-space: nowrap; }
  .ulm-source-script .script-title { font-size: 20px; }
  .custom-card-heading {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
  }
  .custom-waste-card, .custom-alarm-time, .custom-washer,
  .custom-compact-thermostat, .custom-input-datetime {
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
  .alarm-time-controls, .compact-thermostat-controls {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: center;
    gap: 10px;
  }
  .alarm-time-controls .ulm-control, .compact-thermostat-controls .ulm-control {
    width: 100%;
    height: 56px;
    border-radius: 18px;
  }
  .alarm-time-controls > b, .compact-thermostat-controls > b { text-align: center; font-size: 18px; }
  .custom-alarm-time.is-horizontal { grid-template-columns: minmax(0, 1fr) minmax(180px, 1fr); align-items: center; }
  .custom-apexcharts {
    display: grid;
    min-height: 300px;
    grid-template-columns: minmax(180px, .85fr) minmax(0, 1.65fr);
    align-items: stretch;
    gap: 14px;
    padding: 12px;
  }
  .apex-legend { display: grid; align-content: space-around; gap: 6px; }
  .apex-series { display: grid; grid-template-columns: 56px 1fr; align-items: center; column-gap: 12px; }
  .apex-series i { display: grid; width: 56px; height: 56px; grid-row: 1 / 3; place-items: center; border-radius: 50%; background: rgba(var(--tone), .18); color: rgb(var(--tone)); }
  .apex-series i ha-icon { --mdc-icon-size: 25px; }
  .apex-series b, .apex-series small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .apex-series b { font-size: 13px; }
  .apex-series small { color: var(--secondary-text-color); font-size: 12px; font-weight: 700; }
  .apex-chart { position: relative; display: flex; min-width: 0; align-items: center; overflow: hidden; }
  .apex-line { position: absolute; inset: 12px 0; z-index: 2; color: rgb(var(--tone)); }
  .apex-chart .sparkline { width: 100%; height: 240px; }
  .apex-line .sparkline polyline { stroke: currentColor; stroke-width: 1.8; }
  .apex-grid-line { position: absolute; right: 0; left: 0; border-top: 1px dashed rgba(var(--ulm-grey), .18); }
  .apex-grid-line.line-1 { top: 25%; }
  .apex-grid-line.line-2 { top: 50%; }
  .apex-grid-line.line-3 { top: 75%; }
  .custom-chromecast { display: grid; gap: 16px; padding: 12px; }
  .chromecast-controls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .chromecast-controls .ulm-control { width: 100%; height: 48px; border-radius: 16px; }
  .custom-power-details { position: relative; overflow: hidden; padding: 12px; }
  .power-details-content { position: relative; }
  .power-details-heading { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 10px; }
  .power-details-value { position: relative; z-index: 2; display: block; margin-top: 18px; text-align: center; font-size: 28px; }
  .power-details-chart { position: absolute; right: 0; bottom: -2px; left: 0; }
  .power-details-chart .sparkline { height: 100%; }
  .power-details-chart .sparkline polygon { fill: color-mix(in srgb, rgb(var(--ulm-yellow)) 22%, transparent); }
  .power-details-chart .sparkline polyline { stroke: rgb(var(--ulm-yellow)); }
  .custom-device-tracker {
    display: grid;
    min-height: 64px;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 24px;
    background: #1f1f1f;
    color: #fff;
  }
  .custom-device-tracker .ulm-label { color: rgba(255,255,255,.55); }
  .device-tracker-icon { position: relative; display: grid; width: 42px; height: 42px; place-items: center; border-radius: 50%; background: rgba(255,255,255,.06); color: #70d67a; }
  .tracker-badge { position: absolute; display: grid; width: 18px; height: 18px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; color: var(--primary-background-color, #fff); }
  .tracker-badge.is-home { background: rgb(var(--ulm-blue)); }
  .tracker-badge.is-away { background: rgb(var(--ulm-green)); }
  .tracker-badge ha-icon { --mdc-icon-size: 11px; }
  .tracker-one { top: -3px; right: -6px; }
  .tracker-two { right: -6px; bottom: -3px; }
  .custom-room-view { display: grid; min-height: 150px; gap: 8px; padding: 12px; }
  .room-view-summary { display: flex; align-items: center; gap: 10px; }
  .room-view-summary > span:last-child { display: flex; flex-direction: column; gap: 6px; color: var(--secondary-text-color); }
  .room-view-summary b, .room-view-summary small { display: flex; align-items: center; gap: 3px; }
  .room-view-icon { position: relative; display: grid; width: 44px; height: 44px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-grey), .1); color: rgba(var(--ulm-grey), .45); }
  .room-view-icon i, .room-view-status i, .room-view-actions i { position: absolute; display: grid; min-width: 16px; height: 16px; place-items: center; border-radius: 9px; background: rgb(var(--ulm-blue)); color: #fff; font-size: 10px; font-style: normal; }
  .room-view-icon i { top: -3px; right: -3px; background: rgb(var(--ulm-red)); }
  .room-view-status { display: flex; min-height: 28px; align-items: center; justify-content: center; gap: 2px; }
  .room-view-status button, .room-view-clear { position: relative; display: grid; width: 35px; height: 28px; padding: 0; place-items: center; border: 0; background: transparent; color: rgba(var(--ulm-grey), .7); }
  .room-view-status button ha-icon { --mdc-icon-size: 20px; }
  .room-view-actions { display: flex; gap: 7px; }
  .room-view-actions button { position: relative; display: grid; min-width: 40px; height: 44px; flex: 1; padding: 0; place-items: center; border: 0; border-radius: 14px; background: rgba(var(--ulm-grey), .08); color: rgba(var(--ulm-grey), .7); }
  .room-view-actions button.is-active { background: rgba(var(--ulm-yellow), .25); color: rgb(var(--ulm-yellow)); }
  .room-view-actions button:disabled { opacity: .45; }
  .room-view-actions i { top: 5px; right: 30%; }
  .custom-elapsed-time { display: grid; min-height: 72px; grid-template-columns: auto 1fr; align-items: center; gap: 16px; padding: 12px 20px; border-radius: 28px; }
  .custom-elapsed-time .ulm-icon { width: 56px; height: 56px; }
  .custom-elapsed-time .ulm-name { font-size: 19px; }
  .custom-elapsed-time .ulm-label { font-size: 17px; font-weight: 700; }
  .custom-eray-lock { min-height: 66px; padding: 10px 14px; border-radius: 24px; }
  .eray-lock-control { display: grid; width: 100%; grid-template-columns: auto 1fr; align-items: center; gap: 14px; padding: 0; border: 0; background: transparent; color: inherit; text-align: left; }
  .eray-lock-icon { position: relative; display: grid; width: 44px; height: 44px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-green), .18); color: rgb(var(--ulm-green)); }
  .custom-eray-lock.is-unlocked .eray-lock-icon { background: rgba(var(--ulm-yellow), .22); color: rgb(var(--ulm-yellow)); }
  .door-badge, .battery-badge { position: absolute; display: grid; width: 19px; height: 19px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; background: rgb(var(--ulm-red)); color: #fff; }
  .door-badge { top: -4px; right: -5px; }
  .battery-badge { top: -4px; left: -5px; background: rgb(var(--ulm-yellow)); color: #222; }
  .battery-badge.is-critical { background: rgb(var(--ulm-red)); color: #fff; }
  .door-badge ha-icon, .battery-badge ha-icon { --mdc-icon-size: 11px; }
  .custom-esh-welcome { display: grid; gap: 18px; padding: 14px; }
  .esh-welcome-toolbar { display: flex; justify-content: space-between; }
  .esh-welcome-toolbar button { display: grid; width: 38px; height: 38px; padding: 0; place-items: center; border: 0; border-radius: 50%; background: var(--card-background-color); color: inherit; box-shadow: 0 2px 7px rgba(0,0,0,.12); }
  .esh-welcome-toolbar button:disabled { visibility: hidden; }
  .esh-greeting { font-size: 23px; line-height: 1.08; }
  .esh-welcome-items { display: flex; gap: 8px; overflow: hidden; }
  .esh-welcome-items > button { display: flex; min-width: 52px; flex: 1; flex-direction: column; align-items: center; gap: 6px; padding: 7px 4px 10px; border: 0; border-radius: 25px; background: var(--card-background-color); color: inherit; box-shadow: 0 2px 7px rgba(0,0,0,.12); }
  .esh-welcome-items i { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 50%; background: rgba(var(--tone), .18); color: rgb(var(--tone)); font-style: normal; }
  .esh-welcome-items small { max-width: 48px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 700; }
  .custom-esh-room { display: grid; min-height: 112px; grid-template-columns: minmax(0, 1fr) 42px; gap: 12px; padding: 12px; border-radius: 20px; }
  .esh-room-main { display: grid; min-width: 0; grid-template-rows: auto auto; align-content: space-between; gap: 8px; }
  .esh-room-main .ulm-icon { justify-self: start; }
  .esh-room-main .ulm-copy { min-width: 0; }
  .custom-esh-room.light-on { background: rgba(var(--ulm-yellow), .12); }
  .custom-esh-room.dynamic-color { background: rgba(var(--room-rgb, 255,152,0), .2); }
  .custom-esh-room.dynamic-color .ulm-icon { background: rgba(var(--room-rgb), .3); color: rgb(var(--room-rgb)); }
  .esh-room-controls { display: flex; flex-direction: column; gap: 5px; }
  .esh-room-control { display: grid; width: 42px; height: 42px; padding: 0; place-items: center; border: 0; border-radius: 14px; background: rgba(var(--ulm-grey), .08); color: rgba(var(--ulm-grey), .75); }
  .esh-room-control.light.state-on { background: rgba(var(--ulm-yellow), .2); color: rgb(var(--ulm-yellow)); }
  .esh-room-control.climate.state-heat { background: rgba(var(--ulm-red), .2); color: rgb(var(--ulm-red)); }
  .esh-room-control.climate.state-cool, .esh-room-control.cover.state-closed { background: rgba(var(--ulm-blue), .2); color: rgb(var(--ulm-blue)); }
  .washer-heading .washer-power { font-size: 12px; font-weight: 700; }
  .washer-stages { display: grid; grid-template-columns: repeat(var(--washer-stage-count, 4), 1fr); border-radius: 22px; background: rgba(var(--ulm-grey), .08); }
  .washer-stages span { display: grid; height: 42px; place-items: center; color: rgba(var(--ulm-grey), .35); }
  .washer-stages span.is-active { color: var(--primary-text-color); }
  .washer-stages span.is-active ha-icon { padding: 9px; border-radius: 50%; background: var(--card-background-color); }
  .washer-controls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .washer-controls .ulm-control { width: 100%; height: 42px; border-radius: 16px; }
  .washer-remote { color: var(--secondary-text-color); font-size: 11px; text-align: center; }
  .custom-heat-pump { display: grid; gap: 12px; padding: 12px; }
  .heat-pump-header { display: grid; grid-template-columns: 42px minmax(0, 1fr); align-items: center; gap: 12px; }
  .heat-pump-icon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 50%; background: rgba(var(--tone), .2); color: rgb(var(--tone)); }
  .heat-pump-icon ha-icon { --mdc-icon-size: 22px; }
  .heat-pump-target { display: grid; grid-template-columns: minmax(0, 1fr) minmax(74px, auto) minmax(0, 1fr); align-items: center; gap: 10px; }
  .heat-pump-target .ulm-control { width: 100%; height: 44px; border-radius: 14px; background: rgba(var(--ulm-grey), .07); }
  .heat-pump-target .ulm-control ha-icon { --mdc-icon-size: 22px; }
  .heat-pump-target > b { text-align: center; font-size: 16px; font-weight: 500; }
  .heat-pump-modes { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; }
  .heat-pump-modes button { display: grid; min-width: 0; height: 42px; place-items: center; border: 0; border-radius: 14px; background: rgba(var(--ulm-grey), .07); color: rgba(var(--ulm-grey), .9); cursor: pointer; }
  .heat-pump-modes button ha-icon { --mdc-icon-size: 22px; }
  .heat-pump-modes button.is-active { background: rgba(var(--tone), .2); color: rgb(var(--tone)); }
  .heat-pump-modes button:disabled { cursor: not-allowed; opacity: .28; }
  .custom-ha-updates { display: grid; gap: 18px; padding: 18px; }
  .ha-updates-summary { display: grid; grid-template-columns: 56px minmax(0, 1fr); align-items: center; gap: 18px; }
  .ha-updates-icon { position: relative; display: grid; width: 56px; height: 56px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-grey), .08); color: rgba(var(--ulm-grey), .25); }
  .ha-updates-icon.has-update { background: rgba(var(--ulm-blue), .2); color: rgb(var(--ulm-blue)); }
  .ha-updates-icon > ha-icon { --mdc-icon-size: 28px; }
  .ha-updates-badge { position: absolute; top: -2px; right: -5px; display: grid; width: 20px; height: 20px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; background: rgb(var(--ulm-blue)); color: #fff; }
  .ha-updates-badge ha-icon { --mdc-icon-size: 12px; }
  .ha-updates-summary .ulm-name { font-size: 18px; font-weight: 700; }
  .ha-update-list { display: grid; gap: 1px; color: rgba(var(--ulm-grey), .55); font-size: 15px; font-weight: 700; }
  .ha-update-list span { display: block; }
  .ha-update-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .ha-update-actions button { display: grid; height: 55px; place-items: center; border: 0; border-radius: 18px; background: rgba(var(--ulm-grey), .07); color: rgba(var(--ulm-grey), .8); cursor: pointer; }
  .ha-update-actions button ha-icon { --mdc-icon-size: 24px; }
  .ha-update-actions button:disabled { cursor: not-allowed; opacity: .28; }
  .custom-sun-card { display: grid; min-height: 210px; gap: 8px; padding: 18px; }
  .sun-times, .sun-footer { display: flex; justify-content: space-between; }
  .sun-times span, .sun-footer span { display: flex; flex-direction: column; gap: 3px; }
  .sun-times span:last-child, .sun-footer span:last-child { align-items: flex-end; }
  .sun-times small, .sun-footer small { color: var(--secondary-text-color); }
  .sun-times b { font-size: 21px; font-weight: 500; }
  .sun-footer b { font-size: 13px; }
  .sun-arc svg { width: 100%; height: 90px; overflow: visible; }
  .sun-arc line { stroke: rgba(var(--ulm-grey), .18); }
  .sun-arc .sun-day { fill: rgba(var(--ulm-blue), .48); stroke: none; }
  .sun-arc .sun-night { fill: #343579; stroke: none; }
  .sun-arc circle { fill: #ffd45c; }
  .custom-compact-thermostat.is-heating { background: #ff8100; }
  .custom-compact-thermostat.is-heating .ulm-label { color: rgba(255,255,255,.78); }
  .custom-battery-chip { display: grid; width: 42px; min-height: 42px; place-items: center; margin: 8px; border-radius: 21px; background: rgba(var(--tone), .18); color: rgb(var(--tone)); }
  .custom-media-library { position: relative; min-height: 170px; overflow: hidden; background: #222; color: #fff; }
  .media-library-art { position: absolute; inset: 0; display: grid; place-items: center; background-position: center; background-size: cover; color: rgba(255,255,255,.7); }
  .media-library-art::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,.88)); }
  .media-library-overlay { position: absolute; right: 12px; bottom: 12px; left: 12px; z-index: 1; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 10px; }
  .custom-media-library .ulm-label { color: rgba(255,255,255,.72); }
  .media-platform { display: grid; width: 36px; height: 36px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-purple), .75); color: #fff; }
  .custom-imswel-person { display: grid; padding: 12px; }
  .imswel-person-main { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; }
  .imswel-person-main .person-picture { width: 42px; height: 42px; border-radius: 50%; background-position: center; background-size: cover; }
  .imswel-location { display: grid; width: 16px; height: 16px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; color: #fff; }
  .imswel-location ha-icon { --mdc-icon-size: 10px; }
  .imswel-location.is-home { background: rgb(var(--ulm-blue)); }
  .imswel-location.is-away { background: rgb(var(--ulm-green)); }
  .imswel-location.is-unavailable { background: rgb(var(--ulm-red)); }
  .input-datetime-controls { display: grid; grid-template-columns: repeat(3, 1fr); align-items: center; gap: 7px; }
  .input-datetime-controls .ulm-control { width: 100%; height: 42px; border-radius: 14px; }
  .input-datetime-controls .hold-control { font-size: 16px; font-weight: 700; }
  .custom-input-number, .custom-sonos, .custom-mpse-printer, .custom-neekster-update,
  .custom-irmajavi-entities, .custom-irmajavi-weather, .custom-irmajavi-speedtest,
  .custom-light-colorpick, .custom-nik-nas, .custom-nik-tablet { display: grid; gap: 10px; padding: 12px; }
  .input-number-controls, .sonos-controls, .nik-door-controls, .update-controls {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: center; gap: 7px;
  }
  .input-number-controls button, .sonos-controls button, .nik-door-controls button, .update-controls button {
    min-height: 42px; border: 0; border-radius: 13px; background: rgba(var(--ulm-grey), .08); color: var(--primary-text-color);
  }
  .input-number-value { font-size: 16px; }
  .input-number-value:disabled, .speedtest-action:disabled, .irmajavi-four button:disabled { cursor: not-allowed; opacity: .45; }
  .speedtest-router, .nik-nas-header {
    display: flex; min-width: 0; align-items: center; gap: 10px;
  }
  .custom-irmajavi-entities, .custom-irmajavi-weather { min-height: 160px; border-radius: 30px; }
  .irmajavi-panel, .irmajavi-weather-panel { display: grid; min-height: 66px; align-items: center; border: 2px solid rgba(var(--ulm-grey), .65); border-radius: 20px; }
  .irmajavi-panel { grid-template-columns: 1fr; padding: 0 12px; }
  .irmajavi-panel > b { margin-left: 23px; color: var(--secondary-text-color); font-size: 14px; }
  .irmajavi-main-name { display: flex; align-items: center; gap: 7px; font-size: 14px; font-weight: 700; }
  .irmajavi-main-name ha-icon { --mdc-icon-size: 18px; }
  .irmajavi-weather-panel { grid-template-columns: 1fr auto; padding-left: 12px; }
  .irmajavi-weather-panel .weather-date { font-size: 14px; }
  .irmajavi-weather-panel strong { margin-right: 10px; padding: 10px; border-radius: 12px; background: rgba(var(--ulm-grey), .75); color: #000; font-size: 20px; }
  .irmajavi-four { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
  .irmajavi-four > button { display: grid; min-width: 0; min-height: 54px; place-items: center; padding: 6px 3px; border: 0; background: transparent; color: var(--primary-text-color); text-align: center; }
  .irmajavi-four b, .irmajavi-four small { overflow: hidden; max-width: 100%; text-overflow: ellipsis; white-space: nowrap; }
  .irmajavi-four b { font-size: 14px; } .irmajavi-four small { color: var(--secondary-text-color); font-size: 12px; font-weight: 700; }
  .speedtest-router { flex-direction: column; text-align: center; }
  .speedtest-router .ulm-icon { width: 62px; height: 62px; }
  .speedtest-router .ulm-icon ha-icon { --mdc-icon-size: 32px; }
  .speedtest-router .ulm-copy { align-items: center; }
  .speedtest-action { display: grid; min-height: 40px; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; padding: 0 12px; border: 2px solid rgba(var(--ulm-grey), .65); border-radius: 10px; background: transparent; color: var(--primary-text-color); font-size: 16px; font-weight: 700; text-align: left; }
  .speedtest-action ha-icon { --mdc-icon-size: 20px; }
  .speedtest-metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .speedtest-metrics > button { display: grid; gap: 2px; min-height: 80px; place-items: center; padding: 8px; border: 0; border-radius: 14px; background: rgba(var(--ulm-grey), .07); color: var(--primary-text-color); }
  .speedtest-metrics small { color: var(--secondary-text-color); font-size: 10px; }
  .speedtest-metrics b { overflow: hidden; font-size: 23px; text-overflow: ellipsis; white-space: nowrap; }
  .light-colorpick-top { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 10px; }
  .custom-light-colorpick.is-active { background: rgba(var(--color-background-yellow, 255, 235, 59), var(--opacity-bg, .16)); }
  .light-color-swatches { display: grid; grid-template-columns: repeat(6, 1fr); gap: 7px; }
  .light-color-swatches button { aspect-ratio: 1; border: 3px solid var(--card-background-color); border-radius: 50%; background: var(--swatch); box-shadow: 0 0 0 1px rgba(var(--ulm-grey), .15); }
  .custom-more-power-outlet, .custom-wifi-signal, .custom-nas-info, .custom-paddy-pollen, .custom-paddy-waste {
    display: grid; min-height: 62px; grid-template-columns: 46px minmax(0, 1fr); align-items: center; gap: 10px; padding: 10px 14px;
  }
  .custom-dual-gauge { display: grid; min-height: 210px; gap: 10px; padding: 12px; }
  .dual-gauge { position: relative; align-self: end; justify-self: center; width: min(86%, 240px); height: 108px; overflow: hidden; }
  .dual-gauge > i { position: absolute; top: 0; left: 50%; width: 210px; height: 210px; transform: translateX(-50%); border-radius: 50%; background: conic-gradient(from 270deg, rgb(var(--ulm-blue)) var(--gauge), rgba(var(--ulm-grey), .1) 0 180deg, transparent 180deg); }
  .dual-gauge > i::after { content: ""; position: absolute; inset: 48px; border-radius: 50%; background: var(--card-background-color); }
  .dual-gauge > span { position: absolute; right: 0; bottom: 8px; left: 0; z-index: 1; display: grid; text-align: center; }
  .dual-gauge > span b { font-size: 18px; } .dual-gauge small { color: var(--secondary-text-color); font-size: 11px; }
  .toner-bars { display: grid; gap: 9px; }
  .toner-bars span { display: block; height: 32px; }
  .toner-bars i { position: relative; display: block; height: 100%; overflow: hidden; border: 1px solid rgba(var(--ulm-grey), .3); border-radius: 7px; background: rgba(var(--ulm-grey), .08); font-style: normal; }
  .toner-bars em { position: absolute; inset: 0 auto 0 0; width: var(--level); background: var(--toner); }
  .toner-bars b { position: relative; z-index: 1; display: grid; height: 100%; place-items: center; color: color-mix(in srgb, var(--toner) 20%, white); font-size: 17px; font-weight: 500; }
  .update-controls { grid-template-columns: repeat(2, 1fr); }
  .custom-nik-clock { display: grid; min-height: 86px; place-items: center; padding: 12px; text-align: center; }
  .custom-nik-clock b { font-size: 34px; line-height: 1; } .custom-nik-clock span { color: var(--secondary-text-color); font-size: 12px; }
  .custom-nik-door { display: grid; grid-template-columns: minmax(0, 1fr) 96px; align-items: center; gap: 10px; padding: 12px; }
  .nik-door-heading { display: flex; min-width: 0; align-items: center; gap: 10px; }
  .nik-door-icon { position: relative; display: grid; width: 46px; height: 46px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .12); color: rgb(var(--ulm-blue)); }
  .nik-door-icon i { position: absolute; right: -3px; bottom: -3px; display: grid; width: 20px; height: 20px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; background: rgb(var(--ulm-green)); color: #fff; }
  .nik-door-icon i.is-low { background: rgb(var(--ulm-red)); } .nik-door-icon i ha-icon { --mdc-icon-size: 13px; } .nik-door-controls { grid-template-columns: repeat(2, 1fr); }
  .custom-nik-nas { gap: 12px; padding: 18px; }
  .nik-nas-top { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .nik-nas-tile { box-sizing: border-box; display: grid; min-height: 102px; grid-template-columns: 64px minmax(0, 1fr); align-items: center; gap: 16px; padding: 12px 18px; border: 3px solid rgba(var(--ulm-grey), .45); border-radius: 30px; background: transparent; color: var(--primary-text-color); text-align: left; }
  button.nik-nas-tile { cursor: pointer; }
  .nik-nas-tile-icon { display: grid; width: 62px; height: 62px; place-items: center; border-radius: 50%; background: rgba(var(--tone), .2); color: rgb(var(--tone)); }
  .nik-nas-tile-icon ha-icon { --mdc-icon-size: 24px; }
  .nik-nas-tile > span:last-child, .nik-nas-metrics > span > span { display: grid; }
  .nik-nas-tile b, .nik-nas-metrics b { font-size: 21px; line-height: 1.1; }
  .nik-nas-tile small, .nik-nas-metrics small { color: rgba(var(--ulm-grey), .65); font-size: 17px; font-weight: 600; }
  .nik-nas-body { display: grid; grid-template-columns: minmax(150px, .9fr) minmax(180px, 1.2fr); align-items: center; gap: 18px; }
  .nik-nas-metrics { display: grid; gap: 12px; }
  .nik-nas-metrics > span { display: grid; min-height: 62px; grid-template-columns: 56px minmax(0, 1fr); align-items: center; gap: 14px; }
  .nik-nas-metrics i { display: grid; width: 56px; height: 56px; place-items: center; border-radius: 50%; background: rgba(var(--tone), .2); color: rgb(var(--tone)); font-style: normal; }
  .nik-nas-metrics i ha-icon { --mdc-icon-size: 24px; }
  .nik-nas-rings { width: 100%; max-width: 190px; justify-self: center; overflow: visible; transform: rotate(-90deg); }
  .nik-nas-ring-track, .nik-nas-ring-value { fill: none; stroke-width: 6; }
  .nik-nas-ring-track { stroke: rgba(var(--ulm-grey), .16); }
  .nik-nas-ring-value { stroke-linecap: round; }
  @container (max-width: 380px) {
    .custom-nik-nas { gap: 10px; padding: 12px; }
    .nik-nas-top { gap: 8px; }
    .nik-nas-tile {
      min-width: 0;
      min-height: 82px;
      grid-template-columns: 44px minmax(0, 1fr);
      gap: 9px;
      padding: 9px 10px;
      border-width: 2px;
      border-radius: 24px;
    }
    .nik-nas-tile-icon { width: 44px; height: 44px; }
    .nik-nas-tile b, .nik-nas-metrics b { font-size: 16px; }
    .nik-nas-tile small, .nik-nas-metrics small { font-size: 13px; }
    .nik-nas-tile > span:last-child { min-width: 0; overflow: hidden; }
    .nik-nas-tile b, .nik-nas-tile small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .nik-nas-body { grid-template-columns: minmax(112px, 1fr) minmax(120px, 132px); gap: 8px; }
    .nik-nas-metrics { gap: 6px; }
    .nik-nas-metrics > span {
      min-height: 46px;
      grid-template-columns: 38px minmax(0, 1fr);
      gap: 8px;
    }
    .nik-nas-metrics i { width: 38px; height: 38px; }
    .nik-nas-metrics i ha-icon, .nik-nas-tile-icon ha-icon { --mdc-icon-size: 20px; }
    .nik-nas-rings { width: 132px; max-width: 100%; }
  }
  .custom-nik-tablet { gap: 14px; padding: 18px; }
  .nik-tablet-header { display: grid; grid-template-columns: 42px minmax(0, 1fr); align-items: center; gap: 12px; }
  .nik-tablet-icon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .2); color: rgb(var(--ulm-blue)); }
  .nik-tablet-icon ha-icon { --mdc-icon-size: 22px; }
  .nik-tablet-header .ulm-name { font-size: 14px; }
  .nik-tablet-header .ulm-label { font-size: 12px; }
  .nik-tablet-controls { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .nik-tablet-controls button { display: grid; height: 42px; place-items: center; border: 0; border-radius: 14px; background: rgba(var(--tone), .2); color: rgb(var(--tone)); cursor: pointer; }
  .nik-tablet-controls button ha-icon { --mdc-icon-size: 22px; }
  .nik-tablet-controls button.is-active { background: rgba(var(--tone), .3); box-shadow: inset 0 0 0 2px rgba(var(--tone), .35); }
  .nik-tablet-controls button:disabled { opacity: .3; cursor: not-allowed; }
  .nik-tablet-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(72px, 1fr)); gap: 8px; text-align: center; }
  .nik-tablet-metrics span { display: grid; gap: 2px; }
  .nik-tablet-metrics span.is-unavailable { opacity: .55; }
  .nik-tablet-metrics b { overflow: hidden; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }
  .nik-tablet-metrics small { color: rgba(var(--ulm-grey), .65); font-size: 12px; font-weight: 600; }
  .nik-tablet-battery-row { display: grid; grid-template-columns: 42px minmax(0, 1fr); align-items: center; gap: 12px; }
  .nik-tablet-battery-icon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-grey), .08); color: rgba(var(--ulm-grey), .8); }
  .nik-tablet-battery-icon ha-icon { --mdc-icon-size: 22px; }
  .nik-tablet-battery-row > span:last-child { display: grid; }
  .nik-tablet-battery-row b { font-size: 14px; } .nik-tablet-battery-row small { color: rgba(var(--ulm-grey), .65); font-size: 12px; font-weight: 600; }
  .nik-tablet-battery-bar { position: relative; height: 35px; overflow: hidden; border-radius: 18px; background: rgba(var(--ulm-grey), .16); }
  .nik-tablet-battery-bar i { position: absolute; inset: 0 auto 0 0; border-radius: inherit 0 0 inherit; background: #00c853; }
  .nik-tablet-battery-bar b { position: relative; z-index: 1; display: flex; height: 100%; align-items: center; justify-content: flex-end; padding-right: 14px; font-size: 16px; }
  .pollen-icon { display: grid; width: 46px; height: 46px; place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--pollen) 20%, transparent); color: var(--pollen); }
  .paddy-waste-icon { position: relative; } .paddy-waste-icon > i { position: absolute; top: -3px; right: -3px; display: grid; width: 20px; height: 20px; place-items: center; border-radius: 50%; background: rgb(var(--ulm-red)); color: #fff; }
  .paddy-waste-icon > i ha-icon { --mdc-icon-size: 13px; }
  .custom-paddy-welcome { display: grid; min-height: 76px; gap: 12px; padding: 12px; }
  .paddy-welcome-message { font-size: 30px; font-weight: 500; line-height: 1.15; text-align: left; }
  .paddy-welcome-weather { display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 0; border-radius: 14px; background: transparent; color: var(--primary-text-color); text-align: left; }
  .paddy-welcome-weather > span { display: grid; grid-template-columns: 28px auto; align-items: center; column-gap: 8px; }
  .paddy-welcome-weather ha-icon { grid-row: span 2; --mdc-icon-size: 24px; }
  .paddy-welcome-weather b { font-size: 14px; text-transform: capitalize; } .paddy-welcome-weather small { color: var(--secondary-text-color); font-size: 12px; }
  .paddy-welcome-weather strong { font-size: 16px; }
  .paddy-welcome-news { display: grid; gap: 4px; }
  .paddy-welcome-news button { display: grid; grid-template-columns: 28px 1fr; align-items: center; gap: 8px; padding: 7px 8px; border: 0; border-radius: 10px; background: transparent; color: var(--primary-text-color); text-align: left; }
  .paddy-welcome-news button span { display: grid; } .paddy-welcome-news small, .paddy-welcome-empty { color: var(--secondary-text-color); font-size: 11px; }
  .custom-person-chip { display: inline-grid; width: max-content; min-height: 42px; grid-template-columns: 34px auto; align-items: center; gap: 8px; padding: 4px 12px 4px 4px; border-radius: 24px; }
  .custom-person-chip > span { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .12); background-position: center; background-size: cover; color: rgb(var(--ulm-blue)); }
  .custom-person-chip > b { font-size: 12px; }
  .custom-person-info, .custom-ristou-person, .custom-saxel-fan, .custom-schumijo-car,
  .custom-schumijo-flower, .custom-sisimomo-printer, .custom-speedtest-shogun,
  .custom-tpx-aircondition, .custom-water-heater { display: grid; gap: 10px; padding: 12px; }
  .custom-person-info-small { display: grid; min-height: 118px; gap: 8px; padding: 12px; }
  .person-info-main, .ristou-person-main, .car-hero, .flower-heading, .printer-summary,
  .aircondition-main, .water-heater-top { display: flex; min-width: 0; align-items: center; gap: 10px; }
  .person-info-avatar { position: relative; display: grid; width: 42px; height: 42px; flex: 0 0 auto; place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .12) center/cover; color: rgb(var(--ulm-blue)); }
  .person-info-avatar.has-picture > ha-icon { display: none; }
  .person-info-badge { position: absolute; top: -3px; right: -3px; display: grid; width: 16px; height: 16px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; background: rgb(var(--tone)); color: #fff; }
  .person-info-badge ha-icon { --mdc-icon-size: 10px; }
  .person-info-small-top { display: flex; align-items: flex-start; justify-content: space-between; }
  .person-info-small-battery { display: grid; width: 30px; height: 30px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; background: rgba(var(--ulm-grey), .05); color: rgb(var(--tone)); }
  .person-info-small-battery ha-icon { --mdc-icon-size: 25px; }
  .person-info-small-copy { display: grid; text-align: center; }
  .person-info-small-copy b { font-size: 14px; }
  .person-info-small-copy small { color: var(--secondary-text-color); font-size: 12px; text-transform: capitalize; }
  .custom-person-info { min-height: 68px; grid-template-columns: minmax(0, 1fr) auto; align-items: center; }
  .custom-person-info.is-multiline { min-height: 105px; grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .custom-person-info.is-multiline .person-info-details { padding-left: 4px; }
  .person-info-details { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .person-info-detail { display: flex; align-items: center; gap: 4px; font-size: 12px; }
  .person-info-detail ha-icon { --mdc-icon-size: 16px; color: rgb(var(--tone, var(--ulm-green))); }
  .commute-detail ha-icon { color: rgb(var(--ulm-yellow)); }
  .car-metrics, .flower-metrics, .device-tracer-meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
  .car-metrics > span, .flower-metrics > span, .device-tracer-meta > span { display: grid; min-width: 0; min-height: 52px; place-items: center; padding: 6px; border-radius: 12px; background: rgba(var(--ulm-grey), .07); text-align: center; }
  .car-metrics ha-icon, .flower-metrics ha-icon, .device-tracer-meta ha-icon { --mdc-icon-size: 17px; color: rgb(var(--ulm-blue)); }
  .car-metrics b, .flower-metrics b { overflow: hidden; max-width: 100%; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
  .custom-console-card { position: relative; min-height: 72px; overflow: hidden; }
  .custom-console-card.has-artwork { background: #17191d; color: #fff; }
  .console-backdrop { position: absolute; inset: 0; background-position: center; background-size: cover; opacity: .35; }
  .console-content { position: relative; z-index: 1; display: grid; min-height: 48px; grid-template-columns: 52px minmax(0, 1fr); align-items: center; gap: 10px; padding: 12px; }
  .has-artwork .console-content { background: linear-gradient(90deg, rgba(0,0,0,.8), rgba(0,0,0,.18)); }
  .console-logo { display: grid; width: 52px; height: 52px; place-items: center; border-radius: 50%; background: rgba(255,255,255,.1); }
  .console-logo ha-icon { --mdc-icon-size: 32px; } .state-idle .console-logo { color: rgb(var(--ulm-blue)); background: rgba(var(--ulm-blue), .2); } .state-standby .console-logo { color: rgba(var(--ulm-grey), .35); background: rgba(var(--ulm-grey), .05); }
  .has-artwork .console-content .ulm-label { color: rgba(255,255,255,.75); }
  .custom-qubino, .custom-senoro-window, .custom-lights-count { display: grid; min-height: 64px; grid-template-columns: 46px minmax(0, 1fr); align-items: center; gap: 10px; padding: 10px 14px; }
  .custom-qubino .ulm-icon { color: rgb(var(--ulm-blue)); background: rgba(var(--ulm-blue), .2); }
  .ristou-person-main { grid-template-columns: min-content minmax(0,1fr) auto; align-items: center; }
  .ristou-person-avatar { position: relative; display: grid; width: 42px; height: 42px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-grey), .05); background-position: center; background-size: cover; }
  .ristou-person-avatar > i { position: absolute; top: -3px; right: -3px; display: grid; width: 16px; height: 16px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; color: #fff; }
  .ristou-person-avatar > i ha-icon { --mdc-icon-size: 10px; } .ristou-person-avatar > i.tone-red { background: rgb(var(--ulm-red)); } .ristou-person-avatar > i.tone-green { background: rgb(var(--ulm-green)); } .ristou-person-avatar > i.tone-yellow { background: rgb(var(--ulm-yellow)); } .ristou-person-avatar > i.tone-blue { background: rgb(var(--ulm-blue)); }
  .ristou-find-device { display: grid; width: 42px; height: 42px; place-items: center; border: 0; border-radius: 12px; background: rgba(var(--ulm-blue), .2); color: rgb(var(--ulm-blue)); }
  .ristou-camera { min-height: 130px; border-radius: 15px; background: rgba(var(--ulm-grey), .08) center/cover; }
  .ristou-map { display: flex; min-height: 42px; align-items: center; justify-content: center; gap: 7px; border-radius: 13px; background: rgba(var(--ulm-blue), .1); color: rgb(var(--ulm-blue)); font-size: 11px; font-weight: 700; }
  .fan-speed-row, .fan-preset-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
  .fan-preset-row { grid-template-columns: repeat(4, 1fr); }
  .fan-speed-row button, .fan-preset-row button { min-height: 38px; border: 0; border-radius: 12px; background: rgba(var(--ulm-grey), .08); color: var(--primary-text-color); font-size: 10px; }
  .fan-speed-row button.is-active, .fan-preset-row button.is-active { background: rgba(var(--ulm-blue), .18); color: rgb(var(--ulm-blue)); }
  .custom-scenes-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 7px; padding: 12px; }
  .custom-scenes-grid button { display: grid; min-width: 0; gap: 6px; place-items: center; padding: 0; border: 0; background: transparent; color: var(--primary-text-color); }
  .custom-scenes-grid button > span { display: grid; width: 44px; height: 44px; place-items: center; border-radius: 50%; background: rgba(var(--tone), .18); color: rgb(var(--tone)); }
  .custom-scenes-grid small { overflow: hidden; width: 100%; font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }
  .car-hero > ha-icon { margin-left: auto; } .car-metrics { grid-template-columns: repeat(2, 1fr); }
  .flower-metrics { grid-template-columns: repeat(4, 1fr); } .flower-metrics > span { min-height: 44px; }
  .window-battery { display: flex; align-items: center; gap: 4px; color: var(--secondary-text-color); font-size: 11px; }
  .window-battery ha-icon { --mdc-icon-size: 16px; }
  .printer-cartridges { display: grid; gap: 5px; }
  .printer-cartridges span { display: grid; grid-template-columns: 18px minmax(0, 1fr) 42px; align-items: center; gap: 7px; }
  .printer-cartridges i { position: relative; display: block; height: 13px; overflow: hidden; border: 1px solid rgba(var(--ulm-grey), .2); border-radius: 3px; background: rgba(var(--ulm-grey), .05); }
  .printer-cartridges em { position: absolute; inset: 0 auto 0 0; width: var(--level); background: var(--cartridge); }
  .printer-cartridges small, .printer-cartridges b { color: var(--secondary-text-color); font-size: 9px; font-weight: 500; }
  .speedtest-three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
  .speedtest-three span { display: grid; min-width: 0; place-items: center; gap: 3px; padding: 8px; border-radius: 12px; background: rgba(var(--ulm-grey), .07); text-align: center; }
  .speedtest-three ha-icon { color: rgb(var(--ulm-blue)); } .speedtest-three b { font-size: 12px; } .speedtest-three small { overflow: hidden; max-width: 100%; color: var(--secondary-text-color); font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }
  .speedtest-chart { height: 58px; overflow: hidden; } .speedtest-chart .sparkline { height: 60px; }
  .aircondition-main > b, .water-heater-top > b { margin-left: auto; font-size: 20px; }
  .aircondition-controls { display: grid; grid-template-columns: 42px 1fr 1fr 42px; align-items: center; gap: 7px; }
  .aircondition-controls button, .water-heater-controls button { min-height: 42px; border: 0; border-radius: 13px; background: rgba(var(--ulm-grey), .08); color: var(--primary-text-color); }
  .aircondition-controls span { display: flex; min-height: 42px; align-items: center; justify-content: center; gap: 4px; border-radius: 13px; background: rgba(var(--ulm-grey), .06); font-size: 10px; }
  .aircondition-controls span ha-icon { --mdc-icon-size: 16px; }
  .custom-device-tracer { display: grid; min-height: 88px; grid-template-columns: 48px minmax(0, 1fr); align-items: center; gap: 10px; padding: 12px; }
  .device-tracer-icon { display: grid; width: 48px; height: 48px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .15); color: rgb(var(--ulm-blue)); }
  .device-tracer-meta { grid-column: 1 / -1; grid-template-columns: repeat(2, 1fr); } .device-tracer-meta > span { min-height: 36px; display: flex; gap: 6px; font-size: 10px; }
  .water-heater-controls { display: grid; grid-template-columns: 48px 1fr 48px; align-items: center; gap: 8px; } .water-heater-controls span { text-align: center; font-size: 11px; text-transform: capitalize; }
  .custom-wilbiev-title { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; padding: 8px 0; }
  .custom-wilbiev-title span { height: 1px; background: var(--divider-color); } .custom-wilbiev-title b { font-size: 16px; } .custom-wilbiev-title.is-subtitle b { color: var(--secondary-text-color); font-size: 12px; }
  .custom-wsly-pollen { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 12px; }
  .custom-wsly-pollen > span { display: grid; min-height: 70px; place-items: center; padding: 7px; border-radius: 15px; background: color-mix(in srgb, var(--pollen) 12%, transparent); color: var(--pollen); text-align: center; }
  .custom-wsly-pollen b { font-size: 13px; } .custom-wsly-pollen small { font-size: 9px; }
  .preview { padding: 16px; color: var(--secondary-text-color); text-align: center; }
`, h = (e, t) => e?.attributes[t], w = (e) => {
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, fe = (e, t, a, r, o = "") => {
  if (e.config.icon_type === "none" || e.config.show_icon === !1) return p;
  const n = e.config.icon_type === "entity-picture" ? h(e.entity, "entity_picture") : void 0;
  return n ? s`<span class="ulm-icon entity-picture ${o}" style=${`background-image:url("${String(n)}")`}></span>` : s`<span class="ulm-icon source-icon ${r ? "is-source-active" : ""} ${o}"
        style=${`--source-color:${a}`}>
        <ha-icon .icon=${e.config.icon || t}></ha-icon>
      </span>`;
}, mt = (e, t) => {
  const a = c(e, t);
  return a ? e.hass.states[a] : void 0;
}, Ya = (e, t) => e === void 0 ? "mdi:battery-off" : e >= 100 ? "mdi:battery" : e < 10 ? `mdi:battery${t}-outline` : `mdi:battery${t}-${Math.floor(e / 10) * 10}`, A = (e, t) => {
  const a = e.config[t];
  return typeof a == "string" ? e.hass.states[a] : void 0;
}, c = (e, ...t) => {
  for (const a of t)
    if (e.config[a] !== void 0) return e.config[a];
}, qt = (e, t, ...a) => c(e, String(t), ...a) === !0, Ft = (e, t) => e.config.icon || e.entity?.attributes.icon || Tt(e.descriptor, e.entity) || t, x = (e, t, a = "blue", r = "") => {
  if (e.config.icon_type === "none" || e.config.show_icon === !1) return p;
  const o = e.config.icon_type === "entity-picture" ? h(e.entity, "entity_picture") : void 0;
  return o ? s`<span class="ulm-icon entity-picture ${r}" style=${`background-image:url("${String(o)}")`}></span>` : s`<span class="ulm-icon tone-${a} ${r}"><ha-icon .icon=${Ft(e, t)}></ha-icon></span>`;
}, pt = (e, t) => {
  switch (e.config.secondary_info) {
    case "none":
      return;
    case "name":
      return j(e.config, e.entity);
    case "state":
      return b(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    default:
      return e.config.secondary || t;
  }
}, Ie = (e) => e.config.primary_info === "none" ? "" : e.config.primary_info === "state" ? b(e.entity) : j(e.config, e.entity), P = (e, t) => s`
  <span class="ulm-copy">
    ${Ie(e) ? s`<span class="ulm-name">${Ie(e)}</span>` : p}
    ${pt(e, t) ? s`<span class="ulm-label">${pt(e, t)}</span>` : p}
  </span>
`, De = (e, t = b(e.entity)) => s`
  <span class="ulm-copy value-first">
    <span class="ulm-name">${t}</span>
    <span class="ulm-label">${j(e.config, e.entity)}</span>
  </span>
`, k = (e, t, a, r = !1) => s`
  <button class="ulm-control" aria-label=${e} ?disabled=${r}
    @pointerdown=${(o) => o.stopPropagation()} @click=${a}>
    <ha-icon .icon=${t}></ha-icon>
  </button>
`, Za = (e, t, a, r, o = !1) => {
  let n, i = !1;
  const l = () => {
    n !== void 0 && window.clearTimeout(n), n = void 0;
  };
  return s`
    <button class="ulm-control hold-control" aria-label=${e} ?disabled=${o}
      @pointerdown=${(d) => {
    d.stopPropagation(), i = !1, n = window.setTimeout(() => {
      i = !0, r();
    }, 500);
  }}
      @pointerup=${(d) => {
    d.stopPropagation(), l();
  }}
      @pointercancel=${l}
      @click=${(d) => {
    d.stopPropagation(), i || a(), i = !1;
  }}>
      ${t}
    </button>
  `;
}, q = (e, t, a, r = t.config.entity) => {
  e.stopPropagation(), ne(e.currentTarget, "hass-action", {
    config: { type: t.config.type, entity: r, tap_action: a },
    action: "tap"
  });
}, We = {
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
}, Ja = (e) => {
  const t = e.entity?.state ?? "unknown", [a, r] = We[t] ?? ["mdi:weather-partly-cloudy", "grey"], o = A(e, "temperature_entity"), n = A(e, "humidity_entity"), i = b(o) !== "Entity unavailable" ? b(o) : `${h(e.entity, "temperature") ?? "—"}${h(e.entity, "temperature_unit") ?? "°"}`, l = b(n) !== "Entity unavailable" ? b(n) : `${h(e.entity, "humidity") ?? "—"}%`, d = e.forecast?.slice(0, 4) ?? [], m = e.config.variant === "native", f = c(e, "ulm_card_weather_backdrop") === !0, y = c(e, "ulm_card_weather_primary_info") ?? "extrema", u = c(e, "ulm_card_weather_secondary_info") ?? "precipitation";
  if (!m) {
    const g = d[0], v = g?.temperature ?? h(e.entity, "temperature"), V = g?.templow ?? g?.temperature_low ?? "—", E = g?.precipitation_probability ?? g?.precipitation, z = h(e.entity, "wind_speed") ?? "—", D = h(e.entity, "wind_speed_unit") ?? "";
    return e.actionSurface(`ulm-weather detailed-weather ${f ? "has-backdrop" : ""}`, s`
      <div class="detailed-weather-main">
        <div class="detailed-weather-current">
          <ha-icon class="detailed-weather-icon" .icon=${a}></ha-icon>
          <span><b>${i}</b><small>${t.replaceAll("-", " ")}</small></span>
        </div>
        <div class="detailed-weather-details">
          ${y === "extrema" ? s`<b>${String(V)}° / ${String(v)}°</b>` : p}
          ${u === "precipitation" && E !== void 0 ? s`<span><ha-icon icon="mdi:weather-pouring"></ha-icon>${String(E)}${g?.precipitation_probability !== void 0 ? "%" : String(h(e.entity, "precipitation_unit") ?? " mm")}</span>` : s`<span><ha-icon icon="mdi:weather-windy"></ha-icon>${String(z)} ${String(D)}</span>`}
        </div>
      </div>
    `);
  }
  return e.actionSurface("ulm-weather native-weather", s`
    <div class="weather-main native-weather-main">
      <span class="ulm-icon weather-icon tone-${r}"><ha-icon .icon=${a}></ha-icon></span>
      <div class="weather-summary">
        <span class="ulm-name">${j(e.config, e.entity)}</span>
        <span class="ulm-label weather-condition">${b(e.entity)}</span>
      </div>
    </div>
    <div class="weather-metrics">
      <span class="metric-pill"><ha-icon icon="mdi:water-percent"></ha-icon>${l}</span>
      <span class="metric-pill"><ha-icon icon="mdi:thermometer"></ha-icon>${i}</span>
    </div>
  `);
}, ht = (e) => {
  const t = e.entity?.state === "on", a = w(h(e.entity, "brightness")), r = a === void 0 ? void 0 : Math.round(a / 2.55), o = qt(e, "show_controls", "ulm_card_light_enable_slider"), n = c(e, "ulm_card_light_enable_buttons") === !0, i = c(e, "ulm_card_light_enable_collapse") === !0 && !t, l = e.config.layout === "horizontal" || c(e, "ulm_card_light_enable_horizontal") === !0, d = c(e, "ulm_card_light_enable_horizontal_wide") === !0, m = c(e, "ulm_card_light_brightness_low") ?? 1, f = c(e, "ulm_card_light_brightness_medium") ?? 50, y = c(e, "ulm_card_light_brightness_high") ?? 100, u = c(e, "ulm_card_light_enable_slider_minSet") ?? 0, g = c(e, "ulm_card_light_enable_slider_maxSet") ?? 100, v = c(e, "ulm_card_light_enable_color") === !0 ? h(e.entity, "rgb_color") : void 0, V = Array.isArray(v) && v.length >= 3 ? v.slice(0, 3).map(Number).join(",") : "255,152,0", E = c(e, "ulm_card_light_force_background_color") === !0 && t, z = `--light-rgb:${V};${E ? `background:rgba(${V},.2);` : ""}`;
  return e.actionSurface(`ulm-light-card ${l ? "is-horizontal" : ""} ${d ? "is-horizontal-wide" : ""} ${i ? "is-collapsed" : ""}`, s`
    <div class="light-header ${t ? "is-active" : ""}" style=${z}>
      ${x(e, "mdi:lightbulb", t ? "yellow" : "grey", "light-icon")}
      ${P(e, t && r !== void 0 ? `${r}%` : b(e.entity))}
    </div>
    ${!i && o ? s`
      <div class="ulm-light-slider" style=${`${z}--light-level:${Math.max(0, Math.min(100, r ?? 0))}%;`}>
        <i></i>
        <input type="range" .min=${String(u)} .max=${String(g)} .value=${String(r ?? 0)}
          aria-label="Brightness"
          @pointerdown=${(D) => D.stopPropagation()}
          @click=${(D) => D.stopPropagation()}
          @change=${(D) => e.service("light", "turn_on", { entity_id: e.config.entity, brightness_pct: Number(D.target.value) })}>
      </div>
    ` : p}
    ${!i && n ? s`<div class="ulm-controls brightness-presets">
      ${[m, f, y].map((D) => k(`${D}% brightness`, "mdi:brightness-6", (N) => {
    N.stopPropagation(), e.service("light", "turn_on", { entity_id: e.config.entity, brightness_pct: D });
  }))}
    </div>` : p}
  `);
}, ae = (e, t, a = !1) => c(e, t) ?? a, Qa = (e) => w(e.config.thermostat_temp_step) ?? w(c(e, "ulm_card_thermostat_temp_step")) ?? w(h(e.entity, "target_temp_step")) ?? 0.5, bt = (e, t, a) => {
  const r = Qa(e), o = w(h(e.entity, "temperature")), n = w(h(e.entity, "target_temp_low")), i = w(h(e.entity, "target_temp_high"));
  if (n !== void 0 && i !== void 0) {
    const l = w(e.config.thermostat_minimum_temp_spread) ?? w(c(e, "ulm_card_thermostat_minimum_temp_spread")) ?? 1;
    if (t === "high") {
      const d = i + a * r;
      e.service("climate", "set_temperature", {
        entity_id: e.config.entity,
        target_temp_low: a < 0 && d - l < n ? d - l : n,
        target_temp_high: d
      });
    } else {
      const d = n + a * r;
      e.service("climate", "set_temperature", {
        entity_id: e.config.entity,
        target_temp_low: d,
        target_temp_high: a > 0 && d + l > i ? d + l : i
      });
    }
    return;
  }
  o !== void 0 && e.service("climate", "set_temperature", {
    entity_id: e.config.entity,
    temperature: a < 0 ? Math.max(o - r, 0) : o + r
  });
}, Ee = (e, t, a, r) => s`
  <div class="thermostat-adjustment ${t}">
    ${k(`Decrease ${r}`, "mdi:minus", (o) => {
  o.stopPropagation(), bt(e, t, -1);
})}
    <b>${String(a ?? "—")}°</b>
    ${k(`Increase ${r}`, "mdi:plus", (o) => {
  o.stopPropagation(), bt(e, t, 1);
})}
  </div>
`, gt = {
  auto: ["mdi:autorenew", "green"],
  heat: ["mdi:fire", "red"],
  cool: ["mdi:snowflake", "blue"],
  dry: ["mdi:water", "yellow"],
  heat_cool: ["mdi:sun-snowflake", "purple"],
  fan_only: ["mdi:fan", "green"]
}, Xa = (e) => {
  const t = h(e.entity, "current_temperature") ?? "—", a = h(e.entity, "temperature"), r = h(e.entity, "target_temp_low"), o = h(e.entity, "target_temp_high"), n = String(h(e.entity, "hvac_action") ?? e.entity?.state ?? "off"), i = ae(e, "ulm_card_thermostat_enable_collapse") && e.entity?.state === "off", l = !i && ae(
    e,
    "ulm_card_thermostat_enable_controls",
    e.config.show_controls === !0
  ), d = !i && ae(e, "ulm_card_thermostat_enable_hvac_modes"), m = ae(e, "ulm_card_thermostat_enable_display_temperature"), f = ae(e, "ulm_card_thermostat_enable_horizontal"), y = ae(e, "ulm_card_thermostat_enable_background_color"), u = Array.isArray(h(e.entity, "hvac_modes")) ? h(e.entity, "hvac_modes").map(String).filter((V) => gt[V]) : [], g = e.config.fan_entity || c(e, "ulm_card_thermostat_fan_entity"), v = g ? e.hass.states[g] : void 0;
  return e.actionSurface(
    `ulm-climate ulm-source-thermostat ${f ? "is-horizontal" : ""} ${y ? `hvac-${n}` : ""}`,
    s`
      <div class="climate-top">
        <span class="ulm-icon tone-${n === "heating" ? "red" : n === "cooling" ? "blue" : "grey"}">
          <ha-icon .icon=${e.config.icon || c(e, "ulm_card_thermostat_icon") || "mdi:thermometer"}></ha-icon>
        </span>
        ${P(e, b(e.entity))}
        ${m ? s`<span class="climate-current">${t}°</span>` : p}
      </div>
      ${l ? s`
        <div class="thermostat-controls">
          ${o !== void 0 && r !== void 0 ? s`
              ${Ee(e, "high", o, "high temperature")}
              ${Ee(e, "low", r, "low temperature")}
            ` : Ee(e, "single", a, "temperature")}
        </div>
      ` : p}
      ${d && (u.length || g) ? s`
        <div class="thermostat-modes">
          ${u.map((V) => {
      const [E, z] = gt[V];
      return s`<button
              class="ulm-control thermostat-mode tone-${z} ${e.entity?.state === V ? "is-active" : ""}"
              aria-label=${`${V.replaceAll("_", " ")} mode`}
              @pointerdown=${(D) => D.stopPropagation()}
              @click=${(D) => {
        D.stopPropagation(), e.service("climate", "set_hvac_mode", { entity_id: e.config.entity, hvac_mode: V });
      }}
            ><ha-icon .icon=${E}></ha-icon></button>`;
    })}
          ${!u.includes("fan_only") && g ? s`
            <button
              class="ulm-control thermostat-mode tone-green ${v?.state === "on" ? "is-active" : ""}"
              aria-label="Toggle fan"
              @pointerdown=${(V) => V.stopPropagation()}
              @click=${(V) => {
      V.stopPropagation(), e.service("fan", "toggle", { entity_id: g });
    }}
            ><ha-icon icon="mdi:fan"></ha-icon></button>
          ` : p}
        </div>
      ` : p}
    `
  );
}, er = (e) => {
  const t = A(e, "battery_entity") ?? (c(e, "ulm_card_person_battery") ? e.hass.states[c(e, "ulm_card_person_battery")] : void 0), a = A(e, "eta_entity") ?? (c(e, "ulm_card_person_eta") ? e.hass.states[c(e, "ulm_card_person_eta")] : void 0), r = A(e, "address_entity") ?? (c(e, "ulm_address") ? e.hass.states[c(e, "ulm_address")] : void 0), o = e.config.icon_type === "entity-picture" || e.config.use_entity_picture ? h(e.entity, "entity_picture") : void 0, n = Object.values(e.hass.states).find((f) => f.entity_id.startsWith("zone.") && Array.isArray(f.attributes.persons) && f.attributes.persons.includes(e.entity?.entity_id)), i = e.entity?.state === "home" ? "mdi:home-variant" : n?.attributes.icon || (n ? "mdi:help-circle" : "mdi:home-minus"), l = t ? Math.max(0, Math.min(100, Math.round(Number(t.state)))) : void 0, d = 2 * Math.PI * 20.5, m = `${b(r || e.entity)}${a && e.entity?.state !== "home" ? ` | ${b(a)}` : ""}`;
  return e.actionSurface("ulm-row ulm-person ulm-source-person", s`
    <span class="person-icon-wrap">
      ${o ? s`<span class="person-picture" style=${`background-image:url("${String(o)}")`}></span>` : s`<span class="ulm-icon tone-grey"><ha-icon .icon=${e.config.icon || c(e, "ulm_card_person_icon") || "mdi:face-man"}></ha-icon></span>`}
      <span class="person-location-badge ${e.entity?.state === "home" ? "home" : "away"}">
        <ha-icon .icon=${String(i)}></ha-icon>
      </span>
    </span>
    ${P(e, m)}
    ${l !== void 0 ? s`
      <svg class="person-battery-ring" viewBox="0 0 50 50" aria-label=${`${l}% battery`}>
        <circle cx="25" cy="25" r="20.5"></circle>
        <circle class="value" cx="25" cy="25" r="20.5"
          style=${`stroke-dasharray:${d};stroke-dashoffset:${d - l / 100 * d}`}></circle>
        <text x="25" y="28">${l}<tspan>%</tspan></text>
      </svg>
    ` : p}
  `);
}, tr = (e) => {
  const t = w(e.entity?.state) ?? 0, a = !!h(e.entity, "is_charging") || String(e.entity?.state).includes("charging"), r = c(e, "ulm_card_battery_battery_level_danger") ?? 20, o = c(e, "ulm_card_battery_battery_level_warning") ?? 50, n = t < r ? "red" : t < o ? "yellow" : "green", i = c(e, "ulm_card_battery_charging_animation") === !0 && a;
  return e.actionSurface(`ulm-battery ${i ? "is-charging" : ""}`, s`
    ${x(e, a ? "mdi:battery-charging" : "mdi:battery", n)}
    ${P(e, a ? "Charging" : "Battery level")}
    <span class="battery-value">${Math.round(t)}<small>%</small></span>
    <span class="battery-track"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>
  `);
}, ar = (e) => {
  const t = c(e, "ulm_card_battery_attribute"), a = t ? h(e.entity, t) : e.entity?.state, r = w(a), o = mt(e, "ulm_card_battery_battery_state_entity_id"), n = mt(e, "ulm_card_battery_charger_type_entity_id"), i = o?.state.toLowerCase() === "charging", l = n?.state.toLowerCase(), d = l === "wireless" ? "-charging-wireless" : i || ["charging", "ac", "usb"].includes(l ?? "") ? "-charging" : "", m = c(e, "ulm_card_battery_battery_level_danger"), f = c(e, "ulm_card_battery_battery_level_warning"), y = m !== void 0 || f !== void 0, u = r === void 0 || m !== void 0 && r <= m ? B(c(e, "ulm_card_battery_color_battery_level_danger"), "var(--google-red, #f44336)") : f !== void 0 && r <= f ? B(c(e, "ulm_card_battery_color_battery_level_warning"), "var(--google-yellow, #fbc02d)") : y ? B(c(e, "ulm_card_battery_color_battery_level_ok"), "var(--google-green, #43a047)") : "rgba(var(--color-theme, 3, 169, 244), .9)", g = c(e, "ulm_card_battery_charging_animation") === !0 && i, v = c(e, "ulm_card_battery_name"), V = r === void 0 ? b(e.entity) : `${Math.round(r)}%`;
  return e.actionSurface(`ulm-row ulm-default-battery ${g ? "is-charging" : ""}`, s`
    ${fe(e, Ya(r, d), u, !0)}
    <span class="ulm-copy value-first">
      <span class="ulm-name">${V}</span>
      <span class="ulm-label">${v || j(e.config, e.entity)}</span>
    </span>
  `);
}, B = (e, t) => {
  if (!e) return t;
  if (/^(?:#|rgb|hsl|var\(|color\()/i.test(e)) return e;
  const a = {
    blue: "rgb(var(--ulm-blue))",
    green: "rgb(var(--ulm-green))",
    grey: "rgb(var(--ulm-grey))",
    orange: "rgb(var(--ulm-orange))",
    purple: "rgb(var(--ulm-purple))",
    red: "rgb(var(--ulm-red))",
    yellow: "rgb(var(--ulm-yellow))"
  };
  return a[e] ? a[e] : `rgba(var(--color-${e}), 1)`;
}, rr = (e) => {
  const t = w(e.entity?.state) ?? 0, a = w(c(e, "ulm_custom_card_bar_card_min")) ?? 0, o = (w(c(e, "ulm_custom_card_bar_card_max")) ?? 100) - a, n = o > 0 ? Math.max(0, Math.min(100, (t - a) / o * 100)) : 0, i = c(e, "ulm_custom_card_bar_card_show_icon") !== !1, l = c(e, "ulm_custom_card_bar_card_value") === !0, d = c(e, "ulm_custom_card_bar_card_indicator") === !0, m = B(
    c(e, "ulm_custom_card_bar_card_color"),
    "var(--google-blue, #4285f4)"
  ), f = B(
    c(e, "ulm_custom_card_bar_card_icon_color"),
    "var(--secondary-text-color)"
  ), y = c(e, "ulm_custom_card_bar_card_icon") || e.config.icon || e.entity?.attributes.icon || "mdi:chart-bar", u = c(e, "ulm_custom_card_bar_card_name") || j(e.config, e.entity), g = b(e.entity);
  return e.actionSurface(`minimalist-bar-card ${i ? "has-header" : "bar-only"}`, s`
    ${i ? s`
      <div class="bar-card-header">
        <span class="bar-card-icon" style=${`--bar-icon-color:${f}`}>
          <ha-icon .icon=${y}></ha-icon>
        </span>
        <span class="bar-card-copy">
          <b class="bar-card-primary-value">${g}</b>
          <span class="bar-card-name">${u}</span>
        </span>
      </div>
    ` : p}
    <div class="bar-card-track" style=${`--bar-fill:${m}`}>
      <span class="bar-card-fill" style=${`width:${n}%`}></span>
      ${d ? s`<span class="bar-card-indicator" style=${`left:${n}%`}></span>` : p}
      ${l ? s`<b class="bar-card-inside-value">${g}</b>` : p}
    </div>
  `);
}, ve = (e, t = !1, a = e.entity) => {
  const r = Array.isArray(h(a, "history")) ? h(a, "history").map(Number).filter(Number.isFinite).slice(-12) : [20, 28, 24, 42, 35, 52, 48, 63, 55, 70, 62, 78], o = Math.min(...r), n = Math.max(...r), i = r.map((d, m) => `${m / Math.max(1, r.length - 1) * 100},${36 - (d - o) / Math.max(1, n - o) * 32}`).join(" "), l = `0,40 ${i} 100,40`;
  return s`<svg class="sparkline ${t ? "is-filled" : ""}" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
    ${t ? s`<polygon points=${l}></polygon>` : p}
    <polyline points=${i}></polyline>
  </svg>`;
}, or = (e) => e.actionSurface("ulm-metric", s`
  <div class="metric-heading">${x(e, e.descriptor.family === "energy" ? "mdi:flash" : "mdi:chart-line", "blue")}${P(e, e.entity?.attributes.unit_of_measurement ? String(e.entity.attributes.unit_of_measurement) : "Current value")}<span class="metric-value">${b(e.entity)}</span></div>
  ${e.config.show_graph !== !1 ? ve(e) : p}
  ${A(e, "min_entity") || A(e, "max_entity") ? s`<div class="metric-extremes"><span>Min ${b(A(e, "min_entity"))}</span><span>Max ${b(A(e, "max_entity"))}</span></div>` : p}
`), nr = (e, t, a) => {
  if (a.nav_path) {
    q(e, t, { action: "navigate", navigation_path: a.nav_path }, a.entity);
    return;
  }
  const r = a.tap_action, o = r?.service ?? r?.perform_action;
  if ((r?.action === "call-service" || r?.action === "perform-action") && o) {
    const [l, d] = o.split(".", 2);
    if (l && d) {
      t.service(l, d, {
        entity_id: a.entity,
        ...r.service_data ?? r.data ?? {}
      });
      return;
    }
  }
  const [n, i] = a.entity.split(".", 2);
  n === "scene" ? t.service("scene", "turn_on", { entity_id: a.entity }) : n === "media_player" ? t.service("media_player", "media_play_pause", { entity_id: a.entity }) : n === "input_select" ? t.service("input_select", "select_option", {
    entity_id: a.entity,
    option: a.state,
    ...a.service_data ?? {}
  }) : n === "script" ? t.service("script", i || "turn_on", { entity_id: a.entity, ...a.service_data ?? {} }) : t.service("homeassistant", "toggle", { entity_id: a.entity, ...a.service_data ?? {} });
}, ir = (e) => {
  const t = (e.config.scene_items?.length ? e.config.scene_items : (e.config.entities?.length ? e.config.entities : e.config.entity ? [e.config.entity] : []).map((v) => ({ entity: v }))).filter((v) => v.entity), a = e.descriptor.upstreamId === "card_welcome_scenes";
  t.splice(a ? 7 : 6);
  const r = e.config.collapse_entity ? e.hass.states[e.config.collapse_entity] : void 0, o = e.config.collapsed === !0 || r?.state === "on", i = A(e, "weather_entity")?.state || "partlycloudy", l = We[i]?.[0] ?? "mdi:weather-partly-cloudy", d = (/* @__PURE__ */ new Date()).getHours(), m = e.hass.language?.split("-")[0] ?? "en", f = {
    de: ["Hallo", "Guten Morgen", "Guten Tag", "Guten Abend"],
    en: ["Hello", "Good morning", "Good afternoon", "Good evening"],
    es: ["Hola", "Buenos días", "Buenas tardes", "Buenas noches"],
    fr: ["Bonjour", "Bonjour", "Bon après-midi", "Bonsoir"],
    nl: ["Hallo", "Goedemorgen", "Goedemiddag", "Goedenavond"]
  }, y = f[m] ?? f.en, u = d >= 18 ? y[3] : d >= 12 ? y[2] : d >= 5 ? y[1] : y[0], g = e.config.name || `${u}, ${e.hass.user?.name || "Home"}!`;
  return e.actionSurface(`ulm-scenes ${a ? "welcome-scenes" : "scene-pills"} ${e.descriptor.upstreamId === "card_scenes" ? "ulm-source-scenes" : ""}`, s`
    ${a ? s`
      <div class="welcome-toolbar">
        <button class="welcome-toolbar-button" aria-label="Toggle scenes" @pointerdown=${(v) => v.stopPropagation()} @click=${(v) => {
    v.stopPropagation(), e.config.collapse_entity && e.service("input_boolean", "toggle", { entity_id: e.config.collapse_entity });
  }}><ha-icon .icon=${o ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon></button>
        <span class="welcome-date"><ha-icon .icon=${l}></ha-icon>${new Intl.DateTimeFormat(e.hass.language, { month: "short", day: "numeric" }).format(/* @__PURE__ */ new Date())}</span>
        <button class="welcome-toolbar-button" aria-label="Open dashboard settings" @pointerdown=${(v) => v.stopPropagation()} @click=${(v) => q(v, e, { action: "navigate", navigation_path: String(e.config.settings_path || "/config/dashboard") })}><ha-icon icon="mdi:cog-outline"></ha-icon></button>
      </div>
      <div class="welcome-heading"><b>${g}</b></div>
      ${o ? p : s`<div class="welcome-scenes-heading"><b>${e.config.secondary || "Scenes"}</b><ha-icon icon="mdi:dots-vertical"></ha-icon></div>`}
    ` : p}
    ${o ? p : s`<div class="scene-grid">${t.map((v) => {
    const V = e.hass.states[v.entity], E = V?.state === (v.active_state || v.state || "on") || V?.state === "playing", z = B(v.color, "rgb(var(--ulm-purple))");
    return s`
      <button @pointerdown=${(D) => D.stopPropagation()} @click=${(D) => {
      D.stopPropagation(), nr(D, e, v);
    }} style=${`--item-color:${z}`} class="scene-button ${E ? "is-active" : ""}">
        <i><ha-icon .icon=${v.icon || V?.attributes.icon || "mdi:palette"}></ha-icon></i>
        <span>${v.name || v.label || j({ entity: v.entity }, V)}</span>
      </button>`;
  })}</div>`}
  `);
}, yt = (e) => {
  const t = c(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : h(e.entity, "entity_picture"), r = (e.config.console_platform || e.config.variant) === "xbox" ? "mdi:microsoft-xbox" : "mdi:sony-playstation", o = c(e, "ulm_card_media_player_player_controls_entity") || e.config.entity, n = o ? e.hass.states[o] : e.entity, i = o?.startsWith("media_player.") === !0, l = c(e, "ulm_card_media_player_collapsible") === !0 && (["off", "standby"].includes(e.entity?.state ?? "") || c(e, "ulm_card_media_player_idle_off") === !0 && e.entity?.state === "idle"), d = !l && (e.config.show_controls === !0 || c(e, "ulm_card_media_player_enable_controls") === !0), m = c(e, "ulm_card_media_player_enable_volume_adjust") || (h(n, "device_class") === "speaker" ? 0.05 : h(n, "device_class") === "tv" ? 0.01 : 0.025), f = Number(h(n, "volume_level") ?? 0), y = { action: "more-info" };
  return e.actionSurface(`ulm-media ${t ? "has-art" : ""} ${l ? "is-collapsed" : ""}`, s`
    ${t ? s`<span class="media-art" style=${`background-image:url("${String(t)}")`}></span>` : p}
    <div class="media-summary">
      ${x(e, e.descriptor.upstreamId === "custom_card_playstation" ? r : "mdi:speaker", O.has(e.entity?.state ?? "") ? "blue" : "grey")}
      ${P(e, c(e, "ulm_card_media_player_more_info") === !0 ? [h(e.entity, "media_artist"), h(e.entity, "media_album_name")].filter(Boolean).join(" · ") || b(e.entity) : String(h(e.entity, "media_album_name") ?? h(e.entity, "media_artist") ?? b(e.entity)))}
    </div>
    ${c(e, "ulm_card_media_player_power_button") === !0 ? s`
      <div class="media-power">${k("Toggle power", "mdi:power", (u) => {
    u.stopPropagation(), e.service("homeassistant", "toggle", { entity_id: e.config.entity });
  })}</div>
    ` : p}
    ${i && d ? s`<div class="ulm-controls media-controls">
      ${k("Previous", "mdi:skip-previous", (u) => {
    u.stopPropagation(), e.service("media_player", "media_previous_track", { entity_id: o });
  })}
      ${k(e.entity?.state === "playing" ? "Pause" : "Play", e.entity?.state === "playing" ? "mdi:pause" : "mdi:play", (u) => {
    u.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: o });
  })}
      ${k("Next", "mdi:skip-next", (u) => {
    u.stopPropagation(), e.service("media_player", "media_next_track", { entity_id: o });
  })}
      ${k("Sources", "mdi:playlist-music", (u) => q(u, e, y, o))}
    </div>` : p}
    ${i && !l && c(e, "ulm_card_media_player_enable_volume_slider") === !0 ? s`
      <input class="ulm-slider" type="range" min="0" max="100"
        aria-label="Volume"
        .value=${String(Math.round(f * 100))}
        @pointerdown=${(u) => u.stopPropagation()}
        @change=${(u) => e.service("media_player", "volume_set", {
    entity_id: o,
    volume_level: Number(u.target.value) / 100
  })}>
    ` : p}
    ${i && !l && c(e, "ulm_card_media_player_enable_volume_buttons") === !0 ? s`
      <div class="ulm-controls media-volume-buttons">
        ${k("Mute or unmute", "mdi:volume-mute", (u) => {
    u.stopPropagation(), e.service("media_player", "volume_mute", {
      entity_id: o,
      is_volume_muted: h(n, "is_volume_muted") !== !0
    });
  })}
        ${k("Volume down", "mdi:volume-minus", (u) => {
    u.stopPropagation(), e.service("media_player", "volume_set", {
      entity_id: o,
      volume_level: Math.max(0, f - m)
    });
  })}
        ${k("Volume up", "mdi:volume-plus", (u) => {
    u.stopPropagation(), e.service("media_player", "volume_set", {
      entity_id: o,
      volume_level: Math.min(1, f + m)
    });
  })}
      </div>
    ` : p}
  `);
}, sr = (e) => {
  const t = e.config.entity?.startsWith("cover.") === !0, a = t && qt(e, "show_controls", "ulm_card_cover_enable_controls"), r = t && c(e, "ulm_card_cover_enable_slider") === !0, o = t && c(e, "ulm_card_cover_enable_tilt") === !0, n = c(e, "ulm_card_cover_enable_horizontal") === !0, i = c(e, "ulm_card_cover_invert_percent", "ulm_card_invert_percent") === !0, l = w(h(e.entity, "current_position")), d = l === void 0 ? void 0 : i ? 100 - l : l, m = i ? l !== 100 : e.entity?.state !== "closed", f = B(c(e, "ulm_card_cover_color"), "rgba(var(--color-blue, 3, 169, 244), 1)"), y = c(e, "ulm_card_cover_force_background_color") === !0 && m, u = String(h(e.entity, "device_class") ?? ""), g = {
    awning: "mdi:window-open",
    blind: "mdi:blinds-open",
    curtain: "mdi:curtains",
    damper: "mdi:circle-outline",
    door: "mdi:door-open",
    garage: c(e, "ulm_card_cover_garage_large") ? "mdi:garage-open-variant" : "mdi:garage-open",
    gate: "mdi:gate-open",
    shade: "mdi:roller-shade",
    shutter: "mdi:window-shutter-open",
    window: "mdi:window-open"
  }, v = {
    awning: "mdi:window-closed",
    blind: "mdi:blinds",
    curtain: "mdi:curtains-closed",
    damper: "mdi:circle-slice-8",
    door: "mdi:door-closed",
    garage: c(e, "ulm_card_cover_garage_large") ? "mdi:garage-variant" : "mdi:garage",
    gate: "mdi:gate",
    shade: "mdi:roller-shade-closed",
    shutter: "mdi:window-shutter",
    window: "mdi:window-closed"
  }, V = c(e, "ulm_card_cover_icon"), E = typeof V == "string" ? V : (m ? g[u] : v[u]) || String(h(e.entity, "icon") ?? "mdi:help-circle"), D = c(e, "ulm_card_cover_show_last_changed") === !0 && e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : d !== void 0 && !["unknown", "unavailable", "closed"].includes(e.entity?.state ?? "") ? `${b(e.entity)} · ${d}%` : b(e.entity), N = c(e, "ulm_card_cover_display_left_right") === !0, H = N ? "mdi:arrow-left" : ["curtain", "gate", "awning"].includes(u) ? "mdi:arrow-collapse-horizontal" : "mdi:arrow-down", ee = N ? "mdi:arrow-right" : ["curtain", "gate", "awning"].includes(u) ? "mdi:arrow-expand-horizontal" : "mdi:arrow-up", W = w(c(e, "ulm_card_cover_favorite_percentage"));
  return e.actionSurface(`ulm-cover ${n ? "is-horizontal" : ""} ${y ? "is-source-background" : ""}`, s`
  <div class="ulm-row">
    ${fe(e, E, f, m)}
    ${P(e, D)}
  </div>
  ${a ? s`<div class="ulm-controls cover-controls">
    ${k("Close", H, (T) => {
    T.stopPropagation(), e.service("cover", "close_cover", { entity_id: e.config.entity });
  })}
    ${k("Stop", "mdi:stop", (T) => {
    T.stopPropagation(), e.service("cover", "stop_cover", { entity_id: e.config.entity });
  })}
    ${k("Open", ee, (T) => {
    T.stopPropagation(), e.service("cover", "open_cover", { entity_id: e.config.entity });
  })}
    ${W !== void 0 ? k(`Move to ${W}%`, "mdi:star", (T) => {
    T.stopPropagation(), e.service("cover", "set_cover_position", { entity_id: e.config.entity, position: W });
  }) : p}
  </div>` : p}
  ${r ? s`
    <div class="ulm-cover-slider" style=${`--cover-level:${l ?? 0}%`}>
    <i></i><input type="range" aria-label="Cover position"
      min=${String(c(e, "ulm_card_cover_slider_min") ?? 0)}
      max=${String(c(e, "ulm_card_cover_slider_max") ?? 100)}
      .value=${String(l ?? 0)}
      @pointerdown=${(T) => T.stopPropagation()}
      @click=${(T) => T.stopPropagation()}
      @change=${(T) => e.service("cover", "set_cover_position", {
    entity_id: e.config.entity,
    position: Number(T.target.value)
  })}>
    </div>
  ` : p}
  ${o ? s`<div class="ulm-controls cover-controls cover-tilt-controls">
    ${k("Close tilt", "mdi:arrow-bottom-left", (T) => {
    T.stopPropagation(), e.service("cover", "close_cover_tilt", { entity_id: e.config.entity });
  })}
    ${k("Stop tilt", "mdi:stop", (T) => {
    T.stopPropagation(), e.service("cover", "stop_cover_tilt", { entity_id: e.config.entity });
  })}
    ${k("Open tilt", "mdi:arrow-top-right", (T) => {
    T.stopPropagation(), e.service("cover", "open_cover_tilt", { entity_id: e.config.entity });
  })}
  </div>` : p}
  `);
}, lr = (e) => e.actionSurface("ulm-vacuum", s`
  ${x(e, "mdi:robot-vacuum", e.entity?.state === "cleaning" ? "blue" : "grey")}
  ${P(e, b(e.entity))}
  <span class="metric-pill"><ha-icon icon="mdi:battery"></ha-icon>${String(h(e.entity, "battery_level") ?? "—")}%</span>
  ${e.config.show_controls !== !1 ? s`<div class="ulm-controls">
    ${k("Start", "mdi:play", (t) => {
  t.stopPropagation(), e.service("vacuum", "start", { entity_id: e.config.entity });
})}
    ${k("Pause", "mdi:pause", (t) => {
  t.stopPropagation(), e.service("vacuum", "pause", { entity_id: e.config.entity });
})}
    ${k("Return home", "mdi:home-map-marker", (t) => {
  t.stopPropagation(), e.service("vacuum", "return_to_base", { entity_id: e.config.entity });
})}
  </div>` : p}
`), cr = (e) => {
  const t = e.entity?.state.toLowerCase() ?? "unknown", a = ["cleaning", "mopping", "mowing"].includes(t), r = c(e, "ulm_card_vacuum_color") || ({ cleaning: "blue", mowing: "blue", paused: "green", mopping: "yellow", returning: "purple", error: "red" }[t] ?? "grey"), o = c(e, "ulm_card_vacuum_room"), n = A(e, "ulm_card_vacuum_camera"), i = n && (c(e, "ulm_card_vacuum_camera_toggle") !== !0 || a);
  return e.actionSurface(`ulm-default-vacuum ${c(e, "ulm_card_vacuum_force_background_color") && O.has(t) ? `force-background tone-${r}` : ""}`, s`
    <div class="vacuum-summary">
      ${x(e, "mdi:robot-vacuum", r, "vacuum-icon")}
      ${P(e, c(e, "ulm_card_vacuum_label") || b(e.entity))}
    </div>
    ${i && h(n, "entity_picture") ? s`<img class="vacuum-map" src=${String(h(n, "entity_picture"))} alt="Vacuum map">` : p}
    ${e.config.show_controls !== !1 ? s`<div class="vacuum-actions">
      ${k(a ? "Stop" : "Start", a ? "mdi:stop" : "mdi:play", (l) => {
    l.stopPropagation(), e.service("vacuum", a ? "stop" : "start", { entity_id: e.config.entity });
  })}
      ${k("Return home", "mdi:home-map-marker", (l) => {
    l.stopPropagation(), e.service("vacuum", "return_to_base", { entity_id: e.config.entity });
  })}
      ${k("Locate", "mdi:map-marker", (l) => {
    l.stopPropagation(), e.service("vacuum", "locate", { entity_id: e.config.entity });
  })}
      ${o ? k("Clean room", c(e, "ulm_card_vacuum_room_icon") || "mdi:floor-plan", (l) => {
    l.stopPropagation(), e.service("script", "turn_on", { entity_id: o });
  }) : p}
    </div>` : p}
  `);
}, dr = (e) => {
  const t = e.entity?.state.startsWith("armed") || e.entity?.state === "locked";
  return e.actionSurface(`ulm-security ${t ? "is-armed" : ""}`, s`
    ${x(e, t ? "mdi:shield-lock" : "mdi:shield-off", t ? "green" : "red")}
    ${P(e, b(e.entity))}
    ${e.config.show_controls ? s`<span class="security-status">${t ? "Secured" : "Attention"}</span>` : p}
  `);
}, ur = (e) => e.actionSurface("ulm-navigation", s`
  ${x(e, e.descriptor.upstreamId.includes("back") ? "mdi:arrow-left" : "mdi:arrow-right", "blue")}
  ${P(e, e.config.secondary || e.config.navigation_path || "Navigate")}
  <ha-icon icon="mdi:chevron-right"></ha-icon>
`), _r = (e) => e.actionSurface("ulm-default-navigation", s`
  ${x(e, e.config.icon || "mdi:navigation", "blue")}
  <span class="navigation-label">${e.config.name || "Navigate"}</span>
`), mr = (e, t) => {
  const a = e?.split(".", 1)[0] ?? "homeassistant";
  return a === "script" ? ["script", t === "on" ? "turn_on" : "turn_off"] : a === "fan" ? ["fan", t === "on" ? "turn_on" : "turn_off"] : a === "water_heater" ? ["water_heater", t === "on" ? "turn_on" : "turn_off"] : [a === "input_boolean" ? "input_boolean" : "homeassistant", t === "on" ? "turn_on" : "turn_off"];
}, pr = (e) => {
  const t = c(
    e,
    "ulm_custom_card_washer_power",
    "ulm_card_power_outlet_entity",
    "ulm_card_power_entity"
  ), a = e.config.entity?.split(".", 1)[0], r = t || (["switch", "input_boolean", "light", "fan", "script", "water_heater"].includes(a ?? "") ? e.config.entity : void 0), o = r ? e.hass.states[r] : void 0, n = O.has(o?.state ?? e.entity?.state ?? ""), i = A(e, "graph_entity"), [l, d] = mr(r, n ? "off" : "on");
  return e.actionSurface(`ulm-control-card ulm-row ${n ? "is-active" : ""}`, s`
    ${x(e, e.config.entity?.startsWith("fan.") ? "mdi:fan" : "mdi:power-socket-eu", n ? "yellow" : "grey")}
    ${P(e, i ? `${b(e.entity)} · ${b(i)}` : b(e.entity))}
    ${r && e.config.show_controls !== !1 ? k(n ? "Turn off" : "Turn on", "mdi:power", (m) => {
    m.stopPropagation(), e.service(l, d, { entity_id: r });
  }) : p}
  `);
}, hr = (e) => {
  const t = O.has(e.entity?.state ?? ""), a = e.config.consumption_entity || e.config.graph_entity || c(e, "ulm_card_power_outlet_consumption_sensor"), r = a ? e.hass.states[a] : void 0, o = B(
    c(e, "ulm_card_power_outlet_color"),
    "rgb(var(--ulm-yellow))"
  ), n = c(e, "ulm_card_power_outlet_force_background_color") === !0 && t, i = t && r ? `${b(e.entity)} • ${b(r)}` : b(e.entity);
  return e.actionSurface(
    `ulm-row ulm-power-outlet ulm-source-power-outlet ${t ? "is-active" : ""} ${n ? "force-background" : ""}`,
    s`
      <span class="ulm-icon power-outlet-icon" style=${`--outlet-color:${o}`}>
        <ha-icon .icon=${Ft(e, "mdi:power-socket-eu")}></ha-icon>
      </span>
      ${P(e, i)}
    `
  );
}, br = (e) => {
  const t = c(e, "ulm_card_script_title") || e.config.name || j(e.config, e.entity), a = c(e, "ulm_card_script_icon") || e.config.icon || e.entity?.attributes.icon || "mdi:script-text";
  return e.actionSurface("ulm-row ulm-script ulm-source-script", s`
    <span class="ulm-icon tone-blue"><ha-icon .icon=${a}></ha-icon></span>
    <span class="script-title">${t}</span>
  `);
}, gr = (e) => {
  const t = e.entity?.state === "on", a = w(h(e.entity, "percentage")) ?? 0, r = c(e, "ulm_card_fan_enable_slider") === !0, o = c(e, "ulm_card_fan_enable_button") === !0, n = c(e, "ulm_card_fan_enable_collapse") === !0 && !t, i = c(e, "ulm_card_fan_enable_horizontal") === !0, l = B(c(e, "ulm_card_fan_color"), "rgba(var(--color-blue, 3, 169, 244), 1)"), d = c(e, "ulm_card_fan_force_background_color") === !0 && t, m = c(e, "ulm_card_fan_temp_attribute"), f = c(e, "ulm_card_fan_hum_attribute"), y = typeof m == "string" ? w(h(e.entity, m)) : void 0, u = typeof f == "string" ? w(h(e.entity, f)) : void 0, g = e.entity?.state === "unavailable" ? b(e.entity) : `${t ? h(e.entity, "percentage") === void 0 ? "on" : `${a}%` : "off"}${y !== void 0 ? ` · ${Math.round(y)}°C` : ""}${u !== void 0 ? ` · ${Math.round(u)}%` : ""}`, v = c(e, "ulm_card_fan_oscillate_attribute") ?? "oscillating", V = h(e.entity, v) === !0, [E, z] = (c(e, "ulm_card_fan_button_service") ?? "fan.oscillate").split(".", 2);
  return e.actionSurface(`ulm-control-card ulm-fan ${t ? "is-active" : ""} ${n ? "is-collapsed" : ""} ${i ? "is-horizontal" : ""} ${d ? "is-source-background" : ""}`, s`
    <div class="ulm-row">
     ${fe(e, c(e, "ulm_card_fan_icon") || String(h(e.entity, "icon") ?? "mdi:fan"), l, t)}
     ${P(e, g)}
    </div>
    ${r && !n ? s`<div class="ulm-fan-controls"><div class="ulm-fan-slider" style=${`--fan-level:${a}%;--source-color:${l}`}>
     <i></i>
     <input type="range" aria-label="Fan speed"
       min=${String(c(e, "ulm_card_fan_slider_min") ?? 0)}
       max=${String(c(e, "ulm_card_fan_slider_max") ?? 100)}
       .value=${String(a)}
       @pointerdown=${(D) => D.stopPropagation()}
       @click=${(D) => D.stopPropagation()}
       @change=${(D) => e.service("fan", "set_percentage", {
    entity_id: e.config.entity,
    percentage: Number(D.target.value)
  })}>
    </div>
    ${o ? s`<div class="ulm-controls">${k("Toggle oscillation", c(e, "ulm_card_fan_button_icon") ?? "mdi:rotate-3d-variant", (D) => {
    D.stopPropagation(), e.service(E || "fan", z || "oscillate", { entity_id: e.config.entity, oscillating: !V });
  })}</div>` : p}</div>` : p}
  `);
}, _e = /* @__PURE__ */ new WeakMap(), $e = /* @__PURE__ */ new WeakSet(), ft = (e, t, a, r) => {
  const o = r === "tap" ? a.tap_action ?? { action: "toggle" } : a.hold_action ?? { action: "more-info" };
  ne(e, "hass-action", {
    config: { type: t.config.type, entity: a.entity, tap_action: o },
    action: "tap"
  });
}, yr = (e) => {
  const t = (e.config.room_sensors?.length ? e.config.room_sensors : (e.config.entities ?? []).map((l) => ({ entity: l }))).filter((l) => l.entity).slice(0, 4), a = e.config.label_use_temperature ?? c(e, "label_use_temperature") ?? !0, r = e.config.label_use_brightness ?? c(e, "label_use_brightness") ?? !1, o = w(h(e.entity, "brightness")), n = h(e.entity, "current_temperature") ?? h(e.entity, "temperature") ?? h(e.entity, "device_temperature") ?? e.entity?.state ?? "—", i = a ? `${String(n)}${String(h(e.entity, "unit_of_measurement") ?? "°C")}` : r && e.entity?.state === "on" && o !== void 0 ? `${Math.round(o / 2.55)}%` : b(e.entity);
  return e.actionSurface(`ulm-room ulm-source-room ${e.entity?.state === "unavailable" ? "is-unavailable" : ""}`, s`
    <div class="room-main">
      <span class="room-copy">
        <b>${j(e.config, e.entity)}</b>
        <span>${i}</span>
      </span>
      <span class="ulm-icon tone-blue"><ha-icon .icon=${e.config.icon || "mdi:sofa-single"}></ha-icon></span>
      ${e.entity?.state === "unavailable" ? s`<span class="room-unavailable"><ha-icon icon="mdi:exclamation"></ha-icon></span>` : p}
    </div>
    ${t.length ? s`<div class="room-entities">${t.map((l) => {
    const d = e.hass.states[l.entity], m = d?.state === (l.active_state || "on"), f = B(l.color, "rgb(var(--ulm-blue))");
    return s`<button
        class="metric-pill room-sensor ${m ? "is-active" : ""}"
        style=${`--item-color:${f}`}
        aria-label=${l.name || l.label || j({ entity: l.entity }, d)}
        @pointerdown=${(y) => {
      y.stopPropagation();
      const u = y.currentTarget;
      $e.delete(u), _e.set(u, window.setTimeout(() => {
        $e.add(u), ft(u, e, l, "hold");
      }, 500));
    }}
        @pointerup=${(y) => {
      y.stopPropagation();
      const u = y.currentTarget, g = _e.get(u);
      g && window.clearTimeout(g), _e.delete(u);
    }}
        @pointercancel=${(y) => {
      const u = y.currentTarget, g = _e.get(u);
      g && window.clearTimeout(g), _e.delete(u);
    }}
        @click=${(y) => {
      const u = y.currentTarget;
      if ($e.has(u)) {
        $e.delete(u), y.stopPropagation();
        return;
      }
      y.stopPropagation(), ft(u, e, l, "tap");
    }}
      ><ha-icon .icon=${l.icon || d?.attributes.icon || "mdi:circle-small"}></ha-icon><span>${l.name || l.label || b(d)}</span></button>`;
  })}</div>` : p}
  `);
}, fr = (e) => {
  const t = h(e.entity, "entity_picture") || (e.entity?.entity_id.startsWith("camera.") ? `/api/camera_proxy/${e.entity.entity_id}` : void 0), a = c(e, "ulm_custom_card_camera_title") === !0, r = c(e, "ulm_custom_card_camera_name") || j(e.config, e.entity), o = c(e, "ulm_custom_card_camera_label") || b(e.entity), n = c(e, "ulm_custom_card_camera_aspect_ratio");
  return e.actionSurface(`ulm-camera ${a ? "has-title" : "image-only"}`, s`
    ${a ? s`<div class="camera-title">
      ${x(e, e.config.icon || "mdi:camera", "blue")}
      <span class="ulm-copy"><b class="ulm-name">${r}</b><span class="ulm-label">${o}</span></span>
    </div>` : p}
    ${t ? s`<img src=${String(t)} alt=${r} style=${n ? `aspect-ratio:${n}` : ""}>` : s`
      <div class="camera-placeholder">${x(e, "mdi:camera", "blue")}</div>
    `}
  `);
}, U = (e) => {
  const t = Object.entries(e.config).filter(([a, r]) => typeof r == "string" && r !== e.config.entity && /(_entity|_entity_id|_sensor|_power|_status|_level|_date|_time)$/i.test(a)).map(([, a]) => a);
  return [.../* @__PURE__ */ new Set([...e.config.entities ?? [], ...t])].map((a) => e.hass.states[a]).filter((a) => !!a).slice(0, 6);
}, vr = (e, t, a = "blue") => {
  const r = U(e);
  return e.actionSurface("ulm-detail-card", s`
    <div class="ulm-row">
      ${x(e, t, a)}
      ${P(e, b(e.entity))}
    </div>
    ${r.length ? s`<div class="detail-grid">${r.map((o) => s`
      <span class="metric-pill"><ha-icon .icon=${o.attributes.icon ?? "mdi:circle-small"}></ha-icon>${b(o)}</span>
    `)}</div>` : p}
  `);
}, wr = (e) => {
  const t = U(e);
  return e.actionSurface("ulm-schedule-card", s`
    <div class="ulm-row">
      ${x(e, /pollen/.test(e.descriptor.upstreamId) ? "mdi:flower-pollen" : "mdi:trash-can", "green")}
      ${P(e, b(e.entity))}
    </div>
    <div class="schedule-list">${(t.length ? t : e.entity ? [e.entity] : []).slice(0, 4).map((a) => s`
      <span><b>${j({ entity: a.entity_id }, a)}</b><small>${b(a)}</small></span>
    `)}</div>
  `);
}, $r = (e) => {
  const t = w(e.entity?.state), a = U(e);
  return e.actionSurface("ulm-device-status", s`
    <div class="ulm-row">
      ${x(e, /printer/.test(e.descriptor.upstreamId) ? "mdi:printer" : /nas/.test(e.descriptor.upstreamId) ? "mdi:nas" : /washer/.test(e.descriptor.upstreamId) ? "mdi:washing-machine" : "mdi:devices", t !== void 0 && t < 20 ? "red" : "blue")}
      ${P(e, b(e.entity))}
      ${t !== void 0 ? s`<b class="device-value">${Math.round(t)}${String(e.entity?.attributes.unit_of_measurement ?? "")}</b>` : p}
    </div>
    ${t !== void 0 ? s`<span class="device-progress"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>` : p}
    ${a.length ? s`<div class="detail-grid">${a.map((r) => s`<span class="metric-pill">${b(r)}</span>`)}</div>` : p}
  `);
}, kr = (e) => {
  const t = w(e.entity?.state) ?? 0, a = c(e, "ulm_card_gauge_min", "ulm_custom_card_mpse_gauge_min") ?? 0, r = c(e, "ulm_card_gauge_max", "ulm_custom_card_mpse_gauge_max") ?? 100, o = Math.max(0, Math.min(100, (t - a) / Math.max(1, r - a) * 100));
  return e.actionSurface("ulm-gauge-card", s`
    <span class="gauge-ring" style=${`--gauge:${o * 3.6}deg`}><b>${b(e.entity)}</b></span>
    ${P(e, `${a} – ${r}`)}
  `);
}, Vr = (e) => {
  const t = A(e, "datetime_entity");
  return e.actionSurface(`ulm-control-card ulm-row ${O.has(e.entity?.state ?? "") ? "is-active" : ""}`, s`
    ${x(e, "mdi:alarm", O.has(e.entity?.state ?? "") ? "yellow" : "grey")}
    ${P(e, b(t || e.entity))}
    ${e.config.show_controls !== !1 ? k(O.has(e.entity?.state ?? "") ? "Disable alarm" : "Enable alarm", "mdi:power", (a) => {
    a.stopPropagation(), e.service("input_boolean", O.has(e.entity?.state ?? "") ? "turn_off" : "turn_on", { entity_id: e.config.entity });
  }) : p}
  `);
}, xr = (e) => {
  const t = A(e, "lock_entity"), a = A(e, "battery_entity"), r = t?.state === "locked";
  return e.actionSurface("ulm-row ulm-door", s`
    ${x(e, r ? "mdi:door-closed-lock" : "mdi:door-open", r ? "green" : "red")}
    ${P(e, [b(e.entity), t ? b(t) : "", a ? b(a) : ""].filter(Boolean).join(" · "))}
    ${t && e.config.show_controls !== !1 ? k(r ? "Unlock" : "Lock", r ? "mdi:lock-open" : "mdi:lock", (o) => {
    o.stopPropagation(), e.service("lock", r ? "unlock" : "lock", { entity_id: e.config.lock_entity });
  }) : p}
  `);
}, $ = (e, ...t) => {
  const a = c(e, ...t), r = typeof a == "string" ? a : a && typeof a == "object" && "entity_id" in a && typeof a.entity_id == "string" ? a.entity_id : void 0;
  return r ? e.hass.states[r] : void 0;
}, Ir = (e) => {
  const t = J(e.config).filter((l) => l.enabled !== !1 && l.entity), a = /* @__PURE__ */ new Set([
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
  ]), r = (l, d) => {
    if (d !== !0 || !l) return;
    const m = e.hass.states[l]?.state?.trim();
    if (!m || a.has(m.toLowerCase())) return;
    const f = m.replaceAll("_", " ").replace(/\s+/g, " ");
    return f.charAt(0).toLocaleUpperCase(e.hass.language) + f.slice(1);
  }, o = r(e.config.today_entity, e.config.show_today), n = r(e.config.tomorrow_entity, e.config.show_tomorrow), i = (l) => {
    if (!l || ["unknown", "unavailable", "none", "geen"].includes(l.state.toLowerCase())) return "—";
    if (l.entity_id.startsWith("calendar.")) {
      const d = h(l, "start_time") ?? h(l, "start") ?? h(l, "end_time");
      if (typeof d == "string") {
        const m = new Date(d);
        if (!Number.isNaN(m.getTime()))
          return new Intl.DateTimeFormat(e.hass.language, { day: "2-digit", month: "2-digit", year: "numeric" }).format(m);
      }
    }
    return l.state;
  };
  return e.actionSurface("custom-waste-card", s`
    <div class="custom-card-heading">
      ${x(e, "mdi:trash-can-outline", "green")}
      <span class="ulm-copy">
        <span class="ulm-name">${e.config.name || c(e, "ulm_volgende_ophaling") || "Next collections"}</span>
        ${o || n ? s`
          <span class="ulm-label waste-summary">
            ${o ? s`<span>Today: ${o}</span>` : p}
            ${n ? s`<span>Tomorrow: ${n}</span>` : p}
          </span>
        ` : p}
      </span>
    </div>
    <div class="waste-grid">${t.map((l) => {
    const d = l.entity ? e.hass.states[l.entity] : void 0;
    return s`<span class="waste-row" style=${`--waste-color:${l.color || "#43a047"}`}>
        <ha-icon .icon=${l.icon || "mdi:trash-can"}></ha-icon>
        <b>${l.label || d?.attributes.friendly_name || l.entity}</b>
        <small>${i(d)}</small>
      </span>`;
  })}</div>
  `);
}, Sr = (e) => {
  const t = $(e, "ulm_card_alarm_time_datetime") ?? A(e, "datetime_entity"), a = w(c(e, "ulm_card_alarm_time_step")) ?? 15, r = t?.state || "00:00:00", [o, n] = r.split(":").map(Number), i = (m) => {
    const f = ((o || 0) * 60 + (n || 0) + m + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: t?.entity_id,
      time: `${String(Math.floor(f / 60)).padStart(2, "0")}:${String(f % 60).padStart(2, "0")}:00`
    });
  }, l = !t || ["unknown", "unavailable"].includes(t.state.toLowerCase()), d = c(e, "ulm_card_alarm_time_collapse") === !0 && !O.has(e.entity?.state ?? "");
  return e.actionSurface(`custom-alarm-time ${c(e, "ulm_card_alarm_time_horizontal") ? "is-horizontal" : ""}`, s`
    <div class="custom-card-heading">
      ${x(e, c(e, "ulm_card_alarm_time_icon") || "mdi:alarm", "grey")}
      ${P(e, b(e.entity))}
    </div>
    ${d ? p : s`<div class="alarm-time-controls">
      ${k(`Earlier by ${a} minutes`, "mdi:minus", (m) => {
    m.stopPropagation(), i(-a);
  }, l)}
      <b>${r.slice(0, 5)}</b>
      ${k(`Later by ${a} minutes`, "mdi:plus", (m) => {
    m.stopPropagation(), i(a);
  }, l)}
    </div>`}
  `);
}, Pr = (e) => {
  const t = [e.entity, ...U(e)].filter((r) => !!r).slice(0, 3), a = ["green", "red", "orange"];
  return e.actionSurface("custom-apexcharts", s`
    <div class="apex-legend">${t.map((r, o) => s`
      <span class="apex-series tone-${a[o]}">
        <i><ha-icon .icon=${r.attributes.icon || ["mdi:download", "mdi:lan-pending", "mdi:upload"][o]}></ha-icon></i>
        <b>${j({ entity: r.entity_id }, r)}</b>
        <small>${b(r)}</small>
      </span>
    `)}</div>
    <div class="apex-chart">${t.map((r, o) => s`<span class="apex-line tone-${a[o]}">${ve(e, !1, r)}</span>`)}
      <span class="apex-grid-line line-1"></span><span class="apex-grid-line line-2"></span><span class="apex-grid-line line-3"></span>
    </div>
  `);
}, Ar = (e) => {
  const t = !e.entity || e.entity.state === "unavailable", a = e.entity?.state === "playing";
  return e.actionSurface("custom-chromecast", s`
    <div class="custom-card-heading">
      ${x(e, "mdi:cast", t ? "grey" : "blue")}
      ${P(e, b(e.entity))}
    </div>
    <div class="chromecast-controls">
      ${k("Toggle power", "mdi:power", (r) => {
    r.stopPropagation(), e.service("media_player", "toggle", { entity_id: e.config.entity });
  }, t)}
      ${k("Play or pause", a ? "mdi:pause" : "mdi:play", (r) => {
    r.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: e.config.entity });
  }, t)}
      ${k("Toggle input", "mdi:video-input-hdmi", (r) => {
    r.stopPropagation(), e.service("media_player", "toggle", { entity_id: e.config.entity });
  }, t)}
    </div>
  `);
}, zr = (e) => {
  const t = w(c(e, "ulm_card_power_details_hours")) ?? e.config.graph_hours ?? 2, a = w(c(e, "ulm_card_power_details_height")) ?? 180, r = $(e, "ulm_card_power_details_entity") ?? e.entity;
  return e.actionSurface("custom-power-details", s`
    <div class="power-details-content" style=${`min-height:${a + 66}px`}>
      <div class="power-details-heading">
        ${x(e, "mdi:flash", "grey")}
        ${P(e, `${t === 1 ? "In the last hour" : `In the last ${t} hours`}`)}
      </div>
      <b class="power-details-value">${b(r)}</b>
      <div class="power-details-chart" style=${`height:${a}px`}>${ve(e, !0, r)}</div>
    </div>
  `);
}, vt = (e, t) => e === "bluetooth" ? t ? "mdi:bluetooth" : "mdi:bluetooth-off" : e === "lan" || e === "wifi" ? t ? "mdi:lan-connect" : "mdi:lan-disconnect" : t ? "mdi:home-variant" : "mdi:home-minus", jr = (e) => {
  const t = $(e, "ulm_custom_card_device_tracker_tracker_1_entity") ?? e.entity, a = $(e, "ulm_custom_card_device_tracker_tracker_2_entity");
  return e.actionSurface("custom-device-tracker", s`
    <span class="device-tracker-icon">
      <ha-icon .icon=${c(e, "ulm_custom_card_device_tracker_icon") || "mdi:cellphone"}></ha-icon>
      ${t ? s`<i class="tracker-badge tracker-one ${t.state === "home" ? "is-home" : "is-away"}" title=${b(t)}><ha-icon .icon=${vt(c(e, "ulm_custom_card_device_tracker_tracker_1_type"), t.state === "home")}></ha-icon></i>` : p}
      ${a ? s`<i class="tracker-badge tracker-two ${a.state === "home" ? "is-home" : "is-away"}" title=${b(a)}><ha-icon .icon=${vt(c(e, "ulm_custom_card_device_tracker_tracker_2_type"), a.state === "home")}></ha-icon></i>` : p}
    </span>
    <span class="ulm-copy"><b class="ulm-name">${j(e.config, e.entity)}</b><span class="ulm-label">${e.entity?.state === "home" ? "Present" : e.entity?.state === "not_home" ? "Away" : b(e.entity)}</span></span>
  `);
}, Me = (e, t) => {
  const a = h(t, "entity_id");
  return Array.isArray(a) ? a.map(String).map((r) => e.hass.states[r]).filter((r) => !!r) : t ? [t] : [];
}, Dr = (e) => {
  const t = (u) => $(e, u), a = t("temperature"), r = t("humidity"), o = {
    doors: t("group_doors"),
    windows: t("group_windows"),
    motions: t("group_motions"),
    water: t("group_water"),
    lights: t("group_lights"),
    shutters: t("group_windows_shutters"),
    outlets: t("group_outlets"),
    tv: t("group_tv")
  }, n = Object.values(o).flatMap((u) => Me(e, u)).filter((u) => (w(h(u, "battery")) ?? 101) <= 20), i = Object.values(o).flatMap((u) => Me(e, u)).filter((u) => u.state === "unavailable"), l = (u) => Me(e, u).filter((g) => g.state === "on" || g.state === "open").length, d = (u, g) => {
    g && q(u, e, { action: "more-info" }, g.entity_id);
  }, m = (u, g) => {
    g && g.state !== "unavailable" && q(u, e, { action: "toggle" }, g.entity_id);
  }, f = [
    [o.doors, "mdi:door-open"],
    [o.windows, "mdi:window-open-variant"],
    [o.motions, "mdi:motion-sensor"],
    [o.water, "mdi:water"]
  ], y = [
    [o.lights, o.lights?.state === "on" ? "mdi:lightbulb-group" : "mdi:lightbulb-group-off"],
    [o.shutters, o.shutters?.state === "on" ? "mdi:window-shutter-open" : "mdi:window-shutter"],
    [o.outlets, o.outlets?.state === "on" ? "mdi:power-plug" : "mdi:power-plug-off"],
    [o.tv, o.tv?.state === "on" ? "mdi:television" : "mdi:television-off"]
  ];
  return e.actionSurface("custom-room-view", s`
    <div class="room-view-summary" @click=${(u) => d(u, a ?? r)}>
      <span class="room-view-icon"><ha-icon .icon=${e.config.icon || "mdi:home-variant-outline"}></ha-icon>${i.length ? s`<i>${i.length}</i>` : p}</span>
      <span><b><ha-icon icon="mdi:thermometer"></ha-icon>${b(a)}</b><small><ha-icon icon="mdi:water-percent"></ha-icon>${b(r)}</small></span>
    </div>
    <div class="room-view-status">
      ${f.map(([u, g]) => u && l(u) ? s`<button aria-label=${j({ entity: u.entity_id }, u)} @pointerdown=${(v) => v.stopPropagation()} @click=${(v) => d(v, u)}><ha-icon .icon=${g}></ha-icon>${l(u) > 1 ? s`<i>${l(u)}</i>` : p}</button>` : p)}
      ${n.length ? s`<button aria-label="Low batteries" @pointerdown=${(u) => u.stopPropagation()} @click=${(u) => d(u, n[0])}><ha-icon icon="mdi:battery-20"></ha-icon><i>${n.length}</i></button>` : p}
      ${!f.some(([u]) => l(u)) && !n.length ? s`<span class="room-view-clear"><ha-icon icon="mdi:check"></ha-icon></span>` : p}
    </div>
    <div class="room-view-actions">
      ${y.map(([u, g]) => u ? s`
        <button class=${u.state === "on" ? "is-active" : ""} aria-label=${j({ entity: u.entity_id }, u)}
          ?disabled=${u.state === "unavailable"} @pointerdown=${(v) => v.stopPropagation()}
          @dblclick=${(v) => m(v, u)} @click=${(v) => v.stopPropagation()}>
          <ha-icon .icon=${u.state === "unavailable" ? "mdi:exclamation-thick" : g}></ha-icon>
          ${l(u) ? s`<i>${l(u)}</i>` : p}
        </button>` : p)}
    </div>
  `);
}, Cr = (e) => {
  if (!e) return "Entity unavailable";
  const t = h(e, "has_date") === !0, a = h(e, "has_time") === !0;
  let r;
  if (t) r = Date.parse(e.state.replace(" ", "T"));
  else {
    const [m, f, y] = e.state.split(":").map(Number), u = /* @__PURE__ */ new Date();
    u.setHours(
      w(h(e, "hour")) ?? m,
      w(h(e, "minute")) ?? f,
      w(h(e, "second")) ?? y ?? 0,
      0
    ), r = u.getTime();
  }
  if (!Number.isFinite(r)) return b(e);
  const o = Date.now() - r, n = Math.trunc(o / 864e5), i = Math.trunc(Math.abs(o) / 36e5 % 24), l = Math.trunc(Math.abs(o) / 6e4 % 60), d = [];
  return t && n > 0 && d.push(`${n} day${n > 1 ? "s" : ""}`), a && i > 0 && d.push(`${i} hour${i > 1 ? "s" : ""}`), a && !t && l > 0 && d.push(`${l} minute${l > 1 ? "s" : ""}`), d.length ? `${d.join(" ")} ago` : "just now";
}, Er = (e) => e.actionSurface("custom-elapsed-time", s`
  ${x(e, "mdi:timer-sand", "grey")}
  <span class="ulm-copy"><b class="ulm-name">${j(e.config, e.entity)}</b><span class="ulm-label">${Cr(e.entity)}</span></span>
`), Mr = (e) => {
  const t = $(e, "ulm_custom_card_eraycetinay_lock_door_open"), a = $(e, "ulm_custom_card_eraycetinay_lock_battery_level") ?? A(e, "battery_entity"), r = e.entity?.state, o = r === "locked", n = c(e, "ulm_custom_card_eraycetinay_lock_battery_sensor_binary") === !0, i = c(e, "ulm_custom_card_eraycetinay_lock_battery_sensor_binary_low_state") ?? "on", l = w(c(e, "ulm_custom_card_eraycetinay_lock_battery_warning")) ?? 20, d = w(c(e, "ulm_custom_card_eraycetinay_lock_battery_warning_low")) ?? 5, m = w(a?.state), f = n ? a?.state === i : m !== void 0 && m <= l, y = !n && m !== void 0 && m <= d, u = c(e, "ulm_custom_card_eraycetinay_lock_tap_control") === !0, g = c(e, "ulm_custom_card_eraycetinay_lock_only_open") === !0, v = (V) => {
    if (V.stopPropagation(), !!e.config.entity) {
      if (!u) return q(V, e, { action: "more-info" }, e.config.entity);
      g ? e.service("lock", "open", { entity_id: e.config.entity }) : r === "locked" ? e.service("lock", "unlock", { entity_id: e.config.entity }) : r === "unlocked" && e.service("lock", "lock", { entity_id: e.config.entity });
    }
  };
  return e.actionSurface(`custom-eray-lock ${o ? "is-locked" : "is-unlocked"}`, s`
    <button class="eray-lock-control" aria-label=${u ? g ? "Open lock" : o ? "Unlock" : "Lock" : "More information"}
      ?disabled=${!e.entity || u && !g && !["locked", "unlocked"].includes(r ?? "")}
      @pointerdown=${(V) => V.stopPropagation()} @click=${v}>
      <span class="eray-lock-icon"><ha-icon .icon=${o ? "mdi:lock" : "mdi:lock-open"}></ha-icon>
        ${o && t?.state === "on" ? s`<i class="door-badge" title="Door is open while locked"><ha-icon icon="mdi:door-open"></ha-icon></i>` : p}
        ${f ? s`<i class="battery-badge ${y ? "is-critical" : ""}" title=${n ? "Battery is low" : `Battery is at ${m}%`}><ha-icon icon="mdi:battery-low"></ha-icon></i>` : p}
      </span>
      ${P(e, b(e.entity))}
    </button>
  `);
}, Tr = (e) => {
  const t = $(e, "ulm_card_esh_welcome_collapse"), a = $(e, "ulm_weather"), r = t?.state === "on", o = Array.from({ length: 5 }, (n, i) => i + 1).map((n) => ({
    nav: c(e, `nav_${n}`),
    icon: c(e, `icon_${n}`) || "mdi:circle",
    name: c(e, `name_${n}`) || `Item ${n}`,
    color: c(e, `color_${n}`) || "blue"
  })).filter((n) => n.nav);
  return e.actionSurface("custom-esh-welcome", s`
    <div class="esh-welcome-toolbar">
      <button aria-label="Toggle welcome navigation" ?disabled=${!t}
        @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => {
    n.stopPropagation(), t && e.service("input_boolean", "toggle", { entity_id: t.entity_id });
  }}>
        <ha-icon .icon=${r ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
      </button>
      <button aria-label="Weather information" ?disabled=${!a}
        @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => {
    a && q(n, e, { action: "more-info" }, a.entity_id);
  }}>
        <ha-icon icon="mdi:thermometer"></ha-icon>
      </button>
      <button aria-label="Dashboard settings" @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => q(n, e, { action: "navigate", navigation_path: "/config/dashboard" })}>
        <ha-icon icon="mdi:cog-outline"></ha-icon>
      </button>
    </div>
    <b class="esh-greeting">Good ${(/* @__PURE__ */ new Date()).getHours() < 12 ? "morning" : (/* @__PURE__ */ new Date()).getHours() < 18 ? "afternoon" : "evening"},<br>${e.config.name || j(e.config, e.entity)}!</b>
    ${r ? p : s`<div class="esh-welcome-items">${o.map((n) => s`
      <button class="tone-${n.color}" aria-label=${n.name}
        @pointerdown=${(i) => i.stopPropagation()}
        @click=${(i) => q(i, e, { action: "navigate", navigation_path: n.nav })}>
        <i><ha-icon .icon=${n.icon}></ha-icon></i><small>${n.name}</small>
      </button>
    `)}</div>`}
  `);
}, Lr = (e) => {
  const t = $(e, "ulm_custom_card_esh_room_light_entity"), a = $(e, "ulm_custom_card_esh_room_climate_entity"), r = $(e, "ulm_custom_card_esh_room_cover_entity"), o = t?.state === "on", n = w(h(t, "brightness")), i = e.config.secondary || (t ? o && n ? `${Math.round(n / 2.55)}%` : b(t) : b(e.entity)), l = h(t, "rgb_color"), d = c(e, "ulm_card_dynamic_color") === !0 && o && Array.isArray(l), m = (y, u) => {
    u && q(y, e, { action: "toggle" }, u.entity_id);
  }, f = (y, u) => {
    const g = u === "light" ? c(e, o ? "ulm_card_esh_room_light_icon_on" : "ulm_card_esh_room_light_icon_off") || (o ? "mdi:lightbulb" : "mdi:lightbulb-off") : u === "cover" ? c(e, y.state === "closed" ? "ulm_card_esh_room_cover_icon_closed" : "ulm_card_esh_room_cover_icon_open") || (y.state === "closed" ? "mdi:roller-shade-closed" : "mdi:blinds-open") : { auto: "mdi:autorenew", cool: "mdi:snowflake", heat: "mdi:fire", dry: "mdi:water", heat_cool: "mdi:sun-snowflake", fan_only: "mdi:fan", off: "mdi:snowflake-off" }[y.state] ?? "mdi:thermostat";
    return s`<button class="esh-room-control ${u} state-${y.state}" aria-label=${j({ entity: y.entity_id }, y)}
      ?disabled=${y.state === "unavailable"} @pointerdown=${(v) => v.stopPropagation()} @click=${(v) => m(v, y)}>
      <ha-icon .icon=${g}></ha-icon>
    </button>`;
  };
  return e.actionSurface(`custom-esh-room ${o ? "light-on" : ""} ${d ? "dynamic-color" : ""}`, s`
    <div class="esh-room-main" style=${d ? `--room-rgb:${l.slice(0, 3).join(",")};` : ""}>
      ${x(e, "mdi:sofa", o ? "yellow" : "grey")}
      <span class="ulm-copy"><b class="ulm-name">${j(e.config, e.entity)}</b><span class="ulm-label">${i}</span></span>
    </div>
    <div class="esh-room-controls">
      ${t ? f(t, "light") : p}
      ${r ? f(r, "cover") : a ? f(a, "climate") : p}
    </div>
  `);
}, qr = (e) => {
  const t = $(e, "power_entity") ?? $(e, "ulm_custom_card_washer_power"), a = $(e, "ulm_custom_card_washer_machine_state") ?? e.entity, r = $(e, "ulm_custom_card_washer_job_progress"), o = $(e, "ulm_custom_card_washer_job_state") ?? e.entity, n = $(e, "ulm_custom_card_washer_remote_control"), i = $(e, "ulm_custom_card_washer_delayed_start"), l = $(e, "ulm_custom_card_washer_delayed_starttime"), d = $(e, "door_entity"), m = $(e, "finished_entity"), f = c(e, "ulm_custom_card_washer_machine_stop_state") ?? "stop", y = t ? !["off", "unavailable", "unknown", "0"].includes(t.state.toLowerCase()) : a ? !["off", "unavailable", "unknown"].includes(a.state.toLowerCase()) : !0, u = !a || a.state === f || a.state === "off", g = ["true", "on", "enabled"].includes(n?.state.toLowerCase() ?? ""), v = i?.state === "on", V = Math.max(0, Math.min(100, w(r?.state) ?? 0)), E = c(
    e,
    "ulm_custom_card_washer_job_states"
  ), z = Object.values(E ?? {
    state1: { name: "weightSensing", icon: "mdi:scale" },
    state2: { name: "wash", icon: "mdi:waves" },
    state3: { name: "rinse", icon: "mdi:water" },
    state4: { name: "spin", icon: "mdi:fan" }
  }).filter((M) => M.name && M.icon).slice(0, 5), D = z.findIndex((M) => M.name?.toLowerCase() === o?.state.toLowerCase()), N = y ? u ? g && v ? c(e, "ulm_custom_card_washer_label_configuring") ?? "configure" : c(e, "ulm_custom_card_washer_label_idle") ?? "idle" : c(e, "ulm_custom_card_washer_label_running") ?? "run" : c(e, "ulm_custom_card_washer_label_idle") ?? "idle", H = (M) => c(e, M) ?? { action: "none" }, ee = (M, K) => q(M, e, K, typeof K.entity == "string" ? K.entity : e.config.entity), W = l?.state.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)?.slice(1).map(Number), T = (M, K) => {
    if (M.stopPropagation(), !l || !W) return;
    const Ke = ((W[0] * 60 + W[1] + K) % 1440 + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: l.entity_id,
      time: `${String(Math.floor(Ke / 60)).padStart(2, "0")}:${String(Ke % 60).padStart(2, "0")}:00`
    });
  }, de = H(u ? "ulm_custom_card_washer_start_action" : "ulm_custom_card_washer_pause_action"), we = H("ulm_custom_card_washer_stop_action");
  return e.actionSurface("custom-washer", s`
    <div class="custom-card-heading washer-heading">
      ${x(e, "mdi:washing-machine", y ? "blue" : "grey")}
      <span class="ulm-copy">
        <span class="ulm-name">${j(e.config, e.entity)}</span>
        <span class="ulm-label">${N}</span>
      </span>
      ${t ? s`<b class="washer-power">${b(t)}</b>` : p}
    </div>
    ${y && z.length ? s`
      <div class="washer-stages" style=${`--washer-stage-count:${z.length}`}>
        ${z.map((M, K) => s`
          <span class=${D === K ? "is-active" : ""} title=${M.name ?? ""}>
            <ha-icon .icon=${M.icon}></ha-icon>
          </span>
        `)}
      </div>
    ` : p}
    ${y && r ? s`
      <div class="washer-progress">
        <span style=${`width:${V}%`}></span>
        <b>${Math.round(V)}%</b>
      </div>
    ` : p}
    ${y && g ? s`
      <div class="washer-controls">
        ${k(
    u ? "Start washer" : "Pause washer",
    u ? "mdi:play" : "mdi:pause",
    (M) => ee(M, de),
    de.action === "none"
  )}
        ${k(
    "Stop washer",
    "mdi:stop",
    (M) => ee(M, we),
    u || we.action === "none"
  )}
        ${i ? k(
    v ? "Disable delayed start" : "Enable delayed start",
    "mdi:alarm",
    (M) => q(M, e, { action: "toggle" }, i.entity_id),
    !u
  ) : p}
      </div>
    ` : p}
    ${y && g && v && l ? s`
      <div class="washer-delay-controls">
        ${k("Move delayed start 15 minutes earlier", "mdi:arrow-down", (M) => T(M, -15))}
        <button class="washer-delay-time" aria-label="Move delayed start 1 minute later"
          @pointerdown=${(M) => M.stopPropagation()}
          @click=${(M) => T(M, 1)}>${l.state}</button>
        ${k("Move delayed start 15 minutes later", "mdi:arrow-up", (M) => T(M, 15))}
      </div>
    ` : p}
    ${d || m || n ? s`
      <div class="washer-status">
        ${d ? s`<span><ha-icon icon="mdi:door"></ha-icon>${b(d)}</span>` : p}
        ${m ? s`<span><ha-icon icon="mdi:check-circle"></ha-icon>${b(m)}</span>` : p}
        ${n ? s`<span><ha-icon icon="mdi:remote"></ha-icon>${b(n)}</span>` : p}
      </div>
    ` : p}
  `);
}, Fr = (e) => {
  const t = w(h(e.entity, "temperature")) ?? 20, a = w(h(e.entity, "target_temp_step")) ?? 0.5, r = e.entity?.state ?? "off", o = Array.isArray(h(e.entity, "hvac_modes")) ? h(e.entity, "hvac_modes") : ["off", "heat", "cool", "heat_cool", "dry", "fan_only"], n = Array.isArray(h(e.entity, "fan_modes")) ? h(e.entity, "fan_modes") : [], i = [
    { mode: "off", icon: "mdi:power", label: r === "off" ? "Turn on" : "Turn off", tone: "grey" },
    { mode: "heat", icon: "mdi:fire", label: "Heat mode", tone: "red" },
    { mode: "cool", icon: "mdi:snowflake", label: "Cool mode", tone: "blue" },
    { mode: "heat_cool", icon: "mdi:sync", label: "Automatic mode", tone: "green" },
    { mode: "dry", icon: "mdi:water", label: "Dry mode", tone: "orange" },
    { mode: "fan_only", icon: "mdi:fan", label: "Fan mode", tone: "purple" }
  ], l = r === "off" ? "mdi:thermostat" : i.find(({ mode: u }) => u === r)?.icon ?? "mdi:thermostat", d = i.find(({ mode: u }) => u === r)?.tone ?? "grey", m = h(e.entity, "current_temperature"), f = String(h(e.entity, "hvac_action") ?? r).replaceAll("_", " "), y = (u, g) => {
    if (u.stopPropagation(), !!e.config.entity) {
      if (g === "off") {
        if (r === "off") {
          const v = o.find((V) => V !== "off");
          v ? e.service("climate", "set_hvac_mode", { entity_id: e.config.entity, hvac_mode: v }) : e.service("climate", "turn_on", { entity_id: e.config.entity });
        } else o.includes("off") ? e.service("climate", "set_hvac_mode", { entity_id: e.config.entity, hvac_mode: "off" }) : e.service("climate", "turn_off", { entity_id: e.config.entity });
        return;
      }
      if (g === "fan_only" && !o.includes("fan_only") && n.length) {
        e.service("climate", "set_fan_mode", { entity_id: e.config.entity, fan_mode: n[0] });
        return;
      }
      e.service("climate", "set_hvac_mode", { entity_id: e.config.entity, hvac_mode: g });
    }
  };
  return e.actionSurface("custom-heat-pump", s`
    <div class="heat-pump-header">
      <span class="heat-pump-icon tone-${d}"><ha-icon .icon=${l}></ha-icon></span>
      <span class="ulm-copy">
        <span class="ulm-name">${j(e.config, e.entity)}</span>
        <span class="ulm-label">${m ?? "null"}° • ${r.replaceAll("_", " ")} (${f})</span>
      </span>
    </div>
    <div class="heat-pump-target">
      ${k("Decrease target temperature", "mdi:arrow-down", (u) => {
    u.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: t - a });
  })}
      <b>${t}°C</b>
      ${k("Increase target temperature", "mdi:arrow-up", (u) => {
    u.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: t + a });
  })}
    </div>
    <div class="heat-pump-modes">${i.map(({ mode: u, icon: g, label: v, tone: V }) => {
    const E = u === "off" || o.includes(u) || u === "fan_only" && n.length > 0;
    return s`
      <button
        aria-label=${v}
        class="tone-${V} ${r === u ? "is-active" : ""}"
        ?disabled=${!E}
        @pointerdown=${(z) => z.stopPropagation()}
        @click=${(z) => y(z, u)}
      ><ha-icon .icon=${g}></ha-icon></button>
    `;
  })}</div>
  `);
}, wt = (e, t, a) => $(e, t) ?? Object.values(e.hass.states).find((r) => r.entity_id.startsWith("update.") && r.entity_id.includes(a)), Rr = (e) => {
  const t = [
    ["Supervisor", wt(e, "ulm_card_homeassistant_supervisor", "supervisor")],
    ["Core", $(e, "ulm_card_homeassistant_core") ?? e.entity],
    ["OS", wt(e, "ulm_card_homeassistant_os", "operating_system")]
  ], a = t.some(([, i]) => ["on", "true"].includes(i?.state.toLowerCase() ?? "")), r = t.map(([, i]) => i).filter((i) => !!(i && !["unknown", "unavailable"].includes(i.state.toLowerCase()))), o = r.find((i) => ["on", "true"].includes(i.state.toLowerCase())) ?? r[0], n = (i) => {
    if (!i) return "Unavailable";
    const l = String(h(i, "installed_version") ?? i.state), d = h(i, "latest_version");
    return ["on", "true"].includes(i.state.toLowerCase()) && d ? `${l} → ${String(d)}` : l;
  };
  return e.actionSurface("custom-ha-updates", s`
    <div class="ha-updates-summary">
      <span class="ha-updates-icon ${a ? "has-update" : ""}">
        <ha-icon icon="mdi:home-assistant"></ha-icon>
        ${a ? s`<span class="ha-updates-badge"><ha-icon icon="mdi:party-popper"></ha-icon></span>` : p}
      </span>
      <span class="ulm-copy">
        <span class="ulm-name">${a ? "Updates available!" : "No updates available"}</span>
        <span class="ha-update-list">${t.map(([i, l]) => s`
          <span><b>${i}:</b> ${n(l)}</span>
        `)}</span>
      </span>
    </div>
    <div class="ha-update-actions">
      <button aria-label="Open Home Assistant release notes" @pointerdown=${(i) => i.stopPropagation()}
        @click=${(i) => q(i, e, { action: "url", url_path: "https://www.home-assistant.io/latest-release-notes/" })}>
        <ha-icon icon="mdi:file-document"></ha-icon>
      </button>
      <button aria-label="Open update settings" @pointerdown=${(i) => i.stopPropagation()}
        @click=${(i) => q(i, e, { action: "navigate", navigation_path: "/config/updates" })}>
        <ha-icon icon="mdi:cog"></ha-icon>
      </button>
      <button aria-label="Open available update" ?disabled=${!o}
        @pointerdown=${(i) => i.stopPropagation()}
        @click=${(i) => o && q(i, e, { action: "more-info" }, o.entity_id)}>
        <ha-icon icon="mdi:update"></ha-icon>
      </button>
    </div>
  `);
}, Ur = (e) => {
  const t = h(e.entity, "next_rising"), a = h(e.entity, "next_setting"), r = h(e.entity, "next_dawn") ?? t, o = h(e.entity, "next_noon"), n = h(e.entity, "next_dusk") ?? a, i = c(e, "language") || e.hass.language || "en", l = c(e, "timeFormat") === "12h", d = (g) => {
    const v = new Date(String(g ?? ""));
    return Number.isNaN(v.getTime()) ? "—" : new Intl.DateTimeFormat(i, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: l
    }).format(v);
  }, m = e.entity?.state === "above_horizon", f = w(h(e.entity, "elevation")), y = w(h(e.entity, "azimuth")), u = c(e, "title");
  return e.actionSurface(`custom-sun-card ${c(e, "darkMode") ? "is-dark" : ""}`, s`
    ${u ? s`<b class="sun-title">${u}</b>` : p}
    <div class="sun-times"><span><small>Sunrise</small><b>${d(t)}</b></span><span><small>Sunset</small><b>${d(a)}</b></span></div>
    <div class="sun-arc"><svg viewBox="0 0 300 90" preserveAspectRatio="none"><path class="sun-night" d="M0,62 Q60,115 105,62"></path><path class="sun-day" d="M0,62 Q150,-45 300,62"></path><circle cx=${m ? "170" : "28"} cy=${m ? "18" : "70"} r="10"></circle><line x1="0" y1="62" x2="300" y2="62"></line></svg></div>
    <div class="sun-footer"><span><small>Dawn</small><b>${d(r)}</b></span><span><small>Solar noon</small><b>${d(o)}</b></span><span><small>Dusk</small><b>${d(n)}</b></span></div>
    ${c(e, "showAzimuth") || c(e, "showElevation") ? s`
      <div class="sun-position">
        ${c(e, "showAzimuth") ? s`<span>Azimuth <b>${y ?? "—"}°</b></span>` : p}
        ${c(e, "showElevation") ? s`<span>Elevation <b>${f ?? "—"}°</b></span>` : p}
      </div>
    ` : p}
  `);
}, Or = (e) => {
  const t = h(e.entity, "hvac_action") === "heating", a = w(h(e.entity, "temperature")) ?? 20, r = e.entity?.state ?? "off", o = e.config.variant !== "collapse" || r === "heat", n = (i) => {
    i.stopPropagation(), e.config.entity && e.service("climate", "set_hvac_mode", {
      entity_id: e.config.entity,
      hvac_mode: r === "off" ? "heat" : "off"
    });
  };
  return e.actionSurface(`custom-compact-thermostat ${t ? "is-heating" : ""}`, s`
    <button class="thermostat-summary" aria-label=${r === "off" ? "Turn thermostat on" : "Turn thermostat off"}
      @pointerdown=${(i) => i.stopPropagation()} @click=${n}>
      ${x(e, t ? "mdi:radiator" : "mdi:radiator-off", "red")}
      ${P(e, b(e.entity))}
      <b>${h(e.entity, "current_temperature") ?? "—"}°C</b>
    </button>
    ${o ? s`<div class="compact-thermostat-controls">
      ${k("Decrease temperature", "mdi:minus", (i) => {
    i.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: a - 0.5 });
  })}
      <b>${a}°C</b>
      ${k("Increase temperature", "mdi:plus", (i) => {
    i.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: a + 0.5 });
  })}
    </div>` : p}
  `);
}, Br = (e) => {
  const t = w(e.entity?.state) ?? 0, a = w(c(e, "ulm_custom_card_iAbadia_battery_chip_danger")) ?? 10, r = w(c(e, "ulm_custom_card_iAbadia_battery_chip_warning")) ?? 20, o = t <= a ? "red" : t <= r ? "yellow" : "green", n = $(e, "battery_state_entity"), i = /charg/i.test(n?.state ?? "") && !/discharg/i.test(n?.state ?? "");
  return e.actionSurface(`custom-battery-chip tone-${o}`, s`
    <ha-icon .icon=${c(e, "ulm_custom_card_iAbadia_battery_chip_icon") || e.config.icon || (i ? "mdi:battery-charging" : "mdi:battery")}></ha-icon>
  `);
}, Nr = (e) => {
  const t = Array.isArray(h(e.entity, "data")) ? h(e.entity, "data") : [], a = Math.max(1, w(c(e, "ulm_custom_card_imswel_medias_index")) ?? 1), r = t[a] ?? t.find((v) => v.title) ?? {}, o = $(e, "secondary_entity"), n = c(e, "ulm_custom_card_imswel_medias_platform") || "plex", i = e.config.variant === "library" || n === "plex", l = (i ? r.fanart : r.poster) || r.fanart || r.poster || h(e.entity, "entity_picture") || h(o, "entity_picture"), m = !e.entity || ["unavailable", "unknown"].includes(e.entity.state) ? "Unavailable" : String(r.title ?? h(e.entity, "media_title") ?? j(e.config, e.entity)), f = r.number ?? (typeof r.aired == "string" ? `(${r.aired.split("-")[0]})` : ""), y = n === "sonarr" && r.number ? ` - ${String(r.number)}` : "", u = r.airdate ? new Date(String(r.airdate)) : void 0, g = u && !Number.isNaN(u.getTime()) ? new Intl.DateTimeFormat(e.hass.language || "en", {
    weekday: "long",
    month: "short",
    day: "numeric"
  }).format(u) : String(r.release ?? b(e.entity));
  return e.actionSurface(`custom-media-library ${i ? "is-library" : "is-upcoming"}`, s`
    ${l ? s`<span class="media-library-art" style=${`background-image:url("${String(l)}")`}></span>` : s`<span class="media-library-art"><ha-icon icon="mdi:movie-open"></ha-icon></span>`}
    <span class="media-library-overlay">
      ${i ? s`<span class="media-platform"><ha-icon icon="mdi:plex"></ha-icon></span>` : p}
      <span class="ulm-copy">
        <b class="ulm-name">${i ? "Recently added" : `${m}${y}`}</b>
        <span class="ulm-label">${i ? `${m}${f ? ` ${String(f)}` : ""}` : g}</span>
      </span>
    </span>
  `);
}, Hr = (e) => {
  const t = e.entity?.state ?? "unavailable", a = t === "unavailable" || t === "unknown", r = Object.values(e.hass.states).find((l) => l.entity_id.startsWith("zone.") && l.attributes.friendly_name === t), o = a ? "mdi:alert" : t === "home" ? "mdi:home-variant" : t === "not_home" ? "mdi:home-minus" : r?.attributes.icon || "mdi:help-circle", n = a ? "Unavailable" : t === "home" ? c(e, "ulm_custom_card_imswel_person_home") || "Home" : t === "not_home" ? c(e, "ulm_custom_card_imswel_person_not_home") || "Away" : t, i = e.config.use_entity_picture || c(e, "ulm_card_imswel_person_use_entity_picture") === !0;
  return e.actionSurface("custom-imswel-person", s`
    <div class="imswel-person-main">${i && h(e.entity, "entity_picture") ? s`<span class="person-picture" style=${`background-image:url("${String(h(e.entity, "entity_picture"))}")`}></span>` : x(e, "mdi:face-man", a ? "grey" : "blue")}
      <span class="ulm-copy">
        <span class="ulm-name">${j(e.config, e.entity)}</span>
        <span class="ulm-label">${n}</span>
      </span>
      <span class="imswel-location ${a ? "is-unavailable" : t === "home" ? "is-home" : "is-away"}">
        <ha-icon .icon=${o}></ha-icon>
      </span>
    </div>
  `);
}, Wr = (e) => {
  const t = !!(e.entity && !["unavailable", "unknown"].includes(e.entity.state)), r = (t ? e.entity.state : "00:00:00").split(" ").at(-1) || "00:00:00", [o, n] = r.split(":").map(Number), i = (l) => {
    const d = ((o || 0) * 60 + (n || 0) + l + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: e.config.entity,
      time: `${String(Math.floor(d / 60)).padStart(2, "0")}:${String(d % 60).padStart(2, "0")}:00`
    });
  };
  return e.actionSurface("custom-input-datetime", s`
    <div class="custom-card-heading">${x(e, "mdi:calendar-clock", "green")}${P(e, b(e.entity))}</div>
    <div class="input-datetime-controls">
      ${k("15 minutes earlier", "mdi:arrow-down", (l) => {
    l.stopPropagation(), i(-15);
  }, !t)}
      ${Za(
    "One minute later; hold for one minute earlier",
    s`<b>${t ? r.slice(0, 5) : "Unavailable"}</b>`,
    () => i(1),
    () => i(-1),
    !t
  )}
      ${k("15 minutes later", "mdi:arrow-up", (l) => {
    l.stopPropagation(), i(15);
  }, !t)}
    </div>
  `);
}, Gr = (e) => {
  const t = e.config.entity?.split(".", 1)[0] ?? "input_number", a = !!(e.entity && !["unavailable", "unknown"].includes(e.entity.state)), r = t === "counter" ? ["counter", "decrement"] : t === "select" ? ["select", "select_previous"] : t === "input_select" ? ["input_select", "select_previous"] : ["input_number", "decrement"], o = t === "counter" ? ["counter", "increment"] : t === "select" ? ["select", "select_next"] : t === "input_select" ? ["input_select", "select_next"] : ["input_number", "increment"];
  return e.actionSurface("custom-input-number", s`
    <div class="custom-card-heading">${x(e, "mdi:tune-variant", "blue")}${P(e, b(e.entity))}</div>
    <div class="input-number-controls">
      ${k("Previous value", "mdi:arrow-down", (n) => {
    if (n.stopPropagation(), t === "number") {
      const i = w(h(e.entity, "step")) ?? 1;
      e.service("number", "set_value", { entity_id: e.config.entity, value: (w(e.entity?.state) ?? 0) - i });
    } else e.service(r[0], r[1], { entity_id: e.config.entity });
  }, !a)}
      <button class="input-number-value" aria-label="Stop cover" ?disabled=${!a}
        @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => {
    n.stopPropagation(), e.service("cover", "stop_cover", { entity_id: e.config.entity });
  }}><b>${b(e.entity)}</b></button>
      ${k("Next value", "mdi:arrow-up", (n) => {
    if (n.stopPropagation(), t === "number") {
      const i = w(h(e.entity, "step")) ?? 1;
      e.service("number", "set_value", { entity_id: e.config.entity, value: (w(e.entity?.state) ?? 0) + i });
    } else e.service(o[0], o[1], { entity_id: e.config.entity });
  }, !a)}
    </div>
  `);
}, Kr = (e) => {
  const t = [1, 2, 3, 4].map((r) => $(e, `ulm_custom_card_irmajavi_entities_entity_${r}`) ?? (e.config.entities?.[r - 1] ? e.hass.states[e.config.entities[r - 1]] : void 0)), a = c(
    e,
    "ulm_custom_card_irmajavi_entities_name",
    "ulm_custom_card_irmajavi_entitites_name"
  ) || j(e.config, e.entity);
  return e.actionSurface("custom-irmajavi-entities", s`
    <div class="irmajavi-panel">
      <span class="irmajavi-main-name"><ha-icon .icon=${c(e, "ulm_custom_card_irmajavi_entities_icon") || "mdi:alien"}></ha-icon>${a}</span>
      <b>${b(e.entity)}</b>
    </div>
    <div class="irmajavi-four">${t.map((r, o) => s`
      <button ?disabled=${!r} @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => r && q(n, e, { action: "more-info" }, r.entity_id)}>
        <b>${b(r)}</b>
        <small>${c(e, `ulm_custom_card_irmajavi_entities_name_${o + 1}`) || (r ? j({ entity: r.entity_id }, r) : `Entity ${o + 1}`)}</small>
      </button>
    `)}</div>
  `);
}, Yr = (e) => {
  const t = A(e, "download_entity") ?? $(e, "ulm_custom_card_irmajavi_speedtest_download_speed_entity") ?? e.entity, a = A(e, "upload_entity") ?? $(e, "ulm_custom_card_irmajavi_speedtest_upload_speed_entity"), r = A(e, "ping_entity") ?? $(e, "ulm_custom_card_irmajavi_speedtest_ping_entity"), o = [t, a, r].filter((i) => !!i), n = c(e, "ulm_custom_card_irmajavi_speedtest_color") || "blue";
  return e.actionSurface("custom-irmajavi-speedtest", s`
    <div class="speedtest-router">
      <span class="ulm-icon tone-${n}"><ha-icon icon="mdi:wifi"></ha-icon></span>
      <span class="ulm-copy">
        <b class="ulm-name">${c(e, "ulm_custom_card_irmajavi_speedtest_router_name") || "router_name"}</b>
        <span class="ulm-label">${c(e, "ulm_custom_card_irmajavi_speedtest_router_model") || "router_model"}</span>
      </span>
    </div>
    <button class="speedtest-action" ?disabled=${o.length !== 3}
      @pointerdown=${(i) => i.stopPropagation()} @click=${(i) => {
    i.stopPropagation(), e.service("homeassistant", "update_entity", { entity_id: o.map((l) => l.entity_id) });
  }}>
      <ha-icon icon="mdi:speedometer"></ha-icon>
      <span>${c(e, "ulm_custom_card_irmajavi_speedtest_speedtest") || "Internet speed test"}</span>
      <ha-icon icon="mdi:chevron-right"></ha-icon>
    </button>
    <div class="speedtest-metrics">
      ${[
    [c(e, "ulm_custom_card_irmajavi_speedtest_download") || "Download speed", t],
    [c(e, "ulm_custom_card_irmajavi_speedtest_upload") || "Upload speed", a]
  ].map(([i, l]) => s`
        <button ?disabled=${!l} @pointerdown=${(d) => d.stopPropagation()}
          @click=${(d) => l && q(d, e, { action: "more-info" }, l.entity_id)}>
          <b>${b(l).replace(" ", "")}</b>
          <small>${String(i)}</small>
        </button>
      `)}
    </div>
  `);
}, Zr = (e) => {
  const t = [1, 2, 3, 4].map((i) => $(e, `ulm_custom_card_irmajavi_weather_entity_${i}`) ?? (e.config.entities?.[i - 1] ? e.hass.states[e.config.entities[i - 1]] : void 0)), a = A(e, "temperature_entity"), r = A(e, "date_entity") ?? $(e, "ulm_custom_card_irmajavi_weather_date"), o = e.entity?.state || "unknown", n = {
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
  return e.actionSurface("custom-irmajavi-weather", s`
    <div class="irmajavi-weather-panel">
      <b class="weather-date">${n[o] || "❔"} ${r ? b(r) : "Date unavailable"}</b>
      <strong>${a ? b(a) : `${h(e.entity, "temperature") ?? "—"}°`}</strong>
    </div>
    <div class="irmajavi-four">${t.map((i, l) => s`
      <button ?disabled=${!i} @pointerdown=${(d) => d.stopPropagation()}
        @click=${(d) => i && q(d, e, { action: "more-info" }, i.entity_id)}>
        <b>${b(i)}</b>
        <small>${c(e, `ulm_custom_card_irmajavi_weather_name_${l + 1}`) || (i ? j({ entity: i.entity_id }, i) : `Weather ${l + 1}`)}</small>
      </button>
    `)}</div>
  `);
}, Jr = (e) => {
  const t = e.entity?.state === "on", a = !e.entity || ["unknown", "unavailable"].includes(e.entity.state), r = w(h(e.entity, "brightness")), o = r === void 0 ? 0 : Math.round(r / 2.55), n = [[255, 255, 255], [245, 68, 54], [51, 102, 204], [51, 204, 51], [255, 0, 255], [0, 255, 255]], i = w(c(e, "ulm_card_light_colorpick_transition")) ?? 1;
  return e.actionSurface(`custom-light-colorpick ${t ? "is-active" : ""}`, s`
    <div class="light-colorpick-top">
      <div class="light-header ${t ? "is-active" : ""}">
        ${x(e, "mdi:lightbulb", t ? "yellow" : "grey")}
        ${P(e, t && r !== void 0 ? `${o}%` : b(e.entity))}
      </div>
      <div class="ulm-light-slider" style=${`--light-rgb:255,193,7;--light-level:${o}%`}>
        <i></i>
        <input type="range" min="0" max="100" .value=${String(o)} aria-label="Brightness"
          ?disabled=${a}
          @pointerdown=${(l) => l.stopPropagation()}
          @click=${(l) => l.stopPropagation()}
          @change=${(l) => e.service("light", "turn_on", {
    entity_id: e.config.entity,
    brightness_pct: Number(l.target.value)
  })}>
      </div>
    </div>
    ${t ? s`<div class="light-color-swatches">${n.map((l) => s`
      <button style=${`--swatch:rgba(${l.join(",")},.8)`} aria-label=${`Set color ${l.join(",")}`}
        ?disabled=${a}
        @pointerdown=${(d) => d.stopPropagation()}
        @click=${(d) => {
    d.stopPropagation(), e.service("light", "turn_on", { entity_id: e.config.entity, rgb_color: l, transition: i });
  }}></button>
    `)}</div>` : p}
  `);
}, Qr = (e) => {
  const t = !e.entity || e.entity.state === "unavailable", a = Math.round((w(h(e.entity, "volume_level")) ?? 0) * 100), r = h(e.entity, "source"), o = ["idle", "paused", "unavailable"].includes(e.entity?.state ?? "") ? b(e.entity) : `${r ? String(r) : b(e.entity)} • ${a}%`;
  return e.actionSurface("custom-sonos", s`
    <div class="custom-card-heading">
      ${x(e, "mdi:speaker", e.entity?.state === "playing" ? "green" : "grey")}
      <span class="ulm-copy">
        <span class="ulm-name">${c(e, "ulm_card_media_player_with_controls_name") || j(e.config, e.entity)}</span>
        <span class="ulm-label">${o}</span>
      </span>
    </div>
    <div class="sonos-controls">
      ${k("Volume down", "mdi:volume-minus", (n) => {
    n.stopPropagation(), e.service("media_player", "volume_down", { entity_id: e.config.entity });
  }, t)}
      ${k("Play or pause", ["paused", "off"].includes(e.entity?.state ?? "") ? "mdi:play" : "mdi:pause", (n) => {
    n.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: e.config.entity });
  }, t)}
      ${k("Volume up", "mdi:volume-plus", (n) => {
    n.stopPropagation(), e.service("media_player", "volume_up", { entity_id: e.config.entity });
  }, t)}
    </div>
  `);
}, Xr = (e) => {
  const t = A(e, "power_entity"), a = A(e, "energy_entity"), r = A(e, "time_entity"), o = r ? (w(r.state) ?? 0) < 1 ? `${(w(r.state) ?? 0) * 100}Mins` : `${r.state}Hrs` : void 0, n = e.entity?.state === "on", i = n ? [
    t ? `${t.state}W` : void 0,
    a ? `${a.state}kWh` : void 0,
    o
  ].filter(Boolean).join(" • ") || b(e.entity) : a && (w(a.state) ?? 0) > 0 ? `${b(e.entity)} • ${a.state}kWh` : b(e.entity);
  return e.actionSurface("custom-more-power-outlet", s`
    ${x(e, "mdi:power-socket-eu", n ? "yellow" : "grey")}
    ${P(e, i || b(e.entity))}
  `);
}, eo = (e) => {
  const t = w(e.entity?.state) ?? 0, a = w(e.config.minimum) ?? 0, r = w(e.config.maximum) ?? 100, o = Math.max(0, Math.min(100, (t - a) / Math.max(1, r - a) * 100));
  return e.actionSurface("custom-dual-gauge", s`
    <div class="custom-card-heading">${x(e, "mdi:gauge", "blue")}${P(e, b(e.entity))}</div>
    <div class="dual-gauge" style=${`--gauge:${o * 1.8}deg`}>
      <i></i>
      ${a === 0 && r === 100 ? p : s`<span><small>${a} - ${r}</small></span>`}
    </div>
  `);
}, to = (e) => {
  const t = [
    A(e, "black_entity"),
    A(e, "yellow_entity"),
    A(e, "magenta_entity"),
    A(e, "cyan_entity")
  ], a = ["#111", "#faff00", "#f800ff", "#00ffff"];
  return e.actionSurface("custom-mpse-printer", s`
    <div class="custom-card-heading">
      ${x(e, "mdi:printer", e.entity?.state === "idle" ? "grey" : "blue")}
      <span class="ulm-copy">
        <span class="ulm-name">${c(e, "ulm_card_printer_name") || j(e.config, e.entity)}</span>
        <span class="ulm-label">${b(e.entity)}</span>
      </span>
    </div>
    <div class="toner-bars">${t.map((r, o) => {
    if (!r) return p;
    const n = Math.max(0, Math.min(100, w(r.state) ?? 0));
    return s`<span style=${`--toner:${a[o]};--level:${n}%`}><i><em></em><b>${b(r)}</b></i></span>`;
  })}</div>
  `);
}, ao = (e) => {
  const t = w(h(e.entity, "temperature")), a = w(h(e.entity, "target_temp_step")) ?? 1, r = h(e.entity, "current_temperature"), o = h(e.entity, "hvac_action"), n = e.entity?.state ?? "unknown", i = !e.entity || ["unknown", "unavailable"].includes(n) || t === void 0, l = n === "heat" ? "red" : n === "cool" ? "blue" : "grey", d = n === "heat" ? "mdi:fire" : n === "cool" ? "mdi:snowflake" : "mdi:thermostat", m = t === void 0 ? b(e.entity) : `${String(r ?? "—")}° • ${n}${o ? ` (${String(o)})` : ""}`;
  return e.actionSurface(`custom-compact-thermostat custom-mpse-thermostat is-${n}`, s`
    <div class="custom-card-heading">
      ${x(e, d, l)}
      ${P(e, m)}
    </div>
    <div class="compact-thermostat-controls">
      ${k("Decrease temperature", "mdi:arrow-down", (f) => {
    f.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: Number(t) - a });
  }, i)}
      <b>${t === void 0 ? "—" : `${t}°C`}</b>
      ${k("Increase temperature", "mdi:arrow-up", (f) => {
    f.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: Number(t) + a });
  }, i)}
    </div>
  `);
}, ro = (e) => {
  const t = w(e.entity?.state) ?? -100, a = t >= -50 ? "mdi:wifi-strength-4" : t >= -60 ? "mdi:wifi-strength-3" : t >= -70 ? "mdi:wifi-strength-2" : t >= -80 ? "mdi:wifi-strength-1" : "mdi:wifi-strength-off";
  return e.actionSurface("custom-wifi-signal", s`${x(e, a, "blue")}${P(e, `${t} dBm`)}`);
}, oo = (e) => e.actionSurface("custom-nas-info", s`
  ${x(e, "mdi:nas", "blue")}
  ${P(e, `${c(e, "ulm_custom_card_nas_text") || ""} ${b(e.entity)}${c(e, "ulm_custom_card_nas_unit", "ulm_custom_cad_nas_unit") || ""}`.trim())}
`), no = (e) => {
  const t = e.entity?.state !== "off", a = c(e, "ulm_custom_card_neekster_update_enable_controls") === !0;
  return e.actionSurface("custom-neekster-update", s`
    <div class="custom-card-heading">${x(e, t ? "mdi:cloud-download" : "mdi:cloud-check", t ? "yellow" : "green")}${P(e, t ? "Update available" : "Up to date")}</div>
    ${a && t ? s`<div class="update-controls">
      ${k("Install update", "mdi:update", (r) => {
    r.stopPropagation(), e.service("update", "install", { entity_id: e.config.entity });
  })}
      ${k("Skip update", "mdi:skip-next", (r) => {
    r.stopPropagation(), e.service("update", "skip", { entity_id: e.config.entity });
  })}
    </div>` : p}
  `);
}, io = (e) => {
  const t = /* @__PURE__ */ new Date();
  return e.actionSurface("custom-nik-clock", s`
    <b>${t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</b>
    <span>${t.toLocaleDateString(e.hass.language, { weekday: "long", day: "numeric", month: "long" })}</span>
  `);
}, so = (e) => {
  const t = A(e, "lock_entity"), a = A(e, "battery_entity"), r = w(a?.state) ?? 0;
  return e.actionSurface("custom-nik-door", s`
    <div class="nik-door-heading">
      <span class="nik-door-icon"><ha-icon .icon=${e.entity?.state === "on" ? "mdi:door-open" : "mdi:door-closed"}></ha-icon><i class=${r <= 40 ? "is-low" : ""}><ha-icon .icon=${r <= 40 ? "mdi:battery-alert" : "mdi:battery"}></ha-icon></i></span>
      ${P(e, `${b(e.entity)} · ${b(t)}`)}
    </div>
    <div class="nik-door-controls">
      ${k("Unlock", "mdi:lock-open", (o) => {
    o.stopPropagation(), t && e.service("lock", "unlock", { entity_id: t.entity_id });
  })}
      ${k("Lock", "mdi:lock", (o) => {
    o.stopPropagation(), t && e.service("lock", "lock", { entity_id: t.entity_id });
  })}
    </div>
  `);
}, lo = (e) => {
  const t = A(e, "disk_entity") ?? $(e, "entity_4"), a = A(e, "temperature_entity") ?? $(e, "entity_1"), r = A(e, "memory_entity") ?? $(e, "entity_2"), o = A(e, "cpu_entity") ?? $(e, "entity_3"), n = !["off", "unavailable", "unknown"].includes(e.entity?.state ?? ""), i = (u, g) => {
    const v = c(e, u) || g;
    return {
      red: "#ff3b49",
      orange: "#ff8a00",
      yellow: "#ffb300",
      blue: "#4267ff",
      green: "#00c968"
    }[v] ?? v;
  }, l = (u) => c(e, u), d = (u) => {
    const g = e.config[u];
    return g && typeof g == "object" && "max_value" in g ? w(g.max_value) : void 0;
  }, m = (u, g, v, V = 100) => {
    const E = Math.max(0, Math.min(V, w(u?.state) ?? 0)), z = 2 * Math.PI * g, D = z * (1 - E / V);
    return nt`<circle class="nik-nas-ring-value" cx="70" cy="70" r=${g}
      fill="none" stroke=${v} stroke-width="6" stroke-linecap="round"
      stroke-dasharray=${z} stroke-dashoffset=${D}></circle>`;
  }, f = e.entity?.state === "on" ? "Access" : b(e.entity), y = s`
    <button class="nik-nas-tile status-tile" aria-label="Open NAS status"
      @pointerdown=${(u) => u.stopPropagation()}
      @click=${(u) => q(u, e, { action: "more-info" })}>
      <span class="nik-nas-tile-icon tone-blue"><ha-icon icon="mdi:nas"></ha-icon></span>
      <span><b>Status</b><small>${f}</small></span>
    </button>`;
  return n ? e.actionSurface("custom-nik-nas is-on", s`
    <div class="nik-nas-top">
      ${y}
      <div class="nik-nas-tile disk-tile">
        <span class=${`nik-nas-tile-icon ${l("disk_color") ? "" : "tone-red"}`}
          style=${l("disk_color") ? `color:${i("disk_color", "red")};background:color-mix(in srgb, ${i("disk_color", "red")} 18%, transparent)` : ""}>
          <ha-icon .icon=${c(e, "disk_icon") || "mdi:harddisk"}></ha-icon>
        </span>
        <span><b>${c(e, "disk_name") || "Disk"}</b><small>${b(t)}</small></span>
      </div>
    </div>
    <div class="nik-nas-body">
      <div class="nik-nas-metrics">
        <span><i class=${l("temperature_color") ? "" : "tone-orange"} style=${l("temperature_color") ? `color:${i("temperature_color", "orange")}` : ""}><ha-icon .icon=${c(e, "temperature_icon") || "mdi:thermometer"}></ha-icon></i><span><b>${c(e, "temperature_name") || "Temp"}</b><small>${b(a)}</small></span></span>
        <span><i class=${l("memory_color") ? "" : "tone-blue"} style=${l("memory_color") ? `color:${i("memory_color", "blue")}` : ""}><ha-icon .icon=${c(e, "memory_icon") || "mdi:memory"}></ha-icon></i><span><b>${c(e, "memory_name") || "Memory"}</b><small>${b(r)}</small></span></span>
        <span><i class=${l("cpu_color") ? "" : "tone-green"} style=${l("cpu_color") ? `color:${i("cpu_color", "green")}` : ""}><ha-icon .icon=${c(e, "cpu_icon") || "mdi:cpu-64-bit"}></ha-icon></i><span><b>${c(e, "cpu_name") || "CPU"}</b><small>${b(o)}</small></span></span>
      </div>
      <svg class="nik-nas-rings" viewBox="0 0 140 140" role="img" aria-label="NAS temperature, memory, and CPU utilization">
        ${[58, 48, 38].map((u) => nt`<circle class="nik-nas-ring-track" cx="70" cy="70" r=${u}
          fill="none" stroke="#dedede" stroke-width="6"></circle>`)}
        ${m(a, 58, i("temperature_color", "orange"), w(c(e, "temperature_max")) ?? d("entity_1") ?? 100)}
        ${m(r, 48, i("memory_color", "blue"), w(c(e, "memory_max")) ?? d("entity_2") ?? 100)}
        ${m(o, 38, i("cpu_color", "green"), w(c(e, "cpu_max")) ?? d("entity_3") ?? 100)}
      </svg>
    </div>
  `) : e.actionSurface("custom-nik-nas is-off", s`<div class="nik-nas-top">${y}</div>`);
}, co = (e) => {
  const t = A(e, "battery_entity"), a = Math.max(0, Math.min(100, w(t?.state) ?? 0)), r = [
    ["tablet_button_usb_entity", "mdi:usb", "green", "Toggle USB"],
    ["tablet_button_motion_entity", "mdi:motion-sensor", "green", "Toggle motion"],
    ["tablet_button_display_entity", "mdi:monitor", "green", "Toggle display"],
    ["tablet_restart_entity", "mdi:restart-alert", "blue", "Restart tablet"],
    ["tablet_maintenance_entity", "mdi:account-hard-hat-outline", "orange", "Toggle maintenance mode"],
    ["tablet_reload_entity", "mdi:reload", "blue", "Reload tablet"]
  ], n = [
    ["RAM", A(e, "tablet_ram_entity")],
    ["Disk", A(e, "tablet_disk_entity")],
    ["Power", A(e, "tablet_power_entity")]
  ].flatMap(
    ([m, f]) => f ? [[m, f]] : []
  ), i = r.flatMap(
    ([m, f, y, u]) => {
      const g = A(e, m);
      return g ? [[f, y, u, g]] : [];
    }
  ), l = e.entity?.state === "on" ? "Access" : b(e.entity), d = (m, f) => {
    if (m.stopPropagation(), !f) return;
    f.entity_id.split(".")[0] === "button" ? e.service("button", "press", { entity_id: f.entity_id }) : e.service("homeassistant", "toggle", { entity_id: f.entity_id });
  };
  return e.actionSurface("custom-nik-tablet", s`
    <div class="nik-tablet-header">
      <span class="nik-tablet-icon"><ha-icon icon="mdi:tablet"></ha-icon></span>
      <span class="ulm-copy"><span class="ulm-name">${j(e.config, e.entity)}</span><span class="ulm-label">${l}</span></span>
    </div>
    ${i.length ? s`<div class="nik-tablet-controls">${i.map(([m, f, y, u]) => {
    const g = u.state.toLowerCase() === "unavailable";
    return s`<button class="tone-${f} ${O.has(u.state) ? "is-active" : ""}"
        aria-label=${y} ?disabled=${g}
        @pointerdown=${(v) => v.stopPropagation()}
        @click=${(v) => d(v, u)}>
        <ha-icon .icon=${m}></ha-icon>
      </button>`;
  })}</div>` : p}
    ${n.length ? s`<div class="nik-tablet-metrics">${n.map(([m, f]) => s`
      <span class=${f.state.toLowerCase() === "unavailable" ? "is-unavailable" : ""}><b>${b(f)}</b><small>${m}</small></span>
    `)}</div>` : p}
    ${t ? s`<div class="nik-tablet-battery-row">
      <span class="nik-tablet-battery-icon"><ha-icon icon="mdi:battery"></ha-icon></span>
      <span><b>${b(t)}</b><small>Battery</small></span>
    </div>
    <div class="nik-tablet-battery-bar"><i style=${`width:${a}%`}></i><b>${a}%</b></div>` : p}
  `);
}, Rt = (e) => e >= 6 ? ["Very high", "#d32f2f"] : e >= 5 ? ["High", "#f44336"] : e >= 4 ? ["Medium", "#ff9800"] : e >= 3 ? ["Moderate", "#fbc02d"] : e >= 2 ? ["Low", "#8bc34a"] : e >= 1 ? ["Very low", "#c5e1a5"] : ["None", "#9e9e9e"], uo = (e) => {
  const t = w(e.entity?.state) ?? 0, [a, r] = Rt(t);
  return e.actionSurface("custom-paddy-pollen", s`
    <span class="pollen-icon" style=${`--pollen:${r}`}><ha-icon .icon=${e.config.icon || "mdi:flower-pollen"}></ha-icon></span>
    ${De(e, a)}
  `);
}, _o = (e) => {
  const t = w(h(e.entity, "daysTo")), a = t === 0 || t === 1 || e.entity?.state === "unavailable", r = t === 0 ? "is-today" : t === 1 ? "is-tomorrow" : e.entity?.state === "unavailable" ? "is-unavailable" : "";
  return e.actionSurface(`custom-paddy-waste ${a ? "is-warning" : ""} ${r}`, s`
    <span class="paddy-waste-icon">${x(e, "mdi:trash-can", a ? "red" : "green")}${a ? s`<i><ha-icon icon="mdi:exclamation"></ha-icon></i>` : p}</span>
    ${De(e)}
  `);
}, mo = (e) => {
  const t = A(e, "time_entity") ?? $(e, "ulm_custom_card_paddy_welcome_time"), a = t?.state && /^\d\d:\d\d/.test(t.state) ? t.state : (/* @__PURE__ */ new Date()).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: !1 }), r = a > "18:00" ? c(e, "ulm_evening") || "Good evening" : a > "12:00" ? c(e, "ulm_afternoon") || "Good afternoon" : a > "05:00" ? c(e, "ulm_morning") || "Good morning" : c(e, "ulm_hello") || "Hello", o = A(e, "weather_entity") ?? $(e, "ulm_custom_card_paddy_welcome_weather_provider") ?? $(e, "ulm_weather"), n = e.config.variant ?? (e.config.news_entities?.length ? "news" : o ? "weather" : "message"), i = (e.config.news_entities ?? []).map((l) => e.hass.states[l]).filter(Boolean).slice(0, 3);
  return e.actionSurface("custom-paddy-welcome", s`
    <div class="paddy-welcome-message">${r},<br>${e.config.name || j(e.config, e.entity)}!</div>
    ${n === "weather" && o ? s`
      <button class="paddy-welcome-weather" aria-label="Open weather details"
        @pointerdown=${(l) => l.stopPropagation()}
        @click=${(l) => q(l, e, { action: "more-info" }, o.entity_id)}>
        <span><ha-icon .icon=${We[o.state]?.[0] || "mdi:weather-partly-cloudy"}></ha-icon>
          <b>${o.state.replaceAll("-", " ")}</b><small>${j({ entity: o.entity_id }, o)}</small></span>
        <strong>${h(o, "temperature") ?? "—"}°</strong>
      </button>
    ` : p}
    ${n === "news" ? s`
      <div class="paddy-welcome-news">
        ${i.map((l) => s`<button
          @pointerdown=${(d) => d.stopPropagation()}
          @click=${(d) => q(d, e, { action: "more-info" }, l.entity_id)}>
          <ha-icon .icon=${String(h(l, "icon") || "mdi:information-outline")}></ha-icon>
          <span><b>${j({ entity: l.entity_id }, l)}</b><small>${b(l)}</small></span>
        </button>`)}
        ${i.length === 0 ? s`<span class="paddy-welcome-empty">No configured news entities</span>` : p}
      </div>
    ` : p}
  `);
}, po = (e) => {
  const t = e.config.use_entity_picture !== !1 ? h(e.entity, "entity_picture") : void 0, a = e.entity?.entity_id.split(".")[0], r = a && e.hass.localize ? e.hass.localize(`component.${a}.entity_component._.state.${e.entity?.state}`) : void 0;
  return e.actionSurface("custom-person-chip", s`
    ${t ? s`<span class="person-chip-picture" style=${`background-image:url("${String(t)}")`}></span>` : s`<span><ha-icon icon="mdi:face-man"></ha-icon></span>`}
    <b>${r || b(e.entity)}</b>
  `);
}, ho = (e) => {
  const t = e.config.variant === "small", a = $(e, "ulm_card_person_battery_entity") ?? A(e, "battery_entity"), r = $(e, "ulm_card_person_battery_state_entity"), o = $(e, "ulm_card_person_driving_entity"), n = $(e, "ulm_card_person_zone1"), i = $(e, "ulm_card_person_zone2"), l = $(e, "ulm_address"), d = $(e, "ulm_address_locality"), m = $(e, "ulm_card_person_commute_entity"), y = c(e, "ulm_card_person_use_entity_picture", "use_entity_picture") ?? t ? String(h(e.entity, "entity_picture") || "") : "", u = w(a?.state), g = r?.state.toLowerCase() === "charging", v = c(e, "ulm_card_battery_battery_level_danger") ?? 15, V = c(e, "ulm_card_battery_battery_level_warning") ?? 30, E = u === void 0 ? "grey" : u <= v ? "red" : u <= V ? "yellow" : "green", z = u === void 0 ? "mdi:battery-off" : g ? "mdi:battery-charging" : u >= 95 ? "mdi:battery" : u < 10 ? "mdi:battery-outline" : `mdi:battery-${Math.floor(u / 10) * 10}`, D = e.entity?.state ?? "unknown", N = [n, i].find((M) => M?.attributes.friendly_name === D), H = o?.state === "on", ee = H ? "mdi:car" : D === "home" ? "mdi:home-variant" : N ? String(h(N, "icon") || "mdi:map-marker") : "mdi:home-minus", W = H ? "red" : D === "home" ? "blue" : "yellow", T = l ? b(l) : d && typeof h(d, "Locality") == "string" ? String(h(d, "Locality")) : H ? `Driving - ${D.replaceAll("_", " ")}` : D.replaceAll("_", " "), de = s`
    <span class="person-info-avatar ${y ? "has-picture" : ""}" style=${y ? `background-image:url("${y}")` : ""}>
      ${y ? p : s`<ha-icon .icon=${c(e, "ulm_card_person_icon") || "mdi:face-man"}></ha-icon>`}
      <i class="person-info-badge tone-${W}"><ha-icon .icon=${ee}></ha-icon></i>
    </span>`;
  if (t) return e.actionSurface("custom-person-info-small is-compact", s`
    <div class="person-info-small-top">
      ${de}
      <span class="person-info-small-battery tone-${E}">
        <ha-icon .icon=${z}></ha-icon>
      </span>
    </div>
    <span class="person-info-small-copy">
      <b>${j(e.config, e.entity)}</b>
      <small>${T}</small>
    </span>
  `);
  const we = c(e, "ulm_multiline") ?? !0;
  return e.actionSurface(`custom-person-info ${we ? "is-multiline" : "is-inline"}`, s`
    <div class="person-info-main">
      ${de}
      <span class="ulm-copy">
        <span class="ulm-name">${j(e.config, e.entity)}</span>
        <span class="ulm-label">${T}</span>
      </span>
    </div>
    <div class="person-info-details">
      ${a ? s`<span class="person-info-detail tone-${E}"><ha-icon .icon=${z}></ha-icon><b>${u ?? "—"}%</b></span>` : p}
      ${m ? s`<span class="person-info-detail commute-detail"><ha-icon .icon=${c(e, "ulm_card_person_cummute_icon") || "mdi:car"}></ha-icon><b>${b(m)}${m.attributes.unit_of_measurement ? "" : " min"}</b></span>` : p}
    </div>
  `);
}, bo = (e) => {
  const t = e.entity?.state ?? "unknown", a = h(e.entity, "entity_picture"), r = t !== "unknown" && t !== "standby" && a;
  return e.actionSurface(`custom-console-card platform-playstation state-${t} ${r ? "has-artwork" : ""}`, s`
    ${r ? s`<div class="console-backdrop" style=${`background-image:url("${String(a)}")`}></div>` : p}
    <div class="console-content">
      <span class="console-logo"><ha-icon .icon=${e.config.icon || "mdi:sony-playstation"}></ha-icon></span>
      <span class="ulm-copy">
        <span class="ulm-name">${r ? String(h(e.entity, "media_title") || j(e.config, e.entity)) : j(e.config, e.entity)}</span>
        <span class="ulm-label">${r ? String(h(e.entity, "friendly_name") || b(e.entity)) : b(e.entity)}</span>
      </span>
    </div>
  `);
}, go = (e) => {
  const t = w(h(e.entity, "brightness")), a = t === void 0 ? void 0 : Math.round(t / 2.55), r = e.entity?.state === "unavailable" || a === void 0 ? "Unavailable" : a >= 51 ? "Comfort" : a >= 41 ? "Comfort -1°C" : a >= 31 ? "Comfort -2°C" : a >= 21 ? "Eco" : a >= 11 ? "Frost protection" : "Off";
  return e.actionSurface("custom-qubino", s`
    <span class="ulm-icon tone-blue"><ha-icon .icon=${e.config.icon || "mdi:memory"}></ha-icon></span>
    ${P(e, a === void 0 ? r : `${r} · ${a}`)}
  `);
}, yo = (e) => {
  const t = c(e, "ulm_custom_card_ristou_use_entity_picture") === !0, a = c(e, "ulm_custom_card_ristou_use_badge") !== !1, r = t ? String(h(e.entity, "entity_picture") || "") : "", o = $(e, "ulm_custom_card_ristou_person_driving_entity"), n = o?.state === "on" || o?.state === "true", l = (c(e, "ulm_custom_card_ristou_zones") ?? []).map((z) => e.hass.states[z]).find((z) => z?.attributes.friendly_name === e.entity?.state), d = n ? "mdi:car" : e.entity?.state === "home" ? "mdi:home-variant" : e.entity?.state === "not_home" ? "mdi:home-minus" : String(h(l, "icon") || "mdi:help-circle"), m = n ? "red" : e.entity?.state === "home" ? "green" : l ? "yellow" : "blue", f = n ? c(e, "ulm_custom_card_ristou_person_driving") || "Driving" : b(e.entity), y = c(e, "ulm_custom_card_ristou_find_device_script"), u = $(e, "ulm_custom_card_ristou_camera_entity_light"), g = $(e, "ulm_custom_card_ristou_camera_entity_dark"), v = u && g ? u : void 0, V = v ? String(h(v, "entity_picture") || `/api/camera_proxy/${v.entity_id}`) : "", E = c(e, "ulm_custom_card_ristou_map_enable") === !0;
  return e.actionSurface("custom-ristou-person", s`
    <div class="ristou-person-main">
      <span class="ristou-person-avatar ${r ? "has-picture" : ""}" style=${r ? `background-image:url("${r}")` : ""}>
        ${r ? p : s`<ha-icon .icon=${a ? "mdi:face-man" : d}></ha-icon>`}
        ${a ? s`<i class=${`tone-${m}`}><ha-icon .icon=${d}></ha-icon></i>` : p}
      </span>
      <span class="ulm-copy"><span class="ulm-name">${c(e, "ulm_custom_card_ristou_name") || j(e.config, e.entity)}</span><span class="ulm-label">${f}</span></span>
      ${y ? s`<button class="ristou-find-device" aria-label="Find device"
        @pointerdown=${(z) => z.stopPropagation()}
        @click=${(z) => {
    z.stopPropagation(), e.service("homeassistant", "toggle", { entity_id: y });
  }}>
        <ha-icon .icon=${c(e, "ulm_custom_card_ristou_icon") || "mdi:cellphone-sound"}></ha-icon>
      </button>` : p}
    </div>
    ${V ? s`<div class="ristou-camera" style=${`background-image:url("${V}")`}></div>` : p}
    ${E ? s`<div class="ristou-map" style=${`aspect-ratio:${String(c(e, "ulm_custom_card_ristou_map_aspect_ratio") || "466 / 200").replace(":", " / ")}`}>
      <ha-icon icon="mdi:map-marker-path"></ha-icon><span>${f}</span>
    </div>` : p}
  `);
}, fo = (e) => {
  const t = e.entity?.state === "on", a = w(h(e.entity, "percentage")) ?? 0, r = Array.isArray(h(e.entity, "preset_modes")) ? h(e.entity, "preset_modes") : [];
  return e.actionSurface("custom-saxel-fan", s`
    <div class="custom-card-heading">${x(e, "mdi:fan", t ? "blue" : "grey", t ? "spin" : void 0)}${P(e, `${b(e.entity)} · ${a}%`)}</div>
    <div class="fan-speed-row">${[33, 66, 100].map((o, n) => s`<button class=${a >= o - 10 ? "is-active" : ""} @pointerdown=${(i) => i.stopPropagation()} @click=${(i) => {
    i.stopPropagation(), e.service("fan", "set_percentage", { entity_id: e.config.entity, percentage: o });
  }}><ha-icon .icon=${`mdi:fan-speed-${n + 1}`}></ha-icon></button>`)}</div>
    ${r.length ? s`<div class="fan-preset-row">${r.slice(0, 4).map((o) => s`<button class=${h(e.entity, "preset_mode") === o ? "is-active" : ""} @pointerdown=${(n) => n.stopPropagation()} @click=${(n) => {
    n.stopPropagation(), e.service("fan", "set_preset_mode", { entity_id: e.config.entity, preset_mode: o });
  }}>${o}</button>`)}</div>` : p}
  `);
}, vo = (e) => {
  const t = U(e).slice(0, 5);
  return e.actionSurface("custom-scenes-grid", s`
    ${t.map((a, r) => s`
      <button @pointerdown=${(o) => o.stopPropagation()} @click=${(o) => {
    o.stopPropagation(), e.service(a.entity_id.split(".")[0], "turn_on", { entity_id: a.entity_id });
  }}>
        <span style=${`--tone:${["255,193,7", "33,150,243", "156,39,176", "76,175,80", "244,67,54"][r]}`}><ha-icon .icon=${String(h(a, "icon") || "mdi:palette")}></ha-icon></span>
        <small>${j({ entity: a.entity_id }, a)}</small>
      </button>
    `)}
  `);
}, wo = (e) => {
  const t = U(e), a = $(e, "ulm_custom_card_schumijo_car_fuel") ?? t[0], r = $(e, "ulm_custom_card_schumijo_car_range") ?? e.entity, o = $(e, "ulm_custom_card_schumijo_car_lock") ?? t.find((n) => n.entity_id.startsWith("lock.")) ?? t[2];
  return e.actionSurface("custom-schumijo-car", s`
    <div class="car-hero">${x(e, "mdi:car", "blue")}${P(e, b(e.entity))}<ha-icon .icon=${o?.state === "locked" ? "mdi:lock" : "mdi:lock-open"}></ha-icon></div>
    <div class="car-metrics"><span><ha-icon icon="mdi:gas-station"></ha-icon><b>${b(a)}</b></span><span><ha-icon icon="mdi:map-marker-distance"></ha-icon><b>${b(r)}</b></span></div>
  `);
}, $o = (e) => {
  const t = U(e), a = $(e, "ulm_custom_card_schumijo_flower_moisture") ?? e.entity, r = $(e, "ulm_custom_card_schumijo_flower_conductivity") ?? t[0], o = $(e, "ulm_custom_card_schumijo_flower_temperature") ?? t[1], n = $(e, "ulm_custom_card_schumijo_flower_brightness") ?? t[2];
  return e.actionSurface("custom-schumijo-flower", s`
    <div class="flower-heading">${x(e, "mdi:flower", "green")}${P(e, b(e.entity))}</div>
    <div class="flower-metrics">${[["mdi:water-percent", a], ["mdi:flash", r], ["mdi:thermometer", o], ["mdi:white-balance-sunny", n]].map(([i, l]) => s`<span><ha-icon .icon=${i}></ha-icon><b>${b(l)}</b></span>`)}</div>
  `);
}, ko = (e) => {
  const t = e.entity?.state === "on", a = $(e, "ulm_custom_card_senoro_win_battery") ?? U(e)[0];
  return e.actionSurface(`custom-senoro-window ${t ? "is-open" : ""}`, s`
    ${x(e, t ? "mdi:window-open-variant" : "mdi:window-closed-variant", t ? "red" : "green")}
    ${P(e, b(e.entity))}
    <span class="window-battery"><ha-icon icon="mdi:battery"></ha-icon>${b(a)}</span>
  `);
}, Vo = (e) => {
  const t = U(e).slice(0, 6), a = ["#111", "#111", "#ffdf55", "#ef4778", "#4a86db", "#8b69bc"], r = ["BK", "B", "Y", "M", "C", "PB"];
  return e.actionSurface("custom-sisimomo-printer", s`
    <div class="printer-summary">${x(e, "mdi:printer", "blue")}${P(e, b(e.entity))}</div>
    <div class="printer-cartridges">${t.map((o, n) => {
    const i = Math.max(0, Math.min(100, w(o.state) ?? 0));
    return s`<span style=${`--cartridge:${a[n]};--level:${i}%`}><small>${r[n]}</small><i><em></em></i><b>${b(o)}</b></span>`;
  })}</div>
  `);
}, xo = (e) => {
  const t = U(e), a = [e.entity, ...t].filter(Boolean).slice(0, 3);
  return e.actionSurface("custom-speedtest-shogun", s`
    <div class="speedtest-three">${a.map((r, o) => s`<span><ha-icon .icon=${["mdi:download", "mdi:upload", "mdi:timer-outline"][o]}></ha-icon><b>${b(r)}</b><small>${j({ entity: r.entity_id }, r)}</small></span>`)}</div>
    <div class="speedtest-chart">${ve(e)}</div>
  `);
}, Io = (e) => {
  const t = w(h(e.entity, "current_temperature")), a = w(h(e.entity, "temperature")), r = String(h(e.entity, "fan_mode") || ""), o = String(h(e.entity, "swing_mode") || "");
  return e.actionSurface("custom-tpx-aircondition", s`
    <div class="aircondition-main">${x(e, "mdi:air-conditioner", e.entity?.state === "off" ? "grey" : "blue")}${P(e, `${t ?? "—"}° · ${e.entity?.state || "unknown"}`)}<b>${a ?? "—"}°</b></div>
    <div class="aircondition-controls">
      ${k("Decrease", "mdi:minus", (n) => {
    n.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: (a ?? 20) - 0.5 });
  })}
      <span><ha-icon icon="mdi:fan"></ha-icon>${r || "Auto"}</span>
      <span><ha-icon icon="mdi:arrow-up-down"></ha-icon>${o || "Off"}</span>
      ${k("Increase", "mdi:plus", (n) => {
    n.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: (a ?? 20) + 0.5 });
  })}
    </div>
  `);
}, So = (e) => {
  const t = $(e, "ulm_custom_card_vncntdev_device_tracer_person"), a = $(e, "ulm_custom_card_vncntdev_device_tracer_battery") ?? U(e)[0], r = $(e, "ulm_custom_card_vncntdev_device_tracer_source") ?? U(e)[1];
  return e.actionSurface("custom-device-tracer", s`
    <span class="device-tracer-icon"><ha-icon icon="mdi:cellphone-marker"></ha-icon></span>
    ${P(e, `${b(e.entity)}${t ? ` · ${b(t)}` : ""}`)}
    <div class="device-tracer-meta"><span><ha-icon icon="mdi:battery"></ha-icon>${b(a)}</span><span><ha-icon icon="mdi:crosshairs-gps"></ha-icon>${b(r)}</span></div>
  `);
}, Po = (e) => {
  const t = w(h(e.entity, "current_temperature")), a = w(h(e.entity, "temperature")) ?? w(e.entity?.state);
  return e.actionSurface("custom-water-heater", s`
    <div class="water-heater-top">${x(e, "mdi:water-boiler", e.entity?.state === "off" ? "grey" : "red")}${P(e, `Current ${t ?? "—"}°`)}<b>${a ?? "—"}°</b></div>
    <div class="water-heater-controls">
      ${k("Decrease temperature", "mdi:minus", (r) => {
    r.stopPropagation(), e.service("water_heater", "set_temperature", { entity_id: e.config.entity, temperature: (a ?? 50) - 1 });
  })}
      <span>${b(e.entity)}</span>
      ${k("Increase temperature", "mdi:plus", (r) => {
    r.stopPropagation(), e.service("water_heater", "set_temperature", { entity_id: e.config.entity, temperature: (a ?? 50) + 1 });
  })}
    </div>
  `);
}, Ao = (e) => {
  const t = e.config.variant === "divider-subtitle";
  return s`<div class=${`custom-wilbiev-title ${t ? "is-subtitle" : ""}`}><span></span><b>${e.config.name || (t ? "Subtitle" : "Title")}</b><span></span></div>`;
}, zo = (e) => {
  const t = [e.entity, ...U(e)].filter(Boolean).slice(0, 3);
  return e.actionSurface("custom-wsly-pollen", s`
    ${t.map((a, r) => {
    const [o, n] = Rt(w(a.state) ?? 0);
    return s`<span style=${`--pollen:${n}`}><ha-icon .icon=${["mdi:tree", "mdi:grass", "mdi:flower-pollen"][r]}></ha-icon><b>${b(a)}</b><small>${o}</small></span>`;
  })}
  `);
}, jo = (e) => {
  const t = w(e.entity?.state) ?? 0, a = c(e, "ulm_custom_card_yagrasdemonde_lights_count_type") || "light", r = { light: t === 0 ? "mdi:lightbulb-outline" : "mdi:lightbulb-on", switch: "mdi:toggle-switch", cover: "mdi:blinds" }, o = t === 1 ? a : `${a}s`;
  return e.actionSurface("custom-lights-count", s`${x(e, r[a] || r.light, t > 0 ? "yellow" : "grey")}${P(e, `${t} ${o} on`)}`);
}, $t = (e) => e.actionSurface(`ulm-row ulm-generic ${c(e, "ulm_card_generic_force_background_color") === !0 ? "force-background" : ""}`, s`
  ${x(e, "mdi:information-outline", O.has(e.entity?.state ?? "") ? "blue" : "grey")}
  ${De(e)}
`), Do = (e) => e.actionSurface(`ulm-row ulm-generic-swap ${c(e, "ulm_card_generic_swap_force_background_color") === !0 ? "force-background" : ""}`, s`
  ${P(e, b(e.entity))}
  ${x(e, "mdi:information-outline", O.has(e.entity?.state ?? "") ? "blue" : "grey")}
`), Co = (e) => e.actionSurface("ulm-title", s`
  <span class="ulm-copy">
    <span class="ulm-name">${e.config.name || "Title"}</span>
    ${e.config.secondary ? s`<span class="ulm-label">${e.config.secondary}</span>` : p}
  </span>
`), Eo = (e) => {
  const t = c(e, "ulm_card_vertical_button_state", "active_state") || "on", a = e.entity?.state === t, r = e.config.entity?.split(".", 1)[0], o = {
    automation: "mdi:robot",
    button: "mdi:gesture-tap-button",
    fan: "mdi:fan",
    input_boolean: "mdi:toggle-switch",
    input_button: "mdi:gesture-tap-button",
    input_select: "mdi:format-list-bulleted",
    light: "mdi:lightbulb",
    lock: "mdi:lock",
    script: "mdi:script-text",
    switch: "mdi:toggle-switch",
    vacuum: "mdi:robot-vacuum"
  }, n = e.config.icon || e.entity?.attributes.icon || o[r ?? ""] || "mdi:gesture-tap-button", i = String(h(e.entity, "value") ?? e.config.secondary ?? ""), l = r === "input_select" ? t : r === "input_boolean" ? "" : b(e.entity), d = (m) => {
    m.stopPropagation(), e.config.entity && (r === "input_select" ? e.service("input_select", "select_option", { entity_id: e.config.entity, option: t }) : r === "input_button" || r === "button" ? e.service(r, "press", { entity_id: e.config.entity }) : r === "lock" ? e.service("lock", e.entity?.state === "locked" ? "unlock" : "lock", { entity_id: e.config.entity }) : r && e.service(r, "toggle", { entity_id: e.config.entity }));
  };
  return e.actionSurface(`ulm-vertical-button ${a ? "is-active" : ""}`, s`
    <button class="vertical-button-control" aria-label="Activate" @pointerdown=${(m) => m.stopPropagation()} @click=${d}>
      ${e.config.icon_type === "none" || e.config.show_icon === !1 ? p : s`<span class=${`ulm-icon tone-${a ? c(e, "ulm_card_vertical_button_color") || "blue" : "grey"}`}><ha-icon .icon=${n}></ha-icon></span>`}
      <span class="ulm-name">${l}</span>
      ${i ? s`<span class="ulm-label">${i}</span>` : p}
    </button>
  `);
}, Mo = (e, t = !1) => {
  const a = e.entity?.state === "on", r = c(
    e,
    t ? "ulm_card_binary_sensor_alert_show_last_changed" : "ulm_card_binary_sensor_show_last_changed"
  ) === !0, o = t ? "ulm_card_binary_sensor_alert" : "ulm_card_binary_sensor", n = B(c(e, `${o}_color`), "rgba(var(--color-blue, 3, 169, 244), 1)"), i = c(e, `${o}_icon`) || String(h(e.entity, "icon") ?? "mdi:radiobox-marked"), l = c(e, `${o}_name`), d = c(e, `${o}_force_background_color`) === !0 && a, m = r && e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : b(e.entity);
  return e.actionSurface(`ulm-row ulm-binary ${a ? "is-active" : ""} ${t ? "is-alert" : ""} ${d ? "is-source-background" : ""}`, s`
    <span class="source-icon-wrap">
      ${fe(e, i, n, a)}
      ${t && a ? s`<ha-icon class="binary-alert-badge" .icon=${"mdi:alert-circle"}></ha-icon>` : p}
    </span>
    <span class="ulm-copy">
      <span class="ulm-name">${l || Ie(e)}</span>
      <span class="ulm-label">${m}</span>
    </span>
  `);
}, To = (e) => {
  const t = e.entity?.state === "on", a = B(c(e, "ulm_card_input_boolean_color"), "rgba(var(--color-blue, 3, 169, 244), 1)"), r = c(e, "ulm_card_input_boolean_icon") || String(h(e.entity, "icon") ?? "mdi:toggle-switch"), o = c(e, "ulm_card_input_boolean_name"), n = c(e, "ulm_card_input_boolean_force_background_color") === !0 && t;
  return e.actionSurface(`ulm-row ulm-simple-default ulm-input-boolean ${t ? "is-active" : ""} ${n ? "is-source-background" : ""}`, s`
    ${fe(e, r, a, t)}
    <span class="ulm-copy">
      <span class="ulm-name">${o || Ie(e)}</span>
      <span class="ulm-label">${b(e.entity)}</span>
    </span>
  `);
}, Lo = (e) => e.actionSurface("ulm-default-graph", s`
  <div class="metric-heading">${x(e, "mdi:chart-line", "red")}${De(e)}</div>
  ${ve(e, !0)}
`), qo = (e) => {
  switch (e.descriptor.upstreamId) {
    case "card_battery":
      return ar(e);
    case "card_binary_sensor":
      return Mo(e, e.config.variant === "alert");
    case "card_graph":
      return Lo(e);
    case "card_input_boolean":
      return To(e);
    case "card_light":
      return ht(e);
    case "card_media_player":
      return yt(e);
    case "card_navigate":
      return _r(e);
    case "card_power_outlet":
      return hr(e);
    case "card_script":
      return br(e);
    case "card_title":
      return Co(e);
    case "card_vacuum":
      return cr(e);
    case "card_vertical_button":
      return Eo(e);
    case "card_generic":
      return e.config.variant === "swapped" ? Do(e) : $t(e);
    case "custom_card_afvalophaling":
      return Ir(e);
    case "custom_card_alarm_time":
      return Sr(e);
    case "custom_card_apexcharts":
      return Pr(e);
    case "custom_card_chromecast":
      return Ar(e);
    case "custom_card_damix48_power_details":
      return zr(e);
    case "custom_card_device_tracker":
      return jr(e);
    case "custom_card_drealine_roomview":
      return Dr(e);
    case "custom_card_eraycetinay_elapsed_time":
      return Er(e);
    case "custom_card_eraycetinay_lock":
      return Mr(e);
    case "custom_card_esh_room":
      return Lr(e);
    case "custom_card_esh_welcome":
      return Tr(e);
    case "custom_card_haven_washer":
      return qr(e);
    case "custom_card_heat_pump":
      return Fr(e);
    case "custom_card_homeassistant_updates":
      return Rr(e);
    case "custom_card_httpedo13_sun":
      return Ur(e);
    case "custom_card_httpedo13_thermostat":
      return Or(e);
    case "custom_card_iAbadia_battery_chip":
      return Br(e);
    case "custom_card_imswel_medias":
      return Nr(e);
    case "custom_card_imswel_person":
      return Hr(e);
    case "custom_card_input_datetime":
      return Wr(e);
    case "custom_card_input_number":
      return Gr(e);
    case "custom_card_irmajavi_entities":
      return Kr(e);
    case "custom_card_irmajavi_speedtest":
      return Yr(e);
    case "custom_card_irmajavi_weather":
      return Zr(e);
    case "custom_card_light_colorpick":
      return Jr(e);
    case "custom_card_media_player_sonos":
      return Qr(e);
    case "custom_card_more_power_outlet":
      return Xr(e);
    case "custom_card_mpse_gauge":
      return eo(e);
    case "custom_card_mpse_printer":
      return to(e);
    case "custom_card_mpse_thermostat":
      return ao(e);
    case "custom_card_mpse_wifisignal":
      return ro(e);
    case "custom_card_nas":
      return oo(e);
    case "custom_card_neekster_update":
      return no(e);
    case "custom_card_nik_clock":
      return io(e);
    case "custom_card_nik_door":
      return so(e);
    case "custom_card_nik_nas":
      return lo(e);
    case "custom_card_nik_tablet":
      return co(e);
    case "custom_card_paddy_dwd_pollen":
      return uo(e);
    case "custom_card_paddy_waste_collection":
      return _o(e);
    case "custom_card_paddy_welcome":
      return mo(e);
    case "custom_card_person_chip":
      return po(e);
    case "custom_card_person_info":
    case "custom_card_person_info_small":
      return ho(e);
    case "custom_card_playstation":
      return bo(e);
    case "custom_card_qubino":
      return go(e);
    case "custom_card_ristou_person":
      return yo(e);
    case "custom_card_saxel_fan":
      return fo(e);
    case "custom_card_scenes":
      return vo(e);
    case "custom_card_schumijo_car":
      return wo(e);
    case "custom_card_schumijo_flower":
      return $o(e);
    case "custom_card_senoro_win":
      return ko(e);
    case "custom_card_sisimomo_printer":
      return Vo(e);
    case "custom_card_speedtest_shogun160":
      return xo(e);
    case "custom_card_tpx01_aircondition":
      return Io(e);
    case "custom_card_vncntdev_device_tracer":
      return So(e);
    case "custom_card_water_heater":
      return Po(e);
    case "custom_card_wilbiev_title":
    case "custom_card_wilbiev_subtitle":
      return Ao(e);
    case "custom_card_wsly_pollen":
      return zo(e);
    case "custom_card_yagrasdemonde_lights_count":
      return jo(e);
    case "card_room":
      return yr(e);
  }
  if (/afval/.test(e.descriptor.upstreamId)) return wr(e);
  if (/printer/.test(e.descriptor.upstreamId)) return $r(e);
  if (/gauge/.test(e.descriptor.upstreamId)) return kr(e);
  if (/schumijo_(car|flower)|irmajavi_entities|damix48_power_details/.test(e.descriptor.upstreamId))
    return vr(e, /car/.test(e.descriptor.upstreamId) ? "mdi:car" : /flower/.test(e.descriptor.upstreamId) ? "mdi:flower" : "mdi:view-grid", "purple");
  switch (e.descriptor.family) {
    case "weather":
      return Ja(e);
    case "climate":
      return Xa(e);
    case "light":
      return ht(e);
    case "scene":
      return ir(e);
    case "presence":
      return er(e);
    case "battery":
      return tr(e);
    case "bar":
      return rr(e);
    case "energy":
    case "sensor":
      return or(e);
    case "media":
      return yt(e);
    case "cover":
      return sr(e);
    case "vacuum":
      return lr(e);
    case "security":
      return dr(e);
    case "navigation":
      return ur(e);
    case "control":
      return e.config.entity?.startsWith("fan.") ? gr(e) : pr(e);
    case "alarm-time":
      return Vr(e);
    case "door":
      return xr(e);
    case "camera":
      return fr(e);
    default:
      return $t(e);
  }
};
var Fo = Object.defineProperty, Ut = (e, t, a, r) => {
  for (var o = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (o = i(t, a, o) || o);
  return o && Fo(t, a, o), o;
};
const Ge = class Ge extends oe {
  constructor() {
    super(...arguments), this.holdFired = !1, this.forecastGeneration = 0, this.forecast = [], this.actionSurface = (t, a) => {
      const r = this.descriptor ? Ne.get(this.descriptor.upstreamId) : void 0;
      if (!r)
        throw new Error(`Missing explicit parity renderer mapping for ${this.descriptor?.upstreamId}`);
      const o = r ? ` parity-${r.rendererId.replaceAll("_", "-")}` : "", n = this.config?.layout && this.config.layout !== "default" ? ` layout-${this.config.layout}` : "", i = this.config?.fill_container ? " fill-container" : "", l = this.config?.variant ? ` variant-${this.config.variant}` : "", d = s`
      <div class="${t}${o}${n}${i}${l} action-surface" role="button" tabindex="0"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        ${a}
      </div>`;
      return s`<ha-card class="minimalist-card">${d}</ha-card>`;
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
    const a = ka(t), r = this.forecastKey(this.config);
    this.config = a, r !== this.forecastKey(a) && this.stopForecastSubscription(), this.requestUpdate(), this.subscribeForecast();
  }
  static async getConfigElement() {
    return document.createElement("mushroom-addition-editor");
  }
  static getStubConfig() {
    return { type: "custom:mushroom-addition-card-generic", show_icon: !0, show_state: !0 };
  }
  getCardSize() {
    return ["weather", "climate", "scene", "energy", "sensor"].includes(this.descriptor?.family ?? "") ? 2 : 1;
  }
  render() {
    if (!this.config || !this.descriptor) return p;
    if (!this.hass) return s`<ha-card><div class="preview">Mushroom Addition preview</div></ha-card>`;
    const t = this.config.entity ? this.hass.states[this.config.entity] : void 0;
    return qo({
      config: this.config,
      descriptor: this.descriptor,
      hass: this.hass,
      entity: t,
      forecast: this.forecast,
      actionSurface: this.actionSurface,
      service: (a, r, o) => {
        this.hass?.callService(a, r, o);
      }
    });
  }
  updated() {
    this.subscribeForecast();
  }
  disconnectedCallback() {
    this.stopForecastSubscription(), super.disconnectedCallback();
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
    const a = this.forecastGeneration;
    try {
      const r = await this.hass.connection.subscribeMessage((o) => {
        a !== this.forecastGeneration || t !== this.forecastSubscriptionKey || (this.forecast = o.forecast ?? [], this.requestUpdate());
      }, {
        type: "weather/subscribe_forecast",
        entity_id: this.config.entity,
        forecast_type: "daily"
      });
      a !== this.forecastGeneration || t !== this.forecastSubscriptionKey ? r() : this.unsubscribeForecast = r;
    } catch (r) {
      a === this.forecastGeneration && (this.forecastSubscriptionKey = void 0), console.warn("Mushroom Cards Addition: unable to load weather forecast", r);
    }
  }
  runAction(t) {
    if (!this.hass || !this.config) return;
    const a = t === "tap_action" ? "tap" : t === "hold_action" ? "hold" : "double_tap", r = this.config[t], o = typeof r?.entity == "string" ? r.entity : void 0;
    $a(this, o ? { ...this.config, entity: o } : this.config, a);
  }
};
Ge.styles = Ka;
let ce = Ge;
Ut([
  Ae({ attribute: !1 })
], ce.prototype, "hass");
Ut([
  Ae({ attribute: !1 })
], ce.prototype, "config");
const Ro = (e, t, a = [], r = []) => {
  const o = [...a, ...r, ...Object.keys(t?.states ?? {})], n = [...new Set(o)].filter((i) => t?.states?.[i] !== void 0);
  for (const i of e.preferredDomains ?? []) {
    const l = n.find((d) => d.startsWith(`${i}.`));
    if (l) return l;
  }
  return n[0];
}, kt = (e) => e.name.replace(/ (Card|Chip)$/, ""), Ot = (e, t, a = [], r = []) => {
  const o = [.../* @__PURE__ */ new Set([...a, ...r, ...Object.keys(t?.states ?? {})])].filter((g) => t?.states?.[g] !== void 0), n = (g, v) => o.find((V) => g.some((E) => V.startsWith(`${E}.`)) && v.every((E) => V.toLowerCase().includes(E))), i = (g, v, V) => o.find((E) => g.some((z) => E.startsWith(`${z}.`)) && v.every((z) => E.toLowerCase().includes(z)) && V.every((z) => !E.toLowerCase().includes(z))), l = e.upstreamId === "card_title" ? void 0 : e.upstreamId === "card_vertical_button" ? n(["light"], []) ?? n(["switch", "input_boolean", "fan", "vacuum", "script", "button", "lock"], []) : e.upstreamId === "card_generic" ? n(["sensor"], ["bedroom", "temperature"]) : e.upstreamId === "card_graph" ? n(["sensor"], ["cv", "plug", "power"]) : e.upstreamId === "card_light" ? n(["light"], ["joris", "iris"]) : e.upstreamId === "card_media_player" ? n(["media_player"], ["office", "joris", "tv"]) : e.upstreamId === "card_battery" ? i(["sensor"], ["battery", "level"], ["state", "charging"]) : e.upstreamId === "card_binary_sensor" ? n(["binary_sensor"], ["all", "doors"]) ?? n(["binary_sensor"], ["door"]) : e.upstreamId === "card_cover" ? n(["cover"], ["sunscreen"]) : e.upstreamId === "card_fan" ? n(["fan"], ["air", "purifier"]) : e.upstreamId === "card_input_boolean" ? n(["input_boolean"], ["dropdown", "welcome"]) : e.upstreamId === "custom_card_nik_tablet" ? n(["binary_sensor", "sensor", "switch"], ["tablet"]) : e.upstreamId === "custom_card_homeassistant_updates" ? n(["update", "sensor", "binary_sensor"], ["core"]) : e.upstreamId === "custom_card_nik_nas" ? n(["switch", "binary_sensor"], ["nas"]) ?? n(["switch", "binary_sensor"], ["status"]) : e.upstreamId === "custom_card_haven_washer" ? n(["sensor"], ["operation", "state"]) ?? n(["sensor"], ["washer", "state"]) : e.upstreamId === "custom_card_httpedo13_sun" ? n(["sun"], []) : e.upstreamId === "custom_card_httpedo13_thermostat" ? n(["climate"], []) : e.upstreamId === "custom_card_iAbadia_battery_chip" ? n(["sensor"], ["battery", "level"]) ?? n(["sensor"], ["battery"]) : e.upstreamId === "custom_card_imswel_medias" ? n(["media_player", "sensor"], ["sonos"]) ?? n(["media_player", "sensor"], ["media"]) : e.upstreamId === "custom_card_media_player_sonos" ? n(["media_player"], ["sonos"]) : e.upstreamId === "custom_card_more_power_outlet" ? n(["switch", "light"], ["outlet"]) ?? n(["switch", "light"], ["plug"]) : e.upstreamId === "custom_card_mpse_printer" ? n(["sensor", "binary_sensor"], ["printer"]) ?? n(["sensor", "binary_sensor"], ["online"]) : e.upstreamId === "custom_card_mpse_thermostat" ? n(["climate"], []) : e.upstreamId === "custom_card_irmajavi_speedtest" ? n(["sensor"], ["download"]) : e.upstreamId === "card_room" ? n(["light"], []) : e.upstreamId === "custom_card_paddy_waste_collection" ? n(["sensor"], ["trash", "today"]) ?? n(["sensor"], ["waste"]) : e.upstreamId === "custom_card_paddy_welcome" || e.upstreamId === "custom_card_person_chip" || e.upstreamId === "custom_card_ristou_person" ? n(["person"], []) : e.upstreamId === "custom_card_playstation" ? n(["media_player"], ["tv"]) ?? n(["media_player"], []) : e.upstreamId === "custom_card_qubino" ? n(["light"], []) ?? n(["switch"], ["cv", "plug"]) : void 0, d = e.upstreamId === "custom_card_input_number" ? o.find((g) => e.preferredDomains?.some((v) => g.startsWith(`${v}.`))) : e.upstreamId === "card_scenes" || e.upstreamId === "card_title" ? void 0 : l ?? Ro(e, t, a, r), m = ["text", "navigation"].includes(e.family), f = e.variants?.[0], y = d?.split(".", 1)[0], u = ["light", "switch", "input_boolean", "fan"].includes(y ?? "") ? { action: "toggle" } : { action: d ? "more-info" : "none" };
  return {
    ...Lt(e, t, d),
    name: d ? t?.states[d]?.attributes.friendly_name : kt(e),
    secondary: d ? void 0 : m ? "Example" : "Preview",
    variant: f,
    tap_action: u,
    show_controls: ["climate", "cover", "vacuum", "control"].includes(e.family) || e.family === "media" && e.upstreamId !== "card_media_player" ? !0 : void 0,
    show_forecast: e.family === "weather",
    show_graph: ["battery", "energy", "sensor"].includes(e.family),
    ulm_card_cover_enable_controls: e.upstreamId === "card_cover" ? !0 : void 0,
    ulm_card_cover_enable_slider: e.upstreamId === "card_cover" ? !0 : void 0,
    ulm_card_fan_enable_slider: e.upstreamId === "card_fan" ? !0 : void 0,
    ulm_card_fan_enable_button: e.upstreamId === "card_fan" ? !0 : void 0,
    ulm_custom_card_bar_card_value: e.family === "bar" ? !0 : void 0,
    entities: e.variants?.includes("with-sensors") ? r.slice(0, 2) : void 0,
    ...e.upstreamId === "card_navigate" ? {
      navigation_path: "/config/updates",
      tap_action: { action: "navigate", navigation_path: "/config/updates" }
    } : {},
    ...e.upstreamId === "custom_card_homeassistant_updates" ? {
      ulm_card_homeassistant_core: n(["update", "sensor", "binary_sensor"], ["core"]) ?? d,
      ulm_card_homeassistant_supervisor: n(["update", "sensor", "binary_sensor"], ["supervisor"]),
      ulm_card_homeassistant_os: n(["update", "sensor", "binary_sensor"], ["operating", "system"]) ?? n(["update", "sensor", "binary_sensor"], ["os"])
    } : {},
    ...e.upstreamId === "custom_card_haven_washer" ? {
      power_entity: n(["sensor", "switch"], ["wasmachine", "power"]) ?? n(["sensor", "switch"], ["washer", "power"]) ?? n(["sensor", "switch"], ["power"]),
      door_entity: n(["sensor", "binary_sensor"], ["washer", "door"]) ?? n(["sensor", "binary_sensor"], ["door"]),
      finished_entity: n(["sensor", "binary_sensor"], ["washer", "finished"]) ?? n(["sensor", "binary_sensor"], ["finished"]),
      ulm_custom_card_washer_machine_state: d,
      ulm_custom_card_washer_machine_stop_state: "stop",
      ulm_custom_card_washer_label_idle: "idle",
      ulm_custom_card_washer_label_configuring: "configure",
      ulm_custom_card_washer_label_running: "run"
    } : {},
    ...e.upstreamId === "custom_card_httpedo13_sun" ? {
      darkMode: !1,
      language: t?.language ?? "en",
      showAzimuth: !1,
      showElevation: !1,
      timeFormat: "24h",
      tap_action: { action: "none" }
    } : {},
    ...e.upstreamId === "custom_card_httpedo13_thermostat" ? {
      variant: "buttons",
      tap_action: { action: "none" }
    } : {},
    ...e.upstreamId === "custom_card_iAbadia_battery_chip" ? {
      battery_state_entity: n(["sensor", "binary_sensor"], ["battery", "state"]),
      charger_type_entity: n(["sensor"], ["charger", "type"]),
      ulm_custom_card_iAbadia_battery_chip_entity: d,
      ulm_custom_card_iAbadia_battery_chip_warning: 20,
      ulm_custom_card_iAbadia_battery_chip_danger: 10
    } : {},
    ...e.upstreamId === "custom_card_imswel_medias" ? {
      secondary_entity: n(["media_player", "sensor"], ["tv"]),
      variant: d?.includes("radarr") || d?.includes("sonarr") ? "upcoming" : "library",
      ulm_custom_card_imswel_medias_index: 1,
      ulm_custom_card_imswel_medias_platform: d?.includes("sonarr") ? "sonarr" : d?.includes("radarr") ? "radarr" : "plex"
    } : {},
    ...e.upstreamId === "custom_card_nik_tablet" ? {
      tablet_button_usb_entity: n(["switch", "input_boolean"], ["tablet", "usb"]),
      tablet_button_motion_entity: n(["switch", "input_boolean"], ["tablet", "motion"]),
      tablet_button_display_entity: n(["light", "switch", "input_boolean"], ["tablet", "display"]),
      tablet_restart_entity: n(["button"], ["tablet", "restart"]),
      tablet_maintenance_entity: n(["switch", "input_boolean"], ["tablet", "maintenance"]),
      tablet_reload_entity: n(["button"], ["tablet", "reload"]),
      tablet_ram_entity: n(["sensor"], ["tablet", "ram"]),
      tablet_disk_entity: n(["sensor"], ["tablet", "disk"]),
      tablet_power_entity: n(["sensor", "binary_sensor", "switch"], ["tablet", "power"]),
      battery_entity: n(["sensor"], ["tablet", "battery"])
    } : {},
    ...e.upstreamId === "custom_card_nik_nas" ? {
      disk_entity: n(["sensor"], ["nas", "disk"]) ?? n(["sensor"], ["disk"]),
      disk_name: "Disk",
      disk_icon: "mdi:harddisk",
      disk_color: "red",
      temperature_entity: n(["sensor"], ["nas", "temp"]) ?? n(["sensor"], ["temperature"]),
      temperature_name: "Temp",
      temperature_icon: "mdi:thermometer",
      temperature_color: "orange",
      temperature_max: 100,
      memory_entity: n(["sensor"], ["nas", "memory"]) ?? n(["sensor"], ["memory"]),
      memory_name: "Memory",
      memory_icon: "mdi:memory",
      memory_color: "blue",
      memory_max: 100,
      cpu_entity: n(["sensor"], ["nas", "cpu"]) ?? n(["sensor"], ["cpu"]),
      cpu_name: "CPU",
      cpu_icon: "mdi:cpu-64-bit",
      cpu_color: "green",
      cpu_max: 100,
      graph_span: "1d",
      chart_type: "radialBar"
    } : {},
    ...e.upstreamId === "custom_card_device_tracker" ? {
      ulm_custom_card_device_tracker_tracker_1_entity: n(["device_tracker"], ["wifi"]) ?? n(["device_tracker"], ["phone"]) ?? d,
      ulm_custom_card_device_tracker_tracker_1_type: "lan",
      ulm_custom_card_device_tracker_tracker_2_entity: n(["device_tracker"], ["bluetooth"]) ?? n(["device_tracker"], ["ble"]),
      ulm_custom_card_device_tracker_tracker_2_type: "bluetooth"
    } : {},
    ...e.upstreamId === "custom_card_drealine_roomview" ? {
      entity: void 0,
      group_lights: n(["group", "light"], ["lights"]),
      group_motions: n(["group", "binary_sensor"], ["motions"]),
      group_doors: n(["group", "binary_sensor"], ["doors"]),
      group_windows: n(["group", "binary_sensor"], ["windows"]),
      group_outlets: n(["group", "switch"], ["outlets"]),
      group_tv: n(["group", "media_player"], ["tv"]),
      group_water: n(["group", "binary_sensor"], ["water"]),
      group_windows_shutters: n(["group", "cover"], ["shutters"]),
      temperature: n(["sensor"], ["room", "temperature"]) ?? n(["sensor"], ["temperature"]),
      humidity: n(["sensor"], ["room", "humidity"]) ?? n(["sensor"], ["humidity"])
    } : {},
    ...e.upstreamId === "custom_card_eraycetinay_lock" ? {
      ulm_custom_card_eraycetinay_lock_battery_level: n(["sensor", "binary_sensor"], ["lock", "battery"]),
      ulm_custom_card_eraycetinay_lock_door_open: n(["binary_sensor"], ["door"])
    } : {},
    ...e.upstreamId === "custom_card_esh_room" ? {
      ulm_custom_card_esh_room_light_entity: n(["light"], ["room"]) ?? n(["light"], []),
      ulm_custom_card_esh_room_climate_entity: n(["climate"], ["room"]) ?? n(["climate"], []),
      ulm_custom_card_esh_room_cover_entity: n(["cover"], ["room"]) ?? n(["cover"], [])
    } : {},
    ...e.upstreamId === "custom_card_esh_welcome" ? {
      ulm_card_esh_welcome_collapse: n(["input_boolean"], ["welcome"]),
      ulm_weather: n(["weather"], [])
    } : {},
    ...e.upstreamId === "custom_card_person_info" ? {
      ulm_card_person_driving_entity: n(["binary_sensor"], ["person", "driving"]),
      ulm_card_person_battery_entity: i(["sensor"], ["person", "battery"], ["state"]),
      ulm_card_person_battery_state_entity: n(["sensor", "binary_sensor"], ["person", "battery", "state"])
    } : {},
    ...e.upstreamId === "card_person" ? {
      battery_entity: n(["sensor"], ["battery"]),
      use_entity_picture: !!(d && t?.states[d]?.attributes.entity_picture)
    } : {},
    ...e.upstreamId === "card_power_outlet" ? {
      consumption_entity: n(["sensor"], ["power"])
    } : {},
    ...e.upstreamId === "card_room" ? {
      room_sensors: [
        n(["sensor"], ["illuminance"]),
        n(["sensor"], ["temperature"])
      ].filter((g) => !!g).map((g) => ({ entity: g }))
    } : {},
    ...e.upstreamId === "card_scenes" ? {
      scene_items: o.filter((g) => g.startsWith("scene.")).slice(0, 7).map((g) => ({ entity: g }))
    } : {},
    ...e.upstreamId === "card_thermostat" ? {
      show_controls: !0,
      ulm_card_thermostat_enable_controls: !0,
      ulm_card_thermostat_enable_display_temperature: !0
    } : {},
    ...e.upstreamId === "card_title" ? {
      name: "Living room",
      secondary: "Lights and climate",
      tap_action: { action: "none" }
    } : {},
    ...e.upstreamId === "card_vertical_button" ? {
      icon: void 0,
      ulm_card_vertical_button_color: "blue",
      ulm_card_vertical_button_state: "on"
    } : {},
    ...e.upstreamId === "card_weather" ? {
      show_forecast: f !== "native",
      ulm_card_weather_primary_info: "extrema",
      ulm_card_weather_secondary_info: "precipitation"
    } : {},
    ...e.upstreamId === "card_welcome_scenes" ? {
      name: void 0,
      secondary: "Scenes",
      collapse_entity: n(["input_boolean"], ["collapse"]) ?? n(["input_boolean"], ["dropdown"]) ?? n(["input_boolean"], []),
      scene_items: o.filter((g) => g.startsWith("scene.")).slice(0, 5).map((g) => ({ entity: g })),
      tap_action: { action: "none" }
    } : {},
    ...e.upstreamId === "custom_card_imswel_person" ? {
      wifi_tracker_entity: n(["device_tracker"], ["wifi"]),
      gps_tracker_entity: n(["device_tracker"], ["gps"]),
      findmy_script_entity: n(["script"], ["find"]),
      battery_entity: i(["sensor"], ["battery"], ["state"]),
      use_entity_picture: !1
    } : {},
    ...e.upstreamId === "custom_card_irmajavi_speedtest" ? {
      download_entity: n(["sensor"], ["download"]) ?? d,
      upload_entity: n(["sensor"], ["upload"]),
      ping_entity: n(["sensor"], ["ping"])
    } : {},
    ...e.upstreamId === "custom_card_light_colorpick" ? {
      ulm_card_light_colorpick_name: d ? t?.states[d]?.attributes.friendly_name : kt(e),
      ulm_card_light_colorpick_transition: 1
    } : {},
    ...e.upstreamId === "custom_card_media_player_sonos" ? {
      ulm_card_media_player_with_controls_name: d ? t?.states[d]?.attributes.friendly_name : "No name set"
    } : {},
    ...e.upstreamId === "custom_card_more_power_outlet" ? {
      power_entity: n(["sensor"], ["power"]),
      energy_entity: n(["sensor"], ["energy"]),
      time_entity: n(["sensor"], ["time"])
    } : {},
    ...e.upstreamId === "custom_card_mpse_gauge" ? { minimum: 0, maximum: 100 } : {},
    ...e.upstreamId === "custom_card_mpse_printer" ? {
      black_entity: n(["sensor"], ["black"]),
      yellow_entity: n(["sensor"], ["yellow"]),
      magenta_entity: n(["sensor"], ["magenta"]),
      cyan_entity: n(["sensor"], ["cyan"])
    } : {},
    ...e.upstreamId === "custom_card_paddy_welcome" ? {
      variant: n(["weather"], []) ? "weather" : "message",
      time_entity: n(["sensor"], ["time"]),
      weather_entity: n(["weather"], [])
    } : {},
    ...e.upstreamId === "custom_card_person_chip" ? {
      use_entity_picture: !0,
      tap_action: { action: d ? "more-info" : "none", entity: d }
    } : {},
    ...e.upstreamId === "custom_card_playstation" ? {
      show_controls: !1,
      tap_action: { action: d ? "more-info" : "none", entity: d }
    } : {},
    ...e.upstreamId === "custom_card_qubino" ? {
      qubino_more_info_entity: n(["input_select"], ["ordres", "fil", "pilote"]),
      tap_action: {
        action: d ? "more-info" : "none",
        entity: n(["input_select"], ["ordres", "fil", "pilote"]) ?? d
      }
    } : {},
    ...e.upstreamId === "custom_card_ristou_person" ? {
      ulm_custom_card_ristou_person_driving_entity: n(["binary_sensor"], ["driving"]),
      ulm_custom_card_ristou_find_device_script: n(["script"], ["find"]),
      ulm_custom_card_ristou_zones: o.filter((g) => g.startsWith("zone.")),
      tap_action: { action: d ? "more-info" : "none", entity: d }
    } : {}
  };
}, Uo = "1.4.0";
for (const e of je)
  if (!customElements.get(e.tag)) {
    const t = e;
    class a extends ce {
      constructor() {
        super(...arguments), this.descriptor = t;
      }
      static getStubConfig(o, n = [], i = []) {
        return Ot(t, o, n, i);
      }
    }
    customElements.define(e.tag, a);
  }
for (const e of Be) {
  if (customElements.get(e.tag)) continue;
  const t = ze.find((n) => n.upstreamId === e.targetId);
  if (!t) throw new Error(`Missing alias target ${e.targetId}.`);
  const a = t, r = e.variant;
  class o extends ce {
    constructor() {
      super(...arguments), this.descriptor = a;
    }
    static getStubConfig(i, l = [], d = []) {
      const m = Ot(a, i, l, d);
      return {
        ...m,
        variant: r,
        show_forecast: e.tag === "mushroom-addition-card-weather-ulm" ? !1 : m.show_forecast
      };
    }
    setConfig(i) {
      super.setConfig({ ...i, variant: i.variant ?? r });
    }
  }
  customElements.define(e.tag, o);
}
window.customCards = window.customCards || [];
const Oo = new Set(window.customCards.map((e) => e.type));
for (const e of je)
  Oo.has(e.tag) || window.customCards.push({
    type: e.tag,
    name: `Mushroom Addition: ${e.name}`,
    description: e.description,
    preview: !0,
    documentationURL: "https://github.com/snfx-johaver/mushroom-cards-addition"
  });
console.info(
  `%c MUSHROOM-CARDS-ADDITION %c ${Uo} · ${je.length} components `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;"
);
export {
  je as CATALOG
};
//# sourceMappingURL=mushroom-cards-addition.js.map
