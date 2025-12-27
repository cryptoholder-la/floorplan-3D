/**
 * @tweakable Central configuration for the kitchen catalog.
 * This includes category structure and behavior settings.
 */
export const catalogConfig = {
    enableCategoryFiltering: true,
    autoGenerateThumbnails: true,
    enableSmartPlacement: true,
    defaultPlacementHeight: 0.5,
    categories: {
        cabinets: {
            base: ['kitchenCabinet', 'kitchenCabinetDrawer', 'kitchenCabinetCornerInner', 'kitchenCabinetCornerRound'],
            wall: ['kitchenCabinetUpper', 'kitchenCabinetUpperDouble', 'kitchenCabinetUpperLow', 'kitchenCabinetUpperCorner'],
            specialty: ['kitchenBar', 'kitchenBarEnd']
        },
        appliances: {
            major: ['kitchenFridge', 'kitchenFridgeLarge', 'kitchenFridgeSmall', 'kitchenFridgeBuiltIn', 'kitchenStove', 'kitchenStoveElectric'],
            small: ['kitchenBlender', 'kitchenCoffeeMachine', 'kitchenMicrowave', 'toaster'],
            ventilation: ['hoodLarge', 'hoodModern'],
            laundry: ['washer', 'dryer', 'washerDryerStacked']
        },
        furniture: {
            seating: ['chair', 'chairDesk', 'chairRounded', 'chairCushion', 'stoolBar', 'stoolBarSquare'],
            tables: ['table', 'tableRound', 'tableGlass', 'tableCross', 'tableCrossCloth', 'tableCloth', 'tableCoffee', 'tableCoffeeGlass', 'tableCoffeeSquare', 'tableCoffeeGlassSquare'],
            storage: ['trashcan']
        },
        architectural: {
            walls: ['wall', 'wallHalf', 'wallCorner', 'wallCornerRond'],
            openings: ['doorway', 'doorwayFront', 'doorwayOpen', 'wallDoorway', 'wallDoorwayWide', 'wallWindow', 'wallWindowSlide'],
            flooring: ['floorFull', 'floorHalf', 'floorCorner', 'floorCornerRound'],
            fixtures: ['ceilingFan']
        }
    }
};

/**
 * @tweakable Defines properties for individual catalog items,
 * such as default dimensions and placement rules.
 */
export const itemProperties = {
    kitchenCabinet: { 
        type: 'base_cabinet', 
        defaultHeight: 0.9, 
        snapToWall: true,
        category: 'cabinets'
    },
    kitchenFridge: { 
        type: 'appliance', 
        defaultHeight: 1.8, 
        snapToWall: true,
        category: 'appliances'
    },
    chair: { 
        type: 'furniture', 
        defaultHeight: 0.8, 
        snapToWall: true,
        category: 'furniture'
    },
    table: { 
        type: 'furniture', 
        defaultHeight: 0.75, 
        snapToWall: true,
        category: 'furniture'
    }
};