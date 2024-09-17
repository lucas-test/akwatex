export class Drawer {
    private svgElement: SVGSVGElement;

    private pathElement: SVGPathElement;
    private isDrawing: boolean = false;
    private lastX: number = 0;
    private lastY: number = 0;

    private isPanning: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private panStartX: number = 0;
    private panStartY: number = 0;
    private panOffsetX: number = 0;
    private panOffsetY: number = 0;
    private viewBox: string = '0 0 100 100'; // Initial viewBox

    constructor(w: number, h: number){
        this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svgElement.setAttribute('width',  w.toString());
        this.svgElement.setAttribute('height', h.toString());
        this.viewBox = `0 0 ${w} ${h}`
        this.svgElement.setAttribute('viewBox', this.viewBox);
        this.svgElement.style.border = '1px solid black';
        
        document.body.appendChild(this.svgElement);

        this.addEventListeners();
    }

    private addEventListeners() {
        this.svgElement.addEventListener('mousedown', (event) => this.handleMouseDown(event));
        this.svgElement.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        this.svgElement.addEventListener('mouseup', (event) => this.handleMouseUp(event));
        this.svgElement.addEventListener('mouseleave', (event) => this.handleMouseLeave(event));
        this.svgElement.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent default context menu
    }

    private handleMouseDown(event: MouseEvent): void {
        if (event.button === 2) { // Right mouse button
            this.svgElement.style.cursor = 'grab'; // Change cursor to indicate draggable
            console.log("start panning", this.panOffsetX, this.panOffsetY)
            this.isPanning = true;
            const rect = this.svgElement.getBoundingClientRect();

            this.startX =  event.clientX - rect.left;
            this.startY =  event.clientY - rect.top;
        } else {
            this.startDrawing(event);
        }
    }

    private handleMouseMove(event: MouseEvent): void {
        if (this.isPanning) {
            console.log("edit panning")
            const rect = this.svgElement.getBoundingClientRect();
            const dx = event.clientX - rect.left - this.startX;
            const dy = event.clientY - rect.top - this.startY;


            this.viewBox = `${this.panOffsetX - dx} ${this.panOffsetY- dy} ${rect.width} ${rect.height}`;
            this.svgElement.setAttribute('viewBox', this.viewBox);


        } else {
            this.updatePath(event);
        }
    }

    private handleMouseUp(event): void {
        this.svgElement.style.cursor = 'default';
        this.isDrawing = false;

        if (this.isPanning){
            const rect = this.svgElement.getBoundingClientRect();
            const dx = event.clientX - rect.left - this.startX;
            const dy = event.clientY - rect.top - this.startY;
            this.panOffsetX -= dx;
            this.panOffsetY -= dy;
            this.isPanning = false;
        }
    }

    private handleMouseLeave(event): void {
        this.svgElement.style.cursor = 'default';
        this.isDrawing = false;

        if (this.isPanning){
            this.isPanning = false;
            const rect = this.svgElement.getBoundingClientRect();
            const dx = event.clientX - rect.left - this.startX;
            const dy = event.clientY - rect.top - this.startY;
            this.panOffsetX += dx;
            this.panOffsetY += dy;
        }
    }

    private startDrawing(event: MouseEvent): void {
        this.isDrawing = true;
        const rect = this.svgElement.getBoundingClientRect();

        this.lastX = this.panOffsetX + event.clientX - rect.left;
        this.lastY = this.panOffsetY + event.clientY - rect.top;
        this.pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.pathElement.setAttribute('d', `M${this.lastX} ${this.lastY}`);
        this.pathElement.setAttribute('stroke', 'black');
        this.pathElement.setAttribute('stroke-width', '2');
        this.pathElement.setAttribute('fill', 'none');
        this.svgElement.appendChild(this.pathElement);
    }

    private updatePath(event: MouseEvent): void {
        if (!this.isDrawing) return;

        const rect = this.svgElement.getBoundingClientRect();
        const x = this.panOffsetX + event.clientX - rect.left;
        const y = this.panOffsetY + event.clientY - rect.top;


        this.pathElement.setAttribute('d', `${this.pathElement.getAttribute('d')} L${x} ${y}`);
        this.lastX = x;
        this.lastY = y;
    }





    public drawCircle(x: number, y: number, radius: number): void {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', radius.toString());
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'black');

        this.svgElement.appendChild(circle);
    }


}