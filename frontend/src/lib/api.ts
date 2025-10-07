export async function pix2Pix(image: File) {
    const cartoonImage = `Cartoonize the following image: ${image.name}`;
    console.log("Generating the following image to cartoon:", cartoonImage);
    const response = await fetch("/api/generate_cartoon/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartoonImage })
    });
    if (!response.ok) throw new Error("Generate image to cartoon failed");
    return response.json();
}

// CyclicGAN image-to-image variant
export async function cyclicGANImage(image: File) {
    const cyclicImageDescriptor = `CyclicGAN cartoonize image: ${image.name}`;
    console.log("Generating (CyclicGAN) image to cartoon:", cyclicImageDescriptor);
    const response = await fetch("/api/generate_cartoon/cyclic_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cyclicImageDescriptor })
    });
    if (!response.ok) throw new Error("CyclicGAN image to cartoon failed");
    return response.json();
}