
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCrD_l9i_8q3XeFBwx1zxRxksgL_iXD66M",
    authDomain: "node-bmi-a4264.firebaseapp.com",
    databaseURL: "https://node-bmi-a4264-default-rtdb.firebaseio.com",
    projectId: "node-bmi-a4264",
    storageBucket: "node-bmi-a4264.firebasestorage.app",
    messagingSenderId: "149621475186",
    appId: "1:149621475186:web:83d8a566040b75c09affeb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM elements
const heightInput = document.getElementById('height_input');
const weightInput = document.getElementById('weight_input');
const resultBtn = document.getElementById('result_btn');
const resultLast = document.querySelector('.header_result_last_inner');
const resultImg = document.querySelector('.header_result_img');
const result_last = document.querySelector('.header_result_last');


// Calculate BMI and update UI
const calculateBMI = () => {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert('請輸入有效的身高和體重數值');
        return;
    }
    const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
    let resultBtn_text = '';
    let resultBtn_str = '';
    if (bmi < 18.5) {
        resultBtn_text = `過輕`;
        resultImg.classList.add('header_result_img_color_green');
        result_last.classList.add('header_result_color_green');
    } else if (bmi >= 18.5 && bmi < 24) {
        resultBtn_text = `理想`;
        resultImg.classList.add('header_result_img_color_green');
        result_last.classList.add('header_result_color_green');
    } else if (bmi >= 24 && bmi < 27) {
        resultBtn_text = `過重`;
        resultImg.classList.add('header_result_img_color_blue');
        result_last.classList.add('header_result_color_blue');
    } else if (bmi >= 27 && bmi < 30) {
        resultBtn_text = `輕度肥胖`;
        resultImg.classList.add('header_result_img_color_blue');
        result_last.classList.add('header_result_color_blue');
    } else if (bmi >= 30 && bmi < 35) {
        resultBtn_text = `中度肥胖`;
        resultImg.classList.add('header_result_img_color_orange');
        result_last.classList.add('header_result_color_orange');
    } else {
        resultBtn_text = `重度肥胖`;
        resultImg.classList.add('header_result_img_color_red');
        result_last.classList.add('header_result_color_red');
    }
    resultBtn_str = `<p>${bmi}</p>
                    <p>${resultBtn_text}</p>`;

    resultBtn.classList.add('header_result_display_none');
    result_last.classList.remove('header_result_display_none');
    resultLast.innerHTML = resultBtn_str;
    saveBMIdata(height, weight, bmi, resultBtn_text);
    heightInput.value = '';
    weightInput.value = '';
}

resultBtn.addEventListener('click', calculateBMI);
resultImg.addEventListener('click', calculateBMI);

// Save data to Firebase
const saveBMIdata = (height, weight, bmi, result) => {
    const timestamp = Date.now();
    push(ref(db, 'bmi'), {
        height: height,
        weight: weight,
        bmi: bmi,
        result: result,
        timestamp: timestamp
    }).then(() => {
        console.log('Data saved successfully');
    }).catch((error) => {
        console.error('Error saving data:', error);
    }
    );
};

// 取10筆資料
const bmiQuery = query(ref(db, 'bmi'), orderByChild('timestamp'), limitToLast(10));
onValue(bmiQuery, (snapshot) => {

    const data = snapshot.val();
    console.log(data);
    const bmiLogList = document.getElementById('bmi_log_list');
    bmiLogList.innerHTML = ''; // 清空現有內容



    // 轉換物件為陣列並反轉順序（最新的顯示在上面）
    const entries = Object.entries(data).reverse();

    entries.forEach(([key, item]) => {
        const date = new Date(item.timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        let lieght_coloer = '';
        if (item.result === '理想' || item.result === '過輕') {
            lieght_coloer = 'lieght_green';
        } else if (item.result === '過重' || item.result === '輕度肥胖') {
            lieght_coloer = 'lieght_blue';
        } else if (item.result === '中度肥胖') {
            lieght_coloer = 'lieght_orange';
        } else {
            lieght_coloer = 'lieght_red';
        }
        bmiLogList.innerHTML += `
      <ul class="${lieght_coloer}">
        <li><span>${item.result}</span></li>
        <li><span>BMI</span><span>${item.bmi}</span> </li>
        <li><span>weight</span><span>${item.weight}</span> </li>
        <li><span>height</span>${item.height}</span></li>
        <li><span>${formattedDate}</span></li>
      </ul>`;
    });
});
