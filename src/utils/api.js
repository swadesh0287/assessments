// utils/api.js
const mockJobs = [
    { id: 1, title: 'Software Engineer', description: 'Develop and maintain software.', candidatesApplied: 5 },
    { id: 2, title: 'Product Manager', description: 'Oversee product development.', candidatesApplied: 3 }
  ];
  
  const mockCandidates = [
    { id: 1, name: 'John Doe', resume: 'link/to/resume', applicationDate: '2023-06-10', status: 'Under Review' },
    { id: 2, name: 'Jane Smith', resume: 'link/to/resume', applicationDate: '2023-06-12', status: 'Interview Scheduled' }
  ];
  
  export const fetchJobs = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockJobs);
      }, 500);
    });
  };
  
  export const fetchCandidates = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCandidates);
      }, 500);
    });
  };
  