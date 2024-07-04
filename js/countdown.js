/*document.addEventListener("DOMContentLoaded", function () {
  let timerDisplay = document.getElementById('countdown-timer');
  let editButton = document.createElement('button');
  editButton.innerText = "編輯";
  timerDisplay.appendChild(editButton);

  editButton.addEventListener('click', function () {
      createEditPopup();
  });

  // 函數：創建編輯彈出框
  function createEditPopup() {
      let popup = document.createElement('div');
      popup.classList.add('popup');
      let inputLabel = document.createElement('label');
      inputLabel.innerText = "輸入數字：";
      let inputNumber = document.createElement('input');
      inputNumber.type = "number";
      let confirmButton = document.createElement('button');
      confirmButton.innerText = "確認";
      let combinationsContainer = document.createElement('div');
      combinationsContainer.classList.add('combinations');

      confirmButton.addEventListener('click', function () {
          combinationsContainer.innerHTML = '';
          let number = parseInt(inputNumber.value);
          if (!isNaN(number) && number > 0) {
              for (let i = 1; i <= number; i++) {
                  let combination = document.createElement('div');
                  combination.classList.add('combination');
                  combination.innerHTML = `
                      <div>讀書時間：<input class="study-time" type="number"> 分鐘</div>
                      <div>休息時間：<input class="break-time" type="number"> 分鐘</div>
                      <div>備註：<input class="remark" type="text" placeholder="備註內容"></div>
                      <hr>
                  `;
                  combinationsContainer.appendChild(combination);
              }
          } else {
              combinationsContainer.innerHTML = '<p>請輸入有效的數字。</p>';
          }
          popup.appendChild(combinationsContainer);
          popup.appendChild(settingsButton);
          timerDisplay.appendChild(popup); // 將彈出框內容添加到 timerDisplay 中
          timerDisplay.appendChild(editButton); // 確保編輯按鈕仍在最後一行添加
      });

      let settingsButton = document.createElement('button');
      settingsButton.innerText = "設定";

      settingsButton.addEventListener('click', function () {
          let studyInputs = document.querySelectorAll('.study-time');
          let breakInputs = document.querySelectorAll('.break-time');
          let remarkInputs = document.querySelectorAll('.remark');

          let combinations = [];
          studyInputs.forEach(function (studyInput, index) {
              let studyTime = parseInt(studyInput.value);
              let breakTime = parseInt(breakInputs[index].value);
              let remark = remarkInputs[index].value;
              combinations.push({ studyTime, breakTime, remark });
          });

          startCountdown(combinations.length, combinations);
      });

      popup.appendChild(inputLabel);
      popup.appendChild(inputNumber);
      popup.appendChild(confirmButton);
      timerDisplay.appendChild(popup);
  }

  // 函數：初始化和啟動倒數計時器
  function startCountdown(rounds, combinations) {
      let currentRound = 1;
      let totalRounds = rounds;
      let ii=1;

      function countdownLoop() {
          if (currentRound <= totalRounds) {
              let minutes, seconds;
              if (currentRound % 2 === 1) {
                  minutes = combinations[currentRound - 1].studyTime;
                  seconds = 0;
                  updateDisplay('study', currentRound, totalRounds - currentRound);
              } else {
                  minutes = combinations[currentRound -1].breakTime;
                  seconds = 0;
                  updateDisplay('break', currentRound, totalRounds - currentRound);
              }

              let intervalId = setInterval(function () {
                  if (seconds > 0) {
                      seconds--;
                  } else {
                      if (minutes > 0) {
                          seconds = 59;
                          minutes--;
                      } else {
                          clearInterval(intervalId);
                          if(ii==1){
                            ii++;
                          }
                          else{
                            ii=1;
                            currentRound++;
                          }
                          countdownLoop();
                      }
                  }
                  let countdownDisplay = document.getElementById('countdown');
                  countdownDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
              }, 1000);
          }
      }

      // 函數：更新倒數計時器顯示
      function updateDisplay(type, current, remaining) {
          let typeText = type === 'study' ? '讀書' : '休息';
          timerDisplay.innerHTML = `
              <div id="current-round">目前為${typeText}第 ${current} 次（剩餘 ${remaining} 次）</div>
              <div id="countdown">00:00</div>
          `;
      }

      countdownLoop();
  }
});


let studyTime = 60 *60; // 學習時間設置為 10 秒
let currentLoop = 1;
let repetitions = 1;
let timerInterval;

// 在頁面載入時恢復狀態
document.addEventListener("DOMContentLoaded", function() {
    // 恢復重複次數
    let savedRepetitions = localStorage.getItem("repetitions");
    if (savedRepetitions) {
        document.getElementById("repetitions").value = savedRepetitions;
    }

    // 恢復自訂內容和勾選狀態
    let savedContent = localStorage.getItem("content");
    if (savedContent) {
        document.getElementById("contentTable").innerHTML = savedContent;
        
        // 恢復勾選狀態
        let table = document.getElementById("contentTable");
        for (let row of table.rows) {
            let checkbox = row.cells[0].querySelector("input[type='checkbox']");
            let isChecked = localStorage.getItem(row.rowIndex); // 使用行索引作為鍵名
            if (isChecked === "true") {
                checkbox.checked = true;
            }
        }
    }

    // 添加刪除按鈕的事件委派
    document.getElementById("contentTable").addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-btn")) {
            deleteRow(event.target);
        }
    });
    
    // 添加勾選框的事件委派
    document.getElementById("contentTable").addEventListener("change", function(event) {
        if (event.target.type === "checkbox") {
            saveCheckState(event.target);
        }
    });
});

function startTimer() {
    repetitions = parseInt(document.getElementById("repetitions").value);
    currentLoop = 1;
    updateTimer(); // 立即更新計時器顯示
    timerInterval = setInterval(updateTimer, 1000); // 每秒更新一次

    // 保存重複次數到本地存儲
    localStorage.setItem("repetitions", repetitions);
}

function updateTimer() {
    let timeLeft = studyTime;
    let phase = timeLeft <= 10*60 ? "休息" : "學習";

    let seconds = timeLeft;

    document.getElementById("phase").innerText = `${phase} (${currentLoop}/${repetitions})`;

    if (timeLeft <= 0) {
        currentLoop++;
        if (currentLoop <= repetitions) {
            studyTime = 60 *60; // 重置學習時間為 10 秒
        }
        updateTimer(); // 立即更新計時器顯示
    } else {
        if (studyTime > 10*60) {
            seconds = studyTime - 10*60;
        }
        document.getElementById("timer").innerText = `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
        timeLeft--;
        studyTime = timeLeft;
    }

    // 如果迴圈完成，清除計時器
    if (currentLoop > repetitions) {
        clearInterval(timerInterval);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById("phase").innerText = "";
    document.getElementById("timer").innerText = "--";
}

function saveCustomContent() {
    let customInput = document.getElementById("customInput").value.trim();
    if (customInput === "") {
        alert("請輸入內容後再儲存。");
        return;
    }

    let table = document.getElementById("contentTable");
    let row = table.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2); // 新增的刪除按鈕列
    cell1.innerHTML = `<input type="checkbox" class="delete-checkbox">`;
    cell2.textContent = customInput;
    cell3.innerHTML = `<button class="delete-btn">刪除</button>`; // 新增刪除按鈕

    // 清空輸入框
    document.getElementById("customInput").value = "";

    // 保存自訂內容到本地存儲
    localStorage.setItem("content", table.innerHTML);
}

function deleteRow(btn) {
    let row = btn.closest("tr");
    row.remove();

    // 保存自訂內容到本地存儲
    let table = document.getElementById("contentTable");
    localStorage.setItem("content", table.innerHTML);
}

function saveCheckState(checkbox) {
    let row = checkbox.closest("tr");
    localStorage.setItem(row.rowIndex, checkbox.checked);
}

function saveContent() {
    let table = document.getElementById("contentTable");
    let content = [];
    for (let row of table.rows) {
        let checkbox = row.cells[0].querySelector("input[type='checkbox']");
        let text = row.cells[1].textContent.trim();
        if (checkbox.checked && text !== "") {
            content.push(text);
        }
    }
    // 在這裡您可以保存 'content' 數組或根據需要進行處理
    console.log("已儲存的內容:", content);
    
    // 保存自訂內容到本地存儲
    localStorage.setItem("content", table.innerHTML);
}
*/



