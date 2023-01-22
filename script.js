
const url="https://api.npoint.io/38edf0c5f3eb9ac768bd"

let loginForm = document.getElementById('login_form')
let registerForm = document.getElementById('registration_form')
let root = document.querySelector(":root");
let loginButton = document.getElementById('login_button')
let registerButton = document.getElementById('register_button')
let logoutButton = document.getElementById('logout_button')

const getData = async (url)=>{
    const res = await fetch(url)
    if(!res.ok){
        throw new Error(`Error ${url}`)
    }
    return await res.json()
}

function confirmEmail() {
    let registerEmail = document.getElementById("register_email").value
    let emailConfirm = document.getElementById("email_confirm").value
    let emailConfirmElem = document.getElementById("email_confirm")
    if(registerEmail != emailConfirm) {
        emailConfirmElem.setCustomValidity("Email nie pasuje");
        root.style.setProperty("--pseudo-text", `"Email nie pasuje"`);
    }
    else{
        emailConfirmElem.setCustomValidity('');
        root.style.setProperty("--pseudo-text", `""`)}
}

function register(form){
    form.addEventListener('submit', (e) => {  
        let registerName = document.getElementById("register_name").value 
        let password = document.getElementById("register_password").value
        let email = document.getElementById("register_email").value
        let emailConfirm = document.getElementById("email_confirm").value
        e.preventDefault(); 
        let userRecords = []
        userRecords = JSON.parse(localStorage.getItem('users'))?JSON.parse(localStorage.getItem('users')):[]
        if(userRecords.some((item) => {return item.name == registerName })){
            alert('Niestety, ta nazwa użytkownika juz jest zajęta :(')
        }     
        else if(userRecords.some((item) => {return item.email == email })){
            alert('Niestety, ten email już jest zajęty :(')
        }
        else if(email != emailConfirm){
            console.log('confirmation not valid')
            alert('Email nie pasuje, potwierdź email')
        }
        else{   
            userRecords.push({
                'name':registerName,
                'email':email,
                'password':password
            })
            localStorage.setItem('users', JSON.stringify(userRecords))
            localStorage.setItem('loggedIn', 'true')
            alert('Gratulacjie! Jesteś zarejestrowany!')
            form.reset()
            showContent()
        }
    })
}

function login(form){
    form.addEventListener('submit', (e) => {
        let username = document.getElementById('login_username').value 
        let loginPassword = document.getElementById('login_password').value
        e.preventDefault()
        let userRecords = [];
        userRecords = JSON.parse(localStorage.getItem('users'))?JSON.parse(localStorage.getItem('users')):[]
        if(userRecords.some((user) => {return user.email == username && user.password == loginPassword || user.name == username && user.password == loginPassword})){
            localStorage.setItem('loggedIn', 'true')
            showContent()
        }
        else{
            alert('Użytkownika nie znaleziono')
        }
        form.reset() 
})
}

function showContent() { 
    slider()
    let content = document.querySelector('.main__content')
    let entry = document.querySelector('.main__entry')
    let form = document.querySelector('.main__form')
    let loggedIn = localStorage.getItem('loggedIn')
    if(loggedIn == 'false') {
        if(loginForm.style.display=='flex'){  
            registerButton.style.display='flex'       
            loginButton.style.display='none'
            registerForm.style.display='none'
            entry.style.display='none'
        }
        else if(registerForm.style.display=='flex'){
            loginButton.style.display='flex'
            registerButton.style.display='none'
            loginForm.style.display='none'
            entry.style.display='none'
        }
        else {
            entry.style.display='flex'
            registerButton.style.display='flex' 
            loginButton.style.display='flex'
            loginForm.style.display='none'
            registerForm.style.display='none'       
        }
        content.style.display='none'
        form.style.display='flex'
        logoutButton.style.display='none'
    }
    else{
        entry.style.display='none'
        content.style.display='flex'
        form.style.display='none'
        loginButton.style.display='none'
        registerButton.style.display='none'
        logoutButton.style.display='flex'
    } 
    loginButton.addEventListener('click', ()=> {
        loginForm.style.display='flex'
        registerForm.style.display='none'
        entry.style.display='none'
        showContent()
    })
    registerButton.addEventListener('click', ()=> {
        registerForm.style.display='flex'
        loginForm.style.display='none'
        showContent()
    })
    logoutButton.addEventListener('click', () => {
        localStorage.setItem('loggedIn', 'false')
        showContent()
    }) 
    adjustMobileStyle();
}

