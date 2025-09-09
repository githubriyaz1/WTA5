const fs = require('fs').promises; // Use the promise-based version of fs
const path = require('path');

const resolvePath = (fileName) => path.join(__dirname, '..', 'data', fileName);

// Helper function to abstract the processing logic
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

const processStudentDataWithPromises = () => {
  let studentData;
  
  // 1. Read Students
  return fs.readFile(resolvePath('students.json'), 'utf8')
    .then(data => {
      studentData = JSON.parse(data);
      // 2. Read Grades (chained)
      return fs.readFile(resolvePath('grades.json'), 'utf8');
    })
    .then(gradeData => {
      const gradeList = JSON.parse(gradeData);
      // 3. Process the data
      const processedData = processAndCombineData(studentData, gradeList);
      // 4. Save the results
      const outputPath = path.join(__dirname, '..', 'data', 'results_promise.json');
      return fs.writeFile(outputPath, JSON.stringify(processedData, null, 2))
        .then(() => `Successfully processed data and saved to ${outputPath}`); // Return success message
    })
    .catch(err => {
      // A single .catch() can handle errors from any preceding .then() in the chain
      throw new Error('Promise chain failed: ' + err.message);
    });
};

module.exports = { processStudentDataWithPromises };