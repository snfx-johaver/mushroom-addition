const Ve = globalThis, Re = Ve.ShadowRoot && (Ve.ShadyCSS === void 0 || Ve.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, He = /* @__PURE__ */ Symbol(), tt = /* @__PURE__ */ new WeakMap();
let It = class {
  constructor(t, a, r) {
    if (this._$cssResult$ = !0, r !== He) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = a;
  }
  get styleSheet() {
    let t = this.o;
    const a = this.t;
    if (Re && t === void 0) {
      const r = a !== void 0 && a.length === 1;
      r && (t = tt.get(a)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && tt.set(a, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Xt = (e) => new It(typeof e == "string" ? e : e + "", void 0, He), zt = (e, ...t) => {
  const a = e.length === 1 ? e[0] : t.reduce((r, o, n) => r + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + e[n + 1], e[0]);
  return new It(a, e, He);
}, ea = (e, t) => {
  if (Re) e.adoptedStyleSheets = t.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of t) {
    const r = document.createElement("style"), o = Ve.litNonce;
    o !== void 0 && r.setAttribute("nonce", o), r.textContent = a.cssText, e.appendChild(r);
  }
}, at = Re ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let a = "";
  for (const r of t.cssRules) a += r.cssText;
  return Xt(a);
})(e) : e;
const { is: ta, defineProperty: aa, getOwnPropertyDescriptor: ra, getOwnPropertyNames: oa, getOwnPropertySymbols: na, getPrototypeOf: sa } = Object, De = globalThis, rt = De.trustedTypes, ia = rt ? rt.emptyScript : "", la = De.reactiveElementPolyfillSupport, fe = (e, t) => e, Ae = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ia : null;
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
} }, We = (e, t) => !ta(e, t), ot = { attribute: !0, type: String, converter: Ae, reflect: !1, useDefault: !1, hasChanged: We };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), De.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let ce = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, a = ot) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(t, a), !a.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), o = this.getPropertyDescriptor(t, r, a);
      o !== void 0 && aa(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, a, r) {
    const { get: o, set: n } = ra(this.prototype, t) ?? { get() {
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
    const t = sa(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(fe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(fe("properties"))) {
      const a = this.properties, r = [...oa(a), ...na(a)];
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
    return ea(t, this.constructor.elementStyles), t;
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
      const n = (r.converter?.toAttribute !== void 0 ? r.converter : Ae).toAttribute(a, r.type);
      this._$Em = t, n == null ? this.removeAttribute(o) : this.setAttribute(o, n), this._$Em = null;
    }
  }
  _$AK(t, a) {
    const r = this.constructor, o = r._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const n = r.getPropertyOptions(o), i = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : Ae;
      this._$Em = o;
      const l = i.fromAttribute(a, n.type);
      this[o] = l ?? this._$Ej?.get(o) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, a, r, o = !1, n) {
    if (t !== void 0) {
      const i = this.constructor;
      if (o === !1 && (n = this[t]), r ??= i.getPropertyOptions(t), !((r.hasChanged ?? We)(n, a) || r.useDefault && r.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(i._$Eu(t, r)))) return;
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
ce.elementStyles = [], ce.shadowRootOptions = { mode: "open" }, ce[fe("elementProperties")] = /* @__PURE__ */ new Map(), ce[fe("finalized")] = /* @__PURE__ */ new Map(), la?.({ ReactiveElement: ce }), (De.reactiveElementVersions ??= []).push("2.1.2");
const qe = globalThis, nt = (e) => e, Pe = qe.trustedTypes, st = Pe ? Pe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, At = "$lit$", te = `lit$${Math.random().toFixed(9).slice(2)}$`, Pt = "?" + te, ca = `<${Pt}>`, se = document, ve = () => se.createComment(""), we = (e) => e === null || typeof e != "object" && typeof e != "function", Ge = Array.isArray, da = (e) => Ge(e) || typeof e?.[Symbol.iterator] == "function", Ue = `[ 	
\f\r]`, be = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, it = /-->/g, lt = />/g, ae = RegExp(`>|${Ue}(?:([^\\s"'>=/]+)(${Ue}*=${Ue}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ct = /'/g, dt = /"/g, Ct = /^(?:script|style|textarea|title)$/i, Dt = (e) => (t, ...a) => ({ _$litType$: e, strings: t, values: a }), c = Dt(1), _t = Dt(2), me = /* @__PURE__ */ Symbol.for("lit-noChange"), p = /* @__PURE__ */ Symbol.for("lit-nothing"), ut = /* @__PURE__ */ new WeakMap(), ne = se.createTreeWalker(se, 129);
function Et(e, t) {
  if (!Ge(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const _a = (e, t) => {
  const a = e.length - 1, r = [];
  let o, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", i = be;
  for (let l = 0; l < a; l++) {
    const s = e[l];
    let u, h, g = -1, _ = 0;
    for (; _ < s.length && (i.lastIndex = _, h = i.exec(s), h !== null); ) _ = i.lastIndex, i === be ? h[1] === "!--" ? i = it : h[1] !== void 0 ? i = lt : h[2] !== void 0 ? (Ct.test(h[2]) && (o = RegExp("</" + h[2], "g")), i = ae) : h[3] !== void 0 && (i = ae) : i === ae ? h[0] === ">" ? (i = o ?? be, g = -1) : h[1] === void 0 ? g = -2 : (g = i.lastIndex - h[2].length, u = h[1], i = h[3] === void 0 ? ae : h[3] === '"' ? dt : ct) : i === dt || i === ct ? i = ae : i === it || i === lt ? i = be : (i = ae, o = void 0);
    const b = i === ae && e[l + 1].startsWith("/>") ? " " : "";
    n += i === be ? s + ca : g >= 0 ? (r.push(u), s.slice(0, g) + At + s.slice(g) + te + b) : s + te + (g === -2 ? l : b);
  }
  return [Et(e, n + (e[a] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class $e {
  constructor({ strings: t, _$litType$: a }, r) {
    let o;
    this.parts = [];
    let n = 0, i = 0;
    const l = t.length - 1, s = this.parts, [u, h] = _a(t, a);
    if (this.el = $e.createElement(u, r), ne.currentNode = this.el.content, a === 2 || a === 3) {
      const g = this.el.content.firstChild;
      g.replaceWith(...g.childNodes);
    }
    for (; (o = ne.nextNode()) !== null && s.length < l; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const g of o.getAttributeNames()) if (g.endsWith(At)) {
          const _ = h[i++], b = o.getAttribute(g).split(te), y = /([.?@])?(.*)/.exec(_);
          s.push({ type: 1, index: n, name: y[2], strings: b, ctor: y[1] === "." ? ma : y[1] === "?" ? pa : y[1] === "@" ? ha : Ee }), o.removeAttribute(g);
        } else g.startsWith(te) && (s.push({ type: 6, index: n }), o.removeAttribute(g));
        if (Ct.test(o.tagName)) {
          const g = o.textContent.split(te), _ = g.length - 1;
          if (_ > 0) {
            o.textContent = Pe ? Pe.emptyScript : "";
            for (let b = 0; b < _; b++) o.append(g[b], ve()), ne.nextNode(), s.push({ type: 2, index: ++n });
            o.append(g[_], ve());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Pt) s.push({ type: 2, index: n });
      else {
        let g = -1;
        for (; (g = o.data.indexOf(te, g + 1)) !== -1; ) s.push({ type: 7, index: n }), g += te.length - 1;
      }
      n++;
    }
  }
  static createElement(t, a) {
    const r = se.createElement("template");
    return r.innerHTML = t, r;
  }
}
function pe(e, t, a = e, r) {
  if (t === me) return t;
  let o = r !== void 0 ? a._$Co?.[r] : a._$Cl;
  const n = we(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== n && (o?._$AO?.(!1), n === void 0 ? o = void 0 : (o = new n(e), o._$AT(e, a, r)), r !== void 0 ? (a._$Co ??= [])[r] = o : a._$Cl = o), o !== void 0 && (t = pe(e, o._$AS(e, t.values), o, r)), t;
}
class ua {
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
    const { el: { content: a }, parts: r } = this._$AD, o = (t?.creationScope ?? se).importNode(a, !0);
    ne.currentNode = o;
    let n = ne.nextNode(), i = 0, l = 0, s = r[0];
    for (; s !== void 0; ) {
      if (i === s.index) {
        let u;
        s.type === 2 ? u = new xe(n, n.nextSibling, this, t) : s.type === 1 ? u = new s.ctor(n, s.name, s.strings, this, t) : s.type === 6 && (u = new ga(n, this, t)), this._$AV.push(u), s = r[++l];
      }
      i !== s?.index && (n = ne.nextNode(), i++);
    }
    return ne.currentNode = se, o;
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
    t = pe(this, t, a), we(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== me && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : da(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && we(this._$AH) ? this._$AA.nextSibling.data = t : this.T(se.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: a, _$litType$: r } = t, o = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = $e.createElement(Et(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === o) this._$AH.p(a);
    else {
      const n = new ua(o, this), i = n.u(this.options);
      n.p(a), this.T(i), this._$AH = n;
    }
  }
  _$AC(t) {
    let a = ut.get(t.strings);
    return a === void 0 && ut.set(t.strings, a = new $e(t)), a;
  }
  k(t) {
    Ge(this._$AH) || (this._$AH = [], this._$AR());
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
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = a, this._$AM = o, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = p;
  }
  _$AI(t, a = this, r, o) {
    const n = this.strings;
    let i = !1;
    if (n === void 0) t = pe(this, t, a, 0), i = !we(t) || t !== this._$AH && t !== me, i && (this._$AH = t);
    else {
      const l = t;
      let s, u;
      for (t = n[0], s = 0; s < n.length - 1; s++) u = pe(this, l[r + s], a, s), u === me && (u = this._$AH[s]), i ||= !we(u) || u !== this._$AH[s], u === p ? t = p : t !== p && (t += (u ?? "") + n[s + 1]), this._$AH[s] = u;
    }
    i && !o && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ma extends Ee {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class pa extends Ee {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class ha extends Ee {
  constructor(t, a, r, o, n) {
    super(t, a, r, o, n), this.type = 5;
  }
  _$AI(t, a = this) {
    if ((t = pe(this, t, a, 0) ?? p) === me) return;
    const r = this._$AH, o = t === p && r !== p || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== p && (r === p || o);
    o && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ga {
  constructor(t, a, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    pe(this, t);
  }
}
const ba = qe.litHtmlPolyfillSupport;
ba?.($e, xe), (qe.litHtmlVersions ??= []).push("3.3.3");
const ya = (e, t, a) => {
  const r = a?.renderBefore ?? t;
  let o = r._$litPart$;
  if (o === void 0) {
    const n = a?.renderBefore ?? null;
    r._$litPart$ = o = new xe(t.insertBefore(ve(), n), n, void 0, a ?? {});
  }
  return o._$AI(e), o;
};
const Ke = globalThis;
class _e extends ce {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ya(a, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return me;
  }
}
_e._$litElement$ = !0, _e.finalized = !0, Ke.litElementHydrateSupport?.({ LitElement: _e });
const fa = Ke.litElementPolyfillSupport;
fa?.({ LitElement: _e });
(Ke.litElementVersions ??= []).push("4.2.2");
const va = (e) => (t, a) => {
  a !== void 0 ? a.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const wa = { attribute: !0, type: String, converter: Ae, reflect: !1, hasChanged: We }, $a = (e = wa, t, a) => {
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
  return (t, a) => typeof a == "object" ? $a(e, t, a) : ((r, o, n) => {
    const i = o.hasOwnProperty(n);
    return o.constructor.createProperty(n, r), i ? Object.getOwnPropertyDescriptor(o, n) : void 0;
  })(e, t, a);
}
function Mt(e) {
  return Me({ ...e, state: !0, attribute: !1 });
}
const ka = [
  "battery",
  "cover",
  "graph",
  "media_player",
  "room",
  "scenes",
  "welcome_scenes"
], xa = [
  "trash",
  "alarm_time",
  "bar_card",
  "camera",
  "chromecast",
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
  "welcome_dashboard",
  "person_info",
  "person_info_small",
  "playstation",
  "person_tracker",
  "scenes",
  "vehicle_status",
  "plant",
  "speedtest_gauges",
  "better_thermostat",
  "pollen"
], mt = (e) => e.split("_").filter((t) => t.toLowerCase() !== "ulm").map((t) => ["nas", "mdi", "dwd", "vnc", "wifi", "http"].includes(t.toLowerCase()) ? t.toUpperCase() : `${t[0].toUpperCase()}${t.slice(1)}`).join(" "), Sa = (e) => e === "custom_card_bar_card" ? "bar" : e === "custom_card_alarm_time" ? "alarm-time" : /alarm|alert|lock/.test(e) ? "security" : /navigate|back/.test(e) ? "navigation" : /battery/.test(e) ? "battery" : /power_outlet|more_power_outlet/.test(e) ? "control" : /energy|power|gauge|speedtest|graph|apex|bar_card|myenedis/.test(e) ? "energy" : /weather|sun|pollen|moon/.test(e) ? "weather" : /scene/.test(e) ? "scene" : /person|tracker|tracer|presence|room|welcome/.test(e) ? "presence" : /media|chromecast|playstation/.test(e) ? "media" : /thermostat|heat_pump|aircondition|temperature|simple_temp/.test(e) ? "climate" : /cover|door|garage/.test(e) ? "cover" : /vacuum/.test(e) ? "vacuum" : /light/.test(e) ? "light" : /fan|outlet|boolean|script|washer|water_heater|qubino/.test(e) ? "control" : /input_number|input_datetime/.test(e) ? "sensor" : /title|subtitle|clock|date/.test(e) ? "text" : /camera/.test(e) ? "camera" : /sensor|elapsed|update|printer|nas|tablet|flower|car|afval|waste|counter/.test(e) ? "sensor" : "entity", Va = {
  card_media_player: ["default", "controls", "artwork"],
  card_room: ["default", "with-sensors"],
  card_scenes: ["list", "welcome"],
  card_cover: ["default"],
  custom_card_welcome_dashboard: ["message", "weather", "news"],
  custom_card_better_thermostat: ["normal", "compact"]
}, Ia = (e, t) => e === "custom_card_alarm_time" ? ["input_boolean"] : /alarm/.test(e) ? ["alarm_control_panel"] : /lock/.test(e) ? ["lock"] : /power_outlet|more_power_outlet/.test(e) ? ["switch", "light"] : e.includes("binary_sensor") ? ["binary_sensor"] : e.includes("battery") ? ["sensor"] : e.includes("input_boolean") ? ["input_boolean"] : e.includes("input_number") ? ["input_number", "counter", "select", "input_select"] : e.includes("input_datetime") ? ["input_datetime"] : e.includes("light") ? ["light"] : /media|chromecast|playstation/.test(e) ? ["media_player", "sensor"] : /thermostat|heat_pump|aircondition/.test(e) ? ["climate"] : /scene/.test(e) ? ["scene"] : /script/.test(e) ? ["script"] : /vacuum/.test(e) ? ["vacuum"] : /weather/.test(e) ? ["weather"] : /person/.test(e) ? ["person", "device_tracker"] : /cover|door|garage/.test(e) ? ["cover", "binary_sensor"] : /fan/.test(e) ? ["fan"] : /camera/.test(e) ? ["camera"] : /lock/.test(e) ? ["lock"] : /update/.test(e) ? ["update"] : t === "battery" || t === "energy" || t === "sensor" || t === "weather" ? ["sensor"] : t === "control" ? /fan/.test(e) ? ["fan"] : /script/.test(e) ? ["script"] : /washer/.test(e) ? ["switch", "sensor"] : /water_heater/.test(e) ? ["water_heater"] : ["switch", "input_boolean", "light"] : t === "presence" ? ["person", "device_tracker"] : ["sensor", "switch"], pt = (e, t) => {
  const a = e.replace(/^custom_(card|chip)_/, "").replace(/^(card|chip)_/, ""), r = e.replaceAll("_", "-").toLowerCase(), o = r.startsWith("custom-card-") ? `mushroom-addition-${r}` : `mushroom-addition-card-${r.replace(/^card-/, "")}`, n = Sa(e), i = e === "custom_card_playstation", l = {
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
    variants: Va[e],
    variantLabels: e === "custom_card_welcome_dashboard" ? { message: "Welcome message", weather: "Welcome with weather", news: "Welcome with news" } : void 0,
    preferredDomains: Ia(e, n)
  };
}, Ot = [
  ...ka.map((e) => {
    const t = {
      graph: "reference_catalog/cards/card_graph.yaml",
      scenes: "reference_catalog/cards/card_scenes_welcome.yaml"
    };
    return pt(
      `card_${e}`,
      t[e] ?? `reference_catalog/cards/card_${e}.yaml`
    );
  }),
  ...xa.map((e) => pt(
    `custom_card_${e}`,
    e === "better_thermostat" ? "https://github.com/KartoffelToby/better-thermostat-ui-card" : `custom_cards/custom_card_${e}`
  ))
], Lt = [
  {
    canonical: "card_scenes",
    sources: { card_scenes: "welcome-pills", custom_card_scenes: "scene-grid" },
    variants: ["welcome-pills", "scene-grid"],
    variantLabels: { "welcome-pills": "Welcome scene pills", "scene-grid": "Scene button grid" },
    name: "Scenes Card"
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
], he = /* @__PURE__ */ new Map();
for (const e of Lt)
  for (const t of Object.keys(e.sources)) he.set(t, e);
const Tt = new Set(Lt.map((e) => e.canonical)), Oe = Ot.filter((e) => !he.has(e.upstreamId) || Tt.has(e.upstreamId)).map((e) => {
  const t = he.get(e.upstreamId);
  return t ? {
    ...e,
    name: t.name ?? e.name,
    description: t.description ?? e.description,
    variants: t.variants,
    variantLabels: t.variantLabels,
    sourceIds: Object.keys(t.sources)
  } : { ...e, sourceIds: [e.upstreamId] };
}), Ze = Ot.filter((e) => he.has(e.upstreamId) && !Tt.has(e.upstreamId)).map((e) => {
  const t = he.get(e.upstreamId), a = Oe.find((r) => r.upstreamId === t.canonical);
  return {
    upstreamId: e.upstreamId,
    tag: e.tag,
    targetId: a.upstreamId,
    targetTag: a.tag,
    variant: t.sources[e.upstreamId]
  };
}), Le = Oe, ht = (e) => Le.find((t) => t.tag === e) ?? (() => {
  const t = Ze.find((a) => a.tag === e);
  return t ? Oe.find((a) => a.tag === t.targetTag) : void 0;
})(), gt = (e) => he.get(e)?.sources[e], Be = [
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
], Nt = (e, t, a = e.enabledByDefault) => ({
  preset: e.preset,
  enabled: a,
  entity: t,
  label: e.label,
  icon: e.icon,
  color: e.color
}), za = () => Be.map((e) => Nt(e)), oe = (e) => {
  if (e.waste_streams?.length) return e.waste_streams.map((r) => ({ ...r }));
  const t = e.type.includes("custom-card-trash"), a = Be.some((r) => r.legacyKey && typeof e[r.legacyKey] == "string");
  return !t && !a ? [] : Be.map((r, o) => {
    const i = (r.legacyKey && typeof e[r.legacyKey] == "string" ? e[r.legacyKey] : void 0) ?? (o === 0 ? e.entity : void 0);
    return Nt(r, i, i ? !0 : r.enabledByDefault);
  });
}, Aa = (e) => {
  const t = e.type.includes("custom-card-trash"), a = e.today_entity ?? (typeof e.ulm_card_ophaling_vandaag == "string" ? e.ulm_card_ophaling_vandaag : void 0), r = e.tomorrow_entity ?? (typeof e.ulm_card_ophaling_morgen == "string" ? e.ulm_card_ophaling_morgen : void 0);
  if (!t && !a && !r) return e;
  const o = e.waste_streams?.length ? e.waste_streams : oe(e);
  return {
    ...e,
    waste_streams: o.length ? o : e.waste_streams,
    today_entity: a,
    tomorrow_entity: r,
    show_today: e.show_today ?? !!a,
    show_tomorrow: e.show_tomorrow ?? !!r
  };
}, ee = /* @__PURE__ */ new Set([
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
]), v = (e) => {
  if (!e) return "Entity unavailable";
  const t = e.attributes.unit_of_measurement;
  return t ? `${e.state} ${String(t)}` : e.state.replaceAll("_", " ");
}, bt = (e) => {
  if (typeof e == "string") return e;
  const t = Array.isArray(e) ? e : [e];
  return t.every((a) => a.type === "text") ? t.map((a) => a.text ?? "").join(" ") : void 0;
}, H = (e, t, a) => {
  const r = e.name !== void 0 && typeof e.name != "string";
  return r && t && a?.formatEntityName ? a.formatEntityName(t, e.name) : r ? bt(e.name) || t?.attributes.friendly_name || e.entity || "" : e.name_mode === "none" ? "" : e.name_mode === "entity" ? t?.attributes.friendly_name || e.entity || "" : e.name && t && a?.formatEntityName ? a.formatEntityName(t, e.name) : (e.name ? bt(e.name) : void 0) || t?.attributes.friendly_name || e.entity || "";
}, ue = (e, t, a) => {
  e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    composed: !0,
    detail: a
  }));
}, Pa = (e, t, a) => {
  ue(e, "hass-action", { config: t, action: a });
}, Ca = (e) => {
  const t = Ma(e), a = Da(t), r = String(t.type), o = r.includes("card-title"), n = r.includes("card-welcome-scenes"), i = r.includes("card-weather"), l = r.includes("custom-card-camera"), s = r.includes("card-weather-ulm") || t.variant === "native", u = r.includes("custom-card-sun") || r.includes("custom-card-thermostat-controls") ? { action: "none" } : void 0, h = String(a.type).includes("custom-card-qubino") ? a.qubino_more_info_entity ?? a.entity : void 0, g = r.endsWith("custom-card-pollen"), _ = [
    a.download_entity,
    a.upload_entity,
    a.ping_entity
  ].filter((x) => typeof x == "string"), b = String(a.type).includes("speedtest-gauges"), y = a.variant === "divider-title", T = a.variant === "divider-subtitle", w = b ? {
    action: "perform-action",
    perform_action: "homeassistant.update_entity",
    target: { entity_id: _ }
  } : T || y && !a.navigation_path ? { action: "none" } : g ? { action: "none" } : h ? { action: "more-info", entity: h } : a.navigation_path ? { action: "navigate", navigation_path: a.navigation_path } : u ?? { action: o || n ? "none" : a.entity ? "more-info" : "none" }, k = String(e.type).includes("card-room") && a.input_select_entity && a.input_select_option ? {
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
    tap_action: a.tap_action ?? w,
    show_controls: a.show_controls ?? (r.includes("card-vacuum") ? !0 : void 0),
    show_forecast: a.show_forecast ?? (i ? !s : void 0),
    hold_action: a.hold_action ?? (String(a.type).includes("water-heater") && a.entity ? { action: "more-info" } : a.variant === "small" && typeof a.ulm_card_person_battery_entity == "string" ? { action: "more-info", entity: a.ulm_card_person_battery_entity } : void 0),
    double_tap_action: a.double_tap_action ?? k
  };
}, le = (e, t) => Object.entries(e).find(([a, r]) => t.test(a) && r !== void 0)?.[1], Da = (e) => {
  const t = le(e, /_name$/), a = le(e, /_icon$/), r = le(e, /_color$/), o = le(e, /_enable_(controls|buttons)$/), n = le(e, /_enable_slider$/), i = le(e, /_enable_horizontal$/);
  return {
    ...e,
    name: e.name ?? (typeof t == "string" ? t : void 0),
    icon: e.icon ?? (typeof a == "string" ? a : void 0),
    icon_color: e.icon_color ?? (typeof r == "string" ? r : void 0),
    navigation_path: e.navigation_path,
    show_controls: e.show_controls ?? (typeof o == "boolean" ? o : typeof n == "boolean" ? n : void 0),
    layout: e.layout ?? (i === !0 ? "horizontal" : void 0)
  };
}, Ea = [
  "ulm_card_person_entity",
  "ulm_card_media_player_entity",
  "ulm_card_cover_entity",
  "ulm_card_graph_entity",
  "ulm_card_person_location_entity",
  "ulm_card_input_number_entity",
  "ulm_custom_card_entity_overview",
  "ulm_custom_card_weather_metrics"
], Ma = (e) => {
  const t = Aa(e), a = t.primary_entity || Ea.map((n) => t[n]).find((n) => typeof n == "string"), r = (n) => {
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
      const u = s, h = r(u);
      if (h)
        return {
          entity: h,
          name: typeof u.name == "string" ? u.name : void 0,
          icon: typeof u.icon == "string" ? u.icon : void 0,
          color: typeof u.color == "string" ? u.color : void 0,
          state: typeof u.state == "string" ? u.state : void 0,
          nav_path: typeof u.nav_path == "string" ? u.nav_path : void 0,
          service_data: u.service_data && typeof u.service_data == "object" ? u.service_data : void 0
        };
    }).filter((i) => i !== void 0);
    n.length && (o.scene_items = n);
  }
  if (String(e.type).includes("person-location") && (o.entity ??= r(e.ulm_card_person_location_entity), o.wifi_tracker_entity ??= r(e.ulm_card_person_location_wifi_tracker), o.gps_tracker_entity ??= r(e.ulm_card_person_location_gps_tracker), o.findmy_script_entity ??= r(e.ulm_card_person_location_findmy_script), o.use_entity_picture ??= e.ulm_card_person_location_use_entity_picture === !0), String(e.type).includes("entity-overview") && (o.entity ??= r(e.ulm_custom_card_entity_overview), o.entities ??= [1, 2, 3, 4].map((n) => r(e[`ulm_custom_card_entity_overview_entity_${n}`])).filter((n) => n !== void 0)), String(e.type).includes("internet-speed") && (o.download_entity ??= r(e.ulm_custom_card_internet_speed_download_speed_entity), o.upload_entity ??= r(e.ulm_custom_card_internet_speed_upload_speed_entity), o.ping_entity ??= r(e.ulm_custom_card_internet_speed_ping_entity), o.entity ??= o.download_entity), String(e.type).includes("weather-metrics") && (o.entity ??= r(e.ulm_custom_card_weather_metrics), o.temperature_entity ??= r(e.ulm_custom_card_weather_metrics_temperature_outside), o.date_entity ??= r(e.ulm_custom_card_weather_metrics_date), o.entities ??= [1, 2, 3, 4].map((n) => r(e[`ulm_custom_card_weather_metrics_entity_${n}`])).filter((n) => n !== void 0)), String(e.type).includes("custom-card-washer") && (o.entity ??= r(e.ulm_custom_card_washer_machine_state) ?? r(e.ulm_custom_card_washer_power), o.power_entity ??= r(e.ulm_custom_card_washer_power), o.ulm_custom_card_washer_machine_state ??= o.entity), String(e.type).includes("custom-card-thermostat-controls") && (o.entity ??= r(e.entity), o.variant ??= "buttons"), String(e.type).includes("media-player-sonos") && (o.entity ??= r(e.ulm_card_media_player_with_controls_entity)), String(e.type).includes("more-power-outlet") && (o.power_entity ??= r(
    e.custom_card_more_power_outlet_power_sensor ?? e.ulm_card_more_power_outlet_power_sensor ?? e.graph_entity
  ), o.energy_entity ??= r(
    e.custom_card_more_power_outlet_energy_sensor ?? e.ulm_card_more_power_outlet_energy_sensor
  ), o.time_entity ??= r(
    e.custom_card_more_power_outlet_time_sensor ?? e.ulm_card_more_power_outlet_time_sensor
  )), String(e.type).includes("gauge") && (o.minimum ??= Number(e.ulm_card_gauge_min ?? 0), o.maximum ??= Number(e.ulm_card_gauge_max ?? 100)), String(e.type).includes("printer") && (o.black_entity ??= r(e.ulm_card_printer_black_name), o.yellow_entity ??= r(e.ulm_card_printer_yellow_name), o.magenta_entity ??= r(e.ulm_card_printer_magenta_name), o.cyan_entity ??= r(e.ulm_card_printer_cyan_name)), String(e.type).includes("welcome-dashboard") && (o.time_entity ??= r(e.ulm_custom_card_welcome_dashboard_time), o.weather_entity ??= r(e.ulm_custom_card_welcome_dashboard_weather_provider) ?? r(e.ulm_weather), o.news_entities ??= Array.isArray(e.ulm_custom_card_welcome_dashboard_news_entities) ? e.ulm_custom_card_welcome_dashboard_news_entities.flatMap((n) => {
    const i = r(n);
    return i ? [i] : [];
  }) : void 0, o.variant ??= o.news_entities?.length ? "news" : o.weather_entity ? "weather" : "message"), String(e.type).includes("person-tracker") && (o.use_entity_picture ??= e.ulm_custom_card_person_tracker_use_entity_picture === !0, o.ulm_custom_card_person_tracker_camera_entity_light ??= r(e.ulm_card_person_tracker_camera), o.ulm_custom_card_person_tracker_camera_entity_dark ??= r(e.ulm_card_person_tracker_camera), o.ulm_custom_card_person_tracker_map_enable ??= typeof e.ulm_card_person_tracker_show_map == "boolean" ? e.ulm_card_person_tracker_show_map : void 0), String(e.type).endsWith("custom-card-pollen") && (o.trees_entity ??= r(e.custom_card_pollen_tree), o.grass_entity ??= r(e.custom_card_pollen_grass), o.weeds_entity ??= r(e.custom_card_pollen_weed)), String(e.type).includes("speedtest-gauges") && (o.download_entity ??= r(e.ulm_custom_card_speedtest_download_speed_entity) ?? o.entity, o.upload_entity ??= r(e.ulm_custom_card_speedtest_upload_speed_entity), o.ping_entity ??= r(e.ulm_custom_card_speedtest_ping_entity), o.entity = r(o.download_entity)), String(e.type).includes("custom-card-pollen-forecast") && (o.level_entity ??= r(e.level_entity), o.name ??= typeof e.ulm_custom_card_pollen_forecast_name == "string" ? e.ulm_custom_card_pollen_forecast_name : void 0, o.icon ??= typeof e.ulm_custom_card_pollen_forecast_icon == "string" ? e.ulm_custom_card_pollen_forecast_icon : void 0), String(e.type).includes("custom-card-scenes") || String(e.type).includes("card-scenes") && e.variant === "scene-grid") {
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
    !o.scene_items?.length && n.length && (o.scene_items = n);
  }
  return String(e.type).includes("vehicle-status") && (o.entity ??= r(e.ulm_card_vehicle_status_tracker), o.ulm_card_vehicle_status_tracker ??= o.entity, o.ulm_card_vehicle_status_energy_level ??= r(e.energy_entity) ?? r(e.battery_entity), o.ulm_card_vehicle_status_range ??= r(e.range_entity), o.ulm_card_vehicle_status_lock ??= r(e.lock_entity) ?? r(e.doors_entity)), String(e.type).includes("plant") && (o.entity ??= r(e.ulm_card_flower_entity), o.ulm_card_flower_entity ??= o.entity), o;
}, yt = {
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
}, Oa = (e, t) => {
  const a = e?.language?.split("-")[0] ?? "en";
  return yt[a]?.[t] ?? yt.en[t] ?? t.replace(/^ulm_(?:custom_)?card_/, "").replace(/^(?:custom_)?card_/, "").replace(/^ulm_/, "").replaceAll("_", " ").replace(/\b\w/g, (r) => r.toUpperCase());
}, La = {
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
  news_entities: "Up to three entities shown in the compact source-compatible news feed.",
  qubino_more_info_entity: "Entity opened by the Qubino card surface, matching the source pilot-wire input select.",
  ulm_custom_card_person_tracker_use_entity_picture: "Uses the person's entity picture instead of the fallback face icon.",
  ulm_custom_card_person_tracker_use_badge: "Shows the source location or driving badge over the person icon.",
  ulm_custom_card_person_tracker_driving_entity: "Binary sensor whose active state replaces the location label with Driving.",
  ulm_custom_card_person_tracker_zones: "Zone entities used to resolve custom location icons and colors.",
  ulm_custom_card_person_tracker_find_device_script: "Optional script or button shown as the source find-device control.",
  ulm_custom_card_person_tracker_map_enable: "Shows the source built-in map row equivalent.",
  ulm_custom_card_person_tracker_map_aspect_ratio: "Aspect ratio used by the built-in map row, such as 466:200.",
  ulm_custom_card_person_tracker_map_hours_to_show: "Number of location-history hours requested by the source map.",
  ulm_custom_card_person_tracker_map_default_zoom: "Default zoom requested by the source map.",
  ulm_custom_card_person_tracker_camera_entity_light: "Light-theme static-map camera entity.",
  ulm_custom_card_person_tracker_camera_entity_dark: "Dark-theme static-map camera entity; both camera fields are required for static-map mode.",
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
  ulm_card_media_player_with_controls_name: "Friendly name shown for the Chromecast or media player.",
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
  custom_card_pollen_tree_name: "Optional tree item label; leave empty to use the entity friendly name or localized default.",
  custom_card_pollen_tree_icon: "Optional tree item icon; leave empty to use the entity icon or source default.",
  custom_card_pollen_grass_name: "Optional grass item label; leave empty to use the entity friendly name or localized default.",
  custom_card_pollen_grass_icon: "Optional grass item icon; leave empty to use the entity icon or source default.",
  custom_card_pollen_weed_name: "Optional weed item label; leave empty to use the entity friendly name or localized default.",
  custom_card_pollen_weed_icon: "Optional weed item icon; leave empty to use the entity icon or source default."
}, Ta = (e) => La[e], Na = [
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
    upstreamId: "card_cover",
    sourcePath: "reference_catalog/cards/card_cover.yaml",
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
    upstreamId: "custom_card_welcome_dashboard",
    sourcePath: "custom_cards/custom_card_welcome_dashboard",
    publicId: "custom_card_welcome_dashboard",
    rendererId: "custom_card_welcome_dashboard",
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
        name: "ulm_custom_card_welcome_dashboard_news_entities",
        defaultValue: "<documented/inherited>",
        selector: "entity-multiple"
      },
      {
        name: "ulm_custom_card_welcome_dashboard_time",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_welcome_dashboard_weather_provider",
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
    upstreamId: "custom_card_person_tracker",
    sourcePath: "custom_cards/custom_card_person_tracker",
    publicId: "custom_card_person_tracker",
    rendererId: "custom_card_person_tracker",
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
        name: "ulm_custom_card_person_tracker_camera_entity_dark",
        defaultValue: '""',
        selector: "text"
      },
      {
        name: "ulm_custom_card_person_tracker_camera_entity_light",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_custom_card_person_tracker_find_device_script",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_custom_card_person_tracker_icon",
        defaultValue: '"[[[ return entity.attributes.icon ]]]"',
        selector: "icon"
      },
      {
        name: "ulm_custom_card_person_tracker_map_aspect_ratio",
        defaultValue: '"466:200"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_person_tracker_map_default_zoom",
        defaultValue: "11",
        selector: "number"
      },
      {
        name: "ulm_custom_card_person_tracker_map_enable",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_person_tracker_map_hours_to_show",
        defaultValue: "0",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_person_tracker_name",
        defaultValue: '"[[[ return entity.attributes.friendly_name ]]]"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_person_tracker_driving",
        defaultValue: '"Porusza się"',
        selector: "text"
      },
      {
        name: "ulm_custom_card_person_tracker_driving_entity",
        defaultValue: '""',
        selector: "entity"
      },
      {
        name: "ulm_custom_card_person_tracker_language_variables",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_person_tracker_language_variables1",
        defaultValue: "<documented/inherited>",
        selector: "text"
      },
      {
        name: "ulm_custom_card_person_tracker_use_badge",
        defaultValue: "true",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_person_tracker_use_entity_picture",
        defaultValue: "false",
        selector: "boolean"
      },
      {
        name: "ulm_custom_card_person_tracker_zones",
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
], Je = new Map(Na.map((e) => [e.upstreamId, e])), Ua = (e) => /popup|browser_mod/i.test(e), ja = {
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
}, Ut = /* @__PURE__ */ new Set([
  "ulm_card_battery_name",
  "ulm_card_cover_name",
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
  "ulm_custom_card_pollen_forecast_name",
  "ulm_custom_card_person_tracker_name"
]), Fa = /* @__PURE__ */ new Set([
  "ulm_card_person_use_entity_picture",
  "ulm_custom_card_person_tracker_use_entity_picture"
]), Ba = (e, t) => Ut.has(t) || Fa.has(t) || (ja[e.upstreamId]?.includes(t) ?? !1), Ra = {
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
  ]
}, Ha = {
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
}, jt = (e, t) => !Ua(t) && ([e.upstreamId, ...e.sourceIds ?? []].some((a) => Ha[a]?.includes(t) === !0) || Ra[e.family]?.includes(t) === !0), m = (e, t = "entity") => ({
  name: t,
  selector: { entity: e?.length ? { domain: e } : {} }
}), U = (e) => ({ name: e, selector: { text: {} } }), O = (e) => ({ name: e, selector: { boolean: {} } }), J = (e, t = 1, a = 168) => ({
  name: e,
  selector: { number: { min: t, max: a, mode: "box" } }
}), Ie = (e) => ({
  name: e,
  selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
}), re = (e) => ({ name: e, selector: { ui_action: {} } }), Y = (e, t) => ({
  name: e,
  selector: { select: { mode: "dropdown", options: t } }
}), Wa = {
  battery_healthy_color: "green",
  battery_warning_color: "yellow",
  battery_low_color: "orange",
  battery_critical_color: "red",
  ulm_card_cover_color: "blue",
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
}, Q = (e) => ({
  name: e,
  selector: { ui_color: { default_color: Wa[e] } }
}), ft = (e) => ({ ...e, presentation: !0 }), vt = (e) => ({
  type: "grid",
  name: "",
  schema: e,
  presentation: !0
}), qa = /* @__PURE__ */ new Set([
  "ulm_card_battery_battery_level_danger",
  "ulm_card_battery_battery_level_warning",
  "ulm_card_cover_slider_min",
  "ulm_card_cover_slider_max",
  "ulm_card_cover_favorite_percentage"
]), Ga = /* @__PURE__ */ new Set([
  "ulm_custom_card_bar_card_indicator",
  "ulm_custom_card_bar_card_show_icon",
  "ulm_custom_card_bar_card_value",
  "ulm_card_media_player_collapsible",
  "ulm_card_media_player_idle_off",
  "ulm_card_media_player_more_info",
  "ulm_card_media_player_power_button",
  "ulm_card_media_player_force_background_color"
]), Ka = /* @__PURE__ */ new Set([
  "ulm_custom_card_bar_card_min",
  "ulm_custom_card_bar_card_max",
  "ulm_card_graph_hours",
  "ulm_card_graph_line_width",
  "ulm_card_graph_points",
  "ulm_card_media_player_enable_volume_adjust"
]), Za = /* @__PURE__ */ new Set([
  "ulm_card_cover_icon"
]), wt = /* @__PURE__ */ new Set([
  "ulm_card_person_entity",
  "ulm_card_person_zone1",
  "ulm_card_person_zone2",
  "ulm_address",
  "ulm_address_locality",
  "ulm_card_person_driving_entity",
  "ulm_card_person_battery_entity",
  "ulm_card_person_battery_state_entity",
  "ulm_card_person_commute_entity"
]), Ja = /* @__PURE__ */ new Set([
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
]), Ya = {}, M = () => [
  ft({
    name: "name",
    selector: { entity_name: {} },
    context: { entity: "entity" }
  }),
  ft({
    name: "icon",
    selector: { icon: {} },
    context: { icon_entity: "entity" }
  }),
  vt([
    Y("layout", [
      { value: "default", label: "Default" },
      { value: "horizontal", label: "Horizontal" },
      { value: "vertical", label: "Vertical" }
    ]),
    O("fill_container")
  ]),
  vt([
    Y("primary_info", [
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" }
    ]),
    Y("secondary_info", [
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
], Qa = /* @__PURE__ */ new Set([
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
  "custom_card_welcome_dashboard",
  "custom_card_playstation",
  "custom_card_speedtest_gauges",
  "custom_card_pollen"
]), Ft = (e) => e.flatMap((t) => t.name === "icon" || t.name === "icon_type" ? [] : t.schema ? [{ ...t, schema: Ft(t.schema) }] : [t]), Xa = (e) => {
  if (!e.some((i) => i.presentation)) return e;
  const t = e.filter((i) => i.presentation), a = /* @__PURE__ */ new Set(["name", "icon"]), r = e.filter((i) => !i.presentation && !a.has(i.name) && !Ut.has(i.name)), o = r.findIndex((i) => i.name === "entity");
  if (o < 0) return [...t, ...r];
  const [n] = r.splice(o, 1);
  return [n, ...t, ...r];
}, er = (e) => {
  const t = { ...e };
  return delete t.presentation, t;
}, Z = (e) => [
  m(e.preferredDomains),
  ...e.variants?.length ? [Y("variant", e.variants.map((t) => ({
    value: t,
    label: e.variantLabels?.[t] ?? t.replaceAll("-", " ").replace(/\b\w/g, (a) => a.toUpperCase())
  })))] : [],
  ...M()
], $t = {
  weather: (e) => [
    ...Z(e),
    m(["sensor"], "temperature_entity"),
    m(["sensor"], "humidity_entity"),
    O("show_forecast")
  ],
  climate: (e) => [...Z(e), m(["sensor"], "humidity_entity"), O("show_controls")],
  light: (e) => [...Z(e)],
  scene: (e) => [
    ...e.upstreamId === "card_welcome_scenes" ? [m(), ...M()] : Z(e),
    ...e.upstreamId === "card_welcome_scenes" ? [
      m(["input_boolean"], "collapse_entity"),
      m(["weather"], "weather_entity"),
      U("settings_path"),
      O("collapsed")
    ] : []
  ],
  presence: (e, t) => [
    ...Z(e),
    ...e.upstreamId === "card_room" ? [] : [
      ...t?.variant === "small" ? [] : [
        m(["sensor"], "battery_entity"),
        m(["sensor"], "eta_entity"),
        m(["sensor"], "address_entity")
      ]
    ]
  ],
  battery: (e) => [
    ...Z(e),
    Ie("battery_warning_threshold"),
    Ie("battery_low_threshold"),
    Ie("battery_critical_threshold"),
    Q("battery_healthy_color"),
    Q("battery_warning_color"),
    Q("battery_low_color"),
    Q("battery_critical_color")
  ],
  bar: (e) => [...Z(e)],
  energy: (e) => [...Z(e), m(["sensor"], "min_entity"), m(["sensor"], "max_entity"), O("show_graph")],
  sensor: (e) => [...Z(e), O("show_graph")],
  media: (e) => [...Z(e), O("show_controls")],
  cover: (e) => [...Z(e), O("show_controls")],
  security: (e) => [...Z(e)],
  navigation: (e) => [
    ...e.variants?.length ? [Y("variant", e.variants.map((t) => ({
      value: t,
      label: e.variantLabels?.[t] ?? t
    })))] : [],
    ...M(),
    U("navigation_path")
  ],
  text: () => [...M(), U("secondary")],
  camera: (e) => [...Z(e)],
  control: (e) => [
    ...Z(e),
    .../power_outlet|more_power_outlet/.test(e.upstreamId) ? [m(["sensor"], "graph_entity"), O("show_graph")] : [],
    O("show_controls")
  ],
  "alarm-time": (e) => [...Z(e), m(["input_datetime"], "datetime_entity"), O("show_controls")],
  door: (e) => [...Z(e), m(["lock"], "lock_entity"), m(["sensor"], "battery_entity"), O("show_controls")],
  entity: (e) => [...Z(e), U("secondary")]
}, Bt = (e, t) => {
  const a = [
    ...e.upstreamId === "card_room" ? [
      m(),
      O("label_use_temperature"),
      O("label_use_brightness"),
      m(["input_select"], "input_select_entity"),
      U("input_select_option"),
      ...M()
    ] : e.upstreamId === "card_scenes" ? [
      ...e.variants?.length ? [Y("variant", e.variants.map((o) => ({
        value: o,
        label: e.variantLabels?.[o] ?? o
      })))] : [],
      ...M()
    ] : e.upstreamId === "custom_card_trash" ? [
      m(["sensor", "calendar"]),
      O("show_today"),
      m(["sensor"], "today_entity"),
      O("show_tomorrow"),
      m(["sensor"], "tomorrow_entity"),
      ...M()
    ] : e.upstreamId === "custom_card_welcome_dashboard" ? [
      ...e.variants?.length ? [Y("variant", e.variants.map((o) => ({
        value: o,
        label: e.variantLabels?.[o] ?? o
      })))] : [],
      m(["person"]),
      m(["sensor"], "time_entity"),
      m(["weather"], "weather_entity"),
      { name: "news_entities", selector: { entity: { multiple: !0 } } },
      ...M()
    ] : e.upstreamId === "custom_card_playstation" ? [
      m(["media_player", "sensor"]),
      ...M()
    ] : e.upstreamId === "custom_card_person_tracker" ? [
      m(["person", "device_tracker"]),
      O("ulm_custom_card_person_tracker_use_badge"),
      m(["sensor"], "battery_entity"),
      m(["binary_sensor"], "ulm_custom_card_person_tracker_driving_entity"),
      { name: "ulm_custom_card_person_tracker_zones", selector: { entity: { multiple: !0 } } },
      m(["script", "button"], "ulm_custom_card_person_tracker_find_device_script"),
      O("ulm_custom_card_person_tracker_map_enable"),
      U("ulm_custom_card_person_tracker_map_aspect_ratio"),
      J("ulm_custom_card_person_tracker_map_hours_to_show", 0, 168),
      J("ulm_custom_card_person_tracker_map_default_zoom", 1, 20),
      m(["camera"], "ulm_custom_card_person_tracker_camera_entity_light"),
      m(["camera"], "ulm_custom_card_person_tracker_camera_entity_dark"),
      ...M()
    ] : e.upstreamId === "custom_card_alarm_time" ? [
      m(["input_boolean", "switch"]),
      m(["input_datetime"], "datetime_entity"),
      J("ulm_card_alarm_time_step", 1, 180),
      O("ulm_card_alarm_time_collapse"),
      O("ulm_card_alarm_time_horizontal"),
      { name: "ulm_card_alarm_time_icon", selector: { icon: {} } },
      Q("ulm_card_alarm_time_color"),
      ...M()
    ] : e.upstreamId === "custom_card_better_thermostat" ? [
      m(["climate"]),
      Y("variant", [
        { value: "normal", label: "Normal" },
        { value: "compact", label: "Compact" }
      ]),
      ...M(),
      m(["binary_sensor"], "window_sensor"),
      m(["sensor"], "humidity_entity"),
      m(["sensor"], "battery_entity"),
      O("show_controls"),
      O("show_temperature_control"),
      O("show_humidity"),
      O("show_hvac_modes"),
      O("show_presets"),
      O("show_status"),
      O("collapsible_controls"),
      J("thermostat_temp_step", 0.1, 5),
      Ie("low_battery_threshold")
    ] : e.upstreamId === "custom_card_camera" ? [
      m(["camera"]),
      ...M(),
      Y("camera_view", [
        { value: "auto", label: "Automatic" },
        { value: "live", label: "Live stream" }
      ]),
      Y("fit_mode", [
        { value: "cover", label: "Crop to fill" },
        { value: "contain", label: "Fit entire image" },
        { value: "fill", label: "Stretch to fill" }
      ]),
      U("aspect_ratio"),
      J("image_height", 80, 1200)
    ] : e.upstreamId === "custom_card_chromecast" ? [
      m(["media_player"]),
      ...M()
    ] : e.upstreamId === "custom_card_media_player_sonos" ? [
      m(["media_player"]),
      ...M()
    ] : e.upstreamId === "custom_card_more_power_outlet" ? [
      m(["switch", "light"]),
      m(["sensor"], "power_entity"),
      m(["sensor"], "energy_entity"),
      m(["sensor"], "time_entity"),
      ...M()
    ] : e.upstreamId === "custom_card_gauge" ? [
      m(["sensor"]),
      J("minimum", -1e5, 1e5),
      J("maximum", -1e5, 1e5),
      ...M()
    ] : e.upstreamId === "custom_card_printer" ? [
      m(["sensor", "binary_sensor"]),
      m(["sensor"], "black_entity"),
      m(["sensor"], "yellow_entity"),
      m(["sensor"], "magenta_entity"),
      m(["sensor"], "cyan_entity"),
      ...M()
    ] : e.upstreamId === "custom_card_pollen_forecast" ? [
      m(["sensor"]),
      m(["sensor"], "level_entity"),
      { name: "ulm_custom_card_pollen_forecast_icon", selector: { icon: {} } },
      Y("pollen_language", [
        { value: "en", label: "English" },
        { value: "de", label: "German" },
        { value: "es", label: "Spanish" },
        { value: "pl", label: "Polish" }
      ]),
      ...M()
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
      ...M()
    ] : e.upstreamId === "custom_card_room_overview" ? [
      m(),
      m(["light"], "ulm_custom_card_room_overview_light_entity"),
      m(["climate"], "ulm_custom_card_room_overview_climate_entity"),
      m(["cover"], "ulm_custom_card_room_overview_cover_entity"),
      { name: "ulm_card_room_overview_light_icon_on", selector: { icon: {} } },
      { name: "ulm_card_room_overview_light_icon_off", selector: { icon: {} } },
      { name: "ulm_card_room_overview_cover_icon_open", selector: { icon: {} } },
      { name: "ulm_card_room_overview_cover_icon_closed", selector: { icon: {} } },
      O("ulm_card_dynamic_color"),
      U("secondary"),
      ...M()
    ] : e.upstreamId === "custom_card_welcome" ? [
      m(["person"]),
      m(["input_boolean"], "ulm_card_welcome_collapse"),
      m(["weather"], "ulm_weather"),
      ...Array.from({ length: 5 }, (o, n) => n + 1).flatMap((o) => [
        U(`nav_${o}`),
        { name: `icon_${o}`, selector: { icon: {} } },
        U(`name_${o}`),
        Y(`color_${o}`, ["blue", "red", "green", "yellow", "pink", "purple"].map((n) => ({
          value: n,
          label: n[0].toUpperCase() + n.slice(1)
        })))
      ]),
      ...M()
    ] : e.upstreamId === "custom_card_vehicle_status" ? [
      m(["device_tracker", "sensor"]),
      m(["device_tracker", "sensor"], "ulm_card_vehicle_status_tracker"),
      m(["lock", "binary_sensor"], "ulm_card_vehicle_status_lock"),
      m(["sensor"], "ulm_card_vehicle_status_energy_level"),
      m(["sensor"], "ulm_card_vehicle_status_range"),
      ...M()
    ] : e.upstreamId === "custom_card_plant" ? [
      m(["plant", "sensor"]),
      m(["plant", "sensor"], "ulm_card_flower_entity"),
      U("ulm_card_flower_species"),
      { name: "ulm_card_flower_show_bars", selector: { object: {} } },
      ...M()
    ] : e.upstreamId === "custom_card_washer" ? [
      m(["sensor", "switch", "binary_sensor"]),
      m(["sensor", "switch", "binary_sensor"], "power_entity"),
      m(["sensor", "binary_sensor"], "door_entity"),
      m(["sensor", "binary_sensor"], "finished_entity"),
      m(["sensor", "binary_sensor"], "ulm_custom_card_washer_remote_control"),
      m(["sensor"], "ulm_custom_card_washer_job_progress"),
      m(["input_boolean"], "ulm_custom_card_washer_delayed_start"),
      m(["input_datetime"], "ulm_custom_card_washer_delayed_starttime"),
      U("ulm_custom_card_washer_machine_stop_state"),
      { name: "ulm_custom_card_washer_job_states", selector: { object: {} } },
      U("ulm_custom_card_washer_label_idle"),
      U("ulm_custom_card_washer_label_configuring"),
      U("ulm_custom_card_washer_label_running"),
      re("ulm_custom_card_washer_start_action"),
      re("ulm_custom_card_washer_pause_action"),
      re("ulm_custom_card_washer_stop_action"),
      ...M()
    ] : e.upstreamId === "custom_card_sun" ? [
      m(["sun"]),
      U("title"),
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
      O("darkMode"),
      O("showAzimuth"),
      O("showElevation"),
      ...M()
    ] : e.upstreamId === "custom_card_pollen" ? [
      m(["sensor"]),
      m(["sensor"], "trees_entity"),
      U("custom_card_pollen_tree_name"),
      { name: "custom_card_pollen_tree_icon", selector: { icon: {} } },
      m(["sensor"], "grass_entity"),
      U("custom_card_pollen_grass_name"),
      { name: "custom_card_pollen_grass_icon", selector: { icon: {} } },
      m(["sensor"], "weeds_entity"),
      U("custom_card_pollen_weed_name"),
      { name: "custom_card_pollen_weed_icon", selector: { icon: {} } },
      ...M()
    ] : e.upstreamId === "custom_card_speedtest_gauges" ? [
      m(["sensor"]),
      m(["sensor"], "download_entity"),
      Q("ulm_custom_card_speedtest_download_speed_color"),
      J("ulm_custom_card_speedtest_download_speed_max", 1, 1e5),
      m(["sensor"], "upload_entity"),
      Q("ulm_custom_card_speedtest_upload_speed_color"),
      J("ulm_custom_card_speedtest_upload_speed_max", 1, 1e5),
      m(["sensor"], "ping_entity"),
      Q("ulm_custom_card_speedtest_ping_color"),
      J("ulm_custom_card_speedtest_ping_max", 1, 1e5),
      O("ulm_custom_card_speedtest_round"),
      ...M()
    ] : e.upstreamId === "custom_card_nas_metrics" ? [
      m(["binary_sensor", "sensor", "switch"]),
      m(["sensor"], "disk_entity"),
      U("disk_name"),
      { name: "disk_icon", selector: { icon: {} } },
      Q("disk_color"),
      m(["sensor"], "temperature_entity"),
      U("temperature_name"),
      { name: "temperature_icon", selector: { icon: {} } },
      Q("temperature_color"),
      J("temperature_max", 1, 1e5),
      m(["sensor"], "memory_entity"),
      U("memory_name"),
      { name: "memory_icon", selector: { icon: {} } },
      Q("memory_color"),
      J("memory_max", 1, 1e5),
      m(["sensor"], "cpu_entity"),
      U("cpu_name"),
      { name: "cpu_icon", selector: { icon: {} } },
      Q("cpu_color"),
      J("cpu_max", 1, 1e5),
      ...M()
    ] : e.upstreamId === "custom_card_input_datetime" ? [
      m(["input_datetime"]),
      ...M()
    ] : e.upstreamId === "custom_card_entity_overview" ? [
      m(),
      { name: "ulm_custom_card_entity_overview_icon", selector: { icon: {} } },
      ...[1, 2, 3, 4].flatMap((o) => [
        m(void 0, `ulm_custom_card_entity_overview_entity_${o}`),
        U(`ulm_custom_card_entity_overview_name_${o}`)
      ]),
      ...M()
    ] : e.upstreamId === "custom_card_internet_speed" ? [
      m(["sensor"]),
      m(["sensor"], "download_entity"),
      m(["sensor"], "upload_entity"),
      m(["sensor"], "ping_entity"),
      U("ulm_custom_card_internet_speed_router_name"),
      U("ulm_custom_card_internet_speed_router_model"),
      Q("ulm_custom_card_internet_speed_color"),
      ...M()
    ] : e.upstreamId === "custom_card_weather_metrics" ? [
      m(["weather"]),
      m(["sensor"], "temperature_entity"),
      m(["sensor"], "date_entity"),
      ...[1, 2, 3, 4].flatMap((o) => [
        m(void 0, `ulm_custom_card_weather_metrics_entity_${o}`),
        U(`ulm_custom_card_weather_metrics_name_${o}`)
      ]),
      ...M()
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
      ...M()
    ] : e.upstreamId === "custom_card_person_info" ? [
      m(["person"]),
      ...e.variants?.length ? [Y("variant", e.variants.map((o) => ({
        value: o,
        label: e.variantLabels?.[o] ?? o
      })))] : [],
      m(["zone"], "ulm_card_person_zone1"),
      m(["zone"], "ulm_card_person_zone2"),
      ...t?.variant === "small" ? [] : [
        m(["sensor"], "ulm_card_person_commute_entity"),
        { name: "ulm_card_person_cummute_icon", selector: { icon: {} } },
        O("ulm_multiline")
      ],
      m(["sensor"], "ulm_address"),
      m(["sensor"], "ulm_address_locality"),
      m(["binary_sensor"], "ulm_card_person_driving_entity"),
      m(["sensor"], "ulm_card_person_battery_entity"),
      m(["sensor", "binary_sensor"], "ulm_card_person_battery_state_entity"),
      J("ulm_card_battery_battery_level_danger", 0, 100),
      J("ulm_card_battery_battery_level_warning", 0, 100),
      ...M()
    ] : ($t[e.family] ?? $t.entity)(e, t)
  ], r = Qa.has(e.upstreamId) ? Ft(a) : a;
  return [
    ...Xa(r).map(er),
    re("tap_action"),
    re("hold_action"),
    re("double_tap_action")
  ];
}, tr = (e, t) => {
  const a = t?.variant ? (e.sourceIds ?? [e.upstreamId]).filter((o) => gt(o) === t.variant || o === e.upstreamId && gt(o) === void 0) : e.sourceIds ?? [e.upstreamId];
  return [...new Map(
    a.flatMap((o) => Je.get(o)?.variables ?? []).map((o) => [o.name, o])
  ).values()].filter((o) => jt(e, o.name)).filter((o) => !Ba(e, o.name)).filter((o) => !Ja.has(o.name)).filter((o) => !(e.upstreamId === "custom_card_person_info" && (wt.has(o.name) || o.name === "ulm_card_person_use_entity_picture" || o.name === "ulm_card_person_cummute_icon" || o.name === "ulm_multiline" || o.name === "ulm_card_battery_battery_level_danger" || o.name === "ulm_card_battery_battery_level_warning"))).map((o) => {
    if (e.upstreamId === "custom_card_person_info" && wt.has(o.name)) {
      const i = o.name === "ulm_card_person_entity" ? ["person"] : o.name.startsWith("ulm_card_person_zone") ? ["zone"] : o.name === "ulm_card_person_driving_entity" ? ["binary_sensor"] : ["sensor", "binary_sensor"];
      return m(i, o.name);
    }
    const n = Ya[o.name];
    if (n) return Y(o.name, n);
    if (Za.has(o.name)) return { name: o.name, selector: { icon: {} } };
    if (Ga.has(o.name)) return O(o.name);
    if (Ka.has(o.name)) return J(o.name, -1e5, 1e5);
    if (qa.has(o.name))
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
        return re(o.name);
      case "icon":
        return { name: o.name, selector: { icon: {} } };
      case "color":
        return Q(o.name);
      case "boolean":
        return O(o.name);
      case "number":
        return J(o.name, -1e5, 1e5);
      case "object":
        return { name: o.name, selector: { object: {} } };
      default:
        return U(o.name);
    }
  });
}, Rt = (e) => new Set(e.flatMap((t) => t.schema ? [...Rt(t.schema)] : t.name ? [t.name] : [])), ar = (e, t) => {
  const a = Rt(Bt(e, t));
  return tr(e, t).filter((r) => !a.has(r.name));
}, rr = [
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
], Ht = (e, t) => t?.attributes.icon ? t.attributes.icon : e.upstreamId === "custom_card_trash" ? "mdi:trash-can-outline" : e.upstreamId === "custom_card_room_overview" ? "mdi:sofa" : e.upstreamId === "custom_card_roomview" ? "mdi:home-variant-outline" : rr.find(([a]) => a.test(e.upstreamId))?.[1] ?? "mdi:information-outline", or = (e) => {
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
}, nr = (e) => {
  const t = {};
  for (const a of e.sourceIds ?? [e.upstreamId])
    for (const r of Je.get(a)?.variables ?? []) {
      if (!jt(e, r.name)) continue;
      const o = or(r.defaultValue);
      o !== void 0 && (t[r.name] = o);
    }
  return t;
}, Wt = (e, t, a) => {
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
  } : e.upstreamId === "custom_card_welcome_dashboard" ? {
    variant: Object.keys(t?.states ?? {}).some((i) => i.startsWith("weather.")) ? "weather" : "message",
    time_entity: Object.keys(t?.states ?? {}).find((i) => i === "sensor.time"),
    weather_entity: Object.keys(t?.states ?? {}).find((i) => i.startsWith("weather."))
  } : e.upstreamId === "custom_card_playstation" ? {
    icon: "mdi:sony-playstation",
    show_controls: !1
  } : e.upstreamId === "custom_card_person_tracker" ? {
    ulm_custom_card_person_tracker_use_entity_picture: !1,
    ulm_custom_card_person_tracker_use_badge: !0,
    ulm_custom_card_person_tracker_map_enable: !1,
    ulm_custom_card_person_tracker_map_aspect_ratio: "466:200",
    ulm_custom_card_person_tracker_map_hours_to_show: 0,
    ulm_custom_card_person_tracker_map_default_zoom: 11
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
    "card_cover",
    "custom_card_pollen"
  ])).has(e.upstreamId);
  return {
    type: `custom:${e.tag}`,
    ...nr(e),
    ...o,
    entity: a,
    waste_streams: e.upstreamId === "custom_card_trash" ? za() : void 0,
    show_today: e.upstreamId === "custom_card_trash" ? !1 : void 0,
    show_tomorrow: e.upstreamId === "custom_card_trash" ? !1 : void 0,
    name: void 0,
    icon: n ? void 0 : o.icon ?? Ht(e, r),
    show_icon: !0,
    show_state: e.upstreamId !== "custom_card_pollen",
    layout: "default"
  };
}, sr = [
  "ulm_card_person_zone1",
  "ulm_card_person_zone2",
  "ulm_address",
  "ulm_address_locality",
  "ulm_card_person_driving_entity",
  "ulm_card_person_battery_entity",
  "ulm_card_person_battery_state_entity",
  "ulm_card_person_commute_entity",
  "hold_action"
], ze = (e) => String(e ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(), je = (e) => ze(e).split(" ").filter((t) => t.length >= 3), ir = (e) => !!e && !["unavailable", "unknown"].includes(e?.state.toLowerCase() ?? ""), Ce = (e, t) => {
  if (!e || !t) return {};
  const a = e.states[t];
  if (!a) return {};
  const r = [
    typeof a.attributes.source == "string" ? a.attributes.source : void 0,
    ...Array.isArray(a.attributes.device_trackers) ? a.attributes.device_trackers.filter((w) => typeof w == "string") : []
  ].filter((w) => !!w), o = [.../* @__PURE__ */ new Set([
    ...je(t.split(".", 2)[1]),
    ...je(a.attributes.friendly_name),
    ...r.flatMap((w) => je(w.split(".", 2)[1]))
  ])].filter((w) => !["person", "device", "tracker", "sensor", "binary"].includes(w)), n = r.map((w) => ze(w.split(".", 2)[1])), i = Object.values(e.states).filter(ir), l = (w) => {
    const k = ze(`${w.entity_id} ${w.attributes.friendly_name ?? ""}`);
    return (n.some((C) => C && k.includes(C)) ? 100 : 0) + o.reduce(
      (C, j) => C + (k.split(" ").includes(j) ? 10 : 0),
      0
    );
  }, s = (w, k, x = () => 0) => i.filter((C) => w.includes(C.entity_id.split(".", 1)[0])).map((C) => ({
    entity: C,
    text: ze(`${C.entity_id} ${C.attributes.friendly_name ?? ""}`),
    relation: l(C)
  })).filter(({ entity: C, text: j, relation: K }) => K > 0 && k(C, j)).sort((C, j) => j.relation + x(j.entity, j.text) - (C.relation + x(C.entity, C.text)))[0]?.entity.entity_id, u = s(
    ["sensor"],
    (w, k) => (w.attributes.device_class === "battery" || k.includes("battery") && k.includes("level")) && !/(state|health|temperature|power|voltage|cycle|charger)/.test(k),
    (w, k) => (w.attributes.device_class === "battery" ? 30 : 0) + (k.includes("level") ? 20 : 0)
  ), h = s(
    ["sensor", "binary_sensor"],
    (w, k) => /(battery state|charging state|is charging|charger type|wireless charging|android auto)/.test(k),
    (w, k) => k.includes("battery state") ? 30 : k.includes("charging state") || k.includes("is charging") ? 25 : k.includes("charger type") ? 20 : 10
  ), g = s(
    ["sensor"],
    (w, k) => /(geocoded location|current address|home address|street address)/.test(k) || typeof w.attributes.Locality == "string",
    (w, k) => (k.includes("geocoded location") ? 30 : 0) + (typeof w.attributes.Locality == "string" ? 20 : 0)
  ), _ = s(
    ["sensor"],
    (w, k) => typeof w.attributes.Locality == "string" || /(locality|city|municipality)/.test(k),
    (w) => typeof w.attributes.Locality == "string" ? 30 : 0
  ) ?? g, b = s(
    ["binary_sensor"],
    (w, k) => /(driving|android auto|automotive)/.test(k)
  ), y = s(
    ["sensor"],
    (w, k) => /(commute|travel time|time to work|time to home)/.test(k)
  ), T = i.filter((w) => w.entity_id.startsWith("zone.") && w.entity_id !== "zone.home").slice(0, 2).map((w) => w.entity_id);
  return {
    ulm_card_person_zone1: T[0],
    ulm_card_person_zone2: T[1],
    ulm_address: g,
    ulm_address_locality: _,
    ulm_card_person_driving_entity: b,
    ulm_card_person_battery_entity: u,
    ulm_card_person_battery_state_entity: h,
    ulm_card_person_commute_entity: y,
    icon_type: a.attributes.entity_picture ? "entity-picture" : "icon",
    hold_action: u ? { action: "more-info", entity: u } : void 0
  };
}, lr = {
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
}, de = (e, t = "") => {
  const a = t ? e?.states[t] : void 0, r = t.split(".", 1)[0];
  return {
    entity: t,
    name: a?.attributes.friendly_name,
    icon: a?.attributes.icon ?? lr[r] ?? "mdi:gesture-tap-button",
    icon_type: a?.attributes.entity_picture ? "entity-picture" : "icon",
    color: "purple",
    active_state: r === "media_player" ? "playing" : ["automation", "binary_sensor", "fan", "input_boolean", "light", "lock", "switch"].includes(r) ? "on" : void 0,
    tap_action: { action: "toggle" }
  };
};
var cr = Object.defineProperty, dr = Object.getOwnPropertyDescriptor, Ye = (e, t, a, r) => {
  for (var o = r > 1 ? void 0 : r ? dr(t, a) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (o = (r ? i(t, a, o) : i(o)) || o);
  return r && o && cr(t, a, o), o;
};
let ke = class extends _e {
  constructor() {
    super(...arguments), this.computeLabel = (e) => this.config?.type.includes("custom-card-trash") && e.name === "entity" ? "Optional card entity" : Oa(this.hass, e.name), this.computeHelper = (e) => Ta(e.name), this.valueChanged = (e) => {
      if (!this.config || !e.detail.value) return;
      const t = e.detail.value, a = { ...this.config, ...t };
      if (ht(this.config.type.replace(/^custom:/, ""))?.upstreamId === "custom_card_person_info" && typeof t.entity == "string" && t.entity !== this.config.entity) {
        const o = Ce(this.hass, t.entity);
        for (const n of sr)
          o[n] !== void 0 ? Object.assign(a, { [n]: o[n] }) : delete a[n];
        this.config.icon_type === void 0 && (a.icon_type = o.icon_type);
      }
      Object.prototype.hasOwnProperty.call(t, "name") && JSON.stringify(t.name) !== JSON.stringify(this.config.name) && delete a.name_mode, this.config = a, ue(this, "config-changed", { config: a });
    }, this.addWasteStream = () => {
      this.config && this.updateWasteStreams([
        ...oe(this.config),
        { enabled: !0, entity: "", label: "Custom waste", icon: "mdi:trash-can", color: "#43a047" }
      ]);
    };
  }
  setConfig(e) {
    const t = e.type.replace(/^custom:/, ""), a = Ze.find((r) => r.tag === t);
    this.config = {
      ...e,
      variant: e.variant ?? a?.variant
    };
  }
  render() {
    if (!this.hass || !this.config) return p;
    const e = ht(this.config.type.replace(/^custom:/, ""));
    if (!e) return p;
    const t = Bt(e, this.config), a = ar(e, this.config).filter((n) => e.upstreamId !== "custom_card_trash" || !n.name.startsWith("ulm_card_datum_") && !n.name.includes("ophaling")), r = e.upstreamId === "custom_card_person_info" ? Ce(this.hass, this.config.entity) : {}, o = {
      ...Wt(e, this.hass, this.config.entity),
      ...r,
      ...this.config
    };
    return c`
      <ha-form
        .hass=${this.hass}
        .data=${o}
        .schema=${t}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
      ${e.upstreamId === "custom_card_trash" ? this.renderWasteStreamEditor() : e.family === "scene" ? this.renderItemEditor(
      "scene_items",
      "Scene buttons",
      e.upstreamId === "card_welcome_scenes" ? void 0 : ["scene"]
    ) : e.upstreamId === "card_room" ? this.renderItemEditor("room_sensors", "Room sensor buttons") : p}
      ${a.length ? c`
        <ha-expansion-panel outlined>
          <span slot="header">Additional appearance and controls (${a.length})</span>
          <ha-form
            .hass=${this.hass}
            .data=${o}
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
    const r = this.config[e] ?? [], o = (r.length ? r : (this.config.entities ?? []).map((n) => ({ entity: n }))).map((n) => e === "scene_items" ? { ...de(this.hass, n.entity), ...n } : n);
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
            <label class="field">
              <span>Active when state is</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${n.active_state ?? ""}
                @value-changed=${(l) => this.updateItem(e, i, "active_state", l.detail.value)}
              ></ha-selector>
              <small>Optional entity state that highlights this button as active.</small>
            </label>
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
    if (!this.config) return p;
    const e = oe(this.config);
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
  updateItem(e, t, a, r) {
    if (!this.config) return;
    const o = [...this.config[e] ?? (this.config.entities ?? []).map((n) => ({ entity: n }))];
    if (e === "scene_items" && a === "entity" && typeof r == "string") {
      const n = o[t], i = de(this.hass, n.entity), l = de(this.hass, r), s = { ...n, entity: r };
      for (const u of ["name", "icon", "icon_type", "color", "active_state", "tap_action"])
        (n[u] === void 0 || JSON.stringify(n[u]) === JSON.stringify(i[u])) && Object.assign(s, { [u]: l[u] });
      o[t] = s;
    } else
      o[t] = { ...o[t], [a]: r || void 0 };
    this.updateItems(e, o);
  }
  addItem(e) {
    if (!this.config) return;
    const t = [...this.config[e] ?? (this.config.entities ?? []).map((r) => ({ entity: r }))], a = e === "scene_items" ? Object.keys(this.hass?.states ?? {}).find((r) => r.startsWith("scene.")) ?? "" : "";
    t.push(e === "scene_items" ? de(this.hass, a) : { entity: "" }), this.updateItems(e, t);
  }
  removeItem(e, t) {
    if (!this.config) return;
    const a = [...this.config[e] ?? (this.config.entities ?? []).map((r) => ({ entity: r }))].filter((r, o) => o !== t);
    this.updateItems(e, a);
  }
  updateItems(e, t) {
    if (!this.config) return;
    const a = { ...this.config, [e]: t, entities: void 0 };
    this.config = a, ue(this, "config-changed", { config: a });
  }
  updateWasteStream(e, t, a) {
    if (!this.config) return;
    const r = oe(this.config);
    r[e] = {
      ...r[e],
      [t]: t === "enabled" ? a !== !1 : a || void 0
    }, this.updateWasteStreams(r);
  }
  removeWasteStream(e) {
    this.config && this.updateWasteStreams(oe(this.config).filter((t, a) => a !== e));
  }
  moveWasteStream(e, t) {
    if (!this.config) return;
    const a = oe(this.config), r = e + t;
    r < 0 || r >= a.length || ([a[e], a[r]] = [a[r], a[e]], this.updateWasteStreams(a));
  }
  updateWasteStreams(e) {
    if (!this.config) return;
    const t = { ...this.config, waste_streams: e };
    this.config = t, ue(this, "config-changed", { config: t });
  }
};
ke.styles = zt`
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
    .field > small { color: var(--secondary-text-color); font-size: 11px; line-height: 1.35; }
    .item-actions { display: flex; justify-content: flex-end; gap: 8px; }
    button { border: 0; border-radius: 10px; padding: 8px 12px; background: var(--secondary-background-color); color: var(--primary-text-color); cursor: pointer; }
    button.add { background: var(--primary-color); color: var(--text-primary-color, #fff); }
  `;
Ye([
  Me({ attribute: !1 })
], ke.prototype, "hass", 2);
Ye([
  Mt()
], ke.prototype, "config", 2);
ke = Ye([
  va("mushroom-addition-editor")
], ke);
const _r = zt`
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
  .ulm-person .person-picture {
    width: var(--mush-icon-size, 40px);
    height: var(--mush-icon-size, 40px);
    border-radius: 50%;
    background-position: center;
    background-size: cover;
  }
  .person-icon-wrap { position: relative; display: block; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); }
  .person-icon-wrap > .ulm-icon, .person-icon-wrap > .person-picture { width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); }
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
  .person-battery-ring { width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); overflow: visible; }
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
  .ulm-source-scenes .scene-button { width: 52px; min-width: 52px; min-height: 84px; padding: 5px 5px 7px; border-radius: 50px; }
  .ulm-source-scenes .scene-button i { width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); }
  .ulm-source-scenes .scene-button span { font-size: 9.5px; font-weight: 700; }
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
  .welcome-scenes .scene-button {
    border: 1px solid var(--divider-color, rgba(var(--ulm-grey), .2));
    background: var(--welcome-surface);
    color: var(--primary-text-color);
    box-shadow: none;
  }
  .welcome-scenes .scene-button i {
    background: color-mix(in srgb, var(--item-color) 22%, transparent);
  }
  .welcome-scenes .scene-button span { color: var(--secondary-text-color); }
  .welcome-scenes .scene-button.is-active {
    border-color: color-mix(in srgb, var(--item-color) 45%, var(--divider-color, transparent));
    background: color-mix(in srgb, var(--item-color) 18%, transparent);
  }
  .welcome-scenes .scene-button.is-active span { color: var(--primary-text-color); }
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
  .ulm-cover { display: grid; gap: 8px; padding: 0 12px 12px; }
  .ulm-cover > .ulm-row { padding-right: 0; padding-left: 0; }
  .cover-controls { display: grid; grid-template-columns: repeat(3, 1fr); }
  .cover-controls:has(.ulm-control:nth-child(4)) { grid-template-columns: repeat(4, 1fr); }
  .cover-controls .ulm-control { width: 100%; height: 32px; border-radius: 12px; }
  .ulm-cover-slider { position: relative; height: 42px; overflow: hidden; border-radius: 14px; background: rgba(var(--ulm-grey), .12); }
  .ulm-cover-slider i { position: absolute; inset: 0 auto 0 0; width: var(--cover-level); background: rgba(var(--ulm-blue), .8); }
  .ulm-cover-slider input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; }
  .ulm-cover.is-horizontal { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; }
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
  .custom-chromecast { display: grid; gap: 16px; padding: 12px; }
  .chromecast-controls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .chromecast-controls .ulm-control { width: 100%; height: 48px; border-radius: 16px; }
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
  .sonos-controls {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: center; gap: 7px;
  }
  .sonos-controls button {
    min-height: 42px; border: 0; border-radius: 13px; background: rgba(var(--ulm-grey), .08); color: var(--primary-text-color);
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
  .custom-welcome-dashboard { display: grid; min-height: 76px; gap: 12px; padding: 12px; }
  .welcome-dashboard-message { font-size: 30px; font-weight: 500; line-height: 1.15; text-align: left; }
  .welcome-dashboard-weather { display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 0; border-radius: 14px; background: transparent; color: var(--primary-text-color); text-align: left; }
  .welcome-dashboard-weather > span { display: grid; grid-template-columns: 28px auto; align-items: center; column-gap: 8px; }
  .welcome-dashboard-weather ha-icon { grid-row: span 2; --mdc-icon-size: 24px; }
  .welcome-dashboard-weather b { font-size: 14px; text-transform: capitalize; } .welcome-dashboard-weather small { color: var(--secondary-text-color); font-size: 12px; }
  .welcome-dashboard-weather strong { font-size: 16px; }
  .welcome-dashboard-news { display: grid; gap: 4px; }
  .welcome-dashboard-news button { display: grid; grid-template-columns: 28px 1fr; align-items: center; gap: 8px; padding: 7px 8px; border: 0; border-radius: 10px; background: transparent; color: var(--primary-text-color); text-align: left; }
  .welcome-dashboard-news button span { display: grid; } .welcome-dashboard-news small, .welcome-dashboard-empty { color: var(--secondary-text-color); font-size: 11px; }
  .custom-person-info, .custom-person-tracker, .custom-vehicle-status,
  .custom-plant { display: grid; gap: 10px; padding: 12px; }
  .custom-person-info-small { display: grid; min-height: 118px; gap: 8px; padding: 12px; }
  .person-info-main, .person-tracker-main, .car-hero, .flower-heading {
    display: flex; min-width: 0; align-items: center; gap: 10px;
  }
  .person-info-avatar { position: relative; display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); flex: 0 0 auto; place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .12) center/cover; color: rgb(var(--ulm-blue)); }
  .person-info-avatar > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
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
  .person-tracker-main { grid-template-columns: min-content minmax(0,1fr) auto; align-items: center; }
  .person-tracker-avatar { position: relative; display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--ulm-grey), .05); background-position: center; background-size: cover; }
  .person-tracker-avatar > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .person-tracker-avatar > i { position: absolute; top: -3px; right: -3px; display: grid; width: 16px; height: 16px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; color: #fff; }
  .person-tracker-avatar > i ha-icon { --mdc-icon-size: 10px; } .person-tracker-avatar > i.tone-red { background: rgb(var(--ulm-red)); } .person-tracker-avatar > i.tone-green { background: rgb(var(--ulm-green)); } .person-tracker-avatar > i.tone-yellow { background: rgb(var(--ulm-yellow)); } .person-tracker-avatar > i.tone-blue { background: rgb(var(--ulm-blue)); }
  .person-tracker-find-device { display: grid; width: 42px; height: 42px; place-items: center; border: 0; border-radius: 12px; background: rgba(var(--ulm-blue), .2); color: rgb(var(--ulm-blue)); }
  .person-tracker-camera { min-height: 130px; border-radius: 15px; background: rgba(var(--ulm-grey), .08) center/cover; }
  .person-tracker-map { display: flex; min-height: 42px; align-items: center; justify-content: center; gap: 7px; border-radius: 13px; background: rgba(var(--ulm-blue), .1); color: rgb(var(--ulm-blue)); font-size: 11px; font-weight: 700; }
  .source-scene-grid .scene-grid { display: grid; grid-template-columns: repeat(5, 52px); justify-content: space-between; gap: 12px; }
  .source-scene-grid .scene-button { width: 52px; min-width: 52px; min-height: 84px; padding: 5px 5px 7px; border-radius: 50px; }
  .source-scene-grid .scene-button i { width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); }
  .source-scene-grid .scene-button span { font-size: 9.5px; font-weight: 700; }
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
`, ur = {
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
}, mr = (e, t) => {
  const a = e?.trim() || t.trim();
  if (a === "primary")
    return e ? `var(--primary-color, ${t})` : "var(--primary-color)";
  if (a === "accent")
    return e ? `var(--accent-color, ${t})` : "var(--accent-color)";
  const r = ur[a];
  return r ? `rgb(var(--rgb-${a}, ${r}))` : a;
}, f = (e, t) => e?.attributes[t], V = (e) => {
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, ge = (e, t, a, r, o = "") => {
  if (e.config.icon_type === "none") return p;
  const n = e.config.icon_type === "entity-picture" ? f(e.entity, "entity_picture") : void 0;
  return n ? c`<span class="ulm-icon entity-picture ${o}" style=${`background-image:url("${String(n)}")`}></span>` : c`<span class="ulm-icon source-icon ${r ? "is-source-active" : ""} ${o}"
        style=${`--source-color:${a}`}>
        <ha-icon .icon=${e.config.icon || t}></ha-icon>
      </span>`;
}, kt = (e, t) => {
  const a = d(e, t);
  return a ? e.hass.states[a] : void 0;
}, pr = (e, t) => {
  if (e === void 0) return "mdi:battery-off";
  if (e <= 0 && !t) return "mdi:battery-alert-variant-outline";
  if (e >= 100) return "mdi:battery";
  if (e <= 0) return `mdi:battery${t}-outline`;
  const a = Math.max(10, Math.min(90, Math.round(e / 10) * 10));
  return `mdi:battery${t}-${a}`;
}, A = (e, t) => {
  const a = e.config[t];
  return typeof a == "string" ? e.hass.states[a] : void 0;
}, d = (e, ...t) => {
  for (const a of t)
    if (e.config[a] !== void 0) return e.config[a];
}, hr = (e, t, ...a) => d(e, String(t), ...a) === !0, Te = (e, t) => e.config.icon || e.entity?.attributes.icon || Ht(e.descriptor, e.entity) || t, F = (e, t, a = "blue", r = "") => {
  if (e.config.icon_type === "none") return p;
  const o = e.config.icon_type === "entity-picture" ? f(e.entity, "entity_picture") : void 0;
  return o ? c`<span class="ulm-icon entity-picture ${r}" style=${`background-image:url("${String(o)}")`}></span>` : c`<span class="ulm-icon tone-${a} ${r}"><ha-icon .icon=${Te(e, t)}></ha-icon></span>`;
}, gr = (e, t) => {
  switch (e.config.secondary_info) {
    case "none":
      return;
    case "name":
      return H(e.config, e.entity, e.hass);
    case "state":
      return v(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    case "last-updated":
      return e.entity?.last_updated ? new Date(e.entity.last_updated).toLocaleString() : "Last updated unavailable";
    default:
      return e.config.secondary || t;
  }
}, br = (e, t) => {
  switch (e.config.primary_info) {
    case "none":
      return "";
    case "state":
      return v(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    case "last-updated":
      return e.entity?.last_updated ? new Date(e.entity.last_updated).toLocaleString() : "Last updated unavailable";
    default:
      return H(e.config, e.entity, e.hass) || t || "";
  }
}, qt = (e, t, a) => {
  e.presentation.rendered = !0;
  const r = H(e.config, e.entity, e.hass), o = e.config.name !== void 0 && typeof e.config.name != "string";
  return {
    primary: (e.config.primary_info === void 0 ? o && r ? r : a ?? r : br(e, a)) || void 0,
    secondary: e.config.secondary_info === void 0 ? t : gr(e, t)
  };
}, z = (e, t, a) => c`
  ${(() => {
  const r = qt(e, t, a);
  return c`
  <span class="ulm-copy shared-presentation">
    ${r.primary ? c`<span class="ulm-name">${r.primary}</span>` : p}
    ${r.secondary ? c`<span class="ulm-label">${r.secondary}</span>` : p}
  </span>
    `;
})()}
`, Gt = (e, t = v(e.entity)) => c`
  <span class="value-first">${z(e, H(e.config, e.entity, e.hass), t)}</span>
`, yr = (e) => c`<div class="automatic-presentation">${z(e, v(e.entity), e.descriptor.name)}</div>`, L = (e, t, a, r = !1) => c`
  <button class="ulm-control" aria-label=${e} ?disabled=${r}
    @pointerdown=${(o) => o.stopPropagation()} @click=${a}>
    <ha-icon .icon=${t}></ha-icon>
  </button>
`, fr = (e, t, a, r, o = !1) => {
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
}, W = (e, t, a, r = t.config.entity) => {
  e.stopPropagation(), ue(e.currentTarget, "hass-action", {
    config: { type: t.config.type, entity: r, tap_action: a },
    action: "tap"
  });
}, Kt = {
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
}, vr = (e) => {
  const t = A(e, "battery_entity") ?? (d(e, "ulm_card_person_battery") ? e.hass.states[d(e, "ulm_card_person_battery")] : void 0), a = A(e, "eta_entity") ?? (d(e, "ulm_card_person_eta") ? e.hass.states[d(e, "ulm_card_person_eta")] : void 0), r = A(e, "address_entity") ?? (d(e, "ulm_address") ? e.hass.states[d(e, "ulm_address")] : void 0), o = e.config.icon_type === "entity-picture" ? f(e.entity, "entity_picture") : void 0, n = Object.values(e.hass.states).find((h) => h.entity_id.startsWith("zone.") && Array.isArray(h.attributes.persons) && h.attributes.persons.includes(e.entity?.entity_id)), i = e.entity?.state === "home" ? "mdi:home-variant" : n?.attributes.icon || (n ? "mdi:help-circle" : "mdi:home-minus"), l = t ? Math.max(0, Math.min(100, Math.round(Number(t.state)))) : void 0, s = 2 * Math.PI * 20.5, u = `${v(r || e.entity)}${a && e.entity?.state !== "home" ? ` | ${v(a)}` : ""}`;
  return e.actionSurface("ulm-row ulm-person ulm-source-person", c`
    ${e.config.icon_type === "none" ? p : c`<span class="person-icon-wrap">
      ${o ? c`<span class="person-picture" style=${`background-image:url("${String(o)}")`}></span>` : c`<span class="ulm-icon tone-grey"><ha-icon .icon=${e.config.icon || d(e, "ulm_card_person_icon") || "mdi:face-man"}></ha-icon></span>`}
      <span class="person-location-badge ${e.entity?.state === "home" ? "home" : "away"}">
        <ha-icon .icon=${String(i)}></ha-icon>
      </span>
    </span>`}
    ${z(e, u)}
    ${l !== void 0 ? c`
      <svg class="person-battery-ring" viewBox="0 0 50 50" aria-label=${`${l}% battery`}>
        <circle cx="25" cy="25" r="20.5"></circle>
        <circle class="value" cx="25" cy="25" r="20.5"
          style=${`stroke-dasharray:${s};stroke-dashoffset:${s - l / 100 * s}`}></circle>
        <text x="25" y="28">${l}<tspan>%</tspan></text>
      </svg>
    ` : p}
  `);
}, wr = (e) => {
  const t = V(e.entity?.state) ?? 0, a = !!f(e.entity, "is_charging") || String(e.entity?.state).includes("charging"), r = d(e, "ulm_card_battery_battery_level_danger") ?? 20, o = d(e, "ulm_card_battery_battery_level_warning") ?? 50, n = t < r ? "red" : t < o ? "yellow" : "green", i = d(e, "ulm_card_battery_charging_animation") === !0 && a;
  return e.actionSurface(`ulm-battery ${i ? "is-charging" : ""}`, c`
    ${F(e, a ? "mdi:battery-charging" : "mdi:battery", n)}
    ${z(e, a ? "Charging" : "Battery level")}
    <span class="battery-value">${Math.round(t)}<small>%</small></span>
    <span class="battery-track"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>
  `);
}, $r = (e) => {
  const t = d(e, "ulm_card_battery_attribute"), a = t ? f(e.entity, t) : e.entity?.state, r = V(a), o = kt(e, "ulm_card_battery_battery_state_entity_id"), n = kt(e, "ulm_card_battery_charger_type_entity_id"), i = o?.state.toLowerCase() === "charging", l = n?.state.toLowerCase(), s = l === "wireless" ? "-charging-wireless" : i || ["charging", "ac", "usb"].includes(l ?? "") ? "-charging" : "", u = V(e.config.battery_warning_threshold) ?? d(e, "ulm_card_battery_battery_level_warning") ?? 50, h = V(e.config.battery_low_threshold) ?? d(e, "ulm_card_battery_battery_level_danger") ?? 20, g = V(e.config.battery_critical_threshold) ?? 10, [_, b, y] = [g, h, u].map((x) => Math.max(0, Math.min(100, x))).sort((x, C) => x - C), T = r === void 0 || r <= _ ? G(
    e.config.battery_critical_color ?? d(e, "ulm_card_battery_color_battery_level_danger"),
    "var(--google-red, #f44336)"
  ) : r <= b ? G(e.config.battery_low_color, "var(--google-orange, #ff9800)") : r <= y ? G(
    e.config.battery_warning_color ?? d(e, "ulm_card_battery_color_battery_level_warning"),
    "var(--google-yellow, #fbc02d)"
  ) : G(
    e.config.battery_healthy_color ?? d(e, "ulm_card_battery_color_battery_level_ok"),
    "var(--google-green, #43a047)"
  ), w = d(e, "ulm_card_battery_charging_animation") === !0 && i, k = r === void 0 ? v(e.entity) : `${Math.round(r)}%`;
  return e.actionSurface(`ulm-row ulm-default-battery ${w ? "is-charging" : ""}`, c`
    ${ge(e, pr(r, s), T, !0)}
    <span class="value-first">${z(e, H(e.config, e.entity, e.hass), k)}</span>
  `);
}, G = mr, kr = (e) => {
  const t = V(e.entity?.state) ?? 0, a = V(d(e, "ulm_custom_card_bar_card_min")) ?? 0, o = (V(d(e, "ulm_custom_card_bar_card_max")) ?? 100) - a, n = o > 0 ? Math.max(0, Math.min(100, (t - a) / o * 100)) : 0, i = d(e, "ulm_custom_card_bar_card_show_icon") !== !1, l = d(e, "ulm_custom_card_bar_card_value") === !0, s = d(e, "ulm_custom_card_bar_card_indicator") === !0, u = G(
    d(e, "ulm_custom_card_bar_card_color"),
    "var(--google-blue, #4285f4)"
  ), h = G(
    d(e, "ulm_custom_card_bar_card_icon_color"),
    "var(--secondary-text-color)"
  ), g = d(e, "ulm_custom_card_bar_card_icon") || e.config.icon || e.entity?.attributes.icon || "mdi:chart-bar", _ = v(e.entity);
  return e.actionSurface(`bar-card ${i ? "has-header" : "bar-only"}`, c`
    ${i ? c`
      <div class="bar-card-header">
        <span class="bar-card-icon" style=${`--bar-icon-color:${h}`}>
          <ha-icon .icon=${g}></ha-icon>
        </span>
        <span class="bar-card-copy">${z(e, H(e.config, e.entity, e.hass), _)}</span>
      </div>
    ` : p}
    <div class="bar-card-track" style=${`--bar-fill:${u};--bar-percentage:${n}%`}>
      <span class="bar-card-fill" style=${`width:${n}%`}></span>
      ${s ? c`<span class="bar-card-indicator" style=${`left:${n}%`}></span>` : p}
      ${l ? c`
        <b class="bar-card-inside-value">${_}</b>
        <b class="bar-card-inside-value bar-card-inside-value-filled" aria-hidden="true">${_}</b>
      ` : p}
    </div>
  `);
}, Zt = (e, t = !1, a = e.entity, r, o = r) => {
  const n = Array.isArray(f(a, "history")) ? f(a, "history").map(Number).filter(Number.isFinite).slice(-12) : [20, 28, 24, 42, 35, 52, 48, 63, 55, 70, 62, 78], i = Math.min(...n), l = Math.max(...n), s = n.map((g, _) => `${_ / Math.max(1, n.length - 1) * 100},${36 - (g - i) / Math.max(1, l - i) * 32}`).join(" "), u = `0,40 ${s} 100,40`, h = r ? `--sparkline-color:${r};--sparkline-fill-color:${o ?? r}` : "";
  return c`<svg class="sparkline ${t ? "is-filled" : ""}" style=${h} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
    ${t ? c`<polygon points=${u}></polygon>` : p}
    <polyline points=${s}></polyline>
  </svg>`;
}, xr = (e) => e.actionSurface("ulm-metric", c`
  <div class="metric-heading">${F(e, e.descriptor.family === "energy" ? "mdi:flash" : "mdi:chart-line", "blue")}${z(e, e.entity?.attributes.unit_of_measurement ? String(e.entity.attributes.unit_of_measurement) : "Current value")}<span class="metric-value">${v(e.entity)}</span></div>
  ${e.config.show_graph !== !1 ? Zt(e) : p}
  ${A(e, "min_entity") || A(e, "max_entity") ? c`<div class="metric-extremes"><span>Min ${v(A(e, "min_entity"))}</span><span>Max ${v(A(e, "max_entity"))}</span></div>` : p}
`), Sr = (e, t, a) => {
  if (a.nav_path) {
    W(e, t, { action: "navigate", navigation_path: a.nav_path }, a.entity);
    return;
  }
  const r = a.tap_action, o = r?.service ?? r?.perform_action;
  if ((r?.action === "call-service" || r?.action === "perform-action") && o) {
    const [l, s] = o.split(".", 2);
    if (l && s) {
      t.service(l, s, {
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
}, Vr = (e) => {
  const t = (e.config.scene_items?.length ? e.config.scene_items : (e.config.entities?.length ? e.config.entities : e.config.entity ? [e.config.entity] : []).map((x) => ({ entity: x }))).filter((x) => x.entity), a = e.descriptor.upstreamId === "card_welcome_scenes", r = e.descriptor.upstreamId === "card_scenes" && e.config.variant === "scene-grid", o = a ? 7 : r ? 5 : 6, n = a && t.length > o, i = a && e.sceneOverflowExpanded ? t : t.slice(0, o), l = e.config.collapse_entity ? e.hass.states[e.config.collapse_entity] : void 0, s = e.config.collapsed === !0 || l?.state === "on", h = A(e, "weather_entity")?.state || "partlycloudy", g = Kt[h]?.[0] ?? "mdi:weather-partly-cloudy", _ = (/* @__PURE__ */ new Date()).getHours(), b = e.hass.language?.split("-")[0] ?? "en", y = {
    de: ["Hallo", "Guten Morgen", "Guten Tag", "Guten Abend"],
    en: ["Hello", "Good morning", "Good afternoon", "Good evening"],
    es: ["Hola", "Buenos días", "Buenas tardes", "Buenas noches"],
    fr: ["Bonjour", "Bonjour", "Bon après-midi", "Bonsoir"],
    nl: ["Hallo", "Goedemorgen", "Goedemiddag", "Goedenavond"]
  }, T = y[b] ?? y.en, k = `${_ >= 18 ? T[3] : _ >= 12 ? T[2] : _ >= 5 ? T[1] : T[0]}, ${e.hass.user?.name || "Home"}!`;
  return e.actionSurface(`ulm-scenes ${a ? "welcome-scenes" : r ? "source-scene-grid" : "scene-pills"} ${e.descriptor.upstreamId === "card_scenes" ? "ulm-source-scenes" : ""}`, c`
    ${a ? c`
      <div class="welcome-toolbar">
        <button class="welcome-toolbar-button" aria-label="Toggle scenes" @pointerdown=${(x) => x.stopPropagation()} @click=${(x) => {
    x.stopPropagation(), e.config.collapse_entity && e.service("input_boolean", "toggle", { entity_id: e.config.collapse_entity });
  }}><ha-icon .icon=${s ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon></button>
        <span class="welcome-date"><ha-icon .icon=${g}></ha-icon>${new Intl.DateTimeFormat(e.hass.language, { month: "short", day: "numeric" }).format(/* @__PURE__ */ new Date())}</span>
        <button class="welcome-toolbar-button" aria-label="Open dashboard settings" @pointerdown=${(x) => x.stopPropagation()} @click=${(x) => W(x, e, { action: "navigate", navigation_path: String(e.config.settings_path || "/config/dashboard") })}><ha-icon icon="mdi:cog-outline"></ha-icon></button>
      </div>
      <div class="welcome-heading">${z(e, k)}</div>
      ${s ? p : c`
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
          ` : p}
        </div>
      `}
    ` : p}
    ${s ? p : c`<div class="scene-grid">${i.map((x) => {
    const C = e.hass.states[x.entity], j = C?.state === (x.active_state || x.state || "on") || C?.state === "playing", K = G(x.color, "rgb(var(--ulm-purple))"), q = x.icon_type === "entity-picture" ? f(C, "entity_picture") : void 0;
    return c`
      <button @pointerdown=${(D) => D.stopPropagation()} @click=${(D) => {
      if (D.stopPropagation(), r && !x.tap_action) {
        const X = x.entity.split(".", 1)[0];
        e.service(
          X === "automation" ? "automation" : "homeassistant",
          X === "automation" ? "trigger" : "turn_on",
          { entity_id: x.entity }
        );
      } else
        Sr(D, e, x);
    }} style=${`--item-color:${K}`} class="scene-button ${j ? "is-active" : ""}">
        <i>${q ? c`<span class="scene-entity-picture" style=${`background-image:url("${String(q)}")`}></span>` : c`<ha-icon .icon=${x.icon || C?.attributes.icon || "mdi:palette"}></ha-icon>`}</i>
        <span>${x.name || x.label || H({ entity: x.entity }, C, e.hass)}</span>
      </button>`;
  })}</div>`}
  `);
}, xt = (e) => {
  const t = d(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : f(e.entity, "entity_picture"), a = "mdi:sony-playstation", r = d(e, "ulm_card_media_player_player_controls_entity") || e.config.entity, o = r ? e.hass.states[r] : e.entity, n = r?.startsWith("media_player.") === !0, i = d(e, "ulm_card_media_player_collapsible") === !0 && (["off", "standby"].includes(e.entity?.state ?? "") || d(e, "ulm_card_media_player_idle_off") === !0 && e.entity?.state === "idle"), l = !i && (e.config.show_controls === !0 || d(e, "ulm_card_media_player_enable_controls") === !0), s = d(e, "ulm_card_media_player_enable_volume_adjust") || (f(o, "device_class") === "speaker" ? 0.05 : f(o, "device_class") === "tv" ? 0.01 : 0.025), u = Number(f(o, "volume_level") ?? 0), h = { action: "more-info" }, g = ee.has(e.entity?.state ?? ""), _ = G(
    d(e, "ulm_card_media_player_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface(`ulm-media ${t ? "has-art" : ""} ${i ? "is-collapsed" : ""}`, c`
    ${t ? c`<span class="media-art" style=${`background-image:url("${String(t)}")`}></span>` : p}
    <div class="media-summary">
      ${ge(e, Te(e, e.descriptor.upstreamId === "custom_card_playstation" ? a : "mdi:speaker"), _, g)}
      ${z(e, d(e, "ulm_card_media_player_more_info") === !0 ? [f(e.entity, "media_artist"), f(e.entity, "media_album_name")].filter(Boolean).join(" · ") || v(e.entity) : String(f(e.entity, "media_album_name") ?? f(e.entity, "media_artist") ?? v(e.entity)))}
    </div>
    ${d(e, "ulm_card_media_player_power_button") === !0 ? c`
      <div class="media-power">${L("Toggle power", "mdi:power", (b) => {
    b.stopPropagation(), e.service("homeassistant", "toggle", { entity_id: e.config.entity });
  })}</div>
    ` : p}
    ${n && l ? c`<div class="ulm-controls media-controls">
      ${L("Previous", "mdi:skip-previous", (b) => {
    b.stopPropagation(), e.service("media_player", "media_previous_track", { entity_id: r });
  })}
      ${L(e.entity?.state === "playing" ? "Pause" : "Play", e.entity?.state === "playing" ? "mdi:pause" : "mdi:play", (b) => {
    b.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: r });
  })}
      ${L("Next", "mdi:skip-next", (b) => {
    b.stopPropagation(), e.service("media_player", "media_next_track", { entity_id: r });
  })}
      ${L("Sources", "mdi:playlist-music", (b) => W(b, e, h, r))}
    </div>` : p}
    ${n && !i && d(e, "ulm_card_media_player_enable_volume_slider") === !0 ? c`
      <input class="ulm-slider" type="range" min="0" max="100"
        aria-label="Volume"
        .value=${String(Math.round(u * 100))}
        @pointerdown=${(b) => b.stopPropagation()}
        @change=${(b) => e.service("media_player", "volume_set", {
    entity_id: r,
    volume_level: Number(b.target.value) / 100
  })}>
    ` : p}
    ${n && !i && d(e, "ulm_card_media_player_enable_volume_buttons") === !0 ? c`
      <div class="ulm-controls media-volume-buttons">
        ${L("Mute or unmute", "mdi:volume-mute", (b) => {
    b.stopPropagation(), e.service("media_player", "volume_mute", {
      entity_id: r,
      is_volume_muted: f(o, "is_volume_muted") !== !0
    });
  })}
        ${L("Volume down", "mdi:volume-minus", (b) => {
    b.stopPropagation(), e.service("media_player", "volume_set", {
      entity_id: r,
      volume_level: Math.max(0, u - s)
    });
  })}
        ${L("Volume up", "mdi:volume-plus", (b) => {
    b.stopPropagation(), e.service("media_player", "volume_set", {
      entity_id: r,
      volume_level: Math.min(1, u + s)
    });
  })}
      </div>
    ` : p}
  `);
}, Ir = (e) => {
  const t = e.config.entity?.startsWith("cover.") === !0, a = t && hr(e, "show_controls", "ulm_card_cover_enable_controls"), r = t && d(e, "ulm_card_cover_enable_slider") === !0, o = t && d(e, "ulm_card_cover_enable_tilt") === !0, n = d(e, "ulm_card_cover_enable_horizontal") === !0, i = d(e, "ulm_card_cover_invert_percent", "ulm_card_invert_percent") === !0, l = V(f(e.entity, "current_position")), s = l === void 0 ? void 0 : i ? 100 - l : l, u = i ? l !== 100 : e.entity?.state !== "closed", h = G(d(e, "ulm_card_cover_color"), "rgba(var(--color-blue, 3, 169, 244), 1)"), g = d(e, "ulm_card_cover_force_background_color") === !0 && u, _ = String(f(e.entity, "device_class") ?? ""), b = {
    awning: "mdi:window-open",
    blind: "mdi:blinds-open",
    curtain: "mdi:curtains",
    damper: "mdi:circle-outline",
    door: "mdi:door-open",
    garage: d(e, "ulm_card_cover_garage_large") ? "mdi:garage-open-variant" : "mdi:garage-open",
    gate: "mdi:gate-open",
    shade: "mdi:roller-shade",
    shutter: "mdi:window-shutter-open",
    window: "mdi:window-open"
  }, y = {
    awning: "mdi:window-closed",
    blind: "mdi:blinds",
    curtain: "mdi:curtains-closed",
    damper: "mdi:circle-slice-8",
    door: "mdi:door-closed",
    garage: d(e, "ulm_card_cover_garage_large") ? "mdi:garage-variant" : "mdi:garage",
    gate: "mdi:gate",
    shade: "mdi:roller-shade-closed",
    shutter: "mdi:window-shutter",
    window: "mdi:window-closed"
  }, T = d(e, "ulm_card_cover_icon"), w = typeof T == "string" ? T : (u ? b[_] : y[_]) || String(f(e.entity, "icon") ?? "mdi:help-circle"), x = d(e, "ulm_card_cover_show_last_changed") === !0 && e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : s !== void 0 && !["unknown", "unavailable", "closed"].includes(e.entity?.state ?? "") ? `${v(e.entity)} · ${s}%` : v(e.entity), C = d(e, "ulm_card_cover_display_left_right") === !0, j = C ? "mdi:arrow-left" : ["curtain", "gate", "awning"].includes(_) ? "mdi:arrow-collapse-horizontal" : "mdi:arrow-down", K = C ? "mdi:arrow-right" : ["curtain", "gate", "awning"].includes(_) ? "mdi:arrow-expand-horizontal" : "mdi:arrow-up", q = V(d(e, "ulm_card_cover_favorite_percentage"));
  return e.actionSurface(`ulm-cover ${n ? "is-horizontal" : ""} ${g ? "is-source-background" : ""}`, c`
  <div class="ulm-row">
    ${ge(e, w, h, u)}
    ${z(e, x)}
  </div>
  ${a ? c`<div class="ulm-controls cover-controls">
    ${L("Close", j, (D) => {
    D.stopPropagation(), e.service("cover", "close_cover", { entity_id: e.config.entity });
  })}
    ${L("Stop", "mdi:stop", (D) => {
    D.stopPropagation(), e.service("cover", "stop_cover", { entity_id: e.config.entity });
  })}
    ${L("Open", K, (D) => {
    D.stopPropagation(), e.service("cover", "open_cover", { entity_id: e.config.entity });
  })}
    ${q !== void 0 ? L(`Move to ${q}%`, "mdi:star", (D) => {
    D.stopPropagation(), e.service("cover", "set_cover_position", { entity_id: e.config.entity, position: q });
  }) : p}
  </div>` : p}
  ${r ? c`
    <div class="ulm-cover-slider" style=${`--cover-level:${l ?? 0}%`}>
    <i></i><input type="range" aria-label="Cover position"
      min=${String(d(e, "ulm_card_cover_slider_min") ?? 0)}
      max=${String(d(e, "ulm_card_cover_slider_max") ?? 100)}
      .value=${String(l ?? 0)}
      @pointerdown=${(D) => D.stopPropagation()}
      @click=${(D) => D.stopPropagation()}
      @change=${(D) => e.service("cover", "set_cover_position", {
    entity_id: e.config.entity,
    position: Number(D.target.value)
  })}>
    </div>
  ` : p}
  ${o ? c`<div class="ulm-controls cover-controls cover-tilt-controls">
    ${L("Close tilt", "mdi:arrow-bottom-left", (D) => {
    D.stopPropagation(), e.service("cover", "close_cover_tilt", { entity_id: e.config.entity });
  })}
    ${L("Stop tilt", "mdi:stop", (D) => {
    D.stopPropagation(), e.service("cover", "stop_cover_tilt", { entity_id: e.config.entity });
  })}
    ${L("Open tilt", "mdi:arrow-top-right", (D) => {
    D.stopPropagation(), e.service("cover", "open_cover_tilt", { entity_id: e.config.entity });
  })}
  </div>` : p}
  `, `--source-color:${h}`);
}, zr = (e) => {
  const t = e.entity?.state.startsWith("armed") || e.entity?.state === "locked";
  return e.actionSurface(`ulm-security ${t ? "is-armed" : ""}`, c`
    ${F(e, t ? "mdi:shield-lock" : "mdi:shield-off", t ? "green" : "red")}
    ${z(e, v(e.entity))}
    ${e.config.show_controls ? c`<span class="security-status">${t ? "Secured" : "Attention"}</span>` : p}
  `);
}, Ar = (e) => e.actionSurface("ulm-navigation", c`
  ${F(e, e.descriptor.upstreamId.includes("back") ? "mdi:arrow-left" : "mdi:arrow-right", "blue")}
  ${z(e, e.config.secondary || e.config.navigation_path || "Navigate")}
  <ha-icon icon="mdi:chevron-right"></ha-icon>
`), Pr = (e, t) => {
  const a = e?.split(".", 1)[0] ?? "homeassistant";
  return a === "script" ? ["script", t === "on" ? "turn_on" : "turn_off"] : a === "fan" ? ["fan", t === "on" ? "turn_on" : "turn_off"] : a === "water_heater" ? ["water_heater", t === "on" ? "turn_on" : "turn_off"] : [a === "input_boolean" ? "input_boolean" : "homeassistant", t === "on" ? "turn_on" : "turn_off"];
}, Cr = (e) => {
  const t = d(
    e,
    "ulm_custom_card_washer_power",
    "ulm_card_power_outlet_entity",
    "ulm_card_power_entity"
  ), a = e.config.entity?.split(".", 1)[0], r = t || (["switch", "input_boolean", "light", "fan", "script", "water_heater"].includes(a ?? "") ? e.config.entity : void 0), o = r ? e.hass.states[r] : void 0, n = ee.has(o?.state ?? e.entity?.state ?? ""), i = A(e, "graph_entity"), [l, s] = Pr(r, n ? "off" : "on");
  return e.actionSurface(`ulm-control-card ulm-row ${n ? "is-active" : ""}`, c`
    ${F(e, e.config.entity?.startsWith("fan.") ? "mdi:fan" : "mdi:power-socket-eu", n ? "yellow" : "grey")}
    ${z(e, i ? `${v(e.entity)} · ${v(i)}` : v(e.entity))}
    ${r && e.config.show_controls !== !1 ? L(n ? "Turn off" : "Turn on", "mdi:power", (u) => {
    u.stopPropagation(), e.service(l, s, { entity_id: r });
  }) : p}
  `);
}, ye = /* @__PURE__ */ new WeakMap(), Se = /* @__PURE__ */ new WeakSet(), St = (e, t, a, r) => {
  const o = r === "tap" ? a.tap_action ?? { action: "toggle" } : a.hold_action ?? { action: "more-info" };
  ue(e, "hass-action", {
    config: { type: t.config.type, entity: a.entity, tap_action: o },
    action: "tap"
  });
}, Dr = (e) => {
  const t = (e.config.room_sensors?.length ? e.config.room_sensors : (e.config.entities ?? []).map((l) => ({ entity: l }))).filter((l) => l.entity).slice(0, 4), a = e.config.label_use_temperature ?? d(e, "label_use_temperature") ?? !0, r = e.config.label_use_brightness ?? d(e, "label_use_brightness") ?? !1, o = V(f(e.entity, "brightness")), n = f(e.entity, "current_temperature") ?? f(e.entity, "temperature") ?? f(e.entity, "device_temperature") ?? e.entity?.state ?? "—", i = a ? `${String(n)}${String(f(e.entity, "unit_of_measurement") ?? "°C")}` : r && e.entity?.state === "on" && o !== void 0 ? `${Math.round(o / 2.55)}%` : v(e.entity);
  return e.actionSurface(`ulm-room ulm-source-room ${e.entity?.state === "unavailable" ? "is-unavailable" : ""}`, c`
    <div class="room-main">
      <span class="room-copy">${z(e, i)}</span>
      <span class="ulm-icon tone-blue"><ha-icon .icon=${e.config.icon || "mdi:sofa-single"}></ha-icon></span>
      ${e.entity?.state === "unavailable" ? c`<span class="room-unavailable"><ha-icon icon="mdi:exclamation"></ha-icon></span>` : p}
    </div>
    ${t.length ? c`<div class="room-entities">${t.map((l) => {
    const s = e.hass.states[l.entity], u = s?.state === (l.active_state || "on"), h = G(l.color, "rgb(var(--ulm-blue))"), g = l.icon_type === "entity-picture" ? f(s, "entity_picture") : void 0;
    return c`<button
        class="metric-pill room-sensor ${u ? "is-active" : ""}"
        style=${`--item-color:${h}`}
        aria-label=${l.name || l.label || H({ entity: l.entity }, s, e.hass)}
        @pointerdown=${(_) => {
      _.stopPropagation();
      const b = _.currentTarget;
      Se.delete(b), ye.set(b, window.setTimeout(() => {
        Se.add(b), St(b, e, l, "hold");
      }, 500));
    }}
        @pointerup=${(_) => {
      _.stopPropagation();
      const b = _.currentTarget, y = ye.get(b);
      y && window.clearTimeout(y), ye.delete(b);
    }}
        @pointercancel=${(_) => {
      const b = _.currentTarget, y = ye.get(b);
      y && window.clearTimeout(y), ye.delete(b);
    }}
        @click=${(_) => {
      const b = _.currentTarget;
      if (Se.has(b)) {
        Se.delete(b), _.stopPropagation();
        return;
      }
      _.stopPropagation(), St(b, e, l, "tap");
    }}
      >${g ? c`<span class="room-sensor-picture" style=${`background-image:url("${String(g)}")`}></span>` : c`<ha-icon .icon=${l.icon || s?.attributes.icon || "mdi:circle-small"}></ha-icon>`}<span>${l.name || l.label || v(s)}</span></button>`;
  })}</div>` : p}
  `);
}, Er = (e) => {
  const t = String(e ?? "").trim(), a = t.match(/^(\d+(?:\.\d+)?)\s*(?::|\/|x)\s*(\d+(?:\.\d+)?)$/i);
  return a ? `${a[1]} / ${a[2]}` : /^\d+(?:\.\d+)?$/.test(t) ? t : "16 / 9";
}, Mr = (e) => {
  const t = f(e.entity, "entity_picture") || (e.entity?.entity_id.startsWith("camera.") ? `/api/camera_proxy/${e.entity.entity_id}` : void 0), a = d(e, "ulm_custom_card_camera_name"), r = d(e, "ulm_custom_card_camera_label"), o = qt(e, r || v(e.entity)), n = o.primary || (e.config.primary_info === void 0 ? a || H(e.config, e.entity, e.hass) : void 0), i = o.secondary, l = Er(
    e.config.aspect_ratio ?? d(e, "ulm_custom_card_camera_aspect_ratio")
  ), s = V(e.config.image_height), u = e.config.fit_mode ?? "cover", h = e.config.camera_view === "live" && e.entity?.entity_id.startsWith("camera."), g = s ? `height:${Math.max(80, s)}px` : `aspect-ratio:${l}`;
  return e.actionSurface("ulm-camera", c`
    <div class="camera-media" style=${g}>
      ${h ? c`<ha-camera-stream .hass=${e.hass} .stateObj=${e.entity}></ha-camera-stream>` : t ? c`<img src=${String(t)} alt=${n} width="1600" height="900"
          loading="lazy" style=${`object-fit:${u}`}>` : c`
      <div class="camera-placeholder">${F(e, "mdi:camera", "blue")}</div>
      `}
      ${n || i ? c`<div class="camera-overlay shared-presentation">
        ${n ? c`<b class="ulm-name">${n}</b>` : p}
        ${i ? c`<span class="ulm-label">${i}</span>` : p}
      </div>` : p}
    </div>
  `);
}, Qe = (e) => {
  const t = Object.entries(e.config).filter(([a, r]) => typeof r == "string" && r !== e.config.entity && /(_entity|_entity_id|_sensor|_power|_status|_level|_date|_time)$/i.test(a)).map(([, a]) => a);
  return [.../* @__PURE__ */ new Set([...e.config.entities ?? [], ...t])].map((a) => e.hass.states[a]).filter((a) => !!a).slice(0, 6);
}, Or = (e, t, a = "blue") => {
  const r = Qe(e);
  return e.actionSurface("ulm-detail-card", c`
    <div class="ulm-row">
      ${F(e, t, a)}
      ${z(e, v(e.entity))}
    </div>
    ${r.length ? c`<div class="detail-grid">${r.map((o) => c`
      <span class="metric-pill"><ha-icon .icon=${o.attributes.icon ?? "mdi:circle-small"}></ha-icon>${v(o)}</span>
    `)}</div>` : p}
  `);
}, Lr = (e) => {
  const t = Qe(e);
  return e.actionSurface("ulm-schedule-card", c`
    <div class="ulm-row">
      ${F(e, /pollen/.test(e.descriptor.upstreamId) ? "mdi:flower-pollen" : "mdi:trash-can", "green")}
      ${z(e, v(e.entity))}
    </div>
    <div class="schedule-list">${(t.length ? t : e.entity ? [e.entity] : []).slice(0, 4).map((a) => c`
      <span><b>${H({ entity: a.entity_id }, a, e.hass)}</b><small>${v(a)}</small></span>
    `)}</div>
  `);
}, Tr = (e) => {
  const t = V(e.entity?.state), a = Qe(e);
  return e.actionSurface("ulm-device-status", c`
    <div class="ulm-row">
      ${F(e, /printer/.test(e.descriptor.upstreamId) ? "mdi:printer" : /nas/.test(e.descriptor.upstreamId) ? "mdi:nas" : /washer/.test(e.descriptor.upstreamId) ? "mdi:washing-machine" : "mdi:devices", t !== void 0 && t < 20 ? "red" : "blue")}
      ${z(e, v(e.entity))}
      ${t !== void 0 ? c`<b class="device-value">${Math.round(t)}${String(e.entity?.attributes.unit_of_measurement ?? "")}</b>` : p}
    </div>
    ${t !== void 0 ? c`<span class="device-progress"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>` : p}
    ${a.length ? c`<div class="detail-grid">${a.map((r) => c`<span class="metric-pill">${v(r)}</span>`)}</div>` : p}
  `);
}, Nr = (e) => {
  const t = V(e.entity?.state) ?? 0, a = d(e, "ulm_card_gauge_min", "ulm_custom_card_gauge_min") ?? 0, r = d(e, "ulm_card_gauge_max", "ulm_custom_card_gauge_max") ?? 100, o = Math.max(0, Math.min(100, (t - a) / Math.max(1, r - a) * 100));
  return e.actionSurface("ulm-gauge-card", c`
    <span class="gauge-ring" style=${`--gauge:${o * 3.6}deg`}><b>${v(e.entity)}</b></span>
    ${z(e, `${a} – ${r}`)}
  `);
}, Ur = (e) => {
  const t = A(e, "datetime_entity");
  return e.actionSurface(`ulm-control-card ulm-row ${ee.has(e.entity?.state ?? "") ? "is-active" : ""}`, c`
    ${F(e, "mdi:alarm", ee.has(e.entity?.state ?? "") ? "yellow" : "grey")}
    ${z(e, v(t || e.entity))}
    ${e.config.show_controls !== !1 ? L(ee.has(e.entity?.state ?? "") ? "Disable alarm" : "Enable alarm", "mdi:power", (a) => {
    a.stopPropagation(), e.service("input_boolean", ee.has(e.entity?.state ?? "") ? "turn_off" : "turn_on", { entity_id: e.config.entity });
  }) : p}
  `);
}, P = (e, ...t) => {
  const a = d(e, ...t), r = typeof a == "string" ? a : a && typeof a == "object" && "entity_id" in a && typeof a.entity_id == "string" ? a.entity_id : void 0;
  return r ? e.hass.states[r] : void 0;
}, jr = (e) => {
  const t = oe(e.config).filter((l) => l.enabled !== !1 && l.entity), a = /* @__PURE__ */ new Set([
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
    const u = e.hass.states[l]?.state?.trim();
    if (!u || a.has(u.toLowerCase())) return;
    const h = u.replaceAll("_", " ").replace(/\s+/g, " ");
    return h.charAt(0).toLocaleUpperCase(e.hass.language) + h.slice(1);
  }, o = r(e.config.today_entity, e.config.show_today), n = r(e.config.tomorrow_entity, e.config.show_tomorrow), i = (l) => {
    if (!l || ["unknown", "unavailable", "none", "geen"].includes(l.state.toLowerCase())) return "—";
    if (l.entity_id.startsWith("calendar.")) {
      const s = f(l, "start_time") ?? f(l, "start") ?? f(l, "end_time");
      if (typeof s == "string") {
        const u = new Date(s);
        if (!Number.isNaN(u.getTime()))
          return new Intl.DateTimeFormat(e.hass.language, { day: "2-digit", month: "2-digit", year: "numeric" }).format(u);
      }
    }
    return l.state;
  };
  return e.actionSurface("custom-waste-card", c`
    <div class="custom-card-heading">
      ${F(e, "mdi:trash-can-outline", "green")}
      ${z(e, d(e, "ulm_volgende_ophaling") || [o ? `Today: ${o}` : "", n ? `Tomorrow: ${n}` : ""].filter(Boolean).join(" · ") || void 0, "Next collections")}
    </div>
    <div class="waste-grid">${t.map((l) => {
    const s = l.entity ? e.hass.states[l.entity] : void 0;
    return c`<span class="waste-row" style=${`--waste-color:${G(l.color, "rgb(var(--rgb-green, 76, 175, 80))")}`}>
        <ha-icon .icon=${l.icon || "mdi:trash-can"}></ha-icon>
        <b>${l.label || s?.attributes.friendly_name || l.entity}</b>
        <small>${i(s)}</small>
      </span>`;
  })}</div>
  `);
}, Fr = (e) => {
  const t = P(e, "ulm_card_alarm_time_datetime") ?? A(e, "datetime_entity"), a = V(d(e, "ulm_card_alarm_time_step")) ?? 15, r = t?.state || "00:00:00", [o, n] = r.split(":").map(Number), i = (g) => {
    const _ = ((o || 0) * 60 + (n || 0) + g + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: t?.entity_id,
      time: `${String(Math.floor(_ / 60)).padStart(2, "0")}:${String(_ % 60).padStart(2, "0")}:00`
    });
  }, l = !t || ["unknown", "unavailable"].includes(t.state.toLowerCase()), s = d(e, "ulm_card_alarm_time_collapse") === !0 && !ee.has(e.entity?.state ?? ""), u = ee.has(e.entity?.state ?? ""), h = G(
    d(e, "ulm_card_alarm_time_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface(`custom-alarm-time ${d(e, "ulm_card_alarm_time_horizontal") ? "is-horizontal" : ""}`, c`
    <div class="custom-card-heading">
      ${ge(e, d(e, "ulm_card_alarm_time_icon") || "mdi:alarm", h, u)}
      ${z(e, v(e.entity))}
    </div>
    ${s ? p : c`<div class="alarm-time-controls">
      ${L(`Earlier by ${a} minutes`, "mdi:minus", (g) => {
    g.stopPropagation(), i(-a);
  }, l)}
      <b>${r.slice(0, 5)}</b>
      ${L(`Later by ${a} minutes`, "mdi:plus", (g) => {
    g.stopPropagation(), i(a);
  }, l)}
    </div>`}
  `);
}, Br = (e) => {
  const t = !e.entity || e.entity.state === "unavailable", a = e.entity?.state === "playing";
  return e.actionSurface("custom-chromecast", c`
    <div class="custom-card-heading">
      ${F(e, "mdi:cast", t ? "grey" : "blue")}
      ${z(e, v(e.entity))}
    </div>
    <div class="chromecast-controls">
      ${L("Toggle power", "mdi:power", (r) => {
    r.stopPropagation(), e.service("media_player", "toggle", { entity_id: e.config.entity });
  }, t)}
      ${L("Play or pause", a ? "mdi:pause" : "mdi:play", (r) => {
    r.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: e.config.entity });
  }, t)}
      ${L("Toggle input", "mdi:video-input-hdmi", (r) => {
    r.stopPropagation(), e.service("media_player", "toggle", { entity_id: e.config.entity });
  }, t)}
    </div>
  `);
}, Fe = (e, t) => {
  const a = f(t, "entity_id");
  return Array.isArray(a) ? a.map(String).map((r) => e.hass.states[r]).filter((r) => !!r) : t ? [t] : [];
}, Rr = (e) => {
  const t = (_) => P(e, _), a = t("temperature"), r = t("humidity"), o = {
    doors: t("group_doors"),
    windows: t("group_windows"),
    motions: t("group_motions"),
    water: t("group_water"),
    lights: t("group_lights"),
    shutters: t("group_windows_shutters"),
    outlets: t("group_outlets"),
    tv: t("group_tv")
  }, n = Object.values(o).flatMap((_) => Fe(e, _)).filter((_) => (V(f(_, "battery")) ?? 101) <= 20), i = Object.values(o).flatMap((_) => Fe(e, _)).filter((_) => _.state === "unavailable"), l = (_) => Fe(e, _).filter((b) => b.state === "on" || b.state === "open").length, s = (_, b) => {
    b && W(_, e, { action: "more-info" }, b.entity_id);
  }, u = (_, b) => {
    b && b.state !== "unavailable" && W(_, e, { action: "toggle" }, b.entity_id);
  }, h = [
    [o.doors, "mdi:door-open"],
    [o.windows, "mdi:window-open-variant"],
    [o.motions, "mdi:motion-sensor"],
    [o.water, "mdi:water"]
  ], g = [
    [o.lights, o.lights?.state === "on" ? "mdi:lightbulb-group" : "mdi:lightbulb-group-off"],
    [o.shutters, o.shutters?.state === "on" ? "mdi:window-shutter-open" : "mdi:window-shutter"],
    [o.outlets, o.outlets?.state === "on" ? "mdi:power-plug" : "mdi:power-plug-off"],
    [o.tv, o.tv?.state === "on" ? "mdi:television" : "mdi:television-off"]
  ];
  return e.actionSurface("custom-room-view", c`
    <div class="room-view-summary" @click=${(_) => s(_, a ?? r)}>
      <span class="room-view-icon"><ha-icon .icon=${e.config.icon || "mdi:home-variant-outline"}></ha-icon>${i.length ? c`<i>${i.length}</i>` : p}</span>
      <span><b><ha-icon icon="mdi:thermometer"></ha-icon>${v(a)}</b><small><ha-icon icon="mdi:water-percent"></ha-icon>${v(r)}</small></span>
    </div>
    <div class="room-view-status">
      ${h.map(([_, b]) => _ && l(_) ? c`<button aria-label=${H({ entity: _.entity_id }, _, e.hass)} @pointerdown=${(y) => y.stopPropagation()} @click=${(y) => s(y, _)}><ha-icon .icon=${b}></ha-icon>${l(_) > 1 ? c`<i>${l(_)}</i>` : p}</button>` : p)}
      ${n.length ? c`<button aria-label="Low batteries" @pointerdown=${(_) => _.stopPropagation()} @click=${(_) => s(_, n[0])}><ha-icon icon="mdi:battery-20"></ha-icon><i>${n.length}</i></button>` : p}
      ${!h.some(([_]) => l(_)) && !n.length ? c`<span class="room-view-clear"><ha-icon icon="mdi:check"></ha-icon></span>` : p}
    </div>
    <div class="room-view-actions">
      ${g.map(([_, b]) => _ ? c`
        <button class=${_.state === "on" ? "is-active" : ""} aria-label=${H({ entity: _.entity_id }, _, e.hass)}
          ?disabled=${_.state === "unavailable"} @pointerdown=${(y) => y.stopPropagation()}
          @dblclick=${(y) => u(y, _)} @click=${(y) => y.stopPropagation()}>
          <ha-icon .icon=${_.state === "unavailable" ? "mdi:exclamation-thick" : b}></ha-icon>
          ${l(_) ? c`<i>${l(_)}</i>` : p}
        </button>` : p)}
    </div>
  `);
}, Hr = (e) => {
  const t = P(e, "ulm_card_welcome_collapse"), a = P(e, "ulm_weather"), r = t?.state === "on", o = Array.from({ length: 5 }, (n, i) => i + 1).map((n) => ({
    nav: d(e, `nav_${n}`),
    icon: d(e, `icon_${n}`) || "mdi:circle",
    name: d(e, `name_${n}`) || `Item ${n}`,
    color: d(e, `color_${n}`) || "blue"
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
    a && W(n, e, { action: "more-info" }, a.entity_id);
  }}>
        <ha-icon icon="mdi:thermometer"></ha-icon>
      </button>
      <button aria-label="Dashboard settings" @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => W(n, e, { action: "navigate", navigation_path: "/config/dashboard" })}>
        <ha-icon icon="mdi:cog-outline"></ha-icon>
      </button>
    </div>
    <div class="welcome-greeting">${z(e, `Good ${(/* @__PURE__ */ new Date()).getHours() < 12 ? "morning" : (/* @__PURE__ */ new Date()).getHours() < 18 ? "afternoon" : "evening"}`)}</div>
    ${r ? p : c`<div class="welcome-items">${o.map((n) => c`
      <button class="tone-${n.color}" aria-label=${n.name}
        @pointerdown=${(i) => i.stopPropagation()}
        @click=${(i) => W(i, e, { action: "navigate", navigation_path: n.nav })}>
        <i><ha-icon .icon=${n.icon}></ha-icon></i><small>${n.name}</small>
      </button>
    `)}</div>`}
  `);
}, Wr = (e) => {
  const t = P(e, "ulm_custom_card_room_overview_light_entity"), a = P(e, "ulm_custom_card_room_overview_climate_entity"), r = P(e, "ulm_custom_card_room_overview_cover_entity"), o = t?.state === "on", n = V(f(t, "brightness")), i = e.config.secondary || (t ? o && n ? `${Math.round(n / 2.55)}%` : v(t) : v(e.entity)), l = f(t, "rgb_color"), s = d(e, "ulm_card_dynamic_color") === !0 && o && Array.isArray(l), u = (g, _) => {
    _ && W(g, e, { action: "toggle" }, _.entity_id);
  }, h = (g, _) => {
    const b = _ === "light" ? d(e, o ? "ulm_card_room_overview_light_icon_on" : "ulm_card_room_overview_light_icon_off") || (o ? "mdi:lightbulb" : "mdi:lightbulb-off") : _ === "cover" ? d(e, g.state === "closed" ? "ulm_card_room_overview_cover_icon_closed" : "ulm_card_room_overview_cover_icon_open") || (g.state === "closed" ? "mdi:roller-shade-closed" : "mdi:blinds-open") : { auto: "mdi:autorenew", cool: "mdi:snowflake", heat: "mdi:fire", dry: "mdi:water", heat_cool: "mdi:sun-snowflake", fan_only: "mdi:fan", off: "mdi:snowflake-off" }[g.state] ?? "mdi:thermostat";
    return c`<button class="room-overview-control ${_} state-${g.state}" aria-label=${H({ entity: g.entity_id }, g, e.hass)}
      ?disabled=${g.state === "unavailable"} @pointerdown=${(y) => y.stopPropagation()} @click=${(y) => u(y, g)}>
      <ha-icon .icon=${b}></ha-icon>
    </button>`;
  };
  return e.actionSurface(`custom-room-overview ${o ? "light-on" : ""} ${s ? "dynamic-color" : ""}`, c`
    <div class="room-overview-main" style=${s ? `--room-rgb:${l.slice(0, 3).join(",")};` : ""}>
      ${F(e, "mdi:sofa", o ? "yellow" : "grey")}
      ${z(e, i)}
    </div>
    <div class="room-overview-controls">
      ${t ? h(t, "light") : p}
      ${r ? h(r, "cover") : a ? h(a, "climate") : p}
    </div>
  `);
}, qr = (e) => {
  const t = P(e, "power_entity") ?? P(e, "ulm_custom_card_washer_power"), a = P(e, "ulm_custom_card_washer_machine_state") ?? e.entity, r = P(e, "ulm_custom_card_washer_job_progress"), o = P(e, "ulm_custom_card_washer_job_state") ?? e.entity, n = P(e, "ulm_custom_card_washer_remote_control"), i = P(e, "ulm_custom_card_washer_delayed_start"), l = P(e, "ulm_custom_card_washer_delayed_starttime"), s = P(e, "door_entity"), u = P(e, "finished_entity"), h = d(e, "ulm_custom_card_washer_machine_stop_state") ?? "stop", g = t ? !["off", "unavailable", "unknown", "0"].includes(t.state.toLowerCase()) : a ? !["off", "unavailable", "unknown"].includes(a.state.toLowerCase()) : !0, _ = !a || a.state === h || a.state === "off", b = ["true", "on", "enabled"].includes(n?.state.toLowerCase() ?? ""), y = i?.state === "on", T = Math.max(0, Math.min(100, V(r?.state) ?? 0)), w = d(
    e,
    "ulm_custom_card_washer_job_states"
  ), k = Object.values(w ?? {
    state1: { name: "weightSensing", icon: "mdi:scale" },
    state2: { name: "wash", icon: "mdi:waves" },
    state3: { name: "rinse", icon: "mdi:water" },
    state4: { name: "spin", icon: "mdi:fan" }
  }).filter(($) => $.name && $.icon).slice(0, 5), x = k.findIndex(($) => $.name?.toLowerCase() === o?.state.toLowerCase()), C = g ? _ ? b && y ? d(e, "ulm_custom_card_washer_label_configuring") ?? "configure" : d(e, "ulm_custom_card_washer_label_idle") ?? "idle" : d(e, "ulm_custom_card_washer_label_running") ?? "run" : d(e, "ulm_custom_card_washer_label_idle") ?? "idle", j = ($) => d(e, $) ?? { action: "none" }, K = ($, N) => W($, e, N, typeof N.entity == "string" ? N.entity : e.config.entity), q = l?.state.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)?.slice(1).map(Number), D = ($, N) => {
    if ($.stopPropagation(), !l || !q) return;
    const E = ((q[0] * 60 + q[1] + N) % 1440 + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: l.entity_id,
      time: `${String(Math.floor(E / 60)).padStart(2, "0")}:${String(E % 60).padStart(2, "0")}:00`
    });
  }, X = j(_ ? "ulm_custom_card_washer_start_action" : "ulm_custom_card_washer_pause_action"), S = j("ulm_custom_card_washer_stop_action");
  return e.actionSurface("custom-washer", c`
    <div class="custom-card-heading washer-heading">
      ${F(e, "mdi:washing-machine", g ? "blue" : "grey")}
      ${z(e, C)}
      ${t ? c`<b class="washer-power">${v(t)}</b>` : p}
    </div>
    ${g && k.length ? c`
      <div class="washer-stages" style=${`--washer-stage-count:${k.length}`}>
        ${k.map(($, N) => c`
          <span class=${x === N ? "is-active" : ""} title=${$.name ?? ""}>
            <ha-icon .icon=${$.icon}></ha-icon>
          </span>
        `)}
      </div>
    ` : p}
    ${g && r ? c`
      <div class="washer-progress">
        <span style=${`width:${T}%`}></span>
        <b>${Math.round(T)}%</b>
      </div>
    ` : p}
    ${g && b ? c`
      <div class="washer-controls">
        ${L(
    _ ? "Start washer" : "Pause washer",
    _ ? "mdi:play" : "mdi:pause",
    ($) => K($, X),
    X.action === "none"
  )}
        ${L(
    "Stop washer",
    "mdi:stop",
    ($) => K($, S),
    _ || S.action === "none"
  )}
        ${i ? L(
    y ? "Disable delayed start" : "Enable delayed start",
    "mdi:alarm",
    ($) => W($, e, { action: "toggle" }, i.entity_id),
    !_
  ) : p}
      </div>
    ` : p}
    ${g && b && y && l ? c`
      <div class="washer-delay-controls">
        ${L("Move delayed start 15 minutes earlier", "mdi:arrow-down", ($) => D($, -15))}
        <button class="washer-delay-time" aria-label="Move delayed start 1 minute later"
          @pointerdown=${($) => $.stopPropagation()}
          @click=${($) => D($, 1)}>${l.state}</button>
        ${L("Move delayed start 15 minutes later", "mdi:arrow-up", ($) => D($, 15))}
      </div>
    ` : p}
    ${s || u || n ? c`
      <div class="washer-status">
        ${s ? c`<span><ha-icon icon="mdi:door"></ha-icon>${v(s)}</span>` : p}
        ${u ? c`<span><ha-icon icon="mdi:check-circle"></ha-icon>${v(u)}</span>` : p}
        ${n ? c`<span><ha-icon icon="mdi:remote"></ha-icon>${v(n)}</span>` : p}
      </div>
    ` : p}
  `);
}, Gr = (e) => {
  const t = f(e.entity, "next_rising"), a = f(e.entity, "next_setting"), r = f(e.entity, "next_dawn") ?? t, o = f(e.entity, "next_noon"), n = f(e.entity, "next_dusk") ?? a, i = d(e, "language") || e.hass.language || "en", l = d(e, "timeFormat") === "12h", s = (b) => {
    const y = new Date(String(b ?? ""));
    return Number.isNaN(y.getTime()) ? "—" : new Intl.DateTimeFormat(i, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: l
    }).format(y);
  }, u = e.entity?.state === "above_horizon", h = V(f(e.entity, "elevation")), g = V(f(e.entity, "azimuth")), _ = d(e, "title");
  return e.actionSurface(`custom-sun-card ${d(e, "darkMode") ? "is-dark" : ""}`, c`
    ${_ ? c`<b class="sun-title">${_}</b>` : p}
    <div class="sun-times"><span><small>Sunrise</small><b>${s(t)}</b></span><span><small>Sunset</small><b>${s(a)}</b></span></div>
    <div class="sun-arc">
      <svg viewBox="0 0 300 90" preserveAspectRatio="none"><path class="sun-night" d="M0,62 Q60,115 105,62"></path><path class="sun-day" d="M0,62 Q150,-45 300,62"></path><line x1="0" y1="62" x2="300" y2="62"></line></svg>
      <span class="sun-marker" style=${u ? "--sun-x:56.67%;--sun-y:20%" : "--sun-x:9.33%;--sun-y:77.78%"}></span>
    </div>
    <div class="sun-footer"><span><small>Dawn</small><b>${s(r)}</b></span><span><small>Solar noon</small><b>${s(o)}</b></span><span><small>Dusk</small><b>${s(n)}</b></span></div>
    ${d(e, "showAzimuth") || d(e, "showElevation") ? c`
      <div class="sun-position">
        ${d(e, "showAzimuth") ? c`<span>Azimuth <b>${g ?? "—"}°</b></span>` : p}
        ${d(e, "showElevation") ? c`<span>Elevation <b>${h ?? "—"}°</b></span>` : p}
      </div>
    ` : p}
  `);
}, Kr = (e) => {
  const t = !!(e.entity && !["unavailable", "unknown"].includes(e.entity.state)), r = (t ? e.entity.state : "00:00:00").split(" ").at(-1) || "00:00:00", [o, n] = r.split(":").map(Number), i = (l) => {
    const s = ((o || 0) * 60 + (n || 0) + l + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: e.config.entity,
      time: `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:00`
    });
  };
  return e.actionSurface("custom-input-datetime", c`
    <div class="custom-card-heading">${F(e, "mdi:calendar-clock", "green")}${z(e, v(e.entity))}</div>
    <div class="input-datetime-controls">
      ${L("15 minutes earlier", "mdi:arrow-down", (l) => {
    l.stopPropagation(), i(-15);
  }, !t)}
      ${fr(
    "One minute later; hold for one minute earlier",
    c`<b>${t ? r.slice(0, 5) : "Unavailable"}</b>`,
    () => i(1),
    () => i(-1),
    !t
  )}
      ${L("15 minutes later", "mdi:arrow-up", (l) => {
    l.stopPropagation(), i(15);
  }, !t)}
    </div>
  `);
}, Zr = (e) => {
  const t = [1, 2, 3, 4].map((a) => P(e, `ulm_custom_card_entity_overview_entity_${a}`) ?? (e.config.entities?.[a - 1] ? e.hass.states[e.config.entities[a - 1]] : void 0));
  return e.actionSurface("custom-entity-overview", c`
    <div class="metrics-panel">
      <span class="metrics-main-name"><ha-icon .icon=${d(e, "ulm_custom_card_entity_overview_icon") || "mdi:alien"}></ha-icon>${z(e, v(e.entity))}</span>
      <b>${v(e.entity)}</b>
    </div>
    <div class="metrics-four">${t.map((a, r) => c`
      <button ?disabled=${!a} @pointerdown=${(o) => o.stopPropagation()}
        @click=${(o) => a && W(o, e, { action: "more-info" }, a.entity_id)}>
        <b>${v(a)}</b>
        <small>${d(e, `ulm_custom_card_entity_overview_name_${r + 1}`) || (a ? H({ entity: a.entity_id }, a, e.hass) : `Entity ${r + 1}`)}</small>
      </button>
    `)}</div>
  `);
}, Jr = (e) => {
  const t = A(e, "download_entity") ?? P(e, "ulm_custom_card_internet_speed_download_speed_entity") ?? e.entity, a = A(e, "upload_entity") ?? P(e, "ulm_custom_card_internet_speed_upload_speed_entity"), r = A(e, "ping_entity") ?? P(e, "ulm_custom_card_internet_speed_ping_entity"), o = [t, a, r].filter((i) => !!i), n = G(
    d(e, "ulm_custom_card_internet_speed_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface("custom-internet-speed", c`
    <div class="speedtest-router">
      <span class="ulm-icon source-icon is-source-active" style=${`--source-color:${n}`}><ha-icon icon="mdi:wifi"></ha-icon></span>
      ${z(e, d(e, "ulm_custom_card_internet_speed_router_model") || "router_model")}
    </div>
    <button class="speedtest-action" ?disabled=${o.length !== 3}
      @pointerdown=${(i) => i.stopPropagation()} @click=${(i) => {
    i.stopPropagation(), e.service("homeassistant", "update_entity", { entity_id: o.map((l) => l.entity_id) });
  }}>
      <ha-icon icon="mdi:speedometer"></ha-icon>
      <span>${d(e, "ulm_custom_card_internet_speed_speedtest") || "Internet speed test"}</span>
      <ha-icon icon="mdi:chevron-right"></ha-icon>
    </button>
    <div class="speedtest-metrics">
      ${[
    [d(e, "ulm_custom_card_internet_speed_download") || "Download speed", t],
    [d(e, "ulm_custom_card_internet_speed_upload") || "Upload speed", a]
  ].map(([i, l]) => c`
        <button ?disabled=${!l} @pointerdown=${(s) => s.stopPropagation()}
          @click=${(s) => l && W(s, e, { action: "more-info" }, l.entity_id)}>
          <b><span>${l?.state ?? "—"}</span>${f(l, "unit_of_measurement") ? c`<em>${String(f(l, "unit_of_measurement"))}</em>` : p}</b>
          <small>${String(i)}</small>
        </button>
      `)}
    </div>
  `);
}, Yr = (e) => {
  const t = [1, 2, 3, 4].map((i) => P(e, `ulm_custom_card_weather_metrics_entity_${i}`) ?? (e.config.entities?.[i - 1] ? e.hass.states[e.config.entities[i - 1]] : void 0)), a = A(e, "temperature_entity"), r = A(e, "date_entity") ?? P(e, "ulm_custom_card_weather_metrics_date"), o = e.entity?.state || "unknown", n = {
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
      <b class="weather-date">${n[o] || "❔"} ${r ? v(r) : "Date unavailable"}</b>
      <strong>${a ? v(a) : `${f(e.entity, "temperature") ?? "—"}°`}</strong>
    </div>
    <div class="metrics-four">${t.map((i, l) => c`
      <button ?disabled=${!i} @pointerdown=${(s) => s.stopPropagation()}
        @click=${(s) => i && W(s, e, { action: "more-info" }, i.entity_id)}>
        <b>${v(i)}</b>
        <small>${d(e, `ulm_custom_card_weather_metrics_name_${l + 1}`) || (i ? H({ entity: i.entity_id }, i, e.hass) : `Weather ${l + 1}`)}</small>
      </button>
    `)}</div>
  `);
}, Qr = (e) => {
  const t = !e.entity || e.entity.state === "unavailable", a = Math.round((V(f(e.entity, "volume_level")) ?? 0) * 100), r = f(e.entity, "source"), o = ["idle", "paused", "unavailable"].includes(e.entity?.state ?? "") ? v(e.entity) : `${r ? String(r) : v(e.entity)} • ${a}%`;
  return e.actionSurface("custom-sonos", c`
    <div class="custom-card-heading">
      ${F(e, "mdi:speaker", e.entity?.state === "playing" ? "green" : "grey")}
      ${z(e, o)}
    </div>
    <div class="sonos-controls">
      ${L("Volume down", "mdi:volume-minus", (n) => {
    n.stopPropagation(), e.service("media_player", "volume_down", { entity_id: e.config.entity });
  }, t)}
      ${L("Play or pause", ["paused", "off"].includes(e.entity?.state ?? "") ? "mdi:play" : "mdi:pause", (n) => {
    n.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: e.config.entity });
  }, t)}
      ${L("Volume up", "mdi:volume-plus", (n) => {
    n.stopPropagation(), e.service("media_player", "volume_up", { entity_id: e.config.entity });
  }, t)}
    </div>
  `);
}, Xr = (e) => {
  const t = A(e, "power_entity"), a = A(e, "energy_entity"), r = A(e, "time_entity"), o = r ? (V(r.state) ?? 0) < 1 ? `${(V(r.state) ?? 0) * 100}Mins` : `${r.state}Hrs` : void 0, n = e.entity?.state === "on", i = n ? [
    t ? `${t.state}W` : void 0,
    a ? `${a.state}kWh` : void 0,
    o
  ].filter(Boolean).join(" • ") || v(e.entity) : a && (V(a.state) ?? 0) > 0 ? `${v(e.entity)} • ${a.state}kWh` : v(e.entity);
  return e.actionSurface("custom-more-power-outlet", c`
    ${F(e, "mdi:power-socket-eu", n ? "yellow" : "grey")}
    ${z(e, i || v(e.entity))}
  `);
}, eo = (e) => {
  const t = V(e.entity?.state) ?? 0, a = V(e.config.minimum) ?? 0, r = V(e.config.maximum) ?? 100, o = Math.max(0, Math.min(100, (t - a) / Math.max(1, r - a) * 100));
  return e.actionSurface("custom-dual-gauge", c`
    <div class="custom-card-heading">${F(e, "mdi:gauge", "blue")}${z(e, v(e.entity))}</div>
    <div class="dual-gauge" style=${`--gauge:${o * 1.8}deg`}>
      <i></i>
      ${a === 0 && r === 100 ? p : c`<span><small>${a} - ${r}</small></span>`}
    </div>
  `);
}, to = (e) => {
  const t = [
    A(e, "black_entity"),
    A(e, "yellow_entity"),
    A(e, "magenta_entity"),
    A(e, "cyan_entity")
  ], a = ["#111", "#faff00", "#f800ff", "#00ffff"];
  return e.actionSurface("custom-printer", c`
    <div class="custom-card-heading">
      ${F(e, "mdi:printer", e.entity?.state === "idle" ? "grey" : "blue")}
      ${z(e, v(e.entity))}
    </div>
    <div class="toner-bars">${t.map((r, o) => {
    if (!r) return p;
    const n = Math.max(0, Math.min(100, V(r.state) ?? 0));
    return c`<span style=${`--toner:${a[o]};--level:${n}%`}><i><em></em><b>${v(r)}</b></i></span>`;
  })}</div>
  `);
}, ao = (e) => {
  const t = A(e, "disk_entity") ?? P(e, "entity_4"), a = A(e, "temperature_entity") ?? P(e, "entity_1"), r = A(e, "memory_entity") ?? P(e, "entity_2"), o = A(e, "cpu_entity") ?? P(e, "entity_3"), n = !["off", "unavailable", "unknown"].includes(e.entity?.state ?? ""), i = (_, b) => G(
    d(e, _),
    G(b, b)
  ), l = (_) => !!d(e, _), s = (_) => {
    const b = e.config[_];
    return b && typeof b == "object" && "max_value" in b ? V(b.max_value) : void 0;
  }, u = (_, b, y, T = 100) => {
    const w = Math.max(0, Math.min(T, V(_?.state) ?? 0)), k = 2 * Math.PI * b, x = k * (1 - w / T);
    return _t`<circle class="nas-metrics-ring-value" cx="70" cy="70" r=${b}
      fill="none" stroke=${y} stroke-width="6" stroke-linecap="round"
      stroke-dasharray=${k} stroke-dashoffset=${x}></circle>`;
  }, h = e.entity?.state === "on" ? "Access" : v(e.entity), g = c`
    <button class="nas-metrics-tile status-tile" aria-label="Open NAS status"
      @pointerdown=${(_) => _.stopPropagation()}
      @click=${(_) => W(_, e, { action: "more-info" })}>
      <span class="nas-metrics-tile-icon tone-blue"><ha-icon icon="mdi:nas"></ha-icon></span>
      <span><b>Status</b><small>${h}</small></span>
    </button>`;
  return n ? e.actionSurface("custom-nas-metrics is-on", c`
    <div class="nas-metrics-top">
      ${g}
      <div class="nas-metrics-tile disk-tile">
        <span class=${`nas-metrics-tile-icon ${l("disk_color") ? "" : "tone-red"}`}
          style=${l("disk_color") ? `color:${i("disk_color", "red")};background:color-mix(in srgb, ${i("disk_color", "red")} 18%, transparent)` : ""}>
          <ha-icon .icon=${d(e, "disk_icon") || "mdi:harddisk"}></ha-icon>
        </span>
        <span><b>${d(e, "disk_name") || "Disk"}</b><small>${v(t)}</small></span>
      </div>
    </div>
    <div class="nas-metrics-body">
      <div class="nas-metrics-metrics">
        <span><i class=${l("temperature_color") ? "" : "tone-orange"} style=${l("temperature_color") ? `color:${i("temperature_color", "orange")}` : ""}><ha-icon .icon=${d(e, "temperature_icon") || "mdi:thermometer"}></ha-icon></i><span><b>${d(e, "temperature_name") || "Temp"}</b><small>${v(a)}</small></span></span>
        <span><i class=${l("memory_color") ? "" : "tone-blue"} style=${l("memory_color") ? `color:${i("memory_color", "blue")}` : ""}><ha-icon .icon=${d(e, "memory_icon") || "mdi:memory"}></ha-icon></i><span><b>${d(e, "memory_name") || "Memory"}</b><small>${v(r)}</small></span></span>
        <span><i class=${l("cpu_color") ? "" : "tone-green"} style=${l("cpu_color") ? `color:${i("cpu_color", "green")}` : ""}><ha-icon .icon=${d(e, "cpu_icon") || "mdi:cpu-64-bit"}></ha-icon></i><span><b>${d(e, "cpu_name") || "CPU"}</b><small>${v(o)}</small></span></span>
      </div>
      <svg class="nas-metrics-rings" viewBox="0 0 140 140" role="img" aria-label="NAS temperature, memory, and CPU utilization">
        ${[58, 48, 38].map((_) => _t`<circle class="nas-metrics-ring-track" cx="70" cy="70" r=${_}
          fill="none" stroke="#dedede" stroke-width="6"></circle>`)}
        ${u(a, 58, i("temperature_color", "orange"), V(d(e, "temperature_max")) ?? s("entity_1") ?? 100)}
        ${u(r, 48, i("memory_color", "blue"), V(d(e, "memory_max")) ?? s("entity_2") ?? 100)}
        ${u(o, 38, i("cpu_color", "green"), V(d(e, "cpu_max")) ?? s("entity_3") ?? 100)}
      </svg>
    </div>
  `) : e.actionSurface("custom-nas-metrics is-off", c`<div class="nas-metrics-top">${g}</div>`);
}, ro = (e) => {
  const t = A(e, "battery_entity"), a = Math.max(0, Math.min(100, V(t?.state) ?? 0)), r = [
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
    ([u, h]) => h ? [[u, h]] : []
  ), i = r.flatMap(
    ([u, h, g, _]) => {
      const b = A(e, u);
      return b ? [[h, g, _, b]] : [];
    }
  ), l = e.entity?.state === "on" ? "Access" : v(e.entity), s = (u, h) => {
    if (u.stopPropagation(), !h) return;
    h.entity_id.split(".")[0] === "button" ? e.service("button", "press", { entity_id: h.entity_id }) : e.service("homeassistant", "toggle", { entity_id: h.entity_id });
  };
  return e.actionSurface("custom-tablet", c`
    <div class="tablet-header">
      <span class="tablet-icon"><ha-icon icon="mdi:tablet"></ha-icon></span>
      ${z(e, l)}
    </div>
    ${i.length ? c`<div class="tablet-controls">${i.map(([u, h, g, _]) => {
    const b = _.state.toLowerCase() === "unavailable";
    return c`<button class="tone-${h} ${ee.has(_.state) ? "is-active" : ""}"
        aria-label=${g} ?disabled=${b}
        @pointerdown=${(y) => y.stopPropagation()}
        @click=${(y) => s(y, _)}>
        <ha-icon .icon=${u}></ha-icon>
      </button>`;
  })}</div>` : p}
    ${n.length ? c`<div class="tablet-metrics">${n.map(([u, h]) => c`
      <span class=${h.state.toLowerCase() === "unavailable" ? "is-unavailable" : ""}><b>${v(h)}</b><small>${u}</small></span>
    `)}</div>` : p}
    ${t ? c`<div class="tablet-battery-row">
      <span class="tablet-battery-icon"><ha-icon icon="mdi:battery"></ha-icon></span>
      <span><b>${v(t)}</b><small>Battery</small></span>
    </div>
    <div class="tablet-battery-bar"><i style=${`width:${a}%`}></i><b>${a}%</b></div>` : p}
  `);
}, Vt = {
  en: ["none", "none to low", "low", "low to medium", "medium", "medium to high", "high"],
  de: ["keine", "keine bis gering", "gering", "gering bis mittel", "mittel", "mittel bis hoch", "hoch"],
  es: ["ninguno", "ninguno a bajo", "bajo", "bajo a medio", "medio", "medio a alto", "alto"],
  pl: ["brak", "bardzo słabe", "słabe", "umiarkowane", "średnie", "wysokie", "bardzo wysokie"]
}, oo = (e, t) => {
  const a = Math.max(0, Math.min(6, Math.round(t))), r = d(e, "pollen_language") || e.hass.language?.split("-")[0] || "en";
  return [d(e, `ulm_custom_card_pollen_forecast_${a || "none"}`) || (Vt[r] ?? Vt.en)[a], ["transparent", "rgb(219,250,200)", "rgb(254,228,156)", "rgb(254,197,77)", "rgb(254,154,36)", "rgb(240,56,26)", "rgb(190,0,33)"][a]];
}, no = (e) => {
  const t = A(e, "level_entity") ?? e.entity, a = V(t?.state) ?? 0, [r, o] = oo(e, a);
  return e.actionSurface("custom-pollen-forecast", c`
    ${z(e, r)}
    <span class="pollen-icon" style=${`--pollen:${o}`}><ha-icon .icon=${d(e, "ulm_custom_card_pollen_forecast_icon") || e.config.icon || e.entity?.attributes.icon || "mdi:flower-pollen"}></ha-icon></span>
  `);
}, so = (e) => {
  const t = A(e, "time_entity") ?? P(e, "ulm_custom_card_welcome_dashboard_time"), a = t?.state && /^\d\d:\d\d/.test(t.state) ? t.state : (/* @__PURE__ */ new Date()).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: !1 }), r = a > "18:00" ? d(e, "ulm_evening") || "Good evening" : a > "12:00" ? d(e, "ulm_afternoon") || "Good afternoon" : a > "05:00" ? d(e, "ulm_morning") || "Good morning" : d(e, "ulm_hello") || "Hello", o = A(e, "weather_entity") ?? P(e, "ulm_custom_card_welcome_dashboard_weather_provider") ?? P(e, "ulm_weather"), n = e.config.variant ?? (e.config.news_entities?.length ? "news" : o ? "weather" : "message"), i = (e.config.news_entities ?? []).map((l) => e.hass.states[l]).filter(Boolean).slice(0, 3);
  return e.actionSurface("custom-welcome-dashboard", c`
    <div class="welcome-dashboard-message">${z(
    e,
    `${H(e.config, e.entity, e.hass)}!`,
    `${r},`
  )}</div>
    ${n === "weather" && o ? c`
      <button class="welcome-dashboard-weather" aria-label="Open weather details"
        @pointerdown=${(l) => l.stopPropagation()}
        @click=${(l) => W(l, e, { action: "more-info" }, o.entity_id)}>
        <span><ha-icon .icon=${Kt[o.state]?.[0] || "mdi:weather-partly-cloudy"}></ha-icon>
          <b>${o.state.replaceAll("-", " ")}</b><small>${H({ entity: o.entity_id }, o, e.hass)}</small></span>
        <strong>${f(o, "temperature") ?? "—"}°</strong>
      </button>
    ` : p}
    ${n === "news" ? c`
      <div class="welcome-dashboard-news">
        ${i.map((l) => c`<button
          @pointerdown=${(s) => s.stopPropagation()}
          @click=${(s) => W(s, e, { action: "more-info" }, l.entity_id)}>
          <ha-icon .icon=${String(f(l, "icon") || "mdi:information-outline")}></ha-icon>
          <span><b>${H({ entity: l.entity_id }, l, e.hass)}</b><small>${v(l)}</small></span>
        </button>`)}
        ${i.length === 0 ? c`<span class="welcome-dashboard-empty">No configured news entities</span>` : p}
      </div>
    ` : p}
  `);
}, io = (e) => {
  const t = e.config.variant === "small", a = Ce(e.hass, e.config.entity), r = (E) => {
    const B = e.config[E] ?? a[E];
    return typeof B == "string" ? e.hass.states[B] : void 0;
  }, o = r("ulm_card_person_battery_entity") ?? A(e, "battery_entity"), n = r("ulm_card_person_battery_state_entity"), i = r("ulm_card_person_driving_entity"), l = r("ulm_card_person_zone1"), s = r("ulm_card_person_zone2"), u = r("ulm_address"), h = r("ulm_address_locality"), g = r("ulm_card_person_commute_entity"), b = (e.config.icon_type ?? a.icon_type) === "entity-picture" ? String(f(e.entity, "entity_picture") || "") : "", y = V(o?.state), T = n?.state.toLowerCase() === "charging", w = d(e, "ulm_card_battery_battery_level_danger") ?? 15, k = d(e, "ulm_card_battery_battery_level_warning") ?? 30, x = y === void 0 ? "grey" : y <= w ? "red" : y <= k ? "yellow" : "green", C = y === void 0 ? "mdi:battery-off" : T ? "mdi:battery-charging" : y >= 95 ? "mdi:battery" : y < 10 ? "mdi:battery-outline" : `mdi:battery-${Math.floor(y / 10) * 10}`, j = e.entity?.state ?? "unknown", K = [l, s].find((E) => E?.attributes.friendly_name === j), q = i?.state === "on", D = q ? "mdi:car" : j === "home" ? "mdi:home-variant" : K ? String(f(K, "icon") || "mdi:map-marker") : "mdi:home-minus", X = q ? "red" : j === "home" ? "blue" : "yellow", S = u ? v(u) : h && typeof f(h, "Locality") == "string" ? String(f(h, "Locality")) : q ? `Driving - ${j.replaceAll("_", " ")}` : j.replaceAll("_", " "), $ = e.config.icon_type === "none" ? p : c`
    <span class="person-info-avatar ${b ? "has-picture" : ""}" style=${b ? `background-image:url("${b}")` : ""}>
      ${b ? p : c`<ha-icon .icon=${d(e, "ulm_card_person_icon") || "mdi:face-man"}></ha-icon>`}
      <i class="person-info-badge tone-${X}"><ha-icon .icon=${D}></ha-icon></i>
    </span>`;
  if (t) return e.actionSurface("custom-person-info-small is-compact", c`
    <div class="person-info-small-top">
      ${$}
      <span class="person-info-small-battery tone-${x}">
        <ha-icon .icon=${C}></ha-icon>
      </span>
    </div>
    <span class="person-info-small-copy">${z(e, S)}</span>
  `);
  const N = d(e, "ulm_multiline") ?? !0;
  return e.actionSurface(`custom-person-info ${N ? "is-multiline" : "is-inline"}`, c`
    <div class="person-info-main">
      ${$}
      ${z(e, S)}
    </div>
    <div class="person-info-details">
      ${o ? c`<span class="person-info-detail tone-${x}"><ha-icon .icon=${C}></ha-icon><b>${y ?? "—"}%</b></span>` : p}
      ${g ? c`<span class="person-info-detail commute-detail"><ha-icon .icon=${d(e, "ulm_card_person_cummute_icon") || "mdi:car"}></ha-icon><b>${v(g)}${g.attributes.unit_of_measurement ? "" : " min"}</b></span>` : p}
    </div>
  `);
}, lo = (e) => {
  const t = e.entity?.state ?? "unknown", a = f(e.entity, "entity_picture"), r = t !== "unknown" && t !== "standby" && a;
  return e.actionSurface(`custom-console-card platform-playstation state-${t} ${r ? "has-artwork" : ""}`, c`
    ${r ? c`<div class="console-backdrop" style=${`background-image:url("${String(a)}")`}></div>` : p}
    <div class="console-content">
      <span class="console-logo"><ha-icon .icon=${e.config.icon || "mdi:sony-playstation"}></ha-icon></span>
      ${z(
    e,
    r ? String(f(e.entity, "friendly_name") || v(e.entity)) : v(e.entity),
    r ? String(f(e.entity, "media_title") || H(e.config, e.entity, e.hass)) : H(e.config, e.entity, e.hass)
  )}
    </div>
  `);
}, co = (e) => {
  const t = e.config.icon_type === "entity-picture", a = d(e, "ulm_custom_card_person_tracker_use_badge") !== !1, r = t ? String(f(e.entity, "entity_picture") || "") : "", o = P(e, "ulm_custom_card_person_tracker_driving_entity"), n = o?.state === "on" || o?.state === "true", l = (d(e, "ulm_custom_card_person_tracker_zones") ?? []).map((k) => e.hass.states[k]).find((k) => k?.attributes.friendly_name === e.entity?.state), s = n ? "mdi:car" : e.entity?.state === "home" ? "mdi:home-variant" : e.entity?.state === "not_home" ? "mdi:home-minus" : String(f(l, "icon") || "mdi:help-circle"), u = n ? "red" : e.entity?.state === "home" ? "green" : l ? "yellow" : "blue", h = n ? d(e, "ulm_custom_card_person_tracker_driving") || "Driving" : v(e.entity), g = d(e, "ulm_custom_card_person_tracker_find_device_script"), _ = P(e, "ulm_custom_card_person_tracker_camera_entity_light"), b = P(e, "ulm_custom_card_person_tracker_camera_entity_dark"), y = _ && b ? _ : void 0, T = y ? String(f(y, "entity_picture") || `/api/camera_proxy/${y.entity_id}`) : "", w = d(e, "ulm_custom_card_person_tracker_map_enable") === !0;
  return e.actionSurface("custom-person-tracker", c`
    <div class="person-tracker-main">
      ${e.config.icon_type === "none" ? p : c`<span class="person-tracker-avatar ${r ? "has-picture" : ""}" style=${r ? `background-image:url("${r}")` : ""}>
        ${r ? p : c`<ha-icon .icon=${a ? "mdi:face-man" : s}></ha-icon>`}
        ${a ? c`<i class=${`tone-${u}`}><ha-icon .icon=${s}></ha-icon></i>` : p}
      </span>`}
      ${z(e, h)}
      ${g ? c`<button class="person-tracker-find-device" aria-label="Find device"
        @pointerdown=${(k) => k.stopPropagation()}
        @click=${(k) => {
    k.stopPropagation(), e.service("homeassistant", "toggle", { entity_id: g });
  }}>
        <ha-icon .icon=${d(e, "ulm_custom_card_person_tracker_icon") || "mdi:cellphone-sound"}></ha-icon>
      </button>` : p}
    </div>
    ${T ? c`<div class="person-tracker-camera" style=${`background-image:url("${T}")`}></div>` : p}
    ${w ? c`<div class="person-tracker-map" style=${`aspect-ratio:${String(d(e, "ulm_custom_card_person_tracker_map_aspect_ratio") || "466 / 200").replace(":", " / ")}`}>
      <ha-icon icon="mdi:map-marker-path"></ha-icon><span>${h}</span>
    </div>` : p}
  `);
}, _o = (e) => {
  const t = P(e, "ulm_card_vehicle_status_tracker") ?? e.entity, a = P(e, "ulm_card_vehicle_status_energy_level"), r = P(e, "ulm_card_vehicle_status_range"), o = P(e, "ulm_card_vehicle_status_lock"), n = t?.state === "home", i = o?.state === "locked" || o?.state === "off", l = (h) => {
    const g = V(h?.state);
    return g === void 0 ? v(h) : String(Math.round(g));
  }, s = (h, g) => [h?.attributes.unit_of_measurement, g].filter(Boolean).join(" "), u = t?.last_changed ? (() => {
    const h = Math.max(0, Math.round((Date.now() - new Date(t.last_changed).getTime()) / 6e4));
    return h < 1 ? "just now" : `${h} minute${h === 1 ? "" : "s"} ago`;
  })() : v(t);
  return e.actionSurface("custom-vehicle-status", c`
    <button class="car-hero" aria-label="Open car details"
      @pointerdown=${(h) => h.stopPropagation()}
      @click=${(h) => W(h, e, { action: "more-info" }, t?.entity_id)}>
      <span class="car-icon-wrap">${F(e, "mdi:car", "blue")}
        <i class="car-badge tracker ${n ? "is-home" : "is-away"}"><ha-icon .icon=${n ? "mdi:home-variant" : "mdi:road-variant"}></ha-icon></i>
        <i class="car-badge lock ${i ? "is-locked" : "is-unlocked"}"><ha-icon .icon=${i ? "mdi:lock" : "mdi:lock-open"}></ha-icon></i>
      </span>
      ${z(e, u)}
    </button>
    <div class="car-metrics">
      <span><ha-icon icon="mdi:gas-station"></ha-icon><b>${l(a)}</b><small>${s(a, d(e, "ulm_custom_card_vehicle_status_energy_level") || "Nível de energia")}</small></span>
      <span><ha-icon icon="mdi:map-marker-distance"></ha-icon><b>${l(r)}</b><small>${s(r, d(e, "ulm_custom_card_vehicle_status_range") || "Alcance")}</small></span>
    </div>
  `);
}, uo = (e) => {
  const t = P(e, "ulm_card_flower_entity") ?? e.entity, a = t?.state === "problem", r = d(e, "ulm_card_flower_show_bars"), o = ["temperature", "humidity", "moisture", "conductivity", "illuminance", "dli"], n = (Array.isArray(r) ? r.filter((s) => typeof s == "string") : o).filter((s) => o.includes(s)).filter((s) => f(t, s) !== void 0 || s === "moisture" && t?.entity_id.startsWith("sensor.")), i = {
    temperature: "mdi:thermometer",
    humidity: "mdi:water-percent",
    moisture: "mdi:water",
    conductivity: "mdi:flash",
    illuminance: "mdi:white-balance-sunny",
    dli: "mdi:leaf"
  }, l = (s) => V(f(t, s)) ?? (s === "moisture" ? V(t?.state) : void 0);
  return e.actionSurface("custom-plant", c`
    <button class="flower-heading" aria-label="Open plant details"
      @pointerdown=${(s) => s.stopPropagation()}
      @click=${(s) => W(s, e, { action: "more-info" }, t?.entity_id)}>
      ${F(e, a ? "mdi:alert-circle" : "mdi:flower", a ? "red" : "green")}
      ${z(e, a ? d(e, "ulm_custom_card_plant_problem") || "Problema" : d(e, "ulm_custom_card_plant_correct") || "Correto")}
    </button>
    ${n.length ? c`<div class="flower-bars">${n.map((s) => {
    const u = l(s);
    return c`<span>
        <ha-icon .icon=${i[s]}></ha-icon>
        <i><em style=${`width:${Math.max(0, Math.min(100, u ?? 0))}%`}></em></i>
      </span>`;
  })}</div>` : p}
  `);
}, mo = (e) => {
  const t = d(e, "ulm_custom_card_speedtest_round") === !0, a = (r, o, n, i, l, s, u, h, g) => {
    const _ = P(e, r) ?? P(e, o), b = V(_?.state), y = Math.max(1, d(e, u) ?? h), T = Math.max(0, Math.min(100, (b ?? 0) / y * 100)), w = b === void 0 ? "—" : g && t ? String(Math.round(b)) : _.state, k = _?.attributes.unit_of_measurement, x = G(d(e, l), s);
    return c`
      <div class="speedtest-metric" style=${`--speedtest-color:${x};--speedtest-value:${T}`}>
        <svg class="speedtest-ring" viewBox="0 0 120 100" aria-hidden="true">
          <path class="speedtest-track" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
          <path class="speedtest-value" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
        </svg>
        <span class="speedtest-value-copy"><ha-icon .icon=${i}></ha-icon><b>${w}${k ? ` ${String(k)}` : ""}</b><small>${n}</small></span>
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
}, po = (e) => {
  const t = {
    en: { none: "None", very_low: "Very low", low: "Low", medium: "Medium", high: "High", very_high: "Very high", tree: "Trees", grass: "Grass", weed: "Weeds" },
    de: { none: "Keine", very_low: "Sehr niedrig", low: "Niedrig", medium: "Mittel", high: "Hoch", very_high: "Sehr hoch", tree: "Bäume", grass: "Gräser", weed: "Kräuter" },
    es: { none: "Ninguno", very_low: "Muy bajo", low: "Bajo", medium: "Medio", high: "Alto", very_high: "Muy alto", tree: "Árboles", grass: "Hierbas", weed: "Malezas" },
    nl: { none: "Geen", very_low: "Zeer laag", low: "Laag", medium: "Gemiddeld", high: "Hoog", very_high: "Extreem hoog", tree: "Bomen", grass: "Grassen", weed: "Kruiden" },
    pl: { none: "Brak", very_low: "Bardzo słabe", low: "Słabe", medium: "Średnie", high: "Wysokie", very_high: "Bardzo wysokie", tree: "Drzewa", grass: "Trawy", weed: "Zioła" }
  }, a = t[(e.hass.language ?? "en").split("-")[0]] ?? t.en, r = [
    {
      entity: A(e, "trees_entity"),
      name: d(e, "custom_card_pollen_tree_name"),
      icon: d(e, "custom_card_pollen_tree_icon"),
      kind: "tree",
      fallbackIcon: "mdi:tree"
    },
    {
      entity: A(e, "grass_entity"),
      name: d(e, "custom_card_pollen_grass_name"),
      icon: d(e, "custom_card_pollen_grass_icon"),
      kind: "grass",
      fallbackIcon: "mdi:grass"
    },
    {
      entity: A(e, "weeds_entity"),
      name: d(e, "custom_card_pollen_weed_name"),
      icon: d(e, "custom_card_pollen_weed_icon"),
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
    <div class="pollen-heading">${z(e, v(e.entity), e.descriptor.name)}</div>
    ${r.map((n) => {
    const i = o(n.entity?.state), l = n.name || n.entity?.attributes.friendly_name || a[n.kind], s = n.icon || n.entity?.attributes.icon || n.fallbackIcon;
    return c`<button class="pollen-item" style=${`--pollen:${i.color}`}
        ?disabled=${!n.entity}
        @pointerdown=${(u) => u.stopPropagation()}
        @click=${(u) => n.entity && W(u, e, { action: "more-info" }, n.entity.entity_id)}>
        <span class="pollen-item-icon"><ha-icon .icon=${s}></ha-icon>
          ${i.extreme ? c`<span class="pollen-extreme"><ha-icon .icon=${"mdi:exclamation-thick"}></ha-icon></span>` : p}
        </span>
        <b>${l}</b><small>${n.entity ? i.label : "Entity unavailable"}</small>
      </button>`;
  })}
  `);
}, ho = (e) => {
  const t = ee.has(e.entity?.state ?? ""), a = "rgb(var(--rgb-blue, 33, 150, 243))";
  return e.actionSurface("ulm-row", c`
    ${ge(e, Te(e, "mdi:information-outline"), a, t)}
    ${Gt(e)}
  `, `--source-color:${a}`);
}, go = (e) => {
  const t = V(f(e.entity, "current_temperature")), a = V(f(e.entity, "temperature")), r = V(f(e.entity, "min_temp")) ?? 5, o = V(f(e.entity, "max_temp")) ?? 35, n = e.config.thermostat_temp_step ?? V(f(e.entity, "target_temp_step")) ?? 0.5, i = String(
    f(e.entity, "temperature_unit") ?? f(e.entity, "unit_of_measurement") ?? "°C"
  ), l = A(e, "humidity_entity"), s = V(l?.state) ?? V(f(e.entity, "current_humidity")) ?? V(f(e.entity, "humidity")), h = A(e, "window_sensor")?.state.toLowerCase(), g = ["on", "open", "true"].includes(h ?? "") || f(e.entity, "window_open") === !0 || ["on", "open", "true"].includes(String(f(e.entity, "window_state") ?? "").toLowerCase()), _ = A(e, "battery_entity"), b = V(_?.state) ?? V(f(e.entity, "battery")) ?? V(f(e.entity, "battery_level")), y = b !== void 0 && b <= (e.config.low_battery_threshold ?? 20), T = (I) => !!(I && (!e.hass?.states[I] || ["unavailable", "unknown"].includes(e.hass.states[I].state.toLowerCase()))), w = !e.entity || ["unavailable", "unknown"].includes(e.entity.state.toLowerCase()) || T(e.config.window_sensor) || T(e.config.humidity_entity) || T(e.config.battery_entity), k = f(e.entity, "degraded_mode") === !0 || f(e.entity, "is_degraded") === !0, x = String(f(e.entity, "hvac_action") ?? "").toLowerCase(), C = Array.isArray(f(e.entity, "hvac_modes")) ? f(e.entity, "hvac_modes").map(String) : [], j = String(f(e.entity, "preset_mode") ?? ""), K = Array.isArray(f(e.entity, "preset_modes")) ? f(e.entity, "preset_modes").map(String) : [], q = e.config.variant === "compact", D = e.config.show_controls !== !1, X = e.config.collapsible_controls === !0 && e.entity?.state === "off", S = {
    off: "mdi:power",
    auto: "mdi:autorenew",
    heat: "mdi:fire",
    cool: "mdi:snowflake",
    heat_cool: "mdi:sun-snowflake-variant",
    dry: "mdi:water-percent",
    fan_only: "mdi:fan"
  }, $ = x === "heating" || e.entity?.state === "heat" ? "orange" : x === "cooling" || e.entity?.state === "cool" ? "blue" : e.entity?.state === "off" ? "grey" : "green", N = [
    w ? ["Connection lost", "mdi:lan-disconnect", "red"] : void 0,
    k ? ["Degraded", "mdi:alert-circle-outline", "orange"] : void 0,
    g ? ["Window open", "mdi:window-open-variant", "blue"] : void 0,
    y ? [`Battery ${Math.round(b)}%`, "mdi:battery-alert-variant-outline", "red"] : void 0,
    x === "heating" ? ["Heating", "mdi:radiator", "orange"] : void 0,
    x === "cooling" ? ["Cooling", "mdi:snowflake", "blue"] : void 0,
    j === "eco" ? ["Eco", "mdi:leaf", "green"] : void 0
  ].filter((I) => !!I), E = (I, R) => {
    if (I.stopPropagation(), !e.config.entity || w) return;
    const Ne = Math.max(r, Math.min(o, R)), Yt = String(n).split(".")[1]?.length ?? 0, Qt = Number((Math.round(Ne / n) * n).toFixed(Yt));
    e.service("climate", "set_temperature", {
      entity_id: e.config.entity,
      temperature: Qt
    });
  }, B = (I) => I === "fan_only" ? "Fan" : I === "heat_cool" ? "Heat/Cool" : I.replaceAll("_", " ").replace(/\b\w/g, (R) => R.toUpperCase());
  return e.actionSurface(`better-thermostat ${q ? "is-compact" : ""} tone-${$}`, c`
    <div class="better-thermostat-header">
      ${F(e, x === "heating" ? "mdi:radiator" : "mdi:thermostat", $)}
      ${z(e, t === void 0 ? v(e.entity) : `${t}${i} current`)}
      <span class="better-thermostat-temperature">
        <b>${a === void 0 ? "—" : a}${a === void 0 ? "" : i}</b>
        ${e.config.show_humidity !== !1 && s !== void 0 ? c`<small><ha-icon icon="mdi:water-percent" aria-hidden="true"></ha-icon>${Math.round(s)}%</small>` : p}
      </span>
    </div>
    ${e.config.show_status !== !1 && N.length ? c`<div class="better-thermostat-statuses">
        ${N.map(([I, R, Ne]) => c`
          <span class="better-thermostat-status tone-${Ne}">
            <ha-icon .icon=${R} aria-hidden="true"></ha-icon>${I}
          </span>`)}
      </div>` : p}
    ${D && e.config.show_temperature_control !== !1 ? c`
      <div class="better-thermostat-target">
        ${L("Decrease target temperature", "mdi:minus", (I) => E(I, (a ?? r) - n), w)}
        ${q ? c`<span>${a === void 0 ? "—" : a}${a === void 0 ? "" : i}</span>` : c`
          <label>
            <span>Target temperature</span>
            <input type="range" name="target_temperature" min=${String(r)} max=${String(o)} step=${String(n)}
              .value=${String(a ?? r)}
              ?disabled=${w}
              aria-label="Target temperature"
              @pointerdown=${(I) => I.stopPropagation()}
              @click=${(I) => I.stopPropagation()}
              @change=${(I) => E(I, Number(I.target.value))}>
          </label>`}
        ${L("Increase target temperature", "mdi:plus", (I) => E(I, (a ?? r) + n), w)}
      </div>` : p}
    ${D && e.config.show_hvac_modes !== !1 && C.length ? c`
      <div class="better-thermostat-options" aria-label="HVAC modes">
        ${C.map((I) => c`
          <button type="button" class=${e.entity?.state === I ? "is-selected" : ""} ?disabled=${w}
            @pointerdown=${(R) => R.stopPropagation()}
            @click=${(R) => {
    R.stopPropagation(), e.config.entity && !w && e.service("climate", "set_hvac_mode", { entity_id: e.config.entity, hvac_mode: I });
  }}>
            <ha-icon .icon=${S[I] ?? "mdi:thermostat"} aria-hidden="true"></ha-icon>
            <span>${B(I)}</span>
          </button>`)}
      </div>` : p}
    ${D && !X && e.config.show_presets !== !1 && K.length ? c`
      <div class="better-thermostat-options presets" aria-label="Presets">
        ${K.map((I) => c`
          <button type="button" class=${j === I ? "is-selected" : ""} ?disabled=${w}
            @pointerdown=${(R) => R.stopPropagation()}
            @click=${(R) => {
    R.stopPropagation(), e.config.entity && !w && e.service("climate", "set_preset_mode", { entity_id: e.config.entity, preset_mode: I });
  }}>
            <ha-icon .icon=${I === "eco" ? "mdi:leaf" : I === "away" ? "mdi:home-export-outline" : I === "boost" ? "mdi:rocket-launch" : "mdi:home-thermometer"} aria-hidden="true"></ha-icon>
            <span>${I === "none" ? "Normal" : B(I)}</span>
          </button>`)}
      </div>` : p}
  `);
}, bo = (e) => {
  const t = G(
    d(e, "ulm_card_graph_color"),
    "rgb(var(--rgb-red, 244, 67, 54))"
  ), a = G(
    d(e, "ulm_card_graph_icon_color"),
    t
  );
  return e.actionSurface("ulm-default-graph", c`
    <div class="metric-heading">${ge(e, Te(e, "mdi:chart-line"), a, !0)}${Gt(e)}</div>
    ${Zt(e, !0, e.entity, t)}
  `);
}, yo = (e) => {
  switch (e.descriptor.upstreamId) {
    case "card_battery":
      return $r(e);
    case "card_graph":
      return bo(e);
    case "card_media_player":
      return xt(e);
    case "custom_card_trash":
      return jr(e);
    case "custom_card_alarm_time":
      return Fr(e);
    case "custom_card_chromecast":
      return Br(e);
    case "custom_card_roomview":
      return Rr(e);
    case "custom_card_room_overview":
      return Wr(e);
    case "custom_card_welcome":
      return Hr(e);
    case "custom_card_washer":
      return qr(e);
    case "custom_card_sun":
      return Gr(e);
    case "custom_card_input_datetime":
      return Kr(e);
    case "custom_card_entity_overview":
      return Zr(e);
    case "custom_card_internet_speed":
      return Jr(e);
    case "custom_card_weather_metrics":
      return Yr(e);
    case "custom_card_media_player_sonos":
      return Qr(e);
    case "custom_card_more_power_outlet":
      return Xr(e);
    case "custom_card_gauge":
      return eo(e);
    case "custom_card_printer":
      return to(e);
    case "custom_card_nas_metrics":
      return ao(e);
    case "custom_card_tablet":
      return ro(e);
    case "custom_card_pollen_forecast":
      return no(e);
    case "custom_card_welcome_dashboard":
      return so(e);
    case "custom_card_person_info":
    case "custom_card_person_info_small":
      return io(e);
    case "custom_card_playstation":
      return lo(e);
    case "custom_card_person_tracker":
      return co(e);
    case "custom_card_vehicle_status":
      return _o(e);
    case "custom_card_plant":
      return uo(e);
    case "custom_card_speedtest_gauges":
      return mo(e);
    case "custom_card_pollen":
      return po(e);
    case "custom_card_better_thermostat":
      return go(e);
    case "card_room":
      return Dr(e);
  }
  if (/trash/.test(e.descriptor.upstreamId)) return Lr(e);
  if (/printer/.test(e.descriptor.upstreamId)) return Tr(e);
  if (/gauge/.test(e.descriptor.upstreamId)) return Nr(e);
  if (/vehicle_status|plant|entity_overview/.test(e.descriptor.upstreamId))
    return Or(e, /vehicle_status/.test(e.descriptor.upstreamId) ? "mdi:car" : /plant/.test(e.descriptor.upstreamId) ? "mdi:flower" : "mdi:view-grid", "purple");
  switch (e.descriptor.family) {
    case "scene":
      return Vr(e);
    case "presence":
      return vr(e);
    case "battery":
      return wr(e);
    case "bar":
      return kr(e);
    case "energy":
    case "sensor":
      return xr(e);
    case "media":
      return xt(e);
    case "cover":
      return Ir(e);
    case "security":
      return zr(e);
    case "navigation":
      return Ar(e);
    case "control":
      return Cr(e);
    case "alarm-time":
      return Ur(e);
    case "camera":
      return Mr(e);
    default:
      return ho(e);
  }
};
var fo = Object.defineProperty, Xe = (e, t, a, r) => {
  for (var o = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (o = i(t, a, o) || o);
  return o && fo(t, a, o), o;
};
const et = class et extends _e {
  constructor() {
    super(...arguments), this.holdFired = !1, this.forecastGeneration = 0, this.forecast = [], this.sceneOverflowExpanded = !1, this.actionSurface = (t, a, r = "") => {
      const o = this.descriptor ? Je.get(this.descriptor.upstreamId) : void 0;
      if (!o)
        throw new Error(`Missing explicit parity renderer mapping for ${this.descriptor?.upstreamId}`);
      const n = o ? ` parity-${o.rendererId.replaceAll("_", "-")}` : "", i = this.config?.layout && this.config.layout !== "default" ? ` layout-${this.config.layout}` : "", l = this.config?.fill_container ? " fill-container" : "", s = this.config?.variant ? ` variant-${this.config.variant}` : "", u = c`
      <div class="${t}${n}${i}${l}${s} action-surface" style=${r} role="button" tabindex="0"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        ${a}
      </div>`;
      return c`<ha-card class="mushroom-addition-card">${u}</ha-card>`;
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
    const a = Ca(t), r = this.forecastKey(this.config);
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
    if (!this.config || !this.descriptor) return p;
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
        a.rendered ? n : c`${yr(r)}${n}`,
        i
      ),
      service: (o, n, i) => {
        this.hass?.callService(o, n, i);
      }
    };
    return yo(r);
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
    Pa(this, o ? { ...this.config, entity: o } : this.config, a);
  }
};
et.styles = _r;
let ie = et;
Xe([
  Me({ attribute: !1 })
], ie.prototype, "hass");
Xe([
  Me({ attribute: !1 })
], ie.prototype, "config");
Xe([
  Mt()
], ie.prototype, "sceneOverflowExpanded");
const vo = (e, t, a = [], r = []) => {
  const o = [...a, ...r, ...Object.keys(t?.states ?? {})], n = [...new Set(o)].filter((l) => t?.states?.[l] !== void 0), i = n.filter((l) => !["unavailable", "unknown"].includes(t?.states?.[l]?.state.toLowerCase() ?? ""));
  for (const l of e.preferredDomains ?? []) {
    const s = i.find((u) => u.startsWith(`${l}.`)) ?? n.find((u) => u.startsWith(`${l}.`));
    if (s) return s;
  }
  return i[0] ?? n[0];
}, wo = (e) => e.name.replace(/ (Card|Chip)$/, ""), Jt = (e, t, a = [], r = []) => {
  const o = [.../* @__PURE__ */ new Set([...a, ...r, ...Object.keys(t?.states ?? {})])].filter((S) => t?.states?.[S] !== void 0), n = (S) => {
    const $ = t?.states[S];
    return [
      S,
      $?.attributes.friendly_name,
      $?.attributes.device_class,
      $?.attributes.unit_of_measurement
    ].filter(Boolean).join(" ").toLowerCase();
  }, i = (S) => [
    ...S.filter(($) => !["unavailable", "unknown"].includes(t?.states[$]?.state.toLowerCase() ?? "")),
    ...S.filter(($) => ["unavailable", "unknown"].includes(t?.states[$]?.state.toLowerCase() ?? ""))
  ], l = (S) => !["unavailable", "unknown"].includes(t?.states[S]?.state.toLowerCase() ?? ""), s = (S, $) => i(o.filter((N) => S.some((E) => N.startsWith(`${E}.`)) && $.every((E) => n(N).includes(E))))[0], u = (S, $, N) => i(o.filter((E) => S.some((B) => E.startsWith(`${B}.`)) && $.every((B) => n(E).includes(B)) && N.every((B) => !n(E).includes(B))))[0], h = (S, $, N = []) => o.find((E) => l(E) && S.some((B) => E.startsWith(`${B}.`)) && $.every((B) => n(E).split(/[^a-z0-9]+/).includes(B)) && N.every((B) => !n(E).includes(B))), g = (S, $ = [], N = []) => i(o.filter((E) => {
    const B = t?.states[E], I = n(E);
    return E.startsWith("sensor.") && S.includes(String(B?.attributes.device_class ?? "")) && $.every((R) => I.includes(R)) && N.every((R) => !I.includes(R));
  }))[0], _ = (S, $ = [], N = []) => o.find((E) => {
    const B = t?.states[E], I = n(E);
    return l(E) && E.startsWith("sensor.") && S.includes(String(B?.attributes.device_class ?? "")) && $.every((R) => I.includes(R)) && N.every((R) => !I.includes(R));
  }), b = e.upstreamId === "card_graph" ? s(["sensor"], ["cv", "plug", "power"]) ?? g(["power", "energy"]) : e.upstreamId === "card_media_player" ? s(["media_player"], ["office", "joris", "tv"]) : e.upstreamId === "card_battery" ? u(["sensor"], ["battery", "level"], ["state", "charging"]) ?? g(["battery"], [], ["state", "charging"]) : e.upstreamId === "card_cover" ? s(["cover"], ["sunscreen"]) : e.upstreamId === "custom_card_pollen_forecast" ? s(["sensor"], ["pollen", "grass", "level"]) ?? s(["sensor"], ["pollen", "grass"]) ?? s(["sensor"], ["pollen"]) : e.upstreamId === "custom_card_pollen" ? s(["sensor"], ["pollen", "grass"]) : e.upstreamId === "custom_card_speedtest_gauges" ? s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) : e.upstreamId === "custom_card_tablet" ? s(["binary_sensor", "sensor", "switch"], ["tablet"]) : e.upstreamId === "custom_card_nas_metrics" ? s(["switch", "binary_sensor"], ["nas"]) ?? s(["switch", "binary_sensor"], ["status"]) : e.upstreamId === "custom_card_washer" ? s(["sensor"], ["operation", "state"]) ?? s(["sensor"], ["washer", "state"]) : e.upstreamId === "custom_card_sun" ? s(["sun"], []) : e.upstreamId === "custom_card_media_player_sonos" ? s(["media_player"], ["sonos"]) : e.upstreamId === "custom_card_more_power_outlet" ? s(["switch", "light"], ["outlet"]) ?? s(["switch", "light"], ["plug"]) : e.upstreamId === "custom_card_printer" ? s(["sensor", "binary_sensor"], ["printer"]) ?? s(["sensor", "binary_sensor"], ["online"]) : e.upstreamId === "custom_card_internet_speed" ? s(["sensor"], ["download"]) : e.upstreamId === "custom_card_weather_metrics" ? s(["weather"], []) : e.upstreamId === "card_room" ? s(["light"], []) : e.upstreamId === "custom_card_vehicle_status" ? s(["sensor"], ["model"]) ?? s(["device_tracker"], []) : e.upstreamId === "custom_card_plant" ? s(["plant"], []) ?? s(["sensor"], ["soil", "humidity"]) : e.upstreamId === "custom_card_welcome_dashboard" || e.upstreamId === "custom_card_person_tracker" ? s(["person"], []) : e.upstreamId === "custom_card_playstation" ? s(["media_player"], ["tv"]) ?? s(["media_player"], []) : e.upstreamId === "custom_card_better_thermostat" ? s(["climate"], ["living", "room"]) ?? s(["climate"], []) : void 0, y = e.upstreamId === "card_scenes" ? void 0 : b ?? vo(e, t, a, r), T = ["text", "navigation"].includes(e.family), w = e.variants?.[0], k = y?.split(".", 1)[0], x = ["light", "switch", "input_boolean", "fan"].includes(k ?? "") ? { action: "toggle" } : { action: y ? "more-info" : "none" }, C = (S, $) => [...new Set(S.filter((N) => !!N))].slice(0, $), j = s(["sensor"], ["outdoor", "temperature"]) ?? s(["sensor"], ["outside", "temperature"]) ?? s(["sensor"], ["garden", "temperature"]) ?? g(["temperature"], [], ["battery", "cpu", "soil"]), K = s(["sensor"], ["date", "time"]) ?? s(["sensor"], ["time", "date"]) ?? s(["sensor"], ["date"]), D = [
    [_(["humidity"]), "Humidity"],
    [
      _(["wind_speed"]) ?? h(["sensor"], ["wind", "speed"]) ?? h(["sensor"], ["wind"]),
      "Wind"
    ],
    [
      _(["atmospheric_pressure"]) ?? h(["sensor"], ["barometric", "pressure"]) ?? h(["sensor"], ["pressure"], ["blood"]),
      "Pressure"
    ],
    [
      _(["precipitation", "precipitation_intensity"]) ?? h(["sensor"], ["precipitation"]) ?? h(["sensor"], ["rain"]),
      "Precipitation"
    ],
    [h(["sensor"], ["visibility"]), "Visibility"],
    [h(["sensor"], ["cloud", "coverage"]), "Cloud cover"],
    [h(["sensor"], ["uv", "index"]), "UV index"],
    [_(["illuminance"]), "Light level"],
    [h(["sensor"], ["dew", "point"]), "Dew point"]
  ].filter(
    ([S], $, N) => !!S && N.findIndex(([E]) => E === S) === $
  ).slice(0, 4), X = C([
    g(["temperature"]),
    g(["humidity"]),
    g(["power", "energy"]),
    g(["battery"]),
    ...o.filter((S) => S.startsWith("sensor."))
  ], 4);
  return {
    ...Wt(e, t, y),
    name: y ? t?.states[y]?.attributes.friendly_name : wo(e),
    secondary: y ? void 0 : T ? "Example" : "Preview",
    variant: w,
    tap_action: x,
    show_controls: ["climate", "cover", "vacuum", "control"].includes(e.family) || e.family === "media" && e.upstreamId !== "card_media_player" ? !0 : void 0,
    show_forecast: e.family === "weather",
    show_graph: ["battery", "energy", "sensor"].includes(e.family),
    ulm_card_cover_enable_controls: e.upstreamId === "card_cover" ? !0 : void 0,
    ulm_card_cover_enable_slider: e.upstreamId === "card_cover" ? !0 : void 0,
    ulm_custom_card_bar_card_value: e.family === "bar" ? !0 : void 0,
    entities: e.variants?.includes("with-sensors") ? r.slice(0, 2) : void 0,
    ...e.upstreamId === "custom_card_washer" ? {
      power_entity: s(["sensor", "switch"], ["wasmachine", "power"]) ?? s(["sensor", "switch"], ["washer", "power"]) ?? s(["sensor", "switch"], ["power"]),
      door_entity: s(["sensor", "binary_sensor"], ["washer", "door"]) ?? s(["sensor", "binary_sensor"], ["door"]),
      finished_entity: s(["sensor", "binary_sensor"], ["washer", "finished"]) ?? s(["sensor", "binary_sensor"], ["finished"]),
      ulm_custom_card_washer_machine_state: y,
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
      timeFormat: "24h",
      tap_action: { action: "none" }
    } : {},
    ...e.upstreamId === "custom_card_pollen_forecast" ? {
      entity: s(["sensor"], ["pollen", "grass", "level"]) ?? y,
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
      download_entity: s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) ?? y,
      upload_entity: s(["sensor"], ["speedtest", "upload"]) ?? s(["sensor"], ["upload"]),
      ping_entity: s(["sensor"], ["speedtest", "ping"]) ?? s(["sensor"], ["ping"]),
      tap_action: {
        action: "perform-action",
        perform_action: "homeassistant.update_entity",
        target: {
          entity_id: [
            s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) ?? y,
            s(["sensor"], ["speedtest", "upload"]) ?? s(["sensor"], ["upload"]),
            s(["sensor"], ["speedtest", "ping"]) ?? s(["sensor"], ["ping"])
          ].filter((S) => !!S)
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
      grass_entity: s(["sensor"], ["pollen", "grass"]) ?? s(["sensor"], ["grass", "pollen"]) ?? y,
      weeds_entity: s(["sensor"], ["pollen", "weeds"]) ?? s(["sensor"], ["weed", "pollen"]),
      tap_action: { action: "none" }
    } : {},
    ...e.upstreamId === "custom_card_person_info" ? Ce(t, y) : {},
    ...e.upstreamId === "custom_card_vehicle_status" ? {
      entity: y,
      ulm_card_vehicle_status_tracker: y,
      ulm_card_vehicle_status_lock: s(["lock"], ["car"]) ?? s(["binary_sensor"], ["doors"]),
      ulm_card_vehicle_status_energy_level: s(["sensor"], ["primary", "engine", "percent"]) ?? s(["sensor"], ["battery"]),
      ulm_card_vehicle_status_range: s(["sensor"], ["range"]),
      ulm_card_vehicle_status_name: y ? t?.states[y]?.attributes.friendly_name : void 0,
      tap_action: { action: "more-info" }
    } : {},
    ...e.upstreamId === "custom_card_plant" ? {
      entity: y,
      ulm_card_flower_entity: y,
      ulm_card_flower_name: y ? t?.states[y]?.attributes.friendly_name : "No name set",
      ulm_card_flower_show_bars: ["temperature", "humidity", "moisture"],
      tap_action: { action: "more-info" }
    } : {},
    ...e.upstreamId === "card_room" ? {
      room_sensors: [
        s(["sensor"], ["illuminance"]),
        s(["sensor"], ["temperature"])
      ].filter((S) => !!S).map((S) => ({ entity: S }))
    } : {},
    ...e.upstreamId === "card_scenes" ? {
      scene_items: o.filter((S) => S.startsWith("scene.")).slice(0, 7).map((S) => de(t, S))
    } : {},
    ...e.upstreamId === "card_welcome_scenes" ? {
      name: void 0,
      secondary: "Scenes",
      collapse_entity: s(["input_boolean"], ["collapse"]) ?? s(["input_boolean"], ["dropdown"]) ?? s(["input_boolean"], []),
      scene_items: o.filter((S) => S.startsWith("scene.")).slice(0, 5).map((S) => de(t, S)),
      tap_action: { action: "none" }
    } : {},
    ...e.upstreamId === "custom_card_internet_speed" ? {
      download_entity: s(["sensor"], ["download"]) ?? y,
      upload_entity: s(["sensor"], ["upload"]),
      ping_entity: s(["sensor"], ["ping"])
    } : {},
    ...e.upstreamId === "custom_card_entity_overview" ? {
      entities: X,
      ...Object.fromEntries(X.flatMap((S, $) => [
        [`ulm_custom_card_entity_overview_entity_${$ + 1}`, S],
        [
          `ulm_custom_card_entity_overview_name_${$ + 1}`,
          t?.states[S]?.attributes.friendly_name ?? `Entity ${$ + 1}`
        ]
      ]))
    } : {},
    ...e.upstreamId === "custom_card_weather_metrics" ? {
      entity: s(["weather"], []) ?? y,
      temperature_entity: j,
      date_entity: K,
      entities: D.map(([S]) => S),
      ulm_custom_card_weather_metrics: s(["weather"], []) ?? y,
      ulm_custom_card_weather_metrics_temperature_outside: j,
      ulm_custom_card_weather_metrics_date: K,
      ...Object.fromEntries(D.flatMap(([S, $], N) => [
        [`ulm_custom_card_weather_metrics_entity_${N + 1}`, S],
        [`ulm_custom_card_weather_metrics_name_${N + 1}`, $]
      ]))
    } : {},
    ...e.upstreamId === "custom_card_media_player_sonos" ? {
      ulm_card_media_player_with_controls_name: y ? t?.states[y]?.attributes.friendly_name : "No name set"
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
    ...e.upstreamId === "custom_card_welcome_dashboard" ? {
      variant: s(["weather"], []) ? "weather" : "message",
      time_entity: s(["sensor"], ["time"]),
      weather_entity: s(["weather"], [])
    } : {},
    ...e.upstreamId === "custom_card_playstation" ? {
      show_controls: !1,
      tap_action: { action: y ? "more-info" : "none", entity: y }
    } : {},
    ...e.upstreamId === "custom_card_person_tracker" ? {
      ulm_custom_card_person_tracker_driving_entity: s(["binary_sensor"], ["driving"]),
      ulm_custom_card_person_tracker_find_device_script: s(["script"], ["find"]),
      ulm_custom_card_person_tracker_zones: o.filter((S) => S.startsWith("zone.")),
      tap_action: { action: y ? "more-info" : "none", entity: y }
    } : {}
  };
}, $o = "1.4.0";
for (const e of Le)
  if (!customElements.get(e.tag)) {
    const t = e;
    class a extends ie {
      constructor() {
        super(...arguments), this.descriptor = t;
      }
      static getStubConfig(o, n = [], i = []) {
        return Jt(t, o, n, i);
      }
    }
    customElements.define(e.tag, a);
  }
