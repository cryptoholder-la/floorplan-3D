export class FloorplanView {
    constructor(container, model) {
        this.container = container;
        this.model = model;
        this.svg = d3.select(this.container).append("svg")
            .attr("width", "100%")
            .attr("height", "100%");

        this.model.subscribe(this.onModelUpdate.bind(this));
        
        this.setupInteraction();
    }
    
    setupInteraction() {
        this.isDrawing = false;
        this.startPoint = null;
        
        this.svg.on("mousedown", (event) => {
            if(this.model.currentMode !== 'wall') return;
            this.isDrawing = true;
            const [x, y] = d3.pointer(event);
            this.startPoint = { x, y };
        });
        
        this.svg.on("mousemove", (event) => {
            if (!this.isDrawing || !this.startPoint) return;
            // Could draw a preview line here
        });
        
        this.svg.on("mouseup", (event) => {
            if (!this.isDrawing) return;
            this.isDrawing = false;
            const [x, y] = d3.pointer(event);
            const endPoint = {x, y};
            this.model.addElement('wall', {start: this.startPoint, end: endPoint});
            this.startPoint = null;
        });
    }

    onModelUpdate(event, data) {
        switch (event) {
            case 'add':
                this.addElement(data);
                break;
            case 'update':
                this.updateElement(data);
                break;
            case 'remove':
                this.removeElement(data.id);
                break;
            case 'clear':
                this.svg.selectAll("*").remove();
                break;
        }
    }
    
    addElement(element) {
        if(element.type === 'wall') {
            this.svg.append('line')
                .attr('id', element.id)
                .attr('x1', element.start.x)
                .attr('y1', element.start.y)
                .attr('x2', element.end.x)
                .attr('y2', element.end.y)
                .attr('stroke', 'black')
                .attr('stroke-width', element.thickness);
        } else if (element.type === 'cabinet') {
            this.svg.append('rect')
                .attr('id', element.id)
                .attr('x', element.x - element.width / 2)
                .attr('y', element.y - element.depth / 2)
                .attr('width', element.width)
                .attr('height', element.depth)
                .attr('fill', '#aaa');
        }
    }

    updateElement(element) {
         const selection = d3.select(`#${element.id}`);
         if (selection.empty()) return;

         if (element.type === 'cabinet') {
             selection
                .attr('x', element.x - element.width / 2)
                .attr('y', element.y - element.depth / 2)
         }
    }

    removeElement(id) {
        d3.select(`#${id}`).remove();
    }
}