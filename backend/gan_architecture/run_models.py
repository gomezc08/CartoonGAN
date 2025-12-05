import os
import sys

# Add the backend directory to Python path
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Set environment variables before importing TensorFlow
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress INFO and WARNING messages

def main():
    print("Running cyclegan model...")
    # Import and run the cyclegan module
    import importlib.util
    cyclegan_path = os.path.join(os.path.dirname(__file__), 'models', 'cyclegan.py')
    spec = importlib.util.spec_from_file_location("cyclegan", cyclegan_path)
    cyclegan = importlib.util.module_from_spec(spec)
    sys.modules["cyclegan"] = cyclegan
    spec.loader.exec_module(cyclegan)
    
    print("\nRunning pix2pix model...")
    # Import and run the pix2pix module
    pix2pix_path = os.path.join(os.path.dirname(__file__), 'models', 'pix2pix.py')
    spec = importlib.util.spec_from_file_location("pix2pix", pix2pix_path)
    pix2pix = importlib.util.module_from_spec(spec)
    sys.modules["pix2pix"] = pix2pix
    spec.loader.exec_module(pix2pix)
    
    print("\nModel training completed!")

if __name__ == "__main__":
    main()