for (const e of Ze) {
  if (customElements.get(e.tag)) continue;
  const t = Oe.find((n) => n.upstreamId === e.targetId);
  if (!t) throw new Error(`Missing alias target ${e.targetId}.`);
  const a = t, r = e.variant;
  class o extends ie {
    constructor() {
      super(...arguments), this.descriptor = a;
    }
    static getStubConfig(i, l = [], s = []) {
      const u = Jt(a, i, l, s);
      return r === "divider-title" ? {
        ...u,
        type: `custom:${e.tag}`,
        entity: void 0,
        variant: r,
        name: "Title",
        navigation_path: "",
        tap_action: { action: "none" }
      } : r === "divider-subtitle" ? {
        ...u,
        type: `custom:${e.tag}`,
        entity: void 0,
        variant: r,
        name: "Subtitle",
        tap_action: { action: "none" }
      } : {
        ...u,
        type: `custom:${e.tag}`,
        variant: r,
        show_forecast: e.tag === "mushroom-addition-card-weather-ulm" ? !1 : u.show_forecast
      };
    }
    setConfig(i) {
      super.setConfig({ ...i, variant: i.variant ?? r });
    }
  }
  customElements.define(e.tag, o);
}
window.customCards = window.customCards || [];
const ko = new Set(window.customCards.map((e) => e.type));
for (const e of Le)
  ko.has(e.tag) || window.customCards.push({
    type: e.tag,
    name: `Mushroom Addition: ${e.name}`,
    description: e.description,
    preview: !0,
    documentationURL: "https://github.com/snfx-johaver/mushroom-cards-addition"
  });
console.info(
  `%c MUSHROOM-CARDS-ADDITION %c ${$o} · ${Le.length} components `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;"
);
export {
  Le as CATALOG
};
//# sourceMappingURL=mushroom-cards-addition.js.map
