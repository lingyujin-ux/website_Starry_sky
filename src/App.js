import React, { useEffect, useRef, useState } from "react";
import { Rocket, Telescope, Sparkles, Star, Orbit } from "lucide-react";
import { motion } from "framer-motion";

// Single-file, production-ready React landing page with an animated starfield
// TailwindCSS styling; framer-motion + lucide-react for flair

export default function CosmicOdyssey() {
  const canvasRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let w, h;

    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const stars = [];
    const MAX_STARS = 250; // smooth on most laptops

    function resize() {
      w = canvas.parentElement.clientWidth;
      h = canvas.parentElement.clientHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < MAX_STARS; i++) {
        stars.push({
          x: rand(0, w),
          y: rand(0, h),
          z: rand(0.2, 1.0), // depth
          r: rand(0.3, 1.8),
          vx: rand(-0.05, 0.05),
          vy: rand(-0.05, 0.05),
          tw: rand(0.2, 1),
          t: rand(0, Math.PI * 2),
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // soft nebula gradient
      const grad = ctx.createRadialGradient(
        w * 0.6,
        h * 0.3,
        50,
        w * 0.5,
        h * 0.5,
        Math.max(w, h)
      );
      grad.addColorStop(0, "rgba(147, 51, 234, 0.20)");
      grad.addColorStop(0.4, "rgba(30, 64, 175, 0.18)");
      grad.addColorStop(1, "rgba(2, 6, 23, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        // parallax sway with cursor
        const px = (mouse.x - w / 2) * 0.002 * (1 - s.z);
        const py = (mouse.y - h / 2) * 0.002 * (1 - s.z);

        s.x += s.vx + px;
        s.y += s.vy + py;
        s.t += s.tw * 0.05;

        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;
        if (s.y < -10) s.y = h + 10;
        if (s.y > h + 10) s.y = -10;

        const alpha = 0.6 + Math.sin(s.t) * 0.4;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
        ctx.fillStyle = "#e5e7eb"; // slate-100
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    resize();
    initStars();
    draw();

    window.addEventListener("resize", () => {
      resize();
      initStars();
    });
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 overflow-x-hidden">
      {/* Starfield layer */}
      <div className="fixed inset-0 -z-10">
        <canvas ref={canvasRef} className="h-full w-full" />
        {/* subtle vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/20 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/20">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-semibold tracking-wide group-hover:text-fuchsia-300 transition">
              Cosmic Odyssey
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition">
              特性
            </a>
            <a href="#gallery" className="hover:text-white transition">
              星图
            </a>
            <a href="#timeline" className="hover:text-white transition">
              征途
            </a>
            <a href="#subscribe" className="hover:text-white transition">
              订阅
            </a>
          </nav>
          <a
            href="#explore"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/10"
          >
            <Rocket className="h-4 w-4" /> 立即启程
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        id="explore"
        className="relative mx-auto max-w-7xl px-4 pt-16 pb-28"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-slate-300 border border-white/10">
            <Orbit className="h-4 w-4" />
            穿越星海 · 见所未见
          </div>
          <h1 className="mt-6 text-5xl md:text-7xl font-extrabold leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-indigo-300 via-fuchsia-300 to-rose-300">
              浩瀚无垠
            </span>
            ，与光同航
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-slate-300/90 text-lg">
            从行星到星云，从引力波到量子真空——将宇宙的宏大叙事，化为你指尖的微光旅程。
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 transition shadow-lg shadow-indigo-900/40">
              开始探索
            </a>
            <a className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/10">
              了解更多
            </a>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { k: "已发现系外行星", v: "5,000+" },
              { k: "可观测宇宙星系", v: "2万亿" },
              { k: "光年缩放", v: "10^26 m" },
              { k: "观测窗口", v: "Radio→Gamma" },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/5 border border-white/10 p-4 text-left"
              >
                <div className="text-sm text-slate-300/80">{item.k}</div>
                <div className="text-2xl font-semibold mt-1">{item.v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto max-w-7xl px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "深空望远",
              desc: "以多波段合成影像复原星云结构；交互式视差帮助你理解尺度与距离。",
              Icon: Telescope,
            },
            {
              title: "引擎之心",
              desc: "用可视化的贝塞尔轨道模拟行星转移窗与引力弹弓。",
              Icon: Rocket,
            },
            {
              title: "微光数据",
              desc: "星等、红移、光谱线一网打尽，轻盈的数据面板助你做出洞见。",
              Icon: Star,
            },
          ].map(({ title, desc, Icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 inline-flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-semibold">{title}</h3>
              </div>
              <p className="mt-3 text-slate-300/90 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="relative mx-auto max-w-7xl px-4 pb-24">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">宇宙影廊</h2>
          <p className="text-slate-300/90 mt-2">
            哈勃、詹姆斯·韦布与地面阵列留下的经典瞬间。
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200",
            "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200",
            "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1200",
            "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=1200",
            "https://images.unsplash.com/photo-1462332420958-a05d1e002413?q=80&w=1200",
            "https://images.unsplash.com/photo-1473929734674-efaaf12c3b5f?q=80&w=1200",
            "https://images.unsplash.com/photo-1447433819943-74a20887a81e?q=80&w=1200",
            "https://images.unsplash.com/photo-1462331321792-cc44368b8894?q=80&w=1200",
          ].map((src, i) => (
            <motion.a
              key={src}
              href={src}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <img
                alt="宇宙照片"
                src={src}
                className="h-36 md:h-40 w-full object-cover group-hover:scale-105 transition"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
            </motion.a>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="relative mx-auto max-w-7xl px-4 pb-24">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">人类宇宙征途</h2>
          <p className="text-slate-300/90 mt-2">
            从火箭脉动到宇宙回声，我们如何一步步看见更远。
          </p>
        </div>
        <div className="space-y-4">
          {[
            { year: "1957", text: "人造卫星一号划破夜空，太空时代开启。" },
            { year: "1969", text: "阿波罗11号登月，人类首次踏足地外天体。" },
            { year: "1990", text: "哈勃望远镜升空，宇宙从此高清。" },
            { year: "2021", text: "詹姆斯·韦布升空，回望宇宙童年。" },
          ].map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-300 to-fuchsia-300">
                  {e.year}
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                <Sparkles className="h-5 w-5 text-fuchsia-300" />
              </div>
              <p className="mt-3 text-slate-200/90">{e.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Subscribe */}
      <section id="subscribe" className="relative mx-auto max-w-7xl px-4 pb-28">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-8 md:p-10 backdrop-blur-sm">
          <div className="md:flex items-center gap-10">
            <div className="md:w-2/3">
              <h3 className="text-2xl md:text-3xl font-bold">
                订阅「星际通讯」
              </h3>
              <p className="mt-2 text-slate-300/90">
                每周送达一次：最新天文发现、深空壁纸、观测指南与可视化实验。
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 md:mt-0 md:w-1/3 flex items-center gap-3"
            >
              <input
                type="email"
                required
                placeholder="输入你的邮箱"
                className="flex-1 px-4 py-3 rounded-xl bg-black/30 border border-white/10 outline-none focus:ring-2 focus:ring-fuchsia-400/40 placeholder:text-slate-400"
              />
              <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400 transition">
                订阅
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30">
        <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-400">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p>
              © {new Date().getFullYear()} Cosmic Odyssey. 星海无垠，探索不止。
            </p>
            <div className="flex items-center gap-4">
              <a className="hover:text-white transition" href="#features">
                特性
              </a>
              <a className="hover:text-white transition" href="#gallery">
                星图
              </a>
              <a className="hover:text-white transition" href="#timeline">
                征途
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
