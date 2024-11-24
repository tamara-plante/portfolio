function importSkills(jsonData) 
{
    for (let key in jsonData) {
        const entry = jsonData[key];
        const parent = document.getElementById(`badge-${key}`);

        if (key !== "others") {
            entry.forEach(el => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <div class="big-badge">
                        <div class="logo"><img src="assets/images/logos/${el.img}" alt="${el.label} logo"></div>
                        <span class="label">${el.label}</span>
                    </div>
                `
                parent.appendChild(div);
            });
        }
        else if (key === "others") {
            entry.forEach(el => {
                const span = document.createElement("span");
                parent.appendChild(span);

                span.classList.add("badge", "text-white", el.type);
                span.innerText = el.label;
            });
        }
        else {
            console.log("unknown type: " + key);
            return;
        }
    };
}

function importProjects(jsonData)
{
    function parent() {
        return document.createElement("div");
    }
    function cardBody() {
        const cardBody = parent();
        cardBody.classList.add("card-body");
        return cardBody;
    }
    function cardText(type = "p") {
        const cardText = document.createElement(type);
        cardText.classList.add("card-text");
        return cardText;
    }
    function cardLink() {
        const cardLink = document.createElement("a");
        cardLink.target = "_blank";
        cardLink.classList.add("card-link");
        return cardLink;
    }
    function classes(el, classes) {
        el.classList.add(...classes.split(" "));
    }

    const projects = document.querySelector(".grid");

    jsonData.projects.forEach(el => {
        const div = parent();
        projects.appendChild(div);

        classes(div, "grid-item col-12 col-lg-6 col-xl-4");

        const divCard = parent();
        div.appendChild(divCard);

        if (el.type === "project") {
            classes(divCard, "card bg-dark text-white");
            
            if (el.img) {
                const img = document.createElement("img");
                divCard.appendChild(img);

                img.src = `assets/images/portfolio/${el.img}`;
                img.alt = el.label;
                classes(img, "portfolio-img card-img-top img-fluid rounded-top");
                classes(img, (el.imgClass ? el.imgClass : "text-bg-light"));

            }
            const main = cardBody();
            divCard.appendChild(main);

            const title = document.createElement("h3");
            main.appendChild(title);

            title.innerText = el.label;
            classes(title, "card-title mb-3");

            el.desc.forEach(entry => {
                if (entry.info) {
                    const h4 = cardText("h4");
                    main.appendChild(h4);

                    h4.innerText = entry.info;
                }
                else if (entry.text) {
                    const text = cardText();
                    main.appendChild(text);

                    text.innerText = entry.text;
                }
                else {
                    console.log("Unknown type: " + entry);
                    return;
                }
            });

            if (el.badges) {
                const badges = cardBody();
                divCard.appendChild(badges);

                el.badges.forEach(entry => {
                    const badge = document.createElement("span");
                    badges.appendChild(badge);

                    badge.classList.add("badge");
                    badge.innerText = entry;
                });
            }

            if (el.links) {
                const links = cardBody();
                divCard.appendChild(links);

                links.classList.add("text-center");

                if (el.links.demo) {
                    const a = cardLink();
                    links.appendChild(a);

                    a.href = el.links.demo;
                    a.title = "Demo";
                    a.innerHTML = `<i class="bi bi-play-btn"></i>`;
                }
                if (el.links.github) {
                    el.links.github.forEach(entry => {
                        const a = cardLink();
                        links.appendChild(a);

                        a.href = entry.link;
                        a.title = entry.label ? entry.label : "GitHub";
                        a.innerHTML = `<i class="bi bi-github"></i>`;
                    });
                }
                if (el.links.presentation) {
                    const a = cardLink();
                    links.appendChild(a);

                    a.href = `assets/images/portfolio/${el.links.presentation}`;
                    a.title = "Presentation";
                    a.innerHTML = `<i class="bi bi-info-circle"></i>`;
                }
            }

        }
        else if (el.type === "quote") {
            classes(divCard, "card text-white color2 border-info");

            const main = cardBody();
            divCard.appendChild(main);

            const figure = document.createElement("figure");
            main.appendChild(figure);

            const blockquote = document.createElement("blockquote");
            blockquote.classList.add("blockquote");
            figure.appendChild(blockquote);

            const para = document.createElement("p");
            blockquote.appendChild(para);

            para.innerText = el.text;
        }
        else {
            console.log("Unknown type: " + el.type);
            return;
        }

        //msnry.appended( div );
    });

    //msnry.reloadItems()
    //msnry.layout();
}