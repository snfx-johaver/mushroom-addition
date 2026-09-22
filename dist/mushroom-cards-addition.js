const H = globalThis, W = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, F = /* @__PURE__ */ Symbol(), tt = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== F) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (W && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = tt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && tt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const yt = (e) => new mt(typeof e == "string" ? e : e + "", void 0, F), _t = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, o, n) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + e[n + 1], e[0]);
  return new mt(i, e, F);
}, bt = (e, t) => {
  if (W) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), o = H.litNonce;
    o !== void 0 && s.setAttribute("nonce", o), s.textContent = i.cssText, e.appendChild(s);
  }
}, et = W ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return yt(i);
})(e) : e;
const { is: wt, defineProperty: At, getOwnPropertyDescriptor: xt, getOwnPropertyNames: Ct, getOwnPropertySymbols: St, getPrototypeOf: Et } = Object, L = globalThis, it = L.trustedTypes, kt = it ? it.emptyScript : "", Pt = L.reactiveElementPolyfillSupport, E = (e, t) => e, R = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? kt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, K = (e, t) => !wt(e, t), st = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: K };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), L.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let b = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = st) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), o = this.getPropertyDescriptor(t, s, i);
      o !== void 0 && At(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: o, set: n } = xt(this.prototype, t) ?? { get() {
      return this[i];
    }, set(r) {
      this[i] = r;
    } };
    return { get: o, set(r) {
      const c = o?.call(this);
      n?.call(this, r), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? st;
  }
  static _$Ei() {
    if (this.hasOwnProperty(E("elementProperties"))) return;
    const t = Et(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(E("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(E("properties"))) {
      const i = this.properties, s = [...Ct(i), ...St(i)];
      for (const o of s) this.createProperty(o, i[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [s, o] of i) this.elementProperties.set(s, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const o = this._$Eu(i, s);
      o !== void 0 && this._$Eh.set(o, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const o of s) i.unshift(et(o));
    } else t !== void 0 && i.push(et(t));
    return i;
  }
  static _$Eu(t, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
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
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return bt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, s) {
    this._$AK(t, s);
  }
  _$ET(t, i) {
    const s = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, s);
    if (o !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : R).toAttribute(i, s.type);
      this._$Em = t, n == null ? this.removeAttribute(o) : this.setAttribute(o, n), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const s = this.constructor, o = s._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const n = s.getPropertyOptions(o), r = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : R;
      this._$Em = o;
      const c = r.fromAttribute(i, n.type);
      this[o] = c ?? this._$Ej?.get(o) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, o = !1, n) {
    if (t !== void 0) {
      const r = this.constructor;
      if (o === !1 && (n = this[t]), s ??= r.getPropertyOptions(t), !((s.hasChanged ?? K)(n, i) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, s)))) return;
      this.C(t, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: s, reflect: o, wrapped: n }, r) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? i ?? this[t]), n !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (i = void 0), this._$AL.set(t, i)), o === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
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
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [o, n] of s) {
        const { wrapped: r } = n, c = this[o];
        r !== !0 || this._$AL.has(o) || c === void 0 || this.C(o, void 0, n, c);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[E("elementProperties")] = /* @__PURE__ */ new Map(), b[E("finalized")] = /* @__PURE__ */ new Map(), Pt?.({ ReactiveElement: b }), (L.reactiveElementVersions ??= []).push("2.1.2");
const Z = globalThis, ot = (e) => e, z = Z.trustedTypes, nt = z ? z.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ft = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, gt = "?" + f, Tt = `<${gt}>`, v = document, k = () => v.createComment(""), P = (e) => e === null || typeof e != "object" && typeof e != "function", J = Array.isArray, Ut = (e) => J(e) || typeof e?.[Symbol.iterator] == "function", V = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rt = /-->/g, at = />/g, g = RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ct = /'/g, lt = /"/g, $t = /^(?:script|style|textarea|title)$/i, Ot = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), d = Ot(1), A = /* @__PURE__ */ Symbol.for("lit-noChange"), l = /* @__PURE__ */ Symbol.for("lit-nothing"), ht = /* @__PURE__ */ new WeakMap(), $ = v.createTreeWalker(v, 129);
function vt(e, t) {
  if (!J(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return nt !== void 0 ? nt.createHTML(t) : t;
}
const Mt = (e, t) => {
  const i = e.length - 1, s = [];
  let o, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = C;
  for (let c = 0; c < i; c++) {
    const a = e[c];
    let h, u, p = -1, m = 0;
    for (; m < a.length && (r.lastIndex = m, u = r.exec(a), u !== null); ) m = r.lastIndex, r === C ? u[1] === "!--" ? r = rt : u[1] !== void 0 ? r = at : u[2] !== void 0 ? ($t.test(u[2]) && (o = RegExp("</" + u[2], "g")), r = g) : u[3] !== void 0 && (r = g) : r === g ? u[0] === ">" ? (r = o ?? C, p = -1) : u[1] === void 0 ? p = -2 : (p = r.lastIndex - u[2].length, h = u[1], r = u[3] === void 0 ? g : u[3] === '"' ? lt : ct) : r === lt || r === ct ? r = g : r === rt || r === at ? r = C : (r = g, o = void 0);
    const _ = r === g && e[c + 1].startsWith("/>") ? " " : "";
    n += r === C ? a + Tt : p >= 0 ? (s.push(h), a.slice(0, p) + ft + a.slice(p) + f + _) : a + f + (p === -2 ? c : _);
  }
  return [vt(e, n + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class T {
  constructor({ strings: t, _$litType$: i }, s) {
    let o;
    this.parts = [];
    let n = 0, r = 0;
    const c = t.length - 1, a = this.parts, [h, u] = Mt(t, i);
    if (this.el = T.createElement(h, s), $.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (o = $.nextNode()) !== null && a.length < c; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const p of o.getAttributeNames()) if (p.endsWith(ft)) {
          const m = u[r++], _ = o.getAttribute(p).split(f), M = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: n, name: M[2], strings: _, ctor: M[1] === "." ? Dt : M[1] === "?" ? Ht : M[1] === "@" ? Rt : I }), o.removeAttribute(p);
        } else p.startsWith(f) && (a.push({ type: 6, index: n }), o.removeAttribute(p));
        if ($t.test(o.tagName)) {
          const p = o.textContent.split(f), m = p.length - 1;
          if (m > 0) {
            o.textContent = z ? z.emptyScript : "";
            for (let _ = 0; _ < m; _++) o.append(p[_], k()), $.nextNode(), a.push({ type: 2, index: ++n });
            o.append(p[m], k());
          }
        }
      } else if (o.nodeType === 8) if (o.data === gt) a.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = o.data.indexOf(f, p + 1)) !== -1; ) a.push({ type: 7, index: n }), p += f.length - 1;
      }
      n++;
    }
  }
  static createElement(t, i) {
    const s = v.createElement("template");
    return s.innerHTML = t, s;
  }
}
function x(e, t, i = e, s) {
  if (t === A) return t;
  let o = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const n = P(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== n && (o?._$AO?.(!1), n === void 0 ? o = void 0 : (o = new n(e), o._$AT(e, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = o : i._$Cl = o), o !== void 0 && (t = x(e, o._$AS(e, t.values), o, s)), t;
}
class Nt {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: s } = this._$AD, o = (t?.creationScope ?? v).importNode(i, !0);
    $.currentNode = o;
    let n = $.nextNode(), r = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let h;
        a.type === 2 ? h = new O(n, n.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (h = new zt(n, this, t)), this._$AV.push(h), a = s[++c];
      }
      r !== a?.index && (n = $.nextNode(), r++);
    }
    return $.currentNode = v, o;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class O {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, s, o) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = o, this._$Cv = o?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t?.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = x(this, t, i), P(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ut(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && P(this._$AH) ? this._$AA.nextSibling.data = t : this.T(v.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: s } = t, o = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = T.createElement(vt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === o) this._$AH.p(i);
    else {
      const n = new Nt(o, this), r = n.u(this.options);
      n.p(i), this.T(r), this._$AH = n;
    }
  }
  _$AC(t) {
    let i = ht.get(t.strings);
    return i === void 0 && ht.set(t.strings, i = new T(t)), i;
  }
  k(t) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, o = 0;
    for (const n of t) o === i.length ? i.push(s = new O(this.O(k()), this.O(k()), this, this.options)) : s = i[o], s._$AI(n), o++;
    o < i.length && (this._$AR(s && s._$AB.nextSibling, o), i.length = o);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const s = ot(t).nextSibling;
      ot(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class I {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, o, n) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = i, this._$AM = o, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(t, i = this, s, o) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) t = x(this, t, i, 0), r = !P(t) || t !== this._$AH && t !== A, r && (this._$AH = t);
    else {
      const c = t;
      let a, h;
      for (t = n[0], a = 0; a < n.length - 1; a++) h = x(this, c[s + a], i, a), h === A && (h = this._$AH[a]), r ||= !P(h) || h !== this._$AH[a], h === l ? t = l : t !== l && (t += (h ?? "") + n[a + 1]), this._$AH[a] = h;
    }
    r && !o && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Dt extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Ht extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class Rt extends I {
  constructor(t, i, s, o, n) {
    super(t, i, s, o, n), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = x(this, t, i, 0) ?? l) === A) return;
    const s = this._$AH, o = t === l && s !== l || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== l && (s === l || o);
    o && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class zt {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    x(this, t);
  }
}
const jt = Z.litHtmlPolyfillSupport;
jt?.(T, O), (Z.litHtmlVersions ??= []).push("3.3.3");
const Lt = (e, t, i) => {
  const s = i?.renderBefore ?? t;
  let o = s._$litPart$;
  if (o === void 0) {
    const n = i?.renderBefore ?? null;
    s._$litPart$ = o = new O(t.insertBefore(k(), n), n, void 0, i ?? {});
  }
  return o._$AI(e), o;
};
const X = globalThis;
class w extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Lt(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return A;
  }
}
w._$litElement$ = !0, w.finalized = !0, X.litElementHydrateSupport?.({ LitElement: w });
const It = X.litElementPolyfillSupport;
It?.({ LitElement: w });
(X.litElementVersions ??= []).push("4.2.2");
const Vt = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Bt = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: K }, qt = (e = Bt, t, i) => {
  const { kind: s, metadata: o } = i;
  let n = globalThis.litPropertyMetadata.get(o);
  if (n === void 0 && globalThis.litPropertyMetadata.set(o, n = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(i.name, e), s === "accessor") {
    const { name: r } = i;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(r, a, e, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, e, c), c;
    } };
  }
  if (s === "setter") {
    const { name: r } = i;
    return function(c) {
      const a = this[r];
      t.call(this, c), this.requestUpdate(r, a, e, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function G(e) {
  return (t, i) => typeof i == "object" ? qt(e, t, i) : ((s, o, n) => {
    const r = o.hasOwnProperty(n);
    return o.constructor.createProperty(n, s), r ? Object.getOwnPropertyDescriptor(o, n) : void 0;
  })(e, t, i);
}
function Wt(e) {
  return G({ ...e, state: !0, attribute: !1 });
}
const Ft = [
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
], Kt = [
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
  "short_date_with_day",
  "temperature",
  "weather_date"
], Zt = [
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
], Jt = [
  "group_counter",
  "moon",
  "myenedis",
  "simple_temp",
  "tesla_temperature",
  "update",
  "vlape_garage"
], pt = (e) => e.replace(/^iAbadia/, "iAbadia").split("_").map((t) => ["nas", "mdi", "dwd", "vnc", "wifi", "http"].includes(t.toLowerCase()) ? t.toUpperCase() : `${t[0].toUpperCase()}${t.slice(1)}`).join(" "), Xt = (e) => /weather|sun|pollen|moon/.test(e) ? "weather" : /person|tracker|tracer|presence|room|welcome/.test(e) ? "presence" : /media|chromecast|playstation/.test(e) ? "media" : /thermostat|heat_pump|aircondition|temperature/.test(e) ? "climate" : /power|battery|gauge|speedtest|wifisignal|graph|apex|bar_card/.test(e) ? "metric" : /cover|door|garage/.test(e) ? "cover" : /light|fan|outlet|boolean|script|scene|vacuum|lock|washer|water_heater/.test(e) ? "control" : /title|subtitle|clock|date/.test(e) ? "text" : /camera/.test(e) ? "camera" : /navigate|back/.test(e) ? "navigation" : "entity", Gt = {
  card_binary_sensor: ["default", "alert"],
  card_generic: ["default", "swapped"],
  card_light: ["default", "slider", "compact", "popup"],
  card_media_player: ["default", "controls", "artwork", "popup"],
  card_weather: ["compact", "forecast", "no-external-resource", "popup"],
  card_person: ["default", "small"],
  card_room: ["default", "with-sensors"],
  card_vertical_button: ["default", "custom-state"],
  card_scenes: ["list", "welcome"],
  card_cover: ["default", "popup"],
  card_power_outlet: ["default", "popup"],
  card_thermostat: ["default", "popup"],
  card_vacuum: ["default", "popup"],
  custom_card_playstation: ["ps5", "xbox"]
}, Qt = (e, t) => e.includes("binary_sensor") ? ["binary_sensor"] : e.includes("battery") ? ["sensor"] : e.includes("input_boolean") ? ["input_boolean"] : e.includes("input_number") ? ["input_number"] : e.includes("input_datetime") ? ["input_datetime"] : e.includes("light") ? ["light"] : /media|chromecast|playstation/.test(e) ? ["media_player", "sensor"] : /thermostat|heat_pump|aircondition/.test(e) ? ["climate"] : /scene/.test(e) ? ["scene"] : /script/.test(e) ? ["script"] : /vacuum/.test(e) ? ["vacuum"] : /weather/.test(e) ? ["weather"] : /person/.test(e) ? ["person", "device_tracker"] : /cover|door|garage/.test(e) ? ["cover", "binary_sensor"] : /fan/.test(e) ? ["fan"] : /camera/.test(e) ? ["camera"] : /lock/.test(e) ? ["lock"] : /update/.test(e) ? ["update"] : t === "metric" || t === "weather" ? ["sensor"] : t === "control" ? ["switch", "light"] : t === "presence" ? ["person", "device_tracker"] : ["sensor", "switch"], N = (e, t, i) => {
  const s = e.replace(/^custom_(card|chip)_/, "").replace(/^(card|chip)_/, ""), o = e.replaceAll("_", "-").toLowerCase(), n = o.startsWith("custom-card-") || o.startsWith("custom-chip-") ? `mushroom-addition-${o}` : `mushroom-addition-${t}-${o.replace(new RegExp(`^${t}-`), "")}`, r = Xt(e), c = e === "custom_card_playstation";
  return {
    upstreamId: e,
    sourcePath: i,
    kind: t,
    family: r,
    tag: n,
    name: c ? "PS5 / Xbox Card" : `${pt(s)} ${t === "chip" ? "Chip" : "Card"}`,
    description: c ? "Mushroom-style game console card with PS5 and Xbox modes." : `Mushroom-style ${pt(s).toLowerCase()} ${t}.`,
    variants: Gt[e],
    preferredDomains: Qt(e, r)
  };
}, y = [
  {
    upstreamId: "chips_container",
    sourcePath: "Mushroom Cards Addition composition component",
    kind: "container",
    family: "chips",
    tag: "mushroom-addition-chips-card",
    name: "Addition Chips Card",
    description: "Compose Addition chips in a responsive row."
  },
  ...Ft.map((e) => {
    const t = {
      graph: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/2-line_cards/card_graph.yaml",
      scenes: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_scenes_welcome.yaml",
      title: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/title/card_title.yaml",
      vertical_button: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/vertical_buttons/vertical_buttons.yaml"
    };
    return N(
      `card_${e}`,
      "card",
      t[e] ?? `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_${e}.yaml`
    );
  }),
  ...Kt.map((e) => N(
    `chip_${e}`,
    "chip",
    `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_${e}.yaml`
  )),
  ...Zt.map((e) => N(
    `custom_card_${e}`,
    "card",
    `custom_cards/custom_card_${e}`
  )),
  ...Jt.map((e) => N(
    `custom_chip_${e}`,
    "chip",
    `custom_cards/custom_chip_${e}`
  ))
];
y.filter((e) => e.kind !== "container");
const Yt = (e) => y.find((t) => t.tag === e), te = /* @__PURE__ */ new Set([
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
]), D = (e) => {
  if (!e) return "Entity unavailable";
  const t = e.attributes.unit_of_measurement;
  return t ? `${e.state} ${String(t)}` : e.state.replaceAll("_", " ");
}, dt = (e, t) => e.name || t?.attributes.friendly_name || e.entity || "Mushroom Addition", S = (e, t, i) => {
  e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    composed: !0,
    detail: i
  }));
}, ee = (e, t, i) => {
  S(e, "hass-action", { config: t, action: i });
}, ie = (e) => ({
  show_icon: !0,
  show_state: !0,
  layout: "horizontal",
  tap_action: { action: e.entity ? "more-info" : "none" },
  ...e
}), ut = {
  en: {
    entity: "Entity",
    name: "Name",
    secondary: "Secondary information",
    icon: "Icon",
    icon_color: "Icon color",
    variant: "Variant",
    layout: "Layout",
    show_icon: "Show icon",
    show_state: "Show state",
    tap_action: "Tap action",
    hold_action: "Hold action",
    double_tap_action: "Double-tap action",
    chips: "Chip configurations"
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
    chips: "Chip-Konfigurationen"
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
    chips: "Configuraciones de chips"
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
    chips: "Configuration des chips"
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
    chips: "Chipconfiguraties"
  }
}, se = (e, t) => {
  const i = e?.language?.split("-")[0] ?? "en";
  return ut[i]?.[t] ?? ut.en[t] ?? t.replaceAll("_", " ").replace(/\b\w/g, (s) => s.toUpperCase());
};
var oe = Object.defineProperty, ne = Object.getOwnPropertyDescriptor, Q = (e, t, i, s) => {
  for (var o = s > 1 ? void 0 : s ? ne(t, i) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (o = (s ? r(t, i, o) : r(o)) || o);
  return s && o && oe(t, i, o), o;
};
const B = (e) => ({ name: e, selector: { ui_action: {} } });
let U = class extends w {
  constructor() {
    super(...arguments), this.computeLabel = (e) => se(this.hass, e.name), this.valueChanged = (e) => {
      if (!this.config || !e.detail.value) return;
      const t = e.detail.value, i = { ...this.config, ...t };
      this.config = i, S(this, "config-changed", { config: i });
    }, this.addChip = () => {
      if (!this.config) return;
      const e = y.find((t) => t.kind === "chip");
      e && (this.config = {
        ...this.config,
        chips: [...this.config.chips ?? [], { type: `custom:${e.tag}`, show_icon: !0, show_state: !0 }]
      }, S(this, "config-changed", { config: this.config }));
    };
  }
  setConfig(e) {
    this.config = e;
  }
  render() {
    if (!this.hass || !this.config) return l;
    const e = Yt(this.config.type.replace(/^custom:/, ""));
    if (e?.kind === "container") {
      const i = y.filter((s) => s.kind === "chip");
      return d`<div class="chips">
        ${(this.config.chips ?? []).map((s, o) => d`
          <div class="chip-row">
            <select
              aria-label="Chip type"
              .value=${s.type}
              @change=${(n) => this.updateChip(o, "type", n.target.value)}
            >
              ${i.map((n) => d`
                <option value=${`custom:${n.tag}`} ?selected=${s.type === `custom:${n.tag}`}>
                  ${n.name}
                </option>
              `)}
            </select>
            <input
              aria-label="Entity ID"
              placeholder="sensor.example"
              .value=${s.entity ?? ""}
              @change=${(n) => this.updateChip(o, "entity", n.target.value)}
            />
            <button class="remove" @click=${() => this.removeChip(o)} aria-label="Remove chip">Remove</button>
          </div>
        `)}
        <button @click=${this.addChip}>Add chip</button>
      </div>`;
    }
    const t = [
      { name: "entity", selector: { entity: {} } },
      { name: "name", selector: { text: {} } },
      { name: "secondary", selector: { text: {} } },
      { name: "icon", selector: { icon: {} } },
      { name: "icon_color", selector: { ui_color: {} } },
      { name: "entities", selector: { entity: { multiple: !0 } } }
    ];
    return e?.variants?.length && t.push({
      name: "variant",
      selector: { select: { options: e.variants, mode: "dropdown" } }
    }), t.push(
      { name: "layout", selector: { select: { options: ["horizontal", "vertical"] } } },
      { name: "show_icon", selector: { boolean: {} } },
      { name: "show_state", selector: { boolean: {} } },
      B("tap_action"),
      B("hold_action"),
      B("double_tap_action")
    ), d`
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${t}
        .computeLabel=${this.computeLabel}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }
  removeChip(e) {
    this.config && (this.config = {
      ...this.config,
      chips: (this.config.chips ?? []).filter((t, i) => i !== e)
    }, S(this, "config-changed", { config: this.config }));
  }
  updateChip(e, t, i) {
    this.config && (this.config = {
      ...this.config,
      chips: (this.config.chips ?? []).map((s, o) => o === e ? { ...s, [t]: i || void 0 } : s)
    }, S(this, "config-changed", { config: this.config }));
  }
};
U.styles = _t`
    .chips { display: grid; gap: 12px; }
    .chip-row {
      display: grid;
      grid-template-columns: minmax(150px, 1fr) minmax(150px, 1fr) auto;
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
Q([
  G({ attribute: !1 })
], U.prototype, "hass", 2);
Q([
  Wt()
], U.prototype, "config", 2);
U = Q([
  Vt("mushroom-addition-editor")
], U);
const re = _t`
  :host {
    --mac-accent: var(--mush-rgb-blue, 33, 150, 243);
    display: block;
    min-width: 0;
  }
  ha-card {
    overflow: hidden;
    border-radius: var(--mush-card-primary-border-radius, 12px);
    background: var(--ha-card-background, var(--card-background-color));
    box-shadow: var(--ha-card-box-shadow, none);
  }
  .card {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    min-height: 66px;
    padding: 12px;
    color: var(--primary-text-color);
    cursor: pointer;
    outline: none;
  }
  .card.vertical {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
  .card.compact { min-height: 48px; padding: 8px 10px; }
  .card.alert { --mac-accent: var(--rgb-red-color, 244, 67, 54); }
  .card.popup {
    min-height: 110px;
    border: 1px solid rgba(var(--mac-accent), 0.3);
  }
  .card:focus-visible, .chip:focus-visible {
    box-shadow: inset 0 0 0 2px rgb(var(--mac-accent));
  }
  .icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    color: rgb(var(--mac-accent));
    background: rgba(var(--mac-accent), 0.16);
  }
  .active .icon {
    color: var(--text-primary-color, white);
    background: rgb(var(--mac-accent));
  }
  ha-icon { --mdc-icon-size: 23px; }
  .copy { min-width: 0; }
  .primary, .secondary {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .primary { font-size: 14px; font-weight: 500; }
  .secondary {
    margin-top: 3px;
    color: var(--secondary-text-color);
    font-size: 12px;
    text-transform: capitalize;
  }
  .metric {
    color: rgb(var(--mac-accent));
    font-size: 18px;
    font-weight: 600;
  }
  .details {
    display: flex;
    grid-column: 1 / -1;
    flex-wrap: wrap;
    gap: 6px;
  }
  .variant-content {
    display: flex;
    grid-column: 1 / -1;
    align-items: center;
    gap: 8px;
    width: 100%;
  }
  .variant-content input[type="range"] { width: 100%; accent-color: rgb(var(--mac-accent)); }
  .control {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 50%;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    cursor: pointer;
  }
  .forecast { justify-content: space-around; color: var(--secondary-text-color); font-size: 12px; }
  .artwork {
    width: 58px;
    height: 58px;
    border-radius: 10px;
    background-position: center;
    background-size: cover;
  }
  .detail {
    padding: 4px 8px;
    border-radius: 10px;
    background: var(--secondary-background-color);
    color: var(--secondary-text-color);
    font-size: 11px;
  }
  .unavailable { opacity: 0.55; }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 32px;
    padding: 0 11px;
    border-radius: 18px;
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    box-shadow: var(--ha-card-box-shadow, none);
    cursor: pointer;
    outline: none;
  }
  .chip .icon {
    width: 26px;
    height: 26px;
    margin-left: -8px;
  }
  .chip ha-icon { --mdc-icon-size: 17px; }
  .chip-label { font-size: 12px; white-space: nowrap; }
  .chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 4px;
  }
  .preview {
    padding: 16px;
    color: var(--secondary-text-color);
    text-align: center;
  }
`;
var ae = Object.defineProperty, ce = (e, t, i, s) => {
  for (var o = void 0, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (o = r(t, i, o) || o);
  return o && ae(t, i, o), o;
};
const Y = class Y extends w {
  constructor() {
    super(...arguments), this.holdFired = !1, this.keydown = (t) => {
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
    }, this.stopPropagation = (t) => t.stopPropagation(), this.sliderChanged = (t) => {
      if (t.stopPropagation(), !this.hass || !this.config?.entity) return;
      const i = Number(t.target.value);
      this.config.entity.split(".", 1)[0] === "light" ? this.hass.callService("light", "turn_on", { entity_id: this.config.entity, brightness_pct: i }) : this.hass.callService("input_number", "set_value", { entity_id: this.config.entity, value: i });
    };
  }
  setConfig(t) {
    if (!t || typeof t != "object") throw new Error("A card configuration is required.");
    this.config = ie(t);
  }
  static async getConfigElement() {
    return document.createElement("mushroom-addition-editor");
  }
  static getStubConfig() {
    return { type: "custom:mushroom-addition-card-generic", show_icon: !0, show_state: !0 };
  }
  getCardSize() {
    return this.descriptor?.family === "weather" ? 2 : 1;
  }
  render() {
    if (!this.config) return l;
    if (!this.hass) return d`<ha-card><div class="preview">Mushroom Addition preview</div></ha-card>`;
    if (this.descriptor?.kind === "container") return this.renderContainer();
    const t = this.getEntity(), i = !!(this.config.entity && !t), s = t ? te.has(t.state.toLowerCase()) : !1;
    let o = dt(this.config, t);
    const n = this.config.secondary || (this.config.show_state === !1 || !this.config.entity ? "" : D(t));
    let r = n;
    (this.descriptor?.upstreamId === "card_generic_swap" || this.config.variant === "swapped") && (r = o, o = n || o), this.config.variant === "custom-state" && t && (r = o, o = D(t));
    const c = this.config.icon || t?.attributes.icon || this.defaultIcon(), a = this.config.icon_color ? `var(--rgb-${this.config.icon_color}-color, var(--mush-rgb-blue, 33, 150, 243))` : "var(--mush-rgb-blue, 33, 150, 243)", h = [
      ["compact", "small", "no-external-resource"].includes(this.config.variant ?? "") ? "compact" : "",
      this.config.variant === "popup" ? "popup" : "",
      this.descriptor?.upstreamId === "card_binary_sensor_alert" || this.config.variant === "alert" ? "alert" : ""
    ].filter(Boolean).join(" ");
    return this.descriptor?.kind === "chip" ? d`
        <div
          class="chip ${s ? "active" : ""} ${i ? "unavailable" : ""}"
          style=${`--mac-accent: ${a}`}
          role="button"
          tabindex="0"
          aria-label=${`${o}: ${r}`}
          @click=${this.tap}
          @dblclick=${this.doubleTap}
          @pointerdown=${this.pointerDown}
          @pointerup=${this.pointerUp}
          @pointercancel=${this.pointerUp}
          @keydown=${this.keydown}
        >
          ${this.config.show_icon === !1 ? l : d`<span class="icon"><ha-icon .icon=${c}></ha-icon></span>`}
          <span class="chip-label">${this.descriptor.family === "text" ? r : o}${this.config.show_state === !1 ? "" : r && this.descriptor.family !== "text" ? ` · ${r}` : ""}</span>
        </div>
      ` : d`
      <ha-card>
        <div
          class="card ${this.config.layout === "vertical" ? "vertical" : ""} ${h} ${s ? "active" : ""} ${i ? "unavailable" : ""}"
          style=${`--mac-accent: ${a}`}
          role="button"
          tabindex="0"
          aria-label=${`${o}: ${r}`}
          @click=${this.tap}
          @dblclick=${this.doubleTap}
          @pointerdown=${this.pointerDown}
          @pointerup=${this.pointerUp}
          @pointercancel=${this.pointerUp}
          @keydown=${this.keydown}
        >
          ${this.renderArtwork(t)}
          ${this.config.show_icon === !1 ? l : d`<span class="icon"><ha-icon .icon=${c}></ha-icon></span>`}
          <span class="copy">
            <div class="primary">${o}</div>
            ${r ? d`<div class="secondary">${r}</div>` : l}
          </span>
          ${this.descriptor?.family === "metric" && t ? d`<span class="metric">${D(t)}</span>` : l}
          ${this.renderDetails()}
          ${this.renderVariantContent(t)}
        </div>
      </ha-card>
    `;
  }
  getEntity() {
    return this.config?.entity && this.hass ? this.hass.states[this.config.entity] : void 0;
  }
  renderDetails() {
    return !this.hass || !this.config?.entities?.length ? l : d`<div class="details">
      ${this.config.entities.map((t) => {
      const i = this.hass?.states[t];
      return d`<span class="detail">${dt({ entity: t }, i)}: ${D(i)}</span>`;
    })}
    </div>`;
  }
  renderArtwork(t) {
    return this.config?.variant !== "artwork" || !t?.attributes.entity_picture ? l : d`<div class="artwork" style=${`background-image: url("${String(t.attributes.entity_picture)}")`}></div>`;
  }
  renderVariantContent(t) {
    const i = this.config?.variant;
    if (!i || !this.hass || !this.config) return l;
    if (i === "slider") {
      const s = Number(t?.attributes.brightness), o = Number.isFinite(s) ? Math.round(s / 2.55) : Number(t?.state ?? 0);
      return d`<div class="variant-content">
        <input
          type="range"
          min="0"
          max="100"
          .value=${String(Number.isFinite(o) ? o : 0)}
          aria-label="Value"
          @pointerdown=${this.stopPropagation}
          @click=${this.stopPropagation}
          @change=${this.sliderChanged}
        />
      </div>`;
    }
    if (i === "controls")
      return d`<div class="variant-content">
        ${["media_previous_track", "media_play_pause", "media_next_track"].map((s) => d`
          <button
            class="control"
            aria-label=${s.replaceAll("_", " ")}
            @pointerdown=${this.stopPropagation}
            @click=${(o) => this.mediaControl(o, s)}
          >
            <ha-icon .icon=${s === "media_play_pause" ? "mdi:play-pause" : s.includes("previous") ? "mdi:skip-previous" : "mdi:skip-next"}></ha-icon>
          </button>
        `)}
      </div>`;
    if (i === "forecast") {
      const s = Array.isArray(t?.attributes.forecast) ? t.attributes.forecast.slice(0, 3) : [];
      return d`<div class="variant-content forecast">
        ${s.length ? s.map((o) => d`
          <span>${String(o.condition ?? "")} ${String(o.temperature ?? "")}</span>
        `) : d`<span>Forecast unavailable</span>`}
      </div>`;
    }
    return i === "list" || i === "welcome" ? d`<div class="variant-content">
        ${(this.config.entities ?? []).map((s) => d`
          <button
            class="control"
            aria-label=${`Activate ${s}`}
            @pointerdown=${this.stopPropagation}
            @click=${(o) => this.activateScene(o, s)}
          >
            <ha-icon icon="mdi:palette"></ha-icon>
          </button>
        `)}
      </div>` : l;
  }
  renderContainer() {
    const t = this.config?.chips ?? [];
    return d`
      <ha-card>
        <div class="chips">
          ${t.map((i) => {
      const s = i.type.replace(/^custom:/, ""), o = document.createElement(s);
      return o.hass = this.hass, o.setConfig(i), o;
    })}
          ${t.length === 0 ? d`<div class="preview">Add chips in the visual editor.</div>` : l}
        </div>
      </ha-card>
    `;
  }
  defaultIcon() {
    return this.descriptor?.upstreamId === "custom_card_playstation" ? this.config?.variant === "xbox" ? "mdi:microsoft-xbox" : "mdi:sony-playstation" : {
      weather: "mdi:weather-partly-cloudy",
      presence: "mdi:account",
      media: "mdi:play-circle",
      climate: "mdi:thermostat",
      metric: "mdi:gauge",
      cover: "mdi:window-shutter",
      control: "mdi:power",
      text: "mdi:text",
      camera: "mdi:camera",
      navigation: "mdi:arrow-right",
      entity: "mdi:information"
    }[this.descriptor?.family ?? "entity"] ?? "mdi:information";
  }
  runAction(t) {
    if (!this.hass || !this.config) return;
    const i = t === "tap_action" ? "tap" : t === "hold_action" ? "hold" : "double_tap";
    ee(this, this.config, i);
  }
  mediaControl(t, i) {
    t.stopPropagation(), this.hass && this.config?.entity && this.hass.callService("media_player", i, { entity_id: this.config.entity });
  }
  activateScene(t, i) {
    t.stopPropagation(), this.hass && this.hass.callService("scene", "turn_on", { entity_id: i });
  }
};
Y.styles = re;
let j = Y;
ce([
  G({ attribute: !1 })
], j.prototype, "hass");
const q = (e, t, i = [], s = []) => {
  const o = [...i, ...s, ...Object.keys(t?.states ?? {})], n = [...new Set(o)].filter((r) => t?.states?.[r] !== void 0);
  for (const r of e.preferredDomains ?? []) {
    const c = n.find((a) => a.startsWith(`${r}.`));
    if (c) return c;
  }
  return n[0];
}, le = (e) => e.name.replace(/ (Card|Chip)$/, ""), he = (e, t, i = [], s = []) => {
  if (e.kind === "container") {
    const a = q(
      { ...e, preferredDomains: ["sensor"] },
      t,
      i,
      s
    ), h = q(
      { ...e, preferredDomains: ["person", "device_tracker"] },
      t,
      i,
      s
    );
    return {
      type: `custom:${e.tag}`,
      chips: [
        {
          type: "custom:mushroom-addition-chip-temperature",
          entity: a,
          name: a ? void 0 : "Temperature",
          secondary: a ? void 0 : "21 °C"
        },
        {
          type: "custom:mushroom-addition-chip-presence-detection",
          entity: h,
          name: h ? void 0 : "Presence",
          secondary: h ? void 0 : "Home"
        }
      ]
    };
  }
  const o = q(e, t, i, s), n = ["text", "navigation"].includes(e.family), c = e.upstreamId === "custom_card_playstation" && o?.toLowerCase().includes("xbox") ? "xbox" : e.variants?.[0];
  return {
    type: `custom:${e.tag}`,
    entity: o,
    name: o ? void 0 : le(e),
    secondary: o ? void 0 : n ? "Example" : "Preview",
    icon: e.kind === "chip" ? "mdi:circle-small" : void 0,
    variant: c,
    show_icon: !0,
    show_state: !0,
    entities: e.variants?.includes("with-sensors") ? s.slice(0, 2) : void 0
  };
}, pe = "1.0.1";
for (const e of y)
  if (!customElements.get(e.tag)) {
    const t = e;
    class i extends j {
      constructor() {
        super(...arguments), this.descriptor = t;
      }
      static getStubConfig(o, n = [], r = []) {
        return he(t, o, n, r);
      }
    }
    customElements.define(e.tag, i);
  }
window.customCards = window.customCards || [];
const de = new Set(window.customCards.map((e) => e.type));
for (const e of y)
  de.has(e.tag) || window.customCards.push({
    type: e.tag,
    name: `Mushroom Addition: ${e.name}`,
    description: e.description,
    preview: !0,
    documentationURL: "https://github.com/snfx-johaver/mushroom-cards-addition"
  });
console.info(
  `%c MUSHROOM-CARDS-ADDITION %c ${pe} · ${y.length} components `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;"
);
export {
  y as CATALOG
};
//# sourceMappingURL=mushroom-cards-addition.js.map
