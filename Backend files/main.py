"""
CartoonGAN API - FastAPI backend for converting photos to cartoon-style images.
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import base64
from io import BytesIO
from PIL import Image
import numpy as np
from typing import Optional, List

from preprocess_image import preprocess_image_for_inference
from generate_images import generate_cyclic_gan_cartoon, generate_pix2pix_cartoon
from image_utils import array_to_base64

# Create FastAPI app
app = FastAPI(
    title="CartoonGAN API",
    description="API for converting photos to cartoon-style images using GAN models",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models for request/response
class Base64Image(BaseModel):
    image: str
    models: Optional[List[str]] = ["pix2pix", "cyclic_gan"]

class CartoonResponse(BaseModel):
    pix2pix_image: Optional[str] = None
    cyclic_gan_image: Optional[str] = None
    message: str

def process_base64_image(base64_string: str) -> np.ndarray:
    """Convert base64 image to preprocessed tensor."""
    try:
        # Remove data URL prefix if present
        if "base64," in base64_string:
            base64_string = base64_string.split("base64,")[1]
            
        # Decode base64 to bytes
        image_bytes = base64.b64decode(base64_string)
        image = Image.open(BytesIO(image_bytes))
        
        # Save temporarily and preprocess
        temp_path = "temp_image.jpg"
        image.save(temp_path)
        
        # Preprocess image
        preprocessed = preprocess_image_for_inference(temp_path)
        
        # Clean up
        os.remove(temp_path)
        
        return preprocessed
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {str(e)}")

def process_upload_file(file: UploadFile) -> np.ndarray:
    """Process uploaded file to preprocessed tensor."""
    try:
        # Save uploaded file temporarily
        temp_path = "temp_upload.jpg"
        with open(temp_path, "wb") as buffer:
            buffer.write(file.file.read())
        
        # Preprocess image
        preprocessed = preprocess_image_for_inference(temp_path)
        
        # Clean up
        os.remove(temp_path)
        
        return preprocessed
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing upload: {str(e)}")

@app.post("/cartoonize/base64", response_model=CartoonResponse)
async def cartoonize_base64(request: Base64Image):
    """
    Convert a base64 encoded image to cartoon style.
    
    - **image**: Base64 encoded image string (with or without data URL prefix)
    - **models**: List of models to use (default: ["pix2pix", "cyclic_gan"])
    
    Returns cartoon versions from specified models.
    """
    try:
        # Process the base64 image
        preprocessed_image = process_base64_image(request.image)
        
        response = {"message": "Success", "pix2pix_image": None, "cyclic_gan_image": None}
        
        # Defensive: ensure models is a list
        models = request.models if request.models is not None else ["pix2pix", "cyclic_gan"]
        if "pix2pix" in models:
            result = generate_pix2pix_cartoon(preprocessed_image)
            response["pix2pix_image"] = result["base64"]
        if "cyclic_gan" in models:
            result = generate_cyclic_gan_cartoon(preprocessed_image)
            response["cyclic_gan_image"] = result["base64"]
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cartoonize/upload", response_model=CartoonResponse)
async def cartoonize_upload(
    file: UploadFile = File(...),
    models: Optional[List[str]] = ["pix2pix", "cyclic_gan"]
):
    """
    Convert an uploaded image to cartoon style.
    
    - **file**: The image file to convert
    - **models**: List of models to use (default: ["pix2pix", "cyclic_gan"])
    
    Returns cartoon versions from specified models.
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
            
        # Process the uploaded file
        preprocessed_image = process_upload_file(file)
        
        response = {"message": "Success", "pix2pix_image": None, "cyclic_gan_image": None}
        
        # Defensive: ensure models is a list
        models = models if models is not None else ["pix2pix", "cyclic_gan"]
        if "pix2pix" in models:
            result = generate_pix2pix_cartoon(preprocessed_image)
            response["pix2pix_image"] = result["base64"]
        if "cyclic_gan" in models:
            result = generate_cyclic_gan_cartoon(preprocessed_image)
            response["cyclic_gan_image"] = result["base64"]
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Check if the API is running."""
    return {"status": "healthy"}





