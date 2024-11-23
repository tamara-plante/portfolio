let sectionAboutMe;
let sectionProjects;
let sectionSkills;
let panelAside;
let active = "section-about-me";

let isTriggeredMsnRy = false;

function init() 
{
    sectionAboutMe = document.getElementById("section-about-me");
    sectionProjects = document.getElementById("section-projects");
    sectionSkills = document.getElementById("section-skills");
    panelAside = document.querySelector("aside");

    // init Masonry
    //const grid = document.querySelector('.grid');
    //msnry = Masonry.data( grid );
    /*imagesLoaded(grid, function() {
        msnry.layout();
    });*/
    /*
    Promise.all(Array.from(document.images)
    .filter(img => img.classList.contains("portfolio-img") && !img.complete)
    .map(img => new Promise(resolve => { img.onload = img.onerror = resolve;})))
    .then(() => {
        var msnry = new Masonry(".grid");
        msnry.layout();
    });*/

    const badgeGroups = document.querySelectorAll(".badge-group");
    const observer = new IntersectionObserver(entries => {
        
        const focused = entries.filter(entry => entry.isIntersecting);
        focused.forEach(entry => {
            entry.target.classList.add("show");
        })

    }, { threshold: 0.5 });
    badgeGroups.forEach(group => observer.observe(group));

    // Setup offcanvas links
    // For some reason, through data-bs-dismiss, anchor links scroll does not work.
    const offcanvasEl = document.getElementById("main-nav");
    var offcanvas = new bootstrap.Offcanvas(offcanvasEl);

    document.querySelectorAll(".btn-portfolio").forEach(el => {

        if (el.classList.contains("nav-link")) {
            el.addEventListener("click", () => {
                return offcanvas.toggle();
            });
        }

        el.addEventListener("click", () => {
            contentHandler(el.dataset.section);
        });
    });

    if (["#projects", "#about-me", "#skills"].includes(location.hash)) {
        contentHandler("section-" + location.hash.split("#")[1]);
    }
}

/**
 * Ensures proper display showing.
 * @param {string} section the section to show
 */
function contentHandler(section) 
{
    document.getElementById(active).classList.remove("active");
    // .hide only triggers for mobile
    // Portfolio is special...
    if (active == "section-projects") {
        panelAside.classList.remove("hide");
        sectionAboutMe.classList.remove("hide");
        sectionSkills.classList.remove("hide");
    }
    // Reset active btn-portfolio
    document.querySelectorAll(`[data-section="${active}"]`).forEach(el => {
        el.classList.remove("active");
        if (el.classList.contains("nav-link")) {
            el.removeAttribute("aria-current");
        }
    });
    
    newActive = section;
    // If we click on the same, reset to about me
    if (active === newActive) {
        newActive = "section-about-me";
    }
    // Setup active on btn-portfolio and sections
    document.querySelectorAll(`[data-section="${newActive}"]`).forEach(el => {
        el.classList.add("active");
        if (el.classList.contains("nav-link")) {
            el.setAttribute("aria-current", "page");
        }
    });

    // Portfolio is special
    if (newActive == "section-projects") {
        // Make sure the grid is correctly setup due to display: none.
        if (!isTriggeredMsnRy) {
            const msnry = new Masonry(".grid");
            msnry.layout();
        }
        sectionSkills.classList.add("hide");
        sectionAboutMe.classList.add("hide");
        panelAside.classList.add("hide");
        document.querySelector(".row.resume").scrollTop = 0;
    }

    active = newActive;
    location.hash = "#" + active.split("section-")[1];
}


function generateNavigation() {
    const projects = document.querySelectorAll(".project");
    const navContainer = document.createElement("nav");
    const navItems = Array.from(projects).map(project => {
        return `
            <div class="pnav-item" data-section-id="${project.id}">
                <a href="#${project.id}" class="pnav-link"></a>
                <span class="pnav-label">${project.dataset.label}</span>
            </div>
        `
    });

    navContainer.classList.add("pnav");
    navContainer.innerHTML = navItems.join("");

    const observer = new IntersectionObserver(entries => {
        // Disable nav active
        document.querySelectorAll(".pnav-link").forEach(el => {
            el.classList.remove("active");
        });

        // Disable project content show
        document.querySelectorAll(".hidden").forEach(el => {
            el.classList.remove("show");
        })

        const focused = entries.filter(entry => entry.isIntersecting)[0];
        document
            .querySelector(`.pnav-item[data-section-id="${focused.target.id}"] .pnav-link`)
            .classList.add("active");
        
        focused.target.querySelector(".content").classList.add("show");
    }, 
    // When the section covers 50% of the viewport
    { threshold: 0.5 });    
    projects.forEach(project => observer.observe(project));

    document.querySelector(".projects-container").appendChild(navContainer);
}

//generateNavigation();
window.onload = init;
