window.algorithms = window.algorithms || {};

window.algorithms.graph = {
    nodes: [],
    edges: [],
    adjList: {},
    container: null,
    
    generateRandom: function() {},

    init: function(container, pseudoPanel, customInputContainer) {
        this.container = container;
        container.style.position = 'relative';
        customInputContainer.innerHTML = ''; // No custom input for graph yet
        
        pseudoPanel.innerHTML = `// Duyệt Đồ Thị (BFS)
function BFS(startNode) {
  let queue = [startNode];
  let visited = new Set([startNode]);
  
  while (queue.length > 0) {
    let curr = queue.shift();
    for (let neighbor of adjList[curr]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`;
        this.reset();
    },

    reset: function() {
        this.container.innerHTML = '';
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 400;
        
        const graphData = {
            0: { x: width * 0.2, y: height * 0.2, neighbors: [1, 2] },
            1: { x: width * 0.5, y: height * 0.1, neighbors: [0, 3, 4] },
            2: { x: width * 0.2, y: height * 0.6, neighbors: [0, 5] },
            3: { x: width * 0.8, y: height * 0.2, neighbors: [1] },
            4: { x: width * 0.5, y: height * 0.5, neighbors: [1, 5] },
            5: { x: width * 0.8, y: height * 0.7, neighbors: [2, 4] }
        };
        this.adjList = graphData;
        this.nodes = [];
        this.edges = [];
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.zIndex = '1';
        this.container.appendChild(svg);
        this.svg = svg;

        const drawnEdges = new Set();
        for (let u in graphData) {
            graphData[u].neighbors.forEach(v => {
                const edgeKey = u < v ? `${u}-${v}` : `${v}-${u}`;
                if (!drawnEdges.has(edgeKey)) {
                    drawnEdges.add(edgeKey);
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', graphData[u].x + 23); // +23 for center of 46px node
                    line.setAttribute('y1', graphData[u].y + 23);
                    line.setAttribute('x2', graphData[v].x + 23);
                    line.setAttribute('y2', graphData[v].y + 23);
                    line.setAttribute('stroke', 'var(--glass-border)');
                    line.setAttribute('stroke-width', '4');
                    svg.appendChild(line);
                    this.edges.push({u: parseInt(u), v, el: line});
                }
            });
        }

        for (let u in graphData) {
            const node = document.createElement('div');
            node.classList.add('graph-node');
            node.textContent = u;
            node.style.left = `${graphData[u].x}px`;
            node.style.top = `${graphData[u].y}px`;
            this.container.appendChild(node);
            this.nodes[u] = node;
        }
    },

    run: async function(wait, updateStats) {
        const startNode = 0;
        let queue = [startNode];
        let visited = new Set([startNode]);
        
        this.nodes[startNode].classList.add('active');
        updateStats(1, 0);
        await wait();
        this.nodes[startNode].classList.replace('active', 'visited');
        
        while (queue.length > 0) {
            let curr = queue.shift();
            
            for (let neighbor of this.adjList[curr].neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                    
                    const edge = this.edges.find(e => (e.u === curr && e.v === neighbor) || (e.v === curr && e.u === neighbor));
                    if (edge) {
                        edge.el.setAttribute('stroke', 'var(--success-color)');
                        edge.el.style.transition = "stroke 0.3s";
                    }
                    
                    this.nodes[neighbor].classList.add('active');
                    updateStats(1, 0);
                    await wait();
                    
                    this.nodes[neighbor].classList.replace('active', 'visited');
                }
            }
        }
    }
};
