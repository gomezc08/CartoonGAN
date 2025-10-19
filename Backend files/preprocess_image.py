import tensorflow as tf
from PIL import Image
import numpy as np

def preprocess_image_for_inference(image_path, img_height, img_width):
  """
  Preprocesses a single image for inference with the Pix2Pix generator model.

  Args:
    image_path: Path to the input image file.
    img_height: Target image height.
    img_width: Target image width.

  Returns:
    A TensorFlow Tensor of the preprocessed image with a batch dimension.
  """
  # 1. Load the image
  image = Image.open(image_path).convert("RGB")

  # 2. Convert to NumPy array and then to TensorFlow Tensor
  image = np.array(image)
  image = tf.convert_to_tensor(image, dtype=tf.float32)

  # 3. Resize
  image = tf.image.resize(image, [img_height, img_width],
                          method=tf.image.ResizeMethod.NEAREST_NEIGHBOR)

  # 4. Normalize
  image = (image / 127.5) - 1

  # 5. Add batch dimension
  image = tf.expand_dims(image, axis=0)

  return image