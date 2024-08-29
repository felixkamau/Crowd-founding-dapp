import { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS, SIGNER } from '../utils/contract/contract';

function CreateProjectForm() {
  const [title, setTitle] = useState('');
  const [imageURI, setImageURI] = useState('');
  const [description, setDescription] = useState('');
  const [amountRequired, setAmountRequired] = useState('');

  // handles submission after filling project details
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if Users browser has Metamask installed
    if (!window.ethereum) {
      alert('Metamask is not Installed');
      return;
    }


    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create a new Web3 provider instance
      // const provider = PROVIDER;
      // Get the signer (the selected account)
      const signer = SIGNER
      // Create a new ethers.js contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.createProject(
        title,
        imageURI,
        description,
        ethers.utils.parseEther(amountRequired)
      );
      // Wait for the transaction to complete
      await tx.wait();
      alert('Project Created Successfully');
      alert(await contract.getProjects());
    } catch (error) {
      console.error('Error creating project', error);
      alert('Failed to Create Project');
    }
  };

  return (
    <div className='p-6 mx-auto max-w-md mt-16 shadow-xl rounded-md'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='title' className='block font-medium text-gray-800'>
            Project Title
          </label>
          <input
            id='title'
            type='text'
            placeholder='Project Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className='mt-2 p-2 w-full mx-auto border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer'
          />
        </div>
        <hr className='my-4 border-gray-300' />
        <div>
          <label htmlFor='description' className='block font-medium'>
            Project Description
          </label>
          <input
            id='description'
            type='text'
            placeholder='Project Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className='mt-2 p-2 w-full mx-auto border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer'
          />
        </div>
        <hr className='my-4 border-gray-300' />
        <div>
          <label htmlFor='imageURI' className='block font-medium'>
            Project Image URI
          </label>
          <input
            id='imageURI'
            type='text'
            placeholder='Project Image URI'
            value={imageURI}
            onChange={(e) => setImageURI(e.target.value)}
            required
            className='mt-2 p-2 w-full mx-auto border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer'
          />
        </div>
        <hr className='my-4 border-gray-300' />
        <div>
          <label htmlFor='amountRequired' className='block font-medium'>
            Amount Required (ETH)
          </label>
          <input
            id='amountRequired'
            type='number'
            value={amountRequired}
            onChange={(e) => setAmountRequired(e.target.value)}
            className='mt-2 p-2 w-full mx-auto border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer'
            required
            min='0.01'
            step='0.01'
          />
        </div>
        <button
          type='submit'
          className='w-full py-3 px-4 font-medium text-black bg-gradient-to-r 
                  from-blue-500 to-purple-600 rounded-lg shadow-md hover:from-blue-600
                   hover:to-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                    disabled:opacity-75 '
          disabled={!title || !description || !amountRequired || !imageURI}
        >
          Create Project
        </button>
      </form>
    </div>
  );
}

export default CreateProjectForm;
