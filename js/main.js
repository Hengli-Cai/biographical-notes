/* ============================================================
   个人主页交互脚本
   - 移动端菜单
   - 滚动时高亮当前导航
   - 学术成果标签页
   - 滚动显现动画
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 移动端菜单 ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "关闭菜单" : "打开菜单");
  });

  // 点击菜单项后关闭移动端菜单
  navLinks.addEventListener("click", function (event) {
    if (event.target.classList.contains("nav-link")) {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "打开菜单");
    }
  });

  /* ---------- 滚动时高亮当前导航 ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navAnchors = Array.from(document.querySelectorAll(".nav-link"));

  function highlightNav() {
    const scrollY = window.scrollY + window.innerHeight * 0.32;
    let currentId = sections[0] ? sections[0].id : "";

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollY) {
        currentId = section.id;
      }
    });

    // 页面底部时高亮最后一个区块
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      currentId = sections[sections.length - 1].id;
    }

    navAnchors.forEach(function (anchor) {
      anchor.classList.toggle("active", anchor.getAttribute("href") === "#" + currentId);
    });
  }

  window.addEventListener("scroll", highlightNav, { passive: true });
  window.addEventListener("resize", highlightNav);
  highlightNav();

  /* ---------- 学术成果标签页 ---------- */
  const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
  const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const targetId = button.getAttribute("aria-controls");

      tabButtons.forEach(function (btn) {
        const isActive = btn === button;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", String(isActive));
        btn.tabIndex = isActive ? 0 : -1;
      });

      tabPanels.forEach(function (panel) {
        const isTarget = panel.id === targetId;
        panel.hidden = !isTarget;
        panel.classList.toggle("active", isTarget);
      });
    });
  });

  // 支持键盘左右切换标签页
  const tabList = document.querySelector(".tabs");
  if (tabList) {
    tabList.addEventListener("keydown", function (event) {
      const currentIndex = tabButtons.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      let nextIndex = -1;
      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % tabButtons.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
      }

      if (nextIndex !== -1) {
        event.preventDefault();
        tabButtons[nextIndex].focus();
        tabButtons[nextIndex].click();
      }
    });
  }

  /* ---------- 滚动显现动画 ---------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // 不支持 IntersectionObserver 时直接显示
    revealElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }
})();
