import tensorflow as tf
from tensorflow_examples.models.pix2pix import pix2pix
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt

# Define the same parameters as in Colab
OUTPUT_CHANNELS = 3  # Confirm this matches your Colab

# Rebuild the generator architecture
generator_g = pix2pix.unet_generator(OUTPUT_CHANNELS, norm_type='instancenorm')

# Load the weights
generator_g.load_weights('generator_g_model.weights.h5')

def load_and_preprocess_image(image_path, target_size=(256, 256)):
    """Load and preprocess image for the model"""
    img = Image.open(image_path)
    img = img.resize(target_size, Image.LANCZOS)
    img_array = np.array(img)

    # Normalize to [-1, 1]
    img_array = (img_array / 127.5) - 1.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array


def generate_and_display(image_path):
    """Generate transformed image and display results"""
    # Load and preprocess
    input_image = load_and_preprocess_image(image_path)
    
    # Generate transformed image
    generated_image = generator_g(input_image, training=False)
    
    # Convert back to [0, 255]
    generated_image = (generated_image[0].numpy() * 0.5 + 0.5) * 255.0
    generated_image = generated_image.astype(np.uint8)
    
    # Load original for display
    original = Image.open(image_path)
    
    # Display side by side
    plt.figure(figsize=(12, 6))
    
    plt.subplot(1, 2, 1)
    plt.imshow(original)
    plt.title('Input Image')
    plt.axis('off')
    
    plt.subplot(1, 2, 2)
    plt.imshow(generated_image)
    plt.title('Generated Image')
    plt.axis('off')
    
    plt.tight_layout()
    plt.show()


def save_generated_image(image_path, output_path):
    """Generate and save the transformed image at original resolution"""
    # Get original image size
    original_img = Image.open(image_path)
    original_size = original_img.size  # (width, height)
    
    # Preprocess for model
    input_image = load_and_preprocess_image(image_path)
    
    # Generate
    generated_image = generator_g(input_image, training=False)
    
    # Convert back to [0, 255]
    generated_image = (generated_image[0].numpy() * 0.5 + 0.5) * 255.0
    generated_image = generated_image.astype(np.uint8)
    
    # Create PIL image and resize back to original dimensions
    output_img = Image.fromarray(generated_image)
    output_img = output_img.resize(original_size, Image.LANCZOS)

    output_img.save(output_path)
    print(f"Saved generated image to: {output_path} (size: {original_size})")

# Usage
if __name__ == "__main__":    
    save_generated_image('pic1.jpeg', 'output_comic.jpg')