function transactions(){
    class Transaction {
        constructor(date, type, amount, description, balance, typeName, parentSelector) { //принимает параметри при создании єкземпляра обьекта
            this.date = date;
            this.type = type;
            this.description = description;
            this.amount = amount;
            this.balance = balance;
            this.typeName = typeName;
            this.parentSelector = document.querySelector(parentSelector);
            this.incomeIcon = "./img/icons8-receive-dollar-64.png";
            this.salaryIcon = "./img/icons8-salary-64.png";
            this.spendingIcon = "./img/icons8-bill-64.png";
            this.shoppingIcon = "./img/icons8-shopping-bags-64.png";
            this.iconLink = this.insertIcon();
        }
        insertIcon() {
            if(this.type == '1') {
                return this.incomeIcon;
            }
            else if(this.type == '2') {
                return this.shoppingIcon;
            }
            else if(this.type == '3') {
                return this.salaryIcon;
            }
            else{
                return this.spendingIcon;
            }
              
        }
        createTransaction() {
            const elem = document.createElement("div");
            elem.classList.add("transactions__row");
            elem.id = "mobile_style"
            elem.innerHTML = `
                            <p class="transactions__item date">${this.date}</p>
                            <div class="transactions__item icon"><img src=${this.iconLink} alt=${this.typeName} + "icon" style="width:2em;height:2em"></div>
                            <div class="transations__item description_wrapper">
                                <p>${this.description}</p>
                                <p class="name">${this.typeName}</p>
                            </div>
                            <p>${this.amount}</p>
                            <p class="transactions__item balance">${this.balance}</p>
                        `
            this.parentSelector.appendChild(elem)
        }
    }
    getData(url)
        .then (data=> {
            data.transactions.forEach(({date, type, amount, description, balance})=>{  
            new Transaction(date, type, amount, description, balance, data.transacationTypes[type], '.transactions').createTransaction()
        })
    })
}

function adjustMobileStyle() {
    const transactionsRows = document.querySelectorAll(".transactions__row")
    transactionsRows.forEach((item) => {
        item.setAttribute("id", "mobile_style")
    }) // add mobile style and divide grid in 3 columns
    document.addEventListener("click", function(e){
        removeClasses();
        if(screen.width <= 768) {
        const target = e.target.closest(".transactions__row"); 
        const transactionsHeadings = document.querySelector(".transactions__headings")
        const transactionsRows = document.querySelectorAll(".transactions__row")
        transactionsRows.forEach((item) => {
            item.setAttribute("id", "mobile_style")
        }) // add mobile style and divide grid in 3 columns
        transactionsHeadings.removeAttribute("id")
        transactionsHeadings.children[0].style.visibility = "hidden" 
        transactionsHeadings.children[4].style.visibility = "hidden"
        if(target){
          removeClasses()
          target.removeAttribute("id") //remove mobile style and bring back 5 columns 
          document.querySelector(".transactions__headings").id = "removeMobileStyle" //remove mobile style from transaction headings
          target.firstElementChild.classList.add("showFullLine"); // show date
          target.children[4].classList.add("showFullLine"); //show balance
          transactionsHeadings.children[0].style.visibility = "visible"
          transactionsHeadings.children[4].style.visibility = "visible"
        }
    }});
}

