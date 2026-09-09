export const createStudent = (name, marks) => ({
    name,
    marks
});

export const sum = (...numbers) =>
    numbers.reduce((a, b) => a + b, 0);
