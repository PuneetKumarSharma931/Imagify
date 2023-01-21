const generate = document.getElementById('generate-button');
const inputPrompt = document.getElementById('prompt');
const img = document.getElementById('generatedImage');
const size = document.getElementById('size');
const defaultText = document.getElementById('defaultText');
const loader = document.getElementById('loader');
let imgUrl = '';


generate.disabled = true;

inputPrompt.addEventListener('input', (e)=>{

    if(inputPrompt.value.length > 0) {

        generate.disabled = false;
    }
    else {

        generate.disabled = true;
    }
});

generate.addEventListener('click', async (e)=>{

    try {
        
        img.style.display = 'none';
        defaultText.style.display = 'none';
        loader.style.display = 'block';
        const prompt = inputPrompt.value;
        const sizeValue = size.value;
        inputPrompt.value = '';

        const response = await fetch('http://localhost:3000/openai/generateimage', {
            method: 'POST',
            body: JSON.stringify({
                prompt,
                size: sizeValue
            }),
            headers: {
                "Content-type": "application/json"
            },
        });

        const responseData = await response.json();
        

        if(responseData.success) {

            loader.style.display = 'none';
            img.src = responseData.data;
            imgUrl = responseData.data;
            img.style.display = 'block';

        }
        else {
            
            loader.style.display = 'none';
            img.style.display = 'none';
            defaultText.innerText = responseData.error;
            defaultText.style.display = 'block';
        }

    } catch (error) {
        
        loader.style.display = 'none';
        defaultText.innerText = 'Sorry something went wrong! Please try again...';
        defaultText.style.display = 'block';
    }

});
