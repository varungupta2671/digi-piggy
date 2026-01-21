import os
from PIL import Image

def generate_icons(master_icon_path, output_dir):
    """
    Generates PWA icons from a master icon file.
    """
    if not os.path.exists(master_icon_path):
        print(f"Error: Master icon not found at {master_icon_path}")
        return

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        img = Image.open(master_icon_path)
        
        # Ensure image is RGBA
        if img.mode != 'RGBA':
            img = img.convert('RGBA')

        # Define sizes and filenames
        icons = [
            (192, "pwa-192x192.png"),
            (512, "pwa-512x512.png"),
            (180, "apple-touch-icon.png"), # Standard iOS size
        ]

        print(f"Generating icons from {master_icon_path}...")

        # Generate PNGs
        for size, filename in icons:
            out_path = os.path.join(output_dir, filename)
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            resized_img.save(out_path, "PNG")
            print(f"Created {filename} ({size}x{size})")

        # Generate Favicon (ICO) - Multi-size
        favicon_path = os.path.join(output_dir, "favicon.ico")
        img.save(favicon_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
        print("Created favicon.ico (multi-size)")
        
        print("Icon generation complete!")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Paths assuming script is run from project root or scripts/ dir
    # We'll assume run from project root for simplicity in paths
    
    # Try to find master icon in artifacts dir (where it's generated) or local root
    # Since we generate it to the artifacts dir, we need to know its path
    # OR we copy it to the root first.
    
    # Let's assume the user/process will place the master icon in the root as 'master_icon.png'
    # or we handle the move before running this.
    
    MASTER_ICON = "master_icon.png" 
    PUBLIC_DIR = "public"
    
    generate_icons(MASTER_ICON, PUBLIC_DIR)
