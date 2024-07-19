import React, { useState } from 'react';
import { uploadFile } from '../models/uploadFile';

const UploadFilePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await uploadFile(file, password);
      setMessage(response.message);
      setFilePath(response.filePath || null);
    } catch (error) {
      setError('Failed to upload file. Please check your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload file</h2>
      <p>This page only for admin!</p>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <input type="file" name="file" onChange={handleFileChange} required />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div>
          <input type="submit" value="Upload" />
        </div>
        {loading && <p>Loading...</p>}
        {message && <p>{message}</p>}
        {filePath && <p>File uploaded at: {filePath}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default UploadFilePage;