function removeClasses() {
    let fullLines = document.querySelectorAll(".showFullLine")
    if(fullLines != null) {
        fullLines.forEach((item) => {
        item.classList.remove("showFullLine")
    })
}
}

/*--------PIE CHART---------*/
const pieChart = document.getElementById('pieChart');
let typesObj = {}
let labelsArr = []
let dataArr = [];
let typesArr = [];

getData(url)
    .then (data=> {
        data.transactions.forEach(({type}) => {  
            typesArr.push(type)
        });
        typesArr.forEach((item) => {
            if(typesObj[item] == undefined) {            
                typesObj[item] = 1
            }
            else {         
                typesObj[item]++
            }
        }) 
        for(key in data.transacationTypes) {
            labelsArr.push(data.transacationTypes[key])
        }
        for (key in typesObj) {
            dataArr.push(typesObj[key])
        } 
        new Chart(pieChart, {
            type: 'pie',
            data: {
              labels: labelsArr,
              datasets: [{
                  label: 'Typy transakcji',
                  data: dataArr,
                  backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(101, 240, 155)'
                  ],
                  hoverOffset: 4
              }]
            }
          });
    
 }) 

 /*--------BAR CHART -------*/
 const barChart = document.getElementById('barChart');
 let saldoArr = [];
 let datesArr = [];

 getData(url)
    .then(data => {
        for(let i = 0; i < data.transactions.length; i++) {   
                if (data.transactions[i].date !== data?.transactions[i+1]?.date) {
                    datesArr.push(data.transactions[i].date)
                    saldoArr.push(data.transactions[i].balance)
                }   
        }   
        new Chart(barChart, {
            type: 'bar',
            data: {
              labels: datesArr,
              datasets: [{
                 label: 'Saldo konta',
                 data: saldoArr,
                 backgroundColor: [
                   'rgba(255, 99, 132, 0.2)',
                   'rgba(255, 159, 64, 0.2)',
               
                   'rgba(75, 192, 192, 0.2)',
                   'rgba(54, 162, 235, 0.2)',
                   'rgba(153, 102, 255, 0.2)',
                   'rgba(201, 203, 207, 0.2)'
                 ],
                 borderColor: [
                     'rgb(255, 99, 132)',
                     'rgb(255, 159, 64)',
                    
                     'rgb(75, 192, 192)',
                     'rgb(54, 162, 235)',
                     'rgb(153, 102, 255)',
                     'rgb(201, 203, 207)'
                   ],
                   borderWidth: 1
                 }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          })
    })

/*--------SLIDER DIAGRAM FOR MOBILE--------*/

function slider() {
    if(screen.width <= 768) {
        let next = document.querySelector(".diagrams__next");
        let prev = document.querySelector(".diagrams__prev");
        let sliderWrapper = document.querySelector(".diagrams");
        let width = window.getComputedStyle(sliderWrapper).width; // because of this code, width in responsive browser mode does not adjust. but it should work on phones and tablets
        let diagramsWrapper = document.querySelector(".diagrams__wrapper"); //slidesField
        let slides = document.querySelectorAll(".chartWrapper")
        let offset = 0;
        diagramsWrapper.style.width =  slides.length * 100 + '%';
        sliderWrapper.style.overflow = 'hidden';
        slides.forEach(slide => {
            slide.style.width = width;
        })
        next.addEventListener('click', ()=> {
            if(offset === (+width.slice(0,width.length-2)*(slides.length-1))){
                offset = 0;
            }
            else {
                offset += +width.slice(0,width.length-2);
            }
            diagramsWrapper.style.transform = `translateX(-${offset}px)`
        })
        prev.addEventListener('click', ()=> {
            if(offset === 0) {
                offset = +width.slice(0,width.length-2)*(slides.length-1)
            }
            else {
                offset -= +width.slice(0,width.length-2);
            }
            diagramsWrapper.style.transform = `translateX(-${offset}px)`
        })
    }
}



register(registerForm);
login(loginForm);
showContent();
transactions();





