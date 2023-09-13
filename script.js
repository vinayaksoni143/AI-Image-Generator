const apikey = "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";

const maxImgs = 6;
let selectedImgNumber = null;

let getRandomNumber = (min, max) => { return Math.floor(Math.random() * (max - min + 1)) + min }

// console.log(getRandomNumber(1,100));

let disableGenerateButton = () => { document.getElementById("generate").disabled = true; }

let enableGenerateButton = () => { document.getElementById("generate").disabled = false; }

function clearImgGrid() {
    const imggrid = document.getElementById("image-grid");
    imggrid.innerHTML = "";
}

async function generateImgs(input) {
    disableGenerateButton();
    clearImgGrid();


    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imgUrls = [];
    for (let i = 0; i < maxImgs; i++) {
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;

        const response = await fetch("https://api-inference.huggingface.co/models/prompthero/openjourney", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apikey}`
            },
            body: JSON.stringify({ inputs: prompt }),
        });

        if (!response.ok) {
            alert("Failed to generate Image!");
        }

        const b = await response.blob();
        const imgurl = URL.createObjectURL(b);
        imgUrls.push(imgurl);

        const img = document.createElement("img");
        img.src = imgurl;
        img.alt = `art-${i + 1}`;
        // img.onclick=()=>downloadImage(imgurl,i);
        console.log(imgurl)
        document.getElementById('image-grid').appendChild(img);
    }

    loading.style.display = 'none';

    enableGenerateButton();
    selectedImgNumber = null;
}

document.getElementById('generate').addEventListener('click', () => {
    const input = document.getElementById('user-prompt').value;
    generateImgs(input);
});


//update size of textarea
const t = document.getElementById('user-prompt');
function updateTextareaSize() {
    t.style.height = '3rem'; // Reset height to auto
    t.style.height = t.scrollHeight + 'px'; // Set height to scrollHeight
}
t.addEventListener('input', updateTextareaSize);
updateTextareaSize();


const images = document.querySelectorAll('#image-grid');
images.forEach(image => {
    image.addEventListener('click', function (e) {
        // console.log(e.target.src);
        const popup_img = document.querySelector('#pop-up img');
        popup_img.src=e.target.src
        popup_img.alt=e.target.alt
        document.getElementById('pop-up').style.display='block';
    })
});


function closePopup(){
    document.getElementById('pop-up').style.display='none';
}

function downloadImg(){
    const i=document.querySelector('#pop-up img');
    const link = document.createElement("a");
    link.href = i.src;
    link.download = `${i.alt}.jpg`;
    link.click();
}


let wdt = document.getElementById('wdth');
window.addEventListener('resize',()=>{
    wdt.innerHTML=wdt.offsetWidth;
})
