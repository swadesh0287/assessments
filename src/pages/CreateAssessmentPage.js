import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, InputLabel, FormControl, List, ListItem, ListItemText, IconButton, Alert, Grid } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import '@fontsource/poppins';

function CreateAssessmentPage() {
 
  const [selectedJob, setSelectedJob] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [answerChoices, setAnswerChoices] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [jobOptions, setJobOptions] = useState([]);
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [errorFields, setErrorFields] = useState([]);

  useEffect(() => {
    axios.get('https://swadesh0287.github.io/assessments/index.json/jobs')
      .then((response) => setJobOptions(response.data))
      .catch((error) => console.error('Error fetching jobs:', error));
  }, []);

  useEffect(() => {
    if (selectedJob) {
      axios.get(`https://swadesh0287.github.io/assessments/index.json/questions?jobId=${selectedJob}`)
        .then((response) => setQuestions(response.data))
        .catch((error) => console.error('Error fetching questions:', error));
    }
  }, [selectedJob]);

  const handleAddQuestion = () => {
    if (!selectedJob) {
      alert('Please select a job first!');
      return;
    }

    setErrorFields([]);
    setDuplicateWarning('');

    const validationErrors = [];
    if (!questionText.trim()) {
      validationErrors.push('Question text cannot be empty.');
    }

    const filledChoices = answerChoices.filter(choice => choice.trim());
    if (filledChoices.length < 2) {
      validationErrors.push('At least two answer choices must be provided.');
    }

    if (!correctAnswer.trim()) {
      validationErrors.push('Correct answer must be selected.');
    } else if (!answerChoices.includes(correctAnswer.trim())) {
      validationErrors.push('Correct answer must be one of the answer choices.');
    }
  
    if (validationErrors.length > 0) {
      setErrorFields(validationErrors);
      return;
    }

    axios.get('https://swadesh0287.github.io/assessments/index.json/questions')
      .then((response) => {
        const allQuestions = response.data;
  
        const isDuplicateInSameJob = allQuestions.some(
          (q) => q.question.toLowerCase() === questionText.toLowerCase() && q.jobId === selectedJob
        );
  
        if (isDuplicateInSameJob) {
          setDuplicateWarning('This question already exists in the selected job.');
          return;
        }

        const isDuplicateInOtherJobs = allQuestions.some(
          (q) => q.question.toLowerCase() === questionText.toLowerCase() && q.jobId !== selectedJob
        );
  
        if (isDuplicateInOtherJobs) {
          setDuplicateWarning('This question is already used for another job.');
          return;
        }

        const newQuestion = {
          question: questionText,
          answers: answerChoices,
          correctAnswer,
        };
  
        axios.post(`https://swadesh0287.github.io/assessments/index.json/questions`, { jobId: selectedJob, ...newQuestion })
          .then((response) => {
            setQuestions((prev) => [...prev, response.data]);
            setQuestionText('');
            setAnswerChoices(['', '', '', '']);
            setCorrectAnswer('');
          })
          .catch((error) => console.error('Error adding question:', error));
      })
      .catch((error) => console.error('Error fetching questions:', error));
  };
  
  const handleDeleteQuestion = (questionId) => {
    axios.delete(`https://swadesh0287.github.io/assessments/index.json/questions/${questionId}`)
      .then(() => {
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      })
      .catch((error) => console.error('Error deleting question:', error));
  };

  const handleEditQuestion = (index) => {
    const questionToEdit = questions[index];
    setQuestionText(questionToEdit.question);
    setAnswerChoices(questionToEdit.answers);
    setCorrectAnswer(questionToEdit.correctAnswer);
    setEditingQuestionIndex(index);
  };

  const handleUpdateQuestion = () => {
    const updatedQuestion = {
      question: questionText,
      answers: answerChoices,
      correctAnswer,
    };

    axios.put(`https://swadesh0287.github.io/assessments/index.json/questions/${questions[editingQuestionIndex].id}`, updatedQuestion)
      .then(() => {
        const updatedQuestions = [...questions];
        updatedQuestions[editingQuestionIndex] = { ...updatedQuestion, id: questions[editingQuestionIndex].id };
        setQuestions(updatedQuestions);
        setQuestionText('');
        setAnswerChoices(['', '', '', '']);
        setCorrectAnswer('');
        setEditingQuestionIndex(null);
      })
      .catch((error) => console.error('Error updating question:', error));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto', padding: 2 }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          marginBottom: 2,
          fontWeight: '600',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          color: '#34495e',
          textTransform: 'uppercase',
          letterSpacing: 2,
          textShadow: '2px 2px 6px rgba(0, 0, 0, 0.1)',
          fontFamily: '"Poppins", sans-serif',
        }}
      >
        Create Assessment
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
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
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Question"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
        </Grid>

        {answerChoices.map((choice, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
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
          </Grid>
        ))}

        <Grid item xs={12}>
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
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={editingQuestionIndex === null ? handleAddQuestion : handleUpdateQuestion}
            fullWidth
          >
            {editingQuestionIndex === null ? 'Add Question' : 'Update Question'}
          </Button>
        </Grid>

        {duplicateWarning && (
          <Grid item xs={12}>
            <Alert severity="warning" sx={{ marginTop: 2 }}>
              {duplicateWarning}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <List>
            {questions.map((question, index) => (
              <ListItem key={question.id}>
                <ListItemText
                  primary={question.question}
                  secondary={`Correct Answer: ${question.correctAnswer}`}
                />
                <IconButton onClick={() => handleEditQuestion(index)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteQuestion(question.id)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CreateAssessmentPage;