let studyTime = 60 * 60; // 學習時間設置為 60 分鐘
let currentLoop = 1;
let repetitions = 1;
let timerInterval;

// 在頁面載入時恢復狀態
document.addEventListener("DOMContentLoaded", function() {
    // 恢復重複次數
    let savedRepetitions = localStorage.getItem("repetitions");
    if (savedRepetitions) {
        repetitions = parseInt(savedRepetitions);
        document.getElementById("repetitions").value = repetitions;
    }

    // 恢復當前迴圈數
    let savedCurrentLoop = localStorage.getItem("currentLoop");
    if (savedCurrentLoop) {
        currentLoop = parseInt(savedCurrentLoop);
    }

    // 恢復剩餘時間
    let savedStudyTime = localStorage.getItem("studyTime");
    if (savedStudyTime) {
        studyTime = parseInt(savedStudyTime);
    }

    // 恢復自訂內容和勾選狀態
    let savedContent = localStorage.getItem("content");
    if (savedContent) {
        document.getElementById("contentTable").innerHTML = savedContent;
        
        // 恢復勾選狀態
        let table = document.getElementById("contentTable");
        for (let row of table.rows) {
            let checkbox = row.cells[0].querySelector("input[type='checkbox']");
            let isChecked = localStorage.getItem(row.rowIndex); // 使用行索引作為鍵名
            if (isChecked === "true") {
                checkbox.checked = true;
            }
        }
    }

    // 添加刪除按鈕的事件委派
    document.getElementById("contentTable").addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-btn")) {
            deleteRow(event.target);
        }
    });
    
    // 添加勾選框的事件委派
    document.getElementById("contentTable").addEventListener("change", function(event) {
        if (event.target.type === "checkbox") {
            saveCheckState(event.target);
        }
    });

    // 如果存在保存的計時器狀態，恢復計時器
    if (savedCurrentLoop && savedStudyTime) {
        updateTimer(); // 立即更新計時器顯示
        timerInterval = setInterval(updateTimer, 1000); // 每秒更新一次
    }
});

