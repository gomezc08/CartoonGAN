# Memo Studio - Cartoon GAN

Allow users to turn their images into cartoon images. See full techspec here: [https://docs.google.com/document/d/1EDiuOM7pzMlwyO4g-ZQU2VtMs2yAtt-3llWDrcgQpJQ/edit?usp=sharing](https://docs.google.com/document/d/1iprGaKx4DIpROkuvtuIHND9XW9GibiCqs7uuzehG4FY/edit?usp=sharing)

## Importing Models
Download the pix2pix and cycleGAN model and add them to `backend/models` by running the following Google Colab Notebooks:
- **pix2pix_generator_model:** [Pix2Pix Model](https://colab.research.google.com/drive/1MxThv4SazSCjcm8Zc8WkA6PDHhBPJLCm?usp=sharing)
- **cycle_gan_generator_g_model:** [CycleGAN Model](https://colab.research.google.com/drive/1KO5kDbc-HDjUuEwroOFE-lf4Aiof9GaG?usp=sharing)


## Prerequisites
- Node.js: Download here: https://nodejs.org/en 
    - node -v >= 22.19.0
    - npm -v >= 11.6.0
- Python: Python 3.8+ with pip

## Installation

1. Install Node.js dependencies:
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

2. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

## Quick Start

### Run the Application

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