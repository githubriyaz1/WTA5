const fs = require('fs');
const path = require('path');

// Helper function to resolve data file paths
const resolvePath = (fileName) => path.join(__dirname, '..', 'data', fileName);

const processStudentDataWithCallbacks = (finalCallback) => {
  // 1. Read Students
  fs.readFile(resolvePath('students.json'), 'utf8', (err, studentData) => {
    if (err) {
      return finalCallback('Error reading students.json: ' + err.message);
    }
    const students = JSON.parse(studentData);

    // 2. Read Grades (nested callback)
    fs.readFile(resolvePath('grades.json'), 'utf8', (err, gradeData) => {
      if (err) {
        return finalCallback('Error reading grades.json: ' + err.message);
      }
      const grades = JSON.parse(gradeData);

      // 3. Process Data (Abstraction)
      // This logic is abstracted into its own function
      processAndCombineData(students, grades, (err, processedData) => {
        if (err) {
            return finalCallback('Error processing data: ' + err.message);
        }

        // 4. Save Results (final nested callback)
        const outputPath = path.join(__dirname, '..', 'data', 'results_callback.json');
        fs.writeFile(outputPath, JSON.stringify(processedData, null, 2), (err) => {
          if (err) {
            return finalCallback('Error saving results: ' + err.message);
          }
          finalCallback(null, `Successfully processed data and saved to ${outputPath}`);
        });
      });
    });
  });
};

// Callback Abstraction: The processing logic is in its own function.
function processAndCombineData(students, grades, callback) {
    try {
        const results = students.map(student => {
            const studentGrades = grades.find(g => g.studentId === student.id);
            if (!studentGrades) {
                return { ...student, averageGrade: 'N/A' };
            }
            const sum = studentGrades.grades.reduce((acc, grade) => acc + grade, 0);
            const average = sum / studentGrades.grades.length;
            return { ...student, averageGrade: parseFloat(average.toFixed(2)) };
        });
        callback(null, results);
    } catch (error) {
        callback(error);
    }
}


module.exports = { processStudentDataWithCallbacks };