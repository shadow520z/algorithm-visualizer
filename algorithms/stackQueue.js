window.algorithms = window.algorithms || {};

window.algorithms.stackQueue = {
    boxes: [],
    
    init: function(container, pseudoPanel) {
        container.innerHTML = '';
        container.style.flexDirection = 'row';
        container.style.alignItems = 'flex-start';
        container.style.justifyContent = 'space-around';
        container.style.width = '100%';
        
        // Stack Container
        const stackWrapper = document.createElement('div');
        stackWrapper.style.display = 'flex';
        stackWrapper.style.flexDirection = 'column';
        stackWrapper.style.alignItems = 'center';
        
        const stackLabel = document.createElement('h3');
        stackLabel.textContent = 'Stack (LIFO)';
        stackLabel.style.marginBottom = '10px';
        stackWrapper.appendChild(stackLabel);
        
        const stackDiv = document.createElement('div');
        stackDiv.id = 'stack-container';
        stackDiv.style.display = 'flex';
        stackDiv.style.flexDirection = 'column-reverse'; // Stack pushes to top visually
        stackDiv.style.border = '3px solid var(--glass-border)';
        stackDiv.style.borderTop = 'none';
        stackDiv.style.minHeight = '300px';
        stackDiv.style.width = '120px';
        stackDiv.style.padding = '10px';
        stackDiv.style.gap = '5px';
        stackWrapper.appendChild(stackDiv);
        
        // Queue Container
        const queueWrapper = document.createElement('div');
        queueWrapper.style.display = 'flex';
        queueWrapper.style.flexDirection = 'column';
        queueWrapper.style.alignItems = 'center';
        
        const queueLabel = document.createElement('h3');
        queueLabel.textContent = 'Queue (FIFO)';
        queueLabel.style.marginBottom = '10px';
        queueWrapper.appendChild(queueLabel);
        
        const queueDiv = document.createElement('div');
        queueDiv.id = 'queue-container';
        queueDiv.style.display = 'flex';
        queueDiv.style.flexDirection = 'row'; // Queue flows left to right
        queueDiv.style.border = '3px solid var(--glass-border)';
        queueDiv.style.borderRight = 'none';
        queueDiv.style.borderLeft = 'none';
        queueDiv.style.minWidth = '300px';
        queueDiv.style.height = '120px';
        queueDiv.style.padding = '10px';
        queueDiv.style.gap = '5px';
        queueDiv.style.alignItems = 'center';
        queueWrapper.appendChild(queueDiv);
        
        container.appendChild(stackWrapper);
        container.appendChild(queueWrapper);

        this.stackDiv = stackDiv;
        this.queueDiv = queueDiv;
        this.stackBoxes = [];
        this.queueBoxes = [];

        pseudoPanel.innerHTML = `// Auto Visualizing Stack & Queue
// Stack
stack.push(val);
stack.pop();

// Queue
queue.enqueue(val);
queue.dequeue();`;
    },

    run: async function(wait, updateStats) {
        // We will animate simultaneous push/enqueue and pop/dequeue
        const values = [10, 20, 30, 40, 50];
        
        // Push / Enqueue
        for (let val of values) {
            // Stack Push
            const sBox = document.createElement('div');
            sBox.classList.add('box', 'active');
            sBox.style.width = '100%';
            sBox.textContent = val;
            this.stackDiv.appendChild(sBox);
            this.stackBoxes.push(sBox);
            
            // Queue Enqueue
            const qBox = document.createElement('div');
            qBox.classList.add('box', 'secondary');
            qBox.textContent = val;
            this.queueDiv.appendChild(qBox);
            this.queueBoxes.push(qBox);
            
            updateStats(0, 2);
            await wait();
            
            sBox.classList.remove('active');
            sBox.classList.add('done');
            qBox.classList.remove('secondary');
            qBox.classList.add('done');
            await wait();
        }
        
        // Pop / Dequeue
        for (let i = 0; i < 3; i++) {
            // Stack Pop (LIFO - from end of array, which is top of column-reverse)
            if (this.stackBoxes.length > 0) {
                const sBox = this.stackBoxes.pop();
                sBox.classList.remove('done');
                sBox.classList.add('active');
            }
            
            // Queue Dequeue (FIFO - from start of array, which is left of row)
            if (this.queueBoxes.length > 0) {
                const qBox = this.queueBoxes.shift();
                qBox.classList.remove('done');
                qBox.classList.add('secondary');
            }
            
            updateStats(0, 2);
            await wait();
            
            if (this.stackDiv.lastChild) this.stackDiv.removeChild(this.stackDiv.lastChild);
            if (this.queueDiv.firstChild) this.queueDiv.removeChild(this.queueDiv.firstChild);
            
            await wait();
        }
    }
};
