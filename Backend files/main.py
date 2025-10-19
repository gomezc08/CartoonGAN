"""
main module for the backend application. built with fastapi.
"""
import numpy as np
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional 
from preprocess_image import preprocess_image_for_inference
app = FastAPI()
#get method for description
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Pix2Pix and Cyclic GAN Image to Cartoon conversion API!"}


#pydantic Basemodel for image upload
class ImageUploadRequest(BaseModel):
    img_height: int
    img_width: int
    file: UploadFile = File(...)

@app.put("/upload-image/")
async def upload_image(request: ImageUploadRequest):
    # Preprocess the image
    preprocessed_image = preprocess_image_for_inference(
        request.file.file,
        request.img_height,
        request.img_width
    )
    # Save the preprocessed image to a file
    with open("preprocessed_image.npy", "wb") as f:
        np.save(f, preprocessed_image.numpy())
    return {"message": "Image uploaded and preprocessed successfully."}

#get method for passing the image to the model
@app.get("/generate-pix2pix-image/")
async def process_image():
    # Load the preprocessed image
    preprocessed_image = np.load("preprocessed_image.npy")
    #use  the model to process the image
    # use a placeholder for the model output
    model_output = preprocessed_image * 0.5 + 0.5  # Dummy operation to simulate model processing
    # save the output image
    with open("output_image.npy", "wb") as f:
        np.save(f, model_output)
    return {"message": "Image processed successfully."}

#generate cyclic gan image
@app.get("/generate-cyclic-gan-image/")
async def generate_cyclic_gan_image():
    # Load the preprocessed image
    preprocessed_image = np.load("preprocessed_image.npy")
    #use  the cyclic gan model to process the image
    # use a placeholder for the model output
    model_output = preprocessed_image * 0.3 + 0.7  # Dummy operation to simulate model processing
    # save the output image
    with open("output_image.npy", "wb") as f:
        np.save(f, model_output)
    return {"message": "Cyclic GAN Image processed successfully."}

#get method for retrieving the output image
@app.get("/get-output-image/")
async def get_output_image():
    # Load the output image
    output_image = np.load("output_image.npy")
    # Convert to list for JSON serialization
    output_image_list = output_image.tolist()
    return {"output_image": output_image_list}





