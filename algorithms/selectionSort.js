window.algorithms = window.algorithms || {};

window.algorithms.selectionSort = {
    originalArray: [],
    array: [],
    bars: [],
    container: null,
    
    generateRandom: function() {
        this.originalArray = window.utils.generateArray(20, 10, 100);
    },

    init: function(container, pseudoPanel, customInputContainer) {
        this.container = container;
        container.style.flexDirection = 'row';
        container.style.alignItems = 'flex-end';
        container.style.justifyContent = 'center';
        
        customInputContainer.innerHTML = `
            <input type="text" id="custom-array" class="custom-input" placeholder="Ví dụ: 5,3,8,1,9,2">
            <button id="custom-array-btn" class="btn primary-btn" style="padding: 8px 16px;">Tạo Dữ Liệu</button>
        `;
        document.getElementById('custom-array-btn').addEventListener('click', () => {
            const val = document.getElementById('custom-array').value;
            const parsed = val.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
            if (parsed.length > 0) {
                this.originalArray = [...parsed];
                document.getElementById('reset-btn').click();
            }
        });

        if (!this.originalArray || this.originalArray.length === 0) this.generateRandom();

        pseudoPanel.innerHTML = `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    swap(arr[i], arr[minIdx]);
  }
}`;
        this.reset();
    },

    reset: function() {
        this.array = [...this.originalArray];
        this.container.innerHTML = '';
        this.bars = [];
        
        const maxVal = Math.max(...this.array);
        
        this.array.forEach(val => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${Math.max(5, (val / maxVal) * 90)}%`;
            bar.style.width = '30px';
            bar.style.margin = '0 2px';
            bar.textContent = val;
            this.container.appendChild(bar);
            this.bars.push(bar);
        });
    },

    run: async function(wait, updateStats) {
        let n = this.array.length;
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            this.bars[minIdx].classList.add('secondary'); 
            
            for (let j = i + 1; j < n; j++) {
                this.bars[j].classList.add('active'); 
                updateStats(1, 0);
                await wait();

                if (this.array[j] < this.array[minIdx]) {
                    this.bars[minIdx].classList.remove('secondary');
                    minIdx = j;
                    this.bars[minIdx].classList.add('secondary'); 
                }
                
                this.bars[j].classList.remove('active');
            }

            if (minIdx !== i) {
                let bar1 = this.bars[i];
                let bar2 = this.bars[minIdx];
                
                let temp = document.createElement('div');
                this.container.insertBefore(temp, bar1);
                this.container.insertBefore(bar1, bar2);
                this.container.insertBefore(bar2, temp);
                this.container.removeChild(temp);
                
                let tempVal = this.array[i];
                this.array[i] = this.array[minIdx];
                this.array[minIdx] = tempVal;
                
                this.bars[i] = bar2;
                this.bars[minIdx] = bar1;
                
                updateStats(0, 1);
                await wait();
            }
            
            this.bars[minIdx].classList.remove('secondary');
            this.bars[i].classList.add('done'); 
        }
        this.bars[n - 1].classList.add('done');
    }
};
