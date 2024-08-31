// for active tab on navbar
const activePage = window.location.pathname;
const navlink  = document.querySelectorAll('nav ul li a').
forEach(link=>{
    if(link.href.includes(`${activePage}`)){
        link.classList.add('active');
    };
});
// active tab on navbar ends here 
