const W = globalThis, ne = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, oe = /* @__PURE__ */ Symbol(), he = /* @__PURE__ */ new WeakMap();
let Pe = class {
  constructor(t, i, r) {
    if (this._$cssResult$ = !0, r !== oe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (ne && t === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (t = he.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && he.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const De = (e) => new Pe(typeof e == "string" ? e : e + "", void 0, oe), xe = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((r, n, o) => r + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[o + 1], e[0]);
  return new Pe(i, e, oe);
}, He = (e, t) => {
  if (ne) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const r = document.createElement("style"), n = W.litNonce;
    n !== void 0 && r.setAttribute("nonce", n), r.textContent = i.cssText, e.appendChild(r);
  }
}, de = ne ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const r of t.cssRules) i += r.cssText;
  return De(i);
})(e) : e;
const { is: Re, defineProperty: je, getOwnPropertyDescriptor: Le, getOwnPropertyNames: Ie, getOwnPropertySymbols: Be, getPrototypeOf: Fe } = Object, J = globalThis, me = J.trustedTypes, Ve = me ? me.emptyScript : "", qe = J.reactiveElementPolyfillSupport, R = (e, t) => e, G = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Ve : null;
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
} }, se = (e, t) => !Re(e, t), _e = { attribute: !0, type: String, converter: G, reflect: !1, useDefault: !1, hasChanged: se };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), J.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let M = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = _e) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(t, r, i);
      n !== void 0 && je(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, i, r) {
    const { get: n, set: o } = Le(this.prototype, t) ?? { get() {
      return this[i];
    }, set(s) {
      this[i] = s;
    } };
    return { get: n, set(s) {
      const l = n?.call(this);
      o?.call(this, s), this.requestUpdate(t, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? _e;
  }
  static _$Ei() {
    if (this.hasOwnProperty(R("elementProperties"))) return;
    const t = Fe(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(R("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(R("properties"))) {
      const i = this.properties, r = [...Ie(i), ...Be(i)];
      for (const n of r) this.createProperty(n, i[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [r, n] of i) this.elementProperties.set(r, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, r] of this.elementProperties) {
      const n = this._$Eu(i, r);
      n !== void 0 && this._$Eh.set(n, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const n of r) i.unshift(de(n));
    } else t !== void 0 && i.push(de(t));
    return i;
  }
  static _$Eu(t, i) {
    const r = i.attribute;
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
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const r of i.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return He(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, r) {
    this._$AK(t, r);
  }
  _$ET(t, i) {
    const r = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, r);
    if (n !== void 0 && r.reflect === !0) {
      const o = (r.converter?.toAttribute !== void 0 ? r.converter : G).toAttribute(i, r.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const r = this.constructor, n = r._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = r.getPropertyOptions(n), s = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : G;
      this._$Em = n;
      const l = s.fromAttribute(i, o.type);
      this[n] = l ?? this._$Ej?.get(n) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, i, r, n = !1, o) {
    if (t !== void 0) {
      const s = this.constructor;
      if (n === !1 && (o = this[t]), r ??= s.getPropertyOptions(t), !((r.hasChanged ?? se)(o, i) || r.useDefault && r.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(s._$Eu(t, r)))) return;
      this.C(t, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: r, reflect: n, wrapped: o }, s) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, s ?? i ?? this[t]), o !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (i = void 0), this._$AL.set(t, i)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, o] of r) {
        const { wrapped: s } = o, l = this[n];
        s !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, o, l);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
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
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[R("elementProperties")] = /* @__PURE__ */ new Map(), M[R("finalized")] = /* @__PURE__ */ new Map(), qe?.({ ReactiveElement: M }), (J.reactiveElementVersions ??= []).push("2.1.2");
const ae = globalThis, ge = (e) => e, Z = ae.trustedTypes, fe = Z ? Z.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Te = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, Me = "?" + k, Ke = `<${Me}>`, x = document, j = () => x.createComment(""), L = (e) => e === null || typeof e != "object" && typeof e != "function", ce = Array.isArray, We = (e) => ce(e) || typeof e?.[Symbol.iterator] == "function", ee = `[ 	
\f\r]`, D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ye = /-->/g, ve = />/g, C = RegExp(`>|${ee}(?:([^\\s"'>=/]+)(${ee}*=${ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), be = /'/g, $e = /"/g, Ue = /^(?:script|style|textarea|title)$/i, Ge = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), c = Ge(1), z = /* @__PURE__ */ Symbol.for("lit-noChange"), u = /* @__PURE__ */ Symbol.for("lit-nothing"), we = /* @__PURE__ */ new WeakMap(), E = x.createTreeWalker(x, 129);
function Oe(e, t) {
  if (!ce(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return fe !== void 0 ? fe.createHTML(t) : t;
}
const Ze = (e, t) => {
  const i = e.length - 1, r = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = D;
  for (let l = 0; l < i; l++) {
    const a = e[l];
    let h, m, d = -1, A = 0;
    for (; A < a.length && (s.lastIndex = A, m = s.exec(a), m !== null); ) A = s.lastIndex, s === D ? m[1] === "!--" ? s = ye : m[1] !== void 0 ? s = ve : m[2] !== void 0 ? (Ue.test(m[2]) && (n = RegExp("</" + m[2], "g")), s = C) : m[3] !== void 0 && (s = C) : s === C ? m[0] === ">" ? (s = n ?? D, d = -1) : m[1] === void 0 ? d = -2 : (d = s.lastIndex - m[2].length, h = m[1], s = m[3] === void 0 ? C : m[3] === '"' ? $e : be) : s === $e || s === be ? s = C : s === ye || s === ve ? s = D : (s = C, n = void 0);
    const S = s === C && e[l + 1].startsWith("/>") ? " " : "";
    o += s === D ? a + Ke : d >= 0 ? (r.push(h), a.slice(0, d) + Te + a.slice(d) + k + S) : a + k + (d === -2 ? l : S);
  }
  return [Oe(e, o + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class I {
  constructor({ strings: t, _$litType$: i }, r) {
    let n;
    this.parts = [];
    let o = 0, s = 0;
    const l = t.length - 1, a = this.parts, [h, m] = Ze(t, i);
    if (this.el = I.createElement(h, r), E.currentNode = this.el.content, i === 2 || i === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (n = E.nextNode()) !== null && a.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const d of n.getAttributeNames()) if (d.endsWith(Te)) {
          const A = m[s++], S = n.getAttribute(d).split(k), q = /([.?@])?(.*)/.exec(A);
          a.push({ type: 1, index: o, name: q[2], strings: S, ctor: q[1] === "." ? Xe : q[1] === "?" ? Qe : q[1] === "@" ? Ye : X }), n.removeAttribute(d);
        } else d.startsWith(k) && (a.push({ type: 6, index: o }), n.removeAttribute(d));
        if (Ue.test(n.tagName)) {
          const d = n.textContent.split(k), A = d.length - 1;
          if (A > 0) {
            n.textContent = Z ? Z.emptyScript : "";
            for (let S = 0; S < A; S++) n.append(d[S], j()), E.nextNode(), a.push({ type: 2, index: ++o });
            n.append(d[A], j());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Me) a.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = n.data.indexOf(k, d + 1)) !== -1; ) a.push({ type: 7, index: o }), d += k.length - 1;
      }
      o++;
    }
  }
  static createElement(t, i) {
    const r = x.createElement("template");
    return r.innerHTML = t, r;
  }
}
function N(e, t, i = e, r) {
  if (t === z) return t;
  let n = r !== void 0 ? i._$Co?.[r] : i._$Cl;
  const o = L(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== o && (n?._$AO?.(!1), o === void 0 ? n = void 0 : (n = new o(e), n._$AT(e, i, r)), r !== void 0 ? (i._$Co ??= [])[r] = n : i._$Cl = n), n !== void 0 && (t = N(e, n._$AS(e, t.values), n, r)), t;
}
class Je {
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
    const { el: { content: i }, parts: r } = this._$AD, n = (t?.creationScope ?? x).importNode(i, !0);
    E.currentNode = n;
    let o = E.nextNode(), s = 0, l = 0, a = r[0];
    for (; a !== void 0; ) {
      if (s === a.index) {
        let h;
        a.type === 2 ? h = new V(o, o.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (h = new et(o, this, t)), this._$AV.push(h), a = r[++l];
      }
      s !== a?.index && (o = E.nextNode(), s++);
    }
    return E.currentNode = x, n;
  }
  p(t) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, i), i += r.strings.length - 2) : r._$AI(t[i])), i++;
  }
}
class V {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, r, n) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = r, this.options = n, this._$Cv = n?.isConnected ?? !0;
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
    t = N(this, t, i), L(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== z && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : We(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && L(this._$AH) ? this._$AA.nextSibling.data = t : this.T(x.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: r } = t, n = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = I.createElement(Oe(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === n) this._$AH.p(i);
    else {
      const o = new Je(n, this), s = o.u(this.options);
      o.p(i), this.T(s), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = we.get(t.strings);
    return i === void 0 && we.set(t.strings, i = new I(t)), i;
  }
  k(t) {
    ce(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, n = 0;
    for (const o of t) n === i.length ? i.push(r = new V(this.O(j()), this.O(j()), this, this.options)) : r = i[n], r._$AI(o), n++;
    n < i.length && (this._$AR(r && r._$AB.nextSibling, n), i.length = n);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const r = ge(t).nextSibling;
      ge(t).remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class X {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, r, n, o) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = i, this._$AM = n, this.options = o, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = u;
  }
  _$AI(t, i = this, r, n) {
    const o = this.strings;
    let s = !1;
    if (o === void 0) t = N(this, t, i, 0), s = !L(t) || t !== this._$AH && t !== z, s && (this._$AH = t);
    else {
      const l = t;
      let a, h;
      for (t = o[0], a = 0; a < o.length - 1; a++) h = N(this, l[r + a], i, a), h === z && (h = this._$AH[a]), s ||= !L(h) || h !== this._$AH[a], h === u ? t = u : t !== u && (t += (h ?? "") + o[a + 1]), this._$AH[a] = h;
    }
    s && !n && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Xe extends X {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Qe extends X {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class Ye extends X {
  constructor(t, i, r, n, o) {
    super(t, i, r, n, o), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = N(this, t, i, 0) ?? u) === z) return;
    const r = this._$AH, n = t === u && r !== u || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, o = t !== u && (r === u || n);
    n && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class et {
  constructor(t, i, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    N(this, t);
  }
}
const tt = ae.litHtmlPolyfillSupport;
tt?.(I, V), (ae.litHtmlVersions ??= []).push("3.3.3");
const it = (e, t, i) => {
  const r = i?.renderBefore ?? t;
  let n = r._$litPart$;
  if (n === void 0) {
    const o = i?.renderBefore ?? null;
    r._$litPart$ = n = new V(t.insertBefore(j(), o), o, void 0, i ?? {});
  }
  return n._$AI(e), n;
};
const le = globalThis;
class O extends M {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = it(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return z;
  }
}
O._$litElement$ = !0, O.finalized = !0, le.litElementHydrateSupport?.({ LitElement: O });
const rt = le.litElementPolyfillSupport;
rt?.({ LitElement: O });
(le.litElementVersions ??= []).push("4.2.2");
const nt = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const ot = { attribute: !0, type: String, converter: G, reflect: !1, hasChanged: se }, st = (e = ot, t, i) => {
  const { kind: r, metadata: n } = i;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(i.name, e), r === "accessor") {
    const { name: s } = i;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(s, a, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(s, void 0, e, l), l;
    } };
  }
  if (r === "setter") {
    const { name: s } = i;
    return function(l) {
      const a = this[s];
      t.call(this, l), this.requestUpdate(s, a, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function Q(e) {
  return (t, i) => typeof i == "object" ? st(e, t, i) : ((r, n, o) => {
    const s = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, r), s ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(e, t, i);
}
function at(e) {
  return Q({ ...e, state: !0, attribute: !1 });
}
const ct = [
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
], lt = [
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
], ut = [
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
], pt = [
  "group_counter",
  "moon",
  "myenedis",
  "simple_temp",
  "tesla_temperature",
  "update",
  "vlape_garage"
], Ae = (e) => e.replace(/^iAbadia/, "iAbadia").split("_").map((t) => ["nas", "mdi", "dwd", "vnc", "wifi", "http"].includes(t.toLowerCase()) ? t.toUpperCase() : `${t[0].toUpperCase()}${t.slice(1)}`).join(" "), ht = (e) => e === "custom_card_alarm_time" ? "alarm-time" : e === "custom_card_nik_door" ? "door" : /alarm|alert|lock/.test(e) ? "security" : /navigate|back/.test(e) ? "navigation" : /battery/.test(e) ? "battery" : /power_outlet|more_power_outlet/.test(e) ? "control" : /energy|power|gauge|speedtest|wifisignal|graph|apex|bar_card|myenedis/.test(e) ? "energy" : /weather|sun|pollen|moon/.test(e) ? "weather" : /scene/.test(e) ? "scene" : /person|tracker|tracer|presence|room|welcome/.test(e) ? "presence" : /media|chromecast|playstation/.test(e) ? "media" : /thermostat|heat_pump|aircondition|temperature|simple_temp/.test(e) ? "climate" : /cover|door|garage/.test(e) ? "cover" : /vacuum/.test(e) ? "vacuum" : /light/.test(e) ? "light" : /fan|outlet|boolean|script|washer|water_heater|qubino/.test(e) ? "control" : /title|subtitle|clock|date/.test(e) ? "text" : /camera/.test(e) ? "camera" : /sensor|elapsed|input_number|input_datetime|update|printer|nas|tablet|flower|car|afval|waste|counter/.test(e) ? "sensor" : "entity", dt = {
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
}, mt = (e, t) => e === "custom_card_alarm_time" ? ["input_boolean"] : e === "custom_card_nik_door" ? ["sensor"] : /alarm/.test(e) ? ["alarm_control_panel"] : /lock/.test(e) ? ["lock"] : /power_outlet|more_power_outlet/.test(e) ? ["switch", "light"] : e.includes("binary_sensor") ? ["binary_sensor"] : e.includes("battery") ? ["sensor"] : e.includes("input_boolean") ? ["input_boolean"] : e.includes("input_number") ? ["input_number"] : e.includes("input_datetime") ? ["input_datetime"] : e.includes("light") ? ["light"] : /media|chromecast|playstation/.test(e) ? ["media_player", "sensor"] : /thermostat|heat_pump|aircondition/.test(e) ? ["climate"] : /scene/.test(e) ? ["scene"] : /script/.test(e) ? ["script"] : /vacuum/.test(e) ? ["vacuum"] : /weather/.test(e) ? ["weather"] : /person/.test(e) ? ["person", "device_tracker"] : /cover|door|garage/.test(e) ? ["cover", "binary_sensor"] : /fan/.test(e) ? ["fan"] : /camera/.test(e) ? ["camera"] : /lock/.test(e) ? ["lock"] : /update/.test(e) ? ["update"] : t === "battery" || t === "energy" || t === "sensor" || t === "weather" ? ["sensor"] : t === "control" ? /fan/.test(e) ? ["fan"] : /script/.test(e) ? ["script"] : /washer/.test(e) ? ["sensor", "switch"] : /water_heater/.test(e) ? ["water_heater"] : ["switch", "input_boolean", "light"] : t === "presence" ? ["person", "device_tracker"] : ["sensor", "switch"], K = (e, t, i) => {
  const r = e.replace(/^custom_(card|chip)_/, "").replace(/^(card|chip)_/, ""), n = e.replaceAll("_", "-").toLowerCase(), o = n.startsWith("custom-card-") || n.startsWith("custom-chip-") ? `mushroom-addition-${n}` : `mushroom-addition-${t}-${n.replace(new RegExp(`^${t}-`), "")}`, s = ht(e), l = e === "custom_card_playstation";
  return {
    upstreamId: e,
    sourcePath: i,
    kind: t,
    family: s,
    tag: o,
    name: l ? "PS5 / Xbox Card" : `${Ae(r)} ${t === "chip" ? "Chip" : "Card"}`,
    description: l ? "Mushroom-style game console card with PS5 and Xbox modes." : `Mushroom-style ${Ae(r).toLowerCase()} ${t}.`,
    variants: dt[e],
    preferredDomains: mt(e, s)
  };
}, T = [
  {
    upstreamId: "chips_container",
    sourcePath: "Mushroom Cards Addition composition component",
    kind: "container",
    family: "chips",
    tag: "mushroom-addition-chips-card",
    name: "Addition Chips Card",
    description: "Compose Addition chips in a responsive row."
  },
  ...ct.map((e) => {
    const t = {
      graph: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/2-line_cards/card_graph.yaml",
      scenes: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_scenes_welcome.yaml",
      title: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/title/card_title.yaml",
      vertical_button: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/vertical_buttons/vertical_buttons.yaml"
    };
    return K(
      `card_${e}`,
      "card",
      t[e] ?? `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_${e}.yaml`
    );
  }),
  ...lt.map((e) => K(
    `chip_${e}`,
    "chip",
    `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/chips/chip_${e}.yaml`
  )),
  ...ut.map((e) => K(
    `custom_card_${e}`,
    "card",
    `custom_cards/custom_card_${e}`
  )),
  ...pt.map((e) => K(
    `custom_chip_${e}`,
    "chip",
    `custom_cards/custom_chip_${e}`
  ))
];
T.filter((e) => e.kind !== "container");
const Se = (e) => T.find((t) => t.tag === e), P = /* @__PURE__ */ new Set([
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
]), p = (e) => {
  if (!e) return "Entity unavailable";
  const t = e.attributes.unit_of_measurement;
  return t ? `${e.state} ${String(t)}` : e.state.replaceAll("_", " ");
}, Y = (e, t) => e.name || t?.attributes.friendly_name || e.entity || "Mushroom Addition", H = (e, t, i) => {
  e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    composed: !0,
    detail: i
  }));
}, _t = (e, t, i) => {
  H(e, "hass-action", { config: t, action: i });
}, gt = (e) => {
  const t = yt(e);
  return {
    show_icon: !0,
    show_state: !0,
    layout: "horizontal",
    tap_action: t.navigation_path ? { action: "navigate", navigation_path: t.navigation_path } : { action: t.entity ? "more-info" : "none" },
    ...t
  };
}, ft = [
  "ulm_card_person_entity",
  "ulm_card_light_entity",
  "ulm_card_weather_entity",
  "ulm_card_media_player_entity",
  "ulm_card_thermostat_entity",
  "ulm_card_cover_entity",
  "ulm_card_vacuum_entity"
], yt = (e) => {
  if (e.entity) return { ...e, primary_entity: void 0 };
  const t = e.primary_entity || ft.map((i) => e[i]).find((i) => typeof i == "string");
  return t ? { ...e, entity: t, primary_entity: void 0 } : { ...e };
}, ke = {
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
    console_platform: "Console platform"
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
}, vt = (e, t) => {
  const i = e?.language?.split("-")[0] ?? "en";
  return ke[i]?.[t] ?? ke.en[t] ?? t.replaceAll("_", " ").replace(/\b\w/g, (r) => r.toUpperCase());
}, f = (e, t = "entity") => ({
  name: t,
  selector: { entity: e?.length ? { domain: e } : {} }
}), U = (e) => ({ name: e, selector: { text: {} } }), g = (e) => ({ name: e, selector: { boolean: {} } }), te = (e, t = 1, i = 168) => ({
  name: e,
  selector: { number: { min: t, max: i, mode: "box" } }
}), ie = (e) => ({ name: e, selector: { ui_action: {} } }), _ = (e) => [
  f(e.preferredDomains),
  U("name"),
  { name: "icon", selector: { icon: {} } },
  { name: "icon_color", selector: { ui_color: {} } }
], Ce = {
  weather: (e) => [
    ..._(e),
    f(["sensor"], "temperature_entity"),
    f(["sensor"], "humidity_entity"),
    g("show_forecast"),
    ...e.variants?.length ? [{ name: "variant", selector: { select: { options: e.variants } } }] : []
  ],
  climate: (e) => [..._(e), f(["sensor"], "humidity_entity"), g("show_controls")],
  light: (e) => [..._(e), g("show_controls"), ...e.variants?.length ? [{ name: "variant", selector: { select: { options: e.variants } } }] : []],
  scene: (e) => [..._(e), { name: "entities", selector: { entity: { domain: ["scene"], multiple: !0 } } }],
  presence: (e) => [..._(e), f(["sensor"], "battery_entity"), f(["sensor"], "eta_entity"), f(["sensor"], "address_entity"), g("use_entity_picture")],
  battery: (e) => [..._(e), g("show_graph"), te("graph_hours", 1, 168)],
  energy: (e) => [..._(e), f(["sensor"], "graph_entity"), f(["sensor"], "min_entity"), f(["sensor"], "max_entity"), g("show_graph"), te("graph_hours", 1, 168)],
  sensor: (e) => [..._(e), f(["sensor"], "graph_entity"), g("show_graph"), te("graph_hours", 1, 168)],
  media: (e) => [..._(e), g("show_controls"), ...e.upstreamId === "custom_card_playstation" ? [{ name: "console_platform", selector: { select: { options: ["ps5", "xbox"] } } }] : []],
  cover: (e) => [..._(e), g("show_controls")],
  vacuum: (e) => [..._(e), g("show_controls")],
  security: (e) => [..._(e), g("show_controls")],
  navigation: () => [U("name"), { name: "icon", selector: { icon: {} } }, U("navigation_path")],
  chips: () => [],
  text: () => [U("name"), U("secondary"), { name: "icon", selector: { icon: {} } }],
  camera: (e) => [..._(e)],
  control: (e) => [
    ..._(e),
    .../power_outlet|more_power_outlet/.test(e.upstreamId) ? [f(["sensor"], "graph_entity"), g("show_graph")] : [],
    g("show_controls")
  ],
  "alarm-time": (e) => [..._(e), f(["input_datetime"], "datetime_entity"), g("show_controls")],
  door: (e) => [..._(e), f(["lock"], "lock_entity"), f(["sensor"], "battery_entity"), g("show_controls")],
  entity: (e) => [..._(e), U("secondary")]
}, bt = (e) => [
  ...(Ce[e.family] ?? Ce.entity)(e),
  ie("tap_action"),
  ie("hold_action"),
  ie("double_tap_action")
];
var $t = Object.defineProperty, wt = Object.getOwnPropertyDescriptor, ue = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? wt(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && $t(t, i, n), n;
};
let B = class extends O {
  constructor() {
    super(...arguments), this.computeLabel = (e) => vt(this.hass, e.name), this.valueChanged = (e) => {
      if (!this.config || !e.detail.value) return;
      const t = e.detail.value, i = { ...this.config, ...t };
      this.config = i, H(this, "config-changed", { config: i });
    }, this.addChip = () => {
      if (!this.config) return;
      const e = T.find((t) => t.kind === "chip");
      e && (this.config = {
        ...this.config,
        chips: [...this.config.chips ?? [], { type: `custom:${e.tag}`, show_icon: !0, show_state: !0 }]
      }, H(this, "config-changed", { config: this.config }));
    };
  }
  setConfig(e) {
    this.config = e;
  }
  render() {
    if (!this.hass || !this.config) return u;
    const e = Se(this.config.type.replace(/^custom:/, ""));
    if (e?.kind === "container") {
      const i = T.filter((r) => r.kind === "chip");
      return c`<div class="chips">
        ${(this.config.chips ?? []).map((r, n) => c`
          <div class="chip-row">
            <select
              aria-label="Chip type"
              .value=${r.type}
              @change=${(o) => this.updateChip(n, "type", o.target.value)}
            >
              ${i.map((o) => c`
                <option value=${`custom:${o.tag}`} ?selected=${r.type === `custom:${o.tag}`}>
                  ${o.name}
                </option>
              `)}
            </select>
            <ha-entity-picker
              .hass=${this.hass}
              aria-label="Entity ID"
              .value=${r.entity ?? ""}
              .includeDomains=${Se(r.type.replace(/^custom:/, ""))?.preferredDomains}
              @value-changed=${(o) => this.updateChip(n, "entity", o.detail.value ?? "")}
            ></ha-entity-picker>
            <button class="remove" @click=${() => this.removeChip(n)} aria-label="Remove chip">Remove</button>
          </div>
        `)}
        <button @click=${this.addChip}>Add chip</button>
      </div>`;
    }
    if (!e) return u;
    const t = bt(e);
    return c`
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
    }, H(this, "config-changed", { config: this.config }));
  }
  updateChip(e, t, i) {
    this.config && (this.config = {
      ...this.config,
      chips: (this.config.chips ?? []).map((r, n) => n === e ? { ...r, [t]: i || void 0 } : r)
    }, H(this, "config-changed", { config: this.config }));
  }
};
B.styles = xe`
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
ue([
  Q({ attribute: !1 })
], B.prototype, "hass", 2);
ue([
  at()
], B.prototype, "config", 2);
B = ue([
  nt("mushroom-addition-editor")
], B);
const At = xe`
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
  .ulm-light { grid-template-columns: auto minmax(0, 1fr); }
  .ulm-light .ulm-slider { grid-column: 1 / -1; width: 100%; accent-color: rgb(var(--ulm-yellow)); }
  .ulm-light.is-active { background: rgba(var(--ulm-yellow), .08); }
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
  .battery-ring, .battery-value { color: rgb(var(--ulm-green)); font-weight: 700; }
  .ulm-battery { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 12px; }
  .battery-value { font-size: 24px; }
  .battery-value small { font-size: 12px; }
  .battery-track { grid-column: 2 / -1; height: 5px; overflow: hidden; border-radius: 5px; background: rgba(var(--ulm-grey), .12); }
  .battery-track i { display: block; height: 100%; border-radius: inherit; background: rgb(var(--ulm-green)); }
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
`, w = (e, t) => e?.attributes[t], ze = (e) => {
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, b = (e, t) => {
  const i = e.config[t];
  return typeof i == "string" ? e.hass.states[i] : void 0;
}, St = (e, t) => e.config.icon || e.entity?.attributes.icon || t, y = (e, t, i = "blue") => c`
  <span class="ulm-icon tone-${i}"><ha-icon .icon=${St(e, t)}></ha-icon></span>
`, v = (e, t) => c`
  <span class="ulm-copy">
    <span class="ulm-name">${Y(e.config, e.entity)}</span>
    ${t ? c`<span class="ulm-label">${t}</span>` : u}
  </span>
`, $ = (e, t, i) => c`
  <button class="ulm-control" aria-label=${e} @pointerdown=${(r) => r.stopPropagation()} @click=${i}>
    <ha-icon .icon=${t}></ha-icon>
  </button>
`, Ee = {
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
}, kt = (e) => {
  const t = e.entity?.state ?? "unknown", [i, r] = Ee[t] ?? ["mdi:weather-partly-cloudy", "grey"], n = b(e, "temperature_entity"), o = b(e, "humidity_entity"), s = p(n) !== "Entity unavailable" ? p(n) : `${w(e.entity, "temperature") ?? "—"}${w(e.entity, "temperature_unit") ?? "°"}`, l = p(o) !== "Entity unavailable" ? p(o) : `${w(e.entity, "humidity") ?? "—"}%`, a = e.forecast?.slice(0, 4) ?? [];
  return e.actionSurface("ulm-weather", c`
    <div class="weather-main">
      <span class="ulm-icon weather-icon tone-${r}"><ha-icon .icon=${i}></ha-icon></span>
      <div class="weather-summary">
        <span class="weather-temp">${s}</span>
        <span class="ulm-name">${Y(e.config, e.entity)}</span>
        <span class="ulm-label weather-condition">${t.replaceAll("-", " ")}</span>
        ${a[0] ? c`<span class="weather-extrema">H ${String(a[0].temperature ?? "—")}° · L ${String(a[0].templow ?? a[0].temperature_low ?? "—")}°</span>` : u}
      </div>
    </div>
    <div class="weather-metrics">
      <span class="metric-pill"><ha-icon icon="mdi:water-percent"></ha-icon>${l}</span>
      <span class="metric-pill"><ha-icon icon="mdi:thermometer"></ha-icon>${s}</span>
    </div>
    ${e.config.show_forecast && a.length ? c`
      <div class="weather-forecast">
        ${a.map((h) => {
    const m = String(h.condition ?? "cloudy");
    return c`<span><ha-icon .icon=${Ee[m]?.[0] ?? "mdi:weather-cloudy"}></ha-icon><b>${String(h.temperature ?? "—")}°</b></span>`;
  })}
      </div>
    ` : u}
  `);
}, Ct = (e) => {
  const t = e.entity?.state === "on", i = ze(w(e.entity, "brightness")), r = i === void 0 ? void 0 : Math.round(i / 2.55);
  return e.actionSurface(`ulm-row ulm-light ${t ? "is-active" : ""}`, c`
    ${y(e, "mdi:lightbulb", t ? "yellow" : "grey")}
    ${v(e, r === void 0 ? p(e.entity) : `${r}%`)}
    ${e.config.show_controls ? c`
      <input class="ulm-slider" type="range" min="0" max="100" .value=${String(r ?? 0)}
        @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => n.stopPropagation()}
        @change=${(n) => e.service("light", "turn_on", { entity_id: e.config.entity, brightness_pct: Number(n.target.value) })}>
    ` : u}
  `);
}, Et = (e) => {
  const t = w(e.entity, "current_temperature") ?? "—", i = w(e.entity, "temperature") ?? "—", r = b(e, "humidity_entity");
  return e.actionSurface("ulm-climate", c`
    <div class="climate-top">
      ${y(e, "mdi:thermostat", P.has(e.entity?.state ?? "") ? "red" : "blue")}
      ${v(e, `${e.entity?.state ?? "unknown"} · ${t}°`)}
      <span class="climate-target">${i}°</span>
    </div>
    ${r ? c`<span class="metric-pill"><ha-icon icon="mdi:water-percent"></ha-icon>${p(r)}</span>` : u}
    ${e.config.show_controls ? c`<div class="ulm-controls">
      ${$("Decrease temperature", "mdi:minus", (n) => {
    n.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: Number(i) - 0.5 });
  })}
      ${$("Increase temperature", "mdi:plus", (n) => {
    n.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: Number(i) + 0.5 });
  })}
    </div>` : u}
  `);
}, Pt = (e) => {
  const t = b(e, "battery_entity"), i = b(e, "eta_entity"), r = b(e, "address_entity"), n = e.config.use_entity_picture ? w(e.entity, "entity_picture") : void 0;
  return e.actionSurface("ulm-row ulm-person", c`
    ${n ? c`<span class="person-picture" style=${`background-image:url("${String(n)}")`}></span>` : y(e, "mdi:account", e.entity?.state === "home" ? "blue" : "green")}
    ${v(e, [p(r || e.entity), i ? `ETA ${p(i)}` : ""].filter(Boolean).join(" · "))}
    ${t ? c`<span class="battery-ring">${p(t)}</span>` : c`<span class="presence-dot ${e.entity?.state === "home" ? "home" : "away"}"></span>`}
  `);
}, xt = (e) => {
  const t = ze(e.entity?.state) ?? 0, i = !!w(e.entity, "is_charging") || String(e.entity?.state).includes("charging"), r = t < 20 ? "red" : t < 50 ? "yellow" : "green";
  return e.actionSurface("ulm-battery", c`
    ${y(e, i ? "mdi:battery-charging" : "mdi:battery", r)}
    ${v(e, i ? "Charging" : "Battery level")}
    <span class="battery-value">${Math.round(t)}<small>%</small></span>
    <span class="battery-track"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>
  `);
}, Tt = (e) => {
  const t = Array.isArray(w(e.entity, "history")) ? w(e.entity, "history").map(Number).filter(Number.isFinite).slice(-12) : [20, 28, 24, 42, 35, 52, 48, 63, 55, 70, 62, 78], i = Math.min(...t), r = Math.max(...t), n = t.map((o, s) => `${s / Math.max(1, t.length - 1) * 100},${36 - (o - i) / Math.max(1, r - i) * 32}`).join(" ");
  return c`<svg class="sparkline" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><polyline points=${n}></polyline></svg>`;
}, Mt = (e) => e.actionSurface("ulm-metric", c`
  <div class="metric-heading">${y(e, e.descriptor.family === "energy" ? "mdi:flash" : "mdi:chart-line", "blue")}${v(e, e.entity?.attributes.unit_of_measurement ? String(e.entity.attributes.unit_of_measurement) : "Current value")}<span class="metric-value">${p(e.entity)}</span></div>
  ${e.config.show_graph !== !1 ? Tt(e) : u}
  ${b(e, "min_entity") || b(e, "max_entity") ? c`<div class="metric-extremes"><span>Min ${p(b(e, "min_entity"))}</span><span>Max ${p(b(e, "max_entity"))}</span></div>` : u}
`), Ut = (e) => {
  const t = (e.config.entities?.length ? e.config.entities : e.config.entity ? [e.config.entity] : []).slice(0, 6);
  return e.actionSurface("ulm-scenes", c`
    ${v(e, `${t.length} scenes`)}
    <div class="scene-grid">${t.map((i) => c`
      <button class="scene-button" @pointerdown=${(r) => r.stopPropagation()} @click=${(r) => {
    r.stopPropagation(), e.service("scene", "turn_on", { entity_id: i });
  }}><ha-icon icon="mdi:palette"></ha-icon><span>${Y({ entity: i }, e.hass.states[i])}</span></button>
    `)}</div>
  `);
}, Ot = (e) => {
  const t = w(e.entity, "entity_picture"), r = (e.config.console_platform || e.config.variant) === "xbox" ? "mdi:microsoft-xbox" : "mdi:sony-playstation";
  return e.actionSurface("ulm-media", c`
    ${t ? c`<span class="media-art" style=${`background-image:url("${String(t)}")`}></span>` : y(e, e.descriptor.upstreamId === "custom_card_playstation" ? r : "mdi:play-circle", "purple")}
    ${v(e, String(w(e.entity, "media_title") ?? p(e.entity)))}
    ${e.config.show_controls !== !1 ? c`<div class="ulm-controls">
      ${$("Previous", "mdi:skip-previous", (n) => {
    n.stopPropagation(), e.service("media_player", "media_previous_track", { entity_id: e.config.entity });
  })}
      ${$("Play or pause", "mdi:play-pause", (n) => {
    n.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: e.config.entity });
  })}
      ${$("Next", "mdi:skip-next", (n) => {
    n.stopPropagation(), e.service("media_player", "media_next_track", { entity_id: e.config.entity });
  })}
    </div>` : u}
  `);
}, zt = (e) => e.actionSurface("ulm-row", c`
  ${y(e, "mdi:window-shutter", e.entity?.state === "open" ? "blue" : "grey")}
  ${v(e, p(e.entity))}
  ${e.config.show_controls !== !1 ? c`<div class="ulm-controls">
    ${$("Open", "mdi:arrow-up", (t) => {
  t.stopPropagation(), e.service("cover", "open_cover", { entity_id: e.config.entity });
})}
    ${$("Stop", "mdi:stop", (t) => {
  t.stopPropagation(), e.service("cover", "stop_cover", { entity_id: e.config.entity });
})}
    ${$("Close", "mdi:arrow-down", (t) => {
  t.stopPropagation(), e.service("cover", "close_cover", { entity_id: e.config.entity });
})}
  </div>` : u}
`), Nt = (e) => e.actionSurface("ulm-vacuum", c`
  ${y(e, "mdi:robot-vacuum", e.entity?.state === "cleaning" ? "blue" : "grey")}
  ${v(e, p(e.entity))}
  <span class="metric-pill"><ha-icon icon="mdi:battery"></ha-icon>${String(w(e.entity, "battery_level") ?? "—")}%</span>
  ${e.config.show_controls !== !1 ? c`<div class="ulm-controls">
    ${$("Start", "mdi:play", (t) => {
  t.stopPropagation(), e.service("vacuum", "start", { entity_id: e.config.entity });
})}
    ${$("Pause", "mdi:pause", (t) => {
  t.stopPropagation(), e.service("vacuum", "pause", { entity_id: e.config.entity });
})}
    ${$("Return home", "mdi:home-map-marker", (t) => {
  t.stopPropagation(), e.service("vacuum", "return_to_base", { entity_id: e.config.entity });
})}
  </div>` : u}
`), Dt = (e) => {
  const t = e.entity?.state.startsWith("armed") || e.entity?.state === "locked";
  return e.actionSurface(`ulm-security ${t ? "is-armed" : ""}`, c`
    ${y(e, t ? "mdi:shield-lock" : "mdi:shield-off", t ? "green" : "red")}
    ${v(e, p(e.entity))}
    ${e.config.show_controls ? c`<span class="security-status">${t ? "Secured" : "Attention"}</span>` : u}
  `);
}, Ht = (e) => e.actionSurface("ulm-navigation", c`
  ${y(e, e.descriptor.upstreamId.includes("back") ? "mdi:arrow-left" : "mdi:arrow-right", "blue")}
  ${v(e, e.config.secondary || e.config.navigation_path || "Navigate")}
  <ha-icon icon="mdi:chevron-right"></ha-icon>
`), Rt = (e, t) => {
  const i = e?.split(".", 1)[0] ?? "homeassistant";
  return i === "script" ? ["script", t === "on" ? "turn_on" : "turn_off"] : i === "fan" ? ["fan", t === "on" ? "turn_on" : "turn_off"] : i === "water_heater" ? ["water_heater", t === "on" ? "turn_on" : "turn_off"] : [i === "input_boolean" ? "input_boolean" : "homeassistant", t === "on" ? "turn_on" : "turn_off"];
}, jt = (e) => {
  const t = P.has(e.entity?.state ?? ""), i = b(e, "graph_entity"), [r, n] = Rt(e.config.entity, t ? "off" : "on");
  return e.actionSurface(`ulm-control-card ulm-row ${t ? "is-active" : ""}`, c`
    ${y(e, e.config.entity?.startsWith("fan.") ? "mdi:fan" : "mdi:power-socket-eu", t ? "yellow" : "grey")}
    ${v(e, i ? `${p(e.entity)} · ${p(i)}` : p(e.entity))}
    ${e.config.show_controls !== !1 ? $(t ? "Turn off" : "Turn on", "mdi:power", (o) => {
    o.stopPropagation(), e.service(r, n, { entity_id: e.config.entity });
  }) : u}
  `);
}, Lt = (e) => {
  const t = b(e, "datetime_entity");
  return e.actionSurface(`ulm-control-card ulm-row ${P.has(e.entity?.state ?? "") ? "is-active" : ""}`, c`
    ${y(e, "mdi:alarm", P.has(e.entity?.state ?? "") ? "yellow" : "grey")}
    ${v(e, p(t || e.entity))}
    ${e.config.show_controls !== !1 ? $(P.has(e.entity?.state ?? "") ? "Disable alarm" : "Enable alarm", "mdi:power", (i) => {
    i.stopPropagation(), e.service("input_boolean", P.has(e.entity?.state ?? "") ? "turn_off" : "turn_on", { entity_id: e.config.entity });
  }) : u}
  `);
}, It = (e) => {
  const t = b(e, "lock_entity"), i = b(e, "battery_entity"), r = t?.state === "locked";
  return e.actionSurface("ulm-row ulm-door", c`
    ${y(e, r ? "mdi:door-closed-lock" : "mdi:door-open", r ? "green" : "red")}
    ${v(e, [p(e.entity), t ? p(t) : "", i ? p(i) : ""].filter(Boolean).join(" · "))}
    ${t && e.config.show_controls !== !1 ? $(r ? "Unlock" : "Lock", r ? "mdi:lock-open" : "mdi:lock", (n) => {
    n.stopPropagation(), e.service("lock", r ? "unlock" : "lock", { entity_id: e.config.lock_entity });
  }) : u}
  `);
}, Bt = (e) => e.actionSurface("ulm-row", c`
  ${y(e, "mdi:information-outline", P.has(e.entity?.state ?? "") ? "blue" : "grey")}
  ${v(e, e.config.secondary || p(e.entity))}
`), Ft = (e) => {
  if (e.descriptor.kind === "chip") {
    const t = e.descriptor.family === "security" ? "red" : e.descriptor.family === "weather" ? "yellow" : e.descriptor.family === "battery" ? "green" : e.descriptor.family === "energy" ? "blue" : "grey";
    return e.actionSurface(`ulm-chip chip-${e.descriptor.family}`, c`${y(e, "mdi:circle-small", t)}<span>${Y(e.config, e.entity)}</span>${e.config.show_state === !1 ? u : c`<b>${p(e.entity)}</b>`}`);
  }
  switch (e.descriptor.family) {
    case "weather":
      return kt(e);
    case "climate":
      return Et(e);
    case "light":
      return Ct(e);
    case "scene":
      return Ut(e);
    case "presence":
      return Pt(e);
    case "battery":
      return xt(e);
    case "energy":
    case "sensor":
      return Mt(e);
    case "media":
      return Ot(e);
    case "cover":
      return zt(e);
    case "vacuum":
      return Nt(e);
    case "security":
      return Dt(e);
    case "navigation":
      return Ht(e);
    case "control":
      return jt(e);
    case "alarm-time":
      return Lt(e);
    case "door":
      return It(e);
    default:
      return Bt(e);
  }
};
var Vt = Object.defineProperty, Ne = (e, t, i, r) => {
  for (var n = void 0, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = s(t, i, n) || n);
  return n && Vt(t, i, n), n;
};
const pe = class pe extends O {
  constructor() {
    super(...arguments), this.holdFired = !1, this.forecastGeneration = 0, this.forecast = [], this.actionSurface = (t, i) => {
      const r = this.descriptor?.kind === "chip", n = c`
      <div class="${t} action-surface" role="button" tabindex="0"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        ${i}
      </div>`;
      return r ? n : c`<ha-card class="minimalist-card">${n}</ha-card>`;
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
    const i = gt(t), r = this.forecastKey(this.config);
    this.config = i, r !== this.forecastKey(i) && this.stopForecastSubscription(), this.requestUpdate(), this.subscribeForecast();
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
    if (!this.config || !this.descriptor) return u;
    if (!this.hass) return c`<ha-card><div class="preview">Mushroom Addition preview</div></ha-card>`;
    if (this.descriptor.kind === "container") return this.renderContainer();
    const t = this.config.entity ? this.hass.states[this.config.entity] : void 0;
    return Ft({
      config: this.config,
      descriptor: this.descriptor,
      hass: this.hass,
      entity: t,
      forecast: this.forecast,
      actionSurface: this.actionSurface,
      service: (i, r, n) => {
        this.hass?.callService(i, r, n);
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
    const i = this.forecastGeneration;
    try {
      const r = await this.hass.connection.subscribeMessage((n) => {
        i !== this.forecastGeneration || t !== this.forecastSubscriptionKey || (this.forecast = n.forecast ?? [], this.requestUpdate());
      }, {
        type: "weather/subscribe_forecast",
        entity_id: this.config.entity,
        forecast_type: "daily"
      });
      i !== this.forecastGeneration || t !== this.forecastSubscriptionKey ? r() : this.unsubscribeForecast = r;
    } catch (r) {
      i === this.forecastGeneration && (this.forecastSubscriptionKey = void 0), console.warn("Mushroom Cards Addition: unable to load weather forecast", r);
    }
  }
  renderContainer() {
    const t = this.config?.chips ?? [];
    return c`<ha-card class="minimalist-card"><div class="chips">
      ${t.map((i) => {
      const r = document.createElement(i.type.replace(/^custom:/, ""));
      return r.hass = this.hass, r.setConfig(i), r;
    })}
      ${t.length === 0 ? c`<div class="preview">Add chips in the visual editor.</div>` : u}
    </div></ha-card>`;
  }
  runAction(t) {
    if (!this.hass || !this.config) return;
    const i = t === "tap_action" ? "tap" : t === "hold_action" ? "hold" : "double_tap";
    _t(this, this.config, i);
  }
};
pe.styles = At;
let F = pe;
Ne([
  Q({ attribute: !1 })
], F.prototype, "hass");
Ne([
  Q({ attribute: !1 })
], F.prototype, "config");
const re = (e, t, i = [], r = []) => {
  const n = [...i, ...r, ...Object.keys(t?.states ?? {})], o = [...new Set(n)].filter((s) => t?.states?.[s] !== void 0);
  for (const s of e.preferredDomains ?? []) {
    const l = o.find((a) => a.startsWith(`${s}.`));
    if (l) return l;
  }
  return o[0];
}, qt = (e) => e.name.replace(/ (Card|Chip)$/, ""), Kt = (e, t, i = [], r = []) => {
  if (e.kind === "container") {
    const a = re(
      { ...e, preferredDomains: ["sensor"] },
      t,
      i,
      r
    ), h = re(
      { ...e, preferredDomains: ["person", "device_tracker"] },
      t,
      i,
      r
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
  const n = re(e, t, i, r), o = ["text", "navigation"].includes(e.family), l = e.upstreamId === "custom_card_playstation" && n?.toLowerCase().includes("xbox") ? "xbox" : e.variants?.[0];
  return {
    type: `custom:${e.tag}`,
    entity: n,
    name: n ? void 0 : qt(e),
    secondary: n ? void 0 : o ? "Example" : "Preview",
    icon: e.kind === "chip" ? "mdi:circle-small" : void 0,
    variant: l,
    show_icon: !0,
    show_state: !0,
    show_controls: ["light", "climate", "media", "cover", "vacuum", "security", "control"].includes(e.family),
    show_forecast: e.family === "weather",
    show_graph: ["battery", "energy", "sensor"].includes(e.family),
    entities: e.variants?.includes("with-sensors") ? r.slice(0, 2) : void 0
  };
}, Wt = "1.1.0";
for (const e of T)
  if (!customElements.get(e.tag)) {
    const t = e;
    class i extends F {
      constructor() {
        super(...arguments), this.descriptor = t;
      }
      static getStubConfig(n, o = [], s = []) {
        return Kt(t, n, o, s);
      }
    }
    customElements.define(e.tag, i);
  }
window.customCards = window.customCards || [];
const Gt = new Set(window.customCards.map((e) => e.type));
for (const e of T)
  Gt.has(e.tag) || window.customCards.push({
    type: e.tag,
    name: `Mushroom Addition: ${e.name}`,
    description: e.description,
    preview: !0,
    documentationURL: "https://github.com/snfx-johaver/mushroom-cards-addition"
  });
console.info(
  `%c MUSHROOM-CARDS-ADDITION %c ${Wt} · ${T.length} components `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;"
);
export {
  T as CATALOG
};
//# sourceMappingURL=mushroom-cards-addition.js.map
