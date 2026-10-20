const et = globalThis, vt = et.ShadowRoot && (et.ShadyCSS === void 0 || et.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, wt = /* @__PURE__ */ Symbol(), Bt = /* @__PURE__ */ new WeakMap();
let ya = class {
  constructor(t, a, o) {
    if (this._$cssResult$ = !0, o !== wt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = a;
  }
  get styleSheet() {
    let t = this.o;
    const a = this.t;
    if (vt && t === void 0) {
      const o = a !== void 0 && a.length === 1;
      o && (t = Bt.get(a)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && Bt.set(a, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Za = (e) => new ya(typeof e == "string" ? e : e + "", void 0, wt), rt = (e, ...t) => {
  const a = e.length === 1 ? e[0] : t.reduce((o, r, n) => o + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new ya(a, e, wt);
}, Qa = (e, t) => {
  if (vt) e.adoptedStyleSheets = t.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of t) {
    const o = document.createElement("style"), r = et.litNonce;
    r !== void 0 && o.setAttribute("nonce", r), o.textContent = a.cssText, e.appendChild(o);
  }
}, Gt = vt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let a = "";
  for (const o of t.cssRules) a += o.cssText;
  return Za(a);
})(e) : e;
const { is: eo, defineProperty: to, getOwnPropertyDescriptor: ao, getOwnPropertyNames: oo, getOwnPropertySymbols: ro, getPrototypeOf: no } = Object, nt = globalThis, jt = nt.trustedTypes, io = jt ? jt.emptyScript : "", so = nt.reactiveElementPolyfillSupport, He = (e, t) => e, at = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? io : null;
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
} }, $t = (e, t) => !eo(e, t), Ht = { attribute: !0, type: String, converter: at, reflect: !1, useDefault: !1, hasChanged: $t };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), nt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let ze = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, a = Ht) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(t, a), !a.noAccessor) {
      const o = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(t, o, a);
      r !== void 0 && to(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, a, o) {
    const { get: r, set: n } = ao(this.prototype, t) ?? { get() {
      return this[a];
    }, set(i) {
      this[a] = i;
    } };
    return { get: r, set(i) {
      const l = r?.call(this);
      n?.call(this, i), this.requestUpdate(t, l, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Ht;
  }
  static _$Ei() {
    if (this.hasOwnProperty(He("elementProperties"))) return;
    const t = no(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(He("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(He("properties"))) {
      const a = this.properties, o = [...oo(a), ...ro(a)];
      for (const r of o) this.createProperty(r, a[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const a = litPropertyMetadata.get(t);
      if (a !== void 0) for (const [o, r] of a) this.elementProperties.set(o, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [a, o] of this.elementProperties) {
      const r = this._$Eu(a, o);
      r !== void 0 && this._$Eh.set(r, a);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const a = [];
    if (Array.isArray(t)) {
      const o = new Set(t.flat(1 / 0).reverse());
      for (const r of o) a.unshift(Gt(r));
    } else t !== void 0 && a.push(Gt(t));
    return a;
  }
  static _$Eu(t, a) {
    const o = a.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const o of a.keys()) this.hasOwnProperty(o) && (t.set(o, this[o]), delete this[o]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Qa(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, a, o) {
    this._$AK(t, o);
  }
  _$ET(t, a) {
    const o = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, o);
    if (r !== void 0 && o.reflect === !0) {
      const n = (o.converter?.toAttribute !== void 0 ? o.converter : at).toAttribute(a, o.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, a) {
    const o = this.constructor, r = o._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = o.getPropertyOptions(r), i = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : at;
      this._$Em = r;
      const l = i.fromAttribute(a, n.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, a, o, r = !1, n) {
    if (t !== void 0) {
      const i = this.constructor;
      if (r === !1 && (n = this[t]), o ??= i.getPropertyOptions(t), !((o.hasChanged ?? $t)(n, a) || o.useDefault && o.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(i._$Eu(t, o)))) return;
      this.C(t, a, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, a, { useDefault: o, reflect: r, wrapped: n }, i) {
    o && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, i ?? a ?? this[t]), n !== !0 || i !== void 0) || (this._$AL.has(t) || (this.hasUpdated || o || (a = void 0), this._$AL.set(t, a)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [r, n] of o) {
        const { wrapped: i } = n, l = this[r];
        i !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, n, l);
      }
    }
    let t = !1;
    const a = this._$AL;
    try {
      t = this.shouldUpdate(a), t ? (this.willUpdate(a), this._$EO?.forEach((o) => o.hostUpdate?.()), this.update(a)) : this._$EM();
    } catch (o) {
      throw t = !1, this._$EM(), o;
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
ze.elementStyles = [], ze.shadowRootOptions = { mode: "open" }, ze[He("elementProperties")] = /* @__PURE__ */ new Map(), ze[He("finalized")] = /* @__PURE__ */ new Map(), so?.({ ReactiveElement: ze }), (nt.reactiveElementVersions ??= []).push("2.1.2");
const xt = globalThis, Wt = (e) => e, ot = xt.trustedTypes, Rt = ot ? ot.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ba = "$lit$", be = `lit$${Math.random().toFixed(9).slice(2)}$`, fa = "?" + be, lo = `<${fa}>`, ke = document, We = () => ke.createComment(""), Re = (e) => e === null || typeof e != "object" && typeof e != "function", St = Array.isArray, co = (e) => St(e) || typeof e?.[Symbol.iterator] == "function", ut = `[ 	
\f\r]`, Fe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ut = /-->/g, qt = />/g, we = RegExp(`>|${ut}(?:([^\\s"'>=/]+)(${ut}*=${ut}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Kt = /'/g, Yt = /"/g, va = /^(?:script|style|textarea|title)$/i, wa = (e) => (t, ...a) => ({ _$litType$: e, strings: t, values: a }), d = wa(1), W = wa(2), Oe = /* @__PURE__ */ Symbol.for("lit-noChange"), h = /* @__PURE__ */ Symbol.for("lit-nothing"), Xt = /* @__PURE__ */ new WeakMap(), Se = ke.createTreeWalker(ke, 129);
function $a(e, t) {
  if (!St(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Rt !== void 0 ? Rt.createHTML(t) : t;
}
const uo = (e, t) => {
  const a = e.length - 1, o = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", i = Fe;
  for (let l = 0; l < a; l++) {
    const s = e[l];
    let u, m, g = -1, _ = 0;
    for (; _ < s.length && (i.lastIndex = _, m = i.exec(s), m !== null); ) _ = i.lastIndex, i === Fe ? m[1] === "!--" ? i = Ut : m[1] !== void 0 ? i = qt : m[2] !== void 0 ? (va.test(m[2]) && (r = RegExp("</" + m[2], "g")), i = we) : m[3] !== void 0 && (i = we) : i === we ? m[0] === ">" ? (i = r ?? Fe, g = -1) : m[1] === void 0 ? g = -2 : (g = i.lastIndex - m[2].length, u = m[1], i = m[3] === void 0 ? we : m[3] === '"' ? Yt : Kt) : i === Yt || i === Kt ? i = we : i === Ut || i === qt ? i = Fe : (i = we, r = void 0);
    const c = i === we && e[l + 1].startsWith("/>") ? " " : "";
    n += i === Fe ? s + lo : g >= 0 ? (o.push(u), s.slice(0, g) + ba + s.slice(g) + be + c) : s + be + (g === -2 ? l : c);
  }
  return [$a(e, n + (e[a] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), o];
};
class Ue {
  constructor({ strings: t, _$litType$: a }, o) {
    let r;
    this.parts = [];
    let n = 0, i = 0;
    const l = t.length - 1, s = this.parts, [u, m] = uo(t, a);
    if (this.el = Ue.createElement(u, o), Se.currentNode = this.el.content, a === 2 || a === 3) {
      const g = this.el.content.firstChild;
      g.replaceWith(...g.childNodes);
    }
    for (; (r = Se.nextNode()) !== null && s.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const g of r.getAttributeNames()) if (g.endsWith(ba)) {
          const _ = m[i++], c = r.getAttribute(g).split(be), y = /([.?@])?(.*)/.exec(_);
          s.push({ type: 1, index: n, name: y[2], strings: c, ctor: y[1] === "." ? mo : y[1] === "?" ? po : y[1] === "@" ? ho : it }), r.removeAttribute(g);
        } else g.startsWith(be) && (s.push({ type: 6, index: n }), r.removeAttribute(g));
        if (va.test(r.tagName)) {
          const g = r.textContent.split(be), _ = g.length - 1;
          if (_ > 0) {
            r.textContent = ot ? ot.emptyScript : "";
            for (let c = 0; c < _; c++) r.append(g[c], We()), Se.nextNode(), s.push({ type: 2, index: ++n });
            r.append(g[_], We());
          }
        }
      } else if (r.nodeType === 8) if (r.data === fa) s.push({ type: 2, index: n });
      else {
        let g = -1;
        for (; (g = r.data.indexOf(be, g + 1)) !== -1; ) s.push({ type: 7, index: n }), g += be.length - 1;
      }
      n++;
    }
  }
  static createElement(t, a) {
    const o = ke.createElement("template");
    return o.innerHTML = t, o;
  }
}
function Te(e, t, a = e, o) {
  if (t === Oe) return t;
  let r = o !== void 0 ? a._$Co?.[o] : a._$Cl;
  const n = Re(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, a, o)), o !== void 0 ? (a._$Co ??= [])[o] = r : a._$Cl = r), r !== void 0 && (t = Te(e, r._$AS(e, t.values), r, o)), t;
}
class _o {
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
    const { el: { content: a }, parts: o } = this._$AD, r = (t?.creationScope ?? ke).importNode(a, !0);
    Se.currentNode = r;
    let n = Se.nextNode(), i = 0, l = 0, s = o[0];
    for (; s !== void 0; ) {
      if (i === s.index) {
        let u;
        s.type === 2 ? u = new Ke(n, n.nextSibling, this, t) : s.type === 1 ? u = new s.ctor(n, s.name, s.strings, this, t) : s.type === 6 && (u = new go(n, this, t)), this._$AV.push(u), s = o[++l];
      }
      i !== s?.index && (n = Se.nextNode(), i++);
    }
    return Se.currentNode = ke, r;
  }
  p(t) {
    let a = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, a), a += o.strings.length - 2) : o._$AI(t[a])), a++;
  }
}
class Ke {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, a, o, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = a, this._$AM = o, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = Te(this, t, a), Re(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== Oe && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : co(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && Re(this._$AH) ? this._$AA.nextSibling.data = t : this.T(ke.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: a, _$litType$: o } = t, r = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = Ue.createElement($a(o.h, o.h[0]), this.options)), o);
    if (this._$AH?._$AD === r) this._$AH.p(a);
    else {
      const n = new _o(r, this), i = n.u(this.options);
      n.p(a), this.T(i), this._$AH = n;
    }
  }
  _$AC(t) {
    let a = Xt.get(t.strings);
    return a === void 0 && Xt.set(t.strings, a = new Ue(t)), a;
  }
  k(t) {
    St(this._$AH) || (this._$AH = [], this._$AR());
    const a = this._$AH;
    let o, r = 0;
    for (const n of t) r === a.length ? a.push(o = new Ke(this.O(We()), this.O(We()), this, this.options)) : o = a[r], o._$AI(n), r++;
    r < a.length && (this._$AR(o && o._$AB.nextSibling, r), a.length = r);
  }
  _$AR(t = this._$AA.nextSibling, a) {
    for (this._$AP?.(!1, !0, a); t !== this._$AB; ) {
      const o = Wt(t).nextSibling;
      Wt(t).remove(), t = o;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class it {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, a, o, r, n) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = a, this._$AM = r, this.options = n, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = h;
  }
  _$AI(t, a = this, o, r) {
    const n = this.strings;
    let i = !1;
    if (n === void 0) t = Te(this, t, a, 0), i = !Re(t) || t !== this._$AH && t !== Oe, i && (this._$AH = t);
    else {
      const l = t;
      let s, u;
      for (t = n[0], s = 0; s < n.length - 1; s++) u = Te(this, l[o + s], a, s), u === Oe && (u = this._$AH[s]), i ||= !Re(u) || u !== this._$AH[s], u === h ? t = h : t !== h && (t += (u ?? "") + n[s + 1]), this._$AH[s] = u;
    }
    i && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class mo extends it {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class po extends it {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class ho extends it {
  constructor(t, a, o, r, n) {
    super(t, a, o, r, n), this.type = 5;
  }
  _$AI(t, a = this) {
    if ((t = Te(this, t, a, 0) ?? h) === Oe) return;
    const o = this._$AH, r = t === h && o !== h || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, n = t !== h && (o === h || r);
    r && this.element.removeEventListener(this.name, this, o), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class go {
  constructor(t, a, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Te(this, t);
  }
}
const yo = xt.litHtmlPolyfillSupport;
yo?.(Ue, Ke), (xt.litHtmlVersions ??= []).push("3.3.3");
const bo = (e, t, a) => {
  const o = a?.renderBefore ?? t;
  let r = o._$litPart$;
  if (r === void 0) {
    const n = a?.renderBefore ?? null;
    o._$litPart$ = r = new Ke(t.insertBefore(We(), n), n, void 0, a ?? {});
  }
  return r._$AI(e), r;
};
const kt = globalThis;
class fe extends ze {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = bo(a, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Oe;
  }
}
fe._$litElement$ = !0, fe.finalized = !0, kt.litElementHydrateSupport?.({ LitElement: fe });
const fo = kt.litElementPolyfillSupport;
fo?.({ LitElement: fe });
(kt.litElementVersions ??= []).push("4.2.2");
const xa = (e) => (t, a) => {
  a !== void 0 ? a.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const vo = { attribute: !0, type: String, converter: at, reflect: !1, hasChanged: $t }, wo = (e = vo, t, a) => {
  const { kind: o, metadata: r } = a;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), o === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(a.name, e), o === "accessor") {
    const { name: i } = a;
    return { set(l) {
      const s = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(i, s, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(i, void 0, e, l), l;
    } };
  }
  if (o === "setter") {
    const { name: i } = a;
    return function(l) {
      const s = this[i];
      t.call(this, l), this.requestUpdate(i, s, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function Ie(e) {
  return (t, a) => typeof a == "object" ? wo(e, t, a) : ((o, r, n) => {
    const i = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, o), i ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, a);
}
function me(e) {
  return Ie({ ...e, state: !0, attribute: !1 });
}
const $o = [
  "battery",
  "graph",
  "media_player",
  "room",
  "scenes",
  "welcome_scenes"
], xo = [
  "trash",
  "alarm_time",
  "bar_card",
  "roomview",
  "room_overview",
  "welcome",
  "washer",
  "sun",
  "input_datetime",
  "entity_overview",
  "internet_speed",
  "weather_metrics",
  "media_player_sonos",
  "more_power_outlet",
  "gauge",
  "printer",
  "nas_metrics",
  "tablet",
  "playstation",
  "scenes",
  "plant",
  "speedtest_gauges",
  "pollen"
], Jt = (e) => e.split("_").filter((t) => t.toLowerCase() !== "ulm").map((t) => ["nas", "mdi", "dwd", "vnc", "wifi", "http"].includes(t.toLowerCase()) ? t.toUpperCase() : `${t[0].toUpperCase()}${t.slice(1)}`).join(" "), So = (e) => e === "custom_card_bar_card" ? "bar" : e === "custom_card_alarm_time" ? "alarm-time" : /alarm|alert|lock/.test(e) ? "security" : /navigate|back/.test(e) ? "navigation" : /battery/.test(e) ? "battery" : /power_outlet|more_power_outlet/.test(e) ? "control" : /energy|power|gauge|speedtest|graph|apex|bar_card|myenedis/.test(e) ? "energy" : /weather|sun|pollen|moon/.test(e) ? "weather" : /scene/.test(e) ? "scene" : /person|tracker|tracer|presence|room|welcome/.test(e) ? "presence" : /media|playstation/.test(e) ? "media" : /thermostat|heat_pump|aircondition|temperature|simple_temp/.test(e) ? "climate" : /cover|door|garage/.test(e) ? "cover" : /vacuum/.test(e) ? "vacuum" : /light/.test(e) ? "light" : /fan|outlet|boolean|script|washer|water_heater|qubino/.test(e) ? "control" : /input_number|input_datetime/.test(e) ? "sensor" : /title|subtitle|clock|date/.test(e) ? "text" : /camera/.test(e) ? "camera" : /sensor|elapsed|update|printer|nas|tablet|flower|car|afval|waste|counter/.test(e) ? "sensor" : "entity", ko = {
  card_media_player: ["default", "controls", "artwork"],
  card_room: ["default", "with-sensors"],
  card_scenes: ["list", "welcome"]
}, Mo = (e, t) => e === "custom_card_alarm_time" ? ["input_boolean"] : /alarm/.test(e) ? ["alarm_control_panel"] : /lock/.test(e) ? ["lock"] : /power_outlet|more_power_outlet/.test(e) ? ["switch", "light"] : e.includes("binary_sensor") ? ["binary_sensor"] : e.includes("battery") ? ["sensor"] : e.includes("input_boolean") ? ["input_boolean"] : e.includes("input_number") ? ["input_number", "counter", "select", "input_select"] : e.includes("input_datetime") ? ["input_datetime"] : e.includes("light") ? ["light"] : /media|playstation/.test(e) ? ["media_player", "sensor"] : /thermostat|heat_pump|aircondition/.test(e) ? ["climate"] : /scene/.test(e) ? ["scene"] : /script/.test(e) ? ["script"] : /vacuum/.test(e) ? ["vacuum"] : /weather/.test(e) ? ["weather"] : /person/.test(e) ? ["person", "device_tracker"] : /cover|door|garage/.test(e) ? ["cover", "binary_sensor"] : /fan/.test(e) ? ["fan"] : /camera/.test(e) ? ["camera"] : /lock/.test(e) ? ["lock"] : /update/.test(e) ? ["update"] : t === "battery" || t === "energy" || t === "sensor" || t === "weather" ? ["sensor"] : t === "control" ? /fan/.test(e) ? ["fan"] : /script/.test(e) ? ["script"] : /washer/.test(e) ? ["switch", "sensor"] : /water_heater/.test(e) ? ["water_heater"] : ["switch", "input_boolean", "light"] : t === "presence" ? ["person", "device_tracker"] : ["sensor", "switch"], ht = (e, t) => {
  const a = e.replace(/^custom_(card|chip)_/, "").replace(/^(card|chip)_/, ""), o = e.replaceAll("_", "-").toLowerCase(), r = e === "custom_card_playstation" ? "mushroom-addition-custom-card-game-console" : o.startsWith("custom-card-") ? `mushroom-addition-${o}` : `mushroom-addition-card-${o.replace(/^card-/, "")}`, n = So(e), i = e === "custom_card_playstation", l = {
    custom_card_trash: "Trash",
    custom_card_entity_overview: "Entity Overview",
    custom_card_internet_speed: "Internet Speed",
    custom_card_weather_metrics: "Weather Metrics",
    custom_card_gauge: "Gauge",
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
    custom_card_entity_overview: "Mushroom-style multi-entity status card.",
    custom_card_internet_speed: "Mushroom-style internet speed and router status card.",
    custom_card_weather_metrics: "Mushroom-style weather metrics card.",
    custom_card_gauge: "Mushroom-style sensor gauge card.",
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
    name: i ? "Game Console Card" : e === "custom_card_nas_metrics" ? "NAS Card" : `${l[e] ?? Jt(a)} Card`,
    description: i ? "Mushroom-style Xbox, PlayStation, and Nintendo profile, activity, artwork, and control card." : e === "custom_card_nas_metrics" ? "Mushroom-style NAS status and utilization card." : s[e] ?? `Mushroom-style ${Jt(a).toLowerCase()} card.`,
    variants: ko[e],
    variantLabels: void 0,
    preferredDomains: Mo(e, n)
  };
}, Sa = [
  ...$o.map((e) => {
    const t = {
      graph: "reference_catalog/cards/card_graph.yaml",
      scenes: "reference_catalog/cards/card_scenes_welcome.yaml"
    };
    return ht(
      `card_${e}`,
      t[e] ?? `reference_catalog/cards/card_${e}.yaml`
    );
  }),
  ...xo.map((e) => ht(
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
], Io = [
  ht("custom_card_entity_carousel", "src/entity-carousel.ts"),
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
], ka = [
  {
    canonical: "card_scenes",
    sources: { card_scenes: "welcome-pills", custom_card_scenes: "scene-grid" },
    variants: ["welcome-pills", "scene-grid"],
    variantLabels: { "welcome-pills": "Welcome scene pills", "scene-grid": "Scene button grid" },
    name: "Scenes Card"
  }
], Ne = /* @__PURE__ */ new Map();
for (const e of ka)
  for (const t of Object.keys(e.sources)) Ne.set(t, e);
const Ma = new Set(ka.map((e) => e.canonical)), st = [
  ...Sa.filter((e) => !Ne.has(e.upstreamId) || Ma.has(e.upstreamId)).map((e) => {
    const t = Ne.get(e.upstreamId);
    return t ? {
      ...e,
      name: t.name ?? e.name,
      description: t.description ?? e.description,
      variants: t.variants,
      variantLabels: t.variantLabels,
      sourceIds: Object.keys(t.sources)
    } : { ...e, sourceIds: [e.upstreamId] };
  }),
  ...Io.map((e) => ({ ...e, sourceIds: [e.upstreamId] }))
], Ao = Sa.filter((e) => Ne.has(e.upstreamId) && !Ma.has(e.upstreamId)).map((e) => {
  const t = Ne.get(e.upstreamId), a = st.find((o) => o.upstreamId === t.canonical);
  return {
    upstreamId: e.upstreamId,
    tag: e.tag,
    targetId: a.upstreamId,
    targetTag: a.tag,
    variant: t.sources[e.upstreamId]
  };
}), Mt = [
  ...Ao,
  {
    upstreamId: "custom_card_playstation",
    tag: "mushroom-addition-custom-card-playstation",
    targetId: "custom_card_playstation",
    targetTag: "mushroom-addition-custom-card-game-console"
  }
], lt = st, Co = (e) => lt.find((t) => t.tag === e) ?? (() => {
  const t = Mt.find((a) => a.tag === e);
  return t ? st.find((a) => a.tag === t.targetTag) : void 0;
})(), Zt = (e) => Ne.get(e)?.sources[e], gt = [
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
], Ia = (e, t, a = e.enabledByDefault) => ({
  preset: e.preset,
  enabled: a,
  entity: t,
  label: e.label,
  icon: e.icon,
  color: e.color
}), Po = () => gt.map((e) => Ia(e)), xe = (e) => {
  if (e.waste_streams?.length) return e.waste_streams.map((o) => ({ ...o }));
  const t = e.type.includes("custom-card-trash"), a = gt.some((o) => o.legacyKey && typeof e[o.legacyKey] == "string");
  return !t && !a ? [] : gt.map((o, r) => {
    const i = (o.legacyKey && typeof e[o.legacyKey] == "string" ? e[o.legacyKey] : void 0) ?? (r === 0 ? e.entity : void 0);
    return Ia(o, i, i ? !0 : o.enabledByDefault);
  });
}, zo = (e) => {
  const t = e.type.includes("custom-card-trash"), a = e.today_entity ?? (typeof e.ulm_card_ophaling_vandaag == "string" ? e.ulm_card_ophaling_vandaag : void 0), o = e.tomorrow_entity ?? (typeof e.ulm_card_ophaling_morgen == "string" ? e.ulm_card_ophaling_morgen : void 0);
  if (!t && !a && !o) return e;
  const r = e.waste_streams?.length ? e.waste_streams : xe(e);
  return {
    ...e,
    waste_streams: r.length ? r : e.waste_streams,
    today_entity: a,
    tomorrow_entity: o,
    show_today: e.show_today ?? !!a,
    show_tomorrow: e.show_tomorrow ?? !!o
  };
}, ce = /* @__PURE__ */ new Set([
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
]), S = (e) => {
  if (!e) return "Entity unavailable";
  const t = e.attributes.unit_of_measurement;
  return t ? `${e.state} ${String(t)}` : e.state.replaceAll("_", " ");
}, Qt = (e) => {
  if (typeof e == "string") return e;
  const t = Array.isArray(e) ? e : [e];
  return t.every((a) => a.type === "text") ? t.map((a) => a.text ?? "").join(" ") : void 0;
}, ne = (e, t, a) => {
  const o = e.name !== void 0 && typeof e.name != "string";
  return o && t && a?.formatEntityName ? a.formatEntityName(t, e.name) : o ? Qt(e.name) || t?.attributes.friendly_name || e.entity || "" : e.name_mode === "none" ? "" : e.name_mode === "entity" ? t?.attributes.friendly_name || e.entity || "" : e.name && t && a?.formatEntityName ? a.formatEntityName(t, e.name) : (e.name ? Qt(e.name) : void 0) || t?.attributes.friendly_name || e.entity || "";
}, le = (e, t, a) => {
  e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    composed: !0,
    detail: a
  }));
}, Eo = (e, t, a) => {
  le(e, "hass-action", { config: t, action: a });
}, Vo = (e) => {
  const t = To(e), a = Do(t), o = String(t.type), r = o.includes("card-title"), n = o.includes("card-welcome-scenes"), i = o.includes("card-weather"), l = o.includes("card-weather-ulm") || t.variant === "native", s = o.includes("custom-card-sun") || o.includes("custom-card-thermostat-controls") ? { action: "none" } : void 0, u = String(a.type).includes("custom-card-qubino") ? a.qubino_more_info_entity ?? a.entity : void 0, m = o.endsWith("custom-card-pollen"), g = [
    a.download_entity,
    a.upload_entity,
    a.ping_entity
  ].filter((v) => typeof v == "string"), _ = String(a.type).includes("speedtest-gauges"), c = a.variant === "divider-title", y = a.variant === "divider-subtitle", f = _ ? {
    action: "perform-action",
    perform_action: "homeassistant.update_entity",
    target: { entity_id: g }
  } : y || c && !a.navigation_path ? { action: "none" } : m ? { action: "none" } : u ? { action: "more-info", entity: u } : a.navigation_path ? { action: "navigate", navigation_path: a.navigation_path } : s ?? { action: r || n ? "none" : a.entity ? "more-info" : "none" }, k = String(e.type).includes("card-room") && a.input_select_entity && a.input_select_option ? {
    action: "perform-action",
    perform_action: "input_select.select_option",
    target: { entity_id: a.input_select_entity },
    data: { option: a.input_select_option }
  } : void 0;
  return {
    ...a,
    show_icon: a.show_icon ?? !0,
    show_state: a.show_state ?? !0,
    show_name: a.show_name,
    name_mode: a.primary_info !== void 0 || a.secondary_info !== void 0 ? void 0 : a.name_mode,
    icon_type: a.icon_type ?? (t.use_entity_picture ? "entity-picture" : t.show_icon === !1 ? "none" : "icon"),
    layout: a.layout ?? "default",
    fill_container: a.fill_container ?? !1,
    primary_info: a.primary_info,
    secondary_info: a.secondary_info,
    tap_action: a.tap_action ?? f,
    show_controls: a.show_controls ?? (o.includes("card-vacuum") ? !0 : void 0),
    show_forecast: a.show_forecast ?? (i ? !l : void 0),
    hold_action: a.hold_action ?? (String(a.type).includes("water-heater") && a.entity ? { action: "more-info" } : void 0),
    double_tap_action: a.double_tap_action ?? k
  };
}, Pe = (e, t) => Object.entries(e).find(([a, o]) => t.test(a) && o !== void 0)?.[1], Do = (e) => {
  const t = Pe(e, /_name$/), a = Pe(e, /_icon$/), o = Pe(e, /_color$/), r = Pe(e, /_enable_(controls|buttons)$/), n = Pe(e, /_enable_slider$/), i = Pe(e, /_enable_horizontal$/);
  return {
    ...e,
    name: e.name ?? (typeof t == "string" ? t : void 0),
    icon: e.icon ?? (typeof a == "string" ? a : void 0),
    icon_color: e.icon_color ?? (typeof o == "string" ? o : void 0),
    navigation_path: e.navigation_path,
    show_controls: e.show_controls ?? (typeof r == "boolean" ? r : typeof n == "boolean" ? n : void 0),
    layout: e.layout ?? (i === !0 ? "horizontal" : void 0)
  };
}, Oo = [
  "ulm_card_media_player_entity",
  "ulm_card_graph_entity",
  "ulm_card_input_number_entity",
  "ulm_custom_card_entity_overview",
  "ulm_custom_card_weather_metrics"
], To = (e) => {
  const t = zo(e), a = t.primary_entity || Oo.map((n) => t[n]).find((n) => typeof n == "string"), o = (n) => {
    if (typeof n == "string") return n;
    if (n && typeof n == "object" && "entity_id" in n && typeof n.entity_id == "string")
      return n.entity_id;
  }, r = {
    ...t,
    entity: t.entity ?? a,
    primary_entity: void 0
  };
  if (String(e.type).includes("card-power-outlet") && (r.consumption_entity ??= o(e.ulm_card_power_outlet_consumption_sensor)), String(e.type).includes("card-room") && (r.input_select_entity ??= o(e.ulm_input_select), r.input_select_option ??= typeof e.ulm_input_select_option == "string" ? e.ulm_input_select_option : void 0), String(e.type).includes("nas-metrics") && (r.temperature_entity ??= o(e.entity_1), r.memory_entity ??= o(e.entity_2), r.cpu_entity ??= o(e.entity_3), r.disk_entity ??= o(e.entity_4)), String(e.type).includes("tablet") && (r.entity ??= o(e.ulm_custom_card_tablet_main), r.battery_entity ??= o(e.ulm_custom_card_tablet_battery), r.tablet_button_usb_entity ??= o(e.ulm_custom_card_tablet_button1), r.tablet_button_motion_entity ??= o(e.ulm_custom_card_tablet_button2), r.tablet_button_display_entity ??= o(e.ulm_custom_card_tablet_button3), r.tablet_restart_entity ??= o(e.ulm_custom_card_tablet_restart), r.tablet_reload_entity ??= o(e.ulm_custom_card_tablet_reload), r.tablet_maintenance_entity ??= o(e.ulm_custom_card_tablet_maintenance), r.tablet_ram_entity ??= o(e.ulm_custom_card_tablet_par1), r.tablet_disk_entity ??= o(e.ulm_custom_card_tablet_par2), r.tablet_power_entity ??= o(e.ulm_custom_card_tablet_par3)), String(e.type).includes("card-welcome-scenes") && (r.collapse_entity ??= o(e.ulm_card_welcome_scenes_collapse), !r.scene_items)) {
    const n = Array.from({ length: 7 }, (i, l) => {
      const s = e[`entity_${l + 1}`];
      if (!s || typeof s != "object") return;
      const u = s, m = o(u);
      if (m)
        return {
          entity: m,
          name: typeof u.name == "string" ? u.name : void 0,
          icon: typeof u.icon == "string" ? u.icon : void 0,
          color: typeof u.color == "string" ? u.color : void 0,
          state: typeof u.state == "string" ? u.state : void 0,
          navigation_path: typeof u.navigation_path == "string" ? u.navigation_path : typeof u.nav_path == "string" ? u.nav_path : void 0,
          service_data: u.service_data && typeof u.service_data == "object" ? u.service_data : void 0
        };
    }).filter((i) => i !== void 0);
    n.length && (r.scene_items = n);
  }
  if (String(e.type).includes("entity-overview") && (r.entity ??= o(e.ulm_custom_card_entity_overview), r.entities ??= [1, 2, 3, 4].map((n) => o(e[`ulm_custom_card_entity_overview_entity_${n}`])).filter((n) => n !== void 0)), String(e.type).includes("internet-speed") && (r.download_entity ??= o(e.ulm_custom_card_internet_speed_download_speed_entity), r.upload_entity ??= o(e.ulm_custom_card_internet_speed_upload_speed_entity), r.ping_entity ??= o(e.ulm_custom_card_internet_speed_ping_entity), r.entity ??= r.download_entity), String(e.type).includes("weather-metrics") && (r.entity ??= o(e.ulm_custom_card_weather_metrics), r.temperature_entity ??= o(e.ulm_custom_card_weather_metrics_temperature_outside), r.date_entity ??= o(e.ulm_custom_card_weather_metrics_date), r.entities ??= [1, 2, 3, 4].map((n) => o(e[`ulm_custom_card_weather_metrics_entity_${n}`])).filter((n) => n !== void 0)), String(e.type).includes("custom-card-washer") && (r.entity ??= o(e.ulm_custom_card_washer_machine_state) ?? o(e.ulm_custom_card_washer_power), r.program_stage_entity ??= o(e.ulm_custom_card_washer_job_state) ?? r.entity, r.washer_power_entity ??= r.power_entity ?? o(e.ulm_custom_card_washer_power), r.power_entity ??= r.washer_power_entity), String(e.type).includes("custom-card-thermostat-controls") && (r.entity ??= o(e.entity), r.variant ??= "buttons"), String(e.type).includes("media-player-sonos") && (r.entity ??= o(e.ulm_card_media_player_with_controls_entity)), String(e.type).includes("more-power-outlet") && (r.power_entity ??= o(
    e.custom_card_more_power_outlet_power_sensor ?? e.ulm_card_more_power_outlet_power_sensor ?? e.graph_entity
  ), r.energy_entity ??= o(
    e.custom_card_more_power_outlet_energy_sensor ?? e.ulm_card_more_power_outlet_energy_sensor
  ), r.time_entity ??= o(
    e.custom_card_more_power_outlet_time_sensor ?? e.ulm_card_more_power_outlet_time_sensor
  )), String(e.type).includes("gauge") && (r.minimum ??= Number(e.ulm_card_gauge_min ?? 0), r.maximum ??= Number(e.ulm_card_gauge_max ?? 100)), String(e.type).includes("printer") && (r.black_entity ??= o(e.ulm_card_printer_black_name), r.yellow_entity ??= o(e.ulm_card_printer_yellow_name), r.magenta_entity ??= o(e.ulm_card_printer_magenta_name), r.cyan_entity ??= o(e.ulm_card_printer_cyan_name)), String(e.type).endsWith("custom-card-pollen") && (r.trees_entity ??= o(e.custom_card_pollen_tree), r.grass_entity ??= o(e.custom_card_pollen_grass), r.weeds_entity ??= o(e.custom_card_pollen_weed)), String(e.type).includes("speedtest-gauges") && (r.download_entity ??= o(e.ulm_custom_card_speedtest_download_speed_entity) ?? r.entity, r.upload_entity ??= o(e.ulm_custom_card_speedtest_upload_speed_entity), r.ping_entity ??= o(e.ulm_custom_card_speedtest_ping_entity), r.entity = o(r.download_entity)), String(e.type).includes("custom-card-scenes") || String(e.type).includes("card-scenes") && e.variant === "scene-grid") {
    const n = Array.from({ length: 5 }, (i, l) => {
      const s = e[`entity_${l + 1}`];
      if (typeof s == "string") return { entity: s };
      if (!s || typeof s != "object" || !("entity_id" in s) || typeof s.entity_id != "string")
        return;
      const u = s;
      return {
        entity: u.entity_id,
        icon: typeof u.icon == "string" ? u.icon : void 0,
        color: typeof u.icon_color == "string" ? u.icon_color : void 0,
        name: typeof u.name == "string" ? u.name : void 0
      };
    }).filter((i) => !!i);
    !r.scene_items?.length && n.length && (r.scene_items = n);
  }
  return String(e.type).includes("plant") && (r.entity ??= o(e.ulm_card_flower_entity), r.ulm_card_flower_entity ??= r.entity), r;
}, Aa = [
  { configKey: "crossfade_entity", domain: "switch", suffix: "crossfade", label: "Crossfade", icon: "mdi:swap-horizontal" },
  { configKey: "night_sound_entity", domain: "switch", suffix: "night_sound", label: "Night sound", icon: "mdi:weather-night" },
  { configKey: "speech_enhancement_entity", domain: "switch", suffix: "speech_enhancement", label: "Speech enhancement", icon: "mdi:ear-hearing" },
  { configKey: "subwoofer_entity", domain: "switch", suffix: "subwoofer_enabled", label: "Subwoofer", icon: "mdi:speaker-wireless" },
  { configKey: "surrounds_entity", domain: "switch", suffix: "surround_enabled", label: "Surrounds", icon: "mdi:surround-sound" },
  { configKey: "loudness_entity", domain: "switch", suffix: "loudness", label: "Loudness", icon: "mdi:bullhorn" },
  { configKey: "surround_full_entity", domain: "switch", suffix: "surround_music_full_volume", label: "Surround full", icon: "mdi:music-note-plus" }
], Ca = [
  { configKey: "audio_delay_entity", domain: "number", suffix: "audio_delay", label: "Audio delay", icon: "mdi:tune-variant" },
  { configKey: "balance_entity", domain: "number", suffix: "balance", label: "Balance", icon: "mdi:tune-variant" },
  { configKey: "bass_entity", domain: "number", suffix: "bass", label: "Bass", icon: "mdi:tune-variant" },
  { configKey: "treble_entity", domain: "number", suffix: "treble", label: "Treble", icon: "mdi:tune-variant" },
  { configKey: "sub_gain_entity", domain: "number", suffix: "sub_gain", label: "Sub gain", icon: "mdi:tune-variant" },
  { configKey: "surround_level_entity", domain: "number", suffix: "surround_level", label: "Surround level", icon: "mdi:tune-variant" },
  { configKey: "music_surround_level_entity", domain: "number", suffix: "music_surround_level", label: "Surround level music", icon: "mdi:tune-variant" }
], It = [...Aa, ...Ca], At = (e) => e.split(".", 2)[1] ?? e, ea = (e) => At(e).replace(/_\d+$/, ""), Pa = (e, t) => {
  if (!e.startsWith(`${t.domain}.`)) return !1;
  const a = At(e);
  return t.suffix === "surround_level" && a.endsWith("_music_surround_level") ? !1 : a === t.suffix || a.endsWith(`_${t.suffix}`);
}, ta = (e) => It.filter((t) => e.some((a) => Pa(a, t))).length, Ct = (e, t, a) => {
  if (!e || !t) return {};
  const o = Object.keys(e.states), r = e.entities ?? {}, n = ea(t), i = [.../* @__PURE__ */ new Set([t, ...o.filter((_) => _.startsWith("media_player.") && ea(_) === n)])], u = [...new Set(i.map((_) => r[_]?.device_id).filter((_) => typeof _ == "string" && _.length > 0))].map((_) => o.filter((c) => r[c]?.device_id === _)).sort((_, c) => ta(c) - ta(_))[0] ?? [], m = o.filter((_) => {
    const c = _.split(".", 1)[0], y = At(_);
    return ["switch", "number"].includes(c) && (y === n || y.startsWith(`${n}_`));
  }), g = [.../* @__PURE__ */ new Set([...u, ...m])];
  return Object.fromEntries(It.flatMap((_) => {
    const c = a?.[_.configKey];
    if (typeof c == "string" && c.length > 0) return [[_.configKey, c]];
    const y = g.find((f) => Pa(f, _));
    return y ? [[_.configKey, y]] : [];
  }));
}, aa = (e, t) => Object.keys(Ct(e, t)).length, za = [
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
], yt = (e) => e.split(".", 2)[1] ?? e, Ea = (e) => e.toLowerCase().replace(/[^a-z0-9]+/g, "_"), No = (e, t, a) => {
  const o = t.split(".", 1)[0];
  if (!a.domains.includes(o)) return !1;
  const r = e?.states[t], n = Ea([
    yt(t),
    r?.attributes.friendly_name
  ].filter(Boolean).join(" "));
  return a.terms.some((i) => n.includes(i));
}, Pt = (e, t, a) => {
  if (!e || !t) return {};
  const o = e.entities?.[t]?.device_id, n = yt(t).split(/_(?:console|status|online|power)$/)[0], i = Object.keys(e.states).filter((l) => {
    const s = o && e.entities?.[l]?.device_id === o, u = yt(l);
    return s || u === n || u.startsWith(`${n}_`);
  });
  return Object.fromEntries(za.flatMap((l) => {
    const s = a?.[l.configKey];
    if (typeof s == "string" && s.length > 0)
      return [[l.configKey, s]];
    const u = i.find((m) => No(e, m, l));
    return u ? [[l.configKey, u]] : [];
  }));
}, Va = (e, t, a) => {
  const o = a?.console_platform;
  if (o === "xbox" || o === "playstation" || o === "nintendo") return o;
  const r = t ? e?.states[t] : void 0, n = Ea([
    t,
    r?.attributes.friendly_name,
    t ? e?.entities?.[t]?.platform : void 0
  ].filter(Boolean).join(" "));
  return n.includes("xbox") || n.includes("gamer") ? "xbox" : n.includes("playstation") || /(?:^|_)ps[345](?:_|$)/.test(n) ? "playstation" : n.includes("nintendo") || n.includes("switch") ? "nintendo" : "generic";
}, Lo = (e) => {
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
}, oa = {
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
    minimum: "Minimum value",
    maximum: "Maximum value",
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
    ulm_card_battery_battery_state_entity_id: "Charging state entity",
    ulm_card_battery_charger_type_entity_id: "Charger type entity",
    ulm_card_battery_charging_animation: "Animate while charging",
    ulm_card_battery_color_battery_level_danger: "Low battery color",
    ulm_card_battery_color_battery_level_warning: "Battery warning color",
    ulm_card_battery_color_battery_level_ok: "Healthy battery color",
    ulm_card_battery_name: "Battery name",
    ulm_card_media_player_enable_art: "Show media artwork",
    sonos_details_always_visible: "Always show detailed controls",
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
}, ra = (e, t) => {
  const a = e?.language?.split("-")[0] ?? "en";
  return oa[a]?.[t] ?? oa.en[t] ?? t.replace(/^ulm_(?:custom_)?card_/, "").replace(/^(?:custom_)?card_/, "").replace(/^ulm_/, "").replaceAll("_", " ").replace(/\b\w/g, (o) => o.toUpperCase());
}, Fo = {
  entity: "The Home Assistant entity shown and controlled by this card.",
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
  label_use_temperature: "Uses the room entity temperature, device temperature, or state as the card label.",
  label_use_brightness: "Uses the light brightness percentage as the label while the room entity is on.",
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
  ulm_custom_card_entity_overview_icon: "Icon shown before the main Entities heading.",
  ulm_custom_card_entity_overview_name: "Heading shown above the four entity values.",
  ulm_custom_card_entity_overview_entity_1: "Entity shown in the first metric slot.",
  ulm_custom_card_entity_overview_entity_2: "Entity shown in the second metric slot.",
  ulm_custom_card_entity_overview_entity_3: "Entity shown in the third metric slot.",
  ulm_custom_card_entity_overview_entity_4: "Entity shown in the fourth metric slot.",
  ulm_custom_card_entity_overview_name_1: "Label shown below the first metric value.",
  ulm_custom_card_entity_overview_name_2: "Label shown below the second metric value.",
  ulm_custom_card_entity_overview_name_3: "Label shown below the third metric value.",
  ulm_custom_card_entity_overview_name_4: "Label shown below the fourth metric value.",
  ulm_custom_card_internet_speed_router_name: "Router name shown below the Wi-Fi icon.",
  ulm_custom_card_internet_speed_router_model: "Router model shown below the router name.",
  ulm_custom_card_internet_speed_color: "Accent color used by the Wi-Fi icon.",
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
  minimum: "Lowest value represented by the gauge.",
  maximum: "Highest value represented by the gauge.",
  custom_card_pollen_tree_name: "Optional tree item label; leave empty to use the entity friendly name or localized default.",
  custom_card_pollen_tree_icon: "Optional tree item icon; leave empty to use the entity icon or source default.",
  custom_card_pollen_grass_name: "Optional grass item label; leave empty to use the entity friendly name or localized default.",
  custom_card_pollen_grass_icon: "Optional grass item icon; leave empty to use the entity icon or source default.",
  custom_card_pollen_weed_name: "Optional weed item label; leave empty to use the entity friendly name or localized default.",
  custom_card_pollen_weed_icon: "Optional weed item icon; leave empty to use the entity icon or source default."
}, Bo = (e) => Fo[e], Go = [
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
    upstreamId: "card_graph",
    sourcePath: "reference_catalog/cards/card_graph.yaml",
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
    upstreamId: "custom_card_entity_overview",
    sourcePath: "custom_cards/custom_card_entity_overview",
    publicId: "custom_card_entity_overview",
    rendererId: "custom_card_entity_overview",
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
        name: "ulm_custom_card_entity_overview",
        defaultValue: "<documented/inherited>",
        selector: "entity-multiple"
      },
      {
        name: "ulm_custom_card_entity_overview_entity_1",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_entity_overview_entity_2",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_entity_overview_entity_3",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_entity_overview_entity_4",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_entity_overview_icon",
        defaultValue: "<documented/inherited>",
        selector: "icon"
      },
      {
        name: "ulm_custom_card_entity_overview_name",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_entity_overview_name_1",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_entity_overview_name_2",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_entity_overview_name_3",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_entity_overview_name_4",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_metrics_entitites_name",
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
    upstreamId: "custom_card_internet_speed",
    sourcePath: "custom_cards/custom_card_internet_speed",
    publicId: "custom_card_internet_speed",
    rendererId: "custom_card_internet_speed",
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
        name: "ulm_custom_card_internet_speed_color",
        defaultValue: '"blue"',
        selector: "color"
      },
      {
        name: "ulm_custom_card_internet_speed_download",
        defaultValue: '"Prędkość pobierania"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_internet_speed_download_speed_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_internet_speed_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_internet_speed_ping_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_custom_card_internet_speed_router_model",
        defaultValue: '"router_model"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_internet_speed_router_name",
        defaultValue: '"router_name"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_internet_speed_speedtest",
        defaultValue: '"Test prędkości Internetu"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_internet_speed_upload",
        defaultValue: '"Prędkość wysyłania"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_internet_speed_upload_speed_entity",
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
    upstreamId: "custom_card_gauge",
    sourcePath: "custom_cards/custom_card_gauge",
    publicId: "custom_card_gauge",
    rendererId: "custom_card_gauge",
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
        name: "ulm_card_gauge_max",
        defaultValue: "100",
        selector: "number"
      },
      {
        name: "ulm_card_gauge_min",
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
], zt = new Map(Go.map((e) => [e.upstreamId, e])), jo = (e) => /popup|browser_mod/i.test(e), Ho = {
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
}, Da = /* @__PURE__ */ new Set([
  "ulm_card_battery_name",
  "ulm_card_flower_name",
  "ulm_card_input_boolean_name",
  "ulm_card_input_datetime_name",
  "ulm_card_input_number_name",
  "ulm_card_media_player_with_controls_name",
  "ulm_card_printer_name",
  "ulm_custom_card_bar_card_name",
  "ulm_custom_card_entity_overview_name",
  "ulm_custom_card_metrics_entitites_name"
]), Wo = (e, t) => Da.has(t) || (Ho[e.upstreamId]?.includes(t) ?? !1), Ro = {
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
}, Uo = {
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
}, Oa = (e, t) => !jo(t) && ([e.upstreamId, ...e.sourceIds ?? []].some((a) => Uo[a]?.includes(t) === !0) || Ro[e.family]?.includes(t) === !0), ct = [
  { key: "temperature", label: "Temperature", icon: "mdi:thermometer", min: -10, max: 50 },
  { key: "humidity", label: "Humidity", icon: "mdi:water-percent", min: 0, max: 100 },
  { key: "moisture", label: "Moisture", icon: "mdi:water", min: 0, max: 100 },
  { key: "conductivity", label: "Conductivity", icon: "mdi:flash", min: 0, max: 3e3 },
  { key: "illuminance", label: "Illuminance", icon: "mdi:white-balance-sunny", min: 0, max: 1e5 },
  { key: "dli", label: "Daily light integral", icon: "mdi:leaf", min: 0, max: 30 }
], qo = new Set(ct.map(({ key: e }) => e)), Ta = (e) => {
  const t = e?.ulm_card_flower_show_bars;
  return Array.isArray(t) ? [...new Set(t)].filter((a) => typeof a == "string" && qo.has(a)) : ct.map(({ key: a }) => a);
}, Na = (e) => `${e}_entity`, p = (e, t = "entity") => ({
  name: t,
  selector: { entity: e?.length ? { domain: e } : {} }
}), E = (e) => ({ name: e, selector: { text: {} } }), na = (e) => ({ name: e, selector: { navigation: {} } }), P = (e) => ({ name: e, selector: { boolean: {} } }), C = (e, t = 1, a = 168, o) => ({
  name: e,
  selector: { number: { min: t, max: a, mode: "box", ...o === void 0 ? {} : { step: o } } }
}), _t = (e) => ({
  name: e,
  selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
}), _e = (e) => ({ name: e, selector: { ui_action: {} } }), q = (e, t) => ({
  name: e,
  selector: { select: { mode: "dropdown", options: t } }
}), Ko = {
  battery_healthy_color: "green",
  battery_warning_color: "yellow",
  battery_low_color: "orange",
  battery_critical_color: "red",
  ulm_card_graph_color: "red",
  ulm_card_graph_icon_color: "red",
  ulm_card_media_player_color: "blue",
  ulm_card_alarm_time_color: "blue",
  ulm_custom_card_bar_card_color: "blue",
  ulm_custom_card_bar_card_icon_color: "grey",
  ulm_custom_card_internet_speed_color: "blue",
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
}, F = (e) => ({
  name: e,
  selector: { ui_color: { default_color: Ko[e] } }
}), Be = (e) => ({ ...e, presentation: !0 }), Yo = (e) => ({
  type: "grid",
  name: "",
  schema: e,
  presentation: !0
}), Xo = /* @__PURE__ */ new Set([
  "ulm_card_battery_battery_level_danger",
  "ulm_card_battery_battery_level_warning"
]), Jo = /* @__PURE__ */ new Set([
  "ulm_custom_card_bar_card_indicator",
  "ulm_custom_card_bar_card_show_icon",
  "ulm_custom_card_bar_card_value",
  "ulm_card_media_player_collapsible",
  "ulm_card_media_player_idle_off",
  "ulm_card_media_player_more_info",
  "ulm_card_media_player_power_button",
  "ulm_card_media_player_force_background_color"
]), Zo = /* @__PURE__ */ new Set([
  "ulm_custom_card_bar_card_min",
  "ulm_custom_card_bar_card_max",
  "ulm_card_graph_hours",
  "ulm_card_graph_line_width",
  "ulm_card_graph_points",
  "ulm_card_media_player_enable_volume_adjust"
]), Qo = /* @__PURE__ */ new Set([
  "ulm_card_input_datetime_name",
  "ulm_card_input_number_entity",
  "ulm_card_input_number_name",
  "ulm_custom_card_entity_overview",
  "ulm_custom_card_entity_overview_entity_1",
  "ulm_custom_card_entity_overview_entity_2",
  "ulm_custom_card_entity_overview_entity_3",
  "ulm_custom_card_entity_overview_entity_4",
  "ulm_custom_card_entity_overview_icon",
  "ulm_custom_card_entity_overview_name",
  "ulm_custom_card_entity_overview_name_1",
  "ulm_custom_card_entity_overview_name_2",
  "ulm_custom_card_entity_overview_name_3",
  "ulm_custom_card_entity_overview_name_4",
  "ulm_custom_card_metrics_entitites_name",
  "ulm_custom_card_internet_speed_color",
  "ulm_custom_card_internet_speed_download_speed_entity",
  "ulm_custom_card_internet_speed_ping_entity",
  "ulm_custom_card_internet_speed_router_model",
  "ulm_custom_card_internet_speed_router_name",
  "ulm_custom_card_internet_speed_upload_speed_entity",
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
]), er = {}, G = () => [
  Be({
    name: "name",
    selector: { entity_name: {} },
    context: { entity: "entity" }
  }),
  Be({
    name: "icon",
    selector: { icon: {} },
    context: { icon_entity: "entity" }
  }),
  Be({
    name: "layout",
    selector: {
      select: {
        mode: "box",
        options: ["horizontal", "vertical"].map((e) => ({
          value: e,
          label: e === "horizontal" ? "Horizontal" : "Vertical",
          image: {
            src: `/static/images/form/tile_content_layout_${e}.svg`,
            src_dark: `/static/images/form/tile_content_layout_${e}_dark.svg`,
            flip_rtl: !0
          }
        }))
      }
    }
  }),
  Be(P("multiline_secondary")),
  Be(P("fill_container")),
  Yo([
    q("primary_info", [
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" }
    ]),
    q("secondary_info", [
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" }
    ]),
    q("icon_type", [
      { value: "icon", label: "Icon" },
      { value: "entity-picture", label: "Entity picture" },
      { value: "none", label: "None" }
    ])
  ])
], tr = /* @__PURE__ */ new Set([
  "card_room",
  "card_welcome_scenes",
  "custom_card_bar_card",
  "custom_card_welcome",
  "custom_card_entity_overview",
  "custom_card_tablet"
]), La = (e) => e.flatMap((t) => t.name === "icon" || t.name === "icon_type" ? [] : t.schema ? [{ ...t, schema: La(t.schema) }] : [t]), ar = (e) => {
  if (!e.some((i) => i.presentation)) return e;
  const t = e.filter((i) => i.presentation), a = /* @__PURE__ */ new Set(["name", "icon"]), o = e.filter((i) => !i.presentation && !a.has(i.name) && !Da.has(i.name)), r = o.findIndex((i) => i.name === "entity");
  if (r < 0) return [...t, ...o];
  const [n] = o.splice(r, 1);
  return [n, ...t, ...o];
}, or = (e) => {
  const t = { ...e };
  return delete t.presentation, t;
}, re = (e) => [
  p(e.preferredDomains),
  ...e.variants?.length ? [q("variant", e.variants.map((t) => ({
    value: t,
    label: e.variantLabels?.[t] ?? t.replaceAll("-", " ").replace(/\b\w/g, (a) => a.toUpperCase())
  })))] : [],
  ...G()
], ia = {
  weather: (e) => [
    ...re(e),
    p(["sensor"], "temperature_entity"),
    p(["sensor"], "humidity_entity"),
    P("show_forecast")
  ],
  climate: (e) => [...re(e), p(["sensor"], "humidity_entity"), P("show_controls")],
  light: (e) => [...re(e)],
  scene: (e) => [
    ...e.upstreamId === "card_welcome_scenes" ? [p(), ...G()] : re(e),
    ...e.upstreamId === "card_welcome_scenes" ? [
      p(["input_boolean"], "collapse_entity"),
      p(["weather"], "weather_entity"),
      na("settings_path"),
      P("collapsed")
    ] : []
  ],
  presence: (e, t) => [
    ...re(e),
    ...e.upstreamId === "card_room" ? [] : [
      ...t?.variant === "small" ? [] : [
        p(["sensor"], "battery_entity"),
        p(["sensor"], "eta_entity"),
        p(["sensor"], "address_entity")
      ]
    ]
  ],
  battery: (e) => [
    ...re(e),
    _t("battery_warning_threshold"),
    _t("battery_low_threshold"),
    _t("battery_critical_threshold"),
    F("battery_healthy_color"),
    F("battery_warning_color"),
    F("battery_low_color"),
    F("battery_critical_color")
  ],
  bar: (e) => [...re(e)],
  energy: (e) => [...re(e), p(["sensor"], "min_entity"), p(["sensor"], "max_entity"), P("show_graph")],
  sensor: (e) => [...re(e), P("show_graph")],
  media: (e) => [...re(e), P("show_controls")],
  cover: (e) => [...re(e), P("show_controls")],
  security: (e) => [...re(e)],
  navigation: (e) => [
    ...e.variants?.length ? [q("variant", e.variants.map((t) => ({
      value: t,
      label: e.variantLabels?.[t] ?? t
    })))] : [],
    ...G(),
    na("navigation_path")
  ],
  text: () => [...G(), E("secondary")],
  camera: (e) => [...re(e)],
  control: (e) => [
    ...re(e),
    .../power_outlet|more_power_outlet/.test(e.upstreamId) ? [p(["sensor"], "graph_entity"), P("show_graph")] : [],
    P("show_controls")
  ],
  "alarm-time": (e) => [...re(e), p(["input_datetime"], "datetime_entity"), P("show_controls")],
  door: (e) => [...re(e), p(["lock"], "lock_entity"), p(["sensor"], "battery_entity"), P("show_controls")],
  entity: (e) => [...re(e), E("secondary")]
}, Fa = (e, t) => {
  if (e.upstreamId === "mini_graph_card")
    return [
      p(["sensor", "binary_sensor", "input_number"]),
      ...G().filter((r) => r.name !== "layout" && r.name !== "multiline_secondary"),
      q("variant", [
        { value: "line", label: "Line graph" },
        { value: "bar", label: "Bar graph" }
      ]),
      q("aggregate_func", [
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
      q("group_by", [
        { value: "interval", label: "Dynamic interval" },
        { value: "hour", label: "Hour" },
        { value: "date", label: "Date" }
      ]),
      C("hours_to_show", 1, 8760),
      C("points_per_hour", 0.01, 60),
      C("update_interval", 1, 86400),
      P("cache"),
      C("height", 0, 1e3),
      C("line_width", 1, 20),
      C("bar_spacing", 0, 50),
      P("smoothing"),
      P("animate"),
      P("logarithmic"),
      C("value_factor", -12, 12),
      C("decimals", 0, 12),
      P("hour24"),
      C("font_size", 25, 300),
      C("font_size_header", 8, 48),
      q("align_header", [
        { value: "default", label: "Automatic" },
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ]),
      q("align_icon", [
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
        { value: "state", label: "Beside state" }
      ]),
      q("align_state", [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ]),
      E("unit"),
      E("icon_image"),
      E("lower_bound"),
      E("upper_bound"),
      C("min_bound_range", 0, 1e6),
      E("lower_bound_secondary"),
      E("upper_bound_secondary"),
      C("min_bound_range_secondary", 0, 1e6),
      q("color_thresholds_transition", [
        { value: "smooth", label: "Smooth gradient" },
        { value: "hard", label: "Hard color steps" }
      ]),
      P("group"),
      q("mini_graph_show_state", [
        { value: "current", label: "Current state" },
        { value: "last", label: "Last graph value" },
        { value: "hidden", label: "Hidden" }
      ]),
      q("mini_graph_show_fill", [
        { value: "solid", label: "Solid fill" },
        { value: "fade", label: "Faded fill" },
        { value: "hidden", label: "No fill" }
      ]),
      q("mini_graph_show_points", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" }
      ]),
      q("mini_graph_show_labels", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" }
      ]),
      q("mini_graph_show_labels_secondary", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" }
      ]),
      P("mini_graph_show_legend"),
      P("mini_graph_show_average"),
      P("mini_graph_show_extrema"),
      P("mini_graph_name_adaptive_color"),
      P("mini_graph_icon_adaptive_color"),
      P("mini_graph_loading_indicator"),
      _e("tap_action"),
      _e("hold_action"),
      _e("double_tap_action")
    ];
  const a = [
    ...e.upstreamId === "advanced_home_energy_management" ? [
      p(["sensor"]),
      p(["sensor"], "grid_power_entity"),
      p(["sensor"], "grid_phase_1_entity"),
      p(["sensor"], "grid_phase_2_entity"),
      p(["sensor"], "grid_phase_3_entity"),
      p(["sensor"], "solar_power_entity"),
      p(["sensor"], "solar_forecast_entity"),
      p(["sensor"], "battery_level_entity"),
      p(["sensor"], "battery_power_entity"),
      p(["sensor"], "battery_1_level_entity"),
      p(["sensor"], "battery_1_power_entity"),
      p(["sensor"], "battery_2_level_entity"),
      p(["sensor"], "battery_2_power_entity"),
      p(["sensor"], "battery_3_level_entity"),
      p(["sensor"], "battery_3_power_entity"),
      p(["sensor"], "ev_charger_power_entity"),
      p(["sensor", "select", "input_select"], "energy_mode_entity"),
      p(["binary_sensor", "input_boolean", "switch"], "energy_auto_control_entity"),
      p(["sensor", "input_number"], "electricity_price_entity"),
      p(["sensor", "input_number"], "tariff_markup_entity"),
      p(["sensor", "input_number"], "tariff_vat_entity"),
      E("energy_grid_label"),
      E("energy_grid_import_label"),
      E("energy_grid_export_label"),
      E("energy_solar_label"),
      E("energy_battery_label"),
      E("energy_home_label"),
      E("energy_forecast_label"),
      E("energy_ev_label"),
      E("energy_charge_label"),
      E("energy_discharge_label"),
      E("energy_idle_label"),
      E("energy_auto_label"),
      E("energy_manual_label"),
      E("mode_solar_first_label"),
      E("mode_smart_saving_label"),
      E("mode_smart_trading_label"),
      C("grid_phase_scale_max", 100, 1e5),
      C("solar_scale_max", 100, 1e5),
      C("battery_unit_scale_max", 100, 1e5),
      C("home_scale_max", 100, 1e5),
      C("price_low_threshold", -10, 10),
      C("price_medium_threshold", -10, 10),
      C("price_high_threshold", -10, 10),
      C("price_critical_threshold", -10, 10),
      P("show_grid_phases"),
      P("show_battery_units"),
      P("show_tariff_timeline"),
      F("import_color"),
      F("export_color"),
      F("solar_color"),
      F("battery_color"),
      F("home_color"),
      F("price_negative_color"),
      F("price_low_color"),
      F("price_medium_color"),
      F("price_high_color"),
      F("price_critical_color"),
      ...G()
    ] : e.upstreamId === "card_room" ? [
      p(),
      P("label_use_temperature"),
      P("label_use_brightness"),
      p(["input_select"], "input_select_entity"),
      E("input_select_option"),
      ...G()
    ] : e.upstreamId === "card_scenes" ? [
      p(),
      ...e.variants?.length ? [q("variant", e.variants.map((r) => ({
        value: r,
        label: e.variantLabels?.[r] ?? r
      })))] : [],
      P("scene_buttons_only"),
      ...G()
    ] : e.upstreamId === "custom_card_trash" ? [
      p(["sensor", "calendar"]),
      P("show_today"),
      p(["sensor"], "today_entity"),
      P("show_tomorrow"),
      p(["sensor"], "tomorrow_entity"),
      ...G()
    ] : e.upstreamId === "custom_card_entity_carousel" ? [
      p(),
      ...G(),
      P("carousel_loop"),
      P("carousel_show_labels"),
      C("carousel_initial_index", 0, 50),
      q("carousel_effect", [
        { value: "coverflow", label: "Coverflow" },
        { value: "slide", label: "Slide" }
      ]),
      P("carousel_grab_cursor"),
      P("carousel_centered_slides"),
      q("carousel_slides_per_view", [
        { value: "auto", label: "Automatic" },
        ...Array.from({ length: 11 }, (r, n) => ({
          value: String(n + 1),
          label: String(n + 1)
        }))
      ]),
      C("carousel_coverflow_rotate", -180, 180),
      C("carousel_coverflow_stretch", -200, 200),
      C("carousel_coverflow_depth", 0, 1e3),
      C("carousel_coverflow_modifier", 0, 5),
      P("carousel_coverflow_slide_shadows")
    ] : e.upstreamId === "custom_card_playstation" ? [
      p(["binary_sensor", "media_player", "remote", "sensor", "switch"]),
      q("console_platform", [
        { value: "auto", label: "Automatic" },
        { value: "xbox", label: "Xbox" },
        { value: "playstation", label: "PlayStation" },
        { value: "nintendo", label: "Nintendo" }
      ]),
      P("console_show_artwork"),
      P("console_show_controls"),
      p(["sensor"], "followers_entity"),
      p(["sensor"], "following_entity"),
      p(["sensor"], "friends_entity"),
      p(["sensor", "number", "input_number"], "primary_stat_entity"),
      { name: "primary_stat_icon", selector: { icon: {} } },
      p(["sensor", "number", "input_number"], "secondary_stat_entity"),
      { name: "secondary_stat_icon", selector: { icon: {} } },
      p(["sensor"], "now_playing_entity"),
      p(["image", "camera"], "gamerpic_entity"),
      p(["image", "camera"], "artwork_entity"),
      p(["remote", "media_player", "switch"], "console_power_entity"),
      ...G()
    ] : e.upstreamId === "custom_card_alarm_time" ? [
      p(["input_boolean", "switch"]),
      p(["input_datetime"], "datetime_entity"),
      C("ulm_card_alarm_time_step", 1, 180),
      P("ulm_card_alarm_time_collapse"),
      P("ulm_card_alarm_time_horizontal"),
      { name: "ulm_card_alarm_time_icon", selector: { icon: {} } },
      F("ulm_card_alarm_time_color"),
      ...G()
    ] : e.upstreamId === "custom_card_media_player_sonos" ? [
      p(["media_player"]),
      ...G(),
      P("ulm_card_media_player_enable_art"),
      P("sonos_details_always_visible"),
      p(["switch"], "crossfade_entity"),
      p(["switch"], "night_sound_entity"),
      p(["switch"], "speech_enhancement_entity"),
      p(["switch"], "subwoofer_entity"),
      p(["switch"], "surrounds_entity"),
      p(["switch"], "loudness_entity"),
      p(["switch"], "surround_full_entity"),
      p(["number"], "audio_delay_entity"),
      p(["number"], "balance_entity"),
      p(["number"], "bass_entity"),
      p(["number"], "treble_entity"),
      p(["number"], "sub_gain_entity"),
      p(["number"], "surround_level_entity"),
      p(["number"], "music_surround_level_entity")
    ] : e.upstreamId === "custom_card_more_power_outlet" ? [
      p(["switch", "light"]),
      p(["sensor"], "power_entity"),
      p(["sensor"], "energy_entity"),
      p(["sensor"], "time_entity"),
      ...G()
    ] : e.upstreamId === "custom_card_gauge" ? [
      p(["sensor"]),
      C("minimum", -1e5, 1e5),
      C("maximum", -1e5, 1e5),
      ...G()
    ] : e.upstreamId === "custom_card_printer" ? [
      p(["sensor", "binary_sensor"]),
      p(["sensor"], "black_entity"),
      p(["sensor"], "yellow_entity"),
      p(["sensor"], "magenta_entity"),
      p(["sensor"], "cyan_entity"),
      ...G()
    ] : e.upstreamId === "advanced_energy_buy_sell" ? [
      p(["sensor"]),
      E("buy_sell_title"),
      C("buy_sell_graph_span", 1, 168),
      q("buy_sell_span_start", [
        { value: "day", label: "Start at midnight" },
        { value: "now", label: "Start now" }
      ]),
      C("buy_sell_update_interval", 1, 120),
      C("buy_sell_chart_height", 120, 700),
      C("buy_sell_min_value", -10, 10),
      C("buy_sell_max_value", -10, 10),
      C("buy_sell_price_decimals", 0, 6),
      C("buy_sell_axis_decimals", 0, 4),
      C("buy_sell_bar_radius", 0, 16),
      E("buy_sell_axis_label"),
      E("buy_sell_price_label"),
      F("buy_sell_price_color"),
      E("buy_sell_charge_label"),
      F("buy_sell_charge_color"),
      E("buy_sell_planned_sell_label"),
      F("buy_sell_planned_sell_color"),
      E("buy_sell_possible_sell_label"),
      F("buy_sell_possible_sell_color"),
      P("buy_sell_show_now"),
      E("buy_sell_now_label"),
      F("buy_sell_now_color"),
      P("buy_sell_show_legend"),
      P("buy_sell_show_grid"),
      P("buy_sell_show_result"),
      C("buy_sell_trade_energy", 0.1, 1e3, 0.01),
      p(["input_number", "number", "sensor"], "buy_sell_trade_energy_entity"),
      C("buy_sell_trade_power", 0.1, 1e3, 0.01),
      C("buy_sell_trade_efficiency", 1, 100, 0.1),
      C("buy_sell_feed_in_fee", 0, 10, 1e-3),
      C("buy_sell_slot_minutes", 1, 1440),
      ...G()
    ] : e.upstreamId === "advanced_energy_panel_health" ? [
      p(["sensor"]),
      {
        name: "panel_entities",
        selector: { entity: { domain: ["sensor"], multiple: !0 } }
      },
      E("panel_health_title"),
      P("panel_show_summary"),
      P("panel_show_gauges"),
      C("panel_gauge_max", 1, 1e5),
      C("panel_warning_average_min", 0, 1e5),
      C("panel_low_output_percent", 1, 100),
      C("panel_segment_1", 0, 1e5),
      C("panel_segment_2", 0, 1e5),
      C("panel_segment_3", 0, 1e5),
      C("panel_segment_4", 0, 1e5),
      F("panel_color_0"),
      F("panel_color_1"),
      F("panel_color_2"),
      F("panel_color_3"),
      F("panel_color_4"),
      F("panel_color_5"),
      ...G()
    ] : e.upstreamId === "custom_card_roomview" ? [
      p(e.preferredDomains),
      p(["group", "light"], "group_lights"),
      p(["group", "binary_sensor"], "group_motions"),
      p(["group", "binary_sensor"], "group_doors"),
      p(["group", "binary_sensor"], "group_windows"),
      p(["group", "switch"], "group_outlets"),
      p(["group", "media_player"], "group_tv"),
      p(["group", "binary_sensor"], "group_water"),
      p(["group", "cover"], "group_windows_shutters"),
      p(["sensor"], "temperature"),
      p(["sensor"], "humidity"),
      ...G()
    ] : e.upstreamId === "custom_card_room_overview" ? [
      p(),
      p(["light"], "ulm_custom_card_room_overview_light_entity"),
      p(["climate"], "ulm_custom_card_room_overview_climate_entity"),
      p(["cover"], "ulm_custom_card_room_overview_cover_entity"),
      { name: "ulm_card_room_overview_light_icon_on", selector: { icon: {} } },
      { name: "ulm_card_room_overview_light_icon_off", selector: { icon: {} } },
      { name: "ulm_card_room_overview_cover_icon_open", selector: { icon: {} } },
      { name: "ulm_card_room_overview_cover_icon_closed", selector: { icon: {} } },
      P("ulm_card_dynamic_color"),
      E("secondary"),
      ...G()
    ] : e.upstreamId === "custom_card_welcome" ? [
      p(["person"]),
      p(["input_boolean"], "ulm_card_welcome_collapse"),
      p(["weather"], "ulm_weather"),
      ...Array.from({ length: 5 }, (r, n) => n + 1).flatMap((r) => [
        E(`nav_${r}`),
        { name: `icon_${r}`, selector: { icon: {} } },
        E(`name_${r}`),
        q(`color_${r}`, ["blue", "red", "green", "yellow", "pink", "purple"].map((n) => ({
          value: n,
          label: n[0].toUpperCase() + n.slice(1)
        })))
      ]),
      ...G()
    ] : e.upstreamId === "custom_card_plant" ? [
      p(["plant", "sensor"]),
      E("ulm_card_flower_species"),
      {
        name: "ulm_card_flower_show_bars",
        selector: {
          select: {
            multiple: !0,
            options: ct.map(({ key: r, label: n }) => ({ value: r, label: n }))
          }
        }
      },
      ...Ta(t).map((r) => p(["sensor", "number", "input_number"], Na(r))),
      ...G()
    ] : e.upstreamId === "custom_card_washer" ? [
      p(["sensor", "switch", "binary_sensor"]),
      p(["sensor", "select"], "program_stage_entity"),
      p(["sensor", "switch"], "washer_power_entity"),
      p(["sensor", "binary_sensor"], "door_entity"),
      p(["sensor", "binary_sensor"], "finished_entity"),
      p(["sensor", "binary_sensor"], "ulm_custom_card_washer_remote_control"),
      p(["sensor"], "ulm_custom_card_washer_job_progress"),
      p(["input_boolean"], "ulm_custom_card_washer_delayed_start"),
      p(["input_datetime"], "ulm_custom_card_washer_delayed_starttime"),
      E("ulm_custom_card_washer_machine_stop_state"),
      { name: "ulm_custom_card_washer_job_states", selector: { object: {} } },
      E("ulm_custom_card_washer_label_idle"),
      E("ulm_custom_card_washer_label_configuring"),
      E("ulm_custom_card_washer_label_running"),
      _e("ulm_custom_card_washer_start_action"),
      _e("ulm_custom_card_washer_pause_action"),
      _e("ulm_custom_card_washer_stop_action"),
      ...G()
    ] : e.upstreamId === "custom_card_sun" ? [
      p(["sun"]),
      E("title"),
      q("language", [
        { value: "en", label: "English" },
        { value: "de", label: "German" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "nl", label: "Dutch" },
        { value: "pl", label: "Polish" }
      ]),
      q("timeFormat", [
        { value: "24h", label: "24-hour time" },
        { value: "12h", label: "12-hour time" }
      ]),
      P("darkMode"),
      P("showMoon"),
      p(["sensor"], "moon_entity"),
      p(["sensor"], "moon_altitude_entity"),
      p(["sensor"], "moon_azimuth_entity"),
      p(["sensor"], "moon_rising_entity"),
      p(["sensor"], "moon_setting_entity"),
      p(["sensor"], "moon_next_full_moon_entity"),
      p(["sensor"], "moon_next_new_moon_entity"),
      p(["sensor", "binary_sensor"], "moon_above_horizon_entity"),
      ...G()
    ] : e.upstreamId === "custom_card_pollen" ? [
      p(["sensor"]),
      p(["sensor"], "trees_entity"),
      E("custom_card_pollen_tree_name"),
      { name: "custom_card_pollen_tree_icon", selector: { icon: {} } },
      p(["sensor"], "grass_entity"),
      E("custom_card_pollen_grass_name"),
      { name: "custom_card_pollen_grass_icon", selector: { icon: {} } },
      p(["sensor"], "weeds_entity"),
      E("custom_card_pollen_weed_name"),
      { name: "custom_card_pollen_weed_icon", selector: { icon: {} } },
      ...G()
    ] : e.upstreamId === "custom_card_speedtest_gauges" ? [
      p(["sensor"]),
      p(["sensor"], "download_entity"),
      F("ulm_custom_card_speedtest_download_speed_color"),
      C("ulm_custom_card_speedtest_download_speed_max", 1, 1e5),
      p(["sensor"], "upload_entity"),
      F("ulm_custom_card_speedtest_upload_speed_color"),
      C("ulm_custom_card_speedtest_upload_speed_max", 1, 1e5),
      p(["sensor"], "ping_entity"),
      F("ulm_custom_card_speedtest_ping_color"),
      C("ulm_custom_card_speedtest_ping_max", 1, 1e5),
      P("ulm_custom_card_speedtest_round"),
      ...G()
    ] : e.upstreamId === "custom_card_nas_metrics" ? [
      p(["binary_sensor", "sensor", "switch"]),
      p(["sensor"], "disk_entity"),
      E("disk_name"),
      { name: "disk_icon", selector: { icon: {} } },
      F("disk_color"),
      p(["sensor"], "temperature_entity"),
      E("temperature_name"),
      { name: "temperature_icon", selector: { icon: {} } },
      F("temperature_color"),
      C("temperature_max", 1, 1e5),
      p(["sensor"], "memory_entity"),
      E("memory_name"),
      { name: "memory_icon", selector: { icon: {} } },
      F("memory_color"),
      C("memory_max", 1, 1e5),
      p(["sensor"], "cpu_entity"),
      E("cpu_name"),
      { name: "cpu_icon", selector: { icon: {} } },
      F("cpu_color"),
      C("cpu_max", 1, 1e5),
      ...G()
    ] : e.upstreamId === "custom_card_input_datetime" ? [
      p(["input_datetime"]),
      ...G()
    ] : e.upstreamId === "custom_card_entity_overview" ? [
      p(),
      { name: "ulm_custom_card_entity_overview_icon", selector: { icon: {} } },
      ...[1, 2, 3, 4].flatMap((r) => [
        p(void 0, `ulm_custom_card_entity_overview_entity_${r}`),
        E(`ulm_custom_card_entity_overview_name_${r}`)
      ]),
      ...G()
    ] : e.upstreamId === "custom_card_internet_speed" ? [
      p(["sensor"]),
      p(["sensor"], "download_entity"),
      p(["sensor"], "upload_entity"),
      p(["sensor"], "ping_entity"),
      E("ulm_custom_card_internet_speed_router_name"),
      E("ulm_custom_card_internet_speed_router_model"),
      F("ulm_custom_card_internet_speed_color"),
      ...G()
    ] : e.upstreamId === "custom_card_weather_metrics" ? [
      p(["weather"]),
      p(["sensor"], "temperature_entity"),
      p(["sensor"], "date_entity"),
      ...[1, 2, 3, 4].flatMap((r) => [
        p(void 0, `ulm_custom_card_weather_metrics_entity_${r}`),
        E(`ulm_custom_card_weather_metrics_name_${r}`)
      ]),
      ...G()
    ] : e.upstreamId === "custom_card_tablet" ? [
      p(["binary_sensor", "sensor", "switch"]),
      p(["switch", "input_boolean"], "tablet_button_usb_entity"),
      p(["switch", "input_boolean"], "tablet_button_motion_entity"),
      p(["light", "switch", "input_boolean"], "tablet_button_display_entity"),
      p(["button"], "tablet_restart_entity"),
      p(["switch", "input_boolean"], "tablet_maintenance_entity"),
      p(["button"], "tablet_reload_entity"),
      p(["sensor"], "tablet_ram_entity"),
      p(["sensor"], "tablet_disk_entity"),
      p(["sensor", "binary_sensor", "switch"], "tablet_power_entity"),
      p(["sensor"], "battery_entity"),
      ...G()
    ] : (ia[e.family] ?? ia.entity)(e, t)
  ], o = tr.has(e.upstreamId) ? La(a) : a;
  return [
    ...ar(o).map(or),
    _e("tap_action"),
    _e("hold_action"),
    _e("double_tap_action")
  ];
}, rr = (e, t) => {
  const a = t?.variant ? (e.sourceIds ?? [e.upstreamId]).filter((r) => Zt(r) === t.variant || r === e.upstreamId && Zt(r) === void 0) : e.sourceIds ?? [e.upstreamId];
  return [...new Map(
    a.flatMap((r) => zt.get(r)?.variables ?? []).map((r) => [r.name, r])
  ).values()].filter((r) => Oa(e, r.name)).filter((r) => !Wo(e, r.name)).filter((r) => !Qo.has(r.name)).map((r) => {
    const n = er[r.name];
    if (n) return q(r.name, n);
    if (Jo.has(r.name)) return P(r.name);
    if (Zo.has(r.name)) return C(r.name, -1e5, 1e5);
    if (Xo.has(r.name))
      return {
        name: r.name,
        selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
      };
    switch (r.selector) {
      case "entity":
        return p(void 0, r.name);
      case "entity-multiple":
        return {
          name: r.name,
          selector: { entity: { multiple: !0 } }
        };
      case "action":
        return _e(r.name);
      case "icon":
        return { name: r.name, selector: { icon: {} } };
      case "color":
        return F(r.name);
      case "boolean":
        return P(r.name);
      case "number":
        return C(r.name, -1e5, 1e5);
      case "object":
        return { name: r.name, selector: { object: {} } };
      default:
        return E(r.name);
    }
  });
}, Ba = (e) => new Set(e.flatMap((t) => t.schema ? [...Ba(t.schema)] : t.name ? [t.name] : [])), nr = (e, t) => {
  const a = Ba(Fa(e, t));
  return rr(e, t).filter((o) => !a.has(o.name));
}, ir = [
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
], Et = (e, t) => t?.attributes.icon ? t.attributes.icon : e.upstreamId === "custom_card_trash" ? "mdi:trash-can-outline" : e.upstreamId === "custom_card_room_overview" ? "mdi:sofa" : e.upstreamId === "custom_card_roomview" ? "mdi:home-variant-outline" : e.upstreamId === "custom_card_entity_carousel" ? "mdi:view-carousel" : ["custom_card_speedtest_gauges", "custom_card_internet_speed"].includes(e.upstreamId) ? "mdi:speedometer" : e.upstreamId === "advanced_home_energy_management" ? "mdi:home-lightning-bolt-outline" : e.upstreamId === "advanced_energy_buy_sell" ? "mdi:chart-timeline-variant" : e.upstreamId === "advanced_energy_panel_health" ? "mdi:solar-power-variant" : ir.find(([a]) => a.test(e.upstreamId))?.[1] ?? "mdi:information-outline", sr = (e) => {
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
}, lr = (e) => {
  const t = {};
  for (const a of e.sourceIds ?? [e.upstreamId])
    for (const o of zt.get(a)?.variables ?? []) {
      if (!Oa(e, o.name)) continue;
      const r = sr(o.defaultValue);
      r !== void 0 && (t[o.name] = r);
    }
  return t;
}, Ga = (e, t, a) => {
  const o = a ? t?.states[a] : void 0, r = e.upstreamId === "mini_graph_card" ? {
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
    label_use_brightness: !1
  } : e.upstreamId === "custom_card_media_player_sonos" ? {
    ulm_card_media_player_enable_art: !1,
    sonos_details_always_visible: !1,
    ...Ct(t, a)
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
    ...Pt(t, a)
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
    "advanced_home_energy_management"
  ])).has(e.upstreamId);
  return {
    type: `custom:${e.tag}`,
    ...lr(e),
    ...r,
    entity: a,
    entities: e.upstreamId === "mini_graph_card" && a ? [a] : void 0,
    waste_streams: e.upstreamId === "custom_card_trash" ? Po() : void 0,
    show_today: e.upstreamId === "custom_card_trash" ? !1 : void 0,
    show_tomorrow: e.upstreamId === "custom_card_trash" ? !1 : void 0,
    name: void 0,
    icon: n ? void 0 : r.icon ?? Et(e, o),
    show_icon: !0,
    show_state: e.upstreamId !== "custom_card_pollen",
    layout: "default"
  };
}, cr = {
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
}, Ve = (e, t = "") => {
  const a = t ? e?.states[t] : void 0, o = t.split(".", 1)[0];
  return {
    entity: t,
    name: a?.attributes.friendly_name,
    icon: a?.attributes.icon ?? cr[o] ?? "mdi:gesture-tap-button",
    icon_type: a?.attributes.entity_picture ? "entity-picture" : "icon",
    color: "purple",
    tap_action: { action: "toggle" }
  };
};
var dr = Object.defineProperty, ur = Object.getOwnPropertyDescriptor, Vt = (e, t, a, o) => {
  for (var r = o > 1 ? void 0 : o ? ur(t, a) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = (o ? i(t, a, r) : i(r)) || r);
  return o && r && dr(t, a, r), r;
};
const _r = [
  { id: "context", title: "Context", icon: "mdi:shape-outline" },
  { id: "content", title: "Content", icon: "mdi:format-align-left" },
  { id: "layout", title: "Layout", icon: "mdi:view-dashboard-outline" },
  { id: "interactions", title: "Interactions", icon: "mdi:gesture-tap" },
  { id: "features", title: "Features", icon: "mdi:view-list" }
], mr = /* @__PURE__ */ new Set([
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
]), pr = /* @__PURE__ */ new Set([
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
]), hr = /* @__PURE__ */ new Set([
  "tap_action",
  "hold_action",
  "double_tap_action",
  "navigation_path",
  "settings_path"
]), sa = (e) => e.name === "entity" ? "context" : hr.has(e.name) || e.name.endsWith("_action") ? "interactions" : pr.has(e.name) || e.name.endsWith("_horizontal") || e.name.endsWith("_narrow_buttons") ? "layout" : mr.has(e.name) ? "content" : "features", gr = (e) => {
  const t = {
    context: [],
    content: [],
    layout: [],
    interactions: [],
    features: []
  };
  for (const a of e) {
    if (!a.schema?.length) {
      t[sa(a)].push(a);
      continue;
    }
    const o = /* @__PURE__ */ new Map();
    for (const r of a.schema) {
      const n = sa(r);
      o.set(n, [...o.get(n) ?? [], r]);
    }
    for (const [r, n] of o) t[r].push({ ...a, schema: n });
  }
  return t;
};
let qe = class extends fe {
  constructor() {
    super(...arguments), this.computeLabel = (e) => this.config?.type.includes("custom-card-trash") && e.name === "entity" ? "Optional card entity" : this.config?.type.includes("custom-card-washer") && e.name === "entity" ? ra(this.hass, "machine_state_entity") : ra(this.hass, e.name), this.computeHelper = (e) => Bo(
      this.config?.type.includes("custom-card-washer") && e.name === "entity" ? "machine_state_entity" : e.name
    ), this.valueChanged = (e) => {
      if (!this.config || !e.detail.value) return;
      const t = e.detail.value, a = { ...this.config, ...t };
      if (this.config.type.includes("mini-graph-card")) {
        const o = { ...this.config.show }, r = {
          mini_graph_show_legend: "legend",
          mini_graph_show_average: "average",
          mini_graph_show_extrema: "extrema",
          mini_graph_name_adaptive_color: "name_adaptive_color",
          mini_graph_icon_adaptive_color: "icon_adaptive_color",
          mini_graph_loading_indicator: "loading_indicator"
        };
        for (const [n, i] of Object.entries(r))
          Object.prototype.hasOwnProperty.call(t, n) && (Object.assign(o, { [i]: t[n] }), delete a[n]);
        typeof t.mini_graph_show_state == "string" && (o.state = t.mini_graph_show_state === "last" ? "last" : t.mini_graph_show_state !== "hidden", delete a.mini_graph_show_state);
        for (const [n, i] of [
          ["mini_graph_show_fill", "fill"],
          ["mini_graph_show_points", "points"],
          ["mini_graph_show_labels", "labels"],
          ["mini_graph_show_labels_secondary", "labels_secondary"]
        ]) {
          const l = t[n];
          typeof l == "string" && (Object.assign(o, {
            [i]: l === "fade" ? "fade" : l === "hover" ? "hover" : l !== "hidden"
          }), delete a[n]);
        }
        if ((t.variant === "line" || t.variant === "bar") && (o.graph = t.variant), a.show = o, typeof t.entity == "string" && t.entity !== this.config.entity) {
          const n = this.miniGraphEntities();
          n.length ? n[0] = { ...n[0], entity: t.entity } : n.push({ entity: t.entity }), a.entities = n;
        }
      }
      if (Object.prototype.hasOwnProperty.call(t, "name") && JSON.stringify(t.name) !== JSON.stringify(this.config.name) && delete a.name_mode, this.config.type.includes("media-player-sonos") && typeof t.entity == "string" && t.entity !== this.config.entity)
        for (const { configKey: o } of It)
          this.config[o] === void 0 && delete a[o];
      if (this.config.type.includes("custom-card-playstation") && typeof t.entity == "string" && t.entity !== this.config.entity)
        for (const { configKey: o } of za)
          this.config[o] === void 0 && delete a[o];
      this.config = a, le(this, "config-changed", { config: a });
    }, this.addMiniGraphEntity = () => {
      const e = this.miniGraphEntities(), t = new Set(e.map((o) => o.entity)), a = Object.keys(this.hass?.states ?? {}).find((o) => !t.has(o) && ["sensor", "binary_sensor", "input_number"].includes(o.split(".", 1)[0])) ?? "";
      e.push({ entity: a, show_graph: !0, show_line: !0, show_fill: !0, show_points: !0, show_legend: !0 }), this.updateMiniGraphConfig({ entities: e });
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
        ...xe(this.config),
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
    const t = e.type.replace(/^custom:/, ""), a = Mt.find((o) => o.tag === t);
    this.config = {
      ...e,
      variant: e.variant ?? a?.variant
    };
  }
  render() {
    if (!this.hass || !this.config) return h;
    const e = Co(this.config.type.replace(/^custom:/, ""));
    if (!e) return h;
    const t = Fa(e, this.config), a = nr(e, this.config).filter((u) => e.upstreamId !== "custom_card_trash" || !u.name.startsWith("ulm_card_datum_") && !u.name.includes("ophaling")), o = gr([...t, ...a]), r = Ga(e, this.hass, this.config.entity), n = this.config.show, i = {
      ...r,
      ...this.config,
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
    }, l = e.upstreamId === "mini_graph_card" ? this.renderMiniGraphEditors() : e.upstreamId === "custom_card_trash" ? this.renderWasteStreamEditor() : e.upstreamId === "custom_card_media_player_sonos" ? this.renderSonosShortcutEditor() : e.upstreamId === "custom_card_entity_carousel" ? this.renderCarouselItemEditor() : e.family === "scene" ? this.renderItemEditor(
      "scene_items",
      "Scene buttons",
      e.upstreamId === "card_welcome_scenes" ? void 0 : ["scene"]
    ) : e.upstreamId === "card_room" ? this.renderItemEditor("room_sensors", "Room sensor buttons") : h, s = e.upstreamId === "mini_graph_card" || e.upstreamId === "custom_card_trash" || e.upstreamId === "custom_card_media_player_sonos" || e.upstreamId === "custom_card_entity_carousel" || e.family === "scene" || e.upstreamId === "card_room";
    return d`
      <div class="editor-sections">
        ${_r.map((u) => this.renderEditorSection(
      u,
      o[u.id],
      i,
      u.id === "features" && s ? l : h,
      u.id === "features" && s
    ))}
      </div>
    `;
  }
  renderEditorSection(e, t, a, o, r) {
    return !t.length && !r ? h : d`
      <ha-expansion-panel class="editor-section" outlined>
        <span slot="header" class="section-header">
          <ha-icon .icon=${e.icon}></ha-icon>
          <span>${e.title}</span>
        </span>
        <div class="section-body">
          ${t.length ? d`
            <ha-form
              .hass=${this.hass}
              .data=${a}
              .schema=${t}
              .computeLabel=${this.computeLabel}
              .computeHelper=${this.computeHelper}
              @value-changed=${this.valueChanged}
            ></ha-form>
          ` : h}
          ${o}
        </div>
      </ha-expansion-panel>
    `;
  }
  renderItemEditor(e, t, a) {
    if (!this.config) return h;
    const o = this.config[e] ?? [], r = (o.length ? o : (this.config.entities ?? []).map((n) => ({ entity: n }))).map((n) => e === "scene_items" ? { ...Ve(this.hass, n.entity), ...n } : n);
    return d`
      <section class="item-editor">
        <h3>${t}</h3>
        <p>Each button starts with sensible values from its entity. You can override every value, including its name.</p>
        ${r.map((n, i) => d`
          <div class="item-row">
            <label class="field wide">
              <span>Button entity</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: a?.length ? { domain: a } : {} }}
                .value=${n.entity}
                @value-changed=${(l) => this.updateItem(e, i, "entity", l.detail.value)}
              ></ha-selector>
              <small>${e === "scene_items" ? "Select the entity this button controls. Welcome Scenes supports every Home Assistant domain." : "Select the entity represented by this room sensor button."}</small>
            </label>
            <label class="field">
              <span>Custom name</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${n.name ?? n.label ?? ""}
                @value-changed=${(l) => this.updateItem(e, i, "name", l.detail.value)}
              ></ha-selector>
              <small>Text shown below the button. Change it independently for every button.</small>
            </label>
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${n.icon}
                @value-changed=${(l) => this.updateItem(e, i, "icon", l.detail.value)}
              ></ha-selector>
              <small>Defaults to the entity icon or a suitable icon for its domain.</small>
            </label>
            ${e === "room_sensors" || e === "scene_items" ? d`
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
                  .value=${n.icon_type ?? "icon"}
                  @value-changed=${(l) => this.updateItem(e, i, "icon_type", l.detail.value)}
                ></ha-selector>
                <small>Show the selected icon or the entity picture when one is available.</small>
              </label>
            ` : h}
            <label class="field">
              <span>Color</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: { default_color: e === "room_sensors" ? "blue" : "purple" } }}
                .value=${n.color}
                @value-changed=${(l) => this.updateItem(e, i, "color", l.detail.value)}
              ></ha-selector>
              <small>Accent color used by the button and its active state.</small>
            </label>
            ${e === "scene_items" ? d`
              <label class="field">
                <span>Navigation path</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{ navigation: {} }}
                  .value=${n.navigation_path ?? n.nav_path ?? ""}
                  @value-changed=${(l) => this.updateItem(e, i, "navigation_path", l.detail.value)}
                ></ha-selector>
                <small>Optional destination selected from your Home Assistant dashboards. It overrides the tap action.</small>
              </label>
            ` : h}
            <label class="field">
              <span>Tap action</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_action: {} }}
                .value=${n.tap_action}
                @value-changed=${(l) => this.updateItem(e, i, "tap_action", l.detail.value)}
              ></ha-selector>
              <small>Defaults to activating scenes and toggling other supported entities.</small>
            </label>
            <div class="item-actions wide">
              <button @click=${() => this.removeItem(e, i)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${() => this.addItem(e)}>Add button</button>
      </section>
    `;
  }
  miniGraphEntities() {
    const e = this.config?.entities, a = (Array.isArray(e) ? e : []).flatMap((o) => typeof o == "string" ? [{ entity: o }] : o && typeof o == "object" && typeof o.entity == "string" ? [{ ...o }] : []);
    return !a.length && this.config?.entity && a.push({ entity: this.config.entity }), a;
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
    const e = this.miniGraphEntities(), t = this.miniGraphThresholds(), a = this.miniGraphStateMap(), o = [
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
    return d`
      <section class="item-editor mini-graph-entities">
        <h3>Graph entities</h3>
        <p>Entities are rendered in this order. Every series can override aggregation, axis, color, visibility, attributes, and smoothing.</p>
        ${e.map((n, i) => d`
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
                .selector=${{ select: { mode: "dropdown", options: o } }}
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
            ${r.map(([l, s]) => d`
              <label class="field">
                <span>${s}</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{ boolean: {} }}
                  .value=${n[l] ?? ["show_graph", "show_line", "show_fill", "show_points", "show_legend"].includes(l)}
                  @value-changed=${(u) => this.updateMiniGraphEntity(i, l, u.detail.value)}
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
        ${t.map((n, i) => d`
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
        ${a.map((n, i) => d`
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
              <button ?disabled=${i === a.length - 1}
                @click=${() => this.moveMiniGraphState(i, 1)}>Move down</button>
              <button @click=${() => this.removeMiniGraphState(i)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addMiniGraphState}>Add state mapping</button>
      </section>
    `;
  }
  updateMiniGraphEntity(e, t, a) {
    const o = this.miniGraphEntities();
    o[e] = { ...o[e], [t]: a === "" ? void 0 : a }, this.updateMiniGraphConfig({
      entities: o,
      entity: o[0]?.entity
    });
  }
  removeMiniGraphEntity(e) {
    const t = this.miniGraphEntities().filter((a, o) => o !== e);
    this.updateMiniGraphConfig({
      entities: t,
      entity: t[0]?.entity
    });
  }
  moveMiniGraphEntity(e, t) {
    const a = this.miniGraphEntities(), o = e + t;
    o < 0 || o >= a.length || ([a[e], a[o]] = [a[o], a[e]], this.updateMiniGraphConfig({
      entities: a,
      entity: a[0]?.entity
    }));
  }
  updateMiniGraphThreshold(e, t, a) {
    const o = this.miniGraphThresholds();
    o[e] = {
      ...o[e],
      [t]: a === "" || a === void 0 ? void 0 : a
    }, this.updateMiniGraphConfig({ color_thresholds: o });
  }
  removeMiniGraphThreshold(e) {
    this.updateMiniGraphConfig({
      color_thresholds: this.miniGraphThresholds().filter((t, a) => a !== e)
    });
  }
  moveMiniGraphThreshold(e, t) {
    const a = this.miniGraphThresholds(), o = e + t;
    o < 0 || o >= a.length || ([a[e], a[o]] = [a[o], a[e]], this.updateMiniGraphConfig({ color_thresholds: a }));
  }
  updateMiniGraphState(e, t, a) {
    const o = this.miniGraphStateMap();
    o[e] = { ...o[e], [t]: a === "" ? void 0 : a }, this.updateMiniGraphConfig({ state_map: o });
  }
  removeMiniGraphState(e) {
    this.updateMiniGraphConfig({
      state_map: this.miniGraphStateMap().filter((t, a) => a !== e)
    });
  }
  moveMiniGraphState(e, t) {
    const a = this.miniGraphStateMap(), o = e + t;
    o < 0 || o >= a.length || ([a[e], a[o]] = [a[o], a[e]], this.updateMiniGraphConfig({ state_map: a }));
  }
  updateMiniGraphConfig(e) {
    if (!this.config) return;
    const t = { ...this.config, ...e };
    this.config = t, le(this, "config-changed", { config: t });
  }
  renderWasteStreamEditor() {
    if (!this.config) return h;
    const e = xe(this.config);
    return d`
      <section class="item-editor waste-stream-editor">
        <h3>Waste streams</h3>
        <p>Each enabled row uses its own sensor or calendar entity. Empty or disabled rows are omitted from the card.</p>
        ${e.map((t, a) => d`
          <div class="item-row waste-stream-row" data-stream-index=${a}>
            <h4>${t.label || `Waste stream ${a + 1}`}</h4>
            <label class="field">
              <span>Show this waste stream</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ boolean: {} }}
                .value=${t.enabled !== !1}
                @value-changed=${(o) => this.updateWasteStream(a, "enabled", o.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>Collection date entity</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: { domain: ["sensor", "calendar"] } }}
                .value=${t.entity}
                @value-changed=${(o) => this.updateWasteStream(a, "entity", o.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Label</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${t.label ?? ""}
                @value-changed=${(o) => this.updateWasteStream(a, "label", o.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${t.icon}
                @value-changed=${(o) => this.updateWasteStream(a, "icon", o.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Color</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: { default_color: "green" } }}
                .value=${t.color}
                @value-changed=${(o) => this.updateWasteStream(a, "color", o.detail.value)}
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
  renderSonosShortcutEditor() {
    if (!this.config) return h;
    const e = this.config.shortcuts?.buttons ?? [], t = Math.min(8, Math.max(1, Math.round(this.config.shortcuts?.columns ?? 4)));
    return d`
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
              @value-changed=${(a) => this.updateSonosColumns(a.detail.value)}
            ></ha-selector>
            <small>Number of shortcut buttons shown on each row.</small>
          </label>
        </div>
        ${e.map((a, o) => d`
          <div class="item-row sonos-shortcut-row" data-shortcut-index=${o}>
            <h4>${a.name || `Shortcut ${o + 1}`}</h4>
            <label class="field">
              <span>Label</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${a.name ?? ""}
                @value-changed=${(r) => this.updateSonosShortcut(o, "name", r.detail.value)}
              ></ha-selector>
              <small>Optional text shown below the icon.</small>
            </label>
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${a.icon ?? "mdi:playlist-music"}
                @value-changed=${(r) => this.updateSonosShortcut(o, "icon", r.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Media type</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${a.type ?? "playlist"}
                @value-changed=${(r) => this.updateSonosShortcut(o, "type", r.detail.value)}
              ></ha-selector>
              <small>Use playlist for Spotify playlist IDs, or another media type supported by your player.</small>
            </label>
            <label class="field wide">
              <span>Playlist or media ID</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${a.id ?? ""}
                @value-changed=${(r) => this.updateSonosShortcut(o, "id", r.detail.value)}
              ></ha-selector>
              <small>For example: spotify:playlist:4Peff17x9lxkDupqOF0ive</small>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${o === 0} @click=${() => this.moveSonosShortcut(o, -1)}>Move up</button>
              <button ?disabled=${o === e.length - 1}
                @click=${() => this.moveSonosShortcut(o, 1)}>Move down</button>
              <button @click=${() => this.removeSonosShortcut(o)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addSonosShortcut}>Add playlist shortcut</button>
      </section>
    `;
  }
  renderCarouselItemEditor() {
    if (!this.config) return h;
    const e = this.config.carousel_items ?? [];
    return d`
      <section class="item-editor carousel-item-editor">
        <h3>Carousel items</h3>
        <p>Add entity-aware icon buttons. Swipe or scroll to move through them; tap the centered item to run its action.</p>
        ${e.map((t, a) => d`
          <div class="item-row carousel-item-row" data-carousel-index=${a}>
            <h4>${t.name || t.entity || `Item ${a + 1}`}</h4>
            <label class="field wide">
              <span>Entity</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: {} }}
                .value=${t.entity ?? ""}
                @value-changed=${(o) => this.updateCarouselItem(a, "entity", o.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Label</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${t.name ?? ""}
                @value-changed=${(o) => this.updateCarouselItem(a, "name", o.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${t.icon ?? ""}
                @value-changed=${(o) => this.updateCarouselItem(a, "icon", o.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Color</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: {} }}
                .value=${t.color ?? "primary"}
                @value-changed=${(o) => this.updateCarouselItem(a, "color", o.detail.value)}
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
                @value-changed=${(o) => this.updateCarouselItem(a, "icon_type", o.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>Tap action</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_action: {} }}
                .value=${t.tap_action ?? { action: "more-info" }}
                @value-changed=${(o) => this.updateCarouselItem(a, "tap_action", o.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>Hold action</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_action: {} }}
                .value=${t.hold_action ?? { action: "none" }}
                @value-changed=${(o) => this.updateCarouselItem(a, "hold_action", o.detail.value)}
              ></ha-selector>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${a === 0} @click=${() => this.moveCarouselItem(a, -1)}>Move up</button>
              <button ?disabled=${a === e.length - 1}
                @click=${() => this.moveCarouselItem(a, 1)}>Move down</button>
              <button @click=${() => this.removeCarouselItem(a)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addCarouselItem}>Add carousel item</button>
      </section>
    `;
  }
  updateItem(e, t, a, o) {
    if (!this.config) return;
    const r = [...this.config[e] ?? (this.config.entities ?? []).map((n) => ({ entity: n }))];
    if (e === "scene_items" && a === "entity" && typeof o == "string") {
      const n = r[t], i = Ve(this.hass, n.entity), l = Ve(this.hass, o), s = { ...n, entity: o };
      for (const u of ["name", "icon", "icon_type", "color", "tap_action"])
        (n[u] === void 0 || JSON.stringify(n[u]) === JSON.stringify(i[u])) && Object.assign(s, { [u]: l[u] });
      r[t] = s;
    } else
      r[t] = { ...r[t], [a]: o || void 0 };
    this.updateItems(e, r);
  }
  addItem(e) {
    if (!this.config) return;
    const t = [...this.config[e] ?? (this.config.entities ?? []).map((o) => ({ entity: o }))], a = e === "scene_items" ? Object.keys(this.hass?.states ?? {}).find((o) => o.startsWith("scene.")) ?? "" : "";
    t.push(e === "scene_items" ? Ve(this.hass, a) : { entity: "" }), this.updateItems(e, t);
  }
  removeItem(e, t) {
    if (!this.config) return;
    const a = [...this.config[e] ?? (this.config.entities ?? []).map((o) => ({ entity: o }))].filter((o, r) => r !== t);
    this.updateItems(e, a);
  }
  updateItems(e, t) {
    if (!this.config) return;
    const a = { ...this.config, [e]: t, entities: void 0 };
    this.config = a, le(this, "config-changed", { config: a });
  }
  updateWasteStream(e, t, a) {
    if (!this.config) return;
    const o = xe(this.config);
    o[e] = {
      ...o[e],
      [t]: t === "enabled" ? a !== !1 : a || void 0
    }, this.updateWasteStreams(o);
  }
  removeWasteStream(e) {
    this.config && this.updateWasteStreams(xe(this.config).filter((t, a) => a !== e));
  }
  moveWasteStream(e, t) {
    if (!this.config) return;
    const a = xe(this.config), o = e + t;
    o < 0 || o >= a.length || ([a[e], a[o]] = [a[o], a[e]], this.updateWasteStreams(a));
  }
  updateWasteStreams(e) {
    if (!this.config) return;
    const t = { ...this.config, waste_streams: e };
    this.config = t, le(this, "config-changed", { config: t });
  }
  updateSonosColumns(e) {
    if (!this.config) return;
    const t = Math.min(8, Math.max(1, Math.round(Number(e) || 4)));
    this.updateSonosShortcuts(this.config.shortcuts?.buttons ?? [], t);
  }
  updateCarouselItem(e, t, a) {
    if (!this.config) return;
    const o = [...this.config.carousel_items ?? []];
    o[e] = { ...o[e], [t]: a || void 0 }, this.updateCarouselItems(o);
  }
  removeCarouselItem(e) {
    this.config && this.updateCarouselItems(
      (this.config.carousel_items ?? []).filter((t, a) => a !== e)
    );
  }
  moveCarouselItem(e, t) {
    if (!this.config) return;
    const a = [...this.config.carousel_items ?? []], o = e + t;
    o < 0 || o >= a.length || ([a[e], a[o]] = [a[o], a[e]], this.updateCarouselItems(a));
  }
  updateCarouselItems(e) {
    if (!this.config) return;
    const t = { ...this.config, carousel_items: e };
    this.config = t, le(this, "config-changed", { config: t });
  }
  updateSonosShortcut(e, t, a) {
    if (!this.config) return;
    const o = [...this.config.shortcuts?.buttons ?? []];
    o[e] = { ...o[e], [t]: a || void 0 }, this.updateSonosShortcuts(o);
  }
  removeSonosShortcut(e) {
    this.config && this.updateSonosShortcuts(
      (this.config.shortcuts?.buttons ?? []).filter((t, a) => a !== e)
    );
  }
  moveSonosShortcut(e, t) {
    if (!this.config) return;
    const a = [...this.config.shortcuts?.buttons ?? []], o = e + t;
    o < 0 || o >= a.length || ([a[e], a[o]] = [a[o], a[e]], this.updateSonosShortcuts(a));
  }
  updateSonosShortcuts(e, t = this.config?.shortcuts?.columns ?? 4) {
    if (!this.config) return;
    const a = { ...this.config, shortcuts: { columns: t, buttons: e } };
    this.config = a, le(this, "config-changed", { config: a });
  }
};
qe.styles = rt`
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
Vt([
  Ie({ attribute: !1 })
], qe.prototype, "hass", 2);
Vt([
  me()
], qe.prototype, "config", 2);
qe = Vt([
  xa("mushroom-addition-editor")
], qe);
const yr = rt`
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
    border: 0;
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
  .bar-card {
    display: grid;
    min-height: 96px;
    grid-template-rows: minmax(60px, 1fr) 35px;
    overflow: hidden;
    border-radius: 20px;
    background: var(--ha-card-background, var(--card-background-color, #fff));
  }
  .bar-card.bar-only {
    min-height: 35px;
    grid-template-rows: 35px;
  }
  .bar-card-header {
    display: grid;
    grid-template-columns: var(--mush-icon-size, 40px) minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
  }
  .bar-card-icon {
    display: grid;
    place-items: center;
    width: var(--mush-icon-size, 40px);
    height: var(--mush-icon-size, 40px);
    border-radius: 50%;
    color: var(--bar-icon-color);
    background: color-mix(in srgb, var(--bar-icon-color) 12%, transparent);
  }
  .bar-card-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
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
    background: color-mix(
      in srgb,
      var(--bar-fill) 16%,
      var(--card-background-color, var(--ha-card-background, #fff))
    );
  }
  .bar-card-fill {
    position: absolute;
    inset: 0 auto 0 0;
    background: var(--bar-fill);
  }
  .bar-card-inside-value {
    position: absolute;
    inset: 0 8px 0 0;
    z-index: 1;
    color: var(--primary-text-color);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 12px;
  }
  .bar-card-inside-value-filled {
    color: var(--text-primary-color, #fff);
    clip-path: inset(0 calc(100% - var(--bar-percentage)) 0 0);
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
  .entity-carousel-presentation { padding: 12px; }
  .entity-carousel-presentation .ulm-copy { justify-content: center; }
  .metric-value { color: rgb(var(--ulm-blue)); font-size: 20px; font-weight: 650; }
  .sparkline { width: 100%; height: 48px; overflow: visible; }
  .sparkline polyline { fill: none; stroke: var(--sparkline-color, rgb(var(--ulm-blue))); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
  .sparkline.is-filled polyline { stroke: var(--sparkline-color, rgb(var(--ulm-red))); }
  .sparkline.is-filled polygon { fill: color-mix(in srgb, var(--sparkline-fill-color, rgb(var(--ulm-red))) 18%, transparent); }
  .ulm-default-graph { padding: 0 12px 8px; }
  .ulm-default-graph .metric-heading { padding-right: 0; padding-left: 0; }
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
  .room-sensor ha-icon { color: var(--item-color); }
  .room-sensor-picture { display: block; width: 38px; height: 38px; border-radius: 50%; background-position: center; background-size: cover; }
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
  .ulm-gauge-card { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 12px; padding: 12px; }
  .gauge-ring { position: relative; display: grid; width: 64px; height: 64px; place-items: center; border-radius: 50%; background: conic-gradient(rgb(var(--ulm-blue)) var(--gauge), rgba(var(--ulm-grey), .12) 0); }
  .gauge-ring::before { content: ""; position: absolute; width: 48px; height: 48px; border-radius: 50%; background: var(--card-background-color); }
  .gauge-ring b { position: relative; z-index: 1; font-size: 11px; }
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
  .custom-room-view { display: grid; min-height: 150px; gap: 8px; padding: 12px; }
  .room-view-summary { display: flex; align-items: center; gap: 10px; }
  .room-view-summary > span:last-child { display: flex; flex-direction: column; gap: 6px; color: var(--secondary-text-color); }
  .room-view-summary b, .room-view-summary small { display: flex; align-items: center; gap: 3px; }
  .room-view-icon { position: relative; display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--ulm-grey), .1); color: rgba(var(--ulm-grey), .45); }
  .room-view-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
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
  .custom-room-overview.light-on { background: rgba(var(--ulm-yellow), .12); }
  .custom-room-overview.dynamic-color { background: rgba(var(--room-rgb, 255,152,0), .2); }
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
  .custom-entity-overview, .custom-weather-metrics, .custom-internet-speed,
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
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: center; gap: 7px;
  }
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
  .speedtest-action:disabled, .metrics-four button:disabled { cursor: not-allowed; opacity: .45; }
  .nas-metrics-header {
    display: flex; min-width: 0; align-items: center; gap: 10px;
  }
  .custom-entity-overview, .custom-weather-metrics { min-height: 160px; border-radius: 30px; }
  .metrics-panel, .weather-metrics-panel { display: grid; min-height: 66px; align-items: center; border: 2px solid rgba(var(--ulm-grey), .65); border-radius: 20px; }
  .metrics-panel { grid-template-columns: 1fr; padding: 0 12px; }
  .metrics-panel > b { margin-left: 23px; color: var(--secondary-text-color); font-size: 14px; }
  .metrics-main-name { display: flex; align-items: center; gap: 7px; font-size: 14px; font-weight: 700; }
  .metrics-main-name ha-icon { --mdc-icon-size: 18px; }
  .weather-metrics-panel { grid-template-columns: 1fr auto; padding-left: 12px; }
  .weather-metrics-panel .weather-date { font-size: 14px; }
  .weather-metrics-panel strong { margin-right: 12px; color: var(--primary-text-color); font-size: 20px; }
  .metrics-four { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
  .metrics-four > button { display: grid; min-width: 0; min-height: 54px; place-items: center; padding: 6px 3px; border: 0; background: transparent; color: var(--primary-text-color); text-align: center; }
  .metrics-four b, .metrics-four small { overflow: hidden; max-width: 100%; text-overflow: ellipsis; white-space: nowrap; }
  .metrics-four b { font-size: 14px; } .metrics-four small { color: var(--secondary-text-color); font-size: 12px; font-weight: 700; }
  .speedtest-action { display: grid; min-height: 40px; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; padding: 0 12px; border: 2px solid rgba(var(--ulm-grey), .65); border-radius: 10px; background: transparent; color: var(--primary-text-color); font-size: 16px; font-weight: 700; text-align: left; }
  .speedtest-action ha-icon { --mdc-icon-size: 20px; }
  .speedtest-metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .speedtest-metrics > button { display: grid; gap: 2px; min-height: 80px; place-items: center; padding: 8px; border: 0; border-radius: 14px; background: rgba(var(--ulm-grey), .07); color: var(--primary-text-color); }
  .speedtest-metrics small { color: var(--secondary-text-color); font-size: 10px; }
  .speedtest-metrics b { display: flex; max-width: 100%; align-items: baseline; justify-content: center; gap: 3px; overflow: hidden; font-size: 23px; text-overflow: ellipsis; white-space: nowrap; }
  .speedtest-metrics b em { color: var(--secondary-text-color); font-size: 10px; font-style: normal; font-weight: 700; }
  .custom-more-power-outlet {
    display: grid; min-height: 62px; grid-template-columns: 46px minmax(0, 1fr); align-items: center; gap: 10px; padding: 10px 14px;
  }
  .custom-dual-gauge { display: grid; min-height: 210px; gap: 10px; padding: 12px; }
  .dual-gauge { position: relative; align-self: end; justify-self: center; width: min(86%, 240px); height: 108px; overflow: hidden; }
  .dual-gauge > i { position: absolute; top: 0; left: 50%; width: 210px; height: 210px; transform: translateX(-50%); border-radius: 50%; background: conic-gradient(from 270deg, rgb(var(--ulm-blue)) var(--gauge), rgba(var(--ulm-grey), .1) 0 180deg, transparent 180deg); }
  .dual-gauge > i::after { content: ""; position: absolute; inset: 48px; border-radius: 50%; background: var(--card-background-color); }
  .dual-gauge > span { position: absolute; right: 0; bottom: 8px; left: 0; z-index: 1; display: grid; text-align: center; }
  .dual-gauge > span b { font-size: 18px; } .dual-gauge small { color: var(--secondary-text-color); font-size: 11px; }
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
    display: grid; min-width: 0; grid-template-columns: 52px minmax(0, 1fr) auto; align-items: center; gap: 10px;
  }
  .console-logo {
    display: grid; width: 52px; height: 52px; place-items: center; border-radius: 50%;
    background: rgba(var(--console-tone), .18); color: rgb(var(--console-tone));
  }
  .console-logo.has-picture { background-position: center; background-size: cover; }
  .console-logo ha-icon { --mdc-icon-size: 32px; }
  .state-unavailable .console-logo, .state-unknown .console-logo {
    color: rgba(var(--ulm-grey), .5); background: rgba(var(--ulm-grey), .1);
  }
  .console-title { display: grid; min-width: 0; gap: 3px; }
  .console-title b, .console-title small {
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .console-title b { font-size: 14px; }
  .console-title small { color: var(--secondary-text-color); font-size: 12px; }
  .has-artwork .console-title small { color: rgba(255,255,255,.75); }
  .console-top-stats { display: grid; justify-items: end; gap: 4px; }
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
`, br = {
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
}, fr = (e, t) => {
  const a = e?.trim() || t.trim();
  if (a === "primary")
    return e ? `var(--primary-color, ${t})` : "var(--primary-color)";
  if (a === "accent")
    return e ? `var(--accent-color, ${t})` : "var(--accent-color)";
  const o = br[a];
  return o ? `rgb(var(--rgb-${a}, ${o}))` : a;
}, Ee = (e, t) => {
  if (!t) return;
  const a = Number.parseFloat(e.states[t]?.state ?? "");
  return Number.isFinite(a) ? a : void 0;
}, vr = (e, t, a = "") => t ? e.states[t]?.attributes.unit_of_measurement ?? a : a, $e = (e, t) => {
  const a = Ee(e, t);
  if (a === void 0) return;
  const o = vr(e, t).toLowerCase();
  return o === "mw" ? a * 1e6 : o === "kw" ? a * 1e3 : a;
}, ye = (e) => {
  const t = Math.abs(e ?? 0);
  return t >= 1e3 ? `${(t / 1e3).toFixed(2).replace(".", ",")} kW` : `${Math.round(t).toLocaleString()} W`;
}, bt = (e, t, a, o = 380, r = 300) => {
  const n = (m) => {
    const g = m * Math.PI / 180;
    return [
      o + e * Math.sin(g),
      r - e * Math.cos(g)
    ];
  }, [i, l] = n(t), [s, u] = n(a);
  return `M${i.toFixed(1)} ${l.toFixed(1)}A${e} ${e} 0 ${a - t > 180 ? 1 : 0} 1 ${s.toFixed(1)} ${u.toFixed(1)}`;
}, wr = (e, t, a, o, r = !1) => {
  const n = Math.max(0, Math.min(1, o));
  if (n < 0.015) return;
  const i = (a - t) * n;
  return r ? bt(e, a - i, a) : bt(e, t, t + i);
}, $r = (e) => {
  const t = e?.attributes.raw_today;
  return Array.isArray(t) ? t : [];
}, xr = (e, t = 0, a = 0) => $r(e).flatMap((o) => {
  if (!o || typeof o != "object") return [];
  const r = o, n = new Date(String(r.start ?? "")).getTime(), i = new Date(String(r.end ?? "")).getTime(), l = Number(r.value);
  return !Number.isFinite(n) || !Number.isFinite(i) || !Number.isFinite(l) ? [] : [{
    start: n,
    end: i,
    price: (l + t) * (1 + a / 100)
  }];
}), Sr = (e) => {
  if (typeof e == "number" && Number.isFinite(e))
    return e < 1e12 ? e * 1e3 : e;
  if (typeof e != "string" || !e.trim()) return;
  const t = Date.parse(e);
  return Number.isFinite(t) ? t : void 0;
}, kr = (e) => {
  const t = e?.attributes.slots;
  return Array.isArray(t) ? t.flatMap((a) => {
    if (!Array.isArray(a) || a.length < 3) return [];
    const o = Sr(a[0]);
    if (typeof a[1] != "number" && (typeof a[1] != "string" || !a[1].trim()) || typeof a[2] != "number" && (typeof a[2] != "string" || !a[2].trim())) return [];
    const r = Number(a[1]), n = Number(a[2]);
    return o === void 0 || !Number.isFinite(r) || !Number.isInteger(n) || n < 0 || n > 3 ? [] : [{ timestamp: o, price: r, kind: n }];
  }).sort((a, o) => a.timestamp - o.timestamp) : [];
}, Mr = (e, t, a) => {
  const o = e.map(({ price: l }) => l), r = Number.isFinite(t) ? t : Math.min(0, ...o), n = Number.isFinite(a) ? a : Math.max(0, ...o);
  if (n > r) {
    const l = Number.isFinite(a) ? 0 : (n - r) * 0.06;
    return { minimum: r, maximum: n + l };
  }
  const i = Math.max(Math.abs(r) * 0.1, 1);
  return { minimum: r - i, maximum: n + i };
}, la = (e, t = 2) => e.toFixed(Math.max(0, Math.min(6, Math.floor(t)))), Ir = (e, t) => {
  const { energy: a, power: o, efficiency: r, fee: n, slotMinutes: i } = t;
  if (![a, o, r, n, i].every(Number.isFinite) || a <= 0 || o <= 0 || r <= 0 || r > 100 || n < 0 || i <= 0) return { error: "Enter a positive trade size, power and slot duration, an efficiency from 1 to 100%, and a non-negative feed-in fee." };
  if (e.length === 0) return { error: "No price slots available for the buy and sell result." };
  const l = [...e].sort((c, y) => c.timestamp - y.timestamp);
  if (l.some(
    (c, y) => !Number.isFinite(c.timestamp) || !Number.isFinite(c.price) || y > 0 && c.timestamp === l[y - 1].timestamp
  )) return { error: "Price slots must contain finite prices and unique timestamps." };
  const s = l.map((c, y) => ({
    ...c,
    duration: Math.min(
      i * 6e4,
      l[y + 1] ? l[y + 1].timestamp - c.timestamp : 1 / 0
    )
  })).sort((c, y) => c.price - y.price || c.timestamp - y.timestamp), u = /* @__PURE__ */ new Set(), m = (c, y) => {
    let f = c, k = 0;
    const v = [];
    for (let z = 0; z < s.length && f > 1e-9; z++) {
      const w = s[y ? s.length - 1 - z : z];
      if (u.has(w.timestamp)) continue;
      const D = Math.min(f, o * w.duration / 36e5);
      u.add(w.timestamp), v.push({ start: w.timestamp, end: w.timestamp + D / o * 36e5, energy: D }), k += D * w.price, f -= D;
    }
    if (!(f > 1e-9))
      return {
        slots: v.sort((z, w) => z.start - w.start),
        energy: c,
        averagePrice: k / c,
        amount: y ? k - n * c : -k
      };
  }, g = m(a / (r / 100), !1), _ = m(a, !0);
  return !g || !_ ? { error: "Not enough separate price slots to buy and sell the configured trade size. Reduce the trade size or supply more prices." } : { buy: g, sell: _, net: g.amount + _.amount };
}, Ar = (e) => {
  const t = Number.parseFloat(e.state);
  return Number.isFinite(t) ? t : 0;
}, Cr = (e, t, a) => {
  const o = t?.length ? t : a ? [a] : Object.keys(e).filter((r) => /^sensor\.inverter_4/i.test(r));
  return [...new Set(o)].filter((r) => r.startsWith("sensor.") && e[r] !== void 0).sort((r, n) => r.localeCompare(n, void 0, { numeric: !0 })).map((r) => {
    const n = e[r];
    return {
      entity: n,
      id: r.slice(-4),
      value: Ar(n)
    };
  });
}, Pr = (e) => {
  const t = e.reduce((n, i) => n + i.value, 0), a = [...e].sort((n, i) => n.value - i.value || n.entity.entity_id.localeCompare(i.entity.entity_id)), o = a[0], r = a.at(-1);
  return {
    panels: [...e],
    activeCount: e.filter(({ value: n }) => n > 0).length,
    totalOutput: t,
    averageOutput: e.length ? t / e.length : 0,
    best: r,
    weakest: o,
    spread: r && o ? r.value - o.value : 0
  };
}, zr = (e, t) => Math.max(0, Math.min(100, e / Math.max(1, t) * 100)), Er = (e, t, a) => {
  let o = 0;
  return t.forEach((r, n) => {
    e >= r && (o = n);
  }), a[Math.min(o, a.length - 1)] ?? "var(--primary-color)";
};
var Vr = Object.defineProperty, Dr = Object.getOwnPropertyDescriptor, Ae = (e, t, a, o) => {
  for (var r = o > 1 ? void 0 : o ? Dr(t, a) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = (o ? i(t, a, r) : i(r)) || r);
  return o && r && Vr(t, a, r), r;
};
const Or = /* @__PURE__ */ new Set(["off", "unknown", "unavailable", "none", "idle"]);
let he = class extends fe {
  constructor() {
    super(...arguments), this.selectedIndex = 0, this.carouselWidth = 0, this.dragOffset = 0, this.dragging = !1, this.horizontalVelocity = 0, this.pointerAxis = "pending", this.holdFired = !1, this.pointerStartedOnItem = !1, this.onPointerDown = (e) => {
      if (e.pointerType && e.isPrimary === !1) return;
      e.stopPropagation(), this.dragStartX = e.clientX, this.dragStartY = e.clientY, this.lastPointerX = e.clientX, this.lastPointerTime = e.timeStamp, this.horizontalVelocity = 0, this.pointerAxis = "pending", this.dragOffset = 0, this.dragging = !1, this.holdFired = !1;
      const t = e.composedPath().find((o) => o instanceof HTMLElement && o.matches("button[data-carousel-index]")), a = Number(t?.dataset.carouselIndex);
      this.pointerStartedOnItem = !!t && Number.isInteger(a), this.pointerItemIndex = this.pointerStartedOnItem ? a : this.selectedIndex, this.pointerStartedOnItem && this.pointerItemIndex === this.selectedIndex && (this.holdTimer = window.setTimeout(() => {
        this.holdFired = !0, this.runItemAction(this.items[this.pointerItemIndex ?? this.selectedIndex], "hold");
      }, 500));
    }, this.onPointerMove = (e) => {
      if (this.dragStartX === void 0 || this.dragStartY === void 0) return;
      const t = e.clientX - this.dragStartX, a = e.clientY - this.dragStartY;
      if (this.pointerAxis === "pending") {
        if (Math.max(Math.abs(t), Math.abs(a)) < 4) return;
        if (Math.abs(a) > Math.abs(t) * 1.15) {
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
      const o = Math.max(1, e.timeStamp - (this.lastPointerTime ?? e.timeStamp));
      this.horizontalVelocity = (e.clientX - (this.lastPointerX ?? e.clientX)) / o, this.lastPointerX = e.clientX, this.lastPointerTime = e.timeStamp, this.dragOffset = this.constrainDrag(t);
    }, this.onPointerUp = (e) => {
      if (e.stopPropagation(), this.dragStartX === void 0) return;
      const t = e.clientX - this.dragStartX, a = e.clientY - (this.dragStartY ?? e.clientY), o = this.pointerItemIndex ?? this.selectedIndex, r = this.pointerStartedOnItem, n = this.pointerAxis === "horizontal", i = this.pointerAxis === "vertical" || Math.abs(a) > Math.abs(t) * 1.15, l = Math.max(1, e.timeStamp - (this.lastPointerTime ?? e.timeStamp)), s = Math.abs(e.clientX - (this.lastPointerX ?? e.clientX)) > 0 ? (e.clientX - (this.lastPointerX ?? e.clientX)) / l : this.horizontalVelocity;
      if (this.clearHold(), this.resetPointer(), n && (Math.abs(t) >= 10 || Math.abs(s) >= 0.16)) {
        this.select(t > 0 || s > 0 ? -1 : 1);
        return;
      }
      if (this.holdFired) {
        this.holdFired = !1;
        return;
      }
      if (!n && !(i || Math.max(Math.abs(t), Math.abs(a)) >= 6) && r) {
        if (o !== this.selectedIndex) {
          this.selectIndex(o);
          return;
        }
        this.runItemAction(this.items[o], "tap");
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
      const t = this.items.length, a = Math.max(0, Math.round(this.config?.carousel_initial_index ?? 0));
      this.selectedIndex = t ? Math.min(a, t - 1) : 0;
    }
  }
  render() {
    const e = this.items;
    if (!e.length)
      return d`<div class="carousel"><span class="label">Add carousel items in the card editor</span></div>`;
    const t = this.visibleCount, a = e[this.selectedIndex], o = this.entityFor(a);
    return d`
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
        ${this.config?.carousel_show_labels === !1 ? h : d`
          <div class="label">
            ${this.itemName(a, o)}
            ${this.showEntityState(o) ? d`<span class="state">${o?.state}</span>` : h}
          </div>
        `}
      </div>
    `;
  }
  renderItem(e, t, a) {
    const o = this.itemOffset(t), r = Math.abs(o), n = this.itemIsHidden(o, a), i = t === this.selectedIndex, l = this.entityFor(e), s = e.color || (l?.attributes.icon, "primary"), u = this.coverflowModifier, m = this.effect === "coverflow" ? this.coverflowStretch * u : 0, g = Math.max(18, 58 + m), _ = o + this.dragOffset / g, c = Math.abs(_), f = (this.centeredSlides ? 0 : -((a - 1) * g) / 2) + o * g + this.dragOffset, k = this.effect === "coverflow" ? -c * this.coverflowDepth * u : 0, v = this.effect === "coverflow" ? _ * -this.coverflowRotate * u : 0, z = Math.max(0.18, 1 - c * (this.effect === "coverflow" ? 0.16 : 0.08)), w = this.coverflowSlideShadows ? Math.min(0.48, c * 0.16 * Math.max(0.25, u)) : 0, D = [
      `transform:translateX(${f}px) translateZ(${k}px) rotateY(${v}deg)`,
      `z-index:${100 - r}`,
      `opacity:${z}`,
      `filter:saturate(${Math.max(0.45, 1 - r * 0.14)})`,
      `--carousel-color:var(--${s}-color, ${s})`,
      `--carousel-shadow-opacity:${w}`,
      `--carousel-shadow-angle:${_ < 0 ? 270 : 90}deg`
    ].join(";"), U = e.icon_type === "entity-picture" ? l?.attributes.entity_picture : void 0, K = e.icon || l?.attributes.icon || "mdi:circle", Y = l ? !Or.has(l.state.toLowerCase()) : !1;
    return d`
      <button
        role="option"
        aria-selected=${i ? "true" : "false"}
        aria-label=${this.itemName(e, l)}
        class=${`${i ? "active" : ""} ${Y ? "entity-active" : ""}`}
        data-shadow=${this.effect === "coverflow" && this.coverflowSlideShadows ? "true" : "false"}
        data-carousel-index=${t}
        style=${D}
        ?hidden=${n}
        >
        ${U ? d`<span class="picture" style=${`background-image:url("${String(U)}")`}></span>` : d`<ha-icon .icon=${K}></ha-icon>`}
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
      const a = this.items.length / 2;
      t > a && (t -= this.items.length), t < -a && (t += this.items.length);
    }
    return t;
  }
  itemIsHidden(e, t) {
    if (!this.centeredSlides) return e < 0 || e >= t;
    const a = Math.floor((t - 1) / 2), o = Math.ceil((t - 1) / 2);
    return e < -a || e > o;
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
    const a = this.selectedIndex + e;
    this.selectedIndex = this.config?.carousel_loop === !1 ? Math.min(t - 1, Math.max(0, a)) : (a + t) % t;
  }
  selectIndex(e) {
    this.selectedIndex = Math.min(this.items.length - 1, Math.max(0, e));
  }
  constrainDrag(e) {
    if (this.config?.carousel_loop !== !1) return e;
    const t = this.selectedIndex === 0 && e > 0, a = this.selectedIndex === this.items.length - 1 && e < 0;
    return t || a ? e * 0.28 : e;
  }
  resetPointer() {
    this.dragStartX = void 0, this.dragStartY = void 0, this.lastPointerX = void 0, this.lastPointerTime = void 0, this.horizontalVelocity = 0, this.pointerAxis = "pending", this.pointerItemIndex = void 0, this.pointerStartedOnItem = !1, this.dragOffset = 0, this.dragging = !1;
  }
  clearHold() {
    this.holdTimer !== void 0 && window.clearTimeout(this.holdTimer), this.holdTimer = void 0;
  }
  runItemAction(e, t) {
    if (!e) return;
    const o = (t === "tap" ? e.tap_action : e.hold_action) ?? {
      action: t === "tap" && e.entity ? "more-info" : "none"
    };
    le(this, "hass-action", {
      config: {
        type: this.config?.type,
        entity: e.entity,
        tap_action: t === "tap" ? o : void 0,
        hold_action: t === "hold" ? o : void 0
      },
      action: t
    });
  }
};
he.styles = rt`
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
Ae([
  Ie({ attribute: !1 })
], he.prototype, "hass", 2);
Ae([
  Ie({ attribute: !1 })
], he.prototype, "config", 2);
Ae([
  me()
], he.prototype, "selectedIndex", 2);
Ae([
  me()
], he.prototype, "carouselWidth", 2);
Ae([
  me()
], he.prototype, "dragOffset", 2);
Ae([
  me()
], he.prototype, "dragging", 2);
he = Ae([
  xa("mushroom-addition-entity-carousel")
], he);
const M = (e, t) => e?.attributes[t], A = (e) => {
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, Ce = (e, t, a, o, r = "") => {
  if (e.config.icon_type === "none") return h;
  const n = e.config.icon_type === "entity-picture" ? M(e.entity, "entity_picture") : void 0;
  return n ? d`<span class="ulm-icon entity-picture ${r}" style=${`background-image:url("${String(n)}")`}></span>` : d`<span class="ulm-icon source-icon ${o ? "is-source-active" : ""} ${r}"
        style=${`--source-color:${a}`}>
        <ha-icon .icon=${e.config.icon || t}></ha-icon>
      </span>`;
}, De = (e, t) => {
  const a = b(e, t);
  return a ? e.hass.states[a] : void 0;
}, Tr = (e, t) => {
  if (e === void 0) return "mdi:battery-off";
  if (e <= 0 && !t) return "mdi:battery-alert-variant-outline";
  if (e >= 100) return "mdi:battery";
  if (e <= 0) return `mdi:battery${t}-outline`;
  const a = Math.max(10, Math.min(90, Math.round(e / 10) * 10));
  return `mdi:battery${t}-${a}`;
}, j = (e, t) => {
  const a = e.config[t];
  return typeof a == "string" ? e.hass.states[a] : void 0;
}, b = (e, ...t) => {
  for (const a of t)
    if (e.config[a] !== void 0) return e.config[a];
}, Ye = (e, t) => e.config.icon || e.entity?.attributes.icon || Et(e.descriptor, e.entity) || t, ee = (e, t, a = "blue", o = "") => {
  if (e.config.icon_type === "none") return h;
  const r = e.config.icon_type === "entity-picture" ? M(e.entity, "entity_picture") : void 0;
  return r ? d`<span class="ulm-icon entity-picture ${o}" style=${`background-image:url("${String(r)}")`}></span>` : d`<span class="ulm-icon tone-${a} ${o}"><ha-icon .icon=${Ye(e, t)}></ha-icon></span>`;
}, Nr = (e, t) => {
  switch (e.config.secondary_info) {
    case "none":
      return;
    case "name":
      return ne(e.config, e.entity, e.hass);
    case "state":
      return S(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    case "last-updated":
      return e.entity?.last_updated ? new Date(e.entity.last_updated).toLocaleString() : "Last updated unavailable";
    default:
      return e.config.secondary || t;
  }
}, Lr = (e, t) => {
  switch (e.config.primary_info) {
    case "none":
      return "";
    case "state":
      return S(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    case "last-updated":
      return e.entity?.last_updated ? new Date(e.entity.last_updated).toLocaleString() : "Last updated unavailable";
    default:
      return ne(e.config, e.entity, e.hass) || t || "";
  }
}, Fr = (e, t, a) => {
  e.presentation.rendered = !0;
  const o = ne(e.config, e.entity, e.hass), r = e.config.name !== void 0 && typeof e.config.name != "string";
  return {
    primary: (e.config.primary_info === void 0 ? r && o ? o : a ?? o : Lr(e, a)) || void 0,
    secondary: e.config.secondary_info === void 0 ? t : Nr(e, t)
  };
}, H = (e, t, a) => d`
  ${(() => {
  const o = Fr(e, t, a);
  return d`
  <span class="ulm-copy shared-presentation">
    ${o.primary ? d`<span class="ulm-name">${o.primary}</span>` : h}
    ${o.secondary ? d`<span class="ulm-label">${o.secondary}</span>` : h}
  </span>
    `;
})()}
`, ja = (e, t = S(e.entity)) => d`
  <span class="value-first">${H(e, ne(e.config, e.entity, e.hass), t)}</span>
`, dt = (e, t = S(e.entity), a = e.descriptor.name) => d`
  <div class="card-heading">
    ${ee(e, Et(e.descriptor, e.entity))}
    ${H(e, t, a)}
  </div>
`, Br = (e) => d`<div class="automatic-presentation">${dt(e)}</div>`, J = (e, t, a, o = !1) => d`
  <button class="ulm-control" aria-label=${e} ?disabled=${o}
    @pointerdown=${(r) => r.stopPropagation()} @click=${a}>
    <ha-icon .icon=${t}></ha-icon>
  </button>
`, Gr = (e, t, a, o, r = !1) => {
  let n, i = !1;
  const l = () => {
    n !== void 0 && window.clearTimeout(n), n = void 0;
  };
  return d`
    <button class="ulm-control hold-control" aria-label=${e} ?disabled=${r}
      @pointerdown=${(s) => {
    s.stopPropagation(), i = !1, n = window.setTimeout(() => {
      i = !0, o();
    }, 500);
  }}
      @pointerup=${(s) => {
    s.stopPropagation(), l();
  }}
      @pointercancel=${l}
      @click=${(s) => {
    s.stopPropagation(), i || a(), i = !1;
  }}>
      ${t}
    </button>
  `;
}, oe = (e, t, a, o = t.config.entity) => {
  e.stopPropagation(), le(e.currentTarget, "hass-action", {
    config: { type: t.config.type, entity: o, tap_action: a },
    action: "tap"
  });
}, jr = {
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
}, Hr = (e) => {
  const t = A(e.entity?.state) ?? 0, a = !!M(e.entity, "is_charging") || String(e.entity?.state).includes("charging"), o = b(e, "ulm_card_battery_battery_level_danger") ?? 20, r = b(e, "ulm_card_battery_battery_level_warning") ?? 50, n = t < o ? "red" : t < r ? "yellow" : "green", i = b(e, "ulm_card_battery_charging_animation") === !0 && a;
  return e.actionSurface(`ulm-battery ${i ? "is-charging" : ""}`, d`
    ${ee(e, a ? "mdi:battery-charging" : "mdi:battery", n)}
    ${H(e, a ? "Charging" : "Battery level")}
    <span class="battery-value">${Math.round(t)}<small>%</small></span>
    <span class="battery-track"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>
  `);
}, Wr = (e) => {
  const t = b(e, "ulm_card_battery_attribute"), a = t ? M(e.entity, t) : e.entity?.state, o = A(a), r = De(e, "ulm_card_battery_battery_state_entity_id"), n = De(e, "ulm_card_battery_charger_type_entity_id"), i = r?.state.toLowerCase() === "charging", l = n?.state.toLowerCase(), s = l === "wireless" ? "-charging-wireless" : i || ["charging", "ac", "usb"].includes(l ?? "") ? "-charging" : "", u = A(e.config.battery_warning_threshold) ?? b(e, "ulm_card_battery_battery_level_warning") ?? 50, m = A(e.config.battery_low_threshold) ?? b(e, "ulm_card_battery_battery_level_danger") ?? 20, g = A(e.config.battery_critical_threshold) ?? 10, [_, c, y] = [g, m, u].map((z) => Math.max(0, Math.min(100, z))).sort((z, w) => z - w), f = o === void 0 || o <= _ ? Z(
    e.config.battery_critical_color ?? b(e, "ulm_card_battery_color_battery_level_danger"),
    "var(--google-red, #f44336)"
  ) : o <= c ? Z(e.config.battery_low_color, "var(--google-orange, #ff9800)") : o <= y ? Z(
    e.config.battery_warning_color ?? b(e, "ulm_card_battery_color_battery_level_warning"),
    "var(--google-yellow, #fbc02d)"
  ) : Z(
    e.config.battery_healthy_color ?? b(e, "ulm_card_battery_color_battery_level_ok"),
    "var(--google-green, #43a047)"
  ), k = b(e, "ulm_card_battery_charging_animation") === !0 && i, v = o === void 0 ? S(e.entity) : `${Math.round(o)}%`;
  return e.actionSurface(`ulm-row ulm-default-battery ${k ? "is-charging" : ""}`, d`
    ${Ce(e, Tr(o, s), f, !0)}
    <span class="value-first">${H(e, ne(e.config, e.entity, e.hass), v)}</span>
  `);
}, Z = fr, Rr = (e) => {
  const t = A(e.entity?.state) ?? 0, a = A(b(e, "ulm_custom_card_bar_card_min")) ?? 0, r = (A(b(e, "ulm_custom_card_bar_card_max")) ?? 100) - a, n = r > 0 ? Math.max(0, Math.min(100, (t - a) / r * 100)) : 0, i = b(e, "ulm_custom_card_bar_card_show_icon") !== !1, l = b(e, "ulm_custom_card_bar_card_value") === !0, s = b(e, "ulm_custom_card_bar_card_indicator") === !0, u = Z(
    b(e, "ulm_custom_card_bar_card_color"),
    "var(--google-blue, #4285f4)"
  ), m = Z(
    b(e, "ulm_custom_card_bar_card_icon_color"),
    "var(--secondary-text-color)"
  ), g = b(e, "ulm_custom_card_bar_card_icon") || e.config.icon || e.entity?.attributes.icon || "mdi:chart-bar", _ = S(e.entity);
  return e.actionSurface(`bar-card ${i ? "has-header" : "bar-only"}`, d`
    ${i ? d`
      <div class="bar-card-header">
        <span class="bar-card-icon" style=${`--bar-icon-color:${m}`}>
          <ha-icon .icon=${g}></ha-icon>
        </span>
        <span class="bar-card-copy">${H(e, ne(e.config, e.entity, e.hass), _)}</span>
      </div>
    ` : h}
    <div class="bar-card-track" style=${`--bar-fill:${u};--bar-percentage:${n}%`}>
      <span class="bar-card-fill" style=${`width:${n}%`}></span>
      ${s ? d`<span class="bar-card-indicator" style=${`left:${n}%`}></span>` : h}
      ${l ? d`
        <b class="bar-card-inside-value">${_}</b>
        <b class="bar-card-inside-value bar-card-inside-value-filled" aria-hidden="true">${_}</b>
      ` : h}
    </div>
  `);
}, Ha = (e, t = !1, a = e.entity, o, r = o) => {
  const n = Array.isArray(M(a, "history")) ? M(a, "history").map(Number).filter(Number.isFinite).slice(-12) : [20, 28, 24, 42, 35, 52, 48, 63, 55, 70, 62, 78], i = Math.min(...n), l = Math.max(...n), s = n.map((g, _) => `${_ / Math.max(1, n.length - 1) * 100},${36 - (g - i) / Math.max(1, l - i) * 32}`).join(" "), u = `0,40 ${s} 100,40`, m = o ? `--sparkline-color:${o};--sparkline-fill-color:${r ?? o}` : "";
  return d`<svg class="sparkline ${t ? "is-filled" : ""}" style=${m} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
    ${t ? d`<polygon points=${u}></polygon>` : h}
    <polyline points=${s}></polyline>
  </svg>`;
}, Ur = (e) => e.actionSurface("ulm-metric", d`
  <div class="metric-heading">${ee(e, e.descriptor.family === "energy" ? "mdi:flash" : "mdi:chart-line", "blue")}${H(e, e.entity?.attributes.unit_of_measurement ? String(e.entity.attributes.unit_of_measurement) : "Current value")}<span class="metric-value">${S(e.entity)}</span></div>
  ${e.config.show_graph !== !1 ? Ha(e) : h}
  ${j(e, "min_entity") || j(e, "max_entity") ? d`<div class="metric-extremes"><span>Min ${S(j(e, "min_entity"))}</span><span>Max ${S(j(e, "max_entity"))}</span></div>` : h}
`), qr = (e, t, a) => {
  const o = a.navigation_path || a.nav_path;
  if (o) {
    oe(e, t, { action: "navigate", navigation_path: o }, a.entity);
    return;
  }
  const r = a.tap_action, n = r?.service ?? r?.perform_action;
  if ((r?.action === "call-service" || r?.action === "perform-action") && n) {
    const [s, u] = n.split(".", 2);
    if (s && u) {
      t.service(s, u, {
        entity_id: a.entity,
        ...r.service_data ?? r.data ?? {}
      });
      return;
    }
  }
  const [i, l] = a.entity.split(".", 2);
  i === "scene" ? t.service("scene", "turn_on", { entity_id: a.entity }) : i === "media_player" ? t.service("media_player", "media_play_pause", { entity_id: a.entity }) : i === "input_select" ? t.service("input_select", "select_option", {
    entity_id: a.entity,
    option: a.state,
    ...a.service_data ?? {}
  }) : i === "script" ? t.service("script", l || "turn_on", { entity_id: a.entity, ...a.service_data ?? {} }) : t.service("homeassistant", "toggle", { entity_id: a.entity, ...a.service_data ?? {} });
}, Kr = (e) => {
  const t = (e.config.scene_items?.length ? e.config.scene_items : (e.config.entities?.length ? e.config.entities : e.config.entity ? [e.config.entity] : []).map((w) => ({ entity: w }))).filter((w) => w.entity), a = e.descriptor.upstreamId === "card_welcome_scenes", o = e.config.scene_buttons_only === !0;
  o && (e.presentation.rendered = !0);
  const r = e.descriptor.upstreamId === "card_scenes" && e.config.variant === "scene-grid", n = a ? 7 : r ? 5 : 6, i = a && t.length > n, l = a && e.sceneOverflowExpanded ? t : t.slice(0, n), s = e.config.collapse_entity ? e.hass.states[e.config.collapse_entity] : void 0, u = !o && (e.config.collapsed === !0 || s?.state === "on"), g = j(e, "weather_entity")?.state || "partlycloudy", _ = jr[g]?.[0] ?? "mdi:weather-partly-cloudy", c = (/* @__PURE__ */ new Date()).getHours(), y = e.hass.language?.split("-")[0] ?? "en", f = {
    de: ["Hallo", "Guten Morgen", "Guten Tag", "Guten Abend"],
    en: ["Hello", "Good morning", "Good afternoon", "Good evening"],
    es: ["Hola", "Buenos días", "Buenas tardes", "Buenas noches"],
    fr: ["Bonjour", "Bonjour", "Bon après-midi", "Bonsoir"],
    nl: ["Hallo", "Goedemorgen", "Goedemiddag", "Goedenavond"]
  }, k = f[y] ?? f.en, z = `${c >= 18 ? k[3] : c >= 12 ? k[2] : c >= 5 ? k[1] : k[0]}, ${e.hass.user?.name || "Home"}!`;
  return e.actionSurface(`ulm-scenes ${a ? "welcome-scenes" : r ? "source-scene-grid" : "scene-pills"} ${e.descriptor.upstreamId === "card_scenes" ? "ulm-source-scenes" : ""} ${o ? "scene-buttons-only" : ""}`, d`
    ${a && !o ? d`
      <div class="welcome-toolbar">
        <button class="welcome-toolbar-button" aria-label="Toggle scenes" @pointerdown=${(w) => w.stopPropagation()} @click=${(w) => {
    w.stopPropagation(), e.config.collapse_entity && e.service("input_boolean", "toggle", { entity_id: e.config.collapse_entity });
  }}><ha-icon .icon=${u ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon></button>
        <span class="welcome-date"><ha-icon .icon=${_}></ha-icon>${new Intl.DateTimeFormat(e.hass.language, { month: "short", day: "numeric" }).format(/* @__PURE__ */ new Date())}</span>
        <button class="welcome-toolbar-button" aria-label="Open dashboard settings" @pointerdown=${(w) => w.stopPropagation()} @click=${(w) => oe(w, e, { action: "navigate", navigation_path: String(e.config.settings_path || "/config/dashboard") })}><ha-icon icon="mdi:cog-outline"></ha-icon></button>
      </div>
      <div class="welcome-heading">${H(e, z)}</div>
      ${u ? h : d`
        <div class="welcome-scenes-heading">
          <b>${e.config.secondary || "Scenes"}</b>
          ${i ? d`
            <button class="welcome-scenes-more"
              aria-label=${e.sceneOverflowExpanded ? "Show fewer scenes" : "Show all scenes"}
              aria-expanded=${e.sceneOverflowExpanded ? "true" : "false"}
              @pointerdown=${(w) => w.stopPropagation()}
              @click=${(w) => {
    w.stopPropagation(), e.toggleSceneOverflow();
  }}>
              <ha-icon .icon=${e.sceneOverflowExpanded ? "mdi:close" : "mdi:dots-vertical"}></ha-icon>
            </button>
          ` : h}
        </div>
      `}
    ` : h}
    ${u ? h : d`<div class="scene-grid">${l.map((w) => {
    const D = e.hass.states[w.entity], U = w.active_state ? D?.state === w.active_state : w.state ? D?.state === w.state : ce.has(D?.state ?? ""), K = Z(w.color, "rgb(var(--ulm-purple))"), Y = w.icon_type === "entity-picture" ? M(D, "entity_picture") : void 0;
    return d`
      <button @pointerdown=${(te) => te.stopPropagation()} @click=${(te) => {
      if (te.stopPropagation(), r && !w.tap_action) {
        const T = w.entity.split(".", 1)[0];
        e.service(
          T === "automation" ? "automation" : "homeassistant",
          T === "automation" ? "trigger" : "turn_on",
          { entity_id: w.entity }
        );
      } else
        qr(te, e, w);
    }} style=${`--item-color:${K}`} class="scene-button ${U ? "is-active" : ""}">
        <i>${Y ? d`<span class="scene-entity-picture" style=${`background-image:url("${String(Y)}")`}></span>` : d`<ha-icon .icon=${w.icon || D?.attributes.icon || "mdi:palette"}></ha-icon>`}</i>
        <span>${w.name || w.label || ne({ entity: w.entity }, D, e.hass)}</span>
      </button>`;
  })}</div>`}
  `);
}, ca = (e) => {
  const t = b(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : M(e.entity, "entity_picture"), a = "mdi:sony-playstation", o = b(e, "ulm_card_media_player_player_controls_entity") || e.config.entity, r = o ? e.hass.states[o] : e.entity, n = o?.startsWith("media_player.") === !0, i = b(e, "ulm_card_media_player_collapsible") === !0 && (["off", "standby"].includes(e.entity?.state ?? "") || b(e, "ulm_card_media_player_idle_off") === !0 && e.entity?.state === "idle"), l = !i && (e.config.show_controls === !0 || b(e, "ulm_card_media_player_enable_controls") === !0), s = b(e, "ulm_card_media_player_enable_volume_adjust") || (M(r, "device_class") === "speaker" ? 0.05 : M(r, "device_class") === "tv" ? 0.01 : 0.025), u = Number(M(r, "volume_level") ?? 0), m = { action: "more-info" }, g = ce.has(e.entity?.state ?? ""), _ = Z(
    b(e, "ulm_card_media_player_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface(`ulm-media ${t ? "has-art" : ""} ${i ? "is-collapsed" : ""}`, d`
    ${t ? d`<span class="media-art" style=${`background-image:url("${String(t)}")`}></span>` : h}
    <div class="media-summary">
      ${Ce(e, Ye(e, e.descriptor.upstreamId === "custom_card_playstation" ? a : "mdi:speaker"), _, g)}
      ${H(e, b(e, "ulm_card_media_player_more_info") === !0 ? [M(e.entity, "media_artist"), M(e.entity, "media_album_name")].filter(Boolean).join(" · ") || S(e.entity) : String(M(e.entity, "media_album_name") ?? M(e.entity, "media_artist") ?? S(e.entity)))}
    </div>
    ${b(e, "ulm_card_media_player_power_button") === !0 ? d`
      <div class="media-power">${J("Toggle power", "mdi:power", (c) => {
    c.stopPropagation(), e.service("homeassistant", "toggle", { entity_id: e.config.entity });
  })}</div>
    ` : h}
    ${n && l ? d`<div class="ulm-controls media-controls">
      ${J("Previous", "mdi:skip-previous", (c) => {
    c.stopPropagation(), e.service("media_player", "media_previous_track", { entity_id: o });
  })}
      ${J(e.entity?.state === "playing" ? "Pause" : "Play", e.entity?.state === "playing" ? "mdi:pause" : "mdi:play", (c) => {
    c.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: o });
  })}
      ${J("Next", "mdi:skip-next", (c) => {
    c.stopPropagation(), e.service("media_player", "media_next_track", { entity_id: o });
  })}
      ${J("Sources", "mdi:playlist-music", (c) => oe(c, e, m, o))}
    </div>` : h}
    ${n && !i && b(e, "ulm_card_media_player_enable_volume_slider") === !0 ? d`
      <input class="ulm-slider" type="range" min="0" max="100"
        aria-label="Volume"
        .value=${String(Math.round(u * 100))}
        @pointerdown=${(c) => c.stopPropagation()}
        @change=${(c) => e.service("media_player", "volume_set", {
    entity_id: o,
    volume_level: Number(c.target.value) / 100
  })}>
    ` : h}
    ${n && !i && b(e, "ulm_card_media_player_enable_volume_buttons") === !0 ? d`
      <div class="ulm-controls media-volume-buttons">
        ${J("Mute or unmute", "mdi:volume-mute", (c) => {
    c.stopPropagation(), e.service("media_player", "volume_mute", {
      entity_id: o,
      is_volume_muted: M(r, "is_volume_muted") !== !0
    });
  })}
        ${J("Volume down", "mdi:volume-minus", (c) => {
    c.stopPropagation(), e.service("media_player", "volume_set", {
      entity_id: o,
      volume_level: Math.max(0, u - s)
    });
  })}
        ${J("Volume up", "mdi:volume-plus", (c) => {
    c.stopPropagation(), e.service("media_player", "volume_set", {
      entity_id: o,
      volume_level: Math.min(1, u + s)
    });
  })}
      </div>
    ` : h}
  `);
}, Yr = (e) => {
  const t = e.entity?.state.startsWith("armed") || e.entity?.state === "locked";
  return e.actionSurface(`ulm-security ${t ? "is-armed" : ""}`, d`
    ${ee(e, t ? "mdi:shield-lock" : "mdi:shield-off", t ? "green" : "red")}
    ${H(e, S(e.entity))}
    ${e.config.show_controls ? d`<span class="security-status">${t ? "Secured" : "Attention"}</span>` : h}
  `);
}, Xr = (e) => e.actionSurface("ulm-navigation", d`
  ${ee(e, e.descriptor.upstreamId.includes("back") ? "mdi:arrow-left" : "mdi:arrow-right", "blue")}
  ${H(e, e.config.secondary || e.config.navigation_path || "Navigate")}
  <ha-icon icon="mdi:chevron-right"></ha-icon>
`), Jr = (e, t) => {
  const a = e?.split(".", 1)[0] ?? "homeassistant";
  return a === "script" ? ["script", t === "on" ? "turn_on" : "turn_off"] : a === "fan" ? ["fan", t === "on" ? "turn_on" : "turn_off"] : a === "water_heater" ? ["water_heater", t === "on" ? "turn_on" : "turn_off"] : [a === "input_boolean" ? "input_boolean" : "homeassistant", t === "on" ? "turn_on" : "turn_off"];
}, Zr = (e) => {
  const t = b(
    e,
    "ulm_custom_card_washer_power",
    "ulm_card_power_outlet_entity",
    "ulm_card_power_entity"
  ), a = e.config.entity?.split(".", 1)[0], o = t || (["switch", "input_boolean", "light", "fan", "script", "water_heater"].includes(a ?? "") ? e.config.entity : void 0), r = o ? e.hass.states[o] : void 0, n = ce.has(r?.state ?? e.entity?.state ?? ""), i = j(e, "graph_entity"), [l, s] = Jr(o, n ? "off" : "on");
  return e.actionSurface(`ulm-control-card ulm-row ${n ? "is-active" : ""}`, d`
    ${ee(e, e.config.entity?.startsWith("fan.") ? "mdi:fan" : "mdi:power-socket-eu", n ? "yellow" : "grey")}
    ${H(e, i ? `${S(e.entity)} · ${S(i)}` : S(e.entity))}
    ${o && e.config.show_controls !== !1 ? J(n ? "Turn off" : "Turn on", "mdi:power", (u) => {
    u.stopPropagation(), e.service(l, s, { entity_id: o });
  }) : h}
  `);
}, Ge = /* @__PURE__ */ new WeakMap(), Je = /* @__PURE__ */ new WeakSet(), da = (e, t, a, o) => {
  const r = o === "tap" ? a.tap_action ?? { action: "toggle" } : a.hold_action ?? { action: "more-info" };
  le(e, "hass-action", {
    config: { type: t.config.type, entity: a.entity, tap_action: r },
    action: "tap"
  });
}, Qr = (e) => {
  const t = (e.config.room_sensors?.length ? e.config.room_sensors : (e.config.entities ?? []).map((l) => ({ entity: l }))).filter((l) => l.entity).slice(0, 4), a = e.config.label_use_temperature ?? b(e, "label_use_temperature") ?? !0, o = e.config.label_use_brightness ?? b(e, "label_use_brightness") ?? !1, r = A(M(e.entity, "brightness")), n = M(e.entity, "current_temperature") ?? M(e.entity, "temperature") ?? M(e.entity, "device_temperature") ?? e.entity?.state ?? "—", i = a ? `${String(n)}${String(M(e.entity, "unit_of_measurement") ?? "°C")}` : o && e.entity?.state === "on" && r !== void 0 ? `${Math.round(r / 2.55)}%` : S(e.entity);
  return e.actionSurface(`ulm-room ulm-source-room ${e.entity?.state === "unavailable" ? "is-unavailable" : ""}`, d`
    <div class="room-main">
      <span class="room-copy">${H(e, i)}</span>
      <span class="ulm-icon tone-blue"><ha-icon .icon=${e.config.icon || "mdi:sofa-single"}></ha-icon></span>
      ${e.entity?.state === "unavailable" ? d`<span class="room-unavailable"><ha-icon icon="mdi:exclamation"></ha-icon></span>` : h}
    </div>
    ${t.length ? d`<div class="room-entities">${t.map((l) => {
    const s = e.hass.states[l.entity], u = s?.state === (l.active_state || "on"), m = Z(l.color, "rgb(var(--ulm-blue))"), g = l.icon_type === "entity-picture" ? M(s, "entity_picture") : void 0;
    return d`<button
        class="metric-pill room-sensor ${u ? "is-active" : ""}"
        style=${`--item-color:${m}`}
        aria-label=${l.name || l.label || ne({ entity: l.entity }, s, e.hass)}
        @pointerdown=${(_) => {
      _.stopPropagation();
      const c = _.currentTarget;
      Je.delete(c), Ge.set(c, window.setTimeout(() => {
        Je.add(c), da(c, e, l, "hold");
      }, 500));
    }}
        @pointerup=${(_) => {
      _.stopPropagation();
      const c = _.currentTarget, y = Ge.get(c);
      y && window.clearTimeout(y), Ge.delete(c);
    }}
        @pointercancel=${(_) => {
      const c = _.currentTarget, y = Ge.get(c);
      y && window.clearTimeout(y), Ge.delete(c);
    }}
        @click=${(_) => {
      const c = _.currentTarget;
      if (Je.has(c)) {
        Je.delete(c), _.stopPropagation();
        return;
      }
      _.stopPropagation(), da(c, e, l, "tap");
    }}
      >${g ? d`<span class="room-sensor-picture" style=${`background-image:url("${String(g)}")`}></span>` : d`<ha-icon .icon=${l.icon || s?.attributes.icon || "mdi:circle-small"}></ha-icon>`}<span>${l.name || l.label || S(s)}</span></button>`;
  })}</div>` : h}
  `);
}, Dt = (e) => {
  const t = Object.entries(e.config).filter(([a, o]) => typeof o == "string" && o !== e.config.entity && /(_entity|_entity_id|_sensor|_power|_status|_level|_date|_time)$/i.test(a)).map(([, a]) => a);
  return [.../* @__PURE__ */ new Set([...e.config.entities ?? [], ...t])].map((a) => e.hass.states[a]).filter((a) => !!a).slice(0, 6);
}, en = (e, t, a = "blue") => {
  const o = Dt(e);
  return e.actionSurface("ulm-detail-card", d`
    <div class="ulm-row">
      ${ee(e, t, a)}
      ${H(e, S(e.entity))}
    </div>
    ${o.length ? d`<div class="detail-grid">${o.map((r) => d`
      <span class="metric-pill"><ha-icon .icon=${r.attributes.icon ?? "mdi:circle-small"}></ha-icon>${S(r)}</span>
    `)}</div>` : h}
  `);
}, tn = (e) => {
  const t = Dt(e);
  return e.actionSurface("ulm-schedule-card", d`
    <div class="ulm-row">
      ${ee(e, /pollen/.test(e.descriptor.upstreamId) ? "mdi:flower-pollen" : "mdi:trash-can", "green")}
      ${H(e, S(e.entity))}
    </div>
    <div class="schedule-list">${(t.length ? t : e.entity ? [e.entity] : []).slice(0, 4).map((a) => d`
      <span><b>${ne({ entity: a.entity_id }, a, e.hass)}</b><small>${S(a)}</small></span>
    `)}</div>
  `);
}, an = (e) => {
  const t = A(e.entity?.state), a = Dt(e);
  return e.actionSurface("ulm-device-status", d`
    <div class="ulm-row">
      ${ee(e, /printer/.test(e.descriptor.upstreamId) ? "mdi:printer" : /nas/.test(e.descriptor.upstreamId) ? "mdi:nas" : /washer/.test(e.descriptor.upstreamId) ? "mdi:washing-machine" : "mdi:devices", t !== void 0 && t < 20 ? "red" : "blue")}
      ${H(e, S(e.entity))}
      ${t !== void 0 ? d`<b class="device-value">${Math.round(t)}${String(e.entity?.attributes.unit_of_measurement ?? "")}</b>` : h}
    </div>
    ${t !== void 0 ? d`<span class="device-progress"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>` : h}
    ${a.length ? d`<div class="detail-grid">${a.map((o) => d`<span class="metric-pill">${S(o)}</span>`)}</div>` : h}
  `);
}, on = (e) => {
  const t = A(e.entity?.state) ?? 0, a = b(e, "ulm_card_gauge_min", "ulm_custom_card_gauge_min") ?? 0, o = b(e, "ulm_card_gauge_max", "ulm_custom_card_gauge_max") ?? 100, r = Math.max(0, Math.min(100, (t - a) / Math.max(1, o - a) * 100));
  return e.actionSurface("ulm-gauge-card", d`
    <span class="gauge-ring" style=${`--gauge:${r * 3.6}deg`}><b>${S(e.entity)}</b></span>
    ${H(e, `${a} – ${o}`)}
  `);
}, rn = (e) => {
  const t = j(e, "datetime_entity");
  return e.actionSurface(`ulm-control-card ulm-row ${ce.has(e.entity?.state ?? "") ? "is-active" : ""}`, d`
    ${ee(e, "mdi:alarm", ce.has(e.entity?.state ?? "") ? "yellow" : "grey")}
    ${H(e, S(t || e.entity))}
    ${e.config.show_controls !== !1 ? J(ce.has(e.entity?.state ?? "") ? "Disable alarm" : "Enable alarm", "mdi:power", (a) => {
    a.stopPropagation(), e.service("input_boolean", ce.has(e.entity?.state ?? "") ? "turn_off" : "turn_on", { entity_id: e.config.entity });
  }) : h}
  `);
}, B = (e, ...t) => {
  const a = b(e, ...t), o = typeof a == "string" ? a : a && typeof a == "object" && "entity_id" in a && typeof a.entity_id == "string" ? a.entity_id : void 0;
  return o ? e.hass.states[o] : void 0;
}, nn = (e) => {
  const t = xe(e.config).filter((l) => l.enabled !== !1 && l.entity), a = /* @__PURE__ */ new Set([
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
  ]), o = (l, s) => {
    if (s !== !0 || !l) return;
    const u = e.hass.states[l]?.state?.trim();
    if (!u || a.has(u.toLowerCase())) return;
    const m = u.replaceAll("_", " ").replace(/\s+/g, " ");
    return m.charAt(0).toLocaleUpperCase(e.hass.language) + m.slice(1);
  }, r = o(e.config.today_entity, e.config.show_today), n = o(e.config.tomorrow_entity, e.config.show_tomorrow), i = (l) => {
    if (!l || ["unknown", "unavailable", "none", "geen"].includes(l.state.toLowerCase())) return "—";
    if (l.entity_id.startsWith("calendar.")) {
      const s = M(l, "start_time") ?? M(l, "start") ?? M(l, "end_time");
      if (typeof s == "string") {
        const u = new Date(s);
        if (!Number.isNaN(u.getTime()))
          return new Intl.DateTimeFormat(e.hass.language, { day: "2-digit", month: "2-digit", year: "numeric" }).format(u);
      }
    }
    return l.state;
  };
  return e.actionSurface("custom-waste-card", d`
    <div class="custom-card-heading">
      ${ee(e, "mdi:trash-can-outline", "green")}
      ${H(e, b(e, "ulm_volgende_ophaling") || [r ? `Today: ${r}` : "", n ? `Tomorrow: ${n}` : ""].filter(Boolean).join(" · ") || void 0, "Next collections")}
    </div>
    <div class="waste-grid">${t.map((l) => {
    const s = l.entity ? e.hass.states[l.entity] : void 0;
    return d`<span class="waste-row" style=${`--waste-color:${Z(l.color, "rgb(var(--rgb-green, 76, 175, 80))")}`}>
        <ha-icon .icon=${l.icon || "mdi:trash-can"}></ha-icon>
        <b>${l.label || s?.attributes.friendly_name || l.entity}</b>
        <small>${i(s)}</small>
      </span>`;
  })}</div>
  `);
}, sn = (e) => {
  const t = B(e, "ulm_card_alarm_time_datetime") ?? j(e, "datetime_entity"), a = A(b(e, "ulm_card_alarm_time_step")) ?? 15, o = t?.state || "00:00:00", [r, n] = o.split(":").map(Number), i = (g) => {
    const _ = ((r || 0) * 60 + (n || 0) + g + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: t?.entity_id,
      time: `${String(Math.floor(_ / 60)).padStart(2, "0")}:${String(_ % 60).padStart(2, "0")}:00`
    });
  }, l = !t || ["unknown", "unavailable"].includes(t.state.toLowerCase()), s = b(e, "ulm_card_alarm_time_collapse") === !0 && !ce.has(e.entity?.state ?? ""), u = ce.has(e.entity?.state ?? ""), m = Z(
    b(e, "ulm_card_alarm_time_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface(`custom-alarm-time ${b(e, "ulm_card_alarm_time_horizontal") ? "is-horizontal" : ""}`, d`
    <div class="custom-card-heading">
      ${Ce(e, b(e, "ulm_card_alarm_time_icon") || "mdi:alarm", m, u)}
      ${H(e, S(e.entity))}
    </div>
    ${s ? h : d`<div class="alarm-time-controls">
      ${J(`Earlier by ${a} minutes`, "mdi:minus", (g) => {
    g.stopPropagation(), i(-a);
  }, l)}
      <b>${o.slice(0, 5)}</b>
      ${J(`Later by ${a} minutes`, "mdi:plus", (g) => {
    g.stopPropagation(), i(a);
  }, l)}
    </div>`}
  `);
}, mt = (e, t) => {
  const a = M(t, "entity_id");
  return Array.isArray(a) ? a.map(String).map((o) => e.hass.states[o]).filter((o) => !!o) : t ? [t] : [];
}, ln = (e) => {
  const t = (_) => B(e, _), a = t("temperature"), o = t("humidity"), r = {
    doors: t("group_doors"),
    windows: t("group_windows"),
    motions: t("group_motions"),
    water: t("group_water"),
    lights: t("group_lights"),
    shutters: t("group_windows_shutters"),
    outlets: t("group_outlets"),
    tv: t("group_tv")
  }, n = Object.values(r).flatMap((_) => mt(e, _)).filter((_) => (A(M(_, "battery")) ?? 101) <= 20), i = Object.values(r).flatMap((_) => mt(e, _)).filter((_) => _.state === "unavailable"), l = (_) => mt(e, _).filter((c) => c.state === "on" || c.state === "open").length, s = (_, c) => {
    c && oe(_, e, { action: "more-info" }, c.entity_id);
  }, u = (_, c) => {
    c && c.state !== "unavailable" && oe(_, e, { action: "toggle" }, c.entity_id);
  }, m = [
    [r.doors, "mdi:door-open"],
    [r.windows, "mdi:window-open-variant"],
    [r.motions, "mdi:motion-sensor"],
    [r.water, "mdi:water"]
  ], g = [
    [r.lights, r.lights?.state === "on" ? "mdi:lightbulb-group" : "mdi:lightbulb-group-off"],
    [r.shutters, r.shutters?.state === "on" ? "mdi:window-shutter-open" : "mdi:window-shutter"],
    [r.outlets, r.outlets?.state === "on" ? "mdi:power-plug" : "mdi:power-plug-off"],
    [r.tv, r.tv?.state === "on" ? "mdi:television" : "mdi:television-off"]
  ];
  return e.actionSurface("custom-room-view", d`
    <div class="room-view-summary" @click=${(_) => s(_, a ?? o)}>
      <span class="room-view-icon"><ha-icon .icon=${e.config.icon || "mdi:home-variant-outline"}></ha-icon>${i.length ? d`<i>${i.length}</i>` : h}</span>
      <span><b><ha-icon icon="mdi:thermometer"></ha-icon>${S(a)}</b><small><ha-icon icon="mdi:water-percent"></ha-icon>${S(o)}</small></span>
    </div>
    <div class="room-view-status">
      ${m.map(([_, c]) => _ && l(_) ? d`<button aria-label=${ne({ entity: _.entity_id }, _, e.hass)} @pointerdown=${(y) => y.stopPropagation()} @click=${(y) => s(y, _)}><ha-icon .icon=${c}></ha-icon>${l(_) > 1 ? d`<i>${l(_)}</i>` : h}</button>` : h)}
      ${n.length ? d`<button aria-label="Low batteries" @pointerdown=${(_) => _.stopPropagation()} @click=${(_) => s(_, n[0])}><ha-icon icon="mdi:battery-20"></ha-icon><i>${n.length}</i></button>` : h}
      ${!m.some(([_]) => l(_)) && !n.length ? d`<span class="room-view-clear"><ha-icon icon="mdi:check"></ha-icon></span>` : h}
    </div>
    <div class="room-view-actions">
      ${g.map(([_, c]) => _ ? d`
        <button class=${_.state === "on" ? "is-active" : ""} aria-label=${ne({ entity: _.entity_id }, _, e.hass)}
          ?disabled=${_.state === "unavailable"} @pointerdown=${(y) => y.stopPropagation()}
          @dblclick=${(y) => u(y, _)} @click=${(y) => y.stopPropagation()}>
          <ha-icon .icon=${_.state === "unavailable" ? "mdi:exclamation-thick" : c}></ha-icon>
          ${l(_) ? d`<i>${l(_)}</i>` : h}
        </button>` : h)}
    </div>
  `);
}, cn = (e) => {
  const t = B(e, "ulm_card_welcome_collapse"), a = B(e, "ulm_weather"), o = t?.state === "on", r = Array.from({ length: 5 }, (n, i) => i + 1).map((n) => ({
    nav: b(e, `nav_${n}`),
    icon: b(e, `icon_${n}`) || "mdi:circle",
    name: b(e, `name_${n}`) || `Item ${n}`,
    color: b(e, `color_${n}`) || "blue"
  })).filter((n) => n.nav);
  return e.actionSurface("custom-welcome", d`
    <div class="welcome-toolbar">
      <button aria-label="Toggle welcome navigation" ?disabled=${!t}
        @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => {
    n.stopPropagation(), t && e.service("input_boolean", "toggle", { entity_id: t.entity_id });
  }}>
        <ha-icon .icon=${o ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
      </button>
      <button aria-label="Weather information" ?disabled=${!a}
        @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => {
    a && oe(n, e, { action: "more-info" }, a.entity_id);
  }}>
        <ha-icon icon="mdi:thermometer"></ha-icon>
      </button>
      <button aria-label="Dashboard settings" @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => oe(n, e, { action: "navigate", navigation_path: "/config/dashboard" })}>
        <ha-icon icon="mdi:cog-outline"></ha-icon>
      </button>
    </div>
    <div class="welcome-greeting">${H(e, `Good ${(/* @__PURE__ */ new Date()).getHours() < 12 ? "morning" : (/* @__PURE__ */ new Date()).getHours() < 18 ? "afternoon" : "evening"}`)}</div>
    ${o ? h : d`<div class="welcome-items">${r.map((n) => d`
      <button class="tone-${n.color}" aria-label=${n.name}
        @pointerdown=${(i) => i.stopPropagation()}
        @click=${(i) => oe(i, e, { action: "navigate", navigation_path: n.nav })}>
        <i><ha-icon .icon=${n.icon}></ha-icon></i><small>${n.name}</small>
      </button>
    `)}</div>`}
  `);
}, dn = (e) => {
  const t = B(e, "ulm_custom_card_room_overview_light_entity"), a = B(e, "ulm_custom_card_room_overview_climate_entity"), o = B(e, "ulm_custom_card_room_overview_cover_entity"), r = t?.state === "on", n = A(M(t, "brightness")), i = e.config.secondary || (t ? r && n ? `${Math.round(n / 2.55)}%` : S(t) : S(e.entity)), l = M(t, "rgb_color"), s = b(e, "ulm_card_dynamic_color") === !0 && r && Array.isArray(l), u = (g, _) => {
    _ && oe(g, e, { action: "toggle" }, _.entity_id);
  }, m = (g, _) => {
    const c = _ === "light" ? b(e, r ? "ulm_card_room_overview_light_icon_on" : "ulm_card_room_overview_light_icon_off") || (r ? "mdi:lightbulb" : "mdi:lightbulb-off") : _ === "cover" ? b(e, g.state === "closed" ? "ulm_card_room_overview_cover_icon_closed" : "ulm_card_room_overview_cover_icon_open") || (g.state === "closed" ? "mdi:roller-shade-closed" : "mdi:blinds-open") : { auto: "mdi:autorenew", cool: "mdi:snowflake", heat: "mdi:fire", dry: "mdi:water", heat_cool: "mdi:sun-snowflake", fan_only: "mdi:fan", off: "mdi:snowflake-off" }[g.state] ?? "mdi:thermostat";
    return d`<button class="room-overview-control ${_} state-${g.state}" aria-label=${ne({ entity: g.entity_id }, g, e.hass)}
      ?disabled=${g.state === "unavailable"} @pointerdown=${(y) => y.stopPropagation()} @click=${(y) => u(y, g)}>
      <ha-icon .icon=${c}></ha-icon>
    </button>`;
  };
  return e.actionSurface(`custom-room-overview ${r ? "light-on" : ""} ${s ? "dynamic-color" : ""}`, d`
    <div class="room-overview-main" style=${s ? `--room-rgb:${l.slice(0, 3).join(",")};` : ""}>
      ${ee(e, "mdi:sofa", r ? "yellow" : "grey")}
      ${H(e, i)}
    </div>
    <div class="room-overview-controls">
      ${t ? m(t, "light") : h}
      ${o ? m(o, "cover") : a ? m(a, "climate") : h}
    </div>
  `);
}, un = (e) => {
  const t = B(e, "washer_power_entity") ?? B(e, "power_entity") ?? B(e, "ulm_custom_card_washer_power"), a = B(e, "ulm_custom_card_washer_machine_state") ?? e.entity, o = B(e, "ulm_custom_card_washer_job_progress"), r = B(e, "program_stage_entity") ?? B(e, "ulm_custom_card_washer_job_state") ?? a, n = B(e, "ulm_custom_card_washer_remote_control"), i = B(e, "ulm_custom_card_washer_delayed_start"), l = B(e, "ulm_custom_card_washer_delayed_starttime"), s = B(e, "door_entity"), u = B(e, "finished_entity"), m = b(e, "ulm_custom_card_washer_machine_stop_state") ?? "stop", g = t ? !["off", "unavailable", "unknown", "0"].includes(t.state.toLowerCase()) : a ? !["off", "unavailable", "unknown"].includes(a.state.toLowerCase()) : !0, _ = !a || a.state === m || a.state === "off", c = ["true", "on", "enabled"].includes(n?.state.toLowerCase() ?? ""), y = i?.state === "on", f = Math.max(0, Math.min(100, A(o?.state) ?? 0)), k = b(
    e,
    "ulm_custom_card_washer_job_states"
  ), v = Object.values(k ?? {
    state1: { name: "weightSensing", icon: "mdi:scale" },
    state2: { name: "wash", icon: "mdi:waves" },
    state3: { name: "rinse", icon: "mdi:water" },
    state4: { name: "spin", icon: "mdi:fan" }
  }).filter((V) => V.name && V.icon).slice(0, 5), z = v.findIndex((V) => V.name?.toLowerCase() === r?.state.toLowerCase()), w = g ? _ ? c && y ? b(e, "ulm_custom_card_washer_label_configuring") ?? "configure" : b(e, "ulm_custom_card_washer_label_idle") ?? "idle" : b(e, "ulm_custom_card_washer_label_running") ?? "run" : b(e, "ulm_custom_card_washer_label_idle") ?? "idle", D = (V) => b(e, V) ?? { action: "none" }, U = (V, Q) => oe(V, e, Q, typeof Q.entity == "string" ? Q.entity : e.config.entity), K = l?.state.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)?.slice(1).map(Number), Y = (V, Q) => {
    if (V.stopPropagation(), !l || !K) return;
    const R = ((K[0] * 60 + K[1] + Q) % 1440 + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: l.entity_id,
      time: `${String(Math.floor(R / 60)).padStart(2, "0")}:${String(R % 60).padStart(2, "0")}:00`
    });
  }, te = D(_ ? "ulm_custom_card_washer_start_action" : "ulm_custom_card_washer_pause_action"), T = D("ulm_custom_card_washer_stop_action");
  return e.actionSurface("custom-washer", d`
    <div class="custom-card-heading washer-heading">
      ${ee(e, "mdi:washing-machine", g ? "blue" : "grey")}
      ${H(e, w)}
      ${t ? d`<b class="washer-power">${S(t)}</b>` : h}
    </div>
    ${g && v.length ? d`
      <div class="washer-stages" style=${`--washer-stage-count:${v.length}`}>
        ${v.map((V, Q) => d`
          <span class=${z === Q ? "is-active" : ""} title=${V.name ?? ""}>
            <ha-icon .icon=${V.icon}></ha-icon>
          </span>
        `)}
      </div>
    ` : h}
    ${g && o ? d`
      <div class="washer-progress">
        <span style=${`width:${f}%`}></span>
        <b>${Math.round(f)}%</b>
      </div>
    ` : h}
    ${g && c ? d`
      <div class="washer-controls">
        ${J(
    _ ? "Start washer" : "Pause washer",
    _ ? "mdi:play" : "mdi:pause",
    (V) => U(V, te),
    te.action === "none"
  )}
        ${J(
    "Stop washer",
    "mdi:stop",
    (V) => U(V, T),
    _ || T.action === "none"
  )}
        ${i ? J(
    y ? "Disable delayed start" : "Enable delayed start",
    "mdi:alarm",
    (V) => oe(V, e, { action: "toggle" }, i.entity_id),
    !_
  ) : h}
      </div>
    ` : h}
    ${g && c && y && l ? d`
      <div class="washer-delay-controls">
        ${J("Move delayed start 15 minutes earlier", "mdi:arrow-down", (V) => Y(V, -15))}
        <button class="washer-delay-time" aria-label="Move delayed start 1 minute later"
          @pointerdown=${(V) => V.stopPropagation()}
          @click=${(V) => Y(V, 1)}>${l.state}</button>
        ${J("Move delayed start 15 minutes later", "mdi:arrow-up", (V) => Y(V, 15))}
      </div>
    ` : h}
    ${s || u || n ? d`
      <div class="washer-status">
        ${s ? d`<span><ha-icon icon="mdi:door"></ha-icon>${S(s)}</span>` : h}
        ${u ? d`<span><ha-icon icon="mdi:check-circle"></ha-icon>${S(u)}</span>` : h}
        ${n ? d`<span><ha-icon icon="mdi:remote"></ha-icon>${S(n)}</span>` : h}
      </div>
    ` : h}
  `);
}, pe = (e, t, a) => De(e, t) ?? Object.values(e.hass.states).find((o) => String(M(o, "metric") ?? "").toLowerCase() === a && ["moon", "sky"].includes(String(M(o, "body") ?? "").toLowerCase())), ua = (e, t, a) => {
  const o = e === void 0 ? 180 : (e % 360 + 360) % 360, r = Math.max(-90, Math.min(90, t ?? 0)), n = o / 360 * 100, i = 62 / 90 * 100, l = r >= 0 ? i - r / 90 * (i - 4) : i + Math.abs(r) / 90 * (96 - i);
  return `--${a}-x:${n.toFixed(2)}%;--${a}-y:${l.toFixed(2)}%`;
}, _a = (e) => ({
  new_moon: "mdi:moon-new",
  waxing_crescent: "mdi:moon-waxing-crescent",
  first_quarter: "mdi:moon-first-quarter",
  waxing_gibbous: "mdi:moon-waxing-gibbous",
  full_moon: "mdi:moon-full",
  waning_gibbous: "mdi:moon-waning-gibbous",
  last_quarter: "mdi:moon-last-quarter",
  waning_crescent: "mdi:moon-waning-crescent"
})[e] ?? "mdi:moon-waning-crescent", _n = (e) => {
  const t = M(e.entity, "next_rising"), a = M(e.entity, "next_setting"), o = M(e.entity, "next_dawn") ?? t, r = M(e.entity, "next_noon"), n = M(e.entity, "next_dusk") ?? a, i = b(e, "language") || e.hass.language || "en", l = b(e, "timeFormat") === "12h", s = (R) => {
    const ae = new Date(String(R ?? ""));
    return Number.isNaN(ae.getTime()) ? "—" : new Intl.DateTimeFormat(i, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: l
    }).format(ae);
  }, u = A(M(e.entity, "elevation")), m = A(M(e.entity, "azimuth")), g = b(e, "title"), _ = De(e, "moon_entity") ?? e.hass.states["sensor.moon"] ?? Object.values(e.hass.states).find((R) => String(M(R, "device_class") ?? "") === "enum" && `${R.entity_id} ${String(M(R, "friendly_name") ?? "")}`.toLowerCase().includes("moon")), c = pe(e, "moon_altitude_entity", "altitude"), y = pe(e, "moon_azimuth_entity", "azimuth"), f = De(e, "moon_rising_entity") ?? pe(e, "moon_rising_entity", "next_rising") ?? pe(e, "moon_rising_entity", "moonrise"), k = De(e, "moon_setting_entity") ?? pe(e, "moon_setting_entity", "next_setting") ?? pe(e, "moon_setting_entity", "moonset"), v = pe(e, "moon_next_full_moon_entity", "next_full_moon"), z = pe(e, "moon_next_new_moon_entity", "next_new_moon"), w = pe(e, "moon_above_horizon_entity", "is_moon_above_horizon"), D = [
    _,
    c,
    y,
    f,
    k,
    v,
    z,
    w
  ], U = b(e, "showMoon") !== !1 && D.some(Boolean), K = (R, ae = 2) => {
    if (!R || ["unknown", "unavailable"].includes(R.state)) return "—";
    const ie = A(R.state);
    if (ie === void 0) return S(R);
    const se = String(M(R, "unit_of_measurement") ?? "");
    return `${new Intl.NumberFormat(i, { maximumFractionDigits: ae }).format(ie)}${se ? ` ${se}` : ""}`;
  }, Y = (R) => {
    if (!R || ["unknown", "unavailable"].includes(R.state)) return "—";
    const ae = new Date(R.state);
    return Number.isNaN(ae.getTime()) ? S(R) : new Intl.DateTimeFormat(i, { day: "numeric", month: "short", year: "numeric" }).format(ae);
  }, te = _?.state ?? "unknown", T = A(c?.state), V = A(y?.state), Q = w ? ["on", "true", "above_horizon"].includes(w.state.toLowerCase()) : (T ?? -1) >= 0;
  return e.actionSurface(`custom-sun-card ${b(e, "darkMode") ? "is-dark" : ""}`, d`
    ${g ? d`<b class="sun-title">${g}</b>` : h}
    <div class="astronomy-times">
      <span><small>Sunrise</small><b>${s(t)}</b></span>
      <span><small>Moonrise</small><b>${s(f?.state)}</b></span>
      <span><small>Moonset</small><b>${s(k?.state)}</b></span>
      <span><small>Sunset</small><b>${s(a)}</b></span>
    </div>
    <div class="sun-arc astronomy-arc">
      <svg viewBox="0 0 300 90" preserveAspectRatio="none"><path class="sun-night" d="M0,62 Q60,115 105,62"></path><path class="sun-day" d="M0,62 Q150,-45 300,62"></path><line x1="0" y1="62" x2="300" y2="62"></line></svg>
      <span class="sun-marker" style=${ua(m, u, "sun")}></span>
      ${U && (c || y) ? d`
        <span class=${`moon-marker astronomy-moon-marker ${Q ? "is-above" : "is-below"}`}
          style=${ua(V, T, "moon")}>
          <ha-icon .icon=${_a(te)}></ha-icon>
        </span>
      ` : h}
    </div>
    <div class="sun-footer"><span><small>Dawn</small><b>${s(o)}</b></span><span><small>Solar noon</small><b>${s(r)}</b></span><span><small>Dusk</small><b>${s(n)}</b></span></div>
    <div class="astronomy-position-rows">
      <div>
        <b>Sun:</b>
        <span>Azimuth <strong>${m ?? "—"}°</strong></span>
        <span>Elevation <strong>${u ?? "—"}°</strong></span>
      </div>
      ${U ? d`
        <div>
          <b>Moon:</b>
          <span>Azimuth <strong>${K(y)}</strong></span>
          <span>Elevation <strong>${K(c)}</strong></span>
        </div>
      ` : h}
    </div>
    ${U ? d`
      <section class="moon-section">
        <div class="moon-heading">
          <span class="moon-symbol"><ha-icon .icon=${_a(te)}></ha-icon></span>
          <span class="moon-copy">
            <b>Moon</b>
            <small>${S(_)} · ${Q ? "Above horizon" : "Below horizon"}</small>
          </span>
        </div>
        <div class="moon-metrics">
          ${v ? d`<span class="moon-metric"><ha-icon .icon=${"mdi:moon-full"}></ha-icon><span><small>Next full Moon</small><b>${Y(v)}</b></span></span>` : h}
          ${z ? d`<span class="moon-metric"><ha-icon .icon=${"mdi:moon-new"}></ha-icon><span><small>Next new Moon</small><b>${Y(z)}</b></span></span>` : h}
        </div>
      </section>
    ` : h}
  `);
}, mn = (e) => {
  const t = !!(e.entity && !["unavailable", "unknown"].includes(e.entity.state)), o = (t ? e.entity.state : "00:00:00").split(" ").at(-1) || "00:00:00", [r, n] = o.split(":").map(Number), i = (l) => {
    const s = ((r || 0) * 60 + (n || 0) + l + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: e.config.entity,
      time: `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:00`
    });
  };
  return e.actionSurface("custom-input-datetime", d`
    <div class="custom-card-heading">${ee(e, "mdi:calendar-clock", "green")}${H(e, S(e.entity))}</div>
    <div class="input-datetime-controls">
      ${J("15 minutes earlier", "mdi:arrow-down", (l) => {
    l.stopPropagation(), i(-15);
  }, !t)}
      ${Gr(
    "One minute later; hold for one minute earlier",
    d`<b>${t ? o.slice(0, 5) : "Unavailable"}</b>`,
    () => i(1),
    () => i(-1),
    !t
  )}
      ${J("15 minutes later", "mdi:arrow-up", (l) => {
    l.stopPropagation(), i(15);
  }, !t)}
    </div>
  `);
}, pn = (e) => {
  const t = [1, 2, 3, 4].map((a) => B(e, `ulm_custom_card_entity_overview_entity_${a}`) ?? (e.config.entities?.[a - 1] ? e.hass.states[e.config.entities[a - 1]] : void 0));
  return e.actionSurface("custom-entity-overview", d`
    <div class="metrics-panel">
      <span class="metrics-main-name"><ha-icon .icon=${b(e, "ulm_custom_card_entity_overview_icon") || "mdi:alien"}></ha-icon>${H(e, S(e.entity))}</span>
      <b>${S(e.entity)}</b>
    </div>
    <div class="metrics-four">${t.map((a, o) => d`
      <button ?disabled=${!a} @pointerdown=${(r) => r.stopPropagation()}
        @click=${(r) => a && oe(r, e, { action: "more-info" }, a.entity_id)}>
        <b>${S(a)}</b>
        <small>${b(e, `ulm_custom_card_entity_overview_name_${o + 1}`) || (a ? ne({ entity: a.entity_id }, a, e.hass) : `Entity ${o + 1}`)}</small>
      </button>
    `)}</div>
  `);
}, hn = (e) => {
  const t = j(e, "download_entity") ?? B(e, "ulm_custom_card_internet_speed_download_speed_entity") ?? e.entity, a = j(e, "upload_entity") ?? B(e, "ulm_custom_card_internet_speed_upload_speed_entity"), o = j(e, "ping_entity") ?? B(e, "ulm_custom_card_internet_speed_ping_entity"), r = [t, a, o].filter((i) => !!i), n = Z(
    b(e, "ulm_custom_card_internet_speed_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface("custom-internet-speed", d`
    <div class="card-heading speedtest-router">
      ${Ce(e, "mdi:wifi", n, !0)}
      ${H(e, b(e, "ulm_custom_card_internet_speed_router_model") || "router_model")}
    </div>
    <button class="speedtest-action" ?disabled=${r.length !== 3}
      @pointerdown=${(i) => i.stopPropagation()} @click=${(i) => {
    i.stopPropagation(), e.service("homeassistant", "update_entity", { entity_id: r.map((l) => l.entity_id) });
  }}>
      <ha-icon icon="mdi:speedometer"></ha-icon>
      <span>${b(e, "ulm_custom_card_internet_speed_speedtest") || "Internet speed test"}</span>
      <ha-icon icon="mdi:chevron-right"></ha-icon>
    </button>
    <div class="speedtest-metrics">
      ${[
    [b(e, "ulm_custom_card_internet_speed_download") || "Download speed", t],
    [b(e, "ulm_custom_card_internet_speed_upload") || "Upload speed", a]
  ].map(([i, l]) => d`
        <button ?disabled=${!l} @pointerdown=${(s) => s.stopPropagation()}
          @click=${(s) => l && oe(s, e, { action: "more-info" }, l.entity_id)}>
          <b><span>${l?.state ?? "—"}</span>${M(l, "unit_of_measurement") ? d`<em>${String(M(l, "unit_of_measurement"))}</em>` : h}</b>
          <small>${String(i)}</small>
        </button>
      `)}
    </div>
  `);
}, gn = (e) => {
  const t = [1, 2, 3, 4].map((i) => B(e, `ulm_custom_card_weather_metrics_entity_${i}`) ?? (e.config.entities?.[i - 1] ? e.hass.states[e.config.entities[i - 1]] : void 0)), a = j(e, "temperature_entity"), o = j(e, "date_entity") ?? B(e, "ulm_custom_card_weather_metrics_date"), r = e.entity?.state || "unknown", n = {
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
  return e.actionSurface("custom-weather-metrics", d`
    <div class="weather-metrics-panel">
      <b class="weather-date">${n[r] || "❔"} ${o ? S(o) : "Date unavailable"}</b>
      <strong>${a ? S(a) : `${M(e.entity, "temperature") ?? "—"}°`}</strong>
    </div>
    <div class="metrics-four">${t.map((i, l) => d`
      <button ?disabled=${!i} @pointerdown=${(s) => s.stopPropagation()}
        @click=${(s) => i && oe(s, e, { action: "more-info" }, i.entity_id)}>
        <b>${S(i)}</b>
        <small>${b(e, `ulm_custom_card_weather_metrics_name_${l + 1}`) || (i ? ne({ entity: i.entity_id }, i, e.hass) : `Weather ${l + 1}`)}</small>
      </button>
    `)}</div>
  `);
}, yn = (e) => {
  const t = !e.entity || e.entity.state === "unavailable", a = b(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : M(e.entity, "entity_picture"), o = Math.round((A(M(e.entity, "volume_level")) ?? 0) * 100), r = M(e.entity, "source"), n = ["idle", "paused", "unavailable"].includes(e.entity?.state ?? "") ? S(e.entity) : `${r ? String(r) : S(e.entity)} • ${o}%`, i = Ct(e.hass, e.config.entity, e.config), l = Aa.flatMap((c) => {
    const y = i[c.configKey], f = y ? e.hass.states[y] : void 0;
    return f ? [{ control: c, entity: f }] : [];
  }), s = Ca.flatMap((c) => {
    const y = i[c.configKey], f = y ? e.hass.states[y] : void 0;
    return f ? [{ control: c, entity: f }] : [];
  }), u = (e.config.shortcuts?.buttons ?? []).filter((c) => typeof c.id == "string" && c.id.trim().length > 0), m = Math.min(8, Math.max(1, Math.round(e.config.shortcuts?.columns ?? 4))), g = b(e, "sonos_details_always_visible") === !0, _ = d`
    ${l.length ? d`<div class="sonos-switches">
      ${l.map(({ control: c, entity: y }) => d`
        <button class=${y.state === "on" ? "is-active" : ""} aria-pressed=${y.state === "on"}
          ?disabled=${y.state === "unavailable"}
          @click=${(f) => {
    f.stopPropagation(), e.service("homeassistant", "toggle", { entity_id: y.entity_id });
  }}>
          <ha-icon .icon=${c.icon}></ha-icon>
          <span>${c.label}</span>
        </button>
      `)}
    </div>` : h}
    ${s.length ? d`<div class="sonos-sliders">
      ${s.map(({ control: c, entity: y }) => {
    const f = A(y.state) ?? 0, k = A(M(y, "min")) ?? -100, v = A(M(y, "max")) ?? 100, z = A(M(y, "step")) ?? 1;
    return d`
          <label>
            <ha-icon .icon=${c.icon}></ha-icon>
            <span>${c.label}</span>
            <input type="range" min=${k} max=${v} step=${z} .value=${String(f)}
              ?disabled=${y.state === "unavailable"}
              aria-label=${c.label}
              @change=${(w) => {
      w.stopPropagation(), e.service("number", "set_value", {
        entity_id: y.entity_id,
        value: Number(w.currentTarget.value)
      });
    }}>
            <output>${f}</output>
          </label>
        `;
  })}
    </div>` : h}
  `;
  return e.actionSurface(`custom-sonos ${a ? "has-art" : ""}`, d`
    ${a ? d`<span class="media-art" style=${`background-image:url("${String(a)}")`}></span>` : h}
    <div class="custom-card-heading">
      ${ee(e, "mdi:speaker", e.entity?.state === "playing" ? "green" : "grey")}
      ${H(e, n)}
    </div>
    <div class="sonos-controls">
      ${J("Volume down", "mdi:volume-minus", (c) => {
    c.stopPropagation(), e.service("media_player", "volume_down", { entity_id: e.config.entity });
  }, t)}
      ${J("Play or pause", ["paused", "off"].includes(e.entity?.state ?? "") ? "mdi:play" : "mdi:pause", (c) => {
    c.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: e.config.entity });
  }, t)}
      ${J("Volume up", "mdi:volume-plus", (c) => {
    c.stopPropagation(), e.service("media_player", "volume_up", { entity_id: e.config.entity });
  }, t)}
    </div>
    ${l.length || s.length ? d`
      ${g ? d`<div class="sonos-details sonos-details-always-visible"
            @pointerdown=${(c) => c.stopPropagation()}
            @click=${(c) => c.stopPropagation()}>
            ${_}
          </div>` : d`<details class="sonos-details" @pointerdown=${(c) => c.stopPropagation()}
            @click=${(c) => c.stopPropagation()}>
            <summary>
              <span>More details</span>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </summary>
            ${_}
          </details>`}
    ` : h}
    ${u.length ? d`
      <div class="sonos-shortcuts" style=${`--sonos-shortcut-columns:${m}`}
        @pointerdown=${(c) => c.stopPropagation()}>
        ${u.map((c, y) => d`
          <button
            aria-label=${c.name || `Play shortcut ${y + 1}`}
            title=${c.name || c.id || ""}
            ?disabled=${t}
            @click=${(f) => {
    f.stopPropagation(), e.service("media_player", "play_media", {
      entity_id: e.config.entity,
      media_content_type: c.type || "playlist",
      media_content_id: c.id
    });
  }}>
            <ha-icon .icon=${c.icon || "mdi:playlist-music"}></ha-icon>
            ${c.name ? d`<span>${c.name}</span>` : h}
          </button>
        `)}
      </div>
    ` : h}
  `);
}, bn = (e) => {
  const t = j(e, "power_entity"), a = j(e, "energy_entity"), o = j(e, "time_entity"), r = o ? (A(o.state) ?? 0) < 1 ? `${(A(o.state) ?? 0) * 100}Mins` : `${o.state}Hrs` : void 0, n = e.entity?.state === "on", i = n ? [
    t ? `${t.state}W` : void 0,
    a ? `${a.state}kWh` : void 0,
    r
  ].filter(Boolean).join(" • ") || S(e.entity) : a && (A(a.state) ?? 0) > 0 ? `${S(e.entity)} • ${a.state}kWh` : S(e.entity);
  return e.actionSurface("custom-more-power-outlet", d`
    ${ee(e, "mdi:power-socket-eu", n ? "yellow" : "grey")}
    ${H(e, i || S(e.entity))}
  `);
}, fn = (e) => {
  const t = A(e.entity?.state) ?? 0, a = A(e.config.minimum) ?? 0, o = A(e.config.maximum) ?? 100, r = Math.max(0, Math.min(100, (t - a) / Math.max(1, o - a) * 100));
  return e.actionSurface("custom-dual-gauge", d`
    <div class="custom-card-heading">${ee(e, "mdi:gauge", "blue")}${H(e, S(e.entity))}</div>
    <div class="dual-gauge" style=${`--gauge:${r * 1.8}deg`}>
      <i></i>
      ${a === 0 && o === 100 ? h : d`<span><small>${a} - ${o}</small></span>`}
    </div>
  `);
}, vn = (e) => {
  const t = [
    j(e, "black_entity"),
    j(e, "yellow_entity"),
    j(e, "magenta_entity"),
    j(e, "cyan_entity")
  ], a = ["#111", "#faff00", "#f800ff", "#00ffff"];
  return e.actionSurface("custom-printer", d`
    <div class="custom-card-heading">
      ${ee(e, "mdi:printer", e.entity?.state === "idle" ? "grey" : "blue")}
      ${H(e, S(e.entity))}
    </div>
    <div class="toner-bars">${t.map((o, r) => {
    if (!o) return h;
    const n = Math.max(0, Math.min(100, A(o.state) ?? 0));
    return d`<span style=${`--toner:${a[r]};--level:${n}%`}><i><em></em><b>${S(o)}</b></i></span>`;
  })}</div>
  `);
}, wn = (e) => {
  const t = j(e, "disk_entity") ?? B(e, "entity_4"), a = j(e, "temperature_entity") ?? B(e, "entity_1"), o = j(e, "memory_entity") ?? B(e, "entity_2"), r = j(e, "cpu_entity") ?? B(e, "entity_3"), n = !["off", "unavailable", "unknown"].includes(e.entity?.state ?? ""), i = (_, c) => Z(
    b(e, _),
    Z(c, c)
  ), l = (_) => !!b(e, _), s = (_) => {
    const c = e.config[_];
    return c && typeof c == "object" && "max_value" in c ? A(c.max_value) : void 0;
  }, u = (_, c, y, f = 100) => {
    const k = Math.max(0, Math.min(f, A(_?.state) ?? 0)), v = 2 * Math.PI * c, z = v * (1 - k / f);
    return W`<circle class="nas-metrics-ring-value" cx="70" cy="70" r=${c}
      fill="none" stroke=${y} stroke-width="6" stroke-linecap="round"
      stroke-dasharray=${v} stroke-dashoffset=${z}></circle>`;
  }, m = e.entity?.state === "on" ? "Access" : S(e.entity), g = d`
    <button class="nas-metrics-tile status-tile" aria-label="Open NAS status"
      @pointerdown=${(_) => _.stopPropagation()}
      @click=${(_) => oe(_, e, { action: "more-info" })}>
      <span class="nas-metrics-tile-icon tone-blue"><ha-icon icon="mdi:nas"></ha-icon></span>
      <span><b>Status</b><small>${m}</small></span>
    </button>`;
  return n ? e.actionSurface("custom-nas-metrics is-on", d`
    <div class="nas-metrics-top">
      ${g}
      <div class="nas-metrics-tile disk-tile">
        <span class=${`nas-metrics-tile-icon ${l("disk_color") ? "" : "tone-red"}`}
          style=${l("disk_color") ? `color:${i("disk_color", "red")};background:color-mix(in srgb, ${i("disk_color", "red")} 18%, transparent)` : ""}>
          <ha-icon .icon=${b(e, "disk_icon") || "mdi:harddisk"}></ha-icon>
        </span>
        <span><b>${b(e, "disk_name") || "Disk"}</b><small>${S(t)}</small></span>
      </div>
    </div>
    <div class="nas-metrics-body">
      <div class="nas-metrics-metrics">
        <span><i class=${l("temperature_color") ? "" : "tone-orange"} style=${l("temperature_color") ? `color:${i("temperature_color", "orange")}` : ""}><ha-icon .icon=${b(e, "temperature_icon") || "mdi:thermometer"}></ha-icon></i><span><b>${b(e, "temperature_name") || "Temp"}</b><small>${S(a)}</small></span></span>
        <span><i class=${l("memory_color") ? "" : "tone-blue"} style=${l("memory_color") ? `color:${i("memory_color", "blue")}` : ""}><ha-icon .icon=${b(e, "memory_icon") || "mdi:memory"}></ha-icon></i><span><b>${b(e, "memory_name") || "Memory"}</b><small>${S(o)}</small></span></span>
        <span><i class=${l("cpu_color") ? "" : "tone-green"} style=${l("cpu_color") ? `color:${i("cpu_color", "green")}` : ""}><ha-icon .icon=${b(e, "cpu_icon") || "mdi:cpu-64-bit"}></ha-icon></i><span><b>${b(e, "cpu_name") || "CPU"}</b><small>${S(r)}</small></span></span>
      </div>
      <svg class="nas-metrics-rings" viewBox="0 0 140 140" role="img" aria-label="NAS temperature, memory, and CPU utilization">
        ${[58, 48, 38].map((_) => W`<circle class="nas-metrics-ring-track" cx="70" cy="70" r=${_}
          fill="none" stroke="#dedede" stroke-width="6"></circle>`)}
        ${u(a, 58, i("temperature_color", "orange"), A(b(e, "temperature_max")) ?? s("entity_1") ?? 100)}
        ${u(o, 48, i("memory_color", "blue"), A(b(e, "memory_max")) ?? s("entity_2") ?? 100)}
        ${u(r, 38, i("cpu_color", "green"), A(b(e, "cpu_max")) ?? s("entity_3") ?? 100)}
      </svg>
    </div>
  `) : e.actionSurface("custom-nas-metrics is-off", d`<div class="nas-metrics-top">${g}</div>`);
}, $n = (e) => {
  const t = j(e, "battery_entity"), a = Math.max(0, Math.min(100, A(t?.state) ?? 0)), o = [
    ["tablet_button_usb_entity", "mdi:usb", "green", "Toggle USB"],
    ["tablet_button_motion_entity", "mdi:motion-sensor", "green", "Toggle motion"],
    ["tablet_button_display_entity", "mdi:monitor", "green", "Toggle display"],
    ["tablet_restart_entity", "mdi:restart-alert", "blue", "Restart tablet"],
    ["tablet_maintenance_entity", "mdi:account-hard-hat-outline", "orange", "Toggle maintenance mode"],
    ["tablet_reload_entity", "mdi:reload", "blue", "Reload tablet"]
  ], n = [
    ["RAM", j(e, "tablet_ram_entity")],
    ["Disk", j(e, "tablet_disk_entity")],
    ["Power", j(e, "tablet_power_entity")]
  ].flatMap(
    ([u, m]) => m ? [[u, m]] : []
  ), i = o.flatMap(
    ([u, m, g, _]) => {
      const c = j(e, u);
      return c ? [[m, g, _, c]] : [];
    }
  ), l = e.entity?.state === "on" ? "Access" : S(e.entity), s = (u, m) => {
    if (u.stopPropagation(), !m) return;
    m.entity_id.split(".")[0] === "button" ? e.service("button", "press", { entity_id: m.entity_id }) : e.service("homeassistant", "toggle", { entity_id: m.entity_id });
  };
  return e.actionSurface("custom-tablet", d`
    <div class="tablet-header">
      <span class="tablet-icon"><ha-icon icon="mdi:tablet"></ha-icon></span>
      ${H(e, l)}
    </div>
    ${i.length ? d`<div class="tablet-controls">${i.map(([u, m, g, _]) => {
    const c = _.state.toLowerCase() === "unavailable";
    return d`<button class="tone-${m} ${ce.has(_.state) ? "is-active" : ""}"
        aria-label=${g} ?disabled=${c}
        @pointerdown=${(y) => y.stopPropagation()}
        @click=${(y) => s(y, _)}>
        <ha-icon .icon=${u}></ha-icon>
      </button>`;
  })}</div>` : h}
    ${n.length ? d`<div class="tablet-metrics">${n.map(([u, m]) => d`
      <span class=${m.state.toLowerCase() === "unavailable" ? "is-unavailable" : ""}><b>${S(m)}</b><small>${u}</small></span>
    `)}</div>` : h}
    ${t ? d`<div class="tablet-battery-row">
      <span class="tablet-battery-icon"><ha-icon icon="mdi:battery"></ha-icon></span>
      <span><b>${S(t)}</b><small>Battery</small></span>
    </div>
    <div class="tablet-battery-bar"><i style=${`width:${a}%`}></i><b>${a}%</b></div>` : h}
  `);
}, xn = (e) => {
  const t = e.entity?.state ?? "unknown", a = Pt(e.hass, e.config.entity, e.config), o = (T) => {
    const V = a[T];
    return V ? e.hass.states[V] : void 0;
  }, r = Va(e.hass, e.config.entity, e.config), n = Lo(r), i = o("followers_entity"), l = o("following_entity"), s = o("friends_entity"), u = o("primary_stat_entity"), m = o("secondary_stat_entity"), g = o("now_playing_entity"), _ = o("gamerpic_entity"), c = o("artwork_entity"), y = o("console_power_entity"), f = M(_, "entity_picture") ?? M(e.entity, "entity_picture"), k = b(e, "console_show_artwork") === !1 ? void 0 : M(c, "entity_picture") ?? M(e.entity, "media_image_url") ?? M(e.entity, "entity_picture"), v = !!k, z = g && !["unknown", "unavailable", "none", ""].includes(g.state.toLowerCase()) ? S(g) : String(M(e.entity, "media_title") ?? ""), w = ne(e.config, e.entity, e.hass), D = [
    { entity: i, icon: "mdi:account-arrow-left", label: "Followers" },
    { entity: l, icon: "mdi:account-arrow-right", label: "Following" },
    { entity: s, icon: "mdi:account-multiple", label: "Friends" }
  ].filter(({ entity: T }) => T), U = [
    {
      entity: u,
      icon: b(e, "primary_stat_icon") || (r === "xbox" ? "mdi:microsoft-xbox" : "mdi:trophy")
    },
    {
      entity: m,
      icon: b(e, "secondary_stat_icon") || "mdi:podium"
    }
  ].filter(({ entity: T }) => T), K = y?.entity_id.split(".", 1)[0], Y = y && !["off", "standby", "unavailable", "unknown"].includes(y.state), te = (T) => {
    if (T.stopPropagation(), !(!y || !K)) {
      if (K === "switch") {
        e.service("homeassistant", "toggle", { entity_id: y.entity_id });
        return;
      }
      e.service(K, Y ? "turn_off" : "turn_on", { entity_id: y.entity_id });
    }
  };
  return e.actionSurface(`custom-console-card platform-${r} state-${t} ${v ? "has-artwork" : ""}`, d`
    ${v ? d`<div class="console-backdrop" style=${`background-image:url("${String(k)}")`}></div>` : h}
    <div class="console-content">
      <div class="console-header">
        <span class="console-logo ${f ? "has-picture" : ""}"
          style=${f ? `background-image:url("${String(f)}")` : ""}>
          ${f ? h : d`<ha-icon .icon=${e.config.icon || n.icon}></ha-icon>`}
        </span>
        <span class="console-title">
          <b>${w}</b>
          <small>${z || S(e.entity)}</small>
        </span>
        ${U.length ? d`<span class="console-top-stats">
          ${U.map(({ entity: T, icon: V }) => d`
            <span title=${String(M(T, "friendly_name") ?? "")}>
              <ha-icon .icon=${V}></ha-icon>
              <b>${S(T)}</b>
            </span>
          `)}
        </span>` : h}
      </div>
      ${D.length ? d`<div class="console-social">
        ${D.map(({ entity: T, icon: V, label: Q }) => d`
          <span class="console-social-item" title=${Q}><ha-icon .icon=${V}></ha-icon><b>${T?.state}</b></span>
        `)}
      </div>` : h}
      ${b(e, "console_show_controls") !== !1 && y ? d`
        <div class="console-controls">
          <button aria-label=${Y ? "Turn console off" : "Turn console on"}
            @pointerdown=${(T) => T.stopPropagation()}
            @click=${te}>
            <ha-icon .icon=${Y ? "mdi:power" : "mdi:power-standby"}></ha-icon>
            <span>${Y ? "Power off" : "Power on"}</span>
          </button>
        </div>
      ` : h}
    </div>
  `);
}, Sn = (e) => {
  const t = [
    e.config.name,
    e.config.primary_info,
    e.config.secondary_info,
    e.config.icon,
    e.config.show_name === !0 ? !0 : void 0
  ].some((a) => a !== void 0);
  return d`
    <ha-card class="mushroom-addition-card entity-carousel-card">
      ${t ? d`
        <div class="metric-heading entity-carousel-presentation">
          ${Ce(e, Ye(e, "mdi:view-carousel"), "var(--primary-color)", !0)}
          ${H(e, S(e.entity), e.descriptor.name)}
        </div>
      ` : h}
      <mushroom-addition-entity-carousel
        .hass=${e.hass}
        .config=${e.config}>
      </mushroom-addition-entity-carousel>
    </ha-card>
  `;
}, kn = (e) => {
  e.presentation.rendered = !0;
  const t = e.config, a = [
    t.name,
    t.primary_info,
    t.secondary_info,
    t.icon,
    t.icon_type
  ].some((x) => x !== void 0), o = $e(e.hass, t.entity) ?? 0, r = $e(e.hass, t.grid_power_entity) ?? 0, n = [
    t.grid_phase_1_entity,
    t.grid_phase_2_entity,
    t.grid_phase_3_entity
  ].map((x) => $e(e.hass, x) ?? 0), i = $e(e.hass, t.solar_power_entity) ?? 0, l = Ee(e.hass, t.solar_forecast_entity) ?? 0, s = $e(e.hass, t.battery_power_entity) ?? 0, u = Math.max(0, Math.min(
    100,
    Ee(e.hass, t.battery_level_entity) ?? 0
  )), m = $e(e.hass, t.ev_charger_power_entity) ?? 0, g = [1, 2, 3].map((x) => ({
    level: Ee(e.hass, b(e, `battery_${x}_level_entity`)) ?? 0,
    power: $e(e.hass, b(e, `battery_${x}_power_entity`)) ?? 0
  })), _ = t.energy_mode_entity ? e.hass.states[t.energy_mode_entity]?.state ?? "-" : "-", c = {
    "Smart Matching": t.mode_solar_first_label ?? "Solar first",
    "Dynamic Smart Matching": t.mode_smart_saving_label ?? "Smart saving",
    "Dynamic Trading + Smart Matching": t.mode_smart_trading_label ?? "Smart trading"
  }, y = t.energy_auto_control_entity ? e.hass.states[t.energy_auto_control_entity]?.state === "on" : !1, f = `${c[_] ?? _} · ${y ? t.energy_auto_label ?? "Auto" : t.energy_manual_label ?? "Manual"}`, k = s > 20 ? `${t.energy_charge_label ?? "Charging"} ${ye(s)}` : s < -20 ? `${t.energy_discharge_label ?? "Discharging"} ${ye(s)}` : t.energy_idle_label ?? "Idle", v = r > 20 ? t.energy_grid_import_label ?? "GRID · Import" : r < -20 ? t.energy_grid_export_label ?? "GRID · Export" : t.energy_grid_label ?? "GRID", z = t.import_color ?? "#ff9f43", w = t.export_color ?? "#4cd98b", D = t.battery_color ?? "#3b82f6", U = t.solar_color ?? "#f5c542", K = t.home_color ?? "#3b82f6", Y = r > 20 ? z : w, te = (/* @__PURE__ */ new Date()).toLocaleTimeString(e.hass.language ?? "nl-NL", {
    hour: "2-digit",
    minute: "2-digit"
  }), T = (x, N, I) => W`
    <path d=${bt(x, N, I)} class="hems-track"></path>
  `, V = (x, N, I, L, de, ue = !1) => {
    const Le = wr(x, N, I, L, ue);
    return Le ? W`<path d=${Le} stroke=${de} class="hems-bar"></path>` : h;
  }, Q = t.electricity_price_entity ? e.hass.states[t.electricity_price_entity] : void 0, R = xr(
    Q,
    Ee(e.hass, t.tariff_markup_entity) ?? 0,
    Ee(e.hass, t.tariff_vat_entity) ?? 0
  ), ae = /* @__PURE__ */ new Date();
  ae.setHours(0, 0, 0, 0);
  const ie = ae.getTime(), se = 864e5, ge = Date.now(), $ = R.find((x) => ge >= x.start && ge < x.end), O = (x) => x < 0 ? t.price_negative_color ?? "#0288d1" : x < (t.price_low_threshold ?? 0.18) ? t.price_low_color ?? "#2e7d32" : x < (t.price_medium_threshold ?? 0.26) ? t.price_medium_color ?? "#9ccc65" : x < (t.price_high_threshold ?? 0.34) ? t.price_high_color ?? "#fdd835" : x < (t.price_critical_threshold ?? 0.42) ? t.import_color ?? "#fb8c00" : t.price_critical_color ?? "#e53935", X = (x) => new Date(x).toLocaleTimeString(e.hass.language ?? "nl-NL", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return e.actionSurface("advanced-energy-management", d`
    ${a ? d`
      <div class="hems-presentation">${dt(e)}</div>
    ` : h}
    <svg class="hems-flow" viewBox="0 0 760 650" role="img" aria-label="Advanced home energy live flow">
      <circle cx="380" cy="300" r="80" class="hems-track hems-battery-track"></circle>
      ${V(80, 0, Math.min(u, 99.9) * 3.6, 1, D)}
      <text x="380" y="270" class="hems-muted hems-center">▮ Battery</text>
      <text x="380" y="318" class="hems-battery-value hems-center">${Math.round(u)}%</text>
      <text x="380" y="346" class="hems-muted hems-center">${k}</text>
      <text x="380" y="125" class="hems-time hems-muted hems-center">${te}</text>

      ${t.show_grid_phases !== !1 ? [250, 270, 290].map((x, N) => W`
        ${T(x, 272, 352)}
        ${V(
    x,
    272,
    352,
    Math.abs(n[N]) / (t.grid_phase_scale_max ?? 3e3),
    n[N] < 0 ? w : z
  )}
      `) : h}
      <text x="180" y="185" class="hems-muted">${v}</text>
      <text x="180" y="228" class="hems-main-value" fill=${Y}>⚡ ${ye(r)}</text>
      ${t.show_grid_phases !== !1 ? n.map((x, N) => W`
        <text x="180" y=${258 + N * 22} class="hems-detail hems-muted">
          L${N + 1} ${x >= 0 ? "↓" : "↑"} ${ye(x)}
        </text>
      `) : h}

      ${T(265, 188, 262)}
      ${V(265, 188, 262, i / (t.solar_scale_max ?? 6e3), U, !0)}
      <text x="180" y="395" class="hems-muted">${t.energy_solar_label ?? "Solar Panels"}</text>
      <text x="180" y="437" class="hems-main-value">☀️ ${ye(i)}</text>
      <text x="180" y="465" class="hems-detail hems-muted">
        ${t.energy_forecast_label ?? "Expected"} ${l.toLocaleString(void 0, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })} kWh
      </text>

      ${t.show_battery_units !== !1 ? [250, 270, 290].map((x, N) => W`
        ${T(x, 8, 88)}
        ${V(
    x,
    8,
    88,
    Math.abs(g[N].power) / (t.battery_unit_scale_max ?? 2400),
    g[N].power > 0 ? D : z,
    !0
  )}
      `) : h}
      <text x="585" y="185" class="hems-muted hems-end">${t.energy_battery_label ?? "Battery"}</text>
      ${t.show_battery_units !== !1 ? g.map((x, N) => W`
        <text x="585" y=${224 + N * 22} class="hems-detail hems-muted hems-end">
          ${N + 1} <tspan fill=${D} font-weight="600">${Math.round(x.level)}%</tspan>
          ${x.power > 20 ? "↑" : x.power < -20 ? "↓" : ""} ${ye(x.power)}
        </text>
      `) : h}

      ${T(265, 98, 172)}
      ${V(265, 98, 172, o / (t.home_scale_max ?? 4e3), K)}
      <text x="585" y="395" class="hems-muted hems-end">${t.energy_home_label ?? "HOME"}</text>
      <text x="585" y="437" class="hems-main-value hems-end">${ye(o)} ⌂</text>
      <text x="585" y="465" class="hems-detail hems-muted hems-end">
        🚗 ${t.energy_ev_label ?? "EV charger"} ${ye(m)}
      </text>
      <text x="380" y="522" class="hems-mode hems-muted hems-center">${f} ▾</text>

      ${t.show_tariff_timeline !== !1 && R.length ? W`
        ${R.map((x) => {
    const N = 90 + 580 * (x.start - ie) / se, I = Math.max(580 * (x.end - x.start) / se, 1);
    return W`<rect x=${N} y="588" width=${I} height="14"
            fill=${O(x.price)} opacity=".8"></rect>`;
  })}
        ${$ ? W`
          <text x="90" y="574" class="hems-muted">
            ${X($.start)} – ${X($.end)}
          </text>
          <text x="670" y="574" class="hems-price hems-end"
            fill=${O($.price)}>
            ${Math.round($.price * 100)} cents
          </text>
        ` : h}
        <rect x=${90 + 580 * (ge - ie) / se - 1.5} y="584"
          width="3" height="22" rx="1.5" class="hems-now"></rect>
        ${[0, 6, 12, 18, 24].map((x) => W`
          <text x=${90 + 580 * x / 24} y="624" class="hems-hour hems-muted hems-center">
            ${String(x % 24).padStart(2, "0")}
          </text>
        `)}
      ` : h}
    </svg>
  `);
}, pt = [
  { kind: 0, fallback: "Price" },
  { kind: 1, fallback: "Planned grid charge" },
  { kind: 2, fallback: "Planned sell" },
  { kind: 3, fallback: "Possible sell" }
], Wa = (e, t, a) => {
  const r = [
    e.config.name,
    e.config.name_mode,
    e.config.primary_info,
    e.config.secondary_info
  ].some((n) => n !== void 0) ? e : { ...e, config: { ...e.config, entity: void 0 }, entity: void 0 };
  return dt(r, a, t);
}, Mn = (e) => {
  const t = e.entity, a = kr(t), o = Math.max(1, A(e.config.buy_sell_graph_span) ?? 36), r = Date.now(), n = e.config.buy_sell_span_start !== "now" ? new Date(new Date(r).setHours(0, 0, 0, 0)).getTime() : r, i = n + o * 60 * 60 * 1e3, l = a.filter(({ timestamp: I }) => I >= n && I < i), s = A(e.config.buy_sell_min_value), u = A(e.config.buy_sell_max_value), m = Mr(l, s, u), g = 58, _ = 700, c = 22, y = 254, f = _ - g, k = y - c, v = (I) => g + (I - n) / (i - n) * f, z = (I) => y - (I - m.minimum) / (m.maximum - m.minimum) * k, w = Math.max(0, Math.min(6, Math.floor(A(e.config.buy_sell_price_decimals) ?? 3))), D = (I) => {
    const L = l[I + 1]?.timestamp, de = L ? L - l[I].timestamp : 1800 * 1e3;
    return Math.max(60 * 1e3, Math.min(de, 360 * 60 * 1e3));
  }, U = Math.max(0, Math.min(6, Math.floor(A(e.config.buy_sell_axis_decimals) ?? 2))), K = pt.map((I, L) => Z(b(e, [
    "buy_sell_price_color",
    "buy_sell_charge_color",
    "buy_sell_planned_sell_color",
    "buy_sell_possible_sell_color"
  ][L]), ["#78909c", "#43a047", "#fb8c00", "#ffcc80"][L])), Y = Z(
    b(e, "buy_sell_now_color"),
    "var(--primary-text-color)"
  ), te = 14400 * 1e3, T = [];
  for (let I = n; I <= i; I += te) T.push(I);
  T.at(-1) !== i && T.push(i);
  const V = (I) => new Date(I).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), Q = [
    "buy_sell_price_label",
    "buy_sell_charge_label",
    "buy_sell_planned_sell_label",
    "buy_sell_possible_sell_label"
  ], R = pt.map(({ fallback: I }, L) => String(e.config[Q[L]] || I)), ae = e.config.buy_sell_trade_energy_entity, ie = Number(ae ? e.hass.states[ae]?.state : e.config.buy_sell_trade_energy ?? 10), se = Number(e.config.buy_sell_trade_power ?? 7.2), ge = Number(e.config.buy_sell_trade_efficiency ?? 86), $ = Number(e.config.buy_sell_feed_in_fee ?? 0), O = ae && (!Number.isFinite(ie) || ie <= 0) ? { error: `Minimum trade size entity ${ae} must provide a positive numeric kWh value.` } : Ir(a, {
    energy: ie,
    power: se,
    efficiency: ge,
    fee: $,
    slotMinutes: Number(e.config.buy_sell_slot_minutes ?? 15)
  }), X = (I) => `${I >= 0 ? "+" : ""}${I.toFixed(2)}`, x = (I) => new Date(I).toLocaleString(
    e.hass.language ?? "en-GB",
    { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
  ), N = (I, L, de) => d`
    <tr>
      <th scope="row"><span class="energy-result-kind" style=${`--energy-result-color:${de}`}><i></i>${I}</span></th>
      <td title=${L.slots.map((ue) => `${x(ue.start)} – ${x(ue.end)}`).join("; ")}>
        ${x(L.slots[0].start)} – ${x(L.slots.at(-1).end)}
        (${L.slots.length} slots)
      </td>
      <td>${L.averagePrice.toFixed(3)}</td>
      <td>${L.energy.toFixed(1)}</td>
      <td>${X(L.amount)}</td>
    </tr>
  `;
  return e.actionSurface("energy-buy-sell-card", d`
      ${Wa(e, String(e.config.buy_sell_title || "Buy and sell moments (all-in €/kWh)"), "Price timeline")}
      <div class="energy-buy-sell-chart" style=${`height:${Math.max(120, Math.min(700, A(e.config.buy_sell_chart_height) ?? 300))}px`} role="img"
        aria-label=${`Energy prices and planned actions for the next ${o} hours`}>
        <svg viewBox="0 0 720 314" preserveAspectRatio="none" aria-hidden="true">
          ${Array.from({ length: 5 }, (I, L) => {
    const de = m.maximum - (m.maximum - m.minimum) * L / 4, ue = c + k * L / 4;
    return W`
              ${e.config.buy_sell_show_grid !== !1 ? W`
                <line x1=${g} y1=${ue} x2=${_} y2=${ue} class="energy-chart-grid"></line>
              ` : h}
              <text x=${g - 8} y=${ue + 4} text-anchor="end" class="energy-chart-tick">
                ${la(de, U)}
              </text>
            `;
  })}
          <text x="14" y=${(c + y) / 2} text-anchor="middle"
            transform=${`rotate(-90 14 ${(c + y) / 2})`} class="energy-chart-axis-title">${e.config.buy_sell_axis_label || "€/kWh"}</text>
          ${T.map((I) => {
    const L = v(I);
    return W`
              <line x1=${L} y1=${y} x2=${L} y2=${y + 4} class="energy-chart-axis"></line>
              <text x=${L} y=${y + 20} text-anchor="middle" class="energy-chart-tick">
                ${V(I)}
              </text>
            `;
  })}
          ${l.map((I, L) => {
    const de = I.kind, ue = K[de], Le = z(I.price), Lt = z(Math.max(m.minimum, Math.min(0, m.maximum))), Ft = v(I.timestamp), Ka = v(Math.min(i, I.timestamp + D(L))), Ya = Math.max(1, (Ka - Ft) * 0.88), Xa = Math.min(Le, Lt), Ja = Math.max(1, Math.abs(Le - Lt));
    return W`
              <rect x=${Ft} y=${Xa} width=${Ya} height=${Ja}
                rx=${Math.max(0, Math.min(16, A(e.config.buy_sell_bar_radius) ?? 2))}
                fill=${ue} opacity="0.88">
                <title>${`${R[de]}: ${la(I.price, w)} ${e.config.buy_sell_axis_label || "€/kWh"}`}</title>
              </rect>
            `;
  })}
          ${l.length === 0 ? W`
            <text x=${(g + _) / 2} y=${(c + y) / 2}
              text-anchor="middle" class="energy-chart-empty">No price slots available</text>
          ` : h}
          ${e.config.buy_sell_show_now !== !1 && r >= n && r <= i ? W`
            <line x1=${v(r)} y1=${c} x2=${v(r)} y2=${y + 4}
              class="energy-chart-now" style=${`stroke:${Y}`}></line>
            <text x=${v(r)} y=${c - 7} text-anchor="middle" class="energy-chart-now-label"
              style=${`fill:${Y}`}>
              ${e.config.buy_sell_now_label || "Now"}
            </text>
          ` : h}
        </svg>
      </div>
      ${e.config.buy_sell_show_legend !== !1 ? d`<div class="energy-chart-legend">
        ${pt.map(({ kind: I }, L) => d`
          <span class="energy-chart-legend-item">
            <span class="energy-chart-legend-swatch" style=${`--energy-series-color:${K[L]}`}></span>
            ${R[I]}
          </span>
        `)}
      </div>` : h}
      ${e.config.buy_sell_show_result !== !1 ? d`
        <details class="energy-buy-sell-result"
          @pointerdown=${(I) => I.stopPropagation()}
          @click=${(I) => I.stopPropagation()}
          @dblclick=${(I) => I.stopPropagation()}
          @keydown=${(I) => I.stopPropagation()}>
          <summary>Buy and sell result<ha-icon icon="mdi:chevron-down"></ha-icon></summary>
          ${"error" in O ? d`<p class="energy-card-empty" role="status">${O.error}</p>` : d`
            <div class="energy-result-table-scroll" tabindex="0" role="region" aria-label="Buy and sell estimate">
              <table class="energy-result-table">
                <thead><tr><th scope="col">Action</th><th scope="col">Slots</th><th scope="col">avg €/kWh</th><th scope="col">kWh</th><th scope="col">€</th></tr></thead>
                <tbody>${N("Buy", O.buy, K[1])}${N("Sell", O.sell, K[2])}</tbody>
              </table>
            </div>
            <p class="energy-result-net">Net result for ${Number(ie.toFixed(2))} kWh: ${X(O.net)} €</p>
            <p class="energy-result-note">
              Calculated for the minimum trade size (${Number(ie.toFixed(2))} kWh):
              the cheapest slots to buy and the most expensive remaining slots to sell,
              at ${se} kW, over all published prices.
              Buy kWh = sold kWh ÷ round-trip efficiency (${ge}%).
              Sell is revenue after the feed-in fee (${$} €/kWh).
              Slots may be non-contiguous; the displayed times span the selected slots, not a continuous schedule.
              The final slot may be partially used. This estimate does not enforce buy-before-sell order,
              battery capacity or available charge; the real plan follows Smart saving / Smart trading.
            </p>
          `}
        </details>
      ` : h}
  `);
}, In = (e) => {
  const t = Array.isArray(e.config.panel_entities) ? e.config.panel_entities : void 0, a = Cr(
    e.hass.states,
    t,
    e.config.entity
  ), o = Pr(a), r = Math.max(1, A(e.config.panel_gauge_max) ?? 350), n = [0, 1, 2, 3, 4, 5].map((f) => A(e.config[`panel_segment_${f}`]) ?? [0, 80, 150, 230, 300, r][f]), i = n.map((f, k) => Z(b(e, `panel_color_${k}`), [
    "#b0bec5",
    "#ffa726",
    "#d4e157",
    "#66bb6a",
    "#2e7d32",
    "#2e7d32"
  ][k])), l = A(e.config.panel_warning_average_min) ?? 30, s = (A(e.config.panel_low_output_percent) ?? 60) / 100, u = o.averageOutput > l && !!o.weakest && o.weakest.value < o.averageOutput * s, m = o.activeCount < a.length, g = a.length === 0 ? "No panel sensors are selected." : u ? `Panel ${o.weakest.id} is delivering less than ${Math.round(s * 100)}% of the average. Check for shading or a fault.` : m ? `${a.length - o.activeCount} panel(s) at zero. This is normal at night; otherwise, check them.` : "All panels are within the expected range of each other.", _ = a.length === 0 ? "mdi:information-outline" : u || m ? "mdi:alert-circle-outline" : "mdi:check-circle-outline", c = u ? "warning" : m || a.length === 0 ? "muted" : "success", y = [
    ["Panels reporting", `${o.activeCount} / ${a.length}`],
    ["Combined output", `${Math.round(o.totalOutput)} W`],
    ["Average per panel", `${Math.round(o.averageOutput)} W`],
    ["Best panel", o.best ? `${o.best.id} · ${Math.round(o.best.value)} W` : "—"],
    ["Weakest panel", o.weakest ? `${o.weakest.id} · ${Math.round(o.weakest.value)} W` : "—"],
    ["Best-to-weakest spread", `${Math.round(o.spread)} W`]
  ];
  return e.actionSurface("panel-health-card", d`
      ${Wa(e, String(e.config.panel_health_title || "Panel health"), "Solar panel output")}
      ${e.config.panel_show_summary !== !1 ? d`<div class="panel-health-summary">
        ${y.map(([f, k]) => d`
          <div class="panel-health-summary-row"><span>${f}</span><strong>${k}</strong></div>
        `)}
      </div>` : h}
      <div class=${`panel-health-status panel-health-status-${c}`} role="status">
        <ha-icon icon=${_}></ha-icon><span>${g}</span>
      </div>
      ${a.length && e.config.panel_show_gauges !== !1 ? d`
        <div class="panel-health-gauges">
          ${a.map((f) => {
    const k = zr(f.value, r), v = Er(f.value, n, i), z = 2 * Math.PI * 37, w = z * k / 100, D = ne({
      ...e.config,
      entity: f.entity.entity_id
    }, f.entity, e.hass) || f.id;
    return d`
              <button class="panel-health-gauge" type="button"
                aria-label=${`${D}: ${Math.round(f.value)} watts`}
                @click=${(U) => oe(U, e, { action: "more-info" }, f.entity.entity_id)}>
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="46" r="37" class="panel-health-gauge-track"></circle>
                  <circle cx="50" cy="46" r="37" class="panel-health-gauge-value"
                    style=${`--panel-gauge-color:${v};--panel-gauge-progress:${w};--panel-gauge-circumference:${z}`}
                    stroke-dasharray=${`${w} ${z}`}></circle>
                  <text x="50" y="51" text-anchor="middle" class="panel-health-gauge-value-label">
                    ${Math.round(f.value)}
                  </text>
                </svg>
                <span class="panel-health-gauge-name">${D}</span>
              </button>
            `;
  })}
        </div>
      ` : a.length ? h : d`
        <div class="energy-card-empty">
          Select panel sensors in the card editor, or add sensors with entity IDs beginning with sensor.inverter_4.
        </div>
      `}
  `);
}, An = (e) => {
  const t = B(e, "ulm_card_flower_entity") ?? e.entity, a = t?.state === "problem", o = (n) => ct.find((i) => i.key === n), r = Ta(e.config).flatMap((n) => {
    const i = o(n), l = M(t, n), s = typeof l == "object" && l !== null ? l : void 0, u = B(e, Na(n)), m = typeof s?.sensor == "string" ? s.sensor : typeof l == "string" && e.hass.states[l] ? l : void 0, g = u ?? (m ? e.hass.states[m] : void 0), _ = String(M(t, "device_class") ?? ""), c = t?.entity_id.startsWith("sensor.") && (_ === n || n === "moisture" && (!_ || _ === "humidity")), y = g ?? (c ? t : void 0), f = A(y?.state) ?? A(s?.current) ?? A(l);
    if (f === void 0) return [];
    const k = A(s?.min) ?? A(M(y, "min")) ?? i.min, v = A(s?.max) ?? A(M(y, "max")) ?? i.max, z = Math.max(0, Math.min(100, (f - k) / Math.max(1, v - k) * 100)), w = y ? S(y) : String(f);
    return [{ key: n, definition: i, sourceEntity: y, value: f, percent: z, display: w }];
  });
  return e.actionSurface("custom-plant", d`
    <button class="flower-heading" aria-label="Open plant details"
      @pointerdown=${(n) => n.stopPropagation()}
      @click=${(n) => oe(n, e, { action: "more-info" }, t?.entity_id)}>
      ${ee(e, a ? "mdi:alert-circle" : "mdi:flower", a ? "red" : "green")}
      ${H(e, a ? b(e, "ulm_custom_card_plant_problem") || "Problema" : b(e, "ulm_custom_card_plant_correct") || "Correto")}
    </button>
    ${r.length ? d`<div class="flower-bars">${r.map(({ key: n, definition: i, sourceEntity: l, percent: s, display: u }) => {
    const m = `${i.label}: ${u}`;
    return d`<span data-flower-bar=${n} title=${m} aria-label=${m}>
        <ha-icon .icon=${i.icon}></ha-icon>
        <i><em style=${`width:${s}%`}></em></i>
        ${l ? d`<output>${u}</output>` : h}
      </span>`;
  })}</div>` : h}
  `);
}, Cn = (e) => {
  const t = b(e, "ulm_custom_card_speedtest_round") === !0, a = (o, r, n, i, l, s, u, m, g) => {
    const _ = B(e, o) ?? B(e, r), c = A(_?.state), y = Math.max(1, b(e, u) ?? m), f = Math.max(0, Math.min(100, (c ?? 0) / y * 100)), k = c === void 0 ? "—" : g && t ? String(Math.round(c)) : _.state, v = _?.attributes.unit_of_measurement, z = Z(b(e, l), s);
    return d`
      <div class="speedtest-metric" style=${`--speedtest-color:${z};--speedtest-value:${f}`}>
        <svg class="speedtest-ring" viewBox="0 0 120 100" aria-hidden="true">
          <path class="speedtest-track" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
          <path class="speedtest-value" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
        </svg>
        <span class="speedtest-value-copy"><ha-icon .icon=${i}></ha-icon><b>${k}${v ? ` ${String(v)}` : ""}</b><small>${n}</small></span>
      </div>`;
  };
  return e.actionSurface("custom-speedtest-gauges", d`
    <div class="speedtest-three">
      ${a(
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
      ${a(
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
      ${a(
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
}, Pn = (e) => {
  const t = {
    en: { none: "None", very_low: "Very low", low: "Low", medium: "Medium", high: "High", very_high: "Very high", tree: "Trees", grass: "Grass", weed: "Weeds" },
    de: { none: "Keine", very_low: "Sehr niedrig", low: "Niedrig", medium: "Mittel", high: "Hoch", very_high: "Sehr hoch", tree: "Bäume", grass: "Gräser", weed: "Kräuter" },
    es: { none: "Ninguno", very_low: "Muy bajo", low: "Bajo", medium: "Medio", high: "Alto", very_high: "Muy alto", tree: "Árboles", grass: "Hierbas", weed: "Malezas" },
    nl: { none: "Geen", very_low: "Zeer laag", low: "Laag", medium: "Gemiddeld", high: "Hoog", very_high: "Extreem hoog", tree: "Bomen", grass: "Grassen", weed: "Kruiden" },
    pl: { none: "Brak", very_low: "Bardzo słabe", low: "Słabe", medium: "Średnie", high: "Wysokie", very_high: "Bardzo wysokie", tree: "Drzewa", grass: "Trawy", weed: "Zioła" }
  }, a = t[(e.hass.language ?? "en").split("-")[0]] ?? t.en, o = [
    {
      entity: j(e, "trees_entity"),
      name: b(e, "custom_card_pollen_tree_name"),
      icon: b(e, "custom_card_pollen_tree_icon"),
      kind: "tree",
      fallbackIcon: "mdi:tree"
    },
    {
      entity: j(e, "grass_entity"),
      name: b(e, "custom_card_pollen_grass_name"),
      icon: b(e, "custom_card_pollen_grass_icon"),
      kind: "grass",
      fallbackIcon: "mdi:grass"
    },
    {
      entity: j(e, "weeds_entity"),
      name: b(e, "custom_card_pollen_weed_name"),
      icon: b(e, "custom_card_pollen_weed_icon"),
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
      label: a[i] ?? a.none,
      color: l[i] ?? l.none,
      extreme: i === "very_high"
    };
  };
  return e.actionSurface("custom-pollen", d`
    <div class="pollen-heading">${dt(e)}</div>
    ${o.map((n) => {
    const i = r(n.entity?.state), l = n.name || n.entity?.attributes.friendly_name || a[n.kind], s = n.icon || n.entity?.attributes.icon || n.fallbackIcon;
    return d`<button class="pollen-item" style=${`--pollen:${i.color}`}
        ?disabled=${!n.entity}
        @pointerdown=${(u) => u.stopPropagation()}
        @click=${(u) => n.entity && oe(u, e, { action: "more-info" }, n.entity.entity_id)}>
        <span class="pollen-item-icon"><ha-icon .icon=${s}></ha-icon>
          ${i.extreme ? d`<span class="pollen-extreme"><ha-icon .icon=${"mdi:exclamation-thick"}></ha-icon></span>` : h}
        </span>
        <b>${l}</b><small>${n.entity ? i.label : "Entity unavailable"}</small>
      </button>`;
  })}
  `);
}, zn = (e) => {
  const t = ce.has(e.entity?.state ?? ""), a = "rgb(var(--rgb-blue, 33, 150, 243))";
  return e.actionSurface("ulm-row", d`
    ${Ce(e, Ye(e, "mdi:information-outline"), a, t)}
    ${ja(e)}
  `, `--source-color:${a}`);
}, En = (e) => {
  const t = Z(
    b(e, "ulm_card_graph_color"),
    "rgb(var(--rgb-red, 244, 67, 54))"
  ), a = Z(
    b(e, "ulm_card_graph_icon_color"),
    t
  );
  return e.actionSurface("ulm-default-graph", d`
    <div class="metric-heading">${Ce(e, Ye(e, "mdi:chart-line"), a, !0)}${ja(e)}</div>
    ${Ha(e, !0, e.entity, t)}
  `);
}, Vn = (e) => {
  switch (e.descriptor.upstreamId) {
    case "card_battery":
      return Wr(e);
    case "card_graph":
      return En(e);
    case "card_media_player":
      return ca(e);
    case "custom_card_trash":
      return nn(e);
    case "custom_card_alarm_time":
      return sn(e);
    case "custom_card_roomview":
      return ln(e);
    case "custom_card_room_overview":
      return dn(e);
    case "custom_card_welcome":
      return cn(e);
    case "custom_card_washer":
      return un(e);
    case "custom_card_sun":
      return _n(e);
    case "custom_card_input_datetime":
      return mn(e);
    case "custom_card_entity_overview":
      return pn(e);
    case "custom_card_internet_speed":
      return hn(e);
    case "custom_card_weather_metrics":
      return gn(e);
    case "custom_card_media_player_sonos":
      return yn(e);
    case "custom_card_more_power_outlet":
      return bn(e);
    case "custom_card_gauge":
      return fn(e);
    case "custom_card_printer":
      return vn(e);
    case "custom_card_nas_metrics":
      return wn(e);
    case "custom_card_tablet":
      return $n(e);
    case "custom_card_playstation":
      return xn(e);
    case "custom_card_entity_carousel":
      return Sn(e);
    case "advanced_home_energy_management":
      return kn(e);
    case "advanced_energy_buy_sell":
      return Mn(e);
    case "advanced_energy_panel_health":
      return In(e);
    case "custom_card_plant":
      return An(e);
    case "custom_card_speedtest_gauges":
      return Cn(e);
    case "custom_card_pollen":
      return Pn(e);
    case "card_room":
      return Qr(e);
  }
  if (/trash/.test(e.descriptor.upstreamId)) return tn(e);
  if (/printer/.test(e.descriptor.upstreamId)) return an(e);
  if (/gauge/.test(e.descriptor.upstreamId)) return on(e);
  if (/plant|entity_overview/.test(e.descriptor.upstreamId))
    return en(e, /plant/.test(e.descriptor.upstreamId) ? "mdi:flower" : "mdi:view-grid", "purple");
  switch (e.descriptor.family) {
    case "scene":
      return Kr(e);
    case "battery":
      return Hr(e);
    case "bar":
      return Rr(e);
    case "energy":
    case "sensor":
      return Ur(e);
    case "media":
      return ca(e);
    case "security":
      return Yr(e);
    case "navigation":
      return Xr(e);
    case "control":
      return Zr(e);
    case "alarm-time":
      return rn(e);
    default:
      return zn(e);
  }
};
var Dn = Object.defineProperty, Ot = (e, t, a, o) => {
  for (var r = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = i(t, a, r) || r);
  return r && Dn(t, a, r), r;
};
const Tt = class Tt extends fe {
  constructor() {
    super(...arguments), this.holdFired = !1, this.forecastGeneration = 0, this.forecast = [], this.sceneOverflowExpanded = !1, this.actionSurface = (t, a, o = "") => {
      const r = this.descriptor ? zt.get(this.descriptor.upstreamId) : void 0, n = this.descriptor?.sourcePath.startsWith("src/") ?? !1;
      if (!r && !n)
        throw new Error(`Missing explicit parity renderer mapping for ${this.descriptor?.upstreamId}`);
      const i = r ? ` parity-${r.rendererId.replaceAll("_", "-")}` : "", l = this.config?.layout && this.config.layout !== "default" ? ` layout-${this.config.layout}` : "", s = this.config?.multiline_secondary ? " multiline-secondary" : "", u = this.config?.fill_container ? " fill-container" : "", m = this.config?.variant ? ` variant-${this.config.variant}` : "", g = d`
      <div class="${t}${i}${l}${s}${u}${m} action-surface" style=${o} role="button" tabindex="0"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        ${a}
      </div>`;
      return d`<ha-card class="mushroom-addition-card">${g}</ha-card>`;
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
    const a = Vo(t), o = this.forecastKey(this.config);
    this.config = a, this.sceneOverflowExpanded = !1, o !== this.forecastKey(a) && this.stopForecastSubscription(), this.scheduleEnergyBuySellRefresh(), this.requestUpdate(), this.subscribeForecast();
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
    if (!this.config || !this.descriptor) return h;
    if (!this.hass) return d`<ha-card><div class="preview">Mushroom Addition preview</div></ha-card>`;
    const t = this.config.entity ? this.hass.states[this.config.entity] : void 0, a = { rendered: !1 }, o = {
      config: this.config,
      descriptor: this.descriptor,
      hass: this.hass,
      entity: t,
      forecast: this.forecast,
      presentation: a,
      sceneOverflowExpanded: this.sceneOverflowExpanded,
      toggleSceneOverflow: () => {
        this.sceneOverflowExpanded = !this.sceneOverflowExpanded;
      },
      actionSurface: (r, n, i) => this.actionSurface(
        r,
        a.rendered ? n : d`${Br(o)}${n}`,
        i
      ),
      service: (r, n, i) => {
        this.hass?.callService(r, n, i);
      }
    };
    return Vn(o);
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
    const t = Number(this.config?.buy_sell_update_interval), a = Number.isFinite(t) && t > 0 ? Math.max(1, Math.min(120, t)) : 5;
    this.energyBuySellTimer = window.setInterval(() => this.requestUpdate(), a * 6e4);
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
    const a = this.forecastGeneration;
    try {
      const o = await this.hass.connection.subscribeMessage((r) => {
        a !== this.forecastGeneration || t !== this.forecastSubscriptionKey || (this.forecast = r.forecast ?? [], this.requestUpdate());
      }, {
        type: "weather/subscribe_forecast",
        entity_id: this.config.entity,
        forecast_type: "daily"
      });
      a !== this.forecastGeneration || t !== this.forecastSubscriptionKey ? o() : this.unsubscribeForecast = o;
    } catch (o) {
      a === this.forecastGeneration && (this.forecastSubscriptionKey = void 0), console.warn("Mushroom Cards Addition: unable to load weather forecast", o);
    }
  }
  runAction(t) {
    if (!this.hass || !this.config) return;
    const a = t === "tap_action" ? "tap" : t === "hold_action" ? "hold" : "double_tap", o = this.config[t], r = typeof o?.entity == "string" ? o.entity : void 0;
    Eo(this, r ? { ...this.config, entity: r } : this.config, a);
  }
};
Tt.styles = yr;
let Me = Tt;
Ot([
  Ie({ attribute: !1 })
], Me.prototype, "hass");
Ot([
  Ie({ attribute: !1 })
], Me.prototype, "config");
Ot([
  me()
], Me.prototype, "sceneOverflowExpanded");
var On = Object.defineProperty, Xe = (e, t, a, o) => {
  for (var r = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = i(t, a, r) || r);
  return r && On(t, a, r), r;
};
const je = [
  "var(--accent-color, #03a9f4)",
  "#ff9800",
  "#4caf50",
  "#9c27b0",
  "#f44336",
  "#00bcd4"
], ft = (e) => {
  const a = (Array.isArray(e.entities) ? e.entities : []).map((o) => typeof o == "string" ? { entity: o } : { ...o });
  return !a.length && e.entity && a.push({ entity: e.entity }), a.filter((o) => !!o.entity);
}, Ra = (e) => ({
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
}), ma = (e) => {
  const t = ft(e);
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
    show: Ra(e.show),
    animate: e.animate ?? !1,
    height: e.height ?? 150,
    bar_spacing: e.bar_spacing ?? 4,
    line_width: e.line_width ?? 5,
    line_color: e.line_color ?? je[0],
    color_thresholds: tt(e.color_thresholds ?? []),
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
}, tt = (e) => {
  const t = e.map((o) => typeof o == "string" ? { color: o } : { ...o });
  let a = -1;
  for (let o = 0; o < t.length; o += 1)
    if (t[o].value !== void 0) {
      if (a >= 0 && o - a > 1) {
        const r = t[a].value, n = t[o].value;
        for (let i = a + 1; i < o; i += 1)
          t[i].value = r + (n - r) * (i - a) / (o - a);
      }
      a = o;
    }
  return t.filter((o) => o.value !== void 0 && !!o.color);
}, Ze = (e, t) => t ? t.split(".").reduce((a, o) => {
  if (!(!a || typeof a != "object"))
    return a[o];
}, e?.attributes) : e?.state, Qe = (e, t) => {
  const a = String(e ?? ""), o = t.findIndex((n) => n.value === a);
  if (o >= 0)
    return {
      value: o,
      label: t[o].label ?? t[o].value
    };
  const r = Number(e);
  return Number.isFinite(r) ? { value: r } : {};
}, Ua = (e, t) => {
  if (!e.length) return Number.NaN;
  switch (t) {
    case "median": {
      const a = [...e].sort((r, n) => r - n), o = Math.floor(a.length / 2);
      return a.length % 2 ? a[o] : (a[o - 1] + a[o]) / 2;
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
      return e.reduce((a, o) => a + o, 0);
    case "delta":
      return Math.max(...e) - Math.min(...e);
    case "diff":
      return e.at(-1) - e[0];
    default:
      return e.reduce((a, o) => a + o, 0) / e.length;
  }
}, Tn = (e, t, a, o = Date.now()) => {
  if (!e.length) return [];
  const r = Math.max(1, Number(t.hours_to_show ?? 24)), n = Math.max(0.01, Number(t.points_per_hour ?? 0.5)), i = o - r * 36e5, l = 36e5 / n, s = /* @__PURE__ */ new Map();
  for (const u of e) {
    if (u.time < i || u.time > o || !Number.isFinite(u.value)) continue;
    const m = new Date(u.time), g = t.group_by === "date" ? `${m.getFullYear()}-${m.getMonth()}-${m.getDate()}` : t.group_by === "hour" ? `${m.getFullYear()}-${m.getMonth()}-${m.getDate()}-${m.getHours()}` : String(Math.floor((u.time - i) / l));
    s.set(g, [...s.get(g) ?? [], u]);
  }
  return [...s.values()].map((u) => ({
    time: u.at(-1).time,
    value: Ua(u.map((m) => m.value), a),
    label: u.at(-1)?.label
  })).sort((u, m) => u.time - m.time);
}, pa = (e) => {
  if (typeof e == "number" && Number.isFinite(e)) return { value: e, soft: !1 };
  if (typeof e != "string") return { soft: !1 };
  const t = e.trim().startsWith("~"), a = Number(e.replace(/^~/, ""));
  return { value: Number.isFinite(a) ? a : void 0, soft: t };
}, ha = (e, t, a, o = 0) => {
  let r = e.length ? Math.min(...e) : 0, n = e.length ? Math.max(...e) : 1;
  const i = pa(t), l = pa(a);
  if (i.value !== void 0 && (r = i.soft ? Math.min(r, i.value) : i.value), l.value !== void 0 && (n = l.soft ? Math.max(n, l.value) : l.value), n <= r) {
    const s = Math.max(1, Math.abs(r) * 0.05), u = i.value !== void 0 && !i.soft && l.value === void 0, m = l.value !== void 0 && !l.soft && i.value === void 0;
    u ? n = r + s * 2 : m ? r = n - s * 2 : (r -= s, n += s);
  }
  if (n - r < o) {
    const s = (r + n) / 2;
    r = s - o / 2, n = s + o / 2;
  }
  return { min: r, max: n };
}, ga = (e, t, a) => {
  let o = a;
  for (const r of t)
    r.value !== void 0 && e >= r.value && (o = r.color);
  return o;
}, Nn = (e, t) => Number.isFinite(e) ? e.toLocaleString(void 0, {
  minimumFractionDigits: t,
  maximumFractionDigits: t ?? 2
}) : "Unavailable", Ln = (e, t) => {
  if (!e.length) return "";
  if (!t || e.length < 3)
    return e.map((o, r) => `${r ? "L" : "M"} ${o.x} ${o.y}`).join(" ");
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let o = 1; o < e.length; o += 1) {
    const r = e[o - 1], n = e[o], i = (r.x + n.x) / 2;
    a += ` C ${i} ${r.y}, ${i} ${n.y}, ${n.x} ${n.y}`;
  }
  return a;
}, Fn = (e, t) => {
  if (typeof e == "number" && Number.isFinite(e))
    return e < 1e10 ? e * 1e3 : e;
  const a = Date.parse(String(e ?? ""));
  return Number.isFinite(a) ? a : t;
}, Bn = (e, t) => {
  const a = /* @__PURE__ */ new Map();
  if (Array.isArray(e))
    return e.forEach((o, r) => {
      if (!Array.isArray(o)) return;
      const n = o.find((l) => l && typeof l == "object"), i = typeof n?.entity_id == "string" ? n.entity_id : typeof n?.e == "string" ? n.e : t[r]?.entity;
      i && a.set(i, o);
    }), a;
  if (!e || typeof e != "object") return a;
  for (const [o, r] of Object.entries(e))
    Array.isArray(r) && a.set(o, r);
  return a;
}, Nt = class Nt extends fe {
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
      const a = this.config?.double_tap_action;
      if (a?.action && a.action !== "none") {
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
  static getStubConfig(t, a = [], o = []) {
    const r = [...a, ...o, ...Object.keys(t?.states ?? {})], n = r.find((i) => (i.startsWith("sensor.") || i.startsWith("binary_sensor.")) && !["unknown", "unavailable"].includes(t?.states[i]?.state ?? "")) ?? r.find((i) => i.startsWith("sensor.") || i.startsWith("binary_sensor.")) ?? "sensor.example";
    return ma({
      type: "custom:mushroom-addition-mini-graph-card",
      entity: n,
      entities: [{ entity: n }],
      name: t?.states[n]?.attributes.friendly_name,
      show: { graph: "line", fill: !0, points: "hover", labels: "hover" }
    });
  }
  setConfig(t) {
    this.config = ma(t), this.restartInterval(), this.requestKey = void 0, this.lastEntityStateSignature = this.entityStateSignature(), this.loadHistory();
  }
  getCardSize() {
    return Math.max(1, Math.ceil((Number(this.config?.height ?? 150) + 110) / 50));
  }
  updated(t) {
    if (!t.has("hass") && !t.has("config")) return;
    const a = this.entityStateSignature(), o = t.has("hass") && this.lastEntityStateSignature !== void 0 && a !== this.lastEntityStateSignature;
    this.lastEntityStateSignature = a, !(o && this.config?.update_interval) && this.loadHistory(o);
  }
  connectedCallback() {
    super.connectedCallback(), this.restartInterval();
  }
  disconnectedCallback() {
    this.interval && window.clearInterval(this.interval), super.disconnectedCallback();
  }
  render() {
    if (!this.config) return h;
    if (!this.hass) return d`<ha-card><div class="loading">Mini Graph preview</div></ha-card>`;
    const t = Ra(this.config.show), a = this.series[0], o = a ? ga(
      Number(a.state),
      tt(this.config.color_thresholds ?? []),
      a.color
    ) : je[0], r = [
      this.config.group ? "group" : "",
      t.points === "hover" ? "points-hover" : "",
      t.labels === "hover" || t.labels_secondary === "hover" ? "labels-hover" : ""
    ].filter(Boolean).join(" ");
    return d`
      <ha-card class=${r} tabindex="0" role="button"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        <div class="content ${this.config.animate ? "animate" : ""}"
          style=${`--mini-graph-font-size:${this.config.font_size ?? 100}`}>
          ${this.renderHeader(a, o, t)}
          ${this.renderStates(a, o, t)}
          ${this.loading && t.loading_indicator ? d`<div class="loading"><ha-spinner size="small"></ha-spinner></div>` : this.error ? d`<div class="warning">${this.error}</div>` : this.renderGraph(t)}
          ${this.renderLegend(t)}
          ${this.renderStatistics(t)}
        </div>
      </ha-card>
    `;
  }
  renderHeader(t, a, o) {
    if (!o.name && (!o.icon || this.config?.align_icon === "state")) return h;
    const r = o.icon && this.config?.icon_type !== "none" && this.config?.align_icon !== "state" ? this.renderIcon(t, a, o) : h, n = this.presentation(t);
    return d`
      <div class="header" data-align=${this.config?.align_header ?? "default"}
        style=${`font-size:${this.config?.font_size_header ?? 14}px`}>
        ${this.config?.align_icon === "left" ? r : h}
        ${o.name ? d`
          <span class="name shared-presentation" style=${o.name_adaptive_color ? `color:${a}` : ""}>
            ${n.primary ? d`<span class="ulm-name">${n.primary}</span>` : h}
            ${n.secondary ? d`<span class="ulm-label">${n.secondary}</span>` : h}
          </span>
        ` : h}
        ${this.config?.align_icon !== "left" ? r : h}
      </div>
    `;
  }
  renderIcon(t, a, o) {
    const r = t ? this.hass?.states[t.config.entity] : void 0, n = this.config?.icon_type === "entity-picture" ? r?.attributes.entity_picture : void 0;
    return d`
      <span class="icon" style=${o.icon_adaptive_color ? `color:${a}` : ""}>
        ${this.config?.icon_image ? d`<img src=${this.config.icon_image} alt="">` : n ? d`<img src=${String(n)} alt="">` : d`<ha-icon .icon=${this.config?.icon ?? this.hass?.states[t?.config.entity ?? ""]?.attributes.icon ?? "mdi:chart-line"}></ha-icon>`}
      </span>
    `;
  }
  renderStates(t, a, o) {
    if (!o.state || !t) return h;
    const r = o.state === "last" ? t.points.at(-1)?.value : t.state, n = Number(r), i = this.stateLabel(n, t.points.at(-1)?.label);
    return d`
      <div class="states" data-align=${this.config?.align_state ?? "left"}>
        ${this.renderState(t, i, a, !0)}
        ${this.series.slice(1).filter((l) => l.config.show_state).map((l) => this.renderState(
      l,
      this.stateLabel(Number(l.state), l.points.at(-1)?.label),
      ga(Number(l.state), tt(this.config?.color_thresholds ?? []), l.color),
      !1
    ))}
        ${o.icon && this.config?.icon_type !== "none" && this.config?.align_icon === "state" ? this.renderIcon(t, a, o) : h}
      </div>
    `;
  }
  presentation(t) {
    if (!this.config) return {};
    const a = t?.config.entity ?? this.config.entity, o = a ? this.hass?.states[a] : void 0, r = ne(this.config, o, this.hass), n = S(o), i = (l) => {
      switch (l) {
        case "none":
          return;
        case "state":
          return n;
        case "last-changed":
          return o?.last_changed ? new Date(o.last_changed).toLocaleString() : "Last changed unavailable";
        case "last-updated":
          return o?.last_updated ? new Date(o.last_updated).toLocaleString() : "Last updated unavailable";
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
  renderState(t, a, o, r) {
    const n = t.config.state_adaptive_color ? o : "";
    return d`
      <span class="state ${r ? "primary" : "secondary"}" style=${n ? `color:${n}` : ""}>
        ${t.config.show_indicator ? d`<span class="indicator" style=${`background:${o}`}></span>` : h}
        <span class="state-value">${a}</span>
        <span class="unit">${t.unit}</span>
      </span>
    `;
  }
  renderGraph(t) {
    if (!t.graph || !this.series.some((_) => _.config.show_graph !== !1)) return h;
    const a = this.series.filter((_) => _.config.show_graph !== !1 && _.points.length), o = a.filter((_) => _.config.y_axis !== "secondary"), r = a.filter((_) => _.config.y_axis === "secondary"), n = o.flatMap((_) => _.points.map((c) => c.value)), i = r.flatMap((_) => _.points.map((c) => c.value));
    t.graph === "bar" && this.config?.lower_bound === void 0 && n.push(0), t.graph === "bar" && this.config?.lower_bound_secondary === void 0 && i.push(0);
    const l = ha(
      n,
      this.config?.lower_bound,
      this.config?.upper_bound,
      Number(this.config?.min_bound_range ?? 0)
    ), s = ha(
      i,
      this.config?.lower_bound_secondary,
      this.config?.upper_bound_secondary,
      Number(this.config?.min_bound_range_secondary ?? 0)
    ), u = a.flatMap((_) => _.points.map((c) => c.time)), m = Math.min(...u), g = Math.max(...u);
    return d`
      <div class="graph" style=${`height:${this.config?.height ?? 150}px`}>
        ${t.labels && o.length ? d`
          <div class="labels">
            <span>${this.stateLabel(l.max)}</span>
            <span>${this.stateLabel(l.min)}</span>
          </div>` : h}
        ${t.labels_secondary && r.length ? d`
          <div class="labels secondary">
            <span>${this.stateLabel(s.max)}</span>
            <span>${this.stateLabel(s.min)}</span>
          </div>` : h}
        <svg class="chart" viewBox="0 0 500 ${this.config?.height ?? 150}" preserveAspectRatio="none"
          @click=${(_) => _.stopPropagation()}>
          <defs>
            ${a.map((_, c) => this.renderGradient(_, c, _.config.y_axis === "secondary" ? s : l))}
          </defs>
          ${a.map((_, c) => this.renderSeries(
      _,
      c,
      _.config.y_axis === "secondary" ? s : l,
      m,
      g,
      t,
      a.length
    ))}
        </svg>
      </div>
    `;
  }
  renderGradient(t, a, o) {
    const r = tt(this.config?.color_thresholds ?? []), n = this.config?.color_thresholds_transition ?? "smooth";
    if (!r.length || t.config.color)
      return W`<linearGradient id=${`mini-graph-${a}`}><stop offset="0%" stop-color=${t.color}/><stop offset="100%" stop-color=${t.color}/></linearGradient>`;
    const i = r.flatMap((l, s) => {
      const u = Math.max(0, Math.min(100, 100 - ((l.value ?? o.min) - o.min) / (o.max - o.min) * 100));
      return n === "hard" && s > 0 ? [
        W`<stop offset=${`${u}%`} stop-color=${r[s - 1].color}/>`,
        W`<stop offset=${`${u}%`} stop-color=${l.color}/>`
      ] : [W`<stop offset=${`${u}%`} stop-color=${l.color}/>`];
    });
    return W`<linearGradient id=${`mini-graph-${a}`} x1="0" y1="1" x2="0" y2="0">${i}</linearGradient>`;
  }
  renderSeries(t, a, o, r, n, i, l) {
    const s = Number(this.config?.height ?? 150), u = (k) => {
      const v = this.config?.logarithmic ? Math.log10(Math.max(k, Number.EPSILON)) : k, z = this.config?.logarithmic ? Math.log10(Math.max(o.min, Number.EPSILON)) : o.min, w = this.config?.logarithmic ? Math.log10(Math.max(o.max, Number.EPSILON)) : o.max;
      return s - (v - z) / Math.max(Number.EPSILON, w - z) * s;
    }, m = r === n, g = t.points.map((k) => ({
      x: m ? 250 : (k.time - r) / Math.max(1, n - r) * 500,
      y: u(k.value),
      value: k.value,
      time: k.time
    })), _ = t.config.color ? t.color : `url(#mini-graph-${a})`;
    if (i.graph === "bar") {
      const k = 500 / Math.max(1, Math.min(96, g.length)), v = Number(this.config?.bar_spacing ?? 4), z = Math.max(1, (k - v) / l), w = Math.max(0, Math.min(s, u(0)));
      return W`
        <g class="series">
          ${g.slice(-96).map((D, U) => {
        const K = U * k + a * z + v / 2, Y = Math.min(D.y, w);
        return W`<rect x=${K} y=${Y} width=${z} height=${Math.abs(w - D.y)} rx="1" fill=${_}>
              <title>${this.tooltip(t, D.value, D.time)}</title>
            </rect>`;
      })}
        </g>
      `;
    }
    const c = g.length === 1 ? [{ ...g[0], x: 0 }, { ...g[0], x: 500 }] : g, y = Ln(c, t.config.smoothing ?? this.config?.smoothing ?? !0), f = g.length ? `${y} L ${c.at(-1).x} ${s} L ${c[0].x} ${s} Z` : "";
    return W`
      <g class="series">
        ${i.fill && t.config.show_fill !== !1 ? W`<path class="fill ${i.fill === "fade" ? "fade" : ""}" d=${f} fill=${_}/>` : h}
        ${t.config.show_line !== !1 ? W`<path class="line" d=${y} stroke=${_} stroke-width=${this.config?.line_width ?? 5}/>` : h}
        ${i.points && t.config.show_points !== !1 ? g.map((k) => W`
            <circle class="point" cx=${k.x} cy=${k.y} r=${Math.max(2, Number(this.config?.line_width ?? 5) / 1.5)}
              fill=${t.config.color ?? _}>
              <title>${this.tooltip(t, k.value, k.time)}</title>
            </circle>`) : h}
      </g>
    `;
  }
  renderLegend(t) {
    const a = this.series.filter((o) => o.config.show_legend !== !1);
    return !t.legend || a.length < 2 ? h : d`
      <div class="legend">
        ${a.map((o) => d`
          <span class="legend-item">
            <span class="indicator" style=${`background:${o.color}`}></span>
            <span>${o.name}${o.config.show_legend_state ? ` (${this.stateLabel(Number(o.state))}${o.unit ? ` ${o.unit}` : ""})` : ""}</span>
          </span>
        `)}
      </div>
    `;
  }
  renderStatistics(t) {
    const a = this.series[0];
    if (!a || !t.average && !t.extrema || !a.points.length) return h;
    const o = a.points.map((l) => l.value), r = Ua(o, "avg"), n = Math.min(...o), i = Math.max(...o);
    return d`
      <div class="statistics">
        ${t.average ? d`<span>Average <b>${this.stateLabel(r)} ${a.unit}</b></span>` : h}
        ${t.extrema ? d`
          <span>Minimum <b>${this.stateLabel(n)} ${a.unit}</b></span>
          <span>Maximum <b>${this.stateLabel(i)} ${a.unit}</b></span>
        ` : h}
      </div>
    `;
  }
  stateLabel(t, a) {
    if (a) return a;
    const o = this.config?.state_map?.[Math.round(t)];
    return o && Math.abs(t - Math.round(t)) < Number.EPSILON ? o.label ?? o.value : Nn(t, this.config?.decimals);
  }
  tooltip(t, a, o) {
    const r = new Date(o).toLocaleString(this.hass?.language, {
      hour12: !(this.config?.hour24 ?? !1)
    });
    return `${t.name}: ${this.stateLabel(a)}${t.unit ? ` ${t.unit}` : ""} · ${r}`;
  }
  restartInterval() {
    this.interval && window.clearInterval(this.interval), this.interval = void 0, !(!this.isConnected || !this.config?.update_interval) && (this.interval = window.setInterval(() => {
      this.loadHistory(!0);
    }, this.config.update_interval * 1e3));
  }
  entityStateSignature() {
    if (!(!this.hass || !this.config))
      return JSON.stringify(ft(this.config).map((t) => {
        const a = this.hass?.states[t.entity];
        return {
          entity: t.entity,
          attribute: t.attribute,
          value: Ze(a, t.attribute),
          lastChanged: a?.last_changed,
          lastUpdated: a?.last_updated
        };
      }));
  }
  singleEntityStateSignature(t) {
    const a = this.hass?.states[t.entity];
    return JSON.stringify({
      value: Ze(a, t.attribute),
      lastChanged: a?.last_changed,
      lastUpdated: a?.last_updated
    });
  }
  async loadHistory(t = !1) {
    if (!this.hass || !this.config) return;
    const a = ft(this.config), o = JSON.stringify({
      entities: a,
      hours: this.config.hours_to_show,
      points: this.config.points_per_hour,
      grouping: this.config.group_by,
      factor: this.config.value_factor,
      map: this.config.state_map,
      state: this.entityStateSignature()
    });
    if (!t && o === this.requestKey) return;
    this.requestKey = o;
    const r = ++this.historyGeneration;
    this.loading = !0, this.error = void 0;
    try {
      const n = Date.now(), i = n - Number(this.config.hours_to_show ?? 24) * 36e5, l = await this.fetchHistory(a, i, n, t, r);
      if (r !== this.historyGeneration) return;
      this.series = a.map((s, u) => this.buildSeries(s, u, l[s.entity] ?? [], i, n)), this.error = this.series.some((s) => s.points.length) ? void 0 : "No recorder history is available for the selected entities.";
    } catch (n) {
      if (r !== this.historyGeneration) return;
      this.error = n instanceof Error ? n.message : "Unable to load recorder history.", console.warn("Mushroom Cards Addition: unable to load Mini Graph history", n);
    } finally {
      r === this.historyGeneration && (this.loading = !1);
    }
  }
  async fetchHistory(t, a, o, r, n) {
    const i = {}, l = [];
    for (const m of t) {
      if (m.fixed_value) continue;
      const g = r ? void 0 : this.readCache(m, a);
      g ? i[m.entity] = g : l.push(m);
    }
    if (!l.length) return i;
    if (!this.hass?.connection?.sendMessagePromise) {
      for (const m of l) i[m.entity] = this.attributeHistory(m);
      return i;
    }
    const s = await this.hass.connection.sendMessagePromise({
      type: "history/history_during_period",
      start_time: new Date(a).toISOString(),
      end_time: new Date(o).toISOString(),
      entity_ids: [...new Set(l.map((m) => m.entity))],
      no_attributes: !1,
      minimal_response: !1,
      significant_changes_only: !1
    }), u = Bn(s, l);
    if (n !== this.historyGeneration) return i;
    for (const m of l) {
      const _ = (u.get(m.entity) ?? []).flatMap((c) => {
        if (!c || typeof c != "object") return [];
        const y = c, f = y.state ?? y.s, k = y.attributes ?? y.a ?? {}, v = m.attribute ? m.attribute.split(".").reduce((D, U) => D && typeof D == "object" ? D[U] : void 0, k) : f, z = Qe(v, this.config?.state_map ?? []), w = Fn(
          y.last_updated ?? y.last_changed ?? y.lu ?? y.lc,
          o
        );
        return z.value === void 0 || !Number.isFinite(w) ? [] : [{ time: w, value: z.value, label: z.label }];
      });
      i[m.entity] = _.length ? _ : this.attributeHistory(m), this.writeCache(m, i[m.entity]);
    }
    return i;
  }
  attributeHistory(t) {
    const a = this.hass?.states[t.entity], o = a?.attributes.history;
    if (Array.isArray(o)) {
      const n = Date.now();
      return o.flatMap((i, l) => {
        const s = typeof i == "object" && i ? i.value ?? i.state : i, u = Qe(s, this.config?.state_map ?? []), m = typeof i == "object" && i ? Date.parse(String(i.time ?? i.last_changed ?? "")) : Number.NaN;
        return u.value === void 0 ? [] : [{
          time: Number.isFinite(m) ? m : n - (o.length - l - 1) * 36e5 / Number(this.config?.points_per_hour ?? 0.5),
          value: u.value,
          label: u.label
        }];
      });
    }
    const r = Qe(Ze(a, t.attribute), this.config?.state_map ?? []);
    return r.value === void 0 ? [] : [{ time: Date.now(), value: r.value, label: r.label }];
  }
  buildSeries(t, a, o, r, n) {
    const i = this.hass?.states[t.entity], l = Qe(Ze(i, t.attribute), this.config?.state_map ?? []), s = 10 ** Number(this.config?.value_factor ?? 0), u = Date.parse(i?.last_updated ?? i?.last_changed ?? "") || n, m = l.value === void 0 ? o : [
      ...o.filter((f) => f.time !== u),
      { time: u, value: l.value, label: l.label }
    ], _ = (t.fixed_value && l.value !== void 0 ? [{ time: r, value: l.value }, { time: n, value: l.value }] : m).map((f) => ({ ...f, value: f.value * s })), c = Tn(
      _,
      this.config ?? {},
      t.aggregate_func ?? this.config?.aggregate_func ?? "avg",
      n
    ), y = Array.isArray(this.config?.line_color) ? this.config.line_color : [this.config?.line_color ?? je[0]];
    return {
      config: t,
      points: c,
      color: t.color ?? y[a] ?? je[a % je.length],
      state: l.value === void 0 ? i?.state : l.value * s,
      unit: t.unit ?? this.config?.unit ?? String(i?.attributes.unit_of_measurement ?? ""),
      name: t.name ?? String(i?.attributes.friendly_name ?? t.entity)
    };
  }
  cacheKey(t) {
    return `mushroom-mini-graph:${t.entity}:${t.attribute ?? "state"}:${this.config?.hours_to_show}:${this.config?.points_per_hour}`;
  }
  readCache(t, a) {
    if (!(!this.config?.cache || typeof localStorage > "u"))
      try {
        const o = JSON.parse(localStorage.getItem(this.cacheKey(t)) ?? "null"), r = Math.max(60, Number(this.config.update_interval ?? 300)) * 1e3;
        return !o || o.stateSignature !== this.singleEntityStateSignature(t) || Date.now() - o.fetchedAt > r ? void 0 : o.points.filter((n) => n.time >= a);
      } catch {
        return;
      }
  }
  writeCache(t, a) {
    if (!(!this.config?.cache || typeof localStorage > "u"))
      try {
        localStorage.setItem(this.cacheKey(t), JSON.stringify({
          fetchedAt: Date.now(),
          stateSignature: this.singleEntityStateSignature(t),
          points: a
        }));
      } catch (o) {
        console.warn("Mushroom Cards Addition: unable to cache Mini Graph history", o);
      }
  }
  runAction(t) {
    if (!this.config) return;
    const a = t === "tap_action" ? "tap" : t === "hold_action" ? "hold" : "double_tap", o = this.config[t], r = typeof o?.entity == "string" ? o.entity : this.config.entity;
    le(this, "hass-action", {
      config: { ...this.config, entity: r },
      action: a
    });
  }
};
Nt.styles = rt`
    :host { display: block; min-width: 0; }
    ha-card {
      position: relative;
      display: block;
      overflow: hidden;
      border: 0;
      border-radius: var(--mush-card-primary-border-radius, 14px);
      background: var(--ha-card-background, var(--card-background-color, #fff));
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,.08));
      color: var(--primary-text-color);
      cursor: pointer;
    }
    ha-card.group { border-radius: 0; box-shadow: none; background: transparent; }
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
let ve = Nt;
Xe([
  Ie({ attribute: !1 })
], ve.prototype, "hass");
Xe([
  me()
], ve.prototype, "config");
Xe([
  me()
], ve.prototype, "series");
Xe([
  me()
], ve.prototype, "loading");
Xe([
  me()
], ve.prototype, "error");
const Gn = (e, t, a = [], o = []) => {
  const r = [...a, ...o, ...Object.keys(t?.states ?? {})], n = [...new Set(r)].filter((l) => t?.states?.[l] !== void 0), i = n.filter((l) => !["unavailable", "unknown"].includes(t?.states?.[l]?.state.toLowerCase() ?? ""));
  for (const l of e.preferredDomains ?? []) {
    const s = i.find((u) => u.startsWith(`${l}.`)) ?? n.find((u) => u.startsWith(`${l}.`));
    if (s) return s;
  }
  return i[0] ?? n[0];
}, jn = (e) => e.name.replace(/ (Card|Chip)$/, ""), qa = (e, t, a = [], o = []) => {
  const r = [.../* @__PURE__ */ new Set([...a, ...o, ...Object.keys(t?.states ?? {})])].filter(($) => t?.states?.[$] !== void 0), n = ($) => {
    const O = t?.states[$];
    return [
      $,
      O?.attributes.friendly_name,
      O?.attributes.device_class,
      O?.attributes.unit_of_measurement
    ].filter(Boolean).join(" ").toLowerCase();
  }, i = ($) => [
    ...$.filter((O) => !["unavailable", "unknown"].includes(t?.states[O]?.state.toLowerCase() ?? "")),
    ...$.filter((O) => ["unavailable", "unknown"].includes(t?.states[O]?.state.toLowerCase() ?? ""))
  ], l = ($) => !["unavailable", "unknown"].includes(t?.states[$]?.state.toLowerCase() ?? ""), s = ($, O) => i(r.filter((X) => $.some((x) => X.startsWith(`${x}.`)) && O.every((x) => n(X).includes(x))))[0], u = ($, O, X) => i(r.filter((x) => $.some((N) => x.startsWith(`${N}.`)) && O.every((N) => n(x).includes(N)) && X.every((N) => !n(x).includes(N))))[0], m = ($, O, X = []) => r.find((x) => l(x) && $.some((N) => x.startsWith(`${N}.`)) && O.every((N) => n(x).split(/[^a-z0-9]+/).includes(N)) && X.every((N) => !n(x).includes(N))), g = ($, O = [], X = []) => i(r.filter((x) => {
    const N = t?.states[x], I = n(x);
    return x.startsWith("sensor.") && $.includes(String(N?.attributes.device_class ?? "")) && O.every((L) => I.includes(L)) && X.every((L) => !I.includes(L));
  }))[0], _ = r.filter(($) => /^sensor\.inverter_4/i.test($)).sort(($, O) => $.localeCompare(O, void 0, { numeric: !0 })), c = ($, O = [], X = []) => r.find((x) => {
    const N = t?.states[x], I = n(x);
    return l(x) && x.startsWith("sensor.") && $.includes(String(N?.attributes.device_class ?? "")) && O.every((L) => I.includes(L)) && X.every((L) => !I.includes(L));
  }), y = r.filter(($) => $.startsWith("media_player.") && n($).includes("sonos")).sort(($, O) => aa(t, O) - aa(t, $))[0], f = e.upstreamId === "advanced_home_energy_management" ? s(["sensor"], ["hems", "house", "consumption"]) ?? s(["sensor"], ["house", "consumption"]) ?? g(["power"]) : e.upstreamId === "advanced_energy_buy_sell" ? s(["sensor"], ["hems", "price", "overview"]) ?? s(["sensor"], ["price", "overview"]) ?? s(["sensor"], ["hems", "price"]) : e.upstreamId === "advanced_energy_panel_health" ? _[0] : e.upstreamId === "mini_graph_card" ? g(["temperature"]) ?? g(["power", "energy"]) ?? s(["sensor"], []) : e.upstreamId === "card_graph" ? s(["sensor"], ["cv", "plug", "power"]) ?? g(["power", "energy"]) : e.upstreamId === "card_media_player" ? s(["media_player"], ["office", "joris", "tv"]) : e.upstreamId === "card_battery" ? u(["sensor"], ["battery", "level"], ["state", "charging"]) ?? g(["battery"], [], ["state", "charging"]) : e.upstreamId === "custom_card_pollen" ? s(["sensor"], ["pollen", "grass"]) : e.upstreamId === "custom_card_speedtest_gauges" ? s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) : e.upstreamId === "custom_card_tablet" ? s(["binary_sensor", "sensor", "switch"], ["tablet"]) : e.upstreamId === "custom_card_nas_metrics" ? s(["switch", "binary_sensor"], ["nas"]) ?? s(["switch", "binary_sensor"], ["status"]) : e.upstreamId === "custom_card_washer" ? s(["sensor"], ["operation", "state"]) ?? s(["sensor"], ["washer", "state"]) : e.upstreamId === "custom_card_sun" ? s(["sun"], []) : e.upstreamId === "custom_card_media_player_sonos" ? y : e.upstreamId === "custom_card_more_power_outlet" ? s(["switch", "light"], ["outlet"]) ?? s(["switch", "light"], ["plug"]) : e.upstreamId === "custom_card_printer" ? s(["sensor", "binary_sensor"], ["printer"]) ?? s(["sensor", "binary_sensor"], ["online"]) : e.upstreamId === "custom_card_internet_speed" ? s(["sensor"], ["download"]) : e.upstreamId === "custom_card_weather_metrics" ? s(["weather"], []) : e.upstreamId === "card_room" ? s(["light"], []) : e.upstreamId === "custom_card_plant" ? s(["plant"], []) ?? s(["sensor"], ["soil", "humidity"]) : e.upstreamId === "custom_card_playstation" ? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["xbox"]) ?? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["playstation"]) ?? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["nintendo"]) ?? s(["media_player", "remote"], []) : void 0, v = (e.upstreamId === "card_scenes" ? m(["light"], ["office", "joris"]) ?? m(["light"], []) ?? m(["climate"], []) ?? m(["sensor"], []) : void 0) ?? f ?? Gn(e, t, a, o), z = e.upstreamId === "advanced_energy_panel_health" ? _ : void 0, w = e.upstreamId === "custom_card_plant" ? {
    moisture_entity: (v && t?.states[v]?.attributes.device_class === "moisture" ? v : void 0) ?? c(["moisture"], ["soil"]) ?? c(["moisture"]),
    temperature_entity: c(["temperature"], ["soil"]) ?? c(["temperature"], ["plant"]),
    humidity_entity: c(["humidity"], ["plant"]) ?? c(["humidity"], ["soil"]),
    conductivity_entity: c(["conductivity"], ["plant"]) ?? m(["sensor"], ["conductivity"]),
    illuminance_entity: c(["illuminance"], ["plant"]) ?? m(["sensor"], ["plant", "illuminance"]),
    dli_entity: m(["sensor"], ["dli"])
  } : {}, D = Object.entries(w).filter(([, $]) => $).map(([$]) => $.replace(/_entity$/, "")), U = ["text", "navigation"].includes(e.family), K = e.variants?.[0], Y = v?.split(".", 1)[0], te = ["light", "switch", "input_boolean", "fan"].includes(Y ?? "") ? { action: "toggle" } : { action: v ? "more-info" : "none" }, T = ($, O) => [...new Set($.filter((X) => !!X))].slice(0, O), V = s(["sensor"], ["outdoor", "temperature"]) ?? s(["sensor"], ["outside", "temperature"]) ?? s(["sensor"], ["garden", "temperature"]) ?? g(["temperature"], [], ["battery", "cpu", "soil"]), Q = s(["sensor"], ["date", "time"]) ?? s(["sensor"], ["time", "date"]) ?? s(["sensor"], ["date"]), R = [
    [c(["humidity"]), "Humidity"],
    [
      c(["wind_speed"]) ?? m(["sensor"], ["wind", "speed"]) ?? m(["sensor"], ["wind"]),
      "Wind"
    ],
    [
      c(["atmospheric_pressure"]) ?? m(["sensor"], ["barometric", "pressure"]) ?? m(["sensor"], ["pressure"], ["blood"]),
      "Pressure"
    ],
    [
      c(["precipitation", "precipitation_intensity"]) ?? m(["sensor"], ["precipitation"]) ?? m(["sensor"], ["rain"]),
      "Precipitation"
    ],
    [m(["sensor"], ["visibility"]), "Visibility"],
    [m(["sensor"], ["cloud", "coverage"]), "Cloud cover"],
    [m(["sensor"], ["uv", "index"]), "UV index"],
    [c(["illuminance"]), "Light level"],
    [m(["sensor"], ["dew", "point"]), "Dew point"]
  ], ae = Va(t, v), ie = R.filter(
    ([$], O, X) => !!$ && X.findIndex(([x]) => x === $) === O
  ).slice(0, 4), se = T([
    g(["temperature"]),
    g(["humidity"]),
    g(["power", "energy"]),
    g(["battery"]),
    ...r.filter(($) => $.startsWith("sensor."))
  ], 4), ge = e.upstreamId === "custom_card_sun" || e.upstreamId === "custom_card_pollen" || e.upstreamId === "card_welcome_scenes" ? { action: "none" } : e.upstreamId === "custom_card_speedtest_gauges" ? {
    action: "perform-action",
    perform_action: "homeassistant.update_entity",
    target: {
      entity_id: [
        s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) ?? v,
        s(["sensor"], ["speedtest", "upload"]) ?? s(["sensor"], ["upload"]),
        s(["sensor"], ["speedtest", "ping"]) ?? s(["sensor"], ["ping"])
      ].filter(($) => !!$)
    }
  } : e.upstreamId === "custom_card_playstation" ? { action: v ? "more-info" : "none", entity: v } : e.upstreamId === "advanced_home_energy_management" ? { action: "navigate", navigation_path: "/hems-tower/savings-overview" } : e.upstreamId === "custom_card_plant" ? { action: "more-info" } : te;
  return {
    ...Ga(e, t, v),
    name: [
      "advanced_home_energy_management",
      "advanced_energy_buy_sell",
      "advanced_energy_panel_health"
    ].includes(e.upstreamId) ? void 0 : v ? t?.states[v]?.attributes.friendly_name : jn(e),
    secondary: v ? void 0 : U ? "Example" : "Preview",
    variant: K,
    tap_action: ge,
    show_controls: ["climate", "vacuum", "control"].includes(e.family) || e.family === "media" && e.upstreamId !== "card_media_player" ? !0 : void 0,
    show_forecast: e.family === "weather",
    show_graph: ["battery", "energy", "sensor"].includes(e.family),
    ulm_custom_card_bar_card_value: e.family === "bar" ? !0 : void 0,
    entities: e.upstreamId === "mini_graph_card" && v ? [v] : e.variants?.includes("with-sensors") ? o.slice(0, 2) : void 0,
    panel_entities: z?.length ? z : void 0,
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
      program_stage_entity: s(["sensor", "select"], ["wasmachine", "program"]) ?? s(["sensor", "select"], ["washer", "program"]) ?? s(["sensor", "select"], ["washer", "job"]) ?? v,
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
      moon_entity: u(["sensor"], ["moon", "phase"], ["angle"]) ?? s(["sensor"], ["moon"]),
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
      download_entity: s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) ?? v,
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
      grass_entity: s(["sensor"], ["pollen", "grass"]) ?? s(["sensor"], ["grass", "pollen"]) ?? v,
      weeds_entity: s(["sensor"], ["pollen", "weeds"]) ?? s(["sensor"], ["weed", "pollen"])
    } : {},
    ...e.upstreamId === "custom_card_plant" ? {
      entity: v,
      ulm_card_flower_entity: v,
      ulm_card_flower_name: v ? t?.states[v]?.attributes.friendly_name : "No name set",
      ulm_card_flower_show_bars: D.length ? D : ["moisture"],
      ...w
    } : {},
    ...e.upstreamId === "card_room" ? {
      room_sensors: [
        s(["sensor"], ["illuminance"]),
        s(["sensor"], ["temperature"])
      ].filter(($) => !!$).map(($) => ({ entity: $ }))
    } : {},
    ...e.upstreamId === "card_scenes" ? {
      scene_items: r.filter(($) => $.startsWith("scene.")).slice(0, 7).map(($) => Ve(t, $))
    } : {},
    ...e.upstreamId === "card_welcome_scenes" ? {
      name: void 0,
      secondary: "Scenes",
      collapse_entity: s(["input_boolean"], ["collapse"]) ?? s(["input_boolean"], ["dropdown"]) ?? s(["input_boolean"], []),
      scene_items: r.filter(($) => $.startsWith("scene.")).slice(0, 5).map(($) => Ve(t, $))
    } : {},
    ...e.upstreamId === "custom_card_internet_speed" ? {
      download_entity: s(["sensor"], ["download"]) ?? v,
      upload_entity: s(["sensor"], ["upload"]),
      ping_entity: s(["sensor"], ["ping"])
    } : {},
    ...e.upstreamId === "custom_card_entity_overview" ? {
      entities: se,
      ...Object.fromEntries(se.flatMap(($, O) => [
        [`ulm_custom_card_entity_overview_entity_${O + 1}`, $],
        [
          `ulm_custom_card_entity_overview_name_${O + 1}`,
          t?.states[$]?.attributes.friendly_name ?? `Entity ${O + 1}`
        ]
      ]))
    } : {},
    ...e.upstreamId === "custom_card_weather_metrics" ? {
      entity: s(["weather"], []) ?? v,
      temperature_entity: V,
      date_entity: Q,
      entities: ie.map(([$]) => $),
      ulm_custom_card_weather_metrics: s(["weather"], []) ?? v,
      ulm_custom_card_weather_metrics_temperature_outside: V,
      ulm_custom_card_weather_metrics_date: Q,
      ...Object.fromEntries(ie.flatMap(([$, O], X) => [
        [`ulm_custom_card_weather_metrics_entity_${X + 1}`, $],
        [`ulm_custom_card_weather_metrics_name_${X + 1}`, O]
      ]))
    } : {},
    ...e.upstreamId === "custom_card_media_player_sonos" ? {
      ulm_card_media_player_with_controls_name: v ? t?.states[v]?.attributes.friendly_name : "No name set"
    } : {},
    ...e.upstreamId === "custom_card_more_power_outlet" ? {
      power_entity: s(["sensor"], ["power"]),
      energy_entity: s(["sensor"], ["energy"]),
      time_entity: s(["sensor"], ["time"])
    } : {},
    ...e.upstreamId === "custom_card_gauge" ? { minimum: 0, maximum: 100 } : {},
    ...e.upstreamId === "custom_card_printer" ? {
      black_entity: s(["sensor"], ["black"]),
      yellow_entity: s(["sensor"], ["yellow"]),
      magenta_entity: s(["sensor"], ["magenta"]),
      cyan_entity: s(["sensor"], ["cyan"])
    } : {},
    ...e.upstreamId === "custom_card_playstation" ? {
      console_platform: ae === "generic" ? "auto" : ae,
      console_show_artwork: !0,
      console_show_controls: !0,
      ...Pt(t, v)
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
      carousel_items: T(o, 7).map(($) => ({
        entity: $,
        name: t?.states[$]?.attributes.friendly_name,
        icon: t?.states[$]?.attributes.icon,
        color: "primary",
        tap_action: { action: "more-info" },
        hold_action: { action: "none" }
      }))
    } : {}
  };
}, Hn = "0.0.1";
for (const e of lt)
  if (!customElements.get(e.tag)) {
    if (e.upstreamId === "mini_graph_card") {
      customElements.define(e.tag, ve);
      continue;
    }
    const t = e;
    class a extends Me {
      constructor() {
        super(...arguments), this.descriptor = t;
      }
      static getStubConfig(r, n = [], i = []) {
        return qa(t, r, n, i);
      }
    }
    customElements.define(e.tag, a);
  }
for (const e of Mt) {
  if (customElements.get(e.tag)) continue;
  const t = st.find((n) => n.upstreamId === e.targetId);
  if (!t) throw new Error(`Missing alias target ${e.targetId}.`);
  const a = t, o = e.variant;
  class r extends Me {
    constructor() {
      super(...arguments), this.descriptor = a;
    }
    static getStubConfig(i, l = [], s = []) {
      const u = qa(a, i, l, s);
      return o === "divider-title" ? {
        ...u,
        type: `custom:${e.tag}`,
        entity: void 0,
        variant: o,
        name: "Title",
        navigation_path: "",
        tap_action: { action: "none" }
      } : o === "divider-subtitle" ? {
        ...u,
        type: `custom:${e.tag}`,
        entity: void 0,
        variant: o,
        name: "Subtitle",
        tap_action: { action: "none" }
      } : {
        ...u,
        type: `custom:${e.tag}`,
        variant: o,
        show_forecast: e.tag === "mushroom-addition-card-weather-ulm" ? !1 : u.show_forecast
      };
    }
    setConfig(i) {
      super.setConfig({ ...i, variant: i.variant ?? o });
    }
  }
  customElements.define(e.tag, r);
}
window.customCards = window.customCards || [];
const Wn = new Set(window.customCards.map((e) => e.type));
for (const e of lt)
  Wn.has(e.tag) || window.customCards.push({
    type: e.tag,
    name: `Mushroom Addition: ${e.name}`,
    description: e.description,
    preview: !0,
    documentationURL: "https://github.com/snfx-johaver/mushroom-cards-addition"
  });
console.info(
  `%c MUSHROOM-CARDS-ADDITION %c ${Hn} · ${lt.length} components `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;"
);
export {
  lt as CATALOG
};
//# sourceMappingURL=mushroom-cards-addition.js.map
