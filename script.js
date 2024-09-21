// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Dark mode toggle
document.addEventListener("DOMContentLoaded", function () {
  const modeToggle = document.getElementById("mode-toggle");
  const body = document.body;

  // Function to set the theme
  function setTheme(theme) {
    body.classList.toggle("dark-mode", theme === "dark");
    updateToggleButton(theme === "dark");
    localStorage.setItem("theme", theme);
  }

  // Function to get system preference
  function getSystemPreference() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme(getSystemPreference());
  }

  // Listen for system preference changes
  window.matchMedia("(prefers-color-scheme: dark)").addListener(function (e) {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });

  modeToggle.addEventListener("click", function () {
    const newTheme = body.classList.contains("dark-mode") ? "light" : "dark";
    setTheme(newTheme);
  });

  function updateToggleButton(isDarkMode) {
    modeToggle.innerHTML = isDarkMode
      ? '<i class="fas fa-sun"></i> Light Mode'
      : '<i class="fas fa-moon"></i> Dark Mode';
  }

  // Project modal
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const projects = document.querySelectorAll(".project");
  const closeBtn = document.querySelector(".close");

  const projectDetails = {
    "analytics-revamp": {
      title: "Analytics Module Revamp",
      description:
        "This project involved revamping the analytics module to boost daily active users by 20%. The revamped module provided more accurate and insightful data, leading to increased user engagement and satisfaction.",
    },
    "people-analytics": {
      title: "People Analytics Platform",
      description:
        "The People Analytics Platform was developed to provide comprehensive insights into employee data. By analyzing various metrics, the platform helped identify trends, improve decision-making, and open new revenue streams.",
    },
    "performance-optimization": {
      title: "Performance Optimization",
      description:
        "This project focused on optimizing the performance of our web applications. By implementing various techniques, we were able to slash load times by 6.5 seconds, resulting in a faster and more responsive user experience.",
    },
  };

  projects.forEach((project) => {
    project.addEventListener("click", () => {
      const projectId = project.getAttribute("data-project");
      modalTitle.textContent = projectDetails[projectId].title;
      modalDescription.textContent = projectDetails[projectId].description;
      modal.style.display = "block";
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  // Hamburger menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.querySelector("nav");

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    const isClickInsideNav = nav.contains(event.target);
    const isClickOnMenuToggle = menuToggle.contains(event.target);

    if (
      !isClickInsideNav &&
      !isClickOnMenuToggle &&
      nav.classList.contains("active")
    ) {
      nav.classList.remove("active");
    }
  });

  // Close menu when clicking on a nav link
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
    });
  });
});
