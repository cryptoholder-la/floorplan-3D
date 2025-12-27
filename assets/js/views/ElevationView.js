export class ElevationView {
    constructor(container, model) {
        this.container = container;
        this.model = model;
        this.svg = d3.select(this.container).append("svg")
            .attr("width", "100%")
            .attr("height", "100%");

        this.model.subscribe(this.onModelUpdate.bind(this));
    }

    onModelUpdate(event, data) {
         switch (event) {
            case 'add':
                this.addElement(data);
                break;
            case 'update':
                // this.updateElement(data);
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
        const height = this.svg.node().getBoundingClientRect().height;

        if (element.type === 'wall') {
            this.svg.append('rect')
                .attr('id', `${element.id}-elevation`)
                .attr('x', element.start.x)
                .attr('y', height - element.height)
                .attr('width', Math.hypot(element.end.x - element.start.x, element.end.y - element.start.y))
                .attr('height', element.height)
                .attr('fill', '#eee')
                .attr('stroke', '#ccc');
        } else if (element.type === 'cabinet') {
            this.svg.append('rect')
                .attr('id', `${element.id}-elevation`)
                .attr('x', element.x - element.width/2)
                .attr('y', height - element.height)
                .attr('width', element.width)
                .attr('height', element.height)
                .attr('fill', '#bbb');
        }
    }

    removeElement(id) {
        d3.select(`#${id}-elevation`).remove();
    }
}