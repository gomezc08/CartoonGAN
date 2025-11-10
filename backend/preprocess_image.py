import os
import tensorflow as tf
from PIL import Image
import numpy as np

def preprocess_image_for_inference(image_path, img_height=1024, img_width=1024):
    """
    Preprocesses a single image for inference with the generator models.

    Args:
        image_path: Path to the input image file.
        img_height: Target image height.
        img_width: Target image width.

    Returns:
        A TensorFlow Tensor of the preprocessed image with a batch dimension.

    Raises:
        FileNotFoundError: If the image file doesn't exist
        ValueError: If the image dimensions are invalid or the image format is unsupported
        RuntimeError: If there's an error during preprocessing
    """
    try:
        # Validate image path
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")

        # Validate dimensions
        if img_height <= 0 or img_width <= 0:
            raise ValueError(f"Invalid dimensions: height={img_height}, width={img_width}")

        # 1. Load and validate the image
        try:
            image = Image.open(image_path)
            if image.format not in ['JPEG', 'PNG']:
                raise ValueError(f"Unsupported image format: {image.format}. Use JPEG or PNG.")
            image = image.convert("RGB")
        except Exception as e:
            raise RuntimeError(f"Error loading image: {str(e)}")

        # 2. Convert to NumPy array and then to TensorFlow Tensor
        try:
            image = np.array(image)
            if image.dtype != np.uint8:
                raise ValueError(f"Unexpected image data type: {image.dtype}")
            image = tf.convert_to_tensor(image, dtype=tf.float32)
        except Exception as e:
            raise RuntimeError(f"Error converting image to tensor: {str(e)}")

        # 3. Resize
        image = tf.image.resize(image, [img_height, img_width],
                              method=tf.image.ResizeMethod.NEAREST_NEIGHBOR)

        # 4. Normalize to [-1, 1] range
        image = (image / 127.5) - 1

        # 5. Add batch dimension
        image = tf.expand_dims(image, axis=0)

        return image

    except Exception as e:
        raise RuntimeError(f"Error during image preprocessing: {str(e)}")

if __name__ == "__main__":
    try:
        # Test the preprocessing function
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        sample_image_path = os.path.join(backend_dir, "sample_image.jpg")
        processed_image = preprocess_image_for_inference(sample_image_path)
        print(f"Successfully preprocessed image. Shape: {processed_image.shape}")
    except Exception as e:
        print(f"Error: {str(e)}")