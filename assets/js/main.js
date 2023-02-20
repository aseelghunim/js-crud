let name = document.getElementById('name');
let cat = document.getElementById('cat');
let price = document.getElementById('price');
let desc = document.getElementById('desc');
let addBtn = document.getElementById('add-btn');
let clearBtn = document.getElementById('clear-btn');
let tableBody = document.getElementById('table-body');
let deleteAllBtn = document.getElementById('delete-all');
let search = document.getElementById('search');
let currentIndex;
// check if local storage is empty of courses or not, if there are courses display them.
let courses;
if (JSON.parse(localStorage.getItem('courses')) == null) courses = [];
else {
    displayCourses();
}
// add btn will add course to courses if it's a new course, or update the course data if it already exists.
addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    checkPrevValidClasses();
    if (addBtn.innerHTML == 'Add') {
        addCourse();
        Swal.fire({
            position: 'center-center',
            icon: 'success',
            title: 'Course has been updated',
            showConfirmButton: false,
            timer: 1500
        })
    }
    else{
        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                updateCourse();
              Swal.fire('Saved!', '', 'success')
            } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
          })
    }
});
// add course function will create a course object with the fields values and push it to courses.
function addCourse() {
    let course = {
        name: name.value,
        cat: cat.value,
        price: price.value,
        desc: desc.value,
    }
    courses.push(course);
    localStorage.setItem("courses", JSON.stringify(courses));
    displayCourses();
    emptyFields();
    addBtn.setAttribute('disabled', 'disabled');
}
// empty fields function will empty the value of the fields from previous change to be able to add or update another course.
function emptyFields() {
    name.value = "";
    cat.value = "";
    price.value = "";
    desc.value = "";
}
// display courses function will turn the courses item from local storage to an array of objects to be able to add courses to the results table.
function displayCourses() {
    courses = JSON.parse(localStorage.getItem('courses'));
    let data = "";
    for (let i = 0; i < courses.length; i++) {
        data += `
            <tr>
                <td>${i}</td>
                <td>${courses[i].name}</td>
                <td>${courses[i].cat}</td>
                <td>${courses[i].price}</td>
                <td>${courses[i].desc}</td>
                <td><button class="btn btn-primary" onclick="getOldData(${i})">Update</button></td>
                <td><button class="btn btn-danger" onclick="deleteCourse(${i})">Delete</button></td>
            </tr>
        `
    }
    tableBody.innerHTML = data;
}
// this function will remove courses item from local storage to remove all courses.
deleteAllBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "All courses will be deleted!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            courses = [];
            localStorage.removeItem("courses");
            tableBody.innerHTML = "";
            Swal.fire(
                'Deleted!',
                'All courses has been deleted.',
                'success'
            )
        }
    })
})
// this function will remove the wanted course from courses and then display the new array.
function deleteCourse(index) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            courses.splice(index, 1);
            localStorage.setItem("courses", JSON.stringify(courses));
            displayCourses();
            Swal.fire(
                'Deleted!',
                'Course has been deleted.',
                'success'
            )
        }
    });
}
// This function will get the old data of the wanted course and give you the ability to change its values from input fields.
function getOldData(index) {
    name.value = courses[index].name;
    cat.value = courses[index].cat;
    price.value = courses[index].price;
    desc.value = courses[index].desc;
    addBtn.innerHTML = 'Update';
    currentIndex = index;
    name.classList.add('is-valid');
    price.classList.add('is-valid');
}
// This function will work immediately after the previous one, it will store the new values to the wanted course.
function updateCourse() {
    courses[currentIndex].name = name.value;
    courses[currentIndex].cat = cat.value;
    courses[currentIndex].desc = desc.value;
    courses[currentIndex].price = price.value;
    addBtn.innerHTML = 'Add';
    localStorage.setItem("courses", JSON.stringify(courses));
    displayCourses();
    emptyFields();
    addBtn.setAttribute('disabled', 'disabled');
}
name.onkeyup = function () {
    let pattern = /^[A-Z][a-z]{2,10}$/;
    if (pattern.test(name.value)) {
        if (name.classList.contains("is-invalid")) {
            name.classList.remove("is-invalid");
        }
        name.classList.add("is-valid");
    }
    else {
        if (name.classList.contains("is-valid")) {
            name.classList.remove("is-valid");
        }
        name.classList.add("is-invalid");
    }
    activateAddBtn();
}
price.onkeyup = function () {
    let pattern = /^[1-9][0-9][0-9]{1}$/;
    if (pattern.test(price.value)) {
        if (price.classList.contains("is-invalid")) {
            price.classList.remove("is-invalid");
        }
        price.classList.add("is-valid");
    }
    else {
        if (price.classList.contains("is-valid")) {
            price.classList.remove("is-valid");
        }
        price.classList.add("is-invalid");
    }
    activateAddBtn();
}
function checkPrevValidClasses() {
    if (name.classList.contains('is-valid')) name.classList.remove('is-valid');
    if (price.classList.contains('is-valid')) price.classList.remove('is-valid');
}
function activateAddBtn() {
    if (name.classList.contains('is-valid') && price.classList.contains('is-valid')) addBtn.removeAttribute('disabled');
    else addBtn.setAttribute('disabled', 'disabled');
}

search.onkeyup = () => {
    let data = "";
    for (let i = 0; i < courses.length; i++) {
        if (courses[i].name.toLowerCase().includes(search.value)) {
            data += `
            <tr>
                <td>${i}</td>
                <td>${courses[i].name}</td>
                <td>${courses[i].cat}</td>
                <td>${courses[i].price}</td>
                <td>${courses[i].desc}</td>
                <td><button class="btn btn-primary" onclick="getOldData(${i})">Update</button></td>
                <td><button class="btn btn-danger" onclick="deleteCourse(${i})">Delete</button></td>
            </tr>
            `
        }
    }
    tableBody.innerHTML = data;
}
