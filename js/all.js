
  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
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

resultBtn.addEventListener('click', () => {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert('請輸入有效的身高和體重數值');
        return;
    }
    
    const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
    console.log(`Your BMI is: ${bmi}`);
});