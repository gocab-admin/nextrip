export  const handleImageError = (e:any) => {
  console.log("eeee",e)
    e.target.srcset = '';
    e.target.src = '/images/errorImage.webp';
  };

  export  const handleSVGError = (e:any) => {
    e.target.srcset = '';
    e.target.src = '/images/errorImage.webp';
    e.target.width = 30;
    e.target.height = 30;
  };
