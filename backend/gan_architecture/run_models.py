def main():
    print("Running cyclegan model...")
    with open('./backend/gan_architecture/models/cyclegan.py', 'r') as f:
        code = f.read()
    exec(code)

    print("Running pix2pix model...")
    with open('./backend/gan_architecture/models/pix2pix.py', 'r') as f:
        code = f.read()
    exec(code)

if __name__ == "__main__":
    main()