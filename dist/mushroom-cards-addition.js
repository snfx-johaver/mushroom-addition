const ot = globalThis, xt = ot.ShadowRoot && (ot.ShadyCSS === void 0 || ot.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, St = /* @__PURE__ */ Symbol(), Gt = /* @__PURE__ */ new WeakMap();
let $a = class {
  constructor(t, a, o) {
    if (this._$cssResult$ = !0, o !== St) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = a;
  }
  get styleSheet() {
    let t = this.o;
    const a = this.t;
    if (xt && t === void 0) {
      const o = a !== void 0 && a.length === 1;
      o && (t = Gt.get(a)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && Gt.set(a, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const io = (e) => new $a(typeof e == "string" ? e : e + "", void 0, St), lt = (e, ...t) => {
  const a = e.length === 1 ? e[0] : t.reduce((o, r, n) => o + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new $a(a, e, St);
}, so = (e, t) => {
  if (xt) e.adoptedStyleSheets = t.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of t) {
    const o = document.createElement("style"), r = ot.litNonce;
    r !== void 0 && o.setAttribute("nonce", r), o.textContent = a.cssText, e.appendChild(o);
  }
}, Wt = xt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let a = "";
  for (const o of t.cssRules) a += o.cssText;
  return io(a);
})(e) : e;
const { is: lo, defineProperty: co, getOwnPropertyDescriptor: uo, getOwnPropertyNames: _o, getOwnPropertySymbols: mo, getPrototypeOf: po } = Object, ct = globalThis, Rt = ct.trustedTypes, ho = Rt ? Rt.emptyScript : "", go = ct.reactiveElementPolyfillSupport, We = (e, t) => e, nt = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ho : null;
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
} }, kt = (e, t) => !lo(e, t), Ut = { attribute: !0, type: String, converter: nt, reflect: !1, useDefault: !1, hasChanged: kt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), ct.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let Ee = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, a = Ut) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(t, a), !a.noAccessor) {
      const o = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(t, o, a);
      r !== void 0 && co(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, a, o) {
    const { get: r, set: n } = uo(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? Ut;
  }
  static _$Ei() {
    if (this.hasOwnProperty(We("elementProperties"))) return;
    const t = po(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(We("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(We("properties"))) {
      const a = this.properties, o = [..._o(a), ...mo(a)];
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
      for (const r of o) a.unshift(Wt(r));
    } else t !== void 0 && a.push(Wt(t));
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
    return so(t, this.constructor.elementStyles), t;
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
      const n = (o.converter?.toAttribute !== void 0 ? o.converter : nt).toAttribute(a, o.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, a) {
    const o = this.constructor, r = o._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = o.getPropertyOptions(r), i = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : nt;
      this._$Em = r;
      const l = i.fromAttribute(a, n.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, a, o, r = !1, n) {
    if (t !== void 0) {
      const i = this.constructor;
      if (r === !1 && (n = this[t]), o ??= i.getPropertyOptions(t), !((o.hasChanged ?? kt)(n, a) || o.useDefault && o.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(i._$Eu(t, o)))) return;
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
Ee.elementStyles = [], Ee.shadowRootOptions = { mode: "open" }, Ee[We("elementProperties")] = /* @__PURE__ */ new Map(), Ee[We("finalized")] = /* @__PURE__ */ new Map(), go?.({ ReactiveElement: Ee }), (ct.reactiveElementVersions ??= []).push("2.1.2");
const Mt = globalThis, qt = (e) => e, it = Mt.trustedTypes, Kt = it ? it.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, xa = "$lit$", fe = `lit$${Math.random().toFixed(9).slice(2)}$`, Sa = "?" + fe, yo = `<${Sa}>`, Me = document, Ue = () => Me.createComment(""), qe = (e) => e === null || typeof e != "object" && typeof e != "function", At = Array.isArray, bo = (e) => At(e) || typeof e?.[Symbol.iterator] == "function", ht = `[ 	
\f\r]`, Be = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Yt = /-->/g, Xt = />/g, $e = RegExp(`>|${ht}(?:([^\\s"'>=/]+)(${ht}*=${ht}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Jt = /'/g, Zt = /"/g, ka = /^(?:script|style|textarea|title)$/i, Ma = (e) => (t, ...a) => ({ _$litType$: e, strings: t, values: a }), d = Ma(1), U = Ma(2), Oe = /* @__PURE__ */ Symbol.for("lit-noChange"), p = /* @__PURE__ */ Symbol.for("lit-nothing"), Qt = /* @__PURE__ */ new WeakMap(), ke = Me.createTreeWalker(Me, 129);
function Aa(e, t) {
  if (!At(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Kt !== void 0 ? Kt.createHTML(t) : t;
}
const fo = (e, t) => {
  const a = e.length - 1, o = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", i = Be;
  for (let l = 0; l < a; l++) {
    const s = e[l];
    let c, _, g = -1, m = 0;
    for (; m < s.length && (i.lastIndex = m, _ = i.exec(s), _ !== null); ) m = i.lastIndex, i === Be ? _[1] === "!--" ? i = Yt : _[1] !== void 0 ? i = Xt : _[2] !== void 0 ? (ka.test(_[2]) && (r = RegExp("</" + _[2], "g")), i = $e) : _[3] !== void 0 && (i = $e) : i === $e ? _[0] === ">" ? (i = r ?? Be, g = -1) : _[1] === void 0 ? g = -2 : (g = i.lastIndex - _[2].length, c = _[1], i = _[3] === void 0 ? $e : _[3] === '"' ? Zt : Jt) : i === Zt || i === Jt ? i = $e : i === Yt || i === Xt ? i = Be : (i = $e, r = void 0);
    const u = i === $e && e[l + 1].startsWith("/>") ? " " : "";
    n += i === Be ? s + yo : g >= 0 ? (o.push(c), s.slice(0, g) + xa + s.slice(g) + fe + u) : s + fe + (g === -2 ? l : u);
  }
  return [Aa(e, n + (e[a] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), o];
};
class Ke {
  constructor({ strings: t, _$litType$: a }, o) {
    let r;
    this.parts = [];
    let n = 0, i = 0;
    const l = t.length - 1, s = this.parts, [c, _] = fo(t, a);
    if (this.el = Ke.createElement(c, o), ke.currentNode = this.el.content, a === 2 || a === 3) {
      const g = this.el.content.firstChild;
      g.replaceWith(...g.childNodes);
    }
    for (; (r = ke.nextNode()) !== null && s.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const g of r.getAttributeNames()) if (g.endsWith(xa)) {
          const m = _[i++], u = r.getAttribute(g).split(fe), y = /([.?@])?(.*)/.exec(m);
          s.push({ type: 1, index: n, name: y[2], strings: u, ctor: y[1] === "." ? wo : y[1] === "?" ? $o : y[1] === "@" ? xo : dt }), r.removeAttribute(g);
        } else g.startsWith(fe) && (s.push({ type: 6, index: n }), r.removeAttribute(g));
        if (ka.test(r.tagName)) {
          const g = r.textContent.split(fe), m = g.length - 1;
          if (m > 0) {
            r.textContent = it ? it.emptyScript : "";
            for (let u = 0; u < m; u++) r.append(g[u], Ue()), ke.nextNode(), s.push({ type: 2, index: ++n });
            r.append(g[m], Ue());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Sa) s.push({ type: 2, index: n });
      else {
        let g = -1;
        for (; (g = r.data.indexOf(fe, g + 1)) !== -1; ) s.push({ type: 7, index: n }), g += fe.length - 1;
      }
      n++;
    }
  }
  static createElement(t, a) {
    const o = Me.createElement("template");
    return o.innerHTML = t, o;
  }
}
function Ne(e, t, a = e, o) {
  if (t === Oe) return t;
  let r = o !== void 0 ? a._$Co?.[o] : a._$Cl;
  const n = qe(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, a, o)), o !== void 0 ? (a._$Co ??= [])[o] = r : a._$Cl = r), r !== void 0 && (t = Ne(e, r._$AS(e, t.values), r, o)), t;
}
class vo {
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
    const { el: { content: a }, parts: o } = this._$AD, r = (t?.creationScope ?? Me).importNode(a, !0);
    ke.currentNode = r;
    let n = ke.nextNode(), i = 0, l = 0, s = o[0];
    for (; s !== void 0; ) {
      if (i === s.index) {
        let c;
        s.type === 2 ? c = new Xe(n, n.nextSibling, this, t) : s.type === 1 ? c = new s.ctor(n, s.name, s.strings, this, t) : s.type === 6 && (c = new So(n, this, t)), this._$AV.push(c), s = o[++l];
      }
      i !== s?.index && (n = ke.nextNode(), i++);
    }
    return ke.currentNode = Me, r;
  }
  p(t) {
    let a = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, a), a += o.strings.length - 2) : o._$AI(t[a])), a++;
  }
}
class Xe {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, a, o, r) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = a, this._$AM = o, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = Ne(this, t, a), qe(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== Oe && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : bo(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && qe(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Me.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: a, _$litType$: o } = t, r = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = Ke.createElement(Aa(o.h, o.h[0]), this.options)), o);
    if (this._$AH?._$AD === r) this._$AH.p(a);
    else {
      const n = new vo(r, this), i = n.u(this.options);
      n.p(a), this.T(i), this._$AH = n;
    }
  }
  _$AC(t) {
    let a = Qt.get(t.strings);
    return a === void 0 && Qt.set(t.strings, a = new Ke(t)), a;
  }
  k(t) {
    At(this._$AH) || (this._$AH = [], this._$AR());
    const a = this._$AH;
    let o, r = 0;
    for (const n of t) r === a.length ? a.push(o = new Xe(this.O(Ue()), this.O(Ue()), this, this.options)) : o = a[r], o._$AI(n), r++;
    r < a.length && (this._$AR(o && o._$AB.nextSibling, r), a.length = r);
  }
  _$AR(t = this._$AA.nextSibling, a) {
    for (this._$AP?.(!1, !0, a); t !== this._$AB; ) {
      const o = qt(t).nextSibling;
      qt(t).remove(), t = o;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class dt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, a, o, r, n) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = a, this._$AM = r, this.options = n, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = p;
  }
  _$AI(t, a = this, o, r) {
    const n = this.strings;
    let i = !1;
    if (n === void 0) t = Ne(this, t, a, 0), i = !qe(t) || t !== this._$AH && t !== Oe, i && (this._$AH = t);
    else {
      const l = t;
      let s, c;
      for (t = n[0], s = 0; s < n.length - 1; s++) c = Ne(this, l[o + s], a, s), c === Oe && (c = this._$AH[s]), i ||= !qe(c) || c !== this._$AH[s], c === p ? t = p : t !== p && (t += (c ?? "") + n[s + 1]), this._$AH[s] = c;
    }
    i && !r && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class wo extends dt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class $o extends dt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class xo extends dt {
  constructor(t, a, o, r, n) {
    super(t, a, o, r, n), this.type = 5;
  }
  _$AI(t, a = this) {
    if ((t = Ne(this, t, a, 0) ?? p) === Oe) return;
    const o = this._$AH, r = t === p && o !== p || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, n = t !== p && (o === p || r);
    r && this.element.removeEventListener(this.name, this, o), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class So {
  constructor(t, a, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Ne(this, t);
  }
}
const ko = Mt.litHtmlPolyfillSupport;
ko?.(Ke, Xe), (Mt.litHtmlVersions ??= []).push("3.3.3");
const Mo = (e, t, a) => {
  const o = a?.renderBefore ?? t;
  let r = o._$litPart$;
  if (r === void 0) {
    const n = a?.renderBefore ?? null;
    o._$litPart$ = r = new Xe(t.insertBefore(Ue(), n), n, void 0, a ?? {});
  }
  return r._$AI(e), r;
};
const It = globalThis;
let ve = class extends Ee {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Mo(a, this.renderRoot, this.renderOptions);
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
};
ve._$litElement$ = !0, ve.finalized = !0, It.litElementHydrateSupport?.({ LitElement: ve });
const Ao = It.litElementPolyfillSupport;
Ao?.({ LitElement: ve });
(It.litElementVersions ??= []).push("4.2.2");
const Ia = (e) => (t, a) => {
  a !== void 0 ? a.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Io = { attribute: !0, type: String, converter: nt, reflect: !1, hasChanged: kt }, Co = (e = Io, t, a) => {
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
  return (t, a) => typeof a == "object" ? Co(e, t, a) : ((o, r, n) => {
    const i = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, o), i ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, a);
}
function he(e) {
  return Ie({ ...e, state: !0, attribute: !1 });
}
const Po = [
  "battery",
  "media_player",
  "room",
  "scenes",
  "welcome_scenes"
], Eo = [
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
], ea = (e) => e.split("_").filter((t) => t.toLowerCase() !== "ulm").map((t) => ["nas", "mdi", "dwd", "vnc", "wifi", "http"].includes(t.toLowerCase()) ? t.toUpperCase() : `${t[0].toUpperCase()}${t.slice(1)}`).join(" "), zo = (e) => e === "custom_card_alarm_time" ? "alarm-time" : /alarm|alert|lock/.test(e) ? "security" : /navigate|back/.test(e) ? "navigation" : /battery/.test(e) ? "battery" : /power_outlet|more_power_outlet/.test(e) ? "control" : /energy|power|gauge|speedtest|graph|apex|myenedis/.test(e) ? "energy" : /weather|sun|pollen|moon/.test(e) ? "weather" : /scene/.test(e) ? "scene" : /person|tracker|tracer|presence|room|welcome/.test(e) ? "presence" : /media|playstation/.test(e) ? "media" : /thermostat|heat_pump|aircondition|temperature|simple_temp/.test(e) ? "climate" : /cover|door|garage/.test(e) ? "cover" : /vacuum/.test(e) ? "vacuum" : /light/.test(e) ? "light" : /fan|outlet|boolean|script|washer|water_heater|qubino/.test(e) ? "control" : /input_number|input_datetime/.test(e) ? "sensor" : /title|subtitle|clock|date/.test(e) ? "text" : /camera/.test(e) ? "camera" : /sensor|elapsed|update|printer|nas|tablet|flower|car|afval|waste|counter/.test(e) ? "sensor" : "entity", Do = {
  card_media_player: ["default", "controls", "artwork"],
  card_room: ["default", "with-sensors"],
  card_scenes: ["list", "welcome"]
}, To = (e, t) => e === "custom_card_alarm_time" ? ["input_boolean"] : /alarm/.test(e) ? ["alarm_control_panel"] : /lock/.test(e) ? ["lock"] : /power_outlet|more_power_outlet/.test(e) ? ["switch", "light"] : e.includes("binary_sensor") ? ["binary_sensor"] : e.includes("battery") ? ["sensor"] : e.includes("input_boolean") ? ["input_boolean"] : e.includes("input_number") ? ["input_number", "counter", "select", "input_select"] : e.includes("input_datetime") ? ["input_datetime"] : e.includes("light") ? ["light"] : /media|playstation/.test(e) ? ["media_player", "sensor"] : /thermostat|heat_pump|aircondition/.test(e) ? ["climate"] : /scene/.test(e) ? ["scene"] : /script/.test(e) ? ["script"] : /vacuum/.test(e) ? ["vacuum"] : /weather/.test(e) ? ["weather"] : /person/.test(e) ? ["person", "device_tracker"] : /cover|door|garage/.test(e) ? ["cover", "binary_sensor"] : /fan/.test(e) ? ["fan"] : /camera/.test(e) ? ["camera"] : /lock/.test(e) ? ["lock"] : /update/.test(e) ? ["update"] : t === "battery" || t === "energy" || t === "sensor" || t === "weather" ? ["sensor"] : t === "control" ? /fan/.test(e) ? ["fan"] : /script/.test(e) ? ["script"] : /washer/.test(e) ? ["switch", "sensor"] : /water_heater/.test(e) ? ["water_heater"] : ["switch", "input_boolean", "light"] : t === "presence" ? ["person", "device_tracker"] : ["sensor", "switch"], bt = (e, t) => {
  const a = e.replace(/^custom_(card|chip)_/, "").replace(/^(card|chip)_/, ""), o = e.replaceAll("_", "-").toLowerCase(), r = e === "custom_card_playstation" ? "mushroom-addition-custom-card-game-console" : o.startsWith("custom-card-") ? `mushroom-addition-${o}` : `mushroom-addition-card-${o.replace(/^card-/, "")}`, n = zo(e), i = e === "custom_card_playstation", l = {
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
    name: i ? "Game Console Card" : e === "custom_card_nas_metrics" ? "NAS Card" : `${l[e] ?? ea(a)} Card`,
    description: i ? "Mushroom-style Xbox, PlayStation, and Nintendo profile, activity, artwork, and control card." : e === "custom_card_nas_metrics" ? "Mushroom-style NAS status and utilization card." : s[e] ?? `Mushroom-style ${ea(a).toLowerCase()} card.`,
    variants: Do[e],
    variantLabels: void 0,
    preferredDomains: To(e, n)
  };
}, Ca = [
  ...Po.map((e) => {
    const t = {
      scenes: "reference_catalog/cards/card_scenes_welcome.yaml"
    };
    return bt(
      `card_${e}`,
      t[e] ?? `reference_catalog/cards/card_${e}.yaml`
    );
  }),
  ...Eo.map((e) => bt(
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
], Oo = [
  bt("custom_card_entity_carousel", "src/entity-carousel.ts"),
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
], Pa = [
  {
    canonical: "card_scenes",
    sources: { card_scenes: "welcome-pills", custom_card_scenes: "scene-grid" },
    variants: ["welcome-pills", "scene-grid"],
    variantLabels: { "welcome-pills": "Welcome scene pills", "scene-grid": "Scene button grid" },
    name: "Scenes Card"
  }
], Ve = /* @__PURE__ */ new Map();
for (const e of Pa)
  for (const t of Object.keys(e.sources)) Ve.set(t, e);
const Ea = new Set(Pa.map((e) => e.canonical)), ut = [
  ...Ca.filter((e) => !Ve.has(e.upstreamId) || Ea.has(e.upstreamId)).map((e) => {
    const t = Ve.get(e.upstreamId);
    return t ? {
      ...e,
      name: t.name ?? e.name,
      description: t.description ?? e.description,
      variants: t.variants,
      variantLabels: t.variantLabels,
      sourceIds: Object.keys(t.sources)
    } : { ...e, sourceIds: [e.upstreamId] };
  }),
  ...Oo.map((e) => ({ ...e, sourceIds: [e.upstreamId] }))
], No = Ca.filter((e) => Ve.has(e.upstreamId) && !Ea.has(e.upstreamId)).map((e) => {
  const t = Ve.get(e.upstreamId), a = ut.find((o) => o.upstreamId === t.canonical);
  return {
    upstreamId: e.upstreamId,
    tag: e.tag,
    targetId: a.upstreamId,
    targetTag: a.tag,
    variant: t.sources[e.upstreamId]
  };
}), Ct = [
  ...No,
  {
    upstreamId: "custom_card_playstation",
    tag: "mushroom-addition-custom-card-playstation",
    targetId: "custom_card_playstation",
    targetTag: "mushroom-addition-custom-card-game-console"
  }
], _t = ut, Vo = (e) => _t.find((t) => t.tag === e) ?? (() => {
  const t = Ct.find((a) => a.tag === e);
  return t ? ut.find((a) => a.tag === t.targetTag) : void 0;
})(), ta = (e) => Ve.get(e)?.sources[e], ft = [
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
], za = (e, t, a = e.enabledByDefault) => ({
  preset: e.preset,
  enabled: a,
  entity: t,
  label: e.label,
  icon: e.icon,
  color: e.color
}), Lo = () => ft.map((e) => za(e)), Se = (e) => {
  if (e.waste_streams?.length) return e.waste_streams.map((o) => ({ ...o }));
  const t = e.type.includes("custom-card-trash"), a = ft.some((o) => o.legacyKey && typeof e[o.legacyKey] == "string");
  return !t && !a ? [] : ft.map((o, r) => {
    const i = (o.legacyKey && typeof e[o.legacyKey] == "string" ? e[o.legacyKey] : void 0) ?? (r === 0 ? e.entity : void 0);
    return za(o, i, i ? !0 : o.enabledByDefault);
  });
}, Fo = (e) => {
  const t = e.type.includes("custom-card-trash"), a = e.today_entity ?? (typeof e.ulm_card_ophaling_vandaag == "string" ? e.ulm_card_ophaling_vandaag : void 0), o = e.tomorrow_entity ?? (typeof e.ulm_card_ophaling_morgen == "string" ? e.ulm_card_ophaling_morgen : void 0);
  if (!t && !a && !o) return e;
  const r = e.waste_streams?.length ? e.waste_streams : Se(e);
  return {
    ...e,
    waste_streams: r.length ? r : e.waste_streams,
    today_entity: a,
    tomorrow_entity: o,
    show_today: e.show_today ?? !!a,
    show_tomorrow: e.show_tomorrow ?? !!o
  };
}, ue = /* @__PURE__ */ new Set([
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
]), C = (e) => {
  if (!e) return "Entity unavailable";
  const t = e.attributes.unit_of_measurement;
  return t ? `${e.state} ${String(t)}` : e.state.replaceAll("_", " ");
}, aa = (e) => {
  if (typeof e == "string") return e;
  const t = Array.isArray(e) ? e : [e];
  return t.every((a) => a.type === "text") ? t.map((a) => a.text ?? "").join(" ") : void 0;
}, se = (e, t, a) => {
  const o = e.name !== void 0 && typeof e.name != "string";
  return o && t && a?.formatEntityName ? a.formatEntityName(t, e.name) : o ? aa(e.name) || t?.attributes.friendly_name || e.entity || "" : e.name_mode === "none" ? "" : e.name_mode === "entity" ? t?.attributes.friendly_name || e.entity || "" : e.name && t && a?.formatEntityName ? a.formatEntityName(t, e.name) : (e.name ? aa(e.name) : void 0) || t?.attributes.friendly_name || e.entity || "";
}, me = (e, t, a) => {
  e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    composed: !0,
    detail: a
  }));
}, Da = (e, t, a) => {
  me(e, "hass-action", { config: t, action: a });
}, Bo = (e) => {
  const t = Go(e), a = Ho(t), o = String(t.type), r = o.includes("card-title"), n = o.includes("card-welcome-scenes"), i = o.includes("card-weather"), l = o.includes("card-weather-ulm") || t.variant === "native", s = o.includes("custom-card-sun") || o.includes("custom-card-thermostat-controls") ? { action: "none" } : void 0, c = String(a.type).includes("custom-card-qubino") ? a.qubino_more_info_entity ?? a.entity : void 0, _ = o.endsWith("custom-card-pollen"), g = [
    a.download_entity,
    a.upload_entity,
    a.ping_entity
  ].filter((f) => typeof f == "string"), m = String(a.type).includes("speedtest-gauges"), u = a.variant === "divider-title", y = a.variant === "divider-subtitle", x = m ? {
    action: "perform-action",
    perform_action: "homeassistant.update_entity",
    target: { entity_id: g }
  } : y || u && !a.navigation_path ? { action: "none" } : _ ? { action: "none" } : c ? { action: "more-info", entity: c } : a.navigation_path ? { action: "navigate", navigation_path: a.navigation_path } : s ?? { action: r || n ? "none" : a.entity ? "more-info" : "none" }, b = String(e.type).includes("card-room") && a.input_select_entity && a.input_select_option ? {
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
    icon_type: a.icon_type ?? (t.use_entity_picture ? "entity-picture" : t.show_icon === !1 ? "none" : /custom-card-(game-console|playstation)$/.test(o) ? "entity-picture" : "icon"),
    layout: a.layout ?? "default",
    fill_container: a.fill_container ?? !1,
    primary_info: a.primary_info,
    secondary_info: a.secondary_info,
    tap_action: a.tap_action ?? x,
    show_controls: a.show_controls ?? (o.includes("card-vacuum") ? !0 : void 0),
    show_forecast: a.show_forecast ?? (i ? !l : void 0),
    hold_action: a.hold_action ?? (String(a.type).includes("water-heater") && a.entity ? { action: "more-info" } : void 0),
    double_tap_action: a.double_tap_action ?? b
  };
}, Pe = (e, t) => Object.entries(e).find(([a, o]) => t.test(a) && o !== void 0)?.[1], Ho = (e) => {
  const t = String(e.type).includes("custom-card-roomview"), a = Pe(e, t ? /^(?!climate_).*_name$/ : /_name$/), o = Pe(e, t ? /^(?!climate_).*_icon$/ : /_icon$/), r = Pe(e, /_color$/), n = Pe(e, /_enable_(controls|buttons)$/), i = Pe(e, /_enable_slider$/), l = Pe(e, /_enable_horizontal$/);
  return {
    ...e,
    name: e.name ?? (typeof a == "string" ? a : void 0),
    icon: e.icon ?? (typeof o == "string" ? o : void 0),
    icon_color: e.icon_color ?? (typeof r == "string" ? r : void 0),
    navigation_path: e.navigation_path,
    show_controls: e.show_controls ?? (typeof n == "boolean" ? n : typeof i == "boolean" ? i : void 0),
    layout: e.layout ?? (l === !0 ? "horizontal" : void 0)
  };
}, jo = [
  "ulm_card_media_player_entity",
  "ulm_card_input_number_entity",
  "ulm_custom_card_weather_metrics"
], Go = (e) => {
  const t = Fo(e), a = t.primary_entity || jo.map((n) => t[n]).find((n) => typeof n == "string"), o = (n) => {
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
      const c = s, _ = o(c);
      if (_)
        return {
          entity: _,
          name: typeof c.name == "string" ? c.name : void 0,
          icon: typeof c.icon == "string" ? c.icon : void 0,
          color: typeof c.color == "string" ? c.color : void 0,
          state: typeof c.state == "string" ? c.state : void 0,
          navigation_path: typeof c.navigation_path == "string" ? c.navigation_path : typeof c.nav_path == "string" ? c.nav_path : void 0,
          service_data: c.service_data && typeof c.service_data == "object" ? c.service_data : void 0
        };
    }).filter((i) => i !== void 0);
    n.length && (r.scene_items = n);
  }
  if (String(e.type).includes("weather-metrics") && (r.entity ??= o(e.ulm_custom_card_weather_metrics), r.temperature_entity ??= o(e.ulm_custom_card_weather_metrics_temperature_outside), r.date_entity ??= o(e.ulm_custom_card_weather_metrics_date), r.entities ??= [1, 2, 3, 4].map((n) => o(e[`ulm_custom_card_weather_metrics_entity_${n}`])).filter((n) => n !== void 0)), String(e.type).includes("custom-card-washer") && (r.entity ??= o(e.ulm_custom_card_washer_machine_state) ?? o(e.ulm_custom_card_washer_power), r.program_stage_entity ??= o(e.ulm_custom_card_washer_job_state) ?? r.entity, r.washer_power_entity ??= r.power_entity ?? o(e.ulm_custom_card_washer_power), r.power_entity ??= r.washer_power_entity), String(e.type).includes("custom-card-thermostat-controls") && (r.entity ??= o(e.entity), r.variant ??= "buttons"), String(e.type).includes("media-player-sonos") && (r.entity ??= o(e.ulm_card_media_player_with_controls_entity)), String(e.type).includes("printer") && (r.black_entity ??= o(e.ulm_card_printer_black_name), r.yellow_entity ??= o(e.ulm_card_printer_yellow_name), r.magenta_entity ??= o(e.ulm_card_printer_magenta_name), r.cyan_entity ??= o(e.ulm_card_printer_cyan_name)), String(e.type).endsWith("custom-card-pollen") && (r.trees_entity ??= o(e.custom_card_pollen_tree), r.grass_entity ??= o(e.custom_card_pollen_grass), r.weeds_entity ??= o(e.custom_card_pollen_weed)), String(e.type).includes("speedtest-gauges") && (r.download_entity ??= o(e.ulm_custom_card_speedtest_download_speed_entity) ?? r.entity, r.upload_entity ??= o(e.ulm_custom_card_speedtest_upload_speed_entity), r.ping_entity ??= o(e.ulm_custom_card_speedtest_ping_entity), r.entity = o(r.download_entity)), String(e.type).includes("custom-card-scenes") || String(e.type).includes("card-scenes") && e.variant === "scene-grid") {
    const n = Array.from({ length: 5 }, (i, l) => {
      const s = e[`entity_${l + 1}`];
      if (typeof s == "string") return { entity: s };
      if (!s || typeof s != "object" || !("entity_id" in s) || typeof s.entity_id != "string")
        return;
      const c = s;
      return {
        entity: c.entity_id,
        icon: typeof c.icon == "string" ? c.icon : void 0,
        color: typeof c.icon_color == "string" ? c.icon_color : void 0,
        name: typeof c.name == "string" ? c.name : void 0
      };
    }).filter((i) => !!i);
    !r.scene_items?.length && n.length && (r.scene_items = n);
  }
  return String(e.type).includes("plant") && (r.entity ??= o(e.ulm_card_flower_entity), r.ulm_card_flower_entity ??= r.entity), r;
}, de = {
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
}, Ta = [
  { configKey: "crossfade_entity", domain: "switch", suffix: "crossfade", label: "Crossfade", icon: "mdi:swap-horizontal" },
  { configKey: "night_sound_entity", domain: "switch", suffix: "night_sound", label: "Night sound", icon: "mdi:weather-night" },
  { configKey: "speech_enhancement_entity", domain: "switch", suffix: "speech_enhancement", label: "Speech enhancement", icon: "mdi:ear-hearing" },
  { configKey: "subwoofer_entity", domain: "switch", suffix: "subwoofer_enabled", label: "Subwoofer", icon: "mdi:speaker-wireless" },
  { configKey: "surrounds_entity", domain: "switch", suffix: "surround_enabled", label: "Surrounds", icon: "mdi:surround-sound" },
  { configKey: "loudness_entity", domain: "switch", suffix: "loudness", label: "Loudness", icon: "mdi:bullhorn" },
  { configKey: "surround_full_entity", domain: "switch", suffix: "surround_music_full_volume", label: "Surround full", icon: "mdi:music-note-plus" }
], Oa = [
  { configKey: "audio_delay_entity", domain: "number", suffix: "audio_delay", label: "Audio delay", icon: "mdi:tune-variant" },
  { configKey: "balance_entity", domain: "number", suffix: "balance", label: "Balance", icon: "mdi:tune-variant" },
  { configKey: "bass_entity", domain: "number", suffix: "bass", label: "Bass", icon: "mdi:tune-variant" },
  { configKey: "treble_entity", domain: "number", suffix: "treble", label: "Treble", icon: "mdi:tune-variant" },
  { configKey: "sub_gain_entity", domain: "number", suffix: "sub_gain", label: "Sub gain", icon: "mdi:tune-variant" },
  { configKey: "surround_level_entity", domain: "number", suffix: "surround_level", label: "Surround level", icon: "mdi:tune-variant" },
  { configKey: "music_surround_level_entity", domain: "number", suffix: "music_surround_level", label: "Surround level music", icon: "mdi:tune-variant" }
], Pt = [...Ta, ...Oa], Et = (e) => e.split(".", 2)[1] ?? e, oa = (e) => Et(e).replace(/_\d+$/, ""), Na = (e, t) => {
  if (!e.startsWith(`${t.domain}.`)) return !1;
  const a = Et(e);
  return t.suffix === "surround_level" && a.endsWith("_music_surround_level") ? !1 : a === t.suffix || a.endsWith(`_${t.suffix}`);
}, ra = (e) => Pt.filter((t) => e.some((a) => Na(a, t))).length, zt = (e, t, a) => {
  if (!e || !t) return {};
  const o = Object.keys(e.states), r = e.entities ?? {}, n = oa(t), i = [.../* @__PURE__ */ new Set([t, ...o.filter((m) => m.startsWith("media_player.") && oa(m) === n)])], c = [...new Set(i.map((m) => r[m]?.device_id).filter((m) => typeof m == "string" && m.length > 0))].map((m) => o.filter((u) => r[u]?.device_id === m)).sort((m, u) => ra(u) - ra(m))[0] ?? [], _ = o.filter((m) => {
    const u = m.split(".", 1)[0], y = Et(m);
    return ["switch", "number"].includes(u) && (y === n || y.startsWith(`${n}_`));
  }), g = [.../* @__PURE__ */ new Set([...c, ..._])];
  return Object.fromEntries(Pt.flatMap((m) => {
    const u = a?.[m.configKey];
    if (typeof u == "string" && u.length > 0) return [[m.configKey, u]];
    const y = g.find((x) => Na(x, m));
    return y ? [[m.configKey, y]] : [];
  }));
}, na = (e, t) => Object.keys(zt(e, t)).length, Va = [
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
], vt = (e) => e.split(".", 2)[1] ?? e, La = (e) => e.toLowerCase().replace(/[^a-z0-9]+/g, "_"), Wo = (e, t, a) => {
  const o = t.split(".", 1)[0];
  if (!a.domains.includes(o)) return !1;
  const r = e?.states[t], n = La([
    vt(t),
    r?.attributes.friendly_name
  ].filter(Boolean).join(" "));
  return a.terms.some((i) => n.includes(i));
}, Dt = (e, t, a) => {
  if (!e || !t) return {};
  const o = e.entities?.[t]?.device_id, n = vt(t).split(/_(?:console|status|online|power)$/)[0], i = Object.keys(e.states).filter((l) => {
    const s = o && e.entities?.[l]?.device_id === o, c = vt(l);
    return s || c === n || c.startsWith(`${n}_`);
  });
  return Object.fromEntries(Va.flatMap((l) => {
    const s = a?.[l.configKey];
    if (typeof s == "string" && s.length > 0)
      return [[l.configKey, s]];
    const c = i.find((_) => Wo(e, _, l));
    return c ? [[l.configKey, c]] : [];
  }));
}, Fa = (e, t, a) => {
  const o = a?.console_platform;
  if (o === "xbox" || o === "playstation" || o === "nintendo") return o;
  const r = t ? e?.states[t] : void 0, n = La([
    t,
    r?.attributes.friendly_name,
    t ? e?.entities?.[t]?.platform : void 0
  ].filter(Boolean).join(" "));
  return n.includes("xbox") || n.includes("gamer") ? "xbox" : n.includes("playstation") || /(?:^|_)ps[345](?:_|$)/.test(n) ? "playstation" : n.includes("nintendo") || n.includes("switch") ? "nintendo" : "generic";
}, Ro = (e) => {
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
}, ia = {
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
}, sa = (e, t) => {
  const a = e?.language?.split("-")[0] ?? "en";
  return ia[a]?.[t] ?? ia.en[t] ?? t.replace(/^ulm_(?:custom_)?card_/, "").replace(/^(?:custom_)?card_/, "").replace(/^ulm_/, "").replaceAll("_", " ").replace(/\b\w/g, (o) => o.toUpperCase());
}, Uo = {
  entity: "The Home Assistant entity shown and controlled by this card.",
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
}, qo = (e) => Uo[e], Ko = [
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
], Tt = new Map(Ko.map((e) => [e.upstreamId, e])), Yo = (e) => /popup|browser_mod/i.test(e), Xo = {
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
}, Ba = /* @__PURE__ */ new Set([
  "ulm_card_battery_name",
  "ulm_card_flower_name",
  "ulm_card_input_boolean_name",
  "ulm_card_input_datetime_name",
  "ulm_card_input_number_name",
  "ulm_card_media_player_with_controls_name",
  "ulm_card_printer_name",
  "ulm_custom_card_metrics_entitites_name"
]), Jo = (e, t) => Ba.has(t) || (Xo[e.upstreamId]?.includes(t) ?? !1), Zo = {
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
}, Qo = {
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
}, Ha = (e, t) => !Yo(t) && ([e.upstreamId, ...e.sourceIds ?? []].some((a) => Qo[a]?.includes(t) === !0) || Zo[e.family]?.includes(t) === !0), mt = [
  { key: "temperature", label: "Temperature", icon: "mdi:thermometer", min: -10, max: 50 },
  { key: "humidity", label: "Humidity", icon: "mdi:water-percent", min: 0, max: 100 },
  { key: "moisture", label: "Moisture", icon: "mdi:water", min: 0, max: 100 },
  { key: "conductivity", label: "Conductivity", icon: "mdi:flash", min: 0, max: 3e3 },
  { key: "illuminance", label: "Illuminance", icon: "mdi:white-balance-sunny", min: 0, max: 1e5 },
  { key: "dli", label: "Daily light integral", icon: "mdi:leaf", min: 0, max: 30 }
], er = new Set(mt.map(({ key: e }) => e)), ja = (e) => {
  const t = e?.ulm_card_flower_show_bars;
  return Array.isArray(t) ? [...new Set(t)].filter((a) => typeof a == "string" && er.has(a)) : mt.map(({ key: a }) => a);
}, Ga = (e) => `${e}_entity`, h = (e, t = "entity") => ({
  name: t,
  selector: { entity: e?.length ? { domain: e } : {} }
}), D = (e) => ({ name: e, selector: { text: {} } }), la = (e) => ({ name: e, selector: { navigation: {} } }), P = (e) => ({ name: e, selector: { boolean: {} } }), z = (e, t = 1, a = 168, o) => ({
  name: e,
  selector: { number: { min: t, max: a, mode: "box", ...o === void 0 ? {} : { step: o } } }
}), gt = (e) => ({
  name: e,
  selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
}), _e = (e) => ({ name: e, selector: { ui_action: {} } }), K = (e, t) => ({
  name: e,
  selector: { select: { mode: "dropdown", options: t } }
}), tr = {
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
}, F = (e) => ({
  name: e,
  selector: { ui_color: { default_color: tr[e] } }
}), He = (e) => ({ ...e, presentation: !0 }), ar = (e) => ({
  type: "grid",
  name: "",
  schema: e,
  presentation: !0
}), or = /* @__PURE__ */ new Set([
  "ulm_card_battery_battery_level_danger",
  "ulm_card_battery_battery_level_warning"
]), rr = /* @__PURE__ */ new Set([
  "ulm_card_media_player_collapsible",
  "ulm_card_media_player_idle_off",
  "ulm_card_media_player_more_info",
  "ulm_card_media_player_power_button",
  "ulm_card_media_player_force_background_color"
]), nr = /* @__PURE__ */ new Set([
  "ulm_card_media_player_enable_volume_adjust"
]), ir = /* @__PURE__ */ new Set([
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
]), sr = {}, q = () => [
  He({
    name: "name",
    selector: { entity_name: {} },
    context: { entity: "entity" }
  }),
  He({
    name: "icon",
    selector: { icon: {} },
    context: { icon_entity: "entity" }
  }),
  He({
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
  He(P("multiline_secondary")),
  He(P("fill_container")),
  ar([
    K("primary_info", [
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" }
    ]),
    K("secondary_info", [
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" }
    ]),
    K("icon_type", [
      { value: "icon", label: "Icon" },
      { value: "entity-picture", label: "Entity picture" },
      { value: "none", label: "None" }
    ])
  ])
], lr = /* @__PURE__ */ new Set([
  "card_room",
  "card_welcome_scenes",
  "custom_card_welcome",
  "custom_card_tablet"
]), Wa = (e) => e.flatMap((t) => t.name === "icon" || t.name === "icon_type" ? [] : t.schema ? [{ ...t, schema: Wa(t.schema) }] : [t]), cr = (e) => {
  if (!e.some((i) => i.presentation)) return e;
  const t = e.filter((i) => i.presentation), a = /* @__PURE__ */ new Set(["name", "icon"]), o = e.filter((i) => !i.presentation && !a.has(i.name) && !Ba.has(i.name)), r = o.findIndex((i) => i.name === "entity");
  if (r < 0) return [...t, ...o];
  const [n] = o.splice(r, 1);
  return [n, ...t, ...o];
}, dr = (e) => {
  const t = { ...e };
  return delete t.presentation, t;
}, re = (e) => [
  h(e.preferredDomains),
  ...e.variants?.length ? [K("variant", e.variants.map((t) => ({
    value: t,
    label: e.variantLabels?.[t] ?? t.replaceAll("-", " ").replace(/\b\w/g, (a) => a.toUpperCase())
  })))] : [],
  ...q()
], ca = {
  weather: (e) => [
    ...re(e),
    h(["sensor"], "temperature_entity"),
    h(["sensor"], "humidity_entity"),
    P("show_forecast")
  ],
  climate: (e) => [...re(e), h(["sensor"], "humidity_entity"), P("show_controls")],
  light: (e) => [...re(e)],
  scene: (e) => [
    ...e.upstreamId === "card_welcome_scenes" ? [h(), ...q()] : re(e),
    ...e.upstreamId === "card_welcome_scenes" ? [
      h(["input_boolean"], "collapse_entity"),
      h(["weather"], "weather_entity"),
      la("settings_path"),
      P("collapsed")
    ] : []
  ],
  presence: (e, t) => [
    ...re(e),
    ...e.upstreamId === "card_room" ? [] : [
      ...t?.variant === "small" ? [] : [
        h(["sensor"], "battery_entity"),
        h(["sensor"], "eta_entity"),
        h(["sensor"], "address_entity")
      ]
    ]
  ],
  battery: (e) => [
    ...re(e),
    gt("battery_warning_threshold"),
    gt("battery_low_threshold"),
    gt("battery_critical_threshold"),
    F("battery_healthy_color"),
    F("battery_warning_color"),
    F("battery_low_color"),
    F("battery_critical_color")
  ],
  energy: (e) => [...re(e), h(["sensor"], "min_entity"), h(["sensor"], "max_entity"), P("show_graph")],
  sensor: (e) => [...re(e), P("show_graph")],
  media: (e) => [...re(e), P("show_controls")],
  cover: (e) => [...re(e), P("show_controls")],
  security: (e) => [...re(e)],
  navigation: (e) => [
    ...e.variants?.length ? [K("variant", e.variants.map((t) => ({
      value: t,
      label: e.variantLabels?.[t] ?? t
    })))] : [],
    ...q(),
    la("navigation_path")
  ],
  text: () => [...q(), D("secondary")],
  camera: (e) => [...re(e)],
  control: (e) => [
    ...re(e),
    .../power_outlet|more_power_outlet/.test(e.upstreamId) ? [h(["sensor"], "graph_entity"), P("show_graph")] : [],
    P("show_controls")
  ],
  "alarm-time": (e) => [...re(e), h(["input_datetime"], "datetime_entity"), P("show_controls")],
  door: (e) => [...re(e), h(["lock"], "lock_entity"), h(["sensor"], "battery_entity"), P("show_controls")],
  entity: (e) => [...re(e), D("secondary")]
}, Ra = (e, t) => {
  if (e.upstreamId === "mini_graph_card")
    return [
      h(["sensor", "binary_sensor", "input_number"]),
      ...q().filter((r) => r.name !== "layout" && r.name !== "multiline_secondary"),
      K("variant", [
        { value: "line", label: "Line graph" },
        { value: "bar", label: "Bar graph" }
      ]),
      K("aggregate_func", [
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
      K("group_by", [
        { value: "interval", label: "Dynamic interval" },
        { value: "hour", label: "Hour" },
        { value: "date", label: "Date" }
      ]),
      z("hours_to_show", 1, 8760),
      z("points_per_hour", 0.01, 60),
      z("update_interval", 1, 86400),
      P("cache"),
      z("height", 0, 1e3),
      z("line_width", 1, 20),
      z("bar_spacing", 0, 50),
      P("smoothing"),
      P("animate"),
      P("logarithmic"),
      z("value_factor", -12, 12),
      z("decimals", 0, 12),
      P("hour24"),
      z("font_size", 25, 300),
      z("font_size_header", 8, 48),
      K("align_header", [
        { value: "default", label: "Automatic" },
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ]),
      K("align_icon", [
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
        { value: "state", label: "Beside state" }
      ]),
      K("align_state", [
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
      K("color_thresholds_transition", [
        { value: "smooth", label: "Smooth gradient" },
        { value: "hard", label: "Hard color steps" }
      ]),
      P("group"),
      K("mini_graph_show_state", [
        { value: "current", label: "Current state" },
        { value: "last", label: "Last graph value" },
        { value: "hidden", label: "Hidden" }
      ]),
      K("mini_graph_show_fill", [
        { value: "solid", label: "Solid fill" },
        { value: "fade", label: "Faded fill" },
        { value: "hidden", label: "No fill" }
      ]),
      K("mini_graph_show_points", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" }
      ]),
      K("mini_graph_show_labels", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" }
      ]),
      K("mini_graph_show_labels_secondary", [
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
      h(["sensor"]),
      h(["sensor"], "grid_power_entity"),
      h(["sensor"], "grid_phase_1_entity"),
      h(["sensor"], "grid_phase_2_entity"),
      h(["sensor"], "grid_phase_3_entity"),
      h(["sensor"], "solar_power_entity"),
      h(["sensor"], "solar_forecast_entity"),
      h(["sensor"], "battery_level_entity"),
      h(["sensor"], "battery_power_entity"),
      h(["sensor"], "battery_1_level_entity"),
      h(["sensor"], "battery_1_power_entity"),
      h(["sensor"], "battery_2_level_entity"),
      h(["sensor"], "battery_2_power_entity"),
      h(["sensor"], "battery_3_level_entity"),
      h(["sensor"], "battery_3_power_entity"),
      h(["sensor"], "ev_charger_power_entity"),
      h(["sensor", "select", "input_select"], "energy_mode_entity"),
      h(["binary_sensor", "input_boolean", "switch"], "energy_auto_control_entity"),
      h(["sensor", "input_number"], "electricity_price_entity"),
      h(["sensor", "input_number"], "tariff_markup_entity"),
      h(["sensor", "input_number"], "tariff_vat_entity"),
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
      ...q()
    ] : e.upstreamId === "card_room" ? [
      h(),
      P("label_use_temperature"),
      P("label_use_brightness"),
      h(["input_select"], "input_select_entity"),
      D("input_select_option"),
      ...q()
    ] : e.upstreamId === "card_scenes" ? [
      h(),
      ...e.variants?.length ? [K("variant", e.variants.map((r) => ({
        value: r,
        label: e.variantLabels?.[r] ?? r
      })))] : [],
      P("scene_buttons_only"),
      ...q()
    ] : e.upstreamId === "custom_card_trash" ? [
      h(["sensor", "calendar"]),
      P("show_today"),
      h(["sensor"], "today_entity"),
      P("show_tomorrow"),
      h(["sensor"], "tomorrow_entity"),
      ...q()
    ] : e.upstreamId === "custom_card_entity_carousel" ? [
      h(),
      P("carousel_show_header"),
      ...q(),
      P("carousel_loop"),
      P("carousel_show_labels"),
      z("carousel_initial_index", 0, 50),
      K("carousel_effect", [
        { value: "coverflow", label: "Coverflow" },
        { value: "slide", label: "Slide" }
      ]),
      P("carousel_grab_cursor"),
      P("carousel_centered_slides"),
      K("carousel_slides_per_view", [
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
      P("carousel_coverflow_slide_shadows")
    ] : e.upstreamId === "custom_card_playstation" ? [
      h(["binary_sensor", "media_player", "remote", "sensor", "switch"]),
      K("console_platform", [
        { value: "auto", label: "Automatic" },
        { value: "xbox", label: "Xbox" },
        { value: "playstation", label: "PlayStation" },
        { value: "nintendo", label: "Nintendo" }
      ]),
      P("console_show_artwork"),
      P("console_show_controls"),
      h(["sensor"], "followers_entity"),
      h(["sensor"], "following_entity"),
      h(["sensor"], "friends_entity"),
      h(["sensor", "number", "input_number"], "primary_stat_entity"),
      { name: "primary_stat_icon", selector: { icon: {} } },
      h(["sensor", "number", "input_number"], "secondary_stat_entity"),
      { name: "secondary_stat_icon", selector: { icon: {} } },
      h(["sensor"], "now_playing_entity"),
      h(["image", "camera"], "gamerpic_entity"),
      h(["image", "camera"], "artwork_entity"),
      h(["remote", "media_player", "switch"], "console_power_entity"),
      ...q()
    ] : e.upstreamId === "custom_card_alarm_time" ? [
      h(["input_boolean", "switch"]),
      h(["input_datetime"], "datetime_entity"),
      z("ulm_card_alarm_time_step", 1, 180),
      P("ulm_card_alarm_time_collapse"),
      P("ulm_card_alarm_time_horizontal"),
      { name: "ulm_card_alarm_time_icon", selector: { icon: {} } },
      F("ulm_card_alarm_time_color"),
      ...q()
    ] : e.upstreamId === "custom_card_media_player_sonos" ? [
      h(["media_player"]),
      ...q(),
      P("ulm_card_media_player_enable_art"),
      P("use_media_info"),
      P("show_volume_level"),
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
      P("collapsible_controls"),
      P("sonos_details_always_visible"),
      h(["switch"], "crossfade_entity"),
      h(["switch"], "night_sound_entity"),
      h(["switch"], "speech_enhancement_entity"),
      h(["switch"], "subwoofer_entity"),
      h(["switch"], "surrounds_entity"),
      h(["switch"], "loudness_entity"),
      h(["switch"], "surround_full_entity"),
      h(["number"], "audio_delay_entity"),
      h(["number"], "balance_entity"),
      h(["number"], "bass_entity"),
      h(["number"], "treble_entity"),
      h(["number"], "sub_gain_entity"),
      h(["number"], "surround_level_entity"),
      h(["number"], "music_surround_level_entity")
    ] : e.upstreamId === "custom_card_printer" ? [
      h(["sensor", "binary_sensor"]),
      h(["sensor"], "black_entity"),
      h(["sensor"], "yellow_entity"),
      h(["sensor"], "magenta_entity"),
      h(["sensor"], "cyan_entity"),
      ...q()
    ] : e.upstreamId === "advanced_energy_buy_sell" ? [
      h(["sensor"]),
      D("buy_sell_title"),
      z("buy_sell_graph_span", 1, 168),
      K("buy_sell_span_start", [
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
      F("buy_sell_price_color"),
      D("buy_sell_charge_label"),
      F("buy_sell_charge_color"),
      D("buy_sell_planned_sell_label"),
      F("buy_sell_planned_sell_color"),
      D("buy_sell_possible_sell_label"),
      F("buy_sell_possible_sell_color"),
      P("buy_sell_show_now"),
      D("buy_sell_now_label"),
      F("buy_sell_now_color"),
      P("buy_sell_show_legend"),
      P("buy_sell_show_grid"),
      P("buy_sell_show_result"),
      z("buy_sell_trade_energy", 0.1, 1e3, 0.01),
      h(["input_number", "number", "sensor"], "buy_sell_trade_energy_entity"),
      z("buy_sell_trade_power", 0.1, 1e3, 0.01),
      z("buy_sell_trade_efficiency", 1, 100, 0.1),
      z("buy_sell_feed_in_fee", 0, 10, 1e-3),
      z("buy_sell_slot_minutes", 1, 1440),
      ...q()
    ] : e.upstreamId === "advanced_energy_panel_health" ? [
      h(["sensor"]),
      {
        name: "panel_entities",
        selector: { entity: { domain: ["sensor"], multiple: !0 } }
      },
      D("panel_health_title"),
      P("panel_show_summary"),
      P("panel_show_gauges"),
      z("panel_gauge_max", 1, 1e5),
      z("panel_warning_average_min", 0, 1e5),
      z("panel_low_output_percent", 1, 100),
      z("panel_segment_1", 0, 1e5),
      z("panel_segment_2", 0, 1e5),
      z("panel_segment_3", 0, 1e5),
      z("panel_segment_4", 0, 1e5),
      F("panel_color_0"),
      F("panel_color_1"),
      F("panel_color_2"),
      F("panel_color_3"),
      F("panel_color_4"),
      F("panel_color_5"),
      ...q()
    ] : e.upstreamId === "custom_card_roomview" ? [
      h(e.preferredDomains),
      h(["group", "binary_sensor"], "group_motions"),
      h(["group", "binary_sensor"], "group_doors"),
      h(["group", "binary_sensor"], "group_windows"),
      h(["group", "binary_sensor"], "group_water"),
      h(["sensor"], "temperature"),
      h(["sensor"], "humidity"),
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
      K("climate_icon_type", [
        { value: "icon", label: "Icon" },
        { value: "entity-picture", label: "Entity picture" },
        { value: "none", label: "None" }
      ]),
      ...["climate_primary_info", "climate_secondary_info"].map((r) => K(r, [
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
        h(["group", i], n),
        ...["tap", "hold", "double_tap"].map((l) => _e(`${r}_${l}_action`))
      ]),
      ...q()
    ] : e.upstreamId === "custom_card_room_overview" ? [
      h(),
      h(["light"], "ulm_custom_card_room_overview_light_entity"),
      h(["climate"], "ulm_custom_card_room_overview_climate_entity"),
      h(["cover"], "ulm_custom_card_room_overview_cover_entity"),
      { name: "ulm_card_room_overview_light_icon_on", selector: { icon: {} } },
      { name: "ulm_card_room_overview_light_icon_off", selector: { icon: {} } },
      { name: "ulm_card_room_overview_cover_icon_open", selector: { icon: {} } },
      { name: "ulm_card_room_overview_cover_icon_closed", selector: { icon: {} } },
      P("ulm_card_dynamic_color"),
      D("secondary"),
      ...q()
    ] : e.upstreamId === "custom_card_welcome" ? [
      h(["person"]),
      h(["input_boolean"], "ulm_card_welcome_collapse"),
      h(["weather"], "ulm_weather"),
      ...Array.from({ length: 5 }, (r, n) => n + 1).flatMap((r) => [
        D(`nav_${r}`),
        { name: `icon_${r}`, selector: { icon: {} } },
        D(`name_${r}`),
        K(`color_${r}`, ["blue", "red", "green", "yellow", "pink", "purple"].map((n) => ({
          value: n,
          label: n[0].toUpperCase() + n.slice(1)
        })))
      ]),
      ...q()
    ] : e.upstreamId === "custom_card_plant" ? [
      h(["plant", "sensor"]),
      D("ulm_card_flower_species"),
      {
        name: "ulm_card_flower_show_bars",
        selector: {
          select: {
            multiple: !0,
            options: mt.map(({ key: r, label: n }) => ({ value: r, label: n }))
          }
        }
      },
      ...ja(t).map((r) => h(["sensor", "number", "input_number"], Ga(r))),
      ...q()
    ] : e.upstreamId === "custom_card_washer" ? [
      h(["sensor", "switch", "binary_sensor"]),
      h(["sensor", "select"], "program_stage_entity"),
      h(["sensor", "switch"], "washer_power_entity"),
      h(["sensor", "binary_sensor"], "door_entity"),
      h(["sensor", "binary_sensor"], "finished_entity"),
      h(["sensor", "binary_sensor"], "ulm_custom_card_washer_remote_control"),
      h(["sensor"], "ulm_custom_card_washer_job_progress"),
      h(["input_boolean"], "ulm_custom_card_washer_delayed_start"),
      h(["input_datetime"], "ulm_custom_card_washer_delayed_starttime"),
      D("ulm_custom_card_washer_machine_stop_state"),
      { name: "ulm_custom_card_washer_job_states", selector: { object: {} } },
      D("ulm_custom_card_washer_label_idle"),
      D("ulm_custom_card_washer_label_configuring"),
      D("ulm_custom_card_washer_label_running"),
      _e("ulm_custom_card_washer_start_action"),
      _e("ulm_custom_card_washer_pause_action"),
      _e("ulm_custom_card_washer_stop_action"),
      ...q()
    ] : e.upstreamId === "custom_card_sun" ? [
      h(["sun"]),
      D("title"),
      K("language", [
        { value: "en", label: "English" },
        { value: "de", label: "German" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "nl", label: "Dutch" },
        { value: "pl", label: "Polish" }
      ]),
      K("timeFormat", [
        { value: "24h", label: "24-hour time" },
        { value: "12h", label: "12-hour time" }
      ]),
      P("darkMode"),
      P("showMoon"),
      h(["sensor"], "moon_entity"),
      h(["sensor"], "moon_altitude_entity"),
      h(["sensor"], "moon_azimuth_entity"),
      h(["sensor"], "moon_rising_entity"),
      h(["sensor"], "moon_setting_entity"),
      h(["sensor"], "moon_next_full_moon_entity"),
      h(["sensor"], "moon_next_new_moon_entity"),
      h(["sensor", "binary_sensor"], "moon_above_horizon_entity"),
      ...q()
    ] : e.upstreamId === "custom_card_pollen" ? [
      h(["sensor"]),
      h(["sensor"], "trees_entity"),
      D("custom_card_pollen_tree_name"),
      { name: "custom_card_pollen_tree_icon", selector: { icon: {} } },
      h(["sensor"], "grass_entity"),
      D("custom_card_pollen_grass_name"),
      { name: "custom_card_pollen_grass_icon", selector: { icon: {} } },
      h(["sensor"], "weeds_entity"),
      D("custom_card_pollen_weed_name"),
      { name: "custom_card_pollen_weed_icon", selector: { icon: {} } },
      ...q()
    ] : e.upstreamId === "custom_card_speedtest_gauges" ? [
      h(["sensor"]),
      h(["sensor"], "download_entity"),
      F("ulm_custom_card_speedtest_download_speed_color"),
      z("ulm_custom_card_speedtest_download_speed_max", 1, 1e5),
      h(["sensor"], "upload_entity"),
      F("ulm_custom_card_speedtest_upload_speed_color"),
      z("ulm_custom_card_speedtest_upload_speed_max", 1, 1e5),
      h(["sensor"], "ping_entity"),
      F("ulm_custom_card_speedtest_ping_color"),
      z("ulm_custom_card_speedtest_ping_max", 1, 1e5),
      P("ulm_custom_card_speedtest_round"),
      ...q()
    ] : e.upstreamId === "custom_card_nas_metrics" ? [
      h(["binary_sensor", "sensor", "switch"]),
      h(["sensor"], "disk_entity"),
      D("disk_name"),
      { name: "disk_icon", selector: { icon: {} } },
      F("disk_color"),
      h(["sensor"], "temperature_entity"),
      D("temperature_name"),
      { name: "temperature_icon", selector: { icon: {} } },
      F("temperature_color"),
      z("temperature_max", 1, 1e5),
      h(["sensor"], "memory_entity"),
      D("memory_name"),
      { name: "memory_icon", selector: { icon: {} } },
      F("memory_color"),
      z("memory_max", 1, 1e5),
      h(["sensor"], "cpu_entity"),
      D("cpu_name"),
      { name: "cpu_icon", selector: { icon: {} } },
      F("cpu_color"),
      z("cpu_max", 1, 1e5),
      ...q()
    ] : e.upstreamId === "custom_card_input_datetime" ? [
      h(["input_datetime"]),
      ...q()
    ] : e.upstreamId === "custom_card_weather_metrics" ? [
      h(["weather"]),
      h(["sensor"], "temperature_entity"),
      h(["sensor"], "date_entity"),
      ...[1, 2, 3, 4].flatMap((r) => [
        h(void 0, `ulm_custom_card_weather_metrics_entity_${r}`),
        D(`ulm_custom_card_weather_metrics_name_${r}`)
      ]),
      ...q()
    ] : e.upstreamId === "custom_card_tablet" ? [
      h(["binary_sensor", "sensor", "switch"]),
      h(["switch", "input_boolean"], "tablet_button_usb_entity"),
      h(["switch", "input_boolean"], "tablet_button_motion_entity"),
      h(["light", "switch", "input_boolean"], "tablet_button_display_entity"),
      h(["button"], "tablet_restart_entity"),
      h(["switch", "input_boolean"], "tablet_maintenance_entity"),
      h(["button"], "tablet_reload_entity"),
      h(["sensor"], "tablet_ram_entity"),
      h(["sensor"], "tablet_disk_entity"),
      h(["sensor", "binary_sensor", "switch"], "tablet_power_entity"),
      h(["sensor"], "battery_entity"),
      ...q()
    ] : (ca[e.family] ?? ca.entity)(e, t)
  ], o = lr.has(e.upstreamId) ? Wa(a) : a;
  return [
    ...cr(o).map(dr),
    _e("tap_action"),
    _e("hold_action"),
    _e("double_tap_action")
  ];
}, ur = (e, t) => {
  const a = t?.variant ? (e.sourceIds ?? [e.upstreamId]).filter((r) => ta(r) === t.variant || r === e.upstreamId && ta(r) === void 0) : e.sourceIds ?? [e.upstreamId];
  return [...new Map(
    a.flatMap((r) => Tt.get(r)?.variables ?? []).map((r) => [r.name, r])
  ).values()].filter((r) => Ha(e, r.name)).filter((r) => !Jo(e, r.name)).filter((r) => !ir.has(r.name)).map((r) => {
    const n = sr[r.name];
    if (n) return K(r.name, n);
    if (rr.has(r.name)) return P(r.name);
    if (nr.has(r.name)) return z(r.name, -1e5, 1e5);
    if (or.has(r.name))
      return {
        name: r.name,
        selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
      };
    switch (r.selector) {
      case "entity":
        return h(void 0, r.name);
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
        return z(r.name, -1e5, 1e5);
      case "object":
        return { name: r.name, selector: { object: {} } };
      default:
        return D(r.name);
    }
  });
}, Ua = (e) => new Set(e.flatMap((t) => t.schema ? [...Ua(t.schema)] : t.name ? [t.name] : [])), _r = (e, t) => {
  const a = Ua(Ra(e, t));
  return ur(e, t).filter((o) => !a.has(o.name));
}, mr = [
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
], Ot = (e, t) => t?.attributes.icon ? t.attributes.icon : e.upstreamId === "custom_card_trash" ? "mdi:trash-can-outline" : e.upstreamId === "custom_card_room_overview" ? "mdi:sofa" : e.upstreamId === "custom_card_roomview" ? "mdi:home-variant-outline" : e.upstreamId === "custom_card_entity_carousel" ? "mdi:view-carousel" : e.upstreamId === "custom_card_sun" ? "mdi:weather-sunny" : e.upstreamId === "custom_card_speedtest_gauges" ? "mdi:speedometer" : e.upstreamId === "advanced_home_energy_management" ? "mdi:home-lightning-bolt-outline" : e.upstreamId === "advanced_energy_buy_sell" ? "mdi:chart-timeline-variant" : e.upstreamId === "advanced_energy_panel_health" ? "mdi:solar-power-variant" : mr.find(([a]) => a.test(e.upstreamId))?.[1] ?? "mdi:information-outline", pr = (e) => {
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
}, hr = (e) => {
  const t = {};
  for (const a of e.sourceIds ?? [e.upstreamId])
    for (const o of Tt.get(a)?.variables ?? []) {
      if (!Ha(e, o.name)) continue;
      const r = pr(o.defaultValue);
      r !== void 0 && (t[o.name] = r);
    }
  return t;
}, qa = (e, t, a) => {
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
    use_media_info: !1,
    show_volume_level: !0,
    volume_controls: ["volume_buttons"],
    media_controls: ["play_pause_stop"],
    collapsible_controls: !1,
    sonos_details_always_visible: !1,
    ...zt(t, a)
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
    ...Dt(t, a)
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
    ...hr(e),
    ...r,
    entity: a,
    entities: e.upstreamId === "mini_graph_card" && a ? [a] : void 0,
    waste_streams: e.upstreamId === "custom_card_trash" ? Lo() : void 0,
    show_today: e.upstreamId === "custom_card_trash" ? !1 : void 0,
    show_tomorrow: e.upstreamId === "custom_card_trash" ? !1 : void 0,
    name: void 0,
    icon: n ? void 0 : r.icon ?? Ot(e, o),
    show_icon: !0,
    show_state: e.upstreamId !== "custom_card_pollen",
    layout: "default"
  };
}, gr = {
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
}, De = (e, t = "") => {
  const a = t ? e?.states[t] : void 0, o = t.split(".", 1)[0];
  return {
    entity: t,
    name: a?.attributes.friendly_name,
    icon: a?.attributes.icon ?? gr[o] ?? "mdi:gesture-tap-button",
    icon_type: a?.attributes.entity_picture ? "entity-picture" : "icon",
    color: "purple",
    tap_action: { action: "toggle" }
  };
};
var yr = Object.defineProperty, br = Object.getOwnPropertyDescriptor, Nt = (e, t, a, o) => {
  for (var r = o > 1 ? void 0 : o ? br(t, a) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = (o ? i(t, a, r) : i(r)) || r);
  return o && r && yr(t, a, r), r;
};
const fr = [
  { id: "primary", title: "Primary entity presentation", icon: "mdi:account-circle-outline" },
  { id: "climate", title: "Climate", icon: "mdi:thermometer" },
  { id: "sensors", title: "Sensor status", icon: "mdi:shield-check-outline" },
  { id: "devices", title: "Device controls", icon: "mdi:gesture-tap" },
  { id: "actions", title: "Card interactions", icon: "mdi:gesture-tap-button" }
], vr = (e) => e === "temperature" || e === "humidity" || e.startsWith("climate_") ? "climate" : ["group_motions", "group_doors", "group_windows", "group_water"].includes(e) ? "sensors" : ["group_lights", "group_windows_shutters", "group_outlets", "group_tv"].includes(e) || /^(lights|shutters|outlets|tv)_/.test(e) ? "devices" : Ya.has(e) ? "actions" : "primary", Ka = (e, t) => e.flatMap((a) => {
  if (!a.schema) return vr(a.name) === t ? [a] : [];
  const o = Ka(a.schema, t);
  return o.length ? [{ ...a, schema: o }] : [];
}), wr = [
  { id: "context", title: "Context", icon: "mdi:shape-outline" },
  { id: "content", title: "Content", icon: "mdi:format-align-left" },
  { id: "layout", title: "Layout", icon: "mdi:view-dashboard-outline" },
  { id: "interactions", title: "Interactions", icon: "mdi:gesture-tap" },
  { id: "features", title: "Features", icon: "mdi:view-list" }
], $r = /* @__PURE__ */ new Set([
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
]), xr = /* @__PURE__ */ new Set([
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
]), Ya = /* @__PURE__ */ new Set([
  "tap_action",
  "hold_action",
  "double_tap_action",
  "navigation_path",
  "settings_path"
]), da = {
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
    [["lights", "Lights"], ["shutters", "Shutters"], ["outlets", "Outlets"], ["tv", "Television"]].flatMap(([e, t]) => [["tap", "tap"], ["hold", "hold"], ["double_tap", "double tap"]].map(([a, o]) => [`${e}_${a}_action`, `${t}: ${o} action`]))
  )
}, ua = (e) => e.name === "entity" ? "context" : Ya.has(e.name) || e.name.endsWith("_action") ? "interactions" : xr.has(e.name) || e.name.endsWith("_horizontal") || e.name.endsWith("_narrow_buttons") ? "layout" : $r.has(e.name) ? "content" : "features", Sr = (e) => {
  const t = {
    context: [],
    content: [],
    layout: [],
    interactions: [],
    features: []
  };
  for (const a of e) {
    if (!a.schema?.length) {
      t[ua(a)].push(a);
      continue;
    }
    const o = /* @__PURE__ */ new Map();
    for (const r of a.schema) {
      const n = ua(r);
      o.set(n, [...o.get(n) ?? [], r]);
    }
    for (const [r, n] of o) t[r].push({ ...a, schema: n });
  }
  return t;
};
let Ye = class extends ve {
  constructor() {
    super(...arguments), this.computeLabel = (e) => this.config?.type.includes("custom-card-roomview") && da[e.name] ? da[e.name] : this.config?.type.includes("custom-card-trash") && e.name === "entity" ? "Optional card entity" : this.config?.type.includes("custom-card-washer") && e.name === "entity" ? sa(this.hass, "machine_state_entity") : sa(this.hass, e.name), this.computeHelper = (e) => qo(
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
        for (const { configKey: o } of Pt)
          this.config[o] === void 0 && delete a[o];
      if (this.config.type.includes("custom-card-playstation") && typeof t.entity == "string" && t.entity !== this.config.entity)
        for (const { configKey: o } of Va)
          this.config[o] === void 0 && delete a[o];
      this.config = a, me(this, "config-changed", { config: a });
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
        ...Se(this.config),
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
    const t = e.type.replace(/^custom:/, ""), a = Ct.find((o) => o.tag === t);
    this.config = {
      ...e,
      variant: e.variant ?? a?.variant
    };
  }
  render() {
    if (!this.hass || !this.config) return p;
    const e = Vo(this.config.type.replace(/^custom:/, ""));
    if (!e) return p;
    const t = Ra(e, this.config), a = _r(e, this.config).filter((c) => e.upstreamId !== "custom_card_trash" || !c.name.startsWith("ulm_card_datum_") && !c.name.includes("ophaling")), o = Sr([...t, ...a]), r = qa(e, this.hass, this.config.entity), n = this.config.show, i = {
      ...r,
      ...this.config,
      ...e.upstreamId === "custom_card_roomview" ? {
        climate_icon_type: this.config.climate_icon_type ?? "icon",
        climate_primary_info: this.config.climate_primary_info ?? (this.config.climate_name ? "name" : "state"),
        ...Object.fromEntries(["lights", "shutters", "outlets", "tv"].flatMap((c) => ["tap", "hold", "double_tap"].map((_) => {
          const g = `${c}_${_}_action`;
          return [g, this.config[g] ?? { action: _ === "double_tap" ? "toggle" : "more-info" }];
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
      return d`<div class="editor-sections room-view-editor">
        ${fr.map((c) => this.renderEditorSection(
        c,
        Ka([...t, ...a], c.id),
        i,
        p,
        !1
      ))}
      </div>`;
    const l = e.upstreamId === "mini_graph_card" ? this.renderMiniGraphEditors() : e.upstreamId === "custom_card_trash" ? this.renderWasteStreamEditor() : e.upstreamId === "custom_card_media_player_sonos" ? this.renderSonosShortcutEditor() : e.upstreamId === "custom_card_entity_carousel" ? this.renderCarouselItemEditor() : e.family === "scene" ? this.renderItemEditor(
      "scene_items",
      "Scene buttons",
      e.upstreamId === "card_welcome_scenes" ? void 0 : ["scene"]
    ) : e.upstreamId === "card_room" ? this.renderItemEditor("room_sensors", "Room sensor buttons") : p, s = e.upstreamId === "mini_graph_card" || e.upstreamId === "custom_card_trash" || e.upstreamId === "custom_card_media_player_sonos" || e.upstreamId === "custom_card_entity_carousel" || e.family === "scene" || e.upstreamId === "card_room";
    return d`
      <div class="editor-sections">
        ${wr.map((c) => this.renderEditorSection(
      c,
      o[c.id],
      i,
      c.id === "features" && s ? l : p,
      c.id === "features" && s
    ))}
      </div>
    `;
  }
  renderEditorSection(e, t, a, o, r) {
    return !t.length && !r ? p : d`
      <ha-expansion-panel class="editor-section" outlined .expanded=${e.id === "primary"}>
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
          ` : p}
          ${o}
        </div>
      </ha-expansion-panel>
    `;
  }
  renderItemEditor(e, t, a) {
    if (!this.config) return p;
    const o = this.config[e] ?? [], r = (o.length ? o : (this.config.entities ?? []).map((n) => ({ entity: n }))).map((n) => e === "scene_items" ? { ...De(this.hass, n.entity), ...n } : n);
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
            ` : p}
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
            ` : p}
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
                  @value-changed=${(c) => this.updateMiniGraphEntity(i, l, c.detail.value)}
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
    this.config = t, me(this, "config-changed", { config: t });
  }
  renderWasteStreamEditor() {
    if (!this.config) return p;
    const e = Se(this.config);
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
    if (!this.config) return p;
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
    if (!this.config) return p;
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
      const n = r[t], i = De(this.hass, n.entity), l = De(this.hass, o), s = { ...n, entity: o };
      for (const c of ["name", "icon", "icon_type", "color", "tap_action"])
        (n[c] === void 0 || JSON.stringify(n[c]) === JSON.stringify(i[c])) && Object.assign(s, { [c]: l[c] });
      r[t] = s;
    } else
      r[t] = { ...r[t], [a]: o || void 0 };
    this.updateItems(e, r);
  }
  addItem(e) {
    if (!this.config) return;
    const t = [...this.config[e] ?? (this.config.entities ?? []).map((o) => ({ entity: o }))], a = e === "scene_items" ? Object.keys(this.hass?.states ?? {}).find((o) => o.startsWith("scene.")) ?? "" : "";
    t.push(e === "scene_items" ? De(this.hass, a) : { entity: "" }), this.updateItems(e, t);
  }
  removeItem(e, t) {
    if (!this.config) return;
    const a = [...this.config[e] ?? (this.config.entities ?? []).map((o) => ({ entity: o }))].filter((o, r) => r !== t);
    this.updateItems(e, a);
  }
  updateItems(e, t) {
    if (!this.config) return;
    const a = { ...this.config, [e]: t, entities: void 0 };
    this.config = a, me(this, "config-changed", { config: a });
  }
  updateWasteStream(e, t, a) {
    if (!this.config) return;
    const o = Se(this.config);
    o[e] = {
      ...o[e],
      [t]: t === "enabled" ? a !== !1 : a || void 0
    }, this.updateWasteStreams(o);
  }
  removeWasteStream(e) {
    this.config && this.updateWasteStreams(Se(this.config).filter((t, a) => a !== e));
  }
  moveWasteStream(e, t) {
    if (!this.config) return;
    const a = Se(this.config), o = e + t;
    o < 0 || o >= a.length || ([a[e], a[o]] = [a[o], a[e]], this.updateWasteStreams(a));
  }
  updateWasteStreams(e) {
    if (!this.config) return;
    const t = { ...this.config, waste_streams: e };
    this.config = t, me(this, "config-changed", { config: t });
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
    this.config = t, me(this, "config-changed", { config: t });
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
    this.config = a, me(this, "config-changed", { config: a });
  }
};
Ye.styles = lt`
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
Nt([
  Ie({ attribute: !1 })
], Ye.prototype, "hass", 2);
Nt([
  he()
], Ye.prototype, "config", 2);
Ye = Nt([
  Ia("mushroom-addition-editor")
], Ye);
const kr = lt`
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
  .custom-room-view { display: grid; min-width: 0; gap: 12px; padding: 12px; }
  .room-view-section { min-width: 0; padding-top: 10px; border-top: 1px solid var(--divider-color); }
  .room-view-section h3 { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; margin: 0 0 8px; font-size: 13px; font-weight: 600; }
  .room-view-section h3 small { color: var(--secondary-text-color); font-size: 11px; font-weight: 400; }
  .room-view-summary { display: flex; width: 100%; min-width: 0; min-height: 48px; align-items: center; gap: 10px; padding: 4px 0; border: 0; border-radius: 12px; background: transparent; color: var(--primary-text-color); font: inherit; text-align: start; cursor: pointer; }
  .room-view-summary .ulm-copy { min-width: 0; }
  .room-view-icon { position: relative; display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--ulm-grey), .1); color: rgba(var(--ulm-grey), .45); }
  .room-view-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .room-view-status, .room-view-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; min-width: 0; }
  .room-view-status button, .room-view-actions button { position: relative; display: flex; min-width: 0; min-height: 48px; align-items: center; gap: 8px; padding: 8px; border: 0; color: var(--primary-text-color); font: inherit; text-align: start; cursor: pointer; }
  .room-view-status button { border: 1px solid var(--divider-color); border-radius: 24px; background: transparent; }
  .room-view-status button > ha-icon, .room-view-actions button > ha-icon { flex-shrink: 0; --mdc-icon-size: 20px; }
  .room-view-status button > span, .room-view-actions button > span { min-width: 0; overflow-wrap: anywhere; font-size: 12px; }
  .room-view-status button small, .room-view-actions button small { display: block; margin-top: 2px; color: var(--secondary-text-color); font-size: 11px; }
  .room-view-status button.is-active > ha-icon { color: rgb(var(--ulm-yellow)); }
  .room-view-status .is-unavailable, .room-view-warning { color: var(--error-color, #db4437); }
  .room-view-warning, .room-view-empty { grid-column: 1 / -1; display: flex; align-items: center; gap: 6px; font-size: 12px; }
  .room-view-empty { color: var(--secondary-text-color); }
  .room-view-warning ha-icon { --mdc-icon-size: 18px; }
  .room-view-actions button { border-radius: 14px; background: rgba(var(--ulm-grey), .08); }
  .room-view-actions button.is-active { background: rgba(var(--ulm-yellow), .25); color: rgb(var(--ulm-yellow)); }
  .room-view-actions button:disabled { opacity: .6; cursor: not-allowed; }
  .room-view-actions i, .room-view-status i { position: absolute; top: -3px; right: 4px; display: grid; min-width: 16px; height: 16px; place-items: center; border-radius: 9px; background: rgb(var(--ulm-blue)); color: #fff; font-size: 10px; font-style: normal; }
  .room-view-section button:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
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
const Mr = (e) => e.strings === void 0;
const Xa = { CHILD: 2, ELEMENT: 6 }, Ar = (e) => (...t) => ({ _$litDirective$: e, values: t });
class Ir {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, a, o) {
    this._$Ct = t, this._$AM = a, this._$Ci = o;
  }
  _$AS(t, a) {
    return this.update(t, a);
  }
  update(t, a) {
    return this.render(...a);
  }
}
const Re = (e, t) => {
  const a = e._$AN;
  if (a === void 0) return !1;
  for (const o of a) o._$AO?.(t, !1), Re(o, t);
  return !0;
}, st = (e) => {
  let t, a;
  do {
    if ((t = e._$AM) === void 0) break;
    a = t._$AN, a.delete(e), e = t;
  } while (a?.size === 0);
}, Ja = (e) => {
  for (let t; t = e._$AM; e = t) {
    let a = t._$AN;
    if (a === void 0) t._$AN = a = /* @__PURE__ */ new Set();
    else if (a.has(e)) break;
    a.add(e), Er(t);
  }
};
function Cr(e) {
  this._$AN !== void 0 ? (st(this), this._$AM = e, Ja(this)) : this._$AM = e;
}
function Pr(e, t = !1, a = 0) {
  const o = this._$AH, r = this._$AN;
  if (r !== void 0 && r.size !== 0) if (t) if (Array.isArray(o)) for (let n = a; n < o.length; n++) Re(o[n], !1), st(o[n]);
  else o != null && (Re(o, !1), st(o));
  else Re(this, e);
}
const Er = (e) => {
  e.type == Xa.CHILD && (e._$AP ??= Pr, e._$AQ ??= Cr);
};
class zr extends Ir {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, a, o) {
    super._$AT(t, a, o), Ja(this), this.isConnected = t._$AU;
  }
  _$AO(t, a = !0) {
    t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), a && (Re(this, t), st(this));
  }
  setValue(t) {
    if (Mr(this._$Ct)) this._$Ct._$AI(t, this);
    else {
      const a = [...this._$Ct._$AH];
      a[this._$Ci] = t, this._$Ct._$AI(a, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
class Dr extends zr {
  constructor(t) {
    if (super(t), this.held = !1, this.cancelled = !1, this.onEvent = (a) => {
      if (a.stopPropagation(), !this.element?.disabled)
        switch (a.type) {
          case "pointerdown": {
            const o = a;
            if (o.button !== 0 && o.button !== void 0) return;
            this.clearHold(), this.held = !1, this.cancelled = !1, this.pointer = { x: o.clientX, y: o.clientY }, this.config?.hold_action && this.config.hold_action.action !== "none" && (this.holdTimer = window.setTimeout(() => {
              this.held = !0, this.clearTap(), this.run("hold");
            }, 500));
            break;
          }
          case "pointermove": {
            const o = a;
            this.pointer && Math.hypot(o.clientX - this.pointer.x, o.clientY - this.pointer.y) > 10 && (this.clearHold(), this.cancelled = !0);
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
            const o = a;
            if (o.detail > 1) return;
            this.clearTap(), !o.detail || this.config?.double_tap_action?.action === "none" || !this.config?.double_tap_action ? this.run("tap") : this.tapTimer = window.setTimeout(() => {
              this.tapTimer = void 0, this.run("tap");
            }, 300);
            break;
          }
          case "dblclick":
            this.clearTap(), !this.held && !this.cancelled && this.run("double_tap");
            break;
          case "keydown": {
            const o = a;
            (o.key === "Enter" || o.key === " ") && (o.preventDefault(), o.repeat || (this.clearTap(), this.held = !1, this.cancelled = !1, this.run("tap")));
            break;
          }
          case "keyup":
          case "contextmenu":
            a.preventDefault();
            break;
        }
    }, t.type !== Xa.ELEMENT) throw new Error("Control actions require an element");
  }
  render(t) {
    return p;
  }
  update(t, [a]) {
    return this.config?.entity !== a.entity && (this.clearHold(), this.clearTap()), this.config = a, this.element || (this.element = t.element, this.listen(!0)), p;
  }
  run(t) {
    if (!this.config || this.element?.disabled || !this.isConnected) return;
    const a = this.config[`${t}_action`];
    !a || a.action === "none" || Da(this.element, {
      ...this.config,
      entity: typeof a.entity == "string" ? a.entity : this.config.entity
    }, t);
  }
  clearHold() {
    window.clearTimeout(this.holdTimer), this.holdTimer = void 0;
  }
  clearTap() {
    window.clearTimeout(this.tapTimer), this.tapTimer = void 0;
  }
  listen(t) {
    for (const a of [
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
      t ? this.element?.addEventListener(a, this.onEvent) : this.element?.removeEventListener(a, this.onEvent);
  }
  disconnected() {
    this.clearHold(), this.clearTap(), this.listen(!1);
  }
  reconnected() {
    this.listen(!0);
  }
}
const Qe = Ar(Dr), Tr = {
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
}, Or = (e, t) => {
  const a = e?.trim() || t.trim();
  if (a === "primary")
    return e ? `var(--primary-color, ${t})` : "var(--primary-color)";
  if (a === "accent")
    return e ? `var(--accent-color, ${t})` : "var(--accent-color)";
  const o = Tr[a];
  return o ? `rgb(var(--rgb-${a}, ${o}))` : a;
}, ze = (e, t) => {
  if (!t) return;
  const a = Number.parseFloat(e.states[t]?.state ?? "");
  return Number.isFinite(a) ? a : void 0;
}, Nr = (e, t, a = "") => t ? e.states[t]?.attributes.unit_of_measurement ?? a : a, xe = (e, t) => {
  const a = ze(e, t);
  if (a === void 0) return;
  const o = Nr(e, t).toLowerCase();
  return o === "mw" ? a * 1e6 : o === "kw" ? a * 1e3 : a;
}, be = (e) => {
  const t = Math.abs(e ?? 0);
  return t >= 1e3 ? `${(t / 1e3).toFixed(2).replace(".", ",")} kW` : `${Math.round(t).toLocaleString()} W`;
}, wt = (e, t, a, o = 380, r = 300) => {
  const n = (_) => {
    const g = _ * Math.PI / 180;
    return [
      o + e * Math.sin(g),
      r - e * Math.cos(g)
    ];
  }, [i, l] = n(t), [s, c] = n(a);
  return `M${i.toFixed(1)} ${l.toFixed(1)}A${e} ${e} 0 ${a - t > 180 ? 1 : 0} 1 ${s.toFixed(1)} ${c.toFixed(1)}`;
}, Vr = (e, t, a, o, r = !1) => {
  const n = Math.max(0, Math.min(1, o));
  if (n < 0.015) return;
  const i = (a - t) * n;
  return r ? wt(e, a - i, a) : wt(e, t, t + i);
}, Lr = (e) => {
  const t = e?.attributes.raw_today;
  return Array.isArray(t) ? t : [];
}, Fr = (e, t = 0, a = 0) => Lr(e).flatMap((o) => {
  if (!o || typeof o != "object") return [];
  const r = o, n = new Date(String(r.start ?? "")).getTime(), i = new Date(String(r.end ?? "")).getTime(), l = Number(r.value);
  return !Number.isFinite(n) || !Number.isFinite(i) || !Number.isFinite(l) ? [] : [{
    start: n,
    end: i,
    price: (l + t) * (1 + a / 100)
  }];
}), Br = (e) => {
  if (typeof e == "number" && Number.isFinite(e))
    return e < 1e12 ? e * 1e3 : e;
  if (typeof e != "string" || !e.trim()) return;
  const t = Date.parse(e);
  return Number.isFinite(t) ? t : void 0;
}, Hr = (e) => {
  const t = e?.attributes.slots;
  return Array.isArray(t) ? t.flatMap((a) => {
    if (!Array.isArray(a) || a.length < 3) return [];
    const o = Br(a[0]);
    if (typeof a[1] != "number" && (typeof a[1] != "string" || !a[1].trim()) || typeof a[2] != "number" && (typeof a[2] != "string" || !a[2].trim())) return [];
    const r = Number(a[1]), n = Number(a[2]);
    return o === void 0 || !Number.isFinite(r) || !Number.isInteger(n) || n < 0 || n > 3 ? [] : [{ timestamp: o, price: r, kind: n }];
  }).sort((a, o) => a.timestamp - o.timestamp) : [];
}, jr = (e, t, a) => {
  const o = e.map(({ price: l }) => l), r = Number.isFinite(t) ? t : Math.min(0, ...o), n = Number.isFinite(a) ? a : Math.max(0, ...o);
  if (n > r) {
    const l = Number.isFinite(a) ? 0 : (n - r) * 0.06;
    return { minimum: r, maximum: n + l };
  }
  const i = Math.max(Math.abs(r) * 0.1, 1);
  return { minimum: r - i, maximum: n + i };
}, _a = (e, t = 2) => e.toFixed(Math.max(0, Math.min(6, Math.floor(t)))), Gr = (e, t) => {
  const { energy: a, power: o, efficiency: r, fee: n, slotMinutes: i } = t;
  if (![a, o, r, n, i].every(Number.isFinite) || a <= 0 || o <= 0 || r <= 0 || r > 100 || n < 0 || i <= 0) return { error: "Enter a positive trade size, power and slot duration, an efficiency from 1 to 100%, and a non-negative feed-in fee." };
  if (e.length === 0) return { error: "No price slots available for the buy and sell result." };
  const l = [...e].sort((u, y) => u.timestamp - y.timestamp);
  if (l.some(
    (u, y) => !Number.isFinite(u.timestamp) || !Number.isFinite(u.price) || y > 0 && u.timestamp === l[y - 1].timestamp
  )) return { error: "Price slots must contain finite prices and unique timestamps." };
  const s = l.map((u, y) => ({
    ...u,
    duration: Math.min(
      i * 6e4,
      l[y + 1] ? l[y + 1].timestamp - u.timestamp : 1 / 0
    )
  })).sort((u, y) => u.price - y.price || u.timestamp - y.timestamp), c = /* @__PURE__ */ new Set(), _ = (u, y) => {
    let x = u, b = 0;
    const f = [];
    for (let S = 0; S < s.length && x > 1e-9; S++) {
      const w = s[y ? s.length - 1 - S : S];
      if (c.has(w.timestamp)) continue;
      const T = Math.min(x, o * w.duration / 36e5);
      c.add(w.timestamp), f.push({ start: w.timestamp, end: w.timestamp + T / o * 36e5, energy: T }), b += T * w.price, x -= T;
    }
    if (!(x > 1e-9))
      return {
        slots: f.sort((S, w) => S.start - w.start),
        energy: u,
        averagePrice: b / u,
        amount: y ? b - n * u : -b
      };
  }, g = _(a / (r / 100), !1), m = _(a, !0);
  return !g || !m ? { error: "Not enough separate price slots to buy and sell the configured trade size. Reduce the trade size or supply more prices." } : { buy: g, sell: m, net: g.amount + m.amount };
}, Wr = (e) => {
  const t = Number.parseFloat(e.state);
  return Number.isFinite(t) ? t : 0;
}, Rr = (e, t, a) => {
  const o = t?.length ? t : a ? [a] : Object.keys(e).filter((r) => /^sensor\.inverter_4/i.test(r));
  return [...new Set(o)].filter((r) => r.startsWith("sensor.") && e[r] !== void 0).sort((r, n) => r.localeCompare(n, void 0, { numeric: !0 })).map((r) => {
    const n = e[r];
    return {
      entity: n,
      id: r.slice(-4),
      value: Wr(n)
    };
  });
}, Ur = (e) => {
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
}, qr = (e, t) => Math.max(0, Math.min(100, e / Math.max(1, t) * 100)), Kr = (e, t, a) => {
  let o = 0;
  return t.forEach((r, n) => {
    e >= r && (o = n);
  }), a[Math.min(o, a.length - 1)] ?? "var(--primary-color)";
};
var Yr = Object.defineProperty, Xr = Object.getOwnPropertyDescriptor, Ce = (e, t, a, o) => {
  for (var r = o > 1 ? void 0 : o ? Xr(t, a) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = (o ? i(t, a, r) : i(r)) || r);
  return o && r && Yr(t, a, r), r;
};
const Jr = /* @__PURE__ */ new Set(["off", "unknown", "unavailable", "none", "idle"]);
let ye = class extends ve {
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
        ${this.config?.carousel_show_labels === !1 ? p : d`
          <div class="label">
            ${this.itemName(a, o)}
            ${this.showEntityState(o) ? d`<span class="state">${o?.state}</span>` : p}
          </div>
        `}
      </div>
    `;
  }
  renderItem(e, t, a) {
    const o = this.itemOffset(t), r = Math.abs(o), n = this.itemIsHidden(o, a), i = t === this.selectedIndex, l = this.entityFor(e), s = e.color || (l?.attributes.icon, "primary"), c = this.coverflowModifier, _ = this.effect === "coverflow" ? this.coverflowStretch * c : 0, g = Math.max(18, 58 + _), m = o + this.dragOffset / g, u = Math.abs(m), x = (this.centeredSlides ? 0 : -((a - 1) * g) / 2) + o * g + this.dragOffset, b = this.effect === "coverflow" ? -u * this.coverflowDepth * c : 0, f = this.effect === "coverflow" ? m * -this.coverflowRotate * c : 0, S = Math.max(0.18, 1 - u * (this.effect === "coverflow" ? 0.16 : 0.08)), w = this.coverflowSlideShadows ? Math.min(0.48, u * 0.16 * Math.max(0.25, c)) : 0, T = [
      `transform:translateX(${x}px) translateZ(${b}px) rotateY(${f}deg)`,
      `z-index:${100 - r}`,
      `opacity:${S}`,
      `filter:saturate(${Math.max(0.45, 1 - r * 0.14)})`,
      `--carousel-color:var(--${s}-color, ${s})`,
      `--carousel-shadow-opacity:${w}`,
      `--carousel-shadow-angle:${m < 0 ? 270 : 90}deg`
    ].join(";"), B = e.icon_type === "entity-picture" ? l?.attributes.entity_picture : void 0, j = e.icon || l?.attributes.icon || "mdi:circle", X = l ? !Jr.has(l.state.toLowerCase()) : !1;
    return d`
      <button
        role="option"
        aria-selected=${i ? "true" : "false"}
        aria-label=${this.itemName(e, l)}
        class=${`${i ? "active" : ""} ${X ? "entity-active" : ""}`}
        data-shadow=${this.effect === "coverflow" && this.coverflowSlideShadows ? "true" : "false"}
        data-carousel-index=${t}
        style=${T}
        ?hidden=${n}
        >
        ${B ? d`<span class="picture" style=${`background-image:url("${String(B)}")`}></span>` : d`<ha-icon .icon=${j}></ha-icon>`}
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
    me(this, "hass-action", {
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
ye.styles = lt`
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
Ce([
  Ie({ attribute: !1 })
], ye.prototype, "hass", 2);
Ce([
  Ie({ attribute: !1 })
], ye.prototype, "config", 2);
Ce([
  he()
], ye.prototype, "selectedIndex", 2);
Ce([
  he()
], ye.prototype, "carouselWidth", 2);
Ce([
  he()
], ye.prototype, "dragOffset", 2);
Ce([
  he()
], ye.prototype, "dragging", 2);
ye = Ce([
  Ia("mushroom-addition-entity-carousel")
], ye);
const M = (e, t) => e?.attributes[t], N = (e) => {
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, Le = (e, t, a, o, r = "") => {
  if (e.config.icon_type === "none") return p;
  const n = e.config.icon_type === "entity-picture" ? M(e.entity, "entity_picture") : void 0;
  return n ? d`<span class="ulm-icon entity-picture ${r}" style=${`background-image:url("${String(n)}")`}></span>` : d`<span class="ulm-icon source-icon ${o ? "is-source-active" : ""} ${r}"
        style=${`--source-color:${a}`}>
        <ha-icon .icon=${e.config.icon || t}></ha-icon>
      </span>`;
}, Te = (e, t) => {
  const a = v(e, t);
  return a ? e.hass.states[a] : void 0;
}, Zr = (e, t) => {
  if (e === void 0) return "mdi:battery-off";
  if (e <= 0 && !t) return "mdi:battery-alert-variant-outline";
  if (e >= 100) return "mdi:battery";
  if (e <= 0) return `mdi:battery${t}-outline`;
  const a = Math.max(10, Math.min(90, Math.round(e / 10) * 10));
  return `mdi:battery${t}-${a}`;
}, J = (e, t) => {
  const a = e.config[t];
  return typeof a == "string" ? e.hass.states[a] : void 0;
}, v = (e, ...t) => {
  for (const a of t)
    if (e.config[a] !== void 0) return e.config[a];
}, pt = (e, t) => e.config.icon || e.entity?.attributes.icon || Ot(e.descriptor, e.entity) || t, oe = (e, t, a = "blue", o = "") => {
  if (e.config.icon_type === "none") return p;
  const r = e.config.icon_type === "entity-picture" ? M(e.entity, "entity_picture") : void 0;
  return r ? d`<span class="ulm-icon entity-picture ${o}" style=${`background-image:url("${String(r)}")`}></span>` : d`<span class="ulm-icon tone-${a} ${o}"><ha-icon .icon=${pt(e, t)}></ha-icon></span>`;
}, Qr = (e, t) => {
  switch (e.config.secondary_info) {
    case "none":
      return;
    case "name":
      return se(e.config, e.entity, e.hass);
    case "state":
      return C(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    case "last-updated":
      return e.entity?.last_updated ? new Date(e.entity.last_updated).toLocaleString() : "Last updated unavailable";
    default:
      return e.config.secondary || t;
  }
}, en = (e, t) => {
  switch (e.config.primary_info) {
    case "none":
      return "";
    case "state":
      return C(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    case "last-updated":
      return e.entity?.last_updated ? new Date(e.entity.last_updated).toLocaleString() : "Last updated unavailable";
    default:
      return se(e.config, e.entity, e.hass) || t || "";
  }
}, tn = (e, t, a) => {
  e.presentation.rendered = !0;
  const o = se(e.config, e.entity, e.hass), r = e.config.name !== void 0 && typeof e.config.name != "string";
  return {
    primary: (e.config.primary_info === void 0 ? r && o ? o : a ?? o : en(e, a)) || void 0,
    secondary: e.config.secondary_info === void 0 ? t : Qr(e, t)
  };
}, Y = (e, t, a) => d`
  ${(() => {
  const o = tn(e, t, a);
  return d`
  <span class="ulm-copy shared-presentation">
    ${o.primary ? d`<span class="ulm-name">${o.primary}</span>` : p}
    ${o.secondary ? d`<span class="ulm-label">${o.secondary}</span>` : p}
  </span>
    `;
})()}
`, an = (e, t = C(e.entity)) => d`
  <span class="value-first">${Y(e, se(e.config, e.entity, e.hass), t)}</span>
`, Je = (e, t = C(e.entity), a = e.descriptor.name) => d`
  <div class="card-heading">
    ${oe(e, Ot(e.descriptor, e.entity))}
    ${Y(e, t, a)}
  </div>
`, on = (e) => d`<div class="automatic-presentation">${Je(e)}</div>`, te = (e, t, a, o = !1) => d`
  <button class="ulm-control" aria-label=${e} ?disabled=${o}
    @pointerdown=${(r) => r.stopPropagation()} @click=${a}>
    <ha-icon .icon=${t}></ha-icon>
  </button>
`, rn = (e, t, a, o, r = !1) => {
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
}, ie = (e, t, a, o = t.config.entity) => {
  e.stopPropagation(), me(e.currentTarget, "hass-action", {
    config: { type: t.config.type, entity: o, tap_action: a },
    action: "tap"
  });
}, nn = {
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
}, sn = (e) => {
  const t = N(e.entity?.state) ?? 0, a = !!M(e.entity, "is_charging") || String(e.entity?.state).includes("charging"), o = v(e, "ulm_card_battery_battery_level_danger") ?? 20, r = v(e, "ulm_card_battery_battery_level_warning") ?? 50, n = t < o ? "red" : t < r ? "yellow" : "green", i = v(e, "ulm_card_battery_charging_animation") === !0 && a;
  return e.actionSurface(`ulm-battery ${i ? "is-charging" : ""}`, d`
    ${oe(e, a ? "mdi:battery-charging" : "mdi:battery", n)}
    ${Y(e, a ? "Charging" : "Battery level")}
    <span class="battery-value">${Math.round(t)}<small>%</small></span>
    <span class="battery-track"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>
  `);
}, ln = (e) => {
  const t = v(e, "ulm_card_battery_attribute"), a = t ? M(e.entity, t) : e.entity?.state, o = N(a), r = Te(e, "ulm_card_battery_battery_state_entity_id"), n = Te(e, "ulm_card_battery_charger_type_entity_id"), i = r?.state.toLowerCase() === "charging", l = n?.state.toLowerCase(), s = l === "wireless" ? "-charging-wireless" : i || ["charging", "ac", "usb"].includes(l ?? "") ? "-charging" : "", c = N(e.config.battery_warning_threshold) ?? v(e, "ulm_card_battery_battery_level_warning") ?? 50, _ = N(e.config.battery_low_threshold) ?? v(e, "ulm_card_battery_battery_level_danger") ?? 20, g = N(e.config.battery_critical_threshold) ?? 10, [m, u, y] = [g, _, c].map((S) => Math.max(0, Math.min(100, S))).sort((S, w) => S - w), x = o === void 0 || o <= m ? ne(
    e.config.battery_critical_color ?? v(e, "ulm_card_battery_color_battery_level_danger"),
    "var(--google-red, #f44336)"
  ) : o <= u ? ne(e.config.battery_low_color, "var(--google-orange, #ff9800)") : o <= y ? ne(
    e.config.battery_warning_color ?? v(e, "ulm_card_battery_color_battery_level_warning"),
    "var(--google-yellow, #fbc02d)"
  ) : ne(
    e.config.battery_healthy_color ?? v(e, "ulm_card_battery_color_battery_level_ok"),
    "var(--google-green, #43a047)"
  ), b = v(e, "ulm_card_battery_charging_animation") === !0 && i, f = o === void 0 ? C(e.entity) : `${Math.round(o)}%`;
  return e.actionSurface(`ulm-row ulm-default-battery ${b ? "is-charging" : ""}`, d`
    ${Le(e, Zr(o, s), x, !0)}
    <span class="value-first">${Y(e, se(e.config, e.entity, e.hass), f)}</span>
  `);
}, ne = Or, cn = (e, t = !1, a = e.entity, o, r = o) => {
  const n = Array.isArray(M(a, "history")) ? M(a, "history").map(Number).filter(Number.isFinite).slice(-12) : [20, 28, 24, 42, 35, 52, 48, 63, 55, 70, 62, 78], i = Math.min(...n), l = Math.max(...n), s = n.map((g, m) => `${m / Math.max(1, n.length - 1) * 100},${36 - (g - i) / Math.max(1, l - i) * 32}`).join(" "), c = `0,40 ${s} 100,40`;
  return d`<svg class="sparkline ${t ? "is-filled" : ""}" style=${""} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
    ${t ? d`<polygon points=${c}></polygon>` : p}
    <polyline points=${s}></polyline>
  </svg>`;
}, dn = (e) => e.actionSurface("ulm-metric", d`
  <div class="metric-heading">${oe(e, e.descriptor.family === "energy" ? "mdi:flash" : "mdi:chart-line", "blue")}${Y(e, e.entity?.attributes.unit_of_measurement ? String(e.entity.attributes.unit_of_measurement) : "Current value")}<span class="metric-value">${C(e.entity)}</span></div>
  ${e.config.show_graph !== !1 ? cn(e) : p}
  ${J(e, "min_entity") || J(e, "max_entity") ? d`<div class="metric-extremes"><span>Min ${C(J(e, "min_entity"))}</span><span>Max ${C(J(e, "max_entity"))}</span></div>` : p}
`), un = (e, t, a) => {
  const o = a.navigation_path || a.nav_path;
  if (o) {
    ie(e, t, { action: "navigate", navigation_path: o }, a.entity);
    return;
  }
  const r = a.tap_action, n = r?.service ?? r?.perform_action;
  if ((r?.action === "call-service" || r?.action === "perform-action") && n) {
    const [s, c] = n.split(".", 2);
    if (s && c) {
      t.service(s, c, {
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
}, _n = (e) => {
  const t = (e.config.scene_items?.length ? e.config.scene_items : (e.config.entities?.length ? e.config.entities : e.config.entity ? [e.config.entity] : []).map((w) => ({ entity: w }))).filter((w) => w.entity), a = e.descriptor.upstreamId === "card_welcome_scenes", o = e.config.scene_buttons_only === !0;
  o && (e.presentation.rendered = !0);
  const r = e.descriptor.upstreamId === "card_scenes" && e.config.variant === "scene-grid", n = a ? 7 : r ? 5 : 6, i = a && t.length > n, l = a && e.sceneOverflowExpanded ? t : t.slice(0, n), s = e.config.collapse_entity ? e.hass.states[e.config.collapse_entity] : void 0, c = !o && (e.config.collapsed === !0 || s?.state === "on"), g = J(e, "weather_entity")?.state || "partlycloudy", m = nn[g]?.[0] ?? "mdi:weather-partly-cloudy", u = (/* @__PURE__ */ new Date()).getHours(), y = e.hass.language?.split("-")[0] ?? "en", x = {
    de: ["Hallo", "Guten Morgen", "Guten Tag", "Guten Abend"],
    en: ["Hello", "Good morning", "Good afternoon", "Good evening"],
    es: ["Hola", "Buenos días", "Buenas tardes", "Buenas noches"],
    fr: ["Bonjour", "Bonjour", "Bon après-midi", "Bonsoir"],
    nl: ["Hallo", "Goedemorgen", "Goedemiddag", "Goedenavond"]
  }, b = x[y] ?? x.en, S = `${u >= 18 ? b[3] : u >= 12 ? b[2] : u >= 5 ? b[1] : b[0]}, ${e.hass.user?.name || "Home"}!`;
  return e.actionSurface(`ulm-scenes ${a ? "welcome-scenes" : r ? "source-scene-grid" : "scene-pills"} ${e.descriptor.upstreamId === "card_scenes" ? "ulm-source-scenes" : ""} ${o ? "scene-buttons-only" : ""}`, d`
    ${a && !o ? d`
      <div class="welcome-toolbar">
        <button class="welcome-toolbar-button" aria-label="Toggle scenes" @pointerdown=${(w) => w.stopPropagation()} @click=${(w) => {
    w.stopPropagation(), e.config.collapse_entity && e.service("input_boolean", "toggle", { entity_id: e.config.collapse_entity });
  }}><ha-icon .icon=${c ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon></button>
        <span class="welcome-date"><ha-icon .icon=${m}></ha-icon>${new Intl.DateTimeFormat(e.hass.language, { month: "short", day: "numeric" }).format(/* @__PURE__ */ new Date())}</span>
        <button class="welcome-toolbar-button" aria-label="Open dashboard settings" @pointerdown=${(w) => w.stopPropagation()} @click=${(w) => ie(w, e, { action: "navigate", navigation_path: String(e.config.settings_path || "/config/dashboard") })}><ha-icon icon="mdi:cog-outline"></ha-icon></button>
      </div>
      <div class="welcome-heading">${Y(e, S)}</div>
      ${c ? p : d`
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
          ` : p}
        </div>
      `}
    ` : p}
    ${c ? p : d`<div class="scene-grid">${l.map((w) => {
    const T = e.hass.states[w.entity], B = w.active_state ? T?.state === w.active_state : w.state ? T?.state === w.state : ue.has(T?.state ?? ""), j = ne(w.color, "rgb(var(--ulm-purple))"), X = w.icon_type === "entity-picture" ? M(T, "entity_picture") : void 0;
    return d`
      <button @pointerdown=${(Z) => Z.stopPropagation()} @click=${(Z) => {
      if (Z.stopPropagation(), r && !w.tap_action) {
        const L = w.entity.split(".", 1)[0];
        e.service(
          L === "automation" ? "automation" : "homeassistant",
          L === "automation" ? "trigger" : "turn_on",
          { entity_id: w.entity }
        );
      } else
        un(Z, e, w);
    }} style=${`--item-color:${j}`} class="scene-button ${B ? "is-active" : ""}">
        <i>${X ? d`<span class="scene-entity-picture" style=${`background-image:url("${String(X)}")`}></span>` : d`<ha-icon .icon=${w.icon || T?.attributes.icon || "mdi:palette"}></ha-icon>`}</i>
        <span>${w.name || w.label || se({ entity: w.entity }, T, e.hass)}</span>
      </button>`;
  })}</div>`}
  `);
}, ma = (e) => {
  const t = v(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : M(e.entity, "entity_picture"), a = "mdi:sony-playstation", o = v(e, "ulm_card_media_player_player_controls_entity") || e.config.entity, r = o ? e.hass.states[o] : e.entity, n = o?.startsWith("media_player.") === !0, i = v(e, "ulm_card_media_player_collapsible") === !0 && (["off", "standby"].includes(e.entity?.state ?? "") || v(e, "ulm_card_media_player_idle_off") === !0 && e.entity?.state === "idle"), l = !i && (e.config.show_controls === !0 || v(e, "ulm_card_media_player_enable_controls") === !0), s = v(e, "ulm_card_media_player_enable_volume_adjust") || (M(r, "device_class") === "speaker" ? 0.05 : M(r, "device_class") === "tv" ? 0.01 : 0.025), c = Number(M(r, "volume_level") ?? 0), _ = { action: "more-info" }, g = ue.has(e.entity?.state ?? ""), m = ne(
    v(e, "ulm_card_media_player_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface(`ulm-media ${t ? "has-art" : ""} ${i ? "is-collapsed" : ""}`, d`
    ${t ? d`<span class="media-art" style=${`background-image:url("${String(t)}")`}></span>` : p}
    <div class="media-summary">
      ${Le(e, pt(e, e.descriptor.upstreamId === "custom_card_playstation" ? a : "mdi:speaker"), m, g)}
      ${Y(e, v(e, "ulm_card_media_player_more_info") === !0 ? [M(e.entity, "media_artist"), M(e.entity, "media_album_name")].filter(Boolean).join(" · ") || C(e.entity) : String(M(e.entity, "media_album_name") ?? M(e.entity, "media_artist") ?? C(e.entity)))}
    </div>
    ${v(e, "ulm_card_media_player_power_button") === !0 ? d`
      <div class="media-power">${te("Toggle power", "mdi:power", (u) => {
    u.stopPropagation(), e.service("homeassistant", "toggle", { entity_id: e.config.entity });
  })}</div>
    ` : p}
    ${n && l ? d`<div class="ulm-controls media-controls">
      ${te("Previous", "mdi:skip-previous", (u) => {
    u.stopPropagation(), e.service("media_player", "media_previous_track", { entity_id: o });
  })}
      ${te(e.entity?.state === "playing" ? "Pause" : "Play", e.entity?.state === "playing" ? "mdi:pause" : "mdi:play", (u) => {
    u.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: o });
  })}
      ${te("Next", "mdi:skip-next", (u) => {
    u.stopPropagation(), e.service("media_player", "media_next_track", { entity_id: o });
  })}
      ${te("Sources", "mdi:playlist-music", (u) => ie(u, e, _, o))}
    </div>` : p}
    ${n && !i && v(e, "ulm_card_media_player_enable_volume_slider") === !0 ? d`
      <input class="ulm-slider" type="range" min="0" max="100"
        aria-label="Volume"
        .value=${String(Math.round(c * 100))}
        @pointerdown=${(u) => u.stopPropagation()}
        @change=${(u) => e.service("media_player", "volume_set", {
    entity_id: o,
    volume_level: Number(u.target.value) / 100
  })}>
    ` : p}
    ${n && !i && v(e, "ulm_card_media_player_enable_volume_buttons") === !0 ? d`
      <div class="ulm-controls media-volume-buttons">
        ${te("Mute or unmute", "mdi:volume-mute", (u) => {
    u.stopPropagation(), e.service("media_player", "volume_mute", {
      entity_id: o,
      is_volume_muted: M(r, "is_volume_muted") !== !0
    });
  })}
        ${te("Volume down", "mdi:volume-minus", (u) => {
    u.stopPropagation(), e.service("media_player", "volume_set", {
      entity_id: o,
      volume_level: Math.max(0, c - s)
    });
  })}
        ${te("Volume up", "mdi:volume-plus", (u) => {
    u.stopPropagation(), e.service("media_player", "volume_set", {
      entity_id: o,
      volume_level: Math.min(1, c + s)
    });
  })}
      </div>
    ` : p}
  `);
}, mn = (e) => {
  const t = e.entity?.state.startsWith("armed") || e.entity?.state === "locked";
  return e.actionSurface(`ulm-security ${t ? "is-armed" : ""}`, d`
    ${oe(e, t ? "mdi:shield-lock" : "mdi:shield-off", t ? "green" : "red")}
    ${Y(e, C(e.entity))}
    ${e.config.show_controls ? d`<span class="security-status">${t ? "Secured" : "Attention"}</span>` : p}
  `);
}, pn = (e) => e.actionSurface("ulm-navigation", d`
  ${oe(e, e.descriptor.upstreamId.includes("back") ? "mdi:arrow-left" : "mdi:arrow-right", "blue")}
  ${Y(e, e.config.secondary || e.config.navigation_path || "Navigate")}
  <ha-icon icon="mdi:chevron-right"></ha-icon>
`), hn = (e, t) => {
  const a = e?.split(".", 1)[0] ?? "homeassistant";
  return a === "script" ? ["script", t === "on" ? "turn_on" : "turn_off"] : a === "fan" ? ["fan", t === "on" ? "turn_on" : "turn_off"] : a === "water_heater" ? ["water_heater", t === "on" ? "turn_on" : "turn_off"] : [a === "input_boolean" ? "input_boolean" : "homeassistant", t === "on" ? "turn_on" : "turn_off"];
}, gn = (e) => {
  const t = v(
    e,
    "ulm_custom_card_washer_power",
    "ulm_card_power_outlet_entity",
    "ulm_card_power_entity"
  ), a = e.config.entity?.split(".", 1)[0], o = t || (["switch", "input_boolean", "light", "fan", "script", "water_heater"].includes(a ?? "") ? e.config.entity : void 0), r = o ? e.hass.states[o] : void 0, n = ue.has(r?.state ?? e.entity?.state ?? ""), i = J(e, "graph_entity"), [l, s] = hn(o, n ? "off" : "on");
  return e.actionSurface(`ulm-control-card ulm-row ${n ? "is-active" : ""}`, d`
    ${oe(e, e.config.entity?.startsWith("fan.") ? "mdi:fan" : "mdi:power-socket-eu", n ? "yellow" : "grey")}
    ${Y(e, i ? `${C(e.entity)} · ${C(i)}` : C(e.entity))}
    ${o && e.config.show_controls !== !1 ? te(n ? "Turn off" : "Turn on", "mdi:power", (c) => {
    c.stopPropagation(), e.service(l, s, { entity_id: o });
  }) : p}
  `);
}, je = /* @__PURE__ */ new WeakMap(), et = /* @__PURE__ */ new WeakSet(), pa = (e, t, a, o) => {
  const r = o === "tap" ? a.tap_action ?? { action: "toggle" } : a.hold_action ?? { action: "more-info" };
  me(e, "hass-action", {
    config: { type: t.config.type, entity: a.entity, tap_action: r },
    action: "tap"
  });
}, yn = (e) => {
  const t = (e.config.room_sensors?.length ? e.config.room_sensors : (e.config.entities ?? []).map((l) => ({ entity: l }))).filter((l) => l.entity).slice(0, 4), a = e.config.label_use_temperature ?? v(e, "label_use_temperature") ?? !0, o = e.config.label_use_brightness ?? v(e, "label_use_brightness") ?? !1, r = N(M(e.entity, "brightness")), n = M(e.entity, "current_temperature") ?? M(e.entity, "temperature") ?? M(e.entity, "device_temperature") ?? e.entity?.state ?? "—", i = a ? `${String(n)}${String(M(e.entity, "unit_of_measurement") ?? "°C")}` : o && e.entity?.state === "on" && r !== void 0 ? `${Math.round(r / 2.55)}%` : C(e.entity);
  return e.actionSurface(`ulm-room ulm-source-room ${e.entity?.state === "unavailable" ? "is-unavailable" : ""}`, d`
    <div class="room-main">
      <span class="room-copy">${Y(e, i)}</span>
      <span class="ulm-icon tone-blue"><ha-icon .icon=${e.config.icon || "mdi:sofa-single"}></ha-icon></span>
      ${e.entity?.state === "unavailable" ? d`<span class="room-unavailable"><ha-icon icon="mdi:exclamation"></ha-icon></span>` : p}
    </div>
    ${t.length ? d`<div class="room-entities">${t.map((l) => {
    const s = e.hass.states[l.entity], c = s?.state === (l.active_state || "on"), _ = ne(l.color, "rgb(var(--ulm-blue))"), g = l.icon_type === "entity-picture" ? M(s, "entity_picture") : void 0;
    return d`<button
        class="metric-pill room-sensor ${c ? "is-active" : ""}"
        style=${`--item-color:${_}`}
        aria-label=${l.name || l.label || se({ entity: l.entity }, s, e.hass)}
        @pointerdown=${(m) => {
      m.stopPropagation();
      const u = m.currentTarget;
      et.delete(u), je.set(u, window.setTimeout(() => {
        et.add(u), pa(u, e, l, "hold");
      }, 500));
    }}
        @pointerup=${(m) => {
      m.stopPropagation();
      const u = m.currentTarget, y = je.get(u);
      y && window.clearTimeout(y), je.delete(u);
    }}
        @pointercancel=${(m) => {
      const u = m.currentTarget, y = je.get(u);
      y && window.clearTimeout(y), je.delete(u);
    }}
        @click=${(m) => {
      const u = m.currentTarget;
      if (et.has(u)) {
        et.delete(u), m.stopPropagation();
        return;
      }
      m.stopPropagation(), pa(u, e, l, "tap");
    }}
      >${g ? d`<span class="room-sensor-picture" style=${`background-image:url("${String(g)}")`}></span>` : d`<ha-icon .icon=${l.icon || s?.attributes.icon || "mdi:circle-small"}></ha-icon>`}<span>${l.name || l.label || C(s)}</span></button>`;
  })}</div>` : p}
  `);
}, Vt = (e) => {
  const t = Object.entries(e.config).filter(([a, o]) => typeof o == "string" && o !== e.config.entity && /(_entity|_entity_id|_sensor|_power|_status|_level|_date|_time)$/i.test(a)).map(([, a]) => a);
  return [.../* @__PURE__ */ new Set([...e.config.entities ?? [], ...t])].map((a) => e.hass.states[a]).filter((a) => !!a).slice(0, 6);
}, bn = (e, t, a = "blue") => {
  const o = Vt(e);
  return e.actionSurface("ulm-detail-card", d`
    <div class="ulm-row">
      ${oe(e, t, a)}
      ${Y(e, C(e.entity))}
    </div>
    ${o.length ? d`<div class="detail-grid">${o.map((r) => d`
      <span class="metric-pill"><ha-icon .icon=${r.attributes.icon ?? "mdi:circle-small"}></ha-icon>${C(r)}</span>
    `)}</div>` : p}
  `);
}, fn = (e) => {
  const t = Vt(e);
  return e.actionSurface("ulm-schedule-card", d`
    <div class="ulm-row">
      ${oe(e, /pollen/.test(e.descriptor.upstreamId) ? "mdi:flower-pollen" : "mdi:trash-can", "green")}
      ${Y(e, C(e.entity))}
    </div>
    <div class="schedule-list">${(t.length ? t : e.entity ? [e.entity] : []).slice(0, 4).map((a) => d`
      <span><b>${se({ entity: a.entity_id }, a, e.hass)}</b><small>${C(a)}</small></span>
    `)}</div>
  `);
}, vn = (e) => {
  const t = N(e.entity?.state), a = Vt(e);
  return e.actionSurface("ulm-device-status", d`
    <div class="ulm-row">
      ${oe(e, /printer/.test(e.descriptor.upstreamId) ? "mdi:printer" : /nas/.test(e.descriptor.upstreamId) ? "mdi:nas" : /washer/.test(e.descriptor.upstreamId) ? "mdi:washing-machine" : "mdi:devices", t !== void 0 && t < 20 ? "red" : "blue")}
      ${Y(e, C(e.entity))}
      ${t !== void 0 ? d`<b class="device-value">${Math.round(t)}${String(e.entity?.attributes.unit_of_measurement ?? "")}</b>` : p}
    </div>
    ${t !== void 0 ? d`<span class="device-progress"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>` : p}
    ${a.length ? d`<div class="detail-grid">${a.map((o) => d`<span class="metric-pill">${C(o)}</span>`)}</div>` : p}
  `);
}, wn = (e) => {
  const t = J(e, "datetime_entity");
  return e.actionSurface(`ulm-control-card ulm-row ${ue.has(e.entity?.state ?? "") ? "is-active" : ""}`, d`
    ${oe(e, "mdi:alarm", ue.has(e.entity?.state ?? "") ? "yellow" : "grey")}
    ${Y(e, C(t || e.entity))}
    ${e.config.show_controls !== !1 ? te(ue.has(e.entity?.state ?? "") ? "Disable alarm" : "Enable alarm", "mdi:power", (a) => {
    a.stopPropagation(), e.service("input_boolean", ue.has(e.entity?.state ?? "") ? "turn_off" : "turn_on", { entity_id: e.config.entity });
  }) : p}
  `);
}, R = (e, ...t) => {
  const a = v(e, ...t), o = typeof a == "string" ? a : a && typeof a == "object" && "entity_id" in a && typeof a.entity_id == "string" ? a.entity_id : void 0;
  return o ? e.hass.states[o] : void 0;
}, $n = (e) => {
  const t = Se(e.config).filter((l) => l.enabled !== !1 && l.entity), a = /* @__PURE__ */ new Set([
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
    const c = e.hass.states[l]?.state?.trim();
    if (!c || a.has(c.toLowerCase())) return;
    const _ = c.replaceAll("_", " ").replace(/\s+/g, " ");
    return _.charAt(0).toLocaleUpperCase(e.hass.language) + _.slice(1);
  }, r = o(e.config.today_entity, e.config.show_today), n = o(e.config.tomorrow_entity, e.config.show_tomorrow), i = (l) => {
    if (!l || ["unknown", "unavailable", "none", "geen"].includes(l.state.toLowerCase())) return "—";
    if (l.entity_id.startsWith("calendar.")) {
      const s = M(l, "start_time") ?? M(l, "start") ?? M(l, "end_time");
      if (typeof s == "string") {
        const c = new Date(s);
        if (!Number.isNaN(c.getTime()))
          return new Intl.DateTimeFormat(e.hass.language, { day: "2-digit", month: "2-digit", year: "numeric" }).format(c);
      }
    }
    return l.state;
  };
  return e.actionSurface("custom-waste-card", d`
    <div class="custom-card-heading">
      ${oe(e, "mdi:trash-can-outline", "green")}
      ${Y(e, v(e, "ulm_volgende_ophaling") || [r ? `Today: ${r}` : "", n ? `Tomorrow: ${n}` : ""].filter(Boolean).join(" · ") || void 0, "Next collections")}
    </div>
    <div class="waste-grid">${t.map((l) => {
    const s = l.entity ? e.hass.states[l.entity] : void 0;
    return d`<span class="waste-row" style=${`--waste-color:${ne(l.color, "rgb(var(--rgb-green, 76, 175, 80))")}`}>
        <ha-icon .icon=${l.icon || "mdi:trash-can"}></ha-icon>
        <b>${l.label || s?.attributes.friendly_name || l.entity}</b>
        <small>${i(s)}</small>
      </span>`;
  })}</div>
  `);
}, xn = (e) => {
  const t = R(e, "ulm_card_alarm_time_datetime") ?? J(e, "datetime_entity"), a = N(v(e, "ulm_card_alarm_time_step")) ?? 15, o = t?.state || "00:00:00", [r, n] = o.split(":").map(Number), i = (g) => {
    const m = ((r || 0) * 60 + (n || 0) + g + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: t?.entity_id,
      time: `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}:00`
    });
  }, l = !t || ["unknown", "unavailable"].includes(t.state.toLowerCase()), s = v(e, "ulm_card_alarm_time_collapse") === !0 && !ue.has(e.entity?.state ?? ""), c = ue.has(e.entity?.state ?? ""), _ = ne(
    v(e, "ulm_card_alarm_time_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface(`custom-alarm-time ${v(e, "ulm_card_alarm_time_horizontal") ? "is-horizontal" : ""}`, d`
    <div class="custom-card-heading">
      ${Le(e, v(e, "ulm_card_alarm_time_icon") || "mdi:alarm", _, c)}
      ${Y(e, C(e.entity))}
    </div>
    ${s ? p : d`<div class="alarm-time-controls">
      ${te(`Earlier by ${a} minutes`, "mdi:minus", (g) => {
    g.stopPropagation(), i(-a);
  }, l)}
      <b>${o.slice(0, 5)}</b>
      ${te(`Later by ${a} minutes`, "mdi:plus", (g) => {
    g.stopPropagation(), i(a);
  }, l)}
    </div>`}
  `);
}, ha = (e, t) => {
  const a = M(t, "entity_id");
  return Array.isArray(a) ? a.map(String).map((o) => e.hass.states[o]).filter((o) => !!o) : t ? [t] : [];
}, Sn = (e) => {
  const t = (b) => R(e, b), a = t("temperature"), o = t("humidity"), r = {
    doors: t("group_doors"),
    windows: t("group_windows"),
    motions: t("group_motions"),
    water: t("group_water"),
    lights: t("group_lights"),
    shutters: t("group_windows_shutters"),
    outlets: t("group_outlets"),
    tv: t("group_tv")
  }, n = Object.values(r).flatMap((b) => ha(e, b)).filter((b) => (N(M(b, "battery")) ?? 101) <= 20), i = (b) => ha(e, b).filter((f) => f.state === "on" || f.state === "open").length, l = (b) => !b || ["unavailable", "unknown"].includes(b.state), s = (b) => {
    const f = e.hass.states[b], S = M(f, "entity_id"), T = (Array.isArray(S) ? S.map(String) : [b]).filter((B) => l(e.hass.states[B])).length;
    return Math.max(l(f) ? 1 : 0, T);
  }, c = (b) => ({
    type: e.config.type,
    entity: b,
    tap_action: { action: "more-info" }
  }), _ = (b, f) => ({
    ...c(f),
    tap_action: e.config[`${b}_tap_action`] ?? { action: "more-info" },
    hold_action: e.config[`${b}_hold_action`] ?? { action: "more-info" },
    double_tap_action: e.config[`${b}_double_tap_action`] ?? { action: "toggle" }
  }), g = e.config.temperature ? a : o, m = {
    ...e,
    entity: g,
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
  }, u = [
    [e.config.group_doors, r.doors, "Doors", "mdi:door-open"],
    [e.config.group_windows, r.windows, "Windows", "mdi:window-open-variant"],
    [e.config.group_motions, r.motions, "Motion", "mdi:motion-sensor"],
    [e.config.group_water, r.water, "Water", "mdi:water"]
  ], y = [
    ["lights", e.config.group_lights, r.lights, "Lights", "mdi:lightbulb-group"],
    ["shutters", e.config.group_windows_shutters, r.shutters, "Shutters", "mdi:window-shutter"],
    ["outlets", e.config.group_outlets, r.outlets, "Outlets", "mdi:power-plug"],
    ["tv", e.config.group_tv, r.tv, "Television", "mdi:television"]
  ], x = [...u.map(([b]) => b), ...y.map(([, b]) => b)].reduce((b, f) => b + (f ? s(f) : 0), 0);
  return e.actionSurface("custom-room-view", d`
    ${Je(e, C(e.entity), se(e.config, e.entity, e.hass))}
    ${e.config.temperature || e.config.humidity ? d`
      <section class="room-view-section" aria-label="Climate">
        <h3>Climate</h3>
        <button class="room-view-summary" aria-label="Climate · More information"
          ${Qe(c(e.config.temperature ?? e.config.humidity))}>
          ${Le(m, g?.attributes.icon || "mdi:thermometer", "var(--primary-color)", !1, "room-view-icon")}
          ${Y(
    m,
    e.config.climate_secondary ?? (e.config.humidity && e.config.temperature ? C(o) : void 0)
  )}
        </button>
      </section>` : p}
    <section class="room-view-section" aria-label="Sensor status">
      <h3>Sensor status <small>Indicators · Tap for details</small></h3>
      <div class="room-view-status">
        ${u.map(([b, f, S, w]) => b ? d`
          <button class="room-view-indicator ${i(f) ? "is-active" : ""} ${s(b) ? "is-unavailable" : ""}"
            aria-label=${`${S}: ${s(b) ? "Unavailable" : C(f)} · More information`}
            ${Qe(c(b))}>
            <ha-icon .icon=${w}></ha-icon>
            <span>${S}<small>${s(b) ? `${s(b)} unavailable` : i(f) ? `${i(f)} active` : C(f)}</small></span>
            ${i(f) > 1 ? d`<i>${i(f)}</i>` : p}
          </button>` : p)}
        ${u.some(([b]) => b) ? p : d`<span class="room-view-empty">No sensors configured</span>`}
        ${n.length ? d`
          <button class="room-view-indicator is-unavailable" aria-label="Low batteries"
            ${Qe(c(n[0].entity_id))}>
            <ha-icon icon="mdi:battery-20"></ha-icon><span>Low batteries<small>${n.length}</small></span>
          </button>` : p}
        ${x ? d`<span class="room-view-warning" role="status"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${x} unavailable</span>` : p}
      </div>
    </section>
    <section class="room-view-section" aria-label="Device controls">
      <h3>Device controls <small>Buttons · Configurable actions</small></h3>
      <div class="room-view-actions">
        ${y.map(([b, f, S, w, T]) => f ? d`
          <button class=${ue.has(S?.state ?? "") ? "is-active" : ""} aria-label=${w}
            ?disabled=${l(S)} ${Qe(_(b, f))}>
            <ha-icon .icon=${l(S) ? "mdi:exclamation-thick" : T}></ha-icon>
            <span>${w}<small>${l(S) ? "Unavailable" : C(S)}</small></span>
            ${i(S) ? d`<i>${i(S)}</i>` : p}
          </button>` : p)}
        ${y.some(([, b]) => b) ? p : d`<span class="room-view-empty">No devices configured</span>`}
      </div>
    </section>
  `);
}, kn = (e) => {
  const t = R(e, "ulm_card_welcome_collapse"), a = R(e, "ulm_weather"), o = t?.state === "on", r = Array.from({ length: 5 }, (n, i) => i + 1).map((n) => ({
    nav: v(e, `nav_${n}`),
    icon: v(e, `icon_${n}`) || "mdi:circle",
    name: v(e, `name_${n}`) || `Item ${n}`,
    color: v(e, `color_${n}`) || "blue"
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
    a && ie(n, e, { action: "more-info" }, a.entity_id);
  }}>
        <ha-icon icon="mdi:thermometer"></ha-icon>
      </button>
      <button aria-label="Dashboard settings" @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => ie(n, e, { action: "navigate", navigation_path: "/config/dashboard" })}>
        <ha-icon icon="mdi:cog-outline"></ha-icon>
      </button>
    </div>
    <div class="welcome-greeting">${Y(e, `Good ${(/* @__PURE__ */ new Date()).getHours() < 12 ? "morning" : (/* @__PURE__ */ new Date()).getHours() < 18 ? "afternoon" : "evening"}`)}</div>
    ${o ? p : d`<div class="welcome-items">${r.map((n) => d`
      <button class="tone-${n.color}" aria-label=${n.name}
        @pointerdown=${(i) => i.stopPropagation()}
        @click=${(i) => ie(i, e, { action: "navigate", navigation_path: n.nav })}>
        <i><ha-icon .icon=${n.icon}></ha-icon></i><small>${n.name}</small>
      </button>
    `)}</div>`}
  `);
}, Mn = (e) => {
  const t = R(e, "ulm_custom_card_room_overview_light_entity"), a = R(e, "ulm_custom_card_room_overview_climate_entity"), o = R(e, "ulm_custom_card_room_overview_cover_entity"), r = t?.state === "on", n = N(M(t, "brightness")), i = e.config.secondary || (t ? r && n ? `${Math.round(n / 2.55)}%` : C(t) : C(e.entity)), l = M(t, "rgb_color"), s = v(e, "ulm_card_dynamic_color") === !0 && r && Array.isArray(l), c = (g, m) => {
    m && ie(g, e, { action: "toggle" }, m.entity_id);
  }, _ = (g, m) => {
    const u = m === "light" ? v(e, r ? "ulm_card_room_overview_light_icon_on" : "ulm_card_room_overview_light_icon_off") || (r ? "mdi:lightbulb" : "mdi:lightbulb-off") : m === "cover" ? v(e, g.state === "closed" ? "ulm_card_room_overview_cover_icon_closed" : "ulm_card_room_overview_cover_icon_open") || (g.state === "closed" ? "mdi:roller-shade-closed" : "mdi:blinds-open") : { auto: "mdi:autorenew", cool: "mdi:snowflake", heat: "mdi:fire", dry: "mdi:water", heat_cool: "mdi:sun-snowflake", fan_only: "mdi:fan", off: "mdi:snowflake-off" }[g.state] ?? "mdi:thermostat";
    return d`<button class="room-overview-control ${m} state-${g.state}" aria-label=${se({ entity: g.entity_id }, g, e.hass)}
      ?disabled=${g.state === "unavailable"} @pointerdown=${(y) => y.stopPropagation()} @click=${(y) => c(y, g)}>
      <ha-icon .icon=${u}></ha-icon>
    </button>`;
  };
  return e.actionSurface(`custom-room-overview ${r ? "light-on" : ""} ${s ? "dynamic-color" : ""}`, d`
    <div class="room-overview-main" style=${s ? `--room-rgb:${l.slice(0, 3).join(",")};` : ""}>
      ${oe(e, "mdi:sofa", r ? "yellow" : "grey")}
      ${Y(e, i)}
    </div>
    <div class="room-overview-controls">
      ${t ? _(t, "light") : p}
      ${o ? _(o, "cover") : a ? _(a, "climate") : p}
    </div>
  `);
}, An = (e) => {
  const t = R(e, "washer_power_entity") ?? R(e, "power_entity") ?? R(e, "ulm_custom_card_washer_power"), a = R(e, "ulm_custom_card_washer_machine_state") ?? e.entity, o = R(e, "ulm_custom_card_washer_job_progress"), r = R(e, "program_stage_entity") ?? R(e, "ulm_custom_card_washer_job_state") ?? a, n = R(e, "ulm_custom_card_washer_remote_control"), i = R(e, "ulm_custom_card_washer_delayed_start"), l = R(e, "ulm_custom_card_washer_delayed_starttime"), s = R(e, "door_entity"), c = R(e, "finished_entity"), _ = v(e, "ulm_custom_card_washer_machine_stop_state") ?? "stop", g = t ? !["off", "unavailable", "unknown", "0"].includes(t.state.toLowerCase()) : a ? !["off", "unavailable", "unknown"].includes(a.state.toLowerCase()) : !0, m = !a || a.state === _ || a.state === "off", u = ["true", "on", "enabled"].includes(n?.state.toLowerCase() ?? ""), y = i?.state === "on", x = Math.max(0, Math.min(100, N(o?.state) ?? 0)), b = v(
    e,
    "ulm_custom_card_washer_job_states"
  ), f = Object.values(b ?? {
    state1: { name: "weightSensing", icon: "mdi:scale" },
    state2: { name: "wash", icon: "mdi:waves" },
    state3: { name: "rinse", icon: "mdi:water" },
    state4: { name: "spin", icon: "mdi:fan" }
  }).filter((O) => O.name && O.icon).slice(0, 5), S = f.findIndex((O) => O.name?.toLowerCase() === r?.state.toLowerCase()), w = g ? m ? u && y ? v(e, "ulm_custom_card_washer_label_configuring") ?? "configure" : v(e, "ulm_custom_card_washer_label_idle") ?? "idle" : v(e, "ulm_custom_card_washer_label_running") ?? "run" : v(e, "ulm_custom_card_washer_label_idle") ?? "idle", T = (O) => v(e, O) ?? { action: "none" }, B = (O, Q) => ie(O, e, Q, typeof Q.entity == "string" ? Q.entity : e.config.entity), j = l?.state.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)?.slice(1).map(Number), X = (O, Q) => {
    if (O.stopPropagation(), !l || !j) return;
    const H = ((j[0] * 60 + j[1] + Q) % 1440 + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: l.entity_id,
      time: `${String(Math.floor(H / 60)).padStart(2, "0")}:${String(H % 60).padStart(2, "0")}:00`
    });
  }, Z = T(m ? "ulm_custom_card_washer_start_action" : "ulm_custom_card_washer_pause_action"), L = T("ulm_custom_card_washer_stop_action");
  return e.actionSurface("custom-washer", d`
    <div class="custom-card-heading washer-heading">
      ${oe(e, "mdi:washing-machine", g ? "blue" : "grey")}
      ${Y(e, w)}
      ${t ? d`<b class="washer-power">${C(t)}</b>` : p}
    </div>
    ${g && f.length ? d`
      <div class="washer-stages" style=${`--washer-stage-count:${f.length}`}>
        ${f.map((O, Q) => d`
          <span class=${S === Q ? "is-active" : ""} title=${O.name ?? ""}>
            <ha-icon .icon=${O.icon}></ha-icon>
          </span>
        `)}
      </div>
    ` : p}
    ${g && o ? d`
      <div class="washer-progress">
        <span style=${`width:${x}%`}></span>
        <b>${Math.round(x)}%</b>
      </div>
    ` : p}
    ${g && u ? d`
      <div class="washer-controls">
        ${te(
    m ? "Start washer" : "Pause washer",
    m ? "mdi:play" : "mdi:pause",
    (O) => B(O, Z),
    Z.action === "none"
  )}
        ${te(
    "Stop washer",
    "mdi:stop",
    (O) => B(O, L),
    m || L.action === "none"
  )}
        ${i ? te(
    y ? "Disable delayed start" : "Enable delayed start",
    "mdi:alarm",
    (O) => ie(O, e, { action: "toggle" }, i.entity_id),
    !m
  ) : p}
      </div>
    ` : p}
    ${g && u && y && l ? d`
      <div class="washer-delay-controls">
        ${te("Move delayed start 15 minutes earlier", "mdi:arrow-down", (O) => X(O, -15))}
        <button class="washer-delay-time" aria-label="Move delayed start 1 minute later"
          @pointerdown=${(O) => O.stopPropagation()}
          @click=${(O) => X(O, 1)}>${l.state}</button>
        ${te("Move delayed start 15 minutes later", "mdi:arrow-up", (O) => X(O, 15))}
      </div>
    ` : p}
    ${s || c || n ? d`
      <div class="washer-status">
        ${s ? d`<span><ha-icon icon="mdi:door"></ha-icon>${C(s)}</span>` : p}
        ${c ? d`<span><ha-icon icon="mdi:check-circle"></ha-icon>${C(c)}</span>` : p}
        ${n ? d`<span><ha-icon icon="mdi:remote"></ha-icon>${C(n)}</span>` : p}
      </div>
    ` : p}
  `);
}, ge = (e, t, a) => Te(e, t) ?? Object.values(e.hass.states).find((o) => String(M(o, "metric") ?? "").toLowerCase() === a && ["moon", "sky"].includes(String(M(o, "body") ?? "").toLowerCase())), ga = (e, t, a) => {
  const o = e === void 0 ? 180 : (e % 360 + 360) % 360, r = Math.max(-90, Math.min(90, t ?? 0)), n = o / 360 * 100, i = 62 / 90 * 100, l = r >= 0 ? i - r / 90 * (i - 4) : i + Math.abs(r) / 90 * (96 - i);
  return `--${a}-x:${n.toFixed(2)}%;--${a}-y:${l.toFixed(2)}%`;
}, ya = (e) => ({
  new_moon: "mdi:moon-new",
  waxing_crescent: "mdi:moon-waxing-crescent",
  first_quarter: "mdi:moon-first-quarter",
  waxing_gibbous: "mdi:moon-waxing-gibbous",
  full_moon: "mdi:moon-full",
  waning_gibbous: "mdi:moon-waning-gibbous",
  last_quarter: "mdi:moon-last-quarter",
  waning_crescent: "mdi:moon-waning-crescent"
})[e] ?? "mdi:moon-waning-crescent", In = (e) => {
  const t = M(e.entity, "next_rising"), a = M(e.entity, "next_setting"), o = M(e.entity, "next_dawn") ?? t, r = M(e.entity, "next_noon"), n = M(e.entity, "next_dusk") ?? a, i = v(e, "language") || e.hass.language || "en", l = v(e, "timeFormat") === "12h", s = (H) => {
    const ee = new Date(String(H ?? ""));
    return Number.isNaN(ee.getTime()) ? "—" : new Intl.DateTimeFormat(i, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: l
    }).format(ee);
  }, c = N(M(e.entity, "elevation")), _ = N(M(e.entity, "azimuth")), g = v(e, "title"), m = Te(e, "moon_entity") ?? e.hass.states["sensor.moon"] ?? Object.values(e.hass.states).find((H) => String(M(H, "device_class") ?? "") === "enum" && `${H.entity_id} ${String(M(H, "friendly_name") ?? "")}`.toLowerCase().includes("moon")), u = ge(e, "moon_altitude_entity", "altitude"), y = ge(e, "moon_azimuth_entity", "azimuth"), x = Te(e, "moon_rising_entity") ?? ge(e, "moon_rising_entity", "next_rising") ?? ge(e, "moon_rising_entity", "moonrise"), b = Te(e, "moon_setting_entity") ?? ge(e, "moon_setting_entity", "next_setting") ?? ge(e, "moon_setting_entity", "moonset"), f = ge(e, "moon_next_full_moon_entity", "next_full_moon"), S = ge(e, "moon_next_new_moon_entity", "next_new_moon"), w = ge(e, "moon_above_horizon_entity", "is_moon_above_horizon"), T = [
    m,
    u,
    y,
    x,
    b,
    f,
    S,
    w
  ], B = v(e, "showMoon") !== !1 && T.some(Boolean), j = (H, ee = 2) => {
    if (!H || ["unknown", "unavailable"].includes(H.state)) return "—";
    const ae = N(H.state);
    if (ae === void 0) return C(H);
    const le = String(M(H, "unit_of_measurement") ?? "");
    return `${new Intl.NumberFormat(i, { maximumFractionDigits: ee }).format(ae)}${le ? ` ${le}` : ""}`;
  }, X = (H) => {
    if (!H || ["unknown", "unavailable"].includes(H.state)) return "—";
    const ee = new Date(H.state);
    return Number.isNaN(ee.getTime()) ? C(H) : new Intl.DateTimeFormat(i, { day: "numeric", month: "short", year: "numeric" }).format(ee);
  }, Z = m?.state ?? "unknown", L = N(u?.state), O = N(y?.state), Q = w ? ["on", "true", "above_horizon"].includes(w.state.toLowerCase()) : (L ?? -1) >= 0;
  return e.actionSurface(`custom-sun-card ${v(e, "darkMode") ? "is-dark" : ""}`, d`
    ${g ? d`<b class="sun-title">${g}</b>` : p}
    <div class="astronomy-times">
      <span><small>Sunrise</small><b>${s(t)}</b></span>
      <span><small>Moonrise</small><b>${s(x?.state)}</b></span>
      <span><small>Moonset</small><b>${s(b?.state)}</b></span>
      <span><small>Sunset</small><b>${s(a)}</b></span>
    </div>
    <div class="sun-arc astronomy-arc">
      <svg viewBox="0 0 300 90" preserveAspectRatio="none"><path class="sun-night" d="M0,62 Q60,115 105,62"></path><path class="sun-day" d="M0,62 Q150,-45 300,62"></path><line x1="0" y1="62" x2="300" y2="62"></line></svg>
      <span class="sun-marker" style=${ga(_, c, "sun")}></span>
      ${B && (u || y) ? d`
        <span class=${`moon-marker astronomy-moon-marker ${Q ? "is-above" : "is-below"}`}
          style=${ga(O, L, "moon")}>
          <ha-icon .icon=${ya(Z)}></ha-icon>
        </span>
      ` : p}
    </div>
    <div class="sun-footer"><span><small>Dawn</small><b>${s(o)}</b></span><span><small>Solar noon</small><b>${s(r)}</b></span><span><small>Dusk</small><b>${s(n)}</b></span></div>
    <div class="astronomy-position-rows">
      <div>
        <b>Sun:</b>
        <span>Azimuth <strong>${_ ?? "—"}°</strong></span>
        <span>Elevation <strong>${c ?? "—"}°</strong></span>
      </div>
      ${B ? d`
        <div>
          <b>Moon:</b>
          <span>Azimuth <strong>${j(y)}</strong></span>
          <span>Elevation <strong>${j(u)}</strong></span>
        </div>
      ` : p}
    </div>
    ${B ? d`
      <section class="moon-section">
        <div class="moon-heading">
          <span class="moon-symbol"><ha-icon .icon=${ya(Z)}></ha-icon></span>
          <span class="moon-copy">
            <b>Moon</b>
            <small>${C(m)} · ${Q ? "Above horizon" : "Below horizon"}</small>
          </span>
        </div>
        <div class="moon-metrics">
          ${f ? d`<span class="moon-metric"><ha-icon .icon=${"mdi:moon-full"}></ha-icon><span><small>Next full Moon</small><b>${X(f)}</b></span></span>` : p}
          ${S ? d`<span class="moon-metric"><ha-icon .icon=${"mdi:moon-new"}></ha-icon><span><small>Next new Moon</small><b>${X(S)}</b></span></span>` : p}
        </div>
      </section>
    ` : p}
  `);
}, Cn = (e) => {
  const t = !!(e.entity && !["unavailable", "unknown"].includes(e.entity.state)), o = (t ? e.entity.state : "00:00:00").split(" ").at(-1) || "00:00:00", [r, n] = o.split(":").map(Number), i = (l) => {
    const s = ((r || 0) * 60 + (n || 0) + l + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: e.config.entity,
      time: `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:00`
    });
  };
  return e.actionSurface("custom-input-datetime", d`
    <div class="custom-card-heading">${oe(e, "mdi:calendar-clock", "green")}${Y(e, C(e.entity))}</div>
    <div class="input-datetime-controls">
      ${te("15 minutes earlier", "mdi:arrow-down", (l) => {
    l.stopPropagation(), i(-15);
  }, !t)}
      ${rn(
    "One minute later; hold for one minute earlier",
    d`<b>${t ? o.slice(0, 5) : "Unavailable"}</b>`,
    () => i(1),
    () => i(-1),
    !t
  )}
      ${te("15 minutes later", "mdi:arrow-up", (l) => {
    l.stopPropagation(), i(15);
  }, !t)}
    </div>
  `);
}, Pn = (e) => {
  const t = [1, 2, 3, 4].map((i) => R(e, `ulm_custom_card_weather_metrics_entity_${i}`) ?? (e.config.entities?.[i - 1] ? e.hass.states[e.config.entities[i - 1]] : void 0)), a = J(e, "temperature_entity"), o = J(e, "date_entity") ?? R(e, "ulm_custom_card_weather_metrics_date"), r = e.entity?.state || "unknown", n = {
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
      <b class="weather-date">${n[r] || "❔"} ${o ? C(o) : "Date unavailable"}</b>
      <strong>${a ? C(a) : `${M(e.entity, "temperature") ?? "—"}°`}</strong>
    </div>
    <div class="metrics-four">${t.map((i, l) => d`
      <button ?disabled=${!i} @pointerdown=${(s) => s.stopPropagation()}
        @click=${(s) => i && ie(s, e, { action: "more-info" }, i.entity_id)}>
        <b>${C(i)}</b>
        <small>${v(e, `ulm_custom_card_weather_metrics_name_${l + 1}`) || (i ? se({ entity: i.entity_id }, i, e.hass) : `Weather ${l + 1}`)}</small>
      </button>
    `)}</div>
  `);
}, En = (e) => {
  const t = e.entity?.state, a = !e.entity || t === "unavailable" || t === "unknown", o = e.config.collapsible_controls === !0 && (a || t === "off"), r = (A) => A.stopPropagation(), n = M(e.entity, "supported_features"), i = (A) => n === void 0 || (Number(n) & A) !== 0, l = e.config.volume_controls ?? ["volume_buttons"], s = e.config.media_controls ?? ["play_pause_stop"], c = (A, E = {}) => {
    a || e.service("media_player", A, { entity_id: e.config.entity, ...E });
  }, _ = (A, E, $, G) => te(A, E, (I) => {
    r(I), c($, G);
  }, a), g = t === "off" || a, m = s.includes("on_off") && i(g ? de.turnOn : de.turnOff) ? _(g ? "Turn on" : "Turn off", "mdi:power", g ? "turn_on" : "turn_off") : p, u = t === "playing", y = n === void 0 ? "media_play_pause" : u && i(de.pause) ? "media_pause" : !u && i(de.play) ? "media_play" : i(de.stop) ? "media_stop" : void 0, x = s.includes("play_pause_stop") && y ? _(
    y === "media_stop" ? "Stop" : n === void 0 ? "Play or pause" : u ? "Pause" : "Play",
    y === "media_stop" ? "mdi:stop" : u ? "mdi:pause" : "mdi:play",
    y
  ) : p, b = l.includes("volume_buttons") && i(de.volumeStep | de.volumeSet), f = String(M(e.entity, "repeat") ?? "off"), S = f === "off" ? "all" : f === "all" ? "one" : "off", w = M(e.entity, "is_volume_muted") === !0, T = v(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : M(e.entity, "entity_picture"), B = Math.round(Math.max(0, Math.min(1, N(M(e.entity, "volume_level")) ?? 0)) * 100), j = M(e.entity, "source"), X = ["idle", "paused", "unavailable", "unknown"].includes(t ?? "") ? C(e.entity) : `${j ? String(j) : C(e.entity)} • ${B}%`, Z = e.config.use_media_info ? M(e.entity, "media_title") : void 0, L = e.config.use_media_info ? M(e.entity, "media_artist") : void 0, O = e.config.show_volume_level === void 0 && !e.config.use_media_info ? X : [
    L ? String(L) : Z ? void 0 : j ? String(j) : C(e.entity),
    e.config.show_volume_level !== !1 ? `${B}%` : void 0
  ].filter(Boolean).join(" • "), Q = zt(e.hass, e.config.entity, e.config), H = Ta.flatMap((A) => {
    const E = Q[A.configKey], $ = E ? e.hass.states[E] : void 0;
    return $ ? [{ control: A, entity: $ }] : [];
  }), ee = Oa.flatMap((A) => {
    const E = Q[A.configKey], $ = E ? e.hass.states[E] : void 0;
    return $ ? [{ control: A, entity: $ }] : [];
  }), ae = (e.config.shortcuts?.buttons ?? []).filter((A) => typeof A.id == "string" && A.id.trim().length > 0), le = Math.min(8, Math.max(1, Math.round(e.config.shortcuts?.columns ?? 4))), k = v(e, "sonos_details_always_visible") === !0, V = d`
    ${H.length ? d`<div class="sonos-switches">
      ${H.map(({ control: A, entity: E }) => d`
        <button class=${E.state === "on" ? "is-active" : ""} aria-pressed=${E.state === "on"}
          ?disabled=${a || ["unavailable", "unknown"].includes(E.state)}
          @click=${($) => {
    $.stopPropagation(), !a && !["unavailable", "unknown"].includes(E.state) && e.service("homeassistant", "toggle", { entity_id: E.entity_id });
  }}>
          <ha-icon .icon=${A.icon}></ha-icon>
          <span>${A.label}</span>
        </button>
      `)}
    </div>` : p}
    ${ee.length ? d`<div class="sonos-sliders">
      ${ee.map(({ control: A, entity: E }) => {
    const $ = N(E.state) ?? 0, G = N(M(E, "min")) ?? -100, I = N(M(E, "max")) ?? 100, W = N(M(E, "step")) ?? 1;
    return d`
          <label>
            <ha-icon .icon=${A.icon}></ha-icon>
            <span>${A.label}</span>
            <input type="range" min=${G} max=${I} step=${W} .value=${String($)}
              ?disabled=${a || ["unavailable", "unknown"].includes(E.state)}
              aria-label=${A.label}
              @change=${(ce) => {
      ce.stopPropagation(), !(a || ["unavailable", "unknown"].includes(E.state)) && e.service("number", "set_value", {
        entity_id: E.entity_id,
        value: Number(ce.currentTarget.value)
      });
    }}>
            <output>${$}</output>
          </label>
        `;
  })}
    </div>` : p}
  `;
  return e.actionSurface(`custom-sonos ${T ? "has-art" : ""}`, d`
    ${T ? d`<span class="media-art" style=${`background-image:url("${String(T)}")`}></span>` : p}
    <div class="custom-card-heading">
      ${oe(e, "mdi:speaker", e.entity?.state === "playing" ? "green" : "grey")}
      ${Y(e, O, Z && !e.config.name ? String(Z) : void 0)}
    </div>
    <div class="sonos-controls"
      @pointerdown=${r} @pointerup=${r} @pointercancel=${r}
      @click=${r} @dblclick=${r} @keydown=${r} @keyup=${r}>
      ${m}
      ${o ? p : d`
        ${l.includes("volume_mute") && i(de.volumeMute) ? d`<button class="ulm-control" aria-label=${w ? "Unmute" : "Mute"} aria-pressed=${w}
              ?disabled=${a} @click=${() => c("volume_mute", { is_volume_muted: !w })}>
              <ha-icon .icon=${w ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon>
            </button>` : p}
        ${b ? _("Volume down", "mdi:volume-minus", "volume_down") : p}
        ${s.includes("shuffle") && i(de.shuffle) ? d`<button class="ulm-control" aria-label="Shuffle" aria-pressed=${M(e.entity, "shuffle") === !0}
              ?disabled=${a} @click=${() => c("shuffle_set", { shuffle: M(e.entity, "shuffle") !== !0 })}>
              <ha-icon icon="mdi:shuffle"></ha-icon>
            </button>` : p}
        ${s.includes("previous") && i(de.previous) ? _("Previous track", "mdi:skip-previous", "media_previous_track") : p}
        ${x}
        ${s.includes("next") && i(de.next) ? _("Next track", "mdi:skip-next", "media_next_track") : p}
        ${s.includes("repeat") && i(de.repeat) ? _(
    `Repeat: ${f}`,
    f === "one" ? "mdi:repeat-once" : f === "off" ? "mdi:repeat-off" : "mdi:repeat",
    "repeat_set",
    { repeat: S }
  ) : p}
        ${b ? _("Volume up", "mdi:volume-plus", "volume_up") : p}
        ${l.includes("volume_set") && i(de.volumeSet) ? d`<label class="sonos-volume">
              <input type="range" min="0" max="100" step="1" .value=${String(B)}
                aria-label="Volume level" ?disabled=${a}
                @change=${(A) => {
    r(A), c("volume_set", {
      volume_level: Math.max(0, Math.min(100, Number(A.currentTarget.value))) / 100
    });
  }}>
              <output>${B}%</output>
            </label>` : p}
      `}
    </div>
    ${!o && (H.length || ee.length) ? d`
      ${k ? d`<div class="sonos-details sonos-details-always-visible"
            @pointerdown=${(A) => A.stopPropagation()}
            @click=${r} @dblclick=${r} @keydown=${r} @keyup=${r}
            @pointerup=${r} @pointercancel=${r}>
            ${V}
          </div>` : d`<details class="sonos-details" @pointerdown=${(A) => A.stopPropagation()}
            @click=${r} @dblclick=${r} @keydown=${r} @keyup=${r}
            @pointerup=${r} @pointercancel=${r}>
            <summary>
              <span>More details</span>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </summary>
            ${V}
          </details>`}
    ` : p}
    ${!o && ae.length ? d`
      <div class="sonos-shortcuts" style=${`--sonos-shortcut-columns:${le}`}
        @pointerdown=${r} @pointerup=${r} @pointercancel=${r}
        @click=${r} @dblclick=${r} @keydown=${r} @keyup=${r}>
        ${ae.map((A, E) => d`
          <button
            aria-label=${A.name || `Play shortcut ${E + 1}`}
            title=${A.name || A.id || ""}
            ?disabled=${a}
            @click=${($) => {
    $.stopPropagation(), !a && e.service("media_player", "play_media", {
      entity_id: e.config.entity,
      media_content_type: A.type || "playlist",
      media_content_id: A.id
    });
  }}>
            <ha-icon .icon=${A.icon || "mdi:playlist-music"}></ha-icon>
            ${A.name ? d`<span>${A.name}</span>` : p}
          </button>
        `)}
      </div>
    ` : p}
  `);
}, zn = (e) => {
  const t = [
    J(e, "black_entity"),
    J(e, "yellow_entity"),
    J(e, "magenta_entity"),
    J(e, "cyan_entity")
  ], a = ["#111", "#faff00", "#f800ff", "#00ffff"];
  return e.actionSurface("custom-printer", d`
    <div class="custom-card-heading">
      ${oe(e, "mdi:printer", e.entity?.state === "idle" ? "grey" : "blue")}
      ${Y(e, C(e.entity))}
    </div>
    <div class="toner-bars">${t.map((o, r) => {
    if (!o) return p;
    const n = Math.max(0, Math.min(100, N(o.state) ?? 0));
    return d`<span style=${`--toner:${a[r]};--level:${n}%`}><i><em></em><b>${C(o)}</b></i></span>`;
  })}</div>
  `);
}, Dn = (e) => {
  const t = J(e, "disk_entity") ?? R(e, "entity_4"), a = J(e, "temperature_entity") ?? R(e, "entity_1"), o = J(e, "memory_entity") ?? R(e, "entity_2"), r = J(e, "cpu_entity") ?? R(e, "entity_3"), n = !["off", "unavailable", "unknown"].includes(e.entity?.state ?? ""), i = (m, u) => ne(
    v(e, m),
    ne(u, u)
  ), l = (m) => !!v(e, m), s = (m) => {
    const u = e.config[m];
    return u && typeof u == "object" && "max_value" in u ? N(u.max_value) : void 0;
  }, c = (m, u, y, x = 100) => {
    const b = Math.max(0, Math.min(x, N(m?.state) ?? 0)), f = 2 * Math.PI * u, S = f * (1 - b / x);
    return U`<circle class="nas-metrics-ring-value" cx="70" cy="70" r=${u}
      fill="none" stroke=${y} stroke-width="6" stroke-linecap="round"
      stroke-dasharray=${f} stroke-dashoffset=${S}></circle>`;
  }, _ = e.entity?.state === "on" ? "Access" : C(e.entity), g = d`
    <button class="nas-metrics-tile status-tile" aria-label="Open NAS status"
      @pointerdown=${(m) => m.stopPropagation()}
      @click=${(m) => ie(m, e, { action: "more-info" })}>
      <span class="nas-metrics-tile-icon tone-blue"><ha-icon icon="mdi:nas"></ha-icon></span>
      <span><b>Status</b><small>${_}</small></span>
    </button>`;
  return n ? e.actionSurface("custom-nas-metrics is-on", d`
    <div class="nas-metrics-top">
      ${g}
      <div class="nas-metrics-tile disk-tile">
        <span class=${`nas-metrics-tile-icon ${l("disk_color") ? "" : "tone-red"}`}
          style=${l("disk_color") ? `color:${i("disk_color", "red")};background:color-mix(in srgb, ${i("disk_color", "red")} 18%, transparent)` : ""}>
          <ha-icon .icon=${v(e, "disk_icon") || "mdi:harddisk"}></ha-icon>
        </span>
        <span><b>${v(e, "disk_name") || "Disk"}</b><small>${C(t)}</small></span>
      </div>
    </div>
    <div class="nas-metrics-body">
      <div class="nas-metrics-metrics">
        <span><i class=${l("temperature_color") ? "" : "tone-orange"} style=${l("temperature_color") ? `color:${i("temperature_color", "orange")}` : ""}><ha-icon .icon=${v(e, "temperature_icon") || "mdi:thermometer"}></ha-icon></i><span><b>${v(e, "temperature_name") || "Temp"}</b><small>${C(a)}</small></span></span>
        <span><i class=${l("memory_color") ? "" : "tone-blue"} style=${l("memory_color") ? `color:${i("memory_color", "blue")}` : ""}><ha-icon .icon=${v(e, "memory_icon") || "mdi:memory"}></ha-icon></i><span><b>${v(e, "memory_name") || "Memory"}</b><small>${C(o)}</small></span></span>
        <span><i class=${l("cpu_color") ? "" : "tone-green"} style=${l("cpu_color") ? `color:${i("cpu_color", "green")}` : ""}><ha-icon .icon=${v(e, "cpu_icon") || "mdi:cpu-64-bit"}></ha-icon></i><span><b>${v(e, "cpu_name") || "CPU"}</b><small>${C(r)}</small></span></span>
      </div>
      <svg class="nas-metrics-rings" viewBox="0 0 140 140" role="img" aria-label="NAS temperature, memory, and CPU utilization">
        ${[58, 48, 38].map((m) => U`<circle class="nas-metrics-ring-track" cx="70" cy="70" r=${m}
          fill="none" stroke="#dedede" stroke-width="6"></circle>`)}
        ${c(a, 58, i("temperature_color", "orange"), N(v(e, "temperature_max")) ?? s("entity_1") ?? 100)}
        ${c(o, 48, i("memory_color", "blue"), N(v(e, "memory_max")) ?? s("entity_2") ?? 100)}
        ${c(r, 38, i("cpu_color", "green"), N(v(e, "cpu_max")) ?? s("entity_3") ?? 100)}
      </svg>
    </div>
  `) : e.actionSurface("custom-nas-metrics is-off", d`<div class="nas-metrics-top">${g}</div>`);
}, Tn = (e) => {
  const t = J(e, "battery_entity"), a = Math.max(0, Math.min(100, N(t?.state) ?? 0)), o = [
    ["tablet_button_usb_entity", "mdi:usb", "green", "Toggle USB"],
    ["tablet_button_motion_entity", "mdi:motion-sensor", "green", "Toggle motion"],
    ["tablet_button_display_entity", "mdi:monitor", "green", "Toggle display"],
    ["tablet_restart_entity", "mdi:restart-alert", "blue", "Restart tablet"],
    ["tablet_maintenance_entity", "mdi:account-hard-hat-outline", "orange", "Toggle maintenance mode"],
    ["tablet_reload_entity", "mdi:reload", "blue", "Reload tablet"]
  ], n = [
    ["RAM", J(e, "tablet_ram_entity")],
    ["Disk", J(e, "tablet_disk_entity")],
    ["Power", J(e, "tablet_power_entity")]
  ].flatMap(
    ([c, _]) => _ ? [[c, _]] : []
  ), i = o.flatMap(
    ([c, _, g, m]) => {
      const u = J(e, c);
      return u ? [[_, g, m, u]] : [];
    }
  ), l = e.entity?.state === "on" ? "Access" : C(e.entity), s = (c, _) => {
    if (c.stopPropagation(), !_) return;
    _.entity_id.split(".")[0] === "button" ? e.service("button", "press", { entity_id: _.entity_id }) : e.service("homeassistant", "toggle", { entity_id: _.entity_id });
  };
  return e.actionSurface("custom-tablet", d`
    <div class="tablet-header">
      <span class="tablet-icon"><ha-icon icon="mdi:tablet"></ha-icon></span>
      ${Y(e, l)}
    </div>
    ${i.length ? d`<div class="tablet-controls">${i.map(([c, _, g, m]) => {
    const u = m.state.toLowerCase() === "unavailable";
    return d`<button class="tone-${_} ${ue.has(m.state) ? "is-active" : ""}"
        aria-label=${g} ?disabled=${u}
        @pointerdown=${(y) => y.stopPropagation()}
        @click=${(y) => s(y, m)}>
        <ha-icon .icon=${c}></ha-icon>
      </button>`;
  })}</div>` : p}
    ${n.length ? d`<div class="tablet-metrics">${n.map(([c, _]) => d`
      <span class=${_.state.toLowerCase() === "unavailable" ? "is-unavailable" : ""}><b>${C(_)}</b><small>${c}</small></span>
    `)}</div>` : p}
    ${t ? d`<div class="tablet-battery-row">
      <span class="tablet-battery-icon"><ha-icon icon="mdi:battery"></ha-icon></span>
      <span><b>${C(t)}</b><small>Battery</small></span>
    </div>
    <div class="tablet-battery-bar"><i style=${`width:${a}%`}></i><b>${a}%</b></div>` : p}
  `);
}, On = (e) => {
  const t = e.entity?.state ?? "unknown", a = Dt(e.hass, e.config.entity, e.config), o = (L) => {
    const O = a[L];
    return O ? e.hass.states[O] : void 0;
  }, r = Fa(e.hass, e.config.entity, e.config), n = Ro(r), i = o("followers_entity"), l = o("following_entity"), s = o("friends_entity"), c = o("primary_stat_entity"), _ = o("secondary_stat_entity"), g = o("now_playing_entity"), m = o("gamerpic_entity"), u = o("artwork_entity"), y = o("console_power_entity"), x = M(m, "entity_picture") ?? M(e.entity, "entity_picture"), b = v(e, "console_show_artwork") === !1 ? void 0 : M(u, "entity_picture") ?? M(e.entity, "media_image_url") ?? M(e.entity, "entity_picture"), f = !!b, S = g && !["unknown", "unavailable", "none", ""].includes(g.state.toLowerCase()) ? C(g) : String(M(e.entity, "media_title") ?? ""), w = se(e.config, e.entity, e.hass), T = [
    { entity: i, icon: "mdi:account-arrow-left", label: "Followers" },
    { entity: l, icon: "mdi:account-arrow-right", label: "Following" },
    { entity: s, icon: "mdi:account-multiple", label: "Friends" }
  ].filter(({ entity: L }) => L), B = [
    {
      entity: c,
      icon: v(e, "primary_stat_icon") || (r === "xbox" ? "mdi:microsoft-xbox" : "mdi:trophy")
    },
    {
      entity: _,
      icon: v(e, "secondary_stat_icon") || "mdi:podium"
    }
  ].filter(({ entity: L }) => L), j = y?.entity_id.split(".", 1)[0], X = y && !["off", "standby", "unavailable", "unknown"].includes(y.state), Z = (L) => {
    if (L.stopPropagation(), !(!y || !j)) {
      if (j === "switch") {
        e.service("homeassistant", "toggle", { entity_id: y.entity_id });
        return;
      }
      e.service(j, X ? "turn_off" : "turn_on", { entity_id: y.entity_id });
    }
  };
  return e.actionSurface(`custom-console-card platform-${r} state-${t} ${f ? "has-artwork" : ""}`, d`
    ${f ? d`<div class="console-backdrop" style=${`background-image:url("${String(b)}")`}></div>` : p}
    <div class="console-content">
      <div class="card-heading console-header">
        ${e.config.icon_type !== "none" ? d`
          <span class="console-logo ${x && e.config.icon_type !== "icon" ? "has-picture" : ""}"
            style=${x && e.config.icon_type !== "icon" ? `background-image:url("${String(x)}")` : ""}>
            ${x && e.config.icon_type !== "icon" ? p : d`<ha-icon .icon=${e.config.icon || n.icon}></ha-icon>`}
          </span>
        ` : p}
        ${Y(e, S || C(e.entity), w)}
        ${B.length ? d`<span class="console-top-stats">
          ${B.map(({ entity: L, icon: O }) => d`
            <span title=${String(M(L, "friendly_name") ?? "")}>
              <ha-icon .icon=${O}></ha-icon>
              <b>${C(L)}</b>
            </span>
          `)}
        </span>` : p}
      </div>
      ${T.length ? d`<div class="console-social">
        ${T.map(({ entity: L, icon: O, label: Q }) => d`
          <span class="console-social-item" title=${Q}><ha-icon .icon=${O}></ha-icon><b>${L?.state}</b></span>
        `)}
      </div>` : p}
      ${v(e, "console_show_controls") !== !1 && y ? d`
        <div class="console-controls">
          <button aria-label=${X ? "Turn console off" : "Turn console on"}
            @pointerdown=${(L) => L.stopPropagation()}
            @click=${Z}>
            <ha-icon .icon=${X ? "mdi:power" : "mdi:power-standby"}></ha-icon>
            <span>${X ? "Power off" : "Power on"}</span>
          </button>
        </div>
      ` : p}
    </div>
  `);
}, Nn = (e) => {
  const t = e.config.carousel_show_header ?? [
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
          ${Le(e, pt(e, "mdi:view-carousel"), "var(--primary-color)", !0)}
          ${Y(e, C(e.entity), e.descriptor.name)}
        </div>
      ` : p}
      <mushroom-addition-entity-carousel
        .hass=${e.hass}
        .config=${e.config}>
      </mushroom-addition-entity-carousel>
    </ha-card>
  `;
}, Vn = (e) => {
  e.presentation.rendered = !0;
  const t = e.config, a = [
    t.name,
    t.primary_info,
    t.secondary_info,
    t.icon,
    t.icon_type
  ].some(($) => $ !== void 0), o = xe(e.hass, t.entity) ?? 0, r = xe(e.hass, t.grid_power_entity) ?? 0, n = [
    t.grid_phase_1_entity,
    t.grid_phase_2_entity,
    t.grid_phase_3_entity
  ].map(($) => xe(e.hass, $) ?? 0), i = xe(e.hass, t.solar_power_entity) ?? 0, l = ze(e.hass, t.solar_forecast_entity) ?? 0, s = xe(e.hass, t.battery_power_entity) ?? 0, c = Math.max(0, Math.min(
    100,
    ze(e.hass, t.battery_level_entity) ?? 0
  )), _ = xe(e.hass, t.ev_charger_power_entity) ?? 0, g = [1, 2, 3].map(($) => ({
    level: ze(e.hass, v(e, `battery_${$}_level_entity`)) ?? 0,
    power: xe(e.hass, v(e, `battery_${$}_power_entity`)) ?? 0
  })), m = t.energy_mode_entity ? e.hass.states[t.energy_mode_entity]?.state ?? "-" : "-", u = {
    "Smart Matching": t.mode_solar_first_label ?? "Solar first",
    "Dynamic Smart Matching": t.mode_smart_saving_label ?? "Smart saving",
    "Dynamic Trading + Smart Matching": t.mode_smart_trading_label ?? "Smart trading"
  }, y = t.energy_auto_control_entity ? e.hass.states[t.energy_auto_control_entity]?.state === "on" : !1, x = `${u[m] ?? m} · ${y ? t.energy_auto_label ?? "Auto" : t.energy_manual_label ?? "Manual"}`, b = s > 20 ? `${t.energy_charge_label ?? "Charging"} ${be(s)}` : s < -20 ? `${t.energy_discharge_label ?? "Discharging"} ${be(s)}` : t.energy_idle_label ?? "Idle", f = r > 20 ? t.energy_grid_import_label ?? "GRID · Import" : r < -20 ? t.energy_grid_export_label ?? "GRID · Export" : t.energy_grid_label ?? "GRID", S = t.import_color ?? "#ff9f43", w = t.export_color ?? "#4cd98b", T = t.battery_color ?? "#3b82f6", B = t.solar_color ?? "#f5c542", j = t.home_color ?? "#3b82f6", X = r > 20 ? S : w, Z = (/* @__PURE__ */ new Date()).toLocaleTimeString(e.hass.language ?? "nl-NL", {
    hour: "2-digit",
    minute: "2-digit"
  }), L = ($, G, I) => U`
    <path d=${wt($, G, I)} class="hems-track"></path>
  `, O = ($, G, I, W, ce, pe = !1) => {
    const Fe = Vr($, G, I, W, pe);
    return Fe ? U`<path d=${Fe} stroke=${ce} class="hems-bar"></path>` : p;
  }, Q = t.electricity_price_entity ? e.hass.states[t.electricity_price_entity] : void 0, H = Fr(
    Q,
    ze(e.hass, t.tariff_markup_entity) ?? 0,
    ze(e.hass, t.tariff_vat_entity) ?? 0
  ), ee = /* @__PURE__ */ new Date();
  ee.setHours(0, 0, 0, 0);
  const ae = ee.getTime(), le = 864e5, k = Date.now(), V = H.find(($) => k >= $.start && k < $.end), A = ($) => $ < 0 ? t.price_negative_color ?? "#0288d1" : $ < (t.price_low_threshold ?? 0.18) ? t.price_low_color ?? "#2e7d32" : $ < (t.price_medium_threshold ?? 0.26) ? t.price_medium_color ?? "#9ccc65" : $ < (t.price_high_threshold ?? 0.34) ? t.price_high_color ?? "#fdd835" : $ < (t.price_critical_threshold ?? 0.42) ? t.import_color ?? "#fb8c00" : t.price_critical_color ?? "#e53935", E = ($) => new Date($).toLocaleTimeString(e.hass.language ?? "nl-NL", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return e.actionSurface("advanced-energy-management", d`
    ${a ? d`
      <div class="hems-presentation">${Je(e)}</div>
    ` : p}
    <svg class="hems-flow" viewBox="0 0 760 650" role="img" aria-label="Advanced home energy live flow">
      <circle cx="380" cy="300" r="80" class="hems-track hems-battery-track"></circle>
      ${O(80, 0, Math.min(c, 99.9) * 3.6, 1, T)}
      <text x="380" y="270" class="hems-muted hems-center">▮ Battery</text>
      <text x="380" y="318" class="hems-battery-value hems-center">${Math.round(c)}%</text>
      <text x="380" y="346" class="hems-muted hems-center">${b}</text>
      <text x="380" y="125" class="hems-time hems-muted hems-center">${Z}</text>

      ${t.show_grid_phases !== !1 ? [250, 270, 290].map(($, G) => U`
        ${L($, 272, 352)}
        ${O(
    $,
    272,
    352,
    Math.abs(n[G]) / (t.grid_phase_scale_max ?? 3e3),
    n[G] < 0 ? w : S
  )}
      `) : p}
      <text x="180" y="185" class="hems-muted">${f}</text>
      <text x="180" y="228" class="hems-main-value" fill=${X}>⚡ ${be(r)}</text>
      ${t.show_grid_phases !== !1 ? n.map(($, G) => U`
        <text x="180" y=${258 + G * 22} class="hems-detail hems-muted">
          L${G + 1} ${$ >= 0 ? "↓" : "↑"} ${be($)}
        </text>
      `) : p}

      ${L(265, 188, 262)}
      ${O(265, 188, 262, i / (t.solar_scale_max ?? 6e3), B, !0)}
      <text x="180" y="395" class="hems-muted">${t.energy_solar_label ?? "Solar Panels"}</text>
      <text x="180" y="437" class="hems-main-value">☀️ ${be(i)}</text>
      <text x="180" y="465" class="hems-detail hems-muted">
        ${t.energy_forecast_label ?? "Expected"} ${l.toLocaleString(void 0, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })} kWh
      </text>

      ${t.show_battery_units !== !1 ? [250, 270, 290].map(($, G) => U`
        ${L($, 8, 88)}
        ${O(
    $,
    8,
    88,
    Math.abs(g[G].power) / (t.battery_unit_scale_max ?? 2400),
    g[G].power > 0 ? T : S,
    !0
  )}
      `) : p}
      <text x="585" y="185" class="hems-muted hems-end">${t.energy_battery_label ?? "Battery"}</text>
      ${t.show_battery_units !== !1 ? g.map(($, G) => U`
        <text x="585" y=${224 + G * 22} class="hems-detail hems-muted hems-end">
          ${G + 1} <tspan fill=${T} font-weight="600">${Math.round($.level)}%</tspan>
          ${$.power > 20 ? "↑" : $.power < -20 ? "↓" : ""} ${be($.power)}
        </text>
      `) : p}

      ${L(265, 98, 172)}
      ${O(265, 98, 172, o / (t.home_scale_max ?? 4e3), j)}
      <text x="585" y="395" class="hems-muted hems-end">${t.energy_home_label ?? "HOME"}</text>
      <text x="585" y="437" class="hems-main-value hems-end">${be(o)} ⌂</text>
      <text x="585" y="465" class="hems-detail hems-muted hems-end">
        🚗 ${t.energy_ev_label ?? "EV charger"} ${be(_)}
      </text>
      <text x="380" y="522" class="hems-mode hems-muted hems-center">${x} ▾</text>

      ${t.show_tariff_timeline !== !1 && H.length ? U`
        ${H.map(($) => {
    const G = 90 + 580 * ($.start - ae) / le, I = Math.max(580 * ($.end - $.start) / le, 1);
    return U`<rect x=${G} y="588" width=${I} height="14"
            fill=${A($.price)} opacity=".8"></rect>`;
  })}
        ${V ? U`
          <text x="90" y="574" class="hems-muted">
            ${E(V.start)} – ${E(V.end)}
          </text>
          <text x="670" y="574" class="hems-price hems-end"
            fill=${A(V.price)}>
            ${Math.round(V.price * 100)} cents
          </text>
        ` : p}
        <rect x=${90 + 580 * (k - ae) / le - 1.5} y="584"
          width="3" height="22" rx="1.5" class="hems-now"></rect>
        ${[0, 6, 12, 18, 24].map(($) => U`
          <text x=${90 + 580 * $ / 24} y="624" class="hems-hour hems-muted hems-center">
            ${String($ % 24).padStart(2, "0")}
          </text>
        `)}
      ` : p}
    </svg>
  `);
}, yt = [
  { kind: 0, fallback: "Price" },
  { kind: 1, fallback: "Planned grid charge" },
  { kind: 2, fallback: "Planned sell" },
  { kind: 3, fallback: "Possible sell" }
], Za = (e, t, a) => {
  const r = [
    e.config.name,
    e.config.name_mode,
    e.config.primary_info,
    e.config.secondary_info
  ].some((n) => n !== void 0) ? e : { ...e, config: { ...e.config, entity: void 0 }, entity: void 0 };
  return Je(r, a, t);
}, Ln = (e) => {
  const t = e.entity, a = Hr(t), o = Math.max(1, N(e.config.buy_sell_graph_span) ?? 36), r = Date.now(), n = e.config.buy_sell_span_start !== "now" ? new Date(new Date(r).setHours(0, 0, 0, 0)).getTime() : r, i = n + o * 60 * 60 * 1e3, l = a.filter(({ timestamp: I }) => I >= n && I < i), s = N(e.config.buy_sell_min_value), c = N(e.config.buy_sell_max_value), _ = jr(l, s, c), g = 58, m = 700, u = 22, y = 254, x = m - g, b = y - u, f = (I) => g + (I - n) / (i - n) * x, S = (I) => y - (I - _.minimum) / (_.maximum - _.minimum) * b, w = Math.max(0, Math.min(6, Math.floor(N(e.config.buy_sell_price_decimals) ?? 3))), T = (I) => {
    const W = l[I + 1]?.timestamp, ce = W ? W - l[I].timestamp : 1800 * 1e3;
    return Math.max(60 * 1e3, Math.min(ce, 360 * 60 * 1e3));
  }, B = Math.max(0, Math.min(6, Math.floor(N(e.config.buy_sell_axis_decimals) ?? 2))), j = yt.map((I, W) => ne(v(e, [
    "buy_sell_price_color",
    "buy_sell_charge_color",
    "buy_sell_planned_sell_color",
    "buy_sell_possible_sell_color"
  ][W]), ["#78909c", "#43a047", "#fb8c00", "#ffcc80"][W])), X = ne(
    v(e, "buy_sell_now_color"),
    "var(--primary-text-color)"
  ), Z = 14400 * 1e3, L = [];
  for (let I = n; I <= i; I += Z) L.push(I);
  L.at(-1) !== i && L.push(i);
  const O = (I) => new Date(I).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), Q = [
    "buy_sell_price_label",
    "buy_sell_charge_label",
    "buy_sell_planned_sell_label",
    "buy_sell_possible_sell_label"
  ], H = yt.map(({ fallback: I }, W) => String(e.config[Q[W]] || I)), ee = e.config.buy_sell_trade_energy_entity, ae = Number(ee ? e.hass.states[ee]?.state : e.config.buy_sell_trade_energy ?? 10), le = Number(e.config.buy_sell_trade_power ?? 7.2), k = Number(e.config.buy_sell_trade_efficiency ?? 86), V = Number(e.config.buy_sell_feed_in_fee ?? 0), A = ee && (!Number.isFinite(ae) || ae <= 0) ? { error: `Minimum trade size entity ${ee} must provide a positive numeric kWh value.` } : Gr(a, {
    energy: ae,
    power: le,
    efficiency: k,
    fee: V,
    slotMinutes: Number(e.config.buy_sell_slot_minutes ?? 15)
  }), E = (I) => `${I >= 0 ? "+" : ""}${I.toFixed(2)}`, $ = (I) => new Date(I).toLocaleString(
    e.hass.language ?? "en-GB",
    { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
  ), G = (I, W, ce) => d`
    <tr>
      <th scope="row"><span class="energy-result-kind" style=${`--energy-result-color:${ce}`}><i></i>${I}</span></th>
      <td title=${W.slots.map((pe) => `${$(pe.start)} – ${$(pe.end)}`).join("; ")}>
        ${$(W.slots[0].start)} – ${$(W.slots.at(-1).end)}
        (${W.slots.length} slots)
      </td>
      <td>${W.averagePrice.toFixed(3)}</td>
      <td>${W.energy.toFixed(1)}</td>
      <td>${E(W.amount)}</td>
    </tr>
  `;
  return e.actionSurface("energy-buy-sell-card", d`
      ${Za(e, String(e.config.buy_sell_title || "Buy and sell moments (all-in €/kWh)"), "Price timeline")}
      <div class="energy-buy-sell-chart" style=${`height:${Math.max(120, Math.min(700, N(e.config.buy_sell_chart_height) ?? 300))}px`} role="img"
        aria-label=${`Energy prices and planned actions for the next ${o} hours`}>
        <svg viewBox="0 0 720 314" preserveAspectRatio="none" aria-hidden="true">
          ${Array.from({ length: 5 }, (I, W) => {
    const ce = _.maximum - (_.maximum - _.minimum) * W / 4, pe = u + b * W / 4;
    return U`
              ${e.config.buy_sell_show_grid !== !1 ? U`
                <line x1=${g} y1=${pe} x2=${m} y2=${pe} class="energy-chart-grid"></line>
              ` : p}
              <text x=${g - 8} y=${pe + 4} text-anchor="end" class="energy-chart-tick">
                ${_a(ce, B)}
              </text>
            `;
  })}
          <text x="14" y=${(u + y) / 2} text-anchor="middle"
            transform=${`rotate(-90 14 ${(u + y) / 2})`} class="energy-chart-axis-title">${e.config.buy_sell_axis_label || "€/kWh"}</text>
          ${L.map((I) => {
    const W = f(I);
    return U`
              <line x1=${W} y1=${y} x2=${W} y2=${y + 4} class="energy-chart-axis"></line>
              <text x=${W} y=${y + 20} text-anchor="middle" class="energy-chart-tick">
                ${O(I)}
              </text>
            `;
  })}
          ${l.map((I, W) => {
    const ce = I.kind, pe = j[ce], Fe = S(I.price), Ht = S(Math.max(_.minimum, Math.min(0, _.maximum))), jt = f(I.timestamp), ao = f(Math.min(i, I.timestamp + T(W))), oo = Math.max(1, (ao - jt) * 0.88), ro = Math.min(Fe, Ht), no = Math.max(1, Math.abs(Fe - Ht));
    return U`
              <rect x=${jt} y=${ro} width=${oo} height=${no}
                rx=${Math.max(0, Math.min(16, N(e.config.buy_sell_bar_radius) ?? 2))}
                fill=${pe} opacity="0.88">
                <title>${`${H[ce]}: ${_a(I.price, w)} ${e.config.buy_sell_axis_label || "€/kWh"}`}</title>
              </rect>
            `;
  })}
          ${l.length === 0 ? U`
            <text x=${(g + m) / 2} y=${(u + y) / 2}
              text-anchor="middle" class="energy-chart-empty">No price slots available</text>
          ` : p}
          ${e.config.buy_sell_show_now !== !1 && r >= n && r <= i ? U`
            <line x1=${f(r)} y1=${u} x2=${f(r)} y2=${y + 4}
              class="energy-chart-now" style=${`stroke:${X}`}></line>
            <text x=${f(r)} y=${u - 7} text-anchor="middle" class="energy-chart-now-label"
              style=${`fill:${X}`}>
              ${e.config.buy_sell_now_label || "Now"}
            </text>
          ` : p}
        </svg>
      </div>
      ${e.config.buy_sell_show_legend !== !1 ? d`<div class="energy-chart-legend">
        ${yt.map(({ kind: I }, W) => d`
          <span class="energy-chart-legend-item">
            <span class="energy-chart-legend-swatch" style=${`--energy-series-color:${j[W]}`}></span>
            ${H[I]}
          </span>
        `)}
      </div>` : p}
      ${e.config.buy_sell_show_result !== !1 ? d`
        <details class="energy-buy-sell-result"
          @pointerdown=${(I) => I.stopPropagation()}
          @click=${(I) => I.stopPropagation()}
          @dblclick=${(I) => I.stopPropagation()}
          @keydown=${(I) => I.stopPropagation()}>
          <summary>Buy and sell result<ha-icon icon="mdi:chevron-down"></ha-icon></summary>
          ${"error" in A ? d`<p class="energy-card-empty" role="status">${A.error}</p>` : d`
            <div class="energy-result-table-scroll" tabindex="0" role="region" aria-label="Buy and sell estimate">
              <table class="energy-result-table">
                <thead><tr><th scope="col">Action</th><th scope="col">Slots</th><th scope="col">avg €/kWh</th><th scope="col">kWh</th><th scope="col">€</th></tr></thead>
                <tbody>${G("Buy", A.buy, j[1])}${G("Sell", A.sell, j[2])}</tbody>
              </table>
            </div>
            <p class="energy-result-net">Net result for ${Number(ae.toFixed(2))} kWh: ${E(A.net)} €</p>
            <p class="energy-result-note">
              Calculated for the minimum trade size (${Number(ae.toFixed(2))} kWh):
              the cheapest slots to buy and the most expensive remaining slots to sell,
              at ${le} kW, over all published prices.
              Buy kWh = sold kWh ÷ round-trip efficiency (${k}%).
              Sell is revenue after the feed-in fee (${V} €/kWh).
              Slots may be non-contiguous; the displayed times span the selected slots, not a continuous schedule.
              The final slot may be partially used. This estimate does not enforce buy-before-sell order,
              battery capacity or available charge; the real plan follows Smart saving / Smart trading.
            </p>
          `}
        </details>
      ` : p}
  `);
}, Fn = (e) => {
  const t = Array.isArray(e.config.panel_entities) ? e.config.panel_entities : void 0, a = Rr(
    e.hass.states,
    t,
    e.config.entity
  ), o = Ur(a), r = Math.max(1, N(e.config.panel_gauge_max) ?? 350), n = [0, 1, 2, 3, 4, 5].map((x) => N(e.config[`panel_segment_${x}`]) ?? [0, 80, 150, 230, 300, r][x]), i = n.map((x, b) => ne(v(e, `panel_color_${b}`), [
    "#b0bec5",
    "#ffa726",
    "#d4e157",
    "#66bb6a",
    "#2e7d32",
    "#2e7d32"
  ][b])), l = N(e.config.panel_warning_average_min) ?? 30, s = (N(e.config.panel_low_output_percent) ?? 60) / 100, c = o.averageOutput > l && !!o.weakest && o.weakest.value < o.averageOutput * s, _ = o.activeCount < a.length, g = a.length === 0 ? "No panel sensors are selected." : c ? `Panel ${o.weakest.id} is delivering less than ${Math.round(s * 100)}% of the average. Check for shading or a fault.` : _ ? `${a.length - o.activeCount} panel(s) at zero. This is normal at night; otherwise, check them.` : "All panels are within the expected range of each other.", m = a.length === 0 ? "mdi:information-outline" : c || _ ? "mdi:alert-circle-outline" : "mdi:check-circle-outline", u = c ? "warning" : _ || a.length === 0 ? "muted" : "success", y = [
    ["Panels reporting", `${o.activeCount} / ${a.length}`],
    ["Combined output", `${Math.round(o.totalOutput)} W`],
    ["Average per panel", `${Math.round(o.averageOutput)} W`],
    ["Best panel", o.best ? `${o.best.id} · ${Math.round(o.best.value)} W` : "—"],
    ["Weakest panel", o.weakest ? `${o.weakest.id} · ${Math.round(o.weakest.value)} W` : "—"],
    ["Best-to-weakest spread", `${Math.round(o.spread)} W`]
  ];
  return e.actionSurface("panel-health-card", d`
      ${Za(e, String(e.config.panel_health_title || "Panel health"), "Solar panel output")}
      ${e.config.panel_show_summary !== !1 ? d`<div class="panel-health-summary">
        ${y.map(([x, b]) => d`
          <div class="panel-health-summary-row"><span>${x}</span><strong>${b}</strong></div>
        `)}
      </div>` : p}
      <div class=${`panel-health-status panel-health-status-${u}`} role="status">
        <ha-icon icon=${m}></ha-icon><span>${g}</span>
      </div>
      ${a.length && e.config.panel_show_gauges !== !1 ? d`
        <div class="panel-health-gauges">
          ${a.map((x) => {
    const b = qr(x.value, r), f = Kr(x.value, n, i), S = 2 * Math.PI * 37, w = S * b / 100, T = se({
      ...e.config,
      entity: x.entity.entity_id
    }, x.entity, e.hass) || x.id;
    return d`
              <button class="panel-health-gauge" type="button"
                aria-label=${`${T}: ${Math.round(x.value)} watts`}
                @click=${(B) => ie(B, e, { action: "more-info" }, x.entity.entity_id)}>
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="46" r="37" class="panel-health-gauge-track"></circle>
                  <circle cx="50" cy="46" r="37" class="panel-health-gauge-value"
                    style=${`--panel-gauge-color:${f};--panel-gauge-progress:${w};--panel-gauge-circumference:${S}`}
                    stroke-dasharray=${`${w} ${S}`}></circle>
                  <text x="50" y="51" text-anchor="middle" class="panel-health-gauge-value-label">
                    ${Math.round(x.value)}
                  </text>
                </svg>
                <span class="panel-health-gauge-name">${T}</span>
              </button>
            `;
  })}
        </div>
      ` : a.length ? p : d`
        <div class="energy-card-empty">
          Select panel sensors in the card editor, or add sensors with entity IDs beginning with sensor.inverter_4.
        </div>
      `}
  `);
}, Bn = (e) => {
  const t = R(e, "ulm_card_flower_entity") ?? e.entity, a = t?.state === "problem", o = (n) => mt.find((i) => i.key === n), r = ja(e.config).flatMap((n) => {
    const i = o(n), l = M(t, n), s = typeof l == "object" && l !== null ? l : void 0, c = R(e, Ga(n)), _ = typeof s?.sensor == "string" ? s.sensor : typeof l == "string" && e.hass.states[l] ? l : void 0, g = c ?? (_ ? e.hass.states[_] : void 0), m = String(M(t, "device_class") ?? ""), u = t?.entity_id.startsWith("sensor.") && (m === n || n === "moisture" && (!m || m === "humidity")), y = g ?? (u ? t : void 0), x = N(y?.state) ?? N(s?.current) ?? N(l);
    if (x === void 0) return [];
    const b = N(s?.min) ?? N(M(y, "min")) ?? i.min, f = N(s?.max) ?? N(M(y, "max")) ?? i.max, S = Math.max(0, Math.min(100, (x - b) / Math.max(1, f - b) * 100)), w = y ? C(y) : String(x);
    return [{ key: n, definition: i, sourceEntity: y, value: x, percent: S, display: w }];
  });
  return e.actionSurface("custom-plant", d`
    <button class="flower-heading" aria-label="Open plant details"
      @pointerdown=${(n) => n.stopPropagation()}
      @click=${(n) => ie(n, e, { action: "more-info" }, t?.entity_id)}>
      ${oe(e, a ? "mdi:alert-circle" : "mdi:flower", a ? "red" : "green")}
      ${Y(e, a ? v(e, "ulm_custom_card_plant_problem") || "Problema" : v(e, "ulm_custom_card_plant_correct") || "Correto")}
    </button>
    ${r.length ? d`<div class="flower-bars">${r.map(({ key: n, definition: i, sourceEntity: l, percent: s, display: c }) => {
    const _ = `${i.label}: ${c}`;
    return d`<span data-flower-bar=${n} title=${_} aria-label=${_}>
        <ha-icon .icon=${i.icon}></ha-icon>
        <i><em style=${`width:${s}%`}></em></i>
        ${l ? d`<output>${c}</output>` : p}
      </span>`;
  })}</div>` : p}
  `);
}, Hn = (e) => {
  const t = v(e, "ulm_custom_card_speedtest_round") === !0, a = (o, r, n, i, l, s, c, _, g) => {
    const m = R(e, o) ?? R(e, r), u = N(m?.state), y = Math.max(1, v(e, c) ?? _), x = Math.max(0, Math.min(100, (u ?? 0) / y * 100)), b = u === void 0 ? "—" : g && t ? String(Math.round(u)) : m.state, f = m?.attributes.unit_of_measurement, S = ne(v(e, l), s);
    return d`
      <div class="speedtest-metric" style=${`--speedtest-color:${S};--speedtest-value:${x}`}>
        <svg class="speedtest-ring" viewBox="0 0 120 100" aria-hidden="true">
          <path class="speedtest-track" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
          <path class="speedtest-value" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
        </svg>
        <span class="speedtest-value-copy"><ha-icon .icon=${i}></ha-icon><b>${b}${f ? ` ${String(f)}` : ""}</b><small>${n}</small></span>
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
}, jn = (e) => {
  const t = {
    en: { none: "None", very_low: "Very low", low: "Low", medium: "Medium", high: "High", very_high: "Very high", tree: "Trees", grass: "Grass", weed: "Weeds" },
    de: { none: "Keine", very_low: "Sehr niedrig", low: "Niedrig", medium: "Mittel", high: "Hoch", very_high: "Sehr hoch", tree: "Bäume", grass: "Gräser", weed: "Kräuter" },
    es: { none: "Ninguno", very_low: "Muy bajo", low: "Bajo", medium: "Medio", high: "Alto", very_high: "Muy alto", tree: "Árboles", grass: "Hierbas", weed: "Malezas" },
    nl: { none: "Geen", very_low: "Zeer laag", low: "Laag", medium: "Gemiddeld", high: "Hoog", very_high: "Extreem hoog", tree: "Bomen", grass: "Grassen", weed: "Kruiden" },
    pl: { none: "Brak", very_low: "Bardzo słabe", low: "Słabe", medium: "Średnie", high: "Wysokie", very_high: "Bardzo wysokie", tree: "Drzewa", grass: "Trawy", weed: "Zioła" }
  }, a = t[(e.hass.language ?? "en").split("-")[0]] ?? t.en, o = [
    {
      entity: J(e, "trees_entity"),
      name: v(e, "custom_card_pollen_tree_name"),
      icon: v(e, "custom_card_pollen_tree_icon"),
      kind: "tree",
      fallbackIcon: "mdi:tree"
    },
    {
      entity: J(e, "grass_entity"),
      name: v(e, "custom_card_pollen_grass_name"),
      icon: v(e, "custom_card_pollen_grass_icon"),
      kind: "grass",
      fallbackIcon: "mdi:grass"
    },
    {
      entity: J(e, "weeds_entity"),
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
      label: a[i] ?? a.none,
      color: l[i] ?? l.none,
      extreme: i === "very_high"
    };
  };
  return e.actionSurface("custom-pollen", d`
    <div class="pollen-heading">${Je(e)}</div>
    ${o.map((n) => {
    const i = r(n.entity?.state), l = n.name || n.entity?.attributes.friendly_name || a[n.kind], s = n.icon || n.entity?.attributes.icon || n.fallbackIcon;
    return d`<button class="pollen-item" style=${`--pollen:${i.color}`}
        ?disabled=${!n.entity}
        @pointerdown=${(c) => c.stopPropagation()}
        @click=${(c) => n.entity && ie(c, e, { action: "more-info" }, n.entity.entity_id)}>
        <span class="pollen-item-icon"><ha-icon .icon=${s}></ha-icon>
          ${i.extreme ? d`<span class="pollen-extreme"><ha-icon .icon=${"mdi:exclamation-thick"}></ha-icon></span>` : p}
        </span>
        <b>${l}</b><small>${n.entity ? i.label : "Entity unavailable"}</small>
      </button>`;
  })}
  `);
}, Gn = (e) => {
  const t = ue.has(e.entity?.state ?? ""), a = "rgb(var(--rgb-blue, 33, 150, 243))";
  return e.actionSurface("ulm-row", d`
    ${Le(e, pt(e, "mdi:information-outline"), a, t)}
    ${an(e)}
  `, `--source-color:${a}`);
}, Wn = (e) => {
  switch (e.descriptor.upstreamId) {
    case "card_battery":
      return ln(e);
    case "card_media_player":
      return ma(e);
    case "custom_card_trash":
      return $n(e);
    case "custom_card_alarm_time":
      return xn(e);
    case "custom_card_roomview":
      return Sn(e);
    case "custom_card_room_overview":
      return Mn(e);
    case "custom_card_welcome":
      return kn(e);
    case "custom_card_washer":
      return An(e);
    case "custom_card_sun":
      return In(e);
    case "custom_card_input_datetime":
      return Cn(e);
    case "custom_card_weather_metrics":
      return Pn(e);
    case "custom_card_media_player_sonos":
      return En(e);
    case "custom_card_printer":
      return zn(e);
    case "custom_card_nas_metrics":
      return Dn(e);
    case "custom_card_tablet":
      return Tn(e);
    case "custom_card_playstation":
      return On(e);
    case "custom_card_entity_carousel":
      return Nn(e);
    case "advanced_home_energy_management":
      return Vn(e);
    case "advanced_energy_buy_sell":
      return Ln(e);
    case "advanced_energy_panel_health":
      return Fn(e);
    case "custom_card_plant":
      return Bn(e);
    case "custom_card_speedtest_gauges":
      return Hn(e);
    case "custom_card_pollen":
      return jn(e);
    case "card_room":
      return yn(e);
  }
  if (/trash/.test(e.descriptor.upstreamId)) return fn(e);
  if (/printer/.test(e.descriptor.upstreamId)) return vn(e);
  if (/plant|entity_overview/.test(e.descriptor.upstreamId))
    return bn(e, /plant/.test(e.descriptor.upstreamId) ? "mdi:flower" : "mdi:view-grid", "purple");
  switch (e.descriptor.family) {
    case "scene":
      return _n(e);
    case "battery":
      return sn(e);
    case "energy":
    case "sensor":
      return dn(e);
    case "media":
      return ma(e);
    case "security":
      return mn(e);
    case "navigation":
      return pn(e);
    case "control":
      return gn(e);
    case "alarm-time":
      return wn(e);
    default:
      return Gn(e);
  }
};
var Rn = Object.defineProperty, Lt = (e, t, a, o) => {
  for (var r = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = i(t, a, r) || r);
  return r && Rn(t, a, r), r;
};
const Ft = class Ft extends ve {
  constructor() {
    super(...arguments), this.holdFired = !1, this.forecastGeneration = 0, this.forecast = [], this.sceneOverflowExpanded = !1, this.actionSurface = (t, a, o = "") => {
      const r = this.descriptor ? Tt.get(this.descriptor.upstreamId) : void 0, n = this.descriptor?.sourcePath.startsWith("src/") ?? !1;
      if (!r && !n)
        throw new Error(`Missing explicit parity renderer mapping for ${this.descriptor?.upstreamId}`);
      const i = r ? ` parity-${r.rendererId.replaceAll("_", "-")}` : "", l = this.config?.layout && this.config.layout !== "default" ? ` layout-${this.config.layout}` : "", s = this.config?.multiline_secondary ? " multiline-secondary" : "", c = this.config?.fill_container ? " fill-container" : "", _ = this.config?.variant ? ` variant-${this.config.variant}` : "", g = d`
      <div class="${t}${i}${l}${s}${c}${_} action-surface" style=${o} role="button" tabindex="0"
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
    const a = Bo(t), o = this.forecastKey(this.config);
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
    if (!this.config || !this.descriptor) return p;
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
        a.rendered ? n : d`${on(o)}${n}`,
        i
      ),
      service: (r, n, i) => {
        this.hass?.callService(r, n, i);
      }
    };
    return Wn(o);
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
    Da(this, r ? { ...this.config, entity: r } : this.config, a);
  }
};
Ft.styles = kr;
let Ae = Ft;
Lt([
  Ie({ attribute: !1 })
], Ae.prototype, "hass");
Lt([
  Ie({ attribute: !1 })
], Ae.prototype, "config");
Lt([
  he()
], Ae.prototype, "sceneOverflowExpanded");
var Un = Object.defineProperty, Ze = (e, t, a, o) => {
  for (var r = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = i(t, a, r) || r);
  return r && Un(t, a, r), r;
};
const Ge = [
  "var(--accent-color, #03a9f4)",
  "#ff9800",
  "#4caf50",
  "#9c27b0",
  "#f44336",
  "#00bcd4"
], $t = (e) => {
  const a = (Array.isArray(e.entities) ? e.entities : []).map((o) => typeof o == "string" ? { entity: o } : { ...o });
  return !a.length && e.entity && a.push({ entity: e.entity }), a.filter((o) => !!o.entity);
}, Qa = (e) => ({
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
}), ba = (e) => {
  const t = $t(e);
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
    show: Qa(e.show),
    animate: e.animate ?? !1,
    height: e.height ?? 150,
    bar_spacing: e.bar_spacing ?? 4,
    line_width: e.line_width ?? 5,
    line_color: e.line_color ?? Ge[0],
    color_thresholds: rt(e.color_thresholds ?? []),
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
}, rt = (e) => {
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
}, tt = (e, t) => t ? t.split(".").reduce((a, o) => {
  if (!(!a || typeof a != "object"))
    return a[o];
}, e?.attributes) : e?.state, at = (e, t) => {
  const a = String(e ?? ""), o = t.findIndex((n) => n.value === a);
  if (o >= 0)
    return {
      value: o,
      label: t[o].label ?? t[o].value
    };
  const r = Number(e);
  return Number.isFinite(r) ? { value: r } : {};
}, eo = (e, t) => {
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
}, qn = (e, t, a, o = Date.now()) => {
  if (!e.length) return [];
  const r = Math.max(1, Number(t.hours_to_show ?? 24)), n = Math.max(0.01, Number(t.points_per_hour ?? 0.5)), i = o - r * 36e5, l = 36e5 / n, s = /* @__PURE__ */ new Map();
  for (const c of e) {
    if (c.time < i || c.time > o || !Number.isFinite(c.value)) continue;
    const _ = new Date(c.time), g = t.group_by === "date" ? `${_.getFullYear()}-${_.getMonth()}-${_.getDate()}` : t.group_by === "hour" ? `${_.getFullYear()}-${_.getMonth()}-${_.getDate()}-${_.getHours()}` : String(Math.floor((c.time - i) / l));
    s.set(g, [...s.get(g) ?? [], c]);
  }
  return [...s.values()].map((c) => ({
    time: c.at(-1).time,
    value: eo(c.map((_) => _.value), a),
    label: c.at(-1)?.label
  })).sort((c, _) => c.time - _.time);
}, fa = (e) => {
  if (typeof e == "number" && Number.isFinite(e)) return { value: e, soft: !1 };
  if (typeof e != "string") return { soft: !1 };
  const t = e.trim().startsWith("~"), a = Number(e.replace(/^~/, ""));
  return { value: Number.isFinite(a) ? a : void 0, soft: t };
}, va = (e, t, a, o = 0) => {
  let r = e.length ? Math.min(...e) : 0, n = e.length ? Math.max(...e) : 1;
  const i = fa(t), l = fa(a);
  if (i.value !== void 0 && (r = i.soft ? Math.min(r, i.value) : i.value), l.value !== void 0 && (n = l.soft ? Math.max(n, l.value) : l.value), n <= r) {
    const s = Math.max(1, Math.abs(r) * 0.05), c = i.value !== void 0 && !i.soft && l.value === void 0, _ = l.value !== void 0 && !l.soft && i.value === void 0;
    c ? n = r + s * 2 : _ ? r = n - s * 2 : (r -= s, n += s);
  }
  if (n - r < o) {
    const s = (r + n) / 2;
    r = s - o / 2, n = s + o / 2;
  }
  return { min: r, max: n };
}, wa = (e, t, a) => {
  let o = a;
  for (const r of t)
    r.value !== void 0 && e >= r.value && (o = r.color);
  return o;
}, Kn = (e, t) => Number.isFinite(e) ? e.toLocaleString(void 0, {
  minimumFractionDigits: t,
  maximumFractionDigits: t ?? 2
}) : "Unavailable", Yn = (e, t) => {
  if (!e.length) return "";
  if (!t || e.length < 3)
    return e.map((o, r) => `${r ? "L" : "M"} ${o.x} ${o.y}`).join(" ");
  let a = `M ${e[0].x} ${e[0].y}`;
  for (let o = 1; o < e.length; o += 1) {
    const r = e[o - 1], n = e[o], i = (r.x + n.x) / 2;
    a += ` C ${i} ${r.y}, ${i} ${n.y}, ${n.x} ${n.y}`;
  }
  return a;
}, Xn = (e, t) => {
  if (typeof e == "number" && Number.isFinite(e))
    return e < 1e10 ? e * 1e3 : e;
  const a = Date.parse(String(e ?? ""));
  return Number.isFinite(a) ? a : t;
}, Jn = (e, t) => {
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
}, Bt = class Bt extends ve {
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
    return ba({
      type: "custom:mushroom-addition-mini-graph-card",
      entity: n,
      entities: [{ entity: n }],
      name: t?.states[n]?.attributes.friendly_name,
      show: { graph: "line", fill: !0, points: "hover", labels: "hover" }
    });
  }
  setConfig(t) {
    this.config = ba(t), this.restartInterval(), this.requestKey = void 0, this.lastEntityStateSignature = this.entityStateSignature(), this.loadHistory();
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
    if (!this.config) return p;
    if (!this.hass) return d`<ha-card><div class="loading">Mini Graph preview</div></ha-card>`;
    const t = Qa(this.config.show), a = this.series[0], o = a ? wa(
      Number(a.state),
      rt(this.config.color_thresholds ?? []),
      a.color
    ) : Ge[0], r = [
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
    if (!o.name && (!o.icon || this.config?.align_icon === "state")) return p;
    const r = o.icon && this.config?.icon_type !== "none" && this.config?.align_icon !== "state" ? this.renderIcon(t, a, o) : p, n = this.presentation(t);
    return d`
      <div class="header" data-align=${this.config?.align_header ?? "default"}
        style=${`font-size:${this.config?.font_size_header ?? 14}px`}>
        ${this.config?.align_icon === "left" ? r : p}
        ${o.name ? d`
          <span class="name shared-presentation" style=${o.name_adaptive_color ? `color:${a}` : ""}>
            ${n.primary ? d`<span class="ulm-name">${n.primary}</span>` : p}
            ${n.secondary ? d`<span class="ulm-label">${n.secondary}</span>` : p}
          </span>
        ` : p}
        ${this.config?.align_icon !== "left" ? r : p}
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
    if (!o.state || !t) return p;
    const r = o.state === "last" ? t.points.at(-1)?.value : t.state, n = Number(r), i = this.stateLabel(n, t.points.at(-1)?.label);
    return d`
      <div class="states" data-align=${this.config?.align_state ?? "left"}>
        ${this.renderState(t, i, a, !0)}
        ${this.series.slice(1).filter((l) => l.config.show_state).map((l) => this.renderState(
      l,
      this.stateLabel(Number(l.state), l.points.at(-1)?.label),
      wa(Number(l.state), rt(this.config?.color_thresholds ?? []), l.color),
      !1
    ))}
        ${o.icon && this.config?.icon_type !== "none" && this.config?.align_icon === "state" ? this.renderIcon(t, a, o) : p}
      </div>
    `;
  }
  presentation(t) {
    if (!this.config) return {};
    const a = t?.config.entity ?? this.config.entity, o = a ? this.hass?.states[a] : void 0, r = se(this.config, o, this.hass), n = C(o), i = (l) => {
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
        ${t.config.show_indicator ? d`<span class="indicator" style=${`background:${o}`}></span>` : p}
        <span class="state-value">${a}</span>
        <span class="unit">${t.unit}</span>
      </span>
    `;
  }
  renderGraph(t) {
    if (!t.graph || !this.series.some((m) => m.config.show_graph !== !1)) return p;
    const a = this.series.filter((m) => m.config.show_graph !== !1 && m.points.length), o = a.filter((m) => m.config.y_axis !== "secondary"), r = a.filter((m) => m.config.y_axis === "secondary"), n = o.flatMap((m) => m.points.map((u) => u.value)), i = r.flatMap((m) => m.points.map((u) => u.value));
    t.graph === "bar" && this.config?.lower_bound === void 0 && n.push(0), t.graph === "bar" && this.config?.lower_bound_secondary === void 0 && i.push(0);
    const l = va(
      n,
      this.config?.lower_bound,
      this.config?.upper_bound,
      Number(this.config?.min_bound_range ?? 0)
    ), s = va(
      i,
      this.config?.lower_bound_secondary,
      this.config?.upper_bound_secondary,
      Number(this.config?.min_bound_range_secondary ?? 0)
    ), c = a.flatMap((m) => m.points.map((u) => u.time)), _ = Math.min(...c), g = Math.max(...c);
    return d`
      <div class="graph" style=${`height:${this.config?.height ?? 150}px`}>
        ${t.labels && o.length ? d`
          <div class="labels">
            <span>${this.stateLabel(l.max)}</span>
            <span>${this.stateLabel(l.min)}</span>
          </div>` : p}
        ${t.labels_secondary && r.length ? d`
          <div class="labels secondary">
            <span>${this.stateLabel(s.max)}</span>
            <span>${this.stateLabel(s.min)}</span>
          </div>` : p}
        <svg class="chart" viewBox="0 0 500 ${this.config?.height ?? 150}" preserveAspectRatio="none"
          @click=${(m) => m.stopPropagation()}>
          <defs>
            ${a.map((m, u) => this.renderGradient(m, u, m.config.y_axis === "secondary" ? s : l))}
          </defs>
          ${a.map((m, u) => this.renderSeries(
      m,
      u,
      m.config.y_axis === "secondary" ? s : l,
      _,
      g,
      t,
      a.length
    ))}
        </svg>
      </div>
    `;
  }
  renderGradient(t, a, o) {
    const r = rt(this.config?.color_thresholds ?? []), n = this.config?.color_thresholds_transition ?? "smooth";
    if (!r.length || t.config.color)
      return U`<linearGradient id=${`mini-graph-${a}`}><stop offset="0%" stop-color=${t.color}/><stop offset="100%" stop-color=${t.color}/></linearGradient>`;
    const i = r.flatMap((l, s) => {
      const c = Math.max(0, Math.min(100, 100 - ((l.value ?? o.min) - o.min) / (o.max - o.min) * 100));
      return n === "hard" && s > 0 ? [
        U`<stop offset=${`${c}%`} stop-color=${r[s - 1].color}/>`,
        U`<stop offset=${`${c}%`} stop-color=${l.color}/>`
      ] : [U`<stop offset=${`${c}%`} stop-color=${l.color}/>`];
    });
    return U`<linearGradient id=${`mini-graph-${a}`} x1="0" y1="1" x2="0" y2="0">${i}</linearGradient>`;
  }
  renderSeries(t, a, o, r, n, i, l) {
    const s = Number(this.config?.height ?? 150), c = (b) => {
      const f = this.config?.logarithmic ? Math.log10(Math.max(b, Number.EPSILON)) : b, S = this.config?.logarithmic ? Math.log10(Math.max(o.min, Number.EPSILON)) : o.min, w = this.config?.logarithmic ? Math.log10(Math.max(o.max, Number.EPSILON)) : o.max;
      return s - (f - S) / Math.max(Number.EPSILON, w - S) * s;
    }, _ = r === n, g = t.points.map((b) => ({
      x: _ ? 250 : (b.time - r) / Math.max(1, n - r) * 500,
      y: c(b.value),
      value: b.value,
      time: b.time
    })), m = t.config.color ? t.color : `url(#mini-graph-${a})`;
    if (i.graph === "bar") {
      const b = 500 / Math.max(1, Math.min(96, g.length)), f = Number(this.config?.bar_spacing ?? 4), S = Math.max(1, (b - f) / l), w = Math.max(0, Math.min(s, c(0)));
      return U`
        <g class="series">
          ${g.slice(-96).map((T, B) => {
        const j = B * b + a * S + f / 2, X = Math.min(T.y, w);
        return U`<rect x=${j} y=${X} width=${S} height=${Math.abs(w - T.y)} rx="1" fill=${m}>
              <title>${this.tooltip(t, T.value, T.time)}</title>
            </rect>`;
      })}
        </g>
      `;
    }
    const u = g.length === 1 ? [{ ...g[0], x: 0 }, { ...g[0], x: 500 }] : g, y = Yn(u, t.config.smoothing ?? this.config?.smoothing ?? !0), x = g.length ? `${y} L ${u.at(-1).x} ${s} L ${u[0].x} ${s} Z` : "";
    return U`
      <g class="series">
        ${i.fill && t.config.show_fill !== !1 ? U`<path class="fill ${i.fill === "fade" ? "fade" : ""}" d=${x} fill=${m}/>` : p}
        ${t.config.show_line !== !1 ? U`<path class="line" d=${y} stroke=${m} stroke-width=${this.config?.line_width ?? 5}/>` : p}
        ${i.points && t.config.show_points !== !1 ? g.map((b) => U`
            <circle class="point" cx=${b.x} cy=${b.y} r=${Math.max(2, Number(this.config?.line_width ?? 5) / 1.5)}
              fill=${t.config.color ?? m}>
              <title>${this.tooltip(t, b.value, b.time)}</title>
            </circle>`) : p}
      </g>
    `;
  }
  renderLegend(t) {
    const a = this.series.filter((o) => o.config.show_legend !== !1);
    return !t.legend || a.length < 2 ? p : d`
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
    if (!a || !t.average && !t.extrema || !a.points.length) return p;
    const o = a.points.map((l) => l.value), r = eo(o, "avg"), n = Math.min(...o), i = Math.max(...o);
    return d`
      <div class="statistics">
        ${t.average ? d`<span>Average <b>${this.stateLabel(r)} ${a.unit}</b></span>` : p}
        ${t.extrema ? d`
          <span>Minimum <b>${this.stateLabel(n)} ${a.unit}</b></span>
          <span>Maximum <b>${this.stateLabel(i)} ${a.unit}</b></span>
        ` : p}
      </div>
    `;
  }
  stateLabel(t, a) {
    if (a) return a;
    const o = this.config?.state_map?.[Math.round(t)];
    return o && Math.abs(t - Math.round(t)) < Number.EPSILON ? o.label ?? o.value : Kn(t, this.config?.decimals);
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
      return JSON.stringify($t(this.config).map((t) => {
        const a = this.hass?.states[t.entity];
        return {
          entity: t.entity,
          attribute: t.attribute,
          value: tt(a, t.attribute),
          lastChanged: a?.last_changed,
          lastUpdated: a?.last_updated
        };
      }));
  }
  singleEntityStateSignature(t) {
    const a = this.hass?.states[t.entity];
    return JSON.stringify({
      value: tt(a, t.attribute),
      lastChanged: a?.last_changed,
      lastUpdated: a?.last_updated
    });
  }
  async loadHistory(t = !1) {
    if (!this.hass || !this.config) return;
    const a = $t(this.config), o = JSON.stringify({
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
      this.series = a.map((s, c) => this.buildSeries(s, c, l[s.entity] ?? [], i, n)), this.error = this.series.some((s) => s.points.length) ? void 0 : "No recorder history is available for the selected entities.";
    } catch (n) {
      if (r !== this.historyGeneration) return;
      this.error = n instanceof Error ? n.message : "Unable to load recorder history.", console.warn("Mushroom Cards Addition: unable to load Mini Graph history", n);
    } finally {
      r === this.historyGeneration && (this.loading = !1);
    }
  }
  async fetchHistory(t, a, o, r, n) {
    const i = {}, l = [];
    for (const _ of t) {
      if (_.fixed_value) continue;
      const g = r ? void 0 : this.readCache(_, a);
      g ? i[_.entity] = g : l.push(_);
    }
    if (!l.length) return i;
    if (!this.hass?.connection?.sendMessagePromise) {
      for (const _ of l) i[_.entity] = this.attributeHistory(_);
      return i;
    }
    const s = await this.hass.connection.sendMessagePromise({
      type: "history/history_during_period",
      start_time: new Date(a).toISOString(),
      end_time: new Date(o).toISOString(),
      entity_ids: [...new Set(l.map((_) => _.entity))],
      no_attributes: !1,
      minimal_response: !1,
      significant_changes_only: !1
    }), c = Jn(s, l);
    if (n !== this.historyGeneration) return i;
    for (const _ of l) {
      const m = (c.get(_.entity) ?? []).flatMap((u) => {
        if (!u || typeof u != "object") return [];
        const y = u, x = y.state ?? y.s, b = y.attributes ?? y.a ?? {}, f = _.attribute ? _.attribute.split(".").reduce((T, B) => T && typeof T == "object" ? T[B] : void 0, b) : x, S = at(f, this.config?.state_map ?? []), w = Xn(
          y.last_updated ?? y.last_changed ?? y.lu ?? y.lc,
          o
        );
        return S.value === void 0 || !Number.isFinite(w) ? [] : [{ time: w, value: S.value, label: S.label }];
      });
      i[_.entity] = m.length ? m : this.attributeHistory(_), this.writeCache(_, i[_.entity]);
    }
    return i;
  }
  attributeHistory(t) {
    const a = this.hass?.states[t.entity], o = a?.attributes.history;
    if (Array.isArray(o)) {
      const n = Date.now();
      return o.flatMap((i, l) => {
        const s = typeof i == "object" && i ? i.value ?? i.state : i, c = at(s, this.config?.state_map ?? []), _ = typeof i == "object" && i ? Date.parse(String(i.time ?? i.last_changed ?? "")) : Number.NaN;
        return c.value === void 0 ? [] : [{
          time: Number.isFinite(_) ? _ : n - (o.length - l - 1) * 36e5 / Number(this.config?.points_per_hour ?? 0.5),
          value: c.value,
          label: c.label
        }];
      });
    }
    const r = at(tt(a, t.attribute), this.config?.state_map ?? []);
    return r.value === void 0 ? [] : [{ time: Date.now(), value: r.value, label: r.label }];
  }
  buildSeries(t, a, o, r, n) {
    const i = this.hass?.states[t.entity], l = at(tt(i, t.attribute), this.config?.state_map ?? []), s = 10 ** Number(this.config?.value_factor ?? 0), c = Date.parse(i?.last_updated ?? i?.last_changed ?? "") || n, _ = l.value === void 0 ? o : [
      ...o.filter((x) => x.time !== c),
      { time: c, value: l.value, label: l.label }
    ], m = (t.fixed_value && l.value !== void 0 ? [{ time: r, value: l.value }, { time: n, value: l.value }] : _).map((x) => ({ ...x, value: x.value * s })), u = qn(
      m,
      this.config ?? {},
      t.aggregate_func ?? this.config?.aggregate_func ?? "avg",
      n
    ), y = Array.isArray(this.config?.line_color) ? this.config.line_color : [this.config?.line_color ?? Ge[0]];
    return {
      config: t,
      points: u,
      color: t.color ?? y[a] ?? Ge[a % Ge.length],
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
    me(this, "hass-action", {
      config: { ...this.config, entity: r },
      action: a
    });
  }
};
Bt.styles = lt`
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
let we = Bt;
Ze([
  Ie({ attribute: !1 })
], we.prototype, "hass");
Ze([
  he()
], we.prototype, "config");
Ze([
  he()
], we.prototype, "series");
Ze([
  he()
], we.prototype, "loading");
Ze([
  he()
], we.prototype, "error");
const Zn = (e, t, a = [], o = []) => {
  const r = [...a, ...o, ...Object.keys(t?.states ?? {})], n = [...new Set(r)].filter((l) => t?.states?.[l] !== void 0), i = n.filter((l) => !["unavailable", "unknown"].includes(t?.states?.[l]?.state.toLowerCase() ?? ""));
  for (const l of e.preferredDomains ?? []) {
    const s = i.find((c) => c.startsWith(`${l}.`)) ?? n.find((c) => c.startsWith(`${l}.`));
    if (s) return s;
  }
  return i[0] ?? n[0];
}, Qn = (e) => e.name.replace(/ (Card|Chip)$/, ""), to = (e, t, a = [], o = []) => {
  const r = [.../* @__PURE__ */ new Set([...a, ...o, ...Object.keys(t?.states ?? {})])].filter((k) => t?.states?.[k] !== void 0), n = (k) => {
    const V = t?.states[k];
    return [
      k,
      V?.attributes.friendly_name,
      V?.attributes.device_class,
      V?.attributes.unit_of_measurement
    ].filter(Boolean).join(" ").toLowerCase();
  }, i = (k) => [
    ...k.filter((V) => !["unavailable", "unknown"].includes(t?.states[V]?.state.toLowerCase() ?? "")),
    ...k.filter((V) => ["unavailable", "unknown"].includes(t?.states[V]?.state.toLowerCase() ?? ""))
  ], l = (k) => !["unavailable", "unknown"].includes(t?.states[k]?.state.toLowerCase() ?? ""), s = (k, V) => i(r.filter((A) => k.some((E) => A.startsWith(`${E}.`)) && V.every((E) => n(A).includes(E))))[0], c = (k, V, A) => i(r.filter((E) => k.some(($) => E.startsWith(`${$}.`)) && V.every(($) => n(E).includes($)) && A.every(($) => !n(E).includes($))))[0], _ = (k, V, A = []) => r.find((E) => l(E) && k.some(($) => E.startsWith(`${$}.`)) && V.every(($) => n(E).split(/[^a-z0-9]+/).includes($)) && A.every(($) => !n(E).includes($))), g = (k, V = [], A = []) => i(r.filter((E) => {
    const $ = t?.states[E], G = n(E);
    return E.startsWith("sensor.") && k.includes(String($?.attributes.device_class ?? "")) && V.every((I) => G.includes(I)) && A.every((I) => !G.includes(I));
  }))[0], m = r.filter((k) => /^sensor\.inverter_4/i.test(k)).sort((k, V) => k.localeCompare(V, void 0, { numeric: !0 })), u = (k, V = [], A = []) => r.find((E) => {
    const $ = t?.states[E], G = n(E);
    return l(E) && E.startsWith("sensor.") && k.includes(String($?.attributes.device_class ?? "")) && V.every((I) => G.includes(I)) && A.every((I) => !G.includes(I));
  }), y = r.filter((k) => k.startsWith("media_player.") && n(k).includes("sonos")).sort((k, V) => na(t, V) - na(t, k))[0], x = e.upstreamId === "advanced_home_energy_management" ? s(["sensor"], ["hems", "house", "consumption"]) ?? s(["sensor"], ["house", "consumption"]) ?? g(["power"]) : e.upstreamId === "advanced_energy_buy_sell" ? s(["sensor"], ["hems", "price", "overview"]) ?? s(["sensor"], ["price", "overview"]) ?? s(["sensor"], ["hems", "price"]) : e.upstreamId === "advanced_energy_panel_health" ? m[0] : e.upstreamId === "mini_graph_card" ? g(["temperature"]) ?? g(["power", "energy"]) ?? s(["sensor"], []) : e.upstreamId === "card_media_player" ? s(["media_player"], ["office", "joris", "tv"]) : e.upstreamId === "card_battery" ? c(["sensor"], ["battery", "level"], ["state", "charging"]) ?? g(["battery"], [], ["state", "charging"]) : e.upstreamId === "custom_card_pollen" ? s(["sensor"], ["pollen", "grass"]) : e.upstreamId === "custom_card_speedtest_gauges" ? s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) : e.upstreamId === "custom_card_tablet" ? s(["binary_sensor", "sensor", "switch"], ["tablet"]) : e.upstreamId === "custom_card_nas_metrics" ? s(["switch", "binary_sensor"], ["nas"]) ?? s(["switch", "binary_sensor"], ["status"]) : e.upstreamId === "custom_card_washer" ? s(["sensor"], ["operation", "state"]) ?? s(["sensor"], ["washer", "state"]) : e.upstreamId === "custom_card_sun" ? s(["sun"], []) : e.upstreamId === "custom_card_media_player_sonos" ? y : e.upstreamId === "custom_card_printer" ? s(["sensor", "binary_sensor"], ["printer"]) ?? s(["sensor", "binary_sensor"], ["online"]) : e.upstreamId === "custom_card_weather_metrics" ? s(["weather"], []) : e.upstreamId === "card_room" ? s(["light"], []) : e.upstreamId === "custom_card_plant" ? s(["plant"], []) ?? s(["sensor"], ["soil", "humidity"]) : e.upstreamId === "custom_card_playstation" ? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["xbox"]) ?? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["playstation"]) ?? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["nintendo"]) ?? s(["media_player", "remote"], []) : void 0, f = (e.upstreamId === "card_scenes" ? _(["light"], ["office", "joris"]) ?? _(["light"], []) ?? _(["climate"], []) ?? _(["sensor"], []) : void 0) ?? x ?? Zn(e, t, a, o), S = e.upstreamId === "advanced_energy_panel_health" ? m : void 0, w = e.upstreamId === "custom_card_plant" ? {
    moisture_entity: (f && t?.states[f]?.attributes.device_class === "moisture" ? f : void 0) ?? u(["moisture"], ["soil"]) ?? u(["moisture"]),
    temperature_entity: u(["temperature"], ["soil"]) ?? u(["temperature"], ["plant"]),
    humidity_entity: u(["humidity"], ["plant"]) ?? u(["humidity"], ["soil"]),
    conductivity_entity: u(["conductivity"], ["plant"]) ?? _(["sensor"], ["conductivity"]),
    illuminance_entity: u(["illuminance"], ["plant"]) ?? _(["sensor"], ["plant", "illuminance"]),
    dli_entity: _(["sensor"], ["dli"])
  } : {}, T = Object.entries(w).filter(([, k]) => k).map(([k]) => k.replace(/_entity$/, "")), B = ["text", "navigation"].includes(e.family), j = e.variants?.[0], X = f?.split(".", 1)[0], Z = ["light", "switch", "input_boolean", "fan"].includes(X ?? "") ? { action: "toggle" } : { action: f ? "more-info" : "none" }, L = (k, V) => [...new Set(k.filter((A) => !!A))].slice(0, V), O = s(["sensor"], ["outdoor", "temperature"]) ?? s(["sensor"], ["outside", "temperature"]) ?? s(["sensor"], ["garden", "temperature"]) ?? g(["temperature"], [], ["battery", "cpu", "soil"]), Q = s(["sensor"], ["date", "time"]) ?? s(["sensor"], ["time", "date"]) ?? s(["sensor"], ["date"]), H = [
    [u(["humidity"]), "Humidity"],
    [
      u(["wind_speed"]) ?? _(["sensor"], ["wind", "speed"]) ?? _(["sensor"], ["wind"]),
      "Wind"
    ],
    [
      u(["atmospheric_pressure"]) ?? _(["sensor"], ["barometric", "pressure"]) ?? _(["sensor"], ["pressure"], ["blood"]),
      "Pressure"
    ],
    [
      u(["precipitation", "precipitation_intensity"]) ?? _(["sensor"], ["precipitation"]) ?? _(["sensor"], ["rain"]),
      "Precipitation"
    ],
    [_(["sensor"], ["visibility"]), "Visibility"],
    [_(["sensor"], ["cloud", "coverage"]), "Cloud cover"],
    [_(["sensor"], ["uv", "index"]), "UV index"],
    [u(["illuminance"]), "Light level"],
    [_(["sensor"], ["dew", "point"]), "Dew point"]
  ], ee = Fa(t, f), ae = H.filter(
    ([k], V, A) => !!k && A.findIndex(([E]) => E === k) === V
  ).slice(0, 4), le = e.upstreamId === "custom_card_sun" || e.upstreamId === "custom_card_pollen" || e.upstreamId === "card_welcome_scenes" ? { action: "none" } : e.upstreamId === "custom_card_speedtest_gauges" ? {
    action: "perform-action",
    perform_action: "homeassistant.update_entity",
    target: {
      entity_id: [
        s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) ?? f,
        s(["sensor"], ["speedtest", "upload"]) ?? s(["sensor"], ["upload"]),
        s(["sensor"], ["speedtest", "ping"]) ?? s(["sensor"], ["ping"])
      ].filter((k) => !!k)
    }
  } : e.upstreamId === "custom_card_playstation" ? { action: f ? "more-info" : "none", entity: f } : e.upstreamId === "advanced_home_energy_management" ? { action: "navigate", navigation_path: "/hems-tower/savings-overview" } : e.upstreamId === "custom_card_plant" ? { action: "more-info" } : Z;
  return {
    ...qa(e, t, f),
    name: [
      "advanced_home_energy_management",
      "advanced_energy_buy_sell",
      "advanced_energy_panel_health",
      "custom_card_media_player_sonos"
    ].includes(e.upstreamId) ? void 0 : f ? t?.states[f]?.attributes.friendly_name : Qn(e),
    secondary: f ? void 0 : B ? "Example" : "Preview",
    variant: j,
    tap_action: le,
    show_controls: ["climate", "vacuum", "control"].includes(e.family) || e.family === "media" && e.upstreamId !== "card_media_player" ? !0 : void 0,
    show_forecast: e.family === "weather",
    show_graph: ["battery", "energy", "sensor"].includes(e.family),
    entities: e.upstreamId === "mini_graph_card" && f ? [f] : e.variants?.includes("with-sensors") ? o.slice(0, 2) : void 0,
    panel_entities: S?.length ? S : void 0,
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
      moon_entity: c(["sensor"], ["moon", "phase"], ["angle"]) ?? s(["sensor"], ["moon"]),
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
      ].filter((k) => !!k).map((k) => ({ entity: k }))
    } : {},
    ...e.upstreamId === "card_scenes" ? {
      scene_items: r.filter((k) => k.startsWith("scene.")).slice(0, 7).map((k) => De(t, k))
    } : {},
    ...e.upstreamId === "card_welcome_scenes" ? {
      name: void 0,
      secondary: "Scenes",
      collapse_entity: s(["input_boolean"], ["collapse"]) ?? s(["input_boolean"], ["dropdown"]) ?? s(["input_boolean"], []),
      scene_items: r.filter((k) => k.startsWith("scene.")).slice(0, 5).map((k) => De(t, k))
    } : {},
    ...e.upstreamId === "custom_card_weather_metrics" ? {
      entity: s(["weather"], []) ?? f,
      temperature_entity: O,
      date_entity: Q,
      entities: ae.map(([k]) => k),
      ulm_custom_card_weather_metrics: s(["weather"], []) ?? f,
      ulm_custom_card_weather_metrics_temperature_outside: O,
      ulm_custom_card_weather_metrics_date: Q,
      ...Object.fromEntries(ae.flatMap(([k, V], A) => [
        [`ulm_custom_card_weather_metrics_entity_${A + 1}`, k],
        [`ulm_custom_card_weather_metrics_name_${A + 1}`, V]
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
      console_platform: ee === "generic" ? "auto" : ee,
      console_show_artwork: !0,
      console_show_controls: !0,
      ...Dt(t, f)
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
      carousel_items: L(o, 7).map((k) => ({
        entity: k,
        name: t?.states[k]?.attributes.friendly_name,
        icon: t?.states[k]?.attributes.icon,
        color: "primary",
        tap_action: { action: "more-info" },
        hold_action: { action: "none" }
      }))
    } : {}
  };
}, ei = "0.0.1";
for (const e of _t)
  if (!customElements.get(e.tag)) {
    if (e.upstreamId === "mini_graph_card") {
      customElements.define(e.tag, we);
      continue;
    }
    const t = e;
    class a extends Ae {
      constructor() {
        super(...arguments), this.descriptor = t;
      }
      static getStubConfig(r, n = [], i = []) {
        return to(t, r, n, i);
      }
    }
    customElements.define(e.tag, a);
  }
for (const e of Ct) {
  if (customElements.get(e.tag)) continue;
  const t = ut.find((n) => n.upstreamId === e.targetId);
  if (!t) throw new Error(`Missing alias target ${e.targetId}.`);
  const a = t, o = e.variant;
  class r extends Ae {
    constructor() {
      super(...arguments), this.descriptor = a;
    }
    static getStubConfig(i, l = [], s = []) {
      const c = to(a, i, l, s);
      return o === "divider-title" ? {
        ...c,
        type: `custom:${e.tag}`,
        entity: void 0,
        variant: o,
        name: "Title",
        navigation_path: "",
        tap_action: { action: "none" }
      } : o === "divider-subtitle" ? {
        ...c,
        type: `custom:${e.tag}`,
        entity: void 0,
        variant: o,
        name: "Subtitle",
        tap_action: { action: "none" }
      } : {
        ...c,
        type: `custom:${e.tag}`,
        variant: o,
        show_forecast: e.tag === "mushroom-addition-card-weather-ulm" ? !1 : c.show_forecast
      };
    }
    setConfig(i) {
      super.setConfig({ ...i, variant: i.variant ?? o });
    }
  }
  customElements.define(e.tag, r);
}
window.customCards = window.customCards || [];
const ti = new Set(window.customCards.map((e) => e.type));
for (const e of _t)
  ti.has(e.tag) || window.customCards.push({
    type: e.tag,
    name: `Mushroom Addition: ${e.name}`,
    description: e.description,
    preview: !0,
    documentationURL: "https://github.com/snfx-johaver/mushroom-cards-addition"
  });
console.info(
  `%c MUSHROOM-CARDS-ADDITION %c ${ei} · ${_t.length} components `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;"
);
export {
  _t as CATALOG
};
//# sourceMappingURL=mushroom-cards-addition.js.map
