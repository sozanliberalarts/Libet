let type = 0;
let buttons = [...document.getElementsByTagName("button")];

function buttonUpdate(e) {
  buttons[type].classList.remove("clicked");
  e.target.classList.add("clicked");
  type = buttons.indexOf(e.target);
  liUpdate();
}

async function liUpdate(){
  let url = "/api/search?"+new URLSearchParams({"type":
["title","speaker","tags"][type],"content":bar.value}).toString();
  let result = await (await fetch(url)).json();
  
  videos.innerHTML = result.map(video=>
  `<li>
  <a href="/announcements/${video.title}">
    <img src="https://img.youtube.com/vi/${video.src}/0.jpg" alt="YouTube thumbnail">
    <div>${video.title}</div>
    <div>
      <p>${video.speaker}</p>
      <p>${video.date}</p>
    </div>
  </a>
</li>`
  ).join("")
}

liUpdate();
buttons.forEach(x=>x.addEventListener("click",buttonUpdate))
bar.addEventListener("change",liUpdate);