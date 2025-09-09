const fs = require('fs').promises;
const path = require('path');

const resolvePath = (fileName) => path.join(__dirname, '..', 'data', fileName);

// Re-using the same processing helper function
const processAndCombineData = (students, grades) => {
    return students.map(student => {
        const studentGrades = grades.find(g => g.studentId === student.id);
        if (!studentGrades) {
            return { ...student, averageGrade: 'N/A' };
        }
        const sum = studentGrades.grades.reduce((acc, grade) => acc + grade, 0);
        const average = sum / studentGrades.grades.length;
        return { ...student, averageGrade: parseFloat(average.toFixed(2)) };
    });
};

const processStudentDataWithAsyncAwait = async () => {
  try {
    // 1. Read Students
    const studentData = await fs.readFile(resolvePath('students.json'), 'utf8');
    const students = JSON.parse(studentData);

    // 2. Read Grades
    const gradeData = await fs.readFile(resolvePath('grades.json'), 'utf8');
    const grades = JSON.parse(gradeData);

    // 3. Process Data
    const processedData = processAndCombineData(students, grades);

    // 4. Save Results
    const outputPath = path.join(__dirname, '..', 'data', 'results_async_await.json');
    await fs.writeFile(outputPath, JSON.stringify(processedData, null, 2));

    return `Successfully processed data and saved to ${outputPath}`;
  } catch (err) {
    // A single try...catch block handles all errors gracefully
    throw new Error('Async/Await process failed: ' + err.message);
  }
};

module.exports = { processStudentDataWithAsyncAwait };