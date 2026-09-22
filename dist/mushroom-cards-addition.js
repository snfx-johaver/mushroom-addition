const R = globalThis, q = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, F = /* @__PURE__ */ Symbol(), Y = /* @__PURE__ */ new WeakMap();
let ut = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== F) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (q && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Y.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Y.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const vt = (i) => new ut(typeof i == "string" ? i : i + "", void 0, F), mt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, o, n) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + i[n + 1], i[0]);
  return new ut(e, i, F);
}, yt = (i, t) => {
  if (q) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), o = R.litNonce;
    o !== void 0 && s.setAttribute("nonce", o), s.textContent = e.cssText, i.appendChild(s);
  }
}, tt = q ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return vt(e);
})(i) : i;
const { is: bt, defineProperty: wt, getOwnPropertyDescriptor: At, getOwnPropertyNames: xt, getOwnPropertySymbols: Ct, getPrototypeOf: Et } = Object, L = globalThis, et = L.trustedTypes, St = et ? et.emptyScript : "", kt = L.reactiveElementPolyfillSupport, S = (i, t) => i, z = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? St : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, W = (i, t) => !bt(i, t), it = { attribute: !0, type: String, converter: z, reflect: !1, useDefault: !1, hasChanged: W };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), L.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let b = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = it) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), o = this.getPropertyDescriptor(t, s, e);
      o !== void 0 && wt(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: o, set: n } = At(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: o, set(r) {
      const c = o?.call(this);
      n?.call(this, r), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? it;
  }
  static _$Ei() {
    if (this.hasOwnProperty(S("elementProperties"))) return;
    const t = Et(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(S("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
      const e = this.properties, s = [...xt(e), ...Ct(e)];
      for (const o of s) this.createProperty(o, e[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, o] of e) this.elementProperties.set(s, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const o = this._$Eu(e, s);
      o !== void 0 && this._$Eh.set(o, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const o of s) e.unshift(tt(o));
    } else t !== void 0 && e.push(tt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
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
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return yt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, s);
    if (o !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : z).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(o) : this.setAttribute(o, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, o = s._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const n = s.getPropertyOptions(o), r = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : z;
      this._$Em = o;
      const c = r.fromAttribute(e, n.type);
      this[o] = c ?? this._$Ej?.get(o) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, o = !1, n) {
    if (t !== void 0) {
      const r = this.constructor;
      if (o === !1 && (n = this[t]), s ??= r.getPropertyOptions(t), !((s.hasChanged ?? W)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: o, wrapped: n }, r) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), n !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), o === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
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
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[S("elementProperties")] = /* @__PURE__ */ new Map(), b[S("finalized")] = /* @__PURE__ */ new Map(), kt?.({ ReactiveElement: b }), (L.reactiveElementVersions ??= []).push("2.1.2");
const K = globalThis, st = (i) => i, D = K.trustedTypes, ot = D ? D.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, _t = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, ft = "?" + f, Pt = `<${ft}>`, v = document, k = () => v.createComment(""), P = (i) => i === null || typeof i != "object" && typeof i != "function", Z = Array.isArray, Tt = (i) => Z(i) || typeof i?.[Symbol.iterator] == "function", V = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, nt = /-->/g, rt = />/g, g = RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), at = /'/g, ct = /"/g, gt = /^(?:script|style|textarea|title)$/i, Ut = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), p = Ut(1), A = /* @__PURE__ */ Symbol.for("lit-noChange"), l = /* @__PURE__ */ Symbol.for("lit-nothing"), lt = /* @__PURE__ */ new WeakMap(), $ = v.createTreeWalker(v, 129);
function $t(i, t) {
  if (!Z(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ot !== void 0 ? ot.createHTML(t) : t;
}
const Ot = (i, t) => {
  const e = i.length - 1, s = [];
  let o, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = C;
  for (let c = 0; c < e; c++) {
    const a = i[c];
    let d, u, h = -1, m = 0;
    for (; m < a.length && (r.lastIndex = m, u = r.exec(a), u !== null); ) m = r.lastIndex, r === C ? u[1] === "!--" ? r = nt : u[1] !== void 0 ? r = rt : u[2] !== void 0 ? (gt.test(u[2]) && (o = RegExp("</" + u[2], "g")), r = g) : u[3] !== void 0 && (r = g) : r === g ? u[0] === ">" ? (r = o ?? C, h = -1) : u[1] === void 0 ? h = -2 : (h = r.lastIndex - u[2].length, d = u[1], r = u[3] === void 0 ? g : u[3] === '"' ? ct : at) : r === ct || r === at ? r = g : r === nt || r === rt ? r = C : (r = g, o = void 0);
    const _ = r === g && i[c + 1].startsWith("/>") ? " " : "";
    n += r === C ? a + Pt : h >= 0 ? (s.push(d), a.slice(0, h) + _t + a.slice(h) + f + _) : a + f + (h === -2 ? c : _);
  }
  return [$t(i, n + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class T {
  constructor({ strings: t, _$litType$: e }, s) {
    let o;
    this.parts = [];
    let n = 0, r = 0;
    const c = t.length - 1, a = this.parts, [d, u] = Ot(t, e);
    if (this.el = T.createElement(d, s), $.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (o = $.nextNode()) !== null && a.length < c; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const h of o.getAttributeNames()) if (h.endsWith(_t)) {
          const m = u[r++], _ = o.getAttribute(h).split(f), M = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: n, name: M[2], strings: _, ctor: M[1] === "." ? Nt : M[1] === "?" ? Ht : M[1] === "@" ? Rt : I }), o.removeAttribute(h);
        } else h.startsWith(f) && (a.push({ type: 6, index: n }), o.removeAttribute(h));
        if (gt.test(o.tagName)) {
          const h = o.textContent.split(f), m = h.length - 1;
          if (m > 0) {
            o.textContent = D ? D.emptyScript : "";
            for (let _ = 0; _ < m; _++) o.append(h[_], k()), $.nextNode(), a.push({ type: 2, index: ++n });
            o.append(h[m], k());
          }
        }
      } else if (o.nodeType === 8) if (o.data === ft) a.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = o.data.indexOf(f, h + 1)) !== -1; ) a.push({ type: 7, index: n }), h += f.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = v.createElement("template");
    return s.innerHTML = t, s;
  }
}
function x(i, t, e = i, s) {
  if (t === A) return t;
  let o = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = P(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== n && (o?._$AO?.(!1), n === void 0 ? o = void 0 : (o = new n(i), o._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = o : e._$Cl = o), o !== void 0 && (t = x(i, o._$AS(i, t.values), o, s)), t;
}
class Mt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, o = (t?.creationScope ?? v).importNode(e, !0);
    $.currentNode = o;
    let n = $.nextNode(), r = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let d;
        a.type === 2 ? d = new O(n, n.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (d = new zt(n, this, t)), this._$AV.push(d), a = s[++c];
      }
      r !== a?.index && (n = $.nextNode(), r++);
    }
    return $.currentNode = v, o;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class O {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, o) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = o, this._$Cv = o?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = x(this, t, e), P(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Tt(t) ? this.k(t) : this._(t);
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
    const { values: e, _$litType$: s } = t, o = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = T.createElement($t(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === o) this._$AH.p(e);
    else {
      const n = new Mt(o, this), r = n.u(this.options);
      n.p(e), this.T(r), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = lt.get(t.strings);
    return e === void 0 && lt.set(t.strings, e = new T(t)), e;
  }
  k(t) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, o = 0;
    for (const n of t) o === e.length ? e.push(s = new O(this.O(k()), this.O(k()), this, this.options)) : s = e[o], s._$AI(n), o++;
    o < e.length && (this._$AR(s && s._$AB.nextSibling, o), e.length = o);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = st(t).nextSibling;
      st(t).remove(), t = s;
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
  constructor(t, e, s, o, n) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = e, this._$AM = o, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(t, e = this, s, o) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) t = x(this, t, e, 0), r = !P(t) || t !== this._$AH && t !== A, r && (this._$AH = t);
    else {
      const c = t;
      let a, d;
      for (t = n[0], a = 0; a < n.length - 1; a++) d = x(this, c[s + a], e, a), d === A && (d = this._$AH[a]), r ||= !P(d) || d !== this._$AH[a], d === l ? t = l : t !== l && (t += (d ?? "") + n[a + 1]), this._$AH[a] = d;
    }
    r && !o && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Nt extends I {
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
  constructor(t, e, s, o, n) {
    super(t, e, s, o, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = x(this, t, e, 0) ?? l) === A) return;
    const s = this._$AH, o = t === l && s !== l || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== l && (s === l || o);
    o && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class zt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    x(this, t);
  }
}
const Dt = K.litHtmlPolyfillSupport;
Dt?.(T, O), (K.litHtmlVersions ??= []).push("3.3.3");
const jt = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let o = s._$litPart$;
  if (o === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = o = new O(t.insertBefore(k(), n), n, void 0, e ?? {});
  }
  return o._$AI(i), o;
};
const J = globalThis;
class w extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = jt(e, this.renderRoot, this.renderOptions);
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
w._$litElement$ = !0, w.finalized = !0, J.litElementHydrateSupport?.({ LitElement: w });
const Lt = J.litElementPolyfillSupport;
Lt?.({ LitElement: w });
(J.litElementVersions ??= []).push("4.2.2");
const It = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
const Vt = { attribute: !0, type: String, converter: z, reflect: !1, hasChanged: W }, Bt = (i = Vt, t, e) => {
  const { kind: s, metadata: o } = e;
  let n = globalThis.litPropertyMetadata.get(o);
  if (n === void 0 && globalThis.litPropertyMetadata.set(o, n = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), n.set(e.name, i), s === "accessor") {
    const { name: r } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(r, a, i, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, i, c), c;
    } };
  }
  if (s === "setter") {
    const { name: r } = e;
    return function(c) {
      const a = this[r];
      t.call(this, c), this.requestUpdate(r, a, i, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function G(i) {
  return (t, e) => typeof e == "object" ? Bt(i, t, e) : ((s, o, n) => {
    const r = o.hasOwnProperty(n);
    return o.constructor.createProperty(n, s), r ? Object.getOwnPropertyDescriptor(o, n) : void 0;
  })(i, t, e);
}
function qt(i) {
  return G({ ...i, state: !0, attribute: !1 });
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
], Wt = [
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
], Kt = [
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
], Zt = [
  "group_counter",
  "moon",
  "myenedis",
  "simple_temp",
  "tesla_temperature",
  "update",
  "vlape_garage"
], ht = (i) => i.replace(/^iAbadia/, "iAbadia").split("_").map((t) => t.length <= 3 ? t.toUpperCase() : `${t[0].toUpperCase()}${t.slice(1)}`).join(" "), Jt = (i) => /weather|sun|pollen|moon/.test(i) ? "weather" : /person|tracker|tracer|presence|room|welcome/.test(i) ? "presence" : /media|chromecast|playstation/.test(i) ? "media" : /thermostat|heat_pump|aircondition|temperature/.test(i) ? "climate" : /power|battery|gauge|speedtest|wifisignal|graph|apex|bar_card/.test(i) ? "metric" : /cover|door|garage/.test(i) ? "cover" : /light|fan|outlet|boolean|script|scene|vacuum|lock|washer|water_heater/.test(i) ? "control" : /title|subtitle|clock|date/.test(i) ? "text" : /camera/.test(i) ? "camera" : /navigate|back/.test(i) ? "navigation" : "entity", Gt = {
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
  card_vacuum: ["default", "popup"]
}, N = (i, t, e) => {
  const s = i.replaceAll("_", "-").toLowerCase(), o = s.startsWith("custom-card-") || s.startsWith("custom-chip-") ? `mushroom-addition-${s}` : `mushroom-addition-${t}-${s.replace(new RegExp(`^${t}-`), "")}`;
  return {
    upstreamId: i,
    sourcePath: e,
    kind: t,
    family: Jt(i),
    tag: o,
    name: `${ht(i)} ${t === "chip" ? "Chip" : "Card"}`,
    description: `Mushroom-style ${ht(i).toLowerCase()} ${t}.`,
    variants: Gt[i]
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
  ...Ft.map((i) => {
    const t = {
      graph: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/2-line_cards/card_graph.yaml",
      scenes: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_scenes_welcome.yaml",
      title: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/title/card_title.yaml",
      vertical_button: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/vertical_buttons/vertical_buttons.yaml"
    };
    return N(
      `card_${i}`,
      "card",
      t[i] ?? `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_${i}.yaml`
    );
  }),
  ...Wt.map((i) => N(
    `chip_${i}`,
    "chip",
    `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_${i}.yaml`
  )),
  ...Kt.map((i) => N(
    `custom_card_${i}`,
    "card",
    `custom_cards/custom_card_${i}`
  )),
  ...Zt.map((i) => N(
    `custom_chip_${i}`,
    "chip",
    `custom_cards/custom_chip_${i}`
  ))
];
y.filter((i) => i.kind !== "container");
const Qt = (i) => y.find((t) => t.tag === i), Xt = /* @__PURE__ */ new Set([
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
]), H = (i) => {
  if (!i) return "Entity unavailable";
  const t = i.attributes.unit_of_measurement;
  return t ? `${i.state} ${String(t)}` : i.state.replaceAll("_", " ");
}, pt = (i, t) => i.name || t?.attributes.friendly_name || i.entity || "Mushroom Addition", E = (i, t, e) => {
  i.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    composed: !0,
    detail: e
  }));
}, Yt = (i, t, e) => {
  E(i, "hass-action", { config: t, action: e });
}, te = (i) => ({
  show_icon: !0,
  show_state: !0,
  layout: "horizontal",
  tap_action: { action: i.entity ? "more-info" : "none" },
  ...i
}), dt = {
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
}, ee = (i, t) => {
  const e = i?.language?.split("-")[0] ?? "en";
  return dt[e]?.[t] ?? dt.en[t] ?? t.replaceAll("_", " ").replace(/\b\w/g, (s) => s.toUpperCase());
};
var ie = Object.defineProperty, se = Object.getOwnPropertyDescriptor, Q = (i, t, e, s) => {
  for (var o = s > 1 ? void 0 : s ? se(t, e) : t, n = i.length - 1, r; n >= 0; n--)
    (r = i[n]) && (o = (s ? r(t, e, o) : r(o)) || o);
  return s && o && ie(t, e, o), o;
};
const B = (i) => ({ name: i, selector: { ui_action: {} } });
let U = class extends w {
  constructor() {
    super(...arguments), this.computeLabel = (i) => ee(this.hass, i.name), this.valueChanged = (i) => {
      if (!this.config || !i.detail.value) return;
      const t = i.detail.value, e = { ...this.config, ...t };
      this.config = e, E(this, "config-changed", { config: e });
    }, this.addChip = () => {
      if (!this.config) return;
      const i = y.find((t) => t.kind === "chip");
      i && (this.config = {
        ...this.config,
        chips: [...this.config.chips ?? [], { type: `custom:${i.tag}`, show_icon: !0, show_state: !0 }]
      }, E(this, "config-changed", { config: this.config }));
    };
  }
  setConfig(i) {
    this.config = i;
  }
  render() {
    if (!this.hass || !this.config) return l;
    const i = Qt(this.config.type.replace(/^custom:/, ""));
    if (i?.kind === "container") {
      const e = y.filter((s) => s.kind === "chip");
      return p`<div class="chips">
        ${(this.config.chips ?? []).map((s, o) => p`
          <div class="chip-row">
            <select
              aria-label="Chip type"
              .value=${s.type}
              @change=${(n) => this.updateChip(o, "type", n.target.value)}
            >
              ${e.map((n) => p`
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
    return i?.variants?.length && t.push({
      name: "variant",
      selector: { select: { options: i.variants, mode: "dropdown" } }
    }), t.push(
      { name: "layout", selector: { select: { options: ["horizontal", "vertical"] } } },
      { name: "show_icon", selector: { boolean: {} } },
      { name: "show_state", selector: { boolean: {} } },
      B("tap_action"),
      B("hold_action"),
      B("double_tap_action")
    ), p`
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${t}
        .computeLabel=${this.computeLabel}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }
  removeChip(i) {
    this.config && (this.config = {
      ...this.config,
      chips: (this.config.chips ?? []).filter((t, e) => e !== i)
    }, E(this, "config-changed", { config: this.config }));
  }
  updateChip(i, t, e) {
    this.config && (this.config = {
      ...this.config,
      chips: (this.config.chips ?? []).map((s, o) => o === i ? { ...s, [t]: e || void 0 } : s)
    }, E(this, "config-changed", { config: this.config }));
  }
};
U.styles = mt`
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
  qt()
], U.prototype, "config", 2);
U = Q([
  It("mushroom-addition-editor")
], U);
const oe = mt`
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
var ne = Object.defineProperty, re = (i, t, e, s) => {
  for (var o = void 0, n = i.length - 1, r; n >= 0; n--)
    (r = i[n]) && (o = r(t, e, o) || o);
  return o && ne(t, e, o), o;
};
const X = class X extends w {
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
      const e = Number(t.target.value);
      this.config.entity.split(".", 1)[0] === "light" ? this.hass.callService("light", "turn_on", { entity_id: this.config.entity, brightness_pct: e }) : this.hass.callService("input_number", "set_value", { entity_id: this.config.entity, value: e });
    };
  }
  setConfig(t) {
    if (!t || typeof t != "object") throw new Error("A card configuration is required.");
    this.config = te(t);
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
    if (!this.hass) return p`<ha-card><div class="preview">Mushroom Addition preview</div></ha-card>`;
    if (this.descriptor?.kind === "container") return this.renderContainer();
    const t = this.getEntity(), e = !!(this.config.entity && !t), s = t ? Xt.has(t.state.toLowerCase()) : !1;
    let o = pt(this.config, t);
    const n = this.config.secondary || (this.config.show_state === !1 || !this.config.entity ? "" : H(t));
    let r = n;
    (this.descriptor?.upstreamId === "card_generic_swap" || this.config.variant === "swapped") && (r = o, o = n || o), this.config.variant === "custom-state" && t && (r = o, o = H(t));
    const c = this.config.icon || t?.attributes.icon || this.defaultIcon(), a = this.config.icon_color ? `var(--rgb-${this.config.icon_color}-color, var(--mush-rgb-blue, 33, 150, 243))` : "var(--mush-rgb-blue, 33, 150, 243)", d = [
      ["compact", "small", "no-external-resource"].includes(this.config.variant ?? "") ? "compact" : "",
      this.config.variant === "popup" ? "popup" : "",
      this.descriptor?.upstreamId === "card_binary_sensor_alert" || this.config.variant === "alert" ? "alert" : ""
    ].filter(Boolean).join(" ");
    return this.descriptor?.kind === "chip" ? p`
        <div
          class="chip ${s ? "active" : ""} ${e ? "unavailable" : ""}"
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
          ${this.config.show_icon === !1 ? l : p`<span class="icon"><ha-icon .icon=${c}></ha-icon></span>`}
          <span class="chip-label">${this.descriptor.family === "text" ? r : o}${this.config.show_state === !1 ? "" : r && this.descriptor.family !== "text" ? ` · ${r}` : ""}</span>
        </div>
      ` : p`
      <ha-card>
        <div
          class="card ${this.config.layout === "vertical" ? "vertical" : ""} ${d} ${s ? "active" : ""} ${e ? "unavailable" : ""}"
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
          ${this.config.show_icon === !1 ? l : p`<span class="icon"><ha-icon .icon=${c}></ha-icon></span>`}
          <span class="copy">
            <div class="primary">${o}</div>
            ${r ? p`<div class="secondary">${r}</div>` : l}
          </span>
          ${this.descriptor?.family === "metric" && t ? p`<span class="metric">${H(t)}</span>` : l}
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
    return !this.hass || !this.config?.entities?.length ? l : p`<div class="details">
      ${this.config.entities.map((t) => {
      const e = this.hass?.states[t];
      return p`<span class="detail">${pt({ entity: t }, e)}: ${H(e)}</span>`;
    })}
    </div>`;
  }
  renderArtwork(t) {
    return this.config?.variant !== "artwork" || !t?.attributes.entity_picture ? l : p`<div class="artwork" style=${`background-image: url("${String(t.attributes.entity_picture)}")`}></div>`;
  }
  renderVariantContent(t) {
    const e = this.config?.variant;
    if (!e || !this.hass || !this.config) return l;
    if (e === "slider") {
      const s = Number(t?.attributes.brightness), o = Number.isFinite(s) ? Math.round(s / 2.55) : Number(t?.state ?? 0);
      return p`<div class="variant-content">
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
    if (e === "controls")
      return p`<div class="variant-content">
        ${["media_previous_track", "media_play_pause", "media_next_track"].map((s) => p`
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
    if (e === "forecast") {
      const s = Array.isArray(t?.attributes.forecast) ? t.attributes.forecast.slice(0, 3) : [];
      return p`<div class="variant-content forecast">
        ${s.length ? s.map((o) => p`
          <span>${String(o.condition ?? "")} ${String(o.temperature ?? "")}</span>
        `) : p`<span>Forecast unavailable</span>`}
      </div>`;
    }
    return e === "list" || e === "welcome" ? p`<div class="variant-content">
        ${(this.config.entities ?? []).map((s) => p`
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
    return p`
      <ha-card>
        <div class="chips">
          ${t.map((e) => {
      const s = e.type.replace(/^custom:/, ""), o = document.createElement(s);
      return o.hass = this.hass, o.setConfig(e), o;
    })}
          ${t.length === 0 ? p`<div class="preview">Add chips in the visual editor.</div>` : l}
        </div>
      </ha-card>
    `;
  }
  defaultIcon() {
    return {
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
    const e = t === "tap_action" ? "tap" : t === "hold_action" ? "hold" : "double_tap";
    Yt(this, this.config, e);
  }
  mediaControl(t, e) {
    t.stopPropagation(), this.hass && this.config?.entity && this.hass.callService("media_player", e, { entity_id: this.config.entity });
  }
  activateScene(t, e) {
    t.stopPropagation(), this.hass && this.hass.callService("scene", "turn_on", { entity_id: e });
  }
};
X.styles = oe;
let j = X;
re([
  G({ attribute: !1 })
], j.prototype, "hass");
const ae = "1.0.0";
for (const i of y)
  if (!customElements.get(i.tag)) {
    const t = i;
    class e extends j {
      constructor() {
        super(...arguments), this.descriptor = t;
      }
      static getStubConfig() {
        return {
          type: `custom:${t.tag}`,
          name: t.name.replace(/ (Card|Chip)$/, ""),
          icon: t.kind === "chip" ? "mdi:circle-small" : void 0,
          variant: t.variants?.[0],
          show_icon: !0,
          show_state: !0
        };
      }
    }
    customElements.define(i.tag, e);
  }
window.customCards = window.customCards || [];
const ce = new Set(window.customCards.map((i) => i.type));
for (const i of y)
  ce.has(i.tag) || window.customCards.push({
    type: i.tag,
    name: `Mushroom Addition: ${i.name}`,
    description: i.description,
    preview: !0,
    documentationURL: "https://github.com/snfx-johaver/mushroom-cards-addition"
  });
console.info(
  `%c MUSHROOM-CARDS-ADDITION %c ${ae} · ${y.length} components `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;"
);
export {
  y as CATALOG
};
//# sourceMappingURL=mushroom-cards-addition.js.map
