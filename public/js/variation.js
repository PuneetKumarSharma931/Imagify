const file = document.getElementById('fileData');
const imgSize = document.getElementById('imgSize');
const img = document.getElementById('imageVariation');
const defaultText = document.getElementById('defaultVariationText');
const loader = document.getElementById('variationLoader');
const form = document.getElementById('imgForm');
const variationButton = document.getElementById('variation-button');

variationButton.disabled = true;

file.addEventListener('change', (e)=>{

    if(e.target.files.length <= 0) {

        variationButton.disabled = true;
    }
    else {

        variationButton.disabled = false;
    }
});

form.addEventListener('submit', async (e)=>{

    e.preventDefault();

    const fileData = file.files[0];
    const Size = imgSize.value;

    defaultText.style.display = 'none';
    img.style.display = 'none';
    file.value = "";
    variationButton.disabled = true;

    try {
            
        if(fileData.type.indexOf("image") === -1) {

            defaultText.innerText = 'File must be an image!';
            defaultText.style.display = 'block';

            return;
        }

        if(fileData.type.indexOf("png") === -1) {

            defaultText.innerText = 'Image must be of type png!';
            defaultText.style.display = 'block';
            return;
        }

        if(fileData.size > 4194304) {

            defaultText.innerText = 'Image must be less than 4MB';
            defaultText.style.display = 'block';
            return;
        }

        const reader = new FileReader();

        reader.readAsDataURL(fileData);

        reader.onload = async (e)=>{

            const image = new Image();

            image.src = e.target.result;

            image.onload = async (e)=>{

                if( e.target.width !== e.target.height ) {

                    defaultText.innerText = 'Image must be a square';
                    defaultText.style.display = 'block';
                    return;
                }

                loader.style.display = 'block';

                const formData = new FormData();
                formData.append("Size", Size);
                formData.append("file", fileData);
            
                const response = await fetch('http://localhost:3000/openai/imagevariation', {

                method: 'POST',
                body: formData
                });

                const responseData = await response.json();

                if(responseData.success) {

                    loader.style.display = 'none';
                    img.src = responseData.data;
                    img.style.display = 'block'
                }
                else {

                    loader.style.display = 'none';
                    defaultText.innerText = responseData.error;
                    defaultText.style.display = 'block';
                }

            }

            image.onerror = (e)=>{

                    defaultText.innerText = 'There was some error while uploading the image!';
                    defaultText.style.display = 'block';
                    return;
            }
        }

        reader.onerror = (e)=>{

                defaultText.innerText = 'There was some error while reading the image!';
                defaultText.style.display = 'block';
                return;
        }

    } catch (error) {
        
            loader.style.display = 'none';
            defaultText.innerText = 'Some internal server error occured!';
            defaultText.style.display = 'block';
    }

});
