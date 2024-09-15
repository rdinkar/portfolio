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
const modeToggle = document.getElementById("mode-toggle");
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

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

// Remove or comment out this entire function
/*
function animateProjects() {
  const projects = document.querySelectorAll(".project");
  const triggerBottom = window.innerHeight * 0.8;

  projects.forEach((project) => {
    const projectTop = project.getBoundingClientRect().top;

    if (projectTop < triggerBottom) {
      project.classList.add("animate");
    } else {
      project.classList.remove("animate");
    }
  });
}
*/

// Remove or comment out these event listeners
// window.addEventListener("scroll", animateProjects);
// window.addEventListener("load", animateProjects);
