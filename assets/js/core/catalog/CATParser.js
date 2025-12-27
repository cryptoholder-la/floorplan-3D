/**
 * @tweakable Regular expressions for parsing .cat file content.
 */
const CAT_PARSING_REGEX = {
    itemBlock: /\[ITEM\]\n([\s\S]*?)(?=\n\[ITEM\]|\n*$)/g,
    keyValue: /^([A-Z_]+)=(.*)$/gm,
};

export class CATParser {
    constructor() {
        /**
         * @tweakable Configuration for the CAT file parser.
         * Defines how to map .cat file keys to our internal item object properties.
         */
        this.config = {
            keyMapping: {
                'ID': 'id',
                'NAME': 'name',
                'MODEL': 'modelPath',
                'TYPE': 'type',
                'WIDTH': 'width',
                'HEIGHT': 'height',
                'DEPTH': 'depth',
                'DESCRIPTION': 'description',
                'THUMBNAIL': 'thumbnail'
            },
            numericFields: ['width', 'height', 'depth']
        };
    }

    async parse(catUrl) {
        try {
            const response = await fetch(catUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch CAT file: ${response.statusText}`);
            }
            const text = await response.text();
            return this.parseText(text);
        } catch (error) {
            console.error(`Error parsing CAT file from ${catUrl}:`, error);
            throw error;
        }
    }

    parseText(text) {
        const items = [];
        const itemBlocks = text.matchAll(CAT_PARSING_REGEX.itemBlock);

        for (const blockMatch of itemBlocks) {
            const itemBlockText = blockMatch[1];
            const itemData = {};
            const keyValues = itemBlockText.matchAll(CAT_PARSING_REGEX.keyValue);

            for (const kvMatch of keyValues) {
                const key = kvMatch[1].trim();
                const value = kvMatch[2].trim();
                
                if (this.config.keyMapping[key]) {
                    const mappedKey = this.config.keyMapping[key];
                    if (this.config.numericFields.includes(mappedKey)) {
                        itemData[mappedKey] = parseFloat(value);
                    } else {
                        itemData[mappedKey] = value;
                    }
                }
            }
            
            if (itemData.id) {
                items.push(itemData);
            }
        }
        
        return { items };
    }
}