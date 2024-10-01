import katex from "katex";


/*

div
content editable

*/


export class LatexZone {
    div: HTMLDivElement;
    parentDiv: HTMLElement;

    constructor(parentDiv: HTMLElement){
        this.parentDiv = parentDiv;
        this.div = document.createElement("div");
        this.div.classList.add("latex-code");
        // this.div.style.cssText = 'display:inline-block;height:100%;background-color:red;';
        this.div.contentEditable = 'true'; 

        console.log("yo")
        this.div.addEventListener('keydown', this.handleKeyDown.bind(this));

        parentDiv.appendChild(this.div);
        const selection = window.getSelection();
        if (selection){
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.setStart(this.div, 0);
            newRange.collapse(true);
            selection.addRange(newRange);
        }
        
        
        this.div.focus();
    }

    private processLaTeXContent(): void {
        console.log("process latex")
        if (this.div.textContent){
            const latexStr = katex.renderToString(this.div.textContent);
            document.body.innerHTML += latexStr
        }
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const pressedKey = event.key;
        console.log("yaaaabbbbbbbbbbaa")

        try {
            if (this.div.textContent) katex.renderToString(this.div.textContent);
            this.div.style.backgroundColor = "grey";
        }catch(error){
            this.div.style.backgroundColor = "red";
        }

        if (pressedKey === '$') {
            console.log("End LatexZone")
            event.preventDefault(); // Prevent default behavior of '$'
            this.div.style.backgroundColor = "gray";
            this.processLaTeXContent();

            this.moveCaretToEndOfElement()
        }
    }


    private moveCaretToEndOfElement() {
        const range = document.createRange();
        const sel = window.getSelection();
        if (sel){
            range.setStart(this.parentDiv, this.parentDiv.childNodes.length);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
        
    }
    
}





export class Editor {
    private div: HTMLDivElement;
    private editorContent: string = '';
    private selectionStart: number = 0;
    private selectionEnd: number = 0;


    constructor(){
        this.div = document.createElement("div");
        document.body.appendChild(this.div);
        this.div.contentEditable = "true";
        this.focusEditor();
        this.div.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const pressedKey = event.key;

        if (pressedKey === '$') {
            this.insertRedSquareAtCursor();
            event.preventDefault(); // Prevent default behavior of '$'
        }
    }

    private handleInput(): void {
        this.selectionStart = this.div.selectionStart || 0;
        this.selectionEnd = this.div.selectionEnd || 0;
    }

    private insertRedSquareAtCursor(): void {
        const range = document.createRange();
        const selection = window.getSelection();
        console.log(selection);

        if (selection && selection.rangeCount > 0) {
            const lol = selection.anchorNode;
            console.log(lol)
            if (lol){
                if (lol.nodeType == Node.TEXT_NODE){
                    const textContent = lol.textContent;
                    const textBefore = textContent.slice(0, selection.anchorOffset);
                    const textAfter = textContent.slice(selection.anchorOffset);
                    
                    // Create the span
                    const square = document.createElement("div");

                    square.style.cssText = 'display:inline-block;width:30px;height:100%;background-color:red;';
                    square.textContent = 'gggggggggg';
                    square.contentEditable = 'true'; // Make the span editable
                    
                    this.div.appendChild(square);
                    
                    square.focus();
                } else {
                    console.log("no text")
                    const z = new LatexZone(this.div);
                }
                
            }

            // const range = selection.getRangeAt(0);
            // const textNode = range.startContainer.childNodes[range.startOffset];
            // let newNode: HTMLSpanElement | null = null;

            // if (textNode.nodeType === Node.TEXT_NODE) {
            //     newNode = document.createElement('span');
            //     newNode.style.cssText = 'display:inline-block;width:5px;height:5px;background-color:red;';
            //     newNode.textContent = '$'; // You can change this to any other character
            // } else if (textNode instanceof HTMLElement) {
            //     newNode = document.createElement('span');
            //     newNode.style.cssText = 'display:inline-block;width:5px;height:5px;background-color:red;';
            //     newNode.textContent = '$'; // You can change this to any other character
            // } else {
            //     console.error('Invalid node type');
            //     return;
            // }

            // range.deleteContents();
            // range.insertNode(newNode);
            // range.setStartAfter(newNode);
            // selection.removeAllRanges();
            // selection.addRange(range);
        }
    }


    private focusEditor(): void {
        setTimeout(() => {
            this.div.focus();
        }, 0);
    }

}