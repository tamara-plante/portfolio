let sectionAboutMe;
let sectionProjects;
let sectionSkills;
let panelAside;
let active = "section-about-me";

let gridProjects;
let gridProjectsSpinner;
let iso;
let qsRegex;
let isOldQuote = true;
let quotes = [];

function init() 
{
    sectionAboutMe = document.getElementById("section-about-me");
    sectionProjects = document.getElementById("section-projects");
    sectionSkills = document.getElementById("section-skills");
    panelAside = document.querySelector("aside");

    // init Masonry
    gridProjects = document.querySelector("#section-projects .grid");
    gridProjectsSpinner = document.querySelector("#section-projects .spinner-grow");
    //msnry = new Masonry(gridProjects);
    iso = new Isotope(gridProjects);
    /*
    const grid = document.querySelector('.grid');
    msnry = Masonry.data( grid );
    imagesLoaded(grid, function() {
        msnry.layout();
    });
    */
    /*
    Promise.all(Array.from(document.images)
    .filter(img => img.classList.contains("portfolio-img") && !img.complete)
    .map(img => new Promise(resolve => { img.onload = img.onerror = resolve;})))
    .then(() => {
        var msnry = new Masonry(".grid");
        msnry.layout();
    });*/
    
    fetch("assets/skills.json")
    .then(response => response.json())
    .then(json => importSkills(json))
    .catch(error => console.log("Unable to load skills.json\n" + error));
    
    
    fetch("assets/projects.json")
    .then(response => response.json())
    .then(json => importProjects(json))
    .then(() => {
        // Only create after elements are added to our grid.
        iso = new Isotope(gridProjects, {
            filter: function(itemElem) {
                return qsRegex ? itemElem.textContent.match(qsRegex) : true;
            }
        });
        iso.on("arrangeComplete", function(filteredItems) {
            const noResults = document.querySelector("#section-projects .no-results");
            if (filteredItems.length === 0) {
                noResults.classList.add("active");
                isOldQuote = true;
            }
            else {
                noResults.classList.remove("active");
            }
        });

        const skillBadges = document.querySelectorAll("#badge-others span.badge");
        const selectBadges = document.querySelectorAll(".badge-select");
        selectBadges.forEach(el => {
            el.addEventListener("click", function() {
                skillBadges.forEach(badge => {
                    if (badge.classList.contains(el.dataset.filter)) {
                        badge.classList.add("active");
                    }
                    else {
                        badge.classList.remove("active");
                    }
                });
                selectBadges.forEach(select => select.classList.remove("active"));
                el.classList.add("active");
            });
        });
        document.querySelector(`.badge-select[data-filter="cloud"]`).click() // default
    })
    .catch(error => console.log("Unable to load projects.json\n" + error));
    
    // Skills observer to show animations
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

    // Search feature, including reset
    const search = document.getElementById("search");
    search.addEventListener("keyup", debounce(function() {

        if (isOldQuote) {
            handleQuotes();
        }
        qsRegex = new RegExp( this.value, "gi");
        iso.arrange();
    }, 200));

    search.addEventListener("search", function() {
        qsRegex = new RegExp( "", "gi");
        iso.arrange();
    })


    if (["#projects", "#about-me", "#skills"].includes(location.hash)) {

        // Add a delay to allow Masonry the time to load the grid fully.
        if (location.hash === "#projects") {
            gridProjects.style.display = "none";
            
            setTimeout(function() {
                gridProjects.style.display = "block";
                gridProjectsSpinner.style.display = "none";
                iso.layout();
            }, 1000);
        }
        else {
            gridProjectsSpinner.style.display = "none";
        }
        contentHandler("section-" + location.hash.split("#")[1]);
    }
    else {
        gridProjectsSpinner.style.display = "none";
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
        iso.layout();

        sectionSkills.classList.add("hide");
        sectionAboutMe.classList.add("hide");
        panelAside.classList.add("hide");
        // Scroll to the top instantly.
        location.hash = "#projects";
        document.querySelector(".row.resume").scrollTo({
            top: 0,
            behavior: 'instant',
        });
    }

    active = newActive;
    if (active === "section-about-me") {
        location.hash = "";
    }
    else {
        location.hash = "#" + active.split("section-")[1];
    }
}

// debounce so filtering doesn't happen every millisecond
function debounce( fn, threshold ) {
    var timeout;
    threshold = threshold || 100;
    return function debounced() {
      clearTimeout( timeout );
      var args = arguments;
      var _this = this;
      function delayed() {
        fn.apply( _this, args );
      }
      timeout = setTimeout( delayed, threshold );
    };
}

function handleQuotes() 
{   
    // No quotes!
    if (quotes.length === 0) {
        fetch("https://programming-quotesapi.vercel.app/api/bulk")
        .then(response => response.json())
        .then(json => {
            quotes = json;
        })
        .catch(error => console.log("Unable to retrieve quote...\n" + error))
    }

    if (quotes.length > 0) {
        // Setup the quote
        const blockquote = document.querySelector(".no-results blockquote p");
        const author = document.querySelector(".no-results figcaption");
        const newQuote = quotes.shift();

        blockquote.innerText = newQuote.quote;
        author.innerText = newQuote.author;
        isOldQuote = false;
    }
}




/*
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
*/

window.onload = init;
