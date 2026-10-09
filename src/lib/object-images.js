export function installImageFallback(image) {
  const useMuseumImage=()=>{
    const source=image.dataset.sourceImage;
    if(!source)return;
    delete image.dataset.sourceImage;
    image.src=source;
  };
  image.addEventListener('error',useMuseumImage,{once:true});
  if(image.getAttribute('src')&&image.complete&&image.naturalWidth===0)useMuseumImage();
}
