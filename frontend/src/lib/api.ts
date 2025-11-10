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

// cycleGAN image-to-image variant
export async function cycleGANImage(image: File) {
    console.log("Generating (cycleGAN) image to cartoon:", image.name);
    
    const formData = new FormData();
    formData.append("file", image);
    formData.append("description", `cycleGAN cartoonize image: ${image.name}`);
    
    const response = await fetch("/api/generate_cartoon/cycle_image", {
        method: "POST",
        body: formData
    });
    if (!response.ok) throw new Error("cycleGAN image to cartoon failed");
    return response.json();
}