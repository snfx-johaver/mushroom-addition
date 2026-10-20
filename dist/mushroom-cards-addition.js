const He = globalThis, rt = He.ShadowRoot && (He.ShadyCSS === void 0 || He.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, nt = /* @__PURE__ */ Symbol(), wt = /* @__PURE__ */ new WeakMap();
let Jt = class {
  constructor(t, a, o) {
    if (this._$cssResult$ = !0, o !== nt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = a;
  }
  get styleSheet() {
    let t = this.o;
    const a = this.t;
    if (rt && t === void 0) {
      const o = a !== void 0 && a.length === 1;
      o && (t = wt.get(a)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && wt.set(a, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Va = (e) => new Jt(typeof e == "string" ? e : e + "", void 0, nt), We = (e, ...t) => {
  const a = e.length === 1 ? e[0] : t.reduce((o, r, n) => o + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new Jt(a, e, nt);
}, Ea = (e, t) => {
  if (rt) e.adoptedStyleSheets = t.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of t) {
    const o = document.createElement("style"), r = He.litNonce;
    r !== void 0 && o.setAttribute("nonce", r), o.textContent = a.cssText, e.appendChild(o);
  }
}, $t = rt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let a = "";
  for (const o of t.cssRules) a += o.cssText;
  return Va(a);
})(e) : e;
const { is: za, defineProperty: Da, getOwnPropertyDescriptor: Oa, getOwnPropertyNames: Ta, getOwnPropertySymbols: La, getPrototypeOf: Na } = Object, qe = globalThis, xt = qe.trustedTypes, Fa = xt ? xt.emptyScript : "", ja = qe.reactiveElementPolyfillSupport, Pe = (e, t) => e, Ue = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Fa : null;
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
} }, it = (e, t) => !za(e, t), kt = { attribute: !0, type: String, converter: Ue, reflect: !1, useDefault: !1, hasChanged: it };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), qe.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let ye = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, a = kt) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(t, a), !a.noAccessor) {
      const o = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(t, o, a);
      r !== void 0 && Da(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, a, o) {
    const { get: r, set: n } = Oa(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? kt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Pe("elementProperties"))) return;
    const t = Na(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Pe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Pe("properties"))) {
      const a = this.properties, o = [...Ta(a), ...La(a)];
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
      for (const r of o) a.unshift($t(r));
    } else t !== void 0 && a.push($t(t));
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
    return Ea(t, this.constructor.elementStyles), t;
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
      const n = (o.converter?.toAttribute !== void 0 ? o.converter : Ue).toAttribute(a, o.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, a) {
    const o = this.constructor, r = o._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = o.getPropertyOptions(r), i = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : Ue;
      this._$Em = r;
      const l = i.fromAttribute(a, n.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, a, o, r = !1, n) {
    if (t !== void 0) {
      const i = this.constructor;
      if (r === !1 && (n = this[t]), o ??= i.getPropertyOptions(t), !((o.hasChanged ?? it)(n, a) || o.useDefault && o.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(i._$Eu(t, o)))) return;
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
ye.elementStyles = [], ye.shadowRootOptions = { mode: "open" }, ye[Pe("elementProperties")] = /* @__PURE__ */ new Map(), ye[Pe("finalized")] = /* @__PURE__ */ new Map(), ja?.({ ReactiveElement: ye }), (qe.reactiveElementVersions ??= []).push("2.1.2");
const st = globalThis, St = (e) => e, Re = st.trustedTypes, It = Re ? Re.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Zt = "$lit$", ie = `lit$${Math.random().toFixed(9).slice(2)}$`, Qt = "?" + ie, Ha = `<${Qt}>`, _e = document, Ve = () => _e.createComment(""), Ee = (e) => e === null || typeof e != "object" && typeof e != "function", lt = Array.isArray, Ga = (e) => lt(e) || typeof e?.[Symbol.iterator] == "function", Qe = `[ 	
\f\r]`, Ie = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, At = /-->/g, Mt = />/g, de = RegExp(`>|${Qe}(?:([^\\s"'>=/]+)(${Qe}*=${Qe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ct = /'/g, Pt = /"/g, ea = /^(?:script|style|textarea|title)$/i, ta = (e) => (t, ...a) => ({ _$litType$: e, strings: t, values: a }), c = ta(1), Q = ta(2), ve = /* @__PURE__ */ Symbol.for("lit-noChange"), h = /* @__PURE__ */ Symbol.for("lit-nothing"), Vt = /* @__PURE__ */ new WeakMap(), me = _e.createTreeWalker(_e, 129);
function aa(e, t) {
  if (!lt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return It !== void 0 ? It.createHTML(t) : t;
}
const Ba = (e, t) => {
  const a = e.length - 1, o = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", i = Ie;
  for (let l = 0; l < a; l++) {
    const s = e[l];
    let d, m, g = -1, u = 0;
    for (; u < s.length && (i.lastIndex = u, m = i.exec(s), m !== null); ) u = i.lastIndex, i === Ie ? m[1] === "!--" ? i = At : m[1] !== void 0 ? i = Mt : m[2] !== void 0 ? (ea.test(m[2]) && (r = RegExp("</" + m[2], "g")), i = de) : m[3] !== void 0 && (i = de) : i === de ? m[0] === ">" ? (i = r ?? Ie, g = -1) : m[1] === void 0 ? g = -2 : (g = i.lastIndex - m[2].length, d = m[1], i = m[3] === void 0 ? de : m[3] === '"' ? Pt : Ct) : i === Pt || i === Ct ? i = de : i === At || i === Mt ? i = Ie : (i = de, r = void 0);
    const _ = i === de && e[l + 1].startsWith("/>") ? " " : "";
    n += i === Ie ? s + Ha : g >= 0 ? (o.push(d), s.slice(0, g) + Zt + s.slice(g) + ie + _) : s + ie + (g === -2 ? l : _);
  }
  return [aa(e, n + (e[a] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), o];
};
class ze {
  constructor({ strings: t, _$litType$: a }, o) {
    let r;
    this.parts = [];
    let n = 0, i = 0;
    const l = t.length - 1, s = this.parts, [d, m] = Ba(t, a);
    if (this.el = ze.createElement(d, o), me.currentNode = this.el.content, a === 2 || a === 3) {
      const g = this.el.content.firstChild;
      g.replaceWith(...g.childNodes);
    }
    for (; (r = me.nextNode()) !== null && s.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const g of r.getAttributeNames()) if (g.endsWith(Zt)) {
          const u = m[i++], _ = r.getAttribute(g).split(ie), b = /([.?@])?(.*)/.exec(u);
          s.push({ type: 1, index: n, name: b[2], strings: _, ctor: b[1] === "." ? Ra : b[1] === "?" ? Wa : b[1] === "@" ? qa : Ke }), r.removeAttribute(g);
        } else g.startsWith(ie) && (s.push({ type: 6, index: n }), r.removeAttribute(g));
        if (ea.test(r.tagName)) {
          const g = r.textContent.split(ie), u = g.length - 1;
          if (u > 0) {
            r.textContent = Re ? Re.emptyScript : "";
            for (let _ = 0; _ < u; _++) r.append(g[_], Ve()), me.nextNode(), s.push({ type: 2, index: ++n });
            r.append(g[u], Ve());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Qt) s.push({ type: 2, index: n });
      else {
        let g = -1;
        for (; (g = r.data.indexOf(ie, g + 1)) !== -1; ) s.push({ type: 7, index: n }), g += ie.length - 1;
      }
      n++;
    }
  }
  static createElement(t, a) {
    const o = _e.createElement("template");
    return o.innerHTML = t, o;
  }
}
function we(e, t, a = e, o) {
  if (t === ve) return t;
  let r = o !== void 0 ? a._$Co?.[o] : a._$Cl;
  const n = Ee(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, a, o)), o !== void 0 ? (a._$Co ??= [])[o] = r : a._$Cl = r), r !== void 0 && (t = we(e, r._$AS(e, t.values), r, o)), t;
}
class Ua {
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
    const { el: { content: a }, parts: o } = this._$AD, r = (t?.creationScope ?? _e).importNode(a, !0);
    me.currentNode = r;
    let n = me.nextNode(), i = 0, l = 0, s = o[0];
    for (; s !== void 0; ) {
      if (i === s.index) {
        let d;
        s.type === 2 ? d = new Oe(n, n.nextSibling, this, t) : s.type === 1 ? d = new s.ctor(n, s.name, s.strings, this, t) : s.type === 6 && (d = new Ka(n, this, t)), this._$AV.push(d), s = o[++l];
      }
      i !== s?.index && (n = me.nextNode(), i++);
    }
    return me.currentNode = _e, r;
  }
  p(t) {
    let a = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, a), a += o.strings.length - 2) : o._$AI(t[a])), a++;
  }
}
class Oe {
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
    t = we(this, t, a), Ee(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== ve && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ga(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && Ee(this._$AH) ? this._$AA.nextSibling.data = t : this.T(_e.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: a, _$litType$: o } = t, r = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = ze.createElement(aa(o.h, o.h[0]), this.options)), o);
    if (this._$AH?._$AD === r) this._$AH.p(a);
    else {
      const n = new Ua(r, this), i = n.u(this.options);
      n.p(a), this.T(i), this._$AH = n;
    }
  }
  _$AC(t) {
    let a = Vt.get(t.strings);
    return a === void 0 && Vt.set(t.strings, a = new ze(t)), a;
  }
  k(t) {
    lt(this._$AH) || (this._$AH = [], this._$AR());
    const a = this._$AH;
    let o, r = 0;
    for (const n of t) r === a.length ? a.push(o = new Oe(this.O(Ve()), this.O(Ve()), this, this.options)) : o = a[r], o._$AI(n), r++;
    r < a.length && (this._$AR(o && o._$AB.nextSibling, r), a.length = r);
  }
  _$AR(t = this._$AA.nextSibling, a) {
    for (this._$AP?.(!1, !0, a); t !== this._$AB; ) {
      const o = St(t).nextSibling;
      St(t).remove(), t = o;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Ke {
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
    if (n === void 0) t = we(this, t, a, 0), i = !Ee(t) || t !== this._$AH && t !== ve, i && (this._$AH = t);
    else {
      const l = t;
      let s, d;
      for (t = n[0], s = 0; s < n.length - 1; s++) d = we(this, l[o + s], a, s), d === ve && (d = this._$AH[s]), i ||= !Ee(d) || d !== this._$AH[s], d === h ? t = h : t !== h && (t += (d ?? "") + n[s + 1]), this._$AH[s] = d;
    }
    i && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ra extends Ke {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Wa extends Ke {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class qa extends Ke {
  constructor(t, a, o, r, n) {
    super(t, a, o, r, n), this.type = 5;
  }
  _$AI(t, a = this) {
    if ((t = we(this, t, a, 0) ?? h) === ve) return;
    const o = this._$AH, r = t === h && o !== h || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, n = t !== h && (o === h || r);
    r && this.element.removeEventListener(this.name, this, o), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ka {
  constructor(t, a, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    we(this, t);
  }
}
const Xa = st.litHtmlPolyfillSupport;
Xa?.(ze, Oe), (st.litHtmlVersions ??= []).push("3.3.3");
const Ya = (e, t, a) => {
  const o = a?.renderBefore ?? t;
  let r = o._$litPart$;
  if (r === void 0) {
    const n = a?.renderBefore ?? null;
    o._$litPart$ = r = new Oe(t.insertBefore(Ve(), n), n, void 0, a ?? {});
  }
  return r._$AI(e), r;
};
const ct = globalThis;
class se extends ye {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ya(a, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return ve;
  }
}
se._$litElement$ = !0, se.finalized = !0, ct.litElementHydrateSupport?.({ LitElement: se });
const Ja = ct.litElementPolyfillSupport;
Ja?.({ LitElement: se });
(ct.litElementVersions ??= []).push("4.2.2");
const oa = (e) => (t, a) => {
  a !== void 0 ? a.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Za = { attribute: !0, type: String, converter: Ue, reflect: !1, hasChanged: it }, Qa = (e = Za, t, a) => {
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
function he(e) {
  return (t, a) => typeof a == "object" ? Qa(e, t, a) : ((o, r, n) => {
    const i = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, o), i ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, a);
}
function ge(e) {
  return he({ ...e, state: !0, attribute: !1 });
}
const eo = [
  "battery",
  "graph",
  "media_player",
  "room",
  "scenes",
  "welcome_scenes"
], to = [
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
], Et = (e) => e.split("_").filter((t) => t.toLowerCase() !== "ulm").map((t) => ["nas", "mdi", "dwd", "vnc", "wifi", "http"].includes(t.toLowerCase()) ? t.toUpperCase() : `${t[0].toUpperCase()}${t.slice(1)}`).join(" "), ao = (e) => e === "custom_card_bar_card" ? "bar" : e === "custom_card_alarm_time" ? "alarm-time" : /alarm|alert|lock/.test(e) ? "security" : /navigate|back/.test(e) ? "navigation" : /battery/.test(e) ? "battery" : /power_outlet|more_power_outlet/.test(e) ? "control" : /energy|power|gauge|speedtest|graph|apex|bar_card|myenedis/.test(e) ? "energy" : /weather|sun|pollen|moon/.test(e) ? "weather" : /scene/.test(e) ? "scene" : /person|tracker|tracer|presence|room|welcome/.test(e) ? "presence" : /media|playstation/.test(e) ? "media" : /thermostat|heat_pump|aircondition|temperature|simple_temp/.test(e) ? "climate" : /cover|door|garage/.test(e) ? "cover" : /vacuum/.test(e) ? "vacuum" : /light/.test(e) ? "light" : /fan|outlet|boolean|script|washer|water_heater|qubino/.test(e) ? "control" : /input_number|input_datetime/.test(e) ? "sensor" : /title|subtitle|clock|date/.test(e) ? "text" : /camera/.test(e) ? "camera" : /sensor|elapsed|update|printer|nas|tablet|flower|car|afval|waste|counter/.test(e) ? "sensor" : "entity", oo = {
  card_media_player: ["default", "controls", "artwork"],
  card_room: ["default", "with-sensors"],
  card_scenes: ["list", "welcome"],
  custom_card_better_thermostat: ["normal", "compact"]
}, ro = (e, t) => e === "custom_card_alarm_time" ? ["input_boolean"] : /alarm/.test(e) ? ["alarm_control_panel"] : /lock/.test(e) ? ["lock"] : /power_outlet|more_power_outlet/.test(e) ? ["switch", "light"] : e.includes("binary_sensor") ? ["binary_sensor"] : e.includes("battery") ? ["sensor"] : e.includes("input_boolean") ? ["input_boolean"] : e.includes("input_number") ? ["input_number", "counter", "select", "input_select"] : e.includes("input_datetime") ? ["input_datetime"] : e.includes("light") ? ["light"] : /media|playstation/.test(e) ? ["media_player", "sensor"] : /thermostat|heat_pump|aircondition/.test(e) ? ["climate"] : /scene/.test(e) ? ["scene"] : /script/.test(e) ? ["script"] : /vacuum/.test(e) ? ["vacuum"] : /weather/.test(e) ? ["weather"] : /person/.test(e) ? ["person", "device_tracker"] : /cover|door|garage/.test(e) ? ["cover", "binary_sensor"] : /fan/.test(e) ? ["fan"] : /camera/.test(e) ? ["camera"] : /lock/.test(e) ? ["lock"] : /update/.test(e) ? ["update"] : t === "battery" || t === "energy" || t === "sensor" || t === "weather" ? ["sensor"] : t === "control" ? /fan/.test(e) ? ["fan"] : /script/.test(e) ? ["script"] : /washer/.test(e) ? ["switch", "sensor"] : /water_heater/.test(e) ? ["water_heater"] : ["switch", "input_boolean", "light"] : t === "presence" ? ["person", "device_tracker"] : ["sensor", "switch"], tt = (e, t) => {
  const a = e.replace(/^custom_(card|chip)_/, "").replace(/^(card|chip)_/, ""), o = e.replaceAll("_", "-").toLowerCase(), r = e === "custom_card_playstation" ? "mushroom-addition-custom-card-game-console" : o.startsWith("custom-card-") ? `mushroom-addition-${o}` : `mushroom-addition-card-${o.replace(/^card-/, "")}`, n = ao(e), i = e === "custom_card_playstation", l = {
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
    custom_card_better_thermostat: "Better Thermostat",
    custom_card_entity_carousel: "Entity Carousel"
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
    custom_card_better_thermostat: "Touch-friendly climate card with Better Thermostat status and controls.",
    custom_card_entity_carousel: "Dependency-free swipeable entity and action carousel with cover-flow navigation."
  };
  return {
    upstreamId: e,
    sourcePath: t,
    kind: "card",
    category: e.startsWith("custom_") ? "custom-card" : "default-card",
    family: n,
    tag: r,
    name: i ? "Game Console Card" : e === "custom_card_nas_metrics" ? "NAS Card" : `${l[e] ?? Et(a)} Card`,
    description: i ? "Mushroom-style Xbox, PlayStation, and Nintendo profile, activity, artwork, and control card." : e === "custom_card_nas_metrics" ? "Mushroom-style NAS status and utilization card." : s[e] ?? `Mushroom-style ${Et(a).toLowerCase()} card.`,
    variants: oo[e],
    variantLabels: void 0,
    preferredDomains: ro(e, n)
  };
}, ra = [
  ...eo.map((e) => {
    const t = {
      graph: "reference_catalog/cards/card_graph.yaml",
      scenes: "reference_catalog/cards/card_scenes_welcome.yaml"
    };
    return tt(
      `card_${e}`,
      t[e] ?? `reference_catalog/cards/card_${e}.yaml`
    );
  }),
  ...to.map((e) => tt(
    `custom_card_${e}`,
    e === "better_thermostat" ? "https://github.com/KartoffelToby/better-thermostat-ui-card" : `custom_cards/custom_card_${e}`
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
], no = [
  tt("custom_card_entity_carousel", "src/entity-carousel.ts")
], na = [
  {
    canonical: "card_scenes",
    sources: { card_scenes: "welcome-pills", custom_card_scenes: "scene-grid" },
    variants: ["welcome-pills", "scene-grid"],
    variantLabels: { "welcome-pills": "Welcome scene pills", "scene-grid": "Scene button grid" },
    name: "Scenes Card"
  }
], $e = /* @__PURE__ */ new Map();
for (const e of na)
  for (const t of Object.keys(e.sources)) $e.set(t, e);
const ia = new Set(na.map((e) => e.canonical)), Xe = [
  ...ra.filter((e) => !$e.has(e.upstreamId) || ia.has(e.upstreamId)).map((e) => {
    const t = $e.get(e.upstreamId);
    return t ? {
      ...e,
      name: t.name ?? e.name,
      description: t.description ?? e.description,
      variants: t.variants,
      variantLabels: t.variantLabels,
      sourceIds: Object.keys(t.sources)
    } : { ...e, sourceIds: [e.upstreamId] };
  }),
  ...no.map((e) => ({ ...e, sourceIds: [e.upstreamId] }))
], io = ra.filter((e) => $e.has(e.upstreamId) && !ia.has(e.upstreamId)).map((e) => {
  const t = $e.get(e.upstreamId), a = Xe.find((o) => o.upstreamId === t.canonical);
  return {
    upstreamId: e.upstreamId,
    tag: e.tag,
    targetId: a.upstreamId,
    targetTag: a.tag,
    variant: t.sources[e.upstreamId]
  };
}), dt = [
  ...io,
  {
    upstreamId: "custom_card_playstation",
    tag: "mushroom-addition-custom-card-playstation",
    targetId: "custom_card_playstation",
    targetTag: "mushroom-addition-custom-card-game-console"
  }
], Ye = Xe, so = (e) => Ye.find((t) => t.tag === e) ?? (() => {
  const t = dt.find((a) => a.tag === e);
  return t ? Xe.find((a) => a.tag === t.targetTag) : void 0;
})(), zt = (e) => $e.get(e)?.sources[e], at = [
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
], sa = (e, t, a = e.enabledByDefault) => ({
  preset: e.preset,
  enabled: a,
  entity: t,
  label: e.label,
  icon: e.icon,
  color: e.color
}), lo = () => at.map((e) => sa(e)), ue = (e) => {
  if (e.waste_streams?.length) return e.waste_streams.map((o) => ({ ...o }));
  const t = e.type.includes("custom-card-trash"), a = at.some((o) => o.legacyKey && typeof e[o.legacyKey] == "string");
  return !t && !a ? [] : at.map((o, r) => {
    const i = (o.legacyKey && typeof e[o.legacyKey] == "string" ? e[o.legacyKey] : void 0) ?? (r === 0 ? e.entity : void 0);
    return sa(o, i, i ? !0 : o.enabledByDefault);
  });
}, co = (e) => {
  const t = e.type.includes("custom-card-trash"), a = e.today_entity ?? (typeof e.ulm_card_ophaling_vandaag == "string" ? e.ulm_card_ophaling_vandaag : void 0), o = e.tomorrow_entity ?? (typeof e.ulm_card_ophaling_morgen == "string" ? e.ulm_card_ophaling_morgen : void 0);
  if (!t && !a && !o) return e;
  const r = e.waste_streams?.length ? e.waste_streams : ue(e);
  return {
    ...e,
    waste_streams: r.length ? r : e.waste_streams,
    today_entity: a,
    tomorrow_entity: o,
    show_today: e.show_today ?? !!a,
    show_tomorrow: e.show_tomorrow ?? !!o
  };
}, oe = /* @__PURE__ */ new Set([
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
]), $ = (e) => {
  if (!e) return "Entity unavailable";
  const t = e.attributes.unit_of_measurement;
  return t ? `${e.state} ${String(t)}` : e.state.replaceAll("_", " ");
}, Dt = (e) => {
  if (typeof e == "string") return e;
  const t = Array.isArray(e) ? e : [e];
  return t.every((a) => a.type === "text") ? t.map((a) => a.text ?? "").join(" ") : void 0;
}, K = (e, t, a) => {
  const o = e.name !== void 0 && typeof e.name != "string";
  return o && t && a?.formatEntityName ? a.formatEntityName(t, e.name) : o ? Dt(e.name) || t?.attributes.friendly_name || e.entity || "" : e.name_mode === "none" ? "" : e.name_mode === "entity" ? t?.attributes.friendly_name || e.entity || "" : e.name && t && a?.formatEntityName ? a.formatEntityName(t, e.name) : (e.name ? Dt(e.name) : void 0) || t?.attributes.friendly_name || e.entity || "";
}, ae = (e, t, a) => {
  e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    composed: !0,
    detail: a
  }));
}, uo = (e, t, a) => {
  ae(e, "hass-action", { config: t, action: a });
}, mo = (e) => {
  const t = ho(e), a = _o(t), o = String(t.type), r = o.includes("card-title"), n = o.includes("card-welcome-scenes"), i = o.includes("card-weather"), l = o.includes("custom-card-camera"), s = o.includes("card-weather-ulm") || t.variant === "native", d = o.includes("custom-card-sun") || o.includes("custom-card-thermostat-controls") ? { action: "none" } : void 0, m = String(a.type).includes("custom-card-qubino") ? a.qubino_more_info_entity ?? a.entity : void 0, g = o.endsWith("custom-card-pollen"), u = [
    a.download_entity,
    a.upload_entity,
    a.ping_entity
  ].filter((x) => typeof x == "string"), _ = String(a.type).includes("speedtest-gauges"), b = a.variant === "divider-title", v = a.variant === "divider-subtitle", I = _ ? {
    action: "perform-action",
    perform_action: "homeassistant.update_entity",
    target: { entity_id: u }
  } : v || b && !a.navigation_path ? { action: "none" } : g ? { action: "none" } : m ? { action: "more-info", entity: m } : a.navigation_path ? { action: "navigate", navigation_path: a.navigation_path } : d ?? { action: r || n ? "none" : a.entity ? "more-info" : "none" }, M = String(e.type).includes("card-room") && a.input_select_entity && a.input_select_option ? {
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
    tap_action: a.tap_action ?? I,
    show_controls: a.show_controls ?? (o.includes("card-vacuum") ? !0 : void 0),
    show_forecast: a.show_forecast ?? (i ? !s : void 0),
    hold_action: a.hold_action ?? (String(a.type).includes("water-heater") && a.entity ? { action: "more-info" } : void 0),
    double_tap_action: a.double_tap_action ?? M
  };
}, be = (e, t) => Object.entries(e).find(([a, o]) => t.test(a) && o !== void 0)?.[1], _o = (e) => {
  const t = be(e, /_name$/), a = be(e, /_icon$/), o = be(e, /_color$/), r = be(e, /_enable_(controls|buttons)$/), n = be(e, /_enable_slider$/), i = be(e, /_enable_horizontal$/);
  return {
    ...e,
    name: e.name ?? (typeof t == "string" ? t : void 0),
    icon: e.icon ?? (typeof a == "string" ? a : void 0),
    icon_color: e.icon_color ?? (typeof o == "string" ? o : void 0),
    navigation_path: e.navigation_path,
    show_controls: e.show_controls ?? (typeof r == "boolean" ? r : typeof n == "boolean" ? n : void 0),
    layout: e.layout ?? (i === !0 ? "horizontal" : void 0)
  };
}, po = [
  "ulm_card_media_player_entity",
  "ulm_card_graph_entity",
  "ulm_card_input_number_entity",
  "ulm_custom_card_entity_overview",
  "ulm_custom_card_weather_metrics"
], ho = (e) => {
  const t = co(e), a = t.primary_entity || po.map((n) => t[n]).find((n) => typeof n == "string"), o = (n) => {
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
      const d = s, m = o(d);
      if (m)
        return {
          entity: m,
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
  if (String(e.type).includes("entity-overview") && (r.entity ??= o(e.ulm_custom_card_entity_overview), r.entities ??= [1, 2, 3, 4].map((n) => o(e[`ulm_custom_card_entity_overview_entity_${n}`])).filter((n) => n !== void 0)), String(e.type).includes("internet-speed") && (r.download_entity ??= o(e.ulm_custom_card_internet_speed_download_speed_entity), r.upload_entity ??= o(e.ulm_custom_card_internet_speed_upload_speed_entity), r.ping_entity ??= o(e.ulm_custom_card_internet_speed_ping_entity), r.entity ??= r.download_entity), String(e.type).includes("weather-metrics") && (r.entity ??= o(e.ulm_custom_card_weather_metrics), r.temperature_entity ??= o(e.ulm_custom_card_weather_metrics_temperature_outside), r.date_entity ??= o(e.ulm_custom_card_weather_metrics_date), r.entities ??= [1, 2, 3, 4].map((n) => o(e[`ulm_custom_card_weather_metrics_entity_${n}`])).filter((n) => n !== void 0)), String(e.type).includes("custom-card-washer") && (r.entity ??= o(e.ulm_custom_card_washer_machine_state) ?? o(e.ulm_custom_card_washer_power), r.power_entity ??= o(e.ulm_custom_card_washer_power), r.ulm_custom_card_washer_machine_state ??= r.entity), String(e.type).includes("custom-card-thermostat-controls") && (r.entity ??= o(e.entity), r.variant ??= "buttons"), String(e.type).includes("media-player-sonos") && (r.entity ??= o(e.ulm_card_media_player_with_controls_entity)), String(e.type).includes("more-power-outlet") && (r.power_entity ??= o(
    e.custom_card_more_power_outlet_power_sensor ?? e.ulm_card_more_power_outlet_power_sensor ?? e.graph_entity
  ), r.energy_entity ??= o(
    e.custom_card_more_power_outlet_energy_sensor ?? e.ulm_card_more_power_outlet_energy_sensor
  ), r.time_entity ??= o(
    e.custom_card_more_power_outlet_time_sensor ?? e.ulm_card_more_power_outlet_time_sensor
  )), String(e.type).includes("gauge") && (r.minimum ??= Number(e.ulm_card_gauge_min ?? 0), r.maximum ??= Number(e.ulm_card_gauge_max ?? 100)), String(e.type).includes("printer") && (r.black_entity ??= o(e.ulm_card_printer_black_name), r.yellow_entity ??= o(e.ulm_card_printer_yellow_name), r.magenta_entity ??= o(e.ulm_card_printer_magenta_name), r.cyan_entity ??= o(e.ulm_card_printer_cyan_name)), String(e.type).endsWith("custom-card-pollen") && (r.trees_entity ??= o(e.custom_card_pollen_tree), r.grass_entity ??= o(e.custom_card_pollen_grass), r.weeds_entity ??= o(e.custom_card_pollen_weed)), String(e.type).includes("speedtest-gauges") && (r.download_entity ??= o(e.ulm_custom_card_speedtest_download_speed_entity) ?? r.entity, r.upload_entity ??= o(e.ulm_custom_card_speedtest_upload_speed_entity), r.ping_entity ??= o(e.ulm_custom_card_speedtest_ping_entity), r.entity = o(r.download_entity)), String(e.type).includes("custom-card-pollen-forecast") && (r.level_entity ??= o(e.level_entity), r.name ??= typeof e.ulm_custom_card_pollen_forecast_name == "string" ? e.ulm_custom_card_pollen_forecast_name : void 0, r.icon ??= typeof e.ulm_custom_card_pollen_forecast_icon == "string" ? e.ulm_custom_card_pollen_forecast_icon : void 0), String(e.type).includes("custom-card-scenes") || String(e.type).includes("card-scenes") && e.variant === "scene-grid") {
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
  return String(e.type).includes("vehicle-status") && (r.entity ??= o(e.ulm_card_vehicle_status_tracker), r.ulm_card_vehicle_status_tracker ??= r.entity, r.ulm_card_vehicle_status_energy_level ??= o(e.energy_entity) ?? o(e.battery_entity), r.ulm_card_vehicle_status_range ??= o(e.range_entity), r.ulm_card_vehicle_status_lock ??= o(e.lock_entity) ?? o(e.doors_entity)), String(e.type).includes("plant") && (r.entity ??= o(e.ulm_card_flower_entity), r.ulm_card_flower_entity ??= r.entity), r;
}, la = [
  { configKey: "crossfade_entity", domain: "switch", suffix: "crossfade", label: "Crossfade", icon: "mdi:swap-horizontal" },
  { configKey: "night_sound_entity", domain: "switch", suffix: "night_sound", label: "Night sound", icon: "mdi:weather-night" },
  { configKey: "speech_enhancement_entity", domain: "switch", suffix: "speech_enhancement", label: "Speech enhancement", icon: "mdi:ear-hearing" },
  { configKey: "subwoofer_entity", domain: "switch", suffix: "subwoofer_enabled", label: "Subwoofer", icon: "mdi:speaker-wireless" },
  { configKey: "surrounds_entity", domain: "switch", suffix: "surround_enabled", label: "Surrounds", icon: "mdi:surround-sound" },
  { configKey: "loudness_entity", domain: "switch", suffix: "loudness", label: "Loudness", icon: "mdi:bullhorn" },
  { configKey: "surround_full_entity", domain: "switch", suffix: "surround_music_full_volume", label: "Surround full", icon: "mdi:music-note-plus" }
], ca = [
  { configKey: "audio_delay_entity", domain: "number", suffix: "audio_delay", label: "Audio delay", icon: "mdi:tune-variant" },
  { configKey: "balance_entity", domain: "number", suffix: "balance", label: "Balance", icon: "mdi:tune-variant" },
  { configKey: "bass_entity", domain: "number", suffix: "bass", label: "Bass", icon: "mdi:tune-variant" },
  { configKey: "treble_entity", domain: "number", suffix: "treble", label: "Treble", icon: "mdi:tune-variant" },
  { configKey: "sub_gain_entity", domain: "number", suffix: "sub_gain", label: "Sub gain", icon: "mdi:tune-variant" },
  { configKey: "surround_level_entity", domain: "number", suffix: "surround_level", label: "Surround level", icon: "mdi:tune-variant" },
  { configKey: "music_surround_level_entity", domain: "number", suffix: "music_surround_level", label: "Surround level music", icon: "mdi:tune-variant" }
], ut = [...la, ...ca], mt = (e) => e.split(".", 2)[1] ?? e, Ot = (e) => mt(e).replace(/_\d+$/, ""), da = (e, t) => {
  if (!e.startsWith(`${t.domain}.`)) return !1;
  const a = mt(e);
  return t.suffix === "surround_level" && a.endsWith("_music_surround_level") ? !1 : a === t.suffix || a.endsWith(`_${t.suffix}`);
}, Tt = (e) => ut.filter((t) => e.some((a) => da(a, t))).length, _t = (e, t, a) => {
  if (!e || !t) return {};
  const o = Object.keys(e.states), r = e.entities ?? {}, n = Ot(t), i = [.../* @__PURE__ */ new Set([t, ...o.filter((u) => u.startsWith("media_player.") && Ot(u) === n)])], d = [...new Set(i.map((u) => r[u]?.device_id).filter((u) => typeof u == "string" && u.length > 0))].map((u) => o.filter((_) => r[_]?.device_id === u)).sort((u, _) => Tt(_) - Tt(u))[0] ?? [], m = o.filter((u) => {
    const _ = u.split(".", 1)[0], b = mt(u);
    return ["switch", "number"].includes(_) && (b === n || b.startsWith(`${n}_`));
  }), g = [.../* @__PURE__ */ new Set([...d, ...m])];
  return Object.fromEntries(ut.flatMap((u) => {
    const _ = a?.[u.configKey];
    if (typeof _ == "string" && _.length > 0) return [[u.configKey, _]];
    const b = g.find((v) => da(v, u));
    return b ? [[u.configKey, b]] : [];
  }));
}, Lt = (e, t) => Object.keys(_t(e, t)).length, ua = [
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
], ot = (e) => e.split(".", 2)[1] ?? e, ma = (e) => e.toLowerCase().replace(/[^a-z0-9]+/g, "_"), go = (e, t, a) => {
  const o = t.split(".", 1)[0];
  if (!a.domains.includes(o)) return !1;
  const r = e?.states[t], n = ma([
    ot(t),
    r?.attributes.friendly_name
  ].filter(Boolean).join(" "));
  return a.terms.some((i) => n.includes(i));
}, pt = (e, t, a) => {
  if (!e || !t) return {};
  const o = e.entities?.[t]?.device_id, n = ot(t).split(/_(?:console|status|online|power)$/)[0], i = Object.keys(e.states).filter((l) => {
    const s = o && e.entities?.[l]?.device_id === o, d = ot(l);
    return s || d === n || d.startsWith(`${n}_`);
  });
  return Object.fromEntries(ua.flatMap((l) => {
    const s = a?.[l.configKey];
    if (typeof s == "string" && s.length > 0)
      return [[l.configKey, s]];
    const d = i.find((m) => go(e, m, l));
    return d ? [[l.configKey, d]] : [];
  }));
}, _a = (e, t, a) => {
  const o = a?.console_platform;
  if (o === "xbox" || o === "playstation" || o === "nintendo") return o;
  const r = t ? e?.states[t] : void 0, n = ma([
    t,
    r?.attributes.friendly_name,
    t ? e?.entities?.[t]?.platform : void 0
  ].filter(Boolean).join(" "));
  return n.includes("xbox") || n.includes("gamer") ? "xbox" : n.includes("playstation") || /(?:^|_)ps[345](?:_|$)/.test(n) ? "playstation" : n.includes("nintendo") || n.includes("switch") ? "nintendo" : "generic";
}, bo = (e) => {
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
}, Nt = {
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
    carousel_loop: "Loop continuously",
    carousel_show_labels: "Show selected item label",
    carousel_visible_items: "Visible carousel items",
    carousel_initial_index: "Initial selected item",
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
}, yo = (e, t) => {
  const a = e?.language?.split("-")[0] ?? "en";
  return Nt[a]?.[t] ?? Nt.en[t] ?? t.replace(/^ulm_(?:custom_)?card_/, "").replace(/^(?:custom_)?card_/, "").replace(/^ulm_/, "").replaceAll("_", " ").replace(/\b\w/g, (o) => o.toUpperCase());
}, fo = {
  entity: "The Home Assistant entity shown and controlled by this card.",
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
}, vo = (e) => fo[e], wo = [
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
], ht = new Map(wo.map((e) => [e.upstreamId, e])), $o = (e) => /popup|browser_mod/i.test(e), xo = {
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
}, pa = /* @__PURE__ */ new Set([
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
]), ko = (e, t) => pa.has(t) || (xo[e.upstreamId]?.includes(t) ?? !1), So = {
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
}, Io = {
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
}, ha = (e, t) => !$o(t) && ([e.upstreamId, ...e.sourceIds ?? []].some((a) => Io[a]?.includes(t) === !0) || So[e.family]?.includes(t) === !0), Je = [
  { key: "temperature", label: "Temperature", icon: "mdi:thermometer", min: -10, max: 50 },
  { key: "humidity", label: "Humidity", icon: "mdi:water-percent", min: 0, max: 100 },
  { key: "moisture", label: "Moisture", icon: "mdi:water", min: 0, max: 100 },
  { key: "conductivity", label: "Conductivity", icon: "mdi:flash", min: 0, max: 3e3 },
  { key: "illuminance", label: "Illuminance", icon: "mdi:white-balance-sunny", min: 0, max: 1e5 },
  { key: "dli", label: "Daily light integral", icon: "mdi:leaf", min: 0, max: 30 }
], Ao = new Set(Je.map(({ key: e }) => e)), ga = (e) => {
  const t = e?.ulm_card_flower_show_bars;
  return Array.isArray(t) ? [...new Set(t)].filter((a) => typeof a == "string" && Ao.has(a)) : Je.map(({ key: a }) => a);
}, ba = (e) => `${e}_entity`, p = (e, t = "entity") => ({
  name: t,
  selector: { entity: e?.length ? { domain: e } : {} }
}), D = (e) => ({ name: e, selector: { text: {} } }), Ft = (e) => ({ name: e, selector: { navigation: {} } }), S = (e) => ({ name: e, selector: { boolean: {} } }), O = (e, t = 1, a = 168) => ({
  name: e,
  selector: { number: { min: t, max: a, mode: "box" } }
}), Ge = (e) => ({
  name: e,
  selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
}), re = (e) => ({ name: e, selector: { ui_action: {} } }), T = (e, t) => ({
  name: e,
  selector: { select: { mode: "dropdown", options: t } }
}), Mo = {
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
}, J = (e) => ({
  name: e,
  selector: { ui_color: { default_color: Mo[e] } }
}), Ae = (e) => ({ ...e, presentation: !0 }), Co = (e) => ({
  type: "grid",
  name: "",
  schema: e,
  presentation: !0
}), Po = /* @__PURE__ */ new Set([
  "ulm_card_battery_battery_level_danger",
  "ulm_card_battery_battery_level_warning"
]), Vo = /* @__PURE__ */ new Set([
  "ulm_custom_card_bar_card_indicator",
  "ulm_custom_card_bar_card_show_icon",
  "ulm_custom_card_bar_card_value",
  "ulm_card_media_player_collapsible",
  "ulm_card_media_player_idle_off",
  "ulm_card_media_player_more_info",
  "ulm_card_media_player_power_button",
  "ulm_card_media_player_force_background_color"
]), Eo = /* @__PURE__ */ new Set([
  "ulm_custom_card_bar_card_min",
  "ulm_custom_card_bar_card_max",
  "ulm_card_graph_hours",
  "ulm_card_graph_line_width",
  "ulm_card_graph_points",
  "ulm_card_media_player_enable_volume_adjust"
]), zo = /* @__PURE__ */ new Set([
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
]), Do = {}, z = () => [
  Ae({
    name: "name",
    selector: { entity_name: {} },
    context: { entity: "entity" }
  }),
  Ae({
    name: "icon",
    selector: { icon: {} },
    context: { icon_entity: "entity" }
  }),
  Ae({
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
  Ae(S("multiline_secondary")),
  Ae(S("fill_container")),
  Co([
    T("primary_info", [
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" }
    ]),
    T("secondary_info", [
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" }
    ]),
    T("icon_type", [
      { value: "icon", label: "Icon" },
      { value: "entity-picture", label: "Entity picture" },
      { value: "none", label: "None" }
    ])
  ])
], Oo = /* @__PURE__ */ new Set([
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
]), ya = (e) => e.flatMap((t) => t.name === "icon" || t.name === "icon_type" ? [] : t.schema ? [{ ...t, schema: ya(t.schema) }] : [t]), To = (e) => {
  if (!e.some((i) => i.presentation)) return e;
  const t = e.filter((i) => i.presentation), a = /* @__PURE__ */ new Set(["name", "icon"]), o = e.filter((i) => !i.presentation && !a.has(i.name) && !pa.has(i.name)), r = o.findIndex((i) => i.name === "entity");
  if (r < 0) return [...t, ...o];
  const [n] = o.splice(r, 1);
  return [n, ...t, ...o];
}, Lo = (e) => {
  const t = { ...e };
  return delete t.presentation, t;
}, W = (e) => [
  p(e.preferredDomains),
  ...e.variants?.length ? [T("variant", e.variants.map((t) => ({
    value: t,
    label: e.variantLabels?.[t] ?? t.replaceAll("-", " ").replace(/\b\w/g, (a) => a.toUpperCase())
  })))] : [],
  ...z()
], jt = {
  weather: (e) => [
    ...W(e),
    p(["sensor"], "temperature_entity"),
    p(["sensor"], "humidity_entity"),
    S("show_forecast")
  ],
  climate: (e) => [...W(e), p(["sensor"], "humidity_entity"), S("show_controls")],
  light: (e) => [...W(e)],
  scene: (e) => [
    ...e.upstreamId === "card_welcome_scenes" ? [p(), ...z()] : W(e),
    ...e.upstreamId === "card_welcome_scenes" ? [
      p(["input_boolean"], "collapse_entity"),
      p(["weather"], "weather_entity"),
      Ft("settings_path"),
      S("collapsed")
    ] : []
  ],
  presence: (e, t) => [
    ...W(e),
    ...e.upstreamId === "card_room" ? [] : [
      ...t?.variant === "small" ? [] : [
        p(["sensor"], "battery_entity"),
        p(["sensor"], "eta_entity"),
        p(["sensor"], "address_entity")
      ]
    ]
  ],
  battery: (e) => [
    ...W(e),
    Ge("battery_warning_threshold"),
    Ge("battery_low_threshold"),
    Ge("battery_critical_threshold"),
    J("battery_healthy_color"),
    J("battery_warning_color"),
    J("battery_low_color"),
    J("battery_critical_color")
  ],
  bar: (e) => [...W(e)],
  energy: (e) => [...W(e), p(["sensor"], "min_entity"), p(["sensor"], "max_entity"), S("show_graph")],
  sensor: (e) => [...W(e), S("show_graph")],
  media: (e) => [...W(e), S("show_controls")],
  cover: (e) => [...W(e), S("show_controls")],
  security: (e) => [...W(e)],
  navigation: (e) => [
    ...e.variants?.length ? [T("variant", e.variants.map((t) => ({
      value: t,
      label: e.variantLabels?.[t] ?? t
    })))] : [],
    ...z(),
    Ft("navigation_path")
  ],
  text: () => [...z(), D("secondary")],
  camera: (e) => [...W(e)],
  control: (e) => [
    ...W(e),
    .../power_outlet|more_power_outlet/.test(e.upstreamId) ? [p(["sensor"], "graph_entity"), S("show_graph")] : [],
    S("show_controls")
  ],
  "alarm-time": (e) => [...W(e), p(["input_datetime"], "datetime_entity"), S("show_controls")],
  door: (e) => [...W(e), p(["lock"], "lock_entity"), p(["sensor"], "battery_entity"), S("show_controls")],
  entity: (e) => [...W(e), D("secondary")]
}, fa = (e, t) => {
  if (e.upstreamId === "mini_graph_card")
    return [
      p(["sensor", "binary_sensor", "input_number"]),
      ...z(),
      T("variant", [
        { value: "line", label: "Line graph" },
        { value: "bar", label: "Bar graph" }
      ]),
      T("aggregate_func", [
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
      T("group_by", [
        { value: "interval", label: "Dynamic interval" },
        { value: "hour", label: "Hour" },
        { value: "date", label: "Date" }
      ]),
      O("hours_to_show", 1, 8760),
      O("points_per_hour", 0.01, 60),
      O("update_interval", 1, 86400),
      S("cache"),
      O("height", 0, 1e3),
      O("line_width", 1, 20),
      O("bar_spacing", 0, 50),
      S("smoothing"),
      S("animate"),
      S("logarithmic"),
      O("value_factor", -12, 12),
      O("decimals", 0, 12),
      S("hour24"),
      O("font_size", 25, 300),
      O("font_size_header", 8, 48),
      T("align_header", [
        { value: "default", label: "Automatic" },
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ]),
      T("align_icon", [
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
        { value: "state", label: "Beside state" }
      ]),
      T("align_state", [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ]),
      D("unit"),
      D("icon_image"),
      D("lower_bound"),
      D("upper_bound"),
      O("min_bound_range", 0, 1e6),
      D("lower_bound_secondary"),
      D("upper_bound_secondary"),
      O("min_bound_range_secondary", 0, 1e6),
      T("color_thresholds_transition", [
        { value: "smooth", label: "Smooth gradient" },
        { value: "hard", label: "Hard color steps" }
      ]),
      S("group"),
      T("mini_graph_show_state", [
        { value: "current", label: "Current state" },
        { value: "last", label: "Last graph value" },
        { value: "hidden", label: "Hidden" }
      ]),
      T("mini_graph_show_fill", [
        { value: "solid", label: "Solid fill" },
        { value: "fade", label: "Faded fill" },
        { value: "hidden", label: "No fill" }
      ]),
      T("mini_graph_show_points", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" }
      ]),
      T("mini_graph_show_labels", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" }
      ]),
      T("mini_graph_show_labels_secondary", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" }
      ]),
      S("mini_graph_show_legend"),
      S("mini_graph_show_average"),
      S("mini_graph_show_extrema"),
      S("mini_graph_name_adaptive_color"),
      S("mini_graph_icon_adaptive_color"),
      S("mini_graph_loading_indicator"),
      re("tap_action"),
      re("hold_action"),
      re("double_tap_action")
    ];
  const a = [
    ...e.upstreamId === "card_room" ? [
      p(),
      S("label_use_temperature"),
      S("label_use_brightness"),
      p(["input_select"], "input_select_entity"),
      D("input_select_option"),
      ...z()
    ] : e.upstreamId === "card_scenes" ? [
      ...e.variants?.length ? [T("variant", e.variants.map((r) => ({
        value: r,
        label: e.variantLabels?.[r] ?? r
      })))] : [],
      ...z()
    ] : e.upstreamId === "custom_card_trash" ? [
      p(["sensor", "calendar"]),
      S("show_today"),
      p(["sensor"], "today_entity"),
      S("show_tomorrow"),
      p(["sensor"], "tomorrow_entity"),
      ...z()
    ] : e.upstreamId === "custom_card_entity_carousel" ? [
      p(),
      ...z(),
      S("carousel_loop"),
      S("carousel_show_labels"),
      O("carousel_visible_items", 3, 11),
      O("carousel_initial_index", 0, 50)
    ] : e.upstreamId === "custom_card_playstation" ? [
      p(["binary_sensor", "media_player", "remote", "sensor", "switch"]),
      T("console_platform", [
        { value: "auto", label: "Automatic" },
        { value: "xbox", label: "Xbox" },
        { value: "playstation", label: "PlayStation" },
        { value: "nintendo", label: "Nintendo" }
      ]),
      S("console_show_artwork"),
      S("console_show_controls"),
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
      ...z()
    ] : e.upstreamId === "custom_card_alarm_time" ? [
      p(["input_boolean", "switch"]),
      p(["input_datetime"], "datetime_entity"),
      O("ulm_card_alarm_time_step", 1, 180),
      S("ulm_card_alarm_time_collapse"),
      S("ulm_card_alarm_time_horizontal"),
      { name: "ulm_card_alarm_time_icon", selector: { icon: {} } },
      J("ulm_card_alarm_time_color"),
      ...z()
    ] : e.upstreamId === "custom_card_better_thermostat" ? [
      p(["climate"]),
      T("variant", [
        { value: "normal", label: "Normal" },
        { value: "compact", label: "Compact" }
      ]),
      ...z(),
      p(["binary_sensor"], "window_sensor"),
      p(["sensor"], "humidity_entity"),
      p(["sensor"], "battery_entity"),
      S("show_controls"),
      S("show_temperature_control"),
      S("show_humidity"),
      S("show_hvac_modes"),
      S("show_presets"),
      S("show_status"),
      S("collapsible_controls"),
      O("thermostat_temp_step", 0.1, 5),
      Ge("low_battery_threshold")
    ] : e.upstreamId === "custom_card_camera" ? [
      p(["camera"]),
      ...z(),
      T("camera_view", [
        { value: "auto", label: "Automatic" },
        { value: "live", label: "Live stream" }
      ]),
      T("fit_mode", [
        { value: "cover", label: "Crop to fill" },
        { value: "contain", label: "Fit entire image" },
        { value: "fill", label: "Stretch to fill" }
      ]),
      D("aspect_ratio"),
      O("image_height", 80, 1200)
    ] : e.upstreamId === "custom_card_media_player_sonos" ? [
      p(["media_player"]),
      ...z(),
      S("ulm_card_media_player_enable_art"),
      S("sonos_details_always_visible"),
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
      ...z()
    ] : e.upstreamId === "custom_card_gauge" ? [
      p(["sensor"]),
      O("minimum", -1e5, 1e5),
      O("maximum", -1e5, 1e5),
      ...z()
    ] : e.upstreamId === "custom_card_printer" ? [
      p(["sensor", "binary_sensor"]),
      p(["sensor"], "black_entity"),
      p(["sensor"], "yellow_entity"),
      p(["sensor"], "magenta_entity"),
      p(["sensor"], "cyan_entity"),
      ...z()
    ] : e.upstreamId === "custom_card_pollen_forecast" ? [
      p(["sensor"]),
      p(["sensor"], "level_entity"),
      { name: "ulm_custom_card_pollen_forecast_icon", selector: { icon: {} } },
      T("pollen_language", [
        { value: "en", label: "English" },
        { value: "de", label: "German" },
        { value: "es", label: "Spanish" },
        { value: "pl", label: "Polish" }
      ]),
      ...z()
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
      ...z()
    ] : e.upstreamId === "custom_card_room_overview" ? [
      p(),
      p(["light"], "ulm_custom_card_room_overview_light_entity"),
      p(["climate"], "ulm_custom_card_room_overview_climate_entity"),
      p(["cover"], "ulm_custom_card_room_overview_cover_entity"),
      { name: "ulm_card_room_overview_light_icon_on", selector: { icon: {} } },
      { name: "ulm_card_room_overview_light_icon_off", selector: { icon: {} } },
      { name: "ulm_card_room_overview_cover_icon_open", selector: { icon: {} } },
      { name: "ulm_card_room_overview_cover_icon_closed", selector: { icon: {} } },
      S("ulm_card_dynamic_color"),
      D("secondary"),
      ...z()
    ] : e.upstreamId === "custom_card_welcome" ? [
      p(["person"]),
      p(["input_boolean"], "ulm_card_welcome_collapse"),
      p(["weather"], "ulm_weather"),
      ...Array.from({ length: 5 }, (r, n) => n + 1).flatMap((r) => [
        D(`nav_${r}`),
        { name: `icon_${r}`, selector: { icon: {} } },
        D(`name_${r}`),
        T(`color_${r}`, ["blue", "red", "green", "yellow", "pink", "purple"].map((n) => ({
          value: n,
          label: n[0].toUpperCase() + n.slice(1)
        })))
      ]),
      ...z()
    ] : e.upstreamId === "custom_card_vehicle_status" ? [
      p(["device_tracker", "sensor"]),
      p(["device_tracker", "sensor"], "ulm_card_vehicle_status_tracker"),
      p(["lock", "binary_sensor"], "ulm_card_vehicle_status_lock"),
      p(["sensor"], "ulm_card_vehicle_status_energy_level"),
      p(["sensor"], "ulm_card_vehicle_status_range"),
      ...z()
    ] : e.upstreamId === "custom_card_plant" ? [
      p(["plant", "sensor"]),
      D("ulm_card_flower_species"),
      {
        name: "ulm_card_flower_show_bars",
        selector: {
          select: {
            multiple: !0,
            options: Je.map(({ key: r, label: n }) => ({ value: r, label: n }))
          }
        }
      },
      ...ga(t).map((r) => p(["sensor", "number", "input_number"], ba(r))),
      ...z()
    ] : e.upstreamId === "custom_card_washer" ? [
      p(["sensor", "switch", "binary_sensor"]),
      p(["sensor", "switch", "binary_sensor"], "power_entity"),
      p(["sensor", "binary_sensor"], "door_entity"),
      p(["sensor", "binary_sensor"], "finished_entity"),
      p(["sensor", "binary_sensor"], "ulm_custom_card_washer_remote_control"),
      p(["sensor"], "ulm_custom_card_washer_job_progress"),
      p(["input_boolean"], "ulm_custom_card_washer_delayed_start"),
      p(["input_datetime"], "ulm_custom_card_washer_delayed_starttime"),
      D("ulm_custom_card_washer_machine_stop_state"),
      { name: "ulm_custom_card_washer_job_states", selector: { object: {} } },
      D("ulm_custom_card_washer_label_idle"),
      D("ulm_custom_card_washer_label_configuring"),
      D("ulm_custom_card_washer_label_running"),
      re("ulm_custom_card_washer_start_action"),
      re("ulm_custom_card_washer_pause_action"),
      re("ulm_custom_card_washer_stop_action"),
      ...z()
    ] : e.upstreamId === "custom_card_sun" ? [
      p(["sun"]),
      D("title"),
      T("language", [
        { value: "en", label: "English" },
        { value: "de", label: "German" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "nl", label: "Dutch" },
        { value: "pl", label: "Polish" }
      ]),
      T("timeFormat", [
        { value: "24h", label: "24-hour time" },
        { value: "12h", label: "12-hour time" }
      ]),
      S("darkMode"),
      S("showAzimuth"),
      S("showElevation"),
      ...z()
    ] : e.upstreamId === "custom_card_pollen" ? [
      p(["sensor"]),
      p(["sensor"], "trees_entity"),
      D("custom_card_pollen_tree_name"),
      { name: "custom_card_pollen_tree_icon", selector: { icon: {} } },
      p(["sensor"], "grass_entity"),
      D("custom_card_pollen_grass_name"),
      { name: "custom_card_pollen_grass_icon", selector: { icon: {} } },
      p(["sensor"], "weeds_entity"),
      D("custom_card_pollen_weed_name"),
      { name: "custom_card_pollen_weed_icon", selector: { icon: {} } },
      ...z()
    ] : e.upstreamId === "custom_card_speedtest_gauges" ? [
      p(["sensor"]),
      p(["sensor"], "download_entity"),
      J("ulm_custom_card_speedtest_download_speed_color"),
      O("ulm_custom_card_speedtest_download_speed_max", 1, 1e5),
      p(["sensor"], "upload_entity"),
      J("ulm_custom_card_speedtest_upload_speed_color"),
      O("ulm_custom_card_speedtest_upload_speed_max", 1, 1e5),
      p(["sensor"], "ping_entity"),
      J("ulm_custom_card_speedtest_ping_color"),
      O("ulm_custom_card_speedtest_ping_max", 1, 1e5),
      S("ulm_custom_card_speedtest_round"),
      ...z()
    ] : e.upstreamId === "custom_card_nas_metrics" ? [
      p(["binary_sensor", "sensor", "switch"]),
      p(["sensor"], "disk_entity"),
      D("disk_name"),
      { name: "disk_icon", selector: { icon: {} } },
      J("disk_color"),
      p(["sensor"], "temperature_entity"),
      D("temperature_name"),
      { name: "temperature_icon", selector: { icon: {} } },
      J("temperature_color"),
      O("temperature_max", 1, 1e5),
      p(["sensor"], "memory_entity"),
      D("memory_name"),
      { name: "memory_icon", selector: { icon: {} } },
      J("memory_color"),
      O("memory_max", 1, 1e5),
      p(["sensor"], "cpu_entity"),
      D("cpu_name"),
      { name: "cpu_icon", selector: { icon: {} } },
      J("cpu_color"),
      O("cpu_max", 1, 1e5),
      ...z()
    ] : e.upstreamId === "custom_card_input_datetime" ? [
      p(["input_datetime"]),
      ...z()
    ] : e.upstreamId === "custom_card_entity_overview" ? [
      p(),
      { name: "ulm_custom_card_entity_overview_icon", selector: { icon: {} } },
      ...[1, 2, 3, 4].flatMap((r) => [
        p(void 0, `ulm_custom_card_entity_overview_entity_${r}`),
        D(`ulm_custom_card_entity_overview_name_${r}`)
      ]),
      ...z()
    ] : e.upstreamId === "custom_card_internet_speed" ? [
      p(["sensor"]),
      p(["sensor"], "download_entity"),
      p(["sensor"], "upload_entity"),
      p(["sensor"], "ping_entity"),
      D("ulm_custom_card_internet_speed_router_name"),
      D("ulm_custom_card_internet_speed_router_model"),
      J("ulm_custom_card_internet_speed_color"),
      ...z()
    ] : e.upstreamId === "custom_card_weather_metrics" ? [
      p(["weather"]),
      p(["sensor"], "temperature_entity"),
      p(["sensor"], "date_entity"),
      ...[1, 2, 3, 4].flatMap((r) => [
        p(void 0, `ulm_custom_card_weather_metrics_entity_${r}`),
        D(`ulm_custom_card_weather_metrics_name_${r}`)
      ]),
      ...z()
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
      ...z()
    ] : (jt[e.family] ?? jt.entity)(e, t)
  ], o = Oo.has(e.upstreamId) ? ya(a) : a;
  return [
    ...To(o).map(Lo),
    re("tap_action"),
    re("hold_action"),
    re("double_tap_action")
  ];
}, No = (e, t) => {
  const a = t?.variant ? (e.sourceIds ?? [e.upstreamId]).filter((r) => zt(r) === t.variant || r === e.upstreamId && zt(r) === void 0) : e.sourceIds ?? [e.upstreamId];
  return [...new Map(
    a.flatMap((r) => ht.get(r)?.variables ?? []).map((r) => [r.name, r])
  ).values()].filter((r) => ha(e, r.name)).filter((r) => !ko(e, r.name)).filter((r) => !zo.has(r.name)).map((r) => {
    const n = Do[r.name];
    if (n) return T(r.name, n);
    if (Vo.has(r.name)) return S(r.name);
    if (Eo.has(r.name)) return O(r.name, -1e5, 1e5);
    if (Po.has(r.name))
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
        return re(r.name);
      case "icon":
        return { name: r.name, selector: { icon: {} } };
      case "color":
        return J(r.name);
      case "boolean":
        return S(r.name);
      case "number":
        return O(r.name, -1e5, 1e5);
      case "object":
        return { name: r.name, selector: { object: {} } };
      default:
        return D(r.name);
    }
  });
}, va = (e) => new Set(e.flatMap((t) => t.schema ? [...va(t.schema)] : t.name ? [t.name] : [])), Fo = (e, t) => {
  const a = va(fa(e, t));
  return No(e, t).filter((o) => !a.has(o.name));
}, jo = [
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
], wa = (e, t) => t?.attributes.icon ? t.attributes.icon : e.upstreamId === "custom_card_trash" ? "mdi:trash-can-outline" : e.upstreamId === "custom_card_room_overview" ? "mdi:sofa" : e.upstreamId === "custom_card_roomview" ? "mdi:home-variant-outline" : e.upstreamId === "custom_card_entity_carousel" ? "mdi:view-carousel" : jo.find(([a]) => a.test(e.upstreamId))?.[1] ?? "mdi:information-outline", Ho = (e) => {
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
}, Go = (e) => {
  const t = {};
  for (const a of e.sourceIds ?? [e.upstreamId])
    for (const o of ht.get(a)?.variables ?? []) {
      if (!ha(e, o.name)) continue;
      const r = Ho(o.defaultValue);
      r !== void 0 && (t[o.name] = r);
    }
  return t;
}, $a = (e, t, a) => {
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
    ..._t(t, a)
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
  } : e.upstreamId === "custom_card_entity_carousel" ? {
    carousel_loop: !0,
    carousel_show_labels: !0,
    carousel_visible_items: 7,
    carousel_initial_index: 0
  } : e.upstreamId === "custom_card_playstation" ? {
    icon: "mdi:controller-classic",
    console_platform: "auto",
    console_show_artwork: !0,
    console_show_controls: !0,
    ...pt(t, a)
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
    ...Go(e),
    ...r,
    entity: a,
    entities: e.upstreamId === "mini_graph_card" && a ? [a] : void 0,
    waste_streams: e.upstreamId === "custom_card_trash" ? lo() : void 0,
    show_today: e.upstreamId === "custom_card_trash" ? !1 : void 0,
    show_tomorrow: e.upstreamId === "custom_card_trash" ? !1 : void 0,
    name: void 0,
    icon: n ? void 0 : r.icon ?? wa(e, o),
    show_icon: !0,
    show_state: e.upstreamId !== "custom_card_pollen",
    layout: "default"
  };
}, Bo = {
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
}, fe = (e, t = "") => {
  const a = t ? e?.states[t] : void 0, o = t.split(".", 1)[0];
  return {
    entity: t,
    name: a?.attributes.friendly_name,
    icon: a?.attributes.icon ?? Bo[o] ?? "mdi:gesture-tap-button",
    icon_type: a?.attributes.entity_picture ? "entity-picture" : "icon",
    color: "purple",
    tap_action: { action: "toggle" }
  };
};
var Uo = Object.defineProperty, Ro = Object.getOwnPropertyDescriptor, gt = (e, t, a, o) => {
  for (var r = o > 1 ? void 0 : o ? Ro(t, a) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = (o ? i(t, a, r) : i(r)) || r);
  return o && r && Uo(t, a, r), r;
};
const Wo = [
  { id: "context", title: "Context", icon: "mdi:shape-outline" },
  { id: "content", title: "Content", icon: "mdi:format-align-left" },
  { id: "layout", title: "Layout", icon: "mdi:view-dashboard-outline" },
  { id: "interactions", title: "Interactions", icon: "mdi:gesture-tap" },
  { id: "features", title: "Features", icon: "mdi:view-list" }
], qo = /* @__PURE__ */ new Set([
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
]), Ko = /* @__PURE__ */ new Set([
  "layout",
  "fill_container",
  "variant",
  "aspect_ratio",
  "image_height",
  "fit_mode",
  "camera_view",
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
  "carousel_initial_index"
]), Xo = /* @__PURE__ */ new Set([
  "tap_action",
  "hold_action",
  "double_tap_action",
  "navigation_path",
  "settings_path"
]), Ht = (e) => e.name === "entity" ? "context" : Xo.has(e.name) || e.name.endsWith("_action") ? "interactions" : Ko.has(e.name) || e.name.endsWith("_horizontal") || e.name.endsWith("_narrow_buttons") ? "layout" : qo.has(e.name) ? "content" : "features", Yo = (e) => {
  const t = {
    context: [],
    content: [],
    layout: [],
    interactions: [],
    features: []
  };
  for (const a of e) {
    if (!a.schema?.length) {
      t[Ht(a)].push(a);
      continue;
    }
    const o = /* @__PURE__ */ new Map();
    for (const r of a.schema) {
      const n = Ht(r);
      o.set(n, [...o.get(n) ?? [], r]);
    }
    for (const [r, n] of o) t[r].push({ ...a, schema: n });
  }
  return t;
};
let De = class extends se {
  constructor() {
    super(...arguments), this.computeLabel = (e) => this.config?.type.includes("custom-card-trash") && e.name === "entity" ? "Optional card entity" : yo(this.hass, e.name), this.computeHelper = (e) => vo(e.name), this.valueChanged = (e) => {
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
        for (const { configKey: o } of ut)
          this.config[o] === void 0 && delete a[o];
      if (this.config.type.includes("custom-card-playstation") && typeof t.entity == "string" && t.entity !== this.config.entity)
        for (const { configKey: o } of ua)
          this.config[o] === void 0 && delete a[o];
      this.config = a, ae(this, "config-changed", { config: a });
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
        ...ue(this.config),
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
    const t = e.type.replace(/^custom:/, ""), a = dt.find((o) => o.tag === t);
    this.config = {
      ...e,
      variant: e.variant ?? a?.variant
    };
  }
  render() {
    if (!this.hass || !this.config) return h;
    const e = so(this.config.type.replace(/^custom:/, ""));
    if (!e) return h;
    const t = fa(e, this.config), a = Fo(e, this.config).filter((d) => e.upstreamId !== "custom_card_trash" || !d.name.startsWith("ulm_card_datum_") && !d.name.includes("ophaling")), o = Yo([...t, ...a]), r = $a(e, this.hass, this.config.entity), n = this.config.show, i = {
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
      layout: (this.config.layout ?? r.layout) === "default" ? "horizontal" : this.config.layout ?? r.layout
    }, l = e.upstreamId === "mini_graph_card" ? this.renderMiniGraphEditors() : e.upstreamId === "custom_card_trash" ? this.renderWasteStreamEditor() : e.upstreamId === "custom_card_media_player_sonos" ? this.renderSonosShortcutEditor() : e.upstreamId === "custom_card_entity_carousel" ? this.renderCarouselItemEditor() : e.family === "scene" ? this.renderItemEditor(
      "scene_items",
      "Scene buttons",
      e.upstreamId === "card_welcome_scenes" ? void 0 : ["scene"]
    ) : e.upstreamId === "card_room" ? this.renderItemEditor("room_sensors", "Room sensor buttons") : h, s = e.upstreamId === "mini_graph_card" || e.upstreamId === "custom_card_trash" || e.upstreamId === "custom_card_media_player_sonos" || e.upstreamId === "custom_card_entity_carousel" || e.family === "scene" || e.upstreamId === "card_room";
    return c`
      <div class="editor-sections">
        ${Wo.map((d) => this.renderEditorSection(
      d,
      o[d.id],
      i,
      d.id === "features" && s ? l : h,
      d.id === "features" && s
    ))}
      </div>
    `;
  }
  renderEditorSection(e, t, a, o, r) {
    return !t.length && !r ? h : c`
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
          ${o}
        </div>
      </ha-expansion-panel>
    `;
  }
  renderItemEditor(e, t, a) {
    if (!this.config) return h;
    const o = this.config[e] ?? [], r = (o.length ? o : (this.config.entities ?? []).map((n) => ({ entity: n }))).map((n) => e === "scene_items" ? { ...fe(this.hass, n.entity), ...n } : n);
    return c`
      <section class="item-editor">
        <h3>${t}</h3>
        <p>Each button starts with sensible values from its entity. You can override every value, including its name.</p>
        ${r.map((n, i) => c`
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
        ${a.map((n, i) => c`
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
    this.config = t, ae(this, "config-changed", { config: t });
  }
  renderWasteStreamEditor() {
    if (!this.config) return h;
    const e = ue(this.config);
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
        ${e.map((a, o) => c`
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
    return c`
      <section class="item-editor carousel-item-editor">
        <h3>Carousel items</h3>
        <p>Add entity-aware icon buttons. Swipe or scroll to move through them; tap the centered item to run its action.</p>
        ${e.map((t, a) => c`
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
      const n = r[t], i = fe(this.hass, n.entity), l = fe(this.hass, o), s = { ...n, entity: o };
      for (const d of ["name", "icon", "icon_type", "color", "tap_action"])
        (n[d] === void 0 || JSON.stringify(n[d]) === JSON.stringify(i[d])) && Object.assign(s, { [d]: l[d] });
      r[t] = s;
    } else
      r[t] = { ...r[t], [a]: o || void 0 };
    this.updateItems(e, r);
  }
  addItem(e) {
    if (!this.config) return;
    const t = [...this.config[e] ?? (this.config.entities ?? []).map((o) => ({ entity: o }))], a = e === "scene_items" ? Object.keys(this.hass?.states ?? {}).find((o) => o.startsWith("scene.")) ?? "" : "";
    t.push(e === "scene_items" ? fe(this.hass, a) : { entity: "" }), this.updateItems(e, t);
  }
  removeItem(e, t) {
    if (!this.config) return;
    const a = [...this.config[e] ?? (this.config.entities ?? []).map((o) => ({ entity: o }))].filter((o, r) => r !== t);
    this.updateItems(e, a);
  }
  updateItems(e, t) {
    if (!this.config) return;
    const a = { ...this.config, [e]: t, entities: void 0 };
    this.config = a, ae(this, "config-changed", { config: a });
  }
  updateWasteStream(e, t, a) {
    if (!this.config) return;
    const o = ue(this.config);
    o[e] = {
      ...o[e],
      [t]: t === "enabled" ? a !== !1 : a || void 0
    }, this.updateWasteStreams(o);
  }
  removeWasteStream(e) {
    this.config && this.updateWasteStreams(ue(this.config).filter((t, a) => a !== e));
  }
  moveWasteStream(e, t) {
    if (!this.config) return;
    const a = ue(this.config), o = e + t;
    o < 0 || o >= a.length || ([a[e], a[o]] = [a[o], a[e]], this.updateWasteStreams(a));
  }
  updateWasteStreams(e) {
    if (!this.config) return;
    const t = { ...this.config, waste_streams: e };
    this.config = t, ae(this, "config-changed", { config: t });
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
    this.config = t, ae(this, "config-changed", { config: t });
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
    this.config = a, ae(this, "config-changed", { config: a });
  }
};
De.styles = We`
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
gt([
  he({ attribute: !1 })
], De.prototype, "hass", 2);
gt([
  ge()
], De.prototype, "config", 2);
De = gt([
  oa("mushroom-addition-editor")
], De);
const Jo = We`
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
  .console-social ha-icon { width: 10px; height: 10px; --mdc-icon-size: 10px; color: rgb(var(--console-tone)); }
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
  .car-hero, .flower-heading { width: 100%; padding: 0; border: 0; background: transparent; color: inherit; text-align: left; }
  .car-icon-wrap { position: relative; display: inline-grid; }
  .car-badge { position: absolute; display: grid; width: 18px; height: 18px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; color: var(--primary-background-color); }
  .car-badge ha-icon { --mdc-icon-size: 11px; }
  .car-badge.tracker { top: -5px; right: -5px; background: rgb(var(--ulm-blue)); }
  .car-badge.tracker.is-away { background: rgb(var(--ulm-green)); }
  .car-badge.lock { right: -5px; bottom: -5px; background: rgb(var(--ulm-blue)); }
  .car-badge.lock.is-unlocked { background: rgb(var(--ulm-red)); }
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
`, Zo = {
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
}, Qo = (e, t) => {
  const a = e?.trim() || t.trim();
  if (a === "primary")
    return e ? `var(--primary-color, ${t})` : "var(--primary-color)";
  if (a === "accent")
    return e ? `var(--accent-color, ${t})` : "var(--accent-color)";
  const o = Zo[a];
  return o ? `rgb(var(--rgb-${a}, ${o}))` : a;
};
var er = Object.defineProperty, tr = Object.getOwnPropertyDescriptor, Ze = (e, t, a, o) => {
  for (var r = o > 1 ? void 0 : o ? tr(t, a) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = (o ? i(t, a, r) : i(r)) || r);
  return o && r && er(t, a, r), r;
};
const ar = /* @__PURE__ */ new Set(["off", "unknown", "unavailable", "none", "idle"]);
let xe = class extends se {
  constructor() {
    super(...arguments), this.selectedIndex = 0, this.holdFired = !1, this.onPointerDown = (e, t) => {
      e.stopPropagation(), this.dragStartX = e.clientX, this.holdFired = !1, e.currentTarget.setPointerCapture?.(e.pointerId), t === this.selectedIndex && (this.holdTimer = window.setTimeout(() => {
        this.holdFired = !0, this.runItemAction(this.items[t], "hold");
      }, 500));
    }, this.onPointerMove = (e) => {
      this.dragStartX !== void 0 && Math.abs(e.clientX - this.dragStartX) > 8 && this.clearHold();
    }, this.onPointerUp = (e, t) => {
      if (e.stopPropagation(), this.dragStartX === void 0) return;
      const a = e.clientX - this.dragStartX;
      if (this.clearHold(), this.dragStartX = void 0, Math.abs(a) >= 24) {
        this.select(a > 0 ? -1 : 1);
        return;
      }
      if (this.holdFired) {
        this.holdFired = !1;
        return;
      }
      if (t !== this.selectedIndex) {
        this.selectIndex(t);
        return;
      }
      this.runItemAction(this.items[t], "tap");
    }, this.cancelPointer = () => {
      this.clearHold(), this.dragStartX = void 0, this.holdFired = !1;
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
      return c`<div class="carousel"><span class="label">Add carousel items in the card editor</span></div>`;
    const t = this.visibleCount, a = e[this.selectedIndex], o = this.entityFor(a);
    return c`
      <div class="carousel"
        role="listbox"
        aria-label="Entity carousel"
        tabindex="0"
        @keydown=${this.onKeydown}
        @wheel=${this.onWheel}>
        <div class="stage">
          ${e.map((r, n) => this.renderItem(r, n, t))}
        </div>
        ${this.config?.carousel_show_labels === !1 ? h : c`
          <div class="label">
            ${this.itemName(a, o)}
            ${this.showEntityState(o) ? c`<span class="state">${o?.state}</span>` : h}
          </div>
        `}
      </div>
    `;
  }
  renderItem(e, t, a) {
    const o = this.itemOffset(t), r = Math.abs(o), n = r > Math.floor(a / 2), i = t === this.selectedIndex, l = this.entityFor(e), s = e.color || (l?.attributes.icon, "primary"), d = o * 42, m = Math.max(0.54, 1 - r * 0.17), g = o * -24, u = Math.max(0.18, 1 - r * 0.2), _ = [
      `transform:translateX(${d}px) translateZ(${-r * 34}px) rotateY(${g}deg) scale(${m})`,
      `z-index:${100 - r}`,
      `opacity:${u}`,
      `filter:saturate(${Math.max(0.45, 1 - r * 0.14)})`,
      `--carousel-color:var(--${s}-color, ${s})`
    ].join(";"), b = e.icon_type === "entity-picture" ? l?.attributes.entity_picture : void 0, v = e.icon || l?.attributes.icon || "mdi:circle", I = l ? !ar.has(l.state.toLowerCase()) : !1;
    return c`
      <button
        role="option"
        aria-selected=${i ? "true" : "false"}
        aria-label=${this.itemName(e, l)}
        class=${`${i ? "active" : ""} ${I ? "entity-active" : ""}`}
        style=${_}
        ?hidden=${n}
        @pointerdown=${(M) => this.onPointerDown(M, t)}
        @pointermove=${this.onPointerMove}
        @pointerup=${(M) => this.onPointerUp(M, t)}
        @pointercancel=${this.cancelPointer}>
        ${b ? c`<span class="picture" style=${`background-image:url("${String(b)}")`}></span>` : c`<ha-icon .icon=${v}></ha-icon>`}
      </button>
    `;
  }
  get items() {
    return this.config?.carousel_items ?? [];
  }
  get visibleCount() {
    const e = Math.round(this.config?.carousel_visible_items ?? 7), t = Math.min(11, Math.max(3, e));
    return t % 2 === 0 ? t + 1 : t;
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
  select(e) {
    const t = this.items.length;
    if (!t) return;
    const a = this.selectedIndex + e;
    this.selectedIndex = this.config?.carousel_loop === !1 ? Math.min(t - 1, Math.max(0, a)) : (a + t) % t;
  }
  selectIndex(e) {
    this.selectedIndex = Math.min(this.items.length - 1, Math.max(0, e));
  }
  clearHold() {
    this.holdTimer !== void 0 && window.clearTimeout(this.holdTimer), this.holdTimer = void 0;
  }
  runItemAction(e, t) {
    if (!e) return;
    const o = (t === "tap" ? e.tap_action : e.hold_action) ?? {
      action: t === "tap" && e.entity ? "more-info" : "none"
    };
    ae(this, "hass-action", {
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
xe.styles = We`
    :host { display: block; min-width: 0; }
    .carousel {
      position: relative;
      display: grid;
      place-items: center;
      min-height: 104px;
      overflow: hidden;
      perspective: 520px;
      touch-action: pan-y;
      user-select: none;
      outline: none;
    }
    .stage {
      position: relative;
      width: 100%;
      height: 74px;
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
      transition: transform 220ms cubic-bezier(.2,.8,.2,1), opacity 180ms ease, filter 180ms ease;
      cursor: pointer;
      transform-style: preserve-3d;
      will-change: transform;
    }
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
Ze([
  he({ attribute: !1 })
], xe.prototype, "hass", 2);
Ze([
  he({ attribute: !1 })
], xe.prototype, "config", 2);
Ze([
  ge()
], xe.prototype, "selectedIndex", 2);
xe = Ze([
  oa("mushroom-addition-entity-carousel")
], xe);
const w = (e, t) => e?.attributes[t], k = (e) => {
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, ke = (e, t, a, o, r = "") => {
  if (e.config.icon_type === "none") return h;
  const n = e.config.icon_type === "entity-picture" ? w(e.entity, "entity_picture") : void 0;
  return n ? c`<span class="ulm-icon entity-picture ${r}" style=${`background-image:url("${String(n)}")`}></span>` : c`<span class="ulm-icon source-icon ${o ? "is-source-active" : ""} ${r}"
        style=${`--source-color:${a}`}>
        <ha-icon .icon=${e.config.icon || t}></ha-icon>
      </span>`;
}, Gt = (e, t) => {
  const a = y(e, t);
  return a ? e.hass.states[a] : void 0;
}, or = (e, t) => {
  if (e === void 0) return "mdi:battery-off";
  if (e <= 0 && !t) return "mdi:battery-alert-variant-outline";
  if (e >= 100) return "mdi:battery";
  if (e <= 0) return `mdi:battery${t}-outline`;
  const a = Math.max(10, Math.min(90, Math.round(e / 10) * 10));
  return `mdi:battery${t}-${a}`;
}, P = (e, t) => {
  const a = e.config[t];
  return typeof a == "string" ? e.hass.states[a] : void 0;
}, y = (e, ...t) => {
  for (const a of t)
    if (e.config[a] !== void 0) return e.config[a];
}, Te = (e, t) => e.config.icon || e.entity?.attributes.icon || wa(e.descriptor, e.entity) || t, G = (e, t, a = "blue", o = "") => {
  if (e.config.icon_type === "none") return h;
  const r = e.config.icon_type === "entity-picture" ? w(e.entity, "entity_picture") : void 0;
  return r ? c`<span class="ulm-icon entity-picture ${o}" style=${`background-image:url("${String(r)}")`}></span>` : c`<span class="ulm-icon tone-${a} ${o}"><ha-icon .icon=${Te(e, t)}></ha-icon></span>`;
}, rr = (e, t) => {
  switch (e.config.secondary_info) {
    case "none":
      return;
    case "name":
      return K(e.config, e.entity, e.hass);
    case "state":
      return $(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    case "last-updated":
      return e.entity?.last_updated ? new Date(e.entity.last_updated).toLocaleString() : "Last updated unavailable";
    default:
      return e.config.secondary || t;
  }
}, nr = (e, t) => {
  switch (e.config.primary_info) {
    case "none":
      return "";
    case "state":
      return $(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    case "last-updated":
      return e.entity?.last_updated ? new Date(e.entity.last_updated).toLocaleString() : "Last updated unavailable";
    default:
      return K(e.config, e.entity, e.hass) || t || "";
  }
}, xa = (e, t, a) => {
  e.presentation.rendered = !0;
  const o = K(e.config, e.entity, e.hass), r = e.config.name !== void 0 && typeof e.config.name != "string";
  return {
    primary: (e.config.primary_info === void 0 ? r && o ? o : a ?? o : nr(e, a)) || void 0,
    secondary: e.config.secondary_info === void 0 ? t : rr(e, t)
  };
}, E = (e, t, a) => c`
  ${(() => {
  const o = xa(e, t, a);
  return c`
  <span class="ulm-copy shared-presentation">
    ${o.primary ? c`<span class="ulm-name">${o.primary}</span>` : h}
    ${o.secondary ? c`<span class="ulm-label">${o.secondary}</span>` : h}
  </span>
    `;
})()}
`, ka = (e, t = $(e.entity)) => c`
  <span class="value-first">${E(e, K(e.config, e.entity, e.hass), t)}</span>
`, Sa = (e) => c`<div class="automatic-presentation">${E(e, $(e.entity), e.descriptor.name)}</div>`, F = (e, t, a, o = !1) => c`
  <button class="ulm-control" aria-label=${e} ?disabled=${o}
    @pointerdown=${(r) => r.stopPropagation()} @click=${a}>
    <ha-icon .icon=${t}></ha-icon>
  </button>
`, ir = (e, t, a, o, r = !1) => {
  let n, i = !1;
  const l = () => {
    n !== void 0 && window.clearTimeout(n), n = void 0;
  };
  return c`
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
}, U = (e, t, a, o = t.config.entity) => {
  e.stopPropagation(), ae(e.currentTarget, "hass-action", {
    config: { type: t.config.type, entity: o, tap_action: a },
    action: "tap"
  });
}, sr = {
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
}, lr = (e) => {
  const t = k(e.entity?.state) ?? 0, a = !!w(e.entity, "is_charging") || String(e.entity?.state).includes("charging"), o = y(e, "ulm_card_battery_battery_level_danger") ?? 20, r = y(e, "ulm_card_battery_battery_level_warning") ?? 50, n = t < o ? "red" : t < r ? "yellow" : "green", i = y(e, "ulm_card_battery_charging_animation") === !0 && a;
  return e.actionSurface(`ulm-battery ${i ? "is-charging" : ""}`, c`
    ${G(e, a ? "mdi:battery-charging" : "mdi:battery", n)}
    ${E(e, a ? "Charging" : "Battery level")}
    <span class="battery-value">${Math.round(t)}<small>%</small></span>
    <span class="battery-track"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>
  `);
}, cr = (e) => {
  const t = y(e, "ulm_card_battery_attribute"), a = t ? w(e.entity, t) : e.entity?.state, o = k(a), r = Gt(e, "ulm_card_battery_battery_state_entity_id"), n = Gt(e, "ulm_card_battery_charger_type_entity_id"), i = r?.state.toLowerCase() === "charging", l = n?.state.toLowerCase(), s = l === "wireless" ? "-charging-wireless" : i || ["charging", "ac", "usb"].includes(l ?? "") ? "-charging" : "", d = k(e.config.battery_warning_threshold) ?? y(e, "ulm_card_battery_battery_level_warning") ?? 50, m = k(e.config.battery_low_threshold) ?? y(e, "ulm_card_battery_battery_level_danger") ?? 20, g = k(e.config.battery_critical_threshold) ?? 10, [u, _, b] = [g, m, d].map((x) => Math.max(0, Math.min(100, x))).sort((x, L) => x - L), v = o === void 0 || o <= u ? q(
    e.config.battery_critical_color ?? y(e, "ulm_card_battery_color_battery_level_danger"),
    "var(--google-red, #f44336)"
  ) : o <= _ ? q(e.config.battery_low_color, "var(--google-orange, #ff9800)") : o <= b ? q(
    e.config.battery_warning_color ?? y(e, "ulm_card_battery_color_battery_level_warning"),
    "var(--google-yellow, #fbc02d)"
  ) : q(
    e.config.battery_healthy_color ?? y(e, "ulm_card_battery_color_battery_level_ok"),
    "var(--google-green, #43a047)"
  ), I = y(e, "ulm_card_battery_charging_animation") === !0 && i, M = o === void 0 ? $(e.entity) : `${Math.round(o)}%`;
  return e.actionSurface(`ulm-row ulm-default-battery ${I ? "is-charging" : ""}`, c`
    ${ke(e, or(o, s), v, !0)}
    <span class="value-first">${E(e, K(e.config, e.entity, e.hass), M)}</span>
  `);
}, q = Qo, dr = (e) => {
  const t = k(e.entity?.state) ?? 0, a = k(y(e, "ulm_custom_card_bar_card_min")) ?? 0, r = (k(y(e, "ulm_custom_card_bar_card_max")) ?? 100) - a, n = r > 0 ? Math.max(0, Math.min(100, (t - a) / r * 100)) : 0, i = y(e, "ulm_custom_card_bar_card_show_icon") !== !1, l = y(e, "ulm_custom_card_bar_card_value") === !0, s = y(e, "ulm_custom_card_bar_card_indicator") === !0, d = q(
    y(e, "ulm_custom_card_bar_card_color"),
    "var(--google-blue, #4285f4)"
  ), m = q(
    y(e, "ulm_custom_card_bar_card_icon_color"),
    "var(--secondary-text-color)"
  ), g = y(e, "ulm_custom_card_bar_card_icon") || e.config.icon || e.entity?.attributes.icon || "mdi:chart-bar", u = $(e.entity);
  return e.actionSurface(`bar-card ${i ? "has-header" : "bar-only"}`, c`
    ${i ? c`
      <div class="bar-card-header">
        <span class="bar-card-icon" style=${`--bar-icon-color:${m}`}>
          <ha-icon .icon=${g}></ha-icon>
        </span>
        <span class="bar-card-copy">${E(e, K(e.config, e.entity, e.hass), u)}</span>
      </div>
    ` : h}
    <div class="bar-card-track" style=${`--bar-fill:${d};--bar-percentage:${n}%`}>
      <span class="bar-card-fill" style=${`width:${n}%`}></span>
      ${s ? c`<span class="bar-card-indicator" style=${`left:${n}%`}></span>` : h}
      ${l ? c`
        <b class="bar-card-inside-value">${u}</b>
        <b class="bar-card-inside-value bar-card-inside-value-filled" aria-hidden="true">${u}</b>
      ` : h}
    </div>
  `);
}, Ia = (e, t = !1, a = e.entity, o, r = o) => {
  const n = Array.isArray(w(a, "history")) ? w(a, "history").map(Number).filter(Number.isFinite).slice(-12) : [20, 28, 24, 42, 35, 52, 48, 63, 55, 70, 62, 78], i = Math.min(...n), l = Math.max(...n), s = n.map((g, u) => `${u / Math.max(1, n.length - 1) * 100},${36 - (g - i) / Math.max(1, l - i) * 32}`).join(" "), d = `0,40 ${s} 100,40`, m = o ? `--sparkline-color:${o};--sparkline-fill-color:${r ?? o}` : "";
  return c`<svg class="sparkline ${t ? "is-filled" : ""}" style=${m} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
    ${t ? c`<polygon points=${d}></polygon>` : h}
    <polyline points=${s}></polyline>
  </svg>`;
}, ur = (e) => e.actionSurface("ulm-metric", c`
  <div class="metric-heading">${G(e, e.descriptor.family === "energy" ? "mdi:flash" : "mdi:chart-line", "blue")}${E(e, e.entity?.attributes.unit_of_measurement ? String(e.entity.attributes.unit_of_measurement) : "Current value")}<span class="metric-value">${$(e.entity)}</span></div>
  ${e.config.show_graph !== !1 ? Ia(e) : h}
  ${P(e, "min_entity") || P(e, "max_entity") ? c`<div class="metric-extremes"><span>Min ${$(P(e, "min_entity"))}</span><span>Max ${$(P(e, "max_entity"))}</span></div>` : h}
`), mr = (e, t, a) => {
  const o = a.navigation_path || a.nav_path;
  if (o) {
    U(e, t, { action: "navigate", navigation_path: o }, a.entity);
    return;
  }
  const r = a.tap_action, n = r?.service ?? r?.perform_action;
  if ((r?.action === "call-service" || r?.action === "perform-action") && n) {
    const [s, d] = n.split(".", 2);
    if (s && d) {
      t.service(s, d, {
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
}, _r = (e) => {
  const t = (e.config.scene_items?.length ? e.config.scene_items : (e.config.entities?.length ? e.config.entities : e.config.entity ? [e.config.entity] : []).map((x) => ({ entity: x }))).filter((x) => x.entity), a = e.descriptor.upstreamId === "card_welcome_scenes", o = e.descriptor.upstreamId === "card_scenes" && e.config.variant === "scene-grid", r = a ? 7 : o ? 5 : 6, n = a && t.length > r, i = a && e.sceneOverflowExpanded ? t : t.slice(0, r), l = e.config.collapse_entity ? e.hass.states[e.config.collapse_entity] : void 0, s = e.config.collapsed === !0 || l?.state === "on", m = P(e, "weather_entity")?.state || "partlycloudy", g = sr[m]?.[0] ?? "mdi:weather-partly-cloudy", u = (/* @__PURE__ */ new Date()).getHours(), _ = e.hass.language?.split("-")[0] ?? "en", b = {
    de: ["Hallo", "Guten Morgen", "Guten Tag", "Guten Abend"],
    en: ["Hello", "Good morning", "Good afternoon", "Good evening"],
    es: ["Hola", "Buenos días", "Buenas tardes", "Buenas noches"],
    fr: ["Bonjour", "Bonjour", "Bon après-midi", "Bonsoir"],
    nl: ["Hallo", "Goedemorgen", "Goedemiddag", "Goedenavond"]
  }, v = b[_] ?? b.en, M = `${u >= 18 ? v[3] : u >= 12 ? v[2] : u >= 5 ? v[1] : v[0]}, ${e.hass.user?.name || "Home"}!`;
  return e.actionSurface(`ulm-scenes ${a ? "welcome-scenes" : o ? "source-scene-grid" : "scene-pills"} ${e.descriptor.upstreamId === "card_scenes" ? "ulm-source-scenes" : ""}`, c`
    ${a ? c`
      <div class="welcome-toolbar">
        <button class="welcome-toolbar-button" aria-label="Toggle scenes" @pointerdown=${(x) => x.stopPropagation()} @click=${(x) => {
    x.stopPropagation(), e.config.collapse_entity && e.service("input_boolean", "toggle", { entity_id: e.config.collapse_entity });
  }}><ha-icon .icon=${s ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon></button>
        <span class="welcome-date"><ha-icon .icon=${g}></ha-icon>${new Intl.DateTimeFormat(e.hass.language, { month: "short", day: "numeric" }).format(/* @__PURE__ */ new Date())}</span>
        <button class="welcome-toolbar-button" aria-label="Open dashboard settings" @pointerdown=${(x) => x.stopPropagation()} @click=${(x) => U(x, e, { action: "navigate", navigation_path: String(e.config.settings_path || "/config/dashboard") })}><ha-icon icon="mdi:cog-outline"></ha-icon></button>
      </div>
      <div class="welcome-heading">${E(e, M)}</div>
      ${s ? h : c`
        <div class="welcome-scenes-heading">
          <b>${e.config.secondary || "Scenes"}</b>
          ${n ? c`
            <button class="welcome-scenes-more"
              aria-label=${e.sceneOverflowExpanded ? "Show fewer scenes" : "Show all scenes"}
              aria-expanded=${e.sceneOverflowExpanded ? "true" : "false"}
              @pointerdown=${(x) => x.stopPropagation()}
              @click=${(x) => {
    x.stopPropagation(), e.toggleSceneOverflow();
  }}>
              <ha-icon .icon=${e.sceneOverflowExpanded ? "mdi:close" : "mdi:dots-vertical"}></ha-icon>
            </button>
          ` : h}
        </div>
      `}
    ` : h}
    ${s ? h : c`<div class="scene-grid">${i.map((x) => {
    const L = e.hass.states[x.entity], Z = x.active_state ? L?.state === x.active_state : x.state ? L?.state === x.state : oe.has(L?.state ?? ""), ee = q(x.color, "rgb(var(--ulm-purple))"), X = x.icon_type === "entity-picture" ? w(L, "entity_picture") : void 0;
    return c`
      <button @pointerdown=${(B) => B.stopPropagation()} @click=${(B) => {
      if (B.stopPropagation(), o && !x.tap_action) {
        const te = x.entity.split(".", 1)[0];
        e.service(
          te === "automation" ? "automation" : "homeassistant",
          te === "automation" ? "trigger" : "turn_on",
          { entity_id: x.entity }
        );
      } else
        mr(B, e, x);
    }} style=${`--item-color:${ee}`} class="scene-button ${Z ? "is-active" : ""}">
        <i>${X ? c`<span class="scene-entity-picture" style=${`background-image:url("${String(X)}")`}></span>` : c`<ha-icon .icon=${x.icon || L?.attributes.icon || "mdi:palette"}></ha-icon>`}</i>
        <span>${x.name || x.label || K({ entity: x.entity }, L, e.hass)}</span>
      </button>`;
  })}</div>`}
  `);
}, Bt = (e) => {
  const t = y(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : w(e.entity, "entity_picture"), a = "mdi:sony-playstation", o = y(e, "ulm_card_media_player_player_controls_entity") || e.config.entity, r = o ? e.hass.states[o] : e.entity, n = o?.startsWith("media_player.") === !0, i = y(e, "ulm_card_media_player_collapsible") === !0 && (["off", "standby"].includes(e.entity?.state ?? "") || y(e, "ulm_card_media_player_idle_off") === !0 && e.entity?.state === "idle"), l = !i && (e.config.show_controls === !0 || y(e, "ulm_card_media_player_enable_controls") === !0), s = y(e, "ulm_card_media_player_enable_volume_adjust") || (w(r, "device_class") === "speaker" ? 0.05 : w(r, "device_class") === "tv" ? 0.01 : 0.025), d = Number(w(r, "volume_level") ?? 0), m = { action: "more-info" }, g = oe.has(e.entity?.state ?? ""), u = q(
    y(e, "ulm_card_media_player_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface(`ulm-media ${t ? "has-art" : ""} ${i ? "is-collapsed" : ""}`, c`
    ${t ? c`<span class="media-art" style=${`background-image:url("${String(t)}")`}></span>` : h}
    <div class="media-summary">
      ${ke(e, Te(e, e.descriptor.upstreamId === "custom_card_playstation" ? a : "mdi:speaker"), u, g)}
      ${E(e, y(e, "ulm_card_media_player_more_info") === !0 ? [w(e.entity, "media_artist"), w(e.entity, "media_album_name")].filter(Boolean).join(" · ") || $(e.entity) : String(w(e.entity, "media_album_name") ?? w(e.entity, "media_artist") ?? $(e.entity)))}
    </div>
    ${y(e, "ulm_card_media_player_power_button") === !0 ? c`
      <div class="media-power">${F("Toggle power", "mdi:power", (_) => {
    _.stopPropagation(), e.service("homeassistant", "toggle", { entity_id: e.config.entity });
  })}</div>
    ` : h}
    ${n && l ? c`<div class="ulm-controls media-controls">
      ${F("Previous", "mdi:skip-previous", (_) => {
    _.stopPropagation(), e.service("media_player", "media_previous_track", { entity_id: o });
  })}
      ${F(e.entity?.state === "playing" ? "Pause" : "Play", e.entity?.state === "playing" ? "mdi:pause" : "mdi:play", (_) => {
    _.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: o });
  })}
      ${F("Next", "mdi:skip-next", (_) => {
    _.stopPropagation(), e.service("media_player", "media_next_track", { entity_id: o });
  })}
      ${F("Sources", "mdi:playlist-music", (_) => U(_, e, m, o))}
    </div>` : h}
    ${n && !i && y(e, "ulm_card_media_player_enable_volume_slider") === !0 ? c`
      <input class="ulm-slider" type="range" min="0" max="100"
        aria-label="Volume"
        .value=${String(Math.round(d * 100))}
        @pointerdown=${(_) => _.stopPropagation()}
        @change=${(_) => e.service("media_player", "volume_set", {
    entity_id: o,
    volume_level: Number(_.target.value) / 100
  })}>
    ` : h}
    ${n && !i && y(e, "ulm_card_media_player_enable_volume_buttons") === !0 ? c`
      <div class="ulm-controls media-volume-buttons">
        ${F("Mute or unmute", "mdi:volume-mute", (_) => {
    _.stopPropagation(), e.service("media_player", "volume_mute", {
      entity_id: o,
      is_volume_muted: w(r, "is_volume_muted") !== !0
    });
  })}
        ${F("Volume down", "mdi:volume-minus", (_) => {
    _.stopPropagation(), e.service("media_player", "volume_set", {
      entity_id: o,
      volume_level: Math.max(0, d - s)
    });
  })}
        ${F("Volume up", "mdi:volume-plus", (_) => {
    _.stopPropagation(), e.service("media_player", "volume_set", {
      entity_id: o,
      volume_level: Math.min(1, d + s)
    });
  })}
      </div>
    ` : h}
  `);
}, pr = (e) => {
  const t = e.entity?.state.startsWith("armed") || e.entity?.state === "locked";
  return e.actionSurface(`ulm-security ${t ? "is-armed" : ""}`, c`
    ${G(e, t ? "mdi:shield-lock" : "mdi:shield-off", t ? "green" : "red")}
    ${E(e, $(e.entity))}
    ${e.config.show_controls ? c`<span class="security-status">${t ? "Secured" : "Attention"}</span>` : h}
  `);
}, hr = (e) => e.actionSurface("ulm-navigation", c`
  ${G(e, e.descriptor.upstreamId.includes("back") ? "mdi:arrow-left" : "mdi:arrow-right", "blue")}
  ${E(e, e.config.secondary || e.config.navigation_path || "Navigate")}
  <ha-icon icon="mdi:chevron-right"></ha-icon>
`), gr = (e, t) => {
  const a = e?.split(".", 1)[0] ?? "homeassistant";
  return a === "script" ? ["script", t === "on" ? "turn_on" : "turn_off"] : a === "fan" ? ["fan", t === "on" ? "turn_on" : "turn_off"] : a === "water_heater" ? ["water_heater", t === "on" ? "turn_on" : "turn_off"] : [a === "input_boolean" ? "input_boolean" : "homeassistant", t === "on" ? "turn_on" : "turn_off"];
}, br = (e) => {
  const t = y(
    e,
    "ulm_custom_card_washer_power",
    "ulm_card_power_outlet_entity",
    "ulm_card_power_entity"
  ), a = e.config.entity?.split(".", 1)[0], o = t || (["switch", "input_boolean", "light", "fan", "script", "water_heater"].includes(a ?? "") ? e.config.entity : void 0), r = o ? e.hass.states[o] : void 0, n = oe.has(r?.state ?? e.entity?.state ?? ""), i = P(e, "graph_entity"), [l, s] = gr(o, n ? "off" : "on");
  return e.actionSurface(`ulm-control-card ulm-row ${n ? "is-active" : ""}`, c`
    ${G(e, e.config.entity?.startsWith("fan.") ? "mdi:fan" : "mdi:power-socket-eu", n ? "yellow" : "grey")}
    ${E(e, i ? `${$(e.entity)} · ${$(i)}` : $(e.entity))}
    ${o && e.config.show_controls !== !1 ? F(n ? "Turn off" : "Turn on", "mdi:power", (d) => {
    d.stopPropagation(), e.service(l, s, { entity_id: o });
  }) : h}
  `);
}, Me = /* @__PURE__ */ new WeakMap(), Fe = /* @__PURE__ */ new WeakSet(), Ut = (e, t, a, o) => {
  const r = o === "tap" ? a.tap_action ?? { action: "toggle" } : a.hold_action ?? { action: "more-info" };
  ae(e, "hass-action", {
    config: { type: t.config.type, entity: a.entity, tap_action: r },
    action: "tap"
  });
}, yr = (e) => {
  const t = (e.config.room_sensors?.length ? e.config.room_sensors : (e.config.entities ?? []).map((l) => ({ entity: l }))).filter((l) => l.entity).slice(0, 4), a = e.config.label_use_temperature ?? y(e, "label_use_temperature") ?? !0, o = e.config.label_use_brightness ?? y(e, "label_use_brightness") ?? !1, r = k(w(e.entity, "brightness")), n = w(e.entity, "current_temperature") ?? w(e.entity, "temperature") ?? w(e.entity, "device_temperature") ?? e.entity?.state ?? "—", i = a ? `${String(n)}${String(w(e.entity, "unit_of_measurement") ?? "°C")}` : o && e.entity?.state === "on" && r !== void 0 ? `${Math.round(r / 2.55)}%` : $(e.entity);
  return e.actionSurface(`ulm-room ulm-source-room ${e.entity?.state === "unavailable" ? "is-unavailable" : ""}`, c`
    <div class="room-main">
      <span class="room-copy">${E(e, i)}</span>
      <span class="ulm-icon tone-blue"><ha-icon .icon=${e.config.icon || "mdi:sofa-single"}></ha-icon></span>
      ${e.entity?.state === "unavailable" ? c`<span class="room-unavailable"><ha-icon icon="mdi:exclamation"></ha-icon></span>` : h}
    </div>
    ${t.length ? c`<div class="room-entities">${t.map((l) => {
    const s = e.hass.states[l.entity], d = s?.state === (l.active_state || "on"), m = q(l.color, "rgb(var(--ulm-blue))"), g = l.icon_type === "entity-picture" ? w(s, "entity_picture") : void 0;
    return c`<button
        class="metric-pill room-sensor ${d ? "is-active" : ""}"
        style=${`--item-color:${m}`}
        aria-label=${l.name || l.label || K({ entity: l.entity }, s, e.hass)}
        @pointerdown=${(u) => {
      u.stopPropagation();
      const _ = u.currentTarget;
      Fe.delete(_), Me.set(_, window.setTimeout(() => {
        Fe.add(_), Ut(_, e, l, "hold");
      }, 500));
    }}
        @pointerup=${(u) => {
      u.stopPropagation();
      const _ = u.currentTarget, b = Me.get(_);
      b && window.clearTimeout(b), Me.delete(_);
    }}
        @pointercancel=${(u) => {
      const _ = u.currentTarget, b = Me.get(_);
      b && window.clearTimeout(b), Me.delete(_);
    }}
        @click=${(u) => {
      const _ = u.currentTarget;
      if (Fe.has(_)) {
        Fe.delete(_), u.stopPropagation();
        return;
      }
      u.stopPropagation(), Ut(_, e, l, "tap");
    }}
      >${g ? c`<span class="room-sensor-picture" style=${`background-image:url("${String(g)}")`}></span>` : c`<ha-icon .icon=${l.icon || s?.attributes.icon || "mdi:circle-small"}></ha-icon>`}<span>${l.name || l.label || $(s)}</span></button>`;
  })}</div>` : h}
  `);
}, fr = (e) => {
  const t = String(e ?? "").trim(), a = t.match(/^(\d+(?:\.\d+)?)\s*(?::|\/|x)\s*(\d+(?:\.\d+)?)$/i);
  return a ? `${a[1]} / ${a[2]}` : /^\d+(?:\.\d+)?$/.test(t) ? t : "16 / 9";
}, vr = (e) => {
  const t = w(e.entity, "entity_picture") || (e.entity?.entity_id.startsWith("camera.") ? `/api/camera_proxy/${e.entity.entity_id}` : void 0), a = y(e, "ulm_custom_card_camera_name"), o = y(e, "ulm_custom_card_camera_label"), r = xa(e, o || $(e.entity)), n = r.primary || (e.config.primary_info === void 0 ? a || K(e.config, e.entity, e.hass) : void 0), i = r.secondary, l = fr(
    e.config.aspect_ratio ?? y(e, "ulm_custom_card_camera_aspect_ratio")
  ), s = k(e.config.image_height), d = e.config.fit_mode ?? "cover", m = e.config.camera_view === "live" && e.entity?.entity_id.startsWith("camera."), g = s ? `height:${Math.max(80, s)}px` : `aspect-ratio:${l}`;
  return e.actionSurface("ulm-camera", c`
    <div class="camera-media" style=${g}>
      ${m ? c`<ha-camera-stream .hass=${e.hass} .stateObj=${e.entity}></ha-camera-stream>` : t ? c`<img src=${String(t)} alt=${n} width="1600" height="900"
          loading="lazy" style=${`object-fit:${d}`}>` : c`
      <div class="camera-placeholder">${G(e, "mdi:camera", "blue")}</div>
      `}
      ${n || i ? c`<div class="camera-overlay shared-presentation">
        ${n ? c`<b class="ulm-name">${n}</b>` : h}
        ${i ? c`<span class="ulm-label">${i}</span>` : h}
      </div>` : h}
    </div>
  `);
}, bt = (e) => {
  const t = Object.entries(e.config).filter(([a, o]) => typeof o == "string" && o !== e.config.entity && /(_entity|_entity_id|_sensor|_power|_status|_level|_date|_time)$/i.test(a)).map(([, a]) => a);
  return [.../* @__PURE__ */ new Set([...e.config.entities ?? [], ...t])].map((a) => e.hass.states[a]).filter((a) => !!a).slice(0, 6);
}, wr = (e, t, a = "blue") => {
  const o = bt(e);
  return e.actionSurface("ulm-detail-card", c`
    <div class="ulm-row">
      ${G(e, t, a)}
      ${E(e, $(e.entity))}
    </div>
    ${o.length ? c`<div class="detail-grid">${o.map((r) => c`
      <span class="metric-pill"><ha-icon .icon=${r.attributes.icon ?? "mdi:circle-small"}></ha-icon>${$(r)}</span>
    `)}</div>` : h}
  `);
}, $r = (e) => {
  const t = bt(e);
  return e.actionSurface("ulm-schedule-card", c`
    <div class="ulm-row">
      ${G(e, /pollen/.test(e.descriptor.upstreamId) ? "mdi:flower-pollen" : "mdi:trash-can", "green")}
      ${E(e, $(e.entity))}
    </div>
    <div class="schedule-list">${(t.length ? t : e.entity ? [e.entity] : []).slice(0, 4).map((a) => c`
      <span><b>${K({ entity: a.entity_id }, a, e.hass)}</b><small>${$(a)}</small></span>
    `)}</div>
  `);
}, xr = (e) => {
  const t = k(e.entity?.state), a = bt(e);
  return e.actionSurface("ulm-device-status", c`
    <div class="ulm-row">
      ${G(e, /printer/.test(e.descriptor.upstreamId) ? "mdi:printer" : /nas/.test(e.descriptor.upstreamId) ? "mdi:nas" : /washer/.test(e.descriptor.upstreamId) ? "mdi:washing-machine" : "mdi:devices", t !== void 0 && t < 20 ? "red" : "blue")}
      ${E(e, $(e.entity))}
      ${t !== void 0 ? c`<b class="device-value">${Math.round(t)}${String(e.entity?.attributes.unit_of_measurement ?? "")}</b>` : h}
    </div>
    ${t !== void 0 ? c`<span class="device-progress"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>` : h}
    ${a.length ? c`<div class="detail-grid">${a.map((o) => c`<span class="metric-pill">${$(o)}</span>`)}</div>` : h}
  `);
}, kr = (e) => {
  const t = k(e.entity?.state) ?? 0, a = y(e, "ulm_card_gauge_min", "ulm_custom_card_gauge_min") ?? 0, o = y(e, "ulm_card_gauge_max", "ulm_custom_card_gauge_max") ?? 100, r = Math.max(0, Math.min(100, (t - a) / Math.max(1, o - a) * 100));
  return e.actionSurface("ulm-gauge-card", c`
    <span class="gauge-ring" style=${`--gauge:${r * 3.6}deg`}><b>${$(e.entity)}</b></span>
    ${E(e, `${a} – ${o}`)}
  `);
}, Sr = (e) => {
  const t = P(e, "datetime_entity");
  return e.actionSurface(`ulm-control-card ulm-row ${oe.has(e.entity?.state ?? "") ? "is-active" : ""}`, c`
    ${G(e, "mdi:alarm", oe.has(e.entity?.state ?? "") ? "yellow" : "grey")}
    ${E(e, $(t || e.entity))}
    ${e.config.show_controls !== !1 ? F(oe.has(e.entity?.state ?? "") ? "Disable alarm" : "Enable alarm", "mdi:power", (a) => {
    a.stopPropagation(), e.service("input_boolean", oe.has(e.entity?.state ?? "") ? "turn_off" : "turn_on", { entity_id: e.config.entity });
  }) : h}
  `);
}, V = (e, ...t) => {
  const a = y(e, ...t), o = typeof a == "string" ? a : a && typeof a == "object" && "entity_id" in a && typeof a.entity_id == "string" ? a.entity_id : void 0;
  return o ? e.hass.states[o] : void 0;
}, Ir = (e) => {
  const t = ue(e.config).filter((l) => l.enabled !== !1 && l.entity), a = /* @__PURE__ */ new Set([
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
    const d = e.hass.states[l]?.state?.trim();
    if (!d || a.has(d.toLowerCase())) return;
    const m = d.replaceAll("_", " ").replace(/\s+/g, " ");
    return m.charAt(0).toLocaleUpperCase(e.hass.language) + m.slice(1);
  }, r = o(e.config.today_entity, e.config.show_today), n = o(e.config.tomorrow_entity, e.config.show_tomorrow), i = (l) => {
    if (!l || ["unknown", "unavailable", "none", "geen"].includes(l.state.toLowerCase())) return "—";
    if (l.entity_id.startsWith("calendar.")) {
      const s = w(l, "start_time") ?? w(l, "start") ?? w(l, "end_time");
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
      ${G(e, "mdi:trash-can-outline", "green")}
      ${E(e, y(e, "ulm_volgende_ophaling") || [r ? `Today: ${r}` : "", n ? `Tomorrow: ${n}` : ""].filter(Boolean).join(" · ") || void 0, "Next collections")}
    </div>
    <div class="waste-grid">${t.map((l) => {
    const s = l.entity ? e.hass.states[l.entity] : void 0;
    return c`<span class="waste-row" style=${`--waste-color:${q(l.color, "rgb(var(--rgb-green, 76, 175, 80))")}`}>
        <ha-icon .icon=${l.icon || "mdi:trash-can"}></ha-icon>
        <b>${l.label || s?.attributes.friendly_name || l.entity}</b>
        <small>${i(s)}</small>
      </span>`;
  })}</div>
  `);
}, Ar = (e) => {
  const t = V(e, "ulm_card_alarm_time_datetime") ?? P(e, "datetime_entity"), a = k(y(e, "ulm_card_alarm_time_step")) ?? 15, o = t?.state || "00:00:00", [r, n] = o.split(":").map(Number), i = (g) => {
    const u = ((r || 0) * 60 + (n || 0) + g + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: t?.entity_id,
      time: `${String(Math.floor(u / 60)).padStart(2, "0")}:${String(u % 60).padStart(2, "0")}:00`
    });
  }, l = !t || ["unknown", "unavailable"].includes(t.state.toLowerCase()), s = y(e, "ulm_card_alarm_time_collapse") === !0 && !oe.has(e.entity?.state ?? ""), d = oe.has(e.entity?.state ?? ""), m = q(
    y(e, "ulm_card_alarm_time_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface(`custom-alarm-time ${y(e, "ulm_card_alarm_time_horizontal") ? "is-horizontal" : ""}`, c`
    <div class="custom-card-heading">
      ${ke(e, y(e, "ulm_card_alarm_time_icon") || "mdi:alarm", m, d)}
      ${E(e, $(e.entity))}
    </div>
    ${s ? h : c`<div class="alarm-time-controls">
      ${F(`Earlier by ${a} minutes`, "mdi:minus", (g) => {
    g.stopPropagation(), i(-a);
  }, l)}
      <b>${o.slice(0, 5)}</b>
      ${F(`Later by ${a} minutes`, "mdi:plus", (g) => {
    g.stopPropagation(), i(a);
  }, l)}
    </div>`}
  `);
}, et = (e, t) => {
  const a = w(t, "entity_id");
  return Array.isArray(a) ? a.map(String).map((o) => e.hass.states[o]).filter((o) => !!o) : t ? [t] : [];
}, Mr = (e) => {
  const t = (u) => V(e, u), a = t("temperature"), o = t("humidity"), r = {
    doors: t("group_doors"),
    windows: t("group_windows"),
    motions: t("group_motions"),
    water: t("group_water"),
    lights: t("group_lights"),
    shutters: t("group_windows_shutters"),
    outlets: t("group_outlets"),
    tv: t("group_tv")
  }, n = Object.values(r).flatMap((u) => et(e, u)).filter((u) => (k(w(u, "battery")) ?? 101) <= 20), i = Object.values(r).flatMap((u) => et(e, u)).filter((u) => u.state === "unavailable"), l = (u) => et(e, u).filter((_) => _.state === "on" || _.state === "open").length, s = (u, _) => {
    _ && U(u, e, { action: "more-info" }, _.entity_id);
  }, d = (u, _) => {
    _ && _.state !== "unavailable" && U(u, e, { action: "toggle" }, _.entity_id);
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
  return e.actionSurface("custom-room-view", c`
    <div class="room-view-summary" @click=${(u) => s(u, a ?? o)}>
      <span class="room-view-icon"><ha-icon .icon=${e.config.icon || "mdi:home-variant-outline"}></ha-icon>${i.length ? c`<i>${i.length}</i>` : h}</span>
      <span><b><ha-icon icon="mdi:thermometer"></ha-icon>${$(a)}</b><small><ha-icon icon="mdi:water-percent"></ha-icon>${$(o)}</small></span>
    </div>
    <div class="room-view-status">
      ${m.map(([u, _]) => u && l(u) ? c`<button aria-label=${K({ entity: u.entity_id }, u, e.hass)} @pointerdown=${(b) => b.stopPropagation()} @click=${(b) => s(b, u)}><ha-icon .icon=${_}></ha-icon>${l(u) > 1 ? c`<i>${l(u)}</i>` : h}</button>` : h)}
      ${n.length ? c`<button aria-label="Low batteries" @pointerdown=${(u) => u.stopPropagation()} @click=${(u) => s(u, n[0])}><ha-icon icon="mdi:battery-20"></ha-icon><i>${n.length}</i></button>` : h}
      ${!m.some(([u]) => l(u)) && !n.length ? c`<span class="room-view-clear"><ha-icon icon="mdi:check"></ha-icon></span>` : h}
    </div>
    <div class="room-view-actions">
      ${g.map(([u, _]) => u ? c`
        <button class=${u.state === "on" ? "is-active" : ""} aria-label=${K({ entity: u.entity_id }, u, e.hass)}
          ?disabled=${u.state === "unavailable"} @pointerdown=${(b) => b.stopPropagation()}
          @dblclick=${(b) => d(b, u)} @click=${(b) => b.stopPropagation()}>
          <ha-icon .icon=${u.state === "unavailable" ? "mdi:exclamation-thick" : _}></ha-icon>
          ${l(u) ? c`<i>${l(u)}</i>` : h}
        </button>` : h)}
    </div>
  `);
}, Cr = (e) => {
  const t = V(e, "ulm_card_welcome_collapse"), a = V(e, "ulm_weather"), o = t?.state === "on", r = Array.from({ length: 5 }, (n, i) => i + 1).map((n) => ({
    nav: y(e, `nav_${n}`),
    icon: y(e, `icon_${n}`) || "mdi:circle",
    name: y(e, `name_${n}`) || `Item ${n}`,
    color: y(e, `color_${n}`) || "blue"
  })).filter((n) => n.nav);
  return e.actionSurface("custom-welcome", c`
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
    a && U(n, e, { action: "more-info" }, a.entity_id);
  }}>
        <ha-icon icon="mdi:thermometer"></ha-icon>
      </button>
      <button aria-label="Dashboard settings" @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => U(n, e, { action: "navigate", navigation_path: "/config/dashboard" })}>
        <ha-icon icon="mdi:cog-outline"></ha-icon>
      </button>
    </div>
    <div class="welcome-greeting">${E(e, `Good ${(/* @__PURE__ */ new Date()).getHours() < 12 ? "morning" : (/* @__PURE__ */ new Date()).getHours() < 18 ? "afternoon" : "evening"}`)}</div>
    ${o ? h : c`<div class="welcome-items">${r.map((n) => c`
      <button class="tone-${n.color}" aria-label=${n.name}
        @pointerdown=${(i) => i.stopPropagation()}
        @click=${(i) => U(i, e, { action: "navigate", navigation_path: n.nav })}>
        <i><ha-icon .icon=${n.icon}></ha-icon></i><small>${n.name}</small>
      </button>
    `)}</div>`}
  `);
}, Pr = (e) => {
  const t = V(e, "ulm_custom_card_room_overview_light_entity"), a = V(e, "ulm_custom_card_room_overview_climate_entity"), o = V(e, "ulm_custom_card_room_overview_cover_entity"), r = t?.state === "on", n = k(w(t, "brightness")), i = e.config.secondary || (t ? r && n ? `${Math.round(n / 2.55)}%` : $(t) : $(e.entity)), l = w(t, "rgb_color"), s = y(e, "ulm_card_dynamic_color") === !0 && r && Array.isArray(l), d = (g, u) => {
    u && U(g, e, { action: "toggle" }, u.entity_id);
  }, m = (g, u) => {
    const _ = u === "light" ? y(e, r ? "ulm_card_room_overview_light_icon_on" : "ulm_card_room_overview_light_icon_off") || (r ? "mdi:lightbulb" : "mdi:lightbulb-off") : u === "cover" ? y(e, g.state === "closed" ? "ulm_card_room_overview_cover_icon_closed" : "ulm_card_room_overview_cover_icon_open") || (g.state === "closed" ? "mdi:roller-shade-closed" : "mdi:blinds-open") : { auto: "mdi:autorenew", cool: "mdi:snowflake", heat: "mdi:fire", dry: "mdi:water", heat_cool: "mdi:sun-snowflake", fan_only: "mdi:fan", off: "mdi:snowflake-off" }[g.state] ?? "mdi:thermostat";
    return c`<button class="room-overview-control ${u} state-${g.state}" aria-label=${K({ entity: g.entity_id }, g, e.hass)}
      ?disabled=${g.state === "unavailable"} @pointerdown=${(b) => b.stopPropagation()} @click=${(b) => d(b, g)}>
      <ha-icon .icon=${_}></ha-icon>
    </button>`;
  };
  return e.actionSurface(`custom-room-overview ${r ? "light-on" : ""} ${s ? "dynamic-color" : ""}`, c`
    <div class="room-overview-main" style=${s ? `--room-rgb:${l.slice(0, 3).join(",")};` : ""}>
      ${G(e, "mdi:sofa", r ? "yellow" : "grey")}
      ${E(e, i)}
    </div>
    <div class="room-overview-controls">
      ${t ? m(t, "light") : h}
      ${o ? m(o, "cover") : a ? m(a, "climate") : h}
    </div>
  `);
}, Vr = (e) => {
  const t = V(e, "power_entity") ?? V(e, "ulm_custom_card_washer_power"), a = V(e, "ulm_custom_card_washer_machine_state") ?? e.entity, o = V(e, "ulm_custom_card_washer_job_progress"), r = V(e, "ulm_custom_card_washer_job_state") ?? e.entity, n = V(e, "ulm_custom_card_washer_remote_control"), i = V(e, "ulm_custom_card_washer_delayed_start"), l = V(e, "ulm_custom_card_washer_delayed_starttime"), s = V(e, "door_entity"), d = V(e, "finished_entity"), m = y(e, "ulm_custom_card_washer_machine_stop_state") ?? "stop", g = t ? !["off", "unavailable", "unknown", "0"].includes(t.state.toLowerCase()) : a ? !["off", "unavailable", "unknown"].includes(a.state.toLowerCase()) : !0, u = !a || a.state === m || a.state === "off", _ = ["true", "on", "enabled"].includes(n?.state.toLowerCase() ?? ""), b = i?.state === "on", v = Math.max(0, Math.min(100, k(o?.state) ?? 0)), I = y(
    e,
    "ulm_custom_card_washer_job_states"
  ), M = Object.values(I ?? {
    state1: { name: "weightSensing", icon: "mdi:scale" },
    state2: { name: "wash", icon: "mdi:waves" },
    state3: { name: "rinse", icon: "mdi:water" },
    state4: { name: "spin", icon: "mdi:fan" }
  }).filter((C) => C.name && C.icon).slice(0, 5), x = M.findIndex((C) => C.name?.toLowerCase() === r?.state.toLowerCase()), L = g ? u ? _ && b ? y(e, "ulm_custom_card_washer_label_configuring") ?? "configure" : y(e, "ulm_custom_card_washer_label_idle") ?? "idle" : y(e, "ulm_custom_card_washer_label_running") ?? "run" : y(e, "ulm_custom_card_washer_label_idle") ?? "idle", Z = (C) => y(e, C) ?? { action: "none" }, ee = (C, Y) => U(C, e, Y, typeof Y.entity == "string" ? Y.entity : e.config.entity), X = l?.state.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)?.slice(1).map(Number), B = (C, Y) => {
    if (C.stopPropagation(), !l || !X) return;
    const ne = ((X[0] * 60 + X[1] + Y) % 1440 + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: l.entity_id,
      time: `${String(Math.floor(ne / 60)).padStart(2, "0")}:${String(ne % 60).padStart(2, "0")}:00`
    });
  }, te = Z(u ? "ulm_custom_card_washer_start_action" : "ulm_custom_card_washer_pause_action"), j = Z("ulm_custom_card_washer_stop_action");
  return e.actionSurface("custom-washer", c`
    <div class="custom-card-heading washer-heading">
      ${G(e, "mdi:washing-machine", g ? "blue" : "grey")}
      ${E(e, L)}
      ${t ? c`<b class="washer-power">${$(t)}</b>` : h}
    </div>
    ${g && M.length ? c`
      <div class="washer-stages" style=${`--washer-stage-count:${M.length}`}>
        ${M.map((C, Y) => c`
          <span class=${x === Y ? "is-active" : ""} title=${C.name ?? ""}>
            <ha-icon .icon=${C.icon}></ha-icon>
          </span>
        `)}
      </div>
    ` : h}
    ${g && o ? c`
      <div class="washer-progress">
        <span style=${`width:${v}%`}></span>
        <b>${Math.round(v)}%</b>
      </div>
    ` : h}
    ${g && _ ? c`
      <div class="washer-controls">
        ${F(
    u ? "Start washer" : "Pause washer",
    u ? "mdi:play" : "mdi:pause",
    (C) => ee(C, te),
    te.action === "none"
  )}
        ${F(
    "Stop washer",
    "mdi:stop",
    (C) => ee(C, j),
    u || j.action === "none"
  )}
        ${i ? F(
    b ? "Disable delayed start" : "Enable delayed start",
    "mdi:alarm",
    (C) => U(C, e, { action: "toggle" }, i.entity_id),
    !u
  ) : h}
      </div>
    ` : h}
    ${g && _ && b && l ? c`
      <div class="washer-delay-controls">
        ${F("Move delayed start 15 minutes earlier", "mdi:arrow-down", (C) => B(C, -15))}
        <button class="washer-delay-time" aria-label="Move delayed start 1 minute later"
          @pointerdown=${(C) => C.stopPropagation()}
          @click=${(C) => B(C, 1)}>${l.state}</button>
        ${F("Move delayed start 15 minutes later", "mdi:arrow-up", (C) => B(C, 15))}
      </div>
    ` : h}
    ${s || d || n ? c`
      <div class="washer-status">
        ${s ? c`<span><ha-icon icon="mdi:door"></ha-icon>${$(s)}</span>` : h}
        ${d ? c`<span><ha-icon icon="mdi:check-circle"></ha-icon>${$(d)}</span>` : h}
        ${n ? c`<span><ha-icon icon="mdi:remote"></ha-icon>${$(n)}</span>` : h}
      </div>
    ` : h}
  `);
}, Er = (e) => {
  const t = w(e.entity, "next_rising"), a = w(e.entity, "next_setting"), o = w(e.entity, "next_dawn") ?? t, r = w(e.entity, "next_noon"), n = w(e.entity, "next_dusk") ?? a, i = y(e, "language") || e.hass.language || "en", l = y(e, "timeFormat") === "12h", s = (_) => {
    const b = new Date(String(_ ?? ""));
    return Number.isNaN(b.getTime()) ? "—" : new Intl.DateTimeFormat(i, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: l
    }).format(b);
  }, d = e.entity?.state === "above_horizon", m = k(w(e.entity, "elevation")), g = k(w(e.entity, "azimuth")), u = y(e, "title");
  return e.actionSurface(`custom-sun-card ${y(e, "darkMode") ? "is-dark" : ""}`, c`
    ${u ? c`<b class="sun-title">${u}</b>` : h}
    <div class="sun-times"><span><small>Sunrise</small><b>${s(t)}</b></span><span><small>Sunset</small><b>${s(a)}</b></span></div>
    <div class="sun-arc">
      <svg viewBox="0 0 300 90" preserveAspectRatio="none"><path class="sun-night" d="M0,62 Q60,115 105,62"></path><path class="sun-day" d="M0,62 Q150,-45 300,62"></path><line x1="0" y1="62" x2="300" y2="62"></line></svg>
      <span class="sun-marker" style=${d ? "--sun-x:56.67%;--sun-y:20%" : "--sun-x:9.33%;--sun-y:77.78%"}></span>
    </div>
    <div class="sun-footer"><span><small>Dawn</small><b>${s(o)}</b></span><span><small>Solar noon</small><b>${s(r)}</b></span><span><small>Dusk</small><b>${s(n)}</b></span></div>
    ${y(e, "showAzimuth") || y(e, "showElevation") ? c`
      <div class="sun-position">
        ${y(e, "showAzimuth") ? c`<span>Azimuth <b>${g ?? "—"}°</b></span>` : h}
        ${y(e, "showElevation") ? c`<span>Elevation <b>${m ?? "—"}°</b></span>` : h}
      </div>
    ` : h}
  `);
}, zr = (e) => {
  const t = !!(e.entity && !["unavailable", "unknown"].includes(e.entity.state)), o = (t ? e.entity.state : "00:00:00").split(" ").at(-1) || "00:00:00", [r, n] = o.split(":").map(Number), i = (l) => {
    const s = ((r || 0) * 60 + (n || 0) + l + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: e.config.entity,
      time: `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:00`
    });
  };
  return e.actionSurface("custom-input-datetime", c`
    <div class="custom-card-heading">${G(e, "mdi:calendar-clock", "green")}${E(e, $(e.entity))}</div>
    <div class="input-datetime-controls">
      ${F("15 minutes earlier", "mdi:arrow-down", (l) => {
    l.stopPropagation(), i(-15);
  }, !t)}
      ${ir(
    "One minute later; hold for one minute earlier",
    c`<b>${t ? o.slice(0, 5) : "Unavailable"}</b>`,
    () => i(1),
    () => i(-1),
    !t
  )}
      ${F("15 minutes later", "mdi:arrow-up", (l) => {
    l.stopPropagation(), i(15);
  }, !t)}
    </div>
  `);
}, Dr = (e) => {
  const t = [1, 2, 3, 4].map((a) => V(e, `ulm_custom_card_entity_overview_entity_${a}`) ?? (e.config.entities?.[a - 1] ? e.hass.states[e.config.entities[a - 1]] : void 0));
  return e.actionSurface("custom-entity-overview", c`
    <div class="metrics-panel">
      <span class="metrics-main-name"><ha-icon .icon=${y(e, "ulm_custom_card_entity_overview_icon") || "mdi:alien"}></ha-icon>${E(e, $(e.entity))}</span>
      <b>${$(e.entity)}</b>
    </div>
    <div class="metrics-four">${t.map((a, o) => c`
      <button ?disabled=${!a} @pointerdown=${(r) => r.stopPropagation()}
        @click=${(r) => a && U(r, e, { action: "more-info" }, a.entity_id)}>
        <b>${$(a)}</b>
        <small>${y(e, `ulm_custom_card_entity_overview_name_${o + 1}`) || (a ? K({ entity: a.entity_id }, a, e.hass) : `Entity ${o + 1}`)}</small>
      </button>
    `)}</div>
  `);
}, Or = (e) => {
  const t = P(e, "download_entity") ?? V(e, "ulm_custom_card_internet_speed_download_speed_entity") ?? e.entity, a = P(e, "upload_entity") ?? V(e, "ulm_custom_card_internet_speed_upload_speed_entity"), o = P(e, "ping_entity") ?? V(e, "ulm_custom_card_internet_speed_ping_entity"), r = [t, a, o].filter((i) => !!i), n = q(
    y(e, "ulm_custom_card_internet_speed_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface("custom-internet-speed", c`
    <div class="speedtest-router">
      <span class="ulm-icon source-icon is-source-active" style=${`--source-color:${n}`}><ha-icon icon="mdi:wifi"></ha-icon></span>
      ${E(e, y(e, "ulm_custom_card_internet_speed_router_model") || "router_model")}
    </div>
    <button class="speedtest-action" ?disabled=${r.length !== 3}
      @pointerdown=${(i) => i.stopPropagation()} @click=${(i) => {
    i.stopPropagation(), e.service("homeassistant", "update_entity", { entity_id: r.map((l) => l.entity_id) });
  }}>
      <ha-icon icon="mdi:speedometer"></ha-icon>
      <span>${y(e, "ulm_custom_card_internet_speed_speedtest") || "Internet speed test"}</span>
      <ha-icon icon="mdi:chevron-right"></ha-icon>
    </button>
    <div class="speedtest-metrics">
      ${[
    [y(e, "ulm_custom_card_internet_speed_download") || "Download speed", t],
    [y(e, "ulm_custom_card_internet_speed_upload") || "Upload speed", a]
  ].map(([i, l]) => c`
        <button ?disabled=${!l} @pointerdown=${(s) => s.stopPropagation()}
          @click=${(s) => l && U(s, e, { action: "more-info" }, l.entity_id)}>
          <b><span>${l?.state ?? "—"}</span>${w(l, "unit_of_measurement") ? c`<em>${String(w(l, "unit_of_measurement"))}</em>` : h}</b>
          <small>${String(i)}</small>
        </button>
      `)}
    </div>
  `);
}, Tr = (e) => {
  const t = [1, 2, 3, 4].map((i) => V(e, `ulm_custom_card_weather_metrics_entity_${i}`) ?? (e.config.entities?.[i - 1] ? e.hass.states[e.config.entities[i - 1]] : void 0)), a = P(e, "temperature_entity"), o = P(e, "date_entity") ?? V(e, "ulm_custom_card_weather_metrics_date"), r = e.entity?.state || "unknown", n = {
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
      <b class="weather-date">${n[r] || "❔"} ${o ? $(o) : "Date unavailable"}</b>
      <strong>${a ? $(a) : `${w(e.entity, "temperature") ?? "—"}°`}</strong>
    </div>
    <div class="metrics-four">${t.map((i, l) => c`
      <button ?disabled=${!i} @pointerdown=${(s) => s.stopPropagation()}
        @click=${(s) => i && U(s, e, { action: "more-info" }, i.entity_id)}>
        <b>${$(i)}</b>
        <small>${y(e, `ulm_custom_card_weather_metrics_name_${l + 1}`) || (i ? K({ entity: i.entity_id }, i, e.hass) : `Weather ${l + 1}`)}</small>
      </button>
    `)}</div>
  `);
}, Lr = (e) => {
  const t = !e.entity || e.entity.state === "unavailable", a = y(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : w(e.entity, "entity_picture"), o = Math.round((k(w(e.entity, "volume_level")) ?? 0) * 100), r = w(e.entity, "source"), n = ["idle", "paused", "unavailable"].includes(e.entity?.state ?? "") ? $(e.entity) : `${r ? String(r) : $(e.entity)} • ${o}%`, i = _t(e.hass, e.config.entity, e.config), l = la.flatMap((_) => {
    const b = i[_.configKey], v = b ? e.hass.states[b] : void 0;
    return v ? [{ control: _, entity: v }] : [];
  }), s = ca.flatMap((_) => {
    const b = i[_.configKey], v = b ? e.hass.states[b] : void 0;
    return v ? [{ control: _, entity: v }] : [];
  }), d = (e.config.shortcuts?.buttons ?? []).filter((_) => typeof _.id == "string" && _.id.trim().length > 0), m = Math.min(8, Math.max(1, Math.round(e.config.shortcuts?.columns ?? 4))), g = y(e, "sonos_details_always_visible") === !0, u = c`
    ${l.length ? c`<div class="sonos-switches">
      ${l.map(({ control: _, entity: b }) => c`
        <button class=${b.state === "on" ? "is-active" : ""} aria-pressed=${b.state === "on"}
          ?disabled=${b.state === "unavailable"}
          @click=${(v) => {
    v.stopPropagation(), e.service("homeassistant", "toggle", { entity_id: b.entity_id });
  }}>
          <ha-icon .icon=${_.icon}></ha-icon>
          <span>${_.label}</span>
        </button>
      `)}
    </div>` : h}
    ${s.length ? c`<div class="sonos-sliders">
      ${s.map(({ control: _, entity: b }) => {
    const v = k(b.state) ?? 0, I = k(w(b, "min")) ?? -100, M = k(w(b, "max")) ?? 100, x = k(w(b, "step")) ?? 1;
    return c`
          <label>
            <ha-icon .icon=${_.icon}></ha-icon>
            <span>${_.label}</span>
            <input type="range" min=${I} max=${M} step=${x} .value=${String(v)}
              ?disabled=${b.state === "unavailable"}
              aria-label=${_.label}
              @change=${(L) => {
      L.stopPropagation(), e.service("number", "set_value", {
        entity_id: b.entity_id,
        value: Number(L.currentTarget.value)
      });
    }}>
            <output>${v}</output>
          </label>
        `;
  })}
    </div>` : h}
  `;
  return e.actionSurface(`custom-sonos ${a ? "has-art" : ""}`, c`
    ${a ? c`<span class="media-art" style=${`background-image:url("${String(a)}")`}></span>` : h}
    <div class="custom-card-heading">
      ${G(e, "mdi:speaker", e.entity?.state === "playing" ? "green" : "grey")}
      ${E(e, n)}
    </div>
    <div class="sonos-controls">
      ${F("Volume down", "mdi:volume-minus", (_) => {
    _.stopPropagation(), e.service("media_player", "volume_down", { entity_id: e.config.entity });
  }, t)}
      ${F("Play or pause", ["paused", "off"].includes(e.entity?.state ?? "") ? "mdi:play" : "mdi:pause", (_) => {
    _.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: e.config.entity });
  }, t)}
      ${F("Volume up", "mdi:volume-plus", (_) => {
    _.stopPropagation(), e.service("media_player", "volume_up", { entity_id: e.config.entity });
  }, t)}
    </div>
    ${l.length || s.length ? c`
      ${g ? c`<div class="sonos-details sonos-details-always-visible"
            @pointerdown=${(_) => _.stopPropagation()}
            @click=${(_) => _.stopPropagation()}>
            ${u}
          </div>` : c`<details class="sonos-details" @pointerdown=${(_) => _.stopPropagation()}
            @click=${(_) => _.stopPropagation()}>
            <summary>
              <span>More details</span>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </summary>
            ${u}
          </details>`}
    ` : h}
    ${d.length ? c`
      <div class="sonos-shortcuts" style=${`--sonos-shortcut-columns:${m}`}
        @pointerdown=${(_) => _.stopPropagation()}>
        ${d.map((_, b) => c`
          <button
            aria-label=${_.name || `Play shortcut ${b + 1}`}
            title=${_.name || _.id || ""}
            ?disabled=${t}
            @click=${(v) => {
    v.stopPropagation(), e.service("media_player", "play_media", {
      entity_id: e.config.entity,
      media_content_type: _.type || "playlist",
      media_content_id: _.id
    });
  }}>
            <ha-icon .icon=${_.icon || "mdi:playlist-music"}></ha-icon>
            ${_.name ? c`<span>${_.name}</span>` : h}
          </button>
        `)}
      </div>
    ` : h}
  `);
}, Nr = (e) => {
  const t = P(e, "power_entity"), a = P(e, "energy_entity"), o = P(e, "time_entity"), r = o ? (k(o.state) ?? 0) < 1 ? `${(k(o.state) ?? 0) * 100}Mins` : `${o.state}Hrs` : void 0, n = e.entity?.state === "on", i = n ? [
    t ? `${t.state}W` : void 0,
    a ? `${a.state}kWh` : void 0,
    r
  ].filter(Boolean).join(" • ") || $(e.entity) : a && (k(a.state) ?? 0) > 0 ? `${$(e.entity)} • ${a.state}kWh` : $(e.entity);
  return e.actionSurface("custom-more-power-outlet", c`
    ${G(e, "mdi:power-socket-eu", n ? "yellow" : "grey")}
    ${E(e, i || $(e.entity))}
  `);
}, Fr = (e) => {
  const t = k(e.entity?.state) ?? 0, a = k(e.config.minimum) ?? 0, o = k(e.config.maximum) ?? 100, r = Math.max(0, Math.min(100, (t - a) / Math.max(1, o - a) * 100));
  return e.actionSurface("custom-dual-gauge", c`
    <div class="custom-card-heading">${G(e, "mdi:gauge", "blue")}${E(e, $(e.entity))}</div>
    <div class="dual-gauge" style=${`--gauge:${r * 1.8}deg`}>
      <i></i>
      ${a === 0 && o === 100 ? h : c`<span><small>${a} - ${o}</small></span>`}
    </div>
  `);
}, jr = (e) => {
  const t = [
    P(e, "black_entity"),
    P(e, "yellow_entity"),
    P(e, "magenta_entity"),
    P(e, "cyan_entity")
  ], a = ["#111", "#faff00", "#f800ff", "#00ffff"];
  return e.actionSurface("custom-printer", c`
    <div class="custom-card-heading">
      ${G(e, "mdi:printer", e.entity?.state === "idle" ? "grey" : "blue")}
      ${E(e, $(e.entity))}
    </div>
    <div class="toner-bars">${t.map((o, r) => {
    if (!o) return h;
    const n = Math.max(0, Math.min(100, k(o.state) ?? 0));
    return c`<span style=${`--toner:${a[r]};--level:${n}%`}><i><em></em><b>${$(o)}</b></i></span>`;
  })}</div>
  `);
}, Hr = (e) => {
  const t = P(e, "disk_entity") ?? V(e, "entity_4"), a = P(e, "temperature_entity") ?? V(e, "entity_1"), o = P(e, "memory_entity") ?? V(e, "entity_2"), r = P(e, "cpu_entity") ?? V(e, "entity_3"), n = !["off", "unavailable", "unknown"].includes(e.entity?.state ?? ""), i = (u, _) => q(
    y(e, u),
    q(_, _)
  ), l = (u) => !!y(e, u), s = (u) => {
    const _ = e.config[u];
    return _ && typeof _ == "object" && "max_value" in _ ? k(_.max_value) : void 0;
  }, d = (u, _, b, v = 100) => {
    const I = Math.max(0, Math.min(v, k(u?.state) ?? 0)), M = 2 * Math.PI * _, x = M * (1 - I / v);
    return Q`<circle class="nas-metrics-ring-value" cx="70" cy="70" r=${_}
      fill="none" stroke=${b} stroke-width="6" stroke-linecap="round"
      stroke-dasharray=${M} stroke-dashoffset=${x}></circle>`;
  }, m = e.entity?.state === "on" ? "Access" : $(e.entity), g = c`
    <button class="nas-metrics-tile status-tile" aria-label="Open NAS status"
      @pointerdown=${(u) => u.stopPropagation()}
      @click=${(u) => U(u, e, { action: "more-info" })}>
      <span class="nas-metrics-tile-icon tone-blue"><ha-icon icon="mdi:nas"></ha-icon></span>
      <span><b>Status</b><small>${m}</small></span>
    </button>`;
  return n ? e.actionSurface("custom-nas-metrics is-on", c`
    <div class="nas-metrics-top">
      ${g}
      <div class="nas-metrics-tile disk-tile">
        <span class=${`nas-metrics-tile-icon ${l("disk_color") ? "" : "tone-red"}`}
          style=${l("disk_color") ? `color:${i("disk_color", "red")};background:color-mix(in srgb, ${i("disk_color", "red")} 18%, transparent)` : ""}>
          <ha-icon .icon=${y(e, "disk_icon") || "mdi:harddisk"}></ha-icon>
        </span>
        <span><b>${y(e, "disk_name") || "Disk"}</b><small>${$(t)}</small></span>
      </div>
    </div>
    <div class="nas-metrics-body">
      <div class="nas-metrics-metrics">
        <span><i class=${l("temperature_color") ? "" : "tone-orange"} style=${l("temperature_color") ? `color:${i("temperature_color", "orange")}` : ""}><ha-icon .icon=${y(e, "temperature_icon") || "mdi:thermometer"}></ha-icon></i><span><b>${y(e, "temperature_name") || "Temp"}</b><small>${$(a)}</small></span></span>
        <span><i class=${l("memory_color") ? "" : "tone-blue"} style=${l("memory_color") ? `color:${i("memory_color", "blue")}` : ""}><ha-icon .icon=${y(e, "memory_icon") || "mdi:memory"}></ha-icon></i><span><b>${y(e, "memory_name") || "Memory"}</b><small>${$(o)}</small></span></span>
        <span><i class=${l("cpu_color") ? "" : "tone-green"} style=${l("cpu_color") ? `color:${i("cpu_color", "green")}` : ""}><ha-icon .icon=${y(e, "cpu_icon") || "mdi:cpu-64-bit"}></ha-icon></i><span><b>${y(e, "cpu_name") || "CPU"}</b><small>${$(r)}</small></span></span>
      </div>
      <svg class="nas-metrics-rings" viewBox="0 0 140 140" role="img" aria-label="NAS temperature, memory, and CPU utilization">
        ${[58, 48, 38].map((u) => Q`<circle class="nas-metrics-ring-track" cx="70" cy="70" r=${u}
          fill="none" stroke="#dedede" stroke-width="6"></circle>`)}
        ${d(a, 58, i("temperature_color", "orange"), k(y(e, "temperature_max")) ?? s("entity_1") ?? 100)}
        ${d(o, 48, i("memory_color", "blue"), k(y(e, "memory_max")) ?? s("entity_2") ?? 100)}
        ${d(r, 38, i("cpu_color", "green"), k(y(e, "cpu_max")) ?? s("entity_3") ?? 100)}
      </svg>
    </div>
  `) : e.actionSurface("custom-nas-metrics is-off", c`<div class="nas-metrics-top">${g}</div>`);
}, Gr = (e) => {
  const t = P(e, "battery_entity"), a = Math.max(0, Math.min(100, k(t?.state) ?? 0)), o = [
    ["tablet_button_usb_entity", "mdi:usb", "green", "Toggle USB"],
    ["tablet_button_motion_entity", "mdi:motion-sensor", "green", "Toggle motion"],
    ["tablet_button_display_entity", "mdi:monitor", "green", "Toggle display"],
    ["tablet_restart_entity", "mdi:restart-alert", "blue", "Restart tablet"],
    ["tablet_maintenance_entity", "mdi:account-hard-hat-outline", "orange", "Toggle maintenance mode"],
    ["tablet_reload_entity", "mdi:reload", "blue", "Reload tablet"]
  ], n = [
    ["RAM", P(e, "tablet_ram_entity")],
    ["Disk", P(e, "tablet_disk_entity")],
    ["Power", P(e, "tablet_power_entity")]
  ].flatMap(
    ([d, m]) => m ? [[d, m]] : []
  ), i = o.flatMap(
    ([d, m, g, u]) => {
      const _ = P(e, d);
      return _ ? [[m, g, u, _]] : [];
    }
  ), l = e.entity?.state === "on" ? "Access" : $(e.entity), s = (d, m) => {
    if (d.stopPropagation(), !m) return;
    m.entity_id.split(".")[0] === "button" ? e.service("button", "press", { entity_id: m.entity_id }) : e.service("homeassistant", "toggle", { entity_id: m.entity_id });
  };
  return e.actionSurface("custom-tablet", c`
    <div class="tablet-header">
      <span class="tablet-icon"><ha-icon icon="mdi:tablet"></ha-icon></span>
      ${E(e, l)}
    </div>
    ${i.length ? c`<div class="tablet-controls">${i.map(([d, m, g, u]) => {
    const _ = u.state.toLowerCase() === "unavailable";
    return c`<button class="tone-${m} ${oe.has(u.state) ? "is-active" : ""}"
        aria-label=${g} ?disabled=${_}
        @pointerdown=${(b) => b.stopPropagation()}
        @click=${(b) => s(b, u)}>
        <ha-icon .icon=${d}></ha-icon>
      </button>`;
  })}</div>` : h}
    ${n.length ? c`<div class="tablet-metrics">${n.map(([d, m]) => c`
      <span class=${m.state.toLowerCase() === "unavailable" ? "is-unavailable" : ""}><b>${$(m)}</b><small>${d}</small></span>
    `)}</div>` : h}
    ${t ? c`<div class="tablet-battery-row">
      <span class="tablet-battery-icon"><ha-icon icon="mdi:battery"></ha-icon></span>
      <span><b>${$(t)}</b><small>Battery</small></span>
    </div>
    <div class="tablet-battery-bar"><i style=${`width:${a}%`}></i><b>${a}%</b></div>` : h}
  `);
}, Rt = {
  en: ["none", "none to low", "low", "low to medium", "medium", "medium to high", "high"],
  de: ["keine", "keine bis gering", "gering", "gering bis mittel", "mittel", "mittel bis hoch", "hoch"],
  es: ["ninguno", "ninguno a bajo", "bajo", "bajo a medio", "medio", "medio a alto", "alto"],
  pl: ["brak", "bardzo słabe", "słabe", "umiarkowane", "średnie", "wysokie", "bardzo wysokie"]
}, Br = (e, t) => {
  const a = Math.max(0, Math.min(6, Math.round(t))), o = y(e, "pollen_language") || e.hass.language?.split("-")[0] || "en";
  return [y(e, `ulm_custom_card_pollen_forecast_${a || "none"}`) || (Rt[o] ?? Rt.en)[a], ["transparent", "rgb(219,250,200)", "rgb(254,228,156)", "rgb(254,197,77)", "rgb(254,154,36)", "rgb(240,56,26)", "rgb(190,0,33)"][a]];
}, Ur = (e) => {
  const t = P(e, "level_entity") ?? e.entity, a = k(t?.state) ?? 0, [o, r] = Br(e, a);
  return e.actionSurface("custom-pollen-forecast", c`
    ${E(e, o)}
    <span class="pollen-icon" style=${`--pollen:${r}`}><ha-icon .icon=${y(e, "ulm_custom_card_pollen_forecast_icon") || e.config.icon || e.entity?.attributes.icon || "mdi:flower-pollen"}></ha-icon></span>
  `);
}, Rr = (e) => {
  const t = e.entity?.state ?? "unknown", a = pt(e.hass, e.config.entity, e.config), o = (j) => {
    const C = a[j];
    return C ? e.hass.states[C] : void 0;
  }, r = _a(e.hass, e.config.entity, e.config), n = bo(r), i = o("followers_entity"), l = o("following_entity"), s = o("friends_entity"), d = o("primary_stat_entity"), m = o("secondary_stat_entity"), g = o("now_playing_entity"), u = o("gamerpic_entity"), _ = o("artwork_entity"), b = o("console_power_entity"), v = w(u, "entity_picture") ?? w(e.entity, "entity_picture"), I = y(e, "console_show_artwork") === !1 ? void 0 : w(_, "entity_picture") ?? w(e.entity, "media_image_url") ?? w(e.entity, "entity_picture"), M = !!I, x = g && !["unknown", "unavailable", "none", ""].includes(g.state.toLowerCase()) ? $(g) : String(w(e.entity, "media_title") ?? ""), L = K(e.config, e.entity, e.hass), Z = [
    { entity: i, icon: "mdi:account-arrow-left", label: "Followers" },
    { entity: l, icon: "mdi:account-arrow-right", label: "Following" },
    { entity: s, icon: "mdi:account-multiple", label: "Friends" }
  ].filter(({ entity: j }) => j), ee = [
    {
      entity: d,
      icon: y(e, "primary_stat_icon") || (r === "xbox" ? "mdi:microsoft-xbox" : "mdi:trophy")
    },
    {
      entity: m,
      icon: y(e, "secondary_stat_icon") || "mdi:podium"
    }
  ].filter(({ entity: j }) => j), X = b?.entity_id.split(".", 1)[0], B = b && !["off", "standby", "unavailable", "unknown"].includes(b.state), te = (j) => {
    if (j.stopPropagation(), !(!b || !X)) {
      if (X === "switch") {
        e.service("homeassistant", "toggle", { entity_id: b.entity_id });
        return;
      }
      e.service(X, B ? "turn_off" : "turn_on", { entity_id: b.entity_id });
    }
  };
  return e.actionSurface(`custom-console-card platform-${r} state-${t} ${M ? "has-artwork" : ""}`, c`
    ${M ? c`<div class="console-backdrop" style=${`background-image:url("${String(I)}")`}></div>` : h}
    <div class="console-content">
      <div class="console-header">
        <span class="console-logo ${v ? "has-picture" : ""}"
          style=${v ? `background-image:url("${String(v)}")` : ""}>
          ${v ? h : c`<ha-icon .icon=${e.config.icon || n.icon}></ha-icon>`}
        </span>
        <span class="console-title">
          <b>${L}</b>
          <small>${x || $(e.entity)}</small>
        </span>
        ${ee.length ? c`<span class="console-top-stats">
          ${ee.map(({ entity: j, icon: C }) => c`
            <span title=${String(w(j, "friendly_name") ?? "")}>
              <ha-icon .icon=${C}></ha-icon>
              <b>${$(j)}</b>
            </span>
          `)}
        </span>` : h}
      </div>
      ${Z.length ? c`<div class="console-social">
        ${Z.map(({ entity: j, icon: C, label: Y }) => c`
          <span class="console-social-item" title=${Y}><ha-icon .icon=${C}></ha-icon><b>${j?.state}</b></span>
        `)}
      </div>` : h}
      ${y(e, "console_show_controls") !== !1 && b ? c`
        <div class="console-controls">
          <button aria-label=${B ? "Turn console off" : "Turn console on"}
            @pointerdown=${(j) => j.stopPropagation()}
            @click=${te}>
            <ha-icon .icon=${B ? "mdi:power" : "mdi:power-standby"}></ha-icon>
            <span>${B ? "Power off" : "Power on"}</span>
          </button>
        </div>
      ` : h}
    </div>
  `);
}, Wr = (e) => {
  const t = [
    e.config.name,
    e.config.primary_info,
    e.config.secondary_info,
    e.config.icon,
    e.config.show_name === !0 ? !0 : void 0
  ].some((a) => a !== void 0);
  return c`
    <ha-card class="mushroom-addition-card entity-carousel-card">
      ${t ? c`
        <div class="metric-heading entity-carousel-presentation">
          ${ke(e, Te(e, "mdi:view-carousel"), "var(--primary-color)", !0)}
          ${Sa(e)}
        </div>
      ` : h}
      <mushroom-addition-entity-carousel
        .hass=${e.hass}
        .config=${e.config}>
      </mushroom-addition-entity-carousel>
    </ha-card>
  `;
}, qr = (e) => {
  const t = V(e, "ulm_card_vehicle_status_tracker") ?? e.entity, a = V(e, "ulm_card_vehicle_status_energy_level"), o = V(e, "ulm_card_vehicle_status_range"), r = V(e, "ulm_card_vehicle_status_lock"), n = t?.state === "home", i = r?.state === "locked" || r?.state === "off", l = (m) => {
    const g = k(m?.state);
    return g === void 0 ? $(m) : String(Math.round(g));
  }, s = (m, g) => [m?.attributes.unit_of_measurement, g].filter(Boolean).join(" "), d = t?.last_changed ? (() => {
    const m = Math.max(0, Math.round((Date.now() - new Date(t.last_changed).getTime()) / 6e4));
    return m < 1 ? "just now" : `${m} minute${m === 1 ? "" : "s"} ago`;
  })() : $(t);
  return e.actionSurface("custom-vehicle-status", c`
    <button class="car-hero" aria-label="Open car details"
      @pointerdown=${(m) => m.stopPropagation()}
      @click=${(m) => U(m, e, { action: "more-info" }, t?.entity_id)}>
      <span class="car-icon-wrap">${G(e, "mdi:car", "blue")}
        <i class="car-badge tracker ${n ? "is-home" : "is-away"}"><ha-icon .icon=${n ? "mdi:home-variant" : "mdi:road-variant"}></ha-icon></i>
        <i class="car-badge lock ${i ? "is-locked" : "is-unlocked"}"><ha-icon .icon=${i ? "mdi:lock" : "mdi:lock-open"}></ha-icon></i>
      </span>
      ${E(e, d)}
    </button>
    <div class="car-metrics">
      <span><ha-icon icon="mdi:gas-station"></ha-icon><b>${l(a)}</b><small>${s(a, y(e, "ulm_custom_card_vehicle_status_energy_level") || "Nível de energia")}</small></span>
      <span><ha-icon icon="mdi:map-marker-distance"></ha-icon><b>${l(o)}</b><small>${s(o, y(e, "ulm_custom_card_vehicle_status_range") || "Alcance")}</small></span>
    </div>
  `);
}, Kr = (e) => {
  const t = V(e, "ulm_card_flower_entity") ?? e.entity, a = t?.state === "problem", o = (n) => Je.find((i) => i.key === n), r = ga(e.config).flatMap((n) => {
    const i = o(n), l = w(t, n), s = typeof l == "object" && l !== null ? l : void 0, d = V(e, ba(n)), m = typeof s?.sensor == "string" ? s.sensor : typeof l == "string" && e.hass.states[l] ? l : void 0, g = d ?? (m ? e.hass.states[m] : void 0), u = String(w(t, "device_class") ?? ""), _ = t?.entity_id.startsWith("sensor.") && (u === n || n === "moisture" && (!u || u === "humidity")), b = g ?? (_ ? t : void 0), v = k(b?.state) ?? k(s?.current) ?? k(l);
    if (v === void 0) return [];
    const I = k(s?.min) ?? k(w(b, "min")) ?? i.min, M = k(s?.max) ?? k(w(b, "max")) ?? i.max, x = Math.max(0, Math.min(100, (v - I) / Math.max(1, M - I) * 100)), L = b ? $(b) : String(v);
    return [{ key: n, definition: i, sourceEntity: b, value: v, percent: x, display: L }];
  });
  return e.actionSurface("custom-plant", c`
    <button class="flower-heading" aria-label="Open plant details"
      @pointerdown=${(n) => n.stopPropagation()}
      @click=${(n) => U(n, e, { action: "more-info" }, t?.entity_id)}>
      ${G(e, a ? "mdi:alert-circle" : "mdi:flower", a ? "red" : "green")}
      ${E(e, a ? y(e, "ulm_custom_card_plant_problem") || "Problema" : y(e, "ulm_custom_card_plant_correct") || "Correto")}
    </button>
    ${r.length ? c`<div class="flower-bars">${r.map(({ key: n, definition: i, sourceEntity: l, percent: s, display: d }) => {
    const m = `${i.label}: ${d}`;
    return c`<span data-flower-bar=${n} title=${m} aria-label=${m}>
        <ha-icon .icon=${i.icon}></ha-icon>
        <i><em style=${`width:${s}%`}></em></i>
        ${l ? c`<output>${d}</output>` : h}
      </span>`;
  })}</div>` : h}
  `);
}, Xr = (e) => {
  const t = y(e, "ulm_custom_card_speedtest_round") === !0, a = (o, r, n, i, l, s, d, m, g) => {
    const u = V(e, o) ?? V(e, r), _ = k(u?.state), b = Math.max(1, y(e, d) ?? m), v = Math.max(0, Math.min(100, (_ ?? 0) / b * 100)), I = _ === void 0 ? "—" : g && t ? String(Math.round(_)) : u.state, M = u?.attributes.unit_of_measurement, x = q(y(e, l), s);
    return c`
      <div class="speedtest-metric" style=${`--speedtest-color:${x};--speedtest-value:${v}`}>
        <svg class="speedtest-ring" viewBox="0 0 120 100" aria-hidden="true">
          <path class="speedtest-track" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
          <path class="speedtest-value" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
        </svg>
        <span class="speedtest-value-copy"><ha-icon .icon=${i}></ha-icon><b>${I}${M ? ` ${String(M)}` : ""}</b><small>${n}</small></span>
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
}, Yr = (e) => {
  const t = {
    en: { none: "None", very_low: "Very low", low: "Low", medium: "Medium", high: "High", very_high: "Very high", tree: "Trees", grass: "Grass", weed: "Weeds" },
    de: { none: "Keine", very_low: "Sehr niedrig", low: "Niedrig", medium: "Mittel", high: "Hoch", very_high: "Sehr hoch", tree: "Bäume", grass: "Gräser", weed: "Kräuter" },
    es: { none: "Ninguno", very_low: "Muy bajo", low: "Bajo", medium: "Medio", high: "Alto", very_high: "Muy alto", tree: "Árboles", grass: "Hierbas", weed: "Malezas" },
    nl: { none: "Geen", very_low: "Zeer laag", low: "Laag", medium: "Gemiddeld", high: "Hoog", very_high: "Extreem hoog", tree: "Bomen", grass: "Grassen", weed: "Kruiden" },
    pl: { none: "Brak", very_low: "Bardzo słabe", low: "Słabe", medium: "Średnie", high: "Wysokie", very_high: "Bardzo wysokie", tree: "Drzewa", grass: "Trawy", weed: "Zioła" }
  }, a = t[(e.hass.language ?? "en").split("-")[0]] ?? t.en, o = [
    {
      entity: P(e, "trees_entity"),
      name: y(e, "custom_card_pollen_tree_name"),
      icon: y(e, "custom_card_pollen_tree_icon"),
      kind: "tree",
      fallbackIcon: "mdi:tree"
    },
    {
      entity: P(e, "grass_entity"),
      name: y(e, "custom_card_pollen_grass_name"),
      icon: y(e, "custom_card_pollen_grass_icon"),
      kind: "grass",
      fallbackIcon: "mdi:grass"
    },
    {
      entity: P(e, "weeds_entity"),
      name: y(e, "custom_card_pollen_weed_name"),
      icon: y(e, "custom_card_pollen_weed_icon"),
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
  return e.actionSurface("custom-pollen", c`
    <div class="pollen-heading">${E(e, $(e.entity), e.descriptor.name)}</div>
    ${o.map((n) => {
    const i = r(n.entity?.state), l = n.name || n.entity?.attributes.friendly_name || a[n.kind], s = n.icon || n.entity?.attributes.icon || n.fallbackIcon;
    return c`<button class="pollen-item" style=${`--pollen:${i.color}`}
        ?disabled=${!n.entity}
        @pointerdown=${(d) => d.stopPropagation()}
        @click=${(d) => n.entity && U(d, e, { action: "more-info" }, n.entity.entity_id)}>
        <span class="pollen-item-icon"><ha-icon .icon=${s}></ha-icon>
          ${i.extreme ? c`<span class="pollen-extreme"><ha-icon .icon=${"mdi:exclamation-thick"}></ha-icon></span>` : h}
        </span>
        <b>${l}</b><small>${n.entity ? i.label : "Entity unavailable"}</small>
      </button>`;
  })}
  `);
}, Jr = (e) => {
  const t = oe.has(e.entity?.state ?? ""), a = "rgb(var(--rgb-blue, 33, 150, 243))";
  return e.actionSurface("ulm-row", c`
    ${ke(e, Te(e, "mdi:information-outline"), a, t)}
    ${ka(e)}
  `, `--source-color:${a}`);
}, Zr = (e) => {
  const t = k(w(e.entity, "current_temperature")), a = k(w(e.entity, "temperature")), o = k(w(e.entity, "min_temp")) ?? 5, r = k(w(e.entity, "max_temp")) ?? 35, n = e.config.thermostat_temp_step ?? k(w(e.entity, "target_temp_step")) ?? 0.5, i = String(
    w(e.entity, "temperature_unit") ?? w(e.entity, "unit_of_measurement") ?? "°C"
  ), l = P(e, "humidity_entity"), s = k(l?.state) ?? k(w(e.entity, "current_humidity")) ?? k(w(e.entity, "humidity")), m = P(e, "window_sensor")?.state.toLowerCase(), g = ["on", "open", "true"].includes(m ?? "") || w(e.entity, "window_open") === !0 || ["on", "open", "true"].includes(String(w(e.entity, "window_state") ?? "").toLowerCase()), u = P(e, "battery_entity"), _ = k(u?.state) ?? k(w(e.entity, "battery")) ?? k(w(e.entity, "battery_level")), b = _ !== void 0 && _ <= (e.config.low_battery_threshold ?? 20), v = (f) => !!(f && (!e.hass?.states[f] || ["unavailable", "unknown"].includes(e.hass.states[f].state.toLowerCase()))), I = !e.entity || ["unavailable", "unknown"].includes(e.entity.state.toLowerCase()) || v(e.config.window_sensor) || v(e.config.humidity_entity) || v(e.config.battery_entity), M = w(e.entity, "degraded_mode") === !0 || w(e.entity, "is_degraded") === !0, x = String(w(e.entity, "hvac_action") ?? "").toLowerCase(), L = Array.isArray(w(e.entity, "hvac_modes")) ? w(e.entity, "hvac_modes").map(String) : [], Z = String(w(e.entity, "preset_mode") ?? ""), ee = Array.isArray(w(e.entity, "preset_modes")) ? w(e.entity, "preset_modes").map(String) : [], X = e.config.variant === "compact", B = e.config.show_controls !== !1, te = e.config.collapsible_controls === !0 && e.entity?.state === "off", j = {
    off: "mdi:power",
    auto: "mdi:autorenew",
    heat: "mdi:fire",
    cool: "mdi:snowflake",
    heat_cool: "mdi:sun-snowflake-variant",
    dry: "mdi:water-percent",
    fan_only: "mdi:fan"
  }, C = x === "heating" || e.entity?.state === "heat" ? "orange" : x === "cooling" || e.entity?.state === "cool" ? "blue" : e.entity?.state === "off" ? "grey" : "green", Y = [
    I ? ["Connection lost", "mdi:lan-disconnect", "red"] : void 0,
    M ? ["Degraded", "mdi:alert-circle-outline", "orange"] : void 0,
    g ? ["Window open", "mdi:window-open-variant", "blue"] : void 0,
    b ? [`Battery ${Math.round(_)}%`, "mdi:battery-alert-variant-outline", "red"] : void 0,
    x === "heating" ? ["Heating", "mdi:radiator", "orange"] : void 0,
    x === "cooling" ? ["Cooling", "mdi:snowflake", "blue"] : void 0,
    Z === "eco" ? ["Eco", "mdi:leaf", "green"] : void 0
  ].filter((f) => !!f), ne = (f, A) => {
    if (f.stopPropagation(), !e.config.entity || I) return;
    const H = Math.max(o, Math.min(r, A)), N = String(n).split(".")[1]?.length ?? 0, R = Number((Math.round(H / n) * n).toFixed(N));
    e.service("climate", "set_temperature", {
      entity_id: e.config.entity,
      temperature: R
    });
  }, Ne = (f) => f === "fan_only" ? "Fan" : f === "heat_cool" ? "Heat/Cool" : f.replaceAll("_", " ").replace(/\b\w/g, (A) => A.toUpperCase());
  return e.actionSurface(`better-thermostat ${X ? "is-compact" : ""} tone-${C}`, c`
    <div class="better-thermostat-header">
      ${G(e, x === "heating" ? "mdi:radiator" : "mdi:thermostat", C)}
      ${E(e, t === void 0 ? $(e.entity) : `${t}${i} current`)}
      <span class="better-thermostat-temperature">
        <b>${a === void 0 ? "—" : a}${a === void 0 ? "" : i}</b>
        ${e.config.show_humidity !== !1 && s !== void 0 ? c`<small><ha-icon icon="mdi:water-percent" aria-hidden="true"></ha-icon>${Math.round(s)}%</small>` : h}
      </span>
    </div>
    ${e.config.show_status !== !1 && Y.length ? c`<div class="better-thermostat-statuses">
        ${Y.map(([f, A, H]) => c`
          <span class="better-thermostat-status tone-${H}">
            <ha-icon .icon=${A} aria-hidden="true"></ha-icon>${f}
          </span>`)}
      </div>` : h}
    ${B && e.config.show_temperature_control !== !1 ? c`
      <div class="better-thermostat-target">
        ${F("Decrease target temperature", "mdi:minus", (f) => ne(f, (a ?? o) - n), I)}
        ${X ? c`<span>${a === void 0 ? "—" : a}${a === void 0 ? "" : i}</span>` : c`
          <label>
            <span>Target temperature</span>
            <input type="range" name="target_temperature" min=${String(o)} max=${String(r)} step=${String(n)}
              .value=${String(a ?? o)}
              ?disabled=${I}
              aria-label="Target temperature"
              @pointerdown=${(f) => f.stopPropagation()}
              @click=${(f) => f.stopPropagation()}
              @change=${(f) => ne(f, Number(f.target.value))}>
          </label>`}
        ${F("Increase target temperature", "mdi:plus", (f) => ne(f, (a ?? o) + n), I)}
      </div>` : h}
    ${B && e.config.show_hvac_modes !== !1 && L.length ? c`
      <div class="better-thermostat-options" aria-label="HVAC modes">
        ${L.map((f) => c`
          <button type="button" class=${e.entity?.state === f ? "is-selected" : ""} ?disabled=${I}
            @pointerdown=${(A) => A.stopPropagation()}
            @click=${(A) => {
    A.stopPropagation(), e.config.entity && !I && e.service("climate", "set_hvac_mode", { entity_id: e.config.entity, hvac_mode: f });
  }}>
            <ha-icon .icon=${j[f] ?? "mdi:thermostat"} aria-hidden="true"></ha-icon>
            <span>${Ne(f)}</span>
          </button>`)}
      </div>` : h}
    ${B && !te && e.config.show_presets !== !1 && ee.length ? c`
      <div class="better-thermostat-options presets" aria-label="Presets">
        ${ee.map((f) => c`
          <button type="button" class=${Z === f ? "is-selected" : ""} ?disabled=${I}
            @pointerdown=${(A) => A.stopPropagation()}
            @click=${(A) => {
    A.stopPropagation(), e.config.entity && !I && e.service("climate", "set_preset_mode", { entity_id: e.config.entity, preset_mode: f });
  }}>
            <ha-icon .icon=${f === "eco" ? "mdi:leaf" : f === "away" ? "mdi:home-export-outline" : f === "boost" ? "mdi:rocket-launch" : "mdi:home-thermometer"} aria-hidden="true"></ha-icon>
            <span>${f === "none" ? "Normal" : Ne(f)}</span>
          </button>`)}
      </div>` : h}
  `);
}, Qr = (e) => {
  const t = q(
    y(e, "ulm_card_graph_color"),
    "rgb(var(--rgb-red, 244, 67, 54))"
  ), a = q(
    y(e, "ulm_card_graph_icon_color"),
    t
  );
  return e.actionSurface("ulm-default-graph", c`
    <div class="metric-heading">${ke(e, Te(e, "mdi:chart-line"), a, !0)}${ka(e)}</div>
    ${Ia(e, !0, e.entity, t)}
  `);
}, en = (e) => {
  switch (e.descriptor.upstreamId) {
    case "card_battery":
      return cr(e);
    case "card_graph":
      return Qr(e);
    case "card_media_player":
      return Bt(e);
    case "custom_card_trash":
      return Ir(e);
    case "custom_card_alarm_time":
      return Ar(e);
    case "custom_card_roomview":
      return Mr(e);
    case "custom_card_room_overview":
      return Pr(e);
    case "custom_card_welcome":
      return Cr(e);
    case "custom_card_washer":
      return Vr(e);
    case "custom_card_sun":
      return Er(e);
    case "custom_card_input_datetime":
      return zr(e);
    case "custom_card_entity_overview":
      return Dr(e);
    case "custom_card_internet_speed":
      return Or(e);
    case "custom_card_weather_metrics":
      return Tr(e);
    case "custom_card_media_player_sonos":
      return Lr(e);
    case "custom_card_more_power_outlet":
      return Nr(e);
    case "custom_card_gauge":
      return Fr(e);
    case "custom_card_printer":
      return jr(e);
    case "custom_card_nas_metrics":
      return Hr(e);
    case "custom_card_tablet":
      return Gr(e);
    case "custom_card_pollen_forecast":
      return Ur(e);
    case "custom_card_playstation":
      return Rr(e);
    case "custom_card_entity_carousel":
      return Wr(e);
    case "custom_card_vehicle_status":
      return qr(e);
    case "custom_card_plant":
      return Kr(e);
    case "custom_card_speedtest_gauges":
      return Xr(e);
    case "custom_card_pollen":
      return Yr(e);
    case "custom_card_better_thermostat":
      return Zr(e);
    case "card_room":
      return yr(e);
  }
  if (/trash/.test(e.descriptor.upstreamId)) return $r(e);
  if (/printer/.test(e.descriptor.upstreamId)) return xr(e);
  if (/gauge/.test(e.descriptor.upstreamId)) return kr(e);
  if (/vehicle_status|plant|entity_overview/.test(e.descriptor.upstreamId))
    return wr(e, /vehicle_status/.test(e.descriptor.upstreamId) ? "mdi:car" : /plant/.test(e.descriptor.upstreamId) ? "mdi:flower" : "mdi:view-grid", "purple");
  switch (e.descriptor.family) {
    case "scene":
      return _r(e);
    case "battery":
      return lr(e);
    case "bar":
      return dr(e);
    case "energy":
    case "sensor":
      return ur(e);
    case "media":
      return Bt(e);
    case "security":
      return pr(e);
    case "navigation":
      return hr(e);
    case "control":
      return br(e);
    case "alarm-time":
      return Sr(e);
    case "camera":
      return vr(e);
    default:
      return Jr(e);
  }
};
var tn = Object.defineProperty, yt = (e, t, a, o) => {
  for (var r = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = i(t, a, r) || r);
  return r && tn(t, a, r), r;
};
const ft = class ft extends se {
  constructor() {
    super(...arguments), this.holdFired = !1, this.forecastGeneration = 0, this.forecast = [], this.sceneOverflowExpanded = !1, this.actionSurface = (t, a, o = "") => {
      const r = this.descriptor ? ht.get(this.descriptor.upstreamId) : void 0;
      if (!r)
        throw new Error(`Missing explicit parity renderer mapping for ${this.descriptor?.upstreamId}`);
      const n = r ? ` parity-${r.rendererId.replaceAll("_", "-")}` : "", i = this.config?.layout && this.config.layout !== "default" ? ` layout-${this.config.layout}` : "", l = this.config?.multiline_secondary ? " multiline-secondary" : "", s = this.config?.fill_container ? " fill-container" : "", d = this.config?.variant ? ` variant-${this.config.variant}` : "", m = c`
      <div class="${t}${n}${i}${l}${s}${d} action-surface" style=${o} role="button" tabindex="0"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        ${a}
      </div>`;
      return c`<ha-card class="mushroom-addition-card">${m}</ha-card>`;
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
    const a = mo(t), o = this.forecastKey(this.config);
    this.config = a, this.sceneOverflowExpanded = !1, o !== this.forecastKey(a) && this.stopForecastSubscription(), this.requestUpdate(), this.subscribeForecast();
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
        a.rendered ? n : c`${Sa(o)}${n}`,
        i
      ),
      service: (r, n, i) => {
        this.hass?.callService(r, n, i);
      }
    };
    return en(o);
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
    uo(this, r ? { ...this.config, entity: r } : this.config, a);
  }
};
ft.styles = Jo;
let pe = ft;
yt([
  he({ attribute: !1 })
], pe.prototype, "hass");
yt([
  he({ attribute: !1 })
], pe.prototype, "config");
yt([
  ge()
], pe.prototype, "sceneOverflowExpanded");
var an = Object.defineProperty, Le = (e, t, a, o) => {
  for (var r = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = i(t, a, r) || r);
  return r && an(t, a, r), r;
};
const Ce = [
  "var(--accent-color, #03a9f4)",
  "#ff9800",
  "#4caf50",
  "#9c27b0",
  "#f44336",
  "#00bcd4"
], Aa = (e) => {
  const a = (Array.isArray(e.entities) ? e.entities : []).map((o) => typeof o == "string" ? { entity: o } : { ...o });
  return !a.length && e.entity && a.push({ entity: e.entity }), a.filter((o) => !!o.entity);
}, Ma = (e) => ({
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
}), Wt = (e) => {
  const t = Aa(e);
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
    show: Ma(e.show),
    animate: e.animate ?? !1,
    height: e.height ?? 150,
    bar_spacing: e.bar_spacing ?? 4,
    line_width: e.line_width ?? 5,
    line_color: e.line_color ?? Ce[0],
    color_thresholds: Be(e.color_thresholds ?? []),
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
}, Be = (e) => {
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
}, qt = (e, t) => t ? t.split(".").reduce((a, o) => {
  if (!(!a || typeof a != "object"))
    return a[o];
}, e?.attributes) : e?.state, je = (e, t) => {
  const a = String(e ?? ""), o = t.findIndex((n) => n.value === a);
  if (o >= 0)
    return {
      value: o,
      label: t[o].label ?? t[o].value
    };
  const r = Number(e);
  return Number.isFinite(r) ? { value: r } : {};
}, Ca = (e, t) => {
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
}, on = (e, t, a, o = Date.now()) => {
  if (!e.length) return [];
  const r = Math.max(1, Number(t.hours_to_show ?? 24)), n = Math.max(0.01, Number(t.points_per_hour ?? 0.5)), i = o - r * 36e5, l = 36e5 / n, s = /* @__PURE__ */ new Map();
  for (const d of e) {
    if (d.time < i || d.time > o || !Number.isFinite(d.value)) continue;
    const m = new Date(d.time), g = t.group_by === "date" ? `${m.getFullYear()}-${m.getMonth()}-${m.getDate()}` : t.group_by === "hour" ? `${m.getFullYear()}-${m.getMonth()}-${m.getDate()}-${m.getHours()}` : String(Math.floor((d.time - i) / l));
    s.set(g, [...s.get(g) ?? [], d]);
  }
  return [...s.values()].map((d) => ({
    time: d.at(-1).time,
    value: Ca(d.map((m) => m.value), a),
    label: d.at(-1)?.label
  })).sort((d, m) => d.time - m.time);
}, Kt = (e) => {
  if (typeof e == "number" && Number.isFinite(e)) return { value: e, soft: !1 };
  if (typeof e != "string") return { soft: !1 };
  const t = e.trim().startsWith("~"), a = Number(e.replace(/^~/, ""));
  return { value: Number.isFinite(a) ? a : void 0, soft: t };
}, Xt = (e, t, a, o = 0) => {
  let r = e.length ? Math.min(...e) : 0, n = e.length ? Math.max(...e) : 1;
  const i = Kt(t), l = Kt(a);
  if (i.value !== void 0 && (r = i.soft ? Math.min(r, i.value) : i.value), l.value !== void 0 && (n = l.soft ? Math.max(n, l.value) : l.value), n <= r && (n = r + 1), n - r < o) {
    const s = (r + n) / 2;
    r = s - o / 2, n = s + o / 2;
  }
  return { min: r, max: n };
}, Yt = (e, t, a) => {
  let o = a;
  for (const r of t)
    r.value !== void 0 && e >= r.value && (o = r.color);
  return o;
}, rn = (e, t) => Number.isFinite(e) ? e.toLocaleString(void 0, {
  minimumFractionDigits: t,
  maximumFractionDigits: t ?? 2
}) : "Unavailable", nn = (e, t) => {
  if (!e.length) return "";
  if (!t || e.length < 3)
    return e.map((o, r) => `${r ? "L" : "M"} ${o.x} ${o.y}`).join(" ");
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let o = 1; o < e.length; o += 1) {
    const r = e[o - 1], n = e[o], i = (r.x + n.x) / 2;
    a += ` C ${i} ${r.y}, ${i} ${n.y}, ${n.x} ${n.y}`;
  }
  return a;
}, vt = class vt extends se {
  constructor() {
    super(...arguments), this.series = [], this.loading = !1, this.holdFired = !1, this.keydown = (t) => {
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
    return Wt({
      type: "custom:mushroom-addition-mini-graph-card",
      entity: n,
      entities: [{ entity: n }],
      name: t?.states[n]?.attributes.friendly_name,
      show: { graph: "line", fill: !0, points: "hover", labels: "hover" }
    });
  }
  setConfig(t) {
    this.config = Wt(t), this.restartInterval(), this.requestKey = void 0, this.loadHistory();
  }
  getCardSize() {
    return Math.max(1, Math.ceil((Number(this.config?.height ?? 150) + 110) / 50));
  }
  updated(t) {
    (t.has("hass") || t.has("config")) && this.loadHistory();
  }
  connectedCallback() {
    super.connectedCallback(), this.restartInterval();
  }
  disconnectedCallback() {
    this.interval && window.clearInterval(this.interval), super.disconnectedCallback();
  }
  render() {
    if (!this.config) return h;
    if (!this.hass) return c`<ha-card><div class="loading">Mini Graph preview</div></ha-card>`;
    const t = Ma(this.config.show), a = this.series[0], o = a ? Yt(
      Number(a.state),
      Be(this.config.color_thresholds ?? []),
      a.color
    ) : Ce[0], r = [
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
          ${this.renderHeader(a, o, t)}
          ${this.renderStates(a, o, t)}
          ${this.loading && t.loading_indicator ? c`<div class="loading"><ha-spinner size="small"></ha-spinner></div>` : this.error ? c`<div class="warning">${this.error}</div>` : this.renderGraph(t)}
          ${this.renderLegend(t)}
          ${this.renderStatistics(t)}
        </div>
      </ha-card>
    `;
  }
  renderHeader(t, a, o) {
    if (!o.name && (!o.icon || this.config?.align_icon === "state")) return h;
    const r = o.icon && this.config?.icon_type !== "none" && this.config?.align_icon !== "state" ? this.renderIcon(t, a, o) : h, n = this.presentation(t);
    return c`
      <div class="header" data-align=${this.config?.align_header ?? "default"}
        style=${`font-size:${this.config?.font_size_header ?? 14}px`}>
        ${this.config?.align_icon === "left" ? r : h}
        ${o.name ? c`
          <span class="name shared-presentation" style=${o.name_adaptive_color ? `color:${a}` : ""}>
            ${n.primary ? c`<span class="ulm-name">${n.primary}</span>` : h}
            ${n.secondary ? c`<span class="ulm-label">${n.secondary}</span>` : h}
          </span>
        ` : h}
        ${this.config?.align_icon !== "left" ? r : h}
      </div>
    `;
  }
  renderIcon(t, a, o) {
    const r = t ? this.hass?.states[t.config.entity] : void 0, n = this.config?.icon_type === "entity-picture" ? r?.attributes.entity_picture : void 0;
    return c`
      <span class="icon" style=${o.icon_adaptive_color ? `color:${a}` : ""}>
        ${this.config?.icon_image ? c`<img src=${this.config.icon_image} alt="">` : n ? c`<img src=${String(n)} alt="">` : c`<ha-icon .icon=${this.config?.icon ?? this.hass?.states[t?.config.entity ?? ""]?.attributes.icon ?? "mdi:chart-line"}></ha-icon>`}
      </span>
    `;
  }
  renderStates(t, a, o) {
    if (!o.state || !t) return h;
    const r = o.state === "last" ? t.points.at(-1)?.value : t.state, n = Number(r), i = this.stateLabel(n, t.points.at(-1)?.label);
    return c`
      <div class="states" data-align=${this.config?.align_state ?? "left"}>
        ${this.renderState(t, i, a, !0)}
        ${this.series.slice(1).filter((l) => l.config.show_state).map((l) => this.renderState(
      l,
      this.stateLabel(Number(l.state), l.points.at(-1)?.label),
      Yt(Number(l.state), Be(this.config?.color_thresholds ?? []), l.color),
      !1
    ))}
        ${o.icon && this.config?.icon_type !== "none" && this.config?.align_icon === "state" ? this.renderIcon(t, a, o) : h}
      </div>
    `;
  }
  presentation(t) {
    if (!this.config) return {};
    const a = t?.config.entity ?? this.config.entity, o = a ? this.hass?.states[a] : void 0, r = K(this.config, o, this.hass), n = $(o), i = (l) => {
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
    return c`
      <span class="state ${r ? "primary" : "secondary"}" style=${n ? `color:${n}` : ""}>
        ${t.config.show_indicator ? c`<span class="indicator" style=${`background:${o}`}></span>` : h}
        <span class="state-value">${a}</span>
        <span class="unit">${t.unit}</span>
      </span>
    `;
  }
  renderGraph(t) {
    if (!t.graph || !this.series.some((m) => m.config.show_graph !== !1)) return h;
    const a = this.series.filter((m) => m.config.show_graph !== !1 && m.points.length), o = a.filter((m) => m.config.y_axis !== "secondary"), r = a.filter((m) => m.config.y_axis === "secondary"), n = Xt(
      o.flatMap((m) => m.points.map((g) => g.value)),
      this.config?.lower_bound,
      this.config?.upper_bound,
      Number(this.config?.min_bound_range ?? 0)
    ), i = Xt(
      r.flatMap((m) => m.points.map((g) => g.value)),
      this.config?.lower_bound_secondary,
      this.config?.upper_bound_secondary,
      Number(this.config?.min_bound_range_secondary ?? 0)
    ), l = a.flatMap((m) => m.points.map((g) => g.time)), s = Math.min(...l), d = Math.max(...l);
    return c`
      <div class="graph" style=${`height:${this.config?.height ?? 150}px`}>
        ${t.labels && o.length ? c`
          <div class="labels">
            <span>${this.stateLabel(n.max)}</span>
            <span>${this.stateLabel(n.min)}</span>
          </div>` : h}
        ${t.labels_secondary && r.length ? c`
          <div class="labels secondary">
            <span>${this.stateLabel(i.max)}</span>
            <span>${this.stateLabel(i.min)}</span>
          </div>` : h}
        <svg class="chart" viewBox="0 0 500 ${this.config?.height ?? 150}" preserveAspectRatio="none"
          @click=${(m) => m.stopPropagation()}>
          <defs>
            ${a.map((m, g) => this.renderGradient(m, g, m.config.y_axis === "secondary" ? i : n))}
          </defs>
          ${a.map((m, g) => this.renderSeries(
      m,
      g,
      m.config.y_axis === "secondary" ? i : n,
      s,
      d,
      t,
      a.length
    ))}
        </svg>
      </div>
    `;
  }
  renderGradient(t, a, o) {
    const r = Be(this.config?.color_thresholds ?? []), n = this.config?.color_thresholds_transition ?? "smooth";
    if (!r.length || t.config.color)
      return Q`<linearGradient id=${`mini-graph-${a}`}><stop offset="0%" stop-color=${t.color}/><stop offset="100%" stop-color=${t.color}/></linearGradient>`;
    const i = r.flatMap((l, s) => {
      const d = Math.max(0, Math.min(100, 100 - ((l.value ?? o.min) - o.min) / (o.max - o.min) * 100));
      return n === "hard" && s > 0 ? [
        Q`<stop offset=${`${d}%`} stop-color=${r[s - 1].color}/>`,
        Q`<stop offset=${`${d}%`} stop-color=${l.color}/>`
      ] : [Q`<stop offset=${`${d}%`} stop-color=${l.color}/>`];
    });
    return Q`<linearGradient id=${`mini-graph-${a}`} x1="0" y1="1" x2="0" y2="0">${i}</linearGradient>`;
  }
  renderSeries(t, a, o, r, n, i, l) {
    const s = Number(this.config?.height ?? 150), d = (b) => {
      const v = this.config?.logarithmic ? Math.log10(Math.max(b, Number.EPSILON)) : b, I = this.config?.logarithmic ? Math.log10(Math.max(o.min, Number.EPSILON)) : o.min, M = this.config?.logarithmic ? Math.log10(Math.max(o.max, Number.EPSILON)) : o.max;
      return s - (v - I) / Math.max(Number.EPSILON, M - I) * s;
    }, m = t.points.map((b) => ({
      x: (b.time - r) / Math.max(1, n - r) * 500,
      y: d(b.value),
      value: b.value,
      time: b.time
    })), g = t.config.color ? t.color : `url(#mini-graph-${a})`;
    if (i.graph === "bar") {
      const b = 500 / Math.max(1, Math.min(96, m.length)), v = Number(this.config?.bar_spacing ?? 4), I = Math.max(1, (b - v) / l);
      return Q`
        <g class="series">
          ${m.slice(-96).map((M, x) => {
        const L = x * b + a * I + v / 2;
        return Q`<rect x=${L} y=${M.y} width=${I} height=${Math.max(0, s - M.y)} rx="1" fill=${g}>
              <title>${this.tooltip(t, M.value, M.time)}</title>
            </rect>`;
      })}
        </g>
      `;
    }
    const u = nn(m, t.config.smoothing ?? this.config?.smoothing ?? !0), _ = m.length ? `${u} L ${m.at(-1).x} ${s} L ${m[0].x} ${s} Z` : "";
    return Q`
      <g class="series">
        ${i.fill && t.config.show_fill !== !1 ? Q`<path class="fill ${i.fill === "fade" ? "fade" : ""}" d=${_} fill=${g}/>` : h}
        ${t.config.show_line !== !1 ? Q`<path class="line" d=${u} stroke=${g} stroke-width=${this.config?.line_width ?? 5}/>` : h}
        ${i.points && t.config.show_points !== !1 ? m.map((b) => Q`
            <circle class="point" cx=${b.x} cy=${b.y} r=${Math.max(2, Number(this.config?.line_width ?? 5) / 1.5)}
              fill=${t.config.color ?? g}>
              <title>${this.tooltip(t, b.value, b.time)}</title>
            </circle>`) : h}
      </g>
    `;
  }
  renderLegend(t) {
    const a = this.series.filter((o) => o.config.show_legend !== !1);
    return !t.legend || a.length < 2 ? h : c`
      <div class="legend">
        ${a.map((o) => c`
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
    const o = a.points.map((l) => l.value), r = Ca(o, "avg"), n = Math.min(...o), i = Math.max(...o);
    return c`
      <div class="statistics">
        ${t.average ? c`<span>Average <b>${this.stateLabel(r)} ${a.unit}</b></span>` : h}
        ${t.extrema ? c`
          <span>Minimum <b>${this.stateLabel(n)} ${a.unit}</b></span>
          <span>Maximum <b>${this.stateLabel(i)} ${a.unit}</b></span>
        ` : h}
      </div>
    `;
  }
  stateLabel(t, a) {
    if (a) return a;
    const o = this.config?.state_map?.[Math.round(t)];
    return o && Math.abs(t - Math.round(t)) < Number.EPSILON ? o.label ?? o.value : rn(t, this.config?.decimals);
  }
  tooltip(t, a, o) {
    const r = new Date(o).toLocaleString(this.hass?.language, {
      hour12: !(this.config?.hour24 ?? !1)
    });
    return `${t.name}: ${this.stateLabel(a)}${t.unit ? ` ${t.unit}` : ""} · ${r}`;
  }
  restartInterval() {
    this.interval && window.clearInterval(this.interval), this.interval = void 0, !(!this.isConnected || !this.config?.update_interval) && (this.interval = window.setInterval(() => {
      this.requestKey = void 0, this.loadHistory();
    }, this.config.update_interval * 1e3));
  }
  async loadHistory() {
    if (!this.hass || !this.config) return;
    const t = Aa(this.config), a = JSON.stringify({
      entities: t,
      hours: this.config.hours_to_show,
      points: this.config.points_per_hour,
      grouping: this.config.group_by,
      factor: this.config.value_factor,
      map: this.config.state_map
    });
    if (a !== this.requestKey) {
      this.requestKey = a, this.loading = !0, this.error = void 0;
      try {
        const o = Date.now(), r = o - Number(this.config.hours_to_show ?? 24) * 36e5, n = await this.fetchHistory(t, r, o);
        this.series = t.map((i, l) => this.buildSeries(i, l, n[i.entity] ?? [], r, o)), this.error = this.series.some((i) => i.points.length) ? void 0 : "No recorder history is available for the selected entities.";
      } catch (o) {
        this.error = o instanceof Error ? o.message : "Unable to load recorder history.", console.warn("Mushroom Cards Addition: unable to load Mini Graph history", o);
      } finally {
        this.loading = !1;
      }
    }
  }
  async fetchHistory(t, a, o) {
    const r = {}, n = [];
    for (const s of t) {
      if (s.fixed_value) continue;
      const d = this.readCache(s, a);
      d ? r[s.entity] = d : n.push(s);
    }
    if (!n.length) return r;
    if (!this.hass?.connection?.sendMessagePromise) {
      for (const s of n) r[s.entity] = this.attributeHistory(s);
      return r;
    }
    const i = await this.hass.connection.sendMessagePromise({
      type: "history/history_during_period",
      start_time: new Date(a).toISOString(),
      end_time: new Date(o).toISOString(),
      entity_ids: [...new Set(n.map((s) => s.entity))],
      no_attributes: !1,
      minimal_response: !1,
      significant_changes_only: !1
    }), l = i && typeof i == "object" ? i : {};
    for (const s of n) {
      const m = (Array.isArray(l[s.entity]) ? l[s.entity] : []).flatMap((g) => {
        if (!g || typeof g != "object") return [];
        const u = g, _ = u.state ?? u.s, b = u.attributes ?? u.a ?? {}, v = s.attribute ? s.attribute.split(".").reduce((x, L) => x && typeof x == "object" ? x[L] : void 0, b) : _, I = je(v, this.config?.state_map ?? []), M = Date.parse(String(
          u.last_updated ?? u.last_changed ?? u.lu ?? u.lc ?? new Date(o).toISOString()
        ));
        return I.value === void 0 || !Number.isFinite(M) ? [] : [{ time: M, value: I.value, label: I.label }];
      });
      r[s.entity] = m.length ? m : this.attributeHistory(s), this.writeCache(s, r[s.entity]);
    }
    return r;
  }
  attributeHistory(t) {
    const a = this.hass?.states[t.entity], o = a?.attributes.history;
    if (Array.isArray(o)) {
      const n = Date.now();
      return o.flatMap((i, l) => {
        const s = typeof i == "object" && i ? i.value ?? i.state : i, d = je(s, this.config?.state_map ?? []), m = typeof i == "object" && i ? Date.parse(String(i.time ?? i.last_changed ?? "")) : Number.NaN;
        return d.value === void 0 ? [] : [{
          time: Number.isFinite(m) ? m : n - (o.length - l - 1) * 36e5 / Number(this.config?.points_per_hour ?? 0.5),
          value: d.value,
          label: d.label
        }];
      });
    }
    const r = je(qt(a, t.attribute), this.config?.state_map ?? []);
    return r.value === void 0 ? [] : [{ time: Date.now(), value: r.value, label: r.label }];
  }
  buildSeries(t, a, o, r, n) {
    const i = this.hass?.states[t.entity], l = je(qt(i, t.attribute), this.config?.state_map ?? []), s = 10 ** Number(this.config?.value_factor ?? 0), m = (t.fixed_value && l.value !== void 0 ? [{ time: r, value: l.value }, { time: n, value: l.value }] : o).map((_) => ({ ..._, value: _.value * s })), g = on(
      m,
      this.config ?? {},
      t.aggregate_func ?? this.config?.aggregate_func ?? "avg",
      n
    ), u = Array.isArray(this.config?.line_color) ? this.config.line_color : [this.config?.line_color ?? Ce[0]];
    return {
      config: t,
      points: g,
      color: t.color ?? u[a] ?? Ce[a % Ce.length],
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
        return !o || Date.now() - o.fetchedAt > r ? void 0 : o.points.filter((n) => n.time >= a);
      } catch {
        return;
      }
  }
  writeCache(t, a) {
    if (!(!this.config?.cache || typeof localStorage > "u"))
      try {
        localStorage.setItem(this.cacheKey(t), JSON.stringify({ fetchedAt: Date.now(), points: a }));
      } catch (o) {
        console.warn("Mushroom Cards Addition: unable to cache Mini Graph history", o);
      }
  }
  runAction(t) {
    if (!this.config) return;
    const a = t === "tap_action" ? "tap" : t === "hold_action" ? "hold" : "double_tap", o = this.config[t], r = typeof o?.entity == "string" ? o.entity : this.config.entity;
    ae(this, "hass-action", {
      config: { ...this.config, entity: r },
      action: a
    });
  }
};
vt.styles = We`
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
let le = vt;
Le([
  he({ attribute: !1 })
], le.prototype, "hass");
Le([
  ge()
], le.prototype, "config");
Le([
  ge()
], le.prototype, "series");
Le([
  ge()
], le.prototype, "loading");
Le([
  ge()
], le.prototype, "error");
const sn = (e, t, a = [], o = []) => {
  const r = [...a, ...o, ...Object.keys(t?.states ?? {})], n = [...new Set(r)].filter((l) => t?.states?.[l] !== void 0), i = n.filter((l) => !["unavailable", "unknown"].includes(t?.states?.[l]?.state.toLowerCase() ?? ""));
  for (const l of e.preferredDomains ?? []) {
    const s = i.find((d) => d.startsWith(`${l}.`)) ?? n.find((d) => d.startsWith(`${l}.`));
    if (s) return s;
  }
  return i[0] ?? n[0];
}, ln = (e) => e.name.replace(/ (Card|Chip)$/, ""), Pa = (e, t, a = [], o = []) => {
  const r = [.../* @__PURE__ */ new Set([...a, ...o, ...Object.keys(t?.states ?? {})])].filter((f) => t?.states?.[f] !== void 0), n = (f) => {
    const A = t?.states[f];
    return [
      f,
      A?.attributes.friendly_name,
      A?.attributes.device_class,
      A?.attributes.unit_of_measurement
    ].filter(Boolean).join(" ").toLowerCase();
  }, i = (f) => [
    ...f.filter((A) => !["unavailable", "unknown"].includes(t?.states[A]?.state.toLowerCase() ?? "")),
    ...f.filter((A) => ["unavailable", "unknown"].includes(t?.states[A]?.state.toLowerCase() ?? ""))
  ], l = (f) => !["unavailable", "unknown"].includes(t?.states[f]?.state.toLowerCase() ?? ""), s = (f, A) => i(r.filter((H) => f.some((N) => H.startsWith(`${N}.`)) && A.every((N) => n(H).includes(N))))[0], d = (f, A, H) => i(r.filter((N) => f.some((R) => N.startsWith(`${R}.`)) && A.every((R) => n(N).includes(R)) && H.every((R) => !n(N).includes(R))))[0], m = (f, A, H = []) => r.find((N) => l(N) && f.some((R) => N.startsWith(`${R}.`)) && A.every((R) => n(N).split(/[^a-z0-9]+/).includes(R)) && H.every((R) => !n(N).includes(R))), g = (f, A = [], H = []) => i(r.filter((N) => {
    const R = t?.states[N], Se = n(N);
    return N.startsWith("sensor.") && f.includes(String(R?.attributes.device_class ?? "")) && A.every((ce) => Se.includes(ce)) && H.every((ce) => !Se.includes(ce));
  }))[0], u = (f, A = [], H = []) => r.find((N) => {
    const R = t?.states[N], Se = n(N);
    return l(N) && N.startsWith("sensor.") && f.includes(String(R?.attributes.device_class ?? "")) && A.every((ce) => Se.includes(ce)) && H.every((ce) => !Se.includes(ce));
  }), _ = r.filter((f) => f.startsWith("media_player.") && n(f).includes("sonos")).sort((f, A) => Lt(t, A) - Lt(t, f))[0], b = e.upstreamId === "mini_graph_card" ? g(["temperature"]) ?? g(["power", "energy"]) ?? s(["sensor"], []) : e.upstreamId === "card_graph" ? s(["sensor"], ["cv", "plug", "power"]) ?? g(["power", "energy"]) : e.upstreamId === "card_media_player" ? s(["media_player"], ["office", "joris", "tv"]) : e.upstreamId === "card_battery" ? d(["sensor"], ["battery", "level"], ["state", "charging"]) ?? g(["battery"], [], ["state", "charging"]) : e.upstreamId === "custom_card_pollen_forecast" ? s(["sensor"], ["pollen", "grass", "level"]) ?? s(["sensor"], ["pollen", "grass"]) ?? s(["sensor"], ["pollen"]) : e.upstreamId === "custom_card_pollen" ? s(["sensor"], ["pollen", "grass"]) : e.upstreamId === "custom_card_speedtest_gauges" ? s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) : e.upstreamId === "custom_card_tablet" ? s(["binary_sensor", "sensor", "switch"], ["tablet"]) : e.upstreamId === "custom_card_nas_metrics" ? s(["switch", "binary_sensor"], ["nas"]) ?? s(["switch", "binary_sensor"], ["status"]) : e.upstreamId === "custom_card_washer" ? s(["sensor"], ["operation", "state"]) ?? s(["sensor"], ["washer", "state"]) : e.upstreamId === "custom_card_sun" ? s(["sun"], []) : e.upstreamId === "custom_card_media_player_sonos" ? _ : e.upstreamId === "custom_card_more_power_outlet" ? s(["switch", "light"], ["outlet"]) ?? s(["switch", "light"], ["plug"]) : e.upstreamId === "custom_card_printer" ? s(["sensor", "binary_sensor"], ["printer"]) ?? s(["sensor", "binary_sensor"], ["online"]) : e.upstreamId === "custom_card_internet_speed" ? s(["sensor"], ["download"]) : e.upstreamId === "custom_card_weather_metrics" ? s(["weather"], []) : e.upstreamId === "card_room" ? s(["light"], []) : e.upstreamId === "custom_card_vehicle_status" ? s(["sensor"], ["model"]) ?? s(["device_tracker"], []) : e.upstreamId === "custom_card_plant" ? s(["plant"], []) ?? s(["sensor"], ["soil", "humidity"]) : e.upstreamId === "custom_card_playstation" ? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["xbox"]) ?? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["playstation"]) ?? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["nintendo"]) ?? s(["media_player", "remote"], []) : e.upstreamId === "custom_card_better_thermostat" ? s(["climate"], ["living", "room"]) ?? s(["climate"], []) : void 0, v = e.upstreamId === "card_scenes" ? void 0 : b ?? sn(e, t, a, o), I = e.upstreamId === "custom_card_plant" ? {
    moisture_entity: (v && t?.states[v]?.attributes.device_class === "moisture" ? v : void 0) ?? u(["moisture"], ["soil"]) ?? u(["moisture"]),
    temperature_entity: u(["temperature"], ["soil"]) ?? u(["temperature"], ["plant"]),
    humidity_entity: u(["humidity"], ["plant"]) ?? u(["humidity"], ["soil"]),
    conductivity_entity: u(["conductivity"], ["plant"]) ?? m(["sensor"], ["conductivity"]),
    illuminance_entity: u(["illuminance"], ["plant"]) ?? m(["sensor"], ["plant", "illuminance"]),
    dli_entity: m(["sensor"], ["dli"])
  } : {}, M = Object.entries(I).filter(([, f]) => f).map(([f]) => f.replace(/_entity$/, "")), x = ["text", "navigation"].includes(e.family), L = e.variants?.[0], Z = v?.split(".", 1)[0], ee = ["light", "switch", "input_boolean", "fan"].includes(Z ?? "") ? { action: "toggle" } : { action: v ? "more-info" : "none" }, X = (f, A) => [...new Set(f.filter((H) => !!H))].slice(0, A), B = s(["sensor"], ["outdoor", "temperature"]) ?? s(["sensor"], ["outside", "temperature"]) ?? s(["sensor"], ["garden", "temperature"]) ?? g(["temperature"], [], ["battery", "cpu", "soil"]), te = s(["sensor"], ["date", "time"]) ?? s(["sensor"], ["time", "date"]) ?? s(["sensor"], ["date"]), j = [
    [u(["humidity"]), "Humidity"],
    [
      u(["wind_speed"]) ?? m(["sensor"], ["wind", "speed"]) ?? m(["sensor"], ["wind"]),
      "Wind"
    ],
    [
      u(["atmospheric_pressure"]) ?? m(["sensor"], ["barometric", "pressure"]) ?? m(["sensor"], ["pressure"], ["blood"]),
      "Pressure"
    ],
    [
      u(["precipitation", "precipitation_intensity"]) ?? m(["sensor"], ["precipitation"]) ?? m(["sensor"], ["rain"]),
      "Precipitation"
    ],
    [m(["sensor"], ["visibility"]), "Visibility"],
    [m(["sensor"], ["cloud", "coverage"]), "Cloud cover"],
    [m(["sensor"], ["uv", "index"]), "UV index"],
    [u(["illuminance"]), "Light level"],
    [m(["sensor"], ["dew", "point"]), "Dew point"]
  ], C = _a(t, v), Y = j.filter(
    ([f], A, H) => !!f && H.findIndex(([N]) => N === f) === A
  ).slice(0, 4), ne = X([
    g(["temperature"]),
    g(["humidity"]),
    g(["power", "energy"]),
    g(["battery"]),
    ...r.filter((f) => f.startsWith("sensor."))
  ], 4), Ne = e.upstreamId === "custom_card_sun" || e.upstreamId === "custom_card_pollen" || e.upstreamId === "card_welcome_scenes" ? { action: "none" } : e.upstreamId === "custom_card_speedtest_gauges" ? {
    action: "perform-action",
    perform_action: "homeassistant.update_entity",
    target: {
      entity_id: [
        s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) ?? v,
        s(["sensor"], ["speedtest", "upload"]) ?? s(["sensor"], ["upload"]),
        s(["sensor"], ["speedtest", "ping"]) ?? s(["sensor"], ["ping"])
      ].filter((f) => !!f)
    }
  } : e.upstreamId === "custom_card_playstation" ? { action: v ? "more-info" : "none", entity: v } : e.upstreamId === "custom_card_vehicle_status" || e.upstreamId === "custom_card_plant" ? { action: "more-info" } : ee;
  return {
    ...$a(e, t, v),
    name: v ? t?.states[v]?.attributes.friendly_name : ln(e),
    secondary: v ? void 0 : x ? "Example" : "Preview",
    variant: L,
    tap_action: Ne,
    show_controls: ["climate", "vacuum", "control"].includes(e.family) || e.family === "media" && e.upstreamId !== "card_media_player" ? !0 : void 0,
    show_forecast: e.family === "weather",
    show_graph: ["battery", "energy", "sensor"].includes(e.family),
    ulm_custom_card_bar_card_value: e.family === "bar" ? !0 : void 0,
    entities: e.upstreamId === "mini_graph_card" && v ? [v] : e.variants?.includes("with-sensors") ? o.slice(0, 2) : void 0,
    ...e.upstreamId === "custom_card_washer" ? {
      power_entity: s(["sensor", "switch"], ["wasmachine", "power"]) ?? s(["sensor", "switch"], ["washer", "power"]) ?? s(["sensor", "switch"], ["power"]),
      door_entity: s(["sensor", "binary_sensor"], ["washer", "door"]) ?? s(["sensor", "binary_sensor"], ["door"]),
      finished_entity: s(["sensor", "binary_sensor"], ["washer", "finished"]) ?? s(["sensor", "binary_sensor"], ["finished"]),
      ulm_custom_card_washer_machine_state: v,
      ulm_custom_card_washer_machine_stop_state: "stop",
      ulm_custom_card_washer_label_idle: "idle",
      ulm_custom_card_washer_label_configuring: "configure",
      ulm_custom_card_washer_label_running: "run"
    } : {},
    ...e.upstreamId === "custom_card_better_thermostat" ? {
      window_sensor: s(["binary_sensor"], ["window"]) ?? s(["binary_sensor"], ["door"]),
      humidity_entity: g(["humidity"]),
      battery_entity: g(["battery"], [], ["phone", "tablet"])
    } : {},
    ...e.upstreamId === "custom_card_sun" ? {
      darkMode: !1,
      language: t?.language ?? "en",
      showAzimuth: !1,
      showElevation: !1,
      timeFormat: "24h"
    } : {},
    ...e.upstreamId === "custom_card_pollen_forecast" ? {
      entity: s(["sensor"], ["pollen", "grass", "level"]) ?? v,
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
    ...e.upstreamId === "custom_card_vehicle_status" ? {
      entity: v,
      ulm_card_vehicle_status_tracker: v,
      ulm_card_vehicle_status_lock: s(["lock"], ["car"]) ?? s(["binary_sensor"], ["doors"]),
      ulm_card_vehicle_status_energy_level: s(["sensor"], ["primary", "engine", "percent"]) ?? s(["sensor"], ["battery"]),
      ulm_card_vehicle_status_range: s(["sensor"], ["range"]),
      ulm_card_vehicle_status_name: v ? t?.states[v]?.attributes.friendly_name : void 0
    } : {},
    ...e.upstreamId === "custom_card_plant" ? {
      entity: v,
      ulm_card_flower_entity: v,
      ulm_card_flower_name: v ? t?.states[v]?.attributes.friendly_name : "No name set",
      ulm_card_flower_show_bars: M.length ? M : ["moisture"],
      ...I
    } : {},
    ...e.upstreamId === "card_room" ? {
      room_sensors: [
        s(["sensor"], ["illuminance"]),
        s(["sensor"], ["temperature"])
      ].filter((f) => !!f).map((f) => ({ entity: f }))
    } : {},
    ...e.upstreamId === "card_scenes" ? {
      scene_items: r.filter((f) => f.startsWith("scene.")).slice(0, 7).map((f) => fe(t, f))
    } : {},
    ...e.upstreamId === "card_welcome_scenes" ? {
      name: void 0,
      secondary: "Scenes",
      collapse_entity: s(["input_boolean"], ["collapse"]) ?? s(["input_boolean"], ["dropdown"]) ?? s(["input_boolean"], []),
      scene_items: r.filter((f) => f.startsWith("scene.")).slice(0, 5).map((f) => fe(t, f))
    } : {},
    ...e.upstreamId === "custom_card_internet_speed" ? {
      download_entity: s(["sensor"], ["download"]) ?? v,
      upload_entity: s(["sensor"], ["upload"]),
      ping_entity: s(["sensor"], ["ping"])
    } : {},
    ...e.upstreamId === "custom_card_entity_overview" ? {
      entities: ne,
      ...Object.fromEntries(ne.flatMap((f, A) => [
        [`ulm_custom_card_entity_overview_entity_${A + 1}`, f],
        [
          `ulm_custom_card_entity_overview_name_${A + 1}`,
          t?.states[f]?.attributes.friendly_name ?? `Entity ${A + 1}`
        ]
      ]))
    } : {},
    ...e.upstreamId === "custom_card_weather_metrics" ? {
      entity: s(["weather"], []) ?? v,
      temperature_entity: B,
      date_entity: te,
      entities: Y.map(([f]) => f),
      ulm_custom_card_weather_metrics: s(["weather"], []) ?? v,
      ulm_custom_card_weather_metrics_temperature_outside: B,
      ulm_custom_card_weather_metrics_date: te,
      ...Object.fromEntries(Y.flatMap(([f, A], H) => [
        [`ulm_custom_card_weather_metrics_entity_${H + 1}`, f],
        [`ulm_custom_card_weather_metrics_name_${H + 1}`, A]
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
      console_platform: C === "generic" ? "auto" : C,
      console_show_artwork: !0,
      console_show_controls: !0,
      ...pt(t, v)
    } : {},
    ...e.upstreamId === "custom_card_entity_carousel" ? {
      carousel_loop: !0,
      carousel_show_labels: !0,
      carousel_visible_items: 7,
      carousel_initial_index: 0,
      carousel_items: X(o, 7).map((f) => ({
        entity: f,
        name: t?.states[f]?.attributes.friendly_name,
        icon: t?.states[f]?.attributes.icon,
        color: "primary",
        tap_action: { action: "more-info" },
        hold_action: { action: "none" }
      }))
    } : {}
  };
}, cn = "1.4.0";
for (const e of Ye)
  if (!customElements.get(e.tag)) {
    if (e.upstreamId === "mini_graph_card") {
      customElements.define(e.tag, le);
      continue;
    }
    const t = e;
    class a extends pe {
      constructor() {
        super(...arguments), this.descriptor = t;
      }
      static getStubConfig(r, n = [], i = []) {
        return Pa(t, r, n, i);
      }
    }
    customElements.define(e.tag, a);
  }
for (const e of dt) {
  if (customElements.get(e.tag)) continue;
  const t = Xe.find((n) => n.upstreamId === e.targetId);
  if (!t) throw new Error(`Missing alias target ${e.targetId}.`);
  const a = t, o = e.variant;
  class r extends pe {
    constructor() {
      super(...arguments), this.descriptor = a;
    }
    static getStubConfig(i, l = [], s = []) {
      const d = Pa(a, i, l, s);
      return o === "divider-title" ? {
        ...d,
        type: `custom:${e.tag}`,
        entity: void 0,
        variant: o,
        name: "Title",
        navigation_path: "",
        tap_action: { action: "none" }
      } : o === "divider-subtitle" ? {
        ...d,
        type: `custom:${e.tag}`,
        entity: void 0,
        variant: o,
        name: "Subtitle",
        tap_action: { action: "none" }
      } : {
        ...d,
        type: `custom:${e.tag}`,
        variant: o,
        show_forecast: e.tag === "mushroom-addition-card-weather-ulm" ? !1 : d.show_forecast
      };
    }
    setConfig(i) {
      super.setConfig({ ...i, variant: i.variant ?? o });
    }
  }
  customElements.define(e.tag, r);
}
window.customCards = window.customCards || [];
const dn = new Set(window.customCards.map((e) => e.type));
for (const e of Ye)
  dn.has(e.tag) || window.customCards.push({
    type: e.tag,
    name: `Mushroom Addition: ${e.name}`,
    description: e.description,
    preview: !0,
    documentationURL: "https://github.com/snfx-johaver/mushroom-cards-addition"
  });
console.info(
  `%c MUSHROOM-CARDS-ADDITION %c ${cn} · ${Ye.length} components `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;"
);
export {
  Ye as CATALOG
};
//# sourceMappingURL=mushroom-cards-addition.js.map
