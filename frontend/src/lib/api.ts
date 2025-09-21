export async function imageToCartoon(image: File) {
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

export async function textToCartoon(prompt: string) {
    const cartoonPrompt = `Cartoonize the following text: ${prompt}`;
    console.log("Generating the following text to cartoon:", cartoonPrompt);
    const response = await fetch("/api/generate_cartoon/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartoonPrompt })
    });
    if (!response.ok) throw new Error("Generate text to cartoon failed");
    return response.json();
}