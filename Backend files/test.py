import os
import numpy as np
from preprocess_image import preprocess_image_for_inference
from generate_images import generate_cyclic_gan_cartoon, generate_pix2pix_cartoon
from image_utils import save_image

def main():
    try:
        # Get the absolute path to the Backend files directory
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Process the sample image
        sample_image_path = os.path.join(backend_dir, "sample_image.jpg")
        if not os.path.exists(sample_image_path):
            raise FileNotFoundError(f"Sample image not found at {sample_image_path}")
        
        print("Starting image preprocessing...")
        image = preprocess_image_for_inference(sample_image_path, 1024, 1024)
        
        # Save preprocessed image
        preprocessed_path = os.path.join(backend_dir, "preprocessed_image.npy")
        np.save(preprocessed_path, image.numpy())
        print("Preprocessed image saved successfully.")
        
        # Generate cartoons
        print("Generating Pix2Pix cartoon...")
        pix2pix_result = generate_pix2pix_cartoon()
        
        print("Generating CyclicGAN cartoon...")
        cyclic_gan_result = generate_cyclic_gan_cartoon()
        
        # Save generated images in both numpy and PNG formats
        np.save(os.path.join(backend_dir, "pix2pix_cartoon.npy"), pix2pix_result['tensor'].numpy())
        np.save(os.path.join(backend_dir, "cyclic_gan_cartoon.npy"), cyclic_gan_result['tensor'].numpy())
        
        # Save web-friendly PNG versions
        save_image(pix2pix_result['pil_image'], os.path.join(backend_dir, "pix2pix_cartoon.png"))
        save_image(cyclic_gan_result['pil_image'], os.path.join(backend_dir, "cyclic_gan_cartoon.png"))
        
        print("Successfully completed preprocessing and image generation.")
        print("Generated files:")
        print("- pix2pix_cartoon.npy (tensor data)")
        print("- pix2pix_cartoon.png (web-friendly image)")
        print("- cyclic_gan_cartoon.npy (tensor data)")
        print("- cyclic_gan_cartoon.png (web-friendly image)")
        
    except FileNotFoundError as e:
        print(f"File not found error: {str(e)}")
    except ValueError as e:
        print(f"Invalid input error: {str(e)}")
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    main()
