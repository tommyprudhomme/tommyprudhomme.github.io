fetch('.\\templates\\navbar.html')
    .then(response => response.text())
    .then(navbarTemplate => {
        const navbarHtml = Mustache.render(navbarTemplate);
        document.getElementById('navbar').innerHTML = navbarHtml;
    }).then( () => {
        // Get all "navbar-burger" elements
        const $navbarBurgers = document.querySelectorAll('.navbar-btn');

        // Add a click event on each of them
        $navbarBurgers.forEach( el => {
            el.addEventListener('click', () => {
                console.log("111    ")
                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                //el.classList.toggle('is-active');
                //$target.classList.toggle('is-active');
            });
        });
    });