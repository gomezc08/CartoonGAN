import os
# Disable oneDNN optimizations to suppress TensorFlow warning
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import numpy as np
from PIL import Image
import tensorflow as tf
import keras
from custom_layers import InstanceNormalization  # Import our custom layer
from image_utils import tensor_to_image, image_to_base64, save_image

# Get the absolute path to the Backend files directory
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BACKEND_DIR, "gan_architecture/models")

def generate_cycle_gan_cartoon(preprocessed_image=None):
    """
    Generate a cartoon image using the cycleGAN model.
    
    Returns:
        tf.Tensor: The generated cartoon image
        
    Raises:
        FileNotFoundError: If the required files are not found
        RuntimeError: If there's an error during model loading or inference
    """
    try:
        # Use provided tensor or load from disk
        if preprocessed_image is None:
            preprocessed_path = os.path.join(BACKEND_DIR, "preprocessed_image.npy")
            if not os.path.exists(preprocessed_path):
                raise FileNotFoundError("Preprocessed image file not found. Run preprocess_image.py first.")
            preprocessed_image = np.load(preprocessed_path)
        
        # Load cycle gan model
        model_path = os.path.join(MODELS_DIR, "cycle_gan_generator_g_model.keras")
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"cycleGAN model not found at {model_path}")
            
        # Load model with custom objects
        custom_objects = {'InstanceNormalization': InstanceNormalization}
        cycle_gan_generator = keras.models.load_model(model_path, custom_objects=custom_objects)
        
        # Generate the cycle gan image
        cycle_gan_image = cycle_gan_generator(preprocessed_image)
        
        # Convert to PIL Image
        pil_image = tensor_to_image(cycle_gan_image)
        
        # Convert to base64 for web display
        base64_image = image_to_base64(pil_image, format='PNG')
        
        return {
            'tensor': cycle_gan_image,
            'base64': base64_image,
            'pil_image': pil_image
        }
        
    except Exception as e:
        raise RuntimeError(f"Error generating cycleGAN cartoon: {str(e)}")

def generate_pix2pix_cartoon(preprocessed_image=None):
    """
    Generate a cartoon image using the Pix2Pix model.
    
    Returns:
        tf.Tensor: The generated cartoon image
        
    Raises:
        FileNotFoundError: If the required files are not found
        RuntimeError: If there's an error during model loading or inference
    """
    try:
        # Use provided tensor or load from disk
        if preprocessed_image is None:
            preprocessed_path = os.path.join(BACKEND_DIR, "preprocessed_image.npy")
            if not os.path.exists(preprocessed_path):
                raise FileNotFoundError("Preprocessed image file not found. Run preprocess_image.py first.")
            preprocessed_image = np.load(preprocessed_path)
        
        # Load pix2pix model
        model_path = os.path.join(MODELS_DIR, "pix2pix_generator_model.keras")
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Pix2Pix model not found at {model_path}")
            
        # Load model - try with custom objects first, fallback to without if not needed
        try:
            custom_objects = {'InstanceNormalization': InstanceNormalization}
            pix2pix_generator = keras.models.load_model(model_path, custom_objects=custom_objects)
        except (KeyError, ValueError) as e:
            # Model might not use InstanceNormalization, try loading without it
            print(f"Warning: Could not load with InstanceNormalization, trying without: {str(e)}")
            pix2pix_generator = keras.models.load_model(model_path)
        
        # Generate the pix2pix image
        pix2pix_image = pix2pix_generator(preprocessed_image)
        
        # Convert to PIL Image
        pil_image = tensor_to_image(pix2pix_image)
        
        # Convert to base64 for web display
        base64_image = image_to_base64(pil_image, format='PNG')
        
        return {
            'tensor': pix2pix_image,
            'base64': base64_image,
            'pil_image': pil_image
        }
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error generating Pix2Pix cartoon: {str(e)}")
        print(f"Full traceback: {error_details}")
        raise RuntimeError(f"Error generating Pix2Pix cartoon: {str(e)}")

# Test the functions
if __name__ == "__main__":
    try:
        pix2pix_result = generate_pix2pix_cartoon()
        cycle_gan_result = generate_cycle_gan_cartoon()
        
        # Save the tensors
        np.save(os.path.join(BACKEND_DIR, "pix2pix_cartoon.npy"), pix2pix_result['tensor'].numpy())
        np.save(os.path.join(BACKEND_DIR, "cycle_gan_cartoon.npy"), cycle_gan_result['tensor'].numpy())
        
        # Save the images in PNG format
        save_image(pix2pix_result['pil_image'], os.path.join(BACKEND_DIR, "pix2pix_cartoon.png"))
        save_image(cycle_gan_result['pil_image'], os.path.join(BACKEND_DIR, "cycle_gan_cartoon.png"))
        
        print("Successfully generated and saved cartoon images in both .npy and .png formats.")
        
    except Exception as e:
        print(f"Error during image generation: {str(e)}")