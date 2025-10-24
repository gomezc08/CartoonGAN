export async function pix2Pix(image: File) {
    console.log("Generating the following image to cartoon:", image.name);
    
    const formData = new FormData();
    formData.append("file", image);
    formData.append("description", `Cartoonize the following image: ${image.name}`);
    
    const response = await fetch("/api/generate_cartoon/pix2pix", {
        method: "POST",
        body: formData
    });
    if (!response.ok) throw new Error("Generate image to cartoon failed");
    return response.json();
}

// CyclicGAN image-to-image variant
export async function cyclicGANImage(image: File) {
    console.log("Generating (CyclicGAN) image to cartoon:", image.name);
    
    const formData = new FormData();
    formData.append("file", image);
    formData.append("description", `CyclicGAN cartoonize image: ${image.name}`);
    
    const response = await fetch("/api/generate_cartoon/cyclic_image", {
        method: "POST",
        body: formData
    });
    if (!response.ok) throw new Error("CyclicGAN image to cartoon failed");
    return response.json();
}