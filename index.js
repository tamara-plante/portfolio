const sectionAboutMe = document.getElementById("section-about-me");
const sectionProjects = document.getElementById("section-projects");
const sectionSkills = document.getElementById("section-skills");
let active = "section-about-me";

function init() {

    // Setup offcanvas links
    // For some reason, through data-bs-dismiss, anchor links scroll does not work.
    const offcanvasEl = document.getElementById("main-nav");
    var offcanvas = new bootstrap.Offcanvas(offcanvasEl);

    document.querySelectorAll("#main-nav .nav-link").forEach(el => {
        el.addEventListener("click", () => {
            return offcanvas.toggle();
        })
    });

    const badgeGroups = document.querySelectorAll(".badge-group");
    const observer = new IntersectionObserver(entries => {
        /*console.log(entries);*/
        const focused = entries.filter(entry => entry.isIntersecting);

        focused.forEach(entry => {
            entry.target.classList.add("show");
        })
        /*
        console.log(focused);
        if (focused[0]) {
            focused[0].target.classList.add("show");
        }*/
    });
    badgeGroups.forEach(group => observer.observe(group));

    /*
    document.querySelectorAll(".btn-portfolio").forEach(el => {
        el.addEventListener("click", () => {
            console.log("hello?");
            document.getElementById("projects-container").classList.remove("hide");
        })
    });*/
    document.querySelectorAll(".btn-portfolio").forEach(el => {
        el.addEventListener("click", () => {
            /*if (active == "section-projects") {
                sectionProjects.style.display = "none";
            }*/
            document.getElementById(active).classList.remove("active");
            newActive = el.dataset.section;

            if (active == newActive) {
                newActive = "section-about-me";
            }

            switch(newActive) {
                case "section-skills":
                    sectionSkills.classList.add("active");
                    active = "section-skills";
                    break;
                case "section-projects":
                    //sectionProjects.style.display = "block";
                    sectionProjects.classList.add("active");
                    /*sectionSkills.classList.add("hide");
                    sectionAboutMe.classList.add("hide");*/
                    active = "section-projects";
                    break;
                default:
                    sectionAboutMe.classList.add("active");
                    active = "section-about-me";
                    break;
            }
        });
    });
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

init();