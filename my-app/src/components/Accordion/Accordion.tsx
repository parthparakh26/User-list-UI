import React, { useState } from 'react';
import celebritiesData from '../../celebrities.json';
import './Accordion.css';
import Avatar from '../../Assets/Avatar.png';
import DialogBox from '../DialogBox/DialogBox'; 
import {RiDeleteBin6Line} from 'react-icons/ri';
import {SlPencil} from 'react-icons/sl';
import {ImCancelCircle} from 'react-icons/im';
import {BsCheckCircle} from 'react-icons/bs';

interface Celeb {
  id: number;
  first: string;
  last: string;
  dob: string;
  gender: string;
  country: string;
  description: string;
  expanded: boolean;
}

const Accordion = () => {
  const [celebrities, setCelebrities] = useState<Celeb[]>(
    celebritiesData.map(celeb => ({ ...celeb, expanded: false }))
  );
  const [editMode, setEditMode] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCelebId, setSelectedCelebId] = useState<number | null>(null);
  const [editedDetails, setEditedDetails] = useState<Partial<Celeb> | null>(null);
  const [editedName, setEditedName] = useState<string>('');

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleAccordionClick = (id: number) => {
    if (editMode !== null) return;

    setCelebrities(prevCelebrities => {
      return prevCelebrities.map(celeb => ({
        ...celeb,
        expanded: celeb.id === id ? !celeb.expanded : false,
      }));
    });
  };

  const handleEditClick = (id: number) => {
    const celebToEdit = celebrities.find(celeb => celeb.id === id);

    if (!celebToEdit || isUnderage(celebToEdit)) return;

    setEditMode(id);
    setEditedDetails({}); 
  };

  const handleSaveClick = (id: number) => {
    if (editedDetails && Object.keys(editedDetails).length > 0) {
      setCelebrities(prevCelebrities => {
        return prevCelebrities.map(celeb =>
          celeb.id === id ? { ...celeb, ...editedDetails } : celeb
        );
      });
    }

    setEditMode(null);
    setEditedDetails(null);
  };

  const handleCancelClick = () => {
    setEditMode(null);
    setEditedDetails(null);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedCelebId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCelebId !== null) {
      setCelebrities(prevCelebrities =>
        prevCelebrities.filter(celeb => celeb.id !== selectedCelebId)
      );
    }
    setShowDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const isUnderage = (celeb: Celeb) => {
    const dob = new Date(celeb.dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dob.getFullYear();

    return age < 18;
  };

  const handleFieldChange = (field: keyof Celeb, value: any) => {
    if (editMode !== null) {
      setEditedDetails(prevEditedDetails => ({
        ...prevEditedDetails,
        [field]: value,
      }));
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(event.target.value);
  };

  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredAge = Number(event.target.value);
  
    if (!isNaN(enteredAge)) {
      const currentDate = new Date();
      const birthYear = currentDate.getFullYear() - enteredAge;
      const birthDate = new Date(celebrities.find(celeb => celeb.id === editMode)?.dob || '');
      birthDate.setFullYear(birthYear);
  
      handleFieldChange('dob', birthDate.toISOString());
    }
  };
  

  return (
    <div className="accordion-container">
      {celebrities.map(celeb => (
        <div key={celeb.id} className={`accordion ${celeb.expanded ? 'expanded' : ''}`}>
          <div className="accordion-header" onClick={() => handleAccordionClick(celeb.id)}>
            <div className="accordion-avatar">
              <img src={Avatar} alt={`${celeb.first} ${celeb.last}`} />
              <div>
                {editMode === celeb.id ? (
                  <input
                    type="text"
                    value={editedName || `${celeb.first} ${celeb.last}`}
                    onChange={handleNameChange}
                  />
                ) : (
                  <b>{celeb.first} {celeb.last}</b>
                )}
              </div>
            </div>
            <span className="accordion-icon">{celeb.expanded ? '-' : '+'}</span>
          </div>
          {celeb.expanded && (
            <div className="accordion-content">
              <div className="accordion-details-row">
                <div className="d-below">
                  <label className="d-label" style={{marginLeft:10}}>Age</label>
                  {editMode === celeb.id ? (
                    <input
                      type="text"
                      value={calculateAge(celeb.dob)}
                      onChange={handleAgeChange}
                      style={{marginLeft:90,width:70}}
                    />
                  ) : (
                    <span style={{marginLeft:10}}>{calculateAge(celeb.dob)}</span>
                  )}
                </div>
                <div className="d-below">
                  <label className="d-label">Gender</label>
                  {editMode === celeb.id ? (
                    <select
                      value={editedDetails?.gender ||  celeb.gender}
                      onChange={e => handleFieldChange('gender', e.target.value)}
                      style={{width:120}}
                      
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                      <option value="Rather not say">Rather not say</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <span>{celeb.gender}</span>
                  )}
                </div>
                <div className="d-below">
                  <label className="d-label">Country</label>
                  {editMode === celeb.id ? (
                    <input
                      type="text"
                      value={editedDetails?.country || celeb.country}
                      onChange={e => handleFieldChange('country', e.target.value)}
                      style={{width:80}}
                    />
                  ) : (
                    <span style={{width:120}}>{celeb.country}</span>
                  )}
                </div>
              </div>
              <div>
                <label className="des-label">Description</label>
                {editMode === celeb.id ? (
                  <textarea
                    value={editedDetails?.description || celeb.description}
                    onChange={e => handleFieldChange('description', e.target.value)}
                    style={{width:"95%"}}
                  />
                ) : (
                  <div className="description-text">{celeb.description}</div>
                )}
              </div>
              {editMode === celeb.id ? (
                <div className="accordion-buttons">
                  <button
                    className="cancel1-button"
                    onClick={handleCancelClick}
                    disabled={!editedDetails}
                  >
                    <ImCancelCircle size={20}/>
                  </button>
                  <button
                    className="save-button"
                    onClick={() => handleSaveClick(celeb.id)}
                    disabled={!editedDetails}
                  >
                    <BsCheckCircle size={20}/>
                  </button>
                </div>
              ) : (
                <div className="accordion-buttons">
                  <button className="delete-button" onClick={() => handleDeleteClick(celeb.id)}>
                    <RiDeleteBin6Line size={20} />
                  </button>
                  <button className="edit-button" onClick={() => handleEditClick(celeb.id)}>
                    <SlPencil size={20}/>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      {showDeleteDialog && (
        <DialogBox onClose={handleDeleteCancel} onDelete={handleDeleteConfirm} />
      )}
    </div>
  );
};

export default Accordion;
