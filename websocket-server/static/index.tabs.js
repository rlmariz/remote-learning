// explosion animation adapted from https://codepen.io/nicksheffield

var close = document.getElementsByClassName('closeTab');
var tabs = document.getElementsByClassName('tab');
var anchors = document.querySelectorAll('a');
var getExplosionColor = function () {
    //var _color = 'rgb(' + [r(0,255), r(0,255), r(0,255)].join(',') + ')'; // multi color
    var _color = '#bbbbbb'; // dust
    return _color;
};

Array.prototype.forEach.call(close, function (close) {
    close.addEventListener('click', explode)
});

Array.prototype.forEach.call(tabs, function (tab) {
    tab.style.width = tab.offsetWidth + 'px';
});

Array.prototype.forEach.call(anchors, function (anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        return false;
    })
})

function getOffset(el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

function explode(e) {
    var targetTab = e.currentTarget.parentElement;
    var tabOffsets = getOffset(targetTab);
    var x = tabOffsets.left;
    var y = tabOffsets.top + 10;
    var c = document.createElement('canvas');
    var ctx = c.getContext('2d');
    var ratio = window.devicePixelRatio;
    var particles = [];

    targetTab.classList.add("tabClosed");

    window.setTimeout(function () {
        document.body.appendChild(c)

        /*c.style.position = 'absolute'
        c.style.left = (x - 100) + 'px'
        c.style.top = (y - 100) + 'px'
        c.style.pointerEvents = 'none'
        c.style.width = 200 + 'px'
        c.style.height = 200 + 'px'
        c.width = 200 * ratio
        c.height = 200 * ratio*/


        c.style.position = 'absolute'
        c.style.left = (x - 40) + 'px'
        c.style.top = (y - 150) + 'px'
        c.style.pointerEvents = 'none'
        c.style.width = 80 + 'px'
        c.style.height = 300 + 'px'
        c.width = 80 * ratio
        c.height = 300 * ratio

        function Particle() {
            return {
                x: c.width / 2,
                y: c.height / 2,
                radius: r(20, 30),
                color: getExplosionColor(),
                rotation: r(0, 360, true),
                speed: r(8, 12),
                friction: 0.9,
                opacity: r(0, 0.5, true),
                yVel: 0,
                gravity: 0.1
            }
        }

        for (var i = 0; ++i < 25;) {
            particles.push(Particle())
        }

        function render() {
            ctx.clearRect(0, 0, c.width, c.height)

            particles.forEach(function (p, i) {

                angleTools.moveOnAngle(p, p.speed)

                p.opacity -= 0.01
                p.speed *= p.friction
                p.radius *= p.friction

                p.yVel += p.gravity
                p.y += p.yVel

                if (p.opacity < 0) return
                if (p.radius < 0) return

                ctx.beginPath()
                ctx.globalAlpha = p.opacity
                ctx.fillStyle = p.color
                ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false)
                ctx.fill()
            })
        }

        ; (function renderLoop() {
            requestAnimationFrame(renderLoop)
            render()
        })();

        setTimeout(function () {
            document.body.removeChild(c)
        }, 3000);
    }, 150);
}

var angleTools = { getAngle: function (t, n) { var a = n.x - t.x, e = n.y - t.y; return Math.atan2(e, a) / Math.PI * 180 }, getDistance: function (t, n) { var a = t.x - n.x, e = t.y - n.y; return Math.sqrt(a * a + e * e) }, moveOnAngle: function (t, n) { var a = this.getOneFrameDistance(t, n); t.x += a.x, t.y += a.y }, getOneFrameDistance: function (t, n) { return { x: n * Math.cos(t.rotation * Math.PI / 180), y: n * Math.sin(t.rotation * Math.PI / 180) } } };
function r(a, b, c) { return parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0)); }