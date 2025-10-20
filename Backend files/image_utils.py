import numpy as np
from PIL import Image
import io
import base64

def tensor_to_image(tensor):
    """
    Convert a tensor to a PIL Image.
    
    Args:
        tensor: A tensor of shape (1, height, width, 3) with values in [-1, 1]
        
    Returns:
        PIL.Image: The converted image
    """
    # Remove the batch dimension and scale from [-1, 1] to [0, 255]
    tensor = tensor[0]  # Remove batch dimension
    tensor = (tensor + 1) * 127.5  # Scale from [-1, 1] to [0, 255]
    tensor = np.clip(tensor, 0, 255).astype(np.uint8)
    
    # Convert to PIL Image
    return Image.fromarray(tensor)

def save_image(image, path, format='PNG'):
    """
    Save a PIL image to disk.
    
    Args:
        image: PIL.Image object
        path: Path where to save the image
        format: Image format ('PNG' or 'JPEG')
    """
    image.save(path, format=format)

def image_to_base64(image, format='PNG'):
    """
    Convert a PIL image to base64 string suitable for web display.
    
    Args:
        image: PIL.Image object
        format: Image format ('PNG' or 'JPEG')
        
    Returns:
        str: Base64 encoded image with data URL prefix
    """
    buffered = io.BytesIO()
    image.save(buffered, format=format)
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return f'data:image/{format.lower()};base64,{img_str}'

def array_to_base64(array, format='PNG'):
    """
    Convert a numpy array to base64 string suitable for web display.
    
    Args:
        array: Numpy array of shape (height, width, 3) or (1, height, width, 3)
        format: Image format ('PNG' or 'JPEG')
        
    Returns:
        str: Base64 encoded image with data URL prefix
    """
    if array.ndim == 4:
        array = array[0]  # Remove batch dimension
    
    # Scale from [-1, 1] to [0, 255]
    array = (array + 1) * 127.5
    array = np.clip(array, 0, 255).astype(np.uint8)
    
    # Convert to PIL Image and then to base64
    image = Image.fromarray(array)
    return image_to_base64(image, format)