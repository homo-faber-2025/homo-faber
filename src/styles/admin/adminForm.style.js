import styled from '@emotion/styled';

export const AdminFormWrapper = styled.div`
  padding: 20px;
  background: white;
  z-index: 10;
  font-family: var(--font-gothic);
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e1e5e9;

  h1 {
    margin: 0;
    color: #333;
    font-size: 1.7rem;
    font-weight: 700;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

export const BackBtn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #6c757d;
  color: white;

  &:hover {
    background-color: #545b62;
  }
`;

export const SaveBtn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #007bff;
  color: white;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const FormSection = styled.div`
  margin-top: 20px;

  h2 {
    margin-bottom: 20px;
    color: #333;
    font-size: 1.6rem;
    border-bottom: 2px solid #e1e5e9;
    padding-bottom: 10px;
    font-weight: 500;
    text-decoration: none;
  }

  h3 {
    display: block;
    margin-bottom: 15px;
    font-weight: 600;
    color: #333;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
`;

export const FormField = styled.div`
  margin-bottom: 30px;
  position: relative;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }

  input, textarea, select {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  select {
    background-color: white;
  }

  .image-preview {
    margin-top: 10px;
    max-width: 100%;
    
    img {
      width: 100%;
      height: auto;
      border-radius: 6px;
      border: 1px solid #ddd;
    }
  }
`;


export const TagSection = styled.div`
  margin-bottom: 40px;

  .tag-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
  }

  .tag-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tag-item input[type="checkbox"] {
    width: auto;
  }
`;

export const GallerySection = styled.div`
  margin-bottom: 20px;

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }

  .gallery-item {
    padding: 15px;
    border: 2px dashed #ddd;
    border-radius: 12px;
    background-color: #fafafa;
    position: relative;
    transition: all 0.3s ease;
    cursor: move;

    &:hover {
      border-color: #007bff;
      background-color: #f8f9fa;
    }
  }

  .gallery-item.dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }

  .gallery-item.drag-over {
    background-color: #e3f2fd;
    border-color: #2196f3;
  }

  .gallery-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    h4 {
      margin: 0;
      color: #333;
    }

    .order-badge {
      font-size: 12px;
      color: #666;
      background-color: #e9ecef;
      padding: 2px 8px;
      border-radius: 10px;
    }

    .delete-btn {
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
    }
  }

  .image-upload-area {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    background-color: white;
    transition: all 0.3s ease;

    &:hover {
      border-color: #007bff;
      background-color: #f8f9fa;
    }

    .upload-icon {
      font-size: 24px;
      color: #ccc;
      margin-bottom: 10px;
    }

    .upload-text {
      color: #666;
    }
  }

  .image-preview-container {
    position: relative;

    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
    }

    .image-actions {
      position: absolute;
      top: 5px;
      right: 5px;
      display: flex;
      gap: 5px;
    }
  }

`;

export const ErrorInputMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 7px;
  position: absolute;
  bottom: -17px;
  left: 2px;
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

export const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: red;
  font-size: 1.1rem;
`;