import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, InputLabel, FormControl, List, ListItem, ListItemText, IconButton } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function CreateAssessmentPage() {
  const [selectedJob, setSelectedJob] = useState('');
  const [questions, setQuestions] = useState([]);  // Ensure this is initialized as an empty array
  const [questionText, setQuestionText] = useState('');
  const [answerChoices, setAnswerChoices] = useState(['', '', '', '']);  // Ensure this is initialized with 4 empty strings
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [jobOptions, setJobOptions] = useState([]);

  // Fetch jobs for the dropdown
  useEffect(() => {
    axios.get('http://localhost:5000/jobs')
      .then((response) => setJobOptions(response.data))
      .catch((error) => console.error('Error fetching jobs:', error));
  }, []);

  // Fetch questions when a job is selected
  useEffect(() => {
    if (selectedJob) {
      axios.get(`http://localhost:5000/questions?jobId=${selectedJob}`)
        .then((response) => {
          if (response.data) {
            setQuestions(response.data);  // Only update state if response is valid
          }
        })
        .catch((error) => console.error('Error fetching questions:', error));
    }
  }, [selectedJob]);

  const handleAddQuestion = () => {
    if (!selectedJob) {
      alert('Please select a job first!');
      return;
    }

    const newQuestion = {
      question: questionText,
      answers: answerChoices,
      correctAnswer,
    };

    // Save the question under the selected job
    axios.post(`http://localhost:5000/questions`, { jobId: selectedJob, ...newQuestion })
      .then((response) => {
        setQuestions((prev) => [...prev, response.data]);  // Add new question to list
        setQuestionText('');
        setAnswerChoices(['', '', '', '']);
        setCorrectAnswer('');
      })
      .catch((error) => console.error('Error adding question:', error));
  };

  const handleDeleteQuestion = (questionId) => {
    // Delete the question from the database
    axios.delete(`http://localhost:5000/questions/${questionId}`)
      .then(() => {
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));  // Remove the deleted question from state
      })
      .catch((error) => console.error('Error deleting question:', error));
  };

  const handleEditQuestion = (index) => {
    const questionToEdit = questions[index];
    setQuestionText(questionToEdit.question);
    setAnswerChoices(questionToEdit.answers);
    setCorrectAnswer(questionToEdit.correctAnswer);
    setEditingQuestionIndex(index);  // Set the index of the question being edited
  };

  const handleUpdateQuestion = () => {
    const updatedQuestion = {
      question: questionText,
      answers: answerChoices,
      correctAnswer,
    };

    // Update the question in the database
    axios.put(`http://localhost:5000/questions/${questions[editingQuestionIndex].id}`, updatedQuestion)
      .then(() => {
        const updatedQuestions = [...questions];
        updatedQuestions[editingQuestionIndex] = { ...updatedQuestion, id: questions[editingQuestionIndex].id };
        setQuestions(updatedQuestions);
        setQuestionText('');
        setAnswerChoices(['', '', '', '']);
        setCorrectAnswer('');
        setEditingQuestionIndex(null);  // Reset editing state
      })
      .catch((error) => console.error('Error updating question:', error));
  };

  return (
    <Box sx={{ width: '80%', margin: 'auto' }}>
      <Typography variant="h6">Create Assessment</Typography>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Select Job</InputLabel>
        <Select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          label="Select Job"
        >
          {jobOptions.map((job) => (
            <MenuItem key={job.id} value={job.id}>
              {job.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Question"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
      />

      {answerChoices.map((choice, index) => (
        <TextField
          key={index}
          label={`Answer Choice ${index + 1}`}
          value={choice}
          onChange={(e) => {
            const newChoices = [...answerChoices];
            newChoices[index] = e.target.value;
            setAnswerChoices(newChoices);
          }}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
      ))}

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Correct Answer</InputLabel>
        <Select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          label="Correct Answer"
        >
          {answerChoices.map((choice, index) => (
            <MenuItem key={index} value={choice}>
              {choice}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={editingQuestionIndex === null ? handleAddQuestion : handleUpdateQuestion}>
        {editingQuestionIndex === null ? 'Add Question' : 'Update Question'}
      </Button>

      <Typography variant="h6" sx={{ marginTop: 4 }}>Existing Questions</Typography>
      <List>
        {questions.map((question, index) => (
          <ListItem key={question.id}>
            <ListItemText
              primary={question.question}
              secondary={`Correct Answer: ${question.correctAnswer}`}
            />
            <IconButton edge="end" onClick={() => handleEditQuestion(index)}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" onClick={() => handleDeleteQuestion(question.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default CreateAssessmentPage;
