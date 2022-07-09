
function ssc_init() {
  if (!document.body) return;
  var d = document.body;
  var t = document.documentElement;
  var n = window.innerHeight;
  var r = d.scrollHeight;
  ssc_root = document.compatMode.indexOf("CSS") >= 0 ? t : d;
  ssc_activeElement = d;
  ssc_initdone = true;
  if (top != self) {
    ssc_frame = true
  } else if (r > n && (d.offsetHeight <= n || t.offsetHeight <= n)) {
    ssc_root.style.height = "auto";
    if (ssc_root.offsetHeight <= n) {
      var i = document.createElement("div");
      i.style.clear = "both";
      d.appendChild(i)
    }
  }
  if (!ssc_fixedback) {
    d.style.backgroundAttachment = "scroll";
    t.style.backgroundAttachment = "scroll";
  }
  if (ssc_keyboardsupport) {
    ssc_addEvent("keydown", ssc_keydown)
  }
}

function ssc_scrollArray(d, t, n, r) {
  r || (r = 1e3);
  ssc_directionCheck(t, n);
  ssc_que.push({
    x: t,
    y: n,
    lastX: t < 0 ? .99 : -.99,
    lastY: n < 0 ? .99 : -.99,
    start: +(new Date)
  });
  if (ssc_pending) {
    return
  }
  var i = function () {
    var s = +(new Date);
    var o = 0;
    var u = 0;
    for (var a = 0; a < ssc_que.length; a++) {
      var f = ssc_que[a];
      var l = s - f.start;
      var c = l >= ssc_animtime;
      var h = c ? 1 : l / ssc_animtime;
      if (ssc_pulseAlgorithm) {
        h = ssc_pulse(h)
      }
      var p = f.x * h - f.lastX >> 0;
      var d = f.y * h - f.lastY >> 0;
      o += p;
      u += d;
      f.lastX += p;
      f.lastY += d;
      if (c) {
        ssc_que.splice(a, 1);
        a--
      }
    }
    if (t) {
      var v = d.scrollLeft;
      d.scrollLeft += o;
      if (o && d.scrollLeft === v) {
        t = 0
      }
    }
    if (n) {
      var m = d.scrollTop;
      d.scrollTop += u;
      if (u && d.scrollTop === m) {
        n = 0
      }
    }
    if (!t && !n) {
      ssc_que = []
    }
    if (ssc_que.length) {
      setTimeout(i, r / ssc_framerate + 1)
    } else {
      ssc_pending = false
    }
  };
  setTimeout(i, 0);
  ssc_pending = true
}

function ssc_wheel(d) {
  if (!ssc_initdone) {
    ssc_init()
  }
  var t = d.target;
  var n = ssc_overflowingAncestor(t);
  if (!n || d.defaultPrevented || ssc_isNodeName(ssc_activeElement, "embed") || ssc_isNodeName(t, "embed") && /\.pdf/i.test(t.src)) {
    return true
  }
  var r = d.wheelDeltaX || 0;
  var i = d.wheelDeltaY || 0;
  if (!r && !i) {
    i = d.wheelDelta || 0
  }
  if (Math.abs(r) > 1.2) {
    r *= ssc_stepsize / 120
  }
  if (Math.abs(i) > 1.2) {
    i *= ssc_stepsize / 120
  }
  ssc_scrollArray(n, -r, -i);
  d.preventDefault()
}

function ssc_keydown(d) {
  var t = d.target;
  var n = d.ctrlKey || d.altKey || d.metaKey;
  if (/input|textarea|embed/i.test(t.nodeName) || t.isContentEditable || d.defaultPrevented || n) {
    return true
  }
  if (ssc_isNodeName(t, "button") && d.keyCode === ssc_key.spacebar) {
    return true
  }
  var r, i = 0,
    s = 0;
  var o = ssc_overflowingAncestor(ssc_activeElement);
  var u = o.clientHeight;
  if (o == document.body) {
    u = window.innerHeight
  }
  switch (d.keyCode) {
    case ssc_key.up:
      s = -ssc_arrowscroll;
      break;
    case ssc_key.down:
      s = ssc_arrowscroll;
      break;
    case ssc_key.spacebar:
      r = d.shiftKey ? 1 : -1;
      s = -r * u * .9;
      break;
    case ssc_key.pageup:
      s = -u * .9;
      break;
    case ssc_key.pagedown:
      s = u * .9;
      break;
    case ssc_key.home:
      s = -o.scrollTop;
      break;
    case ssc_key.end:
      var a = o.scrollHeight - o.scrollTop - u;
      s = a > 0 ? a + 10 : 0;
      break;
    case ssc_key.left:
      i = -ssc_arrowscroll;
      break;
    case ssc_key.right:
      i = ssc_arrowscroll;
      break;
    default:
      return true
  }
  ssc_scrollArray(o, i, s);
  d.preventDefault()
}

