const te = globalThis, me = te.ShadowRoot && (te.ShadyCSS === void 0 || te.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, pe = /* @__PURE__ */ Symbol(), xe = /* @__PURE__ */ new WeakMap();
let He = class {
  constructor(t, a, r) {
    if (this._$cssResult$ = !0, r !== pe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = a;
  }
  get styleSheet() {
    let t = this.o;
    const a = this.t;
    if (me && t === void 0) {
      const r = a !== void 0 && a.length === 1;
      r && (t = xe.get(a)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && xe.set(a, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const it = (e) => new He(typeof e == "string" ? e : e + "", void 0, pe), Be = (e, ...t) => {
  const a = e.length === 1 ? e[0] : t.reduce((r, n, i) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[i + 1], e[0]);
  return new He(a, e, pe);
}, ot = (e, t) => {
  if (me) e.adoptedStyleSheets = t.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of t) {
    const r = document.createElement("style"), n = te.litNonce;
    n !== void 0 && r.setAttribute("nonce", n), r.textContent = a.cssText, e.appendChild(r);
  }
}, ke = me ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let a = "";
  for (const r of t.cssRules) a += r.cssText;
  return it(a);
})(e) : e;
const { is: lt, defineProperty: st, getOwnPropertyDescriptor: ct, getOwnPropertyNames: dt, getOwnPropertySymbols: ut, getPrototypeOf: _t } = Object, oe = globalThis, Ie = oe.trustedTypes, mt = Ie ? Ie.emptyScript : "", pt = oe.reactiveElementPolyfillSupport, W = (e, t) => e, re = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? mt : null;
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
} }, he = (e, t) => !lt(e, t), Pe = { attribute: !0, type: String, converter: re, reflect: !1, useDefault: !1, hasChanged: he };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), oe.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let z = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, a = Pe) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(t, a), !a.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(t, r, a);
      n !== void 0 && st(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, a, r) {
    const { get: n, set: i } = ct(this.prototype, t) ?? { get() {
      return this[a];
    }, set(o) {
      this[a] = o;
    } };
    return { get: n, set(o) {
      const c = n?.call(this);
      i?.call(this, o), this.requestUpdate(t, c, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Pe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(W("elementProperties"))) return;
    const t = _t(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(W("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(W("properties"))) {
      const a = this.properties, r = [...dt(a), ...ut(a)];
      for (const n of r) this.createProperty(n, a[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const a = litPropertyMetadata.get(t);
      if (a !== void 0) for (const [r, n] of a) this.elementProperties.set(r, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [a, r] of this.elementProperties) {
      const n = this._$Eu(a, r);
      n !== void 0 && this._$Eh.set(n, a);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const a = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const n of r) a.unshift(ke(n));
    } else t !== void 0 && a.push(ke(t));
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
    return ot(t, this.constructor.elementStyles), t;
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
    const r = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, r);
    if (n !== void 0 && r.reflect === !0) {
      const i = (r.converter?.toAttribute !== void 0 ? r.converter : re).toAttribute(a, r.type);
      this._$Em = t, i == null ? this.removeAttribute(n) : this.setAttribute(n, i), this._$Em = null;
    }
  }
  _$AK(t, a) {
    const r = this.constructor, n = r._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const i = r.getPropertyOptions(n), o = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : re;
      this._$Em = n;
      const c = o.fromAttribute(a, i.type);
      this[n] = c ?? this._$Ej?.get(n) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, a, r, n = !1, i) {
    if (t !== void 0) {
      const o = this.constructor;
      if (n === !1 && (i = this[t]), r ??= o.getPropertyOptions(t), !((r.hasChanged ?? he)(i, a) || r.useDefault && r.reflect && i === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, r)))) return;
      this.C(t, a, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, a, { useDefault: r, reflect: n, wrapped: i }, o) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? a ?? this[t]), i !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (a = void 0), this._$AL.set(t, a)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [n, i] of this._$Ep) this[n] = i;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, i] of r) {
        const { wrapped: o } = i, c = this[n];
        o !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, i, c);
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
z.elementStyles = [], z.shadowRootOptions = { mode: "open" }, z[W("elementProperties")] = /* @__PURE__ */ new Map(), z[W("finalized")] = /* @__PURE__ */ new Map(), pt?.({ ReactiveElement: z }), (oe.reactiveElementVersions ??= []).push("2.1.2");
const fe = globalThis, De = (e) => e, ne = fe.trustedTypes, Se = ne ? ne.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, We = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, Ge = "?" + A, ht = `<${Ge}>`, F = document, K = () => F.createComment(""), J = (e) => e === null || typeof e != "object" && typeof e != "function", be = Array.isArray, ft = (e) => be(e) || typeof e?.[Symbol.iterator] == "function", de = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ae = /-->/g, qe = />/g, R = RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ce = /'/g, Re = /"/g, Ke = /^(?:script|style|textarea|title)$/i, bt = (e) => (t, ...a) => ({ _$litType$: e, strings: t, values: a }), l = bt(1), M = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), Ee = /* @__PURE__ */ new WeakMap(), E = F.createTreeWalker(F, 129);
function Je(e, t) {
  if (!be(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Se !== void 0 ? Se.createHTML(t) : t;
}
const gt = (e, t) => {
  const a = e.length - 1, r = [];
  let n, i = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = H;
  for (let c = 0; c < a; c++) {
    const s = e[c];
    let m, b, p = -1, $ = 0;
    for (; $ < s.length && (o.lastIndex = $, b = o.exec(s), b !== null); ) $ = o.lastIndex, o === H ? b[1] === "!--" ? o = Ae : b[1] !== void 0 ? o = qe : b[2] !== void 0 ? (Ke.test(b[2]) && (n = RegExp("</" + b[2], "g")), o = R) : b[3] !== void 0 && (o = R) : o === R ? b[0] === ">" ? (o = n ?? H, p = -1) : b[1] === void 0 ? p = -2 : (p = o.lastIndex - b[2].length, m = b[1], o = b[3] === void 0 ? R : b[3] === '"' ? Re : Ce) : o === Re || o === Ce ? o = R : o === Ae || o === qe ? o = H : (o = R, n = void 0);
    const w = o === R && e[c + 1].startsWith("/>") ? " " : "";
    i += o === H ? s + ht : p >= 0 ? (r.push(m), s.slice(0, p) + We + s.slice(p) + A + w) : s + A + (p === -2 ? c : w);
  }
  return [Je(e, i + (e[a] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class Y {
  constructor({ strings: t, _$litType$: a }, r) {
    let n;
    this.parts = [];
    let i = 0, o = 0;
    const c = t.length - 1, s = this.parts, [m, b] = gt(t, a);
    if (this.el = Y.createElement(m, r), E.currentNode = this.el.content, a === 2 || a === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = E.nextNode()) !== null && s.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(We)) {
          const $ = b[o++], w = n.getAttribute(p).split(A), P = /([.?@])?(.*)/.exec($);
          s.push({ type: 1, index: i, name: P[2], strings: w, ctor: P[1] === "." ? vt : P[1] === "?" ? wt : P[1] === "@" ? Vt : le }), n.removeAttribute(p);
        } else p.startsWith(A) && (s.push({ type: 6, index: i }), n.removeAttribute(p));
        if (Ke.test(n.tagName)) {
          const p = n.textContent.split(A), $ = p.length - 1;
          if ($ > 0) {
            n.textContent = ne ? ne.emptyScript : "";
            for (let w = 0; w < $; w++) n.append(p[w], K()), E.nextNode(), s.push({ type: 2, index: ++i });
            n.append(p[$], K());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Ge) s.push({ type: 2, index: i });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(A, p + 1)) !== -1; ) s.push({ type: 7, index: i }), p += A.length - 1;
      }
      i++;
    }
  }
  static createElement(t, a) {
    const r = F.createElement("template");
    return r.innerHTML = t, r;
  }
}
function U(e, t, a = e, r) {
  if (t === M) return t;
  let n = r !== void 0 ? a._$Co?.[r] : a._$Cl;
  const i = J(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== i && (n?._$AO?.(!1), i === void 0 ? n = void 0 : (n = new i(e), n._$AT(e, a, r)), r !== void 0 ? (a._$Co ??= [])[r] = n : a._$Cl = n), n !== void 0 && (t = U(e, n._$AS(e, t.values), n, r)), t;
}
class yt {
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
    const { el: { content: a }, parts: r } = this._$AD, n = (t?.creationScope ?? F).importNode(a, !0);
    E.currentNode = n;
    let i = E.nextNode(), o = 0, c = 0, s = r[0];
    for (; s !== void 0; ) {
      if (o === s.index) {
        let m;
        s.type === 2 ? m = new X(i, i.nextSibling, this, t) : s.type === 1 ? m = new s.ctor(i, s.name, s.strings, this, t) : s.type === 6 && (m = new $t(i, this, t)), this._$AV.push(m), s = r[++c];
      }
      o !== s?.index && (i = E.nextNode(), o++);
    }
    return E.currentNode = F, n;
  }
  p(t) {
    let a = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, a), a += r.strings.length - 2) : r._$AI(t[a])), a++;
  }
}
class X {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, a, r, n) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = a, this._$AM = r, this.options = n, this._$Cv = n?.isConnected ?? !0;
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
    t = U(this, t, a), J(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== M && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ft(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && J(this._$AH) ? this._$AA.nextSibling.data = t : this.T(F.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: a, _$litType$: r } = t, n = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = Y.createElement(Je(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === n) this._$AH.p(a);
    else {
      const i = new yt(n, this), o = i.u(this.options);
      i.p(a), this.T(o), this._$AH = i;
    }
  }
  _$AC(t) {
    let a = Ee.get(t.strings);
    return a === void 0 && Ee.set(t.strings, a = new Y(t)), a;
  }
  k(t) {
    be(this._$AH) || (this._$AH = [], this._$AR());
    const a = this._$AH;
    let r, n = 0;
    for (const i of t) n === a.length ? a.push(r = new X(this.O(K()), this.O(K()), this, this.options)) : r = a[n], r._$AI(i), n++;
    n < a.length && (this._$AR(r && r._$AB.nextSibling, n), a.length = n);
  }
  _$AR(t = this._$AA.nextSibling, a) {
    for (this._$AP?.(!1, !0, a); t !== this._$AB; ) {
      const r = De(t).nextSibling;
      De(t).remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class le {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, a, r, n, i) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = a, this._$AM = n, this.options = i, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = d;
  }
  _$AI(t, a = this, r, n) {
    const i = this.strings;
    let o = !1;
    if (i === void 0) t = U(this, t, a, 0), o = !J(t) || t !== this._$AH && t !== M, o && (this._$AH = t);
    else {
      const c = t;
      let s, m;
      for (t = i[0], s = 0; s < i.length - 1; s++) m = U(this, c[r + s], a, s), m === M && (m = this._$AH[s]), o ||= !J(m) || m !== this._$AH[s], m === d ? t = d : t !== d && (t += (m ?? "") + i[s + 1]), this._$AH[s] = m;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class vt extends le {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class wt extends le {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Vt extends le {
  constructor(t, a, r, n, i) {
    super(t, a, r, n, i), this.type = 5;
  }
  _$AI(t, a = this) {
    if ((t = U(this, t, a, 0) ?? d) === M) return;
    const r = this._$AH, n = t === d && r !== d || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, i = t !== d && (r === d || n);
    n && this.element.removeEventListener(this.name, this, r), i && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class $t {
  constructor(t, a, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    U(this, t);
  }
}
const xt = fe.litHtmlPolyfillSupport;
xt?.(Y, X), (fe.litHtmlVersions ??= []).push("3.3.3");
const kt = (e, t, a) => {
  const r = a?.renderBefore ?? t;
  let n = r._$litPart$;
  if (n === void 0) {
    const i = a?.renderBefore ?? null;
    r._$litPart$ = n = new X(t.insertBefore(K(), i), i, void 0, a ?? {});
  }
  return n._$AI(e), n;
};
const ge = globalThis;
class L extends z {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = kt(a, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return M;
  }
}
L._$litElement$ = !0, L.finalized = !0, ge.litElementHydrateSupport?.({ LitElement: L });
const It = ge.litElementPolyfillSupport;
It?.({ LitElement: L });
(ge.litElementVersions ??= []).push("4.2.2");
const Pt = (e) => (t, a) => {
  a !== void 0 ? a.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Dt = { attribute: !0, type: String, converter: re, reflect: !1, hasChanged: he }, St = (e = Dt, t, a) => {
  const { kind: r, metadata: n } = a;
  let i = globalThis.litPropertyMetadata.get(n);
  if (i === void 0 && globalThis.litPropertyMetadata.set(n, i = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), i.set(a.name, e), r === "accessor") {
    const { name: o } = a;
    return { set(c) {
      const s = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(o, s, e, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(o, void 0, e, c), c;
    } };
  }
  if (r === "setter") {
    const { name: o } = a;
    return function(c) {
      const s = this[o];
      t.call(this, c), this.requestUpdate(o, s, e, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function se(e) {
  return (t, a) => typeof a == "object" ? St(e, t, a) : ((r, n, i) => {
    const o = n.hasOwnProperty(i);
    return n.constructor.createProperty(i, r), o ? Object.getOwnPropertyDescriptor(n, i) : void 0;
  })(e, t, a);
}
function At(e) {
  return se({ ...e, state: !0, attribute: !1 });
}
const qt = [
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
], Ct = [
  "alarm",
  "back",
  "icon_double_state",
  "icon_label",
  "icon_only",
  "icon_state",
  "mdi_icon_only",
  "mdi_icon_state",
  "navigate",
  "power_consumption",
  "presence_detection",
  "temperature"
], Rt = [
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
], Et = [
  "group_counter",
  "moon",
  "myenedis",
  "simple_temp",
  "tesla_temperature",
  "update",
  "vlape_garage"
], Fe = (e) => e.replace(/^iAbadia/, "iAbadia").split("_").map((t) => ["nas", "mdi", "dwd", "vnc", "wifi", "http"].includes(t.toLowerCase()) ? t.toUpperCase() : `${t[0].toUpperCase()}${t.slice(1)}`).join(" "), Ft = (e) => e === "custom_card_alarm_time" ? "alarm-time" : e === "custom_card_nik_door" ? "door" : /alarm|alert|lock/.test(e) ? "security" : /navigate|back/.test(e) ? "navigation" : /battery/.test(e) ? "battery" : /power_outlet|more_power_outlet/.test(e) ? "control" : /energy|power|gauge|speedtest|wifisignal|graph|apex|bar_card|myenedis/.test(e) ? "energy" : /weather|sun|pollen|moon/.test(e) ? "weather" : /scene/.test(e) ? "scene" : /person|tracker|tracer|presence|room|welcome/.test(e) ? "presence" : /media|chromecast|playstation/.test(e) ? "media" : /thermostat|heat_pump|aircondition|temperature|simple_temp/.test(e) ? "climate" : /cover|door|garage/.test(e) ? "cover" : /vacuum/.test(e) ? "vacuum" : /light/.test(e) ? "light" : /fan|outlet|boolean|script|washer|water_heater|qubino/.test(e) ? "control" : /title|subtitle|clock|date/.test(e) ? "text" : /camera/.test(e) ? "camera" : /sensor|elapsed|input_number|input_datetime|update|printer|nas|tablet|flower|car|afval|waste|counter/.test(e) ? "sensor" : "entity", jt = {
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
  custom_card_playstation: ["ps5", "xbox"]
}, zt = (e, t) => e === "custom_card_alarm_time" ? ["input_boolean"] : e === "custom_card_nik_door" ? ["sensor"] : /alarm/.test(e) ? ["alarm_control_panel"] : /lock/.test(e) ? ["lock"] : /power_outlet|more_power_outlet/.test(e) ? ["switch", "light"] : e.includes("binary_sensor") ? ["binary_sensor"] : e.includes("battery") ? ["sensor"] : e.includes("input_boolean") ? ["input_boolean"] : e.includes("input_number") ? ["input_number"] : e.includes("input_datetime") ? ["input_datetime"] : e.includes("light") ? ["light"] : /media|chromecast|playstation/.test(e) ? ["media_player", "sensor"] : /thermostat|heat_pump|aircondition/.test(e) ? ["climate"] : /scene/.test(e) ? ["scene"] : /script/.test(e) ? ["script"] : /vacuum/.test(e) ? ["vacuum"] : /weather/.test(e) ? ["weather"] : /person/.test(e) ? ["person", "device_tracker"] : /cover|door|garage/.test(e) ? ["cover", "binary_sensor"] : /fan/.test(e) ? ["fan"] : /camera/.test(e) ? ["camera"] : /lock/.test(e) ? ["lock"] : /update/.test(e) ? ["update"] : t === "battery" || t === "energy" || t === "sensor" || t === "weather" ? ["sensor"] : t === "control" ? /fan/.test(e) ? ["fan"] : /script/.test(e) ? ["script"] : /washer/.test(e) ? ["switch", "sensor"] : /water_heater/.test(e) ? ["water_heater"] : ["switch", "input_boolean", "light"] : t === "presence" ? ["person", "device_tracker"] : ["sensor", "switch"], Q = (e, t, a) => {
  const r = e.replace(/^custom_(card|chip)_/, "").replace(/^(card|chip)_/, ""), n = e.replaceAll("_", "-").toLowerCase(), i = n.startsWith("custom-card-") || n.startsWith("custom-chip-") ? `mushroom-addition-${n}` : `mushroom-addition-${t}-${n.replace(new RegExp(`^${t}-`), "")}`, o = Ft(e), c = e === "custom_card_playstation";
  return {
    upstreamId: e,
    sourcePath: a,
    kind: t,
    category: e.startsWith("custom_") ? t === "card" ? "custom-card" : "custom-chip" : t === "card" ? "default-card" : "default-chip",
    family: o,
    tag: i,
    name: c ? "PS5 / Xbox Card" : `${Fe(r)} ${t === "chip" ? "Chip" : "Card"}`,
    description: c ? "Mushroom-style game console card with PS5 and Xbox modes." : `Mushroom-style ${Fe(r).toLowerCase()} ${t}.`,
    variants: jt[e],
    preferredDomains: zt(e, o)
  };
}, Ye = [
  ...qt.map((e) => {
    const t = {
      graph: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/2-line_cards/card_graph.yaml",
      scenes: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_scenes_welcome.yaml",
      title: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/title/card_title.yaml",
      vertical_button: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/vertical_buttons/vertical_buttons.yaml"
    };
    return Q(
      `card_${e}`,
      "card",
      t[e] ?? `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_${e}.yaml`
    );
  }),
  ...Ct.map((e) => Q(
    `chip_${e}`,
    "chip",
    `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_${e}.yaml`
  )),
  ...Rt.map((e) => Q(
    `custom_card_${e}`,
    "card",
    `custom_cards/custom_card_${e}`
  )),
  ...Et.map((e) => Q(
    `custom_chip_${e}`,
    "chip",
    `custom_cards/custom_chip_${e}`
  ))
], Ze = [
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
    canonical: "chip_icon_only",
    sources: { chip_icon_only: "entity-icon", chip_mdi_icon_only: "mdi-icon" },
    variants: ["entity-icon", "mdi-icon"],
    variantLabels: { "entity-icon": "Entity icon", "mdi-icon": "Selected icon" }
  },
  {
    canonical: "chip_icon_state",
    sources: { chip_icon_state: "entity-icon", chip_mdi_icon_state: "mdi-icon" },
    variants: ["entity-icon", "mdi-icon"],
    variantLabels: { "entity-icon": "Entity icon and state", "mdi-icon": "Selected icon and state" }
  },
  {
    canonical: "chip_navigate",
    sources: { chip_navigate: "path", chip_back: "back" },
    variants: ["path", "back"],
    variantLabels: { path: "Navigate to path", back: "Back button" },
    name: "Navigation Chip"
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
], T = /* @__PURE__ */ new Map();
for (const e of Ze)
  for (const t of Object.keys(e.sources)) T.set(t, e);
const Xe = new Set(Ze.map((e) => e.canonical)), ce = Ye.filter((e) => !T.has(e.upstreamId) || Xe.has(e.upstreamId)).map((e) => {
  const t = T.get(e.upstreamId);
  return t ? {
    ...e,
    name: t.name ?? e.name,
    description: t.description ?? e.description,
    variants: t.variants,
    variantLabels: t.variantLabels,
    sourceIds: Object.keys(t.sources)
  } : { ...e, sourceIds: [e.upstreamId] };
}), ie = Ye.filter((e) => T.has(e.upstreamId) && !Xe.has(e.upstreamId)).map((e) => {
  const t = T.get(e.upstreamId), a = ce.find((r) => r.upstreamId === t.canonical);
  return {
    upstreamId: e.upstreamId,
    tag: e.tag,
    targetId: a.upstreamId,
    targetTag: a.tag,
    variant: t.sources[e.upstreamId]
  };
}), O = [
  {
    upstreamId: "chips_container",
    sourcePath: "Mushroom Cards Addition composition component",
    kind: "container",
    category: "container",
    family: "chips",
    tag: "mushroom-addition-chips-card",
    name: "Addition Chips Card",
    description: "Compose Addition chips in a responsive row.",
    sourceIds: []
  },
  ...ce
], ee = (e) => O.find((t) => t.tag === e) ?? (() => {
  const t = ie.find((a) => a.tag === e);
  return t ? ce.find((a) => a.tag === t.targetTag) : void 0;
})(), je = (e) => T.get(e)?.sources[e], I = /* @__PURE__ */ new Set([
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
]), u = (e) => {
  if (!e) return "Entity unavailable";
  const t = e.attributes.unit_of_measurement;
  return t ? `${e.state} ${String(t)}` : e.state.replaceAll("_", " ");
}, D = (e, t) => e.name_mode === "none" ? "" : e.name_mode === "entity" ? t?.attributes.friendly_name || e.entity || "Mushroom Addition" : e.name || t?.attributes.friendly_name || e.entity || "Mushroom Addition", B = (e, t, a) => {
  e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    composed: !0,
    detail: a
  }));
}, Lt = (e, t, a) => {
  B(e, "hass-action", { config: t, action: a });
}, Mt = (e) => {
  const t = Ot(e), a = Ut(t), r = t.navigation_path ? { action: "navigate", navigation_path: t.navigation_path } : { action: t.entity ? "more-info" : "none" };
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
    tap_action: a.tap_action ?? r
  };
}, j = (e, t) => Object.entries(e).find(([a, r]) => t.test(a) && r !== void 0)?.[1], Ut = (e) => {
  const t = j(e, /_name$/), a = j(e, /_icon$/), r = j(e, /_color$/), n = j(e, /_enable_(controls|buttons)$/), i = j(e, /_enable_slider$/), o = j(e, /_enable_horizontal$/);
  return {
    ...e,
    name: e.name ?? (typeof t == "string" ? t : void 0),
    icon: e.icon ?? (typeof a == "string" ? a : void 0),
    icon_color: e.icon_color ?? (typeof r == "string" ? r : void 0),
    show_controls: e.show_controls ?? (typeof n == "boolean" ? n : typeof i == "boolean" ? i : void 0),
    layout: e.layout ?? (o === !0 ? "horizontal" : void 0)
  };
}, Tt = [
  "ulm_card_person_entity",
  "ulm_card_light_entity",
  "ulm_card_weather_entity",
  "ulm_card_media_player_entity",
  "ulm_card_thermostat_entity",
  "ulm_card_cover_entity",
  "ulm_card_vacuum_entity"
], Ot = (e) => {
  if (e.entity) return { ...e, primary_entity: void 0 };
  const t = e.primary_entity || Tt.map((a) => e[a]).find((a) => typeof a == "string");
  return t ? { ...e, entity: t, primary_entity: void 0 } : { ...e };
}, ze = {
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
    chips: "Chip configurations",
    temperature_entity: "Temperature sensor",
    humidity_entity: "Humidity sensor",
    battery_entity: "Battery sensor",
    graph_entity: "Graph sensor",
    eta_entity: "ETA sensor",
    address_entity: "Address sensor",
    min_entity: "Minimum sensor",
    max_entity: "Maximum sensor",
    show_forecast: "Show forecast",
    show_controls: "Show controls",
    show_graph: "Show graph",
    use_entity_picture: "Use entity picture",
    graph_hours: "Graph hours",
    console_platform: "Console platform",
    ulm_card_weather_backdrop: "Show weather background",
    ulm_card_weather_primary_info: "Main weather information",
    ulm_card_weather_secondary_info: "Additional weather information",
    ulm_card_light_enable_slider: "Show brightness slider",
    ulm_card_light_enable_slider_minSet: "Minimum slider brightness",
    ulm_card_light_enable_slider_maxSet: "Maximum slider brightness",
    ulm_card_light_enable_collapse: "Collapse controls when light is off",
    ulm_card_light_enable_horizontal: "Use horizontal layout",
    ulm_card_light_enable_color: "Use the light's current color",
    ulm_card_light_force_background_color: "Color the card when light is on",
    ulm_card_light_enable_buttons: "Show brightness preset buttons",
    ulm_card_light_brightness_low: "Low brightness preset",
    ulm_card_light_brightness_medium: "Medium brightness preset",
    ulm_card_light_brightness_high: "High brightness preset",
    ulm_card_battery_battery_level_danger: "Low battery threshold",
    ulm_card_battery_battery_level_warning: "Battery warning threshold",
    ulm_card_battery_charging_animation: "Animate while charging",
    ulm_card_media_player_enable_art: "Show media artwork",
    ulm_card_media_player_enable_controls: "Show playback controls",
    ulm_card_media_player_enable_volume_slider: "Show volume slider",
    ulm_card_cover_enable_slider: "Show position slider",
    ulm_card_cover_slider_min: "Minimum cover position",
    ulm_card_cover_slider_max: "Maximum cover position",
    ulm_card_fan_enable_slider: "Show speed slider",
    ulm_card_fan_slider_min: "Minimum fan speed",
    ulm_card_fan_slider_max: "Maximum fan speed",
    ulm_card_fan_enable_button: "Show oscillation button",
    ulm_card_fan_button_icon: "Oscillation button icon",
    ulm_card_binary_sensor_show_last_changed: "Show when the state last changed",
    ulm_card_binary_sensor_alert_show_last_changed: "Show when the alert last changed",
    ulm_custom_card_washer_power: "Power sensor"
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
    chips: "Chip-Konfigurationen",
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
    chips: "Configuraciones de chips",
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
    chips: "Configuration des chips",
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
    chips: "Chipconfiguraties",
    temperature_entity: "Temperatuursensor",
    humidity_entity: "Vochtigheidssensor",
    battery_entity: "Batterijsensor",
    show_forecast: "Voorspelling tonen",
    show_controls: "Bediening tonen"
  }
}, Nt = (e, t) => {
  const a = e?.language?.split("-")[0] ?? "en";
  return ze[a]?.[t] ?? ze.en[t] ?? t.replaceAll("_", " ").replace(/\b\w/g, (r) => r.toUpperCase());
}, Ht = {
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
  temperature_entity: "Optional sensor used when temperature comes from a separate entity.",
  humidity_entity: "Optional sensor used when humidity comes from a separate entity.",
  battery_entity: "Optional sensor used to display a separate battery level.",
  graph_entity: "Sensor whose history is plotted in the card.",
  eta_entity: "Optional sensor containing an estimated arrival time.",
  address_entity: "Optional sensor containing a location or address.",
  min_entity: "Optional sensor used as the lower comparison value.",
  max_entity: "Optional sensor used as the upper comparison value.",
  datetime_entity: "Date and time helper controlled by this card.",
  lock_entity: "Optional lock entity controlled alongside the door sensor.",
  navigation_path: "Dashboard path opened when the navigation card is tapped.",
  show_forecast: "Displays upcoming weather forecast information when available.",
  show_controls: "Displays controls supported by the selected entity.",
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
  ulm_card_light_enable_color: "Uses the light entity's RGB color for active card accents.",
  ulm_card_light_force_background_color: "Uses the active light color as the card background.",
  ulm_card_light_enable_buttons: "Adds Low, Medium, and High brightness shortcuts.",
  ulm_card_light_brightness_low: "Brightness percentage used by the Low button.",
  ulm_card_light_brightness_medium: "Brightness percentage used by the Medium button.",
  ulm_card_light_brightness_high: "Brightness percentage used by the High button.",
  ulm_card_battery_battery_level_danger: "Battery percentages at or below this value use the critical color.",
  ulm_card_battery_battery_level_warning: "Battery percentages at or below this value use the warning color.",
  ulm_card_battery_charging_animation: "Shows a visual charging animation when charging is detected.",
  ulm_card_media_player_enable_art: "Uses the current album, program, or media image when available.",
  ulm_card_media_player_enable_controls: "Adds previous, play/pause, and next buttons.",
  ulm_card_media_player_enable_volume_slider: "Lets you adjust the media player's volume from the card.",
  ulm_card_cover_enable_slider: "Lets you set the cover position directly from the card.",
  ulm_card_cover_slider_min: "Lowest position percentage available on the slider.",
  ulm_card_cover_slider_max: "Highest position percentage available on the slider.",
  ulm_card_fan_enable_slider: "Lets you set fan speed directly from the card.",
  ulm_card_fan_slider_min: "Lowest fan speed percentage available on the slider.",
  ulm_card_fan_slider_max: "Highest fan speed percentage available on the slider.",
  ulm_card_fan_enable_button: "Adds a button that toggles fan oscillation.",
  ulm_card_fan_button_icon: "Icon displayed on the oscillation button.",
  ulm_card_binary_sensor_show_last_changed: "Displays how long ago the sensor changed state.",
  ulm_card_binary_sensor_alert_show_last_changed: "Displays how long ago the alert changed state.",
  ulm_custom_card_washer_power: "Sensor used to show the washer's current power consumption."
}, Bt = (e) => Ht[e], Wt = [
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
    upstreamId: "chip_alarm",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_alarm.yaml",
    publicId: "chip_alarm",
    rendererId: "chip_alarm",
    layoutProfile: "chip:chip",
    primitives: [
      "chip"
    ],
    customFields: [
      "icon"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
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
    dependencies: [],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "c98b22e626be1b1c8a0811c8bc591f89d13fc16bb9fd2aa84914512d409c77d3"
  },
  {
    upstreamId: "chip_back",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_back.yaml",
    publicId: "chip_navigate",
    variant: "back",
    rendererId: "chip_navigate",
    layoutProfile: "chip:chip",
    primitives: [
      "chip"
    ],
    customFields: [],
    stateDriven: !1,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_chip_back_path",
        defaultValue: '"[[[\\n  return hass[\\"panelUrl\\"];\\n]]]\\n"',
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
    sourceDigest: "38cb1ee2592701b4dd1f42d741123ef3a1fb302e0e1222b4eb5687079d08cac3"
  },
  {
    upstreamId: "chip_icon_double_state",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_icon_double_state.yaml",
    publicId: "chip_icon_double_state",
    rendererId: "chip_icon_double_state",
    layoutProfile: "chip:chip",
    primitives: [
      "chip"
    ],
    customFields: [],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_chip_icon_double_state_entity_1",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_chip_icon_double_state_entity_2",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_chip_icon_double_state_icon",
        defaultValue: "<documented/inherited>",
        selector: "icon"
      },
      {
        name: "ulm_chip_navigate_path",
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
    sourceDigest: "303cb95597893c785ec6b7993794fc93158a83aa5dff9511d1efc1d7ca0e21f7"
  },
  {
    upstreamId: "chip_icon_label",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_icon_label.yaml",
    publicId: "chip_icon_label",
    rendererId: "chip_icon_label",
    layoutProfile: "chip:chip",
    primitives: [
      "chip"
    ],
    customFields: [
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
    sourceDigest: "0a585675cfe2b54671f04265bb4151a1ffa28ab449ead4ce4887903b7fee72a6"
  },
  {
    upstreamId: "chip_icon_only",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_icon_only.yaml",
    publicId: "chip_icon_only",
    variant: "entity-icon",
    rendererId: "chip_icon_only",
    layoutProfile: "chip:chip",
    primitives: [
      "chip"
    ],
    customFields: [],
    stateDriven: !1,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_chip_icon_only",
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
    sourceDigest: "7936e16cde3ff3d9c14474e6e9aa92051ceab1e4709a38376bcbb424d28a13be"
  },
  {
    upstreamId: "chip_icon_state",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_icon_state.yaml",
    publicId: "chip_icon_state",
    variant: "entity-icon",
    rendererId: "chip_icon_state",
    layoutProfile: "chip:chip",
    primitives: [
      "chip"
    ],
    customFields: [],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_chip_icon_state_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_chip_icon_state_icon",
        defaultValue: "<documented/inherited>",
        selector: "icon"
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
    sourceDigest: "3a019caa4466259c8c67c5f67371f1fa712016df9f741181fa494c216f23124c"
  },
  {
    upstreamId: "chip_mdi_icon_only",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_mdi_icon_only.yaml",
    publicId: "chip_icon_only",
    variant: "mdi-icon",
    rendererId: "chip_icon_only",
    layoutProfile: "chip:chip",
    primitives: [
      "chip"
    ],
    customFields: [
      "icon"
    ],
    stateDriven: !1,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_chip_mdi_icon_only_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_chip_mdi_icon_only_icon",
        defaultValue: "<documented/inherited>",
        selector: "icon"
      },
      {
        name: "ulm_chip_mdi_icon_only_icon_color",
        defaultValue: "<documented/inherited>",
        selector: "color"
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
    sourceDigest: "765e0827d8853cd1f2852a4ecb2e759e2f78d6bc1a58ab0e47f8b613f1b8db1c"
  },
  {
    upstreamId: "chip_mdi_icon_state",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_mdi_icon_state.yaml",
    publicId: "chip_icon_state",
    variant: "mdi-icon",
    rendererId: "chip_icon_state",
    layoutProfile: "chip:chip",
    primitives: [
      "chip"
    ],
    customFields: [
      "icon",
      "label"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_chip_mdi_icon_state_entity",
        defaultValue: "<documented/inherited>",
        selector: "entity"
      },
      {
        name: "ulm_chip_mdi_icon_state_icon",
        defaultValue: "<documented/inherited>",
        selector: "icon"
      },
      {
        name: "ulm_chip_mdi_icon_state_icon_color",
        defaultValue: "<documented/inherited>",
        selector: "color"
      },
      {
        name: "ulm_chip_mdi_icon_state_label_color",
        defaultValue: "<documented/inherited>",
        selector: "color"
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
    sourceDigest: "72067b0eabc86014db96c91e8f8a6ddce62d69e93ebbaff43e5dd112f77dd426"
  },
  {
    upstreamId: "chip_navigate",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_navigate.yaml",
    publicId: "chip_navigate",
    variant: "path",
    rendererId: "chip_navigate",
    layoutProfile: "chip:chip",
    primitives: [
      "chip"
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
        name: "ulm_chip_navigate_icon",
        defaultValue: "<documented/inherited>",
        selector: "icon"
      },
      {
        name: "ulm_chip_navigate_icon_color",
        defaultValue: "<documented/inherited>",
        selector: "color"
      },
      {
        name: "ulm_chip_navigate_label_color",
        defaultValue: "<documented/inherited>",
        selector: "color"
      },
      {
        name: "ulm_chip_navigate_path",
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
    sourceDigest: "e546e95eef15cf427757d41ca6704df10e0a66ee37261cbd2a7bb3d23d8300d8"
  },
  {
    upstreamId: "chip_power_consumption",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_power_consumption.yaml",
    publicId: "chip_power_consumption",
    rendererId: "chip_power_consumption",
    layoutProfile: "chip:chip",
    primitives: [
      "chip"
    ],
    customFields: [],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_chip_electric_consumption",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_chip_electric_price",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_templates",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_translation_currency",
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
    backendRequirements: [],
    deviations: [],
    sourceDigest: "a30c7d5c8fb9b727512360271f04acff81af2e39a65f205030ba2185017c2ba1"
  },
  {
    upstreamId: "chip_presence_detection",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_presence_detection.yaml",
    publicId: "chip_presence_detection",
    rendererId: "chip_presence_detection",
    layoutProfile: "chip:chip",
    primitives: [
      "chip"
    ],
    customFields: [],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_chip_presence_counter_guests",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_chip_presence_counter_residents",
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
    sourceDigest: "da8b1d5f4fe612352ac768d98ee75376e5e042d01fb253c1e384ab52fb3aa73e"
  },
  {
    upstreamId: "chip_temperature",
    sourcePath: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_temperature.yaml",
    publicId: "chip_temperature",
    rendererId: "chip_temperature",
    layoutProfile: "chip:popup",
    primitives: [
      "popup"
    ],
    customFields: [],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_actions_card",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_weather_enable_popup",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_chip_temperature_inside",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_chip_temperature_outside",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_chip_temperature_weather",
        defaultValue: "<documented/inherited>",
        selector: "entity"
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
    sourceDigest: "d3a077ea5d497b5e18252f364dc04a832f06bbc3cc5e267cc06a060aea62cc5e"
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
  },
  {
    upstreamId: "custom_chip_group_counter",
    sourcePath: "custom_cards/custom_chip_group_counter",
    publicId: "custom_chip_group_counter",
    rendererId: "custom_chip_group_counter",
    layoutProfile: "chip:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [
      "icon",
      "ulm_custom_chip_group_counter_count_state"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_custom_chip_group_counter_color",
        defaultValue: '"yellow"',
        selector: "color"
      },
      {
        name: "ulm_custom_chip_group_counter_count_state",
        defaultValue: '"on"',
        selector: "text"
      },
      {
        name: "ulm_custom_chip_group_counter_entities_active",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_custom_chip_group_counter_hide_if_zero",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_chip_group_counter_icon_multiple",
        defaultValue: '"mdi:lightbulb-on-outline"',
        selector: "text"
      },
      {
        name: "ulm_custom_chip_group_counter_icon_one",
        defaultValue: '"mdi:lightbulb-on-outline"',
        selector: "text"
      },
      {
        name: "ulm_custom_chip_group_counter_icon_zero",
        defaultValue: '"mdi:lightbulb-outline"',
        selector: "text"
      },
      {
        name: "ulm_custom_chip_group_counter_type",
        defaultValue: '"light"',
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "92acf75628063b4f5ab1b76e196e0b5eac2d523a13240b27091c35900020620a"
  },
  {
    upstreamId: "custom_chip_moon",
    sourcePath: "custom_cards/custom_chip_moon",
    publicId: "custom_chip_moon",
    rendererId: "custom_chip_moon",
    layoutProfile: "chip:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [],
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
    sourceDigest: "f25ad314b6c462dd78529beffad8b94e984a96b0758eb16317db2999bdd244c3"
  },
  {
    upstreamId: "custom_chip_myenedis",
    sourcePath: "custom_cards/custom_chip_myenedis",
    publicId: "custom_chip_myenedis",
    rendererId: "custom_chip_myenedis",
    layoutProfile: "chip:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [],
    stateDriven: !1,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_chip_separate_hp_hc",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_chip_unit_of_measurement",
        defaultValue: '"[[[ return entity.attributes.unit_of_measurement ]]]"',
        selector: "text"
      },
      {
        name: "ulm_chips",
        defaultValue: "<documented/inherited>",
        selector: "text"
      }
    ],
    dependencies: [
      "button-card"
    ],
    backendRequirements: [],
    deviations: [],
    sourceDigest: "875aea54ddef05282f7c4ffdbbfe1f74653ddba45fe54628538722f38e4076e6"
  },
  {
    upstreamId: "custom_chip_simple_temp",
    sourcePath: "custom_cards/custom_chip_simple_temp",
    publicId: "custom_chip_simple_temp",
    rendererId: "custom_chip_simple_temp",
    layoutProfile: "chip:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
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
    sourceDigest: "ecf9b6e9496452fda77d86d585c14941c456926944453f2cfcc1a8e6929cb2e9"
  },
  {
    upstreamId: "custom_chip_tesla_temperature",
    sourcePath: "custom_cards/custom_chip_tesla_temperature",
    publicId: "custom_chip_tesla_temperature",
    rendererId: "custom_chip_tesla_temperature",
    layoutProfile: "chip:button-card+popup",
    primitives: [
      "button-card",
      "popup"
    ],
    customFields: [],
    stateDriven: !0,
    animated: !1,
    actions: [],
    variables: [
      {
        name: "ulm_card_enable_popup",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_chip_hvac",
        defaultValue: "<documented/inherited>",
        selector: "text"
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
    backendRequirements: [],
    deviations: [],
    sourceDigest: "740217697fe64011b02c4661db67e09cebfa2656db2d7adb538d3a0a1d46a022"
  },
  {
    upstreamId: "custom_chip_update",
    sourcePath: "custom_cards/custom_chip_update",
    publicId: "custom_chip_update",
    rendererId: "custom_chip_update",
    layoutProfile: "chip:button-card",
    primitives: [
      "button-card"
    ],
    customFields: [],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action"
    ],
    variables: [
      {
        name: "ulm_chip_update_path",
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
    sourceDigest: "6d8c7878a98effbfdc81a758068e46dd2a43b5dbe48bb5bf5e79f7e670f95b04"
  },
  {
    upstreamId: "custom_chip_vlape_garage",
    sourcePath: "custom_cards/custom_chip_vlape_garage",
    publicId: "custom_chip_vlape_garage",
    rendererId: "custom_chip_vlape_garage",
    layoutProfile: "chip:button-card",
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
    sourceDigest: "e05f2f69014863af19db2573585c8b9d3e267e1006b4cbe5abfffd907066e83e"
  }
], ye = new Map(Wt.map((e) => [e.upstreamId, e])), Gt = (e) => /popup|browser_mod/i.test(e), Kt = {
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
    "ulm_card_light_brightness_high"
  ],
  battery: [
    "ulm_card_battery_battery_level_danger",
    "ulm_card_battery_battery_level_warning",
    "ulm_card_battery_charging_animation"
  ],
  media: [
    "ulm_card_media_player_enable_art",
    "ulm_card_media_player_enable_controls",
    "ulm_card_media_player_enable_volume_slider"
  ],
  cover: [
    "ulm_card_cover_enable_slider",
    "ulm_card_cover_slider_min",
    "ulm_card_cover_slider_max"
  ],
  control: [
    "ulm_card_fan_enable_slider",
    "ulm_card_fan_slider_min",
    "ulm_card_fan_slider_max",
    "ulm_card_fan_enable_button",
    "ulm_card_fan_button_icon"
  ]
}, Jt = {
  card_binary_sensor: ["ulm_card_binary_sensor_show_last_changed"],
  card_binary_sensor_alert: ["ulm_card_binary_sensor_alert_show_last_changed"],
  custom_card_haven_washer: ["ulm_custom_card_washer_power"]
}, Qe = (e, t) => !Gt(t) && ([e.upstreamId, ...e.sourceIds ?? []].some((a) => Jt[a]?.includes(t) === !0) || Kt[e.family]?.includes(t) === !0), x = (e, t = "entity") => ({
  name: t,
  selector: { entity: e?.length ? { domain: e } : {} }
}), G = (e) => ({ name: e, selector: { text: {} } }), k = (e) => ({ name: e, selector: { boolean: {} } }), Yt = (e, t = 1, a = 168) => ({
  name: e,
  selector: { number: { min: t, max: a, mode: "box" } }
}), ae = (e) => ({ name: e, selector: { ui_action: {} } }), q = (e, t) => ({
  name: e,
  selector: { select: { mode: "dropdown", options: t } }
}), Zt = /* @__PURE__ */ new Set([
  "ulm_card_light_enable_slider_minSet",
  "ulm_card_light_enable_slider_maxSet",
  "ulm_card_light_brightness_low",
  "ulm_card_light_brightness_medium",
  "ulm_card_light_brightness_high",
  "ulm_card_battery_battery_level_danger",
  "ulm_card_battery_battery_level_warning",
  "ulm_card_cover_slider_min",
  "ulm_card_cover_slider_max",
  "ulm_card_fan_slider_min",
  "ulm_card_fan_slider_max"
]), Xt = {
  ulm_card_weather_primary_info: [
    { value: "extrema", label: "Today's high and low temperatures" },
    { value: "none", label: "Do not show extra information" }
  ],
  ulm_card_weather_secondary_info: [
    { value: "precipitation", label: "Precipitation chance or amount" },
    { value: "none", label: "Do not show extra information" }
  ]
}, _e = () => [
  q("name_mode", [
    { value: "entity", label: "Use entity name" },
    { value: "custom", label: "Use custom name" },
    { value: "none", label: "Hide name" }
  ]),
  G("name"),
  { name: "icon", selector: { icon: {} } },
  q("icon_type", [
    { value: "icon", label: "Icon" },
    { value: "entity-picture", label: "Entity picture" },
    { value: "none", label: "No icon" }
  ]),
  q("layout", [
    { value: "default", label: "Automatic" },
    { value: "horizontal", label: "Horizontal" },
    { value: "vertical", label: "Vertical" }
  ]),
  k("fill_container"),
  q("primary_info", [
    { value: "name", label: "Name" },
    { value: "state", label: "State" },
    { value: "none", label: "None" }
  ]),
  q("secondary_info", [
    { value: "default", label: "Recommended card information" },
    { value: "state", label: "State" },
    { value: "name", label: "Name" },
    { value: "last-changed", label: "Last changed" },
    { value: "none", label: "None" }
  ])
], y = (e) => [
  x(e.preferredDomains),
  ...e.variants?.length ? [q("variant", e.variants.map((t) => ({
    value: t,
    label: e.variantLabels?.[t] ?? t.replaceAll("-", " ").replace(/\b\w/g, (a) => a.toUpperCase())
  })))] : [],
  ..._e()
], Le = {
  weather: (e) => [
    ...y(e),
    x(["sensor"], "temperature_entity"),
    x(["sensor"], "humidity_entity"),
    k("show_forecast")
  ],
  climate: (e) => [...y(e), x(["sensor"], "humidity_entity"), k("show_controls")],
  light: (e) => [...y(e)],
  scene: (e) => [...y(e), { name: "entities", selector: { entity: { domain: ["scene"], multiple: !0 } } }],
  presence: (e, t) => [
    ...y(e),
    ...t?.variant === "small" ? [] : [
      x(["sensor"], "battery_entity"),
      x(["sensor"], "eta_entity"),
      x(["sensor"], "address_entity")
    ],
    k("use_entity_picture")
  ],
  battery: (e) => [...y(e)],
  energy: (e) => [...y(e), x(["sensor"], "min_entity"), x(["sensor"], "max_entity"), k("show_graph")],
  sensor: (e) => [...y(e), k("show_graph")],
  media: (e) => [...y(e), k("show_controls"), ...e.upstreamId === "custom_card_playstation" ? [{ name: "console_platform", selector: { select: { options: ["ps5", "xbox"] } } }] : []],
  cover: (e) => [...y(e), k("show_controls")],
  vacuum: (e) => [...y(e), k("show_controls")],
  security: (e) => [...y(e)],
  navigation: (e) => [
    ...e.variants?.length ? [q("variant", e.variants.map((t) => ({
      value: t,
      label: e.variantLabels?.[t] ?? t
    })))] : [],
    ..._e(),
    G("navigation_path")
  ],
  chips: () => [],
  text: () => [..._e(), G("secondary")],
  camera: (e) => [...y(e)],
  control: (e) => [
    ...y(e),
    .../power_outlet|more_power_outlet/.test(e.upstreamId) ? [x(["sensor"], "graph_entity"), k("show_graph")] : [],
    k("show_controls")
  ],
  "alarm-time": (e) => [...y(e), x(["input_datetime"], "datetime_entity"), k("show_controls")],
  door: (e) => [...y(e), x(["lock"], "lock_entity"), x(["sensor"], "battery_entity"), k("show_controls")],
  entity: (e) => [...y(e), G("secondary")]
}, Qt = (e, t) => [
  ...(Le[e.family] ?? Le.entity)(e, t),
  ae("tap_action"),
  ae("hold_action"),
  ae("double_tap_action")
], ea = (e, t) => {
  const a = t?.variant ? (e.sourceIds ?? [e.upstreamId]).filter((n) => je(n) === t.variant || n === e.upstreamId && je(n) === void 0) : e.sourceIds ?? [e.upstreamId];
  return [...new Map(
    a.flatMap((n) => ye.get(n)?.variables ?? []).map((n) => [n.name, n])
  ).values()].filter((n) => Qe(e, n.name)).map((n) => {
    const i = Xt[n.name];
    if (i) return q(n.name, i);
    if (Zt.has(n.name))
      return {
        name: n.name,
        selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
      };
    switch (n.selector) {
      case "entity":
        return x(void 0, n.name);
      case "entity-multiple":
        return {
          name: n.name,
          selector: { entity: { multiple: !0 } }
        };
      case "action":
        return ae(n.name);
      case "icon":
        return { name: n.name, selector: { icon: {} } };
      case "color":
        return { name: n.name, selector: { ui_color: {} } };
      case "boolean":
        return k(n.name);
      case "number":
        return Yt(n.name, -1e5, 1e5);
      case "object":
        return { name: n.name, selector: { object: {} } };
      default:
        return G(n.name);
    }
  });
}, ta = [
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
], et = (e, t) => t?.attributes.icon ? t.attributes.icon : e.upstreamId === "custom_card_playstation" && t?.entity_id.toLowerCase().includes("xbox") ? "mdi:microsoft-xbox" : ta.find(([a]) => a.test(e.upstreamId))?.[1] ?? (e.kind === "chip" ? "mdi:circle-small" : "mdi:information-outline"), aa = (e) => {
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
}, ra = (e) => {
  const t = {};
  for (const a of e.sourceIds ?? [e.upstreamId])
    for (const r of ye.get(a)?.variables ?? []) {
      if (!Qe(e, r.name)) continue;
      const n = aa(r.defaultValue);
      n !== void 0 && (t[r.name] = n);
    }
  return t;
}, tt = (e, t, a) => {
  const r = a ? t?.states[a] : void 0;
  return {
    type: `custom:${e.tag}`,
    ...ra(e),
    entity: a,
    name: r?.attributes.friendly_name,
    icon: et(e, r),
    show_icon: !0,
    show_state: !0,
    layout: "horizontal"
  };
};
var na = Object.defineProperty, ia = Object.getOwnPropertyDescriptor, ve = (e, t, a, r) => {
  for (var n = r > 1 ? void 0 : r ? ia(t, a) : t, i = e.length - 1, o; i >= 0; i--)
    (o = e[i]) && (n = (r ? o(t, a, n) : o(n)) || n);
  return r && n && na(t, a, n), n;
};
let Z = class extends L {
  constructor() {
    super(...arguments), this.computeLabel = (e) => Nt(this.hass, e.name), this.computeHelper = (e) => Bt(e.name), this.valueChanged = (e) => {
      if (!this.config || !e.detail.value) return;
      const t = e.detail.value, a = { ...this.config, ...t };
      this.config = a, B(this, "config-changed", { config: a });
    }, this.addChip = () => {
      if (!this.config) return;
      const e = O.find((t) => t.kind === "chip");
      e && (this.config = {
        ...this.config,
        chips: [...this.config.chips ?? [], { type: `custom:${e.tag}`, show_icon: !0, show_state: !0 }]
      }, B(this, "config-changed", { config: this.config }));
    };
  }
  setConfig(e) {
    const t = e.type.replace(/^custom:/, ""), a = ie.find((n) => n.tag === t), r = e.chips?.map((n) => {
      const i = ie.find((o) => o.tag === n.type.replace(/^custom:/, ""));
      return i ? {
        ...n,
        type: `custom:${i.targetTag}`,
        variant: n.variant ?? i.variant
      } : n;
    });
    this.config = {
      ...e,
      variant: e.variant ?? a?.variant,
      chips: r
    };
  }
  render() {
    if (!this.hass || !this.config) return d;
    const e = ee(this.config.type.replace(/^custom:/, ""));
    if (e?.kind === "container") {
      const n = O.filter((i) => i.kind === "chip");
      return l`<div class="chips">
        ${(this.config.chips ?? []).map((i, o) => l`
          <div class="chip-row">
            <select
              aria-label="Chip type"
              .value=${i.type}
              @change=${(c) => this.updateChip(o, "type", c.target.value)}
            >
              ${n.map((c) => l`
                <option value=${`custom:${c.tag}`} ?selected=${i.type === `custom:${c.tag}`}>
                  ${c.name}
                </option>
              `)}
            </select>
            ${(() => {
        const c = ee(i.type.replace(/^custom:/, ""));
        return c?.variants?.length ? l`
                <select
                  aria-label="Chip style"
                  .value=${i.variant ?? c.variants[0]}
                  @change=${(s) => this.updateChip(o, "variant", s.target.value)}
                >
                  ${c.variants.map((s) => l`
                    <option value=${s} ?selected=${i.variant === s}>
                      ${c.variantLabels?.[s] ?? s}
                    </option>
                  `)}
                </select>
              ` : l`<span></span>`;
      })()}
            <ha-entity-picker
              .hass=${this.hass}
              aria-label="Entity ID"
              .value=${i.entity ?? ""}
              .includeDomains=${ee(i.type.replace(/^custom:/, ""))?.preferredDomains}
              @value-changed=${(c) => this.updateChip(o, "entity", c.detail.value ?? "")}
            ></ha-entity-picker>
            <button class="remove" @click=${() => this.removeChip(o)} aria-label="Remove chip">Remove</button>
          </div>
        `)}
        <button @click=${this.addChip}>Add chip</button>
      </div>`;
    }
    if (!e) return d;
    const t = Qt(e, this.config), a = ea(e, this.config), r = { ...tt(e, this.hass, this.config.entity), ...this.config };
    return l`
      <ha-form
        .hass=${this.hass}
        .data=${r}
        .schema=${t}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
      ${a.length ? l`
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
      ` : d}
    `;
  }
  removeChip(e) {
    this.config && (this.config = {
      ...this.config,
      chips: (this.config.chips ?? []).filter((t, a) => a !== e)
    }, B(this, "config-changed", { config: this.config }));
  }
  updateChip(e, t, a) {
    this.config && (this.config = {
      ...this.config,
      chips: (this.config.chips ?? []).map((r, n) => n === e ? t === "type" ? {
        ...r,
        type: a,
        variant: ee(a.replace(/^custom:/, ""))?.variants?.[0]
      } : { ...r, [t]: a || void 0 } : r)
    }, B(this, "config-changed", { config: this.config }));
  }
};
Z.styles = Be`
    .chips { display: grid; gap: 12px; }
    .chip-row {
      display: grid;
      grid-template-columns: minmax(150px, 1fr) minmax(130px, 1fr) minmax(150px, 1fr) auto;
      align-items: center;
      gap: 8px;
    }
    select, input {
      box-sizing: border-box;
      width: 100%;
      min-height: 40px;
      padding: 0 10px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    button {
      min-height: 40px;
      border: 0;
      border-radius: 4px;
      padding: 0 12px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      cursor: pointer;
    }
    .remove { background: var(--error-color); }
  `;
ve([
  se({ attribute: !1 })
], Z.prototype, "hass", 2);
ve([
  At()
], Z.prototype, "config", 2);
Z = ve([
  Pt("mushroom-addition-editor")
], Z);
const oa = Be`
  :host {
    --ulm-blue: 3, 169, 244;
    --ulm-yellow: 255, 193, 7;
    --ulm-red: 244, 67, 54;
    --ulm-green: 76, 175, 80;
    --ulm-purple: 156, 39, 176;
    --ulm-grey: 120, 120, 120;
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
  .ulm-climate > .metric-pill { margin-left: 66px; }
  .ulm-climate > .ulm-controls { float: right; margin: -36px 12px 0 0; }
  .ulm-person .person-picture {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
  }
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
  @keyframes ulm-charge { from { transform: scale(.92); } to { transform: scale(1.06); } }
  .ulm-metric { padding: 0 12px 12px; }
  .metric-heading { padding-left: 0; padding-right: 0; }
  .metric-value { color: rgb(var(--ulm-blue)); font-size: 20px; font-weight: 650; }
  .sparkline { width: 100%; height: 48px; overflow: visible; }
  .sparkline polyline { fill: none; stroke: rgb(var(--ulm-blue)); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
  .metric-extremes { display: flex; justify-content: space-between; color: var(--secondary-text-color); font-size: 11px; }
  .ulm-scenes { padding: 12px; }
  .scene-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; }
  .scene-button { display: flex; min-width: 0; flex-direction: column; align-items: center; gap: 5px; padding: 9px 5px; border-radius: 12px; }
  .scene-button span { width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }
  .scene-button ha-icon { --mdc-icon-size: 19px; color: rgb(var(--ulm-purple)); }
  .ulm-media { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 12px; padding: 12px; }
  .media-art { width: 54px; height: 54px; border-radius: 12px; background-position: center; background-size: cover; }
  .ulm-media .ulm-controls { grid-column: 1 / -1; justify-content: center; }
  .ulm-vacuum, .ulm-security { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; }
  .ulm-vacuum .ulm-controls { grid-column: 1 / -1; justify-content: center; }
  .security-status { padding: 5px 9px; border-radius: 10px; background: rgba(var(--ulm-green), .12); color: rgb(var(--ulm-green)); font-size: 11px; font-weight: 700; }
  .ulm-navigation { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; }
  .ulm-fan { display: grid; gap: 10px; padding: 0 12px 12px; }
  .ulm-fan > .ulm-row { padding-left: 0; padding-right: 0; }
  .ulm-fan > .ulm-slider { width: 100%; accent-color: rgb(var(--ulm-blue)); }
  .ulm-room { display: grid; gap: 10px; padding: 0 12px 12px; }
  .ulm-room > .ulm-row { padding-left: 0; padding-right: 0; }
  .room-entities { display: flex; flex-wrap: wrap; gap: 7px; }
  .ulm-camera { position: relative; min-height: 150px; overflow: hidden; background: rgba(var(--ulm-grey), .08); }
  .ulm-camera img { display: block; width: 100%; height: 180px; object-fit: cover; }
  .camera-placeholder { display: grid; min-height: 150px; place-items: center; }
  .camera-caption { position: absolute; right: 10px; bottom: 10px; left: 10px; padding: 9px; border-radius: 10px; background: rgba(255,255,255,.88); backdrop-filter: blur(8px); }
  .ulm-generic-swap { grid-template-columns: minmax(0, 1fr) auto; }
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
  .ulm-title { display: flex; align-items: center; gap: 10px; padding: 8px 2px; box-shadow: none; background: transparent; }
  .ulm-title .ulm-name { font-size: 18px; }
  .ulm-title.variant-divider-title { padding-bottom: 10px; border-bottom: 2px solid var(--divider-color); }
  .ulm-title.variant-divider-subtitle { padding-bottom: 7px; border-bottom: 1px solid var(--divider-color); }
  .ulm-title.variant-divider-subtitle .ulm-name { color: var(--secondary-text-color); font-size: 14px; }
  .ulm-vertical-button { display: flex; min-height: 96px; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 12px; text-align: center; }
  .ulm-vertical-button .ulm-copy { align-items: center; }
  .ulm-binary.is-alert { background: rgba(var(--ulm-red), .1); }
  .chip-icon-only { padding-right: 7px; }
  .chip-double-state b + b { padding-left: 6px; border-left: 1px solid var(--divider-color); }
  .ulm-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 34px;
    padding: 0 11px;
    border-radius: 17px;
    background: var(--ha-card-background, var(--card-background-color));
    box-shadow: var(--ha-card-box-shadow, 0 2px 7px rgba(0,0,0,.07));
    font-size: 12px;
  }
  .ulm-chip .ulm-icon { width: 25px; height: 25px; margin-left: -7px; }
  .ulm-chip .ulm-icon ha-icon { --mdc-icon-size: 16px; }
  .ulm-chip b { color: var(--secondary-text-color); font-weight: 500; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 8px; }
  .preview { padding: 16px; color: var(--secondary-text-color); text-align: center; }
`, g = (e, t) => e?.attributes[t], C = (e) => {
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, V = (e, t) => {
  const a = e.config[t];
  return typeof a == "string" ? e.hass.states[a] : void 0;
}, _ = (e, ...t) => {
  for (const a of t)
    if (e.config[a] !== void 0) return e.config[a];
}, la = (e, t, ...a) => _(e, String(t), ...a) === !0, sa = (e, t) => e.config.icon || e.entity?.attributes.icon || et(e.descriptor, e.entity) || t, h = (e, t, a = "blue", r = "") => {
  if (e.config.icon_type === "none" || e.config.show_icon === !1) return d;
  const n = e.config.icon_type === "entity-picture" ? g(e.entity, "entity_picture") : void 0;
  return n ? l`<span class="ulm-icon entity-picture ${r}" style=${`background-image:url("${String(n)}")`}></span>` : l`<span class="ulm-icon tone-${a} ${r}"><ha-icon .icon=${sa(e, t)}></ha-icon></span>`;
}, Me = (e, t) => {
  switch (e.config.secondary_info) {
    case "none":
      return;
    case "name":
      return D(e.config, e.entity);
    case "state":
      return u(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    default:
      return e.config.secondary || t;
  }
}, Ue = (e) => e.config.primary_info === "none" ? "" : e.config.primary_info === "state" ? u(e.entity) : D(e.config, e.entity), f = (e, t) => l`
  <span class="ulm-copy">
    ${Ue(e) ? l`<span class="ulm-name">${Ue(e)}</span>` : d}
    ${Me(e, t) ? l`<span class="ulm-label">${Me(e, t)}</span>` : d}
  </span>
`, v = (e, t, a) => l`
  <button class="ulm-control" aria-label=${e} @pointerdown=${(r) => r.stopPropagation()} @click=${a}>
    <ha-icon .icon=${t}></ha-icon>
  </button>
`, Te = {
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
  windy: ["mdi:weather-windy", "grey"]
}, ca = (e) => {
  const t = e.entity?.state ?? "unknown", [a, r] = Te[t] ?? ["mdi:weather-partly-cloudy", "grey"], n = V(e, "temperature_entity"), i = V(e, "humidity_entity"), o = u(n) !== "Entity unavailable" ? u(n) : `${g(e.entity, "temperature") ?? "—"}${g(e.entity, "temperature_unit") ?? "°"}`, c = u(i) !== "Entity unavailable" ? u(i) : `${g(e.entity, "humidity") ?? "—"}%`, s = e.forecast?.slice(0, 4) ?? [], m = e.config.variant === "native", b = _(e, "ulm_card_weather_backdrop") === !0, p = _(e, "ulm_card_weather_primary_info") ?? "extrema", $ = _(e, "ulm_card_weather_secondary_info") ?? "precipitation";
  return e.actionSurface(`ulm-weather ${b ? "has-backdrop" : ""}`, l`
    <div class="weather-main">
      <span class="ulm-icon weather-icon tone-${r}"><ha-icon .icon=${a}></ha-icon></span>
      <div class="weather-summary">
        <span class="weather-temp">${o}</span>
        <span class="ulm-name">${D(e.config, e.entity)}</span>
        <span class="ulm-label weather-condition">${t.replaceAll("-", " ")}</span>
        ${!m && s[0] && p === "extrema" ? l`<span class="weather-extrema">H ${String(s[0].temperature ?? "—")}° · L ${String(s[0].templow ?? s[0].temperature_low ?? "—")}°</span>` : d}
        ${!m && $ === "precipitation" && s[0]?.precipitation_probability !== void 0 ? l`<span class="weather-extrema">${s[0].precipitation_probability}% precipitation</span>` : $ === "precipitation" && s[0]?.precipitation !== void 0 ? l`<span class="weather-extrema">${s[0].precipitation}${String(g(e.entity, "precipitation_unit") ?? " mm")} precipitation</span>` : d}
      </div>
    </div>
    ${m ? d : l`<div class="weather-metrics">
      <span class="metric-pill"><ha-icon icon="mdi:water-percent"></ha-icon>${c}</span>
      <span class="metric-pill"><ha-icon icon="mdi:thermometer"></ha-icon>${o}</span>
    </div>`}
    ${!m && e.config.show_forecast && s.length ? l`
      <div class="weather-forecast">
        ${s.map((w) => {
    const P = String(w.condition ?? "cloudy");
    return l`<span><ha-icon .icon=${Te[P]?.[0] ?? "mdi:weather-cloudy"}></ha-icon><b>${String(w.temperature ?? "—")}°</b></span>`;
  })}
      </div>
    ` : d}
  `);
}, da = (e) => {
  const t = e.entity?.state === "on", a = C(g(e.entity, "brightness")), r = a === void 0 ? void 0 : Math.round(a / 2.55), n = la(e, "show_controls", "ulm_card_light_enable_slider"), i = _(e, "ulm_card_light_enable_buttons") === !0, o = _(e, "ulm_card_light_enable_collapse") === !0 && !t, c = e.config.layout === "horizontal" || _(e, "ulm_card_light_enable_horizontal") === !0, s = _(e, "ulm_card_light_brightness_low") ?? 1, m = _(e, "ulm_card_light_brightness_medium") ?? 50, b = _(e, "ulm_card_light_brightness_high") ?? 100, p = _(e, "ulm_card_light_enable_slider_minSet") ?? 0, $ = _(e, "ulm_card_light_enable_slider_maxSet") ?? 100, w = _(e, "ulm_card_light_enable_color") === !0 ? g(e.entity, "rgb_color") : void 0, P = Array.isArray(w) && w.length >= 3 ? w.slice(0, 3).map(Number).join(",") : "255,152,0", rt = _(e, "ulm_card_light_force_background_color") === !0 && t, $e = `--light-rgb:${P};${rt ? `background:rgba(${P},.2);` : ""}`;
  return e.actionSurface(`ulm-light-card ${c ? "is-horizontal" : ""} ${o ? "is-collapsed" : ""}`, l`
    <div class="light-header ${t ? "is-active" : ""}" style=${$e}>
      ${h(e, "mdi:lightbulb", t ? "yellow" : "grey", "light-icon")}
      ${f(e, r === void 0 ? u(e.entity) : `${u(e.entity)} · ${r}%`)}
    </div>
    ${!o && n ? l`
      <div class="ulm-light-slider" style=${`${$e}--light-level:${Math.max(0, Math.min(100, r ?? 0))}%;`}>
        <i></i>
        <input type="range" .min=${String(p)} .max=${String($)} .value=${String(r ?? 0)}
          aria-label="Brightness"
          @pointerdown=${(S) => S.stopPropagation()}
          @click=${(S) => S.stopPropagation()}
          @change=${(S) => e.service("light", "turn_on", { entity_id: e.config.entity, brightness_pct: Number(S.target.value) })}>
      </div>
    ` : d}
    ${!o && i ? l`<div class="ulm-controls brightness-presets">
      ${[s, m, b].map((S) => v(`${S}% brightness`, "mdi:brightness-6", (nt) => {
    nt.stopPropagation(), e.service("light", "turn_on", { entity_id: e.config.entity, brightness_pct: S });
  }))}
    </div>` : d}
  `);
}, ua = (e) => {
  const t = g(e.entity, "current_temperature") ?? "—", a = g(e.entity, "temperature") ?? "—", r = V(e, "humidity_entity");
  return e.actionSurface("ulm-climate", l`
    <div class="climate-top">
      ${h(e, "mdi:thermostat", I.has(e.entity?.state ?? "") ? "red" : "blue")}
      ${f(e, `${e.entity?.state ?? "unknown"} · ${t}°`)}
      <span class="climate-target">${a}°</span>
    </div>
    ${r ? l`<span class="metric-pill"><ha-icon icon="mdi:water-percent"></ha-icon>${u(r)}</span>` : d}
    ${e.config.show_controls ? l`<div class="ulm-controls">
      ${v("Decrease temperature", "mdi:minus", (n) => {
    n.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: Number(a) - 0.5 });
  })}
      ${v("Increase temperature", "mdi:plus", (n) => {
    n.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: Number(a) + 0.5 });
  })}
    </div>` : d}
  `);
}, _a = (e) => {
  const t = V(e, "battery_entity"), a = V(e, "eta_entity"), r = V(e, "address_entity"), n = e.config.icon_type === "entity-picture" || e.config.use_entity_picture ? g(e.entity, "entity_picture") : void 0, i = e.config.variant === "small";
  return e.actionSurface(`ulm-row ulm-person ${i ? "is-compact" : ""}`, l`
    ${n ? l`<span class="person-picture" style=${`background-image:url("${String(n)}")`}></span>` : h(e, "mdi:account", e.entity?.state === "home" ? "blue" : "green")}
    ${f(e, [u(r || e.entity), a ? `ETA ${u(a)}` : ""].filter(Boolean).join(" · "))}
    ${i ? d : t ? l`<span class="battery-ring">${u(t)}</span>` : l`<span class="presence-dot ${e.entity?.state === "home" ? "home" : "away"}"></span>`}
  `);
}, ma = (e) => {
  const t = C(e.entity?.state) ?? 0, a = !!g(e.entity, "is_charging") || String(e.entity?.state).includes("charging"), r = _(e, "ulm_card_battery_battery_level_danger") ?? 20, n = _(e, "ulm_card_battery_battery_level_warning") ?? 50, i = t < r ? "red" : t < n ? "yellow" : "green", o = _(e, "ulm_card_battery_charging_animation") === !0 && a;
  return e.actionSurface(`ulm-battery ${o ? "is-charging" : ""}`, l`
    ${h(e, a ? "mdi:battery-charging" : "mdi:battery", i)}
    ${f(e, a ? "Charging" : "Battery level")}
    <span class="battery-value">${Math.round(t)}<small>%</small></span>
    <span class="battery-track"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>
  `);
}, pa = (e) => {
  const t = Array.isArray(g(e.entity, "history")) ? g(e.entity, "history").map(Number).filter(Number.isFinite).slice(-12) : [20, 28, 24, 42, 35, 52, 48, 63, 55, 70, 62, 78], a = Math.min(...t), r = Math.max(...t), n = t.map((i, o) => `${o / Math.max(1, t.length - 1) * 100},${36 - (i - a) / Math.max(1, r - a) * 32}`).join(" ");
  return l`<svg class="sparkline" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><polyline points=${n}></polyline></svg>`;
}, ha = (e) => e.actionSurface("ulm-metric", l`
  <div class="metric-heading">${h(e, e.descriptor.family === "energy" ? "mdi:flash" : "mdi:chart-line", "blue")}${f(e, e.entity?.attributes.unit_of_measurement ? String(e.entity.attributes.unit_of_measurement) : "Current value")}<span class="metric-value">${u(e.entity)}</span></div>
  ${e.config.show_graph !== !1 ? pa(e) : d}
  ${V(e, "min_entity") || V(e, "max_entity") ? l`<div class="metric-extremes"><span>Min ${u(V(e, "min_entity"))}</span><span>Max ${u(V(e, "max_entity"))}</span></div>` : d}
`), fa = (e) => {
  const t = (e.config.entities?.length ? e.config.entities : e.config.entity ? [e.config.entity] : []).slice(0, 6);
  return e.actionSurface("ulm-scenes", l`
    ${f(e, `${t.length} scenes`)}
    <div class="scene-grid">${t.map((a) => l`
      <button class="scene-button" @pointerdown=${(r) => r.stopPropagation()} @click=${(r) => {
    r.stopPropagation(), e.service("scene", "turn_on", { entity_id: a });
  }}><ha-icon icon="mdi:palette"></ha-icon><span>${D({ entity: a }, e.hass.states[a])}</span></button>
    `)}</div>
  `);
}, ba = (e) => {
  const t = _(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : g(e.entity, "entity_picture"), r = (e.config.console_platform || e.config.variant) === "xbox" ? "mdi:microsoft-xbox" : "mdi:sony-playstation", n = e.config.entity?.startsWith("media_player.") === !0;
  return e.actionSurface("ulm-media", l`
    ${t ? l`<span class="media-art" style=${`background-image:url("${String(t)}")`}></span>` : h(e, e.descriptor.upstreamId === "custom_card_playstation" ? r : "mdi:play-circle", "purple")}
    ${f(e, String(g(e.entity, "media_title") ?? u(e.entity)))}
    ${n && (e.config.show_controls !== !1 || _(e, "ulm_card_media_player_enable_controls") === !0) ? l`<div class="ulm-controls">
      ${v("Previous", "mdi:skip-previous", (i) => {
    i.stopPropagation(), e.service("media_player", "media_previous_track", { entity_id: e.config.entity });
  })}
      ${v("Play or pause", "mdi:play-pause", (i) => {
    i.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: e.config.entity });
  })}
      ${v("Next", "mdi:skip-next", (i) => {
    i.stopPropagation(), e.service("media_player", "media_next_track", { entity_id: e.config.entity });
  })}
    </div>` : d}
    ${n && _(e, "ulm_card_media_player_enable_volume_slider") === !0 ? l`
      <input class="ulm-slider" type="range" min="0" max="100"
        .value=${String(Math.round(Number(g(e.entity, "volume_level") ?? 0) * 100))}
        @pointerdown=${(i) => i.stopPropagation()}
        @change=${(i) => e.service("media_player", "volume_set", {
    entity_id: e.config.entity,
    volume_level: Number(i.target.value) / 100
  })}>
    ` : d}
  `);
}, ga = (e) => {
  const t = e.config.entity?.startsWith("cover.") === !0;
  return e.actionSurface(`ulm-row ${_(e, "ulm_card_cover_enable_horizontal") ? "is-horizontal" : ""}`, l`
  ${h(e, "mdi:window-shutter", e.entity?.state === "open" ? "blue" : "grey")}
  ${f(e, u(e.entity))}
  ${t && e.config.show_controls !== !1 ? l`<div class="ulm-controls">
    ${v("Open", "mdi:arrow-up", (a) => {
    a.stopPropagation(), e.service("cover", "open_cover", { entity_id: e.config.entity });
  })}
    ${v("Stop", "mdi:stop", (a) => {
    a.stopPropagation(), e.service("cover", "stop_cover", { entity_id: e.config.entity });
  })}
    ${v("Close", "mdi:arrow-down", (a) => {
    a.stopPropagation(), e.service("cover", "close_cover", { entity_id: e.config.entity });
  })}
  </div>` : d}
  ${t && _(e, "ulm_card_cover_enable_slider") === !0 ? l`
    <input class="ulm-slider" type="range"
      min=${String(_(e, "ulm_card_cover_slider_min") ?? 0)}
      max=${String(_(e, "ulm_card_cover_slider_max") ?? 100)}
      .value=${String(g(e.entity, "current_position") ?? 0)}
      @pointerdown=${(a) => a.stopPropagation()}
      @change=${(a) => e.service("cover", "set_cover_position", {
    entity_id: e.config.entity,
    position: Number(a.target.value)
  })}>
  ` : d}
  `);
}, ya = (e) => e.actionSurface("ulm-vacuum", l`
  ${h(e, "mdi:robot-vacuum", e.entity?.state === "cleaning" ? "blue" : "grey")}
  ${f(e, u(e.entity))}
  <span class="metric-pill"><ha-icon icon="mdi:battery"></ha-icon>${String(g(e.entity, "battery_level") ?? "—")}%</span>
  ${e.config.show_controls !== !1 ? l`<div class="ulm-controls">
    ${v("Start", "mdi:play", (t) => {
  t.stopPropagation(), e.service("vacuum", "start", { entity_id: e.config.entity });
})}
    ${v("Pause", "mdi:pause", (t) => {
  t.stopPropagation(), e.service("vacuum", "pause", { entity_id: e.config.entity });
})}
    ${v("Return home", "mdi:home-map-marker", (t) => {
  t.stopPropagation(), e.service("vacuum", "return_to_base", { entity_id: e.config.entity });
})}
  </div>` : d}
`), va = (e) => {
  const t = e.entity?.state.startsWith("armed") || e.entity?.state === "locked";
  return e.actionSurface(`ulm-security ${t ? "is-armed" : ""}`, l`
    ${h(e, t ? "mdi:shield-lock" : "mdi:shield-off", t ? "green" : "red")}
    ${f(e, u(e.entity))}
    ${e.config.show_controls ? l`<span class="security-status">${t ? "Secured" : "Attention"}</span>` : d}
  `);
}, wa = (e) => e.actionSurface("ulm-navigation", l`
  ${h(e, e.descriptor.upstreamId.includes("back") ? "mdi:arrow-left" : "mdi:arrow-right", "blue")}
  ${f(e, e.config.secondary || e.config.navigation_path || "Navigate")}
  <ha-icon icon="mdi:chevron-right"></ha-icon>
`), Va = (e, t) => {
  const a = e?.split(".", 1)[0] ?? "homeassistant";
  return a === "script" ? ["script", t === "on" ? "turn_on" : "turn_off"] : a === "fan" ? ["fan", t === "on" ? "turn_on" : "turn_off"] : a === "water_heater" ? ["water_heater", t === "on" ? "turn_on" : "turn_off"] : [a === "input_boolean" ? "input_boolean" : "homeassistant", t === "on" ? "turn_on" : "turn_off"];
}, $a = (e) => {
  const t = _(
    e,
    "ulm_custom_card_washer_power",
    "ulm_card_power_outlet_entity",
    "ulm_card_power_entity"
  ), a = e.config.entity?.split(".", 1)[0], r = t || (["switch", "input_boolean", "light", "fan", "script", "water_heater"].includes(a ?? "") ? e.config.entity : void 0), n = r ? e.hass.states[r] : void 0, i = I.has(n?.state ?? e.entity?.state ?? ""), o = V(e, "graph_entity"), [c, s] = Va(r, i ? "off" : "on");
  return e.actionSurface(`ulm-control-card ulm-row ${i ? "is-active" : ""}`, l`
    ${h(e, e.config.entity?.startsWith("fan.") ? "mdi:fan" : "mdi:power-socket-eu", i ? "yellow" : "grey")}
    ${f(e, o ? `${u(e.entity)} · ${u(o)}` : u(e.entity))}
    ${r && e.config.show_controls !== !1 ? v(i ? "Turn off" : "Turn on", "mdi:power", (m) => {
    m.stopPropagation(), e.service(c, s, { entity_id: r });
  }) : d}
  `);
}, xa = (e) => {
  const t = e.entity?.state === "on", a = C(g(e.entity, "percentage")) ?? 0, r = _(e, "ulm_card_fan_enable_slider") === !0, n = _(e, "ulm_card_fan_enable_button") === !0;
  return e.actionSurface(`ulm-control-card ulm-fan ${t ? "is-active" : ""}`, l`
    <div class="ulm-row">
      ${h(e, "mdi:fan", t ? "blue" : "grey")}
      ${f(e, `${u(e.entity)}${a ? ` · ${a}%` : ""}`)}
      ${v(t ? "Turn off" : "Turn on", "mdi:power", (i) => {
    i.stopPropagation(), e.service("fan", t ? "turn_off" : "turn_on", { entity_id: e.config.entity });
  })}
    </div>
    ${r ? l`<input class="ulm-slider" type="range"
      min=${String(_(e, "ulm_card_fan_slider_min") ?? 0)}
      max=${String(_(e, "ulm_card_fan_slider_max") ?? 100)}
      .value=${String(a)}
      @pointerdown=${(i) => i.stopPropagation()}
      @change=${(i) => e.service("fan", "set_percentage", {
    entity_id: e.config.entity,
    percentage: Number(i.target.value)
  })}>` : d}
    ${n ? l`<div class="ulm-controls">${v("Toggle oscillation", _(e, "ulm_card_fan_button_icon") ?? "mdi:rotate-3d-variant", (i) => {
    i.stopPropagation(), e.service("fan", "oscillate", { entity_id: e.config.entity, oscillating: g(e.entity, "oscillating") !== !0 });
  })}</div>` : d}
  `);
}, ka = (e) => {
  const t = (e.config.entities ?? []).map((a) => e.hass.states[a]).filter(Boolean);
  return e.actionSurface("ulm-room", l`
    <div class="ulm-row">
      ${h(e, "mdi:sofa", I.has(e.entity?.state ?? "") ? "yellow" : "blue")}
      ${f(e, u(e.entity))}
    </div>
    ${t.length ? l`<div class="room-entities">${t.map((a) => l`
      <span class="metric-pill"><ha-icon .icon=${a.attributes.icon ?? "mdi:circle-small"}></ha-icon>${u(a)}</span>
    `)}</div>` : d}
  `);
}, Ia = (e) => {
  const t = g(e.entity, "entity_picture");
  return e.actionSurface("ulm-camera", l`
    ${t ? l`<img src=${String(t)} alt=${D(e.config, e.entity)}>` : l`
      <div class="camera-placeholder">${h(e, "mdi:camera", "blue")}</div>
    `}
    <div class="camera-caption">${f(e, u(e.entity))}</div>
  `);
}, we = (e) => {
  const t = Object.entries(e.config).filter(([a, r]) => typeof r == "string" && r !== e.config.entity && /(_entity|_entity_id|_sensor|_power|_status|_level|_date|_time)$/i.test(a)).map(([, a]) => a);
  return [.../* @__PURE__ */ new Set([...e.config.entities ?? [], ...t])].map((a) => e.hass.states[a]).filter((a) => !!a).slice(0, 6);
}, Oe = (e, t, a = "blue") => {
  const r = we(e);
  return e.actionSurface("ulm-detail-card", l`
    <div class="ulm-row">
      ${h(e, t, a)}
      ${f(e, u(e.entity))}
    </div>
    ${r.length ? l`<div class="detail-grid">${r.map((n) => l`
      <span class="metric-pill"><ha-icon .icon=${n.attributes.icon ?? "mdi:circle-small"}></ha-icon>${u(n)}</span>
    `)}</div>` : d}
  `);
}, Pa = (e) => {
  const t = we(e);
  return e.actionSurface("ulm-schedule-card", l`
    <div class="ulm-row">
      ${h(e, /pollen/.test(e.descriptor.upstreamId) ? "mdi:flower-pollen" : "mdi:trash-can", "green")}
      ${f(e, u(e.entity))}
    </div>
    <div class="schedule-list">${(t.length ? t : e.entity ? [e.entity] : []).slice(0, 4).map((a) => l`
      <span><b>${D({ entity: a.entity_id }, a)}</b><small>${u(a)}</small></span>
    `)}</div>
  `);
}, Da = (e) => {
  const t = C(e.entity?.state), a = we(e);
  return e.actionSurface("ulm-device-status", l`
    <div class="ulm-row">
      ${h(e, /printer/.test(e.descriptor.upstreamId) ? "mdi:printer" : /nas/.test(e.descriptor.upstreamId) ? "mdi:nas" : /washer/.test(e.descriptor.upstreamId) ? "mdi:washing-machine" : "mdi:devices", t !== void 0 && t < 20 ? "red" : "blue")}
      ${f(e, u(e.entity))}
      ${t !== void 0 ? l`<b class="device-value">${Math.round(t)}${String(e.entity?.attributes.unit_of_measurement ?? "")}</b>` : d}
    </div>
    ${t !== void 0 ? l`<span class="device-progress"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>` : d}
    ${a.length ? l`<div class="detail-grid">${a.map((r) => l`<span class="metric-pill">${u(r)}</span>`)}</div>` : d}
  `);
}, Sa = (e) => {
  const t = C(g(e.entity, "min")) ?? 0, a = C(g(e.entity, "max")) ?? 100, r = C(e.entity?.state) ?? t;
  return e.actionSurface("ulm-helper-card", l`
    <div class="ulm-row">${h(e, "mdi:tune-variant", "blue")}${f(e, u(e.entity))}</div>
    <input class="ulm-slider" type="range" .min=${String(t)} .max=${String(a)} .value=${String(r)}
      @pointerdown=${(n) => n.stopPropagation()}
      @change=${(n) => e.service("input_number", "set_value", {
    entity_id: e.config.entity,
    value: Number(n.target.value)
  })}>
  `);
}, Aa = (e) => {
  const t = C(e.entity?.state) ?? 0, a = _(e, "ulm_card_gauge_min", "ulm_custom_card_mpse_gauge_min") ?? 0, r = _(e, "ulm_card_gauge_max", "ulm_custom_card_mpse_gauge_max") ?? 100, n = Math.max(0, Math.min(100, (t - a) / Math.max(1, r - a) * 100));
  return e.actionSurface("ulm-gauge-card", l`
    <span class="gauge-ring" style=${`--gauge:${n * 3.6}deg`}><b>${u(e.entity)}</b></span>
    ${f(e, `${a} – ${r}`)}
  `);
}, qa = (e) => {
  const t = V(e, "datetime_entity");
  return e.actionSurface(`ulm-control-card ulm-row ${I.has(e.entity?.state ?? "") ? "is-active" : ""}`, l`
    ${h(e, "mdi:alarm", I.has(e.entity?.state ?? "") ? "yellow" : "grey")}
    ${f(e, u(t || e.entity))}
    ${e.config.show_controls !== !1 ? v(I.has(e.entity?.state ?? "") ? "Disable alarm" : "Enable alarm", "mdi:power", (a) => {
    a.stopPropagation(), e.service("input_boolean", I.has(e.entity?.state ?? "") ? "turn_off" : "turn_on", { entity_id: e.config.entity });
  }) : d}
  `);
}, Ca = (e) => {
  const t = V(e, "lock_entity"), a = V(e, "battery_entity"), r = t?.state === "locked";
  return e.actionSurface("ulm-row ulm-door", l`
    ${h(e, r ? "mdi:door-closed-lock" : "mdi:door-open", r ? "green" : "red")}
    ${f(e, [u(e.entity), t ? u(t) : "", a ? u(a) : ""].filter(Boolean).join(" · "))}
    ${t && e.config.show_controls !== !1 ? v(r ? "Unlock" : "Lock", r ? "mdi:lock-open" : "mdi:lock", (n) => {
    n.stopPropagation(), e.service("lock", r ? "unlock" : "lock", { entity_id: e.config.lock_entity });
  }) : d}
  `);
}, Ne = (e) => e.actionSurface("ulm-row", l`
  ${h(e, "mdi:information-outline", I.has(e.entity?.state ?? "") ? "blue" : "grey")}
  ${f(e, e.config.secondary || u(e.entity))}
`), Ra = (e) => e.actionSurface("ulm-row ulm-generic-swap", l`
  ${f(e, e.config.secondary || u(e.entity))}
  ${h(e, "mdi:information-outline", I.has(e.entity?.state ?? "") ? "blue" : "grey")}
`), Ea = (e) => e.actionSurface("ulm-title", l`
  ${e.config.icon ? h(e, "mdi:format-title", "blue") : d}
  ${f(e, e.config.secondary)}
`), Fa = (e) => e.actionSurface("ulm-vertical-button", l`
  ${h(e, "mdi:gesture-tap-button", I.has(e.entity?.state ?? "") ? "blue" : "grey")}
  ${f(e, e.config.secondary || u(e.entity))}
`), ja = (e, t = !1) => {
  const a = e.entity?.state === "on", r = _(
    e,
    t ? "ulm_card_binary_sensor_alert_show_last_changed" : "ulm_card_binary_sensor_show_last_changed"
  ) === !0;
  return e.actionSurface(`ulm-row ulm-binary ${a ? "is-active" : ""} ${t && a ? "is-alert" : ""}`, l`
    ${h(e, t && a ? "mdi:alert" : "mdi:radiobox-marked", a ? t ? "red" : "blue" : "grey")}
    ${f(e, r && e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : u(e.entity))}
    ${t && a ? l`<span class="security-status">Alert</span>` : d}
  `);
}, za = (e) => {
  const t = e.descriptor.upstreamId, a = e.descriptor.family === "security" ? "red" : e.descriptor.family === "weather" ? "yellow" : e.descriptor.family === "battery" ? "green" : e.descriptor.family === "energy" ? "blue" : "grey";
  if (t === "chip_navigate" && e.config.variant === "back")
    return e.actionSurface("ulm-chip chip-navigation", l`${h(e, "mdi:arrow-left", "blue")}<span>${D(e.config, e.entity)}</span>`);
  if (/short_date|weather_date|nik_clock/.test(t))
    return e.actionSurface("ulm-chip chip-date", l`${h(e, "mdi:calendar-clock", a)}<span>${new Intl.DateTimeFormat(void 0, { weekday: "short", month: "short", day: "numeric" }).format(/* @__PURE__ */ new Date())}</span>`);
  if (/icon_only|mdi_icon_only/.test(t))
    return e.actionSurface("ulm-chip chip-icon-only", l`${h(e, "mdi:circle-small", a)}`);
  if (t === "chip_icon_double_state") {
    const r = V(e, "graph_entity");
    return e.actionSurface("ulm-chip chip-double-state", l`${h(e, "mdi:circle-small", a)}<b>${u(e.entity)}</b><b>${u(r)}</b>`);
  }
  return /temperature|simple_temp|tesla_temperature/.test(t) ? e.actionSurface("ulm-chip chip-temperature", l`${h(e, "mdi:thermometer", a)}<b>${u(e.entity)}</b>`) : /presence|person/.test(t) ? e.actionSurface("ulm-chip chip-presence", l`${h(e, "mdi:account", e.entity?.state === "home" ? "blue" : "grey")}<span>${D(e.config, e.entity)}</span>`) : e.actionSurface(`ulm-chip chip-${e.descriptor.family}`, l`${h(e, "mdi:circle-small", a)}<span>${D(e.config, e.entity)}</span>${e.config.show_state === !1 ? d : l`<b>${u(e.entity)}</b>`}`);
}, La = (e) => {
  if (e.descriptor.kind === "chip") return za(e);
  switch (e.descriptor.upstreamId) {
    case "card_binary_sensor":
      return ja(e, e.config.variant === "alert");
    case "card_title":
      return Ea(e);
    case "card_vertical_button":
      return Fa(e);
    case "card_generic":
      return e.config.variant === "swapped" ? Ra(e) : Ne(e);
    case "custom_card_input_datetime":
      return Oe(e, "mdi:calendar-clock", "blue");
    case "card_room":
    case "custom_card_esh_room":
    case "custom_card_drealine_roomview":
      return ka(e);
  }
  if (/afval|waste_collection|pollen/.test(e.descriptor.upstreamId)) return Pa(e);
  if (/printer|nik_nas|nik_tablet|haven_washer|homeassistant_updates|neekster_update/.test(e.descriptor.upstreamId)) return Da(e);
  if (e.descriptor.upstreamId === "custom_card_input_number") return Sa(e);
  if (/gauge/.test(e.descriptor.upstreamId)) return Aa(e);
  if (/schumijo_(car|flower)|irmajavi_entities|damix48_power_details/.test(e.descriptor.upstreamId))
    return Oe(e, /car/.test(e.descriptor.upstreamId) ? "mdi:car" : /flower/.test(e.descriptor.upstreamId) ? "mdi:flower" : "mdi:view-grid", "purple");
  switch (e.descriptor.family) {
    case "weather":
      return ca(e);
    case "climate":
      return ua(e);
    case "light":
      return da(e);
    case "scene":
      return fa(e);
    case "presence":
      return _a(e);
    case "battery":
      return ma(e);
    case "energy":
    case "sensor":
      return ha(e);
    case "media":
      return ba(e);
    case "cover":
      return ga(e);
    case "vacuum":
      return ya(e);
    case "security":
      return va(e);
    case "navigation":
      return wa(e);
    case "control":
      return e.config.entity?.startsWith("fan.") ? xa(e) : $a(e);
    case "alarm-time":
      return qa(e);
    case "door":
      return Ca(e);
    case "camera":
      return Ia(e);
    default:
      return Ne(e);
  }
};
var Ma = Object.defineProperty, at = (e, t, a, r) => {
  for (var n = void 0, i = e.length - 1, o; i >= 0; i--)
    (o = e[i]) && (n = o(t, a, n) || n);
  return n && Ma(t, a, n), n;
};
const Ve = class Ve extends L {
  constructor() {
    super(...arguments), this.holdFired = !1, this.forecastGeneration = 0, this.forecast = [], this.actionSurface = (t, a) => {
      const r = this.descriptor?.kind === "chip", n = this.descriptor ? ye.get(this.descriptor.upstreamId) : void 0;
      if (this.descriptor?.kind !== "container" && !n)
        throw new Error(`Missing explicit parity renderer mapping for ${this.descriptor?.upstreamId}`);
      const i = n ? ` parity-${n.rendererId.replaceAll("_", "-")}` : "", o = this.config?.layout && this.config.layout !== "default" ? ` layout-${this.config.layout}` : "", c = this.config?.fill_container ? " fill-container" : "", s = this.config?.variant ? ` variant-${this.config.variant}` : "", m = l`
      <div class="${t}${i}${o}${c}${s} action-surface" role="button" tabindex="0"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        ${a}
      </div>`;
      return r ? m : l`<ha-card class="minimalist-card">${m}</ha-card>`;
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
    const a = Mt(t), r = this.forecastKey(this.config);
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
    if (!this.config || !this.descriptor) return d;
    if (!this.hass) return l`<ha-card><div class="preview">Mushroom Addition preview</div></ha-card>`;
    if (this.descriptor.kind === "container") return this.renderContainer();
    const t = this.config.entity ? this.hass.states[this.config.entity] : void 0;
    return La({
      config: this.config,
      descriptor: this.descriptor,
      hass: this.hass,
      entity: t,
      forecast: this.forecast,
      actionSurface: this.actionSurface,
      service: (a, r, n) => {
        this.hass?.callService(a, r, n);
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
      const r = await this.hass.connection.subscribeMessage((n) => {
        a !== this.forecastGeneration || t !== this.forecastSubscriptionKey || (this.forecast = n.forecast ?? [], this.requestUpdate());
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
  renderContainer() {
    const t = this.config?.chips ?? [];
    return l`<ha-card class="minimalist-card"><div class="chips">
      ${t.map((a) => {
      const r = document.createElement(a.type.replace(/^custom:/, ""));
      return r.hass = this.hass, r.setConfig(a), r;
    })}
      ${t.length === 0 ? l`<div class="preview">Add chips in the visual editor.</div>` : d}
    </div></ha-card>`;
  }
  runAction(t) {
    if (!this.hass || !this.config) return;
    const a = t === "tap_action" ? "tap" : t === "hold_action" ? "hold" : "double_tap";
    Lt(this, this.config, a);
  }
};
Ve.styles = oa;
let N = Ve;
at([
  se({ attribute: !1 })
], N.prototype, "hass");
at([
  se({ attribute: !1 })
], N.prototype, "config");
const ue = (e, t, a = [], r = []) => {
  const n = [...a, ...r, ...Object.keys(t?.states ?? {})], i = [...new Set(n)].filter((o) => t?.states?.[o] !== void 0);
  for (const o of e.preferredDomains ?? []) {
    const c = i.find((s) => s.startsWith(`${o}.`));
    if (c) return c;
  }
  return i[0];
}, Ua = (e) => e.name.replace(/ (Card|Chip)$/, ""), Ta = (e, t, a = [], r = []) => {
  if (e.kind === "container") {
    const b = ue(
      { ...e, preferredDomains: ["sensor"] },
      t,
      a,
      r
    ), p = ue(
      { ...e, preferredDomains: ["person", "device_tracker"] },
      t,
      a,
      r
    );
    return {
      type: `custom:${e.tag}`,
      chips: [
        {
          type: "custom:mushroom-addition-chip-temperature",
          entity: b,
          name: b ? void 0 : "Temperature",
          secondary: b ? void 0 : "21 °C"
        },
        {
          type: "custom:mushroom-addition-chip-presence-detection",
          entity: p,
          name: p ? void 0 : "Presence",
          secondary: p ? void 0 : "Home"
        }
      ]
    };
  }
  const n = ue(e, t, a, r), i = ["text", "navigation"].includes(e.family), c = e.upstreamId === "custom_card_playstation" && n?.toLowerCase().includes("xbox") ? "xbox" : e.variants?.[0], s = n?.split(".", 1)[0], m = ["light", "switch", "input_boolean", "fan"].includes(s ?? "") ? { action: "toggle" } : { action: n ? "more-info" : "none" };
  return {
    ...tt(e, t, n),
    name: n ? t?.states[n]?.attributes.friendly_name : Ua(e),
    secondary: n ? void 0 : i ? "Example" : "Preview",
    variant: c,
    tap_action: m,
    show_controls: ["climate", "media", "cover", "vacuum", "control"].includes(e.family) ? !0 : void 0,
    show_forecast: e.family === "weather",
    show_graph: ["battery", "energy", "sensor"].includes(e.family),
    ulm_card_light_enable_slider: e.family === "light" ? !0 : void 0,
    ulm_card_light_enable_color: e.family === "light" ? !0 : void 0,
    entities: e.variants?.includes("with-sensors") ? r.slice(0, 2) : void 0
  };
}, Oa = "1.3.0";
for (const e of O)
  if (!customElements.get(e.tag)) {
    const t = e;
    class a extends N {
      constructor() {
        super(...arguments), this.descriptor = t;
      }
      static getStubConfig(n, i = [], o = []) {
        return Ta(t, n, i, o);
      }
    }
    customElements.define(e.tag, a);
  }
for (const e of ie) {
  if (customElements.get(e.tag)) continue;
  const t = ce.find((i) => i.upstreamId === e.targetId);
  if (!t) throw new Error(`Missing alias target ${e.targetId}.`);
  const a = t, r = e.variant;
  class n extends N {
    constructor() {
      super(...arguments), this.descriptor = a;
    }
    setConfig(o) {
      super.setConfig({ ...o, variant: o.variant ?? r });
    }
  }
  customElements.define(e.tag, n);
}
window.customCards = window.customCards || [];
const Na = new Set(window.customCards.map((e) => e.type));
for (const e of O)
  Na.has(e.tag) || window.customCards.push({
    type: e.tag,
    name: `Mushroom Addition: ${e.name}`,
    description: e.description,
    preview: !0,
    documentationURL: "https://github.com/snfx-johaver/mushroom-cards-addition"
  });
console.info(
  `%c MUSHROOM-CARDS-ADDITION %c ${Oa} · ${O.length} components `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;"
);
export {
  O as CATALOG
};
//# sourceMappingURL=mushroom-cards-addition.js.map