function startTimer() {
    repetitions = parseInt(document.getElementById("repetitions").value);
    currentLoop = 1;
    studyTime = 60 * 60; // 重置學習時間為 60 分鐘
    updateTimer(); // 立即更新計時器顯示
    timerInterval = setInterval(updateTimer, 1000); // 每秒更新一次

    // 保存重複次數和當前迴圈數到本地存儲
    localStorage.setItem("repetitions", repetitions);
    localStorage.setItem("currentLoop", currentLoop);
    localStorage.setItem("studyTime", studyTime);
}

function updateTimer() {
    let timeLeft = studyTime;
    let phase = timeLeft <= 10 * 60 ? "休息" : "學習";

    let seconds = timeLeft;

    document.getElementById("phase").innerText = `${phase} (${currentLoop}/${repetitions})`;

    if (timeLeft <= 0) {
        currentLoop++;
        if (currentLoop <= repetitions) {
            studyTime = 60 * 60; // 重置學習時間為 60 分鐘
        }
        updateTimer(); // 立即更新計時器顯示
    } else {
        if (studyTime > 10 * 60) {
            seconds = studyTime - 10 * 60;
        }
        document.getElementById("timer").innerText = `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
        timeLeft--;
        studyTime = timeLeft;
        // 保存剩餘時間和當前迴圈數到本地存儲
        localStorage.setItem("studyTime", studyTime);
        localStorage.setItem("currentLoop", currentLoop);
    }

    // 如果迴圈完成，清除計時器
    if (currentLoop > repetitions) {
        clearInterval(timerInterval);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById("phase").innerText = "";
    document.getElementById("timer").innerText = "--";
    localStorage.removeItem("studyTime");
    localStorage.removeItem("currentLoop");
}

function saveCustomContent() {
    let customInput = document.getElementById("customInput").value.trim();
    if (customInput === "") {
        alert("請輸入內容後再儲存。");
        return;
    }

    let table = document.getElementById("contentTable");
    let row = table.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2); // 新增的刪除按鈕列
    cell1.innerHTML = `<input type="checkbox" class="delete-checkbox">`;
    cell2.textContent = customInput;
    cell3.innerHTML = `<button class="delete-btn">刪除</button>`; // 新增刪除按鈕

    // 清空輸入框
    document.getElementById("customInput").value = "";

    // 保存自訂內容到本地存儲
    localStorage.setItem("content", table.innerHTML);
}

function deleteRow(btn) {
    let row = btn.closest("tr");
    row.remove();

    // 保存自訂內容到本地存儲
    let table = document.getElementById("contentTable");
    localStorage.setItem("content", table.innerHTML);
}

function saveCheckState(checkbox) {
    let row = checkbox.closest("tr");
    localStorage.setItem(row.rowIndex, checkbox.checked);
}

function saveContent() {
    let table = document.getElementById("contentTable");
    let content = [];
    for (let row of table.rows) {
        let checkbox = row.cells[0].querySelector("input[type='checkbox']");
        let text = row.cells[1].textContent.trim();
        if (checkbox.checked && text !== "") {
            content.push(text);
        }
    }
    // 在這裡您可以保存 'content' 數組或根據需要進行處理
    console.log("已儲存的內容:", content);
    
    // 保存自訂內容到本地存儲
    localStorage.setItem("content", table.innerHTML);
}
