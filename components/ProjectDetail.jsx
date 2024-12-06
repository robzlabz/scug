import React, { useState } from 'react';
import Image from 'next/image';
import ContributionForm from './ContributionForm';
import UserInfoForm from './UserInfoForm';
import DonationForm from './DonationForm';
import ThankYouModal from './ThankYouModal';

const ProjectDetail = ({ project }) => {
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [donationAmount, setDonationAmount] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? project.images.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === project.images.length - 1 ? 0 : prev + 1));
  };

  const handleContribute = () => {
    setShowContributionForm(true);
    setShowDonationForm(false);
  };

  const handleDonate = () => {
    setShowDonationForm(true);
    setShowContributionForm(false);
  };

  const handleContributionSelect = (dayId, itemId) => {
    setSelectedContribution({ dayId, itemId });
  };

  const handleDonationSelect = (amount) => {
    setDonationAmount(amount);
  };

  const handleSubmitContribution = (name, phoneNumber) => {
    if (selectedContribution) {
      const contribution = {
        projectId: project.id,
        dayId: selectedContribution.dayId,
        itemId: selectedContribution.itemId,
        name,
        phoneNumber,
      };
      console.log('Contribution submitted:', contribution);
      setShowThankYou(true);
    }
  };

  const handleSubmitDonation = (name, phoneNumber) => {
    if (donationAmount) {
      const donation = {
        projectId: project.id,
        amount: donationAmount,
        name,
        phoneNumber,
      };
      console.log('Donation submitted:', donation);
      setShowThankYou(true);
    }
  };

  const handleCancel = () => {
    setShowContributionForm(false);
    setShowDonationForm(false);
    setSelectedContribution(null);
    setDonationAmount(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Image Slider */}
      <div className="relative w-full h-[500px] overflow-hidden rounded-lg mb-8">
        {project.images.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <Image
              src={image}
              alt={`Project image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
        
        {/* Navigation Buttons */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {project.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
        <p className="text-gray-600 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
      </div>

      {showContributionForm ? (
        selectedContribution ? (
          <UserInfoForm onSubmit={handleSubmitContribution} onCancel={handleCancel} />
        ) : (
          <ContributionForm
            investmentDays={project.investmentDays}
            onSelect={handleContributionSelect} />
        )
      ) : showDonationForm ? (
        donationAmount ? (
          <UserInfoForm onSubmit={handleSubmitDonation} onCancel={handleCancel} />
        ) : (
          <DonationForm onSubmit={handleDonationSelect} />
        )
      ) : (
        <div className="flex p-4 border-t">
          <button
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded mr-2"
            onClick={handleDonate}>
            Sumbangan Dana
          </button>
          <button
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded"
            onClick={handleContribute}>
            Kontribusi
          </button>
        </div>
      )}
      <ThankYouModal isOpen={showThankYou} onClose={() => setShowThankYou(false)} />
    </div>
  );
};

export default ProjectDetail;
