const Ae = globalThis, Fe = Ae.ShadowRoot && (Ae.ShadyCSS === void 0 || Ae.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ue = /* @__PURE__ */ Symbol(), tt = /* @__PURE__ */ new WeakMap();
let Ct = class {
  constructor(t, a, r) {
    if (this._$cssResult$ = !0, r !== Ue) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = a;
  }
  get styleSheet() {
    let t = this.o;
    const a = this.t;
    if (Fe && t === void 0) {
      const r = a !== void 0 && a.length === 1;
      r && (t = tt.get(a)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && tt.set(a, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const oa = (e) => new Ct(typeof e == "string" ? e : e + "", void 0, Ue), zt = (e, ...t) => {
  const a = e.length === 1 ? e[0] : t.reduce((r, o, n) => r + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + e[n + 1], e[0]);
  return new Ct(a, e, Ue);
}, na = (e, t) => {
  if (Fe) e.adoptedStyleSheets = t.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of t) {
    const r = document.createElement("style"), o = Ae.litNonce;
    o !== void 0 && r.setAttribute("nonce", o), r.textContent = a.cssText, e.appendChild(r);
  }
}, at = Fe ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let a = "";
  for (const r of t.cssRules) a += r.cssText;
  return oa(a);
})(e) : e;
const { is: sa, defineProperty: ia, getOwnPropertyDescriptor: la, getOwnPropertyNames: ca, getOwnPropertySymbols: da, getPrototypeOf: ua } = Object, ze = globalThis, rt = ze.trustedTypes, _a = rt ? rt.emptyScript : "", ma = ze.reactiveElementPolyfillSupport, fe = (e, t) => e, Pe = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? _a : null;
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
} }, Be = (e, t) => !sa(e, t), ot = { attribute: !0, type: String, converter: Pe, reflect: !1, useDefault: !1, hasChanged: Be };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), ze.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let ue = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, a = ot) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(t, a), !a.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), o = this.getPropertyDescriptor(t, r, a);
      o !== void 0 && ia(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, a, r) {
    const { get: o, set: n } = la(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? ot;
  }
  static _$Ei() {
    if (this.hasOwnProperty(fe("elementProperties"))) return;
    const t = ua(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(fe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(fe("properties"))) {
      const a = this.properties, r = [...ca(a), ...da(a)];
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
      for (const o of r) a.unshift(at(o));
    } else t !== void 0 && a.push(at(t));
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
    return na(t, this.constructor.elementStyles), t;
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
      const n = (r.converter?.toAttribute !== void 0 ? r.converter : Pe).toAttribute(a, r.type);
      this._$Em = t, n == null ? this.removeAttribute(o) : this.setAttribute(o, n), this._$Em = null;
    }
  }
  _$AK(t, a) {
    const r = this.constructor, o = r._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const n = r.getPropertyOptions(o), i = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : Pe;
      this._$Em = o;
      const l = i.fromAttribute(a, n.type);
      this[o] = l ?? this._$Ej?.get(o) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, a, r, o = !1, n) {
    if (t !== void 0) {
      const i = this.constructor;
      if (o === !1 && (n = this[t]), r ??= i.getPropertyOptions(t), !((r.hasChanged ?? Be)(n, a) || r.useDefault && r.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(i._$Eu(t, r)))) return;
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
ue.elementStyles = [], ue.shadowRootOptions = { mode: "open" }, ue[fe("elementProperties")] = /* @__PURE__ */ new Map(), ue[fe("finalized")] = /* @__PURE__ */ new Map(), ma?.({ ReactiveElement: ue }), (ze.reactiveElementVersions ??= []).push("2.1.2");
const Re = globalThis, nt = (e) => e, Ce = Re.trustedTypes, st = Ce ? Ce.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Et = "$lit$", te = `lit$${Math.random().toFixed(9).slice(2)}$`, Mt = "?" + te, pa = `<${Mt}>`, le = document, ve = () => le.createComment(""), we = (e) => e === null || typeof e != "object" && typeof e != "function", He = Array.isArray, ha = (e) => He(e) || typeof e?.[Symbol.iterator] == "function", Le = `[ 	
\f\r]`, be = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, it = /-->/g, lt = />/g, re = RegExp(`>|${Le}(?:([^\\s"'>=/]+)(${Le}*=${Le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ct = /'/g, dt = /"/g, Dt = /^(?:script|style|textarea|title)$/i, Ot = (e) => (t, ...a) => ({ _$litType$: e, strings: t, values: a }), c = Ot(1), ut = Ot(2), pe = /* @__PURE__ */ Symbol.for("lit-noChange"), h = /* @__PURE__ */ Symbol.for("lit-nothing"), _t = /* @__PURE__ */ new WeakMap(), se = le.createTreeWalker(le, 129);
function Tt(e, t) {
  if (!He(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const ga = (e, t) => {
  const a = e.length - 1, r = [];
  let o, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", i = be;
  for (let l = 0; l < a; l++) {
    const s = e[l];
    let _, g, b = -1, d = 0;
    for (; d < s.length && (i.lastIndex = d, g = i.exec(s), g !== null); ) d = i.lastIndex, i === be ? g[1] === "!--" ? i = it : g[1] !== void 0 ? i = lt : g[2] !== void 0 ? (Dt.test(g[2]) && (o = RegExp("</" + g[2], "g")), i = re) : g[3] !== void 0 && (i = re) : i === re ? g[0] === ">" ? (i = o ?? be, b = -1) : g[1] === void 0 ? b = -2 : (b = i.lastIndex - g[2].length, _ = g[1], i = g[3] === void 0 ? re : g[3] === '"' ? dt : ct) : i === dt || i === ct ? i = re : i === it || i === lt ? i = be : (i = re, o = void 0);
    const u = i === re && e[l + 1].startsWith("/>") ? " " : "";
    n += i === be ? s + pa : b >= 0 ? (r.push(_), s.slice(0, b) + Et + s.slice(b) + te + u) : s + te + (b === -2 ? l : u);
  }
  return [Tt(e, n + (e[a] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class $e {
  constructor({ strings: t, _$litType$: a }, r) {
    let o;
    this.parts = [];
    let n = 0, i = 0;
    const l = t.length - 1, s = this.parts, [_, g] = ga(t, a);
    if (this.el = $e.createElement(_, r), se.currentNode = this.el.content, a === 2 || a === 3) {
      const b = this.el.content.firstChild;
      b.replaceWith(...b.childNodes);
    }
    for (; (o = se.nextNode()) !== null && s.length < l; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const b of o.getAttributeNames()) if (b.endsWith(Et)) {
          const d = g[i++], u = o.getAttribute(b).split(te), f = /([.?@])?(.*)/.exec(d);
          s.push({ type: 1, index: n, name: f[2], strings: u, ctor: f[1] === "." ? ya : f[1] === "?" ? fa : f[1] === "@" ? va : Ee }), o.removeAttribute(b);
        } else b.startsWith(te) && (s.push({ type: 6, index: n }), o.removeAttribute(b));
        if (Dt.test(o.tagName)) {
          const b = o.textContent.split(te), d = b.length - 1;
          if (d > 0) {
            o.textContent = Ce ? Ce.emptyScript : "";
            for (let u = 0; u < d; u++) o.append(b[u], ve()), se.nextNode(), s.push({ type: 2, index: ++n });
            o.append(b[d], ve());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Mt) s.push({ type: 2, index: n });
      else {
        let b = -1;
        for (; (b = o.data.indexOf(te, b + 1)) !== -1; ) s.push({ type: 7, index: n }), b += te.length - 1;
      }
      n++;
    }
  }
  static createElement(t, a) {
    const r = le.createElement("template");
    return r.innerHTML = t, r;
  }
}
function he(e, t, a = e, r) {
  if (t === pe) return t;
  let o = r !== void 0 ? a._$Co?.[r] : a._$Cl;
  const n = we(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== n && (o?._$AO?.(!1), n === void 0 ? o = void 0 : (o = new n(e), o._$AT(e, a, r)), r !== void 0 ? (a._$Co ??= [])[r] = o : a._$Cl = o), o !== void 0 && (t = he(e, o._$AS(e, t.values), o, r)), t;
}
class ba {
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
    const { el: { content: a }, parts: r } = this._$AD, o = (t?.creationScope ?? le).importNode(a, !0);
    se.currentNode = o;
    let n = se.nextNode(), i = 0, l = 0, s = r[0];
    for (; s !== void 0; ) {
      if (i === s.index) {
        let _;
        s.type === 2 ? _ = new xe(n, n.nextSibling, this, t) : s.type === 1 ? _ = new s.ctor(n, s.name, s.strings, this, t) : s.type === 6 && (_ = new wa(n, this, t)), this._$AV.push(_), s = r[++l];
      }
      i !== s?.index && (n = se.nextNode(), i++);
    }
    return se.currentNode = le, o;
  }
  p(t) {
    let a = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, a), a += r.strings.length - 2) : r._$AI(t[a])), a++;
  }
}
class xe {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, a, r, o) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = a, this._$AM = r, this.options = o, this._$Cv = o?.isConnected ?? !0;
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
    t = he(this, t, a), we(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== pe && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ha(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && we(this._$AH) ? this._$AA.nextSibling.data = t : this.T(le.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: a, _$litType$: r } = t, o = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = $e.createElement(Tt(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === o) this._$AH.p(a);
    else {
      const n = new ba(o, this), i = n.u(this.options);
      n.p(a), this.T(i), this._$AH = n;
    }
  }
  _$AC(t) {
    let a = _t.get(t.strings);
    return a === void 0 && _t.set(t.strings, a = new $e(t)), a;
  }
  k(t) {
    He(this._$AH) || (this._$AH = [], this._$AR());
    const a = this._$AH;
    let r, o = 0;
    for (const n of t) o === a.length ? a.push(r = new xe(this.O(ve()), this.O(ve()), this, this.options)) : r = a[o], r._$AI(n), o++;
    o < a.length && (this._$AR(r && r._$AB.nextSibling, o), a.length = o);
  }
  _$AR(t = this._$AA.nextSibling, a) {
    for (this._$AP?.(!1, !0, a); t !== this._$AB; ) {
      const r = nt(t).nextSibling;
      nt(t).remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Ee {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, a, r, o, n) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = a, this._$AM = o, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = h;
  }
  _$AI(t, a = this, r, o) {
    const n = this.strings;
    let i = !1;
    if (n === void 0) t = he(this, t, a, 0), i = !we(t) || t !== this._$AH && t !== pe, i && (this._$AH = t);
    else {
      const l = t;
      let s, _;
      for (t = n[0], s = 0; s < n.length - 1; s++) _ = he(this, l[r + s], a, s), _ === pe && (_ = this._$AH[s]), i ||= !we(_) || _ !== this._$AH[s], _ === h ? t = h : t !== h && (t += (_ ?? "") + n[s + 1]), this._$AH[s] = _;
    }
    i && !o && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ya extends Ee {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class fa extends Ee {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class va extends Ee {
  constructor(t, a, r, o, n) {
    super(t, a, r, o, n), this.type = 5;
  }
  _$AI(t, a = this) {
    if ((t = he(this, t, a, 0) ?? h) === pe) return;
    const r = this._$AH, o = t === h && r !== h || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== h && (r === h || o);
    o && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class wa {
  constructor(t, a, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    he(this, t);
  }
}
const $a = Re.litHtmlPolyfillSupport;
$a?.($e, xe), (Re.litHtmlVersions ??= []).push("3.3.3");
const ka = (e, t, a) => {
  const r = a?.renderBefore ?? t;
  let o = r._$litPart$;
  if (o === void 0) {
    const n = a?.renderBefore ?? null;
    r._$litPart$ = o = new xe(t.insertBefore(ve(), n), n, void 0, a ?? {});
  }
  return o._$AI(e), o;
};
const We = globalThis;
class me extends ue {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ka(a, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return pe;
  }
}
me._$litElement$ = !0, me.finalized = !0, We.litElementHydrateSupport?.({ LitElement: me });
const xa = We.litElementPolyfillSupport;
xa?.({ LitElement: me });
(We.litElementVersions ??= []).push("4.2.2");
const Sa = (e) => (t, a) => {
  a !== void 0 ? a.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Ia = { attribute: !0, type: String, converter: Pe, reflect: !1, hasChanged: Be }, Aa = (e = Ia, t, a) => {
  const { kind: r, metadata: o } = a;
  let n = globalThis.litPropertyMetadata.get(o);
  if (n === void 0 && globalThis.litPropertyMetadata.set(o, n = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(a.name, e), r === "accessor") {
    const { name: i } = a;
    return { set(l) {
      const s = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(i, s, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(i, void 0, e, l), l;
    } };
  }
  if (r === "setter") {
    const { name: i } = a;
    return function(l) {
      const s = this[i];
      t.call(this, l), this.requestUpdate(i, s, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function Me(e) {
  return (t, a) => typeof a == "object" ? Aa(e, t, a) : ((r, o, n) => {
    const i = o.hasOwnProperty(n);
    return o.constructor.createProperty(n, r), i ? Object.getOwnPropertyDescriptor(o, n) : void 0;
  })(e, t, a);
}
function Lt(e) {
  return Me({ ...e, state: !0, attribute: !1 });
}
const Va = [
  "battery",
  "graph",
  "media_player",
  "room",
  "scenes",
  "welcome_scenes"
], Pa = [
  "trash",
  "alarm_time",
  "bar_card",
  "camera",
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
  "pollen_forecast",
  "playstation",
  "scenes",
  "vehicle_status",
  "plant",
  "speedtest_gauges",
  "better_thermostat",
  "pollen"
], mt = (e) => e.split("_").filter((t) => t.toLowerCase() !== "ulm").map((t) => ["nas", "mdi", "dwd", "vnc", "wifi", "http"].includes(t.toLowerCase()) ? t.toUpperCase() : `${t[0].toUpperCase()}${t.slice(1)}`).join(" "), Ca = (e) => e === "custom_card_bar_card" ? "bar" : e === "custom_card_alarm_time" ? "alarm-time" : /alarm|alert|lock/.test(e) ? "security" : /navigate|back/.test(e) ? "navigation" : /battery/.test(e) ? "battery" : /power_outlet|more_power_outlet/.test(e) ? "control" : /energy|power|gauge|speedtest|graph|apex|bar_card|myenedis/.test(e) ? "energy" : /weather|sun|pollen|moon/.test(e) ? "weather" : /scene/.test(e) ? "scene" : /person|tracker|tracer|presence|room|welcome/.test(e) ? "presence" : /media|playstation/.test(e) ? "media" : /thermostat|heat_pump|aircondition|temperature|simple_temp/.test(e) ? "climate" : /cover|door|garage/.test(e) ? "cover" : /vacuum/.test(e) ? "vacuum" : /light/.test(e) ? "light" : /fan|outlet|boolean|script|washer|water_heater|qubino/.test(e) ? "control" : /input_number|input_datetime/.test(e) ? "sensor" : /title|subtitle|clock|date/.test(e) ? "text" : /camera/.test(e) ? "camera" : /sensor|elapsed|update|printer|nas|tablet|flower|car|afval|waste|counter/.test(e) ? "sensor" : "entity", za = {
  card_media_player: ["default", "controls", "artwork"],
  card_room: ["default", "with-sensors"],
  card_scenes: ["list", "welcome"],
  custom_card_better_thermostat: ["normal", "compact"]
}, Ea = (e, t) => e === "custom_card_alarm_time" ? ["input_boolean"] : /alarm/.test(e) ? ["alarm_control_panel"] : /lock/.test(e) ? ["lock"] : /power_outlet|more_power_outlet/.test(e) ? ["switch", "light"] : e.includes("binary_sensor") ? ["binary_sensor"] : e.includes("battery") ? ["sensor"] : e.includes("input_boolean") ? ["input_boolean"] : e.includes("input_number") ? ["input_number", "counter", "select", "input_select"] : e.includes("input_datetime") ? ["input_datetime"] : e.includes("light") ? ["light"] : /media|playstation/.test(e) ? ["media_player", "sensor"] : /thermostat|heat_pump|aircondition/.test(e) ? ["climate"] : /scene/.test(e) ? ["scene"] : /script/.test(e) ? ["script"] : /vacuum/.test(e) ? ["vacuum"] : /weather/.test(e) ? ["weather"] : /person/.test(e) ? ["person", "device_tracker"] : /cover|door|garage/.test(e) ? ["cover", "binary_sensor"] : /fan/.test(e) ? ["fan"] : /camera/.test(e) ? ["camera"] : /lock/.test(e) ? ["lock"] : /update/.test(e) ? ["update"] : t === "battery" || t === "energy" || t === "sensor" || t === "weather" ? ["sensor"] : t === "control" ? /fan/.test(e) ? ["fan"] : /script/.test(e) ? ["script"] : /washer/.test(e) ? ["switch", "sensor"] : /water_heater/.test(e) ? ["water_heater"] : ["switch", "input_boolean", "light"] : t === "presence" ? ["person", "device_tracker"] : ["sensor", "switch"], pt = (e, t) => {
  const a = e.replace(/^custom_(card|chip)_/, "").replace(/^(card|chip)_/, ""), r = e.replaceAll("_", "-").toLowerCase(), o = r.startsWith("custom-card-") ? `mushroom-addition-${r}` : `mushroom-addition-card-${r.replace(/^card-/, "")}`, n = Ca(e), i = e === "custom_card_playstation", l = {
    custom_card_trash: "Trash",
    custom_card_entity_overview: "Entity Overview",
    custom_card_internet_speed: "Internet Speed",
    custom_card_weather_metrics: "Weather Metrics",
    custom_card_gauge: "Gauge",
    custom_card_printer: "Printer",
    custom_card_nas_metrics: "NAS",
    custom_card_tablet: "Tablet",
    custom_card_plant: "Flower",
    custom_card_pollen: "Pollen",
    custom_card_better_thermostat: "Better Thermostat"
  }, s = {
    custom_card_trash: "Mushroom-style trash collection schedule card.",
    custom_card_entity_overview: "Mushroom-style multi-entity status card.",
    custom_card_internet_speed: "Mushroom-style internet speed and router status card.",
    custom_card_weather_metrics: "Mushroom-style weather metrics card.",
    custom_card_gauge: "Mushroom-style sensor gauge card.",
    custom_card_printer: "Mushroom-style printer status and toner level card.",
    custom_card_tablet: "Mushroom-style tablet status and maintenance card.",
    custom_card_plant: "Mushroom-style plant health card.",
    custom_card_pollen: "Mushroom-style pollen level card.",
    custom_card_better_thermostat: "Touch-friendly climate card with Better Thermostat status and controls."
  };
  return {
    upstreamId: e,
    sourcePath: t,
    kind: "card",
    category: e.startsWith("custom_") ? "custom-card" : "default-card",
    family: n,
    tag: o,
    name: i ? "PS4 Card" : e === "custom_card_nas_metrics" ? "NAS Card" : `${l[e] ?? mt(a)} Card`,
    description: i ? "Source-faithful media artwork card for a PlayStation entity." : e === "custom_card_nas_metrics" ? "Mushroom-style NAS status and utilization card." : s[e] ?? `Mushroom-style ${mt(a).toLowerCase()} card.`,
    variants: za[e],
    variantLabels: void 0,
    preferredDomains: Ea(e, n)
  };
}, Nt = [
  ...Va.map((e) => {
    const t = {
      graph: "reference_catalog/cards/card_graph.yaml",
      scenes: "reference_catalog/cards/card_scenes_welcome.yaml"
    };
    return pt(
      `card_${e}`,
      t[e] ?? `reference_catalog/cards/card_${e}.yaml`
    );
  }),
  ...Pa.map((e) => pt(
    `custom_card_${e}`,
    e === "better_thermostat" ? "https://github.com/KartoffelToby/better-thermostat-ui-card" : `custom_cards/custom_card_${e}`
  ))
], jt = [
  {
    canonical: "card_scenes",
    sources: { card_scenes: "welcome-pills", custom_card_scenes: "scene-grid" },
    variants: ["welcome-pills", "scene-grid"],
    variantLabels: { "welcome-pills": "Welcome scene pills", "scene-grid": "Scene button grid" },
    name: "Scenes Card"
  }
], ge = /* @__PURE__ */ new Map();
for (const e of jt)
  for (const t of Object.keys(e.sources)) ge.set(t, e);
const Ft = new Set(jt.map((e) => e.canonical)), De = Nt.filter((e) => !ge.has(e.upstreamId) || Ft.has(e.upstreamId)).map((e) => {
  const t = ge.get(e.upstreamId);
  return t ? {
    ...e,
    name: t.name ?? e.name,
    description: t.description ?? e.description,
    variants: t.variants,
    variantLabels: t.variantLabels,
    sourceIds: Object.keys(t.sources)
  } : { ...e, sourceIds: [e.upstreamId] };
}), qe = Nt.filter((e) => ge.has(e.upstreamId) && !Ft.has(e.upstreamId)).map((e) => {
  const t = ge.get(e.upstreamId), a = De.find((r) => r.upstreamId === t.canonical);
  return {
    upstreamId: e.upstreamId,
    tag: e.tag,
    targetId: a.upstreamId,
    targetTag: a.tag,
    variant: t.sources[e.upstreamId]
  };
}), Oe = De, Ma = (e) => Oe.find((t) => t.tag === e) ?? (() => {
  const t = qe.find((a) => a.tag === e);
  return t ? De.find((a) => a.tag === t.targetTag) : void 0;
})(), ht = (e) => ge.get(e)?.sources[e], je = [
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
], Ut = (e, t, a = e.enabledByDefault) => ({
  preset: e.preset,
  enabled: a,
  entity: t,
  label: e.label,
  icon: e.icon,
  color: e.color
}), Da = () => je.map((e) => Ut(e)), ne = (e) => {
  if (e.waste_streams?.length) return e.waste_streams.map((r) => ({ ...r }));
  const t = e.type.includes("custom-card-trash"), a = je.some((r) => r.legacyKey && typeof e[r.legacyKey] == "string");
  return !t && !a ? [] : je.map((r, o) => {
    const i = (r.legacyKey && typeof e[r.legacyKey] == "string" ? e[r.legacyKey] : void 0) ?? (o === 0 ? e.entity : void 0);
    return Ut(r, i, i ? !0 : r.enabledByDefault);
  });
}, Oa = (e) => {
  const t = e.type.includes("custom-card-trash"), a = e.today_entity ?? (typeof e.ulm_card_ophaling_vandaag == "string" ? e.ulm_card_ophaling_vandaag : void 0), r = e.tomorrow_entity ?? (typeof e.ulm_card_ophaling_morgen == "string" ? e.ulm_card_ophaling_morgen : void 0);
  if (!t && !a && !r) return e;
  const o = e.waste_streams?.length ? e.waste_streams : ne(e);
  return {
    ...e,
    waste_streams: o.length ? o : e.waste_streams,
    today_entity: a,
    tomorrow_entity: r,
    show_today: e.show_today ?? !!a,
    show_tomorrow: e.show_tomorrow ?? !!r
  };
}, Z = /* @__PURE__ */ new Set([
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
]), w = (e) => {
  if (!e) return "Entity unavailable";
  const t = e.attributes.unit_of_measurement;
  return t ? `${e.state} ${String(t)}` : e.state.replaceAll("_", " ");
}, gt = (e) => {
  if (typeof e == "string") return e;
  const t = Array.isArray(e) ? e : [e];
  return t.every((a) => a.type === "text") ? t.map((a) => a.text ?? "").join(" ") : void 0;
}, H = (e, t, a) => {
  const r = e.name !== void 0 && typeof e.name != "string";
  return r && t && a?.formatEntityName ? a.formatEntityName(t, e.name) : r ? gt(e.name) || t?.attributes.friendly_name || e.entity || "" : e.name_mode === "none" ? "" : e.name_mode === "entity" ? t?.attributes.friendly_name || e.entity || "" : e.name && t && a?.formatEntityName ? a.formatEntityName(t, e.name) : (e.name ? gt(e.name) : void 0) || t?.attributes.friendly_name || e.entity || "";
}, ie = (e, t, a) => {
  e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    composed: !0,
    detail: a
  }));
}, Ta = (e, t, a) => {
  ie(e, "hass-action", { config: t, action: a });
}, La = (e) => {
  const t = Fa(e), a = Na(t), r = String(t.type), o = r.includes("card-title"), n = r.includes("card-welcome-scenes"), i = r.includes("card-weather"), l = r.includes("custom-card-camera"), s = r.includes("card-weather-ulm") || t.variant === "native", _ = r.includes("custom-card-sun") || r.includes("custom-card-thermostat-controls") ? { action: "none" } : void 0, g = String(a.type).includes("custom-card-qubino") ? a.qubino_more_info_entity ?? a.entity : void 0, b = r.endsWith("custom-card-pollen"), d = [
    a.download_entity,
    a.upload_entity,
    a.ping_entity
  ].filter((k) => typeof k == "string"), u = String(a.type).includes("speedtest-gauges"), f = a.variant === "divider-title", $ = a.variant === "divider-subtitle", D = u ? {
    action: "perform-action",
    perform_action: "homeassistant.update_entity",
    target: { entity_id: d }
  } : $ || f && !a.navigation_path ? { action: "none" } : b ? { action: "none" } : g ? { action: "more-info", entity: g } : a.navigation_path ? { action: "navigate", navigation_path: a.navigation_path } : _ ?? { action: o || n ? "none" : a.entity ? "more-info" : "none" }, L = String(e.type).includes("card-room") && a.input_select_entity && a.input_select_option ? {
    action: "perform-action",
    perform_action: "input_select.select_option",
    target: { entity_id: a.input_select_entity },
    data: { option: a.input_select_option }
  } : void 0;
  return {
    ...a,
    show_icon: a.show_icon ?? !0,
    show_state: a.show_state ?? (l ? a.ulm_custom_card_camera_title !== !1 : !0),
    show_name: a.show_name ?? (l ? a.ulm_custom_card_camera_title !== !1 : void 0),
    camera_view: a.camera_view ?? (l ? "auto" : void 0),
    fit_mode: a.fit_mode ?? (l ? "cover" : void 0),
    aspect_ratio: a.aspect_ratio ?? (l && typeof a.ulm_custom_card_camera_aspect_ratio == "string" ? a.ulm_custom_card_camera_aspect_ratio : void 0),
    name_mode: a.primary_info !== void 0 || a.secondary_info !== void 0 ? void 0 : a.name_mode,
    icon_type: a.icon_type ?? (t.use_entity_picture ? "entity-picture" : t.show_icon === !1 ? "none" : "icon"),
    layout: a.layout ?? "default",
    fill_container: a.fill_container ?? !1,
    primary_info: a.primary_info ?? (l && a.show_name === !1 ? "none" : void 0),
    secondary_info: a.secondary_info ?? (l && a.show_state === !1 ? "none" : void 0),
    tap_action: a.tap_action ?? D,
    show_controls: a.show_controls ?? (r.includes("card-vacuum") ? !0 : void 0),
    show_forecast: a.show_forecast ?? (i ? !s : void 0),
    hold_action: a.hold_action ?? (String(a.type).includes("water-heater") && a.entity ? { action: "more-info" } : void 0),
    double_tap_action: a.double_tap_action ?? L
  };
}, de = (e, t) => Object.entries(e).find(([a, r]) => t.test(a) && r !== void 0)?.[1], Na = (e) => {
  const t = de(e, /_name$/), a = de(e, /_icon$/), r = de(e, /_color$/), o = de(e, /_enable_(controls|buttons)$/), n = de(e, /_enable_slider$/), i = de(e, /_enable_horizontal$/);
  return {
    ...e,
    name: e.name ?? (typeof t == "string" ? t : void 0),
    icon: e.icon ?? (typeof a == "string" ? a : void 0),
    icon_color: e.icon_color ?? (typeof r == "string" ? r : void 0),
    navigation_path: e.navigation_path,
    show_controls: e.show_controls ?? (typeof o == "boolean" ? o : typeof n == "boolean" ? n : void 0),
    layout: e.layout ?? (i === !0 ? "horizontal" : void 0)
  };
}, ja = [
  "ulm_card_media_player_entity",
  "ulm_card_graph_entity",
  "ulm_card_input_number_entity",
  "ulm_custom_card_entity_overview",
  "ulm_custom_card_weather_metrics"
], Fa = (e) => {
  const t = Oa(e), a = t.primary_entity || ja.map((n) => t[n]).find((n) => typeof n == "string"), r = (n) => {
    if (typeof n == "string") return n;
    if (n && typeof n == "object" && "entity_id" in n && typeof n.entity_id == "string")
      return n.entity_id;
  }, o = {
    ...t,
    entity: t.entity ?? a,
    primary_entity: void 0
  };
  if (String(e.type).includes("card-power-outlet") && (o.consumption_entity ??= r(e.ulm_card_power_outlet_consumption_sensor)), String(e.type).includes("card-room") && (o.input_select_entity ??= r(e.ulm_input_select), o.input_select_option ??= typeof e.ulm_input_select_option == "string" ? e.ulm_input_select_option : void 0), String(e.type).includes("nas-metrics") && (o.temperature_entity ??= r(e.entity_1), o.memory_entity ??= r(e.entity_2), o.cpu_entity ??= r(e.entity_3), o.disk_entity ??= r(e.entity_4)), String(e.type).includes("tablet") && (o.entity ??= r(e.ulm_custom_card_tablet_main), o.battery_entity ??= r(e.ulm_custom_card_tablet_battery), o.tablet_button_usb_entity ??= r(e.ulm_custom_card_tablet_button1), o.tablet_button_motion_entity ??= r(e.ulm_custom_card_tablet_button2), o.tablet_button_display_entity ??= r(e.ulm_custom_card_tablet_button3), o.tablet_restart_entity ??= r(e.ulm_custom_card_tablet_restart), o.tablet_reload_entity ??= r(e.ulm_custom_card_tablet_reload), o.tablet_maintenance_entity ??= r(e.ulm_custom_card_tablet_maintenance), o.tablet_ram_entity ??= r(e.ulm_custom_card_tablet_par1), o.tablet_disk_entity ??= r(e.ulm_custom_card_tablet_par2), o.tablet_power_entity ??= r(e.ulm_custom_card_tablet_par3)), String(e.type).includes("card-welcome-scenes") && (o.collapse_entity ??= r(e.ulm_card_welcome_scenes_collapse), !o.scene_items)) {
    const n = Array.from({ length: 7 }, (i, l) => {
      const s = e[`entity_${l + 1}`];
      if (!s || typeof s != "object") return;
      const _ = s, g = r(_);
      if (g)
        return {
          entity: g,
          name: typeof _.name == "string" ? _.name : void 0,
          icon: typeof _.icon == "string" ? _.icon : void 0,
          color: typeof _.color == "string" ? _.color : void 0,
          state: typeof _.state == "string" ? _.state : void 0,
          navigation_path: typeof _.navigation_path == "string" ? _.navigation_path : typeof _.nav_path == "string" ? _.nav_path : void 0,
          service_data: _.service_data && typeof _.service_data == "object" ? _.service_data : void 0
        };
    }).filter((i) => i !== void 0);
    n.length && (o.scene_items = n);
  }
  if (String(e.type).includes("entity-overview") && (o.entity ??= r(e.ulm_custom_card_entity_overview), o.entities ??= [1, 2, 3, 4].map((n) => r(e[`ulm_custom_card_entity_overview_entity_${n}`])).filter((n) => n !== void 0)), String(e.type).includes("internet-speed") && (o.download_entity ??= r(e.ulm_custom_card_internet_speed_download_speed_entity), o.upload_entity ??= r(e.ulm_custom_card_internet_speed_upload_speed_entity), o.ping_entity ??= r(e.ulm_custom_card_internet_speed_ping_entity), o.entity ??= o.download_entity), String(e.type).includes("weather-metrics") && (o.entity ??= r(e.ulm_custom_card_weather_metrics), o.temperature_entity ??= r(e.ulm_custom_card_weather_metrics_temperature_outside), o.date_entity ??= r(e.ulm_custom_card_weather_metrics_date), o.entities ??= [1, 2, 3, 4].map((n) => r(e[`ulm_custom_card_weather_metrics_entity_${n}`])).filter((n) => n !== void 0)), String(e.type).includes("custom-card-washer") && (o.entity ??= r(e.ulm_custom_card_washer_machine_state) ?? r(e.ulm_custom_card_washer_power), o.power_entity ??= r(e.ulm_custom_card_washer_power), o.ulm_custom_card_washer_machine_state ??= o.entity), String(e.type).includes("custom-card-thermostat-controls") && (o.entity ??= r(e.entity), o.variant ??= "buttons"), String(e.type).includes("media-player-sonos") && (o.entity ??= r(e.ulm_card_media_player_with_controls_entity)), String(e.type).includes("more-power-outlet") && (o.power_entity ??= r(
    e.custom_card_more_power_outlet_power_sensor ?? e.ulm_card_more_power_outlet_power_sensor ?? e.graph_entity
  ), o.energy_entity ??= r(
    e.custom_card_more_power_outlet_energy_sensor ?? e.ulm_card_more_power_outlet_energy_sensor
  ), o.time_entity ??= r(
    e.custom_card_more_power_outlet_time_sensor ?? e.ulm_card_more_power_outlet_time_sensor
  )), String(e.type).includes("gauge") && (o.minimum ??= Number(e.ulm_card_gauge_min ?? 0), o.maximum ??= Number(e.ulm_card_gauge_max ?? 100)), String(e.type).includes("printer") && (o.black_entity ??= r(e.ulm_card_printer_black_name), o.yellow_entity ??= r(e.ulm_card_printer_yellow_name), o.magenta_entity ??= r(e.ulm_card_printer_magenta_name), o.cyan_entity ??= r(e.ulm_card_printer_cyan_name)), String(e.type).endsWith("custom-card-pollen") && (o.trees_entity ??= r(e.custom_card_pollen_tree), o.grass_entity ??= r(e.custom_card_pollen_grass), o.weeds_entity ??= r(e.custom_card_pollen_weed)), String(e.type).includes("speedtest-gauges") && (o.download_entity ??= r(e.ulm_custom_card_speedtest_download_speed_entity) ?? o.entity, o.upload_entity ??= r(e.ulm_custom_card_speedtest_upload_speed_entity), o.ping_entity ??= r(e.ulm_custom_card_speedtest_ping_entity), o.entity = r(o.download_entity)), String(e.type).includes("custom-card-pollen-forecast") && (o.level_entity ??= r(e.level_entity), o.name ??= typeof e.ulm_custom_card_pollen_forecast_name == "string" ? e.ulm_custom_card_pollen_forecast_name : void 0, o.icon ??= typeof e.ulm_custom_card_pollen_forecast_icon == "string" ? e.ulm_custom_card_pollen_forecast_icon : void 0), String(e.type).includes("custom-card-scenes") || String(e.type).includes("card-scenes") && e.variant === "scene-grid") {
    const n = Array.from({ length: 5 }, (i, l) => {
      const s = e[`entity_${l + 1}`];
      if (typeof s == "string") return { entity: s };
      if (!s || typeof s != "object" || !("entity_id" in s) || typeof s.entity_id != "string")
        return;
      const _ = s;
      return {
        entity: _.entity_id,
        icon: typeof _.icon == "string" ? _.icon : void 0,
        color: typeof _.icon_color == "string" ? _.icon_color : void 0,
        name: typeof _.name == "string" ? _.name : void 0
      };
    }).filter((i) => !!i);
    !o.scene_items?.length && n.length && (o.scene_items = n);
  }
  return String(e.type).includes("vehicle-status") && (o.entity ??= r(e.ulm_card_vehicle_status_tracker), o.ulm_card_vehicle_status_tracker ??= o.entity, o.ulm_card_vehicle_status_energy_level ??= r(e.energy_entity) ?? r(e.battery_entity), o.ulm_card_vehicle_status_range ??= r(e.range_entity), o.ulm_card_vehicle_status_lock ??= r(e.lock_entity) ?? r(e.doors_entity)), String(e.type).includes("plant") && (o.entity ??= r(e.ulm_card_flower_entity), o.ulm_card_flower_entity ??= o.entity), o;
}, Bt = [
  { configKey: "crossfade_entity", domain: "switch", suffix: "crossfade", label: "Crossfade", icon: "mdi:swap-horizontal" },
  { configKey: "night_sound_entity", domain: "switch", suffix: "night_sound", label: "Night sound", icon: "mdi:weather-night" },
  { configKey: "speech_enhancement_entity", domain: "switch", suffix: "speech_enhancement", label: "Speech enhancement", icon: "mdi:ear-hearing" },
  { configKey: "subwoofer_entity", domain: "switch", suffix: "subwoofer_enabled", label: "Subwoofer", icon: "mdi:speaker-wireless" },
  { configKey: "surrounds_entity", domain: "switch", suffix: "surround_enabled", label: "Surrounds", icon: "mdi:surround-sound" },
  { configKey: "loudness_entity", domain: "switch", suffix: "loudness", label: "Loudness", icon: "mdi:bullhorn" },
  { configKey: "surround_full_entity", domain: "switch", suffix: "surround_music_full_volume", label: "Surround full", icon: "mdi:music-note-plus" }
], Rt = [
  { configKey: "audio_delay_entity", domain: "number", suffix: "audio_delay", label: "Audio delay", icon: "mdi:tune-variant" },
  { configKey: "balance_entity", domain: "number", suffix: "balance", label: "Balance", icon: "mdi:tune-variant" },
  { configKey: "bass_entity", domain: "number", suffix: "bass", label: "Bass", icon: "mdi:tune-variant" },
  { configKey: "treble_entity", domain: "number", suffix: "treble", label: "Treble", icon: "mdi:tune-variant" },
  { configKey: "sub_gain_entity", domain: "number", suffix: "sub_gain", label: "Sub gain", icon: "mdi:tune-variant" },
  { configKey: "surround_level_entity", domain: "number", suffix: "surround_level", label: "Surround level", icon: "mdi:tune-variant" },
  { configKey: "music_surround_level_entity", domain: "number", suffix: "music_surround_level", label: "Surround level music", icon: "mdi:tune-variant" }
], Ge = [...Bt, ...Rt], Ke = (e) => e.split(".", 2)[1] ?? e, bt = (e) => Ke(e).replace(/_\d+$/, ""), Ht = (e, t) => {
  if (!e.startsWith(`${t.domain}.`)) return !1;
  const a = Ke(e);
  return t.suffix === "surround_level" && a.endsWith("_music_surround_level") ? !1 : a === t.suffix || a.endsWith(`_${t.suffix}`);
}, yt = (e) => Ge.filter((t) => e.some((a) => Ht(a, t))).length, Je = (e, t, a) => {
  if (!e || !t) return {};
  const r = Object.keys(e.states), o = e.entities ?? {}, n = bt(t), i = [.../* @__PURE__ */ new Set([t, ...r.filter((d) => d.startsWith("media_player.") && bt(d) === n)])], _ = [...new Set(i.map((d) => o[d]?.device_id).filter((d) => typeof d == "string" && d.length > 0))].map((d) => r.filter((u) => o[u]?.device_id === d)).sort((d, u) => yt(u) - yt(d))[0] ?? [], g = r.filter((d) => {
    const u = d.split(".", 1)[0], f = Ke(d);
    return ["switch", "number"].includes(u) && (f === n || f.startsWith(`${n}_`));
  }), b = [.../* @__PURE__ */ new Set([..._, ...g])];
  return Object.fromEntries(Ge.flatMap((d) => {
    const u = a?.[d.configKey];
    if (typeof u == "string" && u.length > 0) return [[d.configKey, u]];
    const f = b.find(($) => Ht($, d));
    return f ? [[d.configKey, f]] : [];
  }));
}, ft = (e, t) => Object.keys(Je(e, t)).length, vt = {
  en: {
    entity: "Entity",
    name: "Name",
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
    show_temperature_control: "Show temperature control",
    show_humidity: "Show humidity",
    show_hvac_modes: "Show HVAC modes",
    show_presets: "Show presets",
    show_status: "Show status badges",
    collapsible_controls: "Collapse controls while off",
    thermostat_temp_step: "Temperature adjustment step",
    low_battery_threshold: "Low battery warning threshold",
    use_entity_picture: "Use entity picture",
    graph_hours: "Graph hours",
    console_platform: "Console platform",
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
    camera_view: "Camera view",
    fit_mode: "Image fit",
    aspect_ratio: "Aspect ratio",
    image_height: "Custom image height",
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
    ulm_custom_card_pollen_forecast_name: "Pollen name",
    ulm_custom_card_pollen_forecast_icon: "Pollen icon",
    ulm_custom_card_pollen_forecast_1: "Pollen level 1 label",
    ulm_custom_card_pollen_forecast_2: "Pollen level 2 label",
    ulm_custom_card_pollen_forecast_3: "Pollen level 3 label",
    ulm_custom_card_pollen_forecast_4: "Pollen level 4 label",
    ulm_custom_card_pollen_forecast_5: "Pollen level 5 label",
    ulm_custom_card_pollen_forecast_6: "Pollen level 6 label",
    ulm_custom_card_pollen_forecast_none: "No pollen label",
    pollen_language: "Pollen label language",
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
    ulm_card_vehicle_status_tracker: "Vehicle tracker",
    ulm_card_vehicle_status_lock: "Vehicle lock",
    ulm_card_vehicle_status_energy_level: "Vehicle energy sensor",
    ulm_card_vehicle_status_range: "Vehicle range sensor",
    ulm_card_vehicle_status_name: "Vehicle name",
    ulm_card_flower_entity: "Plant entity",
    ulm_card_flower_name: "Plant name",
    ulm_card_flower_species: "Plant species",
    ulm_card_flower_show_bars: "Plant attribute bars",
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
}, Ua = (e, t) => {
  const a = e?.language?.split("-")[0] ?? "en";
  return vt[a]?.[t] ?? vt.en[t] ?? t.replace(/^ulm_(?:custom_)?card_/, "").replace(/^(?:custom_)?card_/, "").replace(/^ulm_/, "").replaceAll("_", " ").replace(/\b\w/g, (r) => r.toUpperCase());
}, Ba = {
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
  weather_entity: "Weather entity used by the source-specific welcome or date presentation.",
  settings_path: "Dashboard path opened by the welcome settings button.",
  collapse_entity: "Input boolean that hides or shows the welcome scene pills.",
  collapsed: "Forces the welcome scene pills to stay hidden.",
  show_controls: "Shows the controls defined by the pinned source design.",
  show_temperature_control: "Shows the target temperature slider and adjustment buttons.",
  show_humidity: "Shows humidity from the climate entity or the selected humidity sensor.",
  show_hvac_modes: "Shows buttons for HVAC modes supported by the climate entity.",
  show_presets: "Shows preset buttons such as Home, Away, Eco, and Boost.",
  show_status: "Shows heating, cooling, window, battery, degraded, and connection status badges.",
  collapsible_controls: "Hides extended controls while the thermostat is off.",
  thermostat_temp_step: "Amount added or removed by each temperature adjustment.",
  low_battery_threshold: "Battery levels at or below this percentage show a warning badge.",
  show_forecast: "Loads the daily weather forecast used by the detailed source design.",
  show_name: "Shows the camera entity name over the image.",
  show_state: "Shows the current camera state over the image.",
  camera_view: "Automatic uses a still image. Live stream uses Home Assistant's camera stream when available.",
  fit_mode: "Choose whether the image is cropped, contained, or stretched inside the card.",
  aspect_ratio: "Enter any ratio, such as 16:9, 4:3, 1:1, or 21:9.",
  image_height: "Optional fixed height in pixels. When set, it overrides the aspect ratio.",
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
  ulm_custom_card_pollen_forecast_name: "Name displayed for the pollen source.",
  ulm_custom_card_pollen_forecast_icon: "Icon displayed in the pollen severity bubble.",
  ulm_custom_card_pollen_forecast_1: "Override for the source level 1 pollen label.",
  ulm_custom_card_pollen_forecast_2: "Override for the source level 2 pollen label.",
  ulm_custom_card_pollen_forecast_3: "Override for the source level 3 pollen label.",
  ulm_custom_card_pollen_forecast_4: "Override for the source level 4 pollen label.",
  ulm_custom_card_pollen_forecast_5: "Override for the source level 5 pollen label.",
  ulm_custom_card_pollen_forecast_6: "Override for the source level 6 pollen label.",
  ulm_custom_card_pollen_forecast_none: "Override for the source level 0 pollen label.",
  pollen_language: "Language used for the source pollen severity labels.",
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
  ulm_custom_card_camera_title: "Legacy setting that shows or hides the camera name and state.",
  ulm_custom_card_camera_name: "Legacy camera name. Use Custom name for new cards.",
  ulm_custom_card_camera_label: "Legacy camera state label. Use Show state for new cards.",
  ulm_custom_card_camera_aspect_ratio: "Legacy image ratio. Use Aspect ratio for new cards.",
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
  ulm_card_vehicle_status_tracker: "Entity shown in the car summary and opened by its details action.",
  ulm_card_vehicle_status_lock: "Lock or read-only door entity used by the lock status badge.",
  ulm_card_vehicle_status_energy_level: "Numeric sensor shown in the source energy metric.",
  ulm_card_vehicle_status_range: "Numeric sensor shown in the source range metric.",
  ulm_card_vehicle_status_name: "Name displayed in the car summary.",
  ulm_card_flower_entity: "Plant entity supplying status and flower-card attribute values.",
  ulm_card_flower_name: "Name displayed in the plant summary.",
  ulm_card_flower_species: "Species identifier retained for source-compatible configuration.",
  ulm_card_flower_show_bars: "Ordered list of plant attributes rendered as source bars.",
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
  console_platform: "Selects the console branding and default icon.",
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
}, Ra = (e) => Ba[e], Ha = [
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
    upstreamId: "custom_card_pollen_forecast",
    sourcePath: "custom_cards/custom_card_pollen_forecast",
    publicId: "custom_card_pollen_forecast",
    rendererId: "custom_card_pollen_forecast",
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
        defaultValue: '"[[[ return variables.ulm_custom_card_pollen_forecast_icon; ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_card_generic_swap_name",
        defaultValue: '"[[[ return variables.ulm_custom_card_pollen_forecast_name; ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_pollen_forecast_1",
        defaultValue: '"bardzo słabe"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_pollen_forecast_2",
        defaultValue: '"słabe"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_pollen_forecast_3",
        defaultValue: '"umiarkowane"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_pollen_forecast_4",
        defaultValue: '"średnie"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_pollen_forecast_5",
        defaultValue: '"wysokie"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_pollen_forecast_6",
        defaultValue: '"bardzo wysokie"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_pollen_forecast_icon",
        defaultValue: "<documented/inherited>",
        selector: "icon"
      },
      {
        name: "ulm_custom_card_pollen_forecast_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_pollen_forecast_name",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_pollen_forecast_none",
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
    upstreamId: "custom_card_vehicle_status",
    sourcePath: "custom_cards/custom_card_vehicle_status",
    publicId: "custom_card_vehicle_status",
    rendererId: "custom_card_vehicle_status",
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
        name: "ulm_card_vehicle_status_energy_level",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_vehicle_status_lock",
        defaultValue: '"[[[ return variables.ulm_card_vehicle_status_lock ]]]"',
        selector: "entity"
      },
      {
        name: "ulm_card_vehicle_status_name",
        defaultValue: '"[[[ return variables.ulm_card_vehicle_status_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_card_vehicle_status_range",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_card_vehicle_status_tracker",
        defaultValue: '"[[[ return variables.ulm_card_vehicle_status_tracker ]]]"',
        selector: "entity"
      },
      {
        name: "ulm_custom_card_vehicle_status_popup",
        defaultValue: "<documented/inherited>",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_vehicle_status_default_name",
        defaultValue: '"O meu carro"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_vehicle_status_energy_level",
        defaultValue: '"Nível de energia"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_vehicle_status_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_vehicle_status_range",
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
  },
  {
    upstreamId: "custom_card_better_thermostat",
    sourcePath: "https://github.com/KartoffelToby/better-thermostat-ui-card",
    publicId: "custom_card_better_thermostat",
    rendererId: "custom_card_better_thermostat",
    layoutProfile: "card:native-climate-controls",
    primitives: [
      "native-climate-controls"
    ],
    customFields: [
      "header",
      "temperature",
      "status",
      "hvac_modes",
      "presets"
    ],
    stateDriven: !0,
    animated: !1,
    actions: [
      "tap_action",
      "climate.set_temperature",
      "climate.set_hvac_mode",
      "climate.set_preset_mode"
    ],
    variables: [],
    dependencies: [],
    backendRequirements: [
      "climate entity/services"
    ],
    deviations: [
      "Original MIT-licensed implementation based only on documented public behavior and Home Assistant climate APIs; no AGPL source code, styles, translations, or assets are copied or bundled."
    ],
    sourceDigest: "0ee9011b60ca98c0d0eb61c69e50b011d7399c08e357040a6445f5dd1e65308f"
  }
], Ye = new Map(Ha.map((e) => [e.upstreamId, e])), Wa = (e) => /popup|browser_mod/i.test(e), qa = {
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
  ]
}, Wt = /* @__PURE__ */ new Set([
  "ulm_card_battery_name",
  "ulm_card_flower_name",
  "ulm_card_input_boolean_name",
  "ulm_card_input_datetime_name",
  "ulm_card_input_number_name",
  "ulm_card_media_player_with_controls_name",
  "ulm_card_printer_name",
  "ulm_card_vehicle_status_name",
  "ulm_custom_card_bar_card_name",
  "ulm_custom_card_entity_overview_name",
  "ulm_custom_card_metrics_entitites_name",
  "ulm_custom_card_pollen_forecast_name"
]), Ga = (e, t) => Wt.has(t) || (qa[e.upstreamId]?.includes(t) ?? !1), Ka = {
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
}, Ja = {
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
  ],
  custom_card_pollen_forecast: [
    "ulm_custom_card_pollen_forecast_icon",
    "ulm_custom_card_pollen_forecast_name",
    "ulm_custom_card_pollen_forecast_1",
    "ulm_custom_card_pollen_forecast_2",
    "ulm_custom_card_pollen_forecast_3",
    "ulm_custom_card_pollen_forecast_4",
    "ulm_custom_card_pollen_forecast_5",
    "ulm_custom_card_pollen_forecast_6",
    "ulm_custom_card_pollen_forecast_none"
  ]
}, qt = (e, t) => !Wa(t) && ([e.upstreamId, ...e.sourceIds ?? []].some((a) => Ja[a]?.includes(t) === !0) || Ka[e.family]?.includes(t) === !0), m = (e, t = "entity") => ({
  name: t,
  selector: { entity: e?.length ? { domain: e } : {} }
}), M = (e) => ({ name: e, selector: { text: {} } }), wt = (e) => ({ name: e, selector: { navigation: {} } }), P = (e) => ({ name: e, selector: { boolean: {} } }), K = (e, t = 1, a = 168) => ({
  name: e,
  selector: { number: { min: t, max: a, mode: "box" } }
}), Ve = (e) => ({
  name: e,
  selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
}), oe = (e) => ({ name: e, selector: { ui_action: {} } }), W = (e, t) => ({
  name: e,
  selector: { select: { mode: "dropdown", options: t } }
}), Ya = {
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
  ulm_custom_card_speedtest_ping_color: "green"
}, q = (e) => ({
  name: e,
  selector: { ui_color: { default_color: Ya[e] } }
}), $t = (e) => ({ ...e, presentation: !0 }), kt = (e) => ({
  type: "grid",
  name: "",
  schema: e,
  presentation: !0
}), Za = /* @__PURE__ */ new Set([
  "ulm_card_battery_battery_level_danger",
  "ulm_card_battery_battery_level_warning"
]), Qa = /* @__PURE__ */ new Set([
  "ulm_custom_card_bar_card_indicator",
  "ulm_custom_card_bar_card_show_icon",
  "ulm_custom_card_bar_card_value",
  "ulm_card_media_player_collapsible",
  "ulm_card_media_player_idle_off",
  "ulm_card_media_player_more_info",
  "ulm_card_media_player_power_button",
  "ulm_card_media_player_force_background_color"
]), Xa = /* @__PURE__ */ new Set([
  "ulm_custom_card_bar_card_min",
  "ulm_custom_card_bar_card_max",
  "ulm_card_graph_hours",
  "ulm_card_graph_line_width",
  "ulm_card_graph_points",
  "ulm_card_media_player_enable_volume_adjust"
]), er = /* @__PURE__ */ new Set([
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
]), tr = {}, z = () => [
  $t({
    name: "name",
    selector: { entity_name: {} },
    context: { entity: "entity" }
  }),
  $t({
    name: "icon",
    selector: { icon: {} },
    context: { icon_entity: "entity" }
  }),
  kt([
    W("layout", [
      { value: "default", label: "Default" },
      { value: "horizontal", label: "Horizontal" },
      { value: "vertical", label: "Vertical" }
    ]),
    P("fill_container")
  ]),
  kt([
    W("primary_info", [
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" }
    ]),
    W("secondary_info", [
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" }
    ]),
    W("icon_type", [
      { value: "icon", label: "Icon" },
      { value: "entity-picture", label: "Entity picture" },
      { value: "none", label: "None" }
    ])
  ])
], ar = /* @__PURE__ */ new Set([
  "card_room",
  "card_scenes",
  "card_welcome_scenes",
  "custom_card_bar_card",
  "custom_card_roomview",
  "custom_card_welcome",
  "custom_card_sun",
  "custom_card_entity_overview",
  "custom_card_internet_speed",
  "custom_card_weather_metrics",
  "custom_card_nas_metrics",
  "custom_card_tablet",
  "custom_card_pollen_forecast",
  "custom_card_playstation",
  "custom_card_speedtest_gauges",
  "custom_card_pollen"
]), Gt = (e) => e.flatMap((t) => t.name === "icon" || t.name === "icon_type" ? [] : t.schema ? [{ ...t, schema: Gt(t.schema) }] : [t]), rr = (e) => {
  if (!e.some((i) => i.presentation)) return e;
  const t = e.filter((i) => i.presentation), a = /* @__PURE__ */ new Set(["name", "icon"]), r = e.filter((i) => !i.presentation && !a.has(i.name) && !Wt.has(i.name)), o = r.findIndex((i) => i.name === "entity");
  if (o < 0) return [...t, ...r];
  const [n] = r.splice(o, 1);
  return [n, ...t, ...r];
}, or = (e) => {
  const t = { ...e };
  return delete t.presentation, t;
}, B = (e) => [
  m(e.preferredDomains),
  ...e.variants?.length ? [W("variant", e.variants.map((t) => ({
    value: t,
    label: e.variantLabels?.[t] ?? t.replaceAll("-", " ").replace(/\b\w/g, (a) => a.toUpperCase())
  })))] : [],
  ...z()
], xt = {
  weather: (e) => [
    ...B(e),
    m(["sensor"], "temperature_entity"),
    m(["sensor"], "humidity_entity"),
    P("show_forecast")
  ],
  climate: (e) => [...B(e), m(["sensor"], "humidity_entity"), P("show_controls")],
  light: (e) => [...B(e)],
  scene: (e) => [
    ...e.upstreamId === "card_welcome_scenes" ? [m(), ...z()] : B(e),
    ...e.upstreamId === "card_welcome_scenes" ? [
      m(["input_boolean"], "collapse_entity"),
      m(["weather"], "weather_entity"),
      wt("settings_path"),
      P("collapsed")
    ] : []
  ],
  presence: (e, t) => [
    ...B(e),
    ...e.upstreamId === "card_room" ? [] : [
      ...t?.variant === "small" ? [] : [
        m(["sensor"], "battery_entity"),
        m(["sensor"], "eta_entity"),
        m(["sensor"], "address_entity")
      ]
    ]
  ],
  battery: (e) => [
    ...B(e),
    Ve("battery_warning_threshold"),
    Ve("battery_low_threshold"),
    Ve("battery_critical_threshold"),
    q("battery_healthy_color"),
    q("battery_warning_color"),
    q("battery_low_color"),
    q("battery_critical_color")
  ],
  bar: (e) => [...B(e)],
  energy: (e) => [...B(e), m(["sensor"], "min_entity"), m(["sensor"], "max_entity"), P("show_graph")],
  sensor: (e) => [...B(e), P("show_graph")],
  media: (e) => [...B(e), P("show_controls")],
  cover: (e) => [...B(e), P("show_controls")],
  security: (e) => [...B(e)],
  navigation: (e) => [
    ...e.variants?.length ? [W("variant", e.variants.map((t) => ({
      value: t,
      label: e.variantLabels?.[t] ?? t
    })))] : [],
    ...z(),
    wt("navigation_path")
  ],
  text: () => [...z(), M("secondary")],
  camera: (e) => [...B(e)],
  control: (e) => [
    ...B(e),
    .../power_outlet|more_power_outlet/.test(e.upstreamId) ? [m(["sensor"], "graph_entity"), P("show_graph")] : [],
    P("show_controls")
  ],
  "alarm-time": (e) => [...B(e), m(["input_datetime"], "datetime_entity"), P("show_controls")],
  door: (e) => [...B(e), m(["lock"], "lock_entity"), m(["sensor"], "battery_entity"), P("show_controls")],
  entity: (e) => [...B(e), M("secondary")]
}, Kt = (e, t) => {
  const a = [
    ...e.upstreamId === "card_room" ? [
      m(),
      P("label_use_temperature"),
      P("label_use_brightness"),
      m(["input_select"], "input_select_entity"),
      M("input_select_option"),
      ...z()
    ] : e.upstreamId === "card_scenes" ? [
      ...e.variants?.length ? [W("variant", e.variants.map((o) => ({
        value: o,
        label: e.variantLabels?.[o] ?? o
      })))] : [],
      ...z()
    ] : e.upstreamId === "custom_card_trash" ? [
      m(["sensor", "calendar"]),
      P("show_today"),
      m(["sensor"], "today_entity"),
      P("show_tomorrow"),
      m(["sensor"], "tomorrow_entity"),
      ...z()
    ] : e.upstreamId === "custom_card_playstation" ? [
      m(["media_player", "sensor"]),
      ...z()
    ] : e.upstreamId === "custom_card_alarm_time" ? [
      m(["input_boolean", "switch"]),
      m(["input_datetime"], "datetime_entity"),
      K("ulm_card_alarm_time_step", 1, 180),
      P("ulm_card_alarm_time_collapse"),
      P("ulm_card_alarm_time_horizontal"),
      { name: "ulm_card_alarm_time_icon", selector: { icon: {} } },
      q("ulm_card_alarm_time_color"),
      ...z()
    ] : e.upstreamId === "custom_card_better_thermostat" ? [
      m(["climate"]),
      W("variant", [
        { value: "normal", label: "Normal" },
        { value: "compact", label: "Compact" }
      ]),
      ...z(),
      m(["binary_sensor"], "window_sensor"),
      m(["sensor"], "humidity_entity"),
      m(["sensor"], "battery_entity"),
      P("show_controls"),
      P("show_temperature_control"),
      P("show_humidity"),
      P("show_hvac_modes"),
      P("show_presets"),
      P("show_status"),
      P("collapsible_controls"),
      K("thermostat_temp_step", 0.1, 5),
      Ve("low_battery_threshold")
    ] : e.upstreamId === "custom_card_camera" ? [
      m(["camera"]),
      ...z(),
      W("camera_view", [
        { value: "auto", label: "Automatic" },
        { value: "live", label: "Live stream" }
      ]),
      W("fit_mode", [
        { value: "cover", label: "Crop to fill" },
        { value: "contain", label: "Fit entire image" },
        { value: "fill", label: "Stretch to fill" }
      ]),
      M("aspect_ratio"),
      K("image_height", 80, 1200)
    ] : e.upstreamId === "custom_card_media_player_sonos" ? [
      m(["media_player"]),
      ...z(),
      P("ulm_card_media_player_enable_art"),
      P("sonos_details_always_visible"),
      m(["switch"], "crossfade_entity"),
      m(["switch"], "night_sound_entity"),
      m(["switch"], "speech_enhancement_entity"),
      m(["switch"], "subwoofer_entity"),
      m(["switch"], "surrounds_entity"),
      m(["switch"], "loudness_entity"),
      m(["switch"], "surround_full_entity"),
      m(["number"], "audio_delay_entity"),
      m(["number"], "balance_entity"),
      m(["number"], "bass_entity"),
      m(["number"], "treble_entity"),
      m(["number"], "sub_gain_entity"),
      m(["number"], "surround_level_entity"),
      m(["number"], "music_surround_level_entity")
    ] : e.upstreamId === "custom_card_more_power_outlet" ? [
      m(["switch", "light"]),
      m(["sensor"], "power_entity"),
      m(["sensor"], "energy_entity"),
      m(["sensor"], "time_entity"),
      ...z()
    ] : e.upstreamId === "custom_card_gauge" ? [
      m(["sensor"]),
      K("minimum", -1e5, 1e5),
      K("maximum", -1e5, 1e5),
      ...z()
    ] : e.upstreamId === "custom_card_printer" ? [
      m(["sensor", "binary_sensor"]),
      m(["sensor"], "black_entity"),
      m(["sensor"], "yellow_entity"),
      m(["sensor"], "magenta_entity"),
      m(["sensor"], "cyan_entity"),
      ...z()
    ] : e.upstreamId === "custom_card_pollen_forecast" ? [
      m(["sensor"]),
      m(["sensor"], "level_entity"),
      { name: "ulm_custom_card_pollen_forecast_icon", selector: { icon: {} } },
      W("pollen_language", [
        { value: "en", label: "English" },
        { value: "de", label: "German" },
        { value: "es", label: "Spanish" },
        { value: "pl", label: "Polish" }
      ]),
      ...z()
    ] : e.upstreamId === "custom_card_roomview" ? [
      m(e.preferredDomains),
      m(["group", "light"], "group_lights"),
      m(["group", "binary_sensor"], "group_motions"),
      m(["group", "binary_sensor"], "group_doors"),
      m(["group", "binary_sensor"], "group_windows"),
      m(["group", "switch"], "group_outlets"),
      m(["group", "media_player"], "group_tv"),
      m(["group", "binary_sensor"], "group_water"),
      m(["group", "cover"], "group_windows_shutters"),
      m(["sensor"], "temperature"),
      m(["sensor"], "humidity"),
      ...z()
    ] : e.upstreamId === "custom_card_room_overview" ? [
      m(),
      m(["light"], "ulm_custom_card_room_overview_light_entity"),
      m(["climate"], "ulm_custom_card_room_overview_climate_entity"),
      m(["cover"], "ulm_custom_card_room_overview_cover_entity"),
      { name: "ulm_card_room_overview_light_icon_on", selector: { icon: {} } },
      { name: "ulm_card_room_overview_light_icon_off", selector: { icon: {} } },
      { name: "ulm_card_room_overview_cover_icon_open", selector: { icon: {} } },
      { name: "ulm_card_room_overview_cover_icon_closed", selector: { icon: {} } },
      P("ulm_card_dynamic_color"),
      M("secondary"),
      ...z()
    ] : e.upstreamId === "custom_card_welcome" ? [
      m(["person"]),
      m(["input_boolean"], "ulm_card_welcome_collapse"),
      m(["weather"], "ulm_weather"),
      ...Array.from({ length: 5 }, (o, n) => n + 1).flatMap((o) => [
        M(`nav_${o}`),
        { name: `icon_${o}`, selector: { icon: {} } },
        M(`name_${o}`),
        W(`color_${o}`, ["blue", "red", "green", "yellow", "pink", "purple"].map((n) => ({
          value: n,
          label: n[0].toUpperCase() + n.slice(1)
        })))
      ]),
      ...z()
    ] : e.upstreamId === "custom_card_vehicle_status" ? [
      m(["device_tracker", "sensor"]),
      m(["device_tracker", "sensor"], "ulm_card_vehicle_status_tracker"),
      m(["lock", "binary_sensor"], "ulm_card_vehicle_status_lock"),
      m(["sensor"], "ulm_card_vehicle_status_energy_level"),
      m(["sensor"], "ulm_card_vehicle_status_range"),
      ...z()
    ] : e.upstreamId === "custom_card_plant" ? [
      m(["plant", "sensor"]),
      m(["plant", "sensor"], "ulm_card_flower_entity"),
      M("ulm_card_flower_species"),
      { name: "ulm_card_flower_show_bars", selector: { object: {} } },
      ...z()
    ] : e.upstreamId === "custom_card_washer" ? [
      m(["sensor", "switch", "binary_sensor"]),
      m(["sensor", "switch", "binary_sensor"], "power_entity"),
      m(["sensor", "binary_sensor"], "door_entity"),
      m(["sensor", "binary_sensor"], "finished_entity"),
      m(["sensor", "binary_sensor"], "ulm_custom_card_washer_remote_control"),
      m(["sensor"], "ulm_custom_card_washer_job_progress"),
      m(["input_boolean"], "ulm_custom_card_washer_delayed_start"),
      m(["input_datetime"], "ulm_custom_card_washer_delayed_starttime"),
      M("ulm_custom_card_washer_machine_stop_state"),
      { name: "ulm_custom_card_washer_job_states", selector: { object: {} } },
      M("ulm_custom_card_washer_label_idle"),
      M("ulm_custom_card_washer_label_configuring"),
      M("ulm_custom_card_washer_label_running"),
      oe("ulm_custom_card_washer_start_action"),
      oe("ulm_custom_card_washer_pause_action"),
      oe("ulm_custom_card_washer_stop_action"),
      ...z()
    ] : e.upstreamId === "custom_card_sun" ? [
      m(["sun"]),
      M("title"),
      W("language", [
        { value: "en", label: "English" },
        { value: "de", label: "German" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "nl", label: "Dutch" },
        { value: "pl", label: "Polish" }
      ]),
      W("timeFormat", [
        { value: "24h", label: "24-hour time" },
        { value: "12h", label: "12-hour time" }
      ]),
      P("darkMode"),
      P("showAzimuth"),
      P("showElevation"),
      ...z()
    ] : e.upstreamId === "custom_card_pollen" ? [
      m(["sensor"]),
      m(["sensor"], "trees_entity"),
      M("custom_card_pollen_tree_name"),
      { name: "custom_card_pollen_tree_icon", selector: { icon: {} } },
      m(["sensor"], "grass_entity"),
      M("custom_card_pollen_grass_name"),
      { name: "custom_card_pollen_grass_icon", selector: { icon: {} } },
      m(["sensor"], "weeds_entity"),
      M("custom_card_pollen_weed_name"),
      { name: "custom_card_pollen_weed_icon", selector: { icon: {} } },
      ...z()
    ] : e.upstreamId === "custom_card_speedtest_gauges" ? [
      m(["sensor"]),
      m(["sensor"], "download_entity"),
      q("ulm_custom_card_speedtest_download_speed_color"),
      K("ulm_custom_card_speedtest_download_speed_max", 1, 1e5),
      m(["sensor"], "upload_entity"),
      q("ulm_custom_card_speedtest_upload_speed_color"),
      K("ulm_custom_card_speedtest_upload_speed_max", 1, 1e5),
      m(["sensor"], "ping_entity"),
      q("ulm_custom_card_speedtest_ping_color"),
      K("ulm_custom_card_speedtest_ping_max", 1, 1e5),
      P("ulm_custom_card_speedtest_round"),
      ...z()
    ] : e.upstreamId === "custom_card_nas_metrics" ? [
      m(["binary_sensor", "sensor", "switch"]),
      m(["sensor"], "disk_entity"),
      M("disk_name"),
      { name: "disk_icon", selector: { icon: {} } },
      q("disk_color"),
      m(["sensor"], "temperature_entity"),
      M("temperature_name"),
      { name: "temperature_icon", selector: { icon: {} } },
      q("temperature_color"),
      K("temperature_max", 1, 1e5),
      m(["sensor"], "memory_entity"),
      M("memory_name"),
      { name: "memory_icon", selector: { icon: {} } },
      q("memory_color"),
      K("memory_max", 1, 1e5),
      m(["sensor"], "cpu_entity"),
      M("cpu_name"),
      { name: "cpu_icon", selector: { icon: {} } },
      q("cpu_color"),
      K("cpu_max", 1, 1e5),
      ...z()
    ] : e.upstreamId === "custom_card_input_datetime" ? [
      m(["input_datetime"]),
      ...z()
    ] : e.upstreamId === "custom_card_entity_overview" ? [
      m(),
      { name: "ulm_custom_card_entity_overview_icon", selector: { icon: {} } },
      ...[1, 2, 3, 4].flatMap((o) => [
        m(void 0, `ulm_custom_card_entity_overview_entity_${o}`),
        M(`ulm_custom_card_entity_overview_name_${o}`)
      ]),
      ...z()
    ] : e.upstreamId === "custom_card_internet_speed" ? [
      m(["sensor"]),
      m(["sensor"], "download_entity"),
      m(["sensor"], "upload_entity"),
      m(["sensor"], "ping_entity"),
      M("ulm_custom_card_internet_speed_router_name"),
      M("ulm_custom_card_internet_speed_router_model"),
      q("ulm_custom_card_internet_speed_color"),
      ...z()
    ] : e.upstreamId === "custom_card_weather_metrics" ? [
      m(["weather"]),
      m(["sensor"], "temperature_entity"),
      m(["sensor"], "date_entity"),
      ...[1, 2, 3, 4].flatMap((o) => [
        m(void 0, `ulm_custom_card_weather_metrics_entity_${o}`),
        M(`ulm_custom_card_weather_metrics_name_${o}`)
      ]),
      ...z()
    ] : e.upstreamId === "custom_card_tablet" ? [
      m(["binary_sensor", "sensor", "switch"]),
      m(["switch", "input_boolean"], "tablet_button_usb_entity"),
      m(["switch", "input_boolean"], "tablet_button_motion_entity"),
      m(["light", "switch", "input_boolean"], "tablet_button_display_entity"),
      m(["button"], "tablet_restart_entity"),
      m(["switch", "input_boolean"], "tablet_maintenance_entity"),
      m(["button"], "tablet_reload_entity"),
      m(["sensor"], "tablet_ram_entity"),
      m(["sensor"], "tablet_disk_entity"),
      m(["sensor", "binary_sensor", "switch"], "tablet_power_entity"),
      m(["sensor"], "battery_entity"),
      ...z()
    ] : (xt[e.family] ?? xt.entity)(e, t)
  ], r = ar.has(e.upstreamId) ? Gt(a) : a;
  return [
    ...rr(r).map(or),
    oe("tap_action"),
    oe("hold_action"),
    oe("double_tap_action")
  ];
}, nr = (e, t) => {
  const a = t?.variant ? (e.sourceIds ?? [e.upstreamId]).filter((o) => ht(o) === t.variant || o === e.upstreamId && ht(o) === void 0) : e.sourceIds ?? [e.upstreamId];
  return [...new Map(
    a.flatMap((o) => Ye.get(o)?.variables ?? []).map((o) => [o.name, o])
  ).values()].filter((o) => qt(e, o.name)).filter((o) => !Ga(e, o.name)).filter((o) => !er.has(o.name)).map((o) => {
    const n = tr[o.name];
    if (n) return W(o.name, n);
    if (Qa.has(o.name)) return P(o.name);
    if (Xa.has(o.name)) return K(o.name, -1e5, 1e5);
    if (Za.has(o.name))
      return {
        name: o.name,
        selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
      };
    switch (o.selector) {
      case "entity":
        return m(void 0, o.name);
      case "entity-multiple":
        return {
          name: o.name,
          selector: { entity: { multiple: !0 } }
        };
      case "action":
        return oe(o.name);
      case "icon":
        return { name: o.name, selector: { icon: {} } };
      case "color":
        return q(o.name);
      case "boolean":
        return P(o.name);
      case "number":
        return K(o.name, -1e5, 1e5);
      case "object":
        return { name: o.name, selector: { object: {} } };
      default:
        return M(o.name);
    }
  });
}, Jt = (e) => new Set(e.flatMap((t) => t.schema ? [...Jt(t.schema)] : t.name ? [t.name] : [])), sr = (e, t) => {
  const a = Jt(Kt(e, t));
  return nr(e, t).filter((r) => !a.has(r.name));
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
], Yt = (e, t) => t?.attributes.icon ? t.attributes.icon : e.upstreamId === "custom_card_trash" ? "mdi:trash-can-outline" : e.upstreamId === "custom_card_room_overview" ? "mdi:sofa" : e.upstreamId === "custom_card_roomview" ? "mdi:home-variant-outline" : ir.find(([a]) => a.test(e.upstreamId))?.[1] ?? "mdi:information-outline", lr = (e) => {
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
}, cr = (e) => {
  const t = {};
  for (const a of e.sourceIds ?? [e.upstreamId])
    for (const r of Ye.get(a)?.variables ?? []) {
      if (!qt(e, r.name)) continue;
      const o = lr(r.defaultValue);
      o !== void 0 && (t[r.name] = o);
    }
  return t;
}, Zt = (e, t, a) => {
  const r = a ? t?.states[a] : void 0, o = e.upstreamId === "card_battery" ? {
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
  } : e.upstreamId === "custom_card_pollen_forecast" ? {
    pollen_language: "en"
  } : e.upstreamId === "custom_card_better_thermostat" ? {
    variant: "normal",
    show_controls: !0,
    show_temperature_control: !0,
    show_humidity: !0,
    show_hvac_modes: !0,
    show_presets: !0,
    show_status: !0,
    collapsible_controls: !1,
    thermostat_temp_step: 0.5,
    low_battery_threshold: 20
  } : e.upstreamId === "custom_card_media_player_sonos" ? {
    ulm_card_media_player_enable_art: !1,
    sonos_details_always_visible: !1,
    ...Je(t, a)
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
  } : e.upstreamId === "custom_card_vehicle_status" ? {
    ulm_custom_card_vehicle_status_default_name: "O meu carro",
    ulm_custom_card_vehicle_status_energy_level: "Nível de energia",
    ulm_custom_card_vehicle_status_range: "Alcance"
  } : e.upstreamId === "custom_card_plant" ? {
    ulm_card_flower_name: "No name set",
    ulm_custom_card_plant_correct: "Correto",
    ulm_custom_card_plant_problem: "Problema"
  } : e.upstreamId === "custom_card_playstation" ? {
    icon: "mdi:sony-playstation",
    show_controls: !1
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
    "custom_card_pollen"
  ])).has(e.upstreamId);
  return {
    type: `custom:${e.tag}`,
    ...cr(e),
    ...o,
    entity: a,
    waste_streams: e.upstreamId === "custom_card_trash" ? Da() : void 0,
    show_today: e.upstreamId === "custom_card_trash" ? !1 : void 0,
    show_tomorrow: e.upstreamId === "custom_card_trash" ? !1 : void 0,
    name: void 0,
    icon: n ? void 0 : o.icon ?? Yt(e, r),
    show_icon: !0,
    show_state: e.upstreamId !== "custom_card_pollen",
    layout: "default"
  };
}, dr = {
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
}, _e = (e, t = "") => {
  const a = t ? e?.states[t] : void 0, r = t.split(".", 1)[0];
  return {
    entity: t,
    name: a?.attributes.friendly_name,
    icon: a?.attributes.icon ?? dr[r] ?? "mdi:gesture-tap-button",
    icon_type: a?.attributes.entity_picture ? "entity-picture" : "icon",
    color: "purple",
    tap_action: { action: "toggle" }
  };
};
var ur = Object.defineProperty, _r = Object.getOwnPropertyDescriptor, Ze = (e, t, a, r) => {
  for (var o = r > 1 ? void 0 : r ? _r(t, a) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (o = (r ? i(t, a, o) : i(o)) || o);
  return r && o && ur(t, a, o), o;
};
const mr = [
  { id: "context", title: "Context", icon: "mdi:shape-outline" },
  { id: "content", title: "Content", icon: "mdi:format-align-left" },
  { id: "layout", title: "Layout", icon: "mdi:view-dashboard-outline" },
  { id: "interactions", title: "Interactions", icon: "mdi:gesture-tap" },
  { id: "features", title: "Features", icon: "mdi:view-list" }
], pr = /* @__PURE__ */ new Set([
  "name",
  "secondary",
  "primary_info",
  "secondary_info",
  "icon",
  "icon_type",
  "icon_color",
  "show_icon",
  "show_name",
  "show_state"
]), hr = /* @__PURE__ */ new Set([
  "layout",
  "fill_container",
  "variant",
  "aspect_ratio",
  "image_height",
  "fit_mode",
  "camera_view",
  "features_position"
]), gr = /* @__PURE__ */ new Set([
  "tap_action",
  "hold_action",
  "double_tap_action",
  "navigation_path",
  "settings_path"
]), St = (e) => e.name === "entity" ? "context" : gr.has(e.name) || e.name.endsWith("_action") ? "interactions" : hr.has(e.name) || e.name.endsWith("_horizontal") || e.name.endsWith("_narrow_buttons") ? "layout" : pr.has(e.name) ? "content" : "features", br = (e) => {
  const t = {
    context: [],
    content: [],
    layout: [],
    interactions: [],
    features: []
  };
  for (const a of e) {
    if (!a.schema?.length) {
      t[St(a)].push(a);
      continue;
    }
    const r = /* @__PURE__ */ new Map();
    for (const o of a.schema) {
      const n = St(o);
      r.set(n, [...r.get(n) ?? [], o]);
    }
    for (const [o, n] of r) t[o].push({ ...a, schema: n });
  }
  return t;
};
let ke = class extends me {
  constructor() {
    super(...arguments), this.computeLabel = (e) => this.config?.type.includes("custom-card-trash") && e.name === "entity" ? "Optional card entity" : Ua(this.hass, e.name), this.computeHelper = (e) => Ra(e.name), this.valueChanged = (e) => {
      if (!this.config || !e.detail.value) return;
      const t = e.detail.value, a = { ...this.config, ...t };
      if (Object.prototype.hasOwnProperty.call(t, "name") && JSON.stringify(t.name) !== JSON.stringify(this.config.name) && delete a.name_mode, this.config.type.includes("media-player-sonos") && typeof t.entity == "string" && t.entity !== this.config.entity)
        for (const { configKey: r } of Ge)
          this.config[r] === void 0 && delete a[r];
      this.config = a, ie(this, "config-changed", { config: a });
    }, this.addWasteStream = () => {
      this.config && this.updateWasteStreams([
        ...ne(this.config),
        { enabled: !0, entity: "", label: "Custom waste", icon: "mdi:trash-can", color: "#43a047" }
      ]);
    }, this.addSonosShortcut = () => {
      this.config && this.updateSonosShortcuts([
        ...this.config.shortcuts?.buttons ?? [],
        { icon: "mdi:playlist-music", type: "playlist", id: "" }
      ]);
    };
  }
  setConfig(e) {
    const t = e.type.replace(/^custom:/, ""), a = qe.find((r) => r.tag === t);
    this.config = {
      ...e,
      variant: e.variant ?? a?.variant
    };
  }
  render() {
    if (!this.hass || !this.config) return h;
    const e = Ma(this.config.type.replace(/^custom:/, ""));
    if (!e) return h;
    const t = Kt(e, this.config), a = sr(e, this.config).filter((l) => e.upstreamId !== "custom_card_trash" || !l.name.startsWith("ulm_card_datum_") && !l.name.includes("ophaling")), r = br([...t, ...a]), o = {
      ...Zt(e, this.hass, this.config.entity),
      ...this.config
    }, n = e.upstreamId === "custom_card_trash" ? this.renderWasteStreamEditor() : e.upstreamId === "custom_card_media_player_sonos" ? this.renderSonosShortcutEditor() : e.family === "scene" ? this.renderItemEditor(
      "scene_items",
      "Scene buttons",
      e.upstreamId === "card_welcome_scenes" ? void 0 : ["scene"]
    ) : e.upstreamId === "card_room" ? this.renderItemEditor("room_sensors", "Room sensor buttons") : h, i = e.upstreamId === "custom_card_trash" || e.upstreamId === "custom_card_media_player_sonos" || e.family === "scene" || e.upstreamId === "card_room";
    return c`
      <div class="editor-sections">
        ${mr.map((l) => this.renderEditorSection(
      l,
      r[l.id],
      o,
      l.id === "features" && i ? n : h,
      l.id === "features" && i
    ))}
      </div>
    `;
  }
  renderEditorSection(e, t, a, r, o) {
    return !t.length && !o ? h : c`
      <ha-expansion-panel class="editor-section" outlined>
        <span slot="header" class="section-header">
          <ha-icon .icon=${e.icon}></ha-icon>
          <span>${e.title}</span>
        </span>
        <div class="section-body">
          ${t.length ? c`
            <ha-form
              .hass=${this.hass}
              .data=${a}
              .schema=${t}
              .computeLabel=${this.computeLabel}
              .computeHelper=${this.computeHelper}
              @value-changed=${this.valueChanged}
            ></ha-form>
          ` : h}
          ${r}
        </div>
      </ha-expansion-panel>
    `;
  }
  renderItemEditor(e, t, a) {
    if (!this.config) return h;
    const r = this.config[e] ?? [], o = (r.length ? r : (this.config.entities ?? []).map((n) => ({ entity: n }))).map((n) => e === "scene_items" ? { ..._e(this.hass, n.entity), ...n } : n);
    return c`
      <section class="item-editor">
        <h3>${t}</h3>
        <p>Each button starts with sensible values from its entity. You can override every value, including its name.</p>
        ${o.map((n, i) => c`
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
            ${e === "scene_items" ? c`
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
  renderWasteStreamEditor() {
    if (!this.config) return h;
    const e = ne(this.config);
    return c`
      <section class="item-editor waste-stream-editor">
        <h3>Waste streams</h3>
        <p>Each enabled row uses its own sensor or calendar entity. Empty or disabled rows are omitted from the card.</p>
        ${e.map((t, a) => c`
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
            <label class="field">
              <span>Label</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${t.label ?? ""}
                @value-changed=${(r) => this.updateWasteStream(a, "label", r.detail.value)}
              ></ha-selector>
            </label>
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
                .selector=${{ ui_color: { default_color: "green" } }}
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
  renderSonosShortcutEditor() {
    if (!this.config) return h;
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
              @value-changed=${(a) => this.updateSonosColumns(a.detail.value)}
            ></ha-selector>
            <small>Number of shortcut buttons shown on each row.</small>
          </label>
        </div>
        ${e.map((a, r) => c`
          <div class="item-row sonos-shortcut-row" data-shortcut-index=${r}>
            <h4>${a.name || `Shortcut ${r + 1}`}</h4>
            <label class="field">
              <span>Label</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${a.name ?? ""}
                @value-changed=${(o) => this.updateSonosShortcut(r, "name", o.detail.value)}
              ></ha-selector>
              <small>Optional text shown below the icon.</small>
            </label>
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${a.icon ?? "mdi:playlist-music"}
                @value-changed=${(o) => this.updateSonosShortcut(r, "icon", o.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Media type</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${a.type ?? "playlist"}
                @value-changed=${(o) => this.updateSonosShortcut(r, "type", o.detail.value)}
              ></ha-selector>
              <small>Use playlist for Spotify playlist IDs, or another media type supported by your player.</small>
            </label>
            <label class="field wide">
              <span>Playlist or media ID</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${a.id ?? ""}
                @value-changed=${(o) => this.updateSonosShortcut(r, "id", o.detail.value)}
              ></ha-selector>
              <small>For example: spotify:playlist:4Peff17x9lxkDupqOF0ive</small>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${r === 0} @click=${() => this.moveSonosShortcut(r, -1)}>Move up</button>
              <button ?disabled=${r === e.length - 1}
                @click=${() => this.moveSonosShortcut(r, 1)}>Move down</button>
              <button @click=${() => this.removeSonosShortcut(r)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addSonosShortcut}>Add playlist shortcut</button>
      </section>
    `;
  }
  updateItem(e, t, a, r) {
    if (!this.config) return;
    const o = [...this.config[e] ?? (this.config.entities ?? []).map((n) => ({ entity: n }))];
    if (e === "scene_items" && a === "entity" && typeof r == "string") {
      const n = o[t], i = _e(this.hass, n.entity), l = _e(this.hass, r), s = { ...n, entity: r };
      for (const _ of ["name", "icon", "icon_type", "color", "tap_action"])
        (n[_] === void 0 || JSON.stringify(n[_]) === JSON.stringify(i[_])) && Object.assign(s, { [_]: l[_] });
      o[t] = s;
    } else
      o[t] = { ...o[t], [a]: r || void 0 };
    this.updateItems(e, o);
  }
  addItem(e) {
    if (!this.config) return;
    const t = [...this.config[e] ?? (this.config.entities ?? []).map((r) => ({ entity: r }))], a = e === "scene_items" ? Object.keys(this.hass?.states ?? {}).find((r) => r.startsWith("scene.")) ?? "" : "";
    t.push(e === "scene_items" ? _e(this.hass, a) : { entity: "" }), this.updateItems(e, t);
  }
  removeItem(e, t) {
    if (!this.config) return;
    const a = [...this.config[e] ?? (this.config.entities ?? []).map((r) => ({ entity: r }))].filter((r, o) => o !== t);
    this.updateItems(e, a);
  }
  updateItems(e, t) {
    if (!this.config) return;
    const a = { ...this.config, [e]: t, entities: void 0 };
    this.config = a, ie(this, "config-changed", { config: a });
  }
  updateWasteStream(e, t, a) {
    if (!this.config) return;
    const r = ne(this.config);
    r[e] = {
      ...r[e],
      [t]: t === "enabled" ? a !== !1 : a || void 0
    }, this.updateWasteStreams(r);
  }
  removeWasteStream(e) {
    this.config && this.updateWasteStreams(ne(this.config).filter((t, a) => a !== e));
  }
  moveWasteStream(e, t) {
    if (!this.config) return;
    const a = ne(this.config), r = e + t;
    r < 0 || r >= a.length || ([a[e], a[r]] = [a[r], a[e]], this.updateWasteStreams(a));
  }
  updateWasteStreams(e) {
    if (!this.config) return;
    const t = { ...this.config, waste_streams: e };
    this.config = t, ie(this, "config-changed", { config: t });
  }
  updateSonosColumns(e) {
    if (!this.config) return;
    const t = Math.min(8, Math.max(1, Math.round(Number(e) || 4)));
    this.updateSonosShortcuts(this.config.shortcuts?.buttons ?? [], t);
  }
  updateSonosShortcut(e, t, a) {
    if (!this.config) return;
    const r = [...this.config.shortcuts?.buttons ?? []];
    r[e] = { ...r[e], [t]: a || void 0 }, this.updateSonosShortcuts(r);
  }
  removeSonosShortcut(e) {
    this.config && this.updateSonosShortcuts(
      (this.config.shortcuts?.buttons ?? []).filter((t, a) => a !== e)
    );
  }
  moveSonosShortcut(e, t) {
    if (!this.config) return;
    const a = [...this.config.shortcuts?.buttons ?? []], r = e + t;
    r < 0 || r >= a.length || ([a[e], a[r]] = [a[r], a[e]], this.updateSonosShortcuts(a));
  }
  updateSonosShortcuts(e, t = this.config?.shortcuts?.columns ?? 4) {
    if (!this.config) return;
    const a = { ...this.config, shortcuts: { columns: t, buttons: e } };
    this.config = a, ie(this, "config-changed", { config: a });
  }
};
ke.styles = zt`
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
Ze([
  Me({ attribute: !1 })
], ke.prototype, "hass", 2);
Ze([
  Lt()
], ke.prototype, "config", 2);
ke = Ze([
  Sa("mushroom-addition-editor")
], ke);
const yr = zt`
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
  .automatic-presentation {
    display: flex;
    min-width: 0;
    align-items: center;
    padding: 0 2px 10px;
  }
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
  .better-thermostat { display: grid; gap: 12px; padding: 14px; }
  .better-thermostat-header {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
  }
  .better-thermostat-temperature { display: grid; justify-items: end; gap: 2px; }
  .better-thermostat-temperature b {
    font-size: 24px;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    line-height: 1;
  }
  .better-thermostat-temperature small {
    display: inline-flex;
    align-items: center;
    color: var(--secondary-text-color);
    font-size: 12px;
  }
  .better-thermostat-temperature small ha-icon { --mdc-icon-size: 14px; }
  .better-thermostat-statuses { display: flex; flex-wrap: wrap; gap: 6px; }
  .better-thermostat-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 9px;
    border-radius: 10px;
    background: rgba(var(--tone, var(--ulm-grey)), .12);
    color: rgb(var(--tone, var(--ulm-grey)));
    font-size: 11px;
    font-weight: 700;
  }
  .better-thermostat-status ha-icon { --mdc-icon-size: 15px; }
  .better-thermostat-target {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
  }
  .better-thermostat-target label { display: grid; gap: 5px; }
  .better-thermostat-target label span {
    color: var(--secondary-text-color);
    font-size: 11px;
    text-align: center;
  }
  .better-thermostat-target input { width: 100%; accent-color: rgb(var(--tone, var(--ulm-orange))); }
  .better-thermostat-target input:focus-visible,
  .better-thermostat-options button:focus-visible {
    outline: 2px solid rgb(var(--ulm-blue));
    outline-offset: 2px;
  }
  .better-thermostat-target > span {
    font-size: 18px;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    text-align: center;
  }
  .better-thermostat-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(66px, 1fr));
    gap: 7px;
  }
  .better-thermostat-options button {
    display: grid;
    min-height: 50px;
    place-items: center;
    gap: 3px;
    padding: 7px;
    border: 0;
    border-radius: 13px;
    background: rgba(var(--ulm-grey), .08);
    color: var(--primary-text-color);
    cursor: pointer;
    touch-action: manipulation;
  }
  .better-thermostat-options button:hover { background: rgba(var(--ulm-grey), .14); }
  .better-thermostat-options button:disabled { cursor: not-allowed; opacity: .55; }
  .better-thermostat-options button.is-selected {
    background: rgba(var(--tone, var(--ulm-orange)), .18);
    color: rgb(var(--tone, var(--ulm-orange)));
  }
  .better-thermostat-options button ha-icon { --mdc-icon-size: 20px; }
  .better-thermostat-options button span { font-size: 11px; font-weight: 700; }
  .better-thermostat-options.presets button.is-selected {
    background: rgba(var(--ulm-green), .16);
    color: rgb(var(--ulm-green));
  }
  .better-thermostat.is-compact { gap: 9px; padding: 12px; }
  .better-thermostat.is-compact .better-thermostat-header { min-height: 42px; }
  .better-thermostat.is-compact .better-thermostat-options {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .better-thermostat.is-compact .better-thermostat-options::-webkit-scrollbar { display: none; }
  .better-thermostat.is-compact .better-thermostat-options button { min-width: 68px; min-height: 44px; }
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
  .ulm-camera { display: block; overflow: hidden; background: rgba(var(--ulm-grey), .08); }
  .camera-media { position: relative; width: 100%; min-height: 80px; overflow: hidden; background: rgba(var(--ulm-grey), .08); }
  .camera-media img, .camera-media ha-camera-stream { display: block; width: 100%; height: 100%; }
  .camera-overlay {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: grid;
    gap: 2px;
    padding: 28px 16px 12px;
    background: linear-gradient(transparent, rgba(0, 0, 0, .72));
    color: #fff;
    pointer-events: none;
  }
  .camera-overlay b, .camera-overlay span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .camera-overlay b { font-size: 16px; }
  .camera-overlay span { font-size: 12px; }
  .camera-placeholder { display: grid; width: 100%; height: 100%; min-height: 80px; place-items: center; }
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
  .sun-times, .sun-footer { display: flex; justify-content: space-between; }
  .sun-times span, .sun-footer span { display: flex; flex-direction: column; gap: 3px; }
  .sun-times span:last-child, .sun-footer span:last-child { align-items: flex-end; }
  .sun-times small, .sun-footer small { color: var(--secondary-text-color); }
  .sun-times b { font-size: 21px; font-weight: 500; }
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
  .speedtest-router, .nas-metrics-header {
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
  .speedtest-router { flex-direction: column; text-align: center; }
  .speedtest-router .ulm-icon { width: 62px; height: 62px; }
  .speedtest-router .ulm-icon ha-icon { --mdc-icon-size: 32px; }
  .speedtest-router .ulm-copy { align-items: center; }
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
  .custom-pollen-forecast {
    display: grid; min-height: 62px; grid-template-columns: minmax(0, 1fr) 46px; align-items: center; gap: 10px; padding: 10px 14px;
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
  .pollen-icon { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: var(--pollen); }
  .pollen-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .custom-nas-metrics { gap: 12px; padding: 18px; }
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
  .pollen-icon { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--pollen) 20%, transparent); color: var(--pollen); }
  .waste-collection-icon { position: relative; } .waste-collection-icon > i { position: absolute; top: -3px; right: -3px; display: grid; width: 20px; height: 20px; place-items: center; border-radius: 50%; background: rgb(var(--ulm-red)); color: #fff; }
  .waste-collection-icon > i ha-icon { --mdc-icon-size: 13px; }
  .custom-vehicle-status, .custom-plant { display: grid; gap: 10px; padding: 12px; }
  .car-hero, .flower-heading {
    display: flex; min-width: 0; align-items: center; gap: 10px;
  }
  .flower-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
  .flower-metrics > span { display: grid; min-width: 0; min-height: 52px; place-items: center; padding: 6px; border-radius: 12px; background: rgba(var(--ulm-grey), .07); text-align: center; }
  .flower-metrics ha-icon { --mdc-icon-size: 17px; color: rgb(var(--ulm-blue)); }
  .flower-metrics b { overflow: hidden; max-width: 100%; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
  .car-metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; }
  .car-metrics > span { display: grid; min-width: 0; min-height: 52px; grid-template-columns: 24px auto; grid-template-rows: auto auto; align-items: center; padding: 7px; border-radius: 14px; background: rgba(var(--ulm-grey), .07); }
  .car-metrics ha-icon { --mdc-icon-size: 18px; grid-row: 1 / 3; color: rgb(var(--ulm-blue)); }
  .car-metrics b { overflow: hidden; max-width: 100%; font-size: 18px; text-overflow: ellipsis; white-space: nowrap; }
  .car-metrics small { overflow: hidden; color: var(--secondary-text-color); font-size: 9px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
  .custom-console-card { position: relative; min-height: 72px; overflow: hidden; }
  .custom-console-card.has-artwork { background: #17191d; color: #fff; }
  .console-backdrop { position: absolute; inset: 0; background-position: center; background-size: cover; opacity: .35; }
  .console-content { position: relative; z-index: 1; display: grid; min-height: 48px; grid-template-columns: 52px minmax(0, 1fr); align-items: center; gap: 10px; padding: 12px; }
  .has-artwork .console-content { background: linear-gradient(90deg, rgba(0,0,0,.8), rgba(0,0,0,.18)); }
  .console-logo { display: grid; width: 52px; height: 52px; place-items: center; border-radius: 50%; background: rgba(255,255,255,.1); }
  .console-logo ha-icon { --mdc-icon-size: 32px; } .state-idle .console-logo { color: rgb(var(--ulm-blue)); background: rgba(var(--ulm-blue), .2); } .state-standby .console-logo { color: rgba(var(--ulm-grey), .35); background: rgba(var(--ulm-grey), .05); }
  .has-artwork .console-content .ulm-label { color: rgba(255,255,255,.75); }
  .source-scene-grid .scene-grid { display: grid; grid-template-columns: repeat(5, 64px); justify-content: space-between; gap: 12px; }
  .car-hero, .flower-heading { width: 100%; padding: 0; border: 0; background: transparent; color: inherit; text-align: left; }
  .car-icon-wrap { position: relative; display: inline-grid; }
  .car-badge { position: absolute; display: grid; width: 18px; height: 18px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; color: var(--primary-background-color); }
  .car-badge ha-icon { --mdc-icon-size: 11px; }
  .car-badge.tracker { top: -5px; right: -5px; background: rgb(var(--ulm-blue)); }
  .car-badge.tracker.is-away { background: rgb(var(--ulm-green)); }
  .car-badge.lock { right: -5px; bottom: -5px; background: rgb(var(--ulm-blue)); }
  .car-badge.lock.is-unlocked { background: rgb(var(--ulm-red)); }
  .flower-bars { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 12px; }
  .flower-bars > span { display: grid; grid-template-columns: 18px minmax(0, 1fr); align-items: center; gap: 5px; }
  .flower-bars ha-icon { --mdc-icon-size: 15px; }
  .flower-bars i { display: block; height: 7px; overflow: hidden; border-radius: 2px; background: rgba(var(--ulm-grey), .1); }
  .flower-bars em { display: block; height: 100%; background: rgb(var(--ulm-green)); }
  .speedtest-three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
  .speedtest-three ha-icon { color: rgb(var(--ulm-blue)); } .speedtest-three b { font-size: 12px; } .speedtest-three small { overflow: hidden; max-width: 100%; color: var(--secondary-text-color); font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }
  .speedtest-chart { height: 58px; overflow: hidden; } .speedtest-chart .sparkline { height: 60px; }
  .custom-speedtest-gauges { padding: 8px; }
  .speedtest-three { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2px; }
  .speedtest-metric { position: relative; display: grid; min-width: 0; min-height: 112px; place-items: center; color: var(--speedtest-color); }
  .speedtest-ring { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .speedtest-ring path { fill: none; stroke-linecap: round; stroke-width: 8; }
  .speedtest-track { stroke: rgba(var(--ulm-grey), .12); }
  .speedtest-value { stroke: var(--speedtest-color); stroke-dasharray: var(--speedtest-value) 100; }
  .speedtest-value-copy { position: relative; display: grid; place-items: center; text-align: center; }
  .speedtest-value-copy ha-icon { --mdc-icon-size: 20px; }
  .speedtest-value-copy b { margin-top: 2px; color: var(--primary-text-color); font-size: 13px; }
  .speedtest-value-copy small { margin-top: 4px; color: var(--secondary-text-color); font-size: 11px; font-weight: 700; }
  .custom-pollen { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 8px; }
  .pollen-heading { grid-column: 1 / -1; min-width: 0; }
  .pollen-item { display: grid; min-width: 0; min-height: 92px; place-items: center; gap: 3px; padding: 6px 3px; border: 0; border-radius: var(--border-radius, 12px); background: transparent; color: var(--primary-text-color); text-align: center; cursor: pointer; }
  .pollen-item:disabled { cursor: default; opacity: .55; }
  .pollen-item-icon { position: relative; display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--pollen) 20%, transparent); color: var(--pollen); }
  .pollen-item-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .pollen-extreme { position: absolute; top: -3px; right: -4px; display: grid; width: 18px; height: 18px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; background: rgba(var(--color-red, 244, 67, 54), 1); color: white; }
  .pollen-extreme ha-icon { --mdc-icon-size: 11px; }
  .custom-pollen b { overflow: hidden; max-width: 100%; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
  .custom-pollen small { color: var(--secondary-text-color); font-size: 10px; }
  .preview { padding: 16px; color: var(--secondary-text-color); text-align: center; }
`, fr = {
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
}, vr = (e, t) => {
  const a = e?.trim() || t.trim();
  if (a === "primary")
    return e ? `var(--primary-color, ${t})` : "var(--primary-color)";
  if (a === "accent")
    return e ? `var(--accent-color, ${t})` : "var(--accent-color)";
  const r = fr[a];
  return r ? `rgb(var(--rgb-${a}, ${r}))` : a;
}, v = (e, t) => e?.attributes[t], S = (e) => {
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, Se = (e, t, a, r, o = "") => {
  if (e.config.icon_type === "none") return h;
  const n = e.config.icon_type === "entity-picture" ? v(e.entity, "entity_picture") : void 0;
  return n ? c`<span class="ulm-icon entity-picture ${o}" style=${`background-image:url("${String(n)}")`}></span>` : c`<span class="ulm-icon source-icon ${r ? "is-source-active" : ""} ${o}"
        style=${`--source-color:${a}`}>
        <ha-icon .icon=${e.config.icon || t}></ha-icon>
      </span>`;
}, It = (e, t) => {
  const a = p(e, t);
  return a ? e.hass.states[a] : void 0;
}, wr = (e, t) => {
  if (e === void 0) return "mdi:battery-off";
  if (e <= 0 && !t) return "mdi:battery-alert-variant-outline";
  if (e >= 100) return "mdi:battery";
  if (e <= 0) return `mdi:battery${t}-outline`;
  const a = Math.max(10, Math.min(90, Math.round(e / 10) * 10));
  return `mdi:battery${t}-${a}`;
}, A = (e, t) => {
  const a = e.config[t];
  return typeof a == "string" ? e.hass.states[a] : void 0;
}, p = (e, ...t) => {
  for (const a of t)
    if (e.config[a] !== void 0) return e.config[a];
}, Te = (e, t) => e.config.icon || e.entity?.attributes.icon || Yt(e.descriptor, e.entity) || t, N = (e, t, a = "blue", r = "") => {
  if (e.config.icon_type === "none") return h;
  const o = e.config.icon_type === "entity-picture" ? v(e.entity, "entity_picture") : void 0;
  return o ? c`<span class="ulm-icon entity-picture ${r}" style=${`background-image:url("${String(o)}")`}></span>` : c`<span class="ulm-icon tone-${a} ${r}"><ha-icon .icon=${Te(e, t)}></ha-icon></span>`;
}, $r = (e, t) => {
  switch (e.config.secondary_info) {
    case "none":
      return;
    case "name":
      return H(e.config, e.entity, e.hass);
    case "state":
      return w(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    case "last-updated":
      return e.entity?.last_updated ? new Date(e.entity.last_updated).toLocaleString() : "Last updated unavailable";
    default:
      return e.config.secondary || t;
  }
}, kr = (e, t) => {
  switch (e.config.primary_info) {
    case "none":
      return "";
    case "state":
      return w(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    case "last-updated":
      return e.entity?.last_updated ? new Date(e.entity.last_updated).toLocaleString() : "Last updated unavailable";
    default:
      return H(e.config, e.entity, e.hass) || t || "";
  }
}, Qt = (e, t, a) => {
  e.presentation.rendered = !0;
  const r = H(e.config, e.entity, e.hass), o = e.config.name !== void 0 && typeof e.config.name != "string";
  return {
    primary: (e.config.primary_info === void 0 ? o && r ? r : a ?? r : kr(e, a)) || void 0,
    secondary: e.config.secondary_info === void 0 ? t : $r(e, t)
  };
}, V = (e, t, a) => c`
  ${(() => {
  const r = Qt(e, t, a);
  return c`
  <span class="ulm-copy shared-presentation">
    ${r.primary ? c`<span class="ulm-name">${r.primary}</span>` : h}
    ${r.secondary ? c`<span class="ulm-label">${r.secondary}</span>` : h}
  </span>
    `;
})()}
`, Xt = (e, t = w(e.entity)) => c`
  <span class="value-first">${V(e, H(e.config, e.entity, e.hass), t)}</span>
`, xr = (e) => c`<div class="automatic-presentation">${V(e, w(e.entity), e.descriptor.name)}</div>`, T = (e, t, a, r = !1) => c`
  <button class="ulm-control" aria-label=${e} ?disabled=${r}
    @pointerdown=${(o) => o.stopPropagation()} @click=${a}>
    <ha-icon .icon=${t}></ha-icon>
  </button>
`, Sr = (e, t, a, r, o = !1) => {
  let n, i = !1;
  const l = () => {
    n !== void 0 && window.clearTimeout(n), n = void 0;
  };
  return c`
    <button class="ulm-control hold-control" aria-label=${e} ?disabled=${o}
      @pointerdown=${(s) => {
    s.stopPropagation(), i = !1, n = window.setTimeout(() => {
      i = !0, r();
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
}, U = (e, t, a, r = t.config.entity) => {
  e.stopPropagation(), ie(e.currentTarget, "hass-action", {
    config: { type: t.config.type, entity: r, tap_action: a },
    action: "tap"
  });
}, Ir = {
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
}, Ar = (e) => {
  const t = S(e.entity?.state) ?? 0, a = !!v(e.entity, "is_charging") || String(e.entity?.state).includes("charging"), r = p(e, "ulm_card_battery_battery_level_danger") ?? 20, o = p(e, "ulm_card_battery_battery_level_warning") ?? 50, n = t < r ? "red" : t < o ? "yellow" : "green", i = p(e, "ulm_card_battery_charging_animation") === !0 && a;
  return e.actionSurface(`ulm-battery ${i ? "is-charging" : ""}`, c`
    ${N(e, a ? "mdi:battery-charging" : "mdi:battery", n)}
    ${V(e, a ? "Charging" : "Battery level")}
    <span class="battery-value">${Math.round(t)}<small>%</small></span>
    <span class="battery-track"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>
  `);
}, Vr = (e) => {
  const t = p(e, "ulm_card_battery_attribute"), a = t ? v(e.entity, t) : e.entity?.state, r = S(a), o = It(e, "ulm_card_battery_battery_state_entity_id"), n = It(e, "ulm_card_battery_charger_type_entity_id"), i = o?.state.toLowerCase() === "charging", l = n?.state.toLowerCase(), s = l === "wireless" ? "-charging-wireless" : i || ["charging", "ac", "usb"].includes(l ?? "") ? "-charging" : "", _ = S(e.config.battery_warning_threshold) ?? p(e, "ulm_card_battery_battery_level_warning") ?? 50, g = S(e.config.battery_low_threshold) ?? p(e, "ulm_card_battery_battery_level_danger") ?? 20, b = S(e.config.battery_critical_threshold) ?? 10, [d, u, f] = [b, g, _].map((k) => Math.max(0, Math.min(100, k))).sort((k, F) => k - F), $ = r === void 0 || r <= d ? R(
    e.config.battery_critical_color ?? p(e, "ulm_card_battery_color_battery_level_danger"),
    "var(--google-red, #f44336)"
  ) : r <= u ? R(e.config.battery_low_color, "var(--google-orange, #ff9800)") : r <= f ? R(
    e.config.battery_warning_color ?? p(e, "ulm_card_battery_color_battery_level_warning"),
    "var(--google-yellow, #fbc02d)"
  ) : R(
    e.config.battery_healthy_color ?? p(e, "ulm_card_battery_color_battery_level_ok"),
    "var(--google-green, #43a047)"
  ), D = p(e, "ulm_card_battery_charging_animation") === !0 && i, L = r === void 0 ? w(e.entity) : `${Math.round(r)}%`;
  return e.actionSurface(`ulm-row ulm-default-battery ${D ? "is-charging" : ""}`, c`
    ${Se(e, wr(r, s), $, !0)}
    <span class="value-first">${V(e, H(e.config, e.entity, e.hass), L)}</span>
  `);
}, R = vr, Pr = (e) => {
  const t = S(e.entity?.state) ?? 0, a = S(p(e, "ulm_custom_card_bar_card_min")) ?? 0, o = (S(p(e, "ulm_custom_card_bar_card_max")) ?? 100) - a, n = o > 0 ? Math.max(0, Math.min(100, (t - a) / o * 100)) : 0, i = p(e, "ulm_custom_card_bar_card_show_icon") !== !1, l = p(e, "ulm_custom_card_bar_card_value") === !0, s = p(e, "ulm_custom_card_bar_card_indicator") === !0, _ = R(
    p(e, "ulm_custom_card_bar_card_color"),
    "var(--google-blue, #4285f4)"
  ), g = R(
    p(e, "ulm_custom_card_bar_card_icon_color"),
    "var(--secondary-text-color)"
  ), b = p(e, "ulm_custom_card_bar_card_icon") || e.config.icon || e.entity?.attributes.icon || "mdi:chart-bar", d = w(e.entity);
  return e.actionSurface(`bar-card ${i ? "has-header" : "bar-only"}`, c`
    ${i ? c`
      <div class="bar-card-header">
        <span class="bar-card-icon" style=${`--bar-icon-color:${g}`}>
          <ha-icon .icon=${b}></ha-icon>
        </span>
        <span class="bar-card-copy">${V(e, H(e.config, e.entity, e.hass), d)}</span>
      </div>
    ` : h}
    <div class="bar-card-track" style=${`--bar-fill:${_};--bar-percentage:${n}%`}>
      <span class="bar-card-fill" style=${`width:${n}%`}></span>
      ${s ? c`<span class="bar-card-indicator" style=${`left:${n}%`}></span>` : h}
      ${l ? c`
        <b class="bar-card-inside-value">${d}</b>
        <b class="bar-card-inside-value bar-card-inside-value-filled" aria-hidden="true">${d}</b>
      ` : h}
    </div>
  `);
}, ea = (e, t = !1, a = e.entity, r, o = r) => {
  const n = Array.isArray(v(a, "history")) ? v(a, "history").map(Number).filter(Number.isFinite).slice(-12) : [20, 28, 24, 42, 35, 52, 48, 63, 55, 70, 62, 78], i = Math.min(...n), l = Math.max(...n), s = n.map((b, d) => `${d / Math.max(1, n.length - 1) * 100},${36 - (b - i) / Math.max(1, l - i) * 32}`).join(" "), _ = `0,40 ${s} 100,40`, g = r ? `--sparkline-color:${r};--sparkline-fill-color:${o ?? r}` : "";
  return c`<svg class="sparkline ${t ? "is-filled" : ""}" style=${g} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
    ${t ? c`<polygon points=${_}></polygon>` : h}
    <polyline points=${s}></polyline>
  </svg>`;
}, Cr = (e) => e.actionSurface("ulm-metric", c`
  <div class="metric-heading">${N(e, e.descriptor.family === "energy" ? "mdi:flash" : "mdi:chart-line", "blue")}${V(e, e.entity?.attributes.unit_of_measurement ? String(e.entity.attributes.unit_of_measurement) : "Current value")}<span class="metric-value">${w(e.entity)}</span></div>
  ${e.config.show_graph !== !1 ? ea(e) : h}
  ${A(e, "min_entity") || A(e, "max_entity") ? c`<div class="metric-extremes"><span>Min ${w(A(e, "min_entity"))}</span><span>Max ${w(A(e, "max_entity"))}</span></div>` : h}
`), zr = (e, t, a) => {
  const r = a.navigation_path || a.nav_path;
  if (r) {
    U(e, t, { action: "navigate", navigation_path: r }, a.entity);
    return;
  }
  const o = a.tap_action, n = o?.service ?? o?.perform_action;
  if ((o?.action === "call-service" || o?.action === "perform-action") && n) {
    const [s, _] = n.split(".", 2);
    if (s && _) {
      t.service(s, _, {
        entity_id: a.entity,
        ...o.service_data ?? o.data ?? {}
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
}, Er = (e) => {
  const t = (e.config.scene_items?.length ? e.config.scene_items : (e.config.entities?.length ? e.config.entities : e.config.entity ? [e.config.entity] : []).map((k) => ({ entity: k }))).filter((k) => k.entity), a = e.descriptor.upstreamId === "card_welcome_scenes", r = e.descriptor.upstreamId === "card_scenes" && e.config.variant === "scene-grid", o = a ? 7 : r ? 5 : 6, n = a && t.length > o, i = a && e.sceneOverflowExpanded ? t : t.slice(0, o), l = e.config.collapse_entity ? e.hass.states[e.config.collapse_entity] : void 0, s = e.config.collapsed === !0 || l?.state === "on", g = A(e, "weather_entity")?.state || "partlycloudy", b = Ir[g]?.[0] ?? "mdi:weather-partly-cloudy", d = (/* @__PURE__ */ new Date()).getHours(), u = e.hass.language?.split("-")[0] ?? "en", f = {
    de: ["Hallo", "Guten Morgen", "Guten Tag", "Guten Abend"],
    en: ["Hello", "Good morning", "Good afternoon", "Good evening"],
    es: ["Hola", "Buenos días", "Buenas tardes", "Buenas noches"],
    fr: ["Bonjour", "Bonjour", "Bon après-midi", "Bonsoir"],
    nl: ["Hallo", "Goedemorgen", "Goedemiddag", "Goedenavond"]
  }, $ = f[u] ?? f.en, L = `${d >= 18 ? $[3] : d >= 12 ? $[2] : d >= 5 ? $[1] : $[0]}, ${e.hass.user?.name || "Home"}!`;
  return e.actionSurface(`ulm-scenes ${a ? "welcome-scenes" : r ? "source-scene-grid" : "scene-pills"} ${e.descriptor.upstreamId === "card_scenes" ? "ulm-source-scenes" : ""}`, c`
    ${a ? c`
      <div class="welcome-toolbar">
        <button class="welcome-toolbar-button" aria-label="Toggle scenes" @pointerdown=${(k) => k.stopPropagation()} @click=${(k) => {
    k.stopPropagation(), e.config.collapse_entity && e.service("input_boolean", "toggle", { entity_id: e.config.collapse_entity });
  }}><ha-icon .icon=${s ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon></button>
        <span class="welcome-date"><ha-icon .icon=${b}></ha-icon>${new Intl.DateTimeFormat(e.hass.language, { month: "short", day: "numeric" }).format(/* @__PURE__ */ new Date())}</span>
        <button class="welcome-toolbar-button" aria-label="Open dashboard settings" @pointerdown=${(k) => k.stopPropagation()} @click=${(k) => U(k, e, { action: "navigate", navigation_path: String(e.config.settings_path || "/config/dashboard") })}><ha-icon icon="mdi:cog-outline"></ha-icon></button>
      </div>
      <div class="welcome-heading">${V(e, L)}</div>
      ${s ? h : c`
        <div class="welcome-scenes-heading">
          <b>${e.config.secondary || "Scenes"}</b>
          ${n ? c`
            <button class="welcome-scenes-more"
              aria-label=${e.sceneOverflowExpanded ? "Show fewer scenes" : "Show all scenes"}
              aria-expanded=${e.sceneOverflowExpanded ? "true" : "false"}
              @pointerdown=${(k) => k.stopPropagation()}
              @click=${(k) => {
    k.stopPropagation(), e.toggleSceneOverflow();
  }}>
              <ha-icon .icon=${e.sceneOverflowExpanded ? "mdi:close" : "mdi:dots-vertical"}></ha-icon>
            </button>
          ` : h}
        </div>
      `}
    ` : h}
    ${s ? h : c`<div class="scene-grid">${i.map((k) => {
    const F = e.hass.states[k.entity], Q = k.active_state ? F?.state === k.active_state : k.state ? F?.state === k.state : Z.has(F?.state ?? ""), X = R(k.color, "rgb(var(--ulm-purple))"), J = k.icon_type === "entity-picture" ? v(F, "entity_picture") : void 0;
    return c`
      <button @pointerdown=${(G) => G.stopPropagation()} @click=${(G) => {
      if (G.stopPropagation(), r && !k.tap_action) {
        const ee = k.entity.split(".", 1)[0];
        e.service(
          ee === "automation" ? "automation" : "homeassistant",
          ee === "automation" ? "trigger" : "turn_on",
          { entity_id: k.entity }
        );
      } else
        zr(G, e, k);
    }} style=${`--item-color:${X}`} class="scene-button ${Q ? "is-active" : ""}">
        <i>${J ? c`<span class="scene-entity-picture" style=${`background-image:url("${String(J)}")`}></span>` : c`<ha-icon .icon=${k.icon || F?.attributes.icon || "mdi:palette"}></ha-icon>`}</i>
        <span>${k.name || k.label || H({ entity: k.entity }, F, e.hass)}</span>
      </button>`;
  })}</div>`}
  `);
}, At = (e) => {
  const t = p(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : v(e.entity, "entity_picture"), a = "mdi:sony-playstation", r = p(e, "ulm_card_media_player_player_controls_entity") || e.config.entity, o = r ? e.hass.states[r] : e.entity, n = r?.startsWith("media_player.") === !0, i = p(e, "ulm_card_media_player_collapsible") === !0 && (["off", "standby"].includes(e.entity?.state ?? "") || p(e, "ulm_card_media_player_idle_off") === !0 && e.entity?.state === "idle"), l = !i && (e.config.show_controls === !0 || p(e, "ulm_card_media_player_enable_controls") === !0), s = p(e, "ulm_card_media_player_enable_volume_adjust") || (v(o, "device_class") === "speaker" ? 0.05 : v(o, "device_class") === "tv" ? 0.01 : 0.025), _ = Number(v(o, "volume_level") ?? 0), g = { action: "more-info" }, b = Z.has(e.entity?.state ?? ""), d = R(
    p(e, "ulm_card_media_player_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface(`ulm-media ${t ? "has-art" : ""} ${i ? "is-collapsed" : ""}`, c`
    ${t ? c`<span class="media-art" style=${`background-image:url("${String(t)}")`}></span>` : h}
    <div class="media-summary">
      ${Se(e, Te(e, e.descriptor.upstreamId === "custom_card_playstation" ? a : "mdi:speaker"), d, b)}
      ${V(e, p(e, "ulm_card_media_player_more_info") === !0 ? [v(e.entity, "media_artist"), v(e.entity, "media_album_name")].filter(Boolean).join(" · ") || w(e.entity) : String(v(e.entity, "media_album_name") ?? v(e.entity, "media_artist") ?? w(e.entity)))}
    </div>
    ${p(e, "ulm_card_media_player_power_button") === !0 ? c`
      <div class="media-power">${T("Toggle power", "mdi:power", (u) => {
    u.stopPropagation(), e.service("homeassistant", "toggle", { entity_id: e.config.entity });
  })}</div>
    ` : h}
    ${n && l ? c`<div class="ulm-controls media-controls">
      ${T("Previous", "mdi:skip-previous", (u) => {
    u.stopPropagation(), e.service("media_player", "media_previous_track", { entity_id: r });
  })}
      ${T(e.entity?.state === "playing" ? "Pause" : "Play", e.entity?.state === "playing" ? "mdi:pause" : "mdi:play", (u) => {
    u.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: r });
  })}
      ${T("Next", "mdi:skip-next", (u) => {
    u.stopPropagation(), e.service("media_player", "media_next_track", { entity_id: r });
  })}
      ${T("Sources", "mdi:playlist-music", (u) => U(u, e, g, r))}
    </div>` : h}
    ${n && !i && p(e, "ulm_card_media_player_enable_volume_slider") === !0 ? c`
      <input class="ulm-slider" type="range" min="0" max="100"
        aria-label="Volume"
        .value=${String(Math.round(_ * 100))}
        @pointerdown=${(u) => u.stopPropagation()}
        @change=${(u) => e.service("media_player", "volume_set", {
    entity_id: r,
    volume_level: Number(u.target.value) / 100
  })}>
    ` : h}
    ${n && !i && p(e, "ulm_card_media_player_enable_volume_buttons") === !0 ? c`
      <div class="ulm-controls media-volume-buttons">
        ${T("Mute or unmute", "mdi:volume-mute", (u) => {
    u.stopPropagation(), e.service("media_player", "volume_mute", {
      entity_id: r,
      is_volume_muted: v(o, "is_volume_muted") !== !0
    });
  })}
        ${T("Volume down", "mdi:volume-minus", (u) => {
    u.stopPropagation(), e.service("media_player", "volume_set", {
      entity_id: r,
      volume_level: Math.max(0, _ - s)
    });
  })}
        ${T("Volume up", "mdi:volume-plus", (u) => {
    u.stopPropagation(), e.service("media_player", "volume_set", {
      entity_id: r,
      volume_level: Math.min(1, _ + s)
    });
  })}
      </div>
    ` : h}
  `);
}, Mr = (e) => {
  const t = e.entity?.state.startsWith("armed") || e.entity?.state === "locked";
  return e.actionSurface(`ulm-security ${t ? "is-armed" : ""}`, c`
    ${N(e, t ? "mdi:shield-lock" : "mdi:shield-off", t ? "green" : "red")}
    ${V(e, w(e.entity))}
    ${e.config.show_controls ? c`<span class="security-status">${t ? "Secured" : "Attention"}</span>` : h}
  `);
}, Dr = (e) => e.actionSurface("ulm-navigation", c`
  ${N(e, e.descriptor.upstreamId.includes("back") ? "mdi:arrow-left" : "mdi:arrow-right", "blue")}
  ${V(e, e.config.secondary || e.config.navigation_path || "Navigate")}
  <ha-icon icon="mdi:chevron-right"></ha-icon>
`), Or = (e, t) => {
  const a = e?.split(".", 1)[0] ?? "homeassistant";
  return a === "script" ? ["script", t === "on" ? "turn_on" : "turn_off"] : a === "fan" ? ["fan", t === "on" ? "turn_on" : "turn_off"] : a === "water_heater" ? ["water_heater", t === "on" ? "turn_on" : "turn_off"] : [a === "input_boolean" ? "input_boolean" : "homeassistant", t === "on" ? "turn_on" : "turn_off"];
}, Tr = (e) => {
  const t = p(
    e,
    "ulm_custom_card_washer_power",
    "ulm_card_power_outlet_entity",
    "ulm_card_power_entity"
  ), a = e.config.entity?.split(".", 1)[0], r = t || (["switch", "input_boolean", "light", "fan", "script", "water_heater"].includes(a ?? "") ? e.config.entity : void 0), o = r ? e.hass.states[r] : void 0, n = Z.has(o?.state ?? e.entity?.state ?? ""), i = A(e, "graph_entity"), [l, s] = Or(r, n ? "off" : "on");
  return e.actionSurface(`ulm-control-card ulm-row ${n ? "is-active" : ""}`, c`
    ${N(e, e.config.entity?.startsWith("fan.") ? "mdi:fan" : "mdi:power-socket-eu", n ? "yellow" : "grey")}
    ${V(e, i ? `${w(e.entity)} · ${w(i)}` : w(e.entity))}
    ${r && e.config.show_controls !== !1 ? T(n ? "Turn off" : "Turn on", "mdi:power", (_) => {
    _.stopPropagation(), e.service(l, s, { entity_id: r });
  }) : h}
  `);
}, ye = /* @__PURE__ */ new WeakMap(), Ie = /* @__PURE__ */ new WeakSet(), Vt = (e, t, a, r) => {
  const o = r === "tap" ? a.tap_action ?? { action: "toggle" } : a.hold_action ?? { action: "more-info" };
  ie(e, "hass-action", {
    config: { type: t.config.type, entity: a.entity, tap_action: o },
    action: "tap"
  });
}, Lr = (e) => {
  const t = (e.config.room_sensors?.length ? e.config.room_sensors : (e.config.entities ?? []).map((l) => ({ entity: l }))).filter((l) => l.entity).slice(0, 4), a = e.config.label_use_temperature ?? p(e, "label_use_temperature") ?? !0, r = e.config.label_use_brightness ?? p(e, "label_use_brightness") ?? !1, o = S(v(e.entity, "brightness")), n = v(e.entity, "current_temperature") ?? v(e.entity, "temperature") ?? v(e.entity, "device_temperature") ?? e.entity?.state ?? "—", i = a ? `${String(n)}${String(v(e.entity, "unit_of_measurement") ?? "°C")}` : r && e.entity?.state === "on" && o !== void 0 ? `${Math.round(o / 2.55)}%` : w(e.entity);
  return e.actionSurface(`ulm-room ulm-source-room ${e.entity?.state === "unavailable" ? "is-unavailable" : ""}`, c`
    <div class="room-main">
      <span class="room-copy">${V(e, i)}</span>
      <span class="ulm-icon tone-blue"><ha-icon .icon=${e.config.icon || "mdi:sofa-single"}></ha-icon></span>
      ${e.entity?.state === "unavailable" ? c`<span class="room-unavailable"><ha-icon icon="mdi:exclamation"></ha-icon></span>` : h}
    </div>
    ${t.length ? c`<div class="room-entities">${t.map((l) => {
    const s = e.hass.states[l.entity], _ = s?.state === (l.active_state || "on"), g = R(l.color, "rgb(var(--ulm-blue))"), b = l.icon_type === "entity-picture" ? v(s, "entity_picture") : void 0;
    return c`<button
        class="metric-pill room-sensor ${_ ? "is-active" : ""}"
        style=${`--item-color:${g}`}
        aria-label=${l.name || l.label || H({ entity: l.entity }, s, e.hass)}
        @pointerdown=${(d) => {
      d.stopPropagation();
      const u = d.currentTarget;
      Ie.delete(u), ye.set(u, window.setTimeout(() => {
        Ie.add(u), Vt(u, e, l, "hold");
      }, 500));
    }}
        @pointerup=${(d) => {
      d.stopPropagation();
      const u = d.currentTarget, f = ye.get(u);
      f && window.clearTimeout(f), ye.delete(u);
    }}
        @pointercancel=${(d) => {
      const u = d.currentTarget, f = ye.get(u);
      f && window.clearTimeout(f), ye.delete(u);
    }}
        @click=${(d) => {
      const u = d.currentTarget;
      if (Ie.has(u)) {
        Ie.delete(u), d.stopPropagation();
        return;
      }
      d.stopPropagation(), Vt(u, e, l, "tap");
    }}
      >${b ? c`<span class="room-sensor-picture" style=${`background-image:url("${String(b)}")`}></span>` : c`<ha-icon .icon=${l.icon || s?.attributes.icon || "mdi:circle-small"}></ha-icon>`}<span>${l.name || l.label || w(s)}</span></button>`;
  })}</div>` : h}
  `);
}, Nr = (e) => {
  const t = String(e ?? "").trim(), a = t.match(/^(\d+(?:\.\d+)?)\s*(?::|\/|x)\s*(\d+(?:\.\d+)?)$/i);
  return a ? `${a[1]} / ${a[2]}` : /^\d+(?:\.\d+)?$/.test(t) ? t : "16 / 9";
}, jr = (e) => {
  const t = v(e.entity, "entity_picture") || (e.entity?.entity_id.startsWith("camera.") ? `/api/camera_proxy/${e.entity.entity_id}` : void 0), a = p(e, "ulm_custom_card_camera_name"), r = p(e, "ulm_custom_card_camera_label"), o = Qt(e, r || w(e.entity)), n = o.primary || (e.config.primary_info === void 0 ? a || H(e.config, e.entity, e.hass) : void 0), i = o.secondary, l = Nr(
    e.config.aspect_ratio ?? p(e, "ulm_custom_card_camera_aspect_ratio")
  ), s = S(e.config.image_height), _ = e.config.fit_mode ?? "cover", g = e.config.camera_view === "live" && e.entity?.entity_id.startsWith("camera."), b = s ? `height:${Math.max(80, s)}px` : `aspect-ratio:${l}`;
  return e.actionSurface("ulm-camera", c`
    <div class="camera-media" style=${b}>
      ${g ? c`<ha-camera-stream .hass=${e.hass} .stateObj=${e.entity}></ha-camera-stream>` : t ? c`<img src=${String(t)} alt=${n} width="1600" height="900"
          loading="lazy" style=${`object-fit:${_}`}>` : c`
      <div class="camera-placeholder">${N(e, "mdi:camera", "blue")}</div>
      `}
      ${n || i ? c`<div class="camera-overlay shared-presentation">
        ${n ? c`<b class="ulm-name">${n}</b>` : h}
        ${i ? c`<span class="ulm-label">${i}</span>` : h}
      </div>` : h}
    </div>
  `);
}, Qe = (e) => {
  const t = Object.entries(e.config).filter(([a, r]) => typeof r == "string" && r !== e.config.entity && /(_entity|_entity_id|_sensor|_power|_status|_level|_date|_time)$/i.test(a)).map(([, a]) => a);
  return [.../* @__PURE__ */ new Set([...e.config.entities ?? [], ...t])].map((a) => e.hass.states[a]).filter((a) => !!a).slice(0, 6);
}, Fr = (e, t, a = "blue") => {
  const r = Qe(e);
  return e.actionSurface("ulm-detail-card", c`
    <div class="ulm-row">
      ${N(e, t, a)}
      ${V(e, w(e.entity))}
    </div>
    ${r.length ? c`<div class="detail-grid">${r.map((o) => c`
      <span class="metric-pill"><ha-icon .icon=${o.attributes.icon ?? "mdi:circle-small"}></ha-icon>${w(o)}</span>
    `)}</div>` : h}
  `);
}, Ur = (e) => {
  const t = Qe(e);
  return e.actionSurface("ulm-schedule-card", c`
    <div class="ulm-row">
      ${N(e, /pollen/.test(e.descriptor.upstreamId) ? "mdi:flower-pollen" : "mdi:trash-can", "green")}
      ${V(e, w(e.entity))}
    </div>
    <div class="schedule-list">${(t.length ? t : e.entity ? [e.entity] : []).slice(0, 4).map((a) => c`
      <span><b>${H({ entity: a.entity_id }, a, e.hass)}</b><small>${w(a)}</small></span>
    `)}</div>
  `);
}, Br = (e) => {
  const t = S(e.entity?.state), a = Qe(e);
  return e.actionSurface("ulm-device-status", c`
    <div class="ulm-row">
      ${N(e, /printer/.test(e.descriptor.upstreamId) ? "mdi:printer" : /nas/.test(e.descriptor.upstreamId) ? "mdi:nas" : /washer/.test(e.descriptor.upstreamId) ? "mdi:washing-machine" : "mdi:devices", t !== void 0 && t < 20 ? "red" : "blue")}
      ${V(e, w(e.entity))}
      ${t !== void 0 ? c`<b class="device-value">${Math.round(t)}${String(e.entity?.attributes.unit_of_measurement ?? "")}</b>` : h}
    </div>
    ${t !== void 0 ? c`<span class="device-progress"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>` : h}
    ${a.length ? c`<div class="detail-grid">${a.map((r) => c`<span class="metric-pill">${w(r)}</span>`)}</div>` : h}
  `);
}, Rr = (e) => {
  const t = S(e.entity?.state) ?? 0, a = p(e, "ulm_card_gauge_min", "ulm_custom_card_gauge_min") ?? 0, r = p(e, "ulm_card_gauge_max", "ulm_custom_card_gauge_max") ?? 100, o = Math.max(0, Math.min(100, (t - a) / Math.max(1, r - a) * 100));
  return e.actionSurface("ulm-gauge-card", c`
    <span class="gauge-ring" style=${`--gauge:${o * 3.6}deg`}><b>${w(e.entity)}</b></span>
    ${V(e, `${a} – ${r}`)}
  `);
}, Hr = (e) => {
  const t = A(e, "datetime_entity");
  return e.actionSurface(`ulm-control-card ulm-row ${Z.has(e.entity?.state ?? "") ? "is-active" : ""}`, c`
    ${N(e, "mdi:alarm", Z.has(e.entity?.state ?? "") ? "yellow" : "grey")}
    ${V(e, w(t || e.entity))}
    ${e.config.show_controls !== !1 ? T(Z.has(e.entity?.state ?? "") ? "Disable alarm" : "Enable alarm", "mdi:power", (a) => {
    a.stopPropagation(), e.service("input_boolean", Z.has(e.entity?.state ?? "") ? "turn_off" : "turn_on", { entity_id: e.config.entity });
  }) : h}
  `);
}, C = (e, ...t) => {
  const a = p(e, ...t), r = typeof a == "string" ? a : a && typeof a == "object" && "entity_id" in a && typeof a.entity_id == "string" ? a.entity_id : void 0;
  return r ? e.hass.states[r] : void 0;
}, Wr = (e) => {
  const t = ne(e.config).filter((l) => l.enabled !== !1 && l.entity), a = /* @__PURE__ */ new Set([
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
  ]), r = (l, s) => {
    if (s !== !0 || !l) return;
    const _ = e.hass.states[l]?.state?.trim();
    if (!_ || a.has(_.toLowerCase())) return;
    const g = _.replaceAll("_", " ").replace(/\s+/g, " ");
    return g.charAt(0).toLocaleUpperCase(e.hass.language) + g.slice(1);
  }, o = r(e.config.today_entity, e.config.show_today), n = r(e.config.tomorrow_entity, e.config.show_tomorrow), i = (l) => {
    if (!l || ["unknown", "unavailable", "none", "geen"].includes(l.state.toLowerCase())) return "—";
    if (l.entity_id.startsWith("calendar.")) {
      const s = v(l, "start_time") ?? v(l, "start") ?? v(l, "end_time");
      if (typeof s == "string") {
        const _ = new Date(s);
        if (!Number.isNaN(_.getTime()))
          return new Intl.DateTimeFormat(e.hass.language, { day: "2-digit", month: "2-digit", year: "numeric" }).format(_);
      }
    }
    return l.state;
  };
  return e.actionSurface("custom-waste-card", c`
    <div class="custom-card-heading">
      ${N(e, "mdi:trash-can-outline", "green")}
      ${V(e, p(e, "ulm_volgende_ophaling") || [o ? `Today: ${o}` : "", n ? `Tomorrow: ${n}` : ""].filter(Boolean).join(" · ") || void 0, "Next collections")}
    </div>
    <div class="waste-grid">${t.map((l) => {
    const s = l.entity ? e.hass.states[l.entity] : void 0;
    return c`<span class="waste-row" style=${`--waste-color:${R(l.color, "rgb(var(--rgb-green, 76, 175, 80))")}`}>
        <ha-icon .icon=${l.icon || "mdi:trash-can"}></ha-icon>
        <b>${l.label || s?.attributes.friendly_name || l.entity}</b>
        <small>${i(s)}</small>
      </span>`;
  })}</div>
  `);
}, qr = (e) => {
  const t = C(e, "ulm_card_alarm_time_datetime") ?? A(e, "datetime_entity"), a = S(p(e, "ulm_card_alarm_time_step")) ?? 15, r = t?.state || "00:00:00", [o, n] = r.split(":").map(Number), i = (b) => {
    const d = ((o || 0) * 60 + (n || 0) + b + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: t?.entity_id,
      time: `${String(Math.floor(d / 60)).padStart(2, "0")}:${String(d % 60).padStart(2, "0")}:00`
    });
  }, l = !t || ["unknown", "unavailable"].includes(t.state.toLowerCase()), s = p(e, "ulm_card_alarm_time_collapse") === !0 && !Z.has(e.entity?.state ?? ""), _ = Z.has(e.entity?.state ?? ""), g = R(
    p(e, "ulm_card_alarm_time_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface(`custom-alarm-time ${p(e, "ulm_card_alarm_time_horizontal") ? "is-horizontal" : ""}`, c`
    <div class="custom-card-heading">
      ${Se(e, p(e, "ulm_card_alarm_time_icon") || "mdi:alarm", g, _)}
      ${V(e, w(e.entity))}
    </div>
    ${s ? h : c`<div class="alarm-time-controls">
      ${T(`Earlier by ${a} minutes`, "mdi:minus", (b) => {
    b.stopPropagation(), i(-a);
  }, l)}
      <b>${r.slice(0, 5)}</b>
      ${T(`Later by ${a} minutes`, "mdi:plus", (b) => {
    b.stopPropagation(), i(a);
  }, l)}
    </div>`}
  `);
}, Ne = (e, t) => {
  const a = v(t, "entity_id");
  return Array.isArray(a) ? a.map(String).map((r) => e.hass.states[r]).filter((r) => !!r) : t ? [t] : [];
}, Gr = (e) => {
  const t = (d) => C(e, d), a = t("temperature"), r = t("humidity"), o = {
    doors: t("group_doors"),
    windows: t("group_windows"),
    motions: t("group_motions"),
    water: t("group_water"),
    lights: t("group_lights"),
    shutters: t("group_windows_shutters"),
    outlets: t("group_outlets"),
    tv: t("group_tv")
  }, n = Object.values(o).flatMap((d) => Ne(e, d)).filter((d) => (S(v(d, "battery")) ?? 101) <= 20), i = Object.values(o).flatMap((d) => Ne(e, d)).filter((d) => d.state === "unavailable"), l = (d) => Ne(e, d).filter((u) => u.state === "on" || u.state === "open").length, s = (d, u) => {
    u && U(d, e, { action: "more-info" }, u.entity_id);
  }, _ = (d, u) => {
    u && u.state !== "unavailable" && U(d, e, { action: "toggle" }, u.entity_id);
  }, g = [
    [o.doors, "mdi:door-open"],
    [o.windows, "mdi:window-open-variant"],
    [o.motions, "mdi:motion-sensor"],
    [o.water, "mdi:water"]
  ], b = [
    [o.lights, o.lights?.state === "on" ? "mdi:lightbulb-group" : "mdi:lightbulb-group-off"],
    [o.shutters, o.shutters?.state === "on" ? "mdi:window-shutter-open" : "mdi:window-shutter"],
    [o.outlets, o.outlets?.state === "on" ? "mdi:power-plug" : "mdi:power-plug-off"],
    [o.tv, o.tv?.state === "on" ? "mdi:television" : "mdi:television-off"]
  ];
  return e.actionSurface("custom-room-view", c`
    <div class="room-view-summary" @click=${(d) => s(d, a ?? r)}>
      <span class="room-view-icon"><ha-icon .icon=${e.config.icon || "mdi:home-variant-outline"}></ha-icon>${i.length ? c`<i>${i.length}</i>` : h}</span>
      <span><b><ha-icon icon="mdi:thermometer"></ha-icon>${w(a)}</b><small><ha-icon icon="mdi:water-percent"></ha-icon>${w(r)}</small></span>
    </div>
    <div class="room-view-status">
      ${g.map(([d, u]) => d && l(d) ? c`<button aria-label=${H({ entity: d.entity_id }, d, e.hass)} @pointerdown=${(f) => f.stopPropagation()} @click=${(f) => s(f, d)}><ha-icon .icon=${u}></ha-icon>${l(d) > 1 ? c`<i>${l(d)}</i>` : h}</button>` : h)}
      ${n.length ? c`<button aria-label="Low batteries" @pointerdown=${(d) => d.stopPropagation()} @click=${(d) => s(d, n[0])}><ha-icon icon="mdi:battery-20"></ha-icon><i>${n.length}</i></button>` : h}
      ${!g.some(([d]) => l(d)) && !n.length ? c`<span class="room-view-clear"><ha-icon icon="mdi:check"></ha-icon></span>` : h}
    </div>
    <div class="room-view-actions">
      ${b.map(([d, u]) => d ? c`
        <button class=${d.state === "on" ? "is-active" : ""} aria-label=${H({ entity: d.entity_id }, d, e.hass)}
          ?disabled=${d.state === "unavailable"} @pointerdown=${(f) => f.stopPropagation()}
          @dblclick=${(f) => _(f, d)} @click=${(f) => f.stopPropagation()}>
          <ha-icon .icon=${d.state === "unavailable" ? "mdi:exclamation-thick" : u}></ha-icon>
          ${l(d) ? c`<i>${l(d)}</i>` : h}
        </button>` : h)}
    </div>
  `);
}, Kr = (e) => {
  const t = C(e, "ulm_card_welcome_collapse"), a = C(e, "ulm_weather"), r = t?.state === "on", o = Array.from({ length: 5 }, (n, i) => i + 1).map((n) => ({
    nav: p(e, `nav_${n}`),
    icon: p(e, `icon_${n}`) || "mdi:circle",
    name: p(e, `name_${n}`) || `Item ${n}`,
    color: p(e, `color_${n}`) || "blue"
  })).filter((n) => n.nav);
  return e.actionSurface("custom-welcome", c`
    <div class="welcome-toolbar">
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
    a && U(n, e, { action: "more-info" }, a.entity_id);
  }}>
        <ha-icon icon="mdi:thermometer"></ha-icon>
      </button>
      <button aria-label="Dashboard settings" @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => U(n, e, { action: "navigate", navigation_path: "/config/dashboard" })}>
        <ha-icon icon="mdi:cog-outline"></ha-icon>
      </button>
    </div>
    <div class="welcome-greeting">${V(e, `Good ${(/* @__PURE__ */ new Date()).getHours() < 12 ? "morning" : (/* @__PURE__ */ new Date()).getHours() < 18 ? "afternoon" : "evening"}`)}</div>
    ${r ? h : c`<div class="welcome-items">${o.map((n) => c`
      <button class="tone-${n.color}" aria-label=${n.name}
        @pointerdown=${(i) => i.stopPropagation()}
        @click=${(i) => U(i, e, { action: "navigate", navigation_path: n.nav })}>
        <i><ha-icon .icon=${n.icon}></ha-icon></i><small>${n.name}</small>
      </button>
    `)}</div>`}
  `);
}, Jr = (e) => {
  const t = C(e, "ulm_custom_card_room_overview_light_entity"), a = C(e, "ulm_custom_card_room_overview_climate_entity"), r = C(e, "ulm_custom_card_room_overview_cover_entity"), o = t?.state === "on", n = S(v(t, "brightness")), i = e.config.secondary || (t ? o && n ? `${Math.round(n / 2.55)}%` : w(t) : w(e.entity)), l = v(t, "rgb_color"), s = p(e, "ulm_card_dynamic_color") === !0 && o && Array.isArray(l), _ = (b, d) => {
    d && U(b, e, { action: "toggle" }, d.entity_id);
  }, g = (b, d) => {
    const u = d === "light" ? p(e, o ? "ulm_card_room_overview_light_icon_on" : "ulm_card_room_overview_light_icon_off") || (o ? "mdi:lightbulb" : "mdi:lightbulb-off") : d === "cover" ? p(e, b.state === "closed" ? "ulm_card_room_overview_cover_icon_closed" : "ulm_card_room_overview_cover_icon_open") || (b.state === "closed" ? "mdi:roller-shade-closed" : "mdi:blinds-open") : { auto: "mdi:autorenew", cool: "mdi:snowflake", heat: "mdi:fire", dry: "mdi:water", heat_cool: "mdi:sun-snowflake", fan_only: "mdi:fan", off: "mdi:snowflake-off" }[b.state] ?? "mdi:thermostat";
    return c`<button class="room-overview-control ${d} state-${b.state}" aria-label=${H({ entity: b.entity_id }, b, e.hass)}
      ?disabled=${b.state === "unavailable"} @pointerdown=${(f) => f.stopPropagation()} @click=${(f) => _(f, b)}>
      <ha-icon .icon=${u}></ha-icon>
    </button>`;
  };
  return e.actionSurface(`custom-room-overview ${o ? "light-on" : ""} ${s ? "dynamic-color" : ""}`, c`
    <div class="room-overview-main" style=${s ? `--room-rgb:${l.slice(0, 3).join(",")};` : ""}>
      ${N(e, "mdi:sofa", o ? "yellow" : "grey")}
      ${V(e, i)}
    </div>
    <div class="room-overview-controls">
      ${t ? g(t, "light") : h}
      ${r ? g(r, "cover") : a ? g(a, "climate") : h}
    </div>
  `);
}, Yr = (e) => {
  const t = C(e, "power_entity") ?? C(e, "ulm_custom_card_washer_power"), a = C(e, "ulm_custom_card_washer_machine_state") ?? e.entity, r = C(e, "ulm_custom_card_washer_job_progress"), o = C(e, "ulm_custom_card_washer_job_state") ?? e.entity, n = C(e, "ulm_custom_card_washer_remote_control"), i = C(e, "ulm_custom_card_washer_delayed_start"), l = C(e, "ulm_custom_card_washer_delayed_starttime"), s = C(e, "door_entity"), _ = C(e, "finished_entity"), g = p(e, "ulm_custom_card_washer_machine_stop_state") ?? "stop", b = t ? !["off", "unavailable", "unknown", "0"].includes(t.state.toLowerCase()) : a ? !["off", "unavailable", "unknown"].includes(a.state.toLowerCase()) : !0, d = !a || a.state === g || a.state === "off", u = ["true", "on", "enabled"].includes(n?.state.toLowerCase() ?? ""), f = i?.state === "on", $ = Math.max(0, Math.min(100, S(r?.state) ?? 0)), D = p(
    e,
    "ulm_custom_card_washer_job_states"
  ), L = Object.values(D ?? {
    state1: { name: "weightSensing", icon: "mdi:scale" },
    state2: { name: "wash", icon: "mdi:waves" },
    state3: { name: "rinse", icon: "mdi:water" },
    state4: { name: "spin", icon: "mdi:fan" }
  }).filter((y) => y.name && y.icon).slice(0, 5), k = L.findIndex((y) => y.name?.toLowerCase() === o?.state.toLowerCase()), F = b ? d ? u && f ? p(e, "ulm_custom_card_washer_label_configuring") ?? "configure" : p(e, "ulm_custom_card_washer_label_idle") ?? "idle" : p(e, "ulm_custom_card_washer_label_running") ?? "run" : p(e, "ulm_custom_card_washer_label_idle") ?? "idle", Q = (y) => p(e, y) ?? { action: "none" }, X = (y, I) => U(y, e, I, typeof I.entity == "string" ? I.entity : e.config.entity), J = l?.state.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)?.slice(1).map(Number), G = (y, I) => {
    if (y.stopPropagation(), !l || !J) return;
    const O = ((J[0] * 60 + J[1] + I) % 1440 + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: l.entity_id,
      time: `${String(Math.floor(O / 60)).padStart(2, "0")}:${String(O % 60).padStart(2, "0")}:00`
    });
  }, ee = Q(d ? "ulm_custom_card_washer_start_action" : "ulm_custom_card_washer_pause_action"), ae = Q("ulm_custom_card_washer_stop_action");
  return e.actionSurface("custom-washer", c`
    <div class="custom-card-heading washer-heading">
      ${N(e, "mdi:washing-machine", b ? "blue" : "grey")}
      ${V(e, F)}
      ${t ? c`<b class="washer-power">${w(t)}</b>` : h}
    </div>
    ${b && L.length ? c`
      <div class="washer-stages" style=${`--washer-stage-count:${L.length}`}>
        ${L.map((y, I) => c`
          <span class=${k === I ? "is-active" : ""} title=${y.name ?? ""}>
            <ha-icon .icon=${y.icon}></ha-icon>
          </span>
        `)}
      </div>
    ` : h}
    ${b && r ? c`
      <div class="washer-progress">
        <span style=${`width:${$}%`}></span>
        <b>${Math.round($)}%</b>
      </div>
    ` : h}
    ${b && u ? c`
      <div class="washer-controls">
        ${T(
    d ? "Start washer" : "Pause washer",
    d ? "mdi:play" : "mdi:pause",
    (y) => X(y, ee),
    ee.action === "none"
  )}
        ${T(
    "Stop washer",
    "mdi:stop",
    (y) => X(y, ae),
    d || ae.action === "none"
  )}
        ${i ? T(
    f ? "Disable delayed start" : "Enable delayed start",
    "mdi:alarm",
    (y) => U(y, e, { action: "toggle" }, i.entity_id),
    !d
  ) : h}
      </div>
    ` : h}
    ${b && u && f && l ? c`
      <div class="washer-delay-controls">
        ${T("Move delayed start 15 minutes earlier", "mdi:arrow-down", (y) => G(y, -15))}
        <button class="washer-delay-time" aria-label="Move delayed start 1 minute later"
          @pointerdown=${(y) => y.stopPropagation()}
          @click=${(y) => G(y, 1)}>${l.state}</button>
        ${T("Move delayed start 15 minutes later", "mdi:arrow-up", (y) => G(y, 15))}
      </div>
    ` : h}
    ${s || _ || n ? c`
      <div class="washer-status">
        ${s ? c`<span><ha-icon icon="mdi:door"></ha-icon>${w(s)}</span>` : h}
        ${_ ? c`<span><ha-icon icon="mdi:check-circle"></ha-icon>${w(_)}</span>` : h}
        ${n ? c`<span><ha-icon icon="mdi:remote"></ha-icon>${w(n)}</span>` : h}
      </div>
    ` : h}
  `);
}, Zr = (e) => {
  const t = v(e.entity, "next_rising"), a = v(e.entity, "next_setting"), r = v(e.entity, "next_dawn") ?? t, o = v(e.entity, "next_noon"), n = v(e.entity, "next_dusk") ?? a, i = p(e, "language") || e.hass.language || "en", l = p(e, "timeFormat") === "12h", s = (u) => {
    const f = new Date(String(u ?? ""));
    return Number.isNaN(f.getTime()) ? "—" : new Intl.DateTimeFormat(i, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: l
    }).format(f);
  }, _ = e.entity?.state === "above_horizon", g = S(v(e.entity, "elevation")), b = S(v(e.entity, "azimuth")), d = p(e, "title");
  return e.actionSurface(`custom-sun-card ${p(e, "darkMode") ? "is-dark" : ""}`, c`
    ${d ? c`<b class="sun-title">${d}</b>` : h}
    <div class="sun-times"><span><small>Sunrise</small><b>${s(t)}</b></span><span><small>Sunset</small><b>${s(a)}</b></span></div>
    <div class="sun-arc">
      <svg viewBox="0 0 300 90" preserveAspectRatio="none"><path class="sun-night" d="M0,62 Q60,115 105,62"></path><path class="sun-day" d="M0,62 Q150,-45 300,62"></path><line x1="0" y1="62" x2="300" y2="62"></line></svg>
      <span class="sun-marker" style=${_ ? "--sun-x:56.67%;--sun-y:20%" : "--sun-x:9.33%;--sun-y:77.78%"}></span>
    </div>
    <div class="sun-footer"><span><small>Dawn</small><b>${s(r)}</b></span><span><small>Solar noon</small><b>${s(o)}</b></span><span><small>Dusk</small><b>${s(n)}</b></span></div>
    ${p(e, "showAzimuth") || p(e, "showElevation") ? c`
      <div class="sun-position">
        ${p(e, "showAzimuth") ? c`<span>Azimuth <b>${b ?? "—"}°</b></span>` : h}
        ${p(e, "showElevation") ? c`<span>Elevation <b>${g ?? "—"}°</b></span>` : h}
      </div>
    ` : h}
  `);
}, Qr = (e) => {
  const t = !!(e.entity && !["unavailable", "unknown"].includes(e.entity.state)), r = (t ? e.entity.state : "00:00:00").split(" ").at(-1) || "00:00:00", [o, n] = r.split(":").map(Number), i = (l) => {
    const s = ((o || 0) * 60 + (n || 0) + l + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: e.config.entity,
      time: `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:00`
    });
  };
  return e.actionSurface("custom-input-datetime", c`
    <div class="custom-card-heading">${N(e, "mdi:calendar-clock", "green")}${V(e, w(e.entity))}</div>
    <div class="input-datetime-controls">
      ${T("15 minutes earlier", "mdi:arrow-down", (l) => {
    l.stopPropagation(), i(-15);
  }, !t)}
      ${Sr(
    "One minute later; hold for one minute earlier",
    c`<b>${t ? r.slice(0, 5) : "Unavailable"}</b>`,
    () => i(1),
    () => i(-1),
    !t
  )}
      ${T("15 minutes later", "mdi:arrow-up", (l) => {
    l.stopPropagation(), i(15);
  }, !t)}
    </div>
  `);
}, Xr = (e) => {
  const t = [1, 2, 3, 4].map((a) => C(e, `ulm_custom_card_entity_overview_entity_${a}`) ?? (e.config.entities?.[a - 1] ? e.hass.states[e.config.entities[a - 1]] : void 0));
  return e.actionSurface("custom-entity-overview", c`
    <div class="metrics-panel">
      <span class="metrics-main-name"><ha-icon .icon=${p(e, "ulm_custom_card_entity_overview_icon") || "mdi:alien"}></ha-icon>${V(e, w(e.entity))}</span>
      <b>${w(e.entity)}</b>
    </div>
    <div class="metrics-four">${t.map((a, r) => c`
      <button ?disabled=${!a} @pointerdown=${(o) => o.stopPropagation()}
        @click=${(o) => a && U(o, e, { action: "more-info" }, a.entity_id)}>
        <b>${w(a)}</b>
        <small>${p(e, `ulm_custom_card_entity_overview_name_${r + 1}`) || (a ? H({ entity: a.entity_id }, a, e.hass) : `Entity ${r + 1}`)}</small>
      </button>
    `)}</div>
  `);
}, eo = (e) => {
  const t = A(e, "download_entity") ?? C(e, "ulm_custom_card_internet_speed_download_speed_entity") ?? e.entity, a = A(e, "upload_entity") ?? C(e, "ulm_custom_card_internet_speed_upload_speed_entity"), r = A(e, "ping_entity") ?? C(e, "ulm_custom_card_internet_speed_ping_entity"), o = [t, a, r].filter((i) => !!i), n = R(
    p(e, "ulm_custom_card_internet_speed_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface("custom-internet-speed", c`
    <div class="speedtest-router">
      <span class="ulm-icon source-icon is-source-active" style=${`--source-color:${n}`}><ha-icon icon="mdi:wifi"></ha-icon></span>
      ${V(e, p(e, "ulm_custom_card_internet_speed_router_model") || "router_model")}
    </div>
    <button class="speedtest-action" ?disabled=${o.length !== 3}
      @pointerdown=${(i) => i.stopPropagation()} @click=${(i) => {
    i.stopPropagation(), e.service("homeassistant", "update_entity", { entity_id: o.map((l) => l.entity_id) });
  }}>
      <ha-icon icon="mdi:speedometer"></ha-icon>
      <span>${p(e, "ulm_custom_card_internet_speed_speedtest") || "Internet speed test"}</span>
      <ha-icon icon="mdi:chevron-right"></ha-icon>
    </button>
    <div class="speedtest-metrics">
      ${[
    [p(e, "ulm_custom_card_internet_speed_download") || "Download speed", t],
    [p(e, "ulm_custom_card_internet_speed_upload") || "Upload speed", a]
  ].map(([i, l]) => c`
        <button ?disabled=${!l} @pointerdown=${(s) => s.stopPropagation()}
          @click=${(s) => l && U(s, e, { action: "more-info" }, l.entity_id)}>
          <b><span>${l?.state ?? "—"}</span>${v(l, "unit_of_measurement") ? c`<em>${String(v(l, "unit_of_measurement"))}</em>` : h}</b>
          <small>${String(i)}</small>
        </button>
      `)}
    </div>
  `);
}, to = (e) => {
  const t = [1, 2, 3, 4].map((i) => C(e, `ulm_custom_card_weather_metrics_entity_${i}`) ?? (e.config.entities?.[i - 1] ? e.hass.states[e.config.entities[i - 1]] : void 0)), a = A(e, "temperature_entity"), r = A(e, "date_entity") ?? C(e, "ulm_custom_card_weather_metrics_date"), o = e.entity?.state || "unknown", n = {
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
      <b class="weather-date">${n[o] || "❔"} ${r ? w(r) : "Date unavailable"}</b>
      <strong>${a ? w(a) : `${v(e.entity, "temperature") ?? "—"}°`}</strong>
    </div>
    <div class="metrics-four">${t.map((i, l) => c`
      <button ?disabled=${!i} @pointerdown=${(s) => s.stopPropagation()}
        @click=${(s) => i && U(s, e, { action: "more-info" }, i.entity_id)}>
        <b>${w(i)}</b>
        <small>${p(e, `ulm_custom_card_weather_metrics_name_${l + 1}`) || (i ? H({ entity: i.entity_id }, i, e.hass) : `Weather ${l + 1}`)}</small>
      </button>
    `)}</div>
  `);
}, ao = (e) => {
  const t = !e.entity || e.entity.state === "unavailable", a = p(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : v(e.entity, "entity_picture"), r = Math.round((S(v(e.entity, "volume_level")) ?? 0) * 100), o = v(e.entity, "source"), n = ["idle", "paused", "unavailable"].includes(e.entity?.state ?? "") ? w(e.entity) : `${o ? String(o) : w(e.entity)} • ${r}%`, i = Je(e.hass, e.config.entity, e.config), l = Bt.flatMap((u) => {
    const f = i[u.configKey], $ = f ? e.hass.states[f] : void 0;
    return $ ? [{ control: u, entity: $ }] : [];
  }), s = Rt.flatMap((u) => {
    const f = i[u.configKey], $ = f ? e.hass.states[f] : void 0;
    return $ ? [{ control: u, entity: $ }] : [];
  }), _ = (e.config.shortcuts?.buttons ?? []).filter((u) => typeof u.id == "string" && u.id.trim().length > 0), g = Math.min(8, Math.max(1, Math.round(e.config.shortcuts?.columns ?? 4))), b = p(e, "sonos_details_always_visible") === !0, d = c`
    ${l.length ? c`<div class="sonos-switches">
      ${l.map(({ control: u, entity: f }) => c`
        <button class=${f.state === "on" ? "is-active" : ""} aria-pressed=${f.state === "on"}
          ?disabled=${f.state === "unavailable"}
          @click=${($) => {
    $.stopPropagation(), e.service("homeassistant", "toggle", { entity_id: f.entity_id });
  }}>
          <ha-icon .icon=${u.icon}></ha-icon>
          <span>${u.label}</span>
        </button>
      `)}
    </div>` : h}
    ${s.length ? c`<div class="sonos-sliders">
      ${s.map(({ control: u, entity: f }) => {
    const $ = S(f.state) ?? 0, D = S(v(f, "min")) ?? -100, L = S(v(f, "max")) ?? 100, k = S(v(f, "step")) ?? 1;
    return c`
          <label>
            <ha-icon .icon=${u.icon}></ha-icon>
            <span>${u.label}</span>
            <input type="range" min=${D} max=${L} step=${k} .value=${String($)}
              ?disabled=${f.state === "unavailable"}
              aria-label=${u.label}
              @change=${(F) => {
      F.stopPropagation(), e.service("number", "set_value", {
        entity_id: f.entity_id,
        value: Number(F.currentTarget.value)
      });
    }}>
            <output>${$}</output>
          </label>
        `;
  })}
    </div>` : h}
  `;
  return e.actionSurface(`custom-sonos ${a ? "has-art" : ""}`, c`
    ${a ? c`<span class="media-art" style=${`background-image:url("${String(a)}")`}></span>` : h}
    <div class="custom-card-heading">
      ${N(e, "mdi:speaker", e.entity?.state === "playing" ? "green" : "grey")}
      ${V(e, n)}
    </div>
    <div class="sonos-controls">
      ${T("Volume down", "mdi:volume-minus", (u) => {
    u.stopPropagation(), e.service("media_player", "volume_down", { entity_id: e.config.entity });
  }, t)}
      ${T("Play or pause", ["paused", "off"].includes(e.entity?.state ?? "") ? "mdi:play" : "mdi:pause", (u) => {
    u.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: e.config.entity });
  }, t)}
      ${T("Volume up", "mdi:volume-plus", (u) => {
    u.stopPropagation(), e.service("media_player", "volume_up", { entity_id: e.config.entity });
  }, t)}
    </div>
    ${l.length || s.length ? c`
      ${b ? c`<div class="sonos-details sonos-details-always-visible"
            @pointerdown=${(u) => u.stopPropagation()}
            @click=${(u) => u.stopPropagation()}>
            ${d}
          </div>` : c`<details class="sonos-details" @pointerdown=${(u) => u.stopPropagation()}
            @click=${(u) => u.stopPropagation()}>
            <summary>
              <span>More details</span>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </summary>
            ${d}
          </details>`}
    ` : h}
    ${_.length ? c`
      <div class="sonos-shortcuts" style=${`--sonos-shortcut-columns:${g}`}
        @pointerdown=${(u) => u.stopPropagation()}>
        ${_.map((u, f) => c`
          <button
            aria-label=${u.name || `Play shortcut ${f + 1}`}
            title=${u.name || u.id || ""}
            ?disabled=${t}
            @click=${($) => {
    $.stopPropagation(), e.service("media_player", "play_media", {
      entity_id: e.config.entity,
      media_content_type: u.type || "playlist",
      media_content_id: u.id
    });
  }}>
            <ha-icon .icon=${u.icon || "mdi:playlist-music"}></ha-icon>
            ${u.name ? c`<span>${u.name}</span>` : h}
          </button>
        `)}
      </div>
    ` : h}
  `);
}, ro = (e) => {
  const t = A(e, "power_entity"), a = A(e, "energy_entity"), r = A(e, "time_entity"), o = r ? (S(r.state) ?? 0) < 1 ? `${(S(r.state) ?? 0) * 100}Mins` : `${r.state}Hrs` : void 0, n = e.entity?.state === "on", i = n ? [
    t ? `${t.state}W` : void 0,
    a ? `${a.state}kWh` : void 0,
    o
  ].filter(Boolean).join(" • ") || w(e.entity) : a && (S(a.state) ?? 0) > 0 ? `${w(e.entity)} • ${a.state}kWh` : w(e.entity);
  return e.actionSurface("custom-more-power-outlet", c`
    ${N(e, "mdi:power-socket-eu", n ? "yellow" : "grey")}
    ${V(e, i || w(e.entity))}
  `);
}, oo = (e) => {
  const t = S(e.entity?.state) ?? 0, a = S(e.config.minimum) ?? 0, r = S(e.config.maximum) ?? 100, o = Math.max(0, Math.min(100, (t - a) / Math.max(1, r - a) * 100));
  return e.actionSurface("custom-dual-gauge", c`
    <div class="custom-card-heading">${N(e, "mdi:gauge", "blue")}${V(e, w(e.entity))}</div>
    <div class="dual-gauge" style=${`--gauge:${o * 1.8}deg`}>
      <i></i>
      ${a === 0 && r === 100 ? h : c`<span><small>${a} - ${r}</small></span>`}
    </div>
  `);
}, no = (e) => {
  const t = [
    A(e, "black_entity"),
    A(e, "yellow_entity"),
    A(e, "magenta_entity"),
    A(e, "cyan_entity")
  ], a = ["#111", "#faff00", "#f800ff", "#00ffff"];
  return e.actionSurface("custom-printer", c`
    <div class="custom-card-heading">
      ${N(e, "mdi:printer", e.entity?.state === "idle" ? "grey" : "blue")}
      ${V(e, w(e.entity))}
    </div>
    <div class="toner-bars">${t.map((r, o) => {
    if (!r) return h;
    const n = Math.max(0, Math.min(100, S(r.state) ?? 0));
    return c`<span style=${`--toner:${a[o]};--level:${n}%`}><i><em></em><b>${w(r)}</b></i></span>`;
  })}</div>
  `);
}, so = (e) => {
  const t = A(e, "disk_entity") ?? C(e, "entity_4"), a = A(e, "temperature_entity") ?? C(e, "entity_1"), r = A(e, "memory_entity") ?? C(e, "entity_2"), o = A(e, "cpu_entity") ?? C(e, "entity_3"), n = !["off", "unavailable", "unknown"].includes(e.entity?.state ?? ""), i = (d, u) => R(
    p(e, d),
    R(u, u)
  ), l = (d) => !!p(e, d), s = (d) => {
    const u = e.config[d];
    return u && typeof u == "object" && "max_value" in u ? S(u.max_value) : void 0;
  }, _ = (d, u, f, $ = 100) => {
    const D = Math.max(0, Math.min($, S(d?.state) ?? 0)), L = 2 * Math.PI * u, k = L * (1 - D / $);
    return ut`<circle class="nas-metrics-ring-value" cx="70" cy="70" r=${u}
      fill="none" stroke=${f} stroke-width="6" stroke-linecap="round"
      stroke-dasharray=${L} stroke-dashoffset=${k}></circle>`;
  }, g = e.entity?.state === "on" ? "Access" : w(e.entity), b = c`
    <button class="nas-metrics-tile status-tile" aria-label="Open NAS status"
      @pointerdown=${(d) => d.stopPropagation()}
      @click=${(d) => U(d, e, { action: "more-info" })}>
      <span class="nas-metrics-tile-icon tone-blue"><ha-icon icon="mdi:nas"></ha-icon></span>
      <span><b>Status</b><small>${g}</small></span>
    </button>`;
  return n ? e.actionSurface("custom-nas-metrics is-on", c`
    <div class="nas-metrics-top">
      ${b}
      <div class="nas-metrics-tile disk-tile">
        <span class=${`nas-metrics-tile-icon ${l("disk_color") ? "" : "tone-red"}`}
          style=${l("disk_color") ? `color:${i("disk_color", "red")};background:color-mix(in srgb, ${i("disk_color", "red")} 18%, transparent)` : ""}>
          <ha-icon .icon=${p(e, "disk_icon") || "mdi:harddisk"}></ha-icon>
        </span>
        <span><b>${p(e, "disk_name") || "Disk"}</b><small>${w(t)}</small></span>
      </div>
    </div>
    <div class="nas-metrics-body">
      <div class="nas-metrics-metrics">
        <span><i class=${l("temperature_color") ? "" : "tone-orange"} style=${l("temperature_color") ? `color:${i("temperature_color", "orange")}` : ""}><ha-icon .icon=${p(e, "temperature_icon") || "mdi:thermometer"}></ha-icon></i><span><b>${p(e, "temperature_name") || "Temp"}</b><small>${w(a)}</small></span></span>
        <span><i class=${l("memory_color") ? "" : "tone-blue"} style=${l("memory_color") ? `color:${i("memory_color", "blue")}` : ""}><ha-icon .icon=${p(e, "memory_icon") || "mdi:memory"}></ha-icon></i><span><b>${p(e, "memory_name") || "Memory"}</b><small>${w(r)}</small></span></span>
        <span><i class=${l("cpu_color") ? "" : "tone-green"} style=${l("cpu_color") ? `color:${i("cpu_color", "green")}` : ""}><ha-icon .icon=${p(e, "cpu_icon") || "mdi:cpu-64-bit"}></ha-icon></i><span><b>${p(e, "cpu_name") || "CPU"}</b><small>${w(o)}</small></span></span>
      </div>
      <svg class="nas-metrics-rings" viewBox="0 0 140 140" role="img" aria-label="NAS temperature, memory, and CPU utilization">
        ${[58, 48, 38].map((d) => ut`<circle class="nas-metrics-ring-track" cx="70" cy="70" r=${d}
          fill="none" stroke="#dedede" stroke-width="6"></circle>`)}
        ${_(a, 58, i("temperature_color", "orange"), S(p(e, "temperature_max")) ?? s("entity_1") ?? 100)}
        ${_(r, 48, i("memory_color", "blue"), S(p(e, "memory_max")) ?? s("entity_2") ?? 100)}
        ${_(o, 38, i("cpu_color", "green"), S(p(e, "cpu_max")) ?? s("entity_3") ?? 100)}
      </svg>
    </div>
  `) : e.actionSurface("custom-nas-metrics is-off", c`<div class="nas-metrics-top">${b}</div>`);
}, io = (e) => {
  const t = A(e, "battery_entity"), a = Math.max(0, Math.min(100, S(t?.state) ?? 0)), r = [
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
    ([_, g]) => g ? [[_, g]] : []
  ), i = r.flatMap(
    ([_, g, b, d]) => {
      const u = A(e, _);
      return u ? [[g, b, d, u]] : [];
    }
  ), l = e.entity?.state === "on" ? "Access" : w(e.entity), s = (_, g) => {
    if (_.stopPropagation(), !g) return;
    g.entity_id.split(".")[0] === "button" ? e.service("button", "press", { entity_id: g.entity_id }) : e.service("homeassistant", "toggle", { entity_id: g.entity_id });
  };
  return e.actionSurface("custom-tablet", c`
    <div class="tablet-header">
      <span class="tablet-icon"><ha-icon icon="mdi:tablet"></ha-icon></span>
      ${V(e, l)}
    </div>
    ${i.length ? c`<div class="tablet-controls">${i.map(([_, g, b, d]) => {
    const u = d.state.toLowerCase() === "unavailable";
    return c`<button class="tone-${g} ${Z.has(d.state) ? "is-active" : ""}"
        aria-label=${b} ?disabled=${u}
        @pointerdown=${(f) => f.stopPropagation()}
        @click=${(f) => s(f, d)}>
        <ha-icon .icon=${_}></ha-icon>
      </button>`;
  })}</div>` : h}
    ${n.length ? c`<div class="tablet-metrics">${n.map(([_, g]) => c`
      <span class=${g.state.toLowerCase() === "unavailable" ? "is-unavailable" : ""}><b>${w(g)}</b><small>${_}</small></span>
    `)}</div>` : h}
    ${t ? c`<div class="tablet-battery-row">
      <span class="tablet-battery-icon"><ha-icon icon="mdi:battery"></ha-icon></span>
      <span><b>${w(t)}</b><small>Battery</small></span>
    </div>
    <div class="tablet-battery-bar"><i style=${`width:${a}%`}></i><b>${a}%</b></div>` : h}
  `);
}, Pt = {
  en: ["none", "none to low", "low", "low to medium", "medium", "medium to high", "high"],
  de: ["keine", "keine bis gering", "gering", "gering bis mittel", "mittel", "mittel bis hoch", "hoch"],
  es: ["ninguno", "ninguno a bajo", "bajo", "bajo a medio", "medio", "medio a alto", "alto"],
  pl: ["brak", "bardzo słabe", "słabe", "umiarkowane", "średnie", "wysokie", "bardzo wysokie"]
}, lo = (e, t) => {
  const a = Math.max(0, Math.min(6, Math.round(t))), r = p(e, "pollen_language") || e.hass.language?.split("-")[0] || "en";
  return [p(e, `ulm_custom_card_pollen_forecast_${a || "none"}`) || (Pt[r] ?? Pt.en)[a], ["transparent", "rgb(219,250,200)", "rgb(254,228,156)", "rgb(254,197,77)", "rgb(254,154,36)", "rgb(240,56,26)", "rgb(190,0,33)"][a]];
}, co = (e) => {
  const t = A(e, "level_entity") ?? e.entity, a = S(t?.state) ?? 0, [r, o] = lo(e, a);
  return e.actionSurface("custom-pollen-forecast", c`
    ${V(e, r)}
    <span class="pollen-icon" style=${`--pollen:${o}`}><ha-icon .icon=${p(e, "ulm_custom_card_pollen_forecast_icon") || e.config.icon || e.entity?.attributes.icon || "mdi:flower-pollen"}></ha-icon></span>
  `);
}, uo = (e) => {
  const t = e.entity?.state ?? "unknown", a = v(e.entity, "entity_picture"), r = t !== "unknown" && t !== "standby" && a;
  return e.actionSurface(`custom-console-card platform-playstation state-${t} ${r ? "has-artwork" : ""}`, c`
    ${r ? c`<div class="console-backdrop" style=${`background-image:url("${String(a)}")`}></div>` : h}
    <div class="console-content">
      <span class="console-logo"><ha-icon .icon=${e.config.icon || "mdi:sony-playstation"}></ha-icon></span>
      ${V(
    e,
    r ? String(v(e.entity, "friendly_name") || w(e.entity)) : w(e.entity),
    r ? String(v(e.entity, "media_title") || H(e.config, e.entity, e.hass)) : H(e.config, e.entity, e.hass)
  )}
    </div>
  `);
}, _o = (e) => {
  const t = C(e, "ulm_card_vehicle_status_tracker") ?? e.entity, a = C(e, "ulm_card_vehicle_status_energy_level"), r = C(e, "ulm_card_vehicle_status_range"), o = C(e, "ulm_card_vehicle_status_lock"), n = t?.state === "home", i = o?.state === "locked" || o?.state === "off", l = (g) => {
    const b = S(g?.state);
    return b === void 0 ? w(g) : String(Math.round(b));
  }, s = (g, b) => [g?.attributes.unit_of_measurement, b].filter(Boolean).join(" "), _ = t?.last_changed ? (() => {
    const g = Math.max(0, Math.round((Date.now() - new Date(t.last_changed).getTime()) / 6e4));
    return g < 1 ? "just now" : `${g} minute${g === 1 ? "" : "s"} ago`;
  })() : w(t);
  return e.actionSurface("custom-vehicle-status", c`
    <button class="car-hero" aria-label="Open car details"
      @pointerdown=${(g) => g.stopPropagation()}
      @click=${(g) => U(g, e, { action: "more-info" }, t?.entity_id)}>
      <span class="car-icon-wrap">${N(e, "mdi:car", "blue")}
        <i class="car-badge tracker ${n ? "is-home" : "is-away"}"><ha-icon .icon=${n ? "mdi:home-variant" : "mdi:road-variant"}></ha-icon></i>
        <i class="car-badge lock ${i ? "is-locked" : "is-unlocked"}"><ha-icon .icon=${i ? "mdi:lock" : "mdi:lock-open"}></ha-icon></i>
      </span>
      ${V(e, _)}
    </button>
    <div class="car-metrics">
      <span><ha-icon icon="mdi:gas-station"></ha-icon><b>${l(a)}</b><small>${s(a, p(e, "ulm_custom_card_vehicle_status_energy_level") || "Nível de energia")}</small></span>
      <span><ha-icon icon="mdi:map-marker-distance"></ha-icon><b>${l(r)}</b><small>${s(r, p(e, "ulm_custom_card_vehicle_status_range") || "Alcance")}</small></span>
    </div>
  `);
}, mo = (e) => {
  const t = C(e, "ulm_card_flower_entity") ?? e.entity, a = t?.state === "problem", r = p(e, "ulm_card_flower_show_bars"), o = ["temperature", "humidity", "moisture", "conductivity", "illuminance", "dli"], n = (Array.isArray(r) ? r.filter((s) => typeof s == "string") : o).filter((s) => o.includes(s)).filter((s) => v(t, s) !== void 0 || s === "moisture" && t?.entity_id.startsWith("sensor.")), i = {
    temperature: "mdi:thermometer",
    humidity: "mdi:water-percent",
    moisture: "mdi:water",
    conductivity: "mdi:flash",
    illuminance: "mdi:white-balance-sunny",
    dli: "mdi:leaf"
  }, l = (s) => S(v(t, s)) ?? (s === "moisture" ? S(t?.state) : void 0);
  return e.actionSurface("custom-plant", c`
    <button class="flower-heading" aria-label="Open plant details"
      @pointerdown=${(s) => s.stopPropagation()}
      @click=${(s) => U(s, e, { action: "more-info" }, t?.entity_id)}>
      ${N(e, a ? "mdi:alert-circle" : "mdi:flower", a ? "red" : "green")}
      ${V(e, a ? p(e, "ulm_custom_card_plant_problem") || "Problema" : p(e, "ulm_custom_card_plant_correct") || "Correto")}
    </button>
    ${n.length ? c`<div class="flower-bars">${n.map((s) => {
    const _ = l(s);
    return c`<span>
        <ha-icon .icon=${i[s]}></ha-icon>
        <i><em style=${`width:${Math.max(0, Math.min(100, _ ?? 0))}%`}></em></i>
      </span>`;
  })}</div>` : h}
  `);
}, po = (e) => {
  const t = p(e, "ulm_custom_card_speedtest_round") === !0, a = (r, o, n, i, l, s, _, g, b) => {
    const d = C(e, r) ?? C(e, o), u = S(d?.state), f = Math.max(1, p(e, _) ?? g), $ = Math.max(0, Math.min(100, (u ?? 0) / f * 100)), D = u === void 0 ? "—" : b && t ? String(Math.round(u)) : d.state, L = d?.attributes.unit_of_measurement, k = R(p(e, l), s);
    return c`
      <div class="speedtest-metric" style=${`--speedtest-color:${k};--speedtest-value:${$}`}>
        <svg class="speedtest-ring" viewBox="0 0 120 100" aria-hidden="true">
          <path class="speedtest-track" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
          <path class="speedtest-value" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
        </svg>
        <span class="speedtest-value-copy"><ha-icon .icon=${i}></ha-icon><b>${D}${L ? ` ${String(L)}` : ""}</b><small>${n}</small></span>
      </div>`;
  };
  return e.actionSurface("custom-speedtest-gauges", c`
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
}, ho = (e) => {
  const t = {
    en: { none: "None", very_low: "Very low", low: "Low", medium: "Medium", high: "High", very_high: "Very high", tree: "Trees", grass: "Grass", weed: "Weeds" },
    de: { none: "Keine", very_low: "Sehr niedrig", low: "Niedrig", medium: "Mittel", high: "Hoch", very_high: "Sehr hoch", tree: "Bäume", grass: "Gräser", weed: "Kräuter" },
    es: { none: "Ninguno", very_low: "Muy bajo", low: "Bajo", medium: "Medio", high: "Alto", very_high: "Muy alto", tree: "Árboles", grass: "Hierbas", weed: "Malezas" },
    nl: { none: "Geen", very_low: "Zeer laag", low: "Laag", medium: "Gemiddeld", high: "Hoog", very_high: "Extreem hoog", tree: "Bomen", grass: "Grassen", weed: "Kruiden" },
    pl: { none: "Brak", very_low: "Bardzo słabe", low: "Słabe", medium: "Średnie", high: "Wysokie", very_high: "Bardzo wysokie", tree: "Drzewa", grass: "Trawy", weed: "Zioła" }
  }, a = t[(e.hass.language ?? "en").split("-")[0]] ?? t.en, r = [
    {
      entity: A(e, "trees_entity"),
      name: p(e, "custom_card_pollen_tree_name"),
      icon: p(e, "custom_card_pollen_tree_icon"),
      kind: "tree",
      fallbackIcon: "mdi:tree"
    },
    {
      entity: A(e, "grass_entity"),
      name: p(e, "custom_card_pollen_grass_name"),
      icon: p(e, "custom_card_pollen_grass_icon"),
      kind: "grass",
      fallbackIcon: "mdi:grass"
    },
    {
      entity: A(e, "weeds_entity"),
      name: p(e, "custom_card_pollen_weed_name"),
      icon: p(e, "custom_card_pollen_weed_icon"),
      kind: "weed",
      fallbackIcon: "mdi:flower-pollen"
    }
  ], o = (n) => {
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
  return e.actionSurface("custom-pollen", c`
    <div class="pollen-heading">${V(e, w(e.entity), e.descriptor.name)}</div>
    ${r.map((n) => {
    const i = o(n.entity?.state), l = n.name || n.entity?.attributes.friendly_name || a[n.kind], s = n.icon || n.entity?.attributes.icon || n.fallbackIcon;
    return c`<button class="pollen-item" style=${`--pollen:${i.color}`}
        ?disabled=${!n.entity}
        @pointerdown=${(_) => _.stopPropagation()}
        @click=${(_) => n.entity && U(_, e, { action: "more-info" }, n.entity.entity_id)}>
        <span class="pollen-item-icon"><ha-icon .icon=${s}></ha-icon>
          ${i.extreme ? c`<span class="pollen-extreme"><ha-icon .icon=${"mdi:exclamation-thick"}></ha-icon></span>` : h}
        </span>
        <b>${l}</b><small>${n.entity ? i.label : "Entity unavailable"}</small>
      </button>`;
  })}
  `);
}, go = (e) => {
  const t = Z.has(e.entity?.state ?? ""), a = "rgb(var(--rgb-blue, 33, 150, 243))";
  return e.actionSurface("ulm-row", c`
    ${Se(e, Te(e, "mdi:information-outline"), a, t)}
    ${Xt(e)}
  `, `--source-color:${a}`);
}, bo = (e) => {
  const t = S(v(e.entity, "current_temperature")), a = S(v(e.entity, "temperature")), r = S(v(e.entity, "min_temp")) ?? 5, o = S(v(e.entity, "max_temp")) ?? 35, n = e.config.thermostat_temp_step ?? S(v(e.entity, "target_temp_step")) ?? 0.5, i = String(
    v(e.entity, "temperature_unit") ?? v(e.entity, "unit_of_measurement") ?? "°C"
  ), l = A(e, "humidity_entity"), s = S(l?.state) ?? S(v(e.entity, "current_humidity")) ?? S(v(e.entity, "humidity")), g = A(e, "window_sensor")?.state.toLowerCase(), b = ["on", "open", "true"].includes(g ?? "") || v(e.entity, "window_open") === !0 || ["on", "open", "true"].includes(String(v(e.entity, "window_state") ?? "").toLowerCase()), d = A(e, "battery_entity"), u = S(d?.state) ?? S(v(e.entity, "battery")) ?? S(v(e.entity, "battery_level")), f = u !== void 0 && u <= (e.config.low_battery_threshold ?? 20), $ = (x) => !!(x && (!e.hass?.states[x] || ["unavailable", "unknown"].includes(e.hass.states[x].state.toLowerCase()))), D = !e.entity || ["unavailable", "unknown"].includes(e.entity.state.toLowerCase()) || $(e.config.window_sensor) || $(e.config.humidity_entity) || $(e.config.battery_entity), L = v(e.entity, "degraded_mode") === !0 || v(e.entity, "is_degraded") === !0, k = String(v(e.entity, "hvac_action") ?? "").toLowerCase(), F = Array.isArray(v(e.entity, "hvac_modes")) ? v(e.entity, "hvac_modes").map(String) : [], Q = String(v(e.entity, "preset_mode") ?? ""), X = Array.isArray(v(e.entity, "preset_modes")) ? v(e.entity, "preset_modes").map(String) : [], J = e.config.variant === "compact", G = e.config.show_controls !== !1, ee = e.config.collapsible_controls === !0 && e.entity?.state === "off", ae = {
    off: "mdi:power",
    auto: "mdi:autorenew",
    heat: "mdi:fire",
    cool: "mdi:snowflake",
    heat_cool: "mdi:sun-snowflake-variant",
    dry: "mdi:water-percent",
    fan_only: "mdi:fan"
  }, y = k === "heating" || e.entity?.state === "heat" ? "orange" : k === "cooling" || e.entity?.state === "cool" ? "blue" : e.entity?.state === "off" ? "grey" : "green", I = [
    D ? ["Connection lost", "mdi:lan-disconnect", "red"] : void 0,
    L ? ["Degraded", "mdi:alert-circle-outline", "orange"] : void 0,
    b ? ["Window open", "mdi:window-open-variant", "blue"] : void 0,
    f ? [`Battery ${Math.round(u)}%`, "mdi:battery-alert-variant-outline", "red"] : void 0,
    k === "heating" ? ["Heating", "mdi:radiator", "orange"] : void 0,
    k === "cooling" ? ["Cooling", "mdi:snowflake", "blue"] : void 0,
    Q === "eco" ? ["Eco", "mdi:leaf", "green"] : void 0
  ].filter((x) => !!x), O = (x, j) => {
    if (x.stopPropagation(), !e.config.entity || D) return;
    const Y = Math.max(r, Math.min(o, j)), aa = String(n).split(".")[1]?.length ?? 0, ra = Number((Math.round(Y / n) * n).toFixed(aa));
    e.service("climate", "set_temperature", {
      entity_id: e.config.entity,
      temperature: ra
    });
  }, E = (x) => x === "fan_only" ? "Fan" : x === "heat_cool" ? "Heat/Cool" : x.replaceAll("_", " ").replace(/\b\w/g, (j) => j.toUpperCase());
  return e.actionSurface(`better-thermostat ${J ? "is-compact" : ""} tone-${y}`, c`
    <div class="better-thermostat-header">
      ${N(e, k === "heating" ? "mdi:radiator" : "mdi:thermostat", y)}
      ${V(e, t === void 0 ? w(e.entity) : `${t}${i} current`)}
      <span class="better-thermostat-temperature">
        <b>${a === void 0 ? "—" : a}${a === void 0 ? "" : i}</b>
        ${e.config.show_humidity !== !1 && s !== void 0 ? c`<small><ha-icon icon="mdi:water-percent" aria-hidden="true"></ha-icon>${Math.round(s)}%</small>` : h}
      </span>
    </div>
    ${e.config.show_status !== !1 && I.length ? c`<div class="better-thermostat-statuses">
        ${I.map(([x, j, Y]) => c`
          <span class="better-thermostat-status tone-${Y}">
            <ha-icon .icon=${j} aria-hidden="true"></ha-icon>${x}
          </span>`)}
      </div>` : h}
    ${G && e.config.show_temperature_control !== !1 ? c`
      <div class="better-thermostat-target">
        ${T("Decrease target temperature", "mdi:minus", (x) => O(x, (a ?? r) - n), D)}
        ${J ? c`<span>${a === void 0 ? "—" : a}${a === void 0 ? "" : i}</span>` : c`
          <label>
            <span>Target temperature</span>
            <input type="range" name="target_temperature" min=${String(r)} max=${String(o)} step=${String(n)}
              .value=${String(a ?? r)}
              ?disabled=${D}
              aria-label="Target temperature"
              @pointerdown=${(x) => x.stopPropagation()}
              @click=${(x) => x.stopPropagation()}
              @change=${(x) => O(x, Number(x.target.value))}>
          </label>`}
        ${T("Increase target temperature", "mdi:plus", (x) => O(x, (a ?? r) + n), D)}
      </div>` : h}
    ${G && e.config.show_hvac_modes !== !1 && F.length ? c`
      <div class="better-thermostat-options" aria-label="HVAC modes">
        ${F.map((x) => c`
          <button type="button" class=${e.entity?.state === x ? "is-selected" : ""} ?disabled=${D}
            @pointerdown=${(j) => j.stopPropagation()}
            @click=${(j) => {
    j.stopPropagation(), e.config.entity && !D && e.service("climate", "set_hvac_mode", { entity_id: e.config.entity, hvac_mode: x });
  }}>
            <ha-icon .icon=${ae[x] ?? "mdi:thermostat"} aria-hidden="true"></ha-icon>
            <span>${E(x)}</span>
          </button>`)}
      </div>` : h}
    ${G && !ee && e.config.show_presets !== !1 && X.length ? c`
      <div class="better-thermostat-options presets" aria-label="Presets">
        ${X.map((x) => c`
          <button type="button" class=${Q === x ? "is-selected" : ""} ?disabled=${D}
            @pointerdown=${(j) => j.stopPropagation()}
            @click=${(j) => {
    j.stopPropagation(), e.config.entity && !D && e.service("climate", "set_preset_mode", { entity_id: e.config.entity, preset_mode: x });
  }}>
            <ha-icon .icon=${x === "eco" ? "mdi:leaf" : x === "away" ? "mdi:home-export-outline" : x === "boost" ? "mdi:rocket-launch" : "mdi:home-thermometer"} aria-hidden="true"></ha-icon>
            <span>${x === "none" ? "Normal" : E(x)}</span>
          </button>`)}
      </div>` : h}
  `);
}, yo = (e) => {
  const t = R(
    p(e, "ulm_card_graph_color"),
    "rgb(var(--rgb-red, 244, 67, 54))"
  ), a = R(
    p(e, "ulm_card_graph_icon_color"),
    t
  );
  return e.actionSurface("ulm-default-graph", c`
    <div class="metric-heading">${Se(e, Te(e, "mdi:chart-line"), a, !0)}${Xt(e)}</div>
    ${ea(e, !0, e.entity, t)}
  `);
}, fo = (e) => {
  switch (e.descriptor.upstreamId) {
    case "card_battery":
      return Vr(e);
    case "card_graph":
      return yo(e);
    case "card_media_player":
      return At(e);
    case "custom_card_trash":
      return Wr(e);
    case "custom_card_alarm_time":
      return qr(e);
    case "custom_card_roomview":
      return Gr(e);
    case "custom_card_room_overview":
      return Jr(e);
    case "custom_card_welcome":
      return Kr(e);
    case "custom_card_washer":
      return Yr(e);
    case "custom_card_sun":
      return Zr(e);
    case "custom_card_input_datetime":
      return Qr(e);
    case "custom_card_entity_overview":
      return Xr(e);
    case "custom_card_internet_speed":
      return eo(e);
    case "custom_card_weather_metrics":
      return to(e);
    case "custom_card_media_player_sonos":
      return ao(e);
    case "custom_card_more_power_outlet":
      return ro(e);
    case "custom_card_gauge":
      return oo(e);
    case "custom_card_printer":
      return no(e);
    case "custom_card_nas_metrics":
      return so(e);
    case "custom_card_tablet":
      return io(e);
    case "custom_card_pollen_forecast":
      return co(e);
    case "custom_card_playstation":
      return uo(e);
    case "custom_card_vehicle_status":
      return _o(e);
    case "custom_card_plant":
      return mo(e);
    case "custom_card_speedtest_gauges":
      return po(e);
    case "custom_card_pollen":
      return ho(e);
    case "custom_card_better_thermostat":
      return bo(e);
    case "card_room":
      return Lr(e);
  }
  if (/trash/.test(e.descriptor.upstreamId)) return Ur(e);
  if (/printer/.test(e.descriptor.upstreamId)) return Br(e);
  if (/gauge/.test(e.descriptor.upstreamId)) return Rr(e);
  if (/vehicle_status|plant|entity_overview/.test(e.descriptor.upstreamId))
    return Fr(e, /vehicle_status/.test(e.descriptor.upstreamId) ? "mdi:car" : /plant/.test(e.descriptor.upstreamId) ? "mdi:flower" : "mdi:view-grid", "purple");
  switch (e.descriptor.family) {
    case "scene":
      return Er(e);
    case "battery":
      return Ar(e);
    case "bar":
      return Pr(e);
    case "energy":
    case "sensor":
      return Cr(e);
    case "media":
      return At(e);
    case "security":
      return Mr(e);
    case "navigation":
      return Dr(e);
    case "control":
      return Tr(e);
    case "alarm-time":
      return Hr(e);
    case "camera":
      return jr(e);
    default:
      return go(e);
  }
};
var vo = Object.defineProperty, Xe = (e, t, a, r) => {
  for (var o = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (o = i(t, a, o) || o);
  return o && vo(t, a, o), o;
};
const et = class et extends me {
  constructor() {
    super(...arguments), this.holdFired = !1, this.forecastGeneration = 0, this.forecast = [], this.sceneOverflowExpanded = !1, this.actionSurface = (t, a, r = "") => {
      const o = this.descriptor ? Ye.get(this.descriptor.upstreamId) : void 0;
      if (!o)
        throw new Error(`Missing explicit parity renderer mapping for ${this.descriptor?.upstreamId}`);
      const n = o ? ` parity-${o.rendererId.replaceAll("_", "-")}` : "", i = this.config?.layout && this.config.layout !== "default" ? ` layout-${this.config.layout}` : "", l = this.config?.fill_container ? " fill-container" : "", s = this.config?.variant ? ` variant-${this.config.variant}` : "", _ = c`
      <div class="${t}${n}${i}${l}${s} action-surface" style=${r} role="button" tabindex="0"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        ${a}
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
    const a = La(t), r = this.forecastKey(this.config);
    this.config = a, this.sceneOverflowExpanded = !1, r !== this.forecastKey(a) && this.stopForecastSubscription(), this.requestUpdate(), this.subscribeForecast();
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
    if (!this.hass) return c`<ha-card><div class="preview">Mushroom Addition preview</div></ha-card>`;
    const t = this.config.entity ? this.hass.states[this.config.entity] : void 0, a = { rendered: !1 }, r = {
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
      actionSurface: (o, n, i) => this.actionSurface(
        o,
        a.rendered ? n : c`${xr(r)}${n}`,
        i
      ),
      service: (o, n, i) => {
        this.hass?.callService(o, n, i);
      }
    };
    return fo(r);
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
    Ta(this, o ? { ...this.config, entity: o } : this.config, a);
  }
};
et.styles = yr;
let ce = et;
Xe([
  Me({ attribute: !1 })
], ce.prototype, "hass");
Xe([
  Me({ attribute: !1 })
], ce.prototype, "config");
Xe([
  Lt()
], ce.prototype, "sceneOverflowExpanded");
const wo = (e, t, a = [], r = []) => {
  const o = [...a, ...r, ...Object.keys(t?.states ?? {})], n = [...new Set(o)].filter((l) => t?.states?.[l] !== void 0), i = n.filter((l) => !["unavailable", "unknown"].includes(t?.states?.[l]?.state.toLowerCase() ?? ""));
  for (const l of e.preferredDomains ?? []) {
    const s = i.find((_) => _.startsWith(`${l}.`)) ?? n.find((_) => _.startsWith(`${l}.`));
    if (s) return s;
  }
  return i[0] ?? n[0];
}, $o = (e) => e.name.replace(/ (Card|Chip)$/, ""), ta = (e, t, a = [], r = []) => {
  const o = [.../* @__PURE__ */ new Set([...a, ...r, ...Object.keys(t?.states ?? {})])].filter((y) => t?.states?.[y] !== void 0), n = (y) => {
    const I = t?.states[y];
    return [
      y,
      I?.attributes.friendly_name,
      I?.attributes.device_class,
      I?.attributes.unit_of_measurement
    ].filter(Boolean).join(" ").toLowerCase();
  }, i = (y) => [
    ...y.filter((I) => !["unavailable", "unknown"].includes(t?.states[I]?.state.toLowerCase() ?? "")),
    ...y.filter((I) => ["unavailable", "unknown"].includes(t?.states[I]?.state.toLowerCase() ?? ""))
  ], l = (y) => !["unavailable", "unknown"].includes(t?.states[y]?.state.toLowerCase() ?? ""), s = (y, I) => i(o.filter((O) => y.some((E) => O.startsWith(`${E}.`)) && I.every((E) => n(O).includes(E))))[0], _ = (y, I, O) => i(o.filter((E) => y.some((x) => E.startsWith(`${x}.`)) && I.every((x) => n(E).includes(x)) && O.every((x) => !n(E).includes(x))))[0], g = (y, I, O = []) => o.find((E) => l(E) && y.some((x) => E.startsWith(`${x}.`)) && I.every((x) => n(E).split(/[^a-z0-9]+/).includes(x)) && O.every((x) => !n(E).includes(x))), b = (y, I = [], O = []) => i(o.filter((E) => {
    const x = t?.states[E], j = n(E);
    return E.startsWith("sensor.") && y.includes(String(x?.attributes.device_class ?? "")) && I.every((Y) => j.includes(Y)) && O.every((Y) => !j.includes(Y));
  }))[0], d = (y, I = [], O = []) => o.find((E) => {
    const x = t?.states[E], j = n(E);
    return l(E) && E.startsWith("sensor.") && y.includes(String(x?.attributes.device_class ?? "")) && I.every((Y) => j.includes(Y)) && O.every((Y) => !j.includes(Y));
  }), u = o.filter((y) => y.startsWith("media_player.") && n(y).includes("sonos")).sort((y, I) => ft(t, I) - ft(t, y))[0], f = e.upstreamId === "card_graph" ? s(["sensor"], ["cv", "plug", "power"]) ?? b(["power", "energy"]) : e.upstreamId === "card_media_player" ? s(["media_player"], ["office", "joris", "tv"]) : e.upstreamId === "card_battery" ? _(["sensor"], ["battery", "level"], ["state", "charging"]) ?? b(["battery"], [], ["state", "charging"]) : e.upstreamId === "custom_card_pollen_forecast" ? s(["sensor"], ["pollen", "grass", "level"]) ?? s(["sensor"], ["pollen", "grass"]) ?? s(["sensor"], ["pollen"]) : e.upstreamId === "custom_card_pollen" ? s(["sensor"], ["pollen", "grass"]) : e.upstreamId === "custom_card_speedtest_gauges" ? s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) : e.upstreamId === "custom_card_tablet" ? s(["binary_sensor", "sensor", "switch"], ["tablet"]) : e.upstreamId === "custom_card_nas_metrics" ? s(["switch", "binary_sensor"], ["nas"]) ?? s(["switch", "binary_sensor"], ["status"]) : e.upstreamId === "custom_card_washer" ? s(["sensor"], ["operation", "state"]) ?? s(["sensor"], ["washer", "state"]) : e.upstreamId === "custom_card_sun" ? s(["sun"], []) : e.upstreamId === "custom_card_media_player_sonos" ? u : e.upstreamId === "custom_card_more_power_outlet" ? s(["switch", "light"], ["outlet"]) ?? s(["switch", "light"], ["plug"]) : e.upstreamId === "custom_card_printer" ? s(["sensor", "binary_sensor"], ["printer"]) ?? s(["sensor", "binary_sensor"], ["online"]) : e.upstreamId === "custom_card_internet_speed" ? s(["sensor"], ["download"]) : e.upstreamId === "custom_card_weather_metrics" ? s(["weather"], []) : e.upstreamId === "card_room" ? s(["light"], []) : e.upstreamId === "custom_card_vehicle_status" ? s(["sensor"], ["model"]) ?? s(["device_tracker"], []) : e.upstreamId === "custom_card_plant" ? s(["plant"], []) ?? s(["sensor"], ["soil", "humidity"]) : e.upstreamId === "custom_card_playstation" ? s(["media_player"], ["tv"]) ?? s(["media_player"], []) : e.upstreamId === "custom_card_better_thermostat" ? s(["climate"], ["living", "room"]) ?? s(["climate"], []) : void 0, $ = e.upstreamId === "card_scenes" ? void 0 : f ?? wo(e, t, a, r), D = ["text", "navigation"].includes(e.family), L = e.variants?.[0], k = $?.split(".", 1)[0], F = ["light", "switch", "input_boolean", "fan"].includes(k ?? "") ? { action: "toggle" } : { action: $ ? "more-info" : "none" }, Q = (y, I) => [...new Set(y.filter((O) => !!O))].slice(0, I), X = s(["sensor"], ["outdoor", "temperature"]) ?? s(["sensor"], ["outside", "temperature"]) ?? s(["sensor"], ["garden", "temperature"]) ?? b(["temperature"], [], ["battery", "cpu", "soil"]), J = s(["sensor"], ["date", "time"]) ?? s(["sensor"], ["time", "date"]) ?? s(["sensor"], ["date"]), ee = [
    [d(["humidity"]), "Humidity"],
    [
      d(["wind_speed"]) ?? g(["sensor"], ["wind", "speed"]) ?? g(["sensor"], ["wind"]),
      "Wind"
    ],
    [
      d(["atmospheric_pressure"]) ?? g(["sensor"], ["barometric", "pressure"]) ?? g(["sensor"], ["pressure"], ["blood"]),
      "Pressure"
    ],
    [
      d(["precipitation", "precipitation_intensity"]) ?? g(["sensor"], ["precipitation"]) ?? g(["sensor"], ["rain"]),
      "Precipitation"
    ],
    [g(["sensor"], ["visibility"]), "Visibility"],
    [g(["sensor"], ["cloud", "coverage"]), "Cloud cover"],
    [g(["sensor"], ["uv", "index"]), "UV index"],
    [d(["illuminance"]), "Light level"],
    [g(["sensor"], ["dew", "point"]), "Dew point"]
  ].filter(
    ([y], I, O) => !!y && O.findIndex(([E]) => E === y) === I
  ).slice(0, 4), ae = Q([
    b(["temperature"]),
    b(["humidity"]),
    b(["power", "energy"]),
    b(["battery"]),
    ...o.filter((y) => y.startsWith("sensor."))
  ], 4);
  return {
    ...Zt(e, t, $),
    name: $ ? t?.states[$]?.attributes.friendly_name : $o(e),
    secondary: $ ? void 0 : D ? "Example" : "Preview",
    variant: L,
    tap_action: F,
    show_controls: ["climate", "vacuum", "control"].includes(e.family) || e.family === "media" && e.upstreamId !== "card_media_player" ? !0 : void 0,
    show_forecast: e.family === "weather",
    show_graph: ["battery", "energy", "sensor"].includes(e.family),
    ulm_custom_card_bar_card_value: e.family === "bar" ? !0 : void 0,
    entities: e.variants?.includes("with-sensors") ? r.slice(0, 2) : void 0,
    ...e.upstreamId === "custom_card_washer" ? {
      power_entity: s(["sensor", "switch"], ["wasmachine", "power"]) ?? s(["sensor", "switch"], ["washer", "power"]) ?? s(["sensor", "switch"], ["power"]),
      door_entity: s(["sensor", "binary_sensor"], ["washer", "door"]) ?? s(["sensor", "binary_sensor"], ["door"]),
      finished_entity: s(["sensor", "binary_sensor"], ["washer", "finished"]) ?? s(["sensor", "binary_sensor"], ["finished"]),
      ulm_custom_card_washer_machine_state: $,
      ulm_custom_card_washer_machine_stop_state: "stop",
      ulm_custom_card_washer_label_idle: "idle",
      ulm_custom_card_washer_label_configuring: "configure",
      ulm_custom_card_washer_label_running: "run"
    } : {},
    ...e.upstreamId === "custom_card_better_thermostat" ? {
      window_sensor: s(["binary_sensor"], ["window"]) ?? s(["binary_sensor"], ["door"]),
      humidity_entity: b(["humidity"]),
      battery_entity: b(["battery"], [], ["phone", "tablet"])
    } : {},
    ...e.upstreamId === "custom_card_sun" ? {
      darkMode: !1,
      language: t?.language ?? "en",
      showAzimuth: !1,
      showElevation: !1,
      timeFormat: "24h",
      tap_action: { action: "none" }
    } : {},
    ...e.upstreamId === "custom_card_pollen_forecast" ? {
      entity: s(["sensor"], ["pollen", "grass", "level"]) ?? $,
      level_entity: s(["sensor"], ["pollen", "grass", "level"]),
      pollen_language: "en"
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
      download_entity: s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) ?? $,
      upload_entity: s(["sensor"], ["speedtest", "upload"]) ?? s(["sensor"], ["upload"]),
      ping_entity: s(["sensor"], ["speedtest", "ping"]) ?? s(["sensor"], ["ping"]),
      tap_action: {
        action: "perform-action",
        perform_action: "homeassistant.update_entity",
        target: {
          entity_id: [
            s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) ?? $,
            s(["sensor"], ["speedtest", "upload"]) ?? s(["sensor"], ["upload"]),
            s(["sensor"], ["speedtest", "ping"]) ?? s(["sensor"], ["ping"])
          ].filter((y) => !!y)
        }
      }
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
      grass_entity: s(["sensor"], ["pollen", "grass"]) ?? s(["sensor"], ["grass", "pollen"]) ?? $,
      weeds_entity: s(["sensor"], ["pollen", "weeds"]) ?? s(["sensor"], ["weed", "pollen"]),
      tap_action: { action: "none" }
    } : {},
    ...e.upstreamId === "custom_card_vehicle_status" ? {
      entity: $,
      ulm_card_vehicle_status_tracker: $,
      ulm_card_vehicle_status_lock: s(["lock"], ["car"]) ?? s(["binary_sensor"], ["doors"]),
      ulm_card_vehicle_status_energy_level: s(["sensor"], ["primary", "engine", "percent"]) ?? s(["sensor"], ["battery"]),
      ulm_card_vehicle_status_range: s(["sensor"], ["range"]),
      ulm_card_vehicle_status_name: $ ? t?.states[$]?.attributes.friendly_name : void 0,
      tap_action: { action: "more-info" }
    } : {},
    ...e.upstreamId === "custom_card_plant" ? {
      entity: $,
      ulm_card_flower_entity: $,
      ulm_card_flower_name: $ ? t?.states[$]?.attributes.friendly_name : "No name set",
      ulm_card_flower_show_bars: ["temperature", "humidity", "moisture"],
      tap_action: { action: "more-info" }
    } : {},
    ...e.upstreamId === "card_room" ? {
      room_sensors: [
        s(["sensor"], ["illuminance"]),
        s(["sensor"], ["temperature"])
      ].filter((y) => !!y).map((y) => ({ entity: y }))
    } : {},
    ...e.upstreamId === "card_scenes" ? {
      scene_items: o.filter((y) => y.startsWith("scene.")).slice(0, 7).map((y) => _e(t, y))
    } : {},
    ...e.upstreamId === "card_welcome_scenes" ? {
      name: void 0,
      secondary: "Scenes",
      collapse_entity: s(["input_boolean"], ["collapse"]) ?? s(["input_boolean"], ["dropdown"]) ?? s(["input_boolean"], []),
      scene_items: o.filter((y) => y.startsWith("scene.")).slice(0, 5).map((y) => _e(t, y)),
      tap_action: { action: "none" }
    } : {},
    ...e.upstreamId === "custom_card_internet_speed" ? {
      download_entity: s(["sensor"], ["download"]) ?? $,
      upload_entity: s(["sensor"], ["upload"]),
      ping_entity: s(["sensor"], ["ping"])
    } : {},
    ...e.upstreamId === "custom_card_entity_overview" ? {
      entities: ae,
      ...Object.fromEntries(ae.flatMap((y, I) => [
        [`ulm_custom_card_entity_overview_entity_${I + 1}`, y],
        [
          `ulm_custom_card_entity_overview_name_${I + 1}`,
          t?.states[y]?.attributes.friendly_name ?? `Entity ${I + 1}`
        ]
      ]))
    } : {},
    ...e.upstreamId === "custom_card_weather_metrics" ? {
      entity: s(["weather"], []) ?? $,
      temperature_entity: X,
      date_entity: J,
      entities: ee.map(([y]) => y),
      ulm_custom_card_weather_metrics: s(["weather"], []) ?? $,
      ulm_custom_card_weather_metrics_temperature_outside: X,
      ulm_custom_card_weather_metrics_date: J,
      ...Object.fromEntries(ee.flatMap(([y, I], O) => [
        [`ulm_custom_card_weather_metrics_entity_${O + 1}`, y],
        [`ulm_custom_card_weather_metrics_name_${O + 1}`, I]
      ]))
    } : {},
    ...e.upstreamId === "custom_card_media_player_sonos" ? {
      ulm_card_media_player_with_controls_name: $ ? t?.states[$]?.attributes.friendly_name : "No name set"
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
      show_controls: !1,
      tap_action: { action: $ ? "more-info" : "none", entity: $ }
    } : {}
  };
}, ko = "1.4.0";
for (const e of Oe)
  if (!customElements.get(e.tag)) {
    const t = e;
    class a extends ce {
      constructor() {
        super(...arguments), this.descriptor = t;
      }
      static getStubConfig(o, n = [], i = []) {
        return ta(t, o, n, i);
      }
    }
    customElements.define(e.tag, a);
  }
for (const e of qe) {
  if (customElements.get(e.tag)) continue;
  const t = De.find((n) => n.upstreamId === e.targetId);
  if (!t) throw new Error(`Missing alias target ${e.targetId}.`);
  const a = t, r = e.variant;
  class o extends ce {
    constructor() {
      super(...arguments), this.descriptor = a;
    }
    static getStubConfig(i, l = [], s = []) {
      const _ = ta(a, i, l, s);
      return r === "divider-title" ? {
        ..._,
        type: `custom:${e.tag}`,
        entity: void 0,
        variant: r,
        name: "Title",
        navigation_path: "",
        tap_action: { action: "none" }
      } : r === "divider-subtitle" ? {
        ..._,
        type: `custom:${e.tag}`,
        entity: void 0,
        variant: r,
        name: "Subtitle",
        tap_action: { action: "none" }
      } : {
        ..._,
        type: `custom:${e.tag}`,
        variant: r,
        show_forecast: e.tag === "mushroom-addition-card-weather-ulm" ? !1 : _.show_forecast
      };
    }
    setConfig(i) {
      super.setConfig({ ...i, variant: i.variant ?? r });
    }
  }
  customElements.define(e.tag, o);
}
window.customCards = window.customCards || [];
const xo = new Set(window.customCards.map((e) => e.type));
for (const e of Oe)
  xo.has(e.tag) || window.customCards.push({
    type: e.tag,
    name: `Mushroom Addition: ${e.name}`,
    description: e.description,
    preview: !0,
    documentationURL: "https://github.com/snfx-johaver/mushroom-cards-addition"
  });
console.info(
  `%c MUSHROOM-CARDS-ADDITION %c ${ko} · ${Oe.length} components `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;"
);
export {
  Oe as CATALOG
};
//# sourceMappingURL=mushroom-cards-addition.js.map