function ssc_mousedown(d) {
  ssc_activeElement = d.target
}

function ssc_setCache(d, t) {
  for (var n = d.length; n--;) ssc_cache[ssc_uniqueID(d[n])] = t;
  return t
}

function ssc_overflowingAncestor(d) {
  var t = [];
  var n = ssc_root.scrollHeight;
  do {
    var r = ssc_cache[ssc_uniqueID(d)];
    if (r) {
      return ssc_setCache(t, r)
    }
    t.push(d);
    if (n === d.scrollHeight) {
      if (!ssc_frame || ssc_root.clientHeight + 10 < n) {
        return ssc_setCache(t, document.body)
      }
    } else if (d.clientHeight + 10 < d.scrollHeight) {
      overflow = getComputedStyle(d, "").getPropertyValue("overflow");
      if (overflow === "scroll" || overflow === "auto") {
        return ssc_setCache(t, d)
      }
    }
  } while (d = d.parentNode)
}

function ssc_addEvent(d, t, n) {
  window.addEventListener(d, t, n || false)
}

function ssc_removeEvent(d, t, n) {
  window.removeEventListener(d, t, n || false)
}

function ssc_isNodeName(d, t) {
  return d.nodeName.toLowerCase() === t.toLowerCase()
}

function ssc_directionCheck(d, t) {
  d = d > 0 ? 1 : -1;
  t = t > 0 ? 1 : -1;
  if (ssc_direction.x !== d || ssc_direction.y !== t) {
    ssc_direction.x = d;
    ssc_direction.y = t;
    ssc_que = []
  }
}

function ssc_pulse_(d) {
  var t, n, r;
  d = d * ssc_pulseScale;
  if (d < 1) {
    t = d - (1 - Math.exp(-d))
  } else {
    n = Math.exp(-1);
    d -= 1;
    r = 1 - Math.exp(-d);
    t = n + r * (1 - n)
  }
  return t * ssc_pulseNormalize
}

function ssc_pulse(d) {
  if (d >= 1) return 1;
  if (d <= 0) return 0;
  if (ssc_pulseNormalize == 1) {
    ssc_pulseNormalize /= ssc_pulse_(1)
  }
  return ssc_pulse_(d)
}

var ssc_framerate = 150;
var ssc_animtime = 500;
var ssc_stepsize = 150;
var ssc_pulseAlgorithm = true;
var ssc_pulseScale = 6;
var ssc_pulseNormalize = 1;
var ssc_keyboardsupport = true;
var ssc_arrowscroll = 50;
var ssc_frame = false;
var ssc_direction = {
  x: 0,
  y: 0
};

var ssc_initdone = false;
var ssc_fixedback = true;
var ssc_root = document.documentElement;
var ssc_activeElement;
var ssc_key = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  spacebar: 32,
  pageup: 33,
  pagedown: 34,
  end: 35,
  home: 36
};

var ssc_que = [];
var ssc_pending = false;
var ssc_cache = {};

setInterval(function () {
  ssc_cache = {}
}, 10 * 1e3);

var ssc_uniqueID = function () {
  var d = 0;
  return function (t) {
    return t.ssc_uniqueID || (t.ssc_uniqueID = d++)
  }
}();

var ischrome = /chrome/.test(navigator.userAgent.toLowerCase());

if (ischrome) {
  ssc_addEvent("mousedown", ssc_mousedown);
  ssc_addEvent("mousewheel", ssc_wheel);
  ssc_addEvent("load", ssc_init)
}