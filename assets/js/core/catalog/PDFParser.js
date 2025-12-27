/**
 * @tweakable Regular expressions for parsing item data from PDF text.
 */
const PARSING_REGEX = {
    // Matches item codes like B12, W36, T18, SB30 etc.
    itemCode: /(?:\b[A-Z]{1,3}\d{2,3}\b)/g,
    // Matches dimensions like 12" x 34.5" x 24" or 12 x 34.5 x 24
    dimensions: /(\d+(?:\.\d+)?)\s*"?\s*[xX]\s*"?\s*(\d+(?:\.\d+)?)\s*"?\s*[xX]\s*"?\s*(\d+(?:\.\d+)?)/,
    // Matches dimension labels
    labels: /(width|height|depth)/i
};

export class PDFParser {
    constructor() {
        /**
         * @tweakable PDF parsing settings.
         */
        this.config = {
            keywords: ['cabinet', 'drawer', 'door', 'appliance', 'base', 'wall', 'tall'],
            dimensionKeywords: ['width', 'height', 'depth'],
            // Minimum width/height for an image to be considered a thumbnail
            minImageSize: 64,
        };
    }

    async parse(pdfUrl) {
        if (!window.pdfjsLib) {
            console.error('pdf.js library is not loaded.');
            return;
        }

        try {
            const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
            const numPages = pdf.numPages;
            let allText = '';
            const images = [];
            const items = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                
                // Extract text
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                allText += pageText + '\n';

                // Extract images
                const pageImages = await this.extractImagesFromPage(page);
                images.push(...pageImages);
            }

            // Find items from text
            const foundItems = this.findItemsFromText(allText);
            items.push(...foundItems);
            
            return {
                text: allText,
                images: images,
                items: items,
                metadata: await pdf.getMetadata(),
            };

        } catch (error) {
            console.error(`Failed to parse PDF from ${pdfUrl}:`, error);
            throw error;
        }
    }

    async extractImagesFromPage(page) {
        const ops = await page.getOperatorList();
        const images = [];
        const { OPS } = pdfjsLib;

        // Find PaintImageXObject operators
        for (let i = 0; i < ops.fnArray.length; i++) {
            if (ops.fnArray[i] === OPS.paintImageXObject) {
                const objId = ops.argsArray[i][0];
                try {
                    const img = await page.objs.get(objId);
                    if (img && img.width >= this.config.minImageSize && img.height >= this.config.minImageSize) {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        
                        const imgData = ctx.createImageData(img.width, img.height);
                        
                        // Handle different color spaces
                        if (img.kind === pdfjsLib.ImageKind.RGB_24BPP) {
                            let k = 0;
                            for (let j = 0; j < img.data.length; j += 3) {
                                imgData.data[k++] = img.data[j];
                                imgData.data[k++] = img.data[j+1];
                                imgData.data[k++] = img.data[j+2];
                                imgData.data[k++] = 255;
                            }
                        } else if (img.kind === pdfjsLib.ImageKind.GRAYSCALE_8BPP) {
                             let k = 0;
                            for (let j = 0; j < img.data.length; j++) {
                                const val = img.data[j];
                                imgData.data[k++] = val;
                                imgData.data[k++] = val;
                                imgData.data[k++] = val;
                                imgData.data[k++] = 255;
                            }
                        } else {
                            // Handle other color spaces with fallback
                            let k = 0;
                            for (let j = 0; j < img.data.length; j++) {
                                const val = img.data[j] || 128;
                                imgData.data[k++] = val;
                                imgData.data[k++] = val;
                                imgData.data[k++] = val;
                                imgData.data[k++] = 255;
                            }
                        }

                        ctx.putImageData(imgData, 0, 0);
                        images.push({
                            id: objId,
                            url: canvas.toDataURL(),
                            width: img.width,
                            height: img.height,
                        });
                    }
                } catch (e) {
                    console.warn(`Could not get image ${objId}`, e);
                }
            }
        }
        return images;
    }

    findItemsFromText(text) {
        const items = [];
        const lines = text.split('\n');

        /**
         * @tweakable Regex for finding item codes in PDF text.
         */
        const itemCodeRegex = new RegExp(PARSING_REGEX.itemCode);

        lines.forEach(line => {
            const matches = line.match(itemCodeRegex);
            if (matches) {
                matches.forEach(match => {
                    const item = {
                        name: match,
                        dimensions: this.extractDimensionsFromLine(line),
                        description: line,
                    };
                    if (item.dimensions) {
                        items.push(item);
                    }
                });
            }
        });
        return items;
    }
    
    extractDimensionsFromLine(line) {
         /**
         * @tweakable Regex for finding dimensions (e.g., "12 x 34.5 x 24").
         */
        const dimensionRegex = new RegExp(PARSING_REGEX.dimensions);
        const match = line.match(dimensionRegex);

        if (match) {
            return {
                width: parseFloat(match[1]),
                height: parseFloat(match[2]),
                depth: parseFloat(match[3]),
            };
        }
        return null;
    }
}