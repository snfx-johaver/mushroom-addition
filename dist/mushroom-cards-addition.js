const re = globalThis, ve = re.ShadowRoot && (re.ShadyCSS === void 0 || re.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, we = /* @__PURE__ */ Symbol(), Ae = /* @__PURE__ */ new WeakMap();
let Xe = class {
  constructor(t, a, r) {
    if (this._$cssResult$ = !0, r !== we) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = a;
  }
  get styleSheet() {
    let t = this.o;
    const a = this.t;
    if (ve && t === void 0) {
      const r = a !== void 0 && a.length === 1;
      r && (t = Ae.get(a)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && Ae.set(a, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ht = (e) => new Xe(typeof e == "string" ? e : e + "", void 0, we), et = (e, ...t) => {
  const a = e.length === 1 ? e[0] : t.reduce((r, i, n) => r + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + e[n + 1], e[0]);
  return new Xe(a, e, we);
}, bt = (e, t) => {
  if (ve) e.adoptedStyleSheets = t.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of t) {
    const r = document.createElement("style"), i = re.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = a.cssText, e.appendChild(r);
  }
}, je = ve ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let a = "";
  for (const r of t.cssRules) a += r.cssText;
  return ht(a);
})(e) : e;
const { is: ft, defineProperty: gt, getOwnPropertyDescriptor: yt, getOwnPropertyNames: vt, getOwnPropertySymbols: wt, getPrototypeOf: $t } = Object, ue = globalThis, ze = ue.trustedTypes, Vt = ze ? ze.emptyScript : "", kt = ue.reactiveElementPolyfillSupport, K = (e, t) => e, oe = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Vt : null;
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
} }, $e = (e, t) => !ft(e, t), Ce = { attribute: !0, type: String, converter: oe, reflect: !1, useDefault: !1, hasChanged: $e };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), ue.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let T = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, a = Ce) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(t, a), !a.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(t, r, a);
      i !== void 0 && gt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, a, r) {
    const { get: i, set: n } = yt(this.prototype, t) ?? { get() {
      return this[a];
    }, set(s) {
      this[a] = s;
    } };
    return { get: i, set(s) {
      const c = i?.call(this);
      n?.call(this, s), this.requestUpdate(t, c, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Ce;
  }
  static _$Ei() {
    if (this.hasOwnProperty(K("elementProperties"))) return;
    const t = $t(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(K("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(K("properties"))) {
      const a = this.properties, r = [...vt(a), ...wt(a)];
      for (const i of r) this.createProperty(i, a[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const a = litPropertyMetadata.get(t);
      if (a !== void 0) for (const [r, i] of a) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [a, r] of this.elementProperties) {
      const i = this._$Eu(a, r);
      i !== void 0 && this._$Eh.set(i, a);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const a = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const i of r) a.unshift(je(i));
    } else t !== void 0 && a.push(je(t));
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
  attributeChangedCallback(t, a, r) {
    this._$AK(t, r);
  }
  _$ET(t, a) {
    const r = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, r);
    if (i !== void 0 && r.reflect === !0) {
      const n = (r.converter?.toAttribute !== void 0 ? r.converter : oe).toAttribute(a, r.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, a) {
    const r = this.constructor, i = r._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const n = r.getPropertyOptions(i), s = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : oe;
      this._$Em = i;
      const c = s.fromAttribute(a, n.type);
      this[i] = c ?? this._$Ej?.get(i) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, a, r, i = !1, n) {
    if (t !== void 0) {
      const s = this.constructor;
      if (i === !1 && (n = this[t]), r ??= s.getPropertyOptions(t), !((r.hasChanged ?? $e)(n, a) || r.useDefault && r.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(s._$Eu(t, r)))) return;
      this.C(t, a, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, a, { useDefault: r, reflect: i, wrapped: n }, s) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, s ?? a ?? this[t]), n !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (a = void 0), this._$AL.set(t, a)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [i, n] of this._$Ep) this[i] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [i, n] of r) {
        const { wrapped: s } = n, c = this[i];
        s !== !0 || this._$AL.has(i) || c === void 0 || this.C(i, void 0, n, c);
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
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[K("elementProperties")] = /* @__PURE__ */ new Map(), T[K("finalized")] = /* @__PURE__ */ new Map(), kt?.({ ReactiveElement: T }), (ue.reactiveElementVersions ??= []).push("2.1.2");
const Ve = globalThis, qe = (e) => e, se = Ve.trustedTypes, Ee = se ? se.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, tt = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, at = "?" + C, xt = `<${at}>`, F = document, J = () => F.createComment(""), Z = (e) => e === null || typeof e != "object" && typeof e != "function", ke = Array.isArray, It = (e) => ke(e) || typeof e?.[Symbol.iterator] == "function", fe = `[ 	
\f\r]`, G = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Re = /-->/g, Me = />/g, E = RegExp(`>|${fe}(?:([^\\s"'>=/]+)(${fe}*=${fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Fe = /'/g, Le = /"/g, rt = /^(?:script|style|textarea|title)$/i, St = (e) => (t, ...a) => ({ _$litType$: e, strings: t, values: a }), o = St(1), N = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), Te = /* @__PURE__ */ new WeakMap(), M = F.createTreeWalker(F, 129);
function it(e, t) {
  if (!ke(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ee !== void 0 ? Ee.createHTML(t) : t;
}
const Pt = (e, t) => {
  const a = e.length - 1, r = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = G;
  for (let c = 0; c < a; c++) {
    const u = e[c];
    let g, w, v = -1, S = 0;
    for (; S < u.length && (s.lastIndex = S, w = s.exec(u), w !== null); ) S = s.lastIndex, s === G ? w[1] === "!--" ? s = Re : w[1] !== void 0 ? s = Me : w[2] !== void 0 ? (rt.test(w[2]) && (i = RegExp("</" + w[2], "g")), s = E) : w[3] !== void 0 && (s = E) : s === E ? w[0] === ">" ? (s = i ?? G, v = -1) : w[1] === void 0 ? v = -2 : (v = s.lastIndex - w[2].length, g = w[1], s = w[3] === void 0 ? E : w[3] === '"' ? Le : Fe) : s === Le || s === Fe ? s = E : s === Re || s === Me ? s = G : (s = E, i = void 0);
    const k = s === E && e[c + 1].startsWith("/>") ? " " : "";
    n += s === G ? u + xt : v >= 0 ? (r.push(g), u.slice(0, v) + tt + u.slice(v) + C + k) : u + C + (v === -2 ? c : k);
  }
  return [it(e, n + (e[a] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class Q {
  constructor({ strings: t, _$litType$: a }, r) {
    let i;
    this.parts = [];
    let n = 0, s = 0;
    const c = t.length - 1, u = this.parts, [g, w] = Pt(t, a);
    if (this.el = Q.createElement(g, r), M.currentNode = this.el.content, a === 2 || a === 3) {
      const v = this.el.content.firstChild;
      v.replaceWith(...v.childNodes);
    }
    for (; (i = M.nextNode()) !== null && u.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const v of i.getAttributeNames()) if (v.endsWith(tt)) {
          const S = w[s++], k = i.getAttribute(v).split(C), A = /([.?@])?(.*)/.exec(S);
          u.push({ type: 1, index: n, name: A[2], strings: k, ctor: A[1] === "." ? At : A[1] === "?" ? jt : A[1] === "@" ? zt : me }), i.removeAttribute(v);
        } else v.startsWith(C) && (u.push({ type: 6, index: n }), i.removeAttribute(v));
        if (rt.test(i.tagName)) {
          const v = i.textContent.split(C), S = v.length - 1;
          if (S > 0) {
            i.textContent = se ? se.emptyScript : "";
            for (let k = 0; k < S; k++) i.append(v[k], J()), M.nextNode(), u.push({ type: 2, index: ++n });
            i.append(v[S], J());
          }
        }
      } else if (i.nodeType === 8) if (i.data === at) u.push({ type: 2, index: n });
      else {
        let v = -1;
        for (; (v = i.data.indexOf(C, v + 1)) !== -1; ) u.push({ type: 7, index: n }), v += C.length - 1;
      }
      n++;
    }
  }
  static createElement(t, a) {
    const r = F.createElement("template");
    return r.innerHTML = t, r;
  }
}
function O(e, t, a = e, r) {
  if (t === N) return t;
  let i = r !== void 0 ? a._$Co?.[r] : a._$Cl;
  const n = Z(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(e), i._$AT(e, a, r)), r !== void 0 ? (a._$Co ??= [])[r] = i : a._$Cl = i), i !== void 0 && (t = O(e, i._$AS(e, t.values), i, r)), t;
}
class Dt {
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
    const { el: { content: a }, parts: r } = this._$AD, i = (t?.creationScope ?? F).importNode(a, !0);
    M.currentNode = i;
    let n = M.nextNode(), s = 0, c = 0, u = r[0];
    for (; u !== void 0; ) {
      if (s === u.index) {
        let g;
        u.type === 2 ? g = new ee(n, n.nextSibling, this, t) : u.type === 1 ? g = new u.ctor(n, u.name, u.strings, this, t) : u.type === 6 && (g = new Ct(n, this, t)), this._$AV.push(g), u = r[++c];
      }
      s !== u?.index && (n = M.nextNode(), s++);
    }
    return M.currentNode = F, i;
  }
  p(t) {
    let a = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, a), a += r.strings.length - 2) : r._$AI(t[a])), a++;
  }
}
class ee {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, a, r, i) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = a, this._$AM = r, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    t = O(this, t, a), Z(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== N && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : It(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && Z(this._$AH) ? this._$AA.nextSibling.data = t : this.T(F.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: a, _$litType$: r } = t, i = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = Q.createElement(it(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === i) this._$AH.p(a);
    else {
      const n = new Dt(i, this), s = n.u(this.options);
      n.p(a), this.T(s), this._$AH = n;
    }
  }
  _$AC(t) {
    let a = Te.get(t.strings);
    return a === void 0 && Te.set(t.strings, a = new Q(t)), a;
  }
  k(t) {
    ke(this._$AH) || (this._$AH = [], this._$AR());
    const a = this._$AH;
    let r, i = 0;
    for (const n of t) i === a.length ? a.push(r = new ee(this.O(J()), this.O(J()), this, this.options)) : r = a[i], r._$AI(n), i++;
    i < a.length && (this._$AR(r && r._$AB.nextSibling, i), a.length = i);
  }
  _$AR(t = this._$AA.nextSibling, a) {
    for (this._$AP?.(!1, !0, a); t !== this._$AB; ) {
      const r = qe(t).nextSibling;
      qe(t).remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class me {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, a, r, i, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = a, this._$AM = i, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = d;
  }
  _$AI(t, a = this, r, i) {
    const n = this.strings;
    let s = !1;
    if (n === void 0) t = O(this, t, a, 0), s = !Z(t) || t !== this._$AH && t !== N, s && (this._$AH = t);
    else {
      const c = t;
      let u, g;
      for (t = n[0], u = 0; u < n.length - 1; u++) g = O(this, c[r + u], a, u), g === N && (g = this._$AH[u]), s ||= !Z(g) || g !== this._$AH[u], g === d ? t = d : t !== d && (t += (g ?? "") + n[u + 1]), this._$AH[u] = g;
    }
    s && !i && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class At extends me {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class jt extends me {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class zt extends me {
  constructor(t, a, r, i, n) {
    super(t, a, r, i, n), this.type = 5;
  }
  _$AI(t, a = this) {
    if ((t = O(this, t, a, 0) ?? d) === N) return;
    const r = this._$AH, i = t === d && r !== d || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== d && (r === d || i);
    i && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ct {
  constructor(t, a, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    O(this, t);
  }
}
const qt = Ve.litHtmlPolyfillSupport;
qt?.(Q, ee), (Ve.litHtmlVersions ??= []).push("3.3.3");
const Et = (e, t, a) => {
  const r = a?.renderBefore ?? t;
  let i = r._$litPart$;
  if (i === void 0) {
    const n = a?.renderBefore ?? null;
    r._$litPart$ = i = new ee(t.insertBefore(J(), n), n, void 0, a ?? {});
  }
  return i._$AI(e), i;
};
const xe = globalThis;
class U extends T {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Et(a, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return N;
  }
}
U._$litElement$ = !0, U.finalized = !0, xe.litElementHydrateSupport?.({ LitElement: U });
const Rt = xe.litElementPolyfillSupport;
Rt?.({ LitElement: U });
(xe.litElementVersions ??= []).push("4.2.2");
const Mt = (e) => (t, a) => {
  a !== void 0 ? a.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Ft = { attribute: !0, type: String, converter: oe, reflect: !1, hasChanged: $e }, Lt = (e = Ft, t, a) => {
  const { kind: r, metadata: i } = a;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(a.name, e), r === "accessor") {
    const { name: s } = a;
    return { set(c) {
      const u = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(s, u, e, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(s, void 0, e, c), c;
    } };
  }
  if (r === "setter") {
    const { name: s } = a;
    return function(c) {
      const u = this[s];
      t.call(this, c), this.requestUpdate(s, u, e, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function _e(e) {
  return (t, a) => typeof a == "object" ? Lt(e, t, a) : ((r, i, n) => {
    const s = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, r), s ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(e, t, a);
}
function Tt(e) {
  return _e({ ...e, state: !0, attribute: !1 });
}
const Ut = [
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
], Nt = [
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
], Ue = (e) => e.replace(/^iAbadia/, "iAbadia").split("_").map((t) => ["nas", "mdi", "dwd", "vnc", "wifi", "http"].includes(t.toLowerCase()) ? t.toUpperCase() : `${t[0].toUpperCase()}${t.slice(1)}`).join(" "), Ot = (e) => e === "custom_card_bar_card" ? "bar" : e === "custom_card_alarm_time" ? "alarm-time" : e === "custom_card_nik_door" ? "door" : /alarm|alert|lock/.test(e) ? "security" : /navigate|back/.test(e) ? "navigation" : /battery/.test(e) ? "battery" : /power_outlet|more_power_outlet/.test(e) ? "control" : /energy|power|gauge|speedtest|wifisignal|graph|apex|bar_card|myenedis/.test(e) ? "energy" : /weather|sun|pollen|moon/.test(e) ? "weather" : /scene/.test(e) ? "scene" : /person|tracker|tracer|presence|room|welcome/.test(e) ? "presence" : /media|chromecast|playstation/.test(e) ? "media" : /thermostat|heat_pump|aircondition|temperature|simple_temp/.test(e) ? "climate" : /cover|door|garage/.test(e) ? "cover" : /vacuum/.test(e) ? "vacuum" : /light/.test(e) ? "light" : /fan|outlet|boolean|script|washer|water_heater|qubino/.test(e) ? "control" : /title|subtitle|clock|date/.test(e) ? "text" : /camera/.test(e) ? "camera" : /sensor|elapsed|input_number|input_datetime|update|printer|nas|tablet|flower|car|afval|waste|counter/.test(e) ? "sensor" : "entity", Ht = {
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
}, Bt = (e, t) => e === "custom_card_alarm_time" ? ["input_boolean"] : e === "custom_card_nik_door" ? ["sensor"] : /alarm/.test(e) ? ["alarm_control_panel"] : /lock/.test(e) ? ["lock"] : /power_outlet|more_power_outlet/.test(e) ? ["switch", "light"] : e.includes("binary_sensor") ? ["binary_sensor"] : e.includes("battery") ? ["sensor"] : e.includes("input_boolean") ? ["input_boolean"] : e.includes("input_number") ? ["input_number"] : e.includes("input_datetime") ? ["input_datetime"] : e.includes("light") ? ["light"] : /media|chromecast|playstation/.test(e) ? ["media_player", "sensor"] : /thermostat|heat_pump|aircondition/.test(e) ? ["climate"] : /scene/.test(e) ? ["scene"] : /script/.test(e) ? ["script"] : /vacuum/.test(e) ? ["vacuum"] : /weather/.test(e) ? ["weather"] : /person/.test(e) ? ["person", "device_tracker"] : /cover|door|garage/.test(e) ? ["cover", "binary_sensor"] : /fan/.test(e) ? ["fan"] : /camera/.test(e) ? ["camera"] : /lock/.test(e) ? ["lock"] : /update/.test(e) ? ["update"] : t === "battery" || t === "energy" || t === "sensor" || t === "weather" ? ["sensor"] : t === "control" ? /fan/.test(e) ? ["fan"] : /script/.test(e) ? ["script"] : /washer/.test(e) ? ["switch", "sensor"] : /water_heater/.test(e) ? ["water_heater"] : ["switch", "input_boolean", "light"] : t === "presence" ? ["person", "device_tracker"] : ["sensor", "switch"], Ne = (e, t) => {
  const a = e.replace(/^custom_(card|chip)_/, "").replace(/^(card|chip)_/, ""), r = e.replaceAll("_", "-").toLowerCase(), i = r.startsWith("custom-card-") ? `mushroom-addition-${r}` : `mushroom-addition-card-${r.replace(/^card-/, "")}`, n = Ot(e), s = e === "custom_card_playstation";
  return {
    upstreamId: e,
    sourcePath: t,
    kind: "card",
    category: e.startsWith("custom_") ? "custom-card" : "default-card",
    family: n,
    tag: i,
    name: s ? "PS5 / Xbox Card" : `${Ue(a)} Card`,
    description: s ? "Mushroom-style game console card with PS5 and Xbox modes." : `Mushroom-style ${Ue(a).toLowerCase()} card.`,
    variants: Ht[e],
    preferredDomains: Bt(e, n)
  };
}, nt = [
  ...Ut.map((e) => {
    const t = {
      graph: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/2-line_cards/card_graph.yaml",
      scenes: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_scenes_welcome.yaml",
      title: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/title/card_title.yaml",
      vertical_button: "custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/vertical_buttons/vertical_buttons.yaml"
    };
    return Ne(
      `card_${e}`,
      t[e] ?? `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_${e}.yaml`
    );
  }),
  ...Nt.map((e) => Ne(
    `custom_card_${e}`,
    `custom_cards/custom_card_${e}`
  ))
], ot = [
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
], H = /* @__PURE__ */ new Map();
for (const e of ot)
  for (const t of Object.keys(e.sources)) H.set(t, e);
const st = new Set(ot.map((e) => e.canonical)), pe = nt.filter((e) => !H.has(e.upstreamId) || st.has(e.upstreamId)).map((e) => {
  const t = H.get(e.upstreamId);
  return t ? {
    ...e,
    name: t.name ?? e.name,
    description: t.description ?? e.description,
    variants: t.variants,
    variantLabels: t.variantLabels,
    sourceIds: Object.keys(t.sources)
  } : { ...e, sourceIds: [e.upstreamId] };
}), Ie = nt.filter((e) => H.has(e.upstreamId) && !st.has(e.upstreamId)).map((e) => {
  const t = H.get(e.upstreamId), a = pe.find((r) => r.upstreamId === t.canonical);
  return {
    upstreamId: e.upstreamId,
    tag: e.tag,
    targetId: a.upstreamId,
    targetTag: a.tag,
    variant: t.sources[e.upstreamId]
  };
}), he = pe, Wt = (e) => he.find((t) => t.tag === e) ?? (() => {
  const t = Ie.find((a) => a.tag === e);
  return t ? pe.find((a) => a.tag === t.targetTag) : void 0;
})(), Oe = (e) => H.get(e)?.sources[e], ye = [
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
], lt = (e, t, a = e.enabledByDefault) => ({
  preset: e.preset,
  enabled: a,
  entity: t,
  label: e.label,
  icon: e.icon,
  color: e.color
}), Gt = () => ye.map((e) => lt(e)), R = (e) => {
  if (e.waste_streams?.length) return e.waste_streams.map((r) => ({ ...r }));
  const t = e.type.includes("custom-card-afvalophaling"), a = ye.some((r) => r.legacyKey && typeof e[r.legacyKey] == "string");
  return !t && !a ? [] : ye.map((r, i) => {
    const s = (r.legacyKey && typeof e[r.legacyKey] == "string" ? e[r.legacyKey] : void 0) ?? (i === 0 ? e.entity : void 0);
    return lt(r, s, s ? !0 : r.enabledByDefault);
  });
}, Kt = (e) => {
  if (e.waste_streams?.length) return e;
  const t = R(e);
  return t.length ? { ...e, waste_streams: t } : e;
}, j = /* @__PURE__ */ new Set([
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
]), l = (e) => {
  if (!e) return "Entity unavailable";
  const t = e.attributes.unit_of_measurement;
  return t ? `${e.state} ${String(t)}` : e.state.replaceAll("_", " ");
}, x = (e, t) => e.name_mode === "none" ? "" : e.name_mode === "entity" ? t?.attributes.friendly_name || e.entity || "Mushroom Addition" : e.name || t?.attributes.friendly_name || e.entity || "Mushroom Addition", ie = (e, t, a) => {
  e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    composed: !0,
    detail: a
  }));
}, Yt = (e, t, a) => {
  ie(e, "hass-action", { config: t, action: a });
}, Jt = (e) => {
  const t = Xt(e), a = Zt(t), r = t.navigation_path ? { action: "navigate", navigation_path: t.navigation_path } : { action: t.entity ? "more-info" : "none" };
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
}, L = (e, t) => Object.entries(e).find(([a, r]) => t.test(a) && r !== void 0)?.[1], Zt = (e) => {
  const t = L(e, /_name$/), a = L(e, /_icon$/), r = L(e, /_color$/), i = L(e, /_enable_(controls|buttons)$/), n = L(e, /_enable_slider$/), s = L(e, /_enable_horizontal$/);
  return {
    ...e,
    name: e.name ?? (typeof t == "string" ? t : void 0),
    icon: e.icon ?? (typeof a == "string" ? a : void 0),
    icon_color: e.icon_color ?? (typeof r == "string" ? r : void 0),
    show_controls: e.show_controls ?? (typeof i == "boolean" ? i : typeof n == "boolean" ? n : void 0),
    layout: e.layout ?? (s === !0 ? "horizontal" : void 0)
  };
}, Qt = [
  "ulm_card_person_entity",
  "ulm_card_light_entity",
  "ulm_card_weather_entity",
  "ulm_card_media_player_entity",
  "ulm_card_thermostat_entity",
  "ulm_card_cover_entity",
  "ulm_card_vacuum_entity"
], Xt = (e) => {
  const t = Kt(e);
  if (t.entity) return { ...t, primary_entity: void 0 };
  const a = t.primary_entity || Qt.map((r) => t[r]).find((r) => typeof r == "string");
  return a ? { ...t, entity: a, primary_entity: void 0 } : { ...t };
}, He = {
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
    ulm_custom_card_bar_card_color: "Bar color",
    ulm_custom_card_bar_card_icon: "Header icon",
    ulm_custom_card_bar_card_icon_color: "Icon color",
    ulm_custom_card_bar_card_indicator: "Show bar indicator",
    ulm_custom_card_bar_card_max: "Maximum value",
    ulm_custom_card_bar_card_min: "Minimum value",
    ulm_custom_card_bar_card_name: "Header name",
    ulm_custom_card_bar_card_show_icon: "Show icon and header",
    ulm_custom_card_bar_card_value: "Show value inside bar",
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
    show_forecast: "Voorspelling tonen",
    show_controls: "Bediening tonen"
  }
}, ea = (e, t) => {
  const a = e?.language?.split("-")[0] ?? "en";
  return He[a]?.[t] ?? He.en[t] ?? t.replaceAll("_", " ").replace(/\b\w/g, (r) => r.toUpperCase());
}, ta = {
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
  collapse_entity: "Optional input boolean that collapses or expands the scene buttons.",
  collapsed: "Starts the scene collection in its compact collapsed state.",
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
  ulm_custom_card_bar_card_color: "Color used for the filled portion of the horizontal bar.",
  ulm_custom_card_bar_card_icon: "Optional icon override for the circular header icon.",
  ulm_custom_card_bar_card_icon_color: "Optional accent color for the header icon and its circle.",
  ulm_custom_card_bar_card_indicator: "Shows the current-value indicator at the leading edge of the bar.",
  ulm_custom_card_bar_card_max: "Entity value represented by a completely filled bar.",
  ulm_custom_card_bar_card_min: "Entity value represented by an empty bar.",
  ulm_custom_card_bar_card_name: "Optional name displayed below the current value.",
  ulm_custom_card_bar_card_show_icon: "Shows or hides the complete icon and text header above the bar.",
  ulm_custom_card_bar_card_value: "Displays the entity value at the right side of the bar.",
  ulm_custom_card_washer_power: "Sensor used to show the washer's current power consumption."
}, aa = (e) => ta[e], ra = [
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
], Se = new Map(ra.map((e) => [e.upstreamId, e])), ia = (e) => /popup|browser_mod/i.test(e), na = {
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
}, oa = {
  card_binary_sensor: ["ulm_card_binary_sensor_show_last_changed"],
  card_binary_sensor_alert: ["ulm_card_binary_sensor_alert_show_last_changed"],
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
  custom_card_haven_washer: ["ulm_custom_card_washer_power"]
}, ct = (e, t) => !ia(t) && ([e.upstreamId, ...e.sourceIds ?? []].some((a) => oa[a]?.includes(t) === !0) || na[e.family]?.includes(t) === !0), P = (e, t = "entity") => ({
  name: t,
  selector: { entity: e?.length ? { domain: e } : {} }
}), Y = (e) => ({ name: e, selector: { text: {} } }), D = (e) => ({ name: e, selector: { boolean: {} } }), Be = (e, t = 1, a = 168) => ({
  name: e,
  selector: { number: { min: t, max: a, mode: "box" } }
}), ne = (e) => ({ name: e, selector: { ui_action: {} } }), q = (e, t) => ({
  name: e,
  selector: { select: { mode: "dropdown", options: t } }
}), sa = /* @__PURE__ */ new Set([
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
]), la = /* @__PURE__ */ new Set([
  "ulm_custom_card_bar_card_indicator",
  "ulm_custom_card_bar_card_show_icon",
  "ulm_custom_card_bar_card_value"
]), ca = /* @__PURE__ */ new Set([
  "ulm_custom_card_bar_card_min",
  "ulm_custom_card_bar_card_max"
]), da = {
  ulm_card_weather_primary_info: [
    { value: "extrema", label: "Today's high and low temperatures" },
    { value: "none", label: "Do not show extra information" }
  ],
  ulm_card_weather_secondary_info: [
    { value: "precipitation", label: "Precipitation chance or amount" },
    { value: "none", label: "Do not show extra information" }
  ]
}, le = () => [
  q("name_mode", [
    { value: "entity", label: "Use entity name" },
    { value: "custom", label: "Use custom name" },
    { value: "none", label: "Hide name" }
  ]),
  Y("name"),
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
  D("fill_container"),
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
], I = (e) => [
  P(e.preferredDomains),
  ...e.variants?.length ? [q("variant", e.variants.map((t) => ({
    value: t,
    label: e.variantLabels?.[t] ?? t.replaceAll("-", " ").replace(/\b\w/g, (a) => a.toUpperCase())
  })))] : [],
  ...le()
], We = {
  weather: (e) => [
    ...I(e),
    P(["sensor"], "temperature_entity"),
    P(["sensor"], "humidity_entity"),
    D("show_forecast")
  ],
  climate: (e) => [...I(e), P(["sensor"], "humidity_entity"), D("show_controls")],
  light: (e) => [...I(e)],
  scene: (e) => [
    ...I(e),
    ...e.upstreamId === "card_welcome_scenes" ? [P(["input_boolean"], "collapse_entity"), D("collapsed")] : []
  ],
  presence: (e, t) => [
    ...I(e),
    ...e.upstreamId === "card_room" ? [] : [
      ...t?.variant === "small" ? [] : [
        P(["sensor"], "battery_entity"),
        P(["sensor"], "eta_entity"),
        P(["sensor"], "address_entity")
      ],
      D("use_entity_picture")
    ]
  ],
  battery: (e) => [...I(e)],
  bar: (e) => [...I(e)],
  energy: (e) => [...I(e), P(["sensor"], "min_entity"), P(["sensor"], "max_entity"), D("show_graph")],
  sensor: (e) => [...I(e), D("show_graph")],
  media: (e) => [...I(e), D("show_controls"), ...e.upstreamId === "custom_card_playstation" ? [{ name: "console_platform", selector: { select: { options: ["ps5", "xbox"] } } }] : []],
  cover: (e) => [...I(e), D("show_controls")],
  vacuum: (e) => [...I(e), D("show_controls")],
  security: (e) => [...I(e)],
  navigation: (e) => [
    ...e.variants?.length ? [q("variant", e.variants.map((t) => ({
      value: t,
      label: e.variantLabels?.[t] ?? t
    })))] : [],
    ...le(),
    Y("navigation_path")
  ],
  text: () => [...le(), Y("secondary")],
  camera: (e) => [...I(e)],
  control: (e) => [
    ...I(e),
    .../power_outlet|more_power_outlet/.test(e.upstreamId) ? [P(["sensor"], "graph_entity"), D("show_graph")] : [],
    D("show_controls")
  ],
  "alarm-time": (e) => [...I(e), P(["input_datetime"], "datetime_entity"), D("show_controls")],
  door: (e) => [...I(e), P(["lock"], "lock_entity"), P(["sensor"], "battery_entity"), D("show_controls")],
  entity: (e) => [...I(e), Y("secondary")]
}, ua = (e, t) => [
  ...e.upstreamId === "custom_card_afvalophaling" ? [P(["sensor", "calendar"]), ...le()] : (We[e.family] ?? We.entity)(e, t),
  ne("tap_action"),
  ne("hold_action"),
  ne("double_tap_action")
], ma = (e, t) => {
  const a = t?.variant ? (e.sourceIds ?? [e.upstreamId]).filter((i) => Oe(i) === t.variant || i === e.upstreamId && Oe(i) === void 0) : e.sourceIds ?? [e.upstreamId];
  return [...new Map(
    a.flatMap((i) => Se.get(i)?.variables ?? []).map((i) => [i.name, i])
  ).values()].filter((i) => ct(e, i.name)).map((i) => {
    const n = da[i.name];
    if (n) return q(i.name, n);
    if (la.has(i.name)) return D(i.name);
    if (ca.has(i.name)) return Be(i.name, -1e5, 1e5);
    if (sa.has(i.name))
      return {
        name: i.name,
        selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
      };
    switch (i.selector) {
      case "entity":
        return P(void 0, i.name);
      case "entity-multiple":
        return {
          name: i.name,
          selector: { entity: { multiple: !0 } }
        };
      case "action":
        return ne(i.name);
      case "icon":
        return { name: i.name, selector: { icon: {} } };
      case "color":
        return { name: i.name, selector: { ui_color: {} } };
      case "boolean":
        return D(i.name);
      case "number":
        return Be(i.name, -1e5, 1e5);
      case "object":
        return { name: i.name, selector: { object: {} } };
      default:
        return Y(i.name);
    }
  });
}, _a = [
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
], dt = (e, t) => t?.attributes.icon ? t.attributes.icon : e.upstreamId === "custom_card_playstation" && t?.entity_id.toLowerCase().includes("xbox") ? "mdi:microsoft-xbox" : _a.find(([a]) => a.test(e.upstreamId))?.[1] ?? "mdi:information-outline", pa = (e) => {
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
}, ha = (e) => {
  const t = {};
  for (const a of e.sourceIds ?? [e.upstreamId])
    for (const r of Se.get(a)?.variables ?? []) {
      if (!ct(e, r.name)) continue;
      const i = pa(r.defaultValue);
      i !== void 0 && (t[r.name] = i);
    }
  return t;
}, ut = (e, t, a) => {
  const r = a ? t?.states[a] : void 0;
  return {
    type: `custom:${e.tag}`,
    ...ha(e),
    entity: a,
    waste_streams: e.upstreamId === "custom_card_afvalophaling" ? Gt() : void 0,
    name: r?.attributes.friendly_name,
    icon: dt(e, r),
    show_icon: !0,
    show_state: !0,
    layout: "horizontal"
  };
};
var ba = Object.defineProperty, fa = Object.getOwnPropertyDescriptor, Pe = (e, t, a, r) => {
  for (var i = r > 1 ? void 0 : r ? fa(t, a) : t, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (i = (r ? s(t, a, i) : s(i)) || i);
  return r && i && ba(t, a, i), i;
};
let X = class extends U {
  constructor() {
    super(...arguments), this.computeLabel = (e) => this.config?.type.includes("custom-card-afvalophaling") && e.name === "entity" ? "Optional card action entity" : ea(this.hass, e.name), this.computeHelper = (e) => aa(e.name), this.valueChanged = (e) => {
      if (!this.config || !e.detail.value) return;
      const t = e.detail.value, a = { ...this.config, ...t };
      this.config = a, ie(this, "config-changed", { config: a });
    }, this.addWasteStream = () => {
      this.config && this.updateWasteStreams([
        ...R(this.config),
        { enabled: !0, entity: "", label: "Custom waste", icon: "mdi:trash-can", color: "#43a047" }
      ]);
    };
  }
  setConfig(e) {
    const t = e.type.replace(/^custom:/, ""), a = Ie.find((r) => r.tag === t);
    this.config = {
      ...e,
      variant: e.variant ?? a?.variant
    };
  }
  render() {
    if (!this.hass || !this.config) return d;
    const e = Wt(this.config.type.replace(/^custom:/, ""));
    if (!e) return d;
    const t = ua(e, this.config), a = ma(e, this.config).filter((i) => e.upstreamId !== "custom_card_afvalophaling" || !i.name.startsWith("ulm_card_datum_") && !i.name.includes("ophaling")), r = { ...ut(e, this.hass, this.config.entity), ...this.config };
    return o`
      <ha-form
        .hass=${this.hass}
        .data=${r}
        .schema=${t}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
      ${e.upstreamId === "custom_card_afvalophaling" ? this.renderWasteStreamEditor() : e.family === "scene" ? this.renderItemEditor("scene_items", "Scene buttons", ["scene"]) : e.upstreamId === "card_room" ? this.renderItemEditor("room_sensors", "Room sensor buttons") : d}
      ${a.length ? o`
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
  renderItemEditor(e, t, a) {
    if (!this.config) return d;
    const r = this.config[e] ?? [], i = r.length ? r : (this.config.entities ?? []).map((n) => ({ entity: n }));
    return o`
      <section class="item-editor">
        <h3>${t}</h3>
        <p>Configure each button with a clear entity, label, icon, color, active state and action.</p>
        ${i.map((n, s) => o`
          <div class="item-row">
            <ha-selector
              class="wide"
              .hass=${this.hass}
              .selector=${{ entity: a?.length ? { domain: a } : {} }}
              .value=${n.entity}
              @value-changed=${(c) => this.updateItem(e, s, "entity", c.detail.value)}
            ></ha-selector>
            <ha-textfield
              label="Label"
              .value=${n.name ?? ""}
              @input=${(c) => this.updateItem(e, s, "name", c.target.value)}
            ></ha-textfield>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ icon: {} }}
              .value=${n.icon}
              @value-changed=${(c) => this.updateItem(e, s, "icon", c.detail.value)}
            ></ha-selector>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ ui_color: {} }}
              .value=${n.color}
              @value-changed=${(c) => this.updateItem(e, s, "color", c.detail.value)}
            ></ha-selector>
            <ha-textfield
              label="Active when state is"
              .value=${n.active_state ?? ""}
              @input=${(c) => this.updateItem(e, s, "active_state", c.target.value)}
            ></ha-textfield>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ ui_action: {} }}
              .value=${n.tap_action}
              @value-changed=${(c) => this.updateItem(e, s, "tap_action", c.detail.value)}
            ></ha-selector>
            <div class="item-actions wide">
              <button @click=${() => this.removeItem(e, s)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${() => this.addItem(e)}>Add button</button>
      </section>
    `;
  }
  renderWasteStreamEditor() {
    if (!this.config) return d;
    const e = R(this.config);
    return o`
      <section class="item-editor waste-stream-editor">
        <h3>Waste streams</h3>
        <p>Each enabled row uses its own sensor or calendar entity. Empty or disabled rows are omitted from the card.</p>
        ${e.map((t, a) => o`
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
    const i = [...this.config[e] ?? (this.config.entities ?? []).map((n) => ({ entity: n }))];
    i[t] = { ...i[t], [a]: r || void 0 }, this.updateItems(e, i);
  }
  addItem(e) {
    if (!this.config) return;
    const t = [...this.config[e] ?? (this.config.entities ?? []).map((a) => ({ entity: a }))];
    t.push({ entity: "" }), this.updateItems(e, t);
  }
  removeItem(e, t) {
    if (!this.config) return;
    const a = [...this.config[e] ?? (this.config.entities ?? []).map((r) => ({ entity: r }))].filter((r, i) => i !== t);
    this.updateItems(e, a);
  }
  updateItems(e, t) {
    if (!this.config) return;
    const a = { ...this.config, [e]: t, entities: void 0 };
    this.config = a, ie(this, "config-changed", { config: a });
  }
  updateWasteStream(e, t, a) {
    if (!this.config) return;
    const r = R(this.config);
    r[e] = {
      ...r[e],
      [t]: t === "enabled" ? a !== !1 : a || void 0
    }, this.updateWasteStreams(r);
  }
  removeWasteStream(e) {
    this.config && this.updateWasteStreams(R(this.config).filter((t, a) => a !== e));
  }
  moveWasteStream(e, t) {
    if (!this.config) return;
    const a = R(this.config), r = e + t;
    r < 0 || r >= a.length || ([a[e], a[r]] = [a[r], a[e]], this.updateWasteStreams(a));
  }
  updateWasteStreams(e) {
    if (!this.config) return;
    const t = { ...this.config, waste_streams: e };
    this.config = t, ie(this, "config-changed", { config: t });
  }
};
X.styles = et`
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
Pe([
  _e({ attribute: !1 })
], X.prototype, "hass", 2);
Pe([
  Tt()
], X.prototype, "config", 2);
X = Pe([
  Mt("mushroom-addition-editor")
], X);
const ga = et`
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
  .legacy-weather {
    display: grid;
    min-height: 86px;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 18px;
    padding: 16px 22px;
    border-radius: 20px;
    background: #4aa8e8;
    color: #fff;
  }
  .legacy-weather-current { display: flex; align-items: center; gap: 14px; }
  .legacy-weather-current > ha-icon { --mdc-icon-size: 36px; }
  .legacy-weather-current span, .legacy-weather-details { display: flex; flex-direction: column; gap: 3px; }
  .legacy-weather-current b, .legacy-weather-details b { font-size: 16px; }
  .legacy-weather-current small, .legacy-weather-details span { font-size: 14px; font-weight: 700; text-transform: capitalize; }
  .legacy-weather-details { align-items: flex-end; }
  .legacy-weather-details span { display: flex; flex-direction: row; align-items: center; gap: 5px; }
  .legacy-weather-details ha-icon { --mdc-icon-size: 18px; }
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
  .ulm-default-battery { grid-template-columns: auto minmax(0, 1fr); }
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
  .welcome-scenes { padding: 18px; }
  .welcome-toolbar { display: grid; grid-template-columns: 42px 1fr 42px; align-items: center; gap: 10px; margin-bottom: 24px; }
  .welcome-toolbar-button, .welcome-date { display: inline-flex; min-height: 42px; align-items: center; justify-content: center; border: 0; border-radius: 22px; background: var(--ha-card-background, #fff); color: var(--primary-text-color); box-shadow: 0 2px 6px rgba(0,0,0,.12); }
  .welcome-date { justify-self: center; gap: 6px; padding: 0 14px; font-weight: 700; }
  .welcome-heading { display: flex; flex-direction: column; gap: 18px; margin-bottom: 14px; }
  .welcome-heading b { max-width: 260px; font-size: 28px; line-height: 1.08; }
  .welcome-heading span { color: var(--primary-text-color); font-size: 18px; font-weight: 700; }
  .ulm-media { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 12px; padding: 12px; }
  .media-art { width: 54px; height: 54px; border-radius: 12px; background-position: center; background-size: cover; }
  .ulm-media .ulm-controls { grid-column: 1 / -1; justify-content: center; }
  .ulm-vacuum, .ulm-security { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; }
  .ulm-vacuum .ulm-controls { grid-column: 1 / -1; justify-content: center; }
  .ulm-default-vacuum { display: grid; min-height: 220px; gap: 22px; padding: 24px; background: #1d222a; color: #fff; }
  .vacuum-summary { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; }
  .vacuum-summary .ulm-icon { width: 72px; height: 72px; }
  .vacuum-summary .ulm-icon ha-icon { --mdc-icon-size: 36px; }
  .vacuum-summary .ulm-name { font-size: 22px; }
  .vacuum-summary .ulm-label { font-size: 18px; }
  .ulm-default-vacuum .ulm-label { color: rgba(255,255,255,.7); }
  .vacuum-battery { padding: 6px 9px; border-radius: 12px; background: rgba(255,255,255,.1); font-size: 11px; }
  .vacuum-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .vacuum-actions .ulm-control { width: 100%; height: 68px; border-radius: 18px; background: rgba(255,255,255,.1); color: #fff; }
  .vacuum-actions .ulm-control ha-icon { --mdc-icon-size: 28px; }
  .security-status { padding: 5px 9px; border-radius: 10px; background: rgba(var(--ulm-green), .12); color: rgb(var(--ulm-green)); font-size: 11px; font-weight: 700; }
  .ulm-navigation { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; }
  .ulm-cover { display: grid; gap: 8px; padding: 0 12px 12px; }
  .ulm-cover > .ulm-row { padding-right: 0; padding-left: 0; }
  .cover-controls { display: grid; grid-template-columns: repeat(3, 1fr); }
  .cover-controls .ulm-control { width: 100%; height: 32px; border-radius: 12px; }
  .ulm-cover > .ulm-slider { width: 100%; }
  .ulm-fan { display: grid; gap: 10px; padding: 0 12px 12px; }
  .ulm-fan > .ulm-row { padding-left: 0; padding-right: 0; }
  .ulm-fan > .ulm-slider { width: 100%; accent-color: rgb(var(--ulm-blue)); }
  .ulm-fan-slider { position: relative; height: 42px; overflow: hidden; border-radius: 14px; background: rgba(var(--ulm-grey), .14); }
  .ulm-fan-slider i { position: absolute; inset: 0 auto 0 0; width: var(--fan-level); background: rgb(var(--ulm-yellow)); }
  .ulm-fan-slider input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; }
  .ulm-room { display: grid; min-height: 210px; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; padding: 14px; }
  .room-main { display: flex; min-width: 0; flex-direction: column; justify-content: space-between; gap: 12px; }
  .room-main .ulm-icon { width: 116px; height: 116px; margin: 0 0 -14px -14px; border-radius: 0 58px 0 14px; }
  .room-main .ulm-icon ha-icon { --mdc-icon-size: 56px; }
  .room-entities { display: flex; flex-direction: column; justify-content: flex-end; gap: 7px; }
  .room-entities .metric-pill { width: 46px; min-height: 46px; justify-content: center; overflow: hidden; padding: 0; color: transparent; }
  .room-sensor { border: 0; cursor: pointer; }
  .room-sensor ha-icon { color: var(--item-color); }
  .room-sensor.is-active { background: color-mix(in srgb, var(--item-color) 18%, transparent); }
  .room-sensor span { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
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
  .ulm-simple-default, .ulm-default-navigation { grid-template-columns: auto minmax(0, 1fr); }
  .custom-card-heading {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
  }
  .custom-waste-card, .custom-alarm-time, .custom-washer, .custom-heat-pump,
  .custom-ha-updates, .custom-compact-thermostat, .custom-input-datetime {
    display: grid;
    gap: 12px;
    padding: 12px;
  }
  .waste-grid { display: grid; gap: 5px; }
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
  .alarm-time-controls, .compact-thermostat-controls, .heat-pump-target {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: center;
    gap: 10px;
  }
  .alarm-time-controls .ulm-control, .compact-thermostat-controls .ulm-control,
  .heat-pump-target .ulm-control {
    width: 100%;
    height: 56px;
    border-radius: 18px;
  }
  .alarm-time-controls > b, .compact-thermostat-controls > b,
  .heat-pump-target > b { text-align: center; font-size: 18px; }
  .custom-apexcharts {
    display: grid;
    min-height: 190px;
    grid-template-columns: minmax(110px, .8fr) minmax(0, 1.6fr);
    align-items: stretch;
    gap: 14px;
    padding: 12px;
  }
  .apex-legend { display: grid; align-content: space-around; gap: 6px; }
  .apex-series { display: grid; grid-template-columns: 42px 1fr; align-items: center; column-gap: 9px; }
  .apex-series i { display: grid; width: 42px; height: 42px; grid-row: 1 / 3; place-items: center; border-radius: 50%; background: rgba(var(--tone), .18); color: rgb(var(--tone)); }
  .apex-series b, .apex-series small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .apex-series b { font-size: 13px; }
  .apex-series small { color: var(--secondary-text-color); font-size: 12px; font-weight: 700; }
  .apex-chart { position: relative; display: flex; align-items: center; overflow: hidden; }
  .apex-chart .sparkline { position: relative; z-index: 2; height: 120px; }
  .apex-grid-line { position: absolute; right: 0; left: 0; border-top: 1px dashed rgba(var(--ulm-grey), .18); }
  .apex-grid-line.line-1 { top: 25%; }
  .apex-grid-line.line-2 { top: 50%; }
  .apex-grid-line.line-3 { top: 75%; }
  .custom-chromecast { display: grid; gap: 16px; padding: 12px; }
  .chromecast-controls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .chromecast-controls .ulm-control { width: 100%; height: 48px; border-radius: 16px; }
  .custom-power-details { position: relative; min-height: 190px; overflow: hidden; padding: 12px; }
  .power-details-heading { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 10px; }
  .power-details-value { position: relative; z-index: 2; display: block; margin-top: 18px; text-align: center; font-size: 28px; }
  .power-details-chart { position: absolute; right: 0; bottom: -2px; left: 0; height: 100px; }
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
  .tracker-badge { position: absolute; display: grid; width: 18px; height: 18px; place-items: center; border-radius: 50%; background: #90caf9; color: #17233b; }
  .tracker-badge ha-icon { --mdc-icon-size: 11px; }
  .tracker-one { top: -3px; right: -6px; }
  .tracker-two { right: -6px; bottom: -3px; }
  .custom-room-view { display: grid; min-height: 150px; grid-template-columns: 1fr 60px; gap: 10px; padding: 12px; }
  .room-view-summary { display: flex; align-items: center; gap: 10px; }
  .room-view-summary > span:last-child { display: flex; flex-direction: column; gap: 6px; color: var(--secondary-text-color); }
  .room-view-summary small { display: flex; align-items: center; gap: 3px; }
  .room-view-icon { position: relative; display: grid; width: 44px; height: 44px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-grey), .1); color: rgba(var(--ulm-grey), .45); }
  .room-view-icon i, .room-view-status i, .room-view-actions i { position: absolute; display: grid; min-width: 16px; height: 16px; place-items: center; border-radius: 9px; background: rgb(var(--ulm-blue)); color: #fff; font-size: 10px; font-style: normal; }
  .room-view-icon i { top: -3px; right: -3px; background: rgb(var(--ulm-red)); }
  .room-view-status { position: relative; display: grid; place-items: center; }
  .room-view-status i { top: 28px; right: 8px; }
  .room-view-actions { display: grid; grid-column: 1 / -1; grid-template-columns: repeat(3, 1fr); gap: 7px; }
  .room-view-actions span { position: relative; display: grid; height: 52px; place-items: center; border-radius: 16px; background: rgba(var(--ulm-grey), .08); color: rgba(var(--ulm-grey), .45); }
  .room-view-actions span.is-active { background: rgba(var(--ulm-yellow), .25); color: rgb(var(--ulm-yellow)); }
  .room-view-actions i { top: 5px; right: 30%; }
  .custom-elapsed-time { display: grid; min-height: 72px; grid-template-columns: auto 1fr; align-items: center; gap: 16px; padding: 12px 20px; border-radius: 28px; }
  .custom-elapsed-time .ulm-icon { width: 56px; height: 56px; }
  .custom-elapsed-time .ulm-name { font-size: 19px; }
  .custom-elapsed-time .ulm-label { font-size: 17px; font-weight: 700; }
  .custom-eray-lock { display: grid; min-height: 66px; grid-template-columns: auto 1fr; align-items: center; gap: 14px; padding: 10px 14px; border-radius: 24px; }
  .eray-lock-icon { position: relative; display: grid; width: 44px; height: 44px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-green), .18); color: rgb(var(--ulm-green)); }
  .custom-eray-lock.is-unlocked .eray-lock-icon { background: rgba(var(--ulm-yellow), .22); color: rgb(var(--ulm-yellow)); }
  .door-badge, .battery-badge { position: absolute; display: grid; width: 19px; height: 19px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; background: rgb(var(--ulm-red)); color: #fff; }
  .door-badge { top: -4px; right: -5px; }
  .battery-badge { top: -4px; left: -5px; background: rgb(var(--ulm-yellow)); color: #222; }
  .door-badge ha-icon, .battery-badge ha-icon { --mdc-icon-size: 11px; }
  .custom-esh-welcome { display: grid; gap: 18px; padding: 14px; }
  .esh-welcome-toolbar { display: flex; justify-content: space-between; }
  .esh-welcome-toolbar span { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 50%; box-shadow: 0 2px 7px rgba(0,0,0,.12); }
  .esh-greeting { font-size: 23px; line-height: 1.08; }
  .esh-welcome-items { display: flex; gap: 8px; overflow: hidden; }
  .esh-welcome-items > span { display: flex; min-width: 52px; flex-direction: column; align-items: center; gap: 6px; padding: 7px 4px 10px; border-radius: 25px; box-shadow: 0 2px 7px rgba(0,0,0,.12); }
  .esh-welcome-items i { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 50%; background: rgba(var(--tone), .18); color: rgb(var(--tone)); font-style: normal; }
  .esh-welcome-items small { max-width: 48px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 700; }
  .washer-stages { display: grid; grid-template-columns: repeat(4, 1fr); border-radius: 22px; background: rgba(var(--ulm-grey), .08); }
  .washer-stages span { display: grid; height: 42px; place-items: center; color: rgba(var(--ulm-grey), .35); }
  .washer-stages span.is-active { color: var(--primary-text-color); }
  .washer-stages span.is-active ha-icon { padding: 9px; border-radius: 50%; background: var(--card-background-color); }
  .washer-controls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .washer-controls .ulm-control { width: 100%; height: 42px; border-radius: 16px; }
  .washer-remote { color: var(--secondary-text-color); font-size: 11px; text-align: center; }
  .heat-pump-modes { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
  .heat-pump-modes button { display: grid; height: 38px; place-items: center; border: 0; border-radius: 14px; background: rgba(var(--ulm-grey), .08); color: var(--primary-text-color); }
  .heat-pump-modes button.is-active { background: rgba(var(--ulm-blue), .18); color: rgb(var(--ulm-blue)); }
  .ha-update-list { display: grid; gap: 4px; }
  .ha-update-list span { display: flex; justify-content: space-between; gap: 10px; padding: 4px 8px; border-radius: 8px; background: rgba(var(--ulm-grey), .06); font-size: 11px; }
  .ha-update-list small { color: var(--secondary-text-color); }
  .ha-update-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
  .ha-update-actions ha-icon { box-sizing: content-box; justify-self: center; padding: 9px 22px; border-radius: 14px; background: rgba(var(--ulm-grey), .08); }
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
  .custom-imswel-person { display: grid; gap: 9px; padding: 10px; }
  .imswel-person-main { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; }
  .imswel-person-main .person-picture { width: 44px; height: 44px; border-radius: 50%; background-position: center; background-size: cover; }
  .imswel-person-trackers { display: grid; grid-template-columns: 1fr 1fr 38px; gap: 6px; }
  .imswel-person-trackers span, .imswel-person-trackers button { display: flex; min-width: 0; height: 34px; align-items: center; justify-content: center; gap: 4px; overflow: hidden; border: 0; border-radius: 12px; background: rgba(var(--ulm-grey), .08); color: var(--primary-text-color); font-size: 10px; }
  .input-datetime-controls { display: grid; grid-template-columns: repeat(3, 1fr); align-items: center; gap: 7px; }
  .input-datetime-controls .ulm-control { width: 100%; height: 42px; border-radius: 14px; }
  .input-datetime-controls > b { padding: 12px 4px; border-radius: 14px; background: rgba(var(--ulm-grey), .08); text-align: center; }
  .custom-input-number, .custom-sonos, .custom-mpse-printer, .custom-neekster-update,
  .custom-irmajavi-entities, .custom-irmajavi-weather, .custom-irmajavi-speedtest,
  .custom-light-colorpick, .custom-nik-nas, .custom-nik-tablet { display: grid; gap: 10px; padding: 12px; }
  .input-number-controls, .sonos-controls, .nik-door-controls, .update-controls {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: center; gap: 7px;
  }
  .input-number-controls > b { text-align: center; font-size: 16px; }
  .input-number-controls button, .sonos-controls button, .nik-door-controls button, .update-controls button {
    min-height: 42px; border: 0; border-radius: 13px; background: rgba(var(--ulm-grey), .08); color: var(--primary-text-color);
  }
  .irmajavi-header, .irmajavi-weather-header, .speedtest-router, .nik-nas-header {
    display: flex; min-width: 0; align-items: center; gap: 10px;
  }
  .irmajavi-weather-header > b { margin-left: auto; font-size: 18px; }
  .weather-emoji { display: grid; width: 46px; height: 46px; place-items: center; border-radius: 14px; background: rgba(var(--ulm-blue), .12); color: rgb(var(--ulm-blue)); }
  .irmajavi-four { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
  .irmajavi-four > span { display: grid; min-width: 0; min-height: 54px; place-items: center; padding: 6px 3px; border-radius: 12px; background: rgba(var(--ulm-grey), .07); text-align: center; }
  .irmajavi-four b, .irmajavi-four small { overflow: hidden; max-width: 100%; text-overflow: ellipsis; white-space: nowrap; }
  .irmajavi-four b { font-size: 10px; } .irmajavi-four small { color: var(--secondary-text-color); font-size: 11px; }
  .speedtest-action { display: flex; min-height: 40px; align-items: center; gap: 10px; padding: 0 12px; border: 0; border-radius: 12px; background: rgba(var(--ulm-blue), .1); color: var(--primary-text-color); }
  .speedtest-metrics, .nik-nas-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
  .speedtest-metrics > span, .nik-nas-metrics > span { display: grid; gap: 2px; padding: 8px; border-radius: 10px; background: rgba(var(--ulm-grey), .07); }
  .speedtest-metrics small, .nik-nas-metrics small { color: var(--secondary-text-color); font-size: 10px; }
  .speedtest-metrics b, .nik-nas-metrics b { overflow: hidden; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
  .light-colorpick-top { display: grid; gap: 10px; }
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
  .nik-nas-chart { display: grid; width: 68px; height: 68px; place-items: center; margin: auto; border-radius: 50%; background: conic-gradient(rgb(var(--ulm-blue)) var(--gauge), rgba(var(--ulm-grey), .08) 0); }
  .nik-nas-chart::before { content: ""; grid-area: 1 / 1; width: 52px; height: 52px; border-radius: 50%; background: var(--card-background-color); }
  .nik-nas-chart ha-icon { z-index: 1; grid-area: 1 / 1; }
  .custom-nik-tablet { min-height: 210px; }
  .tablet-status-row, .tablet-action-row, .tablet-parameter-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
  .tablet-status-row span, .tablet-action-row button, .tablet-parameter-row span { display: grid; min-height: 38px; place-items: center; border: 0; border-radius: 10px; background: rgba(var(--ulm-grey), .07); color: var(--primary-text-color); text-align: center; }
  .tablet-parameter-row small { color: var(--secondary-text-color); font-size: 9px; } .tablet-parameter-row b { font-size: 11px; }
  .tablet-battery { position: relative; height: 32px; overflow: hidden; border-radius: 10px; background: rgba(var(--ulm-grey), .08); }
  .tablet-battery i { position: absolute; inset: 0 auto 0 0; border-radius: inherit; background: rgba(var(--ulm-green), .25); }
  .tablet-battery b { position: relative; z-index: 1; display: grid; height: 100%; place-items: center; font-size: 11px; }
  .pollen-icon { display: grid; width: 46px; height: 46px; place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--pollen) 20%, transparent); color: var(--pollen); }
  .paddy-waste-icon { position: relative; } .paddy-waste-icon > i { position: absolute; top: -3px; right: -3px; display: grid; width: 20px; height: 20px; place-items: center; border-radius: 50%; background: rgb(var(--ulm-red)); color: #fff; }
  .paddy-waste-icon > i ha-icon { --mdc-icon-size: 13px; }
  .custom-paddy-welcome { display: grid; min-height: 76px; gap: 8px; padding: 14px; } .custom-paddy-welcome > b { font-size: 22px; }
  .custom-paddy-welcome > span { display: flex; align-items: center; gap: 7px; color: var(--secondary-text-color); font-size: 12px; text-transform: capitalize; }
  .custom-person-chip { display: inline-grid; width: max-content; min-height: 42px; grid-template-columns: 34px auto; align-items: center; gap: 8px; padding: 4px 12px 4px 4px; border-radius: 24px; }
  .custom-person-chip > span { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .12); background-position: center; background-size: cover; color: rgb(var(--ulm-blue)); }
  .custom-person-chip > b { font-size: 12px; }
  .custom-person-info, .custom-ristou-person, .custom-saxel-fan, .custom-schumijo-car,
  .custom-schumijo-flower, .custom-sisimomo-printer, .custom-speedtest-shogun,
  .custom-tpx-aircondition, .custom-water-heater { display: grid; gap: 10px; padding: 12px; }
  .custom-person-info-small { display: grid; min-height: 62px; grid-template-columns: 46px minmax(0, 1fr); align-items: center; gap: 10px; padding: 10px 14px; }
  .person-info-main, .ristou-person-main, .car-hero, .flower-heading, .printer-summary,
  .aircondition-main, .water-heater-top { display: flex; min-width: 0; align-items: center; gap: 10px; }
  .person-info-avatar { display: grid; width: 46px; height: 46px; flex: 0 0 auto; place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .12) center/cover; color: rgb(var(--ulm-blue)); }
  .person-info-avatar[style*="background-image"] ha-icon { opacity: 0; }
  .person-info-status { margin-left: auto; padding: 5px 9px; border-radius: 10px; background: rgba(var(--ulm-green), .12); color: rgb(var(--ulm-green)); font-size: 10px; font-weight: 700; }
  .person-info-details, .car-metrics, .flower-metrics, .device-tracer-meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
  .person-info-details > span, .car-metrics > span, .flower-metrics > span, .device-tracer-meta > span { display: grid; min-width: 0; min-height: 52px; place-items: center; padding: 6px; border-radius: 12px; background: rgba(var(--ulm-grey), .07); text-align: center; }
  .person-info-details ha-icon, .car-metrics ha-icon, .flower-metrics ha-icon, .device-tracer-meta ha-icon { --mdc-icon-size: 17px; color: rgb(var(--ulm-blue)); }
  .person-info-details b, .car-metrics b, .flower-metrics b { overflow: hidden; max-width: 100%; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
  .person-info-details small { color: var(--secondary-text-color); font-size: 9px; }
  .custom-console-card { position: relative; min-height: 112px; overflow: hidden; background: #17191d; color: #fff; }
  .console-backdrop { position: absolute; inset: 0; background-position: center; background-size: cover; opacity: .35; }
  .console-content { position: relative; z-index: 1; display: grid; min-height: 88px; grid-template-columns: 52px minmax(0, 1fr) 42px; align-items: center; gap: 10px; padding: 12px; background: linear-gradient(90deg, rgba(0,0,0,.8), rgba(0,0,0,.18)); }
  .console-logo { display: grid; width: 52px; height: 52px; place-items: center; border-radius: 50%; background: rgba(255,255,255,.1); }
  .console-logo ha-icon { --mdc-icon-size: 32px; } .platform-xbox .console-logo { color: #6cc24a; } .platform-playstation .console-logo { color: #4b8fff; }
  .console-content .ulm-label { color: rgba(255,255,255,.7); } .console-content button { display: grid; width: 42px; height: 42px; place-items: center; border: 0; border-radius: 50%; background: rgba(255,255,255,.12); color: #fff; }
  .custom-qubino, .custom-senoro-window, .custom-lights-count { display: grid; min-height: 64px; grid-template-columns: 46px minmax(0, 1fr) auto; align-items: center; gap: 10px; padding: 10px 14px; }
  .custom-qubino button { display: grid; width: 40px; height: 40px; place-items: center; border: 0; border-radius: 50%; background: rgba(var(--ulm-grey), .08); color: var(--primary-text-color); }
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
`, _ = (e, t) => e?.attributes[t], b = (e) => {
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, $ = (e, t) => {
  const a = e.config[t];
  return typeof a == "string" ? e.hass.states[a] : void 0;
}, m = (e, ...t) => {
  for (const a of t)
    if (e.config[a] !== void 0) return e.config[a];
}, ya = (e, t, ...a) => m(e, String(t), ...a) === !0, va = (e, t) => e.config.icon || e.entity?.attributes.icon || dt(e.descriptor, e.entity) || t, h = (e, t, a = "blue", r = "") => {
  if (e.config.icon_type === "none" || e.config.show_icon === !1) return d;
  const i = e.config.icon_type === "entity-picture" ? _(e.entity, "entity_picture") : void 0;
  return i ? o`<span class="ulm-icon entity-picture ${r}" style=${`background-image:url("${String(i)}")`}></span>` : o`<span class="ulm-icon tone-${a} ${r}"><ha-icon .icon=${va(e, t)}></ha-icon></span>`;
}, Ge = (e, t) => {
  switch (e.config.secondary_info) {
    case "none":
      return;
    case "name":
      return x(e.config, e.entity);
    case "state":
      return l(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    default:
      return e.config.secondary || t;
  }
}, Ke = (e) => e.config.primary_info === "none" ? "" : e.config.primary_info === "state" ? l(e.entity) : x(e.config, e.entity), p = (e, t) => o`
  <span class="ulm-copy">
    ${Ke(e) ? o`<span class="ulm-name">${Ke(e)}</span>` : d}
    ${Ge(e, t) ? o`<span class="ulm-label">${Ge(e, t)}</span>` : d}
  </span>
`, W = (e, t = l(e.entity)) => o`
  <span class="ulm-copy value-first">
    <span class="ulm-name">${t}</span>
    <span class="ulm-label">${x(e.config, e.entity)}</span>
  </span>
`, f = (e, t, a) => o`
  <button class="ulm-control" aria-label=${e} @pointerdown=${(r) => r.stopPropagation()} @click=${a}>
    <ha-icon .icon=${t}></ha-icon>
  </button>
`, ce = {
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
}, wa = (e) => {
  const t = e.entity?.state ?? "unknown", [a, r] = ce[t] ?? ["mdi:weather-partly-cloudy", "grey"], i = $(e, "temperature_entity"), n = $(e, "humidity_entity"), s = l(i) !== "Entity unavailable" ? l(i) : `${_(e.entity, "temperature") ?? "—"}${_(e.entity, "temperature_unit") ?? "°"}`, c = l(n) !== "Entity unavailable" ? l(n) : `${_(e.entity, "humidity") ?? "—"}%`, u = e.forecast?.slice(0, 4) ?? [], g = e.config.variant === "native", w = m(e, "ulm_card_weather_backdrop") === !0, v = m(e, "ulm_card_weather_primary_info") ?? "extrema", S = m(e, "ulm_card_weather_secondary_info") ?? "precipitation";
  if (!g) {
    const k = u[0], A = k?.temperature ?? _(e.entity, "temperature"), be = k?.templow ?? k?.temperature_low ?? "—", ae = _(e.entity, "wind_speed") ?? "—", z = _(e.entity, "wind_speed_unit") ?? "";
    return e.actionSurface("ulm-weather legacy-weather", o`
      <div class="legacy-weather-current">
        <ha-icon .icon=${a}></ha-icon>
        <span><b>${s}</b><small>${t.replaceAll("-", " ")}</small></span>
      </div>
      <div class="legacy-weather-details">
        <b>${String(be)}° / ${String(A)}°</b>
        <span><ha-icon icon="mdi:weather-windy"></ha-icon>${String(ae)} ${String(z)}</span>
      </div>
    `);
  }
  return e.actionSurface(`ulm-weather ${w ? "has-backdrop" : ""}`, o`
    <div class="weather-main">
      <span class="ulm-icon weather-icon tone-${r}"><ha-icon .icon=${a}></ha-icon></span>
      <div class="weather-summary">
        <span class="weather-temp">${s}</span>
        <span class="ulm-name">${x(e.config, e.entity)}</span>
        <span class="ulm-label weather-condition">${t.replaceAll("-", " ")}</span>
        ${!g && u[0] && v === "extrema" ? o`<span class="weather-extrema">H ${String(u[0].temperature ?? "—")}° · L ${String(u[0].templow ?? u[0].temperature_low ?? "—")}°</span>` : d}
        ${!g && S === "precipitation" && u[0]?.precipitation_probability !== void 0 ? o`<span class="weather-extrema">${u[0].precipitation_probability}% precipitation</span>` : S === "precipitation" && u[0]?.precipitation !== void 0 ? o`<span class="weather-extrema">${u[0].precipitation}${String(_(e.entity, "precipitation_unit") ?? " mm")} precipitation</span>` : d}
      </div>
    </div>
    <div class="weather-metrics">
      <span class="metric-pill"><ha-icon icon="mdi:water-percent"></ha-icon>${c}</span>
      <span class="metric-pill"><ha-icon icon="mdi:thermometer"></ha-icon>${s}</span>
    </div>
    ${!g && e.config.show_forecast && u.length ? o`
      <div class="weather-forecast">
        ${u.map((k) => {
    const A = String(k.condition ?? "cloudy");
    return o`<span><ha-icon .icon=${ce[A]?.[0] ?? "mdi:weather-cloudy"}></ha-icon><b>${String(k.temperature ?? "—")}°</b></span>`;
  })}
      </div>
    ` : d}
  `);
}, $a = (e) => {
  const t = e.entity?.state === "on", a = b(_(e.entity, "brightness")), r = a === void 0 ? void 0 : Math.round(a / 2.55), i = ya(e, "show_controls", "ulm_card_light_enable_slider"), n = m(e, "ulm_card_light_enable_buttons") === !0, s = m(e, "ulm_card_light_enable_collapse") === !0 && !t, c = e.config.layout === "horizontal" || m(e, "ulm_card_light_enable_horizontal") === !0, u = m(e, "ulm_card_light_brightness_low") ?? 1, g = m(e, "ulm_card_light_brightness_medium") ?? 50, w = m(e, "ulm_card_light_brightness_high") ?? 100, v = m(e, "ulm_card_light_enable_slider_minSet") ?? 0, S = m(e, "ulm_card_light_enable_slider_maxSet") ?? 100, k = m(e, "ulm_card_light_enable_color") === !0 ? _(e.entity, "rgb_color") : void 0, A = Array.isArray(k) && k.length >= 3 ? k.slice(0, 3).map(Number).join(",") : "255,152,0", be = m(e, "ulm_card_light_force_background_color") === !0 && t, ae = `--light-rgb:${A};${be ? `background:rgba(${A},.2);` : ""}`;
  return e.actionSurface(`ulm-light-card ${c ? "is-horizontal" : ""} ${s ? "is-collapsed" : ""}`, o`
    <div class="light-header ${t ? "is-active" : ""}" style=${ae}>
      ${h(e, "mdi:lightbulb", t ? "yellow" : "grey", "light-icon")}
      ${p(e, r === void 0 ? l(e.entity) : `${l(e.entity)} · ${r}%`)}
    </div>
    ${!s && i ? o`
      <div class="ulm-light-slider" style=${`${ae}--light-level:${Math.max(0, Math.min(100, r ?? 0))}%;`}>
        <i></i>
        <input type="range" .min=${String(v)} .max=${String(S)} .value=${String(r ?? 0)}
          aria-label="Brightness"
          @pointerdown=${(z) => z.stopPropagation()}
          @click=${(z) => z.stopPropagation()}
          @change=${(z) => e.service("light", "turn_on", { entity_id: e.config.entity, brightness_pct: Number(z.target.value) })}>
      </div>
    ` : d}
    ${!s && n ? o`<div class="ulm-controls brightness-presets">
      ${[u, g, w].map((z) => f(`${z}% brightness`, "mdi:brightness-6", (pt) => {
    pt.stopPropagation(), e.service("light", "turn_on", { entity_id: e.config.entity, brightness_pct: z });
  }))}
    </div>` : d}
  `);
}, Va = (e) => {
  const t = _(e.entity, "current_temperature") ?? "—", a = _(e.entity, "temperature") ?? "—", r = $(e, "humidity_entity");
  return e.actionSurface("ulm-climate", o`
    <div class="climate-top">
      ${h(e, "mdi:thermostat", j.has(e.entity?.state ?? "") ? "red" : "blue")}
      ${p(e, `${e.entity?.state ?? "unknown"} · ${t}°`)}
      <span class="climate-target">${a}°</span>
    </div>
    ${r ? o`<span class="metric-pill"><ha-icon icon="mdi:water-percent"></ha-icon>${l(r)}</span>` : d}
    ${e.config.show_controls ? o`<div class="ulm-controls">
      ${f("Decrease temperature", "mdi:minus", (i) => {
    i.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: Number(a) - 0.5 });
  })}
      ${f("Increase temperature", "mdi:plus", (i) => {
    i.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: Number(a) + 0.5 });
  })}
    </div>` : d}
  `);
}, ka = (e) => {
  const t = $(e, "battery_entity"), a = $(e, "eta_entity"), r = $(e, "address_entity"), i = e.config.icon_type === "entity-picture" || e.config.use_entity_picture ? _(e.entity, "entity_picture") : void 0, n = e.config.variant === "small";
  return e.actionSurface(`ulm-row ulm-person ${n ? "is-compact" : ""}`, o`
    ${i ? o`<span class="person-picture" style=${`background-image:url("${String(i)}")`}></span>` : h(e, "mdi:account", e.entity?.state === "home" ? "blue" : "green")}
    ${p(e, [l(r || e.entity), a ? `ETA ${l(a)}` : ""].filter(Boolean).join(" · "))}
    ${n ? d : t ? o`<span class="battery-ring">${l(t)}</span>` : o`<span class="presence-dot ${e.entity?.state === "home" ? "home" : "away"}"></span>`}
  `);
}, xa = (e) => {
  const t = b(e.entity?.state) ?? 0, a = !!_(e.entity, "is_charging") || String(e.entity?.state).includes("charging"), r = m(e, "ulm_card_battery_battery_level_danger") ?? 20, i = m(e, "ulm_card_battery_battery_level_warning") ?? 50, n = t < r ? "red" : t < i ? "yellow" : "green", s = m(e, "ulm_card_battery_charging_animation") === !0 && a;
  return e.actionSurface(`ulm-battery ${s ? "is-charging" : ""}`, o`
    ${h(e, a ? "mdi:battery-charging" : "mdi:battery", n)}
    ${p(e, a ? "Charging" : "Battery level")}
    <span class="battery-value">${Math.round(t)}<small>%</small></span>
    <span class="battery-track"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>
  `);
}, Ia = (e) => {
  const t = b(e.entity?.state) ?? 0, a = !!_(e.entity, "is_charging"), r = m(e, "ulm_card_battery_battery_level_danger") ?? 20, i = m(e, "ulm_card_battery_battery_level_warning") ?? 50, n = t < r ? "red" : t < i ? "yellow" : "green";
  return e.actionSurface("ulm-row ulm-default-battery", o`
    ${h(e, a ? "mdi:battery-charging" : "mdi:battery", n)}
    ${W(e, `${Math.round(t)}%`)}
  `);
}, de = (e, t) => e ? /^(?:#|rgb|hsl|var\(|color\()/i.test(e) ? e : `rgba(var(--color-${e}), 1)` : t, Sa = (e) => {
  const t = b(e.entity?.state) ?? 0, a = b(m(e, "ulm_custom_card_bar_card_min")) ?? 0, i = (b(m(e, "ulm_custom_card_bar_card_max")) ?? 100) - a, n = i > 0 ? Math.max(0, Math.min(100, (t - a) / i * 100)) : 0, s = m(e, "ulm_custom_card_bar_card_show_icon") !== !1, c = m(e, "ulm_custom_card_bar_card_value") === !0, u = m(e, "ulm_custom_card_bar_card_indicator") === !0, g = de(
    m(e, "ulm_custom_card_bar_card_color"),
    "var(--google-blue, #4285f4)"
  ), w = de(
    m(e, "ulm_custom_card_bar_card_icon_color"),
    "var(--secondary-text-color)"
  ), v = m(e, "ulm_custom_card_bar_card_icon") || e.config.icon || e.entity?.attributes.icon || "mdi:chart-bar", S = m(e, "ulm_custom_card_bar_card_name") || x(e.config, e.entity), k = l(e.entity);
  return e.actionSurface(`minimalist-bar-card ${s ? "has-header" : "bar-only"}`, o`
    ${s ? o`
      <div class="bar-card-header">
        <span class="bar-card-icon" style=${`--bar-icon-color:${w}`}>
          <ha-icon .icon=${v}></ha-icon>
        </span>
        <span class="bar-card-copy">
          <b class="bar-card-primary-value">${k}</b>
          <span class="bar-card-name">${S}</span>
        </span>
      </div>
    ` : d}
    <div class="bar-card-track" style=${`--bar-fill:${g}`}>
      <span class="bar-card-fill" style=${`width:${n}%`}></span>
      ${u ? o`<span class="bar-card-indicator" style=${`left:${n}%`}></span>` : d}
      ${c ? o`<b class="bar-card-inside-value">${k}</b>` : d}
    </div>
  `);
}, te = (e, t = !1) => {
  const a = Array.isArray(_(e.entity, "history")) ? _(e.entity, "history").map(Number).filter(Number.isFinite).slice(-12) : [20, 28, 24, 42, 35, 52, 48, 63, 55, 70, 62, 78], r = Math.min(...a), i = Math.max(...a), n = a.map((c, u) => `${u / Math.max(1, a.length - 1) * 100},${36 - (c - r) / Math.max(1, i - r) * 32}`).join(" "), s = `0,40 ${n} 100,40`;
  return o`<svg class="sparkline ${t ? "is-filled" : ""}" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
    ${t ? o`<polygon points=${s}></polygon>` : d}
    <polyline points=${n}></polyline>
  </svg>`;
}, Pa = (e) => e.actionSurface("ulm-metric", o`
  <div class="metric-heading">${h(e, e.descriptor.family === "energy" ? "mdi:flash" : "mdi:chart-line", "blue")}${p(e, e.entity?.attributes.unit_of_measurement ? String(e.entity.attributes.unit_of_measurement) : "Current value")}<span class="metric-value">${l(e.entity)}</span></div>
  ${e.config.show_graph !== !1 ? te(e) : d}
  ${$(e, "min_entity") || $(e, "max_entity") ? o`<div class="metric-extremes"><span>Min ${l($(e, "min_entity"))}</span><span>Max ${l($(e, "max_entity"))}</span></div>` : d}
`), Da = (e, t) => {
  const a = t.tap_action, r = a?.service ?? a?.perform_action;
  if ((a?.action === "call-service" || a?.action === "perform-action") && r) {
    const [i, n] = r.split(".", 2);
    if (i && n) {
      e.service(i, n, {
        entity_id: t.entity,
        ...a.service_data ?? a.data ?? {}
      });
      return;
    }
  }
  e.service("scene", "turn_on", { entity_id: t.entity });
}, Aa = (e) => {
  const t = (e.config.scene_items?.length ? e.config.scene_items : (e.config.entities?.length ? e.config.entities : e.config.entity ? [e.config.entity] : []).map((n) => ({ entity: n }))).filter((n) => n.entity).slice(0, 6), a = e.descriptor.upstreamId === "card_welcome_scenes", r = e.config.collapse_entity ? e.hass.states[e.config.collapse_entity] : void 0, i = e.config.collapsed === !0 || r?.state === "on";
  return e.actionSurface(`ulm-scenes ${a ? "welcome-scenes" : "scene-pills"}`, o`
    ${a ? o`
      <div class="welcome-toolbar">
        <button class="welcome-toolbar-button" aria-label="Toggle scenes" @pointerdown=${(n) => n.stopPropagation()} @click=${(n) => {
    n.stopPropagation(), e.config.collapse_entity && e.service("input_boolean", "toggle", { entity_id: e.config.collapse_entity });
  }}><ha-icon .icon=${i ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon></button>
        <span class="welcome-date"><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${new Intl.DateTimeFormat(void 0, { month: "short", day: "numeric" }).format(/* @__PURE__ */ new Date("2026-02-18"))}</span>
        <span class="welcome-toolbar-button"><ha-icon icon="mdi:cog"></ha-icon></span>
      </div>
      <div class="welcome-heading"><b>${e.config.name || "Good day!"}</b><span>${e.config.secondary || "Scenes"}</span></div>
    ` : d}
    ${i ? d : o`<div class="scene-grid">${t.map((n) => {
    const s = e.hass.states[n.entity], c = s?.state === (n.active_state || "on") || s?.state === "playing", u = de(n.color, "rgb(var(--ulm-purple))");
    return o`
      <button class="scene-button" @pointerdown=${(g) => g.stopPropagation()} @click=${(g) => {
      g.stopPropagation(), Da(e, n);
    }} style=${`--item-color:${u}`} class="scene-button ${c ? "is-active" : ""}">
        <i><ha-icon .icon=${n.icon || s?.attributes.icon || "mdi:palette"}></ha-icon></i>
        <span>${n.name || x({ entity: n.entity }, s)}</span>
      </button>`;
  })}</div>`}
  `);
}, ja = (e) => {
  const t = m(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : _(e.entity, "entity_picture"), r = (e.config.console_platform || e.config.variant) === "xbox" ? "mdi:microsoft-xbox" : "mdi:sony-playstation", i = e.config.entity?.startsWith("media_player.") === !0;
  return e.actionSurface("ulm-media", o`
    ${t ? o`<span class="media-art" style=${`background-image:url("${String(t)}")`}></span>` : h(e, e.descriptor.upstreamId === "custom_card_playstation" ? r : "mdi:play-circle", "purple")}
    ${p(e, String(_(e.entity, "media_title") ?? l(e.entity)))}
    ${i && (e.config.show_controls !== !1 || m(e, "ulm_card_media_player_enable_controls") === !0) ? o`<div class="ulm-controls">
      ${f("Previous", "mdi:skip-previous", (n) => {
    n.stopPropagation(), e.service("media_player", "media_previous_track", { entity_id: e.config.entity });
  })}
      ${f("Play or pause", "mdi:play-pause", (n) => {
    n.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: e.config.entity });
  })}
      ${f("Next", "mdi:skip-next", (n) => {
    n.stopPropagation(), e.service("media_player", "media_next_track", { entity_id: e.config.entity });
  })}
    </div>` : d}
    ${i && m(e, "ulm_card_media_player_enable_volume_slider") === !0 ? o`
      <input class="ulm-slider" type="range" min="0" max="100"
        .value=${String(Math.round(Number(_(e.entity, "volume_level") ?? 0) * 100))}
        @pointerdown=${(n) => n.stopPropagation()}
        @change=${(n) => e.service("media_player", "volume_set", {
    entity_id: e.config.entity,
    volume_level: Number(n.target.value) / 100
  })}>
    ` : d}
  `);
}, za = (e) => {
  const t = e.config.entity?.startsWith("cover.") === !0;
  return e.actionSurface(`ulm-cover ${m(e, "ulm_card_cover_enable_horizontal") ? "is-horizontal" : ""}`, o`
  <div class="ulm-row">
    ${h(e, "mdi:window-shutter", e.entity?.state === "open" ? "blue" : "grey")}
    ${p(e, l(e.entity))}
  </div>
  ${t && e.config.show_controls !== !1 ? o`<div class="ulm-controls cover-controls">
    ${f("Open", "mdi:arrow-up", (a) => {
    a.stopPropagation(), e.service("cover", "open_cover", { entity_id: e.config.entity });
  })}
    ${f("Stop", "mdi:stop", (a) => {
    a.stopPropagation(), e.service("cover", "stop_cover", { entity_id: e.config.entity });
  })}
    ${f("Close", "mdi:arrow-down", (a) => {
    a.stopPropagation(), e.service("cover", "close_cover", { entity_id: e.config.entity });
  })}
  </div>` : d}
  ${t && m(e, "ulm_card_cover_enable_slider") === !0 ? o`
    <input class="ulm-slider" type="range"
      min=${String(m(e, "ulm_card_cover_slider_min") ?? 0)}
      max=${String(m(e, "ulm_card_cover_slider_max") ?? 100)}
      .value=${String(_(e.entity, "current_position") ?? 0)}
      @pointerdown=${(a) => a.stopPropagation()}
      @change=${(a) => e.service("cover", "set_cover_position", {
    entity_id: e.config.entity,
    position: Number(a.target.value)
  })}>
  ` : d}
  `);
}, Ca = (e) => e.actionSurface("ulm-vacuum", o`
  ${h(e, "mdi:robot-vacuum", e.entity?.state === "cleaning" ? "blue" : "grey")}
  ${p(e, l(e.entity))}
  <span class="metric-pill"><ha-icon icon="mdi:battery"></ha-icon>${String(_(e.entity, "battery_level") ?? "—")}%</span>
  ${e.config.show_controls !== !1 ? o`<div class="ulm-controls">
    ${f("Start", "mdi:play", (t) => {
  t.stopPropagation(), e.service("vacuum", "start", { entity_id: e.config.entity });
})}
    ${f("Pause", "mdi:pause", (t) => {
  t.stopPropagation(), e.service("vacuum", "pause", { entity_id: e.config.entity });
})}
    ${f("Return home", "mdi:home-map-marker", (t) => {
  t.stopPropagation(), e.service("vacuum", "return_to_base", { entity_id: e.config.entity });
})}
  </div>` : d}
`), qa = (e) => e.actionSurface("ulm-default-vacuum", o`
  <div class="vacuum-summary">
    ${h(e, "mdi:robot-vacuum", e.entity?.state === "cleaning" ? "blue" : "grey")}
    ${p(e, l(e.entity))}
    <span class="vacuum-battery">${String(_(e.entity, "battery_level") ?? "—")}%</span>
  </div>
  <div class="vacuum-actions">
    ${f("Stop", "mdi:stop", (t) => {
  t.stopPropagation(), e.service("vacuum", "stop", { entity_id: e.config.entity });
})}
    ${f("Return home", "mdi:home", (t) => {
  t.stopPropagation(), e.service("vacuum", "return_to_base", { entity_id: e.config.entity });
})}
    ${f("Locate", "mdi:map-marker", (t) => {
  t.stopPropagation(), e.service("vacuum", "locate", { entity_id: e.config.entity });
})}
    ${f("Start", "mdi:robot-vacuum", (t) => {
  t.stopPropagation(), e.service("vacuum", "start", { entity_id: e.config.entity });
})}
  </div>
`), Ea = (e) => {
  const t = e.entity?.state.startsWith("armed") || e.entity?.state === "locked";
  return e.actionSurface(`ulm-security ${t ? "is-armed" : ""}`, o`
    ${h(e, t ? "mdi:shield-lock" : "mdi:shield-off", t ? "green" : "red")}
    ${p(e, l(e.entity))}
    ${e.config.show_controls ? o`<span class="security-status">${t ? "Secured" : "Attention"}</span>` : d}
  `);
}, Ra = (e) => e.actionSurface("ulm-navigation", o`
  ${h(e, e.descriptor.upstreamId.includes("back") ? "mdi:arrow-left" : "mdi:arrow-right", "blue")}
  ${p(e, e.config.secondary || e.config.navigation_path || "Navigate")}
  <ha-icon icon="mdi:chevron-right"></ha-icon>
`), Ma = (e) => e.actionSurface("ulm-row ulm-default-navigation", o`
  ${h(e, e.config.icon || "mdi:navigation", "blue")}
  ${p(e, e.config.secondary)}
`), Fa = (e, t) => {
  const a = e?.split(".", 1)[0] ?? "homeassistant";
  return a === "script" ? ["script", t === "on" ? "turn_on" : "turn_off"] : a === "fan" ? ["fan", t === "on" ? "turn_on" : "turn_off"] : a === "water_heater" ? ["water_heater", t === "on" ? "turn_on" : "turn_off"] : [a === "input_boolean" ? "input_boolean" : "homeassistant", t === "on" ? "turn_on" : "turn_off"];
}, La = (e) => {
  const t = m(
    e,
    "ulm_custom_card_washer_power",
    "ulm_card_power_outlet_entity",
    "ulm_card_power_entity"
  ), a = e.config.entity?.split(".", 1)[0], r = t || (["switch", "input_boolean", "light", "fan", "script", "water_heater"].includes(a ?? "") ? e.config.entity : void 0), i = r ? e.hass.states[r] : void 0, n = j.has(i?.state ?? e.entity?.state ?? ""), s = $(e, "graph_entity"), [c, u] = Fa(r, n ? "off" : "on");
  return e.actionSurface(`ulm-control-card ulm-row ${n ? "is-active" : ""}`, o`
    ${h(e, e.config.entity?.startsWith("fan.") ? "mdi:fan" : "mdi:power-socket-eu", n ? "yellow" : "grey")}
    ${p(e, s ? `${l(e.entity)} · ${l(s)}` : l(e.entity))}
    ${r && e.config.show_controls !== !1 ? f(n ? "Turn off" : "Turn on", "mdi:power", (g) => {
    g.stopPropagation(), e.service(c, u, { entity_id: r });
  }) : d}
  `);
}, Ta = (e) => {
  const t = e.entity?.state === "on", a = b(_(e.entity, "percentage")) ?? 0, r = m(e, "ulm_card_fan_enable_slider") === !0, i = m(e, "ulm_card_fan_enable_button") === !0;
  return e.actionSurface(`ulm-control-card ulm-fan ${t ? "is-active" : ""}`, o`
    <div class="ulm-row">
      ${h(e, "mdi:fan", t ? "blue" : "grey")}
      ${p(e, `${l(e.entity)}${a ? ` · ${a}%` : ""}`)}
    </div>
    ${r ? o`<div class="ulm-fan-slider" style=${`--fan-level:${a}%`}>
      <i></i>
      <input type="range"
        min=${String(m(e, "ulm_card_fan_slider_min") ?? 0)}
        max=${String(m(e, "ulm_card_fan_slider_max") ?? 100)}
        .value=${String(a)}
        @pointerdown=${(n) => n.stopPropagation()}
        @change=${(n) => e.service("fan", "set_percentage", {
    entity_id: e.config.entity,
    percentage: Number(n.target.value)
  })}>
    </div>` : d}
    ${i ? o`<div class="ulm-controls">${f("Toggle oscillation", m(e, "ulm_card_fan_button_icon") ?? "mdi:rotate-3d-variant", (n) => {
    n.stopPropagation(), e.service("fan", "oscillate", { entity_id: e.config.entity, oscillating: _(e.entity, "oscillating") !== !0 });
  })}</div>` : d}
  `);
}, Ua = (e) => {
  const t = (e.config.room_sensors?.length ? e.config.room_sensors : (e.config.entities ?? []).map((a) => ({ entity: a }))).filter((a) => a.entity).slice(0, 4);
  return e.actionSurface("ulm-room", o`
    <div class="room-main">
      ${p(e, l(e.entity))}
      ${h(e, "mdi:sofa", j.has(e.entity?.state ?? "") ? "yellow" : "blue")}
    </div>
    ${t.length ? o`<div class="room-entities">${t.map((a) => {
    const r = e.hass.states[a.entity], i = r?.state === (a.active_state || "on"), n = de(a.color, "rgb(var(--ulm-blue))");
    return o`<button
        class="metric-pill room-sensor ${i ? "is-active" : ""}"
        style=${`--item-color:${n}`}
        aria-label=${a.name || x({ entity: a.entity }, r)}
        @pointerdown=${(s) => s.stopPropagation()}
        @click=${(s) => {
      s.stopPropagation();
      const c = a.tap_action, u = c?.service ?? c?.perform_action;
      if (u) {
        const [g, w] = u.split(".", 2);
        g && w && e.service(g, w, { entity_id: a.entity, ...c?.service_data ?? c?.data ?? {} });
      }
    }}
      ><ha-icon .icon=${a.icon || r?.attributes.icon || "mdi:circle-small"}></ha-icon><span>${a.name || l(r)}</span></button>`;
  })}</div>` : d}
  `);
}, Na = (e) => {
  const t = _(e.entity, "entity_picture");
  return e.actionSurface("ulm-camera", o`
    ${t ? o`<img src=${String(t)} alt=${x(e.config, e.entity)}>` : o`
      <div class="camera-placeholder">${h(e, "mdi:camera", "blue")}</div>
    `}
    <div class="camera-caption">${p(e, l(e.entity))}</div>
  `);
}, V = (e) => {
  const t = Object.entries(e.config).filter(([a, r]) => typeof r == "string" && r !== e.config.entity && /(_entity|_entity_id|_sensor|_power|_status|_level|_date|_time)$/i.test(a)).map(([, a]) => a);
  return [.../* @__PURE__ */ new Set([...e.config.entities ?? [], ...t])].map((a) => e.hass.states[a]).filter((a) => !!a).slice(0, 6);
}, Oa = (e, t, a = "blue") => {
  const r = V(e);
  return e.actionSurface("ulm-detail-card", o`
    <div class="ulm-row">
      ${h(e, t, a)}
      ${p(e, l(e.entity))}
    </div>
    ${r.length ? o`<div class="detail-grid">${r.map((i) => o`
      <span class="metric-pill"><ha-icon .icon=${i.attributes.icon ?? "mdi:circle-small"}></ha-icon>${l(i)}</span>
    `)}</div>` : d}
  `);
}, Ha = (e) => {
  const t = V(e);
  return e.actionSurface("ulm-schedule-card", o`
    <div class="ulm-row">
      ${h(e, /pollen/.test(e.descriptor.upstreamId) ? "mdi:flower-pollen" : "mdi:trash-can", "green")}
      ${p(e, l(e.entity))}
    </div>
    <div class="schedule-list">${(t.length ? t : e.entity ? [e.entity] : []).slice(0, 4).map((a) => o`
      <span><b>${x({ entity: a.entity_id }, a)}</b><small>${l(a)}</small></span>
    `)}</div>
  `);
}, Ba = (e) => {
  const t = b(e.entity?.state), a = V(e);
  return e.actionSurface("ulm-device-status", o`
    <div class="ulm-row">
      ${h(e, /printer/.test(e.descriptor.upstreamId) ? "mdi:printer" : /nas/.test(e.descriptor.upstreamId) ? "mdi:nas" : /washer/.test(e.descriptor.upstreamId) ? "mdi:washing-machine" : "mdi:devices", t !== void 0 && t < 20 ? "red" : "blue")}
      ${p(e, l(e.entity))}
      ${t !== void 0 ? o`<b class="device-value">${Math.round(t)}${String(e.entity?.attributes.unit_of_measurement ?? "")}</b>` : d}
    </div>
    ${t !== void 0 ? o`<span class="device-progress"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>` : d}
    ${a.length ? o`<div class="detail-grid">${a.map((r) => o`<span class="metric-pill">${l(r)}</span>`)}</div>` : d}
  `);
}, Wa = (e) => {
  const t = b(e.entity?.state) ?? 0, a = m(e, "ulm_card_gauge_min", "ulm_custom_card_mpse_gauge_min") ?? 0, r = m(e, "ulm_card_gauge_max", "ulm_custom_card_mpse_gauge_max") ?? 100, i = Math.max(0, Math.min(100, (t - a) / Math.max(1, r - a) * 100));
  return e.actionSurface("ulm-gauge-card", o`
    <span class="gauge-ring" style=${`--gauge:${i * 3.6}deg`}><b>${l(e.entity)}</b></span>
    ${p(e, `${a} – ${r}`)}
  `);
}, Ga = (e) => {
  const t = $(e, "datetime_entity");
  return e.actionSurface(`ulm-control-card ulm-row ${j.has(e.entity?.state ?? "") ? "is-active" : ""}`, o`
    ${h(e, "mdi:alarm", j.has(e.entity?.state ?? "") ? "yellow" : "grey")}
    ${p(e, l(t || e.entity))}
    ${e.config.show_controls !== !1 ? f(j.has(e.entity?.state ?? "") ? "Disable alarm" : "Enable alarm", "mdi:power", (a) => {
    a.stopPropagation(), e.service("input_boolean", j.has(e.entity?.state ?? "") ? "turn_off" : "turn_on", { entity_id: e.config.entity });
  }) : d}
  `);
}, Ka = (e) => {
  const t = $(e, "lock_entity"), a = $(e, "battery_entity"), r = t?.state === "locked";
  return e.actionSurface("ulm-row ulm-door", o`
    ${h(e, r ? "mdi:door-closed-lock" : "mdi:door-open", r ? "green" : "red")}
    ${p(e, [l(e.entity), t ? l(t) : "", a ? l(a) : ""].filter(Boolean).join(" · "))}
    ${t && e.config.show_controls !== !1 ? f(r ? "Unlock" : "Lock", r ? "mdi:lock-open" : "mdi:lock", (i) => {
    i.stopPropagation(), e.service("lock", r ? "unlock" : "lock", { entity_id: e.config.lock_entity });
  }) : d}
  `);
}, y = (e, ...t) => {
  const a = m(e, ...t);
  return a ? e.hass.states[a] : void 0;
}, Ya = (e) => {
  const t = R(e.config).filter((r) => r.enabled !== !1 && r.entity), a = (r) => {
    if (!r || ["unknown", "unavailable", "none", "geen"].includes(r.state.toLowerCase())) return "—";
    if (r.entity_id.startsWith("calendar.")) {
      const i = _(r, "start_time") ?? _(r, "start") ?? _(r, "end_time");
      if (typeof i == "string") {
        const n = new Date(i);
        if (!Number.isNaN(n.getTime()))
          return new Intl.DateTimeFormat(e.hass.language, { day: "2-digit", month: "2-digit", year: "numeric" }).format(n);
      }
    }
    return r.state;
  };
  return e.actionSurface("custom-waste-card", o`
    <div class="custom-card-heading">
      ${h(e, "mdi:trash-can-outline", "green")}
      <span class="ulm-copy">
        <span class="ulm-name">${e.config.name || m(e, "ulm_volgende_ophaling") || "Next collections"}</span>
        <span class="ulm-label">${t.length === 1 ? "1 configured waste stream" : `${t.length} configured waste streams`}</span>
      </span>
    </div>
    <div class="waste-grid">${t.map((r) => {
    const i = r.entity ? e.hass.states[r.entity] : void 0;
    return o`<span class="waste-row" style=${`--waste-color:${r.color || "#43a047"}`}>
        <ha-icon .icon=${r.icon || "mdi:trash-can"}></ha-icon>
        <b>${r.label || i?.attributes.friendly_name || r.entity}</b>
        <small>${a(i)}</small>
      </span>`;
  })}</div>
  `);
}, Ja = (e) => {
  const t = y(e, "ulm_card_alarm_time_datetime") ?? $(e, "datetime_entity"), a = b(m(e, "ulm_card_alarm_time_step")) ?? 15, r = t?.state || "00:00:00", [i, n] = r.split(":").map(Number), s = (c) => {
    const u = ((i || 0) * 60 + (n || 0) + c + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: t?.entity_id,
      time: `${String(Math.floor(u / 60)).padStart(2, "0")}:${String(u % 60).padStart(2, "0")}:00`
    });
  };
  return e.actionSurface("custom-alarm-time", o`
    <div class="custom-card-heading">
      ${h(e, m(e, "ulm_card_alarm_time_icon") || "mdi:alarm", "grey")}
      ${p(e, l(e.entity))}
    </div>
    <div class="alarm-time-controls">
      ${f(`Earlier by ${a} minutes`, "mdi:minus", (c) => {
    c.stopPropagation(), s(-a);
  })}
      <b>${r.slice(0, 5)}</b>
      ${f(`Later by ${a} minutes`, "mdi:plus", (c) => {
    c.stopPropagation(), s(a);
  })}
    </div>
  `);
}, Za = (e) => {
  const t = [e.entity, ...V(e)].filter((r) => !!r).slice(0, 3), a = ["green", "red", "orange"];
  return e.actionSurface("custom-apexcharts", o`
    <div class="apex-legend">${t.map((r, i) => o`
      <span class="apex-series tone-${a[i]}">
        <i><ha-icon .icon=${r.attributes.icon || ["mdi:download", "mdi:lan-pending", "mdi:upload"][i]}></ha-icon></i>
        <b>${x({ entity: r.entity_id }, r)}</b>
        <small>${l(r)}</small>
      </span>
    `)}</div>
    <div class="apex-chart">${te(e)}<span class="apex-grid-line line-1"></span><span class="apex-grid-line line-2"></span><span class="apex-grid-line line-3"></span></div>
  `);
}, Qa = (e) => e.actionSurface("custom-chromecast", o`
  <div class="custom-card-heading">
    ${h(e, "mdi:cast", "blue")}
    ${p(e, l(e.entity))}
  </div>
  <div class="chromecast-controls">
    ${f("Power", "mdi:power", (t) => {
  t.stopPropagation(), e.service("media_player", e.entity?.state === "off" ? "turn_on" : "turn_off", { entity_id: e.config.entity });
})}
    ${f("Play or pause", "mdi:play", (t) => {
  t.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: e.config.entity });
})}
    ${f("Source", "mdi:video-input-hdmi", (t) => {
  t.stopPropagation();
})}
  </div>
`), Xa = (e) => {
  const t = b(m(e, "ulm_card_power_details_hours")) ?? e.config.graph_hours ?? 2;
  return e.actionSurface("custom-power-details", o`
    <div class="power-details-heading">
      ${h(e, "mdi:flash", "grey")}
      ${p(e, `${t === 1 ? "In the last hour" : `In the last ${t} hours`}`)}
    </div>
    <b class="power-details-value">${l(e.entity)}</b>
    <div class="power-details-chart">${te(e, !0)}</div>
  `);
}, Ye = (e) => e === "bluetooth" ? "mdi:bluetooth" : e === "wifi" ? "mdi:wifi" : "mdi:crosshairs-gps", er = (e) => {
  const t = y(e, "ulm_custom_card_device_tracker_tracker_1_entity") ?? e.entity, a = y(e, "ulm_custom_card_device_tracker_tracker_2_entity"), r = [t, a].filter(Boolean).some((i) => i?.state === "home");
  return e.actionSurface("custom-device-tracker", o`
    <span class="device-tracker-icon">
      <ha-icon .icon=${m(e, "ulm_custom_card_device_tracker_icon") || "mdi:cellphone"}></ha-icon>
      ${t ? o`<i class="tracker-badge tracker-one"><ha-icon .icon=${Ye(m(e, "ulm_custom_card_device_tracker_tracker_1_type"))}></ha-icon></i>` : d}
      ${a ? o`<i class="tracker-badge tracker-two"><ha-icon .icon=${Ye(m(e, "ulm_custom_card_device_tracker_tracker_2_type"))}></ha-icon></i>` : d}
    </span>
    <span class="ulm-copy"><b class="ulm-name">${x(e.config, e.entity)}</b><span class="ulm-label">${r ? "Present" : l(e.entity)}</span></span>
  `);
}, tr = (e) => {
  const t = V(e), a = t.find((n) => n.entity_id.includes("humidity")), r = t.find((n) => n.entity_id.startsWith("light.")), i = t.find((n) => n.entity_id.startsWith("binary_sensor."));
  return e.actionSurface("custom-room-view", o`
    <div class="room-view-summary">
      <span class="room-view-icon"><ha-icon icon="mdi:sofa"></ha-icon><i>!</i></span>
      <span><b>${l(e.entity)}</b>${a ? o`<small><ha-icon icon="mdi:water-percent"></ha-icon>${l(a)}</small>` : d}</span>
    </div>
    <div class="room-view-status"><ha-icon icon="mdi:door"></ha-icon>${i?.state === "on" ? o`<i>1</i>` : d}</div>
    <div class="room-view-actions">
      <span><ha-icon icon="mdi:lightbulb-off"></ha-icon></span>
      <span class=${r?.state === "on" ? "is-active" : ""}><ha-icon icon="mdi:lightbulb"></ha-icon>${r?.state === "on" ? o`<i>1</i>` : d}</span>
      <span><ha-icon icon="mdi:television"></ha-icon><i>1</i></span>
    </div>
  `);
}, ar = (e) => {
  const t = e?.state;
  if (!t || !t.includes("-") && !t.includes("T")) return l(e);
  const a = t ? Date.parse(t) : Number.NaN;
  if (Number.isFinite(a)) {
    const r = Math.max(0, Math.floor((Date.now() - a) / 6e4));
    if (r < 1) return "just now";
    if (r < 60) return `${r} minute${r === 1 ? "" : "s"} ago`;
    const i = Math.floor(r / 60);
    if (i < 24) return `${i} hour${i === 1 ? "" : "s"} ago`;
    const n = Math.floor(i / 24);
    return `${n} day${n === 1 ? "" : "s"} ${i % 24} hours ago`;
  }
  return l(e);
}, rr = (e) => e.actionSurface("custom-elapsed-time", o`
  ${h(e, "mdi:timer-sand", "grey")}
  <span class="ulm-copy"><b class="ulm-name">${x(e.config, e.entity)}</b><span class="ulm-label">${ar(e.entity)}</span></span>
`), ir = (e) => {
  const t = y(e, "ulm_custom_card_eraycetinay_lock_door_open"), a = y(e, "ulm_custom_card_eraycetinay_lock_battery_level") ?? $(e, "battery_entity"), r = e.entity?.state === "locked", i = b(a?.state) !== void 0 && Number(a?.state) <= (b(m(e, "ulm_custom_card_eraycetinay_lock_battery_warning")) ?? 20);
  return e.actionSurface(`custom-eray-lock ${r ? "is-locked" : "is-unlocked"}`, o`
    <span class="eray-lock-icon"><ha-icon .icon=${r ? "mdi:lock" : "mdi:lock-open"}></ha-icon>
      ${t?.state === "on" ? o`<i class="door-badge"><ha-icon icon="mdi:door-open"></ha-icon></i>` : d}
      ${i ? o`<i class="battery-badge"><ha-icon icon="mdi:battery-alert"></ha-icon></i>` : d}
    </span>
    ${p(e, l(e.entity))}
  `);
}, nr = (e) => {
  const t = V(e).slice(0, 5), a = [
    ["mdi:home", "House", "blue"],
    ["mdi:lightbulb", "Lights", "yellow"],
    ["mdi:shield", "Secure", "green"],
    ["mdi:radiator", "Climate", "purple"],
    ["mdi:flask", "Lab", "red"]
  ];
  return e.actionSurface("custom-esh-welcome", o`
    <div class="esh-welcome-toolbar">
      <span><ha-icon icon="mdi:chevron-up"></ha-icon></span>
      <span><ha-icon icon="mdi:thermometer"></ha-icon></span>
      <span><ha-icon icon="mdi:cog"></ha-icon></span>
    </div>
    <b class="esh-greeting">Good ${(/* @__PURE__ */ new Date()).getHours() < 12 ? "morning" : (/* @__PURE__ */ new Date()).getHours() < 18 ? "afternoon" : "evening"},<br>${e.config.name || x(e.config, e.entity)}!</b>
    <div class="esh-welcome-items">${a.map(([r, i, n], s) => o`
      <span class="tone-${n}"><i><ha-icon .icon=${t[s]?.attributes.icon || r}></ha-icon></i><small>${t[s] ? x({ entity: t[s].entity_id }, t[s]) : i}</small></span>
    `)}</div>
  `);
}, or = (e) => {
  const t = y(e, "ulm_custom_card_washer_job_progress"), a = y(e, "ulm_custom_card_washer_job_state"), r = y(e, "ulm_custom_card_washer_remote_control"), i = /run|wash|dry/i.test(a?.state || e.entity?.state || ""), n = b(t?.state) ?? (i ? 45 : 0), s = ["mdi:water-boiler", "mdi:waves", "mdi:water", "mdi:fan"];
  return e.actionSurface("custom-washer", o`
    <div class="custom-card-heading">${h(e, "mdi:washing-machine", "blue")}${p(e, l(a || e.entity))}</div>
    <div class="washer-stages">${s.map((c, u) => o`<span class=${n >= u * 25 ? "is-active" : ""}><ha-icon .icon=${c}></ha-icon></span>`)}</div>
    <div class="washer-controls">
      ${f("Pause", "mdi:pause", (c) => {
    c.stopPropagation();
  })}
      ${f("Stop", "mdi:stop", (c) => {
    c.stopPropagation();
  })}
      ${f("Delay start", "mdi:alarm", (c) => {
    c.stopPropagation();
  })}
    </div>
    ${r ? o`<span class="washer-remote">${l(r)}</span>` : d}
  `);
}, sr = (e) => {
  const t = b(_(e.entity, "temperature")) ?? 20, a = b(_(e.entity, "target_temp_step")) ?? 0.5, r = [
    ["off", "mdi:power"],
    ["heat", "mdi:fire"],
    ["cool", "mdi:snowflake"],
    ["heat_cool", "mdi:sync"],
    ["dry", "mdi:water"],
    ["fan_only", "mdi:fan"]
  ];
  return e.actionSurface("custom-heat-pump", o`
    <div class="custom-card-heading">${h(e, "mdi:thermostat", e.entity?.state === "heat" ? "red" : "grey")}${p(e, `${_(e.entity, "current_temperature") ?? "—"}° · ${_(e.entity, "hvac_action") ?? l(e.entity)}`)}</div>
    <div class="heat-pump-target">
      ${f("Decrease temperature", "mdi:arrow-down", (i) => {
    i.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: t - a });
  })}
      <b>${t}°C</b>
      ${f("Increase temperature", "mdi:arrow-up", (i) => {
    i.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: t + a });
  })}
    </div>
    <div class="heat-pump-modes">${r.map(([i, n]) => o`
      <button class=${e.entity?.state === i ? "is-active" : ""} @pointerdown=${(s) => s.stopPropagation()} @click=${(s) => {
    s.stopPropagation(), e.service("climate", "set_hvac_mode", { entity_id: e.config.entity, hvac_mode: i });
  }}><ha-icon .icon=${n}></ha-icon></button>
    `)}</div>
  `);
}, Je = (e, t, a) => y(e, t) ?? Object.values(e.hass.states).find((r) => r.entity_id.startsWith("update.") && r.entity_id.includes(a)), lr = (e) => {
  const t = [
    ["Supervisor", Je(e, "ulm_card_homeassistant_supervisor", "supervisor")],
    ["Core", y(e, "ulm_card_homeassistant_core") ?? e.entity],
    ["OS", Je(e, "ulm_card_homeassistant_os", "operating_system")]
  ], a = t.some(([, r]) => r?.state === "on");
  return e.actionSurface("custom-ha-updates", o`
    <div class="custom-card-heading">${h(e, "mdi:home-assistant", a ? "blue" : "grey")}${p(e, a ? "Updates available" : "No updates available")}</div>
    <div class="ha-update-list">${t.map(([r, i]) => o`
      <span><b>${r}</b><small>${String(_(i, "installed_version") ?? l(i))}${i?.state === "on" ? ` → ${String(_(i, "latest_version") ?? "new")}` : ""}</small></span>
    `)}</div>
    <div class="ha-update-actions"><ha-icon icon="mdi:file-document"></ha-icon><ha-icon icon="mdi:cog"></ha-icon><ha-icon icon="mdi:update"></ha-icon></div>
  `);
}, cr = (e) => {
  const t = _(e.entity, "next_rising"), a = _(e.entity, "next_setting"), r = (n) => {
    const s = new Date(String(n ?? ""));
    return Number.isNaN(s.getTime()) ? "—" : s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, i = e.entity?.state === "above_horizon";
  return e.actionSurface("custom-sun-card", o`
    <div class="sun-times"><span><small>Sunrise</small><b>${r(t)}</b></span><span><small>Sunset</small><b>${r(a)}</b></span></div>
    <div class="sun-arc"><svg viewBox="0 0 300 90" preserveAspectRatio="none"><path class="sun-night" d="M0,62 Q60,115 105,62"></path><path class="sun-day" d="M0,62 Q150,-45 300,62"></path><circle cx=${i ? "170" : "28"} cy=${i ? "18" : "70"} r="10"></circle><line x1="0" y1="62" x2="300" y2="62"></line></svg></div>
    <div class="sun-footer"><span><small>Dawn</small><b>${r(t)}</b></span><span><small>Solar noon</small><b>12:00</b></span><span><small>Dusk</small><b>${r(a)}</b></span></div>
  `);
}, Ze = (e) => {
  const t = _(e.entity, "hvac_action") === "heating", a = b(_(e.entity, "temperature")) ?? 20;
  return e.actionSurface(`custom-compact-thermostat ${t ? "is-heating" : ""}`, o`
    <div class="custom-card-heading">${h(e, t ? "mdi:radiator" : "mdi:radiator-off", "red")}${p(e, l(e.entity))}<b>${_(e.entity, "current_temperature") ?? "—"}°</b></div>
    <div class="compact-thermostat-controls">
      ${f("Decrease temperature", "mdi:minus", (r) => {
    r.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: a - 0.5 });
  })}
      <b>${a}°</b>
      ${f("Increase temperature", "mdi:plus", (r) => {
    r.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: a + 0.5 });
  })}
    </div>
  `);
}, dr = (e) => {
  const t = b(e.entity?.state) ?? 0, a = b(m(e, "ulm_custom_card_iAbadia_battery_chip_danger")) ?? 10, r = b(m(e, "ulm_custom_card_iAbadia_battery_chip_warning")) ?? 20, i = t <= a ? "red" : t <= r ? "yellow" : "green";
  return e.actionSurface(`custom-battery-chip tone-${i}`, o`
    <ha-icon .icon=${m(e, "ulm_custom_card_iAbadia_battery_chip_icon") || e.config.icon || "mdi:battery"}></ha-icon>
  `);
}, ur = (e) => {
  const t = Array.isArray(_(e.entity, "data")) ? _(e.entity, "data") : [], a = Math.max(1, b(m(e, "ulm_custom_card_imswel_medias_index")) ?? 1), r = t[a] ?? t.find((s) => s.title) ?? {}, i = r.fanart || r.poster || _(e.entity, "entity_picture"), n = m(e, "ulm_custom_card_imswel_medias_platform") || "plex";
  return e.actionSurface("custom-media-library", o`
    ${i ? o`<span class="media-library-art" style=${`background-image:url("${String(i)}")`}></span>` : o`<span class="media-library-art"><ha-icon icon="mdi:movie-open"></ha-icon></span>`}
    <span class="media-library-overlay">
      <span class="media-platform"><ha-icon .icon=${n === "sonarr" ? "mdi:television-classic" : n === "radarr" ? "mdi:movie" : "mdi:plex"}></ha-icon></span>
      <span class="ulm-copy">
        <b class="ulm-name">${String(r.title ?? _(e.entity, "media_title") ?? x(e.config, e.entity))}</b>
        <span class="ulm-label">${String(r.episode ?? r.release ?? `${n} · ${l(e.entity)}`)}</span>
      </span>
    </span>
  `);
}, mr = (e) => {
  const t = y(e, "ulm_card_imswel_person_gps_tracker"), a = y(e, "ulm_card_imswel_person_wifi_tracker"), r = m(e, "ulm_card_imswel_person_findmy_script");
  return e.actionSurface("custom-imswel-person", o`
    <div class="imswel-person-main">${_(e.entity, "entity_picture") ? o`<span class="person-picture" style=${`background-image:url("${String(_(e.entity, "entity_picture"))}")`}></span>` : h(e, "mdi:account", e.entity?.state === "home" ? "blue" : "grey")}
      ${p(e, l(e.entity))}
      ${$(e, "battery_entity") ? o`<b>${l($(e, "battery_entity"))}</b>` : d}
    </div>
    <div class="imswel-person-trackers">
      <span><ha-icon icon="mdi:crosshairs-gps"></ha-icon>${l(t)}</span>
      <span><ha-icon icon="mdi:wifi"></ha-icon>${l(a)}</span>
      <button @pointerdown=${(i) => i.stopPropagation()} @click=${(i) => {
    i.stopPropagation(), r && e.service("script", "turn_on", { entity_id: r });
  }}><ha-icon icon="mdi:cellphone-marker"></ha-icon></button>
    </div>
  `);
}, _r = (e) => {
  const a = (e.entity?.state || "00:00:00").split(" ").at(-1) || "00:00:00", [r, i] = a.split(":").map(Number), n = (s) => {
    const c = ((r || 0) * 60 + (i || 0) + s + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: e.config.entity,
      time: `${String(Math.floor(c / 60)).padStart(2, "0")}:${String(c % 60).padStart(2, "0")}:00`
    });
  };
  return e.actionSurface("custom-input-datetime", o`
    <div class="custom-card-heading">${h(e, "mdi:calendar-clock", "green")}${p(e, l(e.entity))}</div>
    <div class="input-datetime-controls">
      ${f("Earlier", "mdi:arrow-down", (s) => {
    s.stopPropagation(), n(-15);
  })}
      <b>${a.slice(0, 5)}</b>
      ${f("Later", "mdi:arrow-up", (s) => {
    s.stopPropagation(), n(15);
  })}
    </div>
  `);
}, pr = (e) => {
  const t = e.config.entity?.split(".", 1)[0] ?? "input_number", a = t === "counter" ? ["counter", "decrement"] : t === "select" ? ["select", "select_previous"] : t === "input_select" ? ["input_select", "select_previous"] : ["input_number", "decrement"], r = t === "counter" ? ["counter", "increment"] : t === "select" ? ["select", "select_next"] : t === "input_select" ? ["input_select", "select_next"] : ["input_number", "increment"];
  return e.actionSurface("custom-input-number", o`
    <div class="custom-card-heading">${h(e, "mdi:tune-variant", "blue")}${p(e, l(e.entity))}</div>
    <div class="input-number-controls">
      ${f("Previous value", "mdi:arrow-down", (i) => {
    if (i.stopPropagation(), t === "number") {
      const n = b(_(e.entity, "step")) ?? 1;
      e.service("number", "set_value", { entity_id: e.config.entity, value: (b(e.entity?.state) ?? 0) - n });
    } else e.service(a[0], a[1], { entity_id: e.config.entity });
  })}
      <b>${l(e.entity)}</b>
      ${f("Next value", "mdi:arrow-up", (i) => {
    if (i.stopPropagation(), t === "number") {
      const n = b(_(e.entity, "step")) ?? 1;
      e.service("number", "set_value", { entity_id: e.config.entity, value: (b(e.entity?.state) ?? 0) + n });
    } else e.service(r[0], r[1], { entity_id: e.config.entity });
  })}
    </div>
  `);
}, hr = (e) => {
  const t = V(e).slice(0, 4);
  return e.actionSurface("custom-irmajavi-entities", o`
    <div class="irmajavi-header">${h(e, m(e, "ulm_custom_card_irmajavi_entities_icon") || "mdi:alien", "purple")}${p(e, l(e.entity))}</div>
    <div class="irmajavi-four">${t.map((a, r) => o`
      <span><b>${m(e, `ulm_custom_card_irmajavi_entities_name_${r + 1}`) || x({ entity: a.entity_id }, a)}</b><small>${l(a)}</small></span>
    `)}</div>
  `);
}, br = (e) => {
  const t = V(e), a = y(e, "ulm_custom_card_irmajavi_speedtest_download_speed_entity") ?? e.entity, r = y(e, "ulm_custom_card_irmajavi_speedtest_upload_speed_entity") ?? t[0], i = y(e, "ulm_custom_card_irmajavi_speedtest_ping_entity") ?? t[1];
  return e.actionSurface("custom-irmajavi-speedtest", o`
    <div class="speedtest-router">${h(e, "mdi:router-wireless", "blue")}<span class="ulm-copy"><b class="ulm-name">${m(e, "ulm_custom_card_irmajavi_speedtest_name") || "Router"}</b><span class="ulm-label">${m(e, "ulm_custom_card_irmajavi_speedtest_model") || "Internet connection"}</span></span></div>
    <button class="speedtest-action" @pointerdown=${(n) => n.stopPropagation()} @click=${(n) => {
    n.stopPropagation();
    for (const s of [a, r, i]) s && e.service("homeassistant", "update_entity", { entity_id: s.entity_id });
  }}><ha-icon icon="mdi:speedometer"></ha-icon><span>Internet speed test</span></button>
    <div class="speedtest-metrics">
      ${[["Download", a], ["Upload", r], ["Ping", i]].map(([n, s]) => o`<span><small>${n}</small><b>${l(s)}</b></span>`)}
    </div>
  `);
}, fr = (e) => {
  const t = V(e).slice(0, 4), a = $(e, "temperature_entity"), r = e.entity?.state || "unknown", i = ce[r]?.[0] || "mdi:weather-partly-cloudy";
  return e.actionSurface("custom-irmajavi-weather", o`
    <div class="irmajavi-weather-header">
      <span class="weather-emoji"><ha-icon .icon=${i}></ha-icon></span>
      <span class="ulm-copy"><b class="ulm-name">${new Intl.DateTimeFormat(void 0, { weekday: "long", month: "short", day: "numeric" }).format(/* @__PURE__ */ new Date())}</b><span class="ulm-label">${r.replaceAll("-", " ")}</span></span>
      <b>${a ? l(a) : `${_(e.entity, "temperature") ?? "—"}°`}</b>
    </div>
    <div class="irmajavi-four">${t.map((n) => o`<span><b>${x({ entity: n.entity_id }, n)}</b><small>${l(n)}</small></span>`)}</div>
  `);
}, gr = (e) => {
  const t = e.entity?.state === "on", a = b(_(e.entity, "brightness")), r = a === void 0 ? 0 : Math.round(a / 2.55), i = [[255, 255, 255], [255, 0, 0], [0, 110, 255], [0, 190, 90], [220, 0, 220], [0, 210, 220]];
  return e.actionSurface("custom-light-colorpick", o`
    <div class="light-colorpick-top">
      <div class="light-header ${t ? "is-active" : ""}">${h(e, "mdi:lightbulb", t ? "yellow" : "grey")}${p(e, `${l(e.entity)} · ${r}%`)}</div>
      <div class="ulm-light-slider" style=${`--light-rgb:255,193,7;--light-level:${r}%`}><i></i><input type="range" min="0" max="100" .value=${String(r)} @pointerdown=${(n) => n.stopPropagation()} @change=${(n) => e.service("light", "turn_on", { entity_id: e.config.entity, brightness_pct: Number(n.target.value) })}></div>
    </div>
    ${t ? o`<div class="light-color-swatches">${i.map((n) => o`<button style=${`--swatch:rgb(${n.join(",")})`} aria-label=${`Set color ${n.join(",")}`} @pointerdown=${(s) => s.stopPropagation()} @click=${(s) => {
    s.stopPropagation(), e.service("light", "turn_on", { entity_id: e.config.entity, rgb_color: n, transition: b(m(e, "ulm_card_light_colorpick_transition")) ?? 1 });
  }}></button>`)}</div>` : d}
  `);
}, yr = (e) => {
  const t = Math.round((b(_(e.entity, "volume_level")) ?? 0) * 100);
  return e.actionSurface("custom-sonos", o`
    <div class="custom-card-heading">${h(e, "mdi:speaker", e.entity?.state === "playing" ? "green" : "grey")}${p(e, `${_(e.entity, "source") ?? l(e.entity)} · ${t}%`)}</div>
    <div class="sonos-controls">
      ${f("Volume down", "mdi:volume-minus", (a) => {
    a.stopPropagation(), e.service("media_player", "volume_down", { entity_id: e.config.entity });
  })}
      ${f("Play or pause", e.entity?.state === "playing" ? "mdi:pause" : "mdi:play", (a) => {
    a.stopPropagation(), e.service("media_player", "media_play_pause", { entity_id: e.config.entity });
  })}
      ${f("Volume up", "mdi:volume-plus", (a) => {
    a.stopPropagation(), e.service("media_player", "volume_up", { entity_id: e.config.entity });
  })}
    </div>
  `);
}, vr = (e) => {
  const t = y(e, "ulm_card_more_power_outlet_power_sensor") ?? $(e, "graph_entity"), a = y(e, "ulm_card_more_power_outlet_energy_sensor"), r = y(e, "ulm_card_more_power_outlet_time_sensor"), i = [t ? l(t) : "", a ? l(a) : "", r ? l(r) : ""].filter(Boolean).join(" · ");
  return e.actionSurface("custom-more-power-outlet", o`
    ${h(e, "mdi:power-socket-eu", e.entity?.state === "on" ? "yellow" : "grey")}
    ${p(e, i || l(e.entity))}
  `);
}, wr = (e) => {
  const t = b(e.entity?.state) ?? 0, a = b(m(e, "ulm_card_mpse_gauge_min")) ?? 0, r = b(m(e, "ulm_card_mpse_gauge_max")) ?? 100, i = Math.max(0, Math.min(100, (t - a) / Math.max(1, r - a) * 100));
  return e.actionSurface("custom-dual-gauge", o`
    <div class="custom-card-heading">${h(e, "mdi:gauge", "blue")}${p(e, l(e.entity))}</div>
    <div class="dual-gauge" style=${`--gauge:${i * 1.8}deg`}>
      <i></i>
      <span><b>${l(e.entity)}</b><small>${a} - ${r}</small></span>
    </div>
  `);
}, $r = (e) => {
  const t = V(e).slice(0, 4), a = ["#111", "#faff00", "#f800ff", "#00ffff"];
  return e.actionSurface("custom-mpse-printer", o`
    <div class="custom-card-heading">${h(e, "mdi:printer", e.entity?.state === "idle" ? "grey" : "blue")}${p(e, l(e.entity))}</div>
    <div class="toner-bars">${t.map((r, i) => {
    const n = Math.max(0, Math.min(100, b(r.state) ?? 0));
    return o`<span style=${`--toner:${a[i]};--level:${n}%`}><i><em></em><b>${l(r)}</b></i></span>`;
  })}</div>
  `);
}, Vr = (e) => {
  const t = b(e.entity?.state) ?? -100, a = t >= -50 ? "mdi:wifi-strength-4" : t >= -60 ? "mdi:wifi-strength-3" : t >= -70 ? "mdi:wifi-strength-2" : t >= -80 ? "mdi:wifi-strength-1" : "mdi:wifi-strength-off";
  return e.actionSurface("custom-wifi-signal", o`${h(e, a, "blue")}${p(e, `${t} dBm`)}`);
}, kr = (e) => e.actionSurface("custom-nas-info", o`
  ${h(e, "mdi:nas", "blue")}
  ${p(e, `${m(e, "ulm_custom_card_nas_text") || ""} ${l(e.entity)}${m(e, "ulm_custom_card_nas_unit", "ulm_custom_cad_nas_unit") || ""}`.trim())}
`), xr = (e) => {
  const t = e.entity?.state !== "off", a = m(e, "ulm_custom_card_neekster_update_enable_controls") === !0;
  return e.actionSurface("custom-neekster-update", o`
    <div class="custom-card-heading">${h(e, t ? "mdi:cloud-download" : "mdi:cloud-check", t ? "yellow" : "green")}${p(e, t ? "Update available" : "Up to date")}</div>
    ${a && t ? o`<div class="update-controls">
      ${f("Install update", "mdi:update", (r) => {
    r.stopPropagation(), e.service("update", "install", { entity_id: e.config.entity });
  })}
      ${f("Skip update", "mdi:skip-next", (r) => {
    r.stopPropagation(), e.service("update", "skip", { entity_id: e.config.entity });
  })}
    </div>` : d}
  `);
}, Ir = (e) => {
  const t = /* @__PURE__ */ new Date();
  return e.actionSurface("custom-nik-clock", o`
    <b>${t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</b>
    <span>${t.toLocaleDateString(e.hass.language, { weekday: "long", day: "numeric", month: "long" })}</span>
  `);
}, Sr = (e) => {
  const t = $(e, "lock_entity"), a = $(e, "battery_entity"), r = b(a?.state) ?? 0;
  return e.actionSurface("custom-nik-door", o`
    <div class="nik-door-heading">
      <span class="nik-door-icon"><ha-icon .icon=${e.entity?.state === "on" ? "mdi:door-open" : "mdi:door-closed"}></ha-icon><i class=${r <= 40 ? "is-low" : ""}><ha-icon .icon=${r <= 40 ? "mdi:battery-alert" : "mdi:battery"}></ha-icon></i></span>
      ${p(e, `${l(e.entity)} · ${l(t)}`)}
    </div>
    <div class="nik-door-controls">
      ${f("Unlock", "mdi:lock-open", (i) => {
    i.stopPropagation(), t && e.service("lock", "unlock", { entity_id: t.entity_id });
  })}
      ${f("Lock", "mdi:lock", (i) => {
    i.stopPropagation(), t && e.service("lock", "lock", { entity_id: t.entity_id });
  })}
    </div>
  `);
}, Pr = (e) => {
  const t = V(e).slice(0, 4);
  return ["off", "unavailable", "unknown"].includes(e.entity?.state ?? "") ? e.actionSurface("custom-nik-nas is-off", o`${h(e, "mdi:nas", "grey")}${p(e, l(e.entity))}`) : e.actionSurface("custom-nik-nas is-on", o`
    <div class="nik-nas-header">${h(e, "mdi:nas", "blue")}${p(e, l(e.entity))}</div>
    <div class="nik-nas-metrics">${t.slice(0, 3).map((r, i) => o`<span class=${`metric-${i + 1}`}><b>${l(r)}</b><small>${x({ entity: r.entity_id }, r)}</small></span>`)}</div>
    <div class="nik-nas-chart" style=${`--gauge:${Math.max(0, Math.min(100, b(t[0]?.state) ?? 0)) * 3.6}deg`}><ha-icon icon="mdi:nas"></ha-icon></div>
  `);
}, Dr = (e) => {
  const t = V(e), a = b(e.entity?.state) ?? 0;
  return e.actionSurface("custom-nik-tablet", o`
    <div class="custom-card-heading">${h(e, "mdi:tablet", "blue")}${p(e, l(e.entity))}</div>
    <div class="tablet-status-row">${t.slice(0, 3).map((r) => o`<span>${l(r)}</span>`)}</div>
    <div class="tablet-action-row"><button><ha-icon icon="mdi:restart"></ha-icon></button><button><ha-icon icon="mdi:reload"></ha-icon></button><button><ha-icon icon="mdi:wrench"></ha-icon></button></div>
    <div class="tablet-parameter-row">${t.slice(3, 6).map((r) => o`<span><small>${x({ entity: r.entity_id }, r)}</small><b>${l(r)}</b></span>`)}</div>
    <div class="tablet-battery"><i style=${`width:${a}%`}></i><b>${a}%</b></div>
  `);
}, mt = (e) => e >= 6 ? ["Very high", "#d32f2f"] : e >= 5 ? ["High", "#f44336"] : e >= 4 ? ["Medium", "#ff9800"] : e >= 3 ? ["Moderate", "#fbc02d"] : e >= 2 ? ["Low", "#8bc34a"] : e >= 1 ? ["Very low", "#c5e1a5"] : ["None", "#9e9e9e"], Ar = (e) => {
  const t = b(e.entity?.state) ?? 0, [a, r] = mt(t);
  return e.actionSurface("custom-paddy-pollen", o`
    <span class="pollen-icon" style=${`--pollen:${r}`}><ha-icon .icon=${e.config.icon || "mdi:flower-pollen"}></ha-icon></span>
    ${W(e, a)}
  `);
}, jr = (e) => {
  const t = b(_(e.entity, "daysTo")), a = t === 0 || t === 1 || e.entity?.state === "unavailable";
  return e.actionSurface(`custom-paddy-waste ${a ? "is-warning" : ""}`, o`
    <span class="paddy-waste-icon">${h(e, "mdi:trash-can", a ? "red" : "green")}${a ? o`<i><ha-icon icon="mdi:alert"></ha-icon></i>` : d}</span>
    ${W(e)}
  `);
}, zr = (e) => {
  const t = (/* @__PURE__ */ new Date()).getHours(), a = t >= 18 ? "Good evening" : t >= 12 ? "Good afternoon" : t >= 5 ? "Good morning" : "Hello", r = y(e, "ulm_weather") ?? Object.values(e.hass.states).find((i) => i.entity_id.startsWith("weather."));
  return e.actionSurface("custom-paddy-welcome", o`
    <b>${a}, ${e.config.name || x(e.config, e.entity)}!</b>
    ${r ? o`<span><ha-icon .icon=${ce[r.state]?.[0] || "mdi:weather-partly-cloudy"}></ha-icon>${_(r, "temperature") ?? "—"}° · ${r.state.replaceAll("-", " ")}</span>` : d}
  `);
}, Cr = (e) => {
  const t = e.config.use_entity_picture ? _(e.entity, "entity_picture") : void 0;
  return e.actionSurface("custom-person-chip", o`
    ${t ? o`<span class="person-chip-picture" style=${`background-image:url("${String(t)}")`}></span>` : o`<span><ha-icon icon="mdi:face-man"></ha-icon></span>`}
    <b>${l(e.entity)}</b>
  `);
}, qr = (e) => {
  const t = e.config.variant === "small", a = V(e), r = String(_(e.entity, "entity_picture") || "");
  if (t) return e.actionSurface("custom-person-info-small is-compact", o`
    <span class="person-info-avatar" style=${r ? `background-image:url("${r}")` : ""}><ha-icon icon="mdi:account"></ha-icon></span>
    ${p(e, `${l(e.entity)}${a[0] ? ` · ${l(a[0])}` : ""}`)}
  `);
  const i = y(e, "ulm_card_person_battery") ?? $(e, "battery_entity") ?? a[0], n = y(e, "ulm_card_person_distance") ?? a[1], s = y(e, "ulm_card_person_zone") ?? a[2];
  return e.actionSurface("custom-person-info", o`
    <div class="person-info-main">
      <span class="person-info-avatar" style=${r ? `background-image:url("${r}")` : ""}><ha-icon icon="mdi:account"></ha-icon></span>
      ${p(e, l(e.entity))}
      <span class="person-info-status">${e.entity?.state === "home" ? "Home" : e.entity?.state || "Unknown"}</span>
    </div>
    <div class="person-info-details">
      <span><ha-icon icon="mdi:battery"></ha-icon><b>${l(i)}</b><small>Battery</small></span>
      <span><ha-icon icon="mdi:map-marker-distance"></ha-icon><b>${l(n)}</b><small>Distance</small></span>
      <span><ha-icon icon="mdi:map-marker-radius"></ha-icon><b>${l(s)}</b><small>Zone</small></span>
    </div>
  `);
}, Er = (e) => {
  const t = m(e, "console_platform", "platform", "console_type", "variant") === "xbox" ? "xbox" : "playstation", a = e.entity?.state === "on" || e.entity?.state === "playing", r = m(e, "ulm_custom_card_console_background", "ulm_card_playstation_background");
  return e.actionSurface(`custom-console-card platform-${t}`, o`
    ${r ? o`<div class="console-backdrop" style=${`background-image:url("${r}")`}></div>` : d}
    <div class="console-content">
      <span class="console-logo"><ha-icon .icon=${t === "xbox" ? "mdi:microsoft-xbox" : "mdi:sony-playstation"}></ha-icon></span>
      ${p(e, `${a ? "Playing" : l(e.entity)}${_(e.entity, "source") ? ` · ${String(_(e.entity, "source"))}` : ""}`)}
      <button @pointerdown=${(i) => i.stopPropagation()} @click=${(i) => {
    i.stopPropagation(), e.service("media_player", a ? "turn_off" : "turn_on", { entity_id: e.config.entity });
  }}><ha-icon .icon=${a ? "mdi:power" : "mdi:play"}></ha-icon></button>
    </div>
  `);
}, Rr = (e) => {
  const t = y(e, "ulm_custom_card_qubino_power") ?? V(e)[0];
  return e.actionSurface("custom-qubino", o`
    ${h(e, e.entity?.state === "on" ? "mdi:radiator" : "mdi:radiator-disabled", e.entity?.state === "on" ? "red" : "grey")}
    ${p(e, `${l(e.entity)}${t ? ` · ${l(t)}` : ""}`)}
    <button @pointerdown=${(a) => a.stopPropagation()} @click=${(a) => {
    a.stopPropagation(), e.service("switch", "toggle", { entity_id: e.config.entity });
  }}><ha-icon icon="mdi:power"></ha-icon></button>
  `);
}, Mr = (e) => {
  const t = String(_(e.entity, "entity_picture") || ""), a = y(e, "ulm_card_ristou_person_camera"), r = a ? String(_(a, "entity_picture") || `/api/camera_proxy/${a.entity_id}`) : "", i = m(e, "ulm_card_ristou_person_show_map") === !0;
  return e.actionSurface("custom-ristou-person", o`
    <div class="ristou-person-main">
      <span class="person-info-avatar" style=${t ? `background-image:url("${t}")` : ""}><ha-icon icon="mdi:account"></ha-icon></span>
      ${p(e, l(e.entity))}
    </div>
    ${r ? o`<div class="ristou-camera" style=${`background-image:url("${r}")`}></div>` : d}
    ${i ? o`<div class="ristou-map"><ha-icon icon="mdi:map-marker-path"></ha-icon><span>${l(e.entity)}</span></div>` : d}
  `);
}, Fr = (e) => {
  const t = e.entity?.state === "on", a = b(_(e.entity, "percentage")) ?? 0, r = Array.isArray(_(e.entity, "preset_modes")) ? _(e.entity, "preset_modes") : [];
  return e.actionSurface("custom-saxel-fan", o`
    <div class="custom-card-heading">${h(e, "mdi:fan", t ? "blue" : "grey", t ? "spin" : void 0)}${p(e, `${l(e.entity)} · ${a}%`)}</div>
    <div class="fan-speed-row">${[33, 66, 100].map((i, n) => o`<button class=${a >= i - 10 ? "is-active" : ""} @pointerdown=${(s) => s.stopPropagation()} @click=${(s) => {
    s.stopPropagation(), e.service("fan", "set_percentage", { entity_id: e.config.entity, percentage: i });
  }}><ha-icon .icon=${`mdi:fan-speed-${n + 1}`}></ha-icon></button>`)}</div>
    ${r.length ? o`<div class="fan-preset-row">${r.slice(0, 4).map((i) => o`<button class=${_(e.entity, "preset_mode") === i ? "is-active" : ""} @pointerdown=${(n) => n.stopPropagation()} @click=${(n) => {
    n.stopPropagation(), e.service("fan", "set_preset_mode", { entity_id: e.config.entity, preset_mode: i });
  }}>${i}</button>`)}</div>` : d}
  `);
}, Lr = (e) => {
  const t = V(e).slice(0, 5);
  return e.actionSurface("custom-scenes-grid", o`
    ${t.map((a, r) => o`
      <button @pointerdown=${(i) => i.stopPropagation()} @click=${(i) => {
    i.stopPropagation(), e.service(a.entity_id.split(".")[0], "turn_on", { entity_id: a.entity_id });
  }}>
        <span style=${`--tone:${["255,193,7", "33,150,243", "156,39,176", "76,175,80", "244,67,54"][r]}`}><ha-icon .icon=${String(_(a, "icon") || "mdi:palette")}></ha-icon></span>
        <small>${x({ entity: a.entity_id }, a)}</small>
      </button>
    `)}
  `);
}, Tr = (e) => {
  const t = V(e), a = y(e, "ulm_custom_card_schumijo_car_fuel") ?? t[0], r = y(e, "ulm_custom_card_schumijo_car_range") ?? e.entity, i = y(e, "ulm_custom_card_schumijo_car_lock") ?? t.find((n) => n.entity_id.startsWith("lock.")) ?? t[2];
  return e.actionSurface("custom-schumijo-car", o`
    <div class="car-hero">${h(e, "mdi:car", "blue")}${p(e, l(e.entity))}<ha-icon .icon=${i?.state === "locked" ? "mdi:lock" : "mdi:lock-open"}></ha-icon></div>
    <div class="car-metrics"><span><ha-icon icon="mdi:gas-station"></ha-icon><b>${l(a)}</b></span><span><ha-icon icon="mdi:map-marker-distance"></ha-icon><b>${l(r)}</b></span></div>
  `);
}, Ur = (e) => {
  const t = V(e), a = y(e, "ulm_custom_card_schumijo_flower_moisture") ?? e.entity, r = y(e, "ulm_custom_card_schumijo_flower_conductivity") ?? t[0], i = y(e, "ulm_custom_card_schumijo_flower_temperature") ?? t[1], n = y(e, "ulm_custom_card_schumijo_flower_brightness") ?? t[2];
  return e.actionSurface("custom-schumijo-flower", o`
    <div class="flower-heading">${h(e, "mdi:flower", "green")}${p(e, l(e.entity))}</div>
    <div class="flower-metrics">${[["mdi:water-percent", a], ["mdi:flash", r], ["mdi:thermometer", i], ["mdi:white-balance-sunny", n]].map(([s, c]) => o`<span><ha-icon .icon=${s}></ha-icon><b>${l(c)}</b></span>`)}</div>
  `);
}, Nr = (e) => {
  const t = e.entity?.state === "on", a = y(e, "ulm_custom_card_senoro_win_battery") ?? V(e)[0];
  return e.actionSurface(`custom-senoro-window ${t ? "is-open" : ""}`, o`
    ${h(e, t ? "mdi:window-open-variant" : "mdi:window-closed-variant", t ? "red" : "green")}
    ${p(e, l(e.entity))}
    <span class="window-battery"><ha-icon icon="mdi:battery"></ha-icon>${l(a)}</span>
  `);
}, Or = (e) => {
  const t = V(e).slice(0, 6), a = ["#111", "#111", "#ffdf55", "#ef4778", "#4a86db", "#8b69bc"], r = ["BK", "B", "Y", "M", "C", "PB"];
  return e.actionSurface("custom-sisimomo-printer", o`
    <div class="printer-summary">${h(e, "mdi:printer", "blue")}${p(e, l(e.entity))}</div>
    <div class="printer-cartridges">${t.map((i, n) => {
    const s = Math.max(0, Math.min(100, b(i.state) ?? 0));
    return o`<span style=${`--cartridge:${a[n]};--level:${s}%`}><small>${r[n]}</small><i><em></em></i><b>${l(i)}</b></span>`;
  })}</div>
  `);
}, Hr = (e) => {
  const t = V(e), a = [e.entity, ...t].filter(Boolean).slice(0, 3);
  return e.actionSurface("custom-speedtest-shogun", o`
    <div class="speedtest-three">${a.map((r, i) => o`<span><ha-icon .icon=${["mdi:download", "mdi:upload", "mdi:timer-outline"][i]}></ha-icon><b>${l(r)}</b><small>${x({ entity: r.entity_id }, r)}</small></span>`)}</div>
    <div class="speedtest-chart">${te(e)}</div>
  `);
}, Br = (e) => {
  const t = b(_(e.entity, "current_temperature")), a = b(_(e.entity, "temperature")), r = String(_(e.entity, "fan_mode") || ""), i = String(_(e.entity, "swing_mode") || "");
  return e.actionSurface("custom-tpx-aircondition", o`
    <div class="aircondition-main">${h(e, "mdi:air-conditioner", e.entity?.state === "off" ? "grey" : "blue")}${p(e, `${t ?? "—"}° · ${e.entity?.state || "unknown"}`)}<b>${a ?? "—"}°</b></div>
    <div class="aircondition-controls">
      ${f("Decrease", "mdi:minus", (n) => {
    n.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: (a ?? 20) - 0.5 });
  })}
      <span><ha-icon icon="mdi:fan"></ha-icon>${r || "Auto"}</span>
      <span><ha-icon icon="mdi:arrow-up-down"></ha-icon>${i || "Off"}</span>
      ${f("Increase", "mdi:plus", (n) => {
    n.stopPropagation(), e.service("climate", "set_temperature", { entity_id: e.config.entity, temperature: (a ?? 20) + 0.5 });
  })}
    </div>
  `);
}, Wr = (e) => {
  const t = y(e, "ulm_custom_card_vncntdev_device_tracer_person"), a = y(e, "ulm_custom_card_vncntdev_device_tracer_battery") ?? V(e)[0], r = y(e, "ulm_custom_card_vncntdev_device_tracer_source") ?? V(e)[1];
  return e.actionSurface("custom-device-tracer", o`
    <span class="device-tracer-icon"><ha-icon icon="mdi:cellphone-marker"></ha-icon></span>
    ${p(e, `${l(e.entity)}${t ? ` · ${l(t)}` : ""}`)}
    <div class="device-tracer-meta"><span><ha-icon icon="mdi:battery"></ha-icon>${l(a)}</span><span><ha-icon icon="mdi:crosshairs-gps"></ha-icon>${l(r)}</span></div>
  `);
}, Gr = (e) => {
  const t = b(_(e.entity, "current_temperature")), a = b(_(e.entity, "temperature")) ?? b(e.entity?.state);
  return e.actionSurface("custom-water-heater", o`
    <div class="water-heater-top">${h(e, "mdi:water-boiler", e.entity?.state === "off" ? "grey" : "red")}${p(e, `Current ${t ?? "—"}°`)}<b>${a ?? "—"}°</b></div>
    <div class="water-heater-controls">
      ${f("Decrease temperature", "mdi:minus", (r) => {
    r.stopPropagation(), e.service("water_heater", "set_temperature", { entity_id: e.config.entity, temperature: (a ?? 50) - 1 });
  })}
      <span>${l(e.entity)}</span>
      ${f("Increase temperature", "mdi:plus", (r) => {
    r.stopPropagation(), e.service("water_heater", "set_temperature", { entity_id: e.config.entity, temperature: (a ?? 50) + 1 });
  })}
    </div>
  `);
}, Kr = (e) => {
  const t = e.config.variant === "divider-subtitle";
  return o`<div class=${`custom-wilbiev-title ${t ? "is-subtitle" : ""}`}><span></span><b>${e.config.name || (t ? "Subtitle" : "Title")}</b><span></span></div>`;
}, Yr = (e) => {
  const t = [e.entity, ...V(e)].filter(Boolean).slice(0, 3);
  return e.actionSurface("custom-wsly-pollen", o`
    ${t.map((a, r) => {
    const [i, n] = mt(b(a.state) ?? 0);
    return o`<span style=${`--pollen:${n}`}><ha-icon .icon=${["mdi:tree", "mdi:grass", "mdi:flower-pollen"][r]}></ha-icon><b>${l(a)}</b><small>${i}</small></span>`;
  })}
  `);
}, Jr = (e) => {
  const t = b(e.entity?.state) ?? 0, a = m(e, "ulm_custom_card_yagrasdemonde_lights_count_type") || "light", r = { light: t === 0 ? "mdi:lightbulb-outline" : "mdi:lightbulb-on", switch: "mdi:toggle-switch", cover: "mdi:blinds" }, i = t === 1 ? a : `${a}s`;
  return e.actionSurface("custom-lights-count", o`${h(e, r[a] || r.light, t > 0 ? "yellow" : "grey")}${p(e, `${t} ${i} on`)}`);
}, Qe = (e) => e.actionSurface("ulm-row", o`
  ${h(e, "mdi:information-outline", j.has(e.entity?.state ?? "") ? "blue" : "grey")}
  ${W(e)}
`), Zr = (e) => e.actionSurface("ulm-row ulm-generic-swap", o`
  ${W(e)}
  ${h(e, "mdi:information-outline", j.has(e.entity?.state ?? "") ? "blue" : "grey")}
`), Qr = (e) => e.actionSurface("ulm-title", o`
  ${p(e, e.config.secondary)}
`), Xr = (e) => e.actionSurface("ulm-vertical-button", o`
  ${h(e, "mdi:gesture-tap-button", j.has(e.entity?.state ?? "") ? "blue" : "grey")}
  ${p(e, e.config.secondary || l(e.entity))}
`), ei = (e, t = !1) => {
  const a = e.entity?.state === "on", r = m(
    e,
    t ? "ulm_card_binary_sensor_alert_show_last_changed" : "ulm_card_binary_sensor_show_last_changed"
  ) === !0;
  return e.actionSurface(`ulm-row ulm-binary ${a ? "is-active" : ""} ${t && a ? "is-alert" : ""}`, o`
    ${h(e, t && a ? "mdi:alert" : "mdi:radiobox-marked", a ? t ? "red" : "blue" : "grey")}
    ${p(e, r && e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : l(e.entity))}
  `);
}, ge = (e, t, a = "blue") => e.actionSurface("ulm-row ulm-simple-default", o`
    ${h(e, t, j.has(e.entity?.state ?? "") ? a : "grey")}
    ${p(e, l(e.entity))}
  `), ti = (e) => e.actionSurface("ulm-default-graph", o`
  <div class="metric-heading">${h(e, "mdi:chart-line", "red")}${W(e)}</div>
  ${te(e, !0)}
`), ai = (e) => {
  switch (e.descriptor.upstreamId) {
    case "card_battery":
      return Ia(e);
    case "card_binary_sensor":
      return ei(e, e.config.variant === "alert");
    case "card_graph":
      return ti(e);
    case "card_input_boolean":
      return ge(e, "mdi:toggle-switch", "blue");
    case "card_navigate":
      return Ma(e);
    case "card_power_outlet":
      return ge(e, "mdi:power-socket-eu", "yellow");
    case "card_script":
      return ge(e, "mdi:script-text", "blue");
    case "card_title":
      return Qr(e);
    case "card_vacuum":
      return qa(e);
    case "card_vertical_button":
      return Xr(e);
    case "card_generic":
      return e.config.variant === "swapped" ? Zr(e) : Qe(e);
    case "custom_card_afvalophaling":
      return Ya(e);
    case "custom_card_alarm_time":
      return Ja(e);
    case "custom_card_apexcharts":
      return Za(e);
    case "custom_card_chromecast":
      return Qa(e);
    case "custom_card_damix48_power_details":
      return Xa(e);
    case "custom_card_device_tracker":
      return er(e);
    case "custom_card_drealine_roomview":
      return tr(e);
    case "custom_card_eraycetinay_elapsed_time":
      return rr(e);
    case "custom_card_eraycetinay_lock":
      return ir(e);
    case "custom_card_esh_welcome":
      return nr(e);
    case "custom_card_haven_washer":
      return or(e);
    case "custom_card_heat_pump":
      return sr(e);
    case "custom_card_homeassistant_updates":
      return lr(e);
    case "custom_card_httpedo13_sun":
      return cr(e);
    case "custom_card_httpedo13_thermostat":
      return Ze(e);
    case "custom_card_iAbadia_battery_chip":
      return dr(e);
    case "custom_card_imswel_medias":
      return ur(e);
    case "custom_card_imswel_person":
      return mr(e);
    case "custom_card_input_datetime":
      return _r(e);
    case "custom_card_input_number":
      return pr(e);
    case "custom_card_irmajavi_entities":
      return hr(e);
    case "custom_card_irmajavi_speedtest":
      return br(e);
    case "custom_card_irmajavi_weather":
      return fr(e);
    case "custom_card_light_colorpick":
      return gr(e);
    case "custom_card_media_player_sonos":
      return yr(e);
    case "custom_card_more_power_outlet":
      return vr(e);
    case "custom_card_mpse_gauge":
      return wr(e);
    case "custom_card_mpse_printer":
      return $r(e);
    case "custom_card_mpse_thermostat":
      return Ze(e);
    case "custom_card_mpse_wifisignal":
      return Vr(e);
    case "custom_card_nas":
      return kr(e);
    case "custom_card_neekster_update":
      return xr(e);
    case "custom_card_nik_clock":
      return Ir(e);
    case "custom_card_nik_door":
      return Sr(e);
    case "custom_card_nik_nas":
      return Pr(e);
    case "custom_card_nik_tablet":
      return Dr(e);
    case "custom_card_paddy_dwd_pollen":
      return Ar(e);
    case "custom_card_paddy_waste_collection":
      return jr(e);
    case "custom_card_paddy_welcome":
      return zr(e);
    case "custom_card_person_chip":
      return Cr(e);
    case "custom_card_person_info":
    case "custom_card_person_info_small":
      return qr(e);
    case "custom_card_playstation":
      return Er(e);
    case "custom_card_qubino":
      return Rr(e);
    case "custom_card_ristou_person":
      return Mr(e);
    case "custom_card_saxel_fan":
      return Fr(e);
    case "custom_card_scenes":
      return Lr(e);
    case "custom_card_schumijo_car":
      return Tr(e);
    case "custom_card_schumijo_flower":
      return Ur(e);
    case "custom_card_senoro_win":
      return Nr(e);
    case "custom_card_sisimomo_printer":
      return Or(e);
    case "custom_card_speedtest_shogun160":
      return Hr(e);
    case "custom_card_tpx01_aircondition":
      return Br(e);
    case "custom_card_vncntdev_device_tracer":
      return Wr(e);
    case "custom_card_water_heater":
      return Gr(e);
    case "custom_card_wilbiev_title":
    case "custom_card_wilbiev_subtitle":
      return Kr(e);
    case "custom_card_wsly_pollen":
      return Yr(e);
    case "custom_card_yagrasdemonde_lights_count":
      return Jr(e);
    case "card_room":
    case "custom_card_esh_room":
      return Ua(e);
  }
  if (/afval/.test(e.descriptor.upstreamId)) return Ha(e);
  if (/printer/.test(e.descriptor.upstreamId)) return Ba(e);
  if (/gauge/.test(e.descriptor.upstreamId)) return Wa(e);
  if (/schumijo_(car|flower)|irmajavi_entities|damix48_power_details/.test(e.descriptor.upstreamId))
    return Oa(e, /car/.test(e.descriptor.upstreamId) ? "mdi:car" : /flower/.test(e.descriptor.upstreamId) ? "mdi:flower" : "mdi:view-grid", "purple");
  switch (e.descriptor.family) {
    case "weather":
      return wa(e);
    case "climate":
      return Va(e);
    case "light":
      return $a(e);
    case "scene":
      return Aa(e);
    case "presence":
      return ka(e);
    case "battery":
      return xa(e);
    case "bar":
      return Sa(e);
    case "energy":
    case "sensor":
      return Pa(e);
    case "media":
      return ja(e);
    case "cover":
      return za(e);
    case "vacuum":
      return Ca(e);
    case "security":
      return Ea(e);
    case "navigation":
      return Ra(e);
    case "control":
      return e.config.entity?.startsWith("fan.") ? Ta(e) : La(e);
    case "alarm-time":
      return Ga(e);
    case "door":
      return Ka(e);
    case "camera":
      return Na(e);
    default:
      return Qe(e);
  }
};
var ri = Object.defineProperty, _t = (e, t, a, r) => {
  for (var i = void 0, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (i = s(t, a, i) || i);
  return i && ri(t, a, i), i;
};
const De = class De extends U {
  constructor() {
    super(...arguments), this.holdFired = !1, this.forecastGeneration = 0, this.forecast = [], this.actionSurface = (t, a) => {
      const r = this.descriptor ? Se.get(this.descriptor.upstreamId) : void 0;
      if (!r)
        throw new Error(`Missing explicit parity renderer mapping for ${this.descriptor?.upstreamId}`);
      const i = r ? ` parity-${r.rendererId.replaceAll("_", "-")}` : "", n = this.config?.layout && this.config.layout !== "default" ? ` layout-${this.config.layout}` : "", s = this.config?.fill_container ? " fill-container" : "", c = this.config?.variant ? ` variant-${this.config.variant}` : "", u = o`
      <div class="${t}${i}${n}${s}${c} action-surface" role="button" tabindex="0"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        ${a}
      </div>`;
      return o`<ha-card class="minimalist-card">${u}</ha-card>`;
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
    const a = Jt(t), r = this.forecastKey(this.config);
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
    if (!this.hass) return o`<ha-card><div class="preview">Mushroom Addition preview</div></ha-card>`;
    const t = this.config.entity ? this.hass.states[this.config.entity] : void 0;
    return ai({
      config: this.config,
      descriptor: this.descriptor,
      hass: this.hass,
      entity: t,
      forecast: this.forecast,
      actionSurface: this.actionSurface,
      service: (a, r, i) => {
        this.hass?.callService(a, r, i);
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
      const r = await this.hass.connection.subscribeMessage((i) => {
        a !== this.forecastGeneration || t !== this.forecastSubscriptionKey || (this.forecast = i.forecast ?? [], this.requestUpdate());
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
    const a = t === "tap_action" ? "tap" : t === "hold_action" ? "hold" : "double_tap";
    Yt(this, this.config, a);
  }
};
De.styles = ga;
let B = De;
_t([
  _e({ attribute: !1 })
], B.prototype, "hass");
_t([
  _e({ attribute: !1 })
], B.prototype, "config");
const ii = (e, t, a = [], r = []) => {
  const i = [...a, ...r, ...Object.keys(t?.states ?? {})], n = [...new Set(i)].filter((s) => t?.states?.[s] !== void 0);
  for (const s of e.preferredDomains ?? []) {
    const c = n.find((u) => u.startsWith(`${s}.`));
    if (c) return c;
  }
  return n[0];
}, ni = (e) => e.name.replace(/ (Card|Chip)$/, ""), oi = (e, t, a = [], r = []) => {
  const i = ii(e, t, a, r), n = ["text", "navigation"].includes(e.family), c = e.upstreamId === "custom_card_playstation" && i?.toLowerCase().includes("xbox") ? "xbox" : e.variants?.[0], u = i?.split(".", 1)[0], g = ["light", "switch", "input_boolean", "fan"].includes(u ?? "") ? { action: "toggle" } : { action: i ? "more-info" : "none" };
  return {
    ...ut(e, t, i),
    name: i ? t?.states[i]?.attributes.friendly_name : ni(e),
    secondary: i ? void 0 : n ? "Example" : "Preview",
    variant: c,
    tap_action: g,
    show_controls: ["climate", "media", "cover", "vacuum", "control"].includes(e.family) ? !0 : void 0,
    show_forecast: e.family === "weather",
    show_graph: ["battery", "energy", "sensor"].includes(e.family),
    ulm_card_light_enable_slider: e.family === "light" ? !0 : void 0,
    ulm_card_light_enable_color: e.family === "light" ? !0 : void 0,
    ulm_custom_card_bar_card_value: e.family === "bar" ? !0 : void 0,
    entities: e.variants?.includes("with-sensors") ? r.slice(0, 2) : void 0
  };
}, si = "1.4.0";
for (const e of he)
  if (!customElements.get(e.tag)) {
    const t = e;
    class a extends B {
      constructor() {
        super(...arguments), this.descriptor = t;
      }
      static getStubConfig(i, n = [], s = []) {
        return oi(t, i, n, s);
      }
    }
    customElements.define(e.tag, a);
  }
for (const e of Ie) {
  if (customElements.get(e.tag)) continue;
  const t = pe.find((n) => n.upstreamId === e.targetId);
  if (!t) throw new Error(`Missing alias target ${e.targetId}.`);
  const a = t, r = e.variant;
  class i extends B {
    constructor() {
      super(...arguments), this.descriptor = a;
    }
    setConfig(s) {
      super.setConfig({ ...s, variant: s.variant ?? r });
    }
  }
  customElements.define(e.tag, i);
}
window.customCards = window.customCards || [];
const li = new Set(window.customCards.map((e) => e.type));
for (const e of he)
  li.has(e.tag) || window.customCards.push({
    type: e.tag,
    name: `Mushroom Addition: ${e.name}`,
    description: e.description,
    preview: !0,
    documentationURL: "https://github.com/snfx-johaver/mushroom-cards-addition"
  });
console.info(
  `%c MUSHROOM-CARDS-ADDITION %c ${si} · ${he.length} components `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;"
);
export {
  he as CATALOG
};
//# sourceMappingURL=mushroom-cards-addition.js.map
