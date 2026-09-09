import { createStudent, sum } from "./utils.js";

let students = [
    createStudent("Ram", 85),
    createStudent("Shyam", 45)
];

const output = document.getElementById("output");

const display = list => {

    output.innerHTML = list.map(student => {

        const { name, marks } = student;

        return `
        <div class="card">
            <h3>${name}</h3>
            <p>Marks : ${marks}</p>
        </div>
        `;

    }).join("");

};

document.getElementById("addBtn").onclick = () => {

    const name = document.getElementById("name").value;
    const marks = Number(document.getElementById("marks").value);

    const newStudent = createStudent(name, marks);

    students = [...students, newStudent];

    display(students);

};

document.getElementById("showBtn").onclick = () => {
    display(students);
};

document.getElementById("passedBtn").onclick = () => {

    const passed = students.filter(student => student.marks >= 50);

    display(passed);

};

document.getElementById("averageBtn").onclick = () => {

    const total = students.reduce((sum, student) => sum + student.marks, 0);

    const average = total / students.length;

    output.innerHTML = `<h2>Average Marks = ${average}</h2>`;

};

document.getElementById("checkBtn").onclick = () => {

    const anyPerfect = students.some(student => student.marks === 100);

    const everyonePassed = students.every(student => student.marks >= 50);

    const total = sum(...students.map(student => student.marks));

    output.innerHTML = `
        <p>Any student scored 100? ${anyPerfect}</p>
        <p>Everyone passed? ${everyonePassed}</p>
        <p>Total Marks: ${total}</p>
    `;

};

display(students);
