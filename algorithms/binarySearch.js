window.algorithms = window.algorithms || {};

window.algorithms.binarySearch = {
    originalArray: [],
    target: 0,
    array: [],
    boxes: [],
    container: null,
    
    generateRandom: function() {
        this.originalArray = window.utils.generateArray(15, 10, 99).sort((a,b) => a - b);
        this.target = this.originalArray[Math.floor(Math.random() * this.originalArray.length)];
    },

    init: function(container, pseudoPanel, customInputContainer) {
        this.container = container;
        container.style.flexDirection = 'row';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.flexWrap = 'wrap';
        
        customInputContainer.innerHTML = `
            <input type="text" id="custom-array" class="custom-input" placeholder="Mảng (VD: 1,3,5,7,9)">
            <input type="number" id="custom-target" class="custom-input" placeholder="Số cần tìm" style="width: 120px;">
            <button id="custom-array-btn" class="btn primary-btn" style="padding: 8px 16px;">Tạo Dữ Liệu</button>
        `;
        document.getElementById('custom-array-btn').addEventListener('click', () => {
            const val = document.getElementById('custom-array').value;
            const targetVal = parseInt(document.getElementById('custom-target').value);
            
            const parsed = val.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
            if (parsed.length > 0) {
                this.originalArray = parsed.sort((a,b) => a - b);
                if (!isNaN(targetVal)) {
                    this.target = targetVal;
                } else {
                    this.target = this.originalArray[Math.floor(Math.random() * this.originalArray.length)];
                }
                document.getElementById('reset-btn').click();
            }
        });

        if (!this.originalArray || this.originalArray.length === 0) this.generateRandom();

        pseudoPanel.innerHTML = `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`;
        this.reset();
    },

    reset: function() {
        this.array = [...this.originalArray];
        this.container.innerHTML = '';
        this.boxes = [];
        
        const targetDiv = document.createElement('div');
        targetDiv.style.width = '100%';
        targetDiv.style.textAlign = 'center';
        targetDiv.style.marginBottom = '20px';
        targetDiv.style.fontSize = '1.5rem';
        targetDiv.innerHTML = `Đang tìm kiếm: <strong style="color: var(--success-color)">${this.target}</strong>`;
        this.container.appendChild(targetDiv);

        this.array.forEach(val => {
            const box = document.createElement('div');
            box.classList.add('box');
            box.style.margin = '4px';
            box.textContent = val;
            this.container.appendChild(box);
            this.boxes.push(box);
        });
    },

    run: async function(wait, updateStats) {
        let left = 0;
        let right = this.array.length - 1;
        
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            
            this.boxes[left].style.border = '4px solid var(--primary-color)';
            this.boxes[right].style.border = '4px solid var(--primary-color)';
            
            this.boxes[mid].classList.add('active');
            updateStats(1, 0);
            await wait();
            
            if (this.array[mid] === this.target) {
                this.boxes[mid].classList.replace('active', 'done');
                this.boxes[left].style.border = 'none';
                this.boxes[right].style.border = 'none';
                return;
            }
            
            if (this.array[mid] < this.target) {
                for(let i = left; i <= mid; i++) {
                    this.boxes[i].style.opacity = '0.2';
                    this.boxes[i].style.border = 'none';
                    this.boxes[i].classList.remove('active');
                }
                left = mid + 1;
            } else {
                for(let i = mid; i <= right; i++) {
                    this.boxes[i].style.opacity = '0.2';
                    this.boxes[i].style.border = 'none';
                    this.boxes[i].classList.remove('active');
                }
                right = mid - 1;
            }
            await wait();
        }
    }
};
