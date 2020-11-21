document.addEventListener('DOMContentLoaded', function() {

    console.log("aqui en el javascript bart")
    document.addEventListener("keypress", function(e){
        e = e || window.event;
        console.log("aqui en el eventoo bart")


        if (e.key === 'Enter' ){
            document.documentElement.classList.toggle('dark-mode');
        };

    })
})