const At = globalThis, oo = At.ShadowRoot && (At.ShadyCSS === void 0 || At.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ao = /* @__PURE__ */ Symbol(), zo = /* @__PURE__ */ new WeakMap();
let ga = class {
  constructor(t, o, a) {
    if (this._$cssResult$ = !0, a !== ao) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = o;
  }
  get styleSheet() {
    let t = this.o;
    const o = this.t;
    if (oo && t === void 0) {
      const a = o !== void 0 && o.length === 1;
      a && (t = zo.get(o)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), a && zo.set(o, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ur = (e) => new ga(typeof e == "string" ? e : e + "", void 0, ao), Be = (e, ...t) => {
  const o = e.length === 1 ? e[0] : t.reduce((a, r, n) => a + ((i) => {
    if (i._$cssResult$ === !0) return i.cssText;
    if (typeof i == "number") return i;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new ga(o, e, ao);
}, mr = (e, t) => {
  if (oo) e.adoptedStyleSheets = t.map((o) => o instanceof CSSStyleSheet ? o : o.styleSheet);
  else for (const o of t) {
    const a = document.createElement("style"), r = At.litNonce;
    r !== void 0 && a.setAttribute("nonce", r), a.textContent = o.cssText, e.appendChild(a);
  }
}, To = oo ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let o = "";
  for (const a of t.cssRules) o += a.cssText;
  return ur(o);
})(e) : e;
const { is: _r, defineProperty: pr, getOwnPropertyDescriptor: hr, getOwnPropertyNames: gr, getOwnPropertySymbols: yr, getPrototypeOf: br } = Object, Tt = globalThis, Oo = Tt.trustedTypes, fr = Oo ? Oo.emptyScript : "", vr = Tt.reactiveElementPolyfillSupport, st = (e, t) => e, It = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? fr : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let o = e;
  switch (t) {
    case Boolean:
      o = e !== null;
      break;
    case Number:
      o = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        o = JSON.parse(e);
      } catch {
        o = null;
      }
  }
  return o;
} }, ro = (e, t) => !_r(e, t), Do = { attribute: !0, type: String, converter: It, reflect: !1, useDefault: !1, hasChanged: ro };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Tt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let Ue = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, o = Do) {
    if (o.state && (o.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((o = Object.create(o)).wrapped = !0), this.elementProperties.set(t, o), !o.noAccessor) {
      const a = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(t, a, o);
      r !== void 0 && pr(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, o, a) {
    const { get: r, set: n } = hr(this.prototype, t) ?? { get() {
      return this[o];
    }, set(i) {
      this[o] = i;
    } };
    return { get: r, set(i) {
      const l = r?.call(this);
      n?.call(this, i), this.requestUpdate(t, l, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Do;
  }
  static _$Ei() {
    if (this.hasOwnProperty(st("elementProperties"))) return;
    const t = br(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(st("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(st("properties"))) {
      const o = this.properties, a = [...gr(o), ...yr(o)];
      for (const r of a) this.createProperty(r, o[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const o = litPropertyMetadata.get(t);
      if (o !== void 0) for (const [a, r] of o) this.elementProperties.set(a, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [o, a] of this.elementProperties) {
      const r = this._$Eu(o, a);
      r !== void 0 && this._$Eh.set(r, o);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const o = [];
    if (Array.isArray(t)) {
      const a = new Set(t.flat(1 / 0).reverse());
      for (const r of a) o.unshift(To(r));
    } else t !== void 0 && o.push(To(t));
    return o;
  }
  static _$Eu(t, o) {
    const a = o.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof t == "string" ? t.toLowerCase() : void 0;
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
    const t = /* @__PURE__ */ new Map(), o = this.constructor.elementProperties;
    for (const a of o.keys()) this.hasOwnProperty(a) && (t.set(a, this[a]), delete this[a]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return mr(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, o, a) {
    this._$AK(t, a);
  }
  _$ET(t, o) {
    const a = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, a);
    if (r !== void 0 && a.reflect === !0) {
      const n = (a.converter?.toAttribute !== void 0 ? a.converter : It).toAttribute(o, a.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, o) {
    const a = this.constructor, r = a._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = a.getPropertyOptions(r), i = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : It;
      this._$Em = r;
      const l = i.fromAttribute(o, n.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, o, a, r = !1, n) {
    if (t !== void 0) {
      const i = this.constructor;
      if (r === !1 && (n = this[t]), a ??= i.getPropertyOptions(t), !((a.hasChanged ?? ro)(n, o) || a.useDefault && a.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(i._$Eu(t, a)))) return;
      this.C(t, o, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, o, { useDefault: a, reflect: r, wrapped: n }, i) {
    a && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, i ?? o ?? this[t]), n !== !0 || i !== void 0) || (this._$AL.has(t) || (this.hasUpdated || a || (o = void 0), this._$AL.set(t, o)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (o) {
      Promise.reject(o);
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
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [r, n] of a) {
        const { wrapped: i } = n, l = this[r];
        i !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, n, l);
      }
    }
    let t = !1;
    const o = this._$AL;
    try {
      t = this.shouldUpdate(o), t ? (this.willUpdate(o), this._$EO?.forEach((a) => a.hostUpdate?.()), this.update(o)) : this._$EM();
    } catch (a) {
      throw t = !1, this._$EM(), a;
    }
    t && this._$AE(o);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((o) => o.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq &&= this._$Eq.forEach((o) => this._$ET(o, this[o])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
Ue.elementStyles = [], Ue.shadowRootOptions = { mode: "open" }, Ue[st("elementProperties")] = /* @__PURE__ */ new Map(), Ue[st("finalized")] = /* @__PURE__ */ new Map(), vr?.({ ReactiveElement: Ue }), (Tt.reactiveElementVersions ??= []).push("2.1.2");
const no = globalThis, No = (e) => e, Et = no.trustedTypes, Lo = Et ? Et.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ya = "$lit$", Ee = `lit$${Math.random().toFixed(9).slice(2)}$`, ba = "?" + Ee, wr = `<${ba}>`, Re = document, _t = () => Re.createComment(""), pt = (e) => e === null || typeof e != "object" && typeof e != "function", io = Array.isArray, $r = (e) => io(e) || typeof e?.[Symbol.iterator] == "function", Bt = `[ 	
\f\r]`, et = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Vo = /-->/g, Ho = />/g, Oe = RegExp(`>|${Bt}(?:([^\\s"'>=/]+)(${Bt}*=${Bt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ro = /'/g, jo = /"/g, fa = /^(?:script|style|textarea|title)$/i, va = (e) => (t, ...o) => ({ _$litType$: e, strings: t, values: o }), d = va(1), K = va(2), je = /* @__PURE__ */ Symbol.for("lit-noChange"), p = /* @__PURE__ */ Symbol.for("lit-nothing"), Fo = /* @__PURE__ */ new WeakMap(), Ve = Re.createTreeWalker(Re, 129);
function wa(e, t) {
  if (!io(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Lo !== void 0 ? Lo.createHTML(t) : t;
}
const xr = (e, t) => {
  const o = e.length - 1, a = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", i = et;
  for (let l = 0; l < o; l++) {
    const s = e[l];
    let c, u, _ = -1, m = 0;
    for (; m < s.length && (i.lastIndex = m, u = i.exec(s), u !== null); ) m = i.lastIndex, i === et ? u[1] === "!--" ? i = Vo : u[1] !== void 0 ? i = Ho : u[2] !== void 0 ? (fa.test(u[2]) && (r = RegExp("</" + u[2], "g")), i = Oe) : u[3] !== void 0 && (i = Oe) : i === Oe ? u[0] === ">" ? (i = r ?? et, _ = -1) : u[1] === void 0 ? _ = -2 : (_ = i.lastIndex - u[2].length, c = u[1], i = u[3] === void 0 ? Oe : u[3] === '"' ? jo : Ro) : i === jo || i === Ro ? i = Oe : i === Vo || i === Ho ? i = et : (i = Oe, r = void 0);
    const h = i === Oe && e[l + 1].startsWith("/>") ? " " : "";
    n += i === et ? s + wr : _ >= 0 ? (a.push(c), s.slice(0, _) + ya + s.slice(_) + Ee + h) : s + Ee + (_ === -2 ? l : h);
  }
  return [wa(e, n + (e[o] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), a];
};
class ht {
  constructor({ strings: t, _$litType$: o }, a) {
    let r;
    this.parts = [];
    let n = 0, i = 0;
    const l = t.length - 1, s = this.parts, [c, u] = xr(t, o);
    if (this.el = ht.createElement(c, a), Ve.currentNode = this.el.content, o === 2 || o === 3) {
      const _ = this.el.content.firstChild;
      _.replaceWith(..._.childNodes);
    }
    for (; (r = Ve.nextNode()) !== null && s.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const _ of r.getAttributeNames()) if (_.endsWith(ya)) {
          const m = u[i++], h = r.getAttribute(_).split(Ee), y = /([.?@])?(.*)/.exec(m);
          s.push({ type: 1, index: n, name: y[2], strings: h, ctor: y[1] === "." ? kr : y[1] === "?" ? Mr : y[1] === "@" ? Ar : Ot }), r.removeAttribute(_);
        } else _.startsWith(Ee) && (s.push({ type: 6, index: n }), r.removeAttribute(_));
        if (fa.test(r.tagName)) {
          const _ = r.textContent.split(Ee), m = _.length - 1;
          if (m > 0) {
            r.textContent = Et ? Et.emptyScript : "";
            for (let h = 0; h < m; h++) r.append(_[h], _t()), Ve.nextNode(), s.push({ type: 2, index: ++n });
            r.append(_[m], _t());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ba) s.push({ type: 2, index: n });
      else {
        let _ = -1;
        for (; (_ = r.data.indexOf(Ee, _ + 1)) !== -1; ) s.push({ type: 7, index: n }), _ += Ee.length - 1;
      }
      n++;
    }
  }
  static createElement(t, o) {
    const a = Re.createElement("template");
    return a.innerHTML = t, a;
  }
}
function Xe(e, t, o = e, a) {
  if (t === je) return t;
  let r = a !== void 0 ? o._$Co?.[a] : o._$Cl;
  const n = pt(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, o, a)), a !== void 0 ? (o._$Co ??= [])[a] = r : o._$Cl = r), r !== void 0 && (t = Xe(e, r._$AS(e, t.values), r, a)), t;
}
class Sr {
  constructor(t, o) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = o;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: o }, parts: a } = this._$AD, r = (t?.creationScope ?? Re).importNode(o, !0);
    Ve.currentNode = r;
    let n = Ve.nextNode(), i = 0, l = 0, s = a[0];
    for (; s !== void 0; ) {
      if (i === s.index) {
        let c;
        s.type === 2 ? c = new Ze(n, n.nextSibling, this, t) : s.type === 1 ? c = new s.ctor(n, s.name, s.strings, this, t) : s.type === 6 && (c = new Cr(n, this, t)), this._$AV.push(c), s = a[++l];
      }
      i !== s?.index && (n = Ve.nextNode(), i++);
    }
    return Ve.currentNode = Re, r;
  }
  p(t) {
    let o = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(t, a, o), o += a.strings.length - 2) : a._$AI(t[o])), o++;
  }
}
class Ze {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, o, a, r) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = o, this._$AM = a, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const o = this._$AM;
    return o !== void 0 && t?.nodeType === 11 && (t = o.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, o = this) {
    t = Xe(this, t, o), pt(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== je && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : $r(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && pt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Re.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: o, _$litType$: a } = t, r = typeof a == "number" ? this._$AC(t) : (a.el === void 0 && (a.el = ht.createElement(wa(a.h, a.h[0]), this.options)), a);
    if (this._$AH?._$AD === r) this._$AH.p(o);
    else {
      const n = new Sr(r, this), i = n.u(this.options);
      n.p(o), this.T(i), this._$AH = n;
    }
  }
  _$AC(t) {
    let o = Fo.get(t.strings);
    return o === void 0 && Fo.set(t.strings, o = new ht(t)), o;
  }
  k(t) {
    io(this._$AH) || (this._$AH = [], this._$AR());
    const o = this._$AH;
    let a, r = 0;
    for (const n of t) r === o.length ? o.push(a = new Ze(this.O(_t()), this.O(_t()), this, this.options)) : a = o[r], a._$AI(n), r++;
    r < o.length && (this._$AR(a && a._$AB.nextSibling, r), o.length = r);
  }
  _$AR(t = this._$AA.nextSibling, o) {
    for (this._$AP?.(!1, !0, o); t !== this._$AB; ) {
      const a = No(t).nextSibling;
      No(t).remove(), t = a;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Ot {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, o, a, r, n) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = o, this._$AM = r, this.options = n, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = p;
  }
  _$AI(t, o = this, a, r) {
    const n = this.strings;
    let i = !1;
    if (n === void 0) t = Xe(this, t, o, 0), i = !pt(t) || t !== this._$AH && t !== je, i && (this._$AH = t);
    else {
      const l = t;
      let s, c;
      for (t = n[0], s = 0; s < n.length - 1; s++) c = Xe(this, l[a + s], o, s), c === je && (c = this._$AH[s]), i ||= !pt(c) || c !== this._$AH[s], c === p ? t = p : t !== p && (t += (c ?? "") + n[s + 1]), this._$AH[s] = c;
    }
    i && !r && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class kr extends Ot {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Mr extends Ot {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Ar extends Ot {
  constructor(t, o, a, r, n) {
    super(t, o, a, r, n), this.type = 5;
  }
  _$AI(t, o = this) {
    if ((t = Xe(this, t, o, 0) ?? p) === je) return;
    const a = this._$AH, r = t === p && a !== p || t.capture !== a.capture || t.once !== a.once || t.passive !== a.passive, n = t !== p && (a === p || r);
    r && this.element.removeEventListener(this.name, this, a), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Cr {
  constructor(t, o, a) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = o, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Xe(this, t);
  }
}
const Ir = { I: Ze }, Er = no.litHtmlPolyfillSupport;
Er?.(ht, Ze), (no.litHtmlVersions ??= []).push("3.3.3");
const $a = (e, t, o) => {
  const a = o?.renderBefore ?? t;
  let r = a._$litPart$;
  if (r === void 0) {
    const n = o?.renderBefore ?? null;
    a._$litPart$ = r = new Ze(t.insertBefore(_t(), n), n, void 0, o ?? {});
  }
  return r._$AI(e), r;
};
const so = globalThis;
let $e = class extends Ue {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const o = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = $a(o, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return je;
  }
};
$e._$litElement$ = !0, $e.finalized = !0, so.litElementHydrateSupport?.({ LitElement: $e });
const Pr = so.litElementPolyfillSupport;
Pr?.({ LitElement: $e });
(so.litElementVersions ??= []).push("4.2.2");
const xa = (e) => (t, o) => {
  o !== void 0 ? o.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const zr = { attribute: !0, type: String, converter: It, reflect: !1, hasChanged: ro }, Tr = (e = zr, t, o) => {
  const { kind: a, metadata: r } = o;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), a === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(o.name, e), a === "accessor") {
    const { name: i } = o;
    return { set(l) {
      const s = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(i, s, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(i, void 0, e, l), l;
    } };
  }
  if (a === "setter") {
    const { name: i } = o;
    return function(l) {
      const s = this[i];
      t.call(this, l), this.requestUpdate(i, s, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function he(e) {
  return (t, o) => typeof o == "object" ? Tr(e, t, o) : ((a, r, n) => {
    const i = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, a), i ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, o);
}
function re(e) {
  return he({ ...e, state: !0, attribute: !1 });
}
const Or = [
  "battery",
  "room",
  "scenes",
  "welcome_scenes"
], Dr = [
  "trash",
  "alarm_time",
  "roomview",
  "welcome",
  "washer",
  "sun",
  "input_datetime",
  "media_player_sonos",
  "printer",
  "nas_metrics",
  "tablet",
  "playstation",
  "scenes",
  "plant",
  "speedtest_gauges",
  "pollen"
], Bo = (e) => e.split("_").filter((t) => t.toLowerCase() !== "ulm").map((t) => ["nas", "mdi", "dwd", "vnc", "wifi", "http"].includes(t.toLowerCase()) ? t.toUpperCase() : `${t[0].toUpperCase()}${t.slice(1)}`).join(" "), Nr = (e) => e === "custom_card_alarm_time" ? "alarm-time" : /alarm|alert|lock/.test(e) ? "security" : /navigate|back/.test(e) ? "navigation" : /battery/.test(e) ? "battery" : /power_outlet|more_power_outlet/.test(e) ? "control" : /energy|power|gauge|speedtest|graph|apex|myenedis/.test(e) ? "energy" : /weather|sun|pollen|moon/.test(e) ? "weather" : /scene/.test(e) ? "scene" : /person|tracker|tracer|presence|room|welcome/.test(e) ? "presence" : /media|playstation/.test(e) ? "media" : /thermostat|heat_pump|aircondition|temperature|simple_temp/.test(e) ? "climate" : /cover|door|garage/.test(e) ? "cover" : /vacuum/.test(e) ? "vacuum" : /light/.test(e) ? "light" : /fan|outlet|boolean|script|washer|water_heater|qubino/.test(e) ? "control" : /input_number|input_datetime/.test(e) ? "sensor" : /title|subtitle|clock|date/.test(e) ? "text" : /camera/.test(e) ? "camera" : /sensor|elapsed|update|printer|nas|tablet|flower|car|afval|waste|counter/.test(e) ? "sensor" : "entity", Lr = {
  card_room: ["default", "with-sensors"],
  card_scenes: ["list", "welcome"]
}, Vr = (e, t) => e === "custom_card_alarm_time" ? ["input_boolean"] : /alarm/.test(e) ? ["alarm_control_panel"] : /lock/.test(e) ? ["lock"] : /power_outlet|more_power_outlet/.test(e) ? ["switch", "light"] : e.includes("binary_sensor") ? ["binary_sensor"] : e.includes("battery") ? ["sensor"] : e.includes("input_boolean") ? ["input_boolean"] : e.includes("input_number") ? ["input_number", "counter", "select", "input_select"] : e.includes("input_datetime") ? ["input_datetime"] : e.includes("light") ? ["light"] : /media|playstation/.test(e) ? ["media_player", "sensor"] : /thermostat|heat_pump|aircondition/.test(e) ? ["climate"] : /scene/.test(e) ? ["scene"] : /script/.test(e) ? ["script"] : /vacuum/.test(e) ? ["vacuum"] : /weather/.test(e) ? ["weather"] : /person/.test(e) ? ["person", "device_tracker"] : /cover|door|garage/.test(e) ? ["cover", "binary_sensor"] : /fan/.test(e) ? ["fan"] : /camera/.test(e) ? ["camera"] : /lock/.test(e) ? ["lock"] : /update/.test(e) ? ["update"] : t === "battery" || t === "energy" || t === "sensor" || t === "weather" ? ["sensor"] : t === "control" ? /fan/.test(e) ? ["fan"] : /script/.test(e) ? ["script"] : /washer/.test(e) ? ["switch", "sensor"] : /water_heater/.test(e) ? ["water_heater"] : ["switch", "input_boolean", "light"] : t === "presence" ? ["person", "device_tracker"] : ["sensor", "switch"], Yt = (e, t) => {
  const o = e.replace(/^custom_(card|chip)_/, "").replace(/^(card|chip)_/, ""), a = e.replaceAll("_", "-").toLowerCase(), r = e === "custom_card_playstation" ? "mushroom-addition-custom-card-game-console" : a.startsWith("custom-card-") ? `mushroom-addition-${a}` : `mushroom-addition-card-${a.replace(/^card-/, "")}`, n = Nr(e), i = e === "custom_card_playstation", l = {
    custom_card_trash: "Trash",
    custom_card_printer: "Printer",
    custom_card_washer: "Washer-Dryer",
    custom_card_nas_metrics: "NAS",
    custom_card_tablet: "Tablet",
    custom_card_plant: "Flower",
    custom_card_pollen: "Pollen",
    custom_card_sun: "Astronomy",
    custom_card_entity_carousel: "Entity Carousel",
    custom_card_media_player_sonos: "Media Player Advanced"
  }, s = {
    custom_card_trash: "Mushroom-style trash collection schedule card.",
    custom_card_printer: "Mushroom-style printer status and toner level card.",
    custom_card_washer: "Mushroom-style washer and dryer program, progress, power, status, and remote control card.",
    custom_card_tablet: "Mushroom-style tablet status and maintenance card.",
    custom_card_plant: "Mushroom-style plant health card.",
    custom_card_pollen: "Mushroom-style pollen level card.",
    custom_card_sun: "Mushroom-style Sun and Moon position, phase, timing, and ephemeris card.",
    custom_card_entity_carousel: "Dependency-free swipeable entity and action carousel with cover-flow navigation.",
    custom_card_media_player_sonos: "Advanced media player with artwork, playback, volume, power or standby controls, shortcuts and optional Sonos sound settings."
  };
  return {
    upstreamId: e,
    sourcePath: t,
    kind: "card",
    category: e.startsWith("custom_") ? "custom-card" : "default-card",
    family: n,
    tag: r,
    name: i ? "Game Console Card" : e === "custom_card_nas_metrics" ? "NAS Card" : `${l[e] ?? Bo(o)} Card`,
    description: i ? "Mushroom-style Xbox, PlayStation, and Nintendo profile, activity, artwork, and control card." : e === "custom_card_nas_metrics" ? "Mushroom-style NAS status and utilization card." : s[e] ?? `Mushroom-style ${Bo(o).toLowerCase()} card.`,
    variants: Lr[e],
    variantLabels: void 0,
    preferredDomains: Vr(e, n)
  };
}, Sa = [
  ...Or.map((e) => {
    const t = {
      scenes: "reference_catalog/cards/card_scenes_welcome.yaml"
    };
    return Yt(
      `card_${e}`,
      t[e] ?? `reference_catalog/cards/card_${e}.yaml`
    );
  }),
  ...Dr.map((e) => Yt(
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
], Hr = [
  {
    upstreamId: "area_card_advanced",
    sourcePath: "src/area-advanced.ts",
    kind: "card",
    category: "custom-card",
    family: "presence",
    tag: "mushroom-addition-area-card-advanced",
    name: "Area card advanced",
    description: "Installed native Home Assistant Area card and editor, with any-entity controls, per-entity icons, colors and tap behaviors.",
    preferredDomains: []
  },
  Yt("custom_card_entity_carousel", "src/entity-carousel.ts"),
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
], Je = /* @__PURE__ */ new Map();
for (const e of ka)
  for (const t of Object.keys(e.sources)) Je.set(t, e);
const Ma = new Set(ka.map((e) => e.canonical)), Dt = [
  ...Sa.filter((e) => !Je.has(e.upstreamId) || Ma.has(e.upstreamId)).map((e) => {
    const t = Je.get(e.upstreamId);
    return t ? {
      ...e,
      name: t.name ?? e.name,
      description: t.description ?? e.description,
      variants: t.variants,
      variantLabels: t.variantLabels,
      sourceIds: Object.keys(t.sources)
    } : { ...e, sourceIds: [e.upstreamId] };
  }),
  ...Hr.map((e) => ({ ...e, sourceIds: [e.upstreamId] }))
], Rr = Sa.filter((e) => Je.has(e.upstreamId) && !Ma.has(e.upstreamId)).map((e) => {
  const t = Je.get(e.upstreamId), o = Dt.find((a) => a.upstreamId === t.canonical);
  return {
    upstreamId: e.upstreamId,
    tag: e.tag,
    targetId: o.upstreamId,
    targetTag: o.tag,
    variant: t.sources[e.upstreamId]
  };
}), lo = [
  ...Rr,
  {
    upstreamId: "custom_card_playstation",
    tag: "mushroom-addition-custom-card-playstation",
    targetId: "custom_card_playstation",
    targetTag: "mushroom-addition-custom-card-game-console"
  }
], Nt = Dt, co = (e) => Nt.find((t) => t.tag === e) ?? (() => {
  const t = lo.find((o) => o.tag === e);
  return t ? Dt.find((o) => o.tag === t.targetTag) : void 0;
})(), Wo = (e) => Je.get(e)?.sources[e], Xt = [
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
], Aa = (e, t, o = e.enabledByDefault) => ({
  preset: e.preset,
  enabled: o,
  entity: t,
  label: e.label,
  icon: e.icon,
  color: e.color
}), jr = () => Xt.map((e) => Aa(e)), Le = (e) => {
  if (e.waste_streams?.length) return e.waste_streams.map((a) => ({ ...a }));
  const t = e.type.includes("custom-card-trash"), o = Xt.some((a) => a.legacyKey && typeof e[a.legacyKey] == "string");
  return !t && !o ? [] : Xt.map((a, r) => {
    const i = (a.legacyKey && typeof e[a.legacyKey] == "string" ? e[a.legacyKey] : void 0) ?? (r === 0 ? e.entity : void 0);
    return Aa(a, i, i ? !0 : a.enabledByDefault);
  });
}, Fr = (e) => {
  const t = e.type.includes("custom-card-trash"), o = e.today_entity ?? (typeof e.ulm_card_ophaling_vandaag == "string" ? e.ulm_card_ophaling_vandaag : void 0), a = e.tomorrow_entity ?? (typeof e.ulm_card_ophaling_morgen == "string" ? e.ulm_card_ophaling_morgen : void 0);
  if (!t && !o && !a) return e;
  const r = e.waste_streams?.length ? e.waste_streams : Le(e);
  return {
    ...e,
    waste_streams: r.length ? r : e.waste_streams,
    today_entity: o,
    tomorrow_entity: a,
    show_today: e.show_today ?? !!o,
    show_tomorrow: e.show_tomorrow ?? !!a
  };
}, uo = (e) => [
  "icon",
  ...(e?.sourceIds ?? (e ? [e.upstreamId] : [])).flatMap((t) => [`ulm_${t}_icon`, `${t}_icon`])
], ft = (e, t, o, a = "mdi:information-outline") => {
  const r = o || t?.attributes.icon;
  return r || !t ? d`<ha-icon .icon=${r || a}></ha-icon>` : d`<ha-state-icon .hass=${e} .stateObj=${t}
    ._config=${e?.config} ._connection=${e?.connection} ._entities=${e?.entities}></ha-state-icon>`;
}, we = /* @__PURE__ */ new Set([
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
]), A = (e) => {
  if (!e) return "Entity unavailable";
  const t = e.attributes.unit_of_measurement;
  return t ? `${e.state} ${String(t)}` : e.state.replaceAll("_", " ");
}, Go = (e) => {
  if (typeof e == "string") return e;
  const t = Array.isArray(e) ? e : [e];
  return t.every((o) => o.type === "text") ? t.map((o) => o.text ?? "").join(" ") : void 0;
}, ue = (e, t, o) => {
  const a = e.name !== void 0 && typeof e.name != "string";
  return a && t && o?.formatEntityName ? o.formatEntityName(t, e.name) : a ? Go(e.name) || t?.attributes.friendly_name || e.entity || "" : e.name_mode === "none" ? "" : e.name_mode === "entity" ? t?.attributes.friendly_name || e.entity || "" : e.name && t && o?.formatEntityName ? o.formatEntityName(t, e.name) : (e.name ? Go(e.name) : void 0) || t?.attributes.friendly_name || e.entity || "";
}, _e = (e, t, o) => {
  e.dispatchEvent(new CustomEvent(t, {
    bubbles: !0,
    composed: !0,
    detail: o
  }));
}, Ca = (e, t, o) => {
  _e(e, "hass-action", { config: t, action: o });
}, Br = (e) => {
  const t = Ur(e), o = Wr(t), a = String(t.type), r = a.includes("card-title"), n = a.includes("card-welcome-scenes"), i = a.includes("card-weather"), l = a.includes("card-weather-ulm") || t.variant === "native", s = a.includes("custom-card-sun") || a.includes("custom-card-thermostat-controls") ? { action: "none" } : void 0, c = String(o.type).includes("custom-card-qubino") ? o.qubino_more_info_entity ?? o.entity : void 0, u = a.endsWith("custom-card-pollen"), _ = [
    o.download_entity,
    o.upload_entity,
    o.ping_entity
  ].filter((v) => typeof v == "string"), m = String(o.type).includes("speedtest-gauges"), h = o.variant === "divider-title", y = o.variant === "divider-subtitle", w = m ? {
    action: "perform-action",
    perform_action: "homeassistant.update_entity",
    target: { entity_id: _ }
  } : y || h && !o.navigation_path ? { action: "none" } : u ? { action: "none" } : c ? { action: "more-info", entity: c } : o.navigation_path ? { action: "navigate", navigation_path: o.navigation_path } : s ?? { action: r || n ? "none" : o.entity ? "more-info" : "none" }, f = a.includes("card-room") && !a.endsWith("mushroom-addition-card-room") && o.input_select_entity && o.input_select_option ? {
    action: "perform-action",
    perform_action: "input_select.select_option",
    target: { entity_id: o.input_select_entity },
    data: { option: o.input_select_option }
  } : void 0;
  return {
    ...o,
    show_icon: o.show_icon ?? !0,
    show_state: o.show_state ?? !0,
    show_name: o.show_name,
    name_mode: o.primary_info !== void 0 || o.secondary_info !== void 0 ? void 0 : o.name_mode,
    icon_type: o.icon_type ?? (t.use_entity_picture ? "entity-picture" : t.show_icon === !1 ? "none" : /custom-card-(game-console|playstation)$/.test(a) ? "entity-picture" : "icon"),
    layout: o.layout ?? "default",
    fill_container: o.fill_container ?? !1,
    primary_info: o.primary_info,
    secondary_info: o.secondary_info,
    tap_action: o.tap_action ?? w,
    show_controls: o.show_controls ?? (a.includes("card-vacuum") ? !0 : void 0),
    show_forecast: o.show_forecast ?? (i ? !l : void 0),
    hold_action: o.hold_action ?? (String(o.type).includes("water-heater") && o.entity ? { action: "more-info" } : void 0),
    double_tap_action: o.double_tap_action ?? f
  };
}, tt = (e, t) => Object.entries(e).find(([o, a]) => t.test(o) && a !== void 0)?.[1], Wr = (e) => {
  const t = String(e.type).includes("custom-card-roomview"), o = tt(e, t ? /^(?!climate_).*_name$/ : /_name$/), a = co(e.type.replace(/^custom:/, "")), r = uo(a).map((c) => e[c]).find((c) => typeof c == "string" && c), n = tt(e, /_color$/), i = tt(e, /_enable_(controls|buttons)$/), l = tt(e, /_enable_slider$/), s = tt(e, /_enable_horizontal$/);
  return {
    ...e,
    name: e.name ?? (typeof o == "string" ? o : void 0),
    icon: e.icon ?? (typeof r == "string" ? r : void 0),
    icon_color: e.icon_color ?? (typeof n == "string" ? n : void 0),
    navigation_path: e.navigation_path,
    show_controls: e.show_controls ?? (typeof i == "boolean" ? i : typeof l == "boolean" ? l : void 0),
    layout: e.layout ?? (s === !0 ? "horizontal" : void 0)
  };
}, Uo = (e) => {
  const t = { ...e };
  for (const o of uo(co(e.type.replace(/^custom:/, "")))) delete t[o];
  return t;
}, Gr = [
  "ulm_card_media_player_entity",
  "ulm_card_input_number_entity"
], Ia = (e) => {
  if (!e.type.endsWith("mushroom-addition-card-room")) return e;
  const t = { ...e };
  return t.room_light_entity === void 0 && t.room_brightness_entity !== void 0 && (t.room_light_entity = t.room_brightness_entity), delete t.room_brightness_entity, t;
}, Ur = (e) => {
  const t = Fr(Ia(e)), o = t.primary_entity || Gr.map((n) => t[n]).find((n) => typeof n == "string"), a = (n) => {
    if (typeof n == "string") return n;
    if (n && typeof n == "object" && "entity_id" in n && typeof n.entity_id == "string")
      return n.entity_id;
  }, r = {
    ...t,
    entity: t.entity ?? o,
    primary_entity: void 0
  };
  if (String(e.type).includes("card-power-outlet") && (r.consumption_entity ??= a(e.ulm_card_power_outlet_consumption_sensor)), String(e.type).includes("card-room") && !String(e.type).endsWith("mushroom-addition-card-room") && (r.input_select_entity ??= a(e.ulm_input_select), r.input_select_option ??= typeof e.ulm_input_select_option == "string" ? e.ulm_input_select_option : void 0), String(e.type).includes("nas-metrics") && (r.temperature_entity ??= a(e.entity_1), r.memory_entity ??= a(e.entity_2), r.cpu_entity ??= a(e.entity_3), r.disk_entity ??= a(e.entity_4)), String(e.type).includes("tablet") && (r.entity ??= a(e.ulm_custom_card_tablet_main), r.battery_entity ??= a(e.ulm_custom_card_tablet_battery), r.tablet_button_usb_entity ??= a(e.ulm_custom_card_tablet_button1), r.tablet_button_motion_entity ??= a(e.ulm_custom_card_tablet_button2), r.tablet_button_display_entity ??= a(e.ulm_custom_card_tablet_button3), r.tablet_restart_entity ??= a(e.ulm_custom_card_tablet_restart), r.tablet_reload_entity ??= a(e.ulm_custom_card_tablet_reload), r.tablet_maintenance_entity ??= a(e.ulm_custom_card_tablet_maintenance), r.tablet_ram_entity ??= a(e.ulm_custom_card_tablet_par1), r.tablet_disk_entity ??= a(e.ulm_custom_card_tablet_par2), r.tablet_power_entity ??= a(e.ulm_custom_card_tablet_par3)), String(e.type).includes("card-welcome-scenes") && (r.collapse_entity ??= a(e.ulm_card_welcome_scenes_collapse), !r.scene_items)) {
    const n = Array.from({ length: 7 }, (i, l) => {
      const s = e[`entity_${l + 1}`];
      if (!s || typeof s != "object") return;
      const c = s, u = a(c);
      if (u)
        return {
          entity: u,
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
  if (String(e.type).includes("custom-card-washer") && (r.entity ??= a(e.ulm_custom_card_washer_machine_state) ?? a(e.ulm_custom_card_washer_power), r.program_stage_entity ??= a(e.ulm_custom_card_washer_job_state) ?? r.entity, r.washer_power_entity ??= r.power_entity ?? a(e.ulm_custom_card_washer_power), r.power_entity ??= r.washer_power_entity), String(e.type).includes("custom-card-thermostat-controls") && (r.entity ??= a(e.entity), r.variant ??= "buttons"), String(e.type).includes("media-player-sonos") && (r.entity ??= a(e.ulm_card_media_player_with_controls_entity)), String(e.type).includes("printer") && (r.black_entity ??= a(e.ulm_card_printer_black_name), r.yellow_entity ??= a(e.ulm_card_printer_yellow_name), r.magenta_entity ??= a(e.ulm_card_printer_magenta_name), r.cyan_entity ??= a(e.ulm_card_printer_cyan_name)), String(e.type).endsWith("custom-card-pollen") && (r.trees_entity ??= a(e.custom_card_pollen_tree), r.grass_entity ??= a(e.custom_card_pollen_grass), r.weeds_entity ??= a(e.custom_card_pollen_weed)), String(e.type).includes("speedtest-gauges") && (r.download_entity ??= a(e.ulm_custom_card_speedtest_download_speed_entity) ?? r.entity, r.upload_entity ??= a(e.ulm_custom_card_speedtest_upload_speed_entity), r.ping_entity ??= a(e.ulm_custom_card_speedtest_ping_entity), r.entity = a(r.download_entity)), String(e.type).includes("custom-card-scenes") || String(e.type).includes("card-scenes") && e.variant === "scene-grid") {
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
  return String(e.type).includes("plant") && (r.entity ??= a(e.ulm_card_flower_entity), r.ulm_card_flower_entity ??= r.entity), r;
};
var Kr = Object.defineProperty, qr = Object.getOwnPropertyDescriptor, We = (e, t, o, a) => {
  for (var r = a > 1 ? void 0 : a ? qr(t, o) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = (a ? i(t, o, r) : i(r)) || r);
  return a && r && Kr(t, o, r), r;
};
const qe = (e, t) => {
  const o = e?.[`carousel_${t}`];
  if (typeof o == "boolean") return o;
  const a = e?.parameters?.[t];
  return a !== null && typeof a == "object" ? a.enabled !== !1 : a === !0;
}, Yr = /* @__PURE__ */ new Set(["off", "unknown", "unavailable", "none", "idle"]), Wt = (e, t, o, a) => Math.min(a, Math.max(o, typeof e == "number" && Number.isFinite(e) ? e : t));
let Ae = class extends $e {
  constructor() {
    super(...arguments), this.selectedIndex = 0, this.carouselWidth = 0, this.dragOffset = 0, this.dragging = !1, this.horizontalVelocity = 0, this.pointerAxis = "pending", this.holdFired = !1, this.pointerStartedOnItem = !1, this.stopControlEvent = (e) => {
      e.stopPropagation();
    }, this.onPointerDown = (e) => {
      if (e.button !== void 0 && e.button !== 0 || e.pointerType && e.isPrimary === !1) return;
      e.stopPropagation(), this.clearHold(), window.clearTimeout(this.tapTimer), this.dragStartX = e.clientX, this.dragStartY = e.clientY, this.lastPointerX = e.clientX, this.lastPointerTime = e.timeStamp, this.horizontalVelocity = 0, this.pointerAxis = "pending", this.dragOffset = 0, this.dragging = !1, this.holdFired = !1;
      const t = e.composedPath().find((a) => a instanceof HTMLElement && a.matches("button[data-carousel-index]")), o = Number(t?.dataset.carouselIndex);
      this.pointerStartedOnItem = !!t && Number.isInteger(o), this.pointerItemIndex = this.pointerStartedOnItem ? o : this.selectedIndex, this.pointerStartedOnItem && this.pointerItemIndex === this.selectedIndex && (this.holdTimer = window.setTimeout(() => {
        this.clearTap(), this.holdFired = !0, this.runItemAction(this.items[this.pointerItemIndex ?? this.selectedIndex], "hold");
      }, 500));
    }, this.onPointerMove = (e) => {
      if (this.dragStartX === void 0 || this.dragStartY === void 0) return;
      const t = e.clientX - this.dragStartX, o = e.clientY - this.dragStartY;
      if (this.pointerAxis === "pending") {
        if (Math.max(Math.abs(t), Math.abs(o)) < 4) return;
        if (Math.abs(o) > Math.abs(t) * 1.15) {
          this.pointerAxis = "vertical", this.clearTap(), this.clearHold();
          return;
        }
        this.pointerAxis = "horizontal", this.clearTap(), this.dragging = !0, this.clearHold();
        try {
          e.currentTarget.setPointerCapture?.(e.pointerId);
        } catch (r) {
          if (!(r instanceof DOMException)) throw r;
        }
      }
      if (this.pointerAxis !== "horizontal") return;
      e.preventDefault(), e.stopPropagation();
      const a = Math.max(1, e.timeStamp - (this.lastPointerTime ?? e.timeStamp));
      this.horizontalVelocity = (e.clientX - (this.lastPointerX ?? e.clientX)) / a, this.lastPointerX = e.clientX, this.lastPointerTime = e.timeStamp, this.dragOffset = this.constrainDrag(t);
    }, this.onPointerUp = (e) => {
      if (e.stopPropagation(), this.dragStartX === void 0) return;
      const t = e.clientX - this.dragStartX, o = e.clientY - (this.dragStartY ?? e.clientY), a = this.pointerItemIndex ?? this.selectedIndex, r = this.pointerStartedOnItem, n = this.pointerAxis === "horizontal", i = this.pointerAxis === "vertical" || Math.abs(o) > Math.abs(t) * 1.15, l = Math.max(1, e.timeStamp - (this.lastPointerTime ?? e.timeStamp)), s = Math.abs(e.clientX - (this.lastPointerX ?? e.clientX)) > 0 ? (e.clientX - (this.lastPointerX ?? e.clientX)) / l : this.horizontalVelocity;
      if (this.clearHold(), this.resetPointer(), n && (Math.abs(t) >= 10 || Math.abs(s) >= 0.16)) {
        this.select(t > 0 || s > 0 ? -1 : 1);
        return;
      }
      if (this.holdFired) {
        this.holdFired = !1;
        return;
      }
      if (n || i || Math.max(Math.abs(t), Math.abs(o)) >= 6 || !r) {
        this.clearTap();
        return;
      }
      if (a !== this.selectedIndex) {
        this.selectIndex(a);
        return;
      }
      const c = this.items[a];
      this.tapTimer !== void 0 && this.tapItem === c ? (this.clearTap(), this.runItemAction(c, "double_tap")) : c.double_tap_action && !["none", "default"].includes(c.double_tap_action.action) ? (this.clearTap(), this.tapItem = c, this.tapTimer = window.setTimeout(() => {
        this.clearTap(), this.runItemAction(c, "tap");
      }, 300)) : this.runItemAction(c, "tap");
    }, this.cancelPointer = () => {
      this.clearHold(), this.clearTap(), this.holdFired = !1, this.resetPointer();
    }, this.onWheel = (e) => {
      const t = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      Math.abs(t) < 8 || (e.preventDefault(), this.select(t > 0 ? 1 : -1));
    }, this.onKeydown = (e) => {
      if (e.key === "ArrowLeft") this.select(-1);
      else if (e.key === "ArrowRight") this.select(1);
      else if (e.key === "Home") this.selectIndex(0);
      else if (e.key === "End") this.selectIndex(this.items.length - 1);
      else if (e.key === "Enter" || e.key === " ") {
        if (e.stopPropagation(), e.repeat) {
          e.preventDefault();
          return;
        }
        this.clearTap(), this.runItemAction(this.items[this.selectedIndex], "tap");
      } else return;
      e.preventDefault(), e.stopPropagation();
    };
  }
  willUpdate(e) {
    if (e.has("config")) {
      this.clearTap(), this.cancelPointer();
      const t = this.items.length, o = Math.max(0, Math.round(this.config?.carousel_initial_index ?? 0));
      this.selectedIndex = t ? Math.min(o, t - 1) : 0;
    }
  }
  render() {
    const e = this.items;
    if (!e.length)
      return d`<div class="carousel"><span class="label">Add carousel items in the card editor</span></div>`;
    const t = this.visibleCount, o = e[this.selectedIndex], a = this.entityFor(o), r = qe(this.config, "navigation"), n = this.config?.carousel_loop !== !1;
    return d`
      <div class="viewport ${r ? "has-navigation" : ""}"
        style=${`--carousel-button-width:${this.buttonWidth}px;--carousel-button-height:${this.buttonHeight}px;--carousel-stage-height:${this.buttonHeight + 12}px;--carousel-icon-size:${this.iconSize}px;--carousel-picture-size:${Math.min(this.iconSize * 34 / 28, this.maxIconSize)}px`}
        @pointerdown=${this.stopControlEvent} @click=${this.stopControlEvent} @dblclick=${this.stopControlEvent}>
      ${r ? d`<button class="navigation" aria-label="Previous item"
        ?disabled=${e.length < 2 || !n && this.selectedIndex === 0}
        @click=${() => this.select(-1)}><ha-icon icon="mdi:chevron-left"></ha-icon></button>` : p}
      <div class=${`carousel ${this.grabCursor ? "grab-cursor" : ""} ${this.dragging ? "dragging" : ""}`}
        data-effect=${this.effect}
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
          ${e.map((i, l) => this.renderItem(i, l, t))}
        </div>
        ${this.config?.carousel_show_labels === !1 ? p : d`
          <div class="label">
            ${this.itemName(o, a)}
            ${this.showEntityState(a) ? d`<span class="state">${a?.state}</span>` : p}
          </div>
        `}
      </div>
      ${r ? d`<button class="navigation" aria-label="Next item"
        ?disabled=${e.length < 2 || !n && this.selectedIndex === e.length - 1}
        @click=${() => this.select(1)}><ha-icon icon="mdi:chevron-right"></ha-icon></button>` : p}
      </div>
      <div @pointerdown=${this.stopControlEvent} @click=${this.stopControlEvent}
        @dblclick=${this.stopControlEvent} @keydown=${this.stopControlEvent} @keyup=${this.stopControlEvent}>
        ${qe(this.config, "pagination") ? this.renderPagination() : p}
        ${qe(this.config, "scrollbar") ? d`
          <input class="scrollbar" type="range" min="0" max=${e.length - 1} step="1"
            .value=${String(this.selectedIndex)} ?disabled=${e.length < 2}
            aria-label="Carousel position" aria-valuetext=${this.itemName(o, a)}
            @input=${(i) => this.selectIndex(Number(i.currentTarget.value))}>
        ` : p}
      </div>
    `;
  }
  renderPagination() {
    const e = this.config?.parameters?.pagination, t = this.config?.carousel_pagination_type ?? (e && typeof e == "object" ? e.type : void 0) ?? "bullets";
    return d`<div class="pagination ${t}">
      ${t === "fraction" ? d`<output aria-live="polite">${this.selectedIndex + 1} / ${this.items.length}</output>` : t === "progressbar" ? d`<progress aria-label="Carousel progress" value=${this.selectedIndex + 1} max=${this.items.length}></progress>` : this.items.map((o, a) => d`<button class="dot"
            aria-label=${`Go to ${this.itemName(o)}`} aria-current=${a === this.selectedIndex ? "true" : "false"}
            @click=${() => this.selectIndex(a)}></button>`)}
    </div>`;
  }
  renderItem(e, t, o) {
    const a = this.itemOffset(t), r = Math.abs(a), n = this.itemIsHidden(a, o), i = t === this.selectedIndex, l = this.entityFor(e), s = e.color || (l?.attributes.icon, "primary"), c = this.coverflowModifier, u = this.effect === "coverflow" ? this.coverflowStretch * c : 0, _ = Math.max(18, this.buttonWidth + u), m = a + this.dragOffset / _, h = Math.abs(m), w = (this.singleSlideEffect || this.centeredSlides ? 0 : -((o - 1) * _) / 2) + a * _ + this.dragOffset, f = this.effect === "coverflow" ? -h * this.coverflowDepth * c : 0, v = this.effect === "coverflow" ? m * -this.coverflowRotate * c : 0, $ = Math.max(0.18, 1 - h * (this.effect === "coverflow" ? 0.16 : 0.08)), b = this.coverflowSlideShadows ? Math.min(0.48, h * 0.16 * Math.max(0.25, c)) : 0, M = a + Math.max(-1, Math.min(1, this.dragOffset / this.buttonWidth)), j = [
      `transform:${this.effect === "fade" ? "translateX(0px)" : this.effect === "cube" ? `rotateY(${M * 90}deg)` : this.effect === "flip" ? `rotateY(${M * 180}deg)` : `translateX(${w}px) translateZ(${f}px) rotateY(${v}deg)`}`,
      `transform-origin:${this.effect === "cube" ? `50% 50% -${this.buttonWidth / 2}px` : "50% 50%"}`,
      `z-index:${100 - r}`,
      `opacity:${this.effect === "fade" ? Math.max(0, 1 - Math.abs(M)) : this.singleSlideEffect ? 1 : $}`,
      `pointer-events:${this.singleSlideEffect && !i ? "none" : "auto"}`,
      `filter:saturate(${Math.max(0.45, 1 - r * 0.14)})`,
      `--carousel-color:var(--${s}-color, ${s})`,
      `--carousel-shadow-opacity:${b}`,
      `--carousel-shadow-angle:${m < 0 ? 270 : 90}deg`
    ].join(";"), R = e.icon_type === "entity-picture" ? l?.attributes.entity_picture : void 0, Z = l ? !Yr.has(l.state.toLowerCase()) : !1;
    return d`
      <button
        role="option"
        aria-selected=${i ? "true" : "false"}
        aria-label=${this.itemName(e, l)}
        class=${`item ${i ? "active" : ""} ${Z ? "entity-active" : ""}`}
        tabindex=${i ? 0 : -1}
        data-shadow=${this.effect === "coverflow" && this.coverflowSlideShadows ? "true" : "false"}
        data-carousel-index=${t}
        style=${j}
        ?hidden=${n}
        @click=${(C) => {
      C.stopPropagation(), C.detail === 0 && (i ? this.runItemAction(e, "tap") : this.selectIndex(t));
    }}
        >
        ${R ? d`<span class="picture" style=${`background-image:url("${String(R)}")`}></span>` : e.icon ? d`<ha-icon .icon=${e.icon}></ha-icon>` : l ? d`<ha-state-icon .hass=${this.hass} .stateObj=${l}
                  ._config=${this.hass?.config} ._connection=${this.hass?.connection}
                  ._entities=${this.hass?.entities}></ha-state-icon>` : d`<ha-icon .icon=${"mdi:circle"}></ha-icon>`}
      </button>
    `;
  }
  get items() {
    return this.config?.carousel_items ?? [];
  }
  get buttonWidth() {
    const e = Wt(this.config?.carousel_button_width, 58, 32, 160);
    return this.carouselWidth > 0 ? Math.min(e, Math.max(24, this.carouselWidth - 16)) : e;
  }
  get buttonHeight() {
    return Wt(this.config?.carousel_button_height, 58, 32, 160);
  }
  get maxIconSize() {
    return Math.min(this.buttonWidth, this.buttonHeight) - 12;
  }
  get iconSize() {
    return Math.min(Wt(this.config?.carousel_icon_size, 28, 12, 96), this.maxIconSize);
  }
  get visibleCount() {
    if (this.singleSlideEffect) return 1;
    const e = this.config?.carousel_slides_per_view ?? this.config?.parameters?.slidesPerView;
    if (e === "auto")
      return this.carouselWidth ? Math.min(11, Math.max(1, Math.floor((this.carouselWidth - 16) / this.buttonWidth))) : this.legacyVisibleCount;
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
  get singleSlideEffect() {
    return ["fade", "cube", "flip"].includes(this.effect);
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
      const o = this.items.length / 2;
      t > o && (t -= this.items.length), t < -o && (t += this.items.length);
    }
    return t;
  }
  itemIsHidden(e, t) {
    if (this.singleSlideEffect) return Math.abs(e) > 1;
    if (!this.centeredSlides) return e < 0 || e >= t;
    const o = Math.floor((t - 1) / 2), a = Math.ceil((t - 1) / 2);
    return e < -o || e > a;
  }
  updated() {
    const e = this.shadowRoot?.querySelector(".carousel");
    !e || e === this.observedCarousel || (this.resizeObserver?.disconnect(), this.observedCarousel = e, this.carouselWidth = e.clientWidth, !(typeof ResizeObserver > "u") && (this.resizeObserver = new ResizeObserver(([t]) => {
      this.carouselWidth = t.contentRect.width;
    }), this.resizeObserver.observe(e)));
  }
  disconnectedCallback() {
    this.cancelPointer(), this.clearTap(), this.resizeObserver?.disconnect(), this.resizeObserver = void 0, this.observedCarousel = void 0, super.disconnectedCallback();
  }
  select(e) {
    this.clearTap();
    const t = this.items.length;
    if (!t) return;
    const o = this.selectedIndex + e;
    this.selectedIndex = this.config?.carousel_loop === !1 ? Math.min(t - 1, Math.max(0, o)) : (o + t) % t;
  }
  selectIndex(e) {
    this.clearTap(), this.selectedIndex = Math.min(this.items.length - 1, Math.max(0, e));
  }
  constrainDrag(e) {
    if (this.config?.carousel_loop !== !1) return e;
    const t = this.selectedIndex === 0 && e > 0, o = this.selectedIndex === this.items.length - 1 && e < 0;
    return t || o ? e * 0.28 : e;
  }
  resetPointer() {
    this.dragStartX = void 0, this.dragStartY = void 0, this.lastPointerX = void 0, this.lastPointerTime = void 0, this.horizontalVelocity = 0, this.pointerAxis = "pending", this.pointerItemIndex = void 0, this.pointerStartedOnItem = !1, this.dragOffset = 0, this.dragging = !1;
  }
  clearHold() {
    this.holdTimer !== void 0 && window.clearTimeout(this.holdTimer), this.holdTimer = void 0;
  }
  clearTap() {
    window.clearTimeout(this.tapTimer), this.tapTimer = void 0, this.tapItem = void 0;
  }
  runItemAction(e, t) {
    if (!e) return;
    const o = e[`${t}_action`], a = o && o.action !== "default" ? o : {
      action: t === "tap" && e.entity ? "more-info" : "none"
    };
    _e(this, "hass-action", {
      config: {
        type: this.config?.type,
        entity: e.entity,
        [`${t}_action`]: a
      },
      action: t
    });
  }
};
Ae.styles = Be`
    :host { display: block; min-width: 0; }
    .carousel {
      position: relative;
      display: grid;
      place-items: center;
      padding: 6px 0;
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
      height: var(--carousel-stage-height, 70px);
      transform-style: preserve-3d;
    }
    .item {
      position: absolute;
      top: 50%;
      left: 50%;
      display: grid;
      place-items: center;
      width: var(--carousel-button-width, 58px);
      height: var(--carousel-button-height, 58px);
      margin: calc(var(--carousel-button-height, 58px) / -2) calc(var(--carousel-button-width, 58px) / -2);
      padding: 0;
      border: 0;
      border-radius: 18px;
      color: var(--primary-text-color);
      background:
        linear-gradient(145deg, color-mix(in srgb, var(--card-background-color) 92%, white 8%),
        color-mix(in srgb, var(--card-background-color) 86%, black 14%));
      box-shadow: 0 5px 16px rgb(0 0 0 / 28%);
      transition: transform 270ms cubic-bezier(.2,.8,.2,1), opacity 270ms ease, filter 110ms ease;
      cursor: pointer;
      transform-style: preserve-3d;
      backface-visibility: hidden;
      will-change: transform;
    }
    .item::after {
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
    .item[data-shadow="false"]::after { display: none; }
    .item.active {
      color: var(--carousel-color, var(--primary-color));
    }
    .item.entity-active {
      background:
        linear-gradient(145deg,
          color-mix(in srgb, var(--carousel-color, var(--primary-color)) 28%, var(--card-background-color)),
          color-mix(in srgb, var(--carousel-color, var(--primary-color)) 12%, var(--card-background-color)));
    }
    .item[hidden] { display: none; }
    button:focus-visible, input:focus-visible, .carousel:focus-visible {
      outline: 2px solid var(--primary-color); outline-offset: 2px;
    }
    .viewport.has-navigation { display: grid; grid-template-columns: 32px minmax(0, 1fr) 32px; align-items: center; gap: 4px; }
    .navigation {
      width: 32px; height: 32px; padding: 0; display: grid; place-items: center;
      border: 0; border-radius: 12px; background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color); cursor: pointer;
    }
    .navigation:disabled { opacity: .35; cursor: default; }
    .navigation ha-icon { --mdc-icon-size: 22px; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 2px; padding: 0 8px; }
    .pagination.bullets { overflow-x: auto; }
    .dot {
      flex: 0 0 24px; width: 24px; height: 24px; border: 0; padding: 0;
      display: grid; place-items: center; background: transparent; cursor: pointer;
    }
    .dot::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--secondary-text-color); opacity: .4; }
    .dot[aria-current="true"]::before { background: var(--primary-color); opacity: 1; }
    .pagination output { font-size: 12px; color: var(--secondary-text-color); line-height: 24px; }
    .pagination progress { width: 100%; height: 5px; margin: 8px 0; accent-color: var(--primary-color); }
    .scrollbar { display: block; box-sizing: border-box; width: calc(100% - 16px); height: 20px; margin: 0 8px; accent-color: var(--primary-color); cursor: pointer; }
    @media (prefers-reduced-motion: reduce) { .item { transition: none; } }
    .item ha-icon, .item ha-state-icon { --mdc-icon-size: var(--carousel-icon-size, 28px); pointer-events: none; }
    .picture {
      width: var(--carousel-picture-size, 34px);
      height: var(--carousel-picture-size, 34px);
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
We([
  he({ attribute: !1 })
], Ae.prototype, "hass", 2);
We([
  he({ attribute: !1 })
], Ae.prototype, "config", 2);
We([
  re()
], Ae.prototype, "selectedIndex", 2);
We([
  re()
], Ae.prototype, "carouselWidth", 2);
We([
  re()
], Ae.prototype, "dragOffset", 2);
We([
  re()
], Ae.prototype, "dragging", 2);
Ae = We([
  xa("mushroom-addition-entity-carousel")
], Ae);
const ie = {
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
}, Ea = [
  { configKey: "crossfade_entity", domain: "switch", suffix: "crossfade", label: "Crossfade", icon: "mdi:swap-horizontal" },
  { configKey: "night_sound_entity", domain: "switch", suffix: "night_sound", label: "Night sound", icon: "mdi:weather-night" },
  { configKey: "speech_enhancement_entity", domain: "switch", suffix: "speech_enhancement", label: "Speech enhancement", icon: "mdi:ear-hearing" },
  { configKey: "subwoofer_entity", domain: "switch", suffix: "subwoofer_enabled", label: "Subwoofer", icon: "mdi:speaker-wireless" },
  { configKey: "surrounds_entity", domain: "switch", suffix: "surround_enabled", label: "Surrounds", icon: "mdi:surround-sound" },
  { configKey: "loudness_entity", domain: "switch", suffix: "loudness", label: "Loudness", icon: "mdi:bullhorn" },
  { configKey: "surround_full_entity", domain: "switch", suffix: "surround_music_full_volume", label: "Surround full", icon: "mdi:music-note-plus" }
], Pa = [
  { configKey: "audio_delay_entity", domain: "number", suffix: "audio_delay", label: "Audio delay", icon: "mdi:tune-variant" },
  { configKey: "balance_entity", domain: "number", suffix: "balance", label: "Balance", icon: "mdi:tune-variant" },
  { configKey: "bass_entity", domain: "number", suffix: "bass", label: "Bass", icon: "mdi:tune-variant" },
  { configKey: "treble_entity", domain: "number", suffix: "treble", label: "Treble", icon: "mdi:tune-variant" },
  { configKey: "sub_gain_entity", domain: "number", suffix: "sub_gain", label: "Sub gain", icon: "mdi:tune-variant" },
  { configKey: "surround_level_entity", domain: "number", suffix: "surround_level", label: "Surround level", icon: "mdi:tune-variant" },
  { configKey: "music_surround_level_entity", domain: "number", suffix: "music_surround_level", label: "Surround level music", icon: "mdi:tune-variant" }
], mo = [...Ea, ...Pa], _o = (e) => e.split(".", 2)[1] ?? e, Ko = (e) => _o(e).replace(/_\d+$/, ""), za = (e, t) => {
  if (!e.startsWith(`${t.domain}.`)) return !1;
  const o = _o(e);
  return t.suffix === "surround_level" && o.endsWith("_music_surround_level") ? !1 : o === t.suffix || o.endsWith(`_${t.suffix}`);
}, qo = (e) => mo.filter((t) => e.some((o) => za(o, t))).length, po = (e, t, o) => {
  if (!e || !t) return {};
  const a = Object.keys(e.states), r = e.entities ?? {}, n = Ko(t), i = [.../* @__PURE__ */ new Set([t, ...a.filter((m) => m.startsWith("media_player.") && Ko(m) === n)])], c = [...new Set(i.map((m) => r[m]?.device_id).filter((m) => typeof m == "string" && m.length > 0))].map((m) => a.filter((h) => r[h]?.device_id === m)).sort((m, h) => qo(h) - qo(m))[0] ?? [], u = a.filter((m) => {
    const h = m.split(".", 1)[0], y = _o(m);
    return ["switch", "number"].includes(h) && (y === n || y.startsWith(`${n}_`));
  }), _ = [.../* @__PURE__ */ new Set([...c, ...u])];
  return Object.fromEntries(mo.flatMap((m) => {
    const h = o?.[m.configKey];
    if (typeof h == "string" && h.length > 0) return [[m.configKey, h]];
    const y = _.find((w) => za(w, m));
    return y ? [[m.configKey, y]] : [];
  }));
}, Yo = (e, t) => Object.keys(po(e, t)).length, Ta = [
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
], Jt = (e) => e.split(".", 2)[1] ?? e, Oa = (e) => e.toLowerCase().replace(/[^a-z0-9]+/g, "_"), Xr = (e, t, o) => {
  const a = t.split(".", 1)[0];
  if (!o.domains.includes(a)) return !1;
  const r = e?.states[t], n = Oa([
    Jt(t),
    r?.attributes.friendly_name
  ].filter(Boolean).join(" "));
  return o.terms.some((i) => n.includes(i));
}, ho = (e, t, o) => {
  if (!e || !t) return {};
  const a = e.entities?.[t]?.device_id, n = Jt(t).split(/_(?:console|status|online|power)$/)[0], i = Object.keys(e.states).filter((l) => {
    const s = a && e.entities?.[l]?.device_id === a, c = Jt(l);
    return s || c === n || c.startsWith(`${n}_`);
  });
  return Object.fromEntries(Ta.flatMap((l) => {
    const s = o?.[l.configKey];
    if (typeof s == "string" && s.length > 0)
      return [[l.configKey, s]];
    const c = i.find((u) => Xr(e, u, l));
    return c ? [[l.configKey, c]] : [];
  }));
}, Da = (e, t, o) => {
  const a = o?.console_platform;
  if (a === "xbox" || a === "playstation" || a === "nintendo") return a;
  const r = t ? e?.states[t] : void 0, n = Oa([
    t,
    r?.attributes.friendly_name,
    t ? e?.entities?.[t]?.platform : void 0
  ].filter(Boolean).join(" "));
  return n.includes("xbox") || n.includes("gamer") ? "xbox" : n.includes("playstation") || /(?:^|_)ps[345](?:_|$)/.test(n) ? "playstation" : n.includes("nintendo") || n.includes("switch") ? "nintendo" : "generic";
}, Jr = (e) => {
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
}, Xo = {
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
    room_light_entity: "Room light (brightness and accent)",
    room_temperature_entity: "Room temperature entity",
    room_brightness_entity: "Room brightness light",
    room_move_up: "Move up",
    room_move_down: "Move down",
    room_secondary_help: "Compose secondary information in order. All values come from the primary entity; feature label switches and their selected entities do not override this list. Unavailable values are omitted.",
    room_secondary_value: "Value",
    room_part_text: "Text",
    room_part_name: "Entity name",
    room_part_state: "State (on/off, etc.)",
    room_part_brightness: "Brightness (%)",
    room_part_temperature: "Temperature",
    room_part_attribute: "Entity attribute",
    room_part_add: "Add information part",
    room_part_remove: "Remove information part",
    room_buttons: "Room sensor buttons",
    room_buttons_help: "Action buttons are separate from the small status indicators. Selecting an entity fills its icon, appearance, active state and actions; you can override these values.",
    active_state: "Active state",
    room_active_state_help: "Exact entity state that highlights this action button.",
    room_button_action_help: "Sensors open more information; controllable entities toggle by default.",
    room_status: "Status indicators",
    room_status_help: "Add up to four small entity icons, separate from the action buttons. Water and fire/smoke pulse blue and red when triggered; reduced motion keeps the alert color without animation.",
    room_status_kind: "Indicator kind",
    room_status_window: "Window",
    room_status_door: "Door",
    room_status_motion: "Motion / occupancy",
    room_status_water: "Water / moisture",
    room_status_smoke: "Fire / smoke",
    room_status_active: "Triggered",
    room_status_inactive: "Inactive",
    room_status_unavailable: "Unavailable",
    room_status_preview: "Indicator preview",
    room_status_choose_entity: "Choose an entity",
    room_status_add: "Add status indicator",
    room_status_remove: "Remove status indicator",
    input_select_entity: "Room selection helper",
    input_select_option: "Room selection option",
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
    hide_unknown_dates: "Hide items without a known date",
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
    carousel_button_width: "Button width",
    carousel_button_height: "Button height",
    carousel_icon_size: "Button icon size",
    carousel_effect: "Carousel effect",
    carousel_navigation: "Show previous/next buttons",
    carousel_pagination: "Show pagination",
    carousel_pagination_type: "Pagination style",
    carousel_scrollbar: "Show draggable position scrollbar",
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
    room_light_entity: "Kamerlamp (helderheid en accent)",
    room_temperature_entity: "Temperatuurentiteit voor kamer",
    room_brightness_entity: "Lamp voor kamerhelderheid",
    room_move_up: "Omhoog",
    room_move_down: "Omlaag",
    room_secondary_help: "Stel de secundaire informatie op volgorde samen. Alle waarden komen van de primaire entiteit; labelschakelaars en hun gekozen entiteiten overschrijven deze lijst niet. Niet-beschikbare waarden worden weggelaten.",
    room_secondary_value: "Waarde",
    room_part_text: "Tekst",
    room_part_name: "Entiteitsnaam",
    room_part_state: "Status (aan/uit, enz.)",
    room_part_brightness: "Helderheid (%)",
    room_part_temperature: "Temperatuur",
    room_part_attribute: "Entiteitsattribuut",
    room_part_add: "Informatiedeel toevoegen",
    room_part_remove: "Informatiedeel verwijderen",
    room_buttons: "Kamersensorknoppen",
    room_buttons_help: "Actieknoppen staan los van de kleine statuspictogrammen. Kies een entiteit om pictogram, weergave, actieve status en acties in te vullen; deze waarden zijn aanpasbaar.",
    active_state: "Actieve status",
    room_active_state_help: "De exacte entiteitsstatus die deze actieknop markeert.",
    room_button_action_help: "Sensoren openen meer informatie; bedienbare entiteiten schakelen standaard om.",
    room_status: "Statuspictogrammen",
    room_status_help: "Voeg maximaal vier kleine entiteitspictogrammen toe, los van de actieknoppen. Water en brand/rook pulseren blauw en rood bij alarm. Bij minder beweging blijft alleen de alarmkleur zichtbaar.",
    room_status_kind: "Soort pictogram",
    room_status_window: "Raam",
    room_status_door: "Deur",
    room_status_motion: "Beweging / bezetting",
    room_status_water: "Water / vocht",
    room_status_smoke: "Brand / rook",
    room_status_active: "Geactiveerd",
    room_status_inactive: "Inactief",
    room_status_unavailable: "Niet beschikbaar",
    room_status_preview: "Pictogramvoorbeeld",
    room_status_choose_entity: "Kies een entiteit",
    room_status_add: "Statuspictogram toevoegen",
    room_status_remove: "Statuspictogram verwijderen",
    ulm_card_dynamic_color: "Gebruik de lichtkleur als kameraccent",
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
    hide_unknown_dates: "Items zonder bekende datum verbergen",
    today_entity: "Sensor voor afval van vandaag",
    show_tomorrow: "Afval van morgen tonen",
    tomorrow_entity: "Sensor voor afval van morgen",
    show_forecast: "Voorspelling tonen",
    show_controls: "Bediening tonen"
  }
}, G = (e, t) => {
  const o = e?.language?.split("-")[0] ?? "en";
  return Xo[o]?.[t] ?? Xo.en[t] ?? t.replace(/^ulm_(?:custom_)?card_/, "").replace(/^(?:custom_)?card_/, "").replace(/^ulm_/, "").replaceAll("_", " ").replace(/\b\w/g, (a) => a.toUpperCase());
}, Zr = {
  entity: "The Home Assistant entity shown and controlled by this card.",
  room_light_entity: "One light for both the brightness label and optional room accent. Defaults to the primary entity when it is a light. Only valid brightness is shown; active RGB group members are supported for the accent.",
  room_temperature_entity: "Optional sensor or climate entity for the temperature label. Defaults to the primary entity. Only numeric temperatures with a temperature unit are shown.",
  room_brightness_entity: "Optional light for the brightness label. Defaults to the primary light, then the Room accent light. Only a valid brightness attribute is shown as a percentage.",
  label_use_temperature: "Room automatic/state secondary information: include a valid temperature. None, custom, composed and explicit name/time modes take precedence.",
  label_use_brightness: "Room automatic/state secondary information: include a valid brightness percentage alongside temperature. None, custom, composed and explicit name/time modes take precedence.",
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
  icon: "Optional icon override. Clear it to follow the entity's Home Assistant icon, including device class and state. A card icon is used only when no entity is available.",
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
  input_select_entity: "Optional input select changed by the room card double-tap action.",
  input_select_option: "Option selected on the configured room helper.",
  download_entity: "Speedtest download sensor shown by the card and refreshed by the test action.",
  upload_entity: "Speedtest upload sensor shown by the card and refreshed by the test action.",
  ping_entity: "Speedtest ping sensor refreshed together with download and upload.",
  wifi_tracker_entity: "Device tracker used by the source popup's Wi-Fi glance.",
  gps_tracker_entity: "Device tracker used by the source popup's GPS glance and map.",
  findmy_script_entity: "Script invoked by the source popup's phone finder control.",
  ulm_card_input_datetime_name: "Optional source-compatible name shown in the datetime header.",
  ulm_card_input_number_name: "Optional source-compatible name shown in the input-number header.",
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
  hide_unknown_dates: "Automatically hides waste rows with a missing, empty, unknown or unavailable collection date. Rows return when a date becomes available.",
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
  carousel_button_width: "Width of each carousel button in pixels (32-160). Automatically fits narrower cards; header and navigation buttons are unchanged.",
  carousel_button_height: "Height of each carousel button in pixels (32-160). The carousel grows to fit the buttons.",
  carousel_icon_size: "Size of item icons in pixels (12-96). Entity pictures scale proportionally; both fit within the button. Does not change the card's header icon.",
  carousel_effect: "Choose Coverflow, Slide, Fade, Cube or Flip. Fade, Cube and Flip show one centered item, regardless of slides per view; coverflow geometry only affects Coverflow.",
  carousel_navigation: "Move through items with previous/next buttons. At a non-looping endpoint the corresponding button is disabled.",
  carousel_pagination: "Show clickable dots, the selected item count or a progress bar below the carousel.",
  carousel_pagination_type: "Used when Show pagination is on. Dots jump directly to an item.",
  carousel_scrollbar: "Drag or use arrow keys to select an item. Selecting a position does not activate the entity.",
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
  use_media_info: "Replace the normal name/state header with the current media title and artist when available. Custom names/text, hidden fields, and explicit state/name/time modes remain respected.",
  show_volume_level: "Legacy option; volume percentage is now shown beside the selected volume slider.",
  volume_controls: "Select mute, a volume slider, or volume buttons. Controls unsupported by the entity are hidden; clear all to hide volume controls.",
  media_controls: "Select playback controls. Only controls supported by the entity are shown; clear all to hide media controls.",
  collapsible_controls: "Hide controls when off, unknown, or unavailable, except a supported power control. Unknown and unavailable entities cannot be controlled.",
  ulm_card_media_player_enable_controls: "Adds previous, play/pause, and next buttons.",
  ulm_card_media_player_enable_volume_slider: "Lets you adjust the media player's volume from the card.",
  ulm_card_media_player_enable_volume_buttons: "Adds mute, volume-down, and volume-up controls.",
  ulm_card_media_player_enable_volume_adjust: "Volume increment from 0.01 to 1 (0.05 = 5%). Leave empty for the player's native step. A custom step requires volume-set support.",
  ulm_card_media_player_collapsible: "Hides playback and volume controls while the player is inactive.",
  ulm_card_media_player_idle_off: "Treats the idle state like off when collapsible controls are enabled.",
  ulm_card_media_player_player_controls_entity: "Media player that receives playback and volume service calls.",
  ulm_card_media_player_more_info: "Shows artist and album metadata below the current title.",
  ulm_card_media_player_power_button: "Shows supported hardware power controls. Always-on players such as Sonos use Standby (stop playback) and Resume playback instead; this does not cut power to the speaker. Retained when other controls are collapsed.",
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
}, Qr = (e) => Zr[e], en = [
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
    animated: !0,
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
    deviations: [
      "Room selection helpers are ignored by this component; use explicit standard actions instead. Roomview and other components retain their own behavior.",
      "Original Room extensions add up to four typed status indicators and an optional RGB light accent. Water/smoke alerts respect reduced motion. Room action buttons infer entity defaults and retain legacy names only for accessibility."
    ],
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
], go = new Map(en.map((e) => [e.upstreamId, e])), tn = (e) => /popup|browser_mod/i.test(e), on = {
  card_room: ["ulm_input_select", "ulm_input_select_option", "input_select_entity", "input_select_option"],
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
}, Na = /* @__PURE__ */ new Set([
  "ulm_card_battery_name",
  "ulm_card_flower_name",
  "ulm_card_input_boolean_name",
  "ulm_card_input_datetime_name",
  "ulm_card_input_number_name",
  "ulm_card_media_player_with_controls_name",
  "ulm_card_printer_name",
  "ulm_custom_card_metrics_entitites_name"
]), an = (e, t) => Na.has(t) || (on[e.upstreamId]?.includes(t) ?? !1), rn = {
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
}, nn = {
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
}, La = (e, t) => !tn(t) && ([e.upstreamId, ...e.sourceIds ?? []].some((o) => nn[o]?.includes(t) === !0) || rn[e.family]?.includes(t) === !0), Lt = [
  { key: "temperature", label: "Temperature", icon: "mdi:thermometer", min: -10, max: 50 },
  { key: "humidity", label: "Humidity", icon: "mdi:water-percent", min: 0, max: 100 },
  { key: "moisture", label: "Moisture", icon: "mdi:water", min: 0, max: 100 },
  { key: "conductivity", label: "Conductivity", icon: "mdi:flash", min: 0, max: 3e3 },
  { key: "illuminance", label: "Illuminance", icon: "mdi:white-balance-sunny", min: 0, max: 1e5 },
  { key: "dli", label: "Daily light integral", icon: "mdi:leaf", min: 0, max: 30 }
], sn = new Set(Lt.map(({ key: e }) => e)), Va = (e) => {
  const t = e?.ulm_card_flower_show_bars;
  return Array.isArray(t) ? [...new Set(t)].filter((o) => typeof o == "string" && sn.has(o)) : Lt.map(({ key: o }) => o);
}, Ha = (e) => `${e}_entity`, g = (e, t = "entity") => ({
  name: t,
  selector: { entity: e?.length ? { domain: e } : {} }
}), O = (e) => ({ name: e, selector: { text: {} } }), Jo = (e) => ({ name: e, selector: { navigation: {} } }), S = (e) => ({ name: e, selector: { boolean: {} } }), E = (e, t = 1, o = 168, a) => ({
  name: e,
  selector: { number: { min: t, max: o, mode: "box", ...a === void 0 ? {} : { step: a } } }
}), Gt = (e) => ({
  name: e,
  selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
}), ve = (e) => ({ name: e, selector: { ui_action: {} } }), U = (e, t) => ({
  name: e,
  selector: { select: { mode: "dropdown", options: t } }
}), ln = {
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
}, H = (e) => ({
  name: e,
  selector: { ui_color: { default_color: ln[e] } }
}), ot = (e) => ({ ...e, presentation: !0 }), cn = (e) => ({
  type: "grid",
  name: "",
  schema: e,
  presentation: !0
}), dn = /* @__PURE__ */ new Set([
  "ulm_card_battery_battery_level_danger",
  "ulm_card_battery_battery_level_warning"
]), un = /* @__PURE__ */ new Set([
  "ulm_card_media_player_collapsible",
  "ulm_card_media_player_idle_off",
  "ulm_card_media_player_more_info",
  "ulm_card_media_player_power_button",
  "ulm_card_media_player_force_background_color"
]), mn = /* @__PURE__ */ new Set([
  "ulm_card_media_player_enable_volume_adjust"
]), _n = /* @__PURE__ */ new Set([
  "ulm_card_input_datetime_name",
  "ulm_card_input_number_entity",
  "ulm_card_input_number_name",
  "ulm_custom_card_metrics_entitites_name"
]), pn = {}, X = (e = !1) => [
  ot({
    name: "name",
    selector: { entity_name: {} },
    context: { entity: "entity" }
  }),
  ot({
    name: "icon",
    selector: { icon: {} },
    context: { icon_entity: "entity" }
  }),
  ot({
    name: "layout",
    selector: {
      select: {
        mode: "box",
        options: ["horizontal", "vertical"].map((t) => ({
          value: t,
          label: t === "horizontal" ? "Horizontal" : "Vertical",
          image: {
            src: `/static/images/form/tile_content_layout_${t}.svg`,
            src_dark: `/static/images/form/tile_content_layout_${t}_dark.svg`,
            flip_rtl: !0
          }
        }))
      }
    }
  }),
  ot(S("multiline_secondary")),
  ot(S("fill_container")),
  cn([
    U("primary_info", [
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" }
    ]),
    U("secondary_info", [
      ...e ? [
        { value: "default", label: "Automatic (feature labels)" },
        { value: "custom", label: "Custom text" },
        { value: "composed", label: "Composed (primary entity values)" }
      ] : [],
      { value: "name", label: "Name" },
      { value: "state", label: "State" },
      { value: "last-changed", label: "Last changed" },
      { value: "last-updated", label: "Last updated" },
      { value: "none", label: "None" }
    ]),
    U("icon_type", [
      { value: "icon", label: "Icon" },
      { value: "entity-picture", label: "Entity picture" },
      { value: "none", label: "None" }
    ])
  ])
], hn = /* @__PURE__ */ new Set([
  "card_room",
  "card_welcome_scenes",
  "custom_card_welcome"
]), Ra = (e) => e.flatMap((t) => t.name === "icon" || t.name === "icon_type" ? [] : t.schema ? [{ ...t, schema: Ra(t.schema) }] : [t]), gn = (e) => {
  if (!e.some((i) => i.presentation)) return e;
  const t = e.filter((i) => i.presentation), o = /* @__PURE__ */ new Set(["name", "icon"]), a = e.filter((i) => !i.presentation && !o.has(i.name) && !Na.has(i.name)), r = a.findIndex((i) => i.name === "entity");
  if (r < 0) return [...t, ...a];
  const [n] = a.splice(r, 1);
  return [n, ...t, ...a];
}, yn = (e) => {
  const t = { ...e };
  return delete t.presentation, t;
}, de = (e) => [
  g(e.preferredDomains),
  ...e.variants?.length ? [U("variant", e.variants.map((t) => ({
    value: t,
    label: e.variantLabels?.[t] ?? t.replaceAll("-", " ").replace(/\b\w/g, (o) => o.toUpperCase())
  })))] : [],
  ...X()
], Zo = {
  weather: (e) => [
    ...de(e),
    g(["sensor"], "temperature_entity"),
    g(["sensor"], "humidity_entity"),
    S("show_forecast")
  ],
  climate: (e) => [...de(e), g(["sensor"], "humidity_entity"), S("show_controls")],
  light: (e) => [...de(e)],
  scene: (e) => [
    ...e.upstreamId === "card_welcome_scenes" ? [g(), ...X()] : de(e),
    ...e.upstreamId === "card_welcome_scenes" ? [
      g(["input_boolean"], "collapse_entity"),
      g(["weather"], "weather_entity"),
      Jo("settings_path"),
      S("collapsed")
    ] : []
  ],
  presence: (e, t) => [
    ...de(e),
    ...e.upstreamId === "card_room" ? [] : [
      ...t?.variant === "small" ? [] : [
        g(["sensor"], "battery_entity"),
        g(["sensor"], "eta_entity"),
        g(["sensor"], "address_entity")
      ]
    ]
  ],
  battery: (e) => [
    ...de(e),
    Gt("battery_warning_threshold"),
    Gt("battery_low_threshold"),
    Gt("battery_critical_threshold"),
    H("battery_healthy_color"),
    H("battery_warning_color"),
    H("battery_low_color"),
    H("battery_critical_color")
  ],
  energy: (e) => [...de(e), g(["sensor"], "min_entity"), g(["sensor"], "max_entity"), S("show_graph")],
  sensor: (e) => [...de(e), S("show_graph")],
  media: (e) => [...de(e), S("show_controls")],
  cover: (e) => [...de(e), S("show_controls")],
  security: (e) => [...de(e)],
  navigation: (e) => [
    ...e.variants?.length ? [U("variant", e.variants.map((t) => ({
      value: t,
      label: e.variantLabels?.[t] ?? t
    })))] : [],
    ...X(),
    Jo("navigation_path")
  ],
  text: () => [...X(), O("secondary")],
  camera: (e) => [...de(e)],
  control: (e) => [
    ...de(e),
    .../power_outlet|more_power_outlet/.test(e.upstreamId) ? [g(["sensor"], "graph_entity"), S("show_graph")] : [],
    S("show_controls")
  ],
  "alarm-time": (e) => [...de(e), g(["input_datetime"], "datetime_entity"), S("show_controls")],
  door: (e) => [...de(e), g(["lock"], "lock_entity"), g(["sensor"], "battery_entity"), S("show_controls")],
  entity: (e) => [...de(e), O("secondary")]
}, ja = (e, t) => {
  if (e.upstreamId === "mini_graph_card")
    return [
      g(["sensor", "binary_sensor", "input_number"]),
      ...X().filter((r) => r.name !== "layout" && r.name !== "multiline_secondary"),
      U("variant", [
        { value: "line", label: "Line graph" },
        { value: "bar", label: "Bar graph" }
      ]),
      U("aggregate_func", [
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
      U("group_by", [
        { value: "interval", label: "Dynamic interval" },
        { value: "hour", label: "Hour" },
        { value: "date", label: "Date" }
      ]),
      E("hours_to_show", 1, 8760),
      E("points_per_hour", 0.01, 60),
      E("update_interval", 1, 86400),
      S("cache"),
      E("height", 0, 1e3),
      E("line_width", 1, 20),
      E("bar_spacing", 0, 50),
      S("smoothing"),
      S("animate"),
      S("logarithmic"),
      E("value_factor", -12, 12),
      E("decimals", 0, 12),
      S("hour24"),
      E("font_size", 25, 300),
      E("font_size_header", 8, 48),
      U("align_header", [
        { value: "default", label: "Automatic" },
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ]),
      U("align_icon", [
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
        { value: "state", label: "Beside state" }
      ]),
      U("align_state", [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" }
      ]),
      O("unit"),
      O("icon_image"),
      O("lower_bound"),
      O("upper_bound"),
      E("min_bound_range", 0, 1e6),
      O("lower_bound_secondary"),
      O("upper_bound_secondary"),
      E("min_bound_range_secondary", 0, 1e6),
      U("color_thresholds_transition", [
        { value: "smooth", label: "Smooth gradient" },
        { value: "hard", label: "Hard color steps" }
      ]),
      S("group"),
      U("mini_graph_show_state", [
        { value: "current", label: "Current state" },
        { value: "last", label: "Last graph value" },
        { value: "hidden", label: "Hidden" }
      ]),
      U("mini_graph_show_fill", [
        { value: "solid", label: "Solid fill" },
        { value: "fade", label: "Faded fill" },
        { value: "hidden", label: "No fill" }
      ]),
      U("mini_graph_show_points", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" }
      ]),
      U("mini_graph_show_labels", [
        { value: "always", label: "Always" },
        { value: "hover", label: "On hover" },
        { value: "hidden", label: "Hidden" }
      ]),
      U("mini_graph_show_labels_secondary", [
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
      ve("tap_action"),
      ve("hold_action"),
      ve("double_tap_action")
    ];
  const o = [
    ...e.upstreamId === "advanced_home_energy_management" ? [
      g(["sensor"]),
      g(["sensor"], "grid_power_entity"),
      g(["sensor"], "grid_phase_1_entity"),
      g(["sensor"], "grid_phase_2_entity"),
      g(["sensor"], "grid_phase_3_entity"),
      g(["sensor"], "solar_power_entity"),
      g(["sensor"], "solar_forecast_entity"),
      g(["sensor"], "battery_level_entity"),
      g(["sensor"], "battery_power_entity"),
      g(["sensor"], "battery_1_level_entity"),
      g(["sensor"], "battery_1_power_entity"),
      g(["sensor"], "battery_2_level_entity"),
      g(["sensor"], "battery_2_power_entity"),
      g(["sensor"], "battery_3_level_entity"),
      g(["sensor"], "battery_3_power_entity"),
      g(["sensor"], "ev_charger_power_entity"),
      g(["sensor", "select", "input_select"], "energy_mode_entity"),
      g(["binary_sensor", "input_boolean", "switch"], "energy_auto_control_entity"),
      g(["sensor", "input_number"], "electricity_price_entity"),
      g(["sensor", "input_number"], "tariff_markup_entity"),
      g(["sensor", "input_number"], "tariff_vat_entity"),
      O("energy_grid_label"),
      O("energy_grid_import_label"),
      O("energy_grid_export_label"),
      O("energy_solar_label"),
      O("energy_battery_label"),
      O("energy_home_label"),
      O("energy_forecast_label"),
      O("energy_ev_label"),
      O("energy_charge_label"),
      O("energy_discharge_label"),
      O("energy_idle_label"),
      O("energy_auto_label"),
      O("energy_manual_label"),
      O("mode_solar_first_label"),
      O("mode_smart_saving_label"),
      O("mode_smart_trading_label"),
      E("grid_phase_scale_max", 100, 1e5),
      E("solar_scale_max", 100, 1e5),
      E("battery_unit_scale_max", 100, 1e5),
      E("home_scale_max", 100, 1e5),
      E("price_low_threshold", -10, 10),
      E("price_medium_threshold", -10, 10),
      E("price_high_threshold", -10, 10),
      E("price_critical_threshold", -10, 10),
      S("show_grid_phases"),
      S("show_battery_units"),
      S("show_tariff_timeline"),
      H("import_color"),
      H("export_color"),
      H("solar_color"),
      H("battery_color"),
      H("home_color"),
      H("price_negative_color"),
      H("price_low_color"),
      H("price_medium_color"),
      H("price_high_color"),
      H("price_critical_color"),
      ...X()
    ] : e.upstreamId === "card_room" ? [
      g(),
      S("label_use_temperature"),
      g(["sensor", "climate"], "room_temperature_entity"),
      S("label_use_brightness"),
      g(["light"], "room_light_entity"),
      S("ulm_card_dynamic_color"),
      ...X(!0),
      O("secondary")
    ] : e.upstreamId === "card_scenes" ? [
      g(),
      ...e.variants?.length ? [U("variant", e.variants.map((r) => ({
        value: r,
        label: e.variantLabels?.[r] ?? r
      })))] : [],
      S("scene_buttons_only"),
      ...X()
    ] : e.upstreamId === "custom_card_trash" ? [
      g(["sensor", "calendar"]),
      S("hide_unknown_dates"),
      S("show_today"),
      g(["sensor"], "today_entity"),
      S("show_tomorrow"),
      g(["sensor"], "tomorrow_entity"),
      ...X()
    ] : e.upstreamId === "custom_card_entity_carousel" ? [
      g(),
      S("carousel_show_header"),
      ...X(),
      S("carousel_loop"),
      S("carousel_show_labels"),
      E("carousel_initial_index", 0, 50),
      { name: "carousel_button_width", selector: { number: { min: 32, max: 160, step: 1, mode: "slider", unit_of_measurement: "px" } } },
      { name: "carousel_button_height", selector: { number: { min: 32, max: 160, step: 1, mode: "slider", unit_of_measurement: "px" } } },
      { name: "carousel_icon_size", selector: { number: { min: 12, max: 96, step: 1, mode: "slider", unit_of_measurement: "px" } } },
      U("carousel_effect", [
        { value: "coverflow", label: "Coverflow" },
        { value: "slide", label: "Slide" },
        { value: "fade", label: "Fade" },
        { value: "cube", label: "Cube" },
        { value: "flip", label: "Flip" }
      ]),
      S("carousel_navigation"),
      S("carousel_pagination"),
      U("carousel_pagination_type", [
        { value: "bullets", label: "Dots" },
        { value: "fraction", label: "Item count" },
        { value: "progressbar", label: "Progress bar" }
      ]),
      S("carousel_scrollbar"),
      S("carousel_grab_cursor"),
      S("carousel_centered_slides"),
      U("carousel_slides_per_view", [
        { value: "auto", label: "Automatic" },
        ...Array.from({ length: 11 }, (r, n) => ({
          value: String(n + 1),
          label: String(n + 1)
        }))
      ]),
      E("carousel_coverflow_rotate", -180, 180),
      E("carousel_coverflow_stretch", -200, 200),
      E("carousel_coverflow_depth", 0, 1e3),
      E("carousel_coverflow_modifier", 0, 5),
      S("carousel_coverflow_slide_shadows")
    ] : e.upstreamId === "custom_card_playstation" ? [
      g(["binary_sensor", "media_player", "remote", "sensor", "switch"]),
      U("console_platform", [
        { value: "auto", label: "Automatic" },
        { value: "xbox", label: "Xbox" },
        { value: "playstation", label: "PlayStation" },
        { value: "nintendo", label: "Nintendo" }
      ]),
      S("console_show_artwork"),
      S("console_show_controls"),
      g(["sensor"], "followers_entity"),
      g(["sensor"], "following_entity"),
      g(["sensor"], "friends_entity"),
      g(["sensor", "number", "input_number"], "primary_stat_entity"),
      { name: "primary_stat_icon", selector: { icon: {} } },
      g(["sensor", "number", "input_number"], "secondary_stat_entity"),
      { name: "secondary_stat_icon", selector: { icon: {} } },
      g(["sensor"], "now_playing_entity"),
      g(["image", "camera"], "gamerpic_entity"),
      g(["image", "camera"], "artwork_entity"),
      g(["remote", "media_player", "switch"], "console_power_entity"),
      ...X()
    ] : e.upstreamId === "custom_card_alarm_time" ? [
      g(["input_boolean", "switch"]),
      g(["input_datetime"], "datetime_entity"),
      E("ulm_card_alarm_time_step", 1, 180),
      S("ulm_card_alarm_time_collapse"),
      S("ulm_card_alarm_time_horizontal"),
      { name: "ulm_card_alarm_time_icon", selector: { icon: {} } },
      H("ulm_card_alarm_time_color"),
      ...X()
    ] : e.upstreamId === "custom_card_media_player_sonos" ? [
      g(["media_player"]),
      ...X(),
      S("ulm_card_media_player_enable_art"),
      S("use_media_info"),
      S("ulm_card_media_player_more_info"),
      S("ulm_card_media_player_power_button"),
      g(["media_player"], "ulm_card_media_player_player_controls_entity"),
      { name: "ulm_card_media_player_enable_volume_adjust", selector: { number: { min: 0.01, max: 1, step: 0.01, mode: "box" } } },
      { name: "volume_controls", selector: { select: { multiple: !0, mode: "list", options: [
        { value: "volume_mute", label: "Mute" },
        { value: "volume_set", label: "Volume slider and percentage" },
        { value: "volume_buttons", label: "Volume buttons" }
      ] } } },
      { name: "media_controls", selector: { select: { multiple: !0, mode: "list", options: [
        { value: "shuffle", label: "Shuffle" },
        { value: "previous", label: "Previous track" },
        { value: "play_pause_stop", label: "Play/pause/stop" },
        { value: "next", label: "Next track" },
        { value: "repeat", label: "Repeat mode" },
        { value: "sources", label: "Sources and details" }
      ] } } },
      S("collapsible_controls"),
      S("ulm_card_media_player_idle_off"),
      S("sonos_details_always_visible"),
      g(["switch"], "crossfade_entity"),
      g(["switch"], "night_sound_entity"),
      g(["switch"], "speech_enhancement_entity"),
      g(["switch"], "subwoofer_entity"),
      g(["switch"], "surrounds_entity"),
      g(["switch"], "loudness_entity"),
      g(["switch"], "surround_full_entity"),
      g(["number"], "audio_delay_entity"),
      g(["number"], "balance_entity"),
      g(["number"], "bass_entity"),
      g(["number"], "treble_entity"),
      g(["number"], "sub_gain_entity"),
      g(["number"], "surround_level_entity"),
      g(["number"], "music_surround_level_entity")
    ] : e.upstreamId === "custom_card_printer" ? [
      g(["sensor", "binary_sensor"]),
      g(["sensor"], "black_entity"),
      g(["sensor"], "yellow_entity"),
      g(["sensor"], "magenta_entity"),
      g(["sensor"], "cyan_entity"),
      ...X()
    ] : e.upstreamId === "advanced_energy_buy_sell" ? [
      g(["sensor"]),
      O("buy_sell_title"),
      E("buy_sell_graph_span", 1, 168),
      U("buy_sell_span_start", [
        { value: "day", label: "Start at midnight" },
        { value: "now", label: "Start now" }
      ]),
      E("buy_sell_update_interval", 1, 120),
      E("buy_sell_chart_height", 120, 700),
      E("buy_sell_min_value", -10, 10),
      E("buy_sell_max_value", -10, 10),
      E("buy_sell_price_decimals", 0, 6),
      E("buy_sell_axis_decimals", 0, 4),
      E("buy_sell_bar_radius", 0, 16),
      O("buy_sell_axis_label"),
      O("buy_sell_price_label"),
      H("buy_sell_price_color"),
      O("buy_sell_charge_label"),
      H("buy_sell_charge_color"),
      O("buy_sell_planned_sell_label"),
      H("buy_sell_planned_sell_color"),
      O("buy_sell_possible_sell_label"),
      H("buy_sell_possible_sell_color"),
      S("buy_sell_show_now"),
      O("buy_sell_now_label"),
      H("buy_sell_now_color"),
      S("buy_sell_show_legend"),
      S("buy_sell_show_grid"),
      S("buy_sell_show_result"),
      E("buy_sell_trade_energy", 0.1, 1e3, 0.01),
      g(["input_number", "number", "sensor"], "buy_sell_trade_energy_entity"),
      E("buy_sell_trade_power", 0.1, 1e3, 0.01),
      E("buy_sell_trade_efficiency", 1, 100, 0.1),
      E("buy_sell_feed_in_fee", 0, 10, 1e-3),
      E("buy_sell_slot_minutes", 1, 1440),
      ...X()
    ] : e.upstreamId === "advanced_energy_panel_health" ? [
      g(["sensor"]),
      {
        name: "panel_entities",
        selector: { entity: { domain: ["sensor"], multiple: !0 } }
      },
      O("panel_health_title"),
      S("panel_show_summary"),
      S("panel_show_gauges"),
      E("panel_gauge_max", 1, 1e5),
      E("panel_warning_average_min", 0, 1e5),
      E("panel_low_output_percent", 1, 100),
      E("panel_segment_1", 0, 1e5),
      E("panel_segment_2", 0, 1e5),
      E("panel_segment_3", 0, 1e5),
      E("panel_segment_4", 0, 1e5),
      H("panel_color_0"),
      H("panel_color_1"),
      H("panel_color_2"),
      H("panel_color_3"),
      H("panel_color_4"),
      H("panel_color_5"),
      ...X()
    ] : e.upstreamId === "custom_card_roomview" ? [
      g(e.preferredDomains),
      g(["group", "binary_sensor"], "group_motions"),
      g(["group", "binary_sensor"], "group_doors"),
      g(["group", "binary_sensor"], "group_windows"),
      g(["group", "binary_sensor"], "group_water"),
      g(["sensor"], "temperature"),
      g(["sensor"], "humidity"),
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
      U("climate_icon_type", [
        { value: "icon", label: "Icon" },
        { value: "entity-picture", label: "Entity picture" },
        { value: "none", label: "None" }
      ]),
      ...["climate_primary_info", "climate_secondary_info"].map((r) => U(r, [
        { value: "name", label: "Name" },
        { value: "state", label: "State" },
        { value: "none", label: "None" }
      ])),
      O("climate_secondary"),
      ...[
        { device: "lights", key: "group_lights", domain: "light" },
        { device: "shutters", key: "group_windows_shutters", domain: "cover" },
        { device: "outlets", key: "group_outlets", domain: "switch" },
        { device: "tv", key: "group_tv", domain: "media_player" }
      ].flatMap(({ device: r, key: n, domain: i }) => [
        g(["group", i], n),
        ...["tap", "hold", "double_tap"].map((l) => ve(`${r}_${l}_action`))
      ]),
      ...X()
    ] : e.upstreamId === "custom_card_welcome" ? [
      g(["person"]),
      g(["input_boolean"], "ulm_card_welcome_collapse"),
      g(["weather"], "ulm_weather"),
      ...Array.from({ length: 5 }, (r, n) => n + 1).flatMap((r) => [
        O(`nav_${r}`),
        { name: `icon_${r}`, selector: { icon: {} } },
        O(`name_${r}`),
        U(`color_${r}`, ["blue", "red", "green", "yellow", "pink", "purple"].map((n) => ({
          value: n,
          label: n[0].toUpperCase() + n.slice(1)
        })))
      ]),
      ...X()
    ] : e.upstreamId === "custom_card_plant" ? [
      g(["plant", "sensor"]),
      O("ulm_card_flower_species"),
      {
        name: "ulm_card_flower_show_bars",
        selector: {
          select: {
            multiple: !0,
            options: Lt.map(({ key: r, label: n }) => ({ value: r, label: n }))
          }
        }
      },
      ...Va(t).map((r) => g(["sensor", "number", "input_number"], Ha(r))),
      ...X()
    ] : e.upstreamId === "custom_card_washer" ? [
      g(["sensor", "switch", "binary_sensor"]),
      g(["sensor", "select"], "program_stage_entity"),
      g(["sensor", "switch"], "washer_power_entity"),
      g(["sensor", "binary_sensor"], "door_entity"),
      g(["sensor", "binary_sensor"], "finished_entity"),
      g(["sensor", "binary_sensor"], "ulm_custom_card_washer_remote_control"),
      g(["sensor"], "ulm_custom_card_washer_job_progress"),
      g(["input_boolean"], "ulm_custom_card_washer_delayed_start"),
      g(["input_datetime"], "ulm_custom_card_washer_delayed_starttime"),
      O("ulm_custom_card_washer_machine_stop_state"),
      { name: "ulm_custom_card_washer_job_states", selector: { object: {} } },
      O("ulm_custom_card_washer_label_idle"),
      O("ulm_custom_card_washer_label_configuring"),
      O("ulm_custom_card_washer_label_running"),
      ve("ulm_custom_card_washer_start_action"),
      ve("ulm_custom_card_washer_pause_action"),
      ve("ulm_custom_card_washer_stop_action"),
      ...X()
    ] : e.upstreamId === "custom_card_sun" ? [
      g(["sun"]),
      O("title"),
      U("language", [
        { value: "en", label: "English" },
        { value: "de", label: "German" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "nl", label: "Dutch" },
        { value: "pl", label: "Polish" }
      ]),
      U("timeFormat", [
        { value: "24h", label: "24-hour time" },
        { value: "12h", label: "12-hour time" }
      ]),
      S("darkMode"),
      S("showMoon"),
      g(["sensor"], "moon_entity"),
      g(["sensor"], "moon_altitude_entity"),
      g(["sensor"], "moon_azimuth_entity"),
      g(["sensor"], "moon_rising_entity"),
      g(["sensor"], "moon_setting_entity"),
      g(["sensor"], "moon_next_full_moon_entity"),
      g(["sensor"], "moon_next_new_moon_entity"),
      g(["sensor", "binary_sensor"], "moon_above_horizon_entity"),
      ...X()
    ] : e.upstreamId === "custom_card_pollen" ? [
      g(["sensor"]),
      g(["sensor"], "trees_entity"),
      O("custom_card_pollen_tree_name"),
      { name: "custom_card_pollen_tree_icon", selector: { icon: {} } },
      g(["sensor"], "grass_entity"),
      O("custom_card_pollen_grass_name"),
      { name: "custom_card_pollen_grass_icon", selector: { icon: {} } },
      g(["sensor"], "weeds_entity"),
      O("custom_card_pollen_weed_name"),
      { name: "custom_card_pollen_weed_icon", selector: { icon: {} } },
      ...X()
    ] : e.upstreamId === "custom_card_speedtest_gauges" ? [
      g(["sensor"]),
      g(["sensor"], "download_entity"),
      H("ulm_custom_card_speedtest_download_speed_color"),
      E("ulm_custom_card_speedtest_download_speed_max", 1, 1e5),
      g(["sensor"], "upload_entity"),
      H("ulm_custom_card_speedtest_upload_speed_color"),
      E("ulm_custom_card_speedtest_upload_speed_max", 1, 1e5),
      g(["sensor"], "ping_entity"),
      H("ulm_custom_card_speedtest_ping_color"),
      E("ulm_custom_card_speedtest_ping_max", 1, 1e5),
      S("ulm_custom_card_speedtest_round"),
      ...X()
    ] : e.upstreamId === "custom_card_nas_metrics" ? [
      g(["binary_sensor", "sensor", "switch"]),
      g(["sensor"], "disk_entity"),
      O("disk_name"),
      { name: "disk_icon", selector: { icon: {} } },
      H("disk_color"),
      g(["sensor"], "temperature_entity"),
      O("temperature_name"),
      { name: "temperature_icon", selector: { icon: {} } },
      H("temperature_color"),
      E("temperature_max", 1, 1e5),
      g(["sensor"], "memory_entity"),
      O("memory_name"),
      { name: "memory_icon", selector: { icon: {} } },
      H("memory_color"),
      E("memory_max", 1, 1e5),
      g(["sensor"], "cpu_entity"),
      O("cpu_name"),
      { name: "cpu_icon", selector: { icon: {} } },
      H("cpu_color"),
      E("cpu_max", 1, 1e5),
      ...X()
    ] : e.upstreamId === "custom_card_input_datetime" ? [
      g(["input_datetime"]),
      ...X()
    ] : e.upstreamId === "custom_card_tablet" ? [
      g(["binary_sensor", "sensor", "switch"]),
      g(["switch", "input_boolean"], "tablet_button_usb_entity"),
      g(["switch", "input_boolean"], "tablet_button_motion_entity"),
      g(["light", "switch", "input_boolean"], "tablet_button_display_entity"),
      g(["button"], "tablet_restart_entity"),
      g(["switch", "input_boolean"], "tablet_maintenance_entity"),
      g(["button"], "tablet_reload_entity"),
      g(["sensor"], "tablet_ram_entity"),
      g(["sensor"], "tablet_disk_entity"),
      g(["sensor", "binary_sensor", "switch"], "tablet_power_entity"),
      g(["sensor"], "battery_entity"),
      ...X()
    ] : (Zo[e.family] ?? Zo.entity)(e, t)
  ], a = hn.has(e.upstreamId) ? Ra(o) : o;
  return [
    ...gn(a).map(yn),
    ve("tap_action"),
    ve("hold_action"),
    ve("double_tap_action")
  ];
}, bn = (e, t) => {
  const o = t?.variant ? (e.sourceIds ?? [e.upstreamId]).filter((r) => Wo(r) === t.variant || r === e.upstreamId && Wo(r) === void 0) : e.sourceIds ?? [e.upstreamId];
  return [...new Map(
    o.flatMap((r) => go.get(r)?.variables ?? []).map((r) => [r.name, r])
  ).values()].filter((r) => La(e, r.name)).filter((r) => !an(e, r.name)).filter((r) => !_n.has(r.name)).map((r) => {
    const n = pn[r.name];
    if (n) return U(r.name, n);
    if (un.has(r.name)) return S(r.name);
    if (mn.has(r.name)) return E(r.name, -1e5, 1e5);
    if (dn.has(r.name))
      return {
        name: r.name,
        selector: { number: { min: 0, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } }
      };
    switch (r.selector) {
      case "entity":
        return g(void 0, r.name);
      case "entity-multiple":
        return {
          name: r.name,
          selector: { entity: { multiple: !0 } }
        };
      case "action":
        return ve(r.name);
      case "icon":
        return { name: r.name, selector: { icon: {} } };
      case "color":
        return H(r.name);
      case "boolean":
        return S(r.name);
      case "number":
        return E(r.name, -1e5, 1e5);
      case "object":
        return { name: r.name, selector: { object: {} } };
      default:
        return O(r.name);
    }
  });
}, Fa = (e) => new Set(e.flatMap((t) => t.schema ? [...Fa(t.schema)] : t.name ? [t.name] : [])), fn = (e, t) => {
  const o = Fa(ja(e, t));
  return bn(e, t).filter((a) => !o.has(a.name));
}, vn = [
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
], Ba = (e, t) => t?.attributes.icon ? t.attributes.icon : e.upstreamId === "custom_card_trash" ? "mdi:trash-can-outline" : e.upstreamId === "custom_card_roomview" ? "mdi:home-variant-outline" : e.upstreamId === "custom_card_entity_carousel" ? "mdi:view-carousel" : e.upstreamId === "custom_card_sun" ? "mdi:weather-sunny" : e.upstreamId === "custom_card_speedtest_gauges" ? "mdi:speedometer" : e.upstreamId === "advanced_home_energy_management" ? "mdi:home-lightning-bolt-outline" : e.upstreamId === "advanced_energy_buy_sell" ? "mdi:chart-timeline-variant" : e.upstreamId === "advanced_energy_panel_health" ? "mdi:solar-power-variant" : vn.find(([o]) => o.test(e.upstreamId))?.[1] ?? "mdi:information-outline", wn = (e) => {
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
}, $n = (e) => {
  const t = {}, o = new Set(uo(e));
  for (const a of e.sourceIds ?? [e.upstreamId])
    for (const r of go.get(a)?.variables ?? []) {
      if (!La(e, r.name) || o.has(r.name)) continue;
      const n = wn(r.defaultValue);
      n !== void 0 && (t[r.name] = n);
    }
  return t;
}, Wa = (e, t, o) => {
  const a = e.upstreamId === "mini_graph_card" ? {
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
    label_use_temperature: !0,
    label_use_brightness: !1,
    ulm_card_dynamic_color: !1,
    room_status: [],
    room_secondary_parts: [],
    room_temperature_entity: o && /^(sensor|climate)\./.test(o) ? o : void 0,
    room_light_entity: o?.startsWith("light.") ? o : void 0
  } : e.upstreamId === "custom_card_media_player_sonos" ? {
    ulm_card_media_player_enable_art: !1,
    use_media_info: !1,
    volume_controls: ["volume_buttons"],
    media_controls: ["play_pause_stop"],
    collapsible_controls: !1,
    sonos_details_always_visible: !1,
    ...po(t, o)
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
    carousel_button_width: 58,
    carousel_button_height: 58,
    carousel_icon_size: 28,
    carousel_effect: "coverflow",
    carousel_navigation: !1,
    carousel_pagination: !1,
    carousel_pagination_type: "bullets",
    carousel_scrollbar: !1,
    carousel_grab_cursor: !0,
    carousel_centered_slides: !0,
    carousel_slides_per_view: "auto",
    carousel_coverflow_rotate: 0,
    carousel_coverflow_stretch: 0,
    carousel_coverflow_depth: 400,
    carousel_coverflow_modifier: 1,
    carousel_coverflow_slide_shadows: !0
  } : e.upstreamId === "custom_card_playstation" ? {
    console_platform: "auto",
    console_show_artwork: !0,
    console_show_controls: !0,
    ...ho(t, o)
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
  } : {};
  return {
    type: `custom:${e.tag}`,
    ...$n(e),
    ...a,
    entity: o,
    entities: e.upstreamId === "mini_graph_card" && o ? [o] : void 0,
    waste_streams: e.upstreamId === "custom_card_trash" ? jr() : void 0,
    show_today: e.upstreamId === "custom_card_trash" ? !1 : void 0,
    show_tomorrow: e.upstreamId === "custom_card_trash" ? !1 : void 0,
    name: void 0,
    icon: void 0,
    show_icon: !0,
    show_state: e.upstreamId !== "custom_card_pollen",
    layout: "default"
  };
}, xn = {
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
}, lt = (e, t = "") => {
  const o = t ? e?.states[t] : void 0, a = t.split(".", 1)[0];
  return {
    entity: t,
    name: o?.attributes.friendly_name,
    icon: o?.attributes.icon ?? xn[a] ?? "mdi:gesture-tap-button",
    icon_type: o?.attributes.entity_picture ? "entity-picture" : "icon",
    color: "purple",
    tap_action: { action: "toggle" }
  };
}, Sn = (e, t) => {
  if (!e) return { items: [] };
  const o = (c) => c.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ""), a = (c) => {
    const u = e.entities?.[c];
    return u?.area_id ?? (u?.device_id ? e.devices?.[u.device_id]?.area_id : void 0) ?? void 0;
  }, r = Object.values(e.states).filter((c) => !["unknown", "unavailable"].includes(c.state.toLowerCase())), n = /* @__PURE__ */ new Map();
  for (const c of r.filter((u) => u.entity_id.startsWith("scene."))) {
    const u = c.attributes.group_name, _ = e.entities?.[c.entity_id]?.platform === "hue";
    if (_ && c.attributes.group_type === "zone") continue;
    const m = c.attributes.entity_id ?? c.attributes.entities, h = Array.isArray(m) ? m.filter((M) => typeof M == "string") : typeof m == "string" ? m.split(",").map((M) => M.trim()) : m && typeof m == "object" ? Object.keys(m) : [];
    if (h.some((M) => !M.startsWith("light."))) continue;
    const y = new Set(h.map(a)), w = typeof u == "string" ? Object.values(e.areas ?? {}).find((M) => o(M.name) === o(u)) : void 0, f = (h.length && y.size === 1 ? a(h[0]) : void 0) ?? w?.area_id ?? (_ && typeof u != "string" ? a(c.entity_id) : void 0);
    if (h.length && (y.size > 1 || y.has(void 0)) || !h.length && !_) continue;
    const v = (f ? e.areas?.[f]?.name : void 0) ?? (_ && typeof u == "string" ? u : void 0), $ = f ? `area:${f}` : v ? `group:${o(v)}` : void 0;
    if (!$) continue;
    const b = n.get($) ?? { area: f, name: v, scenes: [] };
    b.scenes.push(c.entity_id), n.set($, b);
  }
  const i = t ? a(t) : void 0, l = [...n.values()].sort((c, u) => +!!(i && u.area === i) - +!!(i && c.area === i) || Math.min(7, u.scenes.length) - Math.min(7, c.scenes.length))[0];
  return l ? {
    entity: r.find((c) => c.entity_id.startsWith("light.") && (l.area ? a(c.entity_id) === l.area : l.name && o(c.attributes.friendly_name ?? "") === o(l.name)))?.entity_id ?? l.scenes[0],
    name: l.name,
    items: l.scenes.slice(0, 7).map((c) => ({
      entity: c,
      name: e.states[c].attributes.friendly_name,
      color: "primary",
      tap_action: { action: "perform-action", perform_action: "scene.turn_on", target: { entity_id: c } }
    }))
  } : { items: [] };
}, Ga = (e) => {
  if (typeof e != "number" && (typeof e != "string" || !e.trim())) return;
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, Qo = (e, t) => {
  if (Pe(t)) return;
  const o = t.attributes, a = [
    o.current_temperature,
    o.temperature,
    o.device_temperature,
    t.entity_id.startsWith("sensor.") ? t.state : void 0
  ].map(Ga).find((n) => n !== void 0), r = o.unit_of_measurement ?? (t.entity_id.startsWith("climate.") || o.device_class === "temperature" || o.current_temperature !== void 0 || o.device_temperature !== void 0 || o.temperature !== void 0 ? e.config?.unit_system?.temperature : void 0);
  return a !== void 0 && typeof r == "string" && ["°C", "°F", "K"].includes(r.trim()) ? `${a} ${r.trim()}` : void 0;
}, ea = (e) => {
  if (Pe(e) || !e.entity_id.startsWith("light.")) return;
  const t = Ga(e.attributes.brightness);
  return t !== void 0 && t >= 0 && t <= 255 ? `${Math.round(t / 255 * 100)}%` : void 0;
}, Ua = (e, t) => {
  const o = e.room_light_entity || e.room_brightness_entity || (e.entity?.startsWith("light.") ? e.entity : void 0);
  return o ? t.states[o] : void 0;
}, kn = (e, t) => {
  const o = e.entity ? t.states[e.entity] : void 0, a = e.secondary_info;
  if (a === "none") return;
  if (a === "custom") return e.secondary || void 0;
  if (a === "composed")
    return (e.room_secondary_parts ?? []).map((l) => {
      switch (l.type) {
        case "text":
          return l.text?.trim();
        case "name":
          return o?.attributes.friendly_name || o?.entity_id;
        case "state":
          return Pe(o) ? void 0 : A(o);
        case "brightness":
          return ea(o);
        case "temperature":
          return Qo(t, o);
        case "attribute": {
          if (Pe(o) || !l.attribute) return;
          const s = o.attributes[l.attribute];
          return typeof s == "string" && s.trim() && !["unknown", "unavailable"].includes(s) || typeof s == "number" && Number.isFinite(s) || typeof s == "boolean" ? String(s) : void 0;
        }
      }
    }).filter(Boolean).join(" · ") || void 0;
  if (a === "name") return ue(e, o, t);
  if (a === "last-changed" || a === "last-updated") {
    const l = a === "last-changed" ? o?.last_changed : o?.last_updated;
    return l ? new Date(l).toLocaleString() : a === "last-changed" ? "Last changed unavailable" : "Last updated unavailable";
  }
  if (a !== "state" && e.secondary) return e.secondary;
  const r = e.label_use_temperature !== !1 ? Qo(t, e.room_temperature_entity ? t.states[e.room_temperature_entity] : o) : void 0, n = e.label_use_brightness === !0 ? ea(Ua(e, t)) : void 0, i = [...new Set([r, n].filter((l) => !!l))];
  return a === "state" ? [.../* @__PURE__ */ new Set([A(o), ...i])].join(" · ") : i.join(" · ") || A(o);
}, nt = 4, Ka = ["window", "door", "motion", "water", "smoke"], ct = (e) => {
  const t = e?.attributes.device_class;
  return t === "window" ? "window" : t === "door" || t === "garage_door" || t === "opening" ? "door" : t === "moisture" ? "water" : t === "smoke" || t === "fire" ? "smoke" : "motion";
}, Pe = (e) => !e || ["unknown", "unavailable"].includes(e.state), yo = (e, t) => Pe(e) ? !1 : {
  window: ["on", "open", "opening"],
  door: ["on", "open", "opening"],
  motion: ["on", "motion", "detected", "occupied", "home", "active"],
  water: ["on", "wet", "moisture", "detected", "water", "leak"],
  smoke: ["on", "smoke", "fire", "detected", "alarm"]
}[t].includes(e.state.toLowerCase()), bo = (e, t) => ({
  window: t ? "mdi:window-open-variant" : "mdi:window-closed-variant",
  door: t ? "mdi:door-open" : "mdi:door-closed",
  motion: t ? "mdi:motion-sensor" : "mdi:motion-sensor-off",
  water: t ? "mdi:water-alert" : "mdi:water-check",
  smoke: t ? "mdi:smoke-detector-alert" : "mdi:smoke-detector"
})[e], qa = (e, t = "") => {
  if (e?.attributes.icon) return e.attributes.icon;
  const o = String(e?.attributes.device_class ?? "");
  if (["window", "door", "garage_door", "opening", "motion", "occupancy", "presence", "moisture", "smoke", "fire"].includes(o)) {
    const n = ct(e);
    return bo(n, yo(e, n));
  }
  const a = {
    temperature: "mdi:thermometer",
    humidity: "mdi:water-percent",
    illuminance: "mdi:brightness-5",
    battery: "mdi:battery",
    power: "mdi:flash",
    energy: "mdi:lightning-bolt",
    carbon_monoxide: "mdi:molecule-co",
    gas: "mdi:gas-cylinder",
    safety: "mdi:shield-check",
    connectivity: "mdi:wifi",
    problem: "mdi:alert-circle",
    vibration: "mdi:vibrate"
  }, r = {
    light: "mdi:lightbulb",
    switch: "mdi:toggle-switch",
    input_boolean: "mdi:toggle-switch",
    sensor: "mdi:eye",
    binary_sensor: "mdi:radiobox-marked",
    cover: "mdi:window-shutter",
    climate: "mdi:thermostat",
    fan: "mdi:fan",
    media_player: "mdi:play-circle",
    person: "mdi:account",
    device_tracker: "mdi:account",
    lock: "mdi:lock",
    scene: "mdi:palette",
    script: "mdi:script-text",
    button: "mdi:gesture-tap-button",
    input_button: "mdi:gesture-tap-button",
    group: "mdi:lightbulb-group",
    automation: "mdi:robot",
    input_select: "mdi:form-dropdown"
  };
  return a[o] ?? r[(e?.entity_id ?? t).split(".")[0]] ?? "mdi:information-outline";
}, dt = (e, t = "") => {
  const o = e?.states[t], a = t.split(".")[0], r = ["sensor", "binary_sensor", "person", "device_tracker"].includes(a);
  return {
    entity: t,
    icon: qa(o, t),
    icon_type: o?.attributes.entity_picture ? "entity-picture" : "icon",
    active_state: a === "media_player" ? "playing" : a === "cover" ? "open" : a === "person" || a === "device_tracker" ? "home" : a === "lock" ? "unlocked" : "on",
    color: "blue",
    tap_action: { action: r ? "more-info" : "toggle" },
    hold_action: { action: "more-info" },
    double_tap_action: { action: "none" }
  };
}, fo = (e, t, o = /* @__PURE__ */ new Set()) => {
  if (!t || t.state !== "on" || o.has(t.entity_id)) return;
  o.add(t.entity_id);
  const a = t.attributes.rgb_color;
  if (Array.isArray(a) && a.length === 3 && a.every((n) => typeof n == "number" && Number.isFinite(n) && n >= 0 && n <= 255))
    return a;
  const r = t.attributes.entity_id;
  if (Array.isArray(r))
    for (const n of r) {
      if (typeof n != "string") continue;
      const i = fo(e, e.states[n], o);
      if (i) return i;
    }
};
var Mn = Object.defineProperty, An = Object.getOwnPropertyDescriptor, vo = (e, t, o, a) => {
  for (var r = a > 1 ? void 0 : a ? An(t, o) : t, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = (a ? i(t, o, r) : i(r)) || r);
  return a && r && Mn(t, o, r), r;
};
const Cn = [
  { id: "primary", title: "Primary entity presentation", icon: "mdi:account-circle-outline" },
  { id: "climate", title: "Climate", icon: "mdi:thermometer" },
  { id: "sensors", title: "Sensor status", icon: "mdi:shield-check-outline" },
  { id: "devices", title: "Device controls", icon: "mdi:gesture-tap" },
  { id: "actions", title: "Card interactions", icon: "mdi:gesture-tap-button" }
], In = (e) => e === "temperature" || e === "humidity" || e.startsWith("climate_") ? "climate" : ["group_motions", "group_doors", "group_windows", "group_water"].includes(e) ? "sensors" : ["group_lights", "group_windows_shutters", "group_outlets", "group_tv"].includes(e) || /^(lights|shutters|outlets|tv)_/.test(e) ? "devices" : Xa.has(e) ? "actions" : "primary", Ya = (e, t) => e.flatMap((o) => {
  if (!o.schema) return In(o.name) === t ? [o] : [];
  const a = Ya(o.schema, t);
  return a.length ? [{ ...o, schema: a }] : [];
}), En = [
  { id: "context", title: "Context", icon: "mdi:shape-outline" },
  { id: "content", title: "Content", icon: "mdi:format-align-left" },
  { id: "layout", title: "Layout", icon: "mdi:view-dashboard-outline" },
  { id: "interactions", title: "Interactions", icon: "mdi:gesture-tap" },
  { id: "features", title: "Features", icon: "mdi:view-list" }
], Pn = /* @__PURE__ */ new Set([
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
]), zn = /* @__PURE__ */ new Set([
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
  "carousel_button_width",
  "carousel_button_height",
  "carousel_icon_size",
  "carousel_effect",
  "carousel_grab_cursor",
  "carousel_centered_slides",
  "carousel_slides_per_view",
  "carousel_coverflow_rotate",
  "carousel_coverflow_stretch",
  "carousel_coverflow_depth",
  "carousel_coverflow_modifier",
  "carousel_coverflow_slide_shadows",
  "carousel_navigation",
  "carousel_pagination",
  "carousel_pagination_type",
  "carousel_scrollbar"
]), Xa = /* @__PURE__ */ new Set([
  "tap_action",
  "hold_action",
  "double_tap_action",
  "navigation_path",
  "settings_path"
]), ta = {
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
    [["lights", "Lights"], ["shutters", "Shutters"], ["outlets", "Outlets"], ["tv", "Television"]].flatMap(([e, t]) => [["tap", "tap"], ["hold", "hold"], ["double_tap", "double tap"]].map(([o, a]) => [`${e}_${o}_action`, `${t}: ${a} action`]))
  )
}, oa = (e) => e.name === "entity" ? "context" : Xa.has(e.name) || e.name.endsWith("_action") ? "interactions" : zn.has(e.name) || e.name.endsWith("_horizontal") || e.name.endsWith("_narrow_buttons") ? "layout" : Pn.has(e.name) ? "content" : "features", Tn = (e) => {
  const t = {
    context: [],
    content: [],
    layout: [],
    interactions: [],
    features: []
  };
  for (const o of e) {
    if (!o.schema?.length) {
      t[oa(o)].push(o);
      continue;
    }
    const a = /* @__PURE__ */ new Map();
    for (const r of o.schema) {
      const n = oa(r);
      a.set(n, [...a.get(n) ?? [], r]);
    }
    for (const [r, n] of a) t[r].push({ ...o, schema: n });
  }
  return t;
};
let gt = class extends $e {
  constructor() {
    super(...arguments), this.computeLabel = (e) => this.config?.type.includes("custom-card-roomview") && ta[e.name] ? ta[e.name] : this.config?.type.includes("custom-card-trash") && e.name === "entity" ? "Optional card entity" : this.config?.type.includes("custom-card-washer") && e.name === "entity" ? G(this.hass, "machine_state_entity") : G(this.hass, e.name), this.computeHelper = (e) => Qr(
      this.config?.type.includes("custom-card-washer") && e.name === "entity" ? "machine_state_entity" : e.name
    ), this.valueChanged = (e) => {
      if (!this.config || !e.detail.value) return;
      const t = e.detail.value, o = { ...this.config, ...t }, a = Object.prototype.hasOwnProperty.call(t, "icon") && !t.icon ? Uo(o) : o;
      if (this.config.type.includes("mini-graph-card")) {
        const r = { ...this.config.show }, n = {
          mini_graph_show_legend: "legend",
          mini_graph_show_average: "average",
          mini_graph_show_extrema: "extrema",
          mini_graph_name_adaptive_color: "name_adaptive_color",
          mini_graph_icon_adaptive_color: "icon_adaptive_color",
          mini_graph_loading_indicator: "loading_indicator"
        };
        for (const [i, l] of Object.entries(n))
          Object.prototype.hasOwnProperty.call(t, i) && (Object.assign(r, { [l]: t[i] }), delete a[i]);
        typeof t.mini_graph_show_state == "string" && (r.state = t.mini_graph_show_state === "last" ? "last" : t.mini_graph_show_state !== "hidden", delete a.mini_graph_show_state);
        for (const [i, l] of [
          ["mini_graph_show_fill", "fill"],
          ["mini_graph_show_points", "points"],
          ["mini_graph_show_labels", "labels"],
          ["mini_graph_show_labels_secondary", "labels_secondary"]
        ]) {
          const s = t[i];
          typeof s == "string" && (Object.assign(r, {
            [l]: s === "fade" ? "fade" : s === "hover" ? "hover" : s !== "hidden"
          }), delete a[i]);
        }
        if ((t.variant === "line" || t.variant === "bar") && (r.graph = t.variant), a.show = r, typeof t.entity == "string" && t.entity !== this.config.entity) {
          const i = this.miniGraphEntities();
          i.length ? i[0] = { ...i[0], entity: t.entity } : i.push({ entity: t.entity }), a.entities = i;
        }
      }
      if (Object.prototype.hasOwnProperty.call(t, "name") && JSON.stringify(t.name) !== JSON.stringify(this.config.name) && delete a.name_mode, this.config.type.includes("media-player-sonos") && typeof t.entity == "string" && t.entity !== this.config.entity)
        for (const { configKey: r } of mo)
          this.config[r] === void 0 && delete a[r];
      if (this.config.type.includes("custom-card-playstation") && typeof t.entity == "string" && t.entity !== this.config.entity)
        for (const { configKey: r } of Ta)
          this.config[r] === void 0 && delete a[r];
      this.config = a, _e(this, "config-changed", { config: a });
    }, this.addMiniGraphEntity = () => {
      const e = this.miniGraphEntities(), t = new Set(e.map((a) => a.entity)), o = Object.keys(this.hass?.states ?? {}).find((a) => !t.has(a) && ["sensor", "binary_sensor", "input_number"].includes(a.split(".", 1)[0])) ?? "";
      e.push({ entity: o, show_graph: !0, show_line: !0, show_fill: !0, show_points: !0, show_legend: !0 }), this.updateMiniGraphConfig({ entities: e });
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
        ...Le(this.config),
        { enabled: !0, entity: "", label: "Custom waste", icon: "mdi:trash-can", color: "#43a047" }
      ]);
    }, this.addCarouselItem = () => {
      this.config && this.updateCarouselItems([
        ...this.config.carousel_items ?? [],
        {
          entity: "",
          color: "primary"
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
    const t = e.type.replace(/^custom:/, ""), o = lo.find((a) => a.tag === t);
    this.config = {
      ...Ia(e),
      variant: e.variant ?? o?.variant
    };
  }
  render() {
    if (!this.hass || !this.config) return p;
    const e = co(this.config.type.replace(/^custom:/, ""));
    if (!e) return p;
    const t = ja(e, this.config), o = fn(e, this.config).filter((c) => e.upstreamId !== "custom_card_trash" || !c.name.startsWith("ulm_card_datum_") && !c.name.includes("ophaling")), a = Tn([...t, ...o]), r = Wa(e, this.hass, this.config.entity), n = this.config.show, i = {
      ...r,
      ...this.config,
      ...e.upstreamId === "custom_card_media_player_sonos" ? {
        ulm_card_media_player_power_button: this.config.ulm_card_media_player_power_button ?? this.config.media_controls?.includes("on_off") ?? !1,
        media_controls: (this.config.media_controls ?? r.media_controls)?.filter((c) => c !== "on_off")
      } : {},
      ...e.upstreamId === "custom_card_roomview" ? {
        climate_icon_type: this.config.climate_icon_type ?? "icon",
        climate_primary_info: this.config.climate_primary_info ?? (this.config.climate_name ? "name" : "state"),
        ...Object.fromEntries(["lights", "shutters", "outlets", "tv"].flatMap((c) => ["tap", "hold", "double_tap"].map((u) => {
          const _ = `${c}_${u}_action`;
          return [_, this.config[_] ?? { action: u === "double_tap" ? "toggle" : "more-info" }];
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
        carousel_navigation: qe(this.config, "navigation"),
        carousel_pagination: qe(this.config, "pagination"),
        carousel_scrollbar: qe(this.config, "scrollbar"),
        carousel_pagination_type: this.config.carousel_pagination_type ?? (this.config.parameters?.pagination && typeof this.config.parameters.pagination == "object" ? this.config.parameters.pagination.type : void 0) ?? "bullets",
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
        ${Cn.map((c) => this.renderEditorSection(
        c,
        Ya([...t, ...o], c.id),
        i,
        p,
        !1
      ))}
      </div>`;
    const l = e.upstreamId === "mini_graph_card" ? this.renderMiniGraphEditors() : e.upstreamId === "custom_card_trash" ? this.renderWasteStreamEditor() : e.upstreamId === "custom_card_media_player_sonos" ? this.renderSonosShortcutEditor() : e.upstreamId === "custom_card_entity_carousel" ? this.renderCarouselItemEditor() : e.family === "scene" ? this.renderItemEditor(
      "scene_items",
      "Scene buttons",
      e.upstreamId === "card_welcome_scenes" ? void 0 : ["scene"]
    ) : e.upstreamId === "card_room" ? d`${this.renderItemEditor("room_sensors", G(this.hass, "room_buttons"))}${this.renderRoomStatusEditor()}` : p, s = e.upstreamId === "mini_graph_card" || e.upstreamId === "custom_card_trash" || e.upstreamId === "custom_card_media_player_sonos" || e.upstreamId === "custom_card_entity_carousel" || e.family === "scene" || e.upstreamId === "card_room";
    return d`
      <div class="editor-sections">
        ${En.map((c) => this.renderEditorSection(
      c,
      a[c.id],
      i,
      c.id === "features" && s ? l : c.id === "content" && e.upstreamId === "custom_card_entity_carousel" ? d`
              <button @click=${() => {
        const u = Uo(this.config);
        this.config = u, _e(this, "config-changed", { config: u });
      }}>Use entity icon</button>
            ` : c.id === "content" && e.upstreamId === "card_room" ? this.renderRoomSecondaryEditor() : p,
      c.id === "features" && s || c.id === "content" && e.upstreamId === "card_room" && this.config?.secondary_info === "composed"
    ))}
      </div>
    `;
  }
  renderEditorSection(e, t, o, a, r) {
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
              .data=${o}
              .schema=${t}
              .computeLabel=${this.computeLabel}
              .computeHelper=${this.computeHelper}
              @value-changed=${this.valueChanged}
            ></ha-form>
          ` : p}
          ${a}
        </div>
      </ha-expansion-panel>
    `;
  }
  renderItemEditor(e, t, o) {
    if (!this.config) return p;
    const a = this.config[e], n = ((e === "scene_items" ? a?.length ? a : void 0 : a) ?? (this.config.entities ?? []).map((i) => ({ entity: i }))).map((i) => e === "scene_items" ? { ...lt(this.hass, i.entity), ...i } : { ...dt(this.hass, i.entity), ...i });
    return d`
      <section class="item-editor">
        <h3>${t}</h3>
        <p>${e === "scene_items" ? "Each button starts with sensible values from its entity. You can override every value, including its name." : G(this.hass, "room_buttons_help")}</p>
        ${n.map((i, l) => d`
          <div class="item-row">
            <label class="field wide">
              <span>Button entity</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: o?.length ? { domain: o } : {} }}
                .value=${i.entity}
                @value-changed=${(s) => this.updateItem(e, l, "entity", s.detail.value)}
              ></ha-selector>
              <small>${e === "scene_items" ? "Select the entity this button controls. Welcome Scenes supports every Home Assistant domain." : "Select the entity represented by this room sensor button."}</small>
            </label>
            ${e === "scene_items" ? d`<label class="field">
              <span>Custom name</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${i.name ?? i.label ?? ""}
                @value-changed=${(s) => this.updateItem(e, l, "name", s.detail.value)}
              ></ha-selector>
              <small>Text shown below the button. Change it independently for every button.</small>
            </label>` : p}
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${i.icon}
                @value-changed=${(s) => this.updateItem(e, l, "icon", s.detail.value)}
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
                  .value=${i.icon_type ?? "icon"}
                  @value-changed=${(s) => this.updateItem(e, l, "icon_type", s.detail.value)}
                ></ha-selector>
                <small>Show the selected icon or the entity picture when one is available.</small>
              </label>
            ` : p}
            <label class="field">
              <span>Color</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: { default_color: e === "room_sensors" ? "blue" : "purple" } }}
                .value=${i.color}
                @value-changed=${(s) => this.updateItem(e, l, "color", s.detail.value)}
              ></ha-selector>
              <small>Accent color used by the button and its active state.</small>
            </label>
            ${e === "scene_items" ? d`
              <label class="field">
                <span>Navigation path</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{ navigation: {} }}
                  .value=${i.navigation_path ?? i.nav_path ?? ""}
                  @value-changed=${(s) => this.updateItem(e, l, "navigation_path", s.detail.value)}
                ></ha-selector>
                <small>Optional destination selected from your Home Assistant dashboards. It overrides the tap action.</small>
              </label>
            ` : p}
            ${e === "room_sensors" ? d`
              <label class="field">
                <span>${G(this.hass, "active_state")}</span>
                <ha-selector .hass=${this.hass} .selector=${{ text: {} }} .value=${i.active_state}
                  @value-changed=${(s) => this.updateItem(e, l, "active_state", s.detail.value)}></ha-selector>
                <small>${G(this.hass, "room_active_state_help")}</small>
              </label>
              ${["hold_action", "double_tap_action"].map((s) => d`
                <label class="field">
                  <span>${G(this.hass, s)}</span>
                  <ha-selector .hass=${this.hass} .selector=${{ ui_action: {} }} .value=${i[s]}
                    @value-changed=${(c) => this.updateItem(e, l, s, c.detail.value)}></ha-selector>
                </label>
              `)}
            ` : p}
            <label class="field">
              <span>Tap action</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_action: {} }}
                .value=${i.tap_action}
                @value-changed=${(s) => this.updateItem(e, l, "tap_action", s.detail.value)}
              ></ha-selector>
              <small>${e === "scene_items" ? "Defaults to activating scenes and toggling other supported entities." : G(this.hass, "room_button_action_help")}</small>
            </label>
            <div class="item-actions wide">
              ${e === "room_sensors" ? d`
                <button class="move-up" ?disabled=${l === 0}
                  @click=${() => this.moveRoomSensor(l, -1)}>${G(this.hass, "room_move_up")}</button>
                <button class="move-down" ?disabled=${l === n.length - 1}
                  @click=${() => this.moveRoomSensor(l, 1)}>${G(this.hass, "room_move_down")}</button>
              ` : p}
              <button @click=${() => this.removeItem(e, l)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${() => this.addItem(e)}>Add button</button>
      </section>
    `;
  }
  renderRoomSecondaryEditor() {
    if (this.config?.secondary_info !== "composed") return p;
    const e = this.config.room_secondary_parts ?? [], t = ["text", "name", "state", "brightness", "temperature", "attribute"];
    return d`<section class="item-editor room-secondary-editor">
      <p>${G(this.hass, "room_secondary_help")}</p>
      ${e.map((o, a) => d`<div class="item-row">
        <label class="field">
          <span>${G(this.hass, "room_secondary_value")}</span>
          <ha-selector .hass=${this.hass} .selector=${{ select: { mode: "dropdown", options: t.map((r) => ({
      value: r,
      label: G(this.hass, `room_part_${r}`)
    })) } }} .value=${o.type}
            @value-changed=${(r) => {
      t.includes(r.detail.value) && this.updateRoomSecondaryPart(a, { type: r.detail.value });
    }}></ha-selector>
        </label>
        ${o.type === "text" || o.type === "attribute" ? d`<label class="field">
          <span>${G(this.hass, `room_part_${o.type}`)}</span>
          <ha-selector .hass=${this.hass}
            .selector=${o.type === "attribute" ? { attribute: { entity_id: this.config?.entity } } : { text: {} }}
            .value=${o.type === "text" ? o.text ?? "" : o.attribute ?? ""}
            @value-changed=${(r) => {
      this.updateRoomSecondaryPart(a, o.type === "text" ? { type: "text", text: r.detail.value } : { type: "attribute", attribute: r.detail.value });
    }}></ha-selector>
        </label>` : p}
        <div class="item-actions wide">
          <button class="move-up" ?disabled=${a === 0}
            @click=${() => this.moveRoomSecondary(a, -1)}>${G(this.hass, "room_move_up")}</button>
          <button class="move-down" ?disabled=${a === e.length - 1}
            @click=${() => this.moveRoomSecondary(a, 1)}>${G(this.hass, "room_move_down")}</button>
          <button class="remove" @click=${() => this.saveRoomSecondary((this.config?.room_secondary_parts ?? []).filter((r, n) => n !== a))}>${G(this.hass, "room_part_remove")}</button>
        </div>
      </div>`)}
      <button class="add" @click=${() => this.saveRoomSecondary([...this.config?.room_secondary_parts ?? [], { type: "state" }])}>${G(this.hass, "room_part_add")}</button>
    </section>`;
  }
  saveRoomSecondary(e) {
    this.config && (this.config = { ...this.config, room_secondary_parts: e }, _e(this, "config-changed", { config: this.config }));
  }
  updateRoomSecondaryPart(e, t) {
    const o = [...this.config?.room_secondary_parts ?? []];
    o[e] = t, this.saveRoomSecondary(o);
  }
  moveRoomSecondary(e, t) {
    const o = [...this.config?.room_secondary_parts ?? []], a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.saveRoomSecondary(o));
  }
  moveRoomSensor(e, t) {
    if (!this.config) return;
    const o = [...this.config.room_sensors ?? (this.config.entities ?? []).map((r) => ({ entity: r }))], a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.updateItems("room_sensors", o));
  }
  renderRoomStatusEditor() {
    const e = (this.config?.room_status ?? []).slice(0, nt);
    return d`<section class="item-editor room-status-editor">
      <h3>${G(this.hass, "room_status")}</h3>
      <p>${G(this.hass, "room_status_help")}</p>
      ${e.map((t, o) => {
      const a = this.hass?.states[t.entity], r = t.kind ?? ct(a);
      return d`<div class="item-row">
          <label class="field">
            <span>${G(this.hass, "entity")}</span>
            <ha-selector .hass=${this.hass} .selector=${{ entity: {} }} .value=${t.entity}
              @value-changed=${(n) => this.updateRoomStatus(o, "entity", n.detail.value)}></ha-selector>
          </label>
          <label class="field">
            <span>${G(this.hass, "room_status_kind")}</span>
            <ha-selector .hass=${this.hass} .selector=${{ select: { mode: "dropdown", options: Ka.map((n) => ({
        value: n,
        label: G(this.hass, `room_status_${n}`)
      })) } }} .value=${r}
              @value-changed=${(n) => this.updateRoomStatus(o, "kind", n.detail.value)}></ha-selector>
          </label>
          <span class="room-status-preview wide" aria-label=${G(this.hass, "room_status_preview")}>
            <ha-icon .icon=${a?.attributes.icon || bo(r, yo(a, r))}></ha-icon>
            ${a?.attributes.friendly_name || t.entity || G(this.hass, "room_status_choose_entity")}
          </span>
          <div class="item-actions wide"><button @click=${() => this.removeRoomStatus(o)}>${G(this.hass, "room_status_remove")}</button></div>
        </div>`;
    })}
      <button class="add" ?disabled=${e.length >= nt}
        @click=${() => this.saveRoomStatus([...e, { entity: "", kind: "window" }])}>${G(this.hass, "room_status_add")}</button>
    </section>`;
  }
  updateRoomStatus(e, t, o) {
    const a = [...this.config?.room_status ?? []].slice(0, nt), r = a[e];
    if (!r) return;
    const n = { ...r, [t]: o };
    if (t === "entity") {
      const i = ct(this.hass?.states[r.entity]);
      (!r.entity || r.kind === void 0 || r.kind === i) && (n.kind = ct(this.hass?.states[o]));
    }
    a[e] = n, this.saveRoomStatus(a);
  }
  removeRoomStatus(e) {
    this.saveRoomStatus((this.config?.room_status ?? []).filter((t, o) => o !== e));
  }
  saveRoomStatus(e) {
    this.config && (this.config = { ...this.config, room_status: e.slice(0, nt) }, _e(this, "config-changed", { config: this.config }));
  }
  miniGraphEntities() {
    const e = this.config?.entities, o = (Array.isArray(e) ? e : []).flatMap((a) => typeof a == "string" ? [{ entity: a }] : a && typeof a == "object" && typeof a.entity == "string" ? [{ ...a }] : []);
    return !o.length && this.config?.entity && o.push({ entity: this.config.entity }), o;
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
    const e = this.miniGraphEntities(), t = this.miniGraphThresholds(), o = this.miniGraphStateMap(), a = [
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
                .selector=${{ select: { mode: "dropdown", options: a } }}
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
        ${o.map((n, i) => d`
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
              <button ?disabled=${i === o.length - 1}
                @click=${() => this.moveMiniGraphState(i, 1)}>Move down</button>
              <button @click=${() => this.removeMiniGraphState(i)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addMiniGraphState}>Add state mapping</button>
      </section>
    `;
  }
  updateMiniGraphEntity(e, t, o) {
    const a = this.miniGraphEntities();
    a[e] = { ...a[e], [t]: o === "" ? void 0 : o }, this.updateMiniGraphConfig({
      entities: a,
      entity: a[0]?.entity
    });
  }
  removeMiniGraphEntity(e) {
    const t = this.miniGraphEntities().filter((o, a) => a !== e);
    this.updateMiniGraphConfig({
      entities: t,
      entity: t[0]?.entity
    });
  }
  moveMiniGraphEntity(e, t) {
    const o = this.miniGraphEntities(), a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.updateMiniGraphConfig({
      entities: o,
      entity: o[0]?.entity
    }));
  }
  updateMiniGraphThreshold(e, t, o) {
    const a = this.miniGraphThresholds();
    a[e] = {
      ...a[e],
      [t]: o === "" || o === void 0 ? void 0 : o
    }, this.updateMiniGraphConfig({ color_thresholds: a });
  }
  removeMiniGraphThreshold(e) {
    this.updateMiniGraphConfig({
      color_thresholds: this.miniGraphThresholds().filter((t, o) => o !== e)
    });
  }
  moveMiniGraphThreshold(e, t) {
    const o = this.miniGraphThresholds(), a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.updateMiniGraphConfig({ color_thresholds: o }));
  }
  updateMiniGraphState(e, t, o) {
    const a = this.miniGraphStateMap();
    a[e] = { ...a[e], [t]: o === "" ? void 0 : o }, this.updateMiniGraphConfig({ state_map: a });
  }
  removeMiniGraphState(e) {
    this.updateMiniGraphConfig({
      state_map: this.miniGraphStateMap().filter((t, o) => o !== e)
    });
  }
  moveMiniGraphState(e, t) {
    const o = this.miniGraphStateMap(), a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.updateMiniGraphConfig({ state_map: o }));
  }
  updateMiniGraphConfig(e) {
    if (!this.config) return;
    const t = { ...this.config, ...e };
    this.config = t, _e(this, "config-changed", { config: t });
  }
  renderWasteStreamEditor() {
    if (!this.config) return p;
    const e = Le(this.config);
    return d`
      <section class="item-editor waste-stream-editor">
        <h3>Waste streams</h3>
        <p>Each enabled row uses its own sensor or calendar entity. Empty or disabled rows are omitted from the card.</p>
        ${e.map((t, o) => d`
          <div class="item-row waste-stream-row" data-stream-index=${o}>
            <h4>${t.label || `Waste stream ${o + 1}`}</h4>
            <label class="field">
              <span>Show this waste stream</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ boolean: {} }}
                .value=${t.enabled !== !1}
                @value-changed=${(a) => this.updateWasteStream(o, "enabled", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>Collection date entity</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: { domain: ["sensor", "calendar"] } }}
                .value=${t.entity}
                @value-changed=${(a) => this.updateWasteStream(o, "entity", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Label</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${t.label ?? ""}
                @value-changed=${(a) => this.updateWasteStream(o, "label", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${t.icon}
                @value-changed=${(a) => this.updateWasteStream(o, "icon", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Color</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: { default_color: "green" } }}
                .value=${t.color}
                @value-changed=${(a) => this.updateWasteStream(o, "color", a.detail.value)}
              ></ha-selector>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${o === 0} @click=${() => this.moveWasteStream(o, -1)}>Move up</button>
              <button ?disabled=${o === e.length - 1} @click=${() => this.moveWasteStream(o, 1)}>Move down</button>
              <button @click=${() => this.removeWasteStream(o)}>Remove</button>
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
              @value-changed=${(o) => this.updateSonosColumns(o.detail.value)}
            ></ha-selector>
            <small>Number of shortcut buttons shown on each row.</small>
          </label>
        </div>
        ${e.map((o, a) => d`
          <div class="item-row sonos-shortcut-row" data-shortcut-index=${a}>
            <h4>${o.name || `Shortcut ${a + 1}`}</h4>
            <label class="field">
              <span>Label</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${o.name ?? ""}
                @value-changed=${(r) => this.updateSonosShortcut(a, "name", r.detail.value)}
              ></ha-selector>
              <small>Optional text shown below the icon.</small>
            </label>
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${o.icon ?? "mdi:playlist-music"}
                @value-changed=${(r) => this.updateSonosShortcut(a, "icon", r.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Media type</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${o.type ?? "playlist"}
                @value-changed=${(r) => this.updateSonosShortcut(a, "type", r.detail.value)}
              ></ha-selector>
              <small>Use playlist for Spotify playlist IDs, or another media type supported by your player.</small>
            </label>
            <label class="field wide">
              <span>Playlist or media ID</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${o.id ?? ""}
                @value-changed=${(r) => this.updateSonosShortcut(a, "id", r.detail.value)}
              ></ha-selector>
              <small>For example: spotify:playlist:4Peff17x9lxkDupqOF0ive</small>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${a === 0} @click=${() => this.moveSonosShortcut(a, -1)}>Move up</button>
              <button ?disabled=${a === e.length - 1}
                @click=${() => this.moveSonosShortcut(a, 1)}>Move down</button>
              <button @click=${() => this.removeSonosShortcut(a)}>Remove</button>
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
        ${e.map((t, o) => d`
          <div class="item-row carousel-item-row" data-carousel-index=${o}>
            <h4>${t.name || t.entity || `Item ${o + 1}`}</h4>
            <label class="field wide">
              <span>Entity</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: {} }}
                .value=${t.entity ?? ""}
                @value-changed=${(a) => this.updateCarouselItem(o, "entity", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Label</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${t.name ?? ""}
                @value-changed=${(a) => this.updateCarouselItem(o, "name", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>Icon</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${t.icon ?? ""}
                @value-changed=${(a) => this.updateCarouselItem(o, "icon", a.detail.value)}
              ></ha-selector>
              <button @click=${() => this.updateCarouselItem(o, "icon", void 0)}>Use entity icon</button>
            </label>
            <label class="field">
              <span>Color</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: {} }}
                .value=${t.color ?? "primary"}
                @value-changed=${(a) => this.updateCarouselItem(o, "color", a.detail.value)}
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
                @value-changed=${(a) => this.updateCarouselItem(o, "icon_type", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>Tap action</span>
              <ha-selector
                .hass=${this.hass}
                .required=${!1}
                .selector=${{ ui_action: { default_action: "more-info" } }}
                .value=${t.tap_action}
                @value-changed=${(a) => this.updateCarouselItem(o, "tap_action", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>Hold action</span>
              <ha-selector
                .hass=${this.hass}
                .required=${!1}
                .selector=${{ ui_action: { default_action: "none" } }}
                .value=${t.hold_action}
                @value-changed=${(a) => this.updateCarouselItem(o, "hold_action", a.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>Double-tap action</span>
              <ha-selector
                .hass=${this.hass}
                .required=${!1}
                .selector=${{ ui_action: { default_action: "none" } }}
                .value=${t.double_tap_action}
                @value-changed=${(a) => this.updateCarouselItem(o, "double_tap_action", a.detail.value)}
              ></ha-selector>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${o === 0} @click=${() => this.moveCarouselItem(o, -1)}>Move up</button>
              <button ?disabled=${o === e.length - 1}
                @click=${() => this.moveCarouselItem(o, 1)}>Move down</button>
              <button @click=${() => this.removeCarouselItem(o)}>Remove</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addCarouselItem}>Add carousel item</button>
      </section>
    `;
  }
  updateItem(e, t, o, a) {
    if (!this.config) return;
    const r = [...this.config[e] ?? (this.config.entities ?? []).map((n) => ({ entity: n }))];
    if (o === "entity" && typeof a == "string") {
      const n = r[t], i = e === "scene_items" ? lt : dt, l = i(this.hass, n.entity), s = i(this.hass, a), c = { ...n, entity: a }, u = e === "scene_items" ? ["name", "icon", "icon_type", "color", "tap_action"] : ["icon", "icon_type", "color", "active_state", "tap_action", "hold_action", "double_tap_action"];
      for (const _ of u)
        (n[_] === void 0 || JSON.stringify(n[_]) === JSON.stringify(l[_])) && Object.assign(c, { [_]: s[_] });
      r[t] = c;
    } else
      r[t] = { ...r[t], [o]: a || void 0 };
    this.updateItems(e, r);
  }
  addItem(e) {
    if (!this.config) return;
    const t = [...this.config[e] ?? (this.config.entities ?? []).map((a) => ({ entity: a }))], o = e === "scene_items" ? Object.keys(this.hass?.states ?? {}).find((a) => a.startsWith("scene.")) ?? "" : "";
    t.push(e === "scene_items" ? lt(this.hass, o) : dt(this.hass)), this.updateItems(e, t);
  }
  removeItem(e, t) {
    if (!this.config) return;
    const o = [...this.config[e] ?? (this.config.entities ?? []).map((a) => ({ entity: a }))].filter((a, r) => r !== t);
    this.updateItems(e, o);
  }
  updateItems(e, t) {
    if (!this.config) return;
    const o = { ...this.config, [e]: t, entities: void 0 };
    this.config = o, _e(this, "config-changed", { config: o });
  }
  updateWasteStream(e, t, o) {
    if (!this.config) return;
    const a = Le(this.config);
    a[e] = {
      ...a[e],
      [t]: t === "enabled" ? o !== !1 : o || void 0
    }, this.updateWasteStreams(a);
  }
  removeWasteStream(e) {
    this.config && this.updateWasteStreams(Le(this.config).filter((t, o) => o !== e));
  }
  moveWasteStream(e, t) {
    if (!this.config) return;
    const o = Le(this.config), a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.updateWasteStreams(o));
  }
  updateWasteStreams(e) {
    if (!this.config) return;
    const t = { ...this.config, waste_streams: e };
    this.config = t, _e(this, "config-changed", { config: t });
  }
  updateSonosColumns(e) {
    if (!this.config) return;
    const t = Math.min(8, Math.max(1, Math.round(Number(e) || 4)));
    this.updateSonosShortcuts(this.config.shortcuts?.buttons ?? [], t);
  }
  updateCarouselItem(e, t, o) {
    if (!this.config) return;
    const a = [...this.config.carousel_items ?? []], r = { ...a[e] };
    !o || t.endsWith("_action") && o.action === "default" ? delete r[t] : Object.assign(r, { [t]: o }), a[e] = r, this.updateCarouselItems(a);
  }
  removeCarouselItem(e) {
    this.config && this.updateCarouselItems(
      (this.config.carousel_items ?? []).filter((t, o) => o !== e)
    );
  }
  moveCarouselItem(e, t) {
    if (!this.config) return;
    const o = [...this.config.carousel_items ?? []], a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.updateCarouselItems(o));
  }
  updateCarouselItems(e) {
    if (!this.config) return;
    const t = { ...this.config, carousel_items: e };
    this.config = t, _e(this, "config-changed", { config: t });
  }
  updateSonosShortcut(e, t, o) {
    if (!this.config) return;
    const a = [...this.config.shortcuts?.buttons ?? []];
    a[e] = { ...a[e], [t]: o || void 0 }, this.updateSonosShortcuts(a);
  }
  removeSonosShortcut(e) {
    this.config && this.updateSonosShortcuts(
      (this.config.shortcuts?.buttons ?? []).filter((t, o) => o !== e)
    );
  }
  moveSonosShortcut(e, t) {
    if (!this.config) return;
    const o = [...this.config.shortcuts?.buttons ?? []], a = e + t;
    a < 0 || a >= o.length || ([o[e], o[a]] = [o[a], o[e]], this.updateSonosShortcuts(o));
  }
  updateSonosShortcuts(e, t = this.config?.shortcuts?.columns ?? 4) {
    if (!this.config) return;
    const o = { ...this.config, shortcuts: { columns: t, buttons: e } };
    this.config = o, _e(this, "config-changed", { config: o });
  }
};
gt.styles = Be`
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
vo([
  he({ attribute: !1 })
], gt.prototype, "hass", 2);
vo([
  re()
], gt.prototype, "config", 2);
gt = vo([
  xa("mushroom-addition-editor")
], gt);
const On = Be`
  :host {
    --ulm-blue: 3, 169, 244;
    --ulm-yellow: 255, 193, 7;
    --ulm-red: 244, 67, 54;
    --ulm-green: 76, 175, 80;
    --ulm-orange: 255, 152, 0;
    --ulm-purple: 156, 39, 176;
    --ulm-grey: 120, 120, 120;
    --addition-raised-background: var(--card-background-color, var(--ha-card-background, var(--secondary-background-color)));
    --addition-raised-shadow: 0 2px 7px rgba(0,0,0,.12);
    container-type: inline-size;
    display: block;
    min-width: 0;
  }
  :host([dark]) {
    --addition-raised-background: color-mix(in srgb, var(--primary-text-color, #fff) 7%, var(--ha-card-background, var(--card-background-color, #1c1c1c)));
    --addition-raised-shadow: 0 3px 8px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.09), 0 0 0 1px rgba(255,255,255,.04);
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
  .ulm-icon > ha-icon, .ulm-icon > ha-state-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
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
  .entity-carousel-presentation .ulm-icon > ha-state-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .entity-carousel-presentation .ulm-copy { justify-content: center; }
  .metric-value { color: rgb(var(--ulm-blue)); font-size: 20px; font-weight: 650; }
  .sparkline { width: 100%; height: 48px; overflow: visible; }
  .sparkline polyline { fill: none; stroke: var(--sparkline-color, rgb(var(--ulm-blue))); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
  .sparkline.is-filled polyline { stroke: var(--sparkline-color, rgb(var(--ulm-red))); }
  .sparkline.is-filled polygon { fill: color-mix(in srgb, var(--sparkline-fill-color, rgb(var(--ulm-red))) 18%, transparent); }
  .metric-extremes { display: flex; justify-content: space-between; color: var(--secondary-text-color); font-size: 11px; }
  .ulm-scenes { padding: 12px; }
  .scene-grid { display: flex; flex-wrap: wrap; gap: 10px; }
  .scene-button { display: flex; width: 64px; min-width: 64px; min-height: 88px; flex-direction: column; align-items: center; justify-content: space-between; gap: 5px; padding: 7px 5px 10px; border: 0; border-radius: 32px; background: var(--addition-raised-background); color: var(--primary-text-color); box-shadow: var(--addition-raised-shadow); }
  .scene-button span { width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }
  .scene-button i { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--ulm-purple), .14); font-style: normal; }
  .scene-button i > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .scene-button i { background: color-mix(in srgb, var(--item-color) 16%, transparent); }
  .scene-entity-picture { display: block; width: 100%; height: 100%; border-radius: inherit; background-position: center; background-size: cover; }
  .scene-button ha-icon { --mdc-icon-size: 22px; color: var(--item-color); }
  .scene-button.is-active { background: color-mix(in srgb, var(--item-color) 12%, var(--addition-raised-background)); }
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
  .welcome-date { justify-self: center; gap: 6px; padding: 0 14px; font-weight: 700; border: 0; background: transparent; }
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
  .media-art { position: absolute; inset: 0; z-index: 0; background-position: center; background-size: cover; }
  .media-art::after { position: absolute; inset: 0; background: rgba(0,0,0,.25); content: ""; }
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
  .room-main .ulm-icon ha-icon, .room-main .ulm-icon ha-state-icon { --mdc-icon-size: 56px; }
  .room-entities { display: flex; flex-direction: column; justify-content: flex-end; gap: 7px; }
  .room-entities .metric-pill { width: 46px; min-height: 46px; justify-content: center; overflow: hidden; padding: 0; color: transparent; }
  .room-sensor { border: 0; cursor: pointer; }
  .room-sensor > ha-icon { flex: 0 0 24px; width: 24px; height: 24px; --mdc-icon-size: 24px; color: var(--item-color); }
  .room-sensor-picture { display: block; flex: 0 0 38px; width: 38px; height: 38px; border-radius: 50%; background-position: center; background-size: cover; }
  .room-sensor.is-active { background: color-mix(in srgb, var(--item-color) 18%, transparent); }
  .room-sensor .room-sensor-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .room-sensor:disabled { cursor: default; opacity: .45; }
  .ulm-source-room.dynamic-color { background: rgba(var(--room-rgb), .2); }
  .ulm-source-room.dynamic-color .room-main > .ulm-icon { color: rgb(var(--room-rgb)); background: rgba(var(--room-rgb), .3); }
  .room-status { display: flex; flex: 0 0 25px; max-width: 100%; overflow: hidden; gap: 5px; }
  .room-status-indicator { display: grid; flex: 0 0 25px; place-items: center; width: 25px; height: 25px; padding: 0; border: 0; border-radius: 50%; color: var(--secondary-text-color); background: rgba(var(--ulm-grey), .08); cursor: pointer; }
  .room-status-indicator > ha-icon { flex: 0 0 18px; width: 18px; height: 18px; --mdc-icon-size: 18px; }
  .room-status-indicator.is-active { color: rgb(var(--ulm-yellow)); }
  .room-status-indicator.is-unavailable { opacity: .45; cursor: default; }
  .room-status-indicator.kind-water.is-active { color: rgb(var(--ulm-blue)); animation: room-status-pulse 1.6s ease-in-out infinite; }
  .room-status-indicator.kind-smoke.is-active { color: rgb(var(--ulm-red)); animation: room-status-pulse 1.6s ease-in-out infinite; }
  .room-status-indicator:focus-visible, .room-sensor:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  @keyframes room-status-pulse { 50% { opacity: .4; } }
  @media (prefers-reduced-motion: reduce) {
    .room-status-indicator.kind-water.is-active, .room-status-indicator.kind-smoke.is-active { animation: none; }
  }
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
  .custom-room-view { display: grid; min-width: 0; min-height: 150px; gap: 8px; padding: 12px; }
  .room-view-summary { display: flex; width: 100%; min-width: 0; align-items: center; gap: 10px; padding: 0; border: 0; background: transparent; color: var(--primary-text-color); font: inherit; text-align: start; cursor: pointer; }
  .room-view-summary .ulm-copy { min-width: 0; }
  .room-view-icon { position: relative; display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--ulm-grey), .1); color: rgba(var(--ulm-grey), .45); }
  .room-view-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .room-view-status { display: flex; min-height: 28px; align-items: center; justify-content: center; gap: 2px; }
  .room-view-status button, .room-view-clear, .room-view-warning { position: relative; display: grid; width: 35px; height: 28px; padding: 0; place-items: center; border: 0; background: transparent; color: rgba(var(--ulm-grey), .7); }
  .room-view-status button > ha-icon { --mdc-icon-size: 20px; }
  .room-view-status .is-unavailable, .room-view-warning { color: var(--error-color, #db4437); }
  .room-view-warning ha-icon { --mdc-icon-size: 18px; }
  .room-view-actions { display: flex; gap: 7px; }
  .room-view-actions button { position: relative; display: grid; min-width: 40px; height: 44px; flex: 1; padding: 0; place-items: center; border: 0; border-radius: 14px; background: rgba(var(--ulm-grey), .08); color: rgba(var(--ulm-grey), .7); cursor: pointer; }
  .room-view-actions button.is-active { background: rgba(var(--ulm-yellow), .25); color: rgb(var(--ulm-yellow)); }
  .room-view-actions button:disabled { opacity: .45; cursor: not-allowed; }
  .room-view-actions i, .room-view-status i { position: absolute; top: 5px; right: 30%; display: grid; min-width: 16px; height: 16px; place-items: center; border-radius: 9px; background: rgb(var(--ulm-blue)); color: #fff; font-size: 10px; font-style: normal; }
  .custom-room-view button:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .custom-welcome { display: grid; gap: 18px; padding: 14px; }
  .welcome-toolbar { display: flex; justify-content: space-between; }
  .welcome-toolbar button { display: grid; width: 38px; height: 38px; padding: 0; place-items: center; border: 0; border-radius: 50%; background: var(--addition-raised-background); color: inherit; box-shadow: var(--addition-raised-shadow); }
  .welcome-toolbar button:disabled { visibility: hidden; }
  .welcome-greeting { font-size: 23px; line-height: 1.08; }
  .welcome-items { display: flex; gap: 8px; overflow-x: auto; padding: 4px 4px 10px; margin: -4px -4px -10px; }
  .welcome-items > button { display: flex; min-width: 52px; flex: 1; flex-direction: column; align-items: center; gap: 6px; padding: 7px 4px 10px; border: 0; border-radius: 25px; background: var(--addition-raised-background); color: inherit; box-shadow: var(--addition-raised-shadow); }
  .welcome-items i { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--tone), .18); color: rgb(var(--tone)); font-style: normal; }
  .welcome-items i > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .welcome-items small { max-width: 48px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 700; }
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
  .sun-marker, .moon-marker {
    box-sizing: border-box;
    width: 20px;
    height: 20px;
  }
  .sun-marker {
    position: absolute;
    left: var(--sun-x);
    top: var(--sun-y);
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
    place-items: center;
    border: 0;
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
  .nas-metrics-header {
    display: flex; min-width: 0; align-items: center; gap: 10px;
  }
  .toner-bars { display: grid; gap: 5px; }
  .toner-bars span { display: block; min-height: 30px; }
  .toner-bars i { position: relative; display: grid; box-sizing: border-box; height: 30px; overflow: hidden; place-items: center; border: 1px solid rgba(var(--ulm-grey), .3); border-radius: 10px; background: rgba(var(--ulm-grey), .08); font-style: normal; }
  .toner-bars em { position: absolute; inset: 0 auto 0 0; width: var(--level); background: var(--toner); }
  .toner-bars b { position: relative; z-index: 1; padding: 2px 7px; border-radius: 999px; background: color-mix(in srgb, var(--card-background-color, #fff) 88%, transparent); color: var(--primary-text-color); font-size: 12px; font-variant-numeric: tabular-nums; font-weight: 600; }
  .custom-nas-metrics { gap: 12px; padding: 12px; }
  .nas-metrics-top { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .nas-metrics-tile { box-sizing: border-box; display: grid; min-height: 66px; grid-template-columns: var(--mush-icon-size, 40px) minmax(0, 1fr); align-items: center; gap: 12px; padding: 12px; border: 0; border-radius: 30px; background: transparent; color: var(--primary-text-color); text-align: left; }
  button.nas-metrics-tile { cursor: pointer; }
  .nas-metrics-tile-icon { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--tone), .2); color: rgb(var(--tone)); }
  .nas-metrics-tile-icon ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .nas-metrics-tile > span:last-child, .nas-metrics-metrics > span > span { display: grid; }
  .nas-metrics-tile b, .nas-metrics-metrics b { font-size: var(--mush-card-primary-font-size, 14px); line-height: 20px; font-weight: 600; }
  .nas-metrics-tile small, .nas-metrics-metrics small { color: var(--secondary-text-color); font-size: var(--mush-card-secondary-font-size, 12px); line-height: 20px; font-weight: 400; }
  .nas-metrics-body { display: grid; grid-template-columns: minmax(150px, .9fr) minmax(180px, 1.2fr); align-items: center; gap: 18px; }
  .nas-metrics-metrics { display: grid; gap: 12px; }
  .nas-metrics-metrics > span { display: grid; min-height: 48px; grid-template-columns: var(--mush-icon-size, 40px) minmax(0, 1fr); align-items: center; gap: 12px; }
  .nas-metrics-metrics i { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--tone), .2); color: rgb(var(--tone)); font-style: normal; }
  .nas-metrics-metrics i ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .nas-metrics-rings { width: 100%; max-width: 190px; justify-self: center; overflow: visible; transform: rotate(-90deg); }
  .nas-metrics-ring-track, .nas-metrics-ring-value { fill: none; stroke-width: 6; }
  .nas-metrics-ring-track { stroke: rgba(var(--ulm-grey), .16); }
  .nas-metrics-ring-value { stroke-linecap: round; }
  @container (max-width: 380px) {
    .custom-nas-metrics { gap: 10px; padding: 12px; }
    .nas-metrics-top { gap: 8px; }
    .nas-metrics-tile {
      min-width: 0;
      min-height: 66px;
      grid-template-columns: var(--mush-icon-size, 40px) minmax(0, 1fr);
      gap: 9px;
      padding: 9px 10px;
      border-radius: 24px;
    }
    .nas-metrics-tile > span:last-child { min-width: 0; overflow: hidden; }
    .nas-metrics-tile b, .nas-metrics-tile small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .nas-metrics-body { grid-template-columns: minmax(112px, 1fr) minmax(120px, 132px); gap: 8px; }
    .nas-metrics-metrics { gap: 6px; }
    .nas-metrics-metrics > span {
      min-height: 46px;
      grid-template-columns: var(--mush-icon-size, 40px) minmax(0, 1fr);
      gap: 8px;
    }
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
const { I: Dn } = Ir, aa = (e) => e, Nn = (e) => e.strings === void 0, ra = () => document.createComment(""), at = (e, t, o) => {
  const a = e._$AA.parentNode, r = t === void 0 ? e._$AB : t._$AA;
  if (o === void 0) {
    const n = a.insertBefore(ra(), r), i = a.insertBefore(ra(), r);
    o = new Dn(n, i, e, e.options);
  } else {
    const n = o._$AB.nextSibling, i = o._$AM, l = i !== e;
    if (l) {
      let s;
      o._$AQ?.(e), o._$AM = e, o._$AP !== void 0 && (s = e._$AU) !== i._$AU && o._$AP(s);
    }
    if (n !== r || l) {
      let s = o._$AA;
      for (; s !== n; ) {
        const c = aa(s).nextSibling;
        aa(a).insertBefore(s, r), s = c;
      }
    }
  }
  return o;
}, De = (e, t, o = e) => (e._$AI(t, o), e), Ln = {}, Vn = (e, t = Ln) => e._$AH = t, Hn = (e) => e._$AH, Ut = (e) => {
  e._$AR(), e._$AA.remove();
};
const wo = { CHILD: 2, ELEMENT: 6 }, Ja = (e) => (...t) => ({ _$litDirective$: e, values: t });
class Za {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, o, a) {
    this._$Ct = t, this._$AM = o, this._$Ci = a;
  }
  _$AS(t, o) {
    return this.update(t, o);
  }
  update(t, o) {
    return this.render(...o);
  }
}
const ut = (e, t) => {
  const o = e._$AN;
  if (o === void 0) return !1;
  for (const a of o) a._$AO?.(t, !1), ut(a, t);
  return !0;
}, Pt = (e) => {
  let t, o;
  do {
    if ((t = e._$AM) === void 0) break;
    o = t._$AN, o.delete(e), e = t;
  } while (o?.size === 0);
}, Qa = (e) => {
  for (let t; t = e._$AM; e = t) {
    let o = t._$AN;
    if (o === void 0) t._$AN = o = /* @__PURE__ */ new Set();
    else if (o.has(e)) break;
    o.add(e), Fn(t);
  }
};
function Rn(e) {
  this._$AN !== void 0 ? (Pt(this), this._$AM = e, Qa(this)) : this._$AM = e;
}
function jn(e, t = !1, o = 0) {
  const a = this._$AH, r = this._$AN;
  if (r !== void 0 && r.size !== 0) if (t) if (Array.isArray(a)) for (let n = o; n < a.length; n++) ut(a[n], !1), Pt(a[n]);
  else a != null && (ut(a, !1), Pt(a));
  else ut(this, e);
}
const Fn = (e) => {
  e.type == wo.CHILD && (e._$AP ??= jn, e._$AQ ??= Rn);
};
class Bn extends Za {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, o, a) {
    super._$AT(t, o, a), Qa(this), this.isConnected = t._$AU;
  }
  _$AO(t, o = !0) {
    t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), o && (ut(this, t), Pt(this));
  }
  setValue(t) {
    if (Nn(this._$Ct)) this._$Ct._$AI(t, this);
    else {
      const o = [...this._$Ct._$AH];
      o[this._$Ci] = t, this._$Ct._$AI(o, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
class Wn extends Bn {
  constructor(t) {
    if (super(t), this.held = !1, this.cancelled = !1, this.onEvent = (o) => {
      if (o.stopPropagation(), !this.element?.disabled)
        switch (o.type) {
          case "pointerdown": {
            const a = o;
            if (a.button !== 0 && a.button !== void 0) return;
            this.clearHold(), this.held = !1, this.cancelled = !1, this.pointer = { x: a.clientX, y: a.clientY }, this.config?.hold_action && this.config.hold_action.action !== "none" && (this.holdTimer = window.setTimeout(() => {
              this.held = !0, this.clearTap(), this.run("hold");
            }, 500));
            break;
          }
          case "pointermove": {
            const a = o;
            this.pointer && Math.hypot(a.clientX - this.pointer.x, a.clientY - this.pointer.y) > 10 && (this.clearHold(), this.cancelled = !0);
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
            const a = o;
            if (a.detail > 1) return;
            this.clearTap(), !a.detail || this.config?.double_tap_action?.action === "none" || !this.config?.double_tap_action ? this.run("tap") : this.tapTimer = window.setTimeout(() => {
              this.tapTimer = void 0, this.run("tap");
            }, 300);
            break;
          }
          case "dblclick":
            this.clearTap(), !this.held && !this.cancelled && this.run("double_tap");
            break;
          case "keydown": {
            const a = o;
            (a.key === "Enter" || a.key === " ") && (a.preventDefault(), a.repeat || (this.clearTap(), this.held = !1, this.cancelled = !1, this.run("tap")));
            break;
          }
          case "keyup":
          case "contextmenu":
            o.preventDefault();
            break;
        }
    }, t.type !== wo.ELEMENT) throw new Error("Control actions require an element");
  }
  render(t) {
    return p;
  }
  update(t, [o]) {
    return this.config?.entity !== o.entity && (this.clearHold(), this.clearTap()), this.config = o, this.element || (this.element = t.element, this.listen(!0)), p;
  }
  run(t) {
    if (!this.config || this.element?.disabled || !this.isConnected) return;
    const o = this.config[`${t}_action`];
    !o || o.action === "none" || Ca(this.element, {
      ...this.config,
      entity: typeof o.entity == "string" ? o.entity : this.config.entity
    }, t);
  }
  clearHold() {
    window.clearTimeout(this.holdTimer), this.holdTimer = void 0;
  }
  clearTap() {
    window.clearTimeout(this.tapTimer), this.tapTimer = void 0;
  }
  listen(t) {
    for (const o of [
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
      t ? this.element?.addEventListener(o, this.onEvent) : this.element?.removeEventListener(o, this.onEvent);
  }
  disconnected() {
    this.clearHold(), this.clearTap(), this.listen(!1);
  }
  reconnected() {
    this.listen(!0);
  }
}
const He = Ja(Wn), Gn = {
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
}, Un = (e, t) => {
  const o = e?.trim() || t.trim();
  if (o === "primary")
    return e ? `var(--primary-color, ${t})` : "var(--primary-color)";
  if (o === "accent")
    return e ? `var(--accent-color, ${t})` : "var(--accent-color)";
  const a = Gn[o];
  return a ? `rgb(var(--rgb-${o}, ${a}))` : o;
}, Ke = (e, t) => {
  if (!t) return;
  const o = Number.parseFloat(e.states[t]?.state ?? "");
  return Number.isFinite(o) ? o : void 0;
}, Kn = (e, t, o = "") => t ? e.states[t]?.attributes.unit_of_measurement ?? o : o, Ne = (e, t) => {
  const o = Ke(e, t);
  if (o === void 0) return;
  const a = Kn(e, t).toLowerCase();
  return a === "mw" ? o * 1e6 : a === "kw" ? o * 1e3 : o;
}, Ie = (e) => {
  const t = Math.abs(e ?? 0);
  return t >= 1e3 ? `${(t / 1e3).toFixed(2).replace(".", ",")} kW` : `${Math.round(t).toLocaleString()} W`;
}, Zt = (e, t, o, a = 380, r = 300) => {
  const n = (u) => {
    const _ = u * Math.PI / 180;
    return [
      a + e * Math.sin(_),
      r - e * Math.cos(_)
    ];
  }, [i, l] = n(t), [s, c] = n(o);
  return `M${i.toFixed(1)} ${l.toFixed(1)}A${e} ${e} 0 ${o - t > 180 ? 1 : 0} 1 ${s.toFixed(1)} ${c.toFixed(1)}`;
}, qn = (e, t, o, a, r = !1) => {
  const n = Math.max(0, Math.min(1, a));
  if (n < 0.015) return;
  const i = (o - t) * n;
  return r ? Zt(e, o - i, o) : Zt(e, t, t + i);
}, Yn = (e) => {
  const t = e?.attributes.raw_today;
  return Array.isArray(t) ? t : [];
}, Xn = (e, t = 0, o = 0) => Yn(e).flatMap((a) => {
  if (!a || typeof a != "object") return [];
  const r = a, n = new Date(String(r.start ?? "")).getTime(), i = new Date(String(r.end ?? "")).getTime(), l = Number(r.value);
  return !Number.isFinite(n) || !Number.isFinite(i) || !Number.isFinite(l) ? [] : [{
    start: n,
    end: i,
    price: (l + t) * (1 + o / 100)
  }];
}), Jn = (e) => {
  if (typeof e == "number" && Number.isFinite(e))
    return e < 1e12 ? e * 1e3 : e;
  if (typeof e != "string" || !e.trim()) return;
  const t = Date.parse(e);
  return Number.isFinite(t) ? t : void 0;
}, Zn = (e) => {
  const t = e?.attributes.slots;
  return Array.isArray(t) ? t.flatMap((o) => {
    if (!Array.isArray(o) || o.length < 3) return [];
    const a = Jn(o[0]);
    if (typeof o[1] != "number" && (typeof o[1] != "string" || !o[1].trim()) || typeof o[2] != "number" && (typeof o[2] != "string" || !o[2].trim())) return [];
    const r = Number(o[1]), n = Number(o[2]);
    return a === void 0 || !Number.isFinite(r) || !Number.isInteger(n) || n < 0 || n > 3 ? [] : [{ timestamp: a, price: r, kind: n }];
  }).sort((o, a) => o.timestamp - a.timestamp) : [];
}, Qn = (e, t, o) => {
  const a = e.map(({ price: l }) => l), r = Number.isFinite(t) ? t : Math.min(0, ...a), n = Number.isFinite(o) ? o : Math.max(0, ...a);
  if (n > r) {
    const l = Number.isFinite(o) ? 0 : (n - r) * 0.06;
    return { minimum: r, maximum: n + l };
  }
  const i = Math.max(Math.abs(r) * 0.1, 1);
  return { minimum: r - i, maximum: n + i };
}, na = (e, t = 2) => e.toFixed(Math.max(0, Math.min(6, Math.floor(t)))), ei = (e, t) => {
  const { energy: o, power: a, efficiency: r, fee: n, slotMinutes: i } = t;
  if (![o, a, r, n, i].every(Number.isFinite) || o <= 0 || a <= 0 || r <= 0 || r > 100 || n < 0 || i <= 0) return { error: "Enter a positive trade size, power and slot duration, an efficiency from 1 to 100%, and a non-negative feed-in fee." };
  if (e.length === 0) return { error: "No price slots available for the buy and sell result." };
  const l = [...e].sort((h, y) => h.timestamp - y.timestamp);
  if (l.some(
    (h, y) => !Number.isFinite(h.timestamp) || !Number.isFinite(h.price) || y > 0 && h.timestamp === l[y - 1].timestamp
  )) return { error: "Price slots must contain finite prices and unique timestamps." };
  const s = l.map((h, y) => ({
    ...h,
    duration: Math.min(
      i * 6e4,
      l[y + 1] ? l[y + 1].timestamp - h.timestamp : 1 / 0
    )
  })).sort((h, y) => h.price - y.price || h.timestamp - y.timestamp), c = /* @__PURE__ */ new Set(), u = (h, y) => {
    let w = h, f = 0;
    const v = [];
    for (let $ = 0; $ < s.length && w > 1e-9; $++) {
      const b = s[y ? s.length - 1 - $ : $];
      if (c.has(b.timestamp)) continue;
      const M = Math.min(w, a * b.duration / 36e5);
      c.add(b.timestamp), v.push({ start: b.timestamp, end: b.timestamp + M / a * 36e5, energy: M }), f += M * b.price, w -= M;
    }
    if (!(w > 1e-9))
      return {
        slots: v.sort(($, b) => $.start - b.start),
        energy: h,
        averagePrice: f / h,
        amount: y ? f - n * h : -f
      };
  }, _ = u(o / (r / 100), !1), m = u(o, !0);
  return !_ || !m ? { error: "Not enough separate price slots to buy and sell the configured trade size. Reduce the trade size or supply more prices." } : { buy: _, sell: m, net: _.amount + m.amount };
}, ti = (e) => {
  const t = Number.parseFloat(e.state);
  return Number.isFinite(t) ? t : 0;
}, oi = (e, t, o) => {
  const a = t?.length ? t : o ? [o] : Object.keys(e).filter((r) => /^sensor\.inverter_4/i.test(r));
  return [...new Set(a)].filter((r) => r.startsWith("sensor.") && e[r] !== void 0).sort((r, n) => r.localeCompare(n, void 0, { numeric: !0 })).map((r) => {
    const n = e[r];
    return {
      entity: n,
      id: r.slice(-4),
      value: ti(n)
    };
  });
}, ai = (e) => {
  const t = e.reduce((n, i) => n + i.value, 0), o = [...e].sort((n, i) => n.value - i.value || n.entity.entity_id.localeCompare(i.entity.entity_id)), a = o[0], r = o.at(-1);
  return {
    panels: [...e],
    activeCount: e.filter(({ value: n }) => n > 0).length,
    totalOutput: t,
    averageOutput: e.length ? t / e.length : 0,
    best: r,
    weakest: a,
    spread: r && a ? r.value - a.value : 0
  };
}, ri = (e, t) => Math.max(0, Math.min(100, e / Math.max(1, t) * 100)), ni = (e, t, o) => {
  let a = 0;
  return t.forEach((r, n) => {
    e >= r && (a = n);
  }), o[Math.min(a, o.length - 1)] ?? "var(--primary-color)";
}, z = (e, t) => e?.attributes[t], N = (e) => {
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, vt = (e, t, o, a, r = "") => {
  if (e.config.icon_type === "none") return p;
  const n = e.config.icon_type === "entity-picture" ? z(e.entity, "entity_picture") : void 0;
  return n ? d`<span class="ulm-icon entity-picture ${r}" style=${`background-image:url("${String(n)}")`}></span>` : d`<span class="ulm-icon source-icon ${a ? "is-source-active" : ""} ${r}"
        style=${`--source-color:${o}`}>
        ${ft(e.hass, e.entity, e.config.icon || (e.descriptor.upstreamId === "card_battery" ? e.entity?.attributes.icon || t : void 0), t)}
      </span>`;
}, Ye = (e, t) => {
  const o = x(e, t);
  return o ? e.hass.states[o] : void 0;
}, ii = (e, t) => {
  if (e === void 0) return "mdi:battery-off";
  if (e <= 0 && !t) return "mdi:battery-alert-variant-outline";
  if (e >= 100) return "mdi:battery";
  if (e <= 0) return `mdi:battery${t}-outline`;
  const o = Math.max(10, Math.min(90, Math.round(e / 10) * 10));
  return `mdi:battery${t}-${o}`;
}, oe = (e, t) => {
  const o = e.config[t];
  return typeof o == "string" ? e.hass.states[o] : void 0;
}, x = (e, ...t) => {
  for (const o of t)
    if (e.config[o] !== void 0) return e.config[o];
}, er = (e, t) => e.config.icon || e.entity?.attributes.icon || Ba(e.descriptor, e.entity) || t, ce = (e, t, o = "blue", a = "") => {
  if (e.config.icon_type === "none") return p;
  const r = e.config.icon_type === "entity-picture" ? z(e.entity, "entity_picture") : void 0;
  return r ? d`<span class="ulm-icon entity-picture ${a}" style=${`background-image:url("${String(r)}")`}></span>` : d`<span class="ulm-icon tone-${o} ${a}">${ft(e.hass, e.entity, e.config.icon, t)}</span>`;
}, si = (e, t) => {
  switch (e.config.secondary_info) {
    case "none":
      return;
    case "name":
      return ue(e.config, e.entity, e.hass);
    case "state":
      return A(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    case "last-updated":
      return e.entity?.last_updated ? new Date(e.entity.last_updated).toLocaleString() : "Last updated unavailable";
    default:
      return e.config.secondary || t;
  }
}, li = (e, t) => {
  switch (e.config.primary_info) {
    case "none":
      return "";
    case "state":
      return A(e.entity);
    case "last-changed":
      return e.entity?.last_changed ? new Date(e.entity.last_changed).toLocaleString() : "Last changed unavailable";
    case "last-updated":
      return e.entity?.last_updated ? new Date(e.entity.last_updated).toLocaleString() : "Last updated unavailable";
    default:
      return ue(e.config, e.entity, e.hass) || t || "";
  }
}, ci = (e, t, o) => {
  e.presentation.rendered = !0;
  const a = ue(e.config, e.entity, e.hass), r = e.config.name !== void 0 && typeof e.config.name != "string";
  return {
    primary: (e.config.primary_info === void 0 ? r && a ? a : o ?? a : li(e, o)) || void 0,
    secondary: e.config.secondary_info === void 0 ? t : si(e, t)
  };
}, J = (e, t, o) => d`
  ${(() => {
  const a = ci(e, t, o);
  return d`
  <span class="ulm-copy shared-presentation">
    ${a.primary ? d`<span class="ulm-name">${a.primary}</span>` : p}
    ${a.secondary ? d`<span class="ulm-label">${a.secondary}</span>` : p}
  </span>
    `;
})()}
`, di = (e, t = A(e.entity)) => d`
  <span class="value-first">${J(e, ue(e.config, e.entity, e.hass), t)}</span>
`, wt = (e, t = A(e.entity), o = e.descriptor.name) => d`
  <div class="card-heading">
    ${ce(e, Ba(e.descriptor, e.entity))}
    ${J(e, t, o)}
  </div>
`, ui = (e) => d`<div class="automatic-presentation">${wt(e)}</div>`, ye = (e, t, o, a = !1) => d`
  <button class="ulm-control" aria-label=${e} ?disabled=${a}
    @pointerdown=${(r) => r.stopPropagation()} @click=${o}>
    <ha-icon .icon=${t}></ha-icon>
  </button>
`, mi = (e, t, o, a, r = !1) => {
  let n, i = !1;
  const l = () => {
    n !== void 0 && window.clearTimeout(n), n = void 0;
  };
  return d`
    <button class="ulm-control hold-control" aria-label=${e} ?disabled=${r}
      @pointerdown=${(s) => {
    s.stopPropagation(), i = !1, n = window.setTimeout(() => {
      i = !0, a();
    }, 500);
  }}
      @pointerup=${(s) => {
    s.stopPropagation(), l();
  }}
      @pointercancel=${l}
      @click=${(s) => {
    s.stopPropagation(), i || o(), i = !1;
  }}>
      ${t}
    </button>
  `;
}, fe = (e, t, o, a = t.config.entity) => {
  e.stopPropagation(), _e(e.currentTarget, "hass-action", {
    config: { type: t.config.type, entity: a, tap_action: o },
    action: "tap"
  });
}, _i = {
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
}, pi = (e) => {
  const t = N(e.entity?.state) ?? 0, o = !!z(e.entity, "is_charging") || String(e.entity?.state).includes("charging"), a = x(e, "ulm_card_battery_battery_level_danger") ?? 20, r = x(e, "ulm_card_battery_battery_level_warning") ?? 50, n = t < a ? "red" : t < r ? "yellow" : "green", i = x(e, "ulm_card_battery_charging_animation") === !0 && o;
  return e.actionSurface(`ulm-battery ${i ? "is-charging" : ""}`, d`
    ${ce(e, o ? "mdi:battery-charging" : "mdi:battery", n)}
    ${J(e, o ? "Charging" : "Battery level")}
    <span class="battery-value">${Math.round(t)}<small>%</small></span>
    <span class="battery-track"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>
  `);
}, hi = (e) => {
  const t = x(e, "ulm_card_battery_attribute"), o = t ? z(e.entity, t) : e.entity?.state, a = N(o), r = Ye(e, "ulm_card_battery_battery_state_entity_id"), n = Ye(e, "ulm_card_battery_charger_type_entity_id"), i = r?.state.toLowerCase() === "charging", l = n?.state.toLowerCase(), s = l === "wireless" ? "-charging-wireless" : i || ["charging", "ac", "usb"].includes(l ?? "") ? "-charging" : "", c = N(e.config.battery_warning_threshold) ?? x(e, "ulm_card_battery_battery_level_warning") ?? 50, u = N(e.config.battery_low_threshold) ?? x(e, "ulm_card_battery_battery_level_danger") ?? 20, _ = N(e.config.battery_critical_threshold) ?? 10, [m, h, y] = [_, u, c].map(($) => Math.max(0, Math.min(100, $))).sort(($, b) => $ - b), w = a === void 0 || a <= m ? pe(
    e.config.battery_critical_color ?? x(e, "ulm_card_battery_color_battery_level_danger"),
    "var(--google-red, #f44336)"
  ) : a <= h ? pe(e.config.battery_low_color, "var(--google-orange, #ff9800)") : a <= y ? pe(
    e.config.battery_warning_color ?? x(e, "ulm_card_battery_color_battery_level_warning"),
    "var(--google-yellow, #fbc02d)"
  ) : pe(
    e.config.battery_healthy_color ?? x(e, "ulm_card_battery_color_battery_level_ok"),
    "var(--google-green, #43a047)"
  ), f = x(e, "ulm_card_battery_charging_animation") === !0 && i, v = a === void 0 ? A(e.entity) : `${Math.round(a)}%`;
  return e.actionSurface(`ulm-row ulm-default-battery ${f ? "is-charging" : ""}`, d`
    ${vt(e, ii(a, s), w, !0)}
    <span class="value-first">${J(e, ue(e.config, e.entity, e.hass), v)}</span>
  `);
}, pe = Un, gi = (e, t = !1, o = e.entity, a, r = a) => {
  const n = Array.isArray(z(o, "history")) ? z(o, "history").map(Number).filter(Number.isFinite).slice(-12) : [20, 28, 24, 42, 35, 52, 48, 63, 55, 70, 62, 78], i = Math.min(...n), l = Math.max(...n), s = n.map((_, m) => `${m / Math.max(1, n.length - 1) * 100},${36 - (_ - i) / Math.max(1, l - i) * 32}`).join(" "), c = `0,40 ${s} 100,40`;
  return d`<svg class="sparkline ${t ? "is-filled" : ""}" style=${""} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
    ${t ? d`<polygon points=${c}></polygon>` : p}
    <polyline points=${s}></polyline>
  </svg>`;
}, yi = (e) => e.actionSurface("ulm-metric", d`
  <div class="metric-heading">${ce(e, e.descriptor.family === "energy" ? "mdi:flash" : "mdi:chart-line", "blue")}${J(e, e.entity?.attributes.unit_of_measurement ? String(e.entity.attributes.unit_of_measurement) : "Current value")}<span class="metric-value">${A(e.entity)}</span></div>
  ${e.config.show_graph !== !1 ? gi(e) : p}
  ${oe(e, "min_entity") || oe(e, "max_entity") ? d`<div class="metric-extremes"><span>Min ${A(oe(e, "min_entity"))}</span><span>Max ${A(oe(e, "max_entity"))}</span></div>` : p}
`), bi = (e, t, o) => {
  const a = o.navigation_path || o.nav_path;
  if (a) {
    fe(e, t, { action: "navigate", navigation_path: a }, o.entity);
    return;
  }
  const r = o.tap_action, n = r?.service ?? r?.perform_action;
  if ((r?.action === "call-service" || r?.action === "perform-action") && n) {
    const [s, c] = n.split(".", 2);
    if (s && c) {
      t.service(s, c, {
        entity_id: o.entity,
        ...r.service_data ?? r.data ?? {}
      });
      return;
    }
  }
  const [i, l] = o.entity.split(".", 2);
  i === "scene" ? t.service("scene", "turn_on", { entity_id: o.entity }) : i === "media_player" ? t.service("media_player", "media_play_pause", { entity_id: o.entity }) : i === "input_select" ? t.service("input_select", "select_option", {
    entity_id: o.entity,
    option: o.state,
    ...o.service_data ?? {}
  }) : i === "script" ? t.service("script", l || "turn_on", { entity_id: o.entity, ...o.service_data ?? {} }) : t.service("homeassistant", "toggle", { entity_id: o.entity, ...o.service_data ?? {} });
}, fi = (e) => {
  const t = (e.config.scene_items?.length ? e.config.scene_items : (e.config.entities?.length ? e.config.entities : e.config.entity ? [e.config.entity] : []).map((b) => ({ entity: b }))).filter((b) => b.entity), o = e.descriptor.upstreamId === "card_welcome_scenes", a = e.config.scene_buttons_only === !0;
  a && (e.presentation.rendered = !0);
  const r = e.descriptor.upstreamId === "card_scenes" && e.config.variant === "scene-grid", n = o ? 7 : r ? 5 : 6, i = o && t.length > n, l = o && e.sceneOverflowExpanded ? t : t.slice(0, n), s = e.config.collapse_entity ? e.hass.states[e.config.collapse_entity] : void 0, c = !a && (e.config.collapsed === !0 || s?.state === "on"), _ = oe(e, "weather_entity")?.state || "partlycloudy", m = _i[_]?.[0] ?? "mdi:weather-partly-cloudy", h = (/* @__PURE__ */ new Date()).getHours(), y = e.hass.language?.split("-")[0] ?? "en", w = {
    de: ["Hallo", "Guten Morgen", "Guten Tag", "Guten Abend"],
    en: ["Hello", "Good morning", "Good afternoon", "Good evening"],
    es: ["Hola", "Buenos días", "Buenas tardes", "Buenas noches"],
    fr: ["Bonjour", "Bonjour", "Bon après-midi", "Bonsoir"],
    nl: ["Hallo", "Goedemorgen", "Goedemiddag", "Goedenavond"]
  }, f = w[y] ?? w.en, $ = `${h >= 18 ? f[3] : h >= 12 ? f[2] : h >= 5 ? f[1] : f[0]}, ${e.hass.user?.name || "Home"}!`;
  return e.actionSurface(`ulm-scenes ${o ? "welcome-scenes" : r ? "source-scene-grid" : "scene-pills"} ${e.descriptor.upstreamId === "card_scenes" ? "ulm-source-scenes" : ""} ${a ? "scene-buttons-only" : ""}`, d`
    ${o && !a ? d`
      <div class="welcome-toolbar">
        <button class="welcome-toolbar-button" aria-label="Toggle scenes" @pointerdown=${(b) => b.stopPropagation()} @click=${(b) => {
    b.stopPropagation(), e.config.collapse_entity && e.service("input_boolean", "toggle", { entity_id: e.config.collapse_entity });
  }}><ha-icon .icon=${c ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon></button>
        <span class="welcome-date"><ha-icon .icon=${m}></ha-icon>${new Intl.DateTimeFormat(e.hass.language, { month: "short", day: "numeric" }).format(/* @__PURE__ */ new Date())}</span>
        <button class="welcome-toolbar-button" aria-label="Open dashboard settings" @pointerdown=${(b) => b.stopPropagation()} @click=${(b) => fe(b, e, { action: "navigate", navigation_path: String(e.config.settings_path || "/config/dashboard") })}><ha-icon icon="mdi:cog-outline"></ha-icon></button>
      </div>
      <div class="welcome-heading">${J(e, $)}</div>
      ${c ? p : d`
        <div class="welcome-scenes-heading">
          <b>${e.config.secondary || "Scenes"}</b>
          ${i ? d`
            <button class="welcome-scenes-more"
              aria-label=${e.sceneOverflowExpanded ? "Show fewer scenes" : "Show all scenes"}
              aria-expanded=${e.sceneOverflowExpanded ? "true" : "false"}
              @pointerdown=${(b) => b.stopPropagation()}
              @click=${(b) => {
    b.stopPropagation(), e.toggleSceneOverflow();
  }}>
              <ha-icon .icon=${e.sceneOverflowExpanded ? "mdi:close" : "mdi:dots-vertical"}></ha-icon>
            </button>
          ` : p}
        </div>
      `}
    ` : p}
    ${c ? p : d`<div class="scene-grid">${l.map((b) => {
    const M = e.hass.states[b.entity], L = b.active_state ? M?.state === b.active_state : b.state ? M?.state === b.state : we.has(M?.state ?? ""), j = pe(b.color, "rgb(var(--ulm-purple))"), R = b.icon_type === "entity-picture" ? z(M, "entity_picture") : void 0;
    return d`
      <button @pointerdown=${(Z) => Z.stopPropagation()} @click=${(Z) => {
      if (Z.stopPropagation(), r && !b.tap_action) {
        const C = b.entity.split(".", 1)[0];
        e.service(
          C === "automation" ? "automation" : "homeassistant",
          C === "automation" ? "trigger" : "turn_on",
          { entity_id: b.entity }
        );
      } else
        bi(Z, e, b);
    }} style=${`--item-color:${j}`} class="scene-button ${L ? "is-active" : ""}">
        <i>${R ? d`<span class="scene-entity-picture" style=${`background-image:url("${String(R)}")`}></span>` : d`<ha-icon .icon=${b.icon || M?.attributes.icon || "mdi:palette"}></ha-icon>`}</i>
        <span>${b.name || b.label || ue({ entity: b.entity }, M, e.hass)}</span>
      </button>`;
  })}</div>`}
  `);
}, vi = (e) => {
  const t = e.entity?.state.startsWith("armed") || e.entity?.state === "locked";
  return e.actionSurface(`ulm-security ${t ? "is-armed" : ""}`, d`
    ${ce(e, t ? "mdi:shield-lock" : "mdi:shield-off", t ? "green" : "red")}
    ${J(e, A(e.entity))}
    ${e.config.show_controls ? d`<span class="security-status">${t ? "Secured" : "Attention"}</span>` : p}
  `);
}, wi = (e) => e.actionSurface("ulm-navigation", d`
  ${ce(e, e.descriptor.upstreamId.includes("back") ? "mdi:arrow-left" : "mdi:arrow-right", "blue")}
  ${J(e, e.config.secondary || e.config.navigation_path || "Navigate")}
  <ha-icon icon="mdi:chevron-right"></ha-icon>
`), $i = (e, t) => {
  const o = e?.split(".", 1)[0] ?? "homeassistant";
  return o === "script" ? ["script", t === "on" ? "turn_on" : "turn_off"] : o === "fan" ? ["fan", t === "on" ? "turn_on" : "turn_off"] : o === "water_heater" ? ["water_heater", t === "on" ? "turn_on" : "turn_off"] : [o === "input_boolean" ? "input_boolean" : "homeassistant", t === "on" ? "turn_on" : "turn_off"];
}, xi = (e) => {
  const t = x(
    e,
    "ulm_custom_card_washer_power",
    "ulm_card_power_outlet_entity",
    "ulm_card_power_entity"
  ), o = e.config.entity?.split(".", 1)[0], a = t || (["switch", "input_boolean", "light", "fan", "script", "water_heater"].includes(o ?? "") ? e.config.entity : void 0), r = a ? e.hass.states[a] : void 0, n = we.has(r?.state ?? e.entity?.state ?? ""), i = oe(e, "graph_entity"), [l, s] = $i(a, n ? "off" : "on");
  return e.actionSurface(`ulm-control-card ulm-row ${n ? "is-active" : ""}`, d`
    ${ce(e, e.config.entity?.startsWith("fan.") ? "mdi:fan" : "mdi:power-socket-eu", n ? "yellow" : "grey")}
    ${J(e, i ? `${A(e.entity)} · ${A(i)}` : A(e.entity))}
    ${a && e.config.show_controls !== !1 ? ye(n ? "Turn off" : "Turn on", "mdi:power", (c) => {
    c.stopPropagation(), e.service(l, s, { entity_id: a });
  }) : p}
  `);
}, Si = (e) => {
  const t = (e.config.room_sensors !== void 0 ? e.config.room_sensors : (e.config.entities ?? []).map((l) => ({ entity: l }))).filter((l) => l.entity).slice(0, 4), o = kn(e.config, e.hass), a = { ...e, config: { ...e.config, secondary_info: void 0 } }, r = Ua(e.config, e.hass), n = e.config.ulm_card_dynamic_color === !0 ? fo(e.hass, r) : void 0, i = (e.config.room_status ?? []).slice(0, nt).filter((l) => l.entity);
  return e.actionSurface(`ulm-room ulm-source-room ${n ? "dynamic-color" : ""} ${e.entity?.state === "unavailable" ? "is-unavailable" : ""}`, d`
    <div class="room-main">
      <div class="room-copy">${J(a, o)}
      ${i.length ? d`<div class="room-status" role="group" aria-label=${G(e.hass, "room_status")}>
        ${i.map((l) => {
    const s = e.hass.states[l.entity], c = l.kind && Ka.includes(l.kind) ? l.kind : ct(s), u = Pe(s), _ = yo(s, c), m = `${ue({ entity: l.entity }, s, e.hass)} · ${G(e.hass, `room_status_${c}`)}: ${G(e.hass, u ? "room_status_unavailable" : _ ? "room_status_active" : "room_status_inactive")} (${A(s)})`;
    return d`<button class="room-status-indicator kind-${c} ${u ? "is-unavailable" : _ ? "is-active" : "is-inactive"}"
            type="button" aria-label=${m} title=${m} ?disabled=${u}
            ${He({ type: e.config.type, entity: l.entity, tap_action: { action: "more-info" } })}>
            <ha-icon .icon=${s?.attributes.icon || bo(c, _)}></ha-icon>
          </button>`;
  })}
      </div>` : p}
      </div>
      <span class="ulm-icon tone-blue">${ft(e.hass, e.entity, e.config.icon, "mdi:sofa-single")}</span>
      ${e.entity?.state === "unavailable" ? d`<span class="room-unavailable"><ha-icon icon="mdi:exclamation"></ha-icon></span>` : p}
    </div>
    ${t.length ? d`<div class="room-entities">${t.map((l) => {
    const s = e.hass.states[l.entity], c = dt(e.hass, l.entity), u = !Pe(s) && s?.state === (l.active_state || c.active_state), _ = pe(l.color, "rgb(var(--ulm-blue))"), m = l.icon_type === "entity-picture" ? z(s, "entity_picture") : void 0;
    return d`<button
        class="metric-pill room-sensor ${u ? "is-active" : ""}"
        type="button"
        ?disabled=${Pe(s)}
        style=${`--item-color:${_}`}
        aria-label=${l.name || l.label || ue({ entity: l.entity }, s, e.hass)}
        ${He({
      type: e.config.type,
      entity: l.entity,
      tap_action: l.tap_action ?? c.tap_action,
      hold_action: l.hold_action ?? c.hold_action,
      double_tap_action: l.double_tap_action ?? c.double_tap_action
    })}
      >${m ? d`<span class="room-sensor-picture" style=${`background-image:url("${String(m)}")`}></span>` : d`<ha-icon .icon=${l.icon || qa(s, l.entity)}></ha-icon>`}<span class="room-sensor-label">${A(s)}</span></button>`;
  })}</div>` : p}
  `, n ? `--room-rgb:${n.join(",")};` : "");
}, $o = (e) => {
  const t = Object.entries(e.config).filter(([o, a]) => typeof a == "string" && a !== e.config.entity && /(_entity|_entity_id|_sensor|_power|_status|_level|_date|_time)$/i.test(o)).map(([, o]) => o);
  return [.../* @__PURE__ */ new Set([...e.config.entities ?? [], ...t])].map((o) => e.hass.states[o]).filter((o) => !!o).slice(0, 6);
}, ki = (e, t, o = "blue") => {
  const a = $o(e);
  return e.actionSurface("ulm-detail-card", d`
    <div class="ulm-row">
      ${ce(e, t, o)}
      ${J(e, A(e.entity))}
    </div>
    ${a.length ? d`<div class="detail-grid">${a.map((r) => d`
      <span class="metric-pill"><ha-icon .icon=${r.attributes.icon ?? "mdi:circle-small"}></ha-icon>${A(r)}</span>
    `)}</div>` : p}
  `);
}, Mi = (e) => {
  const t = $o(e);
  return e.actionSurface("ulm-schedule-card", d`
    <div class="ulm-row">
      ${ce(e, /pollen/.test(e.descriptor.upstreamId) ? "mdi:flower-pollen" : "mdi:trash-can", "green")}
      ${J(e, A(e.entity))}
    </div>
    <div class="schedule-list">${(t.length ? t : e.entity ? [e.entity] : []).slice(0, 4).map((o) => d`
      <span><b>${ue({ entity: o.entity_id }, o, e.hass)}</b><small>${A(o)}</small></span>
    `)}</div>
  `);
}, Ai = (e) => {
  const t = N(e.entity?.state), o = $o(e);
  return e.actionSurface("ulm-device-status", d`
    <div class="ulm-row">
      ${ce(e, /printer/.test(e.descriptor.upstreamId) ? "mdi:printer" : /nas/.test(e.descriptor.upstreamId) ? "mdi:nas" : /washer/.test(e.descriptor.upstreamId) ? "mdi:washing-machine" : "mdi:devices", t !== void 0 && t < 20 ? "red" : "blue")}
      ${J(e, A(e.entity))}
      ${t !== void 0 ? d`<b class="device-value">${Math.round(t)}${String(e.entity?.attributes.unit_of_measurement ?? "")}</b>` : p}
    </div>
    ${t !== void 0 ? d`<span class="device-progress"><i style=${`width:${Math.max(0, Math.min(100, t))}%`}></i></span>` : p}
    ${o.length ? d`<div class="detail-grid">${o.map((a) => d`<span class="metric-pill">${A(a)}</span>`)}</div>` : p}
  `);
}, Ci = (e) => {
  const t = oe(e, "datetime_entity");
  return e.actionSurface(`ulm-control-card ulm-row ${we.has(e.entity?.state ?? "") ? "is-active" : ""}`, d`
    ${ce(e, "mdi:alarm", we.has(e.entity?.state ?? "") ? "yellow" : "grey")}
    ${J(e, A(t || e.entity))}
    ${e.config.show_controls !== !1 ? ye(we.has(e.entity?.state ?? "") ? "Disable alarm" : "Enable alarm", "mdi:power", (o) => {
    o.stopPropagation(), e.service("input_boolean", we.has(e.entity?.state ?? "") ? "turn_off" : "turn_on", { entity_id: e.config.entity });
  }) : p}
  `);
}, te = (e, ...t) => {
  const o = x(e, ...t), a = typeof o == "string" ? o : o && typeof o == "object" && "entity_id" in o && typeof o.entity_id == "string" ? o.entity_id : void 0;
  return a ? e.hass.states[a] : void 0;
}, Ii = (e) => {
  const t = Le(e.config).filter((l) => l.enabled !== !1 && l.entity), o = /* @__PURE__ */ new Set([
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
  ]), a = (l, s) => {
    if (s !== !0 || !l) return;
    const c = e.hass.states[l]?.state?.trim();
    if (!c || o.has(c.toLowerCase())) return;
    const u = c.replaceAll("_", " ").replace(/\s+/g, " ");
    return u.charAt(0).toLocaleUpperCase(e.hass.language) + u.slice(1);
  }, r = a(e.config.today_entity, e.config.show_today), n = a(e.config.tomorrow_entity, e.config.show_tomorrow), i = (l) => {
    if (!(!l || o.has(l.state.trim().toLowerCase()) || ["—", "–"].includes(l.state.trim()))) {
      if (l.entity_id.startsWith("calendar.")) {
        const s = z(l, "start_time") ?? z(l, "start") ?? z(l, "end_time");
        if (typeof s == "string") {
          const c = new Date(s);
          if (!Number.isNaN(c.getTime()))
            return new Intl.DateTimeFormat(e.hass.language, { day: "2-digit", month: "2-digit", year: "numeric" }).format(c);
        }
        return;
      }
      return l.state;
    }
  };
  return e.actionSurface("custom-waste-card", d`
    <div class="custom-card-heading">
      ${ce(e, "mdi:trash-can-outline", "green")}
      ${J(e, x(e, "ulm_volgende_ophaling") || [r ? `Today: ${r}` : "", n ? `Tomorrow: ${n}` : ""].filter(Boolean).join(" · ") || void 0, "Next collections")}
    </div>
    <div class="waste-grid">${t.map((l) => {
    const s = l.entity ? e.hass.states[l.entity] : void 0, c = i(s);
    return e.config.hide_unknown_dates === !0 && c === void 0 ? p : d`<span class="waste-row" style=${`--waste-color:${pe(l.color, "rgb(var(--rgb-green, 76, 175, 80))")}`}>
        <ha-icon .icon=${l.icon || "mdi:trash-can"}></ha-icon>
        <b>${l.label || s?.attributes.friendly_name || l.entity}</b>
        <small>${c ?? "—"}</small>
      </span>`;
  })}</div>
  `);
}, Ei = (e) => {
  const t = te(e, "ulm_card_alarm_time_datetime") ?? oe(e, "datetime_entity"), o = N(x(e, "ulm_card_alarm_time_step")) ?? 15, a = t?.state || "00:00:00", [r, n] = a.split(":").map(Number), i = (_) => {
    const m = ((r || 0) * 60 + (n || 0) + _ + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: t?.entity_id,
      time: `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}:00`
    });
  }, l = !t || ["unknown", "unavailable"].includes(t.state.toLowerCase()), s = x(e, "ulm_card_alarm_time_collapse") === !0 && !we.has(e.entity?.state ?? ""), c = we.has(e.entity?.state ?? ""), u = pe(
    x(e, "ulm_card_alarm_time_color"),
    "rgb(var(--rgb-blue, 33, 150, 243))"
  );
  return e.actionSurface(`custom-alarm-time ${x(e, "ulm_card_alarm_time_horizontal") ? "is-horizontal" : ""}`, d`
    <div class="custom-card-heading">
      ${vt(e, x(e, "ulm_card_alarm_time_icon") || "mdi:alarm", u, c)}
      ${J(e, A(e.entity))}
    </div>
    ${s ? p : d`<div class="alarm-time-controls">
      ${ye(`Earlier by ${o} minutes`, "mdi:minus", (_) => {
    _.stopPropagation(), i(-o);
  }, l)}
      <b>${a.slice(0, 5)}</b>
      ${ye(`Later by ${o} minutes`, "mdi:plus", (_) => {
    _.stopPropagation(), i(o);
  }, l)}
    </div>`}
  `);
}, ia = (e, t) => {
  const o = z(t, "entity_id");
  return Array.isArray(o) ? o.map(String).map((a) => e.hass.states[a]).filter((a) => !!a) : t ? [t] : [];
}, Pi = (e) => {
  const t = (f) => te(e, f), o = t("temperature"), a = t("humidity"), r = {
    doors: t("group_doors"),
    windows: t("group_windows"),
    motions: t("group_motions"),
    water: t("group_water"),
    lights: t("group_lights"),
    shutters: t("group_windows_shutters"),
    outlets: t("group_outlets"),
    tv: t("group_tv")
  }, n = Object.values(r).flatMap((f) => ia(e, f)).filter((f) => (N(z(f, "battery")) ?? 101) <= 20), i = (f) => ia(e, f).filter((v) => v.state === "on" || v.state === "open").length, l = (f) => !f || ["unavailable", "unknown"].includes(f.state), s = (f) => {
    const v = e.hass.states[f], $ = z(v, "entity_id"), M = (Array.isArray($) ? $.map(String) : [f]).filter((L) => l(e.hass.states[L])).length;
    return Math.max(l(v) ? 1 : 0, M);
  }, c = (f) => ({
    type: e.config.type,
    entity: f,
    tap_action: { action: "more-info" }
  }), u = (f, v) => ({
    ...c(v),
    tap_action: e.config[`${f}_tap_action`] ?? { action: "more-info" },
    hold_action: e.config[`${f}_hold_action`] ?? { action: "more-info" },
    double_tap_action: e.config[`${f}_double_tap_action`] ?? { action: "toggle" }
  }), _ = e.config.temperature ? o : a, m = {
    ...e,
    entity: _,
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
  }, h = [
    [e.config.group_doors, r.doors, "Doors", "mdi:door-open"],
    [e.config.group_windows, r.windows, "Windows", "mdi:window-open-variant"],
    [e.config.group_motions, r.motions, "Motion", "mdi:motion-sensor"],
    [e.config.group_water, r.water, "Water", "mdi:water"]
  ], y = [
    ["lights", e.config.group_lights, r.lights, "Lights", r.lights?.state === "on" ? "mdi:lightbulb-group" : "mdi:lightbulb-group-off"],
    ["shutters", e.config.group_windows_shutters, r.shutters, "Shutters", r.shutters?.state === "on" ? "mdi:window-shutter-open" : "mdi:window-shutter"],
    ["outlets", e.config.group_outlets, r.outlets, "Outlets", r.outlets?.state === "on" ? "mdi:power-plug" : "mdi:power-plug-off"],
    ["tv", e.config.group_tv, r.tv, "Television", r.tv?.state === "on" ? "mdi:television" : "mdi:television-off"]
  ], w = [...h.map(([f]) => f), ...y.map(([, f]) => f)].reduce((f, v) => f + (v ? s(v) : 0), 0);
  return e.actionSurface("custom-room-view", d`
    ${wt(e, A(e.entity), ue(e.config, e.entity, e.hass))}
    ${e.config.temperature || e.config.humidity ? d`
        <button class="room-view-summary" aria-label="Climate · More information"
          ${He(c(e.config.temperature ?? e.config.humidity))}>
          ${vt(m, _?.attributes.icon || "mdi:home-variant-outline", "var(--primary-color)", !1, "room-view-icon")}
          ${J(
    m,
    e.config.climate_secondary ?? (e.config.humidity && e.config.temperature ? A(a) : void 0)
  )}
        </button>
      ` : p}
      <div class="room-view-status" aria-label="Sensor status">
        ${h.map(([f, v, $, b]) => f && (i(v) || s(f)) ? d`
          <button class="room-view-indicator ${i(v) ? "is-active" : ""} ${s(f) ? "is-unavailable" : ""}"
            aria-label=${`${$}: ${s(f) ? "Unavailable" : A(v)} · More information`}
            title=${`${$}: ${s(f) ? "Unavailable" : A(v)}`}
            ${He(c(f))}>
            <ha-icon .icon=${s(f) ? "mdi:alert-circle-outline" : b}></ha-icon>
            ${i(v) > 1 ? d`<i>${i(v)}</i>` : p}
          </button>` : p)}
        ${n.length ? d`
          <button class="room-view-indicator is-unavailable" aria-label="Low batteries"
            ${He(c(n[0].entity_id))}>
            <ha-icon icon="mdi:battery-20"></ha-icon><i>${n.length}</i>
          </button>` : p}
        ${w ? d`<span class="room-view-warning" role="status" aria-label=${`${w} unavailable`} title=${`${w} unavailable`}><ha-icon icon="mdi:alert-circle-outline"></ha-icon></span>` : p}
        ${!h.some(([, f]) => i(f)) && !n.length && !w ? d`<span class="room-view-clear"><ha-icon icon="mdi:check"></ha-icon></span>` : p}
      </div>
      <div class="room-view-actions" aria-label="Device controls">
        ${y.map(([f, v, $, b, M]) => v ? d`
          <button class=${we.has($?.state ?? "") ? "is-active" : ""} aria-label=${b}
            ?disabled=${l($)} ${He(u(f, v))}>
            <ha-icon .icon=${l($) ? "mdi:exclamation-thick" : M}></ha-icon>
            ${i($) ? d`<i>${i($)}</i>` : p}
          </button>` : p)}
      </div>
  `);
}, zi = (e) => {
  const t = te(e, "ulm_card_welcome_collapse"), o = te(e, "ulm_weather"), a = t?.state === "on", r = Array.from({ length: 5 }, (n, i) => i + 1).map((n) => ({
    nav: x(e, `nav_${n}`),
    icon: x(e, `icon_${n}`) || "mdi:circle",
    name: x(e, `name_${n}`) || `Item ${n}`,
    color: x(e, `color_${n}`) || "blue"
  })).filter((n) => n.nav);
  return e.actionSurface("custom-welcome", d`
    <div class="welcome-toolbar">
      <button aria-label="Toggle welcome navigation" ?disabled=${!t}
        @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => {
    n.stopPropagation(), t && e.service("input_boolean", "toggle", { entity_id: t.entity_id });
  }}>
        <ha-icon .icon=${a ? "mdi:chevron-down" : "mdi:chevron-up"}></ha-icon>
      </button>
      <button aria-label="Weather information" ?disabled=${!o}
        @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => {
    o && fe(n, e, { action: "more-info" }, o.entity_id);
  }}>
        <ha-icon icon="mdi:thermometer"></ha-icon>
      </button>
      <button aria-label="Dashboard settings" @pointerdown=${(n) => n.stopPropagation()}
        @click=${(n) => fe(n, e, { action: "navigate", navigation_path: "/config/dashboard" })}>
        <ha-icon icon="mdi:cog-outline"></ha-icon>
      </button>
    </div>
    <div class="welcome-greeting">${J(e, `Good ${(/* @__PURE__ */ new Date()).getHours() < 12 ? "morning" : (/* @__PURE__ */ new Date()).getHours() < 18 ? "afternoon" : "evening"}`)}</div>
    ${a ? p : d`<div class="welcome-items">${r.map((n) => d`
      <button class="tone-${n.color}" aria-label=${n.name}
        @pointerdown=${(i) => i.stopPropagation()}
        @click=${(i) => fe(i, e, { action: "navigate", navigation_path: n.nav })}>
        <i><ha-icon .icon=${n.icon}></ha-icon></i><small>${n.name}</small>
      </button>
    `)}</div>`}
  `);
}, Ti = (e) => {
  const t = te(e, "washer_power_entity") ?? te(e, "power_entity") ?? te(e, "ulm_custom_card_washer_power"), o = te(e, "ulm_custom_card_washer_machine_state") ?? e.entity, a = te(e, "ulm_custom_card_washer_job_progress"), r = te(e, "program_stage_entity") ?? te(e, "ulm_custom_card_washer_job_state") ?? o, n = te(e, "ulm_custom_card_washer_remote_control"), i = te(e, "ulm_custom_card_washer_delayed_start"), l = te(e, "ulm_custom_card_washer_delayed_starttime"), s = te(e, "door_entity"), c = te(e, "finished_entity"), u = x(e, "ulm_custom_card_washer_machine_stop_state") ?? "stop", _ = t ? !["off", "unavailable", "unknown", "0"].includes(t.state.toLowerCase()) : o ? !["off", "unavailable", "unknown"].includes(o.state.toLowerCase()) : !0, m = !o || o.state === u || o.state === "off", h = ["true", "on", "enabled"].includes(n?.state.toLowerCase() ?? ""), y = i?.state === "on", w = Math.max(0, Math.min(100, N(a?.state) ?? 0)), f = x(
    e,
    "ulm_custom_card_washer_job_states"
  ), v = Object.values(f ?? {
    state1: { name: "weightSensing", icon: "mdi:scale" },
    state2: { name: "wash", icon: "mdi:waves" },
    state3: { name: "rinse", icon: "mdi:water" },
    state4: { name: "spin", icon: "mdi:fan" }
  }).filter((P) => P.name && P.icon).slice(0, 5), $ = v.findIndex((P) => P.name?.toLowerCase() === r?.state.toLowerCase()), b = _ ? m ? h && y ? x(e, "ulm_custom_card_washer_label_configuring") ?? "configure" : x(e, "ulm_custom_card_washer_label_idle") ?? "idle" : x(e, "ulm_custom_card_washer_label_running") ?? "run" : x(e, "ulm_custom_card_washer_label_idle") ?? "idle", M = (P) => x(e, P) ?? { action: "none" }, L = (P, q) => fe(P, e, q, typeof q.entity == "string" ? q.entity : e.config.entity), j = l?.state.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)?.slice(1).map(Number), R = (P, q) => {
    if (P.stopPropagation(), !l || !j) return;
    const F = ((j[0] * 60 + j[1] + q) % 1440 + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: l.entity_id,
      time: `${String(Math.floor(F / 60)).padStart(2, "0")}:${String(F % 60).padStart(2, "0")}:00`
    });
  }, Z = M(m ? "ulm_custom_card_washer_start_action" : "ulm_custom_card_washer_pause_action"), C = M("ulm_custom_card_washer_stop_action");
  return e.actionSurface("custom-washer", d`
    <div class="custom-card-heading washer-heading">
      ${ce(e, "mdi:washing-machine", _ ? "blue" : "grey")}
      ${J(e, b)}
      ${t ? d`<b class="washer-power">${A(t)}</b>` : p}
    </div>
    ${_ && v.length ? d`
      <div class="washer-stages" style=${`--washer-stage-count:${v.length}`}>
        ${v.map((P, q) => d`
          <span class=${$ === q ? "is-active" : ""} title=${P.name ?? ""}>
            <ha-icon .icon=${P.icon}></ha-icon>
          </span>
        `)}
      </div>
    ` : p}
    ${_ && a ? d`
      <div class="washer-progress">
        <span style=${`width:${w}%`}></span>
        <b>${Math.round(w)}%</b>
      </div>
    ` : p}
    ${_ && h ? d`
      <div class="washer-controls">
        ${ye(
    m ? "Start washer" : "Pause washer",
    m ? "mdi:play" : "mdi:pause",
    (P) => L(P, Z),
    Z.action === "none"
  )}
        ${ye(
    "Stop washer",
    "mdi:stop",
    (P) => L(P, C),
    m || C.action === "none"
  )}
        ${i ? ye(
    y ? "Disable delayed start" : "Enable delayed start",
    "mdi:alarm",
    (P) => fe(P, e, { action: "toggle" }, i.entity_id),
    !m
  ) : p}
      </div>
    ` : p}
    ${_ && h && y && l ? d`
      <div class="washer-delay-controls">
        ${ye("Move delayed start 15 minutes earlier", "mdi:arrow-down", (P) => R(P, -15))}
        <button class="washer-delay-time" aria-label="Move delayed start 1 minute later"
          @pointerdown=${(P) => P.stopPropagation()}
          @click=${(P) => R(P, 1)}>${l.state}</button>
        ${ye("Move delayed start 15 minutes later", "mdi:arrow-up", (P) => R(P, 15))}
      </div>
    ` : p}
    ${s || c || n ? d`
      <div class="washer-status">
        ${s ? d`<span><ha-icon icon="mdi:door"></ha-icon>${A(s)}</span>` : p}
        ${c ? d`<span><ha-icon icon="mdi:check-circle"></ha-icon>${A(c)}</span>` : p}
        ${n ? d`<span><ha-icon icon="mdi:remote"></ha-icon>${A(n)}</span>` : p}
      </div>
    ` : p}
  `);
}, ke = (e, t, o) => Ye(e, t) ?? Object.values(e.hass.states).find((a) => String(z(a, "metric") ?? "").toLowerCase() === o && ["moon", "sky"].includes(String(z(a, "body") ?? "").toLowerCase())), sa = (e, t, o) => {
  const a = e === void 0 ? 180 : (e % 360 + 360) % 360, r = Math.max(-90, Math.min(90, t ?? 0)), n = a / 360 * 100, i = 62 / 90 * 100, l = r >= 0 ? i - r / 90 * (i - 4) : i + Math.abs(r) / 90 * (96 - i);
  return `--${o}-x:${n.toFixed(2)}%;--${o}-y:${l.toFixed(2)}%`;
}, la = (e) => ({
  new_moon: "mdi:moon-new",
  waxing_crescent: "mdi:moon-waxing-crescent",
  first_quarter: "mdi:moon-first-quarter",
  waxing_gibbous: "mdi:moon-waxing-gibbous",
  full_moon: "mdi:moon-full",
  waning_gibbous: "mdi:moon-waning-gibbous",
  last_quarter: "mdi:moon-last-quarter",
  waning_crescent: "mdi:moon-waning-crescent"
})[e] ?? "mdi:moon-waning-crescent", Oi = (e) => {
  const t = z(e.entity, "next_rising"), o = z(e.entity, "next_setting"), a = z(e.entity, "next_dawn") ?? t, r = z(e.entity, "next_noon"), n = z(e.entity, "next_dusk") ?? o, i = x(e, "language") || e.hass.language || "en", l = x(e, "timeFormat") === "12h", s = (F) => {
    const k = new Date(String(F ?? ""));
    return Number.isNaN(k.getTime()) ? "—" : new Intl.DateTimeFormat(i, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: l
    }).format(k);
  }, c = N(z(e.entity, "elevation")), u = N(z(e.entity, "azimuth")), _ = x(e, "title"), m = Ye(e, "moon_entity") ?? e.hass.states["sensor.moon"] ?? Object.values(e.hass.states).find((F) => String(z(F, "device_class") ?? "") === "enum" && `${F.entity_id} ${String(z(F, "friendly_name") ?? "")}`.toLowerCase().includes("moon")), h = ke(e, "moon_altitude_entity", "altitude"), y = ke(e, "moon_azimuth_entity", "azimuth"), w = Ye(e, "moon_rising_entity") ?? ke(e, "moon_rising_entity", "next_rising") ?? ke(e, "moon_rising_entity", "moonrise"), f = Ye(e, "moon_setting_entity") ?? ke(e, "moon_setting_entity", "next_setting") ?? ke(e, "moon_setting_entity", "moonset"), v = ke(e, "moon_next_full_moon_entity", "next_full_moon"), $ = ke(e, "moon_next_new_moon_entity", "next_new_moon"), b = ke(e, "moon_above_horizon_entity", "is_moon_above_horizon"), M = [
    m,
    h,
    y,
    w,
    f,
    v,
    $,
    b
  ], L = x(e, "showMoon") !== !1 && M.some(Boolean), j = (F, k = 2) => {
    if (!F || ["unknown", "unavailable"].includes(F.state)) return "—";
    const V = N(F.state);
    if (V === void 0) return A(F);
    const ee = String(z(F, "unit_of_measurement") ?? "");
    return `${new Intl.NumberFormat(i, { maximumFractionDigits: k }).format(V)}${ee ? ` ${ee}` : ""}`;
  }, R = (F) => {
    if (!F || ["unknown", "unavailable"].includes(F.state)) return "—";
    const k = new Date(F.state);
    return Number.isNaN(k.getTime()) ? A(F) : new Intl.DateTimeFormat(i, { day: "numeric", month: "short", year: "numeric" }).format(k);
  }, Z = m?.state ?? "unknown", C = N(h?.state), P = N(y?.state), q = b ? ["on", "true", "above_horizon"].includes(b.state.toLowerCase()) : (C ?? -1) >= 0;
  return e.actionSurface(`custom-sun-card ${x(e, "darkMode") ? "is-dark" : ""}`, d`
    ${_ ? d`<b class="sun-title">${_}</b>` : p}
    <div class="astronomy-times">
      <span><small>Sunrise</small><b>${s(t)}</b></span>
      <span><small>Moonrise</small><b>${s(w?.state)}</b></span>
      <span><small>Moonset</small><b>${s(f?.state)}</b></span>
      <span><small>Sunset</small><b>${s(o)}</b></span>
    </div>
    <div class="sun-arc astronomy-arc">
      <svg viewBox="0 0 300 90" preserveAspectRatio="none"><path class="sun-night" d="M0,62 Q60,115 105,62"></path><path class="sun-day" d="M0,62 Q150,-45 300,62"></path><line x1="0" y1="62" x2="300" y2="62"></line></svg>
      <span class="sun-marker" style=${sa(u, c, "sun")}></span>
      ${L && (h || y) ? d`
        <span class=${`moon-marker astronomy-moon-marker ${q ? "is-above" : "is-below"}`}
          style=${sa(P, C, "moon")}>
          <ha-icon .icon=${la(Z)}></ha-icon>
        </span>
      ` : p}
    </div>
    <div class="sun-footer"><span><small>Dawn</small><b>${s(a)}</b></span><span><small>Solar noon</small><b>${s(r)}</b></span><span><small>Dusk</small><b>${s(n)}</b></span></div>
    <div class="astronomy-position-rows">
      <div>
        <b>Sun:</b>
        <span>Azimuth <strong>${u ?? "—"}°</strong></span>
        <span>Elevation <strong>${c ?? "—"}°</strong></span>
      </div>
      ${L ? d`
        <div>
          <b>Moon:</b>
          <span>Azimuth <strong>${j(y)}</strong></span>
          <span>Elevation <strong>${j(h)}</strong></span>
        </div>
      ` : p}
    </div>
    ${L ? d`
      <section class="moon-section">
        <div class="moon-heading">
          <span class="moon-symbol"><ha-icon .icon=${la(Z)}></ha-icon></span>
          <span class="moon-copy">
            <b>Moon</b>
            <small>${A(m)} · ${q ? "Above horizon" : "Below horizon"}</small>
          </span>
        </div>
        <div class="moon-metrics">
          ${v ? d`<span class="moon-metric"><ha-icon .icon=${"mdi:moon-full"}></ha-icon><span><small>Next full Moon</small><b>${R(v)}</b></span></span>` : p}
          ${$ ? d`<span class="moon-metric"><ha-icon .icon=${"mdi:moon-new"}></ha-icon><span><small>Next new Moon</small><b>${R($)}</b></span></span>` : p}
        </div>
      </section>
    ` : p}
  `);
}, Di = (e) => {
  const t = !!(e.entity && !["unavailable", "unknown"].includes(e.entity.state)), a = (t ? e.entity.state : "00:00:00").split(" ").at(-1) || "00:00:00", [r, n] = a.split(":").map(Number), i = (l) => {
    const s = ((r || 0) * 60 + (n || 0) + l + 1440) % 1440;
    e.service("input_datetime", "set_datetime", {
      entity_id: e.config.entity,
      time: `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:00`
    });
  };
  return e.actionSurface("custom-input-datetime", d`
    <div class="custom-card-heading">${ce(e, "mdi:calendar-clock", "green")}${J(e, A(e.entity))}</div>
    <div class="input-datetime-controls">
      ${ye("15 minutes earlier", "mdi:arrow-down", (l) => {
    l.stopPropagation(), i(-15);
  }, !t)}
      ${mi(
    "One minute later; hold for one minute earlier",
    d`<b>${t ? a.slice(0, 5) : "Unavailable"}</b>`,
    () => i(1),
    () => i(-1),
    !t
  )}
      ${ye("15 minutes later", "mdi:arrow-up", (l) => {
    l.stopPropagation(), i(15);
  }, !t)}
    </div>
  `);
}, ca = (e) => {
  const t = e.entity?.state, o = !e.entity || t === "unavailable" || t === "unknown", a = x(e, "ulm_card_media_player_player_controls_entity") || e.config.entity, r = a ? e.hass.states[a] : void 0, n = r?.state, i = !a?.startsWith("media_player.") || !r || ["unavailable", "unknown"].includes(n ?? ""), l = e.config.collapsible_controls === !0 && (i || ["off", "standby"].includes(n ?? "") || e.config.ulm_card_media_player_idle_off === !0 && n === "idle"), s = (D) => D.stopPropagation(), c = z(r, "supported_features"), u = (D) => c === void 0 || (Number(c) & D) !== 0, _ = e.config.volume_controls ?? ["volume_buttons"], m = e.config.media_controls ?? ["play_pause_stop"], h = (D, Q = {}) => {
    i || e.service("media_player", D, { entity_id: a, ...Q });
  }, y = (D, Q, me, jt) => ye(D, Q, (Ft) => {
    s(Ft), h(me, jt);
  }, i), w = ["off", "standby"].includes(n ?? "") || i, f = e.config.ulm_card_media_player_power_button ?? m.includes("on_off"), v = !u(ie.turnOn | ie.turnOff), $ = u(w ? ie.turnOn : ie.turnOff) ? w ? "turn_on" : "turn_off" : v && ["playing", "paused", "buffering"].includes(n ?? "") && u(ie.stop) ? "media_stop" : v && ["idle", "on", "off", "standby"].includes(n ?? "") && u(ie.play) ? "media_play" : void 0, M = f && $ ? y($ === "media_stop" ? "Standby (stop playback)" : $ === "media_play" ? "Resume playback" : w ? "Turn on" : "Turn off", "mdi:power", $) : p, L = n === "playing", j = c === void 0 ? "media_play_pause" : L && u(ie.pause) ? "media_pause" : !L && u(ie.play) ? "media_play" : u(ie.stop) ? "media_stop" : void 0, R = m.includes("play_pause_stop") && j ? y(
    j === "media_stop" ? "Stop" : c === void 0 ? "Play or pause" : L ? "Pause" : "Play",
    j === "media_stop" ? "mdi:stop" : L ? "mdi:pause" : "mdi:play",
    j
  ) : p, Z = _.includes("volume_buttons") && u(ie.volumeStep | ie.volumeSet), C = String(z(r, "repeat") ?? "off"), P = C === "off" ? "all" : C === "all" ? "one" : "off", q = z(r, "is_volume_muted") === !0, F = x(e, "ulm_card_media_player_enable_art") === !1 ? void 0 : z(e.entity, "entity_picture"), k = Math.max(0, Math.min(1, N(z(r, "volume_level")) ?? 0)), V = Math.round(k * 100), ee = N(e.config.ulm_card_media_player_enable_volume_adjust), B = ee !== void 0 && ee > 0 && u(ie.volumeSet), Y = (D) => y(
    D ? "Volume up" : "Volume down",
    D ? "mdi:volume-plus" : "mdi:volume-minus",
    B ? "volume_set" : D ? "volume_up" : "volume_down",
    B ? { volume_level: Math.max(0, Math.min(1, k + (D ? 1 : -1) * ee)) } : void 0
  ), le = z(e.entity, "source"), ne = e.config.use_media_info ? z(e.entity, "media_title") : void 0, T = e.config.use_media_info || e.config.ulm_card_media_player_more_info === !0 ? z(e.entity, "media_artist") : void 0, ae = e.config.ulm_card_media_player_more_info === !0 ? z(e.entity, "media_album_name") : void 0, I = [T, ae].filter(Boolean).join(" · "), W = I || (le && !["idle", "paused", "unavailable", "unknown"].includes(t ?? "") ? String(le) : A(e.entity)), be = { ...e, config: {
    ...e.config,
    primary_info: ne && !e.config.name && [void 0, "default", "name"].includes(e.config.primary_info) ? void 0 : e.config.primary_info,
    secondary_info: (ne || I) && !e.config.secondary && [void 0, "default", "state"].includes(e.config.secondary_info) ? void 0 : e.config.secondary_info
  } }, ge = po(e.hass, e.config.entity, e.config), Se = Ea.flatMap((D) => {
    const Q = ge[D.configKey], me = Q ? e.hass.states[Q] : void 0;
    return me ? [{ control: D, entity: me }] : [];
  }), Ge = Pa.flatMap((D) => {
    const Q = ge[D.configKey], me = Q ? e.hass.states[Q] : void 0;
    return me ? [{ control: D, entity: me }] : [];
  }), Qe = (e.config.shortcuts?.buttons ?? []).filter((D) => typeof D.id == "string" && D.id.trim().length > 0), Ht = Math.min(8, Math.max(1, Math.round(e.config.shortcuts?.columns ?? 4))), Rt = x(e, "sonos_details_always_visible") === !0, xt = d`
    ${Se.length ? d`<div class="sonos-switches">
      ${Se.map(({ control: D, entity: Q }) => d`
        <button class=${Q.state === "on" ? "is-active" : ""} aria-pressed=${Q.state === "on"}
          ?disabled=${o || ["unavailable", "unknown"].includes(Q.state)}
          @click=${(me) => {
    me.stopPropagation(), !o && !["unavailable", "unknown"].includes(Q.state) && e.service("homeassistant", "toggle", { entity_id: Q.entity_id });
  }}>
          <ha-icon .icon=${D.icon}></ha-icon>
          <span>${D.label}</span>
        </button>
      `)}
    </div>` : p}
    ${Ge.length ? d`<div class="sonos-sliders">
      ${Ge.map(({ control: D, entity: Q }) => {
    const me = N(Q.state) ?? 0, jt = N(z(Q, "min")) ?? -100, Ft = N(z(Q, "max")) ?? 100, dr = N(z(Q, "step")) ?? 1;
    return d`
          <label>
            <ha-icon .icon=${D.icon}></ha-icon>
            <span>${D.label}</span>
            <input type="range" min=${jt} max=${Ft} step=${dr} .value=${String(me)}
              ?disabled=${o || ["unavailable", "unknown"].includes(Q.state)}
              aria-label=${D.label}
              @change=${(Po) => {
      Po.stopPropagation(), !(o || ["unavailable", "unknown"].includes(Q.state)) && e.service("number", "set_value", {
        entity_id: Q.entity_id,
        value: Number(Po.currentTarget.value)
      });
    }}>
            <output>${me}</output>
          </label>
        `;
  })}
    </div>` : p}
  `;
  return e.actionSurface(`custom-sonos ${F ? "has-art" : ""}`, d`
    ${F ? d`<span class="media-art" style=${`background-image:url("${String(F)}")`}></span>` : p}
    <div class="custom-card-heading">
      ${ce(e, "mdi:speaker", e.entity?.state === "playing" ? "green" : "grey")}
      ${J(be, W, ne && !e.config.name ? String(ne) : void 0)}
    </div>
    <div class="sonos-controls"
      @pointerdown=${s} @pointerup=${s} @pointercancel=${s}
      @click=${s} @dblclick=${s} @keydown=${s} @keyup=${s}>
      ${M}
      ${l ? p : d`
        ${_.includes("volume_mute") && u(ie.volumeMute) ? d`<button class="ulm-control" aria-label=${q ? "Unmute" : "Mute"} aria-pressed=${q}
              ?disabled=${i} @click=${() => h("volume_mute", { is_volume_muted: !q })}>
              <ha-icon .icon=${q ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon>
            </button>` : p}
        ${Z ? Y(!1) : p}
        ${m.includes("shuffle") && u(ie.shuffle) ? d`<button class="ulm-control" aria-label="Shuffle" aria-pressed=${z(r, "shuffle") === !0}
              ?disabled=${i} @click=${() => h("shuffle_set", { shuffle: z(r, "shuffle") !== !0 })}>
              <ha-icon icon="mdi:shuffle"></ha-icon>
            </button>` : p}
        ${m.includes("previous") && u(ie.previous) ? y("Previous track", "mdi:skip-previous", "media_previous_track") : p}
        ${R}
        ${m.includes("next") && u(ie.next) ? y("Next track", "mdi:skip-next", "media_next_track") : p}
        ${m.includes("repeat") && u(ie.repeat) ? y(
    `Repeat: ${C}`,
    C === "one" ? "mdi:repeat-once" : C === "off" ? "mdi:repeat-off" : "mdi:repeat",
    "repeat_set",
    { repeat: P }
  ) : p}
        ${m.includes("sources") ? ye(
    "Sources and details",
    "mdi:playlist-music",
    (D) => fe(D, e, { action: "more-info" }, a),
    i
  ) : p}
        ${Z ? Y(!0) : p}
        ${_.includes("volume_set") && u(ie.volumeSet) ? d`<label class="sonos-volume">
              <input type="range" min="0" max="100" step="1" .value=${String(V)}
                aria-label="Volume level" ?disabled=${i}
                @change=${(D) => {
    s(D), h("volume_set", {
      volume_level: Math.max(0, Math.min(100, Number(D.currentTarget.value))) / 100
    });
  }}>
              <output>${V}%</output>
            </label>` : p}
      `}
    </div>
    ${!l && (Se.length || Ge.length) ? d`
      ${Rt ? d`<div class="sonos-details sonos-details-always-visible"
            @pointerdown=${(D) => D.stopPropagation()}
            @click=${s} @dblclick=${s} @keydown=${s} @keyup=${s}
            @pointerup=${s} @pointercancel=${s}>
            ${xt}
          </div>` : d`<details class="sonos-details" @pointerdown=${(D) => D.stopPropagation()}
            @click=${s} @dblclick=${s} @keydown=${s} @keyup=${s}
            @pointerup=${s} @pointercancel=${s}>
            <summary>
              <span>More details</span>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </summary>
            ${xt}
          </details>`}
    ` : p}
    ${!l && Qe.length ? d`
      <div class="sonos-shortcuts" style=${`--sonos-shortcut-columns:${Ht}`}
        @pointerdown=${s} @pointerup=${s} @pointercancel=${s}
        @click=${s} @dblclick=${s} @keydown=${s} @keyup=${s}>
        ${Qe.map((D, Q) => d`
          <button
            aria-label=${D.name || `Play shortcut ${Q + 1}`}
            title=${D.name || D.id || ""}
            ?disabled=${o}
            @click=${(me) => {
    me.stopPropagation(), !o && e.service("media_player", "play_media", {
      entity_id: e.config.entity,
      media_content_type: D.type || "playlist",
      media_content_id: D.id
    });
  }}>
            <ha-icon .icon=${D.icon || "mdi:playlist-music"}></ha-icon>
            ${D.name ? d`<span>${D.name}</span>` : p}
          </button>
        `)}
      </div>
    ` : p}
  `);
}, Ni = (e) => {
  const t = [
    oe(e, "black_entity"),
    oe(e, "yellow_entity"),
    oe(e, "magenta_entity"),
    oe(e, "cyan_entity")
  ], o = ["#111", "#faff00", "#f800ff", "#00ffff"];
  return e.actionSurface("custom-printer", d`
    <div class="custom-card-heading">
      ${ce(e, "mdi:printer", e.entity?.state === "idle" ? "grey" : "blue")}
      ${J(e, A(e.entity))}
    </div>
    <div class="toner-bars">${t.map((a, r) => {
    if (!a) return p;
    const n = Math.max(0, Math.min(100, N(a.state) ?? 0));
    return d`<span style=${`--toner:${o[r]};--level:${n}%`}><i><em></em><b>${A(a)}</b></i></span>`;
  })}</div>
  `);
}, Li = (e) => {
  const t = oe(e, "disk_entity") ?? te(e, "entity_4"), o = oe(e, "temperature_entity") ?? te(e, "entity_1"), a = oe(e, "memory_entity") ?? te(e, "entity_2"), r = oe(e, "cpu_entity") ?? te(e, "entity_3"), n = !["off", "unavailable", "unknown"].includes(e.entity?.state ?? ""), i = (m, h) => pe(
    x(e, m),
    pe(h, h)
  ), l = (m) => !!x(e, m), s = (m) => {
    const h = e.config[m];
    return h && typeof h == "object" && "max_value" in h ? N(h.max_value) : void 0;
  }, c = (m, h, y, w = 100) => {
    const f = Math.max(0, Math.min(w, N(m?.state) ?? 0)), v = 2 * Math.PI * h, $ = v * (1 - f / w);
    return K`<circle class="nas-metrics-ring-value" cx="70" cy="70" r=${h}
      fill="none" stroke=${y} stroke-width="6" stroke-linecap="round"
      stroke-dasharray=${v} stroke-dashoffset=${$}></circle>`;
  }, u = e.entity?.state === "on" ? "Access" : A(e.entity), _ = d`
    <button class="nas-metrics-tile status-tile" aria-label="Open NAS status"
      @pointerdown=${(m) => m.stopPropagation()}
      @click=${(m) => fe(m, e, { action: "more-info" })}>
      <span class="nas-metrics-tile-icon tone-blue"><ha-icon icon="mdi:nas"></ha-icon></span>
      <span><b>Status</b><small>${u}</small></span>
    </button>`;
  return n ? e.actionSurface("custom-nas-metrics is-on", d`
    <div class="nas-metrics-top">
      ${_}
      <div class="nas-metrics-tile disk-tile">
        <span class=${`nas-metrics-tile-icon ${l("disk_color") ? "" : "tone-red"}`}
          style=${l("disk_color") ? `color:${i("disk_color", "red")};background:color-mix(in srgb, ${i("disk_color", "red")} 18%, transparent)` : ""}>
          <ha-icon .icon=${x(e, "disk_icon") || "mdi:harddisk"}></ha-icon>
        </span>
        <span><b>${x(e, "disk_name") || "Disk"}</b><small>${A(t)}</small></span>
      </div>
    </div>
    <div class="nas-metrics-body">
      <div class="nas-metrics-metrics">
        <span><i class=${l("temperature_color") ? "" : "tone-orange"} style=${l("temperature_color") ? `color:${i("temperature_color", "orange")}` : ""}><ha-icon .icon=${x(e, "temperature_icon") || "mdi:thermometer"}></ha-icon></i><span><b>${x(e, "temperature_name") || "Temp"}</b><small>${A(o)}</small></span></span>
        <span><i class=${l("memory_color") ? "" : "tone-blue"} style=${l("memory_color") ? `color:${i("memory_color", "blue")}` : ""}><ha-icon .icon=${x(e, "memory_icon") || "mdi:memory"}></ha-icon></i><span><b>${x(e, "memory_name") || "Memory"}</b><small>${A(a)}</small></span></span>
        <span><i class=${l("cpu_color") ? "" : "tone-green"} style=${l("cpu_color") ? `color:${i("cpu_color", "green")}` : ""}><ha-icon .icon=${x(e, "cpu_icon") || "mdi:cpu-64-bit"}></ha-icon></i><span><b>${x(e, "cpu_name") || "CPU"}</b><small>${A(r)}</small></span></span>
      </div>
      <svg class="nas-metrics-rings" viewBox="0 0 140 140" role="img" aria-label="NAS temperature, memory, and CPU utilization">
        ${[58, 48, 38].map((m) => K`<circle class="nas-metrics-ring-track" cx="70" cy="70" r=${m}
          fill="none" stroke="#dedede" stroke-width="6"></circle>`)}
        ${c(o, 58, i("temperature_color", "orange"), N(x(e, "temperature_max")) ?? s("entity_1") ?? 100)}
        ${c(a, 48, i("memory_color", "blue"), N(x(e, "memory_max")) ?? s("entity_2") ?? 100)}
        ${c(r, 38, i("cpu_color", "green"), N(x(e, "cpu_max")) ?? s("entity_3") ?? 100)}
      </svg>
    </div>
  `) : e.actionSurface("custom-nas-metrics is-off", d`<div class="nas-metrics-top">${_}</div>`);
}, Vi = (e) => {
  const t = oe(e, "battery_entity"), o = Math.max(0, Math.min(100, N(t?.state) ?? 0)), a = [
    ["tablet_button_usb_entity", "mdi:usb", "green", "Toggle USB"],
    ["tablet_button_motion_entity", "mdi:motion-sensor", "green", "Toggle motion"],
    ["tablet_button_display_entity", "mdi:monitor", "green", "Toggle display"],
    ["tablet_restart_entity", "mdi:restart-alert", "blue", "Restart tablet"],
    ["tablet_maintenance_entity", "mdi:account-hard-hat-outline", "orange", "Toggle maintenance mode"],
    ["tablet_reload_entity", "mdi:reload", "blue", "Reload tablet"]
  ], n = [
    ["RAM", oe(e, "tablet_ram_entity")],
    ["Disk", oe(e, "tablet_disk_entity")],
    ["Power", oe(e, "tablet_power_entity")]
  ].flatMap(
    ([c, u]) => u ? [[c, u]] : []
  ), i = a.flatMap(
    ([c, u, _, m]) => {
      const h = oe(e, c);
      return h ? [[u, _, m, h]] : [];
    }
  ), l = e.entity?.state === "on" ? "Access" : A(e.entity), s = (c, u) => {
    if (c.stopPropagation(), !u) return;
    u.entity_id.split(".")[0] === "button" ? e.service("button", "press", { entity_id: u.entity_id }) : e.service("homeassistant", "toggle", { entity_id: u.entity_id });
  };
  return e.actionSurface("custom-tablet", d`
    <div class="tablet-header">
      ${ce(e, "mdi:tablet", "blue", "tablet-icon")}
      ${J(e, l)}
    </div>
    ${i.length ? d`<div class="tablet-controls">${i.map(([c, u, _, m]) => {
    const h = m.state.toLowerCase() === "unavailable";
    return d`<button class="tone-${u} ${we.has(m.state) ? "is-active" : ""}"
        aria-label=${_} ?disabled=${h}
        @pointerdown=${(y) => y.stopPropagation()}
        @click=${(y) => s(y, m)}>
        <ha-icon .icon=${c}></ha-icon>
      </button>`;
  })}</div>` : p}
    ${n.length ? d`<div class="tablet-metrics">${n.map(([c, u]) => d`
      <span class=${u.state.toLowerCase() === "unavailable" ? "is-unavailable" : ""}><b>${A(u)}</b><small>${c}</small></span>
    `)}</div>` : p}
    ${t ? d`<div class="tablet-battery-row">
      <span class="tablet-battery-icon"><ha-icon icon="mdi:battery"></ha-icon></span>
      <span><b>${A(t)}</b><small>Battery</small></span>
    </div>
    <div class="tablet-battery-bar"><i style=${`width:${o}%`}></i><b>${o}%</b></div>` : p}
  `);
}, Hi = (e) => {
  const t = e.entity?.state ?? "unknown", o = ho(e.hass, e.config.entity, e.config), a = (C) => {
    const P = o[C];
    return P ? e.hass.states[P] : void 0;
  }, r = Da(e.hass, e.config.entity, e.config), n = Jr(r), i = a("followers_entity"), l = a("following_entity"), s = a("friends_entity"), c = a("primary_stat_entity"), u = a("secondary_stat_entity"), _ = a("now_playing_entity"), m = a("gamerpic_entity"), h = a("artwork_entity"), y = a("console_power_entity"), w = z(m, "entity_picture") ?? z(e.entity, "entity_picture"), f = x(e, "console_show_artwork") === !1 ? void 0 : z(h, "entity_picture") ?? z(e.entity, "media_image_url") ?? z(e.entity, "entity_picture"), v = !!f, $ = _ && !["unknown", "unavailable", "none", ""].includes(_.state.toLowerCase()) ? A(_) : String(z(e.entity, "media_title") ?? ""), b = ue(e.config, e.entity, e.hass), M = [
    { entity: i, icon: "mdi:account-arrow-left", label: "Followers" },
    { entity: l, icon: "mdi:account-arrow-right", label: "Following" },
    { entity: s, icon: "mdi:account-multiple", label: "Friends" }
  ].filter(({ entity: C }) => C), L = [
    {
      entity: c,
      icon: x(e, "primary_stat_icon") || (r === "xbox" ? "mdi:microsoft-xbox" : "mdi:trophy")
    },
    {
      entity: u,
      icon: x(e, "secondary_stat_icon") || "mdi:podium"
    }
  ].filter(({ entity: C }) => C), j = y?.entity_id.split(".", 1)[0], R = y && !["off", "standby", "unavailable", "unknown"].includes(y.state), Z = (C) => {
    if (C.stopPropagation(), !(!y || !j)) {
      if (j === "switch") {
        e.service("homeassistant", "toggle", { entity_id: y.entity_id });
        return;
      }
      e.service(j, R ? "turn_off" : "turn_on", { entity_id: y.entity_id });
    }
  };
  return e.actionSurface(`custom-console-card platform-${r} state-${t} ${v ? "has-artwork" : ""}`, d`
    ${v ? d`<div class="console-backdrop" style=${`background-image:url("${String(f)}")`}></div>` : p}
    <div class="console-content">
      <div class="card-heading console-header">
        ${e.config.icon_type !== "none" ? d`
          <span class="console-logo ${w && e.config.icon_type !== "icon" ? "has-picture" : ""}"
            style=${w && e.config.icon_type !== "icon" ? `background-image:url("${String(w)}")` : ""}>
            ${w && e.config.icon_type !== "icon" ? p : ft(e.hass, e.entity, e.config.icon, n.icon)}
          </span>
        ` : p}
        ${J(e, $ || A(e.entity), b)}
        ${L.length ? d`<span class="console-top-stats">
          ${L.map(({ entity: C, icon: P }) => d`
            <span title=${String(z(C, "friendly_name") ?? "")}>
              <ha-icon .icon=${P}></ha-icon>
              <b>${A(C)}</b>
            </span>
          `)}
        </span>` : p}
      </div>
      ${M.length ? d`<div class="console-social">
        ${M.map(({ entity: C, icon: P, label: q }) => d`
          <span class="console-social-item" title=${q}><ha-icon .icon=${P}></ha-icon><b>${C?.state}</b></span>
        `)}
      </div>` : p}
      ${x(e, "console_show_controls") !== !1 && y ? d`
        <div class="console-controls">
          <button aria-label=${R ? "Turn console off" : "Turn console on"}
            @pointerdown=${(C) => C.stopPropagation()}
            @click=${Z}>
            <ha-icon .icon=${R ? "mdi:power" : "mdi:power-standby"}></ha-icon>
            <span>${R ? "Power off" : "Power on"}</span>
          </button>
        </div>
      ` : p}
    </div>
  `);
}, Ri = (e) => {
  const t = e.config.carousel_show_header ?? [
    e.config.name,
    e.config.primary_info,
    e.config.secondary_info,
    e.config.icon,
    e.config.show_name === !0 ? !0 : void 0
  ].some((o) => o !== void 0);
  return d`
    <ha-card class="mushroom-addition-card entity-carousel-card">
      ${t ? d`
        <div class="metric-heading entity-carousel-presentation">
          ${vt(e, er(e, "mdi:view-carousel"), "var(--primary-color)", !0)}
          ${J(e, A(e.entity), e.config.name ? ue(e.config, e.entity, e.hass) : e.descriptor.name)}
        </div>
      ` : p}
      <mushroom-addition-entity-carousel
        .hass=${e.hass}
        .config=${e.config}>
      </mushroom-addition-entity-carousel>
    </ha-card>
  `;
}, ji = (e) => {
  e.presentation.rendered = !0;
  const t = e.config, o = [
    t.name,
    t.primary_info,
    t.secondary_info,
    t.icon,
    t.icon_type
  ].some((T) => T !== void 0), a = Ne(e.hass, t.entity) ?? 0, r = Ne(e.hass, t.grid_power_entity) ?? 0, n = [
    t.grid_phase_1_entity,
    t.grid_phase_2_entity,
    t.grid_phase_3_entity
  ].map((T) => Ne(e.hass, T) ?? 0), i = Ne(e.hass, t.solar_power_entity) ?? 0, l = Ke(e.hass, t.solar_forecast_entity) ?? 0, s = Ne(e.hass, t.battery_power_entity) ?? 0, c = Math.max(0, Math.min(
    100,
    Ke(e.hass, t.battery_level_entity) ?? 0
  )), u = Ne(e.hass, t.ev_charger_power_entity) ?? 0, _ = [1, 2, 3].map((T) => ({
    level: Ke(e.hass, x(e, `battery_${T}_level_entity`)) ?? 0,
    power: Ne(e.hass, x(e, `battery_${T}_power_entity`)) ?? 0
  })), m = t.energy_mode_entity ? e.hass.states[t.energy_mode_entity]?.state ?? "-" : "-", h = {
    "Smart Matching": t.mode_solar_first_label ?? "Solar first",
    "Dynamic Smart Matching": t.mode_smart_saving_label ?? "Smart saving",
    "Dynamic Trading + Smart Matching": t.mode_smart_trading_label ?? "Smart trading"
  }, y = t.energy_auto_control_entity ? e.hass.states[t.energy_auto_control_entity]?.state === "on" : !1, w = `${h[m] ?? m} · ${y ? t.energy_auto_label ?? "Auto" : t.energy_manual_label ?? "Manual"}`, f = s > 20 ? `${t.energy_charge_label ?? "Charging"} ${Ie(s)}` : s < -20 ? `${t.energy_discharge_label ?? "Discharging"} ${Ie(s)}` : t.energy_idle_label ?? "Idle", v = r > 20 ? t.energy_grid_import_label ?? "GRID · Import" : r < -20 ? t.energy_grid_export_label ?? "GRID · Export" : t.energy_grid_label ?? "GRID", $ = t.import_color ?? "#ff9f43", b = t.export_color ?? "#4cd98b", M = t.battery_color ?? "#3b82f6", L = t.solar_color ?? "#f5c542", j = t.home_color ?? "#3b82f6", R = r > 20 ? $ : b, Z = (/* @__PURE__ */ new Date()).toLocaleTimeString(e.hass.language ?? "nl-NL", {
    hour: "2-digit",
    minute: "2-digit"
  }), C = (T, ae, I) => K`
    <path d=${Zt(T, ae, I)} class="hems-track"></path>
  `, P = (T, ae, I, W, be, ge = !1) => {
    const Se = qn(T, ae, I, W, ge);
    return Se ? K`<path d=${Se} stroke=${be} class="hems-bar"></path>` : p;
  }, q = t.electricity_price_entity ? e.hass.states[t.electricity_price_entity] : void 0, F = Xn(
    q,
    Ke(e.hass, t.tariff_markup_entity) ?? 0,
    Ke(e.hass, t.tariff_vat_entity) ?? 0
  ), k = /* @__PURE__ */ new Date();
  k.setHours(0, 0, 0, 0);
  const V = k.getTime(), ee = 864e5, B = Date.now(), Y = F.find((T) => B >= T.start && B < T.end), le = (T) => T < 0 ? t.price_negative_color ?? "#0288d1" : T < (t.price_low_threshold ?? 0.18) ? t.price_low_color ?? "#2e7d32" : T < (t.price_medium_threshold ?? 0.26) ? t.price_medium_color ?? "#9ccc65" : T < (t.price_high_threshold ?? 0.34) ? t.price_high_color ?? "#fdd835" : T < (t.price_critical_threshold ?? 0.42) ? t.import_color ?? "#fb8c00" : t.price_critical_color ?? "#e53935", ne = (T) => new Date(T).toLocaleTimeString(e.hass.language ?? "nl-NL", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return e.actionSurface("advanced-energy-management", d`
    ${o ? d`
      <div class="hems-presentation">${wt(e)}</div>
    ` : p}
    <svg class="hems-flow" viewBox="0 0 760 650" role="img" aria-label="Advanced home energy live flow">
      <circle cx="380" cy="300" r="80" class="hems-track hems-battery-track"></circle>
      ${P(80, 0, Math.min(c, 99.9) * 3.6, 1, M)}
      <text x="380" y="270" class="hems-muted hems-center">▮ Battery</text>
      <text x="380" y="318" class="hems-battery-value hems-center">${Math.round(c)}%</text>
      <text x="380" y="346" class="hems-muted hems-center">${f}</text>
      <text x="380" y="125" class="hems-time hems-muted hems-center">${Z}</text>

      ${t.show_grid_phases !== !1 ? [250, 270, 290].map((T, ae) => K`
        ${C(T, 272, 352)}
        ${P(
    T,
    272,
    352,
    Math.abs(n[ae]) / (t.grid_phase_scale_max ?? 3e3),
    n[ae] < 0 ? b : $
  )}
      `) : p}
      <text x="180" y="185" class="hems-muted">${v}</text>
      <text x="180" y="228" class="hems-main-value" fill=${R}>⚡ ${Ie(r)}</text>
      ${t.show_grid_phases !== !1 ? n.map((T, ae) => K`
        <text x="180" y=${258 + ae * 22} class="hems-detail hems-muted">
          L${ae + 1} ${T >= 0 ? "↓" : "↑"} ${Ie(T)}
        </text>
      `) : p}

      ${C(265, 188, 262)}
      ${P(265, 188, 262, i / (t.solar_scale_max ?? 6e3), L, !0)}
      <text x="180" y="395" class="hems-muted">${t.energy_solar_label ?? "Solar Panels"}</text>
      <text x="180" y="437" class="hems-main-value">☀️ ${Ie(i)}</text>
      <text x="180" y="465" class="hems-detail hems-muted">
        ${t.energy_forecast_label ?? "Expected"} ${l.toLocaleString(void 0, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })} kWh
      </text>

      ${t.show_battery_units !== !1 ? [250, 270, 290].map((T, ae) => K`
        ${C(T, 8, 88)}
        ${P(
    T,
    8,
    88,
    Math.abs(_[ae].power) / (t.battery_unit_scale_max ?? 2400),
    _[ae].power > 0 ? M : $,
    !0
  )}
      `) : p}
      <text x="585" y="185" class="hems-muted hems-end">${t.energy_battery_label ?? "Battery"}</text>
      ${t.show_battery_units !== !1 ? _.map((T, ae) => K`
        <text x="585" y=${224 + ae * 22} class="hems-detail hems-muted hems-end">
          ${ae + 1} <tspan fill=${M} font-weight="600">${Math.round(T.level)}%</tspan>
          ${T.power > 20 ? "↑" : T.power < -20 ? "↓" : ""} ${Ie(T.power)}
        </text>
      `) : p}

      ${C(265, 98, 172)}
      ${P(265, 98, 172, a / (t.home_scale_max ?? 4e3), j)}
      <text x="585" y="395" class="hems-muted hems-end">${t.energy_home_label ?? "HOME"}</text>
      <text x="585" y="437" class="hems-main-value hems-end">${Ie(a)} ⌂</text>
      <text x="585" y="465" class="hems-detail hems-muted hems-end">
        🚗 ${t.energy_ev_label ?? "EV charger"} ${Ie(u)}
      </text>
      <text x="380" y="522" class="hems-mode hems-muted hems-center">${w} ▾</text>

      ${t.show_tariff_timeline !== !1 && F.length ? K`
        ${F.map((T) => {
    const ae = 90 + 580 * (T.start - V) / ee, I = Math.max(580 * (T.end - T.start) / ee, 1);
    return K`<rect x=${ae} y="588" width=${I} height="14"
            fill=${le(T.price)} opacity=".8"></rect>`;
  })}
        ${Y ? K`
          <text x="90" y="574" class="hems-muted">
            ${ne(Y.start)} – ${ne(Y.end)}
          </text>
          <text x="670" y="574" class="hems-price hems-end"
            fill=${le(Y.price)}>
            ${Math.round(Y.price * 100)} cents
          </text>
        ` : p}
        <rect x=${90 + 580 * (B - V) / ee - 1.5} y="584"
          width="3" height="22" rx="1.5" class="hems-now"></rect>
        ${[0, 6, 12, 18, 24].map((T) => K`
          <text x=${90 + 580 * T / 24} y="624" class="hems-hour hems-muted hems-center">
            ${String(T % 24).padStart(2, "0")}
          </text>
        `)}
      ` : p}
    </svg>
  `);
}, Kt = [
  { kind: 0, fallback: "Price" },
  { kind: 1, fallback: "Planned grid charge" },
  { kind: 2, fallback: "Planned sell" },
  { kind: 3, fallback: "Possible sell" }
], tr = (e, t, o) => wt(e, o, t), Fi = (e) => {
  const t = e.entity, o = Zn(t), a = Math.max(1, N(e.config.buy_sell_graph_span) ?? 36), r = Date.now(), n = e.config.buy_sell_span_start !== "now" ? new Date(new Date(r).setHours(0, 0, 0, 0)).getTime() : r, i = n + a * 60 * 60 * 1e3, l = o.filter(({ timestamp: I }) => I >= n && I < i), s = N(e.config.buy_sell_min_value), c = N(e.config.buy_sell_max_value), u = Qn(l, s, c), _ = 58, m = 700, h = 22, y = 254, w = m - _, f = y - h, v = (I) => _ + (I - n) / (i - n) * w, $ = (I) => y - (I - u.minimum) / (u.maximum - u.minimum) * f, b = Math.max(0, Math.min(6, Math.floor(N(e.config.buy_sell_price_decimals) ?? 3))), M = (I) => {
    const W = l[I + 1]?.timestamp, be = W ? W - l[I].timestamp : 1800 * 1e3;
    return Math.max(60 * 1e3, Math.min(be, 360 * 60 * 1e3));
  }, L = Math.max(0, Math.min(6, Math.floor(N(e.config.buy_sell_axis_decimals) ?? 2))), j = Kt.map((I, W) => pe(x(e, [
    "buy_sell_price_color",
    "buy_sell_charge_color",
    "buy_sell_planned_sell_color",
    "buy_sell_possible_sell_color"
  ][W]), ["#78909c", "#43a047", "#fb8c00", "#ffcc80"][W])), R = pe(
    x(e, "buy_sell_now_color"),
    "var(--primary-text-color)"
  ), Z = 14400 * 1e3, C = [];
  for (let I = n; I <= i; I += Z) C.push(I);
  C.at(-1) !== i && C.push(i);
  const P = (I) => new Date(I).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), q = [
    "buy_sell_price_label",
    "buy_sell_charge_label",
    "buy_sell_planned_sell_label",
    "buy_sell_possible_sell_label"
  ], F = Kt.map(({ fallback: I }, W) => String(e.config[q[W]] || I)), k = e.config.buy_sell_trade_energy_entity, V = Number(k ? e.hass.states[k]?.state : e.config.buy_sell_trade_energy ?? 10), ee = Number(e.config.buy_sell_trade_power ?? 7.2), B = Number(e.config.buy_sell_trade_efficiency ?? 86), Y = Number(e.config.buy_sell_feed_in_fee ?? 0), le = k && (!Number.isFinite(V) || V <= 0) ? { error: `Minimum trade size entity ${k} must provide a positive numeric kWh value.` } : ei(o, {
    energy: V,
    power: ee,
    efficiency: B,
    fee: Y,
    slotMinutes: Number(e.config.buy_sell_slot_minutes ?? 15)
  }), ne = (I) => `${I >= 0 ? "+" : ""}${I.toFixed(2)}`, T = (I) => new Date(I).toLocaleString(
    e.hass.language ?? "en-GB",
    { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
  ), ae = (I, W, be) => d`
    <tr>
      <th scope="row"><span class="energy-result-kind" style=${`--energy-result-color:${be}`}><i></i>${I}</span></th>
      <td title=${W.slots.map((ge) => `${T(ge.start)} – ${T(ge.end)}`).join("; ")}>
        ${T(W.slots[0].start)} – ${T(W.slots.at(-1).end)}
        (${W.slots.length} slots)
      </td>
      <td>${W.averagePrice.toFixed(3)}</td>
      <td>${W.energy.toFixed(1)}</td>
      <td>${ne(W.amount)}</td>
    </tr>
  `;
  return e.actionSurface("energy-buy-sell-card", d`
      ${tr(e, String(e.config.buy_sell_title || "Buy and sell moments (all-in €/kWh)"), "Price timeline")}
      <div class="energy-buy-sell-chart" style=${`height:${Math.max(120, Math.min(700, N(e.config.buy_sell_chart_height) ?? 300))}px`} role="img"
        aria-label=${`Energy prices and planned actions for the next ${a} hours`}>
        <svg viewBox="0 0 720 314" preserveAspectRatio="none" aria-hidden="true">
          ${Array.from({ length: 5 }, (I, W) => {
    const be = u.maximum - (u.maximum - u.minimum) * W / 4, ge = h + f * W / 4;
    return K`
              ${e.config.buy_sell_show_grid !== !1 ? K`
                <line x1=${_} y1=${ge} x2=${m} y2=${ge} class="energy-chart-grid"></line>
              ` : p}
              <text x=${_ - 8} y=${ge + 4} text-anchor="end" class="energy-chart-tick">
                ${na(be, L)}
              </text>
            `;
  })}
          <text x="14" y=${(h + y) / 2} text-anchor="middle"
            transform=${`rotate(-90 14 ${(h + y) / 2})`} class="energy-chart-axis-title">${e.config.buy_sell_axis_label || "€/kWh"}</text>
          ${C.map((I) => {
    const W = v(I);
    return K`
              <line x1=${W} y1=${y} x2=${W} y2=${y + 4} class="energy-chart-axis"></line>
              <text x=${W} y=${y + 20} text-anchor="middle" class="energy-chart-tick">
                ${P(I)}
              </text>
            `;
  })}
          ${l.map((I, W) => {
    const be = I.kind, ge = j[be], Se = $(I.price), Ge = $(Math.max(u.minimum, Math.min(0, u.maximum))), Qe = v(I.timestamp), Ht = v(Math.min(i, I.timestamp + M(W))), Rt = Math.max(1, (Ht - Qe) * 0.88), xt = Math.min(Se, Ge), D = Math.max(1, Math.abs(Se - Ge));
    return K`
              <rect x=${Qe} y=${xt} width=${Rt} height=${D}
                rx=${Math.max(0, Math.min(16, N(e.config.buy_sell_bar_radius) ?? 2))}
                fill=${ge} opacity="0.88">
                <title>${`${F[be]}: ${na(I.price, b)} ${e.config.buy_sell_axis_label || "€/kWh"}`}</title>
              </rect>
            `;
  })}
          ${l.length === 0 ? K`
            <text x=${(_ + m) / 2} y=${(h + y) / 2}
              text-anchor="middle" class="energy-chart-empty">No price slots available</text>
          ` : p}
          ${e.config.buy_sell_show_now !== !1 && r >= n && r <= i ? K`
            <line x1=${v(r)} y1=${h} x2=${v(r)} y2=${y + 4}
              class="energy-chart-now" style=${`stroke:${R}`}></line>
            <text x=${v(r)} y=${h - 7} text-anchor="middle" class="energy-chart-now-label"
              style=${`fill:${R}`}>
              ${e.config.buy_sell_now_label || "Now"}
            </text>
          ` : p}
        </svg>
      </div>
      ${e.config.buy_sell_show_legend !== !1 ? d`<div class="energy-chart-legend">
        ${Kt.map(({ kind: I }, W) => d`
          <span class="energy-chart-legend-item">
            <span class="energy-chart-legend-swatch" style=${`--energy-series-color:${j[W]}`}></span>
            ${F[I]}
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
          ${"error" in le ? d`<p class="energy-card-empty" role="status">${le.error}</p>` : d`
            <div class="energy-result-table-scroll" tabindex="0" role="region" aria-label="Buy and sell estimate">
              <table class="energy-result-table">
                <thead><tr><th scope="col">Action</th><th scope="col">Slots</th><th scope="col">avg €/kWh</th><th scope="col">kWh</th><th scope="col">€</th></tr></thead>
                <tbody>${ae("Buy", le.buy, j[1])}${ae("Sell", le.sell, j[2])}</tbody>
              </table>
            </div>
            <p class="energy-result-net">Net result for ${Number(V.toFixed(2))} kWh: ${ne(le.net)} €</p>
            <p class="energy-result-note">
              Calculated for the minimum trade size (${Number(V.toFixed(2))} kWh):
              the cheapest slots to buy and the most expensive remaining slots to sell,
              at ${ee} kW, over all published prices.
              Buy kWh = sold kWh ÷ round-trip efficiency (${B}%).
              Sell is revenue after the feed-in fee (${Y} €/kWh).
              Slots may be non-contiguous; the displayed times span the selected slots, not a continuous schedule.
              The final slot may be partially used. This estimate does not enforce buy-before-sell order,
              battery capacity or available charge; the real plan follows Smart saving / Smart trading.
            </p>
          `}
        </details>
      ` : p}
  `);
}, Bi = (e) => {
  const t = Array.isArray(e.config.panel_entities) ? e.config.panel_entities : void 0, o = oi(
    e.hass.states,
    t,
    e.config.entity
  ), a = ai(o), r = Math.max(1, N(e.config.panel_gauge_max) ?? 350), n = [0, 1, 2, 3, 4, 5].map((w) => N(e.config[`panel_segment_${w}`]) ?? [0, 80, 150, 230, 300, r][w]), i = n.map((w, f) => pe(x(e, `panel_color_${f}`), [
    "#b0bec5",
    "#ffa726",
    "#d4e157",
    "#66bb6a",
    "#2e7d32",
    "#2e7d32"
  ][f])), l = N(e.config.panel_warning_average_min) ?? 30, s = (N(e.config.panel_low_output_percent) ?? 60) / 100, c = a.averageOutput > l && !!a.weakest && a.weakest.value < a.averageOutput * s, u = a.activeCount < o.length, _ = o.length === 0 ? "No panel sensors are selected." : c ? `Panel ${a.weakest.id} is delivering less than ${Math.round(s * 100)}% of the average. Check for shading or a fault.` : u ? `${o.length - a.activeCount} panel(s) at zero. This is normal at night; otherwise, check them.` : "All panels are within the expected range of each other.", m = o.length === 0 ? "mdi:information-outline" : c || u ? "mdi:alert-circle-outline" : "mdi:check-circle-outline", h = c ? "warning" : u || o.length === 0 ? "muted" : "success", y = [
    ["Panels reporting", `${a.activeCount} / ${o.length}`],
    ["Combined output", `${Math.round(a.totalOutput)} W`],
    ["Average per panel", `${Math.round(a.averageOutput)} W`],
    ["Best panel", a.best ? `${a.best.id} · ${Math.round(a.best.value)} W` : "—"],
    ["Weakest panel", a.weakest ? `${a.weakest.id} · ${Math.round(a.weakest.value)} W` : "—"],
    ["Best-to-weakest spread", `${Math.round(a.spread)} W`]
  ];
  return e.actionSurface("panel-health-card", d`
      ${tr(e, String(e.config.panel_health_title || "Panel health"), "Solar panel output")}
      ${e.config.panel_show_summary !== !1 ? d`<div class="panel-health-summary">
        ${y.map(([w, f]) => d`
          <div class="panel-health-summary-row"><span>${w}</span><strong>${f}</strong></div>
        `)}
      </div>` : p}
      <div class=${`panel-health-status panel-health-status-${h}`} role="status">
        <ha-icon icon=${m}></ha-icon><span>${_}</span>
      </div>
      ${o.length && e.config.panel_show_gauges !== !1 ? d`
        <div class="panel-health-gauges">
          ${o.map((w) => {
    const f = ri(w.value, r), v = ni(w.value, n, i), $ = 2 * Math.PI * 37, b = $ * f / 100, M = ue({
      ...e.config,
      entity: w.entity.entity_id
    }, w.entity, e.hass) || w.id;
    return d`
              <button class="panel-health-gauge" type="button"
                aria-label=${`${M}: ${Math.round(w.value)} watts`}
                @click=${(L) => fe(L, e, { action: "more-info" }, w.entity.entity_id)}>
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="46" r="37" class="panel-health-gauge-track"></circle>
                  <circle cx="50" cy="46" r="37" class="panel-health-gauge-value"
                    style=${`--panel-gauge-color:${v};--panel-gauge-progress:${b};--panel-gauge-circumference:${$}`}
                    stroke-dasharray=${`${b} ${$}`}></circle>
                  <text x="50" y="51" text-anchor="middle" class="panel-health-gauge-value-label">
                    ${Math.round(w.value)}
                  </text>
                </svg>
                <span class="panel-health-gauge-name">${M}</span>
              </button>
            `;
  })}
        </div>
      ` : o.length ? p : d`
        <div class="energy-card-empty">
          Select panel sensors in the card editor, or add sensors with entity IDs beginning with sensor.inverter_4.
        </div>
      `}
  `);
}, Wi = (e) => {
  const t = te(e, "ulm_card_flower_entity") ?? e.entity, o = t?.state === "problem", a = (n) => Lt.find((i) => i.key === n), r = Va(e.config).flatMap((n) => {
    const i = a(n), l = z(t, n), s = typeof l == "object" && l !== null ? l : void 0, c = te(e, Ha(n)), u = typeof s?.sensor == "string" ? s.sensor : typeof l == "string" && e.hass.states[l] ? l : void 0, _ = c ?? (u ? e.hass.states[u] : void 0), m = String(z(t, "device_class") ?? ""), h = t?.entity_id.startsWith("sensor.") && (m === n || n === "moisture" && (!m || m === "humidity")), y = _ ?? (h ? t : void 0), w = N(y?.state) ?? N(s?.current) ?? N(l);
    if (w === void 0) return [];
    const f = N(s?.min) ?? N(z(y, "min")) ?? i.min, v = N(s?.max) ?? N(z(y, "max")) ?? i.max, $ = Math.max(0, Math.min(100, (w - f) / Math.max(1, v - f) * 100)), b = y ? A(y) : String(w);
    return [{ key: n, definition: i, sourceEntity: y, value: w, percent: $, display: b }];
  });
  return e.actionSurface("custom-plant", d`
    <button class="flower-heading" aria-label="Open plant details"
      @pointerdown=${(n) => n.stopPropagation()}
      @click=${(n) => fe(n, e, { action: "more-info" }, t?.entity_id)}>
      ${ce(e, o ? "mdi:alert-circle" : "mdi:flower", o ? "red" : "green")}
      ${J(e, o ? x(e, "ulm_custom_card_plant_problem") || "Problema" : x(e, "ulm_custom_card_plant_correct") || "Correto")}
    </button>
    ${r.length ? d`<div class="flower-bars">${r.map(({ key: n, definition: i, sourceEntity: l, percent: s, display: c }) => {
    const u = `${i.label}: ${c}`;
    return d`<span data-flower-bar=${n} title=${u} aria-label=${u}>
        <ha-icon .icon=${i.icon}></ha-icon>
        <i><em style=${`width:${s}%`}></em></i>
        ${l ? d`<output>${c}</output>` : p}
      </span>`;
  })}</div>` : p}
  `);
}, Gi = (e) => {
  const t = x(e, "ulm_custom_card_speedtest_round") === !0, o = (a, r, n, i, l, s, c, u, _) => {
    const m = te(e, a) ?? te(e, r), h = N(m?.state), y = Math.max(1, x(e, c) ?? u), w = Math.max(0, Math.min(100, (h ?? 0) / y * 100)), f = h === void 0 ? "—" : _ && t ? String(Math.round(h)) : m.state, v = m?.attributes.unit_of_measurement, $ = pe(x(e, l), s);
    return d`
      <div class="speedtest-metric" style=${`--speedtest-color:${$};--speedtest-value:${w}`}>
        <svg class="speedtest-ring" viewBox="0 0 120 100" aria-hidden="true">
          <path class="speedtest-track" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
          <path class="speedtest-value" pathLength="100" d="M14 83 A50 50 0 1 1 106 83"></path>
        </svg>
        <span class="speedtest-value-copy"><ha-icon .icon=${i}></ha-icon><b>${f}${v ? ` ${String(v)}` : ""}</b><small>${n}</small></span>
      </div>`;
  };
  return e.actionSurface("custom-speedtest-gauges", d`
    <div class="speedtest-three">
      ${o(
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
      ${o(
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
      ${o(
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
}, Ui = (e) => {
  const t = {
    en: { none: "None", very_low: "Very low", low: "Low", medium: "Medium", high: "High", very_high: "Very high", tree: "Trees", grass: "Grass", weed: "Weeds" },
    de: { none: "Keine", very_low: "Sehr niedrig", low: "Niedrig", medium: "Mittel", high: "Hoch", very_high: "Sehr hoch", tree: "Bäume", grass: "Gräser", weed: "Kräuter" },
    es: { none: "Ninguno", very_low: "Muy bajo", low: "Bajo", medium: "Medio", high: "Alto", very_high: "Muy alto", tree: "Árboles", grass: "Hierbas", weed: "Malezas" },
    nl: { none: "Geen", very_low: "Zeer laag", low: "Laag", medium: "Gemiddeld", high: "Hoog", very_high: "Extreem hoog", tree: "Bomen", grass: "Grassen", weed: "Kruiden" },
    pl: { none: "Brak", very_low: "Bardzo słabe", low: "Słabe", medium: "Średnie", high: "Wysokie", very_high: "Bardzo wysokie", tree: "Drzewa", grass: "Trawy", weed: "Zioła" }
  }, o = t[(e.hass.language ?? "en").split("-")[0]] ?? t.en, a = [
    {
      entity: oe(e, "trees_entity"),
      name: x(e, "custom_card_pollen_tree_name"),
      icon: x(e, "custom_card_pollen_tree_icon"),
      kind: "tree",
      fallbackIcon: "mdi:tree"
    },
    {
      entity: oe(e, "grass_entity"),
      name: x(e, "custom_card_pollen_grass_name"),
      icon: x(e, "custom_card_pollen_grass_icon"),
      kind: "grass",
      fallbackIcon: "mdi:grass"
    },
    {
      entity: oe(e, "weeds_entity"),
      name: x(e, "custom_card_pollen_weed_name"),
      icon: x(e, "custom_card_pollen_weed_icon"),
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
      label: o[i] ?? o.none,
      color: l[i] ?? l.none,
      extreme: i === "very_high"
    };
  };
  return e.actionSurface("custom-pollen", d`
    <div class="pollen-heading">${wt(e)}</div>
    ${a.map((n) => {
    const i = r(n.entity?.state), l = n.name || n.entity?.attributes.friendly_name || o[n.kind], s = n.icon || n.entity?.attributes.icon || n.fallbackIcon;
    return d`<button class="pollen-item" style=${`--pollen:${i.color}`}
        ?disabled=${!n.entity}
        @pointerdown=${(c) => c.stopPropagation()}
        @click=${(c) => n.entity && fe(c, e, { action: "more-info" }, n.entity.entity_id)}>
        <span class="pollen-item-icon"><ha-icon .icon=${s}></ha-icon>
          ${i.extreme ? d`<span class="pollen-extreme"><ha-icon .icon=${"mdi:exclamation-thick"}></ha-icon></span>` : p}
        </span>
        <b>${l}</b><small>${n.entity ? i.label : "Entity unavailable"}</small>
      </button>`;
  })}
  `);
}, Ki = (e) => {
  const t = we.has(e.entity?.state ?? ""), o = "rgb(var(--rgb-blue, 33, 150, 243))";
  return e.actionSurface("ulm-row", d`
    ${vt(e, er(e, "mdi:information-outline"), o, t)}
    ${di(e)}
  `, `--source-color:${o}`);
}, qi = (e) => {
  switch (e.descriptor.upstreamId) {
    case "card_battery":
      return hi(e);
    case "custom_card_trash":
      return Ii(e);
    case "custom_card_alarm_time":
      return Ei(e);
    case "custom_card_roomview":
      return Pi(e);
    case "custom_card_welcome":
      return zi(e);
    case "custom_card_washer":
      return Ti(e);
    case "custom_card_sun":
      return Oi(e);
    case "custom_card_input_datetime":
      return Di(e);
    case "custom_card_media_player_sonos":
      return ca(e);
    case "custom_card_printer":
      return Ni(e);
    case "custom_card_nas_metrics":
      return Li(e);
    case "custom_card_tablet":
      return Vi(e);
    case "custom_card_playstation":
      return Hi(e);
    case "custom_card_entity_carousel":
      return Ri(e);
    case "advanced_home_energy_management":
      return ji(e);
    case "advanced_energy_buy_sell":
      return Fi(e);
    case "advanced_energy_panel_health":
      return Bi(e);
    case "custom_card_plant":
      return Wi(e);
    case "custom_card_speedtest_gauges":
      return Gi(e);
    case "custom_card_pollen":
      return Ui(e);
    case "card_room":
      return Si(e);
  }
  if (/trash/.test(e.descriptor.upstreamId)) return Mi(e);
  if (/printer/.test(e.descriptor.upstreamId)) return Ai(e);
  if (/plant|entity_overview/.test(e.descriptor.upstreamId))
    return ki(e, /plant/.test(e.descriptor.upstreamId) ? "mdi:flower" : "mdi:view-grid", "purple");
  switch (e.descriptor.family) {
    case "scene":
      return fi(e);
    case "battery":
      return pi(e);
    case "energy":
    case "sensor":
      return yi(e);
    case "media":
      return ca(e);
    case "security":
      return vi(e);
    case "navigation":
      return wi(e);
    case "control":
      return xi(e);
    case "alarm-time":
      return Ci(e);
    default:
      return Ki(e);
  }
};
var Yi = Object.defineProperty, xo = (e, t, o, a) => {
  for (var r = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = i(t, o, r) || r);
  return r && Yi(t, o, r), r;
};
const Mo = class Mo extends $e {
  constructor() {
    super(...arguments), this.holdFired = !1, this.forecastGeneration = 0, this.forecast = [], this.sceneOverflowExpanded = !1, this.actionSurface = (t, o, a = "") => {
      const r = this.descriptor ? go.get(this.descriptor.upstreamId) : void 0, n = this.descriptor?.sourcePath.startsWith("src/") ?? !1;
      if (!r && !n)
        throw new Error(`Missing explicit parity renderer mapping for ${this.descriptor?.upstreamId}`);
      const i = r ? ` parity-${r.rendererId.replaceAll("_", "-")}` : "", l = this.config?.layout && this.config.layout !== "default" ? ` layout-${this.config.layout}` : "", s = this.config?.multiline_secondary ? " multiline-secondary" : "", c = this.config?.fill_container ? " fill-container" : "", u = this.config?.variant ? ` variant-${this.config.variant}` : "", _ = d`
      <div class="${t}${i}${l}${s}${c}${u} action-surface" style=${a} role="button" tabindex="0"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        ${o}
      </div>`;
      return d`<ha-card class="mushroom-addition-card">${_}</ha-card>`;
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
    const o = Br(t), a = this.forecastKey(this.config);
    this.config = o, this.sceneOverflowExpanded = !1, a !== this.forecastKey(o) && this.stopForecastSubscription(), this.scheduleEnergyBuySellRefresh(), this.requestUpdate(), this.subscribeForecast();
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
    const t = this.config.entity ? this.hass.states[this.config.entity] : void 0, o = { rendered: !1 }, a = {
      config: this.config,
      descriptor: this.descriptor,
      hass: this.hass,
      entity: t,
      forecast: this.forecast,
      presentation: o,
      sceneOverflowExpanded: this.sceneOverflowExpanded,
      toggleSceneOverflow: () => {
        this.sceneOverflowExpanded = !this.sceneOverflowExpanded;
      },
      actionSurface: (r, n, i) => this.actionSurface(
        r,
        o.rendered ? n : d`${ui(a)}${n}`,
        i
      ),
      service: (r, n, i) => {
        this.hass?.callService(r, n, i);
      }
    };
    return qi(a);
  }
  willUpdate() {
    this.toggleAttribute("dark", this.hass?.themes?.darkMode === !0);
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
    const t = Number(this.config?.buy_sell_update_interval), o = Number.isFinite(t) && t > 0 ? Math.max(1, Math.min(120, t)) : 5;
    this.energyBuySellTimer = window.setInterval(() => this.requestUpdate(), o * 6e4);
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
    const o = this.forecastGeneration;
    try {
      const a = await this.hass.connection.subscribeMessage((r) => {
        o !== this.forecastGeneration || t !== this.forecastSubscriptionKey || (this.forecast = r.forecast ?? [], this.requestUpdate());
      }, {
        type: "weather/subscribe_forecast",
        entity_id: this.config.entity,
        forecast_type: "daily"
      });
      o !== this.forecastGeneration || t !== this.forecastSubscriptionKey ? a() : this.unsubscribeForecast = a;
    } catch (a) {
      o === this.forecastGeneration && (this.forecastSubscriptionKey = void 0), console.warn("Mushroom Cards Addition: unable to load weather forecast", a);
    }
  }
  runAction(t) {
    if (!this.hass || !this.config) return;
    const o = t === "tap_action" ? "tap" : t === "hold_action" ? "hold" : "double_tap", a = this.config[t], r = typeof a?.entity == "string" ? a.entity : void 0;
    Ca(this, r ? { ...this.config, entity: r } : this.config, o);
  }
};
Mo.styles = On;
let Fe = Mo;
xo([
  he({ attribute: !1 })
], Fe.prototype, "hass");
xo([
  he({ attribute: !1 })
], Fe.prototype, "config");
xo([
  re()
], Fe.prototype, "sceneOverflowExpanded");
var Xi = Object.defineProperty, $t = (e, t, o, a) => {
  for (var r = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = i(t, o, r) || r);
  return r && Xi(t, o, r), r;
};
const it = [
  "var(--accent-color, #03a9f4)",
  "#ff9800",
  "#4caf50",
  "#9c27b0",
  "#f44336",
  "#00bcd4"
], Qt = (e) => {
  const o = (Array.isArray(e.entities) ? e.entities : []).map((a) => typeof a == "string" ? { entity: a } : { ...a });
  return !o.length && e.entity && o.push({ entity: e.entity }), o.filter((a) => !!a.entity);
}, or = (e) => ({
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
}), da = (e) => {
  const t = Qt(e);
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
    show: or(e.show),
    animate: e.animate ?? !1,
    height: e.height ?? 150,
    bar_spacing: e.bar_spacing ?? 4,
    line_width: e.line_width ?? 5,
    line_color: e.line_color ?? it[0],
    color_thresholds: Ct(e.color_thresholds ?? []),
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
}, Ct = (e) => {
  const t = e.map((a) => typeof a == "string" ? { color: a } : { ...a });
  let o = -1;
  for (let a = 0; a < t.length; a += 1)
    if (t[a].value !== void 0) {
      if (o >= 0 && a - o > 1) {
        const r = t[o].value, n = t[a].value;
        for (let i = o + 1; i < a; i += 1)
          t[i].value = r + (n - r) * (i - o) / (a - o);
      }
      o = a;
    }
  return t.filter((a) => a.value !== void 0 && !!a.color);
}, St = (e, t) => t ? t.split(".").reduce((o, a) => {
  if (!(!o || typeof o != "object"))
    return o[a];
}, e?.attributes) : e?.state, kt = (e, t) => {
  const o = String(e ?? ""), a = t.findIndex((n) => n.value === o);
  if (a >= 0)
    return {
      value: a,
      label: t[a].label ?? t[a].value
    };
  const r = Number(e);
  return Number.isFinite(r) ? { value: r } : {};
}, ar = (e, t) => {
  if (!e.length) return Number.NaN;
  switch (t) {
    case "median": {
      const o = [...e].sort((r, n) => r - n), a = Math.floor(o.length / 2);
      return o.length % 2 ? o[a] : (o[a - 1] + o[a]) / 2;
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
      return e.reduce((o, a) => o + a, 0);
    case "delta":
      return Math.max(...e) - Math.min(...e);
    case "diff":
      return e.at(-1) - e[0];
    default:
      return e.reduce((o, a) => o + a, 0) / e.length;
  }
}, Ji = (e, t, o, a = Date.now()) => {
  if (!e.length) return [];
  const r = Math.max(1, Number(t.hours_to_show ?? 24)), n = Math.max(0.01, Number(t.points_per_hour ?? 0.5)), i = a - r * 36e5, l = 36e5 / n, s = /* @__PURE__ */ new Map();
  for (const c of e) {
    if (c.time < i || c.time > a || !Number.isFinite(c.value)) continue;
    const u = new Date(c.time), _ = t.group_by === "date" ? `${u.getFullYear()}-${u.getMonth()}-${u.getDate()}` : t.group_by === "hour" ? `${u.getFullYear()}-${u.getMonth()}-${u.getDate()}-${u.getHours()}` : String(Math.floor((c.time - i) / l));
    s.set(_, [...s.get(_) ?? [], c]);
  }
  return [...s.values()].map((c) => ({
    time: c.at(-1).time,
    value: ar(c.map((u) => u.value), o),
    label: c.at(-1)?.label
  })).sort((c, u) => c.time - u.time);
}, ua = (e) => {
  if (typeof e == "number" && Number.isFinite(e)) return { value: e, soft: !1 };
  if (typeof e != "string") return { soft: !1 };
  const t = e.trim().startsWith("~"), o = Number(e.replace(/^~/, ""));
  return { value: Number.isFinite(o) ? o : void 0, soft: t };
}, ma = (e, t, o, a = 0) => {
  let r = e.length ? Math.min(...e) : 0, n = e.length ? Math.max(...e) : 1;
  const i = ua(t), l = ua(o);
  if (i.value !== void 0 && (r = i.soft ? Math.min(r, i.value) : i.value), l.value !== void 0 && (n = l.soft ? Math.max(n, l.value) : l.value), n <= r) {
    const s = Math.max(1, Math.abs(r) * 0.05), c = i.value !== void 0 && !i.soft && l.value === void 0, u = l.value !== void 0 && !l.soft && i.value === void 0;
    c ? n = r + s * 2 : u ? r = n - s * 2 : (r -= s, n += s);
  }
  if (n - r < a) {
    const s = (r + n) / 2;
    r = s - a / 2, n = s + a / 2;
  }
  return { min: r, max: n };
}, _a = (e, t, o) => {
  let a = o;
  for (const r of t)
    r.value !== void 0 && e >= r.value && (a = r.color);
  return a;
}, Zi = (e, t) => Number.isFinite(e) ? e.toLocaleString(void 0, {
  minimumFractionDigits: t,
  maximumFractionDigits: t ?? 2
}) : "Unavailable", Qi = (e, t) => {
  if (!e.length) return "";
  if (!t || e.length < 3)
    return e.map((a, r) => `${r ? "L" : "M"} ${a.x} ${a.y}`).join(" ");
  let o = `M ${e[0].x} ${e[0].y}`;
  for (let a = 1; a < e.length; a += 1) {
    const r = e[a - 1], n = e[a], i = (r.x + n.x) / 2;
    o += ` C ${i} ${r.y}, ${i} ${n.y}, ${n.x} ${n.y}`;
  }
  return o;
}, es = (e, t) => {
  if (typeof e == "number" && Number.isFinite(e))
    return e < 1e10 ? e * 1e3 : e;
  const o = Date.parse(String(e ?? ""));
  return Number.isFinite(o) ? o : t;
}, ts = (e, t) => {
  const o = /* @__PURE__ */ new Map();
  if (Array.isArray(e))
    return e.forEach((a, r) => {
      if (!Array.isArray(a)) return;
      const n = a.find((l) => l && typeof l == "object"), i = typeof n?.entity_id == "string" ? n.entity_id : typeof n?.e == "string" ? n.e : t[r]?.entity;
      i && o.set(i, a);
    }), o;
  if (!e || typeof e != "object") return o;
  for (const [a, r] of Object.entries(e))
    Array.isArray(r) && o.set(a, r);
  return o;
}, Ao = class Ao extends $e {
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
      const o = this.config?.double_tap_action;
      if (o?.action && o.action !== "none") {
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
  static getStubConfig(t, o = [], a = []) {
    const r = [...o, ...a, ...Object.keys(t?.states ?? {})], n = r.find((i) => (i.startsWith("sensor.") || i.startsWith("binary_sensor.")) && !["unknown", "unavailable"].includes(t?.states[i]?.state ?? "")) ?? r.find((i) => i.startsWith("sensor.") || i.startsWith("binary_sensor.")) ?? "sensor.example";
    return da({
      type: "custom:mushroom-addition-mini-graph-card",
      entity: n,
      entities: [{ entity: n }],
      name: t?.states[n]?.attributes.friendly_name,
      show: { graph: "line", fill: !0, points: "hover", labels: "hover" }
    });
  }
  setConfig(t) {
    this.config = da(t), this.restartInterval(), this.requestKey = void 0, this.lastEntityStateSignature = this.entityStateSignature(), this.loadHistory();
  }
  getCardSize() {
    return Math.max(1, Math.ceil((Number(this.config?.height ?? 150) + 110) / 50));
  }
  updated(t) {
    if (!t.has("hass") && !t.has("config")) return;
    const o = this.entityStateSignature(), a = t.has("hass") && this.lastEntityStateSignature !== void 0 && o !== this.lastEntityStateSignature;
    this.lastEntityStateSignature = o, !(a && this.config?.update_interval) && this.loadHistory(a);
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
    const t = or(this.config.show), o = this.series[0], a = o ? _a(
      Number(o.state),
      Ct(this.config.color_thresholds ?? []),
      o.color
    ) : it[0], r = [
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
          ${this.renderHeader(o, a, t)}
          ${this.renderStates(o, a, t)}
          ${this.loading && t.loading_indicator ? d`<div class="loading"><ha-spinner size="small"></ha-spinner></div>` : this.error ? d`<div class="warning">${this.error}</div>` : this.renderGraph(t)}
          ${this.renderLegend(t)}
          ${this.renderStatistics(t)}
        </div>
      </ha-card>
    `;
  }
  renderHeader(t, o, a) {
    if (!a.name && (!a.icon || this.config?.align_icon === "state")) return p;
    const r = a.icon && this.config?.icon_type !== "none" && this.config?.align_icon !== "state" ? this.renderIcon(t, o, a) : p, n = this.presentation(t);
    return d`
      <div class="header" data-align=${this.config?.align_header ?? "default"}
        style=${`font-size:${this.config?.font_size_header ?? 14}px`}>
        ${this.config?.align_icon === "left" ? r : p}
        ${a.name ? d`
          <span class="name shared-presentation" style=${a.name_adaptive_color ? `color:${o}` : ""}>
            ${n.primary ? d`<span class="ulm-name">${n.primary}</span>` : p}
            ${n.secondary ? d`<span class="ulm-label">${n.secondary}</span>` : p}
          </span>
        ` : p}
        ${this.config?.align_icon !== "left" ? r : p}
      </div>
    `;
  }
  renderIcon(t, o, a) {
    const r = t ? this.hass?.states[t.config.entity] : void 0, n = this.config?.icon_type === "entity-picture" ? r?.attributes.entity_picture : void 0;
    return d`
      <span class="icon" style=${a.icon_adaptive_color ? `color:${o}` : ""}>
        ${this.config?.icon_image ? d`<img src=${this.config.icon_image} alt="">` : n ? d`<img src=${String(n)} alt="">` : ft(this.hass, r, typeof this.config?.icon == "string" ? this.config.icon : void 0, "mdi:chart-line")}
      </span>
    `;
  }
  renderStates(t, o, a) {
    if (!a.state || !t) return p;
    const r = a.state === "last" ? t.points.at(-1)?.value : t.state, n = Number(r), i = this.stateLabel(n, t.points.at(-1)?.label);
    return d`
      <div class="states" data-align=${this.config?.align_state ?? "left"}>
        ${this.renderState(t, i, o, !0)}
        ${this.series.slice(1).filter((l) => l.config.show_state).map((l) => this.renderState(
      l,
      this.stateLabel(Number(l.state), l.points.at(-1)?.label),
      _a(Number(l.state), Ct(this.config?.color_thresholds ?? []), l.color),
      !1
    ))}
        ${a.icon && this.config?.icon_type !== "none" && this.config?.align_icon === "state" ? this.renderIcon(t, o, a) : p}
      </div>
    `;
  }
  presentation(t) {
    if (!this.config) return {};
    const o = t?.config.entity ?? this.config.entity, a = o ? this.hass?.states[o] : void 0, r = ue(this.config, a, this.hass), n = A(a), i = (l) => {
      switch (l) {
        case "none":
          return;
        case "state":
          return n;
        case "last-changed":
          return a?.last_changed ? new Date(a.last_changed).toLocaleString() : "Last changed unavailable";
        case "last-updated":
          return a?.last_updated ? new Date(a.last_updated).toLocaleString() : "Last updated unavailable";
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
  renderState(t, o, a, r) {
    const n = t.config.state_adaptive_color ? a : "";
    return d`
      <span class="state ${r ? "primary" : "secondary"}" style=${n ? `color:${n}` : ""}>
        ${t.config.show_indicator ? d`<span class="indicator" style=${`background:${a}`}></span>` : p}
        <span class="state-value">${o}</span>
        <span class="unit">${t.unit}</span>
      </span>
    `;
  }
  renderGraph(t) {
    if (!t.graph || !this.series.some((m) => m.config.show_graph !== !1)) return p;
    const o = this.series.filter((m) => m.config.show_graph !== !1 && m.points.length), a = o.filter((m) => m.config.y_axis !== "secondary"), r = o.filter((m) => m.config.y_axis === "secondary"), n = a.flatMap((m) => m.points.map((h) => h.value)), i = r.flatMap((m) => m.points.map((h) => h.value));
    t.graph === "bar" && this.config?.lower_bound === void 0 && n.push(0), t.graph === "bar" && this.config?.lower_bound_secondary === void 0 && i.push(0);
    const l = ma(
      n,
      this.config?.lower_bound,
      this.config?.upper_bound,
      Number(this.config?.min_bound_range ?? 0)
    ), s = ma(
      i,
      this.config?.lower_bound_secondary,
      this.config?.upper_bound_secondary,
      Number(this.config?.min_bound_range_secondary ?? 0)
    ), c = o.flatMap((m) => m.points.map((h) => h.time)), u = Math.min(...c), _ = Math.max(...c);
    return d`
      <div class="graph" style=${`height:${this.config?.height ?? 150}px`}>
        ${t.labels && a.length ? d`
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
            ${o.map((m, h) => this.renderGradient(m, h, m.config.y_axis === "secondary" ? s : l))}
          </defs>
          ${o.map((m, h) => this.renderSeries(
      m,
      h,
      m.config.y_axis === "secondary" ? s : l,
      u,
      _,
      t,
      o.length
    ))}
        </svg>
      </div>
    `;
  }
  renderGradient(t, o, a) {
    const r = Ct(this.config?.color_thresholds ?? []), n = this.config?.color_thresholds_transition ?? "smooth";
    if (!r.length || t.config.color)
      return K`<linearGradient id=${`mini-graph-${o}`}><stop offset="0%" stop-color=${t.color}/><stop offset="100%" stop-color=${t.color}/></linearGradient>`;
    const i = r.flatMap((l, s) => {
      const c = Math.max(0, Math.min(100, 100 - ((l.value ?? a.min) - a.min) / (a.max - a.min) * 100));
      return n === "hard" && s > 0 ? [
        K`<stop offset=${`${c}%`} stop-color=${r[s - 1].color}/>`,
        K`<stop offset=${`${c}%`} stop-color=${l.color}/>`
      ] : [K`<stop offset=${`${c}%`} stop-color=${l.color}/>`];
    });
    return K`<linearGradient id=${`mini-graph-${o}`} x1="0" y1="1" x2="0" y2="0">${i}</linearGradient>`;
  }
  renderSeries(t, o, a, r, n, i, l) {
    const s = Number(this.config?.height ?? 150), c = (f) => {
      const v = this.config?.logarithmic ? Math.log10(Math.max(f, Number.EPSILON)) : f, $ = this.config?.logarithmic ? Math.log10(Math.max(a.min, Number.EPSILON)) : a.min, b = this.config?.logarithmic ? Math.log10(Math.max(a.max, Number.EPSILON)) : a.max;
      return s - (v - $) / Math.max(Number.EPSILON, b - $) * s;
    }, u = r === n, _ = t.points.map((f) => ({
      x: u ? 250 : (f.time - r) / Math.max(1, n - r) * 500,
      y: c(f.value),
      value: f.value,
      time: f.time
    })), m = t.config.color ? t.color : `url(#mini-graph-${o})`;
    if (i.graph === "bar") {
      const f = 500 / Math.max(1, Math.min(96, _.length)), v = Number(this.config?.bar_spacing ?? 4), $ = Math.max(1, (f - v) / l), b = Math.max(0, Math.min(s, c(0)));
      return K`
        <g class="series">
          ${_.slice(-96).map((M, L) => {
        const j = L * f + o * $ + v / 2, R = Math.min(M.y, b);
        return K`<rect x=${j} y=${R} width=${$} height=${Math.abs(b - M.y)} rx="1" fill=${m}>
              <title>${this.tooltip(t, M.value, M.time)}</title>
            </rect>`;
      })}
        </g>
      `;
    }
    const h = _.length === 1 ? [{ ..._[0], x: 0 }, { ..._[0], x: 500 }] : _, y = Qi(h, t.config.smoothing ?? this.config?.smoothing ?? !0), w = _.length ? `${y} L ${h.at(-1).x} ${s} L ${h[0].x} ${s} Z` : "";
    return K`
      <g class="series">
        ${i.fill && t.config.show_fill !== !1 ? K`<path class="fill ${i.fill === "fade" ? "fade" : ""}" d=${w} fill=${m}/>` : p}
        ${t.config.show_line !== !1 ? K`<path class="line" d=${y} stroke=${m} stroke-width=${this.config?.line_width ?? 5}/>` : p}
        ${i.points && t.config.show_points !== !1 ? _.map((f) => K`
            <circle class="point" cx=${f.x} cy=${f.y} r=${Math.max(2, Number(this.config?.line_width ?? 5) / 1.5)}
              fill=${t.config.color ?? m}>
              <title>${this.tooltip(t, f.value, f.time)}</title>
            </circle>`) : p}
      </g>
    `;
  }
  renderLegend(t) {
    const o = this.series.filter((a) => a.config.show_legend !== !1);
    return !t.legend || o.length < 2 ? p : d`
      <div class="legend">
        ${o.map((a) => d`
          <span class="legend-item">
            <span class="indicator" style=${`background:${a.color}`}></span>
            <span>${a.name}${a.config.show_legend_state ? ` (${this.stateLabel(Number(a.state))}${a.unit ? ` ${a.unit}` : ""})` : ""}</span>
          </span>
        `)}
      </div>
    `;
  }
  renderStatistics(t) {
    const o = this.series[0];
    if (!o || !t.average && !t.extrema || !o.points.length) return p;
    const a = o.points.map((l) => l.value), r = ar(a, "avg"), n = Math.min(...a), i = Math.max(...a);
    return d`
      <div class="statistics">
        ${t.average ? d`<span>Average <b>${this.stateLabel(r)} ${o.unit}</b></span>` : p}
        ${t.extrema ? d`
          <span>Minimum <b>${this.stateLabel(n)} ${o.unit}</b></span>
          <span>Maximum <b>${this.stateLabel(i)} ${o.unit}</b></span>
        ` : p}
      </div>
    `;
  }
  stateLabel(t, o) {
    if (o) return o;
    const a = this.config?.state_map?.[Math.round(t)];
    return a && Math.abs(t - Math.round(t)) < Number.EPSILON ? a.label ?? a.value : Zi(t, this.config?.decimals);
  }
  tooltip(t, o, a) {
    const r = new Date(a).toLocaleString(this.hass?.language, {
      hour12: !(this.config?.hour24 ?? !1)
    });
    return `${t.name}: ${this.stateLabel(o)}${t.unit ? ` ${t.unit}` : ""} · ${r}`;
  }
  restartInterval() {
    this.interval && window.clearInterval(this.interval), this.interval = void 0, !(!this.isConnected || !this.config?.update_interval) && (this.interval = window.setInterval(() => {
      this.loadHistory(!0);
    }, this.config.update_interval * 1e3));
  }
  entityStateSignature() {
    if (!(!this.hass || !this.config))
      return JSON.stringify(Qt(this.config).map((t) => {
        const o = this.hass?.states[t.entity];
        return {
          entity: t.entity,
          attribute: t.attribute,
          value: St(o, t.attribute),
          lastChanged: o?.last_changed,
          lastUpdated: o?.last_updated
        };
      }));
  }
  singleEntityStateSignature(t) {
    const o = this.hass?.states[t.entity];
    return JSON.stringify({
      value: St(o, t.attribute),
      lastChanged: o?.last_changed,
      lastUpdated: o?.last_updated
    });
  }
  async loadHistory(t = !1) {
    if (!this.hass || !this.config) return;
    const o = Qt(this.config), a = JSON.stringify({
      entities: o,
      hours: this.config.hours_to_show,
      points: this.config.points_per_hour,
      grouping: this.config.group_by,
      factor: this.config.value_factor,
      map: this.config.state_map,
      state: this.entityStateSignature()
    });
    if (!t && a === this.requestKey) return;
    this.requestKey = a;
    const r = ++this.historyGeneration;
    this.loading = !0, this.error = void 0;
    try {
      const n = Date.now(), i = n - Number(this.config.hours_to_show ?? 24) * 36e5, l = await this.fetchHistory(o, i, n, t, r);
      if (r !== this.historyGeneration) return;
      this.series = o.map((s, c) => this.buildSeries(s, c, l[s.entity] ?? [], i, n)), this.error = this.series.some((s) => s.points.length) ? void 0 : "No recorder history is available for the selected entities.";
    } catch (n) {
      if (r !== this.historyGeneration) return;
      this.error = n instanceof Error ? n.message : "Unable to load recorder history.", console.warn("Mushroom Cards Addition: unable to load Mini Graph history", n);
    } finally {
      r === this.historyGeneration && (this.loading = !1);
    }
  }
  async fetchHistory(t, o, a, r, n) {
    const i = {}, l = [];
    for (const u of t) {
      if (u.fixed_value) continue;
      const _ = r ? void 0 : this.readCache(u, o);
      _ ? i[u.entity] = _ : l.push(u);
    }
    if (!l.length) return i;
    if (!this.hass?.connection?.sendMessagePromise) {
      for (const u of l) i[u.entity] = this.attributeHistory(u);
      return i;
    }
    const s = await this.hass.connection.sendMessagePromise({
      type: "history/history_during_period",
      start_time: new Date(o).toISOString(),
      end_time: new Date(a).toISOString(),
      entity_ids: [...new Set(l.map((u) => u.entity))],
      no_attributes: !1,
      minimal_response: !1,
      significant_changes_only: !1
    }), c = ts(s, l);
    if (n !== this.historyGeneration) return i;
    for (const u of l) {
      const m = (c.get(u.entity) ?? []).flatMap((h) => {
        if (!h || typeof h != "object") return [];
        const y = h, w = y.state ?? y.s, f = y.attributes ?? y.a ?? {}, v = u.attribute ? u.attribute.split(".").reduce((M, L) => M && typeof M == "object" ? M[L] : void 0, f) : w, $ = kt(v, this.config?.state_map ?? []), b = es(
          y.last_updated ?? y.last_changed ?? y.lu ?? y.lc,
          a
        );
        return $.value === void 0 || !Number.isFinite(b) ? [] : [{ time: b, value: $.value, label: $.label }];
      });
      i[u.entity] = m.length ? m : this.attributeHistory(u), this.writeCache(u, i[u.entity]);
    }
    return i;
  }
  attributeHistory(t) {
    const o = this.hass?.states[t.entity], a = o?.attributes.history;
    if (Array.isArray(a)) {
      const n = Date.now();
      return a.flatMap((i, l) => {
        const s = typeof i == "object" && i ? i.value ?? i.state : i, c = kt(s, this.config?.state_map ?? []), u = typeof i == "object" && i ? Date.parse(String(i.time ?? i.last_changed ?? "")) : Number.NaN;
        return c.value === void 0 ? [] : [{
          time: Number.isFinite(u) ? u : n - (a.length - l - 1) * 36e5 / Number(this.config?.points_per_hour ?? 0.5),
          value: c.value,
          label: c.label
        }];
      });
    }
    const r = kt(St(o, t.attribute), this.config?.state_map ?? []);
    return r.value === void 0 ? [] : [{ time: Date.now(), value: r.value, label: r.label }];
  }
  buildSeries(t, o, a, r, n) {
    const i = this.hass?.states[t.entity], l = kt(St(i, t.attribute), this.config?.state_map ?? []), s = 10 ** Number(this.config?.value_factor ?? 0), c = Date.parse(i?.last_updated ?? i?.last_changed ?? "") || n, u = l.value === void 0 ? a : [
      ...a.filter((w) => w.time !== c),
      { time: c, value: l.value, label: l.label }
    ], m = (t.fixed_value && l.value !== void 0 ? [{ time: r, value: l.value }, { time: n, value: l.value }] : u).map((w) => ({ ...w, value: w.value * s })), h = Ji(
      m,
      this.config ?? {},
      t.aggregate_func ?? this.config?.aggregate_func ?? "avg",
      n
    ), y = Array.isArray(this.config?.line_color) ? this.config.line_color : [this.config?.line_color ?? it[0]];
    return {
      config: t,
      points: h,
      color: t.color ?? y[o] ?? it[o % it.length],
      state: l.value === void 0 ? i?.state : l.value * s,
      unit: t.unit ?? this.config?.unit ?? String(i?.attributes.unit_of_measurement ?? ""),
      name: t.name ?? String(i?.attributes.friendly_name ?? t.entity)
    };
  }
  cacheKey(t) {
    return `mushroom-mini-graph:${t.entity}:${t.attribute ?? "state"}:${this.config?.hours_to_show}:${this.config?.points_per_hour}`;
  }
  readCache(t, o) {
    if (!(!this.config?.cache || typeof localStorage > "u"))
      try {
        const a = JSON.parse(localStorage.getItem(this.cacheKey(t)) ?? "null"), r = Math.max(60, Number(this.config.update_interval ?? 300)) * 1e3;
        return !a || a.stateSignature !== this.singleEntityStateSignature(t) || Date.now() - a.fetchedAt > r ? void 0 : a.points.filter((n) => n.time >= o);
      } catch {
        return;
      }
  }
  writeCache(t, o) {
    if (!(!this.config?.cache || typeof localStorage > "u"))
      try {
        localStorage.setItem(this.cacheKey(t), JSON.stringify({
          fetchedAt: Date.now(),
          stateSignature: this.singleEntityStateSignature(t),
          points: o
        }));
      } catch (a) {
        console.warn("Mushroom Cards Addition: unable to cache Mini Graph history", a);
      }
  }
  runAction(t) {
    if (!this.config) return;
    const o = t === "tap_action" ? "tap" : t === "hold_action" ? "hold" : "double_tap", a = this.config[t], r = typeof a?.entity == "string" ? a.entity : this.config.entity;
    _e(this, "hass-action", {
      config: { ...this.config, entity: r },
      action: o
    });
  }
};
Ao.styles = Be`
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
    .icon ha-icon, .icon ha-state-icon { --mdc-icon-size: 20px; }
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
let ze = Ao;
$t([
  he({ attribute: !1 })
], ze.prototype, "hass");
$t([
  re()
], ze.prototype, "config");
$t([
  re()
], ze.prototype, "series");
$t([
  re()
], ze.prototype, "loading");
$t([
  re()
], ze.prototype, "error");
const pa = (e, t, o) => {
  const a = /* @__PURE__ */ new Map();
  for (let r = t; r <= o; r++) a.set(e[r], r);
  return a;
}, os = Ja(class extends Za {
  constructor(e) {
    if (super(e), e.type !== wo.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e, t, o) {
    let a;
    o === void 0 ? o = t : t !== void 0 && (a = t);
    const r = [], n = [];
    let i = 0;
    for (const l of e) r[i] = a ? a(l, i) : i, n[i] = o(l, i), i++;
    return { values: n, keys: r };
  }
  render(e, t, o) {
    return this.dt(e, t, o).values;
  }
  update(e, [t, o, a]) {
    const r = Hn(e), { values: n, keys: i } = this.dt(t, o, a);
    if (!Array.isArray(r)) return this.ut = i, n;
    const l = this.ut ??= [], s = [];
    let c, u, _ = 0, m = r.length - 1, h = 0, y = n.length - 1;
    for (; _ <= m && h <= y; ) if (r[_] === null) _++;
    else if (r[m] === null) m--;
    else if (l[_] === i[h]) s[h] = De(r[_], n[h]), _++, h++;
    else if (l[m] === i[y]) s[y] = De(r[m], n[y]), m--, y--;
    else if (l[_] === i[y]) s[y] = De(r[_], n[y]), at(e, s[y + 1], r[_]), _++, y--;
    else if (l[m] === i[h]) s[h] = De(r[m], n[h]), at(e, r[_], r[m]), m--, h++;
    else if (c === void 0 && (c = pa(i, h, y), u = pa(l, _, m)), c.has(l[_])) if (c.has(l[m])) {
      const w = u.get(i[h]), f = w !== void 0 ? r[w] : null;
      if (f === null) {
        const v = at(e, r[_]);
        De(v, n[h]), s[h] = v;
      } else s[h] = De(f, n[h]), at(e, r[_], f), r[w] = null;
      h++;
    } else Ut(r[m]), m--;
    else Ut(r[_]), _++;
    for (; h <= y; ) {
      const w = at(e, s[y + 1]);
      De(w, n[h]), s[h++] = w;
    }
    for (; _ <= m; ) {
      const w = r[_++];
      w !== null && Ut(w);
    }
    return this.ut = i, Vn(e, s), je;
  }
});
var as = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z", rs = "M21 11H3V9H21V11M21 13H3V15H21V13Z", ns = "M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z";
const So = ["alert_color", "sensor_wrap", "sensor_icons", "use_light_color", "light_entity"], ko = (e) => !e || ["default", "state"].includes(e) ? void 0 : /^(#|rgb|hsl|var\(|color\()/.test(e) ? e : `var(--${e}-color, ${e})`;
function is(e, t) {
  const o = e.shadowRoot;
  if (!o) return;
  const a = e.hass, r = e._config?.area;
  let n;
  if (t.use_light_color && a && typeof r == "string") {
    const v = e._config?.exclude_entities, $ = e._domainEntityIds?.(a.entities, r, ["light"], v) ?? Object.keys(a.states).filter((b) => {
      const M = a.entities?.[b];
      return (M?.area_id ?? (M?.device_id ? a.devices?.[M.device_id]?.area_id : void 0)) === r;
    });
    for (const b of [...$].sort())
      if (!(!b.startsWith("light.") || v?.includes(b)) && (n = fo(a, a.states[b]), n))
        break;
  }
  e.toggleAttribute("data-light-accent", !!n), n ? e.style.setProperty("--addition-room-rgb", n.join(",")) : e.style.removeProperty("--addition-room-rgb");
  const i = ko(t.alert_color);
  i ? e.style.setProperty("--addition-alert-color", i) : e.style.removeProperty("--addition-alert-color");
  let l = o.querySelector("style[data-area-content]");
  l || (l = document.createElement("style"), l.dataset.areaContent = "", l.textContent = `
      :host([data-light-accent]) ha-card {
        background: linear-gradient(rgba(var(--addition-room-rgb), .12), rgba(var(--addition-room-rgb), .12)),
          var(--ha-card-background, var(--card-background-color));
        --tile-color: rgb(var(--addition-room-rgb)) !important;
      }
      .header .alerts .alert { background-color: var(--addition-alert-color, var(--orange-color)); }
      ha-tile-icon .alert-badge { --tile-badge-background-color: var(--addition-alert-color, var(--orange-color)); }
      ha-tile-info:has(.addition-sensors) { min-width: 0; }
      ha-tile-container:has(.addition-sensors.wrap) {
        --ha-tile-info-min-height: auto;
        --ha-tile-info-primary-min-height: auto;
      }
      .addition-sensors { display:flex; align-items:center; gap:4px 8px; min-width:0;
        max-width:100%; overflow:hidden; white-space:nowrap; }
      .addition-sensors.wrap { flex-wrap:wrap; overflow:visible; white-space:normal; }
      .addition-sensor { display:inline-flex; align-items:center; gap:4px; min-width:0; }
      .addition-sensor .value { overflow-wrap:anywhere; }
      .addition-sensor ha-state-icon { flex:none; --mdc-icon-size:14px;
        color:var(--secondary-text-color); }
    `, o.append(l));
  const s = o.querySelector("ha-tile-info");
  if (!s) return;
  const c = o.querySelector("ha-tile-container");
  if (c) {
    const v = e._config;
    c.fixedInfoHeight = !t.sensor_wrap && v?.display_type === "compact" && e.layout === "grid" && v.grid_options?.rows !== "auto";
  }
  let u = s.querySelector(".addition-sensors");
  if (!t.sensor_wrap && !t.sensor_icons) {
    u?.remove();
    return;
  }
  const _ = e._config;
  if (!_ || !a || !e._computeSensorsDisplay || !e._groupedSensorEntityIds)
    throw new Error("This Home Assistant frontend cannot enhance Area sensor content. Disable sensor wrapping/icons or update Home Assistant.");
  const m = String(_.area), h = _.sensor_classes ?? [], y = _.exclude_entities, w = e._groupedSensorEntityIds(a.entities, m, h, y), f = h.flatMap((v) => {
    const $ = new Proxy(e, {
      get: (C, P) => P === "_config" ? { ..._, sensor_classes: [v] } : Reflect.get(C, P, C)
    }), b = e._computeSensorsDisplay.call($);
    if (!b) return [];
    const L = a.areas?.[m]?.[`${v}_entity_id`];
    let R = (typeof L == "string" ? [L] : w.get(v) ?? []).map((C) => a.states[C]).find((C) => C && !["unknown", "unavailable"].includes(C.state));
    if (!R && ["temperature", "humidity"].includes(v)) {
      const C = v === "temperature" ? ["climate"] : ["climate", "humidifier"];
      R = (e._domainEntityIds?.(a.entities, m, C, y) ?? []).map((q) => a.states[q]).find((q) => q?.attributes[`current_${v}`] != null);
    }
    const Z = R?.entity_id.startsWith("sensor.") ? R : { entity_id: `sensor.area_${v}`, state: b, attributes: { device_class: v } };
    return [{ sensorClass: v, value: b, stateObj: Z }];
  });
  u || (u = document.createElement("div"), u.slot = "secondary", u.className = "addition-sensors", s.append(u)), u.classList.toggle("wrap", !!t.sensor_wrap), $a(d`${f.map(({ sensorClass: v, value: $, stateObj: b }) => d`
    <span class="addition-sensor" title=${v.replaceAll("_", " ")}>
      ${t.sensor_icons ? d`<ha-state-icon .hass=${a} .stateObj=${b}
        ._config=${a.config} ._connection=${a.connection} ._entities=${a.entities}></ha-state-icon>` : ""}
      <span class="value">${$}</span>
    </span>`)}`, u);
}
function ha(e, t) {
  const o = ko(t);
  o ? e.style.setProperty("--addition-control-color", o) : e.style.removeProperty("--addition-control-color");
  const a = e.shadowRoot;
  if (!a || a.querySelector("style[data-area-color]")) return;
  const r = document.createElement("style");
  r.dataset.areaColor = "", r.textContent = `:host([data-custom-color]) ha-control-button {
    --control-button-icon-color: var(--addition-control-color);
    --control-button-focus-color: var(--addition-control-color);
  }
  ha-control-button:not(.active) {
    --control-button-background-color: var(--disabled-color, var(--secondary-text-color));
    --control-button-background-opacity: .14;
  }
  :host([data-custom-color]) ha-control-button.active {
    --control-button-background-color: var(--addition-control-color);
    --control-button-icon-color: var(--addition-control-color);
  }`, a.append(r);
}
var ss = Object.defineProperty, se = (e, t, o, a) => {
  for (var r = void 0, n = e.length - 1, i; n >= 0; n--)
    (i = e[n]) && (r = i(t, o, r) || r);
  return r && ss(t, o, r), r;
};
const yt = "mushroom-addition-area-card-advanced", bt = "mushroom-addition-area-controls-advanced", Vt = (e) => typeof e != "string" && [
  "domain",
  "type",
  "name",
  "content_info",
  "content",
  "use_entity_picture",
  "icon",
  "icon_color",
  "tap_action",
  "hold_action",
  "double_tap_action"
].some((t) => t in e), eo = (e) => typeof e != "string" && e.type && e.type !== "entity", rr = /* @__PURE__ */ new WeakMap(), nr = /* @__PURE__ */ new WeakMap(), ir = /* @__PURE__ */ new WeakMap(), sr = (e) => {
  if (!Vt(e)) return e;
  const t = { ...e };
  for (const o of [
    "type",
    "domain",
    "name",
    "content_info",
    "attribute",
    "content",
    "use_entity_picture",
    "icon",
    "icon_color",
    "tap_action",
    "hold_action",
    "double_tap_action",
    "conditions",
    "control"
  ]) delete t[o];
  return e.domain ?? t;
};
function mt(e, t = !1) {
  const o = { ...e };
  for (const a of So) delete o[a];
  return {
    ...o,
    type: "area",
    ...e.features ? { features: e.features.map((a) => {
      if (a.type !== "area-controls") return a;
      if (t) {
        const r = { ...a, ...a.controls ? { controls: a.controls.filter((n) => !eo(n)).map((n) => {
          const i = sr(n);
          return typeof i == "object" && typeof n == "object" && ir.set(i, n), i;
        }) } : {} };
        return rr.set(r, a), r.controls && nr.set(r.controls, a), r;
      }
      return a.controls?.some(Vt) ? { ...a, type: `custom:${bt}` } : a;
    }) } : {}
  };
}
const zt = (e) => typeof e == "string" || e.domain ? !1 : e.type === "conditional" ? !!(e.control && zt(e.control)) : e.type === "template" ? !!(e.content || e.name) : (e.content_info ?? (e.name ? "name" : e.content ? "custom" : "none")) !== "none", qt = (e) => e?.features?.some((t) => t.type === "area-controls" && t.controls?.some(zt)) ?? !1;
function Me(e, t) {
  return new Promise((o, a) => {
    const r = window.setTimeout(() => a(new Error(t)), 8e3);
    e.then(
      (n) => {
        window.clearTimeout(r), o(n);
      },
      (n) => {
        window.clearTimeout(r), a(n);
      }
    );
  });
}
async function lr(e) {
  const t = window.loadCardHelpers;
  if (!t) throw new Error("Home Assistant card helpers are unavailable. Open this card in Home Assistant, then retry.");
  const o = await Me(t(), "Home Assistant card helpers timed out. Retry."), a = await Me(Promise.resolve(o.createCardElement(e)), "Native Area card timed out. Retry.");
  if (a.localName !== "hui-area-card")
    throw new Error("The installed Home Assistant frontend does not provide the native Area card. Update Home Assistant, then retry.");
  if (await Me(
    customElements.whenDefined("hui-area-card"),
    "The native Area card did not finish loading. Check Home Assistant frontend compatibility and retry."
  ), customElements.upgrade(a), typeof a.setConfig != "function") throw new Error("The native Area card could not be initialized. Retry.");
  return a.setConfig(e), a;
}
const Co = class Co extends $e {
  constructor() {
    super(...arguments), this.loadingControls = !1, this.revision = 0;
  }
  static async getConfigElement() {
    return document.createElement(`${yt}-editor`);
  }
  static getStubConfig(t) {
    return { type: `custom:${yt}`, ...Object.keys(t?.areas ?? {})[0] ? { area: Object.keys(t.areas)[0] } : {} };
  }
  setConfig(t) {
    this.config = t, this.load();
  }
  getCardSize() {
    const t = this.card?.getCardSize?.() ?? 3;
    return qt(this.config) ? typeof t == "number" ? t + 1 : t.then((o) => o + 1) : t;
  }
  getGridOptions() {
    const t = this.card?.getGridOptions?.() ?? { columns: 12, rows: 3 };
    if (!qt(this.config) || !t || typeof t != "object") return t;
    const o = t;
    return {
      ...o,
      ...typeof o.rows == "number" ? { rows: o.rows + 1 } : {},
      ...typeof o.min_rows == "number" ? { min_rows: o.min_rows + 1 } : {}
    };
  }
  async load() {
    if (!this.config) return;
    const t = ++this.revision;
    if (this.error = void 0, !this.config.area) {
      this.error = "Select an area in the native Area editor.";
      return;
    }
    const o = mt(this.config);
    try {
      const a = o.features?.some((r) => r.type === `custom:${bt}`) && !customElements.get("hui-area-controls-card-feature");
      if (this.card) this.card.setConfig(a ? mt(this.config, !0) : o);
      else {
        const r = await lr(a ? mt(this.config, !0) : o);
        if (t !== this.revision) return;
        this.card = r;
      }
      if (this.loadingControls = !!a, this.sync(), a) {
        if (await this.updateComplete, await Me(customElements.whenDefined("hui-area-controls-card-feature"), "The installed frontend cannot load native Area controls. Update Home Assistant, then retry."), t !== this.revision) return;
        this.card.setConfig(o), this.loadingControls = !1;
      }
    } catch (a) {
      t === this.revision && (this.error = String(a instanceof Error ? a.message : a));
    }
  }
  sync() {
    if (this.card) {
      this.card.hass = this.hass, this.card.layout = this.layout, qt(this.config) ? this.card.style.setProperty("--feature-height", "64px") : this.card.style.removeProperty("--feature-height");
      const t = this.card, o = this.config;
      Promise.resolve(t.updateComplete).then(() => {
        t !== this.card || o !== this.config || !this.isConnected || is(t, o ?? {});
      }).catch((a) => {
        t === this.card && o === this.config && (this.error = a instanceof Error ? a.message : String(a));
      });
    }
  }
  updated() {
    this.sync();
  }
  render() {
    return this.error ? d`<ha-alert alert-type="error">${this.error}
      <button @click=${() => {
      this.card = void 0, this.load();
    }}>Retry native Area card</button></ha-alert>` : this.card ? d`<div class=${this.loadingControls ? "loading" : "native"}>${this.card}</div>
        ${this.loadingControls ? d`<div role="status">Loading native Area controls…</div>` : p}` : d`<div role="status">Loading native Area card…</div>`;
  }
};
Co.styles = Be`:host { display: block; height: 100%; } .native, hui-area-card { height: 100%; }
    .loading { position: absolute; visibility: hidden; pointer-events: none; }`;
let Te = Co;
se([
  he({ attribute: !1 })
], Te.prototype, "hass");
se([
  he({ attribute: !1 })
], Te.prototype, "layout");
se([
  re()
], Te.prototype, "error");
se([
  re()
], Te.prototype, "card");
se([
  re()
], Te.prototype, "loadingControls");
function to(e) {
  const t = e.split(".")[0];
  return ["button", "input_button"].includes(t) ? { action: "perform-action", perform_action: `${t}.press`, target: { entity_id: e } } : ["scene", "script"].includes(t) ? { action: "perform-action", perform_action: `${t}.turn_on`, target: { entity_id: e } } : { action: ["light", "switch", "fan", "input_boolean", "automation", "humidifier", "remote", "siren"].includes(t) ? "toggle" : "more-info" };
}
const Io = class Io extends $e {
  constructor() {
    super(...arguments), this.ready = !1, this.groups = /* @__PURE__ */ new Map(), this.conditionals = /* @__PURE__ */ new Map(), this.conditionalErrors = /* @__PURE__ */ new Map(), this.templateValues = /* @__PURE__ */ new Map(), this.templates = /* @__PURE__ */ new Map(), this.generation = 0, this.configRevision = 0;
  }
  static isSupported() {
    return !0;
  }
  setConfig(t) {
    this.config = t, this.configRevision++, this.context = this.context ?? t.area_context, this.position = this.position ?? t.feature_position, this.color = this.color ?? t.feature_color, this.groups.clear(), this.conditionals.clear(), this.conditionalErrors.clear(), this.clearTemplates(), this.load();
  }
  getCardSize() {
    return this.config?.controls?.some(zt) ? 2 : 1;
  }
  connectedCallback() {
    super.connectedCallback(), this.requestUpdate();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.clearTemplates(), this.configRevision++, this.conditionals.clear();
  }
  clearTemplates() {
    this.generation++;
    for (const t of this.templates.values()) t.unsubscribe?.();
    this.templates.clear(), this.templateValues.clear();
  }
  updated() {
    if (this.templateConnection !== this.hass?.connection && (this.clearTemplates(), this.templateConnection = this.hass?.connection), !!this.isConnected) {
      for (const [t, o] of (this.config?.controls ?? []).entries())
        if (!(typeof o == "string" || o.type !== "template"))
          for (const a of ["content", "name", "icon", "icon_color"]) {
            const r = o[a];
            if (!r || !/\{[{%#]/.test(r)) continue;
            const n = `${t}:${a}`;
            if (this.templates.get(n)?.template === r) continue;
            const i = { template: r, generation: this.generation, unsubscribe: void 0 };
            if (this.templates.set(n, i), !this.hass?.connection) {
              this.templateValues.set(n, "Template error: Home Assistant template connection unavailable."), this.requestUpdate();
              continue;
            }
            this.hass.connection.subscribeMessage((l) => {
              i.generation === this.generation && (this.templateValues.set(n, l.error ? `Template error: ${String(l.error)}` : String(l.result ?? "")), this.requestUpdate());
            }, { type: "render_template", template: r, variables: {
              config: o,
              entity: o.entity_id,
              user: this.hass.user?.name
            } }).then((l) => {
              i.generation !== this.generation ? l() : i.unsubscribe = l;
            }).catch((l) => {
              i.generation === this.generation && (this.templateValues.set(n, `Template error: ${String(l)}`), this.requestUpdate());
            });
          }
    }
  }
  template(t, o) {
    const a = { ...t };
    for (const r of ["content", "name", "icon", "icon_color"])
      a[r] && /\{[{%#]/.test(a[r]) && (a[r] = this.templateValues.get(`${o}:${r}`) ?? "");
    return a;
  }
  conditional(t, o) {
    if (!t.control) return d`<ha-alert alert-type="error">Conditional control needs a nested button.</ha-alert>`;
    const a = this.conditionalErrors.get(o);
    if (a) return d`<ha-alert alert-type="error">${a}</ha-alert>`;
    if (!this.conditionals.has(o)) {
      this.conditionals.set(o, null);
      const n = this.configRevision, i = window.loadCardHelpers;
      if (!i)
        return this.conditionalErrors.set(o, "Native conditional controls require Home Assistant card helpers."), this.requestUpdate(), p;
      Me(i().then((l) => l.createCardElement({
        type: "conditional",
        conditions: t.conditions ?? [],
        card: {
          type: `custom:${bt}`,
          controls: [t.control],
          area_context: this.context,
          feature_position: this.position,
          feature_color: this.color
        }
      })), "Native conditional control timed out.").then((l) => {
        if (!(n !== this.configRevision || !this.isConnected)) {
          if (l.localName !== "hui-conditional-card") throw new Error("Native conditional cards are unavailable in this frontend.");
          this.conditionals.set(o, l), this.requestUpdate();
        }
      }).catch((l) => {
        n === this.configRevision && (this.conditionalErrors.set(o, String(l)), this.requestUpdate());
      });
    }
    const r = this.conditionals.get(o);
    return r && (r.preview = !1, r.hass = this.hass), r ?? d`<span role="status">Loading conditional control…</span>`;
  }
  label(t) {
    const o = this.hass?.states[t.entity_id ?? ""];
    if (t.type === "template") return t.content ?? t.name ?? "";
    switch (t.content_info ?? (t.name ? "name" : t.content ? "custom" : "none")) {
      case "name":
        return t.name ?? o?.attributes.friendly_name ?? t.entity_id ?? "";
      case "state":
        return o ? `${o.state}${o.attributes.unit_of_measurement ? ` ${o.attributes.unit_of_measurement}` : ""}` : "";
      case "last-changed":
        return o?.last_changed ? d`<ha-relative-time .hass=${this.hass} .datetime=${o.last_changed}></ha-relative-time>` : "";
      case "last-updated":
        return o?.last_updated ? d`<ha-relative-time .hass=${this.hass} .datetime=${o.last_updated}></ha-relative-time>` : "";
      case "attribute":
        return String(o?.attributes[t.attribute ?? ""] ?? "");
      case "custom":
        return t.content ?? "";
      default:
        return "";
    }
  }
  async load() {
    try {
      await Me(
        customElements.whenDefined("hui-area-controls-card-feature"),
        "Native Area controls are unavailable. This frontend is not supported; update Home Assistant and retry."
      ), this.ready = !0, this.error = void 0;
    } catch (t) {
      this.error = String(t instanceof Error ? t.message : t);
    }
  }
  group(t, o, a) {
    let r = this.groups.get(o);
    r || (r = document.createElement("hui-area-controls-card-feature"), r.setConfig({ ...this.config, type: "area-controls", ...t ? { controls: t } : {} }), this.groups.set(o, r)), r.hass = this.hass, r.context = this.context, r.position = this.position, r.color = a?.icon_color ?? this.color;
    const n = a?.icon_color;
    return r.toggleAttribute("data-custom-color", !!ko(n)), ha(r, n), Promise.resolve(r.updateComplete).then(() => ha(r, n)).catch((i) => {
      this.error = i instanceof Error ? i.message : String(i);
    }), r;
  }
  render() {
    return this.toggleAttribute("named", this.config?.controls?.some(zt) ?? !1), this.error ? d`<ha-alert alert-type="error">${this.error}<button @click=${() => {
      this.load();
    }}>Retry</button></ha-alert>` : !this.config || !this.hass || !this.ready ? p : this.config.controls === void 0 ? this.group(void 0, "automatic") : d`${this.config.controls.map((t, o) => {
      const a = typeof t == "object" && t.type === "template" ? this.template(t, o) : t;
      if (!Vt(a)) return this.group([a], String(o));
      if (a.type === "conditional") return this.conditional(a, o);
      if (a.domain)
        return d`<div class="domain">${this.group([a.domain], String(o), a)}
          ${a.icon || a.tap_action ? d`<ha-alert alert-type="warning">Domain icon and tap overrides require an entity control. Select an entity below instead.</ha-alert>` : p}</div>`;
      const r = a.entity_id ?? "", n = this.hass.states[r], i = !!r && (!n || ["unavailable", "unknown"].includes(n.state)), l = n && !["off", "closed", "locked", "idle", "standby", "unavailable", "unknown"].includes(n.state), s = {
        type: `custom:${yt}`,
        entity: r,
        tap_action: a.tap_action ?? (r ? to(r) : { action: "none" }),
        hold_action: a.hold_action,
        double_tap_action: a.double_tap_action
      }, c = a.icon_color, u = c && !["default", "state"].includes(c) ? /^(#|rgb|hsl|var\(|color\()/.test(c) ? c : `var(--${c}-color, ${c})` : l ? this.color ?? "var(--state-active-color, var(--primary-color))" : "var(--state-icon-color)", _ = Object.entries(a).find(([, y]) => typeof y == "string" && y.startsWith("Template error:"));
      if (_) return d`<ha-alert alert-type="error">${_[1]}</ha-alert>`;
      const m = a.use_entity_picture && typeof n?.attributes.entity_picture == "string" ? n.attributes.entity_picture : void 0, h = this.label(a);
      return d`<button class="entity" ?disabled=${i} aria-label=${String((a.name ?? n?.attributes.friendly_name ?? r) || "Area action")}
        aria-pressed=${!!l} style=${`--control-icon-color:${u}`}
        ${He(s)}>
        <span class="button-icon">${m ? d`<img src=${m} alt="">` : a.icon || !r ? d`<ha-icon .icon=${a.icon || "mdi:gesture-tap-button"}></ha-icon>` : d`<ha-state-icon .hass=${this.hass} .stateObj=${n}
              ._config=${this.hass.config} ._connection=${this.hass.connection}
              ._entities=${this.hass.entities}></ha-state-icon>`}</span>
        ${h ? d`<span class="button-label">${h}</span>` : p}
      </button>`;
    })}`;
  }
};
Io.styles = Be`
    :host { display: flex; gap: 8px; align-items: center; min-width: 0; }
    .domain { min-width: 0; flex: 1; }
    hui-area-controls-card-feature { flex: 1; min-width: 0; }
    hui-conditional-card { flex: 1; min-width: 0; }
    hui-conditional-card[hidden] { display: none !important; }
    .entity { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; min-width: 42px;
      height: var(--feature-height, 42px); border: 0; border-radius: var(--ha-card-border-radius, 12px);
      background: color-mix(in srgb, var(--disabled-color, var(--secondary-text-color)) 14%,
        var(--ha-card-background, var(--card-background-color))); cursor: pointer;
      color: var(--control-icon-color); --mdc-icon-size: 24px; }
    .entity[aria-pressed="true"] { background: color-mix(in srgb, var(--control-icon-color) 16%, transparent); }
    .entity:disabled { color: var(--disabled-text-color, var(--secondary-text-color)); cursor: default; }
    .entity:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    :host([named]) { --feature-height: 64px; }
    :host([named]) .entity { height: 64px; padding: 6px 4px; }
    .button-icon { display: flex; align-items: center; justify-content: center; }
    .button-icon img { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; }
    .button-label { margin-top: auto; padding-top: 4px; line-height: 16px; font-size: 11px;
      max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  `;
let xe = Io;
se([
  he({ attribute: !1 })
], xe.prototype, "hass");
se([
  he({ attribute: !1 })
], xe.prototype, "context");
se([
  he()
], xe.prototype, "position");
se([
  he()
], xe.prototype, "color");
se([
  re()
], xe.prototype, "config");
se([
  re()
], xe.prototype, "error");
se([
  re()
], xe.prototype, "ready");
const rt = (e) => {
  const t = sr(e);
  return typeof t == "string" ? `domain:${t}` : `entity:${t.entity_id}`;
}, Mt = (e) => JSON.stringify(Object.fromEntries(
  Object.entries(e).filter(([t]) => t !== "controls").sort(([t], [o]) => t.localeCompare(o))
));
function ls(e, t) {
  const o = [...e.features ?? []];
  return {
    ...t,
    ...Object.fromEntries(So.filter((a) => a in t || e[a] !== void 0).map((a) => [a, a in t ? t[a] : e[a]])),
    type: e.type,
    ...t.features ? { features: t.features.map((a) => {
      if (a.type !== "area-controls") return a;
      const r = rr.get(a) ?? (a.controls && nr.get(a.controls)), n = o.map((u, _) => ({ item: u, index: _ })).filter(({ item: u }) => u.type === a.type), i = (a.controls ?? []).map(rt);
      n.sort((u, _) => +(Mt(_.item) === Mt(a)) - +(Mt(u.item) === Mt(a)) || i.filter((m) => _.item.controls?.some((h) => rt(h) === m)).length - i.filter((m) => u.item.controls?.some((h) => rt(h) === m)).length);
      const l = n.find(({ item: u }) => u === r) ?? n[0];
      if (!l) return a;
      o.splice(l.index, 1);
      const s = [...l.item.controls ?? []].filter((u) => !eo(u)), c = a.controls?.map((u) => {
        const _ = typeof u == "object" ? ir.get(u) : void 0, m = _ ? s.indexOf(_) : -1, h = m >= 0 ? m : s.findIndex((w) => rt(w) === rt(u));
        if (h < 0) return u;
        const y = s.splice(h, 1)[0];
        return typeof y == "object" && Vt(y) ? { ...y, ...typeof u == "object" ? u : {} } : u;
      });
      for (const [u, _] of (l.item.controls ?? []).entries())
        eo(_) && c?.splice(Math.min(u, c.length), 0, _);
      return { ...a, ...c ? { controls: c } : {} };
    }) } : {}
  };
}
const Eo = class Eo extends $e {
  constructor() {
    super(...arguments), this.loading = !1, this.conditionsLoading = !1, this.controlKeys = /* @__PURE__ */ new Map(), this.nextControlKey = 0;
  }
  configureEditor() {
    if (!this.editor || !this.config) return;
    this.editor.setConfig(mt(this.config, !0));
    const t = this.editor;
    t._config && Object.assign(
      t._config,
      Object.fromEntries(So.map((o) => [o, this.config[o]]))
    );
  }
  setConfig(t) {
    this.config = t, this.editor ? this.configureEditor() : this.load();
  }
  async load() {
    if (!(this.loading || !this.config)) {
      this.loading = !0;
      try {
        await lr(mt(this.config, !0));
        const t = customElements.get("hui-area-card");
        if (!t.getConfigElement) throw new Error("The installed native Area editor is unavailable.");
        const o = await Me(Promise.resolve(t.getConfigElement()), "Native Area editor timed out. Retry.");
        this.installContentEditor(o), this.editor = o, this.configureEditor(), o.hass = this.hass, o.addEventListener("config-changed", (a) => {
          a.stopPropagation();
          const r = a.detail.config;
          this.selected = void 0, this.commit(ls(this.config, r), !1);
        }), this.editor = o, this.error = void 0;
      } catch (t) {
        this.error = String(t instanceof Error ? t.message : t);
      } finally {
        this.loading = !1;
      }
    }
  }
  commit(t, o = !0) {
    this.config = t, o && this.configureEditor(), _e(this, "config-changed", { config: t });
  }
  controls(t, o) {
    const a = [...this.config.features], r = { ...a[t] };
    o === void 0 ? delete r.controls : r.controls = o, a[t] = r, this.commit({ ...this.config, features: a });
  }
  move(t, o, a) {
    const r = [...this.config.features[t].controls];
    if (o < 0 || o >= r.length || a < 0 || a >= r.length || o === a) return;
    const [n] = r.splice(o, 1);
    r.splice(a, 0, n), this.selected = void 0, this.controls(t, r);
  }
  editControl() {
    if (!this.selected) return;
    let t = this.config?.features?.[this.selected.feature]?.controls?.[this.selected.index];
    if (typeof t == "string") return { domain: t };
    for (let o = 0; o < this.selected.depth; o++) t = t?.control;
    return t;
  }
  changeControl(t) {
    if (!this.selected) return;
    const o = [...this.config.features[this.selected.feature].controls], a = (r, n) => n ? { ...r, control: a(r.control ?? {}, n - 1) } : t;
    o[this.selected.index] = a(o[this.selected.index], this.selected.depth), this.controls(this.selected.feature, o);
  }
  newControl(t) {
    return t === "conditional" ? { type: t, conditions: [], control: { type: "entity", entity_id: "", content_info: "name" } } : t === "template" ? { type: t, content: "", icon: "mdi:gesture-tap-button", tap_action: { action: "none" } } : t === "action" ? { type: t, icon: "mdi:gesture-tap-button", tap_action: { action: "none" } } : { type: "entity", entity_id: "", content_info: "name" };
  }
  async ensureConditions() {
    if (!(customElements.get("hui-conditions-editor") || this.conditionsLoading)) {
      this.conditionsLoading = !0;
      try {
        const t = window.loadCardHelpers;
        if (!t) throw new Error("Home Assistant card helpers are unavailable.");
        const a = (await Me(t().then((r) => r.createCardElement({
          type: "conditional",
          conditions: [],
          card: { type: "markdown", content: "" }
        })), "Native condition editor timed out.")).constructor;
        if (!a.getConfigElement) throw new Error("Native condition editor is unavailable.");
        if (await Me(Promise.resolve(a.getConfigElement()), "Native condition editor timed out."), !customElements.get("hui-conditions-editor")) throw new Error("This frontend does not provide the native conditions editor.");
        this.conditionsError = void 0;
      } catch (t) {
        this.conditionsError = String(t);
      } finally {
        this.conditionsLoading = !1, this.requestUpdate();
      }
    }
  }
  detail() {
    const t = this.editControl();
    if (!t) return p;
    if (t.domain) return d`<section class="detail" aria-label="Edit native domain group">
      <button @click=${() => {
      this.selected = void 0;
    }}>← Back to buttons</button>
      <h4>Native ${t.domain} group</h4>
      <p>Group membership, icon and actions stay native. Add an entity button for a custom icon, name or action.</p>
      <ha-form .hass=${this.hass} .data=${t} .schema=${[{ name: "icon_color", selector: { ui_color: {} } }]}
        .computeLabel=${() => "Icon color"}
        @value-changed=${(n) => {
      n.stopPropagation(), this.changeControl({ ...t, ...n.detail.value });
    }}></ha-form></section>`;
    const o = t.type ?? "entity", a = [
      { name: "entity_id", ...o === "entity" ? { required: !0 } : {}, selector: { entity: {} } },
      { name: "name", selector: { text: {} } },
      { name: "icon", selector: o === "template" ? { text: {} } : { icon: {} } },
      { name: "icon_color", selector: o === "template" ? { text: {} } : { ui_color: {} } },
      { name: "content_info", selector: { select: {
        mode: "dropdown",
        options: [
          { value: "none", label: "Icon only (no text)" },
          { value: "name", label: "Entity or custom name" },
          { value: "state", label: "Current entity value" },
          { value: "last-changed", label: "Time since state changed" },
          { value: "last-updated", label: "Time since last update" },
          { value: "attribute", label: "One of the entity's attributes" },
          { value: "custom", label: "Your own text" }
        ]
      } } },
      ...t.content_info === "attribute" ? [{ name: "attribute", selector: { select: {
        mode: "dropdown",
        custom_value: !0,
        options: Object.keys(this.hass?.states[t.entity_id ?? ""]?.attributes ?? {}).map((n) => ({ value: n, label: n.replaceAll("_", " ") }))
      } } }] : [],
      ...o === "template" || t.content_info === "custom" ? [{ name: "content", selector: { text: { multiline: o === "template" } } }] : [],
      { name: "use_entity_picture", selector: { boolean: {} } },
      ...["tap_action", "hold_action", "double_tap_action"].map((n) => ({ name: n, selector: { ui_action: {} } }))
    ], r = {
      entity_id: "Entity (any domain)",
      name: "Name (below the icon)",
      icon: "Icon (empty = entity default)",
      icon_color: "Icon color",
      content_info: "Text below the icon",
      attribute: "Choose an entity attribute to display",
      content: o === "template" ? "Content template" : "Text to display below the icon",
      use_entity_picture: "Use entity picture",
      tap_action: "Tap behavior",
      hold_action: "Hold behavior",
      double_tap_action: "Double-tap behavior"
    };
    return d`<section class="detail" aria-label=${`Edit ${o} button`}>
      <button @click=${() => {
      this.selected.depth ? this.selected = { ...this.selected, depth: this.selected.depth - 1 } : this.selected = void 0;
    }}>← Back to ${this.selected.depth ? "conditional button" : "buttons"}</button>
      <h4>${o === "conditional" ? "Conditional" : o === "template" ? "Template" : o === "action" ? "Action" : "Entity"} button</h4>
      ${o === "conditional" ? d`
        ${this.conditionsError ? d`<ha-alert alert-type="error">${this.conditionsError}<button @click=${() => {
      this.ensureConditions();
    }}>Retry</button></ha-alert>` : p}
        <hui-conditions-editor .hass=${this.hass} .conditions=${t.conditions ?? []}
          @value-changed=${(n) => {
      n.stopPropagation(), this.changeControl({ ...t, conditions: n.detail.value });
    }}></hui-conditions-editor>
        <p>Conditions use Home Assistant's native conditional card, including nested conditions.</p>
        <button @click=${() => {
      this.selected = { ...this.selected, depth: this.selected.depth + 1 };
    }}>Edit nested ${t.control?.type ?? "entity"} button</button>
        <label>Nested button type <select aria-label="Nested button type" .value=${t.control?.type ?? "entity"}
          @change=${(n) => {
      const i = n.target.value;
      this.changeControl({ ...t, control: this.newControl(i) });
    }}>${["entity", "action", "template", "conditional"].map((n) => d`<option value=${n}>${n}</option>`)}</select></label>
      ` : d`
        ${o === "template" ? d`<p>Content, name, icon and icon color accept Home Assistant Jinja templates.
          Templates run in Home Assistant, not in the browser. Errors are shown on the button preview.</p>` : p}
        <ha-form .hass=${this.hass} .data=${{
      ...t,
      content_info: t.content_info ?? (t.name ? "name" : t.content ? "custom" : "none"),
      tap_action: t.tap_action ?? (t.entity_id ? to(t.entity_id) : { action: "none" }),
      hold_action: t.hold_action ?? { action: "none" },
      double_tap_action: t.double_tap_action ?? { action: "none" }
    }} .schema=${a} .computeLabel=${(n) => r[n.name] ?? n.name}
          .computeHelper=${(n) => n.name === "attribute" ? "Displays the selected entity property, for example brightness or battery_level. Only used when attribute content is selected." : n.name === "content" && o !== "template" ? "Displays exactly what you type, for example Desk lights. Select Your own text above." : void 0}
          @value-changed=${(n) => {
      n.stopPropagation();
      const i = { ...t, ...n.detail.value };
      !t.entity_id && i.entity_id && !t.tap_action && (i.tap_action = to(i.entity_id)), this.changeControl(i);
    }}></ha-form>`}
    </section>`;
  }
  updated() {
    this.editor && (this.editor.hass = this.hass);
  }
  installContentEditor(t) {
    if (!t._schema) throw new Error("This Home Assistant frontend cannot extend the Area editor Content schema.");
    const o = {
      alert_color: "Alert icon color",
      sensor_wrap: "Wrap sensor values onto additional lines",
      sensor_icons: "Show small grey entity icons beside sensor values",
      use_light_color: "Use the light color as the room accent"
    }, a = {
      alert_color: "Changes the colored alert circles, including the compact alert badge. Clear to use Home Assistant's default.",
      sensor_wrap: "Keeps all selected sensor classes visible instead of truncating a long row.",
      sensor_icons: "Uses each sensor entity's default icon. Values and aggregation remain controlled by Home Assistant.",
      use_light_color: "Automatically uses an active RGB light in this card's area. No light selection is needed; excluded lights are ignored."
    }, r = t._schema.bind(t), n = /* @__PURE__ */ new WeakMap();
    t._schema = (...s) => {
      const c = r(...s);
      let u = n.get(c);
      return u || (u = c.map((_) => _.name !== "content" ? _ : { ..._, schema: [
        ..._.schema ?? [],
        { name: "alert_color", selector: { ui_color: {} } },
        { name: "sensor_wrap", selector: { boolean: {} } },
        { name: "sensor_icons", selector: { boolean: {} } },
        { name: "use_light_color", selector: { boolean: {} } }
      ] }), n.set(c, u)), u;
    };
    const i = t._computeLabelCallback?.bind(t), l = t._computeHelperCallback?.bind(t);
    t._computeLabelCallback = (s) => o[s.name] ?? i?.(s) ?? s.name, t._computeHelperCallback = (s) => a[s.name] ?? l?.(s);
  }
  render() {
    return this.config ? d`${this.error ? d`<ha-alert alert-type="error">${this.error}<button @click=${() => {
      this.load();
    }}>Retry</button></ha-alert>` : this.editor ?? d`Loading native Area editor…`}
      <h3>Advanced area controls</h3>
      <p>Use the native editor above for area, appearance, features and standard domain groups.
        Edit advanced buttons below. Action, template and conditional buttons are intentionally hidden
        from native control lists. Names and content appear below icons, aligned to the button bottom.
        Empty controls show no controls; automatic controls retain Home Assistant defaults.</p>
      ${this.selected ? this.detail() : p}
      ${(this.config.features ?? []).map((t, o) => t.type !== "area-controls" ? p : d`
        <fieldset><legend>Area controls feature ${o + 1}</legend>
          ${t.controls === void 0 ? d`<p>Automatic native domain controls</p>` : p}
          <ha-sortable handle-selector=".handle" @item-moved=${(a) => {
      a.stopPropagation(), this.move(o, a.detail.oldIndex, a.detail.newIndex);
    }}><div class="controls">
          ${os(t.controls ?? [], (a, r) => typeof a == "string" ? `native:${a}:${r}` : (this.controlKeys.has(a) || this.controlKeys.set(a, String(++this.nextControlKey)), this.controlKeys.get(a)), (a, r) => {
      const n = typeof a == "string" ? a : a.domain, i = typeof a == "string" ? {} : a, l = n ? `Native ${n} group` : (i.type ?? "entity").replace(/^./, (c) => c.toUpperCase()), s = i.name ?? this.hass?.states[i.entity_id ?? ""]?.attributes.friendly_name ?? i.entity_id ?? (i.type === "conditional" ? `${i.control?.type ?? "entity"} button` : i.content ?? "");
      return d`<div class="control" role="listitem" data-feature=${o} data-index=${r}>
              <div class="handle drag" role="button" tabindex="0" aria-label="Drag to reorder; Alt plus arrow keys to move"
                title="Drag up or down to reorder. Keyboard: Alt + Up or Down."
                @keydown=${(c) => {
        c.altKey && ["ArrowUp", "ArrowDown"].includes(c.key) && (c.preventDefault(), this.move(o, r, r + (c.key === "ArrowUp" ? -1 : 1)));
      }}><ha-svg-icon .path=${rs}></ha-svg-icon></div>
              <div class="row-label"><strong>${l}</strong><span>${s}</span></div>
              <ha-icon-button class="edit-icon" aria-label="Edit button" .label=${"Edit button"} .path=${ns} @click=${() => {
        this.selected = { feature: o, index: r, depth: 0 }, i.type === "conditional" && this.ensureConditions();
      }}></ha-icon-button>
              <ha-icon-button class="remove-icon" aria-label="Remove control" .label=${"Remove control"} .path=${as} @click=${() => {
        this.selected = void 0, this.controls(o, t.controls.filter((c, u) => u !== r));
      }}></ha-icon-button>
            </div>`;
    })}</div></ha-sortable>
          <label>${t.controls === void 0 ? "Replace automatic controls" : "Add button"}
            <select aria-label="Add button type" .value=${""} @change=${(a) => {
      const r = a.target, n = this.newControl(r.value), i = [...t.controls ?? [], n];
      this.controls(o, i), this.selected = { feature: o, index: i.length - 1, depth: 0 }, r.value = "", n.type === "conditional" && this.ensureConditions();
    }}>
              <option value="" disabled selected>Add button…</option>
              ${["entity", "action", "conditional", "template"].map((a) => d`<option value=${a}>${a.replace(/^./, (r) => r.toUpperCase())}</option>`)}
            </select>
          </label>
          <button @click=${() => {
      this.selected = void 0, this.controls(o, void 0);
    }}>Use automatic native controls</button>
          <button @click=${() => {
      this.selected = void 0, this.controls(o, []);
    }}>Clear controls</button>
        </fieldset>`)}` : p;
  }
};
Eo.styles = Be`fieldset { border: 1px solid var(--divider-color); margin: 16px 0; border-radius: 12px; }
    .control { display: flex; align-items: center; min-height: 60px; }
    .row-label { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .row-label span { color: var(--secondary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .handle { cursor: grab; padding-inline-end:8px; touch-action:none; }
    .handle > * { pointer-events:none; }
    .edit-icon, .remove-icon { --ha-icon-button-size:36px; color:var(--secondary-text-color); }
    .detail { border: 1px solid var(--divider-color); border-radius: 12px; padding: 16px; }
    button, select { color: var(--primary-text-color); background: var(--secondary-background-color);
      border: 1px solid var(--divider-color); border-radius: 8px; padding: 8px; margin: 8px 0; }
    button { cursor: pointer; } button:disabled { opacity: .4; }
    button:focus-visible, select:focus-visible, .drag:focus-visible { outline: 2px solid var(--primary-color); }
    @media (max-width: 420px) { .control { gap: 4px; } .control button { padding: 6px; } }`;
let Ce = Eo;
se([
  he({ attribute: !1 })
], Ce.prototype, "hass");
se([
  re()
], Ce.prototype, "config");
se([
  re()
], Ce.prototype, "editor");
se([
  re()
], Ce.prototype, "error");
se([
  re()
], Ce.prototype, "selected");
se([
  re()
], Ce.prototype, "conditionsError");
customElements.get(bt) || customElements.define(bt, xe);
customElements.get(`${yt}-editor`) || customElements.define(`${yt}-editor`, Ce);
const cs = (e, t, o = [], a = []) => {
  const r = [...o, ...a, ...Object.keys(t?.states ?? {})], n = [...new Set(r)].filter((l) => t?.states?.[l] !== void 0), i = n.filter((l) => !["unavailable", "unknown"].includes(t?.states?.[l]?.state.toLowerCase() ?? ""));
  for (const l of e.preferredDomains ?? []) {
    const s = i.find((c) => c.startsWith(`${l}.`)) ?? n.find((c) => c.startsWith(`${l}.`));
    if (s) return s;
  }
  return i[0] ?? n[0];
}, ds = (e) => e.name.replace(/ (Card|Chip)$/, ""), cr = (e, t, o = [], a = []) => {
  const r = [.../* @__PURE__ */ new Set([...o, ...a, ...Object.keys(t?.states ?? {})])].filter((k) => t?.states?.[k] !== void 0), n = (k) => {
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
  ], l = (k) => !["unavailable", "unknown"].includes(t?.states[k]?.state.toLowerCase() ?? ""), s = (k, V) => i(r.filter((ee) => k.some((B) => ee.startsWith(`${B}.`)) && V.every((B) => n(ee).includes(B))))[0], c = (k, V, ee) => i(r.filter((B) => k.some((Y) => B.startsWith(`${Y}.`)) && V.every((Y) => n(B).includes(Y)) && ee.every((Y) => !n(B).includes(Y))))[0], u = (k, V, ee = []) => r.find((B) => l(B) && k.some((Y) => B.startsWith(`${Y}.`)) && V.every((Y) => n(B).split(/[^a-z0-9]+/).includes(Y)) && ee.every((Y) => !n(B).includes(Y))), _ = (k, V = [], ee = []) => i(r.filter((B) => {
    const Y = t?.states[B], le = n(B);
    return B.startsWith("sensor.") && k.includes(String(Y?.attributes.device_class ?? "")) && V.every((ne) => le.includes(ne)) && ee.every((ne) => !le.includes(ne));
  }))[0], m = r.filter((k) => /^sensor\.inverter_4/i.test(k)).sort((k, V) => k.localeCompare(V, void 0, { numeric: !0 })), h = (k, V = [], ee = []) => r.find((B) => {
    const Y = t?.states[B], le = n(B);
    return l(B) && B.startsWith("sensor.") && k.includes(String(Y?.attributes.device_class ?? "")) && V.every((ne) => le.includes(ne)) && ee.every((ne) => !le.includes(ne));
  }), y = r.filter((k) => k.startsWith("media_player.") && n(k).includes("sonos")).sort((k, V) => Yo(t, V) - Yo(t, k))[0], w = e.upstreamId === "advanced_home_energy_management" ? s(["sensor"], ["hems", "house", "consumption"]) ?? s(["sensor"], ["house", "consumption"]) ?? _(["power"]) : e.upstreamId === "advanced_energy_buy_sell" ? s(["sensor"], ["hems", "price", "overview"]) ?? s(["sensor"], ["price", "overview"]) ?? s(["sensor"], ["hems", "price"]) : e.upstreamId === "advanced_energy_panel_health" ? m[0] : e.upstreamId === "mini_graph_card" ? _(["temperature"]) ?? _(["power", "energy"]) ?? s(["sensor"], []) : e.upstreamId === "card_battery" ? c(["sensor"], ["battery", "level"], ["state", "charging"]) ?? _(["battery"], [], ["state", "charging"]) : e.upstreamId === "custom_card_pollen" ? s(["sensor"], ["pollen", "grass"]) : e.upstreamId === "custom_card_speedtest_gauges" ? s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) : e.upstreamId === "custom_card_tablet" ? s(["binary_sensor", "sensor", "switch"], ["tablet"]) : e.upstreamId === "custom_card_nas_metrics" ? s(["switch", "binary_sensor"], ["nas"]) ?? s(["switch", "binary_sensor"], ["status"]) : e.upstreamId === "custom_card_washer" ? s(["sensor"], ["operation", "state"]) ?? s(["sensor"], ["washer", "state"]) : e.upstreamId === "custom_card_sun" ? s(["sun"], []) : e.upstreamId === "custom_card_media_player_sonos" ? y : e.upstreamId === "custom_card_printer" ? s(["sensor", "binary_sensor"], ["printer"]) ?? s(["sensor", "binary_sensor"], ["online"]) : e.upstreamId === "card_room" ? s(["light"], []) : e.upstreamId === "custom_card_plant" ? s(["plant"], []) ?? s(["sensor"], ["soil", "humidity"]) : e.upstreamId === "custom_card_playstation" ? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["xbox"]) ?? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["playstation"]) ?? s(["binary_sensor", "media_player", "remote", "sensor", "switch"], ["nintendo"]) ?? s(["media_player", "remote"], []) : void 0, v = (e.upstreamId === "card_scenes" ? u(["light"], ["office", "joris"]) ?? u(["light"], []) ?? u(["climate"], []) ?? u(["sensor"], []) : void 0) ?? w ?? cs(e, t, o, a), $ = e.upstreamId === "custom_card_entity_carousel" ? Sn(t, v) : void 0, b = $ ? $.entity : v, M = e.upstreamId === "advanced_energy_panel_health" ? m : void 0, L = e.upstreamId === "custom_card_plant" ? {
    moisture_entity: (b && t?.states[b]?.attributes.device_class === "moisture" ? b : void 0) ?? h(["moisture"], ["soil"]) ?? h(["moisture"]),
    temperature_entity: h(["temperature"], ["soil"]) ?? h(["temperature"], ["plant"]),
    humidity_entity: h(["humidity"], ["plant"]) ?? h(["humidity"], ["soil"]),
    conductivity_entity: h(["conductivity"], ["plant"]) ?? u(["sensor"], ["conductivity"]),
    illuminance_entity: h(["illuminance"], ["plant"]) ?? u(["sensor"], ["plant", "illuminance"]),
    dli_entity: u(["sensor"], ["dli"])
  } : {}, j = Object.entries(L).filter(([, k]) => k).map(([k]) => k.replace(/_entity$/, "")), R = ["text", "navigation"].includes(e.family), Z = e.variants?.[0], C = b?.split(".", 1)[0], P = ["light", "switch", "input_boolean", "fan"].includes(C ?? "") ? { action: "toggle" } : { action: b ? "more-info" : "none" }, q = Da(t, b), F = e.upstreamId === "custom_card_sun" || e.upstreamId === "custom_card_pollen" || e.upstreamId === "card_welcome_scenes" ? { action: "none" } : e.upstreamId === "custom_card_speedtest_gauges" ? {
    action: "perform-action",
    perform_action: "homeassistant.update_entity",
    target: {
      entity_id: [
        s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) ?? b,
        s(["sensor"], ["speedtest", "upload"]) ?? s(["sensor"], ["upload"]),
        s(["sensor"], ["speedtest", "ping"]) ?? s(["sensor"], ["ping"])
      ].filter((k) => !!k)
    }
  } : e.upstreamId === "custom_card_playstation" ? { action: b ? "more-info" : "none", entity: b } : e.upstreamId === "advanced_home_energy_management" ? { action: "navigate", navigation_path: "/hems-tower/savings-overview" } : e.upstreamId === "custom_card_plant" ? { action: "more-info" } : P;
  return {
    ...Wa(e, t, b),
    name: [
      "advanced_home_energy_management",
      "advanced_energy_buy_sell",
      "advanced_energy_panel_health",
      "custom_card_media_player_sonos"
    ].includes(e.upstreamId) ? void 0 : b ? t?.states[b]?.attributes.friendly_name : ds(e),
    secondary: b ? void 0 : R ? "Example" : "Preview",
    variant: Z,
    tap_action: F,
    show_controls: ["climate", "vacuum", "control", "media"].includes(e.family) ? !0 : void 0,
    show_forecast: e.family === "weather",
    show_graph: ["battery", "energy", "sensor"].includes(e.family),
    entities: e.upstreamId === "mini_graph_card" && b ? [b] : e.variants?.includes("with-sensors") ? a.slice(0, 2) : void 0,
    panel_entities: M?.length ? M : void 0,
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
      program_stage_entity: s(["sensor", "select"], ["wasmachine", "program"]) ?? s(["sensor", "select"], ["washer", "program"]) ?? s(["sensor", "select"], ["washer", "job"]) ?? b,
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
      download_entity: s(["sensor"], ["speedtest", "download"]) ?? s(["sensor"], ["download"]) ?? b,
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
    ...e.upstreamId === "custom_card_welcome" ? {
      ulm_card_welcome_collapse: s(["input_boolean"], ["welcome"]),
      ulm_weather: s(["weather"], [])
    } : {},
    ...e.upstreamId === "custom_card_pollen" ? {
      trees_entity: s(["sensor"], ["pollen", "trees"]) ?? s(["sensor"], ["tree", "pollen"]),
      grass_entity: s(["sensor"], ["pollen", "grass"]) ?? s(["sensor"], ["grass", "pollen"]) ?? b,
      weeds_entity: s(["sensor"], ["pollen", "weeds"]) ?? s(["sensor"], ["weed", "pollen"])
    } : {},
    ...e.upstreamId === "custom_card_plant" ? {
      entity: b,
      ulm_card_flower_entity: b,
      ulm_card_flower_name: b ? t?.states[b]?.attributes.friendly_name : "No name set",
      ulm_card_flower_show_bars: j.length ? j : ["moisture"],
      ...L
    } : {},
    ...e.upstreamId === "card_room" ? {
      room_sensors: [
        s(["sensor"], ["illuminance"]),
        s(["sensor"], ["temperature"])
      ].filter((k) => !!k).map((k) => dt(t, k)),
      room_status: [],
      room_secondary_parts: [],
      room_temperature_entity: s(["sensor"], ["temperature"]),
      ulm_card_dynamic_color: !1,
      room_light_entity: b?.startsWith("light.") ? b : s(["light"], ["room"]) ?? s(["light"], [])
    } : {},
    ...e.upstreamId === "card_scenes" ? {
      scene_items: r.filter((k) => k.startsWith("scene.")).slice(0, 7).map((k) => lt(t, k))
    } : {},
    ...e.upstreamId === "card_welcome_scenes" ? {
      name: void 0,
      secondary: "Scenes",
      collapse_entity: s(["input_boolean"], ["collapse"]) ?? s(["input_boolean"], ["dropdown"]) ?? s(["input_boolean"], []),
      scene_items: r.filter((k) => k.startsWith("scene.")).slice(0, 5).map((k) => lt(t, k))
    } : {},
    ...e.upstreamId === "custom_card_media_player_sonos" ? {
      use_media_info: !0,
      volume_controls: ["volume_mute", "volume_set", "volume_buttons"],
      ulm_card_media_player_power_button: !0,
      media_controls: ["shuffle", "previous", "play_pause_stop", "next", "repeat"],
      collapsible_controls: !0
    } : {},
    ...e.upstreamId === "custom_card_printer" ? {
      black_entity: s(["sensor"], ["black"]),
      yellow_entity: s(["sensor"], ["yellow"]),
      magenta_entity: s(["sensor"], ["magenta"]),
      cyan_entity: s(["sensor"], ["cyan"])
    } : {},
    ...e.upstreamId === "custom_card_playstation" ? {
      console_platform: q === "generic" ? "auto" : q,
      console_show_artwork: !0,
      console_show_controls: !0,
      ...ho(t, b)
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
      name: $?.name,
      carousel_items: $?.items ?? []
    } : {}
  };
}, us = "0.0.1";
for (const e of Nt)
  if (!customElements.get(e.tag)) {
    if (e.upstreamId === "area_card_advanced") {
      customElements.define(e.tag, Te);
      continue;
    }
    if (e.upstreamId === "mini_graph_card") {
      customElements.define(e.tag, ze);
      continue;
    }
    const t = e;
    class o extends Fe {
      constructor() {
        super(...arguments), this.descriptor = t;
      }
      static getStubConfig(r, n = [], i = []) {
        return cr(t, r, n, i);
      }
    }
    customElements.define(e.tag, o);
  }
for (const e of lo) {
  if (customElements.get(e.tag)) continue;
  const t = Dt.find((n) => n.upstreamId === e.targetId);
  if (!t) throw new Error(`Missing alias target ${e.targetId}.`);
  const o = t, a = e.variant;
  class r extends Fe {
    constructor() {
      super(...arguments), this.descriptor = o;
    }
    static getStubConfig(i, l = [], s = []) {
      const c = cr(o, i, l, s);
      return a === "divider-title" ? {
        ...c,
        type: `custom:${e.tag}`,
        entity: void 0,
        variant: a,
        name: "Title",
        navigation_path: "",
        tap_action: { action: "none" }
      } : a === "divider-subtitle" ? {
        ...c,
        type: `custom:${e.tag}`,
        entity: void 0,
        variant: a,
        name: "Subtitle",
        tap_action: { action: "none" }
      } : {
        ...c,
        type: `custom:${e.tag}`,
        variant: a,
        show_forecast: e.tag === "mushroom-addition-card-weather-ulm" ? !1 : c.show_forecast
      };
    }
    setConfig(i) {
      super.setConfig({ ...i, variant: i.variant ?? a });
    }
  }
  customElements.define(e.tag, r);
}
window.customCards = window.customCards || [];
const ms = new Set(window.customCards.map((e) => e.type));
for (const e of Nt)
  ms.has(e.tag) || window.customCards.push({
    type: e.tag,
    name: e.upstreamId === "area_card_advanced" ? "Mushroom Addition - Area card advanced" : `Mushroom Addition: ${e.name}`,
    description: e.description,
    preview: !0,
    documentationURL: "https://github.com/snfx-johaver/mushroom-cards-addition"
  });
console.info(
  `%c MUSHROOM-CARDS-ADDITION %c ${us} · ${Nt.length} components `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;"
);
export {
  Nt as CATALOG
};
//# sourceMappingURL=mushroom-cards-addition.js.map
