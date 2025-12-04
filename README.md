# Memo Studio - Cartoon GAN

Allow users to turn their images into cartoon images. [See full techspec here](https://docs.google.com/document/d/1iprGaKx4DIpROkuvtuIHND9XW9GibiCqs7uuzehG4FY/edit?usp=sharing)

## Prerequisites
- Node.js: Download here: https://nodejs.org/en 
    - node -v >= 22.19.0
    - npm -v >= 11.6.0
- Python: Python 3.8+ with pip

## Installation

Install Node.js dependencies:
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

## Quick Start

### Step 1: Set Up Virtual Environment (if not already done)
Create and activate a Python virtual environment:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Then install dependencies:
```bash
pip install -r backend/requirements.txt
```

### Step 2: Download and/or Import Models
There are 2 ways to download the models used...

#### a. CLI (recommended)
Run the following command to train and save your own Pix2Pix and CycleGAN model: 

**Windows:**
```bash
python backend\gan_architecture\run_models.py
```

**macOS/Linux:**
```bash
python3 backend/gan_architecture/run_models.py
```

**Note:** If `python` doesn't work on Windows, try `py`. If `python3` doesn't work on macOS/Linux, try `python`.

#### b. Manually
Download the pix2pix and cycleGAN model and add them to `backend/models` by running the following Google Colab Notebooks:
- **pix2pix_generator_model:** [Pix2Pix Model](https://colab.research.google.com/drive/1MxThv4SazSCjcm8Zc8WkA6PDHhBPJLCm?usp=sharing)
- **cycle_gan_generator_g_model:** [CycleGAN Model](https://colab.research.google.com/drive/1KO5kDbc-HDjUuEwroOFE-lf4Aiof9GaG?usp=sharing)

### Step 3: Run the Application
The easiest way to run both frontend and backend together:

```bash
npm run dev
```

This will start:
- Frontend server on `http://localhost:5173`
- Backend API server on `http://localhost:8000`

### Alternative: Run Servers Separately

If `npm run dev` fails, you can run the servers in separate terminals:

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```