import Image from "next/image";

export function GeneratedImage({ imageUrl }) {
    const handleDownload = async () => {
        try {
            // Try to fetch with CORS handling first
            const response = await fetch(imageUrl, {
                mode: 'cors',
                headers: {
                    'Origin': window.location.origin
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `generated-image-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading image:', error);
            // Fallback: open image in new tab if direct download fails
            try {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.target = '_blank';
                link.download = `generated-image-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                link.remove();
            } catch (fallbackError) {
                console.error('Fallback download also failed:', fallbackError);
                // Last resort: open in new window
                window.open(imageUrl, '_blank');
            }
        }
    };

    return (
        <div className="relative rounded-lg group">
            <Image
                src={imageUrl}
                alt="Generated Image"
                width={300}
                height={300}
                className="max-w-full h-auto object-contain rounded-lg"
            />
            <button
                onClick={handleDownload}
                className="absolute bottom-2 left-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
                title="Download image"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
            </button>
        </div>
    )
}