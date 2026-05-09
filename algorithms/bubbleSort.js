window.algorithms = window.algorithms || {};

window.algorithms.bubbleSort = {
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

        pseudoPanel.innerHTML = `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j+1]) {
        swap(arr[j], arr[j+1]);
      }
    }
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
            for (let j = 0; j < n - i - 1; j++) {
                this.bars[j].classList.add('active');
                this.bars[j+1].classList.add('active');
                updateStats(1, 0);
                await wait();

                if (this.array[j] > this.array[j+1]) {
                    this.bars[j].classList.replace('active', 'secondary');
                    this.bars[j+1].classList.replace('active', 'secondary');
                    await wait();

                    let bar1 = this.bars[j];
                    let bar2 = this.bars[j+1];
                    this.container.insertBefore(bar2, bar1);
                    
                    let tempVal = this.array[j];
                    this.array[j] = this.array[j+1];
                    this.array[j+1] = tempVal;
                    
                    this.bars[j] = bar2;
                    this.bars[j+1] = bar1;
                    
                    updateStats(0, 1);
                    await wait();
                }
                this.bars[j].classList.remove('active', 'secondary');
                this.bars[j+1].classList.remove('active', 'secondary');
            }
            this.bars[n - i - 1].classList.add('done');
        }
        this.bars[0].classList.add('done');
    }
};
