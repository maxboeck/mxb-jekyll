/*!
 * SVG 4 Everybody
 */
!(function(a, b) {
    'function' == typeof define && define.amd
        ? define([], function() {
              return (a.svg4everybody = b())
          })
        : 'object' == typeof module && module.exports
            ? (module.exports = b())
            : (a.svg4everybody = b())
})(this, function() {
    function a(a, b, c) {
        if (c) {
            var d = document.createDocumentFragment(),
                e = !b.hasAttribute('viewBox') && c.getAttribute('viewBox')
            e && b.setAttribute('viewBox', e)
            for (var f = c.cloneNode(!0); f.childNodes.length; )
                d.appendChild(f.firstChild)
            a.appendChild(d)
        }
    }
    function b(b) {
        ;(b.onreadystatechange = function() {
            if (4 === b.readyState) {
                var c = b._cachedDocument
                c ||
                    ((c = b._cachedDocument = document.implementation.createHTMLDocument(
                        ''
                    )),
                    (c.body.innerHTML = b.responseText),
                    (b._cachedTarget = {})),
                    b._embeds.splice(0).map(function(d) {
                        var e = b._cachedTarget[d.id]
                        e ||
                            (e = b._cachedTarget[d.id] = c.getElementById(
                                d.id
                            )),
                            a(d.parent, d.svg, e)
                    })
            }
        }),
            b.onreadystatechange()
    }
    function c(c) {
        function e() {
            for (var c = 0; c < m.length; ) {
                var h = m[c],
                    i = h.parentNode,
                    j = d(i)
                if (j) {
                    var n =
                        h.getAttribute('xlink:href') || h.getAttribute('href')
                    if (f && (!g.validate || g.validate(n, j, h))) {
                        i.removeChild(h)
                        var o = n.split('#'),
                            p = o.shift(),
                            q = o.join('#')
                        if (p.length) {
                            var r = k[p]
                            r ||
                                ((r = k[p] = new XMLHttpRequest()),
                                r.open('GET', p),
                                r.send(),
                                (r._embeds = [])),
                                r._embeds.push({ parent: i, svg: j, id: q }),
                                b(r)
                        } else a(i, document.getElementById(q))
                    }
                } else ++c
            }
            l(e, 67)
        }
        var f,
            g = Object(c),
            h = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/,
            i = /\bAppleWebKit\/(\d+)\b/,
            j = /\bEdge\/12\.(\d+)\b/
        f =
            'polyfill' in g
                ? g.polyfill
                : h.test(navigator.userAgent) ||
                  (navigator.userAgent.match(j) || [])[1] < 10547 ||
                  (navigator.userAgent.match(i) || [])[1] < 537
        var k = {},
            l = window.requestAnimationFrame || setTimeout,
            m = document.getElementsByTagName('use')
        f && e()
    }
    function d(a) {
        for (
            var b = a;
            'svg' !== b.nodeName.toLowerCase() && (b = b.parentNode);

        );
        return b
    }
    return c
})
svg4everybody()
