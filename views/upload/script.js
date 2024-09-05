let posted = false;
async function post() {
    if(!posted){
        posted = true;
        const body = JSON.stringify(Object.fromEntries([...document.getElementsByTagName("input")].map(x=>{
            switch(x.name){
                case "src":return [x.name,x.value.replace("https://www.youtube.com/watch?v=","").replace("https://youtu.be/","")];
                case "tags":return [x.name,x.value.split(",")];
                default:return [x.name,x.value];
            }
        })));
        await fetch("/api/upload?",{
            method:"post",
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:body
        });
        location.href="/";
    }
}

buttonUpdate.addEventListener("click",post);